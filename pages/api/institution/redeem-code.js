import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function clean(value, max = 120) { return String(value || '').trim().slice(0, max); }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); }
  catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }

  const code = clean(req.body?.code, 120).toUpperCase();
  if (!code) return res.status(400).json({ error: 'Please enter your institutional access code.' });

  const db = getAdminFirestore();
  const codeRef = db.collection('institutionCodes').doc(code);
  const codeSnap = await codeRef.get();
  if (!codeSnap.exists) return res.status(404).json({ error: 'This access code was not found.' });
  const record = codeSnap.data();
  if (record.status !== 'available') return res.status(409).json({ error: 'This access code has already been used or is no longer active.' });

  const rosterRef = db.collection('institutions').doc(record.institutionId).collection('roster').doc(record.rosterId);
  const now = new Date().toISOString();
  const batch = db.batch();
  batch.update(codeRef, { status: 'redeemed', redeemedBy: decoded.uid, redeemedAt: now });
  batch.set(rosterRef, { status: 'claimed', claimedBy: decoded.uid, claimedAt: now, assessmentStatus: 'not_started', reportStatus: 'locked_until_completion' }, { merge: true });
  batch.set(db.collection('users').doc(decoded.uid), {
    institutionId: record.institutionId,
    institutionName: record.institutionName,
    institutionRosterId: record.rosterId,
    institutionAccessCode: code,
    institutionAccess: { type: 'licensed_assessment', status: 'active', grantedAt: now },
  }, { merge: true });
  await batch.commit();

  const rosterSnap = await rosterRef.get();
  const student = rosterSnap.exists ? rosterSnap.data() : {};
  return res.status(200).json({ success: true, institution: { id: record.institutionId, name: record.institutionName }, student: { fullName: student.fullName || '', className: student.className || '', section: student.section || '' } });
}
