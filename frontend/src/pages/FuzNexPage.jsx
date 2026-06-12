import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Smartphone,
  Watch,
  Server,
  Mic,
  Brain,
  Crown,
} from 'lucide-react';

function GithubIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

/* ── Team ─────────────────────────────────────────────── */
const team = [
  {
    name: 'Harsh Patidar',
    role: 'Team Lead · Architect · Developer · Designer',
    note: 'Core vision, full-stack development, UI/UX design, and project direction.',
    isLead: true,
    github: 'https://github.com/harrsh-here',
    linkedin: 'https://in.linkedin.com/in/harsh-patidar-580726286',
  },
  {
    name: 'Dheeraj Saini',
    role: 'Contributor',
    note: 'Hackathon preparation, project ideation support, and team motivation.',
    isLead: false,
    github: 'https://github.com/dheerajsaini-6080',
    linkedin: 'https://in.linkedin.com/in/dheeraj-saini-1279b2308',
  },
  {
    name: 'Govind Patel',
    role: 'Contributor',
    note: 'Hackathon submissions, logistics, and late-night debugging support.',
    isLead: false,
    github: 'https://github.com/govindpatel0421',
    linkedin: 'https://www.linkedin.com/in/govind-patel-a005b02a9',
  },
  {
    name: 'Gopal Sharma',
    role: 'Contributor',
    note: 'Idea verification, presentation support, and overall team coordination.',
    isLead: false,
    github: 'https://github.com/gopalsharma43',
    linkedin: 'https://in.linkedin.com/in/gopal-sharma-7411692b9',
  },
];

/* ── Architecture blocks ──────────────────────────────── */
const archBlocks = [
  {
    Icon: Watch,
    label: 'CLIENT',
    title: 'Smartwatch Interface',
    desc: 'Wearable prototype — analog watch face, app launcher, voice assistant, alarms, tasks & more.',
    accent: '#00f5ff',
    url: 'https://fuznex-wrist.netlify.app/',
    cta: 'Launch Watch',
  },
  {
    Icon: Smartphone,
    label: 'CLIENT',
    title: 'Phone Application',
    desc: 'Mobile prototype — authentication, chats, fitness history, notification panel & live mic overlay.',
    accent: '#a78bfa',
    url: 'https://fuznex-phone.netlify.app/',
    cta: 'Launch Phone',
  },
  {
    Icon: Server,
    label: 'BACKEND',
    title: 'REST API Layer',
    desc: 'Node.js / Express server with Sequelize ORM — handles auth, pairing, tasks, alarms & notifications.',
    accent: '#34d399',
    url: null,
    cta: null,
  },
  {
    Icon: Mic,
    label: 'MICROSERVICE',
    title: 'Speech-to-Text Service',
    desc: 'FastAPI microservice running OpenAI Whisper to transcribe real-time voice input from both clients.',
    accent: '#f472b6',
    url: null,
    cta: null,
  },
  {
    Icon: Brain,
    label: 'AI INTEGRATIONS',
    title: 'Intelligence Layer',
    desc: 'Multi-LLM routing across Gemini, OpenAI, Groq, Google TTS, and Vapi.ai for real-time processing.',
    accent: '#fbbf24',
    url: null,
    cta: null,
  },
];

/* ── Tech stack ───────────────────────────────────────── */
const techStack = [
  { name: 'React + Vite', role: 'Frontend — Watch & Phone prototypes' },
  { name: 'Node.js / Express', role: 'REST API server' },
  { name: 'Sequelize ORM', role: 'Database abstraction layer' },
  { name: 'Aiven MySQL', role: 'Cloud-hosted relational database' },
  { name: 'FastAPI', role: 'Python speech microservice' },
  { name: 'OpenAI Whisper', role: 'Audio transcription engine' },
  { name: 'Vapi.ai', role: 'Live voice mic overlay on phone' },
  { name: 'Gemini 2.5 Flash', role: 'Primary LLM backbone' },
  { name: 'Groq / OpenAI', role: 'Fallback & specialised LLM calls' },
  { name: 'Google TTS', role: 'Text-to-speech voice responses' },
  { name: 'Tailwind CSS', role: 'Styling system' },
  { name: 'Netlify', role: 'Frontend deployment' },
];

export default function FuzNexPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

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
            <span style={{ color: 'var(--accent-cyan)' }}>FuzNex</span>
          </nav>

          {/* Two-column hero */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start md:items-center w-full overflow-hidden min-w-0">

            {/* Left */}
            <div className="mb-10 md:mb-0">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
                01 // Project
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {['CROSS-PLATFORM', 'WEB', 'WEAR OS', 'REACT', 'NODE.JS'].map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 20,
                    background: 'var(--accent-glow)', color: 'var(--accent-cyan)',
                    border: '1px solid var(--border-accent)',
                  }}>{tag}</span>
                ))}
              </div>

              <h1 style={{
                fontFamily: 'var(--font-mono)', fontSize: 'clamp(40px, 6vw, 72px)',
                fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.05,
                marginBottom: 20, letterSpacing: '-0.02em',
              }}>
                FuzNex
              </h1>

              <p style={{ fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
                A multi-device prototype system, currently in stealth — built across wearable and mobile form factors with an intelligent backend layer.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full">
                <a
                  id="cta-live-demo"
                  href="https://fuznex-wrist.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-cyan) 12%, transparent), color-mix(in srgb, var(--accent-blue) 10%, transparent))',
                    border: '1px solid var(--border-accent)',
                    borderRadius: 10, color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                    letterSpacing: '0.06em', padding: '13px 28px', textDecoration: 'none',
                    textTransform: 'uppercase', transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.97)'; e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Watch size={15} /> Launch Watch
                </a>
                <a
                  id="cta-source"
                  href="https://fuznex-phone.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-cyan) 12%, transparent), color-mix(in srgb, var(--accent-blue) 10%, transparent))',
                    border: '1px solid var(--border-accent)',
                    borderRadius: 10, color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
                    letterSpacing: '0.06em', padding: '13px 28px', textDecoration: 'none',
                    textTransform: 'uppercase', transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(0.97)'; e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <Smartphone size={15} /> Launch Phone
                </a>
              </div>

              {/* Disclaimer */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '12px 16px', borderRadius: 8,
                background: 'rgba(251, 191, 36, 0.06)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                marginTop: 30,
              }}>
                <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                <p style={{
                  fontFamily: 'var(--font-sans)', fontSize: 11.5,
                  color: 'rgba(251, 191, 36, 0.85)', lineHeight: 1.6, margin: 0,
                }}>
                  Prototypes are hosted on free-tier servers that may spin down during inactivity. Initial loading may take 30+ seconds. Some live features may be temporarily offline or may not function as expected.
                </p>
              </div>
            </div>

            {/* Right — Stats */}
            <div style={{ position: 'relative' }} className="w-full min-w-0">
              <div className="chapter-marker">04</div>
              <div style={{ marginBottom: 32 }}>
                <div className="status-badge" style={{ color: '#fbbf24', border: '1px solid rgba(251, 191, 36, 0.15)', background: 'rgba(251, 191, 36, 0.04)' }}>
                  <span className="status-badge__dot" />
                  IN PROGRESS
                </div>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-col gap-x-4 gap-y-8 sm:gap-y-5">
                <div className="stat-counter">
                  <div className="stat-counter__value">2</div>
                  <div className="stat-counter__label">CLIENT PROTOTYPES</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">3</div>
                  <div className="stat-counter__label">BACKEND SERVICES</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">4</div>
                  <div className="stat-counter__label">TEAM MEMBERS</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">6+</div>
                  <div className="stat-counter__label">AI INTEGRATIONS</div>
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            02 // Architecture
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            How It's Built
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 40, maxWidth: 560 }}>
            A distributed multi-service architecture spanning two client applications, a REST API layer, a dedicated speech microservice, and multiple AI integrations.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {archBlocks.map((block, i) => (
              <div
                key={block.title}
                className="glass-panel"
                style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}
              >
                <span style={{
                  position: 'absolute', top: 16, right: 20,
                  fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 800,
                  color: block.accent, opacity: 0.15, lineHeight: 1,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: `color-mix(in srgb, ${block.accent} 12%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${block.accent} 35%, transparent)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: block.accent,
                }}>
                  <block.Icon size={20} />
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                    {block.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>
                    {block.title}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.65 }}>
                    {block.desc}
                  </div>
                </div>

                {block.url && (
                  <a
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      marginTop: 'auto', fontFamily: 'var(--font-mono)', fontSize: 12,
                      fontWeight: 700, color: block.accent, textDecoration: 'none',
                      letterSpacing: '0.06em', transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {block.cta} <ExternalLink size={11} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 03 — TEAM
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="team">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            03 // The Team
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            Contributors
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 40, maxWidth: 560 }}>
            Built with a close-knit team who showed up at every hackathon, verification session, and late-night debugging sprint.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {team.map((member) => (
              <div
                key={member.name}
                className="glass-panel"
                style={{
                  padding: '24px 20px', position: 'relative',
                  display: 'flex', flexDirection: 'column', gap: 10,
                  boxShadow: member.isLead ? '0 0 0 1px #a78bfa, 0 0 20px rgba(167, 139, 250, 0.15)' : undefined,
                }}
              >
                {member.isLead && (
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    background: '#a78bfa', color: '#000',
                    padding: '3px 10px', borderRadius: 20,
                    fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 900,
                    letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <Crown size={9} /> LEAD
                  </div>
                )}

                {/* Avatar initials */}
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: member.isLead
                    ? 'rgba(167, 139, 250, 0.18)'
                    : 'rgba(255,255,255,0.04)',
                  border: member.isLead
                    ? '1px solid #a78bfa'
                    : '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 800,
                  color: member.isLead ? '#c4b5fd' : 'var(--text-muted)',
                }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {member.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: member.isLead ? '#a78bfa' : 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>
                    {member.role}
                  </div>
                  <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    {member.note}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--text-muted)', transition: 'color 0.2s ease' }}
                      title="GitHub"
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    ><GithubIcon size={15} /></a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--text-muted)', transition: 'color 0.2s ease' }}
                      title="LinkedIn"
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-cyan)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                    ><LinkedinIcon size={15} /></a>
                  )}
                </div>
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
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            04 // Stack
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
          CHAPTER 05 — NAVIGATION
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section">
        <div className="section-container">
          <nav className="project-nav">
            <Link to="/projects" className="project-nav__link" id="nav-back">
              <ArrowLeft size={16} />
              Back to Projects
            </Link>
            <div style={{ display: 'flex', gap: 16 }}>
              <a
                href="https://fuznex-wrist.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="project-nav__link"
                id="nav-watch-fuznex"
              >
                <Watch size={16} /> Watch Prototype <ExternalLink size={13} />
              </a>
              <a
                href="https://fuznex-phone.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="project-nav__link"
                id="nav-phone-fuznex"
              >
                <Smartphone size={16} /> Phone Prototype <ExternalLink size={13} />
              </a>
            </div>
          </nav>
        </div>
      </section>

    </div>
  );
}
