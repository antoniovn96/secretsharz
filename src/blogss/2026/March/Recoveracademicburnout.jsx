import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Recover from Academic Burnout Quickly and Safely",
  excerpt: "Academic burnout is not the same as ordinary tiredness — it is a specific psychological syndrome with identifiable stages, measurable physiological consequences, and a recovery process that requires more than a weekend of rest. Learn to recognise where you are on the burnout spectrum, understand the recovery science, and use our Burnout Recovery Planner to build your personalised healing plan.",
  category: "Mental Health",
  date: "30-03-2026",
  readTime: "8 min read",
  wordCount: 1100,
  imgUrl: "/blogss/2026/March/recover-academic-burnout.jpg",
  tldr: "Recovering from academic burnout requires a structured, patient approach that addresses three dimensions simultaneously: physiological restoration (sleep, nutrition, physical activity), psychological recovery (emotional processing, meaning reconstruction, identity rebuilding beyond academic performance), and practical recalibration (workload reduction, boundary setting, sustainable routine rebuilding). This guide covers the science of burnout, recognising your recovery stage, emotional care strategies, healthy recovery routines, and an interactive Burnout Recovery Planner that generates your personalised step-by-step recovery plan.",
  toc: [
    { id: "what-burnout",  title: "1. What Academic Burnout Actually Is — Beyond Being Tired",          level: 3 },
    { id: "signs",         title: "2. Recovery Signs — Where You Are on the Spectrum",                  level: 3 },
    { id: "planner",       title: "3. Interactive: The Burnout Recovery Planner",                       level: 3 },
    { id: "emotional",     title: "4. Emotional Care During Burnout Recovery",                           level: 3 },
    { id: "routines",      title: "5. Healthy Recovery Routines — What the Research Supports",          level: 3 },
    { id: "faq",           title: "6. Academic Burnout Recovery FAQs",                                   level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-03-30T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "recover from burnout, academic burnout recovery, how to recover from student burnout, academic burnout signs, student burnout recovery tips, burnout recovery routine, emotional recovery burnout",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does it take to recover from academic burnout?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Recovery from academic burnout depends on its severity and duration. Mild burnout (a few weeks of depletion) may resolve with 2-4 weeks of deliberate recovery practices. Moderate burnout (1-3 months of significant symptoms) typically requires 1-3 months of active recovery with workload reduction. Severe or chronic burnout (several months to years of high-pressure academic environments) may require 3-6 months or longer, and often benefits significantly from professional support alongside self-directed recovery. Research consistently shows that premature return to full academic demands before physiological and psychological recovery is complete produces relapse that extends total recovery time beyond what a more patient initial approach would have required.",
      },
    },
    {
      "@type": "Question",
      "name": "What are the first signs of recovering from academic burnout?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Early signs of burnout recovery include: sleep beginning to feel genuinely restorative rather than never sufficient; moments of genuine interest or curiosity returning, even briefly; physical symptoms (chronic headaches, frequent illness, persistent tension) beginning to diminish; emotional reactivity reducing — things that felt devastating at peak burnout feeling proportionate; and the capacity for genuine enjoyment of non-academic activities returning. These signs typically appear in the order above, with sleep restoration and emotional reactivity reduction usually preceding the return of academic engagement and genuine interest.",
      },
    },
    {
      "@type": "Question",
      "name": "Should I keep studying during burnout recovery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Continuing full academic engagement during burnout recovery is counterproductive and extends total recovery time. The recovering nervous system cannot simultaneously restore depleted neurochemical and hormonal resources and sustain the cognitive demand that intensive studying requires. The evidence-based approach is a significant reduction in academic load during the acute recovery phase (not complete cessation if exams are imminent, but substantial reduction and restructuring), followed by gradual, paced resumption of academic activity as recovery signs appear. Trying to study through burnout using willpower is the recovery equivalent of running on a broken leg — the additional demand prevents the healing that would allow functional activity to resume.",
      },
    },
  ],
};

// ── Recovery Planner Data ──────────────────────────────────────────────────────
const VIOLET3  = '#5B3A8B';
const VPALE3   = '#F2EEF9';
const VBORD3   = 'rgba(91,58,139,0.22)';

const BURNOUT_LEVELS = [
  {
    key:     'early',
    icon:    '🟡',
    label:   'Early burnout — I\'m exhausted but still functioning',
    desc:    'Persistent fatigue, reduced motivation, but still able to study and meet commitments',
    color:   '#C07800',
    bgColor: '#FFF8E1',
    diagnosis: 'You are in the early depletion stage — the nervous system is running below optimal but has not yet crossed into the dysfunction that characterises deeper burnout. This is the ideal window for intervention: the recovery is faster, the return to full function is quicker, and the prevention of deeper burnout is still entirely possible with deliberate action.',
    timeline: '2-4 weeks of deliberate recovery practices alongside maintained but reduced study',
    urgent: false,
  },
  {
    key:     'moderate',
    icon:    '🟠',
    label:   'Moderate burnout — significant symptoms affecting daily life',
    desc:    'Cynicism toward studies, persistent physical symptoms, emotional exhaustion, difficulty concentrating',
    color:   '#D4680A',
    bgColor: '#FFF3E0',
    diagnosis: 'You are in the moderate burnout stage — the depletion has progressed beyond manageable fatigue into the syndrome\'s characteristic triad of exhaustion, cynicism, and reduced sense of academic efficacy. Recovery requires deliberate workload reduction, not just rest. Attempting to push through at the same academic load will extend total recovery time significantly.',
    timeline: '4-10 weeks of structured recovery, with significant workload reduction in the early weeks',
    urgent: false,
  },
  {
    key:     'severe',
    icon:    '🔴',
    label:   'Severe burnout — barely functioning academically or personally',
    desc:    'Unable to engage with studies, emotional flatness or breakdown, physical symptoms, possible hopelessness',
    color:   '#C0392B',
    bgColor: '#FDECEA',
    diagnosis: 'You are describing severe burnout — a state that has moved beyond what self-directed recovery alone can address efficiently. Professional support (a counsellor, psychologist, or doctor) is appropriate here and will produce significantly faster, more complete recovery than solo management. This is not weakness — it is accurate assessment of what this level of depletion requires.',
    timeline: '8-20 weeks with professional support; longer without it',
    urgent: true,
  },
  {
    key:     'recovering',
    icon:    '🌱',
    label:   'I\'m recovering but uncertain — some days better, some worse',
    desc:    'Started recovery but inconsistent — good days and bad days, unsure if making progress',
    color:   '#2D7D46',
    bgColor: '#E8F5EE',
    diagnosis: 'The variability you are describing — good days and bad days — is characteristic of genuine recovery in progress. Burnout recovery is not linear; it follows a wave pattern where each wave of fatigue or cynicism is slightly lower than the last and each recovery window is slightly longer. The inconsistency is not failure of recovery; it is what recovery looks like.',
    timeline: 'Continue current recovery practices and add the targeted interventions below; expect 4-8 weeks to more stable consistent function',
    urgent: false,
  },
];

const PRIMARY_SYMPTOMS = [
  { key: 'physical',    icon: '💗', label: 'Physical — exhaustion, headaches, frequent illness, tension' },
  { key: 'emotional',   icon: '💔', label: 'Emotional — flatness, tearfulness, irritability, hopelessness' },
  { key: 'cognitive',   icon: '🧠', label: 'Cognitive — cannot concentrate, poor memory, foggy thinking' },
  { key: 'cynicism',    icon: '😶', label: 'Cynicism — everything feels pointless or meaningless' },
  { key: 'withdrawal',  icon: '🚪', label: 'Withdrawal — isolating from friends, family, activities' },
  { key: 'performance', icon: '📉', label: 'Performance — studying but producing nothing meaningful' },
];

const RECOVERY_SUPPORT = [
  { key: 'alone',       icon: '🧘', label: 'Mostly on my own — limited external support' },
  { key: 'friends',     icon: '👥', label: 'Friends are supportive but not family' },
  { key: 'family',      icon: '🏠', label: 'Family is supportive' },
  { key: 'counsellor',  icon: '💬', label: 'I have or am considering professional support' },
];

const SYMPTOM_RECOVERY_PLANS = {
  physical: {
    title: 'Physical Recovery Plan',
    priority: 'Sleep is the primary intervention for physical burnout symptoms — not a nice-to-have, the physiological repair mechanism. Every other physical recovery strategy has reduced effectiveness when sleep is insufficient.',
    steps: [
      { icon: '😴', label: 'Sleep anchor', text: 'Set a consistent wake time 7 days a week and work backwards to create an 8-hour sleep window. Protect this window above all other recovery activities. Physical symptoms of burnout are primarily driven by cortisol dysregulation and HPA axis overactivation — sleep is the only complete reset mechanism available.' },
      { icon: '🏃', label: 'Daily movement', text: '20-30 minutes of gentle to moderate physical activity daily — walking, cycling, yoga, swimming. Not vigorous training (which adds physiological stress during recovery). The specific benefit: exercise produces BDNF (which repairs the hippocampal damage associated with chronic stress) and is the most effective available natural cortisol-reduction tool.' },
      { icon: '🥗', label: 'Nutritional foundation', text: 'Three regular meals with adequate protein and complex carbohydrates. During burnout, blood sugar dysregulation amplifies every physical symptom. Do not skip meals even when appetite is reduced. Reduce caffeine below current levels — caffeine further elevates already-dysregulated cortisol.' },
      { icon: '🌿', label: 'Physical tension release', text: 'Daily progressive muscle relaxation (10 minutes) or gentle yoga. Burnout produces chronic muscular tension that persists even during sleep — deliberate physical release accelerates the nervous system\'s return to baseline.' },
    ],
  },
  emotional: {
    title: 'Emotional Recovery Plan',
    priority: 'Emotional burnout symptoms require processing, not suppression. The emotional flatness, irritability, or tearfulness of burnout are the nervous system\'s signal that emotional content has been accumulating without adequate processing. Suppression extends recovery; gentle processing accelerates it.',
    steps: [
      { icon: '✍️', label: 'Daily emotional writing', text: 'Five minutes of uncensored journalling each evening — not about studying, about how you actually feel. Not structured, not positive, not useful — just honest. Research by James Pennebaker shows that expressive writing about emotional experiences reduces psychological distress significantly over two weeks of consistent practice.' },
      { icon: '💬', label: 'One honest conversation weekly', text: 'Tell one trusted person — not the managing-fine version, the honest version — how you are doing. Social isolation amplifies every burnout symptom; genuine connection is the strongest available buffer against the emotional component of burnout. Once per week, genuinely, with one person.' },
      { icon: '🌊', label: 'Allow the emotions without amplifying them', text: 'When difficult emotions arise during recovery, the practice is: notice them, name them specifically, allow them to exist for a defined window, then redirect to the recovery activity. Neither suppressing (which extends them) nor ruminating (which amplifies them) — allowing them to move through rather than accumulate.' },
      { icon: '💛', label: 'Self-compassion practice', text: 'After any moment of self-criticism about your burnout (feeling like you should be studying, feeling guilty about reduced productivity), write what you would say to a close friend in your situation. Apply that to yourself. Research by Kristin Neff consistently shows self-compassion accelerates recovery from burnout more effectively than self-criticism does — counterintuitively, because self-compassion preserves the motivational and emotional resources that recovery requires.' },
    ],
  },
  cognitive: {
    title: 'Cognitive Recovery Plan',
    priority: 'Cognitive burnout symptoms (difficulty concentrating, poor memory, foggy thinking) reflect the prefrontal cortex\'s impaired function under chronic cortisol. Recovery requires reducing the cognitive demand rather than trying to push through it — the prefrontal cannot restore itself while it is still being maxed out.',
    steps: [
      { icon: '🛑', label: 'Radical cognitive workload reduction', text: 'For the first two weeks of recovery, reduce academic cognitive demand to the genuine minimum required. This is not abandoning study — it is the acknowledgement that the prefrontal cortex needs reduced load to restore itself. Low-demand study (reviewing already-understood material, light reading) is sustainable; high-demand new concept learning is not, yet.' },
      { icon: '⏱️', label: 'Short sessions with long gaps', text: 'During recovery, study in 20-30 minute maximum sessions with genuine 30-minute recovery gaps. The recovering prefrontal depletes more rapidly and recovers more slowly than a non-burned-out system. Matching session length to actual current capacity rather than aspirational capacity produces more output per day than extended exhausted sessions.' },
      { icon: '🌿', label: 'Nature and low-demand activity', text: 'Daily exposure to natural environments (even 20 minutes) produces measurable restoration of directed attention capacity — research by Marc Berman at Michigan demonstrates this specifically for attentional fatigue recovery. During cognitive burnout recovery, nature walks are not leisure; they are targeted cognitive rehabilitation.' },
      { icon: '📚', label: 'Reading for pleasure', text: 'Re-engage with reading — specifically, reading something genuinely interesting to you that has no academic assessment attached. The re-engagement with voluntary, interest-driven cognitive activity restores the intrinsic motivation networks that burnout depletes, without the performance pressure that academic reading carries.' },
    ],
  },
  cynicism: {
    title: 'Meaning and Cynicism Recovery Plan',
    priority: 'Cynicism toward studies — the feeling that none of it matters, that effort is pointless, that the whole academic project is hollow — is the most psychologically significant burnout symptom because it reflects the depletion of intrinsic motivation. It requires meaning reconstruction, not just rest.',
    steps: [
      { icon: '🔭', label: 'Reconnect with original purpose', text: 'Write the honest answer to: "Before this became what it has become, why did I choose to study this?" The original purpose is almost always still valid — it has been buried under obligation, pressure, and the cynicism that long-term external motivation produces. A conversation with someone doing work related to your field of study — even briefly — often reconnects what felt dead.' },
      { icon: '🌱', label: 'Small genuine interest moments', text: 'Once per day, engage with any aspect of your field that genuinely interests you — not for assessment, not for coverage, purely because it is interesting. A concept you were curious about, a real-world application, a controversy in the field. The curiosity is still there; the cynicism has suppressed it. These brief genuine interest moments are the first signals of meaning restoration.' },
      { icon: '🎨', label: 'Non-academic sources of meaning', text: 'Actively invest in activities, relationships, and pursuits that provide meaning and a sense of capability completely independent of academic performance. Research on burnout recovery consistently identifies non-academic meaning sources as the strongest predictor of sustained recovery — they provide the psychological counterweight to the cynicism that academic pressure alone cannot provide.' },
      { icon: '💬', label: 'Name and examine the cynicism specifically', text: 'Write the specific cynical beliefs: "None of this will matter." "I am doing this for everyone except myself." "I do not care about any of this anymore." Then examine each one: is it completely true? Was it always true? What was true before this period? The specific examination of cynical beliefs — rather than attempting to overcome them through positive thinking — is the cognitive intervention that produces most movement.' },
    ],
  },
  withdrawal: {
    title: 'Social and Withdrawal Recovery Plan',
    priority: 'Social withdrawal during burnout is the symptom that most effectively perpetuates the burnout — because social connection is the strongest available buffer against the cortisol dysregulation at burnout\'s core, and withdrawal eliminates the buffer entirely. Gradual re-engagement with genuine connection is both the hardest and the most important recovery step.',
    steps: [
      { icon: '👥', label: 'One genuine connection per day — minimum, non-negotiable', text: 'Even when the social energy is not there, make one genuine connection per day: a brief honest conversation, a message that is about how you are rather than logistics, a shared activity with someone who matters to you. Research by Cacioppo consistently shows that even brief genuine social connection reduces cortisol and its associated burnout symptoms measurably. Start small; the energy for more will return as recovery progresses.' },
      { icon: '💬', label: 'Tell one person what is actually happening', text: 'The isolation of burnout is partly practical (no energy for social activities) and partly protective (the belief that others cannot understand, or that showing the full extent of the depletion will be too much for the relationship). Tell one trusted person honestly. The told experience is always smaller than the held experience — and the response is almost always more supportive than the protective avoidance anticipated.' },
      { icon: '🚶', label: 'Low-energy social activities', text: 'Choose activities that allow genuine connection without high social energy demands: a walk with one friend, a shared meal, watching something together. The high-energy social performance that parties or large groups require is not necessary and should not be the standard for "being social." Low-demand genuine connection counts as recovery-quality connection.' },
      { icon: '🛡️', label: 'Set clear limits on what you share — and what you attend', text: 'You do not have to attend everything or perform recovery to others. Setting clear limits on social obligations — "I am not up to this event but I would love to have lunch next week" — protects recovery energy while maintaining connection. The key is genuine but lower-demand connection, not either full social performance or complete withdrawal.' },
    ],
  },
  performance: {
    title: 'Academic Performance Recovery Plan',
    priority: 'Studying during burnout while producing nothing meaningful is one of the most demoralising experiences in student life — the investment of effort without the return of output. The cause is not laziness; it is the absence of the cognitive and emotional resources that studying requires. Addressing the resource shortage — rather than demanding more from a depleted system — is the intervention.',
    steps: [
      { icon: '🎯', label: 'Radical task reduction', text: 'Identify the absolute minimum academic output required this week — the tasks that genuinely cannot be deferred without significant consequence. Do only these. Everything else is either deferred, renegotiated, or cut. The permission to do less for a defined recovery period is the structural change that makes the minimum achievable rather than the maximum a guarantee of zero.' },
      { icon: '⚡', label: 'Active over passive study', text: 'When studying during recovery, use active recall methods exclusively — not re-reading, not passive review. Active recall in 20-minute sessions produces more actual retention than three hours of exhausted passive review. The quality of the study method is the intervention when quantity cannot be maintained.' },
      { icon: '📋', label: 'Visible small wins', text: 'Track specific outputs (not hours): "understood and recalled these three concepts," "completed these two practice questions," "read and summarised one section." The visibility of specific completed outputs — however small — counters the demoralising experience of extended effort producing nothing visible, which is a characteristic burnout experience that the tracking practice directly addresses.' },
      { icon: '🔄', label: 'Communicate with your institution or educators', text: 'If burnout has reached the point where academic performance is genuinely impaired, accessing the support structures available — student services, academic counsellor, extension requests — is not a failure of resilience. It is the accurate use of available systems for exactly the situation they were designed for. Struggling silently through academic expectations that the current system cannot support delays recovery and produces academic outcomes that are worse than the reduced-demand alternative.' },
    ],
  },
};

const SUPPORT_CONTEXT = {
  alone: {
    note: 'Recovering from burnout with limited external support is harder and slower than with social support — but it is possible. The recovery plan below is designed to be self-directed. The most important single action when support is limited: identify one person — even a distant one, even online — with whom you can be honest about what you are going through. The connection does not need to be regular or close; it needs to be genuine.',
    additional: 'Consider: your institution\'s student support services, online peer support communities for students, or professional counselling if available. You do not have to recover entirely alone, even if close personal support is limited.',
  },
  friends: {
    note: 'Having supportive friends is a significant recovery asset. The specific way to use it effectively: let them know specifically what would help — not general availability, but "checking in with me once a week" or "having lunch together on Wednesdays." Specific requests produce more reliable support than general offers.',
    additional: 'Consider letting your most trusted friend know that you are in active recovery. Their awareness of what you are navigating prevents the misinterpretations that withdrawal commonly produces.',
  },
  family: {
    note: 'Family support during burnout recovery is most effective when family members understand what recovery requires: reduced academic demand, genuine rest, and time for non-academic activities are not laziness — they are the treatment. If family members are supportive but exerting academic pressure, the conversation about what recovery needs is worth having.',
    additional: 'Consider having the specific conversation with your family: "I am experiencing burnout and I need [specific thing] for the next [specific time period] to recover. What would help most is [specific support]."',
  },
  counsellor: {
    note: 'Professional support during burnout recovery significantly improves outcomes — both in speed and completeness of recovery. A counsellor or therapist working with students has specific burnout recovery expertise and can provide personalised support that self-directed recovery cannot. If you are considering it, this is the right time.',
    additional: 'CBT-based approaches, acceptance and commitment therapy (ACT), and specific burnout recovery programmes all have strong evidence in student populations. Ask specifically about burnout treatment when accessing support.',
  },
};

// ── Recovery Planner Component ─────────────────────────────────────────────────
function BurnoutRecoveryPlanner() {
  const [step,      setStep]      = useState(1);
  const [level,     setLevel]     = useState(null);
  const [symptom,   setSymptom]   = useState(null);
  const [support,   setSupport]   = useState(null);
  const [revealed,  setRevealed]  = useState(false);
  const [openStep,  setOpenStep]  = useState(null);

  const font    = "'Plus Jakarta Sans', system-ui, sans-serif";
  const selLev  = BURNOUT_LEVELS.find(l => l.key === level);
  const selSym  = PRIMARY_SYMPTOMS.find(s => s.key === symptom);
  const selSup  = RECOVERY_SUPPORT.find(s => s.key === support);
  const sympPlan= symptom ? SYMPTOM_RECOVERY_PLANS[symptom] : null;
  const supCtx  = support ? SUPPORT_CONTEXT[support] : null;

  const handleReset = () => { setStep(1); setLevel(null); setSymptom(null); setSupport(null); setRevealed(false); setOpenStep(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? VIOLET3 : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — burnout level */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — Where are you right now, honestly?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the description that feels most accurate. This shapes the pace and intensity of your recovery plan.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {BURNOUT_LEVELS.map(bl => {
              const isSel = level === bl.key;
              return (
                <button key={bl.key} onClick={() => setLevel(bl.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? VIOLET3 : 'var(--border)', background: isSel ? VPALE3 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 3px ${VBORD3}` : 'var(--shadow-sm)',
                }}>
                  <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '1px' }}>{bl.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? VIOLET3 : 'var(--ink)', marginBottom: '2px' }}>{bl.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{bl.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => { if (level) setStep(2); }} disabled={!level} style={{
            width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
            background: level ? `linear-gradient(135deg, ${VIOLET3}, #7B52B8)` : 'var(--border)',
            color: 'white', fontWeight: '700', fontSize: '15px',
            cursor: level ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            boxShadow: level ? `0 6px 18px ${VBORD3}` : 'none',
          }}>Next →</button>
        </>
      )}

      {/* STEP 2 — primary symptom */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — Which symptom is affecting you most?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Choose the primary dimension — your recovery plan will be targeted to this specific symptom cluster.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {PRIMARY_SYMPTOMS.map(ps => {
              const isSel = symptom === ps.key;
              return (
                <button key={ps.key} onClick={() => setSymptom(ps.key)} style={{
                  padding: '12px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? VIOLET3 : 'var(--border)', background: isSel ? VPALE3 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${VBORD3}` : 'none',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{ps.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? VIOLET3 : 'var(--ink)' }}>{ps.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (symptom) setStep(3); }} disabled={!symptom} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: symptom ? `linear-gradient(135deg, ${VIOLET3}, #7B52B8)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: symptom ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Next →</button>
          </div>
        </>
      )}

      {/* STEP 3 — support context */}
      {step === 3 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — What does your support situation look like?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {RECOVERY_SUPPORT.map(rs => {
              const isSel = support === rs.key;
              return (
                <button key={rs.key} onClick={() => setSupport(rs.key)} style={{
                  padding: '13px 16px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? VIOLET3 : 'var(--border)', background: isSel ? VPALE3 : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${VBORD3}` : 'none',
                }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{rs.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: isSel ? '700' : '500', color: isSel ? VIOLET3 : 'var(--ink)' }}>{rs.label}</span>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(2)} style={{ padding: '13px 18px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (support) { setStep(4); setRevealed(false); } }} disabled={!support} style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
              background: support ? `linear-gradient(135deg, ${VIOLET3}, #7B52B8)` : 'var(--border)',
              color: 'white', fontWeight: '700', fontSize: '15px',
              cursor: support ? 'pointer' : 'not-allowed', fontFamily: font, transition: 'all 0.2s',
            }}>Build My Recovery Plan →</button>
          </div>
        </>
      )}

      {/* STEP 4 — Results */}
      {step === 4 && selLev && selSym && selSup && sympPlan && supCtx && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Your Burnout Recovery Plan
          </p>
          {!revealed ? (
            <>
              <button onClick={() => setRevealed(true)} style={{
                width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${VIOLET3}, #7B52B8)`, color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
                boxShadow: `0 6px 20px ${VBORD3}`,
              }}>🌱 Generate My Recovery Plan</button>
              <button onClick={() => setStep(3)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>← Back</button>
            </>
          ) : (
            <div style={{ animation: 'floatUp 0.4s ease' }}>

              {/* Header */}
              <div style={{ background: `linear-gradient(135deg, ${VIOLET3}, #7B52B8)`, borderRadius: '14px', padding: '24px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px', marginBottom: '8px' }}>{selLev.icon}</div>
                <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '5px' }}>
                  Your Recovery Plan
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto' }}>
                  {selLev.label} · Primary: {selSym.label}
                </div>
              </div>

              {/* Severe note */}
              {selLev.urgent && (
                <div style={{ background: '#FEF3C7', border: '2px solid rgba(192,120,0,0.35)', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#B45309', marginBottom: '6px' }}>⚠️ A Direct Note for Severe Burnout</div>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#92400E', lineHeight: 1.7 }}>
                    At this level, professional support will significantly improve the speed and completeness of your recovery. Please reach out to a counsellor, doctor, or student support service — not instead of this plan, alongside it. You do not have to navigate this alone, and at this level you should not have to.
                  </p>
                  <button onClick={() => navigate?.('/safe')} style={{ background: '#B45309', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: font }}>Visit Our Safe Corner →</button>
                </div>
              )}

              {/* Diagnosis */}
              <div style={{ background: 'white', border: `1.5px solid ${VBORD3}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '6px' }}>🔬 Your Current Stage</div>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{selLev.diagnosis}</p>
                <div style={{ background: VPALE3, borderRadius: '8px', padding: '8px 12px', border: `1px solid ${VBORD3}` }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: VIOLET3 }}>⏳ Typical timeline: </span>
                  <span style={{ fontSize: '12px', color: 'var(--ink)' }}>{selLev.timeline}</span>
                </div>
              </div>

              {/* Symptom priority */}
              <div style={{ background: VPALE3, border: `1.5px solid ${VBORD3}`, borderRadius: '12px', padding: '13px 15px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: VIOLET3, marginBottom: '5px' }}>
                  {selSym.icon} Priority: {sympPlan.title}
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{sympPlan.priority}</p>
              </div>

              {/* Recovery steps — expandable */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: VIOLET3, marginBottom: '9px' }}>
                  🌱 Your Four Recovery Steps
                </div>
                {sympPlan.steps.map((s, i) => {
                  const isOpen = openStep === i;
                  return (
                    <div key={i} style={{ background: 'white', borderRadius: '11px', marginBottom: '7px', border: `1.5px solid ${VBORD3}`, overflow: 'hidden' }}>
                      <button onClick={() => setOpenStep(isOpen ? null : i)} style={{
                        width: '100%', padding: '13px 16px', background: 'transparent', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: font, textAlign: 'left',
                      }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: `linear-gradient(135deg, ${VIOLET3}, #7B52B8)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{s.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: VIOLET3 }}>Step {i + 1}: {s.label}</div>
                        </div>
                        <span style={{ color: VIOLET3, fontSize: '14px' }}>{isOpen ? '▲' : '▼'}</span>
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

              {/* Support context */}
              <div style={{ background: 'white', border: `1.5px solid ${VBORD3}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '12px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: VIOLET3, marginBottom: '6px' }}>
                  {selSup.icon} Your Support Context
                </div>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{supCtx.note}</p>
                <div style={{ background: VPALE3, borderRadius: '8px', padding: '9px 12px', border: `1px solid ${VBORD3}` }}>
                  <p style={{ margin: 0, fontSize: '12px', color: VIOLET3, lineHeight: 1.65 }}>{supCtx.additional}</p>
                </div>
              </div>

              {/* Affirmation */}
              <div style={{ background: VPALE3, border: `1.5px dashed ${VBORD3}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: VIOLET3, marginBottom: '7px' }}>✨ Something to Hold</div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '600', color: VIOLET3, fontStyle: 'italic', lineHeight: 1.55 }}>
                  {selLev.key === 'severe'     && '"You have been carrying this for too long without enough support. You deserve more than you have been getting. Recovery starts by letting someone in."'}
                  {selLev.key === 'moderate'   && '"You are not failing. You are depleted. These are not the same thing, and the difference matters enormously for what comes next."'}
                  {selLev.key === 'early'      && '"You caught this early. That is the hardest thing to do. The recovery ahead is shorter and easier than it would have been if you had waited."'}
                  {selLev.key === 'recovering' && '"The wave pattern is the recovery. Good days and bad days means it is working — not that it has stopped. Keep going."'}
                </p>
              </div>

              <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${VBORD3}`, color: VIOLET3, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Generate a different plan</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RecoverAcademicBurnout({ navigate, relatedPosts }) {
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
      <p>Academic burnout has a specific texture that distinguishes it from ordinary tiredness: it is not just that you are exhausted, it is that rest does not fully restore you. It is not just that you are struggling to study, it is that even when you make yourself sit down, the studying produces nothing. It is not just that you are under pressure, it is that the pressure has gone on for long enough that your entire relationship with studying — and sometimes with yourself — has changed.</p>

      <p><strong>Recovering from burnout</strong> requires more than a few days of rest. It requires understanding what has actually happened physiologically and psychologically, addressing the right things in the right order, and being patient with a recovery process that is slower and less linear than the urgency of academic demands wants it to be.</p>

      <img
        src={meta.imgUrl}
        alt="Student recovering from academic burnout — recognising recovery signs, emotional care strategies, and healthy rebuilding routines"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="what-burnout">1. What Academic Burnout Actually Is — Beyond Being Tired</h3>

      <p>The clinical definition of burnout, developed by psychologist Christina Maslach at the University of California Berkeley, identifies three specific components that together constitute the syndrome — and which distinguish it from ordinary fatigue:</p>

      <p><strong>Exhaustion</strong> — not ordinary tiredness but a deep depletion of emotional and physical resources that does not recover with normal rest. The student who sleeps adequately and still wakes feeling unrestored, who takes a weekend off and returns to Monday feeling as depleted as Friday, is experiencing burnout exhaustion rather than ordinary tiredness.</p>

      <p><strong>Cynicism or depersonalisation</strong> — a detachment from the work that was previously meaningful. In academic burnout, this presents as the specific experience of subjects feeling hollow, studying feeling pointless, and the student increasingly unable to access the interest or purpose that previously sustained them. This is not a character failure; it is the psyche's protective response to sustained depletion — reducing emotional investment to preserve a depleting resource.</p>

      <p><strong>Reduced sense of personal accomplishment</strong> — the persistent feeling that effort is not producing meaningful output, that capability has decreased, and that the gap between what is required and what can be produced is widening. This creates the specific demoralisation of working hard and producing nothing visible, which is one of the most demotivating experiences in academic life.</p>

      <p>The neurobiological basis of burnout is primarily a dysregulation of the HPA (hypothalamic-pituitary-adrenal) axis — the body's central stress response system. Research by Sonia Lupien at the University of Montreal shows that chronic academic stress produces measurably elevated basal cortisol, reduced cortisol reactivity (the body becomes less able to mount an appropriate stress response when needed), reduced hippocampal volume (which impairs memory and emotional regulation), and prefrontal downregulation (which impairs attention, decision-making, and complex reasoning). These are not metaphorical descriptions of feeling bad — they are measurable physiological changes that require physiological recovery, not just motivational intervention.</p>

      <p>Understanding the physiological reality of burnout has a specific practical implication: recovery requires addressing the body, not just the mind. Sleep, exercise, nutrition, and physical tension release are not supplementary wellness practices during burnout recovery — they are the primary interventions that allow the physiological changes above to reverse. Attempting to recover from burnout through motivational strategies, positive reframing, or planning changes alone, without addressing the physiological substrate, produces the characteristic experience of burnout recovery attempts that feel like they should be working but do not.</p>

      {/* ── Section 2 ── */}
      <h3 id="signs">2. Recovery Signs — Where You Are on the Spectrum</h3>

      <p>Burnout recovery is not binary — it is a spectrum from acute depletion to full restoration, with several identifiable stages between them. Knowing where you are on the spectrum allows you to calibrate the pace and intensity of recovery appropriately.</p>

      <p><strong>Stage 1 — Acute depletion (burnout is active and severe).</strong> Signs: cannot engage with study even with genuine effort; emotional responses are either absent or disproportionate to triggers; sleep is consistently insufficient or unrestorative despite adequate hours; physical symptoms (headaches, frequent illness, persistent muscular tension) are present most days; the idea of returning to full academic engagement feels genuinely impossible rather than just difficult. At this stage, the priority is foundational recovery: sleep, basic nutrition, physical care, and reduced academic demand. Attempting to resume study at this stage typically delays total recovery.</p>

      <p><strong>Stage 2 — Emerging from acute depletion (early recovery).</strong> Signs: moments of genuine rest are beginning to feel restorative; physical symptoms are present but occasionally absent; emotional responses are still reactive but with occasional windows of equanimity; academic engagement is still exhausting but no longer completely impossible; some moments of genuine interest in non-academic content have returned. This is the stage where deliberate recovery practices begin to produce visible effects. The appropriate academic load is significantly reduced from pre-burnout levels but no longer zero.</p>

      <p><strong>Stage 3 — Consolidating recovery (mid-recovery).</strong> Signs: sleep is more consistently restorative; physical symptoms are intermittent rather than constant; brief periods of genuine academic engagement are possible without immediate depletion; moments of genuine curiosity or interest in subjects are returning; the good days are measurably better than at earlier stages even when the bad days are still present. At this stage the academic load can gradually increase — but the increase must be gradual and must be reversed if physical or emotional symptoms significantly worsen.</p>

      <p><strong>Stage 4 — Sustained recovery (late recovery/rebuilding).</strong> Signs: consistent restorative sleep; physical symptoms absent most days; genuine academic engagement possible across multiple consecutive days; sense of personal accomplishment returning to study sessions; the relationship with academic work is being rebuilt on a more sustainable foundation. At this stage the focus shifts from recovery to rebuilding — specifically, rebuilding the study practices and self-relationship patterns that prevented rather than produced the burnout.</p>

      <p><strong>Signs that recovery has stalled and professional support is indicated:</strong> physical symptoms that have not diminished after 4-6 weeks of deliberate recovery practices; emotional symptoms (particularly persistent hopelessness, inability to feel positive emotions, or thoughts of self-harm) that have not improved or have worsened; complete inability to engage with academic work for more than a month despite genuine effort; significant functional impairment in daily life beyond academic performance. At these signs, professional support — a counsellor, psychologist, or doctor — is appropriate and will produce better outcomes than continued self-directed recovery.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="planner">3. Interactive: The Burnout Recovery Planner</h3>
      <p>The Planner generates a personalised recovery plan based on where you are right now, which symptom cluster is most prominent, and what your support situation looks like. The result includes your stage diagnosis, a recovery timeline, a four-step recovery protocol for your primary symptom, and your support context with specific guidance. Be honest — the plan is calibrated to your actual situation, not an aspirational version of it.</p>

      <BurnoutRecoveryPlanner />

      {/* ── Section 4 ── */}
      <h3 id="emotional">4. Emotional Care During Burnout Recovery</h3>

      <p><strong>Allow the recovery emotions without judging them.</strong> Burnout recovery produces a specific and often surprising emotional sequence. The acute phase is frequently characterised by emotional flatness or numbness — the psyche's protective response to depletion. As recovery begins, the suppressed emotions often surface: grief (for the time lost, the enjoyment that disappeared, the version of yourself that existed before the burnout), anger (at the system, the expectations, the circumstances that produced the depletion), and sometimes relief (at the acknowledgment that something was genuinely wrong rather than a reflection of personal inadequacy). All of these are appropriate and are part of the recovery process. The goal is not to manage these emotions into quicker resolution but to allow them to move through rather than accumulating further.</p>

      <p><strong>Rebuild self-worth outside academic performance.</strong> One of the most insidious dimensions of academic burnout is the way it attacks self-worth — particularly for students whose identity has been substantially built around academic capability. When the capability to perform academically is depleted, the students who have no other self-worth sources experience burnout as identity loss alongside depletion. Recovery requires the deliberate investment in non-academic sources of value and accomplishment: relationships, creative practices, physical skills, personal values lived through daily actions. These are not distractions from academic recovery; they are the self-worth foundation that makes academic re-engagement psychologically sustainable when the time comes.</p>

      <p><strong>Practise self-compassion as a clinical intervention, not a comfort exercise.</strong> Research by Kristin Neff on self-compassion in burnout recovery shows consistently that students who respond to their own burnout with self-compassion recover faster and more completely than those who respond with self-criticism. The self-critical response — "I should be further along by now," "I am letting everyone down," "I should be stronger than this" — maintains the cortisol activation that is the physiological core of burnout. The self-compassionate response — acknowledging the difficulty honestly, treating yourself with the care appropriate to someone who is genuinely unwell, recognising that burnout is a widely shared experience rather than a personal failure — reduces cortisol activation and creates the psychological safety that recovery requires.</p>

      <p><strong>Address the grieving that burnout requires.</strong> Students who have lost a significant part of an academic year, missed important experiences, or had their relationship with studying permanently altered by burnout experience a genuine grief — the loss of the year, the experiences, the version of their academic engagement that existed before. This grief is real and deserves acknowledgment rather than minimisation. Rushing through it with positive reframing ("it was a learning experience") before it has been genuinely felt and processed produces a grief that resurfaces repeatedly rather than resolving.</p>

      <p><strong>Identify and address the conditions that produced the burnout.</strong> Recovery that does not address the conditions that produced the burnout is not complete recovery — it is a rest period before the same conditions produce the same result again. At some point during recovery (not in the acute phase, but in the consolidation phase), the honest assessment of what specifically produced the burnout — the workload expectations, the external pressure, the absence of recovery practices, the identity-performance fusion — and what specifically needs to change to prevent recurrence, is necessary. This assessment is the bridge between recovery and sustainable re-engagement.</p>

      {/* ── Section 5 ── */}
      <h3 id="routines">5. Healthy Recovery Routines — What the Research Supports</h3>

      <p><strong>The Non-Negotiable Sleep Protocol.</strong> During burnout recovery, sleep is not a wellness practice — it is the primary intervention. Research by Walker at UC Berkeley shows that the slow-wave deep sleep disrupted by chronic stress is specifically where prefrontal restoration, hippocampal repair, and HPA axis reset occur. Recovery sleep should be: consistent (same sleep and wake times seven days a week), adequate (eight hours minimum), and quality-protected (no screens 60 minutes before bed, cool bedroom, progressive muscle relaxation before sleep to address the chronic muscular tension of burnout). For the first two weeks of recovery, sleep is the non-negotiable priority — it comes before additional study, social commitments, or late-night activities. No other recovery intervention approaches its effectiveness.</p>

      <p><strong>The Gentle Movement Protocol.</strong> Daily gentle to moderate physical activity — a 20-30 minute walk, gentle yoga, light cycling — produces BDNF (which directly repairs the hippocampal damage of chronic stress), reduces cortisol (the primary maintained stressor in burnout), increases serotonin and dopamine (which address the emotional flatness and anhedonia), and reduces the chronic muscular tension that burnout accumulates. The critical word is gentle — vigorous training during the acute recovery phase adds physiological stress and impairs rather than supports recovery. Walking outdoors specifically has the additional benefit of nature-based attentional restoration (Berman et al., Michigan). Daily gentle movement for four weeks produces measurable improvement in burnout symptoms independently of all other interventions.</p>

      <p><strong>The Nutritional Stability Protocol.</strong> Burnout disrupts appetite and eating patterns — students in acute burnout commonly skip meals, over-rely on caffeine, and have irregular eating that produces blood sugar dysregulation that amplifies every burnout symptom. The recovery protocol is simple: three regular meals at consistent times, adequate protein (for neurotransmitter precursor availability), complex carbohydrates (for blood glucose stability), and reduced caffeine. None of these require special foods or supplements — they require the regularity and adequacy that burnout-disrupted eating patterns typically disrupt. During recovery, eating regularly at consistent times is as important as what is eaten.</p>

      <p><strong>The Reconnection Protocol.</strong> Research on social support as a burnout recovery factor consistently identifies genuine social connection as a significant positive predictor of recovery speed. The reconnection protocol for burnout recovery: one genuine social connection per day minimum — not a performative display of recovery to others, but an honest exchange with at least one person. Start with the lowest-energy form available (a brief message, a shared walk, a meal with one trusted person) and allow the social energy to return gradually rather than expecting full social engagement from the start of recovery. The temptation to withdraw further during recovery — which feels protective — consistently extends recovery time by removing the social connection buffer against cortisol.</p>

      <p><strong>The Recovery Activity Protocol.</strong> At least one daily activity that provides genuine enjoyment, absorption, or satisfaction completely independent of academic performance. Not productive activities disguised as recovery — genuinely restorative ones. A creative practice you enjoy, time in nature, music, reading for pleasure, physical activities that produce flow states, time with people you care about. Research on recovery from burnout by Sabine Sonnentag at the University of Mannheim identifies psychological detachment from work (the ability to genuinely stop thinking about academic demands during recovery time) as the single strongest predictor of recovery quality. Activities that enable genuine psychological detachment — complete engagement with something that has nothing to do with academic performance — are the most effective recovery activities available.</p>

      <p><strong>The Gradual Academic Reintegration Protocol.</strong> When recovery has progressed to the point where brief academic engagement is possible without immediate depletion (typically Stage 2 or 3 as described above), the return to academic activity should be graduated, patient, and reversible. Begin with 20-30 minute sessions of low-demand academic activity (reviewing already-understood material, light reading in the subject area). Assess: does this produce significant fatigue? If yes, return to full recovery focus. If manageable, maintain for a week before increasing. Each step up in academic demand is tested and confirmed before the next increase. The specific sign to reverse the increase: significant worsening of physical symptoms, emotional reactivity, or sleep quality. Recovery progress is not linear; the plan must be flexible enough to reverse when needed without interpreting reversal as failure.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Academic Burnout Recovery FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I am in the middle of exam season and cannot afford to reduce my academic load — what do I do with burnout right now?</strong><br />
        A: If exams are genuinely imminent, the immediate burnout management priorities are the ones with the fastest return: sleep (the most important — eight hours is non-negotiable even during exams), physical movement before each study session (the fastest available cortisol reduction), and the complete elimination of guilt-laden half-rest (which provides neither the recovery value of genuine rest nor the learning value of genuine study). Reduce study method to only the highest-efficiency approaches: active recall and past papers, not re-reading. After the exams, commit to a genuine recovery period — not a brief rest before the next demand cycle, but a deliberate recovery period with the full protocol above. The burnout that is managed through an exam period without recovery consistently produces deeper burnout in the subsequent one.</p>

        <p><strong>Q: My parents do not understand burnout and are pushing me to study harder. How do I manage this?</strong><br />
        A: The conversation that produces most change with parents who do not understand burnout is functional rather than psychological: not "I am burned out" (which may be heard as an excuse) but "My current state is impairing my academic performance significantly, and the interventions that will actually improve my output are [sleep, reduced demand, specific recovery activities]. Pushing harder will produce worse results, not better." This frames the recovery as the performance strategy, which speaks to parents' actual concern. If the family pressure is severe and the burnout is significant, a letter or statement from a doctor, counsellor, or student services provider that documents the burnout can make the conversation easier by providing an external validation that the student's self-report alone may not achieve with sceptical parents.</p>

        <p><strong>Q: How do I know when I am recovered enough to return to normal academic engagement?</strong><br />
        A: Recovery is sufficient for full academic re-engagement when: sleep is consistently restorative; physical symptoms are absent or minimal; genuine academic engagement is possible for 90-minute sessions without significant subsequent depletion; moments of genuine interest or curiosity in the subject matter occur regularly (not constantly, but regularly); and the emotional response to academic setbacks has returned to proportionate rather than catastrophic. These signs typically appear in this order, and the last — proportionate emotional response — is the final indicator that the nervous system has genuinely restored rather than partially recovered. Premature return to full academic load, before these signs are consistently present, produces relapse in most cases — which extends total recovery time significantly beyond what patience in the recovery phase would have required.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: VIOLET3, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "You are not broken. You are depleted. These are not the same thing, and the difference matters enormously for what comes next."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Burnout is not a character failing, a sign of insufficient resilience, or evidence that you are not meant for your academic path. It is the physiological and psychological result of sustained demand without adequate recovery — which is a systems problem, not a personal one. The recovery is real, it is possible, and it follows a specific and learnable process. The most important decision available to you right now is to take the recovery as seriously as you have been taking the academic demands that produced the burnout. They are not in competition. The recovery is the path back to the engagement.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: VIOLET3, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${VBORD3}` }}
          >
            Get Support in Mind Space →
          </button>
          <button
            onClick={() => navigate('/safe')}
            style={{ background: 'white', color: VIOLET3, border: `2px solid ${VIOLET3}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
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
            ['/blog/academic-burnout-signs',        '→ 7 Signs of Academic Burnout Every Student Should Know'],
            ['/blog/mental-exhaustion-studying',     '→ Why You Feel Mentally Exhausted While Studying'],
            ['/blog/mental-health-exams',            '→ Mental Health Tips for Students During Exams'],
            ['/blog/balance-studies-mental-health',  '→ How to Balance Studies and Mental Health'],
            ['/blog/sleep-academic-performance',     '→ How Sleep Affects Academic Performance and Mental Health'],
            ['/blog/student-stress-management',      '→ Student Stress Management: Practical Techniques That Work'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: VIOLET3, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
