import React from 'react';

const CollegeShortlist = ({ collegeShortlist = { dream: [], target: [], safe: [] } }) => {
  const renderColumn = (title, colleges, headerColorClass) => (
    <div className="flex flex-col gap-4">
      <h4 className={`text-lg font-semibold border-b pb-2 ${headerColorClass}`}>
        {title}
      </h4>
      {colleges && colleges.length > 0 ? (
        colleges.map((college) => (
          <div
            key={college.id || college.name}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <h5 className="font-medium text-gray-900">{college.name}</h5>
            {college.course && <p className="text-sm text-gray-600 mt-1">{college.course}</p>}
            {college.location && <p className="text-sm text-gray-500 mt-1">{college.location}</p>}
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-400 italic">
          No colleges saved yet. Click Explore to add.
        </p>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {renderColumn('Dream Colleges', collegeShortlist.dream || [], 'text-purple-600 border-purple-200')}
      {renderColumn('Target Colleges', collegeShortlist.target || [], 'text-blue-600 border-blue-200')}
      {renderColumn('Safe Colleges', collegeShortlist.safe || [], 'text-teal-600 border-teal-200')}
    </div>
  );
};

export default CollegeShortlist;
