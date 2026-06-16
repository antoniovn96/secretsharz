import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "10 Common Mental Health Myths Students Should Stop Believing",
  excerpt: "Mental health myths are not harmless misunderstandings — they are the specific beliefs that prevent students from recognising that they need support, from asking for it, and from receiving it without shame. Each myth in this list has cost students genuine wellbeing. Each fact that replaces it is a small act of liberation.",
  category: "Mental Health",
  date: "02-05-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/May/mental-health-myths-students.jpg",
  tldr: "Ten of the most persistent and most harmful mental health myths — each debunked with evidence, each explained through student-specific examples. A scenario-based interactive Myth Buster game tests whether you can spot which myth is operating in real student situations.",
  toc: [
    { id: "why-myths",  title: "Why Mental Health Myths Are Harmful",                                  level: 3 },
    { id: "ten-myths",  title: "The 10 Myths — Debunked",                                             level: 3 },
    { id: "buster",     title: "Interactive: The Scenario Myth Buster",                               level: 3 },
    { id: "faq",        title: "Mental Health Myths FAQs",                                             level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-05-02T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "mental health myths, mental health myths students, debunking mental health myths, mental health facts vs myths, common mental health misconceptions, student mental health myths India, mental health stigma myths",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are the most common mental health myths among students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most harmful mental health myths among students are: (1) mental health problems are rare in young people (false — 1 in 5 experience one each year); (2) you can just 'snap out' of depression (false — depression is a medical condition requiring appropriate support, not willpower); (3) anxiety is just normal nervousness (false — clinical anxiety is qualitatively different from ordinary worry); (4) therapy is only for 'crazy' people (false — therapy is an evidence-based intervention for a wide range of conditions and challenges); (5) academic success means you cannot have a mental health problem (false — high-achieving students have elevated rates of anxiety and depression in research); (6) mental health conditions are a Western concept not applicable to India (false — mental health conditions occur across all cultures and are documented extensively in India); and (7) talking about suicidal thoughts plants the idea (false — asking directly about suicide reduces risk).",
      },
    },
    {
      "@type": "Question",
      "name": "Why do mental health myths persist among students?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Mental health myths persist for three primary reasons. First, cultural transmission: many myths are embedded in family, community, and cultural frameworks that are passed down without questioning — particularly in India, where mental health has historically been addressed through religious, spiritual, or familial frameworks rather than medical ones. Second, stigma reinforcement: myths about mental health often serve the function of distancing the holder from vulnerability — 'people with mental health problems are different from me' reduces the threat that acknowledging mental health conditions would pose to identity. Third, limited counter-information: formal mental health education is absent from most Indian school curricula, meaning myths go unopposed by accurate information during the developmental years when beliefs about mental health are formed.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const TEAL   = '#2A6878';
const TPALE  = '#E8F3F6';
const TBORD  = 'rgba(42,104,120,0.22)';

// ── The 10 Myths ──────────────────────────────────────────────────────────────
const MYTHS = [
  {
    num:   '01',
    myth:  'Mental health problems are rare — most people will never experience one',
    color: '#8B2635',
    bg:    '#FBF0F1',
    icon:  '🌍',
    fact:  'The WHO documents approximately 1 in 5 people globally experience a mental health condition in any given year. Across a lifetime, nearly 50% of people will meet diagnostic criteria for at least one mental health condition. Mental health conditions are among the most common human health challenges — more common than diabetes and heart disease in many demographics. In India, the National Mental Health Survey estimates 150 million people need active mental health support at any given time.',
    why_harmful: 'This myth keeps students from seeking help because they believe their experience is unusual, exaggerated, or evidence of personal failing rather than recognition of a common human condition.',
    student_example: 'Priya noticed herself feeling persistently low and disengaged for weeks but dismissed it: "It\'s probably just stress — this doesn\'t really happen to people like me." By the time she sought support, she had been managing unacknowledged depression for three months.',
    replace_with: 'Mental health conditions are common. If you are struggling, you are not alone — and you are not unusual for needing support.',
  },
  {
    num:   '02',
    myth:  'You can just "snap out" of depression if you try hard enough',
    color: '#5B3A8B',
    bg:    '#F2EEF9',
    icon:  '⚡',
    fact:  'Depression is a medical condition with documented neurobiological components — involving dysregulation of serotonin, norepinephrine, and dopamine systems, measurable changes in prefrontal cortex activity, and altered hippocampal structure. Research by Davidson at Wisconsin documents these as measurable, objective changes — not failures of effort or attitude. Telling someone to "snap out of" depression is equivalent to telling someone with a broken leg to "try harder to walk." The specific cognitive impairments of depression (reduced motivation, difficulty concentrating, memory difficulties) make it harder, not easier, to "try harder."',
    why_harmful: 'This myth produces double suffering — the person experiences both the depression and the shame of "failing" to will their way out of it. It prevents help-seeking by reframing a medical need as a character failing.',
    student_example: '"My parents kept saying I just need to be more positive and push through it. I believed them. It took me six months to understand I was actually ill, not just lazy or weak. Those six months were the worst of my life." — Aryan',
    replace_with: 'Depression is a medical condition, not a choice or attitude problem. Appropriate support — not willpower — is what effectively treats it.',
  },
  {
    num:   '03',
    myth:  'Anxiety is just being nervous — everyone feels it, so it\'s not a real problem',
    color: '#2D5A8A',
    bg:    '#EEF3FB',
    icon:  '😰',
    fact:  'Ordinary anxiety (the appropriate nervousness before an important presentation) and clinical anxiety disorders are qualitatively different — not just more of the same thing. Clinical anxiety involves the anxiety system activating disproportionately, persistently, and in ways that significantly impair functioning. Research documents specific neurobiological differences: elevated amygdala reactivity, impaired prefrontal regulation, HPA axis dysregulation producing chronic cortisol elevation. Clinical anxiety disorders are among the most prevalent mental health conditions globally and among the most treatable — but only when recognised as genuine conditions rather than dismissed as ordinary nervousness.',
    why_harmful: '"Everyone gets anxious" is technically true but weaponised as a dismissal that prevents recognition of when anxiety has become a condition requiring support rather than ordinary human experience.',
    student_example: 'Ishaan could not attend school for weeks during exam season because leaving home produced panic attacks. Teachers and family told him everyone gets nervous before exams. The year he missed cost him academically and socially because his clinical anxiety was treated as ordinary nervousness that he should manage through willpower.',
    replace_with: 'Ordinary nervousness and clinical anxiety disorder are different. If anxiety is significantly affecting daily life, relationships, or functioning, it deserves proper assessment and support.',
  },
  {
    num:   '04',
    myth:  'If you\'re academically successful, you cannot have a mental health problem',
    color: TEAL,
    bg:    TPALE,
    icon:  '📚',
    fact:  'Research consistently documents elevated rates of anxiety and depression among high-achieving students — not lower rates. The specific mechanisms: perfectionism produces higher psychological risk than moderate achievement standards; the identity-performance fusion means that high achievers have more to lose from any failure; and the sustained pressure of maintaining high performance produces chronic cortisol elevation. Research by Anna Katharine Mansfield at Stanford documents that high-achieving students often present with more severe anxiety than their average-performing peers, and are less likely to seek help because their achievement is used as "proof" that they are fine.',
    why_harmful: 'This myth is particularly harmful for high-achieving students because it makes their genuine struggles invisible to themselves and others, delaying support until the cost of untreated conditions becomes impossible to hide.',
    student_example: '"I was ranked first in my class and no one — including me — could believe I might need support. I was performing. But I was performing at the cost of sleep, relationships, and any genuine enjoyment of what I was supposedly succeeding at." — Meera',
    replace_with: 'Academic success and mental health struggle are not mutually exclusive — in fact, they frequently co-occur. Performing well academically is not evidence of psychological wellbeing.',
  },
  {
    num:   '05',
    myth:  'Talking to someone about mental health problems makes them worse',
    color: '#2D6B45',
    bg:    '#E8F4EE',
    icon:  '💬',
    fact:  'Research by Pennebaker at UT Austin documents that talking and writing about difficult psychological experiences produces measurable wellbeing improvements — not worsening. Psychotherapy — structured talking about psychological difficulties with a trained professional — is among the most evidence-based interventions available for most mental health conditions, producing results comparable to medication for mild to moderate depression and anxiety, and superior to medication alone for preventing relapse. Talking does not create problems; it processes them. The fear that talking worsens problems typically reflects either concern about the social consequences of disclosure (stigma) or the temporary discomfort of accessing difficult material that was being avoided — which is different from the material becoming worse.',
    why_harmful: 'This myth prevents the most accessible available mental health resource — genuine conversation — from being used. It also prevents professional help-seeking by reframing therapy as harmful.',
    student_example: 'Vikram was struggling after a significant loss in the family. His instinct was to push through, not talk about it. "In our family, you don\'t discuss feelings — you carry on." Three years later in therapy, he identified that the unprocessed grief had driven the anxiety and disconnection he had been living with since.',
    replace_with: 'Talking about mental health difficulties to a trusted person or professional is one of the most consistently evidence-based mental health interventions available.',
  },
  {
    num:   '06',
    myth:  'Therapy is only for "crazy" people or for those with severe conditions',
    color: '#C07800',
    bg:    '#FFF8E1',
    icon:  '🛋️',
    fact:  'Psychological therapy (talking therapy in its various evidence-based forms — cognitive behavioural therapy, acceptance and commitment therapy, interpersonal therapy) is recommended by international health bodies for a wide spectrum of conditions and challenges — from clinical disorders to life transitions, from relationship difficulties to academic performance anxiety. Research by NICE (UK), APA (US), and WHO consistently demonstrates effectiveness across this full spectrum. In India specifically, therapy for non-clinical challenges — stress management, relationship difficulties, decision-making support — is underutilised primarily because of the "therapy is for severe cases" myth.',
    why_harmful: 'This myth creates an unnecessary threshold for seeking support — people wait until their condition is "severe enough" to justify help, by which point significantly more suffering has occurred and recovery takes longer.',
    student_example: '"I felt like I wasn\'t bad enough to deserve a therapist. I wasn\'t hospitalised, I wasn\'t suicidal, I was just struggling. It took a year before I understood that struggling is enough reason — and that getting support earlier is always better than waiting." — Rohan',
    replace_with: 'Therapy is evidence-based support for a wide range of challenges — not a last resort for severe conditions. Seeking support early is more effective than waiting.',
  },
  {
    num:   '07',
    myth:  'Mental health conditions are a "Western concept" — they don\'t really apply in India',
    color: '#B54F20',
    bg:    '#FBF2EE',
    icon:  '🇮🇳',
    fact:  'Mental health conditions are human conditions — they occur across all cultures, all socioeconomic contexts, and all historical periods. The National Mental Health Survey of India (NIMHANS, 2016) documented that approximately 150 million Indians needed active mental health care — equivalent to the entire population of several European countries. Depression, anxiety, psychosis, and other conditions are not imported from Western contexts; they are documented extensively in Indian populations. What is culturally variable is how mental health difficulties are expressed, understood, and addressed — not whether they exist.',
    why_harmful: 'This myth is particularly dangerous in the Indian context because it is used to dismiss genuine psychological distress as cultural unfamiliarity with Western self-indulgence — a framing that prevents acknowledgment and help-seeking.',
    student_example: '"My grandmother told me that depression is something foreign people have when they have too much time and too few responsibilities. Meanwhile, my uncle had been managing what was clearly a serious mental health condition through untreated suffering for thirty years." — Ananya',
    replace_with: 'Mental health conditions are documented across all cultures. 150 million Indians need active mental health support. This is not a Western concept — it is a human reality.',
  },
  {
    num:   '08',
    myth:  'People with mental health conditions are dangerous or unpredictable',
    color: '#8B2635',
    bg:    '#FBF0F1',
    icon:  '⚠️',
    fact:  'Research consistently documents that the overwhelming majority of people with mental health conditions are not dangerous — and that people with mental health conditions are significantly more likely to be victims of violence than perpetrators. Research by Stuart (2003) and Large and Nielssen (2011) documents that the association between mental health conditions and violence is largely explained by co-occurring substance use, poverty, and childhood trauma — not by the mental health condition itself. The "dangerous mentally ill person" stereotype is driven by media coverage of rare exceptional cases and produces the stigma that prevents people from seeking help and from being treated with dignity.',
    why_harmful: 'This myth produces stigma that makes people afraid to disclose mental health conditions, refuse to support peers who are struggling, and perpetuates the dehumanising treatment of people with serious mental health conditions.',
    student_example: '"After I was hospitalised for a mental health episode and came back to school, I could feel people treating me differently — watching me, stepping back. I was the same person I had always been. The myth cost me friendships and made returning to school much harder than it needed to be." — Student voice, name withheld',
    replace_with: 'People with mental health conditions are overwhelmingly not dangerous. The primary risk they face is from stigma, discrimination, and lack of support — not from themselves.',
  },
  {
    num:   '09',
    myth:  'Posting about mental health struggles on social media is just attention-seeking',
    color: '#5B3A8B',
    bg:    '#F2EEF9',
    icon:  '📱',
    fact:  'Research on social disclosure of mental health experiences documents that the motivations for sharing mental health content on social media include: reducing personal isolation ("I am not alone in this"), reducing stigma for others who share the same experience, raising awareness, processing one\'s own experience through articulation, and genuine connection-seeking — all legitimate and valuable motivations. Research by Frost and Hoggett documents that public sharing of mental health experience is among the most effective available peer-to-peer stigma reduction interventions. Framing it as "attention-seeking" weaponises the need for connection and recognition as evidence of character failure.',
    why_harmful: 'This myth silences the most accessible platform through which young people can both process their own experience and help others feel less alone. It reinforces the isolation that makes mental health difficulties worse.',
    student_example: '"I posted honestly about my anxiety experience once and the response was overwhelming — dozens of people saying they had felt exactly the same way and never talked about it. The post wasn\'t attention-seeking. It was the beginning of people feeling less alone." — Priya',
    replace_with: 'Sharing mental health experiences is a legitimate, evidence-supported form of stigma reduction and connection. Dismissing it as attention-seeking is stigma in action.',
  },
  {
    num:   '10',
    myth:  'If someone is talking about suicide, they are just seeking attention — they won\'t actually do it',
    color: '#8B2635',
    bg:    '#FBF0F1',
    icon:  '🆘',
    fact:  'Any expression of suicidal ideation — directly stated, hinted, or expressed through behaviour changes — should be taken seriously and responded to with genuine attention and care. Research documents that the majority of people who die by suicide communicated their distress in some form beforehand — often dismissed at the time as "attention-seeking." Suicidal expression is communication of genuine distress, not performance. Research by Rudd and colleagues on suicidal risk assessment documents that taking suicidal expression seriously, asking directly about intent, and connecting the person to support are the most evidence-based responses — not dismissal.',
    why_harmful: 'This myth costs lives. It prevents the people around a struggling person from responding with the seriousness the situation deserves, and it leaves the struggling person feeling dismissed and more alone.',
    student_example: 'An important reminder: if someone in your life expresses suicidal thoughts or intentions — even casually — take it seriously. Ask directly: "Are you thinking about hurting yourself?" Listen fully. Help them connect with support. Do not dismiss, minimise, or leave them alone with it.',
    replace_with: 'Any expression of suicidal thought should be taken seriously. Ask directly. Listen fully. Connect with support. Every time.',
  },
];

// ── Scenario Myth Buster ──────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id:       1,
    scenario: 'Rahul has been struggling with persistent low mood, loss of interest in things he used to love, and difficulty getting out of bed for three weeks. His father tells him: "Stop being lazy. Push yourself. You\'ll feel better once you start doing things."',
    mythOptions: [
      { key: 'snap_out', label: 'You can snap out of depression with willpower', correct: true },
      { key: 'rare',     label: 'Mental health problems are rare', correct: false },
      { key: 'west',     label: 'It\'s a Western concept', correct: false },
    ],
    correctKey: 'snap_out',
    mythNum: '02',
    explanation: 'Rahul\'s father is operating from Myth 02: that depression is a willpower problem rather than a medical condition. The advice to "push yourself" ignores the neurobiological components of depression — the very symptoms making it hard to get out of bed (motivation impairment, fatigue, anhedonia) are the disease, not evidence of character failure. The appropriate response is support in accessing proper assessment and care.',
    color: '#5B3A8B',
  },
  {
    id:       2,
    scenario: 'Sania, a Class 12 topper who has never scored below 90%, tells a teacher she has been experiencing severe anxiety — unable to sleep, physical symptoms before exams, and persistent racing thoughts. The teacher responds: "But your grades are excellent — you clearly have nothing to worry about."',
    mythOptions: [
      { key: 'anxiety',   label: 'Anxiety is just normal nervousness', correct: false },
      { key: 'academic',  label: 'Academic success means you can\'t have a mental health problem', correct: true },
      { key: 'attention', label: 'It\'s just attention-seeking', correct: false },
    ],
    correctKey: 'academic',
    mythNum: '04',
    explanation: 'The teacher is operating from Myth 04: that academic performance is incompatible with genuine mental health difficulty. Sania\'s symptoms — sleep disruption, physical anxiety responses, racing thoughts — are classic anxiety presentations. Research specifically documents elevated anxiety rates among high achievers. Excellent grades do not exclude the possibility of a mental health condition; they sometimes exist because of the excessive cost being paid to maintain them.',
    color: TEAL,
  },
  {
    id:       3,
    scenario: 'Kiran is dealing with depression and tells her college friends she needs support. One friend says: "Don\'t make it worse by dwelling on it. Just distract yourself — talking about it too much is bad for you."',
    mythOptions: [
      { key: 'talk',      label: 'Talking about problems makes them worse', correct: true },
      { key: 'rare',      label: 'Mental health problems are rare', correct: false },
      { key: 'dangerous', label: 'People with mental health conditions are dangerous', correct: false },
    ],
    correctKey: 'talk',
    mythNum: '05',
    explanation: 'Kiran\'s friend is operating from Myth 05: that discussing psychological difficulties worsens them. Research by Pennebaker documents the opposite — processing difficult experiences through conversation and writing produces wellbeing improvements. "Distraction" from unprocessed psychological content is a short-term avoidance strategy that leaves the underlying material unresolved. The most evidence-based support Kiran could receive is genuine, compassionate conversation and professional processing — not avoidance.',
    color: '#2D6B45',
  },
  {
    id:       4,
    scenario: 'Dhruv has been feeling overwhelmed and considers seeing a counsellor. His friend says: "You don\'t need therapy — you\'re not crazy. Only people with serious problems go to therapists."',
    mythOptions: [
      { key: 'therapy',   label: 'Therapy is only for people with severe conditions', correct: true },
      { key: 'west',      label: 'It\'s a Western concept', correct: false },
      { key: 'willpower', label: 'You can snap out of it with willpower', correct: false },
    ],
    correctKey: 'therapy',
    mythNum: '06',
    explanation: 'Dhruv\'s friend is operating from Myth 06: that therapy is reserved for severe clinical cases. Psychological therapy is evidence-based support for the full spectrum from mild challenges to serious conditions — and the research consistently shows that earlier intervention produces better outcomes than waiting for a condition to become severe. Dhruv feeling overwhelmed is sufficient reason to access support. The appropriate threshold for seeking help is that something is affecting your wellbeing — not that it has become unmanageable.',
    color: '#C07800',
  },
  {
    id:       5,
    scenario: 'Aisha posts on Instagram about her mental health journey — sharing her experience with anxiety and what has helped. Several comments dismiss her: "Stop seeking attention. Everyone gets anxious sometimes. This is just for likes."',
    mythOptions: [
      { key: 'attention', label: 'Talking about mental health online is attention-seeking', correct: true },
      { key: 'rare',      label: 'Mental health conditions are rare', correct: false },
      { key: 'anxiety',   label: 'Anxiety is just normal nervousness', correct: false },
    ],
    correctKey: 'attention',
    mythNum: '09',
    explanation: 'The comments directed at Aisha are operating from Myth 09: that sharing mental health experience is attention-seeking. Research documents that public sharing of mental health experience is among the most effective peer-to-peer stigma reduction interventions available — and that the people who share are typically motivated by the desire to help others feel less alone, as well as to process their own experience. Dismissing this as attention-seeking silences the most accessible available platform for mental health normalisation and connection.',
    color: '#5B3A8B',
  },
];

function ScenarioMythBuster() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [done, setDone] = useState(false);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const sc = SCENARIOS[current];
  const total = SCENARIOS.length;
  const answered = Object.keys(answers).length;
  const correct = SCENARIOS.filter(s => answers[s.id] === s.correctKey).length;

  const userAns = answers[sc.id];
  const isRevealed = revealed[sc.id];
  const isCorrect = userAns === sc.correctKey;

  const handleAnswer = (key) => {
    if (answers[sc.id]) return;
    setAnswers(prev => ({ ...prev, [sc.id]: key }));
    setRevealed(prev => ({ ...prev, [sc.id]: true }));
  };

  const getLevel = () => {
    if (correct === total) return { label: 'Myth Buster Expert 🏆', msg: 'You identified every myth operating in every scenario. You are a genuine mental health ally — the person who can spot harmful beliefs in real situations and respond with evidence and compassion.', color: TEAL };
    if (correct >= 4) return { label: 'Myth Buster Advocate 💚', msg: 'Strong scenario recognition — you caught most of the operating myths. Review the ones you missed and you will be even better equipped to respond in real situations.', color: '#2D7A65' };
    if (correct >= 3) return { label: 'Myth Buster Learner 🌱', msg: 'Good progress. Scenario-based myth recognition is harder than statement-based — you are building the pattern recognition that real conversations require. Revisit the explanations for the scenarios you missed.', color: '#C07800' };
    return { label: 'Myth Buster Beginner 🔍', msg: 'The scenarios in real life are harder than the statements — myths are often invisible in them. Read through each explanation carefully. The awareness you are building is exactly what May\'s content is designed to produce.', color: '#2D5A8A' };
  };

  if (done) {
    const level = getLevel();
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font, textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🏆</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: level.color, marginBottom: '5px' }}>{level.label}</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '40px', fontWeight: '700', color: level.color, marginBottom: '10px' }}>{correct}/{total}</div>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.75, maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>{level.msg}</p>
        <div style={{ background: TPALE, border: `1.5px solid ${TBORD}`, borderRadius: '12px', padding: '14px', marginBottom: '16px', textAlign: 'left' }}>
          {SCENARIOS.map(s => {
            const ans = answers[s.id];
            const correct = ans === s.correctKey;
            const correctOption = s.mythOptions.find(o => o.key === s.correctKey);
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{correct ? '✅' : '❌'}</span>
                <span style={{ fontSize: '12px', color: 'var(--ink)', lineHeight: 1.5 }}>
                  Scenario {s.id}: <strong style={{ color: s.color }}>Myth {s.mythNum}</strong> — {correctOption?.label}
                </span>
              </div>
            );
          })}
        </div>
        <button onClick={() => { setCurrent(0); setAnswers({}); setRevealed({}); setDone(false); }} style={{ padding: '12px 28px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${TEAL}, #3A8898)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>↺ Play Again</button>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: TEAL, textTransform: 'uppercase', letterSpacing: '1px' }}>SPOT THE MYTH</span>
        <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Scenario {current + 1} of {total}</span>
      </div>
      <div style={{ width: '100%', height: '5px', borderRadius: '3px', background: 'var(--border)', marginBottom: '18px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: `linear-gradient(90deg, ${TEAL}, #3A8898)`, width: `${((current + 1) / total) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      <div style={{ background: 'white', borderRadius: '13px', padding: '18px', marginBottom: '14px', border: `1.5px solid var(--border)` }}>
        <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: TEAL, marginBottom: '8px', letterSpacing: '1px' }}>🎬 THE SCENARIO:</div>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.8, fontStyle: 'italic' }}>"{sc.scenario}"</p>
      </div>

      <p style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '700', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Which myth is operating here?</p>

      {!isRevealed ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {sc.mythOptions.map(opt => (
            <button key={opt.key} onClick={() => handleAnswer(opt.key)} style={{ padding: '14px 16px', borderRadius: '11px', border: '2px solid var(--border)', background: 'white', cursor: 'pointer', fontFamily: font, fontSize: '13px', fontWeight: '500', color: 'var(--ink)', textAlign: 'left', lineHeight: 1.5, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.background = TPALE; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; }}>
              🎯 {opt.label}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ animation: 'floatUp 0.3s ease', marginBottom: '14px' }}>
          {/* Show options with results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            {sc.mythOptions.map(opt => {
              const isSelected = userAns === opt.key;
              const isRight = opt.key === sc.correctKey;
              let bg = 'white', border = 'var(--border)', color = 'var(--muted)';
              if (isRight) { bg = TPALE; border = TEAL; color = TEAL; }
              if (isSelected && !isRight) { bg = '#FBF0F1'; border = '#8B2635'; color = '#8B2635'; }
              return (
                <div key={opt.key} style={{ padding: '12px 14px', borderRadius: '10px', border: `2px solid ${border}`, background: bg, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{isRight ? '✅' : isSelected ? '❌' : '○'}</span>
                  <span style={{ fontSize: '13px', color, fontWeight: isRight || (isSelected && !isRight) ? '700' : '400' }}>{opt.label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ background: isCorrect ? TPALE : '#FBF0F1', border: `2px solid ${isCorrect ? TEAL : '#8B2635'}`, borderRadius: '12px', padding: '16px', marginBottom: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: isCorrect ? TEAL : '#8B2635', marginBottom: '8px' }}>
              {isCorrect ? '✅ Correct — Myth ' : '❌ Not quite — the operating myth was Myth '}{sc.mythNum}
            </div>
            <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75 }}>{sc.explanation}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {current < total - 1 ? (
              <button onClick={() => setCurrent(c => c + 1)} style={{ padding: '12px 28px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${TEAL}, #3A8898)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>
                Next Scenario →
              </button>
            ) : (
              <button onClick={() => setDone(true)} style={{ padding: '12px 28px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${TEAL}, #3A8898)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>
                See My Level 🏆
              </button>
            )}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>{answered} scenario{answered !== 1 ? 's' : ''} answered · {total - answered} remaining</div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function MentalHealthMyths({ navigate, relatedPosts }) {
  const [expandedMyth, setExpandedMyth] = useState(null);
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
      <p>A mental health myth is not a harmless misunderstanding — it is a specific barrier between a person who needs support and the support that exists for them. Every time someone does not seek help because they believe their struggles are a sign of weakness, every time someone dismisses a friend's genuine distress as attention-seeking, every time someone suffers through an untreated condition because they believe treatment is only for "serious cases" — a myth has done its damage.</p>

      <p>May is Mental Health Awareness Month, and this list exists because awareness begins with accurate information replacing inaccurate information. Each of these ten <strong>mental health myths</strong> is specifically harmful in the student context — each has been cited as a reason students in India did not seek help when they needed it. Each fact that follows is the replacement. Read them. Share them. Challenge them when you hear them.</p>

      <img
        src={meta.imgUrl}
        alt="10 common mental health myths students should stop believing — debunked with facts and student-focused examples"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Why Myths Section ── */}
      <h3 id="why-myths">Why Mental Health Myths Are Harmful</h3>
      <p>Research on mental health stigma identifies beliefs as the primary mechanism through which stigma operates. The person who believes depression is a willpower failure does not seek help for their own depression and does not support others seeking help for theirs. The person who believes mental health difficulties are rare never recognises their own experience as something that qualifies for support. The person who believes therapy is for "serious cases" waits until a crisis to reach for the help that would have been far more effective earlier. Myths do not just misrepresent reality — they actively prevent the responses that accurate reality would produce. This is why debunking them specifically, with evidence and with the human cost of each myth named plainly, is mental health work — not just information work.</p>

      {/* ── The 10 Myths ── */}
      <h3 id="ten-myths">The 10 Mental Health Myths — Debunked</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', fontFamily: font }}>
        {MYTHS.map((m) => {
          const isOpen = expandedMyth === m.num;
          return (
            <div key={m.num} style={{ background: 'white', borderRadius: '14px', border: `1.5px solid ${isOpen ? m.color : 'var(--border)'}`, overflow: 'hidden', transition: 'all 0.15s' }}>
              <button onClick={() => setExpandedMyth(isOpen ? null : m.num)} style={{ width: '100%', padding: '16px 18px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', fontFamily: font, textAlign: 'left' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: m.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>MYTH {m.num}</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '700', color: isOpen ? m.color : 'var(--ink)', lineHeight: 1.4 }}>"{m.myth}"</div>
                </div>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isOpen ? m.color : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', flexShrink: 0, transition: 'all 0.2s' }}>
                  {isOpen ? '▲' : '▼'}
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: '0 18px 18px 18px', borderTop: `1px solid ${m.color}15`, animation: 'floatUp 0.3s ease' }}>
                  {/* Debunk */}
                  <div style={{ background: TPALE, borderRadius: '10px', padding: '13px 15px', marginTop: '14px', marginBottom: '12px', border: `1.5px solid ${TBORD}`, borderLeft: `4px solid ${TEAL}` }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: TEAL, marginBottom: '5px', letterSpacing: '1px' }}>🔬 THE FACT:</div>
                    <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.8 }}>{m.fact}</p>
                  </div>

                  {/* Why harmful */}
                  <div style={{ background: '#FBF0F1', borderRadius: '9px', padding: '11px 13px', marginBottom: '10px', border: '1px solid rgba(139,38,53,0.15)' }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: '#8B2635', marginBottom: '4px' }}>⚠️ WHY THIS MYTH IS HARMFUL:</div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink)', lineHeight: 1.65 }}>{m.why_harmful}</p>
                  </div>

                  {/* Student example */}
                  <div style={{ background: m.bg, borderRadius: '9px', padding: '11px 13px', marginBottom: '10px', border: `1px solid ${m.color}20` }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: m.color, marginBottom: '4px' }}>👤 STUDENT EXAMPLE:</div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.65, fontStyle: 'italic' }}>{m.student_example}</p>
                  </div>

                  {/* Replace with */}
                  <div style={{ background: `${TEAL}10`, borderRadius: '9px', padding: '10px 13px', border: `1.5px solid ${TEAL}20` }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: TEAL, marginBottom: '3px' }}>✅ REPLACE WITH:</div>
                    <p style={{ margin: 0, fontSize: '13px', color: TEAL, lineHeight: 1.6, fontWeight: '600' }}>{m.replace_with}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Interactive ── */}
      <h3 id="buster">Interactive: The Scenario Myth Buster</h3>
      <p>Five realistic student scenarios — each one containing an operating myth. Your challenge is to identify which myth from this list is operating in each scenario. This tests not just whether you can recognise myth statements, but whether you can spot them in the way real situations present them — which is where the awareness actually matters.</p>

      <ScenarioMythBuster />

      {/* ── FAQs ── */}
      <h3 id="faq">Mental Health Myths FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: How do I challenge mental health myths when I hear them without starting an argument?</strong><br />
        A: The most effective myth-challenging approach is usually a brief, factual, non-confrontational correction rather than an argument: "Actually, I read recently that depression is a medical condition — not a willpower problem. The neuroscience is pretty clear on that." You are not challenging the person's character or intelligence — you are providing a piece of information they may not have had. Most people who hold mental health myths do so because accurate information was not available to them, not because they have deeply considered and chosen the harmful belief. Treat the myth as a gap to fill rather than an attack to repel, and the exchange is more likely to be received.</p>

        <p><strong>Q: I recognise some of these myths in things I genuinely believe about myself — what should I do?</strong><br />
        A: The most important first step is exactly what you have already done — recognising the myth as a myth rather than a fact. The beliefs we hold about mental health apply to ourselves as well as to others, and the person who believes "I should be able to handle this myself" or "I am not bad enough to deserve support" is applying a myth to their own experience that prevents appropriate self-care. If you recognise a myth that has been shaping your relationship with your own mental health, consider what the fact-based alternative means for you specifically: if depression is a medical condition rather than a willpower failure, what does that mean for how you have been treating your own low mood? If therapy is appropriate for anyone whose wellbeing is affected, does your current experience qualify? The facts are as available to you as to anyone else.</p>

        <p><strong>Q: Are there mental health myths specific to the Indian context that are not covered here?</strong><br />
        A: Yes, several cultural-context specific myths are particularly prevalent in India and are worth naming. The "mental illness is God's punishment or karma" framework frames psychological distress as spiritual failing rather than medical need — preventing help-seeking in religious families. The "family matters should stay within the family" framework frames sharing mental health difficulties outside the family (including with professionals) as betrayal or shame — particularly affecting young people whose distress is family-related. The "our generation managed without all this" framework invalidates the specific challenges facing young people today by comparison with previous generations who "managed" — often through suppression, substance use, or silence about genuine suffering. Each of these requires specific, culturally sensitive responses — which May's content will continue to address.</p>
      </div>

      {/* ── Final ── */}
      <div style={{ background: TPALE, border: `2px solid ${TBORD}`, borderRadius: '16px', padding: '24px', marginBottom: '30px', textAlign: 'center', fontFamily: font }}>
        <h2 style={{ fontFamily: 'Fraunces', color: TEAL, fontStyle: 'italic', marginBottom: '14px', lineHeight: '1.4', fontSize: '24px' }}>
          "Every myth replaced by a fact is a barrier removed between a person who needs support and the support that exists for them."
        </h2>
        <p style={{ margin: '0 0 20px 0', color: 'var(--ink-soft)', lineHeight: 1.7 }}>Share this list. Challenge one myth this week. And if any of the facts in this list changed something about how you see your own experience — consider what that change makes possible.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/mindspace')} style={{ background: `linear-gradient(135deg, ${TEAL}, #3A8898)`, color: 'white', border: 'none', padding: '14px 26px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
            Access Mind Space →
          </button>
          <button onClick={() => navigate('/safe')} style={{ background: 'white', color: TEAL, border: `2px solid ${TEAL}`, padding: '14px 26px', borderRadius: '50px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
            Visit Safe Corner
          </button>
        </div>
      </div>

      {/* Internal links */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from May's Mental Health Awareness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mental-health-awareness-2026',   '→ Why Mental Health Awareness Matters More Than Ever in 2026'],
            ['/blog/manage-emotions-mindfulness',    '→ How to Manage Emotions Using Mindfulness Techniques'],
            ['/blog/mindfulness-reduce-anxiety',     '→ How Mindfulness Helps Reduce Anxiety Naturally'],
            ['/blog/emotional-awareness-daily',      '→ How to Become More Emotionally Aware Every Day'],
            ['/safe',                                '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: TEAL, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
