import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

test('PostgreSQL migration contract uses numbered SQL files and valid dollar quoting', async () => {
  const runner = await fs.readFile(new URL('../../scripts/run-postgres-migrations.mjs', import.meta.url), 'utf8');
  const migration = await fs.readFile(new URL('../../infra/postgres/migrations/0001_assessment_results.sql', import.meta.url), 'utf8');

  assert.ok(runner.includes(".filter((name) => /^\\d+_.+\\.sql$/i.test(name))"));
  assert.doesNotMatch(migration, /AS \$(?:\r?\n)/);
  assert.match(migration, /AS \$\$/);
  assert.match(migration, /END;\n\$\$;/);
});
