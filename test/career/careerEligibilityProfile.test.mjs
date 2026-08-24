import assert from 'node:assert/strict';
import {
  normalizeStreams,
  buildCareerEligibilityProfile,
  compareStudentStreamToCareer,
  buildCareerPathwayCheck,
} from '../../src/career/careerEligibilityProfile.js';

const career = {
  id: 'lawyer',
  title: 'Lawyer / Advocate',
  stream: ['Arts', 'Commerce', 'Science'],
  education: '5 yrs (BA LLB / BBA LLB / B.Sc LLB)',
  exams: ['CLAT', 'AILET'],
};

assert.deepEqual(normalizeStreams(['science', 'Humanities', 'commerce']), ['Science', 'Arts', 'Commerce']);
assert.deepEqual(buildCareerEligibilityProfile(career).streams, ['Arts', 'Commerce', 'Science']);
assert.equal(compareStudentStreamToCareer('Science', career).status, 'aligned');
assert.equal(compareStudentStreamToCareer('Vocational', career).status, 'different-pathway');
assert.equal(buildCareerPathwayCheck({ stream: 'Science' }, career).pathwayFeasibility, 'currently-aligned');
assert.equal(buildCareerPathwayCheck({ stream: 'Vocational' }, career).pathwayFeasibility, 'requires-investigation');

console.log('careerEligibilityProfile.test.mjs passed');
