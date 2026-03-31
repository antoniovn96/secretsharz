import React, { useState, useEffect, useRef, useMemo } from 'react';

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
    { id: 'm1', title: 'Gratitude Quick-Write', desc: "Name 3 things that don't suck right now.", icon: '✨', duration: '1 min', type: 'gratitude' },
    { id: 'm2', title: 'Tiny Wins Tracker', desc: 'Check off small things you did today.', icon: '🏆', duration: '1 min', type: 'checklist_wins' },
    { id: 'm3', title: 'Compliment Generator', desc: 'Receive a random, kind message.', icon: '💌', duration: '30 sec', type: 'compliment' },
    { id: 'm4', title: 'Watch the Clouds', desc: 'A calming visual loop to reset your mind.', icon: '☁️', duration: '1 min', type: 'visual_clouds' }
  ],
  focus: [
    { id: 'f1', title: 'One-Task Focus', desc: 'Hide everything else. Do one thing.', icon: '🎯', duration: 'Custom', type: 'one_task' },
    { id: 'f2', title: 'Control Toggle', desc: 'Sort what you can and cannot control.', icon: '⚖️', duration: '2 min', type: 'sort' },
    { id: 'f3', title: 'Focus Line Game', desc: 'Follow a moving line to center your attention.', icon: '〰️', duration: '1 min', type: 'game_line' },
    // FIX: Changed from 'one_task' to 'next_step' — was showing identical UI as f1
    { id: 'f4', title: 'Next 1 Step', desc: 'Break down a massive task into one tiny action.', icon: '🚶', duration: '1 min', type: 'next_step' }
  ],
  sleep: [
    { id: 's1', title: 'Sleep Countdown', desc: 'Slow your brain with a guided visual fade.', icon: '🌙', duration: '3 min', type: 'countdown' },
    // FIX: Changed from 'text' to 'body_scan' — was falling into generic fallback with no content
    { id: 's2', title: 'Body Scan', desc: 'Release tension from head to toe.', icon: '🧘', duration: '5 min', type: 'body_scan' },
    { id: 's3', title: 'White Noise', desc: 'Listen to calming rain sounds.', icon: '🌧️', duration: '10 min', type: 'audio_rain' },
    { id: 's4', title: 'Let It Go Viz', desc: 'Visualize your thoughts floating away.', icon: '🍃', duration: '2 min', type: 'visual_leaves' }
  ],
  clear: [
    { id: 'cl1', title: 'Emotion Wheel', desc: 'Pinpoint exactly what you are feeling.', icon: '🎡', duration: '1 min', type: 'emotion_wheel' },
    { id: 'cl2', title: 'Journal Prompt', desc: 'Get a random question to spark reflection.', icon: '📓', duration: '3 min', type: 'prompt' },
    // FIX: Changed from 'prompt' to 'why_feeling' — was sharing identical UI with cl2/cl4
    { id: 'cl3', title: 'Why Am I Feeling This?', desc: 'A guided flow to find the root cause.', icon: '🔍', duration: '2 min', type: 'why_feeling' },
    // FIX: Changed from 'prompt' to 'future_self' — was sharing identical UI with cl2/cl3
    { id: 'cl4', title: 'Future Self Advice', desc: 'What would older you say about this?', icon: '🕰️', duration: '2 min', type: 'future_self' }
  ]
};

// --- HELPER DATA ---
const COMPLIMENTS = [
  "You are stronger than you think.",
  "It's okay to take a break. You're doing your best.",
  "Your feelings are entirely valid.",
  "You bring a unique light to the world.",
  "You have survived 100% of your bad days.",
  "Progress, no matter how small, still counts.",
  "You don't have to be perfect to be worthy of love.",
  "Rest is productive. You are allowed to slow down."
];

const PROMPTS = [
  "If your anxiety was a physical object, what would it look like?",
  "What is one thing you can forgive yourself for today?",
  "What does your ideal, peaceful day look like?",
  "List three things you are looking forward to this month.",
  "If you could talk to your 10-year-old self, what would you say?",
  "What would you do today if you weren't afraid?",
  "Describe a moment this week when you felt genuinely like yourself."
];

// NEW: Specific prompts for the guided "Why Am I Feeling This?" flow
const WHY_FEELING_QUESTIONS = [
  "What specific situation or event triggered this feeling?",
  "What story are you telling yourself about this situation?",
  "Is this feeling tied to the present moment, or echoing a past experience?",
  "What unmet need is underneath this emotion right now?",
  "What is one small, concrete thing you can do in the next 5 minutes to feel more grounded?"
];

// NEW: Distinct prompts for Future Self Advice
const FUTURE_SELF_PROMPTS = [
  "Imagine yourself 5 years from now — calm, happy, and at peace. Looking back at this moment, what do they want you to know?",
  "Your future self has already survived this. What did they learn from going through it?",
  "If this challenge is resolved a year from now, what small step did your future self take first?",
  "What would a wiser, more rested version of you say about how seriously you're taking this right now?"
];

// NEW: Step-through content for Body Scan
const BODY_SCAN_STEPS = [
  { area: "Head & Face", icon: "😌", instruction: "Notice any tension in your forehead, jaw, or neck. You don't need to fix it — just observe. Take one slow breath and let your face soften." },
  { area: "Shoulders & Arms", icon: "🤲", instruction: "Roll your shoulders back gently. Feel the weight of your arms. Let them be heavy and completely relaxed, like they're sinking into warm sand." },
  { area: "Chest & Breathing", icon: "🫁", instruction: "Notice your chest rising and falling on its own. Your breath doesn't need direction — just witness it becoming slower and more natural." },
  { area: "Stomach & Core", icon: "🌊", instruction: "Soften your belly intentionally. Let go of any tightness you have been holding here all day. You are safe in this moment." },
  { area: "Hips & Lower Back", icon: "🌿", instruction: "Release your lower back. Let your hips sink into wherever you are sitting or lying. Feel yourself fully supported by what is beneath you." },
  { area: "Legs & Feet", icon: "🌱", instruction: "Feel your legs become heavy. Wiggle your toes gently, then let them go still. You are fully grounded. Your body has carried you through everything — thank it." }
];

const EMOTIONS = {
  "Anger 😡": ["Frustrated", "Betrayed", "Annoyed", "Disrespected", "Resentful", "Bitter"],
  "Sadness 😞": ["Lonely", "Disappointed", "Grieving", "Hopeless", "Empty", "Hurt"],
  "Anxiety 😰": ["Overwhelmed", "Panicked", "Insecure", "Nervous", "Restless", "Dread"],
  "Joy 😊": ["Grateful", "Optimistic", "Proud", "Relieved", "Content", "Hopeful"]
};

const NEGATIVE_THOUGHTS = [
  "Stress", "Exams", "Pressure", "Fear", "Doubt", "Failure", "Overthinking",
  "Expectations", "Loneliness", "Rejection", "Judgement", "Anxiety", "Panic",
  "Sadness", "Regret", "Guilt", "Comparison", "FOMO", "Exhaustion", "Burnout",
  "Not enough", "Too much", "Deadlines", "Future", "Past", "Mistakes",
  "Unloved", "Unworthy", "Weak", "Tired", "Broken", "Lost", "Confused",
  "Trapped", "Stuck", "Hopeless", "Helpless", "Worthless", "Shame", "Embarrassment",
  "Nervous", "Worried", "Scared", "Tense", "Uneasy", "Agitated",
  "Frustrated", "Angry", "Resentful", "Jealous", "Insecure", "Inadequate",
  "Unwanted", "Ignored", "Forgotten", "Overlooked", "Misunderstood"
];

export default function MindSpace({ userData, onNavigate }) {
  const [activeWidgetCategory, setActiveWidgetCategory] = useState('calm');
  const [activeWidgetFullscreen, setActiveWidgetFullscreen] = useState(null);

  // Tool states
  const [breathePhase, setBreathePhase] = useState('Inhale');
  const [breatheScale, setBreatheScale] = useState(1);
  const [boxPhase, setBoxPhase] = useState('Inhale (4s)');
  const [popCount, setPopCount] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [focusTime, setFocusTime] = useState(120);
  const [groundingChecks, setGroundingChecks] = useState([false, false, false, false, false]);
  const [winsChecks, setWinsChecks] = useState([false, false, false, false, false]);
  const [destroyText, setDestroyText] = useState('');
  const [isDestroying, setIsDestroying] = useState(false);
  const [tapEnergy, setTapEnergy] = useState(0);
  const [currentCompliment, setCurrentCompliment] = useState(COMPLIMENTS[0]);
  const [currentPrompt, setCurrentPrompt] = useState(PROMPTS[0]);
  const [currentFuturePrompt, setCurrentFuturePrompt] = useState(FUTURE_SELF_PROMPTS[0]);
  const [sortInput, setSortInput] = useState('');
  const [inControl, setInControl] = useState(['My reactions', 'My effort']);
  const [outOfControl, setOutOfControl] = useState(['Other people', 'The past']);
  const [sleepCount, setSleepCount] = useState(100);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [hoverProgress, setHoverProgress] = useState(0);
  // NEW states
  const [bodyScanStep, setBodyScanStep] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [whyFeelingStep, setWhyFeelingStep] = useState(0);
  const [whyFeelingAnswers, setWhyFeelingAnswers] = useState(['', '', '', '', '']);
  const [nextStepTask, setNextStepTask] = useState('');
  const [nextStepAction, setNextStepAction] = useState('');

  // FIX: Added refs for Web Audio API (audio_rain was silent before)
  const audioContextRef = useRef(null);
  const noiseSourceRef = useRef(null);

  // FIX: Pre-compute random values with useMemo — previously Math.random() was called
  // inside .map() renders, generating new values on every re-render causing animation chaos.
  const equalizerDurations = useMemo(
    () => Array.from({ length: 12 }, () => (Math.random() * 1.2 + 0.4).toFixed(2)),
    []
  );
  const visualItems = useMemo(
    () => Array.from({ length: 7 }, (_, i) => ({
      id: i,
      cloudTop: Math.random() * 75,
      leafLeft: Math.random() * 95,
      driftDuration: Math.random() * 22 + 18,
      fallDuration: Math.random() * 12 + 8,
      delay: -(Math.random() * 25)
    })),
    []
  );

  // --- EFFECTS ---

  // 4-7-8 Breathing
  useEffect(() => {
    let interval;
    if (activeWidgetFullscreen?.type === 'breathing') {
      const cycle = () => {
        setBreathePhase('Breathe In...');
        setBreatheScale(1.5);
        setTimeout(() => {
          setBreathePhase('Hold...');
          setTimeout(() => {
            setBreathePhase('Breathe Out...');
            setBreatheScale(1);
          }, 7000);
        }, 4000);
      };
      cycle();
      interval = setInterval(cycle, 19000);
    }
    return () => clearInterval(interval);
  }, [activeWidgetFullscreen]);

  // Box Breathing (4-4-4-4)
  useEffect(() => {
    let interval;
    if (activeWidgetFullscreen?.type === 'box_breathing') {
      const phases = ['Inhale (4s)', 'Hold (4s)', 'Exhale (4s)', 'Hold (4s)'];
      let i = 0;
      const cycle = () => { setBoxPhase(phases[i]); i = (i + 1) % 4; };
      cycle();
      interval = setInterval(cycle, 4000);
    }
    return () => clearInterval(interval);
  }, [activeWidgetFullscreen]);

  // Bubble Game
  useEffect(() => {
    let interval;
    if (activeWidgetFullscreen?.type === 'game_pop') {
      setPopCount(0);
      setBubbles([]);
      interval = setInterval(() => {
        setBubbles(prev => {
          if (prev.length > 15) return prev;
          return [...prev, {
            id: Date.now() + Math.random(),
            left: Math.random() * 80 + 10 + '%',
            text: NEGATIVE_THOUGHTS[Math.floor(Math.random() * NEGATIVE_THOUGHTS.length)]
          }];
        });
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [activeWidgetFullscreen]);

  // Brain Dump Timer
  useEffect(() => {
    let interval;
    if (activeWidgetFullscreen?.type === 'timer') {
      interval = setInterval(() => {
        setFocusTime(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeWidgetFullscreen]);

  // Stress Tap drain
  useEffect(() => {
    let interval;
    if (activeWidgetFullscreen?.type === 'tap' && tapEnergy > 0) {
      interval = setInterval(() => setTapEnergy(e => Math.max(0, e - 2)), 200);
    }
    return () => clearInterval(interval);
  }, [activeWidgetFullscreen, tapEnergy]);

  // Sleep Countdown
  useEffect(() => {
    let interval;
    if (activeWidgetFullscreen?.type === 'countdown' && sleepCount > 0) {
      interval = setInterval(() => setSleepCount(c => c - 1), 3000);
    }
    return () => clearInterval(interval);
  }, [activeWidgetFullscreen, sleepCount]);

  // FIX: White Noise — added actual Web Audio API brown noise generation.
  // Previously there was only an animated visualizer with no sound at all.
  useEffect(() => {
    if (activeWidgetFullscreen?.type === 'audio_rain' && isAudioPlaying) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const sampleRate = ctx.sampleRate;
      const bufLen = sampleRate * 5; // 5-second looping buffer
      const buffer = ctx.createBuffer(2, bufLen, sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        let lastOut = 0;
        for (let i = 0; i < bufLen; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; // amplitude boost
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 700;

      const gain = ctx.createGain();
      gain.gain.value = 0.45;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      noiseSourceRef.current = source;
    }

    return () => {
      if (noiseSourceRef.current) {
        try { noiseSourceRef.current.stop(); } catch (_) {}
        noiseSourceRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [activeWidgetFullscreen, isAudioPlaying]);

  // --- HELPERS ---
  const formatTime = s => `${Math.floor(s / 60)}:${(s % 60 < 10 ? '0' : '') + (s % 60)}`;

  const stopAudio = () => {
    if (noiseSourceRef.current) { try { noiseSourceRef.current.stop(); } catch (_) {} noiseSourceRef.current = null; }
    if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
  };

  const closeFullscreenWidget = () => {
    stopAudio();
    setActiveWidgetFullscreen(null);
    setFocusTime(120);
    setGroundingChecks([false, false, false, false, false]);
    setWinsChecks([false, false, false, false, false]);
    setDestroyText('');
    setIsDestroying(false);
    setTapEnergy(0);
    setSleepCount(100);
    setSelectedEmotion(null);
    setHoverProgress(0);
    setBoxPhase('Inhale (4s)');
    setBodyScanStep(0);
    setIsAudioPlaying(false);
    setWhyFeelingStep(0);
    setWhyFeelingAnswers(['', '', '', '', '']);
    setNextStepTask('');
    setNextStepAction('');
  };

  const toggleChecklist = (index, setter) => {
    setter(prev => { const a = [...prev]; a[index] = !a[index]; return a; });
  };

  const handleSortAdd = (listType) => {
    if (!sortInput.trim()) return;
    if (listType === 'in') setInControl(p => [...p, sortInput]);
    else setOutOfControl(p => [...p, sortInput]);
    setSortInput('');
  };

  const updateWhyAnswer = (i, val) => {
    setWhyFeelingAnswers(prev => { const a = [...prev]; a[i] = val; return a; });
  };

  return (
    <div style={{ padding: '60px 48px', backgroundColor: '#FDFCFA', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,400&display=swap');

        .widget-tab { padding: 12px 24px; border-radius: 50px; font-weight: 600; font-size: 15px; cursor: pointer; transition: all 0.2s; border: 2px solid transparent; background: white; color: #7A8A7D; box-shadow: 0 2px 12px rgba(30,40,32,0.07); }
        .widget-tab:hover { transform: translateY(-2px); }
        .tool-card { background: white; border-radius: 22px; padding: 24px; border: 1px solid rgba(74,124,89,0.15); box-shadow: 0 2px 12px rgba(30,40,32,0.07); cursor: pointer; transition: all 0.2s; }
        .tool-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(30,40,32,0.10); }

        /* FIX: Was using camelCase (e.g. flexDirection) which is invalid in CSS — only valid as JSX inline style props */
        .fs-widget-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.96); backdrop-filter: blur(12px); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; animation: fadeIn 0.3s ease; overflow-y: auto; padding: 80px 20px 40px; }
        /* FIX: Changed to position: fixed so button stays visible when overlay content scrolls */
        /* FIX: Was using borderRadius and fontSize (camelCase) — invalid in a CSS <style> block */
        .fs-close-btn { position: fixed; top: 28px; right: 28px; background: rgba(255,255,255,0.1); border: none; color: white; width: 46px; height: 46px; border-radius: 50%; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; z-index: 10000; }
        .fs-close-btn:hover { background: rgba(239,68,68,0.8); }

        .btn { background: #4A7C59; color: white; border: none; padding: 14px 32px; border-radius: 50px; font-size: 16px; font-weight: bold; cursor: pointer; transition: all 0.2s; }
        .btn:hover { transform: translateY(-2px); opacity: 0.9; }

        .focus-input { width: 100%; padding: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; color: white; font-size: 17px; outline: none; transition: border 0.2s; box-sizing: border-box; font-family: inherit; }
        .focus-input:focus { border-color: #5B9EBF; background: rgba(255,255,255,0.08); }
        .focus-input::placeholder { color: rgba(255,255,255,0.35); }

        /* FIX: anim-up class was used throughout but never defined */
        @keyframes anim-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .anim-up { animation: anim-up 0.35s ease forwards; }

        @keyframes floatUp { from { opacity: 0.9; transform: translateY(100%); } to { opacity: 0; transform: translateY(-110vh); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes burnAway { 0% { filter: brightness(1) blur(0px); opacity: 1; transform: scale(1); } 50% { filter: brightness(2) blur(5px); opacity: 0.8; transform: scale(1.04) translateY(-8px); color: #ef4444; } 100% { filter: brightness(4) blur(12px); opacity: 0; transform: scale(1.2) translateY(-28px); } }
        @keyframes drift { from { transform: translateX(-150px); } to { transform: translateX(110vw); } }
        @keyframes fall { from { transform: translateY(-10vh) rotate(0deg); opacity: 0.8; } to { transform: translateY(110vh) rotate(380deg); opacity: 0.2; } }
        /* FIX: equalizer now uses pre-computed durations from useMemo — previously Math.random() re-ran on every render */
        @keyframes equalizer { 0%, 100% { height: 6px; } 50% { height: 52px; } }
        @keyframes boxTrace { 0% { top: 0; left: 0; } 25% { top: 0; left: 100%; } 50% { top: 100%; left: 100%; } 75% { top: 100%; left: 0; } 100% { top: 0; left: 0; } }
        @keyframes realHeartbeat { 0% { transform: scale(1); } 14% { transform: scale(1.14); } 28% { transform: scale(1); } 42% { transform: scale(1.12); } 100% { transform: scale(1); } }

        .destroying { animation: burnAway 1.5s ease-out forwards !important; pointer-events: none; }

        .check-item { display: flex; align-items: center; gap: 15px; padding: 18px; background: rgba(255,255,255,0.05); border-radius: 12px; margin-bottom: 10px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; width: 100%; max-width: 520px; }
        .check-item:hover { background: rgba(255,255,255,0.09); }
        .check-item.done { border-color: #6FAA80; opacity: 0.6; }
        .check-box { width: 28px; height: 28px; border: 2px solid rgba(255,255,255,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: 0.2s; flex-shrink: 0; font-size: 14px; }
        .check-item.done .check-box { background: #6FAA80; border-color: #6FAA80; }
        .check-item.done > span { text-decoration: line-through; }

        .hover-track { width: 280px; height: 280px; border-radius: 50%; border: 28px solid rgba(255,255,255,0.08); position: relative; display: flex; align-items: center; justify-content: center; cursor: crosshair; transition: border-color 0.3s; }
        .hover-track:hover { border-color: rgba(91,158,191,0.45); box-shadow: 0 0 40px rgba(91,158,191,0.2); }

        .box-container { width: 240px; height: 240px; border: 3px solid rgba(255,255,255,0.18); border-radius: 20px; position: relative; display: flex; align-items: center; justify-content: center; margin-bottom: 36px; }
        .box-tracer { position: absolute; width: 18px; height: 18px; background: #6FAA80; border-radius: 50%; box-shadow: 0 0 18px #6FAA80, 0 0 6px #fff; top: 0; left: 0; transform: translate(-50%, -50%); animation: boxTrace 16s linear infinite; }
        .pulse-heart { font-size: 110px; animation: realHeartbeat 1s infinite; filter: drop-shadow(0 0 28px rgba(239,68,68,0.45)); }

        .body-scan-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 32px; max-width: 580px; width: 100%; text-align: center; }
        .scan-progress { height: 3px; background: rgba(255,255,255,0.1); border-radius: 2px; width: 100%; max-width: 480px; margin: 0 auto 28px; overflow: hidden; }
        .scan-progress-fill { height: 100%; background: linear-gradient(90deg, #7C6FA0, #A78BC0); border-radius: 2px; transition: width 0.5s ease; }

        .step-dots { display: flex; gap: 8px; justify-content: center; margin-bottom: 24px; }
        .step-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(255,255,255,0.18); transition: all 0.3s; }
        .step-dot.active { background: #5B9EBF; transform: scale(1.4); }
        .step-dot.done { background: #6FAA80; }
        .why-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; padding: 28px 32px; max-width: 700px; width: 100%; }

        .next-step-card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 26px; max-width: 600px; width: 100%; margin-bottom: 14px; }
        .next-step-label { margin: 0 0 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); font-weight: 600; }

        .eq-bar { width: 7px; background: linear-gradient(to top, #5B9EBF, #7C6FA0); border-radius: 3px 3px 0 0; min-height: 6px; }
        .audio-viz { display: flex; gap: 5px; height: 56px; align-items: flex-end; }
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
              className="widget-tab"
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
                <span style={{ color: '#4A7C59' }}>▶ Enter Space</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FULLSCREEN WIDGET OVERLAY ─── */}
      {activeWidgetFullscreen && (
        <div className="fs-widget-overlay">
          <button className="fs-close-btn" onClick={closeFullscreenWidget}>✕</button>

          {/* 1. 4-7-8 BREATHING */}
          {activeWidgetFullscreen.type === 'breathing' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, #6FAA80 0%, #4A7C59 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', transform: `scale(${breatheScale})`, transition: 'transform 4s linear', boxShadow: '0 0 60px rgba(111,170,128,0.35)' }}>
                {activeWidgetFullscreen.icon}
              </div>
              <div style={{ marginTop: '64px', fontSize: '30px', fontWeight: '300', letterSpacing: '3px', fontFamily: 'Fraunces, serif' }}>{breathePhase}</div>
              <div style={{ marginTop: '16px', color: 'rgba(255,255,255,0.4)', fontSize: '14px', letterSpacing: '1px' }}>4 sec in · 7 sec hold · 8 sec out</div>
            </div>
          )}

          {/* 2. BOX BREATHING */}
          {activeWidgetFullscreen.type === 'box_breathing' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div className="box-container">
                <div className="box-tracer"></div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: 'white', textAlign: 'center', lineHeight: 1.3 }}>{boxPhase}</div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', maxWidth: '380px', textAlign: 'center', lineHeight: 1.7 }}>
                Follow the glowing dot. Inhale across the top, hold down the right, exhale across the bottom, hold up the left.
              </p>
            </div>
          )}

          {/* 3. POP THE THOUGHTS */}
          {activeWidgetFullscreen.type === 'game_pop' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '38px', marginBottom: '8px' }}>Pop the Thoughts</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', marginBottom: '24px' }}>
                Thoughts popped: <span style={{ color: 'white', fontWeight: 'bold' }}>{popCount}</span>
              </p>
              <div style={{ position: 'relative', width: '90%', height: '60vh', maxWidth: '800px', border: '2px dashed rgba(255,255,255,0.08)', borderRadius: '28px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
                {bubbles.map(b => (
                  <div
                    key={b.id}
                    style={{ position: 'absolute', width: '88px', height: '88px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', left: b.left, bottom: 0, animation: 'floatUp 4.5s linear forwards', userSelect: 'none', fontWeight: 'bold', fontSize: '12px', color: 'white', textAlign: 'center', padding: '8px', wordBreak: 'break-word', lineHeight: 1.3 }}
                    onClick={e => {
                      e.currentTarget.style.transform = 'scale(1.6)';
                      e.currentTarget.style.opacity = '0';
                      setTimeout(() => setBubbles(prev => prev.filter(x => x.id !== b.id)), 150);
                      setPopCount(c => c + 1);
                    }}
                  >{b.text}</div>
                ))}
              </div>
            </div>
          )}

          {/* 4. BRAIN DUMP TIMER */}
          {activeWidgetFullscreen.type === 'timer' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 20px' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '76px', fontWeight: 'bold', color: focusTime > 0 ? '#5B9EBF' : '#10b981', marginBottom: '8px', transition: 'color 0.5s', lineHeight: 1 }}>{formatTime(focusTime)}</div>
              {focusTime === 0 && <p style={{ color: '#10b981', marginBottom: '8px', fontSize: '16px' }}>Time's up. How do you feel?</p>}
              <textarea className="focus-input" style={{ height: '290px', maxWidth: '700px', resize: 'none', background: 'rgba(0,0,0,0.25)' }} placeholder="Type everything out. Don't stop. Don't edit. Just empty your mind here..."></textarea>
              <button className="btn" style={{ marginTop: '24px', background: '#5B9EBF' }} onClick={closeFullscreenWidget}>I feel lighter ✓</button>
            </div>
          )}

          {/* 5. GROUNDING / WINS CHECKLISTS */}
          {(activeWidgetFullscreen.type === 'checklist_grounding' || activeWidgetFullscreen.type === 'checklist_wins') && (() => {
            const isGrounding = activeWidgetFullscreen.type === 'checklist_grounding';
            const checks = isGrounding ? groundingChecks : winsChecks;
            const setter = isGrounding ? setGroundingChecks : setWinsChecks;
            const items = isGrounding
              ? ["👀 Find 5 things you can see", "🖐️ Find 4 things you can touch", "👂 Find 3 things you can hear", "👃 Find 2 things you can smell", "👅 Find 1 thing you can taste"]
              : ["💧 Drank a glass of water", "🚶 Stepped outside for a minute", "🛏️ Made my bed", "🍎 Ate something nourishing", "🌬️ Took 3 deep breaths"];
            return (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '34px', marginBottom: '32px', textAlign: 'center' }}>{activeWidgetFullscreen.title}</h2>
                {items.map((item, i) => (
                  <div key={i} className={`check-item ${checks[i] ? 'done' : ''}`} onClick={() => toggleChecklist(i, setter)}>
                    <div className="check-box">{checks[i] && '✓'}</div>
                    <span style={{ fontSize: '17px' }}>{item}</span>
                  </div>
                ))}
                {checks.every(c => c) && (
                  <button className="btn" style={{ marginTop: '32px', background: 'white', color: '#1E2820' }} onClick={closeFullscreenWidget}>Complete Exercise ✓</button>
                )}
              </div>
            );
          })()}

          {/* 6. WRITE & DESTROY */}
          {activeWidgetFullscreen.type === 'destroy' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '0 20px' }}>
              <div style={{ fontSize: '52px', marginBottom: '14px' }}>🔥</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', marginBottom: '10px' }}>Write & Destroy</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '28px', textAlign: 'center' }}>Type out exactly what is making you angry or stressed. Then burn it.</p>
              <textarea
                className={`focus-input ${isDestroying ? 'destroying' : ''}`}
                style={{ height: '210px', maxWidth: '620px', resize: 'none', background: 'rgba(0,0,0,0.25)' }}
                placeholder="I am so frustrated because..."
                value={destroyText}
                onChange={e => setDestroyText(e.target.value)}
                disabled={isDestroying}
              />
              {!isDestroying
                ? <button className="btn" style={{ marginTop: '24px', background: '#ef4444' }} onClick={() => { if (destroyText.trim()) setIsDestroying(true); }}>🔥 Burn This Thought</button>
                : <button className="btn" style={{ marginTop: '24px', background: 'white', color: '#1E2820' }} onClick={closeFullscreenWidget}>Let it go ✨</button>
              }
            </div>
          )}

          {/* 7. STRESS TAP */}
          {activeWidgetFullscreen.type === 'tap' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', marginBottom: '8px' }}>Release Physical Energy</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '36px', textAlign: 'center' }}>Tap as fast as you can until the bar is full.</p>
              <div style={{ width: '300px', height: '14px', background: 'rgba(255,255,255,0.1)', borderRadius: '7px', overflow: 'hidden', marginBottom: '36px' }}>
                <div style={{ width: `${tapEnergy}%`, height: '100%', background: tapEnergy === 100 ? '#10b981' : '#ef4444', transition: 'width 0.1s, background 0.4s', borderRadius: '7px' }}></div>
              </div>
              <button
                style={{ width: '175px', height: '175px', borderRadius: '50%', background: tapEnergy === 100 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)', border: `3px solid ${tapEnergy === 100 ? '#10b981' : '#ef4444'}`, color: 'white', fontSize: '26px', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none', transition: 'all 0.1s' }}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.93)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => setTapEnergy(e => Math.min(100, e + 8))}
              >
                {tapEnergy === 100 ? '🌿 Done!' : 'TAP!'}
              </button>
              {tapEnergy === 100 && <button className="btn" style={{ marginTop: '32px', background: 'white', color: '#1E2820' }} onClick={closeFullscreenWidget}>Close</button>}
            </div>
          )}

          {/* 8. COMPLIMENT GENERATOR */}
          {activeWidgetFullscreen.type === 'compliment' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px' }}>
              <div style={{ fontSize: '72px', marginBottom: '24px' }}>💌</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', color: '#E8845A', marginBottom: '40px', maxWidth: '700px', lineHeight: 1.45 }}>{currentCompliment}</h2>
              <button className="btn" style={{ background: '#E8845A' }} onClick={() => setCurrentCompliment(COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)])}>Open another letter</button>
            </div>
          )}

          {/* 9. CONTROL TOGGLE */}
          {activeWidgetFullscreen.type === 'sort' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '900px' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', marginBottom: '8px', textAlign: 'center' }}>What is actually in your control?</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '28px', textAlign: 'center' }}>Sort your worries. Then let go of what you can't change.</p>
              <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '28px', flexWrap: 'wrap' }}>
                <input type="text" className="focus-input" style={{ flex: 1, minWidth: '180px' }} placeholder="Type a worry or task..." value={sortInput} onChange={e => setSortInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSortAdd('in')} />
                <button className="btn" style={{ background: '#10b981', padding: '14px 18px', whiteSpace: 'nowrap' }} onClick={() => handleSortAdd('in')}>✓ In My Control</button>
                <button className="btn" style={{ background: '#ef4444', padding: '14px 18px', whiteSpace: 'nowrap' }} onClick={() => handleSortAdd('out')}>✗ Out of Control</button>
              </div>
              <div style={{ display: 'flex', width: '100%', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '180px', background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.25)', padding: '22px', borderRadius: '16px' }}>
                  <h3 style={{ color: '#10b981', margin: '0 0 14px' }}>Focus on this 🟢</h3>
                  {inControl.map((item, i) => <div key={i} style={{ padding: '10px 14px', background: 'rgba(16,185,129,0.08)', margin: '7px 0', borderRadius: '8px', fontSize: '14px' }}>{item}</div>)}
                </div>
                <div style={{ flex: 1, minWidth: '180px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)', padding: '22px', borderRadius: '16px', opacity: 0.65 }}>
                  <h3 style={{ color: '#ef4444', margin: '0 0 14px' }}>Let this go 🔴</h3>
                  {outOfControl.map((item, i) => <div key={i} style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', margin: '7px 0', borderRadius: '8px', fontSize: '14px', textDecoration: 'line-through' }}>{item}</div>)}
                </div>
              </div>
            </div>
          )}

          {/* 10. SLEEP COUNTDOWN */}
          {activeWidgetFullscreen.type === 'countdown' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: `rgba(0,0,0,${Math.min(0.65, (100 - sleepCount) / 100)})`, transition: 'background 3s linear' }}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '120px', color: `rgba(255,255,255,${0.25 + sleepCount / 130})`, transition: 'color 3s linear', lineHeight: 1 }}>{sleepCount}</div>
              <p style={{ fontSize: '20px', color: `rgba(255,255,255,${sleepCount / 130})`, letterSpacing: '2px', fontWeight: '300', marginTop: '20px', transition: 'color 3s linear' }}>Breathe in slowly... Let it out.</p>
              <button style={{ position: 'absolute', bottom: '36px', background: 'none', border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.4)', padding: '10px 22px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' }} onClick={closeFullscreenWidget}>Wake / Close</button>
            </div>
          )}

          {/* 11. BODY SCAN — NEW: Was type 'text' falling into a generic fallback. Now a full step-through guided UI. */}
          {activeWidgetFullscreen.type === 'body_scan' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '640px' }}>
              <div style={{ fontSize: '44px', marginBottom: '10px' }}>🧘</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', marginBottom: '4px', textAlign: 'center' }}>Body Scan</h2>
              <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '20px', fontSize: '14px' }}>Step {bodyScanStep + 1} of {BODY_SCAN_STEPS.length}</p>
              <div className="scan-progress">
                <div className="scan-progress-fill" style={{ width: `${((bodyScanStep + 1) / BODY_SCAN_STEPS.length) * 100}%` }}></div>
              </div>
              <div className="body-scan-card" key={bodyScanStep} style={{ animation: 'anim-up 0.35s ease forwards' }}>
                <div style={{ fontSize: '36px', marginBottom: '14px' }}>{BODY_SCAN_STEPS[bodyScanStep].icon}</div>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '24px', color: '#A78BC0', marginBottom: '18px', margin: '0 0 18px' }}>{BODY_SCAN_STEPS[bodyScanStep].area}</h3>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.85, margin: 0 }}>{BODY_SCAN_STEPS[bodyScanStep].instruction}</p>
              </div>
              <div style={{ display: 'flex', gap: '14px', marginTop: '22px' }}>
                {bodyScanStep > 0 && (
                  <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => setBodyScanStep(s => s - 1)}>← Back</button>
                )}
                {bodyScanStep < BODY_SCAN_STEPS.length - 1
                  ? <button className="btn" style={{ background: '#7C6FA0' }} onClick={() => setBodyScanStep(s => s + 1)}>Next Area →</button>
                  : <button className="btn" style={{ background: 'white', color: '#1E2820' }} onClick={closeFullscreenWidget}>Complete Scan ✓</button>
                }
              </div>
            </div>
          )}

          {/* 12. EMOTION WHEEL */}
          {activeWidgetFullscreen.type === 'emotion_wheel' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', marginBottom: '8px' }}>Pinpoint Your Feeling</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '36px' }}>Sometimes naming the emotion is half the battle.</p>
              {!selectedEmotion ? (
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '540px' }}>
                  {Object.keys(EMOTIONS).map(em => (
                    <button key={em} onClick={() => setSelectedEmotion(em)} style={{ padding: '18px 32px', fontSize: '17px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '14px', color: 'white', cursor: 'pointer', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>{em}</button>
                  ))}
                </div>
              ) : (
                <div className="anim-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '22px', color: '#5B9EBF', marginBottom: '14px' }}>You selected: {selectedEmotion}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '18px' }}>Does any of these feel more accurate?</p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '480px' }}>
                    {EMOTIONS[selectedEmotion].map(sub => (
                      <div key={sub} style={{ padding: '10px 18px', background: 'rgba(91,158,191,0.12)', border: '1px solid rgba(91,158,191,0.4)', borderRadius: '50px', color: 'white', fontSize: '14px' }}>{sub}</div>
                    ))}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '24px', fontSize: '14px', maxWidth: '380px', lineHeight: 1.7 }}>Recognizing and naming your emotion is a powerful first step toward understanding yourself.</p>
                  <button className="btn" style={{ marginTop: '24px', background: 'white', color: '#1E2820' }} onClick={() => setSelectedEmotion(null)}>← Start Over</button>
                </div>
              )}
            </div>
          )}

          {/* 13. JOURNAL PROMPT */}
          {activeWidgetFullscreen.type === 'prompt' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 20px', width: '100%', maxWidth: '720px' }}>
              <div style={{ fontSize: '52px', marginBottom: '14px' }}>{activeWidgetFullscreen.icon}</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '34px', color: 'white', marginBottom: '32px', lineHeight: 1.4 }}>{currentPrompt}</h2>
              <textarea className="focus-input" style={{ height: '240px', resize: 'none', background: 'rgba(0,0,0,0.25)', marginBottom: '22px' }} placeholder="Start reflecting here..."></textarea>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])}>New Prompt</button>
                <button className="btn" style={{ background: 'white', color: '#1E2820' }} onClick={closeFullscreenWidget}>Done Reflecting</button>
              </div>
            </div>
          )}

          {/* 14. WHY AM I FEELING THIS? — NEW: Was identical to Journal Prompt. Now a 5-step guided root-cause flow. */}
          {activeWidgetFullscreen.type === 'why_feeling' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '720px' }}>
              <div style={{ fontSize: '44px', marginBottom: '10px' }}>🔍</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', marginBottom: '24px', textAlign: 'center' }}>Find the Root Cause</h2>
              <div className="step-dots">
                {WHY_FEELING_QUESTIONS.map((_, i) => (
                  <div key={i} className={`step-dot ${i === whyFeelingStep ? 'active' : i < whyFeelingStep ? 'done' : ''}`}></div>
                ))}
              </div>
              <div className="why-card" key={whyFeelingStep} style={{ animation: 'anim-up 0.35s ease forwards' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 14px' }}>Question {whyFeelingStep + 1} of {WHY_FEELING_QUESTIONS.length}</p>
                <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', color: 'white', marginBottom: '22px', lineHeight: 1.5, margin: '0 0 22px' }}>{WHY_FEELING_QUESTIONS[whyFeelingStep]}</h3>
                <textarea className="focus-input" style={{ height: '130px', resize: 'none', background: 'rgba(0,0,0,0.2)' }} placeholder="Write freely here..." value={whyFeelingAnswers[whyFeelingStep]} onChange={e => updateWhyAnswer(whyFeelingStep, e.target.value)}></textarea>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '18px' }}>
                {whyFeelingStep > 0 && (
                  <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => setWhyFeelingStep(s => s - 1)}>← Back</button>
                )}
                {whyFeelingStep < WHY_FEELING_QUESTIONS.length - 1
                  ? <button className="btn" style={{ background: '#5B9EBF' }} onClick={() => setWhyFeelingStep(s => s + 1)}>Continue →</button>
                  : <button className="btn" style={{ background: 'white', color: '#1E2820' }} onClick={closeFullscreenWidget}>I have my answer ✓</button>
                }
              </div>
            </div>
          )}

          {/* 15. FUTURE SELF ADVICE — NEW: Was identical to Journal Prompt. Now has curated future-self prompts and distinct layout. */}
          {activeWidgetFullscreen.type === 'future_self' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 20px', width: '100%', maxWidth: '720px' }}>
              <div style={{ fontSize: '52px', marginBottom: '14px' }}>🕰️</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', marginBottom: '8px' }}>Future Self Advice</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '28px' }}>Hear what a wiser, calmer version of you wants to say.</p>
              <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '18px', padding: '24px 28px', marginBottom: '20px', textAlign: 'left', width: '100%' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 14px' }}>The prompt</p>
                <p style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', color: 'white', lineHeight: 1.65, margin: 0 }}>{currentFuturePrompt}</p>
              </div>
              <textarea className="focus-input" style={{ height: '200px', resize: 'none', background: 'rgba(0,0,0,0.25)', marginBottom: '22px', textAlign: 'left' }} placeholder="Write from your future self's perspective..."></textarea>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => setCurrentFuturePrompt(FUTURE_SELF_PROMPTS[Math.floor(Math.random() * FUTURE_SELF_PROMPTS.length)])}>Different Prompt</button>
                <button className="btn" style={{ background: 'white', color: '#1E2820' }} onClick={closeFullscreenWidget}>Done Reflecting</button>
              </div>
            </div>
          )}

          {/* 16. FOCUS LINE GAME */}
          {activeWidgetFullscreen.type === 'game_line' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', marginBottom: '8px' }}>Follow the Path</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '40px' }}>Keep your cursor steady on the ring to build focus.</p>
              <div className="hover-track" onMouseLeave={() => setHoverProgress(0)} onMouseMove={() => setHoverProgress(p => Math.min(100, p + 0.5))}>
                <span style={{ fontSize: '30px', filter: hoverProgress > 0 ? 'grayscale(0)' : 'grayscale(1)', transition: 'filter 0.3s' }}>🎯</span>
              </div>
              <div style={{ marginTop: '26px', color: hoverProgress === 100 ? '#10b981' : 'white', fontSize: '19px', fontWeight: 'bold', transition: 'color 0.3s' }}>
                Focus Level: {Math.floor(hoverProgress)}%
              </div>
              {hoverProgress === 100 && (
                <button className="btn" style={{ marginTop: '28px', background: 'white', color: '#1E2820' }} onClick={closeFullscreenWidget}>Focus achieved ✓</button>
              )}
            </div>
          )}

          {/* 17. WHITE NOISE — FIX: Was a silent fake visualizer. Now generates real brown noise via Web Audio API. */}
          {activeWidgetFullscreen.type === 'audio_rain' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: '58px', marginBottom: '14px' }}>🌧️</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', marginBottom: '6px', color: '#5B9EBF' }}>White Noise</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '40px', textAlign: 'center', maxWidth: '360px', lineHeight: 1.6 }}>
                {isAudioPlaying ? 'Gentle brown noise is playing. Close your eyes and breathe.' : 'Press play to fill the space with calming noise.'}
              </p>
              <div className="audio-viz" style={{ marginBottom: '36px', opacity: isAudioPlaying ? 1 : 0.25, transition: 'opacity 0.5s' }}>
                {equalizerDurations.map((dur, i) => (
                  <div key={i} className="eq-bar" style={{ animation: isAudioPlaying ? `equalizer ${dur}s ease-in-out infinite alternate` : 'none', height: '6px' }}></div>
                ))}
              </div>
              <button
                className="btn"
                style={{ background: isAudioPlaying ? 'rgba(239,68,68,0.15)' : '#5B9EBF', border: isAudioPlaying ? '1px solid rgba(239,68,68,0.5)' : 'none', fontSize: '17px', padding: '16px 48px' }}
                onClick={() => setIsAudioPlaying(p => !p)}
              >
                {isAudioPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
              <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '12px', marginTop: '18px' }}>Uses your device audio — keep volume comfortable</p>
            </div>
          )}

          {/* 18. HEARTBEAT SYNC */}
          {activeWidgetFullscreen.type === 'pulse' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', marginBottom: '44px' }}>Heartbeat Sync</h2>
              <div className="pulse-heart">🫀</div>
              <p style={{ marginTop: '56px', color: 'rgba(255,255,255,0.55)', fontSize: '17px', textAlign: 'center', maxWidth: '340px', lineHeight: 1.7 }}>
                Match your breathing to the rhythm. Breathe in as it expands, out as it contracts.
              </p>
            </div>
          )}

          {/* 19. NEXT 1 STEP — NEW: Was showing the same "one_task" UI as f1. Now a dedicated task decomposition flow. */}
          {activeWidgetFullscreen.type === 'next_step' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '660px' }}>
              <div style={{ fontSize: '44px', marginBottom: '10px' }}>🚶</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '30px', marginBottom: '8px', textAlign: 'center' }}>Break It Down to One Step</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '28px', textAlign: 'center', lineHeight: 1.6 }}>Big tasks feel overwhelming. Focus only on the very next action.</p>
              <div className="next-step-card">
                <p className="next-step-label">What is the big task or project?</p>
                <input type="text" className="focus-input" placeholder="e.g. Finish the quarterly report..." value={nextStepTask} onChange={e => setNextStepTask(e.target.value)} />
              </div>
              {nextStepTask.trim() && (
                <div className="next-step-card anim-up">
                  <p className="next-step-label">What is the ONE next physical action?</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '0 0 12px' }}>Something doable in the next 2 minutes. Be specific.</p>
                  <input type="text" className="focus-input" placeholder="e.g. Open the doc and write 3 bullet points..." value={nextStepAction} onChange={e => setNextStepAction(e.target.value)} />
                </div>
              )}
              {nextStepTask.trim() && nextStepAction.trim() && (
                <div className="anim-up" style={{ textAlign: 'center', marginTop: '8px', width: '100%', maxWidth: '600px' }}>
                  <div style={{ background: 'rgba(91,158,191,0.1)', border: '1px solid rgba(91,158,191,0.4)', borderRadius: '14px', padding: '18px 24px', marginBottom: '18px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 6px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Your only focus right now:</p>
                    <p style={{ color: 'white', fontFamily: 'Fraunces, serif', fontSize: '20px', margin: 0, lineHeight: 1.5 }}>{nextStepAction}</p>
                  </div>
                  <button className="btn" style={{ background: '#5B9EBF' }} onClick={closeFullscreenWidget}>I'm on it →</button>
                </div>
              )}
            </div>
          )}

          {/* 20. ONE-TASK FOCUS */}
          {activeWidgetFullscreen.type === 'one_task' && (
            <div style={{ textAlign: 'center', maxWidth: '580px', width: '100%', padding: '0 20px' }}>
              <div style={{ fontSize: '52px', marginBottom: '14px' }}>{activeWidgetFullscreen.icon}</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '34px', marginBottom: '10px' }}>{activeWidgetFullscreen.title}</h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '30px' }}>Hide everything else. Declare the one thing you are doing right now.</p>
              <input type="text" className="focus-input" style={{ fontSize: '20px', textAlign: 'center', padding: '20px' }} placeholder="The ONE thing I will do is..." />
              <button className="btn" style={{ marginTop: '28px', background: 'white', color: '#1E2820' }} onClick={closeFullscreenWidget}>Complete</button>
            </div>
          )}

          {/* 21. GRATITUDE QUICK-WRITE */}
          {/* FIX: Removed undefined 'form-input' class that was on the third input */}
          {activeWidgetFullscreen.type === 'gratitude' && (
            <div style={{ textAlign: 'center', maxWidth: '620px', width: '100%', padding: '0 20px' }}>
              <div style={{ fontSize: '52px', marginBottom: '14px' }}>✨</div>
              <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '34px', marginBottom: '8px' }}>Gratitude Quick-Write</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '28px' }}>Name 3 things that don't totally suck right now.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" className="focus-input" placeholder="1. I am grateful for..." />
                <input type="text" className="focus-input" placeholder="2. Something good that happened..." />
                <input type="text" className="focus-input" placeholder="3. Someone who helped me..." />
              </div>
              {/* FIX: Was using var(--ink) which was never defined, causing the button text to be invisible */}
              <button className="btn" style={{ marginTop: '28px', background: 'white', color: '#1E2820' }} onClick={closeFullscreenWidget}>Complete ✓</button>
            </div>
          )}

          {/* 22. VISUAL CLOUDS / LEAVES */}
          {/* FIX: Moved from inline Math.random() to pre-computed visualItems from useMemo */}
          {(activeWidgetFullscreen.type === 'visual_clouds' || activeWidgetFullscreen.type === 'visual_leaves') && (
            <>
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                {visualItems.map(item => (
                  <div key={item.id} style={{
                    position: 'absolute',
                    fontSize: '52px',
                    opacity: 0.22,
                    top: activeWidgetFullscreen.type === 'visual_clouds' ? `${item.cloudTop}%` : '-8%',
                    left: activeWidgetFullscreen.type === 'visual_leaves' ? `${item.leafLeft}%` : '-8%',
                    animation: activeWidgetFullscreen.type === 'visual_clouds'
                      ? `drift ${item.driftDuration}s linear infinite`
                      : `fall ${item.fallDuration}s linear infinite`,
                    animationDelay: `${item.delay}s`
                  }}>
                    {activeWidgetFullscreen.icon}
                  </div>
                ))}
              </div>
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: '34px', marginBottom: '12px' }}>{activeWidgetFullscreen.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px' }}>Watch the screen and let your mind wander freely.</p>
                <button className="btn" style={{ marginTop: '36px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={closeFullscreenWidget}>Close</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
