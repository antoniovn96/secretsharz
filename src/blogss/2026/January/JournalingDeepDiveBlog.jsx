import React from 'react';
import BlogPostTemplate from '../../../BlogPostTemplate'; 
import JournalingPromptGenerator from '../../../components/JournalingPromptGenerator';

// ✅ MOVED OUTSIDE THE FUNCTION so Blog.js can auto-detect it!
export const meta = {
  title: "30 Deep Journaling Prompts for Self-Love and Relationship Growth",
  slug: "journaling-deep-dive", // Matches your App.js route exactly
  excerpt: "Feeling stuck in your head? These 30 structured journaling prompts for self-love, emotional regulation, and setting boundaries will help you break toxic thought loops and build real self-awareness — no therapy degree required.",
  imgUrl: "/blogss/2026/General/Januarydeep-journaling-prompts-self-love-relationships.jpg",
  category: "Mental Health",
  readTime: "7 min read",
  wordCount: 1100,
  date: "30-01-2026",
  tldr: "Blank pages can be intimidating. This guide breaks down 30 highly structured journaling prompts across four psychological categories — self-awareness, emotional regulation, setting emotional boundaries with friends, and processing peer pressure — so you can start healing without feeling overwhelmed.",
  toc: [
    { id: "how-to-use", title: "How to Use These Prompts", level: 2 },
    { id: "self-awareness", title: "Prompts for Self-Awareness", level: 2 },
    { id: "emotional-regulation", title: "Prompts for Emotional Regulation", level: 2 },
    { id: "boundaries", title: "Prompts for Setting Emotional Boundaries", level: 2 },
    { id: "social-pressure", title: "Prompts for Processing Peer Pressure", level: 2 },
    { id: "interactive-tool", title: "Interactive Prompt Roulette", level: 2 }
  ]
};

export default function JournalingDeepDiveBlog({ navigate }) {
  return (
    <BlogPostTemplate meta={meta} navigate={navigate}>

      {/* ── INTRODUCTION ── */}
      <p>
        You open a blank notebook. You stare at it. You write "I don't know where to start" — and then close it.
      </p>

      <p>
        Sound familiar? You're not alone. For most students, <strong>how to start journaling for mental health</strong> is the hardest part. The blank page feels like a test you haven't studied for — especially when your brain is already overwhelmed with deadlines, social drama, and the quiet pressure of figuring out who you even are.
      </p>

      <p>
        Here's the truth: journaling isn't about writing beautifully. It's about <strong>structured self-reflection</strong> — giving your brain a specific question to chew on so it stops spinning in circles. When you're already dealing with{' '}
        <span
          onClick={() => navigate('/blog/exam-stress-management-guide')}
          style={{ color: 'var(--sage)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}
        >managing exam anxiety and student stress</span>,
        {' '}a single well-placed prompt can do more in five minutes than an hour of anxious overthinking.
      </p>

      <p>
        Whether you're looking for <strong>journaling prompts for self-love</strong>, trying to untangle complicated friendships, or just need a way to process the noise — this guide is for you. Thirty prompts. Four categories. Zero judgment.
      </p>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

      {/* ── HOW TO USE ── */}
      <h2 id="how-to-use">How to Use These Prompts (Without Feeling Overwhelmed)</h2>

      <p>Before you dive in, a few ground rules that will make this actually work for you:</p>

      <ul>
        <li>
          <strong>Pick ONE prompt per session.</strong> You don't need to answer all 30 in one sitting. Treat each prompt like a single conversation, not a homework assignment.
        </li>
        <li>
          <strong>Set a timer for 10 minutes.</strong> Write without stopping, editing, or re-reading. Let the words be messy. That's the point.
        </li>
        <li>
          <strong>Don't aim for insight — aim for honesty.</strong> The breakthrough usually comes after you've written the "obvious" stuff and kept going.
        </li>
        <li>
          <strong>Use a physical notebook if you can.</strong> Handwriting slows your brain down and helps you access deeper thoughts than typing does.
        </li>
        <li>
          <strong>If a prompt makes you uncomfortable, start there.</strong> Resistance is almost always a sign that something important is waiting underneath.
        </li>
      </ul>

      <p>
        Journaling works best when it's part of a wider routine. If you want to make this a daily habit that actually sticks, our guide on{' '}
        <span
          onClick={() => navigate('/blog/student-mental-health-routine')}
          style={{ color: 'var(--sage)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}
        >building a daily mental health routine</span>
        {' '}walks you through exactly how to structure your mornings and evenings around your wellbeing — not just your to-do list.
      </p>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

      {/* ── SELF-AWARENESS ── */}
      <h2 id="self-awareness">Prompts for Self-Awareness</h2>

      <p>
        Self-awareness is the foundation of all emotional intelligence. Without it, you're reacting to life on autopilot — shaped by old wounds, other people's opinions, and habits you never consciously chose.
      </p>

      <p>
        These <strong>journaling prompts for self-love and self-awareness</strong> are designed to gently interrupt that autopilot. They ask you to examine the core beliefs, hidden strengths, and subtle self-criticisms that quietly dictate how you show up every single day.
      </p>

      <ul>
        <li><strong>1.</strong> When I look in the mirror, what is the first thing my inner critic says? How can I rephrase it with kindness?</li>
        <li><strong>2.</strong> What is a core belief I hold about my own worth that is no longer serving me?</li>
        <li><strong>3.</strong> List three things that brought me genuine joy today, entirely independent of anyone else's approval.</li>
        <li><strong>4.</strong> If my body could speak to me right now, what exactly is it asking for?</li>
        <li><strong>5.</strong> What is a "flaw" I have that I would easily and lovingly forgive in a best friend?</li>
        <li><strong>6.</strong> In what situations do I feel most authentically myself, without any need to perform?</li>
        <li><strong>7.</strong> What compliment do I struggle to accept, and why do I believe I don't deserve it?</li>
        <li><strong>8.</strong> Write down five things I have survived that prove my undeniable resilience.</li>
      </ul>

      {/* ── EMOTIONAL REGULATION ── */}
      <h2 id="emotional-regulation">Prompts for Emotional Regulation</h2>

      <p>
        Emotional regulation isn't about suppressing your feelings — it's about processing them safely before they explode outward or collapse inward.
      </p>

      <p>
        <strong>Mental health journaling for emotional regulation</strong> gives your nervous system a container. Instead of letting anxiety loop endlessly in your head, you pour it onto the page where you can actually look at it, name it, and start to release it.
      </p>

      <p>
        If you've been feeling like you're running on empty — like no amount of sleep is fixing the exhaustion — it might be time to do more than journal. Our{' '}
        <span
          onClick={() => navigate('/blog/mental-health-reset')}
          style={{ color: 'var(--sage)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}
        >overcoming burnout and resetting your boundaries mid-month</span>
        {' '}guide is a practical companion to these prompts, especially when you're in a low period and need a structured way back.
      </p>

      <ul>
        <li><strong>9.</strong> What emotion am I trying hardest to avoid feeling today, and why am I running from it?</li>
        <li><strong>10.</strong> Describe a recent moment when I felt overwhelmed. What triggered it, and how did my body react?</li>
        <li><strong>11.</strong> If my current anxiety was a physical object, what would its texture, weight, and color be?</li>
        <li><strong>12.</strong> Write a letter of deep forgiveness to the version of myself who reacted poorly out of fear or anger.</li>
        <li><strong>13.</strong> What are three <strong>healthy coping mechanisms</strong> I can use the next time I feel a panic spiral starting?</li>
        <li><strong>14.</strong> Is the thing I am stressing over right now going to matter in five years? If not, how can I release it today?</li>
        <li><strong>15.</strong> Where do I physically hold tension in my body, and what can I do to physically release it right now?</li>
      </ul>

      {/* ── BOUNDARIES ── */}
      <h2 id="boundaries">Prompts for Setting Emotional Boundaries</h2>

      <p>
        You cannot pour from an empty cup. And yet, so many students spend their entire week giving — their time, their energy, their emotional bandwidth — to everyone except themselves.
      </p>

      <p>
        <strong>Setting emotional boundaries with friends</strong> is one of the most uncomfortable but transformative skills you can develop. It's also one of the most important parts of{' '}
        <span
          onClick={() => navigate('/blog/student-mental-health-routine')}
          style={{ color: 'var(--sage)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}
        >building a daily mental health routine</span>
        {' '}that actually holds up under pressure.
      </p>

      <p>
        These prompts help you identify where you're overextending, overcome the guilt of saying "no," and build the healthy parameters you need to protect your mental peace — without blowing up your relationships.
      </p>

      <ul>
        <li><strong>16.</strong> Where in my life am I saying "yes" when my body and mind are screaming "no"?</li>
        <li><strong>17.</strong> Who in my life consistently drains my energy, and what is one small boundary I can set with them this week?</li>
        <li><strong>18.</strong> Write down a reliable, polite script for declining an invitation without giving an excuse or over-apologizing.</li>
        <li><strong>19.</strong> How does my life actively improve when I stop taking responsibility for other people's emotional reactions?</li>
        <li><strong>20.</strong> What is a boundary I have successfully maintained recently, and how did it make me feel to stand my ground?</li>
        <li><strong>21.</strong> What am I afraid will happen if I assert my needs in my closest relationships?</li>
        <li><strong>22.</strong> Who in my circle respects my boundaries the most, and how can I invest more energy into that specific relationship?</li>
        <li><strong>23.</strong> What is one thing I am doing for someone else that they are fully capable of doing for themselves?</li>
      </ul>

      {/* ── PEER PRESSURE ── */}
      <h2 id="social-pressure">Prompts for Processing Peer Pressure</h2>

      <p>
        We are biologically wired to seek social acceptance. That's not a weakness — it's evolution. But in a world of curated Instagram feeds, group chats, and the constant pressure to have your "life plan" figured out by 20, that wiring can work against you.
      </p>

      <p>
        A huge source of peer pressure for students isn't just social — it's about careers. Everyone around you seems to know exactly what they want to do, and you're quietly panicking. If that resonates, take a breath and spend some time{' '}
        <span
          onClick={() => navigate('/career-explorer')}
          style={{ color: 'var(--sage)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '600' }}
        >exploring future career paths</span>
        {' '}on your own terms. Figuring out what genuinely excites you — separate from what your parents or peers expect — is one of the most powerful things you can do for your mental health right now.
      </p>

      <p>
        These prompts help you untangle your <em>authentic</em> desires from the noise of societal expectations. They reveal where you're masking your true personality just to fit in — and give you permission to stop.
      </p>

      <ul>
        <li><strong>24.</strong> When was the last time I changed my opinion, clothing, or behavior just to fit into a room?</li>
        <li><strong>25.</strong> Whose timeline am I comparing my life to right now? Why do I feel they are the gold standard?</li>
        <li><strong>26.</strong> If social media did not exist, how would my goals for this year change?</li>
        <li><strong>27.</strong> What is an unpopular opinion, hobby, or trait I have that I am actually deeply proud of?</li>
        <li><strong>28.</strong> List five ways I am fundamentally different from my peer group, and celebrate why that makes me valuable.</li>
        <li><strong>29.</strong> Who am I trying to impress right now, and what happens if I simply stop trying?</li>
        <li><strong>30.</strong> Write down a description of your perfect day, removing all expectations of what society says you "should" be doing.</li>
      </ul>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

      <p style={{ fontSize: '18px', fontWeight: '500', textAlign: 'center', lineHeight: '1.6' }}>
        <strong>Want to track your progress?</strong> Try our interactive{' '}
        <span
          onClick={() => navigate('/blog/february-growth-reflection')}
          style={{ color: 'var(--sage)', textDecoration: 'underline', cursor: 'pointer' }}
        >February Growth Reflection Tool</span>
        {' '}to turn your journal answers into actionable monthly scores.
      </p>

      {/* ── INTERACTIVE TOOL ── */}
      <h2 id="interactive-tool">Interactive Prompt Roulette</h2>
      <p>
        Not ready to tackle all 30 at once? That's completely okay. Use our mindful roulette below to get a single, randomised prompt based on what you need today. Sometimes the best place to start is wherever the universe points you.
      </p>

      <JournalingPromptGenerator />

    </BlogPostTemplate>
  );
}
