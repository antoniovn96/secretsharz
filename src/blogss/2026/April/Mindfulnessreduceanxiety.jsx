import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How Mindfulness Helps Reduce Anxiety Naturally",
  excerpt: "Mindfulness reduces anxiety not by making difficult things feel fine but by changing your relationship to the uncertainty and threat that anxiety feeds on. The science is specific, the practices are accessible, and the results are measurable. This guide explains exactly how it works and gives you seven actionable exercises to use today.",
  category: "Mental Health",
  date: "08-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/mindfulness-reduce-anxiety.jpg",
  tldr: "Mindfulness reduces anxiety through three measurable neurological mechanisms: reducing amygdala reactivity, improving prefrontal regulation of the stress response, and decreasing the ruminative thought patterns that maintain anxiety after the stressor has passed. For students, the most practically relevant benefits are reduced exam anxiety, better sleep onset, improved emotional recovery from setbacks, and the specific capacity to be anxious without being paralysed by it. Seven actionable exercises are included, from a 30-second technique for acute spikes to a 10-minute practice for sustained anxiety relief.",
  toc: [
    { id: "how-it-works",  title: "1. How Mindfulness Reduces Anxiety — The Exact Mechanisms",        level: 3 },
    { id: "student-anxiety",title: "2. The Four Types of Student Anxiety Mindfulness Addresses",     level: 3 },
    { id: "studio",        title: "3. Interactive: The Anxiety Relief Studio",                        level: 3 },
    { id: "practices",     title: "4. Seven Calming Mindfulness Practices — Step by Step",            level: 3 },
    { id: "daily",         title: "5. Building a Daily Anti-Anxiety Mindfulness Habit",               level: 3 },
    { id: "faq",           title: "6. Mindfulness for Anxiety FAQs",                                  level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-08T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "mindfulness for anxiety, mindfulness reduce anxiety, mindfulness anxiety relief, calming mindfulness practices, mindfulness anxiety exercises, how mindfulness helps anxiety, student anxiety mindfulness",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Does mindfulness actually help with anxiety?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — mindfulness is one of the most extensively researched non-pharmacological interventions for anxiety. A 2014 meta-analysis by Hofmann and colleagues reviewed 39 studies of Mindfulness-Based Stress Reduction and Mindfulness-Based Cognitive Therapy and found significant effect sizes for anxiety reduction across all populations studied. For students specifically, multiple randomised controlled trials document significant reductions in exam anxiety, generalised worry, and physiological stress markers following 8-week mindfulness programmes. The effects are produced through specific neurological mechanisms — amygdala reduction, prefrontal strengthening, and HPA axis regulation — not through placebo effects.",
      },
    },
    {
      "@type": "Question",
      "name": "How quickly does mindfulness reduce anxiety?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Acute anxiety reduction from breathing-based mindfulness can occur within 30 seconds (physiological sigh) to 5 minutes (box breathing or 4-7-8 breathing). Sustained anxiety reduction — measurable changes in baseline anxiety levels and amygdala reactivity — typically requires 8 weeks of daily practice (27-40 minutes per day) based on Hölzel et al.'s landmark 2011 neuroimaging study. However, shorter daily practices (5-10 minutes) produce measurable benefits after 2-4 weeks for exam anxiety and perceived stress, as documented in student-specific research by Larcombe et al. (2018). The short-term techniques work immediately; the long-term neurological changes require consistent daily practice.",
      },
    },
    {
      "@type": "Question",
      "name": "What is the best mindfulness practice for exam anxiety?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For exam anxiety specifically, the most evidence-supported practices are: the physiological sigh (for acute pre-exam spikes — works in 30 seconds), 5-4-3-2-1 sensory grounding (for the scattered, unfocused version of exam anxiety — works in 2-3 minutes), and breath awareness with non-judgemental observation of anxious thoughts (for the sustained background anxiety during exam preparation — requires 5-10 minutes daily). Research by Kabat-Zinn on mindfulness-based stress reduction in high-stakes performance contexts shows that the combination of physiological regulation and non-judgemental observation produces better outcomes than either alone.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const TEAL8   = '#1F6B7A';
const TPALE8  = '#EBF4F6';
const TBORD8  = 'rgba(31,107,122,0.22)';

// ── Anxiety types ──────────────────────────────────────────────────────────────
const ANXIETY_TYPES = [
  {
    key:      'exam',
    icon:     '📝',
    label:    'Exam and performance anxiety',
    color:    '#2D5A8A',
    bg:       '#EEF3FB',
    when:     'Before and during exams, assessments, presentations',
    what:     'The anticipation of being judged activates the amygdala\'s social threat response alongside the performance uncertainty threat. The combination produces acute physiological arousal, cognitive narrowing (reduced working memory), and the specific blanking experience where known information becomes temporarily inaccessible under pressure.',
    best_practice: 'Physiological sigh immediately before, then 5-4-3-2-1 grounding to anchor in the present exam environment rather than the imagined failure scenario. During the exam: three extended exhale breaths at any moment of acute anxiety spike.',
    mindful_reframe: 'The anxiety is not predicting failure — it is the body responding to a situation that matters. "I notice I am anxious. This is my system responding to something important. The information I prepared is available."',
    research: 'Zylowska et al. (2008) found that mindfulness training in high-pressure academic contexts produced significant reductions in both subjective exam anxiety and objective performance impairment during testing.',
  },
  {
    key:      'results',
    icon:     '📊',
    label:    'Results waiting anxiety',
    color:    '#8B2635',
    bg:       '#FBF0F1',
    when:     'During the days and weeks between exams and results',
    what:     'Waiting anxiety is produced by irreducible uncertainty — the result is fixed and unalterable, but the knowledge of it is not yet available. The brain\'s threat detection system activates in response to uncertainty as strongly as it does to known threat. Research by Alia Crum at Stanford shows uncertainty activates stronger and more sustained anxiety than a known negative outcome because simulation of possible bad outcomes runs continuously without the resolution that actual information would provide.',
    best_practice: 'The parking lot technique — write every worry about the result in one sentence, then close the notebook. Daily breath awareness practice to build tolerance for uncertainty without amplification.',
    mindful_reframe: '"The result is already fixed. My anxiety cannot change it. What I can do in this moment is [specific present-moment action]."',
    research: 'Research on intolerance of uncertainty (Dugas, Concordia) shows that mindfulness directly builds uncertainty tolerance — the capacity to remain functional in the face of unresolved outcomes — which is the specific psychological skill waiting anxiety requires.',
  },
  {
    key:      'social',
    icon:     '👥',
    label:    'Social and comparison anxiety',
    color:    '#5B3A8B',
    bg:       '#F2EEF9',
    when:     'In peer groups, after results are shared, on social media, in competitive academic environments',
    what:     'Social anxiety in academic contexts is produced by the combination of genuine social evaluation (being ranked, graded, and compared) and the additional layer of social media comparison that extends the evaluation context beyond the classroom into every waking hour. The specific cognitive distortion: comparing your full, known, internal experience (including all doubts, gaps, and fears) to others\' visible, curated external presentation.',
    best_practice: 'Single-sense anchoring during social comparison moments: return attention to one physical sensation as an anchor to your own present experience rather than the comparison mental space. Daily loving-kindness practice to build compassionate relationship with your own academic experience.',
    mindful_reframe: '"I am comparing my internal experience to their external presentation. These are not comparable things. My experience is mine and complete; theirs is a surface I cannot see beneath."',
    research: 'Research by Neff and colleagues shows that self-compassion — directly built by loving-kindness mindfulness practice — is associated with significantly lower social comparison anxiety and stronger academic resilience than self-esteem.',
  },
  {
    key:      'future',
    icon:     '🔮',
    label:    'Future catastrophising anxiety',
    color:    TEAL8,
    bg:       TPALE8,
    when:     'When thinking about career, pathways, consequences of academic outcomes — "what if" chains',
    what:     'Future anxiety is produced by the mind\'s capacity for mental time travel — simulating future scenarios in enough detail that the physiological stress response activates as though the feared scenario is present. The specific pattern: a "what if" thought triggers a simulation, the simulation triggers anxiety, the anxiety triggers more what-if thoughts, the chain escalates to existential catastrophe in minutes.',
    best_practice: 'The "what is true right now?" anchor — at any point in a future anxiety spiral, pause and identify one specific true thing about the present moment. This is not denial of future uncertainty; it is the reorientation to the only timeframe where action is possible.',
    mindful_reframe: '"That future has not happened. I am experiencing the fear of it as though it has. Right now, in this moment, I am [specific present description]."',
    research: 'Research on mindfulness and temporal self-focus by Farb et al. (2007) at Toronto shows that mindfulness training reduces the default mode network\'s past-future temporal processing and increases present-moment neural engagement — directly addressing the mental time travel mechanism of future anxiety.',
  },
];

// ── Practice library ───────────────────────────────────────────────────────────
const ANXIETY_PRACTICES = [
  {
    id:        'physio_sigh',
    number:    '01',
    name:      'Physiological Sigh',
    subtitle:  'Fastest anxiety reset — 30 seconds',
    icon:      '😮‍💨',
    color:     '#1A7272',
    duration:  30,
    anxiety_type: ['exam', 'results', 'future'],
    when:     'Acute anxiety spike — before an exam, before a difficult conversation, at the first sign of panic',
    how: [
      'Inhale through the nose until the lungs feel about 80% full',
      'Without exhaling, take one sharp additional top-up inhale through the nose',
      'Exhale slowly and completely through the mouth — as long as possible',
      'Repeat 1-3 times',
    ],
    science: 'Research by Huberman Lab (Stanford) identifies this as the brain\'s own built-in stress reset mechanism. The double inhale re-inflates collapsed alveoli, and the extended exhale maximally activates the vagal brake — producing the fastest available parasympathetic activation of any voluntary breathing pattern.',
    student_use: '"I do it three times standing outside the exam hall. It doesn\'t make me not anxious. It makes me functional instead of frozen." — Aryan',
  },
  {
    id:        'present_anchor',
    number:    '02',
    name:      'Present-Moment Anchor',
    subtitle:  'Interrupts the future/past spiral — 2 minutes',
    icon:      '⚓',
    color:     '#2D5A8A',
    duration:  120,
    anxiety_type: ['future', 'results', 'exam'],
    when:     'When anxiety is pulling attention toward an imagined future or replayed past — the spiral has begun',
    how: [
      'Notice: "I am experiencing anxiety." Do not fight it or rush past it.',
      'Press both feet firmly into the floor. Notice the specific pressure and temperature.',
      'Name three things you can see from exactly where you are — specific, concrete objects.',
      'Take one slow breath and say quietly: "Right now, in this moment, I am here. The anxiety is about a time that is not now."',
      'Identify one specific action available in the present moment — the smallest possible useful step.',
    ],
    science: 'Research by Farb et al. at Toronto shows that redirecting attention to present-moment sensory experience activates a different neural mode (experiential mode) than the narrative self-focused mode of anxiety rumination. The two modes suppress each other — present-moment grounding directly reduces the temporal self-focus of anxiety.',
    student_use: '"The moment I can name what I can see right now, the spiral gets smaller. It\'s like the room reminds me where I actually am." — Meera',
  },
  {
    id:        'box_breathing',
    number:    '03',
    name:      'Box Breathing (4-4-4-4)',
    subtitle:  'Nervous system balance — 3 minutes',
    icon:      '⬜',
    color:     '#2D6B45',
    duration:  180,
    anxiety_type: ['exam', 'social', 'future'],
    when:     'Pre-exam preparation, during study session anxiety, before a stressful social situation',
    how: [
      'Inhale through the nose for 4 counts',
      'Hold the breath for 4 counts — body relaxed, no strain',
      'Exhale through the nose or mouth for 4 counts',
      'Hold the empty breath for 4 counts',
      'Repeat for 4-6 cycles (2-3 minutes)',
    ],
    science: 'Box breathing produces heart rate variability improvements through both the extended exhale and the breath hold phases. Research on HRV biofeedback shows this pattern specifically activates the vagal tone that governs stress resilience — used in clinical PTSD treatment and Navy SEAL preparation for high-pressure performance contexts.',
    student_use: '"I used this for the five minutes before walking into my board exam. By the second cycle I felt less like I was falling and more like I was standing somewhere solid." — Vikram',
  },
  {
    id:        'thought_clouds',
    number:    '04',
    name:      'Anxiety Cloud Observation',
    subtitle:  'Watch thoughts without being inside them — 5 minutes',
    icon:      '☁️',
    color:     '#5B3A8B',
    duration:  300,
    anxiety_type: ['results', 'future', 'social'],
    when:     'When anxious thoughts are recurring and gaining momentum — results waiting period, pre-exam week',
    how: [
      'Sit comfortably with eyes closed. Take three slow breaths to settle.',
      'Allow anxious thoughts to arise naturally — do not try to stop them.',
      'As each anxious thought arrives, imagine it as a cloud drifting across the sky. You can see it — label it: "worry about result," "fear of failure," "comparison thought."',
      'Watch each cloud pass. You are the sky — vast and unchanging. The clouds pass through you without changing you.',
      'When you are pulled into a cloud\'s story, gently note "thinking" and return to being the sky.',
      'Continue for 5 minutes.',
    ],
    science: 'This practice is a direct implementation of the defusion technique from Acceptance and Commitment Therapy (Hayes et al.). Research shows defusion produces significant reductions in the believability and emotional impact of anxious thoughts — not by eliminating them but by changing the relationship between the observer and the thought from fusion to observation.',
    student_use: '"The exams-are-coming anxiety thoughts used to feel like they were me. Once I started watching them as weather, they were still there but they couldn\'t pull me in the same way." — Priya',
  },
  {
    id:        'loving_kindness_anxiety',
    number:    '05',
    name:      'Self-Compassion Reset',
    subtitle:  'For shame and social anxiety — 3 minutes',
    icon:      '💛',
    color:     '#C07800',
    duration:  180,
    anxiety_type: ['social', 'results'],
    when:     'After a disappointing result, when social comparison has been painful, when shame or self-criticism is amplifying anxiety',
    how: [
      'Sit quietly. Bring to mind the specific difficulty causing anxiety — do not push it away.',
      'Acknowledge it: "This is a moment of difficulty. This is genuinely hard."',
      'Recognise: "I am not alone in this. Every student who has tried what I am trying has felt something like this."',
      'Offer kindness: "May I be gentle with myself right now. May I give myself what I need."',
      'Repeat these three steps slowly, twice.',
      'Take one breath and notice if anything has shifted.',
    ],
    science: 'Research by Neff at UT Austin shows the three components of self-compassion (mindful acknowledgment, common humanity, self-kindness) specifically interrupt the shame-anxiety loop — in which social anxiety triggers self-criticism, self-criticism amplifies anxiety, and the loop escalates. Self-compassion breaks the loop at the self-criticism stage.',
    student_use: '"I used to get anxiety about the anxiety — like feeling bad about feeling bad. The self-compassion practice was the first thing that actually stopped the second layer." — Ananya',
  },
  {
    id:        'body_scan_anxiety',
    number:    '06',
    name:      'Anxiety Body Scan',
    subtitle:  'Locate and release physical anxiety — 5 minutes',
    icon:      '🧘',
    color:     '#8B2635',
    duration:  300,
    anxiety_type: ['exam', 'social', 'future', 'results'],
    when:     'When anxiety is primarily physical — tight chest, tense jaw, shallow breathing — rather than primarily cognitive',
    how: [
      'Lie down or sit comfortably. Close your eyes.',
      'Bring attention to the top of your head and slowly move downward.',
      'At each body area, ask: "Is there any tension, tightening, or holding here?" Notice without judgment.',
      'At areas where you find tension — jaw, shoulders, chest, stomach are common anxiety locations — breathe toward that area: imagine the breath flowing into the tension on the inhale, and releasing slightly on the exhale.',
      'You are not forcing relaxation — you are noticing where the anxiety has made a home in your body and gently acknowledging it.',
      'Complete the scan from head to feet. Take three slow breaths.',
    ],
    science: 'Research on somatic awareness in anxiety treatment shows that bodily symptoms of anxiety (tension, tightness, shallow breathing) maintain the anxiety response by providing ongoing physiological feedback that the threat is present. The body scan interrupts this feedback loop by bringing conscious awareness to the physical sensations — which activates the prefrontal observation system and reduces the automatic threat-maintenance function of the bodily arousal.',
    student_use: '"My anxiety was always in my jaw and my stomach. Once I could find it and name it in my body, it felt less like everything and more like a specific thing in a specific place." — Rohan',
  },
  {
    id:        'five_minute_formal',
    number:    '07',
    name:      'Five-Minute Formal Mindfulness',
    subtitle:  'The foundational daily anxiety practice',
    icon:      '🌅',
    color:     TEAL8,
    duration:  300,
    anxiety_type: ['exam', 'results', 'social', 'future'],
    when:     'Daily — morning practice that builds the anxiety-reducing brain changes over 2-4 weeks',
    how: [
      'Sit comfortably with the back supported. Set a timer for 5 minutes.',
      'Take three slow breaths to arrive. Allow the body to settle.',
      'Bring attention to the physical sensation of breathing — not the idea of it, the actual sensation at the nostrils or the rise and fall of the chest.',
      'When attention wanders (it will — immediately and repeatedly), simply notice "my attention wandered" and return it to the breath. No judgment. No counting of wanderings.',
      'Each time attention is returned, the practice has succeeded once. Thirty returns in five minutes is thirty successful practice repetitions.',
      'When the timer sounds, take three slow breaths before opening your eyes.',
    ],
    science: 'This is the practice that produces the structural brain changes documented by Hölzel et al. at MGH: reduced amygdala grey matter density, increased prefrontal-amygdala connectivity, increased hippocampal volume. Five minutes daily for 8 weeks produces measurable changes; 2-4 weeks produces measurable anxiety reduction in student populations.',
    student_use: '"For the first two weeks nothing seemed to happen. In week three I noticed I was less anxious between sessions — not just during them. That\'s when I understood what it was actually building." — Ishaan',
  },
];

// ── Timed practice component ───────────────────────────────────────────────────
function PracticeTimer({ practice, onClose }) {
  const [phase,   setPhase]   = useState('intro'); // intro | active | done
  const [timeLeft,setTimeLeft]= useState(practice.duration);
  const [running, setRunning] = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) { clearInterval(intRef.current); setRunning(false); setPhase('done'); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running]);

  const CIRC = 2 * Math.PI * 44;
  const pct  = (practice.duration - timeLeft) / practice.duration;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div style={{ background: `${practice.color}08`, borderRadius: '14px', overflow: 'hidden', border: `2px solid ${practice.color}30`, fontFamily: font }}>
      <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${practice.color}15`, borderBottom: `1px solid ${practice.color}20` }}>
        <div>
          <span style={{ fontSize: '16px', marginRight: '8px' }}>{practice.icon}</span>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: practice.color }}>{practice.name}</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px' }}>×</button>
      </div>

      <div style={{ padding: '18px' }}>
        {phase === 'intro' && (
          <>
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: practice.color, marginBottom: '6px' }}>Steps:</div>
              {practice.how.map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '4px 0', borderBottom: i < practice.how.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: practice.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{h}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: '9px', padding: '9px 12px', marginBottom: '14px', border: `1px solid ${practice.color}25` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: practice.color, marginBottom: '3px' }}>💡 SCIENCE:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{practice.science}</p>
            </div>
            <button onClick={() => { setPhase('active'); setRunning(true); }} style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`,
              color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
            }}>▶ Begin Practice</button>
          </>
        )}

        {phase === 'active' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 16px auto' }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="44" fill="none" stroke={`${practice.color}18`} strokeWidth="6" />
                <circle cx="60" cy="60" r="44" fill="none" stroke={practice.color} strokeWidth="6"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - pct)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: practice.color, lineHeight: 1 }}>
                  {mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '2px' }}>{mins > 0 ? 'remaining' : 'sec'}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 14px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto' }}>
              {practice.how[Math.min(Math.floor(pct * practice.how.length), practice.how.length - 1)]}
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {running
                ? <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '10px 22px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
                : <button onClick={() => setRunning(true)} style={{ padding: '10px 22px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>
              }
              <button onClick={() => { clearInterval(intRef.current); setPhase('intro'); setTimeLeft(practice.duration); setRunning(false); }} style={{ padding: '10px 18px', borderRadius: '50px', border: `1.5px solid ${practice.color}40`, background: 'transparent', color: practice.color, fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>↺ Restart</button>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '44px', marginBottom: '10px' }}>🌅</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: practice.color, marginBottom: '8px' }}>Practice Complete</div>
            <p style={{ margin: '0 0 14px 0', fontSize: '14px', color: 'var(--ink-soft)' }}>Take a moment to notice: how does your body feel right now compared to when you started?</p>
            <div style={{ background: 'white', borderRadius: '10px', padding: '11px 14px', marginBottom: '14px', border: `1px solid ${practice.color}25`, textAlign: 'left' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: practice.color, marginBottom: '4px' }}>👤 A student on this practice:</div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, fontStyle: 'italic' }}>"{practice.student_use}"</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setPhase('intro'); setTimeLeft(practice.duration); setRunning(false); }} style={{ padding: '10px 18px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${practice.color}, ${practice.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Practice Again</button>
              <button onClick={onClose} style={{ padding: '10px 18px', borderRadius: '50px', border: `1.5px solid var(--border)`, background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back to Studio</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Anxiety Relief Studio ──────────────────────────────────────────────────────
function AnxietyReliefStudio() {
  const [anxietyType, setAnxietyType] = useState(null);
  const [activePract, setActivePract] = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const filtered = anxietyType
    ? ANXIETY_PRACTICES.filter(p => p.anxiety_type.includes(anxietyType))
    : ANXIETY_PRACTICES;

  const selType = ANXIETY_TYPES.find(t => t.key === anxietyType);

  if (activePract) {
    const practice = ANXIETY_PRACTICES.find(p => p.id === activePract);
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <PracticeTimer practice={practice} onClose={() => setActivePract(null)} />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
        The Anxiety Relief Studio
      </p>
      <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
        Filter by your anxiety type or browse all seven practices. Each includes full step-by-step instructions and a guided timer.
      </p>

      {/* Anxiety type filter */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)', marginBottom: '8px' }}>Filter by anxiety type:</div>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          <button onClick={() => setAnxietyType(null)} style={{
            padding: '6px 14px', borderRadius: '20px', border: '1.5px solid',
            borderColor: !anxietyType ? TEAL8 : 'var(--border)', background: !anxietyType ? TPALE8 : 'white',
            color: !anxietyType ? TEAL8 : 'var(--muted)', fontWeight: !anxietyType ? '700' : '500',
            fontSize: '12px', cursor: 'pointer', fontFamily: font,
          }}>All practices</button>
          {ANXIETY_TYPES.map(t => (
            <button key={t.key} onClick={() => setAnxietyType(anxietyType === t.key ? null : t.key)} style={{
              padding: '6px 12px', borderRadius: '20px', border: '1.5px solid',
              borderColor: anxietyType === t.key ? t.color : 'var(--border)',
              background: anxietyType === t.key ? t.bg : 'white',
              color: anxietyType === t.key ? t.color : 'var(--muted)',
              fontWeight: anxietyType === t.key ? '700' : '500',
              fontSize: '12px', cursor: 'pointer', fontFamily: font, display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              <span>{t.icon}</span><span>{t.label.split(' ')[0]} anxiety</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter context */}
      {selType && (
        <div style={{ background: selType.bg, border: `1.5px solid ${selType.color}30`, borderRadius: '10px', padding: '11px 14px', marginBottom: '14px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: selType.color, marginBottom: '4px', textTransform: 'uppercase' }}>{selType.icon} {selType.label}</div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}><strong>Best practice:</strong> {selType.best_practice}</p>
        </div>
      )}

      {/* Practice cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(p => (
          <button key={p.id} onClick={() => setActivePract(p.id)} style={{
            padding: '14px 16px', borderRadius: '12px', border: '2px solid var(--border)',
            background: 'white', cursor: 'pointer', fontFamily: font, textAlign: 'left',
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '12px',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.background = `${p.color}06`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${p.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
              {p.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: p.color }}>{p.number}</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>{p.name}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{p.subtitle}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: p.color, marginBottom: '2px' }}>
                {p.duration < 60 ? `${p.duration}s` : `${Math.ceil(p.duration / 60)} min`}
              </div>
              <div style={{ fontSize: '16px', color: p.color }}>▶</div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '13px', margin: '12px 0' }}>
          No practices match this filter — try another type or view all.
        </p>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MindfulnessReduceAnxiety({ navigate, relatedPosts }) {
  return (
    <BlogPostTemplate meta={meta} navigate={navigate} relatedPosts={relatedPosts}>

      <Head>
        <title>{meta.title} | Secret Sharz</title>
        <meta name="description"        content={meta.excerpt} />
        <meta property="og:title"       content={meta.title} />
        <meta property="og:description" content={meta.excerpt} />
        <meta property="og:image"       content={meta.imgUrl} />
        <meta property="og:type"        content="article" />
        <meta property="twitter:card"   content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>

      {/* ── Introduction ── */}
      <p>Anxiety and students are rarely apart. The exam coming up, the result not yet arrived, the group chat filling with comparisons, the future that feels like it is balancing on the outcome of a paper — these are genuinely anxiety-producing situations, and the anxiety is, in most cases, an appropriate response to real uncertainty and real stakes.</p>

      <p>What <strong>mindfulness for anxiety</strong> offers is not the removal of the anxiety but the development of a specific relationship with it: the capacity to feel anxious without being consumed by it, to notice the anxiety arriving without automatically handing it the steering wheel, and to return to functional present-moment engagement even when the anxiety is still present. This guide explains exactly how mindfulness achieves this — mechanistically, not vaguely — and gives you seven practices to experience it directly.</p>

      <img
        src={meta.imgUrl}
        alt="Mindfulness practices to reduce anxiety naturally — science-backed calming exercises for students with exam stress and academic pressure"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="how-it-works">1. How Mindfulness Reduces Anxiety — The Exact Mechanisms</h3>

      <p><strong>Mechanism 1: Amygdala grey matter reduction.</strong> The amygdala is the brain's primary threat detection and emotional activation centre — the structure whose activation produces the physiological experience of anxiety. Research by Britta Hölzel and colleagues at Massachusetts General Hospital and Harvard Medical School (2010) documented measurably reduced grey matter density in the amygdala following eight weeks of Mindfulness-Based Stress Reduction practice. Reduced grey matter density in this context means reduced structural reactivity: the amygdala activates less readily and less intensely in response to the same stressors. This is a permanent structural change, not a temporary state — and it is directly measurable with neuroimaging. For students, this translates to: the exam still matters, but the amygdala's threat response to it is less extreme.</p>

      <p><strong>Mechanism 2: Improved prefrontal-amygdala connectivity.</strong> Hölzel's research also documented increased functional connectivity between the medial prefrontal cortex and the amygdala following mindfulness training. The prefrontal cortex is the brain's regulation centre — it modulates the amygdala's threat responses through top-down control. Think of it as a dimmer switch on the anxiety response. Mindfulness practice strengthens this prefrontal-amygdala connection, improving the brain's own natural anxiety regulation capacity. Research by Creswell and colleagues at Carnegie Mellon confirmed that mindfulness training specifically produces this connectivity improvement — and that the improvement correlates with reported anxiety reductions.</p>

      <p><strong>Mechanism 3: HPA axis regulation and cortisol reduction.</strong> The hypothalamic-pituitary-adrenal (HPA) axis is the biological stress response system that produces cortisol under threat activation. Chronic academic anxiety produces chronic HPA activation — which means chronically elevated cortisol, which produces the physical symptoms of anxiety (poor sleep, frequent illness, poor concentration, persistent muscle tension) alongside the psychological ones. Research by Jacobs and colleagues and multiple subsequent meta-analyses document significant cortisol reductions following mindfulness training — the HPA axis is less easily activated and returns to baseline more quickly after activation. For students, this directly addresses the physical dimension of exam-season anxiety that often feels most overwhelming.</p>

      <p><strong>Mechanism 4: Default mode network deactivation and rumination reduction.</strong> Anxiety is primarily maintained by the default mode network (DMN) — the brain regions that produce self-referential thought, future simulation, and past review. When the DMN runs without regulation, it produces the specific type of anxious thought that most students describe: "what if I fail?" chains that escalate through several steps to global catastrophe. Research by Brewer and colleagues at Yale and Brown documented that experienced mindfulness practitioners show significantly less default mode network activity and greater present-moment neural engagement than controls — directly reducing the mental time travel that maintains anxiety between stressors.</p>

      <p><strong>Mechanism 5: Affect labelling and amygdala regulation through language.</strong> Research by Matthew Lieberman at UCLA on affect labelling shows that naming an anxious state specifically — "I notice I am feeling anxious about the result" — activates the prefrontal language areas, which produce top-down inhibition of the amygdala's activation. The naming creates a small but measurable reduction in amygdala activity within seconds of the label. This is why every mindfulness instruction includes the directive to notice and name — it is a specific neurological intervention, not a platitude.</p>

      {/* ── Section 2 ── */}
      <h3 id="student-anxiety">2. The Four Types of Student Anxiety Mindfulness Addresses</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
        {ANXIETY_TYPES.map(at => (
          <div key={at.key} style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${at.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '22px' }}>{at.icon}</span>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: at.color }}>{at.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>When: {at.when}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{at.what}</p>
            <div style={{ background: at.bg, borderRadius: '9px', padding: '10px 12px', marginBottom: '8px', border: `1px solid ${at.color}25` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: at.color, marginBottom: '3px' }}>🧘 BEST MINDFULNESS APPROACH:</div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{at.best_practice}</p>
            </div>
            <div style={{ background: '#FBF7EE', borderRadius: '8px', padding: '9px 12px', border: '1px solid rgba(155,117,37,0.2)' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#9B7525', marginBottom: '3px' }}>💬 MINDFUL REFRAME:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6, fontStyle: 'italic' }}>{at.mindful_reframe}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 3: Interactive ── */}
      <h3 id="studio">3. Interactive: The Anxiety Relief Studio</h3>
      <p>The Studio contains all seven anxiety-relief practices with full instructions and guided timers. Filter by your anxiety type to see the most relevant practices, or browse all seven. Each practice takes between 30 seconds and 10 minutes — choose the one that fits this moment.</p>

      <AnxietyReliefStudio />

      {/* ── Section 4 ── */}
      <h3 id="practices">4. Seven Calming Mindfulness Practices — Step by Step</h3>
      <p>The seven practices in the Studio above are summarised here with their science and student applications. Use this section as a reference for choosing the right practice for your specific anxiety situation.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '30px' }}>
        {ANXIETY_PRACTICES.map(p => (
          <div key={p.id} style={{ background: 'white', borderRadius: '12px', padding: '16px 18px', border: `1.5px solid var(--border)`, borderLeft: `4px solid ${p.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: `${p.color}40` }}>{p.number}</span>
              <span style={{ fontSize: '18px' }}>{p.icon}</span>
              <div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: p.color }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{p.subtitle} · {p.duration < 60 ? `${p.duration}s` : `${Math.ceil(p.duration/60)} min`}</div>
              </div>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}><strong>When to use:</strong> {p.when}</p>
            <div style={{ background: `${p.color}08`, borderRadius: '8px', padding: '9px 12px', border: `1px solid ${p.color}20` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: p.color, marginBottom: '3px' }}>SCIENCE:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{p.science}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 5 ── */}
      <h3 id="daily">5. Building a Daily Anti-Anxiety Mindfulness Habit</h3>

      <p><strong>The three-layer structure.</strong> The most effective daily mindfulness practice for anxiety management combines three layers: a foundational daily practice (5-minute formal mindfulness each morning), a maintenance practice throughout the day (three-breath pause at defined triggers), and an acute-response practice (physiological sigh for anxiety spikes). Each layer serves a different function: the morning practice builds the neurological changes that reduce baseline anxiety over weeks; the maintenance practice prevents daytime anxiety accumulation; the acute-response practice manages spikes before they escalate.</p>

      <p><strong>The morning anchor — 5 minutes before phone.</strong> The most impactful structural change for daily anxiety is the five-minute formal mindfulness practice before any phone use in the morning. The first thirty minutes after waking are the window when the default mode network is most active and when the day's anxiety agenda is most likely to be set — either by the mindful observation of what is present or by the immediate activation of news, notifications, and social comparison that phone use produces. Five minutes of breath awareness before any external input sets a measurably calmer attentional tone for the following two to three hours.</p>

      <p><strong>The midday reset — three breaths at a consistent trigger.</strong> Anxiety accumulates across the day through the compounding of small stressors, comparison inputs, and unprocessed emotional content. The midday reset interrupts this accumulation at its midpoint. Choose a specific daily trigger — every time you sit down to study after a break, every time you close a tab and open a new one, every time you walk from one building to another — and commit to three slow breaths at that trigger every day. The specific trigger is more important than the practice itself; without a defined trigger, the practice is easy to forget.</p>

      <p><strong>The evening processing window — 5 minutes of honest writing.</strong> Research by Pennebaker on expressive writing shows that five minutes of honest writing about the day's emotional content — specifically its anxious dimensions — produces measurable reductions in anxiety and cortisol over two weeks of consistent practice. The writing discharges the emotional content that anxiety accumulates across the day from internal holding to external paper, preventing the anxiety from being carried directly into the sleep period. Write it, close the notebook, and consider the day's emotional content processed.</p>

      <p><strong>The progressive result — what to expect and when.</strong> The timeline for mindfulness-based anxiety relief has been mapped in the research: acute practices (physiological sigh, box breathing) produce measurable relief within minutes of use, every time. Two weeks of daily 5-minute morning practice produces measurable reductions in perceived stress and reported anxiety. Four weeks produces improvements in sleep quality and reduced exam-period anxiety intensity. Eight weeks produces the structural brain changes — amygdala reduction, prefrontal-amygdala connectivity improvement — documented by Hölzel et al. that represent durable long-term anxiety reduction independent of ongoing practice. The student who maintains five minutes daily for eight weeks is making a neurological investment that pays dividends for years.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Mindfulness for Anxiety FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I feel more anxious when I try to meditate — focusing on my breath makes me more aware of how anxious I am. Is this normal?</strong><br />
        A: Yes, and it has a specific explanation. When you begin mindfulness practice, you are developing the capacity to notice internal states that were previously running below the threshold of conscious awareness. The anxiety was already there — the mindfulness practice is not creating it, it is making it more visible. This initial increase in perceived anxiety is well-documented in the early weeks of mindfulness practice and typically resolves as the practice continues to develop — the increased awareness eventually includes the capacity to observe the anxiety without being amplified by it. If formal sitting meditation consistently increases anxiety significantly, movement-based practices (mindful walking, body scan) can provide a less activating entry point.</p>

        <p><strong>Q: I have clinical anxiety diagnosed by a doctor. Can mindfulness replace my treatment?</strong><br />
        A: No. Mindfulness is extensively used as a component of clinical anxiety treatment — Mindfulness-Based Cognitive Therapy (MBCT) and Mindfulness-Based Stress Reduction (MBSR) are both evidence-based clinical programmes — but as a complement to professional treatment, not a replacement for it. If you have clinical anxiety, the practices in this guide are appropriate and beneficial alongside your treatment; your treating clinician should be aware of your practice and can advise on how mindfulness fits into your overall treatment plan. Please do not use self-directed mindfulness as a reason to reduce or discontinue any treatment without professional guidance.</p>

        <p><strong>Q: Does mindfulness work for everyone with anxiety?</strong><br />
        A: Research shows significant, consistent effects across diverse populations — but the effects vary in magnitude. Students with mild to moderate anxiety tend to see the strongest and fastest results from self-directed practice. Students with severe anxiety, trauma histories, or anxiety disorders typically benefit from mindfulness most when it is practised alongside professional support that can guide the practice and address the specific clinical dimensions of the anxiety. A very small proportion of people (estimated at under 5% in controlled trials) experience temporary increases in anxiety or other adverse effects from intensive mindfulness practice — usually those with trauma histories where turning attention inward activates difficult material. For this group, gentle movement-based mindfulness (walking, mindful stretching) is typically more appropriate than formal sitting practice.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: TEAL8, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "The goal is not a life without anxiety. The goal is a life in which anxiety is something you have — not something that has you."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          The practices in this guide do not make the exams less real, the results less important, or the uncertainty less present. They build the capacity to remain in the present moment with all of that uncertainty — functional, grounded, and able to do the next thing. That capacity is trainable, measurable, and available to you starting with the next breath you take deliberately.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: TEAL8, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${TBORD8}` }}
          >
            Practise in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: TEAL8, border: `2px solid ${TEAL8}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Access our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mindfulness-for-students',       '→ What is Mindfulness and Why It Matters for Students'],
            ['/blog/breathing-exercises-stress',     '→ Simple Breathing Exercises to Reduce Stress Instantly'],
            ['/blog/control-thoughts-emotions',      '→ How to Control Your Thoughts and Emotions Naturally'],
            ['/blog/stay-present-stop-overthinking', '→ How to Stay Present and Avoid Overthinking Daily'],
            ['/blog/benefits-of-mindfulness',        '→ Benefits of Mindfulness for Students and Young Adults'],
            ['/blog/stay-calm-during-exams',         '→ How to Stay Calm and Confident During Exams'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: TEAL8, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
