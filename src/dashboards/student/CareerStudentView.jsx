import React, { useEffect, useMemo, useState } from 'react';
import CareerAssessment from '../../CareerAssessment';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const REPORT_PRICE_FALLBACK = 999;

function pathToView(pathname) {
  const path = pathname || '';
  if (path.includes('/dashboard/career/assessment')) return 'assessment';
  if (path.includes('/dashboard/career/results/full')) return 'full';
  if (path.includes('/dashboard/career/payment')) return 'payment';
  if (path.includes('/dashboard/career/results')) return 'results';
  return 'home';
}

function pushPath(path) {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', path);
  window.scrollTo(0, 0);
}

function moneyFromPaise(paise) {
  return Math.round(Number(paise || REPORT_PRICE_FALLBACK * 100) / 100);
}

function normaliseStoredResults(data) {
  if (!data) return null;
  const assessment = data.careerAssessment || {};
  const code = assessment.hollandCode || data.riasecCode || '';
  return {
    hollandCode: Array.isArray(code) ? code : String(code).split('').filter(Boolean),
    riasecScores: assessment.riasecScores || data.riasecScores || {},
    streams: assessment.streams || (data.recommendedStream ? [{ id: data.recommendedStream }] : []),
    top5Careers: assessment.top5Careers || data.topCareerMatches || [],
    maturityPct: Number(assessment.maturityPct ?? data.maturityPct ?? 0),
    profile: assessment.profile || {},
    completedAt: assessment.completedAt || data.assessmentCompletedAt || null,
  };
}

function AssessmentHeader({ title, subtitle }) {
  return (
    <div style={{ background: '#0f172a', color: 'white', padding: '28px 32px', borderRadius: '20px', marginBottom: '24px' }}>
      <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#f59e0b', marginBottom: '8px' }}>VidyaVantage Career Intelligence</div>
      <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900 }}>{title}</h1>
      <p style={{ margin: '8px 0 0', color: '#cbd5e1', fontSize: '15px' }}>{subtitle}</p>
    </div>
  );
}

function PartialResults({ result, name, onFullReport, onRetake }) {
  const code = (result?.hollandCode || []).join('') || '—';
  const scores = Object.entries(result?.riasecScores || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
  const stream = result?.streams?.[0]?.id || 'Pending';
  const careers = (result?.top5Careers || []).slice(0, 3);

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
      <AssessmentHeader
        title={`${name || 'Your'} Career Results Are Ready`}
        subtitle="This is your complimentary Career Discovery preview. Your full personalised report is one step away."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, .6fr)', gap: '20px' }}>
        <div style={{ background: 'white', borderRadius: '18px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(15,23,42,.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Your Holland Code</div>
              <div style={{ fontSize: '46px', lineHeight: 1, fontWeight: 950, letterSpacing: '8px', color: '#4f46e5', marginTop: '8px' }}>{code}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 700 }}>Recommended Stream</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', marginTop: '5px' }}>{stream}</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '14px' }}>RIASEC PROFILE</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {scores.length ? scores.map(([key, value]) => (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '5px' }}><span>{key}</span><span>{Number(value)}%</span></div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}><div style={{ width: `${Math.max(0, Math.min(100, Number(value)))}%`, height: '100%', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', borderRadius: '999px' }} /></div>
                </div>
              )) : <div style={{ color: '#64748b' }}>Your score breakdown will appear here.</div>}
            </div>
          </div>
        </div>

        <div style={{ background: '#111827', color: 'white', borderRadius: '18px', padding: '28px', boxShadow: '0 12px 35px rgba(15,23,42,.16)' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '1px' }}>🔒 Full Report Locked</div>
          <h2 style={{ margin: '10px 0', fontSize: '25px', fontWeight: 900 }}>See the complete career picture</h2>
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.7 }}>Your preview gives you the headline findings. The full report turns them into a detailed, actionable career roadmap.</p>
          <div style={{ display: 'grid', gap: '9px', margin: '20px 0' }}>
            {['Detailed personality interpretation', 'Career-by-career suitability analysis', 'Stream, course and pathway mapping', 'College and next-step guidance', 'Personalised career roadmap'].map(item => <div key={item} style={{ fontSize: '13px', color: '#e2e8f0' }}>✓ {item}</div>)}
          </div>
          <button onClick={onFullReport} style={{ width: '100%', border: 0, borderRadius: '12px', padding: '14px 16px', background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: 'white', fontWeight: 900, cursor: 'pointer' }}>🔓 View Full Report</button>
          <button onClick={onRetake} style={{ width: '100%', border: '1px solid #475569', borderRadius: '12px', padding: '11px 16px', background: 'transparent', color: '#cbd5e1', fontWeight: 700, cursor: 'pointer', marginTop: '10px' }}>Retake Assessment</button>
        </div>
      </div>

      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '26px', marginTop: '20px' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>Top Career Matches — Preview</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          {careers.length ? careers.map((career, index) => (
            <div key={`${career.name || career.title || 'career'}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', padding: '15px 16px', background: '#f8fafc', borderRadius: '12px' }}>
              <div><div style={{ fontWeight: 800, color: '#0f172a' }}>{career.name || career.title}</div><div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>{career.stream || 'Career pathway'}</div></div>
              {career.matchScore != null && <div style={{ fontWeight: 900, color: '#4f46e5' }}>{career.matchScore}%</div>}
            </div>
          )) : <div style={{ color: '#64748b' }}>Your detailed career matches are included in the full report.</div>}
        </div>
      </div>
    </div>
  );
}

function PaymentPage({ currentUser, onBack, onVerified }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scriptReady, setScriptReady] = useState(false);
  const price = moneyFromPaise(process.env.NEXT_PUBLIC_CAREER_REPORT_PRICE_PAISE || REPORT_PRICE_FALLBACK * 100);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.Razorpay) {
      setScriptReady(true);
      return undefined;
    }
    const existing = document.querySelector('script[data-razorpay-checkout]');
    if (existing) {
      existing.addEventListener('load', () => setScriptReady(true));
      return () => existing.removeEventListener('load', () => setScriptReady(true));
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => setScriptReady(true);
    script.onerror = () => setError('Unable to load the payment gateway. Please try again.');
    document.body.appendChild(script);
    return () => {};
  }, []);

  const startPayment = async () => {
    setLoading(true);
    setError('');
    try {
      const user = currentUser || auth.currentUser;
      if (!user) throw new Error('Please sign in again before making payment.');
      if (!scriptReady || !window.Razorpay) throw new Error('Payment gateway is still loading. Please try again in a moment.');

      const token = await user.getIdToken();
      const orderResponse = await fetch('/api/career/create-order', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: 'career_full_report' })
      });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order?.error || 'Unable to start payment.');

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'VidyaVantage',
        description: 'Full Career Intelligence Report',
        order_id: order.orderId,
        prefill: { name: user.displayName || '', email: user.email || '' },
        theme: { color: '#4f46e5' },
        modal: { ondismiss: () => setLoading(false) },
        handler: async (response) => {
          try {
            const verifyToken = await user.getIdToken(true);
            const verifyResponse = await fetch('/api/career/verify-payment', {
              method: 'POST',
              headers: { Authorization: `Bearer ${verifyToken}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });
            const verification = await verifyResponse.json();
            if (!verifyResponse.ok || !verification?.verified) throw new Error(verification?.error || 'Payment could not be verified.');
            onVerified();
          } catch (verificationError) {
            setError(verificationError.message || 'Payment verification failed. Please contact support before paying again.');
            setLoading(false);
          }
        }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', response => {
        setError(response?.error?.description || 'Payment failed. Please try again.');
        setLoading(false);
      });
      razorpay.open();
    } catch (err) {
      setError(err.message || 'Unable to start payment.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <AssessmentHeader title="Unlock Your Full Career Report" subtitle="Secure checkout powered by Razorpay. Your report unlocks only after the payment is verified on the server." />
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '34px', boxShadow: '0 10px 35px rgba(15,23,42,.07)' }}>
        <div style={{ textAlign: 'center', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>VidyaVantage Career Intelligence Report</div>
          <div style={{ fontSize: '44px', fontWeight: 950, color: '#0f172a', margin: '10px 0 2px' }}>₹{price.toLocaleString('en-IN')}</div>
          <div style={{ color: '#64748b', fontSize: '13px' }}>One-time payment</div>
        </div>
        <div style={{ display: 'grid', gap: '13px', margin: '25px 0' }}>
          {['Complete RIASEC interpretation', 'Detailed career suitability analysis', 'Stream + course + pathway mapping', 'College and next-step guidance', 'Personalised career roadmap', 'Full report access from your dashboard'].map(item => <div key={item} style={{ padding: '13px 15px', borderRadius: '10px', background: '#f8fafc', color: '#334155', fontWeight: 700, fontSize: '14px' }}>✓ {item}</div>)}
        </div>
        {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '10px', padding: '13px 15px', marginBottom: '15px', fontSize: '13px', fontWeight: 700 }}>{error}</div>}
        <button onClick={startPayment} disabled={loading} style={{ width: '100%', border: 0, borderRadius: '12px', padding: '16px', background: loading ? '#94a3b8' : 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: 'white', fontWeight: 900, fontSize: '16px', cursor: loading ? 'wait' : 'pointer' }}>{loading ? 'Processing…' : `Pay ₹${price.toLocaleString('en-IN')} & Unlock Report`}</button>
        <button onClick={onBack} disabled={loading} style={{ width: '100%', border: 0, background: 'transparent', color: '#64748b', padding: '12px', marginTop: '8px', fontWeight: 700, cursor: 'pointer' }}>← Back to Results</button>
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '11px', marginTop: '12px' }}>Payment details are verified server-side before report access is granted.</div>
      </div>
    </div>
  );
}

function FullReport({ result, name, onBack }) {
  const code = (result?.hollandCode || []).join('') || '—';
  const scores = Object.entries(result?.riasecScores || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
  const careers = result?.top5Careers || [];
  const streams = result?.streams || [];
  const profile = result?.profile || {};

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
      <AssessmentHeader title={`${name || 'Your'} Full Career Intelligence Report`} subtitle="Your assessment findings, interpreted into practical career direction." />
      <div style={{ display: 'grid', gap: '20px' }}>
        <section style={{ background: 'white', borderRadius: '18px', padding: '28px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 800, letterSpacing: '1px' }}>1 · CAREER IDENTITY</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginTop: '8px', gap: '20px' }}><div><div style={{ fontSize: '50px', fontWeight: 950, letterSpacing: '8px', color: '#4f46e5' }}>{code}</div><div style={{ color: '#64748b', fontSize: '13px' }}>Three-letter Holland / RIASEC code</div></div><div style={{ textAlign: 'right' }}><div style={{ fontSize: '12px', color: '#64748b', fontWeight: 800 }}>READINESS</div><div style={{ fontSize: '28px', fontWeight: 950, color: '#0f172a' }}>{Number(result?.maturityPct || 0)}%</div></div></div>
        </section>

        <section style={{ background: 'white', borderRadius: '18px', padding: '28px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', marginBottom: '16px' }}>2 · RIASEC SCORE PROFILE</div>
          <div style={{ display: 'grid', gap: '13px' }}>{scores.map(([key, value]) => <div key={key}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '5px' }}><span>{key}</span><span>{Number(value)}%</span></div><div style={{ height: '10px', background: '#e2e8f0', borderRadius: '999px' }}><div style={{ width: `${Math.max(0, Math.min(100, Number(value)))}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)' }} /></div></div>)}</div>
        </section>

        <section style={{ background: 'white', borderRadius: '18px', padding: '28px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', marginBottom: '16px' }}>3 · STREAM & PATHWAY DIRECTION</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '12px' }}>{streams.map((stream, index) => <div key={`${stream.id || 'stream'}-${index}`} style={{ padding: '18px', borderRadius: '12px', background: index === 0 ? '#eef2ff' : '#f8fafc', border: index === 0 ? '1px solid #c7d2fe' : '1px solid #e2e8f0' }}><div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>{index === 0 ? 'BEST FIT' : `OPTION ${index + 1}`}</div><div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', marginTop: '5px' }}>{stream.id}</div><div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>{stream.subjects || ''}</div></div>)}</div>
        </section>

        <section style={{ background: 'white', borderRadius: '18px', padding: '28px', border: '1px solid #e2e8f0' }}>
          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 800, letterSpacing: '1px', marginBottom: '16px' }}>4 · PERSONALIZED CAREER MATCHES</div>
          <div style={{ display: 'grid', gap: '12px' }}>{careers.map((career, index) => <div key={`${career.name || career.title || 'career'}-${index}`} style={{ padding: '18px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}><div><div style={{ fontSize: '17px', fontWeight: 900, color: '#0f172a' }}>{career.name || career.title}</div><div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{career.stream || 'Career pathway'}</div></div>{career.matchScore != null && <div style={{ fontWeight: 950, color: '#4f46e5' }}>{career.matchScore}%</div>}</div>{career.desc && <p style={{ color: '#475569', fontSize: '13px', lineHeight: 1.65, margin: '10px 0 0' }}>{career.desc}</p>}</div>)}</div>
        </section>

        <section style={{ background: 'linear-gradient(135deg,#111827,#1e293b)', color: 'white', borderRadius: '18px', padding: '30px' }}>
          <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 800, letterSpacing: '1px' }}>5 · YOUR NEXT STEP</div>
          <h2 style={{ margin: '8px 0', fontSize: '25px', fontWeight: 900 }}>Turn your assessment into a roadmap.</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '14px', maxWidth: '720px' }}>Use these findings as a starting point for deeper career exploration, course research and a conversation with a qualified career counsellor.</p>
          <div style={{ marginTop: '18px', color: '#cbd5e1', fontSize: '13px' }}>Academic profile: {profile.dem_03 || 'Not specified'} · Subjects: {Array.isArray(profile.dem_04) ? profile.dem_04.join(', ') : 'Not specified'}</div>
        </section>
      </div>
      <button onClick={onBack} style={{ marginTop: '20px', border: '1px solid #cbd5e1', background: 'white', borderRadius: '12px', padding: '12px 18px', fontWeight: 800, color: '#334155', cursor: 'pointer' }}>← Back to Career Results</button>
    </div>
  );
}

const CareerStudentView = ({ studentData, currentUser }) => {
  const [view, setView] = useState(() => pathToView(typeof window !== 'undefined' ? window.location.pathname : '/dashboard/career'));
  const [liveUserData, setLiveUserData] = useState(studentData || null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessPaid, setAccessPaid] = useState(false);

  const user = currentUser || auth.currentUser;
  const dynamicName = liveUserData?.name || user?.displayName || 'Student';
  const profileImage = liveUserData?.photoURL || user?.photoURL || '';
  const profileInitial = dynamicName.trim().charAt(0).toUpperCase() || 'S';

  const go = (nextView) => {
    const paths = {
      home: '/dashboard/career',
      assessment: '/dashboard/career/assessment',
      results: '/dashboard/career/results',
      payment: '/dashboard/career/payment',
      full: '/dashboard/career/results/full'
    };
    pushPath(paths[nextView]);
    setView(nextView);
  };

  useEffect(() => {
    const onPopState = () => setView(pathToView(window.location.pathname));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const activeUser = currentUser || auth.currentUser;
      if (!activeUser) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'users', activeUser.uid));
        if (!cancelled && snap.exists()) {
          const data = snap.data();
          setLiveUserData(data);
          setAccessPaid(data?.careerReportAccess?.status === 'paid');
          const stored = normaliseStoredResults(data);
          if (stored) setAssessmentResult(stored);
        }
        if (typeof window !== 'undefined') {
          const cached = sessionStorage.getItem(`vidyavantage-career-results:${activeUser.uid}`);
          if (cached) {
            try { setAssessmentResult(JSON.parse(cached)); } catch (_) { /* ignore malformed cache */ }
          }
        }
      } catch (err) {
        console.error('[CareerStudentView] failed to load career data:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [currentUser]);

  useEffect(() => {
    if (view !== 'full' || loading) return;
    if (!accessPaid) go('payment');
  }, [view, loading, accessPaid]);

  const handleAssessmentComplete = async (computedResults) => {
    const activeUser = currentUser || auth.currentUser;
    setAssessmentResult(computedResults);
    if (typeof window !== 'undefined' && activeUser) {
      sessionStorage.setItem(`vidyavantage-career-results:${activeUser.uid}`, JSON.stringify(computedResults));
    }

    if (activeUser) {
      try {
        await setDoc(doc(db, 'users', activeUser.uid), {
          careerAssessment: {
            hollandCode: computedResults.hollandCode || [],
            riasecScores: computedResults.riasecScores || {},
            streams: computedResults.streams || [],
            top5Careers: computedResults.top5Careers || [],
            maturityPct: Number(computedResults.maturityPct || 0),
            profile: computedResults.profile || {},
            completedAt: new Date().toISOString()
          },
          assessmentCompletedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('[CareerStudentView] full assessment persistence skipped:', err?.message || err);
      }
    }
    go('results');
  };

  const hasAssessment = !!assessmentResult || !!(liveUserData?.riasecScores || liveUserData?.careerDNA?.riasec || liveUserData?.riasecCode);
  const resultForDisplay = assessmentResult || normaliseStoredResults(liveUserData);

  if (loading) {
    return <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 800 }}>Loading your career profile…</div>;
  }

  if (view === 'assessment') {
    return (
      <CareerAssessment
        onBack={() => go(hasAssessment ? 'results' : 'home')}
        onExplore={() => go('results')}
        onSaveResults={handleAssessmentComplete}
      />
    );
  }

  if (view === 'results') {
    if (!resultForDisplay) {
      go('assessment');
      return null;
    }
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '28px 24px 60px' }}>
        <PartialResults result={resultForDisplay} name={dynamicName} onFullReport={() => accessPaid ? go('full') : go('payment')} onRetake={() => go('assessment')} />
      </div>
    );
  }

  if (view === 'payment') {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '28px 24px 60px' }}>
        <PaymentPage currentUser={user} onBack={() => go('results')} onVerified={() => { setAccessPaid(true); go('full'); }} />
      </div>
    );
  }

  if (view === 'full') {
    if (!accessPaid) return null;
    if (!resultForDisplay) {
      return <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>Your report is being prepared…</div>;
    }
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '28px 24px 60px' }}>
        <FullReport result={resultForDisplay} name={dynamicName} onBack={() => go('results')} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex' }}>
      <aside style={{ width: '250px', flexShrink: 0, padding: '24px' }}>
        <div style={{ background: 'white', borderRadius: '18px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'sticky', top: '24px' }}>
          <div style={{ height: '90px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }} />
          <div style={{ padding: '0 20px 22px', marginTop: '-36px', textAlign: 'center' }}>
            {profileImage ? <img src={profileImage} alt="Profile" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white' }} /> : <div style={{ width: '72px', height: '72px', borderRadius: '50%', border: '4px solid white', background: '#e0e7ff', color: '#4338ca', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 900 }}>{profileInitial}</div>}
            <div style={{ fontWeight: 900, color: '#0f172a', fontSize: '18px', marginTop: '8px' }}>{dynamicName}</div>
            <div style={{ color: '#64748b', fontSize: '12px', marginBottom: '18px' }}>Career Guidance</div>
            <button onClick={() => go('home')} style={{ width: '100%', padding: '10px 12px', border: 0, borderRadius: '10px', background: '#eef2ff', color: '#4338ca', fontWeight: 800, cursor: 'pointer' }}>🏠 Career Home</button>
            {hasAssessment && <button onClick={() => go('results')} style={{ width: '100%', padding: '10px 12px', border: 0, borderRadius: '10px', background: 'transparent', color: '#475569', fontWeight: 700, cursor: 'pointer', marginTop: '5px' }}>📊 My Results</button>}
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '24px 28px 60px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '18px', padding: '30px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ color: '#4f46e5', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>VidyaVantage Career Discovery</div>
            <h1 style={{ margin: '8px 0', color: '#0f172a', fontSize: '34px', fontWeight: 950 }}>Your career roadmap starts here, {dynamicName}.</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '15px', lineHeight: 1.7 }}>Discover your interests, strengths, values and career direction through the detailed Career Discovery Assessment.</p>
          </div>

          {!hasAssessment ? (
            <div style={{ background: 'white', borderRadius: '18px', padding: '45px 30px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '44px', marginBottom: '12px' }}>🧭</div>
              <h2 style={{ margin: '0 0 10px', color: '#0f172a', fontSize: '24px', fontWeight: 900 }}>Discover Your Possibilities</h2>
              <p style={{ maxWidth: '650px', margin: '0 auto', color: '#64748b', lineHeight: 1.7 }}>Take the detailed VidyaVantage Career Discovery Assessment. When you submit it, you will immediately receive a personalised preview report.</p>
              <button onClick={() => go('assessment')} style={{ marginTop: '24px', border: 0, borderRadius: '12px', padding: '14px 26px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: 'white', fontWeight: 900, cursor: 'pointer' }}>Start Career Discovery →</button>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '18px', padding: '28px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                <div><div style={{ color: '#4f46e5', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>Career Intelligence Report</div><h2 style={{ margin: '5px 0', color: '#0f172a', fontSize: '24px', fontWeight: 900 }}>Your results are ready</h2><p style={{ margin: 0, color: '#64748b' }}>Holland Code: <strong>{(resultForDisplay?.hollandCode || []).join('') || liveUserData?.riasecCode || '—'}</strong></p></div>
                <button onClick={() => go('results')} style={{ border: 0, borderRadius: '11px', padding: '13px 20px', background: '#4f46e5', color: 'white', fontWeight: 900, cursor: 'pointer' }}>View Career Results →</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CareerStudentView;
