import React from 'react';
import { S } from './styles';

/** Simple toggle switch */
function Toggle({ label, sublabel, checked, onChange }) {
  return (
    <div style={S.toggleRow}>
      <div>
        <div style={S.toggleLabel}>{label}</div>
        {sublabel && <div style={S.infoNote}>{sublabel}</div>}
      </div>
      <div
        role="switch"
        aria-checked={checked}
        style={S.toggleTrack(checked)}
        onClick={() => onChange(!checked)}
      >
        <div style={S.toggleThumb(checked)} />
      </div>
    </div>
  );
}

export default Toggle;
