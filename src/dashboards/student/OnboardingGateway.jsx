import React, { useEffect, useRef, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../../firebase';
import InstitutionDashboard from '../institution/InstitutionDashboard';
import StudentOnboardingWizard from '../../components/onboarding/StudentOnboardingWizard';
import { getOnboardingRoute } from '../../platform/onboardingGateway';

const SAVED_PATHS = {
  career: '/dashboard/career',
  career_guidance: '/dashboard/career',
  counselling: '/dashboard/wellbeing',
  counselling_psychology: '/dashboard/wellbeing',
  wellbeing: '/dashboard/wellbeing',
  sen: '/dashboard/sen',
  learning_support: '/dashboard/sen',
};

const OnboardingGateway = ({ navigate }) => {
  const [routingState, setRoutingState] = useState(null);
  const [isRouting, setIsRouting] = useState(false);
  const [isCheckingSavedPath, setIsCheckingSavedPath] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [institutionUserData, setInstitutionUserData] = useState(null);
  const [studentState, setStudentState] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const routingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const restoreAndResolve = async () => {
      const user = auth.currentUser;
      if (!user) {
        if (!cancelled) setIsCheckingSavedPath(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (!snapshot.exists()) {
          if (!cancelled) {
            setStudentState(getOnboardingRoute({ rawStudent: null }));
            setStudentProfile(null);
          }
          return;
        }

        const data = snapshot.data() || {};

        if (data.role === 'institution_member' && data.institutionRole === 'coordinator') {
          if (!cancelled) setInstitutionUserData(data);
          return;
        }

        const route = getOnboardingRoute({
          rawStudent: { id: snapshot.id, ...data },
          isInstitutionProvisioned: Boolean(data.institutionId || data.institutionID),
        });

        if (route.state === 'complete') {
          const savedPath = data.primary_path || data.studentTrack;
          const targetPath = SAVED_PATHS[savedPath];
          if (!cancelled && targetPath && targetPath !== window.location.pathname && !routingRef.current) {
            routingRef.current = true;
            setRoutingState(savedPath);
            navigate(targetPath);
            return;
          }
        }

        if (!cancelled) {
          setStudentState(route);
          setStudentProfile(data.studentProfile || data);
        }
      } catch (error) {
        console.error('[ONBOARDING] Failed to resolve student onboarding state:', error);
        if (!cancelled) setErrorMsg('We could not restore your profile. Please try again.');
      } finally {
        if (!cancelled) setIsCheckingSavedPath(false);
      }
    };

    restoreAndResolve();
    return () => { cancelled = true; };
  }, [navigate]);

  const handleMigration = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('No logged in user found.');
    const token = await user.getIdToken();
    const response = await fetch('/api/student/migrate-profile', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: user.uid }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Unable to migrate your profile.');
    return payload.studentProfile;
  };

  const handleOnboardingReady = async () => {
    setIsRouting(true);
    setErrorMsg('');
    try {
      let profile = studentProfile || {};
      if (studentState?.needsMigration) {
        profile = await handleMigration();
      }
      setStudentProfile(profile);
      setStudentState(previous => ({ ...(previous || {}), state: 'resume', needsMigration: false }));
    } catch (error) {
      console.error('[ONBOARDING] Migration failed:', error);
      setErrorMsg(error.message || 'We could not prepare your profile. Please try again.');
    } finally {
      setIsRouting(false);
    }
  };

  const handleComplete = async (profile) => {
    const selected = Object.entries(profile?.studentProfile?.services || {})
      .filter(([, value]) => value?.status === 'active' || value === true)
      .map(([key]) => key);
    const target = selected.includes('career') ? '/dashboard/career' : selected.includes('wellbeing') ? '/dashboard/wellbeing' : selected.includes('sen') ? '/dashboard/sen' : '/dashboard';
    navigate(target);
  };

  const handleDivisionSelect = async (divisionName) => {
    if (isRouting) return;
    setIsRouting(true); setRoutingState(divisionName); setErrorMsg('');
    let pathCode = 'wellbeing';
    if (divisionName === 'Learning Support') pathCode = 'sen';
    if (divisionName === 'Career Planning') pathCode = 'career';
    const user = auth.currentUser;
    if (!user) { setErrorMsg('No logged in user found.'); setIsRouting(false); setRoutingState(null); return; }
    try {
      await setDoc(doc(db, 'users', user.uid), { primary_path: pathCode, updatedAt: new Date().toISOString() }, { merge: true });
      navigate(`/dashboard/${pathCode}`);
    } catch (error) {
      console.error('Firebase update failed: ', error);
      setErrorMsg('Failed to route. Please try again.'); setRoutingState(null); setIsRouting(false);
    }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  if (isCheckingSavedPath) return <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6"><div className="text-center"><div className="text-4xl mb-4">✨</div><p className="text-lg font-semibold text-slate-700">Restoring your Secret Sharz profile…</p><p className="text-sm text-slate-500 mt-1">Checking what information we already have.</p></div></div>;

  if (institutionUserData) return <InstitutionDashboard currentUser={auth.currentUser} userData={institutionUserData} onBack={() => navigate('/')} onLogout={handleLogout} />;

  if (errorMsg && !studentState) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="max-w-lg rounded-2xl bg-white p-8 shadow-xl text-center"><div className="text-4xl mb-3">⚠️</div><h1 className="text-xl font-bold text-slate-900">We couldn't restore your profile</h1><p className="text-slate-600 mt-2">{errorMsg}</p><button className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-white font-bold" onClick={() => window.location.reload()}>Try again</button></div></div>;

  if (studentState?.state === 'migrate') {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="max-w-xl w-full rounded-3xl bg-white shadow-2xl p-8"><div className="text-4xl mb-4">✨</div><h1 className="text-3xl font-extrabold text-slate-900">Let's update your Secret Sharz profile</h1><p className="text-slate-600 mt-3 leading-7">We found information from your earlier profile. We'll preserve it and only ask you for details that are missing.</p>{errorMsg && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{errorMsg}</div>}<button disabled={isRouting} onClick={handleOnboardingReady} className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-white font-bold">{isRouting ? 'Preparing your profile…' : 'Continue →'}</button></div></div>;
  }

  if (studentState?.state === 'new' || studentState?.state === 'resume' || (studentState && studentState.state !== 'complete')) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><StudentOnboardingWizard initialProfile={studentProfile || {}} institutionProvisioned={Boolean(studentState?.route === 'student-onboarding' && studentProfile?.institutionId)} onComplete={handleComplete} /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      {routingState && !errorMsg && <div className="absolute top-8 right-8 bg-green-100 text-green-800 px-6 py-3 rounded-lg shadow-md font-medium animate-pulse border border-green-200">{isRouting ? 'Loading...' : `Routing to ${routingState}...`}</div>}
      {errorMsg && <div className="absolute top-8 right-8 bg-red-100 text-red-800 px-6 py-3 rounded-lg shadow-md font-medium border border-red-200">{errorMsg}</div>}
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12"><h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Welcome to Secret Sharz.</h1><p className="text-xl text-gray-600 font-medium">How can we support you today?</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div onClick={() => handleDivisionSelect('Emotional Wellbeing')} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-100 flex flex-col items-center text-center transform hover:-translate-y-1"><div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🧠</div><h2 className="text-xl font-bold text-gray-800 mb-2">Emotional Wellbeing</h2><p className="text-sm text-gray-500 font-medium">Counselling & Therapy</p></div>
          <div onClick={() => handleDivisionSelect('Learning Support')} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-teal-100 flex flex-col items-center text-center transform hover:-translate-y-1"><div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">📚</div><h2 className="text-xl font-bold text-gray-800 mb-2">Learning Support</h2><p className="text-sm text-gray-500 font-medium">SEN & Accommodations</p></div>
          <div onClick={() => handleDivisionSelect('Career Planning')} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-amber-100 flex flex-col items-center text-center transform hover:-translate-y-1"><div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🚀</div><h2 className="text-xl font-bold text-gray-800 mb-2">Career Planning</h2><p className="text-sm text-gray-500 font-medium">VidyaVantage & College Prep</p></div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGateway;
