# Design System: Harsh Patidar — Developer Portfolio
**Project ID:** N/A (Standalone React + Vite)

## 1. Visual Theme & Atmosphere
A stark, cyber-minimal dark-mode portfolio that feels like a developer's personal terminal brought to life. The aesthetic is precise, technical, and unapologetically monochrome — broken only by searing Electric Cyan accents that draw the eye to interactive elements and key information. The mood is confident and engineering-focused: every pixel earns its place.

## 2. Color Palette & Roles

| Token | Descriptive Name | Hex / Value | Role |
|---|---|---|---|
| `--bg-primary` | Void Black | `#0a0a0a` | Page background — deepest layer |
| `--bg-surface` | Carbon Surface | `#111111` | Navbar, footer, contact strip |
| `--bg-card` | Graphite Panel | `#161616` | Cards, containers, panels |
| `--bg-card-hover` | Lifted Graphite | `#1c1c1c` | Card hover state |
| `--accent-cyan` | Electric Cyan | `#00f5ff` | Primary neon accent — links, buttons, highlights |
| `--accent-blue` | Signal Blue | `#0a66ff` | Secondary accent — subtle differentiation |
| `--accent-glow` | Cyan Haze | `rgba(0,245,255,0.12)` | Badge backgrounds, tag fills |
| `--text-primary` | Soft White | `#f0f0f0` | Primary readable text |
| `--text-secondary` | Slate Gray | `#888888` | Metadata, labels, helper text |
| `--text-muted` | Deep Gray | `#444444` | Footer text, disabled states |
| `--border` | Whisper Border | `rgba(255,255,255,0.07)` | Card borders, dividers |
| `--border-accent` | Cyan Edge | `rgba(0,245,255,0.25)` | Hover borders, focus rings |

## 3. Typography Rules
- **Headings (JetBrains Mono):** All `h1`–`h6`, hero name, section titles, and code-style labels. Monospace reinforces the developer identity. Weights: Medium (500) to Bold (700).
- **Body (Inter):** All paragraph text, descriptions, UI labels. Clean geometric sans-serif for high legibility. Weight: Regular (400), with semi-bold (600) for emphasis.
- No text gradients. Clean flat neon only.

## 4. Background & Texture
- Subtle dot-grid overlay via CSS radial-gradient (no image assets):
  ```css
  background-image: radial-gradient(rgba(0,245,255,0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  ```

## 5. Component Stylings
- **Buttons:** Primary — `--accent-cyan` bg with black text, JetBrains Mono. Secondary — transparent bg with 1px `--accent-cyan` border. Hover: neon glow `box-shadow: 0 0 20px rgba(0,245,255,0.15)`.
- **Cards:** `--bg-card` background, 1px `--border`, sharp or minimal rounding. Hover → `--bg-card-hover` + neon glow shadow + `translateY(-4px)`.
- **Inputs:** Dark background, 1px bottom border. Focus → `1px solid var(--accent-cyan)`.
- **Nav links:** Neon underline on hover via `::after` pseudo-element (2px cyan line).
- **Scrollbar:** Thin, dark track, cyan thumb.

## 6. Animation Rules
- All transitions: `200ms ease` — snappy, not sluggish.
- Scroll reveal: `IntersectionObserver`, threshold `0.15`. Elements `translateY(20px) opacity(0)` → `translateY(0) opacity(1)`, `500ms ease`.
- Desktop cursor glow: 300px radial gradient follows mouse at `rgba(0,245,255,0.03)`.
- Respect `prefers-reduced-motion: reduce` — skip all animations.

## 7. Layout Principles
- Mobile `<768px`: single column, hamburger nav, 2×2 CTA grid.
- Tablet `768–1024px`: 2-col grids.
- Desktop `>1024px`: full multi-column layouts as designed.
- Generous whitespace with disciplined grid alignment.
