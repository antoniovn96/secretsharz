import assert from 'node:assert/strict';
import test from 'node:test';
import { provisionParentAccount } from '../../src/security/provisionParentAccount.js';

function makeDb(existingProfile = null, students = {}) {
  const writes = [];
  const userRefs = new Map();
  const refFor = (id) => {
    if (!userRefs.has(id)) {
      userRefs.set(id, {
        id,
        set: async (data, options) => writes.push({ data, options }),
        get: async () => ({ exists: id === 'parent-id' && Boolean(existingProfile), data: () => existingProfile }),
      });
    }
    return userRefs.get(id);
  };
  const relationshipDocs = [];
  const relationshipQuery = {
    where() { return this; },
    limit() { return this; },
    async get() { return { docs: relationshipDocs }; },
  };
  return {
    writes,
    collection(name) {
      if (name === 'users') return { doc: (id) => {
        if (id && Object.prototype.hasOwnProperty.call(students, id)) return { id, get: async () => ({ exists: true, data: () => students[id] }) };
        return refFor(id || 'parent-id');
      } };
      if (name === 'relationships') return { ...relationshipQuery, doc: () => ({ id: `relationship-${relationshipDocs.length + 1}`, set: async (data) => relationshipDocs.push({ id: `relationship-${relationshipDocs.length + 1}`, data: () => data }) }) };
      throw new Error(`Unexpected collection ${name}`);
    },
    async runTransaction(callback) {
      const transaction = {
        async get(studentRef) { return studentRef.get(); },
        set(studentRef, data, options) { writes.push({ studentRef, data, options, transaction: true }); },
        update(ref, patch) { writes.push({ ref, patch, transaction: true }); },
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
    async createUser(data) { calls.created = data; return { uid: 'new-parent-uid', customClaims: {} }; },
    async setCustomUserClaims(uid, claims) { calls.claims = { uid, claims }; },
    async generatePasswordResetLink(email) { calls.resetEmail = email; return 'https://activation.example/one-time'; },
  };
}

const STUDENT = { role: 'student', institutionId: 'school-1', family: { guardians: [] } };

test('provisions a new parent Auth account and parent profile', async () => {
  const adminAuth = makeAuth();
  const adminDb = makeDb(null, { 'student-1': STUDENT });
  const result = await provisionParentAccount({ adminAuth, adminDb, parentName: '  Parent One  ', parentEmail: 'PARENT@EXAMPLE.COM', institutionId: 'school-1', institutionName: 'Example School', studentIds: ['student-1'] });
  assert.equal(result.uid, 'new-parent-uid');
  assert.equal(result.created, true);
  assert.equal(result.activationLink, 'https://activation.example/one-time');
  assert.equal(adminAuth.calls.created.email, 'parent@example.com');
  assert.equal(adminAuth.calls.claims.claims.role, 'parent');
  assert.equal(adminAuth.calls.resetEmail, 'parent@example.com');
  assert.equal(adminDb.writes[0].data.role, 'parent');
  assert.equal(adminDb.writes[0].data.institutionId, 'school-1');
  assert.equal(adminDb.writes[0].data.accountProvisioning.status, 'invited');
  assert.equal(adminDb.writes.some(write => write.transaction === true), true);
});

test('reuses an existing parent account and preserves existing links', async () => {
  const adminAuth = makeAuth({ uid: 'existing-parent', customClaims: { role: 'parent', audit: 'keep' } });
  const adminDb = makeDb({ role: 'parent', institutionId: 'school-1', linkedRosterIds: ['roster-old'], linkedStudentIds: ['student-old'] }, { 'student-new': STUDENT });
  const result = await provisionParentAccount({ adminAuth, adminDb, parentName: 'Parent One', parentEmail: 'parent@example.com', institutionId: 'school-1', rosterIds: ['roster-new'], studentIds: ['student-new'] });
  assert.equal(result.uid, 'existing-parent');
  assert.equal(result.created, false);
  assert.deepEqual(adminDb.writes[0].data.linkedRosterIds.sort(), ['roster-new', 'roster-old']);
  assert.deepEqual(adminDb.writes[0].data.linkedStudentIds.sort(), ['student-new', 'student-old']);
  assert.equal(adminAuth.calls.claims.claims.audit, 'keep');
});

test('rejects a cross-institution parent reassignment', async () => {
  const adminAuth = makeAuth({ uid: 'existing-parent', customClaims: { role: 'parent' } });
  const adminDb = makeDb({ role: 'parent', institutionId: 'school-original' });
  await assert.rejects(() => provisionParentAccount({ adminAuth, adminDb, parentName: 'Parent One', parentEmail: 'parent@example.com', institutionId: 'school-other', studentIds: ['student-1'] }), /already linked to another institution/);
});

test('rejects an email already assigned to a non-parent role', async () => {
  const adminAuth = makeAuth({ uid: 'student-1', customClaims: { role: 'student' } });
  const adminDb = makeDb();
  await assert.rejects(() => provisionParentAccount({ adminAuth, adminDb, parentName: 'Parent One', parentEmail: 'student@example.com', studentIds: ['student-1'] }), /already assigned to the student role/);
});
