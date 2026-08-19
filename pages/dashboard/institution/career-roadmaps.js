import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Building2, ChevronDown, ChevronUp, RefreshCw, ShieldCheck } from 'lucide-react';
import { auth } from '../../../src/firebase';

const PHASES = [
  ['phase1_unlock', '1 · Unlock'],
  ['phase2_explore', '2 · Explore'],
  ['phase3_expand', '3 · Expand'],
  ['phase4_inspire', '4 · Inspire'],
  ['phase5_ignite', '5 · Ignite'],
];

function clean(value) {
  return String(value || '').trim();
}

export default function InstitutionCareerRoadmaps() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);

  const institutionId = auth.currentUser?.institutionId || '';

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in as an institution coordinator.');
      const token = await user.getIdToken(true);
      const url = institutionId
        ? `/api/institution/career-roadmaps?institutionId=${encodeURIComponent(institutionId)}`
        : '/api/institution/career-roadmaps';
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to load published career roadmaps.');
      setData(payload);
    } catch (err) {
      setError(err?.message || 'Unable to load published career roadmaps.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) load();
      else setLoading(false);
    });
    return unsubscribe;
  }, []);

  const roadmaps = data?.roadmaps || [];
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return roadmaps;
    return roadmaps.filter((item) => [
      item.fullName,
      item.className,
      item.section,
      item.rollNumber,
      item.summary,
    ].some((value) => clean(value).toLowerCase().includes(needle)));
  }, [roadmaps, query]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-center text-slate-500 font-semibold"><RefreshCw className="w-7 h-7 animate-spin mx-auto text-emerald-500" /><p className="mt-3">Loading published career roadmaps...</p></div></div>;

  return <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={() => window.location.href = '/'} className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center" title="Back"><ArrowLeft className="w-4 h-4" /></button>
          <div className="min-w-0"><div className="text-[10px] uppercase tracking-[0.16em] font-black text-slate-400">Secret Sharz · Institution</div><h1 className="font-black text-lg truncate">{data?.institution?.name || 'Career Roadmaps'}</h1></div>
        </div>
        <button onClick={load} className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-xs flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
      </div>
    </header>

    <main className="max-w-[1400px] mx-auto px-5 md:px-8 py-8">
      <div className="mb-7">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-600">Published student pathways</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-1">Career Roadmaps</h2>
        <p className="text-slate-500 mt-2 max-w-3xl">View only the career roadmap information that has been intentionally published for your institution. Professional case notes and confidential counselling information remain outside this view.</p>
      </div>

      {error && <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm font-semibold">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5"><Building2 className="w-5 h-5 text-emerald-600" /><p className="text-xs font-bold uppercase text-slate-400 mt-4">Institution</p><p className="font-black mt-1">{data?.institution?.tenantCode || '—'}</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5"><BookOpen className="w-5 h-5 text-emerald-600" /><p className="text-xs font-bold uppercase text-slate-400 mt-4">Published roadmaps</p><p className="text-3xl font-black mt-1">{data?.summary?.publishedRoadmaps || 0}</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5"><ShieldCheck className="w-5 h-5 text-emerald-600" /><p className="text-xs font-bold uppercase text-slate-400 mt-4">Access model</p><p className="font-black mt-1">Published only</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search student, class, section or roadmap..." className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-200" /></div>

      <section className="space-y-4">
        {!filtered.length && <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">No published career roadmaps are currently available to this institution.</div>}
        {filtered.map((item) => {
          const open = openId === item.studentId;
          return <article key={item.studentId} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button onClick={() => setOpenId(open ? null : item.studentId)} className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50">
              <div><div className="font-black text-lg">{item.fullName || 'Student'}</div><div className="text-sm text-slate-500 mt-1">Class {item.className || '—'}{item.section ? ` · ${item.section}` : ''}{item.rollNumber ? ` · Roll ${item.rollNumber}` : ''}</div></div>
              <div className="flex items-center gap-3"><span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Published</span>{open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}</div>
            </button>
            {open && <div className="border-t border-slate-100 p-5 md:p-6 bg-slate-50/70"><div className="rounded-xl bg-white border border-slate-200 p-4 mb-5"><p className="text-xs font-black uppercase tracking-wider text-slate-400">Published summary</p><p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-wrap">{item.summary || 'No summary was supplied.'}</p></div><div className="grid md:grid-cols-2 gap-4">{PHASES.map(([key, label]) => <div key={key} className="rounded-xl bg-white border border-slate-200 p-4"><p className="text-xs font-black uppercase tracking-wider text-emerald-600">{label}</p><p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-wrap">{item.phases?.[key] || 'Not included in the published roadmap.'}</p></div>)}</div><p className="text-xs text-slate-400 mt-5">Published {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : '—'} · Institutional projection only.</p></div>}
          </article>;
        })}
      </section>
    </main>
  </div>;
}
