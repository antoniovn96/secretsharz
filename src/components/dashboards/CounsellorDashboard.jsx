import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';

const CounsellorDashboard = ({ navigate }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchAssignedStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error('No user is currently logged in.');
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/professional/caseload?service=wellbeing', { headers: { Authorization: `Bearer ${token}` } });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || 'Unable to load your counselling caseload.');
        if (active) setStudents(payload.students || []);
      } catch (err) {
        console.error('Error fetching assigned counselling students:', err);
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchAssignedStudents();
    return () => { active = false; };
  }, []);

  const handleViewCaseFile = (studentId) => navigate(`/counsellor/student/${studentId}`);

  if (loading) return <div className="bg-[#F4F7FE] min-h-screen p-8 flex items-center justify-center"><div className="flex flex-col items-center gap-4"><div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /><p className="text-gray-600 font-medium">Loading your caseload...</p></div></div>;
  if (error) return <div className="bg-[#F4F7FE] min-h-screen p-8"><div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"><p className="font-semibold">Error loading students:</p><p>{error}</p></div></div>;

  return <div className="bg-[#F4F7FE] min-h-screen p-8">
    <h2 className="text-2xl font-bold mb-6">My Assigned Counselling Caseload</h2>
    {students.length === 0 ? <div className="bg-white rounded-2xl shadow-sm p-8 text-center"><p className="text-gray-500 text-lg">No students assigned to you yet.</p></div> : <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto"><table className="w-full"><thead className="bg-gray-50 border-b border-gray-200"><tr><th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th><th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Grade & School</th><th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Case Status</th><th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th></tr></thead>
        <tbody className="divide-y divide-gray-200">{students.map(student => { const studentName = student.name || 'Unknown Student'; const grade = student.grade || 'N/A'; const school = student.school || 'N/A'; const profilePic = student.photoURL || student.profilePicture || null; const initial = studentName.trim().charAt(0).toUpperCase() || '?'; return <tr key={student.uid} className="hover:bg-gray-50 transition-colors"><td className="px-6 py-4 text-sm text-gray-900 font-medium"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full overflow-hidden bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">{profilePic ? <img src={profilePic} alt={`${studentName} profile`} className="w-full h-full object-cover" /> : initial}</div><span>{studentName}</span></div></td><td className="px-6 py-4 text-sm text-gray-600"><div><div className="font-medium">Grade {grade}</div><div className="text-gray-500">{school}</div></div></td><td className="px-6 py-4 text-sm"><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Active Counselling Case</span></td><td className="px-6 py-4 text-sm"><button onClick={() => handleViewCaseFile(student.uid)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">View Case File</button></td></tr>; })}</tbody></table></div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200"><p className="text-sm text-gray-600">Total Students: <span className="font-semibold text-gray-900">{students.length}</span></p></div>
    </div>}
  </div>;
};

export default CounsellorDashboard;
