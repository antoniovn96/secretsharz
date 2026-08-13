import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

function getInitials(name) {
  if (!name) return 'S';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

function relativeTime(value) {
  if (!value) return 'No recent update';
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'No recent update';

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 172800) return 'Yesterday';
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getRiasec(data) {
  return data?.careerDNA?.riasec?.code || data?.riasecCode || data?.careerAssessment?.riasecCode || null;
}

const CareerCounsellorView = ({ userData, currentUser }) => {
  const { navigate } = useDashboard();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('students');

  const name = userData?.name || currentUser?.displayName || 'Career Counsellor';
  const uid = currentUser?.uid;

  const loadStudents = async () => {
    if (!uid) return;
    setLoading(true);
    setError('');

    try {
      // IMPORTANT: this query is deliberately scoped to the authenticated
      // career counsellor. It does not download the global student directory.
      const studentsQuery = query(
        collection(db, 'students'),
        where('assignedStaff.careerId', '==', uid)
      );
      const snapshot = await getDocs(studentsQuery);

      const rows = snapshot.docs.map(studentDoc => {
        const data = studentDoc.data();
        return {
          uid: studentDoc.id,
          name: data.name || data.studentName || 'Unnamed Student',
          grade: data.grade || data.class || 'N/A',
          school: data.schoolName || data.school || 'N/A',
          riasecCode: getRiasec(data),
          updatedAt: data.updatedAt || data.lastUpdatedAt || data.assessmentUpdatedAt || null,
          status: data.status || 'active'
        };
      });

      rows.sort((a, b) => {
        const aTime = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : new Date(a.updatedAt || 0).getTime();
        const bTime = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : new Date(b.updatedAt || 0).getTime();
        return bTime - aTime;
      });

      setStudents(rows);
    } catch (err) {
      console.error('Error loading assigned career students:', err);
      setError('We could not load your assigned students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
    // The dashboard intentionally reloads when the authenticated professional changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter(student =>
      [student.name, student.grade, student.school, student.riasecCode]
        .filter(Boolean)
        .some(value => String(value).toLowerCase().includes(term))
    );
  }, [students, search]);

  const assessedCount = students.filter(student => student.riasecCode).length;
  const pendingCount = students.length - assessedCount;
  const activeCount = students.filter(student => student.status !== 'inactive').length;
  const recentAssessments = students.filter(student => student.riasecCode).slice(0, 5);

  const navItems = [
    { id: 'students', icon: '👥', label: 'My Students' },
    { id: 'roadmaps', icon: '🗺️', label: 'Career Roadmaps' },
    { id: 'applications', icon: '🎓', label: 'College Applications' },
    { id: 'scholarships', icon: '💰', label: 'Scholarships' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 p-6">
          <div className="mb-1 text-xl font-black tracking-tight text-slate-900">Secret <span className="text-indigo-600">Sharz</span></div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Professional Portal</div>
        </div>

        <div className="border-b border-slate-100 p-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-xl font-black text-white shadow-sm">
            {getInitials(name)}
          </div>
          <h2 className="font-bold text-slate-900">{name}</h2>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600">Career Counsellor</p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'students') setActiveTab('students');
                if (item.id === 'roadmaps') setActiveTab('roadmaps');
                if (item.id === 'applications') setActiveTab('applications');
                if (item.id === 'scholarships') setActiveTab('scholarships');
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${activeTab === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="m-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
          <div className="font-bold text-slate-700">Privacy boundary</div>
          <p className="mt-1 leading-relaxed">You can only access students assigned to your professional account.</p>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Career Guidance</p>
              <h1 className="text-xl font-black text-slate-900 md:text-2xl">Welcome, {name}</h1>
            </div>
            <button
              onClick={loadStudents}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              {loading ? 'Refreshing…' : '↻ Refresh'}
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-8">
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['👥', activeCount, 'Active students', 'text-indigo-600'],
              ['🧬', assessedCount, 'Career DNA ready', 'text-emerald-600'],
              ['⏳', pendingCount, 'Assessments pending', 'text-amber-600'],
              ['📈', students.length ? Math.round((assessedCount / students.length) * 100) + '%' : '0%', 'Assessment coverage', 'text-blue-600']
            ].map(([icon, value, label, colour]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 text-xl">{icon}</div>
                <div className={`text-2xl font-black ${colour}`}>{value}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
              </div>
            ))}
          </section>

          {activeTab === 'students' && (
            <>
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">My Students</h2>
                    <p className="mt-1 text-sm text-slate-500">Only students assigned to your career-counselling caseload are shown.</p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={search}
                      onChange={event => setSearch(event.target.value)}
                      placeholder="Search my students…"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 md:w-64"
                    />
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center p-16 text-sm font-semibold text-slate-500">Loading your assigned caseload…</div>
                ) : error ? (
                  <div className="m-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="mb-3 text-4xl">📂</div>
                    <h3 className="font-bold text-slate-800">No assigned students found</h3>
                    <p className="mt-1 text-sm text-slate-500">Students assigned to your career counsellor account will appear here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left">
                      <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-5 py-4">Student</th>
                          <th className="px-5 py-4">Grade</th>
                          <th className="px-5 py-4">School</th>
                          <th className="px-5 py-4">Career DNA</th>
                          <th className="px-5 py-4">Updated</th>
                          <th className="px-5 py-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map(student => (
                          <tr key={student.uid} className="transition hover:bg-slate-50">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-black text-indigo-700">{getInitials(student.name)}</div>
                                <div className="font-bold text-slate-800">{student.name}</div>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-sm text-slate-600">{student.grade}</td>
                            <td className="max-w-[180px] truncate px-5 py-4 text-sm text-slate-600">{student.school}</td>
                            <td className="px-5 py-4">
                              {student.riasecCode ? (
                                <span className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-black tracking-widest text-indigo-700">{student.riasecCode}</span>
                              ) : (
                                <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">Pending</span>
                              )}
                            </td>
                            <td className="px-5 py-4 text-xs font-semibold text-slate-500">{relativeTime(student.updatedAt)}</td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => navigate(`/provider/career/case/${student.uid}`)}
                                className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                              >
                                Open Case →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="font-black text-slate-900">Recent Career DNA</h2>
                      <p className="text-xs text-slate-500">Latest assessed students in your caseload.</p>
                    </div>
                    <span className="text-xl">🧬</span>
                  </div>
                  <div className="space-y-3">
                    {recentAssessments.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No completed assessments yet.</p>
                    ) : recentAssessments.map(student => (
                      <button
                        key={student.uid}
                        onClick={() => navigate(`/provider/career/case/${student.uid}`)}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-100 p-3 text-left hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">{getInitials(student.name)}</div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{student.name}</div>
                            <div className="text-xs text-slate-500">{relativeTime(student.updatedAt)}</div>
                          </div>
                        </div>
                        <span className="rounded-lg bg-indigo-50 px-2 py-1 text-xs font-black tracking-widest text-indigo-700">{student.riasecCode}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
                  <h2 className="font-black text-slate-900">Career Guidance Workflow</h2>
                  <div className="mt-5 space-y-3">
                    {[
                      ['01', 'Review Career DNA', 'Understand interests, strengths and assessment results.'],
                      ['02', 'Build a Roadmap', 'Turn the student profile into concrete next steps.'],
                      ['03', 'Track Progress', 'Revisit goals and update the student journey over time.']
                    ].map(([number, title, description]) => (
                      <div key={number} className="flex gap-3 rounded-xl bg-white/80 p-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-[10px] font-black text-white">{number}</div>
                        <div><div className="text-sm font-bold text-slate-800">{title}</div><div className="text-xs leading-relaxed text-slate-500">{description}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab !== 'students' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mb-3 text-4xl">🚧</div>
              <h2 className="text-xl font-black text-slate-900">{navItems.find(item => item.id === activeTab)?.label}</h2>
              <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500">This module is part of the professional portal roadmap. Your assigned-student caseload is already connected above.</p>
              {activeTab === 'roadmaps' && (
                <button onClick={() => setActiveTab('students')} className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white">Open My Students</button>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default CareerCounsellorView;
