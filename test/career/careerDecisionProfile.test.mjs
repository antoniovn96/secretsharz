import assert from 'node:assert/strict';
import { buildCareerDecisionProfile, buildCareerDecisionExplanation } from '../../src/career/careerDecisionProfile.js';

const career = {
  id: 'software', title: 'Software Engineer', category: 'Technology',
  stream: ['Science'], riasec: ['I', 'R'],
  education: '4 yrs (B.Tech CSE / BCA)', exams: ['JEE Main', 'BITSAT'],
  growth: 'Very High', salaryEntry: 6, salaryMid: 22, salarySenior: 60,
  skills: ['Coding', 'Algorithms'], description: 'Build software.',
  dayInLife: 'Code and collaborate.', pros: ['Growth'], cons: ['Upskilling'], colleges: ['IIT Bombay'],
};

const profile = buildCareerDecisionProfile(career, { stream: 'Science' });
assert.deepEqual(profile.fit.quantitativeEvidence, ['riasec']);
assert.equal(profile.fit.unavailablePsychometricDimensions.includes('values'), true);
assert.equal(profile.pathway.status, 'currently-aligned');
assert.equal(profile.market.growth, 'Very High');
assert.equal(profile.market.isCareerFitEvidence, false);

const explanation = buildCareerDecisionExplanation(profile, { overlappingInterests: ['I'] });
assert.match(explanation.whyExplore, /RIASEC/);
assert.equal(explanation.whatToCheck.length, 3);

console.log('careerDecisionProfile.test.mjs passed');
