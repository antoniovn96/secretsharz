import React, { useState } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { CONSENT_ACTIONS, CONSENT_POLICY_VERSION, CONSENT_TYPES } from '../../security/consentPolicy';

const styles = `
  .ss-consent-shell{min-height:100vh;background:#fdfcfa;color:#1e2820;display:flex;align-items:center;justify-content:center;padding:32px 20px;font-family:'Plus Jakarta Sans',system-ui,sans-serif}
  .ss-consent-card{width:min(760px,100%);background:#fff;border:1px solid rgba(45,82,64,.18);border-radius:28px;padding:clamp(28px,5vw,52px);box-shadow:0 20px 60px rgba(30,40,32,.10)}
  .ss-consent-eyebrow{font-size:12px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;color:#2d7d46;margin-bottom:12px}
  .ss-consent-title{font-family:Georgia,'Times New Roman',serif;font-size:clamp(30px,5vw,46px);line-height:1.12;margin:0 0 16px}
  .ss-consent-lead{font-size:17px;line-height:1.7;color:#3d4a40;max-width:650px}
  .ss-consent-section{margin-top:28px;padding-top:24px;border-top:1px solid #e6ebe7}
  .ss-consent-section h2{font-size:18px;margin:0 0 10px}.ss-consent-section p,.ss-consent-section li{font-size:15px;line-height:1.7;color:#3d4a40}.ss-consent-section ul{padding-left:22px;margin:10px 0 0}
  .ss-consent-check{display:flex;gap:12px;align-items:flex-start;margin-top:28px;padding:16px;border:1px solid #d8e3db;border-radius:16px;background:#f5faf6}.ss-consent-check input{width:20px;height:20px;flex:0 0 auto;margin-top:2px;accent-color:#2d7d46}.ss-consent-check label{font-size:15px;line-height:1.55;font-weight:600;cursor:pointer}
  .ss-consent-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:24px}.ss-consent-primary,.ss-consent-secondary{min-height:48px;padding:12px 22px;border-radius:999px;font:700 15px inherit;cursor:pointer}.ss-consent-primary{background:#2d7d46;color:#fff;border:2px solid #2d7d46}.ss-consent-secondary{background:#fff;color:#1e2820;border:2px solid #b8c7bc}.ss-consent-primary:disabled{opacity:.55;cursor:not-allowed}
  .ss-consent-primary:focus-visible,.ss-consent-secondary:focus-visible,.ss-consent-check input:focus-visible{outline:3px solid #1d5fda;outline-offset:3px}.ss-consent-error{margin-top:16px;padding:12px 14px;border-radius:12px;background:#fff0ef;border:1px solid #e7aaa5;color:#8d2118;font-size:14px;font-weight:600}.ss-consent-meta{margin-top:22px;color:#68766d;font-size:12px;line-height:1.6}@media (prefers-reduced-motion:reduce){.ss-consent-primary,.ss-consent-secondary{transition:none!important}}
`;

const accountConsentId = (uid) => `account_${uid}`;

export default function AccountConsentGate({ user, onAccepted, onDecline }) {
  const [accepted, setAccepted] = useState(false); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const handleAccept = async () => {
    if (!user?.uid || !accepted || saving) return; setSaving(true); setError('');
    try {
      const consentRef = doc(db, 'consentEvents', accountConsentId(user.uid));
      const existing = await getDoc(consentRef);
      if (!existing.exists()) {
        await setDoc(consentRef, { userId:user.uid,type:CONSENT_TYPES.ACCOUNT,action:CONSENT_ACTIONS.GRANTED,actorType:'self',relationshipId:null,serviceContext:'account_creation',policyVersion:CONSENT_POLICY_VERSION,createdAt:serverTimestamp() });
      }
      onAccepted?.();
    } catch (err) { console.error('[Secret Sharz] Unable to save consent:',err); setError('We could not save your consent. Please try again. Your account has not been admitted to the platform yet.'); }
    finally { setSaving(false); }
  };
  return <main className="ss-consent-shell"><style>{styles}</style><section className="ss-consent-card" aria-labelledby="consent-title" aria-describedby="consent-lead">
    <div className="ss-consent-eyebrow">Before you continue</div><h1 id="consent-title" className="ss-consent-title">Your information matters.</h1>
    <p id="consent-lead" className="ss-consent-lead">Secret Sharz is designed around human dignity, privacy and choice. Before we create your Secret Sharz profile, we want you to understand the basic rules for your account.</p>
    <div className="ss-consent-section"><h2>What we need for your account</h2><p>We process the information needed to create, secure and operate your account. Different Secret Sharz services have separate privacy boundaries.</p></div>
    <div className="ss-consent-section"><h2>Your specialist information is separated</h2><ul><li>Counselling information does not automatically become part of your career record.</li><li>SEN information is protected as its own professional domain.</li><li>Career information is used for career services and does not automatically expose counselling or SEN information.</li></ul></div>
    <div className="ss-consent-section"><h2>You stay in control</h2><p>You will be able to review your permissions, request access or correction, export your information, withdraw applicable consent and request account deletion through the Privacy &amp; Consent area.</p></div>
    <div className="ss-consent-check"><input id="account-consent" type="checkbox" checked={accepted} onChange={(e)=>setAccepted(e.target.checked)}/><label htmlFor="account-consent">I have read and understood this account privacy explanation and want to continue creating my Secret Sharz profile. I understand that specialist services may require additional, separate consent.</label></div>
    {error&&<div className="ss-consent-error" role="alert">{error}</div>}
    <div className="ss-consent-actions"><button type="button" className="ss-consent-primary" disabled={!accepted||saving} onClick={handleAccept}>{saving?'Saving your choice…':'Continue to Secret Sharz'}</button><button type="button" className="ss-consent-secondary" onClick={()=>onDecline?.()} disabled={saving}>Not now</button></div>
    <p className="ss-consent-meta">Consent policy version {CONSENT_POLICY_VERSION}. This product text is an implementation draft and must receive legal/privacy review before production use.</p>
  </section></main>;
}
