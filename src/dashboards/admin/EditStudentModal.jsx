import React, { useEffect, useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { auth } from '../../firebase';

const text = value => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(text).filter(Boolean).join(', ');
  if (typeof value === 'object') return text(value.display || value.label || value.name || value.number || value.international || value.cityName || '');
  return '';
};

export default function EditStudentModal({ student, isOpen, onClose, onSaved, theme = 'light' }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const dark = theme === 'dark';

  useEffect(() => {
    if (!isOpen || !student) return;
    setForm({
      name: text(student.name || student.fullName),
      email: text(student.email),
      phone: text(student.phone || student.contactNumber || student.profile?.phone),
      gender: text(student.gender || student.profile?.gender),
      grade: text(student.grade || student.classLevel || student.gradeOrCourse || student.school?.grade),
      schoolName: text(student.schoolName || student.institutionName || student.school?.name),
      studentTrack: text(student.studentTrack || student.path || student.primary_path || 'unassigned'),
      primary_path: text(student.primary_path || student.path || student.studentTrack || 'unassigned'),
    });
    setError('');
  }, [isOpen, student]);

  if (!isOpen || !student) return null;
  const set = key => event => setForm(prev => ({ ...prev, [key]: event.target.value }));

  const save = async event => {
    event.preventDefault();
    setSaving(true); setError('');
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Authentication required.');
      const token = await currentUser.getIdToken(true);
      const response = await fetch('/api/admin/update-student', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, profile: form }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to save the student profile.');
      onSaved?.(payload.profile || { ...student, ...form });
      onClose?.();
    } catch (err) { setError(err?.message || 'Unable to save the student profile.'); }
    finally { setSaving(false); }
  };

  const input = `w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'bg-[#111] border-[#303030] text-white' : 'bg-white border-slate-200 text-slate-900'}`;
  const label = `text-xs font-bold mb-1.5 block ${dark ? 'text-[#aaa]' : 'text-slate-600'}`;
  return <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onMouseDown={e => { if (e.target === e.currentTarget) onClose?.(); }}>
    <form onSubmit={save} className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${dark ? 'bg-[#151515] border-[#292929]' : 'bg-white border-slate-200'}`}>
      <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-slate-200/20 bg-inherit"><div><h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Edit Student Profile</h2><p className={`text-xs mt-1 ${dark ? 'text-[#777]' : 'text-slate-500'}`}>Student ID: {text(student.id)}</p></div><button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100/10"><X className="w-5 h-5" /></button></div>
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[['name','Full name'],['email','Email'],['phone','Phone'],['gender','Gender'],['grade','Grade / Class'],['schoolName','School']].map(([key,title]) => <label key={key}><span className={label}>{title}</span><input className={input} value={form[key] || ''} onChange={set(key)} /></label>)}
        <label><span className={label}>Primary Path</span><select className={input} value={form.primary_path || 'unassigned'} onChange={set('primary_path')}><option value="unassigned">Unassigned</option><option value="career">Career</option><option value="wellbeing">Wellbeing</option><option value="sen">SEN</option></select></label>
        <label><span className={label}>Student Track</span><select className={input} value={form.studentTrack || 'unassigned'} onChange={set('studentTrack')}><option value="unassigned">Unassigned</option><option value="career">Career</option><option value="counselling">Counselling</option><option value="both">Both</option><option value="sen">SEN</option></select></label>
        {error && <div className="md:col-span-2 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold">{error}</div>}
      </div>
      <div className="sticky bottom-0 flex justify-end gap-2 p-5 border-t border-slate-200/20 bg-inherit"><button type="button" onClick={onClose} className={`px-4 py-2.5 rounded-lg text-sm font-semibold ${dark ? 'text-[#aaa] hover:bg-white/5' : 'text-slate-600 hover:bg-slate-100'}`}>Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-bold disabled:opacity-50">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes</button></div>
    </form>
  </div>;
}
