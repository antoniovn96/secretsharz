import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Check, Loader2, Save, Search, X } from 'lucide-react';
import { auth } from '../../firebase';

const SERVICE_LABELS = { career: 'Career Guidance', wellbeing: 'Wellbeing & Counselling', sen: 'SEN Support' };

export default function ProfessionalInstitutionAssignment({ professional, theme = 'light', isOpen, onClose, onSaved }) {
  const dark = theme === 'dark';
  const [institutions, setInstitutions] = useState([]);
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const service = professional?.professionalService || ({ career_counsellor: 'career', psychologist: 'wellbeing', counsellor: 'wellbeing', educator: 'sen' }[professional?.role]);

  useEffect(() => {
    if (!isOpen || !professional) return;
    setSelected(Array.isArray(professional.institutionIds) ? professional.institutionIds : []);
    setQuery(''); setError('');
    const load = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser; if (!user) throw new Error('Please sign in again.');
        const token = await user.getIdToken(true);
        const response = await fetch('/api/admin/institution-services', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || 'Unable to load institutions.');
        setInstitutions(payload.institutions || []);
      } catch (e) { setError(e.message || 'Unable to load institutions.'); }
      finally { setLoading(false); }
    };
    load();
  }, [isOpen, professional]);

  const eligible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return institutions.filter(item => item.services?.includes(service) && (!needle || [item.name, item.institutionCode, item.coordinator?.name, item.coordinator?.email].some(v => String(v || '').toLowerCase().includes(needle))));
  }, [institutions, query, service]);

  if (!isOpen || !professional) return null;

  const toggle = id => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const save = async () => {
    setSaving(true); setError('');
    try {
      const user = auth.currentUser; if (!user) throw new Error('Please sign in again.');
      const token = await user.getIdToken(true);
      const response = await fetch('/api/admin/assign-professional-institutions', { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ professionalUid: professional.id, institutionIds: selected }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to save institution assignments.');
      onSaved?.({ ...professional, institutionIds: payload.institutionIds, professionalService: payload.service });
      onClose();
    } catch (e) { setError(e.message || 'Unable to save institution assignments.'); }
    finally { setSaving(false); }
  };

  return <>
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={() => !saving && onClose()} />
    <div className="fixed inset-0 z-[81] flex items-center justify-center p-4 pointer-events-none">
      <div className={`pointer-events-auto flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${dark ? 'border-[#303030] bg-[#111111] text-white' : 'border-slate-200 bg-white text-slate-900'}`}>
        <header className={`flex items-center justify-between border-b p-5 ${dark ? 'border-[#292929]' : 'border-slate-100'}`}>
          <div><h2 className="text-lg font-black">Assign Institutions</h2><p className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{professional.name} · {SERVICE_LABELS[service] || 'Professional Service'}</p></div>
          <button onClick={onClose} disabled={saving} className={`rounded-lg p-2 ${dark ? 'hover:bg-[#202020]' : 'hover:bg-slate-100'}`}><X className="h-5 w-5" /></button>
        </header>
        <div className="space-y-4 overflow-y-auto p-5">
          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{error}</div>}
          <div className={`rounded-xl border p-3 text-sm ${dark ? 'border-[#303030] bg-[#171717] text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}><b>{SERVICE_LABELS[service] || 'Service'}</b> institutions only. Institutions without this service entitlement cannot be assigned.</div>
          <div className="relative"><Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-slate-400'}`} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search eligible institutions…" className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none ${dark ? 'border-[#333] bg-[#171717] text-white placeholder:text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-900'}`} /></div>
          {loading ? <div className={`flex items-center justify-center gap-2 py-12 text-sm font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}><Loader2 className="h-4 w-4 animate-spin"/>Loading institutions…</div> : eligible.length === 0 ? <div className={`py-12 text-center text-sm ${dark ? 'text-slate-500' : 'text-slate-500'}`}><Building2 className="mx-auto mb-2 h-8 w-8 opacity-40"/>No eligible institutions found.</div> : <div className="space-y-2">{eligible.map(item => { const active = selected.includes(item.id); return <button type="button" key={item.id} onClick={() => toggle(item.id)} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${active ? (dark ? 'border-white bg-white text-black' : 'border-black bg-black text-white') : (dark ? 'border-[#333] bg-[#171717] hover:bg-[#202020]' : 'border-slate-200 bg-white hover:bg-slate-50')}`}><div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? (dark ? 'bg-black text-white' : 'bg-white text-black') : (dark ? 'bg-[#222] text-slate-300' : 'bg-slate-100 text-slate-600')}`}><Building2 className="h-4 w-4"/></div><div className="min-w-0 flex-1"><div className="truncate text-sm font-black">{item.name}</div><div className={`mt-1 truncate text-xs ${active ? 'opacity-70' : (dark ? 'text-slate-400' : 'text-slate-500')}`}>{item.institutionCode || 'No institution code'} · {item.coordinator?.name || 'No coordinator'}</div></div>{active && <Check className="h-5 w-5 shrink-0"/>}</button>; })}</div>}
        </div>
        <footer className={`flex items-center justify-between border-t p-5 ${dark ? 'border-[#292929]' : 'border-slate-100'}`}><span className={`text-xs font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{selected.length} institution{selected.length === 1 ? '' : 's'} assigned</span><div className="flex gap-2"><button onClick={onClose} disabled={saving} className={`rounded-xl px-4 py-2.5 text-sm font-bold ${dark ? 'text-slate-300 hover:bg-[#202020]' : 'text-slate-600 hover:bg-slate-100'}`}>Cancel</button><button onClick={save} disabled={saving || loading} className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black ${dark ? 'bg-white text-black hover:bg-slate-100' : 'bg-black text-white hover:bg-slate-800'}`}>{saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}{saving ? 'Saving…' : 'Save Assignments'}</button></div></footer>
      </div>
    </div>
  </>;
}
