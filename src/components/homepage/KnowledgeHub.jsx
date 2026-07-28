import React from 'react';

/**
 * Knowledge Hub Section
 * 
 * Displays educational resources (placeholders) for ongoing learning.
 * No props required - pure presentation component.
 */
export default function KnowledgeHub() {
  const resources = [
    {
      icon: '📖',
      title: 'Articles',
      placeholder: '[Approved Resource Pending]'
    },
    {
      icon: '🎥',
      title: 'Videos',
      placeholder: '[Approved Resource Pending]'
    },
    {
      icon: '🎧',
      title: 'Podcasts',
      placeholder: '[Approved Resource Pending]'
    },
    {
      icon: '📝',
      title: 'Guides',
      placeholder: '[Approved Resource Pending]'
    },
    {
      icon: '🧩',
      title: 'Worksheets',
      placeholder: '[Approved Resource Pending]'
    },
    {
      icon: '💡',
      title: 'Insights',
      placeholder: '[Approved Resource Pending]'
    }
  ];

  return (
    <section className="hp-knowledge" aria-labelledby="hp-knowledge-heading">
      <div className="hp-knowledge-container">
        <header className="hp-knowledge-header">
          <span className="hp-knowledge-label">Keep Learning</span>
          <h2 id="hp-knowledge-heading" className="hp-knowledge-title">
            Knowledge That Grows With You
          </h2>
          <p className="hp-knowledge-intro">
            Learning doesn&apos;t stop after one conversation. Explore practical resources, insights, and evidence-informed guidance designed to support wellbeing, personal growth, education, and lifelong development.
          </p>
        </header>

        <div className="hp-knowledge-grid" role="list">
          {resources.map((resource, index) => (
            <article
              key={index}
              className="hp-knowledge-card"
              tabIndex={0}
            >
              <div className="hp-knowledge-icon-wrapper">
                <span className="hp-knowledge-icon" role="img" aria-hidden="true">
                  {resource.icon}
                </span>
              </div>
              <h3 className="hp-knowledge-card-title">{resource.title}</h3>
              <p className="hp-knowledge-card-placeholder">{resource.placeholder}</p>
              <span className="hp-knowledge-cta" aria-disabled="true">Coming Soon</span>
            </article>
          ))}
        </div>

        <footer className="hp-knowledge-footer">
          <p className="hp-knowledge-statement">
            Every new insight is another step towards a healthier, more confident future.
          </p>
        </footer>
      </div>
    </section>
  );
}
