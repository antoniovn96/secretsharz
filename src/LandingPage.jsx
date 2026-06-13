import React from 'react';

export default function LandingPage({ onNavigate }) {
  const handleTrackSelection = (trackName) => {
    sessionStorage.setItem('pendingTrack', trackName);
    onNavigate('/auth');
  };

  return (
    <div className="bg-[#0D1117] text-white min-h-screen flex flex-col items-center justify-center p-8 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Welcome to the Secret Sharz Ecosystem
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
          Choose your pathway to clarity and growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mt-12">
        {/* Card 1: VidyaVantage */}
        <div className="bg-[#1C2333] border border-[#F0A500]/30 rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(240,165,0,0.15)]">
          <div className="w-16 h-16 bg-[#F0A500]/20 rounded-full flex items-center justify-center text-3xl mb-6">
            🧭
          </div>
          <h2 className="text-2xl font-bold text-[#F0A500] mb-4">VidyaVantage</h2>
          <p className="text-gray-400 mb-8 flex-1">
            Focus on Career Guidance. Discover the career that was made for you with AI-powered analysis and expert mapping.
          </p>
          <button 
            onClick={() => handleTrackSelection('career')}
            className="w-full py-4 bg-[#F0A500] hover:bg-[#E8650A] text-white font-bold rounded-xl transition-colors"
          >
            Start Career Track
          </button>
        </div>

        {/* Card 2: Secret Sharz */}
        <div className="bg-[#1C2333] border border-[#0A7C6E]/30 rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(10,124,110,0.15)]">
          <div className="w-16 h-16 bg-[#0A7C6E]/20 rounded-full flex items-center justify-center text-3xl mb-6">
            🧠
          </div>
          <h2 className="text-2xl font-bold text-[#0A7C6E] mb-4">Secret Sharz</h2>
          <p className="text-gray-400 mb-8 flex-1">
            Focus on Clinical Counselling & Mental Health. Find a safe space to heal, self-regulate, and speak without judgment.
          </p>
          <button 
            onClick={() => handleTrackSelection('counselling')}
            className="w-full py-4 bg-[#0A7C6E] hover:bg-[#14B8A6] text-white font-bold rounded-xl transition-colors"
          >
            Get Clinical Support
          </button>
        </div>

        {/* Card 3: Hybrid */}
        <div className="bg-[#1C2333] border border-[#9D4EDD]/30 rounded-2xl p-8 flex flex-col items-center text-center transition-transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(157,78,221,0.15)]">
          <div className="w-16 h-16 bg-[#9D4EDD]/20 rounded-full flex items-center justify-center text-3xl mb-6">
            ✨
          </div>
          <h2 className="text-2xl font-bold text-[#9D4EDD] mb-4">Hybrid Track</h2>
          <p className="text-gray-400 mb-8 flex-1">
            Focus on holistic development. Blend mental clarity with career confidence for total personal transformation.
          </p>
          <button 
            onClick={() => handleTrackSelection('hybrid')}
            className="w-full py-4 bg-[#9D4EDD] hover:bg-[#7B2CBF] text-white font-bold rounded-xl transition-colors"
          >
            Start Hybrid Track
          </button>
        </div>
      </div>
    </div>
  );
}
