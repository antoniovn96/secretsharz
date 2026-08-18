import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle, GraduationCap, Plus, Users, ClipboardCheck, UserCheck } from 'lucide-react';
import { auth } from '../../firebase';

import UserDirectoryTable from './UserDirectoryTable';
import SlideOutDetailPanel from './SlideOutDetailPanel';
import AddNewUserModal from './AddNewUserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const StudentDirectoryTab = ({ theme = 'light' }) => {
  const dark = theme === 'dark';
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  const loadStudents = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setLoadError('Authentication required to load the student directory.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setLoadError('');
    try {
      const idToken = await currentUser.getIdToken(true);
      let response = await fetch('/api/admin/students', { method: 'GET', headers: { Authorization: `Bearer ${idToken}` }, cache: 'no-store' });
      if (response.status === 401) {
        const refreshedToken = await currentUser.getIdToken(true);
        response = await fetch('/api/admin/students', { method: 'GET', headers: { Authorization: `Bearer ${refreshedToken}` }, cache: 'no-store' });
      }
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to load the student directory.');
      setStudents(Array.isArray(payload.students) ? payload.students : []);
    } catch (error) {
      console.error('[StudentDirectoryTab] failed to load students:', error);
      setLoadError(error?.message || 'Unable to load the student directory.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadStudents(); }, [loadStudents]);

  const metrics = useMemo(() => {
    const assessmentComplete = students.filter(student => {
      const code = student?.careerAssessment?.hollandCode?.length ? student.careerAssessment.hollandCode.join('') : student?.careerDNA?.riasec?.code || student?.riasecCode;
      return typeof code === 'string' && code.trim();
    }).length;
    const profileComplete = students.filter(student => student?.profileComplete === true || student?.onboardingCompleted === true).length;
    const assigned = students.filter(student => student?.path && student.path !== 'Unassigned').length;
    return { total: students.length, assessmentComplete, profileComplete, assigned, assessmentPending: students.length - assessmentComplete };
  }, [students]);

  const handleViewDetails = student => { setSelectedStudent(student); setIsDetailPanelOpen(true); };
  const handleDelete = student => setDeleteTarget(student);
  const showNotification = message => { setNotification(message); window.setTimeout(() => setNotification(null), 4000); };
  const handleDeleteSuccess = async deletedUser => { showNotification(`${deletedUser.name || 'Student'} has been deleted successfully.`); setDeleteTarget(null); await loadStudents(); };
  const handleCreateSuccess = async newUser => { showNotification(`${newUser.name} has been added successfully.`); await loadStudents(); };

  const panel = dark ? 'bg-[#151515] border-[#292929]' : 'bg-white border-slate-200';
  const heading = dark ? 'text-white' : 'text-slate-900';
  const muted = dark ? 'text-[#777]' : 'text-slate-500';

  return (
    <div className={`space-y-5 ${dark ? 'text-white' : 'text-slate-900'}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><GraduationCap className="w-5 h-5" /></div>
          <div><h2 className={`text-xl font-bold ${heading}`}>Student Master Control</h2><p className={`text-[11px] font-medium mt-1 ${muted}`}>Central directory for student accounts, pathways and readiness status.</p></div>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className={`self-start flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs transition-all ${dark ? 'bg-white text-black hover:bg-[#e5e5e5]' : 'bg-black text-white hover:bg-slate-800'}`}><Plus className="w-4 h-4" /> Add New Student</button>
      </div>

      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-fit ${dark ? 'bg-white/[0.04] border-[#292929] text-[#aaa]' : 'bg-slate-50 border-slate-200 text-slate-600'}`}><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-semibold">Live student records active</span></div>

      {loadError && <div className={`p-3 rounded-lg border text-xs font-medium ${dark ? 'border-red-900 bg-red-950/30 text-red-300' : 'border-red-200 bg-red-50 text-red-700'}`}>Unable to load the student directory: {loadError}</div>}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard icon={Users} label="Total Students" value={metrics.total} dark={dark} />
        <MetricCard icon={ClipboardCheck} label="RIASEC Complete" value={metrics.assessmentComplete} detail={`${metrics.assessmentPending} pending`} dark={dark} />
        <MetricCard icon={UserCheck} label="Profiles Complete" value={metrics.profileComplete} detail={`${Math.round((metrics.profileComplete / Math.max(metrics.total, 1)) * 100)}% completion`} dark={dark} />
        <MetricCard icon={GraduationCap} label="Assigned Path" value={metrics.assigned} detail={`${metrics.total - metrics.assigned} unassigned`} dark={dark} />
      </div>

      <div className={`${panel} border rounded-lg shadow-sm overflow-hidden`}>
        <UserDirectoryTable users={students} isLoading={isLoading} onViewDetails={handleViewDetails} onDelete={handleDelete} userRole="student" theme={theme} />
      </div>

      <SlideOutDetailPanel user={selectedStudent} isOpen={isDetailPanelOpen} onClose={() => { setIsDetailPanelOpen(false); window.setTimeout(() => setSelectedStudent(null), 300); }} />
      <AddNewUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleCreateSuccess} userRole="student" />
      <DeleteConfirmationModal user={deleteTarget} isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onSuccess={handleDeleteSuccess} />

      {notification && <div className="fixed bottom-6 right-6 z-50"><div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl text-xs font-bold ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><CheckCircle className="w-4 h-4" />{notification}</div></div>}
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, detail, dark }) => (
  <div className={`${dark ? 'bg-[#151515] border-[#292929]' : 'bg-white border-slate-200'} border rounded-lg shadow-sm p-4`}>
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Icon className="w-4 h-4" /></div>
    <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(value || 0).toLocaleString()}</p>
    <p className={`text-[11px] font-semibold mt-1 ${dark ? 'text-[#aaa]' : 'text-slate-600'}`}>{label}</p>
    {detail && <p className={`text-[9px] mt-1 ${dark ? 'text-[#666]' : 'text-slate-400'}`}>{detail}</p>}
  </div>
);

export default StudentDirectoryTab;
