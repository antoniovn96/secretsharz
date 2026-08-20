import React, { useState } from 'react';
import { AlertTriangle, Archive, Loader2, X } from 'lucide-react';
import { auth } from '../../firebase';

export default function AdminStudentArchiveModal({ student, isOpen, onClose, onArchived, theme = 'light', service = 'career' }) {
  const dark = theme === 'dark';
  const [confirmation, setConfirmation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  if (!isOpen || !student) return null;

  const name = String(student.name || student.preferredName || 'this student').trim();
  const confirmed = confirmation.trim().toLowerCase() === name.toLowerCase();

  const archive = async () => {
    if (!confirmed) return;
    setSaving(true); setError('');
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('Authentication required.');
      const token = await currentUser.getIdToken(true);
      const response = await fetch('/api/admin/archive-student', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, confirmationName: name, service }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to archive the student.');
      onArchived?.(student);
      onClose?.();
    } catch (err) {
      console.error('[AdminStudentArchiveModal] archive failed:', err);
      setError(err?.message || 'Unable to archive the student.');
    } finally { setSaving(false); }
  };

  return <>
    <div className="fixed inset-0 z-[70] bg-red-950/40 backdrop-blur-sm" onClick={() => !saving && onClose?.()} />
    <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
      <div className={`pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl border shadow-2xl ${dark ? 'border-slate-700 bg-[#111827] text-white' : 'border-slate-200 bg-white text-slate-900'}`} role="dialog" aria-modal="true" aria-labelledby="archive-student-title">
        <div className="border-b p-5"><div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700"><AlertTriangle className="h-5 w-5" /></div><h2 id="archive-student-title" className="text-lg font-bold">Archive student record?</h2><p className="mt-1 text-sm text-slate-500">This removes the student from active service directories without destroying the underlying record.</p></div>
        <div className="space-y-4 p-5">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4"><p className="font-semibold text-red-900">{name}</p><p className="mt-1 text-xs text-red-700">Student ID: {student.ssStudentId || 'Pending'}</p></div>
          <label className="block text-xs font-semibold text-slate-500">Type <span className="font-bold text-slate-800">{name}</span> to confirm<input autoFocus value={confirmation} onChange={e => setConfirmation(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-500" disabled={saving} /></label>
          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700" role="alert">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 border-t p-5"><button onClick={onClose} disabled={saving} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100"><X className="mr-1 inline h-4 w-4" />Cancel</button><button onClick={archive} disabled={!confirmed || saving} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}{saving ? 'Archiving…' : 'Archive record'}</button></div>
      </div>
    </div>
  </>;
}
