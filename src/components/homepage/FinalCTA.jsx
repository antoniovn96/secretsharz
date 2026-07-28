import React from 'react';

/**
 * Final CTA Section
 * 
 * Encourages visitors to take their first step.
 * Accepts callback props for user interactions.
 */
export default function FinalCTA({
  onPrimaryClick,
  onSecondaryClick
}) {
  return (
    <section className="hp-cta" aria-labelledby="hp-cta-heading">
      <div className="hp-cta-container">
        <h2 id="hp-cta-heading" className="hp-cta-title">
          Your Journey Can Begin Today
        </h2>
        
        <p className="hp-cta-intro">
          Whether you&apos;re looking for support, guidance, understanding, or simply a safe place to begin, Secret Sharz is here to walk beside you.
        </p>
        
        <p className="hp-cta-subtitle">
          One conversation can become the beginning of something meaningful.
        </p>

        <div className="hp-cta-buttons">
          <button
            type="button"
            className="hp-cta-btn-primary"
            onClick={onPrimaryClick}
            aria-label="Start your journey"
          >
            Start Your Journey
          </button>

          <button
            type="button"
            className="hp-cta-btn-secondary"
            onClick={onSecondaryClick}
            aria-label="Explore our services"
          >
            Explore Our Services
          </button>
        </div>

        <p className="hp-cta-note">
          No pressure. No judgement. Whenever you&apos;re ready, we&apos;ll be here.
        </p>
      </div>
    </section>
  );
}
