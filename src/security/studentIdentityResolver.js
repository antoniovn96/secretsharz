/**
 * Canonical student identity resolver.
 * Auth UID is the internal identity; SS Student ID is the external identifier.
 * `students` is preferred. `users` is a legacy compatibility source only.
 */

function clean(value) {
  const v = String(value || '').trim();
  return v || null;
}

export function normalizeStudentIdentity(raw = {}) {
  const authUid = clean(raw.authUid || raw.uid);
  const ssStudentId = clean(raw.ssStudentId || raw.studentId);
  if (!authUid && !ssStudentId) throw new Error('Student identity is required.');
  return { authUid, ssStudentId };
}

async function findUnique(collection, field, value) {
  if (!value) return null;
  const snap = await collection.where(field, '==', value).limit(2).get();
  if (snap.size > 1) throw new Error(`Multiple student records share the same ${field}.`);
  if (!snap.size) return null;
  return { id: snap.docs[0].id, data: snap.docs[0].data() };
}

function candidate(record, source) {
  if (!record) return null;
  const data = record.data || {};
  return {
    documentId: record.id,
    source,
    authUid: clean(data.authUid || data.uid || (source === 'users' ? record.id : null)),
    ssStudentId: clean(data.ssStudentId || data.studentId),
  };
}

function assertNoConflict(primary, legacy) {
  if (!primary || !legacy) return;
  if (primary.authUid && legacy.authUid && primary.authUid !== legacy.authUid) {
    throw new Error('Student identity conflict: students and users records resolve to different Auth UIDs.');
  }
  if (primary.ssStudentId && legacy.ssStudentId && primary.ssStudentId !== legacy.ssStudentId) {
    throw new Error('Student identity conflict: students and users records resolve to different SS Student IDs.');
  }
}

export async function resolveStudentIdentity({ db, authUid, ssStudentId }) {
  const input = normalizeStudentIdentity({ authUid, ssStudentId });
  const students = db.collection('students');
  const users = db.collection('users');

  const primaryByAuth = await findUnique(students, 'authUid', input.authUid);
  const primaryByStudentId = !primaryByAuth ? await findUnique(students, 'ssStudentId', input.ssStudentId) : null;
  const primary = primaryByAuth || primaryByStudentId;

  const legacyByAuth = await findUnique(users, 'authUid', input.authUid);
  const legacyByStudentId = !legacyByAuth ? await findUnique(users, 'ssStudentId', input.ssStudentId) : null;
  const legacy = legacyByAuth || legacyByStudentId;

  const p = candidate(primary, 'students');
  const l = candidate(legacy, 'users');
  assertNoConflict(p, l);

  if (!p && !l) throw new Error('Student identity could not be resolved.');

  const auth = input.authUid || p?.authUid || l?.authUid;
  const external = input.ssStudentId || p?.ssStudentId || l?.ssStudentId;
  if (!auth) throw new Error('Student record is missing its canonical Auth UID.');

  return {
    authUid: auth,
    ssStudentId: external,
    documentId: p?.documentId || l?.documentId || null,
    source: p ? 'students' : 'users_legacy',
    canonical: Boolean(p),
    legacyDocumentId: l?.documentId || null,
  };
}
