import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import { ThemeProvider } from './context/ThemeContext'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import SPPProjectPage from './pages/SPPProjectPage'
import MovieRecommenderPage from './pages/MovieRecommenderPage'
import PortfolioProjectPage from './pages/PortfolioProjectPage'
import HRAnalyticsPage from './pages/HRAnalyticsPage'
import FuzNexPage from './pages/FuzNexPage'
import CaliforniaHousingPage from './pages/CaliforniaHousingPage'
import DynamicBackground from './components/DynamicBackground'

function CursorGlow() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`)
      document.documentElement.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  return null
}

export default function App() {
  return (
    <ThemeProvider>
      <DynamicBackground />
      <CursorGlow />
      {/* FIX 2: cursor proximity glow overlay */}
      <div className="cursor-glow-overlay" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/student-placement-predictor" element={<SPPProjectPage />} />
            <Route path="/projects/movie-recommender" element={<MovieRecommenderPage />} />
            <Route path="/projects/portfolio" element={<PortfolioProjectPage />} />
            <Route path="/projects/hr-analytics" element={<HRAnalyticsPage />} />
            <Route path="/projects/fuznex" element={<FuzNexPage />} />
            <Route path="/projects/california-housing" element={<CaliforniaHousingPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
