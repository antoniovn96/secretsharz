import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildPersonAccountState,
  canCreateSelfServiceProfile,
  deriveAdultTransitionState,
} from '../../src/platform/personAccountModel.js';

test('derives minor account state correctly', () => {
  assert.deepEqual(
    buildPersonAccountState({ uid: 'person-1', age: 15 }),
    {
      personId: 'person-1',
      accountStatus: 'pending_consent',
      profileStatus: 'not_created',
      age: 15,
      lifeStage: '13_17',
      guardianRequired: true,
      adultAutonomyEligible: false,
    },
  );
});

test('requires consent and guardian approval before minor profile creation', () => {
  assert.equal(
    canCreateSelfServiceProfile({
      accountStatus: 'pending_consent',
      consentGranted: true,
      guardianApproved: false,
      guardianRequired: true,
    }),
    false,
  );

  assert.equal(
    canCreateSelfServiceProfile({
      accountStatus: 'pending_consent',
      consentGranted: true,
      guardianApproved: true,
      guardianRequired: true,
    }),
    true,
  );
});

test('adult users do not require guardian approval by default', () => {
  assert.deepEqual(
    buildPersonAccountState({ uid: 'adult-1', age: 30 }),
    {
      personId: 'adult-1',
      accountStatus: 'pending_consent',
      profileStatus: 'not_created',
      age: 30,
      lifeStage: '18_plus',
      guardianRequired: false,
      adultAutonomyEligible: true,
    },
  );
});

test('adult transition becomes eligible at 18', () => {
  assert.deepEqual(
    deriveAdultTransitionState({ age: 18, guardianRequired: true }),
    {
      eligible: true,
      guardianRelationshipReviewRequired: true,
      adultAutonomy: true,
    },
  );
});

test('adult transition is not eligible before 18', () => {
  assert.deepEqual(
    deriveAdultTransitionState({ age: 17, guardianRequired: true }),
    {
      eligible: false,
      reason: 'person_is_not_yet_18',
    },
  );
});
