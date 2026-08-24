import assert from 'node:assert/strict';
import { buildCareerPathwaySummary } from '../../src/career/careerPathwayCheck.js';

const career = { id: 'software', title: 'Software Engineer', stream: ['Science'], education: '4 yrs (B.Tech CSE / BCA)', exams: ['JEE Main', 'BITSAT'] };

const aligned = buildCareerPathwaySummary({ stream: 'Science' }, career);
assert.equal(aligned.pathwayFeasibility, 'currently-aligned');
assert.equal(aligned.isCareerFitEvidence, false);
assert.match(aligned.statusLabel, /aligns/i);

const different = buildCareerPathwaySummary({ stream: 'Commerce' }, career);
assert.equal(different.pathwayFeasibility, 'requires-investigation');
assert.match(different.disclaimer, /not a measure of career fit/i);

const unknown = buildCareerPathwaySummary({}, career);
assert.equal(unknown.pathwayFeasibility, 'unknown');

console.log('careerPathwayCheck.test.mjs passed');
