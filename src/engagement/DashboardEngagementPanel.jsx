import React from 'react';
import { buildDashboardWidgets } from './dashboardWidgets';

function Card({ widget }) {
  const data = widget.data;
  if (widget.type === 'challenge') return <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Daily challenge</div><h3 className="mt-2 text-xl font-bold text-slate-900">{data?.title || 'A small challenge for today'}</h3><p className="mt-1 text-sm text-slate-500">A short, optional activity. No pressure.</p>{data && <div className="mt-4 text-sm font-semibold text-indigo-600">+{data.points} XP</div>}</article>;
  if (widget.type === 'progress') return <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><h3 className="font-bold text-slate-900">{widget.title}</h3><div className="mt-4 flex gap-6"><div><div className="text-2xl font-black text-slate-900">{data?.xp || 0}</div><div className="text-xs text-slate-500">XP</div></div><div><div className="text-2xl font-black text-slate-900">{data?.streak || 0}</div><div className="text-xs text-slate-500">day streak</div></div></div></article>;
  if (widget.type === 'achievements') return <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><h3 className="font-bold text-slate-900">{widget.title}</h3><div className="mt-4 flex flex-wrap gap-2 text-sm"><span className={data?.weekly ? 'rounded-full bg-amber-100 px-3 py-1' : 'rounded-full bg-slate-100 px-3 py-1'}>🏆 Weekly</span><span className={data?.monthly ? 'rounded-full bg-amber-100 px-3 py-1' : 'rounded-full bg-slate-100 px-3 py-1'}>🏆 Monthly</span><span className={data?.annual ? 'rounded-full bg-amber-100 px-3 py-1' : 'rounded-full bg-slate-100 px-3 py-1'}>🏆 Annual</span></div></article>;
  if (widget.type === 'appointments') return <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><h3 className="font-bold text-slate-900">{widget.title}</h3>{data?.length ? <p className="mt-2 text-sm text-slate-600">You have {data.length} upcoming booking{data.length === 1 ? '' : 's'}.</p> : <p className="mt-2 text-sm text-slate-500">No upcoming booking. You can book a session when you need one.</p>}</article>;
  const count = Array.isArray(data) ? data.length : 0;
  return <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"><h3 className="font-bold text-slate-900">{widget.title}</h3><p className="mt-2 text-sm text-slate-500">{count ? `${count} item${count === 1 ? '' : 's'} available.` : 'Nothing new right now.'}</p></article>;
}

export default function DashboardEngagementPanel({ audience, engagement, content, journey }) {
  const widgets = buildDashboardWidgets({ audience, engagement, content, journey });
  return <section aria-label="Dashboard highlights" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{widgets.map(widget => <Card key={widget.id} widget={widget} />)}</section>;
}
