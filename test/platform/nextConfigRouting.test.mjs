import test from 'node:test';
import assert from 'node:assert/strict';

test('Next.js fallback rewrite does not capture API paths', async () => {
  const config = (await import('../../next.config.js')).default || (await import('../../next.config.js'));
  const fallback = (await config.rewrites()).fallback;
  assert.equal(fallback.length, 1);
  assert.match(fallback[0].source, /(?!api/);
  assert.equal(fallback[0].destination, '/');
});
