import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AboutUs from '../src/AboutUs';
import Header from '../src/Header';
import Footer from '../src/Footer';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

export default function AboutPage() {
  const router = useRouter();
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

  const navigate = (path) => router.push(path);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserData(null);
    router.push('/');
  };

  const isAdmin = userData?.role === 'super_admin' || currentUser?.email?.toLowerCase() === 'antonio.antonio.noronha@gmail.com';

  return (
    <>
      <Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />
      <main id="main-content">
        <AboutUs navigate={navigate} />
      </main>
      <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={() => {}} />
    </>
  );
}
