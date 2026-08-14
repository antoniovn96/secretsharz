import React, { useState } from 'react';
import { buildResultView } from './assessmentResultView';
import { startCareerAssessmentCheckout } from './careerAssessmentPayment';

const styles = `
.car-result{max-width:1100px;margin:0 auto;padding:32px 20px 80px;color:#1e2820;font-family:inherit}
.car-result-hero{background:linear-gradient(135deg,#eef7f0,#fffaf4);border:1px solid rgba(74,124,89,.16);border-radius:28px;padding:34px;margin-bottom:24px}
.car-result-kicker{font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#4a7c59;margin-bottom:10px}
.car-result h1{font-size:clamp(30px,5vw,48px);margin:0 0 10px;font-family:Georgia,serif}
.car-result-sub{color:#5f6f64;max-width:760px;line-height:1.7}
.car-result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;margin-bottom:24px}
.car-result-card{background:#fff;border:1px solid rgba(74,124,89,.13);border-radius:20px;padding:22px;box-shadow:0 8px 25px rgba(30,40,32,.06)}
.car-result-card h2{font-size:17px;margin:0 0 14px}.car-code{font-size:32px;font-weight:800;color:#4a7c59;letter-spacing:4px}.car-pill{display:inline-block;padding:7px 11px;border-radius:999px;background:#eef7f0;color:#315c40;font-size:12px;font-weight:700;margin:4px}
.car-result-list{display:grid;gap:12px}.car-result-item{padding:16px;border:1px solid #e8eee9;border-radius:14px}.car-result-item strong{display:block;margin-bottom:4px}.car-result-item span{font-size:13px;color:#6d7c71}
.car-locked{background:#fff8ee;border:1px dashed #d9a45c;border-radius:20px;padding:24px;margin-bottom:24px}.car-locked h2{margin-top:0}.car-locked ul{margin:12px 0 18px;padding-left:20px}.car-result-btn{border:0;background:#4a7c59;color:#fff;padding:12px 18px;border-radius:999px;font-weight:800;cursor:pointer}.car-result-btn:disabled{opacity:.55;cursor:wait}.car-error{margin:0 0 16px;padding:12px 14px;border-radius:12px;background:#fff0ef;color:#8b2f2a;font-size:13px;font-weight:600}
.car-disclaimer{font-size:13px;line-height:1.7;color:#68756b;background:#f7f8f7;border-radius:18px;padding:20px}
`;

export default function CareerAssessmentResult({ result, assessmentAttemptId, onUnlock, onExploreCareer, onExploreCourse, onExploreCollege }) {
  const view = buildResultView(result);
  const full = view.access === 'full';
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleUnlock() {
    setError('');
    setBusy(true);
    try {
      if (onUnlock) await onUnlock();
      else await startCareerAssessmentCheckout(assessmentAttemptId);
    } catch (err) {
      setError(err?.message || 'Unable to start payment.');
      setBusy(false);
    }
  }

  return <>
    <style>{styles}</style>
    <main className="car-result">
      <section className="car-result-hero">
        <div className="car-result-kicker">VidyaVantage · Career Discovery</div>
        <h1>{view.title}</h1>
        <p className="car-result-sub">Your assessment is a starting point for exploration — not a fixed prediction of what you must become.</p>
      </section>

      <section className="car-result-grid">
        <article className="car-result-card">
          <h2>Your interest pattern</h2>
          <div className="car-code">{view.profile.hollandCode || '—'}</div>
          <div>{view.profile.topInterests.map((x, i) => <span className="car-pill" key={x.code || x.name || i}>{x.name || x.code}</span>)}</div>
        </article>
        <article className="car-result-card">
          <h2>What stands out</h2>
          <div className="car-result-list">
            {view.profile.strongestDimensions.map(({ dimension, score }) => <div className="car-result-item" key={dimension}><strong>{dimension.replaceAll('_',' ')}</strong><span>Assessment indicator: {score}</span></div>)}
          </div>
        </article>
      </section>

      {!full && <section className="car-locked">
        <h2>🔓 Your comprehensive discovery report</h2>
        <p>Your snapshot is ready. The comprehensive report adds broader career possibilities, course pathways, college matches and a personalised roadmap.</p>
        <ul>{view.lockedSections.map(section => <li key={section}>{section.replaceAll('_',' ')}</li>)}</ul>
        {error && <div className="car-error">{error}</div>}
        <button className="car-result-btn" onClick={handleUnlock} disabled={busy || !assessmentAttemptId}>{busy ? 'Opening secure checkout…' : 'Unlock Full Report'}</button>
        {!assessmentAttemptId && <p style={{marginTop:10,fontSize:12,color:'#7a6248'}}>Your assessment session is still being prepared. Please return to the assessment dashboard and try again.</p>}
      </section>}

      {full && <>
        <section className="car-result-card" style={{marginBottom:24}}>
          <h2>🧭 Careers to explore</h2>
          <div className="car-result-list">{view.careers.map((career, i) => <div className="car-result-item" key={career.careerId || career.id || i}><strong>{career.title || career.name || career.careerId}</strong><span>{career.reason || career.description || 'Explore this pathway and decide whether it fits you.'}</span>{onExploreCareer && <button className="car-result-btn" style={{marginTop:10}} onClick={() => onExploreCareer(career)}>Explore</button>}</div>)}</div>
        </section>
        <section className="car-result-grid">
          <article className="car-result-card"><h2>🎓 Courses</h2><div className="car-result-list">{view.courses.map((course, i) => <div className="car-result-item" key={course.id || i}><strong>{course.name || course.title}</strong><span>{course.duration || course.description || 'Explore course details.'}</span>{onExploreCourse && <button className="car-result-btn" style={{marginTop:10}} onClick={() => onExploreCourse(course)}>View Course</button>}</div>)}</div></article>
          <article className="car-result-card"><h2>🏫 Colleges</h2><div className="car-result-list">{view.colleges.map((college, i) => <div className="car-result-item" key={college.id || i}><strong>{college.name || college.title}</strong><span>{college.location || college.description || 'Verify current programme information with the institution.'}</span>{onExploreCollege && <button className="car-result-btn" style={{marginTop:10}} onClick={() => onExploreCollege(college)}>View College</button>}</div>)}</div></article>
        </section>
        <section className="car-result-card" style={{marginBottom:24}}><h2>🛣️ Your roadmap</h2><div className="car-result-list">{view.roadmap.map((step, i) => <div className="car-result-item" key={step.id || i}><strong>{step.title || step.name || `Step ${i+1}`}</strong><span>{step.description || step.action || ''}</span></div>)}</div></section>
      </>}

      <p className="car-disclaimer"><strong>Important:</strong> {view.disclaimer || 'These results are based on the answers you provided and are intended to support exploration. Your interests can change, your skills can grow, and these recommendations do not limit what you can become. With interest, learning, preparation and hard work, you can pursue paths beyond the options shown here.'}</p>
    </main>
  </>;
}
