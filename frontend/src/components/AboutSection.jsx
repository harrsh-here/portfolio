import MatrixText from './MatrixText'
import { useRef, useEffect, useState } from 'react'

const stats = [
  { value: '8.58', label: 'GPA out of 10', isNumber: true, suffix: '' },
  { value: '457', label: 'LinkedIn connections', isNumber: true, suffix: '+' },
  { value: 'Top 10', label: 'D3CODE Hackathon (30K teams)', isNumber: false },
  { value: '5★ Gold', label: 'HackerRank Python', isNumber: false },
]

function AnimatedCounter({ value, suffix = '', isNumber, visible }) {
  const [display, setDisplay] = useState(isNumber ? '0' : value)

  useEffect(() => {
    if (!visible || !isNumber) return
    const target = parseFloat(value)
    const isFloat = value.includes('.')
    const duration = 1200
    const startTime = performance.now()

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = target * eased

      setDisplay(isFloat ? current.toFixed(2) : Math.floor(current).toString())

      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [visible, value, isNumber])

  return <>{isNumber ? display + suffix : value}</>
}

export default function AboutSection() {
  const sectionRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

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
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="section-reveal">
      <div className="section-container">
        <div>
          <p className="section-label">about_me.py</p>
          <h2 className="section-title"><MatrixText text="About Me" /></h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          <div className="flex flex-col gap-6">
            <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7 }}>
              I'm Harsh, a final-year AI & Data Science student at Arya College of
              Engineering & I.T., Jaipur, affiliated to Rajasthan Technical University.
              My current GPA is 8.58/10.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7 }}>
              I serve as Cloud Lead at Google Developer Groups on Campus (GDG ACEIT),
              supporting Google Cloud Study Jams and campus events. I also completed
              a Google Student Ambassador role, bridging Google initiatives with my
              campus community.
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7 }}>
              Beyond technical work, I create content on YouTube (5+ years) and
              Instagram, and I've done visual design and video editing internships
              at InAmigos Foundation and Softbay.
            </p>
            <div className="mt-4">
              <div className="glow-border">
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="glow-inner"
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
                  }}>
                  View Full Resume ↗
                </a>
              </div>
            </div>
          </div>

          {/* Stat cards with animated counters */}
          <div ref={statsRef} className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            {stats.map((stat, i) => (
              <div key={stat.label} className="card-accent" style={{
                minHeight: '110px',
                opacity: statsVisible ? 1 : 0,
                transform: statsVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                transition: `opacity 0.6s ease ${i * 120}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 120}ms`,
              }}>
                <div className="stat-value">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix || ''}
                    isNumber={stat.isNumber}
                    visible={statsVisible}
                  />
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

