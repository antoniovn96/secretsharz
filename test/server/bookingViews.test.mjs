import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStudentBookingView, buildPostSessionNextStep } from '../../src/booking/studentBookingViewModel.js';
import { buildCounsellorAppointmentView } from '../../src/booking/counsellorAppointmentView.js';

test('student sees a simple confirmed appointment card', () => {
  const view = buildStudentBookingView({
    appointment: { status: 'confirmed', service: 'career', startAt: '2026-08-20T10:00:00+05:30', endAt: '2026-08-20T10:50:00+05:30' },
    prep: { note: 'I am unsure which course to choose.' },
    professional: { displayName: 'Career Counsellor' },
  });
  assert.equal(view.title, 'Confirmed');
  assert.equal(view.preparationComplete, true);
  assert.equal(view.primaryAction, 'View session');
});

test('post-session next step changes by service', () => {
  assert.equal(buildPostSessionNextStep({ service: 'career', roadmapAvailable: true }).action, 'View roadmap');
  assert.equal(buildPostSessionNextStep({ service: 'sen' }).action, 'View support plan');
  assert.equal(buildPostSessionNextStep({ service: 'counselling' }).action, 'Open reflection');
});

test('counsellor gets pre-session context but only appointment controls', () => {
  const view = buildCounsellorAppointmentView({
    appointment: { id: 'a1', status: 'confirmed', service: 'counselling', startAt: '2026-08-20T10:00:00+05:30', endAt: '2026-08-20T10:50:00+05:30' },
    student: { displayName: 'Student', grade: '10', institution: 'School' },
    prep: { topicIds: ['studies'], goalIds: ['talk'], note: 'I want to talk about school.', comfort: 'listen' },
  });
  assert.equal(view.canStart, true);
  assert.equal(view.beforeSession.note, 'I want to talk about school.');
  assert.equal(view.canComplete, false);
});
