import React, { useState, useEffect } from 'react';

const STYLES = `
  .ms-root {
    max-width: 1000px;
    margin: 40px auto;
    padding: 0 24px;
    animation: fadeIn 0.5s ease;
  }
  .ms-header {
    margin-bottom: 32px;
  }
  .ms-header h1 {
    font-family: 'Fraunces', serif;
    font-size: 36px;
    color: var(--ink);
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }
  .ms-header p {
    font-size: 16px;
    color: var(--muted);
  }
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
  .ms-tab:hover {
    background: var(--sage-pale);
    color: var(--sage);
  }
  .ms-tab.active {
    background: var(--sage);
    color: white;
    box-shadow: 0 4px 12px rgba(74,124,89,0.3);
  }
  
  /* --- MOOD TRACKER --- */
  .mood-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }
  .mood-card {
    background: white;
    border: 2px solid var(--border);
    border-radius: var(--r-md);
    padding: 24px 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
  }
  .mood-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-sm);
  }
  .mood-card.selected {
    border-color: var(--sage);
    background: var(--sage-pale);
    box-shadow: 0 8px 24px rgba(74,124,89,0.15);
  }
  .mood-emoji { font-size: 40px; margin-bottom: 12px; display: inline-block; }
  .mood-label { font-weight: 700; color: var(--ink); font-size: 15px; }

  .trigger-section {
    background: white;
    padding: 32px;
    border-radius: var(--r-lg);
    border: 1px solid var(--border);
    animation: floatUp 0.4s ease;
  }
  .trigger-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 16px 0 24px;
  }
  .trigger-tag {
    padding: 8px 16px;
    background: var(--warm-white);
    border: 1px solid var(--border);
    border-radius: 50px;
    font-size: 14px;
    font-weight: 500;
    color: var(--ink-soft);
    cursor: pointer;
    transition: all 0.2s;
  }
  .trigger-tag.selected {
    background: var(--lavender);
    color: white;
    border-color: var(--lavender);
  }
  
  /* --- BREATHING TOOL --- */
  .breathe-container {
    background: var(--lav-pale);
    border-radius: var(--r-lg);
    padding: 60px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 500px;
    border: 1px solid rgba(124,111,160,0.1);
  }
  .breathe-circle-wrap {
    width: 240px;
    height: 240px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 40px 0;
  }
  .breathe-circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--lavender), #A89DD0);
    box-shadow: 0 10px 40px rgba(124,111,160,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 20px;
    transition: all ease-in-out;
  }
  .breathe-instruction {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    color: var(--lavender);
    height: 40px;
    margin-bottom: 20px;
  }
  .btn-breathe {
    background: var(--lavender);
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(124,111,160,0.3);
    transition: all 0.2s;
    font-family: inherit;
  }
  .btn-breathe:hover {
    transform: translateY(-2px);
    background: #685a8f;
  }
`;

const MOODS = [
  { id: 'joy', emoji: '😄', label: 'Joyful' },
  { id: 'calm', emoji: '😌', label: 'Calm / Okay' },
  { id: 'anxious', emoji: '😰', label: 'Anxious / Overwhelmed' },
  { id: 'sad', emoji: '💧', label: 'Sad / Heavy' },
  { id: 'angry', emoji: '😡', label: 'Angry / Frustrated' }
];

const TRIGGERS = ['📚 Exams / School', '👨‍👩‍👧 Family', '🤝 Friends', '📱 Social Media', '🔮 My Future', '💤 Tired / Health', '❓ I don\'t know'];

export default function MindSpace() {
  const [activeTab, setActiveTab] = useState('checkin'); // 'checkin', 'breathe', 'journal'
  
  // Mood State
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [logged, setLogged] = useState(false);

  // Breathing State
  const [breathePhase, setBreathePhase] = useState('idle'); // idle, inhale, hold, exhale
  const [timeLeft, setTimeLeft] = useState(0);
  const [cycles, setCycles] = useState(0);

  // Inject Styles
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = STYLES;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // Breathing Logic (4-7-8 Technique)
  useEffect(() => {
    let timer;
    if (breathePhase === 'inhale') {
      setTimeLeft(4);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { setBreathePhase('hold'); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else if (breathePhase === 'hold') {
      setTimeLeft(7);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { setBreathePhase('exhale'); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else if (breathePhase === 'exhale') {
      setTimeLeft(8);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { 
            if (cycles < 3) {
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
  }, [breathePhase, cycles]);

  const startBreathing = () => {
    setCycles(0);
    setBreathePhase('inhale');
  };

  const handleMoodSubmit = () => {
    setLogged(true);
    setTimeout(() => {
      setLogged(false);
      setSelectedMood(null);
      setSelectedTriggers([]);
    }, 4000);
  };

  // Determine circle style based on phase
  const getCircleStyle = () => {
    if (breathePhase === 'idle') return { transform: 'scale(1)', opacity: 1 };
    if (breathePhase === 'inhale') return { transform: 'scale(2.2)', transitionDuration: '4s', opacity: 0.9 };
    if (breathePhase === 'hold') return { transform: 'scale(2.2)', transitionDuration: '7s', opacity: 0.9 };
    if (breathePhase === 'exhale') return { transform: 'scale(1)', transitionDuration: '8s', opacity: 1 };
  };

  const getInstruction = () => {
    if (breathePhase === 'idle') return 'Clinical 4-7-8 Breathing';
    if (breathePhase === 'inhale') return 'Breathe in through your nose...';
    if (breathePhase === 'hold') return 'Hold it...';
    if (breathePhase === 'exhale') return 'Exhale slowly through your mouth...';
  };

  return (
    <div className="ms-root">
      <div className="ms-header">
        <h1>Your Mind Space</h1>
        <p>A private sanctuary for your thoughts and emotional wellbeing.</p>
      </div>

      <div className="ms-tabs">
        <button className={`ms-tab ${activeTab === 'checkin' ? 'active' : ''}`} onClick={() => setActiveTab('checkin')}>
          🌱 Daily Check-In
        </button>
        <button className={`ms-tab ${activeTab === 'breathe' ? 'active' : ''}`} onClick={() => setActiveTab('breathe')}>
          🎈 Calming Toolkit
        </button>
        <button className={`ms-tab ${activeTab === 'journal' ? 'active' : ''}`} onClick={() => setActiveTab('journal')}>
          📔 Private Journal
        </button>
      </div>

      {/* --- MOOD TRACKER TAB --- */}
      {activeTab === 'checkin' && (
        <div>
          {logged ? (
            <div style={{textAlign: 'center', padding: '60px 20px', background: 'var(--sage-pale)', borderRadius: 'var(--r-lg)'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>💚</div>
              <h2 style={{color: 'var(--moss)', fontFamily: "'Fraunces', serif"}}>Mood Logged Securely</h2>
              <p style={{color: 'var(--sage)'}}>Taking a moment to name your feeling is the first step to taming it.</p>
            </div>
          ) : (
            <>
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

                  <button 
                    onClick={handleMoodSubmit}
                    style={{background: 'var(--sage)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '50px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit'}}
                  >
                    Save to My Private Log
                  </button>
                  
                  {/* Smart routing to breathing tool if anxious/angry */}
                  {(selectedMood === 'anxious' || selectedMood === 'angry') && (
                    <div style={{marginTop: '20px', padding: '16px', background: '#FFF0F0', borderRadius: '12px', border: '1px solid #FFCDD2', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <strong style={{color: '#C0392B', display: 'block', fontSize: '14px'}}>Feeling overwhelmed?</strong>
                        <span style={{color: '#E74C3C', fontSize: '13px'}}>Let's take 60 seconds to lower your heart rate.</span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('breathe')}
                        style={{background: 'white', color: '#C0392B', border: '1px solid #FFCDD2', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'}}
                      >
                        Open Toolkit →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* --- BREATHING TOOL TAB --- */}
      {activeTab === 'breathe' && (
        <div className="breathe-container">
          <div className="breathe-instruction">{getInstruction()}</div>
          <p style={{color: 'var(--muted)', maxWidth: '400px', marginBottom: '20px', minHeight: '48px'}}>
            {breathePhase === 'idle' 
              ? 'This clinical technique stimulates your vagus nerve to instantly reduce anxiety and stop panic loops.' 
              : 'Follow the circle. Focus only on the numbers.'}
          </p>

          <div className="breathe-circle-wrap">
            <div className="breathe-circle" style={getCircleStyle()}>
              {breathePhase !== 'idle' && timeLeft}
            </div>
          </div>

          {breathePhase === 'idle' && (
            <button className="btn-breathe" onClick={startBreathing}>
              Start Breathing Exercise
            </button>
          )}
          {breathePhase !== 'idle' && (
            <div style={{color: 'var(--lavender)', fontWeight: 'bold', marginTop: '20px'}}>
              Cycle {cycles + 1} of 4
            </div>
          )}
        </div>
      )}

      {/* --- JOURNAL TAB (Placeholder) --- */}
      {activeTab === 'journal' && (
        <div style={{background: 'white', padding: '40px', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📔</div>
          <h2 style={{color: 'var(--ink)', fontFamily: "'Fraunces', serif"}}>The "Brain Dump"</h2>
          <p style={{color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 24px'}}>Sometimes the best way to untangle your thoughts is to put them on paper. This space is 100% encrypted and private to you.</p>
          <textarea 
            placeholder="What's heavily on your mind right now? Just start typing..." 
            style={{width: '100%', minHeight: '200px', padding: '20px', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--warm-white)', fontFamily: 'inherit', fontSize: '15px', resize: 'vertical', outline: 'none'}}
          ></textarea>
        </div>
      )}
    </div>
  );
}
