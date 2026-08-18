import React, { useEffect, useMemo, useState } from 'react';
import { X, Mail, Phone, MapPin, Calendar, GraduationCap, Users, BookOpen, Award, Clock, AlertCircle, CheckCircle, User, Link, FileText, TrendingUp, Building2, Briefcase, ShieldCheck } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getProfileIdentity } from '../../platform/profileIdentity';

const PATH_INFO = {
  wellbeing: { label: 'Wellbeing', color: 'purple', icon: '🧠', bg: 'bg-purple-100', text: 'text-purple-700', professional: 'Psychologist' },
  sen: { label: 'SEN', color: 'amber', icon: '🎯', bg: 'bg-amber-100', text: 'text-amber-700', professional: 'SEN Educator' },
  career: { label: 'Career', color: 'emerald', icon: '🚀', bg: 'bg-emerald-100', text: 'text-emerald-700', professional: 'Career Counsellor' },
  unassigned: { label: 'Unassigned', color: 'slate', icon: '❓', bg: 'bg-slate-100', text: 'text-slate-600', professional: 'Professional not assigned' },
};

const RIASEC_LABELS = {
  R: { name: 'Realistic', color: '#EF4444' }, I: { name: 'Investigative', color: '#3B82F6' },
  A: { name: 'Artistic', color: '#8B5CF6' }, S: { name: 'Social', color: '#10B981' },
  E: { name: 'Enterprising', color: '#F59E0B' }, C: { name: 'Conventional', color: '#6366F1' },
};

const normalisePath = (value) => {
  const path = String(value || '').toLowerCase();
  if (path === 'wellbeing' || path === 'psychology' || path === 'psychologist') return 'wellbeing';
  if (path === 'sen' || path === 'special_education') return 'sen';
  if (path === 'career' || path === 'career_guidance') return 'career';
  return 'unassigned';
};

const getProfessionalId = (data = {}, path) => {
  const staff = data.assignedStaff || {};
  if (path === 'career') return staff.careerId || data.assignedProfessionalId || data.assignedCounsellorId || null;
  if (path === 'wellbeing') return staff.psychologistId || staff.psychologyId || data.assignedProfessionalId || data.assignedCounsellorId || null;
  if (path === 'sen') return staff.senId || staff.educatorId || data.assignedProfessionalId || data.assignedCounsellorId || null;
  return data.assignedProfessionalId || data.assignedCounsellorId || null;
};

const getParentIds = (data = {}) => {
  const candidates = [data.parentUid, data.parentId, ...(Array.isArray(data.parentUids) ? data.parentUids : []), ...(Array.isArray(data.parentIds) ? data.parentIds : []), ...(Array.isArray(data.linkedParentIds) ? data.linkedParentIds : [])];
  return [...new Set(candidates.filter(Boolean).map(String))];
};

const SlideOutDetailPanel = ({ user, isOpen, onClose }) => {
  const [additionalData, setAdditionalData] = useState(null);
  const [linkedParents, setLinkedParents] = useState([]);
  const [assignedProfessional, setAssignedProfessional] = useState(null);
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(false);

  const identity = getProfileIdentity(user, additionalData || {});
  const path = normalisePath(additionalData?.primary_path || user?.primary_path || user?.path);
  const pathInfo = PATH_INFO[path];
  const merged = useMemo(() => ({ ...(user || {}), ...(additionalData || {}) }), [user, additionalData]);

  useEffect(() => { if (isOpen && user?.id) fetchAdditionalData(); }, [isOpen, user?.id]);

  const fetchAdditionalData = async () => {
    setLoading(true); setAdditionalData(null); setLinkedParents([]); setAssignedProfessional(null); setInstitution(null);
    try {
      const userSnap = await getDoc(doc(db, 'users', user.id));
      const data = userSnap.exists() ? userSnap.data() : {};
      setAdditionalData(data);
      const combined = { ...user, ...data };
      const parentIds = getParentIds(combined);
      const professionalId = getProfessionalId(combined, normalisePath(data.primary_path || user.primary_path || user.path));
      const institutionId = data.institutionId || user.institutionId || data.school?.institutionId || null;
      const [parents, professionalSnap, institutionSnap] = await Promise.all([
        Promise.all(parentIds.map(async (id) => { const snap = await getDoc(doc(db, 'users', id)); return snap.exists() ? { id: snap.id, ...snap.data() } : null; })),
        professionalId ? getDoc(doc(db, 'users', professionalId)) : Promise.resolve(null),
        institutionId ? getDoc(doc(db, 'institutions', institutionId)) : Promise.resolve(null),
      ]);
      setLinkedParents(parents.filter(Boolean));
      if (professionalSnap?.exists()) setAssignedProfessional({ id: professionalSnap.id, ...professionalSnap.data() });
      if (institutionSnap?.exists()) setInstitution({ id: institutionSnap.id, ...institutionSnap.data() });
    } catch (error) { console.error('Error fetching student relationship data:', error); }
    finally { setLoading(false); }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try { const d = date.toDate ? date.toDate() : new Date(date); return Number.isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch (_) { return 'N/A'; }
  };

  const getRIASECScores = () => {
    const scores = additionalData?.riasecScores || user?.riasecScores || additionalData?.careerDNA?.riasec?.scores || {};
    return Object.entries(scores).filter(([key]) => RIASEC_LABELS[key]).map(([key, value]) => ({ code: key, ...RIASEC_LABELS[key], score: Number(value) || 0, percentage: Math.min(100, ((Number(value) || 0) / 12) * 100) })).sort((a, b) => b.score - a.score);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4 min-w-0"><ProfileAvatar user={user} data={additionalData || {}} /><div className="min-w-0"><h2 className="text-xl font-bold text-slate-900 truncate">{identity.name}</h2><p className="text-sm text-slate-500 font-mono truncate">{user?.id}</p></div></div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${pathInfo.bg} ${pathInfo.text}`}><span>{pathInfo.icon}</span>{pathInfo.label} Student</span>
            {merged.status && <StatusBadge status={merged.status} />}
            {(merged.riasecCode || merged.careerDNA?.riasec?.code) && <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-bold text-slate-700"><TrendingUp className="w-4 h-4" />RIASEC: {merged.riasecCode || merged.careerDNA.riasec.code}</span>}
          </div>

          <SectionCard title="Relationship Overview" icon={Link}>
            <div className="grid grid-cols-2 gap-3">
              <RelationshipItem icon={Building2} label="Institution" value={institution?.name || merged.institutionName || merged.schoolName || 'Not linked'} status={institution ? 'Linked' : 'Not linked'} />
              <RelationshipItem icon={Briefcase} label="Professional" value={assignedProfessional?.name || 'Not assigned'} status={assignedProfessional ? pathInfo.professional : 'Unassigned'} />
              <RelationshipItem icon={Users} label="Parents / Guardians" value={`${linkedParents.length} linked account${linkedParents.length === 1 ? '' : 's'}`} status={linkedParents.length ? 'Linked' : 'Not linked'} />
              <RelationshipItem icon={ShieldCheck} label="Service" value={pathInfo.label} status="Active path" />
            </div>
          </SectionCard>

          <SectionCard title="Contact Information" icon={User}><div className="grid grid-cols-2 gap-4"><InfoItem icon={Mail} label="Email" value={identity.email || merged.email || 'Not provided'} /><InfoItem icon={Phone} label="Phone" value={merged.phone || merged.contactNumber || 'Not provided'} /><InfoItem icon={MapPin} label="Location" value={merged.location || merged.city || 'Not specified'} /><InfoItem icon={Calendar} label="Onboarded" value={formatDate(merged.createdAt || merged.onboardingDate)} /></div></SectionCard>

          <SectionCard title="Academic Details" icon={GraduationCap}><div className="grid grid-cols-2 gap-4"><InfoItem icon={BookOpen} label="Grade / Class" value={merged.grade || merged.classLevel || merged.gradeOrCourse || 'N/A'} /><InfoItem icon={Building2} label="School" value={merged.schoolName || merged.institutionName || 'Not specified'} />{merged.stream1112 && <InfoItem icon={BookOpen} label="Stream" value={merged.stream1112} />}{merged.marks10th != null && <InfoItem icon={Award} label="10th Marks" value={`${merged.marks10th}%`} />}{merged.marks12th != null && <InfoItem icon={Award} label="12th Marks" value={`${merged.marks12th}%`} />}</div></SectionCard>

          {path === 'career' && (merged.riasecScores || merged.riasecCode || merged.careerDNA?.riasec) && <SectionCard title="RIASEC Career DNA" icon={TrendingUp}><div className="space-y-3">{getRIASECScores().map((item) => <div key={item.code} className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ backgroundColor: `${item.color}20`, color: item.color }}>{item.code}</div><div className="flex-1"><div className="flex items-center justify-between mb-1"><span className="text-sm font-semibold text-slate-700">{item.name}</span><span className="text-xs text-slate-500">{item.score}/12</span></div><div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.color }} /></div></div></div>)}</div>{merged.riasecSummary && <div className="mt-4 p-3 bg-slate-50 rounded-xl"><p className="text-sm text-slate-600">{merged.riasecSummary}</p></div>}</SectionCard>}

          {merged.iepStatus && <SectionCard title="IEP Status" icon={FileText}><div className="flex items-center gap-3"><StatusBadge status={merged.iepStatus} /><span className="text-sm text-slate-600">{merged.iepStatus === 'active' ? 'Individualized Education Plan is active' : merged.iepStatus === 'pending' ? 'IEP needs to be created' : merged.iepStatus === 'completed' ? 'IEP goals have been achieved' : 'No IEP initiated'}</span></div>{merged.iepLastUpdated && <p className="text-xs text-slate-400 mt-2">Last updated: {formatDate(merged.iepLastUpdated)}</p>}</SectionCard>}

          <SectionCard title="Assigned Professional" icon={Briefcase}>{assignedProfessional ? <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl"><ProfileAvatar user={assignedProfessional} data={assignedProfessional} className="w-12 h-12" /><div className="flex-1 min-w-0"><p className="font-semibold text-slate-900 truncate">{assignedProfessional.name || 'Unknown'}</p><p className="text-sm text-slate-500 truncate">{assignedProfessional.email || 'No email'}</p><p className="text-xs text-slate-400 mt-1">{pathInfo.professional}</p></div><span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">Assigned</span></div> : <EmptyState icon={AlertCircle} text="No professional assigned yet" tone="amber" />}</SectionCard>

          <SectionCard title="Parents / Guardians" icon={Users}>{linkedParents.length ? linkedParents.map((parent) => <div key={parent.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl mb-2 last:mb-0"><ProfileAvatar user={parent} data={parent} className="w-11 h-11" /><div className="flex-1 min-w-0"><p className="font-semibold text-slate-900 truncate">{parent.name || 'Unknown'}</p><p className="text-sm text-slate-500 truncate">{parent.email || 'No email'}</p><p className="text-xs text-slate-400 mt-1">{parent.parentType || parent.relationship || 'Parent / Guardian'}</p></div><span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">Linked</span></div>) : <EmptyState icon={User} text="No parent or guardian account is linked" />}</SectionCard>

          <SectionCard title="Engagement" icon={Clock}><div className="grid grid-cols-3 gap-4"><Stat value={merged.sessionsAttended || 0} label="Sessions" /><Stat value={merged.assessmentsCompleted || 0} label="Assessments" /><Stat value={merged.exPoints || merged.xp || 0} label="XP Earned" /></div></SectionCard>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between"><button onClick={onClose} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl">Close Panel</button><div className="flex items-center gap-2"><button className="px-4 py-2.5 bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl">Edit Profile</button><button className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white rounded-xl shadow-lg">Manage Student</button></div></div>
        {loading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" /></div>}
      </div>
    </>
  );
};

const ProfileAvatar = ({ user, data = {}, className = 'w-14 h-14' }) => { const identity = getProfileIdentity(user, data); const [imageFailed, setImageFailed] = useState(false); const showImage = Boolean(identity.photoURL) && !imageFailed; return showImage ? <img src={identity.photoURL} alt="" className={`${className} rounded-2xl object-cover shadow-lg bg-slate-100`} onError={() => setImageFailed(true)} /> : <div className={`${className} rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg`}>{identity.initial || 'S'}</div>; };
const SectionCard = ({ title, icon: Icon, children }) => <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"><div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2"><Icon className="w-4 h-4 text-slate-500" /><h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3></div><div className="p-4">{children}</div></div>;
const InfoItem = ({ icon: Icon, label, value }) => <div className="flex items-start gap-2"><Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" /><div><p className="text-xs text-slate-400 font-medium">{label}</p><p className="text-sm text-slate-900 font-semibold truncate">{value || 'N/A'}</p></div></div>;
const RelationshipItem = ({ icon: Icon, label, value, status }) => <div className="p-3 bg-slate-50 rounded-xl"><div className="flex items-center gap-2"><Icon className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-400 font-medium">{label}</p></div><p className="text-sm font-semibold text-slate-900 mt-1 truncate">{value}</p><p className="text-xs text-slate-500 mt-1">{status}</p></div>;
const EmptyState = ({ icon: Icon, text, tone = 'slate' }) => <div className={`flex items-center gap-3 p-4 rounded-xl border ${tone === 'amber' ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}><Icon className="w-5 h-5" /><p className="text-sm font-medium">{text}</p></div>;
const Stat = ({ value, label }) => <div className="text-center p-3 bg-slate-50 rounded-xl"><p className="text-2xl font-bold text-slate-900">{value}</p><p className="text-xs text-slate-500 font-medium">{label}</p></div>;
const StatusBadge = ({ status }) => { const config = { active: ['bg-emerald-100', 'text-emerald-700', CheckCircle, 'Active'], pending: ['bg-amber-100', 'text-amber-700', Clock, 'Pending'], completed: ['bg-blue-100', 'text-blue-700', CheckCircle, 'Completed'], none: ['bg-slate-100', 'text-slate-600', AlertCircle, 'None'] }; const [bg, text, Icon, label] = config[status] || config.none; return <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${bg} ${text}`}><Icon className="w-4 h-4" />{label}</span>; };

export default SlideOutDetailPanel;
