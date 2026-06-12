import MatrixText from './MatrixText'
import { useEffect, useRef } from 'react'

const entries = [
  { 
    title: 'Arya College of Engineering and IT', 
    tags: ['B.Tech (AI & DS)'], 
    date: '2023 – 2027', 
    location: 'Jaipur', 
    description: 'Bachelor of Technology, Artificial Intelligence and Data Science\nAffiliated to Rajasthan Technical University, Kota.' 
  },
  { 
    title: 'SALP GOVT. Senior Secondary School', 
    tags: ['Class 12th (Science)'], 
    date: 'Jul 2021 – Mar 2023', 
    location: 'Bhawani Mandi', 
    description: 'Board of Secondary Education Rajasthan' 
  },
  { 
    title: 'Adarsh Vidya Mandir', 
    tags: ['Class 10th'], 
    date: 'Jul 2010 – May 2021', 
    location: 'Guradiya Joga', 
    description: 'Board of Secondary Education Rajasthan' 
  },
]

const getTagStyle = (tag) => {
  const t = tag.toLowerCase();
  if (t === 'b.tech (ai & ds)' || t === 'b.tech') return { bg: 'rgba(96, 165, 250, 0.08)', color: '#93c5fd', border: 'rgba(96, 165, 250, 0.15)' };
  if (t === 'class 12th (science)' || t === 'class 10th') return { bg: 'rgba(52, 211, 153, 0.08)', color: '#6ee7b7', border: 'rgba(52, 211, 153, 0.15)' };
  return { bg: 'rgba(255, 255, 255, 0.04)', color: 'var(--text-secondary)', border: 'rgba(255, 255, 255, 0.08)' };
}

export default function EducationTimeline() {
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
    <section id="education" ref={sectionRef} className="section-reveal">
      <div className="section-container">
        <div>
          <p className="section-label">education.log</p>
          <h2 className="section-title"><MatrixText text="Education" /></h2>
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
                  left: '-28px', top: '4px',
                  width: '14px', height: '14px',
                  background: '#222',
                  border: '2px solid #333',
                  boxShadow: 'none',
                  transition: 'all 0.4s ease',
                }} />

              <div className="pr-6 md:pr-0">
                <div className="flex flex-col items-start md:flex-row md:items-center gap-2 md:gap-3 mb-2">
                  <h3 className="text-base md:text-lg font-semibold"
                    style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {entry.title}
                  </h3>
                  {entry.tags && entry.tags.map(tag => {
                    const style = getTagStyle(tag);
                    return (
                      <span key={tag} className="inline-block font-medium"
                        style={{
                          padding: '6px 11px',
                          borderRadius: '60px',
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
                <p className="text-sm mb-4 md:mb-3"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
                  {entry.date}{entry.location ? ` · ${entry.location}` : ''}
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-line"
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
