import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAvailability, buildBooking, canTransitionBooking, getBookableSlots } from '../../src/booking/bookingModel.js';

test('availability creates valid India-time service schedules', () => {
  const availability = buildAvailability({ professionalId: 'pro1', service: 'counselling', weekday: 5, startTime: '16:00', endTime: '18:00' });
  assert.equal(availability.timezone, 'Asia/Kolkata');
  assert.equal(availability.slotMinutes, 50);
});

test('booking state transitions prevent invalid changes', () => {
  assert.equal(canTransitionBooking('held', 'confirmed'), true);
  assert.equal(canTransitionBooking('completed', 'cancelled'), false);
});

test('available slots exclude overlapping bookings', () => {
  const availability = buildAvailability({ professionalId: 'pro1', service: 'counselling', weekday: 5, startTime: '16:00', endTime: '18:00', slotMinutes: 50 });
  const slots = getBookableSlots({ availability, date: '2026-08-14', existingBookings: [{ startAt: '2026-08-14T10:50:00.000Z', endAt: '2026-08-14T11:40:00.000Z', status: 'confirmed' }] });
  assert.equal(slots.length, 2);
});

test('booking rejects inverted times', () => {
  assert.throws(() => buildBooking({ bookingId: 'b1', studentId: 's1', professionalId: 'p1', service: 'career', startAt: '2026-08-14T18:00:00Z', endAt: '2026-08-14T17:00:00Z' }));
});
