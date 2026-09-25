import React, { useEffect, useMemo, useState } from 'react';
import AssessmentAccessibilityShell from './AssessmentAccessibilityShell';
import { RIASEC_V1, scoreRiasecV1 } from './riasecInterestExplorerV1';
import { buildRiasecReportPayload } from './riasecReportPayloadV1';
import { buildRiasecAssessmentResultV1 } from './riasecAssessmentResultV1';

const styles = {
  page: { minHeight:'100vh', background:'#f8fafc', color:'#0f172a', padding:'24px 16px 48px' },
  shell: { maxWidth:860, margin:'0 auto' },
  card: { background:'#fff', border:'1px solid #e2e8f0', borderRadius:22, padding:'26px', boxShadow:'0 12px 38px rgba(15,23,42,.06)' },
  track: { height:10, background:'#e2e8f0', borderRadius:999, overflow:'hidden' },
  nav: { display:'flex', justifyContent:'space-between', gap:10, marginTop:24 },
  button: { minHeight:46, border:'2px solid #0f172a', borderRadius:13, background:'#fff', padding:'0 16px', cursor:'pointer', fontWeight:900 },
};

export default function RiasecInterestExplorerV1({ onComplete, initialAnswers = {}, context = {} }) {
  const [answers, setAnswers] = useState(initialAnswers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startedAt] = useState(() => new Date().toISOString());
  const item = RIASEC_V1.items[currentIndex];
  const currentValue = answers[item.id] ?? null;
  const progress = Math.round(((currentIndex + (currentValue != null ? 1 : 0)) / RIASEC_V1.items.length) * 100);
  const liveResult = useMemo(() => scoreRiasecV1(answers, { startedAt }), [answers, startedAt]);
  const liveReport = useMemo(() => buildRiasecReportPayload(liveResult, {
    audience: context.audience || 'student',
    studentStage: context.studentStage,
    recommendedNextAssessment: 'career_aptitude_core',
  }), [liveResult, context.audience, context.studentStage]);

  useEffect(() => {
    if (typeof onComplete !== 'function') return;
    if (currentIndex !== RIASEC_V1.items.length - 1) return;
    if (Object.keys(answers).length !== RIASEC_V1.items.length) return;
    onComplete({ answers, result: liveResult, reportPayload: liveReport, assessmentResult: buildRiasecAssessmentResultV1({
      score: liveResult,
      personId: context.personId,
      accountId: context.accountId,
      institutionRelationshipId: context.institutionRelationshipId,
      serviceEngagementId: context.serviceEngagementId,
      entitlementId: context.entitlementId,
      orderId: context.orderId,
      contextSnapshot: context.contextSnapshot || {},
      previousAssessmentResultId: context.previousAssessmentResultId,
      attemptNumber: context.attemptNumber || 1,
    }) });
  }, [answers, currentIndex, liveResult, liveReport, onComplete]);

  const choose = (value) => setAnswers((previous) => ({ ...previous, [item.id]: value }));
  const previous = () => { if (currentIndex > 0) setCurrentIndex((value) => value - 1); };
  const next = () => { if (currentValue != null && currentIndex < RIASEC_V1.items.length - 1) setCurrentIndex((value) => value + 1); };

  return (
    <AssessmentAccessibilityShell>
      <main id="vv-assessment-content" style={{ minHeight:'100vh', background:'#f8fafc', color:'#0f172a', padding:'24px 16px 48px' }}>
        <div style={styles.shell}>
          <div style={{ display:'flex', justifyContent:'space-between', gap:16, alignItems:'center', marginBottom:18 }}>
            <div>
              <span style={{ display:'inline-flex', padding:'7px 10px', borderRadius:999, background:'#eef2ff', color:'#3730a3', fontSize:12, fontWeight:900 }}>CAREER INTEREST EXPLORER · RIASEC</span>
              <h1 style={{ margin:'10px 0 0', fontSize:'clamp(25px,5vw,38px)' }}>Discover the activities you may enjoy.</h1>
            </div>
            <div style={{ fontSize:13, fontWeight:900, color:'#475569', whiteSpace:'nowrap' }}>{currentIndex + 1} / {RIASEC_V1.items.length}</div>
          </div>

          <div style={{ marginBottom:16 }}>
            <div style={styles.track} aria-label={'Question ' + (currentIndex + 1) + ' of ' + RIASEC_V1.items.length}>
              <div style={{ height:'100%', background:'#4f46e5', borderRadius:999, width: progress + '%' }} />
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:7, fontSize:12, color:'#64748b', fontWeight:800 }}>
              <span>{progress}% complete</span>
              <span>There are no right or wrong answers.</span>
            </div>
          </div>

          <section style={styles.card} aria-labelledby="riasec-question">
            <div style={{ fontSize:12, fontWeight:900, letterSpacing:1.2, color:'#64748b' }}>ONE QUESTION AT A TIME</div>
            <h2 id="riasec-question" style={{ fontSize:'clamp(23px,4vw,34px)', lineHeight:1.25, margin:'18px 0 10px' }}>{item.prompt}</h2>
            <p style={{ margin:0, color:'#64748b', lineHeight:1.6 }}>Choose the response that best matches how you would feel about doing this activity.</p>

            <div role="radiogroup" aria-labelledby="riasec-question" style={{ display:'grid', gridTemplateColumns:'repeat(5, minmax(0,1fr))', gap:10, marginTop:24 }}>
              {RIASEC_V1.responseScale.map((option) => {
                const selected = currentValue === option.value;
                return (
                  <button key={option.value} type="button" role="radio" aria-checked={selected} onClick={() => choose(option.value)} style={{ minHeight:88, border:'2px solid ' + (selected ? '#4f46e5' : '#cbd5e1'), background:selected ? '#eef2ff' : '#fff', borderRadius:16, padding:'12px 10px', cursor:'pointer', textAlign:'left', color:'#0f172a', fontWeight:800 }}>
                    <span style={{ display:'block', fontSize:20, marginBottom:6 }}>{option.value}</span>
                    <span style={{ display:'block', fontSize:12, lineHeight:1.35 }}>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div style={styles.nav}>
              <button type="button" onClick={previous} disabled={currentIndex === 0} style={{ ...styles.button, opacity: currentIndex === 0 ? .45 : 1 }}>Back</button>
              <button type="button" onClick={next} disabled={currentValue == null || currentIndex === RIASEC_V1.items.length - 1} style={{ ...styles.button, background:'#0f172a', color:'#fff', opacity: currentValue == null || currentIndex === RIASEC_V1.items.length - 1 ? .55 : 1 }}>Next</button>
            </div>
          </section>

          <p style={{ margin:'14px 4px 0', fontSize:12, color:'#64748b', lineHeight:1.6 }}>Your results describe interest preferences. They do not measure intelligence, guarantee a career outcome or replace counselling.</p>
        </div>
      </main>
    </AssessmentAccessibilityShell>
  );
}