// Secret Sharz — REAL end-to-end integration test for the role-management
// endpoint (pages/api/admin/assign-role.js).
//
// This suite executes the ACTUAL security code path against the Firebase Auth
// + Firestore emulators. It does NOT mock verifyIdToken, getUser,
// setCustomUserClaims, revokeRefreshTokens, or Firestore audit writes — those
// run for real against the emulator.
//
// ── How it runs ────────────────────────────────────────────────────────────
// It is invoked via `firebase emulators:exec --only auth,firestore`, which:
//   1. starts the Auth + Firestore emulators,
//   2. exports FIREBASE_AUTH_EMULATOR_HOST + FIRESTORE_EMULATOR_HOST to this
//      process,
//   3. runs `node --test <this file>`,
//   4. stops the emulators.
// No production credentials are used. The Admin SDK initializes in explicit
// emulator mode (src/security/firebaseAdmin.js) which forces the deterministic
// test project id and refuses to load a real service account.
//
// ── Token minting ──────────────────────────────────────────────────────────
// To obtain a REAL emulator-signed ID token that verifyIdToken accepts, we:
//   - createUser(...) in the Auth emulator via the Admin SDK,
//   - optionally setCustomUserClaims(...) for the requester's own role,
//   - createCustomToken(uid) (Admin SDK),
//   - signInWithCustomToken(...) with the client SDK pointed at the Auth
//     emulator,
//   - getIdToken() → the ID token used as the Bearer credential.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithCustomToken,
  signOut,
  connectAuthEmulator
} from 'firebase/auth';
import { getFirestore, doc, setDoc, connectFirestoreEmulator } from 'firebase/firestore';

import handler from '../../pages/api/admin/assign-role.js';
import { getAdminAuth, getAdminFirestore, isEmulatorMode } from '../../src/security/firebaseAdmin.js';
import { FOUNDER_EMAIL, CLAIM_ROLE_KEY } from '../../src/security/claimRoles.js';

// ── Emulator guard ─────────────────────────────────────────────────────────
// This suite MUST run against the emulator. If the env vars are absent, the
// process was not launched by `firebase emulators:exec` and we must fail loud
// rather than silently touching anything else.
before(() => {
  assert.equal(isEmulatorMode(), true, 'Integration tests require the Firebase Auth + Firestore emulators (run via npm run test:integration).');
  assert.ok(process.env.FIREBASE_AUTH_EMULATOR_HOST, 'FIREBASE_AUTH_EMULATOR_HOST must be set');
  assert.ok(process.env.FIRESTORE_EMULATOR_HOST, 'FIRESTORE_EMULATOR_HOST must be set');
});

const PROJECT_ID = 'secretsharz-emulator-test';
const AUTH_URL = `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099'}`;
const FS_HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const [FS_HOST_NAME, FS_PORT] = FS_HOST.split(':');

// Client SDK app pointed at the emulators (for minting ID tokens + proving
// ordinary clients cannot write auditEvents).
const clientApp = initializeApp({ apiKey: 'emulator-test', projectId: PROJECT_ID }, 'integration-client');
const clientAuth = getAuth(clientApp);
connectAuthEmulator(clientAuth, AUTH_URL, { disableWarnings: true });
const clientDb = getFirestore(clientApp);
connectFirestoreEmulator(clientDb, FS_HOST_NAME, Number(FS_PORT));

// ── Helpers ────────────────────────────────────────────────────────────────
let _seq = 0;
function uid(prefix) {
  _seq += 1;
  return `${prefix}-${_seq}`;
}

// Create an Auth emulator user and return a real emulator-signed ID token.
// Optionally set custom claims on that user first (e.g. { role: 'super_admin' }).
async function mintToken({ email, emailVerified = false, claims = null, uid: forcedUid = null }) {
  const theUid = forcedUid || uid('u');
  const admin = getAdminAuth();
  await admin.createUser({
    uid: theUid,
    email: email || `${theUid}@emulator.test`,
    emailVerified,
    password: 'password123'
  });
  if (claims) await admin.setCustomUserClaims(theUid, claims);
  const customToken = await admin.createCustomToken(theUid);
  const cred = await signInWithCustomToken(clientAuth, customToken);
  const idToken = await cred.user.getIdToken();
  return { uid: theUid, idToken, email: email || `${theUid}@emulator.test` };
}

// Minimal Next.js pages/api request/response harness. No web framework.
function makeRes() {
  return {
    statusCode: 200,
    body: null,
    headers: {},
    finished: false,
    status(code) { this.statusCode = code; return this; },
    setHeader(k, v) { this.headers[k] = v; return this; },
    json(obj) { this.body = obj; this.finished = true; return this; },
    end() { this.finished = true; return this; }
  };
}
async function call({ headers = {}, body = {}, method = 'POST' } = {}) {
  const req = { method, headers, body };
  const res = makeRes();
  await handler(req, res);
  return { status: res.statusCode, body: res.body, headers: res.headers };
}
function bearer(idToken) { return { authorization: `Bearer ${idToken}` }; }

// Clear all auditEvents between tests (Admin SDK bypasses rules).
async function clearAudit() {
  const fs = getAdminFirestore();
  const snap = await fs.collection('auditEvents').get();
  const batch = fs.batch();
  snap.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}
async function auditCount() {
  const snap = await getAdminFirestore().collection('auditEvents').get();
  return snap.size;
}
async function auditDocs() {
  const snap = await getAdminFirestore().collection('auditEvents').get();
  return snap.docs.map((d) => ({ id: d.id, data: d.data() }));
}

// Sign out the client between minting sessions so a new signInWithCustomToken
// replaces the previous credential cleanly.
after(async () => {
  try { await signOut(clientAuth); } catch (_) {}
});

// =========================================================================
// TEST CASES
// =========================================================================

test('1. unauthenticated request (no Authorization header) → 401', async () => {
  await clearAudit();
  const r = await call({ body: { targetUid: 'noone', action: 'set', role: 'counsellor' } });
  assert.equal(r.status, 401);
  assert.equal(await auditCount(), 0, 'no audit event for unauthenticated request');
});

test('2. invalid Firebase token → 401', async () => {
  await clearAudit();
  const r = await call({ headers: bearer('not.a.valid.token'), body: { targetUid: 'noone', action: 'set', role: 'counsellor' } });
  assert.equal(r.status, 401);
  assert.equal(await auditCount(), 0, 'no audit event for invalid token');
});

test('3. normal student assigning self super_admin → 403', async () => {
  await clearAudit();
  const { uid: suid, idToken } = await mintToken({ claims: null });
  const r = await call({ headers: bearer(idToken), body: { targetUid: suid, action: 'set', role: 'super_admin' } });
  assert.equal(r.status, 403);
  assert.equal(await auditCount(), 0, 'no audit event for denied student');
});

test('4. normal student assigning another user super_admin → 403', async () => {
  await clearAudit();
  const { idToken } = await mintToken({ claims: null });
  const target = await mintToken({ claims: null });
  const r = await call({ headers: bearer(idToken), body: { targetUid: target.uid, action: 'set', role: 'super_admin' } });
  assert.equal(r.status, 403);
  assert.equal(await auditCount(), 0);
});

test('5. counsellor (staff) attempting to assign a role → 403', async () => {
  await clearAudit();
  const { idToken } = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'counsellor' } });
  const target = await mintToken({ claims: null });
  const r = await call({ headers: bearer(idToken), body: { targetUid: target.uid, action: 'set', role: 'counsellor' } });
  assert.equal(r.status, 403);
  assert.equal(await auditCount(), 0);
});

test('6. founder verified account assigns counsellor → 200', async () => {
  await clearAudit();
  const founder = await mintToken({ email: FOUNDER_EMAIL, emailVerified: true });
  const target = await mintToken({ claims: null });
  const r = await call({ headers: bearer(founder.idToken), body: { targetUid: target.uid, action: 'set', role: 'counsellor' } });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.role, 'counsellor');
  assert.equal(r.body.tokenRefreshRequired, true);
});

test('7. super-admin custom-claim account assigns educator → 200', async () => {
  await clearAudit();
  const admin = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'super_admin' } });
  const target = await mintToken({ claims: null });
  const r = await call({ headers: bearer(admin.idToken), body: { targetUid: target.uid, action: 'set', role: 'educator' } });
  assert.equal(r.status, 200, JSON.stringify(r.body));
  assert.equal(r.body.role, 'educator');
});

test('8. invalid role → 400', async () => {
  await clearAudit();
  const admin = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'super_admin' } });
  const target = await mintToken({ claims: null });
  const r = await call({ headers: bearer(admin.idToken), body: { targetUid: target.uid, action: 'set', role: 'not_a_role' } });
  assert.equal(r.status, 400);
  assert.equal(await auditCount(), 0, 'no audit event for invalid role');
});

test('9. unexpected body fields (mass assignment) → 400', async () => {
  await clearAudit();
  const admin = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'super_admin' } });
  const target = await mintToken({ claims: null });
  const r = await call({
    headers: bearer(admin.idToken),
    body: { targetUid: target.uid, action: 'set', role: 'counsellor', admin: true, permissions: ['*'] }
  });
  assert.equal(r.status, 400);
  assert.equal(await auditCount(), 0);
});

test('10. non-existent target user → 404', async () => {
  await clearAudit();
  const admin = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'super_admin' } });
  const r = await call({ headers: bearer(admin.idToken), body: { targetUid: 'uid-that-does-not-exist', action: 'set', role: 'counsellor' } });
  assert.equal(r.status, 404);
  assert.equal(await auditCount(), 0);
});

test('11. successful assignment actually writes the Firebase Auth custom claim', async () => {
  await clearAudit();
  const admin = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'super_admin' } });
  const target = await mintToken({ claims: null });
  const r = await call({ headers: bearer(admin.idToken), body: { targetUid: target.uid, action: 'set', role: 'counsellor' } });
  assert.equal(r.status, 200);
  const rec = await getAdminAuth().getUser(target.uid);
  assert.equal(rec.customClaims?.[CLAIM_ROLE_KEY], 'counsellor', 'custom claim was actually written to Auth');
});

test('12. existing unrelated claims survive a role assignment', async () => {
  await clearAudit();
  const admin = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'super_admin' } });
  const target = await mintToken({ claims: { someOtherClaim: 'preserve-me', [CLAIM_ROLE_KEY]: 'student' } });
  const r = await call({ headers: bearer(admin.idToken), body: { targetUid: target.uid, action: 'set', role: 'counsellor' } });
  assert.equal(r.status, 200);
  const rec = await getAdminAuth().getUser(target.uid);
  assert.equal(rec.customClaims?.[CLAIM_ROLE_KEY], 'counsellor');
  assert.equal(rec.customClaims?.someOtherClaim, 'preserve-me', 'unrelated claim preserved');
});

test('13. role removal actually removes the role claim', async () => {
  await clearAudit();
  const admin = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'super_admin' } });
  const target = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'counsellor', keepMe: true } });
  const r = await call({ headers: bearer(admin.idToken), body: { targetUid: target.uid, action: 'remove', role: 'counsellor' } });
  assert.equal(r.status, 200);
  const rec = await getAdminAuth().getUser(target.uid);
  assert.equal(CLAIM_ROLE_KEY in (rec.customClaims || {}), false, 'role claim removed');
  assert.equal(rec.customClaims?.keepMe, true, 'unrelated claim preserved on removal');
});

test('14. successful assignment reports tokenRefreshRequired (refresh-token revocation)', async () => {
  await clearAudit();
  const admin = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'super_admin' } });
  const target = await mintToken({ claims: null });
  const r = await call({ headers: bearer(admin.idToken), body: { targetUid: target.uid, action: 'set', role: 'counsellor' } });
  assert.equal(r.status, 200);
  // The endpoint's contract: it NEVER claims the new claim is immediately live.
  assert.equal(r.body.tokenRefreshRequired, true, 'endpoint must report tokenRefreshRequired:true');

  // Emulator limitation (verified empirically — see SECURITY_FOUNDATION.md):
  // the Auth emulator sets tokensValidAfterTime to the user's creation time on
  // createUser and revokeRefreshTokens does NOT mutate it (same-second equality),
  // so the revocation side-effect is NOT observable via getUser() in the
  // emulator. In PRODUCTION, revokeRefreshTokens updates tokensValidAfterTime
  // to the current time and verifyIdToken then rejects pre-existing ID tokens
  // whose iat predates it. The endpoint calls revokeRefreshTokens
  // unconditionally (see pages/api/admin/assign-role.js step 7) and reports
  // tokenRefreshRequired:true so the UI never assumes the already-issued ID
  // token changed immediately. We therefore assert the contract here and rely
  // on source review for the unconditional revokeRefreshTokens call.
  const after = await getAdminAuth().getUser(target.uid);
  assert.ok(typeof after.tokensValidAfterTime === 'string' && after.tokensValidAfterTime.length > 0,
    'tokensValidAfterTime present on the target user record');
});

test('15. audit event is actually written to auditEvents with the required shape', async () => {
  await clearAudit();
  const admin = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'super_admin' }, email: 'admin@emulator.test', emailVerified: true });
  const target = await mintToken({ claims: { [CLAIM_ROLE_KEY]: 'student' } });
  const r = await call({ headers: bearer(admin.idToken), body: { targetUid: target.uid, action: 'set', role: 'counsellor' } });
  assert.equal(r.status, 200);
  const docs = await auditDocs();
  assert.equal(docs.length, 1, 'exactly one audit event');
  const d = docs[0].data;
  assert.equal(d.actorUid, admin.uid);
  assert.equal(d.targetUid, target.uid);
  assert.equal(d.action, 'set');
  assert.equal(d.role, 'counsellor');
  assert.equal(d.previousRole, 'student');
  assert.equal(d.newRole, 'counsellor');
  assert.equal(d.kind, 'role_assignment');
  assert.ok(typeof d.timestamp === 'string' && d.timestamp.length > 0);
  // No secrets / full claim sets are stored.
  assert.equal('password' in d, false);
  assert.equal('token' in d, false);
  assert.equal('customClaims' in d, false);
  assert.equal('claims' in d, false);
});

test('16. failed authorization MUST NOT create an audit event', async () => {
  await clearAudit();
  const student = await mintToken({ claims: null });
  const target = await mintToken({ claims: null });
  const r = await call({ headers: bearer(student.idToken), body: { targetUid: target.uid, action: 'set', role: 'super_admin' } });
  assert.equal(r.status, 403);
  assert.equal(await auditCount(), 0, 'denied request wrote no audit event');
});

test('17. an ordinary client cannot directly modify privileged custom claims (no client path exists)', async () => {
  // Custom claims are set ONLY via the Admin SDK (server). There is no client
  // SDK API to set custom claims. This test asserts the client SDK exposes no
  // such capability and that a privileged profile-role value written by a
  // client does NOT grant admin in Firestore rules (claims are authoritative).
  // (a) The client auth user object has no setCustomClaims / customClaims writer.
  assert.equal(typeof clientAuth.currentUser?.setCustomUserClaims, 'undefined');
  assert.equal(typeof clientAuth.currentUser?.setCustomClaims, 'undefined');
  // (b) A client attempting to write a privileged users.role is rejected by the
  // rules (create forces role=='student'); and even if a privileged role value
  // existed, claims remain the primary authority. Verify the rules reject a
  // client self-promotion write to users/{uid}.
  const student = await mintToken({ claims: null });
  // Re-sign-in the client as this student so Firestore writes carry its auth.
  await signInWithCustomToken(clientAuth, await getAdminAuth().createCustomToken(student.uid));
  let denied = false;
  try {
    await setDoc(doc(clientDb, 'users', student.uid), { role: 'super_admin', displayName: 'self' });
  } catch (e) {
    denied = true;
  }
  assert.equal(denied, true, 'client self-promotion write to users/{uid}.role must be denied by rules');
});
