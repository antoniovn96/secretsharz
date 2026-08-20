import test from 'node:test';
import assert from 'node:assert/strict';
import { isStudentProfile, getStudentPath } from '../../src/platform/studentRecordModel.js';
import { normalizeStudentRecord } from '../../src/platform/studentRecordNormalizer.js';
import { getAssessmentCode, getAssessmentStatus, getProfileStatus } from '../../src/platform/adminStudentDirectory.js';

test('normalizes object-shaped canonical career assignment to a professional id', () => {
  const profile = normalizeStudentRecord({
    profileType: 'student',
    services: { career: { status: 'active' } },
    relationships: {
      assignments: {
        career: { service: 'career', primaryProfessionalId: 'professional-123', status: 'active' },
      },
    },
  }, 'student-1');

  assert.equal(profile.relationships.assignments.career, 'professional-123');
});

test('does not expose an inactive canonical assignment as an active professional relationship', () => {
  const profile = normalizeStudentRecord({
    profileType: 'student',
    services: { career: { status: 'active' } },
    relationships: {
      assignments: {
        career: { service: 'career', primaryProfessionalId: 'professional-123', status: 'inactive' },
      },
    },
  }, 'student-inactive-assignment');

  assert.equal(profile.relationships.assignments.career, null);
});

test('preserves boolean legacy service state during canonical migration', () => {
  const profile = normalizeStudentRecord({
    profileType: 'student',
    services: { career: true, wellbeing: false },
  }, 'student-legacy-service');

  assert.equal(profile.services.career.status, 'active');
  assert.equal(profile.services.wellbeing.status, 'inactive');
});

test('explicit canonical service state wins over a legacy path', () => {
  const profile = normalizeStudentRecord({
    profileType: 'student',
    primary_path: 'career',
    services: {
      career: { status: 'inactive' },
      wellbeing: { status: 'active' },
    },
  }, 'student-3');

  assert.equal(profile.services.career.status, 'inactive');
  assert.equal(profile.services.wellbeing.status, 'active');
});

test('preserves legacy RIASEC data when a newer career object exists without it', () => {
  const profile = normalizeStudentRecord({
    profileType: 'student',
    riasecCode: 'SIC',
    riasecScores: { S: 10, I: 8, C: 7 },
    career: { status: 'active', interests: ['science'] },
  }, 'student-2');

  assert.equal(profile.career.riasec.code, 'SIC');
  assert.deepEqual(profile.career.riasec.scores, { S: 10, I: 8, C: 7 });
});

test('recognizes a valid SIC RIASEC code as complete', () => {
  assert.equal(getAssessmentCode({ riasecCode: 'sic' }), 'SIC');
  assert.equal(getAssessmentStatus({ riasecCode: 'sic' }), 'complete');
});

test('directory helper preserves legacy profile status only as a compatibility fallback', () => {
  assert.equal(getProfileStatus({ profileStatus: 'complete', profileComplete: false }), 'complete');
  assert.equal(getProfileStatus({ profileComplete: true }), 'complete');
  assert.equal(getProfileStatus({ profileComplete: false }), 'incomplete');
});

test('discovers a canonical nested studentProfile even without a legacy role', () => {
  assert.equal(isStudentProfile({ studentProfile: { profileType: 'student' } }), true);
  assert.equal(isStudentProfile({ studentProfile: { career: { riasec: { code: 'SIC' } } } }), true);
});

test('discovers canonical career RIASEC records and maps their path', () => {
  const record = { career: { path: 'career_guidance', riasec: { code: 'SIC' } } };
  assert.equal(isStudentProfile(record), true);
  assert.equal(getStudentPath(record), 'Career');
});

test('never lets a nested studentProfile override a privileged top-level role', () => {
  assert.equal(
    isStudentProfile({ role: 'super_admin', studentProfile: { profileType: 'student', career: { riasec: { code: 'SIC' } } } }),
    false,
  );
  assert.equal(
    isStudentProfile({ role: 'admin', studentProfile: { profileType: 'student' } }),
    false,
  );
});
