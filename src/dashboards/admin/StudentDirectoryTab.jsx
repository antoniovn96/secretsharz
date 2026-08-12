import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, GraduationCap, Plus, Users, ClipboardCheck, UserCheck } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

import UserDirectoryTable from './UserDirectoryTable';
import SlideOutDetailPanel from './SlideOutDetailPanel';
import AddNewUserModal from './AddNewUserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const StudentDirectoryTab = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setLoadError('');

    // Keep the query simple and sort client-side. This avoids requiring a
    // composite Firestore index for role + createdAt while retaining live updates.
    const studentsQuery = query(collection(db, 'users'), where('role', '==', 'student'));

    const unsubscribe = onSnapshot(
      studentsQuery,
      { includeMetadataChanges: true },
      snapshot => {
        const studentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        studentList.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });
        setStudents(studentList);
        setIsLoading(false);
      },
      error => {
        console.error('Error fetching students:', error);
        setLoadError(error?.message || 'Unable to load the student directory.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const metrics = useMemo(() => {
    const assessmentComplete = students.filter(student => {
      const code = student?.careerDNA?.riasec?.code || student?.riasecCode;
      return typeof code === 'string' && code.trim();
    }).length;
    const profileComplete = students.filter(student => student?.profileComplete === true).length;
    const assigned = students.filter(student => {
      const path = student?.primary_path || student?.studentTrack;
      return path && path !== 'unassigned';
    }).length;
    return {
      total: students.length,
      assessmentComplete,
      profileComplete,
      assigned,
      assessmentPending: students.length - assessmentComplete,
    };
  }, [students]);

  const handleViewDetails = student => {
    setSelectedStudent(student);
    setIsDetailPanelOpen(true);
  };

  const handleDelete = student => setDeleteTarget(student);

  const handleDeleteSuccess = deletedUser => {
    showNotification(`${deletedUser.name || 'Student'} has been deleted successfully.`);
    setDeleteTarget(null);
  };

  const handleCreateSuccess = newUser => {
    showNotification(`${newUser.name} has been added successfully.`);
  };

  const showNotification = message => {
    setNotification(message);
    window.setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Student Master Control</h2>
              <p className="text-slate-500 font-medium mt-1">Central directory for student accounts, pathways and readiness status.</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="self-start flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
        >
          <Plus className="w-5 h-5" /> Add New Student
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 w-fit">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-sm font-medium text-emerald-700">Real-time student records active</span>
      </div>

      {loadError && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium">
          Unable to load the student directory: {loadError}
        </div>
      )}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Total Students" value={metrics.total} tone="blue" />
        <MetricCard icon={ClipboardCheck} label="RIASEC Complete" value={metrics.assessmentComplete} detail={`${metrics.assessmentPending} pending`} tone="emerald" />
        <MetricCard icon={UserCheck} label="Profiles Complete" value={metrics.profileComplete} detail={`${Math.round((metrics.profileComplete / Math.max(metrics.total, 1)) * 100)}% completion`} tone="violet" />
        <MetricCard icon={GraduationCap} label="Assigned Path" value={metrics.assigned} detail={`${metrics.total - metrics.assigned} unassigned`} tone="amber" />
      </div>

      <UserDirectoryTable
        users={students}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        userRole="student"
      />

      <SlideOutDetailPanel
        user={selectedStudent}
        isOpen={isDetailPanelOpen}
        onClose={() => {
          setIsDetailPanelOpen(false);
          window.setTimeout(() => setSelectedStudent(null), 300);
        }}
      />

      <AddNewUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleCreateSuccess}
        userRole="student"
      />

      <DeleteConfirmationModal
        user={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={handleDeleteSuccess}
      />

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-4 bg-emerald-600 text-white rounded-xl shadow-2xl">
            <CheckCircle className="w-5 h-5" />
            <p className="font-semibold">{notification}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

const TONES = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
};

const MetricCard = ({ icon: Icon, label, value, detail, tone }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
    <div className={`w-10 h-10 rounded-xl ${TONES[tone]} flex items-center justify-center mb-4`}><Icon className="w-5 h-5" /></div>
    <p className="text-2xl font-bold text-slate-900">{Number(value || 0).toLocaleString()}</p>
    <p className="text-sm font-semibold text-slate-600 mt-1">{label}</p>
    {detail && <p className="text-xs text-slate-400 mt-1">{detail}</p>}
  </div>
);

export default StudentDirectoryTab;
