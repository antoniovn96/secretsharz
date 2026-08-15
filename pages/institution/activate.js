import React, { useEffect, useState } from 'react';
import SecureAuthPage from '../../src/SecureAuthPage';
import { auth } from '../../src/firebase';

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc', padding: '32px 18px', fontFamily: 'Plus Jakarta Sans, Arial, sans-serif' },
  shell: { maxWidth: 720, margin: '0 auto' },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 24, padding: 30, boxShadow: '0 18px 55px rgba(15,23,42,.08)' },
  input: { width: '100%', padding: '14px 15px', border: '1px solid #cbd5e1', borderRadius: 12, fontSize: 18, letterSpacing: 1.5, textTransform: 'uppercase', outline: 'none', boxSizing: 'border-box' },
  button: { width: '100%', marginTop: 12, border: 0, borderRadius: 12, padding: '14px 16px', background: '#0f172a', color: '#fff', fontWeight: 900, fontSize: 15, cursor: 'pointer' },
};

export default function InstitutionActivatePage() {
  const [user, setUser] = useState(auth.currentUser);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((nextUser) => {
      setUser(nextUser || null);
      setAuthReady(true);
    });
    return unsubscribe;
  }, []);

  const activate = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    const normalized = code.trim().toUpperCase();
    if (!normalized) return setError('Enter the institution coordinator code.');
    if (!auth.currentUser) return setError('Please sign in first.');

    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken(true);
      const response = await fetch('/api/institution/activate-coordinator', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalized }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to activate institution access.');

      await auth.currentUser.getIdToken(true);
      setMessage(payload.message || 'Institution access activated.');
      window.setTimeout(() => { window.location.href = '/dashboard/institution/career'; }, 700);
    } catch (err) {
      setError(err.message || 'Unable to activate institution access.');
    } finally {
      setLoading(false);
    }
  };

  if (!authReady) return <div style={styles.page}><div style={styles.shell}><div style={styles.card}>Checking your account…</div></div></div>;

  if (!user) {
    return (
      <SecureAuthPage onAuthSuccess={() => { window.location.reload(); }} />
    );
  }

  return (
    <main style={styles.page}>
      <div style={styles.shell}>
        <div style={{ ...styles.card, marginBottom: 14 }}>
          <div style={{ color: '#4f46e5', fontSize: 11, fontWeight: 900, letterSpacing: 1.5 }}>VIDYAVANTAGE · INSTITUTIONAL ACCESS</div>
          <h1 style={{ margin: '8px 0 8px', color: '#0f172a', fontSize: 32 }}>Activate Institution Dashboard</h1>
          <p style={{ margin: 0, color: '#64748b', lineHeight: 1.7 }}>
            You are signed in as <strong>{user.email}</strong>. Enter the unique institution code supplied by Secret Sharz to connect this account to your institution.
          </p>
        </div>

        <form onSubmit={activate} style={styles.card}>
          {error && <div style={{ padding: 12, borderRadius: 10, background: '#fef2f2', color: '#991b1b', fontWeight: 700, marginBottom: 14 }}>{error}</div>}
          {message && <div style={{ padding: 12, borderRadius: 10, background: '#ecfdf5', color: '#166534', fontWeight: 700, marginBottom: 14 }}>{message}</div>}
          <label style={{ display: 'block', color: '#334155', fontSize: 13, fontWeight: 800, marginBottom: 7 }}>Institution Coordinator Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="SSZ-INSTITUTION-26-XXXXXX" style={styles.input} autoComplete="off" />
          <button disabled={loading} type="submit" style={{ ...styles.button, opacity: loading ? .6 : 1 }}>{loading ? 'Activating access…' : 'Activate Institution Dashboard'}</button>
          <p style={{ margin: '14px 0 0', color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>
            The coordinator is the institution's authorised dashboard user. The Coordinator Dashboard and Institution Dashboard are the same workspace; they are not separate dashboards. Institutional access is separate from student assessment access.
          </p>
        </form>
      </div>
    </main>
  );
}
