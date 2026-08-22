import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRelationshipDocument } from '../../src/security/relationshipStore.js';

test('consent-gated relationship records are pending by contract', () => {
  const record = buildRelationshipDocument({
    subjectPersonId: 'student-1',
    relatedPersonId: 'guardian-1',
    type: 'guardian',
    domain: null,
    status: 'pending',
    consentRequired: true,
  });
  assert.equal(record.status, 'pending');
  assert.equal(record.consentRequired, true);
});
