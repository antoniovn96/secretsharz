import React, { useEffect, useMemo, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const emptyProfile = {
  headline: '',
  bio: '',
  location: '',
  phone: '',
  school: '',
  grade: '',
  stream: '',
  interests: [],
  skills: [],
  achievements: [],
  projects: [],
  certifications: [],
  extracurriculars: [],
  education: [],
  portfolioEnabled: false,
  updatedAt: null,
};

const blankItem = {
  title: '',
  description: '',
  organization: '',
  year: '',
  link: '',
};

function normaliseProfile(data) {
  const value = data?.careerProfile || {};
  return {
    ...emptyProfile,
    ...value,
    interests: Array.isArray(value.interests) ? value.interests : [],
    skills: Array.isArray(value.skills) ? value.skills : [],
    achievements: Array.isArray(value.achievements) ? value.achievements : [],
    projects: Array.isArray(value.projects) ? value.projects : [],
    certifications: Array.isArray(value.certifications) ? value.certifications : [],
    extracurriculars: Array.isArray(value.extracurriculars) ? value.extracurriculars : [],
    education: Array.isArray(value.education) ? value.education : [],
  };
}

function splitTags(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinTags(value) {
  return Array.isArray(value) ? value.join(', ') : '';
}

function PrintResume({ user, profile }) {
  const name = user?.displayName || 'Student Name';
  const email = user?.email || '';
  const career = user?.careerAssessment || {};
  const holland = Array.isArray(career.hollandCode) ? career.hollandCode.join('') : (career.hollandCode || '');

  return (
    <div className="resume-sheet" id="resume-print-area">
      <header className="resume-header">
        <div>
          <h1>{name}</h1>
          <p>{profile.headline || 'Student | Career Discovery Portfolio'}</p>
          <div className="resume-contact">{[email, profile.phone, profile.location].filter(Boolean).join('  •  ')}</div>
        </div>
        {user?.photoURL && <img src={user.photoURL} alt="Profile" className="resume-photo" />}
      </header>

      {profile.bio && <section><h2>Profile</h2><p>{profile.bio}</p></section>}
      {(profile.school || profile.grade || profile.stream) && (
        <section><h2>Education</h2><p><strong>{profile.school || 'School'}</strong>{profile.grade ? ` • Grade ${profile.grade}` : ''}{profile.stream ? ` • ${profile.stream}` : ''}</p></section>
      )}
      {profile.education.length > 0 && <section><h2>Education & Learning</h2>{profile.education.map((item, i) => <div className="resume-item" key={i}><strong>{item.title}</strong><span>{item.organization}{item.year ? ` • ${item.year}` : ''}</span><p>{item.description}</p></div>)}</section>}
      {profile.skills.length > 0 && <section><h2>Skills</h2><p>{profile.skills.join(' • ')}</p></section>}
      {profile.projects.length > 0 && <section><h2>Projects</h2>{profile.projects.map((item, i) => <div className="resume-item" key={i}><strong>{item.title}</strong><span>{item.organization}{item.year ? ` • ${item.year}` : ''}</span><p>{item.description}</p>{item.link && <p>{item.link}</p>}</div>)}</section>}
      {profile.achievements.length > 0 && <section><h2>Achievements</h2>{profile.achievements.map((item, i) => <div className="resume-item" key={i}><strong>{item.title}</strong><span>{item.organization}{item.year ? ` • ${item.year}` : ''}</span><p>{item.description}</p></div>)}</section>}
      {profile.certifications.length > 0 && <section><h2>Certifications</h2>{profile.certifications.map((item, i) => <div className="resume-item" key={i}><strong>{item.title}</strong><span>{item.organization}{item.year ? ` • ${item.year}` : ''}</span></div>)}</section>}
      {profile.interests.length > 0 && <section><h2>Interests</h2><p>{profile.interests.join(' • ')}</p></section>}
      {holland && <section><h2>Career Discovery</h2><p>Holland / RIASEC Code: <strong>{holland}</strong></p></section>}
    </div>
  );
}

export default function CareerProfilePortfolio() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(emptyProfile);
  const [tab, setTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (activeUser) => {
      setUser(activeUser);
      if (!activeUser) {
        setLoading(false);
        return;
      }
      try {
        const snapshot = await getDoc(doc(db, 'users', activeUser.uid));
        setProfile(normaliseProfile(snapshot.exists() ? snapshot.data() : null));
      } catch (err) {
        setError(err?.message || 'Unable to load your profile.');
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const updateField = (field, value) => setProfile((current) => ({ ...current, [field]: value }));

  const updateListItem = (field, index, key, value) => {
    setProfile((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
    }));
  };

  const addListItem = (field) => setProfile((current) => ({ ...current, [field]: [...current[field], { ...blankItem }] }));
  const removeListItem = (field, index) => setProfile((current) => ({ ...current, [field]: current[field].filter((_, itemIndex) => itemIndex !== index) }));

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const next = { ...profile, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'users', user.uid), { careerProfile: next }, { merge: true });
      setProfile(next);
      setMessage('Your profile has been saved.');
    } catch (err) {
      setError(err?.message || 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Profile pictures must be under 5 MB.');
      return;
    }
    setUploading(true);
    setError('');
    setMessage('');
    try {
      const imageRef = ref(storage, `users/${user.uid}/profile/avatar`);
      await uploadBytes(imageRef, file, { contentType: file.type });
      const url = await getDownloadURL(imageRef);
      await updateProfile(user, { photoURL: url });
      await setDoc(doc(db, 'users', user.uid), { photoURL: url }, { merge: true });
      setUser({ ...auth.currentUser });
      setMessage('Profile picture updated.');
    } catch (err) {
      setError(err?.message || 'Unable to upload the profile picture.');
    } finally {
      setUploading(false);
    }
  };

  const portfolioSections = useMemo(() => [
    ['projects', 'Projects'],
    ['achievements', 'Achievements'],
    ['certifications', 'Certifications'],
    ['extracurriculars', 'Extracurricular Activities'],
    ['education', 'Education & Learning'],
  ], []);

  if (loading) return <div className="cp-loading">Loading your career profile…</div>;
  if (!user) return <div className="cp-loading"><h2>Please sign in</h2><p>Your student profile is available after you sign in.</p><button onClick={() => window.location.href = '/auth'}>Sign in</button></div>;

  return (
    <div className="cp-page">
      <div className="cp-shell">
        <div className="cp-topbar">
          <button onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/dashboard/career'}>← Back</button>
          <div><strong>VidyaVantage</strong><span>Career Profile Studio</span></div>
          <button className="cp-save" onClick={saveProfile} disabled={saving}>{saving ? 'Saving…' : 'Save Profile'}</button>
        </div>

        <div className="cp-hero">
          <div className="cp-avatar-wrap">
            {user.photoURL ? <img src={user.photoURL} alt="Profile" className="cp-avatar" /> : <div className="cp-avatar cp-initial">{(user.displayName || 'S').trim().charAt(0).toUpperCase()}</div>}
            <label className="cp-photo-button">
              {uploading ? 'Uploading…' : 'Change photo'}
              <input type="file" accept="image/*" onChange={uploadPhoto} disabled={uploading} />
            </label>
          </div>
          <div className="cp-hero-copy">
            <div className="cp-eyebrow">STUDENT PROFILE</div>
            <h1>{user.displayName || 'Your Name'}</h1>
            <p>{profile.headline || 'Build a profile that grows with your career journey.'}</p>
            <div className="cp-meta">{[profile.school, profile.grade && `Grade ${profile.grade}`, profile.stream, user.email].filter(Boolean).join('  •  ')}</div>
          </div>
        </div>

        {(message || error) && <div className={`cp-message ${error ? 'error' : ''}`}>{error || message}</div>}

        <div className="cp-tabs">
          {[
            ['profile', '👤 Profile'],
            ['portfolio', '✨ Portfolio'],
            ['resume', '📄 Resume'],
          ].map(([id, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}
        </div>

        {tab === 'profile' && (
          <div className="cp-grid">
            <section className="cp-card cp-wide">
              <h2>About you</h2>
              <p className="cp-help">This is your student-facing professional introduction. Keep it authentic and age-appropriate.</p>
              <label>Headline<input value={profile.headline} onChange={(e) => updateField('headline', e.target.value)} placeholder="e.g. Curious Grade 11 student exploring psychology and design" /></label>
              <label>About / Bio<textarea rows={5} value={profile.bio} onChange={(e) => updateField('bio', e.target.value)} placeholder="Tell schools, mentors and future opportunities what you care about…" /></label>
              <div className="cp-two"><label>Location<input value={profile.location} onChange={(e) => updateField('location', e.target.value)} /></label><label>Phone<input value={profile.phone} onChange={(e) => updateField('phone', e.target.value)} /></label></div>
            </section>

            <section className="cp-card">
              <h2>Academic profile</h2>
              <label>School / Institution<input value={profile.school} onChange={(e) => updateField('school', e.target.value)} /></label>
              <div className="cp-two"><label>Grade<input value={profile.grade} onChange={(e) => updateField('grade', e.target.value)} /></label><label>Stream<input value={profile.stream} onChange={(e) => updateField('stream', e.target.value)} /></label></div>
              <label>Skills <span className="cp-hint">comma separated</span><input value={joinTags(profile.skills)} onChange={(e) => updateField('skills', splitTags(e.target.value))} placeholder="Communication, Canva, Python, Leadership" /></label>
              <label>Interests <span className="cp-hint">comma separated</span><input value={joinTags(profile.interests)} onChange={(e) => updateField('interests', splitTags(e.target.value))} placeholder="Psychology, Photography, Football" /></label>
            </section>

            <section className="cp-card">
              <h2>Portfolio visibility</h2>
              <p className="cp-help">Keep your portfolio private while building it, or make it available for sharing when you are ready.</p>
              <button className={`cp-toggle ${profile.portfolioEnabled ? 'on' : ''}`} onClick={() => updateField('portfolioEnabled', !profile.portfolioEnabled)}><span />{profile.portfolioEnabled ? 'Portfolio enabled' : 'Portfolio private'}</button>
              <div className="cp-note">We will use this setting for a future shareable portfolio link.</div>
            </section>
          </div>
        )}

        {tab === 'portfolio' && (
          <div className="cp-portfolio-builder">
            <div className="cp-card cp-wide">
              <h2>Your portfolio</h2>
              <p className="cp-help">Add evidence of what you can do—not just what you have studied. Projects, competitions, volunteering and certifications all count.</p>
            </div>
            {portfolioSections.map(([field, title]) => (
              <section className="cp-card cp-list-card" key={field}>
                <div className="cp-section-heading"><div><h2>{title}</h2><p>{field === 'projects' ? 'Showcase work you are proud of.' : 'Add meaningful experiences and evidence.'}</p></div><button onClick={() => addListItem(field)}>+ Add</button></div>
                {profile[field].length === 0 ? <div className="cp-empty">Nothing added yet.</div> : profile[field].map((item, index) => (
                  <div className="cp-item-editor" key={`${field}-${index}`}>
                    <div className="cp-two"><label>Title<input value={item.title} onChange={(e) => updateListItem(field, index, 'title', e.target.value)} /></label><label>Organisation / Institution<input value={item.organization} onChange={(e) => updateListItem(field, index, 'organization', e.target.value)} /></label></div>
                    <div className="cp-two"><label>Year<input value={item.year} onChange={(e) => updateListItem(field, index, 'year', e.target.value)} /></label><label>Link <span className="cp-hint">optional</span><input value={item.link} onChange={(e) => updateListItem(field, index, 'link', e.target.value)} /></label></div>
                    <label>Description<textarea rows={3} value={item.description} onChange={(e) => updateListItem(field, index, 'description', e.target.value)} /></label>
                    <button className="cp-remove" onClick={() => removeListItem(field, index)}>Remove</button>
                  </div>
                ))}
              </section>
            ))}
          </div>
        )}

        {tab === 'resume' && (
          <div className="cp-resume-layout">
            <div className="cp-card cp-resume-tools">
              <h2>Resume Builder</h2>
              <p className="cp-help">Your resume is automatically assembled from your profile and portfolio.</p>
              <button className="cp-primary" onClick={() => window.print()}>🖨️ Download / Save as PDF</button>
              <p className="cp-note">Choose “Save as PDF” in your browser's print dialog. The editing controls will not appear in the PDF.</p>
              <div className="cp-resume-checklist">
                <strong>Resume checklist</strong>
                <span>{profile.bio ? '✓' : '○'} Profile summary</span>
                <span>{profile.skills.length ? '✓' : '○'} Skills</span>
                <span>{profile.projects.length ? '✓' : '○'} Projects</span>
                <span>{profile.achievements.length ? '✓' : '○'} Achievements</span>
                <span>{profile.education.length ? '✓' : '○'} Education</span>
              </div>
            </div>
            <PrintResume user={user} profile={profile} />
          </div>
        )}
      </div>

      <style jsx>{`
        .cp-page{min-height:100vh;background:#f8fafc;color:#0f172a;padding:28px 18px 60px;font-family:Inter,system-ui,sans-serif}.cp-shell{max-width:1180px;margin:auto}.cp-topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}.cp-topbar button{border:1px solid #dbe3ec;background:#fff;border-radius:10px;padding:10px 14px;font-weight:800;color:#475569;cursor:pointer}.cp-topbar>div{display:flex;flex-direction:column;text-align:center}.cp-topbar span{font-size:11px;color:#64748b}.cp-save,.cp-primary{background:#4f46e5!important;color:#fff!important;border-color:#4f46e5!important}.cp-hero{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border-radius:22px;padding:30px;display:flex;gap:24px;align-items:center;box-shadow:0 18px 45px rgba(79,70,229,.2)}.cp-avatar-wrap{position:relative;flex:0 0 auto}.cp-avatar{width:112px;height:112px;border-radius:50%;object-fit:cover;border:5px solid rgba(255,255,255,.9);background:#fff}.cp-initial{display:flex;align-items:center;justify-content:center;background:#fff;color:#4f46e5;font-size:44px;font-weight:900}.cp-photo-button{position:absolute;bottom:-7px;left:50%;transform:translateX(-50%);background:#fff;color:#4338ca;border-radius:999px;padding:7px 11px;font-size:11px;font-weight:900;white-space:nowrap;cursor:pointer;box-shadow:0 5px 18px rgba(0,0,0,.15)}.cp-photo-button input{display:none}.cp-eyebrow{font-size:11px;font-weight:900;letter-spacing:1.5px;opacity:.8}.cp-hero h1{font-size:34px;margin:6px 0}.cp-hero p{margin:0;color:#e0e7ff}.cp-meta{font-size:12px;margin-top:12px;color:#ddd6fe}.cp-message{margin:14px 0;padding:12px 15px;background:#ecfdf5;color:#166534;border:1px solid #bbf7d0;border-radius:12px;font-weight:700}.cp-message.error{background:#fef2f2;color:#991b1b;border-color:#fecaca}.cp-tabs{display:flex;gap:8px;margin:20px 0}.cp-tabs button{border:1px solid #dbe3ec;background:#fff;border-radius:12px;padding:11px 16px;font-weight:900;color:#64748b;cursor:pointer}.cp-tabs button.active{background:#eef2ff;border-color:#c7d2fe;color:#4338ca}.cp-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:18px}.cp-card{background:#fff;border:1px solid #e2e8f0;border-radius:18px;padding:24px;box-shadow:0 7px 25px rgba(15,23,42,.04)}.cp-wide{grid-column:1/-1}.cp-card h2{margin:0 0 6px;font-size:20px}.cp-help{color:#64748b;font-size:13px;line-height:1.6;margin:0 0 18px}.cp-card label{display:block;font-size:12px;font-weight:900;color:#475569;margin:13px 0}.cp-card input,.cp-card textarea{width:100%;margin-top:6px;border:1px solid #dbe3ec;border-radius:10px;padding:11px 12px;font:inherit;font-size:14px;outline:none;background:#fff}.cp-card input:focus,.cp-card textarea:focus{border-color:#818cf8;box-shadow:0 0 0 3px #eef2ff}.cp-two{display:grid;grid-template-columns:1fr 1fr;gap:14px}.cp-hint{font-weight:600;color:#94a3b8}.cp-toggle{display:flex;align-items:center;gap:10px;border:1px solid #dbe3ec;background:#f8fafc;padding:12px 14px;border-radius:12px;font-weight:900;color:#475569;cursor:pointer}.cp-toggle span{width:34px;height:20px;border-radius:999px;background:#cbd5e1;position:relative}.cp-toggle span:after{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;left:2px;top:2px;transition:.2s}.cp-toggle.on{background:#ecfdf5;color:#166534;border-color:#bbf7d0}.cp-toggle.on span{background:#22c55e}.cp-toggle.on span:after{left:16px}.cp-note{font-size:12px;color:#94a3b8;line-height:1.6;margin-top:12px}.cp-portfolio-builder{display:grid;grid-template-columns:1fr;gap:18px}.cp-section-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:20px}.cp-section-heading button,.cp-remove{border:0;background:#eef2ff;color:#4338ca;border-radius:10px;padding:9px 12px;font-weight:900;cursor:pointer}.cp-item-editor{border-top:1px solid #eef2f7;padding-top:10px;margin-top:12px}.cp-remove{background:#fff1f2;color:#be123c;margin-top:5px}.cp-empty{padding:18px;border:1px dashed #cbd5e1;border-radius:12px;color:#94a3b8;font-size:13px}.cp-resume-layout{display:grid;grid-template-columns:300px minmax(0,1fr);gap:20px;align-items:start}.cp-resume-tools{position:sticky;top:20px}.cp-resume-checklist{display:grid;gap:8px;margin-top:22px;padding-top:18px;border-top:1px solid #eef2f7;font-size:13px;color:#475569}.resume-sheet{background:#fff;border:1px solid #dbe3ec;border-radius:8px;padding:44px;min-height:850px;box-shadow:0 12px 35px rgba(15,23,42,.08)}.resume-header{display:flex;justify-content:space-between;gap:24px;border-bottom:2px solid #0f172a;padding-bottom:18px}.resume-header h1{font-size:34px;margin:0}.resume-header p{margin:5px 0;font-size:16px;color:#4f46e5;font-weight:800}.resume-contact{font-size:12px;color:#64748b}.resume-photo{width:80px;height:80px;object-fit:cover;border-radius:50%}.resume-sheet section{margin-top:20px}.resume-sheet h2{font-size:12px;letter-spacing:1.3px;text-transform:uppercase;margin:0 0 7px;color:#4f46e5}.resume-sheet p{font-size:13px;line-height:1.6;margin:0;color:#334155}.resume-item{margin:0 0 12px}.resume-item strong,.resume-item span{display:block}.resume-item strong{font-size:14px}.resume-item span{font-size:11px;color:#64748b;margin:2px 0 4px}@media(max-width:800px){.cp-grid,.cp-resume-layout{grid-template-columns:1fr}.cp-wide{grid-column:auto}.cp-hero{align-items:flex-start}.cp-topbar{flex-wrap:wrap}.cp-resume-tools{position:static}.resume-sheet{padding:25px}.cp-two{grid-template-columns:1fr}}@media print{body{background:#fff}.cp-page{padding:0;background:#fff}.cp-topbar,.cp-hero,.cp-message,.cp-tabs,.cp-resume-tools{display:none!important}.cp-shell{max-width:none}.cp-resume-layout{display:block}.resume-sheet{border:0;box-shadow:none;padding:0;border-radius:0;min-height:0}.resume-sheet h1{font-size:28px}}
      `}</style>
    </div>
  );
}
