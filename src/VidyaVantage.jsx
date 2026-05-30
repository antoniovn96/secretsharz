import React, { useState, useEffect, useRef } from 'react';
import CareerAssessment from './CareerAssessment';
import CareerPaths from './CareerPaths';

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

  /* ─── CAREER EXPLORER STYLES ─── */
  .exp-hero{background:linear-gradient(135deg,var(--dark) 0%,var(--brown) 70%,rgba(232,101,10,0.4) 100%);padding:56px 40px 40px;text-align:center;color:white;}
  .exp-tabs{gap:0;background:rgba(255,255,255,0.08);border-radius:14px;padding:4px;display:inline-flex;margin-top:24px;}
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
  
  .exp-shortlist{max-width:1000px;margin:0 auto;padding:40px 20px;}
  .shortlist-compare{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;margin-top:20px;}
  .shortlist-card{background:white;border-radius:18px;padding:24px;border:1px solid rgba(61,34,5,0.1);box-shadow:0 3px 10px rgba(0,0,0,0.04);}
  .shortlist-remove{float:right;background:rgba(139,26,26,0.08);border:none;color:var(--danger);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:14px;font-weight:700;}
  
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
    .exp-expand-grid{grid-template-columns:1fr;}
    .vv-hero-cta,.vv-hero-content{min-width:0;}
    .vv-header{padding:14px 20px;}
  }
`;


// ─── MAIN APP COMPONENT ───────────────────────────────────────────────────────
export default function VidyaVantage({ onBack, navigate }) {
  const [screen, setScreen] = useState('hero');
  const [assessmentResults, setAssessmentResults] = useState(null);
  const topRef = useRef(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = GOOGLE_FONTS + STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [screen]);

  if (screen === 'assessment') {
    return (
      <CareerAssessment
        onBack={() => setScreen('hero')}
        onExplore={() => setScreen('explorer')}
        savedResults={assessmentResults}
        onSaveResults={setAssessmentResults}
      />
    );
  }

  const Header = ({ badge, showNav = true }) => (
    <header className="vv-header">
      <div>
        <div className="vv-logo" onClick={onBack || (() => setScreen('hero'))} style={{ cursor: 'pointer' }}>Vidya<span>Vantage</span></div>
        {screen !== 'form' && screen !== 'loading' && screen !== 'results' && (
          <div className="vv-tagline">Discover your calling</div>
        )}
      </div>
      {showNav && (
        <div className="vv-header-nav">
          <button className={`vv-nav-btn`} onClick={() => navigate('/career-paths')}>🔎 Explore Careers</button>
          <button className={`vv-nav-btn`} onClick={() => setScreen('assessment')}>📝 Take Assessment</button>
          <button className="vv-nav-btn" onClick={() => navigate('/colleges')}>🏫 Top Colleges</button>
          {badge && <div className="vv-badge">{badge}</div>}
        </div>
      )}
      {!showNav && badge && <div className="vv-badge">{badge}</div>}
    </header>
  );

  if (screen === 'explorer') return (
    <div className="vv-root" ref={topRef}>
      <Header badge="🇮🇳 India's Career AI" />
      <CareerPaths 
        assessmentRiasec={assessmentResults?.riasec?.code || null} 
        navigate={navigate}
        onTakeAssessment={() => setScreen('assessment')}
      />
    </div>
  );

  return (
    <div className="vv-root" ref={topRef}>
      <Header badge="🇮🇳 India's Career AI" />

      {/* HERO */}
      <div className="vv-hero-new">
        <div className="vv-hero-content">
          <span className="vv-hero-eyebrow">For Class 8th - 12th &amp; Undergraduates</span>
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
          <button className="vv-start-btn" style={{ width: '100%' }} onClick={() => setScreen('assessment')}>Begin Career Assessment →</button>
          <div style={{ margin: '14px 0 0', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>Takes only 25 minutes • 100% Free</div>
          
          <div style={{ borderTop: '1px solid rgba(61,34,5,0.08)', marginTop: '20px', paddingTop: '20px' }}>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '10px' }}>Not sure where to start?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{ background: 'var(--parchment)', border: '1px solid rgba(61,34,5,0.12)', color: 'var(--brown)', padding: '12px 24px', borderRadius: '50px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', sans-serif" }} onClick={() => navigate('/career-paths')}>🔎 Explore Career Paths First</button>
              
              <button style={{ background: 'var(--cream)', border: '1.5px solid var(--teal)', color: 'var(--teal)', padding: '12px 24px', borderRadius: '50px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', sans-serif" }} onClick={() => navigate('/colleges')}>🏫 Browse Top Colleges</button>
            </div>
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

      {/* HOW IT WORKS */}
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

      {/* FOUNDER */}
      <div className="vv-section-alt">
        <div className="vv-section-inner">
          <div className="vv-founder">
            <div className="vv-founder-img">👨‍💼</div>
            <div>
              <p style={{ textTransform: 'uppercase', fontWeight: 700, color: 'var(--muted)', fontSize: '12px', letterSpacing: '1px', margin: '0 0 8px 0' }}>Meet the Career Architect</p>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--dark)', margin: '0 0 4px 0' }}>Antonio Vian Noronha</h3>
              <h4 style={{ color: 'var(--saffron)', fontSize: '16px', margin: '0 0 16px 0' }}>Lead School Counsellor</h4>
              <p style={{ color: 'var(--brown)', fontSize: '16px', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 20px 0' }}>&quot;My mission is to replace career anxiety with data-driven confidence. Combining deep psychometric testing with human empathy allows us to find the exact intersection of what a student loves and what they are naturally built to succeed in.&quot;</p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ background: 'var(--cream)', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(61,34,5,0.1)', fontSize: '13px', fontWeight: 700 }}>🎓 MSW (Medical &amp; Psychiatric)</span>
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
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', margin: '0 0 16px 0' }}>Still Confused About Your Career?</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', fontSize: '16px' }}>Stop guessing. Take the 25-Minute Assessment to reveal the exact path you were built to walk on.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="vv-start-btn" onClick={() => setScreen('assessment')}>Take Assessment Now →</button>
          <button style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.3)', color: 'white', padding: '18px 48px', borderRadius: '50px', fontSize: '17px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={() => navigate('/career-paths')}>🔎 Explore Careers First</button>
        </div>
        <p style={{ marginTop: '40px', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>© 2026 VidyaVantage. A subsidiary of SecretSharz.</p>
      </div>
    </div>
  );
}
