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

import crypto from 'node:crypto';
import { getAdminFirestore } from '../src/security/firebaseAdmin.js';
import { getPostgresPool } from '../src/platform/postgres.js';
import { createAssessmentResultRecord, createAssessmentScore } from '../src/platform/assessmentResultRecord.js';
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

function stableJson(value) {
  if (value == null) return 'null';
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableJson).join(',') + ']';
  return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stableJson(value[key])).join(',') + '}';
}

function hash(value) {
  return crypto.createHash('sha256').update(stableJson(value)).digest('hex');
}

function asDateString(value) {
  if (!value) return null;
  if (value?.toDate) value = value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function cleanScores(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(([, score]) => typeof score === 'number' && Number.isFinite(score)),
  );
}

function pickSource(data) {
  if (data?.careerAssessmentV2 && typeof data.careerAssessmentV2 === 'object') {
    return { sourceSystem: 'firebase:careerAssessmentV2', sourceRecordKey: 'careerAssessmentV2', payload: data.careerAssessmentV2 };
  }
  if (data?.careerAssessment && typeof data.careerAssessment === 'object') {
    return { sourceSystem: 'firebase:careerAssessment', sourceRecordKey: 'careerAssessment', payload: data.careerAssessment };
  }
  if (data?.riasecScores || data?.riasecCode) {
    return {
      sourceSystem: 'firebase:legacy-riasec-fields',
      sourceRecordKey: 'top-level-riasec',
      payload: {
        riasecScores: data.riasecScores || {},
        riasecCode: data.riasecCode || null,
        assessmentCompletedAt: data.assessmentCompletedAt || null,
        recommendedStream: data.recommendedStream || null,
        topCareerMatches: data.topCareerMatches || [],
      },
    };
  }
  return null;
}

function buildImportedResult({ personId, sourceSystem, sourceRecordKey, payload }) {
  const completedAt = asDateString(payload.completedAt || payload.assessmentCompletedAt);
  const version = String(payload.version || payload.assessmentVersion || 'legacy-unknown');
  const scores =
    cleanScores(payload.riasecScores) ||
    cleanScores(payload.scores?.riasecScores) ||
    cleanScores(payload.scores?.riasec);

  const scoreRows = Object.entries(scores).map(([subscale, displayScore]) =>
    createAssessmentScore({
      construct: 'vocational_interest',
      subscale,
      rawScore: null,
      transformedScore: null,
      displayScore,
      scoringVersion: version,
      interpretationStatus: 'legacy_imported_unknown_scale',
    }),
  );

  const canonical = createAssessmentResultRecord({
    id: crypto.randomUUID(),
    personId,
    status: completedAt ? 'scored' : 'created',
    startedAt: asDateString(payload.startedAt),
    submittedAt: completedAt,
    scoredAt: completedAt,
    completionPercent: completedAt ? 100 : 0,
    attemptNumber: 1,
    instrumentId: String(payload.instrument || payload.assessmentType || 'CAREER-LEGACY'),
    instrumentVersion: version,
    itemBankVersion: String(payload.itemBankVersion || 'legacy-unknown'),
    scoringVersion: String(payload.scoringVersion || version || 'legacy-unknown'),
    reportVersion: completedAt ? 'legacy-import-v1' : null,
    language: payload.language || null,
    locale: payload.locale || null,
    scores: scoreRows,
    evidenceQuality: {
      source: 'legacy-import',
      rawResponsesAvailable: false,
      reproducibility: 'limited',
      note: 'Legacy record did not expose the original item responses to the migration importer.',
    },
    contextSnapshot: {
      migrationSource: sourceSystem,
      sourceRecordKey,
      legacyPayloadVersion: version,
      importedAt: new Date().toISOString(),
      legacyAssessmentSummary: {
        riasecCode: payload.riasecCode || payload.hollandCode || payload.scores?.riasecCode || null,
        recommendedStream: payload.recommendedStream || null,
        careerMatches: Array.isArray(payload.top5Careers)
          ? payload.top5Careers.slice(0, 5)
          : Array.isArray(payload.topCareerMatches)
            ? payload.topCareerMatches.slice(0, 5)
            : Array.isArray(payload.careerExploration)
              ? payload.careerExploration.slice(0, 5)
              : [],
      },
    },
    reports: completedAt
      ? [{
          reportId: crypto.randomUUID(),
          reportVersion: 'legacy-import-v1',
          reportType: 'legacy_snapshot',
          audience: 'student',
          generatedAt: completedAt,
          dataSnapshot: payload,
          generationSource: sourceSystem,
        }]
      : [],
    audit: [{
      eventId: crypto.randomUUID(),
      action: 'legacy_assessment_imported',
      actorPersonId: null,
      actorAccountId: null,
      occurredAt: new Date().toISOString(),
      purpose: 'assessment_migration',
      outcome: 'imported',
      metadata: { sourceSystem, sourceRecordKey, migrationVersion: MIGRATION_VERSION },
    }],
  });

  canonical.migration = {
    sourceSystem,
    sourceRecordKey,
    sourceHash: hash(payload),
    migrationVersion: MIGRATION_VERSION,
    rawResponsesAvailable: false,
    reproducibility: 'limited',
  };

  return canonical;
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

      const canonical = buildImportedResult({
        personId: snap.id,
        sourceSystem: source.sourceSystem,
        sourceRecordKey: source.sourceRecordKey + ':' + snap.id,
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

    console.log(JSON.stringify({ mode: args.write ? 'write' : 'dry_run', candidates, imported, skipped, migrationVersion: MIGRATION_VERSION }));
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
