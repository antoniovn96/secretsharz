import React from 'react';
import { useDashboard } from '../context/DashboardContext';

/**
 * CareerMatchesModal
 * Shows the student's top 3 career matches from their RIASEC assessment.
 * Triggered when the student clicks 'View Career Matches' in the Career Intel widget.
 */
export default function CareerMatchesModal({ onClose, localUserData }) {
  const { userProfile } = useDashboard();

  // Pull top career matches — prefer topCareerMatches from assessment, fall back to bestCareer/recommendedCareer
  const topMatches = (() => {
    if (localUserData?.topCareerMatches && localUserData.topCareerMatches.length > 0) {
      return localUserData.topCareerMatches.slice(0, 3);
    }
    // Fallback: build from bestCareer / recommendedCareer
    const fallback = [];
    if (localUserData?.bestCareer) {
      fallback.push({
        name: localUserData.bestCareer.title,
        matchScore: localUserData.bestCareer.matchPercent,
        tags: [localUserData.bestCareer.subtitle],
        stream: '',
        riasec: [],
        _isFallback: true,
        pros: localUserData.bestCareer.pros || [],
        cons: localUserData.bestCareer.cons || [],
      });
    }
    if (localUserData?.recommendedCareer) {
      fallback.push({
        name: localUserData.recommendedCareer.title,
        matchScore: localUserData.recommendedCareer.matchPercent,
        tags: [localUserData.recommendedCareer.subtitle],
        stream: '',
        riasec: [],
        _isFallback: true,
        pros: localUserData.recommendedCareer.pros || [],
        cons: localUserData.recommendedCareer.cons || [],
      });
    }
    return fallback.slice(0, 3);
  })();

  const RANK_STYLES = [
    { label: '🥇 Best Match', bg: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', border: '#6EE7B7', color: '#065F46', barColor: '#34D399' },
    { label: '🥈 2nd Match', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '#FCD34D', color: '#92400E', barColor: '#FBBF24' },
    { label: '🥉 3rd Match', bg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)', border: '#C4B5FD', color: '#5B21B6', barColor: '#8B5CF6' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
        backdropFilter: 'blur(6px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '28px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '88vh',
          overflow: 'auto',
          boxShadow: '0 32px 80px rgba(0,0,0,0.22)',
          animation: 'careerModalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
      >
        <style>{`
          @keyframes careerModalIn {
            from { opacity: 0; transform: scale(0.88) translateY(24px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0D1117 0%, #1C2850 100%)',
            padding: '28px 28px 24px',
            borderRadius: '28px 28px 0 0',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              transition: 'background 0.2s',
            }}
          >
            ✕
          </button>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#F0A500', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            🎯 Career Intelligence
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>
            Your Top Career Matches
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
            Based on your RIASEC code:{' '}
            <span style={{ color: '#F0A500', fontWeight: '800', letterSpacing: '2px' }}>
              {String(localUserData?.riasecCode || userProfile?.riasecCode || '—')}
            </span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {topMatches.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧠</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: '700', color: '#1C2333', marginBottom: '8px' }}>
                No Career Matches Yet
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>
                Complete the RIASEC assessment to unlock your personalised career matches.
              </div>
            </div>
          ) : (
            topMatches.map((career, i) => {
              const style = RANK_STYLES[i] || RANK_STYLES[2];
              const matchScore = Number(career.matchScore || 0);
              return (
                <div
                  key={i}
                  style={{
                    background: style.bg,
                    border: `1.5px solid ${style.border}`,
                    borderRadius: '16px',
                    padding: '18px 20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '10px', fontWeight: '800', color: style.color, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {style.label}
                      </div>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: '18px', fontWeight: '700', color: '#0D1117', marginBottom: '2px' }}>
                        {String(career.name || '')}
                      </div>
                      {career.tags && career.tags.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>
                          {career.tags.map(String).join(' · ')}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        background: 'white',
                        border: `1.5px solid ${style.border}`,
                        borderRadius: '12px',
                        padding: '8px 14px',
                        textAlign: 'center',
                        flexShrink: 0,
                        marginLeft: '12px',
                      }}
                    >
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', fontWeight: '900', color: style.color, lineHeight: 1 }}>
                        {matchScore}%
                      </div>
                      <div style={{ fontSize: '9px', fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                        Fit Score
                      </div>
                    </div>
                  </div>

                  {/* Match bar */}
                  <div style={{ height: '5px', background: 'rgba(0,0,0,0.08)', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div
                      style={{
                        width: `${matchScore}%`,
                        height: '100%',
                        background: style.barColor,
                        borderRadius: '5px',
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>

                  {/* RIASEC tags */}
                  {career.riasec && career.riasec.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {career.riasec.map((code, j) => (
                        <span
                          key={j}
                          style={{
                            background: 'rgba(0,0,0,0.07)',
                            color: style.color,
                            fontSize: '10px',
                            fontWeight: '800',
                            padding: '3px 8px',
                            borderRadius: '20px',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {String(code)}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pros/Cons for fallback data */}
                  {career._isFallback && career.pros && career.pros.length > 0 && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {career.pros.slice(0, 2).map((pro, j) => (
                        <div key={j} style={{ fontSize: '12px', color: '#065F46', fontWeight: '600', display: 'flex', gap: '6px' }}>
                          <span>✔</span> {String(pro)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #111827, #374151)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginTop: '4px',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
