// Secret Sharz — RIASEC V1 assessment submission service
// Server-only application service. It owns scoring; clients submit answers, not scores.

import crypto from 'node:crypto';
import { RIASEC_V1, scoreRiasecV1 } from '../career/riasecInterestExplorerV1.js';
import { buildRiasecReportPayload } from '../career/riasecReportPayloadV1.js';
import { buildRiasecAssessmentResultV1 } from '../career/riasecAssessmentResultV1.js';
import { appendAssessmentAuditEvent, createAssessmentReport } from './assessmentResultRecord.js';
import { persistAssessmentResult, getLatestAssessmentResultForPerson, getAssessmentResultById } from './assessmentResultPostgresRepository.js';

export async function submitRiasecAssessmentV1({
  pool,
  personId,
  accountId = null,
  answers,
  startedAt = null,
  contextSnapshot = {},
  institutionRelationshipId = null,
  serviceEngagementId = null,
  entitlementId = null,
  orderId = null,
  previousAssessmentResultId = null,
  attemptNumber = 1,
  actorPersonId = personId,
}) {
  if (!personId) throw new Error('personId is required.');
  if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
    throw new Error('answers must be an object.');
  }

  const completedAt = new Date().toISOString();
  const score = scoreRiasecV1(answers, { startedAt, completedAt });

  if (score.completionStatus !== 'complete') {
    const error = new Error(
      `RIASEC V1 requires all ${RIASEC_V1.items.length} items before submission.`,
    );
    error.code = 'ASSESSMENT_INCOMPLETE';
    error.details = {
      answered: score.answered,
      total: score.total,
      invalidItemIds: score.invalidItemIds,
    };
    throw error;
  }

  const authorizationContext = {
    allowed: true,
    actorPersonId,
    subjectPersonId: personId,
    dataDomain: 'assessments',
    purpose: 'career_assessment_submission',
  };

  if (previousAssessmentResultId) {
    const previous = await getAssessmentResultById({
      pool,
      assessmentResultId: previousAssessmentResultId,
      authorizationContext: {
        ...authorizationContext,
        purpose: 'career_assessment_longitudinal_link',
      },
    });
    if (!previous) {
      const error = new Error('Previous assessment result was not found for this person.');
      error.code = 'INVALID_PREVIOUS_ASSESSMENT_RESULT';
      throw error;
    }
  }

  const reportPayload = buildRiasecReportPayload(score, {
    audience: 'student',
    studentStage: contextSnapshot.studentStage || null,
    recommendedNextAssessment: 'career_aptitude_core',
  });

  const reportVersion = reportPayload.reportVersion || '1.0.0-draft';
  const id = crypto.randomUUID();
  let result = buildRiasecAssessmentResultV1({
    score,
    personId,
    accountId,
    institutionRelationshipId,
    serviceEngagementId,
    entitlementId,
    orderId,
    contextSnapshot,
    previousAssessmentResultId,
    attemptNumber,
  });

  result.id = id;
  result.instrument.reportVersion = reportVersion;
  result.reports = [createAssessmentReport({
    reportId: crypto.randomUUID(),
    reportVersion,
    reportType: 'career_interest_riasec',
    audience: 'student',
    generatedAt: score.completedAt || new Date().toISOString(),
    dataSnapshot: reportPayload,
    generationSource: 'riasec_v1_server',
  })];
  result = appendAssessmentAuditEvent(result, {
    action: 'assessment_submitted',
    actorPersonId,
    actorAccountId: accountId,
    purpose: 'career_assessment_submission',
    outcome: 'accepted',
    metadata: {
      instrumentId: RIASEC_V1.instrumentId,
      instrumentVersion: RIASEC_V1.version,
      answerCount: score.answered,
    },
  });
  result = appendAssessmentAuditEvent(result, {
    action: 'assessment_scored',
    actorPersonId,
    actorAccountId: accountId,
    purpose: 'career_assessment_scoring',
    outcome: 'scored',
    metadata: {
      scoringVersion: score.scoringVersion,
    },
  });

  const persisted = await persistAssessmentResult({
    pool,
    result,
    authorizationContext,
  });

  return {
    assessmentResultId: persisted.id,
    status: persisted.status,
    instrument: persisted.instrument,
    scores: persisted.scores,
    evidenceQuality: persisted.evidenceQuality,
    reportPayload,
    submittedAt: persisted.attempt.submittedAt,
    scoredAt: persisted.attempt.scoredAt,
  };
}

export async function getLatestRiasecAssessmentV1({ pool, personId, actorPersonId = personId }) {
  if (!personId) throw new Error('personId is required.');

  const authorizationContext = {
    allowed: true,
    actorPersonId,
    subjectPersonId: personId,
    dataDomain: 'assessments',
    purpose: 'career_assessment_self_view',
  };

  const result = await getLatestAssessmentResultForPerson({
    pool,
    personId,
    instrumentId: RIASEC_V1.instrumentId,
    authorizationContext,
  });

  if (!result) return null;

  return {
    assessmentResultId: result.id,
    status: result.status,
    instrument: result.instrument,
    scores: result.scores,
    evidenceQuality: result.evidenceQuality,
    submittedAt: result.attempt.submittedAt,
    scoredAt: result.attempt.scoredAt,
  };
}
