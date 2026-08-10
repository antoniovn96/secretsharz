import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../src/Header';
import Footer from '../src/Footer';
import FoundationHomepage from '../src/FoundationHomepage';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

export default function IndexPage() {
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

  const navigate = (path) => {
    if (typeof window !== 'undefined') window.location.assign(path);
  };

  const isAdmin = userData?.role === 'super_admin' || currentUser?.email?.toLowerCase() === 'antonio.antonio.noronha@gmail.com';

  const handleLogout = async () => {
    await auth.signOut();
    setCurrentUser(null);
    setUserData(null);
    navigate('/');
  };

  return (
    <>
      <Head>
        <title>Secret Sharz | Anonymous Emotional Safe Space & Career Discovery</title>
        <meta name="description" content="Secret Sharz helps young people find emotional breathing room, practical wellbeing tools and clearer career direction in one safe ecosystem." />
        <link rel="canonical" href="https://www.secretsharz.com/" />
      </Head>
      <Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />
      <main id="main-content">
        <FoundationHomepage navigate={navigate} currentUser={currentUser} />
      </main>
      <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={() => {}} />
    </>
  );
}
