import React, { useId } from 'react';

const LEVELS = [
  { value: 0, face: '😞', label: 'Really unhappy', short: 'Not for me' },
  { value: 25, face: '😕', label: 'Unhappy', short: 'Not enjoyable' },
  { value: 50, face: '😐', label: 'Okay', short: 'It’s okay' },
  { value: 75, face: '😄', label: 'Very happy', short: 'I enjoy it' },
  { value: 100, face: '🥳', label: 'Ultimate!', short: 'I absolutely love it' },
];

function nearestLevel(value) {
  return LEVELS.reduce((best, level) => Math.abs(level.value - value) < Math.abs(best.value - value) ? level : best, LEVELS[0]);
}

export default function SubjectEnjoymentSlider({ value, onChange, subject, disabled = false }) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const numeric = Number.isFinite(Number(value)) ? Number(value) : 50;
  const level = nearestLevel(numeric);

  return (
    <div style={{ padding:'16px 16px 14px', border:'1px solid #e2e8f0', borderRadius:16, background:'#fff' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:10 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:900, color:'#334155' }}>{subject ? `How do you feel when you study ${subject}?` : 'How much do you enjoy this subject?'}</div>
          <div id={descriptionId} style={{ marginTop:3, fontSize:11, color:'#64748b' }}>Use the slider from 0 to 100. 0 means you do not enjoy the subject; 100 means you enjoy it very much.</div>
        </div>
        <div aria-live="polite" aria-atomic="true" style={{ minWidth:76, textAlign:'center' }}>
          <div aria-hidden="true" style={{ fontSize:34, lineHeight:1.05, transition:'transform .18s ease' }} key={level.value}>{level.face}</div>
          <div style={{ marginTop:4, fontSize:10, fontWeight:900, color:'#4f46e5' }}>{level.label}</div>
        </div>
      </div>

      <div style={{ position:'relative', padding:'4px 2px 0' }}>
        <input
          id={id}
          aria-label={subject ? `Enjoyment of ${subject}` : 'Subject enjoyment'}
          aria-describedby={descriptionId}
          type="range"
          min="0"
          max="100"
          step="1"
          value={numeric}
          disabled={disabled}
          onChange={e => onChange?.(Number(e.target.value))}
          style={{ width:'100%', minHeight:44, accentColor:'#4f46e5', cursor:disabled?'not-allowed':'pointer', touchAction:'pan-x' }}
        />
        <div aria-hidden="true" style={{ display:'flex', justifyContent:'space-between', marginTop:5, color:'#64748b', fontSize:10, fontWeight:800 }}>
          <span>😞 Not enjoyable</span>
          <span>😐 Okay</span>
          <span>🥳 Ultimate!</span>
        </div>
      </div>

      <div role="status" aria-live="polite" style={{ marginTop:10, textAlign:'center', color:'#334155', fontSize:12, fontWeight:800 }}>
        Current choice: {level.short} ({numeric} out of 100)
      </div>
    </div>
  );
}

export { LEVELS as SUBJECT_ENJOYMENT_LEVELS };
