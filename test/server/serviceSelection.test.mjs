import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getInitialServiceOptions,
  getDashboardRouteForService,
  resolveStudentLanding,
} from '../../src/platform/serviceSelection.js';

test('initial service options contain the three established student pathways', () => {
  assert.deepEqual(
    getInitialServiceOptions().map((option) => option.domain),
    ['counselling', 'sen', 'career'],
  );
});

test('maps service domain to its specialist dashboard route', () => {
  assert.equal(getDashboardRouteForService('counselling'), '/dashboard/counselling');
  assert.equal(getDashboardRouteForService('sen'), '/dashboard/sen');
  assert.equal(getDashboardRouteForService('career'), '/dashboard/career');
  assert.equal(getDashboardRouteForService('unknown'), '/dashboard');
});

test('returns the persisted active primary service route on later login', () => {
  assert.equal(
    resolveStudentLanding({
      memberships: [
        { domain: 'career', status: 'active', isPrimary: true },
      ],
    }),
    '/dashboard/career',
  );
});

test('does not re-prompt when a non-primary inactive service is also present', () => {
  assert.equal(
    resolveStudentLanding({
      memberships: [
        { domain: 'career', status: 'active', isPrimary: true },
        { domain: 'counselling', status: 'inactive', isPrimary: false },
      ],
    }),
    '/dashboard/career',
  );
});

test('falls back to the generic dashboard when no persisted primary service exists', () => {
  assert.equal(resolveStudentLanding({ memberships: [] }), '/dashboard');
});
