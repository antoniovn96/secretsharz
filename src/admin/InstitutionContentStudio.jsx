import React, { useMemo, useState } from 'react';

const TYPES = [
  ['news', '📰', 'News'], ['blog', '✍️', 'Blogs'], ['event', '📅', 'Events'],
  ['announcement', '📢', 'Announcements'], ['guideline', '📘', 'Guidelines'],
  ['challenge', '🎯', 'Challenges'], ['achievement', '🏆', 'Achievements'],
];
const AUDIENCES = ['all', 'counselling', 'career', 'sen', 'parent', 'institution'];

export default function InstitutionContentStudio({ initialItems = [], onCreate, onEdit, onPublish }) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');

  const items = useMemo(() => initialItems.filter(item => {
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesAudience = audienceFilter === 'all' || item.audience?.includes(audienceFilter);
    const haystack = `${item.title || ''} ${item.summary || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
    return matchesType && matchesStatus && matchesAudience && haystack.includes(query.toLowerCase());
  }), [initialItems, typeFilter, statusFilter, audienceFilter, query]);

  return (
    <section className="mx-auto max-w-7xl space-y-6 p-6" aria-label="Institution Content Studio">
      <header className="flex flex-col gap-4 rounded-3xl bg-slate-900 p-6 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-300">Institution Content Studio</p>
          <h1 className="mt-1 text-3xl font-bold">Keep every dashboard alive.</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">Create once, target the right audience, schedule it, preview it, and publish it across the platform.</p>
        </div>
        <button type="button" onClick={() => onCreate?.()} className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 shadow">+ Create Content</button>
      </header>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {TYPES.map(([value, icon, label]) => {
          const count = initialItems.filter(item => item.type === value).length;
          return <button key={value} type="button" onClick={() => setTypeFilter(typeFilter === value ? 'all' : value)} className={`rounded-2xl border p-4 text-left transition ${typeFilter === value ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white'}`}>
            <div className="text-2xl">{icon}</div><div className="mt-2 text-sm font-semibold">{label}</div><div className="text-xs text-slate-500">{count} items</div>
          </button>;
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search content…" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5"><option value="all">All statuses</option><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option><option value="archived">Archived</option></select>
        <select value={audienceFilter} onChange={e => setAudienceFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5"><option value="all">All audiences</option>{AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}</select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"><span>Content</span><span>Status</span><span>Audience</span><span>Action</span></div>
        {items.length === 0 ? <div className="p-10 text-center text-sm text-slate-500">No content matches these filters.</div> : items.map(item => <article key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0">
          <div><div className="font-semibold text-slate-900">{item.title}</div><div className="mt-1 text-xs text-slate-500">{item.type} · v{item.version || 1}</div></div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">{item.status}</span>
          <span className="max-w-32 truncate text-xs text-slate-600">{(item.audience || ['all']).join(', ')}</span>
          <div className="flex gap-2"><button type="button" onClick={() => onEdit?.(item)} className="rounded-lg border px-3 py-1.5 text-xs font-medium">Edit</button>{item.status !== 'published' && <button type="button" onClick={() => onPublish?.(item)} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">Publish</button>}</div>
        </article>)}
      </div>
    </section>
  );
}
