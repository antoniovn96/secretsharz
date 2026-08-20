import { formatStudentId, parseStudentIdSequence } from './studentIdentity.js';

const COUNTER_PATH = ['system', 'student_identity_counter'];

export async function seedStudentIdentityCounter(db, existingIds = []) {
  const maxExisting = existingIds.reduce((max, value) => Math.max(max, parseStudentIdSequence(value)), 0);
  const ref = db.collection(COUNTER_PATH[0]).doc(COUNTER_PATH[1]);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = Number(snapshot.exists ? snapshot.data()?.lastSequence || 0 : 0);
    if (maxExisting > current || !snapshot.exists) {
      transaction.set(ref, { lastSequence: Math.max(current, maxExisting), updatedAt: new Date() }, { merge: true });
    }
  });

  return maxExisting;
}

export async function allocateStudentId(db) {
  const ref = db.collection(COUNTER_PATH[0]).doc(COUNTER_PATH[1]);

  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = Number(snapshot.exists ? snapshot.data()?.lastSequence || 0 : 0);
    const next = current + 1;
    const studentId = formatStudentId(next);
    if (!studentId) throw new Error('Unable to allocate a valid Student ID.');

    transaction.set(ref, { lastSequence: next, updatedAt: new Date() }, { merge: true });
    return studentId;
  });
}
