import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { auth, db } from './firebase';
import VidyaVantage from './VidyaVantage';
import AuthPage from './AuthPage';
import StudentDashboard from './StudentDashboard';
import MindSpace from './MindSpace'; 
import AdminDashboard from './AdminDashboard'; // 🔥 Admin Imported

// ── Secret Sharz homepage styles & data ──────────

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');`;

const CSS = `
  :root {
    --sage:#4A7C59;--sage-light:#6FAA80;--sage-pale:#EBF4EE;--moss:#2D5240;
    --lavender:#7C6FA0;--lav-pale:#F0EDF8;--peach:#E8845A;--peach-pale:#FDF0EA;
    --sky:#5B9EBF;--sky-pale:#EAF4FA;--sand:#F7F3ED;--warm-white:#FDFCFA;
    --ink:#1E2820;--ink-soft:#3D4A40;--muted:#7A8A7D;--border:rgba(74,124,89,0.15);
    --shadow-sm:0 2px 12px rgba(30,40,32,0.07);--shadow-md:0 8px 32px rgba(30,40,32,0.10);
    --shadow-lg:0 20px 60px rgba(30,40,32,0.13);
    --r-sm:14px;--r-md:22px;--r-lg:32px;--r-xl:48px;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--warm-white);color:var(--ink);line-height:1.6;overflow-x:hidden;}

  @keyframes floatUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes blob{0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 50%;}50%{border-radius:30% 70% 40% 60%/60% 30% 70% 40%;}}
  @keyframes pulse-ring{0%{transform:scale(1);opacity:0.6;}100%{transform:scale(1.5);opacity:0;}}

  .anim-up{animation:floatUp 0.7s ease both;}
  .anim-up-1{animation:floatUp 0.7s 0.1s ease both;}
  .anim-up-2{animation:floatUp 0.7s 0.2s ease both;}
  .anim-up-3{animation:floatUp 0.7s 0.35s ease both;}
  .anim-up-4{animation:floatUp 0.7s 0.5s ease both;}

  .ss-nav{position:sticky;top:0;z-index:200;padding:0 48px;height:70px;display:flex;align-items:center;justify-content:space-between;background:rgba(253,252,250,0.88);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);}
  .ss-nav-logo{font-family:'Fraunces',serif;font-size:24px;font-weight:700;color:var(--moss);letter-spacing:-0.5px;cursor:pointer;}
  .ss-nav-logo span{color:var(--sage-light);font-style:italic;}
  .ss-nav-links{display:flex;align-items:center;gap:32px;}
  .nav-link{font-size:14px;font-weight:500;color:var(--ink-soft);text-decoration:none;cursor:pointer;transition:color 0.2s;background:none;border:none;font-family:inherit;}
  .nav-link:hover{color:var(--sage);}
  .nav-cta{background:var(--sage);color:white;padding:10px 22px;border-radius:50px;font-size:14px;font-weight:600;border:none;cursor:pointer;font-family:inherit;transition:all 0.2s;box-shadow:0 4px 14px rgba(74,124,89,0.3);}
  .nav-cta:hover{background:var(--moss);transform:translateY(-1px);}
  .nav-cta-outline{background:transparent;color:var(--sage);border:2px solid var(--sage);padding:8px 20px;border-radius:50px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;}
  .nav-cta-outline:hover{background:var(--sage);color:white;}
  .nav-vv-link{display:flex;align-items:center;gap:8px;background:var(--lav-pale);color:var(--lavender);padding:8px 16px;border-radius:50px;font-size:13px;font-weight:600;border:1.5px solid rgba(124,111,160,0.2);cursor:pointer;font-family:inherit;transition:all 0.2s;}
  .nav-vv-link:hover{background:var(--lavender);color:white;}
  .nav-user-chip{display:flex;align-items:center;gap:8px;background:var(--sage-pale);border:1.5px solid rgba(74,124,89,0.2);color:var(--moss);padding:7px 16px;border-radius:50px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s;}
  .nav-user-chip:hover{background:var(--sage);color:white;}

  .ss-hero{min-height:92vh;display:flex;align-items:center;padding:80px 48px;position:relative;overflow:hidden;}
  .hero-bg-blob{position:absolute;border-radius:60% 40% 70% 30%/50% 60% 40% 50%;animation:blob 8s ease-in-out infinite;pointer-events:none;z-index:0;}
  .blob-1{width:500px;height:500px;background:radial-gradient(circle,rgba(74,124,89,0.08),transparent 70%);top:-100px;right:-100px;}
  .blob-2{width:350px;height:350px;background:radial-gradient(circle,rgba(124,111,160,0.07),transparent 70%);bottom:-50px;left:200px;animation-delay:-4s;}
  .blob-3{width:250px;height:250px;background:radial-gradient(circle,rgba(232,132,90,0.07),transparent 70%);top:40%;right:30%;animation-delay:-2s;}
  .hero-content{position:relative;z-index:1;max-width:680px;}
  .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:var(--sage-pale);border:1.5px solid rgba(74,124,89,0.2);color:var(--sage);padding:8px 18px;border-radius:50px;font-size:13px;font-weight:600;letter-spacing:0.3px;margin-bottom:28px;}
  .hero-eyebrow-dot{width:7px;height:7px;background:var(--sage);border-radius:50%;position:relative;}
  .hero-eyebrow-dot::after{content:'';position:absolute;inset:-3px;border:1.5px solid var(--sage);border-radius:50%;animation:pulse-ring 2s ease-out infinite;}
  .hero-h1{font-family:'Fraunces',serif;font-size:clamp(42px,6vw,72px);font-weight:700;line-height:1.08;color:var(--ink);letter-spacing:-1.5px;margin-bottom:24px;}
  .hero-h1 em{font-style:italic;color:var(--sage);}
  .hero-h1 .underline-word{position:relative;display:inline-block;}
  .hero-h1 .underline-word::after{content:'';position:absolute;bottom:4px;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--peach),var(--lavender));border-radius:2px;}
  .hero-p{font-size:18px;color:var(--muted);line-height:1.75;max-width:560px;margin-bottom:40px;font-weight:300;}
  .hero-actions{display:flex;gap:14px;flex-wrap:wrap;align-items:center;}
  .btn-primary{background:var(--sage);color:white;padding:16px 36px;border-radius:50px;font-size:16px;font-weight:600;border:none;cursor:pointer;font-family:inherit;box-shadow:0 8px 24px rgba(74,124,89,0.35);transition:all 0.25s;}
  .btn-primary:hover{background:var(--moss);transform:translateY(-2px);box-shadow:0 12px 32px rgba(74,124,89,0.4);}
  .btn-ghost{background:transparent;color:var(--ink-soft);padding:16px 28px;border-radius:50px;font-size:15px;font-weight:500;border:2px solid var(--border);cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;gap:8px;}
  .btn-ghost:hover{border-color:var(--sage);color:var(--sage);}

  .hero-right{position:absolute;right:48px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:16px;z-index:1;}
  .floating-card{background:white;border-radius:var(--r-md);padding:20px 24px;box-shadow:var(--shadow-md);border:1px solid var(--border);max-width:280px;animation:floatUp 0.8s ease both;}
  .floating-card:nth-child(2){animation-delay:0.2s;margin-left:24px;}
  .floating-card:nth-child(3){animation-delay:0.4s;}
  .fc-icon{font-size:28px;margin-bottom:10px;}
  .fc-label{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:4px;}
  .fc-value{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--ink);}
  .fc-sub{font-size:12px;color:var(--muted);margin-top:2px;}
  .fc-bar{height:4px;background:var(--sage-pale);border-radius:4px;margin-top:12px;overflow:hidden;}
  .fc-bar-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,var(--sage),var(--sage-light));}

  .trust-strip{display:flex;align-items:center;gap:28px;margin-top:48px;padding-top:28px;border-top:1px solid var(--border);flex-wrap:wrap;}
  .trust-item{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted);font-weight:500;}

  .section{padding:100px 48px;}
  .section-eyebrow{font-size:12px;font-weight:700;color:var(--sage);letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;}
  .section-h2{font-family:'Fraunces',serif;font-size:clamp(30px,4vw,46px);font-weight:700;color:var(--ink);line-height:1.15;letter-spacing:-0.5px;margin-bottom:16px;}
  .section-h2 em{font-style:italic;color:var(--sage);}
  .section-p{font-size:17px;color:var(--muted);line-height:1.75;font-weight:300;max-width:580px;}
  .section-header{max-width:700px;margin:0 auto 64px;text-align:center;}
  .section-header .section-p{margin:0 auto;}

  .pillars-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;max-width:1100px;margin:0 auto;}
  .pillar-card{background:white;border-radius:var(--r-md);padding:36px 32px;border:1.5px solid var(--border);box-shadow:var(--shadow-sm);transition:all 0.3s;position:relative;overflow:hidden;}
  .pillar-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;}
  .pillar-card.mind::before{background:linear-gradient(90deg,var(--lavender),#A89DD0);}
  .pillar-card.share::before{background:linear-gradient(90deg,var(--sage),var(--sage-light));}
  .pillar-card.guide::before{background:linear-gradient(90deg,var(--peach),#F0A97A);}
  .pillar-card.safe::before{background:linear-gradient(90deg,var(--sky),#89C4E0);}
  .pillar-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg);border-color:transparent;}
  .pillar-icon{width:56px;height:56px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:26px;margin-bottom:20px;}
  .mind .pillar-icon{background:var(--lav-pale);}
  .share .pillar-icon{background:var(--sage-pale);}
  .guide .pillar-icon{background:var(--peach-pale);}
  .safe .pillar-icon{background:var(--sky-pale);}
  .pillar-title{font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:var(--ink);margin-bottom:10px;}
  .pillar-desc{font-size:14px;color:var(--muted);line-height:1.7;}
  .pillar-features{margin-top:20px;display:flex;flex-direction:column;gap:6px;}
  .pillar-feat{font-size:13px;color:var(--ink-soft);font-weight:500;display:flex;align-items:center;gap:8px;}
  .pillar-feat::before{content:'→';color:var(--sage);font-weight:700;}

  .vv-banner{background:linear-gradient(135deg,#1C1208 0%,#2D1A05 50%,#0A2A1C 100%);border-radius:var(--r-xl);padding:64px 72px;display:flex;align-items:center;justify-content:space-between;gap:40px;max-width:1100px;margin:0 auto;position:relative;overflow:hidden;}
  .vv-banner::before{content:'';position:absolute;top:-60px;right:-60px;width:300px;height:300px;background:radial-gradient(circle,rgba(232,101,10,0.15),transparent 70%);}
  .vv-banner-left{position:relative;z-index:1;flex:1;}
  .vv-banner-tag{display:inline-block;background:rgba(232,101,10,0.15);color:#F0A500;border:1px solid rgba(232,101,10,0.25);padding:6px 16px;border-radius:30px;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:20px;}
  .vv-banner h3{font-family:'Fraunces',serif;font-size:clamp(26px,3.5vw,40px);font-weight:700;color:white;line-height:1.15;letter-spacing:-0.5px;margin-bottom:14px;}
  .vv-banner h3 em{font-style:italic;color:#F0A500;}
  .vv-banner p{font-size:16px;color:rgba(255,255,255,0.55);line-height:1.7;max-width:440px;font-weight:300;}
  .vv-banner-right{position:relative;z-index:1;flex-shrink:0;}
  .vv-banner-card{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:var(--r-md);padding:28px 32px;min-width:260px;}
  .vv-stat{text-align:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.07);}
  .vv-stat:last-child{border-bottom:none;}
  .vv-stat-num{font-family:'Fraunces',serif;font-size:32px;font-weight:700;color:#F0A500;}
  .vv-stat-label{font-size:12px;color:rgba(255,255,255,0.4);font-weight:500;margin-top:2px;}
  .btn-vv{display:inline-flex;align-items:center;gap:10px;margin-top:28px;background:linear-gradient(135deg,#E8650A,#F0A500);color:white;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:600;border:none;cursor:pointer;font-family:inherit;box-shadow:0 8px 24px rgba(232,101,10,0.4);transition:all 0.25s;}
  .btn-vv:hover{transform:translateY(-2px);}

  .safe-section{background:linear-gradient(135deg,var(--moss) 0%,#1E3D2A 100%);padding:100px 48px;text-align:center;position:relative;overflow:hidden;}
  .safe-content{position:relative;z-index:1;max-width:680px;margin:0 auto;}
  .safe-section .section-h2{color:white;}
  .safe-section .section-p{color:rgba(255,255,255,0.55);margin:0 auto 48px;}
  .safe-promises{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:40px;}
  .safe-promise{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:50px;padding:12px 22px;font-size:14px;font-weight:500;color:rgba(255,255,255,0.8);display:flex;align-items:center;gap:8px;}
  .crisis-box{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:var(--r-md);padding:28px 32px;display:flex;align-items:center;gap:20px;text-align:left;margin-top:24px;}
  .crisis-title{font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:white;margin-bottom:4px;}
  .crisis-desc{font-size:14px;color:rgba(255,255,255,0.5);line-height:1.5;}
  .crisis-number{font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:#6FAA80;margin-left:auto;flex-shrink:0;}

  .ss-footer{background:var(--ink);padding:64px 48px 40px;}
  .footer-top{display:flex;gap:80px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,0.07);flex-wrap:wrap;}
  .footer-logo{font-family:'Fraunces',serif;font-size:26px;font-weight:700;color:white;margin-bottom:12px;}
  .footer-logo span{color:var(--sage-light);font-style:italic;}
  .footer-tagline{font-size:14px;color:rgba(255,255,255,0.35);line-height:1.6;max-width:260px;}
  .footer-links-title{font-size:12px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:16px;}
  .footer-link{display:block;font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:10px;cursor:pointer;transition:color 0.2s;text-decoration:none;}
  .footer-link:hover{color:var(--sage-light);}
  .footer-bottom{padding-top:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;}
  .footer-copy{font-size:13px;color:rgba(255,255,255,0.25);}

  .modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(30,40,32,0.5);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease;}
  .modal{background:white;border-radius:var(--r-lg);padding:48px;max-width:520px;width:100%;box-shadow:var(--shadow-lg);animation:floatUp 0.3s ease;position:relative;}
  .modal-close{position:absolute;top:20px;right:20px;background:var(--sand);border:none;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);transition:all 0.2s;}
  .modal h3{font-family:'Fraunces',serif;font-size:26px;font-weight:700;color:var(--ink);margin-bottom:10px;}
  .modal p{font-size:15px;color:var(--muted);line-height:1.7;margin-bottom:24px;}
  .modal-actions{display:flex;gap:12px;margin-top:24px;}
  .btn-modal-primary{flex:1;padding:14px;background:var(--sage);color:white;border:none;border-radius:50px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;}
  .btn-modal-ghost{padding:14px 20px;background:transparent;color:var(--muted);border:2px solid var(--border);border-radius:50px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;}

  .vv-back-bar{background:var(--ink);padding:14px 32px;display:flex;align-items:center;gap:16px;}
  .vv-back-btn{background:rgba(255,255,255,0.1);color:white;border:none;padding:8px 20px;border-radius:30px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:8px;transition:all 0.2s;}
  .vv-back-btn:hover{background:rgba(255,255,255,0.2);}
  .vv-back-label{color:rgba(255,255,255,0.4);font-size:13px;}
  .vv-back-label span{color:#F0A500;font-weight:600;}

  @media(max-width:900px){
    .ss-nav{padding:0 20px;}
    .ss-nav-links{gap:12px;}
    .nav-link{display:none;}
    .ss-hero{padding:60px 24px;min-height:auto;}
    .hero-right{display:none;}
    .section{padding:64px 24px;}
    .vv-banner{flex-direction:column;padding:40px 28px;}
    .safe-section{padding:64px 24px;}
    .ss-footer{padding:48px 24px 28px;}
  }
`;

const PILLARS = [
  { cls:'mind', icon:'🧠', title:'Mind Space', desc:'A private sanctuary for your thoughts. Track your mood, journal freely, and access science-backed tools for anxiety, stress, and emotional wellbeing.', features:['Daily mood check-in & tracking','Guided journaling with AI prompts','Breathing & grounding exercises','Mental health resource library'] },
  { cls:'share', icon:'💬', title:'Sharz Wall', desc:"Share what's on your heart anonymously. Read stories from young people just like you. Know that you are never, ever alone in what you feel.", features:['100% anonymous sharing','Peer reactions & support','Moderated safe community','Themed support circles'] },
  { cls:'guide', icon:'🧭', title:'Life Guide', desc:"Navigate life's toughest decisions — from family pressure and friendships to career choices and your future — with guidance designed for young Indians.", features:['Career path discovery (VidyaVantage)','Life skills & decision tools','Peer mentor connections','Expert article library'] },
  { cls:'safe', icon:'🛡️', title:'Safe Corner', desc:"If things feel too heavy to carry, you don't have to carry them alone. Access trained counsellors, crisis support, and emergency helplines instantly.", features:['24/7 crisis helpline access','Connect with trained counsellors','Report unsafe situations privately','Parent & teacher guidance portal'] },
];

export default function App() {
  
  // URL HASH ROUTING: Check URL hash first to determine starting screen
  const [screen, setScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      return hash || 'home';
    }
    return 'home';
  });
  
  const [dashboardTab, setDashboardTab] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData]       = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [modal, setModal]             = useState(null); 

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = FONTS + CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // URL HASH ROUTING: Listen to browser Back/Forward buttons
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setScreen(hash);
      else setScreen('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // URL HASH ROUTING: Push state to URL when screen changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== screen) {
        window.history.pushState(null, '', `#${screen}`);
      }
    }
  }, [screen]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // ONLY redirect to dashboard if they literally just logged in
        setScreen(prevScreen => prevScreen === 'auth' ? 'dashboard' : prevScreen);
        
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) setUserData(snap.data());
        } catch (e) { console.error(e); }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  const handleAuthSuccess = (user, isNew) => {
    setCurrentUser(user);
    setScreen('dashboard');
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserData(null);
    setScreen('home');
  };

  const handleSaveAssessment = async (results) => {
    if (!currentUser) {
      alert("Please sign in to save your results!");
      setScreen('auth');
      return;
    }

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        riasecCode: results.riasec.code,
        riasecSummary: results.riasecSummary,
        bestCareer: results.bestCareer,
        recommendedCareer: results.recommendedCareer,
        leastCareer: results.leastCareer,
        nextSteps: results.nextSteps
      }, { merge: true });

      setUserData(prev => ({
        ...prev,
        riasecCode: results.riasec.code,
        riasecSummary: results.riasecSummary,
        bestCareer: results.bestCareer,
        recommendedCareer: results.recommendedCareer,
        leastCareer: results.leastCareer,
        nextSteps: results.nextSteps
      }));

      setDashboardTab('home'); 
      setScreen('dashboard');
      
    } catch (err) {
      console.error("Error saving assessment: ", err);
    }
  };

  // ── SECURE ADMIN ROUTE ──
  if (screen === 'admin') {
    // 🔒 Security Check: If they aren't an admin in the database, kick them out
    if (userData?.role !== 'super_admin') {
      setScreen('home');
      return null; 
    }
    return (
      <AdminDashboard 
        user={currentUser} 
        onBackToApp={() => setScreen('home')} 
      />
    );
  }

  if (screen === 'auth') {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (screen === 'dashboard' && currentUser) {
    return (
      <StudentDashboard
        user={currentUser}
        userData={userData}
        initialTab={dashboardTab} 
        onBack={() => setScreen('home')}
        onLogout={handleLogout}
        onStartAssessment={() => setScreen('vidyavantage')}
      />
    );
  }

  if (screen === 'mindspace') {
    return (
      <div>
        <nav className="ss-nav">
          <div className="ss-nav-logo" onClick={() => setScreen('home')} style={{ cursor: 'pointer' }}>
            Secret<span>Sharz</span>
          </div>
          <button className="nav-cta-outline" onClick={() => setScreen('home')}>← Back Home</button>
        </nav>
        <MindSpace 
          userData={userData} 
          onNavigate={(targetTab) => {
            if(!currentUser) {
              alert("You must be logged in to view your career data.");
              setScreen('auth');
              return;
            }
            setDashboardTab(targetTab); 
            setScreen('dashboard');
          }} 
        />
      </div>
    );
  }

  if (screen === 'vidyavantage') {
    return (
      <div>
        <div className="vv-back-bar">
          <button className="vv-back-btn" onClick={() => setScreen(currentUser ? 'dashboard' : 'home')}>← Back to Secret Sharz</button>
          <div className="vv-back-label">VidyaVantage is a subsidiary of <span>SecretSharz</span></div>
        </div>
        <VidyaVantage onBack={() => setScreen(currentUser ? 'dashboard' : 'home')} onSave={handleSaveAssessment} />
      </div>
    );
  }

  // ── Homepage ──────────────────────────────────────────────────────────
  return (
    <div>
      {/* NAV */}
      <nav className="ss-nav">
        <div className="ss-nav-logo" onClick={() => setScreen('home')} style={{cursor:'pointer'}}>Secret<span>Sharz</span></div>
        <div className="ss-nav-links">
          <button className="nav-link" onClick={() => setScreen('mindspace')}>Mind Space</button>
          <button className="nav-link" onClick={() => setModal('talk')}>Community</button>
          <button className="nav-link" onClick={() => setModal('talk')}>For Schools</button>
          <button className="nav-vv-link" onClick={() => setScreen('vidyavantage')}>🎓 VidyaVantage</button>

          {currentUser ? (
            <>
              {/* 🔒 Secret Admin Button: Only renders if database says 'super_admin' */}
              {userData?.role === 'super_admin' && (
                <button className="nav-link" onClick={() => setScreen('admin')} style={{color: 'var(--saffron)', fontWeight: 'bold'}}>
                  ⚙️ Admin Panel
                </button>
              )}
              <button className="nav-user-chip" onClick={() => {setDashboardTab('home'); setScreen('dashboard');}}>
                👤 {currentUser.displayName?.split(' ')[0] || 'My Dashboard'}
              </button>
              <button className="nav-cta-outline" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="nav-link" onClick={() => setScreen('auth')}>Sign In</button>
              <button className="nav-cta" onClick={() => setScreen('auth')}>Join Free</button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="ss-hero">
        <div className="hero-bg-blob blob-1" /><div className="hero-bg-blob blob-2" /><div className="hero-bg-blob blob-3" />
        <div className="hero-content">
          <div className="hero-eyebrow anim-up"><div className="hero-eyebrow-dot" />Safe · Anonymous · For Indian Youth</div>
          <h1 className="hero-h1 anim-up-1">A place where<br/>your <em>feelings</em> are<br/><span className="underline-word">always valid</span></h1>
          <p className="hero-p anim-up-2">Secret Sharz is a safe, anonymous digital space for children and young people across India — to share, heal, grow, and discover who they truly are.</p>
          <div className="hero-actions anim-up-3">
            <button className="btn-primary" onClick={() => setScreen(currentUser ? 'dashboard' : 'auth')}>
              {currentUser ? '🏠 My Dashboard' : 'Create My Safe Space 🌱'}
            </button>
            <button className="btn-ghost" onClick={() => setModal('talk')}>💬 Talk to Someone</button>
          </div>
          <div className="trust-strip anim-up-4">
            <div className="trust-item"><span>🔒</span> Completely anonymous</div>
            <div className="trust-item"><span>🛡️</span> POCSO-aware platform</div>
            <div className="trust-item"><span>❤️</span> No judgement, ever</div>
            <div className="trust-item"><span>🌍</span> Pan-India reach</div>
          </div>
        </div>
        <div className="hero-right">
          <div className="floating-card"><div className="fc-icon">🌱</div><div className="fc-label">Today's Mood Check-In</div><div className="fc-value">Feeling anxious?</div><div className="fc-sub">3 grounding exercises ready for you</div><div className="fc-bar"><div className="fc-bar-fill" style={{width:'65%'}}/></div></div>
          <div className="floating-card"><div className="fc-icon">💬</div><div className="fc-label">Sharz Wall — Anonymous Post</div><div className="fc-value">"Boards are next week..."</div><div className="fc-sub">47 people responded with support 💚</div></div>
          <div className="floating-card"><div className="fc-icon">🎓</div><div className="fc-label">VidyaVantage Match</div><div className="fc-value">Psychology — 94%</div><div className="fc-sub">Your RIASEC code: ISA · See your report</div><div className="fc-bar"><div className="fc-bar-fill" style={{width:'94%',background:'linear-gradient(90deg,#E8650A,#F0A500)'}}/></div></div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="section" style={{background:'var(--sand)'}}>
        <div className="section-header">
          <div className="section-eyebrow">What We Offer</div>
          <h2 className="section-h2">Everything a young person <em>actually needs</em></h2>
          <p className="section-p">Four pillars that work together to support your mind, your connections, your future, and your safety.</p>
        </div>
        <div className="pillars-grid">
          {PILLARS.map(p => (
            <div key={p.cls} className={`pillar-card ${p.cls}`}>
              <div className="pillar-icon">{p.icon}</div>
              <div className="pillar-title">{p.title}</div>
              <div className="pillar-desc">{p.desc}</div>
              <div className="pillar-features">{p.features.map((f,i) => <div key={i} className="pillar-feat">{f}</div>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VIDYAVANTAGE BANNER */}
      <section className="section">
        <div className="vv-banner">
          <div className="vv-banner-left">
            <div className="vv-banner-tag">⚡ Powered by Secret Sharz</div>
            <h3>Discover your <em>perfect career</em><br/>with VidyaVantage</h3>
            <p>Our AI-powered career guidance subsidiary uses Holland's RIASEC theory to map your unique personality to the careers and colleges that truly fit you.</p>
            <button className="btn-vv" onClick={() => { setScreen(currentUser ? 'vidyavantage' : 'auth'); }}>
              🎓 {currentUser ? 'Start Career Assessment' : 'Login to Start Assessment'} <span style={{fontSize:'18px'}}>→</span>
            </button>
          </div>
          <div className="vv-banner-right">
            <div className="vv-banner-card">
              <div className="vv-stat"><div className="vv-stat-num">6</div><div className="vv-stat-label">RIASEC Dimensions</div></div>
              <div className="vv-stat"><div className="vv-stat-num">500+</div><div className="vv-stat-label">Indian Colleges</div></div>
              <div className="vv-stat"><div className="vv-stat-num">3</div><div className="vv-stat-label">Career Paths per Student</div></div>
              <div className="vv-stat"><div className="vv-stat-num">Free</div><div className="vv-stat-label">Always free for students</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SAFE SPACE */}
      <section className="safe-section">
        <div className="safe-content">
          <div className="section-eyebrow" style={{color:'var(--sage-light)'}}>Your Safety Comes First</div>
          <h2 className="section-h2">This is a <em>judgement-free</em> zone. Always.</h2>
          <p className="section-p">We built Secret Sharz on one promise: you will never be shamed, exposed, or ignored here. Ever.</p>
          <div className="safe-promises">
            {['🔒 Anonymous by default','🤖 AI-moderated content','👁️ Human review team','📞 Crisis escalation','🇮🇳 POCSO-aware'].map((p,i) => <div key={i} className="safe-promise">{p}</div>)}
          </div>
          <div className="crisis-box">
            <div style={{fontSize:'36px',flexShrink:0}}>🆘</div>
            <div><div className="crisis-title">Need urgent help right now?</div><div className="crisis-desc">Our crisis support connects you to iCall, Vandrevala Foundation, and Snehi helplines — trained professionals available 24/7.</div></div>
            <div className="crisis-number">iCall<br/>9152987821</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ss-footer">
        <div className="footer-top">
          <div style={{flex:1,minWidth:'220px'}}>
            <div className="footer-logo">Secret<span>Sharz</span></div>
            <div className="footer-tagline">A safe space for every young person in India to share, heal, and grow — anonymously and without judgement.</div>
          </div>
          
          <div style={{minWidth:'160px'}}>
            <div className="footer-links-title">Platform</div>
            <a className="footer-link" onClick={() => setScreen('mindspace')} style={{cursor: 'pointer'}}>Mind Space</a>
            <a className="footer-link" onClick={() => setModal('talk')} style={{cursor: 'pointer'}}>Sharz Wall</a>
            <a className="footer-link" onClick={() => setModal('talk')} style={{cursor: 'pointer'}}>Life Guide</a>
            <a className="footer-link" onClick={() => setModal('talk')} style={{cursor: 'pointer'}}>Safe Corner</a>
          </div>

          <div style={{minWidth:'160px'}}>
            <div className="footer-links-title">VidyaVantage</div>
            <a className="footer-link" onClick={() => setScreen('vidyavantage')} style={{cursor: 'pointer'}}>Career Assessment</a>
            <a className="footer-link" onClick={() => setScreen('vidyavantage')} style={{cursor: 'pointer'}}>College Database</a>
            <a className="footer-link" onClick={() => {setDashboardTab('home'); currentUser ? setScreen('dashboard') : setScreen('auth')}} style={{cursor: 'pointer'}}>My Dashboard</a>
          </div>

          <div style={{minWidth:'160px'}}>
            <div className="footer-links-title">Resources</div>
            <a className="footer-link" onClick={() => setModal('talk')} style={{cursor: 'pointer'}}>Blog & Articles</a>
            <a className="footer-link" onClick={() => setModal('talk')} style={{cursor: 'pointer'}}>Helpline Directory</a>
            <a className="footer-link" onClick={() => setModal('talk')} style={{cursor: 'pointer'}}>For Parents & Educators</a>
            <a className="footer-link" onClick={() => setModal('talk')} style={{cursor: 'pointer'}}>FAQ & Support</a>
          </div>

          <div style={{minWidth:'160px'}}>
            <div className="footer-links-title">Account</div>
            {currentUser ? (
              <>
                <a className="footer-link" onClick={() => {setDashboardTab('home'); setScreen('dashboard');}} style={{cursor: 'pointer'}}>My Dashboard</a>
                <a className="footer-link" onClick={handleLogout} style={{cursor: 'pointer'}}>Sign Out</a>
              </>
            ) : (
              <>
                <a className="footer-link" onClick={() => setScreen('auth')} style={{cursor: 'pointer'}}>Sign In</a>
                <a className="footer-link" onClick={() => setScreen('auth')} style={{cursor: 'pointer'}}>Create Account</a>
              </>
            )}
            <a className="footer-link" onClick={() => setModal('talk')} style={{cursor: 'pointer'}}>Contact Us</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 Secret Sharz. Made with ❤️ for India's youth.</div>
          <div style={{fontFamily:'Fraunces,serif',fontSize:'14px',fontWeight:600,color:'rgba(255,255,255,0.25)'}}>
            VidyaVantage is a subsidiary of Secret<span style={{color:'#F0A500'}}>Sharz</span>
          </div>
        </div>
      </footer>

      {modal === 'talk' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <div style={{fontSize:'48px',marginBottom:'20px'}}>💬</div>
            <h3>You don't have to carry this alone</h3>
            <p>Whether it's a small worry or something really heavy — reaching out is the bravest thing you can do.</p>
            {[
              {icon:'🤖',title:'Chat with AI Support',desc:'Available right now. Gentle, non-judgemental guidance.',color:'var(--sage-pale)',textColor:'var(--sage)'},
              {icon:'📞',title:'Talk to a Real Counsellor',desc:'Trained counsellors available. First session always free.',color:'var(--peach-pale)',textColor:'var(--peach)'},
              {icon:'🆘',title:'Crisis Support Now',desc:'iCall: 9152987821 — Available 24/7',color:'#FFF0F0',textColor:'#C0392B'},
            ].map((opt,i) => (
              <div key={i} onClick={() => setModal(null)} style={{display:'flex',alignItems:'center',gap:'16px',background:opt.color,borderRadius:'var(--r-sm)',padding:'16px 18px',marginBottom:'10px',cursor:'pointer',border:'1.5px solid transparent',transition:'all 0.2s'}}
                onMouseEnter={e => e.currentTarget.style.borderColor = opt.textColor}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                <span style={{fontSize:'24px'}}>{opt.icon}</span>
                <div><div style={{fontSize:'14px',fontWeight:'600',color:opt.textColor,marginBottom:'2px'}}>{opt.title}</div><div style={{fontSize:'12px',color:'var(--muted)'}}>{opt.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
