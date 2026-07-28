import React from 'react';

/**
 * Journey Timeline Section
 * 
 * Visual representation of the user's journey with Secret Sharz.
 * No props required - pure presentation component.
 */
export default function JourneyTimeline() {
  const steps = [
    {
      icon: '💬',
      title: 'Reach Out',
      description: 'Share your story, ask a question, or simply take the first step.'
    },
    {
      icon: '🧭',
      title: 'Understand',
      description: 'Together we explore your needs, strengths, goals, and challenges.'
    },
    {
      icon: '❤️',
      title: 'Support',
      description: 'Receive personalised guidance, resources, or professional support designed for your journey.'
    },
    {
      icon: '🌱',
      title: 'Grow',
      description: 'Build confidence, develop resilience, and move towards meaningful progress.'
    },
    {
      icon: '✨',
      title: 'Thrive',
      description: 'Continue your journey knowing you have lifelong support whenever you need it.'
    }
  ];

  return (
    <section className="hp-journey" aria-labelledby="hp-journey-heading">
      <div className="hp-journey-container">
        <header className="hp-journey-header">
          <span className="hp-journey-label">Your Journey</span>
          <h2 id="hp-journey-heading" className="hp-journey-title">
            Every Great Journey Begins With One Conversation
          </h2>
          <p className="hp-journey-intro">
            Whether you&apos;re seeking emotional support, career direction, or guidance for someone you care about, we&apos;ll walk beside you every step of the way.
          </p>
        </header>

        <div className="hp-journey-steps" role="list">
          {steps.map((step, index) => (
            <div key={index} className="hp-journey-step-wrapper" role="listitem">
              <article className="hp-journey-step" tabIndex={0}>
                <div className="hp-journey-step-icon-wrapper">
                  <span className="hp-journey-step-icon" role="img" aria-hidden="true">
                    {step.icon}
                  </span>
                </div>
                <h3 className="hp-journey-step-title">{step.title}</h3>
                <p className="hp-journey-step-desc">{step.description}</p>
              </article>
              {index < steps.length - 1 && (
                <div className="hp-journey-connector" aria-hidden="true">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <footer className="hp-journey-footer">
          <p className="hp-journey-bottom">
            Your journey doesn&apos;t end with one conversation.
          </p>
          <p className="hp-journey-bottom hp-journey-bottom-emphasis">
            That&apos;s where it begins.
          </p>
        </footer>
      </div>
    </section>
  );
}
