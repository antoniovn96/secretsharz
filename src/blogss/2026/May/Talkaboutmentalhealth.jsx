import React, { useState } from 'react';
import Head from 'next/head';
import BlogPostTemplate from '../../../BlogPostTemplate';

export const meta = {
  title: "How to Talk About Mental Health Without Fear or Judgment",
  excerpt: "The conversation about mental health that does not happen is the one that costs the most. The fear of judgment, the not-knowing-what-to-say, the worry about making things worse — these are the specific barriers between struggling students and the genuine support that conversation can provide. This guide gives you the words, the frameworks, and the confidence to have the conversation you have been avoiding.",
  category: "Mental Health",
  date: "04-05-2026",
  readTime: "7 min read",
  wordCount: 1050,
  imgUrl: "/blogss/2026/May/talk-about-mental-health.jpg",
  tldr: "Talking about mental health is difficult because it requires vulnerability, navigates cultural stigma, and carries the fear of judgment or of making things worse. Research shows it consistently does the opposite — talking reduces isolation, improves outcomes, and often gives permission for others to open up too. This guide covers communication tips, conversation starters for six specific situations, relatable scenarios, and an interactive Conversation Builder.",
  toc: [
    { id: "why-hard",    title: "1. Why Talking About Mental Health Is Hard",                        level: 3 },
    { id: "why-matters", title: "2. Why Talking About It Matters — The Research",                   level: 3 },
    { id: "builder",     title: "3. Interactive: The Conversation Builder",                          level: 3 },
    { id: "starters",    title: "4. Conversation Starters for Six Specific Situations",             level: 3 },
    { id: "tips",        title: "5. Communication Tips for Mental Health Conversations",             level: 3 },
    { id: "scenarios",   title: "6. Relatable Scenarios — What to Say and What Not to Say",         level: 3 },
    { id: "faq",         title: "7. Talk About Mental Health FAQs",                                  level: 3 },
  ],
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": meta.title,
  "image": ["https://secretsharz.com" + meta.imgUrl],
  "datePublished": "2026-05-04T08:00:00+05:30",
  "author": [{ "@type": "Organization", "name": "Secret Sharz" }],
  "description": meta.excerpt,
  "keywords": "talk about mental health, how to talk about mental health, mental health conversation starters, mental health communication tips, supporting mental health conversation, talking to family about mental health India",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I start a conversation about mental health with a friend?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective way to start a mental health conversation with a friend is a specific, genuine observation followed by an open question — not a general 'how are you' that invites a surface answer. For example: 'I've noticed you seem quieter than usual lately — is everything okay?' or 'I wanted to check in properly — how are you actually doing?' The specificity of the observation ('quieter than usual') signals that you have genuinely paid attention, which makes the question feel safer to answer honestly. Research shows that people are significantly more likely to disclose genuine distress when they believe the questioner has actually noticed something, rather than asking as social routine.",
      },
    },
    {
      "@type": "Question",
      "name": "What do I say when someone shares they are struggling with mental health?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "When someone shares they are struggling with mental health, the most valuable response is acknowledgment rather than advice. Research on supportive communication consistently shows that the person who is struggling most needs to feel genuinely heard before they need solutions. Effective responses: 'Thank you for trusting me with this — I can hear how hard this has been.' 'I am not going to pretend I have easy answers, but I am really glad you told me.' 'What would be most helpful for you right now — do you want to talk about it, or just know I am here?' Avoid: 'I know exactly how you feel,' 'You should try...' or 'At least...' phrases that minimise or immediately redirect to advice.",
      },
    },
    {
      "@type": "Question",
      "name": "How do I talk to my parents about my mental health in India?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Talking to parents about mental health in the Indian cultural context requires careful framing. Research on help-seeking in Indian families suggests starting with concrete, functional language ('I have been struggling to concentrate and sleep, and I think I need some support') rather than diagnostic or psychological language ('I think I have anxiety') which can trigger defensive responses. Frame the request around academic and functional impact rather than emotional experience, which is more likely to be taken seriously. Choose a calm moment rather than a crisis moment. Have information about specific support resources ready to share — parents who are uncertain often resist because they do not know what 'getting help' actually means. Be prepared for the first conversation not to be the productive one — the goal of the first conversation is often to open the door rather than to resolve everything.",
      },
    },
  ],
};

// ── Colour ─────────────────────────────────────────────────────────────────────
const COPPER  = '#B86040';
const CPALE   = '#FAF2EE';
const CBORD   = 'rgba(184,96,64,0.22)';

// ── Who + What + Where data ───────────────────────────────────────────────────
const TALK_TO = [
  { key: 'friend',     icon: '👥', label: 'A close friend',             desc: 'Someone you trust and see regularly', color: COPPER },
  { key: 'new_friend', icon: '🤝', label: 'An acquaintance or classmate',desc: 'Someone you know but are not close with', color: '#2D5A8A' },
  { key: 'parent',     icon: '🏠', label: 'A parent or family member',  desc: 'Navigating family dynamics and culture', color: '#2D6B45' },
  { key: 'teacher',    icon: '🏫', label: 'A teacher or mentor',        desc: 'A trusted adult in an academic setting', color: '#5B3A8B' },
  { key: 'counsellor', icon: '🛋️', label: 'A counsellor or professional',desc: 'First-time professional contact', color: '#8B2635' },
  { key: 'self',       icon: '✍️', label: 'Writing it out (to yourself first)',desc: 'Not ready to speak yet — starting with writing', color: '#C07800' },
];

const TALK_ABOUT = [
  { key: 'my_struggle', icon: '💔', label: 'My own mental health',           desc: 'Disclosing something I am experiencing' },
  { key: 'friend_help',  icon: '🤝', label: 'Supporting a friend who is struggling', desc: 'They seem to be having difficulties' },
  { key: 'general',      icon: '💬', label: 'Starting a general mental health conversation', desc: 'No specific crisis — just breaking the ice' },
  { key: 'crisis',       icon: '🆘', label: 'I am worried about someone right now', desc: 'Concerned about their safety or wellbeing' },
];

const CONVERSATION_DATA = {
  friend_my_struggle: {
    starters: [
      '"Hey — I have been wanting to tell you something but was not sure how. I have been struggling with [anxiety / low mood / stress] more than usual lately. I am not sure exactly what I need, but I wanted you to know."',
      '"Can I be honest with you about something? I have not been doing as well as I probably look. I think I have been dealing with [what you are experiencing] and I wanted to talk to someone I trust."',
      '"I have been carrying something around for a while and it is getting heavier. Can I tell you what it is?"',
    ],
    tips: [
      'Choose a calm, private moment — not a busy corridor or a social gathering',
      'It is okay to start with "I don\'t know exactly how to say this" — perfect framing is not required',
      'Tell them specifically what you need: "I just need you to listen" or "I\'d like some advice" or "I don\'t need you to fix it, just know it is there"',
    ],
    if_goes_wrong: 'If your friend responds awkwardly or dismissively, their discomfort is probably about their own uncertainty — not about your experience. A follow-up later: "I know that was probably unexpected. I don\'t need you to have answers — just wanted you to know." Most people want to support — they just don\'t know how.',
    scenario_name: 'Telling a friend you are struggling',
    color: COPPER,
  },
  friend_friend_help: {
    starters: [
      '"I have noticed you seem different lately — quieter, more withdrawn. I\'m not trying to push, but I wanted to check in properly. How are you actually doing?"',
      '"I\'ve been thinking about you and wanted to reach out. You don\'t have to tell me anything, but I\'m here if you want to talk."',
      '"Something feels off and I care about you too much to pretend I haven\'t noticed. What is going on?"',
    ],
    tips: [
      'Ask once, genuinely — then leave space. Do not fill the silence immediately',
      'If they minimise ("I\'m fine"), acknowledge but leave the door: "I hear you — I am here if that changes"',
      'Ask what they need rather than assuming: "Would it help to talk about it? Or would you rather just do something normal together?"',
    ],
    if_goes_wrong: 'If they shut down or seem annoyed that you asked, do not withdraw completely. "I\'m sorry if that was too much — I\'m here when you\'re ready" keeps the door open without pressure.',
    scenario_name: 'Checking in on a friend',
    color: COPPER,
  },
  friend_general: {
    starters: [
      '"I\'ve been thinking about mental health a lot lately — have you ever found it easy to talk about that kind of thing?"',
      '"I read something interesting about anxiety today. Do you ever feel like there\'s still a lot of stigma around actually admitting when you\'re struggling?"',
      '"Honestly, I\'ve been trying to be more open about how I\'m doing — it\'s harder than it sounds. Do you think most people are secretly struggling more than they let on?"',
    ],
    tips: [
      'Frame as curiosity rather than agenda — this makes the conversation feel safe rather than loaded',
      'Share something small of your own first — it gives them permission to share back',
      'A general conversation is valuable even without personal disclosure — it normalises the topic',
    ],
    if_goes_wrong: 'If they deflect with humour or change the subject, let it go lightly. Planting the seed matters even without immediate uptake.',
    scenario_name: 'Starting a general mental health conversation with a friend',
    color: COPPER,
  },
  friend_crisis: {
    starters: [
      '"I\'m worried about you and I need to ask directly — are you thinking about hurting yourself?"',
      '"What you just said scared me a little. Can we talk about it properly? I\'m not going anywhere."',
      '"I\'m not asking because I\'m panicking — I\'m asking because I care. Are you safe right now?"',
    ],
    tips: [
      'Ask directly about self-harm or suicidal thoughts — research shows this reduces risk, not increases it',
      'Listen without immediately problem-solving — let them say what they need to say first',
      'Stay with them, or ensure they are not alone. Connect them with iCall (9152987821) or Vandrevala Foundation (1860-2662-345)',
    ],
    if_goes_wrong: 'You cannot get this conversation "wrong" if you ask from genuine care. Even an imperfect response that comes from real concern is better than silence. If you are concerned about their safety, it is appropriate to involve a trusted adult.',
    scenario_name: 'Worried about a friend\'s safety',
    color: '#8B2635',
  },
  new_friend_my_struggle: {
    starters: [
      '"I don\'t usually talk about this kind of thing with people I don\'t know well, but I\'ve been having a harder time than usual lately."',
      '"This might be a bit unexpected — but have you ever had periods where everything feels heavier than it should?"',
    ],
    tips: [
      'Calibrate depth to relationship — you do not need full disclosure for a first conversation',
      'A small, genuine share invites reciprocity without requiring it',
    ],
    if_goes_wrong: 'If the response is cold or dismissive, this is information about whether this person can be a support — not about your experience\'s validity.',
    scenario_name: 'Opening up to a new person',
    color: '#2D5A8A',
  },
  new_friend_friend_help: {
    starters: [
      '"I\'ve noticed you seem to be going through something — I\'m not very close to you but I wanted you to know someone noticed."',
      '"I know we don\'t know each other super well, but I wanted to check in. You seem like you might be having a rough time."',
    ],
    tips: [
      'Acknowledge the newness of the relationship — it makes the care feel genuine rather than intrusive',
      'Keep it simple: "I noticed. I\'m here if it helps to talk."',
    ],
    if_goes_wrong: 'They may be surprised. Give them time to process.',
    scenario_name: 'Checking in on someone you don\'t know well',
    color: '#2D5A8A',
  },
  new_friend_general: {
    starters: [
      '"This is probably a weird thing to bring up, but do you think people at our school/college talk honestly about how they\'re doing?"',
      '"I\'ve been thinking about how different it would be if mental health was as normal to talk about as physical health."',
    ],
    tips: ['Keep it light and curious rather than heavy', 'Share a small observation before asking for their view'],
    if_goes_wrong: 'If they seem uncomfortable, change direction gently: "Just something I\'ve been thinking about — anyway..."',
    scenario_name: 'General mental health conversation with an acquaintance',
    color: '#2D5A8A',
  },
  new_friend_crisis: {
    starters: [
      '"I don\'t know you very well but something you said/did worried me. I\'m asking because I care — are you okay?"',
    ],
    tips: ['Trust your instinct — concern from a near-stranger can still matter', 'Connect them with professional support'],
    if_goes_wrong: 'Involve a trusted adult if you are genuinely concerned about their safety.',
    scenario_name: 'Worried about someone you don\'t know well',
    color: '#8B2635',
  },
  parent_my_struggle: {
    starters: [
      '"I need to tell you something that has been affecting my studying and I need your help. I have been struggling with [anxiety / sleep / mood] and I think I need some support."',
      '"I know this might be hard to hear, and I am not sure how you\'ll respond, but I trust you enough to tell you. I haven\'t been okay for a while."',
      '"Can we talk privately? I want to tell you something about how I\'ve been doing — the real version, not the fine version."',
    ],
    tips: [
      'Frame around function and impact first — "it\'s affecting my sleep, concentration and grades" is often more actionable than describing emotional experience',
      'Come with a specific ask: "I\'d like to see a counsellor" or "I\'d like to talk to a doctor" — concrete requests reduce parental uncertainty',
      'Choose a calm, private moment — not during family stress or after a conflict',
      'Be prepared for the first response not to be perfect — some parents need time to process',
    ],
    if_goes_wrong: 'If the response is dismissive or shaming, try: "I understand this is unexpected. I\'m not asking you to have answers — I just needed to tell someone I trust." Give them time. Try again later. If needed, find a trusted adult outside the family.',
    scenario_name: 'Telling a parent about your mental health',
    color: '#2D6B45',
  },
  parent_friend_help: {
    starters: [
      '"I\'m worried about a friend and I don\'t know what to do. Can I talk to you about it?"',
      '"A friend has been going through something difficult and I want to help but I\'m not sure how — can I ask your advice?"',
    ],
    tips: [
      'Asking a parent for advice about a friend\'s situation models help-seeking without full self-disclosure',
      'You can share your concern without revealing identifying details if confidentiality matters',
    ],
    if_goes_wrong: 'If they minimise your concern, you can say: "I know it might not seem serious, but it felt serious to me."',
    scenario_name: 'Asking a parent for advice about a friend',
    color: '#2D6B45',
  },
  parent_general: {
    starters: [
      '"I\'ve been learning a lot about mental health lately — did you ever have periods as a student that felt really hard?"',
      '"I read that anxiety is really common among students our age. Do you think there\'s still a lot of stigma around it?"',
    ],
    tips: [
      'A general conversation builds the bridge that makes personal disclosure easier later',
      'Asking about their experience makes them a participant rather than an audience',
    ],
    if_goes_wrong: 'If they shut it down, note their response for calibrating future disclosure.',
    scenario_name: 'General mental health conversation with a parent',
    color: '#2D6B45',
  },
  parent_crisis: {
    starters: [
      '"Something is happening that I need adult help with right now. A friend needs support that is beyond what I can give."',
      '"I need your help — this is serious and I\'m scared."',
    ],
    tips: ['Be direct about the seriousness', 'Name specifically what you need: "I need you to help me contact a counsellor for them" or "I need you to call someone"'],
    if_goes_wrong: 'If a parent does not respond with appropriate seriousness, contact iCall (9152987821) or Vandrevala Foundation (1860-2662-345) directly.',
    scenario_name: 'Crisis — asking a parent for help',
    color: '#8B2635',
  },
  teacher_my_struggle: {
    starters: [
      '"I\'d like to speak to you privately if that\'s okay. I\'ve been having some difficulties that are affecting my work and I\'d like to ask for some support."',
      '"I\'m not sure how to ask this, but I have been struggling with something that is making it hard to focus and perform at my usual level. I wanted to let you know and ask if there is any support available."',
    ],
    tips: [
      'Focus on functional impact and the support you are seeking, rather than full emotional disclosure',
      'Ask what support the school offers — many teachers do not volunteer information about resources unless asked directly',
      'Ask explicitly about confidentiality: "Is what I tell you private?"',
    ],
    if_goes_wrong: 'If the teacher responds insensitively, try the school counsellor directly, or another teacher you trust more.',
    scenario_name: 'Asking a teacher for support',
    color: '#5B3A8B',
  },
  teacher_friend_help: {
    starters: [
      '"I\'m concerned about a classmate and I wanted to ask your advice about what to do."',
      '"I don\'t want to betray someone\'s trust, but I\'m worried enough to ask for help — can we talk?"',
    ],
    tips: ['You can share concern without identifying details initially', 'Ask what the teacher\'s responsibility is before sharing — so you know what will happen to the information'],
    if_goes_wrong: 'If the teacher takes an unhelpful approach, escalate to the school counsellor.',
    scenario_name: 'Asking a teacher about a worried about a classmate',
    color: '#5B3A8B',
  },
  teacher_general: {
    starters: [
      '"Do you think our school does enough to support student mental health? I\'ve been thinking about it a lot."',
      '"I wanted to ask what resources are available for students who are struggling — I\'m asking for general knowledge."',
    ],
    tips: ['This normalises the topic in the academic setting', 'You may get useful resource information as a by-product'],
    if_goes_wrong: 'If the teacher seems dismissive, this tells you who the safer teachers to approach are.',
    scenario_name: 'General mental health conversation with a teacher',
    color: '#5B3A8B',
  },
  teacher_crisis: {
    starters: [
      '"I need your help with something urgent. A student I know is in a really bad place and I don\'t think I can handle it alone."',
    ],
    tips: ['Be direct about urgency', 'Bring any relevant information you have', 'This is exactly what teachers and counsellors are trained for — do not handle it alone'],
    if_goes_wrong: 'If the teacher is unavailable, go to the school counsellor, principal, or call iCall directly.',
    scenario_name: 'Crisis — involving a teacher',
    color: '#8B2635',
  },
  counsellor_my_struggle: {
    starters: [
      '"I\'ve never spoken to a counsellor before. I\'m not sure exactly what I\'m experiencing, but I know something is not right and I\'d like some help understanding what it is."',
      '"I\'ve been struggling with [what you\'re experiencing] for a while and I think I need professional support. I wasn\'t sure how to start this conversation."',
      '"I\'m here because someone I trust encouraged me to come. I don\'t know exactly what to say yet, but I\'m willing to try."',
    ],
    tips: [
      'You do not need a perfect explanation — the counsellor\'s job is to help you articulate what is happening',
      'You can literally say "I don\'t know where to start" — this is a completely valid and common opening',
      'Ask about confidentiality at the start: "What stays between us?"',
      'The first session is often just the beginning of an ongoing process — one session is usually not the whole answer',
    ],
    if_goes_wrong: 'If the first counsellor does not feel like a good fit, that is normal and it is okay to try another. Therapeutic fit matters — a bad fit is information, not failure.',
    scenario_name: 'First conversation with a counsellor',
    color: '#8B2635',
  },
  counsellor_friend_help: {
    starters: [
      '"I\'m coming because I\'m worried about someone else — a friend — and I want advice on how to help them."',
    ],
    tips: ['Counsellors can advise on how to support someone without that person being present', 'Share your specific concern and ask: "What would you recommend I do?"'],
    if_goes_wrong: 'Any professional support you seek for yourself in the process of supporting a friend is also legitimate.',
    scenario_name: 'Talking to a counsellor about a friend',
    color: '#8B2635',
  },
  counsellor_general: {
    starters: [
      '"I\'d like to know what\'s available in terms of mental health support — can you walk me through what you offer and what it looks like?"',
    ],
    tips: ['This is a completely valid reason to contact a counsellor — getting information before you need it removes barriers later'],
    if_goes_wrong: 'Any conversation with a professional builds the relationship that makes deeper conversations easier later.',
    scenario_name: 'Exploring counselling resources',
    color: '#8B2635',
  },
  counsellor_crisis: {
    starters: [
      '"I need help right now — I [or someone I know] is not safe and I don\'t know what to do."',
      '"This is an emergency. I need to speak to someone immediately."',
    ],
    tips: ['Crisis = call iCall (9152987821) or Vandrevala (1860-2662-345) immediately if counsellor is unavailable', 'Do not leave a person in crisis alone while seeking help'],
    if_goes_wrong: 'Call emergency services or a crisis line directly if professional is not immediately available.',
    scenario_name: 'Crisis — contacting a counsellor',
    color: '#8B2635',
  },
  self_my_struggle: {
    starters: [
      '"Dear [name] — I want to write down honestly what I have been feeling because I have not been able to say it out loud yet."',
      '"The thing I have been carrying around and not saying is..."',
      '"If I were writing a letter to someone I completely trusted, I would tell them..."',
    ],
    tips: [
      'Writing to yourself first removes the performance pressure of having an audience',
      'Date your writing — returning to it later shows you how much has changed, or reveals what has not',
      'The goal is honest articulation, not polished expression — let it be messy',
    ],
    if_goes_wrong: 'If writing produces distress rather than relief, step away and go to SecretSharz\'s Safe Corner — you do not have to process alone.',
    scenario_name: 'Writing it out — talking to yourself first',
    color: '#C07800',
  },
  self_friend_help: {
    starters: [
      '"I am worried about [friend\'s name] because I have noticed [specific observation]. I want to reach out but I am scared of saying the wrong thing. If I were to say something, it would be..."',
    ],
    tips: ['Writing your intended conversation beforehand removes the in-the-moment pressure', 'You can even practice the conversation in writing — their likely responses and your answers'],
    if_goes_wrong: 'If after writing you are still too frightened to speak, share the written version directly — showing someone a written note is valid communication.',
    scenario_name: 'Writing to prepare a conversation',
    color: '#C07800',
  },
  self_general: {
    starters: [
      '"The things I believe about mental health that I might be wrong about are..."',
      '"The conversations about mental health I have been avoiding are... and the reason I have been avoiding them is..."',
    ],
    tips: ['A self-reflection journal entry about mental health builds the self-awareness that makes external conversations easier', 'These prompts can become conversation starters once articulated'],
    if_goes_wrong: 'Private writing is private — you can explore without commitment to sharing.',
    scenario_name: 'Exploring your own views through writing',
    color: '#C07800',
  },
  self_crisis: {
    starters: [
      '"I am writing this because I feel like I cannot say it. What I need right now is..."',
    ],
    tips: [
      'If you are writing about crisis feelings, please call iCall (9152987821) or Vandrevala (1860-2662-345)',
      'Writing during crisis can help clarify what you need — but do not stay alone with it',
    ],
    if_goes_wrong: 'Please reach out. iCall: 9152987821. Vandrevala: 1860-2662-345. SecretSharz Safe Corner: /safe.',
    scenario_name: 'Writing when in crisis',
    color: '#8B2635',
  },
};

// ── Conversation Builder ───────────────────────────────────────────────────────
function ConversationBuilder() {
  const [talkTo,   setTalkTo]   = useState(null);
  const [talkAbout,setTalkAbout]= useState(null);
  const [revealed, setRevealed] = useState(false);
  const [copiedIdx,setCopiedIdx]= useState(null);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const key = talkTo && talkAbout ? `${talkTo}_${talkAbout}` : null;
  const convData = key ? CONVERSATION_DATA[key] : null;
  const selTo    = TALK_TO.find(t => t.key === talkTo);
  const selAbout = TALK_ABOUT.find(a => a.key === talkAbout);

  const handleReset = () => { setTalkTo(null); setTalkAbout(null); setRevealed(false); setCopiedIdx(null); };

  const BtnSmall = ({ opt, selected, onSelect, variant }) => {
    const isSel = selected === opt.key;
    const col = variant === 'about' ? COPPER : (opt.color || COPPER);
    return (
      <button onClick={() => onSelect(opt.key)} style={{
        padding: '10px 13px', borderRadius: '11px', border: '2px solid',
        borderColor: isSel ? col : 'var(--border)', background: isSel ? `${col}12` : 'white',
        cursor: 'pointer', fontFamily: font, textAlign: 'left', transition: 'all 0.15s',
        display: 'flex', alignItems: 'flex-start', gap: '9px', width: '100%', marginBottom: '7px',
        boxShadow: isSel ? `0 0 0 2px ${col}20` : 'none',
      }}>
        <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{opt.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: isSel ? col : 'var(--ink)', marginBottom: '1px' }}>{opt.label}</div>
          {opt.desc && <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.3 }}>{opt.desc}</div>}
        </div>
        {isSel && <span style={{ color: col, fontWeight: '700', flexShrink: 0, marginTop: '1px' }}>✓</span>}
      </button>
    );
  };

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', marginBottom: '30px', border: '1px solid var(--border)', fontFamily: font }}>
      {!revealed ? (
        <>
          <p style={{ margin: '0 0 16px 0', fontWeight: '700', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--muted)' }}>
            Build Your Conversation
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: COPPER, marginBottom: '8px', letterSpacing: '1px' }}>WHO are you talking to?</div>
              {TALK_TO.map(t => <BtnSmall key={t.key} opt={t} selected={talkTo} onSelect={setTalkTo} variant="to" />)}
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: COPPER, marginBottom: '8px', letterSpacing: '1px' }}>WHAT are you talking about?</div>
              {TALK_ABOUT.map(a => <BtnSmall key={a.key} opt={a} selected={talkAbout} onSelect={setTalkAbout} variant="about" />)}
            </div>
          </div>
          <button onClick={() => { if (talkTo && talkAbout) setRevealed(true); }} disabled={!talkTo || !talkAbout} style={{ width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: (talkTo && talkAbout) ? `linear-gradient(135deg, ${COPPER}, #D87858)` : 'var(--border)', color: 'white', fontWeight: '700', fontSize: '15px', cursor: (talkTo && talkAbout) ? 'pointer' : 'not-allowed', fontFamily: font, boxShadow: (talkTo && talkAbout) ? `0 6px 18px ${CBORD}` : 'none' }}>
            {(talkTo && talkAbout) ? 'Build My Conversation →' : 'Select WHO and WHAT to continue'}
          </button>
        </>
      ) : convData ? (
        <div style={{ animation: 'floatUp 0.4s ease' }}>
          <div style={{ background: `linear-gradient(135deg, ${selTo?.color || COPPER}, #D87858)`, borderRadius: '14px', padding: '18px', marginBottom: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>{selTo?.icon} {selAbout?.icon}</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: 'white' }}>{convData.scenario_name}</div>
          </div>

          {/* Starters */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: COPPER, marginBottom: '8px', letterSpacing: '1.2px' }}>💬 CONVERSATION STARTERS — CHOOSE ONE:</div>
            {convData.starters.map((s, i) => (
              <div key={i} style={{ background: 'white', border: `1.5px solid ${COPPER}25`, borderRadius: '12px', padding: '13px 14px', marginBottom: '8px', borderLeft: `4px solid ${COPPER}` }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.75, fontStyle: 'italic' }}>{s}</p>
                <button onClick={() => { navigator.clipboard?.writeText(s.replace(/"/g, '')); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 2000); }} style={{ padding: '5px 12px', borderRadius: '20px', border: `1px solid ${COPPER}30`, background: copiedIdx === i ? `${COPPER}15` : 'transparent', color: COPPER, fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: font }}>
                  {copiedIdx === i ? '✓ Copied' : '📋 Copy'}
                </button>
              </div>
            ))}
          </div>

          {/* Tips */}
          <div style={{ background: CPALE, borderRadius: '12px', padding: '13px 15px', marginBottom: '10px', border: `1.5px solid ${CBORD}` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: COPPER, marginBottom: '6px', letterSpacing: '1.2px' }}>🎯 COMMUNICATION TIPS:</div>
            {convData.tips.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', padding: '3px 0' }}>
                <span style={{ color: COPPER, fontWeight: '700', flexShrink: 0 }}>→</span>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6 }}>{t}</p>
              </div>
            ))}
          </div>

          {/* If goes wrong */}
          <div style={{ background: '#FBF0F1', borderRadius: '12px', padding: '12px 14px', marginBottom: '14px', border: '1px solid rgba(139,38,53,0.15)' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: '#8B2635', marginBottom: '4px' }}>🔄 IF IT DOESN\'T GO AS HOPED:</div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{convData.if_goes_wrong}</p>
          </div>

          <button onClick={handleReset} style={{ background: 'transparent', border: `1.5px solid ${CBORD}`, color: COPPER, padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', fontFamily: font }}>↺ Build a different conversation</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: 'var(--muted)', fontSize: '13px' }}>This specific combination doesn\'t have a dedicated guide yet. Try the closest available combination or use the general starters in the blog below.</p>
          <button onClick={handleReset} style={{ marginTop: '10px', padding: '9px 18px', borderRadius: '50px', border: `1.5px solid ${CBORD}`, background: 'transparent', color: COPPER, fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: font }}>← Try another combination</button>
        </div>
      )}
    </div>
  );
}

// ── Scenario Trainer ───────────────────────────────────────────────────────────
const SCENARIO_TRAINER = [
  {
    id: 1,
    setup: 'Your friend tells you: "I\'ve been feeling really low lately — like nothing is worth anything." What do you say first?',
    options: [
      { key: 'a', text: '"You\'ll feel better soon, everyone goes through phases like this."', correct: false, why: 'This minimises their experience and closes the conversation. "Everyone goes through this" makes them feel unheard rather than understood.' },
      { key: 'b', text: '"That sounds really heavy. How long have you been feeling this way?"', correct: true, why: 'This acknowledges the weight of what they shared and opens the door wider with a genuine follow-up question. You are listening, not immediately fixing.' },
      { key: 'c', text: '"You should see a counsellor about that."', correct: false, why: 'Jumping to solutions before acknowledging what they shared can feel dismissive. Even a correct suggestion lands better after the person feels heard.' },
      { key: 'd', text: '"I know exactly how you feel — I went through the same thing."', correct: false, why: 'Redirecting to your own experience, however well-intentioned, shifts the focus away from them at the moment they most need it on themselves.' },
    ],
    color: COPPER, lesson: 'Acknowledge first, then ask. Solutions come after the person feels genuinely heard.',
  },
  {
    id: 2,
    setup: 'You want to check in on a classmate who has been absent for two weeks and seemed withdrawn before that. You text them. What is the best message?',
    options: [
      { key: 'a', text: '"Where have you been? Everyone has been asking about you."', correct: false, why: 'This creates social pressure rather than genuine connection. It frames their absence as a performance failure rather than a concern.' },
      { key: 'b', text: '"Hey, I\'ve been thinking about you. No pressure to explain anything — just wanted to let you know I\'m here if you want to talk."', correct: true, why: 'This communicates genuine care without pressure, leaves control with them, and opens the door without demanding they walk through it.' },
      { key: 'c', text: '"Are you okay? You seem depressed."', correct: false, why: 'Diagnosing someone in a text is not the same as checking in. It can feel alarming, presumptuous, or like an accusation rather than concern.' },
      { key: 'd', text: '"I heard you\'ve been having a tough time. You should really talk to someone."', correct: false, why: '"I heard" suggests social information rather than direct observation. Immediately suggesting they talk to someone skips the connection they may need first.' },
    ],
    color: '#2D5A8A', lesson: 'Connection before suggestion. Reduce pressure. Give them control over next steps.',
  },
  {
    id: 3,
    setup: 'You are telling your parent you have been struggling with anxiety. They respond: "You\'re just overthinking it — you\'ve always been sensitive." What do you say next?',
    options: [
      { key: 'a', text: '"You never take me seriously. Forget it."', correct: false, why: 'Ending the conversation when it becomes difficult closes the door. It may feel justified but it is less likely to result in the support you actually need.' },
      { key: 'b', text: '"I understand it might seem that way. I\'ve been experiencing things that have been affecting my sleep and my studying, and I\'d really like to get some support — can we talk about that?"', correct: true, why: 'Acknowledging their perspective without abandoning yours, then redirecting to the concrete and specific impact makes the conversation more likely to continue productively.' },
      { key: 'c', text: '"You\'re right, I am probably overreacting."', correct: false, why: 'Accepting the dismissal abandons the original need. It may reduce immediate conflict but it leaves the underlying difficulty unaddressed.' },
      { key: 'd', text: '"The research says anxiety is a real medical condition."', correct: false, why: 'Arguing with evidence during an emotionally charged moment rarely changes minds. It shifts the conversation from relationship to debate.' },
    ],
    color: '#2D6B45', lesson: 'Acknowledge their response without abandoning your need. Redirect to concrete, specific impact.',
  },
  {
    id: 4,
    setup: 'A friend says: "I\'ve been having thoughts about not wanting to be here anymore." What do you do?',
    options: [
      { key: 'a', text: '"Oh — I\'m sure you don\'t mean that. You\'re probably just tired."', correct: false, why: 'This minimises a serious disclosure and closes the door on a conversation that needs to stay open. Research documents this as one of the most harmful possible responses.' },
      { key: 'b', text: '"That took courage to share. I need to ask directly — are you thinking about hurting yourself?"', correct: true, why: 'Acknowledging the courage of disclosure, then asking directly. Research consistently shows direct questions about suicidal thoughts reduce risk rather than increase it. This response takes them seriously and opens the crucial conversation.' },
      { key: 'c', text: '"Have you tried journalling? That really helped me."', correct: false, why: 'This is a solution to a different, much smaller problem. It trivialises a serious disclosure and misses the moment entirely.' },
      { key: 'd', text: '"You should not say things like that — it\'s really scary to hear."', correct: false, why: 'Centring your own fear as the response to their disclosure makes them responsible for your emotional regulation rather than feeling supported.' },
    ],
    color: '#8B2635', lesson: 'Always take expressions of suicidal ideation seriously. Ask directly. It reduces risk — it does not increase it.',
  },
  {
    id: 5,
    setup: 'A friend comes to you and says: "I think I\'m depressed but I don\'t know how to tell my parents." What is the most helpful first response?',
    options: [
      { key: 'a', text: '"Just tell them directly. The longer you wait the worse it gets."', correct: false, why: 'This gives a solution without understanding what has made telling them difficult. The "just" minimises what may be a complex family dynamic.' },
      { key: 'b', text: '"That\'s a big step to even recognise. What feels most scary about telling them?"', correct: true, why: 'Acknowledging that naming what they are experiencing is already significant, then understanding the specific barrier before offering solutions. This puts you in a position to actually help rather than just advising generally.' },
      { key: 'c', text: '"You don\'t have to tell them if you don\'t want to."', correct: false, why: 'While technically true, this might reinforce avoidance of a conversation that could lead to valuable support. It closes a door rather than helping them explore it.' },
      { key: 'd', text: '"My cousin went through the same thing — here is what they did."', correct: false, why: 'Jumping to others\' experiences before understanding their specific situation skips the most important part of the conversation: understanding their actual barrier.' },
    ],
    color: '#5B3A8B', lesson: 'Understand the specific obstacle before offering solutions. Ask what makes it scary before advising.',
  },
];

function ScenarioTrainer() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [done, setDone] = useState(false);
  const font = "'Plus Jakarta Sans', system-ui, sans-serif";

  const sc = SCENARIO_TRAINER[current];
  const total = SCENARIO_TRAINER.length;
  const correct = SCENARIO_TRAINER.filter(s => answers[s.id] !== undefined && SCENARIO_TRAINER.find(q => q.id === s.id)?.options.find(o => o.key === answers[s.id])?.correct).length;
  const answered = Object.keys(answers).length;
  const userAns = answers[sc.id];
  const isRevealed = revealed[sc.id];
  const selOpt = sc.options.find(o => o.key === userAns);
  const isCorrect = selOpt?.correct;

  const handleAnswer = (key) => {
    if (answers[sc.id]) return;
    setAnswers(prev => ({ ...prev, [sc.id]: key }));
    setRevealed(prev => ({ ...prev, [sc.id]: true }));
  };

  if (done) {
    const pct = Math.round((correct / total) * 100);
    return (
      <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', fontFamily: font, textAlign: 'center' }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>💬</div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: '700', color: COPPER, marginBottom: '5px' }}>
          {correct === total ? 'Excellent Communicator 🌟' : correct >= 4 ? 'Strong Communicator 💚' : correct >= 3 ? 'Developing Communicator 🌱' : 'Building Awareness 🔍'}
        </div>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '36px', fontWeight: '700', color: COPPER, marginBottom: '12px' }}>{correct}/{total}</div>
        <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
          {correct === total ? 'You chose the most evidence-based responses in every scenario. This is the communication quality that makes a genuine difference.' : 'Review the lessons below each question — the specific reasoning is where the learning lives. Each scenario represents a real conversation type you may encounter.'}
        </p>
        <button onClick={() => { setCurrent(0); setAnswers({}); setRevealed({}); setDone(false); }} style={{ padding: '12px 26px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${COPPER}, #D87858)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>↺ Try Again</button>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', fontFamily: font }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: COPPER, textTransform: 'uppercase', letterSpacing: '1px' }}>WHAT WOULD YOU SAY?</span>
        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Scenario {current + 1} of {total}</span>
      </div>
      <div style={{ width: '100%', height: '5px', borderRadius: '3px', background: 'var(--border)', marginBottom: '18px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: `linear-gradient(90deg, ${COPPER}, #D87858)`, width: `${((current + 1) / total) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      <div style={{ background: 'white', borderRadius: '13px', padding: '18px', marginBottom: '14px', border: `1.5px solid ${sc.color}25` }}>
        <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: sc.color, marginBottom: '7px' }}>🎬 THE SITUATION:</div>
        <p style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '600', color: 'var(--ink)', lineHeight: 1.6 }}>{sc.setup}</p>
      </div>

      {!isRevealed ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
          {sc.options.map(opt => (
            <button key={opt.key} onClick={() => handleAnswer(opt.key)} style={{ padding: '12px 14px', borderRadius: '11px', border: '2px solid var(--border)', background: 'white', cursor: 'pointer', fontFamily: font, fontSize: '13px', color: 'var(--ink)', textAlign: 'left', lineHeight: 1.55, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = sc.color; e.currentTarget.style.background = `${sc.color}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; }}>
              <span style={{ fontWeight: '700', color: sc.color, marginRight: '6px' }}>{opt.key.toUpperCase()}.</span> {opt.text}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ animation: 'floatUp 0.3s ease', marginBottom: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
            {sc.options.map(opt => {
              const isSel = userAns === opt.key;
              let bg = 'white', border = 'var(--border)', col = 'var(--muted)';
              if (opt.correct) { bg = '#E8F4EE'; border = '#2D6B45'; col = '#2D6B45'; }
              if (isSel && !opt.correct) { bg = '#FBF0F1'; border = '#8B2635'; col = '#8B2635'; }
              return (
                <div key={opt.key} style={{ padding: '11px 13px', borderRadius: '10px', border: `2px solid ${border}`, background: bg }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{opt.correct ? '✅' : isSel ? '❌' : '○'}</span>
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: col, fontWeight: isSel || opt.correct ? '700' : '400' }}>{opt.text}</p>
                      {(isSel || opt.correct) && <p style={{ margin: 0, fontSize: '11px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{opt.why}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: CPALE, borderRadius: '10px', padding: '10px 13px', marginBottom: '12px', border: `1.5px solid ${CBORD}`, borderLeft: `4px solid ${COPPER}` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: COPPER, marginBottom: '3px', textTransform: 'uppercase' }}>📖 KEY LESSON:</div>
            <p style={{ margin: 0, fontSize: '13px', color: COPPER, fontWeight: '600', lineHeight: 1.6 }}>{sc.lesson}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {current < total - 1 ? (
              <button onClick={() => setCurrent(c => c + 1)} style={{ padding: '11px 26px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${COPPER}, #D87858)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>Next Scenario →</button>
            ) : (
              <button onClick={() => setDone(true)} style={{ padding: '11px 26px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${COPPER}, #D87858)`, color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: font }}>See My Results 🌟</button>
            )}
          </div>
        </div>
      )}
      <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }}>{answered} answered · {total - answered} remaining</div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TalkAboutMentalHealth({ navigate, relatedPosts }) {
  const [activeTrainer, setActiveTrainer] = useState(false);
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

      <p>Most people who struggle with mental health know they should talk about it. They know, intellectually, that sharing helps. They know someone in their life would probably want to support them. And they still say nothing — because knowing you should talk and knowing how to talk are entirely different things. The first is information; the second is a skill. This guide is for building the skill.</p>

      <p>Learning to <strong>talk about mental health</strong> is not about having perfect words. It is about knowing the general shape of a productive conversation — what to lead with, what to avoid, what to do when the response is not what you hoped for, and how to help someone else when they open up to you. These are learnable, practicable communication abilities, not innate qualities.</p>

      <img
        src={meta.imgUrl}
        alt="How to talk about mental health without fear or judgment — conversation starters, communication tips, and relatable student scenarios"
        style={{ width: '100%', borderRadius: '12px', marginTop: '20px', marginBottom: '20px', border: '1px solid var(--border)' }}
      />

      <h3 id="why-hard">1. Why Talking About Mental Health Is Hard</h3>

      <p><strong>The vulnerability cost.</strong> Talking about mental health requires vulnerability — the willingness to reveal something uncertain, potentially stigmatised, and genuinely personal to another person who might respond in ways that cannot be predicted. Research by Brené Brown at the University of Houston on vulnerability documents that the specific fear of disclosure is almost never about the content of what would be shared; it is about the anticipated response — judgement, dismissal, awkwardness, or the loss of the social position that "being fine" has been maintaining. The vulnerability is real, which makes the courage required also real.</p>

      <p><strong>The cultural context — specific to India.</strong> In many Indian cultural frameworks, mental and emotional experience is expected to remain private — discussed within the family at most, often not even then. The public discussion of psychological difficulty, particularly for young men, carries specific cultural loading: not-weakness, composure, and self-sufficiency are heavily valued qualities whose absence, if disclosed, risks social consequence in ways that physical illness does not. Acknowledging this cultural context is not to accept it as permanent — it is to understand why the conversations are harder than they would be in environments where the cultural loading is different.</p>

      <p><strong>The "I don't know what to say" barrier.</strong> Even people who want to support someone who is struggling often do not act on that desire because they genuinely do not know what to say — and fear that saying the wrong thing would make things worse. Research on bystander behaviour and mental health support consistently documents this as the primary barrier to support provision among peers who are willing: not indifference but the fear of inadequacy. The good news that the same research documents: saying almost anything from genuine care is better than saying nothing. The specific words matter far less than the genuine attention and care behind them.</p>

      <h3 id="why-matters">2. Why Talking About It Matters — The Research</h3>

      <p><strong>Disclosure reduces the isolating effect of mental health difficulty.</strong> Research by Pennebaker at UT Austin on disclosure and health documents that talking or writing about difficult psychological experiences produces measurable improvements in psychological and physical health — not because disclosure solves the underlying problem but because it converts an isolated, individually-borne experience into a shared one. The experience of being genuinely heard — without judgment, without immediately-imposed solutions — is itself a significant wellbeing intervention. Isolation is one of the most consistently documented risk factors for worsening mental health; disclosure, even partial and even imperfect, is its direct antidote.</p>

      <p><strong>Seeking and receiving social support is the most powerful protective factor available.</strong> Research by House and colleagues, and subsequently by numerous researchers in social health, consistently documents social support as the single most powerful available protective factor against mental health deterioration and the strongest predictor of recovery. It is more protective than any individual psychological intervention, more predictive of good outcomes than most individual-level variables. The accessible, affordable, immediately available version of social support is genuine conversation — the conversation that requires no appointment, no cost, and no professional training to provide something real.</p>

      <p><strong>Talking reduces stigma — for both parties.</strong> Research on contact theory and stigma reduction documents that direct personal contact with mental health experience — either through disclosure or through genuine supportive response — consistently reduces stigma more effectively than any educational intervention. The person who has openly shared their experience and been genuinely received with compassion is less likely to apply stigma to others' experiences; the person who has been the compassionate receiver is less likely to apply stigma to their own. Every genuine mental health conversation is a small act of stigma reduction that benefits both participants.</p>

      <h3 id="builder">3. Interactive: The Conversation Builder</h3>
      <p>Select who you want to talk to and what you want to talk about. The Builder generates personalised conversation starters you can copy, communication tips for that specific context, and guidance on what to do if the conversation does not go as hoped. Then try the Scenario Trainer below to practise choosing the best responses in five realistic student situations.</p>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '30px' }}>
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '700', color: COPPER, fontFamily: font }}>Part 1 — Conversation Starter Builder:</p>
          <ConversationBuilder />
        </div>
        <div>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: '700', color: COPPER, fontFamily: font }}>Part 2 — What Would You Say? Scenario Trainer:</p>
          <ScenarioTrainer />
        </div>
      </div>

      <h3 id="starters">4. Conversation Starters for Six Specific Situations</h3>

      {[
        {
          sit: 'When you are struggling and want to open up to someone', color: COPPER, icon: '💔',
          starters: [
            '"There is something I have been wanting to talk about but was not sure how to bring up."',
            '"Can I be honest with you about something? I have not been okay lately."',
            '"I am going through something and I think I need to say it out loud to someone I trust."',
          ],
          tip: 'You do not need to have a perfect explanation ready. Starting with "I don\'t know exactly how to say this" is a legitimate and honest opening.',
        },
        {
          sit: 'When you want to check in on a friend who seems to be struggling', color: '#2D5A8A', icon: '👀',
          starters: [
            '"I have noticed you seem quieter than usual — is everything okay?"',
            '"I\'ve been thinking about you. How are you actually doing?"',
            '"Something feels different and I wanted to ask rather than assume. What is going on?"',
          ],
          tip: 'Specific observations ("quieter than usual") signal genuine attention. General questions ("how are you?") invite surface answers.',
        },
        {
          sit: 'When talking to a parent or family member about your mental health', color: '#2D6B45', icon: '🏠',
          starters: [
            '"I need to tell you something that has been affecting my studying and I need your help with it."',
            '"I want to be honest with you about something — I have not been doing as well as I look."',
            '"Can we talk privately about something that has been on my mind for a while?"',
          ],
          tip: 'Lead with concrete functional impact (sleep, study, energy) rather than emotional language. Have a specific request ready: "I\'d like to see a counsellor."',
        },
        {
          sit: 'When approaching a teacher or mentor for support', color: '#5B3A8B', icon: '🏫',
          starters: [
            '"I\'d like to speak to you privately. I have been having some difficulties that are affecting my work."',
            '"I\'m not sure exactly how to ask this, but I think I need some support and I trust you."',
            '"Before I explain — can I ask what the school\'s confidentiality policy is for this kind of conversation?"',
          ],
          tip: 'Ask about confidentiality before disclosing. Focus on the impact on academic functioning — this frames the conversation in terms the school context can respond to.',
        },
        {
          sit: 'When someone has just disclosed something difficult to you', color: '#8B2635', icon: '🤝',
          starters: [
            '"Thank you for telling me. That took courage and I want to hear more."',
            '"I am glad you told me. I am not going to have easy answers but I am here."',
            '"That sounds really hard. What would be most helpful for you right now — do you want to talk it through, or just know that someone knows?"',
          ],
          tip: 'Acknowledge before advising. Ask what they need rather than assuming. The first gift is being genuinely heard.',
        },
        {
          sit: 'When starting the conversation with yourself (not yet ready to speak to others)', color: '#C07800', icon: '✍️',
          starters: [
            '"The thing I have been carrying around that I have not said yet is..."',
            '"If I were writing a letter to someone I completely trusted, I would tell them..."',
            '"What I need right now that I have not been giving myself is..."',
          ],
          tip: 'Writing to yourself first removes the audience. The internal conversation is the first conversation — and often the most honest one available.',
        },
      ].map((s, i) => (
        <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', marginBottom: '14px', border: `1.5px solid ${s.color}25`, borderLeft: `4px solid ${s.color}`, fontFamily: font }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '20px' }}>{s.icon}</span>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '700', color: s.color }}>{s.sit}</div>
          </div>
          <div style={{ marginBottom: '10px' }}>
            {s.starters.map((st, j) => (
              <div key={j} style={{ background: `${s.color}08`, borderRadius: '9px', padding: '10px 12px', marginBottom: '6px', border: `1px solid ${s.color}20` }}>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, fontStyle: 'italic' }}>{st}</p>
              </div>
            ))}
          </div>
          <div style={{ background: CPALE, borderRadius: '8px', padding: '8px 11px', border: `1px solid ${CBORD}` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: COPPER, marginBottom: '2px', textTransform: 'uppercase' }}>💡 TIP:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{s.tip}</p>
          </div>
        </div>
      ))}

      <h3 id="tips">5. Communication Tips for Mental Health Conversations</h3>

      {[
        { num: '01', tip: 'Acknowledge before advising', detail: 'The most common mistake in mental health support conversations is moving to solutions before the person feels genuinely heard. "You should try..." before "That sounds really hard" skips the acknowledgment that makes the solution receivable. Acknowledge fully, then ask if they want advice, then offer it.', color: COPPER },
        { num: '02', tip: 'Ask what they need, do not assume', detail: '"Would it help to talk about it?" or "Would you rather just do something normal together right now?" gives them control over what support looks like. The supporter who assumes what is helpful may provide the wrong thing with good intentions. The supporter who asks provides what is actually needed.', color: '#2D5A8A' },
        { num: '03', tip: 'Listen without immediately fixing', detail: 'The urge to fix comes from genuine care, but it can short-circuit the most valuable thing a conversation can provide: the experience of being fully heard. Let them finish speaking before your mind starts generating solutions. Ask a follow-up question about what they said before offering anything from your own response.', color: '#2D6B45' },
        { num: '04', tip: 'Do not rank suffering or compare experiences', detail: '"At least it\'s not as bad as..." or "I went through something similar and I was fine" are well-intentioned responses that consistently backfire. They either minimise the person\'s experience or redirect the conversation to yours at the moment they most need it on themselves. Their suffering is not a competition.', color: '#5B3A8B' },
        { num: '05', tip: 'Choose your moment — timing is communication', detail: 'A mental health conversation initiated in a busy corridor, in a group setting, or mid-exam-season offers the person nowhere to respond genuinely. Choose a private, calm moment. For digital communication: a text check-in is a door — the actual conversation usually needs a different medium.', color: '#8B2635' },
        { num: '06', tip: 'It is okay to not have answers', detail: '"I don\'t know what to say, but I am really glad you told me" is a completely valid and often deeply valued response. You do not need answers, expertise, or solutions. You need genuine presence. The person who reaches for you does not usually need you to fix their situation — they need to not be alone in it.', color: COPPER },
      ].map(t => (
        <div key={t.num} style={{ background: 'white', borderRadius: '13px', padding: '16px 18px', marginBottom: '10px', border: '1.5px solid var(--border)', borderLeft: `4px solid ${t.color}`, fontFamily: font }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: '700', color: `${t.color}40` }}>{t.num}</span>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: '700', color: t.color }}>{t.tip}</div>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.75 }}>{t.detail}</p>
        </div>
      ))}

      <h3 id="scenarios">6. Relatable Scenarios — What to Say and What Not to Say</h3>

      {[
        {
          scenario: 'Aryan tells you: "I haven\'t been sleeping properly for weeks — my mind just won\'t stop. I\'m okay though."',
          not_say: '"If you\'re okay, why bring it up?" — This dismisses the implicit signal in the disclosure.',
          say: '"Even when we say we\'re okay, sometimes things catch up with us. Do you want to talk about what\'s been in your head?"',
          why: '"I\'m okay though" often follows a disclosure precisely because the person is testing whether it is safe to say more. Gentle opening rather than taking the "okay" at face value is the more supportive response.',
          color: COPPER,
        },
        {
          scenario: 'Meera has been absent for two weeks. You see her returning to class. She looks exhausted.',
          not_say: '"Where have you been? I was so worried!" — This creates pressure and centres your experience.',
          say: '"Hey — I am really glad to see you back. You don\'t have to explain anything, but I\'m here if you ever want to talk."',
          why: 'Her return already required courage. Greeting her without pressure, leaving the door open without demanding she walk through it, gives her control over the next step.',
          color: '#2D5A8A',
        },
        {
          scenario: 'Your friend makes a comment about not wanting to be here anymore, then immediately says "just kidding."',
          not_say: '"Haha, yeah... anyway, what are we doing this weekend?"',
          say: '"Wait — I heard that. Even if it was a joke, I care about you. Are you actually okay?"',
          why: 'Suicidal ideation is sometimes expressed through humour precisely because it provides deniability. Taking it seriously — gently, without alarm — is the more protective response than taking the "just kidding" at face value.',
          color: '#8B2635',
        },
        {
          scenario: 'A classmate comes to you in tears before an exam. "I can\'t do this — I can\'t think, I can\'t breathe."',
          not_say: '"You\'ll be fine — you\'ve studied for this. Just breathe."',
          say: '"Okay. We have a few minutes. Let\'s breathe together — in through the nose, out through the mouth. You don\'t have to be ready immediately. Just be here right now."',
          why: '"You\'ll be fine" is future-focused during an acute present-moment crisis. Grounding in the immediate moment — physical breathing, not predictions — is what the nervous system needs.',
          color: '#2D6B45',
        },
      ].map((s, i) => (
        <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '18px 20px', marginBottom: '14px', border: `1.5px solid ${s.color}25`, fontFamily: font }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '15px', fontWeight: '700', color: 'var(--ink)', marginBottom: '12px', lineHeight: 1.5 }}>{s.scenario}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div style={{ background: '#FBF0F1', borderRadius: '9px', padding: '10px 12px', border: '1px solid rgba(139,38,53,0.15)' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#8B2635', marginBottom: '4px', textTransform: 'uppercase' }}>❌ DON'T SAY:</div>
              <p style={{ margin: 0, fontSize: '12px', color: '#8B2635', lineHeight: 1.55, fontStyle: 'italic' }}>{s.not_say}</p>
            </div>
            <div style={{ background: '#E8F4EE', borderRadius: '9px', padding: '10px 12px', border: '1px solid rgba(45,107,69,0.15)' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#2D6B45', marginBottom: '4px', textTransform: 'uppercase' }}>✅ TRY THIS:</div>
              <p style={{ margin: 0, fontSize: '12px', color: '#2D6B45', lineHeight: 1.55, fontStyle: 'italic' }}>{s.say}</p>
            </div>
          </div>
          <div style={{ background: CPALE, borderRadius: '8px', padding: '9px 12px', border: `1px solid ${CBORD}` }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: COPPER, marginBottom: '3px', textTransform: 'uppercase' }}>💡 WHY:</div>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{s.why}</p>
          </div>
        </div>
      ))}

      <h3 id="faq">7. Talk About Mental Health FAQs</h3>
      <div style={{ marginBottom: '40px' }}>
        <p><strong>Q: What if I say something wrong and make things worse?</strong><br />
        A: The fear of making things worse by saying the wrong thing is the most common reason people say nothing at all — and saying nothing is almost always worse than saying something imperfect from genuine care. Research on social support consistently shows that the quality that matters most is the genuineness of the care behind the words, not the perfection of the words themselves. "I don't know what to say but I want you to know I care" is entirely sufficient. What makes things worse is not imperfect support — it is dismissal, minimisation, or the complete absence of response. If you have said something clumsy, you can always return: "I don't think I said that well earlier — I'm sorry. What I wanted to say was that I care and I'm here."</p>

        <p><strong>Q: Someone I care about has told me something serious and I am now very worried about them. What do I do?</strong><br />
        A: The most important immediate action is to not handle it alone. If someone has disclosed suicidal thoughts, serious self-harm, or anything you believe represents immediate risk: stay with them if possible, contact a trusted adult (parent, teacher, counsellor), and call iCall (9152987821) or Vandrevala Foundation (1860-2662-345) if needed. You are not responsible for solving the problem — you are responsible for connecting the person to the support that is bigger than what you can provide alone. It is not betrayal to involve others when someone's safety is at risk; it is the appropriate response. The person may be angry initially — their safety matters more than their immediate reaction.</p>

        <p><strong>Q: How do I maintain a mental health conversation over time — not just once?</strong><br />
        A: Many mental health conversations are one-time disclosures that lead to nothing further — and many people who have opened up feel abandoned when the conversation seems to be forgotten the next time they meet. Research on supportive relationships shows that consistency of care matters more than the intensity of any single conversation. Following up — even briefly — "I've been thinking about what you shared. How has this week been?" — signals that the care continues rather than that the disclosure resolved everything. It does not need to be a lengthy check-in every time: a brief "I haven't forgotten — I'm still here" message has genuine wellbeing value for the person who opened up.</p>
      </div>

      <div style={{ textAlign: 'center', margin: '40px 0', fontFamily: font }}>
        <h2 style={{ fontFamily: 'Fraunces', color: COPPER, fontStyle: 'italic', marginBottom: '20px', lineHeight: '1.4', fontSize: '26px' }}>
          "The conversation you have been avoiding is probably the one that would help the most — for you, or for the person you have been meaning to reach out to."
        </h2>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/mindspace')} style={{ background: `linear-gradient(135deg, ${COPPER}, #D87858)`, color: 'white', border: 'none', padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: `0 8px 24px ${CBORD}` }}>
            Find Support in Mind Space →
          </button>
          <button onClick={() => navigate('/safe')} style={{ background: 'white', color: COPPER, border: `2px solid ${COPPER}`, padding: '16px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
            Visit Our Safe Corner
          </button>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', marginTop: '40px' }}>
        <p style={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', color: 'var(--muted)' }}>More from May's Mental Health Awareness Month:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {[
            ['/blog/mental-health-awareness-2026', '→ Why Mental Health Awareness Matters More Than Ever in 2026'],
            ['/blog/mental-health-myths-students', '→ 10 Common Mental Health Myths Students Should Stop Believing'],
            ['/blog/students-ignore-mental-health','→ Why Students Ignore Mental Health Issues (And the Hidden Impact)'],
            ['/blog/manage-emotions-mindfulness',  '→ How to Manage Emotions Using Mindfulness Techniques'],
            ['/safe',                              '→ Access 24/7 Professional Support in our Safe Corner'],
          ].map(([path, label]) => (
            <li key={path} style={{ marginBottom: '12px' }}>
              <button onClick={() => navigate(path)} style={{ background: 'none', border: 'none', color: COPPER, fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', padding: 0, textAlign: 'left', lineHeight: '1.4' }}>
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

    </BlogPostTemplate>
  );
}
