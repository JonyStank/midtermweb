import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Theme {
  name: string
  icon: string
  primary: string
  secondary: string
  tertiary: string
  gradient: string
  glow: string
  borderSubtle: string
  borderGlow: string
  shadowGlow: string
}

const themes: Theme[] = [
  {
    name: 'Cyberpunk',
    icon: '💜',
    primary: '#6c63ff',
    secondary: '#00d4ff',
    tertiary: '#ff6b9d',
    gradient: 'linear-gradient(135deg, #6c63ff 0%, #00d4ff 50%, #ff6b9d 100%)',
    glow: 'linear-gradient(135deg, #6c63ff, #00d4ff)',
    borderSubtle: 'rgba(108, 99, 255, 0.15)',
    borderGlow: 'rgba(108, 99, 255, 0.4)',
    shadowGlow: '0 0 30px rgba(108, 99, 255, 0.3)',
  },
  {
    name: 'Emerald',
    icon: '💚',
    primary: '#10b981',
    secondary: '#06d6a0',
    tertiary: '#34d399',
    gradient: 'linear-gradient(135deg, #10b981 0%, #06d6a0 50%, #34d399 100%)',
    glow: 'linear-gradient(135deg, #10b981, #06d6a0)',
    borderSubtle: 'rgba(16, 185, 129, 0.15)',
    borderGlow: 'rgba(16, 185, 129, 0.4)',
    shadowGlow: '0 0 30px rgba(16, 185, 129, 0.3)',
  },
  {
    name: 'Sunset',
    icon: '🧡',
    primary: '#f97316',
    secondary: '#fb923c',
    tertiary: '#fbbf24',
    gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
    glow: 'linear-gradient(135deg, #f97316, #fb923c)',
    borderSubtle: 'rgba(249, 115, 22, 0.15)',
    borderGlow: 'rgba(249, 115, 22, 0.4)',
    shadowGlow: '0 0 30px rgba(249, 115, 22, 0.3)',
  },
  {
    name: 'Rose',
    icon: '💗',
    primary: '#ec4899',
    secondary: '#f472b6',
    tertiary: '#a855f7',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #a855f7 100%)',
    glow: 'linear-gradient(135deg, #ec4899, #f472b6)',
    borderSubtle: 'rgba(236, 72, 153, 0.15)',
    borderGlow: 'rgba(236, 72, 153, 0.4)',
    shadowGlow: '0 0 30px rgba(236, 72, 153, 0.3)',
  },
  {
    name: 'Ocean',
    icon: '💙',
    primary: '#3b82f6',
    secondary: '#60a5fa',
    tertiary: '#06b6d4',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #06b6d4 100%)',
    glow: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    borderSubtle: 'rgba(59, 130, 246, 0.15)',
    borderGlow: 'rgba(59, 130, 246, 0.4)',
    shadowGlow: '0 0 30px rgba(59, 130, 246, 0.3)',
  },
]

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty('--accent-primary', theme.primary)
  root.style.setProperty('--accent-secondary', theme.secondary)
  root.style.setProperty('--accent-tertiary', theme.tertiary)
  root.style.setProperty('--gradient-hero', theme.gradient)
  root.style.setProperty('--gradient-glow', theme.glow)
  root.style.setProperty('--gradient-card', `linear-gradient(135deg, ${theme.primary}1a, ${theme.secondary}0d)`)
  root.style.setProperty('--border-subtle', theme.borderSubtle)
  root.style.setProperty('--border-glow', theme.borderGlow)
  root.style.setProperty('--shadow-glow', theme.shadowGlow)
}

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  const [activeTheme, setActiveTheme] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  // Load saved theme
  useEffect(() => {
    try {
      const saved = localStorage.getItem('site-theme')
      if (saved) {
        const idx = parseInt(saved, 10)
        if (idx >= 0 && idx < themes.length) {
          setActiveTheme(idx)
          applyTheme(themes[idx])
        }
      }
    } catch { /* ignore */ }
  }, [])

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const selectTheme = (idx: number) => {
    setActiveTheme(idx)
    applyTheme(themes[idx])
    try { localStorage.setItem('site-theme', String(idx)) } catch { /* ignore */ }
  }

  return (
    <div className="theme-switcher" ref={panelRef}>
      <motion.button
        className="theme-fab"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: open ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        aria-label="Change theme color"
        title="Change theme color"
      >
        🎨
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="theme-panel"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="theme-panel-title">Theme Color</div>
            <div className="theme-options">
              {themes.map((theme, i) => (
                <motion.button
                  key={theme.name}
                  className={`theme-option ${activeTheme === i ? 'active' : ''}`}
                  onClick={() => selectTheme(i)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  title={theme.name}
                >
                  <span
                    className="theme-swatch"
                    style={{ background: theme.gradient }}
                  />
                  <span className="theme-option-name">{theme.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
