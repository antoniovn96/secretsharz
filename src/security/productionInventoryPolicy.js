// Secret Sharz — Phase 1D.2 production-inventory POLICY layer (PURE, read-only).
//
// This module applies the Phase 1D.2 production business rule to the
// diagnostic classification produced by claimMigrationInventory.js:
//
//   ONLY the founder (antonio.antonio.noronha@gmail.com) is an eventual
//   retained privileged account. Every other user is NON_MIGRATION — no
//   claims are assigned, removed, or modified for them by this phase. This
//   phase is a READ-ONLY inventory; it performs no mutations whatsoever.
//
// This module is PURE: no Firebase, no I/O, no mutation methods. It only
// translates diagnostic classifications into production-policy report records.
import {
  CATEGORY,
  FOUNDER_EMAIL,
  CLAIM_ROLE_KEY,
  ASSIGNABLE_CLAIM_ROLES
} from './claimMigrationInventory.js';

// Whether a non-founder user currently holds ANY privileged state worth
// flagging for separate follow-up (privileged Firestore role and/or a
// privileged custom claim). These users are NOT migrated and NOT modified —
// they are surfaced for human review only.
export function hasPrivilegedState({ firestoreRole, currentClaimRole }) {
  const fr = typeof firestoreRole === 'string' ? firestoreRole : null;
  const cr = typeof currentClaimRole === 'string' ? currentClaimRole : null;
  return ASSIGNABLE_CLAIM_ROLES.includes(fr) || ASSIGNABLE_CLAIM_ROLES.includes(cr);
}

// Production policy categories for the report.
export const PROD_CATEGORY = Object.freeze({
  FOUNDER_PROTECTED: 'FOUNDER_PROTECTED',
  NON_MIGRATION: 'NON_MIGRATION',
  NON_MIGRATION_REQUIRES_FOLLOWUP: 'NON_MIGRATION_REQUIRES_FOLLOWUP'
});

// Apply the production policy to one diagnostic classification.
// Returns a report record with the production category + followup flags.
// Pure; no mutation.
export function applyProductionPolicy(classification) {
  if (!classification || typeof classification !== 'object') {
    return { category: PROD_CATEGORY.NON_MIGRATION, reason: 'Unclassifiable record.', requiresFollowup: false, privileged: false };
  }
  if (classification.founderProtected) {
    return {
      category: PROD_CATEGORY.FOUNDER_PROTECTED,
      reason: 'Retained privileged Super Admin / founder account. Protected — excluded from migration; not modified.',
      requiresFollowup: false,
      privileged: true,
      founderProtected: true
    };
  }
  const privileged = hasPrivilegedState({
    firestoreRole: classification.firestoreRole,
    currentClaimRole: classification.currentClaimRole
  });
  const conflict = classification.category === CATEGORY.ROLE_CONFLICT ||
    classification.category === CATEGORY.MISSING_UID_OR_UNLINKED_PROFILE;
  const requiresFollowup = Boolean(privileged || conflict ||
    classification.category === CATEGORY.INVALID_OR_UNKNOWN_ROLE);

  const reason = privileged
    ? 'Non-founder user currently holds a privileged role and/or claim. Per policy (OPTION A) this user is NOT migrated and NOT modified; flagged for separate human follow-up.'
    : 'Non-founder user. Per policy (OPTION A) this user is NON_MIGRATION and is not modified in this phase.';

  return {
    category: requiresFollowup ? PROD_CATEGORY.NON_MIGRATION_REQUIRES_FOLLOWUP : PROD_CATEGORY.NON_MIGRATION,
    reason,
    requiresFollowup,
    privileged,
    conflict,
    founderProtected: false
  };
}

// Build the complete production-inventory report. Pure; mutationsPerformed is
// always false. For ordinary (non-followup) users only aggregate counts are
// emitted; detailed identity is included only for the founder and for users
// requiring follow-up (the minimum necessary for human review).
//
// `authUserCount` is REQUIRED and must be the actual Firebase Auth user count
// (the caller's byUid.size). It must NOT be derived from classifications.length,
// because classifications is keyed off Firestore profiles (one entry per
// users/ doc) and therefore classifications.length is the Firestore profile
// count, which can differ from the Auth user count (e.g. orphan profiles with
// no Auth account).
export function buildProductionReport({ generatedAt, projectId, classifications, policies, authUserCount }) {
  if (
    typeof authUserCount !== 'number' ||
    !Number.isFinite(authUserCount) ||
    !Number.isInteger(authUserCount) ||
    authUserCount < 0
  ) {
    throw new Error('buildProductionReport: authUserCount must be a finite non-negative integer (the actual Firebase Auth user count, i.e. byUid.size).');
  }
  const summary = {
    authUsers: authUserCount,
    firestoreProfiles: classifications.length,
    founderProtected: 0,
    otherUsers: 0,
    nonMigration: 0,
    nonMigrationRequiresFollowup: 0,
    privilegedUsersRequiringFollowup: 0,
    identityConflicts: 0
  };

  let founder = null;
  const otherUsersDetail = []; // follow-up / privileged / conflict only
  const privilegedNonMigration = [];

  for (let i = 0; i < classifications.length; i += 1) {
    const c = classifications[i];
    const p = policies[i];
    if (p.category === PROD_CATEGORY.FOUNDER_PROTECTED) {
      summary.founderProtected += 1;
      founder = {
        email: c.email,
        authUid: c.authUid,
        firestoreDocId: c.firestoreDocId,
        authAccountExists: Boolean(c.authUid),
        firestoreProfileExists: Boolean(c.firestoreDocId),
        uidLinked: Boolean(c.authUid) && c.authUid === c.firestoreDocId,
        emailVerified: c.authEmailVerified,
        currentClaimRole: c.currentClaimRole,
        currentClaims: c.currentClaims,
        firestoreRole: c.firestoreRole,
        structurallyConsistent: Boolean(c.authUid) && c.authUid === c.firestoreDocId,
        category: PROD_CATEGORY.FOUNDER_PROTECTED
      };
    } else {
      summary.otherUsers += 1;
      if (p.category === PROD_CATEGORY.NON_MIGRATION_REQUIRES_FOLLOWUP) {
        summary.nonMigrationRequiresFollowup += 1;
        if (p.privileged) summary.privilegedUsersRequiringFollowup += 1;
        if (p.conflict) summary.identityConflicts += 1;
        const detail = {
          authUid: c.authUid,
          firestoreDocId: c.firestoreDocId,
          email: c.email,
          emailSource: c.emailSource,
          firestoreRole: c.firestoreRole,
          currentClaimRole: c.currentClaimRole,
          uidLinked: Boolean(c.authUid) && c.authUid === c.firestoreDocId,
          authAccountExists: Boolean(c.authUid),
          firestoreProfileExists: Boolean(c.firestoreDocId),
          conflict: p.conflict,
          privileged: p.privileged,
          diagnosticCategory: c.category,
          requiresFollowup: true,
          recommendedFollowupCategory: c.category,
          reason: p.reason
        };
        otherUsersDetail.push(detail);
        if (p.privileged) privilegedNonMigration.push(detail);
      } else {
        summary.nonMigration += 1;
      }
    }
  }

  return {
    production: true,
    readOnly: true,
    mutationsPerformed: false,
    generatedAt,
    project: projectId,
    migrationPolicy: {
      retainedPrivilegedAccount: FOUNDER_EMAIL,
      otherUsersMigration: 'DENIED'
    },
    // Schema note (no data change): `privilegedNonMigration` is a SUBSET of
    // `otherUsers`. Every record in privilegedNonMigration also appears in
    // otherUsers — it is a convenience view of the privileged follow-up
    // records only, not an additional set of users. The summary counts are
    // independent and never double-count: privilegedUsersRequiringFollowup and
    // nonMigrationRequiresFollowup are incremented once per qualifying record.
    detailArrayRelationship: Object.freeze({
      privilegedNonMigration: 'subset_of_otherUsers',
      description: 'privilegedNonMigration is a subset of otherUsers: it is a filtered view of the privileged follow-up records only, not an additional set of users, and it does not affect summary counts.'
    }),
    summary,
    founder,
    privilegedNonMigration,
    otherUsers: otherUsersDetail
  };
}

export { FOUNDER_EMAIL, CLAIM_ROLE_KEY, CATEGORY };
