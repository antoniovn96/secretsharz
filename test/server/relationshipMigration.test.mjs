import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLegacyRelationshipCandidates } from '../../src/security/relationshipMigration.js';

test('guardian migration candidates remain pending until consent is verified', () => {
  const { candidates } = buildLegacyRelationshipCandidates('student-1', {
    family: { guardians: [{ accountId: 'parent-1', relationship: 'parent', name: 'Parent' }] },
    relationships: { assignments: {} },
  });

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].type, 'parent');
  assert.equal(candidates[0].consentRequired, true);
  assert.equal(candidates[0].status, 'pending');
});

test('specialist assignment migration remains active when it is not consent-gated', () => {
  const { candidates } = buildLegacyRelationshipCandidates('student-1', {
    family: { guardians: [] },
    relationships: { assignments: { career: 'career-1' } },
  });

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].type, 'career_counsellor');
  assert.equal(candidates[0].status, 'active');
  assert.equal(candidates[0].consentRequired, false);
});
