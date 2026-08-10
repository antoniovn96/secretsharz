import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CollegesPage from '../src/CollegesPage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

export default function CollegesRoute() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState(null);
  const [userData, setUserData] = React.useState(null);

  React.useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null);
      if (!user) {
        setUserData(null);
        return;
      }
      const snapshot = await getDoc(doc(db, 'users', user.uid));
      setUserData(snapshot.exists() ? snapshot.data() : null);
    });
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
      <Head>
        <title>College Explorer | VidyaVantage | Secret Sharz</title>
        <meta name="description" content="Explore colleges and discover personalised matches through the Secret Sharz career ecosystem." />
      </Head>
      <CollegesPage
        navigate={navigate}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isAdmin={isAdmin}
        setModal={() => {}}
        userData={userData}
      />
    </>
  );
}
