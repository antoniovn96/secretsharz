import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { getProduct, verifyCheckoutSignature, verifyWebhookSignature } from '../../src/payments/razorpay.js';

test('Razorpay product price is server-side and INR paise', () => {
  const product = getProduct('career_assessment_full_report', { RAZORPAY_CAREER_ASSESSMENT_AMOUNT_PAISE: '100' });
  assert.equal(product.amount, 100);
  assert.equal(product.currency, 'INR');
});

test('checkout signature verifies with timing-safe comparison', () => {
  const orderId = 'order_test';
  const paymentId = 'pay_test';
  const secret = 'secret';
  const signature = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  assert.equal(verifyCheckoutSignature({ orderId, paymentId, signature, keySecret: secret }), true);
  assert.equal(verifyCheckoutSignature({ orderId, paymentId, signature: 'bad', keySecret: secret }), false);
});

test('webhook signature uses raw body', () => {
  const body = Buffer.from(JSON.stringify({ id: 'evt_test', event: 'payment.captured' }));
  const secret = 'webhook-secret';
  const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');
  assert.equal(verifyWebhookSignature(body, signature, secret), true);
  assert.equal(verifyWebhookSignature(Buffer.from('{}'), signature, secret), false);
});
