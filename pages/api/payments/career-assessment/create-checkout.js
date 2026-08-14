import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin';
import { createStripeCheckoutSession, CAREER_ASSESSMENT_PRODUCT_ID } from '../../../src/career/stripeCareerAssessment';

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
    const attemptSnap = await attemptRef.get();
    if (!attemptSnap.exists) return res.status(404).json({ error: 'Assessment attempt not found.' });

    const attempt = attemptSnap.data();
    if (attempt.personId !== decoded.uid) return res.status(403).json({ error: 'Assessment does not belong to this account.' });
    if (attempt.completed !== true) return res.status(409).json({ error: 'Complete the assessment before purchasing the comprehensive report.' });
    if (attempt.paymentStatus === 'paid') return res.status(409).json({ error: 'This assessment is already unlocked.' });

    const priceId = process.env.STRIPE_CAREER_ASSESSMENT_PRICE_ID;
    if (!priceId) return res.status(503).json({ error: 'Career assessment payment is not configured yet.' });

    const origin = process.env.NEXT_PUBLIC_APP_URL || `https://${req.headers.host}`;
    const session = await createStripeCheckoutSession({
      secretKey: process.env.STRIPE_SECRET_KEY,
      priceId,
      personId: decoded.uid,
      assessmentAttemptId,
      successUrl: `${origin}/?payment=career-assessment-success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/?payment=career-assessment-cancelled`,
    });

    await attemptRef.update({
      paymentStatus: 'checkout_started',
      checkoutSessionId: session.id,
      checkoutProductId: CAREER_ASSESSMENT_PRODUCT_ID,
      checkoutStartedAt: new Date(),
    });

    return res.status(200).json({ checkoutUrl: session.url, sessionId: session.id });
  } catch (error) {
    console.error('career assessment checkout error', error);
    return res.status(500).json({ error: 'Unable to start payment.' });
  }
}
