import React from 'react';
import { useState, useEffect, useRef } from 'react';

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
  
  /* --- NEW LANDING PAGE STYLES --- */
  .vv-hero-new { display: flex; gap: 40px; align-items: center; padding: 80px 40px; max-width: 1200px; margin: 0 auto; flex-wrap: wrap; }
  .vv-hero-content { flex: 1.2; min-width: 320px; }
  .vv-hero-eyebrow { display: inline-block; background: linear-gradient(135deg, rgba(232,101,10,0.12), rgba(240,165,0,0.12)); border: 1px solid rgba(232,101,10,0.3); color: var(--saffron); padding: 6px 18px; border-radius: 30px; font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
  .feature-tags { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px; }
  .f-tag { background: white; border: 1px solid rgba(61,34,5,0.1); padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 700; color: var(--brown); box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
  
  .vv-hero-cta { flex: 0.8; background: white; padding: 40px; border-radius: 24px; box-shadow: var(--shadow); border: 1px solid rgba(61,34,5,0.1); text-align: center; min-width: 320px; }
  .vv-start-btn { background: linear-gradient(135deg, var(--saffron), var(--gold)); color: white; border: none; padding: 18px 48px; border-radius: 50px; font-size: 17px; font-weight: 600; cursor: pointer; box-shadow: 0 8px 24px rgba(232,101,10,0.35); transition: all 0.25s ease; font-family: 'DM Sans', sans-serif; }
  .vv-start-btn:hover { transform: translateY(-2px); }

  .vv-trust-strip { background: white; padding: 40px 20px; border-bottom: 1px solid rgba(61,34,5,0.1); border-top: 1px solid rgba(61,34,5,0.1); }
  .vv-trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; max-width: 1200px; margin: 0 auto; text-align: center; }
  .vv-trust-item h3 { font-size: 42px; font-family: 'Playfair Display', serif; color: var(--saffron); margin: 0 0 4px 0; line-height: 1; }
  .vv-trust-item p { font-size: 13px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin: 0;}

  .vv-section { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
  .vv-section-alt { background: var(--parchment); padding: 80px 40px; }
  .vv-section-inner { max-width: 1200px; margin: 0 auto; }
  .vv-sec-title { font-family: 'Playfair Display', serif; font-size: 36px; color: var(--dark); text-align: center; margin-bottom: 16px; line-height: 1.2; }
  .vv-sec-sub { text-align: center; color: var(--muted); font-size: 16px; max-width: 600px; margin: 0 auto 40px; line-height: 1.6; }

  .vv-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .vv-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .vv-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }

  .vv-card { background: white; border: 1px solid rgba(61,34,5,0.1); padding: 32px 24px; border-radius: 20px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: transform 0.3s; }
  .vv-card:hover { transform: translateY(-5px); border-color: var(--saffron); box-shadow: var(--shadow); }
  .vv-card-icon { font-size: 40px; margin-bottom: 16px; }
  .vv-card h4 { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--dark); margin-bottom: 8px; }
  .vv-card p { font-size: 14px; color: var(--saffron); font-weight: 700; text-transform: uppercase; margin: 0;}

  .vv-problem-list { list-style: none; padding: 0; }
  .vv-problem-list li { background: white; padding: 16px 20px; border-radius: 12px; border: 1px solid rgba(61,34,5,0.1); margin-bottom: 16px; font-weight: 600; color: var(--dark); display: flex; gap: 12px; align-items: flex-start; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
  .vv-problem-list li::before { content: '✗'; color: var(--danger); font-size: 18px; font-weight: 900; }
  .vv-conclusion { background: linear-gradient(135deg, var(--dark), var(--brown)); color: white; padding: 40px; border-radius: 24px; font-size: 22px; font-family: 'Playfair Display', serif; text-align: center; line-height: 1.5; box-shadow: var(--shadow); }
  .vv-conclusion span { color: var(--gold); font-style: italic; }

  .vv-step-card { background: white; border: 1px solid rgba(61,34,5,0.1); padding: 32px 20px; border-radius: 20px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.02); position: relative; }
  .vv-step-num { width: 48px; height: 48px; background: var(--parchment); color: var(--saffron); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px; margin: 0 auto 16px; border: 2px solid var(--gold); }
  .vv-step-final { background: linear-gradient(135deg, rgba(232,101,10,0.05), rgba(240,165,0,0.05)); border-color: var(--saffron); }
  .vv-step-final .vv-step-num { background: var(--saffron); color: white; border-color: var(--saffron); }

  .vv-story-card { background: white; padding: 40px; border-radius: 24px; border: 1px solid rgba(61,34,5,0.1); box-shadow: var(--shadow); position: relative; overflow: hidden; }
  .vv-story-card::before { content: ''; position: absolute; left: 0; top: 0; width: 6px; height: 100%; background: linear-gradient(to bottom, var(--danger), var(--saffron), var(--success)); }
  .vv-badge-sm { display: inline-block; padding: 4px 12px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 8px; }

  .vv-founder { background: white; border-radius: 24px; padding: 40px; display: flex; gap: 40px; align-items: center; box-shadow: var(--shadow); border: 1px solid rgba(61,34,5,0.1); max-width: 1000px; margin: 0 auto; }
  .vv-founder-img { width: 160px; height: 160px; border-radius: 50%; background: var(--parchment); border: 4px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 64px; flex-shrink: 0; }
  
  .vv-parent-sec { background: var(--dark); color: white; padding: 80px 40px; }
  .vv-parent-sec .vv-sec-title { color: white; }
  .vv-parent-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 32px 24px; border-radius: 20px; text-align: center; }
  .vv-parent-card h4 { color: var(--gold); font-family: 'Playfair Display', serif; font-size: 20px; margin: 16px 0 8px; }

  .vv-faq details { background: white; border: 1px solid rgba(61,34,5,0.1); border-radius: 16px; margin-bottom: 12px; overflow: hidden; }
  .vv-faq summary { padding: 20px; font-weight: 700; font-size: 16px; cursor: pointer; list-style: none; display: flex; justify-content: space-between; color: var(--dark); outline: none; }
  .vv-faq summary::-webkit-details-marker { display: none; }
  .vv-faq summary::after { content: '+'; color: var(--saffron); font-size: 24px; transition: 0.3s; }
  .vv-faq details[open] summary::after { content: '×'; color: var(--danger); transform: rotate(90deg); }
  .vv-faq details[open] summary { border-bottom: 1px solid rgba(61,34,5,0.1); background: var(--parchment); }
  .vv-faq-body { padding: 20px; color: var(--muted); font-size: 15px; line-height: 1.6; }

  .vv-footer { background: var(--dark); color: white; padding: 80px 40px 40px; border-top: 4px solid var(--saffron); text-align: center; }

  /* --- ASSESSMENT FORM & RESULTS STYLES --- */
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
  .vv-results{max-width:900px;margin:0 auto;padding:40px 20px 80px;}
  .results-hero{text-align:center;padding:48px 20px 40px;background:linear-gradient(135deg,var(--dark) 0%,var(--brown) 100%);border-radius:24px;margin-bottom:32px;}
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
  .match-bar-bg{height:8px;background:rgba(61,34,5,0.08);border-radius:10px;overflow:hidden;}
  .match-bar-fill{height:100%;border-radius:10px;transition:width 1s ease 0.3s;}
  .ai-analysis{background:var(--cream);border-radius:12px;padding:20px 24px;line-height:1.75;color:var(--brown);font-family:'Cormorant Garamond',serif;font-size:17px;border-left:3px solid var(--saffron);margin-top:16px;}
  .pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;}
  .pros,.cons{background:var(--parchment);border-radius:12px;padding:16px 18px;}
  .pros li::before{content:"✓ ";color:var(--success);font-weight:700;}
  .cons li::before{content:"✗ ";color:var(--danger);font-weight:700;}
  .colleges-section{background:var(--cream);border-radius:12px;padding:16px 20px;margin-top:16px;}
  .college-tag{background:white;border:1px solid rgba(61,34,5,0.15);color:var(--teal);font-size:13px;font-weight:600;padding:6px 14px;border-radius:20px;}
  .next-steps{background:linear-gradient(135deg,var(--dark),var(--brown));border-radius:20px;padding:40px;text-align:center;margin-top:32px;color:white;}
  .next-step-item{background:rgba(255,255,255,0.07);border-radius:14px;padding:20px;border:1px solid rgba(255,255,255,0.1);}

  @media(max-width:900px){
    .vv-hero-new { padding: 40px 20px; }
    .vv-grid-4, .vv-grid-3, .vv-grid-2 { grid-template-columns: 1fr; gap: 30px; }
    .vv-trust-grid { grid-template-columns: 1fr 1fr; }
    .vv-founder { flex-direction: column; text-align: center; }
    .vv-two-col { grid-template-columns: 1fr; }
    .choice-grid { grid-template-columns: 1fr; }
    .pros-cons { grid-template-columns: 1fr; }
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

export default function VidyaVantage() {
  const [screen,setScreen] = useState('hero');
  const [currentSection,setCurrentSection] = useState(0);
  const [info,setInfo] = useState({name:'',class:'',city:'',aspiration:''});
  const [answers,setAnswers] = useState({});
  const [results,setResults] = useState(null);
  const [loadingStep,setLoadingStep] = useState(0);
  const [error,setError] = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GOOGLE_FONTS + STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({behavior:'smooth'});
  }, [screen, currentSection]);

  const computeRIASEC = () => {
    const scores = {R:0,I:0,A:0,S:0,E:0,C:0};
    ACTIVITY_QUESTIONS.forEach((q) => { if (answers[q.id]) scores[q.riasec] += answers[q.id]; });
    const choiceQ = [...ACADEMIC_QUESTIONS,...VALUES_QUESTIONS.filter((q) => q.riasec),...SCENARIO_QUESTIONS];
    choiceQ.forEach((q) => {
      if (answers[q.id] !== undefined && q.riasec && Array.isArray(q.riasec)) {
        const idx = q.choices.indexOf(answers[q.id]);
        if (idx >= 0 && q.riasec[idx]) scores[q.riasec[idx]] += 3;
      } else if (answers[q.id] !== undefined && q.riasec && !Array.isArray(q.riasec)) {
        scores[q.riasec] += 3;
      }
    });
    const max = Math.max(...Object.values(scores));
    if (max > 0) Object.keys(scores).forEach((k) => { scores[k] = Math.round((scores[k]/max)*10); });
    const sorted = Object.entries(scores).sort((a,b) => b[1]-a[1]);
    return {scores,sorted,code:sorted.slice(0,3).map((x) => x[0]).join('')};
  };

  const fetchAnalysis = async () => {
    setScreen('loading');
    setLoadingStep(0);
    setError(null);
    const riasec = computeRIASEC();

    for (let i = 0; i < 5; i++) {
      await new Promise((r) => setTimeout(r, 900));
      setLoadingStep(i+1);
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
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          messages: [{role:'user',content:prompt}],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b) => b.text || '').join('') || '';
      const clean = text.replace(/```json|```/g,'').trim();
      const parsed = JSON.parse(clean);
      setResults({...parsed, riasec});
      setScreen('results');
    } catch (err) {
      setError("We couldn't generate your analysis right now. Please try again.");
      setScreen('form');
      setCurrentSection(ALL_SECTIONS.length-1);
    }
  };

  const isSectionComplete = (sectionId) => {
    if (sectionId === 'info') return info.name.trim() && info.class;
    const section = ALL_SECTIONS.find((s) => s.id === sectionId);
    return section?.questions.every((q) => answers[q.id] !== undefined);
  };

  const totalQ = ALL_SECTIONS.slice(1).reduce((s,sec) => s+sec.questions.length, 0);
  const answeredQ = Object.keys(answers).length;
  const progress = Math.round((answeredQ/totalQ)*100);
  const section = ALL_SECTIONS[currentSection];
  const isLast = currentSection === ALL_SECTIONS.length-1;
  const isFirst = currentSection === 0;

  // ────────────────────────────────────────────────────────────────────────
  // HERO / LANDING PAGE (Incorporating HTML Content with VV Style)
  // ────────────────────────────────────────────────────────────────────────
  if (screen === 'hero') return (
    <div className="vv-root" ref={topRef}>
      <header className="vv-header">
        <div>
          <div className="vv-logo" onClick={() => setScreen('hero')} style={{ cursor: 'pointer' }}>Vidya<span>Vantage</span></div>
          <div className="vv-tagline">Discover your calling</div>
        </div>
        <div className="vv-badge">🇮🇳 India's Career AI</div>
      </header>

      {/* HERO SECTION */}
      <div className="vv-hero-new">
        <div className="vv-hero-content">
          <span className="vv-hero-eyebrow">For Class 8th - 12th & Undergraduates</span>
          <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--dark)', lineHeight: 1.1, marginBottom: '20px'}}>
            Confused About <br/><em style={{color: 'var(--saffron)', fontStyle: 'italic'}}>Science, Commerce or Arts?</em>
          </h1>
          <p style={{fontSize: '18px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '30px'}}>
            Discover the Right Career Path Before It's Too Late. AI-powered psychometric testing combined with expert human counsellors to help you make confident, data-driven decisions.
          </p>
          <div className="feature-tags">
            <div className="f-tag">🧠 Psychometric Matching</div>
            <div className="f-tag">📈 Stream Comparisons</div>
            <div className="f-tag">🤝 Expert Counselling</div>
          </div>
        </div>
        <div className="vv-hero-cta">
          <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '24px', color: 'var(--dark)', marginBottom: '16px'}}>Start Your Journey</h3>
          <p style={{color: 'var(--muted)', marginBottom: '24px', fontSize: '15px'}}>Answer 25 thoughtful questions about your personality, academics and values. Our AI will map your unique profile and reveal your best career paths.</p>
          <button className="vv-start-btn" style={{width: '100%'}} onClick={() => setScreen('form')}>Begin Career Assessment →</button>
          <div style={{marginTop: '20px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600}}>
            Takes only 25 minutes • 100% Free
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

      {/* WHO IS THIS FOR */}
      <div className="vv-section vv-section-alt">
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
            <h2 className="vv-sec-title" style={{textAlign: 'left'}}>Why Most Students Choose the Wrong Career</h2>
            <p style={{color: 'var(--muted)', fontSize: '16px', marginBottom: '24px', lineHeight: 1.6}}>Every year, millions of students make life-altering stream and college choices based on flawed metrics. Are you making these common mistakes?</p>
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

      {/* HOW IT WORKS */}
      <div className="vv-section vv-section-alt">
        <div className="vv-section-inner">
          <h2 className="vv-sec-title">How Our Intelligence System Works</h2>
          <p className="vv-sec-sub">A simple, 5-step scientific approach to completely eliminate career confusion.</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px'}}>
             <div className="vv-step-card"><div className="vv-step-num">1</div><h4 style={{fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '8px', color: 'var(--dark)'}}>Create Profile</h4><p style={{fontSize: '13px', color: 'var(--muted)', margin: 0}}>Log your academic history & interests.</p></div>
             <div className="vv-step-card"><div className="vv-step-num">2</div><h4 style={{fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '8px', color: 'var(--dark)'}}>Take Assessment</h4><p style={{fontSize: '13px', color: 'var(--muted)', margin: 0}}>Complete the 25-min AI Psychometric Test.</p></div>
             <div className="vv-step-card"><div className="vv-step-num">3</div><h4 style={{fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '8px', color: 'var(--dark)'}}>Get Matches</h4><p style={{fontSize: '13px', color: 'var(--muted)', margin: 0}}>Review your RIASEC code and pathways.</p></div>
             <div className="vv-step-card"><div className="vv-step-num">4</div><h4 style={{fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '8px', color: 'var(--dark)'}}>Meet Expert</h4><p style={{fontSize: '13px', color: 'var(--muted)', margin: 0}}>Discuss results 1-on-1 with a counsellor.</p></div>
             <div className="vv-step-card vv-step-final"><div className="vv-step-num">5</div><h4 style={{fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '8px', color: 'var(--saffron)'}}>Get Roadmap</h4><p style={{fontSize: '13px', color: 'var(--muted)', margin: 0}}>Lock your path and receive an execution strategy.</p></div>
          </div>
        </div>
      </div>

      {/* TRANSFORMATION */}
      <div className="vv-section">
        <div className="vv-grid-2">
          <div className="vv-story-card">
            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '26px', color: 'var(--dark)', margin: '0 0 24px 0'}}>Real Student Transformation</h3>
            <div style={{marginBottom: '24px'}}>
              <span className="vv-badge-sm" style={{background: '#FFF3F3', color: 'var(--danger)'}}>Before Assessment</span>
              <p style={{color: 'var(--muted)', fontStyle: 'italic', fontSize: '15px', margin: '8px 0 0 0'}}>"Wanted to do Engineering because my friends chose it. I hated math but felt I had no choice."</p>
            </div>
            <div style={{marginBottom: '24px'}}>
              <span className="vv-badge-sm" style={{background: '#E3F2FD', color: 'var(--teal)'}}>AI Discovery</span>
              <p style={{color: 'var(--dark)', fontWeight: 600, fontSize: '15px', margin: '8px 0 0 0'}}>High Artistic + Investigative profile discovered. Strong aptitude for design logic.</p>
            </div>
            <div>
              <span className="vv-badge-sm" style={{background: '#E8F5E9', color: 'var(--success)'}}>Now (Clarity Score: 9/10)</span>
              <p style={{color: 'var(--dark)', fontWeight: 800, fontSize: '16px', margin: '8px 0 0 0'}}>Successfully preparing for Architecture (B.Arch) with high confidence.</p>
            </div>
          </div>
          <div>
            <h2 className="vv-sec-title" style={{textAlign: 'left', marginBottom: '20px'}}>Your Career Intelligence Report Includes:</h2>
            <ul style={{listStyle: 'none', padding: 0, fontSize: '16px', color: 'var(--dark)', fontWeight: 600}}>
              <li style={{marginBottom: '16px', display: 'flex', gap: '12px'}}><span style={{color: 'var(--saffron)'}}>✔</span> Detailed RIASEC Personality Code Breakdown</li>
              <li style={{marginBottom: '16px', display: 'flex', gap: '12px'}}><span style={{color: 'var(--saffron)'}}>✔</span> Top 5 Career Matches (Ranked by Compatibility)</li>
              <li style={{marginBottom: '16px', display: 'flex', gap: '12px'}}><span style={{color: 'var(--saffron)'}}>✔</span> Optimal Stream & Subject Recommendations</li>
              <li style={{marginBottom: '16px', display: 'flex', gap: '12px'}}><span style={{color: 'var(--saffron)'}}>✔</span> Vulnerability Zones (Careers leading to burnout)</li>
              <li style={{display: 'flex', gap: '12px'}}><span style={{color: 'var(--saffron)'}}>✔</span> 1-Year Career Execution & Study Plan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FOUNDER */}
      <div className="vv-section vv-section-alt">
        <div className="vv-founder">
          <div className="vv-founder-img">👨‍💼</div>
          <div>
            <p style={{textTransform: 'uppercase', fontWeight: 700, color: 'var(--muted)', fontSize: '12px', letterSpacing: '1px', margin: '0 0 8px 0'}}>Meet the Career Architect</p>
            <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--dark)', margin: '0 0 4px 0'}}>Antonio Vian Noronha</h3>
            <h4 style={{color: 'var(--saffron)', fontSize: '16px', margin: '0 0 16px 0'}}>Lead School Counsellor</h4>
            <p style={{color: 'var(--brown)', fontSize: '16px', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 20px 0'}}>"My mission is to replace career anxiety with data-driven confidence. Combining deep psychometric testing with human empathy allows us to find the exact intersection of what a student loves and what they are naturally built to succeed in."</p>
            <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
               <span style={{background: 'var(--cream)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(61,34,5,0.1)', fontSize: '13px', fontWeight: 700}}>🎓 MSW (Medical & Psychiatric)</span>
               <span style={{background: 'var(--cream)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(61,34,5,0.1)', fontSize: '13px', fontWeight: 700}}>🌟 5000+ Students Guided</span>
            </div>
          </div>
        </div>
      </div>

      {/* PARENTS */}
      <div className="vv-parent-sec">
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 className="vv-sec-title">Built for Parents Who Want Clarity — Not Conflict</h2>
          <p className="vv-sec-sub" style={{color: 'rgba(255,255,255,0.7)'}}>We bridge the gap between student aspirations and parental expectations using hard data.</p>
          <div className="vv-grid-3">
            <div className="vv-parent-card"><div style={{fontSize: '40px'}}>📊</div><h4>Scientific Decisions</h4><p style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6, margin: 0}}>Remove emotional bias. We use proven psychometric science to identify what your child is built for.</p></div>
            <div className="vv-parent-card"><div style={{fontSize: '40px'}}>👁️</div><h4>Transparent Tracking</h4><p style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6, margin: 0}}>Our "Parent View" allows you to log in to review reports and track execution progress.</p></div>
            <div className="vv-parent-card"><div style={{fontSize: '40px'}}>🤝</div><h4>Family Alignment</h4><p style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6, margin: 0}}>Our expert counsellors mediate sessions to ensure everyone is excited about the final path.</p></div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="vv-section">
        <h2 className="vv-sec-title">Frequently Asked Questions</h2>
        <div className="vv-faq" style={{maxWidth: '800px', margin: '0 auto'}}>
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
        </div>
      </div>
      
      {/* FINAL CTA FOOTER */}
      <div className="vv-footer">
         <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '32px', marginBottom: '16px'}}>Still Confused About Your Career?</h2>
         <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '32px', fontSize: '16px'}}>Stop guessing. Take the 25-Minute Assessment to reveal the exact path you were built to walk on.</p>
         <button className="vv-start-btn" onClick={() => setScreen('form')}>Take Assessment Now →</button>
         <p style={{marginTop: '40px', fontSize: '12px', color: 'rgba(255,255,255,0.3)'}}>© 2026 VidyaVantage. A subsidiary of SecretSharz.</p>
      </div>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────
  // LOADING SCREEN
  // ────────────────────────────────────────────────────────────────────────
  if (screen === 'loading') return (
    <div className="vv-root">
      <header className="vv-header">
        <div className="vv-logo" onClick={() => setScreen('hero')} style={{ cursor: 'pointer' }}>Vidya<span>Vantage</span></div>
        <div className="vv-badge">Analysing...</div>
      </header>
      <div className="vv-loading" ref={topRef}>
        <div className="vv-loading-spinner"/>
        <h3>Building your career profile, {info.name.split(' ')[0]}…</h3>
        <p>Our AI is analysing your unique RIASEC personality and academic profile to find your perfect career match.</p>
        <div className="vv-loading-steps">
          {['Mapping RIASEC personality profile','Analysing academic strengths','Searching Indian career database','Generating personalised recommendations','Matching top colleges'].map((step,i) => (
            <div key={i} className={`loading-step ${loadingStep>i?'done':loadingStep===i?'active':''}`}>
              <div className="step-dot"/>{step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────
  // RESULTS SCREEN
  // ────────────────────────────────────────────────────────────────────────
  if (screen === 'results' && results) {
    const {riasec,riasecSummary,bestCareer,recommendedCareer,leastCareer,nextSteps} = results;
    return (
      <div className="vv-root">
        <header className="vv-header">
          <div className="vv-logo" onClick={() => setScreen('hero')} style={{ cursor: 'pointer' }}>Vidya<span>Vantage</span></div>
          <div className="vv-badge">Your Results</div>
        </header>
        <div className="vv-results" ref={topRef}>
          <div className="results-hero">
            <div className="results-name">Career Report for {info.name} · {info.class}</div>
            <h2>Your RIASEC Code: <em style={{color:'var(--gold)'}}>{riasec.code}</em></h2>
            <div style={{color:'rgba(255,255,255,0.7)',fontSize:'15px',maxWidth:'560px',margin:'12px auto 20px',lineHeight:'1.7'}}>{riasecSummary}</div>
            <div className="riasec-result-row">
              {riasec.sorted.slice(0,3).map(([k,v]) => (
                <div key={k} className="riasec-chip" style={{background:RIASEC_COLORS[k].bg,color:RIASEC_COLORS[k].color}}>{RIASEC_COLORS[k].label} ({v}/10)</div>
              ))}
            </div>
          </div>
          {[{data:bestCareer,cls:'best',badge:'🏆 Best Match Career Path'},{data:recommendedCareer,cls:'recommended',badge:'✅ Recommended Career Path'},{data:leastCareer,cls:'least',badge:'⚠️ Least Recommended Path'}].filter((c) => c.data).map(({data,cls,badge}) => (
            <div key={cls} className={`career-card ${cls}`}>
              <div className="career-badge">{badge}</div>
              <div className="career-title">{data.title}</div>
              <div className="career-subtitle">{data.subtitle}</div>
              <div className="match-bar-wrap">
                <div className="match-bar-label"><span className="match-bar-text">Profile Match</span><span className="match-pct">{data.matchPercent}%</span></div>
                <div className="match-bar-bg"><div className="match-bar-fill" style={{width:`${data.matchPercent}%`}}/></div>
              </div>
              <div className="ai-analysis">{data.analysis}</div>
              {data.pros && data.cons && (
                <div className="pros-cons">
                  <div className="pros"><h5>Strengths & Advantages</h5><ul>{data.pros.map((p,i) => <li key={i}>{p}</li>)}</ul></div>
                  <div className="cons"><h5>Challenges to Expect</h5><ul>{data.cons.map((c,i) => <li key={i}>{c}</li>)}</ul></div>
                </div>
              )}
              {data.colleges && data.colleges.length > 0 && (
                <div className="colleges-section">
                  <h5>Recommended Colleges in India</h5>
                  <div className="college-tags">{data.colleges.map((c,i) => <span key={i} className="college-tag">{c}</span>)}</div>
                </div>
              )}
            </div>
          ))}
          <div className="next-steps">
            <h3>Your Next Steps</h3>
            <p>Based on your {riasec.code} profile, here's what {info.name.split(' ')[0]} should do next:</p>
            <div className="next-steps-grid">
              {(nextSteps||[]).slice(0,3).map((step,i) => (
                <div key={i} className="next-step-item"><div className="next-step-num">0{i+1}</div><div className="next-step-desc">{step}</div></div>
              ))}
            </div>
            <button className="btn-restart" onClick={() => {setScreen('hero');setAnswers({});setInfo({name:'',class:'',city:'',aspiration:''});setCurrentSection(0);}}>Take the Assessment Again</button>
          </div>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────────────────────────────
  // FORM SCREEN
  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="vv-root">
      <header className="vv-header">
        <div className="vv-logo" onClick={() => setScreen('hero')} style={{ cursor: 'pointer' }}>Vidya<span>Vantage</span></div>
        <div className="vv-tagline">Career Discovery Assessment</div>
        <div className="vv-badge">Step {currentSection+1} of {ALL_SECTIONS.length}</div>
      </header>
      {currentSection > 0 && (
        <div className="vv-progress-wrap">
          <span className="vv-section-tag">{section.label}</span>
          <span className="vv-progress-label">{answeredQ}/{totalQ} answered</span>
          <div className="vv-progress-bar-bg"><div className="vv-progress-fill" style={{width:`${progress}%`}}/></div>
          <span className="vv-progress-pct">{progress}%</span>
        </div>
      )}
      <div className="vv-form-card" ref={topRef}>
        {error && <div className="error-box">⚠️ {error} Please check your connection and try again.</div>}
        {section.id === 'info' ? (
          <div>
            <div className="vv-section-header"><h2>Tell us about yourself</h2><p>This helps us personalise your career analysis for your stage of education and life in India.</p></div>
            <div className="vv-two-col">
              <div className="vv-field"><label>Your Full Name</label><input value={info.name} onChange={(e) => setInfo({...info,name:e.target.value})} placeholder="e.g. Priya Sharma"/></div>
              <div className="vv-field"><label>Your Current Class / Level</label><select value={info.class} onChange={(e) => setInfo({...info,class:e.target.value})}><option value="">Select your class</option>{CLASS_LEVELS.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            </div>
            <div className="vv-two-col">
              <div className="vv-field"><label>Your City / State</label><input value={info.city} onChange={(e) => setInfo({...info,city:e.target.value})} placeholder="e.g. Chennai, Tamil Nadu"/></div>
              <div className="vv-field"><label>Any career dream? (Optional)</label><input value={info.aspiration} onChange={(e) => setInfo({...info,aspiration:e.target.value})} placeholder="e.g. I want to be a doctor"/></div>
            </div>
          </div>
        ) : (
          <div>
            <div className="vv-section-header">
              <h2>{section.label}</h2>
              <p>{section.id==='activities'&&'Rate how much you enjoy each activity on a scale of 1 (not at all) to 5 (absolutely love it).'}{section.id==='academics'&&'Tell us about your academic preferences and how you learn best.'}{section.id==='values'&&'What matters most to you in life and your future career?'}{section.id==='scenarios'&&'Choose the option that most naturally resonates with how you would react.'}</p>
            </div>
            {section.questions.map((q,idx) => (
              <div key={q.id} className="q-card">
                <div className="q-number">Question {idx+1}</div>
                <div className="q-text">{q.text}</div>
                {q.type==='scale' ? (
                  <div>
                    <div className="q-scale-labels"><span className="q-scale-label">Not at all</span><span className="q-scale-label">Very much</span></div>
                    <div className="q-scale">{[1,2,3,4,5].map((v) => <button key={v} className={`scale-btn ${answers[q.id]===v?'selected':''}`} onClick={() => setAnswers({...answers,[q.id]:v})}>{v}</button>)}</div>
                  </div>
                ) : (
                  <div className="choice-grid">{q.choices.map((c,i) => <button key={i} className={`choice-btn ${answers[q.id]===c?'selected':''}`} onClick={() => setAnswers({...answers,[q.id]:c})}>{c}</button>)}</div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="vv-nav">
          <button className="btn-back" onClick={() => setCurrentSection(Math.max(0,currentSection-1))} style={{visibility:isFirst?'hidden':'visible'}}>← Back</button>
          {isLast ? (
            <button className="btn-next" onClick={fetchAnalysis} disabled={!isSectionComplete(section.id)}>Analyse My Career Profile 🚀</button>
          ) : (
            <button className="btn-next" onClick={() => setCurrentSection(currentSection+1)} disabled={!isSectionComplete(section.id)}>Continue →</button>
          )}
        </div>
      </div>
    </div>
  );
}
