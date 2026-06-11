import MatrixText from './MatrixText'
import { useEffect, useRef } from 'react'

const entries = [
  { title: 'Cloud Lead — GDG ACEIT', tags: ['Part-time', 'On-site'], date: 'Aug 2025 – Present', location: 'Jaipur, Rajasthan', description: 'Supporting Google Cloud Study Jams, event coordination, and peer learning at Arya College\'s Google Developer Group chapter.' },
  { title: 'Google Student Ambassador — Google', tags: ['Part-time', 'Remote'], date: 'Sep 2025 – Feb 2026', location: '', description: 'Primary bridge between Google and the university student community. Promoted Gemini and Google initiatives on campus.' },
  { title: 'Amigo / Visual Design — InAmigos Foundation', tags: ['Internship', 'Remote'], date: 'Jun 2025 – Jul 2025', location: 'India', description: 'Designed posters, edited reels, and built campaign visuals for social impact projects.' },
  { title: 'Salesforce Programming Architect — TechForce Academy', tags: ['Certification', 'On-site'], date: 'Aug 2025', location: 'Australia', description: 'Built AI-powered agents on Salesforce platform at AI Builders Day.' },
  { title: 'Video Making/Editing — Softbay', tags: ['Internship', 'Remote'], date: 'May 2023 – Feb 2024', location: '', description: 'Edited YouTube tutorial videos (5–10 min) for 10 months.' },
  { title: 'Content Creator — YouTube & Instagram', tags: ['Freelance', 'Remote'], date: 'Aug 2020 – Present', location: '', description: 'Running YouTube and Instagram channels for 5+ years.' },
]

const getTagStyle = (tag) => {
  const t = tag.toLowerCase();
  if (t === 'internship') return { bg: 'rgba(167, 139, 250, 0.08)', color: '#c4b5fd', border: 'rgba(167, 139, 250, 0.15)' };
  if (t === 'part-time') return { bg: 'rgba(52, 211, 153, 0.08)', color: '#6ee7b7', border: 'rgba(52, 211, 153, 0.15)' };
  if (t === 'freelance') return { bg: 'rgba(251, 191, 36, 0.08)', color: '#fcd34d', border: 'rgba(251, 191, 36, 0.15)' };
  if (t === 'certification') return { bg: 'rgba(96, 165, 250, 0.08)', color: '#93c5fd', border: 'rgba(96, 165, 250, 0.15)' };
  if (t === 'remote' || t === 'hybrid') return { bg: 'color-mix(in srgb, var(--accent-cyan) 8%, transparent)', color: 'var(--accent-cyan)', border: 'color-mix(in srgb, var(--accent-cyan) 20%, transparent)' };
  if (t === 'on-site') return { bg: 'rgba(244, 63, 94, 0.08)', color: '#fb7185', border: 'rgba(244, 63, 94, 0.15)' };
  return { bg: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-secondary)', border: 'rgba(255, 255, 255, 0.08)' };
}

export default function ExperienceTimeline() {
  const sectionRef = useRef(null)
  const entryRefs = useRef([])

  useEffect(() => {
    const sectionObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add('revealed')
          sectionObs.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) sectionObs.observe(sectionRef.current)
    return () => sectionObs.disconnect()
  }, [])

  // Bidirectional: fade in on scroll down, fade out on scroll up
  useEffect(() => {
    const observers = entryRefs.current.map((el, i) => {
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => {
          const dot = el.querySelector('.timeline-dot')
          if (entry.isIntersecting) {
            // Entering view — animate in
            setTimeout(() => {
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
              if (dot) {
                dot.style.background = 'var(--accent-cyan)'
                dot.style.border = '2px solid var(--accent-cyan)'
                dot.style.boxShadow = '0 0 12px var(--accent-cyan), 0 0 24px var(--accent-glow)'
                dot.style.animation = 'dot-pulse 2s ease infinite'
              }
            }, i * 120)
          } else {
            // Leaving view — fade out
            el.style.opacity = '0'
            el.style.transform = 'translateY(24px)'
            if (dot) {
              dot.style.background = '#222'
              dot.style.border = '2px solid #333'
              dot.style.boxShadow = 'none'
              dot.style.animation = 'none'
            }
          }
        },
        { threshold: 0.3 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((o) => o && o.disconnect())
  }, [])

  return (
    <section id="experience" ref={sectionRef} className="section-reveal">
      <div className="section-container">
        <div>
          <p className="section-label">experience.log</p>
          <h2 className="section-title"><MatrixText text="Experience" /></h2>
        </div>

        <div className="relative" style={{ paddingLeft: '32px' }}>
          <div className="absolute top-0 bottom-0 w-px"
            style={{ backgroundColor: 'var(--border-accent)', left: '11px' }} />

          {entries.map((entry, i) => (
            <div key={i}
              ref={(el) => (entryRefs.current[i] = el)}
              className="relative"
              style={{
                marginBottom: i < entries.length - 1 ? '44px' : 0,
                opacity: 0, transform: 'translateY(24px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}>
              <div className="timeline-dot absolute rounded-full"
                style={{
                  left: '-27px', top: '4px',
                  width: '14px', height: '14px',
                  background: '#222',
                  border: '2px solid #333',
                  boxShadow: 'none',
                  transition: 'all 0.4s ease',
                }} />

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-base md:text-lg font-semibold"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {entry.title}
                  </h3>
                  {entry.tags && entry.tags.map(tag => {
                    const style = getTagStyle(tag);
                    return (
                      <span key={tag} className="inline-block font-medium"
                        style={{
                          padding: '6px 11px', /* Adjust this for height and width! */
                          borderRadius: '60px', /* Adjust this for corner rounding! */
                          fontSize: '12px',
                          backgroundColor: style.bg,
                          border: `1.5px solid ${style.border}`,
                          color: style.color,
                          fontFamily: 'var(--font-sans)',
                          letterSpacing: '0.02em'
                        }}>
                        {tag}
                      </span>
                    )
                  })}
                </div>
                <p className="text-sm mb-3"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
                  {entry.date}{entry.location ? ` · ${entry.location}` : ''}
                </p>
                <p className="text-sm leading-relaxed"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {entry.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
