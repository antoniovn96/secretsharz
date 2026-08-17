import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, User, Users, GraduationCap } from 'lucide-react';
import { getProfileIdentity } from '../../platform/profileIdentity';

const formatDate = value => {
  if (!value) return 'Not available';
  try { const date = value?.toDate ? value.toDate() : new Date(value); return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch { return 'Not available'; }
};

const Info = ({ icon: Icon, label, value }) => <div className="p-4 bg-slate-50 rounded-xl border border-slate-100"><div className="flex items-center gap-2 text-slate-400 mb-1"><Icon className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wide">{label}</span></div><p className="text-sm font-semibold text-slate-800 break-words">{value || 'Not provided'}</p></div>;

const ParentDetailPanel = ({ parent, isOpen, onClose, onEdit }) => {
  if (!isOpen || !parent) return null;
  const identity = getProfileIdentity(null, parent);
  const children = parent.children || [];
  const status = parent.status || 'active';

  return <><div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} /><aside className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col">
    <header className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-rose-50 to-white"><div className="flex items-center gap-4 min-w-0">{identity.photoURL ? <img src={identity.photoURL} alt="" className="w-14 h-14 shrink-0 rounded-2xl object-cover shadow-lg" /> : <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">{identity.initial}</div>}<div className="min-w-0"><h2 className="text-xl font-bold text-slate-900 truncate">{identity.name}</h2><p className="text-xs text-slate-400 font-mono truncate">{parent.id}</p><div className="flex items-center gap-2 mt-2"><span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">Parent</span><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{status === 'active' ? 'Active' : 'Inactive'}</span></div></div></div><button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6" /></button></header>
    <div className="flex-1 overflow-y-auto p-6 space-y-6"><section><h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><User className="w-4 h-4 text-rose-500" /> Contact Information</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-3"><Info icon={Mail} label="Email" value={identity.email} /><Info icon={Phone} label="Phone" value={parent.phone} /><Info icon={MapPin} label="Location" value={parent.location || parent.city} /><Info icon={Calendar} label="Added" value={formatDate(parent.createdAt)} /></div></section><section><h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-rose-500" /> Linked Children</h3>{children.length ? <div className="space-y-2">{children.map(child => <div key={child.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold">{getProfileIdentity(null, child).initial}</div><div className="min-w-0 flex-1"><p className="font-semibold text-slate-900 truncate">{getProfileIdentity(null, child).name}</p><p className="text-xs text-slate-400">{child.grade || child.classLevel || 'Class not specified'}{child.schoolName ? ` • ${child.schoolName}` : ''}</p></div></div>)}</div> : <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-500">No student accounts are currently linked to this parent.</div>}</section><section className="p-4 bg-slate-50 border border-slate-100 rounded-xl"><div className="flex items-center gap-2 mb-1"><GraduationCap className="w-4 h-4 text-slate-400" /><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Family linkage</p></div><p className="text-sm text-slate-600">Linked children are resolved from student records whose <span className="font-semibold">parentId</span> matches this parent account.</p></section></div>
    <footer className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between"><button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Close</button><button onClick={() => onEdit?.(parent)} className="px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-xl shadow-lg">Edit Parent</button></footer>
  </aside></>;
};

export default ParentDetailPanel;
