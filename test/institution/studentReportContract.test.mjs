import assert from 'node:assert/strict';
import { serializeInstitutionalCareerReport } from '../../src/institution/institutionalCareerReportSerializer.js';
import { getAssessmentEvidenceCoverage } from '../../src/career/assessmentCoverage.js';

const source = {
  version: 'v2', bundleId: 'full', intake: { stream: 'Science', likedSubjects: ['Math'], privateClinicalField: 'should-not-pass' },
  scores: { riasec: { R: 4 }, riasecCode: 'RIA', big5: { openness: 4 }, privateToken: 'should-not-pass' },
  careerExploration: [{ id: 'software', name: 'Software Engineer', interestAlignmentIndex: 82, decisionProfile: { pathway: { listedStreams: ['Science'] } } }],
  decisionSupportCoverage: { career_directions: { source: 'derived_from_assessment' } }, reflection: { statement: 'Career reflection' },
  counsellingRecords: { diagnosis: 'must-not-pass' }, senRecords: { plan: 'must-not-pass' },
};
const report = serializeInstitutionalCareerReport(source);
assert.equal(report.intake.privateClinicalField, undefined);
assert.equal(report.scores.privateToken, undefined);
assert.equal(report.counsellingRecords, undefined);
assert.equal(report.senRecords, undefined);
assert.equal(report.careerExploration[0].interestAlignmentIndex, 82);
assert.equal(report.decisionSupportCoverage.career_directions.source, 'derived_from_assessment');
const coverage = getAssessmentEvidenceCoverage(report);
assert.equal(coverage.sections.find(x => x.id === 'riasec_profile')?.assessed, true);
assert.equal(coverage.sections.find(x => x.id === 'career_directions')?.assessed, true);

console.log('studentReportContract.test.mjs passed');
