import React, { useEffect, useState } from 'react';
import CareerAssessment from '../../CareerAssessment';
import CareerFullReportPage from '../../CareerFullReportPage';
import CareerProfileSettings from './CareerProfileSettings';
import CareerPaymentPanel from './CareerPaymentPanel';
import { auth, db } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function pathToView(pathname) {
  const path = pathname || '';
  if (path.includes('/dashboard/career/assessment')) return 'assessment';
  if (path.includes('/dashboard/career/results/full')) return 'full';
  if (path.includes('/dashboard/career/payment')) return 'payment';
  if (path.includes('/dashboard/career/settings')) return 'settings';
  if (path.includes('/dashboard/career/results')) return 'results';
  return 'home';
}

function pushPath(path) {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', path);
  window.scrollTo(0, 0);
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

function PartialResults({ result, firstName, onFullReport, onRetake }) {
  const code = (result?.hollandCode || []).join('') || '—';
  const scores = Object.entries(result?.riasecScores || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
  const stream = result?.streams?.[0]?.id || 'Pending';
  const careers = (result?.top5Careers || []).slice(0, 3);
  return <div style={{ maxWidth: 1040, margin: '0 auto' }}>
    <div style={{ background: '#0f172a', color: '#fff', padding: '28px 32px', borderRadius: 20, marginBottom: 24 }}><div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#f59e0b' }}>VidyaVantage Career Intelligence</div><h1 style={{ margin: 0, fontSize: 32 }}>{firstName || 'Your'} Career Results Are Ready</h1><p style={{ margin: '8px 0 0', color: '#cbd5e1' }}>This is your complimentary Career Discovery preview. Your full personalised report is one step away.</p></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(280px,.6fr)', gap: 20 }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: 28, border: '1px solid #e2e8f0' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 24 }}><div><div style={{ color: '#64748b', fontSize: 12, fontWeight: 800 }}>YOUR HOLLAND CODE</div><div style={{ fontSize: 46, fontWeight: 950, letterSpacing: 8, color: '#4f46e5', marginTop: 8 }}>{code}</div></div><div style={{ textAlign: 'right' }}><div style={{ color: '#64748b', fontSize: 12 }}>Recommended Stream</div><div style={{ fontSize: 22, fontWeight: 900, marginTop: 5 }}>{stream}</div></div></div><div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 22 }}><div style={{ fontSize: 13, fontWeight: 800, marginBottom: 14 }}>RIASEC PROFILE</div>{scores.length ? scores.map(([key, value]) => <div key={key} style={{ marginBottom: 10 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 800, marginBottom: 5 }}><span>{key}</span><span>{Number(value)}%</span></div><div style={{ height: 8, background: '#e2e8f0', borderRadius: 999 }}><div style={{ width: `${Math.max(0, Math.min(100, Number(value)))}%`, height: '100%', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', borderRadius: 999 }} /></div></div>) : <div style={{ color: '#64748b' }}>Your score breakdown will appear here.</div>}</div></div>
      <div style={{ background: '#111827', color: '#fff', borderRadius: 18, padding: 28 }}><div style={{ fontSize: 12, fontWeight: 800, color: '#fbbf24' }}>🔒 FULL REPORT LOCKED</div><h2 style={{ margin: '10px 0', fontSize: 25 }}>See the complete career picture</h2><p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>Your preview gives you the headline findings. The full report turns them into a detailed, actionable career roadmap.</p><div style={{ display: 'grid', gap: 9, margin: '20px 0' }}>{['Detailed personality interpretation','Career-by-career suitability analysis','Stream, course and pathway mapping','College and next-step guidance','Personalised career roadmap'].map(item => <div key={item} style={{ fontSize: 13 }}>✓ {item}</div>)}</div><button onClick={onFullReport} style={{ width: '100%', border: 0, borderRadius: 12, padding: 14, background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#fff', fontWeight: 900 }}>🔓 View Full Report</button><button onClick={onRetake} style={{ width: '100%', border: '1px solid #475569', borderRadius: 12, padding: 11, background: 'transparent', color: '#cbd5e1', fontWeight: 700, marginTop: 10 }}>Retake Assessment</button></div>
    </div>
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 26, marginTop: 20 }}><h3 style={{ margin: '0 0 14px', fontSize: 20 }}>Top Career Matches — Preview</h3>{careers.length ? careers.map((career, index) => <div key={`${career.name || career.title || 'career'}-${index}`} style={{ display: 'flex', justifyContent: 'space-between', padding: 15, background: '#f8fafc', borderRadius: 12, marginBottom: 10 }}><div><strong>{career.name || career.title}</strong><div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{career.stream || 'Career pathway'}</div></div>{career.matchScore != null && <strong style={{ color: '#4f46e5' }}>{career.matchScore}%</strong>}</div>) : <div style={{ color: '#64748b' }}>Your detailed career matches are included in the full report.</div>}</div>
  </div>;
}

export default function CareerStudentView({ studentData, currentUser }) {
  const [view, setView] = useState(() => pathToView(typeof window !== 'undefined' ? window.location.pathname : '/dashboard/career'));
  const [liveUserData, setLiveUserData] = useState(studentData || null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessPaid, setAccessPaid] = useState(false);
  const user = currentUser || auth.currentUser;
  const fullName = liveUserData?.name || user?.displayName || 'Student';
  const firstName = fullName.trim().split(/\s+/)[0] || 'Student';
  const profileImage = liveUserData?.photoURL || user?.photoURL || '';
  const profileInitial = firstName.charAt(0).toUpperCase() || 'S';

  const go = nextView => {
    const paths = { home: '/dashboard/career', assessment: '/dashboard/career/assessment', results: '/dashboard/career/results', payment: '/dashboard/career/payment', full: '/dashboard/career/results/full', settings: '/dashboard/career/settings' };
    pushPath(paths[nextView]); setView(nextView);
  };

  useEffect(() => { const onPopState = () => setView(pathToView(window.location.pathname)); window.addEventListener('popstate', onPopState); return () => window.removeEventListener('popstate', onPopState); }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const activeUser = currentUser || auth.currentUser;
      if (!activeUser) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, 'users', activeUser.uid));
        if (!cancelled && snap.exists()) {
          const data = snap.data(); setLiveUserData(data);
          setAccessPaid(data?.careerReportAccess?.status === 'paid' || data?.institutionAccess?.status === 'active');
          const stored = normaliseStoredResults(data); if (stored) setAssessmentResult(stored);
        }
        if (typeof window !== 'undefined') { const cached = sessionStorage.getItem(`vidyavantage-career-results:${activeUser.uid}`); if (cached) { try { setAssessmentResult(JSON.parse(cached)); } catch (_) {} } }
      } catch (err) { console.error('[CareerStudentView] failed to load career data:', err); }
      finally { if (!cancelled) setLoading(false); }
    };
    load(); return () => { cancelled = true; };
  }, [currentUser]);

  useEffect(() => { if (view === 'full' && !loading && !accessPaid) go('payment'); }, [view, loading, accessPaid]);

  const handleAssessmentComplete = async computedResults => {
    const activeUser = currentUser || auth.currentUser;
    setAssessmentResult(computedResults);
    if (typeof window !== 'undefined' && activeUser) sessionStorage.setItem(`vidyavantage-career-results:${activeUser.uid}`, JSON.stringify(computedResults));
    if (activeUser) {
      try { await setDoc(doc(db, 'users', activeUser.uid), { careerAssessment: { hollandCode: computedResults.hollandCode || [], riasecScores: computedResults.riasecScores || {}, streams: computedResults.streams || [], top5Careers: computedResults.top5Careers || [], maturityPct: Number(computedResults.maturityPct || 0), profile: computedResults.profile || {}, completedAt: new Date().toISOString() }, assessmentCompletedAt: new Date().toISOString() }, { merge: true }); } catch (err) { console.warn('[CareerStudentView] assessment persistence skipped:', err?.message || err); }
    }
    go('results');
  };

  const hasAssessment = !!assessmentResult || !!(liveUserData?.riasecScores || liveUserData?.careerDNA?.riasec || liveUserData?.riasecCode);
  const resultForDisplay = assessmentResult || normaliseStoredResults(liveUserData);

  if (loading) return <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', color: '#64748b', fontWeight: 800 }}>Loading your career profile…</div>;
  if (view === 'settings') return <CareerProfileSettings />;
  if (view === 'assessment') return <CareerAssessment onBack={() => go(hasAssessment ? 'results' : 'home')} onExplore={() => go('results')} onSaveResults={handleAssessmentComplete} />;
  if (view === 'results') { if (!resultForDisplay) { go('assessment'); return null; } return <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '28px 24px 60px' }}><PartialResults result={resultForDisplay} firstName={firstName} onFullReport={() => accessPaid ? go('full') : go('payment')} onRetake={() => go('assessment')} /></div>; }
  if (view === 'payment') return <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '28px 24px 60px' }}><CareerPaymentPanel currentUser={user} onBack={() => go('results')} onVerified={() => { setAccessPaid(true); go('full'); }} /></div>;
  if (view === 'full') { if (!accessPaid) return null; return <CareerFullReportPage />; }

  return <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex' }}>
    <aside style={{ width: 250, flexShrink: 0, padding: 24 }}><div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #e2e8f0', position: 'sticky', top: 24 }}>
      <div style={{ height: 90, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }} />
      <div style={{ padding: '0 20px 22px', marginTop: -36, textAlign: 'center' }}>
        {profileImage ? <img src={profileImage} alt="Profile" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '4px solid white' }} /> : <div style={{ width: 72, height: 72, borderRadius: '50%', border: '4px solid white', background: '#e0e7ff', color: '#4338ca', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900 }}>{profileInitial}</div>}
        <div style={{ fontWeight: 900, color: '#0f172a', fontSize: 18, marginTop: 8 }}>{firstName}</div><div style={{ color: '#64748b', fontSize: 12, marginBottom: 18 }}>Career Guidance</div>
        <button onClick={() => go('home')} style={{ width: '100%', padding: '10px 12px', border: 0, borderRadius: 10, background: '#eef2ff', color: '#4338ca', fontWeight: 800 }}>🏠 Career Home</button>
        {hasAssessment && <button onClick={() => go('results')} style={{ width: '100%', padding: '10px 12px', border: 0, borderRadius: 10, background: 'transparent', color: '#475569', fontWeight: 700, marginTop: 5 }}>📊 My Results</button>}
        <button onClick={() => go('settings')} style={{ width: '100%', padding: '10px 12px', border: 0, borderRadius: 10, background: 'transparent', color: '#475569', fontWeight: 700, marginTop: 5 }}>⚙️ Profile & Settings</button>
      </div>
    </div></aside>
    <main style={{ flex: 1, padding: '24px 28px 60px' }}><div style={{ maxWidth: 960, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: 30, border: '1px solid #e2e8f0', marginBottom: 20 }}><div style={{ color: '#4f46e5', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>VidyaVantage Career Discovery</div><h1 style={{ margin: '8px 0', color: '#0f172a', fontSize: 34, fontWeight: 950 }}>Your career roadmap starts here, {firstName}.</h1><p style={{ margin: 0, color: '#64748b', fontSize: 15, lineHeight: 1.7 }}>Discover your interests, strengths, values and career direction through the detailed Career Discovery Assessment.</p></div>
      {!hasAssessment ? <div style={{ background: '#fff', borderRadius: 18, padding: '45px 30px', textAlign: 'center', border: '1px solid #e2e8f0' }}><div style={{ fontSize: 44, marginBottom: 12 }}>🧭</div><h2 style={{ margin: '0 0 10px', color: '#0f172a', fontSize: 24 }}>Discover Your Possibilities</h2><p style={{ maxWidth: 650, margin: '0 auto', color: '#64748b', lineHeight: 1.7 }}>Take the detailed VidyaVantage Career Discovery Assessment. When you submit it, you will immediately receive a personalised preview report.</p><button onClick={() => go('assessment')} style={{ marginTop: 24, border: 0, borderRadius: 12, padding: '14px 26px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: 900 }}>Start Career Discovery →</button></div> : <div style={{ background: '#fff', borderRadius: 18, padding: 28, border: '1px solid #e2e8f0' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}><div><div style={{ color: '#4f46e5', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Career Intelligence Report</div><h2 style={{ margin: '5px 0', color: '#0f172a', fontSize: 24, fontWeight: 900 }}>Your results are ready</h2><p style={{ margin: 0, color: '#64748b' }}>Holland Code: <strong>{(resultForDisplay?.hollandCode || []).join('') || liveUserData?.riasecCode || '—'}</strong></p></div><button onClick={() => go('results')} style={{ border: 0, borderRadius: 11, padding: '13px 20px', background: '#4f46e5', color: '#fff', fontWeight: 900 }}>View Career Results →</button></div></div>}
    </div></main>
  </div>;
}
