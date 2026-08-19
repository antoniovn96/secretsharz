import test from 'node:test';
import assert from 'node:assert/strict';
import { canAssignProfessional, validateAssignmentCounts } from '../../src/security/serviceAssignmentPolicy.js';

test('wellbeing permits one primary and one backup', () => {
  assert.deepEqual(validateAssignmentCounts({ service: 'wellbeing', primaryCount: 1, backupCount: 1 }), { valid: true });
  assert.equal(validateAssignmentCounts({ service: 'wellbeing', primaryCount: 2, backupCount: 0 }).valid, false);
  assert.equal(validateAssignmentCounts({ service: 'wellbeing', primaryCount: 1, backupCount: 2 }).valid, false);
});

test('career permits exactly one primary assignment and no backup', () => {
  assert.equal(validateAssignmentCounts({ service: 'career_guidance', primaryCount: 1, backupCount: 0 }).valid, true);
  assert.equal(validateAssignmentCounts({ service: 'career_guidance', primaryCount: 2, backupCount: 0 }).valid, false);
  assert.equal(validateAssignmentCounts({ service: 'career_guidance', primaryCount: 1, backupCount: 1 }).valid, false);
});

test('SEN permits one primary and multidisciplinary team participation', () => {
  assert.equal(validateAssignmentCounts({ service: 'sen', primaryCount: 1, backupCount: 0 }).valid, true);
  assert.equal(validateAssignmentCounts({ service: 'sen', primaryCount: 2, backupCount: 0 }).valid, false);
  assert.equal(canAssignProfessional({ service: 'sen', role: 'sen_educator', institutionId: 'school-a', targetInstitutionId: 'school-a', professionalInstitutionActive: true, studentInstitutionActive: true }), true);
});

test('professional and student institution memberships must both be active', () => {
  const base = { service: 'career_guidance', role: 'career_counsellor', institutionId: 'school-a', targetInstitutionId: 'school-a' };
  assert.equal(canAssignProfessional({ ...base, professionalInstitutionActive: true, studentInstitutionActive: true }), true);
  assert.equal(canAssignProfessional({ ...base, professionalInstitutionActive: false, studentInstitutionActive: true }), false);
  assert.equal(canAssignProfessional({ ...base, professionalInstitutionActive: true, studentInstitutionActive: false }), false);
});
