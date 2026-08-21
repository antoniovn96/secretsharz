import { getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import { requireSuperAdmin, sendAuthorizationFailure } from '../../../src/security/adminAuthorization.js';
import resolveStudentProfile from '../../../src/platform/studentProfileResolver.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const studentId = String(req.query?.studentId || '').trim();
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });

  const authorization = await requireSuperAdmin(req);
  if (sendAuthorizationFailure(res, authorization)) return;

  try {
    const snapshot = await getAdminFirestore().collection('users').doc(studentId).get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student not found.' });

    const rawStudent = { id: snapshot.id, ...snapshot.data() };
    const decoded = authorization.decodedToken;
    const viewer = {
      id: decoded.uid,
      uid: decoded.uid,
      role: 'super_admin',
      profileType: decoded.profileType,
      institutionId: decoded.institutionId || decoded.institutionID,
    };
    const resolved = resolveStudentProfile(rawStudent, viewer);

    if (!resolved.allowed) {
      return res.status(403).json({ error: 'You do not have an authorized relationship with this student.' });
    }

    return res.status(200).json({ studentId, ...resolved });
  } catch (error) {
    console.error('[student-detail] failed:', error);
    return res.status(500).json({ error: 'Unable to load the student profile.' });
  }
}
