import React from 'react';

const PsychCounsellorView = ({ userData, currentUser }) => {
  const dynamicName = userData?.name || currentUser?.displayName || 'Psychologist';
  const profileImage = currentUser?.photoURL || 'https://via.placeholder.com/150';

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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Caseload Column (Spans 2) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="text-indigo-500">📋</span> Active Caseload
                  </h2>
                  <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">3 Students</span>
                </div>
                
                <div className="overflow-x-auto">
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
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">Aarav Patel</td>
                        <td className="px-6 py-4 text-slate-600">Class 11</td>
                        <td className="px-6 py-4 text-slate-500">May 12, 2026</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 text-green-700 font-bold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Low
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-indigo-600 font-semibold hover:text-indigo-800">View</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">Priya Sharma</td>
                        <td className="px-6 py-4 text-slate-600">Class 12</td>
                        <td className="px-6 py-4 text-slate-500">May 10, 2026</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-100 text-yellow-700 font-bold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Moderate
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-indigo-600 font-semibold hover:text-indigo-800">View</button>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-800">Rohan Desai</td>
                        <td className="px-6 py-4 text-slate-600">Class 10</td>
                        <td className="px-6 py-4 text-slate-500">May 05, 2026</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-700 font-bold text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> High
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-indigo-600 font-semibold hover:text-indigo-800">View</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                  {/* Alert 1 */}
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800 text-sm">Priya S.</span>
                      <span className="text-xs text-rose-500 font-semibold">2 hours ago</span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      Logged: <span className="px-2 py-0.5 bg-white rounded shadow-sm text-rose-700">Awful 😢</span>
                    </p>
                    <button className="mt-3 text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors uppercase tracking-wide">
                      Review Case File →
                    </button>
                  </div>

                  {/* Alert 2 */}
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800 text-sm">Rohan D.</span>
                      <span className="text-xs text-orange-500 font-semibold">Yesterday</span>
                    </div>
                    <p className="text-sm text-slate-700 font-medium flex items-center gap-2">
                      Logged: <span className="px-2 py-0.5 bg-white rounded shadow-sm text-orange-700">Bad 😟</span>
                    </p>
                    <button className="mt-3 text-xs font-bold text-orange-600 hover:text-orange-800 transition-colors uppercase tracking-wide">
                      Review Case File →
                    </button>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                  View All Logs
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PsychCounsellorView;