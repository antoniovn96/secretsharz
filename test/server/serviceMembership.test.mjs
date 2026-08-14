import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createServiceMembership,
  choosePrimaryStudentService,
  shouldAskForInitialServiceSelection,
} from '../../src/platform/serviceMembership.js';

test('creates a valid service membership', () => {
  const membership = createServiceMembership({
    personId: 'person-1',
    institutionId: 'school-1',
    domain: 'career',
    status: 'active',
    source: 'student',
    isPrimary: true,
  });

  assert.deepEqual(membership, {
    personId: 'person-1',
    institutionId: 'school-1',
    domain: 'career',
    status: 'active',
    source: 'student',
    isPrimary: true,
    startedAt: null,
    endedAt: null,
  });
});

test('rejects unknown service domains', () => {
  assert.throws(
    () => createServiceMembership({ personId: 'person-1', domain: 'unknown' }),
    /Unknown service domain/,
  );
});

test('rejects an invalid time range', () => {
  assert.throws(
    () => createServiceMembership({
      personId: 'person-1',
      domain: 'career',
      startedAt: '2026-08-20T12:00:00Z',
      endedAt: '2026-08-19T12:00:00Z',
    }),
    /endedAt cannot be before startedAt/,
  );
});

test('finds the persisted active primary student service', () => {
  const service = choosePrimaryStudentService([
    { domain: 'sen', status: 'active', isPrimary: false },
    { domain: 'career', status: 'active', isPrimary: true },
  ]);

  assert.equal(service, 'career');
});

test('does not ask for service again after onboarding is complete', () => {
  assert.equal(
    shouldAskForInitialServiceSelection({ onboardingComplete: true, memberships: [] }),
    false,
  );
});

test('asks for the initial service when onboarding is incomplete and no primary service exists', () => {
  assert.equal(
    shouldAskForInitialServiceSelection({ onboardingComplete: false, memberships: [] }),
    true,
  );
});
