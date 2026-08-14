export const SESSION_STATES = Object.freeze(['held', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']);

const TRANSITIONS = Object.freeze({
  held: ['confirmed', 'cancelled'],
  confirmed: ['in_progress', 'cancelled', 'no_show'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
  no_show: [],
});

export function canTransition(from, to) {
  return Boolean(TRANSITIONS[from]?.includes(to));
}

export function transitionSession(session, to, actor = 'system') {
  if (!session?.status || !SESSION_STATES.includes(to)) throw new Error('Invalid session state.');
  if (!canTransition(session.status, to)) throw new Error(`Cannot move session from ${session.status} to ${to}.`);
  return { ...session, status: to, updatedAt: new Date().toISOString(), updatedBy: actor };
}

export function buildSessionFollowUp({ sessionId, personId, service, nextStep, counsellorNote = '' }) {
  if (!sessionId || !personId || !service || !nextStep) throw new Error('Session follow-up requires session, student, service and next step.');
  if (typeof counsellorNote !== 'string' || counsellorNote.length > 4000) throw new Error('Follow-up note must be 4,000 characters or fewer.');
  return { sessionId, personId, service, nextStep, counsellorNote: counsellorNote.trim(), createdAt: new Date().toISOString() };
}
