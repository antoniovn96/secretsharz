import test from 'node:test';
import assert from 'node:assert/strict';
import { getAssessmentEvidenceCoverage } from '../../src/career/assessmentCoverage.js';

test('current V2 payload reports only evidence actually present', () => {
  const report = {
    intake: { className: '10' },
    scores: { riasecCode: 'RIA', readinessPercent: 72, reasoning: { percent: 68 } },
    careerExploration: [{ name: 'Engineer' }],
    reflection: { recommendedNextStep: 'Explore' }
  };
  const result = getAssessmentEvidenceCoverage(report);
  const byId = Object.fromEntries(result.sections.map(x => [x.id, x.assessed]));
  assert.equal(byId.developmental_context, true);
  assert.equal(byId.riasec_profile, true);
  assert.equal(byId.reasoning_profile, true);
  assert.equal(byId.decision_readiness, true);
  assert.equal(byId.career_directions, true);
  assert.equal(byId.action_roadmap, true);
  assert.equal(byId.personality_profile, false);
  assert.equal(byId.career_values, false);
});

test('empty V2 report has no assessed evidence families', () => {
  const result = getAssessmentEvidenceCoverage({});
  assert.equal(result.assessedFamilies, 0);
  assert.equal(result.unassessedFamilies, result.totalFamilies);
});
