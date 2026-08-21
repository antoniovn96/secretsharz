const safeText = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'object') {
    return String(
      value.displayName || value.name || value.label || value.value || value.number || value.international || fallback
    );
  }
  return fallback;
};

export function getProfileIdentity(user, data = {}) {
  const profile = data?.profile || user?.profile || {};
  const careerProfile = data?.careerProfile || {};
  const name = safeText(
    data?.name ||
    profile?.name ||
    careerProfile?.name ||
    user?.displayName ||
    data?.displayName,
    'Student'
  ).trim() || 'Student';

  const firstName = name.split(/\s+/)[0] || 'Student';
  const photoURL = safeText(
    data?.photoURL ||
    data?.profilePicture ||
    data?.avatarUrl ||
    data?.photoUrl ||
    data?.avatar ||
    profile?.photoURL ||
    profile?.profilePicture ||
    profile?.avatarUrl ||
    careerProfile?.photoURL ||
    careerProfile?.profilePicture ||
    user?.photoURL,
    ''
  );

  return {
    name,
    firstName,
    photoURL,
    initial: firstName.charAt(0).toUpperCase() || 'S',
    email: safeText(data?.email || user?.email, ''),
  };
}

export { safeText };
