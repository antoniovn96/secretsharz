import React, { useState, useEffect } from 'react';

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  .mh-page { min-height: 100vh; background: var(--warm-white, #FDFCFA); font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 80px; }
  
  /* ── TOPBAR ── */
  .mh-topbar { background: var(--ink, #1E2820); color: white; height: 56px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 300; border-bottom: 3px solid var(--lavender, #7C6FA0); }
  .mh-back { display: flex; align-items: center; gap: 6px; color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 700; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.2s; }
  .mh-back:hover { color: white; }
  .mh-topbar-title { font-family: 'Fraunces', serif; font-size: 16px; color: white; }

  /* ── HERO ── */
  .mh-hero { background: linear-gradient(135deg, var(--ink, #1E2820) 0%, #2A2438 100%); padding: 80px 48px; position: relative; overflow: hidden; text-align: center; color: white; }
  .mh-hero::before { content: ''; position: absolute; top: -50px; left: -50px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(124,111,160,0.15), transparent 70%); border-radius: 50%; }
  .mh-hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
  .mh-eyebrow { display: inline-block; background: rgba(124,111,160,0.2); border: 1px solid rgba(124,111,160,0.4); color: #B3A4D6; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
  .mh-h1 { font-family: 'Fraunces', serif; font-size: clamp(36px, 5vw, 56px); font-weight: 700; line-height: 1.1; margin-bottom: 16px; }
  .mh-h1 em { font-style: italic; color: #B3A4D6; }
  .mh-sub { font-size: 18px; color: rgba(255,255,255,0.7); line-height: 1.6; font-weight: 400; }

  /* ── GRID & CARDS ── */
  .mh-container { max-width: 1100px; margin: -40px auto 0; padding: 0 48px; position: relative; z-index: 10; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
  .mh-card { background: white; border-radius: 20px; border: 1px solid var(--border, rgba(74,124,89,0.15)); box-shadow: 0 8px 24px rgba(0,0,0,0.06); padding: 32px; transition: all 0.3s; display: flex; flex-direction: column; position: relative; overflow: hidden; }
  .mh-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: var(--lavender, #7C6FA0); }
  .mh-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; }
  
  .mh-card.toolkit::before { background: linear-gradient(90deg, var(--sage, #4A7C59), #87D09E); }
  .mh-card.wheel::before { background: linear-gradient(90deg, var(--lavender, #7C6FA0), #A89DD0); }
  .mh-card.control::before { background: linear-gradient(90deg, var(--sky, #5B9EBF), #89C4E0); }
  .mh-card.anxiety::before { background: linear-gradient(90deg, var(--peach, #E8845A), #F0A97A); }
  .mh-card.crisis::before { background: linear-gradient(90deg, #C0392B, #E74C3C); }
  .mh-card.crisis { border-color: rgba(192,57,43,0.2); background: #FFFDFD; }

  .mh-icon { font-size: 40px; margin-bottom: 20px; }
  .mh-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink, #1E2820); margin-bottom: 12px; line-height: 1.2; }
  .mh-desc { font-size: 15px; color: var(--ink-soft, #3D4A40); line-height: 1.6; margin-bottom: 24px; flex: 1; }
  
  .mh-meta { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
  .mh-badge { padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; background: var(--sand, #F7F3ED); color: var(--muted, #7A8A7D); }
  
  .mh-actions { display: flex; gap: 10px; flex-wrap: wrap; }
  .mh-btn { padding: 12px 20px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; font-family: inherit; }
  .mh-btn-primary { background: var(--lavender, #7C6FA0); color: white; }
  .mh-btn-primary:hover { background: #655985; transform: translateY(-2px); }
  .mh-btn-outline { background: transparent; color: var(--ink, #1E2820); border: 2px solid var(--border, rgba(74,124,89,0.15)); }
  .mh-btn-outline:hover { border-color: var(--lavender, #7C6FA0); color: var(--lavender, #7C6FA0); }
  
  .mh-btn-danger { background: #C0392B; color: white; }
  .mh-btn-danger:hover { background: #A93226; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(192,57,43,0.3); }

  /* ── MODALS ── */
  .mh-modal-overlay { position: fixed; inset: 0; background: rgba(30,40,32,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
  .mh-modal { background: white; border-radius: 24px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 24px 48px rgba(0,0,0,0.2); animation: floatUp 0.3s ease; }
  .mh-modal-header { padding: 32px 32px 24px; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: white; z-index: 10; display: flex; justify-content: space-between; align-items: flex-start; }
  .mh-modal-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; color: var(--ink); margin: 0; }
  .mh-modal-close { background: var(--sand); border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; color: var(--muted); display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .mh-modal-close:hover { background: #EAE5DE; color: var(--ink); }
  .mh-modal-body { padding: 32px; }

  /* ── INTERACTIVE EMOTION WHEEL ── */
  .ew-container { display: flex; flex-direction: column; gap: 24px; }
  .ew-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .ew-back-btn { background: none; border: none; font-size: 14px; font-weight: 600; color: var(--lavender, #7C6FA0); cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0; transition: 0.2s; }
  .ew-back-btn:hover { color: #5B4E7A; transform: translateX(-4px); }
  
  .ew-core-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .ew-core-card { padding: 24px; border-radius: 16px; color: white; cursor: pointer; text-align: center; transition: 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: none; font-family: inherit; }
  .ew-core-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); filter: brightness(1.05); }
  .ew-core-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; margin-bottom: 4px; }
  .ew-core-sub { font-size: 12px; opacity: 0.9; }

  .ew-chip-grid { display: flex; flex-wrap: wrap; gap: 12px; }
  .ew-chip { padding: 12px 20px; border-radius: 50px; font-size: 15px; font-weight: 600; cursor: pointer; border: 2px solid transparent; transition: 0.2s; font-family: inherit; }
  .ew-chip:hover { transform: translateY(-2px); }
  .ew-chip.active { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

  .ew-breadcrumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--muted); background: var(--sand); padding: 12px 20px; border-radius: 12px; margin-bottom: 24px; }
  .ew-bc-item { display: flex; align-items: center; gap: 8px; }
  .ew-bc-arrow { opacity: 0.5; font-size: 12px; }
  .ew-bc-text.active { color: var(--ink); font-family: 'Fraunces', serif; font-size: 16px; font-weight: 700; }

  .ew-result-box { background: white; border: 2px solid; padding: 24px; border-radius: 16px; margin-top: 16px; animation: fadeIn 0.3s ease; }
  .ew-result-title { font-family: 'Fraunces', serif; font-size: 24px; margin-bottom: 8px; }
  .ew-result-desc { font-size: 14px; color: var(--ink-soft); line-height: 1.6; }

  /* Crisis Directory Specifics */
  .crisis-list { display: flex; flex-direction: column; gap: 16px; }
  .crisis-item { background: #FFF0F0; border: 1px solid rgba(192,57,43,0.2); padding: 20px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
  .crisis-info h4 { margin: 0 0 4px 0; font-size: 18px; color: #C0392B; }
  .crisis-info p { margin: 0; font-size: 13px; color: var(--ink-soft); }
  .crisis-call-btn { background: #C0392B; color: white; text-decoration: none; padding: 10px 20px; border-radius: 50px; font-weight: 700; font-size: 14px; display: inline-flex; align-items: center; gap: 8px; transition: 0.2s; }
  .crisis-call-btn:hover { background: #A93226; transform: scale(1.05); }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes floatUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  @media(max-width: 768px) {
    .mh-hero { padding: 60px 24px 80px; }
    .mh-h1 { font-size: 32px; }
    .mh-container { padding: 0 24px; margin-top: -30px; grid-template-columns: 1fr; }
    .mh-modal-header, .mh-modal-body { padding: 24px; }
    .crisis-item { flex-direction: column; align-items: flex-start; }
    .ew-core-grid { grid-template-columns: 1fr; }
  }
`;

// ==========================================
// DATA STRUCTURE FOR EMOTION WHEEL
// ==========================================
const EMOTION_DATA = {
  Anger: {
    color: '#E8845A',
    desc: "A response to feeling blocked, threatened, or treated unfairly.",
    children: {
      Frustrated: ["Irritated", "Infuriated", "Annoyed"],
      Mad: ["Furious", "Jealous", "Resentful"],
      Bitter: ["Indignant", "Violated", "Outraged"]
    }
  },
  Fear: {
    color: '#7C6FA0',
    desc: "A response to perceived danger, uncertainty, or feeling unsafe.",
    children: {
      Anxious: ["Overwhelmed", "Worried", "Stressed"],
      Insecure: ["Inadequate", "Inferior", "Worthless"],
      Scared: ["Helpless", "Frightened", "Panicked"]
    }
  },
  Surprise: {
    color: '#5B9EBF',
    desc: "A response to unexpected events, whether positive or negative.",
    children: {
      Excited: ["Energetic", "Eager", "Thrilled"],
      Amazed: ["Astonished", "Awe", "Fascinated"],
      Confused: ["Perplexed", "Disillusioned", "Dismayed"]
    }
  },
  Happy: {
    color: '#E1B846', // Calmer yellow
    desc: "A state of well-being, contentment, or positive connection.",
    children: {
      Playful: ["Aroused", "Cheeky", "Free"],
      Content: ["Joyful", "Peaceful", "Trusting"],
      Proud: ["Important", "Confident", "Respected"]
    }
  },
  Sad: {
    color: '#4A6984',
    desc: "A response to loss, disconnection, or unfulfilled needs.",
    children: {
      Lonely: ["Isolated", "Abandoned", "Empty"],
      Vulnerable: ["Fragile", "Victimized", "Powerless"],
      Despair: ["Grief", "Powerless", "Hopeless"]
    }
  },
  Disgust: {
    color: '#4A7C59',
    desc: "A reaction of repulsion or intense disapproval.",
    children: {
      Disapproving: ["Judgmental", "Loathing", "Condemning"],
      Disappointed: ["Appalled", "Revolted", "Nauseated"],
      Awful: ["Detestable", "Repugnant", "Abominable"]
    }
  }
};

// ==========================================
// INTERACTIVE EMOTION WHEEL COMPONENT
// ==========================================
function InteractiveEmotionWheel() {
  const [core, setCore] = useState(null);
  const [middle, setMiddle] = useState(null);
  const [outer, setOuter] = useState(null);

  const resetAll = () => {
    setCore(null);
    setMiddle(null);
    setOuter(null);
  };

  const selectCore = (key) => {
    setCore(key);
    setMiddle(null);
    setOuter(null);
  };

  const selectMiddle = (key) => {
    setMiddle(key);
    setOuter(null);
  };

  // View 1: Core Selection
  if (!core) {
    return (
      <div className="ew-container">
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h4 style={{ fontSize: '18px', color: 'var(--ink)' }}>Where are you starting from?</h4>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>Select a core feeling below to dig deeper.</p>
        </div>
        <div className="ew-core-grid">
          {Object.entries(EMOTION_DATA).map(([key, data]) => (
            <button 
              key={key} 
              className="ew-core-card" 
              style={{ background: data.color }}
              onClick={() => selectCore(key)}
            >
              <div className="ew-core-title">{key}</div>
              <div className="ew-core-sub">{Object.keys(data.children).length} middle states</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const coreData = EMOTION_DATA[core];
  const middleKeys = Object.keys(coreData.children);

  return (
    <div className="ew-container">
      <div className="ew-nav">
        <button className="ew-back-btn" onClick={resetAll}>
          ← View Full Wheel
        </button>
      </div>

      {/* Breadcrumbs */}
      <div className="ew-breadcrumbs">
        <div className="ew-bc-item">
          <span 
            className={`ew-bc-text ${!middle ? 'active' : ''}`}
            style={{ cursor: 'pointer', color: !middle ? coreData.color : 'inherit' }}
            onClick={() => { setMiddle(null); setOuter(null); }}
          >
            {core}
          </span>
        </div>
        {middle && (
          <div className="ew-bc-item">
            <span className="ew-bc-arrow">›</span>
            <span 
              className={`ew-bc-text ${!outer ? 'active' : ''}`}
              style={{ cursor: 'pointer', color: !outer ? coreData.color : 'inherit' }}
              onClick={() => setOuter(null)}
            >
              {middle}
            </span>
          </div>
        )}
        {outer && (
          <div className="ew-bc-item">
            <span className="ew-bc-arrow">›</span>
            <span className="ew-bc-text active" style={{ color: coreData.color }}>
              {outer}
            </span>
          </div>
        )}
      </div>

      {/* View 2: Middle Selection */}
      {!middle && (
        <div className="ew-selection-view">
          <h4 style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '16px' }}>
            What kind of {core}?
          </h4>
          <div className="ew-chip-grid">
            {middleKeys.map(mKey => (
              <button 
                key={mKey} 
                className="ew-chip"
                style={{ background: '#F7F3ED', color: 'var(--ink)', borderColor: 'transparent' }}
                onClick={() => selectMiddle(mKey)}
              >
                {mKey}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Outer Selection */}
      {middle && !outer && (
        <div className="ew-selection-view">
          <h4 style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '16px' }}>
            Let's get even more specific:
          </h4>
          <div className="ew-chip-grid">
            {coreData.children[middle].map(oKey => (
              <button 
                key={oKey} 
                className="ew-chip"
                style={{ background: 'white', color: coreData.color, borderColor: coreData.color }}
                onClick={() => setOuter(oKey)}
              >
                {oKey}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* View 4: Final Selection & Validation */}
      {outer && (
        <div className="ew-result-box" style={{ borderColor: coreData.color }}>
          <div className="ew-result-title" style={{ color: coreData.color }}>
            You are feeling {outer}.
          </div>
          <p className="ew-result-desc">
            Naming your exact emotion immediately decreases its power in your amygdala. 
            It is completely valid to feel {outer.toLowerCase()} right now. 
            Take a deep breath and acknowledge it.
          </p>
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Other variations of feeling {middle}:
            </p>
            <div className="ew-chip-grid">
              {coreData.children[middle].map(sibling => (
                <button 
                  key={sibling} 
                  className={`ew-chip ${sibling === outer ? 'active' : ''}`}
                  style={{ 
                    background: sibling === outer ? coreData.color : 'transparent', 
                    color: sibling === outer ? 'white' : 'var(--ink-soft)', 
                    borderColor: sibling === outer ? coreData.color : '#EAE5DE',
                    fontSize: '13px', padding: '6px 14px'
                  }}
                  onClick={() => setOuter(sibling)}
                >
                  {sibling}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ==========================================
// MAIN PAGE COMPONENT
// ==========================================
export default function MentalHealthFirstAid({ navigate, onBack }) {
  const [activeModal, setActiveModal] = useState(null);

  // Inject CSS
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Scroll to top on load
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const openModal = (id) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);

  const RESOURCES = [
    {
      id: "grounding",
      title: "The Grounding Toolkit",
      cls: "toolkit",
      icon: "🧘🏽",
      badges: ["Printable 1-Pager", "Instant Relief"],
      desc: "A beautifully designed, printable guide featuring the 5-4-3-2-1 technique, Box Breathing, and the 4-7-8 method. Perfect for sticking above a study desk.",
      action1: { text: "Download PDF", link: "/resources/mh/Grounding_Toolkit.pdf" },
    },
    {
      id: "emotion-wheel",
      title: "The Emotion Wheel",
      cls: "wheel",
      icon: "🎯",
      badges: ["Interactive", "Printable"],
      desc: "Expand your emotional vocabulary. Stop saying 'I feel bad' and figure out if you're actually feeling overwhelmed, insecure, burnt out, or disconnected.",
      action1: { text: "Use Interactive Tool", onClick: () => openModal('wheel') },
      action2: { text: "Download PDF", link: "/resources/mh/Emotion_Wheel.pdf" },
    },
    {
      id: "control",
      title: "In My Control vs. Out of My Control",
      cls: "control",
      icon: "⭕",
      badges: ["Worksheet", "Anxiety Prep"],
      desc: "A tactical worksheet to map out your anxieties and physically let go of things you cannot change (like exam difficulty or other people's opinions).",
      action1: { text: "Download PDF", link: "/resources/mh/Control_Worksheet.pdf" },
    },
    {
      id: "exam-survival",
      title: "The Exam Anxiety Survival Guide",
      cls: "anxiety",
      icon: "⚡",
      badges: ["3-Page Guide", "High Stress"],
      desc: "How to handle a panic attack during a test, how to actually sleep the night before, and how to separate your self-worth from your marks.",
      action1: { text: "Read Guide", onClick: () => openModal('exam') },
      action2: { text: "Download PDF", link: "/resources/mh/Exam_Survival.pdf" },
    },
    {
      id: "crisis",
      title: "National Crisis Directory",
      cls: "crisis",
      icon: "🆘",
      badges: ["Emergency", "24/7 Support"],
      desc: "A permanently updated, accessible list of verified Indian helplines for severe distress. If things feel too heavy, reach out immediately.",
      action1: { text: "View Helplines", isDanger: true, onClick: () => openModal('crisis') },
    }
  ];

  return (
    <>
      <div className="mh-page">
        <div className="mh-topbar">
          <button className="mh-back" onClick={onBack || (() => navigate && navigate("/resources"))}>← Back to Resources</button>
          <div className="mh-topbar-title">Secret Sharz</div>
          <div />
        </div>

        <section className="mh-hero">
          <div className="mh-hero-inner">
            <div className="mh-eyebrow">Emotional First Aid</div>
            <h1 className="mh-h1">Tools for immediate relief <br/><em>and daily maintenance.</em></h1>
            <p className="mh-sub">You don't have to figure it all out right now. Just focus on regulating your nervous system and getting through today. These tools are here to help.</p>
          </div>
        </section>

        <section className="mh-container">
          {RESOURCES.map((res) => (
            <div key={res.id} className={`mh-card ${res.cls}`}>
              <div className="mh-icon">{res.icon}</div>
              <h3 className="mh-title">{res.title}</h3>
              <div className="mh-meta">
                {res.badges.map(b => <span key={b} className="mh-badge">{b}</span>)}
              </div>
              <p className="mh-desc">{res.desc}</p>
              
              <div className="mh-actions">
                {res.action1.link ? (
                  <a href={res.action1.link} download className={`mh-btn ${res.action1.isDanger ? 'mh-btn-danger' : 'mh-btn-primary'}`} target="_blank" rel="noreferrer">
                    {res.action1.text}
                  </a>
                ) : (
                  <button onClick={res.action1.onClick} className={`mh-btn ${res.action1.isDanger ? 'mh-btn-danger' : 'mh-btn-primary'}`}>
                    {res.action1.text}
                  </button>
                )}

                {res.action2 && (
                  <a href={res.action2.link} download className="mh-btn mh-btn-outline" target="_blank" rel="noreferrer">
                    {res.action2.text}
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ── CRISIS DIRECTORY MODAL ── */}
      {activeModal === 'crisis' && (
        <div className="mh-modal-overlay" onClick={closeModal}>
          <div className="mh-modal" onClick={e => e.stopPropagation()}>
            <div className="mh-modal-header" style={{ borderBottomColor: 'rgba(192,57,43,0.2)' }}>
              <div>
                <h3 className="mh-modal-title" style={{ color: '#C0392B' }}>National Crisis Directory</h3>
                <p style={{ margin: '8px 0 0', fontSize: '14px', color: 'var(--muted)' }}>Free, verified, and confidential helplines in India.</p>
              </div>
              <button className="mh-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="mh-modal-body">
              <div className="crisis-list">
                <div className="crisis-item">
                  <div className="crisis-info">
                    <h4>Kiran Helpline (Govt. of India)</h4>
                    <p>24/7 National Mental Health Rehabilitation Helpline.</p>
                  </div>
                  <a href="tel:18005990019" className="crisis-call-btn">📞 1800-599-0019</a>
                </div>
                
                <div className="crisis-item">
                  <div className="crisis-info">
                    <h4>iCall (by TISS)</h4>
                    <p>Psychosocial support. Monday—Saturday, 8:00 AM to 10:00 PM.</p>
                  </div>
                  <a href="tel:9152987821" className="crisis-call-btn">📞 9152987821</a>
                </div>

                <div className="crisis-item">
                  <div className="crisis-info">
                    <h4>Vandrevala Foundation</h4>
                    <p>24/7 free psychological counselling for anyone in distress.</p>
                  </div>
                  <a href="tel:9999666555" className="crisis-call-btn">📞 9999-666-555</a>
                </div>

                <div className="crisis-item">
                  <div className="crisis-info">
                    <h4>Snehi</h4>
                    <p>24/7 suicide prevention and emotional support.</p>
                  </div>
                  <a href="tel:04424640050" className="crisis-call-btn">📞 044-24640050</a>
                </div>
              </div>
              
              <p style={{ marginTop: '24px', fontSize: '13px', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.6 }}>
                Reaching out is the bravest thing you can do. You don't have to carry the weight alone. These professionals are trained to listen without judgment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── EXAM ANXIETY PREVIEW MODAL ── */}
      {activeModal === 'exam' && (
        <div className="mh-modal-overlay" onClick={closeModal}>
          <div className="mh-modal" onClick={e => e.stopPropagation()}>
            <div className="mh-modal-header">
              <h3 className="mh-modal-title">Exam Anxiety Survival Guide</h3>
              <button className="mh-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="mh-modal-body" style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '15px' }}>
              <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', color: 'var(--ink)', marginBottom: '12px' }}>1. The Night Before: The "Brain Dump"</h4>
              <p style={{ marginBottom: '24px' }}>Stop studying 60 minutes before bed. Take a blank piece of paper and write down every single formula, fear, and worry in your head. Getting it out of your brain and onto paper reduces cognitive load so you can actually sleep.</p>
              
              <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', color: 'var(--ink)', marginBottom: '12px' }}>2. During the Exam: The 30-Second Reset</h4>
              <p style={{ marginBottom: '24px' }}>If you look at the paper and freeze, flip it over. Do not look at the questions. Do the 5-4-3-2-1 grounding technique. Look for 5 blue things in the room. Feel 4 textures. Take 3 deep breaths. You have the time. Regulate your nervous system first, then turn the paper back over.</p>

              <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', color: 'var(--ink)', marginBottom: '12px' }}>3. The Truth About Self-Worth</h4>
              <p style={{ marginBottom: '24px' }}>An exam measures how well you retained specific information on a specific day. It does not measure your intelligence, your capability to succeed in life, or your worth as a human being. The result of this test is data, not an identity.</p>

              <div style={{ background: 'var(--sand)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>Download the full 3-page PDF guide for more tactical strategies.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EMOTION WHEEL MODAL (UPDATED) ── */}
      {activeModal === 'wheel' && (
        <div className="mh-modal-overlay" onClick={closeModal}>
          <div className="mh-modal" onClick={e => e.stopPropagation()}>
            <div className="mh-modal-header">
              <h3 className="mh-modal-title">The Emotion Wheel</h3>
              <button className="mh-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="mh-modal-body">
              <InteractiveEmotionWheel />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
