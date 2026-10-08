import test from 'node:test';
import assert from 'node:assert/strict';
import { getSourceById, listSourceIds } from '../../scripts/career-intelligence-source-registry.mjs';

test('source registry resolves known source', () => {
  const registry = {
    sources: [{ id: 'example', entryPoint: 'https://example.com' }]
  };
  assert.deepEqual(getSourceById(registry, 'example'), registry.sources[0]);
});

test('source registry exposes ids deterministically', () => {
  const registry = {
    sources: [{ id: 'a' }, { id: 'b' }]
  };
  assert.deepEqual(listSourceIds(registry), ['a', 'b']);
});

test('unknown source is rejected', () => {
  assert.throws(
    () => getSourceById({ sources: [] }, 'missing'),
    /Crawler source not found: missing/
  );
});
