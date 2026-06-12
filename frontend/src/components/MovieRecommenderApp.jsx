import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Search, Film, Star, ExternalLink, RefreshCw, ChevronDown, ChevronUp, User, Calendar, AlertCircle, Zap } from 'lucide-react'

const formatDisplayTitle = (title, includeYear = false) => {
  if (!title) return ''
  let clean = title.trim()
  const yearMatch = clean.match(/\s\((\d{4})\)\s*$/)
  const year = (yearMatch && includeYear) ? ` ${yearMatch[0].trim()}` : ''
  
  clean = clean.replace(/\s\(\d{4}\)\s*$/, '').trim()
  clean = clean.replace(/\s*\([^)]*\)\s*$/, '').trim()
  clean = clean.replace(/^(.*),\s*(The|A|An)$/i, '$2 $1').trim()
  
  return clean + year
}

const getSimilarityScore = (str1, str2) => {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()

  if (s1 === s2) return 1.0
  if (s1.length === 0 || s2.length === 0) return 0.0

  const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null))
  for (let i = 0; i <= s1.length; i++) track[0][i] = i
  for (let j = 0; j <= s2.length; j++) track[j][0] = j

  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      )
    }
  }

  const distance = track[s2.length][s1.length]
  return 1 - distance / Math.max(s1.length, s2.length)
}

const findClosestMovieTitle = (inputTitle, allTitles) => {
  let bestMatch = null
  let highestScore = 0

  for (const trueTitle of allTitles) {
    const cleanTrueTitle = trueTitle.replace(/\s\(\d{4}\)$/, '').trim()
    const score = getSimilarityScore(inputTitle, cleanTrueTitle)

    if (score > highestScore) {
      highestScore = score
      bestMatch = trueTitle
    }
  }
  return highestScore > 0.4 ? bestMatch : null
}

const fetchExtraDetails = async (title) => {
  try {
    const cleanTitle = formatDisplayTitle(title)
    const apiKey = import.meta.env.VITE_OMDB_API_KEY || '968ca803' // Fallback for demo if env missing
    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(cleanTitle)}&apikey=${apiKey}`)
    if (res.ok) return await res.json()
  } catch (e) { /* silent */ }
  return null
}

export default function MovieRecommenderApp({ onHasResults }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState(null)
  const [allMovies, setAllMovies] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [expandedCards, setExpandedCards] = useState({})
  const [extraData, setExtraData] = useState({})
  const [cardsVisible, setCardsVisible] = useState(false)
  const [isBackendConnected, setIsBackendConnected] = useState(false)
  const [showStatusOverlay, setShowStatusOverlay] = useState(false)
  const [overlayStatus, setOverlayStatus] = useState('offline')
  const prevConnectedRef = useRef(null)
  
  const [originalQuery, setOriginalQuery] = useState(null)
  const suggestionRef = useRef(null)
  const searchInputRef = useRef(null)
  const resultsRef = useRef(null)

  useEffect(() => {
    if (onHasResults) {
      onHasResults(recommendations.length > 0)
    }
  }, [recommendations.length, onHasResults])

  const API_BASE_URL = import.meta.env.VITE_MOVIE_API_URL || 'http://localhost:8000'

  const QUICK_PICKS = [
    'Toy Story (1995)',
    'Star Wars (1977)',
    'Blade Runner (1982)',
    'Alien (1979)',
    'Matrix, The (1999)'
  ]

  const triggerOverlay = (status) => {
    setOverlayStatus(status)
    setShowStatusOverlay(true)
    setTimeout(() => setShowStatusOverlay(false), 5000)
  }

  useEffect(() => {
    let isSubscribed = true
    let timerId = null

    const fetchMoviesData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/movies`)
        if (res.ok) {
          const data = await res.json()
          if (isSubscribed) setAllMovies(data)
        }
      } catch (err) {}
    }

    const pollHealth = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)
        const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal })
        clearTimeout(timeoutId)
        if (res.ok) {
          if (!isSubscribed) return
          setIsBackendConnected(true)
          if (prevConnectedRef.current === false) {
            triggerOverlay('online')
            fetchMoviesData()
          }
          prevConnectedRef.current = true
        }
      } catch (err) {
        if (!isSubscribed) return
        setIsBackendConnected(false)
        if (prevConnectedRef.current === true) {
          triggerOverlay('offline')
        }
        prevConnectedRef.current = false
      } finally {
        if (isSubscribed) {
          // Dynamic polling: if connected, check only every 2 minutes. If offline, check every 10 seconds.
          const nextInterval = prevConnectedRef.current ? 120000 : 10000;
          timerId = setTimeout(pollHealth, nextInterval)
        }
      }
    }
    
    fetchMoviesData()
    pollHealth()

    return () => {
      isSubscribed = false
      if (timerId) clearTimeout(timerId)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
      // If clicked outside of any movie card, collapse all plots
      if (!event.target.closest('.rec-card')) {
        setExpandedCards({})
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
        .filter(m => m.toLowerCase().includes(val.toLowerCase()) || formatDisplayTitle(m, true).toLowerCase().includes(val.toLowerCase()))
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
    
    if (!isBackendConnected) {
      try {
        const res = await fetch(`${API_BASE_URL}/health`)
        if (res.ok) {
          setIsBackendConnected(true)
          prevConnectedRef.current = true
        } else {
          throw new Error('Offline')
        }
      } catch (err) {
        setError('The inference server is offline. Please wait for the model to come online and try again.')
        if (resultsRef.current) {
          setTimeout(() => {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }, 100)
        }
        return
      }
    }

    setLoading(true)
    setError(null)
    setShowSuggestions(false)
    setRecommendations([])
    setCardsVisible(false)
    setExpandedCards({})
    setExtraData({})

    // Apply fuzzy matching autocorrection
    const correctedTitle = findClosestMovieTitle(movieTitle, allMovies) || movieTitle
    if (correctedTitle !== movieTitle) {
      setOriginalQuery(movieTitle)
    } else {
      setOriginalQuery(null)
    }
    setQuery(formatDisplayTitle(correctedTitle, true))

    try {
      const res = await fetch(`${API_BASE_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie_title: correctedTitle, num_recommendations: 10 })
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

      setTimeout(() => {
        setCardsVisible(true)
        if (resultsRef.current) {
          // Add a tiny delay so the DOM has a moment to expand
          setTimeout(() => {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        }
      }, 50)
    } catch (err) {
      setError('Movie not found or the inference server is offline. Please try another title or check back later.')
      if (resultsRef.current) {
        setTimeout(() => {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setQuery('')
    setRecommendations([])
    setError(null)
    setExpandedCards({})
    setExtraData({})
    setOriginalQuery(null)
    setCardsVisible(false)
    if (searchInputRef.current) {
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (window.innerWidth > 768) {
        setTimeout(() => searchInputRef.current?.focus(), 500)
      }
    }
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
    <div className="flex flex-col gap-10 md:gap-12 w-full relative responsive-app-wrapper">
      
      {/* ━━━ HUD Overlay ━━━ */}
      {showStatusOverlay && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
          <div className={`
            relative flex flex-col items-center justify-center
            w-[420px] h-[160px] rounded-2xl border
            ${overlayStatus === 'online' 
              ? 'bg-green-500/10 border-green-500/40 shadow-[0_0_60px_rgba(34,197,94,0.15)] text-green-400' 
              : 'bg-red-500/10 border-red-500/40 shadow-[0_0_60px_rgba(239,68,68,0.15)] text-red-400'
            }
            backdrop-blur-md animate-tech-flash
          `}>
            <div className="text-3xl font-black uppercase tracking-[0.3em] mb-2" style={{ fontFamily: 'var(--font-mono)', textShadow: `0 0 15px currentColor` }}>
              {overlayStatus === 'online' ? 'System Online' : 'System Offline'}
            </div>
            <div className="text-[10px] uppercase tracking-[0.25em] opacity-80" style={{ fontFamily: 'var(--font-mono)' }}>
              {overlayStatus === 'online' ? 'Inference Engine Connected' : 'Connection Lost'}
            </div>
            
            {/* HUD Corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-current opacity-60 m-3" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-current opacity-60 m-3" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-current opacity-60 m-3" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-current opacity-60 m-3" />
          </div>
        </div>,
        document.body
      )}

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
              ref={searchInputRef}
              type="text"
              placeholder="Search for a movie title..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleGetRecommendations()}
              className="search-input-responsive flex-grow min-w-0 bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] text-sm sm:text-base"
              style={{ fontFamily: 'var(--font-sans)' }}
            />

            <div className="shrink-0 h-[58px] movie-run-btn-wrapper">
              <button
                id="movie-rec-search-btn"
                onClick={() => handleGetRecommendations()}
                disabled={loading || !query}
                className={`w-full h-full flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-[var(--bg-primary)] enabled:hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.4),_0_0_25px_var(--accent-cyan)] enabled:hover:brightness-125 z-10 relative movie-run-btn`}
                style={{ 
                  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', 
                  padding: '0 32px', borderRadius: '0 12px 12px 0',
                  background: isBackendConnected ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  borderLeft: '1px solid var(--border)',
                  opacity: !isBackendConnected ? 0.5 : 1,
                  boxShadow: isBackendConnected ? '0 0 20px rgba(6, 182, 212, 0.2)' : 'none'
                }}
              >
                <Zap size={14} className="shrink-0" />
                <span className="movie-run-btn-text">Run</span>
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-[105%] bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] max-h-60 overflow-y-auto animate-fade-in">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setQuery(formatDisplayTitle(s, true)); handleGetRecommendations(s) }}
                    className="w-full text-left hover:bg-[var(--accent-cyan)]/10 text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] border-b border-[var(--border)] last:border-0 text-xs transition-all"
                    style={{ fontFamily: 'var(--font-mono)', padding: '12px 20px' }}
                  >
                    {formatDisplayTitle(s, true)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto py-1 no-scrollbar">
          <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest shrink-0"
            style={{ fontFamily: 'var(--font-mono)' }}>Quick Picks:</span>
          <div className="flex gap-2 shrink-0">
            {QUICK_PICKS.map((m) => (
              <button
                key={m}
                onClick={() => { setQuery(formatDisplayTitle(m, true)); handleGetRecommendations(m) }}
                className="rounded-full bg-white/[0.02] border border-white/5 text-gray-500 text-[11px] hover:border-[var(--accent-cyan)]/40 hover:text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/5 transition-all whitespace-nowrap active:scale-95"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 24px' }}
              >
                {formatDisplayTitle(m, true)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━ Dynamic Content Area ━━━ */}
      <div className="min-h-[350px] flex flex-col gap-6" ref={resultsRef}>

        {/* Persistent Status & Results Header */}
        <div className="flex items-center justify-between border-b border-white/5" style={{ paddingBottom: 16, minHeight: 48 }}>
          <div className="flex flex-col gap-1.5">
            {!loading && !error && recommendations.length > 0 && (
              <>
                <h3 style={{ fontFamily: 'var(--font-mono)' }}
                  className="text-lg font-bold text-white flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent-cyan)] shadow-[0_0_8px_var(--accent-cyan)]" />
                  Top Correlations
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)' }}
                  className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed mt-1">
                  {originalQuery ? (
                    <>
                      Showing results for <span className="text-[var(--accent-cyan)] font-bold">"{formatDisplayTitle(query)}"</span>
                      <br/>
                      <span className="text-[var(--text-muted)] text-[10px] lowercase" style={{ textTransform: 'none', letterSpacing: '0.05em' }}>
                        (Auto-corrected from "{originalQuery}")
                      </span>
                    </>
                  ) : (
                    <span className="text-[var(--text-muted)]">Based on: "{query}"</span>
                  )}
                </p>
              </>
            )}
          </div>
          <div className="hidden sm:flex"
            style={{ alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isBackendConnected ? '#22c55e' : '#ff5f57', flexShrink: 0, boxShadow: isBackendConnected ? '0 0 8px rgba(34,197,94,0.4)' : 'none' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              {isBackendConnected ? 'Model Active' : 'Model Offline'}
            </span>
          </div>
        </div>

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
              {[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}
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
            {/* Cards Grid */}
            <div className="rec-grid">
              {recommendations.map((movie, idx) => {
                const details = extraData[movie.id]
                const isExpanded = !!expandedCards[idx]

                return (
                  <div
                    key={movie.id || idx}
                    className="rec-card"
                    style={{
                      opacity: cardsVisible ? 1 : 0,
                      transform: cardsVisible ? 'translateY(0)' : 'translateY(12px)',
                      transition: `opacity 0.4s ease ${idx * 0.06}s, transform 0.4s ease ${idx * 0.06}s`,
                      zIndex: isExpanded ? 40 : 1,
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
                      <div className="rec-card__title">{formatDisplayTitle(movie.title)}</div>
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
                            onClick={() => setExpandedCards(prev => ({ ...prev, [idx]: !prev[idx] }))}
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
