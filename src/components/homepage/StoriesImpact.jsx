import React from 'react';

/**
 * Stories & Impact Section
 * 
 * Builds credibility through real stories (placeholders) and impact metrics.
 * No props required - pure presentation component.
 */
export default function StoriesImpact() {
  const testimonials = [
    {
      title: 'Student Story',
      placeholder: '[Approved Story Pending]'
    },
    {
      title: 'Parent Story',
      placeholder: '[Approved Story Pending]'
    },
    {
      title: 'School Story',
      placeholder: '[Approved Story Pending]'
    }
  ];

  const metrics = [
    { label: 'Students Supported' },
    { label: 'Families Guided' },
    { label: 'Schools Partnered' },
    { label: 'Professional Collaborations' }
  ];

  const partners = Array(5).fill(null);

  return (
    <section className="hp-stories" aria-labelledby="hp-stories-heading">
      <div className="hp-stories-container">
        <header className="hp-stories-header">
          <span className="hp-stories-label">Real Stories. Real Impact.</span>
          <h2 id="hp-stories-heading" className="hp-stories-title">
            Every Journey Matters
          </h2>
          <p className="hp-stories-intro">
            Every conversation, every breakthrough, and every small step forward matters. We&apos;re privileged to support people, families, schools, and professionals as they build healthier, more confident futures together.
          </p>
        </header>

        {/* Testimonials */}
        <div className="hp-stories-testimonials" role="list">
          {testimonials.map((testimonial, index) => (
            <article
              key={index}
              className="hp-stories-card"
              tabIndex={0}
            >
              <div className="hp-stories-quote" aria-hidden="true">"</div>
              <h3 className="hp-stories-card-title">{testimonial.title}</h3>
              <p className="hp-stories-card-placeholder">{testimonial.placeholder}</p>
            </article>
          ))}
        </div>

        {/* Impact Metrics */}
        <div className="hp-stories-metrics">
          <h3 className="hp-stories-metrics-title">Growing Together</h3>
          <div className="hp-stories-metrics-grid" role="list">
            {metrics.map((metric, index) => (
              <div key={index} className="hp-stories-metric" role="listitem">
                <span className="hp-stories-metric-number" aria-label="Data pending approval">—</span>
                <span className="hp-stories-metric-label">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div className="hp-stories-partners">
          <h3 className="hp-stories-partners-title">Trusted By</h3>
          <div className="hp-stories-partners-grid" role="list">
            {partners.map((_, index) => (
              <div key={index} className="hp-stories-partner" role="listitem">
                <span className="hp-stories-partner-label">Partner Logo</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Message */}
        <footer className="hp-stories-footer">
          <p className="hp-stories-statement">
            Together, we&apos;re building a future where every person feels heard, supported, and empowered to thrive.
          </p>
        </footer>
      </div>
    </section>
  );
}
