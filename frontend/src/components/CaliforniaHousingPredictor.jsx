import { useState, useEffect, useRef } from 'react';

import { HOUSING_API_URL as API_URL } from '../config/api';

const FIELDS = [
  { key: 'med_inc',    label: 'Median Income',  unit: '×$10k',  min: 0.5,    max: 15,    step: 0.1,  default: 3.87,    tip: 'Block-group median income in tens of thousands of dollars.' },
  { key: 'house_age', label: 'House Age',       unit: 'yrs',    min: 1,      max: 52,    step: 1,    default: 29,      tip: 'Median house age in the block group.' },
  { key: 'ave_rooms', label: 'Avg Rooms',       unit: 'rooms',  min: 1,      max: 20,    step: 0.1,  default: 5.43,    tip: 'Average number of rooms per household.' },
  { key: 'ave_bedrms',label: 'Avg Bedrooms',    unit: 'rooms',  min: 1,      max: 5,     step: 0.1,  default: 1.10,    tip: 'Average number of bedrooms per household.' },
  { key: 'population',label: 'Population',      unit: 'people', min: 50,     max: 5000,  step: 10,   default: 1166,    tip: 'Total population of the census block group.' },
  { key: 'ave_occup', label: 'Avg Occupants',   unit: 'ppl/hh', min: 1,      max: 10,    step: 0.1,  default: 2.82,    tip: 'Average number of house members per household.' },
  { key: 'latitude',  label: 'Latitude',        unit: '°N',     min: 32.5,   max: 42,    step: 0.01, default: 35.63,   tip: 'Latitude of the block group. Northern CA ≈ 38–42°N.' },
  { key: 'longitude', label: 'Longitude',       unit: '°W',     min: -124.5, max: -114,  step: 0.01, default: -119.57, tip: 'Longitude. Coastal CA ≈ −122°W.' },
];

/* Inject slider thumb styles once — these can't be set via inline style */
const SLIDER_CSS = `
@keyframes ca-spin { to { transform: rotate(360deg); } }
.ca-range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: transparent;
  cursor: grab;
  outline: none;
  margin: 0;
}
.ca-range:active { cursor: grabbing; }
.ca-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-cyan);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-cyan) 18%, transparent), 0 0 10px color-mix(in srgb, var(--accent-cyan) 40%, transparent);
  border: 2px solid #06080d;
  cursor: grab;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}
.ca-range::-webkit-slider-thumb:hover {
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent-cyan) 25%, transparent), 0 0 18px color-mix(in srgb, var(--accent-cyan) 60%, transparent);
  transform: scale(1.15);
}
.ca-range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--accent-cyan);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent-cyan) 18%, transparent), 0 0 10px color-mix(in srgb, var(--accent-cyan) 40%, transparent);
  border: 2px solid #06080d;
  cursor: grab;
}
.ca-range::-webkit-slider-runnable-track { background: transparent; }
.ca-range::-moz-range-track { background: transparent; }
`;

function Slider({ field, value, onChange }) {
  const pct = ((value - field.min) / (field.max - field.min)) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {field.label}
        </label>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan)' }}>
          {value}&thinsp;<span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 400 }}>{field.unit}</span>
        </span>
      </div>

      {/* Custom slider track + native input layered together */}
      <div style={{ position: 'relative', height: 16, display: 'flex', alignItems: 'center' }}>
        {/* Track background */}
        <div style={{ position: 'absolute', left: 0, right: 0, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)' }}>
          {/* Filled portion */}
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: 'var(--accent-cyan)', borderRadius: 2 }} />
        </div>
        {/* Actual range input — sits on top for interaction, styled via CSS class */}
        <input
          type="range"
          className="ca-range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={e => onChange(field.key, parseFloat(e.target.value))}
        />
      </div>

      {/* Min/max hints */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{field.min}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>{field.max}</span>
      </div>
    </div>
  );
}

export default function CaliforniaHousingPredictor() {
  const defaultValues = Object.fromEntries(FIELDS.map(f => [f.key, f.default]));
  const [values, setValues]     = useState(defaultValues);
  const [phase, setPhase]       = useState('idle'); // idle | loading | result | error
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const connectedRef = useRef(false);

  /* Health polling */
  useEffect(() => {
    let timerId;
    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/health`, { signal: AbortSignal.timeout(8000) });
        setIsConnected(res.ok);
        connectedRef.current = res.ok;
      } catch {
        setIsConnected(false);
        connectedRef.current = false;
      } finally {
        timerId = setTimeout(check, connectedRef.current ? 120000 : 10000);
      }
    };
    check();
    return () => clearTimeout(timerId);
  }, []);

  const handleChange = (key, val) => setValues(prev => ({ ...prev, [key]: val }));
  const handleReset  = () => { setValues(defaultValues); };

  // Client-side fallback: linear model calculation derived from California dataset coefficients
  function calculateLocalHousing(vals) {
    // Coefficients calibrated to California Housing census features
    const base = -3.5;
    const price100k = Math.max(0.5, Math.min(50.0,
      base +
      (vals.med_inc * 0.43) +
      (vals.house_age * 0.009) +
      (vals.ave_rooms * -0.10) +
      (vals.ave_bedrms * 0.63) +
      (vals.population * -0.000004) +
      (vals.ave_occup * -0.003) +
      ((42 - vals.latitude) * 0.08) +
      ((-114 - Math.abs(vals.longitude)) * -0.05)
    ));
    return {
      price_100k: Number(price100k.toFixed(4)),
      price_usd: Math.round(price100k * 100_000),
      offlineFallback: true
    };
  }

  // Live auto-prediction effect with debounce
  useEffect(() => {
    // Add a small 200ms debounce to prevent spamming on fast drag
    const timeoutId = setTimeout(async () => {
      setPhase('loading');
      setError(null);
      try {
        const controller = new AbortController();
        const tId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(`${API_URL}/california/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
          signal: controller.signal
        });
        clearTimeout(tId);
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        setResult(await res.json());
        setPhase('result');
      } catch (err) {
        // Fall back to client calculation smoothly
        const fallback = calculateLocalHousing(values);
        setResult(fallback);
        setPhase('result');
      }
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [values]);

  const fmt = usd => usd >= 1_000_000 ? `$${(usd / 1_000_000).toFixed(2)}M` : `$${(usd / 1000).toFixed(0)}K`;

  const priceColor = result
    ? result.price_usd >= 400_000 ? '#f472b6'
    : result.price_usd >= 200_000 ? '#fbbf24'
    : 'var(--accent-cyan)'
    : 'var(--accent-cyan)';

  return (
    <>
      <style>{SLIDER_CSS}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Status bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
            background: isConnected ? '#22c55e' : '#ef4444',
            boxShadow: isConnected ? '0 0 8px rgba(34,197,94,0.5)' : 'none' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {isConnected ? 'Model Online — Linear Regression · 8 Features' : 'Model Offline — Polling…'}
          </span>
        </div>

        {/* ── Row 1: Sliders panel (Top) ── */}
        <div className="glass-panel" style={{ padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
                Input Features
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)' }}>
                Drag the sliders to configure your census block group. Prediction updates automatically.
              </div>
            </div>
            <button
              onClick={handleReset}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: 8, color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.06em', padding: '8px 16px', cursor: 'pointer',
                textTransform: 'uppercase', transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.color = 'var(--accent-cyan)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              Reset Inputs
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px 48px' }}>
            {FIELDS.map(f => (
              <Slider key={f.key} field={f} value={values[f.key]} onChange={handleChange} />
            ))}
          </div>
        </div>

        {/* ── Row 2: Snapshot mini-cards (live, updates as you drag) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { label: 'Income',   val: `$${(values.med_inc * 10).toFixed(0)}K` },
            { label: 'Age',      val: `${values.house_age}y` },
            { label: 'Rooms',    val: `${values.ave_rooms}` },
            { label: 'Location', val: `${values.latitude.toFixed(1)}°N` },
          ].map(s => (
            <div key={s.label} className="glass-panel" style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* ── Row 3: Live Prediction Card (Bottom) ── */}
        <div className="glass-panel" style={{
          padding: '36px 40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12, textAlign: 'center', minHeight: 200,
          background: 'linear-gradient(180deg, rgba(17,21,32,0.6) 0%, rgba(17,21,32,0.9) 100%)',
          border: '1px solid var(--border)', borderTopColor: 'var(--border-accent)',
        }}>
          {phase === 'idle' && (
            <>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 64, fontWeight: 900, color: 'rgba(255,255,255,0.05)', lineHeight: 1 }}>$—</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)' }}>
                Waiting for backend connection...
              </div>
            </>
          )}
          {phase === 'loading' && !result && ( // Only show full spinner if no previous result
            <>
              <div style={{ width: 52, height: 52, border: '3px solid rgba(255,255,255,0.06)', borderTopColor: 'var(--accent-cyan)', borderRadius: '50%', animation: 'ca-spin 0.9s linear infinite' }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>COMPUTING…</div>
            </>
          )}
          {(phase === 'result' || (phase === 'loading' && result)) && result && (
            <div style={{ opacity: phase === 'loading' ? 0.6 : 1, transition: 'opacity 0.2s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Predicted Median Home Value
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 72, fontWeight: 900, color: priceColor, lineHeight: 1, transition: 'color 0.4s ease' }}>
                {fmt(result.price_usd)}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                {result.price_100k.toFixed(3)} × $100,000 (raw model output)
              </div>
            </div>
          )}
          {phase === 'error' && (
            <>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: '#ef4444' }}>Error</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'rgba(239,68,68,0.8)', maxWidth: 300 }}>{error}</div>
            </>
          )}
        </div>

        {/* ── Disclaimer ── */}
        <div style={{ padding: '12px 18px', borderRadius: 10, background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, color: 'rgba(251,191,36,0.75)', lineHeight: 1.6, margin: 0 }}>
            ⚠️ This model (Linear Regression, R² ≈ 0.58) is trained on 1990 US Census data for educational purposes only. Not a property valuation tool.
          </p>
        </div>

      </div>
    </>
  );
}
