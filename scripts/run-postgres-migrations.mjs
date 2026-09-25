// Secret Sharz — explicit PostgreSQL migration runner
// Usage: npm run db:migrate

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;

const MIGRATIONS_DIR = path.resolve('infra/postgres/migrations');
const DATABASE_URL = process.env.DATABASE_URL;

function bool(value, fallback = false) {
  if (value == null || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).toLowerCase());
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

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is required.');
}

const pool = new Pool({
  connectionString: DATABASE_URL,
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
