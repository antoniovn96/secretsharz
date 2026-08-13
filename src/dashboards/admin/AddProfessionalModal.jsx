import React, { useState } from 'react';
import { X, UserPlus, Mail, User, Phone, Briefcase, GraduationCap, Building2, Award, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const ROLE_OPTIONS = [
  { value: 'counsellor', label: 'Counsellor', description: 'Counselling & wellbeing support' },
  { value: 'career_counsellor', label: 'Career Counsellor', description: 'Career guidance & exploration' },
  { value: 'psychologist', label: 'Psychologist', description: 'Psychological assessment & support' },
  { value: 'educator', label: 'Educator', description: 'Special educational needs support' },
];

const AddProfessionalModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'counsellor',
    specialization: '',
    qualification: '',
    institutionName: '',
    registrationNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'counsellor',
      specialization: '',
      qualification: '',
      institutionName: '',
      registrationNumber: '',
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return setError('Full name is required');
    if (!formData.email.trim()) return setError('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return setError('Please enter a valid email address');
    }
    if (!formData.role) return setError('Professional role is required');

    setIsSubmitting(true);
    setError('');

    try {
      const professionalData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        role: formData.role,
        professionalRole: formData.role,
        specialization: formData.specialization.trim() || null,
        qualification: formData.qualification.trim() || null,
        institutionName: formData.institutionName.trim() || null,
        registrationNumber: formData.registrationNumber.trim() || null,
        status: 'active',
        profileComplete: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'users'), professionalData);

      onSuccess?.({ id: docRef.id, ...professionalData, createdAt: new Date() });
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error creating professional:', err);
      setError('Failed to create professional. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={handleClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Add New Professional</h2>
                <p className="text-sm text-slate-500">Create a professional directory record</p>
              </div>
            </div>
            <button onClick={handleClose} disabled={isSubmitting} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Full Name" required icon={User}>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" disabled={isSubmitting} className={inputClass} />
              </Field>

              <Field label="Email Address" required icon={Mail}>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" disabled={isSubmitting} className={inputClass} />
              </Field>

              <Field label="Phone Number" icon={Phone}>
                <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Optional" disabled={isSubmitting} className={inputClass} />
              </Field>

              <Field label="Professional Role" required icon={Briefcase}>
                <select name="role" value={formData.role} onChange={handleChange} disabled={isSubmitting} className={inputClass}>
                  {ROLE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </Field>

              <Field label="Specialisation / Area of Practice" icon={Award}>
                <input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Child & adolescent counselling" disabled={isSubmitting} className={inputClass} />
              </Field>

              <Field label="Qualification" icon={GraduationCap}>
                <input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. M.A. Psychology" disabled={isSubmitting} className={inputClass} />
              </Field>

              <Field label="Institution / Organisation" icon={Building2}>
                <input name="institutionName" value={formData.institutionName} onChange={handleChange} placeholder="Optional" disabled={isSubmitting} className={inputClass} />
              </Field>

              <Field label="Professional Registration / License No." icon={Award}>
                <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="Optional" disabled={isSubmitting} className={inputClass} />
              </Field>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
              <p className="text-sm font-semibold text-purple-800">Selected role</p>
              <p className="text-sm text-purple-700 mt-1">{ROLE_OPTIONS.find(option => option.value === formData.role)?.description}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={handleClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><UserPlus className="w-4 h-4" /> Create Professional</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const inputClass = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50';

const Field = ({ label, required, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="block text-sm font-semibold text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>
    <div className="relative">
      <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      {React.cloneElement(children, { className: `${children.props.className} pl-10` })}
    </div>
  </div>
);

export default AddProfessionalModal;
