import React, { useEffect, useMemo, useState } from 'react';

const BASE = 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master';
const COUNTRIES_URL = `${BASE}/json/countries.json`;
// The database exposes the generated states export at the repository root.
// The previous /json/states.json URL can fail/return an unusable payload in-browser.
const STATES_URL = `${BASE}/states.json`;
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
  return {
    id: String(item.id ?? `${item.state_code || ''}-${item.name || ''}`),
    name: item.name || '',
    stateCode: String(item.state_code || '').toUpperCase(),
    countryCode: String(item.country_code || '').toUpperCase(),
  };
}

export default function GlobalLocationFields({ value = {}, onChange, phone = {}, onPhoneChange }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingCountries(true);
        const data = cache.countries || await getJson(COUNTRIES_URL);
        cache.countries = data;
        if (active) setCountries(toArray(data).map(normaliseCountry).filter(x => x.name).sort((a,b) => a.name.localeCompare(b.name)));
      } catch (e) { if (active) setError('Unable to load country data. You can still enter your postal code manually.'); }
      finally { if (active) setLoadingCountries(false); }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    if (!value.countryCode) { setStates([]); setCities([]); return undefined; }
    (async () => {
      try {
        setLoadingStates(true);
        setError('');
        const data = cache.states || await getJson(STATES_URL);
        cache.states = data;
        const countryIso2 = String(value.countryCode).toUpperCase();
        const selectedCountry = countries.find(c => c.iso2 === countryIso2);
        const selected = toArray(data)
          .map(normaliseState)
          .filter(x => x.countryCode === countryIso2 || (selectedCountry && x.countryId === selectedCountry.id))
          .sort((a,b) => a.name.localeCompare(b.name));
        if (active) setStates(selected);
      } catch (e) {
        if (active) {
          setStates([]);
          setError('Unable to load state/province data right now.');
        }
      }
      finally { if (active) setLoadingStates(false); }
    })();
    return () => { active = false; };
  }, [value.countryCode, countries]);

  useEffect(() => {
    let active = true;
    if (!value.countryCode) { setCities([]); return undefined; }
    const key = String(value.countryCode).toUpperCase();
    (async () => {
      try {
        setLoadingCities(true);
        let data = cache.cities.get(key);
        if (!data) {
          data = await getJson(citiesUrl(key));
          cache.cities.set(key, data);
        }
        const selected = toArray(data)
          .map(normaliseCity)
          .filter(x => !value.stateCode || x.stateCode === String(value.stateCode).toUpperCase())
          .sort((a,b) => a.name.localeCompare(b.name));
        if (active) setCities(selected);
      } catch (e) {
        if (active) {
          setCities([]);
          setError('City data is unavailable for this country at the moment. You can enter the city manually.');
        }
      }
      finally { if (active) setLoadingCities(false); }
    })();
    return () => { active = false; };
  }, [value.countryCode, value.stateCode]);

  const selectedCountry = useMemo(() => countries.find(x => x.iso2 === String(value.countryCode || '').toUpperCase()), [countries, value.countryCode]);
  const update = (patch) => onChange?.({ ...value, ...patch });
  const updatePhone = (patch) => onPhoneChange?.({ ...phone, ...patch });

  return <div style={{ display: 'grid', gap: 14 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 900, color: '#475569' }}>
        Country
        <select value={value.countryCode || ''} onChange={e => { const c = countries.find(x => x.iso2 === e.target.value); update({ countryCode: c?.iso2 || '', countryName: c?.name || '', countryIso3: c?.iso3 || '', stateCode: '', stateName: '', cityName: '', cityId: '' }); }} style={selectStyle} disabled={loadingCountries}>
          <option value="">{loadingCountries ? 'Loading countries…' : 'Select country'}</option>
          {countries.map(c => <option key={c.iso2 || c.id} value={c.iso2}>{c.name}{c.iso2 ? ` (${c.iso2})` : ''}</option>)}
        </select>
      </label>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 900, color: '#475569' }}>
        State / Province / Region
        <select value={value.stateCode || ''} onChange={e => { const s = states.find(x => x.code === e.target.value); update({ stateCode: s?.code || '', stateName: s?.name || '', cityName: '', cityId: '' }); }} style={selectStyle} disabled={!value.countryCode || loadingStates}>
          <option value="">{loadingStates ? 'Loading…' : value.countryCode ? (states.length ? 'Select state / province' : 'No states found') : 'Select country first'}</option>
          {states.map(s => <option key={`${s.countryCode}-${s.code}-${s.id}`} value={s.code}>{s.name}{s.code ? ` (${s.code})` : ''}</option>)}
        </select>
      </label>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 900, color: '#475569' }}>
        City
        <input list="vidyavantage-city-list" value={value.cityName || ''} onChange={e => { const c = cities.find(x => x.name === e.target.value); update({ cityName: e.target.value, cityId: c?.id || '' }); }} placeholder={loadingCities ? 'Loading cities…' : 'Select or type city'} style={inputStyle} />
        <datalist id="vidyavantage-city-list">{cities.map(c => <option key={c.id} value={c.name} />)}</datalist>
      </label>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 900, color: '#475569' }}>
        PIN / Postal Code
        <input value={value.postalCode || ''} onChange={e => update({ postalCode: e.target.value })} placeholder="Enter PIN / postal code" style={inputStyle} inputMode="numeric" autoComplete="postal-code" />
      </label>
    </div>

    <div style={{ paddingTop: 10, borderTop: '1px solid #eef2f7' }}>
      <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: 1.1, color: '#4f46e5', marginBottom: 10 }}>PHONE NUMBER</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px,.55fr) 1fr', gap: 12 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 900, color: '#475569' }}>
          Country & calling code
          <select value={phone.countryCode || value.countryCode || ''} onChange={e => { const c = countries.find(x => x.iso2 === e.target.value); updatePhone({ countryCode: c?.iso2 || '', countryName: c?.name || '', callingCode: c?.phoneCode ? `+${c.phoneCode}` : '' }); }} style={selectStyle} disabled={loadingCountries}>
            <option value="">{loadingCountries ? 'Loading…' : 'Select country'}</option>
            {countries.filter(c => c.phoneCode).map(c => <option key={`phone-${c.iso2}`} value={c.iso2}>+{c.phoneCode} — {c.name}</option>)}
          </select>
        </label>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 900, color: '#475569' }}>
          Phone number
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ ...inputStyle, width: 72, flexShrink: 0, background: '#f8fafc', color: '#334155', fontWeight: 900 }}>{phone.callingCode || (selectedCountry?.phoneCode ? `+${selectedCountry.phoneCode}` : '+')}</div>
            <input value={phone.number || ''} onChange={e => updatePhone({ number: e.target.value, international: `${phone.callingCode || (selectedCountry?.phoneCode ? `+${selectedCountry.phoneCode}` : '')} ${e.target.value}`.trim() })} placeholder="98765 43210" style={{ ...inputStyle, marginTop: 0 }} inputMode="tel" autoComplete="tel-national" />
          </div>
        </label>
      </div>
      <div style={{ marginTop: 8, color: '#64748b', fontSize: 11 }}>Country names and calling codes come from the same global geography source used for your location.</div>
    </div>

    {error && <div style={{ padding: 10, borderRadius: 9, background: '#fff7ed', color: '#9a3412', fontSize: 11, fontWeight: 800 }}>{error}</div>}
    <div style={{ color: '#94a3b8', fontSize: 10, lineHeight: 1.5 }}>Geographic data source: Dr5hn Countries States Cities Database (ODbL). Postal/PIN values are stored as profile data and are not inferred from a city name.</div>
  </div>;
}

const inputStyle = { width: '100%', boxSizing: 'border-box', marginTop: 7, padding: '12px 13px', border: '1px solid #dbe3ec', borderRadius: 11, fontSize: 14, outline: 'none', background: '#fff' };
const selectStyle = { ...inputStyle, cursor: 'pointer' };
