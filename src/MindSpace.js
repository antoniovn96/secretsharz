import React, { useState, useEffect } from 'react';

const STYLES = `
  .ms-root {
    max-width: 1000px;
    margin: 40px auto;
    padding: 0 24px;
    animation: fadeIn 0.5s ease;
  }
  .ms-header { margin-bottom: 32px; }
  .ms-header h1 {
    font-family: 'Fraunces', serif;
    font-size: 36px;
    color: var(--ink);
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }
  .ms-header p { font-size: 16px; color: var(--muted); }
  
  .ms-tabs {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 16px;
    overflow-x: auto;
  }
  .ms-tab {
    padding: 10px 24px;
    border-radius: 50px;
    background: transparent;
    color: var(--muted);
    font-weight: 600;
    font-size: 15px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    font-family: inherit;
  }
  .ms-tab:hover { background: var(--sage-pale); color: var(--sage); }
  .ms-tab.active {
    background: var(--sage);
    color: white;
    box-shadow: 0 4px 12px rgba(74,124,89,0.3);
  }
  
  /* --- MOOD TRACKER --- */
  .mood-history-card {
    background: white; border: 1px solid var(--border); border-radius: var(--r-md);
    padding: 20px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center;
  }
  .history-dots { display: flex; gap: 8px; }
  .h-dot { width: 16px; height: 16px; border-radius: 50%; opacity: 0.8; }
  
  .mood-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px; margin-bottom: 32px;
  }
  .mood-card {
    background: white; border: 2px solid var(--border); border-radius: var(--r-md);
    padding: 20px 12px; text-align: center; cursor: pointer; transition: all 0.2s;
  }
  .mood-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-sm); }
  .mood-card.selected {
    border-color: var(--sage); background: var(--sage-pale); box-shadow: 0 8px 24px rgba(74,124,89,0.15);
  }
  .mood-emoji { font-size: 36px; margin-bottom: 8px; display: inline-block; }
  .mood-label { font-weight: 700; color: var(--ink); font-size: 15px; margin-bottom: 4px; }
  .mood-sub { font-size: 12px; color: var(--muted); line-height: 1.3; }

  .trigger-section {
    background: white; padding: 32px; border-radius: var(--r-lg);
    border: 1px solid var(--border); animation: floatUp 0.4s ease;
  }
  .trigger-tags { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0 24px; }
  .trigger-tag {
    padding: 8px 16px; background: var(--warm-white); border: 1px solid var(--border);
    border-radius: 50px; font-size: 14px; font-weight: 500; color: var(--ink-soft); cursor: pointer; transition: all 0.2s;
  }
  .trigger-tag.selected { background: var(--lavender); color: white; border-color: var(--lavender); }

  /* --- SUCCESS / INSIGHT SCREEN --- */
  .insight-screen { animation: fadeIn 0.6s ease; }
  .streak-badge {
    display: inline-flex; align-items: center; gap: 8px; background: #FFF4E5; color: #E67E22;
    padding: 8px 16px; border-radius: 50px; font-weight: 700; font-size: 14px; margin-bottom: 24px;
    border: 1px solid #FFE0B2;
  }
  .crisis-banner {
    background: #FFF0F0; border: 1px solid #FFCDD2; padding: 20px; border-radius: var(--r-md);
    margin-bottom: 24px; display: flex; gap: 16px; align-items: center;
  }
  .crisis-banner h4 { color: #C0392B; margin: 0 0 4px; font-size: 16px; }
  .crisis-banner p { color: #E74C3C; margin: 0; font-size: 14px; }
  
  .ai-insight-box {
    background: var(--lav-pale); border-left: 4px solid var(--lavender); padding: 24px;
    border-radius: 0 var(--r-md) var(--r-md) 0; margin-bottom: 24px;
  }
  .action-box {
    background: white; border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px;
    box-shadow: var(--shadow-sm);
  }
  .action-box h4 { font-family: 'Fraunces', serif; font-size: 20px; margin-bottom: 16px; color: var(--ink); }
  .action-list { list-style: none; padding: 0; margin: 0; }
  .action-list li {
    padding: 12px 0; border-bottom: 1px solid var(--border); font-weight: 600; color: var(--ink-soft);
    display: flex; align-items: center; gap: 12px;
  }
  .action-list li:last-child { border-bottom: none; }
  .action-list li::before { content: '👉'; }

  /* --- BREATHING TOOL --- */
  .toolkit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
  .tool-card {
    background: white; border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px;
    text-align: center; cursor: pointer; transition: 0.2s;
  }
  .tool-card:hover { border-color: var(--sage); transform: translateY(-4px); box-shadow: var(--shadow-sm); }
  
  .breathe-container {
    background: var(--lav-pale); border-radius: var(--r-lg); padding: 60px 24px;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; min-height: 450px; border: 1px solid rgba(124,111,160,0.1);
  }
  .breathe-circle-wrap {
    width: 240px; height: 240px; position: relative; display: flex; align-items: center;
    justify-content: center; margin: 40px 0;
  }
  .breathe-circle {
    width: 100px; height: 100px; border-radius: 50%;
    background: linear-gradient(135deg, var(--lavender), #A89DD0);
    box-shadow: 0 10px 40px rgba(124,111,160,0.4);
    display: flex; align-items: center; justify-content: center; color: white;
    font-weight: 700; font-size: 24px; transition: all ease-in-out;
  }

  /* --- JOURNAL --- */
  .prompt-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
  .prompt-pill {
    background: white; border: 1px solid var(--sage); color: var(--sage); padding: 8px 16px;
    border-radius: 50px; font-size: 13px; font-weight: 600; cursor: pointer; transition: 0.2s;
  }
  .prompt-pill:hover { background: var(--sage); color: white; }
  .privacy-lock {
    display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 16px;
    font-size: 13px; color: var(--muted); font-weight: 600;
  }
`;

const MOODS = [
  { id: 'joy', emoji: '😄', label: 'Joyful', sub: 'Energized, grateful' },
  { id: 'calm', emoji: '😌', label: 'Calm', sub: 'Stable, okay' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', sub: 'Racing thoughts, overwhelmed' },
  { id: 'sad', emoji: '💧', label: 'Sad', sub: 'Heavy, disconnected' },
  { id: 'angry', emoji: '😡', label: 'Angry', sub: 'Frustrated, irritable' }
];

const TRIGGERS = ['📚 Exams / School', '👨‍👩‍👧 Family', '🤝 Friends', '📱 Social Media', '🔮 My Future', '💤 Tired / Health', '❓ I don\'t know'];
const JOURNAL_PROMPTS = ["What's worrying you the most today?", "What is one small win you had today?", "What are you overthinking right now?"];

export default function MindSpace() {
  const [activeTab, setActiveTab] = useState('checkin');
  
  // Mood State
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [showInsights, setShowInsights] = useState(false);
  const [journalText, setJournalText] = useState("");

  // Breathing State
  const [breatheMode, setBreatheMode] = useState(null); // 'deep', 'quick', null
  const [breathePhase, setBreathePhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = STYLES;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // --- BREATHING LOGIC ---
  useEffect(() => {
    if (!breatheMode || breathePhase === 'idle') return;
    
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
            if (cycles < timings.maxCycles - 1) {
              setCycles(c => c + 1);
              setBreathePhase('inhale'); 
            } else {
              setBreathePhase('idle');
              setCycles(0);
            }
            return 0; 
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [breathePhase, cycles, breatheMode]);

  const startBreathing = (mode) => {
    setBreatheMode(mode);
    setCycles(0);
    setBreathePhase('inhale');
  };

  const getCircleStyle = () => {
    if (breathePhase === 'idle') return { transform: 'scale(1)', opacity: 1 };
    if (breathePhase === 'inhale') return { transform: 'scale(2.2)', transitionDuration: '4s', opacity: 0.9 };
    if (breathePhase === 'hold') return { transform: 'scale(2.2)', transitionDuration: '7s', opacity: 0.9 };
    if (breathePhase === 'exhale') return { transform: 'scale(1)', transitionDuration: breatheMode === 'quick' ? '4s' : '8s', opacity: 1 };
  };

  const getInstruction = () => {
    if (breathePhase === 'idle') return breatheMode === 'quick' ? 'Quick Calm (30s)' : 'Deep Calm (4-7-8)';
    if (breathePhase === 'inhale') return 'Breathe in...';
    if (breathePhase === 'hold') return 'Hold it...';
    if (breathePhase === 'exhale') return 'Exhale slowly...';
  };

  // --- AI INSIGHTS & ACTIONS LOGIC ---
  const generateInsight = () => {
    if(selectedMood === 'anxious' && selectedTriggers.includes('📚 Exams / School')) {
        return "It seems like your stress is mainly coming from exams and future expectations. This is very common at your stage. Remember, your grades don't define your entire worth.";
    }
    if(selectedMood === 'sad' && selectedTriggers.includes('❓ I don\'t know')) {
        return "Feeling heavy without knowing exactly why can be confusing, but it's valid. Sometimes our minds just need a rest before they can process things.";
    }
    const triggerText = selectedTriggers.length > 0 ? `dealing with ${selectedTriggers[0].substring(2)}` : 'navigating today';
    return `It's completely normal to feel ${MOODS.find(m=>m.id===selectedMood)?.label.toLowerCase()} sometimes, especially when ${triggerText}. Acknowledging it is the first step.`;
  };

  const getSuggestedActions = () => {
    let actions = [];
    if(selectedMood === 'anxious') actions = ['Try the Quick Calm (30 sec) tool', 'Break your biggest task into 3 tiny steps'];
    else if(selectedMood === 'sad') actions = ['Talk to one trusted person', 'Write 3 thoughts in your Guided Journal'];
    else if(selectedMood === 'angry') actions = ['Take a 2-minute pause away from all screens', 'Do a brain-dump in the journal'];
    else actions = ['Take a mindful breath', 'Keep up the great momentum!'];

    // RIASEC Personalisation Hint
    actions.push(<span style={{color: 'var(--sage)'}}>💡 <em>Tip based on your RIASEC profile: As a 'Social' type, talking things out aloud usually helps you process faster than writing.</em></span>);
    return actions;
  };

  const isCrisis = (selectedMood === 'sad' && selectedTriggers.includes('❓ I don\'t know')) || selectedMood === 'anxious';

  return (
    <div className="ms-root">
      <div className="ms-header">
        <h1>🧠 Your Safe Space</h1>
        <p>A private sanctuary to track your mood, regulate your mind, and build emotional intelligence.</p>
      </div>

      <div className="ms-tabs">
        <button className={`ms-tab ${activeTab === 'checkin' ? 'active' : ''}`} onClick={() => setActiveTab('checkin')}>
          🌱 Check-In
        </button>
        <button className={`ms-tab ${activeTab === 'breathe' ? 'active' : ''}`} onClick={() => {setActiveTab('breathe'); setBreatheMode(null);}}>
          🛠️ Mental Toolkit
        </button>
        <button className={`ms-tab ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>
          📔 Guided Journal
        </button>
      </div>

      {/* --- MOOD TRACKER TAB --- */}
      {activeTab === 'checkin' && (
        <div>
          {!showInsights ? (
            <>
              {/* 7-Day History Mockup */}
              <div className="mood-history-card">
                <div>
                  <h4 style={{margin: '0 0 4px', color: 'var(--ink)'}}>📈 Your Mood Trends (Last 7 Days)</h4>
                  <p style={{margin: 0, fontSize: '13px', color: 'var(--muted)'}}>Pattern: You feel anxious mostly during weekdays.</p>
                </div>
                <div className="history-dots">
                  <div className="h-dot" style={{background: '#6FAA80'}}></div>
                  <div className="h-dot" style={{background: '#5B9EBF'}}></div>
                  <div className="h-dot" style={{background: '#E8845A'}}></div>
                  <div className="h-dot" style={{background: '#7C6FA0'}}></div>
                  <div className="h-dot" style={{background: '#7C6FA0'}}></div>
                  <div className="h-dot" style={{background: '#6FAA80'}}></div>
                  <div className="h-dot" style={{background: '#E0E0E0', border: '1px dashed #999'}}></div>
                </div>
              </div>

              <h3 style={{fontSize: '20px', color: 'var(--ink)', marginBottom: '20px'}}>How are you feeling right now?</h3>
              <div className="mood-grid">
                {MOODS.map(m => (
                  <div 
                    key={m.id} 
                    className={`mood-card ${selectedMood === m.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMood(m.id)}
                  >
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
                      <div 
                        key={t} 
                        className={`trigger-tag ${selectedTriggers.includes(t) ? 'selected' : ''}`}
                        onClick={() => {
                          if (selectedTriggers.includes(t)) setSelectedTriggers(selectedTriggers.filter(x => x !== t));
                          else setSelectedTriggers([...selectedTriggers, t]);
                        }}
                      >
                        {t}
                      </div>
                    ))}
                  </div>

                  <div className="privacy-lock" style={{justifyContent: 'flex-start', marginBottom: '20px'}}>
                    🔒 Only you can see this. Not even your parents or school.
                  </div>

                  <button 
                    onClick={() => setShowInsights(true)}
                    style={{background: 'var(--sage)', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', fontSize: '15px'}}
                  >
                    Save to My Private Log →
                  </button>
                </div>
              )}
            </>
          ) : (
            /* --- SUCCESS & ACTION SCREEN --- */
            <div className="insight-screen">
              <div style={{textAlign: 'center', marginBottom: '32px'}}>
                <div className="streak-badge">🔥 3 Day Check-in Streak (+5 XP)</div>
                <h2 style={{color: 'var(--moss)', fontFamily: "'Fraunces', serif", fontSize: '28px', margin: '0 0 8px'}}>
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
              </div>

              <div className="action-box">
                <h4>💡 Suggested Actions for You Today</h4>
                <ul className="action-list">
                  {getSuggestedActions().map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>

              <div style={{textAlign: 'center', marginTop: '32px'}}>
                <button onClick={() => {setShowInsights(false); setSelectedMood(null); setSelectedTriggers([]);}} style={{background: 'none', border: 'none', color: 'var(--muted)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline'}}>
                  Log another mood
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- MENTAL TOOLKIT TAB --- */}
      {activeTab === 'breathe' && (
        <div>
          {!breatheMode ? (
            <>
              <h3 style={{fontSize: '20px', color: 'var(--ink)', marginBottom: '20px'}}>Choose your tool for right now:</h3>
              <div className="toolkit-grid">
                <div className="tool-card" onClick={() => startBreathing('quick')}>
                  <div style={{fontSize: '40px', marginBottom: '12px'}}>⚡</div>
                  <h4 style={{margin: '0 0 8px', fontSize: '18px', color: 'var(--ink)'}}>Quick Calm (30 sec)</h4>
                  <p style={{margin: 0, fontSize: '14px', color: 'var(--muted)'}}>3 deep breaths. Perfect for pre-exam panic or sudden stress.</p>
                </div>
                <div className="tool-card" onClick={() => startBreathing('deep')}>
                  <div style={{fontSize: '40px', marginBottom: '12px'}}>🌬️</div>
                  <h4 style={{margin: '0 0 8px', fontSize: '18px', color: 'var(--ink)'}}>Deep Reset (4-7-8)</h4>
                  <p style={{margin: 0, fontSize: '14px', color: 'var(--muted)'}}>Clinical breathing to stimulate the vagus nerve and lower heart rate.</p>
                </div>
                <div className="tool-card">
                  <div style={{fontSize: '40px', marginBottom: '12px'}}>🖐️</div>
                  <h4 style={{margin: '0 0 8px', fontSize: '18px', color: 'var(--ink)'}}>Grounding (5-4-3-2-1)</h4>
                  <p style={{margin: 0, fontSize: '14px', color: 'var(--muted)'}}>Pull your brain out of an anxiety loop using your senses.</p>
                </div>
                <div className="tool-card">
                  <div style={{fontSize: '40px', marginBottom: '12px'}}>⏱️</div>
                  <h4 style={{margin: '0 0 8px', fontSize: '18px', color: 'var(--ink)'}}>Focus Timer</h4>
                  <p style={{margin: 0, fontSize: '14px', color: 'var(--muted)'}}>25-minute Pomodoro timer for distraction-free studying.</p>
                </div>
              </div>
            </>
          ) : (
            <div className="breathe-container">
              <div className="breathe-instruction">{getInstruction()}</div>
              
              <div className="breathe-circle-wrap">
                <div className="breathe-circle" style={getCircleStyle()}>
                  {breathePhase !== 'idle' && timeLeft}
                </div>
              </div>

              {breathePhase === 'idle' && (
                <button className="btn-breathe" onClick={() => startBreathing(breatheMode)}>
                  Start Exercise
                </button>
              )}
              {breathePhase !== 'idle' && (
                <div style={{color: 'var(--lavender)', fontWeight: 'bold', marginTop: '20px'}}>
                  Cycle {cycles + 1} of {breatheMode === 'quick' ? 3 : 4}
                </div>
              )}
              
              <button 
                onClick={() => {setBreatheMode(null); setBreathePhase('idle');}} 
                style={{marginTop: '32px', background: 'none', border: 'none', color: 'var(--muted)', fontWeight: 600, cursor: 'pointer'}}
              >
                ← Back to Toolkit
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- GUIDED JOURNAL TAB --- */}
      {activeTab === 'journal' && (
        <div style={{background: 'white', padding: '40px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)'}}>
          <h2 style={{color: 'var(--ink)', fontFamily: "'Fraunces', serif", margin: '0 0 16px'}}>Guided Journal</h2>
          <p style={{color: 'var(--muted)', marginBottom: '24px'}}>Sometimes the best way to untangle your thoughts is to put them on paper. Pick a prompt to get started:</p>
          
          <div className="prompt-pills">
            {JOURNAL_PROMPTS.map((prompt, i) => (
              <div key={i} className="prompt-pill" onClick={() => setJournalText(`** ${prompt} **\n\n`)}>
                {prompt}
              </div>
            ))}
          </div>

          <textarea 
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Just start typing here..." 
            style={{width: '100%', minHeight: '250px', padding: '20px', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--warm-white)', fontFamily: 'inherit', fontSize: '15px', resize: 'vertical', outline: 'none'}}
          ></textarea>

          <div className="privacy-lock">
            🔒 Only you can see this. Not even your parents or school.
          </div>
        </div>
      )}
    </div>
  );
}
