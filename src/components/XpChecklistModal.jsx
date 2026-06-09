import React from 'react';
import { useDashboard } from '../context/DashboardContext';

/**
 * XpChecklistModal
 * Shows a checklist of missing profile items that the student can complete to earn XP.
 * Triggered when the student clicks the 'Complete Your Profile to Earn 200 XP!' alert.
 */
export default function XpChecklistModal({ onClose }) {
  const { userProfile } = useDashboard();

  // ── XP Checklist Helper ──────────────────────────────────────────────────────
  // Checks each profile field and returns a list of missing items with their XP value.
  const getMissingItems = () => {
    const missing = [];

    if (!userProfile.profilePicture) {
      missing.push({ label: 'Upload a Profile Picture', xp: 50, icon: '📸' });
    }
    if (!Array.isArray(userProfile.interests) || userProfile.interests.length === 0) {
      missing.push({ label: 'Add at least one Interest', xp: 30, icon: '💡' });
    }
    if (!Array.isArray(userProfile.hobbies) || userProfile.hobbies.length === 0) {
      missing.push({ label: 'Add at least one Hobby', xp: 20, icon: '🎨' });
    }
    if (!Array.isArray(userProfile.tvShows) || userProfile.tvShows.length === 0) {
      missing.push({ label: 'Add a favourite TV Show', xp: 15, icon: '📺' });
    }
    if (!Array.isArray(userProfile.movies) || userProfile.movies.length === 0) {
      missing.push({ label: 'Add a favourite Movie', xp: 15, icon: '🎬' });
    }
    if (!Array.isArray(userProfile.games) || userProfile.games.length === 0) {
      missing.push({ label: 'Add a favourite Game', xp: 15, icon: '🎮' });
    }
    if (!Array.isArray(userProfile.sports) || userProfile.sports.length === 0) {
      missing.push({ label: 'Add a favourite Sport', xp: 15, icon: '⚽' });
    }

    const edu = userProfile.education || {};
    const eduCoreComplete =
      edu.schoolName && edu.schoolName.trim() !== '' &&
      edu.highestLevel && edu.highestLevel.trim() !== '' &&
      edu.marksValue && String(edu.marksValue).trim() !== '';

    if (!eduCoreComplete) {
      missing.push({ label: 'Complete Education Details (School, Level & Marks)', xp: 100, icon: '🎓' });
    }
    if (!edu.address || edu.address.trim() === '') {
      missing.push({ label: 'Add your School Address', xp: 10, icon: '📍' });
    }
    if (!edu.yearOfPassing || String(edu.yearOfPassing).trim() === '') {
      missing.push({ label: 'Add Year of Passing', xp: 10, icon: '📅' });
    }
    if (!Array.isArray(edu.subjects) || edu.subjects.length === 0) {
      missing.push({ label: 'Add your Subjects', xp: 20, icon: '📚' });
    }
    if (!Array.isArray(edu.electives) || edu.electives.length === 0) {
      missing.push({ label: 'Add your Electives', xp: 10, icon: '🔬' });
    }

    return missing;
  };

  const missingItems = getMissingItems();
  const totalMissingXp = missingItems.reduce((sum, item) => sum + item.xp, 0);
  const currentXp = Number(userProfile.exPoints || 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '24px',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '85vh',
          overflow: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          animation: 'xpModalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
      >
        <style>{`
          @keyframes xpModalIn {
            from { opacity: 0; transform: scale(0.88) translateY(20px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
            borderBottom: '1.5px solid #FDE68A',
            padding: '24px 28px 20px',
            borderRadius: '24px 24px 0 0',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0,0,0,0.06)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#92400E',
            }}
          >
            ✕
          </button>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>⚡</div>
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '22px',
              fontWeight: '700',
              color: '#92400E',
              marginBottom: '4px',
            }}
          >
            Earn up to {totalMissingXp} more XP!
          </div>
          <div style={{ fontSize: '13px', color: '#B45309', fontWeight: '500' }}>
            You currently have <strong>{currentXp} XP</strong>. Complete the items below to level up.
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 28px 28px' }}>
          {missingItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
              <div
                style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#059669',
                  marginBottom: '8px',
                }}
              >
                Profile Complete!
              </div>
              <div style={{ fontSize: '13px', color: '#6B7280' }}>
                You've filled in everything. Your XP is fully maximised!
              </div>
            </div>
          ) : (
            <>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  color: '#6B7280',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                Missing Items ({missingItems.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {missingItems.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      background: '#FFFBEB',
                      border: '1.5px solid #FDE68A',
                      borderRadius: '12px',
                    }}
                  >
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#1C2333' }}>
                        {item.label}
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #E8650A, #F0A500)',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        flexShrink: 0,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      +{item.xp} XP
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  padding: '13px',
                  background: 'linear-gradient(135deg, #E8650A, #F0A500)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontSize: '14px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  boxShadow: '0 6px 20px rgba(232,101,10,0.35)',
                  transition: 'all 0.2s',
                }}
              >
                ✏️ Edit Profile & Earn XP
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
