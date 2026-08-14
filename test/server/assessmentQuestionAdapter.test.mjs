import { strict as assert } from 'node:assert';
import { CANONICAL_QUESTION_MAP, getCanonicalQuestion } from '../../src/career/assessmentQuestionAdapter.js';

 test('adapts the existing RIASEC bank into the canonical engine shape', () => {
  const question = getCanonicalQuestion('r_01');
  assert.equal(question.id, 'r_01');
  assert.equal(question.dimension, 'interests');
  assert.equal(question.code, 'R');
  assert.equal(question.scaleMin, 1);
  assert.equal(question.scaleMax, 5);
});

test('adapts maturity and resilience items without changing source wording', () => {
  assert.equal(getCanonicalQuestion('dem_05').dimension, 'decision_maturity');
  assert.equal(getCanonicalQuestion('dem_08').dimension, 'work_style');
  assert.equal(getCanonicalQuestion('dem_09').dimension, 'resilience');
  assert.equal(getCanonicalQuestion('dem_10').dimension, 'resilience');
});

test('does not invent mappings for demographic identity questions', () => {
  assert.equal(getCanonicalQuestion('dem_01'), null);
  assert.equal(getCanonicalQuestion('dem_02'), null);
  assert.equal(getCanonicalQuestion('dem_03'), null);
  assert.equal(getCanonicalQuestion('dem_04'), null);
});

test('canonical map is immutable at the top level', () => {
  assert.equal(Object.isFrozen(CANONICAL_QUESTION_MAP), true);
});
