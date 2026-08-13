import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';

const DeleteConfirmationModal = ({ user, isOpen, onClose, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  if (!isOpen || !user) return null;

  const userName = user.name || 'this user';
  const isConfirmed = confirmName.toLowerCase() === userName.toLowerCase();

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', user.id));
      onSuccess?.(user);
      setConfirmName('');
      onClose();
    } catch (error) {
      console.error('Error deleting directory record:', error);
      alert('Failed to delete the directory record. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmName('');
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-red-900/40 backdrop-blur-sm z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto" onClick={e => e.stopPropagation()}>
          <div className="h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-t-2xl" />
          <div className="p-6 text-center">
            <div className="mx-auto mb-4 w-14 h-14 bg-red-100 rounded-full flex items-center justify-center"><AlertTriangle className="w-7 h-7 text-red-600" /></div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Professional Record?</h2>
            <p className="text-slate-600 mb-4">This permanently removes <span className="font-semibold text-slate-900">{userName}</span> from the professional directory. It does not delete a Firebase Authentication account or unrelated linked records.</p>

            <div className="p-4 bg-slate-50 rounded-xl mb-5 text-left">
              <p className="font-semibold text-slate-900">{userName}</p>
              <p className="text-sm text-slate-500">{user.email || 'No email'}</p>
            </div>

            <div className="mb-5 text-left">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Type <span className="font-bold text-red-600">{userName}</span> to confirm:</label>
              <input type="text" value={confirmName} onChange={e => setConfirmName(e.target.value)} placeholder="Enter name to confirm" className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" disabled={isDeleting} />
            </div>

            <div className="text-left p-4 bg-red-50 rounded-xl mb-6 border border-red-100">
              <p className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2"><Trash2 className="w-4 h-4" /> This will delete the Firestore directory record:</p>
              <ul className="text-sm text-red-700 space-y-1 ml-6 list-disc"><li>Professional profile information</li><li>Directory status and registration details</li></ul>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={handleClose} disabled={isDeleting} className="flex-1 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={handleDelete} disabled={!isConfirmed || isDeleting} className="flex-1 px-5 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">{isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : <><Trash2 className="w-4 h-4" /> Delete Record</>}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
