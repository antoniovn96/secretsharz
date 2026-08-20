import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, GraduationCap, HeartHandshake, Brain, Users } from 'lucide-react';
import { auth } from '../../firebase';
import CanonicalStudentDirectoryTable from './CanonicalStudentDirectoryTable';
import SlideOutDetailPanel from './SlideOutDetailPanel';
import AdminStudentEditModal from './AdminStudentEditModal';
import AdminStudentArchiveModal from './AdminStudentArchiveModal';

const SERVICE_META = {
  career: { label: 'Career Guidance', path: 'career', icon: BriefcaseBusiness, tone: 'emerald' },
  wellbeing: { label: 'Counselling & Wellbeing', path: 'wellbeing', icon: HeartHandshake, tone: 'violet' },
  sen: { label: 'SEN / Learning Support', path: 'sen', icon: Brain, tone: 'amber' },
};

export default function ServiceStudentDirectory({ service = 'career', theme = 'light' }) {
  const meta = SERVICE_META[service] || SERVICE_META.career;
  const [students, setStudents] = useState([]);
  const [directoryFilters, setDirectoryFilters] = useState({ institutions: [], grades: [], counsellors: [], academicYears: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);

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
      setStudents(Array.isArray(payload.students) ? payload.students : []);
      setDirectoryFilters(payload.filters || { institutions: [], grades: [], counsellors: [], academicYears: [] });
    } catch (err) {
      console.error('[ServiceStudentDirectory] failed:', err);
      setError(err?.message || 'Unable to load students.');
    } finally { setLoading(false); }
  }, [meta.path]);

  useEffect(() => { load(); }, [load]);

  const openDetails = async student => {
    setSelectedStudent(student); setDetailOpen(true); setDetailLoading(true); setDetailError('');
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Authentication required.');
      let token = await currentUser.getIdToken(true);
      let response = await fetch(`/api/admin/student-detail?service=${encodeURIComponent(meta.path)}&studentId=${encodeURIComponent(student.id)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      if (response.status === 401) {
        token = await currentUser.getIdToken(true);
        response = await fetch(`/api/admin/student-detail?service=${encodeURIComponent(meta.path)}&studentId=${encodeURIComponent(student.id)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
      }
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to load the authorized student record.');
      setSelectedStudent(payload.profile || student);
    } catch (err) {
      console.error('[ServiceStudentDirectory] detail load failed:', err);
      setDetailError(err?.message || 'Unable to load the authorized student record.');
    } finally { setDetailLoading(false); }
  };

  const completeProfiles = students.filter(student => student.profileStatus === 'complete').length;
  const assessmentComplete = students.filter(student => student.assessmentStatus === 'complete').length;
  const assessmentPending = students.length - assessmentComplete;
  const assigned = students.filter(student => student.assignmentStatus === 'assigned').length;
  const needsAttention = students.filter(student => student.needsAttention).length;
  const isDark = theme === 'dark';
  const Icon = meta.icon;

  const stats = useMemo(() => ({ total: students.length, completeProfiles, assessmentComplete, assessmentPending, assigned, needsAttention }), [students.length, completeProfiles, assessmentComplete, assessmentPending, assigned, needsAttention]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${meta.tone === 'violet' ? 'bg-violet-500/10 text-violet-500' : meta.tone === 'amber' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}><Icon className="w-5 h-5" /></div>
            <div><p className={`text-[10px] uppercase tracking-[0.16em] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{meta.label} · Students</p><h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>Student Directory</h1></div>
          </div>
          <p className={`mt-3 text-sm max-w-3xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manage students enrolled in {meta.label}. Directory state is derived from the canonical student projection; Firebase UIDs remain internal.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${isDark ? 'border-slate-800 bg-white/[0.02] text-slate-400' : 'border-slate-200 bg-white text-slate-500'}`}><Users className="w-4 h-4" />{stats.total} students</div>
        </div>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">{error}</div>}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        <MiniMetric label="Total students" value={stats.total} icon={GraduationCap} theme={theme} />
        <MiniMetric label="Profiles complete" value={stats.completeProfiles} icon={Users} theme={theme} />
        <MiniMetric label="Assessment complete" value={stats.assessmentComplete} icon={BriefcaseBusiness} theme={theme} />
        <MiniMetric label="Assigned" value={stats.assigned} icon={Users} theme={theme} />
        <MiniMetric label="Needs attention" value={stats.needsAttention} icon={Users} theme={theme} />
      </div>
      <CanonicalStudentDirectoryTable
        users={students}
        isLoading={loading}
        filterOptions={directoryFilters}
        onViewDetails={openDetails}
        onEdit={student => { setSelectedStudent(student); setEditOpen(true); }}
        onDelete={student => { setSelectedStudent(student); setArchiveOpen(true); }}
        userRole="student"
        theme={theme}
      />
      <SlideOutDetailPanel
        user={selectedStudent}
        isOpen={detailOpen}
        isLoading={detailLoading}
        error={detailError}
        onEdit={() => { setDetailOpen(false); setEditOpen(true); }}
        onArchive={() => { setDetailOpen(false); setArchiveOpen(true); }}
        onClose={() => { setDetailOpen(false); window.setTimeout(() => { setSelectedStudent(null); setDetailError(''); }, 300); }}
      />
      <AdminStudentEditModal student={selectedStudent} isOpen={editOpen} theme={theme} onClose={() => setEditOpen(false)} onSaved={() => { setEditOpen(false); load(); }} />
      <AdminStudentArchiveModal student={selectedStudent} isOpen={archiveOpen} theme={theme} onClose={() => setArchiveOpen(false)} onArchived={() => { setArchiveOpen(false); setSelectedStudent(null); load(); }} />
    </div>
  );
}

function MiniMetric({ label, value, icon: Icon, theme }) {
  const dark = theme === 'dark';
  return <div className={`rounded-2xl border p-5 ${dark ? 'bg-[#111827] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}><div className="flex items-center justify-between"><span className={`text-sm font-semibold ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span><Icon className="w-4 h-4 text-emerald-500" /></div><p className={`mt-2 text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(value || 0).toLocaleString()}</p></div>;
}
