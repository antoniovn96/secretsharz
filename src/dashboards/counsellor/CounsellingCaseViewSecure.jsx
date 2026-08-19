import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

async function api(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required');
  const token = await user.getIdToken();
  const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Request failed');
  return payload;
}

export default function CounsellingCaseViewSecure({ studentId, currentUser }) {
  const { navigate } = useDashboard();
  const [student, setStudent] = useState(null);
  const [caseContext, setCaseContext] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [soap, setSoap] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const load = async () => {
    const encoded = encodeURIComponent(studentId);
    const [caseData, sessionData] = await Promise.all([
      api(`/api/counsellor/wellbeing-case?studentId=${encoded}&institutionId=${encodeURIComponent(currentUser?.institutionId || '')}`),
      api(`/api/counsellor/wellbeing-session?studentId=${encoded}`),
    ]);
    setStudent(caseData.student);
    setCaseContext(caseData);
    setSessions(sessionData.sessions || []);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try { await load(); }
      catch (error) { if (active) setDenied(/authorised|authentication|membership|assignment|consent/i.test(error.message)); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [studentId, currentUser]);

  const save = async (event) => {
    event.preventDefault();
    if (!Object.values(soap).some(value => value.trim())) return setMessage({ type: 'error', text: 'Cannot save an empty note.' });
    setSaving(true); setMessage(null);
    try {
      await api(`/api/counsellor/wellbeing-session?studentId=${encodeURIComponent(studentId)}`, { method: 'POST', body: JSON.stringify({ studentId, soap }) });
      await load();
      setSoap({ subjective: '', objective: '', assessment: '', plan: '' });
      setMessage({ type: 'success', text: 'Session note saved securely.' });
    } catch (error) { setMessage({ type: 'error', text: error.message }); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" /></div>;
  if (denied) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"><div className="text-4xl mb-3">🔒</div><h1 className="text-xl font-black text-slate-900">Case access restricted</h1><p className="mt-2 text-sm text-slate-600">This case is not authorised for your counselling psychology account.</p><button onClick={() => navigate('/provider/psychologist')} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">Back to Caseload</button></div></div>;

  const institutionName = caseContext?.institution?.name || 'Institution context';
  const slot = caseContext?.service?.assignmentSlot || 'assigned';

  return <div className="min-h-screen bg-slate-50 pb-20">
    <div className="sticky top-0 z-50 flex items-center border-b border-slate-200 bg-white px-8 py-4 shadow-sm"><button onClick={() => navigate('/provider/psychologist')} className="font-semibold text-slate-500 hover:text-indigo-600">← Back to Caseload</button></div>
    <div className="mx-auto mt-8 max-w-5xl space-y-8 px-6">
      <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center"><div><h1 className="text-3xl font-extrabold text-slate-900">{student?.name || 'Unknown Student'}</h1><div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-slate-500"><span>🏫 {institutionName}</span><span>🎓 {student?.grade || 'N/A'}</span><span>🔐 {slot}</span></div><p className="mt-2 text-xs text-slate-400">SS Student ID: {student?.ssStudentId || '—'}</p></div><div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm"><p className="font-bold text-slate-800">Wellbeing Case</p><p className="text-slate-500">Professional view only</p></div></div>
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><h2 className="mb-6 text-xl font-bold text-slate-800">Clinical Session History</h2>{sessions.length === 0 ? <div className="rounded-xl bg-slate-50 p-6 text-sm font-semibold text-slate-500">No clinical sessions recorded yet.</div> : <div className="space-y-4">{sessions.map(session => <article key={session.id} className="rounded-xl border border-slate-200 p-5"><div className="mb-3 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider text-slate-400"><span>SOAP</span><span>·</span><span>{session.source === 'legacy' ? 'Historical record' : 'Canonical record'}</span><span>·</span><span>{session.createdAt ? new Date(session.createdAt).toLocaleString() : 'Recorded session'}</span></div><div className="grid gap-3 text-sm"><p><b>S:</b> {session.soap?.subjective || '—'}</p><p><b>O:</b> {session.soap?.objective || '—'}</p><p><b>A:</b> {session.soap?.assessment || '—'}</p><p><b>P:</b> {session.soap?.plan || '—'}</p></div></article>)}</div>}</section>
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><h2 className="mb-6 text-xl font-bold text-slate-800">New Clinical Session · SOAP</h2><form onSubmit={save} className="space-y-6">{[['subjective','Subjective (S)'],['objective','Objective (O)'],['assessment','Assessment (A)'],['plan','Plan (P)']].map(([name,label]) => <div key={name}><label className="text-sm font-bold text-slate-700">{label}</label><textarea name={name} value={soap[name]} onChange={event => setSoap({ ...soap, [name]: event.target.value })} rows="3" className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-4 outline-none focus:ring-2 focus:ring-indigo-500" /></div>)}{message && <div className={`rounded-xl p-4 text-sm font-semibold ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{message.text}</div>}<button disabled={saving} className="rounded-xl bg-indigo-600 px-8 py-3.5 font-bold text-white disabled:bg-indigo-400">{saving ? 'Saving securely...' : '🔒 Securely Save Session Note'}</button></form></section>
    </div>
  </div>;
}
