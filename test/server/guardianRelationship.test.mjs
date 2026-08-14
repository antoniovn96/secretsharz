import assert from 'node:assert/strict';
import test from 'node:test';
import {
  requiresGuardianForLifeStage,
  createGuardianRelationship,
  hasApprovedGuardianRelationship,
} from '../../src/platform/guardianRelationship.js';

test('guardian is required for minor life stages', () => {
  assert.equal(requiresGuardianForLifeStage('under_13'), true);
  assert.equal(requiresGuardianForLifeStage('13_17'), true);
  assert.equal(requiresGuardianForLifeStage('18_plus'), false);
});

test('guardian relationship defaults to pending and unverified', () => {
  assert.deepEqual(
    createGuardianRelationship({ subjectPersonId: 'student-1', guardianPersonId: 'parent-1' }),
    {
      subjectPersonId: 'student-1',
      guardianPersonId: 'parent-1',
      type: 'guardian',
      status: 'pending',
      verified: false,
      verifiedAt: null,
    },
  );
});

test('approved guardian requires active and verified relationship', () => {
  assert.equal(hasApprovedGuardianRelationship([
    { type: 'guardian', status: 'pending', verified: true },
  ]), false);
  assert.equal(hasApprovedGuardianRelationship([
    { type: 'guardian', status: 'active', verified: true },
  ]), true);
});

test('verified guardian relationship requires verification timestamp', () => {
  assert.throws(
    () => createGuardianRelationship({
      subjectPersonId: 'student-1',
      guardianPersonId: 'parent-1',
      verified: true,
    }),
    /verifiedAt is required/,
  );
});
