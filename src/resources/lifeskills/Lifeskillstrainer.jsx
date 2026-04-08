/**
 * Life Skills Trainer — School Counsellor Activity Bank
 * src/resources/lifeskills/Lifeskillstrainer.jsx
 *
 * 60 classroom-ready activities for Grade 5–12 life skills sessions.
 * Upgraded to a Full Counsellor Productivity Tool.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ─── CSS ─────────────────────────────────────────────────────────────────────
const PAGE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

:root {
  --ls-amber:#C8860A; --ls-amber-pale:#FFF8E8; --ls-amber-mid:#FFEDBE;
  --ls-forest:#2D5240; --ls-sage:#4A7C59; --ls-sage-pale:#EBF4EE;
  --ls-cream:#FFFBF5; --ls-sand:#F7F3ED; --ls-ink:#1E2820;
  --ls-ink-soft:#3D4A40; --ls-muted:#7A8A7D; --ls-border:rgba(30,40,32,0.1);
  --ls-shadow-sm:0 4px 16px rgba(30,40,32,0.06);
  --ls-shadow-md:0 12px 40px rgba(30,40,32,0.12);
  --ls-r:20px;
}

* { box-sizing: border-box; }

.lst-page { min-height:100vh; background:var(--ls-cream); padding-bottom:100px; font-family:'Plus Jakarta Sans',sans-serif; overflow-x: hidden; }

/* Topbar & Hero */
.lst-topbar { background:var(--ls-ink); color:white; height:56px; padding:0 40px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:300; border-bottom:3px solid var(--ls-amber); }
.lst-back { display:flex; align-items:center; gap:6px; color:rgba(255,255,255,0.7); font-size:13px; font-weight:700; background:none; border:none; cursor:pointer; font-family:inherit; padding:0; transition:color .2s; }
.lst-back:hover { color:white; }
.lst-topbar-title { font-family:'Fraunces',serif; font-size:16px; color:white; display:none; }
@media(min-width: 768px) { .lst-topbar-title { display:block; } }
.lst-topbar-actions { display:flex; gap:16px; align-items:center; }

.lst-hero { background:linear-gradient(135deg,var(--ls-ink) 0%,#2C1F05 55%,#3D2D0A 100%); padding:64px 48px 56px; position:relative; overflow:hidden; }
.lst-hero-blob { position:absolute; pointer-events:none; border-radius:50%; }
.lst-hero-blob-1 { width:480px; height:480px; background:radial-gradient(circle,rgba(200,134,10,.14),transparent 70%); top:-160px; right:-80px; }
.lst-hero-inner { max-width:1200px; margin:0 auto; display:flex; gap:56px; align-items:flex-start; flex-wrap:wrap; position:relative; z-index:1; }
.lst-hero-h1 { font-family:'Fraunces',serif; font-size:clamp(30px,4.5vw,48px); font-weight:700; color:white; line-height:1.1; letter-spacing:-1px; margin-bottom:16px; }
.lst-hero-sub { font-size:16px; color:rgba(255,255,255,.65); line-height:1.75; max-width:550px; margin-bottom:28px; font-weight:300; }

/* Dashboard Button */
.lst-dash-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 6px 12px; border-radius: 50px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; display:flex; align-items:center; gap:6px;}
.lst-dash-btn:hover { background: var(--ls-amber); border-color: var(--ls-amber); }

/* Smart Controls */
.lst-toolbar { background:white; border-bottom:1px solid var(--ls-border); position:sticky; top:56px; z-index:200; box-shadow:var(--ls-shadow-sm); padding:16px 48px; display:flex; flex-direction:column; gap:16px; align-items:center; }
.lst-toolbar-inner { max-width:1200px; width:100%; margin:0 auto; display:flex; gap:20px; align-items:center; flex-wrap:wrap; }
.lst-search-wrap { flex:1; min-width:280px; position:relative; }
.lst-search-input { width:100%; padding:12px 20px 12px 44px; border-radius:50px; border:2px solid var(--ls-border); font-size:14px; font-family:inherit; transition:border-color .2s; outline:none; }
.lst-search-input:focus { border-color:var(--ls-amber); }
.lst-search-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--ls-muted); font-size:16px; }
.lst-quick-filters { display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
.lst-qf-btn { padding:8px 16px; border-radius:50px; background:var(--ls-sand); border:1px solid var(--ls-border); font-size:12px; font-weight:700; color:var(--ls-ink-soft); cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:6px; }
.lst-qf-btn:hover { background:var(--ls-amber-pale); border-color:var(--ls-amber); color:var(--ls-amber); }
.lst-qf-btn.active { background:var(--ls-amber); border-color:var(--ls-amber); color:white; }

/* Grid & Cards */
.lst-grid { max-width:1200px; margin:32px auto 0; padding:0 48px 60px; display:flex; flex-direction:column; gap:24px; }
.lst-card { background:white; border-radius:var(--ls-r); border:1px solid var(--ls-border); box-shadow:var(--ls-shadow-sm); overflow:hidden; transition:all .3s cubic-bezier(0.25, 0.8, 0.25, 1); position:relative; }
.lst-card:hover { box-shadow:var(--ls-shadow-md); transform:translateY(-4px); }
.lst-card.expanded { border-color:var(--ls-amber); box-shadow:var(--ls-shadow-md); transform:translateY(0); }
.lst-card-accent { height:6px; width:100%; }

.lst-card-header { padding:24px 32px; display:flex; align-items:flex-start; gap:20px; cursor:pointer; user-select:none; }
.lst-card-num { width:48px; height:48px; border-radius:14px; background:var(--ls-sand); display:flex; align-items:center; justify-content:center; font-family:'Fraunces',serif; font-size:20px; font-weight:700; color:var(--ls-amber); flex-shrink:0; border:1px solid var(--ls-border); }
.lst-card-meta-block { flex:1; }
.lst-card-title { font-family:'Fraunces',serif; font-size:22px; font-weight:700; color:var(--ls-ink); margin-bottom:8px; line-height:1.2; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }

/* Tooltips */
[data-tooltip] { position: relative; cursor: help; }
[data-tooltip]:hover::after { content: attr(data-tooltip); position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%); background: var(--ls-ink); color: white; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; white-space: nowrap; z-index: 10; pointer-events: none; font-family: 'Plus Jakarta Sans', sans-serif; margin-bottom: 8px; box-shadow: var(--ls-shadow-sm); }

.lst-bookmark-btn { background:none; border:none; font-size:22px; cursor:pointer; color:var(--ls-border); transition:all .2s; margin-top:-4px; padding:0;}
.lst-bookmark-btn.saved { color:#E74C3C; }
.lst-bookmark-btn:hover { transform:scale(1.2); }

.lst-analytics-row { display:flex; gap:16px; align-items:center; margin-bottom:12px; font-size:12px; color:var(--ls-muted); font-weight:600; }
.lst-stat-item { display:flex; align-items:center; gap:4px; cursor:pointer; transition:color 0.2s;}
.lst-stat-item:hover { color:var(--ls-amber); }
.lst-stat-star { color:#F1C40F; }

.lst-card-badges { display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:12px; }
.lst-badge { padding:5px 12px; border-radius:50px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; }
.lst-badge-theme { background:var(--ls-amber-pale); color:var(--ls-amber); }
.lst-badge-energy { background:#FDF0EA; color:#E8845A; border:1px solid rgba(232,132,90,0.3); }
.lst-badge-complex { background:#EBF5FB; color:#2980B9; border:1px solid rgba(41,128,185,0.3); }
.lst-badge-tag { background:#F4ECF7; color:#8E44AD; border:1px solid rgba(142,68,173,0.3); }

.lst-card-obj { font-size:14px; color:var(--ls-ink-soft); line-height:1.6; max-width:800px; }
.lst-card-body { border-top:1px solid var(--ls-border); padding:32px; animation:lstFadeIn .3s ease; background:var(--ls-cream); }
.lst-expanded-grid { display:grid; grid-template-columns:2fr 1fr; gap:32px; }

/* Custom Native Accordions for Reduced Cognitive Load */
details.lst-accordion { background:white; border:1px solid var(--ls-border); border-radius:12px; margin-bottom:12px; overflow:hidden; }
details.lst-accordion summary { padding:16px 20px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:space-between; user-select:none; background:var(--ls-cream); transition:background 0.2s; }
details.lst-accordion summary:hover { background:var(--ls-sand); }
details.lst-accordion summary::after { content: '▼'; font-size:10px; color:var(--ls-muted); transition:transform 0.3s; }
details.lst-accordion[open] summary::after { transform:rotate(180deg); }
details.lst-accordion[open] summary { border-bottom:1px solid var(--ls-border); }
.lst-accordion-content { padding:20px; }

.lst-sidebar-box { background:white; border:1px solid var(--ls-border); border-radius:16px; padding:20px; margin-bottom:16px; }
.lst-sb-title { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--ls-muted); margin-bottom:12px; display:flex; align-items:center; gap:6px; }
.lst-sb-text { font-size:13px; color:var(--ls-ink-soft); line-height:1.6; }
.lst-outcome-list { padding-left:16px; margin:0; font-size:13px; color:var(--ls-ink-soft); line-height:1.6; }
.lst-outcome-list li { margin-bottom:6px; }

.lst-protip { background:#FFFBEA; border-left:4px solid #F1C40F; padding:12px 16px; border-radius:0 8px 8px 0; font-size:13px; color:var(--ls-ink-soft); line-height:1.6; margin-top:16px; }
.lst-psych-box { background:#F0F8FF; border-left:4px solid #3498DB; padding:12px 16px; border-radius:0 8px 8px 0; font-size:13px; color:var(--ls-ink-soft); line-height:1.6; margin-top:16px; }

/* Interactive Phase Steps */
.lst-step { display:flex; gap:12px; padding:12px 16px; border-radius:10px; margin-bottom:8px; font-size:14px; line-height:1.65; }
.lst-step.say { background:#EAF4FA; border-left:4px solid #5B9EBF; }
.lst-step.do  { background:var(--ls-sand); border-left:4px solid var(--ls-muted); }
.lst-step-label { font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:1px; width:50px; flex-shrink:0; margin-top:4px; }
.lst-step.say .lst-step-label  { color:#2980B9; }
.lst-step-text { flex:1; color:var(--ls-ink-soft); }
.lst-step.say .lst-step-text { font-weight:600; color:var(--ls-ink); }

/* Suggestions */
.lst-suggestions { margin-top:32px; border-top:1px solid var(--ls-border); padding-top:24px; }
.lst-sugg-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:16px; }
.lst-sugg-card { padding:16px; border:1px solid var(--ls-border); border-radius:12px; background:white; cursor:pointer; transition:border-color .2s; }
.lst-sugg-card:hover { border-color:var(--ls-amber); }
.lst-sugg-title { font-weight:700; font-size:14px; color:var(--ls-ink); margin-bottom:8px;}

/* Actions */
.lst-card-actions { display:flex; gap:12px; flex-wrap:wrap; margin-top:24px; padding-top:24px; border-top:1px dashed var(--ls-border); }
.lst-action-btn { padding:12px 24px; border-radius:50px; font-size:13px; font-weight:700; cursor:pointer; border:none; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:8px; text-decoration:none; text-align:center; }
.lst-action-btn.primary { background:var(--ls-forest); color:white; }
.lst-action-btn.primary:hover { background:var(--ls-ink); }
.lst-action-btn.secondary { background:white; border:1px solid var(--ls-border); color:var(--ls-ink); }
.lst-action-btn.secondary:hover { border-color:var(--ls-amber); color:var(--ls-amber); }
.lst-action-btn.live { background:#E74C3C; color:white; animation: pulse 2s infinite; }
.lst-action-btn.live:hover { background:#C0392B; animation:none; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); } 100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); } }

/* Modals & Overlays */
.lst-modal-overlay { position:fixed; inset:0; background:rgba(30,40,32,0.8); backdrop-filter:blur(4px); z-index:1000; display:flex; align-items:center; justify-content:center; padding: 20px; }
.lst-modal { background:white; width:100%; max-width:600px; border-radius:24px; padding:32px; box-shadow:var(--ls-shadow-md); animation:lstSlideUp .3s ease; max-height:90vh; overflow-y:auto; }
@keyframes lstSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.lst-modal h2 { font-family:'Fraunces',serif; margin:0 0 8px; font-size:24px; }
.lst-modal p { color:var(--ls-muted); font-size:14px; margin-bottom:24px; line-height:1.6; }

.lst-rating-group { display:flex; gap:12px; margin-bottom:24px; flex-wrap:wrap; }
.lst-rate-btn { flex:1; min-width: 100px; padding:12px; border:1px solid var(--ls-border); border-radius:12px; background:white; cursor:pointer; font-weight:700; color:var(--ls-muted); transition:all .2s; }
.lst-rate-btn:hover { border-color:var(--ls-amber); }
.lst-rate-btn.active { background:var(--ls-amber-pale); border-color:var(--ls-amber); color:var(--ls-amber); }
textarea.lst-input { width:100%; padding:16px; border:1px solid var(--ls-border); border-radius:12px; font-family:inherit; min-height:120px; margin-bottom:24px; resize:vertical; }

/* Tabs & Filters */
.lst-tabs-wrap { background:white; border-bottom:1px solid var(--ls-border); }
.lst-tabs { max-width:1200px; margin:0 auto; display:flex; overflow-x:auto; scrollbar-width: none; }
.lst-tabs::-webkit-scrollbar { display: none; }
.lst-tab { flex:1; padding:20px; border:none; background:none; cursor:pointer; border-bottom:3px solid transparent; transition:all .2s; text-align:center; min-width:150px; }
.lst-tab.active { border-bottom-color:var(--ls-amber); background:var(--ls-amber-pale); }
.lst-tab-sub { display:block; font-size:11px; color:var(--ls-muted); margin-top:4px; }

.lst-chip { padding:6px 14px; border-radius:50px; background:var(--ls-sand); border:1px solid var(--ls-border); font-size:12px; cursor:pointer; white-space:nowrap; }
.lst-chip.active { background:var(--ls-forest); color:white; border-color:var(--ls-forest); }
.lst-filter-row { display:flex; gap:8px; align-items:center; }
.lst-material-tag { padding:4px 10px; background:var(--ls-sand); border-radius:6px; font-size:11px; margin-right:6px; margin-bottom:6px; display:inline-block; }

/* --- SESSION PLANNER SIDEBAR --- */
.lst-sidebar { position: fixed; right: 0; top: 0; bottom: 0; width: 380px; background: var(--ls-cream); box-shadow: -10px 0 30px rgba(0,0,0,0.1); z-index: 400; transform: translateX(100%); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); display: flex; flex-direction: column; border-left:1px solid var(--ls-border); }
.lst-sidebar.open { transform: translateX(0); }
.lst-sb-header { padding: 24px; background: var(--ls-ink); color: white; display: flex; justify-content: space-between; align-items: center; }
.lst-sb-content { padding: 24px; flex: 1; overflow-y: auto; }
.lst-sb-footer { padding: 24px; background: white; border-top: 1px solid var(--ls-border); }
.lst-plan-item { background: white; border: 1px solid var(--ls-border); border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--ls-shadow-sm); }
.lst-plan-item h4 { margin: 0 0 4px 0; font-size: 14px; }
.lst-plan-item p { margin: 0; font-size: 12px; color: var(--ls-muted); }
.lst-remove-btn { background: none; border: none; color: #E74C3C; cursor: pointer; font-size: 18px; padding: 4px; }

/* --- REAL-TIME LIVE MODE --- */
.lst-live-mode { position: fixed; inset: 0; background: var(--ls-ink); color: white; z-index: 1000; display: flex; flex-direction: column; overflow-y: auto; }
.lst-live-top { padding: 24px 40px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; }
.lst-live-body { flex: 1; display: flex; padding: 40px; gap: 60px; max-width: 1400px; margin: 0 auto; width: 100%; }
.lst-live-timer-section { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; background: rgba(255,255,255,0.03); border-radius: 24px; padding: 40px; }
.lst-live-timer-display { font-size: 120px; font-family: 'Fraunces', serif; font-weight: 700; color: var(--ls-amber); line-height: 1; font-variant-numeric: tabular-nums; }
.lst-live-steps { flex: 1.5; overflow-y: auto; padding-right: 20px; }
.lst-live-step-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 16px; font-size: 18px; line-height: 1.6; }
.lst-live-step-card.say { border-left: 6px solid #5B9EBF; }
.lst-live-step-card.do { border-left: 6px solid var(--ls-amber); }
.lst-live-controls { display: flex; gap: 16px; margin-top: 32px; flex-wrap: wrap; justify-content:center; }

/* 📱 MOBILE OPTIMIZATIONS (Robust) */
@media (max-width: 768px) {
  .lst-topbar { padding: 0 20px; }
  .lst-hero { padding: 40px 20px 30px; }
  .lst-hero-inner { flex-direction: column; gap: 32px; }
  .lst-toolbar { padding: 16px 20px; }
  .lst-grid { padding: 0 20px 60px; margin-top: 24px; }
  
  .lst-expanded-grid { grid-template-columns: 1fr; gap: 20px; }
  .lst-card-header { flex-direction: column; gap: 16px; padding: 20px; }
  .lst-card-num { margin-bottom: 8px; }
  .lst-card-body { padding: 20px; }
  
  .lst-action-btn { width: 100%; justify-content: center; }
  .lst-card-actions { flex-direction: column; }
  
  .lst-sidebar { width: 100%; }
  
  .lst-live-body { flex-direction: column; gap: 20px; padding: 20px; }
  .lst-live-timer-display { font-size: 80px; }
  .lst-live-top { padding: 16px 20px; flex-direction: column; gap: 16px; text-align: center; }
  .lst-live-steps { padding-right: 0; }
  
  .lst-modal { max-width: 95%; padding: 24px; }
}

/* Print styles */
@media print {
  .no-print { display: none !important; }
  .lst-page { background: white !important; }
  .lst-card { box-shadow:none; border:1px solid #ccc; break-inside: avoid; }
}
`;

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────
function Step({ s }) {
  const labels = { say: "Say", do: "Do", tip: "Tip", pause: "Pause" };
  return (
    <div className={`lst-step ${s.type}`}>
      <span className="lst-step-label">{labels[s.type] || "Step"}</span>
      <span className="lst-step-text">{s.text}</span>
    </div>
  );
}

function SessionLoggerModal({ activity, onClose, onSave }) {
  const [rating, setRating] = useState(null);
  const [notes, setNotes] = useState('');

  return (
    <div className="lst-modal-overlay" onClick={onClose}>
      <div className="lst-modal" onClick={e => e.stopPropagation()}>
        <h2>Log Session: {activity.title}</h2>
        <p>Record how this activity landed with your students to improve future sessions.</p>
        
        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Class Engagement Level</div>
        <div className="lst-rating-group">
          {['Low', 'Medium', 'High'].map(r => (
            <button key={r} className={`lst-rate-btn ${rating === r ? 'active' : ''}`} onClick={() => setRating(r)}>
              {r === 'Low' ? '📉' : r === 'Medium' ? '⚖️' : '🔥'} {r}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Counsellor Notes & Tweaks</div>
        <textarea 
          className="lst-input" 
          placeholder="e.g., The students struggled with the second prompt. Next time, I will provide an example first..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button className="lst-action-btn secondary" onClick={onClose}>Cancel</button>
          <button className="lst-action-btn primary" onClick={() => { onSave(activity.id, {rating, notes}); onClose(); }}>Save Log</button>
        </div>
      </div>
    </div>
  );
}

function DashboardModal({ onClose, activities }) {
  const topRated = [...activities].sort((a,b) => (b.rating || 0) - (a.rating || 0)).slice(0,3);
  const mostUsed = [...activities].sort((a,b) => (b.usedBy || 0) - (a.usedBy || 0)).slice(0,3);

  return (
    <div className="lst-modal-overlay" onClick={onClose}>
      <div className="lst-modal" onClick={e => e.stopPropagation()} style={{maxWidth: '800px'}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '24px'}}>
          <h2 style={{margin:0}}>📊 Counsellor Intelligence</h2>
          <button onClick={onClose} style={{background:'none', border:'none', fontSize:'24px', cursor:'pointer'}}>×</button>
        </div>
        
        <div className="lst-expanded-grid" style={{gap:'24px'}}>
          <div style={{background:'var(--ls-sand)', padding:'24px', borderRadius:'16px'}}>
            <h4 style={{margin:'0 0 16px 0', color:'var(--ls-forest)'}}>🔥 Top Rated Activities</h4>
            {topRated.map(a => (
              <div key={a.id} style={{background:'white', padding:'12px', borderRadius:'8px', marginBottom:'8px', display:'flex', justifyContent:'space-between'}}>
                <span style={{fontWeight:600, fontSize:'14px'}}>{a.title}</span>
                <span style={{color:'#F1C40F', fontWeight:700}}>★ {a.rating}</span>
              </div>
            ))}
          </div>
          <div style={{background:'var(--ls-sage-pale)', padding:'24px', borderRadius:'16px'}}>
            <h4 style={{margin:'0 0 16px 0', color:'var(--ls-sage)'}}>📈 Most Used</h4>
            {mostUsed.map(a => (
              <div key={a.id} style={{background:'white', padding:'12px', borderRadius:'8px', marginBottom:'8px', display:'flex', justifyContent:'space-between'}}>
                <span style={{fontWeight:600, fontSize:'14px'}}>{a.title}</span>
                <span style={{color:'var(--ls-muted)', fontWeight:700}}>{a.usedBy}x</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{marginTop:'24px', fontSize:'13px', color:'var(--ls-muted)', textAlign:'center'}}>Data aggregated from your local session logs.</p>
      </div>
    </div>
  );
}

function LiveSessionMode({ activity, onClose }) {
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const phase = activity.phases[currentPhaseIdx];

  // Simple parser to extract max minutes
  useEffect(() => {
    if (phase && phase.time) {
      const match = phase.time.match(/(\d+)\s*min/i) || phase.time.match(/-(\d+)\s*min/i);
      let mins = 5; // fallback
      if (match && match[1]) {
        mins = parseInt(match[1], 10);
        const rangeMatch = phase.time.match(/(\d+)-(\d+)/);
        if (rangeMatch) mins = parseInt(rangeMatch[2], 10) - parseInt(rangeMatch[1], 10);
      }
      setTimeLeft(mins * 60);
      setIsRunning(false);
    }
  }, [currentPhaseIdx, phase]);

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!activity || !phase) return null;

  return (
    <div className="lst-live-mode">
      <div className="lst-live-top">
        <div>
          <div style={{fontSize:'12px', textTransform:'uppercase', letterSpacing:'1px', color:'var(--ls-amber)', marginBottom:'4px', fontWeight:700}}>🔴 Live Session Mode</div>
          <div style={{fontSize:'24px', fontFamily:"'Fraunces', serif", fontWeight:700}}>{activity.title}</div>
        </div>
        <button className="lst-action-btn secondary" onClick={onClose} style={{background:'rgba(255,255,255,0.1)', color:'white', border:'none'}}>End Session ✕</button>
      </div>

      <div className="lst-live-body">
        <div className="lst-live-timer-section">
          <h3 style={{margin:'0 0 16px 0', fontSize:'24px', fontWeight:300, color:'rgba(255,255,255,0.7)'}}>Phase {currentPhaseIdx + 1}: {phase.phase}</h3>
          <div className="lst-live-timer-display">{formatTime(timeLeft)}</div>
          
          <div className="lst-live-controls">
            <button className="lst-action-btn primary" style={{fontSize:'16px', padding:'16px 32px'}} onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? '⏸ Pause Timer' : '▶ Start Timer'}
            </button>
          </div>

          <div style={{display:'flex', gap:'12px', marginTop:'40px', width:'100%', flexWrap: 'wrap'}}>
            <button 
              className="lst-action-btn secondary" 
              style={{flex:1, minWidth:'150px', background:'rgba(255,255,255,0.05)', color:'white', border:'1px solid rgba(255,255,255,0.2)'}}
              disabled={currentPhaseIdx === 0}
              onClick={() => setCurrentPhaseIdx(prev => prev - 1)}
            >← Previous Phase</button>
            <button 
              className="lst-action-btn secondary" 
              style={{flex:1, minWidth:'150px', background:'rgba(255,255,255,0.05)', color:'white', border:'1px solid rgba(255,255,255,0.2)'}}
              disabled={currentPhaseIdx === activity.phases.length - 1}
              onClick={() => setCurrentPhaseIdx(prev => prev + 1)}
            >Next Phase →</button>
          </div>
        </div>

        <div className="lst-live-steps">
          <h3 style={{margin:'0 0 24px 0', fontSize:'20px', borderBottom:'1px solid rgba(255,255,255,0.1)', paddingBottom:'16px'}}>Instructions</h3>
          {phase.steps.map((s, si) => (
            <div key={si} className={`lst-live-step-card ${s.type}`}>
              <div style={{fontSize:'11px', fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px', color: s.type === 'say' ? '#5B9EBF' : 'var(--ls-amber)'}}>
                {s.type === 'say' ? '🗣️ Say to Class' : '🛠️ Facilitator Action'}
              </div>
              <div style={{color: s.type==='say'?'white':'rgba(255,255,255,0.8)'}}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CONSTANTS & DATA ─────────────────────────────────────────────────────────
const ALL_THEMES = [
  "All", 
  "Self-awareness", 
  "Empathy", 
  "Critical thinking", 
  "Creative thinking", 
  "Decision making", 
  "Coping with emotions", 
  "Coping with stress", 
  "Effective communication", 
  "Interpersonal relationships", 
  "Problem solving"
];

// Complete array of activities
const ACTIVITIES = [
  // ──────────────────────── LOWER SECONDARY (Grade 5-7) ────────────────────────
  {
    id: "l_sa_1", 
    title: "The Feelings Iceberg", 
    themeShort: ["Self-awareness", "Coping with emotions"], 
    grade: "5–7", gradeKey: "lower", duration: "35 min", 
    formats: ["Individual", "Pairs", "Full class"], 
    color: "#7C6FA0", colorPale: "#F0EDF8", 
    imagePath: "/resources/lifeskills/thefeelingsiceberg/thefeelingsiceberg.jpg",
    guidePdf: "/resources/lifeskills/thefeelingsiceberg/THE FEELINGS ICEBERG_ Exploring Our Emotions (Grade 5–7).pdf",
    worksheetPdf: "/resources/lifeskills/thefeelingsiceberg/The Feelings Iceberg Worksheet.pdf",
    energyLevel: "Low", complexity: "Moderate", rating: 4.8, usedBy: 342,
    bestUsedWhen: "Students are exhibiting unexplained anger or classroom conflicts are rising over 'small' things.",
    studentOutcomes: ["Identify the physiological markers of primary emotions.", "Distinguish between reactive anger and vulnerable sadness.", "Articulate hidden feelings safely to a peer."],
    proTip: "If students write 'nothing' below the waterline, do not force them. Suggest they draw a question mark. It takes time to build the vocabulary.",
    whyItWorks: "This activity works because it externalizes emotions, reducing shame and improving emotional vocabulary by separating the reactive behavior from the vulnerable root cause.",
    tags: ["ADHD-friendly", "Visual Learners", "Introvert-friendly"],
    nextSession: "l_em_1", // Suggest empathy next
    objective: "Students will distinguish between surface emotions (what others see) and underlying feelings (what's really happening inside), mapping their own emotional landscape.", 
    materials: ["Whiteboard & marker", "Iceberg worksheet", "Coloured pencils"],
    phases: [
      { time: "0–5 min", phase: "Hook", steps: [ { type: "say", text: "Think about the last time you got really angry. Picture it. What did the other person actually SEE? What did your anger look like from the outside?" }, { type: "do", text: "Take 3-4 answers. Write them on the board: went quiet, shouted, face went red, slammed door." }, { type: "say", text: "Interesting. Now here is my question: was anger the ONLY thing you were feeling? Or was something else going on underneath?" }, { type: "tip", text: "Keep this light and curious. Do not push for specific answers yet—just plant the question." } ] },
      { time: "5–12 min", phase: "Concept Introduction", steps: [ { type: "do", text: "Draw a simple iceberg on the board: a small tip above a wavy line, a large mass below. Label the tip 'What people SEE' and below the line 'What is REALLY happening.'" }, { type: "say", text: "An iceberg has a tiny visible tip and a massive hidden section. Our emotions work exactly the same way." }, { type: "say", text: "What might be hiding under anger? Build a word cloud below the waterline as students call out: fear, embarrassment, loneliness, feeling unheard." } ] },
      { time: "12–22 min", phase: "Individual Reflection", steps: [ { type: "do", text: "Distribute iceberg worksheets." }, { type: "say", text: "Think of one recent moment where you felt a strong emotion. Write what you SHOWED in the tip. Then go below the waterline and write what was ACTUALLY happening inside. Be honest—this is just for you." } ] },
      { time: "22–30 min", phase: "Pair Activity", steps: [ { type: "say", text: "Pair up. Share ONLY your above-waterline with your partner. Do not tell them what is below the line yet." }, { type: "say", text: "Your partner's job is to GUESS what might be below your waterline. Then tell them how close they were." }, { type: "do", text: "Give pairs 5 minutes. Each person shares once." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "say", text: "Let us come back together. I have a few questions for the whole group." } ] }
    ],
    debrief: [ { q: "Was it easy or difficult to look below your waterline? What made it difficult?", note: "Listen for: 'I didn't know what the feeling was'. Validate this." }, { q: "Has someone ever responded to just your tip and completely missed what was really going on?", note: "This is usually the question that creates the most resonance." } ],
    watchOutFor: [ "A student who discloses something serious during the writing. Have your referral process ready." ],
    variations: [ { tag: "Grade 5", text: "Use a provided emotion word bank rather than asking students to generate words." } ]
  },
  {
    id: "l_sa_2", title: "My Strengths Shield", themeShort: ["Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Art activity", "Pairs"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Easy", rating: 4.6, usedBy: 289,
    bestUsedWhen: "Post-exams or during periods of low class morale and high self-criticism.",
    whyItWorks: "Art-based reflection bypasses the analytical brain, allowing students who struggle with verbal expression to communicate complex self-concepts.",
    tags: ["Low verbal ability", "Art-focused"],
    studentOutcomes: ["Differentiate between 'skills' (doing) and 'character strengths' (being).", "Accept a compliment from a peer gracefully.", "Identify one personal area for growth without shame."],
    objective: "Students will identify their core character strengths and create a visual shield to build self-esteem.", materials: ["Blank shield templates", "Coloured markers"],
    phases: [
      { time: "0–10 min", phase: "What is a Strength?", steps: [ { type: "say", text: "Character strengths are who you ARE, not just what you DO." }, { type: "do", text: "Write examples on the board: Kindness, Bravery, Humor, Curiosity." } ] },
      { time: "10–25 min", phase: "Designing", steps: [ { type: "do", text: "Hand out blank shield templates." }, { type: "say", text: "Draw: 1. Your greatest strength, 2. A strength others see in you, 3. A time you helped someone." } ] },
      { time: "25–35 min", phase: "Sharing", steps: [ { type: "do", text: "Have students pair up." }, { type: "say", text: "Partners, listen and say: 'I can see that strength in you because...'" } ] }
    ],
    debrief: [ { q: "Was it hard to choose a strength?", note: "Normalise focusing on weaknesses." } ]
  },
  {
    id: "l_sa_3", title: "The Mirror Game", themeShort: ["Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs", "Physical"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.9, usedBy: 412,
    materials: [], // Empty array enables Material-Free mode
    bestUsedWhen: "Students are sluggish (e.g., first period or directly after lunch) and need a physical reset.",
    whyItWorks: "Physical embodiment of emotion creates a somatic link, proving to students that changing posture literally alters brain chemistry.",
    tags: ["ADHD-friendly", "Kinesthetic"],
    objective: "Recognize how physical posture reflects and influences internal emotional states.",
    phases: [
      { time: "0–15 min", phase: "The Setup", steps: [ { type: "do", text: "Ask students to stand and face their partner. Mirror perfectly." } ] },
      { time: "15–25 min", phase: "Emotional Mirror", steps: [ { type: "say", text: "Mirror an emotion without using words. Let your partner guess." } ] },
      { time: "25–30 min", phase: "Debrief", steps: [ { type: "say", text: "Did your face and breathing change when mirroring anger?" } ] }
    ],
    debrief: [ { q: "Can changing your posture change your mood?", note: "Introduce the idea of 'power posing'." } ]
  },
  {
    id: "l_sa_4", title: "The Values Auction", themeShort: ["Self-awareness", "Decision making"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Full class game"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Moderate", rating: 4.7, usedBy: 215,
    objective: "Students will identify their personal values by deciding how to 'spend' limited resources in a simulated auction.", materials: ["Fake money"],
    phases: [
      { time: "0–10 min", phase: "The Bank", steps: [ { type: "say", text: "Everyone has $1000 in their bank. I am going to auction off some items." } ] },
      { time: "10–25 min", phase: "The Auction", steps: [ { type: "do", text: "Run the auction. Be a lively auctioneer." } ] },
      { time: "25–35 min", phase: "Reflection", steps: [ { type: "say", text: "Look at what you bought. That item represents what you value most." } ] }
    ],
    debrief: [ { q: "Did you get caught up in bidding just to beat someone else?", note: "Great self-awareness moment about competitiveness." } ]
  },
  {
    id: "l_sa_5", title: "The 'I Am' Poem", themeShort: ["Self-awareness", "Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Individual"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Easy", rating: 4.5, usedBy: 180,
    objective: "Use a structured poetic template to explore hidden traits, fears, and hopes.", materials: ["Poem templates"],
    phases: [
      { time: "0–10 min", phase: "Template", steps: [ { type: "do", text: "Write structure: I am... I wonder... I hear... I want... I pretend... I cry..." } ] },
      { time: "10–25 min", phase: "Writing", steps: [ { type: "do", text: "15 minutes of silent writing." } ] }
    ],
    debrief: [ { q: "Which line was the hardest to write?", note: "Usually 'I pretend' or 'I cry'." } ]
  },
  {
    id: "l_em_1", title: "The Empathy Glasses", themeShort: ["Empathy"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.9, usedBy: 512,
    objective: "Practice viewing a common school conflict from multiple perspectives.", materials: ["Scenario cards", "Prop glasses"],
    phases: [
      { time: "0–10 min", phase: "Concept", steps: [ { type: "say", text: "Empathy means intentionally taking off our glasses and borrowing someone else's." } ] },
      { time: "10–25 min", phase: "Practice", steps: [ { type: "do", text: "Read conflict. Have groups argue both sides while wearing the glasses." } ] }
    ],
    debrief: [ { q: "Are both people right in their own minds?", note: "Perception is reality." } ]
  },
  {
    id: "l_em_2", title: "Walk a Mile — Persona Cards", themeShort: ["Empathy"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Pairs"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.7, usedBy: 290,
    objective: "Inhabit a perspective genuinely different from their own.", materials: ["Persona Cards"],
    phases: [
      { time: "0–8 min", phase: "In-Role Thinking", steps: [ { type: "do", text: "Distribute cards. Students answer questions AS that person." } ] },
      { time: "8–33 min", phase: "Conversation", steps: [ { type: "say", text: "Have a 5-minute conversation in role about a school policy." } ] }
    ],
    debrief: [ { q: "What was the hardest part?", note: "Usually slipping back to own self." } ]
  },
  {
    id: "l_em_3", title: "The Kindness Boomerang", themeShort: ["Empathy", "Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.8, usedBy: 605,
    objective: "Demonstrate how empathy creates a ripple effect.", materials: ["Ball of yarn"],
    phases: [
      { time: "0–10 min", phase: "The Web", steps: [ { type: "do", text: "Stand in circle. Throw yarn and share a compliment." } ] },
      { time: "10–20 min", phase: "The Drop", steps: [ { type: "say", text: "What happens if one person drops their string? The tension slackens." } ] }
    ],
    debrief: [ { q: "How does one negative action affect the whole group?", note: "Ripple effect." } ]
  },
  {
    id: "l_em_4", title: "The Silent Interviewer", themeShort: ["Empathy", "Effective communication"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.4, usedBy: 180,
    materials: [], // Material free
    objective: "Build empathy by focusing exclusively on non-verbal emotional cues.", 
    phases: [
      { time: "0–15 min", phase: "Interview", steps: [ { type: "say", text: "Interview your partner without speaking a single word. Use only body language." } ] },
      { time: "15–25 min", phase: "Switch", steps: [ { type: "do", text: "Switch roles." } ] }
    ],
    debrief: [ { q: "How did you know they were listening?", note: "Body language speaks volumes." } ]
  },
  {
    id: "l_em_5", title: "The Assumptions Game", themeShort: ["Empathy", "Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Full class"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.6, usedBy: 210,
    objective: "Recognize how quickly we make assumptions.", materials: ["Photos of strangers"],
    phases: [
      { time: "0–10 min", phase: "Snap Judgment", steps: [ { type: "do", text: "Show photo. Shout out assumptions about their job/life." } ] },
      { time: "10–20 min", phase: "Reveal", steps: [ { type: "do", text: "Reveal the truth. Repeat." } ] }
    ],
    debrief: [ { q: "Why did our brains guess wrong?", note: "Danger of snap judgments." } ]
  },
  {
    id: "l_ct_1", title: "Fact vs. Fiction Relay", themeShort: ["Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Teams"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.8, usedBy: 390,
    objective: "Distinguish between verifiable facts and subjective opinions under pressure.", materials: ["Whiteboard", "Pre-written statements"],
    phases: [
      { time: "0–20 min", phase: "Relay", steps: [ { type: "do", text: "Teams race to board to slap 'FACT' or 'OPINION' sign." } ] },
      { time: "20–35 min", phase: "Tricky Ones", steps: [ { type: "do", text: "Introduce manipulative statements." } ] }
    ],
    debrief: [ { q: "Why is it dangerous to mistake opinion for fact?", note: "Rumors/Misinfo." } ]
  },
  {
    id: "l_ct_4", title: "Would You Rather? (Logic Edition)", themeShort: ["Critical thinking", "Decision making"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Moderate", rating: 4.8, usedBy: 315,
    materials: [], // Material free
    objective: "Defend a choice using logical reasons rather than 'just because'.",
    phases: [
      { time: "0–5 min", phase: "Rule", steps: [ { type: "say", text: "Choose a side, but you MUST provide a logical reason." } ] },
      { time: "5–20 min", phase: "Movement", steps: [ { type: "do", text: "Move to sides of room based on choice." } ] }
    ],
    debrief: [ { q: "Was it hard to separate feelings from logic?", note: "Core critical thinking." } ]
  },

  // ──────────────────────── MIDDLE SECONDARY (Grade 8-10) ────────────────────────
  {
    id: "m_sa_1", title: "The Core Values Audit", themeShort: ["Self-awareness", "Decision making"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual", "Pairs"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.8, usedBy: 842,
    objective: "Narrow down a list of values to top 3 core foundations.", materials: ["List of 50 Values"],
    phases: [
      { time: "0–20 min", phase: "Selection", steps: [ { type: "do", text: "Select top 10, then brutally cut to 3." } ] },
      { time: "20–35 min", phase: "Alignment", steps: [ { type: "say", text: "Think of a bad decision. Did it violate one of these 3?" } ] }
    ],
    debrief: [ { q: "Was it hard to eliminate 'Success' to keep 'Integrity'?", note: "Discuss definitions of success." } ]
  },
  {
    id: "m_sa_2", title: "The Identity Mask", themeShort: ["Self-awareness", "Coping with emotions"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Art activity"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Advanced", rating: 4.9, usedBy: 620,
    objective: "Explore public persona vs private reality.", materials: ["Mask templates", "Markers"],
    phases: [
      { time: "0–25 min", phase: "Front and Back", steps: [ { type: "do", text: "Front = School persona. Inside = True feelings." } ] }
    ],
    debrief: [ { q: "Is wearing that front mask exhausting?", note: "Burnout awareness." } ]
  },
  {
    id: "m_em_1", title: "The Echo Chamber", themeShort: ["Empathy", "Critical thinking"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Small groups"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Advanced", rating: 4.7, usedBy: 512,
    objective: "Understand algorithmic bias and practice 'steel-manning' opposing views.", materials: ["Controversial topics"],
    phases: [
      { time: "10–25 min", phase: "Steel-manning", steps: [ { type: "say", text: "Make the strongest logical argument for the OTHER side." } ] }
    ],
    debrief: [ { q: "Does understanding equal agreement?", note: "No. Empathy is not agreement." } ]
  },
  {
    id: "m_cs_1", title: "The Reverse Calendar", themeShort: ["Coping with stress", "Decision making"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Individual", "Pairs"], color: "#27AE60", colorPale: "#D5F5E3", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.8, usedBy: 950,
    objective: "Apply backward planning to significantly reduce deadline panic.", materials: ["Blank Calendars"],
    phases: [
      { time: "10–25 min", phase: "Mapping", steps: [ { type: "do", text: "Write end date. Map back to 1 month, 1 week, and tomorrow." } ] }
    ],
    debrief: [ { q: "Is your first step actually doable in 15 mins?", note: "Micro-habits." } ]
  },

  // ──────────────────────── SENIOR SECONDARY (Grade 11-12) ────────────────────────
  {
    id: "s_sa_1", title: "The Future Self Letter", themeShort: ["Self-awareness", "Coping with stress"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.9, usedBy: 1120,
    whyItWorks: "Temporal distancing tricks the brain into viewing current crises as solvable past events, instantly lowering cortisol.",
    objective: "Engage in temporal distancing by writing a letter from future self to reduce anxiety.", materials: ["Envelopes", "Lined paper"],
    phases: [
      { time: "10–25 min", phase: "Writing", steps: [ { type: "say", text: "Imagine you are 25. You survived exams. Write to your 17-yr-old self." } ] },
      { time: "25–35 min", phase: "Sealing", steps: [ { type: "do", text: "Seal envelopes. Open before finals." } ] }
    ],
    debrief: [ { q: "What was the most compassionate thing your future self said?", note: "Self-compassion." } ]
  },
  {
    id: "s_dm_1", title: "Regret Minimization Framework", themeShort: ["Decision making"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.8, usedBy: 870,
    objective: "Project forward to age 80 to gain perspective on a high-stakes choice.", materials: ["Worksheet"],
    phases: [
      { time: "10–25 min", phase: "Writing", steps: [ { type: "say", text: "At 80, will I regret NOT doing this? Write from 80-yr-old view." } ] }
    ],
    debrief: [ { q: "Did this shift your leaning to the braver choice?", note: "De-risks short-term failure." } ]
  },
  {
    id: "s_ce_1", title: "Cognitive Distortion Trap", themeShort: ["Coping with emotions", "Critical thinking"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Pairs"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.9, usedBy: 1040,
    objective: "Identify catastrophizing and all-or-nothing thinking to dispute negative self-talk.", materials: ["Distortion cheat sheets"],
    phases: [
      { time: "10–25 min", phase: "Labeling", steps: [ { type: "do", text: "Identify distortions in example statements." } ] },
      { time: "25–40 min", phase: "Dispute", steps: [ { type: "say", text: "Write your negative thought. Label it. Write the factual dispute." } ] }
    ],
    debrief: [ { q: "Why is it powerful to give the thought a label?", note: "Creates distance." } ]
  }
];

// ─── PRINT VIEW (Facilitator Guide + Worksheet) ───────────────────────────────
function PrintView({ activity, mode, onClose }) {
  useEffect(() => { if (activity) setTimeout(() => window.print(), 400); }, [activity]);

  if (!activity) return null;

  if (mode === "guide") return (
    <div className={`lst-print-overlay ${activity ? 'visible' : ''}`}>
      <div className="lst-print-overlay-topbar no-print">
        <h3>Facilitator Guide — {activity.title}</h3>
        <div className="lst-print-overlay-actions">
          <button className="lst-po-btn print" onClick={() => window.print()}>Print / Save PDF</button>
          <button className="lst-po-btn close" onClick={onClose}>Close</button>
        </div>
      </div>
      <div className="lst-print-doc">
        <div className="lstp-header">
          <h1>{activity.title}</h1>
          <div className="lstp-header-meta">
            <span>{activity.themeShort.join(" & ")}</span>
            <span>Grade {activity.grade}</span>
            <span>{activity.duration}</span>
            <span>{activity.formats.join(" | ")}</span>
          </div>
        </div>

        <div className="lstp-section-h">Learning Objective</div>
        <div className="lstp-objective-box">{activity.objective}</div>

        {activity.proTip && (
          <div className="lstp-objective-box" style={{background:'#FFFBEA', borderLeftColor:'#F1C40F'}}>
            <strong>💡 Pro Tip:</strong> {activity.proTip}
          </div>
        )}

        <div className="lstp-section-h">Materials Needed</div>
        <div className="lstp-materials-list">
          {activity.materials && activity.materials.map((m, i) => <span key={i} className="lstp-material">{m}</span>)}
        </div>

        <div className="lstp-section-h">Facilitation Guide</div>
        {activity.phases.map((phase, pi) => (
          <div key={pi} className="lstp-phase-block">
            <div className="lstp-phase-title">
              <span className="lstp-phase-time">{phase.time}</span>
              <span className="lstp-phase-name">{phase.phase}</span>
            </div>
            {phase.steps.map((s, si) => <PrintStep key={si} s={s} />)}
          </div>
        ))}

        <div className="lstp-section-h">Debrief Questions</div>
        {activity.debrief.map((d, i) => (
          <div key={i} className="lstp-debrief-item">
            <div className="lstp-debrief-q">Q{i + 1}: {d.q}</div>
            <div className="lstp-debrief-note">Facilitator Note: {d.note}</div>
          </div>
        ))}

        {activity.watchOutFor && (
          <>
            <div className="lstp-section-h">Watch Out For</div>
            {activity.watchOutFor.map((w, i) => <div key={i} className="lstp-watch">{w}</div>)}
          </>
        )}

        <div className="lstp-footer">
          SecretSharz Life Skills Resource Library · Grade {activity.grade}
        </div>
      </div>
    </div>
  );

  if (mode === "worksheet") return (
    <div className={`lst-print-overlay ${activity ? 'visible' : ''}`}>
      <div className="lst-print-overlay-topbar no-print">
        <h3>Student Worksheet — {activity.title}</h3>
        <div className="lst-print-overlay-actions">
          <button className="lst-po-btn print" onClick={() => window.print()}>Print / Save PDF</button>
          <button className="lst-po-btn close" onClick={onClose}>Close</button>
        </div>
      </div>
      <div className="lst-print-doc">
        <div className="lstw-header">
          <h1>{activity.worksheet ? activity.worksheet.title : activity.title}</h1>
          <p>Life Skills Worksheet · Grade {activity.grade} · {activity.themeShort.join(" & ")}</p>
        </div>
        <div className="lstw-name-row">
          <div className="lstw-name-field">Name: _____________________________</div>
          <div className="lstw-name-field">Class: __________</div>
          <div className="lstw-name-field">Date: __________</div>
        </div>
        {activity.worksheet && <p style={{ fontSize: "13px", color: "#7A8A7D", marginBottom: "20px", fontStyle: "italic" }}>{activity.worksheet.intro}</p>}

        {activity.worksheet && activity.worksheet.sections.map((sec, si) => (
          <div key={si} className="lstw-section">
            <div className="lstw-section-title">{sec.title}</div>
            {sec.prompts.map((p, pi) => (
              <div key={pi} className="lstw-prompt-block" style={{ marginBottom: "12px" }}>
                {p.label && <div className="lstw-prompt">{p.label}</div>}
                {p.lines > 0 && Array.from({ length: p.lines }).map((_, li) => <div key={li} className="lstw-line" />)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return null;
}

// ─── ACTIVITY CARD ────────────────────────────────────────────────────────────
function ActivityCard({ activity, displayNumber, isExpanded, onToggle, onLogSession, onAddToSession, onStartLive, allActivities }) {
  const [isSaved, setIsSaved] = useState(false);

  // Recommendation Engine: Find opposite energy in same grade
  const recommendedNext = useMemo(() => {
    if (!activity) return null;
    return allActivities.find(a => 
      a.gradeKey === activity.gradeKey && 
      a.id !== activity.id && 
      a.energyLevel !== activity.energyLevel
    );
  }, [activity, allActivities]);

  return (
    <div className={`lst-card ${isExpanded ? "expanded" : ""}`}>
      <div className="lst-card-accent" style={{ background: activity.color }} />
      <div className="lst-card-header" onClick={onToggle}>
        <div className="lst-card-num">{displayNumber}</div>
        <div className="lst-card-meta-block">
          <div className="lst-card-title">
            {activity.title}
            <button 
              className={`lst-bookmark-btn ${isSaved ? 'saved' : ''} no-print`} 
              onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
              data-tooltip="Save Activity"
            >
              {isSaved ? '★' : '☆'}
            </button>
          </div>
          
          <div className="lst-analytics-row no-print">
            {activity.rating && (
              <span className="lst-stat-item" data-tooltip="Average student engagement"><span className="lst-stat-star">★</span> {activity.rating}</span>
            )}
            {activity.usedBy && (
              <span className="lst-stat-item" data-tooltip="Click Dashboard for details">👥 Used {activity.usedBy} times</span>
            )}
          </div>

          <div className="lst-card-badges">
            {activity.themeShort.map(t => <span key={t} className="lst-badge lst-badge-theme">{t}</span>)}
            <span className="lst-badge" style={{background:'#f0f0f0'}}>Grade {activity.grade}</span>
            <span className="lst-badge" style={{background:'#f0f0f0'}}>{activity.duration}</span>
            {activity.energyLevel && <span className="lst-badge lst-badge-energy">⚡ {activity.energyLevel} Energy</span>}
            {activity.materials && activity.materials.length === 0 && <span className="lst-badge" style={{background:'#27AE60', color:'white'}}>No Prep</span>}
            {activity.tags && activity.tags.map(tag => <span key={tag} className="lst-badge lst-badge-tag">{tag}</span>)}
          </div>
          <div className="lst-card-obj">{activity.objective}</div>
        </div>
      </div>
      {isExpanded && (
        <div className="lst-card-body">
          <div className="lst-expanded-grid">
            <div className="lst-card-main-content">
              
              <details className="lst-accordion" open>
                <summary>Step-by-Step Phases</summary>
                <div className="lst-accordion-content">
                  {activity.phases.map((p, i) => (
                    <div key={i} className="lst-phase">
                      <div className="lst-phase-header"><span>{p.phase}</span><span className="lst-phase-time" style={{background:activity.color}}>{p.time}</span></div>
                      {p.steps.map((s, si) => <Step key={si} s={s} />)}
                    </div>
                  ))}
                </div>
              </details>

              <details className="lst-accordion">
                <summary>Debrief Questions</summary>
                <div className="lst-accordion-content">
                  {activity.debrief.map((d, i) => (
                    <div key={i} style={{marginBottom:'12px'}}>
                      <div style={{fontWeight:700, color:'var(--ls-ink)'}}>Q{i + 1}: {d.q}</div>
                      <div style={{fontSize:'13px', color:'var(--ls-muted)'}}>Note: {d.note}</div>
                    </div>
                  ))}
                </div>
              </details>

            </div>
            
            <div className="lst-card-sidebar">
              <button className="lst-action-btn live" style={{width:'100%', marginBottom:'16px'}} onClick={() => onStartLive(activity)}>
                🎬 Start Live Session Mode
              </button>
              
              <div className="lst-sidebar-box">
                <div className="lst-sb-title">🛠️ Materials</div>
                {activity.materials && activity.materials.length > 0 ? (
                  activity.materials.map((m, i) => <span key={i} className="lst-material-tag">{m}</span>)
                ) : (
                  <span className="lst-material-tag" style={{background:'#D5F5E3', color:'#27AE60'}}>None required</span>
                )}
              </div>

              {activity.whyItWorks && (
                <div className="lst-psych-box">
                  <strong>🧠 Why this works:</strong><br/>
                  {activity.whyItWorks}
                </div>
              )}

              {activity.proTip && (
                <div className="lst-protip">
                  <strong>💡 Pro Tip:</strong><br/>{activity.proTip}
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="lst-card-actions no-print">
            <button className="lst-action-btn primary" onClick={() => onAddToSession(activity)}>➕ Add to Session Plan</button>
            <button className="lst-action-btn secondary" onClick={() => onLogSession(activity)}>📝 Log Session Notes</button>
            
            {activity.guidePdf && (
              <a href={activity.guidePdf} target="_blank" rel="noreferrer" className="lst-action-btn secondary">📄 Facilitator Guide</a>
            )}
            {activity.worksheetPdf && (
              <a href={activity.worksheetPdf} target="_blank" rel="noreferrer" className="lst-action-btn secondary">🖨️ Student Handout</a>
            )}
          </div>

          {/* Recommendation Engine */}
          {recommendedNext && (
            <div style={{marginTop:'32px', background:'rgba(200,134,10,0.05)', border:'1px dashed rgba(200,134,10,0.3)', padding:'16px', borderRadius:'12px'}}>
              <div style={{fontSize:'11px', fontWeight:800, textTransform:'uppercase', color:'var(--ls-amber)', marginBottom:'4px'}}>Balance The Energy — Next Session Idea</div>
              <div style={{fontWeight:600, fontSize:'14px'}}>Try: {recommendedNext.title} ({recommendedNext.energyLevel} Energy)</div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const GRADE_TABS = [
  { key: "lower", label: "Lower Secondary", sub: "Grade 5–7" },
  { key: "middle", label: "Middle Secondary", sub: "Grade 8–10" },
  { key: "upper", label: "Senior Secondary", sub: "Grade 11–12" },
];

export default function LifeSkillsTrainer({ navigate, onBack }) {
  const [activeTab, setActiveTab] = useState("lower");
  const [searchQuery, setSearchQuery] = useState("");
  const [themeFilter, setThemeFilter] = useState("All");
  const [quickFilter, setQuickFilter] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  
  const [loggingActivity, setLoggingActivity] = useState(null);
  const [liveActivity, setLiveActivity] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  
  // Session Builder State
  const [sessionPlan, setSessionPlan] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const filtered = useMemo(() => {
    return ACTIVITIES.filter(a => {
      const matchTab = a.gradeKey === activeTab;
      const matchTheme = themeFilter === "All" || a.themeShort.includes(themeFilter);
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.objective.toLowerCase().includes(q);
      
      let matchQuick = true;
      if (quickFilter === "High Energy") matchQuick = a.energyLevel === "High";
      if (quickFilter === "No Prep") matchQuick = !a.materials || a.materials.length === 0;

      return matchTab && matchTheme && matchSearch && matchQuick;
    });
  }, [activeTab, themeFilter, searchQuery, quickFilter]);

  const addToSession = (activity) => {
    if (!sessionPlan.find(a => a.id === activity.id)) {
      setSessionPlan([...sessionPlan, activity]);
      setIsSidebarOpen(true);
    }
  };
  const removeFromSession = (id) => setSessionPlan(sessionPlan.filter(a => a.id !== id));

  return (
    <div className="lst-page">
      
      {/* Overlays */}
      {loggingActivity && <SessionLoggerModal activity={loggingActivity} onClose={() => setLoggingActivity(null)} onSave={() => {}} />}
      {showDashboard && <DashboardModal activities={ACTIVITIES} onClose={() => setShowDashboard(false)} />}
      {liveActivity && <LiveSessionMode activity={liveActivity} onClose={() => setLiveActivity(null)} />}

      {/* Session Planner Sidebar */}
      <div className={`lst-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="lst-sb-header">
          <h3 style={{margin:0}}>📋 My Session Plan</h3>
          <button onClick={() => setIsSidebarOpen(false)} style={{background:'none', border:'none', color:'white', fontSize:'20px', cursor:'pointer'}}>×</button>
        </div>
        <div className="lst-sb-content">
          {sessionPlan.length === 0 ? (
            <div style={{textAlign:'center', color:'var(--ls-muted)', marginTop:'40px'}}>
              <div>📭</div>
              <p>Your session plan is empty.<br/>Add activities to build your flow.</p>
            </div>
          ) : (
            sessionPlan.map((item, idx) => (
              <div key={item.id} className="lst-plan-item">
                <div>
                  <div style={{fontSize:'10px', fontWeight:800, color:'var(--ls-amber)'}}>STEP {idx+1}</div>
                  <h4>{item.title}</h4>
                  <p>{item.duration} · {item.energyLevel} Energy</p>
                </div>
                <button className="lst-remove-btn" onClick={() => removeFromSession(item.id)}>×</button>
              </div>
            ))
          )}
        </div>
        <div className="lst-sb-footer">
           <button 
             className="lst-action-btn primary" 
             style={{width:'100%'}} 
             disabled={sessionPlan.length===0}
             onClick={() => { setLiveActivity(sessionPlan[0]); setIsSidebarOpen(false); }}
           >
             ▶ Start Planned Session
           </button>
        </div>
      </div>

      <div className="lst-topbar">
        <button className="lst-back" onClick={onBack}>← Back</button>
        <div className="lst-topbar-title">Life Skills Trainer</div>
        <div className="lst-topbar-actions">
          <button className="lst-dash-btn" onClick={() => setShowDashboard(true)}>📊 Dashboard</button>
          <button className="lst-dash-btn" onClick={() => setIsSidebarOpen(true)}>📋 Plan ({sessionPlan.length})</button>
        </div>
      </div>
      
      <div className="lst-hero">
        <div className="lst-hero-blob lst-hero-blob-1" />
        <div className="lst-hero-inner">
          <div style={{ flex: 1, minWidth: "300px" }}>
            <div style={{fontSize:'12px', fontWeight:800, letterSpacing:'1px', textTransform:'uppercase', color:'var(--ls-amber)'}}>Productivity Suite</div>
            <h1 className="lst-hero-h1">Life Skills Activity Bank</h1>
            <p className="lst-hero-sub">The definitive curriculum for building resilience, emotional intelligence, and critical thinking. Plan sessions, present live, and track engagement.</p>
          </div>
          <div style={{display:'flex', gap:'16px', alignSelf:'center'}}>
             <div style={{background:'rgba(255,255,255,0.1)', padding:'20px', borderRadius:'16px', color:'white', textAlign:'center', minWidth:'100px'}}>
               <div style={{fontSize:'32px', fontFamily:"'Fraunces',serif", fontWeight:700, color:'var(--ls-amber)'}}>{ACTIVITIES.length}</div>
               <div style={{fontSize:'12px', opacity:0.8}}>Activities</div>
             </div>
          </div>
        </div>
      </div>

      <div className="lst-tabs-wrap">
        <div className="lst-tabs">
          {GRADE_TABS.map(t => (
            <button key={t.key} className={`lst-tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
              {t.label} <span className="lst-tab-sub">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="lst-toolbar">
        <div className="lst-toolbar-inner">
          <div className="lst-search-wrap">
            <span className="lst-search-icon">🔍</span>
            <input className="lst-search-input" placeholder="Search by topic, conflict, or keyword..." onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <div className="lst-quick-filters">
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ls-muted)'}}>SORT:</span>
            {["All", "High Energy", "No Prep"].map(qf => (
               <button key={qf} className={`lst-qf-btn ${quickFilter === qf ? 'active' : ''}`} onClick={() => setQuickFilter(qf)}>
                 {qf === "High Energy" ? "⚡ " : qf === "No Prep" ? "🚀 " : ""}{qf}
               </button>
            ))}
          </div>
        </div>
        <div className="lst-toolbar-inner" style={{ paddingTop: '12px', borderTop: '1px dashed var(--ls-border)' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ls-muted)' }}>WHO SKILL:</span>
          <div className="lst-filter-row" style={{ overflowX: 'auto', paddingBottom:'4px'}}>
            {ALL_THEMES.map(t => (
              <button key={t} className={`lst-chip ${themeFilter === t ? "active" : ""}`} onClick={() => setThemeFilter(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="lst-grid">
        {filtered.length === 0 ? (
           <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--ls-muted)" }}>
             <p style={{ fontSize: "18px", fontWeight: 700, color: 'var(--ls-ink)' }}>No activities found.</p>
             <button className="lst-action-btn secondary" style={{ margin: '24px auto 0' }} onClick={() => {setSearchQuery(''); setThemeFilter('All'); setQuickFilter('All');}}>Clear Filters</button>
           </div>
        ) : (
          filtered.map((activity, index) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              displayNumber={index + 1} 
              isExpanded={expandedId === activity.id} 
              onToggle={() => setExpandedId(expandedId === activity.id ? null : activity.id)}
              onLogSession={setLoggingActivity}
              onAddToSession={addToSession}
              onStartLive={setLiveActivity}
              allActivities={ACTIVITIES}
            />
          ))
        )}
      </div>
    </div>
  );
}
