import { useState, useEffect } from 'react'

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'featured-projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

export default function SectionNavigator() {
  const [activeId, setActiveId] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const wh = window.innerHeight

      let current = 'hero'
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If the top of the section is above the middle of the screen, it's active
          if (rect.top <= wh * 0.5) {
            current = section.id
          }
        }
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex fixed right-2 md:right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-40">
      {sections.map((s) => (
        <div key={s.id} className="relative group flex items-center justify-end">
          <span className="absolute right-8 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
            style={{ fontFamily: 'var(--font-sans)', color: activeId === s.id ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
            {s.label}
          </span>
          <button
            onClick={() => scrollTo(s.id)}
            aria-label={`Scroll to ${s.label}`}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor: activeId === s.id ? 'var(--accent-cyan)' : 'transparent',
              border: `1.5px solid ${activeId === s.id ? 'var(--accent-cyan)' : 'var(--text-muted)'}`,
              boxShadow: activeId === s.id ? '0 0 10px var(--accent-cyan)' : 'none',
              transform: activeId === s.id ? 'scale(1.2)' : 'scale(1)',
              cursor: 'pointer'
            }}
          />
        </div>
      ))}
    </div>
  )
}
