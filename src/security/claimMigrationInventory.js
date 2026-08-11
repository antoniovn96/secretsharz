// Secret Sharz — Phase 1D.2 claim-migration inventory (DRY-RUN, pure logic).
//
// This module is the PURE, side-effect-free classification layer for the
// production claim-migration dry run. It contains NO Firebase Admin SDK, NO
// client SDK, NO I/O, and NO mutation methods. It only classifies profile +
// Auth state into migration categories so the decision can be unit-tested
// deterministically and so the dry-run script can stay a thin read-only shell.
//
// SECURITY INVARIANTS
// -------------------
// - This module NEVER assigns, removes, or modifies any custom claim, Auth
//   user, or Firestore document. It only computes a classification.
// - The Super Admin / founder account is always classified FOUNDER_PROTECTED
//   and excluded from the migration candidate set.
// - Firestore document ID is NOT assumed to equal the Firebase Auth UID. The
//   caller supplies the Auth user matched by uid === profile.id; if absent,
//   the profile is NOT marked safe. Email is used for DIAGNOSTIC enrichment
//   only, never as a safe migration linkage (the application architecture does
//   not establish email as an identity linkage for authorization).
// - Role mapping uses ONLY the existing application vocabulary
//   (ASSIGNABLE_CLAIM_ROLES). No roles are invented.
import {
  CLAIM_ROLE_KEY,
  FOUNDER_EMAIL,
  ASSIGNABLE_CLAIM_ROLES
} from './claimRoles.js';

// Migration categories. `FOUNDER_PROTECTED` and `NOT_PRIVILEGED` are excluded
// from the eventual migration candidate set.
export const CATEGORY = Object.freeze({
  FOUNDER_PROTECTED: 'FOUNDER_PROTECTED',
  SAFE_TO_MIGRATE: 'SAFE_TO_MIGRATE',
  ALREADY_MIGRATED: 'ALREADY_MIGRATED',
  MISSING_AUTH_ACCOUNT: 'MISSING_AUTH_ACCOUNT',
  ROLE_CONFLICT: 'ROLE_CONFLICT',
  INVALID_OR_UNKNOWN_ROLE: 'INVALID_OR_UNKNOWN_ROLE',
  MISSING_UID_OR_UNLINKED_PROFILE: 'MISSING_UID_OR_UNLINKED_PROFILE',
  OTHER_REVIEW_REQUIRED: 'OTHER_REVIEW_REQUIRED',
  NOT_PRIVILEGED: 'NOT_PRIVILEGED'
});

// Whether a category represents a user that should eventually receive a claim
// (the migration candidate set). Founder, already-migrated, non-privileged,
// and review-only categories are excluded.
export function isMigrationCandidate(category) {
  return category === CATEGORY.SAFE_TO_MIGRATE;
}

// Read the current role claim from a customClaims object (mirrors roleAssignment.roleFromClaims).
function currentClaimRoleFrom(customClaims) {
  if (!customClaims || typeof customClaims !== 'object') return null;
  const r = customClaims[CLAIM_ROLE_KEY];
  return typeof r === 'string' ? r : null;
}

// Lowercase-trimmed email compare (defensive; Auth emails are lowercase).
function emailMatches(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

// The proposed claim role for a profile, based ONLY on the existing application
// role vocabulary. Returns:
//   - a role string if it is an assignable privileged role,
//   - null if the profile is a student / has no privileged role (no claim needed),
//   - { invalid: true, value } if the role string is not recognized.
function proposedClaimRoleFor(firestoreRole) {
  if (typeof firestoreRole !== 'string' || firestoreRole.length === 0) {
    return null; // no role field → treated as default (student-like), not privileged
  }
  if (ASSIGNABLE_CLAIM_ROLES.includes(firestoreRole)) {
    return firestoreRole;
  }
  if (firestoreRole === 'student') {
    return null;
  }
  return { invalid: true, value: firestoreRole };
}

// Classify a single profile against its matched Auth user (if any).
//
// `profile`   : { id, role?, email? }             — Firestore users doc
// `authUser`  : { uid, email, emailVerified, customClaims } | null
//               matched by uid === profile.id (caller responsibility)
// `authUserByEmail` : optional Auth user matched by email, for DIAGNOSTIC
//               enrichment only. Never used to authorize migration.
//
// Returns a classification record. Pure; no mutation.
export function classifyProfile({ profile, authUser, authUserByEmail = null }) {
  const firestoreDocId = profile?.id ?? null;
  const firestoreRole = profile?.role ?? null;
  const profileEmail = profile?.email ?? null;

  const authUid = authUser?.uid ?? null;
  const authEmail = authUser?.email ?? null;
  const emailVerified = authUser?.emailVerified ?? null;
  const customClaims = authUser?.customClaims ?? null;
  const currentClaimRole = currentClaimRoleFrom(customClaims);

  const founderProtected =
    emailMatches(profileEmail, FOUNDER_EMAIL) || emailMatches(authEmail, FOUNDER_EMAIL);

  const base = {
    firestoreDocId,
    authUid,
    email: authEmail || profileEmail || null,
    emailSource: authEmail ? 'auth' : (profileEmail ? 'firestore' : null),
    authEmail,
    authEmailVerified: emailVerified,
    firestoreRole,
    currentClaims: customClaims,
    currentClaimRole,
    proposedClaimRole: null,
    category: CATEGORY.OTHER_REVIEW_REQUIRED,
    reason: '',
    founderProtected
  };

  if (founderProtected) {
    return {
      ...base,
      category: CATEGORY.FOUNDER_PROTECTED,
      reason: 'Super Admin / founder account is protected and excluded from migration.'
    };
  }

  const proposed = proposedClaimRoleFor(firestoreRole);

  // Invalid / unknown role → review, never safe.
  if (proposed && proposed.invalid === true) {
    return {
      ...base,
      category: CATEGORY.INVALID_OR_UNKNOWN_ROLE,
      reason: `Role "${proposed.value}" is not in the supported role vocabulary (${ASSIGNABLE_CLAIM_ROLES.join(', ')}).`
    };
  }

  const proposedClaimRole = proposed; // string or null

  // Non-privileged (student / no role) → not a migration candidate.
  if (proposedClaimRole === null) {
    return {
      ...base,
      proposedClaimRole: null,
      category: CATEGORY.NOT_PRIVILEGED,
      reason: 'Profile is a student / has no privileged role; no custom claim is required (student is the default, represented by the absence of a claim).'
    };
  }

  // Privileged role → an Auth account matched by uid === profile.id is required.
  if (!authUser) {
    // Email is DIAGNOSTIC only. If an Auth user shares the email but not the
    // uid, the profile cannot be safely linked → unlinked, not missing entirely.
    if (authUserByEmail && !emailMatches(authUserByEmail.uid, firestoreDocId)) {
      return {
        ...base,
        proposedClaimRole,
        category: CATEGORY.MISSING_UID_OR_UNLINKED_PROFILE,
        reason: `No Auth account with uid === Firestore doc id "${firestoreDocId}". An Auth account with a matching email exists (uid "${authUserByEmail.uid}") but the application architecture does not establish email as a safe identity linkage, so manual review is required.`
      };
    }
    return {
      ...base,
      proposedClaimRole,
      category: CATEGORY.MISSING_AUTH_ACCOUNT,
      reason: `No Firebase Auth account found with uid === Firestore doc id "${firestoreDocId}".`
    };
  }

  // Auth account present and uid-linked. Compare claim state.
  if (currentClaimRole === proposedClaimRole) {
    return {
      ...base,
      proposedClaimRole,
      category: CATEGORY.ALREADY_MIGRATED,
      reason: `Auth account already has the "${proposedClaimRole}" custom claim matching the Firestore role.`
    };
  }

  if (currentClaimRole !== null) {
    return {
      ...base,
      proposedClaimRole,
      category: CATEGORY.ROLE_CONFLICT,
      reason: `Firestore role is "${proposedClaimRole}" but Auth custom claim is "${currentClaimRole}". These disagree and must NOT be resolved automatically.`
    };
  }

  // No existing role claim + valid assignable role + uid-linked Auth account.
  return {
    ...base,
    proposedClaimRole,
    category: CATEGORY.SAFE_TO_MIGRATE,
    reason: `Valid Auth account (uid-linked) with privileged Firestore role "${proposedClaimRole}" and no conflicting custom claim.`
  };
}

// Build the complete dry-run report object from classification records.
// Pure; does not write anywhere. `mutationsPerformed` is always false.
export function buildReport({ generatedAt, classifications }) {
  const summary = {
    totalProfilesExamined: classifications.length,
    safeToMigrate: 0,
    alreadyMigrated: 0,
    missingAuthAccount: 0,
    roleConflicts: 0,
    invalidRoles: 0,
    missingUid: 0,
    reviewRequired: 0
  };

  const users = classifications.map((c) => {
    switch (c.category) {
      case CATEGORY.SAFE_TO_MIGRATE: summary.safeToMigrate += 1; break;
      case CATEGORY.ALREADY_MIGRATED: summary.alreadyMigrated += 1; break;
      case CATEGORY.MISSING_AUTH_ACCOUNT: summary.missingAuthAccount += 1; break;
      case CATEGORY.ROLE_CONFLICT: summary.roleConflicts += 1; break;
      case CATEGORY.INVALID_OR_UNKNOWN_ROLE: summary.invalidRoles += 1; break;
      case CATEGORY.MISSING_UID_OR_UNLINKED_PROFILE: summary.missingUid += 1; break;
      case CATEGORY.OTHER_REVIEW_REQUIRED: summary.reviewRequired += 1; break;
      default: break; // FOUNDER_PROTECTED, NOT_PRIVILEGED are tracked separately below
    }
    return c;
  });

  const founderProtected = classifications.some((c) => c.founderProtected);

  return {
    generatedAt,
    dryRun: true,
    mutationsPerformed: false,
    founderProtected,
    summary,
    users
  };
}

export { FOUNDER_EMAIL, CLAIM_ROLE_KEY, ASSIGNABLE_CLAIM_ROLES };
