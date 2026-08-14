import crypto from 'crypto';

const RAZORPAY_API = 'https://api.razorpay.com/v1';

export const PAYMENT_PRODUCTS = Object.freeze({
  career_assessment_full_report: {
    id: 'career_assessment_full_report',
    name: 'VidyaVantage Career Discovery – Full Report',
    amountEnv: 'RAZORPAY_CAREER_ASSESSMENT_AMOUNT_PAISE',
  },
});

export function getRazorpayConfig(env = process.env) {
  const keyId = env.RAZORPAY_KEY_ID;
  const keySecret = env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Razorpay server credentials are not configured.');
  return { keyId, keySecret };
}

export function getProduct(productId, env = process.env) {
  const product = PAYMENT_PRODUCTS[productId];
  if (!product) throw new Error('Unknown payment product.');
  const amount = Number(env[product.amountEnv]);
  if (!Number.isInteger(amount) || amount <= 0) throw new Error(`Invalid price configuration for ${productId}.`);
  return { ...product, amount, currency: 'INR' };
}

export async function createRazorpayOrder({ productId, receipt, notes = {}, env = process.env }) {
  const config = getRazorpayConfig(env);
  const product = getProduct(productId, env);
  const auth = Buffer.from(`${config.keyId}:${config.keySecret}`).toString('base64');
  const response = await fetch(`${RAZORPAY_API}/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: product.amount,
      currency: product.currency,
      receipt,
      notes,
      capture: 'automatic',
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error?.description || 'Unable to create Razorpay order.');
  return { ...data, productId: product.id, productName: product.name };
}

export function verifyCheckoutSignature({ orderId, paymentId, signature, keySecret }) {
  if (!orderId || !paymentId || !signature || !keySecret) return false;
  const expected = crypto.createHmac('sha256', keySecret).update(`${orderId}|${paymentId}`).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function verifyWebhookSignature(rawBody, signature, webhookSecret) {
  if (!rawBody || !signature || !webhookSecret) return false;
  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
