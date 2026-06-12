import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MonitorSmartphone,
  Palette,
  Code2,
  Zap,
} from 'lucide-react';

export default function PortfolioProjectPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  const pipelineNodes = [
    {
      Icon: Palette,
      step: 'DESIGN',
      title: 'UI/UX Conceptualization',
      desc: 'Crafting a sci-fi, terminal-inspired aesthetic with dark mode and neon accents.',
    },
    {
      Icon: Code2,
      step: 'DEVELOPMENT',
      title: 'React & Tailwind',
      desc: 'Building responsive components, routing, and styling with modern CSS utilities.',
    },
    {
      Icon: Zap,
      step: 'ANIMATION',
      title: 'Canvas & Framer',
      desc: 'Implementing the dynamic background particle engine and smooth page transitions.',
    },
    {
      Icon: MonitorSmartphone,
      step: 'DEPLOYMENT',
      title: 'Vite & Hosting',
      desc: 'Optimizing production builds for fast loading and seamless interactivity across devices.',
    },
  ];

  const techStack = [
    { name: 'React', role: 'Component-based UI architecture' },
    { name: 'Tailwind CSS', role: 'Rapid utility-first styling and animations' },
    { name: 'Vite', role: 'Lightning-fast build tool and dev server' },
    { name: 'HTML5 Canvas', role: 'Custom high-performance background rendering loop' },
    { name: 'Lucide React', role: 'Consistent, crisp vector iconography' },
    { name: 'React Router', role: 'Seamless client-side navigation' },
  ];

  return (
    <div
      className="project-page project-page--movie" // Using the movie accent variant for a cool blue/purple vibe
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
            <span style={{ color: 'var(--text-secondary)' }}>PORTFOLIO OS</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full overflow-hidden min-w-0">
            {/* ── Left Column ── */}
            <div className="mb-10 md:mb-0">
              {/* Tag Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                <span className="tag-pill-v2 tag-pill-v2--blue">WEB</span>
                <span className="tag-pill-v2">REACT</span>
                <span className="tag-pill-v2">TAILWIND</span>
                <span className="tag-pill-v2">CANVAS</span>
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
                <span style={{ color: 'var(--text-primary)' }}>Portfolio</span>
                <br />
                <span style={{ color: 'var(--text-primary)' }}>OS</span>
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
                A highly interactive, deeply stylized personal portfolio built to mimic a futuristic sci-fi terminal. Features a custom 2D canvas particle engine, dynamic theme switching, and glassmorphic UI elements designed to stand out.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a
                  id="cta-live-demo"
                  href="/"
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
                  You Are Here!
                </a>
                <a
                  id="cta-source"
                  href="https://github.com/harrsh-here/portfolio"
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
                  <div className="stat-counter__value">60fps</div>
                  <div className="stat-counter__label">CANVAS ENGINE</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">4</div>
                  <div className="stat-counter__label">COLOR THEMES</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">100%</div>
                  <div className="stat-counter__label">RESPONSIVE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 02 — ARCHITECTURE
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
            02 // Design & Build
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
            Development Process
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
          CHAPTER 03 — TECH STACK
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="tech-stack" style={{ paddingBottom: 120 }}>
        <div className="gradient-divider" style={{ position: 'absolute', top: 0 }} />

        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full overflow-hidden min-w-0">
            <div>
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
                03 // Stack
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 36,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: 24,
                }}
              >
                Frontend Architecture
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 16,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: 32,
                }}
              >
                Built entirely as a Single Page Application (SPA) to ensure uninterrupted background animations and instantaneous navigation between sections. The custom 2D canvas dynamically resizes and handles its own high-performance render loop alongside the React DOM.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {techStack.map((tech) => (
                <div key={tech.name} className="glass-panel" style={{ padding: '16px 20px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 14,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: 4,
                    }}
                  >
                    {tech.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {tech.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
