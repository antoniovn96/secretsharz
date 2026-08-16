import React, { useMemo, useState } from 'react';
import { TEST_BUNDLES, TEST_FAMILIES, TEST_BUNDLE_COUNT } from './career/testBundleCatalogue';

const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, boxShadow: '0 8px 28px rgba(15,23,42,.05)' };
const familyOrder = ['interest', 'personality', 'aptitude_skills', 'work_values', 'learning'];

function formatDuration(bundle) {
  if (!bundle) return '';
  return bundle.familyCount === 1
    ? `${bundle.durationMinutes} min`
    : `${bundle.durationMinutes} min unified session`;
}

function FamilyCard({ family }) {
  const f = TEST_FAMILIES[family];
  return <article style={card}>
    <div style={{ color: '#4f46e5', fontSize: 10, fontWeight: 900, letterSpacing: 1.2 }}>TEST {familyOrder.indexOf(family) + 1} OF 5</div>
    <h3 style={{ margin: '7px 0 5px', fontSize: 18 }}>{f.title}</h3>
    <p style={{ color: '#64748b', lineHeight: 1.65, fontSize: 13 }}>{f.description}</p>
    <div style={{ display: 'grid', gap: 7, marginTop: 12 }}>
      <div style={{ padding: 10, borderRadius: 10, background: '#f8fafc', fontSize: 12 }}><strong>Duration:</strong> {f.durationMinutes.min}–{f.durationMinutes.max} minutes</div>
      <div style={{ padding: 10, borderRadius: 10, background: '#f8fafc', fontSize: 12 }}><strong>Report:</strong> {f.reportOutput.slice(0, 2).join(' · ')}</div>
    </div>
    <p style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.55, marginBottom: 0 }}>{f.scientificNote}</p>
  </article>;
}

function BundleCard({ bundle, selected, onSelect }) {
  const label = bundle.familyCount === 5 ? 'FULL CAREER INTELLIGENCE' : `${bundle.familyCount}-TEST BUNDLE`;
  return <article style={{ ...card, border: selected ? '2px solid #4f46e5' : card.border, boxShadow: selected ? '0 10px 32px rgba(79,70,229,.14)' : card.boxShadow }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
      <div><div style={{ color: '#4f46e5', fontSize: 10, fontWeight: 900, letterSpacing: 1.2 }}>{label}</div><h3 style={{ margin: '6px 0 4px', fontSize: 17 }}>{bundle.title}</h3></div>
      <span style={{ padding: '5px 8px', borderRadius: 999, background: '#eef2ff', color: '#4338ca', fontSize: 10, fontWeight: 900, whiteSpace: 'nowrap' }}>{formatDuration(bundle)}</span>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '12px 0' }}>{bundle.familyIds.map(id => <span key={id} style={{ padding: '6px 8px', borderRadius: 8, background: '#f8fafc', color: '#334155', fontSize: 11, fontWeight: 800 }}>{TEST_FAMILIES[id].shortTitle}</span>)}</div>
    <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: 12, margin: '8px 0' }}><strong>One experience:</strong> one progress bar, one continuous assessment, one submission and one integrated report.</p>
    <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: 12, margin: '8px 0' }}><strong>Report:</strong> {bundle.reportPages} pages · {bundle.reportType === 'full_career_intelligence' ? 'Full Career Intelligence' : 'Integrated Test Bundle Report'}</p>
    <button onClick={() => onSelect(bundle)} style={{ width: '100%', border: 0, borderRadius: 11, padding: '11px 14px', background: selected ? '#312e81' : '#4f46e5', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>{selected ? 'Selected' : 'Select this bundle'}</button>
  </article>;
}

export default function TestBundleCatalogueView() {
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const bundles = useMemo(() => filter === 'all' ? TEST_BUNDLES : TEST_BUNDLES.filter(bundle => bundle.familyCount === Number(filter)), [filter]);
  const selectedFamilies = selected?.familyIds || [];

  return <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '30px 18px 80px' }}>
    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
      <section style={{ ...card, background: 'linear-gradient(135deg,#0f172a,#1e293b)', color: '#fff', padding: 30 }}>
        <div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 900, letterSpacing: 1.5 }}>VIDYAVANTAGE TEST BUNDLES</div>
        <h1 style={{ margin: '8px 0 8px', fontSize: 34 }}>Choose the intelligence you need.</h1>
        <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.75 }}>There are five core test families and exactly 31 possible non-empty combinations. For individuals, the complete five-test experience is presented as one package. Institutions can purchase the bundle/pass that fits their programme.</p>
      </section>

      <section style={{ ...card, marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>The 5 test families</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(205px,1fr))', gap: 12 }}>{familyOrder.map(id => <FamilyCard key={id} family={id} />)}</div>
      </section>

      <section style={{ ...card, marginTop: 16, background: '#eef2ff', borderColor: '#c7d2fe' }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: '#4338ca', letterSpacing: 1.2 }}>HOW MULTIPLE TESTS WORK</div>
        <h2 style={{ margin: '6px 0' }}>They do not become separate tests for the student.</h2>
        <p style={{ margin: 0, color: '#475569', lineHeight: 1.75 }}>When a school purchases two or more test families, VidyaVantage composes them into one continuous assessment. The student sees one introduction, one progress indicator, adaptive transitions between constructs, one final submission and one integrated report. The engine stores the underlying module results separately so they remain reusable, but the experience is seamless.</p>
      </section>

      <section style={{ ...card, marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div><h2 style={{ margin: 0 }}>All {TEST_BUNDLE_COUNT} combinations</h2><p style={{ color: '#64748b', margin: '5px 0 0', fontSize: 13 }}>Every non-empty subset of the five test families is available as a configurable institutional bundle.</p></div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button onClick={() => setFilter('all')} style={{ border: 0, borderRadius: 9, padding: '8px 11px', background: filter === 'all' ? '#4f46e5' : '#f1f5f9', color: filter === 'all' ? '#fff' : '#334155', fontWeight: 800 }}>All</button>
            {[1,2,3,4,5].map(n => <button key={n} onClick={() => setFilter(String(n))} style={{ border: 0, borderRadius: 9, padding: '8px 11px', background: filter === String(n) ? '#4f46e5' : '#f1f5f9', color: filter === String(n) ? '#fff' : '#334155', fontWeight: 800 }}>{n} test{n > 1 ? 's' : ''}</button>)}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12, marginTop: 16 }}>{bundles.map(bundle => <BundleCard key={bundle.id} bundle={bundle} selected={selected?.id === bundle.id} onSelect={setSelected} />)}</div>
      </section>

      {selected && <section style={{ ...card, marginTop: 16, position: 'sticky', bottom: 12, zIndex: 5 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <div><div style={{ color: '#4f46e5', fontSize: 10, fontWeight: 900, letterSpacing: 1.2 }}>SELECTED BUNDLE</div><h3 style={{ margin: '5px 0' }}>{selected.title}</h3><div style={{ color: '#64748b', fontSize: 12 }}>{selectedFamilies.map(id => TEST_FAMILIES[id].shortTitle).join(' · ')} · {formatDuration(selected)}</div></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><button onClick={() => { window.location.href = `/dashboard/career/assessment?bundle=${encodeURIComponent(selected.id)}`; }} style={{ border: 0, borderRadius: 11, padding: '12px 16px', background: '#4f46e5', color: '#fff', fontWeight: 900, cursor: 'pointer' }}>Start unified assessment</button><button onClick={() => setSelected(null)} style={{ border: '1px solid #cbd5e1', borderRadius: 11, padding: '12px 16px', background: '#fff', color: '#334155', fontWeight: 800, cursor: 'pointer' }}>Clear</button></div>
        </div>
      </section>}
    </div>
  </div>;
}
