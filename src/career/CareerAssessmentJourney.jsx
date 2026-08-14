import React, { useCallback, useEffect, useState } from 'react';
import CareerAssessmentV2 from './CareerAssessmentV2';
import CareerAssessmentResult from './CareerAssessmentResult';
import { startCareerAssessmentCheckout } from './careerAssessmentPayment';

const STORAGE_KEY = 'vidyavantage_career_assessment_attempt';

export default function CareerAssessmentJourney({ currentUser, studentData, onExit }) {
  const [view, setView] = useState('assessment');
  const [attemptId, setAttemptId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const userId = currentUser?.firebaseUser?.uid || currentUser?.uid || null;

  const authToken = useCallback(async () => {
    const user = currentUser?.firebaseUser || currentUser;
    if (!user?.getIdToken) throw new Error('Please sign in again to continue.');
    return user.getIdToken();
  }, [currentUser]);

  const loadState = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = await authToken();
      const response = await fetch('/api/career/assessment/current', { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error('Unable to load your assessment.');
      const data = await response.json();
      setAttemptId(data.attempt?.attemptId || null);
      setResult(data.result || null);
      if (data.result) setView('result');
    } catch (err) {
      setError(err.message || 'Unable to load your assessment.');
      try {
        const cached = window.localStorage.getItem(STORAGE_KEY);
        if (cached) setAttemptId(JSON.parse(cached).attemptId || null);
      } catch (_) {}
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => { loadState(); }, [loadState]);

  const handleComplete = async ({ attemptId: completedAttemptId }) => {
    setAttemptId(completedAttemptId);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ attemptId: completedAttemptId })); } catch (_) {}
    const token = await authToken();
    const finalizeResponse = await fetch(`/api/career/assessment/${encodeURIComponent(completedAttemptId)}/result`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const payload = await finalizeResponse.json().catch(() => ({}));
    if (!finalizeResponse.ok) throw new Error(payload.error || 'Your assessment was saved, but the result could not be generated yet.');
    setResult(payload.result);
    setView('result');
  };

  const unlock = async () => {
    if (!attemptId) return;
    setError('');
    try {
      await startCareerAssessmentCheckout(attemptId);

      // Razorpay's client callback confirms payment submission, while the
      // server-side webhook is the source of truth for granting the entitlement.
      // Poll briefly so the UI updates as soon as the webhook marks the attempt paid.
      const token = await authToken();
      for (let i = 0; i < 12; i += 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = await fetch(`/api/career/assessment/${encodeURIComponent(attemptId)}/result`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) continue;
        const data = await response.json();
        if (data.result?.access === 'full' || data.result?.resultAccess === 'full') {
          setResult(data.result);
          setView('result');
          return;
        }
      }

      // If the webhook is still processing, reload the normal journey state.
      await loadState();
      setError('Payment was received. Your comprehensive report may take a moment to unlock. Please refresh if it does not appear shortly.');
    } catch (err) {
      throw err;
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your career journey…</div>;

  if (view === 'result' && result) {
    return <>
      {error && <div className="mx-auto max-w-5xl px-5 pt-5 text-sm text-red-600">{error}</div>}
      <CareerAssessmentResult result={result} assessmentAttemptId={attemptId} onUnlock={unlock} onExit={onExit} />
    </>;
  }

  return <>
    {error && <div className="mx-auto max-w-5xl px-5 pt-5 text-sm text-amber-700">{error}</div>}
    <CareerAssessmentV2
      userId={userId}
      studentData={studentData}
      existingAttemptId={attemptId}
      onBack={onExit}
      onComplete={handleComplete}
    />
  </>;
}
