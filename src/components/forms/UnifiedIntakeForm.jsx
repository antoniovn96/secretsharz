import React, { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../../firebase';
import { buildProfileRecord, deriveProfileType, requiresGuardian } from '../../platform/profileOnboardingModel';

function calculateAge(dob) {
  if (!dob) return '';
  const birth = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday = today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

const EMPTY = { profileType: 'student', name: '', dob: '', age: '', grade: '', schoolName: '', institutionName: '', professionalTitle: '', parentName: '', parentContact: '', contactNumber: '', emergencyContactName: '', emergencyContactNumber: '', photoURL: '' };

const UnifiedIntakeForm = ({ onComplete, initialProfileType = null }) => {
  const [formData, setFormData] = useState({ ...EMPTY, profileType: initialProfileType || 'student' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (!snapshot.exists()) return;
        const saved = snapshot.data();
        if (cancelled) return;
        const inferredType = deriveProfileType({ profileType: saved.profileType, role: saved.role || user?.role });
        setFormData((current) => ({ ...current, ...saved, profileType: inferredType, photoURL: saved.photoURL || user.photoURL || '' }));
      } catch (_) {
        if (!cancelled) setError('We could not load your saved profile. You can still complete it now.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadProfile();
    return () => { cancelled = true; };
  }, []);

  const age = useMemo(() => Number(formData.age) || Number(calculateAge(formData.dob)) || '', [formData.age, formData.dob]);
  const guardianRequired = requiresGuardian({ profileType: formData.profileType, age });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value, ...(name === 'dob' && calculateAge(value) ? { age: calculateAge(value) } : {}) }));
    setSavedMessage(''); setError('');
  };

  const handleTypeChange = (type) => {
    setFormData((current) => ({ ...current, profileType: type, grade: type === 'student' ? current.grade : '', schoolName: type === 'student' ? current.schoolName : '', parentName: type === 'student' ? current.parentName : '', parentContact: type === 'student' ? current.parentContact : '' }));
    setError(''); setSavedMessage('');
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Please choose an image smaller than 5 MB.'); return; }
    const user = auth.currentUser;
    if (!user) { setError('Please sign in again before adding a profile picture.'); return; }
    setUploadingPhoto(true); setError('');
    try {
      const storageRef = ref(storage, `users/${user.uid}/profile/profile-picture`);
      await uploadBytes(storageRef, file, { contentType: file.type, cacheControl: 'public,max-age=3600' });
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL });
      await setDoc(doc(db, 'users', user.uid), { photoURL, updatedAt: new Date().toISOString() }, { merge: true });
      setFormData((current) => ({ ...current, photoURL }));
      setSavedMessage('Profile picture saved.');
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError('We could not save that picture. Please try again.');
    } finally { setUploadingPhoto(false); }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault(); setIsSubmitting(true); setError(''); setSavedMessage('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user found.');
      const record = buildProfileRecord({ ...formData, age });
      await setDoc(doc(db, 'users', user.uid), { ...record, photoURL: formData.photoURL || user.photoURL || '' }, { merge: true });
      await updateProfile(user, { displayName: record.name, ...(formData.photoURL ? { photoURL: formData.photoURL } : {}) });
      setFormData((current) => ({ ...current, ...record }));
      setSavedMessage('Your profile has been saved. You will not be asked for these details again unless you choose to edit them.');
      onComplete?.({ ...record, photoURL: formData.photoURL || user.photoURL || '' });
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"><div className="rounded-3xl bg-white px-8 py-7 shadow-2xl font-semibold text-slate-700">Loading your saved profile…</div></div>;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl relative overflow-y-auto max-h-[92vh]">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-100 px-6 sm:px-8 pt-6 pb-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Welcome to Secret Sharz! 🎉</h2>
          <p className="text-slate-500 font-medium mt-1">Just a few details so we can personalise your experience.</p>
        </div>
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8">
          {error && <div className="mb-5 p-3.5 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-semibold">{error}</div>}
          {savedMessage && <div className="mb-5 p-3.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-sm font-semibold">✓ {savedMessage}</div>}
          <div className="mb-7 rounded-2xl bg-slate-50 p-4 sm:p-5">
            <label className="block text-sm font-bold text-slate-700 mb-3">How would you describe yourself?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" onClick={() => handleTypeChange('student')} className={`rounded-2xl border-2 p-4 text-left transition ${formData.profileType === 'student' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}><div className="text-2xl">🎓</div><div className="font-bold text-slate-800 mt-1">Student</div><div className="text-xs text-slate-500 mt-1">School, college or university student</div></button>
              <button type="button" onClick={() => handleTypeChange('working_professional')} className={`rounded-2xl border-2 p-4 text-left transition ${formData.profileType === 'working_professional' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}><div className="text-2xl">💼</div><div className="font-bold text-slate-800 mt-1">Working Professional</div><div className="text-xs text-slate-500 mt-1">Working, self-employed or between roles</div></button>
            </div>
          </div>
          <div className="flex flex-col items-center mb-7">
            <div className="relative"><div className="h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-100 border-4 border-white shadow ring-1 ring-slate-200 flex items-center justify-center text-3xl">{formData.photoURL ? <img src={formData.photoURL} alt="Profile preview" className="h-full w-full object-cover" /> : '👤'}</div><label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-indigo-600 px-2.5 py-2 text-white shadow-lg" title="Add profile picture">📷<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handlePhoto} disabled={uploadingPhoto} /></label></div>
            <div className="mt-2 text-xs text-slate-500">Optional · JPG, PNG or WebP · max 5 MB</div>{uploadingPhoto && <div className="mt-1 text-xs font-semibold text-indigo-600">Saving picture…</div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Priya Sharma" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Date of Birth *</label><input type="date" name="dob" value={formData.dob || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1">Age *</label><input type="number" name="age" min="10" max="120" value={age || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Your age" /></div>
            {formData.profileType === 'student' ? <>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Current Grade / Class *</label><input type="text" name="grade" value={formData.grade || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Class 11 / B.Sc. Year 1" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">School / College / University</label><input type="text" name="schoolName" value={formData.schoolName || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Optional for independent students" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Your Contact Number <span className="font-normal text-slate-400">(optional)</span></label><input type="tel" name="contactNumber" value={formData.contactNumber || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="+91…" /></div>
              {guardianRequired && <><div><label className="block text-sm font-semibold text-slate-700 mb-1">Parent / Guardian Name *</label><input type="text" name="parentName" value={formData.parentName || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Ramesh Sharma" /></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">Parent / Guardian Contact *</label><input type="tel" name="parentContact" value={formData.parentContact || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="+91…" /></div></>}
            </> : <>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Current Organisation <span className="font-normal text-slate-400">(optional)</span></label><input type="text" name="institutionName" value={formData.institutionName || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Company / freelance / self-employed" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Professional Role / Title <span className="font-normal text-slate-400">(optional)</span></label><input type="text" name="professionalTitle" value={formData.professionalTitle || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Designer" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Your Contact Number *</label><input type="tel" name="contactNumber" value={formData.contactNumber || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="+91…" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Emergency Contact Name *</label><input type="text" name="emergencyContactName" value={formData.emergencyContactName || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="Someone we can contact in an emergency" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1">Emergency Contact Number *</label><input type="tel" name="emergencyContactNumber" value={formData.emergencyContactNumber || ''} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder="+91…" /></div>
            </>}
          </div>
          <p className="mt-5 text-xs leading-5 text-slate-500">We use these details to personalise your dashboard and, where relevant, support safe 1-to-1 services. We do not ask professionals for school or guardian information that does not apply to them.</p>
          <button type="submit" disabled={isSubmitting || uploadingPhoto} className={`w-full mt-5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg transition ${isSubmitting || uploadingPhoto ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}>{isSubmitting ? 'Saving Profile…' : 'Save & Continue 🚀'}</button>
        </form>
      </div>
    </div>
  );
};

export default UnifiedIntakeForm;
