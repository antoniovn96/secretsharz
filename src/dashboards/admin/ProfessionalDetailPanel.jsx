import React from 'react';
import { X, Mail, Phone, Building2, GraduationCap, Award, Briefcase, Calendar, User, ShieldCheck } from 'lucide-react';
import { getProfileIdentity } from '../../platform/profileIdentity';

const ROLE_LABELS = {
  counsellor: 'Counsellor',
  career_counsellor: 'Career Counsellor',
  psychologist: 'Psychologist',
  educator: 'Educator',
};

const ROLE_STYLES = {
  counsellor: 'bg-purple-100 text-purple-700',
  career_counsellor: 'bg-indigo-100 text-indigo-700',
  psychologist: 'bg-blue-100 text-blue-700',
  educator: 'bg-emerald-100 text-emerald-700',
};

const formatDate = value => {
  if (!value) return 'Not available';
  try {
    const date = value?.toDate ? value.toDate() : new Date(value);
    return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return 'Not available';
  }
};

const Info = ({ icon: Icon, label, value }) => (
  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
    <div className="flex items-center gap-2 text-slate-400 mb-1"><Icon className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wide">{label}</span></div>
    <p className="text-sm font-semibold text-slate-800 break-words">{value || 'Not provided'}</p>
  </div>
);

const ProfessionalDetailPanel = ({ professional, isOpen, onClose, onEdit }) => {
  if (!isOpen || !professional) return null;

  const identity = getProfileIdentity(null, professional);
  const role = professional.role || professional.professionalRole || 'unknown';
  const status = professional.status || 'active';

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
        <header className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-purple-50 to-white">
          <div className="flex items-center gap-4 min-w-0">
            {identity.photoURL ? <img src={identity.photoURL} alt="" className="w-14 h-14 shrink-0 rounded-2xl object-cover shadow-lg" /> : <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">{identity.initial}</div>}
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-slate-900 truncate">{identity.name}</h2>
              <p className="text-xs text-slate-400 font-mono truncate">{professional.id}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ROLE_STYLES[role] || 'bg-slate-100 text-slate-600'}`}>{ROLE_LABELS[role] || role}</span><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{status === 'active' ? 'Active' : 'Inactive'}</span></div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6" /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section><h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><User className="w-4 h-4 text-purple-500" /> Contact Information</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Info icon={Mail} label="Email" value={identity.email} /><Info icon={Phone} label="Phone" value={professional.phone} /></div></section>
          <section><h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-purple-500" /> Professional Information</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Info icon={Briefcase} label="Role" value={ROLE_LABELS[role] || role} /><Info icon={Award} label="Specialisation" value={professional.specialization} /><Info icon={GraduationCap} label="Qualification" value={professional.qualification} /><Info icon={Building2} label="Organisation" value={professional.institutionName} /><Info icon={ShieldCheck} label="Registration / License" value={professional.registrationNumber} /><Info icon={Calendar} label="Added" value={formatDate(professional.createdAt)} /></div></section>
          <section className="p-4 bg-slate-50 border border-slate-100 rounded-xl"><p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Directory record</p><p className="text-sm text-slate-600">This record is stored in the Firestore <span className="font-semibold">users</span> collection. It is a professional directory profile and does not by itself create a Firebase Authentication login.</p></section>
        </div>

        <footer className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between"><button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Close</button><button onClick={() => onEdit?.(professional)} className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg">Edit Professional</button></footer>
      </aside>
    </>
  );
};

export default ProfessionalDetailPanel;
