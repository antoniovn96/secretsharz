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

  useEffect(() => {
    if (phase && phase.time) {
      const match = phase.time.match(/(\d+)\s*min/i) || phase.time.match(/-(\d+)\s*min/i);
      let mins = 5; 
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
  "All", "Self-awareness", "Empathy", "Critical thinking", "Creative thinking", 
  "Decision making", "Coping with emotions", "Coping with stress", 
  "Effective communication", "Interpersonal relationships", "Problem solving"
];

// Total 60 Activities
const ACTIVITIES = [
  // ── LOWER SECONDARY (Grade 5-7) ── (25 Activities)
  {
    id: "l_sa_1", title: "The Feelings Iceberg", themeShort: ["Self-awareness", "Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Individual", "Pairs", "Full class"], color: "#7C6FA0", colorPale: "#F0EDF8", 
    imagePath: "/resources/lifeskills/thefeelingsiceberg/thefeelingsiceberg.jpg",
    guidePdf: "/resources/lifeskills/thefeelingsiceberg/THE FEELINGS ICEBERG_ Exploring Our Emotions (Grade 5–7).pdf",
    worksheetPdf: "/resources/lifeskills/thefeelingsiceberg/The Feelings Iceberg Worksheet.pdf",
    energyLevel: "Low", complexity: "Moderate", rating: 4.8, usedBy: 342,
    bestUsedWhen: "Students are exhibiting unexplained anger or classroom conflicts are rising over 'small' things.",
    studentOutcomes: ["Identify physiological markers of emotions.", "Distinguish between reactive anger and vulnerable sadness.", "Articulate hidden feelings."],
    proTip: "If students write 'nothing' below the waterline, do not force them. Suggest they draw a question mark.",
    whyItWorks: "Externalizes emotions, reducing shame and improving emotional vocabulary by separating reactive behavior from the root cause.",
    tags: ["ADHD-friendly", "Visual Learners", "Introvert-friendly"],
    nextSession: "l_em_1",
    objective: "Students will distinguish between surface emotions and underlying feelings.", materials: ["Whiteboard", "Iceberg worksheet", "Coloured pencils"],
    phases: [
      { time: "0–5 min", phase: "Hook", steps: [ { type: "say", text: "Think of anger. What does it look like outside?" }, { type: "do", text: "Write answers on board." } ] },
      { time: "5–12 min", phase: "Concept Intro", steps: [ { type: "do", text: "Draw iceberg." }, { type: "say", text: "What might be hiding under anger?" } ] },
      { time: "12–22 min", phase: "Reflection", steps: [ { type: "do", text: "Distribute worksheets." }, { type: "say", text: "Write what you showed and what was actually happening inside." } ] },
      { time: "22–30 min", phase: "Pair Activity", steps: [ { type: "say", text: "Share ONLY above-waterline. Partner guesses below." } ] },
      { time: "30–35 min", phase: "Debrief", steps: [ { type: "say", text: "Let's come back together." } ] }
    ],
    debrief: [ { q: "Was it easy or difficult to look below your waterline?", note: "Validate difficulty." }, { q: "Has someone responded to just your tip?", note: "Creates resonance." } ],
    watchOutFor: [ "Student disclosing something serious. Have referral process ready." ]
  },{
    id: "l_sa_2", title: "My Strengths Shield", themeShort: ["Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Art activity", "Pairs"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    worksheetPdf: "/resources/lifeskills/strengthsshield/mystrengthshield.html",
    energyLevel: "Medium", complexity: "Easy", rating: 4.6, usedBy: 289,
    bestUsedWhen: "Post-exams or during periods of low class morale.",
    whyItWorks: "Art-based reflection bypasses the analytical brain, allowing expression without verbal pressure.",
    tags: ["Low verbal ability", "Art-focused"],
    studentOutcomes: ["Differentiate skills and character.", "Accept a compliment.", "Identify personal growth area."],
    objective: "Identify core character strengths.", materials: ["Blank shield templates", "Markers"],
    phases: [
      { time: "0–10 min", phase: "What is a Strength?", steps: [ { type: "say", text: "Strengths are who you ARE, not what you DO." } ] },
      { time: "10–25 min", phase: "Designing", steps: [ { type: "do", text: "Draw: 1. Greatest strength, 2. A strength others see in you." } ] },
      { time: "25–35 min", phase: "Sharing", steps: [ { type: "say", text: "Partners, listen and say: 'I can see that strength in you because...'" } ] }
    ],
    debrief: [ { q: "Was it hard to choose a strength?", note: "Normalise focusing on weaknesses." } ]
  },
  {
    id: "l_sa_3", title: "The Mirror Game", themeShort: ["Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs", "Physical"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.9, usedBy: 412, materials: [],
    bestUsedWhen: "Students are sluggish and need a physical reset.",
    whyItWorks: "Physical embodiment creates a somatic link to emotion.",
    tags: ["ADHD-friendly", "Kinesthetic"],
    objective: "Recognize how physical posture influences internal states.",
    phases: [
      { time: "0–15 min", phase: "The Setup", steps: [ { type: "do", text: "Stand and face partner. Mirror perfectly." } ] },
      { time: "15–25 min", phase: "Emotional Mirror", steps: [ { type: "say", text: "Mirror an emotion without words. Partner guesses." } ] }
    ],
    debrief: [ { q: "Can changing posture change mood?", note: "Introduce 'power posing'." } ]
  },
  {
    id: "l_sa_4", title: "The Values Auction", themeShort: ["Self-awareness", "Decision making"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Full class game"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Moderate", rating: 4.7, usedBy: 215,
    objective: "Identify personal values by 'spending' limited resources.", materials: ["Fake money"],
    phases: [
      { time: "0–10 min", phase: "The Bank", steps: [ { type: "say", text: "You have $1000. I am auctioning items like 'Perfect Grades'." } ] },
      { time: "10–25 min", phase: "The Auction", steps: [ { type: "do", text: "Run the auction." } ] },
      { time: "25–35 min", phase: "Reflection", steps: [ { type: "say", text: "What you bought represents what you value." } ] }
    ],
    debrief: [ { q: "Did you bid just to beat someone else?", note: "Self-awareness moment." } ]
  },
  {
    id: "l_sa_5", title: "The 'I Am' Poem", themeShort: ["Self-awareness", "Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Individual"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Easy", rating: 4.5, usedBy: 180,
    objective: "Explore hidden traits using a structured poetic template.", materials: ["Poem templates"],
    phases: [
      { time: "0–10 min", phase: "Template", steps: [ { type: "do", text: "Write structure: I am... I wonder... I hear... I want..." } ] },
      { time: "10–25 min", phase: "Writing", steps: [ { type: "do", text: "15 minutes of silent writing." } ] }
    ],
    debrief: [ { q: "Which line was hardest to write?", note: "Usually 'I pretend' or 'I cry'." } ]
  },
  {
    id: "l_em_1", title: "The Empathy Glasses", themeShort: ["Empathy"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.9, usedBy: 512,
    objective: "View a common conflict from multiple perspectives.", materials: ["Scenario cards", "Prop glasses"],
    phases: [
      { time: "0–10 min", phase: "Concept", steps: [ { type: "say", text: "Empathy means borrowing someone else's glasses." } ] },
      { time: "10–25 min", phase: "Practice", steps: [ { type: "do", text: "Groups argue both sides while wearing the glasses." } ] }
    ],
    debrief: [ { q: "Are both people right in their own minds?", note: "Perception is reality." } ]
  },
  {
    id: "l_em_2", title: "Walk a Mile — Persona Cards", themeShort: ["Empathy"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Pairs"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.7, usedBy: 290,
    objective: "Inhabit a perspective genuinely different from your own.", materials: ["Persona Cards"],
    phases: [
      { time: "0–8 min", phase: "In-Role Thinking", steps: [ { type: "do", text: "Students answer questions AS that person." } ] },
      { time: "8–33 min", phase: "Conversation", steps: [ { type: "say", text: "Have a 5-minute conversation in role." } ] }
    ],
    debrief: [ { q: "What was the hardest part?", note: "Slipping back to own self." } ]
  },
  {
    id: "l_em_3", title: "The Kindness Boomerang", themeShort: ["Empathy", "Interpersonal relationships"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.8, usedBy: 605,
    objective: "Demonstrate how empathy creates a ripple effect.", materials: ["Ball of yarn"],
    phases: [
      { time: "0–10 min", phase: "The Web", steps: [ { type: "do", text: "Throw yarn and share a compliment." } ] },
      { time: "10–20 min", phase: "The Drop", steps: [ { type: "say", text: "What happens if one person drops their string?" } ] }
    ],
    debrief: [ { q: "How does one negative action affect the whole group?", note: "Ripple effect." } ]
  },
  {
    id: "l_em_4", title: "The Silent Interviewer", themeShort: ["Empathy", "Effective communication"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.4, usedBy: 180, materials: [],
    objective: "Build empathy by focusing exclusively on non-verbal emotional cues.", 
    phases: [
      { time: "0–15 min", phase: "Interview", steps: [ { type: "say", text: "Interview partner without speaking a single word." } ] },
      { time: "15–25 min", phase: "Switch", steps: [ { type: "do", text: "Switch roles." } ] }
    ],
    debrief: [ { q: "How did you know they were listening?", note: "Body language speaks volumes." } ]
  },
  {
    id: "l_em_5", title: "The Assumptions Game", themeShort: ["Empathy", "Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Full class"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.6, usedBy: 210,
    objective: "Recognize how quickly we make assumptions.", materials: ["Photos of strangers"],
    phases: [
      { time: "0–10 min", phase: "Snap Judgment", steps: [ { type: "do", text: "Show photo. Shout out assumptions." } ] },
      { time: "10–20 min", phase: "Reveal", steps: [ { type: "do", text: "Reveal the truth. Repeat." } ] }
    ],
    debrief: [ { q: "Why did our brains guess wrong?", note: "Danger of snap judgments." } ]
  },
  {
    id: "l_ct_1", title: "Fact vs. Fiction Relay", themeShort: ["Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Teams"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.8, usedBy: 390,
    objective: "Distinguish between verifiable facts and subjective opinions under pressure.", materials: ["Pre-written statements"],
    phases: [
      { time: "0–20 min", phase: "Relay", steps: [ { type: "do", text: "Teams race to slap 'FACT' or 'OPINION' sign." } ] },
      { time: "20–35 min", phase: "Tricky Ones", steps: [ { type: "do", text: "Introduce manipulative statements." } ] }
    ],
    debrief: [ { q: "Why is it dangerous to mistake opinion for fact?", note: "Misinformation." } ]
  },
  {
    id: "l_ct_2", title: "The 'Why' Chain", themeShort: ["Critical thinking", "Problem solving"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.5, usedBy: 250,
    objective: "Ask 'why' repeatedly to strip away surface issues and find the root cause.", materials: ["Whiteboard"],
    phases: [
      { time: "0–10 min", phase: "The Toddler Strategy", steps: [ { type: "do", text: "Model asking why 5 times." } ] },
      { time: "10–20 min", phase: "Pair Practice", steps: [ { type: "do", text: "One person asks 'Why?' 5 consecutive times." } ] }
    ],
    debrief: [ { q: "How does finding the root cause change the solution?", note: "Fixing roots." } ]
  },
  {
    id: "l_ct_3", title: "The Fact-Checker", themeShort: ["Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Easy", rating: 4.6, usedBy: 210,
    objective: "Identify manipulative language in simple advertising and media.", materials: ["Printed advertisements", "Highlighters"],
    phases: [
      { time: "0–10 min", phase: "Setup", steps: [ { type: "say", text: "Advertisers use words to make you feel you NEED something." } ] },
      { time: "10–25 min", phase: "Audit", steps: [ { type: "do", text: "Highlight facts yellow, manipulative words pink." } ] }
    ],
    debrief: [ { q: "What happens if you remove all the pink words?", note: "Removes false excitement." } ]
  },
  {
    id: "l_ct_4", title: "Would You Rather? (Logic Edition)", themeShort: ["Critical thinking", "Decision making"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Moderate", rating: 4.8, usedBy: 315, materials: [],
    objective: "Defend a choice using logical reasons rather than 'just because'.",
    phases: [
      { time: "0–5 min", phase: "Rule", steps: [ { type: "say", text: "Choose a side, but you MUST provide a logical reason." } ] },
      { time: "5–20 min", phase: "Movement", steps: [ { type: "do", text: "Move to sides of room based on choice." } ] }
    ],
    debrief: [ { q: "Was it hard to separate feelings from logic?", note: "Core critical thinking." } ]
  },
  {
    id: "l_ct_5", title: "The Alien Anthropologist", themeShort: ["Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Pairs"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.5, usedBy: 160,
    objective: "Deconstruct everyday social norms by explaining them to an 'alien'.", materials: ["Common objects"],
    phases: [
      { time: "0–10 min", phase: "Persona", steps: [ { type: "say", text: "Imagine you are an alien who just landed." } ] },
      { time: "10–25 min", phase: "Explanation", steps: [ { type: "do", text: "Logically explain a human rule like 'Homework' without saying 'because we have to'." } ] }
    ],
    debrief: [ { q: "Did explaining the logic make the rule seem silly?", note: "Outdated habits." } ]
  },
  {
    id: "l_crt_1", title: "The Squiggle Challenge", themeShort: ["Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Individual"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Easy", rating: 4.8, usedBy: 450,
    objective: "Overcome the fear of a blank page through constraints.", materials: ["Paper with squiggles", "Pens"],
    phases: [
      { time: "0–5 min", phase: "Fear", steps: [ { type: "say", text: "Perfectionism is the enemy of creativity." } ] },
      { time: "5–15 min", phase: "Transformation", steps: [ { type: "do", text: "Turn random squiggle into recognizable drawing." } ] }
    ],
    debrief: [ { q: "Was it easier to draw starting with a squiggle?", note: "Constraints boost creativity." } ]
  },
  {
    id: "l_crt_2", title: "Brainstorming Bonanza", themeShort: ["Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Moderate", rating: 4.6, usedBy: 310,
    objective: "Separate idea generation from idea evaluation.", materials: ["Sticky notes"],
    phases: [
      { time: "0–10 min", phase: "Rule", steps: [ { type: "say", text: "No judgment allowed for 10 minutes." } ] },
      { time: "10–20 min", phase: "Storm", steps: [ { type: "do", text: "Write one wild idea per sticky note in total silence." } ] },
      { time: "20–30 min", phase: "Sort", steps: [ { type: "do", text: "Sort and evaluate." } ] }
    ],
    debrief: [ { q: "Did waiting to judge make it easier to share?", note: "Reduces fear of failure." } ]
  },
  {
    id: "l_crt_3", title: "The Alternate Uses Test", themeShort: ["Creative thinking", "Problem solving"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Easy", rating: 4.4, usedBy: 220,
    objective: "Practice divergent thinking to break functional fixedness.", materials: ["A paperclip"],
    phases: [
      { time: "0–5 min", phase: "Fixedness", steps: [ { type: "say", text: "We only think of a paperclip holding paper. Let's break that." } ] },
      { time: "5–15 min", phase: "Sprint", steps: [ { type: "do", text: "List non-traditional uses in 3 minutes." } ] }
    ],
    debrief: [ { q: "How does this apply to solving problems?", note: "Resourcefulness." } ]
  },
  {
    id: "l_crt_4", title: "The Finish the Story Game", themeShort: ["Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class circle"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Moderate", rating: 4.7, usedBy: 340, materials: [],
    objective: "Practice spontaneous creativity and collaborative storytelling.",
    phases: [
      { time: "0–5 min", phase: "Setup", steps: [ { type: "say", text: "Tell a story adding one sentence at a time." } ] },
      { time: "5–20 min", phase: "Story", steps: [ { type: "do", text: "Go around the circle." } ] }
    ],
    debrief: [ { q: "What happens when someone adds an unexpected twist?", note: "Forces adaptation." } ]
  },
  {
    id: "l_crt_5", title: "The 'Bad' Invention Pitch", themeShort: ["Creative thinking", "Effective communication"], grade: "5–7", gradeKey: "lower", duration: "40 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Advanced", rating: 4.9, usedBy: 280,
    objective: "Find creative ways to market and sell an objectively terrible invention.", materials: ["Whiteboard", "Markers"],
    phases: [
      { time: "0–10 min", phase: "Bad Ideas", steps: [ { type: "do", text: "Assign terrible inventions (e.g., a glass hammer)." } ] },
      { time: "10–25 min", phase: "Pitch", steps: [ { type: "say", text: "Figure out how to sell this to me." } ] },
      { time: "25–35 min", phase: "Presentations", steps: [ { type: "do", text: "Deliver 2-minute pitches." } ] }
    ],
    debrief: [ { q: "Did you start believing your own pitch?", note: "Power of framing." } ]
  },
  {
    id: "l_dm_1", title: "Stop, Think, Go", themeShort: ["Decision making", "Coping with emotions"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Full class", "Role-play"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Easy", rating: 4.8, usedBy: 610,
    objective: "Implement a cognitive pause (traffic light model) to prevent impulsive decision-making.", materials: ["Red, Yellow, Green paper circles"],
    phases: [
      { time: "0–10 min", phase: "Traffic Light", steps: [ { type: "say", text: "Red = Stop. Yellow = Think of 2 options. Green = Choose best." } ] },
      { time: "10–30 min", phase: "Practice", steps: [ { type: "do", text: "Run scenarios and have students call out steps." } ] }
    ],
    debrief: [ { q: "Why is Yellow the most important?", note: "Neurological pause." } ]
  },
  {
    id: "l_dm_2", title: "The Choice Scale", themeShort: ["Decision making", "Critical thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Pairs"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.6, usedBy: 340,
    objective: "Weigh the pros and cons of everyday decisions.", materials: ["Worksheets"],
    phases: [
      { time: "0–10 min", phase: "Scale", steps: [ { type: "say", text: "Every choice has a cost." } ] },
      { time: "10–25 min", phase: "Weighing", steps: [ { type: "do", text: "List 3 pros and 3 cons for a given scenario." } ] }
    ],
    debrief: [ { q: "Can one massive 'con' outweigh three 'pros'?", note: "Weight matters." } ]
  },
  {
    id: "l_dm_3", title: "The What-If Map", themeShort: ["Decision making", "Creative thinking"], grade: "5–7", gradeKey: "lower", duration: "35 min", formats: ["Small groups"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.7, usedBy: 420,
    objective: "Practice tracing the short and long-term consequences of a single decision.", materials: ["Chart paper", "Markers"],
    phases: [
      { time: "0–10 min", phase: "Ripple Effect", steps: [ { type: "do", text: "Draw branches for what happens next day, week, month." } ] },
      { time: "10–25 min", phase: "Mapping", steps: [ { type: "do", text: "Trace paths out to at least three consequences." } ] }
    ],
    debrief: [ { q: "Did tracing 'What-Ifs' make the right choice clearer?", note: "Visualizing removes impulsivity." } ]
  },
  {
    id: "l_dm_4", title: "Gut Check", themeShort: ["Decision making", "Self-awareness"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Individual"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Easy", rating: 4.5, usedBy: 190,
    objective: "Recognize physiological signals as an intuitive decision-making tool.", materials: ["Worksheet"],
    phases: [
      { time: "0–10 min", phase: "Gut Feeling", steps: [ { type: "say", text: "Sometimes your stomach knows a decision is bad before your brain does." } ] },
      { time: "10–20 min", phase: "Memory", steps: [ { type: "do", text: "Write about a time you ignored a bad gut feeling." } ] }
    ],
    debrief: [ { q: "What does a 'bad idea' feel like in your body?", note: "Butterflies, heavy stomach." } ]
  },
  {
    id: "l_dm_5", title: "The Reversal Rule", themeShort: ["Decision making", "Empathy"], grade: "5–7", gradeKey: "lower", duration: "30 min", formats: ["Pairs"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.6, usedBy: 210,
    objective: "Use role-reversal to test the fairness and emotional impact of a difficult decision.", materials: ["Scenario cards"],
    phases: [
      { time: "0–5 min", phase: "Rule", steps: [ { type: "say", text: "If you aren't sure, reverse the roles." } ] },
      { time: "5–20 min", phase: "Role-Play", steps: [ { type: "do", text: "Instantly make them play the person on the receiving end." } ] }
    ],
    debrief: [ { q: "How quickly did your opinion change?", note: "Empathy shift." } ]
  },

  // ──────────────────────── MIDDLE SECONDARY (Grade 8-10) ──────────────────────── (18 Activities)
  {
    id: "m_sa_1", title: "The Core Values Audit", themeShort: ["Self-awareness", "Decision making"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
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
    id: "m_em_2", title: "The Privilege Walk", themeShort: ["Empathy", "Self-awareness"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Physical", "Full class"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Advanced", rating: 4.8, usedBy: 345, materials: [],
    objective: "Visually represent structural inequality to build deep empathy for diverse backgrounds.",
    phases: [
      { time: "0–15 min", phase: "The Walk", steps: [ { type: "do", text: "Read statements. Students step forward or backward based on life experiences." } ] },
      { time: "15–40 min", phase: "Circle Debrief", steps: [ { type: "say", text: "Look around. How does it feel to be in the front? The back?" } ] }
    ],
    debrief: [ { q: "Did anything surprise you?", note: "Handle with extreme care and clinical safety." } ]
  },
  {
    id: "m_ct_2", title: "Logical Fallacy Bingo", themeShort: ["Critical thinking", "Effective communication"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Small groups"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.5, usedBy: 212,
    objective: "Identify common logical fallacies in political speeches and advertisements.", materials: ["Bingo Cards", "Video clips"],
    phases: [
      { time: "0–15 min", phase: "Definitions", steps: [ { type: "say", text: "Define Ad Hominem, Strawman, Slippery Slope." } ] },
      { time: "15–35 min", phase: "Bingo", steps: [ { type: "do", text: "Play clips. Students mark fallacies." } ] }
    ],
    debrief: [ { q: "Why are fallacies so convincing?", note: "They appeal to emotion." } ]
  },
  {
    id: "m_crt_1", title: "100 Bad Ideas", themeShort: ["Creative thinking"], grade: "8–10", gradeKey: "middle", duration: "30 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.9, usedBy: 405,
    objective: "Bypass perfectionism by intentionally brainstorming terrible solutions.", materials: ["Whiteboard"],
    phases: [
      { time: "0–20 min", phase: "Sprint", steps: [ { type: "do", text: "Generate 100 terrible ways to solve a school problem." } ] },
      { time: "20–30 min", phase: "Flip", steps: [ { type: "say", text: "Which terrible idea actually has a core of genius?" } ] }
    ],
    debrief: [ { q: "Did removing the pressure to be 'good' help?", note: "Quantity yields quality." } ]
  },
  {
    id: "m_crt_2", title: "The SCAMPER Technique", themeShort: ["Creative thinking", "Problem solving"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Pairs"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.6, usedBy: 180,
    objective: "Systematically innovate an existing object using the SCAMPER framework.", materials: ["Worksheet"],
    phases: [
      { time: "0–15 min", phase: "Framework", steps: [ { type: "say", text: "Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse." } ] },
      { time: "15–40 min", phase: "Application", steps: [ { type: "do", text: "Redesign the school desk using all 7 steps." } ] }
    ],
    debrief: [ { q: "Which step sparked the best idea?", note: "Innovation is iteration." } ]
  },
  {
    id: "m_dm_1", title: "Six Thinking Hats", themeShort: ["Decision making", "Problem solving"], grade: "8–10", gradeKey: "middle", duration: "45 min", formats: ["Small groups"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.8, usedBy: 310,
    objective: "Evaluate a complex decision by adopting six distinct modes of thinking.", materials: ["Colored Hats/Cards"],
    phases: [
      { time: "0–10 min", phase: "The Hats", steps: [ { type: "say", text: "White=Facts, Red=Emotion, Black=Caution, Yellow=Optimism, Green=Creativity, Blue=Process." } ] },
      { time: "10–35 min", phase: "Analysis", steps: [ { type: "do", text: "Force groups to look at a choice through each hat sequentially." } ] }
    ],
    debrief: [ { q: "Which hat was hardest to wear?", note: "Identifies personal blind spots." } ]
  },
  {
    id: "m_dm_2", title: "The Eisenhower Matrix", themeShort: ["Decision making", "Coping with stress"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Individual"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.9, usedBy: 890,
    objective: "Categorize tasks by urgency and importance to prevent burnout.", materials: ["Matrix Handout"],
    phases: [
      { time: "0–15 min", phase: "Sort", steps: [ { type: "do", text: "List all stressors. Sort into 4 quadrants (Urgent/Important)." } ] },
      { time: "15–35 min", phase: "Action", steps: [ { type: "say", text: "Do Q1, Schedule Q2, Delegate Q3, Delete Q4." } ] }
    ],
    debrief: [ { q: "Are you spending too much time in Q3 (Urgent but Not Important)?", note: "Social media trap." } ]
  },
  {
    id: "m_ce_1", title: "Emotion Wheel Expansion", themeShort: ["Coping with emotions", "Self-awareness"], grade: "8–10", gradeKey: "middle", duration: "30 min", formats: ["Individual"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.7, usedBy: 405,
    objective: "Expand emotional vocabulary from basic to highly nuanced states.", materials: ["Plutchik's Wheel"],
    phases: [
      { time: "0–15 min", phase: "Mapping", steps: [ { type: "do", text: "Trace 'Angry' to 'Frustrated' to 'Resentful'." } ] },
      { time: "15–30 min", phase: "Journaling", steps: [ { type: "do", text: "Describe a time you felt a tertiary emotion." } ] }
    ],
    debrief: [ { q: "Does finding the exact word help calm the feeling?", note: "Name it to tame it." } ]
  },
  {
    id: "m_ce_2", title: "The Window of Tolerance", themeShort: ["Coping with emotions", "Coping with stress"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Individual"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Advanced", rating: 4.9, usedBy: 610,
    objective: "Identify signs of hyper-arousal and hypo-arousal in the nervous system.", materials: ["Window Diagram"],
    phases: [
      { time: "0–20 min", phase: "Theory", steps: [ { type: "say", text: "When pushed out of our window, we fight/flight (hyper) or freeze (hypo)." } ] },
      { time: "20–40 min", phase: "Mapping", steps: [ { type: "do", text: "Map personal triggers that push you out of the window." } ] }
    ],
    debrief: [ { q: "What brings you back into your window?", note: "Grounding strategies." } ]
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
  {
    id: "m_cs_2", title: "Box Breathing Basics", themeShort: ["Coping with stress", "Coping with emotions"], grade: "8–10", gradeKey: "middle", duration: "20 min", formats: ["Full class"], color: "#27AE60", colorPale: "#D5F5E3", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Easy", rating: 4.7, usedBy: 1200, materials: [],
    objective: "Learn a clinical tactical breathing technique to down-regulate the nervous system.",
    phases: [
      { time: "0–10 min", phase: "Practice", steps: [ { type: "do", text: "Inhale 4, Hold 4, Exhale 4, Hold 4." } ] },
      { time: "10–20 min", phase: "Application", steps: [ { type: "say", text: "When can you use this discreetly?" } ] }
    ],
    debrief: [ { q: "Did you feel your heart rate drop?", note: "Physiological proof." } ]
  },
  {
    id: "m_ec_1", title: "I-Statements vs You-Statements", themeShort: ["Effective communication", "Interpersonal relationships"], grade: "8–10", gradeKey: "middle", duration: "35 min", formats: ["Pairs"], color: "#34495E", colorPale: "#EAECEE", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.6, usedBy: 450,
    objective: "Transform accusatory communication into vulnerable expression.", materials: ["Worksheet"],
    phases: [
      { time: "0–15 min", phase: "Transformation", steps: [ { type: "do", text: "Convert 'You always ignore me' to 'I feel hurt when...'" } ] },
      { time: "15–35 min", phase: "Roleplay", steps: [ { type: "do", text: "Practice delivering the new statements." } ] }
    ],
    debrief: [ { q: "Does the I-Statement feel more vulnerable?", note: "Yes, which is why it prevents defensive reactions." } ]
  },
  {
    id: "m_ec_2", title: "Active Listening Triads", themeShort: ["Effective communication"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Small groups"], color: "#34495E", colorPale: "#EAECEE", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.5, usedBy: 310, materials: [],
    objective: "Practice reflective listening with an objective observer.",
    phases: [
      { time: "0–30 min", phase: "Triads", steps: [ { type: "do", text: "Speaker, Listener, Observer. Rotate every 10 mins." } ] },
      { time: "30–40 min", phase: "Feedback", steps: [ { type: "do", text: "Observer gives feedback on body language." } ] }
    ],
    debrief: [ { q: "Did the listener actually hear you, or just wait to speak?", note: "Core communication flaw." } ]
  },
  {
    id: "m_ir_1", title: "Boundary Setting Scenarios", themeShort: ["Interpersonal relationships", "Effective communication"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Role-play"], color: "#D35400", colorPale: "#F9EBE0", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Advanced", rating: 4.8, usedBy: 530,
    objective: "Practice saying 'no' clearly and without over-apologizing.", materials: ["Scenario Cards"],
    phases: [
      { time: "0–10 min", phase: "The Formula", steps: [ { type: "say", text: "Acknowledge + Clear No + Alternative (Optional)." } ] },
      { time: "10–30 min", phase: "Practice", steps: [ { type: "do", text: "Roleplay peer pressure scenarios." } ] }
    ],
    debrief: [ { q: "Why do we feel the need to invent excuses?", note: "Fear of rejection." } ]
  },
  {
    id: "m_ps_1", title: "The Fishbone Diagram", themeShort: ["Problem solving", "Critical thinking"], grade: "8–10", gradeKey: "middle", duration: "40 min", formats: ["Small groups"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.4, usedBy: 220,
    objective: "Visually map causes and effects of a systemic problem.", materials: ["Chart paper"],
    phases: [
      { time: "0–20 min", phase: "Mapping", steps: [ { type: "do", text: "Head = Problem. Ribs = Categories (People, Environment, Process)." } ] },
      { time: "20–40 min", phase: "Analysis", steps: [ { type: "do", text: "Identify the root cause." } ] }
    ],
    debrief: [ { q: "Did seeing it mapped out change your proposed solution?", note: "Systemic thinking." } ]
  },
  {
    id: "m_ps_2", title: "Worst Possible Idea", themeShort: ["Problem solving", "Creative thinking"], grade: "8–10", gradeKey: "middle", duration: "30 min", formats: ["Pairs"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Easy", rating: 4.7, usedBy: 310, materials: [],
    objective: "Solve a problem by inverting it completely.",
    phases: [
      { time: "0–15 min", phase: "Inversion", steps: [ { type: "do", text: "How can we make this problem significantly worse?" } ] },
      { time: "15–30 min", phase: "Re-inversion", steps: [ { type: "say", text: "Now, do the exact opposite of your terrible idea." } ] }
    ],
    debrief: [ { q: "Why is it easier to think of bad ideas?", note: "Lower stakes." } ]
  },

  // ──────────────────────── SENIOR SECONDARY (Grade 11-12) ──────────────────────── (17 Activities)
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
    id: "s_sa_2", title: "The Johari Window", themeShort: ["Self-awareness", "Interpersonal relationships"], grade: "11–12", gradeKey: "upper", duration: "45 min", formats: ["Individual", "Pairs"], color: "#8E44AD", colorPale: "#F5EEF8", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.8, usedBy: 540,
    objective: "Discover personal blind spots through structured peer feedback.", materials: ["Johari Worksheets"],
    phases: [
      { time: "0–20 min", phase: "Self-Assessment", steps: [ { type: "do", text: "Fill out the Open and Hidden quadrants." } ] },
      { time: "20–45 min", phase: "Feedback", steps: [ { type: "do", text: "Peers fill out your Blind quadrant safely." } ] }
    ],
    debrief: [ { q: "Was the blind spot feedback surprising?", note: "Requires high clinical safety." } ]
  },
  {
    id: "s_em_1", title: "Active Constructive Responding", themeShort: ["Empathy", "Interpersonal relationships"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Role-play"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.7, usedBy: 410,
    objective: "Learn to respond to others' good news in a way that builds connection.", materials: ["Response Matrix"],
    phases: [
      { time: "0–15 min", phase: "Theory", steps: [ { type: "say", text: "How you respond to good news matters more than bad news." } ] },
      { time: "15–35 min", phase: "Practice", steps: [ { type: "do", text: "Roleplay the 4 styles (Active/Passive, Constructive/Destructive)." } ] }
    ],
    debrief: [ { q: "Are you a 'Joy Thief' without realizing it?", note: "Passive-destructive awareness." } ]
  },
  {
    id: "s_em_2", title: "Conflict Mediation Roleplay", themeShort: ["Empathy", "Problem solving"], grade: "11–12", gradeKey: "upper", duration: "45 min", formats: ["Small groups"], color: "#E8845A", colorPale: "#FDF0EA", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Advanced", rating: 4.8, usedBy: 320,
    objective: "Act as a neutral third party to resolve complex peer conflicts.", materials: ["Briefs"],
    phases: [
      { time: "0–30 min", phase: "Mediation", steps: [ { type: "do", text: "Two disputants, one mediator. Practice active listening." } ] },
      { time: "30–45 min", phase: "Debrief", steps: [ { type: "say", text: "Mediators, how hard was it to stay neutral?" } ] }
    ],
    debrief: [ { q: "Did the disputants feel heard?", note: "Mediation relies on feeling validated." } ]
  },
  {
    id: "s_ct_1", title: "Bias Check: Confirmation Bias", themeShort: ["Critical thinking", "Self-awareness"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Individual"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Advanced", rating: 4.9, usedBy: 670,
    objective: "Identify personal confirmation bias when evaluating news sources.", materials: ["Articles"],
    phases: [
      { time: "0–20 min", phase: "Reading", steps: [ { type: "do", text: "Read an article that attacks a deeply held personal belief." } ] },
      { time: "20–40 min", phase: "Analysis", steps: [ { type: "do", text: "Highlight logical points the author made, even if you hate them." } ] }
    ],
    debrief: [ { q: "Did your brain physically reject the information?", note: "Cognitive dissonance." } ]
  },
  {
    id: "s_ct_2", title: "The Socratic Seminar", themeShort: ["Critical thinking", "Effective communication"], grade: "11–12", gradeKey: "upper", duration: "50 min", formats: ["Full class"], color: "#2C3E50", colorPale: "#EAF0FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.8, usedBy: 510, materials: [],
    objective: "Engage in rigorous, question-driven dialogue to explore complex ethics.",
    phases: [
      { time: "0–40 min", phase: "Dialogue", steps: [ { type: "say", text: "You must respond to a point with a clarifying question, not a statement." } ] },
      { time: "40–50 min", phase: "Meta-Debrief", steps: [ { type: "do", text: "Evaluate the quality of the questions asked." } ] }
    ],
    debrief: [ { q: "Did asking questions change your original stance?", note: "Intellectual humility." } ]
  },
  {
    id: "s_crt_1", title: "Reverse Engineering", themeShort: ["Creative thinking", "Problem solving"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Small groups"], color: "#F1C40F", colorPale: "#FEF9E7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Advanced", rating: 4.6, usedBy: 290,
    objective: "Deconstruct a successful product/idea to understand its core components.", materials: ["Case studies"],
    phases: [
      { time: "0–25 min", phase: "Teardown", steps: [ { type: "do", text: "Break down why a specific app or trend went viral." } ] },
      { time: "25–40 min", phase: "Rebuild", steps: [ { type: "say", text: "Apply those core psychological triggers to a boring school task." } ] }
    ],
    debrief: [ { q: "Are all new ideas just remixed old ideas?", note: "Combinatorial creativity." } ]
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
    id: "s_dm_2", title: "Cost-Benefit Analysis Matrix", themeShort: ["Decision making", "Critical thinking"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Individual"], color: "#2980B9", colorPale: "#EBF5FB", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Advanced", rating: 4.7, usedBy: 510,
    objective: "Quantify abstract choices to make data-driven life decisions.", materials: ["Matrix Sheet"],
    phases: [
      { time: "0–20 min", phase: "Variables", steps: [ { type: "do", text: "Assign numeric weight (1-10) to pros and cons of a college choice." } ] },
      { time: "20–40 min", phase: "Calculation", steps: [ { type: "say", text: "Do the math. Does the numeric winner match your gut feeling?" } ] }
    ],
    debrief: [ { q: "What if the math contradicts your gut?", note: "Reveals hidden values." } ]
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
  },
  {
    id: "s_ce_2", title: "Radical Acceptance", themeShort: ["Coping with emotions", "Coping with stress"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#9B59B6", colorPale: "#F4ECF7", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Advanced", rating: 4.8, usedBy: 720, materials: [],
    objective: "Differentiate between passive resignation and active, radical acceptance of reality.",
    phases: [
      { time: "0–15 min", phase: "Theory", steps: [ { type: "say", text: "Pain is inevitable. Suffering is optional. Acceptance stops suffering." } ] },
      { time: "15–35 min", phase: "Application", steps: [ { type: "do", text: "Identify an unchangeable stressor. Write an acceptance statement." } ] }
    ],
    debrief: [ { q: "Does acceptance mean you like the situation?", note: "No, it just means you stop fighting reality." } ]
  },
  {
    id: "s_cs_1", title: "Progressive Muscle Relaxation", themeShort: ["Coping with stress", "Self-awareness"], grade: "11–12", gradeKey: "upper", duration: "25 min", formats: ["Full class"], color: "#27AE60", colorPale: "#D5F5E3", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Easy", rating: 4.8, usedBy: 1100, materials: [],
    objective: "Relieve somatic tension through active contract/relax cycles.",
    phases: [
      { time: "0–20 min", phase: "Guided PMR", steps: [ { type: "do", text: "Guide class to tense and release muscle groups from toes to head." } ] },
      { time: "20–25 min", phase: "Debrief", steps: [ { type: "say", text: "Notice the difference in your baseline tension." } ] }
    ],
    debrief: [ { q: "Where do you hold the most stress?", note: "Usually jaw or shoulders." } ]
  },
  {
    id: "s_cs_2", title: "The Circle of Control", themeShort: ["Coping with stress", "Decision making"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#27AE60", colorPale: "#D5F5E3", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.9, usedBy: 980,
    objective: "Mitigate anxiety by visually separating controllable actions from uncontrollable outcomes.", materials: ["Circle Worksheets"],
    phases: [
      { time: "0–15 min", phase: "Mapping", steps: [ { type: "do", text: "Draw two circles. Inside = what I control. Outside = what I don't." } ] },
      { time: "15–35 min", phase: "Purge", steps: [ { type: "say", text: "Cross out everything in the outside circle. Stop spending energy there." } ] }
    ],
    debrief: [ { q: "Are college decisions inside or outside the circle?", note: "Effort is inside, outcome is outside." } ]
  },
  {
    id: "s_ec_1", title: "Crucial Conversations", themeShort: ["Effective communication", "Interpersonal relationships"], grade: "11–12", gradeKey: "upper", duration: "45 min", formats: ["Role-play"], color: "#34495E", colorPale: "#EAECEE", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Advanced", rating: 4.8, usedBy: 550,
    objective: "Navigate high-stakes conversations without triggering defensiveness.", materials: ["Case Studies"],
    phases: [
      { time: "0–20 min", phase: "State My Path", steps: [ { type: "say", text: "Share facts, tell your story, ask for their path." } ] },
      { time: "20–45 min", phase: "Roleplay", steps: [ { type: "do", text: "Practice confronting a friend about a betrayal." } ] }
    ],
    debrief: [ { q: "Why start with facts instead of feelings?", note: "Facts are less debatable." } ]
  },
  {
    id: "s_ir_1", title: "Apology Anatomy", themeShort: ["Interpersonal relationships", "Self-awareness"], grade: "11–12", gradeKey: "upper", duration: "35 min", formats: ["Individual"], color: "#D35400", colorPale: "#F9EBE0", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Low", complexity: "Moderate", rating: 4.7, usedBy: 420, materials: [],
    objective: "Deconstruct the elements of a genuine apology versus a non-apology.",
    phases: [
      { time: "0–15 min", phase: "Audit", steps: [ { type: "do", text: "Analyze celebrity 'notes app' apologies for blame-shifting." } ] },
      { time: "15–35 min", phase: "Draft", steps: [ { type: "do", text: "Write a 4-part true apology: Regret, Responsibility, Remedy, Repentance." } ] }
    ],
    debrief: [ { q: "Why is 'I am sorry you felt that way' toxic?", note: "Shifts blame." } ]
  },
  {
    id: "s_ps_1", title: "SWOT Analysis for Life", themeShort: ["Problem solving", "Decision making"], grade: "11–12", gradeKey: "upper", duration: "40 min", formats: ["Individual"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "Medium", complexity: "Moderate", rating: 4.6, usedBy: 590,
    objective: "Apply business strategy frameworks to personal post-school planning.", materials: ["SWOT Grids"],
    phases: [
      { time: "0–20 min", phase: "Grid Work", steps: [ { type: "do", text: "Map Strengths, Weaknesses, Opportunities, Threats for a career choice." } ] },
      { time: "20–40 min", phase: "Strategy", steps: [ { type: "say", text: "How can your strengths mitigate your threats?" } ] }
    ],
    debrief: [ { q: "Are weaknesses permanent?", note: "Growth mindset." } ]
  },
  {
    id: "s_ps_2", title: "Scenario Planning", themeShort: ["Problem solving", "Coping with stress"], grade: "11–12", gradeKey: "upper", duration: "45 min", formats: ["Small groups"], color: "#16A085", colorPale: "#D5F5F0", imagePath: "/resources/lifeskills/placeholder.jpg",
    energyLevel: "High", complexity: "Advanced", rating: 4.9, usedBy: 460,
    objective: "Build resilience by mapping out 'Plan B' and 'Plan C' for major failures.", materials: ["Whiteboard"],
    phases: [
      { time: "0–20 min", phase: "The Disaster", steps: [ { type: "do", text: "Imagine you fail your primary entrance exam. What is the immediate pivot?" } ] },
      { time: "20–45 min", phase: "The Pivot", steps: [ { type: "say", text: "Map a 1-year alternative path that still leads to success." } ] }
    ],
    debrief: [ { q: "Does having a Plan B make failure less scary?", note: "Reduces catastrophic thinking." } ]
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
            {phase.steps.map((s, si) => <Step key={si} s={s} />)}
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
