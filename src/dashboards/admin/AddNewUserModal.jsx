import React, { useState } from 'react';
import { X, UserPlus, Mail, User, GraduationCap, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const PATH_OPTIONS = [
  { value: 'wellbeing', label: 'Wellbeing', description: 'Mental health & counselling support', color: 'purple' },
  { value: 'sen', label: 'SEN', description: 'Special Educational Needs support', color: 'amber' },
  { value: 'career', label: 'Career', description: 'Career guidance & exploration', color: 'emerald' },
  { value: 'unassigned', label: 'Unassigned', description: 'No specific path yet', color: 'slate' },
];

const GRADE_OPTIONS = [
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12', 'College 1st Year', 'College 2nd Year',
  'College 3rd Year', 'College Final Year', 'Graduate'
];

const AddNewUserModal = ({ isOpen, onClose, onSuccess, userRole = 'student' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    grade: '',
    primary_path: 'unassigned',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Add document to Firestore users collection
      const docRef = await addDoc(collection(db, 'users'), {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        grade: formData.grade || null,
        primary_path: formData.primary_path,
        role: userRole,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Default values for new students
        profileComplete: false,
        counsellingConsentAgreed: false,
        studentTrack: 'unassigned',
        assignedCounsellorId: null,
        assignedCareerCoachId: null,
        parentId: null,
      });

      // Success callback
      onSuccess?.({
        id: docRef.id,
        ...formData,
        role: userRole,
        createdAt: new Date(),
      });

      // Reset form and close
      setFormData({
        name: '',
        email: '',
        grade: '',
        primary_path: 'unassigned',
      });
      onClose();
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        grade: '',
        primary_path: 'unassigned',
      });
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  const roleLabel = userRole === 'student' ? 'Student' : userRole === 'parent' ? 'Parent' : 'Professional';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto transform transition-all duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Add New {roleLabel}</h2>
                <p className="text-sm text-slate-500">Create a new {userRole} account</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-700 text-sm">
                <X className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Grade Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Grade / Class Level
              </label>
              <div className="relative">
                <GraduationCap className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                  disabled={isSubmitting}
                >
                  <option value="">Select grade (optional)</option>
                  {GRADE_OPTIONS.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                <svg className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Path Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Learning Path
              </label>
              <div className="grid grid-cols-2 gap-3">
                {PATH_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, primary_path: option.value }))}
                    disabled={isSubmitting}
                    className={`
                      p-3 rounded-xl border-2 text-left transition-all
                      ${formData.primary_path === option.value
                        ? option.color === 'purple' ? 'border-purple-500 bg-purple-50' :
                          option.color === 'amber' ? 'border-amber-500 bg-amber-50' :
                          option.color === 'emerald' ? 'border-emerald-500 bg-emerald-50' :
                          'border-slate-500 bg-slate-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                      }
                      ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <p className={`font-bold text-sm ${
                      formData.primary_path === option.value
                        ? option.color === 'purple' ? 'text-purple-700' :
                          option.color === 'amber' ? 'text-amber-700' :
                          option.color === 'emerald' ? 'text-emerald-700' :
                          'text-slate-700'
                        : 'text-slate-700'
                    }`}>
                      {option.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create {roleLabel}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewUserModal;
