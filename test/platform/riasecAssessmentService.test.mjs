import test from 'node:test';
import assert from 'node:assert/strict';
import { submitRiasecAssessmentV1 } from '../../src/platform/riasecAssessmentService.js';
import { RIASEC_V1 } from '../../src/career/riasecInterestExplorerV1.js';

test('server service scores submitted answers and never trusts client-provided scores', async () => {
  const queries = [];
  let insertedRow = null;
  const fakePool = {
    async connect() {
      const client = {
        async query(sql, values = []) {
          queries.push({ sql: String(sql), values });
          if (String(sql).includes('INSERT INTO assessment_results')) {
            const id = values[0];
            insertedRow = {
                id,
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
                recommended_retake_date: null,
                longitudinal_sequence: values[28],
                entitlement_id: values[29],
                order_id: values[30],
                created_at: new Date(values[31]),
                updated_at: new Date(values[32]),
              };
            return { rows: [insertedRow] };
          }

          if (String(sql).includes('SELECT * FROM assessment_results WHERE id = $1')) {
            return { rows: insertedRow ? [insertedRow] : [] };
          }

          return { rows: [] };
        },
        release() {},
      };
      return client;
    },
  };

  const answers = Object.fromEntries(RIASEC_V1.items.map((item) => [item.id, 3]));
  const result = await submitRiasecAssessmentV1({
    pool: fakePool,
    personId: 'person-1',
    answers,
  });

  assert.equal(result.status, 'scored');
  assert.equal(result.scores.length, 6);
  assert.equal(result.scores[0].transformedScore, 3);
  assert.equal(queries.some((q) => q.sql.includes('assessment_responses')), true);
});

test('server service rejects incomplete submissions before touching PostgreSQL', async () => {
  let calls = 0;
  const pool = {
    async connect() {
      calls += 1;
      throw new Error('PostgreSQL should not be reached.');
    },
  };

  const answers = Object.fromEntries(RIASEC_V1.items.slice(0, 59).map((item) => [item.id, 3]));
  await assert.rejects(
    () => submitRiasecAssessmentV1({
      pool,
      personId: 'person-1',
      answers,
    }),
    (error) => error.code === 'ASSESSMENT_INCOMPLETE',
  );
  assert.equal(calls, 0);
});
