import React, { useState, useEffect } from 'react';

const WIDGET_CATEGORIES = [
  { id: 'calm', label: '😰 Calm Anxiety', color: '#4A7C59' }, 
  { id: 'vent', label: '😡 Release Anger', color: '#ef4444' }, 
  { id: 'mood', label: '😞 Lift Mood', color: '#E8845A' }, 
  { id: 'focus', label: '😵 Focus Better', color: '#5B9EBF' }, 
  { id: 'sleep', label: '😴 Relax / Sleep', color: '#7C6FA0' }, 
  { id: 'clear', label: '🧠 Clear Mind', color: '#1E2820' } 
];

const WIDGET_TOOLS = {
  calm: [
    { id: 'c1', title: '4-7-8 Breathing', desc: 'A proven rhythm to instantly lower heart rate.', icon: '🫁', duration: '2 min', type: 'breathing' },
    { id: 'c3', title: 'Box Breathing', desc: 'Equal inhales, holds, and exhales for balance.', icon: '🔲', duration: '2 min', type: 'box_breathing' },
    { id: 'c2', title: '5-4-3-2-1 Grounding', desc: 'Bring your mind back to the present room.', icon: '🖐️', duration: '1 min', type: 'checklist_grounding' },
    { id: 'c4', title: 'Heartbeat Sync', desc: 'Focus on a calming visual pulse.', icon: '💓', duration: '1 min', type: 'pulse' }
  ],
  vent: [
    { id: 'v1', title: 'Pop the Thoughts', desc: 'Tap to visually destroy anxious thoughts.', icon: '🫧', duration: '1 min', type: 'game_pop' },
    { id: 'v2', title: 'Brain Dump Timer', desc: 'Type everything out without stopping.', icon: '⌨️', duration: '2 min', type: 'timer' },
    { id: 'v3', title: 'Write & Destroy', desc: 'Type what is bothering you, then watch it burn.', icon: '🔥', duration: '1 min', type: 'destroy' },
    { id: 'v4', title: 'Stress Tap', desc: 'Release physical energy through rapid tapping.', icon: '⚡', duration: '1 min', type: 'tap' }
  ],
  mood: [
    { id: 'm1', title: 'Gratitude Quick-Write', desc: 'Name 3 things that don\'t suck right now.', icon: '✨', duration: '1 min', type: 'gratitude' },
    { id: 'm2', title: 'Tiny Wins Tracker', desc: 'Check off small things you did today.', icon: '🏆', duration: '1 min', type: 'checklist_wins' },
    { id: 'm3', title: 'Compliment Generator', desc: 'Receive a random, kind message.', icon: '💌', duration: '30 sec', type: 'compliment' },
    { id: 'm4', title: 'Watch the Clouds', desc: 'A calming visual loop to reset your mind.', icon: '☁️', duration: '1 min', type: 'visual_clouds' }
  ],
  focus: [
    { id: 'f1', title: 'One-Task Focus', desc: 'Hide everything else. Do one thing.', icon: '🎯', duration: 'Custom', type: 'one_task' },
    { id: 'f2', title: 'Control Toggle', desc: 'Sort what you can and cannot control.', icon: '⚖️', duration: '2 min', type: 'sort' },
    { id: 'f3', title: 'Focus Line Game', desc: 'Follow a moving line to center your attention.', icon: '〰️', duration: '1 min', type: 'game_line' },
    { id: 'f4', title: 'Next 1 Step', desc: 'Break down a massive task into one tiny action.', icon: '🚶', duration: '1 min', type: 'one_task' }
  ],
  sleep: [
    { id: 's1', title: 'Sleep Countdown', desc: 'Slow your brain with a guided visual fade.', icon: '🌙', duration: '3 min', type: 'countdown' },
    { id: 's2', title: 'Body Scan', desc: 'Release tension from head to toe.', icon: '🧘', duration: '5 min', type: 'text' },
    { id: 's3', title: 'White Noise', desc: 'Listen to calming rain sounds.', icon: '🌧️', duration: '10 min', type: 'audio_rain' },
    { id: 's4', title: 'Let It Go Viz', desc: 'Visualize your thoughts floating away.', icon: '🍃', duration: '2 min', type: 'visual_leaves' }
  ],
  clear: [
    { id: 'cl1', title: 'Emotion Wheel', desc: 'Pinpoint exactly what you are feeling.', icon: '🎡', duration: '1 min', type: 'emotion_wheel' },
    { id: 'cl2', title: 'Journal Prompt', desc: 'Get a random question to spark reflection.', icon: '📓', duration: '3 min', type: 'prompt' },
    { id: 'cl3', title: 'Why Am I Feeling This?', desc: 'A guided flow to find the root cause.', icon: '🔍', duration: '2 min', type: 'prompt' },
    { id: 'cl4', title: 'Future Self Advice', desc: 'What would older you say about this?', icon: '🕰️', duration: '2 min', type: 'prompt' }
  ]
};

// --- HELPER DATA ---
const COMPLIMENTS = [
  "You are stronger than you think.",
  "It's okay to take a break. You're doing your best.",
  "Your feelings are entirely valid.",
  "You bring a unique light to the world.",
  "You have survived 100% of your bad days."
];

const PROMPTS = [
  "If your anxiety was a physical object, what would it look like?",
  "What is one thing you can forgive yourself for today?",
  "What does your ideal, peaceful day look like?",
  "List three things you are looking forward to this month.",
  "If you could talk to your 10-year-old self, what would you say?"
];

const EMOTIONS = {
  "Anger 😡": ["Frustrated", "Betrayed", "Annoyed", "Disrespected"],
  "Sadness 😞": ["Lonely", "Disappointed", "Grieving", "Hopeless"],
  "Anxiety 😰": ["Overwhelmed", "Panicked", "Insecure", "Nervous"],
  "Joy 😊": ["Grateful", "Optimistic", "Proud", "Relieved"]
};

export default function MindSpace({ userData, onNavigate }) {
    const [activeWidgetCategory, setActiveWidgetCategory] = useState('calm');
    const [activeWidgetFullscreen, setActiveWidgetFullscreen] = useState(null);
    
    // Global Tool States
    const [breathePhase, setBreathePhase] = useState('Inhale');
    const [breatheScale, setBreatheScale] = useState(1);
    const [popCount, setPopCount] = useState(0);
    const [bubbles, setBubbles] = useState([]);
    const [focusTime, setFocusTime] = useState(120);
    const [groundingChecks, setGroundingChecks] = useState([false, false, false, false, false]);
    const [winsChecks, setWinsChecks] = useState([false, false, false, false, false]);
    
    // New Tool States
    const [destroyText, setDestroyText] = useState('');
    const [isDestroying, setIsDestroying] = useState(false);
    const [tapEnergy, setTapEnergy] = useState(0);
    const [currentCompliment, setCurrentCompliment] = useState(COMPLIMENTS[0]);
    const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);
    const [sortInput, setSortInput] = useState('');
    const [inControl, setInControl] = useState(['My reactions', 'My effort']);
    const [outOfControl, setOutOfControl] = useState(['Other people', 'The past']);
    const [sleepCount, setSleepCount] = useState(100);
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [hoverProgress, setHoverProgress] = useState(0);

    // Box Breathing State
    const [boxPhase, setBoxPhase] = useState('Inhale (4s)');

    // --- EFFECTS ---

    // 4-7-8 Breathing Logic
    useEffect(() => {
        let interval;
        if (activeWidgetFullscreen?.type === 'breathing') {
            const cycle = () => {
                setBreathePhase('Breathe In...');
                setBreatheScale(1.5);
                setTimeout(() => {
                    if(activeWidgetFullscreen) setBreathePhase('Hold...');
                    setTimeout(() => {
                        if(activeWidgetFullscreen) {
                            setBreathePhase('Breathe Out...');
                            setBreatheScale(1);
                        }
                    }, 7000);
                }, 4000);
            };
            cycle();
            interval = setInterval(cycle, 19000);
        }
        return () => clearInterval(interval);
    }, [activeWidgetFullscreen]);

    // Box Breathing Logic (4-4-4-4)
    useEffect(() => {
        let interval;
        if (activeWidgetFullscreen?.type === 'box_breathing') {
            const phases = ['Inhale (4s)', 'Hold (4s)', 'Exhale (4s)', 'Hold (4s)'];
            let currentPhase = 0;
            
            const cycle = () => {
                setBoxPhase(phases[currentPhase]);
                currentPhase = (currentPhase + 1) % 4;
            };
            
            cycle(); // Start immediately
            interval = setInterval(cycle, 4000); // Switch every 4 seconds
        }
        return () => clearInterval(interval);
    }, [activeWidgetFullscreen]);

    // Bubble Game Logic
    useEffect(() => {
        let interval;
        if (activeWidgetFullscreen?.type === 'game_pop') {
            setPopCount(0);
            setBubbles([]);
            interval = setInterval(() => {
                setBubbles(prev => {
                    if(prev.length > 15) return prev;
                    return [...prev, {
                        id: Date.now() + Math.random(),
                        left: Math.random() * 80 + 10 + '%',
                        text: ['Stress', 'Exams', 'Pressure', 'Fear', 'Doubt'][Math.floor(Math.random() * 5)]
                    }];
                });
            }, 1200);
        }
        return () => clearInterval(interval);
    }, [activeWidgetFullscreen]);

    const handlePop = (id) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setPopCount(c => c + 1);
    };

    // Timer Logic
    useEffect(() => {
        let interval;
        if (activeWidgetFullscreen?.type === 'timer' && focusTime > 0) {
            interval = setInterval(() => setFocusTime(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [activeWidgetFullscreen, focusTime]);

    // Stress Tap Drain Logic
    useEffect(() => {
        let interval;
        if (activeWidgetFullscreen?.type === 'tap' && tapEnergy > 0) {
            interval = setInterval(() => setTapEnergy(e => Math.max(0, e - 2)), 200);
        }
        return () => clearInterval(interval);
    }, [activeWidgetFullscreen, tapEnergy]);

    // Sleep Countdown Logic
    useEffect(() => {
        let interval;
        if (activeWidgetFullscreen?.type === 'countdown' && sleepCount > 0) {
            interval = setInterval(() => setSleepCount(c => c - 1), 3000);
        }
        return () => clearInterval(interval);
    }, [activeWidgetFullscreen, sleepCount]);


    // --- HELPERS ---
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const closeFullscreenWidget = () => {
        setActiveWidgetFullscreen(null);
        // Reset states
        setFocusTime(120);
        setGroundingChecks([false,false,false,false,false]);
        setWinsChecks([false,false,false,false,false]);
        setDestroyText('');
        setIsDestroying(false);
        setTapEnergy(0);
        setSleepCount(100);
        setSelectedEmotion(null);
        setHoverProgress(0);
        setBoxPhase('Inhale (4s)');
    };

    const toggleChecklist = (index, setter) => {
        setter(prev => {
            const newArr = [...prev];
            newArr[index] = !newArr[index];
            return newArr;
        });
    };

    const handleSortAdd = (listType) => {
        if(!sortInput.trim()) return;
        if(listType === 'in') setInControl([...inControl, sortInput]);
        else setOutOfControl([...outOfControl, sortInput]);
        setSortInput('');
    }

    return (
        <div style={{ padding: '60px 48px', backgroundColor: '#FDFCFA', minHeight: '100vh' }}>
            <style>{`
                .widget-tab { padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; background: white; color: #7A8A7D; box-shadow: 0 2px 12px rgba(30,40,32,0.07); }
                .widget-tab:hover { transform: translateY(-2px); }
                .tool-card { background: white; border-radius: 22px; padding: 24px; border: 1px solid rgba(74,124,89,0.15); box-shadow: 0 2px 12px rgba(30,40,32,0.07); cursor: pointer; transition: all 0.2s; }
                .tool-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(30,40,32,0.10); }
                
                .fs-widget-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px); z-index: 9999; display: flex; flexDirection: column; alignItems: center; justifyContent: center; color: white; animation: fadeIn 0.3s ease; }
                .fs-close-btn { position: absolute; top: 30px; right: 30px; background: rgba(255,255,255,0.1); border: none; color: white; width: 45px; height: 45px; borderRadius: 50%; fontSize: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;}
                .fs-close-btn:hover { background: rgba(239, 68, 68, 0.8); }
                
                .btn { background: #4A7C59; color: white; border: none; padding: 14px 32px; border-radius: 50px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.2s; }
                .btn:hover { transform: translateY(-2px); background: #2D5240; }
                
                .focus-input { width: 100%; padding: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: white; font-size: 18px; outline: none; transition: border 0.2s;}
                .focus-input:focus { border-color: #5B9EBF; }
                
                /* Animations */
                @keyframes floatUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(-100vh); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes burnAway { 0% { filter: brightness(1) blur(0px); opacity: 1; transform: scale(1); } 50% { filter: brightness(2) blur(4px); opacity: 0.8; transform: scale(1.05) translateY(-10px); color: #ef4444; } 100% { filter: brightness(3) blur(10px); opacity: 0; transform: scale(1.2) translateY(-30px); } }
                @keyframes drift { from { transform: translateX(-100%); } to { transform: translateX(100vw); } }
                @keyframes fall { from { transform: translateY(-10vh) rotate(0deg); } to { transform: translateY(100vh) rotate(360deg); } }
                @keyframes equalizer { 0%, 100% { height: 10px; } 50% { height: 50px; } }

                .destroying { animation: burnAway 1.5s ease-out forwards !important; pointer-events: none; }
                
                /* Checklist UI */
                .check-item { display: flex; align-items: center; gap: 15px; padding: 18px; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; width: 100%; max-width: 500px;}
                .check-item:hover { background: rgba(255,255,255,0.1); }
                .check-item.done { border-color: #6FAA80; opacity: 0.6; }
                .check-box { width: 28px; height: 28px; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.2s;}
                .check-item.done .check-box { background: #6FAA80; border-color: #6FAA80;}
                .check-item.done span { text-decoration: line-through; }

                /* Hover Line Game */
                .hover-track { width: 300px; height: 300px; border-radius: 50%; border: 30px solid rgba(255,255,255,0.1); position: relative; display: flex; align-items: center; justify-content: center; cursor: crosshair;}
                .hover-track:hover { border-color: rgba(91, 158, 191, 0.5); box-shadow: 0 0 30px rgba(91, 158, 191, 0.3); }

                /* Box Breathing Animation */
                @keyframes boxTrace {
                    0% { top: 0; left: 0; }
                    25% { top: 0; left: 100%; }
                    50% { top: 100%; left: 100%; }
                    75% { top: 100%; left: 0; }
                    100% { top: 0; left: 0; }
                }
                .box-container { width: 250px; height: 250px; border: 4px solid rgba(255,255,255,0.2); border-radius: 20px; position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 40px; }
                .box-tracer { position: absolute; width: 20px; height: 20px; background: #6FAA80; border-radius: 50%; box-shadow: 0 0 20px #6FAA80; top: 0; left: 0; transform: translate(-50%, -50%); animation: boxTrace 16s linear infinite; }

                /* Realistic Heartbeat */
                @keyframes realHeartbeat {
                    0% { transform: scale(1); }
                    15% { transform: scale(1.15); }
                    30% { transform: scale(1); }
                    45% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
                .pulse-heart { font-size: 120px; animation: realHeartbeat 1s infinite; filter: drop-shadow(0 0 30px rgba(239, 68, 68, 0.5)); }

            `}</style>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#4A7C59', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Emotional First Aid</div>
                <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '42px', color: '#1E2820', margin: 0 }}>What do you need right now?</h1>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '50px' }}>
                    {WIDGET_CATEGORIES.map(cat => (
                        <div 
                            key={cat.id} 
                            className={`widget-tab ${activeWidgetCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setActiveWidgetCategory(cat.id)}
                            style={{
                                borderColor: activeWidgetCategory === cat.id ? cat.color : 'transparent',
                                background: activeWidgetCategory === cat.id ? cat.color : 'white',
                                color: activeWidgetCategory === cat.id ? 'white' : '#7A8A7D'
                            }}
                        >
                            {cat.label}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }} className="anim-up">
                    {WIDGET_TOOLS[activeWidgetCategory].map(tool => (
                        <div key={tool.id} className="tool-card" onClick={() => setActiveWidgetFullscreen(tool)}>
                            <div style={{ fontSize: '36px', marginBottom: '16px' }}>{tool.icon}</div>
                            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: '700', fontSize: '22px', color: '#1E2820', marginBottom: '8px' }}>{tool.title}</div>
                            <div style={{ fontSize: '15px', color: '#7A8A7D', lineHeight: 1.5, marginBottom: '20px' }}>{tool.desc}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', fontWeight: 'bold' }}>
                                <span style={{ color: '#7C6FA0' }}>⏱️ {tool.duration}</span>
                                <span style={{ color: '#4A7C59', display: 'flex', alignItems:'center', gap:'5px' }}>▶ Enter Space</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🚀 FULLSCREEN WIDGET OVERLAY ENGINE 🚀 */}
            {activeWidgetFullscreen && (
                <div className="fs-widget-overlay">
                    <button className="fs-close-btn" onClick={closeFullscreenWidget}>✕</button>
                    
                    {/* 1. 4-7-8 BREATHING */}
                    {activeWidgetFullscreen.type === 'breathing' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, #6FAA80 0%, #4A7C59 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', transform: `scale(${breatheScale})`, transition: 'transform 4s linear', boxShadow: '0 0 60px rgba(111, 170, 128, 0.3)' }}>
                                {activeWidgetFullscreen.icon}
                            </div>
                            <div style={{ marginTop: '60px', fontSize: '32px', fontWeight: '300', letterSpacing: '2px', fontFamily: 'Fraunces, serif' }}>{breathePhase}</div>
                        </div>
                    )}

                    {/* 2. BOX BREATHING (CREATIVE SQUARE) */}
                    {activeWidgetFullscreen.type === 'box_breathing' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="box-container">
                                <div className="box-tracer"></div>
                                <div style={{fontFamily: 'Fraunces, serif', fontSize: '28px', color: 'white', textAlign: 'center'}}>
                                    {boxPhase}
                                </div>
                            </div>
                            <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '18px', maxWidth: '400px', textAlign: 'center', lineHeight: 1.6}}>
                                Follow the glowing dot. Inhale across the top, hold down the right, exhale across the bottom, hold up the left.
                            </p>
                        </div>
                    )}

                    {/* 3. POP THE THOUGHTS GAME */}
                    {activeWidgetFullscreen.type === 'game_pop' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '42px', marginBottom: '10px'}}>Pop the Thoughts</h2>
                            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '18px', marginBottom: '30px'}}>Thoughts popped: <span style={{color:'white', fontWeight:'bold'}}>{popCount}</span></p>
                            <div style={{ position: 'relative', width: '90%', height: '65vh', maxWidth: '800px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '30px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                                {bubbles.map(b => (
                                    <div 
                                        key={b.id} 
                                        style={{ position: 'absolute', width: '90px', height: '90px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', left: b.left, animation: 'floatUp 4s linear forwards', userSelect: 'none', fontWeight:'bold', fontSize:'14px', color:'white', textAlign: 'center' }}
                                        onClick={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.5)';
                                            e.currentTarget.style.opacity = '0';
                                            setTimeout(() => handlePop(b.id), 150);
                                        }}
                                    >
                                        {b.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 4. BRAIN DUMP TIMER */}
                    {activeWidgetFullscreen.type === 'timer' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', padding: '0 20px'}}>
                            <div style={{fontFamily: 'Fraunces', fontSize: '80px', fontWeight: 'bold', color: '#5B9EBF', marginBottom: '20px'}}>{formatTime(focusTime)}</div>
                            <textarea 
                                className="focus-input" 
                                style={{height: '300px', maxWidth: '700px', resize: 'none', background: 'rgba(0,0,0,0.3)'}} 
                                placeholder="Type everything out. Don't stop. Don't edit. Just empty your mind here..."
                            ></textarea>
                            <button className="btn" style={{marginTop: '30px', background: '#5B9EBF'}} onClick={closeFullscreenWidget}>I feel lighter</button>
                        </div>
                    )}

                    {/* 5. GROUNDING / WINS CHECKLISTS (PROPER UI) */}
                    {(activeWidgetFullscreen.type === 'checklist_grounding' || activeWidgetFullscreen.type === 'checklist_wins') && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '42px', marginBottom: '40px', color: 'white', textAlign: 'center'}}>{activeWidgetFullscreen.title}</h2>
                            <div style={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center'}}>
                                {(activeWidgetFullscreen.type === 'checklist_grounding' ? 
                                    ["👀 Find 5 things you can see", "🖐️ Find 4 things you can touch", "👂 Find 3 things you can hear", "👃 Find 2 things you can smell", "👅 Find 1 thing you can taste"] : 
                                    ["💧 Drank a glass of water", "🚶‍♂️ Stepped outside for a minute", "🛏️ Made my bed", "🍎 Ate something nourishing", "🌬️ Took 3 deep breaths"]
                                ).map((item, i) => {
                                    const stateObj = activeWidgetFullscreen.type === 'checklist_grounding' ? groundingChecks : winsChecks;
                                    const setter = activeWidgetFullscreen.type === 'checklist_grounding' ? setGroundingChecks : setWinsChecks;
                                    return (
                                        <div key={i} className={`check-item ${stateObj[i] ? 'done' : ''}`} onClick={() => toggleChecklist(i, setter)}>
                                            <div className="check-box">{stateObj[i] && '✓'}</div>
                                            <span style={{fontSize: '18px'}}>{item}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            {(activeWidgetFullscreen.type === 'checklist_grounding' ? groundingChecks : winsChecks).every(c => c) && (
                                <button className="btn" style={{marginTop: '40px', background: 'white', color: '#1E2820'}} onClick={closeFullscreenWidget}>Complete Exercise</button>
                            )}
                        </div>
                    )}

                    {/* 6. WRITE & DESTROY */}
                    {activeWidgetFullscreen.type === 'destroy' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%', padding: '0 20px'}}>
                            <div style={{fontSize: '64px', marginBottom: '20px'}}>🔥</div>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '36px', marginBottom: '20px'}}>Write & Destroy</h2>
                            <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '30px'}}>Type out exactly what is making you angry or stressed. Then burn it.</p>
                            <textarea 
                                className={`focus-input ${isDestroying ? 'destroying' : ''}`} 
                                style={{height: '200px', maxWidth: '600px', resize: 'none', background: 'rgba(0,0,0,0.3)'}} 
                                placeholder="I am so frustrated because..."
                                value={destroyText}
                                onChange={(e) => setDestroyText(e.target.value)}
                                disabled={isDestroying}
                            ></textarea>
                            {!isDestroying ? (
                                <button className="btn" style={{marginTop: '30px', background: '#ef4444'}} onClick={() => { if(destroyText) setIsDestroying(true); }}>Burn This Thought</button>
                            ) : (
                                <button className="btn" style={{marginTop: '30px', background: 'white', color: '#1E2820'}} onClick={closeFullscreenWidget}>Let it go</button>
                            )}
                        </div>
                    )}

                    {/* 7. STRESS TAP */}
                    {activeWidgetFullscreen.type === 'tap' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '36px', marginBottom: '10px'}}>Release Physical Energy</h2>
                            <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '40px'}}>Tap the button as fast as you can until the bar is full.</p>
                            
                            <div style={{width: '300px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '40px'}}>
                                <div style={{width: `${tapEnergy}%`, height: '100%', background: tapEnergy === 100 ? '#10b981' : '#ef4444', transition: 'width 0.1s, background 0.3s'}}></div>
                            </div>

                            <button 
                                style={{width: '200px', height: '200px', borderRadius: '50%', background: tapEnergy === 100 ? '#10b981' : 'rgba(239,68,68,0.2)', border: `4px solid ${tapEnergy === 100 ? '#10b981' : '#ef4444'}`, color: 'white', fontSize: '32px', fontWeight: 'bold', cursor: 'pointer', transition: '0.1s transform', transform: 'scale(1)'}} 
                                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                onClick={() => setTapEnergy(e => Math.min(100, e + 8))}
                            >
                                {tapEnergy === 100 ? 'Done! 🌿' : 'TAP!'}
                            </button>
                            {tapEnergy === 100 && <button className="btn" style={{marginTop: '40px', background: 'white', color: '#1E2820'}} onClick={closeFullscreenWidget}>Close</button>}
                        </div>
                    )}

                    {/* 8. COMPLIMENT GENERATOR */}
                    {activeWidgetFullscreen.type === 'compliment' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign: 'center', padding: '0 20px'}}>
                            <div style={{fontSize: '80px', marginBottom: '20px', animation: 'floatUp 2s ease infinite alternate'}}>💌</div>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '42px', color: '#E8845A', marginBottom: '40px', maxWidth: '800px', lineHeight: 1.4}}>{currentCompliment}</h2>
                            <button className="btn" style={{background: '#E8845A'}} onClick={() => setCurrentCompliment(COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)])}>Open another letter</button>
                        </div>
                    )}

                    {/* 9. SORT (CONTROL TOGGLE) */}
                    {activeWidgetFullscreen.type === 'sort' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width: '100%', maxWidth: '900px'}}>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '36px', marginBottom: '20px'}}>What is actually in your control?</h2>
                            <div style={{display: 'flex', gap: '10px', width: '100%', marginBottom: '40px'}}>
                                <input type="text" className="focus-input" placeholder="Type a worry or task here..." value={sortInput} onChange={e => setSortInput(e.target.value)} />
                                <button className="btn" style={{background: '#10b981'}} onClick={() => handleSortAdd('in')}>In My Control</button>
                                <button className="btn" style={{background: '#ef4444'}} onClick={() => handleSortAdd('out')}>Out of Control</button>
                            </div>
                            <div style={{display: 'flex', width: '100%', gap: '30px'}}>
                                <div style={{flex: 1, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', padding: '20px', borderRadius: '16px'}}>
                                    <h3 style={{color: '#10b981', marginTop: 0}}>Focus on this 🟢</h3>
                                    {inControl.map((item, i) => <div key={i} style={{padding: '10px', background: 'rgba(255,255,255,0.1)', margin: '10px 0', borderRadius: '8px'}}>{item}</div>)}
                                </div>
                                <div style={{flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', padding: '20px', borderRadius: '16px', opacity: 0.6}}>
                                    <h3 style={{color: '#ef4444', marginTop: 0}}>Let this go 🔴</h3>
                                    {outOfControl.map((item, i) => <div key={i} style={{padding: '10px', background: 'rgba(255,255,255,0.1)', margin: '10px 0', borderRadius: '8px', textDecoration: 'line-through'}}>{item}</div>)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 10. SLEEP COUNTDOWN */}
                    {activeWidgetFullscreen.type === 'countdown' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width: '100%', height: '100%', justifyContent: 'center', background: `rgba(0,0,0, ${1 - (sleepCount/100)})`, transition: 'background 3s linear'}}>
                            <div style={{fontFamily: 'Fraunces', fontSize: '120px', color: `rgba(255,255,255,${sleepCount/100})`, transition: 'color 3s linear'}}>{sleepCount}</div>
                            <p style={{fontSize: '24px', color: `rgba(255,255,255,${(sleepCount/100) * 0.7})`, letterSpacing: '2px', fontWeight: '300', marginTop: '20px', transition: 'color 3s linear'}}>Breathe in slowly... Let it out.</p>
                            <button style={{position: 'absolute', bottom: '40px', background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer'}} onClick={closeFullscreenWidget}>Wake / Close</button>
                        </div>
                    )}

                    {/* 11. EMOTION WHEEL */}
                    {activeWidgetFullscreen.type === 'emotion_wheel' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign: 'center'}}>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '36px', marginBottom: '10px'}}>Pinpoint Your Feeling</h2>
                            <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '40px'}}>Sometimes naming the emotion is half the battle.</p>
                            
                            {!selectedEmotion ? (
                                <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '600px'}}>
                                    {Object.keys(EMOTIONS).map(em => (
                                        <button key={em} onClick={() => setSelectedEmotion(em)} style={{padding: '20px 40px', fontSize: '20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', color: 'white', cursor: 'pointer', transition: '0.2s'}} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                                            {em}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="anim-up">
                                    <h3 style={{fontSize: '28px', color: '#5B9EBF', marginBottom: '20px'}}>You selected: {selectedEmotion}</h3>
                                    <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '20px'}}>Do any of these feel more accurate?</p>
                                    <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center'}}>
                                        {EMOTIONS[selectedEmotion].map(sub => (
                                            <div key={sub} style={{padding: '12px 24px', background: 'rgba(91,158,191,0.2)', border: '1px solid #5B9EBF', borderRadius: '50px', color: 'white'}}>{sub}</div>
                                        ))}
                                    </div>
                                    <button className="btn" style={{marginTop: '50px', background: 'white', color: '#1E2820'}} onClick={() => setSelectedEmotion(null)}>Start Over</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 12. JOURNAL PROMPT */}
                    {activeWidgetFullscreen.type === 'prompt' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign: 'center', padding: '0 20px', width: '100%', maxWidth: '800px'}}>
                            <div style={{fontSize: '64px', marginBottom: '20px'}}>{activeWidgetFullscreen.icon}</div>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '42px', color: 'white', marginBottom: '40px', lineHeight: 1.3}}>{currentPrompt}</h2>
                            <textarea className="focus-input" style={{height: '250px', resize: 'none', background: 'rgba(0,0,0,0.3)', marginBottom: '30px'}} placeholder="Start reflecting here..."></textarea>
                            <div style={{display: 'flex', gap: '15px'}}>
                                <button className="btn" style={{background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)'}} onClick={() => setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])}>New Prompt</button>
                                <button className="btn" style={{background: 'white', color: '#1E2820'}} onClick={closeFullscreenWidget}>Done Reflecting</button>
                            </div>
                        </div>
                    )}

                    {/* 13. HOVER LINE GAME */}
                    {activeWidgetFullscreen.type === 'game_line' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '36px', marginBottom: '10px'}}>Follow the Path</h2>
                            <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '40px'}}>Keep your cursor steady on the ring to focus your mind.</p>
                            
                            <div className="hover-track" onMouseLeave={() => setHoverProgress(0)} onMouseMove={() => setHoverProgress(p => Math.min(100, p + 0.5))}>
                                <span style={{fontSize: '32px', filter: hoverProgress > 0 ? 'grayscale(0)' : 'grayscale(1)'}}>🎯</span>
                            </div>
                            <div style={{marginTop: '30px', color: hoverProgress === 100 ? '#10b981' : 'white', fontSize: '20px', fontWeight: 'bold'}}>
                                Focus Level: {Math.floor(hoverProgress)}%
                            </div>
                        </div>
                    )}

                    {/* 14. AUDIO RAIN VISUALIZER */}
                    {activeWidgetFullscreen.type === 'audio_rain' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '36px', marginBottom: '10px', color: '#5B9EBF'}}>White Noise</h2>
                            <p style={{color: 'rgba(255,255,255,0.7)', marginBottom: '60px'}}>Imagine the sound of gentle rain...</p>
                            
                            <div style={{display: 'flex', gap: '8px', height: '50px', alignItems: 'center'}}>
                                {[1,2,3,4,5,6,7,8,9,10].map(i => (
                                    <div key={i} style={{width: '6px', background: '#5B9EBF', borderRadius: '3px', animation: `equalizer ${Math.random() * 1 + 0.5}s ease-in-out infinite alternate`}}></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 15. HEARTBEAT SYNC (UPGRADED UI) */}
                    {activeWidgetFullscreen.type === 'pulse' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '36px', marginBottom: '40px'}}>Heartbeat Sync</h2>
                            <div className="pulse-heart">
                                🫀
                            </div>
                            <p style={{marginTop: '60px', color: 'rgba(255,255,255,0.7)', fontSize: '20px'}}>Sync your breathing with the rhythm.</p>
                        </div>
                    )}

                    {/* 16. TEXT/GRATITUDE/ONE-TASK FALLBACK */}
                    {['text', 'gratitude', 'one_task', 'body_scan'].includes(activeWidgetFullscreen.type) && (
                        <div style={{textAlign:'center', maxWidth:'600px'}}>
                            <div style={{fontSize:'64px', marginBottom:'20px'}}>{activeWidgetFullscreen.icon}</div>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '36px', marginBottom: '20px'}}>{activeWidgetFullscreen.title}</h2>
                            <p style={{fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6}}>{activeWidgetFullscreen.desc}</p>
                            
                            {activeWidgetFullscreen.type === 'gratitude' && (
                                <div style={{marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px'}}>
                                    <input type="text" className="focus-input" placeholder="1. I am grateful for..." />
                                    <input type="text" className="focus-input" placeholder="2. Something good that happened..." />
                                    <input type="text" className="form-input focus-input" placeholder="3. Someone who helped me..." />
                                </div>
                            )}

                            {activeWidgetFullscreen.type === 'one_task' && (
                                <div style={{marginTop: '30px'}}>
                                    <input type="text" className="focus-input" style={{fontSize: '24px', textAlign: 'center', padding: '20px'}} placeholder="The ONE thing I will do is..." />
                                </div>
                            )}
                            
                            <button className="btn" style={{marginTop: '50px', background: 'white', color: 'var(--ink)'}} onClick={closeFullscreenWidget}>Complete</button>
                        </div>
                    )}

                    {/* 17. VISUAL CLOUDS / LEAVES */}
                    {(activeWidgetFullscreen.type === 'visual_clouds' || activeWidgetFullscreen.type === 'visual_leaves') && (
                        <div style={{width: '100%', height: '100%', overflow: 'hidden', position: 'absolute', top: 0, left: 0, zIndex: -1}}>
                            {[1,2,3,4,5].map(i => (
                                <div key={i} style={{
                                    position: 'absolute', 
                                    fontSize: '64px', 
                                    opacity: 0.3,
                                    top: activeWidgetFullscreen.type === 'visual_clouds' ? `${Math.random() * 80}%` : '-10%',
                                    left: activeWidgetFullscreen.type === 'visual_leaves' ? `${Math.random() * 100}%` : '-10%',
                                    animation: activeWidgetFullscreen.type === 'visual_clouds' ? `drift ${Math.random() * 20 + 20}s linear infinite` : `fall ${Math.random() * 10 + 10}s linear infinite`,
                                    animationDelay: `-${Math.random() * 20}s`
                                }}>
                                    {activeWidgetFullscreen.icon}
                                </div>
                            ))}
                            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                                <h2 style={{fontFamily: 'Fraunces', fontSize: '36px', marginBottom: '10px'}}>{activeWidgetFullscreen.title}</h2>
                                <p style={{color: 'rgba(255,255,255,0.7)'}}>Watch the screen and let your mind wander.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
