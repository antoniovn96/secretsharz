import React, { useEffect, useState } from 'react';
import SecretSharzApp from '../src/App';
import FoundationHomepage from '../src/FoundationHomepage';
import Header from '../src/Header';
import Footer from '../src/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

function usePathname() {
  const [path, setPath] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname));

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  return path;
}

export default function IndexPage() {
  const path = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null);
      if (!user) {
        setUserData(null);
        return;
      }
      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        setUserData(snapshot.exists() ? snapshot.data() : null);
      } catch (_) {
        setUserData(null);
      }
    });
    return unsubscribe;
  }, []);

  const navigate = (nextPath) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === nextPath) return;
    window.history.pushState({}, '', nextPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  if (path !== '/') {
    return <SecretSharzApp />;
  }

  const isAdmin = userData?.role === 'super_admin';
  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <>
      <Header
        navigate={navigate}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isAdmin={isAdmin}
      />
      <FoundationHomepage navigate={navigate} currentUser={currentUser} />
      <Footer
        navigate={navigate}
        currentUser={currentUser}
        handleLogout={handleLogout}
        setModal={() => {}}
      />
    </>
  );
}
