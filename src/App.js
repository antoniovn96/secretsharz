import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head'; // Added for SEO & OG Tags
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
    --shadow-sm:0 2px 12px rgba(30,40,32,0.07);--shadow-md:0 8px 32px rgba(30,40,32,0.10);
    --shadow-lg:0 20px 60px rgba(30,40,32,0.13);
    --r-sm:14px;--r-md:22px;--r-lg:32px;--r-xl:48px;
    --success:#2D7D46;
    --note-yellow:#FEF3C7;--note-yellow-dark:#D97706;
    --note-green:#D1FAE5;--note-green-dark:#059669;
    --note-purple:#EDE9FE;--note-purple-dark:#7C3AED;
    --note-blue:#DBEAFE;--note-blue-dark:#2563EB;
    --danger:#C0392B;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--warm-white);color:var(--ink);line-height:1.6;overflow-x:hidden;}

  @keyframes floatUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes blob{0%,100%{border-radius:60% 40% 70% 30%/50% 60% 40% 50%;}50%{border-radius:30% 70% 40% 60%/60% 30% 70% 40%;}}
  @keyframes pulse-ring{0%{transform:scale(1);opacity:0.6;}100%{transform:scale(1.5);opacity:0;}}
  @keyframes quizSlideIn{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}

  .anim-up{animation:floatUp 0.7s ease both;}
  .anim-up-1{animation:floatUp 0.7s 0.1s ease both;}
  .anim-up-2{animation:floatUp 0.7s 0.2s ease both;}
  .anim-up-3{animation:floatUp 0.7s 0.35s ease both;}
  .anim-up-4{animation:floatUp 0.7s 0.5s ease both;}

  .instant-action-bar{background:var(--sage);color:white;text-align:center;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.2s;position:sticky;top:0;z-index:1001;}
  .instant-action-bar:hover{background:var(--moss);}
  .instant-action-bar span{opacity:0.8;font-weight:400;margin-left:8px;}

  .ss-hero{min-height:85vh;display:flex;align-items:center;padding:60px 48px;position:relative;overflow:hidden;}
  .hero-bg-blob{position:absolute;border-radius:60% 40% 70% 30%/50% 60% 40% 50%;animation:blob 8s ease-in-out infinite;pointer-events:none;z-index:0;}
  .blob-1{width:500px;height:500px;background:radial-gradient(circle,rgba(74,124,89,0.08),transparent 70%);top:-100px;right:-100px;}
  .blob-2{width:350px;height:350px;background:radial-gradient(circle,rgba(124,111,160,0.07),transparent 70%);bottom:-50px;left:200px;animation-delay:-4s;}
  .blob-3{width:250px;height:250px;background:radial-gradient(circle,rgba(232,132,90,0.07),transparent 70%);top:40%;right:30%;animation-delay:-2s;}
  .hero-content{position:relative;z-index:1;max-width:680px;}
  .hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:var(--sage-pale);border:1.5px solid rgba(74,124,89,0.2);color:var(--sage);padding:8px 18px;border-radius:50px;font-size:13px;font-weight:600;letter-spacing:0.3px;margin-bottom:28px;}
  .hero-eyebrow-dot{width:7px;height:7px;background:var(--sage);border-radius:50%;position:relative;}
  .hero-eyebrow-dot::after{content:'';position:absolute;inset:-3px;border:1.5px solid var(--sage);border-radius:50%;animation:pulse-ring 2s ease-out infinite;}
  .hero-h1{font-family:'Fraunces',serif;font-size:clamp(36px,6vw,64px);font-weight:700;line-height:1.08;color:var(--ink);letter-spacing:-1.5px;margin-bottom:24px;}
  .hero-h1 em{font-style:italic;color:var(--sage);}
  .hero-h1 .underline-word{position:relative;display:inline-block;}
  .hero-h1 .underline-word::after{content:'';position:absolute;bottom:4px;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--peach),var(--lavender));border-radius:2px;}
  .hero-checklist{list-style:none;padding:0;margin-bottom:40px;}
  .hero-checklist li{display:flex;align-items:center;gap:10px;font-size:15px;color:var(--ink-soft);margin-bottom:8px;font-weight:500;}
  .hero-checklist li::before{content:'✓';color:var(--success);font-weight:bold;}
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

  .onboarding-steps-section{padding:40px 48px;background:var(--warm-white);text-align:center;}
  .steps-container{display:flex;justify-content:center;gap:40px;flex-wrap:wrap;max-width:1000px;margin:40px auto 0;}
  .step-card{flex:1;min-width:250px;text-align:left;padding:24px;background:white;border-radius:var(--r-md);border:1px solid var(--border);box-shadow:var(--shadow-sm);}
  .step-num{width:32px;height:32px;background:var(--sage-pale);color:var(--sage);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;margin-bottom:15px;}
  .step-title{font-weight:bold;color:var(--ink);margin-bottom:8px;}
  .step-desc{font-size:14px;color:var(--muted);line-height:1.6;}
  .punchline-section{text-align:center;padding:60px 20px 20px;}
  .punchline-text{font-family:'Fraunces',serif;font-size:clamp(24px,4vw,36px);font-weight:300;color:var(--ink-soft);font-style:italic;max-width:800px;margin:0 auto;line-height:1.4;}
  .social-proof-section{padding:40px 0 80px;overflow:hidden;background:linear-gradient(180deg,transparent,var(--sand));}
  .sp-header{text-align:center;font-size:14px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:2px;margin-bottom:30px;}
  .sp-slider{display:flex;gap:24px;padding:0 48px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-ms-overflow-style:none;}
  .sp-slider::-webkit-scrollbar{display:none;}
  .sp-card{background:white;padding:24px;border-radius:var(--r-md);box-shadow:var(--shadow-sm);min-width:320px;max-width:320px;scroll-snap-align:start;flex-shrink:0;border:1px solid var(--border);}
  .sp-stars{color:#F59E0B;font-size:14px;margin-bottom:12px;letter-spacing:2px;}
  .sp-quote{font-size:15px;color:var(--ink-soft);font-style:italic;margin-bottom:16px;line-height:1.6;}
  .sp-author{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;}
  .story-section{padding:100px 48px;background:white;display:flex;align-items:center;justify-content:center;gap:60px;flex-wrap:wrap;}
  .story-content{max-width:500px;}
  .story-img-box{width:400px;height:500px;background:var(--sage-pale);border-radius:var(--r-lg);position:relative;display:flex;align-items:center;justify-content:center;font-size:80px;border:1px solid var(--border);}
  .story-img-box::after{content:'';position:absolute;inset:-15px;border:2px dashed var(--sage-light);border-radius:calc(var(--r-lg) + 10px);z-index:0;opacity:0.5;}
  .b2b-section{background:var(--ink);color:white;padding:100px 48px;display:flex;flex-direction:column;align-items:center;text-align:center;}
  .b2b-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:30px;max-width:1000px;width:100%;margin-top:50px;text-align:left;}
  .b2b-card{background:rgba(255,255,255,0.05);padding:30px;border-radius:var(--r-md);border:1px solid rgba(255,255,255,0.1);}
  .onboard-options{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-top:20px;}
  .onboard-card{background:var(--sand);border:2px solid transparent;border-radius:12px;padding:20px;text-align:center;cursor:pointer;transition:0.2s;}
  .onboard-card:hover{border-color:var(--sage);transform:translateY(-3px);}
  .onboard-emoji{font-size:40px;margin-bottom:10px;}
  .onboard-title{font-weight:bold;color:var(--ink);margin-bottom:5px;}
  .onboard-desc{font-size:13px;color:var(--muted);}

  .section{padding:100px 48px;}
  .section-eyebrow{font-size:12px;font-weight:700;color:var(--sage);letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;}
  .section-h2{font-family:'Fraunces',serif;font-size:clamp(30px,4vw,46px);font-weight:700;color:var(--ink);line-height:1.15;letter-spacing:-0.5px;margin-bottom:16px;}
  .section-h2 em{font-style:italic;color:var(--sage);}
  .section-p{font-size:17px;color:var(--muted);line-height:1.75;font-weight:300;max-width:580px;}
  .section-header{max-width:700px;margin:0 auto 64px;text-align:center;}
  .section-header .section-p{margin:0 auto;}

  .pillars-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;max-width:1100px;margin:0 auto;}
  .pillar-card{background:white;border-radius:var(--r-md);padding:36px 32px;border:1.5px solid var(--border);box-shadow:var(--shadow-sm);transition:all 0.3s;position:relative;overflow:hidden;display:flex;flex-direction:column;}
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
  .pillar-desc{font-size:14px;color:var(--muted);line-height:1.7;flex:1;}
  .pillar-features{margin-top:20px;display:flex;flex-direction:column;gap:6px;}
  .pillar-feat{font-size:13px;color:var(--ink-soft);font-weight:500;display:flex;align-items:center;gap:8px;}
  .pillar-feat::before{content:'→';color:var(--sage);font-weight:700;}
  .pillar-cta{margin-top:24px;padding-top:15px;border-top:1px solid var(--border);font-size:14px;font-weight:bold;color:var(--sage);cursor:pointer;display:flex;align-items:center;gap:5px;}
  .pillar-cta:hover{color:var(--moss);}

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

  .vv-back-bar{background:var(--ink);padding:14px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid rgba(232,101,10,0.4);}
  .vv-back-btn{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.85);padding:8px 20px;border-radius:50px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;}
  .vv-back-btn:hover{background:rgba(255,255,255,0.15);color:white;}
  .vv-back-label{font-size:12px;color:rgba(255,255,255,0.35);font-weight:500;}
  .vv-back-label span{color:rgba(240,165,0,0.7);font-weight:700;}

  .safe-section{background:linear-gradient(135deg,var(--moss) 0%,#1E3D2A 100%);padding:100px 48px;text-align:center;position:relative;overflow:hidden;}
  .safe-content{position:relative;z-index:1;max-width:680px;margin:0 auto;}
  .safe-section .section-h2{color:white;}
  .safe-section .section-p{color:rgba(255,255,255,0.55);margin:0 auto 48px;}
  .privacy-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;text-align:left;margin-bottom:50px;}
  .privacy-item{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:20px;border-radius:12px;display:flex;align-items:flex-start;gap:12px;}
  .privacy-item span{font-size:24px;}
  .privacy-item h4{color:white;margin:0 0 5px 0;font-size:15px;}
  .privacy-item p{color:rgba(255,255,255,0.6);margin:0;font-size:13px;line-height:1.5;}
  .crisis-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-top:24px;text-align:left;}
  .crisis-box{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.15);border-radius:var(--r-md);padding:24px;display:flex;align-items:flex-start;gap:15px;transition:0.2s;}
  .crisis-box:hover{background:rgba(255,255,255,0.1);border-color:var(--sage-light);}
  .crisis-title{font-family:'Fraunces',serif;font-size:16px;font-weight:600;color:white;margin-bottom:4px;}
  .crisis-desc{font-size:12px;color:rgba(255,255,255,0.5);line-height:1.5;margin-bottom:10px;}
  .crisis-number{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:#6FAA80;}

  .modal-overlay{position:fixed;inset:0;z-index:1000;background:rgba(30,40,32,0.5);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn 0.2s ease;}
  .modal{background:white;border-radius:var(--r-lg);padding:48px;max-width:520px;width:100%;box-shadow:var(--shadow-lg);animation:floatUp 0.3s ease;position:relative;}
  .modal-close{position:absolute;top:20px;right:20px;background:var(--sand);border:none;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--muted);transition:all 0.2s;}
  .modal h3{font-family:'Fraunces',serif;font-size:26px;font-weight:700;color:var(--ink);margin-bottom:10px;}
  .modal p{font-size:15px;color:var(--muted);line-height:1.7;margin-bottom:24px;}
  .modal-actions{display:flex;gap:12px;margin-top:24px;}
  .btn-modal-primary{flex:1;padding:14px;background:var(--sage);color:white;border:none;border-radius:50px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;}
  .btn-modal-ghost{padding:14px 20px;background:transparent;color:var(--muted);border:2px solid var(--border);border-radius:50px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;}

  /* ── SHARZ WALL ── */
  .wall-page{min-height:100vh;background:var(--warm-white);padding-bottom:80px;}
  .wall-header{background:var(--ink);color:white;padding:60px 48px;text-align:center;border-bottom:4px solid var(--sage);}
  .wall-h1{font-family:'Fraunces',serif;font-size:clamp(32px,5vw,48px);margin-bottom:10px;}
  .wall-sub{color:rgba(255,255,255,0.7);font-size:16px;max-width:600px;margin:0 auto 30px;}
  .add-note-btn{background:var(--sage);color:white;border:none;padding:14px 30px;border-radius:50px;font-weight:bold;font-size:16px;cursor:pointer;box-shadow:0 4px 15px rgba(74,124,89,0.3);transition:all 0.2s;display:inline-flex;align-items:center;gap:8px;}
  .add-note-btn:hover{background:var(--moss);transform:translateY(-2px);}
  
  .masonry-grid{display:block;column-count:4;column-gap:24px;max-width:1400px;margin:40px auto;padding:0 48px;}
  .note-card{break-inside:avoid;margin-bottom:24px;padding:24px;border-radius:16px;box-shadow:var(--shadow-sm);position:relative;transition:transform 0.2s;cursor:pointer;}
  .note-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md);}
  .note-yellow{background:var(--note-yellow);color:var(--note-yellow-dark);}
  .note-green{background:var(--note-green);color:var(--note-green-dark);}
  .note-purple{background:var(--note-purple);color:var(--note-purple-dark);}
  .note-blue{background:var(--note-blue);color:var(--note-blue-dark);}
  .note-text{font-size:16px;line-height:1.6;font-weight:500;margin-bottom:16px;color:var(--ink);}
  .note-text.short{font-size:20px;font-family:'Fraunces',serif;}
  .note-tag{display:inline-block;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:bold;background:rgba(0,0,0,0.05);color:var(--ink-soft);margin-bottom:12px;text-transform:uppercase;letter-spacing:0.5px;}
  .note-footer{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(0,0,0,0.05);padding-top:12px;margin-top:12px;}
  .reaction-btn{background:transparent;border:none;color:inherit;opacity:0.7;font-weight:bold;cursor:pointer;display:flex;align-items:center;gap:5px;font-size:13px;transition:opacity 0.2s;}
  .reaction-btn:hover{opacity:1;}
  .scroll-msg{background:rgba(255,255,255,0.9);backdrop-filter:blur(5px);padding:12px 24px;border-radius:50px;font-weight:bold;color:var(--sage);display:inline-block;box-shadow:var(--shadow-sm);margin:20px auto;text-align:center;border:1px solid var(--border);}
  .note-modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
  .note-modal{background:white;width:100%;max-width:500px;border-radius:20px;padding:30px;box-shadow:var(--shadow-lg);}
  .note-textarea{width:100%;height:150px;border:1px solid var(--border);border-radius:12px;padding:15px;font-family:inherit;font-size:16px;resize:none;margin-bottom:15px;}
  .note-textarea:focus{outline:none;border-color:var(--sage);}
  .note-select{width:100%;padding:12px;border:1px solid var(--border);border-radius:8px;margin-bottom:15px;}
  .safety-error{color:var(--danger);font-size:14px;font-weight:600;margin-bottom:15px;background:#FFF0F0;padding:10px;border-radius:8px;}

  /* ── MYTH/FACT QUIZ STYLES ── */
  .quiz-overlay{position:fixed;inset:0;z-index:3000;background:rgba(30,40,32,0.65);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:16px;animation:fadeIn 0.25s ease;}
  .quiz-modal{background:white;border-radius:var(--r-lg);width:100%;max-width:620px;max-height:90vh;overflow-y:auto;box-shadow:var(--shadow-lg);animation:floatUp 0.35s ease;display:flex;flex-direction:column;}
  .quiz-modal::-webkit-scrollbar{width:4px;}
  .quiz-modal::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
  .quiz-header{background:linear-gradient(135deg,var(--moss),var(--sage));padding:28px 32px 24px;border-radius:var(--r-lg) var(--r-lg) 0 0;color:white;position:relative;}
  .quiz-header h2{font-family:'Fraunces',serif;font-size:24px;font-weight:700;margin-bottom:4px;}
  .quiz-header p{font-size:13px;color:rgba(255,255,255,0.7);margin:0;}
  .quiz-close{position:absolute;top:16px;right:16px;background:rgba(255,255,255,0.15);border:none;color:white;width:32px;height:32px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;}
  .quiz-close:hover{background:rgba(255,255,255,0.3);}
  .quiz-progress-bar{height:4px;background:rgba(255,255,255,0.2);border-radius:0;}
  .quiz-progress-fill{height:100%;background:rgba(255,255,255,0.85);border-radius:0;transition:width 0.4s ease;}
  .quiz-body{padding:28px 32px;flex:1;}
  .quiz-q-meta{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
  .quiz-q-num{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1.5px;}
  .quiz-score-live{font-size:12px;font-weight:700;color:var(--sage);background:var(--sage-pale);padding:4px 12px;border-radius:20px;}
  .quiz-question{font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:var(--ink);line-height:1.45;margin-bottom:22px;animation:quizSlideIn 0.3s ease;}
  .quiz-options{display:flex;flex-direction:column;gap:10px;margin-bottom:0;}
  .quiz-opt{width:100%;padding:14px 18px;border:2px solid var(--border);border-radius:12px;background:white;font-size:15px;font-weight:600;color:var(--ink-soft);cursor:pointer;text-align:left;font-family:inherit;transition:all 0.18s;display:flex;align-items:center;gap:10px;}
  .quiz-opt:hover:not(:disabled){border-color:var(--sage);background:var(--sage-pale);color:var(--ink);}
  .quiz-opt:disabled{cursor:default;}
  .quiz-opt.correct{border-color:var(--success);background:#E8F5EE;color:var(--success);}
  .quiz-opt.wrong{border-color:#C0392B;background:#FDECEA;color:#C0392B;}
  .quiz-opt.neutral-reveal{border-color:var(--success);background:#E8F5EE;color:var(--success);opacity:0.6;}
  .quiz-opt-icon{font-size:16px;flex-shrink:0;}
  .quiz-reveal{background:var(--sand);border-radius:12px;padding:16px 18px;margin-top:16px;animation:quizSlideIn 0.3s ease;}
  .quiz-reveal-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;}
  .quiz-reveal-badge.myth{background:#FEF3C7;color:#B45309;}
  .quiz-reveal-badge.fact{background:#D1FAE5;color:#065F46;}
  .quiz-reveal-text{font-size:14px;color:var(--ink-soft);line-height:1.7;}
  .quiz-footer{padding:0 32px 28px;display:flex;justify-content:flex-end;}
  .quiz-next-btn{background:var(--sage);color:white;border:none;padding:12px 28px;border-radius:50px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;transition:all 0.2s;margin-top:16px;}
  .quiz-next-btn:hover{background:var(--moss);}

  /* Quiz Results */
  .quiz-results{padding:32px;text-align:center;animation:floatUp 0.4s ease;}
  .quiz-results-trophy{font-size:64px;margin-bottom:12px;}
  .quiz-results h2{font-family:'Fraunces',serif;font-size:28px;font-weight:700;color:var(--ink);margin-bottom:6px;}
  .quiz-results-score{font-family:'Fraunces',serif;font-size:52px;font-weight:700;color:var(--sage);line-height:1;margin:16px 0 6px;}
  .quiz-results-sub{font-size:14px;color:var(--muted);margin-bottom:24px;}
  .quiz-results-msg{background:var(--sage-pale);border-radius:14px;padding:16px 20px;font-size:15px;color:var(--ink-soft);line-height:1.7;margin-bottom:24px;font-style:italic;}
  .quiz-results-breakdown{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;text-align:left;}
  .qrb-item{background:var(--sand);border-radius:10px;padding:14px 16px;}
  .qrb-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:4px;}
  .qrb-value{font-family:'Fraunces',serif;font-size:22px;font-weight:700;color:var(--ink);}
  .quiz-retake-btn{background:var(--sage);color:white;border:none;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;margin-right:10px;transition:all 0.2s;}
  .quiz-retake-btn:hover{background:var(--moss);}
  .quiz-close-btn{background:transparent;color:var(--muted);border:2px solid var(--border);padding:14px 28px;border-radius:50px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;}

  /* Quiz entry button on homepage */
  .quiz-entry-strip{background:linear-gradient(135deg,var(--lav-pale),var(--peach-pale));border:1.5px solid rgba(124,111,160,0.2);border-radius:var(--r-md);padding:24px 32px;display:flex;align-items:center;justify-content:space-between;gap:20px;max-width:1100px;margin:0 auto 40px;flex-wrap:wrap;}
  .quiz-entry-left{display:flex;align-items:center;gap:16px;}
  .quiz-entry-icon{font-size:36px;}
  .quiz-entry-text h4{font-family:'Fraunces',serif;font-size:20px;font-weight:700;color:var(--ink);margin-bottom:3px;}
  .quiz-entry-text p{font-size:13px;color:var(--muted);}
  .quiz-entry-btn{background:var(--lavender);color:white;border:none;padding:12px 28px;border-radius:50px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;transition:all 0.2s;white-space:nowrap;}
  .quiz-entry-btn:hover{background:#6A5D94;transform:translateY(-1px);}

  /* 404 page */
  .notfound-page{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:60px 24px;}
  .notfound-page h1{font-family:'Fraunces',serif;font-size:clamp(60px,10vw,120px);font-weight:700;color:var(--sage-pale);line-height:1;}
  .notfound-page h2{font-family:'Fraunces',serif;font-size:28px;color:var(--ink);margin:12px 0 16px;}
  .notfound-page p{font-size:16px;color:var(--muted);margin-bottom:28px;}

  /* Mobile specific enhancements */
  @media(max-width:900px){
    .ss-hero{padding:60px 24px;min-height:auto;text-align:center;}
    .hero-eyebrow{margin:0 auto 28px;}
    .hero-h1{font-size:clamp(32px,8vw,64px);}
    .hero-right{display:none;}
    .hero-actions{justify-content:center;width:100%;}
    .btn-primary, .btn-ghost{width:100%;justify-content:center;}
    
    .section{padding:64px 24px;}
    .vv-banner{flex-direction:column;padding:40px 28px;}
    .safe-section{padding:64px 24px;}
    .story-section{padding:64px 24px;gap:40px;}
    .story-img-box{display:none;}
    .privacy-grid{grid-template-columns:1fr;}
    .crisis-box{flex-direction:column;align-items:center;text-align:center;}
    
    .wall-header{padding:40px 24px;}
    .masonry-grid{column-count:2;padding:0 24px;}
    
    .quiz-modal{max-height:95vh;}
    .quiz-results-breakdown{grid-template-columns:1fr;}
    .quiz-entry-strip{flex-direction:column;text-align:center;}
    .quiz-entry-left{flex-direction:column;}
    
    .vv-back-bar{padding:12px 20px;}
  }
  @media(max-width:600px){
    .masonry-grid{column-count:1;}
  }
`;

// ── MENTAL HEALTH MYTH/FACT QUIZ DATA ────────────────────────────────────────
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
    options: ["False — only medication works", "Fact — movement is medicine for the mind", "Only true for mild cases", "Only aerobic exercise counts"],
    correct: 1,
    verdict: "FACT",
    explanation: "A landmark study in JAMA Psychiatry found that just 1 hour of exercise per week can prevent 12% of future depression cases. Exercise releases endorphins, reduces cortisol, promotes neurogenesis (new brain cell growth), and improves sleep — all directly tied to mental health. It works as an adjunct to therapy and medication, not a replacement."
  },
  {
    q: "People with mental illness are usually violent and dangerous.",
    options: ["True — it's well established", "Myth — they are more often victims than perpetrators", "Only true for psychosis", "It's complicated"],
    correct: 1,
    verdict: "MYTH",
    explanation: "This is one of the most damaging and widely held myths. People with mental health conditions are actually 10 times MORE likely to be the victims of violence than to perpetrate it. Most violent crimes are committed by people without any mental illness diagnosis. This stigma causes real harm by making people afraid to seek help."
  },
  {
    q: "India has fewer than 1 psychiatrist per 100,000 people.",
    options: ["False — India has adequate mental health coverage", "Fact — there is a severe mental health professional shortage", "True only for rural areas", "This used to be true but has improved"],
    correct: 1,
    verdict: "FACT",
    explanation: "India has approximately 0.3 psychiatrists per 100,000 people — one of the lowest ratios in the world (WHO Atlas). The treatment gap in India is enormous: over 80% of people with mental disorders receive no treatment at all. This is why platforms like Secret Sharz and digital mental health tools are critically important for young people."
  },
  {
    q: "Therapy is only for 'crazy' people with severe mental illness.",
    options: ["True — it's for extreme cases only", "Myth — therapy helps anyone who wants to grow", "Only useful if diagnosed", "True in India's cultural context"],
    correct: 1,
    verdict: "MYTH",
    explanation: "Therapy — particularly Cognitive Behavioural Therapy (CBT) — is evidence-based for everyone from high-performing executives to students dealing with exam stress. In fact, therapy works best as a preventative tool, before crises develop. Athletes, CEOs, and world leaders openly use therapy for performance, resilience, and self-awareness."
  },
  {
    q: "Sleep deprivation significantly increases the risk of anxiety and depression.",
    options: ["False — it's just tiredness", "Fact — sleep and mental health are deeply linked", "Only for people over 30", "Only if you sleep less than 4 hours"],
    correct: 1,
    verdict: "FACT",
    explanation: "Sleep and mental health have a bidirectional relationship — each affects the other. Research from Harvard Medical School shows that people with insomnia are 10 times more likely to develop clinical depression. During sleep, the brain processes emotional memories and clears toxic proteins. Teenagers need 8-10 hours; consistently sleeping less fundamentally alters mood regulation."
  },
  {
    q: "Using a phone before bed doesn't really affect your mental health.",
    options: ["True — screen time is overhyped", "Myth — blue light and content disrupt sleep and mood", "Only affects people under 16", "Only matters if you're already anxious"],
    correct: 1,
    verdict: "MYTH",
    explanation: "Blue light from screens suppresses melatonin production, delaying sleep onset by up to 90 minutes (Harvard study). Beyond light, the emotional content of social media — comparison culture, negative news, conflict — activates the brain's threat response. Studies link late-night social media use directly to increased anxiety, depression, and poor self-image in adolescents."
  },
  {
    q: "Meditation and mindfulness have been scientifically proven to reduce stress.",
    options: ["False — no real scientific evidence", "Fact — it changes measurable brain structure", "Only useful for spiritual people", "The research is too weak to conclude"],
    correct: 1,
    verdict: "FACT",
    explanation: "Neuroscientist Sara Lazar at Harvard found that 8 weeks of Mindfulness-Based Stress Reduction (MBSR) measurably thickened the prefrontal cortex (decision-making, emotional regulation) and shrank the amygdala (fear response) in participants. Mindfulness is now WHO-recommended for managing mild to moderate anxiety and depression."
  },
  {
    q: "Men are just as likely as women to experience depression.",
    options: ["False — depression is mostly a women's condition", "Fact — men are equally affected but less likely to seek help", "True only for clinical depression", "Men get it more but in a different form"],
    correct: 1,
    verdict: "FACT",
    explanation: "Depression affects men as frequently as women, but men are socialised to suppress emotions and less likely to seek help — making diagnosis and treatment far less common. Men are also 3-4 times more likely to die by suicide than women. In India, the cultural expectation of male stoicism ('be a man') is a significant barrier to young men getting the support they need."
  },
  {
    q: "If someone is smiling and seems happy, they definitely aren't suffering from depression.",
    options: ["True — you can always tell when someone is depressed", "Myth — 'smiling depression' is a real and common phenomenon", "Only false for very skilled actors", "Mostly true — you'd notice"],
    correct: 1,
    verdict: "MYTH",
    explanation: "'Smiling depression' refers to people who appear perfectly functional and even cheerful on the outside while experiencing major depressive disorder internally. Some of the most beloved comedians and performers in history — who made others laugh — died by suicide. This is why 'check in on your strong friends' is not just a phrase, it's a mental health imperative."
  },
  {
    q: "Childhood trauma can have lasting effects on brain development.",
    options: ["False — children are resilient and bounce back", "Fact — early adversity rewires the brain", "Only true for physical abuse", "The effects are gone by adulthood"],
    correct: 1,
    verdict: "FACT",
    explanation: "The CDC-Kaiser Adverse Childhood Experiences (ACEs) study found that childhood trauma — abuse, neglect, household dysfunction — physically alters brain structure, particularly the hippocampus (memory) and amygdala (fear). Children with 4+ ACEs have dramatically higher rates of depression, addiction, and physical illness as adults. Trauma-informed care is essential, not optional."
  },
  {
    q: "Social media has no real connection to rising rates of teen anxiety and depression.",
    options: ["True — screens are a scapegoat", "Myth — the correlation is well-established for heavy use", "Only true in Western countries", "Only affects girls, not boys"],
    correct: 1,
    verdict: "MYTH",
    explanation: "Psychologist Jean Twenge's analysis of 500,000+ adolescents found that teens who spend 5+ hours daily on social media are 66% more likely to have at least one suicide risk factor. Heavy social media use is linked to social comparison, cyberbullying, sleep disruption, and the fear of missing out (FOMO). Moderate use (under 2 hours/day) shows much weaker negative effects."
  },
  {
    q: "Antidepressants change your personality and make you 'not yourself'.",
    options: ["True — they alter who you are fundamentally", "Myth — they restore chemical balance without changing identity", "Only true for SSRIs", "Depends on the dosage"],
    correct: 1,
    verdict: "MYTH",
    explanation: "When prescribed correctly, antidepressants don't create a new personality — they remove the depressive fog that was suppressing your real one. Most patients report feeling 'more like themselves', not less. However, the right medication, dosage, and combination is highly individual and should always be managed by a qualified psychiatrist, never self-prescribed."
  },
  {
    q: "The gut-brain connection is real — what you eat affects your mood.",
    options: ["False — food and mood aren't scientifically linked", "Fact — the gut produces 90% of the body's serotonin", "Only true for people with gut disorders", "The research is too new to be reliable"],
    correct: 1,
    verdict: "FACT",
    explanation: "The gut produces approximately 90-95% of the body's serotonin — the key neurotransmitter for mood regulation. The gut-brain axis (via the vagus nerve) creates a constant two-way communication system. A 2017 study published in BMC Medicine found that a Mediterranean-style diet reduced depression risk by 33%. 'You are what you eat' is neurologically literal."
  },
  {
    q: "Asking for help is a sign of weakness.",
    options: ["True — you should handle things yourself", "Myth — asking for help is one of the bravest things you can do", "Only true if you ask too often", "It depends on what you're asking about"],
    correct: 1,
    verdict: "MYTH",
    explanation: "Seeking help requires self-awareness (knowing something is wrong), vulnerability (admitting it to someone), and courage (taking action despite fear of judgement). These are advanced emotional intelligence skills. The most high-performing humans on the planet — elite athletes, world leaders, successful entrepreneurs — all have coaches, therapists, and mentors. Isolation is weakness. Connection is strength."
  },
  {
    q: "Young people in India who seek counselling risk social stigma and family shame.",
    options: ["False — stigma is disappearing quickly", "Fact — stigma is real but seeking help matters more", "Only in rural areas", "Only if others find out"],
    correct: 1,
    verdict: "FACT",
    explanation: "Stigma around mental health remains a serious barrier in India — NIMHANS research shows 70%+ of Indians feel embarrassed about having a mental health condition. However, this stigma is changing: Gen Z is the most open generation about mental health in India's history. Starting confidentially — with anonymous platforms, journaling, or trusted individuals — is a completely valid and often necessary first step toward formal care."
  },
];

const PILLARS = [
  { cls:'mind', icon:'🧠', title:'Mind Space', desc:'A private sanctuary for your thoughts. Track your mood, journal freely, and access science-backed tools for anxiety, stress, and emotional wellbeing.', features:['Daily mood check-in & tracking','Guided journaling with AI prompts','Breathing & grounding exercises'], cta:'Try Mood Tracker →', route:'/mindspace' },
  { cls:'share', icon:'💬', title:'Sharz Wall', desc:"Share what's on your heart anonymously. Read stories from young people just like you. Know that you are never, ever alone in what you feel.", features:['100% anonymous sharing','Peer reactions & support','Moderated safe community'], cta:'Read Anonymous Stories →', route:'/wall' },
  { cls:'guide', icon:'🧭', title:'Life Guide', desc:"Navigate life's toughest decisions — from family pressure and friendships to career choices and your future — with guidance designed for young Indians.", features:['Career path discovery','Life skills & decision tools','Expert article library'], cta:'Explore Life Guidance →', route:'/guide' },
  { cls:'safe', icon:'🛡️', title:'Safe Corner', desc:"If things feel too heavy to carry, you don't have to carry them alone. Access trained counsellors, crisis support, and emergency helplines instantly.", features:['24/7 crisis helpline access','Connect with trained counsellors','Report unsafe situations privately'], cta:'View Safety Protocols →', route:'/safe' },
];

const generateWallData = () => {
  const rawShorts = [
    "I act strong in school but cry at night.",
    "Everyone thinks I'm okay. I'm not.",
    "I wish someone asked me if I'm actually happy.",
    "I'm tired… but I can't rest.",
    "Marks feel like my entire identity.",
    "I don't hate studying. I hate the pressure.",
    "I just want peace in my head.",
    "I laugh a lot… but it's fake sometimes.",
    "Why is being a good child so exhausting?",
    "I overthink everything."
  ];
  const tags = ["Class 10 • Section A","Class 12 • CBSE","Class 11 • Science","College Fresher","Drop Year Student"];
  const colors = ["note-yellow","note-green","note-purple","note-blue"];
  const notes = [];
  notes.push({ id:'l1', type:'long', text:"I'm in Class 11 and everyone around me seems to have their life figured out… I chose science because everyone said it's the 'best option', but I feel lost every day… I don't even know if I like what I'm studying anymore…", tag:"Class 11 • Science", color:"note-purple", reactions:128 });
  notes.push({ id:'l2', type:'long', text:"My parents think I'm just lazy, but I feel so mentally tired all the time… I try to study but my mind just keeps racing. I wish they understood that I'm trying my best.", tag:"Class 10 • Section B", color:"note-blue", reactions:89 });
  notes.push({ id:'l3', type:'long', text:"Moving to a new city was supposed to be exciting… but I feel more alone than ever. Making friends is so hard when you're an introvert.", tag:"College Fresher", color:"note-green", reactions:45 });
  for (let i = 0; i < 119; i++) {
    notes.push({
      id: `s${i}`,
      type:'short',
      text: rawShorts[Math.floor(Math.random() * rawShorts.length)],
      tag: tags[Math.floor(Math.random() * tags.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      reactions: Math.floor(Math.random() * 50) + 5
    });
  }
  return notes.sort(() => Math.random() - 0.5);
};

// ── MYTH/FACT QUIZ COMPONENT ─────────────────────────────────────────────────
function MythFactQuiz({ onClose }) {
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUIZ_QUESTIONS[qIndex];
  const total = QUIZ_QUESTIONS.length;
  const answered = selected !== null;

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    if (idx === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (qIndex < total - 1) {
      setQIndex(i => i + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  };

  const handleRetake = () => {
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  const pct = Math.round((score / total) * 100);
  const resultMsg =
    pct >= 80 ? "You're impressively well-informed about mental health. Your awareness makes you a better friend, student, and advocate." :
    pct >= 60 ? "Solid! You know quite a bit, but a few myths slipped through. Keep learning — every myth you bust helps reduce stigma." :
    pct >= 40 ? "You're on your way. Many of these myths are deeply embedded in our culture. The fact that you're here, learning, already puts you ahead." :
    "Don't worry — this quiz exposed some deeply ingrained myths. Now you're armed with the truth. Share what you've learned with someone you care about.";

  return (
    <div className="quiz-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="quiz-modal" onClick={e => e.stopPropagation()}>
        {!done ? (
          <>
            <div className="quiz-header">
              <button className="quiz-close" onClick={onClose}>✕</button>
              <h2>🧠 Mental Health: Myth or Fact?</h2>
              <p>20 questions · answers explained instantly · no judgement</p>
              <div className="quiz-progress-bar" style={{ marginTop: '16px' }}>
                <div className="quiz-progress-fill" style={{ width: `${((qIndex + 1) / total) * 100}%` }} />
              </div>
            </div>

            <div className="quiz-body">
              <div className="quiz-q-meta">
                <span className="quiz-q-num">Question {qIndex + 1} of {total}</span>
                <span className="quiz-score-live">✓ {score} correct</span>
              </div>
              <div className="quiz-question">{q.q}</div>
              <div className="quiz-options">
                {q.options.map((opt, i) => {
                  let cls = 'quiz-opt';
                  let icon = '○';
                  if (answered) {
                    if (i === q.correct) { cls += ' correct'; icon = '✓'; }
                    else if (i === selected && i !== q.correct) { cls += ' wrong'; icon = '✗'; }
                    else { cls += ' neutral-reveal'; icon = ' '; }
                  }
                  return (
                    <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={answered}>
                      <span className="quiz-opt-icon">{icon}</span>{opt}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="quiz-reveal">
                  <div className={`quiz-reveal-badge ${q.verdict === 'MYTH' ? 'myth' : 'fact'}`}>
                    {q.verdict === 'MYTH' ? '🚫 Myth' : '✅ Fact'} — {selected === q.correct ? 'You got it!' : 'Not quite'}
                  </div>
                  <div className="quiz-reveal-text">{q.explanation}</div>
                </div>
              )}
            </div>

            {answered && (
              <div className="quiz-footer">
                <button className="quiz-next-btn" onClick={handleNext}>
                  {qIndex < total - 1 ? 'Next Question →' : 'See My Results →'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="quiz-results">
            <button className="quiz-close" style={{ position: 'absolute', top: '16px', right: '16px' }} onClick={onClose}>✕</button>
            <div className="quiz-results-trophy">
              {pct >= 80 ? '🏆' : pct >= 60 ? '🌟' : pct >= 40 ? '🌱' : '💪'}
            </div>
            <h2>Quiz Complete!</h2>
            <div className="quiz-results-score">{score}/{total}</div>
            <div className="quiz-results-sub">{pct}% correct</div>
            <div className="quiz-results-msg">&quot;{resultMsg}&quot;</div>
            <div className="quiz-results-breakdown">
              <div className="qrb-item">
                <div className="qrb-label">Correct</div>
                <div className="qrb-value" style={{ color: 'var(--success)' }}>✓ {score}</div>
              </div>
              <div className="qrb-item">
                <div className="qrb-label">Incorrect</div>
                <div className="qrb-value" style={{ color: '#C0392B' }}>✗ {total - score}</div>
              </div>
              <div className="qrb-item">
                <div className="qrb-label">Accuracy</div>
                <div className="qrb-value">{pct}%</div>
              </div>
              <div className="qrb-item">
                <div className="qrb-label">Myths Busted</div>
                <div className="qrb-value">🧠 {score}</div>
              </div>
            </div>
            <div>
              <button className="quiz-retake-btn" onClick={handleRetake}>🔄 Retake Quiz</button>
              <button className="quiz-close-btn" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
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
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/png';
      favicon.href = '/android-chrome-192x192.png';
      document.head.appendChild(favicon);
      return () => {
        document.head.removeChild(s);
        document.head.removeChild(favicon);
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

  const handleSaveAssessment = async (results) => {
    if (!currentUser) {
      alert("Please sign in to save your results!");
      navigate('/auth');
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
      navigate('/dashboard');
    } catch (err) { console.error("Error saving assessment:", err); }
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
    if (currentPath.startsWith('/wall')) {
      return <WallPage navigate={navigate} />; // Pass navigate to WallPage
    }
if (currentPath.startsWith('/resources')) {
      return <Resources navigate={navigate} />;
    }
    if (currentPath.startsWith('/vidyavantage')) {
      return (
        <>
          <div className="vv-back-bar">
            <button className="vv-back-btn" onClick={() => navigate(currentUser ? '/dashboard' : '/')}>← Back to Secret Sharz</button>
            <div className="vv-back-label">VidyaVantage is a subsidiary of <span>SecretSharz</span></div>
          </div>
          <VidyaVantage onBack={() => navigate(currentUser ? '/dashboard' : '/')} onSave={handleSaveAssessment} />
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
      <div className="notfound-page">
        <h1>404</h1>
        <h2>Page not found</h2>
        <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <button className="btn-primary" onClick={() => navigate('/')}>← Back to Home</button>
      </div>
    );
  };

  const isVidyaVantage = currentPath.startsWith('/vidyavantage');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {showQuiz && <MythFactQuiz onClose={() => setShowQuiz(false)} />}

      {modal === 'onboarding' && (
        <div className="modal-overlay" onClick={() => { setModal(null); navigate('/dashboard'); }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setModal(null); navigate('/dashboard'); }}>✕</button>
            <h3>Welcome to your Safe Space.</h3>
            <p>How are you feeling right now? We&apos;ll suggest a good place to start.</p>
            <div className="onboard-options">
              <div className="onboard-card" onClick={() => { setDashboardTab('mindspace'); setModal(null); navigate('/dashboard'); }}>
                <div className="onboard-emoji">🌪️</div>
                <div className="onboard-title">Anxious or Overwhelmed</div>
                <div className="onboard-desc">Try a quick breathing exercise</div>
              </div>
              <div className="onboard-card" onClick={() => { setDashboardTab('community'); setModal(null); navigate('/dashboard'); }}>
                <div className="onboard-emoji">🗣️</div>
                <div className="onboard-title">I need to vent</div>
                <div className="onboard-desc">Write an anonymous post</div>
              </div>
              <div className="onboard-card" onClick={() => { setDashboardTab('home'); setModal(null); navigate('/dashboard'); }}>
                <div className="onboard-emoji">🧭</div>
                <div className="onboard-title">Lost about my future</div>
                <div className="onboard-desc">Start your career profile</div>
              </div>
              <div className="onboard-card" onClick={() => { setDashboardTab('home'); setModal(null); navigate('/dashboard'); }}>
                <div className="onboard-emoji">😌</div>
                <div className="onboard-title">I&apos;m doing okay</div>
                <div className="onboard-desc">Just take me to my dashboard</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'talk' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
            <h3>You don&apos;t have to carry this alone</h3>
            <p>Whether it&apos;s a small worry or something really heavy — reaching out is the bravest thing you can do.</p>
            {[
              { icon:'🤖', title:'Chat with AI Support', desc:'Available right now. Gentle, non-judgemental guidance.', color:'var(--sage-pale)', textColor:'var(--sage)' },
              { icon:'📞', title:'Talk to a Real Counsellor', desc:'Trained counsellors available. First session always free.', color:'var(--peach-pale)', textColor:'var(--peach)' },
              { icon:'🆘', title:'Crisis Support Now', desc:'iCall: 9152987821 — Available 24/7', color:'#FFF0F0', textColor:'#C0392B' },
            ].map((opt, i) => (
              <div key={i} onClick={() => setModal(null)} style={{ display:'flex', alignItems:'center', gap:'16px', background:opt.color, borderRadius:'var(--r-sm)', padding:'16px 18px', marginBottom:'10px', cursor:'pointer', border:'1.5px solid transparent', transition:'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = opt.textColor}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                <span style={{ fontSize:'24px' }}>{opt.icon}</span>
                <div>
                  <div style={{ fontSize:'14px', fontWeight:'600', color:opt.textColor, marginBottom:'2px' }}>{opt.title}</div>
                  <div style={{ fontSize:'12px', color:'var(--muted)' }}>{opt.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isVidyaVantage && <Header navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} isAdmin={isAdmin} />}
      <main style={{ flex: 1, position: 'relative' }}>
        {renderRoute()}
      </main>
      {!isVidyaVantage && <Footer navigate={navigate} currentUser={currentUser} handleLogout={handleLogout} setModal={setModal} />}
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ currentUser, isAdmin, setModal, setShowQuiz, navigate }) {
  return (
    <>
      {/* 🚀 SEO METADATA FOR HOMEPAGE 🚀 */}
      <Head>
        <title>Secret Sharz | Anonymous Mental Health Support for Youth</title>
        <meta name="description" content="A safe, anonymous space for students to track moods, share thoughts, and access professional crisis support and career guidance." />
        <meta property="og:title" content="Secret Sharz | Anonymous Mental Health Support" />
        <meta property="og:description" content="A safe, anonymous space for students to track moods, share thoughts, and access professional crisis support and career guidance." />
        <meta property="og:image" content="/secret-sharz-logo.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {!currentUser && (
        <div className="instant-action-bar" onClick={() => navigate('/auth')}>
          Feeling overwhelmed right now? Start your healing journey in 30 seconds. <span>→</span>
        </div>
      )}

      <section className="ss-hero">
        <div className="hero-bg-blob blob-1" /><div className="hero-bg-blob blob-2" /><div className="hero-bg-blob blob-3" />
        <div className="hero-content">
          <div className="hero-eyebrow anim-up"><div className="hero-eyebrow-dot" />Safe · Anonymous · For Indian Youth</div>
          <h1 className="hero-h1 anim-up-1">Anonymous mental health <br />support for students —<br /><span className="underline-word">anytime, anywhere</span></h1>
          <ul className="hero-checklist anim-up-2">
            <li>Takes 30 seconds to start</li>
            <li>No real name required</li>
            <li>100% free for students</li>
          </ul>
          <div className="hero-actions anim-up-3">
            <button className="btn-primary" onClick={() => navigate(currentUser ? '/dashboard' : '/auth')}>
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
          <div className="floating-card"><div className="fc-icon">🔥</div><div className="fc-label">Your Healing Journey</div><div className="fc-value">7-Day Calm Streak!</div><div className="fc-sub">Your average anxiety score dropped by 12% this week. Keep it up!</div><div className="fc-bar"><div className="fc-bar-fill" style={{ width:'85%', background:'var(--success)' }} /></div></div>
          <div className="floating-card"><div className="fc-icon">💬</div><div className="fc-label">Recent Anonymous Post</div><div className="fc-value">&quot;I feel like I&apos;m falling behind everyone else in my class...&quot;</div><div className="fc-sub">12 students felt the same way today.</div></div>
          <div className="floating-card"><div className="fc-icon">🎓</div><div className="fc-label">VidyaVantage Match</div><div className="fc-value">Psychology — 94%</div><div className="fc-sub">Your RIASEC code: ISA · See your report</div><div className="fc-bar"><div className="fc-bar-fill" style={{ width:'94%', background:'linear-gradient(90deg,#E8650A,#F0A500)' }} /></div></div>
        </div>
      </section>

      <section className="punchline-section anim-up-4">
        <h2 className="punchline-text">&quot;The things you can&apos;t tell anyone... <br /><span style={{ color:'var(--sage)', fontWeight:'600' }}>you can tell us.</span>&quot;</h2>
      </section>

      <section className="onboarding-steps-section">
        <div className="section-eyebrow">Your First 5 Minutes</div>
        <h2 className="section-h2">You don&apos;t have to have the right words. <em>Just start.</em></h2>
        <p className="section-p" style={{ margin:'0 auto' }}>Most students join us during exam stress, family pressure, or major life decisions. We make it easy to begin.</p>
        <div className="steps-container">
          <div className="step-card"><div className="step-num">1</div><div className="step-title">Quick Mood Check</div><div className="step-desc">Tell us how you&apos;re feeling right now using a simple slider. No typing required.</div></div>
          <div className="step-card"><div className="step-num">2</div><div className="step-title">Get Matched Support</div><div className="step-desc">Based on your mood, we instantly suggest a short breathing exercise or journal prompt.</div></div>
          <div className="step-card"><div className="step-num">3</div><div className="step-title">Explore Anonymously</div><div className="step-desc">Read stories from other students who feel exactly like you do.</div></div>
        </div>
      </section>

      {/* ── MYTH/FACT QUIZ ENTRY STRIP ── */}
      <section className="section" style={{ paddingTop: '40px', paddingBottom: '0' }}>
        <div className="quiz-entry-strip">
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

      <section className="social-proof-section" style={{ marginTop:'40px' }}>
        <div className="sp-header">Trusted by thousands of students across India</div>
        <div className="sp-slider">
          <div className="sp-card"><div className="sp-stars">★★★★★</div><div className="sp-quote">&quot;This helped me during boards stress so much. I finally felt like I wasn&apos;t the only one panicking.&quot;</div><div className="sp-author">Class 12 Student • CBSE</div></div>
          <div className="sp-card"><div className="sp-stars">★★★★★</div><div className="sp-quote">&quot;I was too scared to tell my parents I wanted to change streams. The counsellor here gave me the courage to do it.&quot;</div><div className="sp-author">Class 11 Student • ISC</div></div>
          <div className="sp-card"><div className="sp-stars">★★★★★</div><div className="sp-quote">&quot;I finally felt heard. Just writing down my thoughts on the anonymous wall and seeing others react made my week.&quot;</div><div className="sp-author">College Fresher • Mumbai</div></div>
          <div className="sp-card"><div className="sp-stars">★★★★★</div><div className="sp-quote">&quot;The breathing exercises actually work. I open this app before every major exam now.&quot;</div><div className="sp-author">Class 10 Student • ICSE</div></div>
          <div className="sp-card"><div className="sp-stars">★★★★★</div><div className="sp-quote">&quot;No judgement. No lecturing. Just real help when I felt completely alone.&quot;</div><div className="sp-author">Anonymous User • Bangalore</div></div>
        </div>
      </section>

      <section className="section" style={{ background:'var(--sand)' }}>
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
              <div className="pillar-features">{p.features.map((f, i) => <div key={i} className="pillar-feat">{f}</div>)}</div>
              <div className="pillar-cta" onClick={() => navigate(p.route)}>{p.cta}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="story-section">
        <div className="story-content">
          <div className="section-eyebrow">Why SecretSharz Exists</div>
          <h2 className="section-h2" style={{ marginBottom:'24px' }}>
            Built from real conversations behind <em>closed doors.</em>
          </h2>
          <p className="section-p" style={{ color:'var(--ink-soft)' }}>
            For years, sitting in a school counselling room, I saw the same pattern repeat itself. Brilliant, capable students were struggling silently under the weight of expectations, anxiety, and the fear of judgment.
          </p>
          <p className="section-p" style={{ color:'var(--ink-soft)', marginTop:'16px' }}>
            They couldn&apos;t talk to their parents. They wouldn&apos;t talk to their teachers.
          </p>
          <p className="section-p" style={{ color:'var(--ink-soft)', marginTop:'16px' }}>
            Secret Sharz was built to be the digital equivalent of that safe counselling room. A place where identity doesn&apos;t matter, but your feelings do. We combine professional psychological support with the anonymity the internet provides to reach students before they hit a breaking point.
          </p>
        </div>
        
        <div className="story-img-box" style={{ overflow: 'hidden', padding: 0 }}>
          <img 
            src="/20250508_103355.jpg" 
            alt="School Counselling" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              borderRadius: 'inherit' 
            }} 
          />
        </div>
      </section>

      <section className="section">
        <div className="vv-banner">
          <div className="vv-banner-left">
            <div className="vv-banner-tag">⚡ Powered by Secret Sharz</div>
            <h3>Once your mind is clear...<br /><em>discover your future</em></h3>
            <p>Our AI-powered career guidance subsidiary uses Holland&apos;s RIASEC theory to map your unique personality to the careers and colleges that truly fit you.</p>
            <button className="btn-vv" onClick={() => navigate(currentUser ? '/vidyavantage' : '/auth')}>
              🎓 {currentUser ? 'Start Career Assessment' : 'Login to Start Assessment'} <span style={{ fontSize:'18px' }}>→</span>
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

      <section className="b2b-section">
        <div className="section-eyebrow" style={{ color:'var(--sage-light)' }}>Institutional Partnerships</div>
        <h2 className="section-h2" style={{ color:'white' }}>Empower your students with a <em>proactive</em> mental health layer.</h2>
        <p className="section-p" style={{ color:'rgba(255,255,255,0.6)' }}>Secret Sharz partners with forward-thinking schools across India to provide anonymous, POCSO-aligned emotional support.</p>
        <div className="b2b-grid">
          <div className="b2b-card"><div style={{ fontSize:'32px', marginBottom:'15px' }}>🛡️</div><h3 style={{ fontFamily:'Fraunces, serif', fontSize:'20px', marginBottom:'10px' }}>Early Intervention</h3><p style={{ fontSize:'14px', color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>Our clinical panel detects high-stress markers early, allowing school counsellors to address issues before they escalate.</p></div>
          <div className="b2b-card"><div style={{ fontSize:'32px', marginBottom:'15px' }}>📊</div><h3 style={{ fontFamily:'Fraunces, serif', fontSize:'20px', marginBottom:'10px' }}>Anonymized Analytics</h3><p style={{ fontSize:'14px', color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>Gain insights into the overall emotional health of your student body without ever compromising an individual&apos;s privacy.</p></div>
          <div className="b2b-card"><div style={{ fontSize:'32px', marginBottom:'15px' }}>🤝</div><h3 style={{ fontFamily:'Fraunces, serif', fontSize:'20px', marginBottom:'10px' }}>Seamless Integration</h3><p style={{ fontSize:'14px', color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>Deploy our platform to thousands of students in under 48 hours. No complex IT setup required.</p></div>
        </div>
        <button className="btn-primary" style={{ marginTop:'40px', background:'white', color:'var(--ink)' }} onClick={() => setModal('talk')}>Schedule a Demo for your School</button>
      </section>

      <section className="safe-section">
        <div className="safe-content">
          <div className="section-eyebrow" style={{ color:'var(--sage-light)' }}>Your Safety Comes First</div>
          <h2 className="section-h2">This is a <em>judgement-free</em> zone. Always.</h2>
          <p className="section-p">We built Secret Sharz on one promise: you will never be shamed, exposed, or ignored here. Ever.</p>
          <div className="privacy-grid">
            <div className="privacy-item"><span>🔒</span><div><h4>100% Anonymous</h4><p>No real names. You interact using generated avatars and aliases.</p></div></div>
            <div className="privacy-item"><span>🛡️</span><div><h4>End-to-End Protection</h4><p>Your data is encrypted. Chat logs are never publicly linked to you.</p></div></div>
            <div className="privacy-item"><span>🚫</span><div><h4>No Data Selling</h4><p>Your mental health data is yours. We never sell information to third parties.</p></div></div>
            <div className="privacy-item"><span>🇮🇳</span><div><h4>POCSO Aligned</h4><p>Built under strict Indian child safety laws with human moderation.</p></div></div>
          </div>
          <div style={{ textAlign:'left', borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:'40px' }}>
            <h3 style={{ color:'white', fontFamily:'Fraunces, serif', fontSize:'24px', marginBottom:'5px' }}>Need urgent help right now?</h3>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'15px', marginBottom:'20px' }}>Don&apos;t wait. Free, confidential support is available 24/7 across India.</p>
            <div className="crisis-grid">
              <div className="crisis-box"><div style={{ fontSize:'32px' }}>📞</div><div><div className="crisis-title">iCall Helpline</div><div className="crisis-desc">Psychosocial helpline by TISS. Mon-Sat, 8AM to 10PM.</div><div className="crisis-number">9152987821</div></div></div>
              <div className="crisis-box"><div style={{ fontSize:'32px' }}>🏥</div><div><div className="crisis-title">Kiran (Govt of India)</div><div className="crisis-desc">24/7 National Mental Health Helpline.</div><div className="crisis-number">1800-599-0019</div></div></div>
              <div className="crisis-box"><div style={{ fontSize:'32px' }}>🤝</div><div><div className="crisis-title">Vandrevala Foundation</div><div className="crisis-desc">Free psychological counselling for anyone in distress.</div><div className="crisis-number">9999-666-555</div></div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── WALL PAGE ─────────────────────────────────────────────────────────────────
function WallPage({ navigate }) {
  // 1. Initialize state. We'll populate it fully in the useEffect to prevent hydration issues.
  const [wallNotes, setWallNotes] = useState(generateWallData); 
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  // 2. Load saved notes from LocalStorage when the page first loads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNotes = localStorage.getItem('sharzWallNotes');
      if (savedNotes) {
        setWallNotes(JSON.parse(savedNotes));
      }
    }
  }, []);

  // 3. Save notes to LocalStorage whenever a new note is added or liked
  useEffect(() => {
    if (typeof window !== 'undefined' && wallNotes.length > 0) {
      localStorage.setItem('sharzWallNotes', JSON.stringify(wallNotes));
    }
  }, [wallNotes]);

  // Define Vulgarity/Curse Words
  const vulgarWords = [
    'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'cunt', 'slut', 'whore', 'bastard', 'motherfucker', 'crap', 'fag', 'faggot', 'nigger', 'nigga', 'retard', 'retarded'
  ];

  // Define Self-Harm / High-Risk Phrases
  const riskPhrases = [
    'kill myself', 'want to die', 'end it all', 'give up', 'suicide', "can't take it anymore", 'no reason to live', 'end my life', 'cut myself', 'hurt myself', 'better off dead'
  ];

  const checkSafety = (text) => {
    const lowerText = text.toLowerCase();

    // Check for Self Harm first (Highest Priority)
    for (let phrase of riskPhrases) {
      if (lowerText.includes(phrase)) {
        return 'CRISIS';
      }
    }

    // Check for Vulgarity
    for (let word of vulgarWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'i'); 
      if (regex.test(lowerText)) {
        return 'VULGAR';
      }
    }

    return 'SAFE';
  };

  const reactToNote = (id) => {
    setWallNotes(prev => prev.map(n => n.id === id ? { ...n, reactions: n.reactions + 1 } : n));
  };

  const submitNewNote = () => {
    if (!newNoteText.trim()) return;
    setErrorMsg('');

    const safetyStatus = checkSafety(newNoteText);

    if (safetyStatus === 'CRISIS') {
      setShowAddNoteModal(false);
      setShowCrisisModal(true);
      setNewNoteText('');
      return;
    }

    if (safetyStatus === 'VULGAR') {
      setErrorMsg("Please rephrase your note. Our safe space does not allow profanity or offensive language.");
      return;
    }

    // If safe, proceed with posting
    const newNote = {
      id: Date.now(),
      type: newNoteText.length > 80 ? 'long' : 'short',
      text: newNoteText,
      tag: newNoteTag || "Anonymous User",
      color: ["note-yellow","note-green","note-purple","note-blue"][Math.floor(Math.random() * 4)],
      reactions: 1
    };
    
    setWallNotes(prev => [newNote, ...prev]);
    setShowAddNoteModal(false);
    setNewNoteText('');
    setNewNoteTag('');
  };

  return (
    <div className="wall-page">
      
      {/* 🚀 SEO METADATA FOR WALL PAGE 🚀 */}
      <Head>
        <title>Sharz Wall | Anonymous Student Community</title>
        <meta name="description" content="Read real, anonymous thoughts from students across India. Share your burden, realize you are not alone, and find community support." />
        <meta property="og:title" content="Sharz Wall | Anonymous Student Community" />
        <meta property="og:description" content="Read real, anonymous thoughts from students across India. Share your burden, realize you are not alone, and find community support." />
        <meta property="og:image" content="/secret-sharz-logo.png" />
      </Head>

      <div className="wall-header">
        <h1 className="wall-h1">Sharz Wall</h1>
        <p className="wall-sub">You are not the only one. Real thoughts from real students. No names. No judgement.</p>
        
        <div>
          <button className="add-note-btn" onClick={() => { setErrorMsg(''); setShowAddNoteModal(true); }}>✍️ Add Your Note</button>
        </div>

        {/* ── NEW COUNTER ADDED HERE ── */}
        <div style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <span style={{ fontSize: '18px' }}>📬</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
            <span style={{ color: 'var(--sage-light)', fontSize: '16px', fontWeight: '700' }}>{wallNotes.length.toLocaleString()}</span> messages received
          </span>
        </div>
      </div>

      <div style={{ textAlign:'center' }}>
        <div className="scroll-msg">Some of these might feel like they were written by you. Take your time.</div>
      </div>

      <div className="masonry-grid">
        {wallNotes.map((note, index) => (
          <React.Fragment key={note.id}>
            {index === 15 && <div className="scroll-msg" style={{ display:'block', width:'100%', margin:'20px 0' }}>Take a breath 🌿 You're doing okay.</div>}
            {index === 45 && <div className="scroll-msg" style={{ display:'block', width:'100%', margin:'20px 0' }}>Pause for a second. Drop your shoulders.</div>}
            <div className={`note-card ${note.color}`}>
              {note.tag && <div className="note-tag">{note.tag}</div>}
              <div className={`note-text ${note.type === 'short' ? 'short' : ''}`}>{note.text}</div>
              <div className="note-footer">
                <div style={{ display:'flex', gap:'12px' }}>
                  <button className="reaction-btn" onClick={() => reactToNote(note.id)}>❤️ {note.reactions}</button>
                  <button className="reaction-btn" onClick={() => reactToNote(note.id)}>🤝 Me too</button>
                </div>
                <button className="reaction-btn" onClick={() => alert('Saved to your private collection.')}>🔖 Save</button>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* ADD NOTE MODAL */}
      {showAddNoteModal && (
        <div className="note-modal-overlay" onClick={() => setShowAddNoteModal(false)}>
          <div className="note-modal" onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontFamily:'Fraunces', margin:0 }}>Share your thought</h2>
              <button onClick={() => setShowAddNoteModal(false)} style={{ background:'none', border:'none', fontSize:'24px', cursor:'pointer' }}>×</button>
            </div>
            
            {errorMsg && (
              <div className="safety-error">
                {errorMsg}
              </div>
            )}

            <textarea className="note-textarea" placeholder="What's on your mind? (It's completely anonymous...)" value={newNoteText} onChange={e => setNewNoteText(e.target.value)} />
            <select className="note-select" value={newNoteTag} onChange={e => setNewNoteTag(e.target.value)}>
              <option value="">Add a tag (Optional)</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 12">Class 12</option>
              <option value="College Fresher">College Fresher</option>
              <option value="Just Venting">Just Venting</option>
            </select>
            <div style={{ fontSize:'12px', color:'var(--muted)', marginBottom:'20px' }}>
              🛡️ Note: All posts are screened by our AI to prevent self-harm content or bullying.
            </div>
            <button className="btn-primary" style={{ width:'100%' }} onClick={submitNewNote}>Share Anonymously</button>
          </div>
        </div>
      )}

      {/* CRISIS INTERVENTION MODAL */}
      {showCrisisModal && (
        <div className="note-modal-overlay" style={{ background: 'rgba(30,40,32,0.8)' }} onClick={() => setShowCrisisModal(false)}>
          <div className="note-modal" style={{ borderTop: '6px solid var(--danger)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '10px' }}>❤️‍🩹</div>
            <h2 style={{ fontFamily:'Fraunces', textAlign: 'center', marginBottom: '16px', color: 'var(--ink)' }}>You don't have to face this alone.</h2>
            <p style={{ textAlign: 'center', color: 'var(--ink-soft)', marginBottom: '24px', fontSize: '15px', lineHeight: '1.6' }}>
              Your note mentioned feelings of deep despair or self-harm. Please know that your life is incredibly valuable. Right now, the strongest thing you can do is reach out to someone who is trained to help you carry this pain.
            </p>
            
            <div style={{ background: '#FFF0F0', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>24/7 Free & Confidential Helplines</h4>
              
              <div style={{ marginBottom: '12px', borderBottom: '1px solid rgba(192,57,43,0.1)', paddingBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--ink)' }}>Kiran (Govt. of India)</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--danger)' }}>1800-599-0019</div>
              </div>
              
              <div style={{ marginBottom: '12px', borderBottom: '1px solid rgba(192,57,43,0.1)', paddingBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', color: 'var(--ink)' }}>iCall (TISS)</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--danger)' }}>9152987821</div>
              </div>
              
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--ink)' }}>Vandrevala Foundation</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--danger)' }}>9999-666-555</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowCrisisModal(false)}
                style={{ flex: 1, padding: '14px', background: 'transparent', border: '2px solid var(--border)', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', color: 'var(--muted)' }}
              >
                Close
              </button>
              <button 
                onClick={() => { setShowCrisisModal(false); navigate('/safe'); }}
                style={{ flex: 2, padding: '14px', background: 'var(--sage)', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', color: 'white' }}
              >
                Go to Safe Corner →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
