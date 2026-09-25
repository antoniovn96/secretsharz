import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLegacyAssessmentResult,
  hashLegacyPayload,
  pickLegacyAssessmentSource,
} from '../../src/platform/legacyAssessmentMigration.js';

test('prefers careerAssessmentV2 as migration source', () => {
  const source = pickLegacyAssessmentSource({
    careerAssessmentV2: { version: '2.0.1', scores: { riasecScores: { R: 60 } } },
    careerAssessment: { version: 'legacy' },
  });
  assert.equal(source.sourceSystem, 'firebase:careerAssessmentV2');
});

test('maps legacy summary evidence without inventing raw responses', () => {
  const payload = {
    version: '2.0.1',
    completedAt: '2026-09-20T10:00:00Z',
    scores: { riasecScores: { R: 80, I: 70 } },
    riasecCode: 'RI',
    top5Careers: [{ name: 'Example', matchScore: 88 }],
  };

  const result = buildLegacyAssessmentResult({
    personId: 'person-1',
    sourceSystem: 'firebase:careerAssessmentV2',
    sourceRecordKey: 'careerAssessmentV2:person-1',
    payload,
    resultId: 'result-1',
  });

  assert.equal(result.id, 'result-1');
  assert.equal(result.status, 'scored');
  assert.equal(result.responses.length, 0);
  assert.equal(result.migration.rawResponsesAvailable, false);
  assert.equal(result.migration.reproducibility, 'limited');
  assert.equal(result.scores.length, 2);
  assert.equal(result.scores[0].interpretationStatus, 'legacy_imported_unknown_scale');
  assert.equal(result.reports.length, 1);
});

test('source hash is stable for the same payload', () => {
  const payload = { b: 2, a: { d: 4, c: 3 } };
  assert.equal(hashLegacyPayload(payload), hashLegacyPayload({ a: { c: 3, d: 4 }, b: 2 }));
});
