import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { useDashboard } from '../../context/DashboardContext';

// Helper to format relative time
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

// Helper to get initials
function getInitials(name) {
  if (!name) return 'S';
  const parts = name.trim().split(' ');
  if (parts.length > 1) {
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  }
  return name;
}

const PsychCounsellorView = ({ userData, currentUser }) => {
  const { navigate } = useDashboard();
  const dynamicName = userData?.name || currentUser?.displayName || 'Psychologist';
  const profileImage = currentUser?.photoURL || 'https://via.placeholder.com/150';

  const [caseload, setCaseload] = useState([]);
  const [moodAlerts, setMoodAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // 1. Fetch caseload (Students in Wellbeing path)
        const usersRef = collection(db, 'users');
        // We use primary_path == wellbeing. We fetch all and filter role in memory if needed to avoid composite index requirements for simple prototypes.
        const studentsQuery = query(usersRef, where('primary_path', '==', 'wellbeing'));
        const studentsSnapshot = await getDocs(studentsQuery);
        
        const fetchedStudents = [];
        studentsSnapshot.forEach(doc => {
          const data = doc.data();
          // Safely handle missing roles if default student has no role field yet
          if (!data.role || data.role === 'student') {
            fetchedStudents.push({
              uid: doc.id,
              name: data.name || 'Unknown Student',
              grade: data.grade || 'N/A',
              lastSessionDate: data.lastSessionDate || null,
              riskLevel: data.riskLevel || 'Low' // Placeholder for overall risk
            });
          }
        });
        
        setCaseload(fetchedStudents);

        // 2. Fetch mood alerts for these students
        const fetchedAlerts = [];
        for (const student of fetchedStudents) {
          const logsRef = collection(db, 'users', student.uid, 'mood_logs');
          const logsQuery = query(logsRef, orderBy('timestamp', 'desc'), limit(1));
          const logsSnapshot = await getDocs(logsQuery);
          
          if (!logsSnapshot.empty) {
            const logDoc = logsSnapshot.docs[0];
            const logData = logDoc.data();
            
            // Only keep 'Awful' (1) or 'Bad' (2)
            if (logData.moodValue === 1 || logData.moodValue === 2) {
              fetchedAlerts.push({
                id: logDoc.id,
                studentId: student.uid,
                studentName: student.name,
                moodValue: logData.moodValue,
                moodLabel: logData.moodLabel,
                timestamp: logData.timestamp ? logData.timestamp.toDate() : new Date(),
                emoji: logData.moodValue === 1 ? '😢' : '😟'
              });
            }
          }
        }
        
        // Sort alerts by most recent
        fetchedAlerts.sort((a, b) => b.timestamp - a.timestamp);
        setMoodAlerts(fetchedAlerts);
        
      } catch (error) {
        console.error("Error fetching caseload and alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 shadow-sm z-10">
        <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100">
          <img 
            src={profileImage} 
            alt="Dr. Profile" 
            className="w-20 h-20 rounded-full object-cover mb-4 shadow-sm border-2 border-slate-100"
          />
          <h2 className="text-lg font-bold text-slate-800 text-center">Dr. {dynamicName}</h2>
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase mt-1">Counselling Psychologist</p>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl transition-all">
            <span className="text-lg">👥</span> My Caseload
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-all">
            <span className="text-lg">📅</span> Calendar
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-all">
            <span className="text-lg">📝</span> Session Notes
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-all">
            <span className="text-lg">🔄</span> Referrals
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
                Welcome, Dr. {dynamicName}
              </h1>
              <p className="text-slate-600 font-medium mt-1">Here is an overview of your active students today.</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition-all text-sm flex items-center gap-2">
              <span>+</span> New Session Note
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
                      <span className="text-indigo-500">📋</span> Active Caseload
                    </h2>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                      {caseload.length} Student{caseload.length !== 1 && 's'}
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    {caseload.length === 0 ? (
                      <div className="p-10 text-center text-slate-500">
                        <div className="text-4xl mb-3 opacity-50">📂</div>
                        <p className="font-medium">No active cases assigned.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Grade</th>
                            <th className="px-6 py-4">Last Session</th>
                            <th className="px-6 py-4">Risk Level</th>
                            <th className="px-6 py-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                          {caseload.map((student) => (
                            <tr 
                              key={student.uid} 
                              className="hover:bg-slate-50 transition-colors cursor-pointer"
                              onClick={() => navigate(`/provider/psychologist/case/${student.uid}`)}
                            >
                              <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                              <td className="px-6 py-4 text-slate-600">{student.grade}</td>
                              <td className="px-6 py-4 text-slate-500">
                                {student.lastSessionDate ? new Date(student.lastSessionDate).toLocaleDateString() : 'Never'}
                              </td>
                              <td className="px-6 py-4">
                                {student.riskLevel.toLowerCase() === 'high' ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-700 font-bold text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> High
                                  </span>
                                ) : student.riskLevel.toLowerCase() === 'moderate' ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-100 text-yellow-700 font-bold text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Moderate
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 text-green-700 font-bold text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Low
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <button 
                                  className="text-indigo-600 font-semibold hover:text-indigo-800"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/provider/psychologist/case/${student.uid}`);
                                  }}
                                >
                                  View
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

              {/* Mood Alerts Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-rose-400"></div>
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>🚨</span> Recent Mood Alerts
                  </h2>
                  
                  <div className="space-y-4">
                    {moodAlerts.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="text-3xl mb-2 opacity-40">✨</div>
                        <p className="text-sm text-slate-500 font-medium">No critical mood alerts at this time.</p>
                      </div>
                    ) : (
                      moodAlerts.map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`p-4 rounded-xl border ${
                            alert.moodValue === 1 ? 'bg-rose-50 border-rose-100' : 'bg-orange-50 border-orange-100'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-800 text-sm">{getInitials(alert.studentName)}</span>
                            <span className={`text-xs font-semibold ${alert.moodValue === 1 ? 'text-rose-500' : 'text-orange-500'}`}>
                              {relativeTime(alert.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                            Logged: 
                            <span className={`px-2 py-0.5 bg-white rounded shadow-sm ${alert.moodValue === 1 ? 'text-rose-700' : 'text-orange-700'}`}>
                              {alert.moodLabel} {alert.emoji}
                            </span>
                          </p>
                          <button 
                            className={`mt-3 text-xs font-bold uppercase tracking-wide transition-colors ${
                              alert.moodValue === 1 ? 'text-rose-600 hover:text-rose-800' : 'text-orange-600 hover:text-orange-800'
                            }`}
                            onClick={() => navigate(`/provider/psychologist/case/${alert.studentId}`)}
                          >
                            Review Case File →
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {moodAlerts.length > 0 && (
                    <button className="w-full mt-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                      View All Logs
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

export default PsychCounsellorView;
