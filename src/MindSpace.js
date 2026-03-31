import React, { useState, useEffect } from 'react';

const WIDGET_CATEGORIES = [
  { id: 'calm', label: '😰 Calm Anxiety', color: '#4A7C59' }, // var(--sage)
  { id: 'vent', label: '😡 Release Anger', color: '#ef4444' }, // var(--danger)
  { id: 'mood', label: '😞 Lift Mood', color: '#E8845A' }, // var(--peach)
  { id: 'focus', label: '😵 Focus Better', color: '#5B9EBF' }, // var(--sky)
  { id: 'sleep', label: '😴 Relax / Sleep', color: '#7C6FA0' }, // var(--lavender)
  { id: 'clear', label: '🧠 Clear Mind', color: '#1E2820' } // var(--ink)
];

const WIDGET_TOOLS = {
  calm: [
    { id: 'c1', title: '4-7-8 Breathing', desc: 'A proven rhythm to instantly lower heart rate.', icon: '🫁', duration: '2 min', type: 'breathing' },
    { id: 'c2', title: '5-4-3-2-1 Grounding', desc: 'Bring your mind back to the present room.', icon: '🖐️', duration: '1 min', type: 'checklist_grounding' },
    { id: 'c3', title: 'Box Breathing', desc: 'Equal inhales, holds, and exhales for balance.', icon: '🔲', duration: '2 min', type: 'breathing' },
    { id: 'c4', title: 'Heartbeat Sync', desc: 'Focus on a calming visual pulse.', icon: '💓', duration: '1 min', type: 'pulse' }
  ],
  vent: [
    { id: 'v1', title: 'Pop the Thoughts', desc: 'Tap to visually destroy anxious thoughts.', icon: '🫧', duration: '1 min', type: 'game_pop' },
    { id: 'v2', title: 'Brain Dump Timer', desc: 'Type everything out without stopping.', icon: '⌨️', duration: '2 min', type: 'timer' },
    { id: 'v3', title: 'Write & Destroy', desc: 'Type what is bothering you, then watch it burn.', icon: '🔥', duration: '1 min', type: 'text' },
    { id: 'v4', title: 'Stress Tap', desc: 'Release physical energy through rapid tapping.', icon: '⚡', duration: '1 min', type: 'text' }
  ],
  mood: [
    { id: 'm1', title: 'Gratitude Quick-Write', desc: 'Name 3 things that don\'t suck right now.', icon: '✨', duration: '1 min', type: 'text' },
    { id: 'm2', title: 'Tiny Wins Tracker', desc: 'Check off small things you did today.', icon: '🏆', duration: '1 min', type: 'checklist_wins' },
    { id: 'm3', title: 'Compliment Generator', desc: 'Receive a random, kind message.', icon: '💌', duration: '30 sec', type: 'text' },
    { id: 'm4', title: 'Watch the Clouds', desc: 'A calming visual loop to reset your mind.', icon: '☁️', duration: '1 min', type: 'text' }
  ],
  focus: [
    { id: 'f1', title: 'One-Task Focus', desc: 'Hide everything else. Do one thing.', icon: '🎯', duration: 'Custom', type: 'text' },
    { id: 'f2', title: 'Control Toggle', desc: 'Sort what you can and cannot control.', icon: '⚖️', duration: '2 min', type: 'text' },
    { id: 'f3', title: 'Focus Line Game', desc: 'Follow a moving line to center your attention.', icon: '〰️', duration: '1 min', type: 'text' },
    { id: 'f4', title: 'Next 1 Step', desc: 'Break down a massive task into one tiny action.', icon: '🚶', duration: '1 min', type: 'text' }
  ],
  sleep: [
    { id: 's1', title: 'Sleep Countdown', desc: 'Slow your brain with a guided visual fade.', icon: '🌙', duration: '3 min', type: 'text' },
    { id: 's2', title: 'Body Scan', desc: 'Release tension from head to toe.', icon: '🧘', duration: '5 min', type: 'text' },
    { id: 's3', title: 'White Noise', desc: 'Listen to calming rain sounds.', icon: '🌧️', duration: '10 min', type: 'text' },
    { id: 's4', title: 'Let It Go Viz', desc: 'Visualize your thoughts floating away.', icon: '🍃', duration: '2 min', type: 'text' }
  ],
  clear: [
    { id: 'cl1', title: 'Emotion Wheel', desc: 'Pinpoint exactly what you are feeling.', icon: '🎡', duration: '1 min', type: 'text' },
    { id: 'cl2', title: 'Journal Prompt', desc: 'Get a random question to spark reflection.', icon: '📓', duration: '3 min', type: 'text' },
    { id: 'cl3', title: 'Why Am I Feeling This?', desc: 'A guided flow to find the root cause.', icon: '🔍', duration: '2 min', type: 'text' },
    { id: 'cl4', title: 'Future Self Advice', desc: 'What would older you say about this?', icon: '🕰️', duration: '2 min', type: 'text' }
  ]
};

export default function MindSpace({ userData, onNavigate }) {
    const [activeWidgetCategory, setActiveWidgetCategory] = useState('calm');
    const [activeWidgetFullscreen, setActiveWidgetFullscreen] = useState(null);
    
    const [breathePhase, setBreathePhase] = useState('Inhale');
    const [breatheScale, setBreatheScale] = useState(1);
    const [popCount, setPopCount] = useState(0);
    const [bubbles, setBubbles] = useState([]);
    const [focusTime, setFocusTime] = useState(120);

    const [groundingChecks, setGroundingChecks] = useState([false, false, false, false, false]);
    const [winsChecks, setWinsChecks] = useState([false, false, false, false, false]);

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

    useEffect(() => {
        let interval;
        if (activeWidgetFullscreen?.type === 'timer' && focusTime > 0) {
            interval = setInterval(() => setFocusTime(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [activeWidgetFullscreen, focusTime]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const closeFullscreenWidget = () => {
        setActiveWidgetFullscreen(null);
        setFocusTime(120);
        setGroundingChecks([false,false,false,false,false]);
        setWinsChecks([false,false,false,false,false]);
    };

    const toggleChecklist = (index, setter) => {
        setter(prev => {
            const newArr = [...prev];
            newArr[index] = !newArr[index];
            return newArr;
        });
    };

    return (
        <div style={{ padding: '60px 48px', backgroundColor: '#FDFCFA', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#4A7C59', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>Emotional First Aid</div>
                <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', color: '#1E2820', marginBottom: '10px' }}>What do you need right now?</h1>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
                    {WIDGET_CATEGORIES.map(cat => (
                        <div 
                            key={cat.id} 
                            onClick={() => setActiveWidgetCategory(cat.id)}
                            style={{
                                padding: '12px 24px', borderRadius: '50px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', 
                                border: `2px solid ${activeWidgetCategory === cat.id ? cat.color : 'transparent'}`, 
                                background: activeWidgetCategory === cat.id ? cat.color : 'white', 
                                color: activeWidgetCategory === cat.id ? 'white' : '#7A8A7D', 
                                boxShadow: '0 2px 12px rgba(30,40,32,0.07)', transition: 'all 0.2s'
                            }}
                        >
                            {cat.label}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {WIDGET_TOOLS[activeWidgetCategory].map(tool => (
                        <div 
                            key={tool.id} 
                            onClick={() => setActiveWidgetFullscreen(tool)}
                            style={{ background: 'white', borderRadius: '22px', padding: '24px', border: '1px solid rgba(74,124,89,0.15)', boxShadow: '0 2px 12px rgba(30,40,32,0.07)', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{tool.icon}</div>
                            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: '700', fontSize: '20px', color: '#1E2820', marginBottom: '8px' }}>{tool.title}</div>
                            <div style={{ fontSize: '14px', color: '#7A8A7D', lineHeight: 1.5, marginBottom: '16px' }}>{tool.desc}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 'bold', color: '#7C6FA0' }}>
                                <span>⏱️ {tool.duration}</span>
                                <span style={{ color: '#4A7C59' }}>▶ Start</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FULLSCREEN OVERLAY */}
            {activeWidgetFullscreen && (
                <div style={{ position: 'fixed', inset: 0, background: '#1E2820', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', animation: 'fadeIn 0.3s ease' }}>
                    <button onClick={closeFullscreenWidget} style={{ position: 'absolute', top: '30px', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: '40px', height: '40px', borderRadius: '50%', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                    
                    {/* Render different tool types here based on activeWidgetFullscreen.type */}
                    {activeWidgetFullscreen.type === 'breathing' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, #6FAA80 0%, #4A7C59 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', transform: `scale(${breatheScale})`, transition: 'transform linear', boxShadow: '0 0 40px rgba(111, 170, 128, 0.4)' }}>
                                {activeWidgetFullscreen.icon}
                            </div>
                            <div style={{ marginTop: '40px', fontSize: '24px', fontWeight: '300', letterSpacing: '1px' }}>{breathePhase}</div>
                        </div>
                    )}

                    {activeWidgetFullscreen.type === 'game_pop' && (
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', width:'100%'}}>
                            <h2 style={{fontFamily: 'Fraunces', fontSize: '32px', marginBottom: '10px'}}>Pop the Thoughts</h2>
                            <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: '30px'}}>Thoughts popped: {popCount}</p>
                            <div style={{ position: 'relative', width: '100%', height: '60vh', maxWidth: '600px', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '20px', overflow: 'hidden' }}>
                                {bubbles.map(b => (
                                    <div 
                                        key={b.id} 
                                        style={{ position: 'absolute', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', left: b.left, animation: 'floatUp 4s linear infinite', userSelect: 'none' }}
                                        onClick={() => handlePop(b.id)}
                                    >
                                        {b.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Add other tool renderings (timer, checklists, etc.) similar to the App.js structure if needed! */}
                </div>
            )}
        </div>
    );
}
