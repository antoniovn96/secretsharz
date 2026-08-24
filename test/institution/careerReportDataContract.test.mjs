import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInstitutionCareerReflection, readReportField } from '../../src/institution/careerReportDataContract.js';

const section = (result, id) => result.find(item => item.id === id);

test('empty serialized containers do not count as report evidence', () => {
  const report = { scores: { riasec: {}, big5: {}, values: {}, reasoning: {}, readiness: {}, adaptability: {}, environment: {}, workEnvironment: {} }, topCareerDirections: [], alternativeCareers: [], pathwayAnalysis: {}, pathways: [], streamAnalysis: {}, streamScenarios: [], educationRoadmap: {}, education: {}, skillsEvidence: {}, skillsPlan: {}, affordability: {}, friction: {}, actionRoadmap: {}, actionPlan: {}, counsellorReview: {}, reviewLimitations: {}, careerExploration: [] };
  const reflection = buildInstitutionCareerReflection(report);
  for (const id of ['riasec_profile','personality_profile','career_values','reasoning_profile','decision_readiness','adaptability','work_environment','top_career_directions','alternative_careers','pathway_analysis','stream_analysis','education_roadmap','skills_evidence','affordability','action_roadmap','counsellor_review']) assert.equal(section(reflection, id).available, false, `${id} should be unavailable`);
});

test('assessment-gated empty fields are explicitly not assessed', () => {
  const reflection = buildInstitutionCareerReflection({ scores: { riasec: {}, big5: {}, values: {}, reasoning: {} } });
  for (const id of ['riasec_profile','personality_profile','career_values','reasoning_profile']) assert.equal(section(reflection, id).source, 'not_assessed');
});

test('stale assessment-gated values cannot be promoted without current evidence', () => {
  const reflection = buildInstitutionCareerReflection({ scores: { riasecCode: 'RIA', big5: { openness: 4 }, values: { autonomy: 4 }, reasoning: { percent: 70 } } });
  for (const id of ['riasec_profile','personality_profile','career_values','reasoning_profile']) { assert.equal(section(reflection, id).available, false, `${id} should require current evidence`); assert.equal(section(reflection, id).source, 'not_assessed'); }
});

test('interests and personality is partially assessed when only RIASEC is assessed', () => {
  const reflection = buildInstitutionCareerReflection({ selectedFamilyIds: ['interest'], scores: { riasecCode: 'RIA' } });
  assert.equal(section(reflection, 'interest_personality').available, true);
  assert.equal(section(reflection, 'interest_personality').source, 'partially_assessed');
});

test('interests and personality is partially assessed when only Big Five is assessed', () => {
  const reflection = buildInstitutionCareerReflection({ selectedFamilyIds: ['personality'], scores: { big5: { openness: 4 } } });
  assert.equal(section(reflection, 'interest_personality').available, true);
  assert.equal(section(reflection, 'interest_personality').source, 'partially_assessed');
});

test('interests and personality is fully assessed when both components are assessed', () => {
  const reflection = buildInstitutionCareerReflection({ selectedFamilyIds: ['interest','personality'], scores: { riasecCode: 'RIA', big5: { openness: 4 } } });
  assert.equal(section(reflection, 'interest_personality').available, true);
  assert.equal(section(reflection, 'interest_personality').source, 'assessed');
});

test('interests and personality is not assessed when neither component is assessed', () => {
  const reflection = buildInstitutionCareerReflection({ selectedFamilyIds: ['interest'], scores: {} });
  assert.equal(section(reflection, 'interest_personality').available, false);
  assert.equal(section(reflection, 'interest_personality').source, 'not_assessed');
});

test('executive bundle metadata alone does not establish an executive snapshot', () => {
  const reflection = buildInstitutionCareerReflection({ bundleTitle: 'Premium Career Assessment' });
  assert.equal(section(reflection, 'executive_snapshot').available, false);
  assert.equal(section(reflection, 'executive_snapshot').source, 'unavailable');
});

test('meaningful arrays and objects remain available', () => {
  const report = { topCareerDirections: [{ name: 'Engineer' }], scores: { values: { autonomy: 4 } }, careerExploration: [{ name: 'Engineer' }] };
  const reflection = buildInstitutionCareerReflection(report);
  assert.equal(section(reflection, 'top_career_directions').available, true);
  assert.deepEqual(readReportField(report, ['scores.values']), { autonomy: 4 });
});
