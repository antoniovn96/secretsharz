import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDashboard } from './context/DashboardContext';
import { buildProfileEditorPatch, updateCanonicalStudentProfile } from './platform/canonicalProfileUpdate';
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
import { S } from './components/profile/styles';
import TagInput from './components/profile/TagInput';
import Toggle from './components/profile/Toggle';
import MarksInput from './components/profile/MarksInput';
import EducationTierCard from './components/profile/EducationTierCard';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const TIERED_LEVELS = ['Graduate', 'Post Graduate'];

const emptyTier = () => ({
  schoolName: '',
  marksType: 'percentage',
  marksValue: '',
  marksMax: '',
  marksObtained: '',
  subjects: [],
});

export default function ProfileEditor({ onClose }) {
  const { userProfile, updateUserProfile } = useDashboard();

  const fileInputRef = useRef(null);

  const [profilePicture, setProfilePicture] = useState(userProfile.profilePicture || '');

  const [gender, setGender] = useState(userProfile.gender || '');
  const [fatherName, setFatherName] = useState(userProfile.fatherName || '');
  const [fatherPhone, setFatherPhone] = useState(userProfile.fatherPhone || '');
  const [fatherEmail, setFatherEmail] = useState(userProfile.fatherEmail || '');
  const [motherName, setMotherName] = useState(userProfile.motherName || '');
  const [motherPhone, setMotherPhone] = useState(userProfile.motherPhone || '');
  const [motherEmail, setMotherEmail] = useState(userProfile.motherEmail || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [email, setEmail] = useState(userProfile.email || '');

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

  const edu = userProfile.education || {};
  const [highestLevel, setHighestLevel] = useState(edu.highestLevel || '');
  const [address, setAddress] = useState(edu.address || '');
  const [yearOfPassing, setYearOfPassing] = useState(edu.yearOfPassing || '');
  const [isPursuing, setIsPursuing] = useState(typeof edu.isPursuing === 'boolean' ? edu.isPursuing : true);
  const [electives, setElectives] = useState(Array.isArray(edu.electives) ? edu.electives : []);

  const [tenth, setTenth] = useState({ ...emptyTier(), ...(edu.tenth || {}) });
  const [twelfth, setTwelfth] = useState({ ...emptyTier(), ...(edu.twelfth || {}) });
  const [graduate, setGraduate] = useState({ ...emptyTier(), ...(edu.graduate || {}) });
  const [postGraduate, setPostGraduate] = useState({ ...emptyTier(), ...(edu.postGraduate || {}) });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isTiered = TIERED_LEVELS.includes(highestLevel);
  const showPostGrad = highestLevel === 'Post Graduate';

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64 = evt.target.result;
      setProfilePicture(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const updateTier = (setter) => (patch) => setter((prev) => ({ ...prev, ...patch }));

  const requiresConsent = studentTrack === 'counselling' || studentTrack === 'both';
  const showDisclaimer = requiresConsent;
  const isSaveBlocked = requiresConsent && !counsellingConsentAgreed;

  const handleSave = useCallback(async () => {
    if (isSaveBlocked || saving || saved) return;
    setSaving(true);

    const educationPayload = {
      highestLevel,
      address: address.trim(),
      yearOfPassing: String(yearOfPassing).trim(),
      isPursuing,
      electives: electives.map(String),
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
      schoolName: String(tenth.schoolName || '').trim(),
      subjects: (Array.isArray(tenth.subjects) ? tenth.subjects : []).map(String),
      marksType: String(tenth.marksType || 'percentage'),
      marksValue: String(tenth.marksValue || '').trim(),
    };

    const profilePayload = {
      profilePicture: profilePicture || null,
      gender: String(gender || '').trim(),
      fatherName: String(fatherName || '').trim(),
      fatherPhone: String(fatherPhone || '').trim(),
      fatherEmail: String(fatherEmail || '').trim(),
      motherName: String(motherName || '').trim(),
      motherPhone: String(motherPhone || '').trim(),
      motherEmail: String(motherEmail || '').trim(),
      phone: String(phone || '').trim(),
      email: String(email || '').trim(),
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

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Authenticated student account is required.');

      const canonicalPatch = buildProfileEditorPatch(profilePayload);
      const nextProfile = await updateCanonicalStudentProfile(user, canonicalPatch);

      updateUserProfile(profilePayload);
      setSaved(true);

      // Keep the editor's local view aligned with the server-confirmed canonical profile.
      if (nextProfile?.identity?.profilePicture !== undefined) {
        setProfilePicture(nextProfile.identity.profilePicture || '');
      }

      setTimeout(() => {
        setSaved(false);
        if (onClose) onClose();
      }, 1200);
    } catch (error) {
      console.error('[ProfileEditor] canonical save failed:', error);
      window.alert(error?.message || 'Unable to save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }, [
    isSaveBlocked, saving, saved,
    profilePicture,
    gender, fatherName, fatherPhone, fatherEmail,
    motherName, motherPhone, motherEmail, phone, email,
    studentTrack, counsellingConsentAgreed,
    interests, hobbies, tvShows, movies, games, sports,
    highestLevel, address, yearOfPassing, isPursuing, electives,
    tenth, twelfth, graduate, postGraduate,
    updateUserProfile, onClose,
  ]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const previewXp = (() => {
    let pts = 0;
    if (profilePicture) pts += 50;
    if (interests.length > 0) pts += 30;
    if (hobbies.length > 0) pts += 20;
    if (tvShows.length > 0) pts += 15;
    if (movies.length > 0) pts += 15;
    if (games.length > 0) pts += 15;
    if (sports.length > 0) pts += 15;
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

  return (
    <div style={S.overlay} onClick={(e) => { if (e.target === e.currentTarget && onClose) onClose(); }}>
      <div style={S.modal} role="dialog" aria-modal="true" aria-label="Edit Profile">
        <div style={S.header}>
          <div style={S.headerLeft}>
            <div style={S.headerTitle}>✏️ Edit Your Profile</div>
            <div style={S.headerSub}>Fill in your details to earn EX Points and unlock better recommendations.</div>
          </div>
          <button style={S.closeBtn} onClick={onClose} aria-label="Close editor">×</button>
        </div>

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

        <div style={S.body}>
          <div style={S.section}>
            <div style={S.sectionHeader}>
              <span style={S.sectionIcon}>👤</span>
              <span style={S.sectionTitle}>Personal Details</span>
            </div>
            <div style={S.sectionBody}>
              <div style={S.fieldGroup}>
                <label style={S.label}>Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} style={S.select}>
                  <option value="">— Select Gender —</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div style={S.twoCol}>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Father's Name</label>
                  <input type="text" value={fatherName} onChange={(e) => setFatherName(e.target.value)} placeholder="e.g. Rajesh Kumar" style={S.input} />
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Mother's Name</label>
                  <input type="text" value={motherName} onChange={(e) => setMotherName(e.target.value)} placeholder="e.g. Sunita Devi" style={S.input} />
                </div>
              </div>

              <div style={S.twoCol}>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +91 98765 43210" style={S.input} />
                </div>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. student@email.com" style={S.input} />
                </div>
              </div>
            </div>
          </div>

          {showDisclaimer && (
            <div style={S.section}>
              <div style={S.sectionHeader}>
                <span style={S.sectionIcon}>🛤️</span>
                <span style={S.sectionTitle}>Counselling Consent</span>
              </div>
              <div style={S.sectionBody}>
                <div style={S.disclaimerBox} role="alert" aria-live="polite">
                  <div style={S.disclaimerHeader}><span style={S.disclaimerIcon}>⚠️</span><span style={S.disclaimerTitle}>Important Legal &amp; Medical Disclaimer</span></div>
                  <div style={S.disclaimerBody}>
                    <div style={S.disclaimerPoint}><span style={S.disclaimerBullet}>🔹</span><span><strong>Not a substitute for professional care:</strong> Online guidance and counselling provided through this platform is <strong>NOT</strong> a substitute for professional, in-person psychiatric care or clinical diagnoses. If you are experiencing a mental health crisis, please seek immediate in-person help.</span></div>
                    <div style={S.disclaimerPoint}><span style={S.disclaimerBullet}>🔹</span><span><strong>Confidentiality &amp; Exceptions:</strong> Strict confidentiality will be maintained for all sessions. <strong>However</strong>, confidentiality will be <strong> broken</strong> in cases where there is a risk of <strong>suicide, self-harm, or harm to others</strong>. In such situations, emergency contacts and relevant authorities will be notified immediately.</span></div>
                    <div style={S.disclaimerPoint}><span style={S.disclaimerBullet}>🔹</span><span><strong>Fee Details:</strong> All fee structures are subject to the individual counsellor's terms and conditions. Please confirm fees directly with your assigned counsellor before commencing sessions.</span></div>
                    <div style={S.disclaimerEmergency}>
                      <div style={S.disclaimerEmergencyTitle}>🚨 For Immediate Psychiatric Emergencies, Contact:</div>
                      <div style={S.disclaimerEmergencyItem}>📞 NIMHANS (National Institute of Mental Health and Neurosciences) — 24/7 Helpline: <strong>080-46110007</strong></div>
                      <div style={S.disclaimerEmergencyItem}>🏥 St. John's Medical College Hospital Emergency — Bangalore</div>
                      <div style={S.disclaimerEmergencyItem}>🏥 Fortis Hospital — Emergency Services</div>
                    </div>
                  </div>
                  <label style={S.consentRow}>
                    <input type="checkbox" checked={counsellingConsentAgreed} onChange={(e) => setCounsellingConsentAgreed(e.target.checked)} style={S.consentCheckbox} />
                    <span style={S.consentLabel}>I have read and understood the above disclaimer. I acknowledge that online counselling is not a substitute for in-person psychiatric care, and I consent to the confidentiality policy including its stated exceptions. <strong>(Required to save)</strong></span>
                  </label>
                  {!counsellingConsentAgreed && <div style={{ ...S.disabledNote, color: '#DC2626', fontSize: '12px' }}><span>🔒</span><span>You must tick the consent checkbox above before you can save your profile.</span></div>}
                </div>
              </div>
            </div>
          )}

          <div style={S.section}>
            <div style={S.sectionHeader}><span style={S.sectionIcon}>🎉</span><span style={S.sectionTitle}>Fun &amp; Personality</span></div>
            <div style={S.sectionBody}>
              <div style={S.fieldGroup}>
                <label style={S.label}>Profile Picture (+50 XP)</label>
                <div style={S.picRow}>
                  {profilePicture ? <img src={profilePicture} alt="Profile" style={S.picPreview} onError={() => setProfilePicture('')} /> : <div style={S.picPlaceholder}>👤</div>}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button type="button" style={S.uploadBtn} onClick={() => fileInputRef.current && fileInputRef.current.click()}>📁 Upload Image</button>
                      {profilePicture && <button type="button" style={{ ...S.uploadBtn, color: '#EF4444', borderColor: '#FECDD3' }} onClick={() => setProfilePicture('')}>🗑 Remove</button>}
                    </div>
                    <div style={S.infoNote}>Select a JPG, PNG, GIF, or WebP image from your device. It will be stored as Base64.</div>
                  </div>
                </div>
              </div>

              <TagInput label="Interests (+30 XP)" values={interests} onChange={setInterests} options={INTERESTS} placeholder="e.g. Technology, Music, Art..." />
              <TagInput label="Hobbies (+20 XP)" values={hobbies} onChange={setHobbies} options={HOBBIES} placeholder="e.g. Reading, Sketching, Cooking..." />
              <div style={S.twoCol}>
                <TagInput label="TV Shows (+15 XP)" values={tvShows} onChange={setTvShows} options={TV_SHOWS} placeholder="e.g. Breaking Bad..." />
                <TagInput label="Movies (+15 XP)" values={movies} onChange={setMovies} options={MOVIES} placeholder="e.g. Interstellar..." />
              </div>
              <div style={S.twoCol}>
                <TagInput label="Games (+15 XP)" values={games} onChange={setGames} options={GAMES} placeholder="e.g. Chess, Minecraft..." />
                <TagInput label="Sports (+15 XP)" values={sports} onChange={setSports} options={SPORTS} placeholder="e.g. Cricket, Badminton..." />
              </div>
            </div>
          </div>

          <div style={S.section}>
            <div style={S.sectionHeader}><span style={S.sectionIcon}>🎓</span><span style={S.sectionTitle}>Education</span></div>
            <div style={S.sectionBody}>
              <div style={S.fieldGroup}>
                <label style={S.label}>Highest Level of Education (+100 XP core)</label>
                <select value={highestLevel} onChange={(e) => setHighestLevel(e.target.value)} style={S.select}>
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
                {isTiered && <div style={S.infoNote}>ℹ️ Fill in each education tier below — School Name, Marks, and Subjects for every level.</div>}
              </div>

              {isTiered ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <EducationTierCard icon="📘" title="10th Grade" tierData={tenth} onTierChange={updateTier(setTenth)} options={SCHOOLS} />
                  <EducationTierCard icon="📗" title="12th Grade / PUC" tierData={twelfth} onTierChange={updateTier(setTwelfth)} options={SCHOOLS} />
                  <EducationTierCard icon="📙" title="Graduate (UG)" tierData={graduate} onTierChange={updateTier(setGraduate)} options={COLLEGES} />
                  {showPostGrad && <EducationTierCard icon="📕" title="Post Graduate (PG)" tierData={postGraduate} onTierChange={updateTier(setPostGraduate)} options={COLLEGES} />}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <EducationTierCard icon="🏫" title="Current / Most Recent Institution" tierData={tenth} onTierChange={updateTier(setTenth)} options={SCHOOLS} />
                </div>
              )}

              <div style={S.fieldGroup}>
                <label style={S.label}>School / Institution Address (+10 XP)</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. R.K. Puram, New Delhi" style={S.input} />
              </div>

              <div style={S.twoCol}>
                <div style={S.fieldGroup}>
                  <label style={S.label}>Year of Passing (+10 XP)</label>
                  <input type="number" value={yearOfPassing} onChange={(e) => setYearOfPassing(e.target.value)} placeholder="e.g. 2026" min="2000" max="2040" style={isPursuing ? { ...S.input, ...S.inputDisabled } : S.input} disabled={isPursuing} />
                  {isPursuing && <div style={S.infoNote}>Disabled — currently pursuing</div>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <Toggle label="Currently Pursuing" sublabel="Toggle off if already passed out" checked={isPursuing} onChange={(val) => { setIsPursuing(val); if (val) setYearOfPassing(''); }} />
                </div>
              </div>

              <TagInput label="Electives (+10 XP)" values={electives} onChange={setElectives} placeholder="e.g. Physical Education, Fine Arts..." />
            </div>
          </div>
        </div>

        <div style={S.footer}>
          <div style={S.footerLeft}>{saved ? '✅ Profile saved! Recalculating EX Points...' : `Preview: ${previewXp} EX Points`}</div>
          <div style={S.footerRight}>
            <button type="button" style={S.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="button" style={saving || saved || isSaveBlocked ? { ...S.saveBtn, ...S.saveBtnDisabled } : S.saveBtn} onClick={handleSave} disabled={saving || saved || isSaveBlocked} title={isSaveBlocked ? 'Please agree to the counselling disclaimer first' : undefined}>
              {saved ? '✅ Saved!' : saving ? 'Saving...' : isSaveBlocked ? '🔒 Consent Required' : '💾 Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
