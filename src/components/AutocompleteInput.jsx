import React, { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// STYLES (MOVED TO TOP TO FIX VERCEL COMPILATION ERROR)
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
    background: 'transparent', // MUST be transparent to see ghost text behind it
    position: 'relative',
    zIndex: 2,
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  },
  ghostContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: '10px 14px', 
    fontSize: '14px',     
    fontFamily: 'inherit',
    color: 'transparent', 
    background: 'white',  
    border: '1.5px solid transparent', 
    borderRadius: '10px',
    zIndex: 1,
    pointerEvents: 'none',
    whiteSpace: 'pre', 
    overflow: 'hidden',
  },
  ghostMatch: {
    color: '#9CA3AF' // Light grey suggestion color
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

// ─────────────────────────────────────────────────────────────────────────────
// AutocompleteInput (Advanced UX)
//
// Features:
// - Ghost Text (Inline suggestion in grey)
// - Tab to auto-complete
// - Enter to add tag instantly
// - Smart sorting (Starts-with prioritized over includes)
// ─────────────────────────────────────────────────────────────────────────────

export default function AutocompleteInput({ options = [], value = '', onChange, placeholder = '' }) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Safety check: ensure value is always a string
  const query = value == null ? '' : String(value);
  const queryLower = query.toLowerCase();

  // Filter: show when >= 1 char typed. 
  // Smart sort: items that START with the query go to the very top.
  const filtered = query.trim().length >= 1
    ? options
        .filter((opt) => opt != null && String(opt).toLowerCase().includes(query.trim().toLowerCase()))
        .sort((a, b) => {
          const aStarts = String(a).toLowerCase().startsWith(query.trim().toLowerCase());
          const bStarts = String(b).toLowerCase().startsWith(query.trim().toLowerCase());
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
        })
    : [];

  const showDropdown = open && filtered.length > 0;

  // Ghost Text Logic: Find the first option that STARTS with what they typed
  const firstStartsWithMatch = query.length > 0 
    ? options.find(opt => String(opt).toLowerCase().startsWith(queryLower))
    : null;
    
  // The grey text that sits behind the input cursor
  const ghostSuffix = firstStartsWithMatch 
    ? String(firstStartsWithMatch).substring(query.length)
    : '';

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
    if (e.key === 'Tab') {
      // Tab to auto-complete the ghost text
      if (firstStartsWithMatch && ghostSuffix) {
        e.preventDefault();
        onChange(String(firstStartsWithMatch));
        setOpen(false);
      }
    } else if (e.key === 'ArrowDown') {
      if (!showDropdown) return;
      e.preventDefault();
      setActiveIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      if (!showDropdown) return;
      e.preventDefault();
      setActiveIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      // If they are navigating the dropdown, select the item.
      if (showDropdown && activeIdx >= 0) {
        e.preventDefault();
        e.stopPropagation(); // Stops the tag from being added immediately
        handleSelect(filtered[activeIdx]);
      } else {
        // If they just hit enter, let it bubble up to TagInput so it adds the tag!
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  return (
    <div ref={containerRef} style={styles.wrapper}>
      
      {/* ── GHOST TEXT LAYER ── */}
      <div style={styles.ghostContainer}>
        {/* Invisible block pushes the grey text to the exact cursor position */}
        <span style={{ visibility: 'hidden' }}>{query}</span>
        {/* Visible grey text */}
        <span style={styles.ghostMatch}>{ghostSuffix}</span>
      </div>

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
            const label = String(opt);
            const isActive = idx === activeIdx;
            return (
              <li
                key={idx}
                role="option"
                aria-selected={isActive}
                style={isActive ? { ...styles.item, ...styles.itemActive } : styles.item}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(label);
                }}
                onMouseEnter={() => setActiveIdx(idx)}
              >
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
// HighlightMatch
// ─────────────────────────────────────────────────────────────────────────────
function HighlightMatch({ text, query }) {
  if (!query || query.length < 1) return <span>{String(text)}</span>;

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