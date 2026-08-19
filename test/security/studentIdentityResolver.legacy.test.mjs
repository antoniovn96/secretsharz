import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeStudentIdentity } from '../../src/security/studentIdentityResolver.js';

test('external student ID remains distinct from Auth UID', () => {
  assert.deepEqual(normalizeStudentIdentity({ studentId: 'SS-001' }), { authUid: null, ssStudentId: 'SS-001' });
});

test('Auth UID remains the internal identity when both identifiers are supplied', () => {
  assert.deepEqual(normalizeStudentIdentity({ authUid: 'auth-1', ssStudentId: 'SS-001' }), { authUid: 'auth-1', ssStudentId: 'SS-001' });
});
