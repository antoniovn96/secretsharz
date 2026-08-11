#!/usr/bin/env node
// Secret Sharz — Phase 1D.2 claim-migration DRY-RUN tool (READ-ONLY).
//
// This script inventories existing Firestore `users` profiles and Firebase Auth
// users and classifies each into a migration category, WITHOUT performing any
// mutation. It is the read-only companion to
// src/security/claimMigrationInventory.js (the pure classification layer).
//
// ── READ-ONLY GUARANTEES ───────────────────────────────────────────────────
// This script calls ONLY the following Firebase Admin SDK READ methods:
//   - getAuth().listUsers(maxResults, pageToken)   (enumerate Auth users)
//   - getAuth().getUser(uid)                        (optional per-uid lookup)
//   - getFirestore().collection('users').get()      (read profile docs)
// It NEVER calls:
//   - setCustomUserClaims
//   - revokeRefreshTokens
//   - updateUser / createUser / deleteUser
//   - any Firestore write (set/update/delete/create/add)
// The emitted report always states `mutationsPerformed: false`.
//
// ── IDENTITY RULE ──────────────────────────────────────────────────────────
// A Firestore profile is uid-linked ONLY if a Firebase Auth user exists with
// uid === the Firestore document id. Email is used for DIAGNOSTIC enrichment
// of the `reason` field only; it is NEVER used as a safe migration linkage
// (the application does not establish email as an identity linkage).
//
// ── RUNNING ────────────────────────────────────────────────────────────────
// Emulator (testing/CI):  firebase emulators:exec --only auth,firestore \
//                          "node scripts/dry-run-claim-migration.mjs"
// Production (real dry run): run with real Admin SDK credentials in the
// environment (ADC / GOOGLE_APPLICATION_CREDENTIALS / FIREBASE_SERVICE_ACCOUNT)
// and NO emulator host env vars. The script will read production Auth +
// Firestore but will still perform ZERO mutations. Production use requires
// explicit human approval; this script does not gate production reads, but it
// is structurally incapable of writing.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAdminAuth, getAdminFirestore, isEmulatorMode } from '../src/security/firebaseAdmin.js';
import {
  classifyProfile,
  buildReport,
  FOUNDER_EMAIL
} from '../src/security/claimMigrationInventory.js';

const REPORT_PATH = 'reports/claim-migration-dry-run.json';

// Hard, defensive guard: the SDK Auth object exposes write methods (they exist
// on the prototype). We patch them to throw so an accidental call in this
// script (or a future edit) can NEVER mutate. Belt-and-braces on top of the
// structural read-only design.
const FORBIDDEN_AUTH_METHODS = ['setCustomUserClaims', 'revokeRefreshTokens', 'updateUser', 'createUser', 'deleteUser', 'deleteUsers', 'importUsers'];
function assertReadOnly(auth) {
  for (const m of FORBIDDEN_AUTH_METHODS) {
    if (typeof auth[m] === 'function') {
      auth[m] = () => { throw new Error(`DRY-RUN VIOLATION: ${m}() must never be called by the dry-run tool.`); };
    }
  }
}

// Enumerate ALL Firebase Auth users via listUsers pagination. Read-only.
async function listAllAuthUsers() {
  const auth = getAdminAuth();
  assertReadOnly(auth);
  const byUid = new Map();
  const byEmail = new Map();
  let pageToken;
  do {
    const result = await auth.listUsers(1000, pageToken);
    for (const user of result.users) {
      byUid.set(user.uid, {
        uid: user.uid,
        email: user.email || null,
        emailVerified: user.emailVerified,
        customClaims: user.customClaims || null
      });
      if (user.email) byEmail.set(user.email.toLowerCase(), user.uid);
    }
    pageToken = result.pageToken;
  } while (pageToken);
  return { byUid, byEmail };
}

// Read ALL Firestore users profile docs. Read-only snapshot.
async function readAllProfiles() {
  const db = getAdminFirestore();
  const snap = await db.collection('users').get();
  const profiles = [];
  snap.forEach((d) => {
    const data = d.data() || {};
    profiles.push({ id: d.id, role: data.role ?? null, email: data.email ?? null });
  });
  return profiles;
}

async function run() {
  const generatedAt = new Date().toISOString();
  const mode = isEmulatorMode() ? 'EMULATOR (test/CI)' : 'PRODUCTION (real Admin SDK)';
  console.log(`\n=== Secret Sharz — claim-migration DRY RUN ===`);
  console.log(`mode:                ${mode}`);
  console.log(`mutations performed:  false (guaranteed; read-only by construction)`);
  console.log(`founder protected:   ${FOUNDER_EMAIL} (always excluded)`);
  console.log('');

  const { byUid, byEmail } = await listAllAuthUsers();
  const profiles = await readAllProfiles();

  console.log(`Auth users found:     ${byUid.size}`);
  console.log(`Firestore profiles:   ${profiles.length}`);
  console.log('');

  const classifications = profiles.map((profile) => {
    const authUser = byUid.get(profile.id) ?? null;
    // Diagnostic-only email lookup: never used to authorize migration.
    let authUserByEmail = null;
    if (profile.email && byEmail.has(profile.email.toLowerCase())) {
      const uid = byEmail.get(profile.email.toLowerCase());
      authUserByEmail = byUid.get(uid) ?? null;
    }
    return classifyProfile({ profile, authUser, authUserByEmail });
  });

  const report = buildReport({ generatedAt, classifications });

  // Emit machine-readable report.
  const reportDir = path.dirname(fileURLToPath(new URL(REPORT_PATH, import.meta.url)));
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');

  // Human-readable summary.
  const s = report.summary;
  console.log('--- SUMMARY ---');
  console.log(`totalProfilesExamined: ${s.totalProfilesExamined}`);
  console.log(`safeToMigrate:         ${s.safeToMigrate}`);
  console.log(`alreadyMigrated:      ${s.alreadyMigrated}`);
  console.log(`missingAuthAccount:    ${s.missingAuthAccount}`);
  console.log(`roleConflicts:        ${s.roleConflicts}`);
  console.log(`invalidRoles:         ${s.invalidRoles}`);
  console.log(`missingUid:           ${s.missingUid}`);
  console.log(`reviewRequired:       ${s.reviewRequired}`);
  console.log(`founderProtected:     ${report.founderProtected}`);
  console.log('');
  console.log(`report written to:    ${REPORT_PATH}`);
  console.log(`dryRun:                ${report.dryRun}`);
  console.log(`mutationsPerformed:    ${report.mutationsPerformed}`);

  // Per-user table (diagnostic; no secrets — only ids/emails/roles/categories).
  if (classifications.length > 0) {
    console.log('');
    console.log('--- PER-USER INVENTORY (diagnostic) ---');
    const rows = classifications.map((c) => ({
      firestoreDocId: c.firestoreDocId,
      authUid: c.authUid,
      email: c.email,
      firestoreRole: c.firestoreRole,
      currentClaimRole: c.currentClaimRole,
      proposedClaimRole: c.proposedClaimRole,
      category: c.category,
      founderProtected: c.founderProtected,
      reason: c.reason
    }));
    console.table(rows);
  }

  console.log('\nDRY RUN COMPLETE. No mutations were performed.');
}

run().catch((err) => {
  console.error('Dry run failed:', err?.message || err);
  process.exit(1);
});
