import React, { useMemo, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18 };
const button = { border: 0, borderRadius: 10, padding: '10px 13px', fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit' };

function localKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function safeDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function CalendarGrid({ month, selected, onSelect, events }) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const first = new Date(year, monthIndex, 1);
  const firstDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, monthIndex, day));
  while (cells.length % 7) cells.push(null);

  const todayKey = localKey(new Date());
  return <div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 5 }}>
      {['M','T','W','T','F','S','S'].map((day, index) => <div key={`${day}-${index}`} style={{ textAlign: 'center', fontSize: 10, fontWeight: 900, color: '#64748b', padding: '5px 0' }}>{day}</div>)}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
      {cells.map((date, index) => {
        if (!date) return <div key={`empty-${index}`} style={{ minHeight: 38 }} />;
        const key = localKey(date);
        const dayEvents = events[key] || [];
        const isToday = key === todayKey;
        const isSelected = key === selected;
        return <button
          key={key}
          onClick={() => onSelect(key)}
          aria-label={`${date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${isToday ? ', today' : ''}${dayEvents.length ? `, ${dayEvents.length} event${dayEvents.length === 1 ? '' : 's'}` : ''}`}
          style={{ minHeight: 38, border: isSelected ? '2px solid #4338ca' : '1px solid transparent', borderRadius: 10, background: isSelected ? '#eef2ff' : isToday ? '#f8fafc' : '#fff', color: '#0f172a', cursor: 'pointer', position: 'relative', fontWeight: isToday || isSelected ? 950 : 700, fontFamily: 'inherit' }}
        >
          <span>{date.getDate()}</span>
          {isToday && <span aria-hidden="true" style={{ display: 'block', width: 5, height: 5, borderRadius: '50%', background: '#4f46e5', margin: '2px auto 0' }} />}
          {dayEvents.length > 0 && <span aria-hidden="true" style={{ position: 'absolute', right: 4, top: 4, width: 5, height: 5, borderRadius: '50%', background: dayEvents.some(event => event.type === 'birthday') ? '#f59e0b' : '#10b981' }} />}
        </button>;
      })}
    </div>
  </div>;
}

export default function CareerCalendar({ user, liveUserData, onNavigate, compact = false }) {
  const [month, setMonth] = useState(() => new Date());
  const [selected, setSelected] = useState(() => localKey(new Date()));
  const [showReminder, setShowReminder] = useState(false);
  const [reminderTitle, setReminderTitle] = useState('');
  const [reminderTime, setReminderTime] = useState('18:00');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const reminders = Array.isArray(liveUserData?.careerCalendar?.reminders) ? liveUserData.careerCalendar.reminders : [];
  const sessions = Array.isArray(liveUserData?.careerSessions) ? liveUserData.careerSessions : [];
  const birthday = liveUserData?.careerProfile?.dateOfBirth || liveUserData?.dateOfBirth || liveUserData?.dob || '';

  const events = useMemo(() => {
    const map = {};
    const add = (date, event) => { if (!date) return; const key = localKey(date); map[key] = [...(map[key] || []), event]; };
    reminders.forEach(item => { const d = safeDate(`${item.date || ''}T${item.time || '00:00'}:00`); if (d) add(d, { ...item, type: 'reminder' }); });
    sessions.forEach(item => {
      const d = safeDate(item.date || item.start || item.startDateTime);
      if (d) add(d, { ...item, type: 'session', title: item.title || item.name || 'Career guidance session' });
    });
    const birthdayDate = safeDate(birthday);
    if (birthdayDate) {
      const thisYear = new Date(new Date().getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
      add(thisYear, { type: 'birthday', title: '🎂 Your birthday', recurring: true });
    }
    return map;
  }, [birthday, reminders, sessions]);

  const selectedDate = useMemo(() => {
    const [y, m, d] = selected.split('-').map(Number);
    return new Date(y, m - 1, d);
  }, [selected]);
  const selectedEvents = events[selected] || [];

  const saveReminder = async () => {
    if (!user || !reminderTitle.trim()) return;
    setSaving(true); setMessage('');
    try {
      const next = [...reminders, { id: `rem_${Date.now()}`, title: reminderTitle.trim(), date: selected, time: reminderTime, createdAt: new Date().toISOString() }];
      await setDoc(doc(db, 'users', user.uid), { careerCalendar: { reminders: next, updatedAt: new Date().toISOString() } }, { merge: true });
      setReminderTitle(''); setReminderTime('18:00'); setShowReminder(false); setMessage('Reminder saved.');
    } catch (error) {
      setMessage(error?.message || 'Unable to save the reminder.');
    } finally { setSaving(false); }
  };

  const title = month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const selectedLabel = selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return <section style={{ ...card, padding: compact ? 18 : 22 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <div><div style={{ fontSize: 11, fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: 1 }}>My Calendar</div><h2 style={{ margin: '4px 0 0', fontSize: compact ? 18 : 21, color: '#0f172a' }}>{title}</h2></div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} style={{ ...button, background: '#f8fafc', color: '#334155', padding: '7px 10px' }}>‹</button>
        <button aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} style={{ ...button, background: '#f8fafc', color: '#334155', padding: '7px 10px' }}>›</button>
      </div>
    </div>

    <div style={{ marginTop: 14 }}><CalendarGrid month={month} selected={selected} onSelect={setSelected} events={events} /></div>

    <div style={{ marginTop: 16, borderTop: '1px solid #eef2f7', paddingTop: 15 }}>
      <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>{selectedLabel}</div>
      {selectedEvents.length ? <div style={{ display: 'grid', gap: 7, marginTop: 9 }}>{selectedEvents.map((event, index) => <div key={`${event.type}-${event.id || index}`} style={{ padding: 10, borderRadius: 10, background: event.type === 'birthday' ? '#fff7ed' : '#f8fafc', border: '1px solid #eef2f7' }}><div style={{ fontSize: 12, fontWeight: 900, color: '#0f172a' }}>{event.title || event.name || 'Calendar event'}</div>{event.time && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{event.time}</div>}</div>)}</div> : <div style={{ marginTop: 8, color: '#64748b', fontSize: 12 }}>No events scheduled.</div>}
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1fr 1fr', gap: 8, marginTop: 13 }}>
      <button onClick={() => setShowReminder(value => !value)} style={{ ...button, background: '#eef2ff', color: '#4338ca' }}>+ Add reminder</button>
      <button onClick={() => onNavigate?.('sessions')} style={{ ...button, background: '#4f46e5', color: '#fff' }}>Book a session</button>
    </div>

    {showReminder && <div style={{ marginTop: 12, padding: 13, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569' }}>Reminder title<input value={reminderTitle} onChange={event => setReminderTitle(event.target.value)} placeholder="e.g. Complete my career journal" style={{ width: '100%', boxSizing: 'border-box', marginTop: 6, padding: 10, border: '1px solid #cbd5e1', borderRadius: 9, fontFamily: 'inherit' }} /></label>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 900, color: '#475569', marginTop: 9 }}>Time<input type="time" value={reminderTime} onChange={event => setReminderTime(event.target.value)} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6, padding: 10, border: '1px solid #cbd5e1', borderRadius: 9, fontFamily: 'inherit' }} /></label>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 10 }}><span style={{ fontSize: 11, color: '#64748b' }}>{message}</span><button disabled={saving || !reminderTitle.trim()} onClick={saveReminder} style={{ ...button, background: '#4f46e5', color: '#fff', opacity: saving || !reminderTitle.trim() ? .55 : 1 }}>{saving ? 'Saving…' : 'Save reminder'}</button></div>
    </div>}

    {message && !showReminder && <div role="status" style={{ marginTop: 9, color: '#166534', fontSize: 11, fontWeight: 800 }}>{message}</div>}
  </section>;
}
