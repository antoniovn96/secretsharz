import React, { useEffect, useState, startTransition } from 'react';
import SecretSharzApp from '../src/App';
import FoundationHomepage from '../src/FoundationHomepage';
import FrontDoorExperienceV2 from '../src/FrontDoorExperienceV2';
import JourneyBridge from '../src/JourneyBridge';
import LiveYouTubeSection from '../src/LiveYouTubeSection';
import VideoLibraryPage from '../src/VideoLibraryPage';
import SupportHub from '../src/SupportHub';
import WayfinderPage from '../src/WayfinderPage';
import SuperAdminView from '../src/dashboards/admin/SuperAdminView';
import OnboardingGateway from '../src/dashboards/student/OnboardingGateway';
import CareerStudentView from '../src/dashboards/student/CareerStudentView';
import PsychStudentView from '../src/dashboards/student/PsychStudentView';
import SENStudentView from '../src/dashboards/student/SENStudentView';
import ParentPortalView from '../src/dashboards/parent/ParentPortalView';
import InstitutionCareerDashboard from '../src/institution/InstitutionCareerDashboard';
import InstitutionServiceDashboard from '../src/institution/InstitutionServiceDashboard';
import Header from '../src/Header';
import Footer from '../src/Footer';
import AccountConsentGate from '../src/components/consent/AccountConsentGate';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, doc, getDocs, getDoc, limit, query, where } from 'firebase/firestore';
import { auth, db } from '../src/firebase';

const MASTER_EMAIL = 'antonio.antonio.noronha@gmail.com';

function usePathname() {
  const [path, setPath] = useState('/');
  useEffect(() => { const sync=()=>setPath(window.location.pathname); sync(); window.addEventListener('popstate',sync); return()=>window.removeEventListener('popstate',sync); }, []);
  return path;
}

async function hasAccountConsent(uid) {
  const consentQuery=query(collection(db,'consentEvents'),where('userId','==',uid),limit(100));
  const snapshot=await getDocs(consentQuery);
  return snapshot.docs.some(item=>{const data=item.data();return data.type==='account_privacy'&&data.action==='granted'&&data.policyVersion==='1.0.0';});
}

export default function IndexPage() {
  const path=usePathname();
  const [currentUser,setCurrentUser]=useState(null);
  const [userData,setUserData]=useState(null);
  const [authReady,setAuthReady]=useState(false);
  const [consentChecked,setConsentChecked]=useState(false);
  const [accountConsent,setAccountConsent]=useState(false);

  useEffect(()=>{
    let cancelled=false;
    const unsubscribe=onAuthStateChanged(auth,async user=>{
      if(cancelled)return;
      setCurrentUser(user||null);setConsentChecked(false);setAuthReady(false);
      if(!user){setUserData(null);setAccountConsent(false);setConsentChecked(true);setAuthReady(true);return;}
      const isFounder=user.email?.toLowerCase()===MASTER_EMAIL;
      if(isFounder){setUserData(prev=>({...prev||{},role:'super_admin'}));setAccountConsent(true);setConsentChecked(true);setAuthReady(true);return;}
      try{const [profileSnapshot,consentGranted]=await Promise.all([getDoc(doc(db,'users',user.uid)),hasAccountConsent(user.uid)]);if(cancelled)return;setUserData(profileSnapshot.exists()?profileSnapshot.data():null);setAccountConsent(consentGranted);}catch(_){if(cancelled)return;setUserData(null);setAccountConsent(false);}finally{if(!cancelled){setConsentChecked(true);setAuthReady(true);}}
    });
    return ()=>{cancelled=true;unsubscribe();};
  },[]);

  const navigate=nextPath=>{
    if(typeof window==='undefined'||window.location.pathname===nextPath)return;
    startTransition(()=>{
      window.history.pushState({},'',nextPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  };

  if(path!=='/'){
    const isFounder=currentUser?.email?.toLowerCase()===MASTER_EMAIL;
    const isAdmin=isFounder||userData?.role==='super_admin';
    const isParent=userData?.role==='parent';
    const isInstitutionCoordinator=userData?.role==='institution_member'&&userData?.institutionRole==='coordinator';

    // Do not route protected pages until Firebase Auth + the Firestore profile
    // have both resolved. This prevents the old role=undefined -> /dashboard
    // -> saved-path loop that caused returning students to bounce repeatedly.
    if(!authReady){
      return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><div className="text-center"><div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"/><p className="text-sm font-semibold text-slate-600">Restoring your secure session…</p></div></div>;
    }

    if(currentUser&&consentChecked&&!accountConsent&&!isFounder)return <AccountConsentGate user={currentUser} onAccepted={()=>setAccountConsent(true)} onDecline={async()=>{await signOut(auth);navigate('/');}}/>;

    // Professional service boundary: the outer router blocks cross-service
    // access before the legacy App router can mount another professional view.
    if(path.startsWith('/provider/career') && currentUser && !isAdmin && userData?.role!=='counsellor'){
      navigate('/dashboard');
      return null;
    }
    if(path.startsWith('/provider/psychologist') && currentUser && !isAdmin && userData?.role!=='psychologist'){
      navigate('/dashboard');
      return null;
    }
    if(path.startsWith('/provider/educator') && currentUser && !isAdmin && userData?.role!=='educator'){
      navigate('/dashboard');
      return null;
    }

    // Student dashboard ownership lives here. Do not fall through to the
    // legacy SecretSharzApp router for these paths; that second router was
    // racing the Firebase profile resolution and sending returning students
    // back through /dashboard.
    const privilegedRole=['super_admin','parent','institution_member','counsellor','psychologist','educator','career_counsellor'];
    const isStudentClient=currentUser&&!privilegedRole.includes(userData?.role||'');
    if(path.startsWith('/dashboard/career') && isStudentClient){
      return <CareerStudentView/>;
    }
    if(path.startsWith('/dashboard/wellbeing') && isStudentClient){
      return <PsychStudentView/>;
    }
    if(path.startsWith('/dashboard/sen') && isStudentClient){
      return <SENStudentView/>;
    }

    if(path==='/dashboard/institution/career'){
      if(!currentUser){navigate('/auth');return null;}
      if(!isInstitutionCoordinator&&!isFounder){navigate('/dashboard');return null;}
      return <InstitutionCareerDashboard/>;
    }

    if(path==='/dashboard/institution/wellbeing'||path==='/dashboard/institution/sen'){
      if(!currentUser){navigate('/auth');return null;}
      if(!isInstitutionCoordinator&&!isFounder){navigate('/dashboard');return null;}
      const service=path.endsWith('/sen')?'sen':'wellbeing';
      return <InstitutionServiceDashboard service={service}/>;
    }

    if(path==='/dashboard'){
      if(!currentUser){navigate('/auth');return null;}
      if(isAdmin){navigate('/dashboard/admin');return null;}
      if(isInstitutionCoordinator){navigate('/dashboard/institution/career');return null;}
      if(isParent)return <ParentPortalView userData={userData} currentUser={currentUser}/>;
      return <OnboardingGateway navigate={navigate}/>;
    }
    if(path==='/admin'||path==='/dashboard/admin'){
      if(!currentUser)return <SecretSharzApp/>;
      if(!isAdmin){navigate('/');return null;}
      return <SuperAdminView user={currentUser} userData={{...(userData||{}),role:'super_admin'}} onBackToApp={()=>navigate('/')}/>;
    }
    if(path==='/videos'){
      const handleLogout=async()=>{await signOut(auth);navigate('/')};
      return <><Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin}/><VideoLibraryPage navigate={navigate}/><Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={()=>{}}/></>;
    }
    if(path==='/support'){
      const handleLogout=async()=>{await signOut(auth);navigate('/')};
      return <><Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin}/><SupportHub navigate={navigate}/><Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={()=>{}}/></>;
    }
    if(path==='/start'){
      const handleLogout=async()=>{await signOut(auth);navigate('/')};
      return <><Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin}/><WayfinderPage navigate={navigate}/><Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={()=>{}}/></>;
    }
    return <SecretSharzApp/>;
  }

  const isAdmin=userData?.role==='super_admin'||currentUser?.email?.toLowerCase()===MASTER_EMAIL;const handleLogout=async()=>{await signOut(auth);navigate('/')};
  return <><Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin}/><FrontDoorExperienceV2 navigate={navigate} currentUser={currentUser}/><JourneyBridge navigate={navigate} currentUser={currentUser}/><FoundationHomepage navigate={navigate} currentUser={currentUser}/><LiveYouTubeSection navigate={navigate}/><style>{`.ss-foundation-page .ss-fh-video{display:none!important}`}</style><Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={()=>{}}/></>;
}