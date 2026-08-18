import { auth } from '../firebase';

async function request(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Your professional session has expired. Please sign in again.');
  const token = await user.getIdToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  let body = null;
  try { body = await response.json(); } catch { body = null; }
  if (!response.ok) throw new Error(body?.error || 'Unable to complete the career case request.');
  return body;
}

export function getCareerCase(studentId) {
  return request(`/api/professional/career/case?studentId=${encodeURIComponent(studentId)}`);
}

export function createCareerNote(studentId, note) {
  return request(`/api/professional/career/case?studentId=${encodeURIComponent(studentId)}`, {
    method: 'POST',
    body: JSON.stringify({ action: 'create_note', note }),
  });
}

export function getCareerRoadmaps(studentId) {
  return request(`/api/professional/career/roadmap?studentId=${encodeURIComponent(studentId)}`);
}

export function saveCareerRoadmap(studentId, phases, status = 'Draft') {
  return request(`/api/professional/career/roadmap?studentId=${encodeURIComponent(studentId)}`, {
    method: 'POST',
    body: JSON.stringify({ phases, status }),
  });
}
