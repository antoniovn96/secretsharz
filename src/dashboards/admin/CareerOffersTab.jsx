import React, { useEffect, useMemo, useState } from 'react';
import { auth } from '../../firebase';

const TYPE_LABELS = { percentage: 'Percentage', fixed: 'Fixed ₹', fixed_per_student: 'Fixed ₹ / seat', sponsored: '100% Sponsored' };
const TYPE_HINTS = { percentage: 'Enter 0–100', fixed: 'Enter ₹ amount', fixed_per_student: 'Enter ₹ per seat', sponsored: 'No value required' };

function valueForForm(coupon) {
  if (!coupon) return '';
  if (coupon.type === 'percentage') return Number(coupon.valuePaise || 0);
  return Number(coupon.valuePaise || 0) / 100;
}

export default function CareerOffersTab() {
  const [coupons, setCoupons] = useState([]); const [products, setProducts] = useState([]); const [customerTypes, setCustomerTypes] = useState([]); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [message, setMessage] = useState('');
  const blank = { code: '', type: 'percentage', value: '', description: '', customerTypes: ['student'], productKeys: ['student_individual'], startsAt: '', endsAt: '', maxRedemptions: 0, active: true };
  const [form, setForm] = useState(blank);

  const load = async () => {
    try { setLoading(true); setError(''); const user = auth.currentUser; if (!user) throw new Error('Authentication required.'); const token = await user.getIdToken(true); const response = await fetch('/api/admin/career-coupons', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to load coupons.'); setCoupons(data.coupons || []); setProducts(data.products || []); setCustomerTypes(data.customerTypes || []); } catch (err) { setError(err.message || 'Unable to load coupons.'); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const productMap = useMemo(() => Object.fromEntries(products.map(p => [p.key, p])), [products]);
  const toggle = (field, value) => setForm(prev => ({ ...prev, [field]: prev[field].includes(value) ? prev[field].filter(x => x !== value) : [...prev[field], value] }));

  const save = async () => {
    try {
      setSaving(true); setError(''); setMessage('');
      const user = auth.currentUser; if (!user) throw new Error('Authentication required.');
      if (!form.code.trim()) throw new Error('Coupon code is required.');
      if (!form.customerTypes.length) throw new Error('Select at least one customer type.');
      const token = await user.getIdToken(true);
      const payload = {
        code: form.code.trim().toUpperCase(), type: form.type, valuePaise: form.type === 'percentage' ? Math.round(Number(form.value || 0)) : Math.round(Number(form.value || 0) * 100), description: form.description,
        customerTypes: form.customerTypes, productKeys: form.productKeys, startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null, endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null, maxRedemptions: Number(form.maxRedemptions || 0), active: form.active,
      };
      const exists = coupons.some(c => c.code === payload.code);
      const response = await fetch('/api/admin/career-coupons', { method: exists ? 'PUT' : 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to save coupon.');
      setMessage(exists ? 'Coupon updated.' : 'Coupon created.'); setForm(blank); await load();
    } catch (err) { setError(err.message || 'Unable to save coupon.'); } finally { setSaving(false); }
  };

  const edit = coupon => setForm({ code: coupon.code, type: coupon.type, value: valueForForm(coupon), description: coupon.description || '', customerTypes: coupon.customerTypes || [], productKeys: coupon.productKeys || [], startsAt: coupon.startsAt ? coupon.startsAt.slice(0, 16) : '', endsAt: coupon.endsAt ? coupon.endsAt.slice(0, 16) : '', maxRedemptions: coupon.maxRedemptions || 0, active: coupon.active !== false });
  const disable = async code => { try { const user = auth.currentUser; const token = await user.getIdToken(true); const response = await fetch(`/api/admin/career-coupons?code=${encodeURIComponent(code)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to disable coupon.'); setMessage(`${code} disabled.`); await load(); } catch (err) { setError(err.message || 'Unable to disable coupon.'); } };

  if (loading) return <div className="flex items-center justify-center h-72 text-slate-500">Loading offers & coupons...</div>;
  return <div className="max-w-6xl mx-auto space-y-6">
    <div><h3 className="text-2xl font-bold text-slate-900">Offers & Coupons</h3><p className="text-sm text-slate-500 mt-1">Create controlled discounts without changing application code. Usage is recorded against each coupon.</p></div>
    {message && <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">{message}</div>}
    {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between gap-4 mb-5"><div><h4 className="font-bold text-slate-900">Create / Edit Coupon</h4><p className="text-xs text-slate-500 mt-1">Coupon codes are case-insensitive and stored in uppercase.</p></div><button onClick={() => setForm(blank)} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-semibold">New Coupon</button></div>
      <div className="grid md:grid-cols-3 gap-4">
        <label className="text-sm font-semibold text-slate-700">Code<input value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200" /></label>
        <label className="text-sm font-semibold text-slate-700">Discount Type<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200">{Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
        <label className="text-sm font-semibold text-slate-700">Value<input type="number" min="0" value={form.value} disabled={form.type === 'sponsored'} onChange={e => setForm({ ...form, value: e.target.value })} placeholder={TYPE_HINTS[form.type]} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200" /></label>
        <label className="text-sm font-semibold text-slate-700 md:col-span-3">Description<input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Example: Back-to-school sponsored access" className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200" /></label>
        <label className="text-sm font-semibold text-slate-700">Starts<input type="datetime-local" value={form.startsAt} onChange={e => setForm({ ...form, startsAt: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200" /></label>
        <label className="text-sm font-semibold text-slate-700">Ends<input type="datetime-local" value={form.endsAt} onChange={e => setForm({ ...form, endsAt: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200" /></label>
        <label className="text-sm font-semibold text-slate-700">Max Redemptions<input type="number" min="0" value={form.maxRedemptions} onChange={e => setForm({ ...form, maxRedemptions: e.target.value })} className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-200" /><span className="text-xs text-slate-400">0 = unlimited</span></label>
      </div>
      <div className="grid md:grid-cols-2 gap-5 mt-5">
        <div><p className="text-sm font-semibold text-slate-700 mb-2">Customer Types</p><div className="flex flex-wrap gap-2">{customerTypes.map(type => <button type="button" key={type} onClick={() => toggle('customerTypes', type)} className={`px-3 py-2 rounded-lg text-xs font-bold ${form.customerTypes.includes(type) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{type}</button>)}</div></div>
        <div><p className="text-sm font-semibold text-slate-700 mb-2">Products</p><div className="max-h-36 overflow-y-auto space-y-2">{products.map(product => <label key={product.key} className="flex items-center gap-2 text-xs text-slate-700"><input type="checkbox" checked={form.productKeys.includes(product.key)} onChange={() => toggle('productKeys', product.key)} />{product.label}</label>)}</div></div>
      </div>
      <div className="flex items-center gap-4 mt-5"><label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />Active</label><button onClick={save} disabled={saving} className="ml-auto px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-50">{saving ? 'Saving...' : 'Save Coupon'}</button></div>
    </section>

    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"><div className="px-5 py-4 border-b border-slate-100"><h4 className="font-bold text-slate-900">Coupon Catalogue</h4></div><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="text-left px-5 py-3">Code</th><th className="text-left px-5 py-3">Offer</th><th className="text-left px-5 py-3">Audience</th><th className="text-left px-5 py-3">Usage</th><th className="text-left px-5 py-3">Validity</th><th className="px-5 py-3" /></tr></thead><tbody className="divide-y divide-slate-100">{coupons.map(coupon => <tr key={coupon.code}><td className="px-5 py-4"><div className="font-bold text-slate-900">{coupon.code}</div><div className={`text-xs mt-1 font-semibold ${coupon.active ? 'text-emerald-600' : 'text-slate-400'}`}>{coupon.active ? 'Active' : 'Disabled'}</div></td><td className="px-5 py-4"><div className="font-semibold">{TYPE_LABELS[coupon.type] || coupon.type}{coupon.type !== 'sponsored' && ` · ${coupon.type === 'percentage' ? coupon.valuePaise : `₹${(coupon.valuePaise / 100).toLocaleString('en-IN')}`}${coupon.type === 'percentage' ? '%' : ''}`}</div><div className="text-xs text-slate-400 mt-1">{coupon.description || '—'}</div></td><td className="px-5 py-4 text-xs">{coupon.customerTypes.length ? coupon.customerTypes.join(', ') : 'All'}<div className="text-slate-400 mt-1">{coupon.productKeys.length ? coupon.productKeys.map(k => productMap[k]?.sku || k).join(', ') : 'All products'}</div></td><td className="px-5 py-4 font-semibold">{coupon.redemptions} / {coupon.maxRedemptions || '∞'}</td><td className="px-5 py-4 text-xs text-slate-500">{coupon.startsAt ? new Date(coupon.startsAt).toLocaleString('en-IN') : 'Now'}<br />{coupon.endsAt ? `to ${new Date(coupon.endsAt).toLocaleString('en-IN')}` : 'No expiry'}</td><td className="px-5 py-4 text-right whitespace-nowrap"><button onClick={() => edit(coupon)} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold mr-2">Edit</button>{coupon.active && <button onClick={() => disable(coupon.code)} className="px-3 py-2 rounded-lg bg-red-50 text-red-700 font-semibold">Disable</button>}</td></tr>)}{!coupons.length && <tr><td colSpan="6" className="px-5 py-10 text-center text-slate-500">No coupons created yet.</td></tr>}</tbody></table></div></section>
  </div>;
}
