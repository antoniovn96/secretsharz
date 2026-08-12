import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../src/firebase';
import { doc, getDoc } from 'firebase/firestore';
import SuperAdminView from '../src/dashboards/admin/SuperAdminView';

const MASTER_EMAIL = 'antonio.antonio.noronha@gmail.com';

export default function AdminPage() {
  const [state, setState] = useState({ loading: true, user: null, userData: null, denied: false });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.replace('/auth');
        return;
      }

      const isFounder = user.email?.toLowerCase() === MASTER_EMAIL;
      if (isFounder) {
        setState({ loading: false, user, userData: { role: 'super_admin' }, denied: false });
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        const userData = snapshot.exists() ? snapshot.data() : null;
        if (userData?.role !== 'super_admin') {
          setState({ loading: false, user, userData, denied: true });
          return;
        }
        setState({ loading: false, user, userData, denied: false });
      } catch (error) {
        console.error('[Secret Sharz] Admin authorization lookup failed:', error);
        setState({ loading: false, user, userData: null, denied: true });
      }
    });
    return unsubscribe;
  }, []);

  if (state.loading) {
    return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui', color: '#334155' }}>Opening Admin Command Center…</div>;
  }

  if (state.denied) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui', color: '#334155', padding: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Access denied</h1>
          <p>Your account does not have Super Admin access.</p>
          <button onClick={() => signOut(auth).then(() => window.location.replace('/'))}>Return to Secret Sharz</button>
        </div>
      </div>
    );
  }

  return (
    <SuperAdminView
      user={state.user}
      userData={state.userData}
      onBackToApp={() => window.location.replace('/')}
    />
  );
}
