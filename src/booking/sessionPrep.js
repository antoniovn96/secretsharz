export const SUPPORT_GOALS = Object.freeze([
  { id: 'talk', label: 'I want to talk', icon: '🗣️' },
  { id: 'advice', label: 'I want advice', icon: '💡' },
  { id: 'understand', label: 'I want to understand what I am feeling', icon: '💭' },
  { id: 'decision', label: 'I need help making a decision', icon: '🧩' },
  { id: 'unsure', label: "I'm not sure yet", icon: '🤷' },
]);

export const SUPPORT_TOPICS = Object.freeze([
  { id: 'mind', label: 'Something on my mind', icon: '💭' },
  { id: 'studies', label: 'School / studies', icon: '📚' },
  { id: 'career', label: 'Career / future', icon: '🧭' },
  { id: 'friendships', label: 'Friendships / relationships', icon: '🫶' },
  { id: 'family', label: 'Family', icon: '🏠' },
  { id: 'emotions', label: 'Stress / emotions', icon: '🌱' },
  { id: 'other', label: 'Something else', icon: '✨' },
]);

export function validateSessionPrep({ topicIds, goalIds, note = '', comfort = null }) {
  if (!Array.isArray(topicIds) || topicIds.length === 0) return { valid: false, error: 'Choose what you would like help with.' };
  if (!Array.isArray(goalIds) || goalIds.length === 0) return { valid: false, error: 'Choose what would help most.' };
  if (typeof note !== 'string' || note.length > 1200) return { valid: false, error: 'Your note must be 1,200 characters or fewer.' };
  if (comfort && !['listen', 'questions', 'plan', 'mix'].includes(comfort)) return { valid: false, error: 'Invalid comfort preference.' };
  return { valid: true };
}

export function buildSessionPrep({ bookingId, personId, topicIds, goalIds, note = '', comfort = null }) {
  const validation = validateSessionPrep({ topicIds, goalIds, note, comfort });
  if (!validation.valid) throw new Error(validation.error);
  if (!bookingId || !personId) throw new Error('Booking and student identity are required.');
  return { bookingId, personId, topicIds, goalIds, note: note.trim(), comfort, createdAt: new Date().toISOString() };
}
