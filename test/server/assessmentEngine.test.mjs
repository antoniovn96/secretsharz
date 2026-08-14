import { strict as assert } from 'node:assert';
import {
  ASSESSMENT_VERSION,
  buildAssessmentAttempt,
  buildResult,
  scoreRiasec,
  validateCandidateContext,
} from '../../src/career/assessmentEngine.js';

test('validates student and working-professional entry statuses', () => {
  assert.deepEqual(validateCandidateContext({ status: 'student', age: 16 }), { status: 'student', age: 16 });
  assert.deepEqual(validateCandidateContext({ status: 'working_professional', age: 31 }), { status: 'working_professional', age: 31 });
  assert.throws(() => validateCandidateContext({ status: 'parent', age: 31 }));
});

test('builds a versioned assessment attempt with student context', () => {
  const attempt = buildAssessmentAttempt({
    personId: 'student-1',
    status: 'student',
    age: 16,
    likes: ['biology', 'helping people'],
    dislikes: ['repetitive paperwork'],
    goals: ['meaningful work'],
    favouriteSubjects: ['biology'],
    marks: { biology: 88, english: 82 },
    answers: { q1: 5 },
  });
  assert.equal(attempt.assessmentVersion, ASSESSMENT_VERSION);
  assert.equal(attempt.resultAccess, 'partial');
  assert.equal(attempt.candidate.favouriteSubjects[0], 'biology');
});

test('working professionals do not require school-subject context', () => {
  const attempt = buildAssessmentAttempt({
    personId: 'worker-1',
    status: 'working_professional',
    age: 29,
    likes: ['design'],
    goals: ['career change'],
    answers: {},
  });
  assert.deepEqual(attempt.candidate.favouriteSubjects, []);
});

test('generates a stable Holland code', () => {
  const map = {
    q1: { code: 'I', weight: 1 },
    q2: { code: 'I', weight: 1 },
    q3: { code: 'S', weight: 1 },
    q4: { code: 'R', weight: 1 },
  };
  const result = scoreRiasec({ q1: 5, q2: 4, q3: 4, q4: 3 }, map);
  assert.equal(result.hollandCode, 'ISR');
});

test('unpaid result exposes only the partial layer', () => {
  const attempt = buildAssessmentAttempt({
    personId: 'student-2', status: 'student', age: 15,
    answers: { q1: 5 },
  });
  const result = buildResult({
    attempt,
    questionMap: { q1: { code: 'S', dimension: 'interests', weight: 1 } },
    careerMatches: [{ id: 'doctor' }],
    courses: [{ id: 'course-1' }],
    colleges: [{ id: 'college-1' }],
  });
  assert.equal(result.access, 'partial');
  assert.equal(result.lockedSections.includes('college_matches'), true);
  assert.equal('colleges' in result, false);
});

test('paid result exposes careers, courses and colleges', () => {
  const attempt = buildAssessmentAttempt({
    personId: 'student-3', status: 'student', age: 17,
    paymentStatus: 'paid',
    answers: { q1: 5 },
  });
  const result = buildResult({
    attempt,
    questionMap: { q1: { code: 'I', dimension: 'interests', weight: 1 } },
    careerMatches: [{ id: 'data-scientist' }],
    courses: [{ id: 'course-1' }],
    colleges: [{ id: 'college-1' }],
  });
  assert.equal(result.access, 'full');
  assert.equal(result.careerMatches[0].id, 'data-scientist');
  assert.equal(result.colleges[0].id, 'college-1');
  assert.match(result.disclaimer, /based on the answers you provided/i);
});
