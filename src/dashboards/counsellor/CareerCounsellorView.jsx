import React, { useEffect, useMemo, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';
import CareerCaseFileView from './CareerCaseFileView';
import CareerRoadmapView from './CareerRoadmapView';

function getInitials(name) {
  if (!name) return 'S';
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join('');
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

function getStudentName(data) {
  return data?.name || data?.studentName || data?.profile?.name || 'Unnamed Student';
}

function getGrade(data) {
  return data?.grade || data?.class || data?.school?.grade || 'N/A';
}

function getSchool(data) {
  return data?.schoolName || data?.school?.name || data?.school || 'N/A';
}

function CareerDashboard({ userData, currentUser }) {
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
      // Student master records are created by the intake workflow. The
      // assignment boundary is assignedStaff.careerId, so this query only
      // requests the authenticated counsellor's caseload.
      const q = query(collection(db, 'students'), where('assignedStaff.careerId', '==', uid));
      const snapshot = await getDocs(q);
      const rows = snapshot.docs.map(item => {
        const data = item.data();
        return {
          uid: item.id,
          name: getStudentName(data),
          grade: getGrade(data),
          school: getSchool(data),
          riasecCode: getRiasec(data),
          updatedAt: data.updatedAt || data.lastUpdatedAt || data.assessmentUpdatedAt || null,
          status: data.status || 'active'
        };
      });
      rows.sort((a, b) => {
        const at = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : new Date(a.updatedAt || 0).getTime();
        const bt = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : new Date(b.updatedAt || 0).getTime();
        return bt - at;
      });
      setStudents(rows);
    } catch (err) {
      console.error('Error loading assigned career students:', err);
      setError('We could not load your assigned students. Please check your assignment or try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter(student => [student.name, student.grade, student.school, student.riasecCode].filter(Boolean).some(value => String(value).toLowerCase().includes(term)));
  }, [students, search]);

  const assessedCount = students.filter(student => student.riasecCode).length;
  const pendingCount = students.length - assessedCount;
  const activeCount = students.filter(student => student.status !== 'inactive').length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-slate-100 p-6">
          <div className="text-xl font-black tracking-tight text-slate-900">Secret <span className="text-indigo-600">Sharz</span></div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Professional Portal</div>
        </div>
        <div className="border-b border-slate-100 p-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-xl font-black text-white">{getInitials(name)}</div>
          <h2 className="font-bold text-slate-900">{name}</h2>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-indigo-600">Career Counsellor</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {[
            ['students', '👥', 'My Students'],
            ['roadmaps', '🗺️', 'Career Roadmaps'],
            ['applications', '🎓', 'College Applications'],
            ['scholarships', '💰', 'Scholarships']
          ].map(([id, icon, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${activeTab === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div className="m-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
          <div className="font-bold text-slate-700">Privacy boundary</div>
          <p className="mt-1 leading-relaxed">Only students assigned to your professional account are available in this portal.</p>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Career Guidance</p>
              <h1 className="text-xl font-black text-slate-900 md:text-2xl">Welcome, {name}</h1>
            </div>
            <button onClick={loadStudents} disabled={loading} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50">{loading ? 'Refreshing…' : '↻ Refresh'}</button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-6 p-5 md:p-8">
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['👥', activeCount, 'Active students', 'text-indigo-600'],
              ['🧬', assessedCount, 'Career DNA ready', 'text-emerald-600'],
              ['⏳', pendingCount, 'Assessments pending', 'text-amber-600'],
              ['📈', students.length ? `${Math.round((assessedCount / students.length) * 100)}%` : '0%', 'Assessment coverage', 'text-blue-600']
            ].map(([icon, value, label, colour]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 text-xl">{icon}</div>
                <div className={`text-2xl font-black ${colour}`}>{value}</div>
                <div className="mt-1 text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</div>
              </div>
            ))}
          </section>

          {activeTab === 'students' && (
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">My Students</h2>
                  <p className="mt-1 text-sm text-slate-500">Your assigned career-guidance caseload.</p>
                </div>
                <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search my students…" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-400 md:w-64" />
              </div>
              {loading ? (
                <div className="p-16 text-center text-sm font-semibold text-slate-500">Loading your assigned caseload…</div>
              ) : error ? (
                <div className="m-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="mb-3 text-4xl">📂</div>
                  <h3 className="font-bold text-slate-800">No assigned students found</h3>
                  <p className="mt-1 text-sm text-slate-500">Once a Super Admin assigns a student to your career pathway, the student will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Student</th><th className="px-5 py-4">Grade</th><th className="px-5 py-4">School</th><th className="px-5 py-4">Career DNA</th><th className="px-5 py-4">Updated</th><th className="px-5 py-4">Action</th></tr></thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map(student => (
                        <tr key={student.uid} className="transition hover:bg-slate-50">
                          <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-black text-indigo-700">{getInitials(student.name)}</div><div className="font-bold text-slate-800">{student.name}</div></div></td>
                          <td className="px-5 py-4 text-sm text-slate-600">{student.grade}</td>
                          <td className="max-w-[180px] truncate px-5 py-4 text-sm text-slate-600">{student.school}</td>
                          <td className="px-5 py-4">{student.riasecCode ? <span className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-black tracking-widest text-indigo-700">{student.riasecCode}</span> : <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">Pending</span>}</td>
                          <td className="px-5 py-4 text-xs font-semibold text-slate-500">{relativeTime(student.updatedAt)}</td>
                          <td className="px-5 py-4"><button onClick={() => navigate(`/provider/career/case/${student.uid}`)} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700">Open Case →</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeTab === 'roadmaps' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">Career Roadmaps</h2>
              <p className="mt-2 text-sm text-slate-500">Open a student case to create, review and publish their five-phase career roadmap.</p>
              <button onClick={() => setActiveTab('students')} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Go to My Students</button>
            </section>
          )}

          {activeTab === 'applications' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">College Applications</h2>
              <p className="mt-2 text-sm text-slate-500">Application tracking will be connected to the student's college shortlist and roadmap workflow in the next implementation phase.</p>
            </section>
          )}

          {activeTab === 'scholarships' && (
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">Scholarships</h2>
              <p className="mt-2 text-sm text-slate-500">Scholarship matching will be connected to student profile and application data in the next implementation phase.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CareerCounsellorView(props) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

  // The App router currently sends all /provider/career/* paths to this
  // component. Keep the specialised case/roadmap routes here so nested career
  // routes cannot be intercepted by the parent dashboard route.
  if (pathname.startsWith('/provider/career/case/')) {
    const studentId = pathname.split('/provider/career/case/')[1];
    return <CareerCaseFileView studentId={studentId} currentUser={props.currentUser} />;
  }

  if (pathname.startsWith('/provider/career/roadmap/')) {
    const studentId = pathname.split('/provider/career/roadmap/')[1];
    return <CareerRoadmapView studentId={studentId} currentUser={props.currentUser} />;
  }

  return <CareerDashboard {...props} />;
}
