import React, { useEffect, useMemo, useState } from 'react';
import { auth, db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';

const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, boxShadow: '0 8px 28px rgba(15,23,42,.05)' };
const muted = { color: '#64748b', lineHeight: 1.7 };

function value(v, fallback = 'Not available') {
  return v === undefined || v === null || v === '' ? fallback : v;
}

function pct(v) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : null;
}

function scoreEntries(obj) {
  return Object.entries(obj || {})
    .map(([key, val]) => [key, Number(val)])
    .filter(([, val]) => Number.isFinite(val))
    .sort((a, b) => b[1] - a[1]);
}

function Bar({ label, score, suffix = '%' }) {
  const n = pct(score);
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, fontSize: 12, fontWeight: 800, color: '#334155' }}>
        <span>{label}</span><span>{n === null ? '—' : `${n}${suffix}`}</span>
      </div>
      <div style={{ height: 8, background: '#e2e8f0', borderRadius: 99, marginTop: 5, overflow: 'hidden' }}>
        <div style={{ width: `${n || 0}%`, height: '100%', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', borderRadius: 99 }} />
      </div>
    </div>
  );
}

function Section({ eyebrow, title, children, action }) {
  return (
    <section style={{ ...card, marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
        <div>
          {eyebrow && <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.4, color: '#4f46e5', textTransform: 'uppercase' }}>{eyebrow}</div>}
          <h2 style={{ margin: '5px 0 8px', fontSize: 20, color: '#0f172a' }}>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function NavButton({ active, children, onClick }) {
  return <button onClick={onClick} style={{ width: '100%', textAlign: 'left', border: 0, borderRadius: 10, padding: '11px 12px', background: active ? '#eef2ff' : 'transparent', color: active ? '#4338ca' : '#475569', fontWeight: active ? 900 : 700, cursor: 'pointer' }}>{children}</button>;
}

function Dashboard({ report, user }) {
  const [active, setActive] = useState('overview');
  const scores = report?.scores || {};
  const intake = report?.intake || {};
  const riasec = scoreEntries(scores.riasec);
  const big5 = scoreEntries(scores.big5);
  const values = scoreEntries(scores.values);
  const careers = Array.isArray(report?.careerExploration) ? report.careerExploration : (Array.isArray(report?.topCareers) ? report.topCareers : []);
  const readiness = pct(scores.readinessPercent ?? scores.readiness);
  const adaptability = pct(scores.adaptabilityPercent ?? scores.adaptability);
  const completion = Math.max(0, Math.min(100, Number(report?.completionPercent ?? report?.completion ?? 65)));
  const name = value(user?.displayName || intake.fullName || report?.studentName, 'Student');

  const activeContent = useMemo(() => {
    if (active === 'profile') return <>
      <Section eyebrow="Career identity" title="Interest & personality profile">
        <p style={muted}>These are exploratory tendencies, not fixed labels. Use them as evidence alongside your lived experience, academic context and goals.</p>
        <h3 style={{ margin: '20px 0 12px' }}>RIASEC</h3>
        {riasec.length ? riasec.map(([k, v]) => <Bar key={k} label={k} score={v} />) : <p style={muted}>RIASEC scores will appear after the relevant module is completed.</p>}
        <h3 style={{ margin: '20px 0 12px' }}>Big Five</h3>
        {big5.length ? big5.map(([k, v]) => <Bar key={k} label={k} score={v} />) : <p style={muted}>Personality results are not available yet.</p>}
      </Section>
      <Section eyebrow="Values" title="What matters to you">
        {values.length ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10 }}>{values.slice(0, 8).map(([k, v]) => <div key={k} style={{ padding: 14, background: '#f8fafc', borderRadius: 12 }}><strong>{k}</strong><div style={{ color: '#4f46e5', fontWeight: 900, marginTop: 4 }}>{Math.round(v)}</div></div>)}</div> : <p style={muted}>Complete the Work Values module to build this layer.</p>}
      </Section>
    </>;

    if (active === 'careers') return <>
      <Section eyebrow="Career discovery" title="Career directions">
        <p style={muted}>Explore careers as hypotheses to investigate, not predictions of what you must become.</p>
        <div style={{ display: 'grid', gap: 10, marginTop: 16 }}>
          {careers.length ? careers.slice(0, 10).map((career, i) => <div key={`${career.id || career.name || career.title}-${i}`} style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #eef2f7' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}><strong>{i + 1}. {career.name || career.title || 'Career direction'}</strong>{career.matchScore != null && <strong style={{ color: '#4f46e5' }}>{career.matchScore}%</strong>}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{value(career.category, 'Career exploration')} · {value(career.stream, 'Multiple pathways')}</div>{career.reason && <p style={{ ...muted, fontSize: 13, margin: '7px 0 0' }}>{career.reason}</p>}</div>) : <p style={muted}>Your detailed career directions will appear when enough assessment evidence is available.</p>}
        </div>
      </Section>
      <Section eyebrow="What-if exploration" title="Scenario planning">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 10 }}>
          {['Change your stream', 'Explore an adjacent field', 'Study in another city', 'Compare two career paths'].map(item => <button key={item} onClick={() => alert('Scenario workspace will be enabled in the next Career Intelligence layer.')} style={{ padding: 16, textAlign: 'left', border: '1px solid #e2e8f0', background: '#fff', borderRadius: 12, cursor: 'pointer', fontWeight: 800, color: '#334155' }}>{item}<div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Explore scenario →</div></button>)}
        </div>
      </Section>
    </>;

    if (active === 'roadmap') return <>
      <Section eyebrow="Action" title="Your career roadmap">
        <p style={muted}>A good career plan converts insight into small, testable actions. The roadmap will become more personalised as additional modules are completed.</p>
        <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>{[
          ['01', 'Understand yourself', 'Complete the remaining intelligence modules.'],
          ['02', 'Investigate directions', 'Research careers, roles and real-world work environments.'],
          ['03', 'Build evidence', 'Choose projects, skills, experiences and conversations that test fit.'],
          ['04', 'Choose your next step', 'Compare pathways using fit, feasibility and friction.'],
        ].map(([n, t, d]) => <div key={n} style={{ display: 'flex', gap: 14, padding: 15, background: '#f8fafc', borderRadius: 12 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', color: '#4338ca', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{n}</div><div><strong>{t}</strong><div style={{ ...muted, fontSize: 13 }}>{d}</div></div></div>)}</div>
      </Section>
      <Section eyebrow="Readiness" title="Career readiness">
        <Bar label="Decision readiness" score={readiness} />
        <Bar label="Career adaptability" score={adaptability} />
        <Bar label="Intelligence profile completion" score={completion} />
      </Section>
    </>;

    if (active === 'portfolio') return <>
      <Section eyebrow="Evidence" title="Career Portfolio">
        <p style={muted}>Your portfolio will collect evidence of skills, projects, achievements, experiences and reflections so career decisions are grounded in what you can demonstrate.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10, marginTop: 18 }}>{['Projects', 'Skills', 'Achievements', 'Experiences', 'Certificates', 'Resume'].map(item => <div key={item} style={{ padding: 18, background: '#f8fafc', borderRadius: 12 }}><div style={{ fontWeight: 900 }}>{item}</div><div style={{ fontSize: 12, color: '#94a3b8', marginTop: 5 }}>Add evidence →</div></div>)}</div>
      </Section>
      <Section eyebrow="Reflection" title="Career Journal">
        <p style={muted}>Capture what you learned, what surprised you, which careers you explored and what you want to test next.</p>
        <button onClick={() => alert('Career Journal editor will be enabled in the next layer.')} style={{ marginTop: 12, border: 0, borderRadius: 10, padding: '12px 16px', background: '#4f46e5', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>Write a reflection</button>
      </Section>
    </>;

    return <>
      <Section eyebrow="Career Intelligence" title={`Welcome, ${name.split(' ')[0] || 'Student'}`}>
        <p style={muted}>Your Career Intelligence Profile brings together assessment evidence, context and action. It is designed to evolve as you learn more about yourself.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10, marginTop: 18 }}>
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}><div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>PATHWAY</div><strong style={{ fontSize: 18 }}>{value(report?.pathway, 'Student')}</strong></div>
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}><div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>RIASEC</div><strong style={{ fontSize: 22, letterSpacing: 3, color: '#4f46e5' }}>{value(scores.riasecCode, '—')}</strong></div>
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}><div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>READINESS</div><strong style={{ fontSize: 22 }}>{readiness === null ? '—' : `${readiness}%`}</strong></div>
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}><div style={{ fontSize: 11, color: '#64748b', fontWeight: 800 }}>PROFILE</div><strong style={{ fontSize: 22 }}>{completion}%</strong></div>
        </div>
      </Section>
      <Section eyebrow="Top signals" title="What your profile currently says">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
          <div style={{ padding: 16, borderRadius: 12, background: '#eef2ff' }}><strong>Interest pattern</strong><p style={{ ...muted, margin: '5px 0 0' }}>{riasec.length ? riasec.slice(0, 3).map(([k]) => k).join(' · ') : 'Complete RIASEC'}</p></div>
          <div style={{ padding: 16, borderRadius: 12, background: '#f0fdf4' }}><strong>Career directions</strong><p style={{ ...muted, margin: '5px 0 0' }}>{careers.length ? `${careers.length} directions available` : 'Building your shortlist'}</p></div>
          <div style={{ padding: 16, borderRadius: 12, background: '#fff7ed' }}><strong>Next best action</strong><p style={{ ...muted, margin: '5px 0 0' }}>Complete the next missing module and test one career hypothesis.</p></div>
        </div>
      </Section>
    </>;
  }, [active, report, name, riasec, big5, values, careers, readiness, adaptability, completion]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <aside style={{ width: 245, background: '#fff', borderRight: '1px solid #e2e8f0', padding: 18, position: 'sticky', top: 0, height: '100vh' }}>
          <div style={{ padding: '8px 10px 20px' }}><div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.5, color: '#4f46e5' }}>VIDYAVANTAGE</div><div style={{ fontSize: 18, fontWeight: 950, marginTop: 3 }}>Career Intelligence</div></div>
          <nav style={{ display: 'grid', gap: 5 }}>
            <NavButton active={active === 'overview'} onClick={() => setActive('overview')}>Overview</NavButton>
            <NavButton active={active === 'profile'} onClick={() => setActive('profile')}>My Profile</NavButton>
            <NavButton active={active === 'careers'} onClick={() => setActive('careers')}>Career Explorer</NavButton>
            <NavButton active={active === 'roadmap'} onClick={() => setActive('roadmap')}>My Roadmap</NavButton>
            <NavButton active={active === 'portfolio'} onClick={() => setActive('portfolio')}>Portfolio & Journal</NavButton>
          </nav>
          <div style={{ marginTop: 24, padding: 14, borderRadius: 12, background: '#f8fafc', fontSize: 12, color: '#64748b', lineHeight: 1.6 }}><strong style={{ color: '#334155' }}>Privacy by design</strong><br />Career Intelligence is kept separate from counselling and SEN records. Institutional sharing is controlled separately.</div>
        </aside>
        <main style={{ flex: 1, padding: '30px clamp(18px,4vw,46px) 70px', maxWidth: 1240 }}>
          <header style={{ ...card, background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: '#fff' }}>
            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.5, color: '#fbbf24' }}>YOUR CAREER INTELLIGENCE PROFILE</div>
            <h1 style={{ margin: '7px 0 5px', fontSize: 'clamp(27px,4vw,38px)' }}>Discover. Explore. Decide. Build.</h1>
            <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.7 }}>A living career profile—not a one-time test result.</p>
          </header>
          {activeContent}
        </main>
      </div>
    </div>
  );
}

export default function CareerIntelligenceDashboard() {
  const [state, setState] = useState({ loading: true, report: null, user: null, error: '' });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) { setState({ loading: false, report: null, user: null, error: 'Please sign in to open your Career Intelligence Profile.' }); return; }
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const data = snap.exists() ? snap.data() : {};
        setState({ loading: false, report: data.careerAssessmentV2 || data.careerAssessment || null, user, error: '' });
      } catch (error) {
        setState({ loading: false, report: null, user, error: error.message || 'Unable to load your Career Intelligence Profile.' });
      }
    });
    return () => unsubscribe();
  }, []);

  if (state.loading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#64748b', fontWeight: 800 }}>Loading your Career Intelligence Profile…</div>;
  if (state.error) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}><div style={{ ...card, maxWidth: 520, textAlign: 'center' }}><h2>Career Intelligence</h2><p style={muted}>{state.error}</p></div></div>;
  return <Dashboard report={state.report || {}} user={state.user} />;
}
