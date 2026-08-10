import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Header from './Header';
import Footer from './Footer';
import { auth, db } from './firebase';

/**
 * Canonical shell for public Secret Sharz routes.
 *
 * Public pages should not implement their own global header/auth/footer.
 * Keeping that contract here prevents the old client-side App router from
 * producing duplicate shells while routes are progressively migrated.
 */
export default function PublicShell({ children, title, description }) {
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
    await router.push('/');
  };

  const isAdmin = userData?.role === 'super_admin' || currentUser?.email?.toLowerCase() === 'antonio.antonio.noronha@gmail.com';

  return (
    <>
      <Head>
        {title ? <title>{title}</title> : null}
        {description ? <meta name="description" content={description} /> : null}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>
      <Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />
      <main id="main-content">{children({ navigate, currentUser, userData, isAdmin })}</main>
      <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={() => {}} />
    </>
  );
}
