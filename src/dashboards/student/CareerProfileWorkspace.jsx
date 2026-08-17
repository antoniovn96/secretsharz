import React, { useEffect, useMemo, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import GlobalLocationFields from '../../components/location/GlobalLocationFields';

const empty = {
  bio: '', headline: '', hobbies: [], interests: [], favouriteSubjects: [], careerInterests: [], skills: [], goals: [], school: '', grade: '', stream: '',
  locationData: { countryCode: '', countryName: '', countryIso3: '', stateCode: '', stateName: '', cityId: '', cityName: '', postalCode: '' },
  phone: { countryCode: 'IN', countryName: 'India', callingCode: '+91', number: '', international: '' },
};

const defaultPreferences = { emailUpdates: true, careerReminders: true, profileVisibility: 'private', counsellorContext: true, institutionSharing: false };
const split = value => String(value || '').split(',').map(x => x.trim()).filter(Boolean);
const join = value => Array.isArray(value) ? value.join(', ') : '';
const inputStyle = { width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '12px 13px', border: '1px solid #dbe3ec', borderRadius: 11, fontSize: 14, outline: 'none', background: '#fff' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 900, color: '#475569', marginBottom: 16 };
const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, boxShadow: '0 7px 25px rgba(15,23,42,.04)' };

function Toggle({ checked, onChange, title, description }) {
  return <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 18, padding: '14px 0', borderBottom: '1px solid #eef2f7', cursor: 'pointer' }}>
    <span><strong style={{ display: 'block', fontSize: 13, color: '#334155' }}>{title}</strong><span style={{ display: 'block', marginTop: 3, color: '#64748b', fontSize: 12, lineHeight: 1.5 }}>{description}</span></span>
    <span style={{ width: 46, height: 26, flexShrink: 0, borderRadius: 999, background: checked ? '#4f46e5' : '#cbd5e1', padding: 3 }}>
      <span style={{ display: 'block', width: 20, height: 20, borderRadius: '50%', background: '#fff', transform: checked ? 'translateX(20px)' : 'translateX(0)', transition: 'transform .2s', boxShadow: '0 1px 4px rgba(0,0,0,.18)' }} />
      <input type="checkbox" checked={checked} onChange={onChange} style={{ display: 'none' }} />
    </span>
  </label>;
}

export default function CareerProfileWorkspace({ initialTab = 'profile' }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(empty);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [tab, setTab] = useState(initialTab === 'settings' ? 'settings' : 'profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setTab(initialTab === 'settings' ? 'settings' : 'profile'), [initialTab]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async activeUser => {
      setUser(activeUser);
      if (!activeUser) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, 'users', activeUser.uid));
        const data = snap.exists() ? snap.data() : {};
        const p = data?.careerProfile || {};
        setProfile({ ...empty, ...p, hobbies: Array.isArray(p.hobbies) ? p.hobbies : [], interests: Array.isArray(p.interests) ? p.interests : [], favouriteSubjects: Array.isArray(p.favouriteSubjects) ? p.favouriteSubjects : [], careerInterests: Array.isArray(p.careerInterests) ? p.careerInterests : [], skills: Array.isArray(p.skills) ? p.skills : [], goals: Array.isArray(p.goals) ? p.goals : [], locationData: { ...empty.locationData, ...(p.locationData || {}) }, phone: { ...empty.phone, ...(p.phone || {}) } });
        setPreferences({ ...defaultPreferences, ...(data?.careerProfilePreferences || {}) });
        setDirty(false);
      } catch (e) { setError(e?.message || 'Unable to load your profile.'); }
      finally { setLoading(false); }
    });
    return unsubscribe;
  }, []);

  const setField = (field, value) => { setProfile(p => ({ ...p, [field]: value })); setDirty(true); setMessage(''); };
  const setPreference = (field, value) => { setPreferences(p => ({ ...p, [field]: value })); setDirty(true); setMessage(''); };

  const completion = useMemo(() => {
    const fields = [
      Boolean(profile.headline?.trim()), Boolean(profile.bio?.trim()), profile.hobbies.length > 0, profile.interests.length > 0,
      profile.careerInterests.length > 0, profile.skills.length > 0, profile.favouriteSubjects.length > 0, profile.goals.length > 0,
      Boolean(profile.school?.trim()), Boolean(profile.grade?.trim()), Boolean(profile.stream?.trim())
    ];
    return Math.round(fields.filter(Boolean).length / fields.length * 100);
  }, [profile]);

  const save = async () => {
    if (!user || !dirty) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const locationData = profile.locationData || empty.locationData;
      const next = { ...profile, location: [locationData.cityName, locationData.stateName, locationData.countryName].filter(Boolean).join(', ') || profile.location || '', updatedAt: new Date().toISOString() };
      await setDoc(doc(db, 'users', user.uid), { careerProfile: next, careerProfilePreferences: preferences, location: locationData, phone: next.phone }, { merge: true });
      setProfile(next); setDirty(false); setMessage('Your changes have been saved.');
    } catch (e) { setError(e?.message || 'Unable to save your changes.'); }
    finally { setSaving(false); }
  };

  const changePhoto = async event => {
    const file = event.target.files?.[0]; if (!file || !user) return;
    if (!file.type.startsWith('image/')) { setError('Please select an image.'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Please keep the image below 5 MB.'); return; }
    setUploading(true); setError(''); setMessage('');
    try {
      const imageRef = ref(storage, `users/${user.uid}/profile/avatar`);
      await uploadBytes(imageRef, file, { contentType: file.type });
      const url = await getDownloadURL(imageRef);
      await updateProfile(user, { photoURL: url });
      await setDoc(doc(db, 'users', user.uid), { photoURL: url, profilePicture: url }, { merge: true });
      setUser({ ...auth.currentUser }); setMessage('Profile picture updated across your authorised VidyaVantage views.');
    } catch (e) { setError(e?.message || 'Unable to update profile picture.'); }
    finally { setUploading(false); }
  };

  if (loading) return <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', color: '#64748b', fontWeight: 800 }}>Loading your profile…</div>;
  if (!user) return <div style={{ padding: 30 }}>Please sign in to manage your profile.</div>;

  const firstName = (user.displayName || 'Student').trim().split(/\s+/)[0];
  const initial = firstName.charAt(0).toUpperCase() || 'S';
  const photoURL = user.photoURL || profile.photoURL || '';
  const tabs = [
    ['profile', '👤 My Profile'], ['academic', '🎓 Academic & Interests'], ['location', '📍 Location & Contact'], ['goals', '🎯 Goals'], ['settings', '⚙️ Settings'], ['account', '🔐 Account']
  ];

  const TabButton = ({ id, label }) => <button onClick={() => setTab(id)} style={{ border: 0, borderBottom: tab === id ? '3px solid #4f46e5' : '3px solid transparent', background: 'transparent', padding: '12px 13px', color: tab === id ? '#4338ca' : '#64748b', fontWeight: 900, cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>;

  return <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 28px 60px', color: '#0f172a' }}>
    <div style={{ maxWidth: 1050, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 15, marginBottom: 18, flexWrap: 'wrap' }}>
        <button onClick={() => window.location.href = '/dashboard/career'} style={{ border: '1px solid #dbe3ec', background: '#fff', borderRadius: 10, padding: '10px 14px', fontWeight: 800, cursor: 'pointer' }}>← Career Home</button>
        <button onClick={save} disabled={saving || !dirty} style={{ border: 0, background: dirty ? '#4f46e5' : '#cbd5e1', color: '#fff', borderRadius: 10, padding: '11px 17px', fontWeight: 900, cursor: dirty && !saving ? 'pointer' : 'default' }}>{saving ? 'Saving…' : dirty ? 'Save Changes' : 'All Changes Saved'}</button>
      </div>

      <section style={{ ...cardStyle, background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: '#fff', display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {photoURL ? <img src={photoURL} alt="Profile" style={{ width: 92, height: 92, objectFit: 'cover', borderRadius: '50%', border: '4px solid #fff' }} /> : <div style={{ width: 92, height: 92, borderRadius: '50%', border: '4px solid #fff', background: '#e0e7ff', color: '#4338ca', display: 'grid', placeItems: 'center', fontSize: 38, fontWeight: 900 }}>{initial}</div>}
          <label style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: '#fff', color: '#4338ca', borderRadius: 999, padding: '6px 10px', fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>{uploading ? 'Uploading…' : 'Change photo'}<input type="file" accept="image/*" onChange={changePhoto} disabled={uploading} style={{ display: 'none' }} /></label>
        </div>
        <div style={{ flex: 1, minWidth: 260 }}><div style={{ color: '#fbbf24', fontSize: 10, fontWeight: 900, letterSpacing: 1.5 }}>VIDYAVANTAGE PROFILE</div><h1 style={{ margin: '5px 0', fontSize: 30 }}>Your profile, {firstName}.</h1><p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.6 }}>Keep the personal side of your career journey organised separately from assessments, counselling and SEN records.</p></div>
        <div style={{ minWidth: 180, background: 'rgba(255,255,255,.08)', borderRadius: 14, padding: 15 }}><div style={{ fontSize: 10, fontWeight: 900, color: '#cbd5e1' }}>CAREER PROFILE</div><div style={{ fontSize: 27, fontWeight: 950, marginTop: 3 }}>{completion}%</div><div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>based on useful career information</div><div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,.16)', marginTop: 7 }}><div style={{ width: `${completion}%`, height: '100%', borderRadius: 999, background: '#fbbf24' }} /></div></div>
      </section>

      <div style={{ marginTop: 16, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflowX: 'auto' }}><div style={{ display: 'flex', minWidth: 'max-content', padding: '0 8px' }}>{tabs.map(([id, label]) => <TabButton key={id} id={id} label={label} />)}</div></div>
      {(message || error) && <div style={{ marginTop: 14, padding: 13, borderRadius: 11, background: error ? '#fef2f2' : '#ecfdf5', color: error ? '#991b1b' : '#166534', border: `1px solid ${error ? '#fecaca' : '#bbf7d0'}`, fontWeight: 800 }}>{error || message}</div>}

      <div style={{ marginTop: 18 }}>
        {tab === 'profile' && <section style={cardStyle}><h2 style={{ margin: 0 }}>About me</h2><p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>This is the personal side of your VidyaVantage profile. It helps the platform understand what you enjoy and what you are curious about.</p><label style={labelStyle}>Headline<input style={inputStyle} value={profile.headline} onChange={e => setField('headline', e.target.value)} placeholder="e.g. Curious student exploring psychology, design and technology" /></label><label style={labelStyle}>About / Bio<textarea rows={7} style={{ ...inputStyle, resize: 'vertical' }} value={profile.bio} onChange={e => setField('bio', e.target.value)} placeholder="Tell us about yourself, what you enjoy and what you are curious about…" /></label><label style={labelStyle}>Hobbies<input style={inputStyle} value={join(profile.hobbies)} onChange={e => setField('hobbies', split(e.target.value))} placeholder="Photography, gaming, music, football, cooking" /></label><label style={labelStyle}>Interests<input style={inputStyle} value={join(profile.interests)} onChange={e => setField('interests', split(e.target.value))} placeholder="Psychology, AI, business, medicine, architecture" /></label></section>}

        {tab === 'academic' && <section style={cardStyle}><h2 style={{ margin: 0 }}>Academic & interests</h2><p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>Academic information is kept structured so it can support career guidance without becoming part of your assessment scores.</p><label style={labelStyle}>School / Institution<input style={inputStyle} value={profile.school} onChange={e => setField('school', e.target.value)} placeholder="Your school or institution" /></label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}><label style={labelStyle}>Grade<input style={inputStyle} value={profile.grade} onChange={e => setField('grade', e.target.value)} placeholder="Grade 10" /></label><label style={labelStyle}>Stream<input style={inputStyle} value={profile.stream} onChange={e => setField('stream', e.target.value)} placeholder="Science / Commerce / Humanities" /></label></div><label style={labelStyle}>Favourite subjects<input style={inputStyle} value={join(profile.favouriteSubjects)} onChange={e => setField('favouriteSubjects', split(e.target.value))} placeholder="Psychology, Biology, Mathematics" /></label><label style={labelStyle}>Skills I am building<input style={inputStyle} value={join(profile.skills)} onChange={e => setField('skills', split(e.target.value))} placeholder="Communication, coding, leadership" /></label><label style={labelStyle}>Career areas I am curious about<input style={inputStyle} value={join(profile.careerInterests)} onChange={e => setField('careerInterests', split(e.target.value))} placeholder="Psychology, UX design, law, engineering" /></label></section>}

        {tab === 'location' && <section style={cardStyle}><h2 style={{ margin: 0 }}>Location & contact</h2><p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>Location and contact information are account/profile data. They are not psychometric scores and should not be shared through career assessment results.</p><GlobalLocationFields value={profile.locationData} onChange={value => setField('locationData', value)} phone={profile.phone} onPhoneChange={value => setField('phone', value)} /></section>}

        {tab === 'goals' && <section style={cardStyle}><h2 style={{ margin: 0 }}>Goals & aspirations</h2><p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>These are personal context—not test scores. They help future career guidance understand what matters to you right now.</p><label style={labelStyle}>Things I want to achieve<input style={inputStyle} value={join(profile.goals)} onChange={e => setField('goals', split(e.target.value))} placeholder="Get better at public speaking, build a portfolio, explore medicine" /></label></section>}

        {tab === 'settings' && <section style={cardStyle}><div style={{ color: '#4f46e5', fontSize: 10, fontWeight: 900, letterSpacing: 1.3 }}>SETTINGS</div><h2 style={{ margin: '5px 0 4px' }}>How VidyaVantage works with you</h2><p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>These controls cover optional profile use. Essential safety, account and assessment records continue to follow the platform's privacy rules.</p><Toggle checked={preferences.emailUpdates} onChange={e => setPreference('emailUpdates', e.target.checked)} title="Career updates" description="Receive useful career guidance updates. Essential account and safety messages are always delivered." /><Toggle checked={preferences.careerReminders} onChange={e => setPreference('careerReminders', e.target.checked)} title="Journey reminders" description="Get reminders for unfinished assessments, roadmap actions or reflections." /><Toggle checked={preferences.counsellorContext} onChange={e => setPreference('counsellorContext', e.target.checked)} title="Career counsellor context" description="Allow your assigned career counsellor to use your career profile during career guidance. Private counselling/SEN records are not included." /><Toggle checked={preferences.institutionSharing} onChange={e => setPreference('institutionSharing', e.target.checked)} title="Institution sharing" description="Allow selected career-profile information to be shared with your institution when you participate in an institutional career programme." /><label style={labelStyle}>Who can see my career profile<select style={inputStyle} value={preferences.profileVisibility} onChange={e => setPreference('profileVisibility', e.target.value)}><option value="private">Private — only me and assigned professionals</option><option value="guided">Guided — authorised career guidance staff</option><option value="portfolio">Portfolio — only when I explicitly share it</option></select></label><div style={{ marginTop: 20, padding: 14, borderRadius: 12, background: '#f8fafc', color: '#64748b', fontSize: 12, lineHeight: 1.6 }}><strong style={{ color: '#334155' }}>Privacy boundary:</strong> Your career profile is separate from private counselling conversations, counselling notes, psychological records and SEN records.</div></section>}

        {tab === 'account' && <section style={cardStyle}><div style={{ color: '#64748b', fontSize: 10, fontWeight: 900, letterSpacing: 1.3 }}>ACCOUNT</div><h2 style={{ margin: '5px 0 4px' }}>Account information</h2><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12, marginTop: 15 }}><div style={{ padding: 15, borderRadius: 12, background: '#f8fafc' }}><div style={{ fontSize: 10, color: '#64748b', fontWeight: 900 }}>NAME</div><strong>{user.displayName || firstName}</strong></div><div style={{ padding: 15, borderRadius: 12, background: '#f8fafc' }}><div style={{ fontSize: 10, color: '#64748b', fontWeight: 900 }}>EMAIL</div><strong style={{ wordBreak: 'break-word' }}>{user.email || 'Not available'}</strong></div><div style={{ padding: 15, borderRadius: 12, background: '#f8fafc' }}><div style={{ fontSize: 10, color: '#64748b', fontWeight: 900 }}>PHONE</div><strong>{profile.phone.international || 'Not added'}</strong></div></div><div style={{ marginTop: 18, padding: 14, borderRadius: 12, background: '#f8fafc', color: '#64748b', fontSize: 12 }}>Your full account identity is protected even when client-facing dashboards use only your first name.</div></section>}
      </div>
    </div>
  </div>;
}
