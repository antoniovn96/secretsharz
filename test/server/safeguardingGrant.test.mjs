import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canIssueSafeguardingGrant, isSafeguardingGrantActive, grantCoversScope, SAFEGUARDING_ROLE } from '../../src/security/safeguardingGrant.js';
import { decideAccess } from '../../src/security/accessDecision.js';

const now = new Date('2026-08-23T10:00:00.000Z');
function makeGrant(overrides = {}) {
  return canIssueSafeguardingGrant({ actorRole: SAFEGUARDING_ROLE, actorPersonId: 'officer-1', targetPersonId: 'student-1', reason: 'Immediate safeguarding concern requiring review.', scope: ['safeguarding', 'counselling'], durationMs: 15 * 60 * 1000, now, ...overrides }).grant;
}
test('only safeguarding officer can issue a grant', () => {
  assert.equal(canIssueSafeguardingGrant({ actorRole: 'counsellor', actorPersonId: 'a', targetPersonId: 's', reason: 'Immediate safeguarding concern.', now }).allowed, false);
  assert.equal(canIssueSafeguardingGrant({ actorRole: SAFEGUARDING_ROLE, actorPersonId: 'a', targetPersonId: 's', reason: 'Immediate safeguarding concern.', now }).allowed, true);
});
test('grant is time limited and scoped', () => {
  const grant = makeGrant();
  assert.equal(isSafeguardingGrantActive(grant, now), true); assert.equal(grantCoversScope(grant, 'safeguarding'), true); assert.equal(grantCoversScope(grant, 'career'), false); assert.equal(isSafeguardingGrantActive(grant, new Date('2026-08-23T10:16:00.000Z')), false);
});
test('grant cannot exceed one hour', () => { assert.equal(canIssueSafeguardingGrant({ actorRole: SAFEGUARDING_ROLE, actorPersonId: 'a', targetPersonId: 's', reason: 'Immediate safeguarding concern.', now, durationMs: 3600001 }).allowed, false); });
test('self grant is denied by the pure model', () => { assert.equal(canIssueSafeguardingGrant({ actorRole: SAFEGUARDING_ROLE, actorPersonId: 'same', targetPersonId: 'same', reason: 'Immediate safeguarding concern.', now }).allowed, false); });
test('client cannot activate safeguarding by supplying a flag', () => {
  const result = decideAccess({ role: SAFEGUARDING_ROLE, relationship: 'safeguarding_officer', dataDomain: 'safeguarding', purpose: 'safeguarding', consent: 'unknown', safeguarding: 'active', timeStatus: 'active', serviceDomain: 'professional', subjectPersonId: 'student-1' });
  assert.equal(result.allowed, false); assert.equal(result.reason, 'safeguarding_grant_required_or_expired');
});
test('trusted grant authorizes only its subject and explicit scope', () => {
  const grant = makeGrant();
  const allowed = decideAccess({ role: SAFEGUARDING_ROLE, relationship: 'safeguarding_officer', dataDomain: 'safeguarding', purpose: 'safeguarding', consent: 'unknown', safeguarding: 'active', timeStatus: 'active', serviceDomain: 'professional', subjectPersonId: 'student-1', safeguardingGrant: grant });
  assert.equal(allowed.allowed, true);
  const wrongSubject = decideAccess({ role: SAFEGUARDING_ROLE, relationship: 'safeguarding_officer', dataDomain: 'safeguarding', purpose: 'safeguarding', consent: 'unknown', safeguarding: 'active', timeStatus: 'active', serviceDomain: 'professional', subjectPersonId: 'student-2', safeguardingGrant: grant });
  assert.equal(wrongSubject.allowed, false);
  const outOfScope = decideAccess({ role: SAFEGUARDING_ROLE, relationship: 'safeguarding_officer', dataDomain: 'career', purpose: 'safeguarding', consent: 'unknown', safeguarding: 'active', timeStatus: 'active', serviceDomain: 'career', subjectPersonId: 'student-1', safeguardingGrant: grant });
  assert.equal(outOfScope.allowed, false);
});
