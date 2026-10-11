import React, { useEffect, useState } from 'react';

const EMPTY = { type: 'general', displayName: '', email: '', message: '', allowPublication: false, website: '' };

export default function PublicFeedbackSection() {
  const [form, setForm] = useState(EMPTY);
  const [published, setPublished] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  useEffect(() => {
    let active = true;
    fetch('/api/website-feedback?view=published', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Published feedback is unavailable.')))
      .then((data) => { if (active) setPublished(Array.isArray(data.items) ? data.items : []); })
      .catch(() => { if (active) setPublished([]); })
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!showForm) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') setShowForm(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showForm]);

  const change = (event) => setForm((current) => ({
    ...current,
    [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
  }));

  const submit = async (event) => {
    event.preventDefault();
    setNotice({ type: '', text: '' });
    setSubmitting(true);
    try {
      const response = await fetch('/api/website-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'We could not submit your feedback. Please try again.');
      setForm(EMPTY);
      setNotice({ type: 'success', text: 'Thank you. Your feedback has been received and will be reviewed privately before anything is published.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message || 'We could not submit your feedback. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="ss-public-feedback" aria-labelledby="spf-title">
        <div className="spf-inner">
          <div className="spf-symbol" aria-hidden="true">☏</div>
          <div className="spf-copy">
            <p className="spf-eyebrow">Your voice helps us grow</p>
            <h2 id="spf-title">Your experience matters</h2>
            <p>Secret Sharz is growing. Share feedback, a suggestion, or a note about your experience. Your input helps us improve and create a more supportive and inclusive platform for everyone.</p>
            <button className="spf-share-button" type="button" onClick={() => { setNotice({ type: '', text: '' }); setShowForm(true); }}>
              Share feedback <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="spf-privacy">
            <span className="spf-privacy-leaf" aria-hidden="true">❧</span>
            <p>We only display public feedback after it has been submitted, reviewed and given clear permission for publication. Names and contact details are not shown publicly.</p>
          </div>
        </div>
        {published.length > 0 && (
          <div className="spf-public-items" aria-label="Published community feedback">
            {published.slice(0, 3).map((item) => <blockquote key={item.id}><p>“{item.message}”</p><footer>— {item.displayName || 'Anonymous'}</footer></blockquote>)}
          </div>
        )}
      </section>

      {showForm && (
        <div className="spf-modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false); }}>
          <section className="spf-modal" role="dialog" aria-modal="true" aria-labelledby="spf-modal-title">
            <div className="spf-modal-head">
              <div><p className="spf-eyebrow">Your feedback matters</p><h2 id="spf-modal-title">Share feedback</h2><p>Tell us what worked well or what we could improve.</p></div>
              <button className="spf-close" type="button" aria-label="Close feedback form" onClick={() => setShowForm(false)}>×</button>
            </div>
            {notice.text && <p className={\`spf-notice \${notice.type}\`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</p>}
            {notice.type !== 'success' && (
              <form className="spf-form" onSubmit={submit}>
                <label>What would you like to share?
                  <select name="type" value={form.type} onChange={change}>
                    <option value="general">General feedback</option>
                    <option value="suggestion">Suggestion</option>
                    <option value="accessibility">Accessibility feedback</option>
                    <option value="experience">My experience</option>
                  </select>
                </label>
                <div className="spf-two-col">
                  <label>Name <span>(optional)</span><input name="displayName" maxLength={80} value={form.displayName} onChange={change} autoComplete="name" /></label>
                  <label>Email <span>(optional)</span><input name="email" type="email" maxLength={254} value={form.email} onChange={change} autoComplete="email" /></label>
                </div>
                <label>Your message
                  <textarea name="message" required minLength={10} maxLength={1500} rows={5} value={form.message} onChange={change} placeholder="Tell us what worked well or what could be better…" />
                </label>
                <p className="spf-privacy-warning">Please do not include diagnoses, private counselling details, or identifying information about a child.</p>
                <label className="spf-consent">
                  <input type="checkbox" name="allowPublication" checked={form.allowPublication} onChange={change} />
                  <span>I give permission for an edited, anonymous version of this feedback to be published after review. This is optional and does not affect submission.</span>
                </label>
                <div className="spf-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex="-1" autoComplete="off" value={form.website} onChange={change} /></label></div>
                <div className="spf-form-actions">
                  <button type="button" className="spf-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="spf-submit" disabled={submitting}>{submitting ? 'Sending…' : 'Submit feedback'}</button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}

      <style>{\`
        .ss-public-feedback{position:relative;background:linear-gradient(100deg,#edf4ec 0%,#f9faf3 54%,#edf4ec 100%);padding:24px clamp(22px,4.2vw,64px);overflow:hidden;color:#153f3b}
        .ss-public-feedback:before,.ss-public-feedback:after{content:'❧';position:absolute;color:rgba(81,137,105,.2);font-size:94px;line-height:1;pointer-events:none}.ss-public-feedback:before{left:-12px;bottom:-25px;transform:rotate(-45deg)}.ss-public-feedback:after{right:-10px;bottom:-25px;transform:rotate(28deg)}
        .spf-inner{max-width:1320px;margin:0 auto;display:grid;grid-template-columns:70px minmax(0,1fr) minmax(240px,.82fr);gap:20px;align-items:center;position:relative;z-index:1}
        .spf-symbol{display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:rgba(255,255,255,.73);border:1px solid #e2ebe1;color:#276e65;font-size:30px}
        .spf-copy .spf-eyebrow,.spf-modal .spf-eyebrow{margin:0 0 5px;color:#4f7a6d;font-size:9px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}
        .spf-copy h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(25px,2.7vw,34px);font-weight:500;letter-spacing:-.03em;margin:0 0 5px;color:#133f3e}
        .spf-copy>p:not(.spf-eyebrow){max-width:700px;margin:0;color:#506360;font-size:11px;line-height:1.55}
        .spf-share-button{margin-top:11px;border:0;border-radius:999px;padding:10px 19px;background:#064e4b;color:white;display:inline-flex;align-items:center;gap:14px;font-size:10px;font-weight:800;cursor:pointer}.spf-share-button:hover,.spf-submit:hover{background:#043d3a}
        .spf-privacy{min-height:75px;border-left:1px solid #cddbd0;padding:12px 10px 12px 22px;display:flex;gap:14px;align-items:center}.spf-privacy-leaf{font-size:33px;color:#5f906f}.spf-privacy p{margin:0;color:#61716c;font-size:10px;line-height:1.6}
        .spf-public-items{max-width:1320px;margin:20px auto 0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;position:relative;z-index:1}.spf-public-items blockquote{margin:0;background:rgba(255,255,255,.72);border:1px solid #e1e9df;border-radius:12px;padding:14px}.spf-public-items p{font-family:Georgia,serif;font-size:13px;color:#34564f;margin:0 0 8px}.spf-public-items footer{font-size:10px;color:#77877c}
        .spf-modal-layer{position:fixed;inset:0;z-index:10000;background:rgba(8,33,31,.55);display:flex;align-items:center;justify-content:center;padding:18px;overflow-y:auto}
        .spf-modal{position:relative;width:min(600px,100%);max-height:calc(100vh - 36px);overflow:auto;border-radius:20px;background:#fffefa;border:1px solid #dce7dc;box-shadow:0 28px 90px rgba(0,0,0,.23);padding:24px;color:#244541}
        .spf-modal-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:18px}.spf-modal-head h2{font-family:Georgia,serif;font-size:30px;font-weight:500;margin:0 0 5px}.spf-modal-head p:last-child{font-size:12px;color:#6d7973;margin:0}.spf-close{border:1px solid #d9e3d9;background:#f7faf5;color:#255149;border-radius:50%;width:34px;height:34px;font-size:23px;line-height:1;cursor:pointer}
        .spf-form{display:grid;gap:13px}.spf-form label{display:grid;gap:6px;font-size:11px;font-weight:750;color:#3c5d53}.spf-form label span{display:inline;color:#89948e;font-weight:400}.spf-form input:not([type=checkbox]),.spf-form select,.spf-form textarea{width:100%;min-height:38px;border:1px solid #d2dfd4;border-radius:9px;background:#fff;padding:10px 11px;color:#203d34;font:inherit;font-size:12px;outline-offset:2px}.spf-form textarea{resize:vertical;min-height:100px;line-height:1.5}.spf-form input:focus-visible,.spf-form select:focus-visible,.spf-form textarea:focus-visible{outline:2px solid #5a9d88}
        .spf-two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px}.spf-privacy-warning{margin:0;color:#77867d;font-size:10px;line-height:1.5}.spf-consent{display:grid!important;grid-template-columns:16px 1fr;gap:9px!important;align-items:start;font-size:10px!important;line-height:1.5;font-weight:500!important}.spf-consent input{margin-top:2px;accent-color:#0e6255}.spf-honeypot{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}.spf-form-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:3px}.spf-cancel,.spf-submit{border-radius:999px;padding:10px 15px;font-size:11px;font-weight:800;cursor:pointer}.spf-cancel{border:1px solid #d2dfd4;background:white;color:#275047}.spf-submit{border:1px solid #064e4b;background:#064e4b;color:white}.spf-submit:disabled{opacity:.6;cursor:wait}.spf-notice{padding:11px 13px;border-radius:9px;font-size:11px;line-height:1.5}.spf-notice.success{background:#e9f6e9;color:#27623e}.spf-notice.error{background:#fff0ed;color:#943d32}
        @media(max-width:760px){.ss-public-feedback{padding:24px 18px}.spf-inner{grid-template-columns:54px minmax(0,1fr);gap:12px}.spf-symbol{width:48px;height:48px;font-size:26px}.spf-copy h2{font-size:27px}.spf-privacy{grid-column:1 / -1;border-left:0;border-top:1px solid #cddbd0;padding:15px 0 0;min-height:0}.spf-public-items{grid-template-columns:1fr}.spf-two-col{grid-template-columns:1fr}.spf-modal{padding:20px}.spf-modal-head h2{font-size:27px}}
        @media(prefers-reduced-motion:reduce){.ss-public-feedback *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
      \`}</style>
    </>
  );
}
