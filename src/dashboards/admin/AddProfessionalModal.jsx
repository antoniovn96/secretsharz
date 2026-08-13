import React, { useState } from 'react';
import { X, UserPlus, Mail, User, Phone, Briefcase, GraduationCap, Building2, Award, Loader2, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { auth } from '../../firebase';

const ROLE_OPTIONS = [
  { value: 'counsellor', label: 'Counsellor', description: 'Counselling & wellbeing support' },
  { value: 'career_counsellor', label: 'Career Counsellor', description: 'Career guidance & exploration' },
  { value: 'psychologist', label: 'Psychologist', description: 'Psychological assessment & support' },
  { value: 'educator', label: 'Educator', description: 'Special educational needs support' },
];

const EMPTY_FORM = {
  name: '', email: '', phone: '', role: 'counsellor', specialization: '',
  qualification: '', institutionName: '', registrationNumber: '',
};

const AddProfessionalModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdAccount, setCreatedAccount] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setError('');
    setCreatedAccount(null);
    setCopied(false);
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
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Authentication required. Please sign in again.');

      const idToken = await currentUser.getIdToken(true);
      const response = await fetch('/api/admin/create-professional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || null,
          role: formData.role,
          specialization: formData.specialization.trim() || null,
          qualification: formData.qualification.trim() || null,
          institutionName: formData.institutionName.trim() || null,
          registrationNumber: formData.registrationNumber.trim() || null,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Failed to create professional account.');

      const result = {
        uid: payload.uid,
        inviteLink: payload.inviteLink,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: formData.role,
      };

      setCreatedAccount(result);
      onSuccess?.(result);
    } catch (err) {
      console.error('Error creating professional account:', err);
      setError(err?.message || 'Failed to create professional account. Please try again.');
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

  const copyInviteLink = async () => {
    if (!createdAccount?.inviteLink) return;
    try {
      await navigator.clipboard.writeText(createdAccount.inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {
      setError('Unable to copy automatically. Please use the link field manually.');
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
                {createdAccount ? <CheckCircle className="w-5 h-5 text-white" /> : <UserPlus className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{createdAccount ? 'Professional Account Created' : 'Add New Professional'}</h2>
                <p className="text-sm text-slate-500">{createdAccount ? 'The professional can now set their password' : 'Create a professional profile and login account'}</p>
              </div>
            </div>
            <button onClick={handleClose} disabled={isSubmitting} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50">
              <X className="w-5 h-5" />
            </button>
          </div>

          {createdAccount ? (
            <div className="p-6 space-y-5">
              <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-900">Login account is ready</p>
                    <p className="text-sm text-emerald-800 mt-1">{createdAccount.name} has been added as a {ROLE_OPTIONS.find(o => o.value === createdAccount.role)?.label || createdAccount.role}.</p>
                    <p className="text-xs text-emerald-700 mt-2">UID: <span className="font-mono">{createdAccount.uid}</span></p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Secure password setup link</label>
                <div className="flex gap-2">
                  <input readOnly value={createdAccount.inviteLink || ''} className="flex-1 min-w-0 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 font-mono" />
                  <button type="button" onClick={copyInviteLink} className="px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-800">
                    <Copy className="w-4 h-4" /> {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Share this link securely with the professional. It is not stored in the Secret Sharz database.</p>
              </div>

              {error && <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">{error}</div>}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {createdAccount.inviteLink && (
                  <a href={createdAccount.inviteLink} target="_blank" rel="noreferrer" className="px-5 py-2.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" /> Open Link
                  </a>
                )}
                <button type="button" onClick={handleClose} className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg">Done</button>
              </div>
            </div>
          ) : (
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

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
                <strong className="text-slate-800">Login security:</strong> Secret Sharz creates the Firebase account server-side. No password is shown to the administrator; the professional receives a secure password-setup link instead.
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={handleClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Account...</> : <><UserPlus className="w-4 h-4" /> Create Professional Account</>}
                </button>
              </div>
            </form>
          )}
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
