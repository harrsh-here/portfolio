import { useState, useEffect } from 'react'

const lines = [
  { prompt: true, text: 'whoami' },
  { prompt: false, text: 'harrsh_here' },
  { prompt: true, text: 'skills --list' },
  { prompt: false, text: 'Python · ML · SQL · Pandas · Flask · NumPy' },
  { prompt: true, text: 'status' },
  { prompt: false, text: 'Open to internships · Building cool things' },
  { prompt: true, text: 'echo $MINDSET' },
  { prompt: false, text: '"Trying to do better." 🕷️' },
]

export default function Terminal() {
  const [displayedLines, setDisplayedLines] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplayedLines(lines.map((l) => l.text))
      setTyping(false)
      return
    }

    if (currentLine >= lines.length) {
      setTyping(false)
      return
    }

    const line = lines[currentLine]
    if (currentChar <= line.text.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev]
          updated[currentLine] = line.text.slice(0, currentChar)
          return updated
        })
        setCurrentChar((c) => c + 1)
      }, 40)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCurrentLine((l) => l + 1)
        setCurrentChar(0)
        setDisplayedLines((prev) => [...prev, ''])
      }, 300)
      return () => clearTimeout(timeout)
    }
  }, [currentLine, currentChar])

  return (
    <div
      className="relative rounded-xl overflow-hidden w-full mx-auto"
      style={{
        backgroundColor: '#0d1117',
        border: '1px solid var(--border-accent)',
        fontFamily: 'var(--font-mono)',
        fontSize: '15px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px var(--accent-glow)',
        minHeight: '320px'
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2"
        style={{
          borderBottom: '1px solid var(--border)',
          paddingTop: '16px', /* Adjust to increase/decrease the height and top margin! */
          paddingBottom: '16px', /* Adjust to increase/decrease the height and bottom margin! */
          paddingLeft: '18px', /* Adjust to move the elements further from the left edge! */
        }}
      >
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#febc2e' }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
        <span className="ml-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
          terminal — harrsh_here
        </span>
      </div>

      {/* Terminal body */}
      <div className="py-6 min-h-[280px]"
        style={{
          paddingTop: '11px',
          paddingLeft: '13px', /* Adjust this to increase/decrease the left margin! */
          paddingRight: '40px'
        }}>
        {displayedLines.map((text, i) => (
          <div key={i} className="leading-relaxed mb-1.5">
            {lines[i]?.prompt ? (
              <span>
                <span style={{ color: 'var(--accent-cyan)' }}>{'> '}</span>
                <span style={{ color: 'var(--text-primary)' }}>{text}</span>
                {typing && i === currentLine && (
                  <span className="cursor-blink" style={{ color: 'var(--accent-cyan)' }}>
                    |
                  </span>
                )}
              </span>
            ) : (
              <span style={{ color: '#7ee787', fontWeight: 500 }}>{text}</span>
            )}
          </div>
        ))}
        {!typing && (
          <div>
            <span style={{ color: 'var(--accent-cyan)' }}>{'> '}</span>
            <span className="cursor-blink" style={{ color: 'var(--accent-cyan)' }}>
              |
            </span>
          </div>
        )}
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.015) 1px, rgba(0,245,255,0.015) 1px)',
        }}
      />
    </div>
  )
}
