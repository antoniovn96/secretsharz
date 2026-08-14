import { getAdminAuth, getAdminFirestore } from '../../../../src/security/firebaseAdmin.js';
import { getRazorpayConfig, verifyCheckoutSignature } from '../../../../src/payments/razorpay.js';

function bearerToken(req) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (typeof header !== 'string') return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const token = bearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  let decoded;
  try { decoded = await getAdminAuth().verifyIdToken(token); }
  catch (_) { return res.status(401).json({ error: 'Invalid or expired authentication token.' }); }

  const { paymentRecordId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body || {};
  if (!paymentRecordId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
    return res.status(400).json({ error: 'Incomplete payment verification data.' });
  }

  const db = getAdminFirestore();
  const paymentRef = db.collection('payments').doc(paymentRecordId);
  const snapshot = await paymentRef.get();
  if (!snapshot.exists || snapshot.data()?.userId !== decoded.uid) return res.status(404).json({ error: 'Payment record not found.' });

  const payment = snapshot.data();
  if (payment.razorpayOrderId !== razorpayOrderId) return res.status(400).json({ error: 'Order mismatch.' });

  const { keySecret } = getRazorpayConfig();
  const valid = verifyCheckoutSignature({ orderId: payment.razorpayOrderId, paymentId: razorpayPaymentId, signature: razorpaySignature, keySecret });
  if (!valid) return res.status(400).json({ error: 'Payment signature verification failed.' });

  await paymentRef.set({
    status: 'signature_verified',
    razorpayPaymentId,
    razorpaySignature,
    updatedAt: new Date(),
  }, { merge: true });

  return res.status(200).json({ verified: true, status: 'signature_verified' });
}
