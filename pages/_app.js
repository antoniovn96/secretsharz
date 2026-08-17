import React, { Suspense, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../src/firebase';
import CareerResultsPage from '../src/dashboards/student/CareerResultsPage';
import CareerBookingPage from '../src/dashboards/student/CareerBookingPage';
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
  const [pathname, setPathname] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : '/'));

  useEffect(() => {
    const syncPath = () => setPathname(window.location.pathname);
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      syncPath();
      window.dispatchEvent(new Event('secretsharz:navigation'));
      return result;
    };
    window.history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      syncPath();
      window.dispatchEvent(new Event('secretsharz:navigation'));
      return result;
    };

    window.addEventListener('popstate', syncPath);
    window.addEventListener('secretsharz:navigation', syncPath);
    syncPath();

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', syncPath);
      window.removeEventListener('secretsharz:navigation', syncPath);
    };
  }, []);

  useEffect(() => {
    const handleAuthState = (user) => {
      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      if (user) {
        wasAuthenticated.current = true;
        return;
      }
      if (wasAuthenticated.current && isProtectedPath(currentPath)) {
        window.location.replace('/');
        return;
      }
      if (!wasAuthenticated.current && isProtectedPath(currentPath) && currentPath !== '/auth') {
        window.location.replace('/auth');
      }
    };
    const unsubscribe = onAuthStateChanged(auth, handleAuthState);
    return unsubscribe;
  }, []);

  const isCareerResultsRoute = pathname === '/dashboard/career/results';
  const isCareerBookingRoute = pathname === '/dashboard/career/book';

  return (
    <Suspense
      fallback={
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#FDFCFA',color:'#33443A',fontFamily:"'Plus Jakarta Sans', sans-serif",fontWeight:700}}>
          Taking you to your space…
        </div>
      }
    >
      {isCareerResultsRoute ? <CareerResultsPage /> : isCareerBookingRoute ? <CareerBookingPage /> : <Component {...pageProps} />}
    </Suspense>
  );
}
