import React, { useState } from 'react';
import CareerAssessmentJourney from '../../career/CareerAssessmentJourney';
import UnifiedIntakeForm from '../../components/forms/UnifiedIntakeForm';

const CareerStudentView = ({ studentData, currentUser }) => {
  const [isTakingTest, setIsTakingTest] = useState(false);
  const dynamicName = studentData?.name || currentUser?.displayName || 'Student';
  const profileImage = currentUser?.photoURL || 'https://via.placeholder.com/150';
  const isProfileIncomplete = !studentData?.grade || !studentData?.parentName;
  const [showIntake, setShowIntake] = useState(isProfileIncomplete);

  if (isTakingTest) {
    return (
      <CareerAssessmentJourney
        currentUser={currentUser}
        studentData={studentData}
        onExit={() => setIsTakingTest(false)}
      />
    );
  }

  const hasAssessment = !!(studentData?.riasecScores || studentData?.careerDNA?.riasec || studentData?.riasecCode);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <aside className="w-64 flex-shrink-0 p-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col border border-indigo-100/50">
          <div className="h-24 bg-gradient-to-r from-indigo-500 to-blue-500" />
          <div className="px-6 pb-6 relative flex flex-col items-center text-center">
            <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md -mt-12 mb-4 object-cover" />
            <h2 className="text-xl font-bold text-gray-800">{dynamicName}</h2>
            <p className="text-sm text-gray-500 mb-6">Student</p>
            <nav className="w-full flex flex-col gap-2">
              <button className="flex items-center gap-3 w-full px-4 py-2.5 bg-indigo-50 text-indigo-700 font-bold rounded-lg"><span>🏠</span> Home</button>
              <button onClick={() => setIsTakingTest(true)} className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg"><span>🎯</span> Career Discovery</button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-lg"><span>🏫</span> Colleges</button>
            </nav>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <section className="bg-white rounded-xl p-8 shadow-sm border border-indigo-50/50">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome to VidyaVantage, {dynamicName} ⚡</h1>
            <p className="text-slate-600 text-lg font-medium">Your career roadmap starts here. Explore, discover, and build your future.</p>
          </section>

          {!hasAssessment ? (
            <section className="bg-white rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center border border-indigo-100 py-16">
              <div className="text-4xl mb-4">🧭</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Discover Your Possibilities</h2>
              <p className="text-gray-500 max-w-xl">Take the detailed VidyaVantage Career Discovery Assessment. It explores your interests, goals, values, work style and more — then opens pathways to careers, courses and colleges.</p>
              <button onClick={() => setIsTakingTest(true)} className="mt-6 px-8 py-3.5 bg-blue-600 text-white font-extrabold rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all">Start Career Discovery</button>
            </section>
          ) : (
            <section className="bg-white rounded-xl p-8 shadow-sm border border-indigo-50/50">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">
                <div><div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1">Career Intelligence</div><h2 className="text-2xl font-bold text-gray-800">Continue Your Career Journey</h2><p className="text-gray-500 mt-2">Your previous career information is still here. Open Career Discovery to view or continue the new assessment journey.</p></div>
                <button onClick={() => setIsTakingTest(true)} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700">Open Career Discovery</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5 border-t border-gray-100">
                <div className="rounded-xl bg-indigo-50 p-5"><div className="text-sm font-bold text-indigo-700">🧠 Existing profile</div><div className="text-2xl font-black text-gray-900 mt-2">{studentData?.careerDNA?.riasec?.code || studentData?.riasecCode || '—'}</div><div className="text-xs text-gray-500 mt-1">Previous Holland code</div></div>
                <div className="rounded-xl bg-amber-50 p-5"><div className="text-sm font-bold text-amber-700">🧭 Explore more</div><div className="font-bold text-gray-800 mt-2">Careers & pathways</div><div className="text-xs text-gray-500 mt-1">Discover alternatives, not just one answer.</div></div>
                <div className="rounded-xl bg-emerald-50 p-5"><div className="text-sm font-bold text-emerald-700">🎓 Next step</div><div className="font-bold text-gray-800 mt-2">Courses & colleges</div><div className="text-xs text-gray-500 mt-1">Connect your interests to real study options.</div></div>
              </div>
            </section>
          )}

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => setIsTakingTest(true)} className="bg-white text-left rounded-xl p-6 shadow-sm border border-indigo-100 hover:-translate-y-1 transition"><div className="text-2xl mb-3">🧭</div><h3 className="font-bold text-gray-800">Career Discovery</h3><p className="text-sm text-gray-500 mt-1">Assessment, profile and career exploration.</p></button>
            <button className="bg-white text-left rounded-xl p-6 shadow-sm border border-indigo-100 hover:-translate-y-1 transition"><div className="text-2xl mb-3">🎓</div><h3 className="font-bold text-gray-800">Courses</h3><p className="text-sm text-gray-500 mt-1">Explore courses connected to your interests.</p></button>
            <button className="bg-white text-left rounded-xl p-6 shadow-sm border border-indigo-100 hover:-translate-y-1 transition"><div className="text-2xl mb-3">🏫</div><h3 className="font-bold text-gray-800">Colleges</h3><p className="text-sm text-gray-500 mt-1">Discover verified institutions and pathways.</p></button>
          </section>
        </div>
      </main>
      {showIntake && <UnifiedIntakeForm onComplete={() => setShowIntake(false)} />}
    </div>
  );
};

export default CareerStudentView;
