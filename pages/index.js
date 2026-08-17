import React, { useEffect, useState } from 'react';
import SecretSharzApp from '../src/App';
import FoundationHomepage from '../src/FoundationHomepage';
import FrontDoorExperience from '../src/FrontDoorExperience';
import LiveYouTubeSection from '../src/LiveYouTubeSection';
import VideoLibraryPage from '../src/VideoLibraryPage';
import SupportHub from '../src/SupportHub';
import WayfinderPage from '../src/WayfinderPage';
import SuperAdminView from '../src/dashboards/admin/SuperAdminView';
import Header from '../src/Header';
import Footer from '../src/Footer';
import AccountConsentGate from '../src/components/consent/AccountConsentGate';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDocs, getDoc, limit, query, where } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

const MASTER_EMAIL = 'antonio.antonio.noronha@gmail.com';

function usePathname() {
  const [path, setPath] = useState('/');
  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    sync();
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  return path;
}

async function hasAccountConsent(uid) {
  const consentQuery = query(collection(db, 'consentEvents'), where('userId', '==', uid), limit(100));
  const snapshot = await getDocs(consentQuery);
  return snapshot.docs.some((item) => {
    const data = item.data();
    return data.type === 'account_privacy' && data.action === 'granted' && data.policyVersion === '1.0.0';
  });
}

export default function IndexPage() {
  const path = usePathname();
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [accountConsent, setAccountConsent] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null);
      setConsentChecked(false);
      if (!user) {
        setUserData(null);
        setAccountConsent(false);
        setConsentChecked(true);
        return;
      }
      const isFounder = user.email?.toLowerCase() === MASTER_EMAIL;
      if (isFounder) {
        setUserData((prev) => ({ ...(prev || {}), role: 'super_admin' }));
        setAccountConsent(true);
        setConsentChecked(true);
        return;
      }
      try {
        const [profileSnapshot, consentGranted] = await Promise.all([
          getDoc(doc(db, 'users', user.uid)),
          hasAccountConsent(user.uid),
        ]);
        setUserData(profileSnapshot.exists() ? profileSnapshot.data() : null);
        setAccountConsent(consentGranted);
      } catch (_) {
        setUserData(null);
        setAccountConsent(false);
      } finally {
        setConsentChecked(true);
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
    const isFounder = currentUser?.email?.toLowerCase() === MASTER_EMAIL;
    if (currentUser && consentChecked && !accountConsent && !isFounder) {
      return (
        <AccountConsentGate
          user={currentUser}
          onAccepted={() => setAccountConsent(true)}
          onDecline={async () => { await signOut(auth); navigate('/'); }}
        />
      );
    }

    if (path === '/admin' || path === '/dashboard/admin') {
      const isAdmin = currentUser?.email?.toLowerCase() === MASTER_EMAIL || userData?.role === 'super_admin';
      if (!currentUser) return <SecretSharzApp />;
      if (!isAdmin) { navigate('/'); return null; }
      return <SuperAdminView user={currentUser} userData={{ ...(userData || {}), role: 'super_admin' }} onBackToApp={() => navigate('/')} />;
    }

    if (path === '/videos') {
      const isAdmin = userData?.role === 'super_admin' || currentUser?.email?.toLowerCase() === MASTER_EMAIL;
      const handleLogout = async () => { await signOut(auth); navigate('/'); };
      return (
        <>
          <Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />
          <VideoLibraryPage navigate={navigate} />
          <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={() => {}} />
        </>
      );
    }

    if (path === '/support') {
      const handleLogout = async () => { await signOut(auth); navigate('/'); };
      const isAdmin = userData?.role === 'super_admin' || currentUser?.email?.toLowerCase() === MASTER_EMAIL;
      return (
        <>
          <Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />
          <SupportHub navigate={navigate} />
          <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={() => {}} />
        </>
      );
    }

    if (path === '/start') {
      const handleLogout = async () => { await signOut(auth); navigate('/'); };
      const isAdmin = userData?.role === 'super_admin' || currentUser?.email?.toLowerCase() === MASTER_EMAIL;
      return (
        <>
          <Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />
          <WayfinderPage navigate={navigate} />
          <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={() => {}} />
        </>
      );
    }

    return <SecretSharzApp />;
  }

  const isAdmin = userData?.role === 'super_admin' || currentUser?.email?.toLowerCase() === MASTER_EMAIL;
  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  return (
    <>
      <Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />
      <FrontDoorExperience navigate={navigate} currentUser={currentUser} />
      <FoundationHomepage navigate={navigate} currentUser={currentUser} />
      <LiveYouTubeSection navigate={navigate} />
      <style>{`/* The legacy FoundationHomepage video is intentionally hidden here. The live channel feed above is the production source of truth. */ .ss-foundation-page .ss-fh-video{display:none!important}`}</style>
      <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={() => {}} />
    </>
  );
}
