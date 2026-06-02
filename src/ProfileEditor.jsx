import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDashboard } from './context/DashboardContext';
import AutocompleteInput from './components/AutocompleteInput';
import {
  SCHOOLS,
  COLLEGES,
  INTERESTS,
  HOBBIES,
  TV_SHOWS,
  MOVIES,
  GAMES,
  SPORTS,
} from './data/platformData';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// The two "tiered" levels that trigger multi-section education UI
const TIERED_LEVELS = ['Graduate', 'Post Graduate'];

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
  // Sub-section card for each education tier
  tierCard: {
    background: 'white',
    borderRadius: '12px',
    border: '1.5px solid #E1E7EF',
    overflow: 'hidden',
    marginTop: '8px',
  },
  tierCardHeader: {
    padding: '12px 16px',
    background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
    borderBottom: '1px solid #C7D2FE',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tierCardTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '14px',
    fontWeight: '700',
    color: '#3730A3',
  },
  tierCardBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' },
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
    boxSizing: 'border-box',
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
  uploadBtn: {
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
  // ── Disclaimer box styles ──────────────────────────────────────────────────
  disclaimerBox: {
    background: 'linear-gradient(135deg, #FFF1F2, #FEE2E2)',
    border: '2.5px solid #F87171',
    borderRadius: '16px',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  disclaimerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  disclaimerIcon: { fontSize: '24px', flexShrink: 0 },
  disclaimerTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: '16px',
    fontWeight: '900',
    color: '#991B1B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  disclaimerBody: {
    fontSize: '13px',
    color: '#7F1D1D',
    lineHeight: '1.7',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  disclaimerPoint: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
  },
  disclaimerBullet: { flexShrink: 0, marginTop: '2px' },
  disclaimerEmergency: {
    background: '#FEF2F2',
    border: '1.5px solid #FECACA',
    borderRadius: '10px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  disclaimerEmergencyTitle: {
    fontSize: '12px',
    fontWeight: '800',
    color: '#991B1B',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  disclaimerEmergencyItem: {
    fontSize: '13px',
    color: '#7F1D1D',
    fontWeight: '600',
  },
  consentRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    background: 'white',
    border: '2px solid #F87171',
    borderRadius: '10px',
    padding: '12px 16px',
    cursor: 'pointer',
  },
  consentCheckbox: {
    width: '18px',
    height: '18px',
    flexShrink: 0,
    marginTop: '2px',
    accentColor: '#DC2626',
    cursor: 'pointer',
  },
  consentLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#991B1B',
    lineHeight: '1.5',
    cursor: 'pointer',
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
function TagInput({ label, values, onChange, placeholder, disabled, options = [] }) {
  const [inputVal, setInputVal] = useState('');

  const addTag = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    if (!values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInputVal('');
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
                  onClick={() => onChange(values.filter((_, idx) => idx !== i))}
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
          <div style={{ flex: 1 }}>
            <AutocompleteInput
              options={options}
              value={inputVal}
              onChange={setInputVal}
              placeholder={placeholder || `Add ${label.toLowerCase()}...`}
            />
          </div>
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

/**
 * MarksInput — renders the marks format selector + the appropriate input(s)
 * for a single education tier.
 */
function MarksInput({ tierData, onTierChange }) {
  const { marksType, marksValue, marksMax, marksObtained } = tierData;
  const cgpaPct = marksType === 'cgpa' ? cgpaToPercentage(marksValue) : null;

  return (
    <div style={S.fieldGroup}>
      <label style={S.label}>Marks / Grade Format</label>
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
            onClick={() => onTierChange({ marksType: key, marksValue: '', marksMax: '', marksObtained: '' })}
          >
            {label}
          </button>
        ))}
      </div>

      {marksType === 'percentage' && (
        <div style={{ marginTop: '10px' }}>
          <input
            type="number"
            value={marksValue}
            onChange={(e) => onTierChange({ marksValue: e.target.value })}
            placeholder="e.g. 91.4"
            min="0"
            max="100"
            step="0.01"
            style={S.input}
          />
        </div>
      )}

      {marksType === 'cgpa' && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="number"
            value={marksValue}
            onChange={(e) => onTierChange({ marksValue: e.target.value })}
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
        <div style={{ ...S.twoCol, marginTop: '10px' }}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Max Marks</label>
            <input
              type="number"
              value={marksMax}
              onChange={(e) => onTierChange({ marksMax: e.target.value })}
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
              onChange={(e) => onTierChange({ marksObtained: e.target.value })}
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
  );
}

/**
 * EducationTierCard — renders a collapsible card for one education tier
 * (10th, 12th, Graduate, Post Graduate).
 */
function EducationTierCard({ icon, title, tierData, onTierChange, options = [] }) {
  return (
    <div style={S.tierCard}>
      <div style={S.tierCardHeader}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span style={S.tierCardTitle}>{title}</span>
      </div>
      <div style={S.tierCardBody}>
        {/* School Name */}
        <div style={S.fieldGroup}>
          <label style={S.label}>School / Institution Name</label>
          <AutocompleteInput
            options={options}
            value={tierData.schoolName}
            onChange={(val) => onTierChange({ schoolName: val })}
            placeholder="Type 3 letters to search schools/colleges..."
          />
        </div>

        {/* Marks */}
        <MarksInput tierData={tierData} onTierChange={onTierChange} />

        {/* Subjects */}
        <TagInput
          label="Subjects"
          values={Array.isArray(tierData.subjects) ? tierData.subjects : []}
          onChange={(val) => onTierChange({ subjects: val })}
          placeholder="e.g. Physics, Chemistry, Maths..."
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY TIER FACTORY
// ─────────────────────────────────────────────────────────────────────────────
const emptyTier = () => ({
  schoolName: '',
  marksType: 'percentage',
  marksValue: '',
  marksMax: '',
  marksObtained: '',
  subjects: [],
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ProfileEditor({ onClose }) {
  const { userProfile, updateUserProfile } = useDashboard();

  // ── Hidden file input ref ─────────────────────────────────────────────────
  const fileInputRef = useRef(null);

  // ── Local form state ──────────────────────────────────────────────────────
  const [profilePicture, setProfilePicture] = useState(userProfile.profilePicture || '');

  // ── Demographics ──────────────────────────────────────────────────────────
  const [gender, setGender] = useState(userProfile.gender || '');
  const [fatherName, setFatherName] = useState(userProfile.fatherName || '');
  const [fatherPhone, setFatherPhone] = useState(userProfile.fatherPhone || '');
  const [fatherEmail, setFatherEmail] = useState(userProfile.fatherEmail || '');
  const [motherName, setMotherName] = useState(userProfile.motherName || '');
  const [motherPhone, setMotherPhone] = useState(userProfile.motherPhone || '');
  const [motherEmail, setMotherEmail] = useState(userProfile.motherEmail || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [email, setEmail] = useState(userProfile.email || '');

  // ── Track & Consent ───────────────────────────────────────────────────────
  const [studentTrack, setStudentTrack] = useState(userProfile.studentTrack || 'unassigned');
  const [counsellingConsentAgreed, setCounsellingConsentAgreed] = useState(
    typeof userProfile.counsellingConsentAgreed === 'boolean' ? userProfile.counsellingConsentAgreed : false
  );

  const [interests, setInterests] = useState(Array.isArray(userProfile.interests) ? userProfile.interests : []);
  const [hobbies, setHobbies] = useState(Array.isArray(userProfile.hobbies) ? userProfile.hobbies : []);
  const [tvShows, setTvShows] = useState(Array.isArray(userProfile.tvShows) ? userProfile.tvShows : []);
  const [movies, setMovies] = useState(Array.isArray(userProfile.movies) ? userProfile.movies : []);
  const [games, setGames] = useState(Array.isArray(userProfile.games) ? userProfile.games : []);
  const [sports, setSports] = useState(Array.isArray(userProfile.sports) ? userProfile.sports : []);

  // Education — top-level
  const edu = userProfile.education || {};
  const [highestLevel, setHighestLevel] = useState(edu.highestLevel || '');
  const [address, setAddress] = useState(edu.address || '');
  const [yearOfPassing, setYearOfPassing] = useState(edu.yearOfPassing || '');
  const [isPursuing, setIsPursuing] = useState(typeof edu.isPursuing === 'boolean' ? edu.isPursuing : true);
  const [electives, setElectives] = useState(Array.isArray(edu.electives) ? edu.electives : []);

  // Education tiers
  const [tenth, setTenth] = useState({ ...emptyTier(), ...(edu.tenth || {}) });
  const [twelfth, setTwelfth] = useState({ ...emptyTier(), ...(edu.twelfth || {}) });
  const [graduate, setGraduate] = useState({ ...emptyTier(), ...(edu.graduate || {}) });
  const [postGraduate, setPostGraduate] = useState({ ...emptyTier(), ...(edu.postGraduate || {}) });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Derived flags ─────────────────────────────────────────────────────────
  const isTiered = TIERED_LEVELS.includes(highestLevel);
  const showPostGrad = highestLevel === 'Post Graduate';

  // ── Profile picture: FileReader upload ───────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target.result;
      setProfilePicture(base64);
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected if needed
    e.target.value = '';
  };

  // ── Tier updater helpers ──────────────────────────────────────────────────
  const updateTier = (setter) => (patch) => setter((prev) => ({ ...prev, ...patch }));

  // ── Derived: does this track require consent? ─────────────────────────────
  const requiresConsent = studentTrack === 'counselling' || studentTrack === 'both';
  const showDisclaimer = requiresConsent;
  const isSaveBlocked = requiresConsent && !counsellingConsentAgreed;

  // ── Save handler ──────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    setSaving(true);

    // Build the education payload — always include all tiers so context shape is stable
    const educationPayload = {
      highestLevel,
      address: address.trim(),
      yearOfPassing: String(yearOfPassing).trim(),
      isPursuing,
      electives: electives.map(String),

      // Tiers — always serialise as plain objects with primitive values only
      tenth: {
        schoolName: String(tenth.schoolName || '').trim(),
        marksType: String(tenth.marksType || 'percentage'),
        marksValue: String(tenth.marksValue || '').trim(),
        marksMax: String(tenth.marksMax || '').trim(),
        marksObtained: String(tenth.marksObtained || '').trim(),
        subjects: (Array.isArray(tenth.subjects) ? tenth.subjects : []).map(String),
      },
      twelfth: {
        schoolName: String(twelfth.schoolName || '').trim(),
        marksType: String(twelfth.marksType || 'percentage'),
        marksValue: String(twelfth.marksValue || '').trim(),
        marksMax: String(twelfth.marksMax || '').trim(),
        marksObtained: String(twelfth.marksObtained || '').trim(),
        subjects: (Array.isArray(twelfth.subjects) ? twelfth.subjects : []).map(String),
      },
      graduate: {
        schoolName: String(graduate.schoolName || '').trim(),
        marksType: String(graduate.marksType || 'percentage'),
        marksValue: String(graduate.marksValue || '').trim(),
        marksMax: String(graduate.marksMax || '').trim(),
        marksObtained: String(graduate.marksObtained || '').trim(),
        subjects: (Array.isArray(graduate.subjects) ? graduate.subjects : []).map(String),
      },
      postGraduate: {
        schoolName: String(postGraduate.schoolName || '').trim(),
        marksType: String(postGraduate.marksType || 'percentage'),
        marksValue: String(postGraduate.marksValue || '').trim(),
        marksMax: String(postGraduate.marksMax || '').trim(),
        marksObtained: String(postGraduate.marksObtained || '').trim(),
        subjects: (Array.isArray(postGraduate.subjects) ? postGraduate.subjects : []).map(String),
      },

      // Legacy mirror fields for XP calc backward-compat
      schoolName: String(tenth.schoolName || '').trim(),
      subjects: (Array.isArray(tenth.subjects) ? tenth.subjects : []).map(String),
      marksType: String(tenth.marksType || 'percentage'),
      marksValue: String(tenth.marksValue || '').trim(),
    };

    const profilePayload = {
      profilePicture: profilePicture || null,
      // Demographics — all primitives, no objects
      gender: String(gender || '').trim(),
      fatherName: String(fatherName || '').trim(),
      motherName: String(motherName || '').trim(),
      phone: String(phone || '').trim(),
      email: String(email || '').trim(),
      // Track & consent
      studentTrack: String(studentTrack || 'unassigned'),
      counsellingConsentAgreed: Boolean(counsellingConsentAgreed),
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
    profilePicture,
    gender, fatherName, motherName, phone, email,
    studentTrack, counsellingConsentAgreed,
    interests, hobbies, tvShows, movies, games, sports,
    highestLevel, address, yearOfPassing, isPursuing, electives,
    tenth, twelfth, graduate, postGraduate,
    updateUserProfile, onClose,
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
    if (profilePicture) pts += 50;
    if (interests.length > 0) pts += 30;
    if (hobbies.length > 0) pts += 20;
    if (tvShows.length > 0) pts += 15;
    if (movies.length > 0) pts += 15;
    if (games.length > 0) pts += 15;
    if (sports.length > 0) pts += 15;
    // Core education: 10th school name + highestLevel + 10th marks
    const tenthMarksOk = tenth.marksType === 'raw'
      ? (tenth.marksMax.trim() && tenth.marksObtained.trim())
      : String(tenth.marksValue).trim();
    const eduCoreComplete = tenth.schoolName.trim() && highestLevel && tenthMarksOk;
    if (eduCoreComplete) pts += 100;
    if (address.trim()) pts += 10;
    if (String(yearOfPassing).trim()) pts += 10;
    if (tenth.subjects.length > 0) pts += 20;
    if (electives.length > 0) pts += 10;
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
              SECTION 0 — DEMOGRAPHICS
          ════════════════════════════════════════════════════════════════ */}
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>👤</span>
              <span style={S.sectionTitle}>Personal Details</span>
            </div>
            <div style={S.sectionBody}>

              {/* Gender */}
              <div style={S.fieldGroup}>
                <label style={S.label}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={S.select}
                >
                  <option value="">— Select Gender —</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Father & Mother Name */}
              <div style={S.twoCol}>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Father's Name</label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    style={S.input}
                  />
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Mother's Name</label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="e.g. Sunita Devi"
                    style={S.input}
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div style={S.twoCol}>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    style={S.input}
                  />
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@email.com"
                    style={S.input}
                  />
                </div>
              </div>

            </div>
          </div>

      {/* ════════════════════════════════════════════════════════════════
              SECTION 0B — COUNSELLING CONSENT (track set by admin)
          ════════════════════════════════════════════════════════════════ */}
          {showDisclaimer && (
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>🛤️</span>
              <span style={S.sectionTitle}>Counselling Consent</span>
            </div>
            <div style={S.sectionBody}>

              {/* ── CONDITIONAL MEDICAL DISCLAIMER ── */}
              {showDisclaimer && (
                <div style={S.disclaimerBox} role="alert" aria-live="polite">

                  {/* Header */}
                  <div style={S.disclaimerHeader}>
                    <span style={S.disclaimerIcon}>⚠️</span>
                    <span style={S.disclaimerTitle}>Important Legal &amp; Medical Disclaimer</span>
                  </div>

                  {/* Body points */}
                  <div style={S.disclaimerBody}>

                    <div style={S.disclaimerPoint}>
                      <span style={S.disclaimerBullet}>🔹</span>
                      <span>
                        <strong>Not a substitute for professional care:</strong> Online guidance and counselling
                        provided through this platform is <strong>NOT</strong> a substitute for professional,
                        in-person psychiatric care or clinical diagnoses. If you are experiencing a mental health
                        crisis, please seek immediate in-person help.
                      </span>
                    </div>

                    <div style={S.disclaimerPoint}>
                      <span style={S.disclaimerBullet}>🔹</span>
                      <span>
                        <strong>Confidentiality &amp; Exceptions:</strong> Strict confidentiality will be
                        maintained for all sessions. <strong>However</strong>, confidentiality will be
                        <strong> broken</strong> in cases where there is a risk of{' '}
                        <strong>suicide, self-harm, or harm to others</strong>. In such situations, emergency
                        contacts and relevant authorities will be notified immediately.
                      </span>
                    </div>

                    <div style={S.disclaimerPoint}>
                      <span style={S.disclaimerBullet}>🔹</span>
                      <span>
                        <strong>Fee Details:</strong> All fee structures are subject to the individual
                        counsellor's terms and conditions. Please confirm fees directly with your assigned
                        counsellor before commencing sessions.
                      </span>
                    </div>

                    {/* Emergency contacts box */}
                    <div style={S.disclaimerEmergency}>
                      <div style={S.disclaimerEmergencyTitle}>🚨 For Immediate Psychiatric Emergencies, Contact:</div>
                      <div style={S.disclaimerEmergencyItem}>
                        📞 NIMHANS (National Institute of Mental Health and Neurosciences) — 24/7 Helpline:{' '}
                        <strong>080-46110007</strong>
                      </div>
                      <div style={S.disclaimerEmergencyItem}>
                        🏥 St. John's Medical College Hospital Emergency — Bangalore
                      </div>
                      <div style={S.disclaimerEmergencyItem}>
                        🏥 Fortis Hospital — Emergency Services
                      </div>
                    </div>

                  </div>

                  {/* Mandatory consent checkbox */}
                  <label style={S.consentRow}>
                    <input
                      type="checkbox"
                      checked={counsellingConsentAgreed}
                      onChange={(e) => setCounsellingConsentAgreed(e.target.checked)}
                      style={S.consentCheckbox}
                    />
                    <span style={S.consentLabel}>
                      I have read and understood the above disclaimer. I acknowledge that online counselling is
                      not a substitute for in-person psychiatric care, and I consent to the confidentiality
                      policy including its stated exceptions. <strong>(Required to save)</strong>
                    </span>
                  </label>

                  {/* Warning if not yet agreed */}
                  {!counsellingConsentAgreed && (
                    <div style={{ ...S.disabledNote, color: '#DC2626', fontSize: '12px' }}>
                      <span>🔒</span>
                      <span>You must tick the consent checkbox above before you can save your profile.</span>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 1 — FUN & PERSONALITY
          ════════════════════════════════════════════════════════════════ */}
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>🎉</span>
              <span style={S.sectionTitle}>Fun &amp; Personality</span>
            </div>
            <div style={S.sectionBody}>

              {/* ── Profile Picture ── */}
              <div style={S.fieldGroup}>
                <label style={S.label}>Profile Picture (+50 XP)</label>
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
                    {/* Hidden real file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        style={S.uploadBtn}
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      >
                        📁 Upload Image
                      </button>
                      {profilePicture && (
                        <button
                          type="button"
                          style={{ ...S.uploadBtn, color: '#EF4444', borderColor: '#FECDD3' }}
                          onClick={() => setProfilePicture('')}
                        >
                          🗑 Remove
                        </button>
                      )}
                    </div>
                    <div style={S.infoNote}>
                      Select a JPG, PNG, GIF, or WebP image from your device. It will be stored as Base64.
                    </div>
                  </div>
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════════════
              SECTION 1 — FUN & PERSONALITY
          ════════════════════════════════════════════════════════════════ */}
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>🎉</span>
              <span style={S.sectionTitle}>Fun &amp; Personality</span>
            </div>
            <div style={S.sectionBody}>

              {/* ── Profile Picture ── */}
              <div style={S.fieldGroup}>
                <label style={S.label}>Profile Picture (+50 XP)</label>
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
                    {/* Hidden real file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        style={S.uploadBtn}
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      >
                        📁 Upload Image
                      </button>
                      {profilePicture && (
                        <button
                          type="button"
                          style={{ ...S.uploadBtn, color: '#EF4444', borderColor: '#FECDD3' }}
                          onClick={() => setProfilePicture('')}
                        >
                          🗑 Remove
                        </button>
                      )}
                    </div>
                    <div style={S.infoNote}>
                      Select a JPG, PNG, GIF, or WebP image from your device. It will be stored as Base64.
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests */}
              <TagInput
                label="Interests (+30 XP)"
                values={interests}
                onChange={setInterests}
                options={INTERESTS}
                placeholder="e.g. Technology, Music, Art..."
              />

              {/* Hobbies */}
              <TagInput
                label="Hobbies (+20 XP)"
                values={hobbies}
                onChange={setHobbies}
                options={HOBBIES}
                placeholder="e.g. Reading, Sketching, Cooking..."
              />

              <div style={S.twoCol}>
                <TagInput
                  label="TV Shows (+15 XP)"
                  values={tvShows}
                  onChange={setTvShows}
                  options={TV_SHOWS}
                  placeholder="e.g. Breaking Bad..."
                />
                <TagInput
                  label="Movies (+15 XP)"
                  values={movies}
                  onChange={setMovies}
                  options={MOVIES}
                  placeholder="e.g. Interstellar..."
                />
              </div>

              <div style={S.twoCol}>
                <TagInput
                  label="Games (+15 XP)"
                  values={games}
                  onChange={setGames}
                  options={GAMES}
                  placeholder="e.g. Chess, Minecraft..."
                />
                <TagInput
                  label="Sports (+15 XP)"
                  values={sports}
                  onChange={setSports}
                  options={SPORTS}
                  placeholder="e.g. Cricket, Badminton..."
                />
              </div>

            </div>
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

              {/* Highest Level of Education */}
              <div style={S.fieldGroup}>
                <label style={S.label}>Highest Level of Education (+100 XP core)</label>
                <select
                  value={highestLevel}
                  onChange={(e) => setHighestLevel(e.target.value)}
                  style={S.select}
                >
                  <option value="">— Select Level —</option>
                  <option value="8th Grade">8th Grade</option>
                  <option value="9th Grade">9th Grade</option>
                  <option value="10th Grade">10th Grade</option>
                  <option value="11th Grade">11th Grade</option>
                  <option value="12th Grade / PUC">12th Grade / PUC</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Graduate">Graduate (UG)</option>
                  <option value="Post Graduate">Post Graduate (PG)</option>
                  <option value="Doctorate / PhD">Doctorate / PhD</option>
                </select>
                {isTiered && (
                  <div style={S.infoNote}>
                    ℹ️ Fill in each education tier below — School Name, Marks, and Subjects for every level.
                  </div>
                )}
              </div>

              {/* ── TIERED EDUCATION SECTIONS ── */}
              {isTiered ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                  {/* 10th Grade */}
                  <EducationTierCard
                    icon="📘"
                    title="10th Grade"
                    tierData={tenth}
                    onTierChange={updateTier(setTenth)}
                    options={SCHOOLS}
                  />

                  {/* 12th / PUC */}
                  <EducationTierCard
                    icon="📗"
                    title="12th Grade / PUC"
                    tierData={twelfth}
                    onTierChange={updateTier(setTwelfth)}
                    options={SCHOOLS}
                  />

                  {/* Graduate */}
                  <EducationTierCard
                    icon="📙"
                    title="Graduate (UG)"
                    tierData={graduate}
                    onTierChange={updateTier(setGraduate)}
                    options={COLLEGES}
                  />

                  {/* Post Graduate */}
                  {showPostGrad && (
                    <EducationTierCard
                      icon="📕"
                      title="Post Graduate (PG)"
                      tierData={postGraduate}
                      onTierChange={updateTier(setPostGraduate)}
                      options={COLLEGES}
                    />
                  )}

                </div>
              ) : (
                /* ── NON-TIERED: single school / marks block ── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <EducationTierCard
                    icon="🏫"
                    title="Current / Most Recent Institution"
                    tierData={tenth}
                    onTierChange={updateTier(setTenth)}
                    options={SCHOOLS}
                  />
                </div>
              )}

              {/* Address */}
              <div style={S.fieldGroup}>
                <label style={S.label}>School / Institution Address (+10 XP)</label>
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

              {/* Electives */}
              <TagInput
                label="Electives (+10 XP)"
                values={electives}
                onChange={setElectives}
                placeholder="e.g. Physical Education, Fine Arts..."
              />

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
              style={saving || saved || isSaveBlocked ? { ...S.saveBtn, ...S.saveBtnDisabled } : S.saveBtn}
              onClick={handleSave}
              disabled={saving || saved || isSaveBlocked}
              title={isSaveBlocked ? 'Please agree to the counselling disclaimer first' : undefined}
            >
              {saved ? '✅ Saved!' : saving ? 'Saving...' : isSaveBlocked ? '🔒 Consent Required' : '💾 Save Profile'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
