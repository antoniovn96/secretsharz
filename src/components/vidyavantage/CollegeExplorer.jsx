import React, { useState } from 'react';
import { mockColleges } from '../../utils/mockColleges';
import { saveCollegeToShortlist } from '../../services/studentService';
import { auth } from '../../firebase';

export default function CollegeExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (college, tier) => {
    if (!auth.currentUser) {
      showToast('❌ Please log in to save colleges.');
      return;
    }
    try {
      await saveCollegeToShortlist(auth.currentUser, college, tier);
      showToast(`✅ Added ${college.name} to ${tier} shortlist!`);
    } catch (error) {
      console.error(error);
      showToast('❌ Failed to add college.');
    }
  };

  const filteredColleges = mockColleges.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courses.some(course => course.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">College Explorer</h2>
      
      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Search for colleges, locations, or courses..." 
          className="w-full p-4 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map(college => (
          <div key={college.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{college.name}</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{college.type}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
              📍 {college.location}
            </p>
            
            <div className="mb-6 flex-grow">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Top Courses</p>
              <div className="flex flex-wrap gap-2">
                {college.courses.map((course, idx) => (
                  <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md border border-indigo-100">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 mt-auto">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">Save to Shortlist</p>
              <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => handleSave(college, 'dream')}
                  className="flex-1 py-2 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 transition-colors"
                >
                  🌟 Dream
                </button>
                <button 
                  onClick={() => handleSave(college, 'target')}
                  className="flex-1 py-2 px-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 transition-colors"
                >
                  🎯 Target
                </button>
                <button 
                  onClick={() => handleSave(college, 'safe')}
                  className="flex-1 py-2 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200 transition-colors"
                >
                  🛡️ Safe
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredColleges.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No colleges found matching "{searchTerm}".
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-bounce">
          {toast}
        </div>
      )}
    </div>
  );
}
