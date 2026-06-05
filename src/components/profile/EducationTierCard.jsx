import React from 'react';
import AutocompleteInput from '../AutocompleteInput';
import { S } from './styles';
import MarksInput from './MarksInput';
import TagInput from './TagInput';

/**
 * EducationTierCard — renders a collapsible card for one education tier
 * (10th, 12th, Graduate, Post Graduate).
 */
function EducationTierCard({ icon, title, tierData, onTierChange, options = [] }) {
  return (
    <div style={S.tierCard}>
      <div style={S.tierCardHeader}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span style={S.tierCardTitle}>{title}</span>
      </div>
      <div style={S.tierCardBody}>
        {/* School Name */}
        <div style={S.fieldGroup}>
          <label style={S.label}>School / Institution Name</label>
          <AutocompleteInput
            options={options}
            value={tierData.schoolName}
            onChange={(val) => onTierChange({ schoolName: val })}
            placeholder="Type 3 letters to search schools/colleges..."
          />
        </div>

        {/* Marks */}
        <MarksInput tierData={tierData} onTierChange={onTierChange} />

        {/* Subjects */}
        <TagInput
          label="Subjects"
          values={Array.isArray(tierData.subjects) ? tierData.subjects : []}
          onChange={(val) => onTierChange({ subjects: val })}
          placeholder="e.g. Physics, Chemistry, Maths..."
        />
      </div>
    </div>
  );
}

export default EducationTierCard;
