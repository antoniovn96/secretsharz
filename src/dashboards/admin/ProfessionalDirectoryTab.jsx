import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import ProfessionalDirectoryTable from './ProfessionalDirectoryTable';
import ProfessionalDetailPanel from './ProfessionalDetailPanel';
import AddProfessionalModal from './AddProfessionalModal';
import EditProfessionalModal from './EditProfessionalModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ProfessionalInstitutionAssignment from './ProfessionalInstitutionAssignment';

const PROFESSIONAL_ROLES = ['counsellor', 'career_counsellor', 'psychologist', 'educator'];

const ProfessionalDirectoryTab = ({ theme = 'light' }) => {
  const [professionals, setProfessionals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isDetailPanelOpen, setIsDetailPanelOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [assignmentTarget, setAssignmentTarget] = useState(null);
  const [notification, setNotification] = useState(null);
  const dark = theme === 'dark';

  useEffect(() => {
    setIsLoading(true);
    const usersRef = collection(db, 'users');
    const professionalsQuery = query(usersRef, where('role', 'in', PROFESSIONAL_ROLES), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(professionalsQuery, { includeMetadataChanges: true }, snapshot => { setProfessionals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); setIsLoading(false); }, error => { console.error('Error fetching professionals:', error); setIsLoading(false); });
    return () => unsubscribe();
  }, []);

  const showNotification = message => { setNotification(message); setTimeout(() => setNotification(null), 4000); };
  const handleViewDetails = professional => { setSelectedProfessional(professional); setIsDetailPanelOpen(true); };
  const openEdit = professional => { setEditingProfessional(professional); setIsEditModalOpen(true); };
  const handleEditSuccess = updatedProfessional => { setProfessionals(current => current.map(item => item.id === updatedProfessional.id ? { ...item, ...updatedProfessional } : item)); setSelectedProfessional(updatedProfessional); showNotification(`${updatedProfessional.name} has been updated successfully.`); };
  const handleDelete = professional => setDeleteTarget(professional);
  const handleDeleteSuccess = deletedUser => { if (selectedProfessional?.id === deletedUser.id) { setIsDetailPanelOpen(false); setSelectedProfessional(null); } showNotification(`${deletedUser.name || 'Professional'} has been deleted successfully.`); setDeleteTarget(null); };
  const handleCreateSuccess = newUser => showNotification(`${newUser.name} has been added to the professional directory.`);
  const handleAssignmentSaved = updated => { setProfessionals(current => current.map(item => item.id === updated.id ? { ...item, ...updated } : item)); setSelectedProfessional(current => current?.id === updated.id ? { ...current, ...updated } : current); showNotification(`${updated.name || 'Professional'} institution assignments updated.`); };

  return <div className="space-y-6">
    <div className="flex items-center justify-between gap-4"><div><h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Professional Directory</h2><p className={`font-medium mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Manage {professionals.length} counsellors, psychologists, educators &amp; career counsellors</p></div><button onClick={() => setIsAddModalOpen(true)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors ${dark ? 'bg-white text-black hover:bg-slate-200' : 'bg-black text-white hover:bg-slate-800'}`}><Plus className="w-4 h-4" /> Add Professional</button></div>
    <div className="flex flex-wrap items-center gap-2"><span className={`text-xs font-semibold mr-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>ROLE TYPES</span>{['Counsellors', 'Career Counsellors', 'Psychologists', 'SEN Teachers'].map(label => <span key={label} className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${dark ? 'bg-[#151515] border-[#2b2b2b] text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}>{label}</span>)}</div>
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-fit ${dark ? 'bg-[#151515] border-[#2b2b2b]' : 'bg-white border-slate-200'}`}><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><span className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Real-time updates active</span></div>
    <ProfessionalDirectoryTable users={professionals} isLoading={isLoading} onViewDetails={handleViewDetails} onEdit={openEdit} onDelete={handleDelete} onAssignInstitutions={setAssignmentTarget} theme={theme} />
    <ProfessionalDetailPanel professional={selectedProfessional} isOpen={isDetailPanelOpen} onClose={() => { setIsDetailPanelOpen(false); setSelectedProfessional(null); }} onEdit={professional => { setIsDetailPanelOpen(false); openEdit(professional); }} />
    <AddProfessionalModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleCreateSuccess} />
    <EditProfessionalModal professional={editingProfessional} isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingProfessional(null); }} onSuccess={handleEditSuccess} theme={theme} />
    <DeleteConfirmationModal user={deleteTarget} isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onSuccess={handleDeleteSuccess} />
    <ProfessionalInstitutionAssignment professional={assignmentTarget} theme={theme} isOpen={!!assignmentTarget} onClose={() => setAssignmentTarget(null)} onSaved={handleAssignmentSaved} />
    {notification && <div className="fixed bottom-6 right-6 z-[70]"><div className={`flex items-center gap-3 px-5 py-4 rounded-lg shadow-2xl ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><CheckCircle className="w-5 h-5" /><p className="font-semibold">{notification}</p></div></div>}
  </div>;
};
export default ProfessionalDirectoryTab;
