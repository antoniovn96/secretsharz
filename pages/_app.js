import React, { Suspense, useEffect, useRef } from 'react';
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

      if (wasAuthenticated.current && isProtectedPath(pathname)) {
        window.location.replace('/');
        return;
      }

      if (!wasAuthenticated.current && isProtectedPath(pathname) && pathname !== '/auth') {
        window.location.replace('/auth');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, handleAuthState);
    return unsubscribe;
  }, []);

  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FDFCFA',
            color: '#33443A',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
          }}
        >
          Taking you to your space…
        </div>
      }
    >
      <Component {...pageProps} />
    </Suspense>
  );
}
