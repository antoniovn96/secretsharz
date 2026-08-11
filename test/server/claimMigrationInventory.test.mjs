// Secret Sharz — Phase 1D.2 claim-migration inventory classification tests.
//
// These are PURE unit tests for the read-only classification layer
// (src/security/claimMigrationInventory.js). No Firebase, no emulators, no I/O.
// Stubs represent profile + Auth-user snapshots as the dry-run script would
// read them. The server security path (endpoint + rules) is covered separately
// by the real (un-mocked) emulator integration tests, which are NOT replaced.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  classifyProfile,
  buildReport,
  CATEGORY,
  isMigrationCandidate,
  FOUNDER_EMAIL,
  CLAIM_ROLE_KEY,
  ASSIGNABLE_CLAIM_ROLES
} from '../../src/security/claimMigrationInventory.js';

const AUTH = (uid, email, { emailVerified = true, claimRole = null, extraClaims = {} } = {}) => ({
  uid,
  email,
  emailVerified,
  customClaims: claimRole ? { [CLAIM_ROLE_KEY]: claimRole, ...extraClaims } : (Object.keys(extraClaims).length ? { ...extraClaims } : null)
});

const PROF = (id, role, email = null) => ({ id, role, email });

// ---- Category basics -------------------------------------------------------

test('1. founder (by Firestore profile email) is always FOUNDER_PROTECTED and excluded', () => {
  const p = PROF('founder-uid', 'super_admin', FOUNDER_EMAIL);
  const a = AUTH('founder-uid', FOUNDER_EMAIL, { claimRole: 'super_admin' });
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.FOUNDER_PROTECTED);
  assert.equal(c.founderProtected, true);
  assert.equal(isMigrationCandidate(c.category), false);
});

test('2. founder (by Auth email, even if Firestore profile email differs) is FOUNDER_PROTECTED', () => {
  const p = PROF('some-doc', 'counsellor', 'someone-else@example.com');
  const a = AUTH('some-doc', FOUNDER_EMAIL, { claimRole: 'counsellor' });
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.FOUNDER_PROTECTED);
  assert.equal(c.founderProtected, true);
});

test('3. already-claimed user (claim matches Firestore role) is ALREADY_MIGRATED, not a candidate', () => {
  const p = PROF('u-cou', 'counsellor', 'c@example.com');
  const a = AUTH('u-cou', 'c@example.com', { claimRole: 'counsellor' });
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.ALREADY_MIGRATED);
  assert.equal(c.proposedClaimRole, 'counsellor');
  assert.equal(c.currentClaimRole, 'counsellor');
  assert.equal(isMigrationCandidate(c.category), false);
});

test('4. safe user (uid-linked Auth, valid privileged role, no claim) is SAFE_TO_MIGRATE', () => {
  const p = PROF('u-edu', 'educator', 'e@example.com');
  const a = AUTH('u-edu', 'e@example.com'); // no claim
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.SAFE_TO_MIGRATE);
  assert.equal(c.proposedClaimRole, 'educator');
  assert.equal(c.currentClaimRole, null);
  assert.equal(isMigrationCandidate(c.category), true);
});

test('5. missing Auth account (no user with uid === doc id) is MISSING_AUTH_ACCOUNT', () => {
  const p = PROF('orphan-doc-id', 'counsellor', 'c@example.com');
  const c = classifyProfile({ profile: p, authUser: null });
  assert.equal(c.category, CATEGORY.MISSING_AUTH_ACCOUNT);
  assert.equal(isMigrationCandidate(c.category), false);
});

test('6. role conflict (Firestore role != existing claim) is ROLE_CONFLICT, never SAFE_TO_MIGRATE', () => {
  const p = PROF('u-conf', 'psychologist', 'p@example.com');
  const a = AUTH('u-conf', 'p@example.com', { claimRole: 'counsellor' }); // different
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.ROLE_CONFLICT);
  assert.equal(isMigrationCandidate(c.category), false);
  assert.match(c.reason, /disagree/i);
});

test('7. unknown role (not in supported vocabulary) is INVALID_OR_UNKNOWN_ROLE', () => {
  const p = PROF('u-x', 'wizard', 'x@example.com');
  const a = AUTH('u-x', 'x@example.com');
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.INVALID_OR_UNKNOWN_ROLE);
  assert.equal(isMigrationCandidate(c.category), false);
});

test('8. unlinked profile (email matches an Auth user but uid differs) is MISSING_UID_OR_UNLINKED_PROFILE', () => {
  // Firestore doc id does NOT equal any Auth uid, but email matches an Auth user.
  const p = PROF('firestore-auto-id', 'parent', 'shared@example.com');
  const byEmail = AUTH('auth-uid-different', 'shared@example.com');
  const c = classifyProfile({ profile: p, authUser: null, authUserByEmail: byEmail });
  assert.equal(c.category, CATEGORY.MISSING_UID_OR_UNLINKED_PROFILE);
  assert.equal(isMigrationCandidate(c.category), false);
  assert.match(c.reason, /email/i);
});

test('9. student / non-privileged role is NOT_PRIVILEGED (no claim needed) and not a candidate', () => {
  const p = PROF('u-stu', 'student', 's@example.com');
  const a = AUTH('u-stu', 's@example.com');
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.NOT_PRIVILEGED);
  assert.equal(c.proposedClaimRole, null);
  assert.equal(isMigrationCandidate(c.category), false);
});

test('10. profile with no role field is NOT_PRIVILEGED (default = student)', () => {
  const p = { id: 'u-norole', email: 'n@example.com' }; // no role
  const a = AUTH('u-norole', 'n@example.com');
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.NOT_PRIVILEGED);
});

// ---- Migration-candidate semantics ----------------------------------------

test('11. every assignable privileged role can be a SAFE_TO_MIGRATE candidate', () => {
  for (const role of ASSIGNABLE_CLAIM_ROLES) {
    const p = PROF(`uid-${role}`, role, `${role}@example.com`);
    const a = AUTH(`uid-${role}`, `${role}@example.com`);
    const c = classifyProfile({ profile: p, authUser: a });
    assert.equal(c.category, CATEGORY.SAFE_TO_MIGRATE, `role ${role} should be safe`);
    assert.equal(c.proposedClaimRole, role);
  }
});

test('12. unrelated existing custom claims are reflected (preserved by the eventual migration, not stripped)', () => {
  const p = PROF('u-keep', 'counsellor', 'k@example.com');
  const a = AUTH('u-keep', 'k@example.com', { claimRole: null, extraClaims: { someOtherClaim: 'preserve-me' } });
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.SAFE_TO_MIGRATE);
  assert.deepEqual(c.currentClaims, { someOtherClaim: 'preserve-me' });
});

test('13. super_admin non-founder user with matching claim is ALREADY_MIGRATED (founder check precedes only when email matches)', () => {
  const p = PROF('u-admin', 'super_admin', 'admin@example.com');
  const a = AUTH('u-admin', 'admin@example.com', { claimRole: 'super_admin' });
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.ALREADY_MIGRATED);
  assert.equal(c.founderProtected, false);
});

test('14. super_admin non-founder user with NO claim is SAFE_TO_MIGRATE (not auto-protected)', () => {
  const p = PROF('u-admin2', 'super_admin', 'admin2@example.com');
  const a = AUTH('u-admin2', 'admin2@example.com');
  const c = classifyProfile({ profile: p, authUser: a });
  assert.equal(c.category, CATEGORY.SAFE_TO_MIGRATE);
  assert.equal(c.founderProtected, false);
});

// ---- Report shape ----------------------------------------------------------

test('15. buildReport always sets dryRun=true and mutationsPerformed=false', () => {
  const r = buildReport({ generatedAt: 't', classifications: [] });
  assert.equal(r.dryRun, true);
  assert.equal(r.mutationsPerformed, false);
});

test('16. buildReport summary counts each category correctly', () => {
  const classifications = [
    classifyProfile({ profile: PROF('founder', 'super_admin', FOUNDER_EMAIL), authUser: AUTH('founder', FOUNDER_EMAIL, { claimRole: 'super_admin' }) }),
    classifyProfile({ profile: PROF('safe', 'counsellor', 's@example.com'), authUser: AUTH('safe', 's@example.com') }),
    classifyProfile({ profile: PROF('done', 'counsellor', 'd@example.com'), authUser: AUTH('done', 'd@example.com', { claimRole: 'counsellor' }) }),
    classifyProfile({ profile: PROF('miss', 'counsellor', 'm@example.com'), authUser: null }),
    classifyProfile({ profile: PROF('conf', 'psychologist', 'c2@example.com'), authUser: AUTH('conf', 'c2@example.com', { claimRole: 'parent' }) }),
    classifyProfile({ profile: PROF('bad', 'wizard', 'b@example.com'), authUser: AUTH('bad', 'b@example.com') }),
    classifyProfile({ profile: PROF('unlinked', 'parent', 'u@example.com'), authUser: null, authUserByEmail: AUTH('other', 'u@example.com') }),
    classifyProfile({ profile: PROF('stu', 'student', 'st@example.com'), authUser: AUTH('stu', 'st@example.com') })
  ];
  const r = buildReport({ generatedAt: 't', classifications });
  const s = r.summary;
  assert.equal(s.totalProfilesExamined, 8);
  assert.equal(s.safeToMigrate, 1);
  assert.equal(s.alreadyMigrated, 1);
  assert.equal(s.missingAuthAccount, 1);
  assert.equal(s.roleConflicts, 1);
  assert.equal(s.invalidRoles, 1);
  assert.equal(s.missingUid, 1);
  assert.equal(s.reviewRequired, 0);
  assert.equal(r.founderProtected, true);
  assert.equal(r.users.length, 8);
});

test('17. buildReport founderProtected=false when no founder present', () => {
  const classifications = [
    classifyProfile({ profile: PROF('safe', 'counsellor', 's@example.com'), authUser: AUTH('safe', 's@example.com') })
  ];
  const r = buildReport({ generatedAt: 't', classifications });
  assert.equal(r.founderProtected, false);
});

// ---- Mutation guard (static source check) ---------------------------------

test('18. the classification module performs NO mutation methods (static source guard)', () => {
  const src = fs.readFileSync(new URL('../../src/security/claimMigrationInventory.js', import.meta.url), 'utf8');
  for (const m of ['setCustomUserClaims', 'revokeRefreshTokens', 'updateUser', 'createUser', 'deleteUser', 'importUsers']) {
    assert.equal(src.includes(m), false, `classification module must not reference ${m}`);
  }
  assert.equal(/from\s+['"]firebase-admin/.test(src), false, 'must not import firebase-admin');
  assert.equal(/from\s+['"]firebase\/(firestore|app|auth)['"]/.test(src), false, 'must not import client SDK');
});
