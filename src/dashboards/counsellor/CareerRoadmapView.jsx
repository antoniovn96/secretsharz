import React, { useEffect, useState } from 'react';
import { getCareerCase, saveCareerRoadmap } from '../../platform/careerCaseApi';
import { useDashboard } from '../../context/DashboardContext';

const EMPTY_ROADMAP = { phase1_unlock: '', phase2_explore: '', phase3_expand: '', phase4_inspire: '', phase5_ignite: '' };
const phases = [
  ['phase1_unlock', 'Phase 1: Unlock', 'Self-Discovery', 'RIASEC profile, strengths, interests and motivations.'],
  ['phase2_explore', 'Phase 2: Explore', 'Career Matches', '3–5 specific career pathways worth investigating.'],
  ['phase3_expand', 'Phase 3: Expand', 'Skill Development', 'Courses, certifications, projects and extracurricular development.'],
  ['phase4_inspire', 'Phase 4: Inspire', 'Mentorship & Shadowing', 'Professionals, informational interviews, shadowing or internships.'],
  ['phase5_ignite', 'Phase 5: Ignite', 'College & Applications', 'Target institutions, tests, prerequisites and application timeline.']
];

const CareerRoadmapView = ({ studentId }) => {
  const { navigate } = useDashboard();
  const [studentData, setStudentData] = useState(null);
  const [roadmap, setRoadmap] = useState(EMPTY_ROADMAP);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadStudent = async () => {
      if (!studentId) return;
      setLoading(true);
      setAccessDenied(false);
      try {
        const data = await getCareerCase(studentId);
        if (cancelled) return;
        setStudentData(data?.student || null);
        const latest = Array.isArray(data?.roadmaps) ? data.roadmaps[0] : null;
        if (latest?.phases) setRoadmap({ ...EMPTY_ROADMAP, ...latest.phases });
      } catch (error) {
        if (cancelled) return;
        const denied = /denied|authori[sz]ed|forbidden/i.test(error.message || '');
        setAccessDenied(denied);
        setMessage({ type: 'error', text: error.message || 'Unable to load this career roadmap.' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadStudent();
    return () => { cancelled = true; };
  }, [studentId]);

  const handleSave = async event => {
    event.preventDefault();
    if (!Object.values(roadmap).some(value => value.trim())) return setMessage({ type: 'error', text: 'Please complete at least one roadmap phase before publishing.' });
    setSaving(true); setMessage(null);
    try {
      await saveCareerRoadmap(studentId, roadmap, 'Published');
      setMessage({ type: 'success', text: 'Career roadmap securely published.' });
    } catch (error) {
      console.error('[CareerRoadmap] save failed:', error);
      setMessage({ type: 'error', text: error.message || 'The roadmap could not be published. Please try again.' });
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" /></div>;
  if (accessDenied) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"><div className="text-4xl mb-3">🔒</div><h1 className="text-xl font-black text-slate-900">Roadmap access restricted</h1><p className="mt-2 text-sm leading-6 text-slate-600">{message?.text || 'This student is not assigned to your career-guidance account.'}</p><button onClick={() => navigate('/provider/career')} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Back to My Students</button></div></div>;
  if (!studentData) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"><div className="text-4xl mb-3">⚠️</div><h1 className="text-xl font-black text-slate-900">Student unavailable</h1><p className="mt-2 text-sm text-slate-600">The student case could not be loaded.</p><button onClick={() => navigate('/provider/career')} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Back to My Students</button></div></div>;

  const studentName = studentData?.identity?.fullName || studentData?.name || studentData?.studentName || 'Student';
  const school = studentData?.institution?.name || studentData?.schoolName || studentData?.school?.name || 'N/A';
  const grade = studentData?.academic?.current?.grade || studentData?.grade || studentData?.class || 'N/A';
  const riasecCode = studentData?.career?.profile?.riasec?.code || studentData?.career?.riasec?.code || studentData?.careerDNA?.riasec?.code || studentData?.riasecCode || 'Pending';

  return <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800">
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:px-8"><button onClick={() => navigate(`/provider/career/case/${studentId}`)} className="font-semibold text-slate-500 hover:text-indigo-600">← Back to Student Case</button><span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Career Roadmap Builder</span></header>
    <main className="mx-auto max-w-5xl space-y-6 px-5 py-8 md:px-8">
      <section className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8"><div className="flex items-center gap-5"><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-3xl font-black text-indigo-600">{studentName.charAt(0).toUpperCase()}</div><div><div className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Student</div><h1 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">{studentName}</h1><div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-slate-500"><span>🏫 {school}</span><span>🎓 {grade}</span></div></div></div><div className="rounded-xl border border-indigo-100 bg-indigo-50 px-7 py-4 text-center"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">Career DNA</div><div className="mt-1 text-2xl font-black tracking-widest text-indigo-700">{riasecCode}</div></div></section>
      {message && <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{message.text}</div>}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><div className="mb-8 border-b border-slate-100 pb-6"><h2 className="text-2xl font-black text-slate-900">🗺️ Strategic Career Roadmap</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">Build an actionable five-phase plan that translates the student's profile into concrete career-development steps.</p></div><form onSubmit={handleSave} className="space-y-8">{phases.map(([key,title,badge,description]) => <div key={key}><label className="flex flex-wrap items-center gap-2 text-lg font-black text-slate-800">{title}<span className="rounded bg-indigo-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-600">{badge}</span></label><p className="mt-1 text-sm text-slate-500">{description}</p><textarea name={key} value={roadmap[key]} onChange={event => setRoadmap(current => ({ ...current, [key]: event.target.value }))} rows={4} className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100" /></div>)}<div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between"><div /><button disabled={saving} type="submit" className="rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-7 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Publishing securely…' : '🚀 Publish Career Roadmap'}</button></div></form></section>
    </main>
  </div>;
};

export default CareerRoadmapView;
