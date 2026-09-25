// Secret Sharz — legacy career assessment migration mapper
// Pure module: no Firebase, PostgreSQL, or network access.

import crypto from 'node:crypto';
import { createAssessmentResultRecord, createAssessmentScore } from './assessmentResultRecord.js';

export const LEGACY_ASSESSMENT_MIGRATION_VERSION = 'legacy-career-assessments-v1';

export function stableJson(value) {
  if (value == null) return 'null';
  if (typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableJson).join(',') + ']';
  return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stableJson(value[key])).join(',') + '}';
}

export function hashLegacyPayload(value) {
  return crypto.createHash('sha256').update(stableJson(value)).digest('hex');
}

export function asDateString(value) {
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

function firstNonEmptyObject(...values) {
  for (const value of values) {
    const scores = cleanScores(value);
    if (Object.keys(scores).length) return scores;
  }
  return {};
}

export function pickLegacyAssessmentSource(data = {}) {
  if (data?.careerAssessmentV2 && typeof data.careerAssessmentV2 === 'object') {
    return {
      sourceSystem: 'firebase:careerAssessmentV2',
      sourceRecordKey: 'careerAssessmentV2',
      payload: data.careerAssessmentV2,
    };
  }

  if (data?.careerAssessment && typeof data.careerAssessment === 'object') {
    return {
      sourceSystem: 'firebase:careerAssessment',
      sourceRecordKey: 'careerAssessment',
      payload: data.careerAssessment,
    };
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

export function buildLegacyAssessmentResult({ personId, sourceSystem, sourceRecordKey, payload, resultId = crypto.randomUUID() }) {
  const completedAt = asDateString(payload.completedAt || payload.assessmentCompletedAt);
  const version = String(payload.version || payload.assessmentVersion || 'legacy-unknown');
  const scores = firstNonEmptyObject(
    payload.riasecScores,
    payload.scores?.riasecScores,
    payload.scores?.riasec,
  );

  const scoreRows = Object.entries(scores).map(([subscale, displayScore]) =>
    createAssessmentScore({
      construct: 'vocational_interest',
      subscale,
      rawScore: null,
      transformedScore: null,
      displayScore,
      scoringVersion: String(payload.scoringVersion || version || 'legacy-unknown'),
      interpretationStatus: 'legacy_imported_unknown_scale',
    }),
  );

  const sourceHash = hashLegacyPayload(payload);
  const canonical = createAssessmentResultRecord({
    id: resultId,
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
      metadata: { sourceSystem, sourceRecordKey, migrationVersion: LEGACY_ASSESSMENT_MIGRATION_VERSION },
    }],
    migration: {
      sourceSystem,
      sourceRecordKey,
      sourceHash,
      migrationVersion: LEGACY_ASSESSMENT_MIGRATION_VERSION,
      rawResponsesAvailable: false,
      reproducibility: 'limited',
    },
  });

  return canonical;
}
