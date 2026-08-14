const { getEnv, clearDb, teardownEnv, userContext, assertSucceeds, assertFails, seedAccountConsent, STATIC_TIMESTAMP } = require('./helpers.cjs');
const { setDoc, doc, getDoc } = require('firebase/firestore');

function db(ctx) { return ctx.firestore(); }
function fdb(env, uid, claims = {}) { return env.authenticatedContext(uid, claims).firestore(); }

describe('SERVICE MEMBERSHIP — onboarding selection boundary', () => {
  beforeEach(async () => { await clearDb(); });
  afterAll(async () => { await teardownEnv(); });

  test('allows a student to create only their own primary service membership after consent', async () => {
    const env = await getEnv();
    const uid = 'service-student-1';
    await seedAccountConsent(uid);

    await assertSucceeds(setDoc(doc(fdb(env, uid), 'serviceMemberships', 'career-primary'), {
      personId: uid,
      institutionId: null,
      domain: 'career',
      status: 'active',
      source: 'student',
      isPrimary: true,
      startedAt: STATIC_TIMESTAMP,
      endedAt: null,
    }));
  });

  test('denies service membership without account consent', async () => {
    const env = await getEnv();
    const uid = 'service-student-2';
    await assertFails(setDoc(doc(fdb(env, uid), 'serviceMemberships', 'career-primary'), {
      personId: uid,
      institutionId: null,
      domain: 'career',
      status: 'active',
      source: 'student',
      isPrimary: true,
      startedAt: STATIC_TIMESTAMP,
      endedAt: null,
    }));
  });

  test('denies self-selecting a non-student service domain', async () => {
    const env = await getEnv();
    const uid = 'service-student-3';
    await seedAccountConsent(uid);
    await assertFails(setDoc(doc(fdb(env, uid), 'serviceMemberships', 'professional'), {
      personId: uid,
      institutionId: null,
      domain: 'professional',
      status: 'active',
      source: 'student',
      isPrimary: true,
      startedAt: STATIC_TIMESTAMP,
      endedAt: null,
    }));
  });

  test('denies creating a membership for another person', async () => {
    const env = await getEnv();
    const uid = 'service-student-4';
    await seedAccountConsent(uid);
    await assertFails(setDoc(doc(fdb(env, uid), 'serviceMemberships', 'other-person'), {
      personId: 'someone-else',
      institutionId: null,
      domain: 'career',
      status: 'active',
      source: 'student',
      isPrimary: true,
      startedAt: STATIC_TIMESTAMP,
      endedAt: null,
    }));
  });
});
