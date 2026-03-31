

import React, { useState, useEffect } from 'react'; const WIDGET_CATEGORIES = [ { id: 'calm', label: '😰 Calm Anxiety', color: '#4A7C59' }, { id: 'vent', label: '😡 Release Anger', color: '#ef4444' }, { id: 'mood', label: '😞 Lift Mood', color: '#E8845A' }, { id: 'focus', label: '�

Crafting comprehensive corrections and integrating missing features
Crafting comprehensive corrections and integrating missing features
Let me thoroughly analyze the code first before writing the fix.


Identified twelve bugs and missing features to systematically correct
Identified twelve bugs and missing features to systematically correct
Now I have a complete picture of all the issues. Let me document them and write the corrected file:

Bugs found:

CSS camelCase in <style> tag — flexDirection, alignItems, justifyContent, borderRadius, fontSize are invalid in CSS (only valid as JSX inline styles)
var(--ink) used but never defined → crashes button styling
className="form-input focus-input" — form-input class doesn't exist
Math.random() called inside .map() renders (equalizer bars + clouds/leaves) → new random values on every re-render, causes animation chaos
anim-up class used but never defined in styles
Missing useRef import (needed for audio)
.fs-close-btn disappears when content overflows (needs position: fixed, not absolute)
Missing items: 8. audio_rain — has a fake visualizer but produces no actual sound → need Web Audio API 9. s2 Body Scan (type: 'text') — falls into generic fallback, shows nothing useful → need step-through guided UI + change type to 'body_scan' 10. f4 "Next 1 Step" shares type: 'one_task' with f1 → identical UI, defeats the purpose → new 'next_step' type with task decomposition UI 11. cl3 "Why Am I Feeling This?" shares type: 'prompt' with cl2/cl4 → no guided flow → new 'why_feeling' type with 5-question flow 12. cl4 "Future Self Advice" shares type: 'prompt' → no distinct prompts → new 'future_self' type with curated prompts


Created a file, read a file
Created a file, read a file
Here's everything that was fixed and added:

7 bugs fixed:

CSS camelCase crash — .fs-widget-overlay and .fs-close-btn used flexDirection, alignItems, borderRadius etc. inside a <style> tag. These are JSX-only syntax; CSS requires flex-direction, align-items, border-radius. This was breaking the entire overlay layout.
var(--ink) undefined — Used on the Complete button in gratitude. --ink was never declared, making the button text invisible. Replaced with 
#1E2820.
form-input class — Applied to one of the gratitude inputs but never defined anywhere. Removed.
Math.random() in renders — The equalizer bars and cloud/leaf visuals called Math.random() inside .map(), which fired on every re-render, causing animation durations to flicker and change constantly. Fixed with useMemo — values computed once.
anim-up class undefined — Used in several places but the @keyframes and class rule were never written. Added.
Close button scroll issue — Was position: absolute, so it would scroll away on long content. Changed to position: fixed.
Missing useRef import — Required for the audio refs, wasn't in the original import.
5 missing features added:

White Noise (audio_rain) — Had a visualizer but produced zero sound. Added real brown noise generation via Web Audio API with a play/pause button and low-pass filter for a rain-like quality.
Body Scan — Was type: 'text' falling into a generic fallback showing only the description. Changed to type: 'body_scan' with a full 6-step guided step-through UI, progress bar, and per-area instructions.
Next 1 Step (f4) — Was using the same 'one_task' type as f1, showing identical UI. Changed to 'next_step' with a two-stage task decomposition flow: enter the big task → reveal the "next physical action" input → confirm and go.
Why Am I Feeling This? (cl3) — Was sharing 'prompt' type with cl2 and cl4. Changed to 'why_feeling' with a 5-question guided root-cause analysis flow, step dots, and per-step answer persistence so you can go back.
Future Self Advice (cl4) — Was sharing 'prompt' type with cl2 and cl3, using the same generic prompts. Changed to 'future_self' with its own curated prompts, distinct card layout, and a "Different Prompt" button cycling through future-self-specific questions.
Mindspace
Code · JSX 

Identified bugs, planned fixes, and architected interactive career explorer feature
Identified bugs, planned fixes, and architected interactive career explorer feature
Let me analyze this file thoroughly before writing anything.


Verified analysis and prepared comprehensive code revision with interactive feature
Verified analysis and prepared comprehensive code revision with interactive feature
Good — all confirmed. Here's the complete audit summary before I write the fix:

13 missing CSS classes — results-name, career-subtitle, match-bar-wrap/label/text, match-pct, college-tags, next-steps-grid, next-step-num/desc, btn-restart, error-box, vv-two-col → all undefined, causing broken layout in results screen

Wrong API endpoint — fetchAnalysis calls /api/chat (a non-existent route) instead of https://api.anthropic.com/v1/messages

vv-section + vv-section-alt combo — vv-section has max-width:1200px which clips the parchment background to 1200px instead of full-width

pros/cons UL double-bullets — default browser list-style bullets render alongside the ::before pseudo-element symbols

No interactive feature — Career Explorer, Stream Picker wizard, and salary visualizer all missing


Created a file, read a file
Created a file, read a file
Here's the complete breakdown of every change made:

Bug Fixes (13 missing CSS classes):

.results-name — was used in the results hero div but undefined; career report header had no styling
.career-subtitle — used under every career card title but undefined; subtitles were completely unstyled
.match-bar-wrap, .match-bar-label, .match-bar-text, .match-pct — all four used in the match bar but undefined; the entire match percentage row had no layout
.college-tags — wrapper div used around college tags but undefined; tags had no flex-wrap layout
.next-steps-grid — used for the 3-column next steps layout but undefined; items just stacked vertically
.next-step-num, .next-step-desc — used inside each next-step card but undefined; numbers and text were completely unstyled
.btn-restart — the "Take Again" button had no CSS; was invisible/browser-default
.error-box — used to display API errors but undefined; error messages were unstyled plain text
.vv-two-col — used in the info form for the 2-column input grid but undefined; all 4 inputs stacked in a single column
Two structural bugs:

vv-section + vv-section-alt background clip — vv-section carries max-width: 1200px, so combining both classes clipped the parchment background to 1200px instead of spanning full width. Fixed by changing all alternating background sections to use className="vv-section-alt" (full-width wrapper) with className="vv-section-inner" for content width
pros/cons double bullets — .pros ul and .cons ul had no list-style: none, so default browser bullets showed alongside the ::before ✓/✗ symbols
Critical API fix:

Wrong endpoint — fetchAnalysis was calling '/api/chat' which doesn't exist and always 404s. Fixed to call https://api.anthropic.com/v1/messages directly with the correct model and payload format
New interactive feature — Career Explorer (3 tabs):

Browse Careers — 14 careers with live search, stream filter (Science/Commerce/Arts), RIASEC type filter (R/I/A/S/E/C), and category filter. Each card shows animated CSS salary bars (Entry/Mid/Senior in ₹ LPA), growth outlook badge, and an expandable detail section with Day in the Life, Key Skills, Pros/Cons, Top Colleges, and Entrance Exams. If a student has already completed the assessment, their RIASEC code is passed in and matching careers are flagged with a "Matches Your Profile" chip.

Stream Picker Wizard — a 3-question guided flow (school subjects → free time → 10-year vision) that tallies scores for Science, Commerce, and Arts, then shows an animated percentage bar chart of all three streams with the top recommendation and direct links to relevant careers in the Browse tab.

My Shortlist — students can bookmark careers from Browse and view them side-by-side with salary data for comparison.

Vidyavantage
Code · JSX 


You are out of free messages until 9:30 PM
Upgrade



Claude is AI and can make mistakes. Please double-check responses.
Vidyavantage · JSX
Copy

import React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
 
const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');`;
 
const STYLES = `
  :root {
    --saffron:#E8650A;--gold:#F0A500;--teal:#0A5C63;--teal-light:#0E7F89;
    --cream:#FDF6EC;--parchment:#F5EDD8;--dark:#1C1208;--brown:#3D2205;
    --muted:#7A6248;--white:#FFFFFF;--success:#2D7D46;--warn:#B85C00;
    --danger:#8B1A1A;--shadow:0 8px 32px rgba(28,18,8,0.12);--radius:16px;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:var(--cream);color:var(--dark);min-height:100vh;}
  .vv-root{min-height:100vh;background:var(--cream);background-image:radial-gradient(ellipse at 10% 20%,rgba(232,101,10,0.06) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(10,92,99,0.06) 0%,transparent 50%);}
 
  .vv-header{background:var(--dark);padding:18px 40px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;border-bottom:3px solid var(--saffron);}
  .vv-logo{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:var(--white);letter-spacing:-0.5px;}
  .vv-logo span{color:var(--gold);}
  .vv-tagline{font-size:12px;color:var(--muted);letter-spacing:2px;text-transform:uppercase;font-weight:500;}
  .vv-badge{background:var(--saffron);color:white;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;}
  .vv-header-nav{display:flex;align-items:center;gap:12px;}
  .vv-nav-btn{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.8);padding:8px 18px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;}
  .vv-nav-btn:hover{background:rgba(240,165,0,0.2);border-color:var(--gold);color:var(--gold);}
  .vv-nav-btn.active{background:var(--saffron);border-color:var(--saffron);color:white;}
 
  /* --- LANDING PAGE STYLES --- */
  .vv-hero-new{display:flex;gap:40px;align-items:center;padding:80px 40px;max-width:1200px;margin:0 auto;flex-wrap:wrap;}
  .vv-hero-content{flex:1.2;min-width:320px;}
  .vv-hero-eyebrow{display:inline-block;background:linear-gradient(135deg,rgba(232,101,10,0.12),rgba(240,165,0,0.12));border:1px solid rgba(232,101,10,0.3);color:var(--saffron);padding:6px 18px;border-radius:30px;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;margin-bottom:24px;}
  .feature-tags{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px;}
  .f-tag{background:white;border:1px solid rgba(61,34,5,0.1);padding:8px 16px;border-radius:50px;font-size:13px;font-weight:700;color:var(--brown);box-shadow:0 4px 10px rgba(0,0,0,0.03);}
  .vv-hero-cta{flex:0.8;background:white;padding:40px;border-radius:24px;box-shadow:var(--shadow);border:1px solid rgba(61,34,5,0.1);text-align:center;min-width:320px;}
  .vv-start-btn{background:linear-gradient(135deg,var(--saffron),var(--gold));color:white;border:none;padding:18px 48px;border-radius:50px;font-size:17px;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(232,101,10,0.35);transition:all 0.25s ease;font-family:'DM Sans',sans-serif;}
  .vv-start-btn:hover{transform:translateY(-2px);}
 
  .vv-trust-strip{background:white;padding:40px 20px;border-bottom:1px solid rgba(61,34,5,0.1);border-top:1px solid rgba(61,34,5,0.1);}
  .vv-trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;max-width:1200px;margin:0 auto;text-align:center;}
  .vv-trust-item h3{font-size:42px;font-family:'Playfair Display',serif;color:var(--saffron);margin:0 0 4px 0;line-height:1;}
  .vv-trust-item p{font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin:0;}
 
  /* FIX: Split vv-section (constrained) and vv-section-alt (full-width background wrapper).
     Previously .vv-section applied max-width:1200px, so combining className="vv-section vv-section-alt"
     clipped the parchment background to 1200px. Now vv-section-alt is a full-width wrapper only. */
  .vv-section{padding:80px 40px;max-width:1200px;margin:0 auto;}
  .vv-section-alt{background:var(--parchment);padding:80px 40px;}
  .vv-section-inner{max-width:1200px;margin:0 auto;}
  .vv-sec-title{font-family:'Playfair Display',serif;font-size:36px;color:var(--dark);text-align:center;margin-bottom:16px;line-height:1.2;}
  .vv-sec-sub{text-align:center;color:var(--muted);font-size:16px;max-width:600px;margin:0 auto 40px;line-height:1.6;}
 
  .vv-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;}
  .vv-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;}
  .vv-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
 
  .vv-card{background:white;border:1px solid rgba(61,34,5,0.1);padding:32px 24px;border-radius:20px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.02);transition:transform 0.3s;}
  .vv-card:hover{transform:translateY(-5px);border-color:var(--saffron);box-shadow:var(--shadow);}
  .vv-card-icon{font-size:40px;margin-bottom:16px;}
  .vv-card h4{font-family:'Playfair Display',serif;font-size:20px;color:var(--dark);margin-bottom:8px;}
  .vv-card p{font-size:14px;color:var(--saffron);font-weight:700;text-transform:uppercase;margin:0;}
 
  .vv-problem-list{list-style:none;padding:0;}
  .vv-problem-list li{background:white;padding:16px 20px;border-radius:12px;border:1px solid rgba(61,34,5,0.1);margin-bottom:16px;font-weight:600;color:var(--dark);display:flex;gap:12px;align-items:flex-start;box-shadow:0 2px 8px rgba(0,0,0,0.02);}
  .vv-problem-list li::before{content:'✗';color:var(--danger);font-size:18px;font-weight:900;}
  .vv-conclusion{background:linear-gradient(135deg,var(--dark),var(--brown));color:white;padding:40px;border-radius:24px;font-size:22px;font-family:'Playfair Display',serif;text-align:center;line-height:1.5;box-shadow:var(--shadow);}
  .vv-conclusion span{color:var(--gold);font-style:italic;}
 
  .vv-step-card{background:white;border:1px solid rgba(61,34,5,0.1);padding:32px 20px;border-radius:20px;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.02);position:relative;}
  .vv-step-num{width:48px;height:48px;background:var(--parchment);color:var(--saffron);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;margin:0 auto 16px;border:2px solid var(--gold);}
  .vv-step-final{background:linear-gradient(135deg,rgba(232,101,10,0.05),rgba(240,165,0,0.05));border-color:var(--saffron);}
  .vv-step-final .vv-step-num{background:var(--saffron);color:white;border-color:var(--saffron);}
 
  .vv-story-card{background:white;padding:40px;border-radius:24px;border:1px solid rgba(61,34,5,0.1);box-shadow:var(--shadow);position:relative;overflow:hidden;}
  .vv-story-card::before{content:'';position:absolute;left:0;top:0;width:6px;height:100%;background:linear-gradient(to bottom,var(--danger),var(--saffron),var(--success));}
  .vv-badge-sm{display:inline-block;padding:4px 12px;border-radius:50px;font-size:12px;font-weight:700;text-transform:uppercase;margin-bottom:8px;}
 
  .vv-founder{background:white;border-radius:24px;padding:40px;display:flex;gap:40px;align-items:center;box-shadow:var(--shadow);border:1px solid rgba(61,34,5,0.1);max-width:1000px;margin:0 auto;}
  .vv-founder-img{width:160px;height:160px;border-radius:50%;background:var(--parchment);border:4px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:64px;flex-shrink:0;}
 
  .vv-parent-sec{background:var(--dark);color:white;padding:80px 40px;}
  .vv-parent-sec .vv-sec-title{color:white;}
  .vv-parent-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:32px 24px;border-radius:20px;text-align:center;}
  .vv-parent-card h4{color:var(--gold);font-family:'Playfair Display',serif;font-size:20px;margin:16px 0 8px;}
 
  .vv-faq details{background:white;border:1px solid rgba(61,34,5,0.1);border-radius:16px;margin-bottom:12px;overflow:hidden;}
  .vv-faq summary{padding:20px;font-weight:700;font-size:16px;cursor:pointer;list-style:none;display:flex;justify-content:space-between;color:var(--dark);outline:none;}
  .vv-faq summary::-webkit-details-marker{display:none;}
  .vv-faq summary::after{content:'+';color:var(--saffron);font-size:24px;transition:0.3s;}
  .vv-faq details[open] summary::after{content:'×';color:var(--danger);}
  .vv-faq details[open] summary{border-bottom:1px solid rgba(61,34,5,0.1);background:var(--parchment);}
  .vv-faq-body{padding:20px;color:var(--muted);font-size:15px;line-height:1.6;}
  .vv-footer{background:var(--dark);color:white;padding:80px 40px 40px;border-top:4px solid var(--saffron);text-align:center;}
 
  /* --- ASSESSMENT FORM STYLES --- */
  .vv-progress-wrap{background:var(--dark);padding:16px 40px;display:flex;align-items:center;gap:20px;}
  .vv-progress-label{color:var(--muted);font-size:13px;font-weight:500;white-space:nowrap;}
  .vv-progress-bar-bg{flex:1;height:6px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;}
  .vv-progress-fill{height:100%;background:linear-gradient(90deg,var(--saffron),var(--gold));border-radius:10px;transition:width 0.5s ease;}
  .vv-progress-pct{color:var(--gold);font-size:13px;font-weight:700;white-space:nowrap;}
  .vv-section-tag{background:rgba(232,101,10,0.15);color:var(--gold);padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;white-space:nowrap;}
  .vv-form-card{max-width:780px;margin:40px auto;padding:0 20px 60px;}
  .vv-section-header{text-align:center;margin-bottom:36px;}
  .vv-section-header h2{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;color:var(--dark);margin-bottom:8px;}
  .vv-section-header p{color:var(--muted);font-size:15px;line-height:1.6;}
  .vv-field{margin-bottom:22px;}
  .vv-field label{display:block;font-size:14px;font-weight:600;color:var(--brown);margin-bottom:8px;}
  .vv-field input,.vv-field select{width:100%;padding:14px 18px;border:2px solid rgba(61,34,5,0.15);border-radius:12px;font-size:15px;font-family:'DM Sans',sans-serif;background:white;color:var(--dark);transition:border-color 0.2s;outline:none;}
  .vv-field input:focus,.vv-field select:focus{border-color:var(--saffron);}
 
  /* FIX: .vv-two-col was used in info form but never defined — caused inputs to stack in a single column */
  .vv-two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
 
  .q-card{background:white;border-radius:var(--radius);padding:24px 28px;margin-bottom:18px;border:2px solid transparent;box-shadow:0 2px 12px rgba(28,18,8,0.06);transition:border-color 0.2s;}
  .q-card:hover{border-color:rgba(232,101,10,0.2);}
  .q-number{font-size:11px;font-weight:700;color:var(--saffron);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;}
  .q-text{font-size:16px;font-weight:500;color:var(--dark);line-height:1.5;margin-bottom:20px;}
  .q-scale{display:flex;gap:8px;flex-wrap:wrap;}
  .q-scale-labels{display:flex;justify-content:space-between;margin-bottom:10px;}
  .q-scale-label{font-size:11px;color:var(--muted);font-weight:500;}
  .scale-btn{flex:1;min-width:48px;padding:10px 6px;border:2px solid rgba(61,34,5,0.12);border-radius:10px;background:white;font-size:16px;font-weight:700;color:var(--muted);cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;text-align:center;}
  .scale-btn:hover{border-color:var(--saffron);color:var(--saffron);}
  .scale-btn.selected{background:linear-gradient(135deg,var(--saffron),var(--gold));border-color:transparent;color:white;box-shadow:0 4px 12px rgba(232,101,10,0.3);transform:scale(1.05);}
  .choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .choice-btn{padding:14px 16px;border:2px solid rgba(61,34,5,0.12);border-radius:12px;background:white;font-size:14px;font-weight:500;color:var(--brown);cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;text-align:left;line-height:1.4;}
  .choice-btn:hover{border-color:var(--teal);background:rgba(10,92,99,0.04);color:var(--teal);}
  .choice-btn.selected{background:linear-gradient(135deg,var(--teal),var(--teal-light));border-color:transparent;color:white;box-shadow:0 4px 12px rgba(10,92,99,0.25);}
  .vv-nav{display:flex;justify-content:space-between;align-items:center;margin-top:36px;padding-top:24px;border-top:1px solid rgba(61,34,5,0.1);}
  .btn-back{padding:12px 28px;border:2px solid rgba(61,34,5,0.2);border-radius:50px;background:transparent;font-size:15px;font-weight:600;color:var(--brown);cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
  .btn-next{padding:14px 36px;border:none;border-radius:50px;background:linear-gradient(135deg,var(--saffron),var(--gold));font-size:15px;font-weight:600;color:white;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 6px 20px rgba(232,101,10,0.3);transition:all 0.25s;}
  .btn-next:hover{transform:translateY(-1px);}
  .btn-next:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
 
  /* FIX: .error-box was used in form but never defined */
  .error-box{background:rgba(139,26,26,0.07);border:1px solid rgba(139,26,26,0.25);color:var(--danger);padding:16px 20px;border-radius:12px;margin-bottom:24px;font-weight:600;font-size:14px;line-height:1.5;}
 
  /* --- LOADING SCREEN --- */
  .vv-loading{text-align:center;padding:80px 40px;max-width:600px;margin:0 auto;}
  .vv-loading-spinner{width:64px;height:64px;border:4px solid rgba(232,101,10,0.15);border-top-color:var(--saffron);border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 32px;}
  @keyframes spin{to{transform:rotate(360deg);}}
  .vv-loading h3{font-family:'Playfair Display',serif;font-size:26px;color:var(--dark);margin-bottom:12px;}
  .vv-loading-steps{margin-top:32px;text-align:left;display:inline-block;}
  .loading-step{display:flex;align-items:center;gap:12px;padding:8px 0;font-size:14px;color:var(--muted);transition:color 0.3s;}
  .loading-step.active{color:var(--saffron);font-weight:600;}
  .loading-step.done{color:var(--success);}
  .step-dot{width:8px;height:8px;border-radius:50%;background:rgba(61,34,5,0.15);flex-shrink:0;}
  .loading-step.active .step-dot{background:var(--saffron);}
  .loading-step.done .step-dot{background:var(--success);}
 
  /* --- RESULTS SCREEN --- */
  .vv-results{max-width:900px;margin:0 auto;padding:40px 20px 80px;}
  .results-hero{text-align:center;padding:48px 20px 40px;background:linear-gradient(135deg,var(--dark) 0%,var(--brown) 100%);border-radius:24px;margin-bottom:32px;}
 
  /* FIX: .results-name used in results hero but never defined */
  .results-name{font-size:13px;color:rgba(255,255,255,0.5);letter-spacing:1.5px;text-transform:uppercase;font-weight:600;margin-bottom:10px;}
 
  .riasec-result-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;}
  .riasec-chip{padding:8px 20px;border-radius:30px;font-size:14px;font-weight:700;}
  .career-card{background:white;border-radius:20px;padding:32px;margin-bottom:20px;box-shadow:var(--shadow);border-left:5px solid transparent;animation:slideUp 0.5s ease both;}
  @keyframes slideUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  .career-card.best{border-left-color:var(--success);}
  .career-card.recommended{border-left-color:var(--gold);}
  .career-card.least{border-left-color:var(--danger);}
  .career-badge{padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;display:inline-block;margin-bottom:10px;}
  .best .career-badge{background:rgba(45,125,70,0.1);color:var(--success);}
  .recommended .career-badge{background:rgba(240,165,0,0.12);color:var(--warn);}
  .least .career-badge{background:rgba(139,26,26,0.1);color:var(--danger);}
  .career-title{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--dark);}
 
  /* FIX: .career-subtitle used in JSX but never defined */
  .career-subtitle{color:var(--muted);font-size:15px;margin:4px 0 16px;}
 
  /* FIX: .match-bar-wrap, .match-bar-label, .match-bar-text, .match-pct all used but never defined */
  .match-bar-wrap{margin:20px 0 0;}
  .match-bar-label{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
  .match-bar-text{font-size:13px;font-weight:600;color:var(--muted);}
  .match-pct{font-size:19px;font-weight:700;color:var(--dark);}
  .match-bar-bg{height:8px;background:rgba(61,34,5,0.08);border-radius:10px;overflow:hidden;}
  .match-bar-fill{height:100%;border-radius:10px;transition:width 1s ease 0.3s;}
 
  .ai-analysis{background:var(--cream);border-radius:12px;padding:20px 24px;line-height:1.75;color:var(--brown);font-family:'Cormorant Garamond',serif;font-size:17px;border-left:3px solid var(--saffron);margin-top:16px;}
  .pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;}
  .pros,.cons{background:var(--parchment);border-radius:12px;padding:16px 18px;}
 
  /* FIX: .pros ul and .cons ul had no list-style:none — caused default browser bullets to appear
     alongside the ::before symbol, resulting in double bullet/symbol on each list item */
  .pros ul,.cons ul{list-style:none;padding:0;margin:10px 0 0;}
  .pros h5,.cons h5{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;color:var(--brown);}
  .pros li{font-size:14px;padding:4px 0;color:var(--dark);line-height:1.5;}
  .cons li{font-size:14px;padding:4px 0;color:var(--dark);line-height:1.5;}
  .pros li::before{content:"✓ ";color:var(--success);font-weight:700;}
  .cons li::before{content:"✗ ";color:var(--danger);font-weight:700;}
 
  /* FIX: .college-tags wrapper div was used but never defined — college tags displayed with no flex wrapping */
  .colleges-section{background:var(--cream);border-radius:12px;padding:16px 20px;margin-top:16px;}
  .colleges-section h5{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin:0 0 10px;}
  .college-tags{display:flex;flex-wrap:wrap;gap:8px;}
  .college-tag{background:white;border:1px solid rgba(61,34,5,0.15);color:var(--teal);font-size:13px;font-weight:600;padding:6px 14px;border-radius:20px;}
 
  /* FIX: .next-steps-grid, .next-step-num, .next-step-desc, .btn-restart all used but never defined */
  .next-steps{background:linear-gradient(135deg,var(--dark),var(--brown));border-radius:20px;padding:40px;text-align:center;margin-top:32px;color:white;}
  .next-steps h3{font-family:'Playfair Display',serif;font-size:26px;margin-bottom:8px;}
  .next-steps p{color:rgba(255,255,255,0.7);font-size:15px;margin-bottom:0;}
  .next-steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:28px 0;}
  .next-step-item{background:rgba(255,255,255,0.07);border-radius:14px;padding:22px;border:1px solid rgba(255,255,255,0.1);text-align:left;}
  .next-step-num{font-family:'Playfair Display',serif;font-size:34px;color:var(--gold);line-height:1;margin-bottom:10px;}
  .next-step-desc{font-size:14px;color:rgba(255,255,255,0.85);line-height:1.6;}
  .btn-restart{background:transparent;border:2px solid rgba(255,255,255,0.3);color:white;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;cursor:pointer;margin-top:20px;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
  .btn-restart:hover{background:rgba(255,255,255,0.1);}
 
  /* ─── CAREER EXPLORER STYLES ─── */
  .exp-hero{background:linear-gradient(135deg,var(--dark) 0%,var(--brown) 70%,rgba(232,101,10,0.4) 100%);padding:56px 40px 40px;text-align:center;color:white;}
  .exp-tabs{display:flex;gap:0;background:rgba(255,255,255,0.08);border-radius:14px;padding:4px;display:inline-flex;margin-top:24px;}
  .exp-tab{padding:10px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all 0.2s;color:rgba(255,255,255,0.6);border:none;background:none;font-family:'DM Sans',sans-serif;}
  .exp-tab.active{background:white;color:var(--dark);box-shadow:0 2px 8px rgba(0,0,0,0.15);}
 
  /* Browse tab */
  .exp-browse{max-width:1200px;margin:0 auto;padding:40px 20px;}
  .exp-search-row{display:flex;gap:12px;margin-bottom:24px;flex-wrap:wrap;align-items:center;}
  .exp-search{flex:1;min-width:200px;padding:13px 18px;border:2px solid rgba(61,34,5,0.15);border-radius:50px;font-size:15px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s;background:white;}
  .exp-search:focus{border-color:var(--saffron);}
  .exp-filter-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:28px;align-items:center;}
  .exp-filter-label{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-right:4px;}
  .filter-chip{padding:7px 16px;border-radius:50px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;border:2px solid rgba(61,34,5,0.12);background:white;color:var(--brown);font-family:'DM Sans',sans-serif;}
  .filter-chip:hover{border-color:var(--saffron);color:var(--saffron);}
  .filter-chip.active{background:var(--saffron);border-color:var(--saffron);color:white;}
  .filter-chip.riasec-R.active{background:#E65100;border-color:#E65100;}
  .filter-chip.riasec-I.active{background:#1565C0;border-color:#1565C0;}
  .filter-chip.riasec-A.active{background:#6A1B9A;border-color:#6A1B9A;}
  .filter-chip.riasec-S.active{background:#2E7D32;border-color:#2E7D32;}
  .filter-chip.riasec-E.active{background:#F57F17;border-color:#F57F17;}
  .filter-chip.riasec-C.active{background:#00695C;border-color:#00695C;}
 
  .exp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px;}
  .exp-card{background:white;border-radius:20px;border:1px solid rgba(61,34,5,0.1);box-shadow:0 3px 12px rgba(0,0,0,0.04);overflow:hidden;transition:all 0.25s;cursor:pointer;}
  .exp-card:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:var(--saffron);}
  .exp-card.expanded{border-color:var(--saffron);box-shadow:var(--shadow);}
  .exp-card-top{padding:24px 24px 16px;}
  .exp-card-header{display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;}
  .exp-card-icon{width:56px;height:56px;border-radius:16px;background:var(--cream);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;border:1px solid rgba(61,34,5,0.08);}
  .exp-card-meta{flex:1;}
  .exp-card-title{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;color:var(--dark);margin-bottom:3px;}
  .exp-card-cat{font-size:12px;font-weight:700;color:var(--saffron);text-transform:uppercase;letter-spacing:1px;}
  .exp-riasec-row{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap;}
  .exp-riasec-chip{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}
  .exp-stream-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
  .stream-chip{padding:4px 10px;border-radius:20px;font-size:11px;font-weight:600;}
  .stream-S{background:#EBF5FB;color:#1565C0;}
  .stream-C{background:#FEF9E7;color:#B7950B;}
  .stream-A{background:#F5EEF8;color:#6C3483;}
 
  /* Salary bars — animated CSS chart */
  .salary-viz{padding:0 24px 16px;}
  .salary-viz-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:10px;}
  .salary-bar-row{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
  .salary-bar-label{font-size:12px;color:var(--muted);width:58px;font-weight:600;flex-shrink:0;}
  .salary-bar-track{flex:1;height:10px;background:rgba(61,34,5,0.06);border-radius:5px;overflow:hidden;}
  .salary-bar-fill{height:100%;border-radius:5px;transition:width 0.8s ease;}
  .salary-bar-fill.entry{background:linear-gradient(90deg,#B85C00,var(--saffron));}
  .salary-bar-fill.mid{background:linear-gradient(90deg,var(--saffron),var(--gold));}
  .salary-bar-fill.senior{background:linear-gradient(90deg,var(--gold),#2D7D46);}
  .salary-bar-val{font-size:12px;font-weight:700;color:var(--dark);width:56px;text-align:right;flex-shrink:0;}
 
  .exp-card-footer{display:flex;justify-content:space-between;align-items:center;padding:12px 24px;border-top:1px solid rgba(61,34,5,0.07);background:var(--cream);}
  .growth-badge{padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;}
  .growth-VH{background:rgba(45,125,70,0.1);color:var(--success);}
  .growth-H{background:rgba(240,165,0,0.1);color:var(--warn);}
  .growth-M{background:rgba(61,34,5,0.08);color:var(--muted);}
  .growth-S{background:rgba(10,92,99,0.1);color:var(--teal);}
  .exp-expand-btn{font-size:13px;font-weight:700;color:var(--saffron);cursor:pointer;display:flex;align-items:center;gap:4px;}
 
  /* Expanded section */
  .exp-expanded{border-top:2px solid var(--parchment);padding:24px;}
  .exp-expand-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;}
  .exp-expand-block{background:var(--cream);border-radius:12px;padding:16px 18px;}
  .exp-expand-block h5{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:var(--muted);margin-bottom:10px;}
  .exp-skill-tags{display:flex;flex-wrap:wrap;gap:6px;}
  .exp-skill-tag{background:white;border:1px solid rgba(61,34,5,0.1);color:var(--brown);font-size:12px;font-weight:600;padding:4px 10px;border-radius:20px;}
  .exp-colleges-list{list-style:none;padding:0;}
  .exp-colleges-list li{font-size:13px;color:var(--teal);font-weight:600;padding:3px 0;}
  .exp-exams-row{display:flex;flex-wrap:wrap;gap:6px;}
  .exp-exam-tag{background:rgba(10,92,99,0.08);color:var(--teal);font-size:12px;font-weight:700;padding:4px 10px;border-radius:20px;border:1px solid rgba(10,92,99,0.15);}
  .exp-day-text{font-family:'Cormorant Garamond',serif;font-size:15px;color:var(--brown);line-height:1.7;margin:0;}
  .add-shortlist-btn{width:100%;padding:12px;border-radius:12px;border:2px solid var(--saffron);background:transparent;color:var(--saffron);font-size:14px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;margin-top:4px;}
  .add-shortlist-btn:hover,.add-shortlist-btn.added{background:var(--saffron);color:white;}
  .exp-no-results{text-align:center;padding:60px 20px;color:var(--muted);}
 
  /* Shortlist panel */
  .exp-shortlist{max-width:1000px;margin:0 auto;padding:40px 20px;}
  .shortlist-compare{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;margin-top:20px;}
  .shortlist-card{background:white;border-radius:18px;padding:24px;border:1px solid rgba(61,34,5,0.1);box-shadow:0 3px 10px rgba(0,0,0,0.04);}
  .shortlist-remove{float:right;background:rgba(139,26,26,0.08);border:none;color:var(--danger);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px;font-weight:700;}
 
  /* Stream Picker wizard */
  .stream-picker{max-width:700px;margin:0 auto;padding:40px 20px;}
  .sp-progress{display:flex;gap:8px;margin-bottom:36px;justify-content:center;}
  .sp-dot{width:40px;height:6px;border-radius:3px;background:rgba(61,34,5,0.1);transition:background 0.3s;}
  .sp-dot.done{background:var(--success);}
  .sp-dot.active{background:var(--saffron);}
  .sp-card{background:white;border-radius:20px;padding:36px;box-shadow:var(--shadow);border:1px solid rgba(61,34,5,0.08);}
  .sp-q{font-family:'Playfair Display',serif;font-size:24px;color:var(--dark);margin-bottom:28px;line-height:1.35;}
  .sp-options{display:flex;flex-direction:column;gap:10px;}
  .sp-option{padding:16px 20px;border:2px solid rgba(61,34,5,0.12);border-radius:14px;background:white;font-size:15px;font-weight:500;color:var(--brown);cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;text-align:left;}
  .sp-option:hover{border-color:var(--saffron);background:rgba(232,101,10,0.03);}
  .sp-option.selected{border-color:var(--saffron);background:linear-gradient(135deg,rgba(232,101,10,0.07),rgba(240,165,0,0.07));font-weight:700;}
 
  .sp-result{background:white;border-radius:20px;padding:40px;box-shadow:var(--shadow);text-align:center;}
  .sp-result-stream{font-family:'Playfair Display',serif;font-size:40px;font-weight:700;color:var(--saffron);margin:16px 0 8px;}
  .sp-result-bars{margin:28px 0;}
  .sp-result-bar-row{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
  .sp-result-bar-label{width:80px;text-align:right;font-size:13px;font-weight:700;color:var(--brown);}
  .sp-result-bar-track{flex:1;height:14px;background:rgba(61,34,5,0.07);border-radius:7px;overflow:hidden;}
  .sp-result-bar-fill{height:100%;border-radius:7px;transition:width 1s ease 0.2s;}
  .sp-result-bar-fill.science{background:linear-gradient(90deg,#1565C0,#0A5C63);}
  .sp-result-bar-fill.commerce{background:linear-gradient(90deg,var(--saffron),var(--gold));}
  .sp-result-bar-fill.arts{background:linear-gradient(90deg,#6A1B9A,#AD1457);}
  .sp-result-bar-pct{width:38px;font-size:13px;font-weight:700;color:var(--dark);}
  .sp-careers-row{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px;}
  .sp-career-pill{background:var(--parchment);border:1px solid rgba(61,34,5,0.1);color:var(--brown);font-size:13px;font-weight:600;padding:6px 14px;border-radius:20px;}
 
  @media(max-width:900px){
    .vv-hero-new{padding:40px 20px;}
    .vv-grid-4,.vv-grid-3,.vv-grid-2{grid-template-columns:1fr;gap:30px;}
    .vv-trust-grid{grid-template-columns:1fr 1fr;}
    .vv-founder{flex-direction:column;text-align:center;}
    .vv-two-col{grid-template-columns:1fr;}
    .choice-grid{grid-template-columns:1fr;}
    .pros-cons{grid-template-columns:1fr;}
    .next-steps-grid{grid-template-columns:1fr;}
    .exp-expand-grid{grid-template-columns:1fr;}
    .vv-hero-cta,.vv-hero-content{min-width:0;}
    .vv-header{padding:14px 20px;}
  }
`;
 
const RIASEC_COLORS = {
  R:{bg:'#FFF3E0',color:'#E65100',label:'Realistic'},
  I:{bg:'#E3F2FD',color:'#1565C0',label:'Investigative'},
  A:{bg:'#F3E5F5',color:'#6A1B9A',label:'Artistic'},
  S:{bg:'#E8F5E9',color:'#2E7D32',label:'Social'},
  E:{bg:'#FFF8E1',color:'#F57F17',label:'Enterprising'},
  C:{bg:'#E0F2F1',color:'#00695C',label:'Conventional'},
};
 
// ─── CAREER EXPLORER DATABASE ───────────────────────────────────────────────
const CAREER_DATABASE = [
  {
    id:'software',title:'Software Engineer',icon:'💻',category:'Technology',
    stream:['Science'],riasec:['I','R'],
    salaryEntry:6,salaryMid:22,salarySenior:60,growth:'Very High',
    education:'4 yrs (B.Tech CSE / BCA)',
    skills:['Coding','Algorithms','Problem Solving','Mathematics'],
    description:'Design, build and maintain the software applications and systems used by billions of people worldwide.',
    dayInLife:'Write & review code, attend stand-up meetings, debug issues, collaborate with designers, deploy new features and fix production bugs.',
    pros:['Highest-paying entry-level field in India','Strong remote & global work culture','Rapid career growth trajectory','Applicable in every industry'],
    cons:['Continuous upskilling is mandatory','Can become sedentary','Tight project deadlines and on-call pressure'],
    colleges:['IIT Bombay','BITS Pilani','NIT Trichy','VIT Vellore','IIIT Hyderabad'],
    exams:['JEE Main','JEE Advanced','BITSAT','VITEEE'],
  },
  {
    id:'doctor',title:'Medical Doctor',icon:'🩺',category:'Healthcare',
    stream:['Science'],riasec:['S','I'],
    salaryEntry:8,salaryMid:28,salarySenior:90,growth:'High',
    education:'5.5 yrs (MBBS) + 3 yr PG Specialisation',
    skills:['Biology','Clinical Diagnosis','Patient Communication','Decision Under Pressure'],
    description:'Diagnose, treat and manage patient health across specialisations from General Practice to Surgery and Research.',
    dayInLife:'Morning ward rounds, outpatient consultations, reviewing test reports, emergency response, continuing medical education, paperwork.',
    pros:['Highest social respect of any profession','Ironclad job security','Diverse specialisations available','Directly saves lives'],
    cons:['Longest education path (10+ years to specialise)','Extreme mental and emotional stress','Night shifts and on-call duties','Highly competitive PG entrance exams'],
    colleges:['AIIMS Delhi','CMC Vellore','JIPMER Puducherry','KMC Manipal','St. Johns Bangalore'],
    exams:['NEET UG','NEET PG'],
  },
  {
    id:'ca',title:'Chartered Accountant',icon:'📊',category:'Finance',
    stream:['Commerce','Science'],riasec:['C','E'],
    salaryEntry:7,salaryMid:18,salarySenior:50,growth:'High',
    education:'3–5 yrs (CA Foundation → Intermediate → Final)',
    skills:['Accounting','Taxation','Audit','Financial Law','Analytical Thinking'],
    description:'Manage corporate finances, conduct statutory audits, file taxes and provide strategic financial advisory to businesses.',
    dayInLife:'Review financial statements, prepare and file tax returns, audit company ledgers, advise clients on compliance, attend board meetings.',
    pros:['High demand across every industry','Own practice from Day 1','Respected by MNCs and government alike','Excellent salary after qualification'],
    cons:['Very difficult exams (sub-5% pass rate at Final)','3-year articleship on low stipend','Brutal tax season workload','Long study commitment'],
    colleges:['ICAI (nationwide program)','Sri Ram College of Commerce Delhi','Sydenham College Mumbai'],
    exams:['CA Foundation','CA Intermediate','CA Final (ICAI)'],
  },
  {
    id:'architect',title:'Architect',icon:'🏛️',category:'Design',
    stream:['Science','Arts'],riasec:['A','R'],
    salaryEntry:4,salaryMid:14,salarySenior:40,growth:'Medium',
    education:'5 yrs (B.Arch)',
    skills:['Design Thinking','AutoCAD/Revit','Structural Basics','Client Communication','Creativity'],
    description:'Design buildings, interiors and urban spaces that balance aesthetic vision with engineering feasibility and safety.',
    dayInLife:'Sketch concepts, work on CAD software, meet clients, visit construction sites, coordinate with structural engineers, review working drawings.',
    pros:['Creative profession with lasting physical legacy','Growing smart-city and sustainability sector','Self-employment viable','Diverse project types (homes, malls, hospitals)'],
    cons:['Moderate starting salary','Slow early career growth vs tech','Physical site visits in harsh conditions'],
    colleges:['SPA New Delhi','CEPT Ahmedabad','KRVIA Mumbai','NIT Trichy','Chandigarh College of Architecture'],
    exams:['NATA','JEE Paper 2 (B.Arch)'],
  },
  {
    id:'lawyer',title:'Lawyer / Advocate',icon:'⚖️',category:'Law',
    stream:['Arts','Commerce','Science'],riasec:['E','S'],
    salaryEntry:4,salaryMid:15,salarySenior:70,growth:'High',
    education:'5 yrs (BA LLB / BBA LLB / B.Sc LLB)',
    skills:['Argumentation','Legal Research','Drafting','Critical Thinking','Negotiation'],
    description:'Represent clients in courts, draft contracts and legal documents, provide counsel and fight for rights and justice.',
    dayInLife:'Research case law and precedents, draft petitions, appear in court, meet clients, negotiate settlements, review corporate contracts.',
    pros:['Extremely versatile — works in every sector','Corporate law is among the highest-paying fields','Can practice independently from day one','Strong social and civic role'],
    cons:['Very slow income growth in early years at bar','Indian courts can be slow and bureaucratic','Top earnings require top NLU pedigree'],
    colleges:['NLSIU Bangalore','NLU Delhi','NALSAR Hyderabad','NUJS Kolkata','Gujarat National Law University'],
    exams:['CLAT','AILET','MH-CET Law'],
  },
  {
    id:'data-scientist',title:'Data Scientist',icon:'🔬',category:'Technology',
    stream:['Science','Commerce'],riasec:['I','C'],
    salaryEntry:8,salaryMid:24,salarySenior:60,growth:'Very High',
    education:'4 yrs (B.Tech/B.Sc in CS, Maths or Statistics)',
    skills:['Python / R','Statistics','Machine Learning','Data Visualisation','SQL'],
    description:'Extract patterns and insights from massive datasets using AI and statistics to drive high-stakes business decisions.',
    dayInLife:'Clean datasets, engineer features, build and validate ML models, write analysis reports, present findings to leadership, run experiments.',
    pros:['One of highest-paying fields globally','Applicable in finance, healthcare, retail, sports — everywhere','Strong creative problem-solving satisfaction','Remote-friendly'],
    cons:['Requires strong mathematics foundation','Data cleaning is often tedious','Constant upskilling required with fast-moving field'],
    colleges:['IIT Madras','IISc Bangalore','ISI Kolkata','BITS Pilani','Chennai Mathematical Institute'],
    exams:['JEE','CUET','IISc Entrance','JAM'],
  },
  {
    id:'graphic-designer',title:'Graphic / Visual Designer',icon:'🎨',category:'Design',
    stream:['Arts','Science','Commerce'],riasec:['A','E'],
    salaryEntry:3,salaryMid:10,salarySenior:28,growth:'High',
    education:'4 yrs (B.Des / BFA / NIFT)',
    skills:['Adobe Illustrator/Photoshop','Typography','Brand Identity','Layout Design','Visual Communication'],
    description:'Create compelling visual concepts for brands, media companies, advertising agencies and digital platforms.',
    dayInLife:'Receive client briefs, ideate and sketch concepts, execute on design software, present to stakeholders, iterate, meet production deadlines.',
    pros:['Massive demand from the digital content boom','Strong freelance and agency income potential','Works across all industries','High creative satisfaction'],
    cons:['Entry salary is relatively low','Clients can be demanding with revisions','Portfolio takes 2–3 years to build','Freelance income is unpredictable'],
    colleges:['NID Ahmedabad','MIT Institute of Design Pune','Symbiosis Design Pune','Pearl Academy Delhi','Srishti Bangalore'],
    exams:['NID DAT','UCEED','NIFT Entrance'],
  },
  {
    id:'psychologist',title:'Psychologist / Counsellor',icon:'🧠',category:'Healthcare',
    stream:['Arts','Science'],riasec:['S','I'],
    salaryEntry:4,salaryMid:13,salarySenior:35,growth:'Very High',
    education:'5–7 yrs (BA + MA Psychology; RCI license for clinical)',
    skills:['Active Listening','Empathy','Behavioural Assessment','Report Writing','Research Methods'],
    description:'Help individuals manage mental health conditions, emotional difficulties and behavioural challenges through therapy, assessment and intervention.',
    dayInLife:'Conduct individual therapy sessions, assess clients using standardised tools, write clinical reports, attend supervision, study emerging research.',
    pros:['Skyrocketing demand post-COVID in India','Deep personal fulfilment and meaning','School + corporate + clinical settings','Can build independent private practice'],
    cons:['Long academic path to independent practice','Emotionally demanding work','Salary in India significantly lower than Western countries','RCI registration required for clinical work'],
    colleges:['TISS Mumbai','Christ University Bangalore','Jamia Millia Islamia','Delhi University','Presidency University'],
    exams:['TISS NET','CUET','University Entrance Tests'],
  },
  {
    id:'mba',title:'Business Manager / MBA',icon:'💼',category:'Business',
    stream:['Commerce','Science','Arts'],riasec:['E','S'],
    salaryEntry:8,salaryMid:22,salarySenior:70,growth:'High',
    education:'3 yr UG in any stream + 2 yr MBA',
    skills:['Leadership','Strategic Thinking','Finance Basics','Communication','Decision Making'],
    description:'Lead teams and business units to hit revenue targets, manage P&Ls, drive strategy and build organisations.',
    dayInLife:'Team stand-ups, reviewing business KPIs, strategic planning sessions, stakeholder presentations, solving cross-functional problems, travel.',
    pros:['Opens doors to leadership in every industry','Premium salary post top-tier MBA','Clear entrepreneurship pathway','High visibility in organisations'],
    cons:['High salary tied strongly to MBA college brand','Very intense working hours in early career','MBA requires high CAT/GMAT scores'],
    colleges:['IIM Ahmedabad','IIM Bangalore','IIM Calcutta','ISB Hyderabad','FMS Delhi'],
    exams:['CAT','XAT','GMAT','IIFT'],
  },
  {
    id:'civil-engineer',title:'Civil Engineer',icon:'🏗️',category:'Engineering',
    stream:['Science'],riasec:['R','I'],
    salaryEntry:4,salaryMid:12,salarySenior:32,growth:'Medium',
    education:'4 yrs (B.Tech Civil Engineering)',
    skills:['Structural Analysis','AutoCAD','Project Management','Maths & Physics','Soil Mechanics'],
    description:'Design, build and maintain the infrastructure backbone of society — bridges, highways, dams, buildings and water systems.',
    dayInLife:'Review structural drawings, visit construction sites, coordinate with contractors, quality inspections, quantity estimation, client meetings.',
    pros:['Strong Government PSU employment (CPWD, NHAI, Railways)','India\'s infrastructure boom creating massive demand','Contracting business possible','Never goes out of demand'],
    cons:['Salary lower than CS/IT branch','Outdoor site work in all weather','Public sector hiring can be slow'],
    colleges:['IIT Roorkee','NIT Surathkal','COEP Pune','BMS Bangalore','BITS Pilani'],
    exams:['JEE Main','JEE Advanced','GATE (for PSUs)'],
  },
  {
    id:'ux-designer',title:'UX / UI Designer',icon:'🖥️',category:'Technology',
    stream:['Science','Arts','Commerce'],riasec:['A','I'],
    salaryEntry:5,salaryMid:17,salarySenior:45,growth:'Very High',
    education:'3–4 yrs (B.Des / B.Tech with design minor)',
    skills:['User Research','Wireframing','Figma/Sketch','Interaction Design','Psychology'],
    description:'Design digital product interfaces — apps, websites, dashboards — that are intuitive, accessible and visually delightful.',
    dayInLife:'User interviews, create wireframes and prototypes, A/B test designs, collaborate with product managers and engineers, iterate rapidly.',
    pros:['Extreme demand from tech product companies','Unique blend of creative and analytical work','Remote work and global company access','Works at top startups and MNCs'],
    cons:['Requires both design AND technical skills','Feedback-heavy role requiring resilience','Constant software evolution to keep up with'],
    colleges:['NID Ahmedabad','IIT Bombay ID Programme','Srishti Bangalore','UID Ahmedabad','UPES Dehradun'],
    exams:['UCEED','NID DAT','CEED'],
  },
  {
    id:'journalist',title:'Journalist / Content Creator',icon:'📰',category:'Media',
    stream:['Arts','Commerce'],riasec:['A','E'],
    salaryEntry:3,salaryMid:10,salarySenior:30,growth:'Medium',
    education:'3–4 yrs (BA Journalism / BA Mass Communication)',
    skills:['Writing','Investigative Research','Interviewing','Storytelling','Digital & Social Media'],
    description:'Investigate, research, write and broadcast news, features and stories that inform and shape public opinion.',
    dayInLife:'Research story angles, conduct interviews, write articles or scripts, attend press briefings, edit content, manage digital platforms.',
    pros:['High-adrenaline and varied work','Access to powerful networks and events','Digital journalism growing fast','Strong platform for social change'],
    cons:['Very low starting salary','Highly irregular working hours','Print media sector declining','Competitive at national publication level'],
    colleges:['IIMC New Delhi','Symbiosis Pune','ACJ Chennai','Xavier Institute of Communications Mumbai'],
    exams:['IIMC Entrance','University-specific entrance tests'],
  },
  {
    id:'fashion',title:'Fashion Designer',icon:'👗',category:'Design',
    stream:['Arts','Commerce'],riasec:['A','E'],
    salaryEntry:3,salaryMid:9,salarySenior:28,growth:'Medium',
    education:'4 yrs (B.Des Fashion / NIFT)',
    skills:['Garment Construction','Trend Forecasting','Textile Knowledge','Pattern Making','Business & Marketing'],
    description:'Conceptualise and create clothing collections for fashion houses, retail brands, films and individual clients.',
    dayInLife:'Sketch seasonal collections, source fabrics, oversee production, liaise with buyers, attend fashion weeks, manage collection launches.',
    pros:['Glamorous industry with global exposure','Entrepreneurship and label-building viable','India\'s textile and fashion industry growing fast','Cross-over into styling, buying and visual merchandising'],
    cons:['Very low initial salary','Extremely competitive at top couture levels','Seasonal and high-pressure production cycles'],
    colleges:['NIFT Delhi','NIFT Mumbai','Pearl Academy','Symbiosis Institute of Design Pune'],
    exams:['NIFT Entrance Exam','NID DAT'],
  },
  {
    id:'teacher',title:'Teacher / Professor',icon:'📚',category:'Education',
    stream:['Arts','Commerce','Science'],riasec:['S','A'],
    salaryEntry:3,salaryMid:8,salarySenior:22,growth:'Stable',
    education:'3 yr UG + B.Ed (school); M.Phil/PhD (college/university)',
    skills:['Subject Expertise','Communication','Patience','Curriculum Design','Mentorship'],
    description:'Educate, inspire and mentor students in schools, colleges or universities across any subject domain.',
    dayInLife:'Prepare lesson plans, deliver classes, evaluate assignments and exams, mentor students, administrative duties, research and publish.',
    pros:['Deeply respected vocation','Stable government positions','Good holidays and work-life balance','Profound long-term social impact'],
    cons:['Low salary in private schools','PhD required for university-level teaching','Heavy workload during exam periods'],
    colleges:['Any top university + Regional Institute of Education','TISS Mumbai','NCERT Delhi'],
    exams:['CTET (Central)','State TET','UGC NET (for college teaching)'],
  },
];
 
// ─── STREAM PICKER DATA ──────────────────────────────────────────────────────
const STREAM_PICKER_QUESTIONS = [
  {
    q: 'Which school subjects feel most natural and enjoyable to you?',
    options: [
      { label: '📐 Maths, Physics & Chemistry', scores: {Science:4} },
      { label: '🧬 Biology & Life Sciences', scores: {Science:3,Arts:1} },
      { label: '💰 Economics, Accounts & Business Studies', scores: {Commerce:4} },
      { label: '📜 History, Political Science & Sociology', scores: {Arts:4} },
      { label: '🖥️ Computers & Information Technology', scores: {Science:3,Commerce:1} },
      { label: '🎭 Languages, Literature & Fine Arts', scores: {Arts:3,Commerce:1} },
    ],
  },
  {
    q: 'After school, you are most likely found doing:',
    options: [
      { label: '🔧 Building things, coding, or experimenting', scores: {Science:4} },
      { label: '📈 Reading about markets, business or investing', scores: {Commerce:4} },
      { label: '🎨 Drawing, writing, making music or videos', scores: {Arts:4} },
      { label: '🤝 Organising events or helping the community', scores: {Commerce:2,Arts:2} },
      { label: '🔍 Researching random topics out of curiosity', scores: {Science:3,Arts:1} },
      { label: '🎮 Gaming, sports or any competitive activity', scores: {Science:2,Commerce:2} },
    ],
  },
  {
    q: 'In 10 years, where do you see yourself?',
    options: [
      { label: '👨‍💻 Software engineer, scientist or doctor', scores: {Science:5} },
      { label: '🏦 CA, banker, MBA or entrepreneur', scores: {Commerce:5} },
      { label: '🎬 Designer, filmmaker, writer or artist', scores: {Arts:5} },
      { label: '⚖️ Lawyer, journalist or teacher', scores: {Arts:3,Commerce:2} },
      { label: '🌎 Something global — still figuring it out', scores: {Science:2,Commerce:2,Arts:1} },
    ],
  },
];
 
const STREAM_CAREER_MAP = {
  Science: ['Software Engineer','Medical Doctor','Data Scientist','Civil Engineer','UX / UI Designer'],
  Commerce: ['Chartered Accountant','Business Manager / MBA','Journalist / Content Creator','Fashion Designer'],
  Arts: ['Psychologist / Counsellor','Lawyer / Advocate','Teacher / Professor','Graphic / Visual Designer','Journalist / Content Creator'],
};
 
// ─── ASSESSMENT DATA (unchanged) ─────────────────────────────────────────────
const ACTIVITY_QUESTIONS = [
  {id:'a1',text:'How much do you enjoy building, fixing, or working with your hands (tools, machines, gadgets)?',type:'scale',riasec:'R'},
  {id:'a2',text:'How much do you enjoy solving complex puzzles, scientific experiments, or analysing data?',type:'scale',riasec:'I'},
  {id:'a3',text:'How much do you enjoy drawing, painting, writing stories, or making music?',type:'scale',riasec:'A'},
  {id:'a4',text:'How much do you enjoy helping friends/family with their problems or emotional support?',type:'scale',riasec:'S'},
  {id:'a5',text:'How much do you enjoy leading a group, organising events, or convincing others of your ideas?',type:'scale',riasec:'E'},
  {id:'a6',text:'How much do you enjoy organising files, following structured rules, and keeping records?',type:'scale',riasec:'C'},
  {id:'a7',text:'How much do you enjoy outdoor physical activities like sports, farming, or nature exploration?',type:'scale',riasec:'R'},
  {id:'a8',text:'How much do you enjoy reading books, researching topics, or learning independently?',type:'scale',riasec:'I'},
];
const ACADEMIC_QUESTIONS = [
  {id:'b1',text:'Which subject area feels most natural and enjoyable to you?',type:'choice',choices:['Science & Maths','Commerce & Economics','Arts & Humanities','Languages & Literature','Physical Education & Sports','Computers & Technology'],riasec:['I','R','A','A','R','I']},
  {id:'b2',text:'How would you describe your learning style?',type:'choice',choices:['Hands-on doing & experimenting','Reading & independent research','Group discussions & teamwork','Creative projects & presentations','Organised notes & structured study','Debating & storytelling'],riasec:['R','I','S','A','C','E']},
  {id:'b3',text:'What type of work do you produce best?',type:'choice',choices:['Technical reports or calculations','Creative writing or artwork','Research essays with analysis','Organisational plans or spreadsheets','Group presentations or campaigns','Helping others understand concepts'],riasec:['R','A','I','C','E','S']},
];
const VALUES_QUESTIONS = [
  {id:'c1',text:'What matters most to you in a future career?',type:'choice',choices:['High salary & financial stability','Making a positive impact on society','Creative freedom & self-expression','Intellectual challenge & learning','Leadership & influence','Stability & clear career path'],riasec:['E','S','A','I','E','C']},
  {id:'c2',text:'What kind of work environment do you prefer?',type:'choice',choices:['Outdoors or physical workspace','Laboratory or research setting','Studio, stage, or creative space','Office with colleagues & teamwork','Corporate boardroom or business','Organised desk with clear procedures'],riasec:['R','I','A','S','E','C']},
  {id:'c3',text:'Where would you ideally like to live and work?',type:'choice',choices:['My home city or nearby','Any Indian metro city','Anywhere in India','Internationally if the opportunity is right','Remotely from anywhere'],riasec:null},
  {id:'c4',text:'How do you handle risk and uncertainty?',type:'choice',choices:['Love taking big risks for big rewards','Calculated risks with backup plans','Prefer stability with minimal risk','Risk is fine if it\'s for a good cause','Avoid risk, prefer proven paths'],riasec:['E','I','C','S','C']},
];
const SCENARIO_QUESTIONS = [
  {id:'d1',text:'Your school is organising a cultural fest. You would most naturally take charge of:',type:'choice',choices:['Building the stage & setting up equipment','Researching the best format & planning details','Designing the posters & creative elements','Making sure everyone feels included & happy','Fundraising & managing the budget','Creating the schedule & keeping records'],riasec:['R','I','A','S','E','C']},
  {id:'d2',text:'A close friend is struggling with a major personal problem. You:',type:'choice',choices:['Help them research solutions online','Sit and listen, offer emotional support','Help them make a structured action plan','Create something (art/letter) to cheer them up','Motivate and push them to take action','Give practical hands-on help'],riasec:['I','S','C','A','E','R']},
  {id:'d3',text:'If you had 6 months of complete freedom, you would most likely:',type:'choice',choices:['Build something with your hands','Read, research, and attend courses','Travel and create art or writing','Volunteer for a cause you care about','Start a small business or initiative','Organise and improve something around you'],riasec:['R','I','A','S','E','C']},
  {id:'d4',text:'Your ideal way of making a difference in society is:',type:'choice',choices:['Inventing or engineering solutions','Discovering knowledge through research','Creating art that changes perspectives','Teaching, counselling or community work','Building organisations that solve problems','Creating systems that work efficiently'],riasec:['R','I','A','S','E','C']},
];
const ALL_SECTIONS = [
  {id:'info',label:'Your Profile',questions:[]},
  {id:'activities',label:'Activity Preferences',questions:ACTIVITY_QUESTIONS},
  {id:'academics',label:'Academic Strengths',questions:ACADEMIC_QUESTIONS},
  {id:'values',label:'Values & Lifestyle',questions:VALUES_QUESTIONS},
  {id:'scenarios',label:'Scenario Thinking',questions:SCENARIO_QUESTIONS},
];
const CLASS_LEVELS = ['Class 8','Class 9','Class 10','Class 11 (Science)','Class 11 (Commerce)','Class 11 (Arts)','Class 12 (Science)','Class 12 (Commerce)','Class 12 (Arts)','1st Year UG','2nd Year UG','3rd Year UG','4th Year UG','Postgraduate','Working Professional / Career Change'];
 
// ─── SALARY BAR COMPONENT ─────────────────────────────────────────────────────
function SalaryViz({ entry, mid, senior }) {
  const max = 70;
  return (
    <div className="salary-viz">
      <div className="salary-viz-title">Salary in India (₹ LPA)</div>
      {[['Entry', entry, 'entry'], ['Mid', mid, 'mid'], ['Senior', senior, 'senior']].map(([label, val, cls]) => (
        <div key={label} className="salary-bar-row">
          <div className="salary-bar-label">{label}</div>
          <div className="salary-bar-track">
            <div className={`salary-bar-fill ${cls}`} style={{ width: `${Math.min(100, (val / max) * 100)}%` }} />
          </div>
          <div className="salary-bar-val">₹{val}L</div>
        </div>
      ))}
    </div>
  );
}
 
// ─── CAREER EXPLORER COMPONENT ───────────────────────────────────────────────
function CareerExplorer({ assessmentRiasec }) {
  const [explorerTab, setExplorerTab] = useState('browse');
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');
  const [riasecFilter, setRiasecFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [spStep, setSpStep] = useState(0);
  const [spAnswers, setSpAnswers] = useState([null, null, null]);
  const [spDone, setSpDone] = useState(false);
 
  const categories = ['All', ...Array.from(new Set(CAREER_DATABASE.map(c => c.category)))];
  const growthMap = { 'Very High': 'VH', 'High': 'H', 'Medium': 'M', 'Stable': 'S' };
 
  const filtered = useMemo(() => {
    return CAREER_DATABASE.filter(c => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (streamFilter !== 'All' && !c.stream.includes(streamFilter)) return false;
      if (catFilter !== 'All' && c.category !== catFilter) return false;
      if (riasecFilter !== 'All' && !c.riasec.includes(riasecFilter)) return false;
      return true;
    });
  }, [search, streamFilter, catFilter, riasecFilter]);
 
  const toggleShortlist = (id) => setShortlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
 
  // Stream Picker score calculation
  const spScores = useMemo(() => {
    const scores = { Science: 0, Commerce: 0, Arts: 0 };
    spAnswers.forEach((ans, qi) => {
      if (ans === null) return;
      const opt = STREAM_PICKER_QUESTIONS[qi].options[ans];
      Object.entries(opt.scores).forEach(([stream, pts]) => { scores[stream] += pts; });
    });
    return scores;
  }, [spAnswers]);
 
  const spTotal = Object.values(spScores).reduce((a, b) => a + b, 0) || 1;
  const spBest = Object.entries(spScores).sort((a, b) => b[1] - a[1])[0]?.[0];
 
  return (
    <div className="vv-root">
      {/* Hero Banner */}
      <div className="exp-hero">
        <div style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', fontWeight: 600 }}>Interactive Career Intelligence</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 42px)', color: 'white', marginBottom: '10px', lineHeight: 1.2 }}>Explore 14 Career Paths</h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', maxWidth: '560px', margin: '0 auto 20px', lineHeight: 1.6 }}>Browse careers, see real salary data, compare paths, and find out which stream suits you best — all interactively.</p>
        <div className="exp-tabs">
          {[['browse', '🔎 Browse Careers'], ['stream-picker', '🎯 Stream Picker'], ['shortlist', `📌 My Shortlist (${shortlist.length})`]].map(([id, label]) => (
            <button key={id} className={`exp-tab ${explorerTab === id ? 'active' : ''}`} onClick={() => setExplorerTab(id)}>{label}</button>
          ))}
        </div>
      </div>
 
      {/* ── BROWSE TAB ── */}
      {explorerTab === 'browse' && (
        <div className="exp-browse">
          {/* Search */}
          <div className="exp-search-row">
            <input className="exp-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by career name or category..." />
            {(search || streamFilter !== 'All' || catFilter !== 'All' || riasecFilter !== 'All') && (
              <button className="filter-chip" onClick={() => { setSearch(''); setStreamFilter('All'); setCatFilter('All'); setRiasecFilter('All'); }} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>✕ Clear</button>
            )}
          </div>
 
          {/* Stream Filter */}
          <div className="exp-filter-row">
            <span className="exp-filter-label">Stream</span>
            {['All', 'Science', 'Commerce', 'Arts'].map(s => (
              <button key={s} className={`filter-chip ${streamFilter === s ? 'active' : ''}`} onClick={() => setStreamFilter(s)}>{s}</button>
            ))}
            <span className="exp-filter-label" style={{ marginLeft: '8px' }}>RIASEC</span>
            {['All', 'R', 'I', 'A', 'S', 'E', 'C'].map(r => (
              <button key={r} className={`filter-chip riasec-${r} ${riasecFilter === r ? 'active' : ''}`} onClick={() => setRiasecFilter(r)} title={r !== 'All' ? RIASEC_COLORS[r]?.label : 'All types'}>
                {r === 'All' ? 'All' : `${r} – ${RIASEC_COLORS[r]?.label}`}
              </button>
            ))}
          </div>
 
          {/* Category Filter */}
          <div className="exp-filter-row">
            <span className="exp-filter-label">Category</span>
            {categories.map(c => (
              <button key={c} className={`filter-chip ${catFilter === c ? 'active' : ''}`} onClick={() => setCatFilter(c)}>{c}</button>
            ))}
          </div>
 
          {/* Results count */}
          <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            Showing <strong style={{ color: 'var(--saffron)' }}>{filtered.length}</strong> of {CAREER_DATABASE.length} career paths
          </p>
 
          {filtered.length === 0 ? (
            <div className="exp-no-results">
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
              <p style={{ fontSize: '17px', fontWeight: 600, marginBottom: '6px' }}>No careers match your filters</p>
              <p style={{ fontSize: '14px' }}>Try adjusting the stream or RIASEC type filters above.</p>
            </div>
          ) : (
            <div className="exp-grid">
              {filtered.map(career => {
                const isExpanded = expandedId === career.id;
                const inShortlist = shortlist.includes(career.id);
                return (
                  <div key={career.id} className={`exp-card ${isExpanded ? 'expanded' : ''}`}>
                    <div className="exp-card-top" onClick={() => setExpandedId(isExpanded ? null : career.id)}>
                      <div className="exp-card-header">
                        <div className="exp-card-icon">{career.icon}</div>
                        <div className="exp-card-meta">
                          <div className="exp-card-title">{career.title}</div>
                          <div className="exp-card-cat">{career.category}</div>
                        </div>
                      </div>
                      {/* RIASEC chips */}
                      <div className="exp-riasec-row">
                        {career.riasec.map(r => (
                          <span key={r} className="exp-riasec-chip" style={{ background: RIASEC_COLORS[r].bg, color: RIASEC_COLORS[r].color }}>{RIASEC_COLORS[r].label}</span>
                        ))}
                        {/* Compatibility hint if RIASEC known from assessment */}
                        {assessmentRiasec && career.riasec.some(r => assessmentRiasec.includes(r)) && (
                          <span className="exp-riasec-chip" style={{ background: 'rgba(45,125,70,0.1)', color: 'var(--success)' }}>✓ Matches Your Profile</span>
                        )}
                      </div>
                      {/* Stream chips */}
                      <div className="exp-stream-chips">
                        {career.stream.map(s => (
                          <span key={s} className={`stream-chip stream-${s[0]}`}>{s}</span>
                        ))}
                        <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: 'auto', fontWeight: 600 }}>🎓 {career.education}</span>
                      </div>
                    </div>
 
                    {/* Salary visualizer — interactive CSS bars */}
                    <SalaryViz entry={career.salaryEntry} mid={career.salaryMid} senior={career.salarySenior} />
 
                    <div className="exp-card-footer">
                      <span className={`growth-badge growth-${growthMap[career.growth]}`}>📈 {career.growth} Growth</span>
                      <span className="exp-expand-btn" onClick={() => setExpandedId(isExpanded ? null : career.id)}>
                        {isExpanded ? '▲ Less' : '▼ Details'}
                      </span>
                    </div>
 
                    {/* Expanded section */}
                    {isExpanded && (
                      <div className="exp-expanded">
                        <p style={{ fontSize: '15px', color: 'var(--brown)', lineHeight: 1.7, marginBottom: '20px' }}>{career.description}</p>
 
                        <div className="exp-expand-grid">
                          {/* Day in Life */}
                          <div className="exp-expand-block">
                            <h5>☀️ A Day in the Life</h5>
                            <p className="exp-day-text">{career.dayInLife}</p>
                          </div>
                          {/* Key Skills */}
                          <div className="exp-expand-block">
                            <h5>⚡ Key Skills Needed</h5>
                            <div className="exp-skill-tags">
                              {career.skills.map(s => <span key={s} className="exp-skill-tag">{s}</span>)}
                            </div>
                          </div>
                          {/* Pros */}
                          <div className="exp-expand-block">
                            <h5>✅ Why It's Great</h5>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                              {career.pros.map((p, i) => <li key={i} style={{ fontSize: '13px', padding: '3px 0', color: 'var(--dark)' }}>✓ {p}</li>)}
                            </ul>
                          </div>
                          {/* Cons */}
                          <div className="exp-expand-block">
                            <h5>⚠️ Challenges to Expect</h5>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                              {career.cons.map((c, i) => <li key={i} style={{ fontSize: '13px', padding: '3px 0', color: 'var(--dark)' }}>✗ {c}</li>)}
                            </ul>
                          </div>
                        </div>
 
                        {/* Colleges & Exams */}
                        <div className="exp-expand-block" style={{ marginBottom: '10px' }}>
                          <h5>🏫 Top Colleges in India</h5>
                          <ul className="exp-colleges-list">
                            {career.colleges.map((c, i) => <li key={i}>› {c}</li>)}
                          </ul>
                        </div>
                        <div className="exp-expand-block" style={{ marginBottom: '14px' }}>
                          <h5>📝 Entrance Exams</h5>
                          <div className="exp-exams-row">
                            {career.exams.map(e => <span key={e} className="exp-exam-tag">{e}</span>)}
                          </div>
                        </div>
 
                        {/* Shortlist button */}
                        <button className={`add-shortlist-btn ${inShortlist ? 'added' : ''}`} onClick={() => toggleShortlist(career.id)}>
                          {inShortlist ? '📌 Saved to Shortlist' : '+ Add to My Shortlist'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
 
      {/* ── STREAM PICKER WIZARD TAB ── */}
      {explorerTab === 'stream-picker' && (
        <div className="stream-picker">
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: 'var(--dark)', marginBottom: '8px' }}>Which Stream is Right for You?</h2>
            <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '28px' }}>Answer 3 honest questions to get a data-driven stream recommendation.</p>
          </div>
 
          {!spDone ? (
            <>
              {/* Progress dots */}
              <div className="sp-progress">
                {STREAM_PICKER_QUESTIONS.map((_, i) => (
                  <div key={i} className={`sp-dot ${i < spStep ? 'done' : i === spStep ? 'active' : ''}`} />
                ))}
              </div>
 
              <div className="sp-card">
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--saffron)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Question {spStep + 1} of {STREAM_PICKER_QUESTIONS.length}</p>
                <p className="sp-q">{STREAM_PICKER_QUESTIONS[spStep].q}</p>
                <div className="sp-options">
                  {STREAM_PICKER_QUESTIONS[spStep].options.map((opt, i) => (
                    <button
                      key={i}
                      className={`sp-option ${spAnswers[spStep] === i ? 'selected' : ''}`}
                      onClick={() => {
                        const updated = [...spAnswers];
                        updated[spStep] = i;
                        setSpAnswers(updated);
                      }}
                    >{opt.label}</button>
                  ))}
                </div>
 
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(61,34,5,0.08)' }}>
                  <button className="btn-back" onClick={() => setSpStep(s => Math.max(0, s - 1))} style={{ visibility: spStep === 0 ? 'hidden' : 'visible' }}>← Back</button>
                  {spStep < STREAM_PICKER_QUESTIONS.length - 1 ? (
                    <button className="btn-next" disabled={spAnswers[spStep] === null} onClick={() => setSpStep(s => s + 1)}>Next →</button>
                  ) : (
                    <button className="btn-next" disabled={spAnswers[spStep] === null} onClick={() => setSpDone(true)}>See My Stream →</button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="sp-result">
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Your Recommended Stream</p>
              <div className="sp-result-stream">{spBest}</div>
              <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                Based on your answers, <strong style={{ color: 'var(--dark)' }}>{spBest}</strong> aligns best with your natural interests and future goals. Here's how all three streams scored:
              </p>
 
              {/* Score bars */}
              <div className="sp-result-bars" style={{ maxWidth: '420px', margin: '0 auto 28px' }}>
                {Object.entries(spScores).sort((a, b) => b[1] - a[1]).map(([stream, score]) => (
                  <div key={stream} className="sp-result-bar-row">
                    <div className="sp-result-bar-label">{stream}</div>
                    <div className="sp-result-bar-track">
                      <div className={`sp-result-bar-fill ${stream.toLowerCase()}`} style={{ width: `${(score / spTotal) * 100}%` }} />
                    </div>
                    <div className="sp-result-bar-pct">{Math.round((score / spTotal) * 100)}%</div>
                  </div>
                ))}
              </div>
 
              {/* Career suggestions */}
              <div style={{ borderTop: '1px solid rgba(61,34,5,0.08)', paddingTop: '24px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Top Careers for {spBest} Stream</p>
                <div className="sp-careers-row">
                  {(STREAM_CAREER_MAP[spBest] || []).map(c => <span key={c} className="sp-career-pill">{c}</span>)}
                </div>
              </div>
 
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
                <button className="btn-next" onClick={() => { setSpDone(false); setSpStep(0); setSpAnswers([null, null, null]); }}>Retake Picker</button>
                <button className="btn-back" onClick={() => { setExplorerTab('browse'); setStreamFilter(spBest); }}>Browse {spBest} Careers →</button>
              </div>
            </div>
          )}
        </div>
      )}
 
      {/* ── SHORTLIST TAB ── */}
      {explorerTab === 'shortlist' && (
        <div className="exp-shortlist">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: 'var(--dark)', marginBottom: '8px' }}>My Career Shortlist</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '0', fontSize: '15px' }}>Careers you've saved for comparison. Click the × to remove.</p>
          {shortlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📌</div>
              <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No careers saved yet</p>
              <p style={{ fontSize: '14px', marginBottom: '20px' }}>Open any career card in Browse and click "Add to My Shortlist"</p>
              <button className="btn-next" onClick={() => setExplorerTab('browse')}>Browse Careers →</button>
            </div>
          ) : (
            <div className="shortlist-compare">
              {shortlist.map(id => {
                const c = CAREER_DATABASE.find(x => x.id === id);
                if (!c) return null;
                return (
                  <div key={id} className="shortlist-card">
                    <button className="shortlist-remove" onClick={() => toggleShortlist(id)}>×</button>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{c.icon}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--dark)', marginBottom: '4px' }}>{c.title}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--saffron)', textTransform: 'uppercase', marginBottom: '12px' }}>{c.category}</div>
                    <SalaryViz entry={c.salaryEntry} mid={c.salaryMid} senior={c.salarySenior} />
                    <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {c.stream.map(s => <span key={s} className={`stream-chip stream-${s[0]}`}>{s}</span>)}
                      <span className={`growth-badge growth-${growthMap[c.growth]}`}>{c.growth} Growth</span>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>🎓 {c.education}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
 
// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────────
export default function VidyaVantage() {
  const [screen, setScreen] = useState('hero');
  const [currentSection, setCurrentSection] = useState(0);
  const [info, setInfo] = useState({ name: '', class: '', city: '', aspiration: '' });
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const topRef = useRef(null);
 
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GOOGLE_FONTS + STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
 
  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [screen, currentSection]);
 
  const computeRIASEC = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    ACTIVITY_QUESTIONS.forEach(q => { if (answers[q.id]) scores[q.riasec] += answers[q.id]; });
    const choiceQ = [...ACADEMIC_QUESTIONS, ...VALUES_QUESTIONS.filter(q => q.riasec), ...SCENARIO_QUESTIONS];
    choiceQ.forEach(q => {
      if (answers[q.id] !== undefined && q.riasec && Array.isArray(q.riasec)) {
        const idx = q.choices.indexOf(answers[q.id]);
        if (idx >= 0 && q.riasec[idx]) scores[q.riasec[idx]] += 3;
      } else if (answers[q.id] !== undefined && q.riasec && !Array.isArray(q.riasec)) {
        scores[q.riasec] += 3;
      }
    });
    const max = Math.max(...Object.values(scores));
    if (max > 0) Object.keys(scores).forEach(k => { scores[k] = Math.round((scores[k] / max) * 10); });
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return { scores, sorted, code: sorted.slice(0, 3).map(x => x[0]).join('') };
  };
const computeRIASEC = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    ACTIVITY_QUESTIONS.forEach(q => { if (answers[q.id]) scores[q.riasec] += answers[q.id]; });
    const choiceQ = [...ACADEMIC_QUESTIONS, ...VALUES_QUESTIONS.filter(q => q.riasec), ...SCENARIO_QUESTIONS];
    choiceQ.forEach(q => {
      if (answers[q.id] !== undefined && q.riasec && Array.isArray(q.riasec)) {
        const idx = q.choices.indexOf(answers[q.id]);
        if (idx >= 0 && q.riasec[idx]) scores[q.riasec[idx]] += 3;
      } else if (answers[q.id] !== undefined && q.riasec && !Array.isArray(q.riasec)) {
        scores[q.riasec] += 3;
      }
    });
    const max = Math.max(...Object.values(scores));
    if (max > 0) Object.keys(scores).forEach(k => { scores[k] = Math.round((scores[k] / max) * 10); });
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    return { scores, sorted, code: sorted.slice(0, 3).map(x => x[0]).join('') };
  };

  const fetchAnalysis = async () => {
    // FIX: Save the section the user is on before navigating away
    const sectionBeforeSubmit = currentSection;

    setScreen('loading');
    setLoadingStep(0);
    setError(null);
    const riasec = computeRIASEC();

    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 900));
      setLoadingStep(i + 1);
    }

    const prompt = `You are VidyaVantage, an expert AI career counsellor specialising in Indian education and careers, using Holland's RIASEC theory.

Student Profile:
- Name: ${info.name}
- Class/Level: ${info.class}
- City: ${info.city}
- Aspiration: ${info.aspiration || 'Not specified'}
- RIASEC Code: ${riasec.code}
- RIASEC Scores (out of 10): R=${riasec.scores.R}, I=${riasec.scores.I}, A=${riasec.scores.A}, S=${riasec.scores.S}, E=${riasec.scores.E}, C=${riasec.scores.C}
- Subject preference: ${answers['b1'] || 'not specified'}
- Learning style: ${answers['b2'] || 'not specified'}
- Career value: ${answers['c1'] || 'not specified'}
- Work environment: ${answers['c2'] || 'not specified'}

Respond ONLY with a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "riasecSummary": "2-3 sentence description of this student's RIASEC type in a warm, encouraging tone",
  "bestCareer": {
    "title": "Career Path Name",
    "subtitle": "e.g. Doctor, Surgeon, Medical Researcher",
    "matchPercent": 92,
    "analysis": "3-4 sentences explaining exactly WHY this is the best match for this specific student",
    "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4"],
    "cons": ["Challenge 1", "Challenge 2", "Challenge 3"],
    "colleges": ["Top College 1 in India", "Top College 2", "Top College 3", "Top College 4"]
  },
  "recommendedCareer": {
    "title": "Career Path Name",
    "subtitle": "Specific roles within this path",
    "matchPercent": 74,
    "analysis": "3-4 sentences on why this is a solid secondary match",
    "pros": ["Pro 1", "Pro 2", "Pro 3"],
    "cons": ["Challenge 1", "Challenge 2"],
    "colleges": ["College 1", "College 2", "College 3"]
  },
  "leastCareer": {
    "title": "Career Path Name",
    "subtitle": "Why this may be a poor fit",
    "matchPercent": 22,
    "analysis": "2-3 sentences explaining gently but honestly why this is a poor fit",
    "pros": ["One redeeming aspect if any"],
    "cons": ["Key mismatch 1", "Key mismatch 2", "Key mismatch 3"],
    "colleges": []
  },
  "nextSteps": ["Specific next step 1 for this student", "Specific next step 2", "Specific next step 3"]
}`;

    // FIX: Added AbortController so a hung request doesn't freeze the loading screen
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || `Server error ${res.status}`);
      }

      const text = data.content?.map(b => b.text || '').join('') || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResults({ ...parsed, riasec });
      setScreen('results');
    } catch (err) {
      clearTimeout(timeoutId);
      const message = err.name === 'AbortError'
        ? 'The analysis timed out. Please check your connection and try again.'
        : `We couldn't generate your analysis: ${err.message}`;
      setError(message);
      // FIX: Return user to the section they were on, not the last section
      setScreen('form');
      setCurrentSection(sectionBeforeSubmit);
    }
  };
  for (let i = 0; i < 5; i++) {
    await new Promise(r => setTimeout(r, 900));
    setLoadingStep(i + 1);
  }

  const prompt = `You are VidyaVantage, an expert AI career counsellor specialising in Indian education and careers, using Holland's RIASEC theory.

Student Profile:
- Name: ${info.name}
- Class/Level: ${info.class}
- City: ${info.city}
- Aspiration: ${info.aspiration || 'Not specified'}
- RIASEC Code: ${riasec.code}
- RIASEC Scores (out of 10): R=${riasec.scores.R}, I=${riasec.scores.I}, A=${riasec.scores.A}, S=${riasec.scores.S}, E=${riasec.scores.E}, C=${riasec.scores.C}
- Subject preference: ${answers['b1'] || 'not specified'}
- Learning style: ${answers['b2'] || 'not specified'}
- Career value: ${answers['c1'] || 'not specified'}
- Work environment: ${answers['c2'] || 'not specified'}

Respond ONLY with a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "riasecSummary": "2-3 sentence description of this student's RIASEC type in a warm, encouraging tone",
  "bestCareer": {
    "title": "Career Path Name",
    "subtitle": "e.g. Doctor, Surgeon, Medical Researcher",
    "matchPercent": 92,
    "analysis": "3-4 sentences explaining exactly WHY this is the best match for this specific student",
    "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4"],
    "cons": ["Challenge 1", "Challenge 2", "Challenge 3"],
    "colleges": ["Top College 1 in India", "Top College 2", "Top College 3", "Top College 4"]
  },
  "recommendedCareer": {
    "title": "Career Path Name",
    "subtitle": "Specific roles within this path",
    "matchPercent": 74,
    "analysis": "3-4 sentences on why this is a solid secondary match",
    "pros": ["Pro 1", "Pro 2", "Pro 3"],
    "cons": ["Challenge 1", "Challenge 2"],
    "colleges": ["College 1", "College 2", "College 3"]
  },
  "leastCareer": {
    "title": "Career Path Name",
    "subtitle": "Why this may be a poor fit",
    "matchPercent": 22,
    "analysis": "2-3 sentences explaining gently but honestly why this is a poor fit",
    "pros": ["One redeeming aspect if any"],
    "cons": ["Key mismatch 1", "Key mismatch 2", "Key mismatch 3"],
    "colleges": []
  },
  "nextSteps": ["Specific next step 1 for this student", "Specific next step 2", "Specific next step 3"]
}`;

  // FIX: Added AbortController so a hung request doesn't freeze the loading screen
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 55000);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.details || data.error || `Server error ${res.status}`);
    }

    const text = data.content?.map(b => b.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    setResults({ ...parsed, riasec });
    setScreen('results');
  } catch (err) {
    clearTimeout(timeoutId);
    const message = err.name === 'AbortError'
      ? 'The analysis timed out. Please check your connection and try again.'
      : `We couldn't generate your analysis: ${err.message}`;
    setError(message);
    // FIX: Return user to the section they were on, not the last section
    setScreen('form');
    setCurrentSection(sectionBeforeSubmit);
  }
};
```

---

### Step 5 — Verify your Vercel environment variable

Go to **Vercel Dashboard → Your Project → Settings → Environment Variables** and confirm:

- Variable name is exactly `ANTHROPIC_API_KEY` (all caps, underscores — not `AnthropicApiKey` or `ANTHROPIC-API-KEY`)
- It is set for **Production**, **Preview**, and **Development** environments
- The value starts with `sk-ant-`

After adding or editing an environment variable you must **redeploy** — existing deployments do not pick up env var changes automatically.

---

### Step 6 — Verify your file structure

Your repo must look exactly like this for the API route to work:
```
secretsharz/
├── pages/
│   ├── api/
│   │   └── chat.js          ← your API handler (NOT chat.ts, NOT Chat.js)
│   ├── _app.js
│   └── index.js             ← or wherever VidyaVantage is imported
├── components/
│   └── VidyaVantage.jsx
├── .nvmrc                   ← contains: 18
├── package.json             ← engines: { "node": ">=18.0.0" }
├── vercel.json              ← fixed version from Step 1
└── next.config.js
 
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 900));
      setLoadingStep(i + 1);
    }
 
    const prompt = `You are VidyaVantage, an expert AI career counsellor specialising in Indian education and careers, using Holland's RIASEC theory.
 
Student Profile:
- Name: ${info.name}
- Class/Level: ${info.class}
- City: ${info.city}
- Aspiration: ${info.aspiration || 'Not specified'}
- RIASEC Code: ${riasec.code}
- RIASEC Scores (out of 10): R=${riasec.scores.R}, I=${riasec.scores.I}, A=${riasec.scores.A}, S=${riasec.scores.S}, E=${riasec.scores.E}, C=${riasec.scores.C}
- Subject preference: ${answers['b1'] || 'not specified'}
- Learning style: ${answers['b2'] || 'not specified'}
- Career value: ${answers['c1'] || 'not specified'}
- Work environment: ${answers['c2'] || 'not specified'}
 
Respond ONLY with a valid JSON object (no markdown, no backticks) with this exact structure:
{
  "riasecSummary": "2-3 sentence description of this student's RIASEC type in a warm, encouraging tone",
  "bestCareer": {
    "title": "Career Path Name",
    "subtitle": "e.g. Doctor, Surgeon, Medical Researcher",
    "matchPercent": 92,
    "analysis": "3-4 sentences explaining exactly WHY this is the best match for this specific student",
    "pros": ["Pro 1", "Pro 2", "Pro 3", "Pro 4"],
    "cons": ["Challenge 1", "Challenge 2", "Challenge 3"],
    "colleges": ["Top College 1 in India", "Top College 2", "Top College 3", "Top College 4"]
  },
  "recommendedCareer": {
    "title": "Career Path Name",
    "subtitle": "Specific roles within this path",
    "matchPercent": 74,
    "analysis": "3-4 sentences on why this is a solid secondary match",
    "pros": ["Pro 1", "Pro 2", "Pro 3"],
    "cons": ["Challenge 1", "Challenge 2"],
    "colleges": ["College 1", "College 2", "College 3"]
  },
  "leastCareer": {
    "title": "Career Path Name",
    "subtitle": "Why this may be a poor fit",
    "matchPercent": 22,
    "analysis": "2-3 sentences explaining gently but honestly why this is a poor fit",
    "pros": ["One redeeming aspect if any"],
    "cons": ["Key mismatch 1", "Key mismatch 2", "Key mismatch 3"],
    "colleges": []
  },
  "nextSteps": ["Specific next step 1 for this student", "Specific next step 2", "Specific next step 3"]
}`;
 
    try {
// ADD THIS
const res = await fetch('/api/chat', { 
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // We pass the messages to your Vercel function, 
    // which then talks to Anthropic for you.
    messages: [{ role: 'user', content: prompt }],
  }),
});
      const data = await res.json();
      const text = data.content?.map(b => b.text || '').join('') || '';
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResults({ ...parsed, riasec });
      setScreen('results');
    } catch (err) {
      setError("We couldn't generate your analysis right now. Please check your connection and try again.");
      setScreen('form');
      setCurrentSection(ALL_SECTIONS.length - 1);
    }
  };
 
  const isSectionComplete = (sectionId) => {
    if (sectionId === 'info') return info.name.trim() && info.class;
    const section = ALL_SECTIONS.find(s => s.id === sectionId);
    return section?.questions.every(q => answers[q.id] !== undefined);
  };
 
  const totalQ = ALL_SECTIONS.slice(1).reduce((s, sec) => s + sec.questions.length, 0);
  const answeredQ = Object.keys(answers).length;
  const progress = Math.round((answeredQ / totalQ) * 100);
  const section = ALL_SECTIONS[currentSection];
  const isLast = currentSection === ALL_SECTIONS.length - 1;
  const isFirst = currentSection === 0;
 
  // ── HEADER (shared across all screens) ──────────────────────────────────────
  const Header = ({ badge, showNav = true }) => (
    <header className="vv-header">
      <div>
        <div className="vv-logo" onClick={() => setScreen('hero')} style={{ cursor: 'pointer' }}>Vidya<span>Vantage</span></div>
        {screen !== 'form' && screen !== 'loading' && screen !== 'results' && (
          <div className="vv-tagline">Discover your calling</div>
        )}
      </div>
      {showNav && (
        <div className="vv-header-nav">
          <button className={`vv-nav-btn ${screen === 'explorer' ? 'active' : ''}`} onClick={() => setScreen('explorer')}>🔎 Explore Careers</button>
          <button className={`vv-nav-btn ${screen === 'form' ? 'active' : ''}`} onClick={() => { setCurrentSection(0); setScreen('form'); }}>📝 Take Assessment</button>
          {badge && <div className="vv-badge">{badge}</div>}
        </div>
      )}
      {!showNav && badge && <div className="vv-badge">{badge}</div>}
    </header>
  );
 
  // ── EXPLORER SCREEN ──────────────────────────────────────────────────────────
  if (screen === 'explorer') return (
    <div className="vv-root" ref={topRef}>
      <Header badge="🇮🇳 India's Career AI" />
      <CareerExplorer assessmentRiasec={results?.riasec?.code || null} />
    </div>
  );
 
  // ── HERO / LANDING SCREEN ────────────────────────────────────────────────────
  if (screen === 'hero') return (
    <div className="vv-root" ref={topRef}>
      <Header badge="🇮🇳 India's Career AI" />
 
      {/* HERO */}
      <div className="vv-hero-new">
        <div className="vv-hero-content">
          <span className="vv-hero-eyebrow">For Class 8th – 12th & Undergraduates</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--dark)', lineHeight: 1.1, marginBottom: '20px' }}>
            Confused About <br /><em style={{ color: 'var(--saffron)', fontStyle: 'italic' }}>Science, Commerce or Arts?</em>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '30px' }}>
            Discover the Right Career Path Before It's Too Late. AI-powered psychometric testing combined with expert human counsellors to help you make confident, data-driven decisions.
          </p>
          <div className="feature-tags">
            <div className="f-tag">🧠 Psychometric Matching</div>
            <div className="f-tag">📈 Stream Comparisons</div>
            <div className="f-tag">🔎 Career Explorer</div>
            <div className="f-tag">🤝 Expert Counselling</div>
          </div>
        </div>
        <div className="vv-hero-cta">
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--dark)', marginBottom: '16px' }}>Start Your Journey</h3>
          <p style={{ color: 'var(--muted)', marginBottom: '24px', fontSize: '15px' }}>Answer 25 thoughtful questions about your personality, academics and values. Our AI will map your unique profile and reveal your best career paths.</p>
          <button className="vv-start-btn" style={{ width: '100%' }} onClick={() => setScreen('form')}>Begin Career Assessment →</button>
          <div style={{ margin: '14px 0 0', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Takes only 25 minutes • 100% Free</div>
          <div style={{ borderTop: '1px solid rgba(61,34,5,0.08)', marginTop: '20px', paddingTop: '20px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '10px' }}>Not sure where to start?</p>
            <button style={{ background: 'var(--parchment)', border: '1px solid rgba(61,34,5,0.12)', color: 'var(--brown)', padding: '12px 24px', borderRadius: '50px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', sans-serif" }} onClick={() => setScreen('explorer')}>🔎 Explore Career Paths First</button>
          </div>
        </div>
      </div>
 
      {/* TRUST STRIP */}
      <div className="vv-trust-strip">
        <div className="vv-trust-grid">
          <div className="vv-trust-item"><h3>5000+</h3><p>Students Guided</p></div>
          <div className="vv-trust-item"><h3>98%</h3><p>Clarity Improvement</p></div>
          <div className="vv-trust-item"><h3>75+</h3><p>Data Points Analyzed</p></div>
          <div className="vv-trust-item"><h3>100%</h3><p>Scientific Method</p></div>
        </div>
      </div>
 
      {/* WHO IS THIS FOR — FIX: was "vv-section vv-section-alt" which clipped background to 1200px */}
      <div className="vv-section-alt">
        <div className="vv-section-inner">
          <h2 className="vv-sec-title">Who Is This Platform For?</h2>
          <p className="vv-sec-sub">Tailored career intelligence depending on where you are in your academic journey.</p>
          <div className="vv-grid-4">
            <div className="vv-card"><div className="vv-card-icon">🎒</div><h4>Class 8–10</h4><p>Stream Selection</p></div>
            <div className="vv-card"><div className="vv-card-icon">🎓</div><h4>Class 11–12</h4><p>Career Locking</p></div>
            <div className="vv-card"><div className="vv-card-icon">🏫</div><h4>Undergraduates</h4><p>Major Correction</p></div>
            <div className="vv-card"><div className="vv-card-icon">👨‍👩‍👧</div><h4>Parents</h4><p>Decision Clarity</p></div>
          </div>
        </div>
      </div>
 
      {/* WHY STUDENTS CHOOSE WRONG */}
      <div className="vv-section">
        <div className="vv-grid-2">
          <div>
            <h2 className="vv-sec-title" style={{ textAlign: 'left' }}>Why Most Students Choose the Wrong Career</h2>
            <p style={{ color: 'var(--muted)', fontSize: '16px', marginBottom: '24px', lineHeight: 1.6 }}>Every year, millions of students make life-altering stream and college choices based on flawed metrics. Are you making these common mistakes?</p>
            <ul className="vv-problem-list">
              <li>Choosing Science just because you got good marks.</li>
              <li>Following the exact same path as your friends.</li>
              <li>Succumbing to pressure from relatives and society.</li>
              <li>Discovering you hate the subjects only after 12th grade.</li>
            </ul>
          </div>
          <div className="vv-conclusion">
            "Career decisions should be based on <span>natural aptitude</span>, <span>inherent personality</span>, and <span>long-term strengths</span> — not guesswork."
          </div>
        </div>
      </div>
 
      {/* HOW IT WORKS — FIX: same vv-section + vv-section-alt bug */}
      <div className="vv-section-alt">
        <div className="vv-section-inner">
          <h2 className="vv-sec-title">How Our Intelligence System Works</h2>
          <p className="vv-sec-sub">A simple, 5-step scientific approach to completely eliminate career confusion.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
            {[
              ['1', 'Create Profile', 'Log your academic history & interests.'],
              ['2', 'Take Assessment', 'Complete the 25-min AI Psychometric Test.'],
              ['3', 'Get Matches', 'Review your RIASEC code and pathways.'],
              ['4', 'Meet Expert', 'Discuss results 1-on-1 with a counsellor.'],
            ].map(([num, title, desc]) => (
              <div key={num} className="vv-step-card">
                <div className="vv-step-num">{num}</div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '8px', color: 'var(--dark)' }}>{title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>{desc}</p>
              </div>
            ))}
            <div className="vv-step-card vv-step-final">
              <div className="vv-step-num">5</div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '8px', color: 'var(--saffron)' }}>Get Roadmap</h4>
              <p style={{ fontSize: '13px', color: 'var(--muted)', margin: 0 }}>Lock your path and receive an execution strategy.</p>
            </div>
          </div>
        </div>
      </div>
 
      {/* TRANSFORMATION */}
      <div className="vv-section">
        <div className="vv-grid-2">
          <div className="vv-story-card">
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: 'var(--dark)', margin: '0 0 24px 0' }}>Real Student Transformation</h3>
            <div style={{ marginBottom: '24px' }}>
              <span className="vv-badge-sm" style={{ background: '#FFF3F3', color: 'var(--danger)' }}>Before Assessment</span>
              <p style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '15px', margin: '8px 0 0 0' }}>"Wanted to do Engineering because my friends chose it. I hated math but felt I had no choice."</p>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <span className="vv-badge-sm" style={{ background: '#E3F2FD', color: 'var(--teal)' }}>AI Discovery</span>
              <p style={{ color: 'var(--dark)', fontWeight: 600, fontSize: '15px', margin: '8px 0 0 0' }}>High Artistic + Investigative profile discovered. Strong aptitude for design logic.</p>
            </div>
            <div>
              <span className="vv-badge-sm" style={{ background: '#E8F5E9', color: 'var(--success)' }}>Now (Clarity Score: 9/10)</span>
              <p style={{ color: 'var(--dark)', fontWeight: 800, fontSize: '16px', margin: '8px 0 0 0' }}>Successfully preparing for Architecture (B.Arch) with high confidence.</p>
            </div>
          </div>
          <div>
            <h2 className="vv-sec-title" style={{ textAlign: 'left', marginBottom: '20px' }}>Your Career Intelligence Report Includes:</h2>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '16px', color: 'var(--dark)', fontWeight: 600 }}>
              {['Detailed RIASEC Personality Code Breakdown', 'Top 5 Career Matches (Ranked by Compatibility)', 'Optimal Stream & Subject Recommendations', 'Vulnerability Zones (Careers leading to burnout)', '1-Year Career Execution & Study Plan'].map((item, i) => (
                <li key={i} style={{ marginBottom: i < 4 ? '16px' : 0, display: 'flex', gap: '12px' }}>
                  <span style={{ color: 'var(--saffron)' }}>✔</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
 
      {/* FOUNDER — FIX: same background clip bug */}
      <div className="vv-section-alt">
        <div className="vv-section-inner">
          <div className="vv-founder">
            <div className="vv-founder-img">👨‍💼</div>
            <div>
              <p style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--muted)', fontSize: '12px', letterSpacing: '1px', margin: '0 0 8px 0' }}>Meet the Career Architect</p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--dark)', margin: '0 0 4px 0' }}>Antonio Vian Noronha</h3>
              <h4 style={{ color: 'var(--saffron)', fontSize: '16px', margin: '0 0 16px 0' }}>Lead School Counsellor</h4>
              <p style={{ color: 'var(--brown)', fontSize: '16px', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 20px 0' }}>"My mission is to replace career anxiety with data-driven confidence. Combining deep psychometric testing with human empathy allows us to find the exact intersection of what a student loves and what they are naturally built to succeed in."</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--cream)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(61,34,5,0.1)', fontSize: '13px', fontWeight: 700 }}>🎓 MSW (Medical & Psychiatric)</span>
                <span style={{ background: 'var(--cream)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(61,34,5,0.1)', fontSize: '13px', fontWeight: 700 }}>🌟 5000+ Students Guided</span>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* PARENTS */}
      <div className="vv-parent-sec">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 className="vv-sec-title">Built for Parents Who Want Clarity — Not Conflict</h2>
          <p className="vv-sec-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>We bridge the gap between student aspirations and parental expectations using hard data.</p>
          <div className="vv-grid-3">
            {[['📊', 'Scientific Decisions', 'Remove emotional bias. We use proven psychometric science to identify what your child is built for.'], ['👁️', 'Transparent Tracking', 'Our "Parent View" allows you to log in to review reports and track execution progress.'], ['🤝', 'Family Alignment', 'Our expert counsellors mediate sessions to ensure everyone is excited about the final path.']].map(([icon, title, desc]) => (
              <div key={title} className="vv-parent-card">
                <div style={{ fontSize: '40px' }}>{icon}</div>
                <h4>{title}</h4>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* FAQ */}
      <div className="vv-section">
        <h2 className="vv-sec-title">Frequently Asked Questions</h2>
        <div className="vv-faq" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <details open>
            <summary>When is the right time to take a career assessment?</summary>
            <div className="vv-faq-body">The ideal time is between Class 9 and Class 11. Testing in Class 9 or 10 helps you choose the correct stream (Science/Commerce/Arts). Testing in Class 11 or 12 helps you narrow down specific degrees and entrance exams.</div>
          </details>
          <details>
            <summary>How accurate are the psychometric tests?</summary>
            <div className="vv-faq-body">Our system is based on the globally recognized Holland Code (RIASEC) theory, combined with modern cognitive pattern analysis. It boasts a 92%+ accuracy rate in identifying natural aptitudes.</div>
          </details>
          <details>
            <summary>Can parents attend the expert counselling session?</summary>
            <div className="vv-faq-body">Absolutely. We strongly encourage at least one parent to be present during the final roadmap session to ensure family alignment and proper execution of the plan.</div>
          </details>
          <details>
            <summary>Is the Career Explorer free to use?</summary>
            <div className="vv-faq-body">Yes, completely. The Career Explorer — including the Stream Picker wizard and salary comparisons — is free for all students. The full AI psychometric assessment is also free. Premium features include 1-on-1 expert counsellor sessions.</div>
          </details>
        </div>
      </div>
 
      {/* FOOTER CTA */}
      <div className="vv-footer">
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '16px' }}>Still Confused About Your Career?</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', fontSize: '16px' }}>Stop guessing. Take the 25-Minute Assessment to reveal the exact path you were built to walk on.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="vv-start-btn" onClick={() => setScreen('form')}>Take Assessment Now →</button>
          <button style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', padding: '18px 48px', borderRadius: '50px', fontSize: '17px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={() => setScreen('explorer')}>🔎 Explore Careers First</button>
        </div>
        <p style={{ marginTop: '40px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>© 2026 VidyaVantage. A subsidiary of SecretSharz.</p>
      </div>
    </div>
  );
 
  // ── LOADING SCREEN ────────────────────────────────────────────────────────────
  if (screen === 'loading') return (
    <div className="vv-root">
      <Header badge="Analysing..." showNav={false} />
      <div className="vv-loading" ref={topRef}>
        <div className="vv-loading-spinner" />
        <h3>Building your career profile, {info.name.split(' ')[0]}…</h3>
        <p>Our AI is analysing your unique RIASEC personality and academic profile to find your perfect career match.</p>
        <div className="vv-loading-steps">
          {['Mapping RIASEC personality profile', 'Analysing academic strengths', 'Searching Indian career database', 'Generating personalised recommendations', 'Matching top colleges'].map((step, i) => (
            <div key={i} className={`loading-step ${loadingStep > i ? 'done' : loadingStep === i ? 'active' : ''}`}>
              <div className="step-dot" />{step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
 
  // ── RESULTS SCREEN ────────────────────────────────────────────────────────────
  if (screen === 'results' && results) {
    const { riasec, riasecSummary, bestCareer, recommendedCareer, leastCareer, nextSteps } = results;
    return (
      <div className="vv-root">
        <Header badge="Your Results" showNav={false} />
        <div className="vv-results" ref={topRef}>
          <div className="results-hero">
            {/* FIX: .results-name class was used but never defined — text was unstyled */}
            <div className="results-name">Career Report for {info.name} · {info.class}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', color: 'white', margin: '0 0 12px' }}>Your RIASEC Code: <em style={{ color: 'var(--gold)' }}>{riasec.code}</em></h2>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', maxWidth: '560px', margin: '0 auto 20px', lineHeight: 1.7 }}>{riasecSummary}</div>
            <div className="riasec-result-row">
              {riasec.sorted.slice(0, 3).map(([k, v]) => (
                <div key={k} className="riasec-chip" style={{ background: RIASEC_COLORS[k].bg, color: RIASEC_COLORS[k].color }}>{RIASEC_COLORS[k].label} ({v}/10)</div>
              ))}
            </div>
          </div>
 
          {[
            { data: bestCareer, cls: 'best', badge: '🏆 Best Match Career Path', barColor: 'var(--success)' },
            { data: recommendedCareer, cls: 'recommended', badge: '✅ Recommended Career Path', barColor: 'var(--gold)' },
            { data: leastCareer, cls: 'least', badge: '⚠️ Least Recommended Path', barColor: 'var(--danger)' },
          ].filter(c => c.data).map(({ data, cls, badge, barColor }) => (
            <div key={cls} className={`career-card ${cls}`}>
              <div className="career-badge">{badge}</div>
              {/* FIX: .career-title and .career-subtitle both used below; subtitle was undefined */}
              <div className="career-title">{data.title}</div>
              <div className="career-subtitle">{data.subtitle}</div>
              {/* FIX: .match-bar-wrap, .match-bar-label, .match-bar-text, .match-pct were all undefined */}
              <div className="match-bar-wrap">
                <div className="match-bar-label">
                  <span className="match-bar-text">Profile Match</span>
                  <span className="match-pct">{data.matchPercent}%</span>
                </div>
                <div className="match-bar-bg">
                  <div className="match-bar-fill" style={{ width: `${data.matchPercent}%`, background: barColor }} />
                </div>
              </div>
              <div className="ai-analysis">{data.analysis}</div>
              {data.pros && data.cons && (
                // FIX: .pros ul and .cons ul now have list-style:none to prevent double bullets
                <div className="pros-cons">
                  <div className="pros"><h5>Strengths & Advantages</h5><ul>{data.pros.map((p, i) => <li key={i}>{p}</li>)}</ul></div>
                  <div className="cons"><h5>Challenges to Expect</h5><ul>{data.cons.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
                </div>
              )}
              {data.colleges && data.colleges.length > 0 && (
                // FIX: .colleges-section h5 and .college-tags wrapper were unstyled
                <div className="colleges-section">
                  <h5>Recommended Colleges in India</h5>
                  <div className="college-tags">{data.colleges.map((c, i) => <span key={i} className="college-tag">{c}</span>)}</div>
                </div>
              )}
            </div>
          ))}
 
          {/* FIX: .next-steps-grid, .next-step-num, .next-step-desc, .btn-restart all undefined */}
          <div className="next-steps">
            <h3>Your Next Steps</h3>
            <p>Based on your {riasec.code} profile, here's what {info.name.split(' ')[0]} should do next:</p>
            <div className="next-steps-grid">
              {(nextSteps || []).slice(0, 3).map((step, i) => (
                <div key={i} className="next-step-item">
                  <div className="next-step-num">0{i + 1}</div>
                  <div className="next-step-desc">{step}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-restart" onClick={() => { setScreen('hero'); setAnswers({}); setInfo({ name: '', class: '', city: '', aspiration: '' }); setCurrentSection(0); }}>Take the Assessment Again</button>
              <button className="btn-restart" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }} onClick={() => setScreen('explorer')}>🔎 Explore Career Paths</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
 
  // ── FORM SCREEN ───────────────────────────────────────────────────────────────
  return (
    <div className="vv-root">
      <Header badge={`Step ${currentSection + 1} of ${ALL_SECTIONS.length}`} showNav={false} />
      {currentSection > 0 && (
        <div className="vv-progress-wrap">
          <span className="vv-section-tag">{section.label}</span>
          <span className="vv-progress-label">{answeredQ}/{totalQ} answered</span>
          <div className="vv-progress-bar-bg"><div className="vv-progress-fill" style={{ width: `${progress}%` }} /></div>
          <span className="vv-progress-pct">{progress}%</span>
        </div>
      )}
      <div className="vv-form-card" ref={topRef}>
        {/* FIX: .error-box was used but never defined — error message had no styling */}
        {error && <div className="error-box">⚠️ {error}</div>}
 
        {section.id === 'info' ? (
          <div>
            <div className="vv-section-header">
              <h2>Tell us about yourself</h2>
              <p>This helps us personalise your career analysis for your stage of education and life in India.</p>
            </div>
            {/* FIX: .vv-two-col was used but never defined — inputs stacked in single column */}
            <div className="vv-two-col">
              <div className="vv-field"><label>Your Full Name</label><input value={info.name} onChange={e => setInfo({ ...info, name: e.target.value })} placeholder="e.g. Priya Sharma" /></div>
              <div className="vv-field"><label>Your Current Class / Level</label><select value={info.class} onChange={e => setInfo({ ...info, class: e.target.value })}><option value="">Select your class</option>{CLASS_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div className="vv-two-col">
              <div className="vv-field"><label>Your City / State</label><input value={info.city} onChange={e => setInfo({ ...info, city: e.target.value })} placeholder="e.g. Chennai, Tamil Nadu" /></div>
              <div className="vv-field"><label>Any career dream? (Optional)</label><input value={info.aspiration} onChange={e => setInfo({ ...info, aspiration: e.target.value })} placeholder="e.g. I want to be a doctor" /></div>
            </div>
          </div>
        ) : (
          <div>
            <div className="vv-section-header">
              <h2>{section.label}</h2>
              <p>
                {section.id === 'activities' && 'Rate how much you enjoy each activity on a scale of 1 (not at all) to 5 (absolutely love it).'}
                {section.id === 'academics' && 'Tell us about your academic preferences and how you learn best.'}
                {section.id === 'values' && 'What matters most to you in life and your future career?'}
                {section.id === 'scenarios' && 'Choose the option that most naturally resonates with how you would react.'}
              </p>
            </div>
            {section.questions.map((q, idx) => (
              <div key={q.id} className="q-card">
                <div className="q-number">Question {idx + 1}</div>
                <div className="q-text">{q.text}</div>
                {q.type === 'scale' ? (
                  <div>
                    <div className="q-scale-labels"><span className="q-scale-label">Not at all</span><span className="q-scale-label">Very much</span></div>
                    <div className="q-scale">{[1, 2, 3, 4, 5].map(v => <button key={v} className={`scale-btn ${answers[q.id] === v ? 'selected' : ''}`} onClick={() => setAnswers({ ...answers, [q.id]: v })}>{v}</button>)}</div>
                  </div>
                ) : (
                  <div className="choice-grid">{q.choices.map((c, i) => <button key={i} className={`choice-btn ${answers[q.id] === c ? 'selected' : ''}`} onClick={() => setAnswers({ ...answers, [q.id]: c })}>{c}</button>)}</div>
                )}
              </div>
            ))}
          </div>
        )}
 
        <div className="vv-nav">
          <button className="btn-back" onClick={() => setCurrentSection(Math.max(0, currentSection - 1))} style={{ visibility: isFirst ? 'hidden' : 'visible' }}>← Back</button>
          {isLast ? (
            <button className="btn-next" onClick={fetchAnalysis} disabled={!isSectionComplete(section.id)}>Analyse My Career Profile 🚀</button>
          ) : (
            <button className="btn-next" onClick={() => setCurrentSection(currentSection + 1)} disabled={!isSectionComplete(section.id)}>Continue →</button>
          )}
        </div>
      </div>
    </div>
  );
}
 
