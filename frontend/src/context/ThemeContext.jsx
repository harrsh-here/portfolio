import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const themes = {
  default: {
    name: 'Default',
    colors: {
      '--accent-cyan': '#00f5ff',
      '--accent-blue': '#6366f1',
      '--accent-glow': 'rgba(0, 245, 255, 0.10)',
      '--border-accent': 'rgba(0, 245, 255, 0.20)',
      '--bg-primary': '#06080d',
      '--bg-surface': '#0c0f16',
      '--bg-card': '#111520',
      '--bg-card-hover': '#171c28',
      '--bg-nav': 'rgba(17, 21, 32, 0.85)',
    }
  },
  amethyst: {
    name: 'AmethystFalls',
    colors: {
      '--accent-cyan': '#a855f7',
      '--accent-blue': '#d946ef',
      '--accent-glow': 'rgba(168, 85, 247, 0.15)',
      '--border-accent': 'rgba(168, 85, 247, 0.25)',
      '--bg-primary': '#090510',
      '--bg-surface': '#0f0a1a',
      '--bg-card': '#151025',
      '--bg-card-hover': '#1c1533',
      '--bg-nav': 'rgba(21, 16, 37, 0.85)',
    }
  },
  ocean: {
    name: 'Ocean',
    colors: {
      '--accent-cyan': '#00b4d8',
      '--accent-blue': '#0077b6',
      '--accent-glow': 'rgba(0, 180, 216, 0.15)',
      '--border-accent': 'rgba(0, 180, 216, 0.25)',
      '--bg-primary': '#040b14',
      '--bg-surface': '#0a1423',
      '--bg-card': '#101d32',
      '--bg-card-hover': '#182742',
      '--bg-nav': 'rgba(16, 29, 50, 0.85)',
    }
  },
  amber: {
    name: 'Amber',
    colors: {
      '--accent-cyan': '#ffb000',
      '--accent-blue': '#f59e0b',
      '--accent-glow': 'rgba(255, 176, 0, 0.10)',
      '--border-accent': 'rgba(255, 176, 0, 0.20)',
      '--bg-primary': '#080401',
      '--bg-surface': '#0e0702',
      '--bg-card': '#160c04',
      '--bg-card-hover': '#1e1106',
      '--bg-nav': 'rgba(22, 12, 4, 0.90)',
    }
  }
}

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('portfolio_theme')
      return (saved && themes[saved]) ? saved : 'default'
    } catch (e) {
      return 'default'
    }
  })

  useEffect(() => {
    const theme = themes[activeTheme]
    if (theme) {
      Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
      })
      try {
        localStorage.setItem('portfolio_theme', activeTheme)
      } catch (e) {
        // Ignore write errors (e.g., incognito mode)
      }
    }
  }, [activeTheme])

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
