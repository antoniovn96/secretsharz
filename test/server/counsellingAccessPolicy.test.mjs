import test from 'node:test';
import assert from 'node:assert/strict';
import { COUNSELLING_SCOPES, canAccessCounsellingScope } from '../../src/security/counsellingAccessPolicy.js';
import { canIssueSafeguardingGrant, SAFEGUARDING_ROLE } from '../../src/security/safeguardingGrant.js';

test('unassigned professional cannot access counselling case', () => { assert.equal(canAccessCounsellingScope({ role: 'counsellor', scope: COUNSELLING_SCOPES.SESSION, assignedCase: false, activeRelationship: true }).allowed, false); });
test('assigned active counsellor can access case/session/progress scopes', () => { for (const scope of [COUNSELLING_SCOPES.CASE, COUNSELLING_SCOPES.SESSION, COUNSELLING_SCOPES.PROGRESS]) assert.equal(canAccessCounsellingScope({ role: 'counsellor', scope, assignedCase: true, activeRelationship: true }).allowed, true); });
test('parent cannot access professional counselling scopes', () => { assert.equal(canAccessCounsellingScope({ role: 'parent', scope: COUNSELLING_SCOPES.SESSION, activeRelationship: true, parentSummaryConsent: true }).allowed, false); });
test('parent summary requires active relationship and explicit summary consent', () => {
  assert.equal(canAccessCounsellingScope({ role: 'parent', scope: COUNSELLING_SCOPES.PARENT_SUMMARY, activeRelationship: true, parentSummaryConsent: false }).allowed, false);
  assert.equal(canAccessCounsellingScope({ role: 'parent', scope: COUNSELLING_SCOPES.PARENT_SUMMARY, activeRelationship: true, parentSummaryConsent: true }).allowed, true);
});
test('counselling safeguarding scope rejects the legacy boolean and old role name', () => {
  assert.equal(canAccessCounsellingScope({ role: 'safeguarding', scope: COUNSELLING_SCOPES.SAFEGUARDING, safeguarding: true, subjectPersonId: 's' }).allowed, false);
  assert.equal(canAccessCounsellingScope({ role: SAFEGUARDING_ROLE, scope: COUNSELLING_SCOPES.SAFEGUARDING, safeguarding: true, subjectPersonId: 's' }).allowed, false);
});
test('counselling safeguarding scope requires a trusted grant', () => {
  const grant = canIssueSafeguardingGrant({ actorRole: SAFEGUARDING_ROLE, actorPersonId: 'officer', targetPersonId: 'student', reason: 'Immediate safeguarding concern requiring review.', scope: ['counselling'], durationMs: 15 * 60 * 1000, now: new Date('2026-08-23T10:00:00Z') }).grant;
  const result = canAccessCounsellingScope({ role: SAFEGUARDING_ROLE, scope: COUNSELLING_SCOPES.SAFEGUARDING, subjectPersonId: 'student', safeguardingGrant: grant });
  assert.equal(result.allowed, true); assert.equal(result.reason, 'trusted_safeguarding_grant');
});
