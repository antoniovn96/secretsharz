import React, { useEffect, useMemo, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile, signOut } from 'firebase/auth';
import GlobalLocationFields from '../../components/location/GlobalLocationFields';

const empty = {
  bio: '', headline: '', hobbies: [], interests: [], favouriteSubjects: [],
  careerInterests: [], skills: [], goals: [], school: '', grade: '', stream: '', location: '',
  locationData: { countryCode: '', countryName: '', countryIso3: '', stateCode: '', stateName: '', cityId: '', cityName: '', postalCode: '' },
  phone: { countryCode: 'IN', countryName: 'India', callingCode: '+91', number: '', international: '' },
};

const defaultPreferences = {
  emailUpdates: true,
  careerReminders: true,
  profileVisibility: 'private',
  counsellorContext: true,
  institutionSharing: false,
};

const split = value => String(value || '').split(',').map(x => x.trim()).filter(Boolean);
const join = value => Array.isArray(value) ? value.join(', ') : '';

function normalise(data) {
  const p = data?.careerProfile || {};
  const locationData = p.locationData || {};
  const phone = p.phone || {};
  return {
    ...empty, ...p,
    hobbies: Array.isArray(p.hobbies) ? p.hobbies : [],
    interests: Array.isArray(p.interests) ? p.interests : [],
    favouriteSubjects: Array.isArray(p.favouriteSubjects) ? p.favouriteSubjects : [],
    careerInterests: Array.isArray(p.careerInterests) ? p.careerInterests : [],
    skills: Array.isArray(p.skills) ? p.skills : [],
    goals: Array.isArray(p.goals) ? p.goals : [],
    locationData: { ...empty.locationData, ...locationData },
    phone: { ...empty.phone, ...phone },
  };
}

const inputStyle = { width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '12px 13px', border: '1px solid #dbe3ec', borderRadius: 11, fontSize: 14, outline: 'none', background: '#fff' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 900, color: '#475569', marginBottom: 16 };
const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, boxShadow: '0 7px 25px rgba(15,23,42,.04)' };

function Toggle({ checked, onChange, title, description }) {
  return <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, padding: '14px 0', borderBottom: '1px solid #eef2f7', cursor: 'pointer' }}>
    <span><strong style={{ display: 'block', fontSize: 13, color: '#334155' }}>{title}</strong><span style={{ display: 'block', marginTop: 3, color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>{description}</span></span>
    <span style={{ width: 46, height: 26, flexShrink: 0, borderRadius: 999, background: checked ? '#4f46e5' : '#cbd5e1', padding: 3, transition: 'background .2s' }}>
      <span style={{ display: 'block', width: 20, height: 20, borderRadius: '50%', background: '#fff', transform: checked ? 'translateX(20px)' : 'translateX(0)', transition: 'transform .2s', boxShadow: '0 1px 4px rgba(0,0,0,.18)' }} />
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
    </span>
  </label>;
}

export default function CareerProfileSettings() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(empty);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async activeUser => {
      setUser(activeUser);
      if (!activeUser) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, 'users', activeUser.uid));
        const data = snap.exists() ? snap.data() : {};
        setProfile(normalise(data));
        setPreferences({ ...defaultPreferences, ...(data?.careerProfilePreferences || {}) });
      } catch (e) { setError(e?.message || 'Unable to load your profile.'); }
      finally { setLoading(false); }
    });
    return unsubscribe;
  }, []);

  const setField = (field, value) => setProfile(p => ({ ...p, [field]: value }));
  const setPreference = (field, value) => setPreferences(p => ({ ...p, [field]: value }));

  const completion = useMemo(() => {
    const fields = [profile.headline, profile.bio, profile.hobbies.length, profile.interests.length, profile.careerInterests.length, profile.skills.length, profile.favouriteSubjects.length, profile.goals.length, profile.school, profile.grade, profile.stream, profile.locationData.countryCode, profile.phone.number];
    return Math.round(fields.filter(Boolean).length / fields.length * 100);
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const locationData = profile.locationData || empty.locationData;
      const next = {
        ...profile,
        location: [locationData.cityName, locationData.stateName, locationData.countryName].filter(Boolean).join(', ') || profile.location || '',
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', user.uid), {
        careerProfile: next,
        careerProfilePreferences: preferences,
        location: locationData,
        phone: next.phone,
      }, { merge: true });
      setProfile(next);
      setMessage('Your profile, location and phone details have been saved.');
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
      await setDoc(doc(db, 'users', user.uid), { photoURL: url, profilePicture: url }, { merge: true });
      setUser({ ...auth.currentUser }); setMessage('Profile picture updated. It will be used across your authorised VidyaVantage views.');
    } catch (e) { setError(e?.message || 'Unable to update profile picture.'); }
    finally { setUploading(false); }
  };

  const logout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  if (loading) return <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', color: '#64748b', fontWeight: 800 }}>Loading your profile…</div>;
  if (!user) return <div style={{ padding: 30 }}>Please sign in to manage your profile.</div>;

  const firstName = (user.displayName || 'Student').trim().split(/\s+/)[0];
  const initial = firstName.charAt(0).toUpperCase() || 'S';
  const photoURL = user.photoURL || profile.photoURL || '';

  return <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 28px 60px', color: '#0f172a' }}>
    <div style={{ maxWidth: 1050, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, marginBottom: 18 }}>
        <button onClick={() => window.location.href = '/dashboard/career'} style={{ border: '1px solid #dbe3ec', background: '#fff', borderRadius: 10, padding: '10px 14px', fontWeight: 800, cursor: 'pointer' }}>← Career Home</button>
        <button onClick={save} disabled={saving} style={{ border: 0, background: '#4f46e5', color: '#fff', borderRadius: 10, padding: '11px 17px', fontWeight: 900, cursor: 'pointer' }}>{saving ? 'Saving…' : 'Save Changes'}</button>
      </div>

      <section style={{ ...cardStyle, background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: '#fff', display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {photoURL ? <img src={photoURL} alt="Profile" style={{ width: 92, height: 92, objectFit: 'cover', borderRadius: '50%', border: '4px solid #fff' }} /> : <div style={{ width: 92, height: 92, borderRadius: '50%', border: '4px solid #fff', background: '#e0e7ff', color: '#4338ca', display: 'grid', placeItems: 'center', fontSize: 38, fontWeight: 900 }}>{initial}</div>}
          <label style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: '#fff', color: '#4338ca', borderRadius: 999, padding: '6px 10px', fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>
            {uploading ? 'Uploading…' : 'Change photo'}<input type="file" accept="image/*" onChange={changePhoto} disabled={uploading} style={{ display: 'none' }} />
          </label>
        </div>
        <div style={{ flex: 1, minWidth: 260 }}><div style={{ color: '#fbbf24', fontSize: 10, fontWeight: 900, letterSpacing: 1.5 }}>PROFILE & SETTINGS</div><h1 style={{ margin: '5px 0', fontSize: 30 }}>Make your profile yours, {firstName}.</h1><p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6 }}>Your profile is the personal layer of VidyaVantage. It can change as you discover more about yourself.</p></div>
        <div style={{ minWidth: 180, background: 'rgba(255,255,255,.08)', borderRadius: 14, padding: 15 }}><div style={{ fontSize: 10, fontWeight: 900, color: '#cbd5e1' }}>PROFILE COMPLETION</div><div style={{ fontSize: 27, fontWeight: 950, marginTop: 3 }}>{completion}%</div><div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,.16)', marginTop: 7 }}><div style={{ width: `${completion}%`, height: '100%', borderRadius: 999, background: '#fbbf24' }} /></div></div>
      </section>

      {(message || error) && <div style={{ marginTop: 14, padding: 13, borderRadius: 11, background: error ? '#fef2f2' : '#ecfdf5', color: error ? '#991b1b' : '#166534', border: `1px solid ${error ? '#fecaca' : '#bbf7d0'}`, fontWeight: 800 }}>{error || message}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 18, marginTop: 18 }}>
        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 5px' }}>About me</h2><p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, marginTop: 0 }}>Think of this as the personal side of a social profile—but built around your growth, interests and career journey.</p>
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
        </section>

        <section style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <h2 style={{ margin: '0 0 5px' }}>Where I am based & how to reach me</h2>
          <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, marginTop: 0 }}>Choose your location from the global database. Your phone country and calling code are stored separately so your contact details remain internationally usable.</p>
          <GlobalLocationFields value={profile.locationData} onChange={value => setField('locationData', value)} phone={profile.phone} onPhoneChange={value => setField('phone', value)} />
        </section>

        <section style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <h2 style={{ margin: '0 0 5px' }}>Goals & aspirations</h2><p style={{ color: '#64748b', fontSize: 13 }}>These are personal context—not test scores. They help future career guidance understand what matters to you right now.</p>
          <label style={labelStyle}>Things I want to achieve<input style={inputStyle} value={join(profile.goals)} onChange={e => setField('goals', split(e.target.value))} placeholder="Get better at public speaking, build a portfolio, explore medicine" /></label>
        </section>

        <section style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <div style={{ color: '#4f46e5', fontSize: 10, fontWeight: 900, letterSpacing: 1.3 }}>YOUR PREFERENCES</div>
          <h2 style={{ margin: '5px 0 4px' }}>How VidyaVantage works with you</h2>
          <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>You control the non-essential ways your profile is used. Core safety, account and assessment records remain governed by the platform's privacy rules.</p>
          <Toggle checked={preferences.emailUpdates} onChange={e => setPreference('emailUpdates', e.target.checked)} title="Career updates" description="Receive useful career guidance updates and important account messages." />
          <Toggle checked={preferences.careerReminders} onChange={e => setPreference('careerReminders', e.target.checked)} title="Journey reminders" description="Get reminders when you have an unfinished assessment, roadmap action or reflection." />
          <Toggle checked={preferences.counsellorContext} onChange={e => setPreference('counsellorContext', e.target.checked)} title="Allow career counsellor context" description="Allow an assigned career counsellor to use your career profile as context during career guidance." />
          <Toggle checked={preferences.institutionSharing} onChange={e => setPreference('institutionSharing', e.target.checked)} title="Allow institution sharing" description="Allow selected career-profile information to be shared with your institution when an institutional programme explicitly requires it." />
          <div style={{ marginTop: 18 }}><label style={labelStyle}>Profile visibility<select style={inputStyle} value={preferences.profileVisibility} onChange={e => setPreference('profileVisibility', e.target.value)}><option value="private">Private — only me and authorised professionals</option><option value="guided">Guided — available to authorised career guidance staff</option><option value="portfolio">Portfolio — may be used when I explicitly share my portfolio</option></select></label></div>
        </section>

        <section style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <div style={{ color: '#64748b', fontSize: 10, fontWeight: 900, letterSpacing: 1.3 }}>ACCOUNT</div>
          <h2 style={{ margin: '5px 0 4px' }}>Account information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12, marginTop: 15 }}>
            <div style={{ padding: 15, borderRadius: 12, background: '#f8fafc' }}><div style={{ fontSize: 10, color: '#64748b', fontWeight: 900 }}>NAME</div><strong>{user.displayName || firstName}</strong></div>
            <div style={{ padding: 15, borderRadius: 12, background: '#f8fafc' }}><div style={{ fontSize: 10, color: '#64748b', fontWeight: 900 }}>EMAIL</div><strong style={{ wordBreak: 'break-word' }}>{user.email || 'Not available'}</strong></div>
            <div style={{ padding: 15, borderRadius: 12, background: '#f8fafc' }}><div style={{ fontSize: 10, color: '#64748b', fontWeight: 900 }}>PHONE</div><strong>{profile.phone.international || 'Not added'}</strong></div>
          </div>
          <button onClick={logout} style={{ marginTop: 16, border: '1px solid #fecaca', background: '#fff', color: '#991b1b', borderRadius: 10, padding: '10px 14px', fontWeight: 900, cursor: 'pointer' }}>Sign out</button>
        </section>
      </div>

      <div style={{ marginTop: 18, padding: 15, borderRadius: 12, background: '#fff', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 12, lineHeight: 1.6 }}><strong style={{ color: '#334155' }}>Privacy note:</strong> Your profile information is separate from counselling and SEN records. Career guidance can use this information as context for your career journey; it does not replace assessment evidence. Your full name and account identity remain protected even when the client-facing dashboard uses only your first name.</div>
    </div>
  </div>;
}
