import React from 'react';

/**
 * Outcomes Section
 * 
 * Displays the positive outcomes visitors can expect from Secret Sharz.
 * No props required - pure presentation component.
 */
export default function Outcomes() {
  const outcomes = [
    {
      icon: '🧠',
      title: 'Greater Self-Awareness',
      description: 'Understand your emotions, strengths, values, and potential with greater clarity.'
    },
    {
      icon: '💙',
      title: 'Improved Wellbeing',
      description: 'Develop healthier habits, emotional resilience, and practical strategies for everyday life.'
    },
    {
      icon: '🎯',
      title: 'Clearer Direction',
      description: 'Make informed decisions about education, careers, and personal growth.'
    },
    {
      icon: '🤝',
      title: 'Stronger Relationships',
      description: 'Build healthier communication, deeper trust, and meaningful connections.'
    },
    {
      icon: '🌱',
      title: 'Lifelong Growth',
      description: 'Keep learning, adapting, and developing through every stage of life.'
    },
    {
      icon: '✨',
      title: 'Confidence for the Future',
      description: 'Move forward knowing you have trusted support whenever you need it.'
    }
  ];

  return (
    <section className="hp-outcomes" aria-labelledby="hp-outcomes-heading">
      <div className="hp-outcomes-container">
        <header className="hp-outcomes-header">
          <span className="hp-outcomes-label">The Difference We Help Create</span>
          <h2 id="hp-outcomes-heading" className="hp-outcomes-title">
            Small Steps. Meaningful Change.
          </h2>
          <p className="hp-outcomes-intro">
            Every journey looks different. But with the right support, people become more confident, more resilient, better connected, and better prepared for whatever comes next.
          </p>
        </header>

        <div className="hp-outcomes-grid" role="list">
          {outcomes.map((outcome, index) => (
            <article
              key={index}
              className="hp-outcomes-card"
              tabIndex={0}
            >
              <div className="hp-outcomes-icon-wrapper">
                <span className="hp-outcomes-icon" role="img" aria-hidden="true">
                  {outcome.icon}
                </span>
              </div>
              <h3 className="hp-outcomes-card-title">{outcome.title}</h3>
              <p className="hp-outcomes-card-desc">{outcome.description}</p>
            </article>
          ))}
        </div>

        <footer className="hp-outcomes-footer">
          <p className="hp-outcomes-statement">
            Real change begins with small steps, supported by people who genuinely care.
          </p>
        </footer>
      </div>
    </section>
  );
}
