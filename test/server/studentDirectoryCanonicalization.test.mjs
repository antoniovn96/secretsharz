import test from 'node:test';
import assert from 'node:assert/strict';
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

test('canonical service status takes precedence over a legacy path when explicitly set', () => {
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

test('recognizes a valid SIC RIASEC code as complete', () => {
  assert.equal(getAssessmentCode({ riasecCode: 'sic' }), 'SIC');
  assert.equal(getAssessmentStatus({ riasecCode: 'sic' }), 'complete');
});

test('does not mark a profile complete from the legacy boolean alone', () => {
  assert.equal(getProfileStatus({ profileComplete: true }), 'complete');
  assert.equal(getProfileStatus({ profileComplete: false }), 'incomplete');
});
