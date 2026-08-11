// Secret Sharz — Phase 1 Firestore security-rule tests.
//
// These tests prove the security boundaries defined by firestore.rules against
// the Firestore Emulator. They do NOT connect to production and use no
// production credentials.
//
// Source of truth for every expectation here is firestore.rules on this branch
// (security/phase-1-privacy-consent-foundation), together with the consent
// schema in src/security/consentPolicy.js.
//
// IMPORTANT: Passing tests do not constitute production security approval.
const {
  getEnv,
  clearDb,
  teardownEnv,
  userContext,
  anonContext,
  founderContext,
  validAccountConsent,
  validStudentProfile,
  seedAccountConsent,
  seedConsentDoc,
  seedRawConsentDoc,
  seedStudentProfile,
  accountConsentId,
  CONSENT_TYPES,
  POLICY_VERSION,
  STATIC_TIMESTAMP,
  assertSucceeds,
  assertFails
} = require('./helpers.cjs');

const { setDoc, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } = require('firebase/firestore');

// Firestore instance helper bound to a context.
function db(ctx) {
  return ctx.firestore();
}

// Fresh authenticated Firestore instance for a single operation. The modular
// Firestore SDK caches instance settings per app; reusing one context across a
// serverTimestamp() write and a follow-up op can wedge it ("settings can no
// longer be changed"). Each authenticatedContext() yields a distinct app, so
// obtaining a fresh db per op keeps the suite stable.
function fdb(env, uid, claims = {}) {
  return env.authenticatedContext(uid, claims).firestore();
}

function afdb(env) {
  return env.unauthenticatedContext().firestore();
}

beforeEach(async () => {
  await clearDb();
});

afterAll(async () => {
  await teardownEnv();
});

// ============================================================
// TEST GROUP 1 — CONSENT BEFORE PROFILE
// ============================================================
describe('GROUP 1 — consent before profile', () => {
  const uid = 'student-1';

  it('DENIES self profile creation when account consent is missing', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      setDoc(doc(db(ctx), 'users', uid), validStudentProfile())
    );
  });

  it('ALLOWS self profile creation after valid account consent exists', async () => {
    const env = await getEnv();
    // Create the consent event THROUGH the rules (positive path for consent).
    await assertSucceeds(
      setDoc(
        doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), createdAt: serverTimestamp() }
      )
    );
    // Now profile creation must succeed (fresh instance for the second op).
    await assertSucceeds(
      setDoc(doc(fdb(env, uid), 'users', uid), validStudentProfile())
    );
  });

  it('DENIES profile creation when consent doc id is wrong', async () => {
    const env = await getEnv();
    // A consent event under a non-matching id cannot satisfy hasAccountConsent.
    // It is also rejected at create time because the id must be account_{uid}.
    await assertFails(
      setDoc(
        doc(fdb(env, uid), 'consentEvents', 'not_the_right_id'),
        { ...validAccountConsent(uid), createdAt: serverTimestamp() }
      )
    );
    // Profile creation still denied because no account_{uid} consent exists.
    await assertFails(
      setDoc(doc(fdb(env, uid), 'users', uid), validStudentProfile())
    );
  });

  it('DENIES consent creation with a wrong (unknown) consent type', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    // The allowlist in validConsentEventCreate() rejects unknown types.
    await assertFails(
      setDoc(
        doc(db(ctx), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), type: 'not_a_real_type', createdAt: serverTimestamp() }
      )
    );
  });

  it('DENIES consent creation with a wrong action', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      setDoc(
        doc(db(ctx), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), action: 'not_a_real_action', createdAt: serverTimestamp() }
      )
    );
  });

  it('DENIES consent creation with a wrong actorType', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      setDoc(
        doc(db(ctx), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), actorType: 'admin', createdAt: serverTimestamp() }
      )
    );
  });

  it('DENIES consent creation with wrong policy version', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      setDoc(
        doc(db(ctx), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), policyVersion: '0.0.0', createdAt: serverTimestamp() }
      )
    );
  });

  it('DENIES consent creation with wrong userId', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      setDoc(
        doc(db(ctx), 'consentEvents', accountConsentId('someone_else')),
        { ...validAccountConsent('someone_else'), createdAt: serverTimestamp() }
      )
    );
  });

  it('DENIES consent creation when required fields are missing', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    const { actorType, ...missingActor } = validAccountConsent(uid);
    await assertFails(
      setDoc(
        doc(db(ctx), 'consentEvents', accountConsentId(uid)),
        { ...missingActor, createdAt: serverTimestamp() }
      )
    );
  });

  it('DENIES consent creation with extra unexpected fields', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      setDoc(
        doc(db(ctx), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), sneakyAdminFlag: true, createdAt: serverTimestamp() }
      )
    );
  });

  it('DENIES unauthorised modification of a consent event', async () => {
    const env = await getEnv();
    // Seed a valid consent through the rules (fresh instance for the write).
    await assertSucceeds(
      setDoc(
        doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), createdAt: serverTimestamp() }
      )
    );
    // Update is forbidden by rule (allow update, delete: if false).
    await assertFails(
      updateDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)), { action: 'withdrawn' })
    );
  });

  it('DENIES deletion of a consent event', async () => {
    const env = await getEnv();
    await assertSucceeds(
      setDoc(
        doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), createdAt: serverTimestamp() }
      )
    );
    await assertFails(
      deleteDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)))
    );
  });
});

// ============================================================
// TEST GROUP 2 — SELF ROLE ESCALATION
// ============================================================
describe('GROUP 2 — self role escalation is blocked', () => {
  const uid = 'esc-1';

  beforeEach(async () => {
    // Give the user valid account consent so the only failure mode tested
    // here is the role/permission constraint, not the consent gate.
    await seedAccountConsent(uid);
  });

  const privilegedProfiles = [
    ['super_admin', { role: 'super_admin' }],
    ['counsellor', { role: 'counsellor' }],
    ['psychologist', { role: 'psychologist' }],
    ['educator', { role: 'educator' }],
    ['parent', { role: 'parent' }]
  ];

  test.each(privilegedProfiles)(
    'DENIES self-creating a %s profile',
    async (_label, profile) => {
      const env = await getEnv();
      const ctx = userContext(env, uid);
      await assertFails(setDoc(doc(db(ctx), 'users', uid), profile));
    }
  );

  it('DENIES self-create with an admin field', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      setDoc(doc(db(ctx), 'users', uid), { role: 'student', admin: true })
    );
  });

  it('DENIES self-create with permissions field', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      setDoc(doc(db(ctx), 'users', uid), { role: 'student', permissions: ['read_all'] })
    );
  });

  it('DENIES updating own role', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await seedStudentProfile(uid);
    await assertFails(
      updateDoc(doc(db(ctx), 'users', uid), { role: 'super_admin' })
    );
  });

  it('DENIES adding an admin field via update', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await seedStudentProfile(uid);
    await assertFails(
      updateDoc(doc(db(ctx), 'users', uid), { admin: true })
    );
  });

  it('DENIES adding permissions via update', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await seedStudentProfile(uid);
    await assertFails(
      updateDoc(doc(db(ctx), 'users', uid), { permissions: ['manage_users'] })
    );
  });

  it('ALLOWS updating a non-privileged own profile field', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await seedStudentProfile(uid);
    await assertSucceeds(
      updateDoc(doc(db(ctx), 'users', uid), { displayName: 'New Name' })
    );
  });
});

// ============================================================
// TEST GROUP 3 — CROSS-USER ACCESS
// ============================================================
describe('GROUP 3 — cross-user profile access', () => {
  const a = 'studentA';
  const b = 'studentB';

  beforeEach(async () => {
    await seedAccountConsent(a);
    await seedAccountConsent(b);
    await seedStudentProfile(a);
    await seedStudentProfile(b);
  });

  it('ALLOWS studentA to read own profile', async () => {
    const env = await getEnv();
    const ctx = userContext(env, a);
    await assertSucceeds(getDoc(doc(db(ctx), 'users', a)));
  });

  it('DENIES studentA reading studentB profile', async () => {
    const env = await getEnv();
    const ctx = userContext(env, a);
    await assertFails(getDoc(doc(db(ctx), 'users', b)));
  });

  it('DENIES studentB reading studentA profile', async () => {
    const env = await getEnv();
    const ctx = userContext(env, b);
    await assertFails(getDoc(doc(db(ctx), 'users', a)));
  });
});

// ============================================================
// TEST GROUP 4 — PROTECTED SPECIALIST DOMAINS
// ============================================================
describe('GROUP 4 — protected specialist domains', () => {
  const domains = ['counselling', 'sen', 'career', 'safeguarding', 'auditEvents'];

  test.each(domains)(
    'DENIES authenticated read on %s',
    async (domain) => {
      const env = await getEnv();
      const ctx = userContext(env, 'any-user');
      await assertFails(getDoc(doc(db(ctx), domain, 'anyDoc')));
    }
  );

  test.each(domains)(
    'DENIES authenticated write on %s',
    async (domain) => {
      const env = await getEnv();
      const ctx = userContext(env, 'any-user');
      await assertFails(setDoc(doc(db(ctx), domain, 'anyDoc'), { x: 1 }));
    }
  );

  test.each(domains)(
    'DENIES unauthenticated read on %s',
    async (domain) => {
      const env = await getEnv();
      const ctx = anonContext(env);
      await assertFails(getDoc(doc(db(ctx), domain, 'anyDoc')));
    }
  );

  test.each(domains)(
    'DENIES unauthenticated write on %s',
    async (domain) => {
      const env = await getEnv();
      const ctx = anonContext(env);
      await assertFails(setDoc(doc(db(ctx), domain, 'anyDoc'), { x: 1 }));
    }
  );
});

// ============================================================
// TEST GROUP 5 — CONSENT IMMUTABILITY
// ============================================================
describe('GROUP 5 — consent immutability', () => {
  const uid = 'consent-user';

  beforeEach(async () => {
    await seedAccountConsent(uid);
  });

  it('DENIES updating a consent event policy version', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      updateDoc(doc(db(ctx), 'consentEvents', accountConsentId(uid)), {
        policyVersion: '2.0.0'
      })
    );
  });

  it('DENIES updating a consent event action', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      updateDoc(doc(db(ctx), 'consentEvents', accountConsentId(uid)), {
        action: 'withdrawn'
      })
    );
  });

  it('DENIES updating a consent event userId', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      updateDoc(doc(db(ctx), 'consentEvents', accountConsentId(uid)), {
        userId: 'other-uid'
      })
    );
  });

  it('DENIES updating a consent event type', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      updateDoc(doc(db(ctx), 'consentEvents', accountConsentId(uid)), {
        type: CONSENT_TYPES.COUNSELLING
      })
    );
  });

  it('DENIES deleting a consent event', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertFails(
      deleteDoc(doc(db(ctx), 'consentEvents', accountConsentId(uid)))
    );
  });

  it('DENIES a user creating an account consent event for another UID', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    // eventId would be account_otherUid, but creator is uid -> userId mismatch
    // and id mismatch both apply.
    await assertFails(
      setDoc(
        doc(db(ctx), 'consentEvents', accountConsentId('other-uid')),
        { ...validAccountConsent('other-uid'), createdAt: serverTimestamp() }
      )
    );
  });

  it('ALLOWS the owning user to read their own consent event', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await assertSucceeds(
      getDoc(doc(db(ctx), 'consentEvents', accountConsentId(uid)))
    );
  });
});

// ============================================================
// TEST GROUP 6 — DEFAULT DENY
// ============================================================
describe('GROUP 6 — default deny', () => {
  it('DENIES authenticated read on an unknown collection', async () => {
    const env = await getEnv();
    const ctx = userContext(env, 'any-user');
    await assertFails(getDoc(doc(db(ctx), 'unknownCollection', 'testDocument')));
  });

  it('DENIES authenticated write on an unknown collection', async () => {
    const env = await getEnv();
    const ctx = userContext(env, 'any-user');
    await assertFails(setDoc(doc(db(ctx), 'unknownCollection', 'testDocument'), { x: 1 }));
  });

  it('DENIES unauthenticated read on an unknown collection', async () => {
    const env = await getEnv();
    const ctx = anonContext(env);
    await assertFails(getDoc(doc(db(ctx), 'unknownCollection', 'testDocument')));
  });

  it('DENIES unauthenticated write on an unknown collection', async () => {
    const env = await getEnv();
    const ctx = anonContext(env);
    await assertFails(setDoc(doc(db(ctx), 'unknownCollection', 'testDocument'), { x: 1 }));
  });
});

// ============================================================
// TEST GROUP 7 — EXISTING AUTHORIZED BEHAVIOUR
// ============================================================
describe('GROUP 7 — currently supported legitimate access', () => {
  const uid = 'legit-student';

  it('ALLOWS an authenticated user to read their own users/{uid} profile', async () => {
    const env = await getEnv();
    await seedStudentProfile(uid);
    const ctx = userContext(env, uid);
    await assertSucceeds(getDoc(doc(db(ctx), 'users', uid)));
  });

  it('ALLOWS a student to create their own profile after consent', async () => {
    const env = await getEnv();
    const ctx = userContext(env, uid);
    await seedAccountConsent(uid);
    await assertSucceeds(
      setDoc(doc(db(ctx), 'users', uid), validStudentProfile())
    );
  });

  it('ALLOWS the founder admin to read any user profile', async () => {
    const env = await getEnv();
    await seedStudentProfile(uid);
    const ctx = founderContext(env, 'founder-uid');
    await assertSucceeds(getDoc(doc(db(ctx), 'users', uid)));
  });

  it('ALLOWS the founder admin to create (provision) a user profile', async () => {
    const env = await getEnv();
    const ctx = founderContext(env, 'founder-uid');
    // Admin provision path does not require consent or student-only role.
    await assertSucceeds(
      setDoc(doc(db(ctx), 'users', uid), { role: 'educator', displayName: 'Provisioned' })
    );
  });

  it('DENIES an unauthenticated user reading any profile', async () => {
    const env = await getEnv();
    await seedStudentProfile(uid);
    const ctx = anonContext(env);
    await assertFails(getDoc(doc(db(ctx), 'users', uid)));
  });

  it('ALLOWS staff (claims) read of an assigned student record (legacy students)', async () => {
    const env = await getEnv();
    // Seed a legacy student record assigned to a counsellor via claims role.
    const studentId = 'legacy-student';
    const counsellorUid = 'counsellor-1';
    await env.withSecurityRulesDisabled(async (adminCtx) => {
      await setDoc(doc(db(adminCtx), 'students', studentId), {
        assignedStaff: { careerId: counsellorUid, psychId: null, senId: null }
      });
    });
    const ctx = userContext(env, counsellorUid, { role: 'counsellor' });
    await assertSucceeds(getDoc(doc(db(ctx), 'students', studentId)));
  });

  it('DENIES staff read of a student record not assigned to them (legacy students)', async () => {
    const env = await getEnv();
    const studentId = 'legacy-student-2';
    await env.withSecurityRulesDisabled(async (adminCtx) => {
      await setDoc(doc(db(adminCtx), 'students', studentId), {
        assignedStaff: { careerId: 'other-counsellor', psychId: null, senId: null }
      });
    });
    const ctx = userContext(env, 'counsellor-1', { role: 'counsellor' });
    await assertFails(getDoc(doc(db(ctx), 'students', studentId)));
  });
});

// ============================================================
// TEST GROUP 8 — ACCOUNT CONSENT CONTENT VALIDATION (regression)
// ============================================================
//
// These tests prove the account-consent gate validates the consent RECORD
// CONTENTS, not merely the existence of a document at the deterministic path.
// A malformed or wrong-typed document at consentEvents/account_{uid} must NOT
// satisfy the profile-creation boundary. Consent records are seeded bypassing
// the rules to isolate the gate (hasAccountConsent) under test.
describe('GROUP 8 — account consent content validation', () => {
  const uid = 'content-user';

  // Helper: attempt to create users/{uid} as the authenticated user uid.
  async function attemptProfileCreate(env, u) {
    return assertFails(
      setDoc(doc(fdb(env, u), 'users', u), validStudentProfile())
    );
  }

  it('1. ALLOWS profile creation when a correct account consent exists', async () => {
    const env = await getEnv();
    await seedAccountConsent(uid);
    await assertSucceeds(
      setDoc(doc(fdb(env, uid), 'users', uid), validStudentProfile())
    );
  });

  it('2. DENIES profile creation when the consent type is wrong (counselling)', async () => {
    const env = await getEnv();
    // A counselling-type event squatting at account_{uid} must not count.
    await seedConsentDoc(uid, { type: CONSENT_TYPES.COUNSELLING });
    await attemptProfileCreate(env, uid);
  });

  it('3. DENIES profile creation when the consent userId is wrong', async () => {
    const env = await getEnv();
    // Document path is account_UID_A but userId belongs to UID_B.
    await seedRawConsentDoc(accountConsentId(uid), {
      ...validAccountConsent('someone-else'),
      createdAt: STATIC_TIMESTAMP
    });
    await attemptProfileCreate(env, uid);
  });

  it('4. DENIES profile creation when the consent policy version is wrong', async () => {
    const env = await getEnv();
    await seedConsentDoc(uid, { policyVersion: '0.0.0' });
    await attemptProfileCreate(env, uid);
  });

  it('5. DENIES profile creation when consent is withdrawn', async () => {
    const env = await getEnv();
    await seedConsentDoc(uid, { action: 'withdrawn' });
    await attemptProfileCreate(env, uid);
  });

  it('6. DENIES profile creation when the consent record is missing a required field', async () => {
    const env = await getEnv();
    // Missing actorType: value-checked fields pass, but hasAll (valid record)
    // structural check fails, exercising the "valid consent record" boundary.
    const { actorType, ...missingField } = validAccountConsent(uid);
    await seedRawConsentDoc(accountConsentId(uid), {
      ...missingField,
      createdAt: STATIC_TIMESTAMP
    });
    await attemptProfileCreate(env, uid);
  });

  it('7. DENIES profile creation using a different deterministic consent id', async () => {
    const env = await getEnv();
    // A valid consent exists at account_UID, but the attacker targets UID_2.
    await seedAccountConsent(uid);
    const other = 'content-user-2';
    await assertFails(
      setDoc(doc(fdb(env, other), 'users', other), validStudentProfile())
    );
  });

  it('8. DENIES a user creating a valid account consent event for another user', async () => {
    const env = await getEnv();
    const a = 'cross-a';
    const b = 'cross-b';
    // User A attempts to write account_B as account_privacy consent.
    await assertFails(
      setDoc(
        doc(fdb(env, a), 'consentEvents', accountConsentId(b)),
        { ...validAccountConsent(b), createdAt: serverTimestamp() }
      )
    );
    // And B still cannot create a profile (no consent for B).
    await assertFails(
      setDoc(doc(fdb(env, b), 'users', b), validStudentProfile())
    );
  });

  it('9. DENIES update and delete of a valid account consent event', async () => {
    const env = await getEnv();
    await seedAccountConsent(uid);
    await assertFails(
      updateDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)), {
        action: 'withdrawn'
      })
    );
    await assertFails(
      deleteDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)))
    );
  });

  it('also DENIES when consent type is a different valid (non-account) type', async () => {
    const env = await getEnv();
    await seedConsentDoc(uid, { type: CONSENT_TYPES.SEN });
    await attemptProfileCreate(env, uid);
  });

  it('also DENIES when consent action is "updated" (not granted)', async () => {
    const env = await getEnv();
    await seedConsentDoc(uid, { action: 'updated' });
    await attemptProfileCreate(env, uid);
  });
});

// ============================================================
// TEST GROUP 9 — CLAIM-BASED PRIVILEGED AUTHORIZATION (Phase 1D)
// ============================================================
//
// Custom claims (request.auth.token.role) are the PRIMARY runtime authority
// for privileged access. These tests prove a super_admin CLAIM grants admin
// access WITHOUT relying on the client-writable users/{uid}.role field, and
// that the legacy profile-role fallback remains a migration-only path. They do
// NOT test the server endpoint (which needs the Auth emulator + Admin SDK); the
// endpoint's authorization logic is covered by the pure unit tests in
// test/server/roleAssignment.test.cjs.
describe('GROUP 9 — claim-based privileged authorization', () => {
  const target = 'provision-target';

  it('ALLOWS a super_admin CLAIM holder to read any user profile (no profile.role needed)', async () => {
    const env = await getEnv();
    await seedStudentProfile(target);
    // No users/{adminUid}.role document exists for the admin; claim alone.
    const ctx = userContext(env, 'admin-by-claim', { role: 'super_admin' });
    await assertSucceeds(getDoc(doc(db(ctx), 'users', target)));
  });

  it('ALLOWS a super_admin CLAIM holder to create (provision) a user profile', async () => {
    const env = await getEnv();
    const ctx = userContext(env, 'admin-by-claim', { role: 'super_admin' });
    await assertSucceeds(
      setDoc(doc(db(ctx), 'users', target), { role: 'educator', displayName: 'Provisioned' })
    );
  });

  it('ALLOWS a super_admin CLAIM holder to delete a user profile', async () => {
    const env = await getEnv();
    await seedStudentProfile(target);
    const ctx = userContext(env, 'admin-by-claim', { role: 'super_admin' });
    await assertSucceeds(deleteDoc(doc(db(ctx), 'users', target)));
  });

  it('ALLOWS a staff CLAIM holder (counsellor) to read an assigned legacy student record', async () => {
    const env = await getEnv();
    const staffUid = 'counsellor-by-claim';
    await env.withSecurityRulesDisabled(async (adminCtx) => {
      await setDoc(doc(db(adminCtx), 'students', target), {
        assignedStaff: { careerId: staffUid, psychId: null, senId: null }
      });
    });
    const ctx = userContext(env, staffUid, { role: 'counsellor' });
    await assertSucceeds(getDoc(doc(db(ctx), 'students', target)));
  });

  it('MIGRATION-ONLY: a legacy profile.role super_admin (no claim) still grants admin read until fallback removed', async () => {
    // Documents the CURRENT migration-only behaviour: a user with no claim but
    // a legacy users.role == 'super_admin' is still treated as admin by the
    // migration-only fallback. This is EXPECTED today; removing the fallback is
    // a follow-up migration step once all privileged users have claims
    // provisioned. See SECURITY_FOUNDATION.md.
    const env = await getEnv();
    await env.withSecurityRulesDisabled(async (adminCtx) => {
      await setDoc(doc(db(adminCtx), 'users', target), { role: 'super_admin', displayName: 'Legacy' });
    });
    const ctx = userContext(env, target); // no claim
    await assertSucceeds(getDoc(doc(db(ctx), 'users', target)));
  });

  it('DENIES a student CLAIM holder from writing to admin-only resources (students write)', async () => {
    const env = await getEnv();
    const ctx = userContext(env, 'plain-student'); // no claim
    await assertFails(
      setDoc(doc(db(ctx), 'students', 'someone'), { assignedStaff: { careerId: 'x', psychId: null, senId: null } })
    );
  });

  it('DENIES a counsellor CLAIM holder from writing to admin-only resources (students write)', async () => {
    const env = await getEnv();
    const ctx = userContext(env, 'counsellor-claim', { role: 'counsellor' });
    await assertFails(
      setDoc(doc(db(ctx), 'students', 'someone'), { assignedStaff: { careerId: ctx?.uid || 'counsellor-claim', psychId: null, senId: null } })
    );
  });

  it('DENIES a self-assigned super_admin profile value from granting admin when no claim and no legacy doc', async () => {
    // A plain user attempts to create their OWN profile with role super_admin.
    // The create rule forces role=='student', so this is denied (self-escalation
    // blocked at the source; the legacy fallback can never see a self-set
    // privileged role because it cannot be created).
    const env = await getEnv();
    await seedAccountConsent(target);
    const ctx = userContext(env, target); // no claim
    await assertFails(
      setDoc(doc(db(ctx), 'users', target), { role: 'super_admin', displayName: 'Self-promoted' })
    );
  });
});

// ============================================================
// TEST GROUP 10 — CONSENT NAMESPACE RESERVATION (defense-in-depth)
// ============================================================
//
// The deterministic `account_{uid}` document id is RESERVED for account_privacy
// consent. A non-account consent type must NOT be allowed to occupy it. The
// content-validating hasAccountConsent() gate already rejects such records;
// these tests prove the create rule also rejects them at write time.
describe('GROUP 10 — consent namespace reservation (defense-in-depth)', () => {
  const uid = 'namespace-user';

  it('DENIES creating a non-account consent at the account_{uid} id (counselling)', async () => {
    const env = await getEnv();
    await assertFails(
      setDoc(
        doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), type: CONSENT_TYPES.COUNSELLING, createdAt: serverTimestamp() }
      )
    );
  });

  it('DENIES creating a non-account consent at the account_{uid} id (sen)', async () => {
    const env = await getEnv();
    await assertFails(
      setDoc(
        doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), type: CONSENT_TYPES.SEN, createdAt: serverTimestamp() }
      )
    );
  });

  it('ALLOWS creating an account_privacy consent at the account_{uid} id', async () => {
    const env = await getEnv();
    await assertSucceeds(
      setDoc(
        doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)),
        { ...validAccountConsent(uid), createdAt: serverTimestamp() }
      )
    );
  });

  it('ALLOWS creating a non-account consent at a non-account id (does not squat the namespace)', async () => {
    const env = await getEnv();
    await assertSucceeds(
      setDoc(
        doc(fdb(env, uid), 'consentEvents', 'counselling_' + uid),
        { ...validAccountConsent(uid), type: CONSENT_TYPES.COUNSELLING, createdAt: serverTimestamp() }
      )
    );
  });
});


