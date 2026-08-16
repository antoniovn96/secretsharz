export function getProfileIdentity(user, data = {}) {
  const careerProfile = data?.careerProfile || {};
  const name = String(
    data?.name ||
    careerProfile?.name ||
    user?.displayName ||
    data?.displayName ||
    'Student'
  ).trim() || 'Student';

  const firstName = name.split(/\s+/)[0] || 'Student';
  const photoURL =
    data?.photoURL ||
    data?.profilePicture ||
    careerProfile?.photoURL ||
    careerProfile?.profilePicture ||
    user?.photoURL ||
    '';

  return {
    name,
    firstName,
    photoURL,
    initial: firstName.charAt(0).toUpperCase() || 'S',
    email: data?.email || user?.email || '',
  };
}
