import React, { useState } from 'react';

const GAME_QUESTIONS = [
  {
    id: 1,
    topic: "Social Media Comparison",
    scenario: "You log onto Instagram and see a former classmate bought a new house. You instantly feel behind in life. What is your next move?",
    options: [
      { text: "Keep scrolling to see what else they have achieved.", isCorrect: false, feedback: "Scrolling deeper fuels the comparison trap and drains your mental energy." },
      { text: "Mute their stories for 30 days and list 3 things you are proud of in your own life.", isCorrect: true, feedback: "Perfect! Muting protects your peace while gratitude redirects your focus to your own journey." }
    ]
  },
  {
    id: 2,
    topic: "Self-Respect vs Ego",
    scenario: "A colleague gives you constructive criticism on a project you worked hard on.",
    options: [
      { text: "Listen calmly, take the valid points, but politely defend the design choices you know work well.", isCorrect: true, feedback: "Great balance! Self-respect means taking feedback without feeling attacked, while holding your ground." },
      { text: "Get defensive, tell them they don't understand the vision, and dismiss the feedback.", isCorrect: false, feedback: "That is your ego talking! Ego demands to be right; self-respect focuses on growth." }
    ]
  },
  {
    id: 3,
    topic: "Saying 'No'",
    scenario: "You are exhausted and already in pajamas on a Friday night. A friend texts asking you to come out to a crowded party.",
    options: [
      { text: "Go anyway because you feel guilty and don't want them to be mad at you.", isCorrect: false, feedback: "Ignoring your own exhaustion to please others leads straight to burnout." },
      { text: "Text back: 'I'm wiped out tonight and need to rest, but let's grab coffee next week!'", isCorrect: true, feedback: "Excellent boundary! You honored your body's need for rest without over-apologizing." }
    ]
  }
];

export default function MentalHealthGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setShowFeedback(true);
    if (option.isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentQuestion + 1 < GAME_QUESTIONS.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameComplete(true);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameComplete(false);
    setShowFeedback(false);
    setSelectedAnswer(null);
  };

  if (gameComplete) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Your Reset is Complete!</h2>
        <div style={styles.card}>
          <h3 style={styles.scoreText}>You scored {score} out of {GAME_QUESTIONS.length}</h3>
          <p style={styles.bodyText}>
            {score === GAME_QUESTIONS.length 
              ? "Amazing! You have highly tuned self-awareness and excellent boundaries. Keep protecting your peace." 
              : "Good effort! Building mental health boundaries takes practice. Use the tips from the blog to keep improving!"}
          </p>
          <button style={styles.button} onClick={restartGame}>Play Again</button>
        </div>
      </div>
    );
  }

  const q = GAME_QUESTIONS[currentQuestion];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>Scenario {currentQuestion + 1} of {GAME_QUESTIONS.length}: {q.topic}</div>
        
        <p style={styles.scenarioText}>{q.scenario}</p>

        {!showFeedback ? (
          <div style={styles.optionsContainer}>
            {q.options.map((opt, idx) => (
              <button 
                key={idx} 
                style={styles.optionButton} 
                onClick={() => handleAnswer(opt)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        ) : (
          <div style={{...styles.feedbackBox, borderLeftColor: selectedAnswer.isCorrect ? 'var(--success)' : 'var(--danger)'}}>
            <h4 style={{ color: selectedAnswer.isCorrect ? 'var(--success)' : 'var(--danger)', marginBottom: '10px', fontSize: '18px' }}>
              {selectedAnswer.isCorrect ? "✅ Healthy Choice!" : "❌ Boundary Alert!"}
            </h4>
            <p style={styles.bodyText}>{selectedAnswer.feedback}</p>
            <button style={styles.button} onClick={handleNext}>
              {currentQuestion + 1 < GAME_QUESTIONS.length ? "Next Scenario →" : "See My Results →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { margin: '40px 0', fontFamily: 'inherit' },
  title: { textAlign: 'center', color: 'var(--ink)', fontFamily: "'Fraunces', serif", fontSize: '28px', marginBottom: '20px' },
  card: { backgroundColor: 'var(--sand)', padding: '30px', borderRadius: '16px', border: '1px solid var(--border)', position: 'relative' },
  badge: { display: 'inline-block', backgroundColor: 'var(--sage)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '20px' },
  scenarioText: { fontSize: '18px', color: 'var(--ink)', marginBottom: '24px', lineHeight: '1.6', fontWeight: '600' },
  optionsContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionButton: { padding: '16px 20px', backgroundColor: 'white', border: '2px solid var(--border)', borderRadius: '12px', color: 'var(--ink-soft)', fontSize: '15px', fontWeight: '500', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', fontFamily: 'inherit' },
  feedbackBox: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', borderLeft: '4px solid var(--sage)', boxShadow: 'var(--shadow-sm)' },
  bodyText: { fontSize: '15px', color: 'var(--ink-soft)', lineHeight: '1.6', marginBottom: '20px' },
  scoreText: { fontSize: '24px', color: 'var(--sage)', fontFamily: "'Fraunces', serif", marginBottom: '12px' },
  button: { width: '100%', padding: '14px', backgroundColor: 'var(--sage)', color: 'white', border: 'none', borderRadius: '50px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s', fontFamily: 'inherit' }
};
