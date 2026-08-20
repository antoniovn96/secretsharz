import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile } from '../../../src/platform/studentRecordModel.js';
import { normalizeStudentRecord } from '../../../src/platform/studentRecordNormalizer.js';

const SERVICE_PATHS = new Set(['career', 'wellbeing', 'sen']);

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
  const service = String(req.body?.service || '').trim().toLowerCase();
  if (!studentId || !confirmationName || !SERVICE_PATHS.has(service)) {
    return res.status(400).json({ error: 'Student ID, confirmation name, and a valid service are required.' });
  }

  try {
    const db = getAdminFirestore();
    const ref = db.collection('users').doc(studentId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student not found.' });

    const raw = snapshot.data() || {};
    if (!isStudentProfile(raw)) return res.status(400).json({ error: 'The target record is not a student profile.' });

    const normalized = normalizeStudentRecord(raw, studentId);
    if (normalized.services?.[service]?.status !== 'active') {
      return res.status(409).json({ error: `Student is not actively enrolled in the ${service} service.` });
    }

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
      service,
      purpose: 'administration',
      outcome: 'success',
      timestamp: now,
    });
    await batch.commit();

    return res.status(200).json({ ok: true, studentId, service, status: 'archived' });
  } catch (error) {
    console.error('[archive-student] failed:', error);
    return res.status(500).json({ error: 'Unable to archive the student record.' });
  }
}
