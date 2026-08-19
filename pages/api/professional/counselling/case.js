import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { resolveDomainRelationship } from '../../../../src/security/relationshipResolver.js';

function adminApp() {
  // Reuse the application's existing Firebase Admin initialization.
  // eslint-disable-next-line global-require
  return require('../../../../src/firebaseAdmin').admin;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required' });
    const token = header.slice(7);
    const app = adminApp();
    const decoded = await getAuth(app).verifyIdToken(token);
    const studentId = String(req.query.studentId || '');
    if (!studentId) return res.status(400).json({ error: 'studentId is required' });

    const db = getFirestore(app);
    const requesterId = decoded.uid;
    const isAdmin = decoded.role === 'super_admin';
    const relationship = await resolveDomainRelationship({ db, subjectPersonId: studentId, relatedPersonId: requesterId, domain: 'counselling' });
    if (!isAdmin && !relationship.allowed) return res.status(403).json({ error: 'Counselling relationship not authorised' });

    const studentSnap = await db.collection('users').doc(studentId).get();
    if (!studentSnap.exists) return res.status(404).json({ error: 'Student not found' });
    const student = studentSnap.data() || {};

    return res.status(200).json({
      student: {
        id: studentId,
        name: student.name || null,
        grade: student.grade || null,
        schoolName: student.schoolName || null,
      },
      authorization: { source: relationship.source, migrationFallback: Boolean(relationship.migrationFallback) },
    });
  } catch (error) {
    console.error('Counselling case access error:', error);
    return res.status(401).json({ error: 'Unable to authorise counselling case access' });
  }
}
