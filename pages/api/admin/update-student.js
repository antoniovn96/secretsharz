import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';
import { mergeCanonicalStudentProfile } from '../../../src/platform/studentProfileWriteAdapter.js';
import { isStudentProfile } from '../../../src/platform/studentRecordModel.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

function isSuperAdmin(decoded = {}) {
  return decoded.role === 'super_admin' || (decoded.email_verified === true && decoded.email === 'antonio.antonio.noronha@gmail.com');
}

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); }
  catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }
  if (!isSuperAdmin(decoded)) return res.status(403).json({ error: 'Super Admin access required.' });

  const studentId = String(req.body?.studentId || '').trim();
  const input = req.body?.profile;
  if (!studentId || !input || typeof input !== 'object' || Array.isArray(input)) return res.status(400).json({ error: 'studentId and profile are required.' });

  try {
    const db = getAdminFirestore();
    const ref = db.collection('users').doc(studentId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student not found.' });
    const raw = { id: snapshot.id, ...snapshot.data() };
    if (!isStudentProfile(raw)) return res.status(400).json({ error: 'The target record is not a student profile.' });

    const existing = raw.studentProfile || normalizeStudentRecord(raw, studentId);
    const nextProfile = mergeCanonicalStudentProfile({ ...existing, id: studentId }, input);
    const now = new Date().toISOString();

    await ref.set({
      studentProfile: nextProfile,
      updatedAt: now,
    }, { merge: true });

    await db.collection('auditEvents').add({
      eventType: 'student_profile_updated',
      actorId: decoded.uid,
      actorRole: 'super_admin',
      resourceType: 'student',
      resourceId: studentId,
      purpose: 'administration',
      outcome: 'success',
      changedDomains: Object.keys(input),
      timestamp: now,
    });

    return res.status(200).json({ ok: true, studentId, studentProfile: nextProfile });
  } catch (error) {
    console.error('[admin update-student] failed:', error);
    return res.status(500).json({ error: 'Unable to update the student profile.' });
  }
}
