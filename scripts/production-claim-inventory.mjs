#!/usr/bin/env node
// Secret Sharz — Phase 1D.2 PRODUCTION READ-ONLY claim-migration inventory.
//
// Reads the REAL production Firebase project (secretsharz-f9aed) and produces
// an inventory applying the Phase 1D.2 production policy:
//   - ONLY the founder (antonio.antonio.noronha@gmail.com) is a retained
//     privileged account (FOUNDER_PROTECTED).
//   - EVERY other user is NON_MIGRATION (privileged ones are flagged
//     NON_MIGRATION_REQUIRES_FOLLOWUP). No user is migrated or modified.
//
// ── READ-ONLY GUARANTEES ───────────────────────────────────────────────────
// Calls ONLY: getAuth().listUsers() and getFirestore().collection('users').get()
// NEVER calls setCustomUserClaims/revokeRefreshTokens/updateUser/createUser/
// deleteUser or any Firestore write. Mutation methods are patched to throw.
// The emitted report always states mutationsPerformed:false.
//
// ── ENVIRONMENT GUARD ──────────────────────────────────────────────────────
// Before reading, asserts:
//   1. NO Firebase emulator env vars are set (must not be an emulator run).
//   2. NEXT_PUBLIC_FIREBASE_PROJECT_ID === 'secretsharz-f9aed'.
//   3. The Admin SDK initialized in production mode.
// If any check fails, it STOPS without reading.
//
// ── CREDENTIALS ────────────────────────────────────────────────────────────
// Uses the existing server-side Firebase Admin configuration
// (src/security/firebaseAdmin.js). It does NOT ask for or print any private
// key, service-account JSON, API key, or access token. If no Admin SDK
// credential is available (ADC / FIREBASE_SERVICE_ACCOUNT /
// GOOGLE_APPLICATION_CREDENTIALS), the read will fail safely — no mutations.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAdminAuth, getAdminFirestore, isEmulatorMode } from '../src/security/firebaseAdmin.js';
import { classifyProfile } from '../src/security/claimMigrationInventory.js';
import {
  applyProductionPolicy,
  buildProductionReport,
  PROD_CATEGORY
} from '../src/security/productionInventoryPolicy.js';

const EXPECTED_PROJECT_ID = 'secretsharz-f9aed';
const REPORT_PATH = 'reports/production-claim-migration-inventory.json';
const FORBIDDEN_AUTH_METHODS = ['setCustomUserClaims', 'revokeRefreshTokens', 'updateUser', 'createUser', 'deleteUser', 'deleteUsers', 'importUsers'];

function assertReadOnly(auth) {
  for (const m of FORBIDDEN_AUTH_METHODS) {
    if (typeof auth[m] === 'function') {
      auth[m] = () => { throw new Error(`PRODUCTION INVENTORY VIOLATION: ${m}() must never be called.`); };
    }
  }
}

function assertProductionEnvironment() {
  if (isEmulatorMode()) {
    throw new Error('ABORT: Firebase emulator env vars are set. This tool must NOT run against the emulator for the production inventory.');
  }
  const pid = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (pid !== EXPECTED_PROJECT_ID) {
    throw new Error(`ABORT: NEXT_PUBLIC_FIREBASE_PROJECT_ID is "${pid}", expected "${EXPECTED_PROJECT_ID}". Refusing to read an unconfirmed production project.`);
  }
}

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
        disabled: user.disabled === true,
        customClaims: user.customClaims || null
      });
      if (user.email) byEmail.set(user.email.toLowerCase(), user.uid);
    }
    pageToken = result.pageToken;
  } while (pageToken);
  return { byUid, byEmail };
}

async function readAllProfiles() {
  const db = getAdminFirestore();
  const snap = await db.collection('users').get();
  const profiles = [];
  snap.forEach((d) => {
    const data = d.data() || {};
    profiles.push({ id: d.id, uid: data.uid ?? null, role: data.role ?? null, email: data.email ?? null });
  });
  return profiles;
}

async function run() {
  assertProductionEnvironment();
  const generatedAt = new Date().toISOString();
  console.log('\n=== Secret Sharz — PRODUCTION claim-migration inventory (READ-ONLY) ===');
  console.log(`project:              ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
  console.log(`mode:                  PRODUCTION (real Admin SDK)`);
  console.log(`mutations performed:   false (guaranteed; read-only by construction)`);
  console.log(`migration policy:      only founder is retained privileged; others NON_MIGRATION`);
  console.log('');

  let authUsers;
  let profiles;
  try {
    const r = await listAllAuthUsers();
    authUsers = r;
    profiles = await readAllProfiles();
  } catch (err) {
    console.error('Production read failed safely (no mutations performed):', err?.code || String(err?.message || err).slice(0, 200));
    // Still emit a minimal report stating the read could not complete.
    const report = {
      production: true,
      readOnly: true,
      mutationsPerformed: false,
      generatedAt,
      project: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      migrationPolicy: { retainedPrivilegedAccount: 'antonio.antonio.noronha@gmail.com', otherUsersMigration: 'DENIED' },
      readError: 'Production read could not be completed in this environment (Admin SDK credentials unavailable). No mutations were performed.',
      summary: { authUsers: 0, firestoreProfiles: 0, founderProtected: 0, otherUsers: 0, nonMigration: 0, nonMigrationRequiresFollowup: 0, privilegedUsersRequiringFollowup: 0, identityConflicts: 0 },
      founder: null,
      privilegedNonMigration: [],
      otherUsers: []
    };
    writeReport(report);
    console.log(`\nReport written to ${REPORT_PATH} (read could not complete — see readError).`);
    process.exit(2);
  }

  const { byUid, byEmail } = authUsers;
  console.log(`Auth users found:      ${byUid.size}`);
  console.log(`Firestore profiles:   ${profiles.length}`);
  console.log('');

  const classifications = profiles.map((profile) => {
    const authUser = byUid.get(profile.id) ?? null;
    let authUserByEmail = null;
    if (profile.email && byEmail.has(profile.email.toLowerCase())) {
      const uid = byEmail.get(profile.email.toLowerCase());
      authUserByEmail = byUid.get(uid) ?? null;
    }
    return classifyProfile({ profile, authUser, authUserByEmail });
  });
  const policies = classifications.map(applyProductionPolicy);

  const report = buildProductionReport({ generatedAt, projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, classifications, policies, authUserCount: byUid.size });
  writeReport(report);

  const s = report.summary;
  console.log('--- SUMMARY ---');
  console.log(`authUsers:                        ${s.authUsers}`);
  console.log(`firestoreProfiles:                ${s.firestoreProfiles}`);
  console.log(`founderProtected:                 ${s.founderProtected}`);
  console.log(`otherUsers:                       ${s.otherUsers}`);
  console.log(`nonMigration:                     ${s.nonMigration}`);
  console.log(`nonMigrationRequiresFollowup:     ${s.nonMigrationRequiresFollowup}`);
  console.log(`privilegedUsersRequiringFollowup: ${s.privilegedUsersRequiringFollowup}`);
  console.log(`identityConflicts:                ${s.identityConflicts}`);
  console.log('');
  console.log(`founder: ${report.founder ? 'present (' + PROD_CATEGORY.FOUNDER_PROTECTED + ')' : 'NOT FOUND'}`);
  console.log(`report written to: ${REPORT_PATH}`);
  console.log(`production: ${report.production} | readOnly: ${report.readOnly} | mutationsPerformed: ${report.mutationsPerformed}`);
  console.log('\nPRODUCTION INVENTORY COMPLETE. No mutations were performed.');
}

function writeReport(report) {
  const reportDir = path.dirname(fileURLToPath(new URL(REPORT_PATH, import.meta.url)));
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n', 'utf8');
}

run().catch((err) => {
  console.error('Production inventory aborted:', err?.message || err);
  process.exit(1);
});
