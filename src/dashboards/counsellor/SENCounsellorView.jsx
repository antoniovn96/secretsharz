import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

const SENCounsellorView = ({ userData, currentUser }) => {
  const { navigate } = useDashboard();
  const dynamicName = userData?.name || currentUser?.displayName || 'Special Educator';
  const profileImage = currentUser?.photoURL || 'https://via.placeholder.com/150';

  const [senCaseload, setSenCaseload] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSENDashboardData = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const studentsQuery = query(usersRef, where('primary_path', '==', 'sen'));
        const studentsSnapshot = await getDocs(studentsQuery);
        
        const fetchedStudents = [];
        studentsSnapshot.forEach(doc => {
          const data = doc.data();
          if (!data.role || data.role === 'student') {
            // Assign a mock IEP status based on name length for visual variety
            const statuses = ['Drafting', 'Active', 'Review Needed'];
            const mockStatus = statuses[(data.name || '').length % 3];
            
            fetchedStudents.push({
              uid: doc.id,
              name: data.name || 'Unknown Student',
              grade: data.grade || 'N/A',
              school: data.schoolName || 'N/A',
              iepStatus: mockStatus
            });
          }
        });
        
        setSenCaseload(fetchedStudents);
      } catch (error) {
        console.error("Error fetching SEN caseload:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSENDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm z-10">
        <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100">
          <img 
            src={profileImage} 
            alt="Educator Profile" 
            className="w-20 h-20 rounded-full object-cover mb-4 shadow-sm border-2 border-slate-100"
          />
          <h2 className="text-lg font-bold text-slate-800 text-center">{dynamicName}</h2>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase mt-1">Special Educator</p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-amber-50 text-amber-700 font-bold rounded-xl transition-all">
            <span className="text-lg">👥</span> My SEN Caseload
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-all">
            <span className="text-lg">🏗️</span> IEP Builder
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-all">
            <span className="text-lg">🪪</span> Accommodation Plans
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-all">
            <span className="text-lg">🏫</span> School Comms
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome, {dynamicName}
              </h1>
              <p className="text-slate-600 font-medium mt-1">Here is an overview of your active SEN students today.</p>
            </div>
            <button className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all text-sm flex items-center gap-2">
              <span>+</span> Draft New IEP
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Loading your dashboard...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Caseload Column (Spans 2) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="text-amber-500">📋</span> Active SEN Caseload
                    </h2>
                    <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                      {senCaseload.length} Student{senCaseload.length !== 1 && 's'}
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    {senCaseload.length === 0 ? (
                      <div className="p-10 text-center text-slate-500">
                        <div className="text-4xl mb-3 opacity-50">📂</div>
                        <p className="font-medium">No active SEN cases assigned.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Grade</th>
                            <th className="px-6 py-4">School</th>
                            <th className="px-6 py-4">IEP Status</th>
                            <th className="px-6 py-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {senCaseload.map((student) => (
                            <tr key={student.uid} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                              <td className="px-6 py-4 text-slate-600">{student.grade}</td>
                              <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]">{student.school}</td>
                              <td className="px-6 py-4">
                                {student.iepStatus === 'Drafting' ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 font-bold text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Drafting
                                  </span>
                                ) : student.iepStatus === 'Review Needed' ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-700 font-bold text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Review
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 font-bold text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <button 
                                  className="text-amber-600 font-bold hover:text-amber-800 uppercase text-xs tracking-wider transition-colors flex items-center gap-1"
                                  onClick={() => navigate(`/provider/educator/case/${student.uid}`)}
                                >
                                  Review IEP <span className="text-base leading-none">→</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Items Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-rose-400"></div>
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>⚡</span> Urgent Action Items
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Alert 1 */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-800 text-sm">IEP Deadline</span>
                        <span className="text-xs text-rose-600 font-bold bg-rose-100 px-2 py-0.5 rounded">Due 2 Days</span>
                      </div>
                      <p className="text-sm text-slate-700 font-medium">
                        Draft IEP for Aarav Patel.
                      </p>
                    </div>

                    {/* Alert 2 */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-800 text-sm">School Comms</span>
                        <span className="text-xs text-amber-600 font-bold bg-amber-100 px-2 py-0.5 rounded">Pending</span>
                      </div>
                      <p className="text-sm text-slate-700 font-medium">
                        Send Accommodation Plan to Delhi Public School for Priya.
                      </p>
                    </div>
                  </div>
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
