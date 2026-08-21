import { getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';

function clean(value, max = 160) {
  return String(value || '').trim().slice(0, max);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;
  const decoded = authorization.decodedToken;

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
        actorRole: 'super_admin',
        authorizationSource: authorization.authorizationSource || 'claim',
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
