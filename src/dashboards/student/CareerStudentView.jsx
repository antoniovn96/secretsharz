import React from 'react';

const CareerStudentView = ({ studentData, currentUser }) => {
  const dynamicName = studentData?.name || currentUser?.displayName || 'Student';
  const profileImage = currentUser?.photoURL || 'https://via.placeholder.com/150';
  
  const hasAssessment = !!(studentData?.riasecScores || studentData?.careerDNA?.riasec || studentData?.riasecCode);

  const handleTakeAssessment = () => {
    console.log("Open Assessment Modal");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 p-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="h-24 bg-indigo-100"></div>
          <div className="px-6 pb-6 relative flex flex-col items-center text-center">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-white shadow-md -mt-12 mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-800">{dynamicName}</h2>
            <p className="text-sm text-gray-500 mb-6">Student</p>
            
            <nav className="w-full flex flex-col gap-2">
              <button className="flex items-center gap-3 w-full px-4 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-lg transition-colors">
                <span>🏠</span> Home
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                <span>🎯</span> Careers
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                <span>🏫</span> Colleges
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Banner */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to VidyaVantage, {dynamicName}
            </h1>
            <p className="text-gray-600">
              Your career roadmap starts here. Explore, discover, and build your future.
            </p>
          </div>

          {/* Assessment State Logic */}
          {!hasAssessment ? (
            <div className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 py-16">
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Assessment Pending</h2>
              <p className="text-gray-500 max-w-md">
                Complete your RIASEC profile to unlock personalized career matches, college recommendations, and a detailed growth plan.
              </p>
              <button 
                onClick={handleTakeAssessment}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Take Career Assessment
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Career Intelligence Report</div>
                  <h2 className="text-2xl font-bold text-gray-800">Your RIASEC Profile</h2>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-gray-900 tracking-wider">
                    {studentData?.careerDNA?.riasec?.code || studentData?.riasecCode || 'PENDING'}
                  </div>
                  <div className="text-xs font-semibold text-gray-500 mt-1">Holland Code</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                <div>
                  <div className="text-sm font-bold text-teal-600 mb-2">📚 Recommended Stream</div>
                  <div className="font-semibold text-gray-800">
                    {studentData?.recommendedStream || studentData?.streamRec?.name || 'Pending'}
                  </div>
                  {(studentData?.streamRec?.match || studentData?.maturityPct) && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 font-semibold">Match</span>
                        <span className="text-teal-600 font-bold">{studentData?.streamRec?.match || studentData?.maturityPct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${studentData?.streamRec?.match || studentData?.maturityPct || 0}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm font-bold text-amber-500 mb-2">🏆 Top Career Match</div>
                  <div className="font-semibold text-gray-800">
                    {studentData?.topCareerMatches?.[0]?.name || studentData?.bestCareer?.title || 'Pending'}
                  </div>
                  {(studentData?.topCareerMatches?.[0]?.matchScore || studentData?.bestCareer?.matchPercent) && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500 font-semibold">Fit Score</span>
                        <span className="text-amber-500 font-bold">
                          {studentData?.topCareerMatches?.[0]?.matchScore || studentData?.bestCareer?.matchPercent}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${studentData?.topCareerMatches?.[0]?.matchScore || studentData?.bestCareer?.matchPercent || 0}%` }}></div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm font-bold text-purple-500 mb-2">🎯 More Matches</div>
                  <div className="space-y-2">
                    {studentData?.topCareerMatches?.length > 1
                      ? studentData.topCareerMatches.slice(1, 4).map((c, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 font-medium truncate mr-2">{c.name}</span>
                            <span className="text-xs font-bold text-purple-500 flex-shrink-0">{c.matchScore}%</span>
                          </div>
                        ))
                      : [studentData?.recommendedCareer, studentData?.leastCareer].filter(Boolean).map((c, i) => (
                          <div key={i} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 font-medium truncate mr-2">{c.title}</span>
                            <span className="text-xs font-bold text-purple-500 flex-shrink-0">{c.matchPercent}%</span>
                          </div>
                        ))
                    }
                  </div>
                </div>
              </div>
              
              {studentData?.riasecSummary && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Profile Summary</div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {studentData.riasecSummary}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerStudentView;