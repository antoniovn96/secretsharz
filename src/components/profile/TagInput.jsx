import React, { useState } from 'react';
import AutocompleteInput from '../AutocompleteInput';
import { S } from './styles';

/** A controlled tag-input: shows existing tags + an input to add new ones */
function TagInput({ label, values, onChange, placeholder, disabled, options = [] }) {
  const [inputVal, setInputVal] = useState('');

  const addTag = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) return;
    if (!values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
    setInputVal('');
  };

  return (
    <div style={S.fieldGroup}>
      <label style={S.label}>{label}</label>
      {values.length > 0 && (
        <div style={S.tagRow}>
          {values.map((v, i) => (
            <span key={i} style={S.tag}>
              {String(v)}
              {!disabled && (
                <button
                  type="button"
                  style={S.tagRemove}
                  onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                  aria-label={`Remove ${v}`}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      {!disabled && (
        <div 
          style={S.tagInputRow} 
          onKeyDown={(e) => { 
            if (e.key === 'Enter') { 
              e.preventDefault(); 
              addTag(); 
            } 
          }}
        >
          <div style={{ flex: 1 }}>
            <AutocompleteInput
              options={options}
              value={inputVal}
              onChange={setInputVal}
              placeholder={placeholder || `Add ${label.toLowerCase()}...`}
            />
          </div>
          <button type="button" style={S.tagAddBtn} onClick={addTag}>
            + Add
          </button>
        </div>
      )}
    </div>
  );
}

export default TagInput;
