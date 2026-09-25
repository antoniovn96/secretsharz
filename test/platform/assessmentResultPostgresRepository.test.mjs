import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRiasecAssessmentResultV1 } from '../../src/career/riasecAssessmentResultV1.js';
import { RIASEC_V1, scoreRiasecV1 } from '../../src/career/riasecInterestExplorerV1.js';
import { persistAssessmentResult } from '../../src/platform/assessmentResultPostgresRepository.js';

function makeFakePool() {
  const queries = [];
  const client = {
    async query(text, values = []) {
      queries.push({ text: String(text).replace(/\\s+/g, ' ').trim(), values });

      if (String(text).includes('INSERT INTO assessment_results')) {
        return {
          rows: [{
            id: values[0],
            person_id: values[1],
            account_id: values[2],
            institution_relationship_id: values[3],
            service_engagement_id: values[4],
            status: values[5],
            started_at: values[6] ? new Date(values[6]) : null,
            submitted_at: values[7] ? new Date(values[7]) : null,
            scored_at: values[8] ? new Date(values[8]) : null,
            reported_at: values[9] ? new Date(values[9]) : null,
            completion_percent: values[10],
            attempt_number: values[11],
            abandonment_reason: values[12],
            invalidation_reason: values[13],
            instrument_id: values[14],
            instrument_version: values[15],
            item_bank_version: values[16],
            scoring_version: values[17],
            report_version: values[18],
            norm_version: values[19],
            algorithm_version: values[20],
            language: values[21],
            locale: values[22],
            evidence_quality: JSON.parse(values[23] || '{}'),
            context_snapshot: JSON.parse(values[24] || '{}'),
            previous_assessment_result_id: values[25],
            reassessment_reason: values[26],
            recommended_retake_date: values[27] ? new Date(values[27]) : null,
            longitudinal_sequence: values[28],
            entitlement_id: values[29],
            order_id: values[30],
            migration_metadata: JSON.parse(values[31] || '{}'),
            created_at: new Date(values[32]),
            updated_at: new Date(values[33]),
          }],
        };
      }

      if (String(text).includes('SELECT * FROM assessment_results WHERE id = $1')) {
        return { rows: insertedRow ? [insertedRow] : [] };
      }

      if (String(text) === 'BEGIN' || String(text) === 'COMMIT' || String(text) === 'ROLLBACK') {
        return { rows: [] };
      }

      return { rows: [] };
    },
    release() {},
  };

  return {
    queries,
    async connect() { return client; },
  };
}

test('persists canonical assessment result atomically through repository boundary', async () => {
  const answers = Object.fromEntries(RIASEC_V1.items.map((item) => [item.id, 3]));
  const score = scoreRiasecV1(answers, {
    startedAt: '2026-09-25T08:00:00Z',
    completedAt: '2026-09-25T08:15:00Z',
  });
  const result = buildRiasecAssessmentResultV1({
    score,
    personId: 'person-1',
    accountId: 'account-1',
  });

  const pool = makeFakePool();
  const persisted = await persistAssessmentResult({
    pool,
    result,
    authorizationContext: {
      allowed: true,
      actorPersonId: 'person-1',
      subjectPersonId: 'person-1',
      dataDomain: 'assessments',
      purpose: 'student_assessment_submission',
    },
  });

  assert.equal(persisted.personId, 'person-1');
  assert.equal(persisted.instrument.instrumentId, 'CAREER-INTEREST-RIASEC');
  assert.equal(persisted.responses.length, 60);
  assert.equal(persisted.scores.length, 6);
  assert.equal(pool.queries[0].text, 'BEGIN');
  assert.equal(pool.queries.at(-1).text, 'COMMIT');
});

test('rolls back when a child insert fails', async () => {
  const answers = Object.fromEntries(RIASEC_V1.items.map((item) => [item.id, 3]));
  const score = scoreRiasecV1(answers);
  const result = buildRiasecAssessmentResultV1({ score, personId: 'person-1' });
  const basePool = makeFakePool();

  const pool = {
    connect: async () => {
      const client = await basePool.connect();
      const originalQuery = client.query;
      client.query = async (text, values) => {
        if (String(text).includes('INSERT INTO assessment_responses')) {
          throw new Error('child insert failed');
        }
        return originalQuery(text, values);
      };
      return client;
    },
  };

  await assert.rejects(() => persistAssessmentResult({
    pool,
    result,
    authorizationContext: {
      allowed: true,
      actorPersonId: 'person-1',
      subjectPersonId: 'person-1',
      dataDomain: 'assessments',
      purpose: 'student_assessment_submission',
    },
  }), /child insert failed/);
  assert.equal(basePool.queries.some((item) => item.text === 'ROLLBACK'), true);
});


test('refuses persistence without an authorized assessment context', async () => {
  const answers = Object.fromEntries(RIASEC_V1.items.map((item) => [item.id, 3]));
  const score = scoreRiasecV1(answers);
  const result = buildRiasecAssessmentResultV1({ score, personId: 'person-1' });
  const pool = makeFakePool();

  await assert.rejects(
    () => persistAssessmentResult({ pool, result }),
    /Assessment authorization is required/
  );
  assert.equal(pool.queries.length, 0);
});
