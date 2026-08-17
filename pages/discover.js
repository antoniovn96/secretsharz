import React, { useEffect, useState } from 'react';
import InstitutionalDiscoveryHub from '../src/InstitutionalDiscoveryHub';
import Header from '../src/Header';
import Footer from '../src/Footer';
import { readJourneyContext } from '../src/journeyContext';
import { auth, db } from '../src/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const MASTER_EMAIL = 'antonio.antonio.noronha@gmail.com';

export default function DiscoverPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [journeyContext, setJourneyContext] = useState(null);

  useEffect(() => {
    setJourneyContext(readJourneyContext());
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

  const navigate = (path) => {
    if (typeof window === 'undefined') return;
    if (window.location.pathname === path) return;
    window.location.href = path;
  };

  const handleLogout = async () => {
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    navigate('/');
  };

  const isAdmin = currentUser?.email?.toLowerCase() === MASTER_EMAIL || userData?.role === 'super_admin';

  return (
    <>
      <Header
        navigate={navigate}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isAdmin={isAdmin}
      />
      <InstitutionalDiscoveryHub
        navigate={navigate}
        journeyContext={journeyContext}
      />
      <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={() => {}} />
    </>
  );
}
