import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { auth, db } from './firebase';
import VidyaVantage from './VidyaVantage';
import AuthPage from './AuthPage';
import StudentDashboard from './StudentDashboard';
import MindSpace from './MindSpace'; 
import AdminDashboard from './AdminDashboard'; 
import Header from './Header';
import Footer from './Footer';

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

  /* --- NEW: INSTANT ACTION BAR --- */
  .instant-action-bar { background: var(--sage); color: white; text-align: center; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; position: sticky; top: 0; z-index: 1001;}
  .instant-action-bar:hover { background: var(--moss); }
  .instant-action-bar span { opacity: 0.8; font-weight: 400; margin-left: 8px;}

  /* --- Navigation Styles moved to Header.js --- */

  .ss-hero{min-height:85vh;display:flex;align-items:center;padding:60px 48px;position:relative;overflow:hidden;}
  .hero-bg-blob{position:absolute;border-radius:60% 40% 70% 30%/50% 60% 40% 50%;animation:blob 8s ease-in-out infinite;pointer-events:none;z-index:0;}
  .blob-1{width:500px;height:500px;background:radial-gradient(circle,rgba(74,124,89,0.08),transparent 70%);top:-100px;right:-100px;}
  .blob-2{width:350px;height:350px;background:radial-gradient(circle,rgba(124,111,160,0.07),transparent 70%);bottom:-50px;left:200px;animation-delay:-4s;}
  .blob-3{width:250px;height:250px;background:radial-gradient(circle,rgba(232,132,90,0.07),transparent 70%);top:40%;right:30%;animation-delay:-2s;}
  .hero-content{position:relative;z-index:1;max-width:680px;}
  .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:var(--sage-pale);border:1.5px solid rgba(74,124,89,0.2);color:var(--sage);padding:8px 18px;border-radius:50px;font-size:13px;font-weight:600;letter-spacing:0.3px;margin-bottom:28px;}
  .hero-eyebrow-dot{width:7px;height:7px;background:var(--sage);border-radius:50%;position:relative;}
  .hero-eyebrow-dot::after{content:'';position:absolute;inset:-3px;border:1.5px solid var(--sage);border-radius:50%;animation:pulse-ring 2s ease-out infinite;}
  .hero-h1{font-family:'Fraunces',serif;font-size:clamp(42px,6vw,64px);font-weight:700;line-height:1.08;color:var(--ink);letter-spacing:-1.5px;margin-bottom:24px;}
  .hero-h1 em{font-style:italic;color:var(--sage);}
  .hero-h1 .underline-word{position:relative;display:inline-block;}
  .hero-h1 .underline-word::after{content:'';position:absolute;bottom:4px;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--peach),var(--lavender));border-radius:2px;}
  
  .hero-checklist { list-style: none; padding: 0; margin-bottom: 40px; }
  .hero-checklist li { display: flex; align-items: center; gap: 10px; font-size: 15px; color: var(--ink-soft); margin-bottom: 8px; font-weight: 500;}
  .hero-checklist li::before { content: '✓'; color: var(--success); font-weight: bold; }

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

  /* --- NEW: WHAT HAPPENS NEXT --- */
  .onboarding-steps-section { padding: 40px 48px; background: var(--warm-white); text-align: center;}
  .steps-container { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; max-width: 1000px; margin: 40px auto 0;}
  .step-card { flex: 1; min-width: 250px; text-align: left; padding: 24px; background: white; border-radius: var(--r-md); border: 1px solid var(--border); box-shadow: var(--shadow-sm);}
  .step-num { width: 32px; height: 32px; background: var(--sage-pale); color: var(--sage); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 15px;}
  .step-title { font-weight: bold; color: var(--ink); margin-bottom: 8px;}
  .step-desc { font-size: 14px; color: var(--muted); line-height: 1.6;}

  /* --- EMOTIONAL PUNCHLINE --- */
  .punchline-section { text-align: center; padding: 60px 20px 20px; }
  .punchline-text { font-family: 'Fraunces', serif; font-size: clamp(24px, 4vw, 36px); font-weight: 300; color: var(--ink-soft); font-style: italic; max-width: 800px; margin: 0 auto; line-height: 1.4;}

  /* --- SOCIAL PROOF SLIDER --- */
  .social-proof-section { padding: 40px 0 80px; overflow: hidden; background: linear-gradient(180deg, transparent, var(--sand)); }
  .sp-header { text-align: center; font-size: 14px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px;}
  .sp-slider { display: flex; gap: 24px; padding: 0 48px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; -ms-overflow-style: none;}
  .sp-slider::-webkit-scrollbar { display: none; }
  .sp-card { background: white; padding: 24px; border-radius: var(--r-md); box-shadow: var(--shadow-sm); min-width: 320px; max-width: 320px; scroll-snap-align: start; flex-shrink: 0; border: 1px solid var(--border);}
  .sp-stars { color: #F59E0B; font-size: 14px; margin-bottom: 12px; letter-spacing: 2px;}
  .sp-quote { font-size: 15px; color: var(--ink-soft); font-style: italic; margin-bottom: 16px; line-height: 1.6;}
  .sp-author { font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase;}

  /* --- FOUNDER STORY --- */
  .story-section { padding: 100px 48px; background: white; display: flex; align-items: center; justify-content: center; gap: 60px; flex-wrap: wrap;}
  .story-content { max-width: 500px; }
  .story-img-box { width: 400px; height: 500px; background: var(--sage-pale); border-radius: var(--r-lg); position: relative; display:flex; align-items:center; justify-content:center; font-size: 80px; border: 1px solid var(--border);}
  .story-img-box::after { content: ''; position: absolute; inset: -15px; border: 2px dashed var(--sage-light); border-radius: calc(var(--r-lg) + 10px); z-index: 0; opacity: 0.5;}

  /* --- FOR SCHOOLS & PARENTS --- */
  .b2b-section { background: var(--ink); color: white; padding: 100px 48px; display: flex; flex-direction: column; align-items: center; text-align: center; }
  .b2b-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; max-width: 1000px; width: 100%; margin-top: 50px; text-align: left;}
  .b2b-card { background: rgba(255,255,255,0.05); padding: 30px; border-radius: var(--r-md); border: 1px solid rgba(255,255,255,0.1); }

  .onboard-options { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;}
  .onboard-card { background: var(--sand); border: 2px solid transparent; border-radius: 12px; padding: 20px; text-align: center; cursor: pointer; transition: 0.2s;}
  .onboard-card:hover { border-color: var(--sage); transform: translateY(-3px);}
  .onboard-emoji { font-size: 40px; margin-bottom: 10px;}
  .onboard-title { font-weight: bold; color: var(--ink); margin-bottom: 5px;}
  .onboard-desc { font-size: 13px; color: var(--muted);}

  .section{padding:100px 48px;}
  .section-eyebrow{font-size:12px;font-weight:700;color:var(--sage);letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;}
  .section-h2{font-family:'Fraunces',serif;font-size:clamp(30px,4vw,46px);font-weight:700;color:var(--ink);line-height:1.15;letter-spacing:-0.5px;margin-bottom:16px;}
  .section-h2 em{font-style:italic;color:var(--sage);}
  .section-p{font-size:17px;color:var(--muted);line-height:1.75;font-weight:300;max-width:580px;}
  .section-header{max-width:700px;margin:0 auto 64px;text-align:center;}
  .section-header .section-p{margin:0 auto;}

  .pillars-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;max-width:1100px;margin:0 auto;}
  .pillar-card{background:white;border-radius:var(--r-md);padding:36px 32px;border:1.5px solid var(--border);box-shadow:var(--shadow-sm);transition:all 0.3s;position:relative;overflow:hidden; display: flex; flex-direction: column;}
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
  .pillar-desc{font-size:14px;color:var(--muted);line-height:1.7; flex: 1;}
  .pillar-features{margin-top:20px;display:flex;flex-direction:column;gap:6px;}
  .pillar-feat{font-size:13px;color:var(--ink-soft);font-weight:500;display:flex;align-items:center;gap:8px;}
  .pillar-feat::before{content:'→';color:var(--sage);font-weight:700;}
  
  .pillar-cta { margin-top: 24px; padding-top: 15px; border-top: 1px solid var(--border); font-size: 14px; font-weight: bold; color: var(--sage); cursor: pointer; display: flex; align-items: center; gap: 5px;}
  .pillar-cta:hover { color: var(--moss); }

  .vv-banner{background:linear-gradient(135deg,#1C1208 0%,#2D1A05 50%,#0A2A1C 100%);border-radius:var(--r-xl);padding:64px 72px;display:flex;align-items:center;justify-content:space-between;gap:40px;max-width:1100px;margin:0 auto;position:relative;overflow:hidden;}
  .vv-banner::before{content:'';position:absolute;top:-60px;right:-60px;width:300px;height:300px;background:radial-gradient(circle,rgba(232,101,10,0.15),transparent 70%);}
  .vv-banner-left{position:relative;z-index:1;flex:1;}
  .vv-banner-tag{display:inline-block;background:rgba(232,101,10,0.15);color:#F0A500;border:1px solid rgba(232,101,10,0.25);padding:6px 16px;border-radius:30px;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:20px;}
  .vv-banner h3{font-family:'Fraunces',serif;font-size:clamp(26px,3.5vw,36px);font-weight:700;color:white;line-height:1.15;letter-spacing:-0.5px;margin-bottom:14px;}
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
  
  /* --- UPGRADED PRIVACY PROMISES --- */
  .privacy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: left; margin-bottom: 50px;}
  .privacy-item { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; display: flex; align-items: flex-start; gap: 12px;}
  .privacy-item span { font-size: 24px; }
  .privacy-item h4 { color: white; margin: 0 0 5px 0; font-size: 15px;}
  .privacy-item p { color: rgba(255,255,255,0.6); margin: 0; font-size: 13px; line-height: 1.5;}
  
  .crisis-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 24px; text-align: left;}
  .crisis-box{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:var(--r-md);padding:24px;display:flex;align-items:flex-start;gap:15px; transition: 0.2s;}
  .crisis-box:hover { background:rgba(255,255,255,0.1); border-color: var(--sage-light); }
  .crisis-title{font-family:'Fraunces',serif;font-size:16px;font-weight:600;color:white;margin-bottom:4px;}
  .crisis-desc{font-size:12px;color:rgba(255,255,255,0.5);line-height:1.5; margin-bottom: 10px;}
  .crisis-number{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:#6FAA80;}

  /* --- Footer Styles moved to Footer.js --- */

  .modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(30,40,32,0.5);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease;}
  .modal{background:white;border-radius:var(--r-lg);padding:48px;max-width:520px;width:100%;box-shadow:var(--shadow-lg);animation:floatUp 0.3s ease;position:relative;}
  .modal-close{position:absolute;top:20px;right:20px;background:var(--sand);border:none;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);transition:all 0.2s;}
  .modal h3{font-family:'Fraunces',serif;font-size:26px;font-weight:700;color:var(--ink);margin-bottom:10px;}
  .modal p{font-size:15px;color:var(--muted);line-height:1.7;margin-bottom:24px;}
  .modal-actions{display:flex;gap:12px;margin-top:24px;}
  .btn-modal-primary{flex:1;padding:14px;background:var(--sage);color:white;border:none;border-radius:50px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;}
  .btn-modal-ghost{padding:14px 20px;background:transparent;color:var(--muted);border:2px solid var(--border);border-radius:50px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;}

  @media(max-width:900px){
    .ss-hero{padding:60px 24px;min-height:auto;}
    .hero-right{display:none;}
    .section{padding:64px 24px;}
    .vv-banner{flex-direction:column;padding:40px 28px;}
    .safe-section{padding:64px 24px;}
    .story-section{padding: 64px 24px; gap: 40px;}
    .story-img-box{display: none;}
    .privacy-grid{grid-template-columns: 1fr;}
  }
`;

const PILLARS = [
  { cls:'mind', icon:'🧠', title:'Mind Space', desc:'A private sanctuary for your thoughts. Track your mood, journal freely, and access science-backed tools for anxiety, stress, and emotional wellbeing.', features:['Daily mood check-in & tracking','Guided journaling with AI prompts','Breathing & grounding exercises'], cta: 'Try Mood Tracker →', route: 'mindspace' },
  { cls:'share', icon:'💬', title:'Sharz Wall', desc:"Share what's on your heart anonymously. Read stories from young people just like you. Know that you are never, ever alone in what you feel.", features:['100% anonymous sharing','Peer reactions & support','Moderated safe community'], cta: 'Read Anonymous Stories →', route: 'community' },
  { cls:'guide', icon:'🧭', title:'Life Guide', desc:"Navigate life's toughest decisions — from family pressure and friendships to career choices and your future — with guidance designed for young Indians.", features:['Career path discovery','Life skills & decision tools','Expert article library'], cta: 'Explore Life Guidance →', route: 'guide' },
  { cls:'safe', icon:'🛡️', title:'Safe Corner', desc:"If things feel too heavy to carry, you don't have to carry them alone. Access trained counsellors, crisis support, and emergency helplines instantly.", features:['24/7 crisis helpline access','Connect with trained counsellors','Report unsafe situations privately'], cta: 'View Safety Protocols →', route: 'safe' },
];

export default function App() {
  
  const [screen, setScreen] = useState('home');
  const [showVV, setShowVV] = useState(false);
  
  const [dashboardTab, setDashboardTab] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData]       = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [modal, setModal]             = useState(null); 
  
  // 🔥 FOOLPROOF ADMIN VALIDATION
  const isMasterEmail = currentUser?.email && btoa(currentUser.email.toLowerCase().trim()) === 'YW50b25pby5hbnRvbmlvLm5vcm9uaGFAZ21haWwuY29t';
  const isAdmin = (userData && userData.role === 'super_admin') || isMasterEmail;

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = FONTS + CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Hydration Fix & Hash Router
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) setScreen(hash);
      
      const savedVV = sessionStorage.getItem('showVV') === 'true';
      if (savedVV) setShowVV(true);
    }

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) setScreen(hash);
      else setScreen('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== screen) {
        window.history.pushState(null, '', `#${screen}`);
      }
    }
  }, [screen]);

  // 🔥 AUTO-ROUTER: Constantly watches your login status and moves you
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        let isDbAdmin = false;
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            setUserData(snap.data());
            if (snap.data().role === 'super_admin') isDbAdmin = true;
          }
        } catch (e) { console.error(e); }

        const isMaster = user.email && btoa(user.email.toLowerCase().trim()) === 'YW50b25pby5hbnRvbmlvLm5vcm9uaGFAZ21haWwuY29t';
        const isUserAdmin = isDbAdmin || isMaster;

        // Auto-route if you are sitting on the home or auth page
        setScreen(prevScreen => {
          if (prevScreen === 'auth' || prevScreen === 'home') {
            return isUserAdmin ? 'admin' : 'dashboard';
          }
          return prevScreen;
        });

      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  // For manual Email/Password & Popup logins
  const handleAuthSuccess = async (user, isNew) => {
    setCurrentUser(user);
    
    let isDbAdmin = false;
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        setUserData(snap.data());
        if (snap.data().role === 'super_admin') isDbAdmin = true;
      }
    } catch (err) { console.error(err); }

    const isMaster = user?.email && btoa(user.email.toLowerCase().trim()) === 'YW50b25pby5hbnRvbmlvLm5vcm9uaGFAZ21haWwuY29t';

    if (isDbAdmin || isMaster) {
      setScreen('admin');
    } else {
      if(isNew) {
         setModal('onboarding');
      } else {
         setScreen('dashboard');
      }
    }
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
    if (!isAdmin) {
      setScreen('home');
      return null; 
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, position: 'relative' }}>
          <AdminDashboard 
            user={currentUser} 
            onBackToApp={() => setScreen('home')} 
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (screen === 'auth') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, position: 'relative' }}>
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        </main>
        <Footer />
      </div>
    );
  }

  if (screen === 'dashboard' && currentUser) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, position: 'relative' }}>
          <StudentDashboard
            user={currentUser}
            userData={userData}
            initialTab={dashboardTab} 
            isAdmin={isAdmin}
            onAdmin={() => setScreen('admin')}
            onBack={() => setScreen('home')}
            onLogout={handleLogout}
            onStartAssessment={() => setScreen('vidyavantage')}
          />
        </main>
        <Footer />
      </div>
    );
  }

  if (screen === 'mindspace') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, position: 'relative' }}>
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
        </main>
        <Footer />
      </div>
    );
  }

  if (screen === 'vidyavantage') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <main style={{ flex: 1, position: 'relative' }}>
          <div className="vv-back-bar">
            <button className="vv-back-btn" onClick={() => setScreen(currentUser ? 'dashboard' : 'home')}>← Back to Secret Sharz</button>
            <div className="vv-back-label">VidyaVantage is a subsidiary of <span>SecretSharz</span></div>
          </div>
          <VidyaVantage onBack={() => setScreen(currentUser ? 'dashboard' : 'home')} onSave={handleSaveAssessment} />
        </main>
      </div>
    );
  }

  // ── Homepage ──────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 🚀 INSTANT ACTION BAR */}
      {!currentUser && screen === 'home' && (
        <div className="instant-action-bar" onClick={() => setScreen('auth')}>
            Feeling overwhelmed right now? Start your healing journey in 30 seconds. <span>→</span>
        </div>
      )}

      {/* Show header everywhere EXCEPT VidyaVantage */}
      {screen !== 'vidyavantage' && <Header />}

      <main style={{ flex: 1, position: 'relative' }}>

        {/* HERO */}
        <section className="ss-hero">
          <div className="hero-bg-blob blob-1" /><div className="hero-bg-blob blob-2" /><div className="hero-bg-blob blob-3" />
          <div className="hero-content">
            <div className="hero-eyebrow anim-up"><div className="hero-eyebrow-dot" />Safe · Anonymous · For Indian Youth</div>
            
            <h1 className="hero-h1 anim-up-1">Anonymous mental health <br/>support for students —<br/><span className="underline-word">anytime, anywhere</span></h1>
            
            <ul className="hero-checklist anim-up-2">
                <li>Takes 30 seconds to start</li>
                <li>No real name required</li>
                <li>100% free for students</li>
            </ul>

            <div className="hero-actions anim-up-3">
              <button className="btn-primary" onClick={() => setScreen(currentUser ? 'dashboard' : 'auth')}>
                {currentUser ? '🏠 My Dashboard' : 'Start Anonymously'}
              </button>
              <button className="btn-ghost" onClick={() => setModal('talk')}>💬 Talk to Someone Now</button>
            </div>
            
            <div className="trust-strip anim-up-4">
              <div className="trust-item"><span>🇮🇳</span> Join 12,000+ students across India</div>
              <div className="trust-item"><span>🧑‍⚕️</span> Designed by counsellors</div>
              <div className="trust-item"><span>🧠</span> Backed by psychology research</div>
            </div>
          </div>
          <div className="hero-right">
            <div className="floating-card"><div className="fc-icon">🔥</div><div className="fc-label">Your Healing Journey</div><div className="fc-value">7-Day Calm Streak!</div><div className="fc-sub">Your average anxiety score dropped by 12% this week. Keep it up!</div><div className="fc-bar"><div className="fc-bar-fill" style={{width:'85%', background:'var(--success)'}}/></div></div>
            <div className="floating-card"><div className="fc-icon">💬</div><div className="fc-label">Recent Anonymous Post</div><div className="fc-value">"I feel like I'm falling behind everyone else in my class..."</div><div className="fc-sub">12 students felt the same way today.</div></div>
            <div className="floating-card"><div className="fc-icon">🎓</div><div className="fc-label">VidyaVantage Match</div><div className="fc-value">Psychology — 94%</div><div className="fc-sub">Your RIASEC code: ISA · See your report</div><div className="fc-bar"><div className="fc-bar-fill" style={{width:'94%',background:'linear-gradient(90deg,#E8650A,#F0A500)'}}/></div></div>
          </div>
        </section>

        {/* 🚀 EMOTIONAL PUNCHLINE */}
        <section className="punchline-section anim-up-4">
            <h2 className="punchline-text">"The things you can't tell anyone... <br/><span style={{color: 'var(--sage)', fontWeight: '600'}}>you can tell us.</span>"</h2>
        </section>

        {/* 🚀 WHAT HAPPENS NEXT (First 5 Minutes) */}
        <section className="onboarding-steps-section">
            <div className="section-eyebrow">Your First 5 Minutes</div>
            <h2 className="section-h2">You don’t have to have the right words. <em>Just start.</em></h2>
            <p className="section-p" style={{margin: '0 auto'}}>Most students join us during exam stress, family pressure, or major life decisions. We make it easy to begin.</p>
            
            <div className="steps-container">
                <div className="step-card">
                    <div className="step-num">1</div>
                    <div className="step-title">Quick Mood Check</div>
                    <div className="step-desc">Tell us how you're feeling right now using a simple slider. No typing required.</div>
                </div>
                <div className="step-card">
                    <div className="step-num">2</div>
                    <div className="step-title">Get Matched Support</div>
                    <div className="step-desc">Based on your mood, we instantly suggest a short breathing exercise or journal prompt.</div>
                </div>
                <div className="step-card">
                    <div className="step-num">3</div>
                    <div className="step-title">Explore Anonymously</div>
                    <div className="step-desc">Read stories from other students who feel exactly like you do.</div>
                </div>
            </div>
        </section>

        {/* SOCIAL PROOF SLIDER (INTERACTIVE) */}
        <section className="social-proof-section">
            <div className="sp-header">Trusted by thousands of students across India</div>
            <div className="sp-slider" id="spSlider">
                <div className="sp-card">
                    <div className="sp-stars">★★★★★</div>
                    <div className="sp-quote">"This helped me during boards stress so much. I finally felt like I wasn't the only one panicking."</div>
                    <div className="sp-author">Class 12 Student • CBSE</div>
                </div>
                <div className="sp-card">
                    <div className="sp-stars">★★★★★</div>
                    <div className="sp-quote">"I was too scared to tell my parents I wanted to change streams. The counsellor here gave me the courage to do it."</div>
                    <div className="sp-author">Class 11 Student • ISC</div>
                </div>
                <div className="sp-card">
                    <div className="sp-stars">★★★★★</div>
                    <div className="sp-quote">"I finally felt heard. Just writing down my thoughts on the anonymous wall and seeing others react made my week."</div>
                    <div className="sp-author">College Fresher • Mumbai</div>
                </div>
                <div className="sp-card">
                    <div className="sp-stars">★★★★★</div>
                    <div className="sp-quote">"The breathing exercises actually work. I open this app before every major exam now."</div>
                    <div className="sp-author">Class 10 Student • ICSE</div>
                </div>
                <div className="sp-card">
                    <div className="sp-stars">★★★★★</div>
                    <div className="sp-quote">"No judgement. No lecturing. Just real help when I felt completely alone."</div>
                    <div className="sp-author">Anonymous User • Bangalore</div>
                </div>
            </div>
        </section>

        {/* PILLARS */}
        <section className="section" style={{background:'var(--sand)'}}>
          <div className="section-header">
            <div className="section-eyebrow">What We Offer</div>
            <h2 className="section-h2">Everything you need to <em>feel better</em> — in one place</h2>
            <p className="section-p">Four pillars that work together to support your mind, your connections, your future, and your safety.</p>
          </div>
          <div className="pillars-grid">
            {PILLARS.map(p => (
              <div key={p.cls} className={`pillar-card ${p.cls}`}>
                <div className="pillar-icon">{p.icon}</div>
                <div className="pillar-title">{p.title}</div>
                <div className="pillar-desc">{p.desc}</div>
                <div className="pillar-features">{p.features.map((f,i) => <div key={i} className="pillar-feat">{f}</div>)}</div>
                <div className="pillar-cta" onClick={() => p.route === 'mindspace' ? setScreen('mindspace') : setModal('talk')}>
                    {p.cta}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOUNDER STORY */}
        <section className="story-section">
            <div className="story-content">
                <div className="section-eyebrow">Why SecretSharz Exists</div>
                <h2 className="section-h2" style={{marginBottom: '24px'}}>Built from real conversations behind <em>closed doors.</em></h2>
                <p className="section-p" style={{color: 'var(--ink-soft)'}}>
                    For years, sitting in a school counselling room, I saw the same pattern repeat itself. Brilliant, capable students were struggling silently under the weight of expectations, anxiety, and the fear of judgment. 
                </p>
                <p className="section-p" style={{color: 'var(--ink-soft)', marginTop: '16px'}}>
                    They couldn't talk to their parents. They wouldn't talk to their teachers. 
                </p>
                <p className="section-p" style={{color: 'var(--ink-soft)', marginTop: '16px'}}>
                    Secret Sharz was built to be the digital equivalent of that safe counselling room. A place where identity doesn't matter, but your feelings do. We combine professional psychological support with the anonymity the internet provides to reach students *before* they hit a breaking point.
                </p>
            </div>
            <div className="story-img-box">
                🧑‍🏫
            </div>
        </section>

        {/* VIDYAVANTAGE BANNER */}
        <section className="section">
          <div className="vv-banner">
            <div className="vv-banner-left">
              <div className="vv-banner-tag">⚡ Powered by Secret Sharz</div>
              <h3>Once your mind is clear...<br/><em>discover your future</em></h3>
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

        {/* FOR SCHOOLS B2B SECTION */}
        <section className="b2b-section">
            <div className="section-eyebrow" style={{color: 'var(--sage-light)'}}>Institutional Partnerships</div>
            <h2 className="section-h2" style={{color: 'white'}}>Empower your students with a <em>proactive</em> mental health layer.</h2>
            <p className="section-p" style={{color: 'rgba(255,255,255,0.6)'}}>Secret Sharz partners with forward-thinking schools across India to provide anonymous, POCSO-aligned emotional support.</p>
            
            <div className="b2b-grid">
                <div className="b2b-card">
                    <div style={{fontSize: '32px', marginBottom: '15px'}}>🛡️</div>
                    <h3 style={{fontFamily: 'Fraunces, serif', fontSize: '20px', marginBottom: '10px'}}>Early Intervention</h3>
                    <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6}}>Our clinical panel detects high-stress markers early, allowing school counsellors to address issues before they escalate.</p>
                </div>
                <div className="b2b-card">
                    <div style={{fontSize: '32px', marginBottom: '15px'}}>📊</div>
                    <h3 style={{fontFamily: 'Fraunces, serif', fontSize: '20px', marginBottom: '10px'}}>Anonymized Analytics</h3>
                    <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6}}>Gain insights into the overall emotional health of your student body without ever compromising an individual's privacy.</p>
                </div>
                <div className="b2b-card">
                    <div style={{fontSize: '32px', marginBottom: '15px'}}>🤝</div>
                    <h3 style={{fontFamily: 'Fraunces, serif', fontSize: '20px', marginBottom: '10px'}}>Seamless Integration</h3>
                    <p style={{fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6}}>Deploy our platform to thousands of students in under 48 hours. No complex IT setup required.</p>
                </div>
            </div>
            
            <button className="btn-primary" style={{marginTop: '40px', background: 'white', color: 'var(--ink)'}} onClick={() => setModal('talk')}>
                Schedule a Demo for your School
            </button>
        </section>

        {/* SAFE SPACE */}
        <section className="safe-section">
          <div className="safe-content">
            <div className="section-eyebrow" style={{color:'var(--sage-light)'}}>Your Safety Comes First</div>
            <h2 className="section-h2">This is a <em>judgement-free</em> zone. Always.</h2>
            <p className="section-p">We built Secret Sharz on one promise: you will never be shamed, exposed, or ignored here. Ever.</p>
            
            {/* 🚀 UPGRADED PRIVACY PROMISES */}
            <div className="privacy-grid">
                <div className="privacy-item">
                    <span>🔒</span>
                    <div><h4>100% Anonymous</h4><p>No real names. You interact using generated avatars and aliases.</p></div>
                </div>
                <div className="privacy-item">
                    <span>🛡️</span>
                    <div><h4>End-to-End Protection</h4><p>Your data is encrypted. Chat logs are never publicly linked to you.</p></div>
                </div>
                <div className="privacy-item">
                    <span>🚫</span>
                    <div><h4>No Data Selling</h4><p>Your mental health data is yours. We never sell information to third parties.</p></div>
                </div>
                <div className="privacy-item">
                    <span>🇮🇳</span>
                    <div><h4>POCSO Aligned</h4><p>Built under strict Indian child safety laws with human moderation.</p></div>
                </div>
            </div>
            
            <div style={{textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px'}}>
                <h3 style={{color: 'white', fontFamily: 'Fraunces, serif', fontSize: '24px', marginBottom: '5px'}}>Need urgent help right now?</h3>
                <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '20px'}}>Don't wait. Free, confidential support is available 24/7 across India.</p>
                
                <div className="crisis-grid">
                    <div className="crisis-box">
                        <div style={{fontSize:'32px'}}>📞</div>
                        <div><div className="crisis-title">iCall Helpline</div><div className="crisis-desc">Psychosocial helpline by TISS. Mon-Sat, 8AM to 10PM.</div><div className="crisis-number">9152987821</div></div>
                    </div>
                    <div className="crisis-box">
                        <div style={{fontSize:'32px'}}>🏥</div>
                        <div><div className="crisis-title">Kiran (Govt of India)</div><div className="crisis-desc">24/7 National Mental Health Helpline.</div><div className="crisis-number">1800-599-0019</div></div>
                    </div>
                    <div className="crisis-box">
                        <div style={{fontSize:'32px'}}>🤝</div>
                        <div><div className="crisis-title">Vandrevala Foundation</div><div className="crisis-desc">Free psychological counselling for anyone in distress.</div><div className="crisis-number">9999-666-555</div></div>
                    </div>
                </div>
            </div>
          </div>
        </section>
      </main>

      {/* Show footer everywhere EXCEPT VidyaVantage */}
      {screen !== 'vidyavantage' && <Footer />}

      {/* ONBOARDING MODAL FOR NEW USERS */}
      {modal === 'onboarding' && (
        <div className="modal-overlay" onClick={() => {setModal(null); setScreen('dashboard');}}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => {setModal(null); setScreen('dashboard');}}>✕</button>
            <h3>Welcome to your Safe Space.</h3>
            <p>How are you feeling right now? We'll suggest a good place to start.</p>
            
            <div className="onboard-options">
                <div className="onboard-card" onClick={() => {setDashboardTab('mindspace'); setModal(null); setScreen('dashboard');}}>
                    <div className="onboard-emoji">🌪️</div>
                    <div className="onboard-title">Anxious or Overwhelmed</div>
                    <div className="onboard-desc">Try a quick breathing exercise</div>
                </div>
                <div className="onboard-card" onClick={() => {setDashboardTab('community'); setModal(null); setScreen('dashboard');}}>
                    <div className="onboard-emoji">🗣️</div>
                    <div className="onboard-title">I need to vent</div>
                    <div className="onboard-desc">Write an anonymous post</div>
                </div>
                <div className="onboard-card" onClick={() => {setDashboardTab('home'); setModal(null); setScreen('dashboard');}}>
                    <div className="onboard-emoji">🧭</div>
                    <div className="onboard-title">Lost about my future</div>
                    <div className="onboard-desc">Start your career profile</div>
                </div>
                <div className="onboard-card" onClick={() => {setDashboardTab('home'); setModal(null); setScreen('dashboard');}}>
                    <div className="onboard-emoji">😌</div>
                    <div className="onboard-title">I'm doing okay</div>
                    <div className="onboard-desc">Just take me to my dashboard</div>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* TALK TO SOMEONE MODAL */}
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
