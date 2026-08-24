import assert from 'node:assert/strict';
import { buildDecisionSupportCoverage } from '../../src/career/decisionSupportCoverage.js';
import { buildInstitutionCareerReflection } from '../../src/institution/careerReportDataContract.js';
import { getInstitutionCareerReportStatus } from '../../src/institution/careerReportContractStatus.js';

const report = {
  scores: {
    riasecCode: 'RIA',
    reasoning: { percent: 72 },
    readinessPercent: 68,
  },
  careerExploration: [{
    name: 'Software Engineer',
    decisionProfile: {
      pathway: { listedStreams: ['Science'], education: 'B.Tech' },
      education: { pathway: 'B.Tech CSE', colleges: ['Example College'] },
    },
  }],
  intake: { likedSubjects: ['Mathematics'] },
};

const decision = buildDecisionSupportCoverage(report);
assert.equal(decision.career_directions.source, 'derived_from_assessment');
assert.equal(decision.education_roadmap.source, 'career_catalogue');
assert.equal(decision.stream_subject_scenarios.source, 'career_catalogue');

const rows = buildInstitutionCareerReflection(report);
const byId = new Map(rows.map(row => [row.id, row]));
assert.equal(byId.get('riasec_profile').source, 'assessed');
assert.equal(byId.get('reasoning_profile').source, 'assessed');
assert.equal(byId.get('career_directions').source, 'derived_from_assessment');
assert.equal(byId.get('education_roadmap').available, false);
assert.equal(byId.get('education_roadmap').source, 'unavailable');
assert.equal(byId.get('stream_analysis').available, false);
assert.equal(byId.get('stream_analysis').source, 'unavailable');

const status = getInstitutionCareerReportStatus(report);
assert.ok(status.assessedSections >= 3);
assert.ok(status.derivedSections >= 1);
assert.ok(status.unavailableSections > 0);
assert.equal(status.totalSections, 20);

const contextOnly = buildDecisionSupportCoverage({ intake: { likedSubjects: ['Mathematics'] } });
assert.equal(contextOnly.stream_subject_scenarios.source, 'unavailable');

console.log('reportProvenanceEndToEnd.test.mjs passed');
