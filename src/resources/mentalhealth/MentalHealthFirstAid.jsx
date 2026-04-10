import React, { useEffect, useState } from 'react';

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  .cfa-page { min-height: 100vh; background: var(--warm-white, #FDFCFA); font-family: 'Plus Jakarta Sans', sans-serif; padding-bottom: 80px; }
  
  .cfa-hero { background: var(--ink, #1E2820); padding: 80px 48px; text-align: center; color: white; position: relative; overflow: hidden; }
  .cfa-hero::before { content: ''; position: absolute; top: -100px; left: -50px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(74,124,89,0.15), transparent 70%); border-radius: 50%; pointer-events: none;}
  .cfa-hero-inner { position: relative; z-index: 1; max-width: 800px; margin: 0 auto; }
  .cfa-eyebrow { display: inline-block; background: rgba(74,124,89,0.2); border: 1px solid rgba(74,124,89,0.4); color: #87D09E; padding: 6px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
  .cfa-h1 { font-family: 'Fraunces', serif; font-size: clamp(32px, 5vw, 48px); font-weight: 700; line-height: 1.15; margin-bottom: 16px; }
  .cfa-h1 em { font-style: italic; color: #87D09E; }
  .cfa-sub { font-size: 17px; color: rgba(255,255,255,0.7); line-height: 1.6; font-weight: 400; max-width: 650px; margin: 0 auto; }

  .cfa-grid { max-width: 1100px; margin: -40px auto 0; padding: 0 48px; position: relative; z-index: 10; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
  .cfa-card { background: white; border-radius: 20px; border: 1px solid rgba(30,40,32,0.1); box-shadow: 0 8px 24px rgba(0,0,0,0.06); padding: 32px; transition: all 0.3s; display: flex; flex-direction: column; }
  .cfa-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: var(--sage, #4A7C59); }
  
  .cfa-icon { font-size: 40px; margin-bottom: 16px; background: var(--sage-pale); width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border-radius: 16px; }
  .cfa-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink, #1E2820); margin-bottom: 12px; line-height: 1.2; }
  .cfa-desc { font-size: 15px; color: var(--ink-soft, #3D4A40); line-height: 1.6; margin-bottom: 24px; flex: 1; }
  
  .cfa-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--sand); color: var(--ink); padding: 12px 24px; border-radius: 50px; font-size: 14px; font-weight: 700; border: 1px solid var(--border); cursor: pointer; transition: 0.2s; font-family: inherit; justify-content: center; }
  .cfa-btn:hover { background: var(--sage-pale); color: var(--sage); border-color: var(--sage); }

  .cfa-modal-overlay { position: fixed; inset: 0; background: rgba(30,40,32,0.7); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .cfa-modal { background: white; border-radius: 24px; width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto; box-shadow: 0 24px 48px rgba(0,0,0,0.2); }
  .cfa-modal-header { padding: 32px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: white; }
  .cfa-modal-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; color: var(--ink); margin: 0; }
  .cfa-modal-close { background: var(--sand); border: none; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .cfa-modal-body { padding: 32px; font-size: 15px; color: var(--ink-soft); line-height: 1.7; }

  .cfa-triage-box { border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px; border-left: 4px solid; }
  .cfa-triage-box h4 { margin: 0 0 8px; font-family: 'Fraunces', serif; font-size: 18px; color: var(--ink); }

  @media(max-width: 768px) {
    .cfa-hero { padding: 60px 24px 80px; }
    .cfa-grid { padding: 0 24px; grid-template-columns: 1fr; }
    .cfa-modal-header, .cfa-modal-body { padding: 24px; }
  }
`;

export default function MentalHealthFirstAid({ navigate, onBack }) {
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = PAGE_CSS;
    document.head.appendChild(s);
    window.scrollTo(0, 0);
    return () => document.head.removeChild(s);
  }, []);

  const PROTOCOLS = [
    {
      id: 'triage',
      title: 'Crisis Triage Protocol',
      icon: '🚦',
      desc: 'How to accurately assess a student’s risk level (Low, Moderate, Imminent) and determine when it is legally and ethically necessary to break confidentiality.',
      modalContent: (
        <>
          <p>As an educator, you are a mandatory reporter. Use this framework to assess risk during a student disclosure.</p>
          <div className="cfa-triage-box" style={{ borderLeftColor: '#F1C40F', background: '#FEF9E7' }}>
            <h4>Low Risk (Monitor & Support)</h4>
            <p><strong>Signs:</strong> General anxiety, academic stress, peer conflict without violence. No mention of self-harm.</p>
            <p><strong>Action:</strong> Active listening, validate feelings, schedule a follow-up check-in. Maintain confidentiality.</p>
          </div>
          <div className="cfa-triage-box" style={{ borderLeftColor: '#E67E22', background: '#FDF0EA' }}>
            <h4>Moderate Risk (Involve Counsellor)</h4>
            <p><strong>Signs:</strong> Severe bullying, drastic drop in attendance/hygiene, passive thoughts of death ("I wish I could disappear").</p>
            <p><strong>Action:</strong> Do not leave the student isolated. Walk them to the school counsellor. Confidentiality is maintained within the safeguarding team.</p>
          </div>
          <div className="cfa-triage-box" style={{ borderLeftColor: '#C0392B', background: '#FFF0F0' }}>
            <h4>Imminent Risk (Break Confidentiality)</h4>
            <p><strong>Signs:</strong> Active plan for suicide, self-harm, or disclosure of physical/sexual abuse.</p>
            <p><strong>Action:</strong> "I care about you too much to keep this a secret. I have to get help to keep you safe." Escalate to Principal/Child Protection Officer immediately under POCSO guidelines.</p>
          </div>
        </>
      )
    },
    {
      id: 'panic',
      title: 'Panic Attack De-escalation',
      icon: '🛑',
      desc: 'Specific, scripted responses and physical grounding techniques to help guide a student through a severe panic or anxiety attack in the classroom.',
      modalContent: (
        <>
          <p>When a student is having a panic attack, their prefrontal cortex (logic center) goes offline. Do not ask them "What's wrong?" You must regulate their physiology first.</p>
          <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', color: 'var(--ink)', margin: '24px 0 12px' }}>The 4-Step Script:</h4>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><strong>Acknowledge & Anchor:</strong> "I see that you are panicking. I am right here with you. You are safe."</li>
            <li><strong>Remove the Audience:</strong> Have another teacher clear the room, or calmly walk the student to a quiet hallway. Privacy reduces shame.</li>
            <li><strong>The 5-4-3-2-1 Grounding:</strong> "I know it feels scary. Can you look around and name 5 things you can see that are blue? Now name 4 things you can physically feel."</li>
            <li><strong>Regulate Breathing:</strong> "Look at me. Breathe in when I raise my hand. Breathe out when I lower it." (Model deep belly breathing).</li>
          </ol>
        </>
      )
    },
    {
      id: 'listening',
      title: 'The O.A.R.S. Listening Framework',
      icon: '🗣️',
      desc: 'Move beyond "giving advice". Learn the clinical framework for active listening that actually makes students feel heard and understood.',
      modalContent: (
        <>
          <p>Educators are wired to "fix" problems. But when a student is in emotional distress, fixing feels like dismissing. Use O.A.R.S. to validate them.</p>
          <div style={{ background: 'var(--sand)', padding: '24px', borderRadius: '12px', marginTop: '16px' }}>
            <p><strong>O - Open Questions:</strong> Ask questions that cannot be answered with Yes/No. <em>"What did that feel like?"</em></p>
            <p><strong>A - Affirmations:</strong> Validate their strength in sharing. <em>"It took a lot of courage to tell me that."</em></p>
            <p><strong>R - Reflections:</strong> Mirror their emotion back to them. <em>"It sounds like you're feeling incredibly overwhelmed."</em></p>
            <p><strong>S - Summaries:</strong> Recap to ensure understanding. <em>"Let me make sure I have this right. You're saying..."</em></p>
          </div>
        </>
      )
    },
    {
      id: 'boundaries',
      title: 'Counsellor Boundaries',
      icon: '🛡️',
      desc: 'Protecting yourself against compassion fatigue. How to establish safe, professional emotional boundaries with highly dependent students.',
      modalContent: (
        <>
          <p>You cannot pour from an empty cup. Compassion fatigue is a clinical hazard for educators and counsellors.</p>
          <h4 style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', color: 'var(--ink)', margin: '24px 0 12px' }}>Protecting Your Energy:</h4>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><strong>The Savior Complex:</strong> You are not responsible for fixing a student's home life. You are responsible for providing a safe space while they are at school.</li>
            <li><strong>Time Boundaries:</strong> Do not give students your personal WhatsApp number. Set explicit hours for when you are available to listen.</li>
            <li><strong>The "Hand-Off":</strong> Know your scope of practice. If a student needs clinical therapy, holding onto them out of guilt is dangerous. Facilitate a warm hand-off to a professional.</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <div className="cfa-page">
      <div style={{ background: 'var(--ink)', color: 'white', padding: '16px 48px', display: 'flex', alignItems: 'center' }}>
        <button onClick={onBack || (() => navigate && navigate("/resources"))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
          ← Back to Resources
        </button>
      </div>

      <section className="cfa-hero">
        <div className="cfa-hero-inner">
          <div className="cfa-eyebrow">For Educators & Counsellors</div>
          <h1 className="cfa-h1">Psychological First Aid <br/><em>Training Toolkit</em></h1>
          <p className="cfa-sub">Clinical protocols, crisis scripts, and boundary-setting guides to help you safely manage student emotional distress and disclosures.</p>
        </div>
      </section>

      <section className="cfa-grid">
        {PROTOCOLS.map((protocol) => (
          <div key={protocol.id} className="cfa-card">
            <div className="cfa-icon">{protocol.icon}</div>
            <h3 className="cfa-title">{protocol.title}</h3>
            <p className="cfa-desc">{protocol.desc}</p>
            <button className="cfa-btn" onClick={() => setActiveModal(protocol.id)}>
              Read Protocol →
            </button>
          </div>
        ))}
      </section>

      {activeModal && (
        <div className="cfa-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="cfa-modal" onClick={e => e.stopPropagation()}>
            <div className="cfa-modal-header">
              <h3 className="cfa-modal-title">{PROTOCOLS.find(p => p.id === activeModal).title}</h3>
              <button className="cfa-modal-close" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="cfa-modal-body">
              {PROTOCOLS.find(p => p.id === activeModal).modalContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
