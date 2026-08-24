import React from 'react';

export const ASSESSMENT_SOURCE_LABELS = Object.freeze({
  assessed: 'Assessed',
  partially_assessed: 'Partially assessed',
  derived_from_assessment: 'Derived from assessment evidence',
  career_catalogue: 'Career catalogue information',
  not_assessed: 'Not assessed',
  unavailable: 'Not available',
});

export default function AssessmentEvidenceBadge({ source }) {
  const label = ASSESSMENT_SOURCE_LABELS[source] || ASSESSMENT_SOURCE_LABELS.unavailable;
  return <span style={{display:'inline-block',fontSize:10,fontWeight:900,color:'#475569',background:'#f1f5f9',borderRadius:999,padding:'4px 8px',marginLeft:8}}>{label}</span>;
}
