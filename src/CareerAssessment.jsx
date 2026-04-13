import React, { useState, useEffect, useRef } from 'react';

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
  .career-subtitle{color:var(--muted);font-size:15px;margin:4px 0 16px;}
  .match-bar-wrap{margin:20px 0 0;}
  .match-bar-label{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
  .match-bar-text{font-size:13px;font-weight:600;color:var(--muted);}
  .match-pct{font-size:19px;font-weight:700;color:var(--dark);}
  .match-bar-bg{height:8px;background:rgba(61,34,5,0.08);border-radius:10px;overflow:hidden;}
  .match-bar-fill{height:100%;border-radius:10px;transition:width 1s ease 0.3s;}
  .ai-analysis{background:var(--cream);border-radius:12px;padding:20px 24px;line-height:1.75;color:var(--brown);font-family:'Cormorant Garamond',serif;font-size:17px;border-left:3px solid var(--saffron);margin-top:16px;}
  .pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;}
  .pros,.cons{background:var(--parchment);border-radius:12px;padding:16px 18px;}
  .pros ul,.cons ul{list-style:none;padding:0;margin:10px 0 0;}
  .pros h5,.cons h5{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;color:var(--brown);}
  .pros li,.cons li{font-size:14px;padding:4px 0;color:var(--dark);line-height:1.5;}
  .pros li::before{content:"✓ ";color:var(--success);font-weight:700;}
  .cons li::before{content:"✗ ";color:var(--danger);font-weight:700;}
  .colleges-section{background:var(--cream);border-radius:12px;padding:16px 20px;margin-top:16px;}
  .colleges-section h5{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin:0 0 10px;}
  .college-tags{display:flex;flex-wrap:wrap;gap:8px;}
  .college-tag{background:white;border:1px solid rgba(61,34,5,0.15);color:var(--teal);font-size:13px;font-weight:600;padding:6px 14px;border-radius:20px;}
  .next-steps{background:linear-gradient(135deg,var(--dark),var(--brown));border-radius:20px;padding:40px;text-align:center;margin-top:32px;color:white;}
  .next-steps h3{font-family:'Playfair Display',serif;font-size:26px;margin-bottom:8px;}
  .next-steps p{color:rgba(255,255,255,0.7);font-size:15px;margin-bottom:0;}
  .next-steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:28px 0;}
  .next-step-item{background:rgba(255,255,255,0.07);border-radius:14px;padding:22px;border:1px solid rgba(255,255,255,0.1);text-align:left;}
  .next-step-num{font-family:'Playfair Display',serif;font-size:34px;color:var(--gold);line-height:1;margin-bottom:10px;}
  .next-step-desc{font-size:14px;color:rgba(255,255,255,0.85);line-height:1.6;}
  .btn-restart{background:transparent;border:2px solid rgba(255,255,255,0.3);color:white;padding:14px 36px;border-radius:50px;font-size:15px;font-weight:600;cursor:pointer;margin-top:20px;font-family:'DM Sans',sans-serif;transition:all 0.2s;}
  .btn-restart:hover{background:rgba(255,255,255,0.1);}

  @media(max-width:900px){
    .vv-two-col{grid-template-columns:1fr;}
    .choice-grid{grid-template-columns:1fr;}
    .pros-cons{grid-template-columns:1fr;}
    .next-steps-grid{grid-template-columns:1fr;}
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

export default function CareerAssessment({ onBack, onExplore, savedResults, onSaveResults }) {
  const [screen, setScreen] = useState(savedResults ? 'results' : 'form');
  const [currentSection, setCurrentSection] = useState(0);
  const [info, setInfo] = useState({ name: '', class: '', city: '', aspiration: '' });
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(savedResults || null);
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

  const fetchAnalysis = async () => {
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
        throw new Error(data.details || data.error || \`Server error \${res.status}\`);
      }

      const text = data.content?.map(b => b.text || '').join('') || '';
      const clean = text.replace(/\`\`\`json|\`\`\`/g, '').trim();
      const parsed = JSON.parse(clean);
      
      const finalResults = { ...parsed, riasec, studentInfo: info };
      setResults(finalResults);
      if (onSaveResults) onSaveResults(finalResults);
      setScreen('results');
    } catch (err) {
      clearTimeout(timeoutId);
      const message = err.name === 'AbortError'
        ? 'The analysis timed out. Please check your connection and try again.'
        : \`We couldn't generate your analysis: \${err.message}\`;
      setError(message);
      setScreen('form');
      setCurrentSection(sectionBeforeSubmit);
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

  const Header = ({ badge, showNav = true }) => (
    <header className="vv-header">
      <div>
        <div className="vv-logo" onClick={onBack} style={{ cursor: 'pointer' }}>Vidya<span>Vantage</span></div>
      </div>
      {showNav && (
        <div className="vv-header-nav">
          <button className="vv-nav-btn" onClick={onExplore}>🔎 Explore Careers</button>
          <button className="vv-nav-btn active" onClick={() => { setScreen('form'); }}>📝 Take Assessment</button>
          {badge && <div className="vv-badge">{badge}</div>}
        </div>
      )}
      {!showNav && badge && <div className="vv-badge">{badge}</div>}
    </header>
  );

  if (screen === 'loading') return (
    <div className="vv-root">
      <Header badge="Analysing..." showNav={false} />
      <div className="vv-loading" ref={topRef}>
        <div className="vv-loading-spinner" />
        <h3>Building your career profile, {info.name.split(' ')[0]}…</h3>
        <p>Our AI is analysing your unique RIASEC personality and academic profile to find your perfect career match.</p>
        <div className="vv-loading-steps">
          {['Mapping RIASEC personality profile', 'Analysing academic strengths', 'Searching Indian career database', 'Generating personalised recommendations', 'Matching top colleges'].map((step, i) => (
            <div key={i} className={`loading-step \${loadingStep > i ? 'done' : loadingStep === i ? 'active' : ''}`}>
              <div className="step-dot" />{step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (screen === 'results' && results) {
    const { riasec, riasecSummary, bestCareer, recommendedCareer, leastCareer, nextSteps, studentInfo } = results;
    const displayStudentName = studentInfo?.name || "Student";
    
    return (
      <div className="vv-root">
        <Header badge="Your Results" showNav={false} />
        <div className="vv-results" ref={topRef}>
          <div className="results-hero">
            <div className="results-name">Career Report for {displayStudentName} · {studentInfo?.class || ""}</div>
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
            <div key={cls} className={`career-card \${cls}`}>
              <div className="career-badge">{badge}</div>
              <div className="career-title">{data.title}</div>
              <div className="career-subtitle">{data.subtitle}</div>
              <div className="match-bar-wrap">
                <div className="match-bar-label">
                  <span className="match-bar-text">Profile Match</span>
                  <span className="match-pct">{data.matchPercent}%</span>
                </div>
                <div className="match-bar-bg">
                  <div className="match-bar-fill" style={{ width: \`\${data.matchPercent}%\`, background: barColor }} />
                </div>
              </div>
              <div className="ai-analysis">{data.analysis}</div>
              {data.pros && data.cons && (
                <div className="pros-cons">
                  <div className="pros"><h5>Strengths & Advantages</h5><ul>{data.pros.map((p, i) => <li key={i}>{p}</li>)}</ul></div>
                  <div className="cons"><h5>Challenges to Expect</h5><ul>{data.cons.map((c, i) => <li key={i}>{c}</li>)}</ul></div>
                </div>
              )}
              {data.colleges && data.colleges.length > 0 && (
                <div className="colleges-section">
                  <h5>Recommended Colleges in India</h5>
                  <div className="college-tags">{data.colleges.map((c, i) => <span key={i} className="college-tag">{c}</span>)}</div>
                </div>
              )}
            </div>
          ))}

          <div className="next-steps">
            <h3>Your Next Steps</h3>
            <p>Based on your {riasec.code} profile, here's what {displayStudentName.split(' ')[0]} should do next:</p>
            <div className="next-steps-grid">
              {(nextSteps || []).slice(0, 3).map((step, i) => (
                <div key={i} className="next-step-item">
                  <div className="next-step-num">0{i + 1}</div>
                  <div className="next-step-desc">{step}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-restart" onClick={() => { setScreen('form'); setAnswers({}); setInfo({ name: '', class: '', city: '', aspiration: '' }); setCurrentSection(0); }}>Take the Assessment Again</button>
              <button className="btn-restart" style={{ borderColor: 'var(--gold)', color: 'var(--gold)' }} onClick={onExplore}>🔎 Explore Career Paths</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="vv-root">
      <Header badge={\`Step \${currentSection + 1} of \${ALL_SECTIONS.length}\`} showNav={false} />
      {currentSection > 0 && (
        <div className="vv-progress-wrap">
          <span className="vv-section-tag">{section.label}</span>
          <span className="vv-progress-label">{answeredQ}/{totalQ} answered</span>
          <div className="vv-progress-bar-bg"><div className="vv-progress-fill" style={{ width: \`\${progress}%\` }} /></div>
          <span className="vv-progress-pct">{progress}%</span>
        </div>
      )}
      <div className="vv-form-card" ref={topRef}>
        {error && <div className="error-box">⚠️ {error}</div>}

        {section.id === 'info' ? (
          <div>
            <div className="vv-section-header">
              <h2>Tell us about yourself</h2>
              <p>This helps us personalise your career analysis for your stage of education and life in India.</p>
            </div>
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
                {section.id === 'activities' && 'Rate how much you enjoy activity on a scale of 1 (not at all) to 5 (absolutely love it).'}
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
                    <div className="q-scale">{[1, 2, 3, 4, 5].map(v => <button key={v} className={`scale-btn \${answers[q.id] === v ? 'selected' : ''}`} onClick={() => setAnswers({ ...answers, [q.id]: v })}>{v}</button>)}</div>
                  </div>
                ) : (
                  <div className="choice-grid">{q.choices.map((c, i) => <button key={i} className={`choice-btn \${answers[q.id] === c ? 'selected' : ''}`} onClick={() => setAnswers({ ...answers, [q.id]: c })}>{c}</button>)}</div>
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
