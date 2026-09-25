// Secret Sharz — PostgreSQL runtime boundary
// Server-only. Do not import this module from browser/client components.

import fs from 'node:fs';
import pg from 'pg';

const { Pool } = pg;

function asBoolean(value, fallback = false) {
  if (value == null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

function buildSslConfig() {
  if (!asBoolean(process.env.DATABASE_SSL, false)) return undefined;

  const caFromEnv = process.env.DATABASE_SSL_CA
    ? process.env.DATABASE_SSL_CA.replace(/\\n/g, '\n')
    : null;

  const caPath = process.env.DATABASE_SSL_CA_PATH || null;
  const caFromPath = caPath ? fs.readFileSync(caPath, 'utf8') : null;

  return {
    rejectUnauthorized: asBoolean(process.env.DATABASE_SSL_REJECT_UNAUTHORIZED, true),
    ...(caFromEnv || caFromPath ? { ca: caFromEnv || caFromPath } : {}),
  };
}

export function createPostgresPool(overrides = {}) {
  if (!process.env.DATABASE_URL && !overrides.connectionString) {
    throw new Error('DATABASE_URL is required for PostgreSQL access.');
  }

  return new Pool({
    connectionString: overrides.connectionString || process.env.DATABASE_URL,
    max: Number(process.env.DATABASE_POOL_MAX || 10),
    idleTimeoutMillis: Number(process.env.DATABASE_IDLE_TIMEOUT_MS || 30000),
    connectionTimeoutMillis: Number(process.env.DATABASE_CONNECTION_TIMEOUT_MS || 10000),
    ssl: overrides.ssl ?? buildSslConfig(),
    ...overrides,
  });
}

let cachedPool = globalThis.__secretSharzPostgresPool || null;

export function getPostgresPool() {
  if (!cachedPool) {
    cachedPool = createPostgresPool();
    if (process.env.NODE_ENV !== 'production') {
      globalThis.__secretSharzPostgresPool = cachedPool;
    }
  }
  return cachedPool;
}

export async function closePostgresPool() {
  if (!cachedPool) return;
  await cachedPool.end();
  cachedPool = null;
  if (globalThis.__secretSharzPostgresPool) {
    delete globalThis.__secretSharzPostgresPool;
  }
}

export default getPostgresPool;
