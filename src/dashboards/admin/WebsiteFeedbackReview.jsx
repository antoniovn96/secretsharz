import React, { useCallback, useEffect, useState } from 'react';
import { auth } from '../../firebase';

export default function WebsiteFeedbackReview() {
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setNotice('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in again to review submissions.');
      const token = await user.getIdToken();
      const response = await fetch(`/api/website-feedback?status=${encodeURIComponent(statusFilter)}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not load feedback.');
      setItems(Array.isArray(payload.items) ? payload.items : []);
    } catch (error) {
      setNotice(error.message || 'Could not load feedback.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const moderate = async (item, action) => {
    setBusyId(item.id);
    setNotice('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in again to review submissions.');
      const token = await user.getIdToken();
      const response = await fetch('/api/website-feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: item.id, action }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not update the submission.');
      setNotice(action === 'publish' ? 'Feedback published.' : 'Feedback rejected.');
      await load();
    } catch (error) {
      setNotice(error.message || 'Could not update the submission.');
    } finally {
      setBusyId('');
    }
  };

  return (
    <main className="ss-feedback-admin" id="main-content" tabIndex="-1">
      <header className="sfa-head">
        <div><p>Secret Sharz · Administration</p><h1>Website feedback</h1><span>Review submissions privately. Publish only feedback with explicit permission.</span></div>
        <button type="button" onClick={load}>Refresh</button>
      </header>
      <nav className="sfa-filters" aria-label="Feedback status">
        {['pending', 'published', 'rejected', 'all'].map((status) => <button type="button" key={status} aria-pressed={statusFilter === status} className={statusFilter === status ? 'active' : ''} onClick={() => setStatusFilter(status)}>{status === 'all' ? 'All submissions' : status[0].toUpperCase() + status.slice(1)}</button>)}
      </nav>
      {notice && <p className="sfa-notice" role="status">{notice}</p>}
      {loading ? <p role="status">Loading feedback…</p> : items.length === 0 ? <div className="sfa-empty">No submissions in this view yet.</div> : (
        <div className="sfa-list">{items.map((item) => (
          <article className="sfa-card" key={item.id}>
            <div className="sfa-meta"><span>{item.type}</span><span>{item.status}</span>{item.createdAt && <time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time>}</div>
            <p className="sfa-message">{item.message}</p>
            <div className="sfa-contact"><span><strong>Name:</strong> {item.displayName || 'Not provided'}</span><span><strong>Email:</strong> {item.email || 'Not provided'}</span><span><strong>Publication permission:</strong> {item.allowPublication ? 'Yes' : 'No'}</span></div>
            {item.status === 'pending' && <div className="sfa-actions">{item.allowPublication && <button type="button" disabled={busyId === item.id} onClick={() => moderate(item, 'publish')}>{busyId === item.id ? 'Saving…' : 'Approve & publish'}</button>}<button type="button" className="reject" disabled={busyId === item.id} onClick={() => moderate(item, 'reject')}>Reject</button></div>}
          </article>
        ))}</div>
      )}
      <style>{`
        .ss-feedback-admin{min-height:75vh;padding:40px clamp(18px,4vw,60px) 70px;background:#f7f9f5;color:#203b32}.ss-feedback-admin *{box-sizing:border-box}.sfa-head{display:flex;justify-content:space-between;align-items:center;gap:18px;max-width:1150px;margin:0 auto 25px}.sfa-head p{margin:0 0 8px;color:#477967;text-transform:uppercase;font-size:11px;font-weight:850;letter-spacing:.12em}.sfa-head h1{font-family:Georgia,serif;font-weight:500;letter-spacing:-.03em;font-size:clamp(34px,4vw,48px);margin:0 0 8px}.sfa-head span{font-size:13px;color:#66786f}.sfa-head button,.sfa-filters button,.sfa-actions button{border:1px solid #cddbd0;border-radius:999px;padding:10px 14px;background:#fff;color:#244d40;font-size:12px;font-weight:800;cursor:pointer}.sfa-filters{max-width:1150px;margin:0 auto 18px;display:flex;gap:8px;flex-wrap:wrap}.sfa-filters button.active{background:#174f46;color:#fff;border-color:#174f46}.sfa-notice{max-width:1150px;margin:0 auto 16px;padding:12px;border-radius:10px;background:#e5f2e7;color:#28593b;font-size:13px}.sfa-empty{max-width:1150px;margin:auto;padding:30px;border-radius:18px;border:1px dashed #bdcec1;color:#6e7c73;text-align:center}.sfa-list{max-width:1150px;margin:auto;display:grid;gap:14px}.sfa-card{background:#fff;border:1px solid #dfe8df;border-radius:18px;padding:21px}.sfa-meta{display:flex;gap:12px;flex-wrap:wrap;align-items:center;color:#62746a;font-size:11px;text-transform:capitalize}.sfa-meta span{background:#eff5ef;padding:5px 8px;border-radius:999px}.sfa-message{white-space:pre-wrap;overflow-wrap:anywhere;color:#273e34;font-size:14px;line-height:1.7;margin:15px 0}.sfa-contact{display:flex;gap:14px;flex-wrap:wrap;color:#718077;font-size:11px}.sfa-contact strong{color:#415b4e}.sfa-actions{display:flex;gap:8px;margin-top:17px}.sfa-actions button:first-child{background:#17574c;color:white;border-color:#17574c}.sfa-actions button.reject{color:#8b3e32}.sfa-actions button:disabled{opacity:.55;cursor:wait}@media(max-width:600px){.sfa-head{align-items:flex-start;flex-direction:column}.sfa-actions button{flex:1}}
      `}</style>
    </main>
  );
}
