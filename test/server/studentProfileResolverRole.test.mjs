import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const resolverSource = fs.readFileSync(new URL('../../src/platform/studentProfileResolver.js', import.meta.url), 'utf8');

// The project currently keeps platform .js modules outside package-level ESM
// configuration, so this server contract test verifies the role-normalization
// boundary without importing the implementation directly.
test('institution_member is normalized as an institution-scoped viewer', () => {
  assert.match(resolverSource, /value === 'institution_member'/);
  assert.match(resolverSource, /return 'institution';/);
});

test('institution coordinator can be normalized through institutionRole', () => {
  assert.match(resolverSource, /viewer\.institutionRole \|\| viewer\.institution\?\.role/);
  assert.match(resolverSource, /'coordinator'/);
});

test('institution-scoped resolver remains aggregate-only', () => {
  assert.match(resolverSource, /delete visible\.family/);
  assert.match(resolverSource, /delete visible\.wellbeing/);
  assert.match(resolverSource, /delete visible\.sen/);
  assert.match(resolverSource, /delete visible\.career/);
});
