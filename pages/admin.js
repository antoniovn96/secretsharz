import React, { Component, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../src/firebase';
import { doc, getDoc } from 'firebase/firestore';
import SuperAdminView from '../src/dashboards/admin/SuperAdminView';

const MASTER_EMAIL = 'antonio.antonio.noronha@gmail.com';

class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[Secret Sharz] Admin UI rendering error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    const message = this.state.error?.message || 'An unexpected error prevented this Admin screen from rendering.';
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'system-ui' }}>
        <div style={{ width: 'min(680px, 100%)', border: '1px solid #303030', borderRadius: 16, padding: 28, background: '#151515', boxShadow: '0 20px 60px rgba(0,0,0,.35)' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', background: '#fff', color: '#000', fontWeight: 800, marginBottom: 16 }}>!</div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Admin screen could not be rendered</h1>
          <p style={{ color: '#aaa', lineHeight: 1.6, marginTop: 10 }}>The page encountered a client-side rendering error. Your session and data have not been deleted.</p>
          <details style={{ marginTop: 16, color: '#777' }}>
            <summary style={{ cursor: 'pointer', color: '#aaa' }}>Technical details</summary>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, marginTop: 10 }}>{message}</pre>
          </details>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button onClick={this.handleRetry} style={{ border: 0, borderRadius: 10, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>Try again</button>
            <button onClick={() => window.location.reload()} style={{ border: '1px solid #333', background: '#111', color: '#fff', borderRadius: 10, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}>Reload Admin</button>
          </div>
        </div>
      </div>
    );
  }
}

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
    <AdminErrorBoundary>
      <SuperAdminView
        user={state.user}
        userData={state.userData}
        onBackToApp={() => window.location.replace('/')}
      />
    </AdminErrorBoundary>
  );
}
