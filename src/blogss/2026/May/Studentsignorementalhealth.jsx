import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "Why Students Ignore Mental Health Issues (And the Hidden Impact)",
  excerpt: "Ignoring mental health difficulties is rarely a conscious choice — it is a predictable response to a set of specific structural and psychological barriers that student environments consistently produce. Understanding why students ignore mental health issues is the first step toward changing the conditions that make ignoring feel like the only option.",
  category: "Mental Health",
  date: "03-05-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/May/students-ignore-mental-health.jpg",
  tldr: "Students ignore mental health issues for six specific and identifiable reasons — stigma, fear of academic consequences, family expectations, lack of awareness, feeling unworthy of support, and not knowing where to go. Each reason has a hidden academic and social cost that compounds over time. This guide covers all six reasons and their consequences, with an interactive Barrier Finder that identifies your specific barrier and generates a personalised solution pathway.",
  toc: [
    { id: "why-ignore",   title: "1. Why Students Don't Seek Help — The Six Barriers",             level: 3 },
    { id: "academic",     title: "2. The Hidden Academic Impact",                                   level: 3 },
    { id: "social",       title: "3. The Hidden Social Impact",                                    level: 3 },
    { id: "finder",       title: "4. Interactive: The Personal Barrier Finder",                    level: 3 },
    { id: "solutions",    title: "5. Actionable Solutions for Each Barrier",                       level: 3 },
    { id: "faq",          title: "6. Student Mental Health Help-Seeking FAQs",                     level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-05-03T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "student mental health issues, why students don't seek mental health help, mental health stigma students, student mental health consequences, student mental health barriers, help seeking mental health students India",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why do students ignore mental health problems?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Research identifies six primary reasons students ignore mental health problems. First, stigma: the fear of being labelled 'weak,' 'crazy,' or 'dramatic' prevents disclosure. Second, fear of consequences: students worry that seeking help will affect academic standing, parental relationships, or future opportunities. Third, family expectations: in cultures where mental health is not acknowledged or is treated as shame, family context makes seeking help feel like betrayal. Fourth, lack of awareness: students do not recognise their experience as a mental health condition that qualifies for support. Fifth, feeling unworthy: the belief that their problems are not 'bad enough' to deserve professional attention. Sixth, not knowing where to go: even motivated students often do not know what resources are available or how to access them.",
      },
    },
    {
      "@type": "Question",
      "name": "What happens when student mental health issues are ignored?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When student mental health issues are ignored, the consequences compound across multiple domains. Academically: research documents that untreated anxiety and depression directly impair working memory, attentional control, and information processing — producing declining grades, increased absenteeism, difficulty concentrating, and in severe cases, academic withdrawal or failure. The academic consequences of untreated mental health conditions are often mistakenly attributed to laziness or insufficient effort, which adds shame to the original difficulty. Socially: untreated mental health conditions produce progressive social withdrawal, relationship deterioration, increasing isolation, and the loss of the social support that is the most powerful available protective factor against worsening. Physically: research documents that chronic psychological stress without intervention produces measurable immune function impairment, sleep disruption, and physical health consequences. Long-term: early untreated mental health conditions are documented predictors of more severe conditions in adulthood, with research showing that approximately 75% of adult mental health conditions began before age 25.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const INDIGO  = '#5A3878';
const IPALE   = '#F2EEF8';
const IBORD   = 'rgba(90,56,120,0.22)';

// ── The Six Barriers ──────────────────────────────────────────────────────────
const BARRIERS = [
  {
    key:   'stigma',
    num:   '01',
    icon:  '😔',
    label: 'Stigma and fear of being judged',
    desc:  'Worried about being seen as weak, dramatic, or "crazy" by peers, family, or teachers',
    color: '#8B2635',
    bg:    '#FBF0F1',
    why_exists: 'Stigma is a social mechanism — it is the negative evaluation of a characteristic that culture has marked as undesirable. Mental health stigma in India specifically has deep cultural roots: frameworks that associate psychological distress with weakness, spiritual failing, or family shame. For students whose social standing depends significantly on how peers and family perceive them, the risk of stigma feels genuinely high — because it is. The social cost of disclosure in unsupportive environments is real.',
    hidden_cost: 'Stigma produces silence, and silence compounds suffering. The student who does not disclose their anxiety because of fear of judgment continues to experience the anxiety alone — without the social support that research identifies as the most powerful available protective factor, without the professional support that produces the most efficient recovery, and with the added psychological cost of maintaining the performance of "being fine."',
    academic_impact: 'Students avoiding help due to stigma often develop compensatory perfectionistic behaviours — working harder to appear unaffected — which produces the specific cognitive pattern of anxious overperformance until eventual burnout.',
    social_impact: 'Progressive isolation: the energy required to maintain the appearance of wellness reduces available energy for genuine social engagement, producing the lonely paradox of seeming fine while becoming increasingly alone.',
    solution: 'Find one person you trust enough to be honest with — a single genuine disclosure to one trusted person is both the smallest and the most effective available first step. Stigma loses power when the experience of disclosure does not produce the feared consequence.',
    first_action: 'Write privately what you would say to a trusted friend about what you have been experiencing. You do not have to share it. The writing itself breaks the silence internally — which is the first layer of stigma reduction.',
  },
  {
    key:   'consequences',
    num:   '02',
    icon:  '⚡',
    label: 'Fear of academic or career consequences',
    desc:  'Worried that seeking help will affect grades, college applications, or parental trust',
    color: '#C07800',
    bg:    '#FFF8E1',
    why_exists: 'The belief that seeking mental health support will result in academic penalties, be noted on records, or reduce opportunities is a significant and understandable barrier — particularly in the high-stakes examination culture of India where students are aware of how completely future trajectories depend on academic assessments. In some cases, this fear is based on genuine institutional failures (schools that have treated mental health disclosures punitively); in most cases, it reflects the generalisation of legitimate institutional concern into an unfounded belief that seeking support is itself risky.',
    hidden_cost: 'The irony of this barrier is significant: the untreated mental health condition produces more academic consequences than the act of seeking support ever would. Unaddressed anxiety and depression directly impair the cognitive processes required for academic performance — working memory, attentional control, processing speed, and retrieval — producing the declining grades that students fear seeking help might produce.',
    academic_impact: 'Untreated anxiety specifically impairs exam performance through the specific mechanism Beilock documents: it occupies the working memory that the exam requires, producing the experience of "blanking" that prepared students cannot explain.',
    social_impact: 'The fear of consequences isolates students from the support networks — counsellors, trusted teachers, supportive peers — that would most effectively help. The student managing alone manages worse.',
    solution: 'Mental health support records at school counsellors are typically confidential and do not affect academic records. Professional mental health support outside the school is completely separate from academic records. Understanding the actual confidentiality of different support avenues removes the most common factual basis for this fear.',
    first_action: 'Find out the specific confidentiality policy of your school or college counselling service. Ask directly: "Is this confidential? Under what circumstances would it be shared?" Having accurate information replaces generalised fear with specific, manageable facts.',
  },
  {
    key:   'family',
    num:   '03',
    icon:  '🏠',
    label: 'Family expectations and cultural context',
    desc:  'Family does not acknowledge mental health, treats it as weakness, or considers seeking help shameful',
    color: '#2D5A8A',
    bg:    '#EEF3FB',
    why_exists: 'In many Indian families, the cultural frameworks through which psychological difficulty is understood do not include mental health as a category — distress is framed as laziness, weakness of character, spiritual failing, or something to be overcome through discipline and prayer. The family is also the primary social unit whose approval matters most to most students — making the prospect of disclosure particularly fraught when the family context is unsupportive.',
    hidden_cost: 'The family context creates a specific compound barrier: the student is both struggling and carrying the additional burden of knowing that acknowledging the struggle would produce family conflict or shame. This double burden increases the psychological load while removing the most immediately available support structure.',
    academic_impact: 'Students managing unsupportive family contexts alongside mental health difficulties face additional cognitive load from the family stress itself — research on adverse family environments documents direct impacts on prefrontal function and academic performance.',
    social_impact: 'Unsupportive family contexts reduce the baseline sense of safety that research identifies as essential for genuine help-seeking. Students in these contexts are specifically likely to underreport distress and specifically unlikely to seek professional support.',
    solution: 'Professional support can be accessed without family knowledge in most cases — school counsellors (often confidential), online therapy platforms, and helplines do not require parental consent for students over certain ages. Understanding what is available that does not require navigating family barriers is the practical path forward.',
    first_action: 'Identify one adult outside your family who has demonstrably responded to student difficulty with understanding rather than judgment — a school counsellor, a trusted teacher, an older mentor. This is your first available supportive adult who is not subject to family dynamics.',
  },
  {
    key:   'unrecognised',
    num:   '04',
    icon:  '🌫️',
    label: 'Not recognising that what they are experiencing is a mental health issue',
    desc:  'The feeling exists but is attributed to personality ("I am just a worrier"), situation ("everyone is stressed"), or physical causes',
    color: '#2D6B45',
    bg:    '#E8F4EE',
    why_exists: 'Without mental health literacy — specific, accurate knowledge about what different conditions look like — students cannot identify that their experience is a recognised condition that qualifies for support rather than simply their personality, the normal experience of student life, or a temporary situational response. This is not failure of intelligence; it is the predictable result of receiving no formal mental health education during the years when these conditions typically develop.',
    hidden_cost: 'Unrecognised conditions are untreated conditions. The specific cost of non-recognition is the years between onset and help-seeking — research documents an average of 11 years between the onset of mental health symptoms and the receipt of treatment in many countries. Each of those years carries the academic, social, and personal costs of the untreated condition.',
    academic_impact: 'Students who attribute anxiety to "just being a worrier" or depression to "just being lazy" apply the wrong solutions (trying harder, pushing through) to conditions that require different interventions — producing frustration on top of the original difficulty.',
    social_impact: 'Unrecognised mental health conditions produce social effects that the student cannot understand or explain — withdrawal, irritability, reduced engagement — which damage relationships without the student being able to account for the change.',
    solution: 'Mental health literacy — specific knowledge about how common conditions present — is the direct solution to non-recognition. The recognition checklist at the end of this guide and SecretSharz\'s content on specific conditions provides this knowledge specifically for student audiences.',
    first_action: 'Take the free PHQ-9 (depression) and GAD-7 (anxiety) self-assessments online — these are the validated tools used in clinical settings and are available freely. They do not diagnose; they tell you whether your experience falls in a range that would typically benefit from professional assessment.',
  },
  {
    key:   'unworthy',
    num:   '05',
    icon:  '🫙',
    label: 'Feeling that their problems are "not bad enough" to deserve help',
    desc:  'Comparing their struggles to those of others and concluding that their need is too small to warrant support',
    color: INDIGO,
    bg:    IPALE,
    why_exists: 'The "not bad enough" barrier is produced by the combination of stigma (making help-seeking feel like an admission of serious pathology) and social comparison (always finding someone whose situation seems worse). It reflects a specific cognitive error: the belief that support is a finite resource available only to the most severely affected, and that accessing it for moderate difficulty takes it from someone who needs it more.',
    hidden_cost: 'The "not bad enough" threshold for seeking help is typically too high — and it rises the longer the untreated condition continues. By the time most students decide they are "bad enough," significantly more suffering has occurred and recovery takes longer. Early support for moderate difficulty is consistently more effective than delayed support for severe difficulty.',
    academic_impact: '"Not bad enough to affect studying" is often inaccurate even when it feels true — research shows significant academic performance impairment beginning at subclinical levels of anxiety and depression, well below the threshold where students typically decide they need help.',
    social_impact: '"Not bad enough" students often continue social functioning while their relationships become increasingly surface-level — maintaining the form of connection while losing the genuine engagement that makes relationships restorative.',
    solution: 'The threshold for seeking support is not "severe suffering" — it is "my wellbeing is being affected." If anything in your mental life is affecting your enjoyment, your relationships, your sleep, your study, or your capacity to engage with your own life — that is sufficient reason to access support.',
    first_action: 'Write down three ways your current mental experience is affecting your life. If you can write three things, you qualify for support. The question is never "is this bad enough?" — it is "would this be better with appropriate help?"',
  },
  {
    key:   'access',
    num:   '06',
    icon:  '❓',
    label: 'Not knowing where to go or how to access help',
    desc:  'Knowing something is wrong but not knowing what kind of help exists or how to find it',
    color: '#9A6040',
    bg:    '#FAF3EE',
    why_exists: 'Mental health care navigation is a genuinely complex task — understanding the difference between a counsellor, a psychologist, and a psychiatrist; knowing what confidential school support is available; knowing which helplines are appropriate for what kind of distress; knowing whether online platforms are legitimate and evidence-based. In the absence of formal mental health education, most students do not have this navigation knowledge — and the moment of crisis is the worst possible time to acquire it.',
    hidden_cost: 'Motivated students who cannot find appropriate support give up searching and conclude that support is unavailable — when it is available but inaccessible. This produces the specific experience of "I tried but couldn\'t get help," which is more demoralising than never having tried.',
    academic_impact: 'Students who cannot navigate to appropriate support often turn to peer advice, internet searching, or self-management strategies of variable evidence quality — some of which are helpful and some of which are actively counterproductive.',
    social_impact: 'Inability to access formal support increases dependence on informal peer support — which is valuable but has genuine limitations, particularly for conditions that require professional intervention.',
    solution: 'The resource map below provides the specific resources available to Indian students — categorised by type, availability, and cost. Having this map before it is needed is the preparation that removes this barrier entirely.',
    first_action: 'Save three resources in your phone contacts right now — before you need them. iCall: 9152987821. Vandrevala Foundation: 1860-2662-345. SecretSharz Safe Corner: /safe. Having them already available removes the navigation barrier entirely.',
  },
];

// ── Finder Component ───────────────────────────────────────────────────────────
function PersonalBarrierFinder() {
  const [step,     setStep]     = useState(1);
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [openB,    setOpenB]    = useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const toggleBarrier = (key) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const selectedBarriers = BARRIERS.filter(b => selected.includes(b.key));

  const handleReset = () => { setStep(1); setSelected([]); setRevealed(false); setOpenB(null); };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2].map(s => <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? INDIGO : 'var(--border)', transition: 'background 0.3s' }} />)}
      </div>

      {step === 1 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Which barriers do you recognise — in yourself or in others?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.65 }}>
            Select all that apply. You can select multiple barriers. Be honest — this tool is for your understanding, not performance.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {BARRIERS.map(b => {
              const isSel = selected.includes(b.key);
              return (
                <button key={b.key} onClick={() => toggleBarrier(b.key)} style={{
                  padding: '13px 15px', borderRadius: '12px', border: '2px solid',
                  borderColor: isSel ? b.color : 'var(--border)', background: isSel ? b.bg : 'white',
                  cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'flex-start', gap: '12px',
                  boxShadow: isSel ? `0 0 0 2px ${b.color}20` : 'none',
                }}>
                  <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: `2px solid ${isSel ? b.color : 'var(--border)'}`, background: isSel ? b.color : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', transition: 'all 0.2s' }}>
                    {isSel && <span style={{ color: 'white', fontSize: '12px', fontWeight: '700' }}>✓</span>}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: isSel ? b.color : 'var(--ink)', marginBottom: '2px' }}>{b.icon} {b.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.4 }}>{b.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {selected.length === 0 && (
            <div style={{ background: IPALE, border: `1px solid ${IBORD}`, borderRadius: '9px', padding: '10px 13px', marginBottom: '14px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: INDIGO, lineHeight: 1.6 }}>💡 Even if no barrier currently applies to you personally, selecting barriers you observe in others will generate support strategies useful for supporting friends and peers.</p>
            </div>
          )}

          <button onClick={() => { if (selected.length > 0) setStep(2); }} disabled={selected.length === 0} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: selected.length > 0 ? `linear-gradient(135deg, ${INDIGO}, #7A58A8)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: selected.length > 0 ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: selected.length > 0 ? `0 6px 18px ${IBORD}` : 'none' }}>
            {selected.length > 0 ? `See Personalised Strategies for ${selected.length} Barrier${selected.length > 1 ? 's' : ''} →` : 'Select at least one barrier to continue'}
          </button>
        </>
      )}

      {step === 2 && !revealed && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Your Personal Barrier Profile
          </p>
          <div style={{ background: IPALE, border: `1.5px solid ${IBORD}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: INDIGO, marginBottom: '8px' }}>YOU SELECTED {selected.length} BARRIER{selected.length > 1 ? 'S' : ''}:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {selectedBarriers.map(b => (
                <span key={b.key} style={{ padding: '4px 10px', borderRadius: '20px', background: b.bg, border: `1.5px solid ${b.color}30`, fontSize: '12px', fontWeight: '700', color: b.color }}>{b.icon} {b.label.split(' ').slice(0, 3).join(' ')}...</span>
              ))}
            </div>
          </div>
          <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '15px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${INDIGO}, #7A58A8)`, color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font, boxShadow: `0 6px 20px ${IBORD}` }}>
            💜 Reveal My Strategy Plan
          </button>
          <button onClick={() => setStep(1)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font, display: 'block' }}>
            ← Change selections
          </button>
        </>
      )}

      {step === 2 && revealed && (
        <div style={{ animation: 'floatUp 0.4s ease' }}>
          <div style={{ background: `linear-gradient(135deg, ${INDIGO}, #7A58A8)`, borderRadius: '14px', padding: '20px', marginBottom: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '26px', marginBottom: '5px' }}>💜</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '19px', fontWeight: '700', color: 'white', marginBottom: '3px' }}>Your Barrier Strategy Plan</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.88)' }}>{selected.length} barrier{selected.length > 1 ? 's' : ''} identified · {selected.length} solution path{selected.length > 1 ? 'ways' : 'way'}</div>
          </div>

          {selectedBarriers.map(b => {
            const isOpen = openB === b.key;
            return (
              <div key={b.key} style={{ background: 'white', borderRadius: '13px', marginBottom: '10px', border: `2px solid ${b.color}25`, overflow: 'hidden' }}>
                <button onClick={() => setOpenB(isOpen ? null : b.key)} style={{ width: '100%', padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: font, textAlign: 'left' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{b.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: b.color, textTransform: 'uppercase', marginBottom: '1px' }}>Barrier {b.num}</div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: b.color }}>{b.label}</div>
                  </div>
                  <span style={{ color: b.color, fontSize: '13px' }}>{isOpen ? '▲' : '▼'}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 16px 16px 16px', borderTop: `1px solid ${b.color}15` }}>
                    <div style={{ background: b.bg, borderRadius: '9px', padding: '11px 13px', marginTop: '12px', marginBottom: '10px', border: `1px solid ${b.color}20` }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: b.color, marginBottom: '4px', textTransform: 'uppercase' }}>🧠 Why This Barrier Exists:</div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>{b.why_exists}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                      <div style={{ background: '#FBF0F1', borderRadius: '9px', padding: '10px 12px', border: '1px solid rgba(139,38,53,0.15)' }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: '#8B2635', marginBottom: '4px', textTransform: 'uppercase' }}>📚 Academic Impact:</div>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{b.academic_impact}</p>
                      </div>
                      <div style={{ background: IPALE, borderRadius: '9px', padding: '10px 12px', border: `1px solid ${IBORD}` }}>
                        <div style={{ fontSize: '10px', fontWeight: '700', color: INDIGO, marginBottom: '4px', textTransform: 'uppercase' }}>👥 Social Impact:</div>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{b.social_impact}</p>
                      </div>
                    </div>
                    <div style={{ background: `${b.color}10`, borderRadius: '9px', padding: '11px 13px', marginBottom: '8px', border: `1.5px solid ${b.color}25` }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: b.color, marginBottom: '4px', textTransform: 'uppercase' }}>🛠️ Solution:</div>
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65 }}>{b.solution}</p>
                    </div>
                    <div style={{ background: `${INDIGO}12`, borderRadius: '9px', padding: '10px 13px', border: `2px solid ${INDIGO}25` }}>
                      <div style={{ fontSize: '10px', fontWeight: '700', color: INDIGO, marginBottom: '3px', textTransform: 'uppercase' }}>⚡ First Action — Do This Today:</div>
                      <p style={{ margin: 0, fontSize: '13px', color: INDIGO, lineHeight: 1.65, fontWeight: '600' }}>{b.first_action}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ background: IPALE, border: `1.5px dashed ${IBORD}`, borderRadius: '12px', padding: '13px 17px', marginTop: '12px', marginBottom: '14px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '600', color: INDIGO, fontStyle: 'italic', lineHeight: 1.55 }}>
              "Every barrier to help-seeking has a specific pathway through it. You have just found yours."
            </p>
          </div>
          <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${IBORD}`, color: INDIGO, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Explore different barriers</button>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function StudentsIgnoreMentalHealth({ navigate, relatedPosts }) {
  const [openBarrier, setOpenBarrier] = useState(null);
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
      <p>A student sits in an examination hall with anxiety so severe their hands are shaking. They tell no one. A student withdraws from their friend group, stops attending college for weeks. Their peers assume it is a phase. A student has not slept properly in months, cannot concentrate, and feels genuinely hopeless. They continue submitting assignments and attending class. None of these students are making a rational choice to ignore their mental health. They are responding, predictably and understandably, to a set of barriers that student life reliably produces.</p>

      <p>Understanding why <strong>student mental health issues</strong> go unacknowledged and untreated is not about placing blame on students for failing to seek help — it is about understanding the systems and beliefs that make ignoring feel like the most viable option. When we understand the why, we can begin to address it.</p>

      <img
        src={meta.imgUrl}
        alt="Why students ignore mental health issues — stigma, fear, academic and social consequences, and actionable solutions"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-ignore">1. Why Students Don't Seek Help — The Six Barriers</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px', fontFamily: font }}>
        {BARRIERS.map(b => {
          const isOpen = openBarrier === b.key;
          return (
            <div key={b.key} style={{ background: 'white', borderRadius: '13px', border: `1.5px solid ${isOpen ? b.color : 'var(--border)'}`, overflow: 'hidden', transition: 'all 0.15s' }}>
              <button onClick={() => setOpenBarrier(isOpen ? null : b.key)} style={{ width: '100%', padding: '15px 17px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '13px', fontFamily: font, textAlign: 'left' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: b.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{b.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: b.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>Barrier {b.num}</div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: isOpen ? b.color : 'var(--ink)' }}>{b.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '1px' }}>{b.desc}</div>
                </div>
                <span style={{ color: b.color, fontSize: '14px', flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div style={{ padding: '0 17px 16px 17px', borderTop: `1px solid ${b.color}15` }}>
                  <p style={{ margin: '12px 0 12px 0', fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.8 }}>{b.why_exists}</p>
                  <div style={{ background: b.bg, borderRadius: '10px', padding: '12px 14px', border: `1px solid ${b.color}20` }}>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: b.color, marginBottom: '5px', textTransform: 'uppercase' }}>⚡ FIRST ACTION:</div>
                    <p style={{ margin: 0, fontSize: '13px', color: b.color, lineHeight: 1.65, fontWeight: '600' }}>{b.first_action}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Section 2 ── */}
      <h3 id="academic">2. The Hidden Academic Impact</h3>

      <p><strong>The cognitive cost — what untreated mental health does to studying.</strong> The academic consequences of untreated anxiety and depression are specific and measurable. Research by Beilock at Chicago on test anxiety documents that anxiety specifically occupies working memory — consuming the same cognitive resource that exam performance requires. The anxious student is not performing from their full cognitive capacity; they are performing from whatever remains after anxiety has taken its share. For depression, research by Gotlib and Hammen documents impairments in attentional control, processing speed, and memory consolidation — the specific processes required for learning and retention.</p>

      <p><strong>The compounding timeline — how ignoring builds cost.</strong> Week one of unacknowledged anxiety: slightly reduced study quality, early sleep disruption. Week four: significant session quality decline, avoidance of difficult material, first signs of academic withdrawal. Month three: measurable grade decline, growing academic debt. Month six: academic standing genuinely threatened, the very outcome the student feared help-seeking would produce has arrived through non-help-seeking. Research by Bruffaerts and colleagues documents this trajectory consistently: the academic consequences of untreated mental health conditions are substantially larger than the academic consequences of taking time to seek and engage with support.</p>

      <p><strong>The performance paradox — high achievers and hidden impairment.</strong> A particularly significant pattern in student mental health research is the high-achieving student whose sustained performance is maintained at escalating psychological cost. The transcript shows excellent grades; the inner experience shows severe anxiety, inadequate sleep, loss of any genuine engagement with learning, and progressive exhaustion. Research by Luthar and Becker at Columbia on affluent high-achieving students documents elevated rates of anxiety, depression, and substance use in this demographic — specifically because high performance is both expected and provides no indication to teachers, parents, or the student themselves that something is wrong.</p>

      <p><strong>Attendance, engagement, and the withdrawal spiral.</strong> Research by Kessler and colleagues on mental health and academic functioning documents attendance as an early and sensitive indicator of underlying mental health difficulty: students experiencing unacknowledged mental health challenges typically show attendance changes before grade changes, and engagement changes before attendance changes. The progressive withdrawal — from participation, then from attendance, then from enrollment — follows a predictable trajectory that early intervention consistently interrupts. The tragedy is that each step of the withdrawal produces additional academic costs that make the original problem harder to recover from.</p>

      {/* ── Section 3 ── */}
      <h3 id="social">3. The Hidden Social Impact</h3>

      <p><strong>The social withdrawal spiral.</strong> Social withdrawal is both a symptom and a consequence of untreated mental health difficulties — and the relationship between them is self-reinforcing. Research by Coyne on depression and social relationships documents the withdrawal spiral: the person experiencing depression withdraws from social contact (as a symptom and as a conserving behaviour), the withdrawal reduces the social support that is the most powerful available protective factor against worsening, the reduced support allows the condition to worsen, the worsened condition produces more withdrawal. The social impact of ignored mental health is not just the loss of social connection in the present moment — it is the progressive destruction of the social infrastructure that recovery requires.</p>

      <p><strong>The relationship cost — how mental health difficulty affects friendships.</strong> Untreated mental health conditions produce behaviours that damage relationships without the student understanding why: the irritability that drives away friends, the cancellation pattern that makes the student seem unreliable, the emotional unavailability that makes conversations feel hollow, the increasing neediness that burdens relationships, and the social anxiety that prevents the initiation of connections that would otherwise be available. Friends, not knowing what is driving the behaviour, often experience these as personal rejections or character changes — drifting away when they are most needed.</p>

      <p><strong>The comparison trap — social media as a compounding factor.</strong> Research documents that social media use is specifically more damaging to mental health when the individual is already experiencing difficulty. The student managing unacknowledged depression uses social media and encounters the curated highlights of peers who appear to be thriving — producing a social comparison that is unfair (comparing their internal experience to others' external presentations) and damaging (deepening the sense of inadequacy and isolation). The social media environment actively amplifies the social isolation of unacknowledged mental health difficulty.</p>

      <p><strong>The long-term relationship legacy.</strong> Research on early relationships and adult social functioning documents that the quality of peer relationships in adolescence and young adulthood provides the template for adult social functioning. Students who experience significant social isolation during these years — whether through untreated mental health conditions or other factors — enter adulthood with less developed social skills, smaller social networks, and more fragile social confidence. The social cost of ignoring student mental health is not just the friendships lost in the present — it is the social capacity not developed for the future.</p>

      {/* ── Section 4: Interactive ── */}
      <h3 id="finder">4. Interactive: The Personal Barrier Finder</h3>
      <p>Select the barriers you recognise — in yourself, in someone you know, or in students generally. The Finder generates a personalised strategy plan for each selected barrier, with the specific explanation of why each barrier exists, its academic and social impacts, the evidence-based solution, and your first concrete action.</p>

      <PersonalBarrierFinder />

      {/* ── Section 5 ── */}
      <h3 id="solutions">5. Actionable Solutions for Each Barrier</h3>

      <p><strong>Solution for Stigma: Small disclosures to safe people.</strong> Stigma is reduced most effectively not by information campaigns but by the direct experience of disclosure that does not produce the feared negative consequence. The practical implication: begin with the smallest safe disclosure, to the single person whose response you most trust to be supportive. The experience of being heard without judgment is the most powerful available stigma reducer — and it is available from any one trusted person, not requiring a cultural transformation before it can be accessed.</p>

      <p><strong>Solution for Fear of Consequences: Know the actual rules.</strong> The fear of academic or career consequences from seeking mental health support is almost always based on generalised concern rather than specific knowledge of institutional policies. School and college counselling services in India are typically bound by confidentiality; professional services outside the institution are entirely separate from academic records. The action: ask directly and specifically about confidentiality before sharing anything. "Is this conversation confidential? Under what circumstances would you share what I tell you?" Having the specific answer replaces generalised fear with specific, accurate information.</p>

      <p><strong>Solution for Unsupportive Family Context: External support exists.</strong> Professional mental health support — school counsellors, helplines like iCall (9152987821), online platforms, and community resources — does not require parental consent or family knowledge for most students. The practical path: identify which type of support is available that does not require navigating the family barrier. Even beginning with a confidential conversation with a trusted teacher or older mentor is a genuine step that does not require family involvement.</p>

      <p><strong>Solution for Non-Recognition: Learn the signs.</strong> The PHQ-9 (depression) and GAD-7 (anxiety) self-assessment tools are freely available online and are the validated tools used in clinical settings. They do not diagnose but they tell students whether their experience falls in the range that typically benefits from professional assessment. SecretSharz's May content also covers the specific presentations of common conditions in student populations. Recognition is the prerequisite for help-seeking — literacy is the path to recognition.</p>

      <p><strong>Solution for "Not Bad Enough": Change the threshold.</strong> The threshold for accessing mental health support is not "severe suffering" — it is "my wellbeing is being affected." Any impact on sleep, relationships, study quality, enjoyment of life, or capacity to engage with your own experience is sufficient reason to access support. Earlier support for moderate difficulty produces better outcomes than delayed support for severe difficulty — the "not bad enough" calculation produces worse outcomes for the person who applies it.</p>

      <p><strong>Solution for Access: Know before you need.</strong> Mental health resources, unlike most support needs, can be identified before the moment of crisis — which is the worst possible moment for navigation. Save iCall (9152987821), Vandrevala Foundation (1860-2662-345), and SecretSharz's Safe Corner (/safe) in your phone now. Identify your school or college counsellor now. The resources you know about before you need them are the ones you can actually access when you need them.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Student Mental Health Help-Seeking FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: I recognise that I am experiencing something but I am not sure if it is serious enough to seek help. How do I decide?</strong><br />
        A: The practical test is not severity — it is impact. Ask yourself three questions: Is this affecting my sleep, my appetite, or my energy in ways that are not explained by other factors? Is this affecting my ability to engage with study, relationships, or activities I normally enjoy? Has this been present for more than two weeks? If the answer to any of these is yes, your experience qualifies for support — not because it is necessarily a clinical condition, but because whatever is present is affecting your life. Accessing support is not making a claim about how serious your experience is — it is making a request for help with something that is affecting you. That request is always legitimate.</p>

        <p><strong>Q: A friend seems to be struggling but denies it when I ask. How do I help someone who is not ready to acknowledge their difficulties?</strong><br />
        A: Research on social support and help-seeking shows that the most valuable thing someone can do for a friend who is struggling but not ready to seek help is consistent, patient, non-pressuring presence. Not: "You need to see someone." But: "I am here. I have noticed you seem different lately. I am not going anywhere." The person who is not ready to acknowledge their difficulty today is more likely to seek help tomorrow if they know someone is genuinely available. Planting the seed — "I know about SecretSharz and iCall if it is ever useful" — without pressure makes the resource available when readiness develops. Your job is not to force acknowledgment; it is to ensure that when readiness develops, connection is available.</p>

        <p><strong>Q: What do I do if I am struggling right now and feeling overwhelmed by what this blog has described?</strong><br />
        A: Please go to SecretSharz's Safe Corner (/safe) or call iCall (9152987821) right now. This blog is informational — it is not a substitute for genuine support, and reading about the consequences of untreated mental health should not produce more distress without the resource to act on it. If what you have read resonates personally and is producing distress, that resonance is information — the most important thing you can do with it is reach for support rather than continue reading alone. You do not have to feel this way without company.</p>
      </div>

      {/* ── Resources ── */}
      <div style={{ background: IPALE, border: `2px solid ${IBORD}`, borderRadius: '14px', padding: '20px', marginBottom: '28px', fontFamily: font }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '17px', fontWeight: '700', color: INDIGO, marginBottom: '12px', textAlign: 'center' }}>💜 If You Need Support — Now</div>
        {[
          { name: 'iCall (TISS)', contact: '9152987821', color: '#2A8A60', desc: 'Free counselling — Mon-Sat, 8am-10pm' },
          { name: 'Vandrevala Foundation', contact: '1860-2662-345', color: '#2D5A8A', desc: '24/7 free crisis helpline' },
          { name: 'SecretSharz Safe Corner', contact: '/safe', color: INDIGO, desc: '24/7 peer support and professional connection' },
        ].map(r => (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: r.color }}>{r.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{r.desc}</div>
            </div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: r.color }}>{r.contact}</div>
          </div>
        ))}
      </div>

      {/* ── Final Thought ── */}
      <div style={{ textAlign: 'center', margin: '40px 0', fontFamily: font }}>
        <h2 style={{ fontFamily: 'Fraunces', color: INDIGO, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "Not seeking help is never the safe option. The danger is always in the untreated condition — never in the act of reaching for support."
        </h2>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/mindspace')} style={{ background: `linear-gradient(135deg, ${INDIGO}, #7A58A8)`, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 8px 24px ${IBORD}` }}>
            Access Mind Space →
          </button>
          <button onClick={() => navigate('/safe')} style={{ background: 'white', color: INDIGO, border: `2px solid ${INDIGO}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            Visit Safe Corner
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from May's Mental Health Awareness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mental-health-awareness-2026', '→ Why Mental Health Awareness Matters More Than Ever in 2026'],
            ['/blog/mental-health-myths-students', '→ 10 Common Mental Health Myths Students Should Stop Believing'],
            ['/blog/mindfulness-reduce-anxiety',   '→ How Mindfulness Helps Reduce Anxiety Naturally'],
            ['/blog/manage-emotions-mindfulness',  '→ How to Manage Emotions Using Mindfulness Techniques'],
            ['/safe',                              '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: INDIGO, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
