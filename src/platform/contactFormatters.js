export function formatPhone(value, fallback = '') {
  if (!value) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value !== 'object') return fallback;

  return String(
    value.international ||
    [value.callingCode, value.number].filter(Boolean).join(' ') ||
    value.number ||
    ''
  ).trim() || fallback;
}

export function formatLocation(value, fallback = '') {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value !== 'object') return fallback;

  return [
    value.cityName,
    value.stateName,
    value.countryName,
  ].filter(Boolean).join(', ') || fallback;
}

export default {
  formatPhone,
  formatLocation,
};
