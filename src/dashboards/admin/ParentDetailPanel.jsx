import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, User, Users, GraduationCap, Building2, Briefcase, ShieldCheck } from 'lucide-react';
import { getProfileIdentity } from '../../platform/profileIdentity';

const formatDate = value => {
  if (!value) return 'Not available';
  try { const date = value?.toDate ? value.toDate() : new Date(value); return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return 'Not available'; }
};

const PATHS = {
  wellbeing: { label: 'Wellbeing', professional: 'Psychologist', className: 'bg-purple-100 text-purple-700' },
  psychology: { label: 'Wellbeing', professional: 'Psychologist', className: 'bg-purple-100 text-purple-700' },
  sen: { label: 'SEN', professional: 'SEN Educator', className: 'bg-amber-100 text-amber-700' },
  special_education: { label: 'SEN', professional: 'SEN Educator', className: 'bg-amber-100 text-amber-700' },
  career: { label: 'Career', professional: 'Career Counsellor', className: 'bg-emerald-100 text-emerald-700' },
  career_guidance: { label: 'Career', professional: 'Career Counsellor', className: 'bg-emerald-100 text-emerald-700' },
};

const getPath = child => PATHS[String(child.primary_path || child.path || '').toLowerCase()] || null;
const getProfessionalName = (child, path) => {
  const staff = child.assignedStaff || {};
  if (path?.label === 'Career') return staff.careerName || child.assignedProfessionalName || child.assignedCounsellorName || null;
  if (path?.label === 'Wellbeing') return staff.psychologistName || staff.psychologyName || child.assignedProfessionalName || child.assignedCounsellorName || null;
  if (path?.label === 'SEN') return staff.senName || staff.educatorName || child.assignedProfessionalName || child.assignedCounsellorName || null;
  return child.assignedProfessionalName || child.assignedCounsellorName || null;
};

const Info = ({ icon: Icon, label, value }) => <div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center gap-2 text-slate-400 mb-1"><Icon className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wide">{label}</span></div><p className="text-sm font-semibold text-slate-800 break-words">{value || 'Not provided'}</p></div>;

const ParentDetailPanel = ({ parent, isOpen, onClose, onEdit }) => {
  if (!isOpen || !parent) return null;
  const identity = getProfileIdentity(null, parent);
  const children = parent.children || [];
  const status = parent.status || 'active';
  const activeServices = [...new Set(children.map(child => getPath(child)?.label).filter(Boolean))];
  const institutions = [...new Set(children.map(child => child.institutionName || child.schoolName).filter(Boolean))];

  return <><div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} /><aside className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
    <header className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-rose-50 to-white"><div className="flex items-center gap-4 min-w-0">{identity.photoURL ? <img src={identity.photoURL} alt="" className="w-14 h-14 shrink-0 rounded-2xl object-cover shadow-lg" /> : <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">{identity.initial}</div>}<div className="min-w-0"><h2 className="text-xl font-bold text-slate-900 truncate">{identity.name}</h2><p className="text-xs text-slate-400 font-mono truncate">{parent.id}</p><div className="flex items-center gap-2 mt-2"><span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">Parent</span><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{status === 'active' ? 'Active' : 'Inactive'}</span></div></div></div><button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6" /></button></header>

    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <section><h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><User className="w-4 h-4 text-rose-500" /> Contact Information</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Info icon={Mail} label="Email" value={identity.email} /><Info icon={Phone} label="Phone" value={parent.phone} /><Info icon={MapPin} label="Location" value={parent.location || parent.city} /><Info icon={Calendar} label="Added" value={formatDate(parent.createdAt)} /></div></section>

      <section><h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-rose-500" /> Family Overview</h3><div className="grid grid-cols-3 gap-3"><Summary value={children.length} label="Children" /><Summary value={activeServices.length} label="Services" /><Summary value={institutions.length} label="Institutions" /></div>{(activeServices.length || institutions.length) ? <div className="mt-3 flex flex-wrap gap-2">{activeServices.map(service => <span key={service} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${Object.values(PATHS).find(path => path.label === service)?.className || 'bg-slate-100 text-slate-700'}`}>{service}</span>)}{institutions.map(institution => <span key={institution} className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">{institution}</span>)}</div> : null}</section>

      <section><h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-rose-500" /> Linked Children</h3>{children.length ? <div className="space-y-3">{children.map(child => { const childIdentity = getProfileIdentity(null, child); const path = getPath(child); const professional = getProfessionalName(child, path); return <div key={child.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shrink-0">{childIdentity.initial}</div><div className="min-w-0 flex-1"><p className="font-semibold text-slate-900 truncate">{childIdentity.name}</p><p className="text-xs text-slate-400">{child.grade || child.classLevel || 'Class not specified'}{child.schoolName || child.institutionName ? ` • ${child.schoolName || child.institutionName}` : ''}</p></div>{path && <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${path.className}`}>{path.label}</span>}</div><div className="grid grid-cols-2 gap-2 mt-3"><Relationship icon={Building2} label="Institution" value={child.institutionName || child.schoolName || 'Not linked'} /><Relationship icon={Briefcase} label={path?.professional || 'Professional'} value={professional || 'Not assigned'} /></div></div>; })}</div> : <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-500">No student accounts are currently linked to this parent.</div>}</section>

      <section className="p-4 bg-slate-50 border border-slate-100 rounded-xl"><div className="flex items-center gap-2 mb-1"><GraduationCap className="w-4 h-4 text-slate-400" /><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Family linkage</p></div><p className="text-sm text-slate-600">Linked children are resolved from the student directory using the available parent relationship fields, including <span className="font-semibold">parentUid</span>, <span className="font-semibold">parentId</span>, and explicitly linked student IDs.</p></section>
    </div>

    <footer className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between"><button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Close</button><button onClick={() => onEdit?.(parent)} className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-xl shadow-lg">Edit Parent</button></footer>
  </aside></>;
};

const Summary = ({ value, label }) => <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center"><p className="text-2xl font-bold text-slate-900">{value}</p><p className="text-xs font-semibold text-slate-500">{label}</p></div>;
const Relationship = ({ icon: Icon, label, value }) => <div className="p-2.5 bg-white rounded-lg border border-slate-100"><div className="flex items-center gap-1.5 text-slate-400"><Icon className="w-3.5 h-3.5" /><span className="text-[10px] font-bold uppercase tracking-wide">{label}</span></div><p className="text-xs font-semibold text-slate-700 mt-1 truncate">{value}</p></div>;

export default ParentDetailPanel;
