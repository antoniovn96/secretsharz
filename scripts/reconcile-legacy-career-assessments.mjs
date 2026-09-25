// Secret Sharz — legacy assessment migration reconciliation
// Read-only. This script compares current Firebase legacy source hashes with the
// PostgreSQL migration registry; it never mutates either system.

import { getAdminFirestore } from '../src/security/firebaseAdmin.js';
import { getPostgresPool } from '../src/platform/postgres.js';
import { hashLegacyPayload, pickLegacyAssessmentSource } from '../src/platform/legacyAssessmentMigration.js';

function parseArgs(argv) {
  const args = { limit: 1000 };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--limit') args.limit = Math.min(Math.max(Number(argv[++i]) || 1000, 1), 5000);
  }
  return args;
}

async function loadUsers(db, limit) {
  const snapshot = await db.collection('users').orderBy('__name__').limit(limit).get();
  return snapshot.docs;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const db = getAdminFirestore();
  const pool = getPostgresPool();
  const client = await pool.connect();

  try {
    const docs = await loadUsers(db, args.limit);

    let candidates = 0;
    let imported = 0;
    let missingRegistry = 0;
    let unchanged = 0;
    let drifted = 0;
    let multipleSources = 0;

    const drift = [];

    for (const snap of docs) {
      const data = snap.data() || {};
      const source = pickLegacyAssessmentSource(data);
      if (!source) continue;

      candidates += 1;

      const availableSources = [
        data?.careerAssessmentV2 && ['firebase:careerAssessmentV2', data.careerAssessmentV2],
        data?.careerAssessment && ['firebase:careerAssessment', data.careerAssessment],
        (data?.riasecScores || data?.riasecCode) && [
          'firebase:legacy-riasec-fields',
          {
            riasecScores: data.riasecScores || {},
            riasecCode: data.riasecCode || null,
            assessmentCompletedAt: data.assessmentCompletedAt || null,
            recommendedStream: data.recommendedStream || null,
            topCareerMatches: data.topCareerMatches || [],
          },
        ],
      ].filter(Boolean);

      if (availableSources.length > 1) multipleSources += 1;

      const sourceRecordKey = source.sourceRecordKey + ':' + snap.id;
      const currentHash = hashLegacyPayload(source.payload);

      const result = await client.query(
        `SELECT source_hash, assessment_result_id, status
         FROM assessment_migration_registry
         WHERE source_system = $1 AND source_record_key = $2
         LIMIT 1`,
        [source.sourceSystem, sourceRecordKey],
      );

      const registry = result.rows[0];
      if (!registry) {
        missingRegistry += 1;
        continue;
      }

      imported += 1;

      if (registry.source_hash === currentHash) {
        unchanged += 1;
      } else {
        drifted += 1;
        drift.push({
          personId: snap.id,
          sourceSystem: source.sourceSystem,
          sourceRecordKey,
          assessmentResultId: registry.assessment_result_id,
          status: registry.status,
        });
      }
    }

    console.log(JSON.stringify({
      candidates,
      imported,
      missingRegistry,
      unchanged,
      drifted,
      multipleSources,
      drift,
    }, null, 2));
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
