import { getAdminAuth, getAdminFirestore } from '../../../../../src/security/firebaseAdmin';
import { buildResult } from '../../../../../src/career/assessmentEngine';
import { canonicalAssessmentQuestionMap } from '../../../../../src/career/assessmentQuestionCatalog';

async function authenticate(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) throw Object.assign(new Error('Authentication required.'), { status: 401 });
  return getAdminAuth().verifyIdToken(authHeader.slice(7), true);
}

export default async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const decoded = await authenticate(req);
    const { attemptId } = req.query;
    const db = getAdminFirestore();
    const attemptRef = db.collection('assessments').doc(attemptId);
    const attemptSnap = await attemptRef.get();

    if (!attemptSnap.exists) return res.status(404).json({ error: 'Assessment attempt not found.' });
    const attempt = attemptSnap.data();
    if (attempt.personId !== decoded.uid) return res.status(403).json({ error: 'Assessment does not belong to this account.' });
    if (attempt.completed !== true) return res.status(409).json({ error: 'Assessment is not complete.' });

    const resultQuery = await db.collection('assessmentResults')
      .where('personId', '==', decoded.uid)
      .where('assessmentAttemptId', '==', attemptId)
      .limit(1)
      .get();

    if (req.method === 'GET') {
      if (resultQuery.empty) return res.status(202).json({ result: null, status: 'processing' });
      return res.status(200).json({ result: { id: resultQuery.docs[0].id, ...resultQuery.docs[0].data() } });
    }

    if (!resultQuery.empty) {
      const existing = resultQuery.docs[0];
      return res.status(200).json({ result: { id: existing.id, ...existing.data() }, reused: true });
    }

    const candidate = {
      status: attempt.status,
      age: attempt.age,
      likes: Array.isArray(attempt.input?.likes) ? attempt.input.likes : [],
      dislikes: Array.isArray(attempt.input?.dislikes) ? attempt.input.dislikes : [],
      goals: Array.isArray(attempt.input?.goals) ? attempt.input.goals : [],
      favouriteSubjects: Array.isArray(attempt.input?.favouriteSubjects) ? attempt.input.favouriteSubjects : [],
      marks: attempt.input?.marks && typeof attempt.input.marks === 'object' ? attempt.input.marks : {},
    };

    const normalizedAttempt = {
      ...attempt,
      candidate,
      resultAccess: attempt.paymentStatus === 'paid' ? 'full' : 'partial',
    };

    const result = buildResult({
      attempt: normalizedAttempt,
      questionMap: canonicalAssessmentQuestionMap,
    });

    const resultRef = db.collection('assessmentResults').doc();
    const storedResult = {
      ...result,
      personId: decoded.uid,
      assessmentAttemptId: attemptId,
      createdAt: new Date(),
    };
    await resultRef.set(storedResult);

    return res.status(201).json({ result: { id: resultRef.id, ...storedResult } });
  } catch (error) {
    console.error('career assessment result error', error);
    return res.status(error.status || 500).json({ error: error.message || 'Unable to process assessment result.' });
  }
}
