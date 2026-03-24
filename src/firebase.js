// ─────────────────────────────────────────────────────────────
//  firebase.js  —  VidyaVantage / Secret Sharz
//  INSTRUCTIONS: Replace the values below with YOUR Firebase
//  project config (from Firebase Console > Project Settings)
// ─────────────────────────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️  REPLACE THESE WITH YOUR REAL VALUES FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey:            "AIzaSyBblimAT7YQtPS4YhKBh1UXttn46xlfH2g",
  authDomain:        "secretsharz-f9aed.firebaseapp.com",
  projectId:         "secretsharz-f9aed",
  storageBucket:     "secretsharz-f9aed.firebasestorage.app",
  messagingSenderId: "893563102389",
  appId:             "1:893563102389:web:f0668450e8a7c3732f8afc",
};

const app      = initializeApp(firebaseConfig);
export const auth     = getAuth(app);
export const db       = getFirestore(app);
export const googleProvider   = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Customise Google login prompt
googleProvider.setCustomParameters({ prompt: "select_account" });
