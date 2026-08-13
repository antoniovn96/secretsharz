import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

import ProfessionalDirectoryTable from './ProfessionalDirectoryTable';
import SlideOutDetailPanel from './SlideOutDetailPanel';
import AddProfessionalModal from './AddProfessionalModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const PROFESSIONAL_ROLES = ['counsellor', 'career_counsellor', 'psychologist', 'educator'];

const ProfessionalDirectoryTab = () => {
  const [professionals, setProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const usersRef = collection(db, 'users');
    const professionalsQuery = query(
      usersRef,
      where('role', 'in', PROFESSIONAL_ROLES),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      professionalsQuery,
      { includeMetadataChanges: true },
      snapshot => {
        const professionalList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProfessionals(professionalList);
        setIsLoading(false);
      },
      error => {
        console.error('Error fetching professionals:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleViewDetails = professional => {
    setSelectedProfessional(professional);
    setIsDetailPanelOpen(true);
  };

  const handleDelete = professional => setDeleteTarget(professional);

  const handleDeleteSuccess = deletedUser => {
    showNotification(`${deletedUser.name || 'Professional'} has been deleted successfully.`);
    setDeleteTarget(null);
  };

  const handleCreateSuccess = newUser => {
    showNotification(`${newUser.name} has been added to the professional directory.`);
  };

  const showNotification = message => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Professional Directory</h2>
          <p className="text-slate-500 font-medium mt-1">
            Manage {professionals.length} counsellors, psychologists, educators &amp; career counsellors
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Professional
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-500">Role Types:</span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">Counsellors</span>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold">Career Counsellors</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">Psychologists</span>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">Educators</span>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-xl border border-purple-100 w-fit">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        <span className="text-sm font-medium text-purple-700">Real-time updates active</span>
      </div>

      <ProfessionalDirectoryTable
        users={professionals}
        isLoading={isLoading}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
      />

      <SlideOutDetailPanel
        user={selectedProfessional}
        isOpen={isDetailPanelOpen}
        onClose={() => {
          setIsDetailPanelOpen(false);
          setTimeout(() => setSelectedProfessional(null), 300);
        }}
      />

      <AddProfessionalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <DeleteConfirmationModal
        user={deleteTarget}
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={handleDeleteSuccess}
      />

      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-5 py-4 bg-purple-600 text-white rounded-xl shadow-2xl">
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

export default ProfessionalDirectoryTab;
