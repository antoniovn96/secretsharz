import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Avoid Last-Minute Exam Anxiety and Panic",
  excerpt: "Last-minute exam anxiety is almost always built in the days before the exam, not the morning of it. Learn the seven most common mistakes that create panic, build a prevention routine across all five critical windows, and use our Panic Prevention Planner to create a personalised exam-eve strategy you can actually follow.",
  category: "Mental Health",
  date: "10-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/avoid-exam-panic.jpg",
  tldr: "Last-minute exam anxiety is not an unavoidable feature of exam season — it is a predictable result of specific preparation mistakes, and most of them are avoidable. This guide covers the seven biggest mistakes students make that lead to last-minute panic, a five-window preparation and calming routine (days before, night before, morning of, in the hall, and after), and an interactive Panic Prevention Planner to build your personalised exam-eve strategy.",
  toc: [
    { id: "seven-mistakes", title: "1. Seven Mistakes That Create Last-Minute Exam Panic",           level: 3 },
    { id: "five-windows",   title: "2. The Five Critical Windows — What to Do in Each",              level: 3 },
    { id: "planner",        title: "3. Interactive: The Panic Prevention Planner",                   level: 3 },
    { id: "calming-routine",title: "4. Building a Calming Pre-Exam Routine That Actually Works",     level: 3 },
    { id: "strategies",     title: "5. Last-Minute Preparation Strategies (When You Are Behind)",    level: 3 },
    { id: "faq",            title: "6. Last-Minute Exam Anxiety FAQs",                               level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-10T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "last minute exam anxiety, avoid exam panic, exam anxiety last minute, exam eve anxiety, exam morning panic, last minute exam tips, calm before exam, exam preparation last minute",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I avoid last-minute exam anxiety?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Avoiding last-minute exam anxiety requires two parallel strategies: preparation-based prevention (consistent revision that eliminates the genuine gaps that legitimately create panic, combined with regular practice under timed conditions so the exam environment feels familiar) and physiological regulation (a specific calming routine in the 24 hours before the exam that includes a preparation cutoff time, adequate sleep, morning physical movement, and a pre-committed anxiety management technique for the exam hall). The students who manage exam anxiety best are not those who feel less of it — they are the ones with a pre-built system that they activate before the anxiety has a chance to spiral.",
      },
    },
    {
      "@type": "Question",
      "name": "What should I do the night before an exam to avoid panic?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The night before an exam: stop studying by 9pm (no new learning — only light review of key points if needed), lay out all materials you need for the morning so there are no decisions to make, eat a proper meal, do a brief structured relaxation exercise (progressive muscle relaxation or extended exhale breathing), write tomorrow's morning schedule in detail, and go to bed at a time that allows 8 hours of sleep. The single most important thing you can do the night before an exam is sleep adequately. No revision session in those final hours comes close to the cognitive performance benefit of an additional hour of sleep.",
      },
    },
    {
      "@type": "Question",
      "name": "Is it normal to panic right before an exam?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pre-exam activation — elevated heart rate, butterflies, heightened alertness — is not only normal but functionally useful up to a moderate level. The Yerkes-Dodson principle shows that moderate arousal improves performance. Panic — acute, overwhelming fear that disrupts thought and prevents recall — is different in degree and in effect. Most pre-exam panic is not an unavoidable biological reality. It is the accumulated result of specific preparation failures, specific cognitive habits (catastrophic thinking, worst-case prediction), and specific physiological states (sleep deprivation, hypoglycaemia) that are all addressable in advance.",
      },
    },
  ],
};

// ── Panic Prevention Planner Data ──────────────────────────────────────────────
const SLATE    = '#2E4A7A';
const SPALE5   = '#EEF2FA';
const SBORD5   = 'rgba(46,74,122,0.22)';

const PANIC_TRIGGERS = [
  {
    key:     'underprepared',
    icon:    '📚',
    label:   'I feel genuinely underprepared',
    desc:    'There are real gaps in my knowledge and the exam is close',
    realistic: true,
  },
  {
    key:     'catastrophising',
    icon:    '🌀',
    label:   'My thoughts spiral to worst-case outcomes',
    desc:    'I keep imagining failing, disappointing people, or things going badly',
    realistic: false,
  },
  {
    key:     'comparison',
    icon:    '👀',
    label:   'Seeing classmates seem more prepared triggers panic',
    desc:    'Others looking calm or confident makes my anxiety spike',
    realistic: false,
  },
  {
    key:     'physical',
    icon:    '💗',
    label:   'Physical symptoms take over — heart, breathing, stomach',
    desc:    'The body sensations themselves become frightening',
    realistic: false,
  },
  {
    key:     'timing',
    icon:    '⏰',
    label:   'Running out of time to cover everything',
    desc:    'Too much left, too few hours — the gap feels impossible',
    realistic: true,
  },
];

const TIME_TO_EXAM = [
  { key: 't48',   icon: '📅', label: '48+ hours',          desc: 'Two or more days to go' },
  { key: 't24',   icon: '🌙', label: '24 hours',           desc: 'Exam is tomorrow' },
  { key: 't12',   icon: '☀️', label: 'Morning of',         desc: 'Exam is today' },
  { key: 't_hall', icon: '📝', label: 'I\'m about to go in', desc: 'Minutes before the exam' },
];

const WINDOW_PLANS = {
  underprepared: {
    t48: {
      headline: 'Two days is meaningful time — if used correctly.',
      steps: [
        { icon: '🎯', title: 'Triage immediately', text: 'List every topic and mark it High/Medium/Low priority by exam weight. Commit to covering only High priority topics in these 48 hours. Accepting you will not cover everything is the first act of functional preparation — not defeat.' },
        { icon: '⚡', title: 'Practice over revision', text: 'For each high-priority topic, do one focused study session followed immediately by 3-5 past questions. Do not re-read notes repeatedly. One active practice session on a topic reveals more than two hours of passive review.' },
        { icon: '🛑', title: 'Stop at 9pm tonight and 9pm tomorrow', text: 'A firm cutoff creates the sleep space that consolidates everything you have studied. Studying into the early morning degrades both the sleep-based consolidation and tomorrow\'s cognitive performance.' },
        { icon: '🌱', title: 'Reframe what "prepared" means', text: 'Prepared does not mean knowing everything. It means knowing the high-priority material well enough to score adequately on questions about it, and having attempted enough past questions to approach the paper without complete unfamiliarity.' },
      ],
      calming: 'Use the two-day window actively rather than anxiously. Anxiety about underprepardness is only useful as the signal to start the triage — after that, action is more valuable than continued anxiety.',
      mantra: '"I cannot study yesterday. I can use today well."',
    },
    t24: {
      headline: '24 hours — strategy shifts from learning to consolidating.',
      steps: [
        { icon: '📋', title: 'One final triage review', text: 'Spend 30 minutes identifying the three most likely exam topics and the three biggest gaps you can realistically close today. No more scanning for gaps after this — focus only on what you have identified.' },
        { icon: '📝', title: 'Active recall only — no re-reading', text: 'Write from memory everything you know about each high-priority topic. Check against notes. Correct errors. The active struggle of writing from memory is what builds retrieval strength — re-reading builds recognition only.' },
        { icon: '🕘', title: 'Finish by 9pm — hard stop', text: 'Lay out everything you need for tomorrow. Write tomorrow\'s morning schedule in a notebook. Eat a proper meal. The preparation work ends here — what follows is recovery.' },
        { icon: '🌙', title: 'Recovery protocol', text: 'Extended exhale breathing (4-count in, 8-count out) for 5 minutes. Progressive muscle relaxation. Into bed at a time that allows 8 hours of sleep. This is not luxury — this is the highest-return preparation activity remaining.' },
      ],
      calming: 'Everything you will remember in the exam is in your long-term memory by now. Tonight\'s sleep consolidates and makes it accessible. Fighting sleep to study is trading a larger cognitive asset for a smaller one.',
      mantra: '"What I know, I know. Sleep protects that knowledge."',
    },
    t12: {
      headline: 'Morning of — the preparation window is closed. This is execution.',
      steps: [
        { icon: '🍳', title: 'Eat before you leave', text: 'Even if nausea makes eating difficult — something small and protein-containing within an hour of the exam. Low blood sugar amplifies anxiety symptoms and degrades cognitive performance. You cannot afford to skip this.' },
        { icon: '🏃', title: 'Physical movement before entering', text: 'Five minutes of brisk walking, stair climbing, or any movement that uses the adrenaline your body has already produced. This physiologically reduces the cortisol spike rather than leaving it internally amplifying.' },
        { icon: '🚫', title: 'No post-mortem conversations with classmates', text: 'The group comparison before the exam almost always increases anxiety. Arrive with enough time to settle — not to compare preparation with peers. Put headphones in if needed.' },
        { icon: '🎯', title: 'Activate your pre-committed calming technique', text: 'Whatever technique you have practised — physiological sigh, box breathing, 5-4-3-2-1 grounding — use it now, before entering the hall. Do not wait for panic to arrive.' },
      ],
      calming: 'The feeling of pre-exam anxiety is not a prediction. It is preparation energy. Reframe: "My body is getting ready for something that matters."',
      mantra: '"I am ready. This feeling is energy, not evidence of failure."',
    },
    t_hall: {
      headline: 'Minutes before the paper — the only job now is to settle.',
      steps: [
        { icon: '😮‍💨', title: 'Physiological sigh × 3', text: 'Double inhale through the nose (full, then a second sharp top-up), followed by one long exhale through the mouth. Three times. This is the fastest available cortisol reduction — works within 30 seconds. Do it seated, with eyes forward, invisibly.' },
        { icon: '💆', title: 'Body scan release', text: 'Unclench your jaw. Drop your shoulders. Release your hands. Check your stomach. Do this slowly, from top to bottom. You are holding tension you were not aware of — releasing it physically reduces the threat signal.' },
        { icon: '📖', title: 'Read everything before writing anything', text: 'The moment you receive the paper, read all questions before writing a single word. This gives your brain a complete map, prevents the panic of encountering an unexpected question mid-flow, and enables strategic time allocation.' },
        { icon: '🌱', title: 'Start with what you know', text: 'Begin with a question — any question — that you can answer. Writing activates the brain\'s retrieval network. Getting words on paper reduces the threat signal and gradually makes other material more accessible.' },
      ],
      calming: 'You have done the work. The information is in there. The only job right now is to reduce the noise enough to access it.',
      mantra: '"Breathe. Read. Start with what I know."',
    },
  },
  catastrophising: {
    t48: {
      headline: 'Catastrophic thinking in the 48-hour window — interrupt it before it builds.',
      steps: [
        { icon: '🏷️', title: 'Name the thought as a prediction, not a fact', text: '"I am going to fail" is a prediction. Write it down and write below it: "This is a prediction. What is the actual evidence?" Most catastrophic predictions have minimal supporting evidence when examined specifically rather than felt generally.' },
        { icon: '✍️', title: 'Write the feared outcome in detail', text: 'Write exactly what you are afraid will happen — specifically, not vaguely. Most catastrophic anxiety feeds on vagueness. Specificity often reveals that the feared outcome is either unlikely or survivable.' },
        { icon: '📚', title: 'Return attention to action', text: 'The only productive response to catastrophic thinking about an exam is action — studying the specific topics you are worried about. Channel the anxiety into the preparation that reduces the genuine component of the worry.' },
        { icon: '💬', title: 'Talk to one person who knows you', text: 'Catastrophic thinking thrives in isolation. Telling one trusted person — briefly, without a full catastrophe download — what you are anxious about disrupts the internal spiral and provides reality-checking.' },
      ],
      calming: 'Every minute spent in catastrophic imagination is a minute not spent on the preparation that would actually reduce the risk you are imagining.',
      mantra: '"This is a thought, not a prophecy. What can I do right now?"',
    },
    t24: {
      headline: 'Night before — the spiral must be interrupted before sleep.',
      steps: [
        { icon: '📋', title: 'The worry window method', text: 'Designate 20 minutes — now, specifically — as your official worry time. Write every catastrophic thought in detail. After 20 minutes, close the notebook. Outside this window, when catastrophic thoughts arise, write them in a one-sentence note and defer them: "I will address this in tomorrow\'s worry window."' },
        { icon: '📖', title: 'Evidence inventory', text: 'Write three specific things you know about exam topics. Not "I know chemistry" — three specific facts, reactions, or concepts you are confident in. The inventory shifts the brain\'s evidence base from absence of certainty to presence of knowledge.' },
        { icon: '🌙', title: 'Structured wind-down', text: '4-7-8 breathing (in 4, hold 7, out 8) for five rounds. Progressive muscle relaxation from feet to face. Reading something unrelated to the exam for fifteen minutes. This sequence physiologically interrupts the anxiety activation before sleep.' },
        { icon: '🚫', title: 'No social media after 9pm', text: 'Social media exposure in the final hours before sleep amplifies comparison anxiety and delays sleep onset. Phone to another room, notifications off, earlier than usual.' },
      ],
      calming: 'Catastrophic thinking about tomorrow is using today\'s cognitive resources to suffer in advance over something that has not happened. Tonight\'s sleep is worth more than any further worry.',
      mantra: '"The outcome is not decided yet. What I do tonight — sleep — is the best preparation left."',
    },
    t12: {
      headline: 'Morning of — reframe the physical sensations, not the situation.',
      steps: [
        { icon: '🏷️', title: 'Label the anxiety accurately', text: 'Say: "I feel anxious. This is appropriate. This is my body preparing for something that matters." This labelling — "affect labelling" in psychology — directly reduces amygdala activation within seconds. Call it anxiety, not disaster.' },
        { icon: '🎯', title: 'Redirect to process, not outcome', text: 'Shift from "what if I fail" to "what is my first action in the next ten minutes?" The catastrophic future is not controllable. The next ten minutes of process are. Focus on what is within your control.' },
        { icon: '🏃', title: 'Use the physical energy', text: 'Brisk movement for five minutes. The catastrophic anxiety has produced adrenaline. Use it physically — it dissipates faster through use than through sitting with it.' },
        { icon: '💛', title: 'Recall a past moment of capable performance', text: 'Think of one specific time you did something well under pressure — any exam, any presentation, any situation. The brain\'s evidence system is influenced by what you give it. Feed it an evidence of competence.' },
      ],
      calming: 'The catastrophic outcome you are imagining has not happened. What is actually happening right now is that you are about to sit an exam you have prepared for.',
      mantra: '"What is actually happening right now is manageable."',
    },
    t_hall: {
      headline: 'In the hall — ground yourself in what is real.',
      steps: [
        { icon: '👁️', title: '5-4-3-2-1 grounding', text: 'Five things you can see. Four you can feel. Three you can hear. Two you can smell. One you can taste. Do this slowly, specifically. The multi-sensory present-moment anchor interrupts the future-projected catastrophe and restores prefrontal access.' },
        { icon: '😮‍💨', title: 'Three physiological sighs', text: 'Double inhale, long exhale. Three times. This overrides the shallow rapid breathing that feeds the panic response and restores CO2 balance that is disrupted by hyperventilation.' },
        { icon: '🖊️', title: 'Write one true thing', text: 'On scratch paper, write one specific thing you know about any topic on this paper. Not to use it — to prove to your nervous system that the information is accessible. Writing activates retrieval and reduces the certainty of panic.' },
        { icon: '📖', title: 'Read. Do not react.', text: 'Read the whole paper before any emotional response to any individual question. Encountering a difficult question without context produces panic. Encountering it after reading the whole paper produces a calibrated response.' },
      ],
      calming: 'The catastrophic thought is not reality. The paper in front of you is. Bring your attention here.',
      mantra: '"Here. Now. This question. Nothing else exists right now."',
    },
  },
  comparison: {
    t48: {
      headline: 'Two days before — disconnect from the comparison environment.',
      steps: [
        { icon: '📵', title: 'Mute or pause group study chats', text: 'Exam-period study groups often produce more comparison anxiety than study value. Mute them for 48 hours. Your preparation is your preparation — not a competition visible in real time.' },
        { icon: '🎯', title: 'Define your own success metric', text: 'Write: "For this exam, success for me means [specific honest definition]." Not how others define it — how you do. Comparison only has power if your success metric is calibrated to others\' performance rather than your own preparation.' },
        { icon: '📊', title: 'Use your own past performance as the benchmark', text: 'Compare your current preparation to where you were a month ago, not to how prepared classmates appear to be. You have access to accurate information about your own progress. You do not have accurate information about theirs.' },
        { icon: '📚', title: 'Focus sessions without company', text: 'For the next 48 hours, study alone or with one trusted, non-anxiety-amplifying person. The library group dynamic immediately before exams is reliably comparison-increasing rather than preparation-increasing.' },
      ],
      calming: 'You cannot see the quality of what others are studying, how much they have actually retained, or how anxious they feel inside. You are comparing your internal experience to their external presentation.',
      mantra: '"My preparation is mine. Their performance is theirs."',
    },
    t24: {
      headline: 'Night before — cut the comparison inputs.',
      steps: [
        { icon: '📵', title: 'Social media off from now', text: 'Others\' posts about studying, confidence, or exam preparation will amplify your anxiety more than any other single input tonight. Off, not muted. Phone in another room.' },
        { icon: '📝', title: 'Write your own competence inventory', text: 'List ten things you genuinely know about exam topics. Specific things — not "I know maths" but "I know how to solve quadratic equations." Your competence is real; the comparison spiral obscures it.' },
        { icon: '🛑', title: 'No pre-exam comparison conversations', text: 'Commit now to not discussing preparation levels with classmates until after the exam. Pre-exam comparison conversations are almost universally anxiety-increasing for everyone involved.' },
        { icon: '🌙', title: 'Recovery protocol as described above', text: 'Structured breathing, progressive relaxation, adequate sleep. The comparison anxiety lives in the anxious mind — rest quietens both.' },
      ],
      calming: 'The person who looks most prepared in the group chat may be the most anxious person in the room. Presentation and internal reality diverge most dramatically around exams.',
      mantra: '"Their paper is not my paper. I run my own race."',
    },
    t12: {
      headline: 'Morning of — protect yourself from comparison triggers.',
      steps: [
        { icon: '🎧', title: 'Headphones in from the moment you leave home', text: 'A specific playlist associated with focus and calm, playing from the moment you leave for the exam, prevents the pre-exam social comparison loop that begins the moment you encounter other students.' },
        { icon: '⏰', title: 'Arrive to settle, not to compare', text: 'Arrive early enough to find your seat, settle, and complete your breathing routine — not to participate in the group discussion of "how much did you cover" that happens in the corridor.' },
        { icon: '👁️', title: 'Eyes on your own setup', text: 'Once seated, organise your materials and begin your settling routine. Do not look at others\' materials, body language, or expressions for reassurance — the data will be misread through an anxious lens.' },
        { icon: '🎯', title: 'Your success metric, once more', text: 'Recall the specific, personal definition of success you wrote 48 hours ago. That is the only benchmark that matters in the next two hours.' },
      ],
      calming: 'Everyone else in that hall is also anxious. The composed exterior is a social performance, not an accurate signal of their internal state or their preparation quality.',
      mantra: '"My exam is my exam. What they feel is theirs."',
    },
    t_hall: {
      headline: 'In the hall — visual field management.',
      steps: [
        { icon: '👁️', title: 'Narrow your visual field', text: 'Deliberately look at your desk, your paper, and the room\'s neutral features. Do not scan for signals from other students — interpreting others\' pace, facial expressions, or page-turning as information about comparative performance is an anxious distortion.' },
        { icon: '📖', title: 'Read your paper completely before forming any judgement', text: 'Your first emotional response to the paper — panic or relief — is not reliable information. Read everything first, then assess.' },
        { icon: '😮‍💨', title: 'Physiological reset', text: 'Three physiological sighs whenever comparison thoughts arise. The thought is noticed, the breath is taken, the focus returns to the paper.' },
        { icon: '🖊️', title: 'Start writing — on your paper, about your answers', text: 'The moment you start writing, comparison becomes irrelevant. You are not watching others — you are producing your own answers.' },
      ],
      calming: 'The page-turner next to you might be skipping questions they cannot answer. Speed of writing is not quality of answer. You cannot read what they are writing.',
      mantra: '"I can only see my paper. That is all I need to see."',
    },
  },
  physical: {
    t48: {
      headline: 'Physical symptoms building two days out — address the physiology.',
      steps: [
        { icon: '🏃', title: 'Daily physical movement, non-negotiable', text: '30 minutes of physical exercise each day for the next 48 hours. Exercise is the fastest available cortisol reduction tool and the most direct route to calming the physical anxiety symptoms. Walking, running, anything vigorous.' },
        { icon: '😴', title: 'Sleep protection starts tonight', text: 'The physical symptoms of exam anxiety (racing heart, stomach disturbance, muscle tension) are significantly amplified by sleep deprivation. Protect tonight\'s sleep as the most important anxiety management action available.' },
        { icon: '🥗', title: 'Eat regularly — do not skip meals', text: 'Low blood sugar amplifies every physical anxiety symptom. Three proper meals each day, including the morning of the exam. Food is anxiety management, not a distraction from preparation.' },
        { icon: '💆', title: 'Twice-daily progressive muscle relaxation', text: 'Deliberately tense and release each muscle group, from feet to face. This directly addresses the chronic muscle tension that exam anxiety produces and that physical symptoms often start from.' },
      ],
      calming: 'The physical symptoms are real physiological events caused by cortisol and adrenaline. They are not dangerous. They are not indicators of impending failure. They are your body responding appropriately to anticipated stress — and they are manageable.',
      mantra: '"These sensations are survivable. My body is preparing, not failing."',
    },
    t24: {
      headline: 'Night before — physical calming protocol.',
      steps: [
        { icon: '🚿', title: 'Warm shower or bath before bed', text: 'Warm water lowers core body temperature when you get out, which signals the brain\'s sleep mechanism to activate. It also directly relaxes the muscle tension that exam anxiety accumulates across the day.' },
        { icon: '✨', title: '4-7-8 breathing × 5 rounds', text: 'In for 4, hold for 7, out for 8. The strongest single breath technique for physiological calming. Done lying down, in the dark, it directly addresses racing heart and shallow breathing.' },
        { icon: '💆', title: 'Progressive muscle release', text: 'Full body, from feet to face. Tense 5 seconds, release fully. The systematic release of every muscle group physically dismantles the accumulated tension of the pre-exam period.' },
        { icon: '🌡️', title: 'Cool room, comfortable bedding', text: 'Cooler bedroom temperatures (18-20°C) are associated with better sleep quality and faster sleep onset. If the room is warm, a fan or open window improves both the physical comfort and the quality of sleep.' },
      ],
      calming: 'The body has been in a mild stress response for several days. Tonight\'s job is a complete physiological reset through sleep. The physical protocol above prepares the body for that reset.',
      mantra: '"My body knows how to rest. I am giving it permission."',
    },
    t12: {
      headline: 'Morning of — use the physical energy productively.',
      steps: [
        { icon: '🏃', title: 'Five minutes of vigorous movement before leaving', text: 'The adrenaline your body has produced overnight has a purpose — it is meant to fuel physical action. Five minutes of brisk walking or stair climbing uses it, dropping the residual cortisol that produces morning anxiety symptoms.' },
        { icon: '💧', title: 'Cold water on face and wrists', text: 'Cold water activates the mammalian diving reflex — an automatic heart rate reduction response. Thirty seconds of cold water on the face, particularly around the eyes, produces a measurable physiological calming effect.' },
        { icon: '🍳', title: 'Eat — even if the stomach is anxious', text: 'Nausea and appetite loss are normal pre-exam symptoms that do not require the stomach to be empty. Something small — crackers, banana, toast — prevents the blood sugar drop that amplifies all other physical symptoms.' },
        { icon: '😮‍💨', title: 'Physiological sigh in the corridor', text: 'Before entering the hall: double inhale, long exhale. Three times. The CO2 balance correction this produces is directly calming to the physical symptoms.' },
      ],
      calming: 'The physical symptoms you feel this morning are the body\'s preparation response, not a preview of exam performance. Students who feel most physically anxious before exams are not necessarily the ones who perform worst.',
      mantra: '"This is preparation energy. I can use it."',
    },
    t_hall: {
      headline: 'In the hall — in-seat physical regulation.',
      steps: [
        { icon: '💆', title: 'Micro-release routine', text: 'Unclench your jaw. Drop your shoulders. Release your hands — open them flat, then gently close. Lower your stomach muscles. This takes ten seconds and addresses the four physical locations where exam anxiety concentrates most densely.' },
        { icon: '😮‍💨', title: 'Physiological sigh — silent, invisible', text: 'Double inhale through the nose, long exhale through the mouth (silent). Three times. Visible to no one. Directly reduces heart rate and cortisol within thirty seconds.' },
        { icon: '👣', title: 'Feel both feet on the floor', text: 'Press both feet deliberately into the floor. This physical grounding anchor simultaneously connects you to the present moment and provides a somatic point of stability when the physical symptoms feel disorienting.' },
        { icon: '🖊️', title: 'Put the pen in your hand', text: 'The physical act of gripping the pen and being ready to write signals to the nervous system that action is available. The transition from passive anxiety to active doing is itself physiologically calming.' },
      ],
      calming: 'Physical symptoms in an exam hall are normal and almost universal. The student next to you is likely experiencing the same heart rate. The difference is in what you do with the experience.',
      mantra: '"Feet on the floor. Pen in hand. Breathe. Begin."',
    },
  },
  timing: {
    t48: {
      headline: 'Two days with too much to cover — triage is the only honest plan.',
      steps: [
        { icon: '🗂️', title: 'Accept the constraint immediately', text: 'You cannot cover everything. Deciding which things to sacrifice is not a failure — it is the only rational response to limited time. A deliberate triage is better than an exhausted attempt to cover everything at low quality.' },
        { icon: '🎯', title: 'Past paper analysis', text: 'Go through the last three years of past papers for each subject and circle the topics that appear most frequently. These are your only study targets for the next 48 hours. High-frequency exam topics are where the marks are.' },
        { icon: '⚡', title: 'Practice-first approach', text: 'For each identified topic, attempt one past question before studying the topic fully. The question reveals exactly what the exam tests — which is more specific and useful than comprehensive note review.' },
        { icon: '🛑', title: 'Set a firm daily endpoint', text: '9pm both days. After that — preparation, materials, sleep. The cognitive consolidation that happens during sleep is not accessible if you are studying through it.' },
      ],
      calming: 'The anxiety of "not enough time" is most productive as a triage trigger — it has done its job once you have identified the priority list. After that, action on the priorities is more valuable than continued time-anxiety.',
      mantra: '"I cannot do everything. I can do the most important things."',
    },
    t24: {
      headline: '24 hours left — shift entirely to high-value activities.',
      steps: [
        { icon: '🎯', title: 'Three topics maximum', text: 'In the time remaining, identify the three topics most likely to appear and cover each one with: active recall, three past questions, and error review. That is a complete preparation unit. Move on after that — do not re-visit.' },
        { icon: '📋', title: 'Quick reference sheet', text: 'Spend 30 minutes writing a one-page summary of the highest-yield points across all subjects — key formulae, definitions, diagrams. Brief review of this sheet in the morning replaces an hour of anxious re-reading.' },
        { icon: '🕘', title: 'Hard stop at 9pm', text: 'What you have not covered by 9pm tonight will not be meaningfully improved by sacrificing sleep to reach it. The sleep consolidates everything you have covered. The late-night cramming is a net negative trade.' },
        { icon: '📅', title: 'Materials ready before 8pm', text: 'Lay out ID, stationery, water bottle, exam schedule — every physical thing for tomorrow. Eliminating all morning decisions reduces morning anxiety and prevents the panic of discovered missing items.' },
      ],
      calming: 'The time constraint is real. The catastrophe it produces is not. What you know by tonight is what you will carry into the exam. Tonight\'s sleep makes that knowledge accessible tomorrow.',
      mantra: '"What I know, I know well. Sleep will help me use it."',
    },
    t12: {
      headline: 'Morning of — the preparation window has closed.',
      steps: [
        { icon: '📋', title: 'One brief review of your reference sheet', text: 'Five minutes with the high-yield summary sheet you made yesterday — not to learn new material, but to activate the retrieval pathways for key information. Close it before leaving home.' },
        { icon: '🚫', title: 'No cramming on the way', text: 'Reading notes on the bus or in the corridor before the exam provides minimal additional learning and maximises anxiety. The material is either there or it is not — last-minute reading confirms gaps rather than closing them.' },
        { icon: '🍳', title: 'Eat and move', text: 'Proper food and brief physical movement before entering the hall. These have more impact on exam performance in the next two hours than any additional revision.' },
        { icon: '💛', title: 'Accept incompleteness', text: 'You prepared under constraint. Every student in that hall has gaps. Your job now is to perform well on what you do know — not to regret what you do not. Score the available points before lamenting the unavailable ones.' },
      ],
      calming: 'The panic about uncovered material is no longer actionable. The available action now is performing well on covered material — which is served by calm, not by panic.',
      mantra: '"I prepared as well as I could. That is what I bring in."',
    },
    t_hall: {
      headline: 'In the hall — strategic paper management.',
      steps: [
        { icon: '📖', title: 'Read the whole paper strategically', text: 'Scan all questions and immediately identify: questions you can definitely answer, questions you might be able to answer with effort, questions you cannot answer. Allocate your time to the first category primarily, then the second.' },
        { icon: '✅', title: 'Answer what you know first', text: 'Begin with questions you are confident about, regardless of order. This builds momentum, scores guaranteed marks, and the act of writing activates retrieval for other material.' },
        { icon: '📝', title: 'Partial answers score points', text: 'For questions where you have partial knowledge, write everything you know. Partial marks on partially known questions beat zero marks on skipped questions. Write the framework of an answer even if the specifics are incomplete.' },
        { icon: '⏱️', title: 'Time proportional to marks', text: 'Allocate your remaining time by mark weight, not by difficulty or confidence. A question worth 20 marks deserves four times more time than a question worth 5 marks, regardless of which one you find easier.' },
      ],
      calming: 'The gaps in your preparation are not catastrophic unless you let panic occupy the time that could be scoring partial marks. Work with what you have.',
      mantra: '"Score the available points. Leave nothing on the table."',
    },
  },
};

// ── Planner Component ──────────────────────────────────────────────────────────
function PanicPreventionPlanner() {
  const [step,     setStep]     = useState(1);
  const [trigger,  setTrigger]  = useState(null);
  const [timeKey,  setTimeKey]  = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [openStep, setOpenStep] = useState(null);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selTrig = PANIC_TRIGGERS.find(t => t.key === trigger);
  const selTime = TIME_TO_EXAM.find(t => t.key === timeKey);
  const plan    = trigger && timeKey ? WINDOW_PLANS[trigger]?.[timeKey] : null;

  const handleReset = () => { setStep(1); setTrigger(null); setTimeKey(null); setRevealed(false); setOpenStep(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Step progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? SLATE : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — trigger */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What is driving your exam panic most right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the pattern that feels most honest — the root of the anxiety, not just a symptom.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {PANIC_TRIGGERS.map(t => {
              const isSel = trigger === t.key;
              return (
                <button key={t.key} onClick={() => setTrigger(t.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SLATE : 'var(--border)', background: isSel ? SPALE5 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${SBORD5}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{t.icon}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? SLATE : 'var(--ink)' }}>{t.label}</div>
                      {t.realistic && <span style={{ fontSize: '10px', fontWeight: '700', background: '#FFF3CD', color: '#B45309', padding: '2px 7px', borderRadius: '20px' }}>Actionable</span>}
                      {!t.realistic && <span style={{ fontSize: '10px', fontWeight: '700', background: SPALE5, color: SLATE, padding: '2px 7px', borderRadius: '20px' }}>Cognitive</span>}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (trigger) setStep(2); }} disabled={!trigger} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: trigger ? `linear-gradient(135deg, ${SLATE}, #3E6AB5)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: trigger ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: trigger ? `0 6px 18px ${SBORD5}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 — time */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How much time do you have until the exam?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Your strategy changes significantly based on the time window you are in.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {TIME_TO_EXAM.map(t => {
              const isSel = timeKey === t.key;
              return (
                <button key={t.key} onClick={() => setTimeKey(t.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SLATE : 'var(--border)', background: isSel ? SPALE5 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 2px ${SBORD5}` : 'none',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{t.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: isSel ? '700' : '600', color: isSel ? SLATE : 'var(--ink)' }}>{t.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{t.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (timeKey) { setStep(3); setRevealed(false); } }} disabled={!timeKey} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: timeKey ? `linear-gradient(135deg, ${SLATE}, #3E6AB5)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: timeKey ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Plan →</button>
          </div>
        </>
      )}

      {/* STEP 3 — results */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — Your Panic Prevention Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${SLATE}, #3E6AB5)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${SBORD5}`,
              }}>🛡️ Reveal My Plan</button>
              <button onClick={() => setStep(2)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : plan ? (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${SLATE}, #3E6AB5)`, borderRadius: '14px', padding: '22px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{selTrig?.icon} {selTime?.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '5px', lineHeight: 1.4 }}>
                  {plan.headline}
                </div>
              </div>

              {/* Four steps — expandable */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE, marginBottom: '9px' }}>
                  🎯 Your Four-Step Action Plan
                </div>
                {plan.steps.map((s, i) => {
                  const isOpen = openStep === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: `1.5px solid ${SBORD5}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenStep(isOpen ? null : i)} style={{
                        width: '100%', padding: '13px 16px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg, ${SLATE}, #3E6AB5)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>{s.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: SLATE }}>{s.title}</div>
                        </div>
                        <span style={{ color: SLATE, fontSize: '14px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 14px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.2s ease' }}>
                          <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{s.text}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Calming note */}
              <div style={{ background: SPALE5, border: `1.5px solid ${SBORD5}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE, marginBottom: '6px' }}>
                  💙 A Calming Perspective
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{plan.calming}</p>
              </div>

              {/* Mantra */}
              <div style={{ background: 'white', border: `1.5px dashed ${SBORD5}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SLATE, marginBottom: '7px' }}>
                  ✨ Your Exam Mantra
                </div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: SLATE, fontStyle: 'italic', lineHeight: 1.55 }}>
                  {plan.mantra}
                </p>
              </div>

              <button onClick={handleReset} style={{
                background: 'transparent', border: `1.5px solid ${SBORD5}`, color: SLATE,
                padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                fontWeight: '700', fontFamily: font,
              }}>↺ Try a different trigger or time window</button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <p style={{ color: 'var(--muted)' }}>Plan not found for this combination — try selecting different options.</p>
              <button onClick={handleReset} style={{ marginTop: '10px', background: 'transparent', border: `1.5px solid ${SBORD5}`, color: SLATE, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Start again</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AvoidExamPanic({ navigate, relatedPosts }) {
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
      <p><strong>Last-minute exam anxiety</strong> has a specific texture that ordinary anxiety does not: the clock is visible, the gaps are real, the consequences feel existential, and the panic that arrives in the final hours seems to confirm every fear that the preparation was insufficient. It is one of the most reliably miserable experiences in student life.</p>

      <p>It is also, in most cases, largely preventable. Not by studying more — though preparation matters — but by understanding the specific cascade of mistakes and thought patterns that create the final-hours spiral, and by having a structured plan for each of the five critical windows before the exam begins.</p>

      <img
        src={meta.imgUrl}
        alt="Student using preparation strategies and calming routines to avoid last-minute exam anxiety and panic"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="seven-mistakes">1. Seven Mistakes That Create Last-Minute Exam Panic</h3>

      <p><strong>Mistake 1: Studying all subjects equally regardless of gaps and exam weight.</strong> The most reliable route to last-minute panic is arriving two days before the exam with significant preparation gaps in high-weight subjects — because the time available was distributed evenly rather than strategically. Equal time allocation feels fair but produces uneven outcomes. The subjects that needed the most work consistently received the same time as those that needed the least, and the gaps that should have been closed early remain open at the most anxious point.</p>

      <p><strong>Mistake 2: Revision over practice until the final days.</strong> Re-reading notes produces familiarity — the comfortable feeling that you recognise the material. Practice (solving past questions under conditions) reveals what you can actually retrieve and use. Students who spend 80% of their preparation time on revision and 20% on practice discover their real knowledge gaps for the first time in the final days, when they no longer have time to address them. This is perhaps the single most common and most preventable cause of last-minute exam panic.</p>

      <p><strong>Mistake 3: No firm study endpoint the night before.</strong> Studying without a defined cutoff time produces the specific misery of studying at 1am when cognitive performance has been degraded by exhaustion, the material is no longer being retained, but stopping feels like giving up. The night-before cramming session almost always produces more anxiety than knowledge. The material added in those final anxious hours competes with existing material for retrieval access rather than supplementing it.</p>

      <p><strong>Mistake 4: Participating in pre-exam group anxiety loops.</strong> The group conversation in the corridor before an exam — "did you cover X?", "I haven't done Y", "this is going to be impossible" — is a reliable anxiety amplification loop. Everyone arrives with their own anxiety, contributes it to the group, and leaves with more than they brought. This is well-documented in research on emotional contagion: anxiety states transfer between people through both explicit content (what is said) and implicit signals (tone of voice, facial expressions, body language). The fifteen minutes before the exam is among the highest-risk comparison and contagion environments in student life.</p>

      <p><strong>Mistake 5: Skipping meals and relying on caffeine.</strong> Low blood sugar amplifies every anxiety symptom — racing heart, difficulty concentrating, physical shakiness. Excessive caffeine raises baseline cortisol further above an already-elevated exam-period baseline, amplifying the physical anxiety response. Most students who feel extremely physically anxious on exam day have eaten poorly and consumed more caffeine than usual. The combination produces a physiological state that the brain interprets as threat, further activating the anxiety response.</p>

      <p><strong>Mistake 6: Trying new calming techniques in the exam hall for the first time.</strong> Reading about box breathing and attempting it for the first time during an exam is qualitatively different from using a technique you have practised twenty times. The unfamiliarity of a new technique in a high-stakes context produces its own anxiety — "am I doing this right?", "it is not working" — that adds to rather than subtracts from the overall stress. Every calming technique in this guide needs to be practised in advance, in low-stakes conditions, before it becomes reliably available under pressure.</p>

      <p><strong>Mistake 7: No plan for the exam morning.</strong> Leaving the exam morning unplanned means the brain encounters a series of small decisions without an organised structure — what to eat, when to leave, what to bring, how to travel — while already in an elevated anxiety state. Decision fatigue compounds anxiety. An exam morning that was planned the night before (specific departure time, specific breakfast, specific route, everything laid out) removes all decisions and reduces the cognitive and emotional load of the morning.</p>

      {/* ── Section 2 ── */}
      <h3 id="five-windows">2. The Five Critical Windows — What to Do in Each</h3>

      <p><strong>Window 1: Days 3-7 before the exam.</strong> This is the highest-leverage window. With three to seven days remaining, there is still time to close genuine knowledge gaps — but only if the time is used for practice (past questions, active recall, mock tests) rather than revision. The priority in this window is identifying your three biggest knowledge gaps through practice and addressing them specifically. Comprehensive re-reading of notes in this window is the most common and least effective use of this time.</p>

      <p><strong>Window 2: 48 hours before.</strong> The triage window. Make one final decision about what you will and will not cover — and commit to it. Identify the highest-frequency topics from past papers across all subjects and ensure these are covered. Switch to a 60% practice, 40% review ratio. Set a firm study cutoff for tonight (9pm) and lay out everything needed for the exam day. Begin the physical recovery protocol: normal meals, no extra caffeine, standard sleep time.</p>

      <p><strong>Window 3: The night before.</strong> The preparation window is effectively closed. The highest-value activities tonight are: a brief review of key summary points (30 minutes maximum, nothing new), a structured physical relaxation routine, and 8 hours of sleep. The temptation to study through the night is specifically dangerous because it sacrifices the cognitive consolidation and performance benefit of sleep for the marginal and rapidly diminishing returns of exhausted late-night studying. The student who sleeps adequately and stops studying at 9pm will almost always outperform the student who studies until 2am.</p>

      <p><strong>Window 4: The exam morning.</strong> Execution window — not preparation. Eat properly. Move physically for five minutes before leaving. Arrive early enough to settle. Avoid extended comparison conversations with classmates. Use your pre-prepared calming technique before entering the hall. Put headphones in if group anxiety is a trigger. Read the paper completely before writing a single word.</p>

      <p><strong>Window 5: The first five minutes in the hall.</strong> These five minutes determine the cognitive state from which the entire exam is attempted. Use them for: one round of physiological sigh (double inhale, long exhale), a physical tension release scan (jaw, shoulders, hands, stomach), and a complete reading of the paper before answering anything. Students who rush directly into answering the first question without settling produce significantly worse performance on subsequent questions than those who invest five minutes in physiological regulation first.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="planner">3. Interactive: The Panic Prevention Planner</h3>
      <p>The Planner identifies your primary panic trigger and your current time window, then generates a four-step action plan specific to that combination — 25 combinations in total, each calibrated to the actual mechanism driving the panic and the realistic options available in the time remaining. Select honestly, and use the plan you receive.</p>

      <PanicPreventionPlanner />

      {/* ── Section 4 ── */}
      <h3 id="calming-routine">4. Building a Calming Pre-Exam Routine That Actually Works</h3>
      <p>A calming routine is not a collection of wellness practices assembled the night before. It is a specific, practised sequence of actions that, through repeated association, becomes a signal to the nervous system that the transition to exam mode is safe and manageable. The ritual works because the brain learns through repetition — after sufficient practice, the routine itself activates the calm state, not just any individual technique within it.</p>
      <p><strong>The components of an effective pre-exam calming routine:</strong></p>
      <p><strong>A defined study shutdown time.</strong> The routine cannot begin while study is still ongoing. A specific time (9pm, or whatever works for your context) serves as the ritual's start signal. Before that time, you are studying. After it, you are in recovery mode and the rules change.</p>
      <p><strong>Physical preparation.</strong> Laying out everything you need for the morning — ID, stationery, water, the route to the exam centre, your departure time written in your notebook. This takes fifteen minutes and eliminates every morning decision in advance. The cognitive relief of having nothing to decide in the morning is significant and immediate.</p>
      <p><strong>Physical relaxation.</strong> Progressive muscle relaxation (tense each muscle group for five seconds, release) or a warm shower, followed by extended exhale breathing (four in, eight out) for five rounds. This directly addresses the accumulated physical tension of exam preparation and begins the physiological transition toward rest.</p>
      <p><strong>A positive evidence statement.</strong> Write three things you genuinely know about exam topics. Not "I know chemistry" — three specific pieces of knowledge. This shifts the brain's evidence focus from the gaps that anxiety highlights to the knowledge that preparation has built. It is not positive thinking — it is accurate thinking, which anxiety temporarily makes unavailable.</p>
      <p><strong>Sleep-specific elements.</strong> No screens for thirty minutes before bed. Cool room if possible. The same sleep time you normally use. If sleep is not arriving, rest with eyes closed — even lying awake in the dark produces partial cognitive recovery, which is better than the study session that would otherwise occupy those hours.</p>
      <p><strong>Morning anchors.</strong> The morning portion of the routine — same breakfast, same physical movement, same departure time, same playlist — serves the same association function. Repetition across multiple exams builds the routine into a reliable performance trigger rather than a list of things to try when anxiety is already high.</p>

      {/* ── Section 5 ── */}
      <h3 id="strategies">5. Last-Minute Preparation Strategies (When You Are Behind)</h3>
      <p>If you are reading this with one or two days remaining and genuinely behind on preparation, the following strategies represent the best available use of the time — not an ideal situation, but a functional response to a real constraint.</p>
      <p><strong>Triage without guilt.</strong> Accept immediately and explicitly that you will not cover everything. Write the decision: "I am choosing to prioritise [specific topics] and deprioritise [specific topics]." This conscious decision, made deliberately, is psychologically different from the helpless drift of not knowing what to study and being paralysed by the scope. You are making a strategic choice, not conceding defeat.</p>
      <p><strong>Past paper questions as your study guide.</strong> Go through past papers from the last three to five years and mark the topics that appear most frequently. For each high-frequency topic, do one focused active recall session (write from memory everything you know) and attempt two to three past questions. This approach — using the exam itself as your study guide — produces the most exam-relevant preparation per unit of available time.</p>
      <p><strong>The Feynman technique for difficult concepts.</strong> Take the concept you find most confusing and explain it out loud, in plain language, as if teaching it to someone who has never encountered it. Where the explanation breaks down — where you reach for the word "somehow" or realise you are only approximating the logic — marks the specific gap to address. This technique reveals the precise location of understanding failure faster than any re-reading of notes.</p>
      <p><strong>Key points summary sheet.</strong> Spend thirty minutes creating a single-page summary of the highest-yield points across all exam subjects — key formulae, dates, definitions, diagrams. A brief, focussed review of this sheet on exam morning activates the retrieval pathways for the material and replaces the anxious re-reading of full notes that produces diminishing returns.</p>
      <p><strong>The 9pm shutdown is even more important when behind.</strong> The temptation to study through the night when significantly behind is understandable and reliably counterproductive. The cognitive degradation of sleep deprivation (reduced working memory, impaired recall, lower prefrontal function) consistently outweighs the small amount of additional material that can be absorbed in an exhausted state. The student who sleeps adequately with a 70% preparation will perform better than the student who studies through the night with a 75% preparation — because the first student has the cognitive infrastructure to access their preparation and the second does not.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Last-Minute Exam Anxiety FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I am having a panic attack the morning of the exam. What do I do right now?</strong><br />
        A: Physical first. Double inhale through the nose (sharp, to fully inflate the lungs), followed by one long slow exhale. Do this three times. Next, feel both feet on the floor and name five things you can see in your immediate environment — out loud if possible. These two interventions address the physical and cognitive dimensions of acute panic simultaneously. If you have water, drink some slowly. Do not try to study in this state — the cognitive system is not available. Regulate first, then reassess. If the panic does not subside within ten minutes of regulation attempts, contact a trusted adult, your school counsellor, or a support service. It is okay to need help.</p>

        <p><strong>Q: What if I walk into the hall and genuinely blank — everything disappears?</strong><br />
        A: Stop writing and do not attempt to force recall. Put the pen down. Do three physiological sighs. Read the entire paper — all questions — before writing anything. Then start with whatever question you can answer, however partially. The act of writing on any question activates the retrieval network and gradually restores access to other material. Blanking is caused by cortisol suppressing prefrontal function — the techniques above lower cortisol enough to restore access. The information is there. The panic created a temporary block that is reversible.</p>

        <p><strong>Q: My parents want me to study until midnight the night before. How do I explain to them why that is counterproductive?</strong><br />
        A: The evidence here is compelling and translates well into the performance language most parents understand. Sleep consolidates the memories formed during study — this is not a metaphor, it is the specific biological process by which the hippocampus transfers learning into long-term memory storage. A student who studies until midnight and sleeps five hours will have access to less of their studied material in the exam the next morning than a student who stops at 9pm and sleeps eight hours — because the consolidation process was interrupted. The frame is not rest vs preparation. It is preparation quality vs preparation quantity, where adequate sleep produces higher quality access to the same preparation.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SLATE, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "The exam does not begin when the paper lands in front of you. It begins with how you spend the 48 hours before."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Last-minute panic is not something that happens to you. It is something that is built — through specific, avoidable mistakes across the days and hours before the exam. The five windows are the intervention points. Use them with the right actions and the panic that so many students treat as inevitable becomes, instead, a manageable signal that you already have a plan for.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SLATE, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORD5}` }}
          >
            Process Exam Anxiety in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: SLATE, border: `2px solid ${SLATE}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Get Support in our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Complete Your Exam Preparation:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/exam-anxiety-help',               '→ Why Exams Cause Anxiety and How to Overcome It Naturally'],
            ['/blog/exam-stress-management',          '→ How to Handle Exam Stress Without Panic (Student Guide)'],
            ['/blog/time-management-exams',           '→ Time Management Tips for Students During Exams'],
            ['/blog/quick-stress-relief-students',    '→ 5-Minute Stress Relief Techniques for Busy Students'],
            ['/blog/study-plan-reduce-stress',        '→ How to Create a Study Plan That Reduces Stress'],
            ['/safe',                                 '→ Access 24/7 Professional Support in our Safe Corner'],
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
