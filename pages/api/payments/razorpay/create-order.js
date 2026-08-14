import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { createRazorpayOrder, getProduct } from '../../../../src/payments/razorpay.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

function error(res, status, message) {
  return res.status(status).json({ error: message });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return error(res, 405, 'Method not allowed.');
  }

  const token = bearerToken(req);
  if (!token) return error(res, 401, 'Authentication required.');

  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(token);
  } catch (_) {
    return error(res, 401, 'Invalid or expired authentication token.');
  }

  const productId = req.body?.productId;
  try {
    const product = getProduct(productId);
    const db = getAdminFirestore();
    const paymentRef = db.collection('payments').doc();
    const receipt = `ss_${paymentRef.id}`;

    const order = await createRazorpayOrder({
      productId,
      receipt,
      notes: { userId: decoded.uid, paymentRecordId: paymentRef.id, productId },
    });

    await paymentRef.set({
      userId: decoded.uid,
      productId: product.id,
      productName: product.name,
      amount: product.amount,
      currency: product.currency,
      status: 'created',
      gateway: 'razorpay',
      razorpayOrderId: order.id,
      receipt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.status(200).json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: product.amount,
      currency: product.currency,
      name: 'Secret Sharz / VidyaVantage',
      description: product.name,
      paymentRecordId: paymentRef.id,
    });
  } catch (err) {
    console.error('[razorpay/create-order]', err?.message || err);
    return error(res, 400, err?.message || 'Unable to create payment order.');
  }
}
