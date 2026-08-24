import assert from 'node:assert/strict';
import { buildDecisionSupportCoverage } from '../../src/career/decisionSupportCoverage.js';

const report = {
  scores: { riasecCode: 'IRS' },
  intake: { likedSubjects: ['Mathematics'] },
  careerExploration: [{
    name: 'Software Engineer',
    decisionProfile: {
      pathway: { listedStreams: ['Science'], education: '4 years' },
      education: { pathway: 'B.Tech CSE', colleges: ['IIT'] },
    },
  }],
};
const coverage = buildDecisionSupportCoverage(report);
assert.equal(coverage.career_directions.source, 'derived_from_assessment');
assert.equal(coverage.education_roadmap.source, 'career_catalogue');
assert.equal(coverage.stream_subject_scenarios.source, 'career_catalogue');
assert.equal(buildDecisionSupportCoverage({}).career_directions.source, 'unavailable');

console.log('decisionSupportCoverage.test.mjs passed');
