import React from 'react';

export default function StudentProfileView({ studentDoc }) {
  const profile = studentDoc?.profile || {};
  const parent = studentDoc?.parent || {};
  const school = studentDoc?.school || {};

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Profile</h2>
      
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500 block">Name</span>
            <span className="font-medium text-gray-900">{profile.name || studentDoc?.name || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block">Date of Birth</span>
            <span className="font-medium text-gray-900">{profile.dob || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block">Phone</span>
            <span className="font-medium text-gray-900">{profile.phone || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block">Gender</span>
            <span className="font-medium text-gray-900">{profile.gender || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Parent Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500 block">Parent Name</span>
            <span className="font-medium text-gray-900">{parent.name || studentDoc?.fatherName || studentDoc?.motherName || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block">Parent Email</span>
            <span className="font-medium text-gray-900">{parent.email || studentDoc?.fatherEmail || studentDoc?.motherEmail || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block">Parent Phone</span>
            <span className="font-medium text-gray-900">{parent.phone || studentDoc?.fatherPhone || studentDoc?.motherPhone || 'Not provided'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">School Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500 block">School Name</span>
            <span className="font-medium text-gray-900">{school.name || studentDoc?.schoolName || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block">Grade</span>
            <span className="font-medium text-gray-900">{school.grade || studentDoc?.gradeLevel || 'Not provided'}</span>
          </div>
          <div>
            <span className="text-sm text-gray-500 block">Board</span>
            <span className="font-medium text-gray-900">{school.board || studentDoc?.schoolBoard || 'Not provided'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
