import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { getCareerCase, createCareerNote } from '../../platform/careerCaseApi';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'assessment', label: 'Career DNA', icon: '🧬' },
  { id: 'notes', label: 'Counsellor Notes', icon: '📝' },
  { id: 'roadmaps', label: 'Roadmaps', icon: '🗺️' },
];

const formatDate = value => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getName = student => student?.identity?.fullName || student?.name || student?.studentName || 'Student';
const getGrade = student => student?.academic?.current?.grade || student?.grade || student?.class || 'N/A';
const getSchool = student => student?.institution?.name || student?.schoolName || student?.school?.name || 'School not set';
const getRiasec = student => student?.career?.profile?.riasec?.code || student?.career?.riasec?.code || student?.careerDNA?.riasec?.code || student?.riasecCode || null;
const getScores = student => student?.career?.profile?.riasec?.scores || student?.career?.riasec?.scores || student?.careerDNA?.riasec?.scores || student?.riasecScores || null;

export default function CareerCaseFileViewSecure({ studentId }) {
  const { navigate } = useDashboard();
  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [message, setMessage] = useState(null);
  const [note, setNote] = useState({ type: 'session', title: '', content: '', followUpDate: '' });

  const loadCase = useCallback(async () => {
    if (!studentId) return;
    setLoading(true);
    setMessage(null);
    try {
      const data = await getCareerCase(studentId);
      setCaseData(data);
    } catch (error) {
      console.error('[CareerCaseFile] load failed:', error);
      setCaseData(null);
      setMessage({ type: 'error', text: error.message || 'Unable to load this career case.' });
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => { loadCase(); }, [loadCase]);

  const student = caseData?.student || null;
  const notes = Array.isArray(caseData?.notes) ? caseData.notes : [];
  const roadmaps = Array.isArray(caseData?.roadmaps) ? caseData.roadmaps : [];
  const code = getRiasec(student);
  const scores = getScores(student);
  const latestRoadmap = roadmaps[0];
  const completedPhases = useMemo(() => latestRoadmap?.phases ? Object.values(latestRoadmap.phases).filter(v => String(v || '').trim()).length : 0, [latestRoadmap]);

  const handleSaveNote = async event => {
    event.preventDefault();
    if (!note.content.trim()) {
      setMessage({ type: 'error', text: 'Please enter the note content before saving.' });
      return;
    }
    setSavingNote(true);
    setMessage(null);
    try {
      await createCareerNote(studentId, note);
      setNote({ type: 'session', title: '', content: '', followUpDate: '' });
      await loadCase();
      setActiveTab('notes');
      setMessage({ type: 'success', text: 'Counsellor note saved securely.' });
    } catch (error) {
      console.error('[CareerCaseFile] note save failed:', error);
      setMessage({ type: 'error', text: error.message || 'The note could not be saved.' });
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" /></div>;
  if (!student) return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm"><div className="text-4xl">🔒</div><h1 className="mt-4 text-xl font-black text-slate-900">Case unavailable</h1><p className="mt-2 text-sm leading-relaxed text-slate-500">{message?.text || 'This student record could not be loaded.'}</p><button onClick={() => navigate('/provider/career')} className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Back to My Students</button></div></div>;

  const name = getName(student);
  return <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800">
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-5 py-4 shadow-sm backdrop-blur md:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><button onClick={() => navigate('/provider/career')} className="font-semibold text-slate-500 hover:text-indigo-600">← Back to My Students</button><button onClick={loadCase} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">↻ Refresh Case</button></div></header>
    <main className="mx-auto max-w-7xl space-y-6 px-5 py-6 md:px-8 md:py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-center"><div className="flex items-center gap-5"><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-2xl font-black text-white">{name.charAt(0).toUpperCase()}</div><div><div className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Career Guidance Case</div><h1 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">{name}</h1><div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-slate-500"><span>🏫 {getSchool(student)}</span><span>🎓 {getGrade(student)}</span><span>🆔 {student.id || studentId}</span></div></div></div><div className="rounded-xl border border-indigo-100 bg-indigo-50 px-7 py-4 text-center"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">Career DNA</div><div className="mt-1 text-2xl font-black tracking-widest text-indigo-700">{code || 'Pending'}</div></div></div></section>
      {message && <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{message.text}</div>}
      <nav className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm md:grid-cols-4">{TABS.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-xl px-4 py-3 text-sm font-bold transition ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}><span className="mr-2">{tab.icon}</span>{tab.label}</button>)}</nav>
      {activeTab === 'overview' && <div className="grid gap-6 lg:grid-cols-3"><div className="space-y-6 lg:col-span-2"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-black text-slate-900">Case Snapshot</h2><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{[['🧬', code || 'Pending', 'Career DNA'], ['📝', notes.length, 'Notes'], ['🗺️', roadmaps.length, 'Roadmaps'], ['📊', `${completedPhases}/5`, 'Latest roadmap']].map(([icon, value, label]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><div className="text-xl">{icon}</div><div className="mt-2 text-xl font-black text-slate-900">{value}</div><div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div></div>)}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-black text-slate-900">Latest Counsellor Activity</h2><div className="mt-5 space-y-3">{notes.slice(0, 3).map(item => <article key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between gap-4"><span className="text-xs font-black uppercase tracking-wide text-indigo-600">{item.type || 'note'}</span><span className="text-xs font-semibold text-slate-400">{formatDate(item.createdAt)}</span></div><div className="mt-1 font-bold text-slate-800">{item.title}</div><p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.content}</p></article>)}{!notes.length && <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No counsellor notes yet.</div>}</div></section></div><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-black text-slate-900">Quick Actions</h2><div className="mt-5 space-y-3"><button onClick={() => setActiveTab('notes')} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-left text-sm font-bold text-white hover:bg-indigo-700">📝 Add Counsellor Note</button><button onClick={() => navigate(`/provider/career/roadmap/${studentId}`)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">🗺️ Build Career Roadmap</button><button onClick={() => setActiveTab('assessment')} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">🧬 Review Career DNA</button></div><div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500"><div className="font-bold text-slate-700">Privacy boundary</div>This case is visible only to authorised professionals assigned to the student's career pathway and Super Admin.</div></section></div>}
      {activeTab === 'assessment' && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center"><div><h2 className="text-xl font-black text-slate-900">Career DNA — RIASEC</h2><p className="mt-1 text-sm text-slate-500">Assessment information returned by the authorised career case API.</p></div><div className="rounded-xl bg-indigo-50 px-6 py-3 text-center"><div className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Code</div><div className="text-2xl font-black tracking-widest text-indigo-700">{code || 'Pending'}</div></div></div>{scores && typeof scores === 'object' ? <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{Object.entries(scores).map(([key, value]) => <div key={key} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center"><div className="text-xs font-black uppercase text-slate-400">{key}</div><div className="mt-2 text-2xl font-black text-indigo-700">{String(value)}</div></div>)}</div> : <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-10 text-center"><div className="text-3xl">🧬</div><div className="mt-2 font-bold text-slate-800">{code ? 'RIASEC code available' : 'Assessment pending'}</div><p className="mt-1 text-sm text-slate-500">No detailed score breakdown is available in the authorised profile.</p></div>}</section>}
      {activeTab === 'notes' && <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><h2 className="text-xl font-black text-slate-900">Add Counsellor Note</h2><p className="mt-1 text-sm text-slate-500">Record professional observations, goals, decisions and follow-up actions.</p><form onSubmit={handleSaveNote} className="mt-6 space-y-4"><div className="grid gap-4 md:grid-cols-2"><label className="text-xs font-bold text-slate-500">Note type<select value={note.type} onChange={e => setNote(v => ({ ...v, type: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"><option value="session">Session</option><option value="goal">Goal</option><option value="observation">Observation</option><option value="follow_up">Follow-up</option></select></label><label className="text-xs font-bold text-slate-500">Follow-up date<input type="date" value={note.followUpDate} onChange={e => setNote(v => ({ ...v, followUpDate: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700" /></label></div><label className="block text-xs font-bold text-slate-500">Title<input value={note.title} onChange={e => setNote(v => ({ ...v, title: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700" placeholder="Career counselling note" /></label><label className="block text-xs font-bold text-slate-500">Content<textarea required rows={9} value={note.content} onChange={e => setNote(v => ({ ...v, content: e.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700" placeholder="Record the professional note..." /></label><button disabled={savingNote} className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:opacity-50">{savingNote ? 'Saving securely…' : 'Save Counsellor Note'}</button></form></section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><h2 className="text-xl font-black text-slate-900">Previous Notes</h2><div className="mt-5 space-y-3">{notes.map(item => <article key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between gap-4"><span className="text-xs font-black uppercase text-indigo-600">{item.type || 'note'}</span><span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span></div><div className="mt-1 font-bold text-slate-800">{item.title || 'Career counselling note'}</div><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{item.content}</p></article>)}{!notes.length && <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No notes recorded.</div>}</div></section></div>}
      {activeTab === 'roadmaps' && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-black text-slate-900">Career Roadmaps</h2><p className="mt-1 text-sm text-slate-500">Only roadmaps returned by the authorised career API are shown.</p></div><button onClick={() => navigate(`/provider/career/roadmap/${studentId}`)} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white">Build Roadmap</button></div><div className="mt-6 space-y-4">{roadmaps.map(item => <article key={item.id} className="rounded-xl border border-slate-200 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="font-black text-slate-900">Career Roadmap</div><span className={`rounded-full px-3 py-1 text-xs font-black ${String(item.status).toLowerCase() === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{item.status || 'Draft'}</span></div><div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">{Object.entries(item.phases || {}).map(([phase, value]) => <div key={phase} className="rounded-lg bg-slate-50 p-3"><div className="text-[10px] font-black uppercase text-slate-400">{phase}</div><div className="mt-1 text-sm text-slate-700">{value || '—'}</div></div>)}</div><div className="mt-3 text-xs text-slate-400">Updated {formatDate(item.updatedAt || item.createdAt)}</div></article>)}{!roadmaps.length && <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No career roadmap has been created yet.</div>}</div></section>}
    </main>
  </div>;
}
