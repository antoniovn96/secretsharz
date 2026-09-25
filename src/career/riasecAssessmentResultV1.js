import { createAssessmentResultRecord, createAssessmentResponse, createAssessmentScore } from '../platform/assessmentResultRecord.js';
import { RIASEC_V1 } from './riasecInterestExplorerV1.js';

export function buildRiasecAssessmentResultV1({ score, personId, accountId = null, institutionRelationshipId = null, serviceEngagementId = null, entitlementId = null, orderId = null, contextSnapshot = {}, previousAssessmentResultId = null, attemptNumber = 1 }) {
  if (!score?.assessmentVersion) throw new Error('RIASEC score is required');
  const responses = RIASEC_V1.items.map((item, index) => createAssessmentResponse({
    itemId: item.id,
    itemVersion: score.assessmentVersion,
    responseValue: score.rawResponses?.[item.id] ?? null,
    responseType: 'likert_interest_1_5',
    presentationOrder: index + 1,
  }));
  const scores = RIASEC_V1.dimensions.map((dimension) => createAssessmentScore({
    construct: 'vocational_interest',
    subscale: dimension,
    rawScore: score.rawScores?.[dimension] ?? null,
    transformedScore: score.meanScores?.[dimension] ?? null,
    displayScore: score.displayIndex?.[dimension] ?? null,
    scoringVersion: score.scoringVersion,
    interpretationStatus: score.completionStatus === 'complete' ? 'draft_interpretation' : 'incomplete',
  }));
  return createAssessmentResultRecord({
    personId,
    accountId,
    institutionRelationshipId,
    serviceEngagementId,
    entitlementId,
    orderId,
    status: score.completionStatus === 'complete' ? 'scored' : 'started',
    startedAt: score.startedAt,
    submittedAt: score.completedAt,
    scoredAt: score.completionStatus === 'complete' ? score.completedAt : null,
    completionPercent: score.completionPercent,
    attemptNumber,
    instrumentId: score.instrumentId,
    instrumentVersion: score.assessmentVersion,
    itemBankVersion: score.itemBankVersion || score.assessmentVersion,
    scoringVersion: score.scoringVersion,
    reportVersion: null,
    language: contextSnapshot.language || null,
    locale: contextSnapshot.locale || null,
    responses,
    scores,
    evidenceQuality: score.responseQuality || {},
    contextSnapshot,
    previousAssessmentResultId,
    longitudinalSequence: attemptNumber,
  });
}