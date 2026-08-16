// Secret Sharz / VidyaVantage — global location data service
// Source: https://github.com/dr5hn/countries-states-cities-database
// The source database is ODbL licensed. Keep attribution with this module.

export const GLOBAL_LOCATION_SOURCE = Object.freeze({
  repository: 'dr5hn/countries-states-cities-database',
  branch: 'master',
  countries: 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json',
  states: 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/states.json',
  cities: 'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/cities.json',
  licence: 'ODbL',
});

const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000;

async function fetchJson(url, cacheKey) {
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Global location source returned ${response.status}.`);
  const value = await response.json();
  cache.set(cacheKey, { at: Date.now(), value });
  return value;
}

export async function getCountries() {
  return fetchJson(GLOBAL_LOCATION_SOURCE.countries, 'countries');
}

export async function getStates() {
  return fetchJson(GLOBAL_LOCATION_SOURCE.states, 'states');
}

export async function getCities() {
  return fetchJson(GLOBAL_LOCATION_SOURCE.cities, 'cities');
}

export function filterStates(states, countryId) {
  return (Array.isArray(states) ? states : []).filter((state) => String(state.country_id) === String(countryId));
}

export function filterCities(cities, stateId) {
  return (Array.isArray(cities) ? cities : []).filter((city) => String(city.state_id) === String(stateId));
}

export function findCountry(countries, countryId) {
  return (Array.isArray(countries) ? countries : []).find((country) => String(country.id) === String(countryId)) || null;
}

export function findState(states, stateId) {
  return (Array.isArray(states) ? states : []).find((state) => String(state.id) === String(stateId)) || null;
}

export function findCity(cities, cityId) {
  return (Array.isArray(cities) ? cities : []).find((city) => String(city.id) === String(cityId)) || null;
}
