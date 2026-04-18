import React, { useState, useMemo } from 'react';
import { CAREER_DATA } from './data/careers';

const STYLES = `
  .ce-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: var(--cream);
    color: var(--dark);
  }

  .ce-header {
    background: linear-gradient(135deg, var(--dark) 0%, var(--brown) 100%);
    padding: 60px 40px 40px;
    color: white;
    text-align: center;
  }

  .ce-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 700;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
  }

  .ce-subtitle {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 32px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .ce-search-bar {
    max-width: 600px;
    margin: 0 auto 24px;
    position: relative;
  }

  .ce-search-input {
    width: 100%;
    padding: 16px 20px 16px 50px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    font-size: 15px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    outline: none;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }

  .ce-search-input::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  .ce-search-input:focus {
    background: rgba(255, 255, 255, 0.15);
    border-color: var(--gold);
  }

  .ce-search-icon {
    position: absolute;
    left: 18px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    color: rgba(255, 255, 255, 0.5);
  }

  .ce-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
    max-width: 900px;
    margin: 0 auto;
  }

  .ce-filter-pill {
    padding: 8px 18px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    font-family: 'DM Sans', sans-serif;
  }

  .ce-filter-pill:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: var(--gold);
    color: white;
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
    margin-bottom: 24px;
    font-weight: 600;
  }

  .ce-results-count strong {
    color: var(--saffron);
  }

  .ce-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
  }

  .ce-card {
    background: white;
    border-radius: 20px;
    border: 2px solid rgba(61, 34, 5, 0.08);
    padding: 24px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .ce-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(232, 101, 10, 0.15);
    border-color: var(--saffron);
  }

  .ce-card-icon {
    font-size: 48px;
    margin-bottom: 16px;
    display: block;
  }

  .ce-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .ce-card-desc {
    font-size: 14px;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .ce-card-salary {
    font-size: 15px;
    font-weight: 700;
    color: var(--success);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ce-card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .ce-tag {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    background: var(--parchment);
    color: var(--brown);
    border: 1px solid rgba(61, 34, 5, 0.1);
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
    padding: 80px 20px;
    color: var(--muted);
  }

  .ce-empty-icon {
    font-size: 64px;
    margin-bottom: 16px;
  }

  .ce-empty-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 8px;
  }

  .ce-empty-desc {
    font-size: 15px;
    color: var(--muted);
  }

  @media (max-width: 768px) {
    .ce-header {
      padding: 40px 20px 30px;
    }

    .ce-grid {
      grid-template-columns: 1fr;
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

  return (
    <div className="ce-root">
      <div className="ce-header">
        <h1 className="ce-title">Explore Career Paths</h1>
        <p className="ce-subtitle">
          Discover detailed information about {CAREER_DATA.length} diverse careers. 
          Filter by your interests and personality traits.
        </p>

        <div className="ce-search-bar">
          <span className="ce-search-icon">🔍</span>
          <input
            type="text"
            className="ce-search-input"
            placeholder="Search by career name or keyword..."
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

      <div className="ce-content">
        <div className="ce-results-count">
          Showing <strong>{filteredCareers.length}</strong> of {CAREER_DATA.length} careers
        </div>

        {filteredCareers.length === 0 ? (
          <div className="ce-empty-state">
            <div className="ce-empty-icon">🔍</div>
            <div className="ce-empty-title">No careers found</div>
            <div className="ce-empty-desc">
              Try adjusting your search or filters to find what you're looking for.
            </div>
          </div>
        ) : (
          <div className="ce-grid">
            {filteredCareers.map(career => (
              <div
                key={career.id}
                className="ce-card"
                onClick={() => setSelectedCareer(career)}
              >
                <span className="ce-card-icon">{career.category === 'Technology & Data' ? '💻' : 
                  career.category === 'Arts & Design' ? '🎨' :
                  career.category === 'Healthcare & Psychology' ? '🏥' :
                  career.category === 'Business & Finance' ? '💼' :
                  career.category === 'Aviation & Transport' ? '✈️' :
                  career.category === 'Media & Entertainment' ? '📺' :
                  career.category === 'Engineering & Infrastructure' ? '🏗️' :
                  career.category === 'Business & Marketing' ? '📊' : '🎯'}</span>
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
