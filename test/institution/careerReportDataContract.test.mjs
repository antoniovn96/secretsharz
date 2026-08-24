import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInstitutionCareerReflection, readReportField } from '../../src/institution/careerReportDataContract.js';

const section = (result, id) => result.find(item => item.id === id);

test('empty serialized containers do not count as report evidence', () => {
  const report = {
    scores: {
      riasec: {},
      big5: {},
      values: {},
      reasoning: {},
      readiness: {},
      adaptability: {},
      environment: {},
      workEnvironment: {},
    },
    topCareerDirections: [],
    alternativeCareers: [],
    pathwayAnalysis: {},
    pathways: [],
    streamAnalysis: {},
    streamScenarios: [],
    educationRoadmap: {},
    education: {},
    skillsEvidence: {},
    skillsPlan: {},
    affordability: {},
    friction: {},
    actionRoadmap: {},
    actionPlan: {},
    counsellorReview: {},
    reviewLimitations: {},
    careerExploration: [],
  };

  const reflection = buildInstitutionCareerReflection(report);

  for (const id of [
    'riasec_profile', 'personality_profile', 'career_values', 'reasoning_profile',
    'decision_readiness', 'adaptability', 'work_environment', 'top_career_directions',
    'alternative_careers', 'pathway_analysis', 'stream_analysis', 'education_roadmap',
    'skills_evidence', 'affordability', 'action_roadmap', 'counsellor_review'
  ]) {
    assert.equal(section(reflection, id).available, false, `${id} should be unavailable`);
  }
});

test('assessment-gated empty fields are explicitly not assessed', () => {
  const reflection = buildInstitutionCareerReflection({
    scores: { riasec: {}, big5: {}, values: {}, reasoning: {} }
  });

  assert.equal(section(reflection, 'riasec_profile').source, 'not_assessed');
  assert.equal(section(reflection, 'personality_profile').source, 'not_assessed');
  assert.equal(section(reflection, 'career_values').source, 'not_assessed');
  assert.equal(section(reflection, 'reasoning_profile').source, 'not_assessed');
});

test('meaningful arrays and objects remain available', () => {
  const report = {
    topCareerDirections: [{ name: 'Engineer' }],
    scores: { values: { autonomy: 4 } },
    careerExploration: [{ name: 'Engineer' }]
  };

  const reflection = buildInstitutionCareerReflection(report);

  assert.equal(section(reflection, 'top_career_directions').available, true);
  assert.deepEqual(readReportField(report, ['scores.values']), { autonomy: 4 });
});
