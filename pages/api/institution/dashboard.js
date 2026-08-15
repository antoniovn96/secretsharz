import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

const FOUNDER_EMAIL = 'antonio.antonio.noronha@gmail.com';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); }
  catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }

  const db = getAdminFirestore();
  let userData = {};
  try {
    const snap = await db.collection('users').doc(decoded.uid).get();
    userData = snap.exists ? snap.data() : {};
  } catch (_) {}

  const isFounder = decoded.email_verified === true && decoded.email?.toLowerCase() === FOUNDER_EMAIL;
  const institutionId = String(req.query?.institutionId || userData.institutionId || '').trim();
  if (!institutionId) return res.status(400).json({ error: 'Institution ID is required.' });
  if (!isFounder && !(userData.role === 'institution_member' && userData.institutionId === institutionId)) {
    return res.status(403).json({ error: 'Institution access required.' });
  }

  const institutionSnap = await db.collection('institutions').doc(institutionId).get();
  if (!institutionSnap.exists) return res.status(404).json({ error: 'Institution not found.' });
  const institution = institutionSnap.data();
  const paidEntitlement = institution.licenses?.paymentStatus === 'paid';
  const rosterSnap = await db.collection('institutions').doc(institutionId).collection('roster').orderBy('createdAt', 'desc').limit(2000).get();

  const students = rosterSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      fullName: data.fullName || '',
      className: data.className || '',
      section: data.section || '',
      rollNumber: data.rollNumber || '',
      accessCode: paidEntitlement || isFounder ? (data.accessCode || '') : '',
      accessCodeAvailable: paidEntitlement || isFounder,
      status: data.status || 'unclaimed',
      assessmentStatus: data.assessmentStatus || 'not_started',
      reportStatus: data.reportStatus || 'locked_until_completion',
      claimedBy: data.claimedBy || null,
      claimedAt: data.claimedAt || null,
      updatedAt: data.updatedAt || null,
    };
  });

  const summary = {
    total: students.length,
    claimed: students.filter(s => s.status === 'claimed').length,
    started: students.filter(s => ['in_progress','completed'].includes(s.assessmentStatus)).length,
    completed: students.filter(s => s.assessmentStatus === 'completed').length,
    reportsReady: students.filter(s => s.reportStatus === 'ready').length,
  };

  return res.status(200).json({
    institution: {
      id: institutionId,
      name: institution.name,
      tenantCode: institution.tenantCode,
      status: institution.status || 'pending',
      paymentStatus: institution.licenses?.paymentStatus || 'pending',
      licenses: institution.licenses || {},
      coordinator: institution.coordinator || null,
    },
    students,
    summary,
  });
}
