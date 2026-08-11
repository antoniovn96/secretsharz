// Secret Sharz — Firebase Admin SDK (SERVER-ONLY).
//
// ⚠️  This module MUST NEVER be imported by client/browser code, React
// components, or any module that is bundled into the browser. It is imported
// only from `pages/api/*` handlers, which Next.js executes server-side and
// excludes from the client bundle.
//
// No service-account credentials are committed to the repository. The Admin
// SDK is initialized from the runtime environment:
//   - GOOGLE_APPLICATION_CREDENTIALS (path to a service-account JSON), or
//   - FIREBASE_SERVICE_ACCOUNT (JSON string), or
//   - Google Application Default Credentials when running on Vercel/Cloud Run.
//
// In test/CI this module is intentionally NOT exercised by the Firestore
// security-rule suite (which uses @firebase/rules-unit-testing against the
// emulator and needs no credentials). See SECURITY_FOUNDATION.md.
import { initializeApp, getApps, cert } from 'firebase-admin/app';

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
  // Lazy require to keep the auth module out of any accidental client import
  // graph; pages/api handlers are the only consumers.
  const { getAuth } = require('firebase-admin/auth');
  return getAuth(getAdminApp());
}

export function getAdminFirestore() {
  const { getFirestore } = require('firebase-admin/firestore');
  return getFirestore(getAdminApp());
}
