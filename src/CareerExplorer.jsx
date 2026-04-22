import React, { useState, useMemo } from 'react';
import { CAREER_DATA } from './data/careers';

const STYLES = `
  .ce-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: var(--cream);
    color: var(--dark);
  }

  .ce-hero {
    background: linear-gradient(135deg, var(--dark) 0%, var(--brown) 100%);
    padding: 80px 40px 60px;
    color: white;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .ce-hero::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(232, 101, 10, 0.15), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .ce-hero::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -5%;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(240, 165, 0, 0.12), transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .ce-hero-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
  }

  .ce-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(36px, 6vw, 56px);
    font-weight: 700;
    margin-bottom: 16px;
    letter-spacing: -1px;
    line-height: 1.1;
  }

  .ce-subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 40px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.6;
  }

  .ce-help-banner {
    background: linear-gradient(135deg, var(--saffron), var(--gold));
    border-radius: 20px;
    padding: 28px 36px;
    max-width: 800px;
    margin: 0 auto 40px;
    box-shadow: 0 12px 40px rgba(232, 101, 10, 0.3);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }

  .ce-help-text {
    flex: 1;
    min-width: 280px;
  }

  .ce-help-text h3 {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
    color: white;
  }

  .ce-help-text p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    line-height: 1.5;
  }

  .ce-help-btn {
    background: white;
    color: var(--saffron);
    border: none;
    padding: 14px 32px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .ce-help-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  }

  .ce-sticky-filters {
    position: sticky;
    top: 0;
    z-index: 100;
    background: white;
    border-bottom: 2px solid rgba(61, 34, 5, 0.08);
    padding: 20px 40px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }

  .ce-sticky-inner {
    max-width: 1400px;
    margin: 0 auto;
  }

  .ce-search-bar {
    max-width: 600px;
    margin: 0 auto 20px;
    position: relative;
  }

  .ce-search-input {
    width: 100%;
    padding: 16px 20px 16px 50px;
    border: 2px solid rgba(61, 34, 5, 0.15);
    border-radius: 50px;
    font-size: 15px;
    background: white;
    color: var(--dark);
    outline: none;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .ce-search-input::placeholder {
    color: var(--muted);
  }

  .ce-search-input:focus {
    border-color: var(--saffron);
    box-shadow: 0 0 0 3px rgba(232, 101, 10, 0.1);
  }

  .ce-search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: var(--muted);
  }

  .ce-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .ce-filter-pill {
    padding: 8px 18px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid rgba(61, 34, 5, 0.12);
    background: white;
    color: var(--brown);
    font-family: 'DM Sans', sans-serif;
  }

  .ce-filter-pill:hover {
    border-color: var(--saffron);
    color: var(--saffron);
    background: rgba(232, 101, 10, 0.05);
  }

  .ce-filter-pill.active {
    background: var(--saffron);
    border-color: var(--saffron);
    color: white;
  }

  .ce-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .ce-results-count {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 28px;
    font-weight: 600;
    text-align: center;
  }

  .ce-results-count strong {
    color: var(--saffron);
  }

  .ce-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 28px;
  }

  @media (max-width: 768px) {
    .ce-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 769px) and (max-width: 1200px) {
    .ce-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1201px) {
    .ce-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .ce-card {
    background: white;
    border-radius: 24px;
    border: 2px solid rgba(61, 34, 5, 0.08);
    padding: 28px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    position: relative;
    overflow: hidden;
  }

  .ce-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--saffron), var(--gold));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  .ce-card:hover::before {
    transform: scaleX(1);
  }

  .ce-card:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 40px rgba(232, 101, 10, 0.15);
    border-color: var(--saffron);
  }

  .ce-card-icon {
    font-size: 52px;
    margin-bottom: 18px;
    display: block;
  }

  .ce-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 10px;
    line-height: 1.2;
  }

  .ce-card-desc {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .ce-card-salary {
    font-size: 17px;
    font-weight: 700;
    color: var(--success);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    background: rgba(45, 125, 70, 0.08);
    border-radius: 12px;
    width: fit-content;
  }

  .ce-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ce-tag {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    background: var(--parchment);
    color: var(--brown);
    border: 1px solid rgba(61, 34, 5, 0.1);
    transition: all 0.2s;
  }

  .ce-card:hover .ce-tag {
    background: rgba(232, 101, 10, 0.1);
    border-color: var(--saffron);
    color: var(--saffron);
  }

  .ce-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .ce-modal {
    background: white;
    border-radius: 24px;
    max-width: 900px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .ce-modal-header {
    background: linear-gradient(135deg, var(--dark), var(--brown));
    padding: 40px;
    color: white;
    border-radius: 24px 24px 0 0;
    position: relative;
  }

  .ce-modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 24px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .ce-modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .ce-modal-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  .ce-modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .ce-modal-category {
    font-size: 14px;
    color: var(--gold);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .ce-modal-body {
    padding: 40px;
  }

  .ce-section {
    margin-bottom: 32px;
  }

  .ce-section-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ce-section-content {
    font-size: 15px;
    color: var(--brown);
    line-height: 1.7;
  }

  .ce-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .ce-list li {
    padding: 8px 0;
    padding-left: 24px;
    position: relative;
    font-size: 15px;
    color: var(--brown);
    line-height: 1.6;
  }

  .ce-list li::before {
    content: '•';
    position: absolute;
    left: 8px;
    color: var(--saffron);
    font-weight: 700;
  }

  .ce-info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }

  .ce-info-box {
    background: var(--parchment);
    padding: 16px;
    border-radius: 12px;
    border: 1px solid rgba(61, 34, 5, 0.1);
  }

  .ce-info-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .ce-info-value {
    font-size: 16px;
    font-weight: 700;
    color: var(--dark);
  }

  .ce-riasec-badges {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .ce-riasec-badge {
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
  }

  .ce-empty-state {
    text-align: center;
    padding: 100px 20px;
    background: white;
    border-radius: 24px;
    border: 2px dashed rgba(61, 34, 5, 0.15);
    max-width: 600px;
    margin: 0 auto;
  }

  .ce-empty-icon {
    font-size: 72px;
    margin-bottom: 20px;
  }

  .ce-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 12px;
  }

  .ce-empty-desc {
    font-size: 16px;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  .ce-empty-btn {
    background: linear-gradient(135deg, var(--saffron), var(--gold));
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(232, 101, 10, 0.25);
  }

  .ce-empty-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(232, 101, 10, 0.35);
  }

  @media (max-width: 768px) {
    .ce-hero {
      padding: 60px 20px 40px;
    }

    .ce-title {
      font-size: 32px;
    }

    .ce-subtitle {
      font-size: 16px;
    }

    .ce-help-banner {
      flex-direction: column;
      padding: 24px;
      text-align: center;
    }

    .ce-help-text {
      min-width: 100%;
    }

    .ce-help-btn {
      width: 100%;
    }

    .ce-sticky-filters {
      padding: 16px 20px;
    }

    .ce-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .ce-modal {
      max-height: 95vh;
    }

    .ce-modal-header {
      padding: 30px 20px;
    }

    .ce-modal-body {
      padding: 24px 20px;
    }

    .ce-info-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const RIASEC_COLORS = {
  R: { bg: '#FFF3E0', color: '#E65100', label: 'Realistic' },
  I: { bg: '#E3F2FD', color: '#1565C0', label: 'Investigative' },
  A: { bg: '#F3E5F5', color: '#6A1B9A', label: 'Artistic' },
  S: { bg: '#E8F5E9', color: '#2E7D32', label: 'Social' },
  E: { bg: '#FFF8E1', color: '#F57F17', label: 'Enterprising' },
  C: { bg: '#E0F2F1', color: '#00695C', label: 'Conventional' },
};

export default function CareerExplorer({ navigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedCareer, setSelectedCareer] = useState(null);

  // Extract all unique tags and categories
  const allTags = useMemo(() => {
    const tags = new Set();
    CAREER_DATA.forEach(career => {
      career.studentTags?.forEach(tag => tags.add(tag));
    });
    return ['All', ...Array.from(tags).sort()];
  }, []);

  const allCategories = useMemo(() => {
    const categories = new Set();
    CAREER_DATA.forEach(career => categories.add(career.category));
    return Array.from(categories).sort();
  }, []);

  // Combine tags and categories for filters
  const filters = useMemo(() => {
    return ['All', ...allTags.slice(1), ...allCategories];
  }, [allTags, allCategories]);

  // Filter careers based on search and active filter
  const filteredCareers = useMemo(() => {
    return CAREER_DATA.filter(career => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Tag/Category filter
      const matchesFilter = activeFilter === 'All' ||
        career.studentTags?.includes(activeFilter) ||
        career.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Technology & Data': '💻',
      'Arts & Design': '🎨',
      'Healthcare & Psychology': '🏥',
      'Business & Finance': '💼',
      'Aviation & Transport': '✈️',
      'Media & Entertainment': '📺',
      'Engineering & Infrastructure': '🏗️',
      'Business & Marketing': '📊'
    };
    return iconMap[category] || '🎯';
  };

  return (
    <div className="ce-root">
      {/* Hero Section */}
      <div className="ce-hero">
        <div className="ce-hero-content">
          <h1 className="ce-title">Explore 100+ Future-Proof Careers</h1>
          <p className="ce-subtitle">
            Discover what you'll do, what you'll earn, and how to get there. Browse careers by category, salary, or personality match.
          </p>

          {/* Help Me Choose Banner */}
          <div className="ce-help-banner">
            <div className="ce-help-text">
              <h3>🤔 Not sure where to start?</h3>
              <p>Let our AI match you to your perfect career based on your personality and interests.</p>
            </div>
            <button className="ce-help-btn" onClick={() => navigate('/vidyavantage')}>
              Take Assessment →
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Search & Filters */}
      <div className="ce-sticky-filters">
        <div className="ce-sticky-inner">
          <div className="ce-search-bar">
            <span className="ce-search-icon">🔍</span>
            <input
              type="text"
              className="ce-search-input"
              placeholder="Search by career name, category, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="ce-filters">
            {filters.map(filter => (
              <button
                key={filter}
                className={`ce-filter-pill ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="ce-content">
        <div className="ce-results-count">
          Showing <strong>{filteredCareers.length}</strong> of {CAREER_DATA.length} career paths
        </div>

        {filteredCareers.length === 0 ? (
          <div className="ce-empty-state">
            <div className="ce-empty-icon">🔍</div>
            <div className="ce-empty-title">We couldn't find a career matching that</div>
            <div className="ce-empty-desc">
              Try adjusting your search or filters. Or, let our AI suggest careers based on your unique profile.
            </div>
            <button className="ce-empty-btn" onClick={() => navigate('/vidyavantage')}>
              Ask Our AI for Suggestions →
            </button>
          </div>
        ) : (
          <div className="ce-grid">
            {filteredCareers.map(career => (
              <div
                key={career.id}
                className="ce-card"
                onClick={() => setSelectedCareer(career)}
              >
                <span className="ce-card-icon">{getCategoryIcon(career.category)}</span>
                <h3 className="ce-card-title">{career.title}</h3>
                <p className="ce-card-desc">{career.shortDesc}</p>
                <div className="ce-card-salary">
                  💰 {career.salaryRange}
                </div>
                <div className="ce-card-tags">
                  {career.studentTags?.slice(0, 3).map(tag => (
                    <span key={tag} className="ce-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCareer && (
        <div className="ce-modal-overlay" onClick={() => setSelectedCareer(null)}>
          <div className="ce-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ce-modal-header">
              <button className="ce-modal-close" onClick={() => setSelectedCareer(null)}>
                ×
              </button>
              <div className="ce-modal-icon">
                {selectedCareer.category === 'Technology & Data' ? '💻' : 
                  selectedCareer.category === 'Arts & Design' ? '🎨' :
                  selectedCareer.category === 'Healthcare & Psychology' ? '🏥' :
                  selectedCareer.category === 'Business & Finance' ? '💼' :
                  selectedCareer.category === 'Aviation & Transport' ? '✈️' :
                  selectedCareer.category === 'Media & Entertainment' ? '📺' :
                  selectedCareer.category === 'Engineering & Infrastructure' ? '🏗️' :
                  selectedCareer.category === 'Business & Marketing' ? '📊' : '🎯'}
              </div>
              <h2 className="ce-modal-title">{selectedCareer.title}</h2>
              <div className="ce-modal-category">{selectedCareer.category}</div>
            </div>

            <div className="ce-modal-body">
              <div className="ce-section">
                <h3 className="ce-section-title">📋 Overview</h3>
                <div className="ce-section-content">{selectedCareer.longDesc}</div>
              </div>

              <div className="ce-info-grid">
                <div className="ce-info-box">
                  <div className="ce-info-label">💰 Salary Range</div>
                  <div className="ce-info-value">{selectedCareer.salaryRange}</div>
                </div>
                <div className="ce-info-box">
                  <div className="ce-info-label">📈 Future Outlook</div>
                  <div className="ce-info-value">{selectedCareer.futureOutlook}</div>
                </div>
                <div className="ce-info-box">
                  <div className="ce-info-label">🎓 Education</div>
                  <div className="ce-info-value" style={{ fontSize: '13px' }}>{selectedCareer.education}</div>
                </div>
              </div>

              <div className="ce-section">
                <h3 className="ce-section-title">🧠 RIASEC Profile</h3>
                <div className="ce-riasec-badges">
                  {selectedCareer.riasec?.split('').map(letter => (
                    <span
                      key={letter}
                      className="ce-riasec-badge"
                      style={{
                        background: RIASEC_COLORS[letter]?.bg,
                        color: RIASEC_COLORS[letter]?.color
                      }}
                    >
                      {letter} - {RIASEC_COLORS[letter]?.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ce-section">
                <h3 className="ce-section-title">☀️ A Day in the Life</h3>
                <ul className="ce-list">
                  {selectedCareer.dayInTheLife?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="ce-section">
                <h3 className="ce-section-title">⚡ Key Skills Required</h3>
                <div className="ce-card-tags">
                  {selectedCareer.skills?.map(skill => (
                    <span key={skill} className="ce-tag" style={{ fontSize: '13px', padding: '6px 14px' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ce-section">
                <h3 className="ce-section-title">🏷️ Career Tags</h3>
                <div className="ce-card-tags">
                  {selectedCareer.studentTags?.map(tag => (
                    <span key={tag} className="ce-tag" style={{ fontSize: '13px', padding: '6px 14px' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
