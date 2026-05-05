import { useState } from 'react'

interface NavbarProps {
  scrolled: boolean
}

export default function Navbar({ scrolled }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setMenuOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-logo" onClick={() => scrollToSection('hero')}>
        ✦ Portfolio
      </div>
      <button
        className="nav-mobile-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <button className="nav-link" onClick={() => scrollToSection('about')}>
            About
          </button>
        </li>
        <li>
          <button className="nav-link" onClick={() => scrollToSection('profile')}>
            Profile
          </button>
        </li>
        <li>
          <button className="nav-link" onClick={() => scrollToSection('game')}>
            Mini Game
          </button>
        </li>
      </ul>
    </nav>
  )
}
