import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Plus, RefreshCw, Users, CreditCard, KeyRound, Search, X } from 'lucide-react';
import { auth } from '../../firebase';

const EMPTY_FORM = {
  name: '',
  address: '',
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  licenseCount: '',
  pricePerLicense: '0',
  discountType: 'none',
  discountValue: '0',
  paymentStatus: 'pending',
  status: 'pending',
};

function money(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Icon className="w-5 h-5" /></div>
      </div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="text-sm font-semibold text-slate-600 mt-1">{label}</div>
      {hint && <div className="text-xs text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

const InstitutionDirectoryTab = () => {
  const [institutions, setInstitutions] = useState([]);
  const [totals, setTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [created, setCreated] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in again.');
      const token = await user.getIdToken(true);
      const response = await fetch('/api/admin/institutions', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to load institutions.');
      setInstitutions(payload.institutions || []);
      setTotals(payload.totals || {});
    } catch (err) {
      setError(err.message || 'Unable to load institutions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return institutions;
    return institutions.filter((item) => [item.name, item.institutionCode, item.contactPerson, item.contactEmail].some(value => String(value || '').toLowerCase().includes(needle)));
  }, [institutions, query]);

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const createInstitution = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setCreated(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Please sign in again.');
      const token = await user.getIdToken(true);
      const response = await fetch('/api/admin/institutions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, licenseCount: Number(form.licenseCount), pricePerLicense: Number(form.pricePerLicense), discountValue: Number(form.discountValue) }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error || 'Unable to create institution.');
      setCreated(payload.institution);
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      setError(err.message || 'Unable to create institution.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><Building2 className="w-6 h-6 text-emerald-600" /><h1 className="text-2xl font-black text-slate-900">Institution Command Centre</h1></div>
          <p className="text-sm text-slate-500 mt-1">Create institutions, allocate license pools and monitor institutional usage.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold flex items-center gap-2"><RefreshCw className="w-4 h-4" />Refresh</button>
          <button onClick={() => { setCreated(null); setShowCreate(true); }} className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center gap-2"><Plus className="w-4 h-4" />Create Institution</button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm font-semibold">{error}</div>}
      {created && <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 px-4 py-4 text-sm"><div className="font-black">Institution created successfully.</div><div className="mt-1">Share this institution code with the coordinator:</div><div className="mt-2 inline-flex items-center gap-2 bg-white border border-emerald-200 rounded-lg px-3 py-2 font-black tracking-wide"><KeyRound className="w-4 h-4" />{created.institutionCode}</div></div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Building2} label="Institutions" value={totals.totalInstitutions || 0} hint={`${totals.activeInstitutions || 0} active`} />
        <StatCard icon={CreditCard} label="Purchased licenses" value={(totals.totalLicenses || 0).toLocaleString('en-IN')} />
        <StatCard icon={Users} label="Allocated / used" value={(totals.usedLicenses || 0).toLocaleString('en-IN')} />
        <StatCard icon={KeyRound} label="Available licenses" value={(totals.availableLicenses || 0).toLocaleString('en-IN')} />
        <StatCard icon={CreditCard} label="Pending payments" value={totals.pendingPayments || 0} />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search institution, code, coordinator..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-400" /></div>
          <div className="text-xs font-semibold text-slate-500">Showing {filtered.length} of {institutions.length}</div>
        </div>

        {loading ? <div className="p-12 text-center text-slate-500 font-semibold">Loading institutions...</div> : filtered.length === 0 ? <div className="p-12 text-center text-slate-500"><Building2 className="w-10 h-10 mx-auto mb-3 text-slate-300" /><div className="font-bold">No institutions yet</div><div className="text-sm mt-1">Create your first institutional profile.</div></div> : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-500"><tr><th className="text-left px-5 py-3 font-bold">Institution</th><th className="text-left px-5 py-3 font-bold">Institution Code</th><th className="text-left px-5 py-3 font-bold">Licenses</th><th className="text-left px-5 py-3 font-bold">Payment</th><th className="text-left px-5 py-3 font-bold">Status</th><th className="text-left px-5 py-3 font-bold">Coordinator</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4"><div className="font-black text-slate-900">{item.name}</div><div className="text-xs text-slate-400 mt-1">{item.address || 'Address not supplied'}</div></td>
                    <td className="px-5 py-4"><span className="font-mono font-bold text-slate-700">{item.institutionCode || '—'}</span></td>
                    <td className="px-5 py-4"><div className="font-bold text-slate-800">{item.licenses.used} / {item.licenses.purchased}</div><div className="text-xs text-emerald-600">{item.licenses.available} available</div></td>
                    <td className="px-5 py-4"><div className="font-bold text-slate-800">{item.licenses.paymentStatus}</div><div className="text-xs text-slate-400">{money(item.licenses.totalAmount)}</div></td>
                    <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${item.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span></td>
                    <td className="px-5 py-4"><div className="font-semibold text-slate-700">{item.contactPerson || '—'}</div><div className="text-xs text-slate-400">{item.contactEmail || '—'}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between"><div><h2 className="text-xl font-black text-slate-900">Create Institution Profile</h2><p className="text-xs text-slate-500 mt-1">The platform will automatically generate the institution's unique Secret Sharz code.</p></div><button onClick={() => setShowCreate(false)} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button></div>
            <form onSubmit={createInstitution} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block"><span className="text-sm font-bold text-slate-700">School / Institution name *</span><input required value={form.name} onChange={e => update('name', e.target.value)} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5" /></label>
                <label className="block"><span className="text-sm font-bold text-slate-700">Contact person</span><input value={form.contactPerson} onChange={e => update('contactPerson', e.target.value)} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5" /></label>
                <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-700">School address</span><textarea value={form.address} onChange={e => update('address', e.target.value)} rows="2" className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5" /></label>
                <label className="block"><span className="text-sm font-bold text-slate-700">Coordinator email</span><input type="email" value={form.contactEmail} onChange={e => update('contactEmail', e.target.value)} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5" /></label>
                <label className="block"><span className="text-sm font-bold text-slate-700">Coordinator phone</span><input value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5" /></label>
                <label className="block"><span className="text-sm font-bold text-slate-700">Purchased licenses *</span><input required min="1" type="number" value={form.licenseCount} onChange={e => update('licenseCount', e.target.value)} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5" /></label>
                <label className="block"><span className="text-sm font-bold text-slate-700">Price per license (₹)</span><input min="0" type="number" value={form.pricePerLicense} onChange={e => update('pricePerLicense', e.target.value)} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5" /></label>
                <label className="block"><span className="text-sm font-bold text-slate-700">Discount type</span><select value={form.discountType} onChange={e => update('discountType', e.target.value)} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5"><option value="none">No discount</option><option value="percentage">Percentage</option><option value="fixed">Fixed amount per license</option></select></label>
                <label className="block"><span className="text-sm font-bold text-slate-700">Discount value</span><input min="0" type="number" value={form.discountValue} onChange={e => update('discountValue', e.target.value)} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5" /></label>
                <label className="block"><span className="text-sm font-bold text-slate-700">Payment status</span><select value={form.paymentStatus} onChange={e => update('paymentStatus', e.target.value)} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5"><option value="pending">Pending</option><option value="paid">Paid</option></select></label>
                <label className="block"><span className="text-sm font-bold text-slate-700">Institution status</span><select value={form.status} onChange={e => update('status', e.target.value)} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5"><option value="pending">Pending</option><option value="active">Active</option></select></label>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600"><div className="font-bold text-slate-800">How this works</div><ul className="list-disc ml-5 mt-2 space-y-1"><li>Secret Sharz generates the institution code automatically.</li><li>The coordinator uses that code to complete the institutional profile.</li><li>Student roster upload consumes licenses only up to the purchased limit.</li><li>Student access codes remain hidden until the institutional entitlement is activated.</li></ul></div>
              <div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 font-semibold">Cancel</button><button disabled={saving} type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold disabled:opacity-60">{saving ? 'Creating...' : 'Create Institution'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionDirectoryTab;
