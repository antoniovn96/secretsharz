import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from './firebase';
import { useDashboard } from "./context/DashboardContext";

export default function ParentDashboard({ user, userData, onBack, onLogout }) {
  const { userProfile } = useDashboard();
  const [localUserData, setLocalUserData] = useState(userData || {});
  const [activeParentTab, setActiveParentTab] = useState('overview');

  useEffect(() => { if (userData) setLocalUserData(userData); }, [userData]);

  useEffect(() => {
    if (!auth?.currentUser) return;
    const unsub = onSnapshot(doc(db, 'users', auth.currentUser.uid), (userDoc) => {
      if (userDoc.exists()) {
        setLocalUserData(userDoc.data());
      }
    }, (e) => { console.error('Error listening to user data:', e); });
    return () => unsub();
  }, []);

  // ── DATA EXTRACTION ──
  const studentName = localUserData?.name || user?.displayName || "Student";
  const hasAssessment = !!localUserData?.riasecCode;
  const exPoints = Number(userProfile.exPoints || 0);
  const maxXp = 300;
  const xpPct = Math.min(100, Math.round((exPoints / maxXp) * 100));

  const bestCareer = localUserData?.bestCareer || (hasAssessment ? {
    title: "Software Engineer", subtitle: "Tech & Innovation", matchPercent: 94,
    parentMetrics: { stability: "High", demand: "Very High", safety: "High" }
  } : null);
  const recommendedCareer = localUserData?.recommendedCareer || (hasAssessment ? {
    title: "Data Analyst", subtitle: "Research & Logic", matchPercent: 88,
    parentMetrics: { stability: "High", demand: "High", safety: "High" }
  } : null);
  const leastCareer = localUserData?.leastCareer || (hasAssessment ? {
    title: "Event Manager", subtitle: "Social & Enterprising", matchPercent: 42,
    parentMetrics: { stability: "Low", demand: "Medium", safety: "Moderate" }
  } : null);
  const skillGaps = (localUserData?.skillGaps && localUserData.skillGaps.length > 0)
    ? localUserData.skillGaps
    : (hasAssessment ? [
        { skill: "Analytical Thinking", status: "On Track", student: 8 },
        { skill: "Public Speaking", status: "Needs Work", student: 4 },
        { skill: "Time Management", status: "On Track", student: 7 }
      ] : []);
  const executionPlan = (localUserData?.executionPlan && localUserData.executionPlan.length > 0)
    ? localUserData.executionPlan
    : (hasAssessment ? [
        { title: "Skill Up", action: "Complete a basic Python course this month." },
        { title: "Research", action: "Look up admission criteria for top 3 target colleges." }
      ] : []);

  return (
    <div className="social-dark-theme">
      <div className="social-dashboard-layout" style={{ paddingTop: '60px' }}>

        {/* ── TOP GLOBAL NAV ── */}
        <nav className="top-global-nav">
          <h2>VidyaVantage (Parent Portal)</h2>
          <ul className="top-global-nav-links">
            <li>👨‍👩‍👧 My Child</li>
            <li>📈 Growth Report</li>
            <li>🚪 Sign Out</li>
          </ul>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main className="social-main-content">

          {/* ── PARENT HERO HEADER ── */}
          <div className="profile-hero-container">
            <div className="profile-cover-photo">
              <div className="profile-avatar-wrapper">
                <span className="profile-avatar-fallback">
                  P
                </span>
              </div>
            </div>
            <div className="profile-identity-row">
              <div className="profile-name-section">
                <h1>Parent Portal</h1>
                <div className="profile-bio">
                  Supporting your child&apos;s educational and career journey.
                </div>
                <div className="profile-pinned-details">
                  <span>📍 Linked to: {studentName}</span>
                  <span>👁️ Read-Only Access</span>
                </div>
              </div>
              <div className="profile-actions">
                <button className="btn-primary-social" onClick={() => window.print()}>📥 Download Report</button>
              </div>
            </div>
          </div>

          {/* ── NESTED LAYOUT ── */}
          <div className="about-container">
            <div className="about-sidebar">
              <h3>Dashboard</h3>
              <div className={`about-nav-item ${activeParentTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveParentTab('overview')}>Child Overview</div>
              <div className={`about-nav-item ${activeParentTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveParentTab('settings')}>Settings &amp; Billing</div>
            </div>

            <div className="about-content">
              {activeParentTab === 'overview' && (
                <div>
                  <div className="about-content-header">Academic &amp; Career Progress</div>

                  {/* ── XP / Progress Overview ── */}
                  <div style={{ background: '#2D2E2F', border: '1px solid #3A3B3C', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#F0A500', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                      ⚡ Child&apos;s EX Points
                    </div>
                    <div style={{ fontFamily: 'serif', fontSize: '36px', fontWeight: '900', color: '#F0A500', lineHeight: 1, marginBottom: '10px' }}>
                      {exPoints} <span style={{ fontSize: '16px', fontWeight: '600', color: '#B45309' }}>/ {maxXp}</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(240,165,0,0.15)', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ height: '100%', width: `${xpPct}%`, background: 'linear-gradient(90deg, #E8650A, #F0A500)', borderRadius: '8px', transition: 'width 1s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#B45309', fontWeight: '600' }}>
                      <span>Profile Completion</span>
                      <span>{xpPct}%</span>
                    </div>
                  </div>

                  {/* ── Career Matches (Parent View) ── */}
                  {hasAssessment ? (
                    <div style={{ background: '#2D2E2F', border: '1px solid #3A3B3C', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#E4E6EB', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                        🎯 Career Matches — Parent View
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                        {[
                          { data: bestCareer, label: '🏆 Best Match', color: '#34D399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
                          { data: recommendedCareer, label: '✅ Recommended', color: '#FCD34D', bg: 'rgba(252,211,77,0.08)', border: 'rgba(252,211,77,0.2)' },
                          { data: leastCareer, label: '⚠️ Least Suited', color: '#FB7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.2)' },
                        ].filter(item => item.data).map((item, i) => (
                          <div key={i} style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: '12px', padding: '16px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '700', color: item.color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>{item.label}</div>
                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#E4E6EB', marginBottom: '4px' }}>{String(item.data.title)}</div>
                            <div style={{ fontSize: '12px', color: '#B0B3B8', marginBottom: '12px' }}>{String(item.data.subtitle)}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                              <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ width: `${Number(item.data.matchPercent || 0)}%`, height: '100%', background: item.color, borderRadius: '5px' }} />
                              </div>
                              <span style={{ fontSize: '12px', fontWeight: '800', color: item.color, flexShrink: 0 }}>{Number(item.data.matchPercent || 0)}%</span>
                            </div>
                            {item.data.parentMetrics && (
                              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px' }}>
                                <div style={{ fontSize: '10px', fontWeight: '800', color: '#93C5FD', marginBottom: '6px', textTransform: 'uppercase' }}>👪 Parent Metrics</div>
                                {Object.entries(item.data.parentMetrics).map(([key, val]) => (
                                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#B0B3B8', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{key}</span>
                                    <strong style={{ color: '#E4E6EB' }}>{String(val)}</strong>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: '#2D2E2F', border: '1px dashed #3A3B3C', borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#E4E6EB', marginBottom: '8px' }}>Career Assessment Pending</div>
                      <div style={{ fontSize: '14px', color: '#B0B3B8' }}>Your child has not yet completed the RIASEC Career Assessment. Career matches will appear here once they do.</div>
                    </div>
                  )}

                  {/* ── Growth Plan ── */}
                  <div style={{ background: '#2D2E2F', border: '1px solid #3A3B3C', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: '800', color: '#E4E6EB', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                      📈 Growth Plan Overview
                    </div>
                    {hasAssessment ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Skill Gap Analysis */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#E4E6EB', marginBottom: '12px' }}>🧠 Skill Gap Analysis</div>
                          {skillGaps.map((s, i) => (
                            <div key={i} style={{ marginBottom: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                                <span style={{ color: '#B0B3B8' }}>{String(s.skill)}</span>
                                <span style={{ color: s.status === 'Needs Work' ? '#FB7185' : '#34D399' }}>{String(s.status)}</span>
                              </div>
                              <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '5px', overflow: 'hidden' }}>
                                <div style={{ width: `${(Number(s.student) / 10) * 100}%`, height: '100%', background: '#14B8A6', borderRadius: '5px' }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Execution Plan */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px' }}>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#E4E6EB', marginBottom: '12px' }}>🚀 Execution Plan</div>
                          {executionPlan.map((plan, i) => (
                            <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: '#E4E6EB', marginBottom: '4px' }}>{String(plan.title)}</div>
                              <div style={{ fontSize: '12px', color: '#B0B3B8' }}>{String(plan.action)}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#B0B3B8', fontSize: '14px' }}>
                        Growth plan will be available after your child completes the career assessment.
                      </div>
                    )}
                  </div>

                  {/* ── RIASEC Summary ── */}
                  {hasAssessment && localUserData?.riasecCode && (
                    <div style={{ background: 'linear-gradient(135deg, #0D1117 0%, #1C2850 60%, #0A3D2E 100%)', border: '1px solid rgba(240,165,0,0.2)', borderRadius: '16px', padding: '24px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '800', color: '#F0A500', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        🧠 RIASEC Career Intelligence
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: '700', color: 'white' }}>
                          {studentName}&apos;s Holland Code
                        </div>
                        <div style={{ fontFamily: 'serif', fontSize: '48px', fontWeight: '900', color: '#F0A500', letterSpacing: '4px' }}>
                          {String(localUserData.riasecCode)}
                        </div>
                      </div>
                      {localUserData?.riasecSummary && (
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px', fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.7' }}>
                          {String(localUserData.riasecSummary)}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

              {activeParentTab === 'settings' && (
                <div>
                  <div className="about-content-header">Account Management</div>
                  <div className="timeline-item">
                    <div className="timeline-icon">💳</div>
                    <div className="timeline-details">
                      <div className="timeline-title">Active Plan: Pro Guidance</div>
                      <div className="timeline-subtitle">Next billing date: 1st of next month</div>
                    </div>
                    <div className="timeline-action">✏️</div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
