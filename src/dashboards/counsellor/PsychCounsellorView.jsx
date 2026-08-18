import React, { useState, useEffect } from 'react';

function relativeTime(date) {
  if (!date) return '';
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

function getInitials(name) {
  if (!name) return 'S';
  const parts = name.trim().split(' ');
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1].charAt(0)}.` : name;
}

const PsychCounsellorView = ({ userData, currentUser }) => {
  const dynamicName = userData?.name || currentUser?.displayName || 'Psychologist';
  const profileImage = currentUser?.photoURL || 'https://via.placeholder.com/150';
  const [caseload, setCaseload] = useState([]);
  const [moodAlerts, setMoodAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const allowed = userData?.role === 'psychologist' || userData?.role === 'super_admin';
    if (!allowed) {
      setAccessDenied(true);
      return;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const uid = currentUser?.uid;
        if (!uid) return;
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/professional/caseload?service=wellbeing', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store'
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || 'Unable to load your assigned wellbeing caseload.');
        const fetchedStudents = payload.students || [];
        setCaseload(fetchedStudents);

        const fetchedAlerts = [];
        for (const student of fetchedStudents) {
          try {
            const moodResponse = await fetch(`/api/professional/student-mood?studentId=${encodeURIComponent(student.uid)}`, {
              headers: { Authorization: `Bearer ${token}` },
              cache: 'no-store'
            });
            if (!moodResponse.ok) continue;
            const moodPayload = await moodResponse.json();
            if (moodPayload?.alert) fetchedAlerts.push(moodPayload.alert);
          } catch (_) {}
        }
        fetchedAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMoodAlerts(fetchedAlerts);
      } catch (error) {
        console.error('Error fetching assigned wellbeing caseload:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser?.uid, userData?.role]);

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-xl font-black text-slate-900">Professional access restricted</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">This workspace is restricted to counselling psychology professionals and authorised administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm z-10">
        <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100">
          <img src={profileImage} alt="Professional profile" className="w-20 h-20 rounded-full object-cover mb-4 shadow-sm border-2 border-slate-100" />
          <h2 className="text-lg font-bold text-slate-800 text-center">Dr. {dynamicName}</h2>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase mt-1">Counselling Psychologist</p>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl"><span className="text-lg">👥</span> My Caseload</button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"><span className="text-lg">📅</span> Calendar</button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"><span className="text-lg">📝</span> Session Notes</button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"><span className="text-lg">🔄</span> Referrals</button>
        </nav>
        <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500 leading-5">Only students assigned to your professional account are available in this workspace.</div>
      </div>

      <div className="flex-1 p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome, Dr. {dynamicName}</h1>
              <p className="text-slate-600 font-medium mt-1">Here is an overview of your assigned students today.</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all text-sm">+ New Session Note</button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20"><div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div><p className="text-slate-500 font-medium">Loading your assigned dashboard...</p></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><span className="text-indigo-500">📋</span> Active Caseload</h2>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">{caseload.length} Student{caseload.length !== 1 && 's'}</span>
                  </div>
                  <div className="overflow-x-auto">
                    {caseload.length === 0 ? (
                      <div className="p-10 text-center text-slate-500"><div className="text-4xl mb-3 opacity-50">📂</div><p className="font-medium">No students are currently assigned to this professional account.</p></div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold"><th className="px-6 py-4">Student</th><th className="px-6 py-4">Grade</th><th className="px-6 py-4">Last Session</th><th className="px-6 py-4">Action</th></tr></thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {caseload.map(student => (
                            <tr key={student.uid} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => { window.history.pushState({}, '', `/provider/psychologist/case/${student.uid}`); window.dispatchEvent(new PopStateEvent('popstate')); }}>
                              <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                              <td className="px-6 py-4 text-slate-600">{student.grade}</td>
                              <td className="px-6 py-4 text-slate-500">{student.lastSessionDate ? new Date(student.lastSessionDate).toLocaleDateString() : 'Never'}</td>
                              <td className="px-6 py-4"><button className="text-indigo-600 font-semibold hover:text-indigo-800" onClick={event => { event.stopPropagation(); window.history.pushState({}, '', `/provider/psychologist/case/${student.uid}`); window.dispatchEvent(new PopStateEvent('popstate')); }}>View</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-rose-400"></div>
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><span>🚨</span> Recent Mood Alerts</h2>
                  {moodAlerts.length === 0 ? (
                    <div className="text-center py-6"><div className="text-3xl mb-2 opacity-40">✨</div><p className="text-sm text-slate-500 font-medium">No recent critical mood check-ins among your assigned students.</p></div>
                  ) : (
                    <div className="space-y-4">
                      {moodAlerts.map(alert => (
                        <div key={alert.id} className={`p-4 rounded-xl border ${alert.moodValue === 1 ? 'bg-rose-50 border-rose-100' : 'bg-orange-50 border-orange-100'}`}>
                          <div className="flex justify-between items-start mb-2"><span className="font-bold text-slate-800 text-sm">{getInitials(alert.studentName)}</span><span className="text-xs font-semibold text-slate-500">{relativeTime(new Date(alert.timestamp))}</span></div>
                          <p className="text-sm text-slate-700 font-medium">Logged: <span className="px-2 py-0.5 bg-white rounded shadow-sm">{alert.moodLabel} {alert.emoji}</span></p>
                          <button className="mt-3 text-xs font-bold uppercase tracking-wide text-indigo-600 hover:text-indigo-800" onClick={() => { window.history.pushState({}, '', `/provider/psychologist/case/${alert.studentId}`); window.dispatchEvent(new PopStateEvent('popstate')); }}>Review Case File →</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PsychCounsellorView;
