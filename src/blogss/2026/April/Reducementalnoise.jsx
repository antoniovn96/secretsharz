import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Reduce Mental Noise and Distractions Naturally",
  excerpt: "Mental noise is not a concentration problem — it is a signal problem. The distracted mind is not broken; it is responding rationally to an environment designed to fragment attention, a nervous system running at sustained high alert, and a cognitive workload that exceeds the comfortable capacity of working memory. Reducing mental noise means addressing each of these sources — through mindfulness, through specific focus practices, and through deliberate boundaries around the digital environment that generates most of it.",
  category: "Mental Health",
  date: "24-04-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/April/reduce-mental-noise.jpg",
  tldr: "Mental noise has four primary sources: cognitive overload (too much in working memory), internal noise (worry, rumination, emotional content), digital fragmentation (notifications and platform design), and environmental triggers. Each requires a different intervention. This guide covers the science, six focus-building tips, five mindfulness exercises specifically targeting distraction, a digital distraction strategy section, and an interactive Mental Noise Audit that builds a personalised plan.",
  toc: [
    { id: "sources",    title: "1. The Four Sources of Mental Noise — Understanding the Signal",       level: 3 },
    { id: "science",    title: "2. The Neuroscience of Distraction",                                   level: 3 },
    { id: "audit",      title: "3. Interactive: The Mental Noise Audit and Focus Builder",             level: 3 },
    { id: "focus",      title: "4. Six Focus-Building Tips That Reduce Mental Noise",                  level: 3 },
    { id: "mindfulness",title: "5. Five Mindfulness Exercises for Clearing Mental Noise",             level: 3 },
    { id: "digital",    title: "6. Digital Distraction — The Structural Solution",                    level: 3 },
    { id: "faq",        title: "7. Reduce Mental Distractions FAQs",                                  level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-04-24T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "reduce mental distractions, mental noise mindfulness, how to reduce distractions, focus building tips, digital distraction solutions, mindfulness focus exercises, reduce mental clutter naturally",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I reduce mental distractions naturally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Reducing mental distractions naturally requires addressing both internal and external noise sources. For internal noise: the brain dump (writing every thought out of the head before starting) reduces working memory overload; daily mindfulness practice reduces the default mode network's background noise; and naming worry thoughts ('I notice I am having a worry thought about ___') reduces their attentional pull. For external noise: phone in another room during study is the single highest-impact change; notification audit (turning off all non-essential notifications permanently) eliminates the trigger-response cycle; and designating specific check-in windows for messages and social media eliminates continuous partial attention. Combined, these address the four primary sources of mental noise without requiring medication or complete lifestyle disruption.",
      },
    },
    {
      "@type": "Question",
      "name": "Why is it so hard to focus with so many distractions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The difficulty of focusing amid distractions is primarily a design issue, not a character issue. Digital platforms are specifically engineered to maximise attentional capture through intermittent variable reward patterns (the same mechanism underlying slot machine design), social validation triggers, and notification systems calibrated to the minimum interruption threshold. Research by Gloria Mark at UC Irvine shows the average knowledge worker is interrupted every 11 minutes, with 25 minutes needed to fully return to deep work after each interruption. For students, the combined effect of digital design, social comparison, and academic pressure produces a cognitive environment where sustained attention is genuinely difficult — not because the person lacks willpower but because the environment systematically undermines it.",
      },
    },
    {
      "@type": "Question",
      "name": "What mindfulness exercises reduce mental noise?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Five mindfulness exercises specifically reduce mental noise: breath awareness (5 minutes daily of following each breath with precise attention, which directly trains the attentional stability that noise undermines), noting practice (labelling thoughts as 'planning,' 'worrying,' 'judging' without engaging their content, which reduces their cognitive pull), the body scan (systematically attending to physical sensations, which reduces the internal noise of unnoticed physiological tension), open awareness (5 minutes of undirected attention, which specifically restores the directed attention capacity that mental noise depletes), and the pre-task ritual (3 minutes of breath + brain dump before any study session, which clears the cognitive queue before demanding work begins).",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const CYAN   = '#2A7A9A';
const CPALE  = '#E9F5FA';
const CBORD  = 'rgba(42,122,154,0.22)';

// ── Noise source data ──────────────────────────────────────────────────────────
const NOISE_SOURCES = [
  {
    key:    'digital',
    icon:   '📱',
    label:  'Digital — phone, social media, notifications',
    desc:   'Constant checking, scrolling, notification responses',
    color:  '#8B2635',
    bg:     '#FBF0F1',
    science: 'Research by Ward et al. at UT Austin shows cognitive capacity is measurably reduced by the mere presence of a smartphone on a desk — even silent, face-down, unused. The anticipatory cognitive load of potential incoming information consumes working memory independently of active use.',
    strategies: [
      'Phone to another room during every study session — physical separation, not just silencing',
      'Three designated daily check-in windows (15 minutes each) — all platforms closed outside these',
      'Permanent notification off for all non-essential apps — 85% of notifications can be turned off without missing anything important',
      'App audit: delete the three apps that produce most noise for one week, assess, make permanent decisions',
    ],
    mindfulness_link: 'The three-breath pause before every phone unlock converts habitual, automatic checking into deliberate access. Over two weeks, this single practice reduces daily check frequency by approximately 40%.',
    exercise: 'noting',
  },
  {
    key:    'internal_worry',
    icon:   '😰',
    label:  'Internal — worry, rumination, planning thoughts',
    desc:   'Mind running future scenarios, past replays, or constant to-do lists',
    color:  CYAN,
    bg:     CPALE,
    science: 'Research by Killingsworth and Gilbert at Harvard documents that humans spend approximately 47% of waking hours thinking about something other than what they are doing — and this mind-wandering is associated with lower happiness than any other cognitive activity, including unpleasant activities done with full attention.',
    strategies: [
      'Brain dump before every study session: write every thought in 3 minutes before opening any material',
      'Parking lot notebook: when any off-task thought arrives during study, write it in one phrase and return immediately',
      'Dedicated worry window: 15 minutes daily where worry is actively engaged — eliminating the need for it to run as background process',
      'The noting technique: label each off-task thought type (planning, worrying, comparing) without engaging its content',
    ],
    mindfulness_link: 'Noting practice — labelling thoughts by type as they arrive — directly reduces their pull by activating the prefrontal labelling network that modulates the DMN\'s automatic generation.',
    exercise: 'noting',
  },
  {
    key:    'environment',
    icon:   '🏠',
    label:  'Environmental — people, noise, study space',
    desc:   'External distractions from the physical environment',
    color:  '#2D6B45',
    bg:     '#E8F4EE',
    science: 'Research on environmental psychology (Kaplan) shows that certain environments support directed attention while others deplete it. The study environment specifically shapes cognitive performance: visual clutter reduces working memory availability, background speech (vs instrumental music or silence) specifically disrupts reading comprehension, and social interruptions produce the largest recovery costs of any common distraction type.',
    strategies: [
      'Single-surface study space: everything except current task materials off the desk before beginning',
      'Consistent study location: the environmental cue of the same desk produces attentional readiness through conditioned association after 2-3 weeks',
      'Headphones signal: wearing headphones (even without music) reduces social interruptions significantly',
      'Background noise calibration: silence or instrumental music for analytical tasks; nature sounds for reading and writing',
    ],
    mindfulness_link: 'Environmental mindfulness: before sitting down to study, spend 60 seconds deliberately arranging the space. The physical arrangement act is itself a transition ritual that signals the cognitive shift from scattered to focused.',
    exercise: 'breath_anchor',
  },
  {
    key:    'emotional',
    icon:   '💔',
    label:  'Emotional — stress, relationships, mood',
    desc:   'Emotional content occupying cognitive bandwidth during study',
    color:  '#5B3A8B',
    bg:     '#F2EEF9',
    science: 'Research by Jha and colleagues on emotional content and working memory shows that unresolved emotional material produces "cognitive capture" — involuntary attentional pulls that consume working memory resources independently of whether the emotional content is being actively processed. The study session is inefficient not because of poor concentration but because working memory is partially occupied by emotional holding.',
    strategies: [
      'Emotional download before study: 5 minutes of uncensored writing about any emotional content present, closing with "I acknowledge this and can return to it later"',
      'The transition practice: 3 physiological sighs between any emotional experience and the start of study',
      'Emotion labelling: name the specific emotion (not "stressed" but "anxious about the conversation last night") — reduces cognitive capture through the labelling mechanism',
      'End-of-study emotional close: brief check-in with what emotional content remains and park it explicitly',
    ],
    mindfulness_link: 'Mindful emotion labelling — "I notice I am feeling ___" — is both an emotional awareness practice and a cognitive load reduction technique, freeing the working memory that unnamed emotional content was occupying.',
    exercise: 'body_scan',
  },
  {
    key:    'cognitive_overload',
    icon:   '🧠',
    label:  'Cognitive — too much to hold simultaneously',
    desc:   'Multiple subjects, deadlines, tasks competing for mental space',
    color:  '#C07800',
    bg:     '#FFF8E1',
    science: 'Cognitive load theory (Sweller) shows working memory holds approximately 7 items (±2) simultaneously. When the mental task list exceeds this, items compete for cognitive space, producing the characteristic fog and paralysis of academic overload. The specific sensation is the mind jumping between items without completing any because there is insufficient working memory to hold the whole task while executing any of its parts.',
    strategies: [
      'Weekly review (30 min per week): empty everything into written form, clarify what each item needs, identify next actions — prevents accumulation to fog levels',
      'Single-task block: close everything and work on exactly one thing at a time — eliminating the cognitive cost of switching',
      'Context separation: subject-specific notebooks, files, and work areas — prevents one subject\'s cognitive frame from contaminating another\'s',
      'The two-minute rule: anything requiring under two minutes, do immediately rather than holding it in the mental queue',
    ],
    mindfulness_link: 'The single-task mindfulness practice — bringing complete present-moment attention to exactly one task, returning every time attention drifts — is both a mindfulness exercise and a cognitive load management technique.',
    exercise: 'single_task_mindfulness',
  },
];

const WORST_TIME = [
  { key: 'morning',    icon: '🌅', label: 'Morning — before I have started studying' },
  { key: 'mid_study',  icon: '📚', label: 'Mid-session — once I have started but cannot stay focused' },
  { key: 'evening',    icon: '🌙', label: 'Evening — winding down but mind still racing' },
  { key: 'all_day',    icon: '⚡', label: 'All day — constant background noise regardless of task' },
];

const FOCUS_GOAL = [
  { key: 'study_quality',  icon: '📖', label: 'Better quality study sessions' },
  { key: 'less_phone',     icon: '📵', label: 'Less time lost to digital distraction' },
  { key: 'calm_mind',      icon: '🌿', label: 'A quieter, calmer internal state' },
  { key: 'productivity',   icon: '⚡', label: 'More done in less time' },
];

// ── Mindfulness exercises ──────────────────────────────────────────────────────
const MINDFULNESS_EXERCISES = {
  noting: {
    id: 'noting', name: 'The Noting Practice', icon: '📌', color: '#2D5A8A', bg: '#EEF3FB',
    time: '5 min', timeSecs: 300,
    desc: 'Label each off-task thought by type — without engaging its content.',
    science: 'The noting technique activates the prefrontal labelling network (Lieberman, UCLA) which modulates the DMN\'s automatic thought generation. Labelling the type of thought (not engaging its content) reduces its attentional pull within the session.',
    steps: [
      'Sit comfortably. Close your eyes. Take three slow breaths.',
      'Allow thoughts to arise naturally — do not try to clear the mind.',
      'When any thought arrives: label it with one word — "planning," "worrying," "judging," "comparing," "remembering"',
      'After labelling, return attention to the breath without engaging the thought\'s content',
      'The labelling is the practice — every return from a thought is a successful repetition',
    ],
    phases: [
      { name: 'Settle', secs: 30, note: 'Close your eyes. Three slow breaths. Let the body arrive here.' },
      { name: 'Observe', secs: 200, note: 'Allow thoughts to arise. Each time a thought appears: label it with one word ("planning," "worrying," "comparing"). Then return to the breath. No judgment for noticing.' },
      { name: 'Close', secs: 70, note: 'Gently open your eyes. Notice: the thoughts are still there, but they are smaller. The labelling takes their urgency away.' },
    ],
    tip: 'After two weeks of daily noting practice, off-task thoughts during study become noticeable earlier and feel less compulsive — the habit of labelling transfers from formal practice to the study session itself.',
  },
  breath_anchor: {
    id: 'breath_anchor', name: 'Breath Anchor Practice', icon: '⚓', color: CYAN, bg: CPALE,
    time: '5 min', timeSecs: 300,
    desc: 'Follow each breath with precise attention to build the attentional stability that mental noise undermines.',
    science: 'Research by Mrazek at UCSB shows two weeks of daily breath awareness practice significantly reduces mind-wandering during subsequent tasks and improves working memory capacity through the reduction of the ruminative content that was occupying it.',
    steps: [
      'Sit upright — alert but not tense. Close your eyes.',
      'Bring attention to the physical sensation of breathing — at the nostrils, chest, or belly',
      'Follow one complete breath from its very start to its very end',
      'When attention drifts to any thought (it will): note "thinking" and return to the breath',
      'Every return is a successful repetition — the number of distractions is irrelevant',
    ],
    phases: [
      { name: 'Arrive', secs: 30, note: 'Sit upright. Close eyes. Feel the body settle. Natural breathing.' },
      { name: 'Follow', secs: 210, note: 'Attend to the breath at the nostrils — the coolness of the inhale, the warmth of the exhale. When thinking arises: "thinking." Return. Every return is the practice.' },
      { name: 'Expand', secs: 60, note: 'Broaden awareness to the whole body breathing. Feel the rhythm of breath as a whole-body experience. Gently open your eyes.' },
    ],
    tip: 'The specific instruction "follow each breath from its very start to its very end" produces better focus results than "follow the breath generally" — the precision requirement trains the sustained attentional quality that mental noise undermines.',
  },
  body_scan: {
    id: 'body_scan', name: 'Noise-Clearing Body Scan', icon: '🧘', color: '#5B3A8B', bg: '#F2EEF9',
    time: '5 min', timeSecs: 300,
    desc: 'Systematically attend to physical sensations to release the internal noise of unnoticed physiological tension.',
    science: 'Unnoticed physiological tension — jaw clenching, shoulder tension, shallow breathing — maintains the sympathetic activation that generates mental noise. Research on body-mind feedback shows that releasing physical tension through mindful attention directly reduces cortisol and the cognitive arousal that produces mental distraction.',
    steps: [
      'Lie down or sit with eyes closed. Take three breaths.',
      'Starting at the top of the head: bring attention slowly downward',
      'At each region — forehead, jaw, neck, shoulders, chest, belly, hands, legs — simply notice',
      'At areas of obvious tension: breathe toward them on the inhale; on the exhale, invite a slight softening',
      'Complete the scan at the feet. The mental noise was partly physical — it has partially released',
    ],
    phases: [
      { name: 'Head & jaw',       secs: 45,  note: 'Forehead — is there tension here? Jaw — are the teeth touching? Shoulders — are they drawn up? Just notice. On the exhale, invite softening.' },
      { name: 'Chest & belly',    secs: 60,  note: 'Chest — is the breathing shallow? Belly — tight or relaxed? These areas hold the emotional component of mental noise. Breathe toward them.' },
      { name: 'Arms & hands',     secs: 45,  note: 'Arms — any held tension? Hands — open or closed? Let the hands soften and open. Tension held in the hands is often unnoticed stress.' },
      { name: 'Back & legs',      secs: 60,  note: 'Lower back — common tension storage. Thighs, calves, feet. Attend to each. Release is not forced — it follows the noticing.' },
      { name: 'Complete',         secs: 90,  note: 'Take three slow breaths. The mental noise was partly the body — it has partially cleared. Open your eyes slowly from this slightly quieter place.' },
    ],
    tip: 'Students who practise the body scan consistently report that the mental noise of a study day feels less overwhelming when the physical tension component that was amplifying it has been released.',
  },
  single_task_mindfulness: {
    id: 'single_task_mindfulness', name: 'Single-Task Mindfulness', icon: '🎯', color: '#C07800', bg: '#FFF8E1',
    time: '25 min', timeSecs: 1500,
    desc: 'A mindfulness-enhanced Pomodoro — 25 minutes of single-task focus with genuine attentional quality.',
    science: 'Research by Meyer and Kieras on task switching shows multitasking costs up to 40% of productive time through switching costs. Single-task practice eliminates these costs while simultaneously training the sustained attention that reduces mental noise over time.',
    steps: [
      'Before beginning: brain dump (2 min) + three breaths. Write the specific task.',
      'Set timer for 25 minutes. Open only the one task. Close everything else.',
      'When attention drifts: note the distraction in the parking lot notebook in one phrase, return immediately',
      'Do not check the timer. When it sounds: stop deliberately. Note what was accomplished.',
      'Five-minute mindful break (not phone): open awareness or brief walk.',
    ],
    phases: [
      { name: 'Pre-session ritual',  secs: 120, note: 'Brain dump everything in your head — 2 minutes. Then one breath. Write your specific task: "Right now I am ___." Open only that task.' },
      { name: 'Focus session',       secs: 1200, note: 'Work. When a distraction arrives — note it in one word in the notebook, return to the task. You are practising returning, not preventing drifting.' },
      { name: 'Mindful close',       secs: 180, note: 'Session complete. Close materials. Three breaths. What specifically was accomplished? Write one sentence. This close is as important as the session.' },
    ],
    tip: 'The parking lot notebook is the key addition to standard Pomodoro — it makes returning from distractions immediate and frictionless, eliminating the 11-minute recovery time that ignored distractions produce.',
  },
  open_awareness: {
    id: 'open_awareness', name: 'Open Awareness Restoration', icon: '🌿', color: '#2D6B45', bg: '#E8F4EE',
    time: '5 min', timeSecs: 300,
    desc: 'Undirected awareness that specifically restores the directed attention capacity that mental noise depletes.',
    science: 'Kaplan\'s attention restoration theory identifies open, undirected awareness — "soft fascination" — as the specific antidote to directed attention fatigue. Mental noise is partly the exhaustion of directed attention; open awareness is its restoration, distinct from both sleep and active thinking.',
    steps: [
      'Close all materials. Sit or stand comfortably. Close or soften your eyes.',
      'Expand awareness to everything: sounds near and far, body sensations, the quality of air',
      'Do not focus on any single thing — just receive whatever is present',
      'When directed thoughts arise: note "thinking" and return to open receiving',
      'After five minutes: return to study from a measurably fresher baseline',
    ],
    phases: [
      { name: 'Expand', secs: 90,  note: 'Let awareness widen to include everything present — sounds, sensations, light, temperature. Nothing to find, nothing to solve. Just receive.' },
      { name: 'Receive', secs: 150, note: 'Stay in this open receiving. Near sounds, far sounds. Body sensations. The quality of the moment. When thinking pulls: note it and open again.' },
      { name: 'Return', secs: 60,  note: 'Take two slow breaths. Feel the gentle return of directed attention — fresher than before. Open your eyes. Return to the work.' },
    ],
    tip: 'Open awareness is NOT the same as passive phone scrolling — scrolling maintains, even increases, directed attention demands. The open awareness break specifically requires devices to be away.',
  },
};

// ── Audit Results ──────────────────────────────────────────────────────────────
const AUDIT_PLANS = {
  digital: {
    morning: {
      title: 'Digital-Free Morning Foundation',
      plan: 'Your noise is highest before the day has given you a focus anchor. The most effective single change: no phone for the first 30 minutes. Use that window for the 5-minute noting practice, set one task intention, then begin. The phone\'s agenda is always louder than your own — the morning window exists before either one has established dominance.',
      immediate_action: 'Remove social media apps from your phone\'s front page tonight. The extra tap creates the pause that converts automatic checking into deliberate access.',
      exercise: 'noting',
    },
    mid_study: {
      title: 'Mid-Session Digital Boundary',
      plan: 'Digital noise during study is primarily the notification trigger-response cycle. Phone in another room is the structural solution — not silenced, physically absent. For computer study: full-screen the study material (eliminating the visual pull of the taskbar), and use browser extensions that block distracting sites during session windows.',
      immediate_action: 'Move the phone to a different room before your next study session. Every session. This is the highest-impact single change available.',
      exercise: 'single_task_mindfulness',
    },
    evening: {
      title: 'Evening Digital Wind-Down',
      plan: 'Evening digital noise degrades sleep quality and maintains the cognitive arousal that prevents genuine restoration. Digital sunset at 9pm (all non-essential screens off) combined with one analogue activity — reading, journalling, any non-screen creative activity — produces genuine evening restoration that the morning study benefits from.',
      immediate_action: 'Charge your phone outside the bedroom from tonight. This single structural change eliminates night-time checking and morning in-bed use simultaneously.',
      exercise: 'noting',
    },
    all_day: {
      title: 'Structural Digital Boundaries',
      plan: 'All-day digital noise requires structural rather than willpower-based solutions. Three designated check-in windows (morning, midday, evening — 15 minutes each) eliminates continuous availability. Outside these windows, all social and messaging platforms are genuinely inaccessible — apps deleted or locked. The structure eliminates the decision that willpower was failing to make.',
      immediate_action: 'Set up three phone alarms: "Check messages" at 9am, 1pm, and 7pm. Outside these times, social apps are closed. Try for one week.',
      exercise: 'noting',
    },
  },
  internal_worry: {
    morning: {
      title: 'Morning Worry Discharge',
      plan: 'Worry running from the previous evening or night produces morning mental noise before study has even begun. The brain dump — 3 minutes of writing everything in the head before any study material is opened — discharges the queue and frees the working memory for the session. Follow with the noting practice: five minutes of labelling thought types without engaging their content.',
      immediate_action: 'Keep a notebook beside the bed. Before getting up tomorrow: write every thought in your head in 3 minutes. Close the notebook. Then begin the day.',
      exercise: 'noting',
    },
    mid_study: {
      title: 'Mid-Session Worry Management',
      plan: 'Worry thoughts during study are best addressed through the parking lot system — one phrase written, immediately returned to task — rather than engagement or suppression. The noting practice builds the labelling reflex that makes parking lot use automatic. After 2 weeks of daily practice, the label ("worry") arrives before the thought has fully developed its pull.',
      immediate_action: 'Create a designated parking lot: open a small notebook beside your study materials. Every off-task thought gets one phrase written in it. Start in the next study session.',
      exercise: 'noting',
    },
    evening: {
      title: 'Evening Worry Download',
      plan: 'Internal noise in the evening is usually the day\'s unresolved content preparing to disrupt sleep. The worry download — 5 minutes of uncensored writing of every concern, followed by one specific next step for each actionable item — transfers content from active holding to external storage, closing the cognitive loops that would otherwise circulate through the night.',
      immediate_action: 'Write every worry in a notebook tonight before bed. For each: is there a next step? Write it. Close with: "These are noted. I return to them tomorrow." Then the body scan.',
      exercise: 'body_scan',
    },
    all_day: {
      title: 'Dedicated Worry Window',
      plan: 'When worry runs all day, the most effective structural intervention is the dedicated worry window: 15 minutes per day (midday works best) where worry is actively engaged — written out, examined, next steps identified. Outside this window, arriving worry thoughts are labelled ("this is worry-window content") and parked. The structure contains the worry rather than suppressing or feeding it.',
      immediate_action: 'Schedule a 15-minute "worry session" at the same time daily for this week. When worry arrives outside this window: write one phrase in the parking lot and return to the task.',
      exercise: 'noting',
    },
  },
  environment: {
    morning: {
      title: 'Morning Environment Design',
      plan: 'Environmental noise in the morning is often the combined visual and auditory stimulation of the household before your cognitive baseline is established. The pre-study environment ritual — 60 seconds of deliberately arranging the study space before sitting — both clears environmental triggers and signals the attentional transition from scattered morning to focused study.',
      immediate_action: 'Before sitting down to study tomorrow: spend 60 seconds clearing the surface of everything except study materials. The physical clearing is a transition ritual. Then the breath anchor practice.',
      exercise: 'breath_anchor',
    },
    mid_study: {
      title: 'Mid-Session Environment Management',
      plan: 'Mid-session environmental distraction is often the single-surface problem: other subjects\' materials visible and activating competing task representations. Single-subject immersion — physically removing all materials except the current subject — eliminates the visual noise that competes with the current cognitive frame.',
      immediate_action: 'For your next study session: put every subject\'s materials except the current one in a different location. Work from a completely clear surface with only the current task materials present.',
      exercise: 'single_task_mindfulness',
    },
    evening: {
      title: 'Evening Environment Wind-Down',
      plan: 'Evening environmental noise — particularly household sounds and lighting — can maintain the arousal level that prevents genuine restoration. Sound management (consistent background sound, door closed, earplugs for sleep), lighting transition (dimming screens and room lights an hour before sleep), and physical study-space closure (putting away study materials before the evening period) all signal the nervous system that the active period has ended.',
      immediate_action: 'Close all study materials at a specific fixed time tonight — physically put them away. The visual absence of study materials in the evening period produces measurably better pre-sleep restoration.',
      exercise: 'open_awareness',
    },
    all_day: {
      title: 'Environmental Redesign',
      plan: 'When environmental noise is all-day, the primary intervention is consistent study location design: the same desk, same arrangement, same study materials, same background sound. Consistency of environment produces conditioned attentional readiness through associative learning — after 2-3 weeks, sitting at the designated desk triggers focus automatically without requiring willpower to establish it each time.',
      immediate_action: 'Designate one specific location as your study space. Use it for study only — not phone, not casual reading, not anything else. The exclusivity of use is what builds the attentional association.',
      exercise: 'breath_anchor',
    },
  },
  emotional: {
    morning: {
      title: 'Morning Emotional Clear',
      plan: 'Emotional noise in the morning typically carries forward from the previous day\'s unresolved content or from the sleep period\'s anxious processing. The morning emotion check-in — one specific word for how you actually feel before any study begins — catches the emotional noise early enough to address it through the emotional download before it silently degrades the session quality.',
      immediate_action: 'Tomorrow morning before any study: close your eyes, take one breath, name one specific emotion present. Write: "I feel [emotion] today because [brief cause]." Acknowledge it — then begin.',
      exercise: 'body_scan',
    },
    mid_study: {
      title: 'Mid-Session Emotional Interruption',
      plan: 'Emotional noise during study sessions is often triggered by academic content itself — a topic that connects to anxiety about performance, a question that activates self-doubt. The physiological sigh (three times, immediately) followed by the noting practice creates the gap between the emotional trigger and the continuing study that prevents emotional content from taking over the session.',
      immediate_action: 'When any strong emotional feeling arrives during study: stop. Three physiological sighs. Name the emotion in one word. Park it: "This is [emotion], acknowledged, returning to task." Continue.',
      exercise: 'body_scan',
    },
    evening: {
      title: 'Evening Emotional Processing',
      plan: 'Emotional noise in the evening is the day\'s emotional accumulation needing processing before sleep. The five-minute emotional download (uncensored writing) followed by the body scan provides both the externalisation and the physical release that emotional processing requires. This sequence consistently improves sleep quality by reducing the pre-sleep cognitive and physiological arousal that unprocessed emotions maintain.',
      immediate_action: 'Before sleep: write for five minutes about anything emotionally present. Not to solve — to acknowledge. Close with the sentence: "This has been noted." Then body scan.',
      exercise: 'body_scan',
    },
    all_day: {
      title: 'Ongoing Emotional Awareness Practice',
      plan: 'All-day emotional noise usually indicates emotional content that has been accumulating without adequate processing. Daily practices that address this at its root: morning emotion check-in (one word for the emotional weather), midday labelling practice (noting emotion types as they arrive), and evening download (five minutes of writing). Together these prevent accumulation by processing emotions in real time rather than allowing them to build into background noise.',
      immediate_action: 'Start the emotion log: once per day, write one sentence — "Today I felt [specific emotion] when [specific situation]." One sentence, every day. The log reveals patterns that are invisible in individual days.',
      exercise: 'body_scan',
    },
  },
  cognitive_overload: {
    morning: {
      title: 'Morning Cognitive Clear',
      plan: 'Cognitive overload in the morning — the list of everything that needs to happen feeling simultaneously present and urgent — requires the brain dump as the primary morning intervention. Three minutes of writing everything out before any study produces an immediate cognitive load reduction that makes starting possible where it was previously paralysing.',
      immediate_action: 'First five minutes tomorrow: brain dump everything in the head onto paper, uncensored. Then circle ONE item. Begin with that one item only. The list will still be there when it is done.',
      exercise: 'breath_anchor',
    },
    mid_study: {
      title: 'Mid-Session Load Management',
      plan: 'Cognitive overload during sessions is usually the multi-subject mental task list contaminating the current session. Single-task mindfulness — closing everything except the current task and working on it exclusively — eliminates the cognitive switching costs that overload intensifies. The parking lot catches the other subjects\' thoughts without needing to hold them.',
      immediate_action: 'Before your next session: write every subject and task on a single list. Then identify the ONE task for this session. Put the list in a drawer — you can see it is safe there.',
      exercise: 'single_task_mindfulness',
    },
    evening: {
      title: 'Evening Cognitive Closure',
      plan: 'Cognitive overload in the evening is often the unfinished-task list running as background process. The weekly review practice (once per week in the evening, 20-30 minutes) empties the mental inbox completely into written form, clarifies what each item needs, and identifies next actions — preventing the nightly accumulation of incomplete tasks that maintains cognitive noise.',
      immediate_action: 'Tonight: write every incomplete task or unresolved item in 10 minutes. For each: what is the ONE next step? Write it. This "closes the loops" that were generating evening noise.',
      exercise: 'open_awareness',
    },
    all_day: {
      title: 'Structural Cognitive Load Management',
      plan: 'All-day cognitive overload requires the weekly review as the primary structural intervention — a consistent weekly practice of complete externalisation, clarification, and next-action identification that prevents cognitive load from accumulating to noise levels. Combined with the single-task daily practice and the context-separation approach (subject-specific workspaces), the cognitive environment is managed rather than endured.',
      immediate_action: 'Schedule 30 minutes this weekend for the weekly review. Empty the head: every project, every obligation, every concern. Clarify each. Write one next step for each. This practice, done consistently, produces more mental quiet than any other available technique.',
      exercise: 'single_task_mindfulness',
    },
  },
};

// ── Timer Component ────────────────────────────────────────────────────────────
function ExerciseTimer({ exercise, onClose }) {
  const [phase,    setPhase]    = useState('intro');
  const [phIdx,    setPhIdx]    = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running,  setRunning]  = useState(false);
  const [done,     setDone]     = useState(false);
  const intRef = useRef(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";
  const phases = exercise.phases;
  const curPh  = phases[phIdx];

  useEffect(() => {
    if (!running) return;
    intRef.current = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          clearInterval(intRef.current);
          setRunning(false);
          const next = phIdx + 1;
          if (next >= phases.length) { setDone(true); return 0; }
          setPhIdx(next);
          setTimeLeft(phases[next].secs);
          setRunning(true);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, [running, phIdx]);

  const CIRC = 2 * Math.PI * 42;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div style={{ background: `${exercise.color}08`, borderRadius: '14px', border: `2px solid ${exercise.color}30`, fontFamily: font, overflow: 'hidden' }}>
      <div style={{ padding: '12px 16px', background: `${exercise.color}15`, borderBottom: `1px solid ${exercise.color}20`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: exercise.color }}>{exercise.icon} {exercise.name}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '20px' }}>×</button>
      </div>
      <div style={{ padding: '18px' }}>
        {phase === 'intro' && (
          <>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{exercise.desc}</p>
            <div style={{ background: exercise.bg, borderRadius: '9px', padding: '9px 12px', marginBottom: '10px', border: `1px solid ${exercise.color}20` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: exercise.color, marginBottom: '4px', textTransform: 'uppercase' }}>🔬 Science:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{exercise.science}</p>
            </div>
            <div style={{ marginBottom: '12px' }}>
              {exercise.steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', padding: '4px 0', borderBottom: i < exercise.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: exercise.color, color: 'white', fontSize: '10px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>{i + 1}</div>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                </div>
              ))}
            </div>
            <button onClick={() => { setPhase('active'); setPhIdx(0); setTimeLeft(phases[0].secs); setRunning(true); }} style={{ width: '100%', padding: '12px', borderRadius: '9px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Begin {exercise.time}</button>
          </>
        )}
        {phase === 'active' && !done && curPh && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 12px auto' }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke={`${exercise.color}18`} strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={exercise.color} strokeWidth="6"
                  strokeDasharray={CIRC} strokeDashoffset={CIRC * (timeLeft / curPh.secs)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: mins > 0 ? '18px' : '22px', fontWeight: '700', color: exercise.color }}>
                  {mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs}
                </div>
              </div>
            </div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: exercise.color, marginBottom: '4px' }}>{curPh.name}</div>
            <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '8px' }}>
              {phases.map((_, i) => <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i < phIdx ? exercise.color : i === phIdx ? `${exercise.color}60` : 'var(--border)' }} />)}
            </div>
            <div style={{ background: exercise.bg, borderRadius: '9px', padding: '10px 12px', marginBottom: '12px', textAlign: 'left', minHeight: '60px', border: `1px solid ${exercise.color}20` }}>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{curPh.note}</p>
            </div>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center' }}>
              {running ? <button onClick={() => { clearInterval(intRef.current); setRunning(false); }} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: '#C07800', color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>⏸</button>
                       : <button onClick={() => setRunning(true)} style={{ padding: '9px 18px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>▶</button>}
              <button onClick={() => { clearInterval(intRef.current); setPhIdx(0); setTimeLeft(phases[0].secs); setRunning(true); setDone(false); }} style={{ padding: '9px 14px', borderRadius: '50px', border: `1.5px solid ${exercise.color}40`, background: 'transparent', color: exercise.color, fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺</button>
            </div>
          </div>
        )}
        {done && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌿</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: exercise.color, marginBottom: '8px' }}>Complete</div>
            <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)' }}>{exercise.tip}</p>
            <div style={{ display: 'flex', gap: '7px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setPhase('active'); setPhIdx(0); setTimeLeft(phases[0].secs); setRunning(true); setDone(false); }} style={{ padding: '9px 16px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>↺ Again</button>
              <button onClick={onClose} style={{ padding: '9px 16px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Audit Builder ──────────────────────────────────────────────────────────────
function MentalNoiseAuditBuilder() {
  const [step,      setStep]      = useState(1);
  const [source,    setSource]    = useState(null);
  const [worstTime, setWorstTime] = useState(null);
  const [focusGoal, setFocusGoal] = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [activeEx,  setActiveEx]  = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const selSource = NOISE_SOURCES.find(s => s.key === source);
  const selTime   = WORST_TIME.find(t => t.key === worstTime);
  const selGoal   = FOCUS_GOAL.find(g => g.key === focusGoal);
  const plan      = source && worstTime ? (AUDIT_PLANS[source]?.[worstTime] || AUDIT_PLANS[source]?.all_day) : null;
  const exercise  = plan ? MINDFULNESS_EXERCISES[plan.exercise] : null;

  const handleReset = () => { setStep(1); setSource(null); setWorstTime(null); setFocusGoal(null); setRevealed(false); setActiveEx(null); };

  const Btn = ({ opt, selected, onSelect }) => {
    const isSel = selected === opt.key;
    return (
      <button onClick={() => onSelect(opt.key)} style={{
        padding: '12px 14px', borderRadius: '11px', border: '2px solid',
        borderColor: isSel ? CYAN : 'var(--border)', background: isSel ? CPALE : 'white',
        cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
        display: 'flex', alignItems: 'flex-start', gap: '10px', width: '100%', marginBottom: '7px',
        boxShadow: isSel ? `0 0 0 2px ${CBORD}` : 'none',
      }}>
        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{opt.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? CYAN : 'var(--ink)', marginBottom: '1px' }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.35 }}>{opt.desc}</div>}
        </div>
        {isSel && <span style={{ marginLeft: 'auto', color: CYAN, fontWeight: '700', flexShrink: 0 }}>✓</span>}
      </button>
    );
  };

  if (activeEx) {
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
        <ExerciseTimer exercise={MINDFULNESS_EXERCISES[activeEx]} onClose={() => setActiveEx(null)} />
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? CYAN : 'var(--border)', transition: 'background 0.3s' }} />)}
      </div>

      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 1 — What is your primary noise source?</p>
          {NOISE_SOURCES.map(s => <Btn key={s.key} opt={s} selected={source} onSelect={setSource} />)}
          <button onClick={() => { if (source) setStep(2); }} disabled={!source} style={{ width: '100%', marginTop: '4px', padding: '14px', borderRadius: '10px', border: 'none', background: source ? `linear-gradient(135deg, ${CYAN}, #4A9AB8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: source ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: source ? `0 6px 18px ${CBORD}` : 'none' }}>Next →</button>
        </>
      )}

      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 2 — When is mental noise worst for you?</p>
          {WORST_TIME.map(t => <Btn key={t.key} opt={t} selected={worstTime} onSelect={setWorstTime} />)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (worstTime) setStep(3); }} disabled={!worstTime} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: worstTime ? `linear-gradient(135deg, ${CYAN}, #4A9AB8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: worstTime ? 'pointer' : 'not-allowed', fontFamily: font }}>Next →</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Step 3 — What is your focus goal?</p>
          {FOCUS_GOAL.map(g => <Btn key={g.key} opt={g} selected={focusGoal} onSelect={setFocusGoal} />)}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (focusGoal) { setStep(4); setRevealed(false); } }} disabled={!focusGoal} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: focusGoal ? `linear-gradient(135deg, ${CYAN}, #4A9AB8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: focusGoal ? 'pointer' : 'not-allowed', fontFamily: font }}>Build My Focus Plan →</button>
          </div>
        </>
      )}

      {step === 4 && plan && selSource && exercise && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>Your Mental Noise Reduction Plan</p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${CYAN}, #4A9AB8)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${CBORD}` }}>🧠 Build My Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>
              <div style={{ background: `linear-gradient(135deg, ${selSource.color}, ${selSource.color}BB)`, borderRadius: '14px', padding: '20px', marginBottom: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '26px', marginBottom: '5px' }}>{selSource.icon} {selGoal?.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>{plan.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)' }}>{selTime?.label} · {selGoal?.label}</div>
              </div>

              {/* Source science */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '3px' }}>🔬 Why This Source Creates Noise</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{selSource.science}</p>
              </div>

              {/* Personalised plan */}
              <div style={{ background: CPALE, border: `2px solid ${CBORD}`, borderRadius: '12px', padding: '13px 15px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: CYAN, marginBottom: '5px', letterSpacing: '1.2px' }}>📋 Your Personalised Plan</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{plan.plan}</p>
              </div>

              {/* Strategies */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '13px 15px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>🛠️ Four Strategies for This Source</div>
                {selSource.strategies.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', padding: '4px 0', borderBottom: i < selSource.strategies.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ color: CYAN, fontWeight: '700', flexShrink: 0 }}>→</span>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{s}</p>
                  </div>
                ))}
              </div>

              {/* Immediate action */}
              <div style={{ background: `${selSource.color}12`, border: `2px solid ${selSource.color}25`, borderRadius: '12px', padding: '12px 14px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: selSource.color, marginBottom: '4px' }}>⚡ Do This Today</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '600' }}>{plan.immediate_action}</p>
              </div>

              {/* Mindfulness exercise */}
              <div style={{ background: exercise.bg, border: `1.5px solid ${exercise.color}30`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: exercise.color, marginBottom: '5px' }}>🧘 Mindfulness Exercise for This Pattern</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '7px' }}>
                  <span style={{ fontSize: '20px' }}>{exercise.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: exercise.color }}>{exercise.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{exercise.time} · {selSource.mindfulness_link.split('.')[0]}.</div>
                  </div>
                </div>
                <button onClick={() => setActiveEx(exercise.id)} style={{ width: '100%', padding: '11px', borderRadius: '9px', border: 'none', background: `linear-gradient(135deg, ${exercise.color}, ${exercise.color}BB)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>▶ Begin Guided Practice</button>
              </div>

              {/* Affirmation */}
              <div style={{ background: CPALE, border: `1.5px dashed ${CBORD}`, borderRadius: '12px', padding: '12px 17px', marginBottom: '14px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '600', color: CYAN, fontStyle: 'italic', lineHeight: 1.55 }}>
                  "The distracted mind is not broken — it is responding to an environment that deserves better design. The practices here are that better design."
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${CBORD}`, color: CYAN, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Audit a different noise source</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ReduceMentalNoise({ navigate, relatedPosts }) {
  const [activeEx, setActiveEx] = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

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
      <p>A study session that should take 90 minutes takes three hours. The material is not too difficult. The student is not unintelligent. But the mind will not stay still — it drifts to the phone notification, to the anxiety about tomorrow's exam, to the conversation that happened at lunch, to the twelve other things on the mental list. <strong>Reducing mental distractions</strong> is not about willpower. It is about understanding the four distinct sources of mental noise and applying the specific intervention each one requires.</p>

      <p>This guide gives you the science, the strategies, and the practices. It also gives you an audit tool that identifies your primary noise source and builds a personalised reduction plan — because the student whose noise is primarily digital needs a different intervention than the student whose noise is primarily emotional, and treating both the same produces results for neither.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning to reduce mental noise and distractions naturally through mindfulness exercises, focus building, and digital boundaries"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="sources">1. The Four Sources of Mental Noise — Understanding the Signal</h3>

      <p><strong>Why diagnosing the source matters.</strong> Mental noise is not one thing — it is a category label for several distinct phenomena that feel similar (scattered, unfocused, unable to concentrate) but have different causes, different neurological mechanisms, and different effective interventions. The student whose noise is primarily digital (phone notifications, social media comparison) needs phone structural boundaries and notification management. The student whose noise is primarily internal (worry, rumination, planning thoughts running continuously) needs the noting practice and the parking lot. The student whose noise is primarily cognitive overload (too many active task threads) needs the brain dump and the single-task practice. Applying a phone-boundary solution to emotional noise, or a noting practice to digital fragmentation, produces partial results at best. This guide treats each source separately.</p>

      {NOISE_SOURCES.map(s => (
        <div key={s.key} style={{ background: 'white', borderRadius: '13px', padding: '18px 20px', marginBottom: '14px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${s.color}`, fontFamily: font }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '22px' }}>{s.icon}</span>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: s.color }}>{s.label}</div>
          </div>
          <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{s.science}</p>
          <div style={{ background: CPALE, borderRadius: '8px', padding: '8px 11px', border: `1px solid ${CBORD}` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: CYAN, marginBottom: '3px' }}>🔗 MINDFULNESS CONNECTION:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{s.mindfulness_link}</p>
          </div>
        </div>
      ))}

      {/* ── Section 2 ── */}
      <h3 id="science">2. The Neuroscience of Distraction</h3>

      <p><strong>The default mode network — the brain's distraction engine.</strong> The default mode network (DMN) is the brain's resting-state network: it activates between tasks, during unfocused moments, and — crucially — whenever directed attention lapses during a task. Research by Raichle at Washington University documents that the DMN specifically generates self-referential content (planning, worrying, daydreaming, social cognition) and mutually competes with the task-positive network (TPN) that directed study requires. Mental noise is, neurologically, the DMN winning the competition for attentional resources — which it is specifically designed to do whenever directed attention weakens. Reducing mental noise is therefore the practice of building the directed attention strength that keeps the TPN active and the DMN appropriately suppressed during study.</p>

      <p><strong>The attention residue problem.</strong> Research by Sophie Leroy at the University of Washington documents "attention residue" — the cognitive phenomenon in which attention from a previous task lingers in working memory after switching to a new task, degrading the quality of the new task's processing. Every task switch — including every phone check, every notification glance, every brief social media look during a study session — leaves attention residue that takes up to 25 minutes to fully clear (Mark, UC Irvine). The student who checks the phone ten times during a two-hour study session never reaches full focus at any point because they are always recovering from the last switch. The solution is not faster switching but fewer switches — and the structural phone removal is the most effective single change available for reducing the switches that produce the most residue.</p>

      <p><strong>The stress-distraction cycle.</strong> High stress produces mental noise through the specific mechanism of hypervigilance: the amygdala's threat-detection system, activated by academic pressure, maintains a state of continuous environmental scanning that specifically increases distractibility. Research by Arnsten at Yale documents that even moderate stress reduces prefrontal cortex control over the amygdala's attentional allocation — producing a state in which the brain is specifically biased toward distracting information. This is the stress-distraction cycle: academic pressure produces stress, stress increases distractibility, distractibility reduces study efficiency, reduced efficiency increases academic pressure. Mindfulness practice breaks this cycle by reducing the baseline amygdala activation that stress produces, restoring the prefrontal control over attentional direction.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="audit">3. Interactive: The Mental Noise Audit and Focus Builder</h3>
      <p>The Audit identifies your primary noise source, when it is worst, and your focus goal — then builds a personalised plan with four specific strategies, an immediate action to try today, and a matched mindfulness exercise with guided timer. You can also launch any mindfulness exercise directly from the plan.</p>

      <MentalNoiseAuditBuilder />

      {/* ── Section 4 ── */}
      <h3 id="focus">4. Six Focus-Building Tips That Reduce Mental Noise</h3>

      <p><strong>Tip 1: Single-surface study — remove everything that is not the current task.</strong> Before every study session, clear the desk surface of everything except the materials for the current subject. Research on visual cognitive load shows that visible objects associated with other tasks activate competing cognitive representations — the other subjects\' textbooks are not just visually present, they are cognitively activating. Physical removal produces cognitive removal. This five-second preparation routine is the simplest and most consistently reliable focus improvement available.</p>

      <p><strong>Tip 2: The pre-study ritual — always the same sequence, always before beginning.</strong> A consistent three-minute pre-study ritual produces the attentional readiness that beginning cold rarely achieves. The sequence: brain dump (write everything currently in the head, 60-90 seconds) → three physiological sighs → write one specific task on paper → open the material to the right section and begin. After two to three weeks of consistent use, the ritual becomes the cue — sitting down to study triggers the focused state automatically because the sequence has built the conditioned association.</p>

      <p><strong>Tip 3: Pomodoro with genuine breaks — not phone breaks.</strong> The standard Pomodoro technique (25-minute sessions, 5-minute breaks) produces focus improvements only when the breaks are genuinely restorative. Phone-based breaks are not: research by Kushlev at the University of Virginia shows smartphone use during breaks maintains or increases cognitive arousal, preventing the restoration that makes the following Pomodoro effective. The break needs to provide soft fascination (Kaplan) — brief mindful walking, brief open awareness, brief physical movement — to genuinely restore directed attention capacity for the next block.</p>

      <p><strong>Tip 4: Consistent study time and location — the conditioned focus cue.</strong> Research on environmental conditioning shows that consistent pairing of location and activity builds strong stimulus-response associations over two to three weeks. The student who studies at the same desk at the same time every day develops an automatic attentional readiness response when they sit at that desk — the environment triggers the cognitive state without requiring deliberate establishment each session. The same effect explains why studying in bed consistently produces worse focus: the bed is too strongly associated with rest to trigger study-readiness.</p>

      <p><strong>Tip 5: The noting habit — transferred from meditation to study sessions.</strong> The noting technique practised in daily meditation gradually transfers to study sessions: the habit of labelling off-task thoughts ("planning," "worrying") becomes available during study as an automatic response to distraction. When this transfer has occurred (typically after two to three weeks of daily noting practice), distraction interruptions during study become brief — one word, one return — rather than extended (10-15 minutes of following the distracting thought). The meditation habit is doing cognitive load reduction work during the study session without being actively practised.</p>

      <p><strong>Tip 6: The two-list system — today's tasks and the parking lot.</strong> The combination of a specific today-task list (maximum five items, all realistic for today) and a running parking lot (anything that arrives during study that is not the current task) eliminates both the overload paralysis of the full mental task list and the distraction loss of letting off-task thoughts run. The today list provides clarity about what is in scope; the parking lot provides a safe place for everything outside scope, preventing the need to either hold it mentally or act on it immediately. Together they manage the cognitive environment of the session rather than leaving it to chance.</p>

      {/* ── Section 5 ── */}
      <h3 id="mindfulness">5. Five Mindfulness Exercises for Clearing Mental Noise</h3>

      {activeEx ? (
        <div style={{ marginBottom: '24px' }}>
          <ExerciseTimer exercise={MINDFULNESS_EXERCISES[activeEx]} onClose={() => setActiveEx(null)} />
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', fontFamily: font }}>
        {Object.values(MINDFULNESS_EXERCISES).map(ex => (
          <div key={ex.id} style={{ background: 'white', borderRadius: '13px', padding: '17px 20px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${ex.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '20px' }}>{ex.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: ex.color }}>{ex.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{ex.time}</div>
              </div>
              <button onClick={() => setActiveEx(activeEx === ex.id ? null : ex.id)} style={{ padding: '8px 14px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${ex.color}, ${ex.color}BB)`, color: 'white', fontWeight: '700', fontSize: '12px', cursor: 'pointer', fontFamily: font, flexShrink: 0 }}>▶ Try It</button>
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{ex.desc}</p>
            <div style={{ background: CPALE, borderRadius: '8px', padding: '8px 11px', border: `1px solid ${CBORD}`, marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: CYAN, marginBottom: '3px' }}>🔬 SCIENCE:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{ex.science}</p>
            </div>
            <div style={{ background: ex.bg, borderRadius: '8px', padding: '8px 11px', border: `1px solid ${ex.color}20` }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: ex.color, marginBottom: '3px' }}>💡 TIP:</div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{ex.tip}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Section 6 ── */}
      <h3 id="digital">6. Digital Distraction — The Structural Solution</h3>

      <p><strong>Why willpower solutions fail for digital distraction.</strong> Digital platforms are specifically engineered to maximise attentional capture through intermittent variable reward (the mechanism underlying slot machine design), social validation loops (notification and like systems), and friction reduction (one tap to any stimulating content). These are precision-designed attentional capture systems built by teams of engineers with unlimited resources, tested against millions of users, and continuously optimised. Resisting them through individual willpower is the wrong level of competition. The effective solution is structural — changing the environment so that the attentional capture triggers are not present, rather than relying on willpower to resist them when they are.</p>

      <p><strong>The hierarchy of structural digital changes — ranked by impact.</strong></p>
      <ul style={{ paddingLeft: '20px', lineHeight: '2.2' }}>
        <li><strong>Phone in another room during study (highest impact):</strong> Physical separation eliminates both active use and the background anticipatory cognitive load that research documents even for physically present silent phones. Zero willpower required once the phone is in the other room.</li>
        <li><strong>Turn off all non-essential notifications permanently:</strong> The notification is designed to create an urgency reflex — the red badge, the sound, the vibration. Removing notifications permanently eliminates the trigger rather than requiring repeated resistance to it. 85% of notifications can be turned off without any cost.</li>
        <li><strong>Three designated check-in windows:</strong> Morning, midday, evening — 15 minutes each. All platforms, all messages, all social media: off outside these windows. The structure eliminates continuous partial attention without requiring complete digital abstinence.</li>
        <li><strong>First and last 30 minutes screen-free:</strong> The morning screen-free window protects the cortisol awakening response from comparison and notification activation. The evening screen-free window protects melatonin production and sleep quality. Both produce compounding benefits: the morning window reduces the day's baseline anxiety; the evening window improves the quality of rest that tomorrow's study depends on.</li>
        <li><strong>App deletion for highest-noise platforms:</strong> Delete rather than mute the three to five apps that produce the most noise. Reinstallation barrier (brief friction) consistently reduces return frequency compared to mere silencing. Use for one week and assess the measured change in study session quality and subjective distraction level before making permanent decisions.</li>
      </ul>

      <p><strong>The digital minimalism mindset shift.</strong> Research by Cal Newport at Georgetown on digital minimalism documents that the most effective long-term digital relationship is not one of willpower-based restriction but one of intentional design: choosing digital tools and practices that serve clearly defined personal values, using them deliberately at appropriate times, and eliminating the rest. For students, this means asking not "how do I use less social media?" but "what specific value does this platform actually serve in my life, and is the distraction cost worth that value?" The answer for many platforms is either no, or yes — but only during the designated window, not continuously. The intentional design approach produces more sustainable digital boundaries than guilt-based willpower restriction because it is built on clear values rather than ongoing self-denial.</p>

      {/* ── Section 7: FAQs ── */}
      <h3 id="faq">7. Reduce Mental Distractions FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I have ADHD and standard focus advice never seems to work for my type of distraction. Is this guide relevant?</strong><br />
        A: ADHD involves neurological differences in the dopaminergic and noradrenergic systems that regulate attention, and the standard advice ("just concentrate more") is particularly ineffective because it misunderstands the mechanism. That said, several approaches in this guide are specifically documented as beneficial for ADHD-related attention management: the external externalisation practices (brain dump, parking lot, written task lists) work with the ADHD brain's difficulty with working memory maintenance rather than against it; body-based practices (physiological sigh, physical grounding, movement breaks) address the sensory-seeking component of ADHD attention more directly than purely cognitive practices; and environmental design (single-surface study, phone removal, consistent location) reduces the environmental stimulation that competes with ADHD attention more reliably than internal regulatory strategies. If ADHD significantly impairs daily functioning, professional assessment and support (which may include medication) is the most important first step — the practices in this guide are best used as complements to appropriate professional support, not alternatives to it.</p>

        <p><strong>Q: When I try to focus I sometimes feel more anxious rather than less — like the silence creates more mental noise. What should I do?</strong><br />
        A: This is a recognisable experience — the reduction of external stimulation reveals the internal noise that the stimulation was masking. It is not the focus practice making things worse; it is the quieter environment revealing what was already present. Two approaches that help: start with body-based practices (body scan, physical grounding) before any attempt at quiet mental work — the physiological settling reduces the anxiety that the silence revealed. And use background sound rather than silence for the initial weeks of focus building: instrumental music at low volume or nature sounds provide just enough soft stimulation to prevent the sensory deprivation that amplifies internal anxiety, while being non-distracting enough to allow genuine concentration. As the noting and breath anchor practices build over weeks, the internal noise that the silence revealed begins to reduce — and genuine quiet becomes increasingly available.</p>

        <p><strong>Q: My mental noise is mostly about my studies themselves — I cannot stop thinking about what I have not done and what I might fail. How is this different from normal study anxiety?</strong><br />
        A: What you are describing is study-specific rumination — the mental noise produced specifically by the academic environment itself. It differs from ordinary study anxiety in its repetitive, cycling quality: rather than motivating preparation, it loops through "I am not doing enough" and "what if I fail" without producing the productive action that functional anxiety would. The most effective interventions for this specific type: the dedicated worry window (15 daily minutes where the anxiety is fully engaged and written out, preventing it from running as continuous background process); the two-minute evidence practice (two minutes of writing specific evidence of competence and preparation from the past week, which directly counteracts the cognitive distortion of the rumination); and the noting practice (labelling "worrying" without engaging the content, which reduces the cognitive pull without suppression). The goal is not the elimination of academic concern but the conversion of unproductive cycling noise into productive action-oriented concern that stops when the action has been taken.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: CYAN, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "Mental noise is not a character flaw — it is a signal about your environment, your nervous system, and your unmet cognitive needs. Each source has a solution."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)', maxWidth: '500px', margin: '0 auto 28px auto' }}>
          Use the Audit to find your primary noise source and your immediate action. Do the immediate action today — before the next study session, before the next exam, before tonight's revision. The quiet you are looking for is one structural change away.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: CYAN, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${CBORD}` }}
          >
            Find Your Focus in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: CYAN, border: `2px solid ${CYAN}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share What Reduces Your Noise
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from April's Mindfulness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mental-clarity-mindfulness',      '→ How to Build Mental Clarity Through Mindfulness'],
            ['/blog/mindfulness-focus-concentration',  '→ Why Mindfulness Improves Focus and Concentration'],
            ['/blog/daily-mindfulness-routine',        '→ Daily Mindfulness Routine for Students and Young Adults'],
            ['/blog/mindfulness-stop-overthinking',    '→ How to Stop Overthinking with Simple Mindfulness Techniques'],
            ['/blog/develop-inner-peace',              '→ How to Develop Inner Peace in a Busy Life'],
            ['/blog/observe-thoughts-mindfully',       '→ How to Observe Your Thoughts Without Judging Them'],
            ['/safe',                                  '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: CYAN, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
