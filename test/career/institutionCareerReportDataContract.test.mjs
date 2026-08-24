import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInstitutionCareerReflection } from '../../src/institution/careerReportDataContract.js';

test('institution contract reads the persisted careerAssessmentV2 shape', () => {
  const report = {
    bundleTitle: 'Student Career Intelligence',
    intake: { educationStage: 'secondary', className: '10', stream: 'science', likedSubjects: ['Maths'] },
    scores: { riasecCode: 'RIA', riasec: { R: 70, I: 60, A: 50 }, readinessPercent: 72 },
    careerExploration: [{ name: 'Engineer', explorationIndex: 82 }],
    reflection: { recommendedNextStep: 'Explore two pathways.' }
  };
  const result = buildInstitutionCareerReflection(report);
  const byId = Object.fromEntries(result.map(section => [section.id, section]));
  assert.equal(byId.developmental_context.available, true);
  assert.equal(byId.riasec_profile.available, true);
  assert.equal(byId.career_directions.available, true);
  assert.equal(byId.action_roadmap.available, true);
  assert.equal(byId.personality_profile.available, false);
  assert.equal(byId.education_roadmap.available, false);
});

test('missing report evidence is not converted into a result', () => {
  const result = buildInstitutionCareerReflection({});
  assert.equal(result.every(section => section.available === false), true);
});
