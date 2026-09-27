import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CAREER_ASSESSMENT_COUNT,
  CANONICAL_CAREER_ASSESSMENTS,
  CAREER_SUPPORTING_LAYERS,
  CAREER_DIRECTION_TRIO_MODULE_IDS,
  FULL_CAREER_INTELLIGENCE_MODULE_IDS,
  getCanonicalCareerAssessment,
  getCareerAssessmentPortfolioSummary,
} from '../../src/career/canonicalAssessmentPortfolio.js';

test('canonical source-defined assessment portfolio contains 17 independent assessments', () => {
  assert.equal(CAREER_ASSESSMENT_COUNT, 17);
  assert.equal(CANONICAL_CAREER_ASSESSMENTS.length, 17);
  assert.equal(new Set(CANONICAL_CAREER_ASSESSMENTS.map((x) => x.id)).size, 17);
});

test('career narrative and context remain supporting layers rather than hidden assessments', () => {
  assert.deepEqual(
    CAREER_SUPPORTING_LAYERS.map((x) => x.category),
    ['supporting', 'context'],
  );
  assert.ok(!CANONICAL_CAREER_ASSESSMENTS.some((x) => x.id === 'career_narrative_aspirations'));
  assert.ok(!CANONICAL_CAREER_ASSESSMENTS.some((x) => x.id === 'context_constraints'));
});

test('Career Direction Trio is exactly Interest + Aptitude + Values', () => {
  assert.deepEqual(CAREER_DIRECTION_TRIO_MODULE_IDS, [
    'career_interest_inventory',
    'career_aptitude',
    'career_values',
  ]);
});

test('Full Career Intelligence is based on every canonical assessment module', () => {
  assert.equal(FULL_CAREER_INTELLIGENCE_MODULE_IDS.length, 17);
  assert.equal(
    new Set(FULL_CAREER_INTELLIGENCE_MODULE_IDS).size,
    17,
  );
});

test('all canonical assessments remain individually discoverable', () => {
  for (const assessment of CANONICAL_CAREER_ASSESSMENTS) {
    assert.equal(getCanonicalCareerAssessment(assessment.id)?.id, assessment.id);
    assert.equal(assessment.category, 'assessment');
    assert.equal(assessment.independentlyPurchasable, true);
    assert.equal(assessment.bundleEligible, true);
  }
});

test('portfolio summary exposes the locked scope without claiming validation', () => {
  const summary = getCareerAssessmentPortfolioSummary();
  assert.equal(summary.assessmentCount, 17);
  assert.equal(summary.supportingLayerCount, 2);
  assert.ok(
    CANONICAL_CAREER_ASSESSMENTS.every(
      (assessment) => assessment.psychometricStatus === 'not_validated' ||
        assessment.psychometricStatus === 'draft_not_validated',
    ),
  );
});
