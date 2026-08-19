import React, { useEffect, useMemo, useState } from 'react';

const PHASES = [
  ['phase1_unlock', 'Phase 1: Unlock', 'Self-Discovery', 'Understand your interests, strengths, motivations and profile.'],
  ['phase2_explore', 'Phase 2: Explore', 'Career Matches', 'Investigate the career pathways and possibilities identified for you.'],
  ['phase3_expand', 'Phase 3: Expand', 'Skill Development', 'Build the courses, skills, projects and experiences needed for your direction.'],
  ['phase4_inspire', 'Phase 4: Inspire', 'Mentorship & Shadowing', 'Learn from professionals through conversations, observation, shadowing or internships.'],
  ['phase5_ignite', 'Phase 5: Ignite', 'College & Applications', 'Turn your direction into target institutions, requirements, tests and an application timeline.'],
];

function formatDate(value) {
  if (!value) return 'Recently updated';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently updated';
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export default function StudentPublishedCareerRoadmap({ currentUser, studentData, onNavigate }) {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!currentUser?.uid) {
        setLoading(false);
        setError('Please sign in to view your career roadmap.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch('/api/student/career/roadmap', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.error || 'Unable to load your career roadmap.');
        if (!cancelled) setRoadmap(payload.roadmap || null);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Unable to load your career roadmap.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [currentUser?.uid]);

  const phases = roadmap?.phases || {};
  const completed = useMemo(() => PHASES.filter(([key]) => String(phases[key] || '').trim()).length, [phases]);
  const studentName = studentData?.identity?.preferredName || studentData?.identity?.fullName || studentData?.name || 'Student';
  const institution = studentData?.institution?.name || studentData?.schoolName || '';
  const grade = studentData?.academic?.current?.grade || studentData?.grade || '';
  const riasec = studentData?.career?.riasec?.code || studentData?.career?.profile?.riasec?.code || studentData?.riasecCode || '';

  if (loading) return <div style={styles.page}><div style={styles.loading}><div style={styles.spinner} /><div style={{ marginTop: 12, fontWeight: 800 }}>Loading your published roadmap…</div></div></div>;

  if (error) return <div style={styles.page}><div style={styles.centerCard}><div style={{ fontSize: 40 }}>⚠️</div><h1 style={styles.title}>We couldn't load your roadmap</h1><p style={styles.muted}>{error}</p><button onClick={() => window.location.reload()} style={styles.primary}>Try Again</button></div></div>;

  if (!roadmap) return <div style={styles.page}><div style={styles.centerCard}><div style={{ fontSize: 42 }}>🗺️</div><div style={styles.eyebrow}>CAREER JOURNEY</div><h1 style={styles.title}>Your personalised roadmap is not published yet.</h1><p style={styles.muted}>Your career counsellor is still preparing or reviewing your roadmap. Once it is published for you, it will appear here.</p><button onClick={() => onNavigate?.('/dashboard/career')} style={styles.secondary}>← Back to Career Dashboard</button></div></div>;

  return <div style={styles.page}>
    <main style={styles.container}>
      <section style={styles.hero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <button onClick={() => onNavigate?.('/dashboard/career')} style={styles.back}>← Career Dashboard</button>
            <div style={styles.eyebrow}>YOUR PUBLISHED CAREER ROADMAP</div>
            <h1 style={styles.heroTitle}>Your next chapter, {studentName}.</h1>
            <p style={styles.heroText}>{roadmap.summary || 'A personalised plan to help you move from self-understanding to exploration, development and action.'}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
              {riasec && <span style={styles.pill}>RIASEC: {riasec}</span>}
              {grade && <span style={styles.pill}>Grade: {grade}</span>}
              {institution && <span style={styles.pill}>{institution}</span>}
            </div>
          </div>
          <div style={styles.status}><div style={{ fontSize: 10, fontWeight: 900, letterSpacing: 1.4 }}>PUBLISHED</div><div style={{ fontSize: 12, marginTop: 5 }}>Updated {formatDate(roadmap.updatedAt)}</div></div>
        </div>
        <div style={{ marginTop: 25 }}><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 900, marginBottom: 8 }}><span>Roadmap phases</span><span>{completed}/5 populated</span></div><div style={styles.progress}><div style={{ ...styles.progressFill, width: `${(completed / 5) * 100}%` }} /></div></div>
      </section>

      <section style={styles.notice}><span style={{ fontSize: 22 }}>🔐</span><div><strong>This is your participant-facing roadmap.</strong><div style={styles.noticeText}>Only information intentionally published to your Student view is shown here. Private counsellor notes and professional case information are not part of this view.</div></div></section>

      <section style={styles.grid}>
        {PHASES.map(([key, title, badge, description], index) => {
          const content = String(phases[key] || '').trim();
          return <article key={key} style={{ ...styles.card, opacity: content ? 1 : 0.72 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}><div style={styles.number}>{String(index + 1).padStart(2, '0')}</div>{content ? <span style={styles.ready}>READY</span> : <span style={styles.pending}>TO BE DEVELOPED</span>}</div>
            <div style={styles.phaseTitle}>{title}</div>
            <div style={styles.badge}>{badge}</div>
            <p style={styles.description}>{description}</p>
            <div style={content ? styles.content : styles.empty}>{content || 'Your counsellor has not yet added this phase to the published roadmap.'}</div>
          </article>;
        })}
      </section>

      <section style={styles.footerCard}><div><div style={styles.eyebrow}>KEEP MOVING</div><h2 style={{ margin: '5px 0', fontSize: 22 }}>A roadmap is a guide, not a prediction.</h2><p style={{ ...styles.muted, marginBottom: 0 }}>Use these phases to start conversations, research options and take small next steps. Your direction can evolve as you learn more about yourself.</p></div><button onClick={() => onNavigate?.('/dashboard/career/journal')} style={styles.primary}>Open Reflection Journal →</button></section>
    </main>
  </div>;
}

const styles = {
  page: { minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '24px 18px 70px', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  container: { maxWidth: 1080, margin: '0 auto' },
  loading: { minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#475569' },
  spinner: { width: 40, height: 40, border: '4px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  centerCard: { maxWidth: 620, margin: '12vh auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 22, padding: 38, textAlign: 'center', boxShadow: '0 12px 35px rgba(15,23,42,.07)' },
  hero: { background: 'linear-gradient(135deg,#eef2ff,#faf5ff)', border: '1px solid #e0e7ff', borderRadius: 24, padding: 30, boxShadow: '0 10px 30px rgba(79,70,229,.06)' },
  eyebrow: { fontSize: 11, fontWeight: 950, letterSpacing: 1.5, color: '#4f46e5', textTransform: 'uppercase' },
  back: { border: 0, background: 'transparent', padding: 0, marginBottom: 20, color: '#64748b', fontWeight: 800, cursor: 'pointer' },
  heroTitle: { margin: '5px 0 8px', fontSize: 'clamp(28px,5vw,42px)', lineHeight: 1.1, fontWeight: 950 },
  title: { fontSize: 28, fontWeight: 950, margin: '8px 0' },
  heroText: { maxWidth: 760, color: '#475569', lineHeight: 1.7, margin: 0 },
  status: { background: '#ecfdf5', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 15, padding: '13px 16px', textAlign: 'center' },
  pill: { display: 'inline-flex', alignItems: 'center', padding: '8px 11px', borderRadius: 999, background: '#fff', border: '1px solid #dbeafe', color: '#4338ca', fontSize: 11, fontWeight: 900 },
  progress: { height: 9, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', borderRadius: 999 },
  notice: { display: 'flex', gap: 12, alignItems: 'flex-start', marginTop: 16, padding: '16px 18px', borderRadius: 16, background: '#fff', border: '1px solid #e2e8f0' },
  noticeText: { marginTop: 3, color: '#64748b', fontSize: 12, lineHeight: 1.6 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 16, marginTop: 18 },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 22, boxShadow: '0 5px 18px rgba(15,23,42,.04)' },
  number: { width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12, background: '#eef2ff', color: '#4f46e5', fontSize: 12, fontWeight: 950 },
  ready: { padding: '6px 8px', borderRadius: 999, background: '#ecfdf5', color: '#166534', fontSize: 9, fontWeight: 950, letterSpacing: 1 },
  pending: { padding: '6px 8px', borderRadius: 999, background: '#f8fafc', color: '#64748b', fontSize: 9, fontWeight: 950, letterSpacing: 1 },
  phaseTitle: { fontSize: 20, fontWeight: 950, marginTop: 17 },
  badge: { display: 'inline-block', marginTop: 7, padding: '5px 8px', borderRadius: 7, background: '#eef2ff', color: '#4338ca', fontSize: 9, fontWeight: 950, textTransform: 'uppercase', letterSpacing: .7 },
  description: { color: '#64748b', lineHeight: 1.55, fontSize: 12, margin: '12px 0' },
  content: { background: '#f8fafc', borderRadius: 13, padding: 14, fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', minHeight: 90 },
  empty: { background: '#f8fafc', borderRadius: 13, padding: 14, color: '#94a3b8', fontSize: 12, lineHeight: 1.6, minHeight: 90 },
  footerCard: { marginTop: 18, padding: 24, borderRadius: 20, background: '#111827', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' },
  muted: { color: '#64748b', lineHeight: 1.7, fontSize: 13 },
  primary: { border: 0, borderRadius: 12, background: '#4f46e5', color: '#fff', padding: '12px 16px', fontWeight: 900, cursor: 'pointer' },
  secondary: { border: '1px solid #cbd5e1', borderRadius: 12, background: '#fff', color: '#334155', padding: '12px 16px', fontWeight: 900, cursor: 'pointer' },
};
