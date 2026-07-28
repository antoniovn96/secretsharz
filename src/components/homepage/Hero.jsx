import React from 'react';

/**
 * Hero Section - Presentation Component
 * 
 * Accepts callbacks only. Does not handle navigation logic.
 */
export default function Hero({ onPrimaryClick, onSecondaryClick }) {
  return (
    <section className="hp-hero" aria-labelledby="hp-hero-heading">
      {/* Background */}
      <div className="hp-hero-bg" aria-hidden="true">
        <div className="hp-blob hp-blob-1" />
        <div className="hp-blob hp-blob-2" />
        <div className="hp-blob hp-blob-3" />
      </div>

      {/* Content */}
      <div className="hp-content">
        <div className="hp-eyebrow">
          <span className="hp-eyebrow-dot" aria-hidden="true" />
          India&apos;s Emotional Wellbeing &amp; Human Development Platform
        </div>

        <h1 id="hp-hero-heading" className="hp-title">
          Every Mind Matters.{' '}
          <span className="hp-highlight">Every Future Begins Here.</span>
        </h1>

        <p className="hp-value-prop">
          Helping students, parents, educators, and institutions build emotionally stronger and future-ready lives.
        </p>

        <p className="hp-subtitle">
          Life is not just about choosing the right career. It is also about understanding yourself, building emotional resilience, and having the confidence to move forward.
        </p>

        <p className="hp-subtitle">
          Secret Sharz provides a safe space where students, parents, educators, and professionals can access counselling, career guidance, special education support, and personal development resources—all in one trusted platform.
        </p>

        <div className="hp-actions">
          <button
            type="button"
            className="hp-btn-primary"
            onClick={onPrimaryClick}
            aria-label="Start your journey"
          >
            Start Your Journey
          </button>

          <button
            type="button"
            className="hp-btn-secondary"
            onClick={onSecondaryClick}
            aria-label="Discover how we can help"
          >
            Discover How We Can Help
          </button>
        </div>

        <div className="hp-trust" role="list" aria-label="Trust indicators">
          <div className="hp-trust-item" role="listitem">
            <span aria-hidden="true">✓</span>
            <span>Confidential &amp; Secure</span>
          </div>
          <div className="hp-trust-item" role="listitem">
            <span aria-hidden="true">✓</span>
            <span>Qualified Professionals</span>
          </div>
          <div className="hp-trust-item" role="listitem">
            <span aria-hidden="true">✓</span>
            <span>Student-Centred</span>
          </div>
          <div className="hp-trust-item" role="listitem">
            <span aria-hidden="true">✓</span>
            <span>Evidence-Informed</span>
          </div>
        </div>
      </div>

      {/* Hero Illustration Placeholder */}
      <div className="hp-hero-right" aria-hidden="true">
        <article className="hp-float-card hp-hero-illustration">
          <div className="hp-journey-step">
            <span className="hp-journey-icon">🔍</span>
            <span className="hp-journey-label">Understand Yourself</span>
          </div>
          <div className="hp-journey-arrow">↓</div>
          <div className="hp-journey-step">
            <span className="hp-journey-icon">💪</span>
            <span className="hp-journey-label">Build Emotional Strength</span>
          </div>
          <div className="hp-journey-arrow">↓</div>
          <div className="hp-journey-step">
            <span className="hp-journey-icon">🧭</span>
            <span className="hp-journey-label">Discover Your Direction</span>
          </div>
          <div className="hp-journey-arrow">↓</div>
          <div className="hp-journey-step">
            <span className="hp-journey-icon">🚀</span>
            <span className="hp-journey-label">Create Your Future</span>
          </div>
        </article>
      </div>
    </section>
  );
}
