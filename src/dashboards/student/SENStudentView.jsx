import React from 'react';

const SENStudentView = ({ studentData, currentUser }) => {
  const dynamicName = studentData?.name || currentUser?.displayName || 'Student';
  const profileImage = currentUser?.photoURL || 'https://via.placeholder.com/150';

  return (
    <div className="flex min-h-screen bg-amber-50">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 p-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-amber-100">
          <div className="h-24 bg-amber-100"></div>
          <div className="px-6 pb-6 relative flex flex-col items-center text-center">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-white shadow-md -mt-12 mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-800">{dynamicName}</h2>
            <p className="text-sm text-gray-500 mb-6">Student</p>
            
            <nav className="w-full flex flex-col gap-2">
              <button className="flex items-center gap-3 w-full px-4 py-2.5 bg-amber-50 text-amber-700 font-semibold rounded-lg transition-colors">
                <span>🏠</span> Dashboard
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                <span>📝</span> My Learning Plan
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                <span>🪪</span> My Accommodations
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                <span>💬</span> Chat
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Banner */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-amber-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to your Learning Space, {dynamicName}
            </h1>
            <p className="text-gray-600">
              This is your personalised area to track goals, manage accommodations, and celebrate your unique learning style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Superpowers */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">⚡</div>
                <h2 className="text-lg font-bold text-gray-800">My Superpowers</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">Your unique strengths that help you excel.</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold border border-indigo-100">
                  🎨 Creative Thinking
                </span>
                <span className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold border border-teal-100">
                  👀 Visual Learning
                </span>
                <span className="px-3 py-1.5 bg-rose-50 text-rose-700 rounded-full text-sm font-semibold border border-rose-100">
                  💡 Problem Solving
                </span>
              </div>
            </div>

            {/* Weekly Learning Goals */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🎯</div>
                <h2 className="text-lg font-bold text-gray-800">Weekly Goals</h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
                  <span className="text-sm text-gray-700">Use text-to-speech for history reading assignment</span>
                </li>
                <li className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
                  <span className="text-sm text-gray-700">Organise notes using mind maps</span>
                </li>
                <li className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
                  <span className="text-sm text-gray-700">Take a 5-minute brain break every 25 minutes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Current Accommodations */}
          <div className="bg-white rounded-xl p-8 shadow-sm border border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🪪</div>
                <h2 className="text-xl font-bold text-gray-800">Current Accommodations</h2>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wide">
                Active
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Show this card to your teachers if you need to quickly communicate your approved accommodations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-center gap-4 shadow-sm">
                <div className="text-3xl">⏱️</div>
                <div>
                  <h3 className="font-bold text-gray-800">Extra Time</h3>
                  <p className="text-sm text-gray-600">25% extra time on all written tests and exams.</p>
                </div>
              </div>
              
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl flex items-center gap-4 shadow-sm">
                <div className="text-3xl">🤫</div>
                <div>
                  <h3 className="font-bold text-gray-800">Quiet Testing</h3>
                  <p className="text-sm text-gray-600">Access to a separate, quiet room for assessments.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SENStudentView;