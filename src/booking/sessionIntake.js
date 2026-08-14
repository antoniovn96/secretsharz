// Student-friendly pre-session intake. Keep this short, optional where appropriate,
// and accessible only after authenticated dashboard entry.

export const INTAKE_FIELDS = Object.freeze([
  { id: 'reason', label: 'What would you like help with?', required: true, type: 'choice', options: ['I have something on my mind', 'School / studies', 'Career / future', 'Friendships / relationships', 'Family', 'Stress / emotions', 'Something else'] },
  { id: 'goal', label: 'What would you like from this session?', required: true, type: 'choice', options: ['I want to talk', 'I want advice', 'I want to understand what I am feeling', 'I want help making a decision', 'I am not sure yet'] },
  { id: 'brief', label: 'Anything you would like your counsellor to know beforehand?', required: false, type: 'textarea', maxLength: 1200 },
  { id: 'preferredApproach', label: 'What would make the session feel comfortable?', required: false, type: 'choice', options: ['Just listen first', 'Ask me questions', 'Help me make a plan', 'A mix of these'] },
]);

export function validateSessionIntake(input = {}) {
  const reason = String(input.reason || '').trim();
  const goal = String(input.goal || '').trim();
  const brief = String(input.brief || '').trim();
  if (!reason || !goal) return { valid: false, errors: ['Please choose what you would like help with and what you want from the session.'] };
  if (brief.length > 1200) return { valid: false, errors: ['Your note is a little long. Please keep it under 1200 characters.'] };
  return { valid: true, errors: [] };
}

export function buildSessionIntake({ personId, bookingId, input, submittedAt = new Date().toISOString() }) {
  if (!personId || !bookingId) throw new Error('Authenticated person and booking are required.');
  const validation = validateSessionIntake(input);
  if (!validation.valid) throw new Error(validation.errors[0]);
  return {
    personId,
    bookingId,
    reason: input.reason,
    goal: input.goal,
    brief: String(input.brief || '').trim(),
    preferredApproach: input.preferredApproach || null,
    submittedAt,
  };
}
