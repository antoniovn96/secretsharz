import React, { useState } from 'react';
import { db } from './firebase';

const CareerCoachDashboard = () => {
  const [activeTab, setActiveTab] = useState('My Caseload');
  const [activeStudent, setActiveStudent] = useState(null);

  // Mock data for the caseload roster
  const mockStudents = [
    { id: 'SHZ-001', name: 'Alice Smith', grade: '12th / Science', riasec: 'ISA', topCareer: 'Software Engineer' },
    { id: 'SHZ-002', name: 'Bob Jones', grade: '11th / Commerce', riasec: 'ESC', topCareer: 'Marketing Manager' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] to-[#FFF3CA] p-6 font-sans">
      
      {/* Top Navigation Pill */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-full shadow-sm flex overflow-hidden">
          {['My Caseload', 'Assessments to Review', 'Applications'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === tab ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Active Students</h3>
            <p className="text-3xl font-bold text-gray-800">42</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border-l-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Pending RIASEC Reviews</h3>
            <p className="text-3xl font-bold text-gray-800">7</p>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border-l-4 border-orange-500">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Upcoming Deadlines</h3>
            <p className="text-3xl font-bold text-gray-800">12</p>
          </div>
        </div>

        {/* The Caseload Roster */}
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">My Caseload</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-4 font-semibold text-gray-600">Student Unique ID</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Name</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Grade/Stream</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">RIASEC Code</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Top Matched Career</th>
                  <th className="py-4 px-4 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockStudents.map((student, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-gray-700">{student.id}</td>
                    <td className="py-4 px-4 text-gray-900 font-medium">{student.name}</td>
                    <td className="py-4 px-4 text-gray-600">{student.grade}</td>
                    <td className="py-4 px-4 text-gray-600">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm font-mono">
                        {student.riasec}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{student.topCareer}</td>
                    <td className="py-4 px-4">
                      <button 
                        onClick={() => setActiveStudent(student)}
                        className="bg-[#2D2D2D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition-colors whitespace-nowrap"
                      >
                        🎓 Manage Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* The Coach's Toolkit (Modal Placeholder) */}
      {activeStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Career Management: {activeStudent.name}
            </h2>
            <div className="space-y-4">
              <button className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-100 transition-colors">
                Review Assessment
              </button>
              <button className="w-full bg-purple-50 text-purple-600 py-3 rounded-xl font-semibold hover:bg-purple-100 transition-colors">
                Curate College List
              </button>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button 
                  onClick={() => setActiveStudent(null)}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CareerCoachDashboard;
