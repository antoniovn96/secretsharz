import React, { useEffect, useState } from 'react';
import LegacyCareerStudentView from './CareerStudentView.jsx';
import CareerCalendar from './CareerCalendar.jsx';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const DOCK_WIDTH = 340;

export default function CareerStudentViewWithCalendar(props) {
  const [path, setPath] = useState(() => (typeof window !== 'undefined' ? window.location.pathname : '/dashboard/career'));
  const [calendarData, setCalendarData] = useState(props.studentData || null);
  const user = props.currentUser;

  useEffect(() => {
    const sync = () => setPath(window.location.pathname);
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadCalendarData() {
      if (!user?.uid) {
        setCalendarData(props.studentData || null);
        return;
      }
      try {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (!cancelled && snapshot.exists()) setCalendarData(snapshot.data());
      } catch (_) {
        if (!cancelled) setCalendarData(props.studentData || null);
      }
    }
    loadCalendarData();
    return () => { cancelled = true; };
  }, [user?.uid, props.studentData]);

  const isHome = path === '/dashboard/career' || path === '/dashboard/career/';

  return (
    <div className={isHome ? 'vv-career-with-calendar' : ''}>
      {isHome && <style>{`
        .vv-career-with-calendar { position: relative; }
        .vv-career-calendar-dock { display: none; }
        @media (min-width: 1280px) {
          .vv-career-with-calendar main { padding-right: ${DOCK_WIDTH + 36}px !important; }
          .vv-career-calendar-dock {
            display: block;
            position: fixed;
            z-index: 30;
            top: 24px;
            right: 24px;
            width: ${DOCK_WIDTH}px;
            max-height: calc(100vh - 48px);
            overflow: auto;
            scrollbar-width: thin;
          }
        }
        @media (max-width: 1279px) {
          .vv-career-calendar-dock {
            display: block;
            margin: 0 12px 36px;
          }
        }
      `}</style>}

      <LegacyCareerStudentView {...props} />

      {isHome && (
        <div className="vv-career-calendar-dock">
          <CareerCalendar
            user={user}
            liveUserData={calendarData}
            compact
            onNavigate={(next) => {
              const target = next === 'sessions' ? '/dashboard/career/sessions' : '/dashboard/career';
              window.history.pushState({}, '', target);
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo(0, 0);
            }}
          />
        </div>
      )}
    </div>
  );
}
