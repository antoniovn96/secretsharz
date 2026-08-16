export function getProfileIdentity(user, data = {}) {
  const profile = data?.profile || user?.profile || {};
  const careerProfile = data?.careerProfile || {};
  const name = String(
    data?.name ||
    profile?.name ||
    careerProfile?.name ||
    user?.displayName ||
    data?.displayName ||
    'Student'
  ).trim() || 'Student';

  const firstName = name.split(/\s+/)[0] || 'Student';
  const photoURL =
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
