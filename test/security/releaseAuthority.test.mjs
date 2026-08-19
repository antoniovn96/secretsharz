import test from 'node:test';
import assert from 'node:assert/strict';
import { assertReleaseScope, isActiveRelease, releaseMatches } from '../../src/security/releaseAuthority.js';

test('active parent release matches exact service and purpose', () => {
  const release = {
    studentAuthUid: 'student-auth',
    ssStudentId: 'SS-1001',
    service: 'sen',
    purpose: 'parent_sharing',
    audience: 'PARENT',
    scope: 'iep_summary',
    status: 'ACTIVE',
  };
  assert.equal(isActiveRelease(release), true);
  assert.equal(releaseMatches({ release, studentAuthUid: 'student-auth', ssStudentId: 'SS-1001', service: 'sen', purpose: 'parent_sharing', audience: 'PARENT' }), true);
  assert.equal(releaseMatches({ release, studentAuthUid: 'student-auth', ssStudentId: 'SS-1001', service: 'wellbeing', purpose: 'parent_sharing', audience: 'PARENT' }), false);
});

test('revoked release cannot grant access', () => {
  const release = { service: 'career_guidance', purpose: 'parent_sharing', audience: 'PARENT', status: 'REVOKED', revokedAt: new Date().toISOString() };
  assert.equal(isActiveRelease(release), false);
});

test('institution release is scoped to the institution', () => {
  const release = { studentAuthUid: 'student-auth', ssStudentId: 'SS-1001', service: 'career_guidance', purpose: 'institution_sharing', audience: 'INSTITUTION', institutionId: 'school-a', status: 'ACTIVE' };
  assert.equal(releaseMatches({ release, studentAuthUid: 'student-auth', ssStudentId: 'SS-1001', service: 'career_guidance', purpose: 'institution_sharing', audience: 'INSTITUTION', institutionId: 'school-a' }), true);
  assert.equal(releaseMatches({ release, studentAuthUid: 'student-auth', ssStudentId: 'SS-1001', service: 'career_guidance', purpose: 'institution_sharing', audience: 'INSTITUTION', institutionId: 'school-b' }), false);
});

test('unsupported release dimensions are rejected', () => {
  assert.throws(() => assertReleaseScope({ service: 'unknown', purpose: 'parent_sharing', audience: 'PARENT' }));
  assert.throws(() => assertReleaseScope({ service: 'sen', purpose: 'parent_sharing', audience: 'STUDENT' }));
});
