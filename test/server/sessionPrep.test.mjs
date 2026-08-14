import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSessionPrep, validateSessionPrep } from '../../src/booking/sessionPrep.js';
import { canRequestOneToOne, missingBookingRequirements } from '../../src/booking/bookingEligibility.js';

test('booking requires authentication, profile, consent and valid service', () => {
  assert.equal(canRequestOneToOne({ isAuthenticated: true, hasBasicProfile: true, hasConsent: true, service: 'career' }), true);
  assert.equal(canRequestOneToOne({ isAuthenticated: false, hasBasicProfile: true, hasConsent: true, service: 'career' }), false);
  assert.deepEqual(missingBookingRequirements({ isAuthenticated: true, hasBasicProfile: false, hasConsent: false }), ['basic_profile', 'service_consent']);
});

test('session preparation requires topic and goal but note is optional', () => {
  assert.equal(validateSessionPrep({ topicIds: ['career'], goalIds: ['advice'] }).valid, true);
  assert.equal(validateSessionPrep({ topicIds: [], goalIds: ['advice'] }).valid, false);
  assert.equal(validateSessionPrep({ topicIds: ['career'], goalIds: ['advice'], note: 'x'.repeat(1201) }).valid, false);
  const prep = buildSessionPrep({ bookingId: 'b1', personId: 'p1', topicIds: ['career'], goalIds: ['advice'], note: 'I am unsure which course to choose.' });
  assert.equal(prep.bookingId, 'b1');
  assert.equal(prep.note.length > 0, true);
});
