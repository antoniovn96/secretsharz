import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile } from '../../../src/platform/studentRecordModel.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization || '';
  return header.startsWith('Bearer ') ? header.slice(7) : null;
}

function isSuperAdmin(decoded = {}) {
  return decoded.role === 'super_admin' || (decoded.email_verified === true && decoded.email === 'antonio.antonio.noronha@gmail.com');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  if (!isSuperAdmin(decoded)) return res.status(403).json({ error: 'Super Admin access required.' });

  const studentId = String(req.body?.studentId || '').trim();
  const confirmationName = String(req.body?.confirmationName || '').trim();
  if (!studentId || !confirmationName) return res.status(400).json({ error: 'Student ID and confirmation name are required.' });

  try {
    const db = getAdminFirestore();
    const ref = db.collection('users').doc(studentId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student not found.' });

    const raw = snapshot.data() || {};
    if (!isStudentProfile(raw)) return res.status(400).json({ error: 'The target record is not a student profile.' });
    const name = String(raw.name || raw.fullName || raw.studentProfile?.identity?.fullName || '').trim();
    if (!name || name.toLowerCase() !== confirmationName.toLowerCase()) return res.status(400).json({ error: 'Confirmation name does not match the student record.' });
    if (raw.status === 'archived' || raw.lifecycleStatus === 'archived' || raw.archivedAt) return res.status(409).json({ error: 'Student is already archived.' });

    const now = new Date().toISOString();
    const auditRef = db.collection('auditEvents').doc();
    const batch = db.batch();
    batch.set(ref, {
      status: 'archived',
      lifecycleStatus: 'archived',
      archivedAt: now,
      archivedBy: decoded.uid,
      updatedAt: now,
    }, { merge: true });
    batch.set(auditRef, {
      eventType: 'student_archived',
      actorId: decoded.uid,
      actorRole: 'super_admin',
      resourceType: 'student',
      resourceId: studentId,
      purpose: 'administration',
      outcome: 'success',
      timestamp: now,
    });
    await batch.commit();

    return res.status(200).json({ ok: true, studentId, status: 'archived' });
  } catch (error) {
    console.error('[archive-student] failed:', error);
    return res.status(500).json({ error: 'Unable to archive the student record.' });
  }
}
