import test from 'node:test';
import assert from 'node:assert/strict';
import { buildClinicalRecord, CLINICAL_PURPOSE } from '../../src/security/clinicalRecordContract.js';

test('clinical record requires canonical student identity', () => {
  assert.throws(
    () => buildClinicalRecord({
      student: { authUid: 'auth-1' },
      providerId: 'provider-1',
      relationshipId: 'relationship-1',
      soap: { subjective: 'x' },
    }),
    /SS Student ID is required/
  );
});

test('clinical record requires canonical professional relationship', () => {
  assert.throws(
    () => buildClinicalRecord({
      student: { authUid: 'auth-1', ssStudentId: 'SS-001' },
      providerId: 'provider-1',
      soap: { subjective: 'x' },
    }),
    /relationshipId is required/
  );
});

test('clinical record carries canonical identity, relationship and purpose', () => {
  const record = buildClinicalRecord({
    student: { authUid: 'auth-1', ssStudentId: 'SS-001' },
    providerId: 'provider-1',
    relationshipId: 'relationship-1',
    soap: { subjective: 'x', objective: 'y' },
  });

  assert.equal(record.authUid, 'auth-1');
  assert.equal(record.ssStudentId, 'SS-001');
  assert.equal(record.providerId, 'provider-1');
  assert.equal(record.relationshipId, 'relationship-1');
  assert.equal(record.service, 'counselling');
  assert.equal(record.purpose, CLINICAL_PURPOSE);
  assert.equal(record.format, 'SOAP');
});
