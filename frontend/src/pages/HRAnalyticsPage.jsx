import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Database,
  GitMerge,
  BarChart2,
  Lightbulb,
  Users,
  TrendingDown,
  Briefcase,
} from 'lucide-react';

export default function HRAnalyticsPage() {
  const [visible, setVisible] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const pipelineNodes = [
    { Icon: Database, step: 'COLLECT', title: 'Raw HR Data', desc: '1,480 employee records across departments, salary bands, and tenure' },
    { Icon: GitMerge, step: 'TRANSFORM', title: 'Power Query ETL', desc: 'Cleaned nulls, standardized categories, created salary slabs & age groups' },
    { Icon: BarChart2, step: 'MODEL', title: 'DAX Measures', desc: 'Calculated KPIs: Attrition Rate, avg salary, employee distribution metrics' },
    { Icon: Lightbulb, step: 'INSIGHT', title: 'Visual Storytelling', desc: 'Interactive slicers, cross-filtering charts, and dynamic KPI cards' },
  ];

  const techStack = [
    { name: 'Power BI', role: 'Dashboard development & BI reporting' },
    { name: 'Power Query', role: 'ETL — Extract, Transform, Load' },
    { name: 'DAX', role: 'Calculated measures and KPIs' },
    { name: 'Data Modeling', role: 'Relationships and schema design' },
    { name: 'HR Analytics', role: 'Domain-specific insight extraction' },
    { name: 'Data Cleaning', role: 'Handling missing & inconsistent values' },
  ];

  const insights = [
    {
      icon: <Briefcase size={22} />,
      label: 'Salary Impact',
      stat: '~54%',
      statLabel: 'of attrition in lowest slab',
      color: 'var(--accent-cyan)',
      desc: 'Employees in the "Upto 5k" salary slab account for the overwhelming majority of attrition, highlighting compensation as the primary retention lever.',
    },
    {
      icon: <TrendingDown size={22} />,
      label: 'Tenure Risk',
      stat: '41.5%',
      statLabel: 'left within 1 year',
      color: '#a78bfa',
      desc: 'The first year of employment is the highest-risk window. 41.5% of all attrition happens at year 1, signaling a critical gap in early onboarding and engagement.',
    },
    {
      icon: <Users size={22} />,
      label: 'Work-Life Balance',
      stat: 'Level 3',
      statLabel: 'highest attrition score',
      color: '#f472b6',
      desc: 'Paradoxically, employees self-reporting a "good" work-life balance (level 3) show the highest attrition count — suggesting comfort with change, not burnout, drives departures.',
    },
  ];

  const screenshots = [
    { src: '/hr-analytics/Dashboard.png', label: 'Full Dashboard View' },
    { src: '/hr-analytics/DatasetColumns1.png', label: 'Dataset Columns — Part 1' },
    { src: '/hr-analytics/DatasetColumns2.png', label: 'Dataset Columns — Part 2' },
  ];

  const openLightbox = (src) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
  };

  return (
    <div
      className="project-page"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      {/* ═══════════════════════════════════════════════
          CHAPTER 01 — HERO
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" style={{ paddingTop: 160 }}>
        <div className="section-container">
          {/* Breadcrumb */}
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: 48 }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
            <Link to="/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Projects</Link>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>HR ANALYTICS DASHBOARD</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start md:items-center w-full overflow-hidden min-w-0">
            {/* ── Left Column ── */}
            <div className="mb-10 md:mb-0">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                <span className="tag-pill-v2 tag-pill-v2--purple">DATA ANALYTICS</span>
                <span className="tag-pill-v2">POWER BI</span>
                <span className="tag-pill-v2">DAX</span>
                <span className="tag-pill-v2">HR ANALYTICS</span>
              </div>

              <h1
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 24px' }}
                className="text-5xl md:text-7xl"
              >
                <span style={{ color: 'var(--text-primary)' }}>HR Analytics</span>
                <br />
                <span style={{ color: 'var(--text-primary)' }}>Dashboard</span>
                <span style={{ color: 'var(--accent-cyan)' }}>_</span>
              </h1>

              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 480, marginBottom: 36 }}>
                An end-to-end Business Intelligence dashboard built with Power BI. Transforms raw HR data from 1,480 employees into actionable insights on attrition, salary trends, and workforce retention strategies.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a
                  id="cta-live-demo"
                  href="#dashboard-preview"
                  className="animate-auto-click"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-cyan) 12%, transparent), color-mix(in srgb, var(--accent-blue) 10%, transparent))',
                    border: '1px solid var(--border-accent)',
                    borderRadius: 10, color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                    letterSpacing: '0.06em', padding: '13px 28px', textDecoration: 'none',
                    textTransform: 'uppercase', transition: 'all 0.25s ease',
                  }}
                >
                  View Dashboard ↓
                </a>
                <a
                  id="cta-source"
                  href="https://github.com/harrsh-here/HR-Analytics-PowerBI-Dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: 10, color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600,
                    letterSpacing: '0.06em', padding: '13px 28px', textDecoration: 'none',
                    textTransform: 'uppercase', transition: 'all 0.25s ease',
                  }}
                >
                  View Source <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* ── Right Column — Stats ── */}
            <div style={{ position: 'relative' }}>
              <div className="chapter-marker">03</div>
              <div style={{ marginBottom: 32 }}>
                <div className="status-badge" style={{ color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.15)', background: 'rgba(167, 139, 250, 0.04)' }}>
                  <span className="status-badge__dot" />
                  BI PROJECT
                </div>
              </div>
              <div className="grid grid-cols-2 md:flex md:flex-col gap-x-4 gap-y-8 md:gap-y-5">
                <div className="stat-counter">
                  <div className="stat-counter__value">1,480</div>
                  <div className="stat-counter__label">EMPLOYEES</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">238</div>
                  <div className="stat-counter__label">ATTRITION COUNT</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">16%</div>
                  <div className="stat-counter__label">ATTRITION RATE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 02 — DASHBOARD PREVIEW
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="dashboard-preview">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            02 // Dashboard Preview
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            The Dashboard
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 40, maxWidth: 600 }}>
            Click any image to expand it in full resolution.
          </p>

          {/* Hero screenshot — Clean Dashboard */}
          <div
            className="glass-panel"
            style={{ padding: 8, marginBottom: 16, cursor: 'zoom-in', overflow: 'hidden', borderRadius: 14 }}
            onClick={() => openLightbox('/hr-analytics/Clean_Dashboard.png')}
          >
            <img
              src="/hr-analytics/Clean_Dashboard.png"
              alt="Clean Dashboard"
              style={{ width: '100%', borderRadius: 10, display: 'block', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.01)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>

          {/* Thumbnail grid for the rest */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { src: '/hr-analytics/Dashboard.png',       label: 'Full Dashboard' },
              { src: '/hr-analytics/DatasetColumns1.png', label: 'Dataset — Part 1' },
              { src: '/hr-analytics/DatasetColumns2.png', label: 'Dataset — Part 2' },
            ].map((s) => (
              <div
                key={s.src}
                onClick={() => openLightbox(s.src)}
                style={{
                  cursor: 'zoom-in',
                  borderRadius: 10,
                  overflow: 'hidden',
                  border: '1px solid var(--border-accent)',
                  background: 'var(--bg-card)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.97)'; e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Fixed-height image box — uniform across all cards */}
                <div style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden' }}>
                  <img
                    src={s.src}
                    alt={s.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
                  />
                </div>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)',
                  textAlign: 'center', padding: '8px 4px', letterSpacing: '0.06em',
                  textTransform: 'uppercase', margin: 0,
                }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 03 — KEY INSIGHTS
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="insights">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            03 // Key Insights
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 48 }}>
            What the Data Revealed
          </h2>

          {/* Insight Tabs */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
            {insights.map((ins, i) => (
              <button
                key={i}
                onClick={() => setActiveInsight(i)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px', borderRadius: 8,
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                  border: activeInsight === i ? `1px solid ${ins.color}` : '1px solid var(--border)',
                  background: activeInsight === i ? `color-mix(in srgb, ${ins.color} 12%, transparent)` : 'transparent',
                  color: activeInsight === i ? ins.color : 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                }}
              >
                {ins.icon}
                {ins.label}
              </button>
            ))}
          </div>

          {/* Active Insight Panel */}
          <div className="glass-panel" style={{ padding: '40px 40px', display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', minWidth: 140 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 64, fontWeight: 900, color: insights[activeInsight].color, lineHeight: 1 }}>
                {insights[activeInsight].stat}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: 8, textTransform: 'uppercase' }}>
                {insights[activeInsight].statLabel}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
                {insights[activeInsight].label}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 16, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                {insights[activeInsight].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 04 — PIPELINE / WORKFLOW
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="pipeline">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            04 // Analytics Pipeline
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 48 }}>
            End-to-End Workflow
          </h2>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-0 lg:overflow-x-auto pb-2 pt-5">
            {pipelineNodes.map((node, i) => (
              <div key={node.step} className="flex flex-col lg:flex-row lg:items-center flex-1 min-w-[160px]">
                {/* Node card */}
                <div className="glass-panel" style={{
                  flex: 1, padding: '20px 20px 24px',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  position: 'relative',
                  width: '100%',
                }}>
                  {/* Step number — positioned at top-right corner as requested */}
                  <span style={{
                    position: 'absolute',
                    top: 16, right: 20,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 28, fontWeight: 800,
                    color: 'var(--accent-cyan)',
                    opacity: 0.2, lineHeight: 1,
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'color-mix(in srgb, var(--accent-cyan) 12%, transparent)',
                    border: '1px solid var(--border-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-cyan)',
                  }}>
                    <node.Icon size={20} />
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                      {node.step}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                      {node.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {node.desc}
                    </div>
                  </div>
                </div>

                {/* Arrow — vertically centered because parent is alignItems:center */}
                {i < pipelineNodes.length - 1 && (
                  <div className="flex justify-center items-center py-4 lg:py-0 lg:px-3 text-[var(--accent-cyan)] opacity-60">
                    <svg width="32" height="16" viewBox="0 0 32 16" fill="none" className="rotate-90 lg:rotate-0">
                      <line x1="0" y1="8" x2="23" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                      <polygon points="23,4 32,8 23,12" fill="currentColor" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 05 — TECH STACK
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="stack">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            05 // Stack
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 40 }}>
            Built With
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {techStack.map(item => (
              <div className="tech-card" key={item.name}>
                <div className="tech-card__name">{item.name}</div>
                <div className="tech-card__role">{item.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 06 — NAVIGATION
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section">
        <div className="section-container">
          <nav className="project-nav">
            <Link to="/projects" className="project-nav__link" id="nav-back">
              <ArrowLeft size={16} />
              Back to Projects
            </Link>
            <a
              href="https://github.com/harrsh-here/HR-Analytics-PowerBI-Dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="project-nav__link"
              id="nav-source-hr"
            >
              <ExternalLink size={16} />
              Source Code
              <ExternalLink size={12} />
            </a>
            <Link to="/projects/student-placement-predictor" className="project-nav__link" id="nav-next-hr">
              Next Project
              <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LIGHTBOX (Rendered in Portal to avoid transform issues)
      ═══════════════════════════════════════════════ */}
      {lightboxOpen && createPortal(
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.88)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: 32,
            backdropFilter: 'blur(8px)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <img
            src={lightboxSrc}
            alt="Dashboard enlarged"
            style={{ maxWidth: '95vw', maxHeight: '90vh', borderRadius: 12, boxShadow: '0 0 80px rgba(0,245,255,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{ position: 'absolute', top: 24, right: 32, fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            Click anywhere to close
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
