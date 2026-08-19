import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeCanonicalStudent,
  getActiveInstitutionMemberships,
  getHistoricalInstitutionMemberships,
  assertCanonicalStudentIdentity,
} from '../../src/platform/canonicalStudentContract.js';
import {
  normalizeServiceAssignment,
  isAssignedProfessional,
  SERVICE_KEYS,
} from '../../src/platform/serviceAssignmentContract.js';
import { normalizeParentStudentProjection } from '../../src/platform/parentSharingContract.js';

test('canonical student identity preserves Auth UID and SS Student ID separately', () => {
  const student = normalizeCanonicalStudent({
    ssStudentId: 'SS-001',
    name: 'A Student',
    phone: { countryCode: '+91', number: '9876543210' },
    academic: { current: { grade: '10', section: 'A', academicYear: '2026-27' } },
  }, 'auth-001');

  assert.equal(student.authUid, 'auth-001');
  assert.equal(student.ssStudentId, 'SS-001');
  assert.equal(student.identity.legalName, 'A Student');
  assert.equal(student.academic.current.grade, '10');
  assertCanonicalStudentIdentity(student);
});

test('canonical student supports multiple active and historical institutions', () => {
  const student = normalizeCanonicalStudent({
    ssStudentId: 'SS-002',
    institutionMemberships: [
      { id: 'm1', institutionId: 'school-a', status: 'active' },
      { id: 'm2', institutionId: 'coaching-b', status: 'active' },
      { id: 'm3', institutionId: 'school-c', status: 'historical' },
    ],
  }, 'auth-002');

  assert.equal(getActiveInstitutionMemberships(student).length, 2);
  assert.equal(getHistoricalInstitutionMemberships(student).length, 1);
});

test('service assignments support primary, backup and multidisciplinary team', () => {
  const wellbeing = normalizeServiceAssignment({
    service: SERVICE_KEYS.WELLBEING,
    primaryProfessionalId: 'primary',
    backupProfessionalId: 'backup',
  });
  assert.equal(isAssignedProfessional(wellbeing, 'primary'), true);
  assert.equal(isAssignedProfessional(wellbeing, 'backup'), true);
  assert.equal(isAssignedProfessional(wellbeing, 'other'), false);

  const sen = normalizeServiceAssignment({
    service: SERVICE_KEYS.SEN,
    primaryEducatorId: 'educator',
    team: [{ professionalId: 'psych', role: 'psychologist' }],
  });
  assert.equal(isAssignedProfessional(sen, 'educator'), true);
  assert.equal(isAssignedProfessional(sen, 'psych'), true);
});

test('parent projection cannot expose service data when sharing is not approved', () => {
  const projection = normalizeParentStudentProjection({
    student: { authUid: 'auth-003', ssStudentId: 'SS-003', name: 'Student', grade: '9' },
    sharing: { career: false, wellbeing: false, sen: true, journal: false },
    career: { riasecCode: 'RIA' },
    wellbeing: { risk: 'high' },
    sen: { iepStatus: 'active' },
  });

  assert.equal(projection.career, null);
  assert.equal(projection.wellbeing, null);
  assert.deepEqual(projection.sen, { iepStatus: 'active' });
});
