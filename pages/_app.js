import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/firebase';
import '../styles/globals.css';
import '../src/styles/StudentDashboard.css';

const PROTECTED_PATHS = [
  '/dashboard',
  '/counsellor-dashboard',
  '/counsellor/student/',
  '/provider/',
  '/admin',
];

function isProtectedPath(pathname) {
  return PROTECTED_PATHS.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`) || pathname.startsWith(prefix));
}

export default function App({ Component, pageProps }) {
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    const handleAuthState = (user) => {
      const pathname = window.location.pathname.replace(/\/+$/, '') || '/';

      if (user) {
        wasAuthenticated.current = true;
        return;
      }

      // If a signed-in client has just logged out, always leave the protected
      // dashboard route immediately. The legacy client-side router can briefly
      // keep the old pathname while Firebase propagates the signed-out state.
      if (wasAuthenticated.current && isProtectedPath(pathname)) {
        window.location.replace('/');
        return;
      }

      // Also protect direct visits to private URLs while already signed out.
      // The auth page is the correct entry point for an unauthenticated client.
      if (!wasAuthenticated.current && isProtectedPath(pathname) && pathname !== '/auth') {
        window.location.replace('/auth');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthState);
    return unsubscribe;
  }, []);

  return <Component {...pageProps} />;
}
