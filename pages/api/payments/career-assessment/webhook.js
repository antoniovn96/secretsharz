import crypto from 'node:crypto';
import { getAdminFirestore } from '../../../../src/security/firebaseAdmin';
import {
  CAREER_ASSESSMENT_PRODUCT_ID,
  CAREER_ASSESSMENT_ENTITLEMENT,
  RAZORPAY_PROVIDER,
} from '../../../../src/career/razorpayCareerAssessment';

export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

function verifyWebhookSignature(rawBody, signature, secret) {
  if (!rawBody || !signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'));
  } catch {
    return false;
  }
}

function extractPaymentEvent(event) {
  const payment = event.payload?.payment?.entity;
  const order = event.payload?.order?.entity;
  const paymentId = payment?.id || null;
  const orderId = payment?.order_id || order?.id || null;
  const notes = payment?.notes || order?.notes || {};
  return { payment, paymentId, orderId, notes };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await readRawBody(req);
  const signature = req.headers['x-razorpay-signature'];
  if (!verifyWebhookSignature(rawBody, signature, process.env.RAZORPAY_WEBHOOK_SECRET)) {
    return res.status(400).json({ error: 'Invalid webhook signature.' });
  }

  try {
    const event = JSON.parse(rawBody);
    if (!['payment.captured', 'order.paid'].includes(event.event)) {
      return res.status(200).json({ received: true });
    }

    const { payment, paymentId, orderId, notes } = extractPaymentEvent(event);
    if (payment && payment.status !== 'captured') return res.status(200).json({ received: true });

    if (
      notes.productId !== CAREER_ASSESSMENT_PRODUCT_ID ||
      notes.entitlementType !== CAREER_ASSESSMENT_ENTITLEMENT
    ) {
      return res.status(200).json({ received: true });
    }

    const { personId, assessmentAttemptId } = notes;
    if (!personId || !assessmentAttemptId || !orderId) {
      return res.status(400).json({ error: 'Payment metadata is invalid.' });
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
          type: CAREER_ASSESSMENT_ENTITLEMENT,
          resourceId: assessmentAttemptId,
          status: 'active',
          provider: RAZORPAY_PROVIDER,
          providerReference: orderId,
          paymentReference: paymentId,
          grantedAt: new Date(),
          revokedAt: null,
          expiresAt: null,
        });
      }
      tx.update(attemptRef, {
        paymentStatus: 'paid',
        paymentProvider: RAZORPAY_PROVIDER,
        paymentReference: paymentId || orderId,
        checkoutOrderId: orderId,
        entitlementId,
        paidAt: new Date(),
      });
    });

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('career assessment Razorpay webhook error', error);
    return res.status(500).json({ error: 'Webhook processing failed.' });
  }
}
