import test from 'node:test';
import assert from 'node:assert/strict';

function canonicalAssignmentId(assignment) {
  if (!assignment || assignment.status === 'inactive') return '';
  if (typeof assignment === 'string') return assignment;
  return String(assignment.primaryProfessionalId || assignment.professionalId || '').trim();
}

function assessmentStatus(student) {
  if (student.assessmentStatus === 'complete' || student.assessmentStatus === 'pending') return student.assessmentStatus;
  return student.assessmentCode || student.riasecCode ? 'complete' : 'pending';
}

function profileStatus(student) {
  if (student.profileStatus === 'complete' || student.profileStatus === 'incomplete') return student.profileStatus;
  return student.profileComplete === true ? 'complete' : 'incomplete';
}

test('canonical assignment object resolves to the assigned professional', () => {
  const student = {
    relationships: {
      assignments: {
        career: {
          professionalId: 'career-b',
          primaryProfessionalId: 'career-b',
          status: 'active'
        }
      }
    }
  };
  assert.equal(canonicalAssignmentId(student.relationships.assignments.career), 'career-b');
});

test('inactive canonical assignment does not resolve to an active professional', () => {
  const assignment = {
    professionalId: 'career-a',
    primaryProfessionalId: 'career-a',
    status: 'inactive'
  };
  assert.equal(canonicalAssignmentId(assignment), '');
});

test('legacy string assignment remains readable during migration', () => {
  assert.equal(canonicalAssignmentId('career-a'), 'career-a');
});

test('assessment status does not become complete without an assessment code', () => {
  assert.equal(assessmentStatus({}), 'pending');
  assert.equal(assessmentStatus({ riasecCode: 'RIA' }), 'complete');
  assert.equal(assessmentStatus({ assessmentCode: 'SEC' }), 'complete');
});

test('explicit canonical assessment status wins over legacy inference', () => {
  assert.equal(assessmentStatus({ assessmentStatus: 'pending', riasecCode: 'RIA' }), 'pending');
  assert.equal(assessmentStatus({ assessmentStatus: 'complete' }), 'complete');
});

test('explicit canonical profile status wins over legacy profileComplete flag', () => {
  assert.equal(profileStatus({ profileStatus: 'incomplete', profileComplete: true }), 'incomplete');
  assert.equal(profileStatus({ profileStatus: 'complete', profileComplete: false }), 'complete');
});

test('missing profile status is incomplete rather than silently complete', () => {
  assert.equal(profileStatus({}), 'incomplete');
});
