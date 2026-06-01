import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

// ─────────────────────────────────────────────────────────────────────────────
// RIASEC → college category keyword mapping
// ─────────────────────────────────────────────────────────────────────────────
const RIASEC_CATEGORY_MAP = {
  R: ['engineering', 'architecture'],          // Realistic
  I: ['engineering', 'science', 'medicine'],   // Investigative
  A: ['arts', 'design', 'fashion'],            // Artistic
  S: ['social-sciences', 'nursing', 'medicine', 'arts'], // Social
  E: ['management', 'commerce', 'law'],        // Enterprising
  C: ['commerce', 'management', 'computer_application'], // Conventional
};

// Stream → college category keyword mapping
const STREAM_CATEGORY_MAP = {
  'Science (PCM)':  ['engineering', 'architecture', 'science'],
  'Science (PCB)':  ['medicine', 'science', 'nursing', 'dental', 'pharmacy'],
  'Science (PCMB)': ['engineering', 'science', 'medicine', 'pharmacy'],
  'Commerce':       ['commerce', 'management', 'law', 'arts'],
  'Arts/Humanities':['arts', 'social-sciences', 'law', 'management'],
  'Vocational':     ['management', 'arts', 'computer_application'],
};

/**
 * Returns a match score (0–100) for a college given the student's RIASEC code
 * and stream. Higher = better match.
 */
function getMatchScore(college, riasecCode, stream) {
  if (!college.category) return 0;
  const catWords = college.category.toLowerCase().split(/\s+/);

  let score = 0;

  // Stream match (weight: 60)
  if (stream && STREAM_CATEGORY_MAP[stream]) {
    const streamKeywords = STREAM_CATEGORY_MAP[stream];
    const streamHits = streamKeywords.filter(k => catWords.includes(k)).length;
    score += Math.round((streamHits / streamKeywords.length) * 60);
  }

  // RIASEC match (weight: 40) — use first two letters of the code
  if (riasecCode && typeof riasecCode === 'string') {
    const letters = riasecCode.toUpperCase().slice(0, 2).split('');
    let riasecHits = 0;
    let riasecTotal = 0;
    letters.forEach(letter => {
      const keywords = RIASEC_CATEGORY_MAP[letter] || [];
      riasecTotal += keywords.length;
      riasecHits += keywords.filter(k => catWords.includes(k)).length;
    });
    if (riasecTotal > 0) {
      score += Math.round((riasecHits / riasecTotal) * 40);
    }
  }

  return score;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CollegesPage = ({ navigate, currentUser, handleLogout, isAdmin, setModal, userData }) => {
    const [collegeData, setCollegeData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('all');

    // Derived from userData
    const riasecCode = userData?.riasecCode || null;
    const stream = userData?.stream1112 || null;
    const hasAssessment = !!(riasecCode);

    useEffect(() => {
        fetch('/colleges.json')
            .then(res => res.json())
            .then(data => {
                setCollegeData(data);
                setFilteredData(data);
            })
            .catch(err => console.error("Database Error:", err));
    }, []);

    useEffect(() => {
        const filtered = collegeData.filter(c => {
            const nameMatch = c.name?.toLowerCase().includes(search.toLowerCase());
            const loc = (c.displayLocation || c.location || "").toLowerCase();
            const matchesLocation = location === 'all' || loc.includes(location.toLowerCase());
            return nameMatch && matchesLocation;
        });
        setFilteredData(filtered);
    }, [search, location, collegeData]);

    // Compute AI recommended colleges (score > 0, sorted desc, max 6)
    const recommendedColleges = React.useMemo(() => {
        if (!hasAssessment || collegeData.length === 0) return [];
        return collegeData
            .map(c => ({ ...c, _score: getMatchScore(c, riasecCode, stream) }))
            .filter(c => c._score > 0)
            .sort((a, b) => b._score - a._score)
            .slice(0, 6);
    }, [collegeData, riasecCode, stream, hasAssessment]);

    // Label for what we matched on
    const matchLabel = stream && riasecCode
        ? `${stream} · ${riasecCode} RIASEC`
        : stream
        ? stream
        : riasecCode
        ? `${riasecCode} RIASEC`
        : '';

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
            <Header 
                navigate={navigate} 
                currentUser={currentUser} 
                handleLogout={handleLogout} 
                isAdmin={isAdmin} 
            />

            <style dangerouslySetInnerHTML={{ __html: `
                .colleges-hero {
                    background: #1E2820; 
                    text-align: center; 
                    padding: 80px 20px; 
                    color: white;
                    border-radius: 24px;
                    max-width: 1200px;
                    margin: 40px auto;
                }
                .filter-container { 
                    max-width: 1000px; 
                    margin: -70px auto 40px; 
                    background: white; 
                    padding: 24px; 
                    border-radius: 16px; 
                    box-shadow: 0 12px 40px rgba(30,40,32,0.1);
                    display: flex; 
                    gap: 15px; 
                    justify-content: center;
                    border: 1px solid rgba(74,124,89,0.15);
                }
                .college-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
                    gap: 30px; 
                    max-width: 1200px; 
                    margin: 0 auto 100px; 
                    padding: 0 20px;
                }
                .college-card { 
                    background: white; 
                    border-radius: 20px; 
                    overflow: hidden; 
                    border: 1px solid rgba(74,124,89,0.1); 
                    text-decoration: none; 
                    color: inherit;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                .college-card:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(30,40,32,0.13); }
                .card-img { width: 100%; height: 220px; object-fit: cover; }
                .card-body { padding: 24px; flex-grow: 1; }
                .filter-input { 
                    padding: 14px 20px; 
                    border: 1.5px solid rgba(74,124,89,0.2); 
                    border-radius: 50px; 
                    width: 280px; 
                    font-family: inherit;
                    outline: none;
                }
                .filter-input:focus { border-color: #4A7C59; }

                /* ── AI RECOMMENDED SECTION ── */
                .ai-rec-section {
                    max-width: 1200px;
                    margin: 0 auto 48px;
                    padding: 0 20px;
                }
                .ai-rec-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }
                .ai-rec-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: linear-gradient(135deg, #1E2820, #2D5240);
                    color: white;
                    padding: 6px 16px;
                    border-radius: 50px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                }
                .ai-rec-match-label {
                    font-size: 13px;
                    color: #4A7C59;
                    font-weight: 600;
                    background: #EBF4EE;
                    padding: 4px 12px;
                    border-radius: 20px;
                }
                .ai-rec-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }
                .ai-rec-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 2px solid rgba(74,124,89,0.2);
                    text-decoration: none;
                    color: inherit;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                .ai-rec-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(30,40,32,0.15); border-color: #4A7C59; }
                .ai-rec-card-img { width: 100%; height: 160px; object-fit: cover; }
                .ai-rec-card-body { padding: 16px; flex-grow: 1; }
                .ai-rec-score-badge {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #4A7C59;
                    color: white;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 3px 10px;
                    border-radius: 20px;
                }

                /* ── ASSESSMENT BANNER ── */
                .assessment-banner {
                    max-width: 1200px;
                    margin: 0 auto 40px;
                    padding: 0 20px;
                }
                .assessment-banner-inner {
                    background: linear-gradient(135deg, #1E2820 0%, #2D5240 100%);
                    border-radius: 20px;
                    padding: 32px 40px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 24px;
                    flex-wrap: wrap;
                }
                .assessment-banner-text h3 {
                    font-family: 'Fraunces', serif;
                    font-size: 22px;
                    color: white;
                    margin: 0 0 8px 0;
                }
                .assessment-banner-text p {
                    font-size: 14px;
                    color: rgba(255,255,255,0.75);
                    margin: 0;
                    max-width: 480px;
                    line-height: 1.5;
                }
                .assessment-banner-btn {
                    background: #4A7C59;
                    color: white;
                    border: none;
                    padding: 14px 28px;
                    border-radius: 50px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    font-family: inherit;
                    white-space: nowrap;
                    transition: background 0.2s;
                    flex-shrink: 0;
                }
                .assessment-banner-btn:hover { background: #2D5240; }

                .section-divider {
                    max-width: 1200px;
                    margin: 0 auto 32px;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .section-divider-line {
                    flex: 1;
                    height: 1px;
                    background: rgba(74,124,89,0.15);
                }
                .section-divider-label {
                    font-size: 12px;
                    font-weight: 700;
                    color: #7A8A7D;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
            `}} />

            <main>
                <div className="colleges-hero">
                    <h1 style={{ fontSize: '3.5rem', fontFamily: 'Fraunces, serif', marginBottom: '10px' }}>Top Colleges</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Your gateway to premier academic institutions.</p>
                </div>

                <div className="filter-container">
                    <input 
                        type="text" 
                        placeholder="🔍 Search by name..." 
                        className="filter-input"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select className="filter-input" onChange={(e) => setLocation(e.target.value)}>
                        <option value="all">📍 All Locations</option>
                        <option value="bengaluru">Bengaluru</option>
                        <option value="delhi">Delhi</option>
                    </select>
                </div>

                {/* ── AI RECOMMENDED SECTION ── */}
                {currentUser && !hasAssessment && (
                    <div className="assessment-banner">
                        <div className="assessment-banner-inner">
                            <div className="assessment-banner-text">
                                <h3>🎯 Get Personalised College Recommendations</h3>
                                <p>
                                    Take the free RIASEC Career Assessment to unlock AI-powered college matches
                                    tailored to your personality, stream, and career goals.
                                </p>
                            </div>
                            <button
                                className="assessment-banner-btn"
                                onClick={() => navigate('/vidyavantage')}
                            >
                                Take Free Assessment →
                            </button>
                        </div>
                    </div>
                )}

                {!currentUser && (
                    <div className="assessment-banner">
                        <div className="assessment-banner-inner">
                            <div className="assessment-banner-text">
                                <h3>🎯 Want Personalised College Recommendations?</h3>
                                <p>
                                    Sign in and take the free RIASEC Career Assessment to see colleges matched
                                    specifically to your stream and personality type.
                                </p>
                            </div>
                            <button
                                className="assessment-banner-btn"
                                onClick={() => navigate('/auth')}
                            >
                                Sign In to Unlock →
                            </button>
                        </div>
                    </div>
                )}

                {hasAssessment && recommendedColleges.length > 0 && (
                    <div className="ai-rec-section">
                        <div className="ai-rec-header">
                            <div className="ai-rec-badge">✨ AI Recommended</div>
                            {matchLabel && (
                                <span className="ai-rec-match-label">Matched for: {matchLabel}</span>
                            )}
                        </div>
                        <div className="ai-rec-grid">
                            {recommendedColleges.map((college, idx) => (
                                <a
                                    key={idx}
                                    href={`/college-details?name=${encodeURIComponent(college.name)}`}
                                    className="ai-rec-card"
                                >
                                    <img src={college.image} className="ai-rec-card-img" alt={college.name} />
                                    <span className="ai-rec-score-badge">
                                        {college._score}% match
                                    </span>
                                    <div className="ai-rec-card-body">
                                        <h2 style={{ fontSize: '1.1rem', color: '#1E2820', marginBottom: '6px', lineHeight: 1.3 }}>
                                            {college.name}
                                        </h2>
                                        <p style={{ color: '#4A7C59', fontWeight: 700, fontSize: '13px' }}>
                                            📍 {college.displayLocation || college.location}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Divider between recommended and all colleges */}
                {hasAssessment && recommendedColleges.length > 0 && (
                    <div className="section-divider">
                        <div className="section-divider-line" />
                        <span className="section-divider-label">All Colleges</span>
                        <div className="section-divider-line" />
                    </div>
                )}

                <div className="college-grid">
                    {filteredData.map((college, idx) => (
                        <a key={idx} href={`/college-details?name=${encodeURIComponent(college.name)}`} className="college-card">
                            <img src={college.image} className="card-img" alt={college.name} />
                            <div className="card-body">
                                <h2 style={{ fontSize: '1.4rem', color: '#1E2820', marginBottom: '8px' }}>{college.name}</h2>
                                <p style={{ color: '#4A7C59', fontWeight: 700 }}>📍 {college.displayLocation || college.location}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </main>

            <Footer 
                navigate={navigate} 
                currentUser={currentUser} 
                handleLogout={handleLogout} 
                setModal={setModal} 
            />
        </div>
    );
};

export default CollegesPage;
