import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { getAssignedStudents } from '../../services/studentService';

const CounsellorDashboard = ({ navigate }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No user is currently logged in.');
        }

        const assignedStudents = await getAssignedStudents(currentUser.uid);
        setStudents(assignedStudents);
      } catch (err) {
        console.error('Error fetching assigned students:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedStudents();
  }, []);

  const handleViewCaseFile = (studentId) => {
    navigate(`/counsellor/student/${studentId}`);
  };

  if (loading) {
    return (
      <div className="bg-[#F4F7FE] min-h-screen p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your caseload...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F4F7FE] min-h-screen p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error loading students:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F7FE] min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-6">My Assigned Caseload</h2>

      {students.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <p className="text-gray-500 text-lg">No students assigned to you yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Student Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Grade & School
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    RIASEC Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student) => {
                  const hasRiasec = student.careerDNA?.riasec?.code;
                  const studentName = student.name || student.displayName || 'Unknown Student';
                  const grade = student.grade || student.currentGrade || 'N/A';
                  const school = student.school || student.schoolName || 'N/A';

                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {studentName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div>
                          <div className="font-medium">Grade {grade}</div>
                          <div className="text-gray-500">{school}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {hasRiasec ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {student.careerDNA.riasec.code}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleViewCaseFile(student.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          View Case File
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Total Students: <span className="font-semibold text-gray-900">{students.length}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounsellorDashboard;
