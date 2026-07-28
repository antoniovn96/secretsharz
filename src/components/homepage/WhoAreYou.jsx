import React from 'react';

/**
 * Who Are You Section - Presentation Component
 * 
 * Helps visitors identify themselves and find their path.
 * Accepts callbacks only. Does not handle navigation.
 * 
 * Icon system: Uses a flexible approach that supports both emoji placeholders
 * and future SVG icon replacement without layout changes.
 */
export default function WhoAreYou({
  onStudentClick,
  onParentClick,
  onEducatorClick,
  onSchoolClick,
  onProfessionalClick
}) {
  const cards = [
    {
      id: 'student',
      category: 'STUDENT',
      icon: '🎓',
      title: "I'm a Student",
      description: 'Discover emotional wellbeing support, career guidance, learning resources, and opportunities to help you grow with confidence.',
      cta: 'Discover Student Support',
      onClick: onStudentClick
    },
    {
      id: 'parent',
      category: 'PARENT',
      icon: '👨‍👩‍👧',
      title: "I'm a Parent",
      description: 'Access trusted guidance, practical resources, and expert support to help your child thrive emotionally, socially, and academically.',
      cta: 'Discover Parent Support',
      onClick: onParentClick
    },
    {
      id: 'educator',
      category: 'EDUCATOR',
      icon: '👩‍🏫',
      title: "I'm an Educator",
      description: 'Build stronger classrooms with wellbeing resources, referral pathways, and professional collaboration.',
      cta: 'Discover Educator Support',
      onClick: onEducatorClick
    },
    {
      id: 'school',
      category: 'SCHOOL',
      icon: '🏫',
      title: "We're a School",
      description: 'Partner with Secret Sharz to strengthen student wellbeing, counselling, inclusion, and whole-school development.',
      cta: 'Discover School Solutions',
      onClick: onSchoolClick
    },
    {
      id: 'professional',
      category: 'PROFESSIONAL',
      icon: '🤝',
      title: "I'm a Professional",
      description: 'Collaborate with our growing network through referrals, partnerships, and shared expertise.',
      cta: 'Discover Professional Network',
      onClick: onProfessionalClick
    }
  ];

  return (
    <section className="hp-who" aria-labelledby="hp-who-heading">
      <div className="hp-who-content">
        <h2 id="hp-who-heading" className="hp-who-title">
          How Can We Support You Today?
        </h2>
        <p className="hp-who-subtitle">
          No matter where you are in your journey, Secret Sharz is designed to meet you where you are and help you move forward with confidence.
        </p>
      </div>

      <div className="hp-who-grid" role="list">
        {cards.map((card) => (
          <article
            key={card.id}
            className="hp-who-card"
            onClick={card.onClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.onClick?.();
              }
            }}
            role="listitem"
            tabIndex={0}
            aria-label={`${card.title} - ${card.description}`}
          >
            <span className="hp-who-icon" role="img" aria-hidden="true">
              {card.icon}
            </span>
            <span className="hp-who-category">{card.category}</span>
            <h3 className="hp-who-card-title">{card.title}</h3>
            <p className="hp-who-card-desc">{card.description}</p>
            <span className="hp-who-cta-wrapper">
              <button
                type="button"
                className="hp-who-cta"
                aria-label={`${card.cta}`}
              >
                {card.cta}
              </button>
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
