import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { buildMigratedStudentRecord } from '../../../src/platform/studentMigration.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function isAdminLike(decoded) {
  return decoded?.role === 'super_admin' || decoded?.role === 'admin';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    console.error('[student-migrate-profile] token verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const requestedStudentId = String(req.body?.studentId || '').trim();
  const studentId = requestedStudentId || decoded.uid;
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });

  if (studentId !== decoded.uid && !isAdminLike(decoded)) {
    return res.status(403).json({ error: 'You may only migrate your own student profile.' });
  }

  try {
    const db = getAdminFirestore();
    const ref = db.collection('users').doc(studentId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student profile not found.' });

    const rawStudent = { id: snapshot.id, ...snapshot.data() };
    const studentProfile = buildMigratedStudentRecord(rawStudent);
    const migrationKey = studentProfile.migration?.idempotencyKey;

    await ref.set({
      studentProfile,
      migration: {
        status: 'completed',
        schemaVersion: studentProfile.schemaVersion,
        idempotencyKey: migrationKey,
        updatedAt: new Date().toISOString(),
      },
    }, { merge: true });

    return res.status(200).json({
      ok: true,
      studentId,
      migrated: true,
      idempotencyKey: migrationKey,
      studentProfile,
    });
  } catch (error) {
    console.error('[student-migrate-profile] migration failed:', error);
    return res.status(500).json({ error: 'Unable to migrate the student profile.' });
  }
}
