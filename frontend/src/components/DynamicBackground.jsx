import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

/*
  DynamicBackground v3 — Moves with scroll, packed with visual layers:
    Layer 1: Aurora blobs (large gradient orbs that drift)
    Layer 2: Dot field with wave distortion
    Layer 3: Floating particles with constellation lines
    Layer 4: Geometric shapes (hexagons scattered)
    Layer 5: Energy grid (wavy lines)
    Layer 6: Flowing sine waves
    Layer 7: Floating code glyphs
    Layer 8: Orbiting ring accents
  
  All layers offset by scrollY so the background scrolls WITH the page.
*/

export default function DynamicBackground() {
  const location = useLocation()
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const scrollYRef = useRef(0)
  const scrollRatioRef = useRef(0)
  const particlesRef = useRef([])
  const blobsRef = useRef([])
  const hexesRef = useRef([])
  const glyphsRef = useRef([])
  const ringsRef = useRef([])
  const { activeTheme } = useTheme()
  const themeHues = {
    default: { primary: 185, secondary: 263, extra: [185, 220, 263, 240, 200] },
    amethyst: { primary: 280, secondary: 320, extra: [280, 290, 310, 320, 300] },
    ocean: { primary: 195, secondary: 205, extra: [195, 200, 205, 210, 215] },
    amber: { primary: 41, secondary: 25, extra: [41, 25, 10, 55, 30] }
  }
  const currentHues = themeHues[activeTheme] || themeHues.default
  const huesRef = useRef(currentHues)
  const isHomeRef = useRef(location.pathname === '/')
  const isProjectsRef = useRef(location.pathname === '/projects')
  const isProjectDetailRef = useRef(location.pathname.startsWith('/projects/'))

  useEffect(() => {
    isHomeRef.current = location.pathname === '/'
    isProjectsRef.current = location.pathname === '/projects'
    isProjectDetailRef.current = location.pathname.startsWith('/projects/') && location.pathname !== '/projects'
  }, [location.pathname])

  useEffect(() => {
    huesRef.current = currentHues
  }, [currentHues])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const handleScroll = () => {
      scrollYRef.current = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      scrollRatioRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // --- MOUSE TRACKING ---
    let mouseX = w / 2
    let mouseY = h / 2
    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // --- PARTICLES (with constellation connections) ---
    const particles = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * 3000,
        y: Math.random() * 8000,
        size: Math.random() * 2.2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        hueIdx: Math.floor(Math.random() * 5),
      })
    }
    particlesRef.current = particles

    // --- AURORA BLOBS (scattered along page height) ---
    const blobs = [
      { x: 0.12, y: 200, r: 380, sat: 100, l: 50, a: 0.07, dx: 0.0003, dy: 0.0002, ph: 0, hueIdx: 0 },
      { x: 0.85, y: 600, r: 300, sat: 80, l: 55, a: 0.06, dx: -0.0002, dy: 0.0003, ph: 1.5, hueIdx: 2 },
      { x: 0.5, y: 1200, r: 340, sat: 90, l: 48, a: 0.055, dx: 0.0001, dy: -0.0002, ph: 3, hueIdx: 1 },
      { x: 0.2, y: 1800, r: 280, sat: 70, l: 50, a: 0.05, dx: 0.0002, dy: 0.0001, ph: 4.5, hueIdx: 3 },
      { x: 0.75, y: 2400, r: 320, sat: 95, l: 45, a: 0.06, dx: -0.0003, dy: 0.0002, ph: 2, hueIdx: 0 },
      { x: 0.4, y: 3200, r: 350, sat: 85, l: 52, a: 0.055, dx: 0.0002, dy: -0.0001, ph: 5, hueIdx: 4 },
      { x: 0.1, y: 4000, r: 300, sat: 90, l: 50, a: 0.05, dx: -0.0001, dy: 0.0003, ph: 1, hueIdx: 1 },
      { x: 0.9, y: 4800, r: 280, sat: 75, l: 55, a: 0.06, dx: 0.0003, dy: -0.0002, ph: 3.5, hueIdx: 2 },
    ]
    blobsRef.current = blobs

    // --- HEXAGONS (scattered geometric accents) ---
    const hexes = []
    for (let i = 0; i < 12; i++) {
      hexes.push({
        x: Math.random() * 2000,
        y: 300 + Math.random() * 5000,
        size: 20 + Math.random() * 40,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.001,
        alpha: 0.03 + Math.random() * 0.04,
        hueIdx: Math.floor(Math.random() * 5),
      })
    }
    hexesRef.current = hexes

    // --- FLOATING CODE GLYPHS ---
    const glyphChars = ['{ }', '< />', '( )', '[ ]', '&&', '||', '=>', '/**/', '#!/', '0x', '::']
    const glyphs = []
    for (let i = 0; i < 15; i++) {
      glyphs.push({
        char: glyphChars[Math.floor(Math.random() * glyphChars.length)],
        x: Math.random() * 2000,
        y: 200 + Math.random() * 5500,
        alpha: 0.04 + Math.random() * 0.04,
        size: 10 + Math.random() * 6,
        drift: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2,
      })
    }
    glyphsRef.current = glyphs

    // --- ORBITING RINGS ---
    const rings = []
    for (let i = 0; i < 5; i++) {
      rings.push({
        cx: Math.random() * 2000,
        cy: 500 + Math.random() * 4500,
        radius: 60 + Math.random() * 100,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.0004 + Math.random() * 0.0006,
        tilt: 0.3 + Math.random() * 0.4,
        alpha: 0.04 + Math.random() * 0.03,
        hueIdx: i,
      })
    }
    ringsRef.current = rings

    // --- DRAW HELPERS ---

    const drawHexagon = (cx, cy, size, rotation) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotation
        const px = cx + size * Math.cos(angle)
        const py = cy + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    // --- MAIN DRAW FUNCTIONS ---

    const drawBlobs = (time, scrollY) => {
      for (const b of blobsRef.current) {
        const bx = (b.x + Math.sin(time * b.dx + b.ph) * 0.08) * w
        const by = b.y - scrollY + Math.cos(time * b.dy + b.ph) * 30
        if (by < -b.r || by > h + b.r) continue // skip offscreen
        const alpha = b.a * (0.8 + Math.sin(time * 0.0008 + b.ph) * 0.3)
        const currentHue = huesRef.current.extra[b.hueIdx % 5]
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, b.r)
        grad.addColorStop(0, `hsla(${currentHue}, ${b.sat}%, ${b.l}%, ${alpha})`)
        grad.addColorStop(0.4, `hsla(${currentHue}, ${b.sat}%, ${b.l}%, ${alpha * 0.5})`)
        grad.addColorStop(1, `hsla(${currentHue}, ${b.sat}%, ${b.l}%, 0)`)
        ctx.fillStyle = grad
        ctx.fillRect(bx - b.r, by - b.r, b.r * 2, b.r * 2)
      }
    }

    const drawDotField = (time, scrollY, scrollRatio) => {
      if (isProjectDetailRef.current) return // Remove dots from individual project pages

      // Significantly reduced base dot opacity
      const dotAlpha = Math.max(0, 0.12 - scrollRatio * 0.3)
      if (dotAlpha < 0.005) return
      const spacing = 32
      const offsetY = scrollY * 0.3 // parallax
      const currentHue = huesRef.current.primary
      ctx.fillStyle = `hsla(${currentHue}, 100%, 50%, ${dotAlpha})`
      for (let x = spacing / 2; x < w; x += spacing) {
        for (let y = -spacing; y < h + spacing; y += spacing) {
          const worldY = y + (offsetY % spacing)
          
          // Cursor distortion effect (amplified)
          const distToMouse = Math.hypot(x - mouseX, worldY - mouseY)
          const repelDist = 250
          let repelX = 0
          let repelY = 0
          if (distToMouse < repelDist) {
            const force = Math.pow((repelDist - distToMouse) / repelDist, 2)
            repelX = ((x - mouseX) / distToMouse) * force * 35
            repelY = ((worldY - mouseY) / distToMouse) * force * 35
          }

          const dx = Math.sin(worldY * 0.012 + time * 0.0005) * 3 + repelX
          const dy = Math.cos(x * 0.012 + time * 0.0004) * 3 + repelY
          ctx.beginPath()
          ctx.arc(x + dx, worldY + dy, 1.1, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const drawParticlesAndConstellations = (time, scrollY) => {
      const viewParticles = []
      for (const p of particlesRef.current) {
        p.x += p.speedX
        p.y += p.speedY
        p.pulse += p.pulseSpeed
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y += 8000
        if (p.y > 8000) p.y -= 8000

        const screenY = p.y - scrollY * 0.6 // parallax
        const wrappedY = ((screenY % h) + h) % h

        // Cursor repulsion
        const distToMouse = Math.hypot(p.x - mouseX, wrappedY - mouseY)
        const repelDist = 200
        let drawX = p.x
        let drawY = wrappedY
        if (distToMouse < repelDist) {
          const force = (repelDist - distToMouse) / repelDist
          drawX += ((p.x - mouseX) / distToMouse) * force * 20
          drawY += ((wrappedY - mouseY) / distToMouse) * force * 20
        }

        const alpha = p.alpha * (0.5 + Math.sin(p.pulse) * 0.5)
        const size = p.size * (0.8 + Math.sin(p.pulse * 0.7) * 0.3)
        const currentHue = huesRef.current.extra[p.hueIdx % 5]

        ctx.beginPath()
        ctx.arc(drawX, drawY, size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${currentHue}, 100%, 70%, ${alpha})`
        ctx.fill()

        if (p.size > 1.3) {
          ctx.beginPath()
          ctx.arc(drawX, drawY, size * 4, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${currentHue}, 100%, 60%, ${alpha * 0.08})`
          ctx.fill()
        }

        viewParticles.push({ x: drawX, y: drawY, alpha })
      }

      // Constellation lines between nearby particles
      ctx.lineWidth = 0.4
      for (let i = 0; i < viewParticles.length; i++) {
        for (let j = i + 1; j < viewParticles.length; j++) {
          const dx = viewParticles[i].x - viewParticles[j].x
          const dy = viewParticles[i].y - viewParticles[j].y
          const dist = dx * dx + dy * dy
          if (dist < 15000) { // ~122px
            const lineAlpha = (1 - dist / 15000) * 0.08
            ctx.strokeStyle = `hsla(${huesRef.current.primary}, 100%, 50%, ${lineAlpha})`
            ctx.beginPath()
            ctx.moveTo(viewParticles[i].x, viewParticles[i].y)
            ctx.lineTo(viewParticles[j].x, viewParticles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const drawHexagons = (time, scrollY) => {
      for (const hex of hexesRef.current) {
        const sy = hex.y - scrollY * 0.5
        const wrapped = ((sy % (h + 200)) + (h + 200)) % (h + 200) - 100
        hex.rotation += hex.rotSpeed
        const currentHue = huesRef.current.extra[hex.hueIdx % 5]
        ctx.strokeStyle = `hsla(${currentHue}, 80%, 60%, ${hex.alpha})`
        ctx.lineWidth = 0.8
        drawHexagon(hex.x > w ? hex.x % w : hex.x, wrapped, hex.size, hex.rotation)
        ctx.stroke()
      }
    }

    const drawEnergyGrid = (time, scrollY, scrollRatio) => {
      let gridAlpha = 0
      let gridSat = 100
      
      if (isHomeRef.current) {
        gridAlpha = Math.max(0, (scrollRatio - 0.25) * 0.18)
        // Boost by ~3% in the Skills section range
        if (scrollRatio > 0.15 && scrollRatio < 0.55) {
          gridAlpha += 0.03
        }
      } else if (isProjectsRef.current || isProjectDetailRef.current) {
        // Remove the wavy energy grid completely from project pages
        gridAlpha = 0
      }

      if (gridAlpha < 0.005) return
      const spacing = 55
      const waveAmp = 10 * (isHomeRef.current ? scrollRatio : 0.5)
      const offsetY = scrollY * 0.2

      ctx.strokeStyle = `hsla(${huesRef.current.primary}, ${gridSat}%, 50%, ${gridAlpha})`
      ctx.lineWidth = 0.5
      for (let y = -spacing; y < h + spacing; y += spacing) {
        const worldY = y + (offsetY % spacing)
        ctx.beginPath()
        for (let x = 0; x < w; x += 5) {
          const wave = Math.sin(x * 0.018 + time * 0.001 + worldY * 0.008) * waveAmp
          if (x === 0) ctx.moveTo(x, worldY + wave)
          else ctx.lineTo(x, worldY + wave)
        }
        ctx.stroke()
      }

      ctx.strokeStyle = `hsla(${huesRef.current.secondary}, ${gridSat}%, 50%, ${gridAlpha * 0.6})`
      for (let x = 0; x < w; x += spacing) {
        ctx.beginPath()
        for (let y = 0; y < h; y += 5) {
          const wave = Math.sin(y * 0.018 + time * 0.0008 + x * 0.008) * waveAmp
          if (y === 0) ctx.moveTo(x + wave, y)
          else ctx.lineTo(x + wave, y)
        }
        ctx.stroke()
      }
    }

    const drawWaves = (time, scrollY, scrollRatio) => {
      const waveAlpha = Math.max(0, (scrollRatio - 0.45) * 0.25)
      if (waveAlpha < 0.005) return

      for (let i = 0; i < 4; i++) {
        const yBase = h * (0.2 + i * 0.2) + (scrollY * 0.05 * (i + 1)) % h
        const amplitude = 35 + i * 15
        const freq = 0.003 - i * 0.0004
        const speed = 0.0005 + i * 0.00015

        ctx.beginPath()
        ctx.moveTo(0, yBase)
        for (let x = 0; x <= w; x += 3) {
          const y = yBase +
            Math.sin(x * freq + time * speed) * amplitude +
            Math.sin(x * freq * 2.3 + time * speed * 1.4) * (amplitude * 0.25)
          ctx.lineTo(x, y)
        }

        const hues = [185, 220, 250, 275]
        ctx.strokeStyle = `hsla(${hues[i]}, 80%, 60%, ${waveAlpha * (0.5 - i * 0.1)})`
        ctx.lineWidth = 1.5 - i * 0.25
        ctx.stroke()
      }
    }

    const drawGlyphs = (time, scrollY) => {
      ctx.font = '400 12px "JetBrains Mono", monospace'
      for (const g of glyphsRef.current) {
        // Floating drift
        g.y += g.drift * 1.5
        g.x += Math.sin(time * 0.0005 + g.phase) * 0.15

        const sy = g.y - scrollY * 0.4
        const wrapped = ((sy % (h + 200)) + (h + 200)) % (h + 200) - 100
        
        let drawX = g.x > w ? g.x % w : g.x
        if (drawX < -50) drawX = w + 50
        let drawY = wrapped

        // Mouse repulsion
        const distToMouse = Math.hypot(drawX - mouseX, drawY - mouseY)
        if (distToMouse < 200) {
          const force = Math.pow((200 - distToMouse) / 200, 1.5)
          drawX += ((drawX - mouseX) / distToMouse) * force * 40
          drawY += ((drawY - mouseY) / distToMouse) * force * 40
        }

        const breathe = 0.7 + Math.sin(time * 0.001 + g.phase) * 0.3
        ctx.fillStyle = `hsla(${huesRef.current.primary}, 100%, 70%, ${g.alpha * breathe * 3})` // Increased opacity x3
        ctx.font = `400 ${g.size}px "JetBrains Mono", monospace`
        ctx.fillText(g.char, drawX, drawY)
      }
    }

    const drawRings = (time, scrollY) => {
      for (const ring of ringsRef.current) {
        const sy = ring.cy - scrollY * 0.35
        const wrapped = ((sy % (h + 400)) + (h + 400)) % (h + 400) - 200
        ring.rotation += ring.speed
        
        ctx.save()
        ctx.translate(ring.cx > w ? ring.cx % w : ring.cx, wrapped)
        ctx.rotate(ring.rotation)
        ctx.scale(1, ring.tilt)
        
        const currentHue = huesRef.current.extra[ring.hueIdx % 5]
        
        ctx.beginPath()
        ctx.arc(0, 0, ring.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${currentHue}, 80%, 60%, ${ring.alpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Dot on the ring
        const dotAngle = time * ring.speed * 3
        const dotX = ring.radius * Math.cos(dotAngle)
        const dotY = ring.radius * Math.sin(dotAngle)
        ctx.beginPath()
        ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${currentHue}, 100%, 70%, ${ring.alpha * 3})`
        ctx.fill()

        ctx.restore()
      }
    }

    // --- SHOOTING STARS ---
    const shootingStarsRef = { current: [] }
    const spawnStar = () => ({
      x: Math.random() * w * 1.2,
      y: -20,
      speed: 4 + Math.random() * 6,
      length: 60 + Math.random() * 80,
      angle: Math.PI * 0.2 + Math.random() * 0.3,
      alpha: 0.6 + Math.random() * 0.4,
      life: 0,
      maxLife: 60 + Math.random() * 40,
      hueIdx: Math.floor(Math.random() * 2),
    })
    // Spawn a new star every ~3 seconds
    let starTimer = 0

    // --- PULSE RINGS ---
    const pulseRingsRef = { current: [] }
    const spawnPulseRing = (scrollY) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      worldY: scrollY + Math.random() * h,
      radius: 0,
      maxRadius: 80 + Math.random() * 120,
      alpha: 0.15 + Math.random() * 0.1,
      speed: 0.5 + Math.random() * 0.5,
      hueIdx: Math.floor(Math.random() * 4),
    })
    let ringTimer = 0

    const drawShootingStars = (time) => {
      starTimer++
      if (starTimer > 180 && Math.random() < 0.03) {
        shootingStarsRef.current.push(spawnStar())
        starTimer = 0
      }

      shootingStarsRef.current = shootingStarsRef.current.filter(s => {
        s.life++
        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        const progress = s.life / s.maxLife
        const fadeAlpha = s.alpha * (1 - progress)

        if (fadeAlpha < 0.01) return false

        const tailX = s.x - Math.cos(s.angle) * s.length * (1 - progress * 0.5)
        const tailY = s.y - Math.sin(s.angle) * s.length * (1 - progress * 0.5)

        const currentHue = huesRef.current.extra[s.hueIdx % 5]

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y)
        grad.addColorStop(0, `hsla(${currentHue}, 100%, 70%, 0)`)
        grad.addColorStop(0.7, `hsla(${currentHue}, 100%, 80%, ${fadeAlpha * 0.5})`)
        grad.addColorStop(1, `hsla(${currentHue}, 100%, 90%, ${fadeAlpha})`)

        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(s.x, s.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Glow head
        ctx.beginPath()
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${currentHue}, 100%, 90%, ${fadeAlpha})`
        ctx.fill()

        return true
      })
    }

    const drawPulseRings = (time, scrollY) => {
      ringTimer++
      if (ringTimer > 120 && Math.random() < 0.04) {
        pulseRingsRef.current.push(spawnPulseRing(scrollY))
        ringTimer = 0
      }

      pulseRingsRef.current = pulseRingsRef.current.filter(r => {
        r.radius += r.speed
        const progress = r.radius / r.maxRadius
        const fadeAlpha = r.alpha * (1 - progress)
        const screenY = r.worldY - scrollY

        if (fadeAlpha < 0.005 || screenY < -200 || screenY > h + 200) return progress < 1

        const currentHue = huesRef.current.extra[r.hueIdx % 5]

        ctx.beginPath()
        ctx.arc(r.x, screenY, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${currentHue}, 80%, 60%, ${fadeAlpha})`
        ctx.lineWidth = 1
        ctx.stroke()

        return progress < 1
      })
    }

    const drawNoiseGrain = (time) => {
      // Subtle noise overlay using random semi-transparent dots
      const density = 400
      ctx.fillStyle = 'rgba(255, 255, 255, 0.008)'
      for (let i = 0; i < density; i++) {
        const nx = Math.random() * w
        const ny = Math.random() * h
        ctx.fillRect(nx, ny, 1, 1)
      }
    }

    // --- MAIN LOOP ---
    const animate = (timestamp) => {
      const scrollY = scrollYRef.current
      const scrollRatio = scrollRatioRef.current

      ctx.clearRect(0, 0, w, h)

      if (isProjectsRef.current) {
        ctx.save()
        ctx.globalAlpha = 0.02 // Ultra subtle 2% opacity
        ctx.strokeStyle = `hsla(${huesRef.current.primary}, 80%, 50%, 1)`
        ctx.lineWidth = 1
        for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
        ctx.restore()
        
        animRef.current = requestAnimationFrame(animate)
        return
      }

      drawBlobs(timestamp, scrollY)
      drawDotField(timestamp, scrollY, scrollRatio)
      drawParticlesAndConstellations(timestamp, scrollY)
      drawHexagons(timestamp, scrollY)
      drawGlyphs(timestamp, scrollY)
      drawRings(timestamp, scrollY)
      drawEnergyGrid(timestamp, scrollY, scrollRatio)
      drawWaves(timestamp, scrollY, scrollRatio)
      drawShootingStars(timestamp)
      drawPulseRings(timestamp, scrollY)
      drawNoiseGrain(timestamp)

      animRef.current = requestAnimationFrame(animate)
    }



    animRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
