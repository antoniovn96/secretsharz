import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

const SENCounsellorView = ({ userData, currentUser }) => {
  const { navigate } = useDashboard();
  const dynamicName = userData?.name || currentUser?.displayName || 'Special Educator';
  const profileImage = currentUser?.photoURL || 'https://via.placeholder.com/150';
  const [senCaseload, setSenCaseload] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const allowed = userData?.role === 'educator' || userData?.role === 'super_admin';
    if (!allowed) {
      setAccessDenied(true);
      return;
    }

    const fetchSENDashboardData = async () => {
      setIsLoading(true);
      try {
        const uid = currentUser?.uid;
        if (!uid) return;

        // Assignment-bound queries only. The old dashboard loaded every SEN
        // student and generated fabricated IEP statuses; this version uses the
        // authenticated educator's actual assignment boundary.
        const usersRef = collection(db, 'users');
        const [primaryAssignments, legacyAssignments] = await Promise.all([
          getDocs(query(usersRef, where('assignedStaff.senId', '==', uid))),
          getDocs(query(usersRef, where('assignedStaff.educatorId', '==', uid)))
        ]);

        const studentDocs = new Map();
        [...primaryAssignments.docs, ...legacyAssignments.docs].forEach(docSnap => {
          const data = docSnap.data();
          if ((!data.role || data.role === 'student') && data.primary_path === 'sen') {
            studentDocs.set(docSnap.id, { uid: docSnap.id, ...data });
          }
        });

        const fetchedStudents = [];
        for (const data of studentDocs.values()) {
          let iepStatus = data.iepStatus || data.latestIepStatus || 'Not started';
          try {
            const records = await getDocs(query(collection(db, 'users', data.uid, 'iep_records'), orderBy('timestamp', 'desc'), limit(1)));
            if (!records.empty) iepStatus = records.docs[0].data().status || iepStatus;
          } catch (_) {
            // Keep the profile-level status when no IEP record is available.
          }

          fetchedStudents.push({
            uid: data.uid,
            name: data.name || 'Unknown Student',
            grade: data.grade || 'N/A',
            school: data.schoolName || 'N/A',
            iepStatus,
          });
        }

        setSenCaseload(fetchedStudents);
      } catch (error) {
        console.error('Error fetching assigned SEN caseload:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSENDashboardData();
  }, [currentUser?.uid, userData?.role]);

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <div className="text-4xl mb-3">🔒</div>
          <h1 className="text-xl font-black text-slate-900">Professional access restricted</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">This workspace is restricted to authorised SEN professionals and administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm z-10">
        <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100">
          <img src={profileImage} alt="Educator profile" className="w-20 h-20 rounded-full object-cover mb-4 shadow-sm border-2 border-slate-100" />
          <h2 className="text-lg font-bold text-slate-800 text-center">{dynamicName}</h2>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase mt-1">Special Educator</p>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-amber-50 text-amber-700 font-bold rounded-xl"><span className="text-lg">👥</span> My SEN Caseload</button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"><span className="text-lg">🏗️</span> IEP Builder</button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"><span className="text-lg">🪪</span> Accommodation Plans</button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl"><span className="text-lg">🏫</span> School Comms</button>
        </nav>
        <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500 leading-5">Only students assigned to your professional account are available in this workspace.</div>
      </div>

      <div className="flex-1 p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome, {dynamicName}</h1>
              <p className="text-slate-600 font-medium mt-1">Here is an overview of your assigned SEN students today.</p>
            </div>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all text-sm"><span>+</span> Draft New IEP</button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20"><div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div><p className="text-slate-500 font-medium">Loading your assigned dashboard...</p></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><span className="text-amber-500">📋</span> Active SEN Caseload</h2>
                    <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">{senCaseload.length} Student{senCaseload.length !== 1 && 's'}</span>
                  </div>
                  <div className="overflow-x-auto">
                    {senCaseload.length === 0 ? (
                      <div className="p-10 text-center text-slate-500"><div className="text-4xl mb-3 opacity-50">📂</div><p className="font-medium">No students are currently assigned to this professional account.</p></div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead><tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold"><th className="px-6 py-4">Student</th><th className="px-6 py-4">Grade</th><th className="px-6 py-4">School</th><th className="px-6 py-4">IEP Status</th><th className="px-6 py-4">Action</th></tr></thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {senCaseload.map(student => (
                            <tr key={student.uid} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                              <td className="px-6 py-4 text-slate-600">{student.grade}</td>
                              <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]">{student.school}</td>
                              <td className="px-6 py-4"><span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-bold text-xs">{student.iepStatus}</span></td>
                              <td className="px-6 py-4"><button className="text-amber-600 font-bold hover:text-amber-800 uppercase text-xs tracking-wider transition-colors flex items-center gap-1" onClick={() => navigate(`/provider/educator/case/${student.uid}`)}>Review IEP <span className="text-base leading-none">→</span></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">📊 Caseload readiness</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Assigned students</span><strong>{senCaseload.length}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">IEPs started</span><strong>{senCaseload.filter(s => s.iepStatus !== 'Not started').length}</strong></div>
                    <div className="flex justify-between"><span className="text-slate-500">Not started</span><strong>{senCaseload.filter(s => s.iepStatus === 'Not started').length}</strong></div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                  <h2 className="text-lg font-bold text-slate-800 mb-3">🔐 Record boundary</h2>
                  <p className="text-sm leading-6 text-slate-600">Individual SEN records are available only through the professional workflow for students assigned to this account. Institution coordinators receive aggregate service information, not individual IEP contents.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SENCounsellorView;
