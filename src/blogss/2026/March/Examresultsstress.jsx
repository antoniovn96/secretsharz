import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Handle Exam Results Stress and Anxiety",
  excerpt: "Exam result anxiety is one of the most universally felt and least discussed experiences in student life. The days before results, the moment of opening the envelope or the portal, and the hours after — each window has its own specific emotional texture and its own specific needs. Learn how to navigate each stage, protect your self-worth through any outcome, and use our Results Response Builder to create your personalised emotional coping plan.",
  category: "Mental Health",
  date: "25-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/exam-results-stress.jpg",
  tldr: "Exam result anxiety affects students regardless of how well they have prepared — the anxiety is about the anticipation of judgement, not a reliable predictor of outcome. This guide covers the five stages of result anxiety from pre-result dread to post-result processing, the self-worth principles that protect you through any outcome, practical emotional coping tools for each stage, and an interactive Results Response Builder that generates a personalised plan for your specific result situation and emotional state.",
  toc: [
    { id: "five-stages",  title: "1. The Five Stages of Exam Result Anxiety",                    level: 3 },
    { id: "self-worth",   title: "2. Self-Worth and Exam Results — The Essential Separation",    level: 3 },
    { id: "builder",      title: "3. Interactive: The Results Response Builder",                 level: 3 },
    { id: "emotional",    title: "4. Emotional Coping Strategies for Every Result",              level: 3 },
    { id: "support",      title: "5. How to Support Someone Through Exam Result Anxiety",        level: 3 },
    { id: "faq",          title: "6. Exam Results Anxiety FAQs",                                 level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-25T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "exam result anxiety, exam results stress, how to handle exam results, coping with bad exam results, exam result anxiety tips, self-worth exam results, exam results emotional support",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I cope with exam result anxiety?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Coping with exam result anxiety requires different strategies at different stages. Before results: reduce anticipatory anxiety through physiological regulation (breathing exercises, physical movement) and structured preparation for all possible outcomes rather than ruminating on the worst case. At the moment of results: ground yourself in the present before opening (three slow breaths, feet on floor), and give yourself 30 minutes before engaging with any comparison. After results: process the emotion specifically rather than suppressing it, separate your response to the result from your response to what the result says about you, and identify the single next actionable step.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I stop my self-worth from depending on exam results?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Separating self-worth from exam results requires deliberate, sustained practice across three dimensions: building self-worth anchors that are completely independent of academic performance (relationships, values, creative practices, physical skills), practising the information interpretation of results rather than the verdict interpretation (a result tells you what you demonstrated on a specific day, not who you are), and regular journalling of non-academic evidence of value and capability. The separation is not achieved through a single reframe — it develops through consistent practice and is measurably stronger in students who maintain regular non-academic sources of accomplishment and belonging.",
      },
    },
    {
      "@type": "Question",
      "name": "What should I do immediately after getting bad exam results?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Immediately after getting disappointing exam results: give yourself permission to feel the disappointment genuinely (suppressing it extends and intensifies it), avoid making major academic decisions in the first 24-48 hours (cortisol impairs good decision-making), avoid extended social media engagement or peer comparison during this window, reach out to one trusted person and tell them honestly how you are feeling, and eat and sleep adequately. Within 48 hours: sit with the specific paper or feedback and ask what it tells you specifically about preparation method — not about your capability. The information is in the result; the verdict is the story you choose to add to it.",
      },
    },
  ],
};

// ── Results Response Builder Data ─────────────────────────────────────────────
const SLATE2   = '#2A4A7F';
const SPALE4   = '#EEF2FB';
const SBORD4   = 'rgba(42,74,127,0.22)';

const RESULT_SITUATIONS = [
  {
    key:     'waiting',
    icon:    '⏳',
    label:   'Waiting — results have not come yet',
    tagline: 'The anticipation itself is unbearable',
    emotional_map: 'Pre-result anxiety is specifically about anticipatory dread — the gap between current uncertainty and the feared future outcome. The brain\'s threat detection system activates in response to uncertainty in the same way it activates in response to actual threat. This means the anxiety you feel before results is not a reliable predictor of what the results will be — it is your brain responding to uncertainty itself. Research by Alia Crum at Stanford on stress mindset shows that interpreting anticipatory anxiety as "readiness" rather than "threat prediction" produces measurably better performance and emotional outcomes.',
    immediate: [
      'The waiting period is the hardest to manage because there is no actionable preparation. The most effective strategy is structured distraction — not passive numbing, but active engagement with genuinely absorbing activities. The brain cannot catastrophise effectively when it is genuinely occupied.',
      'Give yourself two defined "worry windows" per day — 15 minutes each, morning and evening — where you are allowed to think about the results fully. Outside these windows, the agreement is to defer the worry. This contains the anxiety rather than suppressing it.',
      'Physical movement reduces anticipatory cortisol more effectively than any cognitive strategy. A 30-minute daily walk or any vigorous exercise directly addresses the physiological component of waiting anxiety.',
    ],
    emotional_needs: 'During waiting: genuine distraction, physical regulation, and at least one person to talk to honestly. Not someone who minimises the anxiety ("I\'m sure you did fine") but someone who can sit with the uncertainty alongside you.',
    affirmation: '"The result is already fixed. My anxiety does not change it. What I can change is how I spend this time before I know."',
    support_for_others: 'For someone who is waiting: do not tell them you are sure they did well. Sit with the uncertainty with them. "I know the waiting is really hard — I\'m here regardless of what comes" is more genuinely comforting than false reassurance that the result will be good.',
  },
  {
    key:     'good_result',
    icon:    '🌟',
    label:   'Good result — but I feel anxious or empty rather than happy',
    tagline: 'The result was fine but something feels wrong — relief, anxiety about next time, or strange emptiness',
    emotional_map: 'Achievement anxiety — anxiety that accompanies or follows success — is a less-discussed but extremely common experience among high-performing students. It occurs for several specific reasons: the expectation has been reset upward (now I need to maintain this standard), the result revealed that the worst-case fear was unfounded (which should feel good but exposes the belief system that had been holding the anxiety), or the result feels undeserved (impostor syndrome — the sense that you got lucky rather than that your preparation paid off). All of these are normal and specific, not signs of gratitude failure.',
    immediate: [
      'Allow the relief to be genuine — do not immediately move to what comes next. Sit with the achievement for 24 hours before beginning to plan or worry about subsequent assessments.',
      'If impostor syndrome is present ("I just got lucky"), examine the actual evidence: list the specific preparation actions you took that made this result possible. Luck does not explain consistent preparation.',
      'Share the result with someone who will genuinely celebrate it with you — not to perform celebration, but to allow the positive experience to be witnessed and confirmed by a trusted person.',
    ],
    emotional_needs: 'Permission to feel the success without immediately converting it into anxiety about maintaining it. A 24-hour genuine celebration window before future planning begins.',
    affirmation: '"This result reflects real preparation and real effort. I am allowed to feel good about it."',
    support_for_others: 'For someone who has done well but seems anxious: validate both the achievement and the anxiety. "You worked really hard for this and it shows — and it makes sense that the next worry is already there. Let\'s celebrate before we plan."',
  },
  {
    key:     'disappointing',
    icon:    '📉',
    label:   'Disappointing result — significantly below what I hoped or needed',
    tagline: 'The result is genuinely worse than I prepared for or needed for my next step',
    emotional_map: 'A genuinely disappointing result produces a specific emotional sequence: the initial shock (a momentary numbness as the brain processes unexpected information), followed by acute distress (the emotional impact as the implications become real), followed by the slow work of reorientation. This sequence is normal and appropriate — it reflects genuine investment in the outcome. The key is not to short-circuit the sequence through premature positive reframing, which suppresses the emotion and delays the genuine processing that allows forward movement.',
    immediate: [
      'Give yourself 24 hours before making any academic decision. Cortisol-impaired decision-making in the immediate aftermath of disappointment produces choices that often need to be reversed — do not change course, drop subjects, or give up on pathways in the first day.',
      'Tell one trusted person honestly. Not a summary performance — the actual emotional experience. The telling interrupts the isolation that makes disappointment heavier than it needs to be.',
      'After 48 hours: sit with the specific paper or feedback and identify three specific things it tells you about preparation method or topic gaps. Not about your capability — about approach. The information in the result is the most valuable thing about it.',
    ],
    emotional_needs: 'Permission to be genuinely disappointed without converting disappointment into permanent self-verdict. Support from one person who can hold both the difficulty and the forward possibility simultaneously.',
    affirmation: '"This result tells me something specific about what to do differently. It does not tell me anything permanent about what I am capable of."',
    support_for_others: 'For someone with a disappointing result: do not immediately try to fix it or find the bright side. Sit with them in the disappointment first: "That is genuinely hard, and I am sorry. How are you feeling right now?" Before problem-solving.',
  },
  {
    key:     'failed',
    icon:    '🔴',
    label:   'Failed or significantly below the required threshold',
    tagline: 'The result means a specific consequence — having to retake, missing a pathway, or significant academic implications',
    emotional_map: 'Failure with specific consequences — a resit required, a pathway closed, a scholarship condition not met — produces a combination of the emotional experience of failure and the practical stress of navigating a changed situation. These are two separate problems that often get collapsed into one overwhelming experience. The emotional processing and the practical problem-solving are both necessary, but they are most effectively addressed separately and sequentially: emotional processing first, practical planning second, not both simultaneously.',
    immediate: [
      'In the first 24 hours: do not plan, do not research, do not problem-solve. Feel the emotion, tell someone, rest. The planning will be better when done from a regulated emotional state — and the problem almost always has more options than it appears to have in the acute aftermath.',
      'After 24-48 hours: make a specific list of what the consequences actually are — not the feared catastrophe, the actual documented consequences. Most results have more recovery routes than the worst-case imagination allows.',
      'Seek information from a specific, authoritative source about your options: your academic institution, an advisor, or a teacher who can clarify what is actually possible from here. Decisions made on incomplete information are almost always worse than decisions made once the actual landscape is clear.',
    ],
    emotional_needs: 'Immediate: the presence of a trusted person, adequate food and sleep, and permission to not have a plan yet. After 48 hours: accurate information about available options, and one person who can help you think through them calmly.',
    affirmation: '"This result is a specific challenge with specific options. It is not the end of anything except one particular path as it was originally imagined."',
    support_for_others: 'For someone who has failed: do not immediately launch into options and solutions. They need the emotional acknowledgment first. "I am so sorry. This is genuinely hard and I am here with you." Then, when they are ready: "When you are ready to think about what comes next, let\'s do that together."',
  },
  {
    key:     'family_reaction',
    icon:    '🏠',
    label:   'Managing family reaction to my results',
    tagline: 'The result itself is not the primary stress — my family\'s response is',
    emotional_map: 'The specific anxiety of managing family response to results — whether anticipating disappointment from parents with high expectations or navigating the dynamics of a family that expresses care through pressure — is a distinct emotional experience from the result anxiety itself. It involves the specific vulnerability of having something important and personal (your academic performance) become a topic of family judgement, and the specific difficulty of needing support from the people whose reaction you are most anxious about.',
    immediate: [
      'Before telling your family: decide what you are going to say in advance — specifically, the version of the conversation that you are willing to have. Not the conversation that might happen, but the one you are choosing to initiate.',
      'Choose the right moment: not when anyone is tired, stressed, or already in the middle of something. A calm, specific moment where you have a reasonable chance of being heard rather than reacted to.',
      'Use the functional frame with parents who may respond with pressure: "Here is what I got, here is what I am doing about it, here is the specific support I need from you right now." Giving them a role in the recovery plan reduces the likelihood of the conversation being only about the result.',
    ],
    emotional_needs: 'One safe space outside the family where the result can be processed without the additional layer of managing family reaction — a friend, a counsellor, or Mind Space.',
    affirmation: '"I can manage what I can manage in this conversation. Their reaction is theirs to manage."',
    support_for_others: 'For a friend navigating family pressure after results: offer to be the safe space where they do not have to manage a reaction. "You don\'t have to be okay about it with me. Tell me how it actually is."',
  },
];

const EMOTIONAL_STATE = [
  { key: 'panic',     icon: '😰', label: 'Acute panic or physical anxiety response' },
  { key: 'numb',      icon: '😶', label: 'Numb or dissociated — cannot feel anything' },
  { key: 'sad',       icon: '💔', label: 'Genuinely sad or grieving' },
  { key: 'angry',     icon: '⚡', label: 'Angry — at myself, the system, or the situation' },
  { key: 'spiralling',icon: '🌀', label: 'Spiralling into worst-case thinking' },
  { key: 'okay',      icon: '🟡', label: 'Managing — anxious but functional' },
];

const EMOTIONAL_RESPONSES = {
  panic: {
    label: 'Acute Panic',
    immediate: 'Physiological first — the panic response is running. Cognitive strategies will not be available until the physiology is regulated.',
    steps: [
      { icon: '😮‍💨', text: 'Double inhale through the nose (fill completely, then one sharp top-up), then one long slow exhale. Three times. This is the fastest available cortisol reduction — works within 30 seconds.' },
      { icon: '👣', text: 'Feel both feet on the floor. Press them down. Name five things you can see right now. This sensory grounding interrupts the future-projected catastrophe and brings you to the present moment.' },
      { icon: '💧', text: 'Cold water on face and wrists — activates the mammalian diving reflex, directly lowering heart rate within seconds. Go to a bathroom if needed.' },
      { icon: '🚶', text: 'Physical movement — five minutes of brisk walking uses the adrenaline your body has produced and reduces the cortisol that is maintaining the panic state.' },
    ],
    when_better: 'After regulation: eat something, tell one trusted person, and rest before making any decisions or doing any planning.',
  },
  numb: {
    label: 'Numbness or Dissociation',
    immediate: 'Numbness after significant results is a normal protective response — the nervous system\'s buffer against overwhelming emotion. It does not mean you do not care. It means you are processing something significant.',
    steps: [
      { icon: '☕', text: 'Gentle sensory anchoring: make something warm to drink, sit outside briefly, feel sunlight or air on your skin. Small sensory inputs begin to re-engage the present-moment experience.' },
      { icon: '✍️', text: 'Write without filtering: "Right now I feel [whatever is there, or nothing]. The result was [result]. I think this means [first honest thought]." The writing is not for quality — it is a way to externalise what might be too much to hold internally.' },
      { icon: '💬', text: 'Tell one person you trust — not a performance of how you are responding, the actual experience: "I feel kind of numb right now. I don\'t know what I\'m feeling." Being with someone in the numbness is more supportive than pretending to feel something you do not.' },
      { icon: '😴', text: 'Rest. The nervous system needs to complete a significant process. Sleep or genuine lying-down rest without screens allows this process to continue at its own pace.' },
    ],
    when_better: 'The numbness typically gives way to more specific emotions within 12-24 hours. When it does, use the processing tools in Section 4.',
  },
  sad: {
    label: 'Genuine Sadness or Grief',
    immediate: 'Sadness after disappointing results is appropriate — it reflects genuine investment. The aim is not to eliminate the sadness quickly but to allow it to be felt specifically and then to move through it rather than staying stuck in it.',
    steps: [
      { icon: '💔', text: 'Allow the sadness to exist without rushing it. Grief is not a problem to be solved — it is a process to be honoured. Give yourself 24 hours where sadness is appropriate and does not require justification.' },
      { icon: '✍️', text: 'Write what you are specifically sad about: not just "the result" but the specific things — the hope that did not materialise, the expectation you had built, the feeling of all that preparation not producing the outcome you worked toward. Specificity allows the sadness to be processed rather than remaining as a general weight.' },
      { icon: '❤️', text: 'Be with someone who can be gentle with you — not someone who will immediately try to fix or reframe, but someone who can simply be present with the sadness without requiring you to perform a faster recovery.' },
      { icon: '🌿', text: 'Nature, movement, or any gentle sensory engagement — not to escape the sadness but to provide the physiological restoration that allows the processing to continue without becoming overwhelming.' },
    ],
    when_better: 'Sadness that processes naturally diminishes over 2-5 days without requiring suppression. Sadness that remains at full intensity for more than a week without movement, or that is accompanied by hopelessness about the future, is worth discussing with a counsellor.',
  },
  angry: {
    label: 'Anger',
    immediate: 'Anger after exam results — at yourself, at the system, at the paper, at the teacher — is a common and understandable response. It often contains genuine grievances (unfair marking, poor teaching, system inequity) alongside some displacement of the sadness and fear that anger is easier to feel than.',
    steps: [
      { icon: '🏃', text: 'Physical discharge before cognitive processing. Run, walk fast, do anything vigorous that uses the physical energy of the anger. The angry state is a physiologically activated state — it processes faster through physical use than through sitting and thinking.' },
      { icon: '✍️', text: 'Write the anger out — completely, uncensored, not for anyone else to read. Everything you want to say. The writing discharges the anger enough to access the more vulnerable emotions underneath it.' },
      { icon: '🔍', text: 'After discharge: ask what is underneath the anger. Anger is often a secondary emotion protecting against a more vulnerable primary one (fear, shame, grief). What does the anger not want to feel?' },
      { icon: '⚖️', text: 'If the anger contains a legitimate grievance (questionable marking, inadequate preparation resources, system unfairness), identify whether there is a specific, actionable step available — a remark request, a teacher conversation, an academic appeal. Actionable anger is more useful than ruminated anger.' },
    ],
    when_better: 'Anger that has been discharged physically and processed through writing typically softens within hours. Anger that is sustained and rigid, or that is turning into contempt (for yourself or for others), is worth discussing with someone.',
  },
  spiralling: {
    label: 'Catastrophic Spiral',
    immediate: 'The spiral is a cognitive loop: bad result → catastrophic interpretation → worse feeling → more catastrophic interpretation → worse feeling. Interrupting it requires entering the loop at the cognitive stage — examining the catastrophic interpretation specifically rather than trying to feel better first.',
    steps: [
      { icon: '📝', text: 'Write the specific catastrophic thought: "This result means [specific fear]." Then examine it as a hypothesis: what evidence actually supports this? What evidence contradicts it? What is the realistic chain of events, following this result, honestly?' },
      { icon: '⛓️', text: 'Follow the chain honestly: "If [result] means [consequence], then what would actually happen next? And then what?" Following the realistic chain to its conclusion — not the catastrophic fantasy, the realistic reality — almost always reveals more optionality than the spiral implies.' },
      { icon: '😮‍💨', text: 'Physiological regulation alongside the cognitive work: box breathing (4-4-4-4) while examining the thought. The breathing keeps the prefrontal cortex sufficiently online to do the evidence examination rather than just running more catastrophe.' },
      { icon: '💬', text: 'Tell someone what the spiral is saying. Articulating it to another person — who can offer a second perspective on the evidence — is among the most effective spiral interruptions available.' },
    ],
    when_better: 'The spiral breaks when the catastrophic certainty is replaced by honest uncertainty — "this might have serious consequences" is qualitatively different from "this has definitely ended everything" and allows forward movement.',
  },
  okay: {
    label: 'Managing — Anxious but Functional',
    immediate: 'Being functionally anxious is actually the optimal state for results processing — the emotional activation provides energy and the functional cognition allows engagement with what comes next. The risk is allowing the anxiety to escalate into one of the states above, or into suppression that delays processing.',
    steps: [
      { icon: '📋', text: 'Make a simple, specific plan for the next 48 hours: one emotional processing activity (writing, a conversation with one trusted person), one physical regulation activity (movement, adequate sleep), one specific information-gathering activity (checking what options exist from this result). Three items, achievable, specific.' },
      { icon: '✍️', text: 'Write a brief honest reflection on the result: what it tells you specifically, what you feel specifically, what the actual next step is. The writing externalises and clarifies the experience that functional anxiety is holding.' },
      { icon: '🌿', text: 'Protect the physical foundation: eat adequately, sleep adequately, do some physical movement. The functional state is maintained by the physical foundation — letting it slip converts manageable anxiety into something harder.' },
      { icon: '❤️', text: 'Tell one person how things are going — honestly, not the managing-fine version. The connection is both emotionally supportive and practically useful (they can help you think through the next steps).' },
    ],
    when_better: 'From a functional state, forward movement is already available. The priority is to process adequately (not suppress) and to make the first specific next-step decision from information rather than from acute anxiety.',
  },
};

// ── Builder Component ──────────────────────────────────────────────────────────
function ResultsResponseBuilder() {
  const [step,      setStep]      = useState(1);
  const [situation, setSituation] = useState(null);
  const [emotion,   setEmotion]   = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openImm,   setOpenImm]   = useState(null);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selSit  = RESULT_SITUATIONS.find(s => s.key === situation);
  const selEmo  = EMOTIONAL_STATE.find(e => e.key === emotion);
  const emoResp = emotion ? EMOTIONAL_RESPONSES[emotion] : null;

  const handleReset = () => { setStep(1); setSituation(null); setEmotion(null); setRevealed(false); setOpenImm(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? SLATE2 : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — situation */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What is your result situation right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the description that fits your current experience most closely.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {RESULT_SITUATIONS.map(rs => {
              const isSel = situation === rs.key;
              return (
                <button key={rs.key} onClick={() => setSituation(rs.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SLATE2 : 'var(--border)', background: isSel ? SPALE4 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${SBORD4}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{rs.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? SLATE2 : 'var(--ink)', marginBottom: '2px' }}>{rs.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{rs.tagline}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (situation) setStep(2); }} disabled={!situation} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: situation ? `linear-gradient(135deg, ${SLATE2}, #3E6AB5)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: situation ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: situation ? `0 6px 18px ${SBORD4}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 — emotional state */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — What are you feeling most strongly right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the most honest answer — your coping plan will be calibrated to your actual emotional state.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {EMOTIONAL_STATE.map(es => {
              const isSel = emotion === es.key;
              return (
                <button key={es.key} onClick={() => setEmotion(es.key)} style={{
                  padding: '12px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SLATE2 : 'var(--border)', background: isSel ? SPALE4 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${SBORD4}` : 'none',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{es.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? SLATE2 : 'var(--ink)' }}>{es.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (emotion) { setStep(3); setRevealed(false); } }} disabled={!emotion} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: emotion ? `linear-gradient(135deg, ${SLATE2}, #3E6AB5)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: emotion ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Response Plan →</button>
          </div>
        </>
      )}

      {/* STEP 3 — results */}
      {step === 3 && selSit && selEmo && emoResp && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Your Results Response Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${SLATE2}, #3E6AB5)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${SBORD4}`,
              }}>💙 Generate My Response Plan</button>
              <button onClick={() => setStep(2)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${SLATE2}, #3E6AB5)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>{selSit.icon} {selEmo.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  Your Response Plan
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>
                  {selSit.label} · {selEmo.label}
                </div>
              </div>

              {/* Emotional map */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '15px 17px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '6px' }}>🗺️ What Is Happening Emotionally</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selSit.emotional_map}</p>
              </div>

              {/* Emotional state response */}
              <div style={{ background: SPALE4, border: `2px solid ${SBORD4}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE2, marginBottom: '6px' }}>
                  {selEmo.icon} Responding to {emoResp.label}
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{emoResp.immediate}</p>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: SLATE2, marginBottom: '8px' }}>Steps — in order:</div>
                {emoResp.steps.map((step_item, i) => {
                  const isOpen = openImm === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '10px', marginBottom: '6px', overflow: 'hidden', border: `1.5px solid ${SBORD4}` }}>
                      <button onClick={() => setOpenImm(isOpen ? null : i)} style={{
                        width: '100%', padding: '11px 14px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '26px', height: '26px', borderRadius: '8px', background: `linear-gradient(135deg, ${SLATE2}, #3E6AB5)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>{step_item.icon}</div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: SLATE2, flex: 1 }}>Step {i + 1}</span>
                        <span style={{ color: SLATE2, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 14px 12px 14px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.2s ease' }}>
                          <p style={{ margin: '10px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{step_item.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div style={{ background: SPALE4, borderRadius: '9px', padding: '9px 12px', marginTop: '8px', border: `1px solid ${SBORD4}` }}>
                  <p style={{ margin: 0, fontSize: '12px', color: SLATE2, fontWeight: '600', lineHeight: 1.6 }}>⏭️ {emoResp.when_better}</p>
                </div>
              </div>

              {/* Immediate needs */}
              <div style={{ background: 'white', border: `1.5px solid ${SBORD4}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE2, marginBottom: '6px' }}>💙 Your Emotional Needs Right Now</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{selSit.emotional_needs}</p>
              </div>

              {/* What to say to others */}
              <div style={{ background: SPALE4, border: `1.5px solid ${SBORD4}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE2, marginBottom: '6px' }}>🤝 What Helpful Support Looks Like</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{selSit.support_for_others}</p>
              </div>

              {/* Affirmation */}
              <div style={{ background: 'white', border: `1.5px dashed ${SBORD4}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE2, marginBottom: '7px' }}>✨ Something to Hold</div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: SLATE2, fontStyle: 'italic', lineHeight: 1.55 }}>
                  {selSit.affirmation}
                </p>
              </div>

              {(situation === 'failed' || emotion === 'panic') && (
                <div style={{ background: '#EEF2FB', border: `2px solid ${SBORD4}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: SLATE2, marginBottom: '6px' }}>💙 A Direct Note</div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: SLATE2, lineHeight: 1.7 }}>
                    If the panic or distress does not ease within the next few hours, or if you are having thoughts of harming yourself, please reach out to someone today — a trusted adult, a counsellor, or our Safe Corner. You do not have to navigate this alone.
                  </p>
                  <button onClick={() => navigate?.('/safe')} style={{ background: SLATE2, border: 'none', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: font }}>Visit Our Safe Corner →</button>
                </div>
              )}

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${SBORD4}`, color: SLATE2, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a plan for a different situation</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ExamResultsStress({ navigate, relatedPosts }) {
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
      <p>The few minutes between opening a results portal and seeing the numbers is one of the most acutely anxious experiences in student life. And the hours and days that follow — processing what the result means, navigating family reactions, confronting what comes next — are a specific kind of emotional navigation that most students receive almost no preparation for.</p>

      <p><strong>Exam result anxiety</strong> is not simply about whether the result is good or bad. It is about the specific vulnerability of having something you worked hard for — and tied parts of your identity and future to — be quantified and returned to you as a number. How you navigate that experience matters enormously for both your immediate wellbeing and your long-term relationship with your own academic life.</p>

      <img
        src={meta.imgUrl}
        alt="Student managing exam result anxiety and stress — emotional coping strategies, self-worth protection, and support resources"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="five-stages">1. The Five Stages of Exam Result Anxiety</h3>

      <p><strong>Stage 1: Pre-result dread (days to hours before).</strong> Pre-result anxiety is anticipatory — the specific suffering of waiting for something significant that you cannot control or accelerate. Research by Matthew Grupe and Jack Nitschke at the University of Wisconsin shows that the anticipation of an uncertain threat activates stronger and more sustained anxiety than the threat itself, because uncertainty is intrinsically more activating for the brain's threat detection system than a known outcome. The student who spent the days before results feeling far worse than they felt the moment they saw the numbers is not overreacting — they are experiencing the neurological reality of uncertainty's specific anxiety cost.</p>

      <p><strong>Stage 2: The moment of results (opening the envelope or portal).</strong> The physical act of accessing results produces a specific acute stress response — a cortisol spike that occurs regardless of the outcome. Research on acute stress responses shows that this spike is universal: it happens to students who do well and to those who do not, because the brain is responding to "imminent uncertainty resolution" rather than to the actual valence of the information. The practical implication: the first few seconds after seeing results are physiologically unsuitable for cognitive processing or decision-making. Ground first, process second.</p>

      <p><strong>Stage 3: The initial emotional response (first hour).</strong> The emotional response in the first hour after results arrives before the cognitive processing has begun — which means it is often more extreme in both directions than the considered response will be. Students who do well often experience relief more than joy; students who receive disappointing results often experience a specific dissociated numbness before the emotional impact fully arrives. Both are normal, and neither is an accurate prediction of how the result will be experienced in 48 hours.</p>

      <p><strong>Stage 4: The social processing period (hours to days).</strong> After the initial private response, results move into the social sphere: the family conversation, the peer comparison, the social media dimension. This social processing period is often the most stressful aspect of results for many students — because it is not just the result itself being processed but the result as a public object subject to others' reactions, comparisons, and interpretations. The specific anxiety of this period is relational rather than individual.</p>

      <p><strong>Stage 5: Forward orientation (days to weeks).</strong> The forward orientation period — deciding what the result means for next steps — is where the cognitive processing of the result becomes most important. The specific risk in this period is making significant decisions from an anxiety state rather than from regulated, informed assessment: dropping a subject, giving up on a pathway, or making major academic course changes in the week after disappointing results, when cortisol is still elevated and the decision-making system is impaired. The principle for this period is: information first, options second, decisions third — and decisions only from a regulated emotional state.</p>

      {/* ── Section 2 ── */}
      <h3 id="self-worth">2. Self-Worth and Exam Results — The Essential Separation</h3>
      <p>The most psychologically damaging feature of how exam results are framed — in families, in schools, and in competitive educational cultures — is the conflation of academic performance with personal worth. When a result means not just "I performed at this level on this paper" but "I am this kind of person" or "I am worth this much," every assessment becomes a referendum on the student's fundamental value. This is not a dramatic overstatement — it is the specific psychological mechanism that research consistently identifies as the primary driver of the most severe exam result anxiety, including the result-associated mental health crises that occur in India's highest-pressure academic environments.</p>
      <p><strong>The distinction that protects.</strong> A result is information about what you could demonstrate under specific conditions on a specific day. It is not a verdict on your intelligence. It is not a verdict on your character. It is not a verdict on your worth as a person, a friend, a child, or a human being. And it is not a permanent determination of what you can achieve in the future. Making this distinction explicitly — writing it, saying it out loud, returning to it when the anxiety insists otherwise — is not denial of the result's significance. It is an accurate relationship with what a result can and cannot tell you.</p>
      <p><strong>Building self-worth anchors outside academic performance.</strong> The most effective long-term protection against result-based self-worth damage is not a better attitude toward results — it is the genuine cultivation of self-worth sources that are completely independent of academic performance. Specific relationships in which you are valued for your whole self, creative or physical practices where effort and improvement produce non-assessed satisfaction, personal values that you live through actions rather than credentials — these are the anchors that prevent a disappointing result from producing a complete self-worth collapse. They are not in competition with academic achievement. They are the foundation that makes academic engagement psychologically sustainable.</p>
      <p><strong>The self-compassion response versus the self-criticism response.</strong> Research by Kristin Neff at the University of Texas consistently shows that students who respond to disappointing results with self-compassion — acknowledging the difficulty genuinely, treating themselves with the care they would offer a friend, recognising the experience as part of a shared human reality — show better subsequent performance, greater motivation, and faster emotional recovery than students who respond with self-criticism. The self-critical response feels more serious and more accountable. The self-compassionate response is more effective and more kind. After any disappointing result, the first question is not "what did I do wrong?" — it is "what would I say to a friend in my exact situation?" Then apply that to yourself.</p>
      <p><strong>The result that surprised you in either direction.</strong> Some of the most psychologically disorienting result experiences are those that significantly differ from expectation in either direction — the student who did significantly better than they expected (which can feel uncomfortable, like luck or fraud, rather than earned) and the student who did significantly worse than their preparation seemed to warrant (which can feel like a specific betrayal of effort). Both experiences benefit from the same processing: a return to the specific, honest evidence of what happened, rather than a global narrative about what it means.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Results Response Builder</h3>
      <p>The Builder generates a personalised response plan for your specific result situation and emotional state. It provides the emotional map of what is happening, a calibrated set of steps for your current emotion (in the order most useful for that specific state), your emotional needs right now, what helpful support looks like for your situation, and an affirmation to return to when the anxiety is loudest.</p>

      <ResultsResponseBuilder />

      {/* ── Section 4 ── */}
      <h3 id="emotional">4. Emotional Coping Strategies for Every Result</h3>

      <p><strong>The 30-minute rule before comparison.</strong> After accessing any result, give yourself a minimum of 30 minutes before engaging with any comparison — social media, group chats, peer conversations. In that 30-minute window, form your own assessment of the result — what it means, how it feels, what it tells you — before the comparison data arrives to complicate and potentially override your own honest response. Your uncontaminated first response to your result is the most accurate one you will have. Protect it.</p>

      <p><strong>The physical regulation priority.</strong> In the immediate aftermath of results — particularly disappointing or failing results — the physiological stress response is active and the prefrontal cortex's decision-making capacity is genuinely impaired. The single most important immediate action is physiological regulation before anything cognitive: three physiological sighs (double inhale, long exhale), physical movement if possible, cold water on the face, adequate food and water. This is not avoidance of the result — it is the restoration of the cognitive capacity needed to process it accurately rather than catastrophically.</p>

      <p><strong>The 24-hour rule before decisions.</strong> No significant academic decision should be made in the first 24 hours after a disappointing result. Not which subjects to drop, not whether to pursue a resit, not whether to change course, not whether the pathway you were pursuing is still viable. All of these decisions are better made from a regulated emotional state with complete information about available options. The 24-hour moratorium is not about avoiding the reality of the situation — it is about ensuring that the decisions about how to respond to it are made by the prefrontal cortex rather than by the cortisol-impaired decision-making system that runs in the immediate aftermath of significant disappointment.</p>

      <p><strong>The specific processing conversation.</strong> The most valuable conversation after a result — any result — is one where you tell a trusted person not just the result but the specific emotional experience of receiving it. Not a performance of how you are managing or not managing, but the honest, specific experience: "When I saw the number, I felt [specific feeling]. What I found hardest was [specific thing]. What I need right now is [specific thing]." This conversation externalises the emotional experience in a way that significantly reduces its internal weight and provides the relational support that makes forward movement possible.</p>

      <p><strong>The information extraction practice (after 48 hours).</strong> After 48 hours and adequate physiological and emotional stabilisation, sit with the specific paper or feedback and conduct what might be called a learning autopsy: What specifically did not go as hoped? Which topics or question types accounted for most of the gap between expected and actual performance? What does this suggest about preparation method, topic coverage, or exam technique? This information extraction converts the result from a source of shame into a source of actionable data — and it is the specific step that transforms a disappointing result from a verdict into an input for the next preparation cycle.</p>

      <p><strong>The timeline perspective practice.</strong> A specific practice for results that feel catastrophic: write your life at one, five, and ten years in the future — honestly, with specific realistic imagination rather than either wishful thinking or catastrophising. In most cases, the specific result that feels catastrophic now appears in the five-year or ten-year imagination as one of many factors in a trajectory that includes multiple course corrections, surprising developments, and evidence that this particular moment was not as determinative as it felt. The timeline perspective is not toxic optimism — it is accurate historical context applied to a moment that is being experienced without it.</p>

      {/* ── Section 5 ── */}
      <h3 id="support">5. How to Support Someone Through Exam Result Anxiety</h3>
      <p>Being the person someone turns to during and after exam results is one of the most specific and least-discussed forms of relational support. Most people supporting a student through result anxiety either over-reassure ("I'm sure you did fine") or immediately problem-solve ("here's what you can do next") — both of which miss the primary emotional need of the person in distress.</p>
      <p><strong>Before results arrive: be present with the uncertainty.</strong> The most helpful thing you can offer someone waiting for results is not reassurance about the outcome — which you cannot genuinely provide — but presence with the uncertainty: "I know the waiting is really hard. I'm here regardless of what comes." This honest companionship through uncertainty is more genuinely comforting than false predictions of a good outcome, and it does not require the painful revision of having said "I'm sure you'll be fine" when the result is disappointing.</p>
      <p><strong>At the moment of results: follow their lead.</strong> Some students want company when they open their results; others need to do it alone first. Ask rather than assuming. And if you are present when results are accessed, respond to their actual emotional reaction rather than to the result itself: "How are you feeling right now?" rather than immediately interpreting the result or planning next steps.</p>
      <p><strong>After disappointing results: sit with the difficulty before problem-solving.</strong> The impulse to immediately offer solutions after a disappointing result — resit options, alternative pathways, "at least" reframes — is caring but almost always premature. The person needs the emotional acknowledgment before they can use practical information. "That is genuinely hard and I am sorry" is more valuable in the first few hours than "here's what you can do about it." Wait to be asked before offering the practical response.</p>
      <p><strong>After good results: celebrate genuinely, then watch for achievement anxiety.</strong> Good results are not always experienced as purely positive — the pressure to maintain the standard, impostor syndrome, or the strange emptiness after a long-anticipated event can all produce unexpected emotional experiences alongside the relief. Check in: "How are you actually feeling?" as well as offering the celebration. Make space for the complexity of the achievement experience, not just the visible success dimension.</p>
      <p><strong>Across the results period: do not make it about you.</strong> One of the specific challenges for people supporting students through results is managing their own anxiety about the results alongside the student's. Parents, friends, and teachers who express their own relief, disappointment, or anxiety through the student's result add a relational processing dimension to an already complex emotional experience. The support role requires holding your own response and prioritising the student's experience — which is most effectively done by asking what the student needs rather than telling them how you feel about the result.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Exam Results Anxiety FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What if my result means a specific, genuinely difficult consequence — like losing a scholarship or missing a university requirement?</strong><br />
        A: Results with specific, genuine consequences deserve both the emotional processing they require and the practical response they make necessary — but not simultaneously in the first 24 hours. Give yourself genuine space to feel the disappointment of the consequence before moving into problem-solving mode. Then, when emotionally regulated and practically informed, seek specific, authoritative information about available options: your institution's academic appeal processes, alternative entry pathways, the specific conditions and timelines involved. Most genuinely difficult academic consequences have more available responses than they appear to have in the acute aftermath. A conversation with an academic advisor or counsellor — not a peer, but a person with specific knowledge of available options — is the most valuable practical resource in this situation.</p>

        <p><strong>Q: I feel nothing after my results — not relieved, not disappointed, just numb. Is that normal?</strong><br />
        A: Numbness after significant results is entirely normal. It is the nervous system's protective buffer against an experience that may be too large to process immediately. The numbness is not absence of feeling — it is temporary suspension of feeling while the brain begins its processing. It typically gives way to more specific emotions within 12-24 hours. If numbness persists beyond several days and is accompanied by inability to engage with daily activities, that is worth discussing with a counsellor. But the immediate experience of numbness after results is one of the most commonly reported and least commonly acknowledged result responses.</p>

        <p><strong>Q: My result was good but I feel like I do not deserve it — like I just got lucky. What should I do with that?</strong><br />
        A: What you are describing is impostor syndrome — the specific cognitive distortion that attributes genuine achievement to luck or fraud rather than to the preparation and effort that actually produced it. Impostor syndrome is very common in high-achieving students and is particularly activated after results that exceed expectations or that occur in competitive environments. The evidence examination is the most direct available response: list the specific preparation actions you took, the specific knowledge you demonstrated in the exam, the specific questions you answered correctly. Luck does not explain specific, demonstrated knowledge across multiple topics. The evidence of your preparation is in the result — impostor syndrome simply makes it temporarily invisible.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SLATE2, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "A result is a moment in a much longer story. And the story — unlike the moment — is still entirely in progress."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Whatever your result brings — the relief of what you hoped for, the sting of what you feared, or the strange complexity of a mixed picture — you are more than this number. You are the preparation it represents, the effort it reflects, and the person who will respond to it. That response is the part of the story that is still yours to write. Take care of yourself today. The planning can happen tomorrow.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SLATE2, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORD4}` }}
          >
            Process Your Results in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: SLATE2, border: `2px solid ${SLATE2}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Access our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Related Guides for Student Wellbeing:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/fear-of-failure-studies',        '→ How to Overcome Fear of Failure in Studies'],
            ['/blog/stay-calm-during-exams',         '→ How to Stay Calm and Confident During Exams'],
            ['/blog/reduce-academic-pressure',       '→ How to Reduce Academic Pressure and Expectations'],
            ['/blog/parental-pressure-exams',        '→ How to Deal with Parental Pressure During Exams'],
            ['/blog/stay-positive-academics',        '→ How to Stay Positive During Academic Challenges'],
            ['/blog/mental-health-exams',            '→ Mental Health Tips for Students During Exams'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: SLATE2, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
