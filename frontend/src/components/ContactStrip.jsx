import MatrixText from './MatrixText'
import { Mail, FileText } from 'lucide-react'
import { useRef, useEffect } from 'react'

function GithubIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const wrapStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',
  marginTop: '8px',
}

const dividerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '1px',
  background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
  opacity: 0.8,
  boxShadow: '0 0 10px var(--accent-cyan)',
}

export default function ContactStrip() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add('revealed')
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-reveal"
      style={{ backgroundColor: 'var(--bg-surface)', position: 'relative' }}
    >
      <style>{`
        .contact-btn-wrapper {
          position: relative;
          border-radius: 10px;
          padding: 1.5px;
          background: transparent;
          transition: box-shadow 0.4s ease;
        }

        @property --angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }

        @keyframes spin-border {
          to { --angle: 360deg; }
        }

        .contact-btn-wrapper::before {
          content: '';
          position: absolute;
          inset: -1.5px;
          border-radius: 11px;
          padding: 1.5px;
          background: conic-gradient(
            from var(--angle, 0deg),
            transparent 60%,
            var(--accent-cyan) 80%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .contact-btn-wrapper:hover::before {
          opacity: 1;
          animation: spin-border 1.8s linear infinite;
        }

        .contact-btn-wrapper:hover {
          box-shadow: 0 0 10px var(--accent-glow);
        }

        .contact-btn {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 500;
          font-family: var(--font-sans);
          text-decoration: none;
          background: transparent;
          color: var(--accent-cyan);
          border: 1px solid var(--border-accent);
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
          white-space: nowrap;
          box-sizing: border-box;
        }

        .contact-btn:hover {
          border-color: transparent;
          box-shadow: none;
        }

        .contact-btn-filled {
          background: var(--accent-cyan);
          color: #0a0a0a;
          border: 1px solid transparent;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.4);
        }

        .contact-btn-filled:hover {
          border-color: transparent;
          color: #0a0a0a;
          box-shadow: 0 0 16px rgba(0, 255, 255, 0.5);
        }
      `}</style>

      <div style={dividerStyle} />

      <div className="section-container text-center">

        <p className="section-label" style={{ justifyContent: 'center' }}>
          contact
        </p>

        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '16px' }}>
          <MatrixText text="Let's Connect" />
        </h2>

        <p className="text-base mt-4 mb-10" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>
          Open to internships in Data Science, Data Analysis, and ML.
        </p>

        <div style={wrapStyle}>

          <div className="contact-btn-wrapper">
            <a href="https://github.com/harrsh-here" target="_blank" rel="noopener noreferrer" className="contact-btn">
              <GithubIcon />
              GitHub
            </a>
          </div>

          <div className="contact-btn-wrapper">
            <a href="https://linkedin.com/in/harsh-patidar-580726286" target="_blank" rel="noopener noreferrer" className="contact-btn">
              <LinkedinIcon />
              LinkedIn
            </a>
          </div>

          <div className="contact-btn-wrapper">
            <a href="mailto:harrshhere@gmail.com" target="_blank" rel="noopener noreferrer" className="contact-btn">
              <Mail size={16} />
              Email
            </a>
          </div>

          <div className="glow-border">
            <a href="/resume.pdf" download target="_blank" rel="noopener noreferrer" className="glow-inner"
              style={{
                color: 'var(--bg-primary)',
                background: 'var(--accent-cyan)',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid transparent',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.color = 'var(--accent-cyan)';
                e.currentTarget.style.border = '1px solid var(--border)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent-cyan)';
                e.currentTarget.style.color = 'var(--bg-primary)';
                e.currentTarget.style.border = '1px solid transparent';
              }}
            >
              <FileText size={16} />
              Download Resume
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}