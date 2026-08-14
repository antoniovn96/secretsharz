import test from 'node:test';
import assert from 'node:assert/strict';
import { rankCareerMatches, buildCareerExplorationSet } from '../../src/career/careerMatcher.js';

test('career matching returns ranked exploration options', () => {
  const result = rankCareerMatches({
    dimensions: { interests: 5, values: 4, work_style: 4, motivation: 4 },
    riasec: { ranked: [{ code: 'S', score: 20 }, { code: 'I', score: 18 }, { code: 'A', score: 15 }] },
    candidate: { goals: ['help people', 'psychology'] },
  });

  assert.equal(result.length, 1);
  assert.equal(result[0].careerId, 'psychology-and-behaviour');
  assert.ok(result[0].score > 0);
  assert.equal(result[0].rank, 1);
});

test('exploration set does not turn a match into a deterministic career decision', () => {
  const result = buildCareerExplorationSet({
    dimensions: {},
    riasec: { ranked: [] },
    candidate: { goals: [] },
  });

  assert.ok(Array.isArray(result.primary));
  assert.match(result.note, /not mean a career is impossible/i);
});
