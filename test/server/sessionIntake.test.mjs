import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSessionIntake, validateSessionIntake } from '../../src/booking/sessionIntake.js';
import { canRequestOneToOne, missingBookingRequirements } from '../../src/booking/bookingEligibility.js';

test('one-to-one booking requires login, basic profile and consent', () => {
  assert.equal(canRequestOneToOne({ isAuthenticated: false, hasBasicProfile: true, hasConsent: true, service: 'career' }), false);
  assert.equal(canRequestOneToOne({ isAuthenticated: true, hasBasicProfile: false, hasConsent: true, service: 'career' }), false);
  assert.equal(canRequestOneToOne({ isAuthenticated: true, hasBasicProfile: true, hasConsent: true, service: 'career' }), true);
  assert.deepEqual(missingBookingRequirements({ isAuthenticated: false, hasBasicProfile: false, hasConsent: true }), ['login', 'basic_profile']);
});

test('pre-session note is optional but reason and goal are required', () => {
  assert.equal(validateSessionIntake({ reason: 'Career / future', goal: 'I want advice' }).valid, true);
  assert.equal(validateSessionIntake({ reason: '', goal: 'I want advice' }).valid, false);
  assert.equal(validateSessionIntake({ reason: 'Career / future', goal: 'I want advice', brief: 'x'.repeat(1201) }).valid, false);
});

test('intake is tied to the authenticated person and booking', () => {
  const intake = buildSessionIntake({ personId: 'p1', bookingId: 'b1', input: { reason: 'School / studies', goal: 'I want to talk', brief: 'I am worried about an upcoming exam.' } });
  assert.equal(intake.personId, 'p1');
  assert.equal(intake.bookingId, 'b1');
});
