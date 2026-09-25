// Secret Sharz — explicit PostgreSQL migration runner
// Usage: npm run db:migrate

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;

const MIGRATIONS_DIR = path.resolve('infra/postgres/migrations');
function bool(value, fallback = false) {

  if (value == null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
}

function buildConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const host = process.env.DATABASE_HOST;
  const port = process.env.DATABASE_PORT || '5432';
  const database = process.env.DATABASE_NAME;
  const username = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD;

  if (!host || !database || !username || !password) {
    throw new Error(
      'DATABASE_URL or DATABASE_HOST, DATABASE_NAME, DATABASE_USER, and DATABASE_PASSWORD are required.',
    );
  }

  return `postgresql://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}`;
}

function sslConfig() {
  if (!bool(process.env.DATABASE_SSL, false)) return undefined;
  const ca = process.env.DATABASE_SSL_CA
    ? process.env.DATABASE_SSL_CA.replace(/\\n/g, '\n')
    : undefined;
  return {
    rejectUnauthorized: bool(process.env.DATABASE_SSL_REJECT_UNAUTHORIZED, true),
    ...(ca ? { ca } : {}),
  };
}

const pool = new Pool({
  connectionString: buildConnectionString(),
  max: 2,
  ssl: sslConfig(),
});

async function main() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        checksum TEXT NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await client.query("SELECT pg_advisory_lock(hashtext('secretsharz:postgres:migrations'))");

    const entries = (await fs.readdir(MIGRATIONS_DIR))
      .filter((name) => /^\d+_.+\.sql$/i.test(name))
      .sort();

    for (const filename of entries) {
      const version = filename.split('_', 1)[0];
      const filePath = path.join(MIGRATIONS_DIR, filename);
      const sql = await fs.readFile(filePath, 'utf8');
      const checksum = crypto.createHash('sha256').update(sql).digest('hex');

      const existing = await client.query(
        'SELECT checksum FROM schema_migrations WHERE version = $1',
        [version],
      );

      if (existing.rows[0]) {
        if (existing.rows[0].checksum !== checksum) {
          throw new Error(`Migration checksum mismatch for ${filename}.`);
        }
        console.log(`skip ${filename}`);
        continue;
      }

      console.log(`apply ${filename}`);
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version, checksum) VALUES ($1, $2)',
          [version, checksum],
        );
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    await client.query("SELECT pg_advisory_unlock(hashtext('secretsharz:postgres:migrations'))");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
