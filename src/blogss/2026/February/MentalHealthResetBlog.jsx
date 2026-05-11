import React from 'react';
import BlogPostTemplate from '../../../BlogPostTemplate'; 
import MentalHealthGame from '../../../components/MentalHealthGame';

// ✅ MOVED OUTSIDE THE FUNCTION so Blog.js can auto-detect it!
export const meta = {
  title: "The Ultimate Mid-Month Mental Health Reset",
  slug: "mental-health-reset", // Matches your App.js route exactly
  excerpt: "Feeling overwhelmed by the middle of the month? It is time to hit the pause button and reset your boundaries, confidence, and self-kindness.",
  category: "Mental Health",
  readTime: "6 min read",
  wordCount: 800,
  date: "15-02-2026",
  tldr: "This comprehensive reset guide breaks down how to stop social media comparison, define self-respect versus ego, and confidently say 'no' to protect your peace.",
  toc: [
    { id: "kindness", title: "Mid-Month Reset: Treating Yourself with Kindness", level: 2 },
    { id: "comparison", title: "How to Stop Comparing Yourself to Others", level: 2 },
    { id: "ego", title: "Self-Respect vs Ego: Understanding the Difference", level: 2 },
    { id: "confidence", title: "Build Confidence Through Self-Acceptance", level: 2 },
    { id: "boundaries", title: "Why Saying ‘No’ is Important for Mental Health", level: 2 },
    { id: "relationships", title: "How Relationships Affect Your Mental Health", level: 2 },
    { id: "game", title: "Interactive Mental Health Game", level: 2 }
  ]
};

export default function MentalHealthResetBlog({ navigate }) {
  return (
    <BlogPostTemplate meta={meta} navigate={navigate}>
      
      <p>We all start the month with high hopes, but by the middle of the month, burnout, comparison, and exhaustion can easily creep in. If you are feeling overwhelmed, it is time to hit the pause button.</p>

      <h2 id="kindness">1. Mid-Month Reset: Are You Treating Yourself with Kindness?</h2>
      <img src="/blogss/2026/February/self-kindness-check.jpg" alt="Mid-Month Reset Check-In" style={{ width: '100%', borderRadius: '12px', margin: '20px 0' }} />
      <p>Before we look outward, we must look inward. Mid-month is the perfect time for reflection and engagement with your own mental state.</p>
      <ul>
        <li><strong>Self-Talk Awareness:</strong> Pay attention to the voice in your head. Are you criticizing yourself for not doing enough?</li>
        <li><strong>Behavior Check:</strong> Look at your physical habits. Are you sleeping enough? Are you skipping meals?</li>
        <li><strong>Reset Actions:</strong> Take 10 minutes today to write down three things you have accomplished this month.</li>
      </ul>

      <h2 id="comparison">2. How to Stop Comparing Yourself to Others on Social Media</h2>
      <img src="/blogss/2026/February/social-media-comparison.jpg" alt="Stop Social Media Comparison" style={{ width: '100%', borderRadius: '12px', margin: '20px 0' }} />
      <p>The phrase "social media comparison" is searched thousands of times a month. The mental health impact of constantly viewing everyone else's "highlight reel" can lead to severe anxiety.</p>
      <ul>
        <li><strong>The Mental Health Impact:</strong> Scrolling triggers a scarcity mindset—the false belief that you are failing.</li>
        <li><strong>Practical Detox Tips:</strong> Use the "mute" button liberally. If an account makes you feel bad, mute it for 30 days.</li>
        <li><strong>Self-Focus Strategies:</strong> Turn off notification badges and redirect that energy into a physical hobby.</li>
      </ul>

      <h2 id="ego">3. Self-Respect vs Ego: Understanding the Difference</h2>
      <img src="/blogss/2026/February/self-respect-vs-ego.jpg" alt="Self-Respect vs Ego" style={{ width: '100%', borderRadius: '12px', margin: '20px 0' }} />
      <p>When building boundaries, many people confuse having an ego with having self-respect. Understanding the difference is crucial.</p>
      <ul>
        <li><strong>Clear Definitions:</strong> Ego is driven by insecurity; self-respect is rooted in inner security.</li>
        <li><strong>Real-Life Examples:</strong> If someone criticizes you, Ego shouts and gets defensive. Self-respect calmly listens to valid points.</li>
        <li><strong>Healthy Balance:</strong> You can be confident while remaining humble and open to feedback.</li>
      </ul>

      <h2 id="confidence">4. How to Build Confidence Through Self-Acceptance</h2>
      <img src="/blogss/2026/February/self-acceptance-confidence.jpg" alt="Build Confidence Through Self-Acceptance" style={{ width: '100%', borderRadius: '12px', margin: '20px 0' }} />
      <p>True self-acceptance and confidence go hand-in-hand. You cannot hate yourself into a version of yourself that you love.</p>
      <ul>
        <li><strong>Accepting Flaws:</strong> Confidence is knowing you have flaws and deciding you are worthy of success anyway.</li>
        <li><strong>Positive Habits:</strong> Start a "competence journal" to write down hard things you have survived.</li>
        <li><strong>Emotional Growth:</strong> Forgive yourself for past mistakes.</li>
      </ul>

      <h2 id="boundaries">5. Why Saying ‘No’ is Important for Mental Health</h2>
      <img src="/blogss/2026/February/saying-no-mental-health.jpg" alt="Saying No and Mental Health" style={{ width: '100%', borderRadius: '12px', margin: '20px 0' }} />
      <p>"No" is a complete sentence. Setting a firm boundary is one of the highest forms of self-care.</p>
      <ul>
        <li><strong>Guilt Handling:</strong> It is normal to feel guilty when setting boundaries. Disappointing others is occasionally necessary to avoid disappointing yourself.</li>
        <li><strong>Real Scenarios:</strong> When asked to take on extra unpaid work, a polite but firm "I do not have the capacity" protects your peace.</li>
        <li><strong>Assertiveness Tips:</strong> You do not need to over-explain or apologize.</li>
      </ul>

      <h2 id="relationships">6. How Relationships Affect Your Mental Health</h2>
      <img src="/blogss/2026/February/relationships-mental-health.jpg" alt="Relationships and Mental Health" style={{ width: '100%', borderRadius: '12px', margin: '20px 0' }} />
      <p>Humans are highly social creatures. The emotional impact of your inner circle can either drain your battery or recharge it.</p>
      <ul>
        <li><strong>The Emotional Impact:</strong> Positive relationships lower cortisol. Toxic relationships keep your nervous system in "fight or flight."</li>
        <li><strong>Case Examples:</strong> A friend who only calls to complain is an energy drain.</li>
        <li><strong>Healthy Adjustments:</strong> Adjust the relationship—like limiting phone calls to once a week.</li>
      </ul>

      <h2 id="game">Test Your Boundaries: The Mindful Choices Game</h2>
      <p>Put what you just learned into practice. Play our interactive scenario game below to test your boundary-setting skills!</p>
      
      <MentalHealthGame />

    </BlogPostTemplate>
  );
}
