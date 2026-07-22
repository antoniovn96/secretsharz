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
      // Delete from Firestore
      await deleteDoc(doc(db, 'users', user.id));
      
      // Success callback
      onSuccess?.(user);
      
      // Close modal
      setConfirmName('');
      onClose();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
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
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-red-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Warning Header */}
          <div className="relative">
            <div className="h-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-t-2xl" />
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-8 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Delete User Permanently?
            </h2>
            <p className="text-slate-600 mb-4">
              This action cannot be undone. All data associated with{' '}
              <span className="font-semibold text-slate-900">{userName}</span>{' '}
              will be permanently removed.
            </p>

            {/* User Info */}
            <div className="p-4 bg-slate-50 rounded-xl mb-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white font-bold text-sm">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">{userName}</p>
                  <p className="text-sm text-slate-500">{user.email || 'No email'}</p>
                </div>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Type <span className="font-bold text-red-600">{userName}</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder="Enter name to confirm"
                className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                disabled={isDeleting}
              />
            </div>

            {/* Warning List */}
            <div className="text-left p-4 bg-red-50 rounded-xl mb-6 border border-red-100">
              <p className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                This will delete:
              </p>
              <ul className="text-sm text-red-700 space-y-1 ml-6 list-disc">
                <li>User profile and account</li>
                <li>All assessment results and scores</li>
                <li>Session history and notes</li>
                <li>All linked data records</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleClose}
                disabled={isDeleting}
                className="flex-1 px-5 py-3 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!isConfirmed || isDeleting}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmationModal;
