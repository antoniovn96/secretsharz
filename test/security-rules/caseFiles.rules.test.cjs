// Secret Sharz — case-file assignment boundary tests.
// These tests run against the Firestore Emulator and verify that a staff
// member cannot create or access a case file for an unrelated student.
const {
  getEnv,
  clearDb,
  teardownEnv,
  assertSucceeds,
  assertFails
} = require('./helpers.cjs');

const { setDoc, getDoc, deleteDoc, doc } = require('firebase/firestore');

function fdb(env, uid, claims = {}) {
  return env.authenticatedContext(uid, claims).firestore();
}

beforeEach(async () => {
  await clearDb();
});

afterAll(async () => {
  await teardownEnv();
});

async function seedStudent(env, studentId, assignedUid) {
  await assertSucceeds(
    setDoc(doc(fdb(env, 'admin-case-test', { role: 'super_admin' }), 'students', studentId), {
      userId: studentId,
      profile: { name: `Student ${studentId}` },
      assignedStaff: { careerId: assignedUid, psychId: null, senId: null },
      relationships: { assignments: { career: assignedUid, wellbeing: null, sen: null } },
      parent: { userId: null }
    })
  );
}

async function seedCaseFile(env, studentId, staffId, isPrivate = true) {
  await assertSucceeds(
    setDoc(
      doc(fdb(env, staffId, { role: 'career_counsellor' }), 'caseFiles', studentId),
      { studentId, staffId, isPrivate, history: [] }
    )
  );
}

describe('caseFiles — assignment boundary', () => {
  it('ALLOWS an assigned professional to create a case file for the assigned student', async () => {
    const env = await getEnv();
    await seedStudent(env, 'student-case-1', 'career-pro-1');

    await assertSucceeds(
      setDoc(
        doc(fdb(env, 'career-pro-1', { role: 'career_counsellor' }), 'caseFiles', 'student-case-1'),
        { studentId: 'student-case-1', staffId: 'career-pro-1', isPrivate: true, history: [] }
      )
    );
  });

  it('DENIES an unrelated professional from creating a case file for another student', async () => {
    const env = await getEnv();
    await seedStudent(env, 'student-case-2', 'career-pro-2');

    await assertFails(
      setDoc(
        doc(fdb(env, 'career-pro-other', { role: 'career_counsellor' }), 'caseFiles', 'student-case-2'),
        { studentId: 'student-case-2', staffId: 'career-pro-other', isPrivate: true, history: [] }
      )
    );
  });

  it('DENIES a professional from creating a case file by omitting the staffId', async () => {
    const env = await getEnv();
    await seedStudent(env, 'student-case-3', 'career-pro-3');

    await assertFails(
      setDoc(
        doc(fdb(env, 'career-pro-3', { role: 'career_counsellor' }), 'caseFiles', 'student-case-3'),
        { studentId: 'student-case-3', isPrivate: true, history: [] }
      )
    );
  });

  it('DENIES an assigned professional from reading a different student case file', async () => {
    const env = await getEnv();
    await seedStudent(env, 'student-case-4', 'career-pro-4');
    await seedStudent(env, 'student-case-5', 'career-pro-5');
    await seedCaseFile(env, 'student-case-5', 'career-pro-5');

    await assertFails(
      getDoc(doc(fdb(env, 'career-pro-4', { role: 'career_counsellor' }), 'caseFiles', 'student-case-5'))
    );
  });

  it('DENIES a previously assigned professional after the student is reassigned', async () => {
    const env = await getEnv();
    await seedStudent(env, 'student-case-reassigned', 'career-pro-old');
    await seedCaseFile(env, 'student-case-reassigned', 'career-pro-old');

    await assertSucceeds(
      setDoc(
        doc(fdb(env, 'admin-case-test', { role: 'super_admin' }), 'students', 'student-case-reassigned'),
        {
          assignedStaff: { careerId: 'career-pro-new', psychId: null, senId: null },
          relationships: { assignments: { career: 'career-pro-new', wellbeing: null, sen: null } }
        },
        { merge: true }
      )
    );

    await assertFails(
      getDoc(doc(fdb(env, 'career-pro-old', { role: 'career_counsellor' }), 'caseFiles', 'student-case-reassigned'))
    );
  });

  it('DENIES a previously assigned professional from deleting a stale case file after reassignment', async () => {
    const env = await getEnv();
    await seedStudent(env, 'student-case-delete', 'career-pro-old-delete');
    await seedCaseFile(env, 'student-case-delete', 'career-pro-old-delete');

    await assertSucceeds(
      setDoc(
        doc(fdb(env, 'admin-case-test', { role: 'super_admin' }), 'students', 'student-case-delete'),
        {
          assignedStaff: { careerId: 'career-pro-new-delete', psychId: null, senId: null },
          relationships: { assignments: { career: 'career-pro-new-delete', wellbeing: null, sen: null } }
        },
        { merge: true }
      )
    );

    await assertFails(
      deleteDoc(doc(fdb(env, 'career-pro-old-delete', { role: 'career_counsellor' }), 'caseFiles', 'student-case-delete'))
    );
  });
});
