import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Mindfulness and Emotional Balance Explained Simply",
  excerpt: "Emotional balance is not the state of feeling good all the time — it is the capacity to feel the full range of emotions without being destabilised by any of them. Mindfulness builds this capacity through a specific and well-documented mechanism: it trains the awareness and the physiological regulation that converts automatic emotional reactions into experienced, understood, and chosen responses.",
  category: "Mental Health",
  date: "25-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/mindfulness-emotional-balance.jpg",
  tldr: "Emotional balance through mindfulness is not about controlling emotions or staying calm at all costs — it is about developing the relationship with emotions in which they inform rather than drive behaviour. This guide explains emotional regulation simply, covers five research-backed benefits of mindfulness for emotional balance, four calming routines for different situations, and includes an interactive Emotional Balance Builder that generates a personalised daily practice.",
  toc: [
    { id: "explained",  title: "1. Emotional Balance Explained Simply",                               level: 3 },
    { id: "how",        title: "2. How Mindfulness Creates Emotional Regulation",                     level: 3 },
    { id: "builder",    title: "3. Interactive: The Emotional Balance Routine Builder",               level: 3 },
    { id: "routines",   title: "4. Four Calming Routines for Emotional Balance",                      level: 3 },
    { id: "benefits",   title: "5. Five Benefits of Mindfulness for Emotional Balance",               level: 3 },
    { id: "faq",        title: "6. Emotional Balance and Mindfulness FAQs",                           level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-25T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "emotional balance mindfulness, mindfulness emotional regulation, how mindfulness helps emotions, emotional regulation techniques, calming routines emotional balance, benefits mindfulness emotions, emotional balance students",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is emotional balance and how does mindfulness help?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Emotional balance is the capacity to experience the full range of emotions — including difficult, intense, or uncomfortable ones — without being destabilised or driven automatically by any of them. It is not emotional flatness (feeling nothing) or emotional suppression (preventing feelings from arising). Mindfulness helps emotional balance through three specific mechanisms: it builds the awareness gap between emotion and reaction (noticing the emotion before acting on it), it reduces the physiological intensity of emotions through breath-based parasympathetic activation, and it reduces the secondary suffering of judging emotions as bad or wrong. Research by Hölzel at Harvard documents structural brain changes supporting emotional regulation after 8 weeks of daily mindfulness — reduced amygdala reactivity and improved prefrontal-amygdala connectivity.",
      },
    },
    {
      "@type": "Question",
      "name": "What are simple calming routines for emotional balance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Four calming routines produce the most consistent emotional balance benefits. Morning: phone-free first ten minutes, three physiological sighs, one-minute body check-in, written day intention. This sets a regulated nervous system baseline before external demands activate it. Midday: physiological sigh between activities, phone-free lunch, two-minute breath reset. Evening: emotional download (five minutes of uncensored writing), body scan (five minutes), gratitude entry, pre-sleep 4-7-8 breathing. Acute: three physiological sighs, feet-on-floor grounding, emotion naming (one specific word), and the self-compassion phrase. These four routines address the full daily arc of emotional regulation — morning baseline, midday maintenance, evening processing, and acute crisis management.",
      },
    },
    {
      "@type": "Question",
      "name": "How long does it take for mindfulness to improve emotional balance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Different emotional balance benefits develop at different timescales. Immediate (within the session): the physiological sigh and breath-based practices produce measurable cortisol reduction within 30 seconds and parasympathetic activation within 2-3 minutes. Short-term (1-2 weeks): daily mindfulness practice produces measurably faster emotional recovery after difficult events and reduced emotional reactivity to minor provocations. Medium-term (4-6 weeks): emotional granularity (the ability to name emotions precisely) improves, producing better regulation of the emotions that can now be accurately identified. Long-term (8+ weeks): structural brain changes — reduced amygdala grey matter density and improved prefrontal regulation networks — produce durable improvements in baseline emotional regulation capacity that persist without active practice.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const SLATE  = '#7080A0';
const SPALE  = '#EEF0F8';
const SBORD  = 'rgba(112,128,160,0.22)';

// ── Emotional State Options ────────────────────────────────────────────────────
const EMOTIONAL_STATES = [
  { key: 'overwhelmed', icon: '🌊', label: 'Overwhelmed or emotionally flooded', desc: 'Feelings are very intense and hard to manage right now', color: '#8B2635', bg: '#FBF0F1' },
  { key: 'anxious',     icon: '😰', label: 'Anxious or on edge', desc: 'Worry and tension present — hard to settle', color: '#2D5A8A', bg: '#EEF3FB' },
  { key: 'flat',        icon: '😶', label: 'Emotionally flat or numb', desc: 'Not feeling much — disconnected or low', color: '#5B3A8B', bg: '#F2EEF9' },
  { key: 'reactive',    icon: '⚡', label: 'Quick to react — irritable or frustrated', desc: 'Small things producing big emotional responses', color: '#C07800', bg: '#FFF8E1' },
  { key: 'okay',        icon: '🌿', label: 'Okay — want to build more stability', desc: 'Functioning but want a deeper emotional foundation', color: SLATE, bg: SPALE },
];

const REGULATION_CHALLENGE = [
  { key: 'name_it',    icon: '🏷️', label: 'I cannot name what I am feeling', desc: 'Emotions feel vague or undefined' },
  { key: 'intensity',  icon: '🔥', label: 'Emotions feel too intense', desc: 'Overwhelmed when strong feelings arrive' },
  { key: 'recovery',   icon: '⏱️', label: 'Takes too long to recover after upset', desc: 'Hard to return to calm after emotional events' },
  { key: 'suppressed', icon: '🫙', label: 'I push emotions down instead of processing', desc: 'Avoidance is the default response' },
  { key: 'swing',      icon: '🎢', label: 'Mood swings — from okay to difficult quickly', desc: 'Emotional shifts feel unpredictable' },
];

const AVAILABLE_TIME = [
  { key: '5min',  icon: '⚡', label: '5 minutes — very limited', steps: 3 },
  { key: '10min', icon: '🌿', label: '10 minutes — moderate', steps: 4 },
  { key: '20min', icon: '🌳', label: '20+ minutes — I have time', steps: 5 },
];

// ── Routine Plans ──────────────────────────────────────────────────────────────
const ROUTINE_PLANS = {
  overwhelmed: {
    name_it: {
      title: 'Name the Flood — Then Reduce It',
      opening: 'When overwhelmed, the first priority is physiological — reducing the cortisol and amygdala activation before any cognitive work can be done. Then comes the naming, which further reduces intensity. This sequence works with the brain\'s hierarchy, not against it.',
      steps: {
        '5min':  [
          { icon: '😮‍💨', name: 'Three physiological sighs', time: '45 sec', detail: 'Double inhale through the nose, long exhale through the mouth. Three times. The fastest available cortisol reduction.' },
          { icon: '👣', name: 'Feet on floor anchor', time: '30 sec', detail: 'Press both feet into the floor. Feel the exact weight and pressure. You are physically here, in this room, right now.' },
          { icon: '🏷️', name: 'Name one emotion', time: '30 sec', detail: 'Say or write one specific word for what is present. Not "I feel bad" — "I feel overwhelmed/ashamed/scared." The naming activates the prefrontal, reducing the amygdala.' },
        ],
        '10min': [
          { icon: '😮‍💨', name: 'Three physiological sighs', time: '45 sec', detail: 'Double inhale through nose, long exhale through mouth. Three times. Cortisol begins to reduce within 30 seconds.' },
          { icon: '👣', name: 'Feet on floor grounding', time: '60 sec', detail: 'Both feet on floor, hands in lap, feel the full weight of the body. Name two things you can see from where you are sitting.' },
          { icon: '📝', name: 'Emotion download', time: '3 min', detail: 'Write every emotional thought and feeling — uncensored, for three minutes. Not to solve, to externalise. The page holds what the brain was trying to hold.' },
          { icon: '🏷️', name: 'Name and accept', time: '30 sec', detail: '"I am having the experience of [specific emotion]. This is present right now. It will pass." Say it or write it. The acceptance removes the secondary struggle against the emotion.' },
        ],
        '20min': [
          { icon: '😮‍💨', name: 'Three physiological sighs', time: '45 sec', detail: 'Double inhale, long exhale. Three times. Physiological regulation before anything cognitive.' },
          { icon: '🧘', name: 'Body scan', time: '7 min', detail: 'Slowly attend from head to feet, noticing and softening tension on each exhale. The overwhelm has a physical component — releasing the physical component reduces the emotional intensity.' },
          { icon: '📝', name: 'Full emotion download', time: '5 min', detail: 'Write everything — every thought, feeling, fear, and need present right now. Uncensored and complete.' },
          { icon: '🏷️', name: 'Name, validate, accept', time: '90 sec', detail: '"I feel [emotion] because [reason]. This makes complete sense given what has happened. I can feel this and it will change." Written three times if needed.' },
          { icon: '💛', name: 'Self-compassion phrase', time: '2 min', detail: '"May I be gentle with myself right now. May I give myself what I genuinely need." Say or write slowly, three times. The compassion is not performance — it is permission.' },
        ],
      },
      mindfulness_note: 'For overwhelm, body-based mindfulness is more accessible and more effective than cognitive mindfulness — the physiological state must shift before cognitive clarity can arrive.',
    },
    intensity: {
      title: 'Regulate the Intensity — Not the Emotion',
      opening: 'Emotional intensity is partly physiological — cortisol, adrenaline, heart rate, muscle tension. Reducing the physiological component reduces the intensity, making the emotion available for processing rather than survival response. The emotion itself is valid; only the overwhelming intensity needs management.',
      steps: {
        '5min':  [
          { icon: '💧', name: 'Cold water reset', time: '30 sec', detail: 'Cold water on face and wrists — activates the mammalian diving reflex, direct heart rate reduction within seconds.' },
          { icon: '😮‍💨', name: 'Physiological sigh ×3', time: '45 sec', detail: 'Three double-inhale, long-exhale cycles to reduce cortisol.' },
          { icon: '👣', name: 'Feet on floor', time: '30 sec', detail: 'Press feet into floor. Attend to the physical sensation. You are here.' },
        ],
        '10min': [
          { icon: '💧', name: 'Cold water reset', time: '30 sec', detail: 'Cold water on face and wrists. Immediate heart rate reduction.' },
          { icon: '⬜', name: 'Box breathing', time: '4 min', detail: '4 in, 4 hold, 4 out, 4 hold. Five cycles. The equal ratio produces autonomic balance — reducing the sympathetic dominance of intense emotional states.' },
          { icon: '🌊', name: 'Urge surfing', time: '90 sec', detail: 'Observe the emotion as a wave — it will peak and subside without action. Watch it rise, watch it reduce. You are on the bank, not in the river.' },
          { icon: '📝', name: 'What do I need?', time: '2 min', detail: 'Write: "This emotion is telling me I need ___." Identify the need. Can it be met? How?' },
        ],
        '20min': [
          { icon: '💧', name: 'Cold water reset', time: '30 sec', detail: 'Immediate physiological intervention. Face and wrists under cold water.' },
          { icon: '🧘', name: 'Body scan + release', time: '8 min', detail: 'Systematic attention from head to feet, releasing tension with each exhale. Where is the emotion held physically? Attend directly to that area.' },
          { icon: '⬜', name: 'Box breathing', time: '5 min', detail: 'Four counts each side — five to eight complete cycles from the body scan\'s calm baseline.' },
          { icon: '📝', name: 'Emotion + need + action', time: '4 min', detail: 'Write: "I feel [emotion]. This tells me I need [need]. The action that would help is [action]." Convert intensity into information.' },
          { icon: '🌱', name: 'Return to present', time: '2 min', detail: 'Five-sense grounding — five things seen, four felt, three heard. Return to the specific present moment from the emotional activation.' },
        ],
      },
      mindfulness_note: 'Intensity regulation requires physiological tools first — cognitive tools become available only after the cortisol and heart rate have begun to reduce.',
    },
    recovery: {
      title: 'Shorten the Recovery — Return to Balance Faster',
      opening: 'When recovery from emotional events takes too long, the issue is often active maintenance of the emotional state through rumination and continued physiological activation. The practices here specifically address both — interrupting the rumination and discharging the physiological residue.',
      steps: {
        '5min': [
          { icon: '😮‍💨', name: 'Three sighs', time: '45 sec', detail: 'Discharge the cortisol residue with three physiological sighs.' },
          { icon: '🏷️', name: 'Name the loop', time: '30 sec', detail: '"I notice I am replaying [event]. This is the recovery phase — not a new emergency."' },
          { icon: '✋', name: 'Five-sense grounding', time: '2 min', detail: 'Five things seen, four felt, three heard. Return to now from the replayed past.' },
        ],
        '10min': [
          { icon: '😮‍💨', name: 'Three sighs', time: '45 sec', detail: 'Physiological discharge first.' },
          { icon: '🎓', name: 'Lesson extraction', time: '2 min', detail: 'Write: "The specific lesson from this event is ___." One sentence. Writing the lesson formally closes the processing loop.' },
          { icon: '✋', name: 'Five-sense grounding', time: '3 min', detail: 'Five senses, present moment. The event happened. You are here now.' },
          { icon: '💛', name: 'Self-compassion close', time: '2 min', detail: '"I processed something difficult. That takes energy. May I be kind to myself in this recovery."' },
        ],
        '20min': [
          { icon: '😮‍💨', name: 'Physiological sigh ×3', time: '45 sec', detail: 'Cortisol discharge first.' },
          { icon: '📝', name: 'Full processing write', time: '7 min', detail: 'Write the event, the emotions it produced, the needs it activated, and the lesson. Formal written processing closes the loop more effectively than mental replay.' },
          { icon: '🧘', name: 'Body scan', time: '5 min', detail: 'Release the physical residue of the emotional event — particularly jaw, shoulders, chest, and stomach.' },
          { icon: '✋', name: 'Grounding', time: '3 min', detail: 'Five-sense present-moment anchoring to close the processing and return to now.' },
          { icon: '💛', name: 'Self-compassion', time: '2 min', detail: 'Three self-compassion phrases — acknowledging the difficulty, the humanity, and the need for kindness.' },
        ],
      },
      mindfulness_note: 'Faster recovery is produced by genuinely closing the processing loop (writing the lesson) rather than repeatedly revisiting the event without closure.',
    },
    suppressed: {
      title: 'Create Space for What Has Been Held',
      opening: 'Emotional suppression protects against immediate distress at the cost of longer-term wellbeing — the suppressed content remains active as background cognitive load. These practices create safe, structured conditions for gradual contact with what has been avoided — without requiring complete exposure at once.',
      steps: {
        '5min': [
          { icon: '🧘', name: 'Body check-in', time: '60 sec', detail: 'Close eyes. Scan from head to feet. Just notice — where is there tension or discomfort? Do not try to change it, only see it.' },
          { icon: '😮‍💨', name: 'Three sighs', time: '45 sec', detail: 'Three physiological sighs. Physical signal of safety — the body can begin to open slightly.' },
          { icon: '📝', name: 'One honest sentence', time: '90 sec', detail: '"If I were being completely honest about how I feel, I would say ___." Write the first thing that arrives, however uncomfortable.' },
        ],
        '10min': [
          { icon: '🧘', name: 'Body scan', time: '5 min', detail: 'Slow, complete attention from head to feet. Where is the body holding something? Just attend — do not force release.' },
          { icon: '📝', name: 'Permission to feel', time: '3 min', detail: 'Write: "The thing I have been pushing down is ___. I give myself permission to acknowledge this." Write whatever comes — the permission itself is the practice.' },
          { icon: '💛', name: 'Safety phrase', time: '90 sec', detail: '"I can feel this and be okay. This emotion is safe to acknowledge. I do not have to act on it — I only need to see it."' },
        ],
        '20min': [
          { icon: '🧘', name: 'Full body scan', time: '8 min', detail: 'Complete, slow attention. At areas of obvious tension or discomfort: breathe toward them and simply acknowledge — "I notice this is here."' },
          { icon: '😮‍💨', name: 'Physiological sighs', time: '45 sec', detail: 'Three sighs to signal physiological safety.' },
          { icon: '📝', name: 'Suppressed content writing', time: '6 min', detail: '"The thing(s) I have been avoiding feeling: ___. The reason I have been avoiding them: ___. What they actually need from me is ___." Write without judgment.' },
          { icon: '💛', name: 'Self-compassion integration', time: '3 min', detail: '"Having these feelings makes complete sense. I do not have to carry them alone or push them away. May I be kind to myself as I acknowledge what is true."' },
          { icon: '🌱', name: 'Gentle grounding close', time: '90 sec', detail: 'Both feet on floor. One slow breath. Open eyes. You are safe, here, now.' },
        ],
      },
      mindfulness_note: 'Suppressed emotions do not need to be dramatically "released" — they need only to be gently acknowledged. Small, consistent contact produces more healing than attempted single large exposures.',
    },
    swing: {
      title: 'Build Stability Beneath the Swings',
      opening: 'Mood volatility is often driven by the absence of a stable nervous system baseline — the mood swings are filling the space where stable regulation would be. Building that baseline through consistent daily practices reduces the amplitude of swings by providing a regulatory foundation they occur within rather than from nothing.',
      steps: {
        '5min': [
          { icon: '😮‍💨', name: 'Three sighs (every morning)', time: '45 sec', detail: 'This single 45-second practice, performed every morning before any screen, begins building the baseline over two weeks.' },
          { icon: '🏷️', name: 'Morning emotion check-in', time: '60 sec', detail: 'One word for how you actually feel on waking. The naming is both awareness and micro-regulation — knowing the starting point allows appropriate calibration.' },
          { icon: '📝', name: 'Today\'s anchor', time: '60 sec', detail: 'Write one thing that is stable and genuinely valued — not a task, something that is reliably good in your life right now. The anchor reduces swing amplitude by providing a stable reference point.' },
        ],
        '10min': [
          { icon: '😮‍💨', name: 'Three sighs + breath awareness', time: '5 min', detail: 'Three sighs to begin, then five minutes of breath awareness. This daily practice specifically builds the prefrontal regulation capacity that volatile mood patterns lack.' },
          { icon: '🏷️', name: 'Emotion check-in + pattern notice', time: '2 min', detail: 'Name the current emotion. Then: "When does my mood most reliably shift? What typically precedes the downswing?" Pattern awareness is the beginning of pattern interruption.' },
          { icon: '📝', name: 'Stability anchor list', time: '90 sec', detail: 'Three things in your life that are reliably stable — people, places, activities, values. Reading this list during a downswing provides genuine cognitive anchor.' },
        ],
        '20min': [
          { icon: '😮‍💨', name: 'Physiological sighs', time: '45 sec', detail: 'Always first — physiological baseline before anything else.' },
          { icon: '🧘', name: 'Full breath awareness', time: '10 min', detail: 'The core daily practice for volatile mood patterns — ten minutes builds the prefrontal capacity that mood regulation requires, faster than shorter sessions.' },
          { icon: '🏷️', name: 'Morning emotion check-in', time: '2 min', detail: 'Specific emotion, one word. Then: "What do I need today to stay as balanced as possible?"' },
          { icon: '📝', name: 'Day structure intention', time: '4 min', detail: 'Write the day\'s structure with emotional regulation in mind — when to study, when to rest, when to move, when to connect. Planned structure reduces the uncontrolled environmental triggers that often initiate mood swings.' },
          { icon: '💛', name: 'Self-compassion for the pattern', time: '2 min', detail: '"I have a sensitive emotional system. This is not a flaw — it requires specific care. May I give myself that care today."' },
        ],
      },
      mindfulness_note: 'Mood volatility responds best to daily consistency rather than crisis-management techniques — building a stable baseline over weeks reduces the amplitude of swings more reliably than any acute intervention.',
    },
    okay: {
      name_it:    null, intensity: null, recovery: null, suppressed: null, swing: null,
    },
  },
  anxious: {
    name_it: { title: 'Name the Anxiety — Specifically', opening: 'Naming anxiety precisely ("I feel anxious about [specific concern]" rather than "I feel anxious") activates the prefrontal labelling network that directly reduces amygdala activation. The specificity converts vague threat activation into targeted, addressable concern.', steps: { '5min': [{ icon: '😮‍💨', name: 'Three physiological sighs', time: '45 sec', detail: 'Fastest cortisol reduction available — 30 seconds to measurable effect.' }, { icon: '🏷️', name: 'Specific name', time: '30 sec', detail: '"I feel anxious specifically about ___." The specific name reduces the generalised threat activation.' }, { icon: '👣', name: 'Feet on floor', time: '45 sec', detail: 'Press feet into floor. You are physically here, now. The anxiety is about something that has not happened yet.' }], '10min': [{ icon: '😮‍💨', name: 'Three sighs', time: '45 sec', detail: 'Physiological first.' }, { icon: '🏷️', name: 'Specific naming', time: '60 sec', detail: '"I am anxious about [specific thing] because [specific reason]."' }, { icon: '✋', name: '5-4-3-2-1 grounding', time: '3 min', detail: 'Five seen, four felt, three heard, two smelled, one tasted. Present-moment sensory anchoring.' }, { icon: '📝', name: 'Useful test', time: '2 min', detail: '"Is there a specific action available right now that addresses this concern?" If yes: do it. If no: park it.' }], '20min': [{ icon: '😮‍💨', name: 'Three sighs', time: '45 sec', detail: 'Always first.' }, { icon: '⬜', name: 'Box breathing', time: '5 min', detail: '4 in, 4 hold, 4 out, 4 hold — five cycles.' }, { icon: '🏷️', name: 'Detailed naming', time: '3 min', detail: 'Write: "I feel anxious about [concern]. The worst case I am imagining is [specific]. The actual probability of this is [honest assessment]. The action I can take is [specific next step]."' }, { icon: '✋', name: 'Grounding', time: '3 min', detail: '5-4-3-2-1 present-moment return.' }, { icon: '💛', name: 'Self-compassion', time: '2 min', detail: '"Anxiety is my system trying to protect me. I can be gentle with that intention even while managing the response."' }] }, mindfulness_note: 'Anxiety specifically responds to specificity — vague anxiety is more distressing than named, specific concern, because the brain cannot protect against an unspecified threat.' },
    intensity: { title: 'Reduce the Anxiety Intensity', opening: 'High anxiety intensity is primarily physiological — the nervous system in sympathetic overdrive. Physiological tools that activate the parasympathetic system are the most direct and effective interventions.', steps: { '5min': [{ icon: '😮‍💨', name: 'Three sighs', time: '45 sec', detail: 'Fastest parasympathetic activation.' }, { icon: '👣', name: 'Physical anchor', time: '60 sec', detail: 'Feet on floor, hands on thighs, full weight in the chair. Physical stability before cognitive stability.' }, { icon: '🏷️', name: 'Name and release', time: '30 sec', detail: '"I notice acute anxiety. It is manageable. I am here."' }], '10min': [{ icon: '💧', name: 'Cold water', time: '30 sec', detail: 'Face and wrists — direct heart rate reduction.' }, { icon: '⬜', name: 'Box breathing', time: '5 min', detail: 'Five cycles. The hold phases activate the diving reflex, deeply calming.' }, { icon: '👣', name: 'Grounding', time: '2 min', detail: 'Feet, floor, hands, breath.' }, { icon: '📝', name: 'One sentence', time: '60 sec', detail: '"Right now the specific threat is ___ and the next action available is ___."' }], '20min': [{ icon: '💧', name: 'Cold water', time: '30 sec', detail: 'Immediate heart rate reduction.' }, { icon: '🧘', name: 'Body scan', time: '8 min', detail: 'Where is the anxiety held? Attend directly. Release on exhale.' }, { icon: '⬜', name: 'Box breathing', time: '5 min', detail: 'Five cycles from the calmer post-scan baseline.' }, { icon: '📝', name: 'Anxiety audit', time: '3 min', detail: 'Every anxious thought on paper. For each: real or imagined threat? Actionable or not? The audit converts the anxiety from vague overwhelm to specific addressable concerns.' }, { icon: '💛', name: 'Close', time: '2 min', detail: '"I processed something genuinely difficult. I can return to this if needed. Right now, I am safe."' }] }, mindfulness_note: 'Anxiety at high intensity requires the body-based practices before the cognitive ones — the prefrontal regulator is partially offline at peak cortisol.' },
    recovery: null, suppressed: null, swing: null,
  },
  flat: {
    name_it: { title: 'Find the Emotion Underneath the Flatness', opening: 'Emotional flatness or numbness is almost never the absence of emotion — it is the dampening of emotional signalling, often as a protection response to sustained overwhelm. The practices here gently invite contact with what has been muted rather than trying to force emotion back.', steps: { '5min': [{ icon: '🧘', name: 'Body scan check-in', time: '60 sec', detail: 'Slowly attend to the body. Flatness often has a physical quality — heaviness, tiredness, hollowness. Just notice what is there.' }, { icon: '📝', name: 'Complete the sentence', time: '2 min', detail: '"If I were feeling something right now, it would probably be ___." The hypothetical permission sometimes allows the feeling to emerge.' }, { icon: '😮‍💨', name: 'Three sighs', time: '45 sec', detail: 'The sigh is a physical signal to the nervous system that some activation is available and safe.' }], '10min': [{ icon: '🧘', name: 'Body scan', time: '5 min', detail: 'Complete, slow. Where is the flatness held? Heaviness, hollowness, tiredness? Just attend.' }, { icon: '📝', name: 'Gentle inquiry', time: '3 min', detail: '"When did this flatness begin? What happened around that time? What might I have been feeling if I had been able to feel it?" Write without pressure.' }, { icon: '🌱', name: 'One genuine appreciation', time: '2 min', detail: 'Name one thing genuinely present and genuinely valued — however small. The appreciation is not forced positivity; it is gentle sensory contact with what is real.' }], '20min': [{ icon: '🧘', name: 'Full body scan', time: '8 min', detail: 'Complete, slow, gentle. Give the flatness full permission to be present without requiring it to change.' }, { icon: '📝', name: 'Gentle history write', time: '7 min', detail: 'Write without judgment about the period before the flatness — what was happening, what was difficult, what went unprocessed. The flatness is usually protection from something real.' }, { icon: '😮‍💨', name: 'Three sighs', time: '45 sec', detail: 'Physical safety signal.' }, { icon: '🌱', name: 'Three genuine appreciations', time: '2 min', detail: 'Write three specific, genuine things that are present and valued right now. Not to fix the flatness — to provide sensory present-moment contact.' }, { icon: '💛', name: 'Self-compassion', time: '90 sec', detail: '"This flatness makes sense given what has been happening. May I be gentle with myself as I recover."' }] }, mindfulness_note: 'Emotional flatness responds to gentle, body-based practices and patient inquiry — not to forced emotional activation or aggressive processing.' },
    intensity: null, recovery: null, suppressed: null, swing: null,
  },
  reactive: {
    name_it: { title: 'Name Before Reacting', opening: 'Reactive irritability typically produces automatic responses before any reflection is possible. The single most valuable change is inserting a naming pause: "I notice I am feeling [specific emotion]." The naming takes two seconds and consistently reduces the reactivity that follows.', steps: { '5min': [{ icon: '⏸️', name: 'STOP before responding', time: '30 sec', detail: 'Stop completely. No response until the practice is complete.' }, { icon: '😮‍💨', name: 'One physiological sigh', time: '15 sec', detail: 'One double-inhale, long-exhale to create the physiological gap.' }, { icon: '🏷️', name: 'Name the specific emotion', time: '30 sec', detail: '"I feel frustrated/irritated/annoyed/overwhelmed specifically because ___." The specific name reduces the automatic reactivity.' }], '10min': [{ icon: '⏸️', name: 'STOP immediately', time: '30 sec', detail: 'Physical and verbal stop.' }, { icon: '😮‍💨', name: 'Three sighs', time: '45 sec', detail: 'Three complete physiological sighs.' }, { icon: '🏷️', name: 'Specific naming + secondary emotion', time: '2 min', detail: '"I feel [reactive emotion]. Underneath, I might actually be feeling [primary emotion — hurt, afraid, overwhelmed]." The secondary emotion is usually more informative.' }, { icon: '📝', name: 'What do I need?', time: '3 min', detail: '"The reactive response I wanted to give was ___. What it reveals I actually need is ___. The response that serves my needs better is ___."' }], '20min': [{ icon: '⏸️', name: 'STOP + sighs', time: '60 sec', detail: 'Full stop, then three physiological sighs.' }, { icon: '📝', name: 'Reactivity audit', time: '7 min', detail: 'Write the trigger, the reactive impulse, the specific emotion underneath, the unmet need, and the intended response. This audit is most valuable when done after the reactive moment — it builds pattern recognition over time.' }, { icon: '⬜', name: 'Box breathing', time: '5 min', detail: 'Calm the residual activation from the reactive moment.' }, { icon: '💛', name: 'Self-compassion + recommit', time: '3 min', detail: '"Reactive responses come from genuine emotions. I can acknowledge the feeling and choose the response. May I have patience with my own process."' }, { icon: '🌱', name: 'Grounding close', time: '2 min', detail: 'Five-sense present-moment return from the emotional activation.' }] }, mindfulness_note: 'Reactivity responds to the two-second naming pause more than any other single practice — name first, always, before any response.' },
    intensity: null, recovery: null, suppressed: null, swing: null,
  },
  okay: {
    name_it: { title: 'Deepen Your Emotional Awareness Practice', opening: 'From a stable baseline, the practices that produce the most growth are those that build emotional granularity — the precision of emotional labelling — and deepen the non-judgmental awareness of the full range of emotional experience, including the subtle or complex ones that ordinary awareness misses.', steps: { '5min': [{ icon: '🧘', name: 'Morning body check-in', time: '60 sec', detail: 'One specific word for the emotional weather today — not the cognitive assessment of the day, the actual felt sense.' }, { icon: '📝', name: 'Granularity challenge', time: '2 min', detail: 'Name the dominant emotion, then find three more specific alternatives. "Content" → "gently satisfied with the progress I made yesterday" → the specificity builds the vocabulary that precision requires.' }, { icon: '😮‍💨', name: 'Three sighs', time: '45 sec', detail: 'Daily physiological baseline maintenance — even when calm, the sighs keep the parasympathetic tone healthy.' }], '10min': [{ icon: '🧘', name: 'Five-minute breath awareness', time: '5 min', detail: 'Daily practice at the stable baseline builds the neural architecture of regulation that makes the difficult days more manageable.' }, { icon: '📝', name: 'Weekly emotional autobiography', time: '3 min', detail: 'Once per week: write the emotional character of the past seven days. What was the dominant texture? What surprised you about your own reactions?' }, { icon: '💛', name: 'Appreciation + gratitude', time: '2 min', detail: 'Three specific genuine appreciations. From a stable baseline, gratitude deepens rather than creates — it builds on the foundation rather than compensating for its absence.' }], '20min': [{ icon: '🧘', name: 'Extended breath awareness', time: '10 min', detail: 'At the stable baseline, extended practice builds structural brain changes faster than shorter sessions — this is when the long-term investment is most productive.' }, { icon: '📝', name: 'Values-emotion connector', time: '5 min', detail: 'Write: "The emotions I felt most strongly this week and what they reveal about what I genuinely value." Strong emotions are always connected to core values — the connection is the most important self-knowledge available.' }, { icon: '💛', name: 'Loving-kindness practice', time: '5 min', detail: 'Begin with self, extend to loved ones, then to acquaintances, then to all beings. The loving-kindness practice from a stable baseline builds the social emotional capacity that manages difficult interpersonal situations better than any conflict strategy.' }] }, mindfulness_note: 'Stable baselines are the ideal time for building deeper practice — the neuroscience is clearest that structural brain changes accumulate fastest during consistent daily practice at lower stress levels.' },
    intensity: null, recovery: null, suppressed: null, swing: null,
  },
};

// ── Builder Component ──────────────────────────────────────────────────────────
function EmotionalBalanceBuilder() {
  const [step,     setStep]     = useState(1);
  const [state,    setState]    = useState(null);
  const [challenge,setChallenge]= useState(null);
  const [time,     setTime]     = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [openStep, setOpenStep] = useState(null);
  const [timerEx,  setTimerEx]  = useState(null);
  const [tLeft,    setTLeft]    = useState(0);
  const [running,  setRunning]  = useState(false);
  const [tDone,    setTDone]    = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selState     = EMOTIONAL_STATES.find(s => s.key === state);
  const selChallenge = REGULATION_CHALLENGE.find(c => c.key === challenge);
  const selTime      = AVAILABLE_TIME.find(t => t.key === time);
  const planObj      = state && challenge ? (ROUTINE_PLANS[state]?.[challenge] || ROUTINE_PLANS[state]?.name_it) : null;
  const steps        = planObj && time ? planObj.steps?.[time] : null;

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTLeft(p => { if (p <= 1) { clearInterval(intRef.current); setRunning(false); setTDone(true); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running]);

  const handleReset = () => { clearInterval(intRef.current); setStep(1); setState(null); setChallenge(null); setTime(null); setRevealed(false); setOpenStep(null); setTimerEx(null); setTLeft(0); setRunning(false); setTDone(false); };

  const Btn = ({ opt, selected, onSelect }) => {
    const isSel = selected === opt.key;
    return (
      <button onClick={() => onSelect(opt.key)} style={{ padding: '12px 14px', borderRadius: '11px', border: '2px solid', borderColor: isSel ? SLATE : 'var(--border)', background: isSel ? SPALE : 'white', cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s', display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%', marginBottom: '7px', boxShadow: isSel ? `0 0 0 2px ${SBORD}` : 'none' }}>
        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{opt.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? SLATE : 'var(--ink)', marginBottom: opt.desc ? '1px' : 0 }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
        </div>
        {isSel && <span style={{ marginLeft: 'auto', color: SLATE, fontWeight: '700', flexShrink: 0 }}>✓</span>}
      </button>
    );
  };

  const CIRC = 2 * Math.PI * 38;

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1,2,3,4].map(s => <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? SLATE : 'var(--border)', transition: 'background 0.3s' }} />)}
      </div>

      {step === 1 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 1 — How are you feeling emotionally right now?</p>
        {EMOTIONAL_STATES.map(s => <Btn key={s.key} opt={s} selected={state} onSelect={setState} />)}
        <button onClick={() => { if (state) setStep(2); }} disabled={!state} style={{ width: '100%', marginTop: '4px', padding: '14px', borderRadius: '10px', border: 'none', background: state ? `linear-gradient(135deg, ${SLATE}, #9098B8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: state ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: state ? `0 6px 18px ${SBORD}` : 'none' }}>Next →</button>
      </>)}

      {step === 2 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 2 — What is your main regulation challenge?</p>
        {REGULATION_CHALLENGE.map(c => <Btn key={c.key} opt={c} selected={challenge} onSelect={setChallenge} />)}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          <button onClick={() => { if (challenge) setStep(3); }} disabled={!challenge} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: challenge ? `linear-gradient(135deg, ${SLATE}, #9098B8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: challenge ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button>
        </div>
      </>)}

      {step === 3 && (<>
        <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 3 — How much time do you have right now?</p>
        {AVAILABLE_TIME.map(t => <Btn key={t.key} opt={t} selected={time} onSelect={setTime} />)}
        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
          <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          <button onClick={() => { if (time) { setStep(4); setRevealed(false); } }} disabled={!time} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: time ? `linear-gradient(135deg, ${SLATE}, #9098B8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: time ? 'pointer' : 'not-allowed', fontFamily: font }}>Build My Routine →</button>
        </div>
      </>)}

      {step === 4 && planObj && steps && (<>
        <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Emotional Balance Routine</p>
        {!revealed ? (
          <>
            <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${SLATE}, #9098B8)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${SBORD}` }}>💛 Reveal My Routine</button>
            <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
          </>
        ) : (
          <div style={{ animation: 'floatUp 0.4s ease' }}>
            <div style={{ background: `linear-gradient(135deg, ${selState?.color}, ${selState?.color}BB)`, borderRadius: '14px', padding: '20px', marginBottom: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '26px', marginBottom: '5px' }}>{selState?.icon} {selChallenge?.icon}</div>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: '19px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>{planObj.title}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)' }}>{selTime?.label} routine · {selState?.label}</div>
            </div>

            <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{planObj.opening}</p>
            </div>

            {/* Timer inline */}
            {timerEx !== null && (
              <div style={{ background: SPALE, border: `2px solid ${SBORD}`, borderRadius: '12px', padding: '14px', marginBottom: '10px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '700', color: SLATE, marginBottom: '8px' }}>Step {timerEx + 1}: {steps[timerEx].name}</div>
                <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 10px auto' }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="40" cy="40" r="38" fill="none" stroke={`${SLATE}20`} strokeWidth="5" />
                    <circle cx="40" cy="40" r="38" fill="none" stroke={SLATE} strokeWidth="5"
                      strokeDasharray={CIRC} strokeDashoffset={tDone ? 0 : CIRC * (tLeft / (parseInt(steps[timerEx].time) * 60))}
                      strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: 'Fraunces, serif', fontSize: tDone ? '14px' : '18px', fontWeight: '700', color: SLATE }}>
                    {tDone ? '✓' : tLeft > 60 ? `${Math.floor(tLeft/60)}:${(tLeft%60).toString().padStart(2,'0')}` : tLeft}
                  </div>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{steps[timerEx].detail}</p>
                <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {!tDone && (running
                    ? <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '8px 16px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font }}>⏸ Pause</button>
                    : <button onClick={() => setRunning(true)} style={{ padding: '8px 16px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${SLATE}, #9098B8)`, color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font }}>▶ Resume</button>
                  )}
                  <button onClick={() => { clearInterval(intRef.current); setTimerEx(null); setTLeft(0); setRunning(false); setTDone(false); }} style={{ padding: '8px 14px', borderRadius: '50px', border: `1.5px solid ${SBORD}`, background: 'transparent', color: SLATE, fontWeight: '600', fontSize: '12px', cursor: 'pointer', fontFamily: font }}>↺ Back to steps</button>
                </div>
              </div>
            )}

            {!timerEx && timerEx !== 0 && (
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: SLATE, marginBottom: '7px', letterSpacing: '1.2px' }}>🌿 Your {selTime?.label.split(' ')[0].toUpperCase()} ROUTINE — {steps.length} STEPS:</div>
                {steps.map((s, i) => {
                  const isOpen = openStep === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '6px', border: `1.5px solid ${SBORD}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenStep(isOpen ? null : i)} style={{ width: '100%', padding: '11px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, textAlign: 'left' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: SPALE, border: `1.5px solid ${SBORD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{s.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: SLATE }}>{s.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{s.time}</div>
                        </div>
                        <span style={{ color: SLATE, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 14px 12px 14px', borderTop: '1px solid var(--border)' }}>
                          <p style={{ margin: '8px 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{s.detail}</p>
                          <button onClick={() => {
                            const mins = parseInt(s.time.split(' ')[0]);
                            setTimerEx(i); setTLeft(mins * 60); setTDone(false); setRunning(true);
                          }} style={{ padding: '7px 14px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${SLATE}, #9098B8)`, color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font }}>▶ Start Timer</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {planObj.mindfulness_note && (
              <div style={{ background: SPALE, border: `1.5px solid ${SBORD}`, borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: SLATE, marginBottom: '3px' }}>🧘 Mindfulness Note</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{planObj.mindfulness_note}</p>
              </div>
            )}

            <div style={{ background: SPALE, border: `1.5px dashed ${SBORD}`, borderRadius: '12px', padding: '12px 17px', marginBottom: '14px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '600', color: SLATE, fontStyle: 'italic', lineHeight: 1.55 }}>
                "Emotional balance is not the absence of difficult emotions — it is the capacity to hold them without being swept away. This is built one practice at a time."
              </p>
            </div>

            <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${SBORD}`, color: SLATE, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different routine</button>
          </div>
        )}
      </>)}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MindfulnessEmotionalBalance({ navigate, relatedPosts }) {
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
      <p>Most students spend enormous energy either suppressing difficult emotions (staying "fine" when they are not) or being consumed by them (the anxiety that takes over the day, the disappointment that becomes a spiral, the frustration that becomes an outburst). <strong>Emotional balance through mindfulness</strong> is the third option — feeling the emotions genuinely and fully, while remaining the one who experiences them rather than being driven by them.</p>

      <p>This guide explains emotional regulation in plain language, without jargon, and connects it to specific practices you can actually use today. It also includes an interactive builder that generates a personalised calming routine based on exactly how you are feeling right now and how much time you have.</p>

      <img
        src={meta.imgUrl}
        alt="Student building emotional balance through mindfulness — emotional regulation techniques, calming routines, and the benefits of mindful emotional practice"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="explained">1. Emotional Balance Explained Simply</h3>

      <p><strong>What emotional balance is not.</strong> Three common misconceptions about emotional balance are worth addressing directly. It is not emotional flatness — the absence of strong emotions or the cultivation of permanent serenity. People with excellent emotional balance feel joy, grief, anger, fear, and the full emotional spectrum; they simply have a different relationship with those experiences. It is not emotional suppression — pushing emotions down or preventing them from arising. Research by James Gross at Stanford consistently shows that suppression is the least effective long-term regulation strategy: it consumes cognitive resources, reduces emotional authenticity, and causes suppressed content to return with greater intensity. And it is not always appearing composed — emotional balance includes genuine emotional expression in appropriate contexts; the composure that emotional balance produces is the composure of being able to choose an expression, not the performance of forcing one.</p>

      <p><strong>What emotional balance actually is — in plain terms.</strong> Emotional balance is the quality of being the experiencer of emotions rather than being the emotions. A simple way to understand this: in an unbalanced emotional state, "I am anxious" — the anxiety is the identity. In an emotionally balanced state, "I notice I am experiencing anxiety" — there is an "I" that is distinct from and observing the anxiety. The anxiety is still real and fully felt. The difference is the relationship to it: in the first, the anxiety runs the show; in the second, it informs but does not dictate.</p>

      <p><strong>Emotional regulation — what it means and how it works.</strong> Emotional regulation is the set of processes by which people influence which emotions they have, when they have them, and how they experience and express them (Gross, 1998). It is not a single skill but a collection of capacities: the ability to notice an emotion is present, the ability to identify it accurately, the ability to tolerate it without immediately acting on or suppressing it, the ability to understand what it is communicating, and the ability to choose a response that serves the situation better than the automatic reaction would. Mindfulness builds each of these capacities through consistent practice.</p>

      <p><strong>The emotional balance spectrum — where most students sit.</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Reactive:</strong> Emotions produce automatic behavioural responses before any reflection occurs. Common in high-stress periods without regulation practice.</li>
        <li><strong>Suppressive:</strong> Emotions are noticed but pushed down rather than processed. Efficient short-term but expensive long-term — suppressed content accumulates.</li>
        <li><strong>Overwhelmed:</strong> Emotions feel too large to contain — flooding cognitive and behavioural systems. Often cyclical: overwhelm leads to more suppression, which leads to more overwhelm.</li>
        <li><strong>Developing regulation:</strong> Emotions are increasingly noticed and named before reacting — the awareness gap is growing. Practices are building the capacity, results visible across weeks.</li>
        <li><strong>Balanced:</strong> Emotions are felt, noticed, named, understood, and responded to deliberately. The full range is available without any one emotion becoming destabilising.</li>
      </ul>

      {/* ── Section 2 ── */}
      <h3 id="how">2. How Mindfulness Creates Emotional Regulation</h3>

      <p><strong>The awareness gap — mindfulness' first contribution.</strong> The most direct contribution of mindfulness to emotional regulation is the awareness gap: the brief space between an emotional trigger and the automatic response in which a chosen response becomes possible. In unmindful experience, this gap is so compressed as to be functionally nonexistent — the trigger produces the reaction immediately and automatically. Mindfulness practice specifically expands this gap through the regular exercise of noticing (attention moved away from a thought and noticed returning to the breath) — what the meditation teacher Pema Chödrön describes as the space "between the familiar and the unknown." Research by Thomas et al. documents that mindfulness practitioners show significantly longer response latencies to emotional provocations — more time between trigger and reaction — producing correspondingly better response quality.</p>

      <p><strong>Affect labelling — the naming mechanism.</strong> Research by Matthew Lieberman at UCLA on "putting feelings into words" documents the specific neurological mechanism by which naming emotions reduces their intensity: verbally labelling an emotional state activates the right ventrolateral prefrontal cortex, which produces top-down inhibition of amygdala activation measurable within seconds. Mindfulness specifically cultivates this labelling practice — the practice of noting ("this is anxiety," "this is anger") during meditation directly trains the prefrontal labelling that transfers to daily life emotional management. The broader the emotional vocabulary and the more specifically emotions can be named, the more powerful the regulatory effect: research by Barrett on emotional granularity shows that precise labelling produces stronger prefrontal activation than vague labelling.</p>

      <p><strong>Physiological regulation — breath as the bridge.</strong> Emotions have physiological components — specific patterns of cortisol, heart rate, muscle tension, and breathing that constitute part of the emotional experience. Mindfulness-based breathing practices (physiological sigh, box breathing, extended exhale) directly regulate these physiological components through the vagus nerve, producing measurable reductions in cortisol and sympathetic activation. This physiological regulation has two effects: it reduces the intensity of the current emotional experience by changing the body state that the emotion partly consists of, and it restores the prefrontal function that high cortisol states reduce — making the cognitive regulation tools (labelling, reappraisal, choice of response) more available than they were during peak physiological activation.</p>

      <p><strong>Non-judgmental stance — removing the secondary suffering layer.</strong> Much emotional distress is doubled by the judgment of the emotion itself: the anxiety about being anxious, the shame about feeling sad, the frustration about feeling angry. Research on metacognitive beliefs (Adrian Wells, University of Manchester) identifies beliefs about the significance and unacceptability of emotions — "I should not feel this way," "strong emotions mean I am weak," "this feeling will last forever" — as primary drivers of clinical-level emotional distress. The non-judgmental stance of mindfulness practice specifically addresses these beliefs by training the observer position — watching emotions arise and pass without evaluating their presence as evidence of character failure. This single shift removes the secondary suffering layer that judgment adds to ordinary emotional experience.</p>

      <p><strong>DMN reduction — less emotional noise between events.</strong> Research by Brewer at Brown documents that mindfulness practice significantly reduces posterior cingulate cortex activity — the hub of the default mode network that generates self-referential emotional content between actual emotional events. The reduction in DMN activity means less background emotional noise: fewer spontaneous worry thoughts, fewer past-replay emotional activations, less anticipatory emotional arousal about future events. This background noise reduction is the mechanism by which mindfulness practitioners describe a general sense of being less emotionally activated for the same life events — not because the events matter less but because the between-event amplification has reduced.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="builder">3. Interactive: The Emotional Balance Routine Builder</h3>
      <p>Tell the Builder how you are feeling emotionally right now, what your main regulation challenge is, and how much time you have. It generates a personalised calming routine — step by step, with a built-in timer for each step — matched precisely to your current state and available time.</p>

      <EmotionalBalanceBuilder />

      {/* ── Section 4 ── */}
      <h3 id="routines">4. Four Calming Routines for Emotional Balance</h3>

      <p><strong>Routine 1: The Morning Emotional Balance Foundation (10 minutes).</strong> The morning is the period of highest cortisol production — the natural awakening response — and the highest vulnerability to emotional dysregulation from the day ahead. The morning routine specifically sets a regulated baseline before external demands activate it. Step 1: phone-free first ten minutes (before external emotional inputs, the mind establishes its own baseline). Step 2: three physiological sighs (cortisol modulation before any emotional content arrives). Step 3: one-minute body check-in (one specific word for the emotional weather today). Step 4: three minutes of breath awareness (prefrontal activation through attentional training). Step 5: written day intention — not a task list, one sentence about what matters today. Research by Mrazek documents that this morning sequence produces significantly better attention and emotional regulation across the following morning compared to unstructured phone-based mornings.</p>

      <p><strong>Routine 2: The Midday Emotional Reset (5 minutes).</strong> Cortisol from successive morning demands accumulates unless deliberately discharged. The midday reset prevents this accumulation. Step 1: physiological sigh between each activity transition (30 seconds of cortisol discharge between every significant activity). Step 2: phone-free lunch — one complete meal per day as a genuine present-moment sensory experience rather than a scrolling opportunity. The phone-free meal provides genuine parasympathetic activation through the sensory presence it enables, producing afternoon attentional and emotional quality significantly better than a phone-accompanied meal. Step 3: two-minute breath awareness when emotional activation is noticeable during the midday period — three minutes of box breathing restores prefrontal function specifically when it has been most depleted.</p>

      <p><strong>Routine 3: The Evening Emotional Processing Routine (15 minutes).</strong> The evening is the processing period — converting the day's unresolved emotional content from active cognitive holding to externalised and integrated experience. Step 1: emotional download — five minutes of uncensored writing about whatever is emotionally present (not to solve, to acknowledge and externalise). Step 2: body scan — five minutes of systematic physical attention, releasing the physical tension component of the day's emotional accumulation. Step 3: three specific genuine appreciations from today (gratitude that closes the day with genuine positive attention). Step 4: pre-sleep 4-7-8 breathing — four in, seven hold, eight out, three cycles. This sequence consistently improves sleep quality by reducing the cognitive and physiological arousal that pre-sleep emotional content produces.</p>

      <p><strong>Routine 4: The Acute Emotional Regulation Sequence (2-5 minutes, any time).</strong> For the acute moments when emotional activation arrives suddenly — the result that devastates, the message that provokes, the conversation that floods. Step 1: three physiological sighs (cortisol reduction before any cognitive response — the single most important first step, 45 seconds). Step 2: feet on floor grounding (physical present-moment anchoring, 30 seconds). Step 3: one specific emotion name — "I feel [word]" not "I feel terrible" (prefrontal labelling mechanism, 15 seconds). Step 4: self-compassion phrase — "This is genuinely difficult. May I be kind to myself right now" (parasympathetic activation through self-directed safety signal). Step 5: the useful test — "Is there a specific action available right now?" If yes, take it. If no, park it. From this sequence — under five minutes total — the probability of a response from deliberate choice rather than automatic reaction increases substantially.</p>

      {/* ── Section 5 ── */}
      <h3 id="benefits">5. Five Benefits of Mindfulness for Emotional Balance</h3>

      {[
        {
          num: '01', icon: '⚡', color: '#2D5A8A', bg: '#EEF3FB',
          benefit: 'Faster Emotional Recovery',
          research: 'Research by Davidson and colleagues at the University of Wisconsin on emotional recovery speed documents that mindfulness practitioners show significantly faster return to physiological and subjective baseline after emotionally provocative stimuli — not weaker emotional responses but shorter duration. The practical implication for students: the same disappointing result that previously produced two days of low mood and impaired study produces 6-12 hours of processing and recovery in practitioners with 6-8 weeks of daily practice. The emotion is still real; the recovery is faster.',
          student: '"I failed a unit test in March. I cried, I wrote about it, I took the evening. By the next morning I was revising the weak areas. That would have taken me a week before I started mindfulness practice." — Meera',
        },
        {
          num: '02', icon: '🎯', color: SLATE, bg: SPALE,
          benefit: 'Reduced Emotional Reactivity',
          research: 'Research by Hölzel and colleagues at MGH documents reduced amygdala grey matter density after 8 weeks of daily mindfulness — a structural change that reduces the brain\'s threat response threshold. This means the same events that previously triggered strong emotional responses trigger proportionally smaller ones after consistent practice. Small provocations that would have produced significant frustration, minor setbacks that would have produced despair — the amplitude of the response to the same trigger reduces because the neural trigger threshold has literally changed.',
          student: '"Before, a single message from a friend that seemed slightly off would ruin my whole day. Now I notice the thought — "that felt off" — and then I can actually assess whether it was or just return to what I was doing. The pause where there was none before." — Vikram',
        },
        {
          num: '03', icon: '🧠', color: '#2D6B45', bg: '#E8F4EE',
          benefit: 'Improved Emotional Granularity',
          research: 'Research by Lisa Feldman Barrett documents that emotional granularity — the precision of emotional labelling — directly predicts regulation capacity. People who can distinguish between thirty specific emotional states regulate those states significantly better than those who collapse all negative experience into "feeling bad." Mindfulness practice specifically develops granularity through the daily labelling exercise (noting practice) and through the body scan, which trains the interoceptive awareness that distinguishes the subtle physical signatures of different emotional states.',
          student: '"I used to say stressed for everything. Now I notice when I\'m actually scared versus when I\'m actually embarrassed versus when I\'m actually sad. And what you do about each of those is different. Before I just did the same thing for all of them — shut down or push through." — Priya',
        },
        {
          num: '04', icon: '💤', color: '#5B3A8B', bg: '#F2EEF9',
          benefit: 'Better Sleep Quality Through Emotional Processing',
          research: 'Research by Wood and colleagues documents that pre-sleep emotional content — particularly unresolved emotional processing from the day — is the primary driver of poor sleep quality through cognitive arousal. Mindfulness practices that specifically address this (the evening emotional download, the body scan, pre-sleep breathing) produce measurable improvements in sleep onset time and sleep quality within one to two weeks. The mechanism: externalising emotional content from active holding to written storage discharges the brain\'s reminder function and allows the cognitive deactivation that sleep requires.',
          student: '"I used to lie awake for 45 minutes to an hour. The worry download plus the body scan brought that down to about 10-15 minutes within two weeks. I was sceptical it would work but the data was undeniable — I was falling asleep faster and waking up less during the night." — Ishaan',
        },
        {
          num: '05', icon: '🤝', color: '#C07800', bg: '#FFF8E1',
          benefit: 'Stronger Relationships Through Better Emotional Management',
          research: 'Research by Barnes and colleagues documents that mindfulness practice improves relationship quality through three specific mechanisms: reduced emotional reactivity to partner behaviour (less automatic negative responding), increased ability to communicate needs and emotions clearly (from improved emotional awareness), and increased capacity to be genuinely present in interactions (reduced mind-wandering during conversations). For students, these improvements manifest most visibly in family relationships under academic pressure — the pressure-triggered reactivity that produces damaging family conflict reduces as the regulation capacity builds.',
          student: '"My parents still ask about marks with the same frequency. But I notice now that I have a choice about how to respond — I can take a breath and actually answer what they\'re asking, or explain what I need, or set a boundary. Before it was just reaction. The relationship got better because I got more regulated, not because they changed." — Ananya',
        },
      ].map(b => (
        <div key={b.num} style={{ background: 'white', borderRadius: '14px', padding: '20px 22px', marginBottom: '16px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${b.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: `${b.color}40` }}>{b.num}</div>
            <span style={{ fontSize: '20px' }}>{b.icon}</span>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: b.color }}>{b.benefit}</div>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{b.research}</p>
          <div style={{ background: b.bg, borderRadius: '9px', padding: '9px 12px', border: `1px solid ${b.color}20` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: b.color, marginBottom: '3px' }}>👤 STUDENT EXPERIENCE:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65, fontStyle: 'italic' }}>{b.student}</p>
          </div>
        </div>
      ))}

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Emotional Balance and Mindfulness FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I start the practices but as soon as something stressful happens, all the regulation goes out the window. How do I make the practices stick under pressure?</strong><br />
        A: This is the most universal challenge in developing emotional regulation through mindfulness — the practices learned in calm conditions are not automatically available under high stress. The reason is neurological: under high cortisol, the prefrontal cortex that would implement the regulation strategies is partially downregulated. Two approaches address this. First, build the most physiological techniques (the physiological sigh, feet-on-floor grounding) to automaticity through daily low-stakes repetition — practise the sigh every morning before picking up the phone, regardless of stress level. After two to three weeks, it will activate automatically in stressful moments because it has been drilled deeply enough. Second, reduce the cognitive load of the practice under stress: instead of trying to remember and implement a multi-step regulation routine during acute stress, have one single trained response — "I am stopping, taking one sigh, and then deciding." One action, practised until automatic, provides more stress-proof regulation than a sophisticated routine remembered imperfectly.</p>

        <p><strong>Q: Is emotional balance different for students who feel emotions more intensely than others?</strong><br />
        A: Yes — and the difference matters. Some people have a naturally higher emotional intensity baseline, which researchers describe as high negative emotional reactivity (NEO-PI-R neuroticism dimension) or high affect intensity (Larsen). For these students, the goal of emotional balance is not to reduce emotional intensity to an "average" level — that is not achievable through mindfulness and would not be desirable even if it were. The goal is to build the regulation capacity that matches the emotional intensity: a higher-intensity emotional system requires more robust regulation capacity, not less emotional experience. The practices in this guide are appropriate for all intensity levels; students with higher baseline intensity may need longer daily practice sessions and more explicit physiological regulation (body scan, extended breathing practices) to achieve the same degree of balance that lower-intensity individuals achieve from briefer sessions.</p>

        <p><strong>Q: My emotional imbalance includes periods of feeling genuinely nothing — not sad, not anxious, just flat. Do these practices help with that too?</strong><br />
        A: Yes — the Emotional Balance Builder above includes a specific routine for emotional flatness or numbness. Flatness is almost never the literal absence of emotion; it is the protective dampening of emotional signalling, typically in response to sustained overwhelm or to emotional content that feels too difficult to contact directly. The practices for flatness specifically differ from those for intense emotions: they use gentle invitation rather than regulation, body-based inquiry rather than cognitive processing, and patient, non-demanding contact with what is present rather than the more active techniques appropriate for acute emotional intensity. The body scan and the gentle inquiry writing practices are particularly effective because they approach the flatness as information rather than as a problem — "what is underneath this flatness?" often reveals genuine emotional content that the flatness was protecting against, which can then be gradually, gently processed.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SLATE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "Emotional balance is not the absence of storms — it is knowing how to stand in the rain without drowning. Mindfulness builds that standing capacity, one practice at a time."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Builder above to find your routine for right now. Begin with the first step — one physiological sigh, one emotion named, one thing written. That is already the practice. The balance builds from there.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SLATE, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORD}` }}
          >
            Find Your Balance in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: SLATE, border: `2px solid ${SLATE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Access Our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/manage-emotions-mindfulness',    '→ How to Manage Emotions Using Mindfulness Techniques'],
            ['/blog/emotional-awareness-daily',      '→ How to Become More Emotionally Aware Every Day'],
            ['/blog/control-thoughts-emotions',      '→ How to Control Your Thoughts and Emotions Naturally'],
            ['/blog/stay-grounded-stress',           '→ How to Stay Grounded During Stressful Moments'],
            ['/blog/develop-inner-peace',            '→ How to Develop Inner Peace in a Busy Life'],
            ['/blog/benefits-of-mindfulness',        '→ Benefits of Mindfulness for Students and Young Adults'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: SLATE, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
