import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

// Helper to format relative time
function relativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return 'Yesterday';
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Helper to get initials
function getInitials(name) {
  if (!name) return 'S';
  const parts = name.trim().split(' ');
  if (parts.length > 1) {
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }
  return name;
}

const CareerCounsellorView = ({ userData, currentUser }) => {
  const { navigate } = useDashboard();
  const dynamicName = userData?.name || currentUser?.displayName || 'Career Counsellor';
  const profileImage = currentUser?.photoURL || 'https://via.placeholder.com/150';

  const [careerCaseload, setCareerCaseload] = useState([]);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCareerDashboardData = async () => {
      setIsLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const studentsQuery = query(usersRef, where('primary_path', '==', 'career'));
        const studentsSnapshot = await getDocs(studentsQuery);
        
        const fetchedStudents = [];
        studentsSnapshot.forEach(doc => {
          const data = doc.data();
          if (!data.role || data.role === 'student') {
            const riasecCode = data.careerDNA?.riasec?.code || data.riasecCode || null;
            
            fetchedStudents.push({
              uid: doc.id,
              name: data.name || 'Unknown Student',
              grade: data.grade || 'N/A',
              school: data.schoolName || 'N/A',
              riasecCode: riasecCode,
              updatedAt: data.updatedAt || null
            });
          }
        });
        
        setCareerCaseload(fetchedStudents);

        // Filter and sort for recent assessments
        const assessedStudents = fetchedStudents
          .filter(s => s.riasecCode)
          .sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt) : new Date(0);
            const dateB = b.updatedAt ? new Date(b.updatedAt) : new Date(0);
            return dateB - dateA;
          })
          .slice(0, 5); // Limit to top 5 recent
          
        setRecentAssessments(assessedStudents);

      } catch (error) {
        console.error("Error fetching Career caseload:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareerDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm z-10">
        <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100">
          <img 
            src={profileImage} 
            alt="Counsellor Profile" 
            className="w-20 h-20 rounded-full object-cover mb-4 shadow-sm border-2 border-slate-100"
          />
          <h2 className="text-lg font-bold text-slate-800 text-center">{dynamicName}</h2>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase mt-1">Career Counsellor</p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl transition-all">
            <span className="text-lg">👥</span> My Students
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-all">
            <span className="text-lg">🗺️</span> Career Roadmaps
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-all">
            <span className="text-lg">🏫</span> College Applications
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-all">
            <span className="text-lg">💰</span> Scholarships
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
              <p className="text-slate-600 font-medium mt-1">Here is an overview of your active career guidance students.</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all text-sm flex items-center gap-2">
              <span>+</span> New Student
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-medium">Loading your dashboard...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Caseload Column (Spans 2) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="text-indigo-500">📋</span> Active Students
                    </h2>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      {careerCaseload.length} Student{careerCaseload.length !== 1 && 's'}
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    {careerCaseload.length === 0 ? (
                      <div className="p-10 text-center text-slate-500">
                        <div className="text-4xl mb-3 opacity-50">📂</div>
                        <p className="font-medium">No active career guidance cases.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Grade</th>
                            <th className="px-6 py-4">School</th>
                            <th className="px-6 py-4">RIASEC Code</th>
                            <th className="px-6 py-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {careerCaseload.map((student) => (
                            <tr key={student.uid} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                              <td className="px-6 py-4 text-slate-600">{student.grade}</td>
                              <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]">{student.school}</td>
                              <td className="px-6 py-4">
                                {student.riasecCode ? (
                                  <span className="inline-flex items-center px-3 py-1 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs tracking-widest shadow-sm border border-indigo-200">
                                    {student.riasecCode}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 font-semibold text-xs border border-slate-200">
                                    Assessment Pending
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <button 
                                  className="text-indigo-600 font-bold hover:text-indigo-800 uppercase text-xs tracking-wider transition-colors flex items-center gap-1"
                                  onClick={() => navigate(`/provider/career/case/${student.uid}`)}
                                >
                                  Build Roadmap <span className="text-base leading-none">→</span>
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
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>✨</span> Recent Assessments
                  </h2>
                  
                  <div className="space-y-4">
                    {recentAssessments.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="text-3xl mb-2 opacity-40">📊</div>
                        <p className="text-sm text-slate-500 font-medium">No recent assessment completions.</p>
                      </div>
                    ) : (
                      recentAssessments.map((student) => (
                        <div key={student.uid} className="p-4 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-800 text-sm">{getInitials(student.name)}</span>
                            <span className="text-xs text-slate-500 font-semibold">
                              {relativeTime(student.updatedAt)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium flex flex-wrap items-center gap-1.5 leading-relaxed">
                            unlocked their Career DNA: 
                            <span className="px-2 py-0.5 bg-white border border-indigo-100 rounded shadow-sm text-indigo-700 font-bold tracking-widest text-xs">
                              {student.riasecCode}
                            </span>
                          </p>
                          <button className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wide">
                            View Full Report →
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {recentAssessments.length > 0 && (
                    <button className="w-full mt-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                      View All Reports
                    </button>
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

export default CareerCounsellorView;
