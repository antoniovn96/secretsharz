import test from 'node:test';
import assert from 'node:assert/strict';
import { discoverCareerOptions, discoverVerifiedColleges, buildExplorationDisclaimer } from '../../src/career/catalogueDiscovery.js';

test('career discovery can expose a broad exploration set', () => {
  const result = discoverCareerOptions({ careerMatches: [{ careerId: 'psychology-and-behaviour', score: 92 }], includeAdditional: true });
  assert.equal(result[0].careerId, 'psychology-and-behaviour');
  assert.ok(result[0].careers.length > 1);
  assert.ok(result[0].courses.length > 0);
});

test('college discovery only returns verified sourced records', () => {
  assert.deepEqual(discoverVerifiedColleges({ courseIds: ['bsc-psychology'] }), []);
});

test('disclaimer explicitly avoids deterministic career claims', () => {
  assert.match(buildExplorationDisclaimer(), /not guarantees or limits/i);
});
