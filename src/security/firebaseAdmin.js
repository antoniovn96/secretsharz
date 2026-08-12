// Secret Sharz — Firebase Admin SDK (SERVER-ONLY).
//
// ⚠️  This module MUST NEVER be imported by client/browser code, React
// components, or any module that is bundled into the browser. It is imported
// only from `pages/api/*` handlers, which Next.js executes server-side and
// excludes from the client bundle.
//
// No service-account credentials are committed to the repository. The Admin
// SDK is initialized from the runtime environment:
//   - FIREBASE_SERVICE_ACCOUNT (JSON string; recommended for Vercel production),
//   - GOOGLE_APPLICATION_CREDENTIALS (path to a service-account JSON), or
//   - Google Application Default Credentials when running on a platform that
//     provides ambient credentials.
//
// ── Emulator mode (tests/CI only) ──────────────────────────────────────────
// When the Firebase emulator environment variables are present
// (FIREBASE_AUTH_EMULATOR_HOST and/or FIRESTORE_EMULATOR_HOST), initialization
// switches to an EXPLICIT, DETERMINISTIC emulator mode:
//   - the project id is forced to the deterministic test project
//     (EMULATOR_PROJECT_ID below), never a production project;
//   - NO credential is loaded — the emulator does not require one;
//   - if FIREBASE_SERVICE_ACCOUNT is also set, initialization REFUSES to
//     proceed, so a real service account can never be mixed into an emulator
//     test run (prevents accidental production credential use).
// Emulator mode is only active when those env vars are set, which only happens
// under `firebase emulators:exec` (test/CI). Production (Vercel/Cloud Run) does
// not set them, so production keeps using real Admin SDK credentials.
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Deterministic emulator project id (matches .firebaserc / firebase.json).
const EMULATOR_PROJECT_ID = 'secretsharz-emulator-test';

// Emulator mode is active when ANY Firebase emulator host env var is set.
export function isEmulatorMode() {
  return Boolean(
    process.env.FIREBASE_AUTH_EMULATOR_HOST || process.env.FIRESTORE_EMULATOR_HOST
  );
}

function readServiceAccountConfig() {
  // Prefer an explicit JSON string when provided (e.g. Vercel env var).
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (err) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT is set but is not valid JSON.');
    }
  }
  // Otherwise rely on GOOGLE_APPLICATION_CREDENTIALS / ADC. Returning null
  // tells initializeApp() to use Application Default Credentials.
  return null;
}

let _app = null;
export function getAdminApp() {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  if (isEmulatorMode()) {
    // Emulator mode: no credentials, deterministic test project. Refuse to mix
    // a real service account into an emulator run.
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      throw new Error(
        'Refusing to initialize Admin SDK in emulator mode while FIREBASE_SERVICE_ACCOUNT is set ' +
          '(production credential would be mixed into a test run).'
      );
    }
    _app = initializeApp({ projectId: EMULATOR_PROJECT_ID });
    return _app;
  }

  // Production mode: real credentials required.
  const credentialConfig = readServiceAccountConfig();
  _app = initializeApp(
    credentialConfig
      ? {
          credential: cert(credentialConfig),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        }
      : {
          // Application Default Credentials path (GOOGLE_APPLICATION_CREDENTIALS
          // or ambient ADC on Vercel/Cloud Run).
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        }
  );
  return _app;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}
