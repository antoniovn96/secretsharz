import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeStudentIdentity } from '../../src/security/studentIdentityResolver.js';

test('normalizes Auth UID and SS Student ID independently', () => {
  assert.deepEqual(normalizeStudentIdentity({ authUid: 'auth-1', ssStudentId: 'SS-001' }), { authUid: 'auth-1', ssStudentId: 'SS-001' });
});

test('external studentId is treated as SS Student ID, not Auth UID', () => {
  assert.deepEqual(normalizeStudentIdentity({ studentId: 'SS-001' }), { authUid: null, ssStudentId: 'SS-001' });
});

test('identity cannot be empty', () => {
  assert.throws(() => normalizeStudentIdentity({}), /Student identity is required/);
});
