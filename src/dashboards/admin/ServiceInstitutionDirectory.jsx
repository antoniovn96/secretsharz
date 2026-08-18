import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, BriefcaseBusiness, HeartHandshake, Brain, Users, X, ArrowUpRight, Mail, ShieldCheck, CreditCard } from 'lucide-react';
import { auth } from '../../firebase';
import { hasInstitutionService } from '../../institution/institutionServices';

const META = {
  career: { label: 'Career Guidance', icon: BriefcaseBusiness },
  wellbeing: { label: 'Counselling & Wellbeing', icon: HeartHandshake },
  sen: { label: 'SEN / Learning Support', icon: Brain },
};

export default function ServiceInstitutionDirectory({ service = 'career', theme = 'light' }) {
  const meta = META[service] || META.career;
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

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
  const panel = dark ? 'bg-[#151515] border-[#2b2b2b] text-white' : 'bg-white border-slate-200 text-slate-900';
  const muted = dark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Icon className="w-5 h-5" /></div>
            <div><p className={`text-[10px] uppercase tracking-[0.16em] font-bold ${muted}`}>{meta.label} · Institutions</p><h1 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-slate-950'}`}>Institution Directory</h1></div>
          </div>
          <p className={`mt-3 text-sm max-w-3xl ${muted}`}>Shows institutions with an active entitlement for this service. The institution record remains canonical and is never duplicated.</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-semibold ${dark ? 'border-[#2b2b2b] bg-white/[0.02] text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}><Users className="w-4 h-4" />{rows.length} institutions</div>
      </div>
      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
      <div className={`rounded-xl border overflow-hidden ${dark ? 'bg-[#111111] border-[#292929]' : 'bg-white border-slate-200 shadow-sm'}`}>
        {loading ? <div className={`p-12 text-center font-semibold ${muted}`}>Loading institutions...</div> : rows.length === 0 ? <div className={`p-12 text-center ${muted}`}><Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" /><div className="font-bold">No institutions have this service yet</div><div className="text-sm mt-1">Assign the service from Service Entitlements in the Super Admin.</div></div> : <div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className={dark ? 'bg-[#181818] text-slate-400' : 'bg-slate-50 text-slate-500'}><tr><th className="text-left px-5 py-3 font-bold">Institution</th><th className="text-left px-5 py-3 font-bold">Institution Code</th><th className="text-left px-5 py-3 font-bold">Coordinator</th><th className="text-left px-5 py-3 font-bold">Licences</th><th className="text-left px-5 py-3 font-bold">Status</th><th className="w-10"></th></tr></thead><tbody className={dark ? 'divide-y divide-[#292929]' : 'divide-y divide-slate-100'}>{rows.map(item => <tr key={item.id} tabIndex={0} onClick={() => setSelected(item)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(item); } }} className={`cursor-pointer transition ${dark ? 'hover:bg-white/[0.03] focus:bg-white/[0.03]' : 'hover:bg-slate-50 focus:bg-slate-50'} outline-none`}><td className="px-5 py-4"><div className={`font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{item.name || 'Unnamed institution'}</div><div className={`text-[10px] mt-0.5 ${muted}`}>Open institution workspace</div></td><td className="px-5 py-4 font-mono font-bold">{item.institutionCode || '—'}</td><td className="px-5 py-4"><div className={`font-semibold ${dark ? 'text-slate-200' : 'text-slate-700'}`}>{item.coordinator?.name || '—'}</div><div className="text-xs text-slate-400">{item.coordinator?.email || '—'}</div></td><td className="px-5 py-4">{item.licenses?.used || 0} / {item.licenses?.purchased || 0}</td><td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'active' ? (dark ? 'bg-white text-black' : 'bg-black text-white') : (dark ? 'bg-[#292929] text-slate-300' : 'bg-slate-100 text-slate-600')}`}>{item.status || 'pending'}</span></td><td className="px-3"><ArrowUpRight className={`w-4 h-4 ${muted}`} /></td></tr>)}</tbody></table></div>}
      </div>

      {selected && <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"><button aria-label="Close institution details" onClick={() => setSelected(null)} className="absolute inset-0 bg-black/60"/><section role="dialog" aria-modal="true" aria-labelledby="institution-detail-title" className={`relative z-10 w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden ${panel}`}><div className={`flex items-start justify-between px-6 py-5 border-b ${dark ? 'border-[#2b2b2b]' : 'border-slate-200'}`}><div><p className={`text-[10px] uppercase tracking-[0.16em] font-bold ${muted}`}>{meta.label}</p><h2 id="institution-detail-title" className="text-xl font-black mt-1">{selected.name || 'Unnamed institution'}</h2><p className={`font-mono text-xs mt-1 ${muted}`}>{selected.institutionCode || 'No institution code'}</p></div><button onClick={() => setSelected(null)} className={`p-2 rounded-lg ${dark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}><X className="w-5 h-5" /></button></div><div className="p-6 space-y-5"><div className="grid sm:grid-cols-2 gap-3"><div className={`rounded-xl border p-4 ${dark ? 'border-[#2b2b2b] bg-[#111]' : 'border-slate-200 bg-slate-50'}`}><div className={`text-[10px] uppercase tracking-wider font-bold ${muted}`}>Coordinator</div><div className="font-bold mt-2">{selected.coordinator?.name || 'Not assigned'}</div><div className={`text-xs mt-1 ${muted}`}>{selected.coordinator?.email || 'No email'}</div></div><div className={`rounded-xl border p-4 ${dark ? 'border-[#2b2b2b] bg-[#111]' : 'border-slate-200 bg-slate-50'}`}><div className={`text-[10px] uppercase tracking-wider font-bold ${muted}`}>Service access</div><div className="font-bold mt-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/>{meta.label}</div><div className={`text-xs mt-1 ${muted}`}>Active institutional entitlement</div></div><div className={`rounded-xl border p-4 ${dark ? 'border-[#2b2b2b] bg-[#111]' : 'border-slate-200 bg-slate-50'}`}><div className={`text-[10px] uppercase tracking-wider font-bold ${muted}`}>Licences</div><div className="font-bold mt-2">{selected.licenses?.used || 0} used / {selected.licenses?.purchased || 0} purchased</div><div className={`text-xs mt-1 ${muted}`}>Available: {Math.max(0, (selected.licenses?.purchased || 0) - (selected.licenses?.used || 0))}</div></div><div className={`rounded-xl border p-4 ${dark ? 'border-[#2b2b2b] bg-[#111]' : 'border-slate-200 bg-slate-50'}`}><div className={`text-[10px] uppercase tracking-wider font-bold ${muted}`}>Payment</div><div className="font-bold mt-2 flex items-center gap-2"><CreditCard className="w-4 h-4"/>{selected.licenses?.paymentStatus || 'Pending'}</div><div className={`text-xs mt-1 ${muted}`}>Institution account status: {selected.status || 'pending'}</div></div></div><div className={`rounded-xl border p-4 ${dark ? 'border-[#2b2b2b]' : 'border-slate-200'}`}><div className={`text-[10px] uppercase tracking-wider font-bold ${muted}`}>What this service controls</div><p className={`text-sm leading-relaxed mt-2 ${muted}`}>This institution is entitled to the {meta.label} service. Students, parents and institution users shown in this service area should be interpreted within this institutional relationship; the canonical institution record is not duplicated.</p></div>{selected.coordinator?.email && <a href={`mailto:${selected.coordinator.email}`} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Mail className="w-4 h-4"/>Email coordinator</a>}</div></section></div>}
    </div>
  );
}
