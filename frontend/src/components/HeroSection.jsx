import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Mail, FileText, ChevronDown, ArrowRight } from 'lucide-react'
import Terminal from './Terminal'

function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const roles = ['AI & Data Science Student', 'Python Developer', 'ML Enthusiast', 'Google Cloud Lead @ GDG ACEIT']

const socialButtons = [
  { icon: GithubIcon, href: 'https://github.com/harrsh-here', label: 'GitHub' },
  { icon: LinkedinIcon, href: 'https://linkedin.com/in/harsh-patidar-580726286', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:harshptidar1234@gmail.com', label: 'Email' },
  { icon: FileText, href: '/resume.pdf', label: 'Resume' },
]

function Typewriter({ texts }) {
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[textIndex]
    let timeout
    if (!deleting && charIndex < currentText.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 80)
    } else if (!deleting && charIndex === currentText.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 40)
    } else if (deleting && charIndex === 0) {
      setDeleting(false)
      setTextIndex((i) => (i + 1) % texts.length)
    }
    return () => clearTimeout(timeout)
  }, [charIndex, deleting, textIndex, texts])

  return (
    <span style={{ color: 'var(--accent-cyan)' }}>
      {texts[textIndex].slice(0, charIndex)}
      <span className="cursor-blink">|</span>
    </span>
  )
}

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  const scrollToWork = () => {
    const el = document.getElementById('about')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="flex items-center"
      style={{
        minHeight: 'calc(100vh - 45px)', /* TWEAK THIS: Change 60px to 40px to push the separator even lower, or 80px to pull it up! */
        borderTop: 'none',
        paddingTop: '120px',
        paddingBottom: '80px'
      }}>
      <div className="section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className={`text-sm mb-3 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700, letterSpacing: '0.15em' }}>
              harrsh_here //
            </p>

            <h1 className={`glitch-intro mb-6 transition-all duration-500 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 'clamp(40px, 9vw, 110px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 0.95,
                color: '#ffffff',
                textShadow: '0 0 60px var(--accent-glow)',
              }}>
              <span style={{ display: 'block' }}>HARSH</span>
              <span style={{ display: 'block' }}>PATIDAR</span>
            </h1>

            <div className={`text-xl md:text-2xl mb-6 h-9 transition-all duration-500 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ fontFamily: 'var(--font-mono)' }}>
              <Typewriter texts={roles} />
            </div>

            <p className={`text-lg leading-relaxed max-w-lg transition-all duration-500 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>
              Final-year B.Tech student at Arya College, Jaipur.
              I build ML models, wrangle data, and deploy things that actually work.
            </p>

            {/* Social buttons + View Projects link */}
            <div className={`flex items-center gap-4 flex-wrap transition-all duration-500 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{
                marginTop: '36px', /* Increase this to move the icons and button lower! */
                marginBottom: '24px' /* Increase this to push the "see my work" button lower! */
              }}>
              {socialButtons.map(({ icon: Icon, href, label }) => (
                <div key={label} className="relative group">
                  <a href={href}
                    target={href.startsWith('http') || href.startsWith('mailto') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 icon-link"
                    style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-cyan)'
                      e.currentTarget.style.color = 'var(--accent-cyan)'
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(0,245,255,0.15)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                    aria-label={label} id={`hero-cta-${label.toLowerCase()}`}>
                    <Icon size={18} />
                  </a>
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none"
                    style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
                    {label}
                  </span>
                </div>
              ))}

              {/* View Projects link */}
              <Link to="/projects"
                id="hero-cta-view-projects"
                className="flex items-center gap-2 text-sm font-medium transition-all duration-200"
                style={{
                  padding: '8px 16px', /* Adjust this for height and width! */
                  borderRadius: '8px', /* Adjust this for corner rounding! */
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid color-mix(in srgb, var(--accent-cyan) 20%, transparent)', /* Adjust this for border width! */
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent-cyan) 8%, transparent)'
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--accent-cyan) 20%, transparent)'
                }}>
                View Projects <ArrowRight size={14} />
              </Link>
            </div>

            {/* See my work — brighter */}
            <button onClick={scrollToWork}
              className={`flex items-center gap-2 text-sm transition-all duration-500 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              style={{
                marginTop: '30px', /* Adjust this to push it further down! */
                fontFamily: 'var(--font-sans)',
                color: 'var(--text-secondary)',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-cyan)'
                e.currentTarget.style.textShadow = '0 0 12px rgba(0,245,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.textShadow = 'none'
              }}>
              <ChevronDown size={16} /> see my work ↓
            </button>
          </div>

          <div className={`hidden lg:block transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  )
}
