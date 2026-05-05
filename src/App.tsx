import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Profile from './components/Profile'
import Game from './components/Game'
import Footer from './components/Footer'
import ThemeSwitcher from './components/ThemeSwitcher'

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Profile />
      <Game />
    </>
  )
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Navbar scrolled={scrolled} />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <ThemeSwitcher />
    </>
  )
}

export default App
