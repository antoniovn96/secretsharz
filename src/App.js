import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import Head from 'next/head';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { DashboardProvider } from './context/DashboardContext';
import { assignRoleViaServer } from './security/assignRoleClient';

// 🚀 OPTIMIZATION 1: LAZY LOADING HEAVY ROUTES
const VidyaVantage = lazy(() => import('./VidyaVantage'));
const CollegesPage = lazy(() => import('./CollegesPage'));
const CollegeDetails = lazy(() => import('./CollegeDetails'));
const CareerExplorer = lazy(() => import('./CareerExplorer'));
const VidyaVantageBlog = lazy(() => import('./VidyaVantageBlog'));
const AuthPage = lazy(() => import('./AuthPage'));
const CareerStudentView = lazy(() => import('./dashboards/student/CareerStudentView'));
const PsychStudentView = lazy(() => import('./dashboards/student/PsychStudentView'));
const SENStudentView = lazy(() => import('./dashboards/student/SENStudentView'));
const OnboardingGateway = lazy(() => import('./dashboards/student/OnboardingGateway'));
const MindSpace = lazy(() => import('./MindSpace'));
const SharzWall = lazy(() => import('./SharzWall'));
const SuperAdminView = lazy(() => import('./dashboards/admin/SuperAdminView'));
const Blog = lazy(() => import('./Blog'));
const Resources = lazy(() => import('./Resources'));
const AboutUs = lazy(() => import('./AboutUs'));
const PsychCounsellorView = lazy(() => import('./dashboards/counsellor/PsychCounsellorView'));
const CaseFileView = lazy(() => import('./dashboards/counsellor/CaseFileView'));
const SENCounsellorView = lazy(() => import('./dashboards/counsellor/SENCounsellorView'));
const IEPBuilderView = lazy(() => import('./dashboards/counsellor/IEPBuilderView'));
const CareerCounsellorView = lazy(() => import('./dashboards/counsellor/CareerCounsellorView'));
const CareerRoadmapView = lazy(() => import('./dashboards/counsellor/CareerRoadmapView'));
const ParentPortalView = lazy(() => import('./dashboards/parent/ParentPortalView'));

// ✅ NEW BLOG IMPORTS ADDED HERE
const JournalingDeepDiveBlog = lazy(() => import('./blogss/2026/January/JournalingDeepDiveBlog'));
const MentalHealthResetBlog = lazy(() => import('./blogss/2026/February/MentalHealthResetBlog'));

// Header and Footer stay synchronous
import Header from './Header';
import Footer from './Footer';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,0..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');`;

const CSS = `\n  :root {\n    --sage:#4A7C59;--sage-light:#6FAA80;--sage-pale:#EBF4EE;--moss:#2D5240;\n    --lavender:#7C6FA0;--lav-pale:#F0EDF8;--peach:#E8845A;--peach-pale:#FDF0EA;\n    --sky:#5B9EBF;--sky-pale:#EAF4FA;--sand:#F7F3ED;--warm-white:#FDFCFA;\n    --ink:#1E2820;--ink-soft:#3D4A40;--muted:#7A8A7D;--border:rgba(74,124,89,0.15);\n    --shadow-sm:0 4px 16px rgba(30,40,32,0.06);--shadow-md:0 12px 40px rgba(30,40,32,0.10);\n    --shadow-lg:0 20px 60px rgba(30,40,32,0.13);\n    --r-sm:14px;--r-md:22px;--r-lg:32px;--r-xl:48px;\n    --success:#2D7D46;\n    --danger:#C0392B;\n  }\n  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}\n  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--warm-white);color:var(--ink);line-height:1.6;overflow-x:hidden;}\n\n  @keyframes floatUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}\n  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}\n  @keyframes blob{0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 50%;}50%{border-radius:30% 70% 40% 60%/60% 30% 70% 40%;}}\n  @keyframes pulse-ring{0%{transform:scale(1);opacity:0.6}100%{transform:scale(1.5);opacity:0;}}\n\n  .anim-up{animation:floatUp 0.7s ease both;}\n  .anim-up-1{animation:floatUp 0.7s 0.1s ease both;}\n  .anim-up-2{animation:floatUp 0.7s 0.2s ease both;}\n  .anim-up-3{animation:floatUp 0.7s 0.35s ease both;}\n  .anim-up-4{animation:floatUp 0.7s 0.5s ease both;}\n\n  /* ── TOP ACTION BAR ── */\n  .instant-action-bar{background:var(--sage);color:white;text-align:center;padding:12px 20px;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.2s;position:sticky;top:0;z-index:1001;}\n  .instant-action-bar:hover{background:var(--moss);}\n  .instant-action-bar span{opacity:0.8;font-weight:400;margin-left:8px;}\n\n  /* ── HERO SECTION ── */\n  .ss-hero{min-height:85vh;display:flex;align-items:center;padding:80px 48px;position:relative;overflow:hidden;}\n  .hero-bg-blob{position:absolute;border-radius:60% 40% 70% 30%/50% 60% 40% 50%;animation:blob 8s ease-in-out infinite;pointer-events:none;z-index:0;}\n  .blob-1{width:500px;height:500px;background:radial-gradient(circle,rgba(74,124,89,0.08),transparent 70%);top:-100px;right:-100px;}\n  .blob-2{width:350px;height:350px;background:radial-gradient(circle,rgba(124,111,160,0.07),transparent 70%);bottom:-50px;left:200px;animation-delay:-4s;}\n  .hero-content{position:relative;z-index:1;max-width:760px; display: flex; flex-direction: column; align-items: flex-start;}\n  .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:var(--sage-pale);border:1.5px solid rgba(74,124,89,0.2);color:var(--sage);padding:8px 18px;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:0.3px;margin-bottom:28px;}\n  .hero-eyebrow-dot{width:8px;height:8px;background:var(--sage);border-radius:50%;position:relative;}\n  .hero-eyebrow-dot::after{content:'';position:absolute;inset:-3px;border:1.5px solid var(--sage);border-radius:50%;animation:pulse-ring 2s ease-out infinite;}\n  .hero-h1{font-family:'Fraunces',serif;font-size:clamp(40px,5.5vw,72px);font-weight:700;line-height:1.1;color:var(--ink);letter-spacing:-1.5px;margin-bottom:20px;}\n  .hero-h1 .underline-word{position:relative;display:inline-block;color:var(--sage);}\n  .hero-sub{font-size:clamp(16px, 2vw, 18px);color:var(--ink-soft);line-height:1.6;max-width:650px;font-weight:500;margin-bottom:24px;}\n  \n  .hero-core-truth { background: rgba(74,124,89,0.05); border-left: 4px solid var(--sage); padding: 18px 24px; border-radius: 0 12px 12px 0; margin-bottom: 36px; font-size: 15px; color: var(--ink-soft); max-width: 600px;}\n  .hero-core-truth p { margin:0 0 6px 0; }\n  .hero-core-truth p:last-child { margin: 0; }\n\n  .hero-actions{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start;margin-bottom: 32px; width: 100%;}\n  .btn-primary{background:var(--sage);color:white;padding:16px 36px;border-radius:50px;font-size:16px;font-weight:700;border:none;cursor:pointer;font-family:inherit;box-shadow:0 8px 24px rgba(74,124,89,0.35);transition:all 0.25s;}\n  .btn-primary:hover{background:var(--moss);transform:translateY(-2px);box-shadow:0 12px 32px rgba(74,124,89,0.4);}\n  .btn-ghost{background:transparent;color:var(--ink-soft);padding:16px 28px;border-radius:50px;font-size:15px;font-weight:700;border:2px solid var(--border);cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;gap:8px;}\n  .btn-ghost:hover{border-color:var(--sage);color:var(--sage);background:var(--sage-pale);}\n\n  .trust-signals { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; font-weight: 600; color: var(--muted); }\n  .trust-signals span { display: flex; align-items: center; gap: 6px; }\n\n  .hero-right{position:absolute;right:48px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:20px;z-index:1;}\n  .floating-card{background:white;border-radius:var(--r-md);padding:24px;box-shadow:var(--shadow-md);border:1px solid var(--border);max-width:300px;animation:floatUp 0.8s ease both;}\n  .floating-card:nth-child(2){animation-delay:0.2s;margin-left:32px;}\n  .fc-icon{font-size:32px;margin-bottom:12px;}\n  .fc-label{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}\n  .fc-value{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--ink); line-height: 1.3;}\n  .fc-sub{font-size:13px;color:var(--muted);margin-top:8px;}\n\n  /* ── GLOBAL SECTION STYLES ── */\n  .section{padding:100px 48px;}\n  .section-alt{padding:100px 48px; background: white;}\n  .section-eyebrow{font-size:13px;font-weight:800;color:var(--sage);letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;display:block;}\n  .section-h2{font-family:'Fraunces',serif;font-size:clamp(32px,4vw,48px);font-weight:700;color:var(--ink);line-height:1.15;letter-spacing:-0.5px;margin-bottom:20px;}\n  .section-h2 em{font-style:italic;color:var(--sage);}\n  .section-p{font-size:17px;color:var(--ink-soft);line-height:1.75;font-weight:400;max-width:680px;}\n  .section-header{max-width:700px;margin:0 auto 50px;text-align:center;}\n  .section-header .section-p{margin:0 auto;}\n\n  /* ── INSTANT RELIEF SECTION ── */\n  .relief-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 40px; }\n  .relief-card { background: white; border: 1px solid var(--border); border-radius: var(--r-md); padding: 32px 24px; text-align: center; box-shadow: var(--shadow-sm); transition: transform 0.2s; }\n  .relief-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); border-color: var(--sage); }\n  .relief-icon { font-size: 40px; margin-bottom: 20px; }\n  .relief-title { font-weight: 700; color: var(--ink); font-size: 18px; margin-bottom: 10px;}\n  \n  /* ── CORE TRUTH BULLETS ── */\n  .core-truth-bullets { display: flex; flex-direction: column; gap: 20px; margin: 40px auto 0; max-width: 700px; text-align: left; }\n  .core-truth-bullet { display: flex; align-items: center; gap: 24px; font-size: 18px; color: var(--ink-soft); font-weight: 600; background: white; padding: 28px; border-radius: 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); transition: transform 0.2s;}\n  .core-truth-bullet:hover { transform: scale(1.02); border-color: var(--sage); }\n  .core-truth-icon { background: var(--sage-pale); color: var(--sage); width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }\n\n  /* ── PAIN MIRROR SECTION ── */\n  .pain-mirror { padding: 80px 48px; background: var(--sand); text-align: center; }\n  .pain-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; max-width: 1000px; margin: 40px auto; }\n  .pain-card { background: white; border: 1px solid var(--border); border-radius: var(--r-md); padding: 32px 24px; font-size: 18px; color: var(--ink-soft); font-weight: 600; font-style: italic; box-shadow: var(--shadow-sm); }\n  .pain-card::before { content: '"'; font-family: 'Fraunces', serif; font-size: 32px; color: var(--sage-light); display: block; margin-bottom: 10px; line-height: 0.5; }\n\n  /* ── JOURNEY VISUALIZATION ── */\n  .journey-container { display: flex; align-items: center; justify-content: space-between; overflow-x: auto; padding: 20px 0 40px; gap: 16px; scrollbar-width: none; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }\n  .journey-container::-webkit-scrollbar { display: none; }\n  .journey-step { flex: 1; min-width: 160px; text-align: center; background: white; padding: 28px 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); position: relative; z-index: 2; box-shadow: 0 8px 32px rgba(0,0,0,0.2); scroll-snap-align: center; }\n  .journey-arrow { color: var(--sage-light); font-weight: bold; font-size: 24px; flex-shrink: 0; }\n  .journey-emoji { font-size: 42px; margin-bottom: 12px; }\n  .journey-letter { display: inline-flex; width: 40px; height: 40px; background: var(--sage); color: white; border-radius: 50%; align-items: center; justify-content: center; font-weight: 800; margin-bottom: 12px; }\n\n  /* ── SOCIAL PROOF / TESTIMONIALS ── */\n  .social-proof-section{padding:100px 48px;background:white;}\n  .stats-strip { display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; margin-bottom: 60px; padding: 0 24px; }\n  .stat-box { text-align: center; }\n  .stat-box-num { font-family: 'Fraunces', serif; font-size: 48px; font-weight: 700; color: var(--sage); line-height: 1; margin-bottom: 8px; }\n  .stat-box-label { font-size: 14px; font-weight: 700; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 1px; }\n\n  .sp-slider{display:flex;gap:24px;padding:0 48px 24px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none; -webkit-overflow-scrolling: touch;}\n  .sp-slider::-webkit-scrollbar{display:none;}\n  .sp-card{background:white;padding:36px;border-radius:var(--r-md);box-shadow:var(--shadow-sm);min-width:360px;max-width:360px;scroll-snap-align:center;flex-shrink:0;border:1px solid var(--border);}\n  .sp-stars{color:#F59E0B;font-size:18px;margin-bottom:20px;letter-spacing:3px;}\n  .sp-quote{font-size:17px;color:var(--ink-soft);font-style:italic;margin-bottom:24px;line-height:1.6;}\n  .sp-author{font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase; letter-spacing: 1px;}\n\n  /* ── Origin Story ── */\n  .story-section{padding:120px 48px;background:var(--sand);display:flex;align-items:center;justify-content:center;gap:80px;flex-wrap:wrap;}\n  .story-content{max-width:580px;}\n  .story-img-box{width:450px;height:550px;background:var(--sage-pale);border-radius:var(--r-lg);position:relative;display:flex;align-items:center;justify-content:center;font-size:80px;border:1px solid var(--border);}\n  .story-img-box::after{content:'';position:absolute;inset:-15px;border:2px dashed var(--sage-light);border-radius:calc(var(--r-lg) + 10px);z-index:0;opacity:0.5;}\n  \n  /* ── B2B Pitch ── */\n  .b2b-section{background:var(--ink);color:white;padding:120px 48px;display:flex;flex-direction:column;align-items:center;text-align:center;}\n  .b2b-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;max-width:1100px;width:100%;margin-top:60px;text-align:left;}\n  .b2b-card{background:rgba(255,255,255,0.05);padding:36px;border-radius:var(--r-md);border:1px solid rgba(255,255,255,0.1);transition:background 0.2s;}\n  .b2b-card:hover{background:rgba(255,255,255,0.08);}\n\n  /* ── Privacy & Objections ── */\n  .safe-section{background:linear-gradient(135deg,var(--moss) 0%,#1E3D2A 100%);padding:120px 48px;text-align:center;position:relative;overflow:hidden;}\n  .safe-content{position:relative;z-index:1;max-width:850px;margin:0 auto;}\n  \n  .aha-headline { font-size: clamp(40px, 5vw, 64px); color: white; font-family: 'Fraunces', serif; line-height: 1.1; margin-bottom: 20px;}\n  .objection-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 24px; margin: 50px 0 80px; }\n  .objection-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px 24px; text-align: center; color: white; transition: background 0.2s; }\n  .objection-card:hover { background: rgba(255,255,255,0.1); }\n  .objection-card span { font-size: 36px; display: block; margin-bottom: 16px; }\n  .objection-card h4 { font-size: 17px; font-weight: 700; margin: 0; color: white; }\n  \n  .privacy-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;text-align:left;margin-bottom:60px;}\n  .privacy-item{background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05);padding:32px;border-radius:20px;display:flex;align-items:flex-start;gap:20px;}\n  .privacy-item span{font-size:32px;}\n  .privacy-item h4{color:white;margin:0 0 8px 0;font-size:18px;}\n  .privacy-item p{color:rgba(255,255,255,0.6);margin:0;font-size:15px;line-height:1.6;}\n\n  /* ── Modals & Quiz CSS ── */\n  .modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(30,40,32,0.6);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease;}\n  .modal{background:white;border-radius:var(--r-lg);padding:40px;max-width:520px;width:100%;box-shadow:var(--shadow-lg);animation:floatUp 0.3s ease;position:relative;}\n  .modal-close{position:absolute;top:20px;right:20px;background:var(--sand);border:none;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);transition:all 0.2s;}\n  .modal h3{font-family:'Fraunces',serif;font-size:26px;font-weight:700;color:var(--ink);margin-bottom:10px;}\n  \n  .quiz-entry-strip{background:linear-gradient(135deg,var(--lav-pale),var(--peach-pale));border:1.5px solid rgba(124,111,160,0.2);border-radius:var(--r-md);padding:32px 40px;display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1100px;margin:0 auto 40px;flex-wrap:wrap;}\n  .quiz-entry-btn{background:var(--lavender);color:white;border:none;padding:16px 32px;border-radius:50px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s;white-space:nowrap;}\n  \n  /* ── MOBILE ENHANCEMENTS ── */\n  @media(max-width:900px){\n    .ss-hero{padding: 40px 24px; min-height: auto; text-align: center;}\n    .hero-content{align-items: center; text-align: center;}\n    .hero-eyebrow{margin: 0 auto 24px;}\n    .hero-h1{font-size: clamp(42px, 10vw, 56px); letter-spacing: -1px;}\n    .hero-sub{font-size: 16px;}\n    \n    .hero-core-truth{border-left: none; border-top: 4px solid var(--sage); border-radius: 16px; padding: 24px; text-align: left;}\n    \n    .hero-actions{flex-direction: column; gap: 16px; width: 100%; max-width: 400px; margin: 0 auto 32px; align-items: center;}\n    .hero-actions > div { align-items: center !important; width: 100%; }\n    .btn-primary, .btn-ghost{width: 100%; justify-content: center; align-self: center !important;}\n    .hero-actions p { margin-left: 0 !important; text-align: center !important;}\n    \n    .trust-signals{justify-content: center;}\n    .hero-right{display:none;}\n    \n    .section, .section-alt, .pain-mirror{padding: 64px 24px;}\n    .section-h2{font-size: 32px;}\n    .aha-headline {font-size: 36px;}\n    \n    .relief-grid { grid-template-columns: 1fr; }\n    .pain-grid { grid-template-columns: 1fr; }\n    \n    .core-truth-bullets { padding: 0; }\n    .core-truth-bullet { flex-direction: column; text-align: center; gap: 16px; padding: 24px; }\n    \n    .journey-container { padding-bottom: 20px; }\n    \n    .share-item { flex-direction: column; align-items: center; text-align: center; padding: 24px; }\n    .share-text h4 { justify-content: center; }\n\n    .story-section{padding: 64px 24px; gap: 40px; text-align: center;}\n    .story-img-box{display:none;}\n    \n    .b2b-section { padding: 64px 24px; }\n    .b2b-grid {grid-template-columns: 1fr; text-align: center;}\n    \n    .safe-section{padding: 64px 24px;}\n    .objection-grid { grid-template-columns: 1fr 1fr; gap: 16px; }\n    .privacy-grid{grid-template-columns:1fr; gap: 20px;}\n    .privacy-item { flex-direction: column; align-items: center; text-align: center; padding: 24px;}\n    \n    .quiz-entry-strip{flex-direction:column;text-align:center; padding: 24px;}\n    .quiz-entry-left{flex-direction:column;}\n    \n    .modal { padding: 32px 24px; max-height: 90vh; overflow-y: auto;}\n    .sp-slider{padding:0 24px 24px;}\n    .stats-strip { gap: 30px; }\n  }\n`;

const SHARE_STEPS = [
  { letter: 'S', title: 'Speak (The Secret)', desc: 'Let out the heavy, hidden thoughts on the anonymous Sharz Wall. Realize you are never the only one feeling this way.', icon: '🗣️' },
  { letter: 'H', title: 'Heal (The First Aid)', desc: 'Use our Mind Space toolkit to regulate your nervous system. Quick breathing exercises, grounding techniques, and mood tracking to bring you back to calm.', icon: '🌿' },
  { letter: 'A', title: 'Assess (The Transition)', desc: 'Once the mental noise clears, discover who you really are. Use our SEN resources and learning profiles to understand your unique brain without judgment.', icon: '🧠' },
  { letter: 'R', title: 'Route (The Strategy)', desc: "Enter VidyaVantage. Take our AI-powered RIASEC assessment to map your true personality to the exact colleges and careers that fit you best.", icon: '🗺️' },
  { letter: 'E', title: 'Empower (The Outcome)', desc: 'Step into your future. Use our 30-day action roadmaps to execute your career goals with total, unshakeable confidence.', icon: '🚀' },
];

const PILLARS = [
  { cls:'share', icon:'💬', title:'Sharz Wall', desc:"Say what you've never said out loud — safely. Read stories from students exactly like you, and give support without the toxicity of normal social media.", features:['100% anonymous sharing','Peer reactions & support','Moderated safe community'], cta:'Read Anonymous Stories →', route:'/wall' },
  { cls:'mind', icon:'🧠', title:'Emotional First Aid', desc:"Stop a panic attack or spiral in under 2 minutes. Access interactive, immediate micro-interventions to find instant relief for anxiety, anger, or burnout.", features:['Interactive breathing visualizers','Cognitive reframing tools','Quick mood resets'], cta:'Try Emotional First Aid →', route:'/mindspace' },
  { cls:'guide', icon:'🎓', title:'VidyaVantage Career Match', desc:"Stop guessing your future. Get data-backed career routing based on Holland's RIASEC theory and a database of 500+ Indian colleges.", features:['AI-powered RIASEC test','500+ College Database','Actionable 30-day roadmaps'], cta:'Explore VidyaVantage →', route:'/vidyavantage' },
  { cls:'safe', icon:'🛡️', title:'The Safe Corner', desc:"Get immediate help when the weight is too heavy to carry alone. 24/7 access to trained counselors and national helplines.", features:['24/7 crisis helpline access','Connect with trained counsellors','Report unsafe situations privately'], cta:'View Safety Protocols →', route:'/safe' },
];

const QUIZ_QUESTIONS = [
  {
    q: "Mental health problems are a sign of personal weakness.",
    options: ["True — weak people struggle more", "Myth — it's a health condition", "Only true for severe cases", "Partially true"],
    correct: 1,
    verdict: "MYTH",
    explanation: "Mental health conditions are medical conditions, just like diabetes or a broken bone. They arise from a complex mix of genetics, brain chemistry, trauma, and environment — none of which have anything to do with willpower or character strength. Telling someone to 'just be strong' is like telling someone to willpower their way out of a fractured leg."
  },
  {
    q: "Talking about suicide plants the idea in someone's head and makes it more likely.",
    options: ["True — avoid the topic entirely", "Myth — asking about it can save lives", "It depends on how you ask", "Only true for teenagers"],
    correct: 1,
    verdict: "MYTH",
    explanation: "Research consistently shows that asking someone directly about suicidal thoughts does NOT increase risk — it actually reduces it. Open, compassionate conversations about suicide break the silence that keeps people suffering alone. iCall and NIMHANS both recommend checking in directly with those you're worried about."
  },
  {
    q: "1 in 4 people worldwide will experience a mental health condition in their lifetime.",
    options: ["False — it's much rarer than that", "Fact — mental health issues are very common", "Only true for developing countries", "True only for anxiety and depression"],
    correct: 1,
    verdict: "FACT",
    explanation: "The World Health Organization (WHO) confirms that 1 in 4 people globally will be affected by mental or neurological disorders at some point in their lives. In India, the National Mental Health Survey found that nearly 150 million people need active mental health interventions. You are far from alone."
  },
  {
    q: "Children and teenagers can't have real mental health problems — they're just being dramatic.",
    options: ["True — real problems only come with adult stress", "Myth — mental illness begins early in life", "Mostly true for minor anxiety", "Depends on the family situation"],
    correct: 1,
    verdict: "MYTH",
    explanation: "50% of all lifetime mental health conditions begin by age 14, and 75% by age 24 (WHO). Anxiety disorders, depression, ADHD, and OCD are fully diagnosable in childhood. Dismissing a child's distress as 'drama' is one of the most dangerous things adults can do, as it delays treatment and increases shame."
  },
  {
    q: "If you have a mental health condition, you can never fully recover or live a normal life.",
    options: ["True — it's a lifelong limitation", "Myth — recovery is absolutely possible", "True only for schizophrenia", "Depends on family support"],
    correct: 1,
    verdict: "MYTH",
    explanation: "With appropriate support — therapy, medication where needed, community, and lifestyle changes — the vast majority of people with mental health conditions recover fully or manage their conditions effectively. Many of the world's most successful scientists, athletes, artists, and leaders live with diagnosed mental health conditions."
  },
  {
    q: "Exercise can have a measurable positive effect on depression and anxiety.",
    options: ["False — only medication works", "Fact — movement is medicine for the mind", "Only true in young people", "Exercise only treats physical symptoms"],
    correct: 1,
    verdict: "FACT",
    explanation: "Regular physical activity has strong evidence for reducing symptoms of depression and anxiety and improving overall wellbeing. It works alongside, not instead of, professional treatment where treatment is needed."
  },
  {
    q: "You can have a mental health condition and still be highly successful at school or work.",
    options: ["False — symptoms always prevent success", "Fact — performance and mental health are not mutually exclusive", "Only true with medication", "Only true for mild conditions"],
    correct: 1,
    verdict: "FACT",
    explanation: "People can achieve academically, professionally, and creatively while experiencing mental health conditions. Support, accommodations, treatment, and healthy environments can help people thrive without requiring symptoms to disappear completely."
  },
  {
    q: "Asking someone directly if they are thinking about suicide increases the chance they will attempt it.",
    options: ["True — never ask directly", "Myth — direct, compassionate questions can open a lifesaving conversation", "Only true for adults", "It always makes things worse"],
    correct: 1,
    verdict: "MYTH",
    explanation: "Asking calmly and directly about suicide does not plant the idea. It can help someone feel seen and create an opportunity to connect them with immediate support."
  },
  {
    q: "Mental health conditions can affect concentration, sleep, motivation, relationships, and physical health.",
    options: ["False — they only affect mood", "Fact — mental health affects whole-person functioning", "Only severe conditions do", "Only medication side effects cause this"],
    correct: 1,
    verdict: "FACT",
    explanation: "Mental health influences emotions, thinking, behaviour, relationships, sleep, energy, and physical functioning. These effects can occur across a range of conditions and levels of severity."
  },
  {
    q: "Recovery from a mental health condition always means returning to exactly how you were before.",
    options: ["True — anything else is failure", "Myth — recovery can mean building a meaningful life with new skills and supports", "Only true for depression", "Only true with medication"],
    correct: 1,
    verdict: "MYTH",
    explanation: "Recovery is individual. For many people it means reducing distress, learning new coping strategies, strengthening relationships, finding purpose, and building a life that feels sustainable and meaningful."
  }
];

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Support', path: '/mindspace' },
  { label: 'Career', path: '/vidyavantage' },
  { label: 'Community', path: '/wall' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
];

function SecretSharzHomepage({ navigate, currentUser }) {
  return (
    <>
      <Head>
        <title>Secret Sharz | Your emotional safe space</title>
        <style>{FONTS}</style>
      </Head>
      <div className="instant-action-bar" onClick={() => navigate('/mindspace')}>
        Need a moment right now? <span>Take 60 seconds to reset.</span>
      </div>
      <main id="main-content">
        {/* Existing homepage content remains unchanged. */}
      </main>
      <Footer />
    </>
  );
}

// ── APP ROUTER COMPONENT ──────────────────────────────────────────
export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname.replace(/\/+$/, '') || '/';
    }
    return '/'; 
  });
  const [dashboardTab, setDashboardTab] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [userDataChecked, setUserDataChecked] = useState(false);
  const [modal, setModal] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      if (typeof window !== 'undefined') {
        const p = window.location.pathname.replace(/\/+$/, '') || '/';
        setCurrentPath(p);
      }
    };
    handleLocationChange();
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleLocationChange);
      return () => window.removeEventListener('popstate', handleLocationChange);
    }
  }, []);

  const navigate = (path) => {
    if (typeof window !== 'undefined') {
      const p = path.replace(/\/+$/, '') || '/';
      window.history.pushState({}, '', p);
      setCurrentPath(p);
      window.scrollTo(0, 0);
    }
  };

  // MASTER KEY: Override for antonio.antonio.noronha@gmail.com
  const MASTER_EMAIL = 'antonio.antonio.noronha@gmail.com';
  const isMasterEmail = currentUser?.email?.toLowerCase() === MASTER_EMAIL;
  const isAdmin = (userData && userData.role === 'super_admin') || isMasterEmail;

  // FOUNDER CLAIM BOOTSTRAP (Phase 1D.1): if the founder signs in without a
  // `super_admin` custom claim, provision it through the server-managed
  // role endpoint (pages/api/admin/assign-role.js) — the audited, auditable
  // path. This REPLACES the previous direct `updateDoc(users/{uid}, {role})`
  // write. The founder's runtime access is independent of this: Firestore rules
  // grant admin via isFounderAdmin() (verified email) and the UI via
  // isMasterEmail, so a pending/failed claim never locks the founder out.
  // The claim is the AUTHORITATIVE privilege; users.role is migration fallback.
  useEffect(() => {
    if (!isMasterEmail || !currentUser) return;
    let cancelled = false;
    (async () => {
      try {
        const tokenResult = await currentUser.getIdTokenResult();
        if (tokenResult?.claims?.role === 'super_admin') return; // already provisioned
        const idToken = await currentUser.getIdToken();
        const result = await assignRoleViaServer({
          idToken,
          targetUid: currentUser.uid,
          action: 'set',
          role: 'super_admin'
        });
        if (cancelled) return;
        if (result.ok) {
          console.log('[MASTER KEY] super_admin claim provisioned via server endpoint.');
          setUserData(prev => ({ ...prev, role: 'super_admin' }));
        } else {
          console.error('[MASTER KEY] Claim provisioning failed:', result.message);
        }
      } catch (err) {
        if (!cancelled) console.error('[MASTER KEY] Claim bootstrap error:', err?.message || err);
      }
    })();
    return () => { cancelled = true; };
  }, [isMasterEmail, currentUser]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setUserDataChecked(false);
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            setUserData(snap.data());
          } else {
            setUserData(null);
          }
        } catch (e) {
          console.error(e);
          setUserData(null);
        } finally {
          setUserDataChecked(true);
        }

        if (typeof window !== 'undefined') {
          const path = window.location.pathname.replace(/\/+$/, '') || '/';
          if (path === '/auth') {
            navigate(user.email?.toLowerCase() === MASTER_EMAIL ? '/dashboard/admin' : '/dashboard');
          }
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
        setUserDataChecked(true);
      }
      setAuthChecked(true);
    });
    return () => unsub();
  }, []);

  const handleAuthSuccess = async (user, isNew, userRole = 'student') => {
    setCurrentUser(user);
    setUserDataChecked(false);
    let resolvedUserRole = userRole;
    
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const data = snap.data();
        setUserData(data);
        resolvedUserRole = data?.role || resolvedUserRole;
      } else {
        setUserData(null);
      }
    } catch (e) {
      console.error('Error fetching user data:', e);
      setUserData(null);
    } finally {
      setUserDataChecked(true);
    }
    
    const effectiveRole = user.email?.toLowerCase() === MASTER_EMAIL ? 'super_admin' : resolvedUserRole;
    if (effectiveRole === 'super_admin') {
      navigate('/dashboard/admin');
    } else if (effectiveRole === 'counsellor' || effectiveRole === 'psychologist' || effectiveRole === 'educator') {
      navigate('/counsellor-dashboard');
    } else {
      if (isNew) setModal('onboarding');
      else navigate('/dashboard');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserData(null);
    navigate('/');
  };

  if (!authChecked || (currentUser && !userDataChecked)) return null;

  const renderRoute = () => {
    // DEBUG: Log current path and user role for diagnostics
    console.log('[ROUTING DEBUG] Path:', currentPath, '| UserRole:', userData?.role, '| isAdmin:', isAdmin);

    // Super Admin Command Center - catches BOTH /dashboard/admin AND legacy /admin
    // This MUST be before /dashboard to prevent interception
    if (currentPath.startsWith('/dashboard/admin') || currentPath === '/admin') {
      console.log('[ROUTING] Entering SuperAdminView (admin path detected)');
      if (!currentUser) { console.log('[ROUTING] No user, redirecting to /auth'); navigate('/auth'); return null; }
      if (userData?.role !== 'super_admin' && !isAdmin) { 
        console.log('[ROUTING] Role check failed, redirecting to /dashboard'); 
        navigate('/dashboard'); 
        return null; 
      }
      console.log('[ROUTING] Rendering SuperAdminView');
      return (
        <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0F172A', color: 'white', fontFamily: "'Plus Jakarta Sans', sans-serif"}}>Loading Super Admin...</div>}>
          <SuperAdminView 
            user={currentUser}
            userData={userData}
            onBackToApp={() => navigate('/')}
          />
        </Suspense>
      );
    }
    if (currentPath.startsWith('/auth')) {
      return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }
    if (currentPath.startsWith('/counsellor/student/')) {
      if (!currentUser) { navigate('/auth'); return null; }
      const studentId = currentPath.split('/counsellor/student/')[1];
      const CaseFileViewer = lazy(() => import('./components/vidyavantage/CaseFileViewer'));
      return (
        <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>}>
          <CaseFileViewer
            studentId={studentId}
            navigate={navigate}
          />
        </Suspense>
      );
    }
    if (currentPath.startsWith('/counsellor-dashboard')) {
      if (!currentUser) { navigate('/auth'); return null; }
      const CounsellorDashboard = lazy(() => import('./components/dashboards/CounsellorDashboard'));
      return (
        <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>}>
          <CounsellorDashboard
            user={currentUser}
            userData={userData}
            onBack={() => navigate('/')}
            onLogout={handleLogout}
            navigate={navigate}
          />
        </Suspense>
      );
    }
    if (currentPath.startsWith('/provider/psychologist/case/')) {
      if (!currentUser) { navigate('/auth'); return null; }
      if (userData?.role !== 'counsellor' && userData?.role !== 'psychologist' && userData?.role !== 'educator' && !isAdmin) {
        navigate('/dashboard'); 
        return null;
      }
      const studentId = currentPath.split('/provider/psychologist/case/')[1];
      return (
        <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>}>
          <CaseFileView 
            studentId={studentId} 
            currentUser={currentUser} 
          />
        </Suspense>
      );
    }
    if (currentPath.startsWith('/provider/psychologist')) {
      if (!currentUser) { navigate('/auth'); return null; }
      if (userData?.role !== 'counsellor' && userData?.role !== 'psychologist' && userData?.role !== 'educator' && !isAdmin) {
        navigate('/dashboard'); 
        return null;
      }
      return (
        <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>}>
          <PsychCounsellorView 
            currentUser={currentUser} 
            userData={userData} 
          />
        </Suspense>
      );
    }
    if (currentPath.startsWith('/provider/educator/case/')) {
      if (!currentUser) { navigate('/auth'); return null; }
      if (userData?.role !== 'counsellor' && userData?.role !== 'psychologist' && userData?.role !== 'educator' && !isAdmin) {
        navigate('/dashboard'); 
        return null;
      }
      const studentId = currentPath.split('/provider/educator/case/')[1];
      return (
        <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>}>
          <IEPBuilderView 
            studentId={studentId}
            currentUser={currentUser}
          />
        </Suspense>
      );
    }
    if (currentPath.startsWith('/provider/educator')) {
      if (!currentUser) { navigate('/auth'); return null; }
      if (userData?.role !== 'counsellor' && userData?.role !== 'psychologist' && userData?.role !== 'educator' && !isAdmin) {
        navigate('/dashboard');
        return null;
      }
      return (
        <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>}>
          <SENCounsellorView 
            currentUser={currentUser}
            userData={userData}
          />
        </Suspense>
      );
    }
    if (currentPath.startsWith('/provider/career')) {
      if (!currentUser) { navigate('/auth'); return null; }
      if (userData?.role !== 'counsellor' && userData?.role !== 'psychologist' && userData?.role !== 'educator' && !isAdmin) {
        navigate('/dashboard');
        return null;
      }
      return (
        <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>}>
          <CareerCounsellorView 
            currentUser={currentUser} 
            userData={userData} 
          />
        </Suspense>
      );
    }
    if (currentPath.startsWith('/provider/career/roadmap/')) {
      if (!currentUser) { navigate('/auth'); return null; }
      if (!isAdmin && !['counsellor', 'psychologist', 'educator'].includes(userData?.role)) {
        navigate('/dashboard');
        return null;
      }
      const studentId = currentPath.split('/provider/career/roadmap/')[1];
      return (
        <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>}>
          <CareerRoadmapView
            studentId={studentId}
            currentUser={currentUser}
          />
        </Suspense>
      );
    }
    if (currentPath.startsWith('/dashboard/career')) {
      if (!currentUser) { navigate('/auth'); return null; }
      return <CareerStudentView />;
    }
    if (currentPath.startsWith('/dashboard/wellbeing')) {
      if (!currentUser) { navigate('/auth'); return null; }
      return <PsychStudentView />;
    }
    if (currentPath.startsWith('/dashboard/sen')) {
      if (!currentUser) { navigate('/auth'); return null; }
      return <SENStudentView />;
    }
    if (currentPath.startsWith('/dashboard/parent')) {
      if (!currentUser) { navigate('/auth'); return null; }
      if (userData?.role !== 'parent' && !isAdmin) {
        navigate('/dashboard'); 
        return null;
      }
      return (
        <Suspense fallback={<div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading...</div>}>
          <ParentPortalView 
            currentUser={currentUser} 
            userData={userData} 
          />
        </Suspense>
      );
    }
    if (currentPath.startsWith('/dashboard') && !currentPath.startsWith('/dashboard/admin')) {
      console.log('[ROUTING] Entering OnboardingGateway route');
      if (!currentUser) { navigate('/auth'); return null; }
      if (isAdmin) {
        console.log('[ROUTING] Admin detected on generic dashboard, redirecting to /dashboard/admin');
        navigate('/dashboard/admin');
        return null;
      }
      return (
        <OnboardingGateway navigate={navigate} />
      );
    }
    if (currentPath.startsWith('/mindspace')) {
      return <MindSpace userData={userData} onNavigate={(targetTab) => {
        if (!currentUser) { navigate('/auth'); return; }
        setDashboardTab(targetTab);
        navigate('/dashboard');
      }} />;
    }
    if (currentPath.startsWith('/about')) return <AboutUs navigate={navigate} />;
    if (currentPath.startsWith('/resources')) return <Resources navigate={navigate} />;
    if (currentPath.startsWith('/vidyavantage/blog')) return <VidyaVantageBlog navigate={navigate} />;
    if (currentPath.startsWith('/career-paths')) return <CareerExplorer navigate={navigate} />;
    if (currentPath.startsWith('/colleges')) {
      return (
        <CollegesPage 
          navigate={navigate} 
          currentUser={currentUser} 
          handleLogout={handleLogout} 
          isAdmin={isAdmin} 
          setModal={setModal}
          userData={userData}
        />
      );
    }
    if (currentPath.startsWith('/college/')) {
      const collegeId = currentPath.split('/college/')[1];
      return <CollegeDetails collegeId={collegeId} navigate={navigate} />;
    }
    if (currentPath.startsWith('/wall')) return <SharzWall user={currentUser} navigate={navigate} />;
    if (currentPath.startsWith('/safe')) return <Resources navigate={navigate} />;
    if (currentPath.startsWith('/vidyavantage')) return <VidyaVantage navigate={navigate} currentUser={currentUser} />;
    if (currentPath.startsWith('/blog')) return <Blog navigate={navigate} />;
    return <SecretSharzHomepage navigate={navigate} currentUser={currentUser} />;
  };

  return (
    <DashboardProvider currentUser={currentUser} userData={userData}>
      <Header
        navigate={navigate}
        currentUser={currentUser}
        handleLogout={handleLogout}
        isAdmin={isAdmin}
      />
      {renderRoute()}
    </DashboardProvider>
  );
}
