import React, { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../../firebase';
import { buildProfileRecord, deriveProfileType, requiresGuardian } from '../../platform/profileOnboardingModel';
import CountryPhoneField from './CountryPhoneField';

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

const EMPTY = {
  profileType: 'student', name: '', dob: '', age: '', grade: '', schoolName: '', institutionName: '', professionalTitle: '',
  parentName: '', parentContact: '', emergencyContactName: '', emergencyContactNumber: '', contactNumber: '', photoURL: '',
  contactCountryName: 'India', contactCountryCode: '91',
  parentCountryName: 'India', parentCountryCode: '91',
  emergencyCountryName: 'India', emergencyCountryCode: '91',
};

function stripCountryPrefix(value, code) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  const codeDigits = String(code || '').replace(/\D/g, '');
  if (codeDigits && digits.startsWith(codeDigits) && digits.length > 10) return digits.slice(codeDigits.length);
  return raw;
}

function isCompleteProfile(data) {
  const type = deriveProfileType({ profileType: data.profileType, role: data.role });
  const name = data.name || data.fullName;
  const dob = data.dob || data.dateOfBirth;
  const phone = data.contactNumber || data.phone;
  const emergency = data.emergencyContactNumber || data.emergencyContactPhone;
  const age = Number(data.age) || Number(calculateAge(dob));
  if (!name || !dob || !phone) return false;
  if (type === 'working_professional') return Boolean(emergency);
  if (!data.grade && !data.gradeOrCourse) return false;
  if (requiresGuardian({ profileType: type, age })) return Boolean(data.parentName && data.parentContact);
  return true;
}

const UnifiedIntakeForm = ({ onComplete, initialProfileType = null }) => {
  const [formData, setFormData] = useState({ ...EMPTY, profileType: initialProfileType || 'student' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function loadProfile() {
      const user = auth.currentUser;
      if (!user) { setIsLoading(false); return; }
      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (!snapshot.exists()) return;
        const saved = snapshot.data();
        const inferredType = deriveProfileType({ profileType: saved.profileType, role: saved.role || user?.role });
        const merged = {
          ...EMPTY,
          ...saved,
          profileType: inferredType,
          photoURL: saved.photoURL || user.photoURL || '',
          contactCountryName: saved.contactCountryName || 'India',
          contactCountryCode: saved.contactCountryCode || '91',
          parentCountryName: saved.parentCountryName || 'India',
          parentCountryCode: saved.parentCountryCode || '91',
          emergencyCountryName: saved.emergencyCountryName || 'India',
          emergencyCountryCode: saved.emergencyCountryCode || '91',
        };
        merged.contactNumber = stripCountryPrefix(merged.contactNumber || merged.phone, merged.contactCountryCode);
        merged.parentContact = stripCountryPrefix(merged.parentContact, merged.parentCountryCode);
        merged.emergencyContactNumber = stripCountryPrefix(merged.emergencyContactNumber, merged.emergencyCountryCode);
        if (cancelled) return;
        setFormData(merged);
        if (saved.profileComplete === true || saved.onboardingCompleted === true || isCompleteProfile(merged)) {
          try {
            await setDoc(doc(db, 'users', user.uid), {
              profileComplete: true,
              onboardingCompleted: true,
              onboardingCompletedAt: saved.onboardingCompletedAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          } catch (migrationError) {
            console.warn('Profile migration write failed; closing completed onboarding locally.', migrationError);
          }
          if (!cancelled) onComplete?.(merged);
        }
      } catch (loadError) {
        console.error('Error loading profile:', loadError);
        if (!cancelled) setError('We could not load your saved profile. Please try again.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    loadProfile();
    return () => { cancelled = true; };
  }, [onComplete]);

  const age = useMemo(() => Number(formData.age) || Number(calculateAge(formData.dob)) || '', [formData.age, formData.dob]);
  const guardianRequired = requiresGuardian({ profileType: formData.profileType, age });
  const update = (name, value) => { setFormData(current => ({ ...current, [name]: value, ...(name === 'dob' ? { age: calculateAge(value) } : {}) })); setError(''); };
  const handleTypeChange = (type) => { setFormData(current => ({ ...current, profileType: type })); setError(''); };
  const updateCountry = (prefix, country) => {
    setFormData(current => ({
      ...current,
      [`${prefix}CountryName`]: country.name,
      [`${prefix}CountryCode`]: country.code,
    }));
  };

  const handlePhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Please choose an image file.');
    if (file.size > 5 * 1024 * 1024) return setError('Please choose an image smaller than 5 MB.');
    const user = auth.currentUser;
    if (!user) return setError('Please sign in again before adding a profile picture.');
    setUploadingPhoto(true); setError('');
    try {
      const storageRef = ref(storage, `users/${user.uid}/profile/profile-picture`);
      await uploadBytes(storageRef, file, { contentType: file.type, cacheControl: 'public,max-age=3600' });
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL });
      await setDoc(doc(db, 'users', user.uid), { photoURL, updatedAt: new Date().toISOString() }, { merge: true });
      setFormData(current => ({ ...current, photoURL }));
    } catch (uploadError) {
      console.error('Profile picture upload failed:', uploadError);
      setError('We could not save that picture. Please try again.');
    } finally { setUploadingPhoto(false); }
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) return setError('Please sign in again.');
    if (!formData.name || !formData.dob || !formData.contactNumber) return setError('Please complete your name, date of birth and contact number.');
    if (formData.profileType === 'student' && !formData.grade) return setError('Please add your current grade or course.');
    if (formData.profileType === 'working_professional' && !formData.emergencyContactNumber) return setError('Please add an emergency contact number.');
    if (guardianRequired && (!formData.parentName || !formData.parentContact)) return setError('Please add the parent/guardian details required for your age.');
    setIsSubmitting(true); setError('');
    try {
      const contactNumber = stripCountryPrefix(formData.contactNumber, formData.contactCountryCode).trim();
      const parentContact = stripCountryPrefix(formData.parentContact, formData.parentCountryCode).trim();
      const emergencyContactNumber = stripCountryPrefix(formData.emergencyContactNumber, formData.emergencyCountryCode).trim();
      const record = buildProfileRecord({ ...formData, age, contactNumber, parentContact, emergencyContactNumber });
      const profile = {
        ...record,
        profileType: formData.profileType,
        name: formData.name.trim(),
        fullName: formData.name.trim(),
        dob: formData.dob,
        dateOfBirth: formData.dob,
        age,
        contactNumber,
        contactCountryName: formData.contactCountryName,
        contactCountryCode: formData.contactCountryCode,
        contactNumberInternational: contactNumber ? `+${formData.contactCountryCode} ${contactNumber}` : '',
        parentContact: parentContact || null,
        parentCountryName: formData.parentCountryName,
        parentCountryCode: formData.parentCountryCode,
        parentContactInternational: parentContact ? `+${formData.parentCountryCode} ${parentContact}` : '',
        emergencyContactNumber: emergencyContactNumber || null,
        emergencyContactName: formData.emergencyContactName.trim() || null,
        emergencyCountryName: formData.emergencyCountryName,
        emergencyCountryCode: formData.emergencyCountryCode,
        emergencyContactInternational: emergencyContactNumber ? `+${formData.emergencyCountryCode} ${emergencyContactNumber}` : '',
        profileComplete: true,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
        photoURL: formData.photoURL || user.photoURL || '',
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
      await updateProfile(user, { displayName: profile.name, ...(profile.photoURL ? { photoURL: profile.photoURL } : {}) });
      onComplete?.(profile);
    } catch (saveError) {
      console.error('Error saving profile:', saveError);
      setError(saveError.message || 'Failed to save profile. Please try again.');
    } finally { setIsSubmitting(false); }
  };

  if (isLoading) return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"><div className="rounded-3xl bg-white px-8 py-7 shadow-2xl font-semibold text-slate-700">Loading your saved profile…</div></div>;

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"><div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl relative overflow-y-auto max-h-[92vh]">
    <div className="border-b border-slate-100 px-6 sm:px-8 pt-6 pb-4 text-center"><h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Welcome to Secret Sharz! 🎉</h2><p className="text-slate-500 font-medium mt-1">Just a few details so we can personalise your experience.</p></div>
    <form onSubmit={handleSaveProfile} className="p-6 sm:p-8">
      {error && <div className="mb-5 p-3.5 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm font-semibold">{error}</div>}
      <div className="mb-7 rounded-2xl bg-slate-50 p-4 sm:p-5"><label className="block text-sm font-bold text-slate-700 mb-3">How would you describe yourself?</label><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button type="button" onClick={() => handleTypeChange('student')} className={`rounded-2xl border-2 p-4 text-left transition ${formData.profileType === 'student' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}><div className="text-2xl">🎓</div><div className="font-bold text-slate-800 mt-1">Student</div><div className="text-xs text-slate-500 mt-1">School, college or university</div></button>
        <button type="button" onClick={() => handleTypeChange('working_professional')} className={`rounded-2xl border-2 p-4 text-left transition ${formData.profileType === 'working_professional' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-white'}`}><div className="text-2xl">💼</div><div className="font-bold text-slate-800 mt-1">Working Professional</div><div className="text-xs text-slate-500 mt-1">Working, self-employed or between roles</div></button>
      </div></div>
      <div className="flex flex-col items-center mb-7"><div className="relative"><div className="h-24 w-24 rounded-full overflow-hidden bg-indigo-100 border-4 border-white shadow ring-1 ring-slate-200 flex items-center justify-center text-3xl">{formData.photoURL ? <img src={formData.photoURL} alt="Profile preview" className="h-full w-full object-cover" /> : '👤'}</div><label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-indigo-600 px-2.5 py-2 text-white shadow-lg">📷<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handlePhoto} disabled={uploadingPhoto} /></label></div><div className="mt-2 text-xs text-slate-500">Optional · JPG, PNG or WebP · max 5 MB</div></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Full Name *" value={formData.name} onChange={v => update('name', v)} placeholder="e.g. Priya Sharma" />
        <Field label="Date of Birth *" type="date" value={formData.dob} onChange={v => update('dob', v)} />
        <Field label="Age" type="number" value={age} onChange={v => update('age', v)} />
        <CountryPhoneField label="Your Contact Number" required value={formData.contactNumber} onChange={v => update('contactNumber', v)} countryName={formData.contactCountryName} countryCode={formData.contactCountryCode} onCountryChange={c => updateCountry('contact', c)} placeholder="98765 43210" />
        {formData.profileType === 'student' ? <>
          <Field label="Current Grade / Class *" value={formData.grade} onChange={v => update('grade', v)} placeholder="e.g. Class 11 / B.Sc. Year 1" />
          <Field label="School / College / University" value={formData.schoolName} onChange={v => update('schoolName', v)} placeholder="Optional" />
          {guardianRequired && <>
            <Field label="Parent / Guardian Name *" value={formData.parentName} onChange={v => update('parentName', v)} />
            <CountryPhoneField label="Parent / Guardian Contact" required value={formData.parentContact} onChange={v => update('parentContact', v)} countryName={formData.parentCountryName} countryCode={formData.parentCountryCode} onCountryChange={c => updateCountry('parent', c)} placeholder="98765 43210" />
          </>}
        </> : <>
          <Field label="Current Organisation" value={formData.institutionName} onChange={v => update('institutionName', v)} placeholder="Company / freelance / self-employed" />
          <Field label="Professional Role / Title" value={formData.professionalTitle} onChange={v => update('professionalTitle', v)} placeholder="e.g. Designer" />
          <Field label="Emergency Contact Name" value={formData.emergencyContactName} onChange={v => update('emergencyContactName', v)} />
          <CountryPhoneField label="Emergency Contact Number" required value={formData.emergencyContactNumber} onChange={v => update('emergencyContactNumber', v)} countryName={formData.emergencyCountryName} countryCode={formData.emergencyCountryCode} onCountryChange={c => updateCountry('emergency', c)} placeholder="98765 43210" />
        </>}
      </div>
      <p className="mt-5 text-xs leading-5 text-slate-500">Your details are saved once. Country name and calling code are stored separately from the local phone number so the platform can support clients internationally.</p>
      <button type="submit" disabled={isSubmitting || uploadingPhoto} className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg disabled:opacity-60">{isSubmitting ? 'Saving Profile…' : 'Save & Continue 🚀'}</button>
    </form>
  </div></div>;
};

function Field({ label, value, onChange, type = 'text', placeholder = '' }) { return <label className="block"><span className="block text-sm font-semibold text-slate-700 mb-1">{label}</span><input required={label.includes('*')} type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" placeholder={placeholder} /></label>; }

export default UnifiedIntakeForm;