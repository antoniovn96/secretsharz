export const BOOKING_STATUSES = Object.freeze(['held', 'confirmed', 'completed', 'cancelled', 'no_show']);
export const SESSION_TYPES = Object.freeze(['counselling', 'sen', 'career']);

export function buildAvailability({ professionalId, service, timezone = 'Asia/Kolkata', weekday, startTime, endTime, slotMinutes = 50 }) {
  if (!professionalId || !SESSION_TYPES.includes(service) || !timezone || weekday == null || !startTime || !endTime) throw new Error('Invalid availability.');
  if (!Number.isInteger(slotMinutes) || slotMinutes < 15 || slotMinutes > 180) throw new Error('Invalid slot duration.');
  return { professionalId, service, timezone, weekday, startTime, endTime, slotMinutes, active: true };
}

export function buildBooking({ bookingId, studentId, professionalId, service, startAt, endAt, timezone = 'Asia/Kolkata', status = 'held', paymentRequired = true }) {
  if (!bookingId || !studentId || !professionalId || !SESSION_TYPES.includes(service) || !startAt || !endAt) throw new Error('Invalid booking.');
  if (!BOOKING_STATUSES.includes(status)) throw new Error('Invalid booking status.');
  if (new Date(endAt) <= new Date(startAt)) throw new Error('Booking end must be after start.');
  return { bookingId, studentId, professionalId, service, startAt, endAt, timezone, status, paymentRequired };
}

export function canTransitionBooking(status, nextStatus) {
  const transitions = {
    held: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled', 'no_show'],
    completed: [],
    cancelled: [],
    no_show: [],
  };
  return transitions[status]?.includes(nextStatus) || false;
}

export function getBookableSlots({ availability, date, existingBookings = [] }) {
  if (!availability || !date) return [];
  const day = new Date(`${date}T00:00:00`);
  if (Number.isNaN(day.getTime()) || day.getDay() !== availability.weekday) return [];
  const [sh, sm] = availability.startTime.split(':').map(Number);
  const [eh, em] = availability.endTime.split(':').map(Number);
  const cursor = new Date(day); cursor.setHours(sh, sm, 0, 0);
  const end = new Date(day); end.setHours(eh, em, 0, 0);
  const slots = [];
  while (cursor.getTime() + availability.slotMinutes * 60000 <= end.getTime()) {
    const slotStart = new Date(cursor);
    const slotEnd = new Date(cursor.getTime() + availability.slotMinutes * 60000);
    const overlaps = existingBookings.some(booking => booking.status !== 'cancelled' && new Date(booking.startAt) < slotEnd && new Date(booking.endAt) > slotStart);
    if (!overlaps) slots.push({ startAt: slotStart.toISOString(), endAt: slotEnd.toISOString() });
    cursor.setTime(slotEnd.getTime());
  }
  return slots;
}
