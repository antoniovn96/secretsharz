import crypto from 'node:crypto';

export const CAREER_ASSESSMENT_PRODUCT_ID = 'career-assessment-comprehensive-v1';

function encodeFormValue(value) {
  return encodeURIComponent(String(value)).replace(/%20/g, '+');
}

export function buildStripeCheckoutForm({ priceId, personId, assessmentAttemptId, successUrl, cancelUrl }) {
  const fields = {
    mode: 'payment',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: successUrl,
    cancel_url: cancelUrl,
    'metadata[productId]': CAREER_ASSESSMENT_PRODUCT_ID,
    'metadata[personId]': personId,
    'metadata[assessmentAttemptId]': assessmentAttemptId,
    'metadata[entitlementType]': 'career_assessment_full',
  };
  return Object.entries(fields).map(([key, value]) => `${encodeFormValue(key)}=${encodeFormValue(value)}`).join('&');
}

export async function createStripeCheckoutSession({ secretKey, ...args }) {
  if (!secretKey) throw new Error('STRIPE_SECRET_KEY is not configured.');
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: buildStripeCheckoutForm(args),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || 'Stripe checkout session creation failed.');
  return payload;
}

export function verifyStripeWebhookSignature(rawBody, signature, secret, toleranceSeconds = 300) {
  if (!rawBody || !signature || !secret) return false;
  const parts = signature.split(',').reduce((acc, item) => {
    const [key, value] = item.split('=', 2);
    if (key && value) acc[key] = acc[key] ? [].concat(acc[key], value) : value;
    return acc;
  }, {});
  const timestamp = Number(parts.t);
  const signatures = Array.isArray(parts.v1) ? parts.v1 : [parts.v1].filter(Boolean);
  if (!Number.isFinite(timestamp) || Math.abs(Math.floor(Date.now() / 1000) - timestamp) > toleranceSeconds || signatures.length === 0) return false;

  const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`, 'utf8').digest('hex');
  return signatures.some((candidate) => {
    try {
      return crypto.timingSafeEqual(Buffer.from(expected, 'utf8'), Buffer.from(candidate, 'utf8'));
    } catch {
      return false;
    }
  });
}
