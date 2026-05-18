import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';

// ── FIXED IMPORT PATHS ─────────────────────────────
import POCSORStudents from './resources/pocso/POCSORStudents';
import Lifeskillstrainer from './resources/lifeskills/Lifeskillstrainer';
import PoshResources from './resources/posh/poshresources';
import MentalHealthFirstAid from './resources/mentalhealth/MentalHealthFirstAid';
import Softskillshub from './softskills/Softskillshub';

// ── RESOURCE LIBRARY CSS ──────────────────────────────────────────────────
const RESOURCE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  /* ── Page Shell ── */
  .res-page { min-height: 100vh; background: var(--warm-white, #FDFCFA); padding-bottom: 100px; }

  /* ── Hero ── */
  .res-hero { background: var(--ink, #1E2820); color: white; padding: 0; position: relative; overflow: hidden; }
  .res-hero-inner { max-width: 1200px; margin: 0 auto; padding: 80px 48px 72px; position: relative; z-index: 1; display: flex; gap: 60px; align-items: center; flex-wrap: wrap; }
  .res-hero-blob { position: absolute; border-radius: 50%; pointer-events: none; }
  .res-hero-blob-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(74,124,89,0.14) 0%, transparent 70%); top: -150px; right: -80px; }
  .res-hero-blob-2 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(232,132,90,0.1) 0%, transparent 70%); bottom: -80px; left: 300px; }
  .res-hero-left { flex: 1; min-width: 320px; }
  .res-hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(74,124,89,0.2); border: 1px solid rgba(74,124,89,0.4); color: #6FAA80; padding: 7px 16px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
  .res-hero-h1 { font-family: 'Fraunces', serif; font-size: clamp(36px, 5vw, 54px); font-weight: 700; line-height: 1.1; letter-spacing: -1px; margin-bottom: 18px; }
  .res-hero-h1 em { font-style: italic; color: #6FAA80; }
  .res-hero-sub { font-size: 17px; color: rgba(255,255,255,0.65); line-height: 1.75; max-width: 520px; font-weight: 300; margin-bottom: 32px; }
  .res-hero-badges { display: flex; gap: 12px; flex-wrap: wrap; }
  .res-hero-badge { display: flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); padding: 9px 16px; border-radius: 50px; font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 500; }
  .res-hero-right { flex-shrink: 0; display: flex; flex-direction: column; gap: 14px; }
  .res-stat-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; padding: 20px 26px; min-width: 180px; text-align: center; }
  .res-stat-num { font-family: 'Fraunces', serif; font-size: 38px; font-weight: 700; color: #6FAA80; line-height: 1; }
  .res-stat-label { font-size: 12px; color: rgba(255,255,255,0.45); font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }

  /* ── Filter & Search Bar ── */
  .res-controls { background: white; border-bottom: 1px solid rgba(30,40,32,0.08); padding: 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(30,40,32,0.06); }
  .res-controls-inner { max-width: 1200px; margin: 0 auto; padding: 16px 48px; display: flex; flex-direction: column; gap: 14px; }
  .res-controls-row { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
  .res-search-wrap { position: relative; flex: 1; min-width: 220px; max-width: 380px; }
  .res-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted, #7A8A7D); font-size: 16px; pointer-events: none; }
  .res-search-input { width: 100%; padding: 11px 38px 11px 42px; border: 2px solid rgba(30,40,32,0.12); border-radius: 50px; font-size: 14px; font-family: inherit; color: var(--ink, #1E2820); background: white; outline: none; transition: border-color 0.2s; }
  .res-search-input:focus { border-color: var(--sage, #4A7C59); }
  .res-search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: rgba(30,40,32,0.08); border: none; width: 20px; height: 20px; border-radius: 50%; font-size: 10px; cursor: pointer; color: var(--muted, #7A8A7D); display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
  .res-search-clear:hover { background: var(--sage, #4A7C59); color: white; }
  .res-filter-group { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
  .res-filter-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--muted, #7A8A7D); margin-right: 2px; white-space: nowrap; }
  .res-chip { padding: 7px 15px; border: 1.5px solid rgba(30,40,32,0.12); border-radius: 50px; font-size: 12px; font-weight: 700; cursor: pointer; background: white; color: var(--ink-soft, #3D4A40); font-family: inherit; transition: all 0.18s; white-space: nowrap; }
  .res-chip:hover { border-color: var(--sage, #4A7C59); color: var(--sage, #4A7C59); background: #EBF4EE; }
  .res-chip.active { background: var(--sage, #4A7C59); border-color: var(--sage, #4A7C59); color: white; }
  .res-chip.audience-Students.active    { background: #4A7C59; border-color: #4A7C59; }
  .res-chip.audience-Parents.active     { background: #7C6FA0; border-color: #7C6FA0; }
  .res-chip.audience-Teachers.active    { background: #5B9EBF; border-color: #5B9EBF; }
  .res-chip.audience-Counsellors.active { background: #E8845A; border-color: #E8845A; }
  .res-chip.topic-POCSO.active          { background: #2D5240; border-color: #2D5240; }
  .res-chip.topic-Mental-Health.active  { background: #7C6FA0; border-color: #7C6FA0; }
  .res-chip.topic-POSH.active           { background: #8E44AD; border-color: #8E44AD; }
  .res-chip.topic-Soft-Skills.active    { background: #2980B9; border-color: #2980B9; }
  .res-chip.format-PDF.active           { background: #C0392B; border-color: #C0392B; }
  .res-chip.format-PPT.active           { background: #E67E22; border-color: #E67E22; }
  .res-result-count { font-size: 12px; color: var(--muted, #7A8A7D); font-weight: 600; margin-left: auto; white-space: nowrap; }
  .res-result-count strong { color: var(--sage, #4A7C59); }
  .res-clear-all { font-size: 12px; color: var(--sage, #4A7C59); font-weight: 700; background: none; border: none; cursor: pointer; font-family: inherit; padding: 0; transition: color 0.2s; }
  .res-clear-all:hover { color: var(--moss, #2D5240); }

  /* ── Resource Grid ── */
  .res-main { max-width: 1200px; margin: 40px auto 0; padding: 0 48px; }
  .res-section-title { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: var(--ink, #1E2820); margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
  .res-section-divider { height: 1px; background: rgba(30,40,32,0.08); margin: 40px 0 32px; }
  .res-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }

  /* ── Resource Card ── */
  .res-card { background: white; border-radius: 20px; border: 1.5px solid rgba(30,40,32,0.1); box-shadow: 0 3px 14px rgba(30,40,32,0.06); overflow: hidden; display: flex; flex-direction: column; cursor: pointer; transition: all 0.28s cubic-bezier(0.25, 0.8, 0.25, 1); opacity: 0; transform: translateY(16px); }
  .res-card.card-in { opacity: 1; transform: translateY(0); }
  .res-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(30,40,32,0.13); border-color: transparent; }
  .res-card-accent { height: 5px; width: 100%; }
  .res-card-body { padding: 26px; flex: 1; display: flex; flex-direction: column; }
  .res-card-top { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
  .res-card-icon-wrap { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
  .res-card-title-block { flex: 1; }
  .res-card-title { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 700; color: var(--ink, #1E2820); line-height: 1.25; margin-bottom: 3px; }
  .res-card-subtitle { font-size: 12px; color: var(--muted, #7A8A7D); font-weight: 600; }
  .res-card-desc { font-size: 14px; color: var(--ink-soft, #3D4A40); line-height: 1.7; flex: 1; margin-bottom: 20px; }
  .res-card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px; }
  .res-card-tag { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .res-card-tag.audience { background: #EBF4EE; color: #4A7C59; }
  .res-card-tag.audience-Parents    { background: #F0EDF8; color: #7C6FA0; }
  .res-card-tag.audience-Teachers   { background: #EAF4FA; color: #5B9EBF; }
  .res-card-tag.age   { background: rgba(30,40,32,0.05); color: var(--ink-soft, #3D4A40); }
  .res-card-tag.topic-POCSO { background: #E8F5EE; color: #2D5240; }
  .res-card-tag.topic-MH    { background: #F0EDF8; color: #7C6FA0; }
  .res-card-tag.topic-Soft-Skills { background: #EAF4FA; color: #2980B9; }
  .res-card-format-row { display: flex; gap: 8px; margin-bottom: 20px; align-items: center; }
  .res-format-badge { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .res-format-badge.pdf { background: rgba(192,57,43,0.08); color: #C0392B; border: 1px solid rgba(192,57,43,0.2); }
  .res-format-badge.ppt { background: rgba(230,126,34,0.08); color: #E67E22; border: 1px solid rgba(230,126,34,0.2); }
  .res-format-badge.html { background: rgba(52,152,219,0.08); color: #2980B9; border: 1px solid rgba(52,152,219,0.2); }
  .res-card-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: var(--muted, #7A8A7D); font-weight: 500; border-top: 1px solid rgba(30,40,32,0.06); padding-top: 16px; }
  .res-card-cta { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--sage, #4A7C59); transition: gap 0.2s; }
  .res-card:hover .res-card-cta { gap: 10px; }
  .res-pdf-btn { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: rgba(192,57,43,0.1); color: #C0392B; border-radius: 20px; text-decoration: none; font-weight: 700; transition: background 0.2s; }
  .res-pdf-btn:hover { background: rgba(192,57,43,0.2); }

  /* ── New badge ── */
  .res-new-badge { position: absolute; top: 14px; right: 14px; background: var(--sage, #4A7C59); color: white; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 3px 9px; border-radius: 20px; }

  /* ── Empty State ── */
  .res-empty { text-align: center; padding: 80px 20px; color: var(--muted, #7A8A7D); grid-column: 1 / -1; }
  .res-empty-icon { font-size: 56px; margin-bottom: 16px; display: block; }
  .res-empty h3 { font-family: 'Fraunces', serif; font-size: 24px; color: var(--ink, #1E2820); margin-bottom: 8px; }

  /* ── Coming Soon Strip ── */
  .res-coming-soon { background: rgba(30,40,32,0.03); border: 2px dashed rgba(30,40,32,0.12); border-radius: 16px; padding: 28px; text-align: center; color: var(--muted, #7A8A7D); }
  .res-coming-soon h4 { font-family: 'Fraunces', serif; font-size: 18px; color: var(--ink, #1E2820); margin-bottom: 6px; }
  .res-coming-soon p { font-size: 13px; }

  /* ── Request Strip ── */
  .res-request-strip { max-width: 1200px; margin: 48px auto 0; padding: 0 48px; }
  .res-request-card { background: linear-gradient(135deg, #1E2820, #2D5240); border-radius: 20px; padding: 36px 40px; display: flex; align-items: center; gap: 32px; flex-wrap: wrap; }
  .res-request-text h3 { font-family: 'Fraunces', serif; font-size: 22px; color: white; margin-bottom: 6px; }
  .res-request-text p { font-size: 14px; color: rgba(255,255,255,0.6); margin: 0; max-width: 480px; line-height: 1.6; }
  .res-request-btn { background: white; color: var(--ink, #1E2820); border: none; padding: 13px 26px; border-radius: 50px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; white-space: nowrap; transition: all 0.2s; flex-shrink: 0; }
  .res-request-btn:hover { background: #6FAA80; color: white; }

  @keyframes resSlideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  @media(max-width: 900px) {
    .res-hero-inner { padding: 56px 24px; gap: 40px; }
    .res-hero-right { display: none; }
    .res-controls-inner { padding: 12px 20px; }
    .res-main { padding: 0 20px; }
    .res-grid { grid-template-columns: 1fr; }
    .res-request-strip { padding: 0 20px; }
    .res-request-card { padding: 24px; }
    .res-controls-row { gap: 6px; }
  }
`;

// ── RESOURCE LIST ─────────────────────────────────────────────────────────────
const RESOURCE_LIST = [
  {
    id: 'pocso-students',
    slug: 'pocso-students',
    title: 'POCSO: Know Your Rights',
    subtitle: 'Student Safety Handbook & Classroom PPT',
    topic: 'POCSO',
    audience: ['Students'],
    ageGroups: ['Primary (6–10)', 'Upper Primary (11–13)', 'Secondary (14–17)'],
    formats: ['PDF', 'PPT'],
    languages: ['English'],
    icon: '🛡️',
    color: '#2D5240',
    colorPale: '#E8F5EE',
    accentColor: '#4A7C59',
    description: 'A complete, age-appropriate handbook on POCSO rights for students — available in three separate versions for Primary, Upper Primary, and Secondary classes. Includes a classroom-ready PowerPoint presentation and printable handbook for each age group.',
    lastUpdated: 'January 2026',
    isNew: false,
    component: POCSORStudents,
    pdfLink: '/POCSO Guidelines-flat.pdf'
  },
  {
    id: 'lifeskillstrainer',
    slug: 'lifeskillstrainer',
    title: 'Life Skills Training Module',
    subtitle: 'Comprehensive Guide for Educators',
    topic: 'Life Skills',
    audience: ['Teachers', 'Counsellors', 'NGO Workers'],
    ageGroups: ['All Ages'],
    formats: ['Interactive'],
    languages: ['English'],
    icon: '🌱',
    color: '#E8845A', 
    colorPale: '#FDF0EA',
    accentColor: '#C0392B',
    description: 'A comprehensive interactive module designed for educators and counsellors to effectively teach core life skills, build resilience, and foster emotional intelligence in students.',
    lastUpdated: 'April 2026',
    isNew: true,
    component: Lifeskillstrainer,
    pdfLink: null 
  },
  {
    id: 'posh-resources',
    slug: 'posh-resources',
    title: 'POSH Act Toolkit',
    subtitle: 'Prevention of Sexual Harassment Guidelines',
    topic: 'POSH',
    audience: ['Teachers', 'Staff', 'Administration'],
    ageGroups: ['Adults'],
    formats: ['Interactive', 'PDF'],
    languages: ['English'],
    icon: '⚖️',
    color: '#8E44AD', 
    colorPale: '#F5EEF8',
    accentColor: '#9B59B6',
    description: 'A dedicated toolkit detailing the Prevention of Sexual Harassment (POSH) at Workplace Act. Includes guidelines, reporting structures, and compliance protocols for educational institutions.',
    lastUpdated: 'April 2026',
    isNew: true,
    component: PoshResources,
    pdfLink: null 
  },
  {
    id: 'mh-first-aid',
    slug: 'mental-health-first-aid',
    title: 'Mental Health & Emotional First Aid',
    subtitle: 'Immediate relief & maintenance tools',
    topic: 'Mental Health',
    audience: ['Students', 'Teachers', 'Counsellors'],
    ageGroups: ['All Ages'],
    formats: ['Interactive', 'PDF'],
    languages: ['English'],
    icon: '🩹',
    color: '#7C6FA0', 
    colorPale: '#F0EDF8',
    accentColor: '#A89DD0',
    description: 'A critical toolkit for emotional survival. Includes the Grounding Toolkit, Emotion Wheel, In My Control worksheets, Exam Anxiety guides, and a National Crisis Directory.',
    lastUpdated: 'April 2026',
    isNew: true,
    component: MentalHealthFirstAid,
    pdfLink: null 
  },
  {
    id: 'softskills-hub',
    slug: 'soft-skills-hub',
    title: 'Soft Skills Hub',
    subtitle: 'Master Interpersonal & Communication Skills',
    topic: 'Soft Skills',
    audience: ['Students', 'Teachers', 'Counsellors'],
    ageGroups: ['Upper Primary (11–13)', 'Secondary (14–17)', 'Adults'],
    formats: ['Interactive'],
    languages: ['English'],
    icon: '💬',
    color: '#5B9EBF', 
    colorPale: '#EAF4FA',
    accentColor: '#2980B9',
    description: 'An interactive hub dedicated to developing essential soft skills, including communication, empathy, teamwork, and problem-solving for academic and professional success.',
    lastUpdated: 'May 2026',
    isNew: true,
    component: Softskillshub,
    pdfLink: null 
  }
];

const ALL_AUDIENCES = ['Students', 'Parents', 'Teachers', 'Counsellors', 'NGO Workers', 'Staff', 'Administration'];
const ALL_TOPICS    = ['POCSO', 'Mental Health', 'Life Skills', 'Soft Skills', 'Career Guidance', 'POSH'];
const ALL_FORMATS   = ['PDF', 'PPT', 'Interactive'];

// ── RESOURCE CARD COMPONENT ───────────────────────────────────────────────────
function ResourceCard({ resource, onClick, searchQuery, animDelay }) {
  const ref = useRef(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const t = setTimeout(() => {
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) { el.classList.add('card-in'); obs.disconnect(); }
      }, { threshold: 0.1 });
      obs.observe(el);
      return () => obs.disconnect();
    }, animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  return (
    <div
      ref={ref}
      className="res-card"
      style={{ position: 'relative' }}
      onClick={() => !resource.comingSoon && onClick(resource)}
    >
      {resource.isNew && <div className="res-new-badge">New</div>}
      <div className="res-card-accent" style={{ background: `linear-gradient(90deg, ${resource.accentColor}, ${resource.color})` }} />
      <div className="res-card-body">
        <div className="res-card-top">
          <div className="res-card-icon-wrap" style={{ background: resource.colorPale }}>
            {resource.icon}
          </div>
          <div className="res-card-title-block">
            <div className="res-card-title">{resource.title}</div>
            <div className="res-card-subtitle">{resource.subtitle}</div>
          </div>
        </div>

        <p className="res-card-desc">{resource.description}</p>

        {/* Audience + Age Group Tags */}
        <div className="res-card-tags">
          {resource.audience.map(a => (
            <span key={a} className={`res-card-tag audience audience-${a}`}>{a}</span>
          ))}
          <span className={`res-card-tag topic-${resource.topic.replace(' ', '-')}`}>{resource.topic}</span>
          {resource.ageGroups.length <= 2
            ? resource.ageGroups.map(ag => <span key={ag} className="res-card-tag age">{ag}</span>)
            : <span className="res-card-tag age">{resource.ageGroups.length} Age Groups</span>
          }
        </div>

        {/* Format Badges */}
        <div className="res-card-format-row">
          {resource.formats.map(f => (
            <span key={f} className={`res-format-badge ${f.toLowerCase()}`}>
              {f === 'PDF' ? '📄' : f === 'PPT' ? '📊' : '🌐'} {f}
            </span>
          ))}
          {resource.languages.map(l => (
            <span key={l} style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>🌐 {l}</span>
          ))}
        </div>

        {/* Updated Footer with Direct Download Link */}
        <div className="res-card-meta">
          <span>🗓 Updated {resource.lastUpdated}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {resource.pdfLink && (
              <a 
                href={resource.pdfLink} 
                download 
                target="_blank" 
                rel="noreferrer"
                className="res-pdf-btn"
                onClick={(e) => e.stopPropagation()} // Stop it from opening the resource page when clicking download
              >
                ⬇️ PDF
              </a>
            )}
            {resource.comingSoon
              ? <span style={{ color: 'var(--muted)', fontSize: '12px', fontWeight: 700 }}>Coming Soon →</span>
              : <span className="res-card-cta">Open →</span>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN RESOURCES COMPONENT ──────────────────────────────────────────────────
export default function Resources({ navigate }) {
  const [activeResource, setActiveResource] = useState(null);
  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('All');
  const [topicFilter, setTopicFilter] = useState('All');
  const [formatFilter, setFormatFilter] = useState('All');
  const searchRef = useRef(null);

  // Inject CSS
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = RESOURCE_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  // URL-aware routing
  useEffect(() => {
    const checkUrl = () => {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts[0] === 'resources' && parts[1]) {
        const found = RESOURCE_LIST.find(r => r.slug === parts[1]);
        if (found && !found.comingSoon) { setActiveResource(found); return; }
      }
      setActiveResource(null);
    };
    checkUrl();
    window.addEventListener('popstate', checkUrl);
    return () => window.removeEventListener('popstate', checkUrl);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeResource]);

  const handleOpen = useCallback((resource) => {
    window.history.pushState({}, '', `/resources/${resource.slug}`);
    setActiveResource(resource);
  }, []);

  const handleBack = useCallback(() => {
    window.history.pushState({}, '', '/resources');
    setActiveResource(null);
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    return RESOURCE_LIST.filter(r => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        r.audience.some(a => a.toLowerCase().includes(q));
      const matchAudience = audienceFilter === 'All' || r.audience.includes(audienceFilter);
      const matchTopic = topicFilter === 'All' || r.topic === topicFilter;
      const matchFormat = formatFilter === 'All' || r.formats.includes(formatFilter);
      return matchSearch && matchAudience && matchTopic && matchFormat;
    });
  }, [search, audienceFilter, topicFilter, formatFilter]);

  const hasFilters = search || audienceFilter !== 'All' || topicFilter !== 'All' || formatFilter !== 'All';
  const clearAll = () => { setSearch(''); setAudienceFilter('All'); setTopicFilter('All'); setFormatFilter('All'); };

  // ── Render single resource ──
  if (activeResource) {
    const Comp = activeResource.component;
    if (Comp) return <Comp navigate={navigate} onBack={handleBack} allResources={RESOURCE_LIST} />;
    return null;
  }

  // ── Render library listing ──
  return (
    <div className="res-page">

      {/* HERO */}
      <div className="res-hero">
        <div className="res-hero-blob res-hero-blob-1" />
        <div className="res-hero-blob res-hero-blob-2" />
        <div className="res-hero-inner">
          <div className="res-hero-left">
            <div className="res-hero-eyebrow">📚 Free Resource Library</div>
            <h1 className="res-hero-h1">
              Professional tools for<br />
              <em>everyone who works with children</em>
            </h1>
            <p className="res-hero-sub">
              Free, evidence-based handbooks, classroom presentations, and toolkits — built for teachers, counsellors, parents, NGO workers, and resource persons across India. Download, print, and use without restriction.
            </p>
            <div className="res-hero-badges">
              <div className="res-hero-badge">🇮🇳 India-specific content</div>
              <div className="res-hero-badge">📄 Print-ready PDFs</div>
              <div className="res-hero-badge">📊 Ready-to-use PPTs</div>
              <div className="res-hero-badge">🔓 Completely free</div>
            </div>
          </div>
          <div className="res-hero-right">
            <div className="res-stat-card">
              <div className="res-stat-num">{RESOURCE_LIST.filter(r => !r.comingSoon).length}</div>
              <div className="res-stat-label">Resources Available</div>
            </div>
            <div className="res-stat-card">
              <div className="res-stat-num">3</div>
              <div className="res-stat-label">Age Groups Covered</div>
            </div>
            <div className="res-stat-card">
              <div className="res-stat-num">Free</div>
              <div className="res-stat-label">Always — No Sign-In</div>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY FILTER BAR */}
      <div className="res-controls">
        <div className="res-controls-inner">
          <div className="res-controls-row">
            {/* Search */}
            <div className="res-search-wrap">
              <span className="res-search-icon">🔍</span>
              <input
                ref={searchRef}
                type="text"
                className="res-search-input"
                placeholder="Search resources..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="res-search-clear" onClick={() => { setSearch(''); searchRef.current?.focus(); }}>✕</button>
              )}
            </div>

            {/* Audience filter */}
            <div className="res-filter-group">
              <span className="res-filter-label">For</span>
              {['All', ...ALL_AUDIENCES].map(a => (
                <button
                  key={a}
                  className={`res-chip audience-${a} ${audienceFilter === a ? 'active' : ''}`}
                  onClick={() => setAudienceFilter(a)}
                >{a}</button>
              ))}
            </div>

            {hasFilters && (
              <button className="res-clear-all" onClick={clearAll}>✕ Clear all</button>
            )}
            <span className="res-result-count">
              <strong>{filtered.filter(r => !r.comingSoon).length}</strong> of {RESOURCE_LIST.filter(r => !r.comingSoon).length} resources
            </span>
          </div>

          <div className="res-controls-row">
            {/* Topic filter */}
            <div className="res-filter-group">
              <span className="res-filter-label">Topic</span>
              {['All', ...ALL_TOPICS].map(t => (
                <button
                  key={t}
                  className={`res-chip topic-${t.replace(' ', '-')} ${topicFilter === t ? 'active' : ''}`}
                  onClick={() => setTopicFilter(t)}
                >{t}</button>
              ))}
            </div>

            {/* Format filter */}
            <div className="res-filter-group">
              <span className="res-filter-label">Format</span>
              {['All', ...ALL_FORMATS].map(f => (
                <button
                  key={f}
                  className={`res-chip format-${f} ${formatFilter === f ? 'active' : ''}`}
                  onClick={() => setFormatFilter(f)}
                >{f}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="res-main">
        {filtered.length === 0 ? (
          <div className="res-empty">
            <span className="res-empty-icon">🌱</span>
            <h3>No resources match your filters</h3>
            <p style={{ marginBottom: '20px' }}>Try adjusting your search or filters. We add new resources regularly.</p>
            <button className="res-chip active" onClick={clearAll}>Clear all filters</button>
          </div>
        ) : (
          <>
            <div className="res-section-title">📚 Available Resources</div>
            <div className="res-grid">
              {filtered.filter(r => !r.comingSoon).map((r, i) => (
                <ResourceCard key={r.id} resource={r} onClick={handleOpen} searchQuery={search} animDelay={i * 80} />
              ))}
            </div>

            {/* Coming soon section */}
            {RESOURCE_LIST.some(r => r.comingSoon) && (
              <>
                <div className="res-section-divider" />
                <div className="res-section-title">🔜 Coming Soon</div>
                <div className="res-grid">
                  {RESOURCE_LIST.filter(r => r.comingSoon).map((r, i) => (
                    <ResourceCard key={r.id} resource={r} onClick={() => {}} searchQuery="" animDelay={i * 80} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* REQUEST A RESOURCE STRIP */}
      <div className="res-request-strip">
        <div className="res-request-card">
          <div style={{ fontSize: '48px' }}>💡</div>
          <div className="res-request-text" style={{ flex: 1 }}>
            <h3>Need a resource that isn't here yet?</h3>
            <p>We take requests from teachers, counsellors, and NGO workers. If you work with children and need a specific handbook, training slide deck, or parent guide — tell us and we'll build it.</p>
          </div>
          <button className="res-request-btn" onClick={() => navigate && navigate('/wall')}>
            Request a Resource →
          </button>
        </div>
      </div>
    </div>
  );
}
