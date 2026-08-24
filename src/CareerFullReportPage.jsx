import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getReportPages } from './career/reportArchitecture';
import { getProfileIdentity } from './platform/profileIdentity';

const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 26, boxShadow: '0 8px 28px rgba(15,23,42,.05)' };
const muted = { color: '#64748b', lineHeight: 1.75 };
const valueOr = (value, fallback = 'Not supplied') => value === undefined || value === null || value === '' ? fallback : value;
const hasObject = value => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length > 0;
const hasArray = value => Array.isArray(value) && value.length > 0;

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
      readinessPercent: legacy.maturityPct ?? data?.maturityPct ?? null
    },
    careerExploration: legacy.top5Careers || data?.topCareerMatches || []
  };
}

function NotAssessed({ message = 'This section is not assessed in this attempt.' }) {
  return (
    <div style={{ padding: 17, background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 12, color: '#64748b' }}>
      <strong>Not assessed in this attempt.</strong>
      <div style={{ marginTop: 5 }}>{message} VidyaVantage will never manufacture a score or personalised interpretation for evidence that is not present.</div>
    </div>
  );
}

function CareerList({ items = [] }) {
  if (!items.length) return <NotAssessed message="No career-direction evidence is available." />;
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {items.slice(0, 8).map((career, index) => (
        <div key={`${career.name || career.title || 'career'}-${index}`} style={{ padding: 15, background: '#f8fafc', borderRadius: 12, border: '1px solid #eef2f7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 15 }}>
            <strong>{index + 1}. {career.name || career.title}</strong>
            {(career.matchScore != null || career.explorationIndex != null) && <strong style={{ color: '#4f46e5' }}>{career.matchScore ?? career.explorationIndex}%</strong>}
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{career.stream || career.category || 'Career direction'}</div>
          {career.desc && <p style={{ ...muted, fontSize: 13, margin: '7px 0 0' }}>{career.desc}</p>}
          {career.rationale && <p style={{ ...muted, fontSize: 12, margin: '7px 0 0' }}>{career.rationale}</p>}
        </div>
      ))}
    </div>
  );
}

function ScoreBars({ values, suffix = '' }) {
  if (!hasObject(values)) return <NotAssessed />;
  const entries = Object.entries(values).filter(([, value]) => Number.isFinite(Number(value)));
  if (!entries.length) return <NotAssessed />;
  return <div>{entries.map(([key, score]) => <div key={key} style={{ margin: '12px 0' }}><div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 12 }}><span>{key}</span><span>{score}{suffix}</span></div><div style={{ height: 9, background: '#e2e8f0', borderRadius: 99, marginTop: 5 }}><div style={{ width: `${Math.min(100, Math.max(0, Number(score)))}%`, height: '100%', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', borderRadius: 99 }} /></div></div>)}</div>;
}

function Content({ id, report }) {
  const scores = report.scores || {};
  const intake = report.intake || {};
  const careers = Array.isArray(report.careerExploration) ? report.careerExploration : [];
  const riasec = Object.entries(scores.riasec || {}).sort((a, b) => Number(b[1]) - Number(a[1]));
  const selectedFamilies = new Set(Array.isArray(report.selectedFamilyIds) ? report.selectedFamilyIds : []);
  const hasFamily = family => report.legacyAssessment ? family === 'interest' : selectedFamilies.has(family);
  const notAssessed = <NotAssessed />;

  switch (id) {
    case 'executive_snapshot':
      return (
        <>
          <p style={muted}>This report brings together the assessment evidence actually available on this account. It is exploratory guidance, not a diagnosis or prediction.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10 }}>
            <div style={{ padding: 15, background: '#f8fafc', borderRadius: 12 }}><b>Assessment</b><div>{valueOr(report.bundle?.title || report.bundleTitle)}</div></div>
            <div style={{ padding: 15, background: '#f8fafc', borderRadius: 12 }}><b>RIASEC</b><div>{hasFamily('interest') ? valueOr(scores.riasecCode, '—') : 'Not assessed'}</div></div>
            <div style={{ padding: 15, background: '#f8fafc', borderRadius: 12 }}><b>Readiness</b><div>{scores.readinessPercent != null ? `${scores.readinessPercent}%` : 'Not assessed'}</div></div>
          </div>
        </>
      );
    case 'interest_personality':
      return <><p style={muted}>Career interests are available below when the Interest family was completed. Personality results are only interpreted when the Personality family was actually completed.</p>{hasFamily('interest') ? <div style={{ fontSize: 40, fontWeight: 950, letterSpacing: 7, color: '#4f46e5' }}>{valueOr(scores.riasecCode, '—')}</div> : notAssessed}</>;
    case 'riasec_profile':
      return hasFamily('interest') && riasec.length ? <ScoreBars values={Object.fromEntries(riasec)} suffix="" /> : notAssessed;
    case 'career_directions':
    case 'top_career_directions':
    case 'target_roles':
      return careers.length ? <><p style={muted}>Career directions are exploration signals. They should be validated against eligibility, education requirements, evidence and real-world exposure.</p><CareerList items={id === 'top_career_directions' ? careers.slice(0, 5) : careers} /></> : notAssessed;
    case 'next_steps':
    case 'action_roadmap':
    case 'action_plan':
      if (report.actionRoadmap || report.actionPlan || report.reflection?.recommendedActions) return <pre style={{ whiteSpace: 'pre-wrap', ...muted }}>{JSON.stringify(report.actionRoadmap || report.actionPlan || report.reflection?.recommendedActions, null, 2)}</pre>;
      if (report.reflection) return <><p style={muted}>{report.reflection.statement || 'Assessment reflection is available.'}</p><p><b>Recommended next step:</b> {valueOr(report.reflection.recommendedNextStep)}</p></>;
      return <><p style={muted}>Turn insight into evidence through exploration, research and real-world exposure.</p><ol><li>Research two leading directions.</li><li>Verify current eligibility and prerequisite requirements.</li><li>Speak with one person doing the work.</li><li>Complete one small real-world project.</li><li>Record the next 30/60/90-day milestone.</li></ol></>;
    case 'developmental_context':
      return <><p><b>Education stage:</b> {valueOr(intake.educationStage)}</p><p><b>Class / year:</b> {valueOr(intake.className)}</p><p><b>Stream:</b> {valueOr(intake.stream)}</p><p><b>Subjects:</b> {valueOr(intake.subjectsLiked || (Array.isArray(intake.likedSubjects) ? intake.likedSubjects.join(', ') : ''))}</p><p><b>Academic average:</b> {valueOr(intake.academicAverage)}</p><p><b>School / college:</b> {valueOr(intake.institutionName)}</p></>;
    case 'decision_readiness':
      return scores.readinessPercent != null || scores.readiness ? <><p style={muted}>This section displays the readiness evidence persisted by the assessment pipeline. It is not a judgement of the student's overall maturity.</p><div style={{ fontSize: 42, fontWeight: 950 }}>{scores.readinessPercent ?? scores.readiness?.percent ?? '—'}%</div></> : notAssessed;
    case 'adaptability':
      return scores.adaptabilityPercent != null || scores.adaptability ? <><p style={muted}>This section displays adaptability evidence only when it is explicitly persisted by the assessment pipeline.</p><div style={{ fontSize: 42, fontWeight: 950 }}>{scores.adaptabilityPercent ?? scores.adaptability?.percent ?? '—'}%</div></> : notAssessed;
    case 'career_values':
      return hasFamily('work_values') && hasObject(scores.values) ? <ScoreBars values={scores.values} /> : notAssessed;
    case 'strengths_values':
      return (hasFamily('work_values') && hasObject(scores.values)) || hasArray(intake.likedSubjects) || valueOr(intake.hobbies, '') || valueOr(intake.curiosity, '') ? <><p style={muted}>This section combines explicit assessment values with contextual information supplied by the student. Context is not converted into a psychometric score.</p>{hasFamily('work_values') && hasObject(scores.values) && <ScoreBars values={scores.values} />}{hasArray(intake.likedSubjects) && <p><b>Liked subjects:</b> {intake.likedSubjects.join(', ')}</p>}{valueOr(intake.hobbies, '') && <p><b>Hobbies / interests:</b> {intake.hobbies}</p>}{valueOr(intake.curiosity, '') && <p><b>Current curiosity:</b> {intake.curiosity}</p>}</> : notAssessed;
    case 'personality_profile':
      return hasFamily('personality') && hasObject(scores.big5) ? <ScoreBars values={scores.big5} /> : notAssessed;
    case 'reasoning_profile':
      return hasFamily('aptitude_skills') && scores.reasoning ? <><p style={muted}>Observed reasoning-sampler performance. This is not an IQ score, percentile rank or diagnosis.</p><div style={{ fontSize: 42, fontWeight: 950 }}>{scores.reasoning.percent != null ? `${scores.reasoning.percent}%` : 'Not available'}</div><p style={{ ...muted, fontSize: 13 }}>Correct: {scores.reasoning.correct ?? '—'} / {scores.reasoning.total ?? '—'}</p></> : notAssessed;
    case 'reasoning_skills':
      return hasFamily('aptitude_skills') && (scores.reasoning || hasObject(scores.skills)) ? <><p style={muted}>The available aptitude/skills evidence is shown without converting self-report or sampler performance into an IQ-style conclusion.</p>{scores.reasoning && <p><b>Reasoning sampler:</b> {scores.reasoning.percent != null ? `${scores.reasoning.percent}%` : 'Not available'}</p>}{hasObject(scores.skills) && <ScoreBars values={scores.skills} />}</> : notAssessed;
    case 'work_environment':
      return report.workEnvironment || report.preferredWorkEnvironment ? <pre style={{ whiteSpace: 'pre-wrap', ...muted }}>{JSON.stringify(report.workEnvironment || report.preferredWorkEnvironment, null, 2)}</pre> : notAssessed;
    case 'alternative_careers':
      return hasArray(report.alternativeCareers) ? <CareerList items={report.alternativeCareers} /> : notAssessed;
    case 'pathway_analysis':
    case 'education_roadmap':
    case 'skills_evidence':
    case 'affordability':
      { const field = { pathway_analysis: 'pathwayAnalysis', education_roadmap: 'educationRoadmap', skills_evidence: 'skillsEvidence', affordability: 'affordability' }[id];
        return hasObject(report[field]) || hasArray(report[field]) ? <pre style={{ whiteSpace: 'pre-wrap', ...muted }}>{JSON.stringify(report[field], null, 2)}</pre> : notAssessed; }
    case 'stream_analysis':
      return report.streamAnalysis || report.streamScenarios ? <pre style={{ whiteSpace: 'pre-wrap', ...muted }}>{JSON.stringify(report.streamAnalysis || report.streamScenarios, null, 2)}</pre> : notAssessed;
    case 'counsellor_review':
    case 'review_limitations':
      return <><p style={muted}>Assessment results are exploratory. They should be combined with academic evidence, actual experiences, pathway research and qualified human guidance.</p>{report.counsellorReview || report.reviewLimitations ? <pre style={{ whiteSpace: 'pre-wrap', ...muted }}>{JSON.stringify(report.counsellorReview || report.reviewLimitations, null, 2)}</pre> : <p><b>Recommended:</b> discuss the results with a qualified career professional and complete additional assessment families when a broader profile is required.</p>}</>;
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

  if (loading) return <div style={{ padding: 80, textAlign: 'center', fontWeight: 800, color: '#64748b' }}>Preparing your Career Intelligence Report…</div>;
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
          <div><div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 900, letterSpacing: 1.5 }}>VIDYAVANTAGE · FULL CAREER INTELLIGENCE</div><h1 style={{ fontSize: 34, margin: '9px 0' }}>{identity.name} Career Intelligence Report</h1><p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>{pages.length}-section integrated report architecture · evidence-conscious · no invented psychometric results</p></div>
        </section>
        <section style={{ ...card, marginTop: 16, background: '#fffbeb' }}><b>{report.legacyAssessment ? 'Earlier assessment detected' : 'Integrated assessment bundle'}</b><p style={{ ...muted, marginBottom: 0 }}>{report.legacyAssessment ? 'This account was created with the earlier RIASEC-only assessment. The new report structure is active, but additional modules are marked Not assessed rather than being fabricated.' : 'Your selected assessment families are combined into one integrated Career Intelligence report.'}</p></section>
        {pages.map((page, index) => <section className="report-page" key={page.id} style={{ ...card, marginTop: 16, minHeight: 620 }}><div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.4, color: '#4f46e5' }}>{String(index + 1).padStart(2, '0')} / {pages.length}</div><h2 style={{ margin: '7px 0 16px', fontSize: 27, color: '#0f172a' }}>{page.title}</h2><Content id={page.id} report={report} /></section>)}
      </main>
    </div>
  );
}
