import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { COLLECTIONS } from '../../utils/constants';
import { Users, Filter, Eye, UserPlus, CheckCircle, Clock } from 'lucide-react';

export default function AdminCommandCenter() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'onboarding', 'active'

  useEffect(() => {
    // Fetch students from the students collection in real-time
    const q = query(collection(db, COLLECTIONS.STUDENTS), orderBy('__name__', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching students:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredStudents = students.filter(student => {
    if (filter === 'all') return true;
    if (filter === 'onboarding') return student.status === 'onboarding' || !student.status;
    if (filter === 'active') return student.status === 'active';
    return true;
  });

  const getStaffIndicators = (assignedStaff) => {
    if (!assignedStaff) return <span className="text-gray-400 text-sm">None</span>;
    
    return (
      <div className="flex gap-2">
        {assignedStaff.career && (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold" title="Career Coach Assigned">C</span>
        )}
        {assignedStaff.psych && (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold" title="Psychologist Assigned">P</span>
        )}
        {assignedStaff.sen && (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold" title="SEN Specialist Assigned">S</span>
        )}
        {!assignedStaff.career && !assignedStaff.psych && !assignedStaff.sen && (
          <span className="text-gray-400 text-sm">None</span>
        )}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" /> Active
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <Clock size={12} className="mr-1" /> Onboarding
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
        Loading Student Records...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Super Admin Command Center</h2>
          <p className="text-sm text-gray-500 mt-1">Manage incoming students, triage concerns, and assign professionals.</p>
        </div>
        <div className="flex gap-3 bg-white p-1 rounded-lg shadow-sm border border-gray-100">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
          >
            All Students
          </button>
          <button 
            onClick={() => setFilter('onboarding')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'onboarding' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Needs Assignment
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${filter === 'active' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Active
          </button>
        </div>
      </div>

      {/* Modern Tailwind Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Primary Concern
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Assigned Staff
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{student.profile?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{student.parent?.email || 'No email provided'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.school?.grade || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2 max-w-xs">
                        {student.intake?.primaryConcern || 'No concern listed'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStaffIndicators(student.assignedStaff)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/student/${student.id}`)}
                        className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md font-medium transition-colors"
                      >
                        <Eye size={16} className="mr-1.5" /> Triage / View File
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Users size={48} className="text-gray-300 mb-4" />
                      <p className="text-lg font-medium text-gray-900">No students found</p>
                      <p className="text-sm text-gray-500 mt-1">No students match the current filter criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination placeholder if needed in the future */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{filteredStudents.length}</span> students
          </div>
        </div>
      </div>
    </div>
  );
}
