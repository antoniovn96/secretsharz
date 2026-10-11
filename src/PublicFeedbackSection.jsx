import React, { useEffect, useState } from 'react';

const EMPTY = { type: 'general', displayName: '', email: '', message: '', allowPublication: false, website: '' };

export default function PublicFeedbackSection() {
  const [form, setForm] = useState(EMPTY);
  const [published, setPublished] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsUnavailable, setReviewsUnavailable] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  useEffect(() => {
    let active = true;
    fetch('/api/website-feedback?view=published', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Feedback is temporarily unavailable.')))
      .then((data) => { if (active) setPublished(Array.isArray(data.items) ? data.items : []); })
      .catch(() => { if (active) { setPublished([]); setReviewsUnavailable(true); } })
      .finally(() => { if (active) setLoadingReviews(false); });
    return () => { active = false; };
  }, []);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));

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
    <section className="ss-public-feedback" aria-labelledby="spf-title">
      <div className="spf-inner">
        <div className="spf-copy">
          <p className="spf-eyebrow">Help us make Secret Sharz better</p>
          <h2 id="spf-title">Your experience matters.</h2>
          <p>Share a suggestion, report an accessibility barrier, or tell us about your experience. We are building this platform and welcome thoughtful feedback.</p>
          {loadingReviews ? <p className="spf-review-state" role="status">Checking for published feedback…</p> : published.length > 0 ? (
            <div className="spf-reviews" aria-label="Published community feedback">
              <h3>Shared with permission</h3>
              {published.map((item) => <blockquote key={item.id}><p>“{item.message}”</p><footer>— {item.displayName || 'Anonymous'}</footer></blockquote>)}
            </div>
          ) : reviewsUnavailable ? (
            <div className="spf-empty"><span aria-hidden="true">♡</span><div><strong>Feedback is temporarily unavailable.</strong><p>Please check back later or send your feedback using the form.</p></div></div>
          ) : (
            <div className="spf-empty">
              <span aria-hidden="true">♡</span>
              <div><strong>We're just getting started.</strong><p>There are no published reviews yet. You can help shape what comes next.</p></div>
            </div>
          )}
        </div>

        <form className="spf-form" onSubmit={submit}>
          <div className="spf-form-heading"><span aria-hidden="true">✦</span><div><h3>Share feedback</h3><p>Fields marked optional can be left blank.</p></div></div>
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
          <p className="spf-privacy">Please do not include diagnoses, private counselling details, identifying information about a child, or other sensitive personal information.</p>
          <label className="spf-consent"><input type="checkbox" name="allowPublication" checked={form.allowPublication} onChange={change} /><span>I give permission for Secret Sharz to consider publishing an edited, anonymous version of my message after moderation. Publication is not automatic; my name and email will not be published.</span></label>
          <div className="spf-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={change} /></label></div>
          {notice.text && <p className={`spf-notice ${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</p>}
          <button className="spf-submit" type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send feedback'} <span aria-hidden="true">→</span></button>
          <p className="spf-consent-note">Submissions are private by default. Only messages with publication permission that are approved by the Secret Sharz team may appear publicly.</p>
        </form>
      </div>
      <style>{`
        .ss-public-feedback{padding:70px 5.5vw;background:linear-gradient(120deg,#f2f7f0,#fffaf2);border-top:1px solid #e1e9df}.spf-inner{width:min(1200px,100%);margin:auto;display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:60px;align-items:start}.spf-eyebrow{margin:0 0 12px;color:#3e7667;font-size:11px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.spf-copy h2{font-family:Georgia,serif;font-size:clamp(35px,4vw,50px);font-weight:500;letter-spacing:-.04em;line-height:1.08;margin:0 0 15px;color:#163f39}.spf-copy>p:not(.spf-eyebrow){font-size:15px;line-height:1.7;color:#566760;margin:0 0 22px}.spf-empty{display:flex;gap:14px;padding:18px;border-radius:18px;background:rgba(255,255,255,.75);border:1px solid #dfe8df;color:#315f51}.spf-empty>span{font-size:25px}.spf-empty strong{font-size:14px}.spf-empty p{margin:5px 0 0;font-size:12px;line-height:1.6;color:#697871}.spf-review-state{font-size:12px;color:#68766d}.spf-reviews{display:grid;gap:12px}.spf-reviews h3{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#477566}.spf-reviews blockquote{margin:0;padding:16px;border-radius:15px;background:#fff;border:1px solid #e1e9e0}.spf-reviews blockquote p{margin:0 0 8px;color:#344f45;font-family:Georgia,serif;font-size:17px;line-height:1.5}.spf-reviews footer{font-size:12px;color:#6e7b74}
        .spf-form{padding:26px;border:1px solid #dce7dc;border-radius:23px;background:rgba(255,255,255,.9);box-shadow:0 15px 45px rgba(32,75,56,.06);display:grid;gap:16px}.spf-form-heading{display:flex;gap:13px;align-items:center}.spf-form-heading>span{width:43px;height:43px;border-radius:50%;display:grid;place-items:center;background:#dceee1;color:#286b55;font-size:21px}.spf-form-heading h3{margin:0 0 4px;font-family:Georgia,serif;font-size:23px;font-weight:500;color:#183f39}.spf-form-heading p{margin:0;font-size:11px;color:#78837c}
        .spf-form label{display:grid;gap:7px;color:#374f46;font-size:12px;font-weight:750}.spf-form label span{font-weight:400;color:#75837a}.spf-form input:not([type=checkbox]),.spf-form select,.spf-form textarea{width:100%;min-height:43px;border:1px solid #cfdcd1;border-radius:11px;background:#fff;color:#243c32;font:inherit;font-size:13px;padding:11px 12px}.spf-form textarea{resize:vertical;min-height:120px;line-height:1.55}.spf-form input:focus-visible,.spf-form select:focus-visible,.spf-form textarea:focus-visible{outline:3px solid #4d8d79;outline-offset:2px;border-color:#367564}
        .spf-two-col{display:grid;grid-template-columns:1fr 1fr;gap:13px}.spf-privacy,.spf-consent-note{margin:0;color:#6d7b73;font-size:11px;line-height:1.65}.spf-consent{display:grid!important;grid-template-columns:18px 1fr;gap:10px!important;align-items:start;font-weight:450!important;line-height:1.55}.spf-consent input{width:17px;height:17px;margin:2px 0 0;accent-color:#286b55}.spf-honeypot{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}.spf-submit{display:flex;justify-content:center;align-items:center;gap:11px;min-height:46px;border:0;border-radius:999px;background:#14564f;color:#fff;font-size:13px;font-weight:850;cursor:pointer}.spf-submit:disabled{opacity:.65;cursor:wait}.spf-form button:focus-visible{outline:3px solid #225d53;outline-offset:3px}.spf-notice{padding:12px;border-radius:10px;font-size:12px;line-height:1.55;margin:0}.spf-notice.success{background:#e6f4e9;color:#205c3c}.spf-notice.error{background:#fff0ed;color:#8e3024}
        @media(max-width:900px){.spf-inner{grid-template-columns:1fr;gap:30px}.ss-public-feedback{padding:54px 20px}}@media(max-width:520px){.spf-form{padding:18px}.spf-two-col{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
