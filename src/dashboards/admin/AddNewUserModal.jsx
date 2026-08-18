import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, User, GraduationCap, Loader2, Copy, Check, Users } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const PATH_OPTIONS = [
  { value: 'wellbeing', label: 'Wellbeing', description: 'Mental health & counselling support' },
  { value: 'sen', label: 'SEN', description: 'Special Educational Needs support' },
  { value: 'career', label: 'Career', description: 'Career guidance & exploration' },
  { value: 'unassigned', label: 'Unassigned', description: 'No specific path yet' },
];
const GRADE_OPTIONS = ['Class 6','Class 7','Class 8','Class 9','Class 10','Class 11','Class 12','College 1st Year','College 2nd Year','College 3rd Year','College Final Year','Graduate'];
const RELATIONSHIP_OPTIONS = [
  { value:'father', label:'Father' },
  { value:'mother', label:'Mother' },
  { value:'guardian', label:'Guardian' },
];

const AddNewUserModal = ({ isOpen, onClose, onSuccess, userRole = 'student', institutionId = '', institutionName = '' }) => {
  const [formData, setFormData] = useState({ name:'', email:'', grade:'', primary_path:'unassigned', relationship:'guardian', studentIds:[] });
  const [students,setStudents]=useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activationLink, setActivationLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(()=>{
    if(!isOpen||userRole!=='parent')return;
    const usersRef=collection(db,'users');
    const studentQuery=institutionId?query(usersRef,where('role','==','student'),where('institutionId','==',institutionId)):query(usersRef,where('role','==','student'),orderBy('name'));
    const unsubscribe=onSnapshot(studentQuery,snapshot=>setStudents(snapshot.docs.map(doc=>({id:doc.id,...doc.data()}))),()=>setStudents([]));
    return()=>unsubscribe();
  },[isOpen,userRole,institutionId]);

  const handleChange = e => { const {name,value}=e.target; setFormData(prev=>({...prev,[name]:value})); setError(''); };
  const toggleStudent=id=>setFormData(prev=>({...prev,studentIds:prev.studentIds.includes(id)?prev.studentIds.filter(item=>item!==id):[...prev.studentIds,id]}));
  const reset = () => { setFormData({name:'',email:'',grade:'',primary_path:'unassigned',relationship:'guardian',studentIds:[]}); setError(''); setActivationLink(''); setCopied(false); };

  const handleSubmit = async e => {
    e.preventDefault();
    if(!formData.name.trim()) return setError('Name is required');
    if(!formData.email.trim()) return setError('Email is required');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError('Please enter a valid email address');
    if(userRole==='parent'&&!formData.studentIds.length) return setError('Select at least one student to link to this parent account.');
    setIsSubmitting(true); setError('');
    try {
      const user = auth.currentUser;
      if(!user) throw new Error('Authentication required.');
      const token = await user.getIdToken(true);
      const endpoint = userRole === 'parent' ? '/api/admin/provision-parent' : '/api/provision-student';
      const body = userRole === 'parent'
        ? { name: formData.name.trim(), email: formData.email.trim().toLowerCase(), institutionId: institutionId || null, institutionName, studentIds: formData.studentIds, relationship: formData.relationship }
        : { name: formData.name.trim(), email: formData.email.trim().toLowerCase(), institutionId: institutionId || null, institutionName, grade: formData.grade || null, primary_path: formData.primary_path, track: formData.primary_path === 'unassigned' ? 'hybrid' : formData.primary_path };
      const response = await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify(body)});
      const payload = await response.json();
      if(!response.ok) throw new Error(payload?.error || 'Unable to provision the account.');
      const account = userRole === 'parent' ? payload.parent : payload.student;
      setActivationLink(account?.activationLink || '');
      onSuccess?.({...formData,id:account?.uid,role:userRole,activationLink:account?.activationLink});
      if(!account?.activationLink){ reset(); onClose(); }
    } catch(err){ console.error('Error provisioning user:',err); setError(err?.message||'Failed to create the account. Please try again.'); }
    finally { setIsSubmitting(false); }
  };

  const handleClose=()=>{if(!isSubmitting){reset();onClose();}};
  const copyLink=async()=>{if(!activationLink)return;try{await navigator.clipboard.writeText(activationLink);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch(_){setError('Copy failed. Please select and copy the activation link manually.');}};
  if(!isOpen)return null;
  const roleLabel=userRole==='student'?'Student':userRole==='parent'?'Parent':'Professional';

  return <>
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50" onClick={handleClose}/>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-100"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg"><UserPlus className="w-5 h-5 text-white"/></div><div><h2 className="text-lg font-bold text-slate-900">Add New {roleLabel}</h2><p className="text-sm text-slate-500">{userRole==='parent'?'Create and link a secure parent account':'Provision a secure student account'}</p></div></div><button onClick={handleClose} disabled={isSubmitting} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5"/></button></div>
        {activationLink ? <div className="p-6 space-y-5"><div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100"><div className="flex items-center gap-2 text-emerald-800 font-bold"><Check className="w-5 h-5"/> {roleLabel} account created</div><p className="text-sm text-emerald-700 mt-2">Send this activation link to the {roleLabel.toLowerCase()}. The link is not stored in Secret Sharz.</p></div><label className="block text-sm font-semibold text-slate-700">{roleLabel} activation link<input readOnly value={activationLink} className="w-full mt-2 px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600"/></label><div className="flex justify-end gap-3"><button onClick={copyLink} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2">{copied?<Check className="w-4 h-4"/>:<Copy className="w-4 h-4"/>}{copied?'Copied':'Copy activation link'}</button><button onClick={handleClose} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Done</button></div></div> : <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error&&<div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">{error}</div>}
          <div className="space-y-2"><label className="block text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label><div className="relative"><User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/><input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" disabled={isSubmitting}/></div></div>
          <div className="space-y-2"><label className="block text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label><div className="relative"><Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" disabled={isSubmitting}/></div></div>
          {userRole==='parent'&&<>
            <div className="space-y-2"><label className="block text-sm font-semibold text-slate-700">Relationship to student <span className="text-red-500">*</span></label><select name="relationship" value={formData.relationship} onChange={handleChange} disabled={isSubmitting} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"><option value="father">Father</option><option value="mother">Mother</option><option value="guardian">Guardian</option></select><p className="text-xs text-slate-500">Father, Mother and Guardian accounts all use the same Parent Dashboard.</p></div>
            <div className="space-y-2"><label className="block text-sm font-semibold text-slate-700">Link student(s) <span className="text-red-500">*</span></label><div className="border border-slate-200 rounded-xl bg-slate-50 p-3 max-h-48 overflow-y-auto space-y-2">{students.length===0?<p className="text-sm text-slate-500 p-2">No students are available in this institution yet.</p>:students.map(student=><label key={student.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 cursor-pointer"><input type="checkbox" checked={formData.studentIds.includes(student.id)} onChange={()=>toggleStudent(student.id)} disabled={isSubmitting} className="w-4 h-4"/><Users className="w-4 h-4 text-slate-400"/><span className="text-sm font-semibold text-slate-700">{student.name||student.email}</span>{student.grade&&<span className="ml-auto text-xs text-slate-400">{student.grade}</span>}</label>)}</div></div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-600">Only an Admin, authorised Professional, or Institution can create and link this parent account. The parent receives an activation link and uses the same Parent Dashboard whether they are a Father, Mother, or Guardian.</div>
          </>}
          {userRole!=='parent'&&<><div className="space-y-2"><label className="block text-sm font-semibold text-slate-700">Grade / Class Level</label><div className="relative"><GraduationCap className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/><select name="grade" value={formData.grade} onChange={handleChange} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" disabled={isSubmitting}><option value="">Select grade (optional)</option>{GRADE_OPTIONS.map(grade=><option key={grade}>{grade}</option>)}</select></div></div><div className="space-y-3"><label className="block text-sm font-semibold text-slate-700">Primary Service</label><div className="grid grid-cols-2 gap-3">{PATH_OPTIONS.map(option=><button key={option.value} type="button" onClick={()=>setFormData(prev=>({...prev,primary_path:option.value}))} disabled={isSubmitting} className={`p-3 rounded-xl border-2 text-left ${formData.primary_path===option.value?'border-emerald-500 bg-emerald-50':'border-slate-200 bg-white'}`}><p className="font-bold text-sm text-slate-700">{option.label}</p><p className="text-xs text-slate-500 mt-0.5">{option.description}</p></button>)}</div></div></>}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100"><button type="button" onClick={handleClose} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button><button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-xl flex items-center gap-2">{isSubmitting?<><Loader2 className="w-4 h-4 animate-spin"/>Creating...</>:<><UserPlus className="w-4 h-4"/>Create {roleLabel}</>}</button></div>
        </form>}
      </div>
    </div>
  </>;
};

export default AddNewUserModal;
