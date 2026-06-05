import React from 'react';
import { S } from './styles';

// CGPA → Percentage conversion (standard formula: CGPA × 9.5)
const cgpaToPercentage = (cgpa) => {
  const val = parseFloat(cgpa);
  if (isNaN(val) || val < 0 || val > 10) return null;
  return (val * 9.5).toFixed(2);
};

/**
 * MarksInput — renders the marks format selector + the appropriate input(s)
 * for a single education tier.
 */
function MarksInput({ tierData, onTierChange }) {
  const { marksType, marksValue, marksMax, marksObtained } = tierData;
  const cgpaPct = marksType === 'cgpa' ? cgpaToPercentage(marksValue) : null;

  return (
    <div style={S.fieldGroup}>
      <label style={S.label}>Marks / Grade Format</label>
      <div style={S.marksTypeRow}>
        {[
          { key: 'percentage', label: '% Percentage' },
          { key: 'cgpa', label: '🔢 CGPA' },
          { key: 'raw', label: '📊 Raw Marks' },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            style={S.marksTypeBtn(marksType === key)}
            onClick={() => onTierChange({ marksType: key, marksValue: '', marksMax: '', marksObtained: '' })}
          >
            {label}
          </button>
        ))}
      </div>

      {marksType === 'percentage' && (
        <div style={{ marginTop: '10px' }}>
          <input
            type="number"
            value={marksValue}
            onChange={(e) => onTierChange({ marksValue: e.target.value })}
            placeholder="e.g. 91.4"
            min="0"
            max="100"
            step="0.01"
            style={S.input}
          />
        </div>
      )}

      {marksType === 'cgpa' && (
        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="number"
            value={marksValue}
            onChange={(e) => onTierChange({ marksValue: e.target.value })}
            placeholder="e.g. 9.2"
            min="0"
            max="10"
            step="0.01"
            style={S.input}
          />
          {cgpaPct !== null && (
            <div style={S.cgpaHint}>
              <span>✅</span>
              <span>
                Equivalent Percentage: <strong>{cgpaPct}%</strong>
                <span style={{ fontWeight: 400, marginLeft: '6px', color: '#047857' }}>
                  (CGPA × 9.5 formula)
                </span>
              </span>
            </div>
          )}
          {marksValue && cgpaPct === null && (
            <div style={{ ...S.disabledNote, color: '#EF4444' }}>
              <span>⚠️</span>
              <span>Enter a valid CGPA between 0 and 10.</span>
            </div>
          )}
        </div>
      )}

      {marksType === 'raw' && (
        <div style={{ ...S.twoCol, marginTop: '10px' }}>
          <div style={S.fieldGroup}>
            <label style={S.label}>Max Marks</label>
            <input
              type="number"
              value={marksMax}
              onChange={(e) => onTierChange({ marksMax: e.target.value })}
              placeholder="e.g. 500"
              min="0"
              style={S.input}
            />
          </div>
          <div style={S.fieldGroup}>
            <label style={S.label}>Marks Obtained</label>
            <input
              type="number"
              value={marksObtained}
              onChange={(e) => onTierChange({ marksObtained: e.target.value })}
              placeholder="e.g. 456"
              min="0"
              max={marksMax || undefined}
              style={S.input}
            />
          </div>
          {marksMax && marksObtained && (
            <div style={{ ...S.cgpaHint, gridColumn: '1 / -1' }}>
              <span>📊</span>
              <span>
                Equivalent Percentage:{' '}
                <strong>
                  {((parseFloat(marksObtained) / parseFloat(marksMax)) * 100).toFixed(2)}%
                </strong>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MarksInput;
