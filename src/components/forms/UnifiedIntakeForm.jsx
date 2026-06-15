import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const UnifiedIntakeForm = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    grade: '',
    schoolName: '',
    parentName: '',
    parentContact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.grade || !formData.parentName) {
      setError('Please fill out all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found.");

      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        profileComplete: true,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      onComplete();
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white text-center">
          <h2 className="text-3xl font-extrabold mb-2">Welcome to Secret Sharz! 🎉</h2>
          <p className="text-indigo-100 font-medium">
            Let's get your profile set up so we can personalize your experience.
          </p>
        </div>
        
        <form onSubmit={handleSaveProfile} className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Student Full Name *</label>
              <input 
                type="text" name="name" 
                value={formData.name} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="e.g. Priya Sharma" required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Date of Birth</label>
              <input 
                type="date" name="dob" 
                value={formData.dob} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Current Grade / Class *</label>
              <input 
                type="text" name="grade" 
                value={formData.grade} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="e.g. Class 11" required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">School Name</label>
              <input 
                type="text" name="schoolName" 
                value={formData.schoolName} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="e.g. Delhi Public School"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Parent/Guardian Name *</label>
              <input 
                type="text" name="parentName" 
                value={formData.parentName} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="e.g. Ramesh Sharma" required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Parent Contact Number</label>
              <input 
                type="tel" name="parentContact" 
                value={formData.parentContact} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="+91"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all
                ${isSubmitting 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:-translate-y-0.5'
                }
              `}
            >
              {isSubmitting ? 'Saving Profile...' : 'Save & Continue 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnifiedIntakeForm;
