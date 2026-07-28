import React from 'react';

/**
 * Why Secret Sharz Exists Section
 * 
 * Explains the purpose and mission of Secret Sharz.
 * No props required - pure presentation component.
 */
export default function WhySecretSharz() {
  const principles = [
    {
      icon: '❤️',
      title: 'Human First',
      description: 'People are never reduced to problems. Every journey begins with understanding, respect, and dignity.'
    },
    {
      icon: '🌱',
      title: 'Growth for Life',
      description: 'We believe emotional wellbeing, learning, and career development are lifelong journeys, not one-time events.'
    },
    {
      icon: '🤝',
      title: 'Better Together',
      description: 'Students, families, educators, professionals, and communities create stronger futures when they work together.'
    }
  ];

  return (
    <section className="hp-why" aria-labelledby="hp-why-heading">
      <div className="hp-why-container">
        <header className="hp-why-header">
          <h2 id="hp-why-heading" className="hp-why-title">
            Why Secret Sharz Exists
          </h2>
        </header>

        <div className="hp-why-grid">
          {/* Left Column - Narrative */}
          <div className="hp-why-narrative">
            <p className="hp-why-intro">
              Every person deserves a safe place to be heard, the confidence to understand themselves, and the opportunity to build a meaningful future.
            </p>
            <p className="hp-why-intro">
              Yet too many people struggle to find support that is accessible, connected, and centred around the whole person.
            </p>
            <p className="hp-why-intro">
              Secret Sharz was created to change that.
            </p>

            <div className="hp-why-mission">
              <h3 className="hp-why-mission-title">Our Mission</h3>
              <p className="hp-why-mission-body">
                To create a world where emotional wellbeing, personal growth, and future readiness are accessible to everyone—through trusted support, meaningful guidance, and compassionate human connection.
              </p>
            </div>
          </div>

          {/* Right Column - Principles */}
          <div className="hp-why-principles">
            {principles.map((principle, index) => (
              <article
                key={index}
                className="hp-why-card"
                tabIndex={0}
              >
                <span className="hp-why-card-icon" role="img" aria-hidden="true">
                  {principle.icon}
                </span>
                <h3 className="hp-why-card-title">{principle.title}</h3>
                <p className="hp-why-card-desc">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Bottom Statement */}
        <footer className="hp-why-footer">
          <p className="hp-why-statement">
            Because every mind deserves to be understood, and every future deserves the chance to flourish.
          </p>
        </footer>
      </div>
    </section>
  );
}
