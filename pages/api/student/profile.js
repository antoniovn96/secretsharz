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

  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    console.error('[student-profile] token verification failed:', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const requestedStudentId = String(req.query?.studentId || '').trim();
  const studentId = requestedStudentId || decoded.uid;
  const role = decoded.role || decoded.userRole || decoded.profileType;
  const isAdmin = role === 'admin' || role === 'super_admin';

  if (studentId !== decoded.uid && !isAdmin) {
    return res.status(403).json({ error: 'You may only load your own student profile.' });
  }

  try {
    const snapshot = await getAdminFirestore().collection('users').doc(studentId).get();
    if (!snapshot.exists) return res.status(404).json({ error: 'Student profile not found.' });

    const rawStudent = { id: snapshot.id, ...snapshot.data() };
    const resolved = resolveStudentProfile(rawStudent, {
      id: decoded.uid,
      uid: decoded.uid,
      role,
      profileType: decoded.profileType,
      institutionId: decoded.institutionId || decoded.institutionID,
      institutionRole: decoded.institutionRole,
    });

    if (!resolved.allowed) {
      return res.status(403).json({ error: 'You do not have an authorized relationship with this student.' });
    }

    return res.status(200).json({ studentId, ...resolved });
  } catch (error) {
    console.error('[student-profile] load failed:', error);
    return res.status(500).json({ error: 'Unable to load the student profile.' });
  }
}
