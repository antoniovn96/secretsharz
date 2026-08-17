import React, { useEffect, useRef, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

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
  const routingRef = useRef(false);

  // Returning clients should never be forced through the service-selection
  // gateway again. The selected service is persisted in Firestore as
  // primary_path; studentTrack is retained as a legacy fallback.
  useEffect(() => {
    let cancelled = false;

    const restoreSavedPath = async () => {
      const user = auth.currentUser;
      if (!user) {
        if (!cancelled) setIsCheckingSavedPath(false);
        return;
      }

      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (!snapshot.exists()) return;

        const data = snapshot.data() || {};
        const savedPath = data.primary_path || data.studentTrack;
        const targetPath = SAVED_PATHS[savedPath];

        if (!cancelled && targetPath && targetPath !== window.location.pathname && !routingRef.current) {
          routingRef.current = true;
          console.log('[ROUTING] Returning client detected. Restoring saved path:', savedPath);
          // The app now has a global Suspense boundary, so restore the saved
          // workspace through the existing SPA router. Avoid window.location
          // replacement here: a hard reload remounts this gateway and can cause
          // repeated /dashboard -> saved-path cycles before the parent router
          // settles. navigate() updates App.currentPath synchronously.
          navigate(targetPath);
          return;
        }
      } catch (error) {
        console.error('[ROUTING] Failed to restore saved client path:', error);
      } finally {
        if (!cancelled) setIsCheckingSavedPath(false);
      }
    };

    restoreSavedPath();
    return () => { cancelled = true; };
    // This check intentionally runs once when the gateway mounts. The parent
    // router recreates navigate() on state changes; including it here would
    // repeatedly re-query Firestore for clients without a saved path.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDivisionSelect = async (divisionName) => {
    if (isRouting) return;

    setIsRouting(true);
    setRoutingState(divisionName);
    setErrorMsg('');

    let pathCode = 'wellbeing';
    if (divisionName === 'Learning Support') pathCode = 'sen';
    if (divisionName === 'Career Planning') pathCode = 'career';

    const user = auth.currentUser;
    if (!user) {
      console.error('No user ID found');
      setErrorMsg('No logged in user found.');
      setIsRouting(false);
      setRoutingState(null);
      return;
    }

    try {
      console.log(`Writing path ${pathCode} to Firestore for user ${user.uid}...`);
      await setDoc(doc(db, 'users', user.uid), {
        primary_path: pathCode,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      console.log(`Firestore write successful. Navigating to /dashboard/${pathCode}...`);
      navigate(`/dashboard/${pathCode}`);
    } catch (error) {
      console.error('Firebase update failed: ', error);
      setErrorMsg('Failed to route. Please try again.');
      setRoutingState(null);
      setIsRouting(false);
    }
  };

  if (isCheckingSavedPath) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">✨</div>
          <p className="text-lg font-semibold text-slate-700">Taking you to your space…</p>
          <p className="text-sm text-slate-500 mt-1">Checking your saved preferences.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative">
      {routingState && !errorMsg && (
        <div className="absolute top-8 right-8 bg-green-100 text-green-800 px-6 py-3 rounded-lg shadow-md font-medium animate-pulse border border-green-200">
          {isRouting ? 'Loading...' : `Routing to ${routingState}...`}
        </div>
      )}

      {errorMsg && (
        <div className="absolute top-8 right-8 bg-red-100 text-red-800 px-6 py-3 rounded-lg shadow-md font-medium border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Welcome to Secret Sharz.
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            How can we support you today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div
            onClick={() => handleDivisionSelect('Emotional Wellbeing')}
            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-100 flex flex-col items-center text-center transform hover:-translate-y-1"
          >
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🧠</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Emotional Wellbeing</h2>
            <p className="text-sm text-gray-500 font-medium">Counselling & Therapy</p>
          </div>

          <div
            onClick={() => handleDivisionSelect('Learning Support')}
            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-teal-100 flex flex-col items-center text-center transform hover:-translate-y-1"
          >
            <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">📚</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Learning Support</h2>
            <p className="text-sm text-gray-500 font-medium">SEN & Accommodations</p>
          </div>

          <div
            onClick={() => handleDivisionSelect('Career Planning')}
            className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-amber-100 flex flex-col items-center text-center transform hover:-translate-y-1"
          >
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">🚀</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Career Planning</h2>
            <p className="text-sm text-gray-500 font-medium">VidyaVantage & College Prep</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGateway;
