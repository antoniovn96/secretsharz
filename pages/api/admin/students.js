import { getAdminAuth, getAdminFirestore, getAdminApp } from '../../../src/security/firebaseAdmin.js';
import { isStudentProfile } from '../../../src/platform/studentRecordModel.js';
import { toAdminStudentDirectoryRecord } from '../../../src/platform/adminStudentDirectory.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function safeAuthError(error) {
  return {
    code: error?.code || null,
    message: error?.message || 'Unknown Firebase Auth verification error',
    expectedProjectId: getAdminApp()?.options?.projectId || null,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const idToken = bearerToken(req);
  if (!idToken) return res.status(401).json({ error: 'Authentication required.' });

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (error) {
    console.error('[admin students auth] Firebase ID token verification failed:', safeAuthError(error));
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }

  const isFounder = decodedToken.email_verified === true && decodedToken.email === 'antonio.antonio.noronha@gmail.com';
  const isSuperAdmin = decodedToken.role === 'super_admin';
  if (!isFounder && !isSuperAdmin) return res.status(403).json({ error: 'Super Admin access required.' });

  try {
    const snapshot = await getAdminFirestore().collection('users').get();
    const students = snapshot.docs
      .filter(doc => isStudentProfile(doc.data() || {}))
      .map(doc => toAdminStudentDirectoryRecord(doc.data() || {}, doc.id))
      .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      students,
      count: students.length,
    });
  } catch (error) {
    console.error('[admin students] failed:', error);
    return res.status(500).json({ error: 'Unable to load the student directory.' });
  }
}
