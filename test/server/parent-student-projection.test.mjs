import test from 'node:test';
import assert from 'node:assert/strict';
import { releaseMatches } from '../../src/security/releaseAuthority.js';

test('parent projection accepts only active parent releases', () => {
  const release = { studentAuthUid: 'student-1', ssStudentId: 'SS-1', service: 'sen', purpose: 'parent_sharing', audience: 'PARENT', scope: 'iep_summary', status: 'ACTIVE' };
  assert.equal(releaseMatches({ release, studentAuthUid: 'student-1', ssStudentId: 'SS-1', audience: 'PARENT' }), true);
});

test('parent projection rejects releases for another audience', () => {
  const release = { studentAuthUid: 'student-1', ssStudentId: 'SS-1', service: 'career_guidance', purpose: 'institution_sharing', audience: 'INSTITUTION', scope: 'career_roadmap_summary', status: 'ACTIVE' };
  assert.equal(releaseMatches({ release, studentAuthUid: 'student-1', ssStudentId: 'SS-1', audience: 'PARENT' }), false);
});

test('parent projection rejects revoked release', () => {
  const release = { studentAuthUid: 'student-1', ssStudentId: 'SS-1', service: 'wellbeing', purpose: 'parent_sharing', audience: 'PARENT', scope: 'support_summary', status: 'REVOKED', revokedAt: new Date().toISOString() };
  assert.equal(releaseMatches({ release, studentAuthUid: 'student-1', ssStudentId: 'SS-1', audience: 'PARENT' }), false);
});
