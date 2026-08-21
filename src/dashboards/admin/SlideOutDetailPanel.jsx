import React, { useEffect, useMemo, useState } from 'react';
import { X, Mail, Phone, MapPin, Calendar, GraduationCap, Users, BookOpen, Award, Clock, AlertCircle, CheckCircle, User, Link, FileText, TrendingUp, Building2, Briefcase, ShieldCheck, RefreshCw } from 'lucide-react';
import { auth } from '../../firebase';
import { getProfileIdentity, safeText } from '../../platform/profileIdentity';

const PATH_INFO = {
  wellbeing: { label: 'Wellbeing', icon: '🧠', bg: 'bg-purple-100', text: 'text-purple-700', professional: 'Psychologist' },
  sen: { label: 'SEN', icon: '🎯', bg: 'bg-amber-100', text: 'text-amber-700', professional: 'SEN Educator' },
  career: { label: 'Career', icon: '🚀', bg: 'bg-emerald-100', text: 'text-emerald-700', professional: 'Career Counsellor' },
  unassigned: { label: 'Unassigned', icon: '❓', bg: 'bg-slate-100', text: 'text-slate-600', professional: 'Professional not assigned' },
};
const RIASEC_LABELS = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' };
const asText = value => { if (value == null) return ''; if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value); if (Array.isArray(value)) return value.map(asText).filter(Boolean).join(', '); if (typeof value === 'object') return asText(value.international || value.number || value.display || value.label || value.name || value.code || value.cityName || value.countryName || ''); return ''; };
const displayValue = (value, fallback = 'Not provided') => asText(value).trim() || fallback;
const normalisePath = value => { const path = asText(value).toLowerCase(); if (['wellbeing', 'psychology', 'psychologist'].includes(path)) return 'wellbeing'; if (['sen', 'special_education'].includes(path)) return 'sen'; if (['career', 'career_guidance'].includes(path)) return 'career'; return 'unassigned'; };
const formatDate = value => { if (!value) return 'N/A'; try { const date = value?.toDate ? value.toDate() : new Date(value); return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (_) { return 'N/A'; } };

const SlideOutDetailPanel = ({ user, isOpen, onClose, isLoading: externalLoading = false, error = '' }) => {
  const [profile, setProfile] = useState(user || null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => { setProfile(user || null); }, [user]);
  useEffect(() => { if (isOpen && user?.id) loadProfile(user.id); }, [isOpen, user?.id]);

  const loadProfile = async studentId => {
    setLoading(true); setLoadError('');
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Authentication required to load student details.');
      const token = await currentUser.getIdToken(true);
      const response = await fetch(`/api/admin/student-detail?studentId=${encodeURIComponent(studentId)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to load the authorized student profile.');
      setProfile(payload?.profile ? { ...(user || {}), ...payload.profile } : user);
    } catch (err) { console.error('[SlideOutDetailPanel] profile load failed:', err); setLoadError(err?.message || 'Unable to load student details.'); }
    finally { setLoading(false); }
  };

  const merged = profile || {};
  const identity = getProfileIdentity(merged, merged.identity || {});
  const path = normalisePath(merged.primary_path || merged.path || merged.services?.primaryPath || merged.services?.path || merged.institution?.primary_path);
  const pathInfo = PATH_INFO[path];
  const busy = loading || externalLoading;
  const institution = merged.institution || {};
  const academic = merged.academic || {};
  const contact = merged.contact || {};
  const family = merged.family || {};
  const relationships = merged.relationships || {};
  const assignments = relationships.assignments || {};
  const career = merged.career || {};
  const wellbeing = merged.wellbeing || {};
  const sen = merged.sen || {};
  const services = merged.services || {};
  const guardians = Array.isArray(family.guardians) ? family.guardians : [];
  const professionalName = asText(assignments[path] || merged.assignedProfessionalName || merged.assignedStaff?.[path]);
  const professionalId = asText(assignments[path] || merged.assignedProfessionalId || '');
  const riasec = career.riasec || career.careerDNA?.riasec || merged.careerDNA?.riasec || {};
  const riasecScores = riasec.scores || merged.riasecScores || {};
  const riasecCode = asText(riasec.code || merged.riasecCode);

  const getRIASECScores = useMemo(() => Object.entries(riasecScores).filter(([key]) => RIASEC_LABELS[key]).map(([code, value]) => ({ code, name: RIASEC_LABELS[code], score: Number(value) || 0 })).sort((a, b) => b.score - a.score), [riasecScores]);
  if (!isOpen) return null;

  return <>
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
    <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white"><div className="flex items-center gap-4 min-w-0"><ProfileAvatar user={merged} data={merged} /><div className="min-w-0"><h2 className="text-xl font-bold text-slate-900 truncate">{displayValue(identity.name || merged.name, 'Student')}</h2><p className="text-sm text-slate-500 font-mono truncate">{displayValue(merged.id, 'Unknown ID')}</p></div></div><button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6" /></button></div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {(error || loadError) && <div className="p-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium"><AlertCircle className="inline w-4 h-4 mr-2" />{displayValue(error || loadError, 'Unable to load student details.')}</div>}
        <div className="flex flex-wrap items-center gap-3"><span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${pathInfo.bg} ${pathInfo.text}`}><span>{pathInfo.icon}</span>{pathInfo.label} Student</span>{merged.status && <StatusBadge status={merged.status} />}{riasecCode && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-bold text-slate-700"><TrendingUp className="w-4 h-4" />RIASEC: {riasecCode}</span>}</div>

        <SectionCard title="Relationship Overview" icon={Link}><div className="grid grid-cols-2 gap-3"><RelationshipItem icon={Building2} label="Institution" value={displayValue(institution.name || merged.institutionName || merged.schoolName, 'Not linked')} status={institution.id || merged.institutionId ? 'Linked' : 'Not linked'} /><RelationshipItem icon={Briefcase} label="Professional" value={displayValue(professionalName, 'Not assigned')} status={professionalId ? pathInfo.professional : 'Unassigned'} /><RelationshipItem icon={Users} label="Parents / Guardians" value={`${guardians.length} linked account${guardians.length === 1 ? '' : 's'}`} status={guardians.length ? 'Linked' : 'Not linked'} /><RelationshipItem icon={ShieldCheck} label="Service" value={displayValue(services.primary || services.name || pathInfo.label)} status="Active path" /></div></SectionCard>

        <SectionCard title="Contact Information" icon={User}><div className="grid grid-cols-2 gap-4"><InfoItem icon={Mail} label="Email" value={identity.email || contact.email || merged.email} /><InfoItem icon={Phone} label="Phone" value={contact.mobile || contact.phone || merged.phone || merged.contactNumber} /><InfoItem icon={MapPin} label="Location" value={contact.city || contact.location || merged.city || merged.location} /><InfoItem icon={Calendar} label="Onboarded" value={formatDate(merged.createdAt || merged.onboarding?.completedAt || merged.onboardingDate)} /></div></SectionCard>

        <SectionCard title="Academic Details" icon={GraduationCap}><div className="grid grid-cols-2 gap-4"><InfoItem icon={BookOpen} label="Grade / Class" value={academic.grade || academic.gradeOrCourse || merged.grade || merged.classLevel} /><InfoItem icon={Building2} label="School" value={academic.schoolName || institution.name || merged.schoolName || merged.institutionName} />{(academic.stream1112 || merged.stream1112) && <InfoItem icon={BookOpen} label="Stream" value={academic.stream1112 || merged.stream1112} />}{(academic.marks10th ?? merged.marks10th) != null && <InfoItem icon={Award} label="10th Marks" value={`${displayValue(academic.marks10th ?? merged.marks10th)}%`} />}{(academic.marks12th ?? merged.marks12th) != null && <InfoItem icon={Award} label="12th Marks" value={`${displayValue(academic.marks12th ?? merged.marks12th)}%`} />}</div></SectionCard>

        {path === 'career' && (riasecCode || Object.keys(riasecScores).length) > 0 && <SectionCard title="RIASEC Career DNA" icon={TrendingUp}><div className="space-y-3">{getRIASECScores.map(item => <div key={item.code} className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg bg-slate-100 text-slate-700">{item.code}</div><div className="flex-1"><div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold text-slate-700">{item.name}</span><span className="text-xs text-slate-500">{item.score}</span></div><div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-slate-700" style={{ width: `${Math.min(100, Math.max(0, item.score / 12 * 100))}%` }} /></div></div></div>)}{riasec.summary && <div className="mt-4 p-3 bg-slate-50 rounded-xl"><p className="text-sm text-slate-600">{displayValue(riasec.summary)}</p></div>}</div></SectionCard>}

        {sen.iepStatus && <SectionCard title="IEP Status" icon={FileText}><div className="flex items-center gap-3"><StatusBadge status={sen.iepStatus} /><span className="text-sm text-slate-600">{displayValue(sen.iepStatus)}</span></div>{sen.iepLastUpdated && <p className="text-xs text-slate-400 mt-2">Last updated: {formatDate(sen.iepLastUpdated)}</p>}</SectionCard>}

        <SectionCard title="Assigned Professional" icon={Briefcase}>{professionalId || professionalName ? <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl"><ProfileAvatar user={{ name: professionalName || 'Professional' }} data={{}} className="w-12 h-12" /><div className="flex-1 min-w-0"><p className="font-semibold text-slate-900 truncate">{displayValue(professionalName || professionalId, 'Assigned professional')}</p><p className="text-xs text-slate-400 mt-1">{pathInfo.professional}</p></div><span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Assigned</span></div> : <EmptyState icon={AlertCircle} text="No professional assigned yet" tone="amber" />}</SectionCard>

        <SectionCard title="Parents / Guardians" icon={Users}>{guardians.length ? guardians.map((parent, index) => <div key={asText(parent.id || parent.uid) || index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl mb-2 last:mb-0"><ProfileAvatar user={parent} data={parent} className="w-11 h-11" /><div className="flex-1 min-w-0"><p className="font-semibold text-slate-900 truncate">{displayValue(parent.name || parent.fullName, 'Unknown')}</p><p className="text-sm text-slate-500 truncate">{displayValue(parent.email, 'No email')}</p><p className="text-xs text-slate-400 mt-1">{displayValue(parent.relationship || parent.type, 'Parent / Guardian')}</p></div><span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">Linked</span></div>) : <EmptyState icon={User} text="No parent or guardian account is linked" />}</SectionCard>

        <SectionCard title="Engagement" icon={Clock}><div className="grid grid-cols-3 gap-4"><Stat value={merged.engagement?.sessionsAttended ?? merged.sessionsAttended} label="Sessions" /><Stat value={merged.engagement?.assessmentsCompleted ?? merged.assessmentsCompleted} label="Assessments" /><Stat value={merged.engagement?.xp ?? merged.exPoints ?? merged.xp} label="XP Earned" /></div></SectionCard>
      </div>
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between"><button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl">Close Panel</button><div className="flex items-center gap-2"><span className="text-xs text-slate-400">Read-only Student 360</span></div></div>
      {busy && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="text-center"><RefreshCw className="w-7 h-7 mx-auto animate-spin text-slate-700" /><p className="text-xs font-semibold text-slate-500 mt-2">Loading authorized profile…</p></div></div>}
    </div>
  </>;
};

const ProfileAvatar = ({ user, data = {}, className = 'w-14 h-14' }) => { const identity = getProfileIdentity(user, data); const [imageFailed, setImageFailed] = useState(false); const showImage = Boolean(identity.photoURL) && !imageFailed; return showImage ? <img src={identity.photoURL} alt="" className={`${className} rounded-2xl object-cover shadow-lg bg-slate-100`} onError={() => setImageFailed(true)} /> : <div className={`${className} rounded-2xl bg-slate-800 flex items-center justify-center text-white font-bold text-lg shadow-lg`}>{identity.initial || 'S'}</div>; };
const SectionCard = ({ title, icon: Icon, children }) => <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"><div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2"><Icon className="w-4 h-4 text-slate-500" /><h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3></div><div className="p-4">{children}</div></div>;
const InfoItem = ({ icon: Icon, label, value }) => <div className="flex items-start gap-2"><Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" /><div className="min-w-0"><p className="text-xs text-slate-400 font-medium">{label}</p><p className="text-sm text-slate-900 font-semibold truncate">{displayValue(value, 'N/A')}</p></div></div>;
const RelationshipItem = ({ icon: Icon, label, value, status }) => <div className="p-3 bg-slate-50 rounded-xl"><div className="flex items-center gap-2"><Icon className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-400 font-medium">{label}</p></div><p className="text-sm font-semibold text-slate-900 mt-1 truncate">{displayValue(value)}</p><p className="text-xs text-slate-500 mt-1">{displayValue(status)}</p></div>;
const EmptyState = ({ icon: Icon, text, tone = 'slate' }) => <div className={`flex items-center gap-3 p-4 rounded-xl border ${tone === 'amber' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}><Icon className="w-5 h-5" /><p className="text-sm font-medium">{text}</p></div>;
const Stat = ({ value, label }) => <div className="text-center p-3 bg-slate-50 rounded-xl"><p className="text-2xl font-bold text-slate-900">{Number(value) || 0}</p><p className="text-xs text-slate-500 font-medium">{label}</p></div>;
const StatusBadge = ({ status }) => { const config = { active: ['bg-emerald-100', 'text-emerald-700', CheckCircle, 'Active'], pending: ['bg-amber-100', 'text-amber-700', Clock, 'Pending'], completed: ['bg-blue-100', 'text-blue-700', CheckCircle, 'Completed'], none: ['bg-slate-100', 'text-slate-600', AlertCircle, 'None'] }; const [bg, text, Icon, label] = config[asText(status).toLowerCase()] || config.none; return <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${bg} ${text}`}><Icon className="w-4 h-4" />{label}</span>; };
export default SlideOutDetailPanel;
