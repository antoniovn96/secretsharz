import test from 'node:test';
import assert from 'node:assert/strict';

import { buildOnboardingState, getOnboardingStep } from '../../src/platform/onboardingPlan.js';

test('new adult with no consent starts at account consent', () => {
  const state = buildOnboardingState({ uid: 'p1', age: 25, consentGranted: false });
  assert.equal(state.next.step, 'account_consent');
});

test('minor with consent but no guardian approval goes to guardian verification', () => {
  const state = buildOnboardingState({
    uid: 'p2',
    age: 15,
    consentGranted: true,
    guardianApproved: false,
  });

  assert.equal(state.next.step, 'guardian_verification');
});

test('minor with guardian approval and no service goes to service selection', () => {
  const state = buildOnboardingState({
    uid: 'p3',
    age: 15,
    consentGranted: true,
    guardianApproved: true,
    memberships: [],
  });

  assert.equal(state.next.step, 'service_selection');
});

test('persisted primary service means service selection is skipped', () => {
  const state = buildOnboardingState({
    uid: 'p4',
    age: 15,
    consentGranted: true,
    guardianApproved: true,
    memberships: [
      { domain: 'career', status: 'active', isPrimary: true },
    ],
  });

  assert.equal(state.primaryService, 'career');
  assert.equal(state.next.step, 'profile');
});

test('completed onboarding is always complete', () => {
  assert.deepEqual(
    getOnboardingStep({ onboardingComplete: true }),
    { step: 'complete' },
  );
});
