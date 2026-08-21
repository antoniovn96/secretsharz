import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function clean(value, max = 160) {
  return String(value || '').trim().slice(0, max);
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

  const isFounder = decoded.email_verified === true && decoded.email === 'antonio.antonio.noronha@gmail.com';
  const isSuperAdmin = decoded.role === 'super_admin';
  if (!isFounder && !isSuperAdmin) return res.status(403).json({ error: 'Super Admin access required.' });

  const studentId = clean(req.body?.studentId, 128);
  const confirmationName = clean(req.body?.confirmationName, 180);
  if (!studentId) return res.status(400).json({ error: 'Student ID is required.' });

  try {
    const db = getAdminFirestore();
    const ref = db.collection('users').doc(studentId);
    const snapshot = await ref.get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student record not found.' });

    const data = snapshot.data() || {};
    const name = clean(data.name || data.fullName || '');
    if (!name) return res.status(409).json({ error: 'Student record has no valid name for confirmation.' });
    if (confirmationName.toLowerCase() !== name.toLowerCase()) {
      return res.status(400).json({ error: 'Confirmation name does not match the student record.' });
    }

    await ref.delete();

    try {
      await db.collection('auditEvents').add({
        actorUid: decoded.uid || null,
        actorEmail: decoded.email || null,
        actorRole: isFounder ? 'founder' : 'super_admin',
        targetUid: studentId,
        targetRole: 'student',
        action: 'delete_student_directory_record',
        createdAt: new Date().toISOString()
      });
    } catch (auditError) {
      console.error('[delete-student] audit write failed:', auditError?.message || auditError);
    }

    return res.status(200).json({ success: true, studentId, name });
  } catch (error) {
    console.error('[delete-student] failed:', error?.message || error);
    return res.status(500).json({ error: 'Unable to delete the student record.' });
  }
}
