import React, { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { auth } from '../../firebase';

const EMPTY = { name: '', preferredName: '', email: '', phone: '', schoolName: '', grade: '', section: '', stream: '' };

export default function AdminStudentEditModal({ student, isOpen, onClose, onSaved, theme = 'light' }) {
  const dark = theme === 'dark';
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !student) return;
    setForm({
      name: student.name || student.identity?.fullName || '',
      preferredName: student.preferredName || student.identity?.preferredName || '',
      email: student.email || student.contact?.email || '',
      phone: student.contactNumber || student.contact?.mobile?.number || '',
      schoolName: student.schoolName || student.institutionName || student.institution?.name || '',
      grade: student.grade || student.academic?.grade || '',
      section: student.section || student.academic?.section || '',
      stream: student.stream || student.academic?.stream || '',
    });
    setError('');
  }, [isOpen, student]);

  if (!isOpen || !student) return null;
  const set = (field, value) => setForm(current => ({ ...current, [field]: value }));
  const hasAuthoritativeInstitution = Boolean(student.institutionId || student.institution?.id);

  const save = async () => {
    if (!form.name.trim()) return setError('Student name is required.');
    setSaving(true);
    setError('');
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Authentication required.');
      const token = await currentUser.getIdToken(true);
      const response = await fetch('/api/admin/update-student', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id || student.authUid,
          profile: {
            identity: { fullName: form.name.trim(), preferredName: form.preferredName.trim() },
            contact: { mobile: { number: form.phone.trim() } },
            institution: hasAuthoritativeInstitution ? undefined : { name: form.schoolName.trim() },
            academic: { current: { grade: form.grade.trim(), section: form.section.trim(), stream: form.stream.trim() } },
          },
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to save the student profile.');
      onSaved?.(payload.studentProfile || form);
      onClose?.();
    } catch (err) {
      console.error('[AdminStudentEditModal] save failed:', err);
      setError(err?.message || 'Unable to save the student profile.');
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = `mt-1 w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${dark ? 'border-slate-700 bg-[#0b1220] text-white' : 'border-slate-200 bg-white text-slate-900'}`;

  return <>
    <div className="fixed inset-0 z-[60] bg-slate-950/50 backdrop-blur-sm" onClick={() => !saving && onClose?.()} />
    <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">
      <div className={`pointer-events-auto w-full max-w-2xl overflow-hidden rounded-2xl border shadow-2xl ${dark ? 'border-slate-700 bg-[#111827] text-white' : 'border-slate-200 bg-white text-slate-900'}`} role="dialog" aria-modal="true" aria-labelledby="edit-student-title">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 id="edit-student-title" className="text-base font-bold">Edit Student Profile</h2>
            <p className="mt-1 text-xs text-slate-500">Only profile fields owned by this workflow can be changed here.</p>
          </div>
          <button aria-label="Close edit dialog" onClick={onClose} disabled={saving} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid max-h-[70vh] grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-500"><span>Full name</span><input value={form.name} onChange={e => set('name', e.target.value)} className={fieldClass} /></label>
          <label className="text-xs font-semibold text-slate-500"><span>Preferred name</span><input value={form.preferredName} onChange={e => set('preferredName', e.target.value)} className={fieldClass} /></label>
          <label className="text-xs font-semibold text-slate-500"><span>Email</span><input value={form.email} readOnly className={`${fieldClass} cursor-not-allowed opacity-70`} aria-describedby="email-edit-note" /><span id="email-edit-note" className="mt-1 block text-[10px] font-normal text-slate-400">Account email is managed separately so authentication identity cannot drift from the profile.</span></label>
          <label className="text-xs font-semibold text-slate-500"><span>Phone</span><input value={form.phone} onChange={e => set('phone', e.target.value)} className={fieldClass} /></label>
          <label className="text-xs font-semibold text-slate-500"><span>Institution / school</span><input value={form.schoolName} onChange={e => set('schoolName', e.target.value)} disabled={hasAuthoritativeInstitution} className={`${fieldClass} ${hasAuthoritativeInstitution ? 'cursor-not-allowed opacity-60' : ''}`} /><span className="mt-1 block text-[10px] font-normal text-slate-400">{hasAuthoritativeInstitution ? 'Managed by the institution membership relationship.' : 'No authoritative institution relationship is linked yet.'}</span></label>
          <label className="text-xs font-semibold text-slate-500"><span>Grade / class</span><input value={form.grade} onChange={e => set('grade', e.target.value)} className={fieldClass} /></label>
          <label className="text-xs font-semibold text-slate-500"><span>Section</span><input value={form.section} onChange={e => set('section', e.target.value)} className={fieldClass} /></label>
          <label className="text-xs font-semibold text-slate-500"><span>Stream</span><input value={form.stream} onChange={e => set('stream', e.target.value)} className={fieldClass} /></label>
          {error && <div className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700" role="alert">{error}</div>}
        </div>
        <div className="flex items-center justify-end gap-2 border-t px-5 py-4"><button onClick={onClose} disabled={saving} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">Cancel</button><button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{saving ? 'Saving…' : 'Save changes'}</button></div>
      </div>
    </div>
  </>;
}
