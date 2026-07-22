import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, CheckCircle } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

import UserDirectoryTable from './UserDirectoryTable';
import SlideOutDetailPanel from './SlideOutDetailPanel';
import AddNewUserModal from './AddNewUserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const StudentDirectoryTab = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  // Real-time Firestore listener for students
  useEffect(() => {
    setIsLoading(true);
    
    // Query: users collection where role == 'student'
    const usersRef = collection(db, 'users');
    const studentsQuery = query(
      usersRef,
      where('role', '==', 'student'),
      orderBy('createdAt', 'desc')
    );

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      studentsQuery,
      { includeMetadataChanges: true },
      (snapshot) => {
        const studentList = [];
        snapshot.forEach((doc) => {
          studentList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setStudents(studentList);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching students:', error);
        setIsLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Handle viewing student details
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsDetailPanelOpen(true);
  };

  // Handle delete action
  const handleDelete = (student) => {
    setDeleteTarget(student);
  };

  // Handle successful deletion
  const handleDeleteSuccess = (deletedUser) => {
    showNotification(`${deletedUser.name || 'User'} has been deleted successfully.`);
    setDeleteTarget(null);
  };

  // Handle successful user creation
  const handleCreateSuccess = (newUser) => {
    showNotification(`${newUser.name} has been added successfully!`);
  };

  // Show notification toast
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Student Directory</h2>
          <p className="text-slate-500 font-medium mt-1">
            Manage all {students.length} student accounts and profiles
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Student
        </button>
      </div>

      {/* Live Status Banner */}
      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 w-fit">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        <span className="text-sm font-medium text-emerald-700">Real-time updates active</span>
      </div>

      {/* Data Table */}
      <UserDirectoryTable
        users={students}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        userRole="student"
      />

      {/* Slide-Out Detail Panel */}
      <SlideOutDetailPanel
        user={selectedStudent}
        isOpen={isDetailPanelOpen}
        onClose={() => {
          setIsDetailPanelOpen(false);
          setTimeout(() => setSelectedStudent(null), 300);
        }}
      />

      {/* Add New Student Modal */}
      <AddNewUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleCreateSuccess}
        userRole="student"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        user={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={handleDeleteSuccess}
      />

      {/* Success Notification Toast */}
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
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentDirectoryTab;
