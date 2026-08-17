import React, { useState, useEffect, useMemo } from 'react';
import { Users, Plus, CheckCircle } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

import ParentDirectoryTable from './ParentDirectoryTable';
import ParentDetailPanel from './ParentDetailPanel';
import AddNewUserModal from './AddNewUserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const ParentDirectoryTab = () => {
  const [parents, setParents] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParent, setSelectedParent] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const usersRef = collection(db, 'users');
    const parentsQuery = query(usersRef, where('role', '==', 'parent'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(parentsQuery, { includeMetadataChanges: true }, snapshot => {
      setParents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, error => {
      console.error('Error fetching parents:', error);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const studentsQuery = query(collection(db, 'users'), where('role', '==', 'student'));
    const unsubscribe = onSnapshot(studentsQuery, { includeMetadataChanges: true }, snapshot => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, error => console.error('Error fetching linked students:', error));
    return () => unsubscribe();
  }, []);

  const parentRows = useMemo(() => {
    const childrenByParent = new Map();
    students.forEach(student => {
      if (!student.parentId) return;
      const current = childrenByParent.get(student.parentId) || [];
      current.push(student);
      childrenByParent.set(student.parentId, current);
    });
    return parents.map(parent => ({
      ...parent,
      children: childrenByParent.get(parent.id) || [],
      childrenCount: (childrenByParent.get(parent.id) || []).length,
    }));
  }, [parents, students]);

  const handleViewDetails = parent => {
    setSelectedParent(parent);
    setIsDetailPanelOpen(true);
  };

  const handleDelete = parent => setDeleteTarget(parent);

  const handleDeleteSuccess = deletedUser => {
    showNotification(`${deletedUser.name || 'Parent'} has been deleted successfully.`);
    setDeleteTarget(null);
  };

  const handleCreateSuccess = newUser => showNotification(`${newUser.name} has been added successfully!`);

  const showNotification = message => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div><h2 className="text-2xl font-bold text-slate-900">Parent Directory</h2><p className="text-slate-500 font-medium mt-1">Manage {parentRows.length} parent accounts and family linkages</p></div>
      <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 transition-all"><Plus className="w-5 h-5" /> Add Parent</button>
    </div>
    <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-xl border border-rose-100 w-fit"><div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"/><span className="text-sm font-medium text-rose-700">Real-time updates active</span></div>
    <ParentDirectoryTable users={parentRows} isLoading={isLoading} onViewDetails={handleViewDetails} onDelete={handleDelete} />
    <ParentDetailPanel parent={selectedParent} isOpen={isDetailPanelOpen} onClose={() => { setIsDetailPanelOpen(false); setTimeout(() => setSelectedParent(null), 300); }} />
    <AddNewUserModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleCreateSuccess} userRole="parent" />
    <DeleteConfirmationModal user={deleteTarget} isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onSuccess={handleDeleteSuccess} />
    {notification && <div className="fixed bottom-6 right-6 z-50 animate-slide-up"><div className="flex items-center gap-3 px-5 py-4 bg-rose-600 text-white rounded-xl shadow-2xl"><CheckCircle className="w-5 h-5"/><p className="font-semibold">{notification}</p></div></div>}
    <style jsx>{`@keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } .animate-slide-up { animation: slide-up 0.3s ease-out; }`}</style>
  </div>;
};

export default ParentDirectoryTab;
