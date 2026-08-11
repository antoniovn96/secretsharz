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
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: [], policies: [], authUserCount: 0 });
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
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: 6 });
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
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: 1 });
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

// ---- authUsers vs firestoreProfiles: independent sources (Task 1 regression) ----

test('14. authUsers comes from the explicit Auth count, NOT classifications.length', () => {
  // Simulate the production reality: 4 Auth users but 5 Firestore profiles
  // (an orphan profile with no Auth account, e.g. a legacy fixture doc).
  const cs = [
    classifyProfile({ profile: PROF('f', 'super_admin', FOUNDER_EMAIL), authUser: AUTH('f', FOUNDER_EMAIL, { claimRole: 'super_admin' }) }),
    classifyProfile({ profile: PROF('stu1', 'student', 's1@example.com'), authUser: AUTH('stu1', 's1@example.com') }),
    classifyProfile({ profile: PROF('stu2', 'student', 's2@example.com'), authUser: AUTH('stu2', 's2@example.com') }),
    classifyProfile({ profile: PROF('stu3', 'student', 's3@example.com'), authUser: AUTH('stu3', 's3@example.com') }),
    classifyProfile({ profile: PROF('mock-student-id', 'super_admin', null), authUser: null }) // orphan: no Auth account
  ];
  const ps = cs.map(applyProductionPolicy);
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: 4 });
  assert.equal(r.summary.authUsers, 4);       // actual Auth count (byUid.size)
  assert.equal(r.summary.firestoreProfiles, 5); // classification/profile count
  assert.notEqual(r.summary.authUsers, r.summary.firestoreProfiles); // the two CAN differ
});

test('15. firestoreProfiles is always classifications.length regardless of authUserCount', () => {
  const cs = [
    classifyProfile({ profile: PROF('a', 'student', 'a@example.com'), authUser: AUTH('a', 'a@example.com') }),
    classifyProfile({ profile: PROF('b', 'student', 'b@example.com'), authUser: AUTH('b', 'b@example.com') })
  ];
  const ps = cs.map(applyProductionPolicy);
  // Even if Auth count is wrong/different, firestoreProfiles tracks profiles.
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: 7 });
  assert.equal(r.summary.firestoreProfiles, 2);
  assert.equal(r.summary.authUsers, 7);
});

test('16. buildProductionReport REJECTS missing/invalid authUserCount (no silent fallback to classifications.length)', () => {
  const cs = [classifyProfile({ profile: PROF('a', 'student', 'a@example.com'), authUser: AUTH('a', 'a@example.com') })];
  const ps = cs.map(applyProductionPolicy);
  assert.throws(() => buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps }), /authUserCount/);
  assert.throws(() => buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: undefined }), /authUserCount/);
  assert.throws(() => buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: '4' }), /authUserCount/);
  assert.throws(() => buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: NaN }), /authUserCount/);
  // A user count is a finite non-negative integer: negatives and fractions are invalid.
  assert.throws(() => buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: -1 }), /authUserCount/);
  assert.throws(() => buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: 4.5 }), /authUserCount/);
  assert.throws(() => buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: Infinity }), /authUserCount/);
});

// ---- privilegedNonMigration ⊆ otherUsers (Task 2 documentation regression) ----

test('17. privilegedNonMigration is a SUBSET of otherUsers (same records, not an additional set)', () => {
  const cs = [
    classifyProfile({ profile: PROF('f', 'super_admin', FOUNDER_EMAIL), authUser: AUTH('f', FOUNDER_EMAIL, { claimRole: 'super_admin' }) }),
    // privileged follow-up (orphan, privileged) → appears in BOTH arrays
    classifyProfile({ profile: PROF('mock-student-id', 'super_admin', null), authUser: null }),
    // non-privileged follow-up (invalid/unknown role → review, NOT privileged) → otherUsers only
    classifyProfile({ profile: PROF('wiz', 'wizard', 'w@example.com'), authUser: AUTH('wiz', 'w@example.com') }),
    // ordinary student → aggregate only (neither array)
    classifyProfile({ profile: PROF('stu', 'student', 's@example.com'), authUser: AUTH('stu', 's@example.com') })
  ];
  const ps = cs.map(applyProductionPolicy);
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: 3 });
  // privilegedNonMigration must be a subset of otherUsers by firestoreDocId.
  const otherIds = new Set(r.otherUsers.map((d) => d.firestoreDocId));
  for (const p of r.privilegedNonMigration) {
    assert.ok(otherIds.has(p.firestoreDocId), `privileged record ${p.firestoreDocId} missing from otherUsers`);
  }
  assert.ok(r.privilegedNonMigration.length <= r.otherUsers.length, 'privilegedNonMigration must not exceed otherUsers');
  // The privileged orphan is in both; the non-privileged invalid-role record is in otherUsers only.
  assert.ok(r.privilegedNonMigration.some((d) => d.firestoreDocId === 'mock-student-id'));
  assert.ok(r.otherUsers.some((d) => d.firestoreDocId === 'mock-student-id'));
  assert.ok(r.otherUsers.some((d) => d.firestoreDocId === 'wiz'));
  assert.ok(!r.privilegedNonMigration.some((d) => d.firestoreDocId === 'wiz'), 'non-privileged follow-up must NOT be in privilegedNonMigration');
});

test('18. the report documents the privilegedNonMigration ⊆ otherUsers relationship (schema clarity)', () => {
  const cs = [classifyProfile({ profile: PROF('a', 'student', 'a@example.com'), authUser: AUTH('a', 'a@example.com') })];
  const ps = cs.map(applyProductionPolicy);
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: 1 });
  assert.ok(r.detailArrayRelationship, 'report must document the detail-array relationship');
  assert.equal(r.detailArrayRelationship.privilegedNonMigration, 'subset_of_otherUsers');
  assert.equal(typeof r.detailArrayRelationship.description, 'string');
  assert.ok(r.detailArrayRelationship.description.toLowerCase().includes('subset'), 'description must explain the subset relationship');
});

test('19. summary counts do NOT double-count privileged records (privilegedUsersRequiringFollowup <= nonMigrationRequiresFollowup)', () => {
  const cs = [
    classifyProfile({ profile: PROF('f', 'super_admin', FOUNDER_EMAIL), authUser: AUTH('f', FOUNDER_EMAIL, { claimRole: 'super_admin' }) }),
    classifyProfile({ profile: PROF('mock-student-id', 'super_admin', null), authUser: null }),
    classifyProfile({ profile: PROF('stu', 'student', 's@example.com'), authUser: AUTH('stu', 's@example.com') })
  ];
  const ps = cs.map(applyProductionPolicy);
  const r = buildProductionReport({ generatedAt: 't', projectId: 'secretsharz-f9aed', classifications: cs, policies: ps, authUserCount: 2 });
  const s = r.summary;
  assert.equal(s.nonMigrationRequiresFollowup, 1);
  assert.equal(s.privilegedUsersRequiringFollowup, 1);
  assert.ok(s.privilegedUsersRequiringFollowup <= s.nonMigrationRequiresFollowup, 'privileged count must never exceed follow-up count (no double counting)');
  assert.equal(s.otherUsers, 2); // mock-student-id + stu (non-founder)
  assert.equal(s.nonMigration, 1); // stu
});
