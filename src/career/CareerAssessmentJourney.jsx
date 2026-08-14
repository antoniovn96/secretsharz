import React, { useCallback, useEffect, useState } from 'react';
import CareerAssessmentV2 from './CareerAssessmentV2';
import CareerAssessmentResult from './CareerAssessmentResult';

const STORAGE_KEY = 'vidyavantage_career_assessment_attempt';

export default function CareerAssessmentJourney({ currentUser, studentData, onExit }) {
  const [view, setView] = useState('assessment');
  const [attemptId, setAttemptId] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const firebaseUser = currentUser?.firebaseUser || currentUser;
  const userId = firebaseUser?.uid || currentUser?.uid || null;

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
    if (!finalizeResponse.ok) {
      const payload = await finalizeResponse.json().catch(() => ({}));
      throw new Error(payload.error || 'Your assessment was saved, but the result could not be generated yet.');
    }

    const data = await finalizeResponse.json();
    setResult(data.result);
    setView('result');
  };

  const unlock = async () => {
    if (!attemptId) return;
    setError('');
    try {
      const token = await authToken();
      const response = await fetch('/api/payments/career-assessment/create-checkout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentAttemptId: attemptId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to start payment.');
      window.location.assign(data.checkoutUrl);
    } catch (err) { setError(err.message || 'Unable to start payment.'); }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your career journey…</div>;

  if (view === 'result' && result) {
    return <>
      {error && <div className="mx-auto max-w-5xl px-5 pt-5 text-sm text-red-600">{error}</div>}
      <CareerAssessmentResult result={result} onUnlock={unlock} onExit={onExit} />
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
