import crypto from 'node:crypto';

export const CAREER_ASSESSMENT_PRODUCT_ID = 'career-assessment-comprehensive-v1';
export const CAREER_ASSESSMENT_ENTITLEMENT = 'career_assessment_full';
export const RAZORPAY_PROVIDER = 'razorpay';

export function buildRazorpayOrderPayload({ amount, currency = 'INR', receipt, personId, assessmentAttemptId }) {
  if (!Number.isInteger(amount) || amount <= 0) throw new Error('Razorpay amount must be a positive integer in the smallest currency unit.');
  if (!receipt || !personId || !assessmentAttemptId) throw new Error('Razorpay order identifiers are required.');

  return {
    amount,
    currency,
    receipt,
    notes: {
      productId: CAREER_ASSESSMENT_PRODUCT_ID,
      entitlementType: CAREER_ASSESSMENT_ENTITLEMENT,
      personId,
      assessmentAttemptId,
    },
  };
}

export function verifyRazorpayPaymentSignature({ orderId, paymentId, signature, secret }) {
  if (!orderId || !paymentId || !signature || !secret) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`, 'utf8').digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(signature, 'utf8'));
  } catch {
    return false;
  }
}

export function buildRazorpayCheckoutOptions({ keyId, orderId, amount, currency = 'INR', name = 'Secret Sharz', description, prefill, notes }) {
  if (!keyId || !orderId || !amount) throw new Error('Razorpay checkout configuration is incomplete.');
  return {
    key: keyId,
    order_id: orderId,
    amount,
    currency,
    name,
    description,
    prefill,
    notes,
    theme: { color: '#111827' },
  };
}
