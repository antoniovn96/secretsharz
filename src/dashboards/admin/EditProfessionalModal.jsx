import React, { useEffect, useState } from 'react';
import { X, UserPlus, Mail, User, Phone, Briefcase, GraduationCap, Building2, Award, Loader2 } from 'lucide-react';
import { auth } from '../../firebase';

const ROLE_OPTIONS = [
  { value: 'counsellor', label: 'Counsellor', description: 'Counselling & wellbeing support' },
  { value: 'career_counsellor', label: 'Career Counsellor', description: 'Career guidance & exploration' },
  { value: 'psychologist', label: 'Psychologist', description: 'Psychological assessment & support' },
  { value: 'educator', label: 'SEN Teacher / Educator', description: 'Special educational needs support' },
];

const EMPTY_FORM = { name: '', email: '', phone: '', role: 'counsellor', specialization: '', qualification: '', institutionName: '', registrationNumber: '', status: 'active' };

const EditProfessionalModal = ({ professional, isOpen, onClose, onSuccess, theme = 'light' }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const dark = theme === 'dark';

  useEffect(() => {
    if (professional && isOpen) {
      setFormData({ name: professional.name || '', email: professional.email || '', phone: professional.phone || '', role: professional.role || professional.professionalRole || 'counsellor', specialization: professional.specialization || '', qualification: professional.qualification || '', institutionName: professional.institutionName || '', registrationNumber: professional.registrationNumber || '', status: professional.status || 'active' });
      setError('');
    }
  }, [professional, isOpen]);

  if (!isOpen || !professional) return null;
  const handleChange = e => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); setError(''); };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.name.trim()) return setError('Full name is required');
    if (!formData.email.trim()) return setError('Email is required');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return setError('Please enter a valid email address');
    if (!formData.role) return setError('Professional role is required');
    setIsSubmitting(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Please sign in again.');
      const token = await currentUser.getIdToken(true);
      const response = await fetch('/api/admin/update-professional', { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ professionalUid: professional.id, ...formData }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Failed to update professional.');
      onSuccess?.(payload.professional);
      onClose();
    } catch (err) { console.error('Error updating professional:', err); setError(err.message || 'Failed to update professional. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const inputClass = `w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-1 ${dark ? 'bg-[#171717] border-[#333] text-white placeholder:text-slate-600 focus:ring-white' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-black'}`;
  const panel = dark ? 'bg-[#111111] text-white border-[#292929]' : 'bg-white text-slate-900 border-slate-200';
  const muted = dark ? 'text-slate-400' : 'text-slate-500';

  return <>
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => !isSubmitting && onClose()} />
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
      <div className={`${panel} rounded-2xl shadow-2xl w-full max-w-2xl pointer-events-auto max-h-[90vh] overflow-y-auto border`} onClick={e => e.stopPropagation()}>
        <div className={`flex items-center justify-between p-6 border-b ${dark ? 'border-[#292929]' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}><UserPlus className="w-5 h-5" /></div><div><h2 className="text-lg font-bold">Edit Professional</h2><p className={`text-sm ${muted}`}>Update professional profile information</p></div></div>
          <button onClick={onClose} disabled={isSubmitting} className={`p-2 rounded-lg ${dark ? 'text-slate-400 hover:bg-[#202020]' : 'text-slate-400 hover:bg-slate-100'}`}><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Full Name" required icon={User}><input name="name" value={formData.name} onChange={handleChange} disabled={isSubmitting} className={inputClass} /></Field>
            <Field label="Email Address" required icon={Mail}><input type="email" name="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} className={inputClass} /></Field>
            <Field label="Phone Number" icon={Phone}><input name="phone" value={formData.phone} onChange={handleChange} placeholder="Optional" disabled={isSubmitting} className={inputClass} /></Field>
            <Field label="Professional Role" required icon={Briefcase}><select name="role" value={formData.role} onChange={handleChange} disabled={isSubmitting} className={inputClass}>{ROLE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>
            <Field label="Specialisation / Area of Practice" icon={Award}><input name="specialization" value={formData.specialization} onChange={handleChange} placeholder="e.g. Child & adolescent counselling" disabled={isSubmitting} className={inputClass} /></Field>
            <Field label="Qualification" icon={GraduationCap}><input name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g. M.A. Psychology" disabled={isSubmitting} className={inputClass} /></Field>
            <Field label="Employment / Organisation" icon={Building2}><input name="institutionName" value={formData.institutionName} onChange={handleChange} placeholder="General employment information" disabled={isSubmitting} className={inputClass} /></Field>
            <Field label="Professional Registration / License No." icon={Award}><input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="Optional" disabled={isSubmitting} className={inputClass} /></Field>
          </div>
          <div className={`rounded-xl border p-4 ${dark ? 'border-[#333] bg-[#171717]' : 'border-slate-200 bg-slate-50'}`}><p className="text-sm font-bold">Institution access is managed separately</p><p className={`text-xs mt-1 ${muted}`}>Use the building icon in the Professional Directory to assign Secret Sharz institutions. Changing a professional's role clears existing institution assignments so access can be reassigned for the new service.</p></div>
          <Field label="Directory Status" icon={Award}><select name="status" value={formData.status} onChange={handleChange} disabled={isSubmitting} className={inputClass}><option value="active">Active</option><option value="inactive">Inactive</option></select></Field>
          <div className={`flex items-center justify-end gap-3 pt-4 border-t ${dark ? 'border-[#292929]' : 'border-slate-100'}`}><button type="button" onClick={onClose} disabled={isSubmitting} className={`px-5 py-2.5 text-sm font-semibold rounded-xl ${dark ? 'text-slate-300 hover:bg-[#202020]' : 'text-slate-600 hover:bg-slate-100'}`}>Cancel</button><button type="submit" disabled={isSubmitting} className={`px-5 py-2.5 text-sm font-bold rounded-xl flex items-center gap-2 ${dark ? 'bg-white text-black hover:bg-slate-100' : 'bg-black text-white hover:bg-slate-800'}`}>{isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}</button></div>
        </form>
      </div>
    </div>
  </>;
};

const Field = ({ label, required, icon: Icon, children }) => <div className="space-y-2"><label className="block text-sm font-semibold">{label} {required && <span className="text-red-500">*</span>}</label><div className="relative"><Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />{React.cloneElement(children, { className: children.props.className })}</div></div>;
export default EditProfessionalModal;
