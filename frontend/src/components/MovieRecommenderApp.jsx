import { useState, useEffect, useRef } from 'react'
import { Search, Film, Star, ExternalLink, RefreshCw, ChevronDown, ChevronUp, User, Calendar, AlertCircle, Zap } from 'lucide-react'

const fetchExtraDetails = async (title) => {
  try {
    const cleanTitle = title.replace(/\s\(\d{4}\)$/, '').trim()
    const apiKey = import.meta.env.VITE_OMDB_API_KEY || '968ca803' // Fallback for demo if env missing
    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(cleanTitle)}&apikey=${apiKey}`)
    if (res.ok) return await res.json()
  } catch (e) { /* silent */ }
  return null
}

export default function MovieRecommenderApp() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState(null)
  const [allMovies, setAllMovies] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [expandedCard, setExpandedCard] = useState(null)
  const [extraData, setExtraData] = useState({})
  const [cardsVisible, setCardsVisible] = useState(false)
  const suggestionRef = useRef(null)

  const API_BASE_URL = import.meta.env.VITE_MOVIE_API_URL || 'http://localhost:8000'

  const QUICK_PICKS = [
    'Toy Story (1995)',
    'Star Wars (1977)',
    'Blade Runner (1982)',
    'Alien (1979)',
    'Matrix, The (1999)'
  ]

  const MOCK_MOVIES = [
    'Toy Story (1995)', 'GoldenEye (1995)', 'Star Wars (1977)',
    'Get Shorty (1995)', 'Twelve Monkeys (1995)', 'Blade Runner (1982)',
    'Alien (1979)', 'Matrix, The (1999)', 'Fargo (1996)'
  ]

  const MOCK_RECS = [
    { id: 101, title: 'Empire Strikes Back, The (1980)', genres: ['Action', 'Adventure', 'Sci-Fi'], average_rating: 4.29 },
    { id: 102, title: 'Return of the Jedi (1983)', genres: ['Action', 'Adventure', 'Sci-Fi'], average_rating: 4.01 },
    { id: 103, title: 'Raiders of the Lost Ark (1981)', genres: ['Action', 'Adventure'], average_rating: 4.25 },
    { id: 104, title: 'Blade Runner (1982)', genres: ['Action', 'Sci-Fi', 'Thriller'], average_rating: 4.10 },
    { id: 105, title: 'Terminator 2: Judgment Day (1991)', genres: ['Action', 'Sci-Fi'], average_rating: 3.97 },
    { id: 106, title: 'Alien (1979)', genres: ['Action', 'Horror', 'Sci-Fi'], average_rating: 3.95 }
  ]

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/movies`)
        if (res.ok) {
          const data = await res.json()
          setAllMovies(data)
        }
      } catch (err) {
        console.warn('Backend unavailable, using mock movie list')
        setAllMovies(MOCK_MOVIES)
      }
    }
    fetchMovies()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (val.length > 1) {
      const filtered = allMovies
        .filter(m => m.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 8)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleGetRecommendations = async (movieTitle = query) => {
    if (!movieTitle) return
    setLoading(true)
    setError(null)
    setShowSuggestions(false)
    setRecommendations([])
    setCardsVisible(false)
    setExpandedCard(null)
    setExtraData({})

    try {
      const res = await fetch(`${API_BASE_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie_title: movieTitle, num_recommendations: 6 })
      })

      if (!res.ok) throw new Error('Movie not found in dataset')

      const data = await res.json()
      setRecommendations(data.recommendations)

      // Fetch OMDb details for each recommendation
      data.recommendations.forEach(async (m) => {
        const details = await fetchExtraDetails(m.title)
        if (details && details.Response !== 'False') {
          setExtraData(prev => ({ ...prev, [m.id]: details }))
        }
      })

      setTimeout(() => setCardsVisible(true), 50)
    } catch (err) {
      // Try mock data as fallback
      if (allMovies.length <= MOCK_MOVIES.length) {
        setRecommendations(MOCK_RECS)
        MOCK_RECS.forEach(async (m) => {
          const details = await fetchExtraDetails(m.title)
          if (details && details.Response !== 'False') {
            setExtraData(prev => ({ ...prev, [m.id]: details }))
          }
        })
        setTimeout(() => setCardsVisible(true), 50)
      } else {
        setError('Movie not found or the inference server is offline. Please try another title or check back later.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setQuery('')
    setRecommendations([])
    setError(null)
    setExpandedCard(null)
    setExtraData({})
    setCardsVisible(false)
  }

  // ─── Skeleton Card ───
  const SkeletonCard = () => (
    <div className="rec-card">
      <div className="rec-card__poster">
        <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: 0 }} />
      </div>
      <div className="rec-card__body">
        <div className="skeleton" style={{ width: '80%', height: 14, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: '40%', height: 10, marginBottom: 4 }} />
        <div className="skeleton" style={{ width: '50%', height: 10 }} />
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          <div className="skeleton" style={{ width: 36, height: 14 }} />
          <div className="skeleton" style={{ width: 44, height: 14 }} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col gap-12 w-full" style={{ padding: '32px 32px' }}>
      {/* ━━━ Search Section ━━━ */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1" style={{ padding: '0 4px' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)' }}
            className="text-sm font-black text-[var(--accent-cyan)] uppercase tracking-[0.3em]">
            Discovery Engine
          </h3>
          <p style={{ fontFamily: 'var(--font-mono)' }}
            className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            KNN_SIMILARITY // COSINE_METRIC
          </p>
        </div>

        {/* Search Bar */}
        <div className="group relative" ref={suggestionRef}>
          <div className="absolute -inset-1.5 bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-blue)] rounded-2xl blur-lg opacity-0 group-focus-within:opacity-20 transition-opacity duration-300" />

          <div className="relative flex items-center bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl overflow-hidden focus-within:border-[var(--accent-cyan)]/40 transition-all duration-300" style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px 0 20px', color: 'var(--text-muted)', flexShrink: 0 }}>
              <Search size={18} />
            </div>

            <input
              type="text"
              placeholder="Search for a movie title..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleGetRecommendations()}
              className="flex-grow bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] text-base"
              style={{ fontFamily: 'var(--font-sans)', padding: '18px 8px 18px 14px' }}
            />

            <div className="glow-border shrink-0 h-[58px]" style={{ borderRadius: '0 12px 12px 0' }}>
              <button
                id="movie-rec-search-btn"
                onClick={() => handleGetRecommendations()}
                disabled={loading || !query}
                className="glow-inner w-full h-full flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-20 active:scale-95"
                style={{ 
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', 
                  padding: '0 32px', borderRadius: '0 12px 12px 0',
                  color: 'var(--bg-primary)',
                  background: 'var(--accent-cyan)',
                  border: '1px solid transparent',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                }}
                onMouseEnter={(e) => {
                  if (!loading && query) {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.color = 'var(--accent-cyan)';
                    e.currentTarget.style.border = '1px solid var(--border)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && query) {
                    e.currentTarget.style.background = 'var(--accent-cyan)';
                    e.currentTarget.style.color = 'var(--bg-primary)';
                    e.currentTarget.style.border = '1px solid transparent';
                  }
                }}
              >
                <Zap size={14} />
                Run
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-[105%] bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] max-h-60 overflow-y-auto animate-fade-in">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setQuery(s); handleGetRecommendations(s) }}
                    className="w-full text-left hover:bg-[var(--accent-cyan)]/10 text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] border-b border-[var(--border)] last:border-0 text-xs transition-all"
                    style={{ fontFamily: 'var(--font-mono)', padding: '12px 20px' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Picks */}
        <div className="flex items-center gap-3 overflow-x-auto py-1 no-scrollbar">
          <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest shrink-0"
            style={{ fontFamily: 'var(--font-mono)' }}>Quick Picks:</span>
          <div className="flex gap-2 shrink-0">
            {QUICK_PICKS.map((m) => (
              <button
                key={m}
                onClick={() => { setQuery(m); handleGetRecommendations(m) }}
                className="rounded-full bg-white/[0.02] border border-white/5 text-gray-500 text-[11px] hover:border-[var(--accent-cyan)]/40 hover:text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/5 transition-all whitespace-nowrap active:scale-95"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 24px' }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━ Dynamic Content Area ━━━ */}
      <div className="min-h-[350px] flex flex-col gap-6">

        {/* LOADING: Skeleton Grid */}
        {loading && (
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex items-center gap-3" style={{ padding: '0 4px' }}>
              <RefreshCw size={16} className="text-[var(--accent-cyan)] animate-spin" />
              <span style={{ fontFamily: 'var(--font-mono)' }}
                className="text-xs text-[var(--text-muted)] uppercase tracking-widest">
                Computing similarity vectors...
              </span>
            </div>
            <div className="rec-grid">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="animate-fade-in flex flex-col items-center gap-5 py-16">
            <div className="rounded-2xl bg-red-500/5 border border-red-500/15 max-w-md text-center flex flex-col gap-4" style={{ padding: 20 }}>
              <AlertCircle size={32} className="text-red-400 mx-auto" />
              <p className="text-sm text-red-300/80" style={{ fontFamily: 'var(--font-sans)' }}>{error}</p>
              <button
                onClick={() => handleGetRecommendations()}
                className="mx-auto rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-all"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', padding: '8px 20px' }}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {!loading && !error && recommendations.length > 0 && (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between border-b border-white/5" style={{ paddingBottom: 16 }}>
              <div className="flex flex-col gap-1.5">
                <h3 style={{ fontFamily: 'var(--font-mono)' }}
                  className="text-lg font-bold text-white flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan)]" />
                  Top Correlations
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)' }}
                  className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">
                  Based on: "{query}"
                </p>
              </div>
              <div className="hidden sm:flex"
                style={{ alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Model Active</span>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="rec-grid">
              {recommendations.map((movie, idx) => {
                const details = extraData[movie.id]
                const isExpanded = expandedCard === idx

                return (
                  <div
                    key={movie.id || idx}
                    className="rec-card"
                    style={{
                      opacity: cardsVisible ? 1 : 0,
                      transform: cardsVisible ? 'translateY(0)' : 'translateY(12px)',
                      transition: `opacity 0.4s ease ${idx * 0.06}s, transform 0.4s ease ${idx * 0.06}s`
                    }}
                  >
                    {/* Poster */}
                    <div className="rec-card__poster">
                      {details?.Poster && details.Poster !== 'N/A' ? (
                        <img src={details.Poster} alt={movie.title} loading="lazy" />
                      ) : (
                        <div className="rec-card__poster-ph">
                          <Film size={36} />
                          <span>{details ? 'no poster' : 'loading'}</span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="rec-card__body">
                      <div className="rec-card__title">{movie.title}</div>
                      <div className="rec-card__year">
                        {details?.Year && details.Year !== 'N/A'
                          ? details.Year + (details.Runtime && details.Runtime !== 'N/A' ? ' · ' + details.Runtime : '')
                          : '—'}
                      </div>
                      <div className="rec-card__rating">
                        {details?.imdbRating && details.imdbRating !== 'N/A'
                          ? '★ ' + details.imdbRating + ' / 10'
                          : movie.average_rating
                            ? '★ ' + movie.average_rating.toFixed(1) + ' / 5'
                            : ''}
                      </div>
                      <div className="rec-card__tags">
                        {(details?.Genre?.split(',') || movie.genres || []).slice(0, 3).map((g, i) => (
                          <span key={i} className="rec-card__tag">{String(g).trim()}</span>
                        ))}
                      </div>
                      <div className="rec-card__footer">
                        {details ? (
                          <button
                            className="rec-card__plot-btn"
                            onClick={() => setExpandedCard(isExpanded ? null : idx)}
                          >
                            {isExpanded ? '▲ plot' : '▼ plot'}
                          </button>
                        ) : (
                          <span className="rec-card__plot-btn" style={{ fontStyle: 'italic' }}>loading...</span>
                        )}
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(movie.title)}+movie`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rec-card__search-link"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    {/* Expandable Plot Panel */}
                    {isExpanded && details && (
                      <div className="rec-card__plot-panel">
                        {details.Director && details.Director !== 'N/A' && (
                          <div className="rec-card__plot-director">Dir. {details.Director}</div>
                        )}
                        <div>{details.Plot !== 'N/A' ? details.Plot : 'No plot summary available.'}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="mt-8 self-center rounded-full border border-white/5 text-xs text-[var(--text-muted)] hover:text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)]/30 transition-all flex items-center gap-2 group"
              style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '12px 24px' }}
            >
              <RefreshCw size={13} className="group-hover:rotate-180 transition-transform duration-500" />
              Reset Analysis
            </button>
          </>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && recommendations.length === 0 && (
          <div className="flex-grow flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-[var(--accent-cyan)]/10 blur-2xl rounded-full" />
              <Film size={44} className="text-white/10 relative" />
            </div>
            <p style={{ fontFamily: 'var(--font-mono)' }}
              className="text-[var(--text-muted)] text-[10px] uppercase tracking-[0.4em]">
              Engine Standby // Awaiting Input
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
