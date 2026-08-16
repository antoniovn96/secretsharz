import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, MapPin, Calendar, GraduationCap, Users, BookOpen, Award, Clock, AlertCircle, CheckCircle, User, Link, FileText, TrendingUp } from 'lucide-react';
import { doc, getDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase';
import { getProfileIdentity } from '../../platform/profileIdentity';

const PATH_INFO = {
  wellbeing: { label: 'Wellbeing', color: 'purple', icon: '🧠', bg: 'bg-purple-100', text: 'text-purple-700' },
  sen: { label: 'SEN', color: 'amber', icon: '🎯', bg: 'bg-amber-100', text: 'text-amber-700' },
  career: { label: 'Career', color: 'emerald', icon: '🚀', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  unassigned: { label: 'Unassigned', color: 'slate', icon: '❓', bg: 'bg-slate-100', text: 'text-slate-600' },
};

const RIASEC_LABELS = {
  R: { name: 'Realistic', color: '#EF4444', description: 'Hands-on, practical, physical' },
  I: { name: 'Investigative', color: '#3B82F6', description: 'Analytical, intellectual, scientific' },
  A: { name: 'Artistic', color: '#8B5CF6', description: 'Creative, intuitive, expressive' },
  S: { name: 'Social', color: '#10B981', description: 'Helping, teaching, supporting' },
  E: { name: 'Enterprising', color: '#F59E0B', description: 'Persuading, leading, selling' },
  C: { name: 'Conventional', color: '#6366F1', description: 'Organizing, data, record-keeping' },
};

const SlideOutDetailPanel = ({ user, isOpen, onClose }) => {
  const [additionalData, setAdditionalData] = useState(null);
  const [linkedParent, setLinkedParent] = useState(null);
  const [assignedCounsellor, setAssignedCounsellor] = useState(null);
  const [loading, setLoading] = useState(false);

  const identity = getProfileIdentity(user, additionalData || {});
  const pathInfo = PATH_INFO[user?.primary_path] || PATH_INFO.unassigned;

  // Fetch additional data when panel opens
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchAdditionalData();
    }
  }, [isOpen, user?.id]);

  const fetchAdditionalData = async () => {
    setLoading(true);
    setAdditionalData(null);
    setLinkedParent(null);
    setAssignedCounsellor(null);
    try {
      // Fetch user document for complete data
      const userDoc = await getDoc(doc(db, 'users', user.id));
      if (userDoc.exists()) {
        setAdditionalData(userDoc.data());
      }

      // Fetch linked parent if parentId exists
      if (user.parentId) {
        const parentDoc = await getDoc(doc(db, 'users', user.parentId));
        if (parentDoc.exists()) {
          setLinkedParent({ id: parentDoc.id, ...parentDoc.data() });
        }
      }

      // Fetch assigned counsellor
      if (user.assignedCounsellorId) {
        const counsellorDoc = await getDoc(doc(db, 'users', user.assignedCounsellorId));
        if (counsellorDoc.exists()) {
          setAssignedCounsellor({ id: counsellorDoc.id, ...counsellorDoc.data() });
        }
      }
    } catch (error) {
      console.error('Error fetching additional data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getRIASECScores = () => {
    const scores = additionalData?.riasecScores || user?.riasecScores || {};
    return Object.entries(scores).map(([key, value]) => ({
      code: key,
      ...RIASEC_LABELS[key],
      score: value || 0,
      percentage: ((value || 0) / 12) * 100,
    })).sort((a, b) => b.score - a.score);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-4">
            <ProfileAvatar user={user} data={additionalData || {}} />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{identity.name}</h2>
              <p className="text-sm text-slate-500 font-mono">{user?.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Path & Status Badge */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${pathInfo.bg} ${pathInfo.text}`}>
              <span>{pathInfo.icon}</span>
              {pathInfo.label} Student
            </span>
            {(additionalData?.riasecCode || user?.riasecCode) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm font-bold text-slate-700">
                <TrendingUp className="w-4 h-4" />
                RIASEC: {additionalData?.riasecCode || user?.riasecCode}
              </span>
            )}
          </div>

          {/* Contact Information */}
          <SectionCard title="Contact Information" icon={User}>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={Mail} label="Email" value={identity.email || user?.email || 'Not provided'} />
              <InfoItem icon={Phone} label="Phone" value={user?.phone || additionalData?.phone || 'Not provided'} />
              <InfoItem icon={MapPin} label="Location" value={user?.location || user?.city || additionalData?.location || 'Not specified'} />
              <InfoItem icon={Calendar} label="Onboarded" value={formatDate(user?.createdAt || user?.onboardingDate || additionalData?.createdAt)} />
            </div>
          </SectionCard>

          {/* Academic Details */}
          <SectionCard title="Academic Details" icon={GraduationCap}>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem icon={BookOpen} label="Grade/Class" value={user?.grade || user?.classLevel || additionalData?.grade || additionalData?.classLevel || 'N/A'} />
              <InfoItem icon={SchoolIcon} label="School" value={user?.schoolName || user?.institutionName || additionalData?.schoolName || 'Not specified'} />
              {(user?.stream1112 || additionalData?.stream1112) && (
                <InfoItem icon={BookOpen} label="Stream" value={user?.stream1112 || additionalData?.stream1112} />
              )}
              {(user?.marks10th || additionalData?.marks10th) && (
                <InfoItem icon={Award} label="10th Marks" value={`${user?.marks10th || additionalData?.marks10th}%`} />
              )}
              {(user?.marks12th || additionalData?.marks12th) && (
                <InfoItem icon={Award} label="12th Marks" value={`${user?.marks12th || additionalData?.marks12th}%`} />
              )}
            </div>
          </SectionCard>

          {/* RIASEC Career DNA */}
          {(additionalData?.riasecScores || user?.riasecScores || user?.riasecCode || additionalData?.riasecCode) && (
            <SectionCard title="RIASEC Career DNA" icon={TrendingUp}>
              <div className="space-y-3">
                {getRIASECScores().slice(0, 6).map((item) => (
                  <div key={item.code} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                      {item.code}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                        <span className="text-xs text-slate-500">{item.score}/12</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {additionalData?.riasecSummary && (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600">{additionalData.riasecSummary}</p>
                </div>
              )}
            </SectionCard>
          )}

          {/* IEP Status */}
          {user?.iepStatus && (
            <SectionCard title="IEP Status" icon={FileText}>
              <div className="flex items-center gap-3">
                <StatusBadge status={user.iepStatus} />
                <span className="text-sm text-slate-600">
                  {user.iepStatus === 'active' ? 'Individualized Education Plan is active' :
                   user.iepStatus === 'pending' ? 'IEP needs to be created' :
                   user.iepStatus === 'completed' ? 'IEP goals have been achieved' :
                   'No IEP initiated'}
                </span>
              </div>
              {user.iepLastUpdated && (
                <p className="text-xs text-slate-400 mt-2">
                  Last updated: {formatDate(user.iepLastUpdated)}
                </p>
              )}
            </SectionCard>
          )}

          {/* Assigned Counsellor */}
          <SectionCard title="Assigned Counsellor" icon={Users}>
            {assignedCounsellor ? (
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <ProfileAvatar user={assignedCounsellor} data={assignedCounsellor} className="w-12 h-12" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{assignedCounsellor.name || 'Unknown'}</p>
                  <p className="text-sm text-slate-500">{assignedCounsellor.email || 'No email'}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg">
                  Active
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <p className="text-sm text-amber-700 font-medium">No counsellor assigned yet</p>
              </div>
            )}
          </SectionCard>

          {/* Linked Parent */}
          <SectionCard title="Linked Parent" icon={Link}>
            {linkedParent ? (
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <ProfileAvatar user={linkedParent} data={linkedParent} className="w-12 h-12" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{linkedParent.name || 'Unknown'}</p>
                  <p className="text-sm text-slate-500">{linkedParent.email || 'No email'}</p>
                </div>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">
                  Linked
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <User className="w-5 h-5 text-slate-400" />
                <p className="text-sm text-slate-500 font-medium">No parent linked to this account</p>
              </div>
            )}
          </SectionCard>

          {/* Engagement Stats */}
          <SectionCard title="Engagement" icon={Clock}>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-900">{additionalData?.sessionsAttended || 0}</p>
                <p className="text-xs text-slate-500 font-medium">Sessions</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-900">{additionalData?.assessmentsCompleted || 0}</p>
                <p className="text-xs text-slate-500 font-medium">Assessments</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-900">{additionalData?.exPoints || user?.xp || 0}</p>
                <p className="text-xs text-slate-500 font-medium">XP Earned</p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
          >
            Close Panel
          </button>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2.5 bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-all">
              Edit Profile
            </button>
            <button className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-sm font-semibold text-white rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
              Manage Student
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </>
  );
};

const ProfileAvatar = ({ user, data = {}, className = 'w-14 h-14' }) => {
  const identity = getProfileIdentity(user, data);
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(identity.photoURL) && !imageFailed;

  return showImage ? (
    <img
      src={identity.photoURL}
      alt=""
      className={`${className} rounded-2xl object-cover shadow-lg bg-slate-100`}
      onError={() => setImageFailed(true)}
    />
  ) : (
    <div className={`${className} rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
      {identity.initial || 'S'}
    </div>
  );
};

// Helper Components
const SchoolIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
      <Icon className="w-4 h-4 text-slate-500" />
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
    </div>
    <div className="p-4">
      {children}
    </div>
  </div>
);

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="text-sm text-slate-900 font-semibold truncate">{value || 'N/A'}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = {
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle, label: 'Active' },
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock, label: 'Pending' },
    completed: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle, label: 'Completed' },
    none: { bg: 'bg-slate-100', text: 'text-slate-600', icon: AlertCircle, label: 'None' },
  };
  const { bg, text, icon: Icon, label } = config[status] || config.none;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${bg} ${text}`}>
      <Icon className="w-4 h-4" />
      {label}
    </span>
  );
};

export default SlideOutDetailPanel;
