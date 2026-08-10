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

// Create a user's own account-consent event, bypassing rules, so that
// hasAccountConsent(uid) is true for subsequent tests. Used to seed the
// positive-path state without relying on the rule under test.
async function seedAccountConsent(uid) {
  const env = await getEnv();
  await env.withSecurityRulesDisabled(async (ctx) => {
    await ctx
      .firestore()
      .doc(`consentEvents/${accountConsentId(uid)}`)
      .set(validAccountConsent(uid));
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
  accountConsentId,
  getEnv,
  clearDb,
  teardownEnv,
  userContext,
  anonContext,
  founderContext,
  validAccountConsent,
  validStudentProfile,
  seedAccountConsent,
  seedStudentProfile,
  assertSucceeds,
  assertFails
};
