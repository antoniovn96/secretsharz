const {
  getEnv,
  clearDb,
  teardownEnv,
  userContext,
  assertFails,
  assertSucceeds
} = require('./helpers.cjs');

const { getDoc, doc } = require('firebase/firestore');

function db(ctx) { return ctx.firestore(); }

beforeEach(async () => { await clearDb(); });
afterAll(async () => { await teardownEnv(); });

describe('canonical cross-user boundary — legacy relationship fields are not Firestore authorization', () => {
  it('DENIES a professional direct read of a student document', async () => {
    const env = await getEnv();
    const professional = userContext(env, 'professional-1', { role: 'counsellor' });
    await assertFails(getDoc(doc(db(professional), 'students', 'student-1')));
  });

  it('DENIES a parent direct read of a student document', async () => {
    const env = await getEnv();
    const parent = userContext(env, 'parent-1', { role: 'parent' });
    await assertFails(getDoc(doc(db(parent), 'students', 'student-1')));
  });

  it('DENIES a professional direct read of legacy career notes', async () => {
    const env = await getEnv();
    const professional = userContext(env, 'professional-1', { role: 'career_counsellor' });
    await assertFails(getDoc(doc(db(professional), 'students', 'student-1', 'career_notes', 'note-1')));
  });

  it('DENIES a professional direct read of legacy career roadmap', async () => {
    const env = await getEnv();
    const professional = userContext(env, 'professional-1', { role: 'career_counsellor' });
    await assertFails(getDoc(doc(db(professional), 'students', 'student-1', 'career_roadmaps', 'roadmap-1')));
  });

  it('ALLOWS a student to read their own students-domain document', async () => {
    const env = await getEnv();
    const student = userContext(env, 'student-1', { role: 'student' });
    await assertSucceeds(getDoc(doc(db(student), 'students', 'student-1')));
  });
});
