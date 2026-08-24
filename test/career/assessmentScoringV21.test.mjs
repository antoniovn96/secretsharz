import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RIASEC_ITEMS,
  BIG5_ITEMS,
  VALUE_ITEMS,
  REASONING_ITEMS,
  READINESS_ITEMS,
  ENVIRONMENT_ITEMS,
  ADAPTABILITY_ITEMS,
} from '../../src/career/careerAssessmentBlueprint.js';
import { scoreAssessmentV21, SCORING_SCHEMA_VERSION } from '../../src/career/assessmentScoring.js';

function answerAll(items, value = 3) {
  return Object.fromEntries(items.map(item => [item.id, item.type === 'objective' ? item.correct : value]));
}

test('assessment bank has the intended deterministic structure', () => {
  assert.equal(RIASEC_ITEMS.length, 36);
  assert.equal(BIG5_ITEMS.length, 30);
  assert.equal(VALUE_ITEMS.length, 12);
  assert.equal(REASONING_ITEMS.length, 12);
  assert.equal(READINESS_ITEMS.length, 10);
  assert.equal(ENVIRONMENT_ITEMS.length, 8);
  assert.equal(ADAPTABILITY_ITEMS.length, 8);
});

test('complete RIASEC is scored only after all 36 responses are present', () => {
  const answers = answerAll(RIASEC_ITEMS, 3);
  const result = scoreAssessmentV21(answers, { selectedFamilyIds: ['interest'] });
  assert.equal(result.scoringSchemaVersion, SCORING_SCHEMA_VERSION);
  assert.equal(result.quality.riasec.complete, true);
  assert.deepEqual(result.riasecPercent, { R:50, I:50, A:50, S:50, E:50, C:50 });
  assert.equal(result.riasecCode, 'RIA');
  assert.equal(result.assessmentStatus, 'complete');
});

test('a missing RIASEC response produces no psychometric-looking RIASEC score', () => {
  const answers = answerAll(RIASEC_ITEMS, 3);
  delete answers.riasec_1;
  const result = scoreAssessmentV21(answers, { selectedFamilyIds: ['interest'] });
  assert.equal(result.quality.riasec.complete, false);
  assert.equal(result.riasec, null);
  assert.equal(result.riasecCode, null);
  assert.equal(result.assessmentStatus, 'incomplete');
});

test('complete Big Five returns 0-100 trait scores from 1-5 means', () => {
  const result = scoreAssessmentV21(answerAll(BIG5_ITEMS, 4), { selectedFamilyIds: ['personality'] });
  assert.equal(result.quality.big5.complete, true);
  assert.deepEqual(result.big5Percent, { O:75, C:75, E:75, A:75, N:75 });
  assert.equal(result.assessmentStatus, 'complete');
});

test('partial work-values data is descriptive progress, not an assessed result', () => {
  const answers = answerAll(VALUE_ITEMS, 5);
  delete answers.value_12;
  const result = scoreAssessmentV21(answers, { selectedFamilyIds: ['work_values'] });
  assert.equal(result.quality.values.complete, false);
  assert.equal(result.values, null);
  assert.equal(result.assessmentStatus, 'incomplete');
});

test('reasoning uses one mark per item, no negative marking, and requires all items', () => {
  const answers = answerAll(REASONING_ITEMS);
  const result = scoreAssessmentV21(answers, { selectedFamilyIds: ['aptitude_skills'] });
  assert.equal(result.reasoning.rawScore, 12);
  assert.equal(result.reasoning.maxScore, 12);
  assert.equal(result.reasoning.percent, 100);
  assert.equal(result.reasoning.marking, '1 mark per correct response; no negative marking');

  delete answers.reason_12;
  const incomplete = scoreAssessmentV21(answers, { selectedFamilyIds: ['aptitude_skills'] });
  assert.equal(incomplete.reasoning.status, 'not_scored');
  assert.equal(incomplete.reasoning.percent, null);
});

test('full guidance is not silently scored unless every guidance scale is complete', () => {
  const answers = {
    ...answerAll(RIASEC_ITEMS),
    ...answerAll(BIG5_ITEMS),
    ...answerAll(VALUE_ITEMS),
    ...answerAll(REASONING_ITEMS),
    ...answerAll(READINESS_ITEMS),
    ...answerAll(ENVIRONMENT_ITEMS),
    ...answerAll(ADAPTABILITY_ITEMS),
  };
  const result = scoreAssessmentV21(answers, {
    selectedFamilyIds: ['interest','personality','aptitude_skills','work_values','learning'],
    fullGuidance: true,
  });
  assert.equal(result.quality.readiness.complete, true);
  assert.equal(result.quality.environment.complete, true);
  assert.equal(result.quality.adaptability.complete, true);
  assert.equal(result.assessmentStatus, 'incomplete');
  // Learning is selected but its ten items are intentionally absent here.
  assert.equal(result.quality.learning.complete, false);
});
