import React, { useState, useEffect, useCallback } from 'react';
import { useDashboard } from './context/DashboardContext';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EDUCATION_LEVELS = [
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'Diploma',
  'Undergraduate (UG)',
  'Postgraduate (PG)',
  'Doctorate / PhD',
];

// Levels that are "10th Grade or below" — cannot select higher options
const LEVELS_UP_TO_10TH = ['8th Grade', '9th Grade', '10th Grade'];

// Levels where Electives should be hidden
const HIDE_ELECTIVES_LEVELS = ['9th Grade', '10th Grade'];

// CGPA → Percentage conversion (standard formula: CGPA × 9.5)
const cgpaToPercentage = (cgpa) => {
  const val = parseFloat(cgpa);
  if (isNaN(val) || val < 0 || val > 10) return null;
  return (val * 9.5).toFixed(2);
};

// ─────────────────────────────────────────────────────────────────────────────
// INLINE STYLES
// ─────────────────────────────────────────────────────────────────────────────

const S = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(13,17,23,0.72)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '24px 16px',
    overflowY: 'auto',
  },
  modal: {
    background: '#FFFFFF',
    borderRadius: '24px',
    width: '100%',
    maxWidth: '720px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '24px',
  },
  header: {
    padding: '28px 32px 20px',
    borderBottom: '1px solid #E1E7EF',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    position: 'sticky',
    top: 0,
    background: 'white',
    borderRadius: '24px 24px 0 0',
    zIndex: 10,
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '22px',
    fontWeight: '700',
    color: '#0D1117',
    marginBottom: '4px',
  },
  headerSub: { fontSize: '13px', color: '#6B7280', fontWeight: '500' },
  closeBtn: {
    background: '#F6F8FA',
    border: '1.5px solid #E1E7EF',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#6B7280',
    flexShrink: 0,
    lineHeight: 1,
  },
  xpBanner: {
    margin: '20px 32px 0',
    background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
    border: '1.5px solid #FDE68A',
    borderRadius: '14px',
    padding: '14px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  xpBannerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  xpBannerIcon: { fontSize: '24px' },
  xpBannerLabel: { fontSize: '12px', fontWeight: '700', color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.5px' },
  xpBannerValue: { fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: '900', color: '#D97706', lineHeight: 1 },
  xpBannerSub: { fontSize: '11px', color: '#B45309', fontWeight: '500', marginTop: '2px' },
  body: { padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: '28px' },
  section: {
    background: '#F6F8FA',
    borderRadius: '16px',
    border: '1.5px solid #E1E7EF',
    overflow: 'hidden',
  },
  sectionHeader: {
    padding: '16px 20px',
    background: 'white',
    borderBottom: '1px solid #E1E7EF',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionIcon: { fontSize: '20px' },
  sectionTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '16px',
    fontWeight: '700',
    color: '#0D1117',
  },
  sectionBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #E1E7EF',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#0D1117',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputDisabled: {
    background: '#F6F8FA',
    color: '#9CA3AF',
    cursor: 'not-allowed',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #E1E7EF',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#0D1117',
    background: 'white',
    outline: 'none',
    cursor: 'pointer',
  },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#EEF2FF',
    border: '1px solid #C7D2FE',
    color: '#4338CA',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  tagRemove: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6366F1',
    fontSize: '14px',
    lineHeight: 1,
    padding: '0',
    display: 'flex',
    alignItems: 'center',
  },
  tagInputRow: { display: 'flex', gap: '8px' },
  tagAddBtn: {
    padding: '10px 16px',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  },
  toggleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'white',
    borderRadius: '10px',
    border: '1.5px solid #E1E7EF',
  },
  toggleLabel: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  toggleTrack: (on) => ({
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    background: on ? '#4F46E5' : '#D1D5DB',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background 0.2s',
    flexShrink: 0,
  }),
  toggleThumb: (on) => ({
    position: 'absolute',
    top: '3px',
    left: on ? '23px' : '3px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: 'white',
    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
    transition: 'left 0.2s',
  }),
  marksTypeRow: { display: 'flex', gap: '8px' },
  marksTypeBtn: (active) => ({
    flex: 1,
    padding: '9px 12px',
    border: active ? '2px solid #4F46E5' : '1.5px solid #E1E7EF',
    borderRadius: '10px',
    background: active ? '#EEF2FF' : 'white',
    color: active ? '#4338CA' : '#6B7280',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  }),
  cgpaHint: {
    background: '#F0FDF4',
    border: '1px solid #A7F3D0',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#065F46',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  picPreview: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #E1E7EF',
    flexShrink: 0,
  },
  picPlaceholder: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #E8650A, #F0A500)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    color: 'white',
    flexShrink: 0,
  },
  picRow: { display: 'flex', alignItems: 'center', gap: '16px' },
  mockUploadBtn: {
    padding: '9px 16px',
    background: 'white',
    border: '1.5px solid #E1E7EF',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  footer: {
    padding: '20px 32px',
    borderTop: '1px solid #E1E7EF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    background: 'white',
    borderRadius: '0 0 24px 24px',
    position: 'sticky',
    bottom: 0,
  },
  footerLeft: { fontSize: '12px', color: '#6B7280', fontWeight: '500' },
  footerRight: { display: 'flex', gap: '10px' },
  cancelBtn: {
    padding: '10px 20px',
    background: 'white',
    border: '1.5px solid #E1E7EF',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#6B7280',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  saveBtn: {
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #E8650A, #F0A500)',
    border: 'none',
    borderRadius: '50px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'white',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 14px rgba(232,101,10,0.3)',
  },
  saveBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  infoNote: {
    fontSize: '11px',
    color: '#9CA3AF',
    fontWeight: '500',
    marginTop: '4px',
  },
  disabledNote: {
    fontSize: '11px',
    color: '#F59E0B',
    fontWeight: '600',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** A controlled tag-input: shows existing tags + an input to add new ones */
function TagInput({ label, values, onChange, placeholder, disabled }) {
  const [inputVal, setInputVal] = useState('');

  const addTag = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    if (!values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInputVal('');
  };

  const removeTag = (idx) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div style={S.fieldGroup}>
      <label style={S.label}>{label}</label>
      {values.length > 0 && (
        <div style={S.tagRow}>
          {values.map((v, i) => (
            <span key={i} style={S.tag}>
              {String(v)}
              {!disabled && (
                <button
                  type="button"
                  style={S.tagRemove}
                  onClick={() => removeTag(i)}
                  aria-label={`Remove ${v}`}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      {!disabled && (
        <div style={S.tagInputRow}>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || `Add ${label.toLowerCase()}...`}
            style={S.input}
          />
          <button type="button" style={S.tagAddBtn} onClick={addTag}>
            + Add
          </button>
        </div>
      )}
    </div>
  );
}

/** Simple toggle switch */
function Toggle({ label, sublabel, checked, onChange }) {
  return (
    <div style={S.toggleRow}>
      <div>
        <div style={S.toggleLabel}>{label}</div>
        {sublabel && <div style={S.infoNote}>{sublabel}</div>}
      </div>
      <div
        role="switch"
        aria-checked={checked}
        style={S.toggleTrack(checked)}
        onClick={() => onChange(!checked)}
      >
        <div style={S.toggleThumb(checked)} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileEditor({ onClose }) {
  const { userProfile, updateUserProfile } = useDashboard();

  // ── Local form state (mirrors userProfile shape) ──────────────────────────
  const [profilePicture, setProfilePicture] = useState(userProfile.profilePicture || '');
  const [picUrlInput, setPicUrlInput] = useState(userProfile.profilePicture || '');

  const [interests, setInterests] = useState(Array.isArray(userProfile.interests) ? userProfile.interests : []);
  const [hobbies, setHobbies] = useState(Array.isArray(userProfile.hobbies) ? userProfile.hobbies : []);
  const [tvShows, setTvShows] = useState(Array.isArray(userProfile.tvShows) ? userProfile.tvShows : []);
  const [movies, setMovies] = useState(Array.isArray(userProfile.movies) ? userProfile.movies : []);
  const [games, setGames] = useState(Array.isArray(userProfile.games) ? userProfile.games : []);
  const [sports, setSports] = useState(Array.isArray(userProfile.sports) ? userProfile.sports : []);

  // Education
  const edu = userProfile.education || {};
  const [schoolName, setSchoolName] = useState(edu.schoolName || '');
  const [address, setAddress] = useState(edu.address || '');
  const [yearOfPassing, setYearOfPassing] = useState(edu.yearOfPassing || '');
  const [isPursuing, setIsPursuing] = useState(typeof edu.isPursuing === 'boolean' ? edu.isPursuing : true);
  const [highestLevel, setHighestLevel] = useState(edu.highestLevel || '');
  const [subjects, setSubjects] = useState(Array.isArray(edu.subjects) ? edu.subjects : []);
  const [electives, setElectives] = useState(Array.isArray(edu.electives) ? edu.electives : []);
  const [marksType, setMarksType] = useState(edu.marksType || 'percentage');
  const [marksValue, setMarksValue] = useState(edu.marksValue || '');
  const [marksMax, setMarksMax] = useState(edu.marksMax || '');
  const [marksObtained, setMarksObtained] = useState(edu.marksObtained || '');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Derived flags ─────────────────────────────────────────────────────────

  /** True if the selected level is 10th Grade or below */
  const isUpTo10th = LEVELS_UP_TO_10TH.includes(highestLevel);

  /** True if electives should be hidden */
  const hideElectives = HIDE_ELECTIVES_LEVELS.includes(highestLevel);

  /** Live CGPA → % conversion */
  const cgpaPct = marksType === 'cgpa' ? cgpaToPercentage(marksValue) : null;

  // ── Sync profile picture URL on blur ─────────────────────────────────────
  const applyPicUrl = () => {
    setProfilePicture(picUrlInput.trim());
  };

  // ── Handle highestLevel change with 10th-grade lock ───────────────────────
  const handleHighestLevelChange = (e) => {
    const selected = e.target.value;
    // If currently locked at 10th, only allow selecting 10th or below
    if (isUpTo10th && selected && !LEVELS_UP_TO_10TH.includes(selected)) {
      // Silently ignore — the select options are already disabled, but guard here too
      return;
    }
    setHighestLevel(selected);
    // If new level hides electives, clear them
    if (HIDE_ELECTIVES_LEVELS.includes(selected)) {
      setElectives([]);
    }
  };

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    setSaving(true);

    const educationPayload = {
      schoolName: schoolName.trim(),
      address: address.trim(),
      yearOfPassing: String(yearOfPassing).trim(),
      isPursuing,
      highestLevel,
      subjects: subjects.map(String),
      electives: hideElectives ? [] : electives.map(String),
      marksType,
      marksValue: marksType === 'raw' ? '' : String(marksValue).trim(),
      marksMax: marksType === 'raw' ? String(marksMax).trim() : '',
      marksObtained: marksType === 'raw' ? String(marksObtained).trim() : '',
    };

    const profilePayload = {
      profilePicture: profilePicture.trim() || null,
      interests: interests.map(String),
      hobbies: hobbies.map(String),
      tvShows: tvShows.map(String),
      movies: movies.map(String),
      games: games.map(String),
      sports: sports.map(String),
      education: educationPayload,
    };

    updateUserProfile(profilePayload);

    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      if (onClose) onClose();
    }, 1200);
  }, [
    profilePicture, interests, hobbies, tvShows, movies, games, sports,
    schoolName, address, yearOfPassing, isPursuing, highestLevel,
    subjects, electives, marksType, marksValue, marksMax, marksObtained,
    hideElectives, updateUserProfile, onClose,
  ]);

  // ── Prevent body scroll while modal is open ───────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // ── Live XP preview ───────────────────────────────────────────────────────
  const previewXp = (() => {
    let pts = 0;
    if (profilePicture.trim()) pts += 50;
    if (interests.length > 0) pts += 30;
    if (hobbies.length > 0) pts += 20;
    if (tvShows.length > 0) pts += 15;
    if (movies.length > 0) pts += 15;
    if (games.length > 0) pts += 15;
    if (sports.length > 0) pts += 15;
    const eduCoreComplete = schoolName.trim() && highestLevel && (
      marksType === 'raw' ? (marksMax.trim() && marksObtained.trim()) : marksValue.toString().trim()
    );
    if (eduCoreComplete) pts += 100;
    if (address.trim()) pts += 10;
    if (String(yearOfPassing).trim()) pts += 10;
    if (subjects.length > 0) pts += 20;
    if (!hideElectives && electives.length > 0) pts += 10;
    return pts;
  })();

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={S.overlay} onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div style={S.modal} role="dialog" aria-modal="true" aria-label="Edit Profile">

        {/* ── HEADER ── */}
        <div style={S.header}>
          <div style={S.headerLeft}>
            <div style={S.headerTitle}>✏️ Edit Your Profile</div>
            <div style={S.headerSub}>Fill in your details to earn EX Points and unlock better recommendations.</div>
          </div>
          <button style={S.closeBtn} onClick={onClose} aria-label="Close editor">×</button>
        </div>

        {/* ── XP PREVIEW BANNER ── */}
        <div style={S.xpBanner}>
          <div style={S.xpBannerLeft}>
            <span style={S.xpBannerIcon}>⚡</span>
            <div>
              <div style={S.xpBannerLabel}>EX Points Preview</div>
              <div style={S.infoNote}>Updates live as you fill in fields</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={S.xpBannerValue}>{previewXp}</div>
            <div style={S.xpBannerSub}>/ 310 max XP</div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div style={S.body}>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 1 — FUN
          ════════════════════════════════════════════════════════════════ */}
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>🎉</span>
              <span style={S.sectionTitle}>Fun &amp; Personality</span>
            </div>
            <div style={S.sectionBody}>

              {/* Profile Picture */}
              <div style={S.fieldGroup}>
                <label style={S.label}>Profile Picture</label>
                <div style={S.picRow}>
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                      style={S.picPreview}
                      onError={() => setProfilePicture('')}
                    />
                  ) : (
                    <div style={S.picPlaceholder}>👤</div>
                  )}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="url"
                      value={picUrlInput}
                      onChange={(e) => setPicUrlInput(e.target.value)}
                      onBlur={applyPicUrl}
                      placeholder="Paste image URL (e.g. https://...)"
                      style={S.input}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        style={S.mockUploadBtn}
                        onClick={() => {
                          // Mock upload — in production this would open a file picker
                          const demo = 'https://api.dicebear.com/7.x/avataaars/svg?seed=SecretSharz';
                          setPicUrlInput(demo);
                          setProfilePicture(demo);
                        }}
                      >
                        📁 Mock Upload
                      </button>
                      {profilePicture && (
                        <button
                          type="button"
                          style={{ ...S.mockUploadBtn, color: '#EF4444', borderColor: '#FECDD3' }}
                          onClick={() => { setProfilePicture(''); setPicUrlInput(''); }}
                        >
                          🗑 Remove
                        </button>
                      )}
                    </div>
                    <div style={S.infoNote}>+50 XP for adding a profile picture</div>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <TagInput
                label="Interests (+30 XP)"
                values={interests}
                onChange={setInterests}
                placeholder="e.g. Technology, Music, Art..."
              />

              {/* Hobbies */}
              <TagInput
                label="Hobbies (+20 XP)"
                values={hobbies}
                onChange={setHobbies}
                placeholder="e.g. Reading, Sketching, Cooking..."
              />

              <div style={S.twoCol}>
                {/* TV Shows */}
                <TagInput
                  label="TV Shows (+15 XP)"
                  values={tvShows}
                  onChange={setTvShows}
                  placeholder="e.g. Breaking Bad..."
                />
                {/* Movies */}
                <TagInput
                  label="Movies (+15 XP)"
                  values={movies}
                  onChange={setMovies}
                  placeholder="e.g. Interstellar..."
                />
              </div>

              <div style={S.twoCol}>
                {/* Games */}
                <TagInput
                  label="Games (+15 XP)"
                  values={games}
                  onChange={setGames}
                  placeholder="e.g. Chess, Minecraft..."
                />
                {/* Sports */}
                <TagInput
                  label="Sports (+15 XP)"
                  values={sports}
                  onChange={setSports}
                  placeholder="e.g. Cricket, Badminton..."
                />
              </div>

            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 2 — EDUCATION
          ════════════════════════════════════════════════════════════════ */}
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>🎓</span>
              <span style={S.sectionTitle}>Education</span>
            </div>
            <div style={S.sectionBody}>

              {/* School Name */}
              <div style={S.fieldGroup}>
                <label style={S.label}>School / Institution Name (+100 XP core)</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Delhi Public School, R.K. Puram"
                  style={S.input}
                />
              </div>

              {/* Address */}
              <div style={S.fieldGroup}>
                <label style={S.label}>School Address (+10 XP)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. R.K. Puram, New Delhi"
                  style={S.input}
                />
              </div>

              <div style={S.twoCol}>
                {/* Year of Passing */}
                <div style={S.fieldGroup}>
                  <label style={S.label}>Year of Passing (+10 XP)</label>
                  <input
                    type="number"
                    value={yearOfPassing}
                    onChange={(e) => setYearOfPassing(e.target.value)}
                    placeholder="e.g. 2026"
                    min="2000"
                    max="2040"
                    style={isPursuing ? { ...S.input, ...S.inputDisabled } : S.input}
                    disabled={isPursuing}
                  />
                  {isPursuing && (
                    <div style={S.infoNote}>Disabled — currently pursuing</div>
                  )}
                </div>

                {/* Currently Pursuing Toggle */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <Toggle
                    label="Currently Pursuing"
                    sublabel="Toggle off if already passed out"
                    checked={isPursuing}
                    onChange={(val) => {
                      setIsPursuing(val);
                      if (val) setYearOfPassing('');
                    }}
                  />
                </div>
              </div>

              {/* Highest Level of Education */}
              <div style={S.fieldGroup}>
                <label style={S.label}>Highest Level of Education (+100 XP core)</label>
                <select
                  value={highestLevel}
                  onChange={handleHighestLevelChange}
                  style={S.select}
                >
                  <option value="">— Select Level —</option>
                  {EDUCATION_LEVELS.map((lvl) => {
                    // If current selection is 10th or below, disable all higher options
                    const isDisabled = isUpTo10th && !LEVELS_UP_TO_10TH.includes(lvl) && lvl !== '';
                    return (
                      <option key={lvl} value={lvl} disabled={isDisabled}>
                        {lvl}{isDisabled ? ' (locked — complete 10th first)' : ''}
                      </option>
                    );
                  })}
                </select>
                {isUpTo10th && (
                  <div style={S.disabledNote}>
                    <span>🔒</span>
                    <span>Higher education levels are locked until you progress past 10th Grade.</span>
                  </div>
                )}
              </div>

              {/* Subjects */}
              <TagInput
                label="Subjects (+20 XP)"
                values={subjects}
                onChange={setSubjects}
                placeholder="e.g. Physics, Chemistry, Maths..."
              />

              {/* Electives — hidden for 9th/10th grade */}
              {hideElectives ? (
                <div style={{ ...S.fieldGroup }}>
                  <label style={{ ...S.label, color: '#9CA3AF' }}>Electives</label>
                  <div style={{
                    padding: '12px 16px',
                    background: '#F9FAFB',
                    border: '1.5px dashed #D1D5DB',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: '#9CA3AF',
                    fontWeight: '500',
                  }}>
                    🚫 Electives are not applicable for {highestLevel || '9th/10th Grade'} students.
                  </div>
                </div>
              ) : (
                <TagInput
                  label="Electives (+10 XP)"
                  values={electives}
                  onChange={setElectives}
                  placeholder="e.g. Physical Education, Fine Arts..."
                />
              )}

              {/* Marks Type Toggle */}
              <div style={S.fieldGroup}>
                <label style={S.label}>Marks / Grade Format (+100 XP core)</label>
                <div style={S.marksTypeRow}>
                  {[
                    { key: 'percentage', label: '% Percentage' },
                    { key: 'cgpa', label: '🔢 CGPA' },
                    { key: 'raw', label: '📊 Raw Marks' },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      style={S.marksTypeBtn(marksType === key)}
                      onClick={() => {
                        setMarksType(key);
                        setMarksValue('');
                        setMarksMax('');
                        setMarksObtained('');
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Marks Input — conditional on type */}
              {marksType === 'percentage' && (
                <div style={S.fieldGroup}>
                  <label style={S.label}>Percentage (%)</label>
                  <input
                    type="number"
                    value={marksValue}
                    onChange={(e) => setMarksValue(e.target.value)}
                    placeholder="e.g. 91.4"
                    min="0"
                    max="100"
                    step="0.01"
                    style={S.input}
                  />
                </div>
              )}

              {marksType === 'cgpa' && (
                <div style={S.fieldGroup}>
                  <label style={S.label}>CGPA (out of 10)</label>
                  <input
                    type="number"
                    value={marksValue}
                    onChange={(e) => setMarksValue(e.target.value)}
                    placeholder="e.g. 9.2"
                    min="0"
                    max="10"
                    step="0.01"
                    style={S.input}
                  />
                  {cgpaPct !== null && (
                    <div style={S.cgpaHint}>
                      <span>✅</span>
                      <span>
                        Equivalent Percentage: <strong>{cgpaPct}%</strong>
                        <span style={{ fontWeight: 400, marginLeft: '6px', color: '#047857' }}>
                          (CGPA × 9.5 formula)
                        </span>
                      </span>
                    </div>
                  )}
                  {marksValue && cgpaPct === null && (
                    <div style={{ ...S.disabledNote, color: '#EF4444' }}>
                      <span>⚠️</span>
                      <span>Enter a valid CGPA between 0 and 10.</span>
                    </div>
                  )}
                </div>
              )}

              {marksType === 'raw' && (
                <div style={S.twoCol}>
                  <div style={S.fieldGroup}>
                    <label style={S.label}>Max Marks</label>
                    <input
                      type="number"
                      value={marksMax}
                      onChange={(e) => setMarksMax(e.target.value)}
                      placeholder="e.g. 500"
                      min="0"
                      style={S.input}
                    />
                  </div>
                  <div style={S.fieldGroup}>
                    <label style={S.label}>Marks Obtained</label>
                    <input
                      type="number"
                      value={marksObtained}
                      onChange={(e) => setMarksObtained(e.target.value)}
                      placeholder="e.g. 456"
                      min="0"
                      max={marksMax || undefined}
                      style={S.input}
                    />
                  </div>
                  {marksMax && marksObtained && (
                    <div style={{ ...S.cgpaHint, gridColumn: '1 / -1' }}>
                      <span>📊</span>
                      <span>
                        Equivalent Percentage:{' '}
                        <strong>
                          {((parseFloat(marksObtained) / parseFloat(marksMax)) * 100).toFixed(2)}%
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ── FOOTER ── */}
        <div style={S.footer}>
          <div style={S.footerLeft}>
            {saved
              ? '✅ Profile saved! Recalculating EX Points...'
              : `Preview: ${previewXp} EX Points`}
          </div>
          <div style={S.footerRight}>
            <button type="button" style={S.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              style={saving || saved ? { ...S.saveBtn, ...S.saveBtnDisabled } : S.saveBtn}
              onClick={handleSave}
              disabled={saving || saved}
            >
              {saved ? '✅ Saved!' : saving ? 'Saving...' : '💾 Save Profile'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
