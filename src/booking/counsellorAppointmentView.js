export function buildCounsellorAppointmentView({ appointment, student, prep = null }) {
  return {
    id: appointment?.id || null,
    startAt: appointment?.startAt || null,
    endAt: appointment?.endAt || null,
    status: appointment?.status || 'unknown',
    service: appointment?.service || null,
    student: {
      displayName: student?.displayName || 'Student',
      grade: student?.grade || null,
      institution: student?.institution || null,
    },
    beforeSession: prep ? {
      topics: prep.topicIds || [],
      goals: prep.goalIds || [],
      note: prep.note || '',
      comfort: prep.comfort || null,
    } : null,
    canStart: appointment?.status === 'confirmed',
    canComplete: appointment?.status === 'in_progress',
  };
}
