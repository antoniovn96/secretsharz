import React, { useState } from 'react';
import DocumentVaultModal from './DocumentVaultModal';

export default function CareerDashboardView({ localUserData, collegesExt }) {
  const userName = localUserData?.name || 'User';
  const [showVault, setShowVault] = useState(false);
  const [isParentMode, setIsParentMode] = useState(false);
  const profilePic = localUserData?.profilePicture || null;

  return (
    <div className="flex min-h-screen bg-[#F3F4F6] font-sans">
      {/* Sidebar */}
      <div className="w-[80px] bg-[#1A1A1A] rounded-r-3xl flex flex-col items-center py-8 gap-8 fixed h-screen left-0 top-0 z-50">
        <div className="text-white text-2xl font-bold mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">S</div>
        </div>
        <button className="text-white opacity-50 hover:opacity-100 transition-opacity">🏠</button>
        <button className="text-white opacity-50 hover:opacity-100 transition-opacity">🎓</button>
        <button className="text-white opacity-50 hover:opacity-100 transition-opacity">📱</button>
        <button className="text-white opacity-50 hover:opacity-100 transition-opacity">👤</button>
        <button className="text-white opacity-50 hover:opacity-100 transition-opacity">🌐</button>
        {!isParentMode && (
          <button 
            onClick={() => setShowVault(true)}
            className="text-white opacity-50 hover:opacity-100 transition-opacity"
            title="Document Vault"
          >
            📁
          </button>
        )}
        <button className="text-white opacity-50 hover:opacity-100 transition-opacity mt-auto">☰</button>
      </div>

      {/* Main Content */}
      <div className="ml-[80px] flex-1 p-8 flex flex-col gap-6 h-screen overflow-y-auto">
        {/* Top Row: Banner & Profile */}
        <div className="grid grid-cols-[1fr_350px] gap-6">
          {/* Banner */}
          <div className="bg-white rounded-2xl p-6 flex items-center shadow-sm relative overflow-hidden h-40 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="relative z-10">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight leading-tight">BIGGEST INTERNATIONAL<br/><span className="text-[#E8650A]">EDUCATION FAIR 2024</span></h2>
              <div className="flex items-center gap-4 mt-3">
                <p className="text-xs font-bold text-gray-600">📅 15TH JULY 2025</p>
                <p className="text-xs font-bold text-gray-600">📍 TAJ PALACE, MUMBAI</p>
              </div>
              <button className="mt-4 bg-[#E8650A] text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg shadow-orange-500/30 transition-transform hover:scale-105">Register</button>
            </div>
            {/* Banner image placeholder */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
          </div>

          {/* Profile Card & Parent Toggle */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-end">
              <button 
                onClick={() => setIsParentMode(!isParentMode)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  isParentMode ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-600 shadow-sm hover:bg-gray-50'
                }`}
              >
                👨‍👩‍👧 Parent View
              </button>
            </div>
            <div className="bg-[#1A1A1A] rounded-2xl p-6 flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="absolute top-4 left-4 text-orange-500 text-xl">🔗</div>
            <div className="mt-4">
              <h3 className="text-lg font-black text-white uppercase tracking-wide">{userName}</h3>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] bg-white/10 text-white/80 px-2 py-1 rounded border border-white/20 font-bold flex items-center gap-1">🎓 Masters</span>
                <span className="text-[10px] bg-white/10 text-white/80 px-2 py-1 rounded border border-white/20 font-bold flex items-center gap-1">☀️ Intake 2025</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E8650A] to-yellow-500 p-[2px] shrink-0 z-10">
              {profilePic ? (
                <img src={profilePic} alt="avatar" className="w-full h-full rounded-full object-cover border-2 border-[#1A1A1A]" />
              ) : (
                <div className="w-full h-full rounded-full bg-[#2A2A2A] border-2 border-[#1A1A1A] flex items-center justify-center text-white font-bold text-xl">
                  {userName.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Placeholder */}
        <div className="bg-white rounded-xl px-4 py-3 flex items-center shadow-sm">
          <span className="text-gray-400 font-medium text-sm">WELCOME BACK {`{ ${userName.toUpperCase()} }`}</span>
          <span className="ml-auto text-gray-400">🔍</span>
        </div>

        {/* Split View */}
        <div className="grid grid-cols-[1.5fr_1fr] gap-6">
          {/* Left Side: Tracker & Deadlines */}
          <div className="flex flex-col gap-6">
            
            {/* Application Tracker */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-800">University Application Details</h3>
                <button className="text-gray-400 font-bold text-xl">•••</button>
              </div>
              <div className="flex flex-col gap-4">
                {collegesExt && collegesExt.length > 0 ? (
                  collegesExt.map((college, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 text-lg border border-blue-100 shrink-0">🏫</div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{college.name}</div>
                          <div className="text-[11px] text-gray-500 font-bold mt-1">{college.course || 'Master of Computer Science'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          i % 2 === 0 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {i % 2 === 0 ? 'Shortlisted' : 'Opening soon'}
                        </span>
                        {!isParentMode && (
                          <button className="bg-[#E8650A] text-white text-[11px] font-bold px-4 py-1.5 rounded-full transition-transform hover:scale-105">Edit Status</button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No applications tracked yet.</p>
                )}
              </div>
            </div>

            {/* Application Deadlines */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-800">Application Deadlines</h3>
                <span className="text-sm font-bold text-gray-600 flex items-center gap-2">✏️ Mon, Aug 4</span>
              </div>
              <div className="flex gap-6">
                <div className="flex-1 flex flex-col gap-3">
                  <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
                    <div>
                      <div className="text-[11px] text-gray-500 font-medium mb-1">Harvard University</div>
                      <div className="text-sm font-bold text-gray-800">Master of Computer Science</div>
                    </div>
                    <span className="text-green-500 text-[10px] font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">soon</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center border border-gray-100">
                    <div>
                      <div className="text-[11px] text-gray-500 font-medium mb-1">Harvard University</div>
                      <div className="text-sm font-bold text-gray-800">Master of Computer Science</div>
                    </div>
                    <span className="text-green-500 text-[10px] font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">soon</span>
                  </div>
                </div>
                
                {/* Mini Calendar */}
                <div className="w-64 bg-gray-50 rounded-xl p-4 border border-gray-100 shrink-0">
                  <div className="flex justify-between items-center text-xs font-bold mb-4">
                    <span>August 2023 ▾</span>
                    <div className="flex gap-2 text-gray-400">
                      <span>‹</span>
                      <span>›</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-y-2 text-center text-xs text-gray-500 font-medium">
                    <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                    <div>1</div><div>2</div><div>3</div>
                    <div className="bg-[#E8650A] text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto">4</div>
                    <div>5</div><div>6</div><div>7</div>
                    <div>8</div><div>9</div><div>10</div><div>11</div><div>12</div><div>13</div><div>14</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Stacked Cards */}
          <div className="flex flex-col gap-4">
            {[
              { title: 'Education Details', color: 'bg-[#E8650A]', metrics: 'Market Stability: High' },
              { title: 'Work Experience', color: 'bg-gray-400', metrics: 'Financial ROI: Excellent' },
              { title: 'Research Papers', color: 'bg-[#E8650A]', metrics: 'Campus Safety Index: High' }
            ].map((card, i) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden h-[140px] flex flex-col justify-between group cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="text-gray-800 text-lg">📄</div>
                  <button className="text-gray-400 font-bold text-xl">•••</button>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{card.title}</h3>
                  {isParentMode ? (
                    <p className="text-xs font-bold text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded inline-block">{card.metrics}</p>
                  ) : (
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-2 tracking-wider">CAREER CLARITY</p>
                  )}
                </div>
                {/* Bottom right accent corner */}
                <div className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-tl-[32px] ${card.color}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showVault && (
        <DocumentVaultModal 
          localUserData={localUserData} 
          onClose={() => setShowVault(false)} 
        />
      )}
    </div>
  );
}
