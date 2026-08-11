// Secret Sharz — client role-endpoint helper tests (Phase 1D.1).
//
// These verify the ADMIN UI → server-endpoint interaction contract:
//   - the Firebase ID token is sent as `Authorization: Bearer <idToken>`;
//   - exactly { targetUid, action, role } is sent (no mass-assignment);
//   - a 2xx server response yields a success result;
//   - 401/403/400/404/500 responses yield safe, non-leaking UI messages;
//   - a network failure yields a recoverable error;
//   - the helper performs a SINGLE fetch (no duplicate mutation);
//   - the helper does NOT import or call Firestore (no direct users.role write).
//
// `fetch` is stubbed per-test because this is CLIENT-side network code; the
// SERVER security path itself is covered by the real Firebase Auth + Firestore
// emulator integration tests (test/integration/*), which are NOT mocked.
import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { assignRoleViaServer } from '../../src/security/assignRoleClient.js';

const originalFetch = globalThis.fetch;
let lastFetch = null;

function stubFetch(responder) {
  // responder: (url, opts) => { status, body } | Promise<...>
  lastFetch = null;
  globalThis.fetch = async (url, opts) => {
    lastFetch = { url, opts };
    const r = await responder(url, opts);
    return {
      ok: r.status >= 200 && r.status < 300,
      status: r.status,
      json: async () => r.body
    };
  };
}

before(() => { /* save fetch in beforeEach */ });
after(() => { globalThis.fetch = originalFetch; });
beforeEach(() => { lastFetch = null; globalThis.fetch = originalFetch; });

const GOOD = { idToken: 'id-token-abc', targetUid: 'uid-target-1', action: 'set', role: 'counsellor' };

test('1. sends the request to /api/admin/assign-role with POST', async () => {
  stubFetch(() => ({ status: 200, body: { targetUid: GOOD.targetUid, action: 'set', role: 'counsellor', tokenRefreshRequired: true } }));
  await assignRoleViaServer(GOOD);
  assert.equal(lastFetch.url, '/api/admin/assign-role');
  assert.equal(lastFetch.opts.method, 'POST');
});

test('2. sends the Firebase ID token as Authorization: Bearer', async () => {
  stubFetch(() => ({ status: 200, body: { tokenRefreshRequired: true } }));
  await assignRoleViaServer(GOOD);
  assert.equal(lastFetch.opts.headers.Authorization, `Bearer ${GOOD.idToken}`);
  assert.equal(lastFetch.opts.headers['Content-Type'], 'application/json');
});

test('3. sends exactly { targetUid, action, role } — no mass-assignment fields', async () => {
  stubFetch(() => ({ status: 200, body: { tokenRefreshRequired: true } }));
  await assignRoleViaServer(GOOD);
  const sent = JSON.parse(lastFetch.opts.body);
  assert.deepEqual(Object.keys(sent).sort(), ['action', 'role', 'targetUid']);
  assert.equal(sent.targetUid, GOOD.targetUid);
  assert.equal(sent.action, 'set');
  assert.equal(sent.role, 'counsellor');
});

test('4. 2xx response → ok:true with server-confirmed role/action + tokenRefreshRequired', async () => {
  stubFetch(() => ({ status: 200, body: { targetUid: GOOD.targetUid, action: 'set', role: 'counsellor', tokenRefreshRequired: true } }));
  const r = await assignRoleViaServer(GOOD);
  assert.equal(r.ok, true);
  assert.equal(r.role, 'counsellor');
  assert.equal(r.action, 'set');
  assert.equal(r.tokenRefreshRequired, true);
});

test('5. 401 → ok:false with safe authentication message, no token echoed', async () => {
  stubFetch(() => ({ status: 401, body: { error: 'Authentication required.' } }));
  const r = await assignRoleViaServer(GOOD);
  assert.equal(r.ok, false);
  assert.equal(r.status, 401);
  assert.match(r.message, /signed in/i);
  assert.equal(JSON.stringify(r).includes(GOOD.idToken), false, 'idToken must not appear in the result');
});

test('6. 403 → ok:false with safe authorisation message', async () => {
  stubFetch(() => ({ status: 403, body: { error: 'Requester is not authorised.' } }));
  const r = await assignRoleViaServer(GOOD);
  assert.equal(r.ok, false);
  assert.equal(r.status, 403);
  assert.match(r.message, /authorised/i);
});

test('7. 400 (invalid role/action) → ok:false with safe validation message', async () => {
  stubFetch(() => ({ status: 400, body: { error: 'role is not assignable.' } }));
  const r = await assignRoleViaServer(GOOD);
  assert.equal(r.ok, false);
  assert.equal(r.status, 400);
  assert.match(r.message, /invalid|role|action/i);
});

test('8. 404 (target user missing) → ok:false with safe not-found message', async () => {
  stubFetch(() => ({ status: 404, body: { error: 'Target user does not exist.' } }));
  const r = await assignRoleViaServer(GOOD);
  assert.equal(r.ok, false);
  assert.equal(r.status, 404);
  assert.match(r.message, /exist/i);
});

test('9. 500 (server/Firebase failure) → ok:false with generic safe message, no internals', async () => {
  stubFetch(() => ({ status: 500, body: { error: 'internal stack trace with /etc/secret path' } }));
  const r = await assignRoleViaServer(GOOD);
  assert.equal(r.ok, false);
  assert.equal(r.status, 500);
  assert.equal(JSON.stringify(r).includes('stack trace'), false, 'internal error detail must not leak');
  assert.equal(JSON.stringify(r).includes('/etc/secret'), false, 'internal paths must not leak');
});

test('10. network failure (fetch rejects) → ok:false with recoverable message', async () => {
  stubFetch(() => { throw new Error('network down'); });
  const r = await assignRoleViaServer(GOOD);
  assert.equal(r.ok, false);
  assert.equal(r.status, 0);
  assert.match(r.message, /network|try again/i);
  assert.equal(JSON.stringify(r).includes('network down'), false, 'raw transport error must not leak');
});

test('11. a single call performs exactly ONE fetch (no duplicate role mutation)', async () => {
  let calls = 0;
  stubFetch(() => { calls += 1; return { status: 200, body: { tokenRefreshRequired: true } }; });
  await assignRoleViaServer(GOOD);
  assert.equal(calls, 1, 'helper must call fetch exactly once — no duplicate mutation');
});

test('12. missing idToken → ok:false auth error WITHOUT calling fetch', async () => {
  let calls = 0;
  stubFetch(() => { calls += 1; return { status: 200, body: {} }; });
  const r = await assignRoleViaServer({ idToken: '', targetUid: 'u', action: 'set', role: 'counsellor' });
  assert.equal(r.ok, false);
  assert.equal(r.status, 401);
  assert.equal(calls, 0, 'must not call the endpoint without a token');
});

test('13. client-side param validation rejects bad action/role/targetUid before fetch', async () => {
  let calls = 0;
  stubFetch(() => { calls += 1; return { status: 200, body: {} }; });
  const badAction = await assignRoleViaServer({ idToken: 't', targetUid: 'u', action: 'grant', role: 'counsellor' });
  assert.equal(badAction.ok, false);
  const badRole = await assignRoleViaServer({ idToken: 't', targetUid: 'u', action: 'set', role: '' });
  assert.equal(badRole.ok, false);
  const badUid = await assignRoleViaServer({ idToken: 't', targetUid: '', action: 'set', role: 'counsellor' });
  assert.equal(badUid.ok, false);
  assert.equal(calls, 0, 'client validation must short-circuit before any network call');
});

test('14. the helper module does NOT import Firestore (no direct users.role write path)', async () => {
  // Static guard: the client helper must not pull in firebase/firestore or
  // firebase-admin. Reading its source confirms it only performs `fetch`.
  const fs = await import('node:fs');
  const src = fs.readFileSync(new URL('../../src/security/assignRoleClient.js', import.meta.url), 'utf8');
  assert.equal(/from\s+['"]firebase\/(firestore|app|auth)['"]/.test(src), false, 'must not import client firestore/auth');
  assert.equal(/firebase-admin/.test(src), false, 'must not import firebase-admin');
  assert.equal(/updateDoc|setDoc|writeBatch|addDoc/.test(src), false, 'must not call any Firestore write API');
});
