import { auth } from '../firebase';

async function authenticatedFetch(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('User must be logged in.');
  const token = await user.getIdToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Request failed.');
  return payload;
}

/**
 * Saves a college to the authenticated student's shortlist.
 * Sensitive student aggregate writes are performed by the server.
 */
export const saveCollegeToShortlist = async (currentUser, collegeData, tier) => {
  if (!currentUser || !currentUser.uid) throw new Error('User must be logged in to save colleges.');
  return authenticatedFetch('/api/student/shortlist', {
    method: 'POST',
    body: JSON.stringify({ college: collegeData, tier }),
  });
};

/**
 * Fetches the authenticated professional's authorised caseload through the
 * server-side authorization layer. The API returns a minimal projection.
 */
export const getAssignedStudents = async (counsellorUid, service = 'career') => {
  const user = auth.currentUser;
  if (!user || !counsellorUid) throw new Error('Professional authentication is required.');
  if (user.uid !== counsellorUid) throw new Error('You may only load your own caseload.');
  const payload = await authenticatedFetch(`/api/professional/caseload?service=${encodeURIComponent(service)}`);
  return Array.isArray(payload.students) ? payload.students : [];
};
