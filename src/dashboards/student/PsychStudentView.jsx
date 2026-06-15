import React, { useState } from 'react';
import MoodTracker from '../../components/wellbeing/MoodTracker';
import UnifiedIntakeForm from '../../components/forms/UnifiedIntakeForm';

const PsychStudentView = ({ studentData, currentUser }) => {
  const dynamicName = studentData?.name || currentUser?.displayName || 'Student';
  const profileImage = currentUser?.photoURL || 'https://via.placeholder.com/150';

  const isProfileIncomplete = !studentData?.grade || !studentData?.parentName;
  const [showIntake, setShowIntake] = useState(isProfileIncomplete);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50">
      {showIntake && <UnifiedIntakeForm onComplete={() => setShowIntake(false)} />}
      
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 p-6 animate-in fade-in duration-500">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden flex flex-col border border-teal-100">
          <div className="h-24 bg-teal-100"></div>
          <div className="px-6 pb-6 relative flex flex-col items-center text-center">
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-white shadow-md -mt-12 mb-4 object-cover"
            />
            <h2 className="text-xl font-bold text-gray-800">{dynamicName}</h2>
            <p className="text-sm text-gray-500 mb-6">Student</p>
            
            <nav className="w-full flex flex-col gap-2">
              <button className="flex items-center gap-3 w-full px-4 py-2.5 bg-teal-50 text-teal-700 font-semibold rounded-lg transition-colors">
                <span>🏠</span> Dashboard
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                <span>📔</span> My Journal
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-600 hover:bg-gray-50 font-medium rounded-lg transition-colors">
                <span>📚</span> Resources
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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-teal-100 animate-in fade-in duration-500 slide-in-from-bottom-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to your safe space, {dynamicName}
            </h1>
            <p className="text-teal-700">
              Take a deep breath. We're here to support your mental and emotional well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
            {/* Daily Mood Check-In */}
            <MoodTracker />

            {/* Upcoming Sessions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-teal-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">📅</div>
                <h2 className="text-lg font-bold text-gray-800">Upcoming Sessions</h2>
              </div>
              <div className="bg-teal-50/50 rounded-xl p-4 flex flex-col items-start border border-teal-100">
                <p className="text-sm font-semibold text-teal-800 mb-1">Counselling Psychologist</p>
                <p className="text-xs text-teal-600 mb-3">No sessions scheduled currently.</p>
                <button className="px-4 py-2 bg-teal-500 text-white text-sm font-bold rounded-lg hover:bg-teal-600 transition-colors">
                  Book a Session
                </button>
              </div>
            </div>
          </div>

          {/* My Private Journal */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-teal-100 animate-in fade-in duration-1000 slide-in-from-bottom-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">📔</div>
                <h2 className="text-xl font-bold text-gray-800">My Private Journal</h2>
              </div>
              <button className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                Write a new entry
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              Your journal is entirely private. Writing helps organize your thoughts and process complex emotions.
            </p>
            <div className="mt-6 p-10 border-2 border-dashed border-gray-200 rounded-xl text-center">
              <p className="text-gray-400">You haven't written any entries yet. Start fresh today!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PsychStudentView;