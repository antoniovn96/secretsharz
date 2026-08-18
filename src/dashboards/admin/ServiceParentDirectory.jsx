import React, { useCallback, useEffect, useState } from 'react';
import { HeartHandshake, BriefcaseBusiness, Brain, Users } from 'lucide-react';
import { auth } from '../../firebase';
import ParentDirectoryTable from './ParentDirectoryTable';
import ParentDetailPanel from './ParentDetailPanel';

const META = {
  career: { label: 'Career Guidance', path: 'Career', icon: BriefcaseBusiness, tone: 'emerald' },
  wellbeing: { label: 'Counselling & Wellbeing', path: 'Wellbeing', icon: HeartHandshake, tone: 'violet' },
  sen: { label: 'SEN / Learning Support', path: 'SEN', icon: Brain, tone: 'amber' },
};

export default function ServiceParentDirectory({ service = 'career', theme = 'light' }) {
  const meta = META[service] || META.career;
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const dark = theme === 'dark';

  const load = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) { setError('Authentication required to load parents.'); setLoading(false); return; }
    setLoading(true); setError('');
    try {
      let token = await currentUser.getIdToken(true);
      let response = await fetch(`/api/admin/service-parents?service=${encodeURIComponent(service)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      if (response.status === 401) {
        token = await currentUser.getIdToken(true);
        response = await fetch(`/api/admin/service-parents?service=${encodeURIComponent(service)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to load parents.');
      setParents(Array.isArray(payload.parents) ? payload.parents : []);
    } catch (err) {
      console.error('[ServiceParentDirectory] failed:', err);
      setError(err?.message || 'Unable to load parents.');
    } finally { setLoading(false); }
  }, [service]);

  useEffect(() => { load(); }, [load]);

  const Icon = meta.icon;
  const linkedStudents = parents.reduce((sum, parent) => sum + Number(parent.childrenCount || parent.children?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${meta.tone === 'violet' ? 'bg-violet-500/10 text-violet-500' : meta.tone === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}><Icon className="w-5 h-5" /></div>
            <div><p className={`text-[10px] uppercase tracking-[0.16em] font-bold ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{meta.label} · Parents</p><h1 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>Parent Directory</h1></div>
          </div>
          <p className={`mt-3 text-sm max-w-3xl ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Canonical parent accounts are returned by the authenticated service endpoint only when they have at least one linked child in this service.</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${dark ? 'border-slate-800 bg-white/[0.02] text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}><Users className="w-4 h-4" />{parents.length} parents · {linkedStudents} linked students</div>
      </div>
      {error && <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${dark ? 'border-red-900/60 bg-red-950/30 text-red-300' : 'border-red-200 bg-red-50 text-red-700'}`}>{error}</div>}
      <ParentDirectoryTable users={parents} isLoading={loading} onViewDetails={parent => { setSelected(parent); setOpen(true); }} theme={theme} />
      <ParentDetailPanel parent={selected} isOpen={open} onClose={() => { setOpen(false); window.setTimeout(() => setSelected(null), 300); }} />
    </div>
  );
}
