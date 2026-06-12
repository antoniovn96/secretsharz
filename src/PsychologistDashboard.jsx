import React, { useState } from 'react';
import SOAPNoteModal from './components/SOAPNoteModal';
import BIPModal from './components/BIPModal';

const PsychologistDashboard = () => {
  const [activeSoapStudent, setActiveSoapStudent] = useState(null);
  const [activeBipStudent, setActiveBipStudent] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F4F4] to-[#FFF3CA] p-8">
      {/* Floating Top Navigation Pill */}
      <div className="flex justify-center mb-10">
        <div className="bg-white/80 backdrop-blur-md rounded-full shadow-lg px-2 py-2 flex space-x-2 border border-white/50">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium transition-colors shadow-sm">My Caseload</button>
          <button className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-full font-medium transition-colors">Pending Intakes</button>
          <button className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-full font-medium transition-colors">Session Notes</button>
          <button className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-full font-medium transition-colors">Archived</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border-t-4 border-blue-500">
            <h3 className="text-gray-500 font-medium mb-2">Active Cases</h3>
            <p className="text-4xl font-bold text-blue-600">24</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border-t-4 border-yellow-500">
            <h3 className="text-gray-500 font-medium mb-2">Intakes to Review</h3>
            <p className="text-4xl font-bold text-yellow-600">5</p>
          </div>
          <div className="bg-white/90 backdrop-blur rounded-3xl p-6 shadow-xl border-t-4 border-green-500">
            <h3 className="text-gray-500 font-medium mb-2">Sessions Today</h3>
            <p className="text-4xl font-bold text-green-600">6</p>
          </div>
        </div>

        {/* The Caseload Grid (Patient Roster) */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">My Caseload</h2>
            <p className="text-gray-500 mt-1">Manage your assigned students and session notes</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="py-4 px-8 font-semibold text-gray-600">Student ID</th>
                  <th className="py-4 px-8 font-semibold text-gray-600">Age</th>
                  <th className="py-4 px-8 font-semibold text-gray-600">Presenting Concern</th>
                  <th className="py-4 px-8 font-semibold text-gray-600">Documents</th>
                  <th className="py-4 px-8 font-semibold text-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-8 font-medium text-gray-800">VV-2026-8492</td>
                  <td className="py-5 px-8 text-gray-600">20</td>
                  <td className="py-5 px-8">
                    <span className="inline-block px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium">Severe Anxiety</span>
                  </td>
                  <td className="py-5 px-8">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      View Intake & Consent
                    </button>
                  </td>
                  <td className="py-5 px-8 text-right flex justify-end gap-2">
                    <button
                      onClick={() => setActiveBipStudent({ id: 'VV-2026-8492', name: 'VV-2026-8492' })}
                      className="bg-purple-100 text-purple-700 px-5 py-2.5 rounded-xl font-medium hover:bg-purple-200 transition-colors shadow-sm inline-flex items-center gap-2"
                    >
                      🧠 + Assign BIP
                    </button>
                    <button
                      onClick={() => setActiveSoapStudent({ id: 'VV-2026-8492', name: 'VV-2026-8492' })}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-2"
                    >
                      📝 + Add SOAP Note
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-8 font-medium text-gray-800">VV-2026-1104</td>
                  <td className="py-5 px-8 text-gray-600">19</td>
                  <td className="py-5 px-8">
                    <span className="inline-block px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm font-medium">Academic Stress</span>
                  </td>
                  <td className="py-5 px-8">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      View Intake & Consent
                    </button>
                  </td>
                  <td className="py-5 px-8 text-right flex justify-end gap-2">
                    <button
                      onClick={() => setActiveBipStudent({ id: 'VV-2026-1104', name: 'VV-2026-1104' })}
                      className="bg-purple-100 text-purple-700 px-5 py-2.5 rounded-xl font-medium hover:bg-purple-200 transition-colors shadow-sm inline-flex items-center gap-2"
                    >
                      🧠 + Assign BIP
                    </button>
                    <button
                      onClick={() => setActiveSoapStudent({ id: 'VV-2026-1104', name: 'VV-2026-1104' })}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-2"
                    >
                      📝 + Add SOAP Note
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {activeSoapStudent && (
        <SOAPNoteModal
          onClose={() => setActiveSoapStudent(null)}
          studentId={activeSoapStudent.id}
          studentName={activeSoapStudent.name}
        />
      )}

      {activeBipStudent && (
        <BIPModal
          onClose={() => setActiveBipStudent(null)}
          studentId={activeBipStudent.id}
          studentName={activeBipStudent.name}
        />
      )}
    </div>
  );
};

export default PsychologistDashboard;
