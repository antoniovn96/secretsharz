// Secret Sharz — Canonical Assessment Result PostgreSQL Repository V1
// Server-only persistence adapter. Authorization must happen before this layer.

import { randomUUID } from 'node:crypto';
import { validateAssessmentResultRecord } from './assessmentResultRecord.js';

function assertAuthorizedAssessmentContext(authorizationContext, expectedSubjectPersonId) {
  if (!authorizationContext?.allowed) {
    throw new Error('Assessment authorization is required before PostgreSQL access.');
  }
  if (authorizationContext.dataDomain !== 'assessments') {
    throw new Error('Assessment repository requires the assessments data domain.');
  }
  if (!authorizationContext.purpose) {
    throw new Error('Assessment repository requires an access purpose.');
  }
  if (!authorizationContext.subjectPersonId || authorizationContext.subjectPersonId !== expectedSubjectPersonId) {
    throw new Error('Assessment authorization subject does not match the assessment person.');
  }
}

function jsonOrNull(value) {
  if (value === undefined) return null;
  return JSON.stringify(value);
}

function rowToReport(row) {
  return {
    reportId: row.id,
    assessmentResultId: row.assessment_result_id,
    reportVersion: row.report_version,
    reportType: row.report_type,
    audience: row.audience,
    generatedAt: row.generated_at?.toISOString?.() || row.generated_at,
    dataSnapshot: row.source_snapshot,
    contentHash: row.content_hash,
    generationSource: row.generation_source,
  };
}

function rowToAudit(row) {
  return {
    eventId: row.id,
    action: row.action,
    actorPersonId: row.actor_person_id,
    actorAccountId: row.actor_account_id,
    occurredAt: row.occurred_at?.toISOString?.() || row.occurred_at,
    purpose: row.purpose,
    outcome: row.outcome,
    metadata: row.metadata,
  };
}

function hydrateResult(resultRow, responseRows, scoreRows, reportRows, auditRows) {
  const record = {
    schemaVersion: '1.0.0',
    id: resultRow.id,
    personId: resultRow.person_id,
    accountId: resultRow.account_id,
    institutionRelationshipId: resultRow.institution_relationship_id,
    serviceEngagementId: resultRow.service_engagement_id,
    status: resultRow.status,
    attempt: {
      startedAt: resultRow.started_at?.toISOString?.() || resultRow.started_at,
      submittedAt: resultRow.submitted_at?.toISOString?.() || resultRow.submitted_at,
      scoredAt: resultRow.scored_at?.toISOString?.() || resultRow.scored_at,
      reportedAt: resultRow.reported_at?.toISOString?.() || resultRow.reported_at,
      completionPercent: Number(resultRow.completion_percent),
      attemptNumber: resultRow.attempt_number,
      abandonmentReason: resultRow.abandonment_reason,
      invalidationReason: resultRow.invalidation_reason,
    },
    instrument: {
      instrumentId: resultRow.instrument_id,
      instrumentVersion: resultRow.instrument_version,
      itemBankVersion: resultRow.item_bank_version,
      scoringVersion: resultRow.scoring_version,
      reportVersion: resultRow.report_version,
      normVersion: resultRow.norm_version,
      algorithmVersion: resultRow.algorithm_version,
      language: resultRow.language,
      locale: resultRow.locale,
    },
    responses: responseRows.map((row) => ({
      itemId: row.item_id,
      itemVersion: row.item_version,
      responseValue: row.response_value,
      responseType: row.response_type,
      responseTimestamp: row.response_timestamp?.toISOString?.() || row.response_timestamp,
      responseDurationMs: row.response_duration_ms,
      presentationOrder: row.presentation_order,
    })),
    scores: scoreRows.map((row) => ({
      construct: row.construct,
      subscale: row.subscale,
      rawScore: row.raw_score,
      transformedScore: row.transformed_score,
      displayScore: row.display_score,
      scoringVersion: row.scoring_version,
      interpretationStatus: row.interpretation_status,
      normativeReference: row.normative_reference,
    })),
    evidenceQuality: resultRow.evidence_quality,
    contextSnapshot: resultRow.context_snapshot,
    reports: reportRows.map(rowToReport),
    longitudinal: {
      previousAssessmentResultId: resultRow.previous_assessment_result_id,
      reassessmentReason: resultRow.reassessment_reason,
      recommendedRetakeDate: resultRow.recommended_retake_date?.toISOString?.() || resultRow.recommended_retake_date,
      sequence: resultRow.longitudinal_sequence,
    },
    entitlement: {
      entitlementId: resultRow.entitlement_id,
      orderId: resultRow.order_id,
    },
    audit: auditRows.map(rowToAudit),
    createdAt: resultRow.created_at?.toISOString?.() || resultRow.created_at,
    updatedAt: resultRow.updated_at?.toISOString?.() || resultRow.updated_at,
  };

  const validation = validateAssessmentResultRecord(record);
  if (!validation.valid) {
    const error = new Error('Persisted assessment result failed canonical validation.');
    error.details = validation.errors;
    throw error;
  }

  return record;
}

function stagingStatusForPersistence(status) {
  if (['submitted', 'scored', 'reported'].includes(status)) return 'started';
  return status;
}

async function finalizeAssessmentResult(client, resultId, result) {
  const target = result.status;
  if (target === 'started' || target === 'created' || target === 'abandoned' || target === 'invalidated') {
    return;
  }

  await client.query(
    `UPDATE assessment_results
     SET status = 'submitted',
         submitted_at = $2,
         updated_at = $3
     WHERE id = $1`,
    [resultId, result.attempt.submittedAt, new Date().toISOString()],
  );

  if (target === 'submitted') return;

  await client.query(
    `UPDATE assessment_results
     SET status = 'scored',
         scored_at = $2,
         updated_at = $3
     WHERE id = $1`,
    [resultId, result.attempt.scoredAt, new Date().toISOString()],
  );

  if (target === 'scored') return;

  await client.query(
    `UPDATE assessment_results
     SET status = 'reported',
         reported_at = $2,
         updated_at = $3
     WHERE id = $1`,
    [resultId, result.attempt.reportedAt, new Date().toISOString()],
  );
}

async function insertAssessmentResultRow(client, result) {
  const id = result.id || randomUUID();
  const persistenceResult = { ...result, status: stagingStatusForPersistence(result.status) };
  const query = `
    INSERT INTO assessment_results (
      id, person_id, account_id, institution_relationship_id, service_engagement_id,
      status, started_at, submitted_at, scored_at, reported_at, completion_percent,
      attempt_number, abandonment_reason, invalidation_reason,
      instrument_id, instrument_version, item_bank_version, scoring_version,
      report_version, norm_version, algorithm_version, language, locale,
      evidence_quality, context_snapshot, previous_assessment_result_id,
      reassessment_reason, recommended_retake_date, longitudinal_sequence,
      entitlement_id, order_id, created_at, updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11,
      $12, $13, $14,
      $15, $16, $17, $18,
      $19, $20, $21, $22, $23,
      $24::jsonb, $25::jsonb, $26,
      $27, $28, $29,
      $30, $31, $32, $33
    )
    RETURNING *;
  `;

  const values = [
    id,
    result.personId,
    result.accountId,
    result.institutionRelationshipId,
    result.serviceEngagementId,
    persistenceResult.status,
    persistenceResult.attempt.startedAt,
    result.attempt.submittedAt,
    result.attempt.scoredAt,
    result.attempt.reportedAt,
    result.attempt.completionPercent,
    result.attempt.attemptNumber,
    result.attempt.abandonmentReason,
    result.attempt.invalidationReason,
    result.instrument.instrumentId,
    result.instrument.instrumentVersion,
    result.instrument.itemBankVersion,
    result.instrument.scoringVersion,
    result.instrument.reportVersion,
    result.instrument.normVersion,
    result.instrument.algorithmVersion,
    result.instrument.language,
    result.instrument.locale,
    jsonOrNull(result.evidenceQuality),
    jsonOrNull(result.contextSnapshot),
    result.longitudinal.previousAssessmentResultId,
    result.longitudinal.reassessmentReason,
    result.longitudinal.recommendedRetakeDate,
    result.longitudinal.sequence,
    result.entitlement.entitlementId,
    result.entitlement.orderId,
    result.createdAt,
    result.updatedAt,
  ];

  const { rows } = await client.query(query, values);
  return rows[0];
}

export async function persistAssessmentResult({ pool, result, authorizationContext }) {
  if (!pool || typeof pool.connect !== 'function') {
    throw new Error('A PostgreSQL pool is required.');
  }

  assertAuthorizedAssessmentContext(authorizationContext, result?.personId);

  const validation = validateAssessmentResultRecord(result);
  if (!validation.valid) {
    const error = new Error('Assessment result failed canonical validation.');
    error.details = validation.errors;
    throw error;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const resultRow = await insertAssessmentResultRow(client, result);
    const resultId = resultRow.id;

    for (const response of result.responses) {
      await client.query(
        `INSERT INTO assessment_responses (
          assessment_result_id, item_id, item_version, response_value,
          response_type, response_timestamp, response_duration_ms, presentation_order
        ) VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7, $8)`,
        [
          resultId,
          response.itemId,
          response.itemVersion,
          jsonOrNull(response.responseValue),
          response.responseType,
          response.responseTimestamp,
          response.responseDurationMs,
          response.presentationOrder,
        ],
      );
    }

    for (const score of result.scores) {
      await client.query(
        `INSERT INTO assessment_scores (
          assessment_result_id, construct, subscale, raw_score, transformed_score,
          display_score, scoring_version, interpretation_status, normative_reference
        ) VALUES ($1, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7, $8, $9::jsonb)`,
        [
          resultId,
          score.construct,
          score.subscale,
          jsonOrNull(score.rawScore),
          jsonOrNull(score.transformedScore),
          jsonOrNull(score.displayScore),
          score.scoringVersion,
          score.interpretationStatus,
          jsonOrNull(score.normativeReference),
        ],
      );
    }

    const persistedReports = [];
    for (const report of result.reports) {
      const reportId = report.reportId || randomUUID();
      persistedReports.push({ ...report, reportId });

      await client.query(
        `INSERT INTO assessment_reports (
          id, assessment_result_id, report_version, report_type, audience,
          generated_at, source_snapshot, content_hash, generation_source
        ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9)`,
        [
          reportId,
          resultId,
          report.reportVersion,
          report.reportType,
          report.audience,
          report.generatedAt,
          jsonOrNull(report.dataSnapshot || report.sourceSnapshot || {}),
          report.contentHash || null,
          report.generationSource || null,
        ],
      );
    }

    const persistedAudit = [];
    for (const [index, event] of result.audit.entries()) {
      const eventId = event.eventId || randomUUID();
      persistedAudit.push({ ...event, eventId });

      await client.query(
        `INSERT INTO assessment_audit_events (
          id, assessment_result_id, sequence, action, actor_person_id,
          actor_account_id, purpose, outcome, metadata, occurred_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10)`,
        [
          eventId,
          resultId,
          index + 1,
          event.action,
          event.actorPersonId || null,
          event.actorAccountId || null,
          event.purpose || null,
          event.outcome || null,
          jsonOrNull(event.metadata || {}),
          event.occurredAt,
        ],
      );
    }

    await finalizeAssessmentResult(client, resultId, result);

    const finalResultQuery = await client.query(
      'SELECT * FROM assessment_results WHERE id = $1',
      [resultId],
    );
    const finalResultRow = finalResultQuery.rows[0];

    await client.query('COMMIT');
    return hydrateResult(finalResultRow, result.responses.map((r) => ({
      ...r,
      response_value: r.responseValue,
      response_timestamp: r.responseTimestamp,
      response_duration_ms: r.responseDurationMs,
      presentation_order: r.presentationOrder,
      item_id: r.itemId,
      item_version: r.itemVersion,
      response_type: r.responseType,
    })), result.scores.map((s) => ({
      ...s,
      raw_score: s.rawScore,
      transformed_score: s.transformedScore,
      display_score: s.displayScore,
      scoring_version: s.scoringVersion,
      interpretation_status: s.interpretationStatus,
      normative_reference: s.normativeReference,
      subscale: s.subscale,
      construct: s.construct,
    })), persistedReports.map((r) => ({
      id: r.reportId,
      assessment_result_id: resultRow.id,
      report_version: r.reportVersion,
      report_type: r.reportType,
      audience: r.audience,
      generated_at: r.generatedAt,
      source_snapshot: r.dataSnapshot || r.sourceSnapshot || {},
      content_hash: r.contentHash || null,
      generation_source: r.generationSource || null,
    })), persistedAudit.map((e) => ({
      id: e.eventId,
      action: e.action,
      actor_person_id: e.actorPersonId || null,
      actor_account_id: e.actorAccountId || null,
      occurred_at: e.occurredAt,
      purpose: e.purpose || null,
      outcome: e.outcome || null,
      metadata: e.metadata || {},
    })));
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Preserve the original database error.
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function getLatestAssessmentResultForPerson({
  pool,
  personId,
  instrumentId = null,
  authorizationContext,
}) {
  if (!pool || typeof pool.connect !== 'function') {
    throw new Error('A PostgreSQL pool is required.');
  }
  assertAuthorizedAssessmentContext(authorizationContext, personId);

  const client = await pool.connect();
  try {
    const clauses = ['person_id = $1'];
    const values = [personId];

    if (instrumentId) {
      values.push(instrumentId);
      clauses.push(`instrument_id = ${values.length}`);
    }

    const resultQuery = await client.query(
      `SELECT id FROM assessment_results
       WHERE ${clauses.join(' AND ')}
         AND status NOT IN ('abandoned', 'invalidated')
       ORDER BY COALESCE(reported_at, scored_at, submitted_at, created_at) DESC, created_at DESC
       LIMIT 1`,
      values,
    );

    if (!resultQuery.rows[0]) return null;
    const assessmentResultId = resultQuery.rows[0].id;

    return await getAssessmentResultById({
      pool,
      assessmentResultId,
      authorizationContext,
    });
  } finally {
    client.release();
  }
}

export async function getAssessmentResultById({ pool, assessmentResultId, authorizationContext }) {
  if (!pool || typeof pool.connect !== 'function') {
    throw new Error('A PostgreSQL pool is required.');
  }
  if (!assessmentResultId) throw new Error('assessmentResultId is required.');
  if (!authorizationContext?.allowed) {
    throw new Error('Assessment authorization is required before PostgreSQL access.');
  }
  if (authorizationContext.dataDomain !== 'assessments') {
    throw new Error('Assessment repository requires the assessments data domain.');
  }
  if (!authorizationContext.purpose) {
    throw new Error('Assessment repository requires an access purpose.');
  }
  if (!authorizationContext.subjectPersonId) {
    throw new Error('Assessment authorization requires a subject person.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const resultQuery = await client.query(
      'SELECT * FROM assessment_results WHERE id = $1 AND person_id = $2',
      [assessmentResultId, authorizationContext.subjectPersonId],
    );

    if (!resultQuery.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }

    const responses = await client.query(
      'SELECT * FROM assessment_responses WHERE assessment_result_id = $1 ORDER BY presentation_order NULLS LAST, id',
      [assessmentResultId],
    );

    const scores = await client.query(
      'SELECT * FROM assessment_scores WHERE assessment_result_id = $1 ORDER BY id',
      [assessmentResultId],
    );

    const reports = await client.query(
      'SELECT * FROM assessment_reports WHERE assessment_result_id = $1 ORDER BY generated_at DESC, id DESC',
      [assessmentResultId],
    );

    const audit = await client.query(
      'SELECT * FROM assessment_audit_events WHERE assessment_result_id = $1 ORDER BY sequence',
      [assessmentResultId],
    );

    await client.query('COMMIT');
    return hydrateResult(
      resultQuery.rows[0],
      responses.rows,
      scores.rows,
      reports.rows,
      audit.rows,
    );
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Preserve the original database error.
    }
    throw error;
  } finally {
    client.release();
  }
}

export default {
  persistAssessmentResult,
  getAssessmentResultById,
  getLatestAssessmentResultForPerson,
};
