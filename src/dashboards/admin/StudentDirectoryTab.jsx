import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle, GraduationCap, Plus, Users, ClipboardCheck, UserCheck, RefreshCw } from 'lucide-react';
import { auth } from '../../firebase';
import UserDirectoryTable from './UserDirectoryTable';
import SlideOutDetailPanel from './SlideOutDetailPanel';
import AddNewUserModal from './AddNewUserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const text = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(', ');
  if (typeof value === 'object') return text(value.international || value.number || value.display || value.label || value.name || value.code || value.cityName || value.countryName || '');
  return '';
};
const assessmentComplete = student => Boolean(text(student?.careerDNA?.riasec?.code || student?.riasecCode || student?.careerAssessment?.hollandCode).trim() || student?.assessmentCompletedAt || student?.careerAssessment?.completedAt);
const profileComplete = student => student?.profileComplete === true || student?.onboardingCompleted === true;
const assignedPath = student => ['wellbeing', 'sen', 'career'].includes(text(student?.primary_path || student?.path || student?.studentTrack).toLowerCase());

const StudentDirectoryTab = ({ theme = 'light' }) => {
  const dark = theme === 'dark';
  const [students, setStudents] = useState([]); const [isLoading, setIsLoading] = useState(true); const [isRefreshing, setIsRefreshing] = useState(false); const [loadError, setLoadError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null); const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false); const [isDetailLoading, setIsDetailLoading] = useState(false); const [detailError, setDetailError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); const [deleteTarget, setDeleteTarget] = useState(null); const [notification, setNotification] = useState(null);
  const loadStudents = useCallback(async (background = false) => {
    const currentUser = auth.currentUser;
    if (!currentUser) { setLoadError('Authentication required to load the student directory.'); setIsLoading(false); return; }
    if (background) setIsRefreshing(true); else setIsLoading(true); setLoadError('');
    try { const token = await currentUser.getIdToken(true); const response = await fetch('/api/admin/students', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }); const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload?.error || 'Unable to load the student directory.'); setStudents(Array.isArray(payload.students) ? payload.students : []); }
    catch (error) { console.error('[StudentDirectoryTab] load failed:', error); setLoadError(error?.message || 'Unable to load the student directory.'); }
    finally { setIsLoading(false); setIsRefreshing(false); }
  }, []);
  useEffect(() => { loadStudents(); }, [loadStudents]);
  const metrics = useMemo(() => { const completedAssessmentCount = students.filter(assessmentComplete).length; const completedProfileCount = students.filter(profileComplete).length; const assigned = students.filter(assignedPath).length; return { total: students.length, assessmentComplete: completedAssessmentCount, profileComplete: completedProfileCount, assigned, assessmentPending: Math.max(0, students.length - completedAssessmentCount) }; }, [students]);
  const handleViewDetails = async student => {
    setSelectedStudent(student); setIsDetailPanelOpen(true); setIsDetailLoading(true); setDetailError('');
    try { const studentId = String(student?.id || '').trim(); if (!studentId) throw new Error('This student record has no valid student ID.'); const currentUser = auth.currentUser; if (!currentUser) throw new Error('Authentication required to load student details.'); const token = await currentUser.getIdToken(true); const response = await fetch(`/api/admin/student-detail?studentId=${encodeURIComponent(studentId)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }); const payload = await response.json().catch(() => ({})); if (!response.ok) throw new Error(payload?.error || 'Unable to load the authorized student profile.'); setSelectedStudent(payload?.profile || student); }
    catch (error) { console.error('[StudentDirectoryTab] detail failed:', error); setDetailError(error?.message || 'Unable to load the authorized student profile.'); }
    finally { setIsDetailLoading(false); }
  };
  const showNotification = message => { setNotification(message); window.setTimeout(() => setNotification(null), 4000); };
  const handleDeleteSuccess = async deletedUser => { showNotification(`${text(deletedUser?.name) || 'Student'} has been deleted successfully.`); setDeleteTarget(null); await loadStudents(true); };
  const handleCreateSuccess = async newUser => { if (!newUser?.activationLink) setIsAddModalOpen(false); showNotification(`${text(newUser?.name) || 'Student'} has been added successfully.`); await loadStudents(true); };
  const panel = dark ? 'bg-[#151515] border-[#292929]' : 'bg-white border-slate-200'; const heading = dark ? 'text-white' : 'text-slate-900'; const muted = dark ? 'text-[#777]' : 'text-slate-500';
  return <div className={`space-y-5 ${dark ? 'text-white' : 'text-slate-900'}`}>
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><GraduationCap className="w-5 h-5" /></div><div><h2 className={`text-xl font-bold ${heading}`}>Student Master Control</h2><p className={`text-[11px] font-medium mt-1 ${muted}`}>Central directory for student accounts, pathways and readiness status.</p></div></div><div className="flex items-center gap-2"><button onClick={() => loadStudents(true)} disabled={isRefreshing} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-bold ${dark ? 'border-[#303030] bg-[#111] text-white' : 'border-slate-200 bg-white text-slate-700'}`}><RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> Refresh</button><button onClick={() => setIsAddModalOpen(true)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Plus className="w-4 h-4" /> Add New Student</button></div></div>
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-fit ${dark ? 'bg-white/[0.04] border-[#292929] text-[#aaa]' : 'bg-slate-50 border-slate-200 text-slate-600'}`}><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /><span className="text-[10px] font-semibold">Live student records active</span></div>
    {loadError && <div className={`p-3 rounded-lg border text-xs font-medium ${dark ? 'border-red-900 bg-red-950/30 text-red-300' : 'border-red-200 bg-red-50 text-red-700'}`}>Unable to load the student directory: {loadError}</div>}
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3"><MetricCard icon={Users} label="Total Students" value={metrics.total} dark={dark} /><MetricCard icon={ClipboardCheck} label="RIASEC Complete" value={metrics.assessmentComplete} detail={`${metrics.assessmentPending} pending`} dark={dark} /><MetricCard icon={UserCheck} label="Profiles Complete" value={metrics.profileComplete} detail={`${Math.round((metrics.profileComplete / Math.max(metrics.total, 1)) * 100)}% completion`} dark={dark} /><MetricCard icon={GraduationCap} label="Assigned Path" value={metrics.assigned} detail={`${metrics.total - metrics.assigned} unassigned`} dark={dark} /></div>
    <div className={`${panel} border rounded-lg shadow-sm overflow-hidden`}><UserDirectoryTable users={students} isLoading={isLoading} onViewDetails={handleViewDetails} onEdit={handleViewDetails} onDelete={setDeleteTarget} userRole="student" theme={theme} /></div>
    <SlideOutDetailPanel user={selectedStudent} isOpen={isDetailPanelOpen} isLoading={isDetailLoading} error={detailError} onClose={() => { setIsDetailPanelOpen(false); window.setTimeout(() => { setSelectedStudent(null); setDetailError(''); }, 300); }} />
    <AddNewUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleCreateSuccess} userRole="student" />
    <DeleteConfirmationModal user={deleteTarget} isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onSuccess={handleDeleteSuccess} userRole="student" />
    {notification && <div className="fixed bottom-6 right-6 z-50"><div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl text-xs font-bold ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><CheckCircle className="w-4 h-4" />{notification}</div></div>}
  </div>;
};
const MetricCard = ({ icon: Icon, label, value, detail, dark }) => <div className={`${dark ? 'bg-[#151515] border-[#292929]' : 'bg-white border-slate-200'} border rounded-lg shadow-sm p-4`}><div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><Icon className="w-4 h-4" /></div><p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{Number(value || 0).toLocaleString()}</p><p className={`text-[11px] font-semibold mt-1 ${dark ? 'text-[#aaa]' : 'text-slate-600'}`}>{label}</p>{detail && <p className={`text-[9px] mt-1 ${dark ? 'text-[#666]' : 'text-slate-400'}`}>{detail}</p>}</div>;
export default StudentDirectoryTab;
