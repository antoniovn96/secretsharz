import assert from 'node:assert/strict';
import { buildCareerDecisionResult } from '../../src/career/careerDecisionContract.js';

const career = {
  id: 'software', title: 'Software Engineer', category: 'Technology', stream: ['Science'],
  riasec: ['I', 'R'], education: '4 yrs (B.Tech CSE / BCA)', exams: ['JEE Main'],
  growth: 'Very High', salaryEntry: 6, salaryMid: 22, salarySenior: 60,
  skills: ['Coding'], description: 'Build software.', dayInLife: 'Code.', pros: ['Growth'], cons: ['Upskilling'], colleges: ['IIT Bombay'],
};
const result = buildCareerDecisionResult(career, { stream: 'Science' }, {
  interestAlignmentIndex: 82,
  explanation: { studentTopInterests: ['I', 'R'], careerInterestProfile: ['I', 'R'], overlappingInterests: ['I', 'R'] },
});
assert.equal(result.id, 'software');
assert.equal(result.interestAlignmentIndex, 82);
assert.equal(result.scoreLabel, 'Interest Alignment Index');
assert.equal(result.decisionProfile.pathway.status, 'currently-aligned');
assert.deepEqual(result.evidenceUsed.overlappingInterests, ['I', 'R']);
assert.match(result.explanation.whyExplore, /RIASEC/);

console.log('careerDecisionContract.test.mjs passed');
