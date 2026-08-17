import React, { useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { navigateCareer } from './CareerWorkspaceShell';

function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function dateKey(date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function parseDate(value) { if (!value) return null; const date = new Date(`${value}T12:00:00`); return Number.isNaN(date.getTime()) ? null : date; }
function monthName(date) { return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }); }
function birthdayDateForYear(dob, year) { const date = parseDate(dob); return date ? new Date(year, date.getMonth(), date.getDate()) : null; }
function sameMonthDay(a, b) { return Boolean(a && b && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()); }

export default function CareerDashboardCalendar({ user, firstName = 'Student', theme = 'light' }) {
  const today = useMemo(() => new Date(), []);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(today));
  const [selectedDate, setSelectedDate] = useState(today);
  const [profile, setProfile] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [reminderText, setReminderText] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const dark = theme === 'dark';
  const colors = { surface: dark ? '#111827' : '#ffffff', surface2: dark ? '#1f2937' : '#f8fafc', text: dark ? '#f8fafc' : '#0f172a', muted: dark ? '#cbd5e1' : '#64748b', border: dark ? '#475569' : '#dbe4ef', accent: '#4f46e5', accentSoft: dark ? '#312e81' : '#eef2ff', today: '#f59e0b' };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user?.uid) return;
      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (cancelled || !snapshot.exists()) return;
        const data = snapshot.data() || {};
        setProfile(data);
        setReminders(Array.isArray(data.careerCalendar?.reminders) ? data.careerCalendar.reminders : []);
      } catch (_) {}
    }
    load();
    return () => { cancelled = true; };
  }, [user?.uid]);

  const dob = profile?.dob || profile?.dateOfBirth || profile?.dateOfBirthISO || '';
  const birthdayThisYear = birthdayDateForYear(dob, visibleMonth.getFullYear());
  const birthdayToday = sameMonthDay(parseDate(dob), today);
  const days = useMemo(() => {
    const first = startOfMonth(visibleMonth);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    return Array.from({ length: 42 }, (_, index) => { const day = new Date(start); day.setDate(start.getDate() + index); return day; });
  }, [visibleMonth]);
  const remindersByDate = useMemo(() => reminders.reduce((map, reminder) => { if (!map[reminder.date]) map[reminder.date] = []; map[reminder.date].push(reminder); return map; }, {}), [reminders]);
  const selectedKey = dateKey(selectedDate);
  const selectedReminders = remindersByDate[selectedKey] || [];
  const selectedBirthday = birthdayThisYear && dateKey(birthdayThisYear) === selectedKey;

  async function addReminder() {
    const text = reminderText.trim();
    if (!user?.uid || !text) return;
    setSaving(true); setMessage('');
    try {
      const next = [...reminders, { id: `reminder_${Date.now()}`, date: selectedKey, text, createdAt: new Date().toISOString() }].slice(-100);
      await setDoc(doc(db, 'users', user.uid), { careerCalendar: { reminders: next, updatedAt: new Date().toISOString() } }, { merge: true });
      setReminders(next); setReminderText(''); setShowReminderForm(false); setMessage('Reminder saved.');
    } catch (error) { setMessage(error?.message || 'Unable to save reminder.'); }
    finally { setSaving(false); }
  }

  async function removeReminder(id) {
    if (!user?.uid) return;
    const next = reminders.filter(reminder => reminder.id !== id);
    try {
      await setDoc(doc(db, 'users', user.uid), { careerCalendar: { reminders: next, updatedAt: new Date().toISOString() } }, { merge: true });
      setReminders(next);
    } catch (error) { setMessage(error?.message || 'Unable to remove reminder.'); }
  }

  return (
    <aside aria-label="Calendar and upcoming dates" style={{ width: '100%' }}>
      <section style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: 18, padding: 18, color: colors.text, boxShadow: '0 10px 30px rgba(15,23,42,.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 14 }}>
          <div><div style={{ fontSize: 18, fontWeight: 900 }}>My Schedule</div><div style={{ fontSize: 11, color: colors.muted, marginTop: 3 }}>Plan, remember and stay on track.</div></div>
          <button type="button" aria-label="Go to today" onClick={() => { setVisibleMonth(startOfMonth(today)); setSelectedDate(today); }} style={{ border: `1px solid ${colors.border}`, background: colors.surface2, color: colors.text, borderRadius: 8, padding: '6px 9px', fontWeight: 800, cursor: 'pointer' }}>Today</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <button type="button" aria-label="Previous month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))} style={{ border: 0, background: 'transparent', color: colors.muted, fontSize: 20, cursor: 'pointer', padding: 4 }}>‹</button>
          <strong>{monthName(visibleMonth)}</strong>
          <button type="button" aria-label="Next month" onClick={() => setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))} style={{ border: 0, background: 'transparent', color: colors.muted, fontSize: 20, cursor: 'pointer', padding: 4 }}>›</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 5 }}>{['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <div key={`${day}-${index}`} style={{ textAlign: 'center', fontSize: 10, fontWeight: 900, color: colors.muted, padding: '4px 0' }}>{day}</div>)}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
          {days.map(day => {
            const key = dateKey(day); const inMonth = day.getMonth() === visibleMonth.getMonth(); const isToday = key === dateKey(today); const isSelected = key === selectedKey; const isBirthday = birthdayThisYear && key === dateKey(birthdayThisYear); const hasReminder = Boolean(remindersByDate[key]?.length);
            return <button type="button" key={key} aria-label={`${day.toLocaleDateString(undefined, { dateStyle: 'full' })}${isBirthday ? ', birthday' : ''}${hasReminder ? ', reminder' : ''}`} onClick={() => setSelectedDate(day)} style={{ position: 'relative', minHeight: 36, border: isSelected ? `2px solid ${colors.accent}` : '1px solid transparent', borderRadius: 9, background: isSelected ? colors.accentSoft : 'transparent', color: inMonth ? colors.text : colors.muted, opacity: inMonth ? 1 : .45, cursor: 'pointer', fontWeight: isToday ? 950 : 700 }}><span style={{ display: 'inline-grid', placeItems: 'center', width: 26, height: 26, borderRadius: '50%', background: isToday ? colors.today : 'transparent', color: isToday ? '#fff' : 'inherit' }}>{day.getDate()}</span>{(isBirthday || hasReminder) && <span aria-hidden="true" style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2 }}>{isBirthday && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ec4899' }} />}{hasReminder && <span style={{ width: 5, height: 5, borderRadius: '50%', background: colors.accent }} />}</span>}</button>;
          })}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12, fontSize: 10, color: colors.muted }}><span>🟠 Today</span><span>🎂 Birthday</span><span>• Reminder</span></div>
        <div style={{ borderTop: `1px solid ${colors.border}`, marginTop: 14, paddingTop: 14 }}>
          {selectedBirthday && <div style={{ background: dark ? '#3f1d35' : '#fff1f7', borderRadius: 12, padding: 12, marginBottom: 10 }}><div style={{ fontWeight: 950, color: '#db2777' }}>🎂 Happy Birthday, {firstName}!</div><div style={{ fontSize: 12, color: colors.muted, lineHeight: 1.5, marginTop: 4 }}>Everyone at VidyaVantage wishes you a wonderful year of growth, discovery and new possibilities.</div></div>}
          <div style={{ fontSize: 11, fontWeight: 900, color: colors.muted, textTransform: 'uppercase', letterSpacing: .8 }}>Selected day</div>
          <div style={{ fontWeight: 900, marginTop: 4 }}>{selectedDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          {selectedReminders.length > 0 && <div style={{ marginTop: 10, display: 'grid', gap: 7 }}>{selectedReminders.map(reminder => <div key={reminder.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, background: colors.surface2, border: `1px solid ${colors.border}`, borderRadius: 9, padding: '8px 9px', fontSize: 12 }}><span>• {reminder.text}</span><button type="button" aria-label={`Remove reminder ${reminder.text}`} onClick={() => removeReminder(reminder.id)} style={{ border: 0, background: 'transparent', color: colors.muted, cursor: 'pointer' }}>×</button></div>)}</div>}
          {showReminderForm ? <div style={{ marginTop: 10 }}><label htmlFor="career-reminder" style={{ display: 'block', fontSize: 11, fontWeight: 800, marginBottom: 5 }}>Reminder</label><input id="career-reminder" value={reminderText} onChange={event => setReminderText(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') addReminder(); }} placeholder="e.g. Research psychology courses" style={{ width: '100%', border: `1px solid ${colors.border}`, borderRadius: 9, padding: '9px 10px', background: colors.surface, color: colors.text }} /><div style={{ display: 'flex', gap: 7, marginTop: 7 }}><button type="button" disabled={saving || !reminderText.trim()} onClick={addReminder} style={{ flex: 1, border: 0, borderRadius: 9, background: colors.accent, color: '#fff', padding: 9, fontWeight: 900, cursor: 'pointer', opacity: saving || !reminderText.trim() ? .55 : 1 }}>{saving ? 'Saving…' : 'Save reminder'}</button><button type="button" onClick={() => setShowReminderForm(false)} style={{ border: `1px solid ${colors.border}`, borderRadius: 9, background: colors.surface, color: colors.text, padding: '9px 11px', fontWeight: 800, cursor: 'pointer' }}>Cancel</button></div></div> : <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7, marginTop: 10 }}><button type="button" onClick={() => setShowReminderForm(true)} style={{ border: `1px solid ${colors.border}`, borderRadius: 9, background: colors.surface, color: colors.text, padding: 9, fontWeight: 850, cursor: 'pointer' }}>＋ Reminder</button><button type="button" onClick={() => navigateCareer('/dashboard/career/sessions')} style={{ border: 0, borderRadius: 9, background: colors.accent, color: '#fff', padding: 9, fontWeight: 900, cursor: 'pointer' }}>📅 Book session</button></div>}
          {message && <div role="status" style={{ fontSize: 11, color: colors.muted, marginTop: 8 }}>{message}</div>}
        </div>
      </section>
    </aside>
  );
}
