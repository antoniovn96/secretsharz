import React, { useState, useEffect } from 'react';

const STYLES = `
  .ms-root { max-width: 1000px; margin: 40px auto; padding: 0 24px; animation: fadeIn 0.5s ease; }
  .ms-header { margin-bottom: 32px; }
  .ms-header h1 { font-family: 'Fraunces', serif; font-size: 36px; color: var(--ink); margin-bottom: 8px; letter-spacing: -0.5px; }
  .ms-header p { font-size: 16px; color: var(--muted); }
  
  .ms-tabs { display: flex; gap: 12px; margin-bottom: 32px; border-bottom: 1px solid var(--border); padding-bottom: 16px; overflow-x: auto; }
  .ms-tab { padding: 10px 24px; border-radius: 50px; background: transparent; color: var(--muted); font-weight: 600; font-size: 15px; border: 1px solid transparent; cursor: pointer; transition: all 0.2s; white-space: nowrap; font-family: inherit; }
  .ms-tab:hover { background: var(--sage-pale); color: var(--sage); }
  .ms-tab.active { background: var(--sage); color: white; box-shadow: 0 4px 12px rgba(74,124,89,0.3); }
  
  /* --- MOOD TRACKER --- */
  .mood-history-card { background: white; border: 1px solid var(--border); border-radius: var(--r-md); padding: 20px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center; }
  .history-dots { display: flex; gap: 8px; }
  .h-dot { width: 16px; height: 16px; border-radius: 50%; opacity: 0.8; }
  
  .mood-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .mood-card { background: white; border: 2px solid var(--border); border-radius: var(--r-md); padding: 20px 12px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .mood-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-sm); }
  .mood-card.selected { border-color: var(--sage); background: var(--sage-pale); box-shadow: 0 8px 24px rgba(74,124,89,0.15); }
  .mood-emoji { font-size: 36px; margin-bottom: 8px; display: inline-block; }
  .mood-label { font-weight: 700; color: var(--ink); font-size: 15px; margin-bottom: 4px; }
  .mood-sub { font-size: 12px; color: var(--muted); line-height: 1.3; }

  .trigger-section { background: white; padding: 32px; border-radius: var(--r-lg); border: 1px solid var(--border); animation: floatUp 0.4s ease; }
  .trigger-tags { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 24px; }
  .trigger-tag { padding: 8px 16px; background: var(--warm-white); border: 1px solid var(--border); border-radius: 50px; font-size: 14px; font-weight: 500; color: var(--ink-soft); cursor: pointer; transition: all 0.2s; }
  .trigger-tag.selected { background: var(--lavender); color: white; border-color: var(--lavender); }

  /* --- SUCCESS / INSIGHT SCREEN --- */
  .insight-screen { animation: fadeIn 0.6s ease; }
  .streak-badge { display: inline-flex; align-items: center; gap: 8px; background: #FFF4E5; color: #E67E22; padding: 8px 16px; border-radius: 50px; font-weight: 700; font-size: 14px; margin-bottom: 8px; border: 1px solid #FFE0B2; }
  .crisis-banner { background: #FFF0F0; border: 1px solid #FFCDD2; padding: 20px; border-radius: var(--r-md); margin-bottom: 24px; display: flex; gap: 16px; align-items: center; }
  .crisis-banner h4 { color: #C0392B; margin: 0 0 4px; font-size: 16px; }
  .crisis-banner p { color: #E74C3C; margin: 0; font-size: 14px; }
  
  .ai-insight-box { background: var(--lav-pale); border-left: 4px solid var(--lavender); padding: 24px; border-radius: 0 var(--r-md) var(--r-md) 0; margin-bottom: 24px; }
  .action-box { background: white; border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; box-shadow: var(--shadow-sm); }
  .action-box h4 { font-family: 'Fraunces', serif; font-size: 20px; margin-bottom: 16px; color: var(--ink); }
  .action-list { list-style: none; padding: 0; margin: 0; }
  .action-list li { padding: 12px 0; border-bottom: 1px solid var(--border); font-weight: 600; color: var(--ink-soft); display: flex; align-items: center; gap: 12px; }
  .action-list li:last-child { border-bottom: none; }
  .action-list li::before { content: '👉'; }

  .db-btn { background: linear-gradient(135deg, #E8650A, #F0A500); color: white; padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 700; border: none; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(232,101,10,0.2); }
  .db-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(232,101,10,0.3); }
  .db-btn-outline { background: transparent; color: var(--sage); border: 2px solid var(--sage); padding: 10px 24px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.2s; }
  .db-btn-outline:hover { background: var(--sage); color: white; }

  /* --- BREATHING TOOL --- */
  .toolkit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
  .tool-card { background: white; border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; text-align: center; cursor: pointer; transition: 0.2s; }
  .tool-card:hover { border-color: var(--sage); transform: translateY(-4px); box-shadow: var(--shadow-sm); }
  
  .breathe-container { background: var(--lav-pale); border-radius: var(--r-lg); padding: 60px 24px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 450px; border: 1px solid rgba(124,111,160,0.1); }
  .breathe-circle-wrap { width: 240px; height: 240px; position: relative; display: flex; align-items: center; justify-content: center; margin: 40px 0; }
  .breathe-circle { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, var(--lavender), #A89DD0); box-shadow: 0 10px 40px rgba(124,111,160,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 24px; transition: all ease-in-out; }

  /* --- GROUNDING & TIMER TOOLS --- */
  .grounding-list { text-align: left; background: white; padding: 24px; border-radius: var(--r-md); max-width: 400px; margin: 0 auto; box-shadow: var(--shadow-sm); }
  .grounding-list p { margin: 8px 0; font-size: 16px; font-weight: 600; color: var(--ink); display: flex; align-items: center; gap: 12px; }
  .grounding-list p span { background: var(--lav-pale); color: var(--lavender); padding: 4px 12px; border-radius: 20px; font-size: 14px; }
  .timer-display { font-family: 'Fraunces', serif; font-size: 72px; color: var(--ink); margin: 20px 0; }

  /* --- JOURNAL --- */
  .prompt-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
  .prompt-pill { background: white; border: 1px solid var(--sage); color: var(--sage); padding: 8px 16px; border-radius: 50px; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s; }
  .prompt-pill:hover { background: var(--sage); color: white; }
  .privacy-lock { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px; font-size: 13px; color: var(--muted); font-weight: 600; }
`;

const MOODS = [
  { id: 'joy', emoji: '😄', label: 'Joyful', sub: 'Energized, grateful', color: '#f1c40f' },
  { id: 'calm', emoji: '😌', label: 'Calm', sub: 'Stable, okay', color: '#6FAA80' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', sub: 'Racing thoughts, overwhelmed', color: '#7C6FA0' },
  { id: 'sad', emoji: '💧', label: 'Sad', sub: 'Heavy, disconnected', color: '#5B9EBF' },
  { id: 'angry', emoji: '😡', label: 'Angry', sub: 'Frustrated, irritable', color: '#E8845A' }
];

const TRIGGERS = ['📚 Exams / School', '👨‍👩‍👧 Family', '🤝 Friends', '📱 Social Media', '🔮 My Future', '💤 Tired / Health', '❓ I don\'t know'];
const JOURNAL_PROMPTS = ["What's worrying you the most today?", "What is one small win you had today?", "What are you overthinking right now?"];

export default function MindSpace({ userData, onNavigate }) {
  const [activeTab, setActiveTab] = useState('checkin');
  
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [showInsights, setShowInsights] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [journalText, setJournalText] = useState("");

  const [breatheMode, setBreatheMode] = useState(null); 
  const [breathePhase, setBreathePhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);

  const [timerLeft, setTimerLeft] = useState(1500);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = STYLES;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // History & Journal Persistence
  useEffect(() => {
    const savedHistory = localStorage.getItem("moodHistory");
    if(savedHistory) setMoodHistory(JSON.parse(savedHistory));
    const savedJournal = localStorage.getItem("journal");
    if(savedJournal) setJournalText(savedJournal);
  }, []);

  const handleMoodSubmit = () => {
    const newHistory = [...moodHistory, selectedMood];
    if(newHistory.length > 7) newHistory.shift(); 
    setMoodHistory(newHistory);
    localStorage.setItem("moodHistory", JSON.stringify(newHistory));
    setShowInsights(true);
  };

  const getHistoryPattern = () => {
    if(moodHistory.length < 3) return "Log a few more days to see your emotional pattern.";
    const counts = moodHistory.reduce((acc, curr) => { acc[curr] = (acc[curr] || 0) + 1; return acc; }, {});
    const mostFrequent = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const label = MOODS.find(m => m.id === mostFrequent)?.label.toLowerCase();
    return `Pattern: You often feel ${label} during the week.`;
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => { localStorage.setItem("journal", journalText); }, 1000);
    return () => clearTimeout(timeoutId);
  }, [journalText]);

  // Breathing Engine
  useEffect(() => {
    if ((breatheMode !== 'deep' && breatheMode !== 'quick') || breathePhase === 'idle') return;
    let timer;
    const isQuick = breatheMode === 'quick';
    const timings = isQuick ? { in: 4, hold: 0, out: 4, maxCycles: 3 } : { in: 4, hold: 7, out: 8, maxCycles: 4 };

    if (breathePhase === 'inhale') {
      setTimeLeft(timings.in);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { setBreathePhase(timings.hold > 0 ? 'hold' : 'exhale'); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else if (breathePhase === 'hold') {
      setTimeLeft(timings.hold);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { setBreathePhase('exhale'); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else if (breathePhase === 'exhale') {
      setTimeLeft(timings.out);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { 
            if (cycles < timings.maxCycles - 1) { setCycles(c => c + 1); setBreathePhase('inhale'); } 
            else { setBreathePhase('idle'); setCycles(0); }
            return 0; 
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathePhase, cycles, breatheMode]);

  // Timer Engine
  useEffect(() => {
    let interval;
    if (timerActive && timerLeft > 0) {
      interval = setInterval(() => { setTimerLeft(prev => prev - 1); }, 1000);
    } else if (timerLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const startBreathing = (mode) => {
    setBreatheMode(mode);
    setCycles(0);
    if(mode === 'quick' || mode === 'deep') setBreathePhase('inhale');
  };

  const getCircleStyle = () => {
    if (breathePhase === 'idle') return { transform: 'scale(1)', opacity: 1 };
    if (breathePhase === 'inhale') return { transform: 'scale(2.2)', transitionDuration: '4s', opacity: 0.9 };
    if (breathePhase === 'hold') return { transform: 'scale(2.2)', transitionDuration: '7s', opacity: 0.9 };
    if (breathePhase === 'exhale') return { transform: 'scale(1)', transitionDuration: breatheMode === 'quick' ? '4s' : '8s', opacity: 1 };
  };

  // AI Logic
  const generateInsight = () => {
    const triggerText = selectedTriggers.length > 0 ? selectedTriggers[0].substring(2) : 'this';
    if(selectedMood === 'anxious') {
      return `You're feeling anxious because of ${triggerText}. That makes sense — anyone in your situation would feel this way. You're not weak; you're just overloaded. Right now, your brain is trying to protect you from uncertainty, not harm you. Let's slow it down.`;
    }
    if(selectedMood === 'sad' && selectedTriggers.includes('❓ I don\'t know')) {
      return `Feeling heavy without knowing exactly why can be confusing, but it's valid. Sometimes our minds just need a rest before they can process things. Be gentle with yourself today.`;
    }
    return `You're feeling ${MOODS.find(m=>m.id===selectedMood)?.label.toLowerCase()} because of ${triggerText}. That makes sense. Acknowledging where you are is the first step to moving forward.`;
  };

  const getSuggestedActions = () => {
    let actions = [];
    if(selectedMood === 'anxious') actions = ['Try the Quick Calm (30 sec) tool', 'Break your biggest task into 3 tiny steps'];
    else if(selectedMood === 'sad') actions = ['Talk to one trusted person', 'Write 3 thoughts in your Guided Journal'];
    else if(selectedMood === 'angry') actions = ['Take a 2-minute pause away from all screens', 'Do a brain-dump in the journal'];
    else actions = ['Take a mindful breath', 'Keep up the great momentum!'];

    const riasec = userData?.riasecCode || ''; 
    if(riasec.includes('S')) actions.push(<span style={{color: 'var(--sage)'}}>💡 <em>Tip based on your RIASEC profile: As a 'Social' type, talking things out aloud usually helps you process faster than writing.</em></span>);
    else if(riasec.includes('I') || riasec.includes('A')) actions.push(<span style={{color: 'var(--sage)'}}>💡 <em>Tip based on your RIASEC profile: Getting your thoughts down on paper or drawing will help you gain clarity today.</em></span>);
    
    return actions;
  };

  const isCrisis = 
    (selectedMood === 'sad' && selectedTriggers.includes('❓ I don\'t know')) || 
    (selectedMood === 'anxious' && selectedTriggers.includes('🔮 My Future')) ||
    (selectedMood === 'anxious' && selectedTriggers.includes('📚 Exams / School'));

  return (
    <div className="ms-root">
      <div className="ms-header">
        <h1>🧠 Your Safe Space</h1>
        <p>A private sanctuary to track your mood, regulate your mind, and build emotional intelligence.</p>
      </div>

      <div className="ms-tabs">
        <button className={`ms-tab ${activeTab === 'checkin' ? 'active' : ''}`} onClick={() => setActiveTab('checkin')}>🌱 Check-In</button>
        <button className={`ms-tab ${activeTab === 'breathe' ? 'active' : ''}`} onClick={() => {setActiveTab('breathe'); setBreatheMode(null);}}>🛠️ Mental Toolkit</button>
        <button className={`ms-tab ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>📔 Guided Journal</button>
      </div>

      {activeTab === 'checkin' && (
        <div>
          {!showInsights ? (
            <>
              <div className="mood-history-card">
                <div>
                  <h4 style={{margin: '0 0 4px', color: 'var(--ink)'}}>📈 Your Mood Trends (Last 7 Days)</h4>
                  <p style={{margin: 0, fontSize: '13px', color: 'var(--muted)'}}>{getHistoryPattern()}</p>
                </div>
                <div className="history-dots">
                  {moodHistory.map((m, i) => {
                    const color = MOODS.find(mood => mood.id === m)?.color || '#E0E0E0';
                    return <div key={i} className="h-dot" style={{background: color}}></div>
                  })}
                  {[...Array(Math.max(0, 7 - moodHistory.length))].map((_, i) => (
                    <div key={`empty-${i}`} className="h-dot" style={{background: '#E0E0E0', border: '1px dashed #999'}}></div>
                  ))}
                </div>
              </div>

              <h3 style={{fontSize: '20px', color: 'var(--ink)', marginBottom: '20px'}}>How are you feeling right now?</h3>
              <div className="mood-grid">
                {MOODS.map(m => (
                  <div key={m.id} className={`mood-card ${selectedMood === m.id ? 'selected' : ''}`} onClick={() => setSelectedMood(m.id)}>
                    <div className="mood-emoji">{m.emoji}</div>
                    <div className="mood-label">{m.label}</div>
                    <div className="mood-sub">{m.sub}</div>
                  </div>
                ))}
              </div>

              {selectedMood && (
                <div className="trigger-section">
                  <h3 style={{fontSize: '18px', color: 'var(--ink)', marginBottom: '8px'}}>What's heavily on your mind today?</h3>
                  <p style={{color: 'var(--muted)', fontSize: '14px', margin: 0}}>Select any that apply (Optional)</p>
                  
                  <div className="trigger-tags">
                    {TRIGGERS.map(t => (
                      <div key={t} className={`trigger-tag ${selectedTriggers.includes(t) ? 'selected' : ''}`} onClick={() => {
                          if (selectedTriggers.includes(t)) setSelectedTriggers(selectedTriggers.filter(x => x !== t));
                          else setSelectedTriggers([...selectedTriggers, t]);
                        }}>
                        {t}
                      </div>
                    ))}
                  </div>

                  <div className="privacy-lock" style={{justifyContent: 'flex-start', marginBottom: '20px'}}>
                    🔒 Your data is encrypted. Not visible to parents, schools, or counsellors without your consent.
                  </div>

                  <button onClick={handleMoodSubmit} style={{background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px'}}>
                    Save to My Private Log →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="insight-screen">
              <div style={{textAlign: 'center', marginBottom: '32px'}}>
                <div className="streak-badge">🔥 {moodHistory.length} Day Check-in Streak (+5 XP)</div>
                <div style={{marginTop: '4px', fontSize: '13px', color: 'var(--muted)'}}>Keep going! 7-day streak unlocks a premium report 🎁</div>
                <h2 style={{color: 'var(--moss)', fontFamily: "'Fraunces', serif", fontSize: '28px', margin: '24px 0 8px'}}>
                  💚 Naming your emotions = emotional strength.
                </h2>
                <p style={{color: 'var(--muted)'}}>You're doing something most people avoid. Proud of you.</p>
              </div>

              {isCrisis && (
                <div className="crisis-banner">
                  <div style={{fontSize: '32px'}}>💛</div>
                  <div>
                    <h4>You don't have to handle this alone</h4>
                    <p>If you're feeling overwhelmed, please talk to a trusted adult or reach out to our free counsellors in the <strong>Safe Corner</strong> tab.</p>
                  </div>
                </div>
              )}

              <div className="ai-insight-box">
                <div style={{fontWeight: 800, color: 'var(--lavender)', marginBottom: '8px', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase'}}>🧠 AI Reflection</div>
                <div style={{color: 'var(--ink)', fontSize: '16px', lineHeight: 1.6}}>{generateInsight()}</div>
                
                {selectedTriggers.includes('🔮 My Future') && (
                  <div style={{marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed rgba(124,111,160,0.3)'}}>
                    <p style={{color: 'var(--ink-soft)', fontWeight: 600, margin: '0 0 12px'}}>🧭 This might be connected to career uncertainty. Would you like to explore paths that match your strengths?</p>
                    {/* TRIGGER DASHBOARD NAVIGATION HERE */}
                    <button className="db-btn" style={{padding: '8px 16px', fontSize: '13px'}} onClick={() => onNavigate('careers')}>Explore My Career Path →</button>
                  </div>
                )}
              </div>

              <div className="action-box">
                <h4>💡 Suggested Actions for You Today</h4>
                <ul className="action-list">
                  {getSuggestedActions().map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              {/* CRITICAL: NEXT STEP CTA */}
              <div style={{display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px'}}>
                <button className="db-btn" onClick={() => onNavigate('careers')}>🎯 View Career Matches</button>
                <button className="db-btn-outline" onClick={() => onNavigate('counsellor')}>🧑‍🏫 Talk to Counsellor</button>
              </div>

              <div style={{textAlign: 'center', marginTop: '24px'}}>
                <button onClick={() => {setShowInsights(false); setSelectedMood(null); setSelectedTriggers([]);}} style={{background: 'none', border: 'none', color: 'var(--muted)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline'}}>
                  Log another mood
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'breathe' && (
        <div>
          {!breatheMode ? (
            <>
              <h3 style={{fontSize: '20px', color: 'var(--ink)', marginBottom: '20px'}}>Choose your tool for right now:</h3>
              <div className="toolkit-grid">
                <div className="tool-card" onClick={() => startBreathing('quick')}><div style={{fontSize: '40px', marginBottom: '12px'}}>⚡</div><h4 style={{margin: '0 0 8px', fontSize: '18px', color: 'var(--ink)'}}>Quick Calm (30 sec)</h4><p style={{margin: 0, fontSize: '14px', color: 'var(--muted)'}}>3 deep breaths. Perfect for pre-exam panic or sudden stress.</p></div>
                <div className="tool-card" onClick={() => startBreathing('deep')}><div style={{fontSize: '40px', marginBottom: '12px'}}>🌬️</div><h4 style={{margin: '0 0 8px', fontSize: '18px', color: 'var(--ink)'}}>Deep Reset (4-7-8)</h4><p style={{margin: 0, fontSize: '14px', color: 'var(--muted)'}}>Clinical breathing to stimulate the vagus nerve and lower heart rate.</p></div>
                <div className="tool-card" onClick={() => setBreatheMode('grounding')}><div style={{fontSize: '40px', marginBottom: '12px'}}>🖐️</div><h4 style={{margin: '0 0 8px', fontSize: '18px', color: 'var(--ink)'}}>Grounding (5-4-3-2-1)</h4><p style={{margin: 0, fontSize: '14px', color: 'var(--muted)'}}>Pull your brain out of an anxiety loop using your senses.</p></div>
                <div className="tool-card" onClick={() => setBreatheMode('timer')}><div style={{fontSize: '40px', marginBottom: '12px'}}>⏱️</div><h4 style={{margin: '0 0 8px', fontSize: '18px', color: 'var(--ink)'}}>Focus Timer</h4><p style={{margin: 0, fontSize: '14px', color: 'var(--muted)'}}>25-minute Pomodoro timer for distraction-free studying.</p></div>
              </div>
            </>
          ) : (
            <div className="breathe-container">
              {breatheMode === 'quick' || breatheMode === 'deep' ? (
                <>
                  <div className="breathe-instruction">
                    {breathePhase === 'idle' ? (breatheMode === 'quick' ? 'Quick Calm (30s)' : 'Deep Calm (4-7-8)') : ''}
                    {breathePhase === 'inhale' ? 'Breathe in...' : ''}
                    {breathePhase === 'hold' ? 'Hold it...' : ''}
                    {breathePhase === 'exhale' ? 'Exhale slowly...' : ''}
                  </div>
                  <div className="breathe-circle-wrap"><div className="breathe-circle" style={getCircleStyle()}>{breathePhase !== 'idle' && timeLeft}</div></div>
                  {breathePhase === 'idle' && (<button className="btn-breathe" onClick={() => startBreathing(breatheMode)}>Start Exercise</button>)}
                  {breathePhase !== 'idle' && (<div style={{color: 'var(--lavender)', fontWeight: 'bold', marginTop: '20px'}}>Cycle {cycles + 1} of {breatheMode === 'quick' ? 3 : 4}</div>)}
                </>
              ) : breatheMode === 'grounding' ? (
                <>
                  <div className="breathe-instruction" style={{color: 'var(--ink)'}}>The 5-4-3-2-1 Method</div>
                  <p style={{color: 'var(--muted)', marginBottom: '32px'}}>Look around you and name out loud:</p>
                  <div className="grounding-list">
                    <p><span>5</span> things you can <strong>see</strong></p>
                    <p><span>4</span> things you can <strong>feel</strong></p>
                    <p><span>3</span> things you can <strong>hear</strong></p>
                    <p><span>2</span> things you can <strong>smell</strong></p>
                    <p><span>1</span> thing you can <strong>taste</strong></p>
                  </div>
                </>
              ) : breatheMode === 'timer' ? (
                <>
                  <div className="breathe-instruction" style={{color: 'var(--ink)'}}>Focus Timer</div>
                  <p style={{color: 'var(--muted)'}}>Put your phone away. Focus on one task.</p>
                  <div className="timer-display">{formatTime(timerLeft)}</div>
                  <div>
                    <button className="btn-breathe" style={{marginRight: '12px'}} onClick={() => setTimerActive(!timerActive)}>{timerActive ? 'Pause' : 'Start'}</button>
                    <button className="btn-breathe" style={{background: 'white', color: 'var(--lavender)', border: '1px solid var(--lavender)'}} onClick={() => {setTimerActive(false); setTimerLeft(1500);}}>Reset</button>
                  </div>
                </>
              ) : null}
              <button onClick={() => {setBreatheMode(null); setBreathePhase('idle'); setTimerActive(false);}} style={{marginTop: '40px', background: 'none', border: 'none', color: 'var(--muted)', fontWeight: 600, cursor: 'pointer'}}>← Back to Toolkit</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'journal' && (
        <div style={{background: 'white', padding: '40px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)'}}>
          <h2 style={{color: 'var(--ink)', fontFamily: "'Fraunces', serif", margin: '0 0 16px'}}>Guided Journal</h2>
          <p style={{color: 'var(--muted)', marginBottom: '24px'}}>Sometimes the best way to untangle your thoughts is to put them on paper. Pick a prompt to get started:</p>
          <div className="prompt-pills">
            {JOURNAL_PROMPTS.map((prompt, i) => (
              <div key={i} className="prompt-pill" onClick={() => setJournalText((prev) => prev ? `${prev}\n\n** ${prompt} **\n` : `** ${prompt} **\n\n`)}>
                {prompt}
              </div>
            ))}
          </div>
          <textarea value={journalText} onChange={(e) => setJournalText(e.target.value)} placeholder="Just start typing here. Your progress is auto-saved locally." style={{width: '100%', minHeight: '250px', padding: '20px', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--warm-white)', fontFamily: 'inherit', fontSize: '15px', resize: 'vertical', outline: 'none'}}></textarea>
          <div className="privacy-lock">🔒 Your data is encrypted. Not visible to parents, schools, or counsellors without your consent.</div>
        </div>
      )}
    </div>
  );
}
