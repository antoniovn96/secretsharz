import { getAdminFirestore } from '../../../../src/security/firebaseAdmin';
import { verifyStripeWebhookSignature, CAREER_ASSESSMENT_PRODUCT_ID } from '../../../../src/career/stripeCareerAssessment';

export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await readRawBody(req);
  const signature = req.headers['stripe-signature'];
  if (!verifyStripeWebhookSignature(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)) {
    return res.status(400).json({ error: 'Invalid webhook signature.' });
  }

  try {
    const event = JSON.parse(rawBody);
    if (event.type !== 'checkout.session.completed') return res.status(200).json({ received: true });

    const session = event.data?.object || {};
    const metadata = session.metadata || {};
    if (metadata.productId !== CAREER_ASSESSMENT_PRODUCT_ID || metadata.entitlementType !== 'career_assessment_full') {
      return res.status(200).json({ received: true });
    }

    const { personId, assessmentAttemptId } = metadata;
    if (!personId || !assessmentAttemptId || session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment metadata or payment status is invalid.' });
    }

    const db = getAdminFirestore();
    const entitlementId = `${personId}_${assessmentAttemptId}`;
    const entitlementRef = db.collection('assessmentEntitlements').doc(entitlementId);
    const attemptRef = db.collection('assessments').doc(assessmentAttemptId);

    await db.runTransaction(async (tx) => {
      const attemptSnap = await tx.get(attemptRef);
      if (!attemptSnap.exists) throw new Error('Assessment attempt not found.');
      const attempt = attemptSnap.data();
      if (attempt.personId !== personId) throw new Error('Assessment owner mismatch.');
      if (attempt.completed !== true) throw new Error('Assessment is not complete.');

      const existing = await tx.get(entitlementRef);
      if (!existing.exists) {
        tx.set(entitlementRef, {
          personId,
          type: 'career_assessment_full',
          resourceId: assessmentAttemptId,
          status: 'active',
          provider: 'stripe',
          providerReference: session.id,
          paymentIntentId: session.payment_intent || null,
          grantedAt: new Date(),
          revokedAt: null,
          expiresAt: null,
        });
      }
      tx.update(attemptRef, {
        paymentStatus: 'paid',
        paymentProvider: 'stripe',
        paymentReference: session.id,
        entitlementId,
        paidAt: new Date(),
      });
    });

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('career assessment webhook error', error);
    return res.status(500).json({ error: 'Webhook processing failed.' });
  }
}
