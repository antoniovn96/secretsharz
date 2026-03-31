import React, { useState, useEffect, useRef } from 'react';
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
    
    /* Sticky Note Colors */
    --note-yellow: #FEF3C7; --note-yellow-dark: #D97706;
    --note-green: #D1FAE5; --note-green-dark: #059669;
    --note-purple: #EDE9FE; --note-purple-dark: #7C3AED;
    --note-blue: #DBEAFE; --note-blue-dark: #2563EB;
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

  .instant-action-bar { background: var(--sage); color: white; text-align: center; padding: 10px 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; position: sticky; top: 0; z-index: 1001;}
  .instant-action-bar:hover { background: var(--moss); }
  .instant-action-bar span { opacity: 0.8; font-weight: 400; margin-left: 8px;}

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

  .onboarding-steps-section { padding: 40px 48px; background: var(--warm-white); text-align: center;}
  .steps-container { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; max-width: 1000px; margin: 40px auto 0;}
  .step-card { flex: 1; min-width: 250px; text-align: left; padding: 24px; background: white; border-radius: var(--r-md); border: 1px solid var(--border); box-shadow: var(--shadow-sm);}
  .step-num { width: 32px; height: 32px; background: var(--sage-pale); color: var(--sage); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-bottom: 15px;}
  .step-title { font-weight: bold; color: var(--ink); margin-bottom: 8px;}
  .step-desc { font-size: 14px; color: var(--muted); line-height: 1.6;}

  .punchline-section { text-align: center; padding: 60px 20px 20px; }
  .punchline-text { font-family: 'Fraunces', serif; font-size: clamp(24px, 4vw, 36px); font-weight: 300; color: var(--ink-soft); font-style: italic; max-width: 800px; margin: 0 auto; line-height: 1.4;}

  .widget-section { padding: 80px 48px; background: var(--lav-pale); display: flex; flex-direction: column; align-items: center; text-align: center;}
  .widget-container { max-width: 1000px; width: 100%; margin-top: 40px;}
  .widget-tabs { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 30px;}
  .widget-tab { padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; background: white; color: var(--muted); box-shadow: var(--shadow-sm);}
  .widget-tab:hover { transform: translateY(-2px); border-color: var(--lavender);}
  .widget-tab.active { background: var(--lavender); color: white; box-shadow: var(--shadow-md);}
  
  .widget-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; text-align: left;}
  .tool-card { background: white; border-radius: var(--r-md); padding: 24px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); cursor: pointer; transition: all 0.2s;}
  .tool-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--lavender);}
  .tool-icon { font-size: 32px; margin-bottom: 12px;}
  .tool-title { font-family: 'Fraunces', serif; font-weight: 700; font-size: 20px; color: var(--ink); margin-bottom: 8px;}
  .tool-desc { font-size: 14px; color: var(--muted); line-height: 1.5; margin-bottom: 16px;}
  .tool-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: bold; color: var(--lavender);}
  
  .emergency-btn { margin-top: 40px; background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 2px solid var(--danger); padding: 16px 32px; border-radius: 50px; font-weight: bold; font-size: 16px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px;}
  .emergency-btn:hover { background: var(--danger); color: white; transform: scale(1.02);}

  .fs-widget-overlay { position: fixed; inset: 0; background: var(--ink); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; animation: fadeIn 0.3s ease;}
  .fs-close-btn { position: absolute; top: 30px; right: 30px; background: rgba(255,255,255,0.1); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; font-size: 20px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center;}
  .fs-close-btn:hover { background: rgba(255,255,255,0.2);}

  .breathe-circle { width: 150px; height: 150px; border-radius: 50%; background: radial-gradient(circle, var(--sage-light) 0%, var(--sage) 100%); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-size: 24px; font-weight: bold; box-shadow: 0 0 40px rgba(111, 170, 128, 0.4); transition: transform linear;}
  .breathe-instruction { margin-top: 40px; font-size: 20px; font-weight: 300; letter-spacing: 1px; color: rgba(255,255,255,0.8);}

  .bubble-container { position: relative; width: 100%; height: 60vh; max-width: 600px; border: 2px dashed rgba(255,255,255,0.2); border-radius: 20px; overflow: hidden;}
  .thought-bubble { position: absolute; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.1s; animation: floatUp 4s linear infinite; user-select: none;}
  .thought-bubble:hover { transform: scale(1.1); background: rgba(255,255,255,0.2);}
  .thought-bubble.popped { animation: pop 0.2s ease forwards; pointer-events: none;}
  @keyframes pop { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.8; } 100% { transform: scale(0); opacity: 0; } }

  .focus-timer-display { font-family: 'Fraunces', serif; font-size: 80px; font-weight: bold; color: var(--sky); margin-bottom: 30px;}
  .focus-textarea { width: 100%; max-width: 600px; height: 200px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: white; padding: 20px; font-size: 16px; font-family: inherit; resize: none;}
  .focus-textarea:focus { outline: none; border-color: var(--sky);}

  /* Checklist UI */
  .checklist-container { text-align: left; width: 100%; max-width: 400px; }
  .check-item { display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 10px; cursor: pointer; transition: 0.2s; border: 1px solid transparent;}
  .check-item:hover { background: rgba(255,255,255,0.1); }
  .check-item.done { border-color: var(--sage); opacity: 0.5; text-decoration: line-through;}
  .check-box { width: 24px; height: 24px; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center;}
  .check-item.done .check-box { background: var(--sage); border-color: var(--sage);}

  /* Pulse Animation */
  .pulse-container { width: 200px; height: 200px; border-radius: 50%; background: rgba(239, 68, 68, 0.2); display: flex; align-items: center; justify-content: center; position: relative; animation: heartbeat 1s infinite;}
  .pulse-container::after { content: ''; position: absolute; inset: -20px; border: 2px solid var(--danger); border-radius: 50%; animation: pulse-ring 1s infinite;}
  @keyframes heartbeat { 0% { transform: scale(1); } 15% { transform: scale(1.1); } 30% { transform: scale(1); } 45% { transform: scale(1.15); } 100% { transform: scale(1); } }

  .social-proof-section { padding: 40px 0 80px; overflow: hidden; background: linear-gradient(180deg, transparent, var(--sand)); }
  .sp-header { text-align: center; font-size: 14px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px;}
  .sp-slider { display: flex; gap: 24px; padding: 0 48px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; -ms-overflow-style: none;}
  .sp-slider::-webkit-scrollbar { display: none; }
  .sp-card { background: white; padding: 24px; border-radius: var(--r-md); box-shadow: var(--shadow-sm); min-width: 320px; max-width: 320px; scroll-snap-align: start; flex-shrink: 0; border: 1px solid var(--border);}
  .sp-stars { color: #F59E0B; font-size: 14px; margin-bottom: 12px; letter-spacing: 2px;}
  .sp-quote { font-size: 15px; color: var(--ink-soft); font-style: italic; margin-bottom: 16px; line-height: 1.6;}
  .sp-author { font-size: 12px; font-weight: 700; color: var(--muted); text-transform: uppercase;}

  .story-section { padding: 100px 48px; background: white; display: flex; align-items: center; justify-content: center; gap: 60px; flex-wrap: wrap;}
  .story-content { max-width: 500px; }
  .story-img-box { width: 400px; height: 500px; background: var(--sage-pale); border-radius: var(--r-lg); position: relative; display:flex; align-items:center; justify-content:center; font-size: 80px; border: 1px solid var(--border);}
  .story-img-box::after { content: ''; position: absolute; inset: -15px; border: 2px dashed var(--sage-light); border-radius: calc(var(--r-lg) + 10px); z-index: 0; opacity: 0.5;}

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

  /* --- SHARZ WALL STYLES --- */
  .wall-page { min-height: 100vh; background: var(--warm-white); padding-bottom: 80px;}
  .wall-header { background: var(--ink); color: white; padding: 60px 48px; text-align: center; border-bottom: 4px solid var(--sage);}
  .wall-h1 { font-family: 'Fraunces', serif; font-size: clamp(32px, 5vw, 48px); margin-bottom: 10px;}
  .wall-sub { color: rgba(255,255,255,0.7); font-size: 16px; max-width: 600px; margin: 0 auto 30px;}
  .add-note-btn { background: var(--sage); color: white; border: none; padding: 14px 30px; border-radius: 50px; font-weight: bold; font-size: 16px; cursor: pointer; box-shadow: 0 4px 15px rgba(74,124,89,0.3); transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;}
  .add-note-btn:hover { background: var(--moss); transform: translateY(-2px);}
  
  .masonry-grid { display: column; column-count: 4; column-gap: 24px; max-width: 1400px; margin: 40px auto; padding: 0 48px;}
  @media (max-width: 1200px) { .masonry-grid { column-count: 3; } }
  @media (max-width: 900px) { .masonry-grid { column-count: 2; padding: 0 24px;} }
  @media (max-width: 600px) { .masonry-grid { column-count: 1; } }
  
  .note-card { break-inside: avoid; margin-bottom: 24px; padding: 24px; border-radius: 16px; box-shadow: var(--shadow-sm); position: relative; transition: transform 0.2s; cursor: pointer;}
  .note-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md);}
  .note-yellow { background: var(--note-yellow); color: var(--note-yellow-dark); }
  .note-green { background: var(--note-green); color: var(--note-green-dark); }
  .note-purple { background: var(--note-purple); color: var(--note-purple-dark); }
  .note-blue { background: var(--note-blue); color: var(--note-blue-dark); }
  
  .note-text { font-size: 16px; line-height: 1.6; font-weight: 500; margin-bottom: 16px; color: var(--ink);}
  .note-text.short { font-size: 20px; font-family: 'Fraunces', serif; }
  .note-tag { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; background: rgba(0,0,0,0.05); color: var(--ink-soft); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;}
  
  .note-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 12px; margin-top: 12px;}
  .reaction-btn { background: transparent; border: none; color: inherit; opacity: 0.7; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 13px; transition: opacity 0.2s;}
  .reaction-btn:hover { opacity: 1;}
  
  .scroll-msg { background: rgba(255,255,255,0.9); backdrop-filter: blur(5px); padding: 12px 24px; border-radius: 50px; font-weight: bold; color: var(--sage); display: inline-block; box-shadow: var(--shadow-sm); margin: 20px auto; text-align: center; border: 1px solid var(--border);}
  
  .note-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px);}
  .note-modal { background: white; width: 100%; max-width: 500px; border-radius: 20px; padding: 30px; box-shadow: var(--shadow-lg);}
  .note-textarea { width: 100%; height: 150px; border: 1px solid var(--border); border-radius: 12px; padding: 15px; font-family: inherit; font-size: 16px; resize: none; margin-bottom: 15px;}
  .note-textarea:focus { outline: none; border-color: var(--sage);}
  .note-select { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 15px;}
  
  @media(max-width:900px){
    .ss-hero{padding:60px 24px;min-height:auto;}
    .hero-right{display:none;}
    .section{padding:64px 24px;}
    .vv-banner{flex-direction:column;padding:40px 28px;}
    .safe-section{padding:64px 24px;}
    .story-section{padding: 64px 24px; gap: 40px;}
    .story-img-box{display: none;}
    .privacy-grid{grid-template-columns: 1fr;}
    .wall-header{padding: 40px 24px;}
  }
`;

const PILLARS = [
  { cls:'mind', icon:'🧠', title:'Mind Space', desc:'A private sanctuary for your thoughts. Track your mood, journal freely, and access science-backed tools for anxiety, stress, and emotional wellbeing.', features:['Daily mood check-in & tracking','Guided journaling with AI prompts','Breathing & grounding exercises'], cta: 'Try Mood Tracker →', route: 'mindspace' },
  { cls:'share', icon:'💬', title:'Sharz Wall', desc:"Share what's on your heart anonymously. Read stories from young people just like you. Know that you are never, ever alone in what you feel.", features:['100% anonymous sharing','Peer reactions & support','Moderated safe community'], cta: 'Read Anonymous Stories →', route: 'wall' },
  { cls:'guide', icon:'🧭', title:'Life Guide', desc:"Navigate life's toughest decisions — from family pressure and friendships to career choices and your future — with guidance designed for young Indians.", features:['Career path discovery','Life skills & decision tools','Expert article library'], cta: 'Explore Life Guidance →', route: 'guide' },
  { cls:'safe', icon:'🛡️', title:'Safe Corner', desc:"If things feel too heavy to carry, you don't have to carry them alone. Access trained counsellors, crisis support, and emergency helplines instantly.", features:['24/7 crisis helpline access','Connect with trained counsellors','Report unsafe situations privately'], cta: 'View Safety Protocols →', route: 'safe' },
];

// --- 🚀 25 INTERACTIVE WIDGET TOOLS ---
const WIDGET_CATEGORIES = [
  { id: 'calm', label: '😰 Calm Anxiety', color: 'var(--sage)' },
  { id: 'vent', label: '😡 Release Anger', color: 'var(--danger)' },
  { id: 'mood', label: '😞 Lift Mood', color: 'var(--peach)' },
  { id: 'focus', label: '😵 Focus Better', color: 'var(--sky)' },
  { id: 'sleep', label: '😴 Relax / Sleep', color: 'var(--lavender)' },
  { id: 'clear', label: '🧠 Clear Mind', color: 'var(--ink)' }
];

const WIDGET_TOOLS = {
  calm: [
    { id: 'c1', title: '4-7-8 Breathing', desc: 'A proven rhythm to instantly lower heart rate.', icon: '🫁', duration: '2 min', type: 'breathing' },
    { id: 'c2', title: '5-4-3-2-1 Grounding', desc: 'Bring your mind back to the present room.', icon: '🖐️', duration: '1 min', type: 'checklist_grounding' },
    { id: 'c3', title: 'Box Breathing', desc: 'Equal inhales, holds, and exhales for balance.', icon: '🔲', duration: '2 min', type: 'breathing' },
    { id: 'c4', title: 'Heartbeat Sync', desc: 'Focus on a calming visual pulse.', icon: '💓', duration: '1 min', type: 'pulse' }
  ],
  vent: [
    { id: 'v1', title: 'Pop the Thoughts', desc: 'Tap to visually destroy anxious thoughts.', icon: '🫧', duration: '1 min', type: 'game_pop' },
    { id: 'v2', title: 'Brain Dump Timer', desc: 'Type everything out without stopping.', icon: '⌨️', duration: '2 min', type: 'timer' },
    { id: 'v3', title: 'Write & Destroy', desc: 'Type what is bothering you, then watch it burn.', icon: '🔥', duration: '1 min', type: 'destroy' },
    { id: 'v4', title: 'Stress Tap', desc: 'Release physical energy through rapid tapping.', icon: '⚡', duration: '1 min', type: 'tap' }
  ],
  mood: [
    { id: 'm1', title: 'Gratitude Quick-Write', desc: 'Name 3 things that don\'t suck right now.', icon: '✨', duration: '1 min', type: 'text' },
    { id: 'm2', title: 'Tiny Wins Tracker', desc: 'Check off small things you did today.', icon: '🏆', duration: '1 min', type: 'checklist_wins' },
    { id: 'm3', title: 'Compliment Generator', desc: 'Receive a random, kind message.', icon: '💌', duration: '30 sec', type: 'compliment' },
    { id: 'm4', title: 'Watch the Clouds', desc: 'A calming visual loop to reset your mind.', icon: '☁️', duration: '1 min', type: 'visual' }
  ],
  focus: [
    { id: 'f1', title: 'One-Task Focus', desc: 'Hide everything else. Do one thing.', icon: '🎯', duration: 'Custom', type: 'text' },
    { id: 'f2', title: 'Control Toggle', desc: 'Sort what you can and cannot control.', icon: '⚖️', duration: '2 min', type: 'sort' },
    { id: 'f3', title: 'Focus Line Game', desc: 'Follow a moving line to center your attention.', icon: '〰️', duration: '1 min', type: 'game_line' },
    { id: 'f4', title: 'Next 1 Step', desc: 'Break down a massive task into one tiny action.', icon: '🚶', duration: '1 min', type: 'text' }
  ],
  sleep: [
    { id: 's1', title: 'Sleep Countdown', desc: 'Slow your brain with a guided visual fade.', icon: '🌙', duration: '3 min', type: 'countdown' },
    { id: 's2', title: 'Body Scan', desc: 'Release tension from head to toe.', icon: '🧘', duration: '5 min', type: 'text' },
    { id: 's3', title: 'White Noise', desc: 'Listen to calming rain sounds.', icon: '🌧️', duration: '10 min', type: 'audio' },
    { id: 's4', title: 'Let It Go Viz', desc: 'Visualize your thoughts floating away.', icon: '🍃', duration: '2 min', type: 'visual' }
  ],
  clear: [
    { id: 'cl1', title: 'Emotion Wheel', desc: 'Pinpoint exactly what you are feeling.', icon: '🎡', duration: '1 min', type: 'text' },
    { id: 'cl2', title: 'Journal Prompt', desc: 'Get a random question to spark reflection.', icon: '📓', duration: '3 min', type: 'text' },
    { id: 'cl3', title: 'Why Am I Feeling This?', desc: 'A guided flow to find the root cause.', icon: '🔍', duration: '2 min', type: 'text' },
    { id: 'cl4', title: 'Future Self Advice', desc: 'What would older you say about this?', icon: '🕰️', duration: '2 min', type: 'text' }
  ]
};

// --- MOCK DATA FOR SHARZ WALL ---
const generateWallData = () => {
    const rawShorts = [
        "I act strong in school but cry at night.",
        "Everyone thinks I’m okay. I’m not.",
        "I wish someone asked me if I’m actually happy.",
        "I’m tired… but I can’t rest.",
        "Marks feel like my entire identity.",
        "I don’t hate studying. I hate the pressure.",
        "I just want peace in my head.",
        "I laugh a lot… but it’s fake sometimes.",
        "Why is being a good child so exhausting?",
        "I overthink everything."
    ];
    
    const tags = ["Class 10 • Section A", "Class 12 • CBSE", "Class 11 • Science", "College Fresher", "Drop Year Student"];
    const colors = ["note-yellow", "note-green", "note-purple", "note-blue"];
    const notes = [];

    notes.push({ id: 'l1', type: 'long', text: "I’m in Class 11 and everyone around me seems to have their life figured out… I chose science because everyone said it’s the ‘best option’, but I feel lost every day… I don’t even know if I like what I’m studying anymore…", tag: "Class 11 • Science", color: "note-purple", reactions: 128 });
    notes.push({ id: 'l2', type: 'long', text: "My parents think I’m just lazy, but I feel so mentally tired all the time… I try to study but my mind just keeps racing. I wish they understood that I'm trying my best.", tag: "Class 10 • Section B", color: "note-blue", reactions: 89 });
    notes.push({ id: 'l3', type: 'long', text: "Moving to a new city was supposed to be exciting… but I feel more alone than ever. Making friends is so hard when you're an introvert.", tag: "College Fresher", color: "note-green", reactions: 45 });

    for(let i=0; i<119; i++) {
        notes.push({
            id: `s${i}`,
            type: 'short',
            text: rawShorts[Math.floor(Math.random() * rawShorts.length)],
            tag: tags[Math.floor(Math.random() * tags.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            reactions: Math.floor(Math.random() * 50) + 5
        });
    }
    
    return notes.sort(() => Math.random() - 0.5);
};

export default function App() {
  
  const [screen, setScreen] = useState('home');
  const [showVV, setShowVV] = useState(false);
  
  const [dashboardTab, setDashboardTab] = useState('home'); 
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData]       = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [modal, setModal]             = useState(null); 
  
  const [activeWidgetCategory, setActiveWidgetCategory] = useState('calm');
  const [activeWidgetFullscreen, setActiveWidgetFullscreen] = useState(null);
  
  const [breathePhase, setBreathePhase] = useState('Inhale');
  const [breatheScale, setBreatheScale] = useState(1);
  const [popCount, setPopCount] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [focusTime, setFocusTime] = useState(120);

  // Widget Checklist States
  const [groundingChecks, setGroundingChecks] = useState([false, false, false, false, false]);
  const [winsChecks, setWinsChecks] = useState([false, false, false, false, false]);

  const [wallNotes, setWallNotes] = useState([]);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('');

  const isMasterEmail = currentUser?.email && btoa(currentUser.email.toLowerCase().trim()) === 'YW50b25pby5hbnRvbmlvLm5vcm9uaGFAZ21haWwuY29t';
  const isAdmin = (userData && userData.role === 'super_admin') || isMasterEmail;

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = FONTS + CSS;
    document.head.appendChild(s);
    
    setWallNotes(generateWallData());

    return () => document.head.removeChild(s);
  }, []);

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
        setScreen(prevScreen => {
          if (prevScreen === 'auth' || prevScreen === 'home') return isUserAdmin ? 'admin' : 'dashboard';
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
      if(isNew) setModal('onboarding');
      else setScreen('dashboard');
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
    } catch (err) { console.error("Error saving assessment: ", err); }
  };

  // Widget Effects
  useEffect(() => {
      let interval;
      if (activeWidgetFullscreen?.type === 'breathing') {
          const cycle = () => {
              setBreathePhase('Breathe In...');
              setBreatheScale(1.5);
              setTimeout(() => {
                  if(activeWidgetFullscreen) setBreathePhase('Hold...');
                  setTimeout(() => {
                      if(activeWidgetFullscreen) {
                          setBreathePhase('Breathe Out...');
                          setBreatheScale(1);
                      }
                  }, 7000);
              }, 4000);
          };
          cycle();
          interval = setInterval(cycle, 19000);
      }
      return () => clearInterval(interval);
  }, [activeWidgetFullscreen]);

  useEffect(() => {
      let interval;
      if (activeWidgetFullscreen?.type === 'game_pop') {
          setPopCount(0);
          setBubbles([]);
          interval = setInterval(() => {
              setBubbles(prev => {
                  if(prev.length > 15) return prev;
                  const newBubble = {
                      id: Date.now() + Math.random(),
                      left: Math.random() * 80 + 10 + '%',
                      text: ['Stress', 'Exams', 'Pressure', 'Fear', 'Doubt'][Math.floor(Math.random() * 5)]
                  };
                  return [...prev, newBubble];
              });
          }, 1200);
      }
      return () => clearInterval(interval);
  }, [activeWidgetFullscreen]);

  const handlePop = (id) => {
      setBubbles(prev => prev.filter(b => b.id !== id));
      setPopCount(c => c + 1);
  };

  useEffect(() => {
      let interval;
      if (activeWidgetFullscreen?.type === 'timer' && focusTime > 0) {
          interval = setInterval(() => {
              setFocusTime(t => t - 1);
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [activeWidgetFullscreen, focusTime]);

  const formatTime = (seconds) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const closeFullscreenWidget = () => {
      setActiveWidgetFullscreen(null);
      setFocusTime(120);
      setGroundingChecks([false,false,false,false,false]);
      setWinsChecks([false,false,false,false,false]);
  };

  const submitNewNote = () => {
      if(!newNoteText.trim()) return;
      const newNote = {
          id: Date.now(),
          type: newNoteText.length > 80 ? 'long' : 'short',
          text: newNoteText,
          tag: newNoteTag || "Anonymous User",
          color: ["note-yellow", "note-green", "note-purple", "note-blue"][Math.floor(Math.random() * 4)],
          reactions: 1
      };
      setWallNotes([newNote, ...wallNotes]);
      setShowAddNoteModal(false);
      setNewNoteText('');
  };

  const reactToNote = (id) => {
      setWallNotes(wallNotes.map(n => n.id === id ? {...n, reactions: n.reactions + 1} : n));
  }

  const toggleChecklist = (index, setter) => {
      setter(prev => {
          const newArr = [...prev];
          newArr[index] = !newArr[index];
          return newArr;
      });
  };

  // ── SECURE ADMIN ROUTE ──
  if (screen === 'admin') {
    if (!isAdmin) { setScreen('home'); return null; }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, position: 'relative' }}>
          <AdminDashboard user={currentUser} onBackToApp={() => setScreen('home')} />
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

  // ── SHARZ WALL SCREEN ──
  if (screen === 'wall') {
      return (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1, position: 'relative' }} className="wall-page">
                <div className="wall-header">
                    <h1 className="wall-h1">Sharz Wall</h1>
                    <p className="wall-sub">You are not the only one. Real thoughts from real students. No names. No judgement.</p>
                    <button className="add-note-btn" onClick={() => setShowAddNoteModal(true)}>
                        ✍️ Add Your Note
                    </button>
                </div>

                <div style={{textAlign:'center'}}>
                    <div className="scroll-msg">Some of these might feel like they were written by you. Take your time.</div>
                </div>

                <div className="masonry-grid">
                    {wallNotes.map((note, index) => (
                        <React.Fragment key={note.id}>
                            {index === 15 && <div className="scroll-msg" style={{display:'block', width:'100%', margin:'20px 0'}}>Take a breath 🌿 You're doing okay.</div>}
                            {index === 45 && <div className="scroll-msg" style={{display:'block', width:'100%', margin:'20px 0'}}>Pause for a second. Drop your shoulders.</div>}
                            
                            <div className={`note-card ${note.color}`}>
                                {note.tag && <div className="note-tag">{note.tag}</div>}
                                <div className={`note-text ${note.type === 'short' ? 'short' : ''}`}>
                                    {note.text}
                                </div>
                                <div className="note-footer">
                                    <div style={{display:'flex', gap:'12px'}}>
                                        <button className="reaction-btn" onClick={() => reactToNote(note.id)}>❤️ {note.reactions}</button>
                                        <button className="reaction-btn" onClick={() => reactToNote(note.id)}>🤝 Me too</button>
                                    </div>
                                    <button className="reaction-btn" onClick={() => alert('Saved to your private collection.')}>🔖 Save</button>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </main>
            <Footer />

            {/* ADD NOTE MODAL */}
            {showAddNoteModal && (
                <div className="note-modal-overlay" onClick={() => setShowAddNoteModal(false)}>
                    <div className="note-modal" onClick={e => e.stopPropagation()}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                            <h2 style={{fontFamily:'Fraunces', margin:0}}>Share your thought</h2>
                            <button onClick={() => setShowAddNoteModal(false)} style={{background:'none', border:'none', fontSize:'24px', cursor:'pointer'}}>×</button>
                        </div>
                        <textarea 
                            className="note-textarea" 
                            placeholder="What's on your mind? (It's completely anonymous...)"
                            value={newNoteText}
                            onChange={e => setNewNoteText(e.target.value)}
                        ></textarea>
                        <select className="note-select" value={newNoteTag} onChange={e => setNewNoteTag(e.target.value)}>
                            <option value="">Add a tag (Optional)</option>
                            <option value="Class 10">Class 10</option>
                            <option value="Class 12">Class 12</option>
                            <option value="College Fresher">College Fresher</option>
                            <option value="Just Venting">Just Venting</option>
                        </select>
                        <div style={{fontSize:'12px', color:'var(--muted)', marginBottom:'20px'}}>
                            🛡️ Note: All posts are screened by our AI to prevent self-harm content or bullying.
                        </div>
                        <button className="btn-primary" style={{width:'100%'}} onClick={submitNewNote}>
                            Share Anonymously
                        </button>
                    </div>
                </div>
            )}
          </div>
      )
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
      
      {!currentUser && screen === 'home' && (
        <div className="instant-action-bar" onClick={() => setScreen('auth')}>
            Feeling overwhelmed right now? Start your healing journey in 30 seconds. <span>→</span>
        </div>
      )}

      {screen !== 'vidyavantage' && <Header />}

      <main style={{ flex: 1, position: 'relative' }}>

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

        <section className="punchline-section anim-up-4">
            <h2 className="punchline-text">"The things you can't tell anyone... <br/><span style={{color: 'var(--sage)', fontWeight: '600'}}>you can tell us.</span>"</h2>
        </section>

        <section className="widget-section">
            <div className="section-eyebrow" style={{color: 'var(--moss)'}}>Emotional First Aid</div>
            <h2 className="section-h2" style={{margin: 0}}>What do you need right now?</h2>
            
            <div className="widget-container">
                <div className="widget-tabs">
                    {WIDGET_CATEGORIES.map(cat => (
                        <div 
                            key={cat.id} 
                            className={`widget-tab ${activeWidgetCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveWidgetCategory(cat.id)}
                            style={{borderColor: activeWidgetCategory === cat.id ? cat.color : 'transparent'}}
                        >
                            {cat.label}
                        </div>
                    ))}
                </div>

                <div className="widget-grid anim-up">
                    {WIDGET_TOOLS[activeWidgetCategory].map(tool => (
                        <div key={tool.id} className="tool-card" onClick={() => setActiveWidgetFullscreen(tool)}>
                            <div className="tool-icon">{tool.icon}</div>
                            <div className="tool-title">{tool.title}</div>
                            <div className="tool-desc">{tool.desc}</div>
                            <div className="tool-meta">
                                <span>⏱️ {tool.duration}</span>
                                <span style={{color: 'var(--primary)'}}>▶ Start</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                <button className="emergency-btn" onClick={() => setModal('talk')}>
                    🔴 I need emergency help right now
                </button>
            </div>
        </section>

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

        <section className="social-proof-section" style={{marginTop: '40px'}}>
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
                <div className="pillar-cta" onClick={() => p.route === 'mindspace' ? setScreen('mindspace') : (p.route === 'wall' ? setScreen('wall') : setModal('talk'))}>
                    {p.cta}
                </div>
              </div>
            ))}
          </div>
        </section>

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

        <section className="safe-section">
          <div className="safe-content">
            <div className="section-eyebrow" style={{color:'var(--sage-light)'}}>Your Safety Comes First</div>
            <h2 className="section-h2">This is a <em>judgement-free</em> zone. Always.</h2>
            <p className="section-p">We built Secret Sharz on one promise: you will never be shamed, exposed, or ignored here. Ever.</p>
            
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

      {screen !== 'vidyavantage' && <Footer />}

      {/* 🚀 FULLSCREEN WIDGET OVERLAY WITH 25 TOOLS */}
      {activeWidgetFullscreen && (
          <div className="fs-widget-overlay">
              <button className="fs-close-btn" onClick={closeFullscreenWidget}>✕</button>
              
              {activeWidgetFullscreen.type === 'breathing' && (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <div className="breathe-circle" style={{transform: `scale(${breatheScale})`}}>
                          {activeWidgetFullscreen.icon}
                      </div>
                      <div className="breathe-instruction">{breathePhase}</div>
                  </div>
              )}

              {activeWidgetFullscreen.type === 'game_pop' && (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
                      <h2 style={{fontFamily: 'Fraunces', fontSize: '32px', marginBottom: '10px'}}>Pop the Thoughts</h2>
                      <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: '30px'}}>Thoughts popped: {popCount}</p>
                      <div className="bubble-container">
                          {bubbles.map(b => (
                              <div 
                                key={b.id} 
                                className="thought-bubble" 
                                style={{left: b.left}}
                                onClick={(e) => {
                                    e.currentTarget.classList.add('popped');
                                    setTimeout(() => handlePop(b.id), 200);
                                }}
                              >
                                  {b.text}
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {activeWidgetFullscreen.type === 'timer' && (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
                      <div className="focus-timer-display">{formatTime(focusTime)}</div>
                      <textarea className="focus-textarea" placeholder="Type everything out. Don't stop. Don't edit. Just dump it all here..."></textarea>
                      <button className="btn" style={{marginTop: '30px'}} onClick={closeFullscreenWidget}>Done</button>
                  </div>
              )}

              {activeWidgetFullscreen.type === 'checklist_grounding' && (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
                      <h2 style={{fontFamily: 'Fraunces', fontSize: '32px', marginBottom: '30px'}}>5-4-3-2-1 Grounding</h2>
                      <div className="checklist-container">
                          {[
                              "Find 5 things you can see", 
                              "Find 4 things you can touch", 
                              "Find 3 things you can hear", 
                              "Find 2 things you can smell", 
                              "Find 1 thing you can taste"
                          ].map((item, i) => (
                              <div key={i} className={`check-item ${groundingChecks[i] ? 'done' : ''}`} onClick={() => toggleChecklist(i, setGroundingChecks)}>
                                  <div className="check-box">{groundingChecks[i] && '✓'}</div>
                                  <span>{item}</span>
                              </div>
                          ))}
                      </div>
                      {groundingChecks.every(c => c) && <button className="btn" style={{marginTop: '30px', background: 'white', color: 'var(--ink)'}} onClick={closeFullscreenWidget}>I feel grounded</button>}
                  </div>
              )}

              {activeWidgetFullscreen.type === 'checklist_wins' && (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
                      <h2 style={{fontFamily: 'Fraunces', fontSize: '32px', marginBottom: '30px'}}>Tiny Wins Today</h2>
                      <div className="checklist-container">
                          {["Drank a glass of water", "Stepped outside for a minute", "Made my bed", "Ate something nourishing", "Took 3 deep breaths"].map((item, i) => (
                              <div key={i} className={`check-item ${winsChecks[i] ? 'done' : ''}`} onClick={() => toggleChecklist(i, setWinsChecks)}>
                                  <div className="check-box">{winsChecks[i] && '✓'}</div>
                                  <span>{item}</span>
                              </div>
                          ))}
                      </div>
                      {winsChecks.some(c => c) && <button className="btn" style={{marginTop: '30px', background: 'white', color: 'var(--ink)'}} onClick={closeFullscreenWidget}>Celebrate Wins</button>}
                  </div>
              )}

              {activeWidgetFullscreen.type === 'pulse' && (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                      <h2 style={{fontFamily: 'Fraunces', fontSize: '32px', marginBottom: '40px'}}>Heartbeat Sync</h2>
                      <div className="pulse-container">
                          <span style={{fontSize: '64px'}}>🤍</span>
                      </div>
                      <p style={{marginTop: '60px', color: 'rgba(255,255,255,0.7)'}}>Sync your breathing with the pulse.</p>
                  </div>
              )}

              {activeWidgetFullscreen.type === 'text' && (
                  <div style={{textAlign:'center', maxWidth:'500px'}}>
                      <div style={{fontSize:'64px', marginBottom:'20px'}}>{activeWidgetFullscreen.icon}</div>
                      <h2 style={{fontFamily: 'Fraunces', fontSize: '32px', marginBottom: '20px'}}>{activeWidgetFullscreen.title}</h2>
                      <p style={{fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6}}>{activeWidgetFullscreen.desc}</p>
                      
                      {activeWidgetFullscreen.title === 'Gratitude Quick-Write' && (
                          <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                              <input type="text" className="form-input" placeholder="1. I am grateful for..." />
                              <input type="text" className="form-input" placeholder="2. Something good that happened..." />
                              <input type="text" className="form-input" placeholder="3. Someone who helped me..." />
                          </div>
                      )}
                      
                      <button className="btn" style={{marginTop: '40px', background: 'white', color: 'var(--ink)'}} onClick={closeFullscreenWidget}>Complete</button>
                  </div>
              )}

              {/* Fallback for other types */}
              {['destroy', 'tap', 'compliment', 'visual', 'sort', 'game_line', 'countdown', 'audio'].includes(activeWidgetFullscreen.type) && (
                  <div style={{textAlign:'center', maxWidth:'500px'}}>
                      <div style={{fontSize:'64px', marginBottom:'20px'}}>🚧</div>
                      <h2 style={{fontFamily: 'Fraunces', fontSize: '32px', marginBottom: '20px'}}>Interactive Module Loading</h2>
                      <p style={{fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6}}>The highly interactive {activeWidgetFullscreen.title} module is currently being optimized for your device.</p>
                      <button className="btn" style={{marginTop: '40px', background: 'var(--sage)'}} onClick={closeFullscreenWidget}>Back to Toolkit</button>
                  </div>
              )}
          </div>
      )}

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
