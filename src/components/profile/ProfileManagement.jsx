import React, { useEffect, useState } from 'react';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const fieldLabels = {
  fullName: 'Full name',
  dateOfBirth: 'Date of birth',
  gender: 'Gender',
  phone: 'Contact number',
  emergencyContactName: 'Emergency contact name',
  emergencyContactPhone: 'Emergency contact number',
  institution: 'School / College',
  gradeOrCourse: 'Grade / Course',
  occupation: 'Occupation',
  educationLevel: 'Education level',
  city: 'City',
};

export default function ProfileManagement({ onClose }) {
  const user = auth.currentUser;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRequest, setShowRequest] = useState(false);
  const [field, setField] = useState('');
  const [requestedValue, setRequestedValue] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (active) setProfile(snap.exists() ? snap.data() : {});
      } catch (error) {
        if (active) setMessage('Unable to load your profile right now.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [user]);

  const submitRequest = async (event) => {
    event.preventDefault();
    if (!user || !field || !requestedValue.trim()) return;
    setSaving(true);
    setMessage('');
    try {
      await addDoc(collection(db, 'profileChangeRequests'), {
        userId: user.uid,
        userName: profile?.fullName || profile?.name || user.displayName || 'User',
        field,
        fieldLabel: fieldLabels[field],
        currentValue: profile?.[field] ?? '',
        requestedValue: requestedValue.trim(),
        reason: reason.trim() || null,
        status: 'pending',
        requestedAt: serverTimestamp(),
      });
      setMessage('Your change request has been sent to the admin/counsellor.');
      setShowRequest(false);
      setField('');
      setRequestedValue('');
      setReason('');
    } catch (error) {
      setMessage('We could not submit the request. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="fixed inset-0 z-[2000] bg-black/30 flex items-center justify-center"><div className="bg-white rounded-2xl p-8">Loading profile…</div></div>;

  const isStudent = profile?.status === 'student' || profile?.userType === 'student';
  const rows = [
    ['fullName', profile?.fullName || profile?.name],
    ['dateOfBirth', profile?.dateOfBirth || profile?.dob],
    ['gender', profile?.gender],
    ['phone', profile?.phone || profile?.contactNumber],
    ['emergencyContactName', profile?.emergencyContactName],
    ['emergencyContactPhone', profile?.emergencyContactPhone],
    ...(isStudent ? [['institution', profile?.institution || profile?.school], ['gradeOrCourse', profile?.gradeOrCourse || profile?.grade || profile?.course]] : [['occupation', profile?.occupation], ['educationLevel', profile?.educationLevel]]),
    ['city', profile?.city],
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-black/40 backdrop-blur-sm p-4 md:p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-7 text-white flex items-start justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-widest opacity-80">Secret Sharz</p><h2 className="text-3xl font-black mt-1">My Profile</h2><p className="mt-2 text-white/80">Your core details are managed to keep your records accurate.</p></div>
          <button type="button" onClick={onClose} className="rounded-full bg-white/15 px-4 py-2 font-bold">Close</button>
        </div>
        <div className="p-6 md:p-8">
          {message && <div className="mb-5 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800">{message}</div>}
          <div className="flex items-center gap-4 mb-7">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl font-black">{(profile?.fullName || profile?.name || 'U').charAt(0).toUpperCase()}</div>
            <div><h3 className="text-xl font-bold">{profile?.fullName || profile?.name || user?.displayName || 'User'}</h3><p className="text-slate-500">{isStudent ? 'Student' : 'Working professional'}</p></div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {rows.map(([key, value]) => <div key={key} className="rounded-2xl bg-slate-50 border border-slate-100 p-4"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">{fieldLabels[key]}</div><div className="font-semibold text-slate-800 mt-1">{value || 'Not provided'}</div></div>)}
          </div>
          <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5"><h4 className="font-bold text-amber-900">Need to change something?</h4><p className="text-sm text-amber-800 mt-1">You can request a correction or update. An authorised admin or counsellor will review it before your managed profile is changed.</p><button type="button" onClick={() => setShowRequest(true)} className="mt-4 rounded-xl bg-amber-700 text-white px-5 py-3 font-bold">Request a Change</button></div>

          {showRequest && <form onSubmit={submitRequest} className="mt-6 rounded-2xl border border-slate-200 p-5">
            <h4 className="font-bold text-slate-900 text-lg">Request a profile change</h4>
            <label className="block mt-4 text-sm font-semibold">What would you like to change?<select required value={field} onChange={e => setField(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-3 bg-white"><option value="">Select a field</option>{Object.entries(fieldLabels).map(([key,label]) => <option key={key} value={key}>{label}</option>)}</select></label>
            <label className="block mt-4 text-sm font-semibold">Requested new value<input required value={requestedValue} onChange={e => setRequestedValue(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label>
            <label className="block mt-4 text-sm font-semibold">Reason (optional)<textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label>
            <div className="flex gap-3 mt-5"><button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 text-white px-5 py-3 font-bold disabled:opacity-50">{saving ? 'Sending…' : 'Send Request'}</button><button type="button" onClick={() => setShowRequest(false)} className="rounded-xl border border-slate-300 px-5 py-3 font-bold">Cancel</button></div>
          </form>}
        </div>
      </div>
    </div>
  );
}
