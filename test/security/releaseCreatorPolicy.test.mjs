import test from 'node:test';
import assert from 'node:assert/strict';
import { canCreateRelease, canRevokeRelease, isClinicalScope } from '../../src/security/releaseCreatorPolicy.js';

test('career counsellor can create only career releases', () => {
  const base = { role: 'career_counsellor', purpose: 'parent_sharing', audience: 'PARENT', scope: 'career_roadmap_summary', relationshipAuthorized: true };
  assert.equal(canCreateRelease({ ...base, service: 'career_guidance' }), true);
  assert.equal(canCreateRelease({ ...base, service: 'sen' }), false);
  assert.equal(canCreateRelease({ ...base, service: 'wellbeing' }), false);
});

test('SEN release is scoped to the authorized institution', () => {
  const base = { role: 'sen_educator', service: 'sen', purpose: 'institution_sharing', audience: 'INSTITUTION', scope: 'iep_summary', relationshipAuthorized: true, institutionId: 'school-a' };
  assert.equal(canCreateRelease({ ...base, targetInstitutionId: 'school-a' }), true);
  assert.equal(canCreateRelease({ ...base, targetInstitutionId: 'school-b' }), false);
});

test('wellbeing professional cannot create clinical/private parent releases', () => {
  assert.equal(isClinicalScope('clinical_notes'), true);
  assert.equal(canCreateRelease({ role: 'psychologist', service: 'wellbeing', purpose: 'parent_sharing', audience: 'PARENT', scope: 'clinical_notes', relationshipAuthorized: true }), false);
  assert.equal(canCreateRelease({ role: 'psychologist', service: 'wellbeing', purpose: 'parent_sharing', audience: 'PARENT', scope: 'support_summary', relationshipAuthorized: true }), true);
});

test('revoke requires the same service relationship', () => {
  const release = { service: 'career_guidance', audience: 'PARENT', institutionId: null };
  assert.equal(canRevokeRelease({ role: 'career_counsellor', release, relationshipAuthorized: true }), true);
  assert.equal(canRevokeRelease({ role: 'sen_educator', release, relationshipAuthorized: true }), false);
});
