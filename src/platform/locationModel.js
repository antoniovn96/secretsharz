// Secret Sharz / VidyaVantage — canonical profile location location contract

export const EMPTY_LOCATION = Object.freeze({
  countryId: '',
  countryName: '',
  countryIso2: '',
  countryCode: '',
  stateId: '',
  stateName: '',
  stateCode: '',
  cityId: '',
  cityName: '',
  postalCode: '',
});

export function normalizeLocation(value = {}) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    countryId: source.countryId == null ? '' : String(source.countryId),
    countryName: String(source.countryName || '').trim(),
    countryIso2: String(source.countryIso2 || '').trim().toUpperCase(),
    countryCode: String(source.countryCode || '').trim(),
    stateId: source.stateId == null ? '' : String(source.stateId),
    stateName: String(source.stateName || '').trim(),
    stateCode: String(source.stateCode || '').trim(),
    cityId: source.cityId == null ? '' : String(source.cityId),
    cityName: String(source.cityName || '').trim(),
    postalCode: String(source.postalCode || '').trim(),
  };
}

export function hasLocation(value = {}) {
  const location = normalizeLocation(value);
  return Boolean(location.countryId || location.countryName || location.cityName || location.postalCode);
}

export function formatLocation(value = {}) {
  const location = normalizeLocation(value);
  return [location.cityName, location.stateName, location.countryName, location.postalCode].filter(Boolean).join(', ');
}

export function formatPhonePrefix(value = {}) {
  const location = normalizeLocation(value);
  return [location.countryCode, location.countryName ? `(${location.countryName})` : ''].filter(Boolean).join(' ');
}
