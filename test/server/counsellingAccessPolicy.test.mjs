import test from 'node:test';
import assert from 'node:assert/strict';
import { COUNSELLING_SCOPES, canAccessCounsellingScope } from '../../src/security/counsellingAccessPolicy.js';

test('unassigned professional cannot access counselling case', () => {
  const result = canAccessCounsellingScope({ role: 'counsellor', scope: COUNSELLING_SCOPES.SESSION, assignedCase: false, activeRelationship: true });
  assert.equal(result.allowed, false);
});

test('assigned active counsellor can access case/session/progress scopes', () => {
  for (const scope of [COUNSELLING_SCOPES.CASE, COUNSELLING_SCOPES.SESSION, COUNSELLING_SCOPES.PROGRESS]) {
    const result = canAccessCounsellingScope({ role: 'counsellor', scope, assignedCase: true, activeRelationship: true });
    assert.equal(result.allowed, true);
  }
});

test('parent cannot access professional counselling scopes', () => {
  const result = canAccessCounsellingScope({ role: 'parent', scope: COUNSELLING_SCOPES.SESSION, activeRelationship: true, parentSummaryConsent: true });
  assert.equal(result.allowed, false);
});

test('parent summary requires active relationship and explicit summary consent', () => {
  assert.equal(canAccessCounsellingScope({ role: 'parent', scope: COUNSELLING_SCOPES.PARENT_SUMMARY, activeRelationship: true, parentSummaryConsent: false }).allowed, false);
  assert.equal(canAccessCounsellingScope({ role: 'parent', scope: COUNSELLING_SCOPES.PARENT_SUMMARY, activeRelationship: true, parentSummaryConsent: true }).allowed, true);
});
