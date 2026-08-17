import React, { useState } from 'react';
import { X, UserPlus, Mail, User, GraduationCap, Loader2, Copy, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const PATH_OPTIONS = [
  { value: 'wellbeing', label: 'Wellbeing', description: 'Mental health & counselling support', color: 'purple' },
  { value: 'sen', label: 'SEN', description: 'Special Educational Needs support', color: 'amber' },
  { value: 'career', label: 'Career', description: 'Career guidance & exploration', color: 'emerald' },
  { value: 'unassigned', label: 'Unassigned', description: 'No specific path yet', color: 'slate' },
];
const GRADE_OPTIONS = ['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12','College 1st Year','College 2nd Year','College 3rd Year','College Final Year','Graduate'];

const AddNewUserModal = ({ isOpen, onClose, onSuccess, userRole = 'student' }) => {
  const [formData, setFormData] = useState({ name:'', email:'', grade:'', primary_path:'unassigned' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activationLink, setActivationLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = e => { const {name,value}=e.target; setFormData(prev=>({...prev,[name]:value})); setError(''); };

  const reset = () => { setFormData({name:'',email:'',grade:'',primary_path:'unassigned'}); setError(''); setActivationLink(''); setCopied(false); };

  const handleSubmit = async e => {
    e.preventDefault();
    if(!formData.name.trim()) return setError('Name is required');
    if(!formData.email.trim()) return setError('Email is required');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError('Please enter a valid email address');
    setIsSubmitting(true); setError('');
    try {
      if(userRole==='parent'){
        const user=auth.currentUser;
        if(!user) throw new Error('Authentication required.');
        const token=await user.getIdToken(true);
        const response=await fetch('/api/admin/provision-parent',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({name:formData.name.trim(),email:formData.email.trim().toLowerCase()})});
        const payload=await response.json();
        if(!response.ok) throw new Error(payload?.error||'Unable to provision the parent account.');
        setActivationLink(payload?.parent?.activationLink||'');
        onSuccess?.({...formData,id:payload?.parent?.uid,role:'parent',activationLink:payload?.parent?.activationLink});
        return;
      }

      const docRef=await addDoc(collection(db,'users'),{
        name:formData.name.trim(),email:formData.email.trim().toLowerCase(),grade:formData.grade||null,primary_path:formData.primary_path,role:userRole,createdAt:serverTimestamp(),updatedAt:serverTimestamp(),profileComplete:false,counsellingConsentAgreed:false,studentTrack:'unassigned',assignedCounsellorId:null,assignedCareerCoachId:null,parentId:null,
      });
      onSuccess?.({id:docRef.id,...formData,role:userRole,createdAt:new Date()});
      reset(); onClose();
    } catch(err){ console.error('Error creating user:',err); setError(err?.message||'Failed to create user. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const handleClose=()=>{if(!isSubmitting){reset();onClose();}};
  const copyLink=async()=>{if(!activationLink)return;try{await navigator.clipboard.writeText(activationLink);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch(_){setError('Copy failed. Please select and copy the activation link manually.');}};
  if(!isOpen)return null;
  const roleLabel=userRole==='student'?'Student':userRole==='parent'?'Parent':'Professional';

  return <>
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={handleClose}/>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"><UserPlus className="w-5 h-5 text-white"/></div><div><h2 className="text-lg font-bold text-slate-900">Add New {roleLabel}</h2><p className="text-sm text-slate-500">{userRole==='parent'?'Provision a secure parent account':'Create a new user profile'}</p></div></div><button onClick={handleClose} disabled={isSubmitting} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5"/></button></div>
        {activationLink ? <div className="p-6 space-y-5"><div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100"><div className="flex items-center gap-2 text-emerald-800 font-bold"><Check className="w-5 h-5"/> Parent account created</div><p className="text-sm text-emerald-700 mt-2">Send this activation link to the parent. The link is not stored in Secret Sharz.</p></div><label className="block text-sm font-semibold text-slate-700">Parent activation link<input readOnly value={activationLink} className="w-full mt-2 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600"/></label><div className="flex justify-end gap-3"><button onClick={copyLink} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2">{copied?<Check className="w-4 h-4"/>:<Copy className="w-4 h-4"/>}{copied?'Copied':'Copy activation link'}</button><button onClick={handleClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Done</button></div></div> : <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error&&<div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">{error}</div>}
          <div className="space-y-2"><label className="block text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label><div className="relative"><User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" disabled={isSubmitting}/></div></div>
          <div className="space-y-2"><label className="block text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label><div className="relative"><Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" disabled={isSubmitting}/></div></div>
          {userRole!=='parent'&&<><div className="space-y-2"><label className="block text-sm font-semibold text-slate-700">Grade / Class Level</label><div className="relative"><GraduationCap className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/><select name="grade" value={formData.grade} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" disabled={isSubmitting}><option value="">Select grade (optional)</option>{GRADE_OPTIONS.map(grade=><option key={grade}>{grade}</option>)}</select></div></div><div className="space-y-3"><label className="block text-sm font-semibold text-slate-700">Learning Path</label><div className="grid grid-cols-2 gap-3">{PATH_OPTIONS.map(option=><button key={option.value} type="button" onClick={()=>setFormData(prev=>({...prev,primary_path:option.value}))} disabled={isSubmitting} className={`p-3 rounded-xl border-2 text-left ${formData.primary_path===option.value?'border-emerald-500 bg-emerald-50':'border-slate-200 bg-white'}`}><p className="font-bold text-sm text-slate-700">{option.label}</p><p className="text-xs text-slate-500 mt-0.5">{option.description}</p></button>)}</div></div></>}
          {userRole==='parent'&&<div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">Parents do not create accounts from the public sign-in page. This action provisions the parent account and gives the administrator an activation link to send to the parent.</div>}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100"><button type="button" onClick={handleClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button><button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-xl flex items-center gap-2">{isSubmitting?<><Loader2 className="w-4 h-4 animate-spin"/>Creating...</>:<><UserPlus className="w-4 h-4"/>Create {roleLabel}</>}</button></div>
        </form>}
      </div>
    </div>
  </>;
};

export default AddNewUserModal;
