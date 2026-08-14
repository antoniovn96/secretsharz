import { getAdminAuth, getAdminFirestore } from '../../../../../src/security/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = await getAdminAuth().verifyIdToken(authHeader.slice(7), true);
    const { attemptId } = req.query;
    const db = getAdminFirestore();
    const attemptSnap = await db.collection('assessments').doc(attemptId).get();
    if (!attemptSnap.exists) return res.status(404).json({ error: 'Assessment attempt not found.' });
    const attempt = attemptSnap.data();
    if (attempt.personId !== decoded.uid) return res.status(403).json({ error: 'Assessment does not belong to this account.' });
    if (attempt.completed !== true) return res.status(409).json({ error: 'Assessment is not complete.' });

    const resultSnap = await db.collection('assessmentResults').where('personId', '==', decoded.uid).where('assessmentAttemptId', '==', attemptId).limit(1).get();
    if (resultSnap.empty) return res.status(202).json({ result: null, status: 'processing' });
    return res.status(200).json({ result: { id: resultSnap.docs[0].id, ...resultSnap.docs[0].data() } });
  } catch (error) {
    console.error('career assessment result error', error);
    return res.status(500).json({ error: 'Unable to load assessment result.' });
  }
}
