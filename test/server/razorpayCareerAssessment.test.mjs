import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  buildRazorpayOrderPayload,
  verifyRazorpayPaymentSignature,
  CAREER_ASSESSMENT_PRODUCT_ID,
  CAREER_ASSESSMENT_ENTITLEMENT,
} from '../../src/career/razorpayCareerAssessment.js';

test('Razorpay order payload pins the comprehensive assessment product and entitlement metadata', () => {
  const payload = buildRazorpayOrderPayload({
    amount: 199900,
    currency: 'INR',
    receipt: 'career_attempt_1',
    personId: 'person_1',
    assessmentAttemptId: 'attempt_1',
  });

  assert.equal(payload.amount, 199900);
  assert.equal(payload.currency, 'INR');
  assert.equal(payload.notes.productId, CAREER_ASSESSMENT_PRODUCT_ID);
  assert.equal(payload.notes.entitlementType, CAREER_ASSESSMENT_ENTITLEMENT);
  assert.equal(payload.notes.personId, 'person_1');
  assert.equal(payload.notes.assessmentAttemptId, 'attempt_1');
});

test('Razorpay payment signature verification rejects tampering', () => {
  const secret = 'rzp_test_secret';
  const orderId = 'order_test_123';
  const paymentId = 'pay_test_123';
  const signature = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');

  assert.equal(verifyRazorpayPaymentSignature({ orderId, paymentId, signature, secret }), true);
  assert.equal(verifyRazorpayPaymentSignature({ orderId, paymentId: `${paymentId}x`, signature, secret }), false);
  assert.equal(verifyRazorpayPaymentSignature({ orderId, paymentId, signature: `${signature}x`, secret }), false);
});
