import React, { useState } from 'react';

const PROMPT_DATABASE = {
  "Self-Awareness": [
    "When I look in the mirror, what is the first thing my inner critic says? How can I rephrase it with kindness?",
    "What is a core belief I hold about myself that is no longer serving me?",
    "List three things that brought me genuine joy today, entirely independent of anyone else's approval.",
    "If my body could speak to me right now, what is it asking for?",
    "What is a 'flaw' I have that I would easily forgive in a best friend?"
  ],
  "Emotional Regulation": [
    "What emotion am I trying hardest to avoid feeling today, and why?",
    "Describe a recent moment when I felt overwhelmed. What triggered it, and how did my body react?",
    "If my current anxiety was a physical object, what would it look, feel, and weigh like?",
    "Write a letter of forgiveness to the version of myself who reacted poorly out of anger or fear.",
    "What are three healthy coping mechanisms I can use the next time I feel a panic or stress spiral starting?"
  ],
  "Boundaries": [
    "Where in my life am I saying 'yes' when my body and mind are screaming 'no'?",
    "Who in my life consistently drains my energy, and what is one small boundary I can set with them this week?",
    "Write down a script for declining an invitation without giving an excuse or over-apologizing.",
    "How does my life improve when I stop taking responsibility for other people's emotional reactions?",
    "What is a boundary I have successfully maintained recently, and how did it make me feel?"
  ],
  "Social Pressure": [
    "When was the last time I changed my opinion, clothing, or behavior just to fit into a room?",
    "Whose timeline am I comparing my life to right now? Why do I feel they are the gold standard?",
    "If social media did not exist, how would my goals for this year change?",
    "What is an unpopular opinion or trait I have that I am actually deeply proud of?",
    "List five ways I am fundamentally different from my peer group, and celebrate why that makes me valuable."
  ]
};

export default function JournalingPromptGenerator() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const generatePrompt = (category) => {
    const prompts = PROMPT_DATABASE[category];
    // Pick a random prompt different from the current one
    let newPrompt = currentPrompt;
    while (newPrompt === currentPrompt) {
      newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    }
    setActiveCategory(category);
    setCurrentPrompt(newPrompt);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Mindful Prompt Roulette</h3>
      <p style={styles.subtitle}>What are you struggling with today? Choose a category to get a targeted journaling prompt.</p>
      
      <div style={styles.buttonGrid}>
        {Object.keys(PROMPT_DATABASE).map(category => (
          <button 
            key={category} 
            style={{
              ...styles.categoryBtn,
              backgroundColor: activeCategory === category ? 'var(--sage)' : 'var(--sage-pale)',
              color: activeCategory === category ? 'white' : 'var(--sage)',
            }}
            onClick={() => generatePrompt(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {currentPrompt && (
        <div style={styles.promptCard}>
          <div style={styles.badge}>{activeCategory}</div>
          <p style={styles.promptText}>"{currentPrompt}"</p>
          <button style={styles.newPromptBtn} onClick={() => generatePrompt(activeCategory)}>
            🔄 Give me another one
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    margin: '40px 0', padding: '30px', backgroundColor: 'var(--sand)', 
    borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center'
  },
  title: {
    fontFamily: "'Fraunces', serif", fontSize: '24px', color: 'var(--ink)', marginBottom: '8px'
  },
  subtitle: {
    fontSize: '15px', color: 'var(--muted)', marginBottom: '24px'
  },
  buttonGrid: {
    display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '24px'
  },
  categoryBtn: {
    padding: '10px 20px', borderRadius: '50px', border: 'none', 
    fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit'
  },
  promptCard: {
    backgroundColor: 'var(--ink)', padding: '24px', borderRadius: '12px', 
    position: 'relative', marginTop: '20px', transition: 'all 0.3s'
  },
  badge: {
    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
    backgroundColor: 'var(--sage)', color: 'white', padding: '4px 12px', 
    borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'
  },
  promptText: {
    fontSize: '18px', color: 'var(--sand)', fontStyle: 'italic', margin: '20px 0', lineHeight: '1.6'
  },
  newPromptBtn: {
    backgroundColor: 'transparent', border: '1px solid var(--sand)', color: 'var(--sand)',
    padding: '8px 16px', borderRadius: '50px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit'
  }
};
