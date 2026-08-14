import React, { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const initialForm = {
  status: '', fullName: '', dateOfBirth: '', gender: '', phone: '',
  emergencyContactName: '', emergencyContactPhone: '', institution: '',
  gradeOrCourse: '', occupation: '', educationLevel: '', city: '', primaryPath: '',
};

const routeForPath = (path) => path === 'career' ? '/dashboard/career' : path === 'wellbeing' ? '/dashboard/wellbeing' : path === 'sen' ? '/dashboard/sen' : '/dashboard';

const hasLegacyProfile = (data) => {
  const fullName = data.fullName || data.name;
  const dob = data.dateOfBirth || data.dob;
  const phone = data.phone || data.contactNumber;
  const emergencyPhone = data.emergencyContactPhone;
  const status = data.status || data.userType;
  const institution = data.institution || data.school;
  const gradeOrCourse = data.gradeOrCourse || data.grade || data.course;
  const occupation = data.occupation;

  if (!fullName || !dob || !phone || !emergencyPhone) return false;
  if (status === 'student') return Boolean(institution && gradeOrCourse);
  if (status === 'professional') return Boolean(occupation);
  return false;
};

const OnboardingGateway = ({ navigate }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    let cancelled = false;
    const loadProfile = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) { if (!cancelled) setLoading(false); return; }

        const data = snap.data();
        const completed = data.onboardingCompleted === true;
        const existingPath = data.primary_path || data.primaryPath || '';

        // Completed onboarding: leave immediately. Do not render the form.
        if (completed) {
          if (existingPath) navigate(routeForPath(existingPath));
          else navigate('/');
          return;
        }

        // Migration safeguard for legacy accounts. We save the completion flag
        // and then stop rendering this gateway. This avoids the old profile
        // fields being interpreted as an invitation to show onboarding again.
        if (hasLegacyProfile(data)) {
          try {
            await setDoc(ref, {
              onboardingCompleted: true,
              onboardingCompletedAt: data.onboardingCompletedAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          } catch (migrationError) {
            // A migrated account still should not be blocked by the onboarding UI.
            console.warn('Could not persist legacy onboarding completion:', migrationError?.message || migrationError);
          }
          if (existingPath) navigate(routeForPath(existingPath));
          else navigate('/dashboard');
          return;
        }

        if (cancelled) return;
        setForm({
          status: data.status || data.userType || '',
          fullName: data.fullName || data.name || user.displayName || '',
          dateOfBirth: data.dateOfBirth || data.dob || '',
          gender: data.gender || '',
          phone: data.phone || data.contactNumber || user.phoneNumber || '',
          emergencyContactName: data.emergencyContactName || '',
          emergencyContactPhone: data.emergencyContactPhone || '',
          institution: data.institution || data.school || '',
          gradeOrCourse: data.gradeOrCourse || data.grade || data.course || '',
          occupation: data.occupation || '',
          educationLevel: data.educationLevel || '',
          city: data.city || '',
          primaryPath: existingPath,
        });
      } catch (error) {
        console.error('Unable to load onboarding profile:', error);
        if (!cancelled) setErrorMsg('We could not load your profile. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadProfile();
    return () => { cancelled = true; };
  }, [user, navigate]);

  const statusFields = useMemo(() => form.status === 'student' ? ['institution', 'gradeOrCourse'] : ['occupation', 'educationLevel'], [form.status]);
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg('');
    if (!user) { setErrorMsg('Please sign in again.'); return; }
    if (!form.status || !form.fullName || !form.dateOfBirth || !form.phone || !form.emergencyContactPhone) {
      setErrorMsg('Please complete your status, name, date of birth, contact number and emergency contact number.'); return;
    }
    if (form.status === 'student' && (!form.institution || !form.gradeOrCourse)) {
      setErrorMsg('Please add your school/college and current grade/course.'); return;
    }
    if (form.status === 'professional' && !form.occupation) {
      setErrorMsg('Please add your current occupation.'); return;
    }
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        status: form.status, userType: form.status,
        fullName: form.fullName.trim(), name: form.fullName.trim(),
        dateOfBirth: form.dateOfBirth, dob: form.dateOfBirth,
        gender: form.gender || null, phone: form.phone.trim(), contactNumber: form.phone.trim(),
        emergencyContactName: form.emergencyContactName.trim() || null,
        emergencyContactPhone: form.emergencyContactPhone.trim(),
        institution: form.status === 'student' ? form.institution.trim() : null,
        school: form.status === 'student' ? form.institution.trim() : null,
        gradeOrCourse: form.gradeOrCourse.trim() || null,
        occupation: form.status === 'professional' ? form.occupation.trim() : null,
        educationLevel: form.educationLevel.trim() || null,
        city: form.city.trim() || null,
        primary_path: form.primaryPath || null,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
        profileChangeRequested: false,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      navigate(form.primaryPath ? routeForPath(form.primaryPath) : '/dashboard');
    } catch (error) {
      console.error('Failed to save onboarding profile:', error);
      setErrorMsg('We could not save your details. Please try again.');
    } finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">Loading your profile…</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <form onSubmit={handleSubmit} className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-6 md:p-10">
        <div className="mb-8"><div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">First-time setup</div><h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Let’s get to know you.</h1><p className="text-gray-600">This helps us personalise Secret Sharz for you. You only need to complete this once.</p></div>
        {errorMsg && <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 p-4">{errorMsg}</div>}
        <div className="mb-8"><label className="block font-bold text-gray-800 mb-3">What best describes you?</label><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[['student','I am studying','School, college or university'],['professional','I am working','Working professional / self-employed']].map(([value,title,subtitle]) => <button type="button" key={value} onClick={() => update('status',value)} className={`text-left rounded-2xl border-2 p-5 transition ${form.status===value?'border-emerald-500 bg-emerald-50':'border-gray-200 hover:border-emerald-200'}`}><div className="font-bold text-lg text-gray-900">{title}</div><div className="text-sm text-gray-500 mt-1">{subtitle}</div></button>)}
        </div></div>
        <div className="grid md:grid-cols-2 gap-5">
          <label className="block"><span className="font-semibold text-gray-700">Full name *</span><input required value={form.fullName} onChange={e=>update('fullName',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3" /></label>
          <label className="block"><span className="font-semibold text-gray-700">Date of birth *</span><input required type="date" value={form.dateOfBirth} onChange={e=>update('dateOfBirth',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3" /></label>
          <label className="block"><span className="font-semibold text-gray-700">Gender</span><select value={form.gender} onChange={e=>update('gender',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3"><option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Other</option></select></label>
          <label className="block"><span className="font-semibold text-gray-700">Contact number *</span><input required type="tel" value={form.phone} onChange={e=>update('phone',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3" /></label>
          <label className="block"><span className="font-semibold text-gray-700">Emergency contact name</span><input value={form.emergencyContactName} onChange={e=>update('emergencyContactName',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3" /></label>
          <label className="block"><span className="font-semibold text-gray-700">Emergency contact number *</span><input required type="tel" value={form.emergencyContactPhone} onChange={e=>update('emergencyContactPhone',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3" /></label>
          <label className="block"><span className="font-semibold text-gray-700">City</span><input value={form.city} onChange={e=>update('city',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3" /></label>
          {statusFields.map(field => field==='institution'?<label key={field} className="block"><span className="font-semibold text-gray-700">School / College *</span><input required value={form.institution} onChange={e=>update('institution',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3" /></label>:field==='gradeOrCourse'?<label key={field} className="block"><span className="font-semibold text-gray-700">Grade / Course *</span><input required value={form.gradeOrCourse} onChange={e=>update('gradeOrCourse',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3" /></label>:field==='occupation'?<label key={field} className="block"><span className="font-semibold text-gray-700">Current occupation *</span><input required value={form.occupation} onChange={e=>update('occupation',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3" placeholder="e.g. Software Engineer" /></label>:<label key={field} className="block"><span className="font-semibold text-gray-700">Highest education level</span><input value={form.educationLevel} onChange={e=>update('educationLevel',e.target.value)} className="mt-2 w-full rounded-xl border border-gray-300 p-3" /></label>)}
        </div>
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 text-sm text-gray-600">Your profile is saved after this step and this setup will not appear again. If your details change later, contact the Secret Sharz admin or your counsellor and they can update your profile.</div>
        <button disabled={saving} type="submit" className="mt-6 w-full rounded-2xl bg-emerald-600 text-white py-4 font-bold hover:bg-emerald-700 disabled:opacity-60">{saving?'Saving your profile…':'Save & Continue'}</button>
      </form>
    </div>
  );
};
export default OnboardingGateway;
