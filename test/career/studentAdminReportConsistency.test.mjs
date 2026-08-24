import test from 'node:test';
import assert from 'node:assert/strict';
import { STUDENT_PREMIUM_REPORT, PREMIUM_REPORT_PAGE_COUNT, getCanonicalStudentPremiumPageCount } from '../../src/career/reportArchitecture.js';
import { STUDENT_CAREER_ADMIN_CONTRACT, buildInstitutionCareerReflection } from '../../src/institution/careerReportDataContract.js';
import { getInstitutionCareerReportStatus } from '../../src/institution/careerReportContractStatus.js';

test('student premium report and admin contract contain the same section ids', () => {
  const studentIds = STUDENT_PREMIUM_REPORT.map(section => section.id);
  const adminIds = STUDENT_CAREER_ADMIN_CONTRACT.map(([id]) => id);
  assert.deepEqual(adminIds.sort(), studentIds.sort());
});

test('admin contract has one and only one mapping per student report section', () => {
  const ids = STUDENT_CAREER_ADMIN_CONTRACT.map(([id]) => id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, STUDENT_PREMIUM_REPORT.length);
});

test('premium report page count matches the canonical student section list', () => {
  assert.equal(PREMIUM_REPORT_PAGE_COUNT, STUDENT_PREMIUM_REPORT.length);
  assert.equal(getCanonicalStudentPremiumPageCount(), STUDENT_PREMIUM_REPORT.length);
  assert.equal(STUDENT_PREMIUM_REPORT.length, 20);
});

test('admin mappings have a title and at least one approved evidence path', () => {
  for (const [id, title, paths] of STUDENT_CAREER_ADMIN_CONTRACT) {
    assert.ok(id, 'missing section id');
    assert.ok(title, `missing title for ${id}`);
    assert.ok(Array.isArray(paths) && paths.length > 0, `missing evidence paths for ${id}`);
  }
});

test('admin contract does not infer unsupported premium sections from contextual fields', () => {
  const report = {
    intake: { goal: 'I want to become a doctor', stream: 'Science' },
    scores: { riasecCode: 'RIA' },
    careerExploration: [{ name: 'Engineer' }],
    reflection: { recommendedNextStep: 'Explore' }
  };
  const rows = buildInstitutionCareerReflection(report);
  const byId = Object.fromEntries(rows.map(row => [row.id, row]));
  assert.equal(byId.work_environment.available, false);
  assert.equal(byId.stream_analysis.available, false);
  assert.equal(byId.alternative_careers.available, false);
  assert.equal(byId.education_roadmap.available, false);
  assert.equal(byId.affordability.available, false);
  assert.equal(byId.pathway_analysis.available, false);
});

test('assessment-gated sections distinguish not assessed from unavailable', () => {
  const rows = buildInstitutionCareerReflection({ intake: { goal: 'Explore medicine' } });
  const byId = Object.fromEntries(rows.map(row => [row.id, row]));
  assert.equal(byId.riasec_profile.source, 'not_assessed');
  assert.equal(byId.personality_profile.source, 'not_assessed');
  assert.equal(byId.career_values.source, 'not_assessed');
  assert.equal(byId.decision_readiness.source, 'not_assessed');
  assert.equal(byId.education_roadmap.source, 'unavailable');
});

test('canonical coverage always contains all 20 sections and preserves status semantics', () => {
  const status = getInstitutionCareerReportStatus({ intake: { goal: 'Explore medicine' } });
  assert.equal(status.totalSections, 20);
  assert.equal(status.sections.length, 20);
  assert.equal(status.notAssessedSections > 0, true);
  assert.equal(status.unavailableSections > 0, true);
  assert.equal(status.sections.some(section => section.source === 'not_assessed'), true);
  assert.equal(status.sections.some(section => section.source === 'unavailable'), true);
});
