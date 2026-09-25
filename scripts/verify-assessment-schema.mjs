// Secret Sharz — PostgreSQL assessment schema smoke test

import { getPostgresPool } from '../src/platform/postgres.js';

const REQUIRED_TABLES = [
  'schema_migrations',
  'assessment_results',
  'assessment_responses',
  'assessment_scores',
  'assessment_reports',
  'assessment_audit_events',
  'assessment_migration_registry',
];

const REQUIRED_COLUMNS = {
  assessment_results: ['person_id', 'status', 'instrument_id', 'migration_metadata'],
  assessment_responses: ['assessment_result_id', 'item_id', 'response_value'],
  assessment_scores: ['assessment_result_id', 'construct', 'display_score'],
  assessment_reports: ['assessment_result_id', 'audience', 'source_snapshot'],
  assessment_audit_events: ['assessment_result_id', 'sequence', 'action'],
  assessment_migration_registry: ['source_system', 'source_record_key', 'source_hash', 'assessment_result_id'],
};

const pool = getPostgresPool();

try {
  const tables = await pool.query(
    `SELECT table_name
     FROM information_schema.tables
     WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
    [REQUIRED_TABLES],
  );

  const actualTables = new Set(tables.rows.map((row) => row.table_name));
  const missingTables = REQUIRED_TABLES.filter((table) => !actualTables.has(table));
  if (missingTables.length) {
    throw new Error('Missing PostgreSQL tables: ' + missingTables.join(', '));
  }

  for (const [table, columns] of Object.entries(REQUIRED_COLUMNS)) {
    const result = await pool.query(
      `SELECT column_name
       FROM information_schema.columns
       WHERE table_schema = 'public'
         AND table_name = $1
         AND column_name = ANY($2::text[])`,
      [table, columns],
    );
    const actual = new Set(result.rows.map((row) => row.column_name));
    const missing = columns.filter((column) => !actual.has(column));
    if (missing.length) {
      throw new Error(`Missing columns on ${table}: ${missing.join(', ')}`);
    }
  }

  console.log(JSON.stringify({
    ok: true,
    tables: REQUIRED_TABLES,
    checkedColumns: REQUIRED_COLUMNS,
  }));
} finally {
  await pool.end();
}
