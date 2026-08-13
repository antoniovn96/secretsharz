import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'assessment', label: 'Career DNA', icon: '🧬' },
  { id: 'notes', label: 'Counsellor Notes', icon: '📝' },
  { id: 'roadmaps', label: 'Roadmaps', icon: '🗺️' }
];

function formatDate(value) {
  if (!value) return '—';
  const date = value?.toDate ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function studentName(student) { return student?.name || student?.studentName || student?.profile?.name || 'Student'; }
function studentGrade(student) { return student?.grade || student?.class || student?.school?.grade || 'N/A'; }
function studentSchool(student) { return student?.schoolName || student?.school?.name || student?.school?.schoolId || student?.school || 'School not set'; }
function getRiasec(student) { return student?.careerDNA?.riasec?.code || student?.riasecCode || student?.careerAssessment?.riasecCode || null; }
function getRiasecScores(student) { return student?.careerDNA?.riasec?.scores || student?.riasecScores || student?.careerAssessment?.riasecScores || null; }

const CareerCaseFileView = ({ studentId, currentUser }) => {
  const { navigate } = useDashboard();
  const [student, setStudent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [savingNote, setSavingNote] = useState(false);
  const [message, setMessage] = useState(null);
  const [note, setNote] = useState({ type: 'session', title: '', content: '', followUpDate: '' });
  const providerId = auth.currentUser?.uid || currentUser?.uid;

  const loadCase = async () => {
    if (!studentId) return;
    setLoading(true);
    setMessage(null);
    try {
      const snapshot = await getDoc(doc(db, 'students', studentId));
      if (!snapshot.exists()) {
        setStudent(null);
        setMessage({ type: 'error', text: 'Student master record not found.' });
        return;
      }
      setStudent({ id: snapshot.id, ...snapshot.data() });
      const [notesSnap, roadmapsSnap] = await Promise.all([
        getDocs(collection(db, 'students', studentId, 'career_notes')),
        getDocs(collection(db, 'students', studentId, 'career_roadmaps'))
      ]);
      const newestFirst = rows => rows.sort((a, b) => {
        const at = a.createdAt?.toMillis?.() || new Date(a.createdAt || 0).getTime();
        const bt = b.createdAt?.toMillis?.() || new Date(b.createdAt || 0).getTime();
        return bt - at;
      });
      setNotes(newestFirst(notesSnap.docs.map(item => ({ id: item.id, ...item.data() }))));
      setRoadmaps(newestFirst(roadmapsSnap.docs.map(item => ({ id: item.id, ...item.data() }))));
    } catch (error) {
      console.error('Error loading career case:', error);
      setMessage({ type: 'error', text: 'Unable to load this case. Please check that the student is assigned to your career pathway.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, providerId]);

  const code = getRiasec(student);
  const scores = getRiasecScores(student);
  const name = studentName(student);
  const latestRoadmap = roadmaps[0];
  const completedPhases = useMemo(() => latestRoadmap?.phases ? Object.values(latestRoadmap.phases).filter(value => String(value || '').trim()).length : 0, [latestRoadmap]);

  const handleSaveNote = async event => {
    event.preventDefault();
    if (!providerId) return setMessage({ type: 'error', text: 'Your professional session has expired. Please sign in again.' });
    if (!note.content.trim()) return setMessage({ type: 'error', text: 'Please enter the note content before saving.' });
    setSavingNote(true);
    setMessage(null);
    try {
      await addDoc(collection(db, 'students', studentId, 'career_notes'), {
        providerId,
        type: note.type,
        title: note.title.trim() || 'Career counselling note',
        content: note.content.trim(),
        followUpDate: note.followUpDate || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNote({ type: 'session', title: '', content: '', followUpDate: '' });
      await loadCase();
      setActiveTab('notes');
      setMessage({ type: 'success', text: 'Counsellor note saved securely.' });
    } catch (error) {
      console.error('Error saving career note:', error);
      setMessage({ type: 'error', text: 'The note could not be saved. Please try again.' });
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" /></div>;
  if (!student) return <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6"><div className="max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm"><div className="text-4xl">🔒</div><h1 className="mt-4 text-xl font-black text-slate-900">Case unavailable</h1><p className="mt-2 text-sm leading-relaxed text-slate-500">{message?.text || 'This student record could not be loaded.'}</p><button onClick={() => navigate('/provider/career')} className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Back to My Students</button></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-5 py-4 shadow-sm backdrop-blur md:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><button onClick={() => navigate('/provider/career')} className="font-semibold text-slate-500 hover:text-indigo-600">← Back to My Students</button><button onClick={loadCase} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">↻ Refresh Case</button></div></header>
      <main className="mx-auto max-w-7xl space-y-6 px-5 py-6 md:px-8 md:py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-center"><div className="flex items-center gap-5"><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-2xl font-black text-white">{name.charAt(0).toUpperCase()}</div><div><div className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Career Guidance Case</div><h1 className="mt-1 text-2xl font-black text-slate-900 md:text-3xl">{name}</h1><div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-slate-500"><span>🏫 {studentSchool(student)}</span><span>🎓 {studentGrade(student)}</span><span>🆔 {student.id}</span></div></div></div><div className="rounded-xl border border-indigo-100 bg-indigo-50 px-7 py-4 text-center"><div className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-400">Career DNA</div><div className="mt-1 text-2xl font-black tracking-widest text-indigo-700">{code || 'Pending'}</div></div></div></section>
        {message && <div className={`rounded-xl px-4 py-3 text-sm font-semibold ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>{message.text}</div>}
        <nav className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm md:grid-cols-4">{TABS.map(tab => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`rounded-xl px-4 py-3 text-sm font-bold transition ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}><span className="mr-2">{tab.icon}</span>{tab.label}</button>)}</nav>

        {activeTab === 'overview' && <div className="grid gap-6 lg:grid-cols-3"><div className="space-y-6 lg:col-span-2"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-black text-slate-900">Case Snapshot</h2><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{[['🧬', code || 'Pending', 'Career DNA'],['📝', notes.length, 'Notes'],['🗺️', roadmaps.length, 'Roadmaps'],['📊', `${completedPhases}/5`, 'Latest roadmap']].map(([icon,value,label]) => <div key={label} className="rounded-xl bg-slate-50 p-4"><div className="text-xl">{icon}</div><div className="mt-2 text-xl font-black text-slate-900">{value}</div><div className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</div></div>)}</div></section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-black text-slate-900">Latest Counsellor Activity</h2><p className="mt-1 text-sm text-slate-500">Most recent notes recorded for this student.</p></div><button onClick={() => setActiveTab('notes')} className="text-xs font-bold text-indigo-600">View all →</button></div><div className="mt-5 space-y-3">{notes.slice(0,3).map(item => <article key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between gap-4"><span className="text-xs font-black uppercase tracking-wide text-indigo-600">{item.type || 'note'}</span><span className="text-xs font-semibold text-slate-400">{formatDate(item.createdAt)}</span></div><div className="mt-1 font-bold text-slate-800">{item.title}</div><p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.content}</p></article>)}{!notes.length && <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">No counsellor notes yet.</div>}</div></section></div><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-black text-slate-900">Quick Actions</h2><div className="mt-5 space-y-3"><button onClick={() => setActiveTab('notes')} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-left text-sm font-bold text-white hover:bg-indigo-700">📝 Add Counsellor Note</button><button onClick={() => navigate(`/provider/career/roadmap/${studentId}`)} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">🗺️ Build Career Roadmap</button><button onClick={() => setActiveTab('assessment')} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50">🧬 Review Career DNA</button></div><div className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500"><div className="font-bold text-slate-700">Privacy boundary</div>This case is visible only to authorised professionals assigned to the student's career pathway and Super Admin.</div></section></div>}

        {activeTab === 'assessment' && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><div className="flex flex-col justify-between gap-4 border-b border-slate-100 pb-6 md:flex-row md:items-center"><div><h2 className="text-xl font-black text-slate-900">Career DNA — RIASEC</h2><p className="mt-1 text-sm text-slate-500">Assessment information currently stored on the student master record.</p></div><div className="rounded-xl bg-indigo-50 px-6 py-3 text-center"><div className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Code</div><div className="text-2xl font-black tracking-widest text-indigo-700">{code || 'Pending'}</div></div></div>{scores && typeof scores === 'object' ? <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{Object.entries(scores).map(([key,value]) => <div key={key} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center"><div className="text-xs font-black uppercase text-slate-400">{key}</div><div className="mt-2 text-2xl font-black text-indigo-700">{String(value)}</div></div>)}</div> : <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-10 text-center"><div className="text-3xl">🧬</div><div className="mt-2 font-bold text-slate-800">{code ? 'RIASEC code available' : 'Assessment pending'}</div><p className="mt-1 text-sm text-slate-500">No detailed RIASEC score breakdown is currently stored on this master record.</p></div>}</section>}

        {activeTab === 'notes' && <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><h2 className="text-xl font-black text-slate-900">Add Counsellor Note</h2><p className="mt-1 text-sm text-slate-500">Record professional observations, goals, decisions and follow-up actions.</p><form onSubmit={handleSaveNote} className="mt-6 space-y-4"><div className="grid gap-4 md:grid-cols-2"><label className="text-xs font-bold text-slate-500">Note type<select value={note.type} onChange={event => setNote(current => ({ ...current, type: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"><option value="session">Session</option><option value="goal">Goal</option><option value="observation">Observation</option><option value="follow_up">Follow-up</option></select></label><label className="text-xs font-bold text-slate-500">Follow-up date<input type="date" value={note.followUpDate} onChange={event => setNote(current => ({ ...current, followUpDate: event.target.value }))} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700" /></label></div><label className="block text-xs font-bold text-slate-500">Title<input value={note.title} onChange={event => setNote(current => ({ ...current, title: event.target.value }))} placeholder="e.g. Stream-selection discussion" className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700" /></label><label className="block text-xs font-bold text-slate-500">Note<textarea value={note.content} onChange={event => setNote(current => ({ ...current, content: event.target.value }))} rows={8} placeholder="Record the career-guidance discussion, decisions, observations or next steps…" className="mt-1 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700" /></label><button disabled={savingNote} type="submit" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-60">{savingNote ? 'Saving securely…' : '🔒 Save Note'}</button></form></section><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><div className="flex items-center justify-between"><div><h2 className="text-xl font-black text-slate-900">Note History</h2><p className="mt-1 text-sm text-slate-500">Most recent first.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{notes.length} notes</span></div><div className="mt-6 space-y-3">{notes.map(item => <article key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-indigo-700">{item.type || 'note'}</span><span className="text-xs font-semibold text-slate-400">{formatDate(item.createdAt)}</span></div><h3 className="mt-2 font-bold text-slate-800">{item.title}</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{item.content}</p>{item.followUpDate && <div className="mt-3 text-xs font-bold text-amber-700">Follow-up: {formatDate(item.followUpDate)}</div>}</article>)}{!notes.length && <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No notes recorded yet.</div>}</div></section></div>}

        {activeTab === 'roadmaps' && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><h2 className="text-xl font-black text-slate-900">Career Roadmaps</h2><p className="mt-1 text-sm text-slate-500">Published career plans for this student.</p></div><button onClick={() => navigate(`/provider/career/roadmap/${studentId}`)} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700">+ Build New Roadmap</button></div><div className="mt-6 space-y-4">{roadmaps.map((item,index) => <article key={item.id} className="rounded-xl border border-slate-200 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="font-black text-slate-800">Roadmap {roadmaps.length-index}</div><div className="text-xs font-semibold text-slate-400">{formatDate(item.createdAt)} · {item.status || 'Published'}</div></div><div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-5">{Object.entries(item.phases || {}).map(([key,value]) => <div key={key} className="rounded-lg bg-slate-50 p-3"><div className="text-[9px] font-black uppercase tracking-wide text-slate-400">{key.replace(/^phase\d+_/,'').replace(/_/g,' ')}</div><div className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-600">{value || 'Not completed'}</div></div>)}</div></article>)}{!roadmaps.length && <div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-sm text-slate-500">No career roadmap has been published yet.</div>}</div></section>}
      </main>
    </div>
  );
};

export default CareerCaseFileView;
