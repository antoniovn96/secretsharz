import React, { useEffect, useMemo, useState } from 'react';
import { UserCheck, UserMinus, Loader2, X } from 'lucide-react';
import { auth } from '../../firebase';

export default function AdminStudentAssignmentModal({ student, isOpen, service = 'career', theme = 'light', onClose, onSaved }) {
  const [professionals, setProfessionals] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const dark = theme === 'dark';

  useEffect(() => {
    if (!isOpen) return;
    setSelected(student?.assignedProfessionalId || '');
    setError('');
    const loadProfessionals = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Authentication required.');
        const token = await user.getIdToken(true);
        const response = await fetch(`/api/admin/professionals?service=${encodeURIComponent(service)}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload?.error || 'Unable to load professionals.');
        const rows = Array.isArray(payload.professionals) ? payload.professionals : Array.isArray(payload) ? payload : [];
        setProfessionals(rows);
      } catch (err) {
        setError(err?.message || 'Unable to load professionals.');
      } finally { setLoading(false); }
    };
    loadProfessionals();
  }, [isOpen, service, student?.assignedProfessionalId]);

  const selectedProfessional = useMemo(() => professionals.find(p => String(p.id || p.uid) === selected), [professionals, selected]);

  const save = async () => {
    setSaving(true); setError('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Authentication required.');
      const token = await user.getIdToken(true);
      const response = await fetch('/api/admin/student-service-assignment', {
        method: selected ? 'POST' : 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: student.id, service, ...(selected ? { professionalId: selected } : {}) }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload?.error || 'Unable to update assignment.');
      onSaved?.(payload.assignment);
      onClose?.();
    } catch (err) {
      setError(err?.message || 'Unable to update assignment.');
    } finally { setSaving(false); }
  };

  if (!isOpen || !student) return null;
  const title = selected ? 'Assign Career counsellor' : 'Unassign Career counsellor';
  return <>
    <div className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm" onClick={() => !saving && onClose?.()} />
    <div className="fixed inset-0 z-[71] flex items-center justify-center p-4 pointer-events-none">
      <div className={`pointer-events-auto w-full max-w-lg rounded-2xl border shadow-2xl ${dark ? 'bg-[#111827] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`} role="dialog" aria-modal="true" aria-labelledby="assignment-title">
        <div className="flex items-start justify-between border-b p-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-500">Career Guidance</p><h2 id="assignment-title" className="mt-1 text-lg font-bold">{title}</h2><p className="mt-1 text-sm text-slate-500">{student.name || 'Student'} · {student.ssStudentId || student.id}</p></div><button onClick={onClose} disabled={saving} aria-label="Close" className="rounded-lg p-2 hover:bg-slate-100"><X className="h-5 w-5" /></button></div>
        <div className="space-y-4 p-5">
          <label className="block text-sm font-semibold">Career counsellor<select value={selected} onChange={e => setSelected(e.target.value)} disabled={loading || saving} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500"><option value="">Unassigned</option>{professionals.map(p => { const id = String(p.id || p.uid); return <option key={id} value={id}>{p.name || p.fullName || p.displayName || id}</option>; })}</select></label>
          {selectedProfessional && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800"><UserCheck className="mr-2 inline h-4 w-4" />{selectedProfessional.name || selectedProfessional.fullName || selectedProfessional.displayName} will become the active Career assignment.</div>}
          {!selected && student.assignedProfessionalId && <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800"><UserMinus className="mr-2 inline h-4 w-4" />This will revoke the current Career assignment.</div>}
          {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700" role="alert">{error}</div>}
        </div>
        <div className="flex justify-end gap-2 border-t p-5"><button onClick={onClose} disabled={saving} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">Cancel</button><button onClick={save} disabled={loading || saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : selected ? <UserCheck className="h-4 w-4" /> : <UserMinus className="h-4 w-4" />}{saving ? 'Saving…' : selected ? 'Assign counsellor' : 'Unassign'}</button></div>
      </div>
    </div>
  </>;
}
