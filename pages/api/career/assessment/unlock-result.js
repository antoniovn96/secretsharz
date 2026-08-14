import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin';
import { buildResult } from '../../../../src/career/assessmentEngine';
import { canonicalAssessmentQuestionMap } from '../../../../src/career/assessmentQuestionCatalog';

function buildCandidate(attempt) {
  return {
    status: attempt.status,
    age: attempt.age,
    likes: Array.isArray(attempt.input?.likes) ? attempt.input.likes : [],
    dislikes: Array.isArray(attempt.input?.dislikes) ? attempt.input.dislikes : [],
    goals: Array.isArray(attempt.input?.goals) ? attempt.input.goals : [],
    favouriteSubjects: Array.isArray(attempt.input?.favouriteSubjects) ? attempt.input.favouriteSubjects : [],
    marks: attempt.input?.marks && typeof attempt.input.marks === 'object' ? attempt.input.marks : {},
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Authentication required.' });
    const decoded = await getAdminAuth().verifyIdToken(authHeader.slice(7), true);
    const { assessmentAttemptId } = req.body || {};
    if (!assessmentAttemptId || typeof assessmentAttemptId !== 'string') {
      return res.status(400).json({ error: 'assessmentAttemptId is required.' });
    }

    const db = getAdminFirestore();
    const attemptRef = db.collection('assessments').doc(assessmentAttemptId);
    const resultRef = db.collection('assessmentResults').doc(assessmentAttemptId);
    const attemptSnap = await attemptRef.get();

    if (!attemptSnap.exists) return res.status(404).json({ error: 'Assessment attempt not found.' });
    const attempt = attemptSnap.data();
    if (attempt.personId !== decoded.uid) return res.status(403).json({ error: 'Assessment does not belong to this account.' });
    if (attempt.completed !== true) return res.status(409).json({ error: 'Assessment is not complete.' });
    if (attempt.paymentStatus !== 'paid') return res.status(409).json({ error: 'Payment has not been confirmed yet.' });

    const candidate = buildCandidate(attempt);
    const result = buildResult({
      attempt: { ...attempt, candidate, resultAccess: 'full' },
      questionMap: canonicalAssessmentQuestionMap,
    });
    const storedResult = {
      ...result,
      personId: decoded.uid,
      assessmentAttemptId,
      createdAt: new Date(),
    };

    await resultRef.set(storedResult, { merge: false });
    return res.status(200).json({ result: { id: assessmentAttemptId, ...storedResult } });
  } catch (error) {
    console.error('career assessment unlock result error', error);
    return res.status(error.status || 500).json({ error: error.message || 'Unable to unlock the comprehensive report.' });
  }
}
