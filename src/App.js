import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; 
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
import Blog from './Blog';
import Resources from './Resources';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');`;

const CSS = `
  :root {
    --sage:#4A7C59;--sage-light:#6FAA80;--sage-pale:#EBF4EE;--moss:#2D5240;
    --lavender:#7C6FA0;--lav-pale:#F0EDF8;--peach:#E8845A;--peach-pale:#FDF0EA;
    --sky:#5B9EBF;--sky-pale:#EAF4FA;--sand:#F7F3ED;--warm-white:#FDFCFA;
    --ink:#1E2820;--ink-soft:#3D4A40;--muted:#7A8A7D;--border:rgba(74,124,89,0.15);
    --shadow-sm:0 4px 16px rgba(30,40,32,0.06);--shadow-md:0 12px 40px rgba(30,40,32,0.10);
    --shadow-lg:0 20px 60px rgba(30,40,32,0.13);
    --r-sm:14px;--r-md:22px;--r-lg:32px;--r-xl:48px;
    --success:#2D7D46;
    --danger:#C0392B;
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

  /* ── TOP ACTION BAR ── */
  .instant-action-bar{background:var(--sage);color:white;text-align:center;padding:12px 20px;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.2s;position:sticky;top:0;z-index:1001;}
  .instant-action-bar:hover{background:var(--moss);}
  .instant-action-bar span{opacity:0.8;font-weight:400;margin-left:8px;}

  /* ── HERO SECTION ── */
  .ss-hero{min-height:85vh;display:flex;align-items:center;padding:80px 48px;position:relative;overflow:hidden;}
  .hero-bg-blob{position:absolute;border-radius:60% 40% 70% 30%/50% 60% 40% 50%;animation:blob 8s ease-in-out infinite;pointer-events:none;z-index:0;}
  .blob-1{width:500px;height:500px;background:radial-gradient(circle,rgba(74,124,89,0.08),transparent 70%);top:-100px;right:-100px;}
  .blob-2{width:350px;height:350px;background:radial-gradient(circle,rgba(124,111,160,0.07),transparent 70%);bottom:-50px;left:200px;animation-delay:-4s;}
  .hero-content{position:relative;z-index:1;max-width:760px; display: flex; flex-direction: column; align-items: flex-start;}
  .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:var(--sage-pale);border:1.5px solid rgba(74,124,89,0.2);color:var(--sage);padding:8px 18px;border-radius:50px;font-size:13px;font-weight:700;letter-spacing:0.3px;margin-bottom:28px;}
  .hero-eyebrow-dot{width:8px;height:8px;background:var(--sage);border-radius:50%;position:relative;}
  .hero-eyebrow-dot::after{content:'';position:absolute;inset:-3px;border:1.5px solid var(--sage);border-radius:50%;animation:pulse-ring 2s ease-out infinite;}
  .hero-h1{font-family:'Fraunces',serif;font-size:clamp(40px,5.5vw,72px);font-weight:700;line-height:1.1;color:var(--ink);letter-spacing:-1.5px;margin-bottom:16px;}
  .hero-h1 .underline-word{position:relative;display:inline-block;color:var(--sage);}
  .hero-sub{font-size:clamp(16px, 2vw, 18px);color:var(--ink-soft);line-height:1.6;max-width:650px;font-weight:500;}
  .hero-sub-main{font-size:clamp(18px, 2.5vw, 22px);color:var(--ink-soft);line-height:1.4;max-width:650px;font-weight:400;margin-bottom:24px; font-style: italic;}
  
  .hero-core-truth { background: rgba(74,124,89,0.05); border-left: 4px solid var(--sage); padding: 18px 24px; border-radius: 0 12px 12px 0; margin-bottom: 36px; font-size: 15px; color: var(--ink-soft); max-width: 600px;}
  .hero-core-truth p { margin:0 0 6px 0; }
  .hero-core-truth p:last-child { margin: 0; }

  .hero-actions{display:flex;gap:16px;flex-wrap:wrap;align-items:flex-start;margin-bottom: 32px; width: 100%;}
  .btn-primary{background:var(--sage);color:white;padding:16px 36px;border-radius:50px;font-size:16px;font-weight:700;border:none;cursor:pointer;font-family:inherit;box-shadow:0 8px 24px rgba(74,124,89,0.35);transition:all 0.25s;}
  .btn-primary:hover{background:var(--moss);transform:translateY(-2px);box-shadow:0 12px 32px rgba(74,124,89,0.4);}
  .btn-ghost{background:transparent;color:var(--ink-soft);padding:16px 28px;border-radius:50px;font-size:15px;font-weight:700;border:2px solid var(--border);cursor:pointer;font-family:inherit;transition:all 0.2s;display:flex;align-items:center;gap:8px;}
  .btn-ghost:hover{border-color:var(--sage);color:var(--sage);background:var(--sage-pale);}

  .trust-signals { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; font-weight: 600; color: var(--muted); }
  .trust-signals span { display: flex; align-items: center; gap: 6px; }

  .hero-right{position:absolute;right:48px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:20px;z-index:1;}
  .floating-card{background:white;border-radius:var(--r-md);padding:24px;box-shadow:var(--shadow-md);border:1px solid var(--border);max-width:300px;animation:floatUp 0.8s ease both;}
  .floating-card:nth-child(2){animation-delay:0.2s;margin-left:32px;}
  .fc-icon{font-size:32px;margin-bottom:12px;}
  .fc-label{font-size:11px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;}
  .fc-value{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--ink); line-height: 1.3;}
  .fc-sub{font-size:13px;color:var(--muted);margin-top:8px;}

  /* ── GLOBAL SECTION STYLES ── */
  .section{padding:100px 48px;}
  .section-alt{padding:100px 48px; background: white;}
  .section-eyebrow{font-size:13px;font-weight:800;color:var(--sage);letter-spacing:2px;text-transform:uppercase;margin-bottom:16px;display:block;}
  .section-h2{font-family:'Fraunces',serif;font-size:clamp(32px,4vw,48px);font-weight:700;color:var(--ink);line-height:1.15;letter-spacing:-0.5px;margin-bottom:20px;}
  .section-h2 em{font-style:italic;color:var(--sage);}
  .section-p{font-size:17px;color:var(--ink-soft);line-height:1.75;font-weight:400;max-width:680px;}
  .section-header{max-width:700px;margin:0 auto 50px;text-align:center;}
  .section-header .section-p{margin:0 auto;}

  /* ── INSTANT RELIEF SECTION ── */
  .relief-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-top: 40px; }
  .relief-card { background: white; border: 1px solid var(--border); border-radius: var(--r-md); padding: 32px 24px; text-align: center; box-shadow: var(--shadow-sm); transition: transform 0.2s; }
  .relief-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); border-color: var(--sage); }
  .relief-icon { font-size: 40px; margin-bottom: 20px; }
  .relief-title { font-weight: 700; color: var(--ink); font-size: 18px; margin-bottom: 10px;}
  
  /* ── CORE TRUTH BULLETS ── */
  .core-truth-bullets { display: flex; flex-direction: column; gap: 20px; margin: 40px auto 0; max-width: 700px; text-align: left; }
  .core-truth-bullet { display: flex; align-items: center; gap: 24px; font-size: 18px; color: var(--ink-soft); font-weight: 600; background: white; padding: 28px; border-radius: 20px; box-shadow: var(--shadow-sm); border: 1px solid var(--border); transition: transform 0.2s;}
  .core-truth-bullet:hover { transform: scale(1.02); border-color: var(--sage); }
  .core-truth-icon { background: var(--sage-pale); color: var(--sage); width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }

  /* ── PAIN MIRROR SECTION ── */
  .pain-mirror { padding: 80px 48px; background: var(--sand); text-align: center; }
  .pain-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; max-width: 1000px; margin: 40px auto; }
  .pain-card { background: white; border: 1px solid var(--border); border-radius: var(--r-md); padding: 32px 24px; font-size: 18px; color: var(--ink-soft); font-weight: 600; font-style: italic; box-shadow: var(--shadow-sm); }
  .pain-card::before { content: '"'; font-family: 'Fraunces', serif; font-size: 32px; color: var(--sage-light); display: block; margin-bottom: 10px; line-height: 0.5; }

  /* ── JOURNEY VISUALIZATION ── */
  .journey-container { display: flex; align-items: center; justify-content: space-between; overflow-x: auto; padding: 20px 0 40px; gap: 16px; scrollbar-width: none; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; }
  .journey-container::-webkit-scrollbar { display: none; }
  .journey-step { flex: 1; min-width: 160px; text-align: center; background: white; padding: 28px 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); position: relative; z-index: 2; box-shadow: 0 8px 32px rgba(0,0,0,0.2); scroll-snap-align: center; }
  .journey-arrow { color: var(--sage-light); font-weight: bold; font-size: 24px; flex-shrink: 0; }
  .journey-emoji { font-size: 36px; margin-bottom: 16px; }
  .journey-label { font-size: 16px; font-weight: 700; color: var(--ink); }

  /* ── S.H.A.R.E. Timeline ── */
  .share-grid{display:flex;flex-direction:column;gap:20px;max-width:800px;margin:40px auto 0;}
  .share-item{display:flex;align-items:flex-start;gap:24px;background:white;padding:36px;border-radius:var(--r-md);border:1px solid var(--border);box-shadow:var(--shadow-sm);transition:all 0.3s cubic-bezier(0.25,0.8,0.25,1);}
  .share-item:hover{transform:translateX(12px);border-color:var(--sage);box-shadow:var(--shadow-md);}
  .share-letter{width:64px;height:64px;background:var(--sage-pale);color:var(--sage);border-radius:16px;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:32px;font-weight:700;flex-shrink:0;}
  .share-text h4{font-size:22px;color:var(--ink);margin-bottom:10px;font-weight:700;display:flex;align-items:center;gap:10px;}
  .share-text p{font-size:16px;color:var(--ink-soft);line-height:1.6;margin:0;}

  /* ── Pillars Grid ── */
  .pillars-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;max-width:1200px;margin:0 auto;}
  .pillar-card{background:var(--warm-white);border-radius:var(--r-md);padding:40px 32px;border:1px solid var(--border);box-shadow:var(--shadow-sm);transition:all 0.3s;position:relative;overflow:hidden;display:flex;flex-direction:column;}
  .pillar-card::before{content:'';position:absolute;top:0;left:0;right:0;height:5px;}
  .pillar-card.share::before{background:linear-gradient(90deg,var(--peach),#F0A97A);}
  .pillar-card.mind::before{background:linear-gradient(90deg,var(--lavender),#A89DD0);}
  .pillar-card.guide::before{background:linear-gradient(90deg,var(--sage),var(--sage-light));}
  .pillar-card.safe::before{background:linear-gradient(90deg,var(--sky),#89C4E0);}
  .pillar-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg);border-color:white; background: white;}
  .pillar-icon{width:64px;height:64px;border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:24px;}
  .share .pillar-icon{background:var(--peach-pale);}
  .mind .pillar-icon{background:var(--lav-pale);}
  .guide .pillar-icon{background:var(--sage-pale);}
  .safe .pillar-icon{background:var(--sky-pale);}
  .pillar-title{font-family:'Fraunces',serif;font-size:24px;font-weight:600;color:var(--ink);margin-bottom:12px;}
  .pillar-desc{font-size:16px;color:var(--ink-soft);line-height:1.7;flex:1;}
  .pillar-features{margin-top:24px;display:flex;flex-direction:column;gap:10px;}
  .pillar-feat{font-size:14px;color:var(--ink-soft);font-weight:600;display:flex;align-items:flex-start;gap:10px;}
  .pillar-feat::before{content:'✓';color:var(--sage);font-weight:800;}
  .pillar-cta{margin-top:28px;padding-top:18px;border-top:1px solid var(--border);font-size:15px;font-weight:700;color:var(--sage);cursor:pointer;display:flex;align-items:center;gap:6px; transition: gap 0.2s;}
  .pillar-cta:hover{color:var(--moss); gap:10px;}

  /* ── Social Proof & Stats ── */
  .social-proof-section{padding:100px 0;overflow:hidden;background:linear-gradient(180deg,transparent,var(--sand));}
  .stats-strip { display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; margin-bottom: 60px; padding: 0 24px; }
  .stat-box { text-align: center; }
  .stat-box-num { font-family: 'Fraunces', serif; font-size: 48px; font-weight: 700; color: var(--sage); line-height: 1; margin-bottom: 8px; }
  .stat-box-label { font-size: 14px; font-weight: 700; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 1px; }

  .sp-slider{display:flex;gap:24px;padding:0 48px 24px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none; -webkit-overflow-scrolling: touch;}
  .sp-slider::-webkit-scrollbar{display:none;}
  .sp-card{background:white;padding:36px;border-radius:var(--r-md);box-shadow:var(--shadow-sm);min-width:360px;max-width:360px;scroll-snap-align:center;flex-shrink:0;border:1px solid var(--border);}
  .sp-stars{color:#F59E0B;font-size:18px;margin-bottom:20px;letter-spacing:3px;}
  .sp-quote{font-size:17px;color:var(--ink-soft);font-style:italic;margin-bottom:24px;line-height:1.6;}
  .sp-author{font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase; letter-spacing: 1px;}

  /* ── Origin Story ── */
  .story-section{padding:120px 48px;background:var(--sand);display:flex;align-items:center;justify-content:center;gap:80px;flex-wrap:wrap;}
  .story-content{max-width:580px;}
  .story-img-box{width:450px;height:550px;background:var(--sage-pale);border-radius:var(--r-lg);position:relative;display:flex;align-items:center;justify-content:center;font-size:80px;border:1px solid var(--border);}
  .story-img-box::after{content:'';position:absolute;inset:-15px;border:2px dashed var(--sage-light);border-radius:calc(var(--r-lg) + 10px);z-index:0;opacity:0.5;}
  
  /* ── B2B Pitch ── */
  .b2b-section{background:var(--ink);color:white;padding:120px 48px;display:flex;flex-direction:column;align-items:center;text-align:center;}
  .b2b-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;max-width:1100px;width:100%;margin-top:60px;text-align:left;}
  .b2b-card{background:rgba(255,255,255,0.05);padding:36px;border-radius:var(--r-md);border:1px solid rgba(255,255,255,0.1);transition:background 0.2s;}
  .b2b-card:hover{background:rgba(255,255,255,0.08);}

  /* ── Privacy & Objections ── */
  .safe-section{background:linear-gradient(135deg,var(--moss) 0%,#1E3D2A 100%);padding:120px 48px;text-align:center;position:relative;overflow:hidden;}
  .safe-content{position:relative;z-index:1;max-width:900px;margin:0 auto;}
  
  .aha-headline { font-size: clamp(40px, 5vw, 64px); color: white; font-family: 'Fraunces', serif; line-height: 1.1; margin-bottom: 20px;}
  .objection-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; margin: 60px 0 80px; }
  .objection-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; padding: 40px 24px; text-align: center; color: white; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 10px 30px rgba(0,0,0,0.15); }
  .objection-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
  .objection-card span { font-size: 56px; display: block; margin-bottom: 24px; }
  .objection-card h4 { font-size: 20px; font-weight: 700; margin: 0; color: white; }
  
  .privacy-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;text-align:left;margin-bottom:60px;}
  .privacy-item{background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05);padding:32px;border-radius:20px;display:flex;align-items:flex-start;gap:20px;}
  .privacy-item span{font-size:32px;}
  .privacy-item h4{color:white;margin:0 0 8px 0;font-size:18px;}
  .privacy-item p{color:rgba(255,255,255,0.6);margin:0;font-size:15px;line-height:1.6;}

  /* ── Modals & Quiz CSS ── */
  .modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(30,40,32,0.6);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease;}
  .modal{background:white;border-radius:var(--r-lg);padding:40px;max-width:520px;width:100%;box-shadow:var(--shadow-lg);animation:floatUp 0.3s ease;position:relative;}
  .modal-close{position:absolute;top:20px;right:20px;background:var(--sand);border:none;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);transition:all 0.2s;}
  .modal h3{font-family:'Fraunces',serif;font-size:26px;font-weight:700;color:var(--ink);margin-bottom:10px;}
  
  .quiz-entry-strip{background:linear-gradient(135deg,var(--lav-pale),var(--peach-pale));border:1.5px solid rgba(124,111,160,0.2);border-radius:var(--r-md);padding:32px 40px;display:flex;align-items:center;justify-content:space-between;gap:24px;max-width:1100px;margin:0 auto 40px;flex-wrap:wrap;}
  .quiz-entry-btn{background:var(--lavender);color:white;border:none;padding:16px 32px;border-radius:50px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s;white-space:nowrap;}
  
  /* ── MOBILE ENHANCEMENTS ── */
  @media(max-width:900px){
    .ss-hero{padding: 40px 24px; min-height: auto; text-align: center;}
    .hero-content{align-items: center; text-align: center;}
    .hero-eyebrow{margin: 0 auto 24px;}
    .hero-h1{font-size: clamp(42px, 10vw, 56px); letter-spacing: -1px;}
    .hero-sub{font-size: 16px;}
    
    .hero-core-truth{border-left: none; border-top: 4px solid var(--sage); border-radius: 16px; padding: 24px; text-align: left;}
    
    .hero-actions{flex-direction: column; gap: 16px; width: 100%; max-width: 400px; margin: 0 auto 32px; align-items: center;}
    .hero-actions > div { align-items: center !important; width: 100%; }
    .btn-primary, .btn-ghost{width: 100%; justify-content: center; align-self: center !important;}
    .hero-actions p { margin-left: 0 !important; text-align: center !important;}
    
    .trust-signals{justify-content: center;}
    .hero-right{display:none;}
    
    .section, .section-alt, .pain-mirror{padding: 64px 24px;}
    .section-h2{font-size: 32px;}
    .aha-headline {font-size: 36px;}
    
    .relief-grid { grid-template-columns: 1fr; }
    .pain-grid { grid-template-columns: 1fr; }
    
    .core-truth-bullets { padding: 0; }
    .core-truth-bullet { flex-direction: column; text-align: center; gap: 16px; padding: 24px; }
    
    .journey-container { padding-bottom: 20px; }
    
    .share-item { flex-direction: column; align-items: center; text-align: center; padding: 24px; }
    .share-text h4 { justify-content: center; }

    .story-section{padding: 64px 24px; gap: 40px; text-align: center;}
    .story-img-box{display:none;}
    
    .b2b-section { padding: 64px 24px; }
    .b2b-grid {grid-template-columns: 1fr; text-align: center;}
    
    .safe-section{padding: 64px 24px;}
    .objection-grid { grid-template-columns: 1fr 1fr; gap: 16px; }
    .privacy-grid{grid-template-columns:1fr; gap: 20px;}
    .privacy-item { flex-direction: column; align-items: center; text-align: center; padding: 24px;}
    
    .quiz-entry-strip{flex-direction:column;text-align:center; padding: 24px;}
    .quiz-entry-left{flex-direction:column;}
    
    .modal { padding: 32px 24px; max-height: 90vh; overflow-y: auto;}
    .sp-slider{padding:0 24px 24px;}
    .stats-strip { gap: 30px; }
  }
`;

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

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ currentUser, isAdmin, setModal, setShowQuiz, navigate }) {
  return (
    <>
      <Head>
        <title>Secret Sharz | #1 Anonymous Student Mental Health & Career Platform</title>
        <meta name="description" content="India's top anonymous emotional safe space and career discovery platform for students. Get free emotional first aid, vent anonymously, and plan your career with VidyaVantage." />
        <meta name="keywords" content="student mental health, anonymous venting, career guidance, Indian students, POCSO aligned, emotional support, VidyaVantage, Holland RIASEC" />
        <meta property="og:title" content="Secret Sharz | Anonymous Mental Health Support & Career Guidance" />
        <meta property="og:description" content="Fix your mind first. Then fix your future. Anonymous emotional safe space + career discovery platform for Indian students." />
        <meta property="og:image" content="/secret-sharz-logo.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/android-chrome-192x192.png" />
      </Head>

      {!currentUser && (
        <div className="instant-action-bar" onClick={() => navigate('/auth')}>
          Feeling overwhelmed right now? Start your healing journey in 30 seconds. <span>→</span>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="ss-hero">
        <div className="hero-bg-blob blob-1" /><div className="hero-bg-blob blob-2" />
        <div className="hero-content">
          <div className="hero-eyebrow anim-up"><div className="hero-eyebrow-dot" />Safe · Anonymous · For Indian Youth</div>
          <h1 className="hero-h1 anim-up-1">Fix your mind first. <br /><span className="underline-word">Then fix your future.</span></h1>
          
          <p className="hero-sub-main anim-up-2">
            The things you can't tell anyone... are exactly what's holding back your future.
          </p>
          <p className="hero-sub anim-up-2" style={{fontSize: '16px', fontWeight: '600'}}>
            Anonymous emotional support + career guidance platform for students.
          </p>
          
          <div className="hero-core-truth anim-up-3">
            <p><strong>You can't make life decisions when your mind is overwhelmed.</strong></p>
            <p>We help you clear your mind first — then guide your future.</p>
          </div>

          <div className="hero-actions anim-up-4">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <button className="btn-primary" onClick={() => navigate(currentUser ? '/dashboard' : '/auth')}>
                Start feeling better in 30 seconds →
              </button>
              <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '8px', marginLeft: '16px' }}>
                No login required to start.
              </p>
            </div>
            <button className="btn-ghost" onClick={() => setModal('talk')} style={{ alignSelf: 'flex-start' }}>💬 I Need to Talk to Someone</button>
          </div>

          <div className="trust-signals anim-up-4">
            <span>🧑‍⚕️ Built by school counsellors</span>
            <span>🛡️ Aligned with POCSO</span>
            <span>🇮🇳 Used by 12,000+ students</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="floating-card"><div className="fc-icon">🔥</div><div className="fc-label">Your Healing Journey</div><div className="fc-value">7-Day Calm Streak!</div><div className="fc-sub">Your average anxiety score dropped by 12% this week. Keep it up!</div></div>
          <div className="floating-card"><div className="fc-icon">💬</div><div className="fc-label">Recent Anonymous Post</div><div className="fc-value">"I feel like I'm falling behind everyone else..."</div><div className="fc-sub">12 students felt the same way today.</div></div>
        </div>
      </section>

      {/* 2. INSTANT RELIEF SECTION */}
      <section className="section-alt">
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <h2 className="section-h2">Feeling overwhelmed <em>right now?</em></h2>
          <p className="section-p">Try this. It works in under 60 seconds.</p>
        </div>
        <div className="relief-grid" style={{ maxWidth: '900px', margin: '0 auto 40px' }}>
          <div className="relief-card">
            <div className="relief-icon">🌬️</div>
            <div className="relief-title">Calm anxiety instantly</div>
            <p style={{ fontSize: '15px', color: 'var(--muted)' }}>Use our interactive 4-7-8 breathing visualizers.</p>
          </div>
          <div className="relief-card">
            <div className="relief-icon">🛑</div>
            <div className="relief-title">Stop overthinking loops</div>
            <p style={{ fontSize: '15px', color: 'var(--muted)' }}>Play the 'Pop the Thoughts' cognitive reset game.</p>
          </div>
          <div className="relief-card">
            <div className="relief-icon">🧭</div>
            <div className="relief-title">Get emotional clarity</div>
            <p style={{ fontSize: '15px', color: 'var(--muted)' }}>Map your feelings with our quick Mood Tracker.</p>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn-ghost" style={{ margin: '0 auto' }} onClick={() => navigate('/mindspace')}>Try Emotional First Aid →</button>
        </div>
      </section>

      {/* 3. CORE TRUTH SECTION */}
      <section className="section" style={{ background: 'var(--sand)' }}>
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <div className="section-eyebrow">THE SECRET SHARZ PROMISE</div>
          <h2 className="section-h2">Mental clarity creates <em>Career clarity.</em></h2>
        </div>
        <div className="core-truth-bullets">
          <div className="core-truth-bullet">
            <div className="core-truth-icon">🌪️</div>
            <div>Students are overwhelmed, not confused.</div>
          </div>
          <div className="core-truth-bullet">
            <div className="core-truth-icon">🧱</div>
            <div>Pressure and fear block mental clarity.</div>
          </div>
          <div className="core-truth-bullet">
            <div className="core-truth-icon">✨</div>
            <div>A calm mind creates confident life decisions.</div>
          </div>
        </div>
      </section>

      {/* 7. PAIN MIRROR SECTION (NEW) */}
      <section className="pain-mirror">
        <h2 className="section-h2">If this sounds like you, <em>you're not alone.</em></h2>
        <div className="pain-grid">
          <div className="pain-card">I feel behind everyone else.</div>
          <div className="pain-card">I don't know what I'm doing with my life.</div>
          <div className="pain-card">I'm tired but I can't rest.</div>
          <div className="pain-card">I can't talk to anyone about this.</div>
        </div>
        <button className="btn-primary" style={{marginTop: '20px'}} onClick={() => navigate(currentUser ? '/dashboard' : '/auth')}>Start here →</button>
      </section>

      {/* 4. S.H.A.R.E METHODOLOGY */}
      <section className="section-alt">
        <div className="section-header" style={{ marginBottom: '40px' }}>
          <h2 className="section-h2">How it works: The <em>S.H.A.R.E.</em> Journey</h2>
          <p className="section-p">We guide you through a proven psychological framework to take you from emotional overwhelm to total career confidence.</p>
        </div>
        <div className="share-grid" style={{ margin: '0 auto' }}>
          {SHARE_STEPS.map((step, i) => (
            <div key={i} className="share-item">
              <div className="share-letter">{step.letter}</div>
              <div className="share-text">
                <h4>{step.icon} {step.title}</h4>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* JOURNEY VISUALIZATION */}
      <section className="section" style={{ background: 'var(--ink)', color: 'white', textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '28px', marginBottom: '40px' }}>The Secret Sharz Transformation</h2>
        <div className="journey-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="journey-step"><div className="journey-emoji">😵</div><div className="journey-label">Overwhelmed</div></div>
          <div className="journey-arrow">→</div>
          <div className="journey-step"><div className="journey-emoji">🗣️</div><div className="journey-label">Finally heard</div></div>
          <div className="journey-arrow">→</div>
          <div className="journey-step"><div className="journey-emoji">🌿</div><div className="journey-label">Calm</div></div>
          <div className="journey-arrow">→</div>
          <div className="journey-step"><div className="journey-emoji">🧭</div><div className="journey-label">Clear</div></div>
          <div className="journey-arrow">→</div>
          <div className="journey-step"><div className="journey-emoji">🎯</div><div className="journey-label">Confident</div></div>
          <div className="journey-arrow">→</div>
          <div className="journey-step"><div className="journey-emoji">🚀</div><div className="journey-label">In control</div></div>
        </div>
      </section>

      {/* 5. THE PILLARS */}
      <section className="section-alt">
        <div className="section-header">
          <h2 className="section-h2">Everything you need to <em>feel better</em> — in one place.</h2>
        </div>
        <div className="pillars-grid">
          {PILLARS.map(p => (
            <div key={p.cls} className={`pillar-card ${p.cls}`}>
              <div className="pillar-icon">{p.icon}</div>
              <div className="pillar-title">{p.title}</div>
              <div className="pillar-desc">{p.desc}</div>
              <div className="pillar-features">{p.features.map((f, i) => <div key={i} className="pillar-feat">{f}</div>)}</div>
              <div className="pillar-cta" onClick={() => navigate(p.route)}>{p.cta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* B2B PITCH */}
      <section className="b2b-section" style={{ background: 'var(--moss)' }}>
        <div className="section-eyebrow" style={{ color:'var(--sage-pale)' }}>Institutional Partnerships</div>
        <h2 className="section-h2" style={{ color:'white' }}>For Schools & Counselors: <em>Proactive, Not Reactive.</em></h2>
        <p className="section-p" style={{ color:'rgba(255,255,255,0.8)' }}>Empower your student body with an anonymous, POCSO-aligned emotional safety net.</p>
        <div className="b2b-grid">
          <div className="b2b-card"><div style={{ fontSize:'36px', marginBottom:'15px' }}>🛡️</div><h3 style={{ fontFamily:'Fraunces, serif', fontSize:'22px', marginBottom:'10px' }}>Early Intervention</h3><p style={{ fontSize:'15px', color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>Our platform helps students self-regulate before stress turns into a crisis.</p></div>
          <div className="b2b-card"><div style={{ fontSize:'36px', marginBottom:'15px' }}>📊</div><h3 style={{ fontFamily:'Fraunces, serif', fontSize:'22px', marginBottom:'10px' }}>Anonymized Analytics</h3><p style={{ fontSize:'15px', color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>Gain high-level insights into the emotional health of your school without ever compromising an individual student's privacy.</p></div>
          <div className="b2b-card"><div style={{ fontSize:'36px', marginBottom:'15px' }}>🤝</div><h3 style={{ fontFamily:'Fraunces, serif', fontSize:'22px', marginBottom:'10px' }}>Seamless Integration</h3><p style={{ fontSize:'15px', color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>Deploy a complete mental health and career routing infrastructure to thousands of students in under 48 hours.</p></div>
        </div>
        <button className="btn-primary" style={{ marginTop:'40px', background:'white', color:'var(--moss)' }} onClick={() => setModal('talk')}>Schedule a School Demo</button>
      </section>

      {/* 6. SOCIAL PROOF & STATS */}
      <section className="social-proof-section" style={{ background: 'white', paddingTop: '100px' }}>
        <div className="stats-strip">
          <div className="stat-box"><div className="stat-box-num">12,000+</div><div className="stat-box-label">Students</div></div>
          <div className="stat-box"><div className="stat-box-num">50,000+</div><div className="stat-box-label">Emotions Shared</div></div>
          <div className="stat-box"><div className="stat-box-num">1,00,000+</div><div className="stat-box-label">Calming Sessions</div></div>
        </div>
        <div className="sp-header">Join a growing community finding their voice.</div>
        <div className="sp-slider">
          <div className="sp-card"><div className="sp-stars">★★★★★</div><div className="sp-quote">"I act strong in school but cry at night. I finally felt heard here."</div><div className="sp-author">Class 11 Student (Science)</div></div>
          <div className="sp-card"><div className="sp-stars">★★★★★</div><div className="sp-quote">"The 4-7-8 breathing tool actually stopped my panic attack before my physics board exam."</div><div className="sp-author">Class 12 Student (CBSE)</div></div>
          <div className="sp-card"><div className="sp-stars">★★★★★</div><div className="sp-quote">"I didn't know what to do with my life. The VidyaVantage match showed me paths I didn't even know existed."</div><div className="sp-author">College Fresher</div></div>
          <div className="sp-card"><div className="sp-stars">★★★★★</div><div className="sp-quote">"No judgement. No lecturing. Just real help when I felt completely alone."</div><div className="sp-author">Anonymous User • Bangalore</div></div>
        </div>
      </section>

      {/* QUIZ */}
      <section className="section-alt" style={{ paddingTop: '20px', paddingBottom: '100px' }}>
        <div className="quiz-entry-strip" style={{ margin: '0 auto' }}>
          <div className="quiz-entry-left">
            <div className="quiz-entry-icon">🧠</div>
            <div className="quiz-entry-text">
              <h4>How much do you really know about mental health?</h4>
              <p>20 myths vs. facts — answered instantly, explained with science. Takes 5 minutes.</p>
            </div>
          </div>
          <button className="quiz-entry-btn" onClick={() => setShowQuiz(true)}>
            Take the Quiz →
          </button>
        </div>
      </section>

      {/* THE ORIGIN STORY */}
      <section className="story-section">
        <div className="story-content">
          <div className="section-eyebrow">WHY WE BUILT THIS</div>
          <h2 className="section-h2" style={{ marginBottom:'24px' }}>
            Built from real conversations behind <em>closed doors.</em>
          </h2>
          <p className="section-p" style={{ color:'var(--ink-soft)' }}>
            For years, sitting in a school counseling room, the same pattern repeated itself. Brilliant, capable students were struggling silently under the weight of expectations and the fear of judgment.
          </p>
          <p className="section-p" style={{ color:'var(--ink-soft)', marginTop:'16px' }}>
            They couldn't talk to their parents. They wouldn't talk to their teachers.
          </p>
          <p className="section-p" style={{ color:'var(--ink-soft)', marginTop:'16px' }}>
            Secret Sharz was built to be the digital equivalent of that safe counseling room. It is a place where your identity doesn't matter, but your feelings do. We combine professional psychological support with the anonymity of the internet to reach students before they hit a breaking point.
          </p>
        </div>
        <div className="story-img-box" style={{ overflow: 'hidden', padding: 0 }}>
          <img 
            src="/20250508_103355.jpg" 
            alt="School Counselling" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} 
          />
        </div>
      </section>

      {/* AHA MOMENT, PRIVACY & FINAL CTA */}
      <section className="safe-section" style={{ background: 'var(--ink)' }}>
        <div className="safe-content">
          <div className="section-eyebrow" style={{ color: 'var(--sage)' }}>THE ANONYMOUS ADVANTAGE</div>
          <div className="aha-headline">Why Secret Sharz works when <em>talking to others doesn't.</em></div>
          
          <div className="objection-grid">
            <div className="objection-card"><span>⚖️</span><h4>No Judgment</h4></div>
            <div className="objection-card"><span>🎭</span><h4>No Identity</h4></div>
            <div className="objection-card"><span>📉</span><h4>No Expectations</h4></div>
            <div className="objection-card"><span>🚫</span><h4>No Consequences</h4></div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '60px 0' }} />

          <h2 className="section-h2" style={{ color: 'white' }}>This is a <em>judgment-free</em> zone. Always.</h2>
          <p className="section-p" style={{ color: 'rgba(255,255,255,0.6)' }}>Your safety is our only metric.</p>
          
          <div className="privacy-grid">
            <div className="privacy-item"><span>🔒</span><div><h4>No real names required.</h4><p>You interact using generated avatars and aliases.</p></div></div>
            <div className="privacy-item"><span>🚫</span><div><h4>No data selling.</h4><p>Your mental health data is yours. We never sell to third parties.</p></div></div>
            <div className="privacy-item"><span>🛡️</span><div><h4>End-to-end encrypted chat logs.</h4><p>Your conversations remain entirely private.</p></div></div>
            <div className="privacy-item"><span>🇮🇳</span><div><h4>Built under strict Indian child safety laws.</h4><p>POCSO aligned with human moderation.</p></div></div>
          </div>
          
          <div style={{ marginTop: '80px', padding: '60px 40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(32px, 5vw, 44px)', color: 'white', marginBottom: '10px', lineHeight: 1.2 }}>You've carried this alone for too long.</h2>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(24px, 3vw, 32px)', color: 'var(--sage-light)', marginBottom: '36px', fontWeight: '400' }}>You don't have to anymore.</h3>
            <button className="btn-primary" style={{ padding: '20px 48px', fontSize: '18px', width: '100%', maxWidth: '400px' }} onClick={() => navigate(currentUser ? '/dashboard' : '/auth')}>
              Start your safe space now →
            </button>
          </div>
        </div>
      </section>
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

  const isMasterEmail = currentUser?.email && btoa(currentUser.email.toLowerCase().trim()) === 'YW50b25pby5hbnRvbmlvLm5vcm9uaGFAZ21haWwuY29t';
  const isAdmin = (userData && userData.role === 'super_admin') || isMasterEmail;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const s = document.createElement('style');
      s.textContent = FONTS + CSS;
      document.head.appendChild(s);
      return () => {
        document.head.removeChild(s);
      };
    }
  }, []);

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

        if (typeof window !== 'undefined') {
          const path = window.location.pathname.replace(/\/+$/, '') || '/';
          if (path === '/auth' || path === '/') {
            navigate(isUserAdmin ? '/admin' : '/dashboard');
          }
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setAuthChecked(true);
    });
    return () => unsub();
  }, []); 

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
      navigate('/admin');
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

  if (!authChecked) return null;

  const renderRoute = () => {
    if (currentPath.startsWith('/admin')) {
      if (!isAdmin) { navigate('/'); return null; }
      return <AdminDashboard user={currentUser} onBackToApp={() => navigate('/')} />;
    }
    if (currentPath.startsWith('/auth')) {
      return <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }
    if (currentPath.startsWith('/dashboard')) {
      if (!currentUser) { navigate('/auth'); return null; }
      return (
        <StudentDashboard
          key={dashboardTab}
          user={currentUser}
          userData={userData}
          initialTab={dashboardTab}
          isAdmin={isAdmin}
          onAdmin={() => navigate('/admin')}
          onBack={() => navigate('/')}
          onLogout={handleLogout}
          onStartAssessment={() => navigate('/vidyavantage')}
        />
      );
    }
    if (currentPath.startsWith('/mindspace')) {
      return (
        <MindSpace
          userData={userData}
          onNavigate={(targetTab) => {
            if (!currentUser) {
              alert("You must be logged in to view your career data.");
              navigate('/auth');
              return;
            }
            setDashboardTab(targetTab);
            navigate('/dashboard');
          }}
        />
      );
    }
    if (currentPath.startsWith('/resources')) {
      return <Resources navigate={navigate} />;
    }
    if (currentPath.startsWith('/vidyavantage')) {
      return (
        <>
          <div className="instant-action-bar" style={{background: 'var(--ink)'}}>
            <button style={{background:'none', border:'none', color:'white', cursor:'pointer', fontWeight:'bold'}} onClick={() => navigate(currentUser ? '/dashboard' : '/')}>← Back to Secret Sharz</button>
          </div>
          <VidyaVantage onBack={() => navigate(currentUser ? '/dashboard' : '/')} />
        </>
      );
    }
    if (currentPath.startsWith('/blog')) {
      return <Blog />;
    }
    if (currentPath === '/') {
      return <HomePage currentUser={currentUser} isAdmin={isAdmin} setModal={setModal} setShowQuiz={setShowQuiz} navigate={navigate} />;
    }
    return (
      <div style={{minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <h1 style={{fontFamily:"'Fraunces', serif", fontSize:'80px', color:'var(--sage-pale)'}}>404</h1>
        <h2 style={{fontFamily:"'Fraunces', serif", fontSize:'24px', color:'var(--ink)'}}>Page not found</h2>
        <button className="btn-primary" style={{marginTop:'20px'}} onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showQuiz && <MythFactQuiz onClose={() => setShowQuiz(false)} />}
      {modal === 'talk' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
            <h3 style={{fontFamily: "'Fraunces', serif", fontSize:'24px', marginBottom:'10px'}}>You don't have to carry this alone</h3>
            <p style={{color:'var(--muted)', marginBottom:'20px'}}>Whether it's a small worry or something really heavy — reaching out is the bravest thing you can do.</p>
            <div style={{background:'var(--sage-pale)', padding:'16px', borderRadius:'12px', marginBottom:'12px'}}>
              <strong>🤖 Chat with AI Support</strong><br/>
              <span style={{fontSize:'13px', color:'var(--sage)'}}>Available right now. Gentle, non-judgemental guidance.</span>
            </div>
            <div style={{background:'#FFF0F0', padding:'16px', borderRadius:'12px'}}>
              <strong style={{color:'#C0392B'}}>🆘 Crisis Support Now</strong><br/>
              <span style={{fontSize:'13px', color:'#C0392B'}}>iCall: 9152987821 — Available 24/7</span>
            </div>
          </div>
        </div>
      )}

      {!currentPath.startsWith('/vidyavantage') && <Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />}
      <main style={{ flex: 1, position: 'relative' }}>
        {renderRoute()}
      </main>
      {!currentPath.startsWith('/vidyavantage') && <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={setModal} />}
    </div>
  );
}
