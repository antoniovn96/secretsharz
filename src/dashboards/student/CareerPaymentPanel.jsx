import React, { useEffect, useState } from 'react';
import { auth } from '../../firebase';

const REPORT_PRICE_FALLBACK = 999;
const STUDENT_PRODUCT = 'student_individual';

const moneyFromPaise = paise => Math.round(Number(paise || REPORT_PRICE_FALLBACK * 100) / 100);

export default function CareerPaymentPanel({ currentUser, onBack, onVerified }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scriptReady, setScriptReady] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [quote, setQuote] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');

  const refreshQuote = async (code = '') => {
    const user = currentUser || auth.currentUser;
    if (!user) throw new Error('Please sign in again before making payment.');
    const token = await user.getIdToken();
    const response = await fetch('/api/career/quote', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ product: STUDENT_PRODUCT, couponCode: code }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || 'Unable to calculate the current price.');
    setQuote(data); return data;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => { try { setCatalogLoading(true); const data = await refreshQuote(''); if (!cancelled) setQuote(data); } catch (err) { if (!cancelled) setError(err.message || 'Unable to load current pricing.'); } finally { if (!cancelled) setCatalogLoading(false); } })();
    return () => { cancelled = true; };
  }, [currentUser]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.Razorpay) { setScriptReady(true); return undefined; }
    const existing = document.querySelector('script[data-razorpay-checkout]');
    if (existing) { const handleLoad = () => setScriptReady(true); existing.addEventListener('load', handleLoad); return () => existing.removeEventListener('load', handleLoad); }
    const script = document.createElement('script'); script.src = 'https://checkout.razorpay.com/v1/checkout.js'; script.async = true; script.dataset.razorpayCheckout = 'true'; script.onload = () => setScriptReady(true); script.onerror = () => setError('Unable to load the payment gateway. Please try again.'); document.body.appendChild(script); return () => {};
  }, []);

  const applyCoupon = async () => { setCouponMessage(''); setError(''); try { const data = await refreshQuote(couponCode.trim()); setCouponMessage(data.discountAmount > 0 ? `Coupon applied. You save ₹${moneyFromPaise(data.discountAmount).toLocaleString('en-IN')}.` : 'Coupon is valid but does not reduce this product.'); } catch (err) { setError(err.message || 'Unable to apply coupon.'); } };

  const startPayment = async () => {
    setLoading(true); setError('');
    try {
      const user = currentUser || auth.currentUser;
      if (!user) throw new Error('Please sign in again before making payment.');
      await refreshQuote(couponCode.trim());
      const token = await user.getIdToken();
      const orderResponse = await fetch('/api/career/create-order', { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ product: STUDENT_PRODUCT, couponCode: couponCode.trim() }) });
      const order = await orderResponse.json();
      if (!orderResponse.ok) throw new Error(order?.error || 'Unable to start payment.');
      if (order.sponsored) { onVerified(); return; }
      if (!scriptReady || !window.Razorpay) throw new Error('Payment gateway is still loading. Please try again in a moment.');
      const options = { key: order.keyId, amount: order.amount, currency: order.currency || 'INR', name: 'VidyaVantage', description: order.label || 'Full Career Intelligence Report', order_id: order.orderId, prefill: { name: user.displayName || '', email: user.email || '' }, theme: { color: '#4f46e5' }, modal: { ondismiss: () => setLoading(false) }, handler: async response => {
        try {
          const verifyToken = await user.getIdToken(true);
          const verifyResponse = await fetch('/api/career/verify-payment', { method: 'POST', headers: { Authorization: `Bearer ${verifyToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify(response) });
          const verification = await verifyResponse.json();
          if (!verifyResponse.ok || !verification?.verified) throw new Error(verification?.error || 'Payment could not be verified.');
          onVerified();
        } catch (verificationError) { setError(verificationError.message || 'Payment verification failed. Please contact support before paying again.'); setLoading(false); }
      } };
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', response => { setError(response?.error?.description || 'Payment failed. Please try again.'); setLoading(false); });
      razorpay.open();
    } catch (err) { setError(err.message || 'Unable to start payment.'); setLoading(false); }
  };

  const basePrice = moneyFromPaise(quote?.baseAmount || REPORT_PRICE_FALLBACK * 100);
  const discount = moneyFromPaise(quote?.discountAmount || 0);
  const finalPrice = moneyFromPaise(quote?.amount ?? REPORT_PRICE_FALLBACK * 100);

  return <div style={{ maxWidth: 760, margin: '0 auto' }}>
    <div style={{ background: '#0f172a', color: '#fff', padding: '28px 32px', borderRadius: 20, marginBottom: 24 }}><div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', color: '#f59e0b' }}>VidyaVantage Career Intelligence</div><h1 style={{ margin: '7px 0', fontSize: 30 }}>Unlock Your Full Career Report</h1><p style={{ margin: 0, color: '#cbd5e1' }}>Your report unlocks only after payment is verified on the server.</p></div>
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 34 }}>
      <div style={{ textAlign: 'center', paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}><div style={{ color: '#64748b', fontWeight: 800, fontSize: 12, textTransform: 'uppercase' }}>VidyaVantage Career Intelligence Report</div>{catalogLoading ? <div style={{ fontSize: 30, fontWeight: 900, color: '#64748b', margin: '15px 0' }}>Loading current price…</div> : <><div style={{ fontSize: 44, fontWeight: 950, color: '#0f172a', margin: '10px 0 2px' }}>₹{finalPrice.toLocaleString('en-IN')}</div>{discount > 0 && <div style={{ color: '#059669', fontSize: 13, fontWeight: 800 }}>₹{basePrice.toLocaleString('en-IN')} base price · Save ₹{discount.toLocaleString('en-IN')}</div>}<div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>One-time payment</div></>}</div>
      <div style={{ display: 'flex', gap: 8, margin: '22px 0 8px' }}><input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} placeholder="Have a coupon?" disabled={loading} style={{ flex: 1, padding: '12px 14px', border: '1px solid #cbd5e1', borderRadius: 10, fontWeight: 700 }} /><button onClick={applyCoupon} disabled={loading || catalogLoading} style={{ border: 0, borderRadius: 10, padding: '12px 16px', background: '#e2e8f0', color: '#334155', fontWeight: 900 }}>Apply</button></div>
      {couponMessage && <div style={{ color: '#047857', fontSize: 12, fontWeight: 800, marginBottom: 15 }}>{couponMessage}</div>}
      <div style={{ display: 'grid', gap: 10, margin: '20px 0 25px' }}>{['Complete RIASEC interpretation','Detailed career suitability analysis','Stream + course + pathway mapping','College and next-step guidance','Personalised career roadmap','Full report access from your dashboard'].map(item => <div key={item} style={{ padding: '13px 15px', borderRadius: 10, background: '#f8fafc', color: '#334155', fontWeight: 700, fontSize: 14 }}>✓ {item}</div>)}</div>
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 10, padding: '13px 15px', marginBottom: 15, fontSize: 13, fontWeight: 700 }}>{error}</div>}
      <button onClick={startPayment} disabled={loading || catalogLoading || !quote} style={{ width: '100%', border: 0, borderRadius: 12, padding: 16, background: loading ? '#94a3b8' : 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', fontWeight: 900, fontSize: 16 }}>{loading ? 'Processing…' : finalPrice === 0 ? 'Unlock Report — Sponsored' : `Pay ₹${finalPrice.toLocaleString('en-IN')} & Unlock Report`}</button>
      <button onClick={onBack} disabled={loading} style={{ width: '100%', border: 0, background: 'transparent', color: '#64748b', padding: 12, marginTop: 8, fontWeight: 700 }}>← Back to Results</button>
    </div>
  </div>;
}
