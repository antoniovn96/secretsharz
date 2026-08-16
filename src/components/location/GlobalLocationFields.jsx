import React, { useEffect, useState } from 'react';

const empty = { countryId: '', countryName: '', countryIso2: '', stateId: '', stateName: '', stateCode: '', cityId: '', cityName: '', postalCode: '' };

export default function GlobalLocationFields({ value = {}, onChange, required = false }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [error, setError] = useState('');

  const location = { ...empty, ...value };

  useEffect(() => {
    let active = true;
    fetch('/api/location?type=countries')
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load countries.');
        return response.json();
      })
      .then((payload) => { if (active) setCountries(Array.isArray(payload.countries) ? payload.countries : []); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoadingCountries(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!location.countryId) { setStates([]); return undefined; }
    let active = true;
    setLoadingStates(true);
    fetch(`/api/location?type=states&countryId=${encodeURIComponent(location.countryId)}`)
      .then(async (response) => { if (!response.ok) throw new Error('Unable to load states/provinces.'); return response.json(); })
      .then((payload) => { if (active) setStates(Array.isArray(payload.states) ? payload.states : []); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoadingStates(false); });
    return () => { active = false; };
  }, [location.countryId]);

  useEffect(() => {
    if (!location.stateId) { setCities([]); return undefined; }
    let active = true;
    setLoadingCities(true);
    fetch(`/api/location?type=cities&stateId=${encodeURIComponent(location.stateId)}`)
      .then(async (response) => { if (!response.ok) throw new Error('Unable to load cities.'); return response.json(); })
      .then((payload) => { if (active) setCities(Array.isArray(payload.cities) ? payload.cities : []); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoadingCities(false); });
    return () => { active = false; };
  }, [location.stateId]);

  const update = (patch) => onChange?.({ ...location, ...patch });

  const selectCountry = (event) => {
    const country = countries.find((item) => String(item.id) === String(event.target.value));
    update({ countryId: country?.id || '', countryName: country?.name || '', countryIso2: country?.iso2 || '', stateId: '', stateName: '', stateCode: '', cityId: '', cityName: '' });
  };

  const selectState = (event) => {
    const state = states.find((item) => String(item.id) === String(event.target.value));
    update({ stateId: state?.id || '', stateName: state?.name || '', stateCode: state?.iso2 || state?.state_code || '', cityId: '', cityName: '' });
  };

  const selectCity = (event) => {
    const city = cities.find((item) => String(item.id) === String(event.target.value));
    update({ cityId: city?.id || '', cityName: city?.name || '' });
  };

  const field = 'mt-2 w-full rounded-xl border border-gray-300 bg-white p-3';

  return <div className="space-y-4">
    {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">Location data could not be refreshed. You can still enter your postal code manually.</div>}
    <div className="grid md:grid-cols-2 gap-5">
      <label className="block"><span className="font-semibold text-gray-700">Country {required ? '*' : ''}</span><select required={required} value={location.countryId} onChange={selectCountry} disabled={loadingCountries} className={field}><option value="">{loadingCountries ? 'Loading countries…' : 'Select country'}</option>{countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)}</select></label>
      <label className="block"><span className="font-semibold text-gray-700">State / Province / Region</span><select value={location.stateId} onChange={selectState} disabled={!location.countryId || loadingStates} className={field}><option value="">{loadingStates ? 'Loading states…' : location.countryId ? 'Select state / province' : 'Select country first'}</option>{states.map((state) => <option key={state.id} value={state.id}>{state.name}</option>)}</select></label>
      <label className="block"><span className="font-semibold text-gray-700">City</span><select value={location.cityId} onChange={selectCity} disabled={!location.stateId || loadingCities} className={field}><option value="">{loadingCities ? 'Loading cities…' : location.stateId ? 'Select city' : 'Select state first'}</option>{cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}</select></label>
      <label className="block"><span className="font-semibold text-gray-700">Postal / PIN Code</span><input value={location.postalCode} onChange={(event) => update({ postalCode: event.target.value })} className={field} placeholder="Enter postal / PIN code" autoComplete="postal-code" /></label>
    </div>
    <p className="text-xs text-gray-400">Country, state/province and city data are supplied from the Dr5hn Countries States Cities Database. Postal/PIN codes are entered separately because the source does not establish a complete authoritative worldwide postal-code dataset.</p>
  </div>;
}
