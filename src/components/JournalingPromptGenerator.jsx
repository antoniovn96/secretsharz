import React, { useState } from 'react';

const PROMPT_DATABASE = {
  "Self-Awareness": [
    "1. When I look in the mirror, what is the first thing my inner critic says? How can I rephrase it with kindness?",
    "2. What is a core belief I hold about myself that is no longer serving me?",
    "3. List three things that brought me genuine joy today, entirely independent of anyone else's approval.",
    "4. If my body could speak to me right now, what is it asking for?",
    "5. What is a 'flaw' I have that I would easily forgive in a best friend?",
    "6. In what situations do I feel most authentically myself, without any need to perform?",
    "7. What compliment do I struggle to accept, and why do I believe I don't deserve it?",
    "8. Write down five things I have survived that prove my undeniable resilience."
  ],
  "Emotional Regulation": [
    "9. What emotion am I trying hardest to avoid feeling today, and why?",
    "10. Describe a recent moment when I felt overwhelmed. What triggered it, and how did my body react?",
    "11. If my current anxiety was a physical object, what would it look, feel, and weigh like?",
    "12. Write a letter of forgiveness to the version of myself who reacted poorly out of anger or fear.",
    "13. What are three healthy coping mechanisms I can use the next time I feel a panic or stress spiral starting?",
    "14. Is the thing I am stressing over right now going to matter in five years? If not, how can I release it today?",
    "15. Where do I physically hold tension in my body, and what can I do to physically release it right now?"
  ],
  "Boundaries": [
    "16. Where in my life am I saying 'yes' when my body and mind are screaming 'no'?",
    "17. Who in my life consistently drains my energy, and what is one small boundary I can set with them this week?",
    "18. Write down a script for declining an invitation without giving an excuse or over-apologizing.",
    "19. How does my life improve when I stop taking responsibility for other people's emotional reactions?",
    "20. What is a boundary I have successfully maintained recently, and how did it make me feel?",
    "21. What am I afraid will happen if I assert my needs in my closest relationships?",
    "22. Who in my circle respects my boundaries the most, and how can I invest more energy into them?",
    "23. What is one thing I am doing for someone else that they are fully capable of doing for themselves?"
  ],
  "Social Pressure": [
    "24. When was the last time I changed my opinion, clothing, or behavior just to fit into a room?",
    "25. Whose timeline am I comparing my life to right now? Why do I feel they are the gold standard?",
    "26. If social media did not exist, how would my goals for this year change?",
    "27. What is an unpopular opinion or trait I have that I am actually deeply proud of?",
    "28. List five ways I am fundamentally different from my peer group, and celebrate why that makes me valuable.",
    "29. Who am I trying to impress right now, and what happens if I simply stop trying?",
    "30. Write down a description of your perfect day, removing all expectations of what society says you 'should' be doing."
  ]
};

export default function JournalingPromptGenerator() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState("");

  const generatePrompt = (category) => {
    const prompts = PROMPT_DATABASE[category];
    let newPrompt = currentPrompt;
    while (newPrompt === currentPrompt) {
      newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    }
    setActiveCategory(category);
    setCurrentPrompt(newPrompt);
  };

  return (
    <div style={{ margin: '40px 0', padding: '30px', backgroundColor: 'var(--sand)', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', color: 'var(--ink)', marginBottom: '8px' }}>Mindful Prompt Roulette</h3>
      <p style={{ fontSize: '15px', color: 'var(--muted)', marginBottom: '24px' }}>What are you struggling with today? Choose a category to get a targeted journaling prompt.</p>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
        {Object.keys(PROMPT_DATABASE).map(category => (
          <button 
            key={category} 
            style={{
              padding: '10px 20px', borderRadius: '50px', border: 'none', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
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
        <div style={{ backgroundColor: 'var(--ink)', padding: '24px', borderRadius: '12px', position: 'relative', marginTop: '20px', transition: 'all 0.3s' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'var(--sage)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {activeCategory}
          </div>
          <p style={{ fontSize: '18px', color: 'var(--sand)', fontStyle: 'italic', margin: '20px 0', lineHeight: '1.6' }}>"{currentPrompt}"</p>
          <button 
            style={{ backgroundColor: 'transparent', border: '1px solid var(--sand)', color: 'var(--sand)', padding: '8px 16px', borderRadius: '50px', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }} 
            onClick={() => generatePrompt(activeCategory)}
          >
            🔄 Give me another one
          </button>
        </div>
      )}
    </div>
  );
}
