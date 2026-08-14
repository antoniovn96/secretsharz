import { getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { verifyWebhookSignature } from '../../../../src/payments/razorpay.js';

export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });

  const rawBody = await readRawBody(req);
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !verifyWebhookSignature(rawBody, signature, secret)) {
    return res.status(400).json({ error: 'Invalid webhook signature.' });
  }

  let event;
  try { event = JSON.parse(rawBody.toString('utf8')); }
  catch (_) { return res.status(400).json({ error: 'Invalid webhook payload.' }); }

  const eventId = event?.id;
  if (!eventId) return res.status(400).json({ error: 'Webhook event id is required.' });

  const db = getAdminFirestore();
  const eventRef = db.collection('razorpayWebhookEvents').doc(eventId);
  const existing = await eventRef.get();
  if (existing.exists) return res.status(200).json({ received: true, duplicate: true });

  await eventRef.create({ event: event.event || null, receivedAt: new Date(), status: 'received' });

  const paymentEntity = event?.payload?.payment?.entity;
  const orderId = paymentEntity?.order_id;
  if (orderId) {
    const matches = await db.collection('payments').where('razorpayOrderId', '==', orderId).limit(1).get();
    if (!matches.empty) {
      const paymentRef = matches.docs[0].ref;
      const nextStatus = event.event === 'payment.captured' ? 'captured'
        : event.event === 'payment.failed' ? 'failed'
        : event.event === 'payment.authorized' ? 'authorized'
        : null;
      if (nextStatus) {
        await paymentRef.set({
          status: nextStatus,
          razorpayPaymentId: paymentEntity.id || null,
          gatewayEventId: eventId,
          updatedAt: new Date(),
          capturedAt: nextStatus === 'captured' ? new Date() : null,
        }, { merge: true });
      }
    }
  }

  return res.status(200).json({ received: true });
}
