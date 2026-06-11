import { useEffect, useRef } from 'react'

export default function SectionDivider({ variant = 'default' }) {
  const lineRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          containerRef.current?.classList.add('divider-visible')
        }
      },
      { threshold: 0.5 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const colors = {
    default: { from: 'var(--accent-cyan)', to: 'var(--accent-blue)' },
    cyan: { from: 'var(--accent-cyan)', to: 'var(--accent-cyan)' },
    violet: { from: 'var(--accent-blue)', to: 'var(--accent-cyan)' },
    mixed: { from: 'var(--accent-cyan)', to: 'var(--accent-blue)' },
  }
  const c = colors[variant] || colors.default

  return (
    <div ref={containerRef} className="divider-container" style={{
      position: 'relative',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      opacity: 0,
      transition: 'opacity 0.8s ease',
    }}>
      {/* Main gradient line */}
      <div ref={lineRef} style={{
        position: 'absolute',
        height: '1px',
        left: '10%',
        right: '10%',
        background: `linear-gradient(90deg, transparent, ${c.from}, ${c.to}, transparent)`,
        opacity: 0.3,
      }} />
    </div>
  )
}
