import React, { useEffect, useMemo, useRef, useState } from 'react';
import { validateMobileNumber, normaliseMobileNumber, formatMobileNumber } from '../../platform/contactValidation';

const BASE = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master';
const COUNTRIES_URL = `${BASE}/json/countries.json`;
const STATES_URL = `${BASE}/contributions/states/states.json`;
const citiesUrl = iso2 => `${BASE}/contributions/cities/${encodeURIComponent(String(iso2 || '').toUpperCase())}.json`;

const cache = { countries: null, states: null, cities: new Map() };

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Location data request failed (${response.status}).`);
  return response.json();
}

function toArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.states)) return data.states;
  if (Array.isArray(data?.countries)) return data.countries;
  return [];
}

function normaliseCountry(item) {
  return {
    id: String(item.id ?? item.iso2 ?? item.iso3 ?? item.name),
    iso2: String(item.iso2 || '').toUpperCase(),
    iso3: String(item.iso3 || '').toUpperCase(),
    name: item.name || '',
    phoneCode: String(item.phonecode ?? item.phone_code ?? item.phoneCode ?? '').replace(/^\+/, ''),
  };
}

function normaliseState(item) {
  return {
    id: String(item.id ?? item.state_code ?? item.iso2 ?? item.name),
    code: String(item.state_code || item.stateCode || item.iso2 || '').toUpperCase(),
    name: item.name || '',
    countryCode: String(item.country_code || item.countryCode || '').toUpperCase(),
    countryId: String(item.country_id ?? item.countryId ?? ''),
  };
}

function normaliseCity(item) {
  const name = String(item.name || '').trim();
  const lower = name.toLowerCase();
  const isBengaluru = lower === 'bengaluru' || lower === 'bangalore';
  return {
    id: String(item.id ?? `${item.state_code || item.stateCode || ''}-${name}`),
    name,
    displayName: isBengaluru ? 'Bengaluru (Bangalore)' : name,
    searchNames: isBengaluru ? ['bengaluru', 'bangalore'] : [lower],
    stateCode: String(item.state_code || item.stateCode || '').toUpperCase(),
    stateId: String(item.state_id || item.stateId || ''),
    countryCode: String(item.country_code || item.countryCode || '').toUpperCase(),
  };
}

function CitySearch({ cities, value, onChange, disabled, loading }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const rootRef = useRef(null);

  useEffect(() => setQuery(value || ''), [value]);
  useEffect(() => {
    const handleOutside = event => { if (!rootRef.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = !q ? cities : cities.filter(city => city.searchNames.some(name => name.includes(q)) || city.name.toLowerCase().includes(q));
    return filtered.slice(0, 80);
  }, [cities, query]);

  const choose = city => { setQuery(city.name); setOpen(false); onChange(city); };

  return <div ref={rootRef} style={{ position: 'relative' }}>
    <input value={query} onChange={e => { setQuery(e.target.value); setOpen(true); onChange({ name: e.target.value, id: '' }); }} onFocus={() => setOpen(true)} disabled={disabled} placeholder={loading ? 'Loading cities…' : disabled ? 'Select state first' : 'Search city…'} style={inputStyle} autoComplete="off" />
    {!disabled && <span style={{ position: 'absolute', right: 12, top: 18, color: '#64748b', pointerEvents: 'none', fontSize: 14 }}>⌄</span>}
    {open && !disabled && <div style={{ position: 'absolute', zIndex: 50, left: 0, right: 0, top: 'calc(100% + 5px)', maxHeight: 280, overflowY: 'auto', background: '#fff', border: '1px solid #dbe3ec', borderRadius: 11, boxShadow: '0 12px 30px rgba(15,23,42,.12)' }}>
      {loading && <div style={optionStyle}>Loading cities…</div>}
      {!loading && !matches.length && <div style={optionStyle}>No matching city found. You can still enter the city manually.</div>}
      {!loading && matches.map(city => <button type="button" key={city.id} onMouseDown={e => e.preventDefault()} onClick={() => choose(city)} style={{ ...optionStyle, width: '100%', border: 0, borderBottom: '1px solid #f1f5f9', textAlign: 'left', cursor: 'pointer', background: '#fff' }}><span style={{ fontWeight: 800, color: '#1e293b' }}>{city.displayName}</span>{city.displayName !== city.name && <span style={{ display: 'block', marginTop: 2, fontSize: 10, color: '#94a3b8' }}>Common search name: Bangalore</span>}</button>)}
    </div>}
  </div>;
}

export default function GlobalLocationFields({ value = {}, onChange, phone = {}, onPhoneChange }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState('');
  const phoneValidation = validateMobileNumber(phone.number || '');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingCountries(true);
        const data = cache.countries || await getJson(COUNTRIES_URL);
        cache.countries = data;
        if (active) setCountries(toArray(data).map(normaliseCountry).filter(x => x.name).sort((a,b) => a.name.localeCompare(b.name)));
      } catch (e) { if (active) setError('Unable to load country data.'); }
      finally { if (active) setLoadingCountries(false); }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    if (!value.countryCode) { setStates([]); setCities([]); return undefined; }
    (async () => {
      try {
        setLoadingStates(true); setError('');
        const data = cache.states || await getJson(STATES_URL); cache.states = data;
        const countryIso2 = String(value.countryCode).toUpperCase();
        const selectedCountry = countries.find(c => c.iso2 === countryIso2);
        const selected = toArray(data).map(normaliseState).filter(x => x.countryCode === countryIso2 || (selectedCountry && x.countryId === selectedCountry.id)).sort((a,b) => a.name.localeCompare(b.name));
        if (active) setStates(selected);
      } catch (e) { if (active) { setStates([]); setError('Unable to load state/province data right now.'); } }
      finally { if (active) setLoadingStates(false); }
    })();
    return () => { active = false; };
  }, [value.countryCode, countries]);

  useEffect(() => {
    let active = true;
    if (!value.countryCode || !value.stateCode) { setCities([]); return undefined; }
    const key = String(value.countryCode).toUpperCase();
    (async () => {
      try {
        setLoadingCities(true);
        let data = cache.cities.get(key);
        if (!data) { data = await getJson(citiesUrl(key)); cache.cities.set(key, data); }
        const selected = toArray(data).map(normaliseCity).filter(x => x.stateCode === String(value.stateCode).toUpperCase()).sort((a,b) => a.name.localeCompare(b.name));
        if (active) setCities(selected);
      } catch (e) { if (active) { setCities([]); setError('City data is unavailable for this country at the moment. You can enter the city manually.'); } }
      finally { if (active) setLoadingCities(false); }
    })();
    return () => { active = false; };
  }, [value.countryCode, value.stateCode]);

  const selectedCountry = useMemo(() => countries.find(x => x.iso2 === String(value.countryCode || '').toUpperCase()), [countries, value.countryCode]);
  const update = patch => onChange?.({ ...value, ...patch });
  const updatePhone = patch => onPhoneChange?.({ ...phone, ...patch });

  const handlePhoneInput = event => {
    const number = normaliseMobileNumber(event.target.value).slice(0, 10);
    const callingCode = phone.callingCode || (selectedCountry?.phoneCode ? `+${selectedCountry.phoneCode}` : '');
    updatePhone({ number, international: `${callingCode} ${number}`.trim() });
  };

  return <div style={{ display: 'grid', gap: 14 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <label style={labelStyle}>Country<select value={value.countryCode || ''} onChange={e => { const c = countries.find(x => x.iso2 === e.target.value); update({ countryCode: c?.iso2 || '', countryName: c?.name || '', countryIso3: c?.iso3 || '', stateCode: '', stateName: '', cityName: '', cityId: '', postalCode: '' }); }} style={selectStyle} disabled={loadingCountries}><option value="">{loadingCountries ? 'Loading countries…' : 'Select country'}</option>{countries.map(c => <option key={c.iso2 || c.id} value={c.iso2}>{c.name}{c.iso2 ? ` (${c.iso2})` : ''}</option>)}</select></label>
      <label style={labelStyle}>State / Province / Region<select value={value.stateCode || ''} onChange={e => { const s = states.find(x => x.code === e.target.value); update({ stateCode: s?.code || '', stateName: s?.name || '', cityName: '', cityId: '', postalCode: '' }); }} style={selectStyle} disabled={!value.countryCode || loadingStates}><option value="">{loadingStates ? 'Loading…' : value.countryCode ? (states.length ? 'Select state / province' : 'No states found') : 'Select country first'}</option>{states.map(s => <option key={`${s.countryCode}-${s.code}-${s.id}`} value={s.code}>{s.name}{s.code ? ` (${s.code})` : ''}</option>)}</select></label>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <label style={labelStyle}>City<CitySearch cities={cities} value={value.cityName || ''} disabled={!value.stateCode} loading={loadingCities} onChange={city => update({ cityName: city.name || '', cityId: city.id || '' })} /></label>
      <label style={labelStyle}>PIN / Postal Code<input value={value.postalCode || ''} onChange={e => update({ postalCode: e.target.value.replace(/\s+/g, '').slice(0, 12) })} placeholder="Enter PIN / postal code" style={inputStyle} autoComplete="postal-code" /></label>
    </div>

    <div style={{ paddingTop: 10, borderTop: '1px solid #eef2f7' }}>
      <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: 1.1, color: '#4f46e5', marginBottom: 10 }}>MOBILE NUMBER</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px,.55fr) 1fr', gap: 12 }}>
        <label style={labelStyle}>Country & calling code<select value={phone.countryCode || value.countryCode || ''} onChange={e => { const c = countries.find(x => x.iso2 === e.target.value); updatePhone({ countryCode: c?.iso2 || '', countryName: c?.name || '', callingCode: c?.phoneCode ? `+${c.phoneCode}` : '' }); }} style={selectStyle} disabled={loadingCountries}><option value="">{loadingCountries ? 'Loading…' : 'Select country'}</option>{countries.filter(c => c.phoneCode).map(c => <option key={`phone-${c.iso2}`} value={c.iso2}>{c.name} (+{c.phoneCode})</option>)}</select></label>
        <label style={labelStyle}>Mobile number<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><div style={{ ...inputStyle, width: 94, flexShrink: 0, background: '#f8fafc', color: '#334155', fontWeight: 900, marginTop: 7 }}>{phone.callingCode || (selectedCountry?.phoneCode ? `+${selectedCountry.phoneCode}` : '+')}</div><input value={formatMobileNumber(phone.number || '')} onChange={handlePhoneInput} placeholder="98765 43210" style={{ ...inputStyle, marginTop: 7, borderColor: phone.number && !phoneValidation.valid ? '#fca5a5' : '#dbe3ec' }} inputMode="numeric" autoComplete="tel-national" maxLength={11} /></div>
        {phone.number && <div style={{ marginTop: 5, fontSize: 11, fontWeight: 800, color: phoneValidation.valid ? '#15803d' : '#b91c1c' }}>{phoneValidation.valid ? '✓ Valid 10-digit mobile number' : phoneValidation.message}</div>}
      </label>
      </div>
      <div style={{ marginTop: 8, color: '#64748b', fontSize: 11 }}>Your country and calling code are stored separately from your 10-digit mobile number.</div>
    </div>

    {error && <div style={{ padding: 10, borderRadius: 9, background: '#fff7ed', color: '#9a3412', fontSize: 11, fontWeight: 800 }}>{error}</div>}
    <div style={{ color: '#94a3b8', fontSize: 10, lineHeight: 1.5 }}>Location data is provided using a global geographic database.</div>
  </div>;
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 900, color: '#475569' };
const inputStyle = { width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '12px 13px', border: '1px solid #dbe3ec', borderRadius: 11, fontSize: 14, outline: 'none', background: '#fff' };
const selectStyle = { ...inputStyle, cursor: 'pointer' };
const optionStyle = { padding: '11px 13px', fontSize: 13, color: '#475569' };
