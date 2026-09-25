import test from 'node:test';
import assert from 'node:assert/strict';
import { RIASEC_V1, scoreRiasecV1 } from '../../src/career/riasecInterestExplorerV1.js';

function answersFor(value = 3) {
  return Object.fromEntries(RIASEC_V1.items.map((item) => [item.id, value]));
}

test('RIASEC V1 has 60 original draft items across six dimensions', () => {
  assert.equal(RIASEC_V1.items.length, 60);
  for (const dimension of RIASEC_V1.dimensions) {
    assert.equal(RIASEC_V1.items.filter((item) => item.dimension === dimension).length, 10);
  }
});

test('complete neutral responses produce a complete profile with mean 3', () => {
  const result = scoreRiasecV1(answersFor(3), { submissionId: 'test-1' });
  assert.equal(result.completionStatus, 'complete');
  assert.deepEqual(result.meanScores, { R:3, I:3, A:3, S:3, E:3, C:3 });
  assert.deepEqual(result.displayIndex, { R:50, I:50, A:50, S:50, E:50, C:50 });
  assert.equal(result.topCode, 'RIA');
});

test('54 answered items can be provisionally scored with an incomplete warning state', () => {
  const answers = answersFor(3);
  delete answers['C-007'];
  delete answers['C-008'];
  delete answers['C-009'];
  delete answers['C-010'];
  delete answers['C-006'];
  delete answers['C-005'];
  const result = scoreRiasecV1(answers);
  assert.equal(result.answered, 54);
  assert.equal(result.completionStatus, 'provisionally_scorable');
  assert.ok(result.meanScores);
  assert.equal(result.invalidItemIds.length, 6);
});

test('53 or fewer answered items does not produce a profile', () => {
  const answers = answersFor(3);
  for (const id of ['C-001','C-002','C-003','C-004','C-005','C-006','C-007']) delete answers[id];
  const result = scoreRiasecV1(answers);
  assert.equal(result.answered, 53);
  assert.equal(result.meanScores, null);
  assert.equal(result.topCode, null);
});
