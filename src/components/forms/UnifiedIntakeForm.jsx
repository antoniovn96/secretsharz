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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative overflow-y-auto max-h-[90vh]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Welcome to Secret Sharz! 🎉</h2>
          <p className="text-slate-500 font-medium">
            Let's get your profile set up so we can personalize your experience.
          </p>
        </div>
        
        <form onSubmit={handleSaveProfile}>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-semibold text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Student Full Name *</label>
              <input 
                type="text" name="name" 
                value={formData.name} onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g. Priya Sharma" required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input 
                type="date" name="dob" 
                value={formData.dob} onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Current Grade / Class *</label>
              <input 
                type="text" name="grade" 
                value={formData.grade} onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g. Class 11" required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">School Name</label>
              <input 
                type="text" name="schoolName" 
                value={formData.schoolName} onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g. Delhi Public School"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Parent/Guardian Name *</label>
              <input 
                type="text" name="parentName" 
                value={formData.parentName} onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="e.g. Ramesh Sharma" required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Parent Contact Number</label>
              <input 
                type="tel" name="parentContact" 
                value={formData.parentContact} onChange={handleChange}
                className="w-full mt-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="+91"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 ${isSubmitting ? 'opacity-70 cursor-not-allowed transform-none hover:-translate-y-0' : ''}`}
          >
            {isSubmitting ? 'Saving Profile...' : 'Save & Continue 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UnifiedIntakeForm;
