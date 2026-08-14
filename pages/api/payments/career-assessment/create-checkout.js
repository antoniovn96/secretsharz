import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin';
import {
  buildRazorpayOrderPayload,
  CAREER_ASSESSMENT_PRODUCT_ID,
  RAZORPAY_PROVIDER,
} from '../../../../src/career/razorpayCareerAssessment';

async function createRazorpayOrder({ keyId, keySecret, payload }) {
  if (!keyId || !keySecret) throw new Error('Razorpay is not configured.');
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.description || 'Razorpay order creation failed.');
  return data;
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
    const attemptSnap = await attemptRef.get();
    if (!attemptSnap.exists) return res.status(404).json({ error: 'Assessment attempt not found.' });

    const attempt = attemptSnap.data();
    if (attempt.personId !== decoded.uid) return res.status(403).json({ error: 'Assessment does not belong to this account.' });
    if (attempt.completed !== true) return res.status(409).json({ error: 'Complete the assessment before purchasing the comprehensive report.' });
    if (attempt.paymentStatus === 'paid') return res.status(409).json({ error: 'This assessment is already unlocked.' });

    if (process.env.RAZORPAY_ENABLED !== 'true') {
      return res.status(503).json({ error: 'Career assessment payment is not enabled yet.' });
    }

    const amount = Number(process.env.RAZORPAY_CAREER_ASSESSMENT_AMOUNT);
    if (!Number.isInteger(amount) || amount <= 0) {
      return res.status(503).json({ error: 'Career assessment price is not configured yet.' });
    }

    const receipt = `career_${assessmentAttemptId}`.slice(0, 40);
    const order = await createRazorpayOrder({
      keyId: process.env.RAZORPAY_KEY_ID,
      keySecret: process.env.RAZORPAY_KEY_SECRET,
      payload: buildRazorpayOrderPayload({
        amount,
        currency: process.env.RAZORPAY_CURRENCY || 'INR',
        receipt,
        personId: decoded.uid,
        assessmentAttemptId,
      }),
    });

    await attemptRef.update({
      paymentStatus: 'checkout_started',
      paymentProvider: RAZORPAY_PROVIDER,
      checkoutOrderId: order.id,
      checkoutProductId: CAREER_ASSESSMENT_PRODUCT_ID,
      checkoutStartedAt: new Date(),
    });

    return res.status(200).json({
      provider: RAZORPAY_PROVIDER,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      productId: CAREER_ASSESSMENT_PRODUCT_ID,
    });
  } catch (error) {
    console.error('career assessment Razorpay order error', error);
    return res.status(500).json({ error: 'Unable to start payment.' });
  }
}
