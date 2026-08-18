import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, BriefcaseBusiness, HeartHandshake, Brain, Users } from 'lucide-react';
import { auth } from '../../firebase';
import { hasInstitutionService } from '../../institution/institutionServices';

const META = {
  career: { label: 'Career Guidance', icon: BriefcaseBusiness, tone: 'emerald' },
  wellbeing: { label: 'Counselling & Wellbeing', icon: HeartHandshake, tone: 'violet' },
  sen: { label: 'SEN / Learning Support', icon: Brain, tone: 'amber' },
};

export default function ServiceInstitutionDirectory({ service = 'career', theme = 'light' }) {
  const meta = META[service] || META.career;
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const current = auth.currentUser;
    if (!current) { setError('Authentication required to load institutions.'); setLoading(false); return; }
    setLoading(true); setError('');
    try {
      const token = await current.getIdToken(true);
      const response = await fetch('/api/admin/institution-services', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to load institutions.');
      setInstitutions(Array.isArray(payload.institutions) ? payload.institutions : []);
    } catch (err) {
      console.error('[ServiceInstitutionDirectory] failed:', err);
      setError(err?.message || 'Unable to load institutions.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const rows = useMemo(() => institutions.filter(item => hasInstitutionService(item, service)), [institutions, service]);
  const Icon = meta.icon;
  const dark = theme === 'dark';

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${meta.tone === 'violet' ? 'bg-violet-500/10 text-violet-500' : meta.tone === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}><Icon className="w-5 h-5" /></div>
            <div><p className={`text-[10px] uppercase tracking-[0.16em] font-bold ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{meta.label} · Institutions</p><h1 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>Institution Directory</h1></div>
          </div>
          <p className={`mt-3 text-sm max-w-3xl ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Shows institutions with an active entitlement for this service. The institution record remains canonical and is never duplicated.</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${dark ? 'border-slate-800 bg-white/[0.02] text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}><Users className="w-4 h-4" />{rows.length} institutions</div>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
      <div className={`rounded-2xl border overflow-hidden ${dark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        {loading ? <div className="p-12 text-center text-slate-500 font-semibold">Loading institutions...</div> : rows.length === 0 ? <div className="p-12 text-center text-slate-500"><Building2 className="w-10 h-10 mx-auto mb-3 text-slate-300" /><div className="font-bold">No institutions have this service yet</div><div className="text-sm mt-1">Assign the service from Service Entitlements in the Super Admin.</div></div> : <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className={dark ? 'bg-slate-900 text-slate-400' : 'bg-slate-50 text-slate-500'}><tr><th className="text-left px-5 py-3 font-bold">Institution</th><th className="text-left px-5 py-3 font-bold">Institution Code</th><th className="text-left px-5 py-3 font-bold">Coordinator</th><th className="text-left px-5 py-3 font-bold">Licences</th><th className="text-left px-5 py-3 font-bold">Status</th></tr></thead><tbody className={dark ? 'divide-y divide-slate-800' : 'divide-y divide-slate-100'}>{rows.map(item => <tr key={item.id} className={dark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}><td className="px-5 py-4"><div className={`font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{item.name || 'Unnamed institution'}</div></td><td className="px-5 py-4 font-mono font-bold">{item.institutionCode || '—'}</td><td className="px-5 py-4"><div className="font-semibold">{item.coordinator?.name || '—'}</div><div className="text-xs text-slate-400">{item.coordinator?.email || '—'}</div></td><td className="px-5 py-4">{item.licenses?.used || 0} / {item.licenses?.purchased || 0}</td><td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status || 'pending'}</span></td></tr>)}</tbody></table></div>}
      </div>
    </div>
  );
}
