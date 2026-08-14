import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../firebase';

export default function ProfileChangeRequest() {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user || !message.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'profileChangeRequests'), {
        userId: user.uid,
        userEmail: user.email || null,
        message: message.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setMessage('');
      setSent(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Need to change your profile?</h3>
      <p className="mt-1 text-sm text-slate-600">You cannot change verified profile details yourself. Contact the admin or your counsellor and tell us what needs to be corrected.</p>
      {sent ? <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">Your request has been sent. The admin or your counsellor can review and update your profile.</div> : (
        <form onSubmit={submit} className="mt-4">
          <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-300 p-3 text-sm" placeholder="Example: My school has changed to…" />
          <button disabled={saving || !message.trim()} className="mt-3 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Sending…' : 'Contact admin / counsellor'}</button>
        </form>
      )}
    </section>
  );
}
