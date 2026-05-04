import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Handle Rejection Without Losing Confidence",
  excerpt: "Rejection is not proof that you are not enough — it is proof that you tried. Learn the psychology of dealing with rejection, why your brain reacts the way it does, and discover practical tools to protect your confidence when the answer is no.",
  category: "Mental Health",
  date: "13-02-2026",
  readTime: "7 min read",
  wordCount: 1040,
  imgUrl: "/blogss/2026/February/handling-rejection.jpg",
  tldr: "Dealing with rejection activates the same brain regions as physical pain — so the way it hurts is completely real, not dramatic. This guide breaks down the neuroscience of rejection, walks through the most common ways students respond to it (and why most of them backfire), and gives you an interactive Rejection Reframe Lab to walk through any specific rejection you are carrying right now.",
  toc: [
    { id: "why-it-hurts",       title: "1. Why Rejection Hurts So Much (The Neuroscience)",              level: 3 },
    { id: "types-of-rejection", title: "2. The 5 Most Common Rejections Students Face",                  level: 3 },
    { id: "reframe-lab",        title: "3. Interactive: The Rejection Reframe Lab",                      level: 3 },
    { id: "backfire-responses", title: "4. The 4 Rejection Responses That Backfire",                     level: 3 },
    { id: "confidence",         title: "5. How to Protect Your Confidence After Rejection",              level: 3 },
    { id: "faq",                title: "6. Dealing With Rejection FAQs",                                 level: 3 },
  ],
};

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────
const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-02-13T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "dealing with rejection, how to handle rejection, rejection and confidence, coping with rejection, student rejection, overcoming rejection",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you deal with rejection without losing confidence?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective approach combines three steps: allow yourself to feel the pain without dramatising it (rejection hurts because it activates real pain circuits in the brain), separate the rejection from your identity (a 'no' to your work, application, or request is not a 'no' to your worth as a person), and take one deliberate action that reminds your nervous system you are still capable and still moving. Confidence survives rejection when it is grounded in self-belief rather than external approval.",
      },
    },
    {
      "@type": "Question",
      "name": "Why does rejection hurt so much emotionally?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Brain imaging studies show that social rejection activates the same neural regions — the anterior cingulate cortex and anterior insula — that process physical pain. This is not a metaphor. Your brain processes 'being left out' or 'being told no' the same way it processes a sprained ankle. The pain of rejection is biologically real, which is why dismissing it with 'just get over it' is both unhelpful and scientifically inaccurate.",
      },
    },
    {
      "@type": "Question",
      "name": "Does everyone experience rejection the same way?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Research by psychologist Mark Leary shows that people who derive their self-worth primarily from external validation — grades, approval, social acceptance — experience rejection far more intensely than those whose self-worth is internally anchored. This means developing unconditional self-worth is not just good mental health advice — it is your most practical protection against the inevitable rejections that come with being alive and trying things.",
      },
    },
  ],
};

// ── Reframe Lab Data ───────────────────────────────────────────────────────────
const REJECTION_TYPES = [
  { key: 'academic',  icon: '📝', label: 'Academic / Exam result',   sub: 'A result, grade, rejection from a college, or exam failure' },
  { key: 'social',    icon: '👥', label: 'Social / Friendship',       sub: 'Being excluded, ghosted, or left out of a group' },
  { key: 'romantic',  icon: '💔', label: 'Romantic / Relationship',   sub: 'A confession that did not go well, or being broken up with' },
  { key: 'creative',  icon: '🎨', label: 'Creative / Work rejected',  sub: 'Your writing, art, project, or idea was turned down' },
  { key: 'career',    icon: '💼', label: 'Career / Opportunity',      sub: 'An internship, job, or competition you were not selected for' },
];

const EMOTIONAL_STATES = [
  { key: 'spiral',    icon: '🌀', label: 'I keep replaying what went wrong' },
  { key: 'blame',     icon: '😶', label: 'I am convinced I am fundamentally not good enough' },
  { key: 'numb',      icon: '🪨', label: 'I feel nothing — I have shut it out completely' },
  { key: 'angry',     icon: '🔥', label: 'I feel angry, embarrassed, or resentful' },
  { key: 'avoid',     icon: '🙈', label: 'I want to never try that again to avoid this feeling' },
];

const REFRAMES = {
  academic: {
    spiral: {
      concept: 'Rumination vs Processing',
      psychNote: 'Replaying a bad result activates the brain\'s threat system rather than its problem-solving system. Research by Susan Nolen-Hoeksema shows that rumination deepens negative affect without generating insight — it is suffering without learning.',
      reframe: 'One exam result is a data point — not a verdict on your potential. The question to ask is not "why did I fail?" but "what specific thing, if changed, would produce a different result?" That shift moves you from rumination into analysis.',
      action: 'Write three sentences: what you know now that you did not know before, what you would do differently once, and what this result has no power to tell you.',
      affirmation: 'I am not my result. I am the person who keeps showing up anyway.',
    },
    blame: {
      concept: 'Fundamental Attribution Error',
      psychNote: 'When we fail, we tend to attribute it to who we are rather than what we did or what the circumstances were. Psychologists call this the Fundamental Attribution Error — our brain skips over external factors and lands directly on character.',
      reframe: 'Not being selected is almost never about being fundamentally inadequate. It is almost always about preparation, timing, fit, and factors entirely outside your control. The person who got in is not smarter than you — they are often just further along in a specific journey.',
      action: 'List every factor that contributed to this outcome — including the ones that had nothing to do with you. Make it as complete and honest as possible.',
      affirmation: 'This result tells me where to grow, not who I am.',
    },
    numb: {
      concept: 'Emotional Avoidance',
      psychNote: 'Numbing is the brain\'s protective response to pain it deems too overwhelming to process. While it provides short-term relief, research by Brené Brown consistently shows that emotional avoidance prevents the grief that leads to actual recovery.',
      reframe: 'Feeling nothing is not the same as having moved on. It often means the pain is still there — just stored somewhere your consciousness cannot easily reach. You cannot skip the emotional processing step. You can only delay it.',
      action: 'Set a 10-minute timer and write without stopping about the rejection — what you hoped for, what you felt when you found out, and what you are most scared to admit about how it affected you.',
      affirmation: 'Feeling this fully is not weakness. It is how I actually move through it.',
    },
    angry: {
      concept: 'Secondary Emotions',
      psychNote: 'Anger and embarrassment after academic rejection are usually secondary emotions sitting on top of primary ones — hurt, fear, and grief. The anger is real, but it is often protecting you from something more vulnerable beneath it.',
      reframe: 'The anger makes sense — you worked hard and the outcome was not what you deserved. And underneath the anger is someone who genuinely cares about doing well. That caring is not a liability. It is what drives the next attempt.',
      action: 'Write what you are actually afraid this result means. Then write three concrete pieces of evidence that challenge that fear directly.',
      affirmation: 'My anger is valid. And I am bigger than this single outcome.',
    },
    avoid: {
      concept: 'Avoidance Reinforcement',
      psychNote: 'Every time we avoid the thing that caused pain, we send the brain a message that the thing is genuinely dangerous. Avoidance provides immediate emotional relief but gradually shrinks your world, because the brain learns to categorise increasingly similar things as threats.',
      reframe: 'Not trying again is not self-protection. It is a guarantee that this rejection becomes permanent. Every person who has eventually succeeded in competitive academics had a rejection that felt exactly like this one — and tried anyway.',
      action: 'Identify the single smallest next step that moves in the direction of trying again. Not a big plan — just one action small enough that it does not feel scary.',
      affirmation: 'This is not the end of my story. It is the part where it gets interesting.',
    },
  },
  social: {
    spiral: {
      concept: 'Social Hypervigilance',
      psychNote: 'After social rejection, the brain enters a state of hypervigilance — scanning every interaction for further threat. Research by Geoff MacDonald shows this hypersensitivity often causes people to misread neutral behaviour as further rejection, creating a painful feedback loop.',
      reframe: 'The story your brain is telling about what happened — why they excluded you, what it means about you — is a hypothesis, not a fact. You are trying to make sense of something painful with incomplete information.',
      action: 'Write down the story your brain is telling. Then write two equally plausible alternative explanations for what happened that do not place the fault in your character.',
      affirmation: 'Not every group is my people. The right ones will make room for me.',
    },
    blame: {
      concept: 'Rejection Sensitivity',
      psychNote: 'Chronic self-blame after social rejection is often a symptom of Rejection Sensitive Dysphoria — an intense emotional response to perceived rejection or criticism. It is not a character flaw. It is a nervous system pattern, often developed as a protective response to earlier relational pain.',
      reframe: 'The person who was excluded is not less worthy of connection. They are someone whose nervous system learned to anticipate rejection — and now finds it everywhere, even when it is not really there.',
      action: 'Name three people in your life who have chosen to be in yours — consistently, not just when convenient. Write what they see in you that this rejection has not touched.',
      affirmation: 'Being excluded by some people does not disqualify me from belonging anywhere.',
    },
    numb: {
      concept: 'Dissociation as Coping',
      psychNote: 'Emotional numbness after social rejection is a dissociative protective mechanism — the psyche stepping away from pain it does not yet feel equipped to process. It is common, it is protective, and it is a signal that the pain needs gentler acknowledgment rather than more suppression.',
      reframe: 'You do not have to feel this all at once. But you do need to let a little of it in at a time — in a safe space, with a safe person — so it does not calcify into something harder.',
      action: 'Tell one trusted person something true about how the rejection felt. Not everything — just one real thing.',
      affirmation: 'I am allowed to protect myself. And I am also allowed to let safe people in.',
    },
    angry: {
      concept: 'Narcissistic Injury',
      psychNote: 'Social rejection often triggers what psychologists call a narcissistic injury — a wound to the self-concept. The anger is a protective response, keeping the pain of the wound from being fully felt. It is not a character flaw. It is your self-esteem defending itself.',
      reframe: 'Your anger does not mean you are difficult or too much. It means you are someone who expected to be treated with basic dignity — and that expectation is completely reasonable.',
      action: 'Channel the anger into one constructive action: write a letter you do not send, go for a physically intense activity, or create something.',
      affirmation: 'I deserved better treatment, and I still deserve it.',
    },
    avoid: {
      concept: 'Social Withdrawal Loop',
      psychNote: 'After social rejection, the natural instinct to withdraw feels protective but actually increases loneliness and depressive symptoms over time. Research by John Cacioppo shows that social withdrawal after rejection reinforces the very beliefs about being unwanted that the rejection triggered.',
      reframe: 'Isolating yourself is not evidence that you are not likeable. It is evidence that you are in pain. The solution to social pain is not less social contact — it is better social contact.',
      action: 'Reach out to one person today — not to talk about the rejection, just to be in connection. A voice note, a quick message, a walk together.',
      affirmation: 'I am not defined by who did not choose me. I am defined by who I choose to show up for.',
    },
  },
  romantic: {
    spiral: {
      concept: 'Heartbreak Rumination',
      psychNote: 'Romantic rejection activates the brain\'s reward circuitry — specifically dopamine pathways associated with craving. This is why heartbreak feels like withdrawal. The brain keeps returning to thoughts of the person the same way it would return to a craving, looking for the hit that is no longer coming.',
      reframe: 'Your brain is not replaying the rejection because you are weak. It is doing what brains do after something they were attached to is suddenly unavailable. This passes. Every piece of research on romantic grief shows that time and deliberate reorientation genuinely work.',
      action: 'Give yourself a 15-minute window once a day to fully feel the grief. Outside that window, actively redirect your attention. Structure the grief rather than letting it run unscheduled.',
      affirmation: 'What I felt was real. And I will love again, just as genuinely.',
    },
    blame: {
      concept: 'Romantic Attribution Bias',
      psychNote: 'After romantic rejection, we almost universally blame our appearance, personality, or some fundamental quality of ourselves. But romantic compatibility is complex — it involves timing, circumstance, what someone else is capable of, and factors that have nothing to do with your worth.',
      reframe: 'Being someone\'s "not right now" or "not the right fit" is not the same as being fundamentally unloveable. Romantic rejection is information about compatibility — not a verdict on your worthiness of love.',
      action: 'Write down what you genuinely brought to this situation — kindness, effort, authenticity, courage. None of that was wrong. None of it is lost.',
      affirmation: 'I was brave enough to feel something. That is not a flaw.',
    },
    numb: {
      concept: 'Grief Suppression',
      psychNote: 'Emotional numbness after romantic rejection is often a grief response — the psyche protecting itself from a loss it has not yet fully processed. Romantic rejection involves the loss of a possible future, not just a present connection. That grief is legitimate and deserves acknowledgment.',
      reframe: 'You are not over it just because you cannot feel it. And that is okay. Give the grief time to surface at its own pace, with the support of people who can hold it with you.',
      action: 'Listen to one song that captures something true about what this felt like. Let it in. That is not wallowing — that is processing.',
      affirmation: 'I am allowed to grieve this. It mattered, and so do I.',
    },
    angry: {
      concept: 'Protest Behaviour',
      psychNote: 'Anger after romantic rejection is what attachment researchers call protest behaviour — a natural response to perceived abandonment or dismissal. It is the attachment system fighting to restore connection. The anger is not irrational. It is biology.',
      reframe: 'Your anger is not proof that you are too much. It is proof that you are attached to someone and that attachment was disrupted. The anger will soften when the attachment has a chance to grieve properly.',
      action: 'Write everything you are angry about without censoring. Read it once. Then set it aside for 24 hours before deciding what, if anything, to do with it.',
      affirmation: 'My feelings are not too big. The situation just was not big enough to hold them.',
    },
    avoid: {
      concept: 'Attachment Avoidance',
      psychNote: 'Deciding never to be vulnerable again after romantic rejection is the most understandable and least effective protective strategy. Research by Mario Mikulincer shows that avoidant coping after romantic loss increases long-term loneliness and makes future relationships harder to form.',
      reframe: 'Closing your heart does not protect it. It just ensures nothing good can reach it either. The courage to try again is not naivety — it is the only path through.',
      action: 'You do not need to try anything romantic right now. Just do one thing today that reminds your nervous system that life beyond this rejection has beauty in it.',
      affirmation: 'This is not the last time I will feel something real for someone.',
    },
  },
  creative: {
    spiral: {
      concept: 'Artistic Rumination',
      psychNote: 'Creative rejection hits differently because creative work is often an expression of self — rejecting the work can feel like rejecting the person. Psychologist Mihaly Csikszentmihalyi\'s research on creative people shows that high sensitivity to rejection is correlated with creative output, not opposed to it.',
      reframe: 'Every piece of creative work you have ever loved — every book, film, song, design — was rejected by someone before it found its audience. Rejection from one person or institution is information about fit, not about the value of what you made.',
      action: 'Find one example of a creative work you deeply admire that was famously rejected before it succeeded. Let that be your evidence.',
      affirmation: 'My work has value even when one person cannot see it yet.',
    },
    blame: {
      concept: 'Self-Critical Inner Voice',
      psychNote: 'The inner critic that emerges after creative rejection is often more brutal than the actual rejection. Research shows that creative people often internalise rejection so deeply that the external critic becomes redundant — they do the work for free. This pattern is both common and correctable.',
      reframe: 'A rejection letter is one opinion from one person at one moment in time. Your inner critic is not the authority on the quality of your work. The people who consistently create great things are not the ones with the quietest inner critic — they are the ones who have learned to create in spite of it.',
      action: 'Read your work or look at your creation through the eyes of someone who genuinely loves you. What would they see that your inner critic is refusing to acknowledge?',
      affirmation: 'One person\'s no does not override what I know this work to be.',
    },
    numb: {
      concept: 'Creative Shutdown',
      psychNote: 'Creative shutdown after rejection is a protective mechanism that prevents further vulnerability. But creativity requires the same emotional openness that made rejection painful. Shutting down the emotion also shuts down the source.',
      reframe: 'The numbness is telling you that this rejection landed somewhere important — which means the work mattered to you. Work that matters is work worth continuing.',
      action: 'Create something small and private today — just for you. Not for submission, not for feedback. Restore the private relationship with making before exposing it to external evaluation again.',
      affirmation: 'I create because it is who I am, not because it is always accepted.',
    },
    angry: {
      concept: 'Creative Frustration',
      psychNote: 'Anger after creative rejection often contains a real insight — a sense that the work was not evaluated fairly, or by someone equipped to understand it. That anger is sometimes accurate. The skill is separating the legitimate grievance from the story that you are fundamentally without talent.',
      reframe: 'Picasso, Kafka, Rowling, and Tagore were all rejected by people who were wrong. Your anger might be the part of you that knows this was not the right home for this work — not that you made bad work.',
      action: 'Channel the frustration into the next piece. Let the rejection be fuel, not a stop sign.',
      affirmation: 'The right audience exists. I have not found them yet.',
    },
    avoid: {
      concept: 'Creative Avoidance',
      psychNote: 'Stopping creative output after rejection is the one guaranteed way to ensure the rejection defines you. Research on creative careers shows that volume — continuing to create despite rejection — is the single strongest predictor of eventual breakthrough.',
      reframe: 'Every rejection you survive makes the next submission a little less terrifying. The goal is not to get it right first time. The goal is to keep making things until one of them finds its home.',
      action: 'Submit or share the same work — or new work — to one other place within the next week. Make the next attempt before the rejection has time to become a belief.',
      affirmation: 'This rejection is not the end. It is part of the process.',
    },
  },
  career: {
    spiral: {
      concept: 'Rejection Loop Thinking',
      psychNote: 'Replaying a failed interview or application activates what psychologists call counterfactual thinking — the mind generating "if only" scenarios that feel like learning but are actually just re-experiencing the pain. True learning from rejection is structured and bounded, not open-ended replaying.',
      reframe: 'There is a difference between reviewing a rejection and ruminating on it. Reviewing takes 20 minutes, produces specific insights, and ends. Rumination has no end point and produces suffering without information.',
      action: 'Give yourself exactly 20 minutes. Write: what you think went well, what you think you would change, and what you genuinely do not know. Then close the file and do not open it again today.',
      affirmation: 'I can learn from this without being defined by it.',
    },
    blame: {
      concept: 'Structural vs Personal Attribution',
      psychNote: 'Career rejection feels personal because you put your name on the application. But hiring decisions are far more influenced by internal organisational factors — budget, timing, internal candidates, changing criteria — than by any objective assessment of candidate quality.',
      reframe: 'The most qualified candidate does not always get the role. The most compatible candidate for that specific brief at that specific moment does. Those are very different things, and only one of them is about you.',
      action: 'List every factor in a hiring decision that you cannot control. The list will be longer than you expect.',
      affirmation: 'I am not less capable because I was not selected. I am still exactly as capable as I was before this.',
    },
    numb: {
      concept: 'Job Search Burnout',
      psychNote: 'Emotional numbness during prolonged job searching is a recognised burnout response. The constant cycle of effort, hope, and rejection depletes emotional reserves until the nervous system protects itself by stopping the feeling altogether.',
      reframe: 'The numbness is not apathy. It is exhaustion. You need recovery before you need strategy. Continuing to apply at the same pace without recovering emotional reserves produces diminishing returns in both quality and resilience.',
      action: 'Take one full day off from any career-related activity. Not as giving up — as strategic recovery. Your performance in applications and interviews is directly affected by your emotional state.',
      affirmation: 'Resting is not the same as quitting.',
    },
    angry: {
      concept: 'Procedural Injustice',
      psychNote: 'Anger after career rejection sometimes contains a real grievance — an unfair process, a lack of feedback, nepotism, or bias. Research on procedural fairness shows that people handle unfavourable outcomes far better when the process felt fair. If it did not feel fair, the anger has a legitimate basis.',
      reframe: 'If the process was unfair, your anger is an accurate response. If you genuinely were the best candidate for the role and were not selected for reasons beyond merit — that is a real injustice, not a personal failing.',
      action: 'Separate what you are angry at the process for from what you are afraid the rejection means about you. They are different problems requiring different responses.',
      affirmation: 'My worth is not determined by a process that may not have been designed to recognise it.',
    },
    avoid: {
      concept: 'Career Paralysis',
      psychNote: 'Avoidance after career rejection creates a painful paradox — the very act of not trying protects you from rejection but guarantees the outcome you most fear. Psychological research on learned helplessness shows that repeated rejection without recovery strategy eventually produces a belief that effort is futile.',
      reframe: 'Every application that was rejected was also an application that was submitted — which means you tried. The person who eventually gets a yes is almost always the one who submitted the most applications, not the one with the strongest single application.',
      action: 'Identify one application, programme, or opportunity and set a deadline to submit it within the next two weeks. Small, specific, and scheduled.',
      affirmation: 'The next yes is on the other side of the next try.',
    },
  },
};

// ── Reframe Lab Component ──────────────────────────────────────────────────────
const ACCENT = '#B5542D';
const ACCENT_PALE = '#FDF1EC';
const ACCENT_BORDER = 'rgba(181,84,45,0.25)';

function RejectionReframeLab() {
  const [step,         setStep]         = useState(1);
  const [rejType,      setRejType]      = useState(null);
  const [emotion,      setEmotionKey]   = useState(null);
  const [revealed,     setRevealed]     = useState(false);

  const reframeData = rejType && emotion ? REFRAMES[rejType]?.[emotion] : null;

  const handleReset = () => { setStep(1); setRejType(null); setEmotionKey(null); setRevealed(false); };

  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const Pill = ({ label, sublabel, icon, selected, onClick }) => (
    <button onClick={onClick} style={{
      padding: '14px 16px', borderRadius: '12px', border: '2px solid',
      borderColor: selected ? ACCENT : 'var(--border)',
      background: selected ? ACCENT_PALE : 'white',
      cursor: 'pointer', fontFamily: font, transition: 'all 0.18s', textAlign: 'left',
      display: 'flex', alignItems: 'flex-start', gap: '11px',
      boxShadow: selected ? `0 0 0 3px ${ACCENT_BORDER}` : 'var(--shadow-sm)',
    }}>
      <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: selected ? ACCENT : 'var(--ink)', lineHeight: 1.35 }}>{label}</div>
        {sublabel && <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px', lineHeight: 1.4 }}>{sublabel}</div>}
      </div>
    </button>
  );

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: '4px', borderRadius: '4px', background: s <= step ? ACCENT : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* STEP 1 — rejection type */}
      {step === 1 && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 1 — What kind of rejection are you dealing with?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {REJECTION_TYPES.map(rt => (
              <Pill key={rt.key} icon={rt.icon} label={rt.label} sublabel={rt.sub} selected={rejType === rt.key} onClick={() => setRejType(rt.key)} />
            ))}
          </div>
          <button onClick={() => { if (rejType) setStep(2); }}
            disabled={!rejType}
            style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: rejType ? ACCENT : 'var(--border)', color: 'white',
              fontWeight: '700', fontSize: '15px', cursor: rejType ? 'pointer' : 'not-allowed',
              fontFamily: font, transition: 'all 0.2s',
            }}>
            Next Step →
          </button>
        </>
      )}

      {/* STEP 2 — emotional response */}
      {step === 2 && (
        <>
          <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 2 — How are you responding to it right now?
          </p>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5 }}>
            Choose the response that feels most honest, even if it is not comfortable to admit.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '18px' }}>
            {EMOTIONAL_STATES.map(es => (
              <Pill key={es.key} icon={es.icon} label={es.label} selected={emotion === es.key} onClick={() => setEmotionKey(es.key)} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setStep(1)} style={{ padding: '13px 20px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>← Back</button>
            <button onClick={() => { if (emotion) { setStep(3); setRevealed(false); } }}
              disabled={!emotion}
              style={{
                flex: 1, padding: '14px', borderRadius: '10px', border: 'none',
                background: emotion ? ACCENT : 'var(--border)', color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: emotion ? 'pointer' : 'not-allowed',
                fontFamily: font, transition: 'all 0.2s',
              }}>
              Get My Reframe →
            </button>
          </div>
        </>
      )}

      {/* STEP 3 — reveal */}
      {step === 3 && reframeData && (
        <>
          <p style={{ margin: '0 0 14px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Step 3 — Your Personalised Reframe
          </p>

          {!revealed ? (
            <button onClick={() => setRevealed(true)} style={{
              width: '100%', padding: '15px', borderRadius: '10px', border: 'none',
              background: `linear-gradient(135deg, ${ACCENT}, #E8822A)`, color: 'white',
              fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: font,
              boxShadow: '0 6px 20px rgba(181,84,45,0.35)', transition: 'all 0.2s',
            }}>
              🔓 Reveal My Rejection Reframe
            </button>
          ) : (
            <div style={{ animation: 'floatUp 0.35s ease' }}>

              {/* Psychology card */}
              <div style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '18px 20px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--muted)', marginBottom: '6px' }}>
                  🔬 The Psychology Behind Your Response
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: ACCENT, marginBottom: '6px' }}>{reframeData.concept}</div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{reframeData.psychNote}</p>
              </div>

              {/* Reframe card */}
              <div style={{ background: ACCENT_PALE, border: `2px solid ${ACCENT_BORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: ACCENT, marginBottom: '8px' }}>
                  💡 The Reframe
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.75, fontWeight: '500' }}>{reframeData.reframe}</p>
              </div>

              {/* Action card */}
              <div style={{ background: 'white', border: `1.5px solid ${ACCENT_BORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '10px' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: ACCENT, marginBottom: '8px' }}>
                  ✅ Your One Action Step
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.7, fontWeight: '500' }}>{reframeData.action}</p>
              </div>

              {/* Affirmation card */}
              <div style={{ background: `linear-gradient(135deg, ${ACCENT}18, ${ACCENT}08)`, border: `1.5px dashed ${ACCENT_BORDER}`, borderRadius: '12px', padding: '18px 20px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.2px', color: ACCENT, marginBottom: '8px' }}>
                  ✨ Your Affirmation for Today
                </div>
                <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '600', color: ACCENT, fontStyle: 'italic', lineHeight: 1.5 }}>
                  "{reframeData.affirmation}"
                </p>
              </div>

              <button onClick={handleReset} style={{
                background: 'transparent', border: '1.5px solid var(--border)', color: 'var(--muted)',
                padding: '9px 18px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px',
                fontWeight: '700', fontFamily: font,
              }}>↺ Reframe a different rejection</button>
            </div>
          )}

          {!revealed && (
            <button onClick={() => setStep(2)} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--muted)', fontWeight: '600', fontSize: '13px', cursor: 'pointer', fontFamily: font }}>← Back</button>
          )}
        </>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function HandlingRejection({ navigate, relatedPosts }) {
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
      <p>You put your name on something — a college application, a confession, an audition, a job — and someone said no. And now you are here, reading an article about rejection, which means one of two things: either the hurt is fresh and immediate, or it has settled into something quieter and more chronic — a low-level belief that the rejection meant something about you.</p>

      <p>Both are worth addressing. <strong>Dealing with rejection</strong> is one of the most genuinely difficult emotional skills human beings have to learn, because rejection does not feel like a minor inconvenience. It feels, neurologically, exactly like getting hurt.</p>

      <img
        src={meta.imgUrl}
        alt="Student learning how to handle rejection and protect their confidence after being told no"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      {/* ── Section 1 ── */}
      <h3 id="why-it-hurts">1. Why Rejection Hurts So Much (The Neuroscience)</h3>
      <p>In 2003, neuroscientist Naomi Eisenberger and her colleagues at UCLA published a landmark study showing that social rejection activates the same brain regions as physical pain — specifically the anterior cingulate cortex and the anterior insula. These are the areas that register that something has gone wrong in the body. They fire for a broken bone and they fire for being left out of a friend group.</p>
      <p>This is not a metaphor. When someone says rejection "stings," they are describing a biologically accurate experience. Your brain processes social pain on the same circuitry as physical harm because, evolutionarily, being excluded from the group was a genuine survival threat. The brain that treated social rejection as dangerous was the brain that motivated social repair — and the brains that motivated social repair survived.</p>
      <p>Understanding this changes everything about how you should talk to yourself after a rejection. <strong>You are not being dramatic. You are not too sensitive. You are experiencing a genuine pain response to a genuine threat signal.</strong> The question is not whether it hurts — it is what you do in the hours and days after it does.</p>

      {/* ── Section 2 ── */}
      <h3 id="types-of-rejection">2. The 5 Most Common Rejections Students Face</h3>
      <p><strong>Academic rejection</strong> — a failed exam, a rejected college application, or a grade that does not reflect the effort you put in — is particularly brutal because Indian educational culture heavily ties identity to academic performance. A rejection here does not just feel like a setback. It can feel like a verdict on your intelligence, your future, and your worth to your family.</p>
      <p><strong>Social rejection</strong> — being excluded from a friend group, ghosted, or subtly pushed out of a social circle — often hurts more than any other form because it touches the most fundamental human need: the need to belong. Social rejection does not only hurt in the moment. It can distort your self-perception for months, making you hypersensitive to further signs of exclusion that may not even exist.</p>
      <p><strong>Romantic rejection</strong> is unique in its combination of vulnerability and public exposure. Having genuine feelings for someone and having those feelings not returned requires an unusual kind of courage just to survive. The particular pain of romantic rejection is grief — not just for the person, but for a version of the future that briefly felt possible.</p>
      <p><strong>Creative rejection</strong> — having writing, art, or creative work turned down — is especially complex because creative work is usually deeply personal. Rejecting the work can feel indistinguishable from rejecting the person who made it, even when the two things are genuinely separate.</p>
      <p><strong>Career and opportunity rejection</strong> — a failed internship application, not being selected for a team, or a missed promotion — carries the additional weight of external validation being withheld from something you have invested significant time and effort in. It can feel like the world is confirming a fear you already had about your own capability.</p>

      {/* ── Section 3: Interactive ── */}
      <h3 id="reframe-lab">3. Interactive: The Rejection Reframe Lab</h3>
      <p>Not all rejections are the same, and not all emotional responses to rejection need the same intervention. Tell the lab what kind of rejection you are dealing with, and how you are responding to it right now. You will get a personalised reframe with the psychology behind your specific response, a concrete action step, and an affirmation you can actually believe.</p>

      <RejectionReframeLab />

      {/* ── Section 4 ── */}
      <h3 id="backfire-responses">4. The 4 Rejection Responses That Backfire</h3>
      <p><strong>Immediate over-analysis.</strong> The instinct to immediately dissect every detail of a rejection — replaying the conversation, scrutinising your application, comparing yourself to those who were selected — feels productive but is not. In the acute aftermath of rejection, the brain is in a threat state and is not capable of objective analysis. It will find the answer it is looking for, which is almost always "the problem is me."</p>
      <p><strong>Telling yourself it doesn't matter.</strong> Dismissing rejection with "it's fine, I didn't really want it anyway" is a form of emotional avoidance that prevents the genuine grief from resolving. Unprocessed grief does not disappear — it accumulates. And accumulated grief from multiple "it doesn't matter" moments often surfaces as a general low mood, cynicism, or a chronic inability to want things fully.</p>
      <p><strong>Catastrophising.</strong> Taking a single rejection and extrapolating it into a permanent statement about your future — "I will never get in anywhere," "no one will ever choose me," "I am not cut out for this" — is a cognitive distortion that treats one data point as a universal law. It is also the response most likely to make the prediction come true, because catastrophising kills the motivation to try again.</p>
      <p><strong>Isolating yourself.</strong> The instinct to withdraw after rejection is completely understandable and almost universally counterproductive. Isolation increases shame — because shame grows in silence and dissolves in connection. The people who recover fastest from rejection are almost always the ones who talk about it, imperfectly and honestly, with someone who can hold it without minimising it.</p>

      {/* ── Section 5 ── */}
      <h3 id="confidence">5. How to Protect Your Confidence After Rejection</h3>
      <p>Confidence is not the absence of rejection — it is the ability to be rejected and not let it become a belief about your fundamental worth. The practical difference between people who maintain confidence through rejection and those who do not is not talent, or luck, or thick skin. It is the source of their self-worth.</p>
      <p><strong>Externally anchored self-worth</strong> — worth that depends on results, validation, and approval — is structurally vulnerable to rejection. Every no is a threat to the entire architecture. This is why some people are devastated by rejections that objectively seem small: the rejection does not just touch the specific application. It touches the foundation the whole sense of self is resting on.</p>
      <p><strong>Internally anchored self-worth</strong> — worth that comes from your values, your effort, your character, and your willingness to show up — can survive a rejection intact. The no is about the specific thing, not about the person who tried. Building this internal anchor is not quick, but it is the most important long-term investment you can make in your relationship with rejection.</p>
      <p>In the immediate aftermath of any rejection, three things protect confidence most reliably: naming what you actually felt rather than suppressing it, identifying at least one specific thing you genuinely did well in the attempt, and taking one small action — anything — that reminds your nervous system that you are still capable and still moving.</p>

      {/* ── Section 6: FAQs ── */}
      <h3 id="faq">6. Dealing With Rejection FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: How long should recovery from rejection take?</strong><br />
        A: It depends entirely on the type of rejection, how significant the thing was that was rejected, and what your current emotional reserves look like. Minor rejections might resolve in hours. Significant ones — romantic rejection, a dream college application, a deeply personal creative work — may take weeks to fully process. The metric is not the timeline. It is whether the rejection has stopped being the primary lens through which you see yourself.</p>

        <p><strong>Q: Is it normal to feel rejected even when the rejection was not personal?</strong><br />
        A: Completely. The brain does not distinguish between intentional and structural rejection. Being cut from a team due to budget constraints feels the same as being cut because of ability. Being on a waitlist feels like being told you were not enough. The emotional response is often independent of the actual intent behind the no.</p>

        <p><strong>Q: How do I stop being afraid of future rejection?</strong><br />
        A: You do not stop being afraid of it. You expand your capacity to tolerate it. Each rejection you survive and process makes the next one fractionally less catastrophic, because you accumulate evidence that you can survive them. The goal is not fearlessness — it is the willingness to try in spite of the fear.</p>
      </div>

      {/* ── Final Thought ── */}
      <h3 style={{ textAlign: 'center', fontSize: '28px', marginTop: '50px' }}>Final Thought</h3>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2 style={{ fontFamily: 'Fraunces', color: ACCENT, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4' }}>
          "Rejection is not the opposite of acceptance. It is the price of admission for a life spent trying."
        </h2>
        <p style={{ marginBottom: '28px', color: 'var(--ink-soft)' }}>
          Every person you admire for their courage, their creativity, or their resilience has a rejection story they almost did not survive. The rejection is not the end. It is the part of the story that makes the eventual yes mean something.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/mindspace')}
            style={{ background: ACCENT, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', boxShadow: `0 8px 24px ${ACCENT_BORDER}` }}
          >
            Process This in Mind Space →
          </button>
          <button
            onClick={() => navigate('/wall')}
            style={{ background: 'white', color: ACCENT, border: `2px solid ${ACCENT}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Share Anonymously on the Wall
          </button>
        </div>
      </div>

      {/* ── Internal Linking ── */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>Keep Building Your Resilience:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/self-love-insecurity')} style={{ background: 'none', border: 'none', color: ACCENT, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Love Yourself Even When You Feel Insecure
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/negative-self-talk')} style={{ background: 'none', border: 'none', color: ACCENT, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Breaking the Cycle of Negative Self-Talk
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/blog/setting-boundaries-guide')} style={{ background: 'none', border: 'none', color: ACCENT, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → How to Set Boundaries Without Feeling Guilty
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button onClick={() => navigate('/safe')} style={{ background: 'none', border: 'none', color: ACCENT, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', whiteSpace: 'normal', lineHeight: '1.4' }}>
              → Access 24/7 Professional Support in our Safe Corner
            </button>
          </li>
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
