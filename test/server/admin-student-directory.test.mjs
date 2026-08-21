import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAssessmentCode,
  getAssessmentStatus,
  getNeedsAttention,
  getProfileStatus,
  getSortValue,
  getStudentId,
  getStudentPath,
  toAdminStudentDirectoryRecord,
} from '../../src/platform/adminStudentDirectory.js';

test('canonical assessment status wins over legacy inference', () => {
  assert.equal(getAssessmentStatus({ assessmentStatus: 'pending', riasecCode: 'RIA' }), 'pending');
  assert.equal(getAssessmentStatus({ assessmentStatus: 'complete' }), 'complete');
  assert.equal(getAssessmentStatus({}), 'pending');
});

test('canonical assessment code is normalized for the directory', () => {
  assert.equal(getAssessmentCode({ assessmentCode: 'sec' }), 'SEC');
  assert.equal(getAssessmentCode({ riasecCode: 'ria' }), 'RIA');
  assert.equal(getAssessmentCode({ careerDNA: { riasec: { code: 'sai' } } }), 'SAI');
  assert.equal(getAssessmentCode({ assessmentCode: 'not-a-riasec-code' }), '');
});

test('explicit canonical profile status wins over legacy profileComplete flag', () => {
  assert.equal(getProfileStatus({ profileStatus: 'incomplete', profileComplete: true }), 'incomplete');
  assert.equal(getProfileStatus({ profileStatus: 'complete', profileComplete: false }), 'complete');
  assert.equal(getProfileStatus({}), 'incomplete');
});

test('needs-attention state reflects canonical operational blockers', () => {
  assert.equal(getNeedsAttention({ profileStatus: 'complete', assessmentStatus: 'complete', assignmentStatus: 'assigned', enrollmentStatus: 'active', needsAttention: false }), false);
  assert.equal(getNeedsAttention({ profileStatus: 'incomplete', assessmentStatus: 'complete', assignmentStatus: 'assigned', enrollmentStatus: 'active' }), true);
  assert.equal(getNeedsAttention({ profileStatus: 'complete', assessmentStatus: 'pending', assignmentStatus: 'assigned', enrollmentStatus: 'active' }), true);
  assert.equal(getNeedsAttention({ profileStatus: 'complete', assessmentStatus: 'complete', assignmentStatus: 'unassigned', enrollmentStatus: 'active' }), true);
  assert.equal(getNeedsAttention({ profileStatus: 'complete', assessmentStatus: 'complete', assignmentStatus: 'assigned', enrollmentStatus: 'inactive' }), true);
});

test('last activity sorting uses canonical activity timestamps', () => {
  assert.equal(getSortValue({ lastActivityMs: 1234 }, 'lastActivity'), 1234);
  assert.equal(getSortValue({ updatedAtMs: 4567 }, 'lastActivity'), 4567);
  assert.equal(getSortValue({ createdAtMs: 7890 }, 'lastActivity'), 7890);
});

test('directory projection uses canonical identity and service state', () => {
  const record = toAdminStudentDirectoryRecord({
    uid: 'auth-1',
    ssStudentId: 'SS-0001',
    name: 'Test Student',
    email: 'student@example.com',
    institutionName: 'Example School',
    grade: '11',
    services: { career: { status: 'active' }, wellbeing: { status: 'inactive' }, sen: { status: 'inactive' } },
    relationships: { assignments: { career: 'professional-1' } },
    riasecCode: 'RIA',
    profileComplete: true,
  }, 'auth-1');

  assert.equal(getStudentId(record), 'SS-0001');
  assert.equal(getStudentPath(record), 'career');
  assert.equal(record.assessmentStatus, 'complete');
  assert.equal(record.assessmentCode, 'RIA');
  assert.equal(record.profileStatus, 'complete');
  assert.equal(record.assignmentStatus, 'assigned');
  assert.equal(record.assignedCareerCoachId, 'professional-1');
});

test('directory projection does not treat a legacy profileComplete flag as proof of completeness', () => {
  const record = toAdminStudentDirectoryRecord({
    uid: 'auth-2',
    name: 'Incomplete Student',
    profileComplete: true,
    email: 'student@example.com',
    institutionName: 'Example School',
    grade: '',
  }, 'auth-2');

  assert.equal(record.profileStatus, 'incomplete');
  assert.deepEqual(record.profileMissing, ['grade']);
  assert.equal(record.needsAttention, true);
});
