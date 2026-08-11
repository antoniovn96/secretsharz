// Shared helpers for Firestore security-rule tests.
//
// These tests run ONLY against the Firestore Emulator (started by
// `firebase emulators:exec` in npm run test:rules). They never connect to a
// production Firebase project and use no production credentials.
//
// The consent schema below mirrors the executable rule in firestore.rules and
// the application model in src/security/consentPolicy.js. The rule is the
// source of truth for the test expectations.
const fs = require('fs');
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} = require('@firebase/rules-unit-testing');

const PROJECT_ID = 'secretsharz-emulator-test';

// A concrete timestamp used when seeding consent records that bypass the
// rules. hasAccountConsent only checks createdAt is PRESENT (hasAll), not its
// value, so a fixed Date is sufficient and avoids serverTimestamp quirks.
const STATIC_TIMESTAMP = new Date('2025-01-01T00:00:00Z');

// Consent policy version — single source of truth mirrored from
// src/security/consentPolicy.js (CONSENT_POLICY_VERSION).
const POLICY_VERSION = '1.0.0';

const CONSENT_TYPES = {
  ACCOUNT: 'account_privacy',
  COUNSELLING: 'counselling',
  SEN: 'sen',
  CAREER: 'career_guidance',
  COMMUNITY: 'community',
  AI_FEATURE: 'ai_feature'
};

// Deterministic account-consent document id: account_{uid}.
const accountConsentId = (uid) => `account_${uid}`;

let _env = null;

async function getEnv() {
  if (_env) return _env;
  _env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: fs.readFileSync('firestore.rules', 'utf8') }
  });
  return _env;
}

// Clean all emulator data between tests so the suite is deterministic.
async function clearDb() {
  const env = await getEnv();
  await env.clearFirestore();
}

async function teardownEnv() {
  if (_env) {
    await _env.cleanup();
    _env = null;
  }
}

// Authenticated context. `claims` are placed on request.auth.token so the
// claims-aware rule helpers (hasClaimRole, isFounderAdmin) can be exercised.
function userContext(env, uid, claims = {}) {
  return env.authenticatedContext(uid, claims);
}

function anonContext(env) {
  return env.unauthenticatedContext();
}

// Founder bootstrap admin: verified email matching the rule constant.
function founderContext(env, uid = 'founder-uid') {
  return env.authenticatedContext(uid, {
    email: 'antonio.antonio.noronha@gmail.com',
    email_verified: true
  });
}

// Build a valid account-privacy consent event body that satisfies
// validConsentEventCreate() in firestore.rules. The rule requires createdAt to
// equal request.time, which setDoc(..., { createdAt: 'serverTimestamp' })
// satisfies via the emulator. Callers must NOT pass createdAt manually here.
function validAccountConsent(uid) {
  return {
    userId: uid,
    type: CONSENT_TYPES.ACCOUNT,
    action: 'granted',
    actorType: 'self',
    relationshipId: null,
    serviceContext: 'account_creation',
    policyVersion: POLICY_VERSION
  };
}

// Build a minimal valid student profile that satisfies the users/{uid} create
// rule (role == 'student' and no admin/permissions keys).
function validStudentProfile() {
  return { role: 'student', displayName: 'Test Student' };
}

// Seed (bypassing rules) a consent document with a concrete createdAt so the
// hasAccountConsent content checks (which require createdAt present) pass for
// a valid record. `overrides` mutate the base valid consent; `docIdOverride`
// lets regression tests place a record at a different deterministic id.
async function seedConsentDoc(uid, overrides = {}, docIdOverride = null) {
  const env = await getEnv();
  const base = { ...validAccountConsent(uid), createdAt: STATIC_TIMESTAMP, ...overrides };
  // If an override explicitly drops createdAt via `createdAt: undefined`, the
  // spread still leaves the key absent only if removed; handle missing fields
  // by rebuilding from the override object directly when requested.
  const docId = docIdOverride || accountConsentId(uid);
  await env.withSecurityRulesDisabled(async (ctx) => {
    await ctx.firestore().doc(`consentEvents/${docId}`).set(base);
  });
}

// Create a user's own valid account-consent event, bypassing rules, so that
// hasAccountConsent(uid) is true for subsequent tests. Used to seed the
// positive-path state without relying on the rule under test.
async function seedAccountConsent(uid) {
  await seedConsentDoc(uid);
}

// Seed (bypassing rules) an EXACT consent document body, used to construct
// malformed/missing-field records for negative regression tests. Firestore
// omits `undefined` fields, so callers control the exact key set here.
async function seedRawConsentDoc(docId, data) {
  const env = await getEnv();
  await env.withSecurityRulesDisabled(async (ctx) => {
    await ctx.firestore().doc(`consentEvents/${docId}`).set(data);
  });
}

// Create (seed) a full student profile bypassing rules, for read tests.
async function seedStudentProfile(uid) {
  const env = await getEnv();
  await env.withSecurityRulesDisabled(async (ctx) => {
    await ctx.firestore().doc(`users/${uid}`).set(validStudentProfile());
  });
}

module.exports = {
  PROJECT_ID,
  POLICY_VERSION,
  CONSENT_TYPES,
  STATIC_TIMESTAMP,
  accountConsentId,
  getEnv,
  clearDb,
  teardownEnv,
  userContext,
  anonContext,
  founderContext,
  validAccountConsent,
  validStudentProfile,
  seedConsentDoc,
  seedRawConsentDoc,
  seedAccountConsent,
  seedStudentProfile,
  assertSucceeds,
  assertFails
};
