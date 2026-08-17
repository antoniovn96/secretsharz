import React, { useEffect, useMemo, useState } from 'react';
import { auth } from '../firebase';

const SERVICE_CONFIG = {
  wellbeing: {
    eyebrow: 'SECRET SHARZ · INSTITUTIONAL WELLBEING',
    title: 'Wellbeing Institution Workspace',
    description: 'Monitor participation and support-system readiness without exposing students’ private emotional or clinical information.',
    icon: '🌿',
    accent: '#0f766e',
    pale: '#f0fdfa',
    boundary: 'Individual counselling records, journals, mood logs, diagnoses, risk labels and clinical notes remain private to the student and authorised care team.',
  },
  sen: {
    eyebrow: 'SECRET SHARZ · INSTITUTIONAL SEN',
    title: 'SEN Institution Workspace',
    description: 'Monitor inclusion-service participation and operational readiness while keeping individual SEN records protected.',
    icon: '🧩',
    accent: '#6d28d9',
    pale: '#f5f3ff',
    boundary: 'Individual case files, IEP contents, assessment details and professional notes are not exposed through the institutional overview.',
  },
};

const card = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 22, boxShadow: '0 8px 28px rgba(15,23,42,.05)' };

function Metric({ label, value, hint }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 11, fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: .5 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 950, color: '#0f172a', marginTop: 7 }}>{value}</div>
      {hint && <div style={{ fontSize: 12, color: '#64748b', marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

export default function InstitutionServiceDashboard({ service }) {
  const config = SERVICE_CONFIG[service] || SERVICE_CONFIG.wellbeing;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const token = await auth.currentUser?.getIdToken();
        if (!token) throw new Error('Authentication required.');
        const response = await fetch(`/api/institution/service-dashboard?service=${encodeURIComponent(service)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error || 'Unable to load the institutional workspace.');
        if (!cancelled) setData(payload);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Unable to load the institutional workspace.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [service]);

  const summary = data?.summary || {};
  const utilisation = useMemo(() => {
    const total = Number(summary.rosterStudents || 0);
    const claimed = Number(summary.claimedStudents || 0);
    return total ? Math.round((claimed / total) * 100) : 0;
  }, [summary]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#64748b', fontWeight: 800 }}>Loading institutional workspace…</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px 18px 60px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ ...card, background: `linear-gradient(135deg, #0f172a, #1e293b)`, color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#fbbf24', fontSize: 11, fontWeight: 900, letterSpacing: 1.5 }}>{config.eyebrow}</div>
              <h1 style={{ margin: '8px 0', fontSize: 32 }}>{config.icon} {config.title}</h1>
              <p style={{ margin: 0, color: '#cbd5e1', maxWidth: 760, lineHeight: 1.6 }}>{config.description}</p>
            </div>
            <div style={{ padding: '10px 13px', borderRadius: 999, background: 'rgba(34,197,94,.16)', color: '#86efac', fontWeight: 900, fontSize: 12 }}>
              ● AGGREGATE-ONLY ACCESS
            </div>
          </div>
        </div>

        {error && (
          <div style={{ ...card, marginTop: 14, background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b', fontWeight: 700 }}>
            {error}
          </div>
        )}

        {!error && data && <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 14 }}>
            <Metric label="Cohort" value={summary.rosterStudents || 0} hint="Students provisioned to this institution" />
            <Metric label="Activated" value={summary.claimedStudents || 0} hint={`${utilisation}% of the institutional roster`} />
            <Metric label="Linked service accounts" value={summary.serviceLinkedAccounts || 0} hint="Accounts associated with this service" />
            <Metric label="Operationally active" value={summary.operationallyActive || 0} hint="Accounts with an active workflow state" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 14, marginTop: 14 }}>
            <section style={card}>
              <h2 style={{ marginTop: 0 }}>Participation readiness</h2>
              <p style={{ color: '#64748b', lineHeight: 1.65 }}>
                Institutional coordinators can use this view to understand whether students have activated their access and whether the service is operationally ready. It is intentionally not a clinical monitoring dashboard.
              </p>
              <div style={{ marginTop: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 13, color: '#475569' }}>
                  <span>Student activation</span><span>{utilisation}%</span>
                </div>
                <div style={{ height: 10, background: '#eef2f7', borderRadius: 99, overflow: 'hidden', marginTop: 7 }}>
                  <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, utilisation))}%`, background: config.accent, borderRadius: 99 }} />
                </div>
              </div>
            </section>

            <section style={{ ...card, background: config.pale, borderColor: `${config.accent}33` }}>
              <h2 style={{ marginTop: 0 }}>Privacy boundary</h2>
              <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: 0 }}>{config.boundary}</p>
            </section>
          </div>

          <section style={{ ...card, marginTop: 14, background: '#fffbeb', borderColor: '#fde68a' }}>
            <h3 style={{ marginTop: 0, color: '#92400e' }}>Professional-use rule</h3>
            <p style={{ margin: 0, color: '#78350f', lineHeight: 1.7 }}>
              Institutional reporting is for service planning, participation and programme-level oversight. It must not be used as a disciplinary, selection, diagnostic, surveillance or individual risk-ranking mechanism.
            </p>
          </section>
        </>}
      </div>
    </div>
  );
}
