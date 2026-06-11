import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import MatrixText from './MatrixText'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const location = useLocation()
  const { activeTheme, setActiveTheme, themes } = useTheme()
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [isHoveringBtn, setIsHoveringBtn] = useState(false)
  const [separatorKey, setSeparatorKey] = useState(0)
  const [prevTheme, setPrevTheme] = useState(activeTheme)
  const themeRef = useRef(null)

  // labelPhase: 'name' → showing full theme name; 'morph' → transitioning; 'idle' → THEME + name
  const [labelPhase, setLabelPhase] = useState('name')
  const morphTimerRef = useRef(null)

  const isAmethyst = activeTheme === 'amethyst'

  useEffect(() => { setMenuOpen(false) }, [location])

  // On theme change: restart label animation cycle
  useEffect(() => {
    if (activeTheme !== prevTheme) {
      setSeparatorKey(k => k + 1)
      setPrevTheme(activeTheme)
    }
    // Start: show name → after 1.8s morph → after morph settle to idle
    if (!isAmethyst) {
      setLabelPhase('name')
      clearTimeout(morphTimerRef.current)
      morphTimerRef.current = setTimeout(() => {
        setLabelPhase('morph')
        setTimeout(() => setLabelPhase('idle'), 500)
      }, 1800)
    } else {
      setLabelPhase('name') // AmethystFalls stays in 'name' forever
    }
    return () => clearTimeout(morphTimerRef.current)
  }, [activeTheme])

  // Also run once on mount
  useEffect(() => {
    if (!isAmethyst) {
      setLabelPhase('name')
      morphTimerRef.current = setTimeout(() => {
        setLabelPhase('morph')
        setTimeout(() => setLabelPhase('idle'), 500)
      }, 1800)
    }
    return () => clearTimeout(morphTimerRef.current)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeRef.current && !themeRef.current.contains(e.target)) setIsThemeOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Canvas bg — unique per theme
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const W = canvas.width, H = canvas.height
    const accentColor = themes[activeTheme]?.colors['--accent-cyan'] || '#00f5ff'

    // Theme-specific config
    const cfg = {
      default: { count: 22, speed: 0.32, opacity: 0.28, connect: false, glitter: false },
      ocean: { count: 26, speed: 0.25, opacity: 0.22, connect: false, glitter: false },
      amber: { count: 18, speed: 0.38, opacity: 0.20, connect: false, glitter: false },
      amethyst: { count: 30, speed: 0.16, opacity: 0.45, connect: true, glitter: true },
    }[activeTheme] || { count: 22, speed: 0.3, opacity: 0.25, connect: false, glitter: false }

    const particles = Array.from({ length: cfg.count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.3 + 0.3,
      vx: (Math.random() - 0.5) * cfg.speed,
      vy: (Math.random() - 0.5) * cfg.speed,
      o: Math.random() * cfg.opacity * 0.6 + cfg.opacity * 0.3,
    }))

    // Glitter sparks for amethyst
    const glitters = cfg.glitter
      ? Array.from({ length: 14 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        life: Math.random() * 80,
        maxLife: 40 + Math.random() * 60,
        active: false,
        timer: Math.random() * 120,
      }))
      : []

    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return `${r},${g},${b}`
    }
    const rgb = hexToRgb(accentColor)

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Particles
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb},${p.o})`
        ctx.fill()

        // Constellation lines for amethyst
        if (cfg.connect) {
          particles.forEach(q => {
            const dx = p.x - q.x, dy = p.y - q.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 55 && dist > 0) {
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(q.x, q.y)
              ctx.strokeStyle = `rgba(${rgb},${(1 - dist / 55) * 0.07})`
              ctx.lineWidth = 0.4
              ctx.stroke()
            }
          })
        }

        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      })

      // Glitters (amethyst only) — brief bright twinkles
      if (cfg.glitter) {
        glitters.forEach(g => {
          g.timer--
          if (!g.active && g.timer <= 0) {
            g.active = true
            g.life = 0
            g.x = Math.random() * W
            g.y = Math.random() * H
            g.maxLife = 30 + Math.random() * 50
            g.timer = 80 + Math.random() * 200
          }
          if (g.active) {
            g.life++
            const progress = g.life / g.maxLife
            // Flicker: rise then fall
            const intensity = progress < 0.4
              ? progress / 0.4
              : (1 - progress) / 0.6
            const sz = 0.6 + intensity * 1.4
            // 4-point star
            ctx.save()
            ctx.translate(g.x, g.y)
            ctx.rotate(Math.PI / 4)
            ctx.strokeStyle = `rgba(${rgb},${intensity * 0.8})`
            ctx.lineWidth = 0.6
            for (let i = 0; i < 2; i++) {
              ctx.beginPath()
              ctx.moveTo(0, -sz * 3)
              ctx.lineTo(0, sz * 3)
              ctx.stroke()
              ctx.rotate(Math.PI / 2)
            }
            ctx.restore()
            if (g.life >= g.maxLife) g.active = false
          }
        })
      }

      if (!isAmethyst) {
        const time = Date.now() * 0.0005
        ctx.beginPath()
        for (let x = 0; x <= W; x += 10) {
          const y = H/2 + Math.sin(x * 0.01 + time) * 12 + Math.sin(x * 0.02 - time * 0.8) * 6
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${rgb},0.08)`
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.beginPath()
        for (let x = 0; x <= W; x += 10) {
          const y = H/2 + Math.cos(x * 0.015 - time * 1.2) * 15 + Math.sin(x * 0.008 + time) * 8
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${rgb},0.04)`
        ctx.lineWidth = 2
        ctx.stroke()
      } else {
        // Amethyst spring waves
        const time = Date.now() * 0.0008
        ctx.beginPath()
        for (let x = 0; x <= W; x += 5) {
          const y = H/2 + Math.sin(x * 0.05 + time) * 8 + Math.cos(x * 0.08 - time * 1.5) * 4
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${rgb},0.05)`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      animFrameRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [activeTheme])

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Projects', to: '/projects' },
  ]

  const themeName = themes[activeTheme]?.name || activeTheme

  // What to render in the button label area
  // labelPhase: 'name' = big name only | 'morph' = transitioning | 'idle' = THEME micro + name
  // For amethyst: always 'name' phase
  const showMetaLabel = !isAmethyst && (labelPhase === 'idle' || labelPhase === 'morph')
  const nameVisible = true // name always visible

  return (
    <>
      <style>{`
        .nav-link {
          position: relative; text-decoration: none; padding-bottom: 4px;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0%; height: 2px; background: var(--accent-cyan);
          border-radius: 2px; transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: var(--accent-cyan) !important; }

        .theme-trigger {
          position: relative; padding-bottom: 4px;
          background: none; border: none; cursor: pointer;
        }
        .theme-trigger::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0%; height: 2px; background: var(--accent-cyan);
          border-radius: 2px; transition: width 0.3s ease;
        }
        .theme-trigger:hover::after,
        .theme-trigger.open::after { width: 100%; }

        /* Label stack */
        .theme-btn-label {
          display: flex; flex-direction: column; align-items: flex-start; gap: 0px;
          min-width: 64px;
        }

        /* Micro "THEME" label */
        .theme-meta {
          font-family: var(--font-mono);
          font-size: 0.48rem; letter-spacing: 0.22em;
          text-transform: uppercase; line-height: 1;
          color: var(--accent-cyan);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .theme-meta.entering {
          opacity: 0; transform: translateY(4px);
          animation: metaSlideIn 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes metaSlideIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 0.6; transform: translateY(0); }
        }
        .theme-trigger:hover .theme-meta { opacity: 0.95 !important; }

        /* Theme name */
        .theme-name-text {
          font-family: var(--font-display);
          font-size: 0.85rem; line-height: 1.2; white-space: nowrap;
          transition: letter-spacing 0.4s ease, font-style 0.3s ease;
        }
        /* On mount: name slides in big, then settles */
        .theme-name-enter {
          animation: nameEnter 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes nameEnter {
          from { opacity: 0; transform: translateY(6px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Amethyst shimmer on hover */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .amethyst-shimmer {
          background: linear-gradient(90deg, #a855f7, #e879f9, #f0abfc, #e879f9, #a855f7);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 1.6s linear infinite;
        }
        /* Amethyst idle pulse (no hover) */
        @keyframes amethystTextPulse {
          0%,100% { opacity: 0.88; }
          50%     { opacity: 1; }
        }
        .amethyst-idle-text {
          background: linear-gradient(90deg, #a855f7, #e879f9, #f0abfc, #e879f9, #a855f7);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 6s linear infinite, amethystTextPulse 2.8s ease-in-out infinite;
          font-style: italic;
          letter-spacing: 0.08em;
        }

        /* Dropdown */
        .theme-dropdown {
          position: absolute; right: 0; top: calc(100% + 20px);
          width: 14rem; border-radius: 12px;
          background: var(--bg-surface);
          border: 1px solid var(--border-accent);
          box-shadow: 0 16px 40px rgba(0,0,0,0.7);
          z-index: 9999;
          transform-origin: top right;
          transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.16,1,0.3,1), visibility 0.18s;
        }
        .theme-dropdown.closed {
          opacity: 0; transform: translateY(-6px) scale(0.97);
          visibility: hidden; pointer-events: none;
        }
        .theme-dropdown.open {
          opacity: 1; transform: translateY(0) scale(1);
          visibility: visible; pointer-events: all;
        }
        .theme-item { opacity: 0; transform: translateX(8px); }
        .theme-dropdown.open .theme-item {
          animation: itemIn 0.25s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .theme-dropdown.open .theme-item:nth-child(1) { animation-delay: 30ms; }
        .theme-dropdown.open .theme-item:nth-child(2) { animation-delay: 90ms; }
        .theme-dropdown.open .theme-item:nth-child(3) { animation-delay: 150ms; }
        .theme-dropdown.open .theme-item:nth-child(4) { animation-delay: 210ms; }
        @keyframes itemIn {
          from { opacity: 0; transform: translateX(8px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* Separator sweep */
        @keyframes separatorSweep {
          0%   { opacity: 0.2; transform: scaleX(0); }
          60%  { opacity: 1;   transform: scaleX(1); }
          100% { opacity: 0.8; transform: scaleX(1); }
        }
        .separator-line {
          transform-origin: center;
          animation: separatorSweep 0.7s cubic-bezier(0.16,1,0.3,1) forwards;
        }

        /* Amethyst navbar aura */
        @keyframes amethystAura {
          0%,100% { box-shadow: 0 4px 30px rgba(168,85,247,0.08); }
          50%     { box-shadow: 0 4px 50px rgba(168,85,247,0.22), 0 0 80px rgba(232,121,249,0.07); }
        }
        .nav-amethyst { 
          animation: amethystAura 3s ease-in-out infinite; 
          background-image: linear-gradient(to bottom, rgba(168,85,247,0.035), transparent);
        }

        /* Amethyst separator breathes */
        @keyframes separatorBreathe {
          0%,100% { opacity: 0.5; box-shadow: 0 0 8px var(--accent-cyan); }
          50%     { opacity: 1;   box-shadow: 0 0 18px var(--accent-cyan), 0 0 30px var(--accent-cyan); }
        }
        .separator-amethyst {
          animation: separatorBreathe 3s ease-in-out infinite !important;
        }

        /* Dropdown amethyst item idle glow */
        @keyframes amethystPulse {
          0%,100% { text-shadow: 0 0 8px #a855f744; }
          50%     { text-shadow: 0 0 16px #e879f966, 0 0 28px #a855f733; }
        }
        .amethyst-dropdown-idle {
          animation: amethystPulse 2.8s ease-in-out infinite;
        }
      `}</style>

      <nav
        ref={navRef}
        id="main-nav"
        className={isAmethyst ? 'nav-amethyst' : ''}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          backgroundColor: 'var(--bg-nav)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-accent)',
          boxShadow: '0 4px 30px var(--accent-glow)',
          transition: 'box-shadow 0.6s ease, background-color 0.4s ease',
        }}>

        {/* Particle canvas */}
        <canvas ref={canvasRef} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          opacity: isAmethyst ? 0.6 : 0.22,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }} />

        <div
          className="max-w-[1200px] mx-auto flex items-center justify-between"
          style={{ height: '70px', padding: '0 40px', position: 'relative', zIndex: 1 }}>

          <Link to="/" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              fontFamily: '"Chakra Petch", sans-serif', fontWeight: 500, fontSize: '1.55rem', textTransform: 'lowercase',
              color: 'var(--text-primary)', letterSpacing: '0.04em', textDecoration: 'none',
              WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale'
            }}>
            <MatrixText text="harrsh_here" disableHover={true} />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="nav-link text-sm font-medium"
                style={{
                  fontFamily: '"Chakra Petch", sans-serif',
                  color: location.pathname === link.to
                    ? 'var(--accent-cyan)'
                    : 'var(--text-secondary)',
                }}>
                {link.label}
              </Link>
            ))}

            {/* Theme Switcher */}
            <div className="relative ml-4" ref={themeRef} style={{ zIndex: 9999 }}>
              <button
                className={`theme-trigger flex items-center gap-2 text-sm font-medium${isThemeOpen ? ' open' : ''}`}
                onClick={() => setIsThemeOpen(v => !v)}
                onMouseEnter={() => setIsHoveringBtn(true)}
                onMouseLeave={() => setIsHoveringBtn(false)}
                style={{
                  color: isThemeOpen ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontFamily: '"Chakra Petch", sans-serif',
                  padding: '0 0 4px 0',
                }}>

                {/* Accent dot */}
                <div style={{
                  width: 10, height: 10, minWidth: 10, flexShrink: 0, borderRadius: '50%',
                  backgroundColor: 'var(--accent-cyan)',
                  boxShadow: '0 0 10px var(--accent-cyan)',
                  transition: 'background-color 0.4s ease, box-shadow 0.4s ease',
                }} />

                {/* Label stack */}
                <span className="theme-btn-label">
                  {/* "THEME" micro label / main title — non-amethyst */}
                  {!isAmethyst && (
                    <div style={{
                      display: 'grid',
                      gridTemplateRows: showMetaLabel ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}>
                      <div style={{ overflow: 'hidden' }}>
                        <span
                          className={`theme-meta${labelPhase === 'morph' ? ' entering' : ''}`}
                          style={{
                            display: 'block',
                            opacity: showMetaLabel ? ((labelPhase === 'morph' || isHoveringBtn) ? 0.95 : 1) : 0,
                            transform: showMetaLabel ? 'translateY(0)' : 'translateY(4px)',
                            fontSize: (labelPhase === 'morph' || isHoveringBtn) ? '0.48rem' : '0.95rem',
                            letterSpacing: (labelPhase === 'morph' || isHoveringBtn) ? '0.22em' : '0.04em',
                            background: `linear-gradient(90deg, var(--accent-cyan), #fff)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textTransform: (labelPhase === 'morph' || isHoveringBtn) ? 'uppercase' : 'capitalize',
                            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                            paddingTop: (labelPhase === 'morph' || isHoveringBtn) ? '0px' : '2px',
                          }}>
                          Theme
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Theme name wrapper for sliding animation */}
                  <div style={{
                    display: 'grid',
                    gridTemplateRows: (isAmethyst || labelPhase === 'name' || labelPhase === 'morph' || isHoveringBtn) ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <span
                        className={`theme-name-text ${isAmethyst
                          ? (isHoveringBtn ? 'amethyst-shimmer' : 'amethyst-idle-text')
                          : ''
                          }`}
                        style={{
                          display: 'block',
                          paddingTop: '2px',
                          ...(!isAmethyst ? {
                            background: `linear-gradient(90deg, var(--accent-cyan), #fff)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: labelPhase === 'name' ? '0.04em' : '0.01em',
                            transition: 'letter-spacing 0.5s ease, font-size 0.5s ease, opacity 0.3s ease, transform 0.4s ease',
                            fontSize: labelPhase === 'name' ? '0.92rem' : '0.85rem',
                            opacity: (labelPhase === 'name' || labelPhase === 'morph' || isHoveringBtn) ? 1 : 0,
                            transform: (labelPhase === 'name' || labelPhase === 'morph' || isHoveringBtn) ? 'translateY(0)' : 'translateY(-10px)',
                          } : {})
                        }}>
                        {themeName}
                      </span>
                    </div>
                  </div>
                </span>

                <ChevronDown size={14} style={{
                  transform: isThemeOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.25s ease', flexShrink: 0,
                }} />
              </button>

              {/* Dropdown */}
              <div className={`theme-dropdown ${isThemeOpen ? 'open' : 'closed'}`}>
                <div style={{ padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {Object.keys(themes).map((key) => {
                    const isActive = activeTheme === key
                    const isAmethystKey = key === 'amethyst'
                    return (
                      <button key={key}
                        onClick={() => { setActiveTheme(key); setIsThemeOpen(false) }}
                        className="theme-item w-full text-left text-sm flex items-center gap-3"
                        style={{
                          padding: '10px 12px', borderRadius: '8px',
                          backgroundColor: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                          border: 'none', cursor: 'pointer',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = isActive
                            ? 'rgba(255,255,255,0.06)'
                            : 'transparent'
                        }}>

                        <div style={{
                          width: 8, height: 8, minWidth: 8, flexShrink: 0, borderRadius: '50%',
                          backgroundColor: themes[key].colors['--accent-cyan'],
                          boxShadow: isActive ? `0 0 6px ${themes[key].colors['--accent-cyan']}` : 'none',
                          transition: 'all 0.2s ease',
                        }} />

                        <span
                          className={isAmethystKey && !isActive ? 'amethyst-dropdown-idle' : ''}
                          style={{
                            fontWeight: isActive ? 600 : 400,
                            fontSize: '0.85rem',
                            letterSpacing: isAmethystKey ? '0.08em' : '0.01em',
                            fontFamily: 'var(--font-display)',
                            fontStyle: isAmethystKey ? 'italic' : 'normal',
                            ...(isActive && isAmethystKey ? {
                              background: 'linear-gradient(90deg, #a855f7, #e879f9, #f0abfc)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            } : isActive ? {
                              background: `linear-gradient(90deg, ${themes[key].colors['--accent-cyan']}, #fff)`,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            } : isAmethystKey ? {
                              color: '#a855f7',
                            } : {
                              color: 'var(--text-secondary)',
                            }),
                          }}>
                          {themes[key].name}
                        </span>

                        {isActive && (
                          <span style={{
                            marginLeft: 'auto', width: 6, height: 6,
                            borderRadius: '50%', flexShrink: 0,
                            backgroundColor: 'var(--accent-cyan)',
                            boxShadow: '0 0 6px var(--accent-cyan)',
                          }} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2"
            onClick={() => setMenuOpen(v => !v)}
            style={{ color: 'var(--text-primary)' }}
            aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <div className="md:hidden fixed right-0 w-64 transition-transform duration-200 z-50"
          style={{
            top: '70px', height: 'calc(100vh - 70px)',
            backgroundColor: 'var(--bg-nav)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            borderLeft: '1px solid var(--border-accent)',
            transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          }}>
          <div className="flex flex-col gap-6 p-8">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className="text-lg font-medium transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-sans)',
                  color: location.pathname === link.to
                    ? 'var(--accent-cyan)'
                    : 'var(--text-secondary)',
                }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-40"
            style={{ top: '70px', backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={() => setMenuOpen(false)} />
        )}

        {/* Separator */}
        <div
          key={separatorKey}
          className={`separator-line${isAmethyst ? ' separator-amethyst' : ''}`}
          style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)',
            opacity: 0.8,
            boxShadow: '0 0 10px var(--accent-cyan)',
          }}
        />
      </nav>
    </>
  )
}