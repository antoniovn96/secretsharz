import React, { useCallback, useEffect, useState } from 'react';
import { BriefcaseBusiness, GraduationCap, HeartHandshake, Brain, Users } from 'lucide-react';
import { auth } from '../../firebase';
import UserDirectoryTable from './UserDirectoryTable';
import SlideOutDetailPanel from './SlideOutDetailPanel';

const SERVICE_META = {
  career: { label: 'Career Guidance', path: 'career', icon: BriefcaseBusiness, tone: 'emerald' },
  wellbeing: { label: 'Counselling & Wellbeing', path: 'wellbeing', icon: HeartHandshake, tone: 'violet' },
  sen: { label: 'SEN / Learning Support', path: 'sen', icon: Brain, tone: 'amber' },
};

function normalizeStudent(student) {
  const ssStudentId = String(student?.ssStudentId || student?.studentId || '').trim();
  const authUid = String(student?.authUid || student?.uid || '').trim() || null;
  const studentDocumentId = String(student?.studentDocumentId || student?.documentId || '').trim() || null;
  return {
    ...student,
    id: ssStudentId || '',
    ssStudentId: ssStudentId || null,
    studentId: ssStudentId || null,
    authUid,
    uid: authUid,
    studentDocumentId,
    internalRecordId: studentDocumentId || authUid || null,
  };
}

export default function ServiceStudentDirectory({ service = 'career', theme = 'light' }) {
  const meta = SERVICE_META[service] || SERVICE_META.career;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const load = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) { setError('Authentication required to load students.'); setLoading(false); return; }
    setLoading(true); setError('');
    try {
      let token = await currentUser.getIdToken(true);
      let response = await fetch(`/api/admin/service-students?service=${encodeURIComponent(meta.path)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      if (response.status === 401) {
        token = await currentUser.getIdToken(true);
        response = await fetch(`/api/admin/service-students?service=${encodeURIComponent(meta.path)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      }
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to load students.');
      setStudents((Array.isArray(payload.students) ? payload.students : []).map(normalizeStudent));
    } catch (err) {
      console.error('[ServiceStudentDirectory] failed:', err);
      setError(err?.message || 'Unable to load students.');
    } finally { setLoading(false); }
  }, [meta.path]);

  useEffect(() => { load(); }, [load]);

  const completeProfiles = students.filter(student => student?.profileComplete === true || student?.onboardingCompleted === true).length;
  const assessmentComplete = students.filter(student => Boolean(student?.riasecCode || student?.careerDNA?.riasec?.code || student?.careerAssessment?.hollandCode?.length)).length;
  const isDark = theme === 'dark';
  const Icon = meta.icon;

  const openStudentDetails = (student) => {
    const internalId = student?.studentDocumentId || student?.internalRecordId || student?.authUid || null;
    setSelectedStudent({ ...student, id: internalId || student?.id || '' });
    setDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${meta.tone === 'violet' ? 'bg-violet-500/10 text-violet-500' : meta.tone === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}><Icon className="w-5 h-5" /></div>
            <div><p className={`text-[10px] uppercase tracking-[0.16em] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{meta.label} · Students</p><h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>Student Directory</h1></div>
          </div>
          <p className={`mt-3 text-sm max-w-3xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>These are the existing student records from the central student directory, filtered on the server to the selected service. Clicking a student's name or row opens their current record and live profile contents.</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${isDark ? 'border-slate-800 bg-white/[0.02] text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}><Users className="w-4 h-4" />{students.length} students</div>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniMetric label="Students" value={students.length} icon={GraduationCap} theme={theme} />
        <MiniMetric label="Profiles complete" value={completeProfiles} icon={Users} theme={theme} />
        <MiniMetric label="RIASEC / assessment data" value={assessmentComplete} icon={BriefcaseBusiness} theme={theme} />
      </div>
      <UserDirectoryTable users={students} isLoading={loading} onViewDetails={openStudentDetails} userRole="student" theme={theme} />
      <SlideOutDetailPanel user={selectedStudent} isOpen={detailOpen} onClose={() => { setDetailOpen(false); window.setTimeout(() => setSelectedStudent(null), 300); }} />
    </div>
  );
}

function MiniMetric({ label, value, icon: Icon, theme }) {
  const dark = theme === 'dark';
  return <div className={`rounded-2xl border p-5 ${dark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}><div className="flex items-center justify-between"><span className={`text-sm font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span><Icon className="w-4 h-4 text-emerald-500" /></div><p className={`mt-2 text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(value || 0).toLocaleString()}</p></div>;
}
