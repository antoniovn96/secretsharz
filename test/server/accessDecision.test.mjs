import test from 'node:test';
import assert from 'node:assert/strict';
import { decideAccess } from '../../src/security/accessDecision.js';
import { canIssueSafeguardingGrant, SAFEGUARDING_ROLE } from '../../src/security/safeguardingGrant.js';

const base = {
  role: 'professional', relationship: 'active', dataDomain: 'counselling', purpose: 'service_delivery',
  consent: 'active', safeguarding: 'normal', timeStatus: 'active', serviceDomain: 'counselling',
};

test('access decision denies unknown consent', () => { const result = decideAccess({ ...base, consent: 'unknown' }); assert.equal(result.allowed, false); assert.equal(result.reason, 'consent_unknown'); });
test('access decision denies withdrawn consent', () => { const result = decideAccess({ ...base, consent: 'withdrawn' }); assert.equal(result.allowed, false); });
test('access decision allows active consent for matching specialist domain', () => { assert.equal(decideAccess(base).allowed, true); });
test('access decision denies cross-domain specialist access', () => { const result = decideAccess({ ...base, dataDomain: 'sen', serviceDomain: 'counselling' }); assert.equal(result.allowed, false); assert.equal(result.reason, 'service_domain_mismatch'); });
test('access decision denies a purpose not allowed by the service', () => { const result = decideAccess({ ...base, purpose: 'institution_view' }); assert.equal(result.allowed, false); assert.equal(result.reason, 'purpose_not_allowed_for_service'); });
test('client-supplied safeguarding state is never enough', () => {
  const result = decideAccess({ role: SAFEGUARDING_ROLE, relationship: 'safeguarding_officer', dataDomain: 'safeguarding', purpose: 'safeguarding', consent: 'unknown', safeguarding: 'active', timeStatus: 'active', serviceDomain: 'professional', subjectPersonId: 'student-1' });
  assert.equal(result.allowed, false); assert.equal(result.reason, 'safeguarding_grant_required_or_expired');
});
test('trusted safeguarding grant is the explicit exceptional path', () => {
  const grant = canIssueSafeguardingGrant({ actorRole: SAFEGUARDING_ROLE, actorPersonId: 'officer-1', targetPersonId: 'student-1', reason: 'Immediate safeguarding concern requiring review.', scope: ['safeguarding'], durationMs: 15 * 60 * 1000, now: new Date('2026-08-23T10:00:00.000Z') }).grant;
  const result = decideAccess({ role: SAFEGUARDING_ROLE, relationship: 'safeguarding_officer', dataDomain: 'safeguarding', purpose: 'safeguarding', consent: 'unknown', safeguarding: 'active', timeStatus: 'active', serviceDomain: 'professional', subjectPersonId: 'student-1', safeguardingGrant: grant });
  assert.equal(result.allowed, true); assert.equal(result.reason, 'trusted_safeguarding_grant');
});
