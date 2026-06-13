import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const CaseFileViewer = ({ studentId, navigate }) => {
  const [studentDoc, setStudentDoc] = useState(null);
  const [caseFileDoc, setCaseFileDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch student document
        const studentRef = doc(db, 'students', studentId);
        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
          throw new Error('Student not found');
        }

        setStudentDoc({ id: studentSnap.id, ...studentSnap.data() });

        // Fetch case file document
        const caseFileRef = doc(db, 'caseFiles', studentId);
        const caseFileSnap = await getDoc(caseFileRef);

        if (caseFileSnap.exists()) {
          setCaseFileDoc({ id: caseFileSnap.id, ...caseFileSnap.data() });
        } else {
          // Case file doesn't exist yet - that's okay
          setCaseFileDoc({ id: studentId, history: [] });
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  if (loading) {
    return (
      <div className="bg-[#F4F7FE] min-h-screen p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading case file...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F4F7FE] min-h-screen p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error loading case file:</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/counsellor-dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Caseload
        </button>
      </div>
    );
  }

  if (!studentDoc) {
    return null;
  }

  const studentName = studentDoc.name || studentDoc.displayName || 'Unknown Student';
  const grade = studentDoc.grade || studentDoc.currentGrade || 'N/A';
  const school = studentDoc.school || studentDoc.schoolName || 'N/A';
  const hasRiasec = studentDoc.careerDNA?.riasec?.code;
  const riasecCode = hasRiasec ? studentDoc.careerDNA.riasec.code : null;

  // Extract intake data
  const email = studentDoc.email || 'N/A';
  const phone = studentDoc.phone || studentDoc.phoneNumber || 'N/A';
  const parentName = studentDoc.parentName || studentDoc.guardianName || 'N/A';
  const parentPhone = studentDoc.parentPhone || studentDoc.guardianPhone || 'N/A';
  const stream = studentDoc.stream || studentDoc.academicStream || 'N/A';
  const board = studentDoc.board || 'N/A';

  // Extract college shortlist
  const collegeShortlist = studentDoc.collegeShortlist || { dream: [], target: [], safe: [] };

  // Extract case history
  const caseHistory = caseFileDoc?.history || [];

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="bg-[#F4F7FE] min-h-screen p-8">
      {/* Header Area */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/counsellor-dashboard')}
          className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
        >
          ← Back to Caseload
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{studentName}</h1>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Grade:</span> {grade}
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">School:</span> {school}
                </span>
              </div>
            </div>

            <div>
              {riasecCode ? (
                <div className="inline-flex flex-col items-end">
                  <span className="text-xs text-gray-500 mb-1">Career DNA</span>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-lg font-bold bg-green-100 text-green-800">
                    {riasecCode}
                  </span>
                </div>
              ) : (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-600">
                  Assessment Pending
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Intake Profile & College Shortlist */}
        <div className="lg:col-span-2 space-y-8">
          {/* Intake Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span>
              Intake Profile
            </h2>

            <div className="space-y-4">
              {/* Personal Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500 block mb-1">Email</span>
                    <span className="text-sm font-medium text-gray-900">{email}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500 block mb-1">Phone</span>
                    <span className="text-sm font-medium text-gray-900">{phone}</span>
                  </div>
                </div>
              </div>

              {/* Parent/Guardian Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Parent/Guardian Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500 block mb-1">Name</span>
                    <span className="text-sm font-medium text-gray-900">{parentName}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500 block mb-1">Phone</span>
                    <span className="text-sm font-medium text-gray-900">{parentPhone}</span>
                  </div>
                </div>
              </div>

              {/* Academic Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Academic Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500 block mb-1">Stream</span>
                    <span className="text-sm font-medium text-gray-900">{stream}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-500 block mb-1">Board</span>
                    <span className="text-sm font-medium text-gray-900">{board}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* College Shortlist Card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              College Shortlist
            </h2>

            {collegeShortlist.dream.length === 0 &&
             collegeShortlist.target.length === 0 &&
             collegeShortlist.safe.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No colleges added to shortlist yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Dream Colleges */}
                {collegeShortlist.dream.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span>🌟</span> Dream Colleges
                    </h3>
                    <div className="space-y-2">
                      {collegeShortlist.dream.map((college, idx) => (
                        <div key={idx} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{college.name}</div>
                          {college.course && (
                            <div className="text-sm text-gray-600 mt-1">{college.course}</div>
                          )}
                          {college.location && (
                            <div className="text-xs text-gray-500 mt-1">📍 {college.location}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Colleges */}
                {collegeShortlist.target.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span>🎯</span> Target Colleges
                    </h3>
                    <div className="space-y-2">
                      {collegeShortlist.target.map((college, idx) => (
                        <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{college.name}</div>
                          {college.course && (
                            <div className="text-sm text-gray-600 mt-1">{college.course}</div>
                          )}
                          {college.location && (
                            <div className="text-xs text-gray-500 mt-1">📍 {college.location}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safe Colleges */}
                {collegeShortlist.safe.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                      <span>✅</span> Safe Colleges
                    </h3>
                    <div className="space-y-2">
                      {collegeShortlist.safe.map((college, idx) => (
                        <div key={idx} className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{college.name}</div>
                          {college.course && (
                            <div className="text-sm text-gray-600 mt-1">{college.course}</div>
                          )}
                          {college.location && (
                            <div className="text-xs text-gray-500 mt-1">📍 {college.location}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Case Notes & Activity */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Case Notes & Activity
            </h2>

            {caseHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No activity recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {caseHistory.map((entry, idx) => (
                  <div key={idx} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-0 -translate-x-[9px] w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {entry.action || entry.title || 'Activity'}
                      </div>
                      {entry.description && (
                        <div className="text-xs text-gray-600 mb-2">{entry.description}</div>
                      )}
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(entry.timestamp || entry.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseFileViewer;
