import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { buildStripeCheckoutForm, verifyStripeWebhookSignature, CAREER_ASSESSMENT_PRODUCT_ID } from '../../src/career/stripeCareerAssessment.js';

test('checkout form pins the comprehensive assessment product and metadata', () => {
  const form = buildStripeCheckoutForm({
    priceId: 'price_test_123',
    personId: 'person_1',
    assessmentAttemptId: 'attempt_1',
    successUrl: 'https://example.test/success',
    cancelUrl: 'https://example.test/cancel',
  });
  assert.match(form, /line_items%5B0%5D%5Bprice%5D=price_test_123/);
  assert.match(form, new RegExp(`metadata%5BproductId%5D=${CAREER_ASSESSMENT_PRODUCT_ID}`));
  assert.match(form, /metadata%5BpersonId%5D=person_1/);
  assert.match(form, /metadata%5BassessmentAttemptId%5D=attempt_1/);
});

test('Stripe webhook signature verification rejects tampering and stale timestamps', () => {
  const secret = 'whsec_test';
  const body = JSON.stringify({ id: 'evt_test' });
  const timestamp = Math.floor(Date.now() / 1000);
  const digest = crypto.createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
  assert.equal(verifyStripeWebhookSignature(body, `t=${timestamp},v1=${digest}`, secret), true);
  assert.equal(verifyStripeWebhookSignature(`${body}x`, `t=${timestamp},v1=${digest}`, secret), false);
  assert.equal(verifyStripeWebhookSignature(body, `t=${timestamp - 1000},v1=${digest}`, secret), false);
});
