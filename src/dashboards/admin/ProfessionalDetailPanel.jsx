import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, Building2, GraduationCap, Award, Briefcase, Calendar, User, ShieldCheck, Users, Loader2 } from 'lucide-react';
import { auth } from '../../firebase';
import { getProfileIdentity } from '../../platform/profileIdentity';

const ROLE_LABELS = {
  counsellor: 'Counsellor',
  career_counsellor: 'Career Counsellor',
  psychologist: 'Psychologist',
  educator: 'SEN Educator',
};

const ROLE_STYLES = {
  counsellor: 'bg-purple-100 text-purple-700',
  career_counsellor: 'bg-indigo-100 text-indigo-700',
  psychologist: 'bg-blue-100 text-blue-700',
  educator: 'bg-emerald-100 text-emerald-700',
};

const SERVICE_LABELS = {
  career: 'Career Guidance',
  wellbeing: 'Wellbeing & Counselling',
  sen: 'SEN Support'
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
  const [relationshipData, setRelationshipData] = useState(null);
  const [loadingRelationships, setLoadingRelationships] = useState(false);
  const [relationshipError, setRelationshipError] = useState('');

  useEffect(() => {
    if (!isOpen || !professional?.id) return;
    let mounted = true;
    const load = async () => {
      setLoadingRelationships(true);
      setRelationshipError('');
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error('Authentication required.');
        const token = await currentUser.getIdToken(true);
        const response = await fetch(`/api/admin/professional-detail?uid=${encodeURIComponent(professional.id)}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || 'Unable to load professional relationships.');
        if (mounted) setRelationshipData(payload);
      } catch (error) {
        if (mounted) setRelationshipError(error?.message || 'Unable to load professional relationships.');
      } finally {
        if (mounted) setLoadingRelationships(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [isOpen, professional?.id]);

  if (!isOpen || !professional) return null;

  const identity = getProfileIdentity(null, professional);
  const role = professional.role || professional.professionalRole || 'unknown';
  const status = professional.status || 'active';
  const service = relationshipData?.professional?.service || professional.professionalService || null;
  const institutions = relationshipData?.institutions || [];
  const students = relationshipData?.students || [];
  const parents = relationshipData?.parents || [];
  const counts = relationshipData?.counts || { institutions: institutions.length, students: students.length, parents: parents.length };

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

          <section>
            <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Building2 className="w-4 h-4 text-purple-500" /> Service & Institutions</h3>{service && <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{SERVICE_LABELS[service] || service}</span>}</div>
            {loadingRelationships ? <div className="flex items-center justify-center gap-2 py-8 text-sm font-semibold text-slate-500"><Loader2 className="w-4 h-4 animate-spin" />Loading relationships…</div> : relationshipError ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">{relationshipError}</div> : institutions.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No institution assignments recorded.</div> : <div className="space-y-2">{institutions.map(institution => <div key={institution.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center"><Building2 className="w-4 h-4 text-slate-600" /></div><div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-900 truncate">{institution.name || 'Unnamed institution'}</p><p className="text-xs text-slate-500 truncate">{institution.institutionCode || institution.city || 'Institution'}</p></div><span className="text-xs font-bold text-slate-600">{institution.students} student{institution.students === 1 ? '' : 's'}</span></div>)}</div>}
          </section>

          <section>
            <div className="grid grid-cols-3 gap-3 mb-4"><div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-2xl font-black text-slate-900">{counts.institutions}</p><p className="text-xs font-bold text-slate-500">Institutions</p></div><div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-2xl font-black text-slate-900">{counts.students}</p><p className="text-xs font-bold text-slate-500">Students</p></div><div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><p className="text-2xl font-black text-slate-900">{counts.parents}</p><p className="text-xs font-bold text-slate-500">Parents</p></div></div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-purple-500" /> Current Caseload</h3>
            {loadingRelationships ? <div className="py-6" /> : students.length === 0 ? <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">No students are currently assigned to this professional.</div> : <div className="space-y-2">{students.slice(0, 12).map(student => <div key={student.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"><div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">{(student.name || 'S').charAt(0).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-900 truncate">{student.name || 'Unnamed student'}</p><p className="text-xs text-slate-500 truncate">{student.grade ? `Grade ${student.grade}` : 'Student'}{student.schoolName ? ` · ${student.schoolName}` : ''}</p></div></div>)}{students.length > 12 && <p className="text-xs font-semibold text-slate-500 text-center pt-2">Showing 12 of {students.length} assigned students.</p>}</div>}
          </section>

          <section className="p-4 bg-slate-50 border border-slate-100 rounded-xl"><p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Relationship model</p><p className="text-sm text-slate-600">Institution assignments are service-aware, and the caseload is derived from the canonical professional-to-student relationship rather than from a manually entered count.</p></section>
        </div>

        <footer className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between"><button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Close</button><button onClick={() => onEdit?.(professional)} className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg">Edit Professional</button></footer>
      </aside>
    </>
  );
};

export default ProfessionalDetailPanel;
