import React from 'react';
import { getCareersByCode } from '../../utils/riasecMapping';

export default function CareerMatches({ riasecCode }) {
  if (!riasecCode) return null;

  const careers = getCareersByCode(riasecCode);

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Career Matches</h2>
          <p className="text-gray-500 mt-1">Based on your RIASEC profile ({riasecCode})</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {careers.map((career, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900 leading-tight pr-2">{career.title}</h3>
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                  {career.match} Match
                </span>
              </div>
              <div className="inline-block bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-lg font-medium mb-4">
                {career.cluster}
              </div>
            </div>
            <button className="w-full mt-4 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-2.5 px-4 rounded-xl transition-colors">
              Explore Pathway
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
