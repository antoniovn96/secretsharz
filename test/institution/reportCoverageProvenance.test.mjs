import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInstitutionCareerReflection } from '../../src/institution/careerReportDataContract.js';
import { getInstitutionCareerReportStatus } from '../../src/institution/careerReportContractStatus.js';

const report = {
  bundleTitle: 'Career Discovery',
  intake: { className: '10', likedSubjects: ['Mathematics'] },
  scores: {
    riasecCode: 'IRS',
    reasoning: { percent: 68 },
    readiness: { score: 72 },
    values: { autonomy: 80 },
  },
  careerExploration: [{
    name: 'Software Engineer',
    decisionProfile: {
      pathway: { listedStreams: ['Science'], education: '4 years' },
      education: { pathway: 'B.Tech CSE', colleges: ['IIT'] },
    },
  }],
  educationRoadmap: { note: 'Explicit roadmap output' },
};

test('coverage distinguishes assessed, derived and catalogue evidence', () => {
  const rows = Object.fromEntries(buildInstitutionCareerReflection(report).map(row => [row.id, row]));
  assert.equal(rows.riasec_profile.source, 'assessed');
  assert.equal(rows.reasoning_profile.source, 'assessed');
  assert.equal(rows.decision_readiness.source, 'assessed');
  assert.equal(rows.career_directions.source, 'derived_from_assessment');
  assert.equal(rows.education_roadmap.source, 'career_catalogue');
  assert.equal(rows.personality_profile.source, 'unavailable');
});

test('availability does not imply independent assessment', () => {
  const status = getInstitutionCareerReportStatus(report);
  assert.equal(status.sections.some(row => row.available && row.source !== 'assessed'), true);
  assert.equal(status.assessedSections < status.availableSections, true);
});

console.log('reportCoverageProvenance.test.mjs passed');
