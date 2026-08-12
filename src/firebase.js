// ─────────────────────────────────────────────────────────────
// firebase.js — Secret Sharz Firebase client
// ─────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Firestore can report the client as "offline" when a browser, proxy,
// extension, or network path interferes with its streaming transport.
// Auto-detect long polling gives production browsers a more resilient fallback.
let firestore;
try {
  firestore = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
    useFetchStreams: false,
  });
} catch (_) {
  // Safe fallback for environments where Firestore has already been initialized.
  firestore = getFirestore(app);
}

// App Check is deliberately disabled unless production explicitly opts in.
// Having a reCAPTCHA site key in Vercel must not silently activate App Check;
// enforcement should only be enabled after the Firebase Console configuration
// has been verified and traffic has been monitored.
if (
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_ENABLE_APP_CHECK === 'true' &&
  process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY
) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(process.env.NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
  } catch (error) {
    console.warn('[Secret Sharz] App Check is not active:', error?.message || error);
  }
}

export const auth = getAuth(app);
export const db = firestore;
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });
