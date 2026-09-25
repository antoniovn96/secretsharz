// Secret Sharz — legacy career assessment backfill
// Default mode is DRY RUN. Writing requires --write plus explicit confirmation.
// This script never deletes or overwrites Firebase assessment data.
//
// Usage:
//   node scripts/migrate-legacy-career-assessments.mjs --limit 100
//   node scripts/migrate-legacy-career-assessments.mjs --uid <firebase-uid> --write --confirm
//
// Required runtime:
//   DATABASE_URL
//   Firebase Admin credentials/emulator configuration
//
// Imported legacy assessments are explicitly marked as limited-reproducibility evidence
// when raw item responses are unavailable.

import { getAdminFirestore } from '../src/security/firebaseAdmin.js';
import { getPostgresPool } from '../src/platform/postgres.js';
import { buildLegacyAssessmentResult, hashLegacyPayload, pickLegacyAssessmentSource, LEGACY_ASSESSMENT_MIGRATION_VERSION } from '../src/platform/legacyAssessmentMigration.js';
import { persistAssessmentResult } from '../src/platform/assessmentResultPostgresRepository.js';

const MIGRATION_VERSION = 'legacy-career-assessments-v1';

function parseArgs(argv) {
  const args = { limit: 100, uid: null, write: false, confirm: false };
  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === '--write') args.write = true;
    else if (value === '--confirm') args.confirm = true;
    else if (value === '--uid') args.uid = argv[++i] || null;
    else if (value === '--limit') args.limit = Math.min(Math.max(Number(argv[++i]) || 100, 1), 1000);
  }
  return args;
}

async function registryRow(client, sourceSystem, sourceRecordKey) {
  const { rows } = await client.query(
    'SELECT id, assessment_result_id, source_hash, status FROM assessment_migration_registry WHERE source_system = $1 AND source_record_key = $2 LIMIT 1',
    [sourceSystem, sourceRecordKey],
  );
  return rows[0] || null;
}

async function recordRegistry(client, {
  sourceSystem,
  sourceRecordKey,
  sourcePersonId,
  assessmentResultId,
  sourceHash,
  status,
  metadata = {},
}) {
  await client.query(
    `INSERT INTO assessment_migration_registry (
      source_system, source_record_key, source_person_id, assessment_result_id,
      source_hash, migration_version, status, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
    ON CONFLICT (source_system, source_record_key)
    DO UPDATE SET status = EXCLUDED.status, metadata = EXCLUDED.metadata, updated_at = now()`,
    [sourceSystem, sourceRecordKey, sourcePersonId, assessmentResultId, sourceHash, MIGRATION_VERSION, status, JSON.stringify(metadata)],
  );
}

async function loadUsers(db, args) {
  if (args.uid) {
    const snapshot = await db.collection('users').doc(args.uid).get();
    return snapshot.exists ? [snapshot] : [];
  }

  const rows = [];
  let query = db.collection('users').orderBy('__name__').limit(args.limit);
  const snapshot = await query.get();
  rows.push(...snapshot.docs);
  return rows;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.write && !args.confirm) {
    throw new Error('Refusing write mode without --confirm.');
  }

  const db = getAdminFirestore();
  const pool = getPostgresPool();
  const client = await pool.connect();

  try {
    const docs = await loadUsers(db, args);
    let candidates = 0;
    let imported = 0;
    let skipped = 0;

    for (const snap of docs) {
      const data = snap.data() || {};
      const source = pickSource(data);
      if (!source) continue;

      candidates += 1;
      const sourceHash = hash(source.payload);
      const existing = await registryRow(client, source.sourceSystem, source.sourceRecordKey + ':' + snap.id);

      if (existing || sourceHash === '') {
        skipped += 1;
        continue;
      }

      const sourceRecordKey = source.sourceRecordKey + ':' + snap.id;
      const sourceHash = hashLegacyPayload(source.payload);
      const canonical = buildLegacyAssessmentResult({
        personId: snap.id,
        sourceSystem: source.sourceSystem,
        sourceRecordKey,
        payload: source.payload,
      });

      if (!args.write) {
        console.log(JSON.stringify({
          mode: 'dry_run',
          personId: snap.id,
          sourceSystem: source.sourceSystem,
          sourceHash,
          assessmentResultId: canonical.id,
          status: canonical.status,
          rawResponsesAvailable: canonical.migration.rawResponsesAvailable,
        }));
        continue;
      }

      const persisted = await persistAssessmentResult({
        pool,
        result: canonical,
        authorizationContext: {
          allowed: true,
          actorPersonId: 'migration-service',
          subjectPersonId: snap.id,
          dataDomain: 'assessments',
          purpose: 'assessment_migration',
        },
      });

      await recordRegistry(client, {
        sourceSystem: source.sourceSystem,
        sourceRecordKey: source.sourceRecordKey + ':' + snap.id,
        sourcePersonId: snap.id,
        assessmentResultId: persisted.id,
        sourceHash,
        status: 'imported',
        metadata: { rawResponsesAvailable: false },
      });

      imported += 1;
    }

    console.log(JSON.stringify({ mode: args.write ? 'write' : 'dry_run', candidates, imported, skipped, migrationVersion: LEGACY_ASSESSMENT_MIGRATION_VERSION }));
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
