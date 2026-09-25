import React, { useEffect, useState } from 'react';
import RiasecInterestExplorerV1 from '../../../../src/career/RiasecInterestExplorerV1';
import { auth } from '../../../../src/firebase';
import {
  submitRiasecAssessmentV1ToServer,
  getLatestRiasecAssessmentV1FromServer,
} from '../../../../src/career/riasecAssessmentClient';
import { getProfileIdentity } from '../../../../src/platform/profileIdentity';

export default function RiasecV1AssessmentPage() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [profile, setProfile] = useState({});
  const [status, setStatus] = useState('loading');
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((nextUser) => {
      setUser(nextUser);
      if (nextUser) setStatus('ready');
      else setStatus('signed_out');
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) return;
      try {
        const result = await getLatestRiasecAssessmentV1FromServer();
        if (!cancelled && result) setSaved(result);
      } catch {
        if (!cancelled) setSaved(null);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (!user) {
    return (
      <main style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: 32 }}>
        <section style={{ maxWidth: 600, padding: 28, border: '1px solid #e2e8f0', borderRadius: 18, background: '#fff' }}>
          <h1 style={{ marginTop: 0 }}>Sign in required</h1>
          <p style={{ color: '#64748b', lineHeight: 1.6 }}>
            The RIASEC V1 migration assessment is available only inside an authenticated Secret Sharz account.
          </p>
        </section>
      </main>
    );
  }

  const identity = getProfileIdentity(user, profile);

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {status === 'saving' && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 50, padding: '10px 14px', borderRadius: 12, background: '#0f172a', color: '#fff', fontWeight: 800 }}>
          Saving securely…
        </div>
      )}

      {error && (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '18px 16px 0' }}>
          <div style={{ padding: 14, borderRadius: 12, background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', fontWeight: 700 }}>
            {error}
          </div>
        </div>
      )}

      {saved && status !== 'saving' ? (
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '24px 16px 0' }}>
          <div style={{ padding: 18, borderRadius: 16, border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#166534' }}>
            Your latest RIASEC V1 result is already stored in the assessment system. Completing the assessment again will create a new historical attempt rather than replacing the old one.
          </div>
        </div>
      ) : null}

      <RiasecInterestExplorerV1
        context={{
          personId: user.uid,
          accountId: null,
          audience: 'student',
          studentStage: profile?.grade || null,
          contextSnapshot: {
            studentName: identity.name,
            studentStage: profile?.grade || null,
          },
        }}
        onComplete={async ({ answers, result }) => {
          if (status === 'saving') return;
          setStatus('saving');
          setError('');
          try {
            const response = await submitRiasecAssessmentV1ToServer({
              answers,
              startedAt: result.startedAt,
              previousAssessmentResultId: saved?.assessmentResultId || null,
              attemptNumber: saved ? 2 : 1,
              studentStage: profile?.grade || null,
            });
            setSaved(response);
            setStatus('saved');
          } catch (err) {
            setStatus('error');
            setError(err?.message || 'Unable to save the assessment.');
          }
        }}
      />
    </main>
  );
}
