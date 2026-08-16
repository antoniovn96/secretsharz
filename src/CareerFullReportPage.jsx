import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getReportPages } from './career/reportArchitecture';
import { getProfileIdentity } from './platform/profileIdentity';

const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 26, boxShadow: '0 8px 28px rgba(15,23,42,.05)' };
const muted = { color: '#64748b', lineHeight: 1.75 };
const valueOr = (value, fallback = 'Not supplied') => value === undefined || value === null || value === '' ? fallback : value;

function normalise(data) {
  const assessment = data?.careerAssessmentV2;
  if (assessment) return { ...assessment, profile: data, reportTier: 'full' };

  const legacy = data?.careerAssessment || {};
  const profile = legacy.profile || {};
  const code = legacy.hollandCode || data?.riasecCode || '';

  return {
    legacyAssessment: true,
    pathway: 'student',
    profile: data,
    reportTier: 'full',
    bundle: { title: 'Legacy Career Discovery (RIASEC)' },
    intake: {
      educationStage: profile.dem_03 || data?.educationStage || '',
      className: profile.dem_03 || data?.className || '',
      stream: legacy.streams?.[0]?.id || data?.recommendedStream || '',
      subjectsLiked: Array.isArray(profile.dem_04) ? profile.dem_04.join(', ') : ''
    },
    scores: {
      riasecCode: Array.isArray(code) ? code.join('') : String(code),
      riasec: legacy.riasecScores || data?.riasecScores || {},
      readinessPercent: Number(legacy.maturityPct ?? data?.maturityPct ?? 0)
    },
    careerExploration: legacy.top5Careers || data?.topCareerMatches || []
  };
}

function NotAssessed() {
  return (
    <div style={{ padding: 17, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 12, color: '#64748b' }}>
      <strong>Not assessed in this attempt.</strong>
      <div style={{ marginTop: 5 }}>VidyaVantage will never manufacture a score or personality interpretation for a test family that was not included in the assessment.</div>
    </div>
  );
}

function CareerList({ items = [] }) {
  if (!items.length) return <NotAssessed />;
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {items.slice(0, 8).map((career, index) => (
        <div key={`${career.name || career.title || 'career'}-${index}`} style={{ padding: 15, background: '#f8fafc', borderRadius: 12, border: '1px solid #eef2f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 15 }}>
            <strong>{index + 1}. {career.name || career.title}</strong>
            {career.matchScore != null && <strong style={{ color: '#4f46e5' }}>{career.matchScore}%</strong>}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{career.stream || career.category || 'Career direction'}</div>
          {career.desc && <p style={{ ...muted, fontSize: 13, margin: '7px 0 0' }}>{career.desc}</p>}
        </div>
      ))}
    </div>
  );
}

function Content({ id, report }) {
  const scores = report.scores || {};
  const intake = report.intake || {};
  const careers = report.careerExploration || [];
  const riasec = Object.entries(scores.riasec || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
  const notAssessed = <NotAssessed />;

  switch (id) {
    case 'executive_snapshot':
      return (
        <>
          <p style={muted}>This report brings together the assessment evidence actually available on this account. It is exploratory guidance, not a diagnosis or prediction.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
            <div style={{ padding: 15, background: '#f8fafc', borderRadius: 12 }}><b>Assessment</b><div>{valueOr(report.bundle?.title)}</div></div>
            <div style={{ padding: 15, background: '#f8fafc', borderRadius: 12 }}><b>RIASEC</b><div>{valueOr(scores.riasecCode, '—')}</div></div>
            <div style={{ padding: 15, background: '#f8fafc', borderRadius: 12 }}><b>Readiness</b><div>{valueOr(scores.readinessPercent, '—')}%</div></div>
          </div>
        </>
      );
    case 'interest_personality':
      return <><p style={muted}>Career interests are available below. Personality results are only interpreted when the Personality family was actually completed.</p><div style={{ fontSize: 40, fontWeight: 950, letterSpacing: 7, color: '#4f46e5' }}>{valueOr(scores.riasecCode, '—')}</div>{report.legacyAssessment && notAssessed}</>;
    case 'riasec_profile':
      return riasec.length ? riasec.map(([key, score]) => <div key={key} style={{ margin: '12px 0' }}><div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 12 }}><span>{key}</span><span>{score}%</span></div><div style={{ height: 9, background: '#e2e8f0', borderRadius: 99, marginTop: 5 }}><div style={{ width: `${Math.min(100, Number(score))}%`, height: '100%', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', borderRadius: 99 }} /></div></div>) : notAssessed;
    case 'career_directions':
    case 'top_career_directions':
    case 'target_roles':
      return <><p style={muted}>Career directions are exploration signals. They should be validated against eligibility, education requirements, evidence and real-world exposure.</p><CareerList items={careers} /></>;
    case 'next_steps':
    case 'action_roadmap':
    case 'action_plan':
      return <><p style={muted}>Turn insight into evidence.</p><ol><li>Research two leading directions.</li><li>Verify current eligibility and prerequisite requirements.</li><li>Speak with one person doing the work.</li><li>Complete one small real-world project.</li><li>Record the next 30/60/90-day milestone.</li></ol></>;
    case 'developmental_context':
      return <><p><b>Education stage:</b> {valueOr(intake.educationStage)}</p><p><b>Class / year:</b> {valueOr(intake.className)}</p><p><b>Stream:</b> {valueOr(intake.stream)}</p><p><b>Subjects:</b> {valueOr(intake.subjectsLiked)}</p><p><b>Academic average:</b> {valueOr(intake.academicAverage)}</p></>;
    case 'stream_analysis':
      return <><p style={muted}>The stored assessment suggests the following stream direction. This is not a permanent boundary.</p><div style={{ padding: 18, background: '#eef2ff', borderRadius: 12, fontWeight: 900 }}>Best fit: {valueOr(intake.stream)}</div></>;
    case 'decision_readiness':
      return <><p style={muted}>The stored assessment includes a readiness/maturity signal.</p><div style={{ fontSize: 42, fontWeight: 950 }}>{valueOr(scores.readinessPercent, '—')}%</div></>;
    case 'career_values':
    case 'strengths_values':
    case 'personality_profile':
    case 'reasoning_profile':
    case 'reasoning_skills':
    case 'adaptability':
    case 'work_environment':
      return notAssessed;
    case 'alternative_careers':
      return careers.length > 3 ? <CareerList items={careers.slice(3)} /> : notAssessed;
    case 'pathway_analysis':
    case 'education_roadmap':
    case 'skills_evidence':
    case 'affordability':
      return <><p style={muted}>This section requires richer evidence than the stored RIASEC-only assessment contains. The architecture is present, but the system deliberately avoids inventing personalised pathway, skills, affordability or scholarship conclusions.</p>{notAssessed}</>;
    case 'counsellor_review':
    case 'review_limitations':
      return <><p style={muted}>Assessment results are exploratory. They should be combined with academic evidence, actual experiences, pathway research and qualified human guidance.</p><p><b>Recommended:</b> complete additional assessment families if a broader Career Intelligence profile is required.</p></>;
    default:
      return notAssessed;
  }
}

export default function CareerFullReportPage() {
  const [report, setReport] = useState(null);
  const [identity, setIdentity] = useState({ name: 'Student', firstName: 'Student', photoURL: '', initial: 'S', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Please sign in.');

        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (!snapshot.exists()) throw new Error('Account not found.');

        const data = snapshot.data();
        const hasAccess = data.careerReportAccess?.status === 'paid' || data.institutionAccess?.status === 'active';
        if (!hasAccess) throw new Error('Full Career Intelligence access is not active.');

        if (!cancelled) {
          setReport(normalise(data));
          setIdentity(getProfileIdentity(user, data));
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load report.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadReport();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div style={{ padding: 80, textAlign: 'center', fontWeight: 800, color: '#64748b' }}>Preparing your 20-page Career Intelligence Report…</div>;
  if (error) return <div style={{ maxWidth: 700, margin: '60px auto', ...card, textAlign: 'center' }}><h2>Report unavailable</h2><p style={muted}>{error}</p></div>;

  const pages = getReportPages({ tier: 'full', pathway: report.pathway || 'student' });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '28px 18px 70px' }}>
      <style>{`@media print{body{background:#fff!important}.no-print{display:none!important}.report-page{break-before:page;min-height:94vh}}`}</style>
      <div className="no-print" style={{ maxWidth: 1100, margin: '0 auto 15px', display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => { window.location.href = '/dashboard/career'; }} style={{ padding: '10px 14px', border: '1px solid #cbd5e1', background: '#fff', borderRadius: 10, fontWeight: 800 }}>← Career Home</button>
        <button onClick={() => window.print()} style={{ padding: '11px 16px', border: 0, borderRadius: 10, background: '#0f172a', color: '#fff', fontWeight: 900 }}>🖨 Save / Print PDF</button>
      </div>
      <main style={{ maxWidth: 1100, margin: '0 auto' }}>
        <section style={{ ...card, background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: '#fff', display: 'flex', alignItems: 'center', gap: 18 }}>
          {identity.photoURL ? <img src={identity.photoURL} alt="Profile" style={{ width: 76, height: 76, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,.85)', flexShrink: 0 }} /> : <div style={{ width: 76, height: 76, borderRadius: '50%', background: '#e0e7ff', color: '#4338ca', display: 'grid', placeItems: 'center', fontSize: 30, fontWeight: 950, flexShrink: 0 }}>{identity.initial}</div>}
          <div><div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 900, letterSpacing: 1.5 }}>VIDYAVANTAGE · FULL CAREER INTELLIGENCE</div><h1 style={{ fontSize: 34, margin: '9px 0' }}>{identity.name} Career Intelligence Report</h1><p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>20-section integrated report architecture · evidence-conscious · no invented psychometric results</p></div>
        </section>
        <section style={{ ...card, marginTop: 16, background: '#fffbeb' }}><b>{report.legacyAssessment ? 'Earlier assessment detected' : 'Integrated assessment bundle'}</b><p style={{ ...muted, marginBottom: 0 }}>{report.legacyAssessment ? 'This account was created with the earlier RIASEC-only assessment. The new report structure is active, but additional modules are marked Not assessed rather than being fabricated.' : 'Your selected assessment families are combined into one integrated Career Intelligence report.'}</p></section>
        {pages.map((page, index) => <section className="report-page" key={page.id} style={{ ...card, marginTop: 16, minHeight: 620 }}><div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.4, color: '#4f46e5' }}>{String(index + 1).padStart(2, '0')} / {pages.length}</div><h2 style={{ margin: '7px 0 16px', fontSize: 27, color: '#0f172a' }}>{page.title}</h2><Content id={page.id} report={report} /></section>)}
      </main>
    </div>
  );
}
