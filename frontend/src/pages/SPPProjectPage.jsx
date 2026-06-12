import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Database,
  Settings,
  Brain,
  CheckCircle,
} from 'lucide-react';
import PlacementPredictorApp from '../components/PlacementPredictorApp';

export default function SPPProjectPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const pipelineNodes = [
    {
      Icon: Database,
      step: 'INPUT',
      title: 'Raw Features',
      desc: 'CGPA and IQ values from student academic records',
    },
    {
      Icon: Settings,
      step: 'PROCESS',
      title: 'StandardScaler',
      desc: 'Normalizes features to zero mean and unit variance',
    },
    {
      Icon: Brain,
      step: 'MODEL',
      title: 'Logistic Regression',
      desc: 'Sigmoid activation maps features to placement probability',
    },
    {
      Icon: CheckCircle,
      step: 'OUTPUT',
      title: 'Prediction',
      desc: 'Binary classification with confidence score',
    },
  ];

  const techStack = [
    { name: 'Python', role: 'Core language for ML pipeline' },
    { name: 'Scikit-Learn', role: 'Model training and StandardScaler' },
    { name: 'Flask', role: 'Lightweight REST API server' },
    { name: 'NumPy', role: 'Numerical array operations' },
    { name: 'Pandas', role: 'Data preprocessing' },
    { name: 'Gunicorn', role: 'Production WSGI server' },
  ];

  return (
    <div
      className="project-page project-page--spp"
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
          <nav
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--text-muted)',
              letterSpacing: '0.06em',
              marginBottom: 48,
            }}
          >
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
            <Link to="/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Projects
            </Link>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>PLACEMENT PREDICTOR</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full overflow-hidden min-w-0">
            {/* ── Left Column ── */}
            <div className="mb-10 md:mb-0">
              {/* Tag Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                <span className="tag-pill-v2 tag-pill-v2--purple">ML</span>
                <span className="tag-pill-v2">PYTHON</span>
                <span className="tag-pill-v2">SCIKIT-LEARN</span>
                <span className="tag-pill-v2">FLASK</span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 900,
                  lineHeight: 1.05,
                  margin: '0 0 24px',
                }}
                className="text-5xl md:text-7xl"
              >
                <span style={{ color: 'var(--text-primary)' }}>Placement</span>
                <br />
                <span style={{ color: 'var(--text-primary)' }}>Predictor</span>
                <span style={{ color: 'var(--accent-cyan)' }}>_</span>
              </h1>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 17,
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  maxWidth: 480,
                  marginBottom: 36,
                }}
              >
                A lightweight machine-learning system that predicts campus placement
                outcomes using two key academic indicators. Built with Scikit-Learn for
                the model and Flask for real-time inference via a REST API.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a
                  id="cta-live-demo"
                  href="#live-demo"
                  className="animate-auto-click"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-cyan) 12%, transparent), color-mix(in srgb, var(--accent-blue) 10%, transparent))',
                    border: '1px solid var(--border-accent)',
                    borderRadius: 10,
                    color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    padding: '13px 28px',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    transition: 'all 0.25s ease',
                  }}
                >
                  Try Live Demo ↓
                </a>
                <a
                  id="cta-source"
                  href="https://github.com/harrsh-here/placement-predictor"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    padding: '13px 28px',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    transition: 'all 0.25s ease',
                  }}
                >
                  View Source <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* ── Right Column ── */}
            <div style={{ position: 'relative' }}>
              <div className="chapter-marker">01</div>

              <div style={{ marginBottom: 32 }}>
                <div className="status-badge">
                  <span className="status-badge__dot" />
                  DEPLOYED
                </div>
              </div>

              <div className="grid grid-cols-2 md:flex md:flex-col gap-x-4 gap-y-8 md:gap-y-5">
                <div className="stat-counter">
                  <div className="stat-counter__value">93%</div>
                  <div className="stat-counter__label">ACCURACY</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">2</div>
                  <div className="stat-counter__label">FEATURES</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">&lt;1s</div>
                  <div className="stat-counter__label">INFERENCE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 02 — LIVE DEMO
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="live-demo">
        <div className="section-container">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 40,
            }}
          >
            02 // Live Inference
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
              marginBottom: 16,
            }}
          >
            Interactive Demo — Adjust parameters below
          </div>

          <div className="glass-panel" style={{ padding: '40px 36px' }}>
            <PlacementPredictorApp />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 03 — HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="architecture">
        <div className="section-container">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            03 // Architecture
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 36,
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: 48,
            }}
          >
            Pipeline Design
          </h2>

          <div className="pipeline">
            {pipelineNodes.map((node, i) => (
              <div key={node.step} style={{ display: 'contents' }}>
                <div className="pipeline-node-v2">
                  <div className="pipeline-node-v2__icon">
                    <node.Icon size={22} />
                  </div>
                  <div>
                    <div className="pipeline-node-v2__step">{node.step}</div>
                    <div className="pipeline-node-v2__title">{node.title}</div>
                    <div className="pipeline-node-v2__desc">{node.desc}</div>
                  </div>
                </div>
                {i < pipelineNodes.length - 1 && <div className="pipeline-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 04 — TECH STACK
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="stack">
        <div className="section-container">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-muted)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            04 // Stack
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 36,
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: 40,
            }}
          >
            Built With
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
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
          CHAPTER 05 — NAVIGATION
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section">
        <div className="section-container">
          <nav className="project-nav">
            <Link to="/projects" className="project-nav__link" id="nav-back">
              <ArrowLeft size={16} />
              Back to Projects
            </Link>
            <a
              href="https://github.com/harrsh-here/placement-predictor"
              target="_blank"
              rel="noopener noreferrer"
              className="project-nav__link"
              id="nav-source"
            >
              <ExternalLink size={16} />
              Source Code
              <ExternalLink size={12} />
            </a>
            <Link to="/projects/movie-recommender" className="project-nav__link" id="nav-next">
              Next Project
              <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
