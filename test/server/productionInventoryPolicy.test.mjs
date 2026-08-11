// Secret Sharz — Phase 1D.2 production-inventory POLICY tests (pure, no Firebase).
//
// Verifies the production business rule: ONLY the founder is a retained
// privileged account; every other user is NON_MIGRATION (privileged others are
// flagged NON_MIGRATION_REQUIRES_FOLLOWUP, NOT migrated, NOT modified).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
  applyProductionPolicy,
  buildProductionReport,
  hasPrivilegedState,
  PROD_CATEGORY
} from '../../src/security/productionInventoryPolicy.js';
import { classifyProfile, CATEGORY, FOUNDER_EMAIL, CLAIM_ROLE_KEY } from '../../src/security/claimMigrationInventory.js';

const AUTH = (uid, email, { emailVerified = true, claimRole = null } = {}) => ({
  uid, email, emailVerified,
  customClaims: claimRole ? { [CLAIM_ROLE_KEY]: claimRole } : null
});
const PROF = (id, role, email = null) => ({ id, role, email });

// ---- Founder ---------------------------------------------------------------

test('1. founder is FOUNDER_PROTECTED regardless of claim state', () => {
  const c = classifyProfile({ profile: PROF('f-uid', 'super_admin', FOUNDER_EMAIL), authUser: AUTH('f-uid', FOUNDER_EMAIL, { claimRole: 'super_admin' }) });
  const p = applyProductionPolicy(c);
  assert.equal(p.category, PROD_CATEGORY.FOUNDER_PROTECTED);
  assert.equal(p.founderProtected, true);
  assert.equal(p.requiresFollowup, false);
});

test('2. founder with NO claim and NO firestore role is still FOUNDER_PROTECTED', () => {
  const c = classifyProfile({ profile: PROF('f-uid', null, FOUNDER_EMAIL), authUser: AUTH('f-uid', FOUNDER_EMAIL) });
  const p = applyProductionPolicy(c);
  assert.equal(p.category, PROD_CATEGORY.FOUNDER_PROTECTED);
});

// ---- Non-founder privileged users: NON_MIGRATION_REQUIRES_FOLLOWUP, never migrated ----

test('3. non-founder user with privileged Firestore role is NON_MIGRATION_REQUIRES_FOLLOWUP (not migrated)', () => {
  const c = classifyProfile({ profile: PROF('u-cou', 'counsellor', 'c@example.com'), authUser: AUTH('u-cou', 'c@example.com') });
  const p = applyProductionPolicy(c);
  assert.equal(p.category, PROD_CATEGORY.NON_MIGRATION_REQUIRES_FOLLOWUP);
  assert.equal(p.privileged, true);
  assert.equal(p.requiresFollowup, true);
});

test('4. non-founder user with a privileged custom CLAIM is NON_MIGRATION_REQUIRES_FOLLOWUP', () => {
  const c = classifyProfile({ profile: PROF('u-cl', 'student', 'cl@example.com'), authUser: AUTH('u-cl', 'cl@example.com', { claimRole: 'counsellor' }) });
  const p = applyProductionPolicy(c);
  assert.equal(p.category, PROD_CATEGORY.NON_MIGRATION_REQUIRES_FOLLOWUP);
  assert.equal(p.privileged, true);
});

test('5. non-founder already-migrated user is NON_MIGRATION_REQUIRES_FOLLOWUP (flagged, NOT assumed migrated under OPTION A)', () => {
  // Under OPTION A, only the founder is retained; a non-founder whose claim
  // already matches its role is still flagged for follow-up, not auto-accepted.
  const c = classifyProfile({ profile: PROF('u-done', 'counsellor', 'd@example.com'), authUser: AUTH('u-done', 'd@example.com', { claimRole: 'counsellor' }) });
  const p = applyProductionPolicy(c);
  assert.equal(p.category, PROD_CATEGORY.NON_MIGRATION_REQUIRES_FOLLOWUP);
  assert.equal(p.privileged, true);
});

test('6. non-founder role-conflict user is NON_MIGRATION_REQUIRES_FOLLOWUP (never auto-resolved)', () => {
  const c = classifyProfile({ profile: PROF('u-conf', 'psychologist', 'x@example.com'), authUser: AUTH('u-conf', 'x@example.com', { claimRole: 'parent' }) });
  const p = applyProductionPolicy(c);
  assert.equal(p.category, PROD_CATEGORY.NON_MIGRATION_REQUIRES_FOLLOWUP);
  assert.equal(p.conflict, true);
});

// ---- Ordinary users: NON_MIGRATION, no follow-up ----

test('7. ordinary student is NON_MIGRATION (no follow-up)', () => {
  const c = classifyProfile({ profile: PROF('u-stu', 'student', 's@example.com'), authUser: AUTH('u-stu', 's@example.com') });
  const p = applyProductionPolicy(c);
  assert.equal(p.category, PROD_CATEGORY.NON_MIGRATION);
  assert.equal(p.requiresFollowup, false);
  assert.equal(p.privileged, false);
});

test('8. ordinary student missing an Auth account is still NON_MIGRATION (no privileged state)', () => {
  const c = classifyProfile({ profile: PROF('stu-doc', 'student', 's2@example.com'), authUser: null });
  const p = applyProductionPolicy(c);
  assert.equal(p.category, PROD_CATEGORY.NON_MIGRATION);
});

// ---- hasPrivilegedState helper ----

test('9. hasPrivilegedState detects role, claim, both, and neither', () => {
  assert.equal(hasPrivilegedState({ firestoreRole: 'counsellor', currentClaimRole: null }), true);
  assert.equal(hasPrivilegedState({ firestoreRole: 'student', currentClaimRole: 'educator' }), true);
  assert.equal(hasPrivilegedState({ firestoreRole: 'student', currentClaimRole: null }), false);
  assert.equal(hasPrivilegedState({ firestoreRole: 'wizard', currentClaimRole: null }), false); // unknown role not privileged
});

// ---- Report shape ----

test('10. buildProductionReport always sets production/readOnly/mutationsPerformed flags', () => {
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: [], policies: [] });
  assert.equal(r.production, true);
  assert.equal(r.readOnly, true);
  assert.equal(r.mutationsPerformed, false);
  assert.equal(r.migrationPolicy.otherUsersMigration, 'DENIED');
  assert.equal(r.migrationPolicy.retainedPrivilegedAccount, FOUNDER_EMAIL);
});

test('11. buildProductionReport aggregates founder + privileged + ordinary correctly', () => {
  const cs = [
    classifyProfile({ profile: PROF('f', 'super_admin', FOUNDER_EMAIL), authUser: AUTH('f', FOUNDER_EMAIL, { claimRole: 'super_admin' }) }),
    classifyProfile({ profile: PROF('cou', 'counsellor', 'c@example.com'), authUser: AUTH('cou', 'c@example.com') }),
    classifyProfile({ profile: PROF('conf', 'psychologist', 'x@example.com'), authUser: AUTH('conf', 'x@example.com', { claimRole: 'parent' }) }),
    classifyProfile({ profile: PROF('stu1', 'student', 's1@example.com'), authUser: AUTH('stu1', 's1@example.com') }),
    classifyProfile({ profile: PROF('stu2', 'student', 's2@example.com'), authUser: null }),
    classifyProfile({ profile: PROF('done', 'counsellor', 'd@example.com'), authUser: AUTH('done', 'd@example.com', { claimRole: 'counsellor' }) })
  ];
  const ps = cs.map(applyProductionPolicy);
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps });
  const s = r.summary;
  assert.equal(s.authUsers, 6);
  assert.equal(s.firestoreProfiles, 6);
  assert.equal(s.founderProtected, 1);
  assert.equal(s.otherUsers, 5);
  assert.equal(s.nonMigrationRequiresFollowup, 3); // cou, conf, done
  assert.equal(s.privilegedUsersRequiringFollowup, 3);
  assert.equal(s.identityConflicts, 1); // conf
  assert.equal(s.nonMigration, 2); // stu1, stu2
  assert.equal(r.privilegedNonMigration.length, 3);
  assert.equal(r.otherUsers.length, 3); // only follow-up users get detail
  assert.ok(r.founder && r.founder.category === PROD_CATEGORY.FOUNDER_PROTECTED);
});

test('12. ordinary (non-followup) users get NO personal detail in the report (aggregate only)', () => {
  const cs = [
    classifyProfile({ profile: PROF('stu', 'student', 'private-student@example.com'), authUser: AUTH('stu', 'private-student@example.com') })
  ];
  const ps = cs.map(applyProductionPolicy);
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps });
  assert.equal(r.otherUsers.length, 0); // student is aggregate only
  assert.equal(r.summary.nonMigration, 1);
  // The student's email must not appear in the detailed sections.
  assert.equal(JSON.stringify(r).includes('private-student@example.com'), false);
});

// ---- Mutation guard (static source check) ----

test('13. the policy module performs NO mutation methods and imports no Firebase SDK (static guard)', () => {
  const src = fs.readFileSync(new URL('../../src/security/productionInventoryPolicy.js', import.meta.url), 'utf8');
  for (const m of ['setCustomUserClaims', 'revokeRefreshTokens', 'updateUser', 'createUser', 'deleteUser', 'importUsers']) {
    assert.equal(src.includes(m), false, `policy module must not reference ${m}`);
  }
  assert.equal(/from\s+['"]firebase-admin/.test(src), false, 'must not import firebase-admin');
  assert.equal(/from\s+['"]firebase\/(firestore|app|auth)['"]/.test(src), false, 'must not import client SDK');
});
