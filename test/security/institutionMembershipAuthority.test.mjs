import test from 'node:test';
import assert from 'node:assert/strict';
import { isActiveInstitutionMembership, normalizeInstitutionMembership } from '../../src/security/institutionMembershipAuthority.js';

test('active institution membership is current authorization state', () => {
  const membership = normalizeInstitutionMembership({
    id: 'rel-1',
    subjectPersonId: 'student-1',
    relatedPersonId: 'institution-user-1',
    metadata: { institutionId: 'school-a', role: 'coordinator' },
    status: 'active',
  });
  assert.equal(membership.institutionId, 'school-a');
  assert.equal(membership.role, 'coordinator');
  assert.equal(isActiveInstitutionMembership(membership), true);
});

test('historical membership cannot authorize current access', () => {
  assert.equal(isActiveInstitutionMembership({ status: 'ended', institutionId: 'school-a' }), false);
  assert.equal(isActiveInstitutionMembership({ status: 'suspended', institutionId: 'school-a' }), false);
});

test('institution memberships remain institution-specific', () => {
  const a = normalizeInstitutionMembership({ subjectPersonId: 'student-1', relatedPersonId: 'user-a', metadata: { institutionId: 'school-a' }, status: 'active' });
  const b = normalizeInstitutionMembership({ subjectPersonId: 'student-1', relatedPersonId: 'user-b', metadata: { institutionId: 'school-b' }, status: 'active' });
  assert.notEqual(a.institutionId, b.institutionId);
});
