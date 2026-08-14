import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCompletion, shouldAward, buildReward } from '../../src/engagement/challengeCompletion.js';

test('challenge completion awards once per challenge per day', () => {
  const completion = buildCompletion({ personId: 'p1', challengeId: 'sudoku', completedAt: '2026-08-14T08:00:00.000Z' });
  assert.equal(shouldAward(completion, []), true);
  assert.equal(shouldAward(completion, [completion]), false);
});

test('reward is bounded by the challenge points', () => {
  const completion = buildCompletion({ personId: 'p1', challengeId: 'sudoku', completedAt: '2026-08-14T08:00:00.000Z' });
  assert.deepEqual(buildReward(completion, { points: 20 }), { personId: 'p1', challengeId: 'sudoku', xp: 20, awardedAt: completion.completedAt });
});
