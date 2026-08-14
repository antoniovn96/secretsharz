// Canonical persistence shape for career assessment attempts/results.
// Sensitive responses belong in the protected assessments domain.

import { ASSESSMENT_VERSION } from './assessmentEngine';

export const ASSESSMENT_COLLECTIONS = Object.freeze({
  attempts: 'assessments',
  results: 'assessmentResults',
});

export function createAssessmentAttemptRecord({ attemptId, personId, status, age, input, answers, paymentStatus = 'unpaid' }) {
  if (!attemptId || !personId) throw new Error('attemptId and personId are required.');
  return {
    attemptId,
    personId,
    assessmentVersion: ASSESSMENT_VERSION,
    status,
    age,
    input: {
      likes: Array.isArray(input?.likes) ? input.likes : [],
      dislikes: Array.isArray(input?.dislikes) ? input.dislikes : [],
      goals: Array.isArray(input?.goals) ? input.goals : [],
      favouriteSubjects: Array.isArray(input?.favouriteSubjects) ? input.favouriteSubjects : [],
      marks: input?.marks && typeof input.marks === 'object' ? input.marks : {},
    },
    answers: answers && typeof answers === 'object' ? answers : {},
    paymentStatus,
    completed: false,
    createdAt: null,
    completedAt: null,
  };
}

export function createAssessmentResultRecord({ attemptId, personId, access, result }) {
  if (!attemptId || !personId) throw new Error('attemptId and personId are required.');
  if (!['partial', 'full'].includes(access)) throw new Error('access must be partial or full.');
  return {
    attemptId,
    personId,
    assessmentVersion: ASSESSMENT_VERSION,
    access,
    result,
    generatedAt: null,
  };
}
