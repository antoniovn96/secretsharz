// Booking is only available inside an authenticated dashboard session.

export function canRequestOneToOne({ isAuthenticated, hasBasicProfile, hasConsent, service }) {
  return Boolean(isAuthenticated && hasBasicProfile && hasConsent && ['counselling', 'sen', 'career'].includes(service));
}

export function missingBookingRequirements({ isAuthenticated, hasBasicProfile, hasConsent }) {
  const missing = [];
  if (!isAuthenticated) missing.push('login');
  if (!hasBasicProfile) missing.push('basic_profile');
  if (!hasConsent) missing.push('service_consent');
  return missing;
}
