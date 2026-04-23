import React, { useState, useMemo } from 'react';
import { CAREER_DATA, RIASEC_COLORS } from './data/careers';

const STREAM_PICKER_QUESTIONS = [
  {
    q: 'Which school subjects feel most natural and enjoyable to you?',
    options: [
      { label: '📐 Maths, Physics & Chemistry', scores: { Science: 4 } },
      { label: '🧬 Biology & Life Sciences', scores: { Science: 3, Arts: 1 } },
      { label: '💰 Economics, Accounts & Business Studies', scores: { Commerce: 4 } },
      { label: '📜 History, Political Science & Sociology', scores: { Arts: 4 } },
      { label: '🖥️ Computers & Information Technology', scores: { Science: 3, Commerce: 1 } },
      { label: '🎭 Languages, Literature & Fine Arts', scores: { Arts: 3, Commerce: 1 } },
    ],
  },
  {
    q: 'After school, you are most likely found doing:',
    options: [
      { label: '🔧 Building things, coding, or experimenting', scores: { Science: 4 } },
      { label: '📈 Reading about markets, business or investing', scores: { Commerce: 4 } },
      { label: '🎨 Drawing, writing, making music or videos', scores: { Arts: 4 } },
      { label: '🤝 Organising events or helping the community', scores: { Commerce: 2, Arts: 2 } },
      { label: '🔍 Researching random topics out of curiosity', scores: { Science: 3, Arts: 1 } },
      { label: '🎮 Gaming, sports or any competitive activity', scores: { Science: 2, Commerce: 2 } },
    ],
  },
  {
    q: 'In 10 years, where do you see yourself?',
    options: [
      { label: '👨‍💻 Software engineer, scientist or doctor', scores: { Science: 5 } },
      { label: '🏦 CA, banker, MBA or entrepreneur', scores: { Commerce: 5 } },
      { label: '🎬 Designer, filmmaker, writer or artist', scores: { Arts: 5 } },
      { label: '⚖️ Lawyer, journalist or teacher', scores: { Arts: 3, Commerce: 2 } },
      { label: '🌎 Something global — still figuring it out', scores: { Science: 2, Commerce: 2, Arts: 1 } },
    ],
  },
];

const STREAM_CAREER_MAP = {
  Science: ['Software Engineer', 'Medical Doctor', 'Data Scientist', 'Civil Engineer', 'UX / UI Designer'],
  Commerce: ['Chartered Accountant', 'Business Manager / MBA', 'Journalist / Content Creator', 'Fashion Designer'],
  Arts: ['Psychologist / Counsellor', 'Lawyer / Advocate', 'Teacher / Professor', 'Graphic / Visual Designer', 'Journalist / Content Creator'],
};

function SalaryViz({ entry, mid, senior }) {
  const max = 70;
  return (
    <div className="salary-viz">
      <div className="salary-viz-title">Salary in India (₹ LPA)</div>
      {[['Entry', entry, 'entry'], ['Mid', mid, 'mid'], ['Senior', senior, 'senior']].map(([label, val, cls]) => (
        <div key={label} className="salary-bar-row">
          <div className="salary-bar-label">{label}</div>
          <div className="salary-bar-track">
            <div className={`salary-bar-fill ${cls}`} style={{ width: `${Math.min(100, (val / max) * 100)}%` }} />
          </div>
          <div className="salary-bar-val">₹{val}L</div>
        </div>
      ))}
    </div>
  );
}

export default function CareerPaths({ assessmentRiasec, navigate, onTakeAssessment }) {
  const [explorerTab, setExplorerTab] = useState('browse');
  const [search, setSearch] = useState('');
  const [streamFilter, setStreamFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');
  const [riasecFilter, setRiasecFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [shortlist, setShortlist] = useState([]);
  const [displayCount, setDisplayCount] = useState(20);
  const [spStep, setSpStep] = useState(0);
  const [spAnswers, setSpAnswers] = useState([null, null, null]);
  const [spDone, setSpDone] = useState(false);

  const categories = useMemo(() => ['All', ...Array.from(new Set(CAREER_DATA.map(c => c.category)))], []);
  const growthMap = { 'Very High': 'VH', 'High': 'H', 'Medium': 'M', 'Stable': 'S' };

  const filtered = useMemo(() => {
    return CAREER_DATA.filter(c => {
      if (search && !c.title.toLowerCase().includes(search.toLowerCase()) && !c.category.toLowerCase().includes(search.toLowerCase())) return false;
      if (streamFilter !== 'All' && !c.stream.includes(streamFilter)) return false;
      if (catFilter !== 'All' && c.category !== catFilter) return false;
      if (riasecFilter !== 'All' && !c.riasec.includes(riasecFilter)) return false;
      return true;
    });
  }, [search, streamFilter, catFilter, riasecFilter]);

  const displayedCareers = filtered.slice(0, displayCount);
  const hasMore = displayCount < filtered.length;

  const toggleShortlist = (id) => setShortlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const spScores = useMemo(() => {
    const scores = { Science: 0, Commerce: 0, Arts: 0 };
    spAnswers.forEach((ans, qi) => {
      if (ans === null) return;
      const opt = STREAM_PICKER_QUESTIONS[qi].options[ans];
      Object.entries(opt.scores).forEach(([stream, pts]) => { scores[stream] += pts; });
    });
    return scores;
  }, [spAnswers]);

  const spTotal = Object.values(spScores).reduce((a, b) => a + b, 0) || 1;
  const spBest = Object.entries(spScores).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="vv-root">
      <div className="exp-hero">
        <div style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '10px', fontWeight: 600 }}>Interactive Career Intelligence</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(28px, 4vw, 42px)', color: 'white', marginBottom: '10px', lineHeight: 1.2 }}>Explore {CAREER_DATA.length}+ Career Paths</h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', maxWidth: '560px', margin: '0 auto 20px', lineHeight: 1.6 }}>Browse careers, see real salary data, compare paths, and find out which stream suits you best — all interactively.</p>
        <div className="exp-tabs">
          {[['browse', '🔎 Browse Careers'], ['stream-picker', '🎯 Stream Picker'], ['shortlist', `📌 My Shortlist (${shortlist.length})`]].map(([id, label]) => (
            <button key={id} className={`exp-tab ${explorerTab === id ? 'active' : ''}`} onClick={() => setExplorerTab(id)}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── BROWSE TAB ── */}
      {explorerTab === 'browse' && (
        <div className="exp-browse">
          {/* Help Me Choose Banner */}
          <div style={{ background: 'linear-gradient(135deg, var(--saffron), var(--gold))', borderRadius: '24px', padding: '40px', marginBottom: '32px', textAlign: 'center', boxShadow: '0 12px 40px rgba(232, 101, 10, 0.3)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(24px, 4vw, 36px)', color: 'white', marginBottom: '12px', lineHeight: 1.2 }}>Confused by {CAREER_DATA.length}+ Options?</h3>
            <p style={{ color: 'white', fontSize: '16px', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.6 }}>Let our AI analyze your personality and pick the perfect path for you. Get personalized career matches based on your unique RIASEC profile.</p>
            <button 
              style={{ background: 'white', color: 'var(--saffron)', border: 'none', padding: '16px 40px', borderRadius: '50px', fontSize: '17px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}
              onClick={onTakeAssessment}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Take the AI Career Assessment →
            </button>
          </div>

          <div className="exp-search-row">
            <input className="exp-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Search by career name or category..." />
            {(search || streamFilter !== 'All' || catFilter !== 'All' || riasecFilter !== 'All') && (
              <button className="filter-chip" onClick={() => { setSearch(''); setStreamFilter('All'); setCatFilter('All'); setRiasecFilter('All'); setDisplayCount(20); }} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>✕ Clear</button>
            )}
          </div>

          <div className="exp-filter-row">
            <span className="exp-filter-label">Stream</span>
            {['All', 'Science', 'Commerce', 'Arts'].map(s => (
              <button key={s} className={`filter-chip ${streamFilter === s ? 'active' : ''}`} onClick={() => { setStreamFilter(s); setDisplayCount(20); }}>{s}</button>
            ))}
            <span className="exp-filter-label" style={{ marginLeft: '8px' }}>RIASEC</span>
            {['All', 'R', 'I', 'A', 'S', 'E', 'C'].map(r => (
              <button key={r} className={`filter-chip riasec-${r} ${riasecFilter === r ? 'active' : ''}`} onClick={() => { setRiasecFilter(r); setDisplayCount(20); }} title={r !== 'All' ? RIASEC_COLORS[r]?.label : 'All types'}>
                {r === 'All' ? 'All' : `${r} – ${RIASEC_COLORS[r]?.label}`}
              </button>
            ))}
          </div>

          {/* Horizontally scrollable category filters */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '20px', paddingBottom: '8px' }}>
            <div className="exp-filter-row" style={{ flexWrap: 'nowrap', minWidth: 'max-content' }}>
              <span className="exp-filter-label">Category</span>
              {categories.map(c => (
                <button key={c} className={`filter-chip ${catFilter === c ? 'active' : ''}`} onClick={() => { setCatFilter(c); setDisplayCount(20); }} style={{ whiteSpace: 'nowrap' }}>{c}</button>
              ))}
            </div>
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
            Showing <strong style={{ color: 'var(--saffron)' }}>{displayedCareers.length}</strong> of {filtered.length} career paths
          </p>

          {filtered.length === 0 ? (
            <div className="exp-no-results">
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
              <p style={{ fontSize: '17px', fontWeight: 600, marginBottom: '6px' }}>No careers match your filters</p>
              <p style={{ fontSize: '14px' }}>Try adjusting the stream or RIASEC type filters above.</p>
            </div>
          ) : (
            <>
              <div className="exp-grid">
                {displayedCareers.map(career => {
                  const isExpanded = expandedId === career.id;
                  const inShortlist = shortlist.includes(career.id);
                  return (
                    <div key={career.id} className={`exp-card ${isExpanded ? 'expanded' : ''}`}>
                      <div className="exp-card-top" onClick={() => setExpandedId(isExpanded ? null : career.id)}>
                        <div className="exp-card-header">
                          <div className="exp-card-icon">{career.icon}</div>
                          <div className="exp-card-meta">
                            <div className="exp-card-title">{career.title}</div>
                            <div className="exp-card-cat">{career.category}</div>
                          </div>
                        </div>
                        <div className="exp-riasec-row">
                          {career.riasec.map(r => (
                            <span key={r} className="exp-riasec-chip" style={{ background: RIASEC_COLORS[r].bg, color: RIASEC_COLORS[r].color }}>{RIASEC_COLORS[r].label}</span>
                          ))}
                          {assessmentRiasec && career.riasec.some(r => assessmentRiasec.includes(r)) && (
                            <span className="exp-riasec-chip" style={{ background: 'rgba(45,125,70,0.1)', color: 'var(--success)' }}>✓ Matches Your Profile</span>
                          )}
                        </div>
                        <div className="exp-stream-chips">
                          {career.stream.map(s => (
                            <span key={s} className={`stream-chip stream-${s[0]}`}>{s}</span>
                          ))}
                          <span style={{ fontSize: '12px', color: 'var(--muted)', marginLeft: 'auto', fontWeight: 600 }}>🎓 {career.education}</span>
                        </div>
                      </div>

                      <SalaryViz entry={career.salaryEntry} mid={career.salaryMid} senior={career.salarySenior} />

                      <div className="exp-card-footer">
                        <span className={`growth-badge growth-${growthMap[career.growth]}`}>📈 {career.growth} Growth</span>
                        <span className="exp-expand-btn" onClick={() => setExpandedId(isExpanded ? null : career.id)}>
                          {isExpanded ? '▲ Less' : '▼ Details'}
                        </span>
                      </div>

                      {isExpanded && (
                        <div className="exp-expanded">
                          <p style={{ fontSize: '15px', color: 'var(--brown)', lineHeight: 1.7, marginBottom: '20px' }}>{career.description}</p>

                          <div className="exp-expand-grid">
                            <div className="exp-expand-block">
                              <h5>☀️ A Day in the Life</h5>
                              <p className="exp-day-text">{career.dayInLife}</p>
                            </div>
                            <div className="exp-expand-block">
                              <h5>⚡ Key Skills Needed</h5>
                              <div className="exp-skill-tags">
                                {career.skills.map(s => <span key={s} className="exp-skill-tag">{s}</span>)}
                              </div>
                            </div>
                            <div className="exp-expand-block">
                              <h5>✅ Why It's Great</h5>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {career.pros.map((p, i) => <li key={i} style={{ fontSize: '13px', padding: '3px 0', color: 'var(--dark)' }}>✓ {p}</li>)}
                              </ul>
                            </div>
                            <div className="exp-expand-block">
                              <h5>⚠️ Challenges to Expect</h5>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {career.cons.map((c, i) => <li key={i} style={{ fontSize: '13px', padding: '3px 0', color: 'var(--dark)' }}>✗ {c}</li>)}
                              </ul>
                            </div>
                          </div>

                          <div className="exp-expand-block" style={{ marginBottom: '10px' }}>
                            <h5>🏫 Top Colleges in India</h5>
                            <ul className="exp-colleges-list">
                              {career.colleges.map((c, i) => <li key={i}>› {c}</li>)}
                            </ul>
                          </div>
                          <div className="exp-expand-block" style={{ marginBottom: '14px' }}>
                            <h5>📝 Entrance Exams</h5>
                            <div className="exp-exams-row">
                              {career.exams.map(e => <span key={e} className="exp-exam-tag">{e}</span>)}
                            </div>
                          </div>

                          <button className={`add-shortlist-btn ${inShortlist ? 'added' : ''}`} onClick={() => toggleShortlist(career.id)}>
                            {inShortlist ? '📌 Saved to Shortlist' : '+ Add to My Shortlist'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <button 
                    style={{ background: 'var(--saffron)', color: 'white', border: 'none', padding: '16px 48px', borderRadius: '50px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(232, 101, 10, 0.25)', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}
                    onClick={() => setDisplayCount(prev => prev + 20)}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    Load 20 More Careers ({filtered.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── STREAM PICKER WIZARD TAB ── */}
      {explorerTab === 'stream-picker' && (
        <div className="stream-picker">
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: 'var(--dark)', marginBottom: '8px' }}>Which Stream is Right for You?</h2>
            <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '28px' }}>Answer 3 honest questions to get a data-driven stream recommendation.</p>
          </div>

          {!spDone ? (
            <>
              <div className="sp-progress">
                {STREAM_PICKER_QUESTIONS.map((_, i) => (
                  <div key={i} className={`sp-dot ${i < spStep ? 'done' : i === spStep ? 'active' : ''}`} />
                ))}
              </div>

              <div className="sp-card">
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--saffron)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>Question {spStep + 1} of {STREAM_PICKER_QUESTIONS.length}</p>
                <p className="sp-q">{STREAM_PICKER_QUESTIONS[spStep].q}</p>
                <div className="sp-options">
                  {STREAM_PICKER_QUESTIONS[spStep].options.map((opt, i) => (
                    <button
                      key={i}
                      className={`sp-option ${spAnswers[spStep] === i ? 'selected' : ''}`}
                      onClick={() => {
                        const updated = [...spAnswers];
                        updated[spStep] = i;
                        setSpAnswers(updated);
                      }}
                    >{opt.label}</button>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(61,34,5,0.08)' }}>
                  <button className="btn-back" onClick={() => setSpStep(s => Math.max(0, s - 1))} style={{ visibility: spStep === 0 ? 'hidden' : 'visible' }}>← Back</button>
                  {spStep < STREAM_PICKER_QUESTIONS.length - 1 ? (
                    <button className="btn-next" disabled={spAnswers[spStep] === null} onClick={() => setSpStep(s => s + 1)}>Next →</button>
                  ) : (
                    <button className="btn-next" disabled={spAnswers[spStep] === null} onClick={() => setSpDone(true)}>See My Stream →</button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="sp-result">
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>Your Recommended Stream</p>
              <div className="sp-result-stream">{spBest}</div>
              <p style={{ color: 'var(--muted)', fontSize: '15px', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                Based on your answers, <strong style={{ color: 'var(--dark)' }}>{spBest}</strong> aligns best with your natural interests and future goals. Here's how all three streams scored:
              </p>

              <div className="sp-result-bars" style={{ maxWidth: '420px', margin: '0 auto 28px' }}>
                {Object.entries(spScores).sort((a, b) => b[1] - a[1]).map(([stream, score]) => (
                  <div key={stream} className="sp-result-bar-row">
                    <div className="sp-result-bar-label">{stream}</div>
                    <div className="sp-result-bar-track">
                      <div className={`sp-result-bar-fill ${stream.toLowerCase()}`} style={{ width: `${(score / spTotal) * 100}%` }} />
                    </div>
                    <div className="sp-result-bar-pct">{Math.round((score / spTotal) * 100)}%</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(61,34,5,0.08)', paddingTop: '24px' }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Top Careers for {spBest} Stream</p>
                <div className="sp-careers-row">
                  {(STREAM_CAREER_MAP[spBest] || []).map(c => <span key={c} className="sp-career-pill">{c}</span>)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
                <button className="btn-next" onClick={() => { setSpDone(false); setSpStep(0); setSpAnswers([null, null, null]); }}>Retake Picker</button>
                <button className="btn-back" onClick={() => { setExplorerTab('browse'); setStreamFilter(spBest); }}>Browse {spBest} Careers →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SHORTLIST TAB ── */}
      {explorerTab === 'shortlist' && (
        <div className="exp-shortlist">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: 'var(--dark)', marginBottom: '8px' }}>My Career Shortlist</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '0', fontSize: '15px' }}>Careers you've saved for comparison. Click the × to remove.</p>
          {shortlist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📌</div>
              <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>No careers saved yet</p>
              <p style={{ fontSize: '14px', marginBottom: '20px' }}>Open any career card in Browse and click "Add to My Shortlist"</p>
              <button className="btn-next" onClick={() => setExplorerTab('browse')}>Browse Careers →</button>
            </div>
          ) : (
            <div className="shortlist-compare">
              {shortlist.map(id => {
                const c = CAREER_DATA.find(x => x.id === id);
                if (!c) return null;
                return (
                  <div key={id} className="shortlist-card">
                    <button className="shortlist-remove" onClick={() => toggleShortlist(id)}>×</button>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>{c.icon}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: 'var(--dark)', marginBottom: '4px' }}>{c.title}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--saffron)', textTransform: 'uppercase', marginBottom: '12px' }}>{c.category}</div>
                    <SalaryViz entry={c.salaryEntry} mid={c.salaryMid} senior={c.salarySenior} />
                    <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {c.stream.map(s => <span key={s} className={`stream-chip stream-${s[0]}`}>{s}</span>)}
                      <span className={`growth-badge growth-${growthMap[c.growth]}`}>{c.growth} Growth</span>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '13px', color: 'var(--muted)', fontWeight: 600 }}>🎓 {c.education}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
