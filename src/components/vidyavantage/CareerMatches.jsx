import React from 'react';

/**
 * Displays authoritative Career recommendations supplied by the canonical
 * Career profile/API. This component deliberately does NOT calculate matches
 * from RIASEC on the client.
 */
export default function CareerMatches({ careerExploration = [], riasecCode = '' }) {
  const careers = Array.isArray(careerExploration) ? careerExploration : [];

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Career Matches</h2>
          <p className="text-gray-500 mt-1">
            {riasecCode
              ? `Based on your Career assessment profile (${riasecCode})`
              : 'Based on your completed Career assessment'}
          </p>
        </div>
      </div>

      {!careers.length ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-gray-600">
          Career recommendations are not available for this assessment yet. No replacement or inferred matches are shown.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {careers.map((career, index) => (
            <div key={career.id || `${career.name}-${index}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight pr-2">
                    {career.name || career.title || 'Career pathway'}
                  </h3>
                  {career.explorationIndex != null && (
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                      {career.explorationIndex}% Match
                    </span>
                  )}
                </div>
                <div className="inline-block bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-lg font-medium mb-4">
                  {career.stream || career.category || 'Career direction'}
                </div>
              </div>
              <button className="w-full mt-4 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-2.5 px-4 rounded-xl transition-colors">
                Explore Pathway
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
