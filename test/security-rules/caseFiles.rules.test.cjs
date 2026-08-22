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

const { setDoc, getDoc, doc } = require('firebase/firestore');

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

    await assertSucceeds(
      setDoc(
        doc(fdb(env, 'career-pro-5', { role: 'career_counsellor' }), 'caseFiles', 'student-case-5'),
        { studentId: 'student-case-5', staffId: 'career-pro-5', isPrivate: true, history: [] }
      )
    );

    await assertFails(
      getDoc(doc(fdb(env, 'career-pro-4', { role: 'career_counsellor' }), 'caseFiles', 'student-case-5'))
    );
  });
});
