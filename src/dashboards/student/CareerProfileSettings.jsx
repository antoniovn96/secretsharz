import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

const empty = {
  bio: '',
  headline: '',
  hobbies: [],
  interests: [],
  favouriteSubjects: [],
  careerInterests: [],
  skills: [],
  goals: [],
  school: '',
  grade: '',
  stream: '',
  location: '',
};

const split = (value) => String(value || '').split(',').map(x => x.trim()).filter(Boolean);
const join = (value) => Array.isArray(value) ? value.join(', ') : '';

function normalise(data) {
  const p = data?.careerProfile || {};
  return {
    ...empty,
    ...p,
    hobbies: Array.isArray(p.hobbies) ? p.hobbies : [],
    interests: Array.isArray(p.interests) ? p.interests : [],
    favouriteSubjects: Array.isArray(p.favouriteSubjects) ? p.favouriteSubjects : [],
    careerInterests: Array.isArray(p.careerInterests) ? p.careerInterests : [],
    skills: Array.isArray(p.skills) ? p.skills : [],
    goals: Array.isArray(p.goals) ? p.goals : [],
  };
}

const inputStyle = { width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '12px 13px', border: '1px solid #dbe3ec', borderRadius: 11, fontSize: 14, outline: 'none' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 900, color: '#475569', marginBottom: 16 };
const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, boxShadow: '0 7px 25px rgba(15,23,42,.04)' };

export default function CareerProfileSettings() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => auth.onAuthStateChanged(async activeUser => {
    setUser(activeUser);
    if (!activeUser) { setLoading(false); return; }
    try {
      const snap = await getDoc(doc(db, 'users', activeUser.uid));
      setProfile(normalise(snap.exists() ? snap.data() : null));
    } catch (e) { setError(e?.message || 'Unable to load your profile.'); }
    finally { setLoading(false); }
  }), []);

  const setField = (field, value) => setProfile(p => ({ ...p, [field]: value }));

  const save = async () => {
    if (!user) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const next = { ...profile, updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'users', user.uid), { careerProfile: next }, { merge: true });
      setProfile(next); setMessage('Profile updated successfully.');
    } catch (e) { setError(e?.message || 'Unable to save your profile.'); }
    finally { setSaving(false); }
  };

  const changePhoto = async event => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Please keep the image below 5 MB.'); return; }
    setUploading(true); setError(''); setMessage('');
    try {
      const imageRef = ref(storage, `users/${user.uid}/profile/avatar`);
      await uploadBytes(imageRef, file, { contentType: file.type });
      const url = await getDownloadURL(imageRef);
      await updateProfile(user, { photoURL: url });
      await setDoc(doc(db, 'users', user.uid), { photoURL: url }, { merge: true });
      setUser({ ...auth.currentUser }); setMessage('Profile picture updated.');
    } catch (e) { setError(e?.message || 'Unable to update profile picture.'); }
    finally { setUploading(false); }
  };

  if (loading) return <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', color: '#64748b', fontWeight: 800 }}>Loading your profile…</div>;
  if (!user) return <div style={{ padding: 30 }}>Please sign in to manage your profile.</div>;

  const firstName = (user.displayName || 'Student').trim().split(/\s+/)[0];
  const initial = firstName.charAt(0).toUpperCase() || 'S';

  return <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 28px 60px', color: '#0f172a' }}>
    <div style={{ maxWidth: 1050, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, marginBottom: 18 }}>
        <button onClick={() => window.location.href = '/dashboard/career'} style={{ border: '1px solid #dbe3ec', background: '#fff', borderRadius: 10, padding: '10px 14px', fontWeight: 800, cursor: 'pointer' }}>← Career Home</button>
        <button onClick={save} disabled={saving} style={{ border: 0, background: '#4f46e5', color: '#fff', borderRadius: 10, padding: '11px 17px', fontWeight: 900, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save Changes'}</button>
      </div>

      <section style={{ ...cardStyle, background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: '#fff', display: 'flex', alignItems: 'center', gap: 22 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {user.photoURL ? <img src={user.photoURL} alt="Profile" style={{ width: 92, height: 92, objectFit: 'cover', borderRadius: '50%', border: '4px solid #fff' }} /> : <div style={{ width: 92, height: 92, borderRadius: '50%', border: '4px solid #fff', background: '#e0e7ff', color: '#4338ca', display: 'grid', placeItems: 'center', fontSize: 38, fontWeight: 900 }}>{initial}</div>}
          <label style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: '#fff', color: '#4338ca', borderRadius: 999, padding: '6px 10px', fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>
            {uploading ? 'Uploading…' : 'Change photo'}<input type="file" accept="image/*" onChange={changePhoto} disabled={uploading} style={{ display: 'none' }} />
          </label>
        </div>
        <div><div style={{ color: '#fbbf24', fontSize: 10, fontWeight: 900, letterSpacing: 1.5 }}>PROFILE & SETTINGS</div><h1 style={{ margin: '5px 0', fontSize: 30 }}>Make your profile yours, {firstName}.</h1><p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6 }}>Add the things that make you you. Your career profile can grow as your interests and goals change.</p></div>
      </section>

      {(message || error) && <div style={{ marginTop: 14, padding: 13, borderRadius: 11, background: error ? '#fef2f2' : '#ecfdf5', color: error ? '#991b1b' : '#166534', border: `1px solid ${error ? '#fecaca' : '#bbf7d0'}`, fontWeight: 800 }}>{error || message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr .8fr', gap: 18, marginTop: 18 }}>
        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 5px' }}>About me</h2><p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, marginTop: 0 }}>Think of this like the personal side of a Facebook profile—but designed for a student's growth and career journey.</p>
          <label style={labelStyle}>Headline<input style={inputStyle} value={profile.headline} onChange={e => setField('headline', e.target.value)} placeholder="e.g. Curious student exploring psychology, design and technology" /></label>
          <label style={labelStyle}>About / Bio<textarea rows={5} style={{ ...inputStyle, resize: 'vertical' }} value={profile.bio} onChange={e => setField('bio', e.target.value)} placeholder="Tell us about yourself, what you enjoy and what you are curious about…" /></label>
          <label style={labelStyle}>Hobbies<input style={inputStyle} value={join(profile.hobbies)} onChange={e => setField('hobbies', split(e.target.value))} placeholder="Photography, gaming, music, football, cooking" /></label>
          <label style={labelStyle}>Interests<input style={inputStyle} value={join(profile.interests)} onChange={e => setField('interests', split(e.target.value))} placeholder="Psychology, AI, business, medicine, architecture" /></label>
          <label style={labelStyle}>Career areas I am curious about<input style={inputStyle} value={join(profile.careerInterests)} onChange={e => setField('careerInterests', split(e.target.value))} placeholder="Psychology, UX design, law, engineering" /></label>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 16px' }}>My academic world</h2>
          <label style={labelStyle}>School / Institution<input style={inputStyle} value={profile.school} onChange={e => setField('school', e.target.value)} /></label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><label style={labelStyle}>Grade<input style={inputStyle} value={profile.grade} onChange={e => setField('grade', e.target.value)} /></label><label style={labelStyle}>Stream<input style={inputStyle} value={profile.stream} onChange={e => setField('stream', e.target.value)} /></label></div>
          <label style={labelStyle}>Favourite subjects<input style={inputStyle} value={join(profile.favouriteSubjects)} onChange={e => setField('favouriteSubjects', split(e.target.value))} placeholder="Psychology, Biology, Mathematics" /></label>
          <label style={labelStyle}>Skills I am building<input style={inputStyle} value={join(profile.skills)} onChange={e => setField('skills', split(e.target.value))} placeholder="Communication, coding, leadership" /></label>
          <label style={labelStyle}>Where I am based<input style={inputStyle} value={profile.location} onChange={e => setField('location', e.target.value)} placeholder="City / state" /></label>
        </section>

        <section style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <h2 style={{ margin: '0 0 5px' }}>Goals & aspirations</h2><p style={{ color: '#64748b', fontSize: 13 }}>These are personal context—not test scores. They help future career guidance understand what matters to you right now.</p>
          <label style={labelStyle}>Things I want to achieve<input style={inputStyle} value={join(profile.goals)} onChange={e => setField('goals', split(e.target.value))} placeholder="Get better at public speaking, build a portfolio, explore medicine" /></label>
        </section>
      </div>

      <div style={{ marginTop: 18, padding: 15, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, lineHeight: 1.6 }}><strong style={{ color: '#334155' }}>Privacy note:</strong> Your profile information is separate from counselling and SEN records. Career guidance can use this information as context for your career journey; it does not replace assessment evidence.</div>
    </div>
  </div>;
}
