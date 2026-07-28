import React from 'react';

/**
 * Solutions Section
 * 
 * Displays the support services available through Secret Sharz.
 * Accepts callback props for user interactions.
 */
export default function Solutions({
  onCounsellingClick,
  onCareerClick,
  onSpecialEducationClick,
  onSchoolPartnershipClick,
  onProfessionalNetworkClick
}) {
  const solutions = [
    {
      icon: '💙',
      title: 'Counselling & Emotional Wellbeing',
      description: 'Professional counselling, mental health support, and emotional wellbeing services for children, young people, adults, and families.',
      cta: 'Explore Wellbeing',
      onClick: onCounsellingClick
    },
    {
      icon: '🧭',
      title: 'Career Guidance',
      description: 'Discover strengths, explore pathways, and make confident decisions about education and careers.',
      cta: 'Explore Careers',
      onClick: onCareerClick
    },
    {
      icon: '🌱',
      title: 'Special Education & Learning Support',
      description: 'Inclusive support for diverse learners through assessments, interventions, and collaborative planning.',
      cta: 'Explore Learning Support',
      onClick: onSpecialEducationClick
    },
    {
      icon: '🏫',
      title: 'School Partnerships',
      description: 'Whole-school wellbeing, training, consultation, student support, and educational programmes.',
      cta: 'Explore Partnerships',
      onClick: onSchoolPartnershipClick
    },
    {
      icon: '🤝',
      title: 'Professional Network',
      description: 'Collaborate with counsellors, psychologists, educators, and specialists building stronger communities together.',
      cta: 'Join the Network',
      onClick: onProfessionalNetworkClick
    }
  ];

  return (
    <section className="hp-solutions" aria-labelledby="hp-solutions-heading">
      <div className="hp-solutions-container">
        <header className="hp-solutions-header">
          <span className="hp-solutions-label">How We Can Help</span>
          <h2 id="hp-solutions-heading" className="hp-solutions-title">
            Support Designed Around Real Lives
          </h2>
          <p className="hp-solutions-intro">
            Whether you&apos;re looking for emotional support, career guidance, learning assistance, or partnership opportunities, Secret Sharz brings trusted people, evidence-informed approaches, and meaningful resources together in one connected ecosystem.
          </p>
        </header>

        <div className="hp-solutions-grid" role="list">
          {solutions.map((solution, index) => (
            <article
              key={index}
              className="hp-solutions-card"
              onClick={solution.onClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  solution.onClick?.();
                }
              }}
              role="listitem"
              tabIndex={0}
            >
              <div className="hp-solutions-icon-wrapper">
                <span className="hp-solutions-icon" role="img" aria-hidden="true">
                  {solution.icon}
                </span>
              </div>
              <h3 className="hp-solutions-card-title">{solution.title}</h3>
              <p className="hp-solutions-card-desc">{solution.description}</p>
              <button
                type="button"
                className="hp-solutions-cta"
                aria-label={`${solution.cta}`}
              >
                {solution.cta}
                <span className="hp-solutions-cta-arrow">→</span>
              </button>
            </article>
          ))}
        </div>

        <footer className="hp-solutions-footer">
          <p className="hp-solutions-statement">
            Whatever brings you here, we&apos;re ready to help you take the next step.
          </p>
        </footer>
      </div>
    </section>
  );
}
