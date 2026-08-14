import React, { useEffect, useMemo, useState } from 'react';
import { canonicalAssessmentQuestions } from './assessmentQuestionCatalog';
import { ASSESSMENT_STAGES, advanceAssessment, getAssessmentStages, getProgress } from './assessmentFlow';
import { createAssessmentAttempt, loadAssessmentAttempt, saveAssessmentProgress } from './assessmentPersistence';

const LIKERT = [
  { value: 1, label: 'Not like me' },
  { value: 2, label: 'A little' },
  { value: 3, label: 'Sometimes' },
  { value: 4, label: 'Often' },
  { value: 5, label: 'Very much' },
];

const GOALS = ['Financial growth', 'Stability', 'Creativity', 'Independence', 'Leadership', 'Helping people', 'Social impact', 'Flexible lifestyle', 'Entrepreneurship', 'Continuous learning'];
const SUBJECTS = ['Mathematics', 'Science', 'Biology', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Languages', 'Social Science', 'Economics', 'Business Studies', 'Psychology', 'Art & Design', 'Physical Education'];
const INTEREST_TAGS = ['Technology', 'People', 'Nature', 'Business', 'Design', 'Writing', 'Research', 'Teaching', 'Health', 'Media', 'Law', 'Finance', 'Travel', 'Building things'];

function ToggleChips({ values, selected = [], onChange, max }) {
  const toggle = (value) => {
    if (selected.includes(value)) onChange(selected.filter((x) => x !== value));
    else if (!max || selected.length < max) onChange([...selected, value]);
  };
  return <div className="ca-v2-chips">{values.map((value) => <button type="button" key={value} className={`ca-v2-chip ${selected.includes(value) ? 'selected' : ''}`} onClick={() => toggle(value)}>{value}</button>)}</div>;
}

export default function CareerAssessmentV2({ userId, existingAttemptId = null, onComplete }) {
  const [attemptId] = useState(existingAttemptId || (globalThis.crypto?.randomUUID?.() || `career_${Date.now()}`));
  const [status, setStatus] = useState('');
  const [age, setAge] = useState('');
  const [stageIndex, setStageIndex] = useState(0);
  const [input, setInput] = useState({ likes: [], dislikes: [], goals: [], favouriteSubjects: [], marks: {}, interests: [] });
  const [answers, setAnswers] = useState({});
  const [session, setSession] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(existingAttemptId));
  const [error, setError] = useState('');

  const stages = useMemo(() => getAssessmentStages(status), [status]);
  const stage = stages[stageIndex] || stages[0];
  const questions = useMemo(() => canonicalAssessmentQuestions.filter((q) => {
    if (stage?.id === 'interests') return q.dimension === 'interests';
    if (stage?.id === 'aptitude') return q.dimension === 'aptitude_confidence';
    if (stage?.id === 'work_style') return q.dimension === 'work_style';
    if (stage?.id === 'values') return q.dimension === 'values' || q.dimension === 'motivation';
    if (stage?.id === 'decision') return q.dimension === 'decision_maturity';
    if (stage?.id === 'resilience') return q.dimension === 'resilience';
    if (stage?.id === 'scenarios') return q.section === 'extracurricular';
    return false;
  }), [stage]);

  useEffect(() => {
    let cancelled = false;
    async function resume() {
      if (!existingAttemptId || !userId) return;
      try {
        const saved = await loadAssessmentAttempt(existingAttemptId, userId);
        if (!saved || cancelled) return;
        setStatus(saved.status || '');
        setAge(String(saved.age || ''));
        setInput(saved.input || {});
        setAnswers(saved.answers || {});
        const savedStages = getAssessmentStages(saved.status || 'student');
        const index = savedStages.findIndex((x) => x.id === saved.currentStage);
        setStageIndex(index >= 0 ? index : 0);
        setSession(saved);
      } catch (e) { if (!cancelled) setError(e.message || 'Could not resume the assessment.'); }
      finally { if (!cancelled) setLoading(false); }
    }
    resume();
    return () => { cancelled = true; };
  }, [existingAttemptId, userId]);

  const updateAnswer = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }));
  const updateInput = (key, value) => setInput((prev) => ({ ...prev, [key]: value }));

  const canContinue = () => {
    if (stage.id === 'identity') return Boolean(status && age && Number(age) >= 10 && Number(age) <= 100);
    if (stage.id === 'likes') return input.likes.length > 0;
    if (stage.id === 'dislikes') return input.dislikes.length > 0;
    if (stage.id === 'goals') return input.goals.length > 0;
    if (stage.id === 'academic') return status !== 'student' || input.favouriteSubjects.length > 0;
    return questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');
  };

  async function persist(nextStageIndex, completedStageIds, completed = false) {
    setSaving(true); setError('');
    try {
      if (!session) {
        const created = await createAssessmentAttempt({ personId: userId, status, age: Number(age), attemptId, input, answers });
        setSession(created);
      }
      const nextStage = stages[nextStageIndex] || stage;
      await saveAssessmentProgress({ attemptId, personId: userId, input, answers, currentStage: nextStage.id, completedStageIds, completed });
    } catch (e) { setError(e.message || 'Your progress could not be saved.'); throw e; }
    finally { setSaving(false); }
  }

  async function next() {
    if (!canContinue()) { setError('Please complete this section before continuing.'); return; }
    const advanced = advanceAssessment({ ...(session || { status, completedStageIds: [] }) }, stage.id);
    const nextIndex = Math.min(stageIndex + 1, stages.length - 1);
    const completed = nextIndex === stages.length - 1 && stageIndex === stages.length - 1;
    try {
      await persist(nextIndex, advanced.completedStageIds, completed);
      if (completed) onComplete?.({ attemptId });
      else setStageIndex(nextIndex);
    } catch (_) { /* error already shown */ }
  }

  if (loading) return <div className="ca-v2-loading">Loading your saved assessment…</div>;

  return <div className="ca-v2-root">
    <style>{`
      .ca-v2-root{min-height:100vh;background:#fdf8f1;color:#21170f;font-family:Inter,system-ui,sans-serif;padding-bottom:70px}.ca-v2-head{background:#21170f;color:white;padding:24px clamp(20px,5vw,70px);position:sticky;top:0;z-index:5}.ca-v2-brand{font-family:Georgia,serif;font-size:25px}.ca-v2-brand span{color:#f0a500}.ca-v2-progress{height:7px;background:#3a2a1e;border-radius:20px;margin-top:18px;overflow:hidden}.ca-v2-progress>div{height:100%;background:linear-gradient(90deg,#e8650a,#f0a500);transition:width .3s}.ca-v2-body{max-width:900px;margin:0 auto;padding:42px 20px}.ca-v2-stage{color:#e8650a;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1.4px}.ca-v2-title{font:700 38px Georgia,serif;margin:9px 0}.ca-v2-sub{color:#756454;line-height:1.6;margin-bottom:30px}.ca-v2-card{background:white;border:1px solid #eadfd2;border-radius:20px;padding:25px;margin:16px 0;box-shadow:0 5px 20px rgba(40,25,10,.05)}.ca-v2-label{font-weight:700;margin-bottom:12px;display:block}.ca-v2-input{width:100%;padding:13px 15px;border:2px solid #e7ddd2;border-radius:12px;font-size:16px}.ca-v2-chips{display:flex;flex-wrap:wrap;gap:10px}.ca-v2-chip{border:2px solid #e5d9cb;background:white;border-radius:30px;padding:10px 15px;cursor:pointer}.ca-v2-chip.selected{background:#0a5c63;border-color:#0a5c63;color:white}.ca-v2-q{font-weight:650;line-height:1.55;margin-bottom:17px}.ca-v2-likert{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.ca-v2-likert button{padding:11px 4px;border:2px solid #eadfd2;background:white;border-radius:10px;cursor:pointer;font-size:12px}.ca-v2-likert button.selected{background:#e8650a;border-color:#e8650a;color:white}.ca-v2-nav{display:flex;justify-content:space-between;gap:15px;margin-top:30px}.ca-v2-btn{border:0;border-radius:40px;padding:14px 26px;font-weight:800;cursor:pointer}.ca-v2-btn.back{background:white;border:2px solid #dfd1c3}.ca-v2-btn.next{background:linear-gradient(135deg,#e8650a,#f0a500);color:white}.ca-v2-btn:disabled{opacity:.45;cursor:not-allowed}.ca-v2-error{background:#fff0ef;color:#8b1a1a;border:1px solid #e2aaa5;padding:13px;border-radius:12px;margin:15px 0}.ca-v2-loading{text-align:center;padding:100px 20px;color:#756454}
      @media(max-width:650px){.ca-v2-title{font-size:30px}.ca-v2-likert{grid-template-columns:1fr}.ca-v2-head{padding:18px 20px}}
    `}</style>
    <header className="ca-v2-head"><div className="ca-v2-brand">Vidya<span>Vantage</span></div><div className="ca-v2-progress"><div style={{ width: `${getProgress(stage.id, status || 'student')}%` }} /></div></header>
    <main className="ca-v2-body">
      <div className="ca-v2-stage">Step {stageIndex + 1} of {stages.length}</div>
      <h1 className="ca-v2-title">{stage.title}</h1><p className="ca-v2-sub">{stage.subtitle}</p>
      {error && <div className="ca-v2-error">{error}</div>}
      {stage.id === 'identity' && <div className="ca-v2-card">
        <label className="ca-v2-label">I am currently…</label>
        <div className="ca-v2-chips"><button className={`ca-v2-chip ${status === 'student' ? 'selected' : ''}`} onClick={() => setStatus('student')}>🎓 A Student</button><button className={`ca-v2-chip ${status === 'working_professional' ? 'selected' : ''}`} onClick={() => setStatus('working_professional')}>💼 A Working Professional</button></div>
        <label className="ca-v2-label" style={{marginTop:25}}>My age</label><input className="ca-v2-input" type="number" min="10" max="100" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age" />
      </div>}
      {stage.id === 'likes' && <div className="ca-v2-card"><label className="ca-v2-label">Which areas genuinely interest you? Choose as many as you like.</label><ToggleChips values={INTEREST_TAGS} selected={input.likes} onChange={(v) => updateInput('likes', v)} /></div>}
      {stage.id === 'dislikes' && <div className="ca-v2-card"><label className="ca-v2-label">Which areas do you usually avoid or enjoy less?</label><ToggleChips values={INTEREST_TAGS} selected={input.dislikes} onChange={(v) => updateInput('dislikes', v)} /></div>}
      {stage.id === 'goals' && <div className="ca-v2-card"><label className="ca-v2-label">What would you like your future to give you?</label><ToggleChips values={GOALS} selected={input.goals} onChange={(v) => updateInput('goals', v)} /></div>}
      {stage.id === 'academic' && <div className="ca-v2-card"><label className="ca-v2-label">Which subjects do you enjoy most?</label><ToggleChips values={SUBJECTS} selected={input.favouriteSubjects} onChange={(v) => updateInput('favouriteSubjects', v)} /><label className="ca-v2-label" style={{marginTop:25}}>Add marks/percentage if you want us to consider your academic context.</label>{input.favouriteSubjects.map((subject) => <div key={subject} style={{display:'flex',gap:10,marginBottom:9}}><span style={{flex:1,padding:12}}>{subject}</span><input className="ca-v2-input" style={{maxWidth:150}} type="number" min="0" max="100" placeholder="%" value={input.marks?.[subject] || ''} onChange={(e) => updateInput('marks', {...input.marks, [subject]: e.target.value})}/></div>)}</div>}
      {questions.map((q, i) => <div className="ca-v2-card" key={q.id}><div className="ca-v2-q">{i + 1}. {q.question}</div>{q.type === 'scale' ? <div className="ca-v2-likert">{LIKERT.map((x) => <button type="button" key={x.value} className={Number(answers[q.id]) === x.value ? 'selected' : ''} onClick={() => updateAnswer(q.id, x.value)}>{x.value}<br/><small>{x.label}</small></button>)}</div> : <div className="ca-v2-chips">{q.options.map((option) => <button type="button" key={option} className={`ca-v2-chip ${answers[q.id] === option ? 'selected' : ''}`} onClick={() => updateAnswer(q.id, option)}>{option}</button>)}</div>}</div>)}
      <div className="ca-v2-nav"><button className="ca-v2-btn back" disabled={stageIndex === 0 || saving} onClick={() => setStageIndex((x) => Math.max(0, x - 1))}>← Back</button><button className="ca-v2-btn next" disabled={saving || !canContinue()} onClick={next}>{saving ? 'Saving…' : stageIndex === stages.length - 1 ? 'Complete Assessment' : 'Save & Continue →'}</button></div>
    </main>
  </div>;
}
