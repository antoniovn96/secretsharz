export function buildStudentBookingView({ appointment, prep = null, professional = null }) {
  if (!appointment) return { state: 'empty', title: 'Ready when you are', action: 'Book a session' };
  const statusLabels = {
    held: 'Almost booked',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'Session missed',
  };
  return {
    state: appointment.status || 'confirmed',
    title: statusLabels[appointment.status] || 'Your session',
    service: appointment.service || null,
    professionalName: professional?.displayName || appointment.professionalName || null,
    startAt: appointment.startAt || null,
    endAt: appointment.endAt || null,
    preparationComplete: Boolean(prep),
    preparationLabel: prep ? 'Your note is ready for your counsellor.' : 'Add a few words before you meet.',
    primaryAction: appointment.status === 'confirmed' ? 'View session' : 'View details',
  };
}

export function buildPostSessionNextStep({ service, roadmapAvailable = false }) {
  if (service === 'career' && roadmapAvailable) return { title: 'Continue your career journey', action: 'View roadmap' };
  if (service === 'sen') return { title: 'View your support plan', action: 'View support plan' };
  if (service === 'counselling') return { title: 'Reflect on your session', action: 'Open reflection' };
  return { title: 'Your next step', action: 'View dashboard' };
}
