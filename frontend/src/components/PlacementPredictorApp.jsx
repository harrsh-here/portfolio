import { useState, useEffect, useRef } from 'react';

const API_URL = import.meta.env.VITE_PLACEMENT_API_URL || 'http://localhost:5000';

export default function PlacementPredictorApp() {
  const [cgpa, setCgpa] = useState(7.5);
  const [iq, setIq] = useState(110);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'loading' | 'result'
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [ringOffset, setRingOffset] = useState(439.82);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const progressRef = useRef(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)
        const res = await fetch(`${API_URL}/health`, { signal: controller.signal })
        clearTimeout(timeoutId)
        if (res.ok) setIsBackendConnected(true)
        else setIsBackendConnected(false)
      } catch (err) {
        setIsBackendConnected(false)
      }
    }
    checkHealth()
    const intervalId = setInterval(checkHealth, 15000)
    return () => clearInterval(intervalId)
  }, []);

  const CIRCUMFERENCE = 2 * Math.PI * 70; // 439.82

  // Animate progress bar during loading
  useEffect(() => {
    if (phase !== 'loading') return;
    setProgress(0);
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setProgress(prev => {
        if (prev >= 92) { clearInterval(interval); return 92; }
        return prev + (92 - prev) * 0.06;
      });
    }, 40);
    progressRef.current = interval;
    return () => clearInterval(interval);
  }, [phase]);

  // Animate confidence ring when result arrives
  useEffect(() => {
    if (phase !== 'result' || !result) return;
    setRingOffset(CIRCUMFERENCE);
    const target = CIRCUMFERENCE - (result.confidence * CIRCUMFERENCE);
    const timeout = setTimeout(() => {
      setRingOffset(target);
    }, 100);
    return () => clearTimeout(timeout);
  }, [phase, result]);

  async function handlePredict() {
    if (!isBackendConnected) {
      setError('System Offline: Backend server is unreachable.');
      return;
    }
    setError(null);
    setPhase('loading');
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cgpa, iq }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();
      if (progressRef.current) clearInterval(progressRef.current);
      setProgress(100);
      setTimeout(() => {
        setResult(data);
        setPhase('result');
      }, 400);
    } catch (err) {
      if (progressRef.current) clearInterval(progressRef.current);
      setError(err.message || 'Failed to reach prediction server.');
      setPhase('idle');
    }
  }

  function handleReset() {
    setPhase('idle');
    setResult(null);
    setError(null);
    setProgress(0);
    setRingOffset(CIRCUMFERENCE);
  }

  const isPlaced = result?.result === 'Placed';
  const confidencePct = result ? Math.round(result.confidence * 100) : 0;
  const accentColor = isPlaced ? '#00cc44' : '#ff5f57';

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }} className="w-full">
      {/* ── HEADER WITH BADGE ── */}
      <div className="flex items-center justify-between" style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Logistic Regression
        </div>
        <div className="hidden sm:flex"
          style={{ alignItems: 'center', gap: 8, padding: '6px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isBackendConnected ? '#22c55e' : '#ff5f57', flexShrink: 0, boxShadow: isBackendConnected ? '0 0 8px rgba(34,197,94,0.4)' : 'none' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            {isBackendConnected ? 'Model Active' : 'Model Offline'}
          </span>
        </div>
      </div>

      {/* ── ERROR BANNER ── */}
      {error && (
        <div
          className="animate-fade-in"
          style={{
            background: 'rgba(255,95,87,0.1)',
            border: '1px solid rgba(255,95,87,0.3)',
            borderRadius: 10,
            padding: '14px 20px',
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <span style={{ color: '#ff5f57', fontSize: 18 }}>⚠</span>
          <span style={{ color: '#ff5f57', fontSize: 14 }}>{error}</span>
        </div>
      )}

      {/* ── IDLE STATE: INPUTS ── */}
      {phase === 'idle' && (
        <div className="animate-fade-in">
          {/* Parameter Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 28,
              marginBottom: 36,
            }}
          >
            {/* CGPA Input */}
            <div
              id="param-cgpa"
              style={{
                background: 'linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid color-mix(in srgb, var(--accent-cyan) 15%, transparent)',
                borderRadius: 16,
                padding: '30px 28px 26px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)';
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Parameter 01 // Academics
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 44,
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                  marginBottom: 18,
                }}
              >
                {cgpa.toFixed(1)}{' '}
                <span style={{ fontSize: 18, color: 'var(--text-muted)', fontWeight: 500 }}>
                  GPA
                </span>
              </div>
              <input
                id="slider-cgpa"
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={cgpa}
                onChange={e => setCgpa(parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  height: 6,
                  cursor: 'pointer',
                  borderRadius: 4,
                  background: `linear-gradient(to right, var(--accent-cyan) ${(cgpa / 10) * 100}%, rgba(255,255,255,0.1) ${(cgpa / 10) * 100}%)`,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  marginTop: 8,
                }}
              >
                <span>0.0</span>
                <span>10.0</span>
              </div>
            </div>

            {/* IQ Input */}
            <div
              id="param-iq"
              style={{
                background: 'linear-gradient(165deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid color-mix(in srgb, var(--accent-cyan) 15%, transparent)',
                borderRadius: 16,
                padding: '30px 28px 26px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)';
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Parameter 02 // Cognitive
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 44,
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  lineHeight: 1.1,
                  marginBottom: 18,
                }}
              >
                {iq}{' '}
                <span style={{ fontSize: 18, color: 'var(--text-muted)', fontWeight: 500 }}>
                  IQ
                </span>
              </div>
              <input
                id="slider-iq"
                type="range"
                min="70"
                max="150"
                step="1"
                value={iq}
                onChange={e => setIq(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: 6,
                  cursor: 'pointer',
                  borderRadius: 4,
                  background: `linear-gradient(to right, var(--accent-cyan) ${((iq - 70) / (150 - 70)) * 100}%, rgba(255,255,255,0.1) ${((iq - 70) / (150 - 70)) * 100}%)`,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text-muted)',
                  marginTop: 8,
                }}
              >
                <span>70</span>
                <span>150</span>
              </div>
            </div>
          </div>

          {/* Run Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="glow-border" style={{ borderRadius: 12, opacity: isBackendConnected ? 1 : 0.5 }}>
              <button
                id="btn-predict"
                onClick={handlePredict}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 10,
                  color: 'var(--accent-cyan)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '16px 48px',
                  cursor: isBackendConnected ? 'pointer' : 'not-allowed',
                  textTransform: 'uppercase',
                  transition: 'all 0.3s ease',
                  width: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                  e.currentTarget.style.border = '1px solid var(--border)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                  e.currentTarget.style.border = '1px solid var(--border-accent)';
                }}
              >
                Run Prediction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LOADING STATE ── */}
      {phase === 'loading' && (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '48px 0' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              color: 'var(--accent-cyan)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 28,
            }}
          >
            Analyzing profile...
          </div>
          <div
            style={{
              width: '100%',
              maxWidth: 360,
              height: 4,
              background: 'var(--bg-card)',
              borderRadius: 4,
              margin: '0 auto',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-blue))',
                borderRadius: 4,
                transition: 'width 0.15s ease-out',
              }}
            />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-muted)',
              marginTop: 14,
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>
      )}

      {/* ── RESULT STATE ── */}
      {phase === 'result' && result && (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '24px 0' }}>
          {/* Confidence Ring */}
          <div className="confidence-ring" style={{ margin: '0 auto 28px', width: 172, height: 172, position: 'relative' }}>
            <svg
              className="confidence-ring__svg"
              width="172"
              height="172"
              viewBox="0 0 172 172"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                className="confidence-ring__track"
                cx="86"
                cy="86"
                r="70"
                fill="none"
                stroke="var(--border)"
                strokeWidth="8"
              />
              <circle
                className="confidence-ring__fill"
                cx="86"
                cy="86"
                r="70"
                fill="none"
                stroke={accentColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={ringOffset}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
              />
            </svg>
            <div
              className="confidence-ring__label"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 36,
                  fontWeight: 900,
                  color: accentColor,
                  lineHeight: 1,
                }}
              >
                {confidencePct}%
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginTop: 4,
                }}
              >
                Confidence
              </span>
            </div>
          </div>

          {/* Verdict */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 22,
              fontWeight: 800,
              color: accentColor,
              letterSpacing: '0.04em',
              marginBottom: 20,
            }}
          >
            {isPlaced ? '✓ Likely Placed' : '✗ Needs Improvement'}
          </div>

          {/* Insight Chips */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 12,
              flexWrap: 'wrap',
              marginBottom: 32,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '8px 16px',
              }}
            >
              CGPA {cgpa.toFixed(1)} · {cgpa >= 7 ? 'Strong' : 'Below avg'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: '8px 16px',
              }}
            >
              IQ {iq} · {iq >= 110 ? 'Above avg' : 'Average'}
            </span>
          </div>

          {/* Try Again */}
          <button
            id="btn-reset"
            onClick={handleReset}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: '0.06em',
              padding: '12px 32px',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.color = 'var(--accent-cyan)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            ← Try Again
          </button>
        </div>
      )}

      {/* ── DISCLAIMER ── */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-muted)',
          marginTop: 36,
          letterSpacing: '0.04em',
          opacity: 0.6,
        }}
      >
        Demo ML model trained on sample data. Not for actual decisions.
      </div>
    </div>
  );
}
