// Secret Sharz — server role-assignment authorization logic unit tests.
//
// These tests exercise the PURE decision functions in
// src/security/roleAssignment.js (and claimRoles.js). They use Node's built-in
// test runner (node:test) — no Babel, no Jest, no Firebase Auth emulator, no
// Admin SDK credentials. The security-critical decisions for the
// pages/api/admin/assign-role.js endpoint are all here; the thin handler wiring
// (verifyIdToken / getUser / setCustomUserClaims / audit write) is documented
// as requiring the Auth emulator + Admin credentials and is not covered by CI.
//
// Run: npm run test:server
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  validateAssignRequest,
  decideAssignment,
  isRequesterAdmin,
  isFounderRequester,
  buildNewClaims,
  buildSafeResponse,
  buildAuditRecord,
  roleFromClaims,
  ROLE_ACTIONS,
  CLAIM_ROLE_KEY,
  ASSIGNABLE_CLAIM_ROLES
} from '../../src/security/roleAssignment.js';
import { FOUNDER_EMAIL } from '../../src/security/claimRoles.js';

const founderToken = { uid: 'founder-uid', email: FOUNDER_EMAIL, email_verified: true };
const adminToken = { uid: 'admin-1', role: 'super_admin' };
const counsellorToken = { uid: 'staff-1', role: 'counsellor' };
const studentToken = { uid: 'student-1' };

test('1. a normal student cannot assign itself super_admin', () => {
  const r = decideAssignment({ requester: studentToken, targetUid: studentToken.uid, action: ROLE_ACTIONS.SET, role: 'super_admin' });
  assert.equal(r.allowed, false); assert.equal(r.status, 403);
});

test('2. a normal student cannot assign another user super_admin', () => {
  const r = decideAssignment({ requester: studentToken, targetUid: 'someone-else', action: ROLE_ACTIONS.SET, role: 'super_admin' });
  assert.equal(r.allowed, false); assert.equal(r.status, 403);
});

test('3. a normal student is not authorized to call the privileged role API', () => {
  assert.equal(isRequesterAdmin(studentToken), false);
  assert.equal(isRequesterAdmin({ ...studentToken }), false);
});

test('4. an unauthenticated request is denied (no/invalid token)', () => {
  assert.equal(isRequesterAdmin(null), false); assert.equal(isRequesterAdmin(undefined), false); assert.equal(isRequesterAdmin({}), false);
});

test('5. a non-admin staff member (counsellor) cannot assign roles', () => {
  assert.equal(isRequesterAdmin(counsellorToken), false);
  const r = decideAssignment({ requester: counsellorToken, targetUid: 'target-uid', action: ROLE_ACTIONS.SET, role: 'counsellor' });
  assert.equal(r.allowed, false); assert.equal(r.status, 403);
});

test('6. a founder admin can assign a permitted role', () => {
  const r = decideAssignment({ requester: founderToken, targetUid: 'target-uid', action: ROLE_ACTIONS.SET, role: 'counsellor' });
  assert.equal(r.allowed, true);
});

test('6b. a super_admin claim holder can assign a permitted role', () => {
  const r = decideAssignment({ requester: adminToken, targetUid: 'target-uid', action: ROLE_ACTIONS.SET, role: 'educator' });
  assert.equal(r.allowed, true);
});

test('7. an admin attempting an invalid role is rejected at validation', () => {
  const r = validateAssignRequest({ targetUid: 't', action: ROLE_ACTIONS.SET, role: 'not_a_real_role' });
  assert.equal(r.ok, false); assert.equal(r.status, 400);
});

test('7b. role "admin" (forged) is not assignable', () => {
  const r = validateAssignRequest({ targetUid: 't', action: ROLE_ACTIONS.SET, role: 'admin' });
  assert.equal(r.ok, false);
});

test('8. an admin cannot inject arbitrary / unrelated claims via the request body', () => {
  const r = validateAssignRequest({ targetUid: 't', action: ROLE_ACTIONS.SET, role: 'counsellor', admin: true, permissions: ['*'], customClaim: 'sneaky' });
  assert.equal(r.ok, false); assert.equal(r.status, 400);
});

test('9. existing unrelated custom claims are preserved when adding a role', () => {
  const existing = { someOtherClaim: 'keep-me', [CLAIM_ROLE_KEY]: 'counsellor', prefs: { theme: 'dark' } };
  const next = buildNewClaims(existing, ROLE_ACTIONS.SET, 'super_admin');
  assert.equal(next[CLAIM_ROLE_KEY], 'super_admin'); assert.equal(next.someOtherClaim, 'keep-me'); assert.deepEqual(next.prefs, { theme: 'dark' });
});

test('10. removing a role actually removes the corresponding privileged claim', () => {
  const existing = { [CLAIM_ROLE_KEY]: 'counsellor', keepMe: true };
  const next = buildNewClaims(existing, ROLE_ACTIONS.REMOVE, 'counsellor');
  assert.equal(CLAIM_ROLE_KEY in next, false); assert.equal(next.keepMe, true);
});

test('rejects an invalid action', () => { assert.equal(validateAssignRequest({ targetUid: 't', action: 'delete', role: 'counsellor' }).ok, false); });
test('rejects a missing targetUid', () => { assert.equal(validateAssignRequest({ action: ROLE_ACTIONS.SET, role: 'counsellor' }).ok, false); });
test('rejects a non-string / empty targetUid', () => {
  assert.equal(validateAssignRequest({ targetUid: '', action: ROLE_ACTIONS.SET, role: 'counsellor' }).ok, false);
  assert.equal(validateAssignRequest({ targetUid: 123, action: ROLE_ACTIONS.SET, role: 'counsellor' }).ok, false);
});
test('rejects a non-object body', () => { assert.equal(validateAssignRequest(null).ok, false); assert.equal(validateAssignRequest([]).ok, false); assert.equal(validateAssignRequest('string').ok, false); });
test('accepts a well-formed set request and returns normalized value', () => {
  const r = validateAssignRequest({ targetUid: 'uid-1', action: ROLE_ACTIONS.SET, role: 'parent' });
  assert.equal(r.ok, true); assert.equal(r.value.targetUid, 'uid-1'); assert.equal(r.value.action, 'set'); assert.equal(r.value.role, 'parent');
});
test('remove action requires the role to be a known assignable role (no arbitrary removal)', () => {
  assert.equal(validateAssignRequest({ targetUid: 't', action: ROLE_ACTIONS.REMOVE, role: 'counsellor' }).ok, true);
  assert.equal(validateAssignRequest({ targetUid: 't', action: ROLE_ACTIONS.REMOVE, role: 'bogus' }).ok, false);
});
test('only the exact allowed body fields are accepted (no extras)', () => { assert.equal(validateAssignRequest({ targetUid: 't', action: ROLE_ACTIONS.SET, role: 'educator', extra: 1 }).ok, false); });

test('founder requester is recognized only with a verified email', () => {
  assert.equal(isFounderRequester(founderToken), true);
  assert.equal(isFounderRequester({ uid: 'x', email: FOUNDER_EMAIL, email_verified: false }), false);
  assert.equal(isFounderRequester({ uid: 'x', email: 'other@example.com', email_verified: true }), false);
});

test('a client-supplied role field on the token is NOT enough without an admin role', () => {
  assert.equal(isRequesterAdmin({ uid: 'x', role: 'counsellor' }), false);
  assert.equal(isRequesterAdmin({ uid: 'x', role: 'parent' }), false);
  assert.equal(isRequesterAdmin({ uid: 'x', role: 'student' }), false);
  assert.equal(isRequesterAdmin({ uid: 'x', role: 'super_admin' }), true);
});

test('safe response does not leak claims or secrets', () => {
  const resp = buildSafeResponse({ targetUid: 't', action: 'set', role: 'counsellor', tokenRefreshRequired: true });
  assert.deepEqual(Object.keys(resp).sort(), ['action', 'role', 'targetUid', 'tokenRefreshRequired']);
  assert.equal(resp.tokenRefreshRequired, true); assert.equal(resp.role, 'counsellor');
});

test('audit record captures actor/target/action/role/prev/new/timestamp and no secrets', () => {
  const rec = buildAuditRecord({ actorUid: 'admin-1', actorEmail: 'admin@example.com', targetUid: 't', action: 'set', role: 'counsellor', previousRole: null, newRole: 'counsellor' });
  assert.equal(rec.actorUid, 'admin-1'); assert.equal(rec.targetUid, 't'); assert.equal(rec.action, 'set'); assert.equal(rec.role, 'counsellor'); assert.equal(rec.previousRole, null); assert.equal(rec.newRole, 'counsellor'); assert.equal(rec.kind, 'role_assignment'); assert.ok(typeof rec.timestamp === 'string' && rec.timestamp.length > 0);
  assert.equal('password' in rec, false); assert.equal('token' in rec, false); assert.equal('claims' in rec, false);
});

test('roleFromClaims reads the role claim and tolerates absence', () => { assert.equal(roleFromClaims({ [CLAIM_ROLE_KEY]: 'counsellor' }), 'counsellor'); assert.equal(roleFromClaims({}), null); assert.equal(roleFromClaims(null), null); });

test('the assignable claim roles include all current privileged roles', () => {
  assert.deepEqual([...ASSIGNABLE_CLAIM_ROLES].sort(), ['career_counsellor', 'counsellor', 'educator', 'institution', 'parent', 'psychologist', 'super_admin']);
  assert.equal(ASSIGNABLE_CLAIM_ROLES.includes('student'), false);
});

test('buildNewClaims rejects non-assignable roles', () => {
  assert.throws(() => buildNewClaims({}, ROLE_ACTIONS.SET, 'student'));
  assert.throws(() => buildNewClaims({}, ROLE_ACTIONS.SET, 'admin'));
  assert.throws(() => buildNewClaims({}, ROLE_ACTIONS.REMOVE, 'bogus'));
  assert.throws(() => buildNewClaims({}, 'bogus-action', 'counsellor'));
});
