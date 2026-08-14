import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed.' });
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = await getAdminAuth().verifyIdToken(authHeader.slice(7), true);
    const db = getAdminFirestore();
    const snap = await db.collection('assessments').where('personId', '==', decoded.uid).limit(10).get();
    const attempts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => String(b.lastSavedAt || b.createdAt || '').localeCompare(String(a.lastSavedAt || a.createdAt || '')));
    const attempt = attempts.find(item => item.completed !== true) || attempts[0] || null;
    let result = null;
    if (attempt?.completed) {
      const resultSnap = await db.collection('assessmentResults').where('personId', '==', decoded.uid).where('assessmentAttemptId', '==', attempt.attemptId || attempt.id).limit(1).get();
      if (!resultSnap.empty) result = { id: resultSnap.docs[0].id, ...resultSnap.docs[0].data() };
    }
    return res.status(200).json({ attempt, result });
  } catch (error) {
    console.error('career assessment current error', error);
    return res.status(500).json({ error: 'Unable to load career assessment.' });
  }
}
