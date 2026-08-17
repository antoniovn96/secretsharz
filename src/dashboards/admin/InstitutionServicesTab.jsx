import React, { useEffect, useMemo, useState } from 'react';
import { auth } from '../../firebase';
import { Building2, Check, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { INSTITUTION_SERVICES } from '../../institution/institutionServices.js';

const InstitutionServicesTab = () => {
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

  const toggle = (institutionId, serviceId) => {
    setDrafts(current => {
      const currentServices = current[institutionId] || [];
      const next = currentServices.includes(serviceId) ? currentServices.filter(item => item !== serviceId) : [...currentServices, serviceId];
      return { ...current, [institutionId]: next };
    });
  };

  const save = async institutionId => {
    setSaving(institutionId); setError(''); setMessage('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in again.');
      const token = await user.getIdToken(true);
      const response = await fetch('/api/admin/institution-services', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ institutionId, services: drafts[institutionId] || [] })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to save services.');
      setInstitutions(current => current.map(item => item.id === institutionId ? { ...item, services: payload.institution.services } : item));
      setMessage('Service entitlements updated successfully.');
    } catch (err) { setError(err.message || 'Unable to save services.'); }
    finally { setSaving(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2"><ShieldCheck className="h-6 w-6 text-emerald-600" /><h1 className="text-2xl font-black text-slate-900">Institution Service Entitlements</h1></div>
          <p className="mt-1 max-w-3xl text-sm text-slate-500">Control which Secret Sharz services an institution has purchased and may access. Entitlements are enforced separately from professional-level permissions.</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"><RefreshCw className="h-4 w-4" />Refresh</button>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{message}</div>}

      <div className="grid gap-4 md:grid-cols-3">
        {INSTITUTION_SERVICES.map(service => <div key={service.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="font-black text-slate-900">{service.label}</div><p className="mt-1 text-xs leading-relaxed text-slate-500">{service.description}</p></div>)}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search institution or coordinator…" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-400" /></div><span className="text-xs font-semibold text-slate-500">{filtered.length} institution{filtered.length === 1 ? '' : 's'}</span></div>
        {loading ? <div className="p-12 text-center font-semibold text-slate-500">Loading entitlements…</div> : filtered.length === 0 ? <div className="p-12 text-center text-slate-500"><Building2 className="mx-auto mb-3 h-10 w-10 text-slate-300" />No institutions found.</div> : <div className="divide-y divide-slate-100">
          {filtered.map(item => {
            const selected = drafts[item.id] || [];
            const dirty = JSON.stringify([...selected].sort()) !== JSON.stringify([...(item.services || [])].sort());
            return <div key={item.id} className="p-5 md:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-[220px]"><div className="font-black text-slate-900">{item.name}</div><div className="mt-1 font-mono text-xs text-slate-400">{item.institutionCode || 'No code'}</div><div className="mt-2 text-xs text-slate-500">{item.coordinator?.name || 'No coordinator'} · {item.coordinator?.email || 'No email'}</div><div className="mt-2 text-xs font-semibold text-slate-500">Payment: {item.licenses?.paymentStatus || 'pending'} · Licenses: {item.licenses?.purchased || 0}</div></div><div className="flex-1"><div className="grid gap-3 md:grid-cols-3">{INSTITUTION_SERVICES.map(service => { const active = selected.includes(service.id); return <button type="button" key={service.id} onClick={() => toggle(item.id, service.id)} className={`rounded-xl border p-4 text-left transition ${active ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}><div className="flex items-center justify-between gap-2"><span className={`text-sm font-black ${active ? 'text-emerald-800' : 'text-slate-700'}`}>{service.label}</span>{active && <Check className="h-4 w-4 text-emerald-600" />}</div><div className="mt-1 text-[11px] leading-relaxed text-slate-500">{active ? 'Entitled' : 'Not entitled'}</div></button>; })}</div><div className="mt-4 flex justify-end"><button disabled={!dirty || saving === item.id} onClick={() => save(item.id)} className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-40">{saving === item.id ? 'Saving…' : dirty ? 'Save Entitlements' : 'No Changes'}</button></div></div></div></div>;
          })}
        </div>}
      </section>
    </div>
  );
};

export default InstitutionServicesTab;
