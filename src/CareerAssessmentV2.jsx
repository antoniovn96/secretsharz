import React, { useEffect, useMemo, useState } from 'react';
import { auth } from './firebase';
import { AGE_BANDS, ASSESSMENT_VERSION, DOMAINS, PATHWAYS, PROFESSIONAL_INTENTS, STUDENT_STAGES, buildItemSet, calculateAge, ageBandFor, reportPlan } from './career/careerAssessmentBlueprint';

const inputStyle = { width:'100%', padding:'13px 14px', border:'1px solid #dbe3ef', borderRadius:12, fontSize:14, outline:'none', background:'#fff' };
const cardStyle = { background:'#fff', border:'1px solid #e2e8f0', borderRadius:20, padding:24, boxShadow:'0 8px 28px rgba(15,23,42,.05)' };

function Field({ label, children, hint }) { return <label style={{ display:'grid', gap:7, fontSize:13, fontWeight:800, color:'#334155' }}><span>{label}{hint && <small style={{ color:'#94a3b8', fontWeight:600, marginLeft:6 }}>{hint}</small>}</span>{children}</label>; }
function SectionTitle({ eyebrow, title, text }) { return <div style={{ marginBottom:22 }}><div style={{ color:'#4f46e5', fontSize:11, fontWeight:900, letterSpacing:1.5, textTransform:'uppercase' }}>{eyebrow}</div><h2 style={{ margin:'6px 0 6px', fontSize:28, color:'#0f172a', fontWeight:950 }}>{title}</h2><p style={{ margin:0, color:'#64748b', lineHeight:1.7, fontSize:14 }}>{text}</p></div>; }

function ReportPreview({ report, onUnlock }) {
  const scores = report?.scores || {};
  const riasec = Object.entries(scores.riasec || {}).sort((a,b)=>b[1]-a[1]);
  const careers = report?.careerExploration || [];
  const full = report?.reportTier !== 'free';
  const pages = reportPlan({ paid:full, pathway:report?.pathway });
  return <div style={{ maxWidth:1100, margin:'0 auto', paddingBottom:70 }}>
    <div style={{ ...cardStyle, background:'linear-gradient(135deg,#0f172a,#1e293b)', color:'#fff', marginBottom:18 }}>
      <div style={{ color:'#fbbf24', fontSize:11, fontWeight:900, letterSpacing:1.5 }}>VIDYAVANTAGE CAREER INTELLIGENCE · V{ASSESSMENT_VERSION}</div>
      <h1 style={{ margin:'9px 0 5px', fontSize:34, fontWeight:950 }}>Your career profile is ready.</h1>
      <p style={{ margin:0, color:'#cbd5e1', lineHeight:1.7 }}>This result is a structured starting point for exploration. It is not a diagnosis, a fixed identity or a command to choose one career.</p>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:16 }}>
      <div style={cardStyle}><div style={{ color:'#64748b', fontSize:11, fontWeight:900 }}>RIASEC</div><div style={{ fontSize:42, fontWeight:950, letterSpacing:7, color:'#4f46e5', margin:'8px 0' }}>{scores.riasecCode || '—'}</div><div style={{ color:'#64748b', fontSize:13 }}>Interest pattern</div></div>
      <div style={cardStyle}><div style={{ color:'#64748b', fontSize:11, fontWeight:900 }}>REASONING SAMPLER</div><div style={{ fontSize:36, fontWeight:950, color:'#0f172a', margin:'8px 0' }}>{scores.reasoning?.percent ?? '—'}%</div><div style={{ color:'#64748b', fontSize:13 }}>Observed correct-response rate in this sampler</div></div>
      <div style={cardStyle}><div style={{ color:'#64748b', fontSize:11, fontWeight:900 }}>DECISION READINESS</div><div style={{ fontSize:36, fontWeight:950, color:'#0f172a', margin:'8px 0' }}>{scores.readinessPercent ?? '—'}%</div><div style={{ color:'#64748b', fontSize:13 }}>Exploration and decision-process indicator</div></div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16 }}>
      <div style={cardStyle}><h3 style={{ margin:'0 0 16px', fontSize:18 }}>Interest pattern</h3>{riasec.map(([key,value])=><div key={key} style={{ marginBottom:11 }}><div style={{ display:'flex', justifyContent:'space-between', fontSize:12, fontWeight:800, color:'#475569' }}><span>{key}</span><span>{value}</span></div><div style={{ height:8, background:'#e2e8f0', borderRadius:99, marginTop:5 }}><div style={{ width:`${Math.min(100,Number(value)*3)}%`, height:'100%', borderRadius:99, background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} /></div></div>)}</div>
      <div style={cardStyle}><h3 style={{ margin:'0 0 12px', fontSize:18 }}>Career directions to explore</h3>{careers.slice(0,5).map((c,i)=><div key={c.id} style={{ padding:'12px 0', borderBottom:i===4?'0':'1px solid #eef2f7' }}><div style={{ display:'flex', justifyContent:'space-between', gap:12 }}><strong style={{ color:'#0f172a' }}>{i+1}. {c.name}</strong><span style={{ color:'#4f46e5', fontWeight:900 }}>{c.explorationIndex}</span></div><div style={{ fontSize:12, color:'#64748b', marginTop:3 }}>{c.category} · {c.stream}</div></div>)}</div>
    </div>
    {!full ? <div style={{ ...cardStyle, marginTop:16, background:'#f8fafc' }}><div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:18, flexWrap:'wrap' }}><div><div style={{ color:'#4f46e5', fontSize:11, fontWeight:900, letterSpacing:1 }}>FREE 3-PAGE PREVIEW</div><h3 style={{ margin:'5px 0', fontSize:21 }}>Go deeper than the headline result.</h3><p style={{ margin:0, color:'#64748b', lineHeight:1.6 }}>The full report expands the profile into education pathways, alternative routes, skills, opportunities and a practical action roadmap.</p></div><button onClick={onUnlock} style={{ border:0, borderRadius:12, padding:'14px 18px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontWeight:900, cursor:'pointer' }}>Unlock Full Report</button></div></div> : <FullReport report={report} />}
    {full && <div style={{ marginTop:14, color:'#64748b', fontSize:12 }}>Report structure: {pages.length} sections. Each section is intentionally written as exploration guidance rather than a deterministic verdict.</div>}
  </div>;
}

function FullReport({ report }) {
  const scores = report?.scores || {};
  const careers = report?.careerExploration || [];
  const pages = reportPlan({ paid:true, pathway:report?.pathway });
  const student = report?.pathway === PATHWAYS.STUDENT;
  const professional = report?.pathway === PATHWAYS.PROFESSIONAL;
  return <div className="vv-print-report" style={{ marginTop:16 }}>
    <style>{`@media print{body{background:#fff!important}.vv-no-print{display:none!important}.vv-print-page{break-before:page;min-height:94vh;padding:28px}.vv-print-report{box-shadow:none!important}.vv-print-report>*{box-shadow:none!important}}`}</style>
    {pages.map((page, i) => <section className="vv-print-page" key={page} style={{ ...cardStyle, marginTop:14, minHeight:220, breakBefore:i===0?'auto':'page' }}>
      <div style={{ color:'#4f46e5', fontSize:11, fontWeight:900, letterSpacing:1.4 }}>{String(i+1).padStart(2,'0')} / {pages.length}</div>
      <h2 style={{ margin:'7px 0 12px', fontSize:25, color:'#0f172a' }}>{page}</h2>
      {i===0 && <><p style={{ color:'#475569', lineHeight:1.8 }}>This report brings together multiple information sources: interests, personality tendencies, values, observed reasoning performance, decision readiness, adaptability and contextual information. No single score should be treated as the person's identity.</p><div style={{ marginTop:18, padding:15, background:'#f8fafc', borderRadius:12 }}><strong>Pathway:</strong> {report.pathway}<br/><strong>Report access:</strong> {report.reportTier}</div></>}
      {i===1 && <><p style={{ color:'#475569', lineHeight:1.8 }}>Age and context are interpreted developmentally. The platform should be revisited as circumstances, interests, education and experience change.</p><p><strong>Education stage:</strong> {report.intake?.educationStage || 'Not supplied'}</p><p><strong>Current stream / field:</strong> {report.intake?.stream || 'Not supplied'}</p></>}
      {i===2 && <><h4>Interest code</h4><div style={{ fontSize:36, fontWeight:950, letterSpacing:6, color:'#4f46e5' }}>{scores.riasecCode}</div><p style={{ color:'#64748b' }}>Explore careers that share parts of this interest pattern; do not treat the code as a fixed personality type.</p></>}
      {i===3 && <><p>Big Five tendencies are continuous rather than types.</p><div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>{Object.entries(scores.big5||{}).map(([k,v])=><div key={k} style={{ padding:12, background:'#f8fafc', borderRadius:10, textAlign:'center' }}><strong>{k}</strong><div>{v}</div></div>)}</div></>}
      {i===4 && <><p>Career values describe what the person wants work to provide. Values can change with life stage.</p><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>{Object.entries(scores.values||{}).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([k,v])=><div key={k} style={{ padding:10, background:'#f8fafc', borderRadius:9 }}><strong>{k}</strong> · {v}/5</div>)}</div></>}
      {i===5 && <><p>Reasoning sampler result: <strong>{scores.reasoning?.percent ?? '—'}%</strong>. This is an observed response rate in this online sampler, not an intelligence quotient or norm-referenced aptitude percentile.</p></>}
      {i===6 && <><p>Decision readiness indicator: <strong>{scores.readinessPercent ?? '—'}%</strong>. This describes the current decision process, not future success.</p></>}
      {i===7 && <><p>Work-environment preferences help compare the realities of careers: autonomy, structure, people contact, pace, collaboration and location.</p></>}
      {i===8 && <><p>Adaptability indicator: <strong>{scores.adaptabilityPercent ?? '—'}%</strong>. Resilience is developmental and can be strengthened.</p></>}
      {student && i===9 && <><p><strong>Academic profile:</strong> {report.intake?.academicAverage || 'Not supplied'} average / equivalent.</p><p>Subject marks and subject preferences should be interpreted together with interests, opportunities and the actual demands of pathways.</p></>}
      {student && i===10 && <p>Use the student's subject strengths, disliked subjects, hobbies, projects and extracurricular experiences as evidence to investigate—not as a reason to eliminate a pathway automatically.</p>}
      {student && i===11 && <p>Strengths are the patterns worth developing. Development areas are not weaknesses that define the person; they are skills or conditions that may deserve attention.</p>}
      {i===12 && <div>{careers.slice(0,8).map((c,n)=><div key={c.id} style={{ padding:'11px 0', borderBottom:'1px solid #eef2f7' }}><strong>{n+1}. {c.name}</strong><div style={{ color:'#64748b', fontSize:12 }}>{c.category} · exploration index {c.explorationIndex}</div></div>)}</div>}
      {i===13 && <p>For each promising pathway, compare actual work, education requirements, cost, time, entrance requirements, skills, working conditions and alternative routes. The platform should surface a pathway card rather than a single career verdict.</p>}
      {i===14 && <p>Alternative pathways matter. A student may move across disciplines through appropriate degrees, diplomas, professional qualifications, bridge routes, postgraduate study or research. The system should never assume a single linear route.</p>}
      {i===15 && <p>Education roadmap: identify the next qualification, prerequisites, entrance route where applicable, realistic timeline, skill-building needs and at least one backup route.</p>}
      {i===16 && <p>Skill plan: choose 2–4 skills that improve readiness for the selected exploration areas, then attach projects, competitions, internships, volunteering or coursework as evidence.</p>}
      {i===17 && <p>Opportunity plan: explore colleges, internships, mentors, professional stories, scholarships and real work exposure. Opportunity discovery should remain current and source-linked.</p>}
      {i===18 && <p>90-day action roadmap: one decision to clarify, one pathway to research deeply, one skill to practise, one person to speak to and one real-world experience to try.</p>}
      {i===19 && <><p>This report is a guidance tool, not a clinical diagnosis, intelligence test, guarantee of career success or substitute for professional counselling. Recommendations are possibilities to explore.</p><p><strong>Recommended conversation:</strong> review the result with a qualified career counsellor, especially before high-stakes education decisions.</p></>}
      {!student && !professional && i===9 && <p>Role alignment should be interpreted alongside the actual job description, observed performance evidence, manager input and organisational context.</p>}
      {professional && i===9 && <p>Role satisfaction and work conditions should be examined separately from personality. A difficult workplace does not necessarily mean the career itself is wrong.</p>}
    </section>)}
  </div>;
}

function StudentContext({ intake, setIntake, age }) {
  const subjects = ['Mathematics','Physics','Chemistry','Biology','Computer Science / IT','Economics','Business Studies','Accountancy','English / Literature','History / Political Science','Geography','Psychology / Sociology','Languages','Fine Arts / Music / Drama','Physical Education'];
  return <>
    <div style={{ ...cardStyle, marginBottom:16 }}><SectionTitle eyebrow="Student context" title="Tell us about the person behind the marks" text="Academic results matter, but they are only one source of evidence. We also look at interests, subject experience, activities, preferences and aspirations."/><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      <Field label="Education stage"><select style={inputStyle} value={intake.educationStage} onChange={e=>setIntake({...intake,educationStage:e.target.value})}><option value="">Select</option>{STUDENT_STAGES.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></Field>
      <Field label="Board / curriculum"><input style={inputStyle} value={intake.board} onChange={e=>setIntake({...intake,board:e.target.value})} placeholder="CBSE, ISC, Karnataka PUC, State Board, IB…" /></Field>
      <Field label="Current class / year"><input style={inputStyle} value={intake.className} onChange={e=>setIntake({...intake,className:e.target.value})} placeholder="Grade 10 / 2nd PUC / BCom Year 2" /></Field>
      <Field label="Current stream / combination"><input style={inputStyle} value={intake.stream} onChange={e=>setIntake({...intake,stream:e.target.value})} placeholder="Commerce CEBA, PCM, Humanities…" /></Field>
      <Field label="Average / recent academic percentage or CGPA"><input type="number" min="0" max="100" style={inputStyle} value={intake.academicAverage} onChange={e=>setIntake({...intake,academicAverage:e.target.value})} /></Field>
      <Field label="School / college"><input style={inputStyle} value={intake.institutionName} onChange={e=>setIntake({...intake,institutionName:e.target.value})} /></Field>
    </div></div>
    <div style={cardStyle}><h3 style={{ margin:'0 0 10px' }}>Subjects you enjoy or feel strongest in</h3><div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>{subjects.map(s=><button key={s} type="button" onClick={()=>setIntake({...intake,likedSubjects:intake.likedSubjects.includes(s)?intake.likedSubjects.filter(x=>x!==s):[...intake.likedSubjects,s]})} style={{ padding:'9px 12px', borderRadius:999, border:'1px solid '+(intake.likedSubjects.includes(s)?'#4f46e5':'#dbe3ef'), background:intake.likedSubjects.includes(s)?'#eef2ff':'#fff', color:intake.likedSubjects.includes(s)?'#4338ca':'#475569', fontWeight:800, cursor:'pointer', fontSize:12 }}>{s}</button>)}</div><Field label="Subjects you dislike or find difficult" hint="optional" ><input style={inputStyle} value={intake.dislikedSubjects.join(', ')} onChange={e=>setIntake({...intake,dislikedSubjects:e.target.value.split(',').map(x=>x.trim()).filter(Boolean)})} placeholder="Separate with commas" /></Field><div style={{ marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}><Field label="Hobbies / interests"><textarea style={{...inputStyle,minHeight:90}} value={intake.hobbies} onChange={e=>setIntake({...intake,hobbies:e.target.value})} placeholder="Sports, gaming, photography, volunteering, coding…" /></Field><Field label="What are you currently curious about?"><textarea style={{...inputStyle,minHeight:90}} value={intake.curiosity} onChange={e=>setIntake({...intake,curiosity:e.target.value})} /></Field></div><div style={{ marginTop:14 }}><Field label="What do you most want help with?"><textarea style={{...inputStyle,minHeight:80}} value={intake.goal} onChange={e=>setIntake({...intake,goal:e.target.value})} placeholder="Stream choice, college, career ideas, changing course, research, etc." /></Field></div></div>
  </>;
}

function ProfessionalContext({ intake, setIntake }) {
  return <div style={cardStyle}><SectionTitle eyebrow="Working professional" title="Understand the career you have now before planning the career you want" text="We separate staying and growing from lateral moves, industry pivots, complete changes, entrepreneurship and return-to-work transitions."/><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
    <Field label="Current job title / role"><input style={inputStyle} value={intake.currentRole} onChange={e=>setIntake({...intake,currentRole:e.target.value})} /></Field>
    <Field label="Organisation / workplace"><input style={inputStyle} value={intake.employer} onChange={e=>setIntake({...intake,employer:e.target.value})} /></Field>
    <Field label="Years of professional experience"><input type="number" style={inputStyle} value={intake.experienceYears} onChange={e=>setIntake({...intake,experienceYears:e.target.value})} /></Field>
    <Field label="Highest qualification"><input style={inputStyle} value={intake.qualification} onChange={e=>setIntake({...intake,qualification:e.target.value})} placeholder="BCom, MBA, MSW, BTech…" /></Field>
    <Field label="What do you actually do in your current role?"><textarea style={{...inputStyle,minHeight:110}} value={intake.dailyDuties} onChange={e=>setIntake({...intake,dailyDuties:e.target.value})} placeholder="Describe the work you do, not just your job title." /></Field>
    <Field label="Current skills"><textarea style={{...inputStyle,minHeight:110}} value={intake.skills} onChange={e=>setIntake({...intake,skills:e.target.value})} placeholder="Technical + interpersonal + domain skills" /></Field>
    <Field label="Primary career intention"><select style={inputStyle} value={intake.professionalIntent} onChange={e=>setIntake({...intake,professionalIntent:e.target.value})}><option value="">Select</option>{PROFESSIONAL_INTENTS.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select></Field>
    <Field label="Work location / mode"><input style={inputStyle} value={intake.workMode} onChange={e=>setIntake({...intake,workMode:e.target.value})} placeholder="Bengaluru · hybrid · remote · field" /></Field>
    <Field label="What is currently working well?"><textarea style={{...inputStyle,minHeight:90}} value={intake.goodParts} onChange={e=>setIntake({...intake,goodParts:e.target.value})} /></Field>
    <Field label="What is currently not working well?"><textarea style={{...inputStyle,minHeight:90}} value={intake.badParts} onChange={e=>setIntake({...intake,badParts:e.target.value})} /></Field>
    <div style={{ gridColumn:'1/-1' }}><Field label="If you want a change, what would you like to move toward?"><textarea style={{...inputStyle,minHeight:90}} value={intake.targetDirection} onChange={e=>setIntake({...intake,targetDirection:e.target.value})} placeholder="Role, industry, function, study path, entrepreneurship, etc." /></Field></div>
  </div></div>;
}

function HRContext({ intake, setIntake }) {
  return <div style={cardStyle}><SectionTitle eyebrow="HR / employer pathway" title="Assess role alignment without turning people into a score" text="The HR module compares an employee's profile with a defined role and highlights evidence, strengths, gaps and development priorities. It is not a hiring or termination decision engine."/><div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
    <Field label="Target role"><input style={inputStyle} value={intake.targetRole} onChange={e=>setIntake({...intake,targetRole:e.target.value})} placeholder="e.g. Senior Project Manager" /></Field>
    <Field label="Department / function"><input style={inputStyle} value={intake.department} onChange={e=>setIntake({...intake,department:e.target.value})} /></Field>
    <div style={{ gridColumn:'1/-1' }}><Field label="Role responsibilities"><textarea style={{...inputStyle,minHeight:110}} value={intake.roleResponsibilities} onChange={e=>setIntake({...intake,roleResponsibilities:e.target.value})} /></Field></div>
    <Field label="Technical competencies required"><textarea style={{...inputStyle,minHeight:90}} value={intake.roleTechnical} onChange={e=>setIntake({...intake,roleTechnical:e.target.value})} /></Field>
    <Field label="Behavioural competencies required"><textarea style={{...inputStyle,minHeight:90}} value={intake.roleBehavioural} onChange={e=>setIntake({...intake,roleBehavioural:e.target.value})} /></Field>
  </div></div>;
}

export default function CareerAssessmentV2({ onComplete, onUnlock }) {
  const [pathway, setPathway] = useState(PATHWAYS.STUDENT);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [report, setReport] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [intake, setIntake] = useState({ dob:'', age:'', ageBand:'', educationStage:'', board:'', className:'', stream:'', academicAverage:'', institutionName:'', likedSubjects:[], dislikedSubjects:[], hobbies:'', curiosity:'', goal:'', institutionId:'', licenseCode:'', currentRole:'', employer:'', experienceYears:'', qualification:'', dailyDuties:'', skills:'', professionalIntent:'', workMode:'', goodParts:'', badParts:'', targetDirection:'', targetRole:'', department:'', roleResponsibilities:'', roleTechnical:'', roleBehavioural:'' });

  const items = useMemo(()=>buildItemSet({ pathway, age:Number(intake.age)||18, paid:true }),[pathway,intake.age]);
  const pageSize = 8;
  const totalPages = Math.ceil(items.length/pageSize);
  const maxStep = totalPages;

  useEffect(()=>{
    try { const saved = JSON.parse(localStorage.getItem('vv_assessment_v2_progress')||'null'); if(saved?.version===ASSESSMENT_VERSION){setAnswers(saved.answers||{});setIntake(saved.intake||intake);setPathway(saved.pathway||PATHWAYS.STUDENT);} } catch(_){}
  },[]);
  useEffect(()=>{ try { localStorage.setItem('vv_assessment_v2_progress',JSON.stringify({version:ASSESSMENT_VERSION,answers,intake,pathway})); } catch(_){} },[answers,intake,pathway]);

  const start = () => {
    setError('');
    const age = calculateAge(intake.dob);
    if (age == null || age < 13) { setError('VidyaVantage Career Discovery is currently available from age 13. Please enter a valid Date of Birth.'); return; }
    setIntake(x=>({...x,age,ageBand:ageBandFor(age)}));
    setStep(1);
  };

  const currentItems = items.slice((step-1)*pageSize, step*pageSize);
  const answeredCount = items.filter(i=>answers[i.id]!==undefined).length;
  const progress = Math.round((answeredCount/items.length)*100);

  const submit = async () => {
    setSaving(true); setError('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in before submitting your assessment.');
      const token = await user.getIdToken();
      const response = await fetch('/api/career/submit-v2',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({pathway,intake,answers,reportTier:'free'})});
      const data = await response.json();
      if(!response.ok) throw new Error(data?.error||'Unable to save your assessment.');
      localStorage.removeItem('vv_assessment_v2_progress');
      setReport(data.report);
      onComplete?.(data.report);
    } catch(err){ setError(err.message||'Unable to submit assessment.'); }
    finally{ setSaving(false); }
  };

  const setAnswer = (id,value) => setAnswers(a=>({...a,[id]:value}));

  if (report) return <ReportPreview report={report} onUnlock={()=>onUnlock?.(report)} />;

  return <div style={{ maxWidth:1100, margin:'0 auto', padding:'10px 0 80px' }}>
    <div style={{ ...cardStyle, background:'linear-gradient(135deg,#0f172a,#1e293b)', color:'#fff', marginBottom:16 }}>
      <div style={{ color:'#fbbf24', fontSize:11, fontWeight:900, letterSpacing:1.5 }}>VIDYAVANTAGE · CAREER DISCOVERY ASSESSMENT V{ASSESSMENT_VERSION}</div>
      <h1 style={{ margin:'8px 0 5px', fontSize:34, fontWeight:950 }}>A career assessment that starts with the person.</h1>
      <p style={{ margin:0, color:'#cbd5e1', lineHeight:1.7 }}>Interests + personality + values + reasoning + readiness + context. The system adapts the experience to age and life stage.</p>
    </div>

    {step===0 && <>
      <div style={cardStyle}><SectionTitle eyebrow="Choose your journey" title="What brings you to VidyaVantage?" text="The measurement modules overlap where useful, but the context questions change because a 15-year-old choosing a stream and a 35-year-old considering a career pivot are solving different problems."/><div style={{ display:'grid', gridTemplateColumns:'repeat(3,minmax(0,1fr))', gap:12 }}>{[[PATHWAYS.STUDENT,'🎓','Student','Age 13+ · school, PUC, degree, postgraduate, research or education transition'],[PATHWAYS.PROFESSIONAL,'💼','Working professional','Current role · duties · qualifications · stay/grow · pivot · entrepreneurship'],[PATHWAYS.HR,'🏢','HR / role alignment','Employee development · internal mobility · role requirements · succession planning']].map(([id,icon,title,text])=><button key={id} onClick={()=>setPathway(id)} style={{ textAlign:'left', padding:18, borderRadius:15, border:'2px solid '+(pathway===id?'#4f46e5':'#e2e8f0'), background:pathway===id?'#eef2ff':'#fff', cursor:'pointer' }}><div style={{ fontSize:28 }}>{icon}</div><strong style={{ display:'block', marginTop:8, color:'#0f172a' }}>{title}</strong><span style={{ display:'block', marginTop:5, color:'#64748b', fontSize:12, lineHeight:1.5 }}>{text}</span></button>)}</div></div>
      <div style={{ ...cardStyle, marginTop:16 }}><SectionTitle eyebrow="Required first step" title="Date of Birth" text="We use exact age to select age-appropriate language and question pathways. Students under 18 will be handled through the platform's minor-consent workflow."/><div style={{ maxWidth:430 }}><Field label="Date of Birth"><input type="date" style={inputStyle} value={intake.dob} onChange={e=>setIntake({...intake,dob:e.target.value})} /></Field>{intake.dob && <div style={{ marginTop:10, color:'#475569', fontSize:13 }}>Calculated age: <strong>{calculateAge(intake.dob)}</strong></div>}</div>{error && <div style={{ marginTop:15, padding:13, background:'#fef2f2', color:'#991b1b', borderRadius:10, fontWeight:700 }}>{error}</div>}<button onClick={start} style={{ marginTop:20, border:0, borderRadius:12, padding:'14px 22px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'#fff', fontWeight:900, cursor:'pointer' }}>Continue →</button></div>
    </>}

    {step===1 && <>
      <div style={{ ...cardStyle, marginBottom:16 }}><div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'center', flexWrap:'wrap' }}><div><div style={{ color:'#4f46e5', fontSize:11, fontWeight:900 }}>CONTEXT · AGE {intake.age}</div><h2 style={{ margin:'5px 0' }}>Let's understand your situation first.</h2><p style={{ margin:0, color:'#64748b', fontSize:13 }}>This information is contextual; it is not treated as a personality score.</p></div><div style={{ fontWeight:900, color:'#4f46e5' }}>{progress}% complete</div></div></div>
      {pathway===PATHWAYS.STUDENT ? <StudentContext intake={intake} setIntake={setIntake} age={intake.age}/> : pathway===PATHWAYS.PROFESSIONAL ? <ProfessionalContext intake={intake} setIntake={setIntake}/> : <HRContext intake={intake} setIntake={setIntake}/>} 
      <div style={{ marginTop:16, display:'flex', justifyContent:'flex-end' }}><button onClick={()=>setStep(2)} style={{ border:0, borderRadius:12, padding:'14px 22px', background:'#0f172a', color:'#fff', fontWeight:900, cursor:'pointer' }}>Start assessment modules →</button></div>
    </>}

    {step>=2 && <>
      <div style={{ ...cardStyle, marginBottom:16, position:'sticky', top:10, zIndex:5 }}><div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:16 }}><div><div style={{ color:'#4f46e5', fontSize:11, fontWeight:900 }}>ASSESSMENT MODULES</div><strong>{items.slice((step-2)*pageSize,(step-1)*pageSize)[0]?.domain ? DOMAINS.find(d=>d.id===items.slice((step-2)*pageSize,(step-1)*pageSize)[0].domain)?.label : 'Career assessment'}</strong></div><div style={{ color:'#64748b', fontSize:12, fontWeight:800 }}>Module page {step-1} / {maxStep-1} · {answeredCount}/{items.length} answered</div></div><div style={{ height:7, background:'#e2e8f0', borderRadius:99, marginTop:10 }}><div style={{ width:`${progress}%`, height:'100%', borderRadius:99, background:'linear-gradient(90deg,#4f46e5,#7c3aed)' }} /></div></div>
      <div style={{ display:'grid', gap:12 }}>{currentItems.map((item,index)=><div key={item.id} style={cardStyle}><div style={{ color:'#94a3b8', fontSize:10, fontWeight:900, letterSpacing:1 }}>QUESTION {(step-2)*pageSize+index+1}</div><div style={{ color:'#0f172a', fontSize:16, lineHeight:1.6, fontWeight:800, margin:'8px 0 15px' }}>{item.question}</div>{item.type==='likert5' ? <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>{item.options.map((o,i)=><button key={o} onClick={()=>setAnswer(item.id,i+1)} style={{ minHeight:54, padding:'8px 5px', borderRadius:10, border:'2px solid '+(answers[item.id]===i+1?'#4f46e5':'#e2e8f0'), background:answers[item.id]===i+1?'#eef2ff':'#fff', color:answers[item.id]===i+1?'#4338ca':'#475569', fontSize:11, fontWeight:800, cursor:'pointer' }}>{o}</button>)}</div> : <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>{item.options.map((o,i)=><button key={o} onClick={()=>setAnswer(item.id,i)} style={{ textAlign:'left', padding:'12px 13px', borderRadius:10, border:'2px solid '+(answers[item.id]===i?'#4f46e5':'#e2e8f0'), background:answers[item.id]===i?'#eef2ff':'#fff', color:'#334155', fontWeight:700, cursor:'pointer' }}>{String.fromCharCode(65+i)}. {o}</button>)}</div>}</div>)}</div>
      {error && <div style={{ marginTop:15, padding:13, background:'#fef2f2', color:'#991b1b', borderRadius:10, fontWeight:700 }}>{error}</div>}
      <div style={{ display:'flex', justifyContent:'space-between', gap:12, marginTop:18 }}><button onClick={()=>setStep(Math.max(2,step-1))} style={{ padding:'12px 18px', border:'1px solid #cbd5e1', borderRadius:12, background:'#fff', fontWeight:800, cursor:'pointer' }}>← Previous</button>{step<maxStep ? <button onClick={()=>setStep(step+1)} style={{ border:0, borderRadius:12, padding:'13px 20px', background:'#0f172a', color:'#fff', fontWeight:900, cursor:'pointer' }}>Next →</button> : <button onClick={submit} disabled={saving} style={{ border:0, borderRadius:12, padding:'13px 22px', background:saving?'#94a3b8':'linear-gradient(135deg,#16a34a,#15803d)', color:'#fff', fontWeight:900, cursor:saving?'wait':'pointer' }}>{saving?'Preparing your report…':'Complete & Generate My Report'}</button>}</div>
    </>}
  </div>;
}
