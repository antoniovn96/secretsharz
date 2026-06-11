// ─────────────────────────────────────────────────────────────
//  firebase.js  —  VidyaVantage / Secret Sharz
//  INSTRUCTIONS: Replace the values below with YOUR Firebase
//  project config (from Firebase Console > Project Settings)
// ─────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ⚠️  REPLACE THESE WITH YOUR REAL VALUES FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const db       = getFirestore(app);
export const storage  = getStorage(app);
export const googleProvider   = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Customise Google login prompt
googleProvider.setCustomParameters({ prompt: "select_account" });
