import React, { useEffect, useMemo, useState } from 'react';
import { auth } from '../../firebase';
import { Building2, Check, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { INSTITUTION_SERVICES } from '../../institution/institutionServices.js';

const InstitutionServicesTab = ({ theme = 'light' }) => {
  const dark = theme === 'dark';
  const [institutions, setInstitutions] = useState([]);
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in again.');
      const token = await user.getIdToken(true);
      const response = await fetch('/api/admin/institution-services', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to load institutional services.');
      const rows = payload.institutions || [];
      setInstitutions(rows);
      setDrafts(Object.fromEntries(rows.map(item => [item.id, item.services || []])));
    } catch (err) { setError(err.message || 'Unable to load institutional services.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return institutions;
    return institutions.filter(item => [item.name, item.institutionCode, item.coordinator?.name, item.coordinator?.email].some(value => String(value || '').toLowerCase().includes(needle)));
  }, [institutions, query]);

  const toggle = (institutionId, serviceId) => setDrafts(current => {
    const currentServices = current[institutionId] || [];
    return { ...current, [institutionId]: currentServices.includes(serviceId) ? currentServices.filter(item => item !== serviceId) : [...currentServices, serviceId] };
  });

  const save = async institutionId => {
    setSaving(institutionId); setError(''); setMessage('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in again.');
      const token = await user.getIdToken(true);
      const response = await fetch('/api/admin/institution-services', { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ institutionId, services: drafts[institutionId] || [] }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to save services.');
      setInstitutions(current => current.map(item => item.id === institutionId ? { ...item, services: payload.institution.services } : item));
      setMessage('Service entitlements updated successfully.');
    } catch (err) { setError(err.message || 'Unable to save services.'); }
    finally { setSaving(null); }
  };

  const surface = dark ? 'bg-[#111111] border-[#292929]' : 'bg-white border-slate-200';
  const mutedSurface = dark ? 'bg-[#171717] border-[#292929]' : 'bg-slate-50 border-slate-200';
  const text = dark ? 'text-white' : 'text-slate-900';
  const muted = dark ? 'text-slate-400' : 'text-slate-500';

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2"><ShieldCheck className={`h-6 w-6 ${dark ? 'text-white' : 'text-black'}`} /><h1 className={`text-2xl font-black ${text}`}>Institution Service Entitlements</h1></div>
        <p className={`mt-1 max-w-3xl text-sm ${muted}`}>Control which Secret Sharz services an institution has purchased and may access. Entitlements are enforced separately from professional permissions.</p>
      </div>
      <button onClick={load} className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold ${dark ? 'border-[#333] bg-[#151515] text-white hover:bg-[#202020]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}><RefreshCw className="h-4 w-4"/>Refresh</button>
    </div>
    {error&&<div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
    {message&&<div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${dark ? 'border-[#333] bg-[#171717] text-white' : 'border-slate-200 bg-slate-50 text-slate-800'}`}>{message}</div>}
    <div className="grid gap-4 md:grid-cols-3">{INSTITUTION_SERVICES.map(service=><div key={service.id} className={`rounded-2xl border p-5 shadow-sm ${surface}`}><div className={`font-black ${text}`}>{service.label}</div><p className={`mt-1 text-xs leading-relaxed ${muted}`}>{service.description}</p></div>)}</div>
    <section className={`overflow-hidden rounded-2xl border shadow-sm ${surface}`}>
      <div className={`flex flex-col gap-3 border-b p-4 md:flex-row md:items-center ${dark ? 'border-[#292929]' : 'border-slate-100'}`}>
        <div className="relative flex-1"><Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${muted}`} /><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search institution or coordinator…" className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-black ${dark ? 'border-[#333] bg-[#171717] text-white placeholder:text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-900'}`}/></div>
        <span className={`text-xs font-semibold ${muted}`}>{filtered.length} institution{filtered.length===1?'':'s'}</span>
      </div>
      {loading?<div className={`p-12 text-center font-semibold ${muted}`}>Loading entitlements…</div>:filtered.length===0?<div className={`p-12 text-center ${muted}`}><Building2 className="mx-auto mb-3 h-10 w-10 opacity-40"/>No institutions found.</div>:<div className={dark ? 'divide-y divide-[#292929]' : 'divide-y divide-slate-100'}>{filtered.map(item=>{const selected=drafts[item.id]||[];const dirty=JSON.stringify([...selected].sort())!==JSON.stringify([...(item.services||[])].sort());return <div key={item.id} className="p-5 md:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-[220px]"><div className={`font-black ${text}`}>{item.name}</div><div className={`mt-1 font-mono text-xs ${muted}`}>{item.institutionCode||'No code'}</div><div className={`mt-2 text-xs ${muted}`}>{item.coordinator?.name||'No coordinator'} · {item.coordinator?.email||'No email'}</div><div className={`mt-2 text-xs font-semibold ${muted}`}>Payment: {item.licenses?.paymentStatus||'pending'} · Licenses: {item.licenses?.purchased||0}</div></div><div className="flex-1"><div className="grid gap-3 md:grid-cols-3">{INSTITUTION_SERVICES.map(service=>{const active=selected.includes(service.id);return <button type="button" key={service.id} onClick={()=>toggle(item.id,service.id)} className={`rounded-xl border p-4 text-left transition ${active?(dark?'border-white bg-white text-black':'border-black bg-black text-white'):(dark?'border-[#333] bg-[#171717] hover:bg-[#202020]':'border-slate-200 bg-slate-50 hover:bg-white')}`}><div className="flex items-center justify-between gap-2"><span className={`text-sm font-black ${active?'':' '+(dark?'text-slate-200':'text-slate-700')}`}>{service.label}</span>{active&&<Check className="h-4 w-4"/>}</div><div className={`mt-1 text-[11px] leading-relaxed ${active?'opacity-70':muted}`}>{active?'Entitled':'Not entitled'}</div></button>})}</div><div className="mt-4 flex justify-end"><button disabled={!dirty||saving===item.id} onClick={()=>save(item.id)} className={`rounded-xl px-5 py-2.5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-40 ${dark?'bg-white text-black hover:bg-slate-100':'bg-black text-white hover:bg-slate-800'}`}>{saving===item.id?'Saving…':dirty?'Save Entitlements':'No Changes'}</button></div></div></div></div>})}</div>}
    </section>
  </div>;
};
export default InstitutionServicesTab;
