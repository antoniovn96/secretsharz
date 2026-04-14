import React, { useState, useEffect, useRef } from 'react';
import { auth } from './firebase'; // ✅ Added Firebase auth import

const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');`;

const STYLES = `
  :root {
    --saffron:#E8650A;--gold:#F0A500;--teal:#0A5C63;--teal-light:#0E7F89;
    --cream:#FDF6EC;--parchment:#F5EDD8;--dark:#1C1208;--brown:#3D2205;
    --muted:#7A6248;--white:#FFFFFF;--success:#2D7D46;--warn:#B85C00;
    --danger:#8B1A1A;--shadow:0 8px 32px rgba(28,18,8,0.12);--radius:16px;
  }
  *{box-sizing:border-box;margin:0;padding:0;}
  .vv-root{font-family:'DM Sans',sans-serif;min-height:100vh;background:var(--cream);color:var(--dark);background-image:radial-gradient(ellipse at 10% 20%,rgba(232,101,10,0.06) 0%,transparent 50%),radial-gradient(ellipse at 90% 80%,rgba(10,92,99,0.06) 0%,transparent 50%);}

  .vv-header{background:var(--dark);padding:18px 40px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100;border-bottom:3px solid var(--saffron);}
  .vv-logo{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:var(--white);letter-spacing:-0.5px;}
  .vv-logo span{color:var(--gold);}
  .vv-badge{background:var(--saffron);color:white;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:600;}
  .vv-header-nav{display:flex;align-items:center;gap:12px;}
  .vv-nav-btn{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.8);padding:8px 18px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;}
  .vv-nav-btn:hover{background:rgba(240,165,0,0.2);border-color:var(--gold);color:var(--gold);}
  .vv-nav-btn.active{background:var(--saffron);border-color:var(--saffron);color:white;}

  .vv-progress-wrap{background:var(--dark);padding:14px 40px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;}
  .vv-section-pills{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;}
  .vv-section-pills::-webkit-scrollbar{display:none;}
  .vv-section-pill{padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.5px;white-space:nowrap;border:1px solid;transition:all .2s;}
  .vv-section-pill.done{background:rgba(45,125,70,.25);color:#4ABA78;border-color:rgba(45,125,70,.4);}
  .vv-section-pill.active{background:rgba(232,101,10,.25);color:var(--gold);border-color:rgba(232,101,10,.5);}
  .vv-section-pill.todo{background:rgba(255,255,255,.05);color:rgba(255,255,255,.3);border-color:rgba(255,255,255,.1);}
  .vv-progress-right{display:flex;align-items:center;gap:14px;margin-left:auto;flex-shrink:0;}
  .vv-progress-bar-bg{width:120px;height:5px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;}
  .vv-progress-fill{height:100%;background:linear-gradient(90deg,var(--saffron),var(--gold));border-radius:10px;transition:width 0.5s ease;}
  .vv-progress-pct{color:var(--gold);font-size:12px;font-weight:700;white-space:nowrap;}

  .vv-form-card{max-width:800px;margin:40px auto;padding:0 20px 60px;}
  .vv-section-header{text-align:center;margin-bottom:36px;}
  .vv-section-header h2{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;color:var(--dark);margin-bottom:8px;}
  .vv-section-header p{color:var(--muted);font-size:15px;line-height:1.6;max-width:580px;margin:0 auto;}
  .vv-section-badge{display:inline-block;background:rgba(232,101,10,.12);color:var(--saffron);padding:4px 14px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:14px;}

  .vv-field{margin-bottom:22px;}
  .vv-field label{display:block;font-size:14px;font-weight:600;color:var(--brown);margin-bottom:8px;}
  .vv-field input,.vv-field select,.vv-field textarea{width:100%;padding:14px 18px;border:2px solid rgba(61,34,5,0.15);border-radius:12px;font-size:15px;font-family:'DM Sans',sans-serif;background:white;color:var(--dark);transition:border-color 0.2s;outline:none;resize:vertical;}
  .vv-field input:focus,.vv-field select:focus,.vv-field textarea:focus{border-color:var(--saffron);}
  .vv-two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;}

  .q-card{background:white;border-radius:var(--radius);padding:24px 28px;margin-bottom:18px;border:2px solid transparent;box-shadow:0 2px 12px rgba(28,18,8,0.06);transition:border-color 0.2s;}
  .q-card.answered{border-color:rgba(45,125,70,.2);}
  .q-card:hover{border-color:rgba(232,101,10,0.2);}
  .q-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:6px;}
  .q-number{font-size:11px;font-weight:700;color:var(--saffron);letter-spacing:1.5px;text-transform:uppercase;}
  .q-check{width:18px;height:18px;border-radius:50%;background:rgba(45,125,70,.15);border:2px solid rgba(45,125,70,.35);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:10px;color:var(--success);transition:all .2s;}
  .q-card.answered .q-check{background:var(--success);border-color:var(--success);color:white;}
  .q-text{font-size:15px;font-weight:500;color:var(--dark);line-height:1.55;margin-bottom:18px;}

  .q-scale-wrap{display:flex;flex-direction:column;gap:8px;}
  .q-scale-labels{display:flex;justify-content:space-between;}
  .q-scale-label{font-size:11px;color:var(--muted);font-weight:600;}
  .q-scale{display:flex;gap:8px;}
  .scale-btn{flex:1;padding:12px 6px;border:2px solid rgba(61,34,5,0.12);border-radius:10px;background:white;font-size:15px;font-weight:700;color:var(--muted);cursor:pointer;transition:all 0.18s;font-family:'DM Sans',sans-serif;text-align:center;}
  .scale-btn:hover{border-color:var(--saffron);color:var(--saffron);}
  .scale-btn.selected{background:linear-gradient(135deg,var(--saffron),var(--gold));border-color:transparent;color:white;box-shadow:0 4px 12px rgba(232,101,10,0.3);transform:scale(1.06);}

  .choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .choice-grid.single-col{grid-template-columns:1fr;}
  .choice-btn{padding:13px 16px;border:2px solid rgba(61,34,5,0.12);border-radius:12px;background:white;font-size:14px;font-weight:500;color:var(--brown);cursor:pointer;transition:all 0.2s;font-family:'DM Sans',sans-serif;text-align:left;line-height:1.4;display:flex;align-items:flex-start;gap:9px;}
  .choice-btn .cb-icon{font-size:16px;flex-shrink:0;margin-top:1px;}
  .choice-btn:hover{border-color:var(--teal);background:rgba(10,92,99,0.04);color:var(--teal);}
  .choice-btn.selected{background:linear-gradient(135deg,var(--teal),var(--teal-light));border-color:transparent;color:white;box-shadow:0 4px 12px rgba(10,92,99,0.25);}

  .vv-nav{display:flex;justify-content:space-between;align-items:center;margin-top:36px;padding-top:24px;border-top:1px solid rgba(61,34,5,0.1);}
  .btn-back{padding:12px 28px;border:2px solid rgba(61,34,5,0.2);border-radius:50px;background:transparent;font-size:15px;font-weight:600;color:var(--brown);cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
  .btn-next{padding:14px 36px;border:none;border-radius:50px;background:linear-gradient(135deg,var(--saffron),var(--gold));font-size:15px;font-weight:600;color:white;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 6px 20px rgba(232,101,10,0.3);transition:all 0.25s;}
  .btn-next:hover{transform:translateY(-1px);}
  .btn-next:disabled{opacity:0.45;cursor:not-allowed;transform:none;}
  .section-progress-note{font-size:12px;color:var(--muted);font-weight:600;}

  .error-box{background:rgba(139,26,26,0.07);border:1px solid rgba(139,26,26,0.25);color:var(--danger);padding:16px 20px;border-radius:12px;margin-bottom:24px;font-weight:600;font-size:14px;line-height:1.5;}

  /* LOADING */
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

  /* RESULTS (PRIMARY REPORT) */
  .vv-results{max-width:800px;margin:0 auto;padding:40px 20px 80px;}
  .results-hero{text-align:center;padding:52px 32px 44px;background:linear-gradient(135deg,var(--dark) 0%,var(--brown) 100%);border-radius:24px;margin-bottom:32px;position:relative;overflow:hidden;}
  .results-hero::before{content:'';position:absolute;top:-60px;right:-60px;width:300px;height:300px;background:radial-gradient(circle,rgba(232,101,10,0.15),transparent 70%);pointer-events:none;}
  .results-name{font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:2px;text-transform:uppercase;font-weight:700;margin-bottom:10px;}
  .riasec-code-display{font-family:'Playfair Display',serif;font-size:56px;font-weight:700;color:var(--gold);letter-spacing:8px;margin:6px 0 16px;line-height:1;}
  .riasec-code-label{font-size:13px;color:rgba(255,255,255,0.5);margin-bottom:24px;letter-spacing:1px;}
  .riasec-result-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-bottom:24px;}
  .riasec-chip{padding:8px 18px;border-radius:30px;font-size:13px;font-weight:700;}
  .results-summary{color:rgba(255,255,255,0.72);font-size:15px;max-width:580px;margin:0 auto;line-height:1.75;font-family:'Cormorant Garamond',serif;font-size:18px;}

  .riasec-radar{background:white;border-radius:20px;padding:32px;margin-bottom:24px;box-shadow:var(--shadow);}
  .riasec-radar h4{font-family:'Playfair Display',serif;font-size:22px;color:var(--dark);margin-bottom:6px;}
  .riasec-radar p{font-size:14px;color:var(--muted);margin-bottom:24px;}
  .riasec-bars{display:flex;flex-direction:column;gap:12px;}
  .riasec-bar-row{display:flex;align-items:center;gap:16px;}
  .riasec-bar-label{width:110px;font-size:14px;font-weight:700;color:var(--brown);flex-shrink:0;}
  .riasec-bar-label span{font-size:11px;font-weight:500;color:var(--muted);display:block;margin-top:2px;}
  .riasec-bar-bg{flex:1;height:12px;background:rgba(61,34,5,0.07);border-radius:10px;overflow:hidden;}
  .riasec-bar-fill{height:100%;border-radius:10px;transition:width 1s ease;}
  .riasec-bar-score{width:32px;font-size:15px;font-weight:700;text-align:right;flex-shrink:0;}

  .unlock-dashboard-cta{background:linear-gradient(135deg,var(--dark),var(--brown));border-radius:24px;padding:48px 32px;text-align:center;color:white;margin-top:40px;box-shadow:var(--shadow);}
  .unlock-dashboard-cta h3{font-family:'Playfair Display',serif;font-size:28px;margin-bottom:12px;}
  .unlock-dashboard-cta p{color:rgba(255,255,255,0.7);font-size:16px;line-height:1.6;margin-bottom:28px;}
  .btn-unlock{background:linear-gradient(135deg,var(--saffron),var(--gold));border:none;color:white;padding:16px 40px;border-radius:50px;font-size:16px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 8px 24px rgba(232,101,10,0.35);transition:all 0.25s;}
  .btn-unlock:hover{transform:translateY(-2px);}

  @media(max-width:900px){
    .vv-two-col{grid-template-columns:1fr;}
    .choice-grid{grid-template-columns:1fr;}
    .vv-header{padding:14px 20px;}
    .vv-progress-wrap{padding:12px 20px;}
    .vv-progress-bar-bg{width:80px;}
    .riasec-code-display{font-size:42px;}
  }
`;

const RIASEC_COLORS = {
  R: { bg:'#FFF3E0', color:'#E65100', bar:'#E65100', label:'Realistic',     desc:'The Doer' },
  I: { bg:'#E3F2FD', color:'#1565C0', bar:'#1565C0', label:'Investigative', desc:'The Thinker' },
  A: { bg:'#F3E5F5', color:'#6A1B9A', bar:'#6A1B9A', label:'Artistic',      desc:'The Creator' },
  S: { bg:'#E8F5E9', color:'#2E7D32', bar:'#2E7D32', label:'Social',        desc:'The Helper' },
  E: { bg:'#FFF8E1', color:'#F57F17', bar:'#F57F17', label:'Enterprising',  desc:'The Persuader' },
  C: { bg:'#E0F2F1', color:'#00695C', bar:'#00695C', label:'Conventional',  desc:'The Organiser' },
};

const CLASS_LEVELS = [
  'Class 8','Class 9','Class 10',
  'Class 11 (Science)','Class 11 (Commerce)','Class 11 (Arts)',
  'Class 12 (Science)','Class 12 (Commerce)','Class 12 (Arts)',
  '1st Year UG','2nd Year UG','3rd Year UG','4th Year UG',
  'Postgraduate','Working Professional / Career Change',
];

const ACTIVITY_QUESTIONS = [
  { id:'a1',  riasec:'R', text:'How much do you enjoy building, fixing, or assembling physical things — tools, gadgets, furniture, engines?' },
  { id:'a2',  riasec:'R', text:'How much do you enjoy outdoor physical activities — sports, farming, working in nature, or operating machinery?' },
  { id:'a3',  riasec:'I', text:'How much do you enjoy solving complex logical puzzles or scientific problems for the sheer satisfaction of it?' },
  { id:'a4',  riasec:'I', text:'How much do you enjoy independently researching a topic that fascinates you — reading papers, forming your own theories?' },
  { id:'a5',  riasec:'A', text:'How much do you enjoy drawing, painting, writing fiction or poetry, or creating music?' },
  { id:'a6',  riasec:'A', text:'How much do you enjoy coming up with completely original ideas and expressing yourself in ways that feel uniquely yours?' },
  { id:'a7',  riasec:'S', text:'How much do you enjoy listening to others and helping them process their personal problems or emotional struggles?' },
  { id:'a8',  riasec:'S', text:'How much do you enjoy teaching, tutoring, or explaining difficult concepts to people until they genuinely understand?' },
  { id:'a9',  riasec:'E', text:'How much do you enjoy leading a group, organising people toward a goal, or taking initiative when nobody else does?' },
  { id:'a10', riasec:'E', text:'How much do you enjoy negotiating, pitching ideas, or convincing others to see things your way?' },
  { id:'a11', riasec:'C', text:'How much do you enjoy organising information, managing records, or creating systems that keep things accurate and orderly?' },
  { id:'a12', riasec:'C', text:'How much do you enjoy following well-defined procedures, verifying details, and making sure nothing falls through the cracks?' },
];

const SKILLS_QUESTIONS = [
  { id:'s1',  riasec:'R', text:'Working with mechanical, electrical, or technical systems — understanding how things physically work.' },
  { id:'s2',  riasec:'R', text:'Physical coordination, craftsmanship, athletics, or any task requiring manual precision.' },
  { id:'s3',  riasec:'I', text:'Mathematical or logical reasoning — spotting patterns in complex data or abstract problems.' },
  { id:'s4',  riasec:'I', text:'Scientific thinking — formulating hypotheses, evaluating evidence, and drawing conclusions systematically.' },
  { id:'s5',  riasec:'A', text:'Creative output — writing, visual art, music, design, photography, or performance.' },
  { id:'s6',  riasec:'A', text:'Generating ideas that others have not thought of — lateral thinking and imaginative leaps.' },
  { id:'s7',  riasec:'S', text:'Reading people\'s emotions and responding with genuine empathy and sensitivity.' },
  { id:'s8',  riasec:'S', text:'Explaining things clearly so that different kinds of people actually understand — teaching and coaching.' },
  { id:'s9',  riasec:'E', text:'Motivating and influencing others to take action toward a shared goal — natural leadership.' },
  { id:'s10', riasec:'E', text:'Managing strategy, resources, and competing priorities under pressure — organising people at scale.' },
  { id:'s11', riasec:'C', text:'Spotting errors and maintaining accuracy — detail-orientation and quality control.' },
  { id:'s12', riasec:'C', text:'Creating and maintaining efficient systems, schedules, and workflows that other people can follow.' },
];

const ACADEMIC_QUESTIONS = [
  {
    id:'b1', text:'Which subject area feels the most natural and genuinely enjoyable to you?',
    choices:[
      {icon:'⚗️', text:'Science & Mathematics', riasec:'I'},
      {icon:'📊', text:'Commerce & Economics',  riasec:'E'},
      {icon:'🎨', text:'Arts & Humanities',      riasec:'A'},
      {icon:'💻', text:'Computers & Technology', riasec:'I'},
      {icon:'🤸', text:'Physical Education & Sports', riasec:'R'},
      {icon:'📜', text:'Languages & Literature', riasec:'A'},
    ],
  },
  {
    id:'b2', text:'How do you learn best? Which environment produces your deepest understanding?',
    choices:[
      {icon:'🔧', text:'Hands-on doing — building, experimenting, touching', riasec:'R'},
      {icon:'📖', text:'Independent reading and self-directed research',       riasec:'I'},
      {icon:'🗣️', text:'Group discussions, debates, and collaborative work',  riasec:'S'},
      {icon:'🎭', text:'Creative projects, role-plays, and presentations',     riasec:'A'},
      {icon:'📋', text:'Structured notes, clear syllabi, and organised study', riasec:'C'},
      {icon:'🏆', text:'Competitive challenges, mock tests, and pitch events', riasec:'E'},
    ],
  },
  {
    id:'b3', text:'What type of work or assignment consistently earns you the best outcomes?',
    choices:[
      {icon:'📐', text:'Technical reports, calculations, or lab work',   riasec:'R'},
      {icon:'🔬', text:'Research essays with deep analysis and evidence', riasec:'I'},
      {icon:'🖌️', text:'Creative writing, visual art, or original projects', riasec:'A'},
      {icon:'📊', text:'Organised plans, spreadsheets, or financial analysis', riasec:'C'},
      {icon:'🎙️', text:'Group presentations, debates, or leadership roles',   riasec:'E'},
      {icon:'🤝', text:'Collaborative tasks where you support your teammates', riasec:'S'},
    ],
  },
  {
    id:'b4', text:'Which of these best describes your academic journey so far?',
    choices:[
      {icon:'📈', text:'Consistently strong across most subjects',         riasec:'C'},
      {icon:'🎯', text:'Outstanding in one or two subjects, average in others', riasec:'I'},
      {icon:'💡', text:'Ideas come easily, but execution and deadlines are hard', riasec:'A'},
      {icon:'🧩', text:'Strong when interested, disengaged when bored',    riasec:'E'},
      {icon:'🌱', text:'Late bloomer — improving more every semester',     riasec:'S'},
      {icon:'🏃', text:'Better at practical skills than written exams',    riasec:'R'},
    ],
  },
  {
    id:'b5', text:'If you could design one new class that your school or college does not yet offer, it would be:',
    choices:[
      {icon:'🤖', text:'Artificial Intelligence & Ethics',            riasec:'I'},
      {icon:'🌿', text:'Environmental Sustainability & Climate Action', riasec:'R'},
      {icon:'💰', text:'Personal Finance & Investment for Youth',   riasec:'E'},
      {icon:'🧠', text:'Psychology & Mental Health Studies',        riasec:'S'},
      {icon:'📱', text:'Digital Content Creation & Media',          riasec:'A'},
      {icon:'📦', text:'Logistics, Supply Chain & Business Systems',riasec:'C'},
    ],
  },
  {
    id:'b6', text:'When a school project allows you complete freedom, you most naturally produce:',
    choices:[
      {icon:'🛠️', text:'Something physical — a model, prototype, or demo',  riasec:'R'},
      {icon:'📑', text:'A detailed research report backed by real data',     riasec:'I'},
      {icon:'🎬', text:'A creative piece — video, story, design, or artwork',riasec:'A'},
      {icon:'📣', text:'A campaign, pitch, or initiative that rallies people',riasec:'E'},
      {icon:'🗂️', text:'A comprehensive plan, template, or organised system',riasec:'C'},
      {icon:'💬', text:'An interview series, guide, or community resource',  riasec:'S'},
    ],
  },
];

const VALUES_QUESTIONS = [
  {
    id:'c1', text:'What matters most to you in your future career — choose the one that feels truly non-negotiable:',
    choices:[
      {icon:'💸', text:'High salary and financial independence',       riasec:'E'},
      {icon:'🌍', text:'Making a meaningful positive impact on society',riasec:'S'},
      {icon:'🎨', text:'Creative freedom and self-expression',          riasec:'A'},
      {icon:'🔍', text:'Continuous intellectual challenge and learning',riasec:'I'},
      {icon:'🏆', text:'Status, recognition, and industry influence',   riasec:'E'},
      {icon:'⚖️', text:'Stability, security, and a clear career path', riasec:'C'},
    ],
  },
  {
    id:'c2', text:'Which work environment would make you feel most energised every morning?',
    choices:[
      {icon:'🌳', text:'Outdoors, field sites, or physical workspace',  riasec:'R'},
      {icon:'🔬', text:'Lab, research centre, or technical environment',riasec:'I'},
      {icon:'🖥️', text:'Creative studio, design space, or media set',   riasec:'A'},
      {icon:'👥', text:'Busy collaborative office with constant people-interaction', riasec:'S'},
      {icon:'📈', text:'Fast-paced corporate or startup environment',   riasec:'E'},
      {icon:'🗂️', text:'Structured workspace with clear systems and minimal chaos', riasec:'C'},
    ],
  },
  {
    id:'c3', text:'How do you feel about the balance between income and personal meaning?',
    choices:[
      {icon:'💎', text:'Income comes first — financial freedom enables everything else',  riasec:'E'},
      {icon:'❤️', text:'Meaning comes first — I will take less money for work I believe in', riasec:'S'},
      {icon:'🧮', text:'I want both — I will not sacrifice one completely for the other',  riasec:'C'},
      {icon:'🚀', text:'If I build something great, income will follow the passion',       riasec:'A'},
      {icon:'🏡', text:'Enough to live comfortably — I value time over money',             riasec:'R'},
    ],
  },
  {
    id:'c4', text:'Where would you ideally like to live and work within the next 10 years?',
    choices:[
      {icon:'🏘️', text:'My home city or state — roots matter most to me',   riasec:'C'},
      {icon:'🌆', text:'A major Indian metro — Mumbai, Delhi, Bengaluru',    riasec:'E'},
      {icon:'🌐', text:'Internationally, if the right opportunity comes',    riasec:'I'},
      {icon:'🏡', text:'Remotely from anywhere — location independence',     riasec:'A'},
      {icon:'✈️', text:'A mix — some travel, some base, always evolving',    riasec:'E'},
    ],
  },
  {
    id:'c5', text:'How comfortable are you with risk and uncertainty in your career?',
    choices:[
      {icon:'🎲', text:'Love big risks — high risk, high reward is my style',  riasec:'E'},
      {icon:'📐', text:'Calculated risks — I research before I leap',          riasec:'I'},
      {icon:'🛡️', text:'Prefer stability — I want a proven, reliable path',   riasec:'C'},
      {icon:'💚', text:'Risk is fine if the cause or purpose is meaningful enough', riasec:'S'},
      {icon:'🌊', text:'I go where inspiration leads, even if it is uncertain', riasec:'A'},
    ],
  },
  {
    id:'c6', text:'When thinking about work-life integration over a long career, which matters most to you?',
    choices:[
      {icon:'⏰', text:'Strict work hours — after 6pm is my time, always',   riasec:'C'},
      {icon:'🔥', text:'I will work insane hours now to build something great',riasec:'E'},
      {icon:'🧘', text:'Flexibility — I want to blend work and life fluidly', riasec:'A'},
      {icon:'👨‍👩‍👧', text:'Family and community time are sacred and non-negotiable', riasec:'S'},
      {icon:'🌿', text:'Sustainable pace — I want to do this for 40 years',   riasec:'R'},
    ],
  },
];

const PERSONALITY_QUESTIONS = [
  {
    id:'d1', text:'When you face a significant setback — a failed exam, a rejected project, a broken friendship — your first instinct is to:',
    choices:[
      {icon:'📊', text:'Analyse what went wrong methodically before reacting',  riasec:'I'},
      {icon:'💪', text:'Get back on track immediately — action over reflection', riasec:'R'},
      {icon:'📝', text:'Express it — write, create, or talk it through',        riasec:'A'},
      {icon:'🤝', text:'Talk to someone you trust and process it together',      riasec:'S'},
      {icon:'🎯', text:'Reframe it as a lesson and quickly build a new plan',    riasec:'E'},
      {icon:'📋', text:'Revisit your original plan and identify exactly where it broke', riasec:'C'},
    ],
  },
  {
    id:'d2', text:'In a team project, the role you naturally and most comfortably gravitate toward is:',
    choices:[
      {icon:'⚙️', text:'The person who physically builds or executes the work',  riasec:'R'},
      {icon:'🔭', text:'The researcher who digs deep and ensures the content is accurate', riasec:'I'},
      {icon:'🎨', text:'The creative director who shapes what it looks and feels like', riasec:'A'},
      {icon:'🌟', text:'The energiser who keeps morale high and rallies the group', riasec:'S'},
      {icon:'🗺️', text:'The leader who sets the vision and makes the key decisions', riasec:'E'},
      {icon:'📅', text:'The project manager who coordinates timeline, quality, and logistics', riasec:'C'},
    ],
  },
  {
    id:'d3', text:'Which best describes your social energy — how you recharge and engage with the world?',
    choices:[
      {icon:'🔇', text:'Deeply introverted — I think inward and recharge in solitude',  riasec:'I'},
      {icon:'📚', text:'Mostly introverted — small, deep conversations over big crowds', riasec:'A'},
      {icon:'🌊', text:'Ambivert — I adjust naturally depending on the situation',       riasec:'C'},
      {icon:'☀️', text:'Mostly extroverted — I think by talking and love collaboration', riasec:'S'},
      {icon:'🎉', text:'Deeply extroverted — energy from crowds, ideas from interaction',riasec:'E'},
    ],
  },
  {
    id:'d4', text:'How do you typically make important decisions?',
    choices:[
      {icon:'📈', text:'Data-first — I research, compare options, and decide logically', riasec:'I'},
      {icon:'🫀', text:'Gut-first — strong intuition that I mostly trust',               riasec:'A'},
      {icon:'🔮', text:'Vision-first — I ask "what is the best possible outcome?" and work back', riasec:'E'},
      {icon:'👥', text:'Consensus-first — I consult others before committing',            riasec:'S'},
      {icon:'📋', text:'Process-first — I follow a systematic checklist and trust the system', riasec:'C'},
    ],
  },
  {
    id:'d5', text:'Which emerging global shift in 2025-2026 excites you most and makes you think "I want to be part of this"?',
    choices:[
      {icon:'🤖', text:'AI, machine learning, and the automation of knowledge work', riasec:'I'},
      {icon:'🌍', text:'Climate solutions, renewable energy, and sustainable tech',  riasec:'R'},
      {icon:'🧬', text:'Biotech, genetic medicine, and longevity science',            riasec:'I'},
      {icon:'🎥', text:'Creator economy, digital content, and personalised media',   riasec:'A'},
      {icon:'🧠', text:'Mental health, emotional intelligence, and wellness tech',   riasec:'S'},
      {icon:'🏗️', text:'Infrastructure, smart cities, and physical world innovation',riasec:'R'},
    ],
  },
  {
    id:'d6', text:'What motivates you most deeply — the thing that pulls you out of bed on hard days?',
    choices:[
      {icon:'💡', text:'The satisfaction of solving something genuinely difficult',   riasec:'I'},
      {icon:'🛠️', text:'Creating something tangible that did not exist before',       riasec:'R'},
      {icon:'🌟', text:'The recognition and influence that comes from succeeding',    riasec:'E'},
      {icon:'🎨', text:'The freedom to express exactly who you are through your work',riasec:'A'},
      {icon:'💙', text:'Knowing you made a real difference in someone\'s life',       riasec:'S'},
      {icon:'📊', text:'The clarity and progress that comes from a well-executed plan',riasec:'C'},
    ],
  },
];

const FUTURE_QUESTIONS = [
  {
    id:'e1', text:'If you imagine yourself at 35, fulfilled and doing meaningful work — which image resonates most?',
    choices:[
      {icon:'🏗️', text:'Running a company I built from scratch',                      riasec:'E'},
      {icon:'🔬', text:'Leading a research lab or publishing work that changes a field', riasec:'I'},
      {icon:'🎬', text:'Creating art, content, or design that reaches millions',     riasec:'A'},
      {icon:'🏥', text:'Healing, counselling, or educating people who need it',      riasec:'S'},
      {icon:'⚙️', text:'Engineering systems or infrastructure that people rely on', riasec:'R'},
      {icon:'🌐', text:'Managing a large organisation or department with precision',riasec:'C'},
    ],
  },
  {
    id:'e2', text:'Which of these industries do you feel most drawn to right now — even if it is just a feeling?',
    choices:[
      {icon:'💻', text:'Technology, AI, and software development',         riasec:'I'},
      {icon:'🏥', text:'Healthcare, medicine, and mental wellness',        riasec:'S'},
      {icon:'🌿', text:'Environment, climate tech, and green energy',      riasec:'R'},
      {icon:'📺', text:'Media, entertainment, and creative industries',    riasec:'A'},
      {icon:'💼', text:'Business, finance, law, and entrepreneurship',     riasec:'E'},
      {icon:'🎓', text:'Education, research, and public institutions',     riasec:'S'},
    ],
  },
  {
    id:'e3', text:'If AI handles 60% of routine analytical and administrative tasks in 10 years — where would you want to invest your uniquely human energy?',
    choices:[
      {icon:'🤝', text:'Emotional intelligence, empathy, and human connection', riasec:'S'},
      {icon:'🎨', text:'Original creative thinking, storytelling, and aesthetics', riasec:'A'},
      {icon:'🔭', text:'Complex research and frontier scientific discovery',    riasec:'I'},
      {icon:'🏛️', text:'Ethical leadership, governance, and policy design',     riasec:'E'},
      {icon:'🛠️', text:'Physical skills, craftsmanship, and real-world engineering', riasec:'R'},
      {icon:'🧭', text:'Systems design, coordination, and making complex things work at scale', riasec:'C'},
    ],
  },
  {
    id:'e4', text:'What kind of career model feels most aligned with how you want to live and work?',
    choices:[
      {icon:'🏢', text:'Traditional employment — growth within a stable organisation', riasec:'C'},
      {icon:'🚀', text:'Startup — building something fast, scrappy, and disruptive',  riasec:'E'},
      {icon:'🎓', text:'Academia or research — long-form thinking with deep expertise',riasec:'I'},
      {icon:'🌍', text:'NGO / Social enterprise — mission-driven impact at scale',    riasec:'S'},
      {icon:'🖥️', text:'Freelance or creator — independent work, personal brand',    riasec:'A'},
      {icon:'👷', text:'Skilled trade or technical specialist — expertise in a craft', riasec:'R'},
    ],
  },
  {
    id:'e5', text:'What kind of legacy do you most want to leave in your lifetime?',
    choices:[
      {icon:'💡', text:'An invention, discovery, or idea that changes how the world works', riasec:'I'},
      {icon:'🌿', text:'A healthier, safer, or more sustainable planet',                    riasec:'R'},
      {icon:'🖼️', text:'Art, writing, or creative work that outlives you',                 riasec:'A'},
      {icon:'❤️', text:'Thousands of lives improved through direct care or service',       riasec:'S'},
      {icon:'🏆', text:'An organisation or movement that creates opportunity for others',  riasec:'E'},
      {icon:'⚙️', text:'Systems and structures that run reliably long after you are gone', riasec:'C'},
    ],
  },
  {
    id:'e6', text:'Which of these real-world skills would you most like to master in the next 2 years?',
    choices:[
      {icon:'🤖', text:'AI tools, data analysis, and prompt engineering',        riasec:'I'},
      {icon:'📸', text:'Video creation, editing, design, or storytelling',       riasec:'A'},
      {icon:'💰', text:'Sales, negotiation, or fundraising — people persuasion', riasec:'E'},
      {icon:'🧘', text:'Counselling, coaching, or active listening skills',      riasec:'S'},
      {icon:'🔩', text:'Technical trade skills — coding, welding, electronics',  riasec:'R'},
      {icon:'📋', text:'Project management, finance, or organisational systems', riasec:'C'},
    ],
  },
];

const ALL_SECTIONS = [
  { id:'info',        label:'Profile',        emoji:'👤', questions:[] },
  { id:'activities',  label:'Interests',        emoji:'🎯', questions:ACTIVITY_QUESTIONS },
  { id:'skills',      label:'Abilities',        emoji:'⚡', questions:SKILLS_QUESTIONS },
  { id:'academics',   label:'Academics',        emoji:'📚', questions:ACADEMIC_QUESTIONS },
  { id:'values',      label:'Values',           emoji:'🧭', questions:VALUES_QUESTIONS },
  { id:'personality', label:'Personality',      emoji:'🧠', questions:PERSONALITY_QUESTIONS },
  { id:'future',      label:'Future Vision',    emoji:'🚀', questions:FUTURE_QUESTIONS },
];

function computeRIASEC(answers) {
  const interest = { R:0, I:0, A:0, S:0, E:0, C:0 };
  const ability  = { R:0, I:0, A:0, S:0, E:0, C:0 };

  ACTIVITY_QUESTIONS.forEach(q => {
    if (answers[q.id]) interest[q.riasec] += answers[q.id];
  });
  SKILLS_QUESTIONS.forEach(q => {
    if (answers[q.id]) ability[q.riasec] += answers[q.id] * 0.85;
  });

  const combined = { R:0, I:0, A:0, S:0, E:0, C:0 };
  Object.keys(combined).forEach(k => {
    combined[k] = (interest[k] || 0) + (ability[k] || 0);
  });

  const choiceGroups = [ACADEMIC_QUESTIONS, VALUES_QUESTIONS, PERSONALITY_QUESTIONS, FUTURE_QUESTIONS];
  choiceGroups.forEach(group => {
    group.forEach(q => {
      if (answers[q.id] !== undefined) {
        const chosen = q.choices.find(c => c.text === answers[q.id]);
        if (chosen?.riasec) combined[chosen.riasec] += 2.5;
      }
    });
  });

  const max = Math.max(...Object.values(combined));
  const scores = {};
  Object.keys(combined).forEach(k => {
    scores[k] = max > 0 ? Math.round((combined[k] / max) * 10) : 0;
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const code   = sorted.slice(0, 3).map(x => x[0]).join('');

  return { scores, interest, ability, sorted, code };
}

export default function CareerAssessment({ onBack, onExplore, savedResults, onSaveResults }) {
  const [screen,          setScreen]         = useState(savedResults ? 'results' : 'form');
  const [currentSection,  setCurrentSection] = useState(0);
  const [info,            setInfo]           = useState({ name:'', class:'', city:'', aspiration:'', boards:'' });
  const [answers,         setAnswers]        = useState({});
  const [results,         setResults]        = useState(savedResults || null);
  const [loadingStep,     setLoadingStep]    = useState(0);
  const [error,           setError]          = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = GOOGLE_FONTS + STYLES;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [screen, currentSection]);

  // ✅ Auto-fill name if user is logged in
  useEffect(() => {
    if (auth?.currentUser?.displayName) {
      setInfo(prev => ({ ...prev, name: auth.currentUser.displayName }));
    }
  }, []);

  const isSectionComplete = (idx) => {
    const sec = ALL_SECTIONS[idx];
    if (sec.id === 'info') return info.name.trim() && info.class;
    return sec.questions.every(q => answers[q.id] !== undefined);
  };

  const totalQ    = ALL_SECTIONS.slice(1).reduce((s, sec) => s + sec.questions.length, 0);
  const answeredQ = Object.keys(answers).length;
  const progress  = Math.round((answeredQ / totalQ) * 100);

  const buildPersonalityProfile = () => {
    const get = id => answers[id] || 'not answered';
    return {
      setbackResponse:     get('d1'),
      teamRole:            get('d2'),
      socialEnergy:        get('d3'),
      decisionStyle:       get('d4'),
      trendInterest:       get('d5'),
      coreMotivation:      get('d6'),
      academicPattern:     get('b4'),
      incomeVsMeaning:     get('c3'),
      workLifeBalance:     get('c6'),
      riskTolerance:       get('c5'),
      futureWorkModel:     get('e4'),
      aiEraFocus:          get('e3'),
      legacyGoal:          get('e5'),
      skillBuildGoal:      get('e6'),
    };
  };

  const fetchAnalysis = async () => {
    const sectionBeforeSubmit = currentSection;
    setScreen('loading');
    setLoadingStep(0);
    setError(null);

    const riasec      = computeRIASEC(answers);
    const personality = buildPersonalityProfile();

    const steps = [
      'Mapping RIASEC interest profile',
      'Analysing skills and abilities',
      'Processing personality indicators',
      'Researching 2025–26 career trends',
      'Matching Indian college landscape',
      'Generating personalised recommendations',
    ];
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setLoadingStep(i + 1);
    }

    const prompt = `You are VidyaVantage, an expert AI career counsellor specialising in Indian education (2025–2026), using Holland's RIASEC theory.

STUDENT PROFILE:
- Name: ${info.name.replace(/"/g, '\\"')}
- Class/Level: ${info.class.replace(/"/g, '\\"')}
- City: ${info.city.replace(/"/g, '\\"')}
- Career aspiration (if any): ${(info.aspiration || 'Not specified').replace(/"/g, '\\"')}
- Boards: ${(info.boards || 'Not specified').replace(/"/g, '\\"')}

RIASEC SCORES (0–10, from dual interest + ability assessment):
R (Realistic/Doer)=${riasec.scores.R}, I (Investigative/Thinker)=${riasec.scores.I}, A (Artistic/Creator)=${riasec.scores.A}, S (Social/Helper)=${riasec.scores.S}, E (Enterprising/Persuader)=${riasec.scores.E}, C (Conventional/Organiser)=${riasec.scores.C}
3-Letter Code: ${riasec.code}

PERSONALITY INDICATORS:
- Setback response: ${(personality.setbackResponse || '').replace(/"/g, '\\"')}
- Natural team role: ${(personality.teamRole || '').replace(/"/g, '\\"')}
- Social energy: ${(personality.socialEnergy || '').replace(/"/g, '\\"')}
- Decision-making style: ${(personality.decisionStyle || '').replace(/"/g, '\\"')}
- Core motivation: ${(personality.coreMotivation || '').replace(/"/g, '\\"')}
- Academic pattern: ${(personality.academicPattern || '').replace(/"/g, '\\"')}
- Income vs meaning: ${(personality.incomeVsMeaning || '').replace(/"/g, '\\"')}
- Risk tolerance: ${(personality.riskTolerance || '').replace(/"/g, '\\"')}
- Work-life balance: ${(personality.workLifeBalance || '').replace(/"/g, '\\"')}

FUTURE VISION:
- Emerging trend that excites them: ${(personality.trendInterest || '').replace(/"/g, '\\"')}
- Career model preference: ${(personality.futureWorkModel || '').replace(/"/g, '\\"')}
- AI-era focus: ${(personality.aiEraFocus || '').replace(/"/g, '\\"')}
- Legacy goal: ${(personality.legacyGoal || '').replace(/"/g, '\\"')}
- Skill they want to build: ${(personality.skillBuildGoal || '').replace(/"/g, '\\"')}

INSTRUCTIONS: Apply Holland's RIASEC 5-step methodology. Respond ONLY with valid JSON (no markdown, no backticks). Ensure all internal strings are properly escaped to prevent JSON parse errors. Structure:

{
  "riasecSummary": "3 sentences describing this student's unique RIASEC personality in warm, specific, encouraging language.",
  "codeBreakdown": {
    "primary": "1 sentence about the dominant letter and what it means for this student specifically",
    "secondary": "1 sentence about the second letter and how it adds nuance",
    "tertiary": "1 sentence about the third letter and how all three together create a unique profile"
  },
  "personalityInsights": {
    "workStyle": "How this student naturally works — specific, based on their answers",
    "strengthZone": "Where they are most likely to excel and why",
    "growthEdge": "The one area that will require the most intentional development",
    "leadershipStyle": "How they lead or influence others"
  },
  "bestCareer": {
    "title": "Career Path Name",
    "subtitle": "3-4 specific roles within this path",
    "matchPercent": 92,
    "analysis": "4 sentences: why this is the best match using their RIASEC code, personality, AND their stated preferences. Be specific.",
    "pros": ["Pro 1 — specific to this student", "Pro 2", "Pro 3"],
    "cons": ["Real challenge 1", "Real challenge 2"],
    "colleges": ["Top Indian college 1", "Top Indian college 2", "Top Indian college 3"],
    "skillsToBuild": ["Specific skill 1", "Specific skill 2"],
    "entryPath": "The most realistic step-by-step entry path for an Indian student at their level"
  },
  "recommendedCareer": {
    "title": "Career Path Name — a solid secondary match",
    "subtitle": "Specific roles",
    "matchPercent": 76,
    "analysis": "3-4 sentences on why this is a strong secondary match",
    "pros": ["Pro 1", "Pro 2"],
    "cons": ["Challenge 1", "Challenge 2"],
    "colleges": ["College 1", "College 2"],
    "skillsToBuild": ["Skill 1", "Skill 2"],
    "entryPath": "Step-by-step entry for this student"
  },
  "leastCareer": {
    "title": "Career Path Name",
    "subtitle": "Why the RIASEC mismatch is significant",
    "matchPercent": 21,
    "analysis": "2-3 sentences — gentle, honest, non-discouraging. Focus on RIASEC mismatch, not failure.",
    "pros": ["One genuine redeeming overlap if any"],
    "cons": ["Key mismatch 1", "Key mismatch 2"],
    "colleges": []
  },
  "nextSteps": [
    "Specific step 1 for this student — actionable within 1 week",
    "Specific step 2 — achievable within 1 month",
    "Specific step 3 — 3-6 month goal"
  ]
}`;

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch('/api/chat', {
        method : 'POST',
        headers: { 'Content-Type':'application/json' },
        body   : JSON.stringify({ messages:[{ role:'user', content:prompt }] }),
        signal : controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || `Server error ${res.status}`);

      const text   = data.content?.map(b => b.text || '').join('') || '';
      let clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      const parsed = JSON.parse(clean);

      const finalResults = { ...parsed, riasec, studentInfo:info, personalityProfile:personality };
      setResults(finalResults);
      setScreen('results');
    } catch (err) {
      clearTimeout(timeoutId);
      setError(err.name === 'AbortError'
        ? 'The analysis timed out. Please check your connection and try again.'
        : `Could not generate your analysis: ${err.message}`);
      setScreen('form');
      setCurrentSection(sectionBeforeSubmit);
    }
  };

  const Header = ({ badge, showNav=true }) => (
    <header className="vv-header">
      <div className="vv-logo" onClick={onBack} style={{ cursor:'pointer' }}>Vidya<span>Vantage</span></div>
      {showNav ? (
        <div className="vv-header-nav">
          {onExplore && <button className="vv-nav-btn" onClick={onExplore}>🔎 Explore Careers</button>}
          <button className="vv-nav-btn active">📝 Assessment</button>
          {badge && <div className="vv-badge">{badge}</div>}
        </div>
      ) : badge ? (
        <div className="vv-badge">{badge}</div>
      ) : null}
    </header>
  );

  const setAnswer = (id, val) => setAnswers(prev => ({ ...prev, [id]:val }));

  if (screen === 'loading') {
    const loadingLabels = [
      'Mapping RIASEC interest profile',
      'Analysing your skills and abilities',
      'Processing personality indicators',
      'Researching 2025–26 career trends',
      'Matching Indian college landscape',
      'Generating personalised recommendations',
    ];
    return (
      <div className="vv-root">
        <Header badge="Analysing…" showNav={false} />
        <div className="vv-loading" ref={topRef}>
          <div className="vv-loading-spinner" />
          <h3>Building your career profile, {info.name.split(' ')[0]}…</h3>
          <p style={{ color:'var(--muted)', fontSize:'15px', marginTop:'8px', lineHeight:1.6 }}>
            Our AI is cross-referencing your RIASEC personality with 2025–26 Indian career trends across {totalQ} data points from your assessment.
          </p>
          <div className="vv-loading-steps">
            {loadingLabels.map((step, i) => (
              <div key={i} className={`loading-step ${loadingStep > i ? 'done' : loadingStep === i ? 'active' : ''}`}>
                <div className="step-dot" />{step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'results' && results) {
    const { riasec, riasecSummary, codeBreakdown, studentInfo } = results;

    return (
      <div className="vv-root">
        <Header badge="Primary Report" showNav={false} />
        <div className="vv-results" ref={topRef}>

          <div className="results-hero">
            <div className="results-name">Primary Report for {studentInfo?.name} · {studentInfo?.class}</div>
            <div className="riasec-code-display">{riasec.code}</div>
            <div className="riasec-code-label">YOUR RIASEC CODE</div>
            <div className="riasec-result-row">
              {riasec.sorted.slice(0, 3).map(([k, v]) => (
                <div key={k} className="riasec-chip" style={{ background:RIASEC_COLORS[k].bg, color:RIASEC_COLORS[k].color }}>
                  {RIASEC_COLORS[k].label} — {RIASEC_COLORS[k].desc} ({v}/10)
                </div>
              ))}
            </div>
            <div className="results-summary">{riasecSummary}</div>
          </div>

          <div className="riasec-radar">
            <h4>Your Full RIASEC Profile</h4>
            <p>Dual-scored from both your interest levels and self-assessed abilities across {totalQ} questions.</p>
            <div className="riasec-bars">
              {riasec.sorted.map(([k, v]) => (
                <div key={k} className="riasec-bar-row">
                  <div className="riasec-bar-label">
                    {RIASEC_COLORS[k].label}
                    <span>{RIASEC_COLORS[k].desc}</span>
                  </div>
                  <div className="riasec-bar-bg">
                    <div className="riasec-bar-fill" style={{ width:`${v * 10}%`, background:RIASEC_COLORS[k].bar }} />
                  </div>
                  <div className="riasec-bar-score" style={{ color:RIASEC_COLORS[k].color }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {codeBreakdown && (
            <div className="riasec-radar" style={{ marginBottom:'24px' }}>
              <h4>Understanding Your {riasec.code} Code</h4>
              <p>What each letter in your code means for your career direction.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {[
                  { label:`Primary — ${RIASEC_COLORS[riasec.code[0]]?.label}`, text:codeBreakdown.primary, color:RIASEC_COLORS[riasec.code[0]]?.color },
                  { label:`Secondary — ${RIASEC_COLORS[riasec.code[1]]?.label}`, text:codeBreakdown.secondary, color:RIASEC_COLORS[riasec.code[1]]?.color },
                  { label:`Tertiary — ${RIASEC_COLORS[riasec.code[2]]?.label}`, text:codeBreakdown.tertiary, color:RIASEC_COLORS[riasec.code[2]]?.color },
                ].map((item, i) => (
                  <div key={i} style={{ background:'var(--parchment)', borderRadius:'12px', padding:'14px 18px', borderLeft:`3px solid ${item.color}` }}>
                    <div style={{ fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'1px', color:item.color, marginBottom:'5px' }}>{item.label}</div>
                    <p style={{ margin:0, fontSize:'14px', color:'var(--brown)', lineHeight:1.6 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="unlock-dashboard-cta">
            <h3>Your Blueprint is Ready</h3>
            <p>We've mapped your personality to the Indian career landscape. Discover your top career matches, skills gaps, recommended colleges, and your personalised execution plan.</p>
            <button 
              className="btn-unlock" 
              onClick={() => {
                if (onSaveResults) {
                  onSaveResults(results);
                }
              }}
            >
              Unlock My Comprehensive Dashboard →
            </button>
          </div>

        </div>
      </div>
    );
  }

  const section     = ALL_SECTIONS[currentSection];
  const isLast      = currentSection === ALL_SECTIONS.length - 1;
  const isFirst     = currentSection === 0;
  const sectionDone = isSectionComplete(currentSection);

  const sectionMeta = {
    info:        { badge:'Your Profile',                    desc:'Tell us about yourself so we can personalise everything.' },
    activities:  { badge:'Interest Assessment — 12 Questions', desc:'Rate how much you genuinely enjoy each activity on a scale of 1 (not at all) to 5 (absolutely love it). Be honest — there are no right answers.' },
    skills:      { badge:'Abilities Assessment — 12 Questions', desc:'Rate how naturally skilled you consider yourself at each area. 1 = not naturally strong here, 5 = this comes very easily to me.' },
    academics:   { badge:'Academic Profile — 6 Questions',  desc:'Tell us about your academic strengths and how you learn best.' },
    values:      { badge:'Values & Work Life — 6 Questions',desc:'What matters most to you in a career and life? Choose the option that feels truly honest.' },
    personality: { badge:'Personality Profile — 6 Questions', desc:'How do you actually think, feel, and behave under pressure? This helps us understand your working style.' },
    future:      { badge:'Future Vision — 6 Questions',     desc:'Where are you heading? These questions connect your RIASEC profile to 2025–26 career trends.' },
  };

  const sm = sectionMeta[section.id];

  return (
    <div className="vv-root">
      <Header badge={`${currentSection + 1} of ${ALL_SECTIONS.length}`} showNav={false} />

      {currentSection > 0 && (
        <div className="vv-progress-wrap">
          <div className="vv-section-pills">
            {ALL_SECTIONS.slice(1).map((s, i) => {
              const realIdx = i + 1;
              const st = realIdx < currentSection ? 'done' : realIdx === currentSection ? 'active' : 'todo';
              return (
                <div key={s.id} className={`vv-section-pill ${st}`}>
                  {st === 'done' ? '✓' : s.emoji} {s.label}
                </div>
              );
            })}
          </div>
          <div className="vv-progress-right">
            <div className="vv-progress-bar-bg">
              <div className="vv-progress-fill" style={{ width:`${progress}%` }} />
            </div>
            <span className="vv-progress-pct">{progress}%</span>
          </div>
        </div>
      )}

      <div className="vv-form-card" ref={topRef}>
        {error && <div className="error-box">⚠️ {error}</div>}

        <div className="vv-section-header">
          <div className="vv-section-badge">{sm.badge}</div>
          <h2>{section.label}</h2>
          <p>{sm.desc}</p>
        </div>

        {section.id === 'info' && (
          <div>
            <div className="vv-two-col">
              {auth?.currentUser?.displayName ? (
                <div className="vv-field">
                  <label>Your Full Name *</label>
                  <div style={{ padding: '14px 18px', background: '#f8fafc', borderRadius: '12px', border: '2px solid rgba(45,125,70,0.2)', color: 'var(--dark)', fontWeight: 600, fontSize: '15px' }}>
                    {info.name} <span style={{color: 'var(--success)', float: 'right', fontSize: '12px'}}>✓ Auto-filled</span>
                  </div>
                </div>
              ) : (
                <div className="vv-field">
                  <label>Your Full Name *</label>
                  <input value={info.name} onChange={e => setInfo({...info, name:e.target.value})} placeholder="e.g. Arjun Sharma" />
                </div>
              )}
              <div className="vv-field">
                <label>Current Class / Level *</label>
                <select value={info.class} onChange={e => setInfo({...info, class:e.target.value})}>
                  <option value="">Select your level</option>
                  {CLASS_LEVELS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="vv-two-col">
              <div className="vv-field">
                <label>Your City &amp; State</label>
                <input value={info.city} onChange={e => setInfo({...info, city:e.target.value})} placeholder="e.g. Pune, Maharashtra" />
              </div>
              <div className="vv-field">
                <label>Board / University</label>
                <input value={info.boards} onChange={e => setInfo({...info, boards:e.target.value})} placeholder="e.g. CBSE, Maharashtra Board" />
              </div>
            </div>
            <div className="vv-field">
              <label>Any career dream you already have? (Optional)</label>
              <input value={info.aspiration} onChange={e => setInfo({...info, aspiration:e.target.value})} placeholder="e.g. I want to work in AI, or I'm considering medicine" />
            </div>
          </div>
        )}

        {(section.id === 'activities' || section.id === 'skills') && section.questions.map((q, idx) => (
          <div key={q.id} className={`q-card ${answers[q.id] !== undefined ? 'answered' : ''}`}>
            <div className="q-card-top">
              <div className="q-number">Question {idx + 1} of {section.questions.length}</div>
              <div className="q-check">{answers[q.id] !== undefined ? '✓' : ''}</div>
            </div>
            <div className="q-text">{q.text}</div>
            <div className="q-scale-wrap">
              <div className="q-scale-labels">
                <span className="q-scale-label">{section.id === 'activities' ? 'Not at all' : 'Not naturally skilled'}</span>
                <span className="q-scale-label">{section.id === 'activities' ? 'Absolutely love it' : 'Comes very naturally'}</span>
              </div>
              <div className="q-scale">
                {[1, 2, 3, 4, 5].map(v => (
                  <button key={v} className={`scale-btn ${answers[q.id] === v ? 'selected' : ''}`} onClick={() => setAnswer(q.id, v)}>{v}</button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {['academics','values','personality','future'].includes(section.id) && section.questions.map((q, idx) => (
          <div key={q.id} className={`q-card ${answers[q.id] !== undefined ? 'answered' : ''}`}>
            <div className="q-card-top">
              <div className="q-number">Question {idx + 1} of {section.questions.length}</div>
              <div className="q-check">{answers[q.id] !== undefined ? '✓' : ''}</div>
            </div>
            <div className="q-text">{q.text}</div>
            <div className={`choice-grid ${q.choices.length <= 4 ? 'single-col' : ''}`}>
              {q.choices.map((c, i) => (
                <button
                  key={i}
                  className={`choice-btn ${answers[q.id] === c.text ? 'selected' : ''}`}
                  onClick={() => setAnswer(q.id, c.text)}
                >
                  <span className="cb-icon">{c.icon}</span>
                  <span>{c.text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="vv-nav">
          <button className="btn-back" onClick={() => setCurrentSection(Math.max(0, currentSection - 1))} style={{ visibility:isFirst ? 'hidden' : 'visible' }}>
            ← Back
          </button>
          {currentSection > 0 && (
            <span className="section-progress-note">
              {section.questions.filter(q => answers[q.id] !== undefined).length} / {section.questions.length} answered
            </span>
          )}
          {isLast ? (
            <button className="btn-next" onClick={fetchAnalysis} disabled={!sectionDone}>
              Analyse My Career Profile 🚀
            </button>
          ) : (
            <button className="btn-next" onClick={() => setCurrentSection(currentSection + 1)} disabled={!sectionDone}>
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
