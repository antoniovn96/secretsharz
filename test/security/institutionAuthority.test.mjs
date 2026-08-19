import test from 'node:test';
import assert from 'node:assert/strict';
import { canInstitutionRelease, canInstitutionUserAccessStudent } from '../../src/security/institutionAuthority.js';

const studentMembership = { membershipId: 'sm-1', institutionId: 'school-a', studentAuthUid: 'student-1', ssStudentId: 'SS-1', status: 'active' };
const staffMembership = { membershipId: 'stm-1', institutionId: 'school-a', userAuthUid: 'staff-1', role: 'teacher', status: 'active' };

test('active institution staff can access active student membership in same institution', () => {
  assert.equal(canInstitutionUserAccessStudent({ institutionMembership: studentMembership, staffMembership, institutionId: 'school-a', studentAuthUid: 'student-1' }), true);
});

test('staff cannot cross institution boundaries', () => {
  assert.equal(canInstitutionUserAccessStudent({ institutionMembership: studentMembership, staffMembership, institutionId: 'school-b', studentAuthUid: 'student-1' }), false);
});

test('historical student membership does not authorize current access', () => {
  assert.equal(canInstitutionUserAccessStudent({ institutionMembership: { ...studentMembership, status: 'ended' }, staffMembership, institutionId: 'school-a', studentAuthUid: 'student-1' }), false);
});

test('ended staff membership does not authorize access', () => {
  assert.equal(canInstitutionUserAccessStudent({ institutionMembership: studentMembership, staffMembership: { ...staffMembership, status: 'ended' }, institutionId: 'school-a', studentAuthUid: 'student-1' }), false);
});

test('institution release must target the staff member institution', () => {
  assert.equal(canInstitutionRelease({ staffMembership, institutionId: 'school-a', targetInstitutionId: 'school-a' }), true);
  assert.equal(canInstitutionRelease({ staffMembership, institutionId: 'school-a', targetInstitutionId: 'school-b' }), false);
});
