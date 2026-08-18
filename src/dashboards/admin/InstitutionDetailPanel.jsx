import React from 'react';
import { X, Building2, Users, Briefcase, CreditCard, KeyRound, Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

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
  if (!isOpen || !institution) return null;
  const services = normaliseServices(institution);
  const licenses = institution.licenses || {};
  const students = institution.students || institution.linkedStudents || [];
  const parents = institution.parents || institution.linkedParents || [];
  const professionals = institution.professionals || institution.assignedProfessionals || [];
  const activeServices = Object.keys(SERVICE_META).filter(key => services[key]);

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl z-50 flex flex-col">
        <header className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-start justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg"><Building2 className="w-7 h-7" /></div>
            <div className="min-w-0"><h2 className="text-xl font-black text-slate-900 truncate">{institution.name || 'Institution'}</h2><p className="text-xs font-mono text-slate-400 mt-1">{institution.institutionCode || institution.id}</p><div className="flex gap-2 mt-2"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${institution.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{institution.status || 'pending'}</span><span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">{activeServices.length} service{activeServices.length === 1 ? '' : 's'}</span></div></div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="w-6 h-6" /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section><h3 className="text-sm font-bold text-slate-900 mb-3">Institution Overview</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Stat icon={Users} label="Students" value={students.length || institution.studentCount || licenses.used || 0} /><Stat icon={Users} label="Parents" value={parents.length || institution.parentCount || 0} /><Stat icon={Briefcase} label="Professionals" value={professionals.length || institution.professionalCount || 0} /><Stat icon={KeyRound} label="Available licences" value={licenses.available || 0} /></div></section>

          <section><h3 className="text-sm font-bold text-slate-900 mb-3">Institution Contact</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Info icon={Mail} label="Coordinator email" value={institution.contactEmail} /><Info icon={Phone} label="Coordinator phone" value={institution.contactPhone} /><Info icon={MapPin} label="Address" value={institution.address} /><Info icon={Building2} label="Coordinator" value={institution.contactPerson} /></div></section>

          <section><div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-slate-900">Active Services</h3><span className="text-xs font-semibold text-slate-400">Institution entitlement</span></div>{activeServices.length ? <div className="grid grid-cols-1 md:grid-cols-3 gap-3">{activeServices.map(service => { const meta = SERVICE_META[service]; return <div key={service} className="p-4 rounded-xl border border-slate-100 bg-slate-50"><div className="font-bold text-slate-900">{meta.label}</div><div className="text-xs text-slate-500 mt-1">Assigned role: {SERVICE_PROFESSIONAL[service]}</div><span className="inline-flex mt-3 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600"><CheckCircle className="w-3.5 h-3.5 mr-1" />Entitled</span></div>; })}</div> : <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700 flex items-center gap-2"><AlertCircle className="w-4 h-4" />No active service entitlement is recorded.</div>}</section>

          <section><h3 className="text-sm font-bold text-slate-900 mb-3">Licence & Payment</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><Stat icon={CreditCard} label="Purchased" value={licenses.purchased || 0} /><Stat icon={Users} label="Used" value={licenses.used || 0} /><Stat icon={KeyRound} label="Available" value={licenses.available || 0} /><Stat icon={CreditCard} label="Payment" value={licenses.paymentStatus || institution.paymentStatus || 'pending'} /></div></section>

          <section><h3 className="text-sm font-bold text-slate-900 mb-3">Service Ecosystem</h3><div className="p-4 rounded-2xl border border-slate-100 bg-slate-50"><div className="grid grid-cols-1 md:grid-cols-5 items-center gap-2 text-center"><Node label="Institution" /><Arrow /><Node label={`${students.length || institution.studentCount || 0} Students`} /><Arrow /><Node label={`${parents.length || institution.parentCount || 0} Parents`} /><Arrow /><Node label={`${professionals.length || institution.professionalCount || 0} Professionals`} /><Arrow /><Node label={`${activeServices.length} Services`} /></div><p className="text-xs text-slate-400 text-center mt-4">All relationships should resolve back to the canonical student, parent, professional and institution records.</p></div></section>
        </div>

        <footer className="p-5 border-t border-slate-100 bg-slate-50 flex justify-between"><button onClick={onClose} className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100">Close</button><button onClick={() => onEdit?.(institution)} className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold shadow-lg">Manage Institution</button></footer>
      </aside>
    </>
  );
};

const Info = ({ icon: Icon, label, value }) => <div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center gap-2 text-slate-400 mb-1"><Icon className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wide">{label}</span></div><p className="text-sm font-semibold text-slate-800 break-words">{value || 'Not provided'}</p></div>;
const Node = ({ label }) => <div className="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700">{label}</div>;
const Arrow = () => <span className="text-slate-300 font-bold">→</span>;

export default InstitutionDetailPanel;
