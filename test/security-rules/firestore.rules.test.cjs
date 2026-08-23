// Secret Sharz — Phase 1 Firestore security-rule tests.
//
// These tests prove the security boundaries defined by firestore.rules against
// the Firestore Emulator. They do NOT connect to production and use no
// production credentials.
//
// Source of truth for every expectation here is firestore.rules on this branch
// together with the consent schema in src/security/consentPolicy.js.
//
// IMPORTANT: Passing tests do not constitute production security approval.
const {
  getEnv, clearDb, teardownEnv, userContext, anonContext, founderContext,
  validAccountConsent, validStudentProfile, seedAccountConsent, seedConsentDoc,
  seedRawConsentDoc, seedStudentProfile, accountConsentId, CONSENT_TYPES,
  POLICY_VERSION, STATIC_TIMESTAMP, assertSucceeds, assertFails
} = require('./helpers.cjs');

const { setDoc, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } = require('firebase/firestore');
function db(ctx) { return ctx.firestore(); }
function fdb(env, uid, claims = {}) { return env.authenticatedContext(uid, claims).firestore(); }
function afdb(env) { return env.unauthenticatedContext().firestore(); }

beforeEach(async () => { await clearDb(); });
afterAll(async () => { await teardownEnv(); });

describe('GROUP 1 — consent before profile', () => {
  const uid = 'student-1';
  it('DENIES self profile creation when account consent is missing', async () => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, uid)), 'users', uid), validStudentProfile())); });
  it('ALLOWS self profile creation after valid account consent exists', async () => { const env = await getEnv(); await assertSucceeds(setDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), createdAt: serverTimestamp() })); await assertSucceeds(setDoc(doc(fdb(env, uid), 'users', uid), validStudentProfile())); });
  it('DENIES profile creation when consent doc id is wrong', async () => { const env = await getEnv(); await assertFails(setDoc(doc(fdb(env, uid), 'consentEvents', 'not_the_right_id'), { ...validAccountConsent(uid), createdAt: serverTimestamp() })); await assertFails(setDoc(doc(fdb(env, uid), 'users', uid), validStudentProfile())); });
  it('DENIES consent creation with a wrong (unknown) consent type', async () => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), type: 'not_a_real_type', createdAt: serverTimestamp() })); });
  it('DENIES consent creation with a wrong action', async () => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), action: 'not_a_real_action', createdAt: serverTimestamp() })); });
  it('DENIES consent creation with a wrong actorType', async () => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), actorType: 'admin', createdAt: serverTimestamp() })); });
  it('DENIES consent creation with wrong policy version', async () => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), policyVersion: '0.0.0', createdAt: serverTimestamp() })); });
  it('DENIES consent creation with wrong userId', async () => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId('someone_else')), { ...validAccountConsent('someone_else'), createdAt: serverTimestamp() })); });
  it('DENIES consent creation when required fields are missing', async () => { const env = await getEnv(); const { actorType, ...missingActor } = validAccountConsent(uid); await assertFails(setDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)), { ...missingActor, createdAt: serverTimestamp() })); });
  it('DENIES consent creation with extra unexpected fields', async () => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), sneakyAdminFlag: true, createdAt: serverTimestamp() })); });
  it('DENIES unauthorised modification of a consent event', async () => { const env = await getEnv(); await assertSucceeds(setDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), createdAt: serverTimestamp() })); await assertFails(updateDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)), { action: 'withdrawn' })); });
  it('DENIES deletion of a consent event', async () => { const env = await getEnv(); await assertSucceeds(setDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), createdAt: serverTimestamp() })); await assertFails(deleteDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)))); });
});

describe('GROUP 2 — self role escalation is blocked', () => {
  const uid = 'esc-1';
  beforeEach(async () => { await seedAccountConsent(uid); });
  const privilegedProfiles = [['super_admin', { role: 'super_admin' }], ['counsellor', { role: 'counsellor' }], ['psychologist', { role: 'psychologist' }], ['educator', { role: 'educator' }], ['parent', { role: 'parent' }]];
  test.each(privilegedProfiles)('DENIES self-creating a %s profile', async (_label, profile) => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, uid)), 'users', uid), profile)); });
  it('DENIES self-create with an admin field', async () => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, uid)), 'users', uid), { role: 'student', admin: true })); });
  it('DENIES self-create with permissions field', async () => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, uid)), 'users', uid), { role: 'student', permissions: ['read_all'] })); });
  it('DENIES updating own role', async () => { const env = await getEnv(); await seedStudentProfile(uid); await assertFails(updateDoc(doc(db(userContext(env, uid)), 'users', uid), { role: 'super_admin' })); });
  it('DENIES adding an admin field via update', async () => { const env = await getEnv(); await seedStudentProfile(uid); await assertFails(updateDoc(doc(db(userContext(env, uid)), 'users', uid), { admin: true })); });
  it('DENIES adding permissions via update', async () => { const env = await getEnv(); await seedStudentProfile(uid); await assertFails(updateDoc(doc(db(userContext(env, uid)), 'users', uid), { permissions: ['manage_users'] })); });
  it('ALLOWS updating a non-privileged own profile field', async () => { const env = await getEnv(); await seedStudentProfile(uid); await assertSucceeds(updateDoc(doc(db(userContext(env, uid)), 'users', uid), { displayName: 'New Name' })); });
});

describe('GROUP 3 — cross-user profile access', () => {
  const a = 'studentA'; const b = 'studentB';
  beforeEach(async () => { await seedAccountConsent(a); await seedAccountConsent(b); await seedStudentProfile(a); await seedStudentProfile(b); });
  it('ALLOWS studentA to read own profile', async () => { const env = await getEnv(); await assertSucceeds(getDoc(doc(db(userContext(env, a)), 'users', a))); });
  it('DENIES studentA reading studentB profile', async () => { const env = await getEnv(); await assertFails(getDoc(doc(db(userContext(env, a)), 'users', b))); });
  it('DENIES studentB reading studentA profile', async () => { const env = await getEnv(); await assertFails(getDoc(doc(db(userContext(env, b)), 'users', a))); });
});

describe('GROUP 4 — protected specialist domains', () => {
  const domains = ['counselling', 'sen', 'career', 'safeguarding', 'auditEvents'];
  test.each(domains)('DENIES authenticated read on %s', async (domain) => { const env = await getEnv(); await assertFails(getDoc(doc(db(userContext(env, 'any-user')), domain, 'anyDoc'))); });
  test.each(domains)('DENIES authenticated write on %s', async (domain) => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, 'any-user')), domain, 'anyDoc'), { x: 1 })); });
  test.each(domains)('DENIES unauthenticated read on %s', async (domain) => { const env = await getEnv(); await assertFails(getDoc(doc(afdb(env), domain, 'anyDoc'))); });
  test.each(domains)('DENIES unauthenticated write on %s', async (domain) => { const env = await getEnv(); await assertFails(setDoc(doc(afdb(env), domain, 'anyDoc'), { x: 1 })); });
});

describe('GROUP 5 — consent immutability', () => {
  const uid = 'consent-user';
  beforeEach(async () => { await seedAccountConsent(uid); });
  it('DENIES updating a consent event policy version', async () => { const env = await getEnv(); await assertFails(updateDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)), { policyVersion: '2.0.0' })); });
  it('DENIES updating a consent event action', async () => { const env = await getEnv(); await assertFails(updateDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)), { action: 'withdrawn' })); });
  it('DENIES updating a consent event userId', async () => { const env = await getEnv(); await assertFails(updateDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)), { userId: 'other-uid' })); });
  it('DENIES updating a consent event type', async () => { const env = await getEnv(); await assertFails(updateDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)), { type: CONSENT_TYPES.COUNSELLING })); });
  it('DENIES deleting a consent event', async () => { const env = await getEnv(); await assertFails(deleteDoc(doc(db(userContext(env, uid)), 'consentEvents', accountConsentId(uid)))); });
  it('DENIES a user creating an account consent event for another UID', async () => { const env = await getEnv(); const a = 'consent-a'; const b = 'consent-b'; await assertFails(setDoc(doc(fdb(env, a), 'consentEvents', accountConsentId(b)), { ...validAccountConsent(b), createdAt: serverTimestamp() })); await assertFails(setDoc(doc(fdb(env, b), 'users', b), validStudentProfile())); });
});

describe('GROUP 6 — legacy student aggregate is server-only', () => {
  const studentId = 'legacy-student'; const counsellorUid = 'counsellor-1';
  it('DENIES an assigned counsellor claim direct read of students/{id}', async () => { const env = await getEnv(); await env.withSecurityRulesDisabled(async (adminCtx) => { await setDoc(doc(adminCtx.firestore(), 'students', studentId), { assignedStaff: { careerId: counsellorUid, psychId: null, senId: null } }); }); await assertFails(getDoc(doc(db(userContext(env, counsellorUid, { role: 'counsellor' })), 'students', studentId))); });
  it('DENIES an assigned counsellor claim direct read of an unassigned students/{id}', async () => { const env = await getEnv(); await env.withSecurityRulesDisabled(async (adminCtx) => { await setDoc(doc(adminCtx.firestore(), 'students', studentId), { assignedStaff: { careerId: 'other-counsellor', psychId: null, senId: null } }); }); await assertFails(getDoc(doc(db(userContext(env, counsellorUid, { role: 'counsellor' })), 'students', studentId))); });
  it('DENIES a normal student direct read of students/{id}', async () => { const env = await getEnv(); await env.withSecurityRulesDisabled(async (adminCtx) => { await setDoc(doc(adminCtx.firestore(), 'students', studentId), { assignedStaff: {} }); }); await assertFails(getDoc(doc(db(userContext(env, 'student-reader')), 'students', studentId))); });
});

describe('GROUP 7 — profile access', () => {
  const uid = 'profile-target';
  it('ALLOWS the founder admin to read any user profile', async () => { const env = await getEnv(); await seedStudentProfile(uid); await assertSucceeds(getDoc(doc(db(founderContext(env, 'founder-uid')), 'users', uid))); });
  it('ALLOWS the founder admin to create (provision) a user profile', async () => { const env = await getEnv(); await assertSucceeds(setDoc(doc(db(founderContext(env, 'founder-uid')), 'users', uid), { role: 'educator', displayName: 'Provisioned' })); });
  it('DENIES an unauthenticated user reading any profile', async () => { const env = await getEnv(); await seedStudentProfile(uid); await assertFails(getDoc(doc(afdb(env), 'users', uid))); });
});

describe('GROUP 8 — account consent content validation', () => {
  const uid = 'content-user';
  async function attemptProfileCreate(env, u) { return assertFails(setDoc(doc(fdb(env, u), 'users', u), validStudentProfile())); }
  it('1. ALLOWS profile creation when a correct account consent exists', async () => { const env = await getEnv(); await seedAccountConsent(uid); await assertSucceeds(setDoc(doc(fdb(env, uid), 'users', uid), validStudentProfile())); });
  it('2. DENIES profile creation when the consent type is wrong (counselling)', async () => { const env = await getEnv(); await seedConsentDoc(uid, { type: CONSENT_TYPES.COUNSELLING }); await attemptProfileCreate(env, uid); });
  it('3. DENIES profile creation when the consent userId is wrong', async () => { const env = await getEnv(); await seedRawConsentDoc(accountConsentId(uid), { ...validAccountConsent('someone-else'), createdAt: STATIC_TIMESTAMP }); await attemptProfileCreate(env, uid); });
  it('4. DENIES profile creation when the consent policy version is wrong', async () => { const env = await getEnv(); await seedConsentDoc(uid, { policyVersion: '0.0.0' }); await attemptProfileCreate(env, uid); });
  it('5. DENIES profile creation when consent is withdrawn', async () => { const env = await getEnv(); await seedConsentDoc(uid, { action: 'withdrawn' }); await attemptProfileCreate(env, uid); });
  it('6. DENIES profile creation when the consent record is missing a required field', async () => { const env = await getEnv(); const { actorType, ...missingField } = validAccountConsent(uid); await seedRawConsentDoc(accountConsentId(uid), { ...missingField, createdAt: STATIC_TIMESTAMP }); await attemptProfileCreate(env, uid); });
  it('7. DENIES profile creation using a different deterministic consent id', async () => { const env = await getEnv(); await seedAccountConsent(uid); const other = 'content-user-2'; await assertFails(setDoc(doc(fdb(env, other), 'users', other), validStudentProfile())); });
  it('8. DENIES a user creating a valid account consent event for another user', async () => { const env = await getEnv(); const a = 'cross-a'; const b = 'cross-b'; await assertFails(setDoc(doc(fdb(env, a), 'consentEvents', accountConsentId(b)), { ...validAccountConsent(b), createdAt: serverTimestamp() })); await assertFails(setDoc(doc(fdb(env, b), 'users', b), validStudentProfile())); });
  it('9. DENIES update and delete of a valid account consent event', async () => { const env = await getEnv(); await seedAccountConsent(uid); await assertFails(updateDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)), { action: 'withdrawn' })); await assertFails(deleteDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)))); });
  it('also DENIES when consent type is a different valid (non-account) type', async () => { const env = await getEnv(); await seedConsentDoc(uid, { type: CONSENT_TYPES.SEN }); await attemptProfileCreate(env, uid); });
  it('also DENIES when consent action is "updated" (not granted)', async () => { const env = await getEnv(); await seedConsentDoc(uid, { action: 'updated' }); await attemptProfileCreate(env, uid); });
});

describe('GROUP 9 — claim-based privileged authorization', () => {
  const target = 'provision-target';
  it('ALLOWS a super_admin CLAIM holder to read any user profile (no profile.role needed)', async () => { const env = await getEnv(); await seedStudentProfile(target); await assertSucceeds(getDoc(doc(db(userContext(env, 'admin-by-claim', { role: 'super_admin' })), 'users', target))); });
  it('ALLOWS a super_admin CLAIM holder to create (provision) a user profile', async () => { const env = await getEnv(); await assertSucceeds(setDoc(doc(db(userContext(env, 'admin-by-claim', { role: 'super_admin' })), 'users', target), { role: 'educator', displayName: 'Provisioned' })); });
  it('ALLOWS a super_admin CLAIM holder to delete a user profile', async () => { const env = await getEnv(); await seedStudentProfile(target); await assertSucceeds(deleteDoc(doc(db(userContext(env, 'admin-by-claim', { role: 'super_admin' })), 'users', target))); });
  it('DENIES a staff CLAIM holder direct read of an assigned legacy student record', async () => { const env = await getEnv(); const staffUid = 'counsellor-by-claim'; await env.withSecurityRulesDisabled(async (adminCtx) => { await setDoc(doc(adminCtx.firestore(), 'students', target), { assignedStaff: { careerId: staffUid, psychId: null, senId: null } }); }); await assertFails(getDoc(doc(db(userContext(env, staffUid, { role: 'counsellor' })), 'students', target))); });
  it('MIGRATION-ONLY: a legacy profile.role super_admin (no claim) still grants admin read until fallback removed', async () => { const env = await getEnv(); await env.withSecurityRulesDisabled(async (adminCtx) => { await setDoc(doc(adminCtx.firestore(), 'users', target), { role: 'super_admin', displayName: 'Legacy' }); }); await assertSucceeds(getDoc(doc(db(userContext(env, target)), 'users', target))); });
  it('DENIES a student CLAIM holder from writing to admin-only resources (students write)', async () => { const env = await getEnv(); await assertFails(setDoc(doc(db(userContext(env, 'plain-student')), 'students', 'someone'), { assignedStaff: { careerId: 'x', psychId: null, senId: null } })); });
  it('DENIES a counsellor CLAIM holder from writing to admin-only resources (students write)', async () => { const env = await getEnv(); const uid = 'counsellor-claim'; await assertFails(setDoc(doc(db(userContext(env, uid, { role: 'counsellor' })), 'students', 'someone'), { assignedStaff: { careerId: uid, psychId: null, senId: null } })); });
  it('DENIES a self-assigned super_admin profile value from granting admin when no claim and no legacy doc', async () => { const env = await getEnv(); const uid = 'self-promoted'; await seedAccountConsent(uid); await assertFails(setDoc(doc(db(userContext(env, uid)), 'users', uid), { role: 'super_admin', displayName: 'Self-promoted' })); });
});

describe('GROUP 10 — consent namespace reservation (defense-in-depth)', () => {
  const uid = 'namespace-user';
  it('DENIES creating a non-account consent at the account_{uid} id (counselling)', async () => { const env = await getEnv(); await assertFails(setDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), type: CONSENT_TYPES.COUNSELLING, createdAt: serverTimestamp() })); });
  it('DENIES creating a non-account consent at the account_{uid} id (sen)', async () => { const env = await getEnv(); await assertFails(setDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), type: CONSENT_TYPES.SEN, createdAt: serverTimestamp() })); });
  it('ALLOWS creating an account_privacy consent at the account_{uid} id', async () => { const env = await getEnv(); await assertSucceeds(setDoc(doc(fdb(env, uid), 'consentEvents', accountConsentId(uid)), { ...validAccountConsent(uid), createdAt: serverTimestamp() })); });
  it('ALLOWS creating a non-account consent at a non-account id (does not squat the namespace)', async () => { const env = await getEnv(); await assertSucceeds(setDoc(doc(fdb(env, uid), 'consentEvents', 'counselling_' + uid), { ...validAccountConsent(uid), type: CONSENT_TYPES.COUNSELLING, createdAt: serverTimestamp() })); });
});
