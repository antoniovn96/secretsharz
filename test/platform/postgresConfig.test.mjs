import test from 'node:test';
import assert from 'node:assert/strict';
import { createPostgresPool } from '../../src/platform/postgres.js';

test('builds PostgreSQL connection string from ECS database components', async () => {
  const original = {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_SSL: process.env.DATABASE_SSL,
  };

  delete process.env.DATABASE_URL;
  process.env.DATABASE_HOST = 'db.internal';
  process.env.DATABASE_PORT = '5432';
  process.env.DATABASE_NAME = 'secretsharz';
  process.env.DATABASE_USER = 'app user';
  process.env.DATABASE_PASSWORD = 'p@ss:word';
  process.env.DATABASE_SSL = 'false';

  const pool = createPostgresPool({ max: 1 });

  assert.equal(
    pool.options.connectionString,
    'postgresql://app%20user:p%40ss%3Aword@db.internal:5432/secretsharz',
  );

  await pool.end();

  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test('prefers DATABASE_URL over ECS database components', async () => {
  const original = {
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_PORT: process.env.DATABASE_PORT,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  };

  process.env.DATABASE_URL = 'postgresql://postgres:test@localhost:5432/secretsharz';
  process.env.DATABASE_HOST = 'ignored';
  process.env.DATABASE_PORT = '5433';
  process.env.DATABASE_NAME = 'ignored';
  process.env.DATABASE_USER = 'ignored';
  process.env.DATABASE_PASSWORD = 'ignored';

  const pool = createPostgresPool({ max: 1 });

  assert.equal(
    pool.options.connectionString,
    'postgresql://postgres:test@localhost:5432/secretsharz',
  );

  await pool.end();

  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});
