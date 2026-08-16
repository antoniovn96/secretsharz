import React, { useEffect, useMemo, useState } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getReportPages } from './career/reportArchitecture';
import { getAssessmentLibrarySummary } from './career/assessmentLibrary';

const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 26, boxShadow: '0 8px 28px rgba(15,23,42,.05)' };
const muted = { color: '#64748b', lineHeight: 1.75 };

function value(v, fallback = 'Not supplied') { return v === undefined || v === null || v === '' ? fallback : v; }

function ModuleStrip({ report }) {
  const summary = useMemo(() => getAssessmentLibrarySummary(report?.answers || {}), [report]);
  const fallbackComplete = Boolean(report?.scores?.riasecCode || report?.scores?.big5 || report?.scores?.reasoning);
  const modules = summary.modules.map(module => ({ ...module, status: fallbackComplete && module.status === 'not_started' && module.status !== 'catalogue' ? 'completed' : module.status }));
  return <div style={{ ...card, marginTop: 16 }}>
    <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: 1.3, color: '#4f46e5', textTransform: 'uppercase' }}>Assessment Library</div>
    <h3 style={{ margin: '6px 0 8px', fontSize: 20 }}>Your Career Intelligence is modular</h3>
    <p style={{ ...muted, marginTop: 0 }}>Valid module results are reusable. Upgrading to Full Career Intelligence does not require you to retake an assessment you have already completed.</p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 9 }}>
      {modules.map(module => <div key={module.id} style={{ padding: 12, borderRadius: 11, background: module.status === 'completed' ? '#f0fdf4' : module.status === 'catalogue' ? '#f8fafc' : '#fff7ed', border: '1px solid #e2e8f0' }}>
        <div style={{ fontWeight: 850, color: '#0f172a', fontSize: 13 }}>{module.shortTitle}</div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{module.status === 'completed' ? 'Completed / available' : module.status === 'catalogue' ? 'Separate module' : 'Available to complete'}</div>
      </div>)}
    </div>
  </div>;
}

function CareerList({ careers }) {
  if (!careers?.length) return <p style={muted}>Your current profile does not contain enough career data for a detailed shortlist yet.</p>;
  return <div style={{ display: 'grid', gap: 10 }}>{careers.slice(0, 8).map((career, index) => <div key={`${career.id || career.name}-${index}`} style={{ padding: 15, background: '#f8fafc', borderRadius: 12, border: '1px solid #eef2f7' }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}><strong style={{ color: '#0f172a' }}>{index + 1}. {career.name || career.title}</strong>{career.matchScore != null && <strong style={{ color: '#4f46e5' }}>{career.matchScore}%</strong>}</div><div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{value(career.category, 'Career direction')} · {value(career.stream, 'Exploration')}</div>{career.reason && <p style={{ ...muted, margin: '7px 0 0', fontSize: 13 }}>{career.reason}</p>}</div>)}</div>;
}

function PageContent({ id, report }) {
  const scores = report?.scores || {};
  const intake = report?.intake || {};
  const careers = report?.careerExploration || [];
  const student = report?.pathway === 'student';
  const professional = report?.pathway === 'working_professional';
  const topValues = Object.entries(scores.values || {}).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 8);
  const big5 = Object.entries(scores.big5 || {});
  const riasec = Object.entries(scores.riasec || {}).sort((a, b) => Number(b[1]) - Number(a[1]));

  switch (id) {
    case 'executive_snapshot': return <><p style={muted}>This is an exploratory Career Intelligence report. It brings together interests, personality tendencies, values, observed reasoning, decision readiness, adaptability and context. It does not diagnose, determine destiny or guarantee an outcome.</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10, marginTop: 18 }}><div style={{ padding: 15, background: '#f8fafc', borderRadius: 12 }}><strong>Pathway</strong><div>{value(report.pathway)}</div></div><div style={{ padding: 15, background: '#f8fafc', borderRadius: 12 }}><strong>RIASEC</strong><div>{value(scores.riasecCode)}</div></div><div style={{ padding: 15, background: '#f8fafc', borderRadius: 12 }}><strong>Decision readiness</strong><div>{value(scores.readinessPercent, '—')}%</div></div></div></>;
    case 'current_role': return <><p style={muted}>Your current professional context matters as much as your personality profile. A difficult employer, role design or manager relationship should not automatically be interpreted as a wrong career.</p><p><strong>Employer:</strong> {value(intake.employer)}</p><p><strong>Role:</strong> {value(intake.jobRole || intake.designation)}</p><p><strong>Experience:</strong> {value(intake.yearsExperience)}</p><p><strong>Career intent:</strong> {value(intake.professionalIntent)}</p></>;
    case 'developmental_context': return <><p style={muted}>Age, academic stage and current circumstances are interpreted together. The platform is designed for non-linear pathways, so a current stream or qualification is not treated as a permanent boundary.</p><p><strong>Age:</strong> {value(intake.age)}</p><p><strong>Education stage:</strong> {value(intake.educationStage)}</p><p><strong>Board / curriculum:</strong> {value(intake.board)}</p><p><strong>Current class / year:</strong> {value(intake.className)}</p><p><strong>Stream / field:</strong> {value(intake.stream)}</p><p><strong>Academic average:</strong> {value(intake.academicAverage)}</p></>;
    case 'interest_personality': return <><p style={muted}>Interests describe the kinds of activities and environments a person is drawn toward. Personality tendencies describe patterns across situations. Neither is a fixed label.</p><h4>Interest code</h4><div style={{ fontSize: 40, fontWeight: 950, letterSpacing: 7, color: '#4f46e5' }}>{value(scores.riasecCode, '—')}</div><h4>Big Five tendencies</h4><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 8 }}>{big5.map(([key, val]) => <div key={key} style={{ padding: 12, background: '#f8fafc', borderRadius: 10, textAlign: 'center' }}><strong>{key}</strong><div>{val}</div></div>)}</div></>;
    case 'riasec_profile': return <><p style={muted}>RIASEC is used here as an exploratory vocational-interest framework. A high score means greater reported interest in that activity pattern, not greater ability or guaranteed success.</p>{riasec.map(([key, val]) => <div key={key} style={{ margin: '12px 0' }}><div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 12 }}><span>{key}</span><span>{val}</span></div><div style={{ height: 9, background: '#e2e8f0', borderRadius: 99, marginTop: 5 }}><div style={{ width: `${Math.min(100, Number(val) * 3)}%`, height: '100%', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', borderRadius: 99 }} /></div></div>)}</>;
    case 'personality_profile': return <><p style={muted}>Big Five results are continuous tendencies. They should be considered alongside environment and actual behaviour rather than treated as a personality type.</p><div style={{ display: 'grid', gap: 10 }}>{big5.map(([key, val]) => <div key={key} style={{ padding: 13, background: '#f8fafc', borderRadius: 10 }}><strong>{key}</strong><span style={{ marginLeft: 10 }}>{val}</span><div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Interpret in context of goals, environment and experience.</div></div>)}</div></>;
    case 'strengths_values':
    case 'career_values': return <><p style={muted}>Career values describe what work should provide. They help explain why two careers with similar interests may feel very different to the same person.</p><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>{topValues.map(([key, val]) => <div key={key} style={{ padding: 12, background: '#f8fafc', borderRadius: 10 }}><strong>{key}</strong> · {val}/5</div>)}</div></>;
    case 'reasoning_profile':
    case 'reasoning_skills': return <><p style={muted}>Reasoning results are based on this online sampler. They are not an IQ score, a norm-referenced percentile or a diagnosis of cognitive ability.</p><div style={{ fontSize: 38, fontWeight: 950, color: '#0f172a' }}>{value(scores.reasoning?.percent, '—')}%</div><p style={muted}>Observed correct-response rate in the sampler. Actual skills should be evaluated using education, projects, work evidence and real tasks.</p></>;
    case 'decision_readiness': return <><p style={muted}>Decision readiness reflects current career exploration and decision-process behaviours. It can change as information, confidence and experience develop.</p><div style={{ fontSize: 38, fontWeight: 950 }}>{value(scores.readinessPercent, '—')}%</div><p>Useful next step: identify one uncertainty and research it using two or three credible sources rather than relying on one popular opinion.</p></>;
    case 'adaptability': return <><p style={muted}>Adaptability is developmental. The result describes current career-related behaviours around change, uncertainty, setbacks and support-seeking.</p><div style={{ fontSize: 38, fontWeight: 950 }}>{value(scores.adaptabilityPercent, '—')}%</div></>;
    case 'work_environment': return <><p style={muted}>Work-environment preferences should be compared with actual job conditions. Consider autonomy, structure, pace, people contact, collaboration, competition, remote work and location.</p><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>{Object.entries(scores.environment || {}).map(([key, val]) => <div key={key} style={{ padding: 12, background: '#f8fafc', borderRadius: 10 }}><strong>{key}</strong> · {val}</div>)}</div></>;
    case 'top_career_directions': return <><p style={muted}>These are directions to explore, not instructions. Match and confidence should be read together with academic fit, accessibility, friction and actual pathway requirements.</p><CareerList careers={careers} /></>;
    case 'career_directions': return <><p style={muted}>The free snapshot highlights your strongest current directions. A career direction is a starting point for investigation, not a final decision.</p><CareerList careers={careers.slice(0, 3)} /></>;
    case 'alternative_careers': return <><p style={muted}>Alternative and unexpected recommendations deliberately widen exploration. They are labelled as exploratory recommendations when they fall outside the primary profile ranking.</p><CareerList careers={careers.slice(3, 8)} /></>;
    case 'pathway_analysis': return <><p style={muted}>VidyaVantage treats education and career movement as a graph rather than a single ladder. A pathway may be direct, bridge-based, multidisciplinary or a later transition.</p><div style={{ padding: 18, background: '#f8fafc', borderRadius: 12, fontWeight: 800 }}>Current position → prerequisite → bridge skill / qualification → experience → target direction → alternative route</div><p style={muted}>Before committing, verify actual admission, eligibility and regulatory requirements in the current database record.</p></>;
    case 'stream_analysis': return <><p style={muted}>A stream is not destiny. Compare what changes under each plausible academic choice, including subject prerequisites, later degrees and bridge possibilities.</p><p><strong>Current stream:</strong> {value(intake.stream)}</p><p><strong>Subjects liked:</strong> {value(intake.subjectsLiked)}</p><p><strong>Subjects disliked:</strong> {value(intake.subjectsDisliked)}</p></>;
    case 'education_roadmap': return <><p style={muted}>For each promising direction, identify the next qualification, prerequisites, entrance route where relevant, realistic timeline and at least one alternative pathway.</p><ol><li>Confirm eligibility and prerequisites.</li><li>Compare at least three education routes.</li><li>Estimate time and total cost.</li><li>Identify one lower-cost or lower-friction alternative.</li><li>Record the next application/research milestone.</li></ol></>;
    case 'skills_evidence': return <><p style={muted}>Separate aptitude from skill. A reasoning result does not prove a practical skill; skills should be supported by evidence.</p><div style={{ display: 'grid', gap: 9 }}>{['Technical/domain skill','Communication skill','Problem-solving skill','Project/portfolio evidence'].map(item => <div key={item} style={{ padding: 13, background: '#f8fafc', borderRadius: 10 }}><strong>{item}</strong><div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Add a project, certificate, competition, internship or portfolio example where possible.</div></div>)}</div></>;
    case 'affordability': return <><p style={muted}>Career fit and transition friction are separate. A strong-fit path can still have high financial, academic, geographic or qualification friction.</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 9 }}>{['Academic friction','Financial friction','Time friction','Geographic friction','Skill friction','Qualification friction'].map(item => <div key={item} style={{ padding: 13, background: '#f8fafc', borderRadius: 10 }}><strong>{item}</strong><div style={{ color: '#64748b', marginTop: 4 }}>Assess from current pathway data.</div></div>)}</div></>;
    case 'opportunity_plan': return <><p style={muted}>Turn exploration into evidence through college research, conversations with professionals, projects, volunteering, internships, competitions and credible courses.</p><ul><li>Research two real programmes.</li><li>Speak to one person doing the work.</li><li>Try one small real-world task.</li><li>Save the evidence in the Career Portfolio.</li></ul></>;
    case 'action_roadmap':
    case 'next_steps':
    case 'action_plan': return <><p style={muted}>A career plan should produce action, not just insight.</p><div style={{ display: 'grid', gap: 9 }}>{['Clarify one career question','Research one pathway deeply','Build one relevant skill','Complete one evidence project','Have one informed career conversation'].map((item, index) => <div key={item} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 13, background: '#f8fafc', borderRadius: 10 }}><strong>{index + 1}</strong><span>{item}</span></div>)}</div></>;
    case 'stay_grow': return <p style={muted}>Examine whether better role scope, specialisation, promotion, a healthier workplace or targeted upskilling solves the problem before assuming a complete career change is necessary.</p>;
    case 'lateral_move': return <p style={muted}>Map adjacent roles where current transferable skills are valuable. Prioritise roles where the bridge gap is realistic and evidence can be built quickly.</p>;
    case 'industry_change': return <p style={muted}>Industry pivots should separate transferable capability from domain knowledge. Identify what stays with you and what must be learned.</p>;
    case 'career_change': return <p style={muted}>A complete career change is a transition problem, not a failure. Compare qualification, time, financial runway, skill and geographic friction before committing.</p>;
    case 'friction': return <p style={muted}>Overall transition friction should explain the resistance between the current position and a target, not punish a career for being difficult. High friction can still be worthwhile when fit is strong.</p>;
    case 'skills_gap': return <p style={muted}>Prioritise skills by impact, feasibility, evidence value and actual demand. Avoid collecting credentials that do not close a real gap.</p>;
    case 'target_roles': return <CareerList careers={careers} />;
    case 'learning_roadmap': return <ol><li>Identify the target capability.</li><li>Choose a credible learning route.</li><li>Practise through a real project.</li><li>Collect evidence.</li><li>Reassess the gap after experience.</li></ol>;
    case 'roi': return <p style={muted}>Compare time, cost, opportunity cost and expected career usefulness. This is planning guidance, not financial advice and not a guarantee of salary or employment.</p>;
    case 'transition_plan': return <p style={muted}>A transition roadmap should move from current state → bridge requirements → evidence → target role exploration → applications or internal mobility → review.</p>;
    case 'review_limitations':
    case 'counsellor_review': return <><p style={muted}>This report is not a clinical diagnosis, intelligence test, guarantee of career success or substitute for qualified counselling. Assessment results are exploratory and should be combined with real-world evidence.</p><p><strong>Human review:</strong> A qualified career counsellor can help test assumptions, compare alternatives and translate the report into a realistic decision.</p></>;
    case 'satisfaction': return <p style={muted}>Separate burnout, boredom, workplace mismatch and career mismatch. The correct intervention may be a new environment rather than a new profession.</p>;
    default: return <p style={muted}>This section will become more detailed as additional Career Intelligence modules and verified pathway data are added to your profile.</p>;
  }
}

export default function CareerReportV3() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Please sign in.');
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (!snapshot.exists()) throw new Error('Your account could not be found.');
        const data = snapshot.data();
        const access = data.careerReportAccess?.status === 'paid' || data.institutionAccess?.status === 'active';
        if (!data.careerAssessmentV2) throw new Error('No Career Intelligence assessment is available yet.');
        setReport({ ...data.careerAssessmentV2, reportTier: access ? 'full' : 'free', profile: data });
      } catch (err) {
        setError(err?.message || 'Unable to load your Career Intelligence report.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 70, textAlign: 'center', color: '#64748b', fontWeight: 800 }}>Preparing your Career Intelligence Report…</div>;
  if (error) return <div style={{ maxWidth: 700, margin: '60px auto', ...card, textAlign: 'center' }}><h2>Report unavailable</h2><p style={muted}>{error}</p><button onClick={() => { window.location.href = '/dashboard/career'; }} style={{ border: 0, borderRadius: 10, padding: '12px 18px', background: '#4f46e5', color: '#fff', fontWeight: 900 }}>Back to Career Home</button></div>;

  const pages = getReportPages({ tier: report.reportTier, pathway: report.pathway });
  const isFull = report.reportTier === 'full';

  return <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '28px 18px 70px' }}>
    <style>{`@media print{body{background:#fff!important}.vv-no-print{display:none!important}.vv-page{break-before:page;min-height:94vh}.vv-report{box-shadow:none!important}}`}</style>
    <div className="vv-no-print" style={{ maxWidth: 1100, margin: '0 auto 15px', display: 'flex', justifyContent: 'space-between', gap: 12 }}><button onClick={() => { window.location.href = '/dashboard/career'; }} style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: 10, padding: '10px 14px', fontWeight: 800 }}>← Career Home</button><button onClick={() => window.print()} style={{ border: 0, borderRadius: 10, padding: '11px 16px', background: '#0f172a', color: '#fff', fontWeight: 900 }}>🖨 Save / Print PDF</button></div>
    <div className="vv-report" style={{ maxWidth: 1100, margin: '0 auto' }}>
      <section style={{ ...card, background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: '#fff' }}><div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 900, letterSpacing: 1.5 }}>VIDYAVANTAGE · {isFull ? 'FULL CAREER INTELLIGENCE' : 'CAREER DISCOVERY'}</div><h1 style={{ fontSize: 34, margin: '9px 0' }}>{isFull ? 'Your Career Intelligence Report' : 'Your 5-Page Career Snapshot'}</h1><p style={{ color: '#cbd5e1', lineHeight: 1.7, marginBottom: 0 }}>Build a career, rather than being told to choose one. This report is exploratory guidance and does not determine your future.</p></section>
      {!isFull && <div style={{ ...card, marginTop: 16, background: '#fffbeb' }}><strong>Full Career Intelligence</strong><p style={{ ...muted, marginBottom: 0 }}>The Premium version expands this snapshot into a 20-page pathway, skills, friction, affordability and action report. Your existing valid assessment responses are reused; you are not asked to redo the whole questionnaire just because you upgrade.</p></div>}
      <ModuleStrip report={report} />
      {pages.map((page, index) => <section className="vv-page" key={page.id} style={{ ...card, marginTop: 16, minHeight: 620 }}><div style={{ color: '#4f46e5', fontSize: 11, fontWeight: 900, letterSpacing: 1.4 }}>{String(index + 1).padStart(2, '0')} / {pages.length}</div><h2 style={{ margin: '7px 0 16px', fontSize: 27, color: '#0f172a' }}>{page.title}</h2><PageContent id={page.id} report={report} /></section>)}
    </div>
  </div>;
}
