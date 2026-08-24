import assert from 'node:assert/strict';
import { buildCareerDecisionResult } from '../../src/career/careerDecisionContract.js';

const career = { id: 'one', title: 'One', category: 'Technology', stream: ['Science'], riasec: ['I','R'], education: '4 years', exams: ['EXAM'] };
const match = { interestAlignmentIndex: 81, explanation: { studentTopInterests: ['I','R'], careerInterestProfile: ['I','R'], overlappingInterests: ['I','R'] } };
const studentResult = buildCareerDecisionResult(career, { stream: 'Science' }, match);
const adminResult = buildCareerDecisionResult(career, { stream: 'Science' }, match);
assert.deepEqual(adminResult, studentResult);
assert.equal(adminResult.decisionProfile.pathway.status, 'currently-aligned');
assert.equal(adminResult.scoreLabel, 'Interest Alignment Index');
assert.deepEqual(adminResult.evidenceUsed, studentResult.evidenceUsed);

console.log('careerDecisionStudentAdminContract.test.mjs passed');
