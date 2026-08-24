import assert from 'node:assert/strict';
import { STUDENT_PREMIUM_REPORT } from '../../src/career/reportArchitecture.js';
import { STUDENT_CAREER_ADMIN_CONTRACT, buildInstitutionCareerReflection } from '../../src/institution/careerReportDataContract.js';
import { serializeInstitutionalCareerReport } from '../../src/institution/institutionalCareerReportSerializer.js';

const canonicalIds = STUDENT_PREMIUM_REPORT.map(section => section.id);
const contractIds = STUDENT_CAREER_ADMIN_CONTRACT.map(([id]) => id);
assert.deepEqual(contractIds, canonicalIds, 'Admin contract must cover every canonical Student premium section in canonical order');

const studentReport = serializeInstitutionalCareerReport({
  bundleTitle: 'Complete Career Intelligence',
  executiveSnapshot: { statement: 'Explicit student snapshot' },
  scores: { riasecCode: 'RIA' },
  careerExploration: [{ id: 'career-1', name: 'Example Career', explanation: { whyExplore: 'Evidence-backed reason', whatToCheck: ['Eligibility'] } }],
  topCareerDirections: [{ id: 'top-1', name: 'Explicit top direction' }],
});
const reflection = buildInstitutionCareerReflection(studentReport);
const byId = new Map(reflection.map(row => [row.id, row]));
assert.equal(byId.get('executive_snapshot').available, true);
assert.equal(byId.get('executive_snapshot').value.statement, 'Explicit student snapshot');
assert.equal(byId.get('career_directions').available, true);
assert.equal(byId.get('career_directions').source, 'derived_from_assessment');
assert.equal(byId.get('top_career_directions').available, true);
assert.equal(byId.get('top_career_directions').source, 'derived_from_assessment');
assert.equal(byId.get('education_roadmap').available, false);
assert.equal(byId.get('affordability').available, false);

console.log('studentAdminReportParity.test.mjs passed');
