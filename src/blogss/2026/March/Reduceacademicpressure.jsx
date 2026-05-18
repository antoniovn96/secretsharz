import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Reduce Academic Pressure and Expectations",
  excerpt: "Academic pressure is not always coming from outside. Often the most relentless source is internal — the expectations you hold for yourself, the standards you refuse to lower, the identity you have built around performance. Learn where your pressure actually comes from, how to manage both external and self-imposed expectations, and use our Pressure Audit to build a personalised coping plan.",
  category: "Mental Health",
  date: "22-03-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/March/reduce-academic-pressure.jpg",
  tldr: "Academic pressure affects students from two distinct directions — external pressure (family, competition, systems) and internal pressure (self-expectations, perfectionism, identity tied to results). Most pressure-reduction advice addresses only one and ignores the other. This guide covers the sources of both, emotional balance strategies, self-expectation management techniques, and an interactive Pressure Audit that identifies your specific pressure sources and generates a personalised coping plan.",
  toc: [
    { id: "sources",    title: "1. Where Academic Pressure Actually Comes From",                      level: 3 },
    { id: "emotional",  title: "2. Emotional Balance Strategies for Sustained Academic Pressure",     level: 3 },
    { id: "audit",      title: "3. Interactive: The Academic Pressure Audit",                         level: 3 },
    { id: "self-expect",title: "4. Self-Expectation Management — The Pressure You Put on Yourself",  level: 3 },
    { id: "coping",     title: "5. Eight Coping Methods That Actually Reduce Pressure",               level: 3 },
    { id: "faq",        title: "6. Academic Pressure FAQs",                                           level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-22T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "academic pressure students, how to reduce academic pressure, managing academic expectations, student academic pressure coping, self-expectation management students, academic pressure emotional balance, cope with exam pressure",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do students cope with academic pressure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Effective academic pressure coping requires addressing both the external sources (family expectations, competitive environments, high-stakes assessments) and internal ones (perfectionism, identity tied to results, fear of failure). Practical strategies include: reframing results as information rather than verdicts, setting process goals rather than outcome goals, maintaining non-academic activities that protect self-worth independently of performance, using physiological regulation techniques to manage acute anxiety, and having honest conversations with family about the specific form of support that is actually helpful versus the form that amplifies pressure.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I manage academic expectations from parents?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Managing parental academic expectations effectively requires one specific, honest conversation rather than repeated indirect signals that the pressure is affecting you. Frame the conversation around what is functionally happening — 'the current level of pressure is making me study less effectively, not more' — and make a specific request: 'What I need from you is [specific alternative support].' Most parents who apply academic pressure do so from genuine care expressed in a counterproductive way, and they respond to specific, honest, non-accusatory requests. Avoid the conversation when you or they are anxious; choose a calm, neutral moment.",
      },
    },
    {
      "@type": "Question",
      "name": "Is academic pressure normal for students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Some academic pressure is not only normal but functionally useful — it signals that something matters, maintains motivation, and activates the moderate arousal that improves performance (Yerkes-Dodson). Pressure becomes problematic when it is disproportionate to the actual stakes, when it is sustained without adequate recovery, when it is tied to conditional self-worth rather than genuine academic goals, or when it produces avoidance, physical symptoms, or persistent emotional distress that does not resolve with rest.",
      },
    },
  ],
};

// ── Pressure Audit Data ────────────────────────────────────────────────────────
const SAGE3   = '#3A6B4A';
const SPALE3  = '#EBF4EE';
const SBORD3  = 'rgba(58,107,74,0.22)';

const PRESSURE_SOURCES = [
  {
    key:     'family',
    icon:    '🏠',
    label:   'Family expectations',
    desc:    'Parents, relatives, or household environment creating significant performance pressure',
    root:    'Family academic pressure in Indian contexts has a specific structure: it is almost always an expression of love and aspiration delivered through a language that produces anxiety rather than motivation. Parents who experienced educational barriers, who sacrificed significantly for their children\'s opportunities, or who have tied family honour to academic results are not acting from indifference — they are acting from fear for their child\'s future expressed in the only way their own upbringing modelled. Understanding this does not make the pressure less real. It makes it slightly more workable.',
    emotional_tip: 'Separate the emotion from the message. When family pressure arrives, try to hear it as anxiety about your future rather than dissatisfaction with who you are. This reframe does not require agreeing with how it is expressed — it just reduces the personal injury of the interaction enough to respond productively rather than reactively.',
    coping: [
      'Have one specific, calm conversation — not in the middle of exam season, not immediately after a result — about what form of support is actually helpful: "When you ask about my study hours every evening, it increases my anxiety and makes me study less effectively. What helps me is [specific alternative]."',
      'Identify what you actually want and separate it from what you feel pressured toward. Write it privately: "The reason I want to study well is [honest internal reason]." Reading this reconnects you to your own motivation rather than the external pressure\'s demand.',
      'Protect one conversation topic per week with your family that is entirely unrelated to academics — a meal, a film, a shared interest. The relationship is more than the academic dimension, and maintaining that broader relationship reduces the weight that the academic dimension carries.',
    ],
    affirmation: '"Their pressure comes from love with poor aim. I can hold both the care and the boundary."',
  },
  {
    key:     'competition',
    icon:    '🏆',
    label:   'Competitive academic environment',
    desc:    'School, coaching, or peer culture that creates constant comparison and ranking anxiety',
    root:    'Competitive academic environments — coaching institutes, ranked schools, high-achieving peer groups — create a social comparison context that is specifically designed to maintain academic motivation through competitive threat. The problem is that competitive comparison is an inherently unstable motivational foundation: performance relative to others cannot be directly controlled, the data is always incomplete (you see others\' results, not their preparation conditions), and the emotional cost of maintaining vigilant comparison is chronically high cortisol.',
    emotional_tip: 'Notice when you shift from your own assessment of your work to a comparison-based one. The questions "am I ahead of [classmate]?" and "am I learning what I need to?" feel similar but use entirely different cognitive frameworks — one is inherently anxiety-producing and informationally limited, the other is actionable and within your control.',
    coping: [
      'Define your personal success metric explicitly and write it down before each exam or assessment period: "Success for me means [specific, personal, non-comparative standard]." Revisit it when comparison thoughts arise.',
      'Limit post-result comparison conversations to a specific window immediately after results — and genuinely disengage from comparison outside that window. The social comparison in group chats happens continuously; you do not have to participate in all of it.',
      'Track your own longitudinal improvement rather than cross-sectional ranking. "I improved by 12 points this semester" is a data point that competition cannot invalidate. "I ranked 8th" is a data point that is entirely dependent on who else sat the exam.',
    ],
    affirmation: '"I cannot control where others finish. I can control what I learn and how I show up."',
  },
  {
    key:     'perfectionism_p',
    icon:    '🎯',
    label:   'Internal perfectionism',
    desc:    'Self-imposed standards so high that anything less than excellent feels like complete failure',
    root:    'Perfectionism is the most private and most relentless source of academic pressure because it requires no external agent — it operates entirely from inside. Research by Brené Brown identifies perfectionism as a cognitive and emotional shield: the belief that if everything is done perfectly, it cannot be criticised. The shield does not work (imperfection is unavoidable) but the attempt to maintain it produces chronic high pressure that the perfectionist experiences as coming from the work, when it is actually coming from the unreachable standard they are applying to the work.',
    emotional_tip: 'When perfectionism is active, you are not working on the assignment — you are managing the threat of imperfection. The assignment is a vehicle. The real activity is emotional management. Recognising this shifts the intervention: the assignment is fine at 80%; the emotional management of imperfection is the actual work.',
    coping: [
      'Set the "good enough" standard explicitly before starting each task — not after. Write: "This assignment is done when [specific completion criterion, not quality criterion]." The pre-set standard gives you an exit that post-task perfectionism cannot indefinitely defer.',
      'Practise submitting deliberately imperfect work in low-stakes contexts. One assignment per week where you stop at "good enough" and submit without additional refinement. The evidence that the sky does not fall gradually reduces the anxiety that drives the perfectionist cycle.',
      'Track the actual quality difference between your "perfected" and "good enough" submissions. Most students discover the difference is minimal — the effort difference is enormous. The data is more persuasive than the idea.',
    ],
    affirmation: '"Perfect is the enemy of done, and done is what actually gets submitted."',
  },
  {
    key:     'identity',
    icon:    '🪞',
    label:   'Identity tied to academic results',
    desc:    'Your sense of who you are and your worth as a person is largely determined by how you perform academically',
    root:    'When academic performance becomes the primary or sole source of self-worth, every assessment becomes existentially threatening — not just informationally important. This is not vanity or insecurity; it is the predictable outcome of environments that have consistently and powerfully reinforced the message that results determine worth. The family that celebrates academic achievements and responds to poor results with visible distress is not intending to create identity-performance fusion — but the repeated emotional pattern produces it as reliably as explicit instruction would.',
    emotional_tip: 'Notice the specific internal language you use after results: "I got a bad result" (result as information) versus "I am a failure" (result as identity verdict). The shift from information to identity is the moment the pressure becomes disproportionate. You can care deeply about results as information without needing them to define who you are.',
    coping: [
      'Build self-worth anchors outside academics — specific relationships, creative practices, physical skills, personal values — that provide a sense of capability and belonging independent of results. These are not distractions from academic success; they are the buffers that prevent academic setbacks from becoming total identity crises.',
      'After any disappointing result, write three things that are true about you that have nothing to do with this result. Not as consolation — as accurate self-description. The result describes one performance. You are more than one performance.',
      'Track and celebrate evidence of character, effort, and growth rather than only results. A private journal of specific moments where you showed persistence, kindness, creativity, or resilience builds a more durable self-concept than a grade history.',
    ],
    affirmation: '"My results are information about one performance on one day. They are not information about me."',
  },
  {
    key:     'future',
    icon:    '🔮',
    label:   'Fear that results will permanently close futures',
    desc:    'The belief that specific exam outcomes will definitively determine the quality and accessibility of your future',
    root:    'High-stakes examination culture — particularly in the context of JEE, NEET, and board examinations that carry significant pathway implications — makes the belief that one result determines everything structurally plausible. But the actual trajectories of people with diverse academic histories reveal consistently that the determinism of individual results is overstated in almost every case. Alternative pathways, recovery possibilities, and routes to meaningful careers exist across far wider ranges of academic outcomes than the examination culture\'s narrative acknowledges.',
    emotional_tip: 'When the future-closing fear is active, it is running a prediction as though it were a fact. The exam result has not happened yet, and even if it happens as feared, the consequence chain that follows it is not as inevitable as the fear insists. "If this happens, then what?" — following the realistic chain honestly — almost always reveals more optionality than the fear acknowledges.',
    coping: [
      'Research the actual career paths of people in the field you want to enter. Their academic trajectories are almost never as linear and as pristine as the examination culture narrative implies. Finding real diversity in the paths of people you respect de-catastrophises the specific result you fear.',
      'Write the "worst realistic outcome" scenario explicitly. Not the catastrophic fantasy — the realistic worst case. Then write what you would actually do in that scenario. The existence of a plausible next step, even in the worst case, reduces the all-or-nothing terror.',
      'Separate the present work from the future anxiety: "Right now my job is to prepare as well as I can. The result will be what it will be, and I will respond to it when it arrives." Present-focus is not denial — it is the only space where useful action exists.',
    ],
    affirmation: '"One result is one data point. My trajectory is the whole graph, and it is still being written."',
  },
];

const PRESSURE_INTENSITY = [
  { key: 'manageable', icon: '🟡', label: 'Present but manageable most of the time' },
  { key: 'significant',icon: '🟠', label: 'Significantly affecting my wellbeing and performance' },
  { key: 'overwhelming',icon: '🔴', label: 'Overwhelming — affecting daily functioning' },
];

const INTENSITY_CONTEXT = {
  manageable:  'Your pressure is at a level where the strategies below will help you maintain balance and prevent escalation during peak periods.',
  significant: 'At this level, the pressure is actively costing you — in performance, wellbeing, or both. The strategies below address the specific source you identified and are calibrated to meaningful change, not just maintenance.',
  overwhelming: 'At overwhelming intensity, these strategies are important starting points. Please also consider speaking with a counsellor or trusted adult — at this level, support from another person produces faster and more durable relief than self-help strategies alone.',
};

const SUPPORT_NEEDED = [
  { key: 'conversation', icon: '💬', label: 'A script for talking to my family about pressure' },
  { key: 'reframe',      icon: '🔭', label: 'A way to think about results differently' },
  { key: 'boundaries',   icon: '🛡️', label: 'How to protect myself from comparison culture' },
  { key: 'routine',      icon: '📅', label: 'A daily routine that builds in pressure relief' },
];

const SUPPORT_PLANS = {
  conversation: {
    title: 'The Pressure Conversation Script',
    content: [
      { step: 'Choose the right moment', detail: 'Not during exam season, not immediately after a result, not when either of you is stressed. A calm evening during an ordinary week. The timing of this conversation determines 50% of how it lands.' },
      { step: 'Open with honesty, not accusation', detail: '"I want to talk about something that is affecting my studying. I have been feeling a lot of pressure, and I want to tell you honestly what it is doing to me." Not "you are putting too much pressure on me" — that triggers defensiveness. "I am experiencing pressure" is both honest and less accusatory.' },
      { step: 'Name the specific impact', detail: '"When [specific behaviour — e.g. you ask about my study hours every evening / you mention the results of other students], I feel [specific feeling], and it makes me [specific effect on studying]. I want to study well. This is making it harder."' },
      { step: 'Make a specific request', detail: '"What I need from you right now is [specific request]. Would that be possible?" The more specific the request, the more achievable it is. "Give me space" is too vague. "Check in with me about studying once a week rather than daily" is specific.' },
      { step: 'Acknowledge their care', detail: '"I know you want the best for me. That means a lot. And this is the specific thing that would actually help most right now." Ending with acknowledgment of their care usually closes the conversation with connection rather than conflict.' },
    ],
  },
  reframe: {
    title: 'The Results Reframe System',
    content: [
      { step: 'The information vs verdict distinction', detail: 'A result is information about what you could demonstrate under specific conditions on a specific day. It is not a verdict on your intelligence, your worth, or your future. When a result arrives, the first question is: "What does this tell me that is useful for what comes next?" — not "what does this say about me?"' },
      { step: 'The trajectory vs snapshot distinction', detail: 'Any single result is a snapshot of one moment. Your academic trajectory — the direction and pace of your learning over time — is the actual meaningful data. One disappointing snapshot does not change a positive trajectory; one excellent snapshot does not guarantee a positive trajectory. Focus on the trend, not the point.' },
      { step: 'The comparison correction', detail: 'When comparing your result to others\', apply the correction: you are comparing your complete, context-inclusive result to a data point stripped of all context. You know your preparation conditions, your health, your family situation, your anxiety level. You know none of these things for the other person. The comparison is informationally worthless.' },
      { step: 'The language shift', detail: 'From: "I failed" to "I haven\'t passed this yet." From: "I am bad at this" to "I haven\'t learned this method yet." From: "This is a disaster" to "This is a setback with information in it." The language shift is not positivity — it is accuracy.' },
    ],
  },
  boundaries: {
    title: 'Protection from Comparison Culture',
    content: [
      { step: 'The 30-minute rule', detail: 'After any exam or result, give yourself 30 minutes before engaging with any comparison — social media, group chats, peer conversations. Use that 30 minutes to form your own assessment of your performance independently. Your initial, uncontaminated assessment is the most honest one you will have.' },
      { step: 'The no-post-mortem agreement', detail: 'Before exams, propose a group "no detailed answer comparison immediately after" agreement. Frame it as mutual benefit: "I find it makes me more anxious and I know I\'m not alone — can we agree to wait at least an hour?" Most students secretly feel the same way.' },
      { step: 'The social media audit', detail: 'During exam periods, audit which accounts or groups consistently produce comparison anxiety and mute or temporarily unfollow them. This is not avoidance of reality — it is accurate information management. The comparison data social media provides is systematically distorted and you are not required to consume it.' },
      { step: 'Your personal performance frame', detail: 'Write your personal success criterion for this exam period: "Success means [specific, personal, non-comparative standard]." Pin it where you will see it. When comparison thoughts arise, redirect to this criterion. It is the only one that contains actionable information.' },
    ],
  },
  routine: {
    title: 'The Daily Pressure Relief Routine',
    content: [
      { step: 'Morning: The pressure-free 15 minutes', detail: 'No academic content for the first 15 minutes of your day. Light, water, physical movement. The first cognitive input of the day sets the emotional tone for the hour that follows. Starting with academic anxiety activates the pressure response before the day has properly begun.' },
      { step: 'During study: The completion unit and shutdown', detail: 'Define a specific, achievable completion unit for each session before starting. When it is done, the session is done — regardless of how much more could theoretically be covered. The completion unit gives you genuine permission to stop, which reduces the chronic pressure of never feeling done enough.' },
      { step: 'Evening: The pressure valve', detail: 'Five minutes of evening writing: "One thing that went okay today, one thing I am carrying that I want to set down, one thing I am grateful is not the exam." This brief externalisation reduces the pressure buildup that accumulates across the day and prevents it from carrying directly into the night.' },
      { step: 'Weekly: The genuine rest day', detail: 'One full day per week with no academic activity and no academic guilt. Not earned through achieving a sufficient standard — scheduled and non-negotiable. Research consistently shows that students who protect a weekly rest day maintain both better academic performance and better wellbeing through intensive periods than those who study seven days at declining intensity.' },
    ],
  },
};

// ── Audit Component ────────────────────────────────────────────────────────────
function PressureAudit() {
  const [step,       setStep]       = useState(1);
  const [source,     setSource]     = useState(null);
  const [intensity,  setIntensity]  = useState(null);
  const [support,    setSupport]    = useState(null);
  const [revealed,   setRevealed]   = useState(false);
  const [openCope,   setOpenCope]   = useState(null);
  const [openSupp,   setOpenSupp]   = useState(null);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selSrc  = PRESSURE_SOURCES.find(p => p.key === source);
  const selInt  = PRESSURE_INTENSITY.find(i => i.key === intensity);
  const selSup  = SUPPORT_NEEDED.find(s => s.key === support);
  const suppPlan= support ? SUPPORT_PLANS[support] : null;

  const handleReset = () => { setStep(1); setSource(null); setIntensity(null); setSupport(null); setRevealed(false); setOpenCope(null); setOpenSupp(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? SAGE3 : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — pressure source */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — Where is your academic pressure coming from most?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the primary source — the one that contributes most to what you feel.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {PRESSURE_SOURCES.map(ps => {
              const isSel = source === ps.key;
              return (
                <button key={ps.key} onClick={() => setSource(ps.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SAGE3 : 'var(--border)', background: isSel ? SPALE3 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${SBORD3}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{ps.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? SAGE3 : 'var(--ink)', marginBottom: '2px' }}>{ps.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{ps.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (source) setStep(2); }} disabled={!source} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: source ? `linear-gradient(135deg, ${SAGE3}, #52956A)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: source ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: source ? `0 6px 18px ${SBORD3}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 — intensity */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How intense is this pressure right now?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {PRESSURE_INTENSITY.map(pi => {
              const isSel = intensity === pi.key;
              return (
                <button key={pi.key} onClick={() => setIntensity(pi.key)} style={{
                  padding: '14px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SAGE3 : 'var(--border)', background: isSel ? SPALE3 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 2px ${SBORD3}` : 'none',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{pi.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? SAGE3 : 'var(--ink)' }}>{pi.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (intensity) setStep(3); }} disabled={!intensity} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: intensity ? `linear-gradient(135deg, ${SAGE3}, #52956A)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: intensity ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 — support needed */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — What support do you most need right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the one that feels most useful for where you are today.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {SUPPORT_NEEDED.map(sn => {
              const isSel = support === sn.key;
              return (
                <button key={sn.key} onClick={() => setSupport(sn.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? SAGE3 : 'var(--border)', background: isSel ? SPALE3 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '13px',
                  boxShadow: isSel ? `0 0 0 2px ${SBORD3}` : 'none',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{sn.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? SAGE3 : 'var(--ink)' }}>{sn.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (support) { setStep(4); setRevealed(false); } }} disabled={!support} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: support ? `linear-gradient(135deg, ${SAGE3}, #52956A)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: support ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Pressure Plan →</button>
          </div>
        </>
      )}

      {/* STEP 4 — results */}
      {step === 4 && selSrc && selInt && selSup && suppPlan && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Your Academic Pressure Coping Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${SAGE3}, #52956A)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${SBORD3}`,
              }}>🌿 Reveal My Coping Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${SAGE3}, #52956A)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{selSrc.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  {selSrc.label}
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.18)', borderRadius: '20px', padding: '4px 12px', marginTop: '4px' }}>
                  <span>{selInt.icon}</span>
                  <span style={{ fontSize: '12px', color: 'white', fontWeight: '700' }}>{selInt.label}</span>
                </div>
              </div>

              {/* Intensity context */}
              <div style={{ background: SPALE3, border: `1.5px solid ${SBORD3}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SAGE3, marginBottom: '5px' }}>📍 At Your Intensity Level</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{INTENSITY_CONTEXT[intensity]}</p>
              </div>

              {/* Pressure root */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '15px 17px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '6px' }}>🔬 Understanding This Pressure</div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selSrc.root}</p>
              </div>

              {/* Emotional tip */}
              <div style={{ background: SPALE3, border: `1.5px solid ${SBORD3}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SAGE3, marginBottom: '5px' }}>💚 Emotional Balance Tip</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{selSrc.emotional_tip}</p>
              </div>

              {/* Three coping strategies — expandable */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SAGE3, marginBottom: '9px' }}>
                  🛠️ Three Coping Strategies for This Pressure Source
                </div>
                {selSrc.coping.map((c, i) => {
                  const isOpen = openCope === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: `1.5px solid ${SBORD3}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenCope(isOpen ? null : i)} style={{
                        width: '100%', padding: '13px 16px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `linear-gradient(135deg, ${SAGE3}, #52956A)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>{i + 1}</div>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: SAGE3, flex: 1 }}>
                          {c.split('.')[0]}.
                        </span>
                        <span style={{ color: SAGE3, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                      </button>
                      {isOpen && (
                        <div style={{ padding: '0 16px 14px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.2s ease' }}>
                          <p style={{ margin: '12px 0 0 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{c}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Support plan — expandable */}
              <div style={{ background: 'white', border: `2px solid ${SBORD3}`, borderRadius: '12px', overflow: 'hidden', marginBottom: '12px', borderLeft: `4px solid ${SAGE3}` }}>
                <button onClick={() => setOpenSupp(o => !o)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: font, textAlign: 'left' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: SAGE3 }}>{selSup.icon} {suppPlan.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '1px' }}>Your chosen support plan — tap to expand</div>
                  </div>
                  <span style={{ color: SAGE3, fontSize: '14px', flexShrink: 0, marginLeft: '10px' }}>{openSupp ? '▲' : '▼'}</span>
                </button>
                {openSupp && (
                  <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border)', animation: 'floatUp 0.25s ease' }}>
                    {suppPlan.content.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '14px', padding: '13px 0', borderBottom: i < suppPlan.content.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg, ${SAGE3}, #52956A)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>{i + 1}</div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: SAGE3, marginBottom: '4px' }}>{item.step}</div>
                          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Affirmation */}
              <div style={{ background: SPALE3, border: `1.5px dashed ${SBORD3}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: SAGE3, marginBottom: '7px' }}>✨ Something to Hold</div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: SAGE3, fontStyle: 'italic', lineHeight: 1.55 }}>
                  {selSrc.affirmation}
                </p>
              </div>

              {intensity === 'overwhelming' && (
                <div style={{ background: '#FEF3C7', border: '2px solid rgba(192,120,0,0.35)', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#B45309', marginBottom: '6px' }}>⚠️ A Direct Note</div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#92400E', lineHeight: 1.7 }}>
                    At overwhelming intensity, please reach out today — to a counsellor, a trusted adult, or a support service. These strategies are genuine first steps, and they are significantly more effective alongside personal support than alone.
                  </p>
                </div>
              )}

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${SBORD3}`, color: SAGE3, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Audit a different pressure source</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function ReduceAcademicPressure({ navigate, relatedPosts }) {
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
      <p><strong>Academic pressure</strong> is one of the most universal experiences in student life, and one of the most poorly understood. Most conversations about it focus exclusively on external sources — demanding parents, competitive systems, high-stakes examinations — when many of the most significant and most relentless contributors are internal. The standards a student holds for themselves, the identity built around performance, the catastrophic narratives about what a bad result would mean — these can exert as much or more pressure as any external force, and they follow the student into every study session, every exam hall, every moment of relative quiet.</p>

      <p>Reducing academic pressure requires understanding both sources — external and internal — and having specific, targeted strategies for each. The goal is not to care less about academic outcomes. It is to build the psychological structure that allows you to pursue them without being consumed by the pressure of pursuing them.</p>

      <img
        src={meta.imgUrl}
        alt="Student managing academic pressure and expectations — emotional balance strategies, self-expectation management, and coping methods"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="sources">1. Where Academic Pressure Actually Comes From</h3>
      <p>Academic pressure has two distinct origin points, and most students experience contributions from both simultaneously — which is part of what makes it feel so inescapable.</p>
      <p><strong>External sources</strong> include family expectations and communication patterns around results, competitive educational environments that make relative performance constantly visible, examination systems that concentrate significant life consequences into narrow scoring windows, peer and social media dynamics that produce constant comparison, and teacher or coaching institute cultures that use pressure as a motivational tool. These sources are real, they are often genuinely demanding, and the student has limited direct control over them.</p>
      <p><strong>Internal sources</strong> include perfectionism (standards set at levels that make failure near-inevitable), identity-performance fusion (the belief that results determine worth), catastrophic future-thinking (the conviction that specific outcomes permanently close futures), fear of failure (the anticipatory suffering before any result that produces studying as avoidance rather than engagement), and the internalisation of external standards that have been absorbed so completely that they feel like the student's own values when they are actually someone else's expectations that have taken residence internally.</p>
      <p>The crucial insight is that addressing only one source while ignoring the other produces incomplete relief. A student who has a successful conversation with their parents about reducing pressure will still carry the internal perfectionism that demands 95% when 75% is objectively sufficient. A student who has done significant work on their perfectionism and self-expectations may still be acutely affected by a competitive peer group environment. Both sources require targeted attention.</p>
      <p>Research by psychologist Carol Dweck on fixed vs growth mindsets identifies one of the most important internal pressure mechanisms: the belief that ability is fixed produces a specific vulnerability where every assessment is experienced as a test of fixed intelligence rather than a measurement of variable preparation and approach. This fixed-ability belief system converts academic difficulty into existential threat — and it is learned from environments that reward results rather than process, which describes most high-achieving academic contexts. Identifying and consciously working against this belief system is one of the most durable pressure-reduction interventions available.</p>

      {/* ── Section 2 ── */}
      <h3 id="emotional">2. Emotional Balance Strategies for Sustained Academic Pressure</h3>
      <p><strong>Anchor your self-worth to something broader than results.</strong> The most fundamental emotional balance strategy under sustained academic pressure is the deliberate cultivation of self-worth sources that are independent of academic performance. This is not about caring less about results — it is about ensuring that your sense of who you are and whether you are fundamentally okay is not exclusively determined by a number on a paper. Specific relationships in which you are cared for regardless of academic performance, creative or physical practices where your competence and effort produce non-assessed satisfaction, and personal values that you live out through actions rather than achievements — these are the anchors that prevent disappointing results from producing total identity collapse.</p>
      <p><strong>Separate process success from outcome success.</strong> Research on self-determination theory by Deci and Ryan shows that intrinsic motivation — sustained by autonomy, mastery, and connection to meaningful purpose — is significantly more psychologically healthy and more academically effective than extrinsic motivation driven by pressure and fear. Emotionally, this translates to measuring success at the process level ("did I study with genuine focus and good method today?") rather than exclusively at the outcome level ("did I get the result I wanted?"). The process is within your control. The outcome is influenced by your process but not fully determined by it — examination conditions, topic selection, comparison norms, and elements of luck all contribute. Holding yourself accountable only for the part you can control produces a more emotionally stable relationship with academic pressure.</p>
      <p><strong>Build in genuine transitions between academic and non-academic time.</strong> Emotional balance under sustained pressure requires that the non-academic time in your day is actually non-academic — not just physically away from the desk while still mentally occupied by studying. The practice of a specific shutdown ritual (closing the notebook deliberately, writing tomorrow's two tasks, doing one physical action that signals the transition) creates the cognitive disengagement that makes rest actually restorative rather than guilty and anxious. Without these transitions, academic pressure becomes a constant ambient state rather than a specific, bounded experience that can be worked with and managed.</p>
      <p><strong>Name what you are feeling with precision.</strong> Research on affect labelling by Ethan Kross at the University of Michigan shows that naming an emotional state specifically — "I feel terrified that this result will disappoint my parents" — reduces its intensity measurably compared to vague awareness of negative feeling. The specificity is both the intervention and the starting point for addressing the specific source: a generalised sense of academic pressure is difficult to address; the specific fear of parental disappointment can be worked with through specific conversation, reframing, and boundary-setting strategies.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="audit">3. Interactive: The Academic Pressure Audit</h3>
      <p>The Audit identifies your primary pressure source, your current intensity level, and the specific type of support most useful to you right now. The result is a personalised coping plan: the specific psychology of your pressure source, an emotional balance tip, three targeted coping strategies, and a detailed support plan (conversation script, results reframe, comparison protection, or daily pressure relief routine) tailored to what you need most.</p>

      <PressureAudit />

      {/* ── Section 4 ── */}
      <h3 id="self-expect">4. Self-Expectation Management — The Pressure You Put on Yourself</h3>
      <p>Self-imposed academic pressure is the dimension most often overlooked in pressure-reduction conversations and the one most students have the most direct ability to influence. It operates through three primary mechanisms: the standards mechanism (what level of performance you expect from yourself), the meaning mechanism (what significance you attach to meeting or failing to meet those standards), and the narrative mechanism (the story you tell yourself about what your performance says about you, your future, and your worth).</p>
      <p><strong>Calibrating the standards.</strong> High standards are not the problem — impossible standards are. The distinction is whether the standard is achievable through realistic effort and preparation (high standard) or whether it is set at a level that makes any shortfall a failure regardless of genuine quality (impossible standard). Most perfectionist self-expectation is of the second type: the standard moves up as performance improves, ensuring that the experience of "failing to meet expectations" is permanent regardless of objective achievement level. Explicitly setting a specific, achievable standard before each assessment — and holding to that standard rather than revising it upward when reached — is the primary calibration practice.</p>
      <p><strong>Separating the meaning.</strong> The same disappointing result can mean "I need to change my study method for this topic" (information, actionable, not devastating) or "I am not capable of this subject" (verdict, not actionable, identity-damaging). Both interpretations are responses to the same data. The difference is in the meaning applied, and the meaning is modifiable. Practising the information interpretation — what specifically does this tell me about what to do differently? — as the default response to disappointing results is a trainable cognitive habit that directly reduces the pressure applied to any future result.</p>
      <p><strong>Editing the narrative.</strong> The internal story a student tells about their academic performance — "I always choke under pressure," "I am not a maths person," "I have never been able to do well in exams" — is both a description and a prediction. It shapes preparation (if I always choke, why prepare thoroughly?) and performance (if I am not a maths person, difficulty confirms the identity rather than signalling the need to change approach). These narratives are not accurate self-knowledge — they are stories assembled from selected data that confirms an existing conclusion. They can be deliberately edited by seeking contradictory evidence: specific instances of exam performance that went well, topics that were difficult and became clearer through effort, moments of academic capability that the current narrative ignores.</p>

      {/* ── Section 5 ── */}
      <h3 id="coping">5. Eight Coping Methods That Actually Reduce Pressure</h3>

      <p><strong>1. Define "enough" before the day begins.</strong> Write the specific completion criterion for today's studying before opening a book: "Today is enough if I complete [specific tasks]." When the criterion is met, the day is done — regardless of how much more could theoretically be covered. The absence of a defined "enough" is one of the primary structural causes of chronic academic pressure, because without it the day never reaches completion and the pressure never resolves.</p>

      <p><strong>2. Use physical movement as a pressure valve — daily.</strong> Physical exercise is the most effective available natural cortisol reduction tool. Twenty to thirty minutes of any vigorous movement — walking, cycling, any sport — produces measurable reductions in the cortisol that sustains the pressure experience and significant increases in the mood-regulating neurotransmitters that counteract it. Students who exercise regularly during high-pressure academic periods consistently report lower felt pressure than those who do not, even under comparable external demand conditions.</p>

      <p><strong>3. Have the difficult conversation — once, specifically, and at the right time.</strong> The most common response to family pressure is to tolerate it and suffer silently — which changes nothing and adds the specific misery of feeling unable to advocate for oneself. One honest, specific, non-accusatory conversation — not during exam season, at a calm neutral time, with a specific request rather than a general complaint — produces more change than years of silent suffering. Prepare what you want to say in advance. Make it about the functional impact on your studying, not the emotional impact on your feelings. Be specific about what would help.</p>

      <p><strong>4. Practise the "next time" response to setbacks.</strong> After any disappointing result, the automatic pressure-amplifying response is extended self-punishment: replaying the failure, catastrophising its implications, questioning fundamental capability. Replace this with a structured "next time" response: what specifically did not go as hoped? What would I do differently in the preparation? What is one specific thing I will change for the next attempt? The "next time" response converts a source of pressure into a source of information, which dramatically reduces its psychological cost.</p>

      <p><strong>5. Limit post-result comparison to a single bounded window.</strong> The most reliable pressure amplifier after any result is comparison — with peers, with past results, with what was hoped for. Contain the comparison to a specific, limited window rather than allowing it to be a continuous background process. After results: one hour of processing, including whatever comparison feels necessary, then a deliberate decision to close it and return to the present. The comparison has been done; continuing to run it beyond the defined window produces additional distress without additional useful information.</p>

      <p><strong>6. Use the "realistic best case" alongside the "realistic worst case."</strong> When catastrophic thinking about academic outcomes is active, it typically runs the worst case without the corresponding realistic best case. Deliberately writing both — what is the realistic worst case if this assessment goes badly, and what is the realistic best case if it goes well — restores the information balance that anxiety distorts. The worst case is almost always more survivable than the anxiety insists; the best case is often underestimated in ways that would be motivating if acknowledged.</p>

      <p><strong>7. Build one pressure-free relationship into your weekly schedule.</strong> Identify one person in your life with whom academic performance is not a topic of regular conversation — where you are valued for something other than results. Protect regular contact with this person across exam season. Research by John Cacioppo shows that the social connection buffer against stress is strongest in relationships where individuals are known and valued for their whole selves rather than their performance on specific metrics. This relationship is not a distraction from academic preparation — it is the stress buffer that makes preparation sustainable.</p>

      <p><strong>8. Separate who you are from what you produce.</strong> Write the answer to "Who am I?" without referencing anything academic — no grades, no subjects, no future career. What remains is more accurate and more durable than the performance-based identity that academic pressure requires. Reading this non-academic self-description before or after high-pressure periods provides the perspective that intense academic environments tend to remove: that your worth as a person exists independently of any result, and that the qualities that make you who you are — your relationships, your values, your ways of being in the world — are not on trial when an exam paper arrives.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Academic Pressure FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: How do I tell the difference between healthy pressure that motivates and unhealthy pressure that harms?</strong><br />
        A: Healthy academic pressure produces focused preparation, moderate arousal that improves performance, and proportionate emotional responses to results — disappointment after a poor result is appropriate and temporary; relief and satisfaction after a good one is genuine rather than merely the absence of catastrophe. Unhealthy academic pressure produces chronic anxiety regardless of preparation level, performance impairment through distraction and blanking, disproportionate emotional responses to results, avoidance of studying because the stakes feel too threatening to face, and physical symptoms (disrupted sleep, appetite loss, headaches) that persist through the academic period. The key distinction is functionality: healthy pressure is motivating and performance-enhancing; unhealthy pressure is paralysing and performance-impairing.</p>

        <p><strong>Q: I know my expectations of myself are unrealistic but I cannot seem to lower them. What is happening?</strong><br />
        A: The inability to lower self-expectations even when their unrealism is intellectually acknowledged is one of the most specific features of perfectionism — and it happens because the standards are not purely cognitive. They are emotionally functional: they serve as protection (if my standard is high enough, failure is preventable through effort), as identity (if I am the student with the highest standards, that defines something important about who I am), and as relationship maintenance (if my standards match or exceed external expectations, I remain in the approval of the people whose approval matters). Lowering the standard feels like losing the protection, the identity, and the approval simultaneously. The work is therefore not purely cognitive — it requires addressing each of these emotional functions, usually through the support of a counsellor or trusted adult who can help you examine what the impossible standard is protecting you from.</p>

        <p><strong>Q: What do I do when I know my pressure is not helping but exams are in one week?</strong><br />
        A: In the one-week window, the most important pressure reduction is physiological rather than cognitive. Three physiological sighs (double inhale through the nose, long exhale) whenever the pressure rises acutely. Physical movement for ten minutes before each study session. Hard study cutoff each evening. Adequate sleep above all else. The cognitive work of addressing the root sources of pressure is valuable and important — and it is best done after the immediate pressure period. Right now, the goal is to maintain functional physiological state (not overwhelmed, not shut down) and to study as effectively as possible within the constraints of the pressure that is present. Let the pressure be there. Do not add the additional pressure of trying to eliminate the pressure during the highest-pressure week of the term.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: SAGE3, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "You can care deeply about your academic life without letting it be the only place your worth lives. The caring and the boundary are both available."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Academic pressure does not disappear when you understand it better. The exams are still real, the expectations are still present, and the stakes are still genuinely meaningful. What changes is the relationship to the pressure — from something that happens to you and determines everything, to something you can understand, work with, and respond to with a degree of agency rather than only with suffering. That shift is available. It is built gradually, through the strategies above and through the courage to ask for support when the pressure becomes too heavy to carry alone.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: SAGE3, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${SBORD3}` }}
          >
            Process This in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: SAGE3, border: `2px solid ${SAGE3}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Get Support in our Safe Corner
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Related Academic Wellbeing Guides:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/fear-of-failure-studies',        '→ How to Overcome Fear of Failure in Studies'],
            ['/blog/stay-calm-during-exams',         '→ How to Stay Calm and Confident During Exams'],
            ['/blog/academic-burnout-signs',         '→ 7 Signs of Academic Burnout Every Student Should Know'],
            ['/blog/mental-health-exams',            '→ Mental Health Tips for Students During Exams'],
            ['/blog/balance-studies-mental-health',  '→ How to Balance Studies and Mental Health Effectively'],
            ['/blog/self-acceptance-confidence',     '→ How to Build Confidence Through Self-Acceptance'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: SAGE3, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
