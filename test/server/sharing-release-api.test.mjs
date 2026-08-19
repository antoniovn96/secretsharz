import test from 'node:test';
import assert from 'node:assert/strict';
import { canCreateRelease, isClinicalScope } from '../../src/security/releaseCreatorPolicy.js';

test('release API policy allows career parent summary only to career professional', () => {
  assert.equal(canCreateRelease({ role: 'career_counsellor', service: 'career_guidance', purpose: 'parent_sharing', audience: 'PARENT', scope: 'career_roadmap_summary', relationshipAuthorized: true }), true);
  assert.equal(canCreateRelease({ role: 'psychologist', service: 'career_guidance', purpose: 'parent_sharing', audience: 'PARENT', scope: 'career_roadmap_summary', relationshipAuthorized: true }), false);
});

test('release API blocks clinical scope regardless of audience relationship', () => {
  assert.equal(isClinicalScope('SOAP_NOTES'), true);
  assert.equal(isClinicalScope('private_notes'), true);
});

test('release API requires institution scope to match the professional institution', () => {
  const base = { role: 'sen_educator', service: 'sen', purpose: 'institution_sharing', audience: 'INSTITUTION', scope: 'iep_summary', relationshipAuthorized: true, institutionId: 'school-a' };
  assert.equal(canCreateRelease({ ...base, targetInstitutionId: 'school-a' }), true);
  assert.equal(canCreateRelease({ ...base, targetInstitutionId: 'school-b' }), false);
});
