import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';
import resolveStudentProfile from '../../../src/platform/studentProfileResolver.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const studentId = String(req.query?.studentId || '').trim();
  if (!studentId) return res.status(400).json({ error: 'studentId is required.' });

  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  let viewer;
  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    const isFounder = decoded.email_verified === true && decoded.email === 'antonio.antonio.noronha@gmail.com';
    viewer = {
      id: decoded.uid,
      uid: decoded.uid,
      role: isFounder ? 'super_admin' : (decoded.role || decoded.userRole || decoded.profileType),
      profileType: decoded.profileType,
      institutionId: decoded.institutionId || decoded.institutionID,
    };
  } catch (error) {
    console.error('[student-detail] token verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  try {
    const snapshot = await getAdminFirestore().collection('users').doc(studentId).get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student not found.' });

    const rawStudent = { id: snapshot.id, ...snapshot.data() };
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
