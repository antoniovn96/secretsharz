import React, { useEffect, useState } from 'react';
import { X, Building2, Users, Briefcase, CreditCard, KeyRound, Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { auth } from '../../firebase';

const SERVICE_META = {
  career: { label: 'Career Guidance', tone: 'emerald' },
  wellbeing: { label: 'Wellbeing', tone: 'purple' },
  sen: { label: 'SEN', tone: 'amber' },
};

const SERVICE_PROFESSIONAL = {
  career: 'Career Counsellor',
  wellbeing: 'Psychologist',
  sen: 'SEN Educator',
};

const normaliseServices = (institution = {}) => {
  const services = institution?.licenses?.services || institution?.services || {};
  if (Array.isArray(services)) return services.reduce((acc, service) => ({ ...acc, [String(service).toLowerCase()]: true }), {});
  return Object.fromEntries(Object.entries(services).map(([key, value]) => [String(key).toLowerCase(), Boolean(value)]));
};

const Stat = ({ icon: Icon, label, value }) => (
  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
    <Icon className="w-4 h-4 text-slate-400 mb-2" />
    <p className="text-2xl font-black text-slate-900">{value}</p>
    <p className="text-xs font-semibold text-slate-500 mt-1">{label}</p>
  </div>
);

const InstitutionDetailPanel = ({ institution, isOpen, onClose, onEdit }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !institution?.id) return;
    let cancelled = false;
    (async () => {
      setLoading(true); setError('');
      try {
        const current = auth.currentUser;
        if (!current) throw new Error('Authentication required.');
        const token = await current.getIdToken(true);
        const response = await fetch(`/api/admin/institution-detail?id=${encodeURIComponent(institution.id)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || 'Unable to load institution details.');
        if (!cancelled) setDetail(payload);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unable to load institution details.');
      } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [isOpen, institution?.id]);

  if (!isOpen || !institution) return null;
  const record = detail?.institution || institution;
  const services = normaliseServices(record);
  const licenses = record.licenses || {};
  const students = detail?.students || record.students || record.linkedStudents || [];
  const parents = detail?.parents || record.parents || record.linkedParents || [];
  const professionals = detail?.professionals || record.professionals || record.assignedProfessionals || [];
  const serviceBreakdown = detail?.serviceBreakdown || [];
  const activeServices = Object.keys(SERVICE_META).filter(key => services[key]);

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl z-50 flex flex-col">
        <header className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-start justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg"><Building2 className="w-7 h-7" /></div>
            <div className="min-w-0"><h2 className="text-xl font-black text-slate-900 truncate">{record.name || 'Institution'}</h2><p className="text-xs font-mono text-slate-400 mt-1">{record.institutionCode || record.id}</p><div className="flex gap-2 mt-2"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${record.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{record.status || 'pending'}</span><span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{activeServices.length} service{activeServices.length === 1 ? '' : 's'}</span></div></div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="w-6 h-6" /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-semibold">{error}</div>}
          <section><h3 className="text-sm font-bold text-slate-900 mb-3">Institution Overview</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Stat icon={Users} label="Students" value={students.length || 0} /><Stat icon={Users} label="Parents" value={parents.length || 0} /><Stat icon={Briefcase} label="Professionals" value={professionals.length || 0} /><Stat icon={KeyRound} label="Available licences" value={licenses.available || 0} /></div></section>

          <section><h3 className="text-sm font-bold text-slate-900 mb-3">Institution Contact</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Info icon={Mail} label="Coordinator email" value={record.contactEmail || record.coordinator?.email} /><Info icon={Phone} label="Coordinator phone" value={record.contactPhone} /><Info icon={MapPin} label="Address" value={record.address} /><Info icon={Building2} label="Coordinator" value={record.contactPerson || record.coordinator?.name} /></div></section>

          <section><div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-slate-900">Active Services</h3><span className="text-xs font-semibold text-slate-400">Institution entitlement</span></div>{activeServices.length ? <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{activeServices.map(service => { const meta = SERVICE_META[service]; const breakdown = serviceBreakdown.find(item => item.service === service); return <div key={service} className="p-4 rounded-xl border border-slate-100 bg-slate-50"><div className="font-bold text-slate-900">{meta.label}</div><div className="text-xs text-slate-500 mt-1">Assigned role: {SERVICE_PROFESSIONAL[service]}</div>{breakdown && <div className="grid grid-cols-3 gap-2 mt-3 text-center"><MiniStat value={breakdown.students} label="Students" /><MiniStat value={breakdown.parents} label="Parents" /><MiniStat value={breakdown.professionals} label="Professionals" /></div>}<span className="inline-flex mt-3 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600"><CheckCircle className="w-3.5 h-3.5 mr-1" />Entitled</span></div>; })}</div> : <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" />No active service entitlement is recorded.</div>}</section>

          <section><h3 className="text-sm font-bold text-slate-900 mb-3">Licence & Payment</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Stat icon={CreditCard} label="Purchased" value={licenses.purchased || 0} /><Stat icon={Users} label="Used" value={licenses.used || 0} /><Stat icon={KeyRound} label="Available" value={licenses.available || 0} /><Stat icon={CreditCard} label="Payment" value={licenses.paymentStatus || record.paymentStatus || 'pending'} /></div></section>

          <section><h3 className="text-sm font-bold text-slate-900 mb-3">Service Ecosystem</h3><div className="p-4 rounded-2xl border border-slate-100 bg-slate-50"><div className="grid grid-cols-1 md:grid-cols-5 items-center gap-2 text-center"><Node label="Institution" /><Arrow /><Node label={`${students.length} Students`} /><Arrow /><Node label={`${parents.length} Parents`} /><Arrow /><Node label={`${professionals.length} Professionals`} /><Arrow /><Node label={`${activeServices.length} Services`} /></div><p className="text-xs text-slate-400 text-center mt-4">All relationships resolve through the canonical institution, student, parent and professional records.</p></div></section>

          <section><h3 className="text-sm font-bold text-slate-900 mb-3">People</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><PeopleList title="Students" people={students} /><PeopleList title="Parents / Guardians" people={parents} /><PeopleList title="Professionals" people={professionals} /></div></section>
        </div>

        <footer className="p-5 border-t border-slate-100 bg-slate-50 flex justify-between"><button onClick={onClose} className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100">Close</button><button onClick={() => onEdit?.(record)} className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold shadow-lg">Manage Institution</button></footer>
        {loading && <div className="absolute inset-0 bg-white/75 flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" /></div>}
      </aside>
    </>
  );
};

const Info = ({ icon: Icon, label, value }) => <div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center gap-2 text-slate-400 mb-1"><Icon className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wide">{label}</span></div><p className="text-sm font-semibold text-slate-800 break-words">{value || 'Not provided'}</p></div>;
const Node = ({ label }) => <div className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">{label}</div>;
const Arrow = () => <span className="text-slate-300 font-bold">→</span>;
const MiniStat = ({ value, label }) => <div className="p-2 rounded-lg bg-white border border-slate-100"><p className="text-sm font-black text-slate-900">{value}</p><p className="text-[10px] text-slate-400">{label}</p></div>;
const PeopleList = ({ title, people }) => <div className="p-4 bg-white border border-slate-100 rounded-xl"><h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">{title}</h4>{people.length ? <div className="space-y-2 max-h-44 overflow-y-auto">{people.map(person => <div key={person.id} className="p-2.5 bg-slate-50 rounded-lg"><p className="text-sm font-semibold text-slate-800 truncate">{person.name || 'Unnamed'}</p><p className="text-[11px] text-slate-400 truncate">{person.email || person.role || 'No email'}</p></div>)}</div> : <p className="text-xs text-slate-400">No linked records.</p>}</div>;

export default InstitutionDetailPanel;
