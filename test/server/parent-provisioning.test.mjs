import assert from 'node:assert/strict';
import test from 'node:test';
import { provisionParentAccount } from '../../src/security/provisionParentAccount.js';

function makeDb(existingProfile = null) {
  const writes = [];
  const parentRef = {
    set: async (data, options) => writes.push({ data, options }),
    get: async () => ({ exists: Boolean(existingProfile), data: () => existingProfile }),
  };
  const studentRef = {
    set: async () => {},
    get: async () => ({ exists: true, data: () => ({ role: 'student', family: { guardians: [] } }) }),
  };
  return {
    writes,
    collection(name) {
      assert.equal(name, 'users');
      return {
        doc: (id) => id === 'new-parent-uid' || id === 'existing-parent' ? parentRef : studentRef,
      };
    },
    async runTransaction(callback) {
      const transaction = {
        async get(ref) { return ref.get(); },
        set(ref, data, options) { return ref.set(data, options); },
      };
      return callback(transaction);
    },
  };
}

function makeAuth(user = null) {
  const calls = { created: null, claims: null, resetEmail: null };
  return {
    calls,
    async getUserByEmail() {
      if (!user) throw Object.assign(new Error('missing'), { code: 'auth/user-not-found' });
      return user;
    },
    async createUser(data) {
      calls.created = data;
      return { uid: 'new-parent-uid', customClaims: {} };
    },
    async setCustomUserClaims(uid, claims) {
      calls.claims = { uid, claims };
    },
    async generatePasswordResetLink(email) {
      calls.resetEmail = email;
      return 'https://activation.example/one-time';
    },
  };
}

test('provisions a new parent Auth account and parent profile', async () => {
  const adminAuth = makeAuth();
  const adminDb = makeDb();
  const result = await provisionParentAccount({
    adminAuth,
    adminDb,
    parentName: '  Parent One  ',
    parentEmail: 'PARENT@EXAMPLE.COM',
    institutionId: 'school-1',
    institutionName: 'Example School',
    studentIds: ['student-1'],
  });

  assert.equal(result.uid, 'new-parent-uid');
  assert.equal(result.created, true);
  assert.equal(result.activationLink, 'https://activation.example/one-time');
  assert.equal(adminAuth.calls.created.email, 'parent@example.com');
  assert.equal(adminAuth.calls.claims.claims.role, 'parent');
  assert.equal(adminAuth.calls.resetEmail, 'parent@example.com');
  assert.equal(adminDb.writes[0].data.role, 'parent');
  assert.equal(adminDb.writes[0].data.institutionId, 'school-1');
  assert.equal(adminDb.writes[0].data.accountProvisioning.status, 'invited');
});

test('reuses an existing parent account and preserves existing links', async () => {
  const adminAuth = makeAuth({ uid: 'existing-parent', customClaims: { role: 'parent', audit: 'keep' } });
  const adminDb = makeDb({
    role: 'parent',
    institutionId: 'school-1',
    linkedRosterIds: ['roster-old'],
    linkedStudentIds: ['student-old'],
  });
  const result = await provisionParentAccount({
    adminAuth,
    adminDb,
    parentName: 'Parent One',
    parentEmail: 'parent@example.com',
    institutionId: 'school-1',
    rosterIds: ['roster-new'],
    studentIds: ['student-new'],
  });

  assert.equal(result.uid, 'existing-parent');
  assert.equal(result.created, false);
  assert.deepEqual(adminDb.writes[0].data.linkedRosterIds.sort(), ['roster-new', 'roster-old']);
  assert.deepEqual(adminDb.writes[0].data.linkedStudentIds.sort(), ['student-new', 'student-old']);
  assert.equal(adminAuth.calls.claims.claims.audit, 'keep');
});

test('rejects a cross-institution parent reassignment', async () => {
  const adminAuth = makeAuth({ uid: 'existing-parent', customClaims: { role: 'parent' } });
  const adminDb = makeDb({ role: 'parent', institutionId: 'school-original' });

  await assert.rejects(
    () => provisionParentAccount({
      adminAuth,
      adminDb,
      parentName: 'Parent One',
      parentEmail: 'parent@example.com',
      institutionId: 'school-other',
    }),
    /already linked to another institution/
  );
});

test('rejects an email already assigned to a non-parent role', async () => {
  const adminAuth = makeAuth({ uid: 'student-1', customClaims: { role: 'student' } });
  const adminDb = makeDb();

  await assert.rejects(
    () => provisionParentAccount({
      adminAuth,
      adminDb,
      parentName: 'Parent One',
      parentEmail: 'student@example.com',
    }),
    /already assigned to the student role/
  );
});
