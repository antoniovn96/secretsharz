// Secret Sharz — server role-assignment authorization logic unit tests.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateAssignRequest, decideAssignment, isRequesterAdmin, isFounderRequester, buildNewClaims, buildSafeResponse, buildAuditRecord, roleFromClaims, ROLE_ACTIONS, CLAIM_ROLE_KEY, ASSIGNABLE_CLAIM_ROLES } from '../../src/security/roleAssignment.js';
import { FOUNDER_EMAIL } from '../../src/security/claimRoles.js';

const founderToken = { uid: 'founder-uid', email: FOUNDER_EMAIL, email_verified: true };
const adminToken = { uid: 'admin-1', role: 'super_admin' };
const safeguardingToken = { uid: 'sg-1', role: 'safeguarding_officer' };
const counsellorToken = { uid: 'staff-1', role: 'counsellor' };
const studentToken = { uid: 'student-1' };

test('students and non-admin staff cannot assign roles', () => {
  assert.equal(decideAssignment({ requester: studentToken, targetUid: 'x', action: 'set', role: 'super_admin' }).allowed, false);
  assert.equal(decideAssignment({ requester: counsellorToken, targetUid: 'x', action: 'set', role: 'counsellor' }).allowed, false);
});
test('founder and super_admin can assign permitted roles', () => {
  assert.equal(decideAssignment({ requester: founderToken, targetUid: 'x', action: 'set', role: 'counsellor' }).allowed, true);
  assert.equal(decideAssignment({ requester: adminToken, targetUid: 'x', action: 'set', role: 'safeguarding_officer' }).allowed, true);
});
test('safeguarding officer cannot administer roles', () => { assert.equal(isRequesterAdmin(safeguardingToken), false); });
test('invalid or injected role requests are rejected', () => {
  assert.equal(validateAssignRequest({ targetUid: 't', action: 'set', role: 'not_a_real_role' }).ok, false);
  assert.equal(validateAssignRequest({ targetUid: 't', action: 'set', role: 'counsellor', admin: true }).ok, false);
  assert.equal(validateAssignRequest({ targetUid: 't', action: 'delete', role: 'counsellor' }).ok, false);
});
test('existing unrelated custom claims are preserved', () => {
  const next = buildNewClaims({ someOtherClaim: 'keep', [CLAIM_ROLE_KEY]: 'counsellor' }, 'set', 'super_admin');
  assert.equal(next[CLAIM_ROLE_KEY], 'super_admin'); assert.equal(next.someOtherClaim, 'keep');
});
test('removing a role removes only the role claim', () => {
  const next = buildNewClaims({ [CLAIM_ROLE_KEY]: 'counsellor', keepMe: true }, 'remove', 'counsellor');
  assert.equal(CLAIM_ROLE_KEY in next, false); assert.equal(next.keepMe, true);
});
test('founder requires verified email', () => {
  assert.equal(isFounderRequester(founderToken), true);
  assert.equal(isFounderRequester({ email: FOUNDER_EMAIL, email_verified: false }), false);
});
test('safe response and audit record do not expose secrets', () => {
  const resp = buildSafeResponse({ targetUid: 't', action: 'set', role: 'counsellor', tokenRefreshRequired: true });
  assert.deepEqual(Object.keys(resp).sort(), ['action', 'role', 'targetUid', 'tokenRefreshRequired']);
  const rec = buildAuditRecord({ actorUid: 'a', actorEmail: 'a@example.com', targetUid: 't', action: 'set', role: 'counsellor', previousRole: null, newRole: 'counsellor' });
  assert.equal(rec.kind, 'role_assignment'); assert.equal('password' in rec, false); assert.equal('token' in rec, false);
});
test('assignable roles include safeguarding officer but never student', () => {
  assert.equal(ASSIGNABLE_CLAIM_ROLES.includes('safeguarding_officer'), true);
  assert.equal(ASSIGNABLE_CLAIM_ROLES.includes('student'), false);
});
test('well-formed requests are accepted', () => {
  const r = validateAssignRequest({ targetUid: 'uid-1', action: 'set', role: 'safeguarding_officer' });
  assert.equal(r.ok, true); assert.equal(r.value.role, 'safeguarding_officer');
});
test('missing/invalid body is rejected', () => {
  assert.equal(validateAssignRequest(null).ok, false);
  assert.equal(validateAssignRequest({ targetUid: '', action: 'set', role: 'counsellor' }).ok, false);
});
test('roleFromClaims reads only the role claim', () => {
  assert.equal(roleFromClaims({ role: 'counsellor' }), 'counsellor'); assert.equal(roleFromClaims({}), null);
});
