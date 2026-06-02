import React, { useState, useRef, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// AutocompleteInput
//
// Props:
//   options      — string[]  — the full list of suggestions
//   value        — string    — current input value (controlled)
//   onChange     — fn(str)   — called with the new string value
//   placeholder  — string    — input placeholder text
// ─────────────────────────────────────────────────────────────────────────────

export default function AutocompleteInput({ options = [], value = '', onChange, placeholder = '' }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Safety check: ensure value is always a string and not null/undefined
  const query = value == null ? '' : String(value);
  
  // Filter: only show when ≥ 3 chars typed
  const filtered =
    query.trim().length >= 3
      ? options.filter((opt) =>
          opt != null && String(opt).toLowerCase().includes(query.trim().toLowerCase())
        )
      : [];

  const showDropdown = open && filtered.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    onChange(e.target.value);
    setOpen(true);
    setActiveIdx(-1);
  };

  const handleSelect = (opt) => {
    onChange(String(opt));
    setOpen(false);
    setActiveIdx(-1);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0 && activeIdx < filtered.length) {
        e.preventDefault();
        handleSelect(filtered[activeIdx]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  return (
    <div ref={containerRef} style={styles.wrapper}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        style={styles.input}
        aria-autocomplete="list"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
      />
      {showDropdown && (
        <ul style={styles.dropdown} role="listbox">
          {filtered.map((opt, idx) => {
            // CRITICAL: always render a plain string — never a raw object
            const label = String(opt);
            const isActive = idx === activeIdx;
            return (
              <li
                key={idx}
                role="option"
                aria-selected={isActive}
                style={isActive ? { ...styles.item, ...styles.itemActive } : styles.item}
                onMouseDown={(e) => {
                  // Use mousedown so it fires before the input's blur
                  e.preventDefault();
                  handleSelect(label);
                }}
                onMouseEnter={() => setActiveIdx(idx)}
              >
                {/* Highlight the matching portion */}
                <HighlightMatch text={label} query={query.trim()} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HighlightMatch — bolds the matched substring inside a suggestion
// Prevents React Error #306 by only ever rendering strings inside <span>s
// ─────────────────────────────────────────────────────────────────────────────
function HighlightMatch({ text, query }) {
  if (!query || query.length < 3) return <span>{String(text)}</span>;

  const safeText = String(text);
  const idx = safeText.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{safeText}</span>;

  const before = safeText.slice(0, idx);
  const match = safeText.slice(idx, idx + query.length);
  const after = safeText.slice(idx + query.length);

  return (
    <span>
      {before && <span>{before}</span>}
      <span style={styles.highlight}>{match}</span>
      {after && <span>{after}</span>}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES — matches the existing ProfileEditor dashboard aesthetic
// ─────────────────────────────────────────────────────────────────────────────
const styles = {
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #E1E7EF',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    color: '#0D1117',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: '#FFFFFF',
    border: '1.5px solid #C7D2FE',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(79,70,229,0.13), 0 2px 8px rgba(0,0,0,0.08)',
    zIndex: 9999,
    maxHeight: '220px',
    overflowY: 'auto',
    margin: 0,
    padding: '6px 0',
    listStyle: 'none',
  },
  item: {
    padding: '9px 16px',
    fontSize: '13px',
    color: '#374151',
    cursor: 'pointer',
    transition: 'background 0.12s',
    lineHeight: '1.5',
    userSelect: 'none',
  },
  itemActive: {
    background: '#EEF2FF',
    color: '#4338CA',
  },
  highlight: {
    fontWeight: '700',
    color: '#4F46E5',
    background: 'transparent',
  },
};