import crypto from 'crypto';
import { getAdminAuth, getAdminFirestore } from '../../../src/security/firebaseAdmin.js';

function jsonError(res, status, message) {
  return res.status(status).json({ error: message });
}

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return jsonError(res, 405, 'Method not allowed.');
  }

  const idToken = bearerToken(req);
  if (!idToken) return jsonError(res, 401, 'Authentication required.');

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return jsonError(res, 503, 'Payment gateway is not configured yet.');

  let decodedToken;
  try {
    decodedToken = await getAdminAuth().verifyIdToken(idToken);
  } catch (_) {
    return jsonError(res, 401, 'Invalid or expired authentication token.');
  }

  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature
  } = req.body || {};

  if (!orderId || !paymentId || !signature) {
    return jsonError(res, 400, 'Incomplete payment verification data.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const provided = Buffer.from(String(signature));
  const expected = Buffer.from(expectedSignature);
  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return jsonError(res, 400, 'Payment signature verification failed.');
  }

  try {
    const authHeader = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const orderResponse = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
      headers: { Authorization: `Basic ${authHeader}` }
    });
    const order = await orderResponse.json();

    if (!orderResponse.ok) {
      console.error('[career/verify-payment] order lookup failed:', order);
      return jsonError(res, 502, 'Unable to verify the payment order with Razorpay.');
    }

    const configuredAmount = Number(
      process.env.RAZORPAY_CAREER_ASSESSMENT_AMOUNT_PAISE ||
      process.env.CAREER_REPORT_PRICE_PAISE ||
      99900
    );
    if (order.id !== orderId || order.currency !== 'INR' || Number(order.amount) !== configuredAmount) {
      return jsonError(res, 400, 'Payment order does not match the career report configuration.');
    }

    if (order.notes?.uid !== decodedToken.uid || order.notes?.product !== 'career_full_report') {
      return jsonError(res, 403, 'Payment order is not associated with this account.');
    }

    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
      headers: { Authorization: `Basic ${authHeader}` }
    });
    const payment = await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error('[career/verify-payment] payment lookup failed:', payment);
      return jsonError(res, 502, 'Unable to verify the payment with Razorpay.');
    }

    if (payment.order_id !== orderId || payment.currency !== 'INR' || Number(payment.amount) !== configuredAmount) {
      return jsonError(res, 400, 'Payment details do not match the career report order.');
    }

    if (String(payment.status) !== 'captured') {
      return jsonError(res, 400, 'Payment has not been successfully captured.');
    }

    const db = getAdminFirestore();
    await db.collection('users').doc(decodedToken.uid).set({
      careerReportAccess: {
        status: 'paid',
        product: 'career_full_report',
        orderId,
        paymentId,
        amount: Number(payment.amount),
        currency: payment.currency,
        paidAt: new Date().toISOString()
      }
    }, { merge: true });

    return res.status(200).json({
      verified: true,
      access: 'paid',
      paymentId,
      orderId
    });
  } catch (err) {
    console.error('[career/verify-payment] failed:', err?.message || err);
    return jsonError(res, 500, 'Payment verification failed.');
  }
}
