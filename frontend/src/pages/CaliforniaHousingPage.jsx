import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Database,
  GitMerge,
  BarChart2,
  Lightbulb,
  TrendingUp,
  Activity,
  Target,
} from 'lucide-react';

export default function CaliforniaHousingPage() {
  const [visible, setVisible] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setVisible(true), 60);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', handleResize); };
  }, []);

  // ─── Pipeline ─────────────────────────────────────────────
  const pipelineNodes = [
    { Icon: Database, step: 'DATA', title: 'Load & Clean', desc: '20,640 Census records loaded. Missing total_bedrooms values imputed with column median.' },
    { Icon: GitMerge, step: 'FEATURES', title: 'Feature Selection', desc: 'Tested 1-feature vs 3-feature models to measure the effect on prediction error.' },
    { Icon: BarChart2, step: 'MODELING', title: 'Linear Regression', desc: 'Trained OLS regression across 80/20, 70/30 and 60/40 splits using scikit-learn.' },
    { Icon: Lightbulb, step: 'EVALUATION', title: 'Metric Analysis', desc: 'Manually verified MSE, RMSE, MAE and R² via NumPy, then stress-tested with injected outliers.' },
  ];

  // ─── Insight Tabs ─────────────────────────────────────────
  const insights = [
    {
      icon: <TrendingUp size={22} />,
      label: 'Feature Impact',
      stat: '+10.7%',
      statLabel: 'R² gain with 3 features',
      color: 'var(--accent-cyan)',
      desc: 'Adding housing_median_age and total_rooms alongside median_income raised R² from 0.46 to 0.51 — a 10.7% lift in explained variance with no additional preprocessing.',
    },
    {
      icon: <Target size={22} />,
      label: 'Best Split',
      stat: '80/20',
      statLabel: 'lowest test RMSE',
      color: '#a78bfa',
      desc: 'The 80/20 split produced the lowest Test RMSE of 79,800 USD. Reducing training data to 70% and 60% gradually increased error, confirming more training data improves regression boundary generalizability.',
    },
    {
      icon: <Activity size={22} />,
      label: 'MSE Sensitivity',
      stat: '11.84%',
      statLabel: 'MSE rise from 3 outliers',
      color: '#f472b6',
      desc: "Injecting just 3 artificial errors of +$1,000,000 caused MSE to jump 11.84%, RMSE by 5.76%, but MAE by only 1.22%. This proves MSE's exponential penalty on large deviations vs MAE's linear robustness.",
    },
  ];

  // ─── Tables ───────────────────────────────────────────────
  const featureTable = [
    { model: 'Model A — median_income only', mse: '7,005,960,672', rmse: '83,701.62', mae: '62,625.93', r2: '0.4589', highlight: false },
    { model: 'Model B — 3 features  ✓', mse: '6,368,095,508', rmse: '79,800.35', mae: '59,510.42', r2: '0.5081', highlight: true },
  ];
  const splitTable = [
    { split: '80 / 20  ✓', trainRmse: '80,828.61', testRmse: '79,800.35', testR2: '0.5081', highlight: true },
    { split: '70 / 30', trainRmse: '80,632.74', testRmse: '80,248.88', testR2: '0.5090', highlight: false },
    { split: '60 / 40', trainRmse: '80,432.17', testRmse: '80,683.47', testR2: '0.5082', highlight: false },
  ];
  const outlierTable = [
    { metric: 'MSE', original: '6,368,095,508', after: '7,122,350,919', pct: '+11.84%', verdict: 'Most sensitive to outliers', color: '#f472b6' },
    { metric: 'RMSE', original: '79,800.35', after: '84,394.02', pct: '+5.76%', verdict: 'Moderate sensitivity', color: '#f472b6' },
    { metric: 'MAE  ✓', original: '59,510.42', after: '60,237.10', pct: '+1.22%', verdict: 'Most robust — linear scaling', color: 'var(--accent-cyan)' },
  ];

  const techStack = [
    { name: 'Python', role: 'Core scripting and ML pipeline' },
    { name: 'Pandas', role: 'Data ingestion and missing value imputation' },
    { name: 'NumPy', role: 'Manual metric calculation and outlier injection' },
    { name: 'Scikit-learn', role: 'LinearRegression model and train/test splits' },
    { name: 'Matplotlib', role: 'Visualising prediction vs actual distributions' },
    { name: 'Seaborn', role: 'Heatmaps and correlation analysis' },
  ];

  const thStyles = {
    padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase',
    textAlign: 'left', borderBottom: '1px solid var(--border-accent)', whiteSpace: 'nowrap',
  };
  const td = (highlight, color) => ({
    padding: '12px 16px', fontFamily: 'var(--font-sans)', fontSize: 14,
    color: color || (highlight ? 'var(--accent-cyan)' : 'var(--text-secondary)'),
    borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle',
  });

  return (
    <div
      className="project-page"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >

      {/* ═══════════════════════════════════════════════
          CHAPTER 01 — HERO
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" style={{ paddingTop: 160 }}>
        <div className="section-container">
          <nav style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: isMobile ? 28 : 48 }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
            <Link to="/projects" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Projects</Link>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>CALIFORNIA HOUSING</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start md:items-center w-full overflow-hidden min-w-0">
            {/* Left */}
            <div className="mb-10 md:mb-0">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                <span className="tag-pill-v2 tag-pill-v2--purple">AI/ML</span>
                <span className="tag-pill-v2">PYTHON</span>
                <span className="tag-pill-v2">LINEAR REGRESSION</span>
                <span className="tag-pill-v2">SCIKIT-LEARN</span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, lineHeight: 1.05, margin: '0 0 24px' }} className="text-5xl md:text-7xl">
                <span style={{ color: 'var(--text-primary)' }}>California</span>
                <br />
                <span style={{ color: 'var(--text-primary)' }}>Housing</span>
                <span style={{ color: 'var(--accent-cyan)' }}>_</span>
              </h1>

              <p style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? 15 : 17, lineHeight: 1.7, color: 'var(--text-secondary)', maxWidth: 480, marginBottom: 36 }}>
                Ran 3 controlled experiments on the California Housing Dataset — comparing feature complexity, split ratios, and metric robustness — to find the optimal regression configuration for price prediction.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                {/* Primary CTA */}
                <a
                  id="cta-results"
                  href="#results"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent-cyan) 12%, transparent), color-mix(in srgb, var(--accent-blue) 10%, transparent))',
                    border: '1px solid var(--border-accent)',
                    borderRadius: 10, color: 'var(--accent-cyan)',
                    fontFamily: 'var(--font-mono)', fontSize: isMobile ? 12 : 13, fontWeight: 700,
                    letterSpacing: '0.06em', padding: isMobile ? '11px 20px' : '13px 28px', textDecoration: 'none',
                    textTransform: 'uppercase',
                    transition: 'all 0.25s ease',
                    flex: isMobile ? 1 : undefined,
                    justifyContent: isMobile ? 'center' : undefined,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'color-mix(in srgb, var(--accent-cyan) 18%, transparent)';
                    e.currentTarget.style.boxShadow = '0 0 24px color-mix(in srgb, var(--accent-cyan) 30%, transparent)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, color-mix(in srgb, var(--accent-cyan) 12%, transparent), color-mix(in srgb, var(--accent-blue) 10%, transparent))';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  See Results ↓
                </a>
                {/* Secondary CTA */}
                <a
                  id="cta-source"
                  href="https://github.com/harrsh-here/aiml-crash-harrsh/tree/main/linear_regression"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'transparent', border: '1px solid var(--border)',
                    borderRadius: 10, color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)', fontSize: isMobile ? 12 : 13, fontWeight: 600,
                    letterSpacing: '0.06em', padding: isMobile ? '11px 20px' : '13px 28px', textDecoration: 'none',
                    textTransform: 'uppercase', transition: 'all 0.25s ease',
                    flex: isMobile ? 1 : undefined,
                    justifyContent: isMobile ? 'center' : undefined,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                    e.currentTarget.style.color = 'var(--accent-cyan)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  View Notebook <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Right — Stats */}
            <div style={{ position: 'relative' }}>
              <div className="chapter-marker">01</div>
              <div style={{ marginBottom: 32 }}>
                <div className="status-badge" style={{ color: '#a78bfa', border: '1px solid rgba(167,139,250,0.15)', background: 'rgba(167,139,250,0.04)' }}>
                  <span className="status-badge__dot" />
                  ML PROJECT — 3 EXPERIMENTS
                </div>
              </div>
              <div className="grid grid-cols-2 md:flex md:flex-col gap-x-4 gap-y-8 md:gap-y-5">
                <div className="stat-counter">
                  <div className="stat-counter__value">20,640</div>
                  <div className="stat-counter__label">CENSUS RECORDS</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">0.51</div>
                  <div className="stat-counter__label">BEST R² ACHIEVED</div>
                </div>
                <div className="stat-counter">
                  <div className="stat-counter__value">$79.8K</div>
                  <div className="stat-counter__label">BEST TEST RMSE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 02 — KEY FINDINGS
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="insights">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            02 // Key Findings
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 48 }}>
            Top 3 Takeaways
          </h2>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {insights.map((ins, i) => (
              <button
                key={i}
                onClick={() => setActiveInsight(i)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: isMobile ? '8px 12px' : '10px 20px', borderRadius: 8,
                  fontFamily: 'var(--font-mono)', fontSize: isMobile ? 10 : 12, fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                  border: activeInsight === i ? `1px solid ${ins.color}` : '1px solid var(--border)',
                  background: activeInsight === i ? `color-mix(in srgb, ${ins.color} 12%, transparent)` : 'transparent',
                  color: activeInsight === i ? ins.color : 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                }}
              >
                {ins.icon}
                {ins.label}
              </button>
            ))}
          </div>

          <div className="glass-panel" style={{ padding: isMobile ? '24px 20px' : '40px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 20 : 48, alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap' }}>
            <div style={{ textAlign: isMobile ? 'left' : 'center', minWidth: isMobile ? 'unset' : 140 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 48 : 64, fontWeight: 900, color: insights[activeInsight].color, lineHeight: 1 }}>
                {insights[activeInsight].stat}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em', marginTop: 8, textTransform: 'uppercase' }}>
                {insights[activeInsight].statLabel}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: isMobile ? 'unset' : 260 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? 16 : 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
                {insights[activeInsight].label}
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: isMobile ? 14 : 16, lineHeight: 1.75, color: 'var(--text-secondary)' }}>
                {insights[activeInsight].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 04 — RESULTS TABLES
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="results">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            03 // Results
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 48 }}>
            Full Metric Breakdown
          </h2>

          {/* Feature */}
          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Experiment 1 — Feature Count (80/20 split)
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Does adding more features reduce prediction error?</p>
            <div className="glass-panel" style={{ overflowX: 'auto', padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
                <thead><tr>
                  <th style={thStyles}>Model</th><th style={thStyles}>MSE</th>
                  <th style={thStyles}>RMSE</th><th style={thStyles}>MAE</th><th style={thStyles}>R²</th>
                </tr></thead>
                <tbody>
                  {featureTable.map((row, i) => (
                    <tr key={i} style={{ background: row.highlight ? 'color-mix(in srgb, var(--accent-cyan) 4%, transparent)' : 'transparent' }}>
                      <td style={{ ...td(row.highlight), fontWeight: row.highlight ? 700 : 400 }}>{row.model}</td>
                      <td style={td(false)}>{row.mse}</td><td style={td(false)}>{row.rmse}</td>
                      <td style={td(false)}>{row.mae}</td><td style={td(row.highlight)}>{row.r2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Split */}
          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Experiment 2 — Split Ratio (Model B)
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Which data partition gives the most stable test performance?</p>
            <div className="glass-panel" style={{ overflowX: 'auto', padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 420 }}>
                <thead><tr>
                  <th style={thStyles}>Split</th><th style={thStyles}>Train RMSE</th>
                  <th style={thStyles}>Test RMSE</th><th style={thStyles}>Test R²</th>
                </tr></thead>
                <tbody>
                  {splitTable.map((row, i) => (
                    <tr key={i} style={{ background: row.highlight ? 'color-mix(in srgb, var(--accent-cyan) 4%, transparent)' : 'transparent' }}>
                      <td style={{ ...td(row.highlight), fontWeight: row.highlight ? 700 : 400 }}>{row.split}</td>
                      <td style={td(false)}>{row.trainRmse}</td>
                      <td style={td(row.highlight)}>{row.testRmse}</td>
                      <td style={td(false)}>{row.testR2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outlier */}
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
              Experiment 3 — Outlier Sensitivity (3 injected errors of +$1,000,000)
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Which metric is most vulnerable to large one-off errors?</p>
            <div className="glass-panel" style={{ overflowX: 'auto', padding: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                <thead><tr>
                  <th style={thStyles}>Metric</th><th style={thStyles}>Original</th>
                  <th style={thStyles}>After Outliers</th><th style={thStyles}>% Increase</th><th style={thStyles}>Verdict</th>
                </tr></thead>
                <tbody>
                  {outlierTable.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ ...td(false), fontWeight: 700, color: 'var(--text-primary)' }}>{row.metric}</td>
                      <td style={td(false)}>{row.original}</td>
                      <td style={td(false)}>{row.after}</td>
                      <td style={{ ...td(false), color: row.color, fontWeight: 700 }}>{row.pct}</td>
                      <td style={{ ...td(false), fontSize: 12, fontStyle: 'italic' }}>{row.verdict}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 05 — PIPELINE
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="pipeline">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            04 // Pipeline
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 48 }}>
            End-to-End Workflow
          </h2>

          <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-0 lg:overflow-x-auto pb-2 pt-5">
            {pipelineNodes.map((node, i) => (
              <div key={node.step} className="flex flex-col lg:flex-row lg:items-center flex-1 min-w-[160px]">
                <div
                  className="glass-panel"
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    flex: 1, padding: '20px 20px 24px',
                    display: 'flex', flexDirection: 'column', gap: 10,
                    position: 'relative', width: '100%',
                    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                    boxShadow: hoveredNode === i ? '0 0 24px color-mix(in srgb, var(--accent-cyan) 18%, transparent)' : 'none',
                    borderColor: hoveredNode === i ? 'var(--accent-cyan)' : 'var(--border-accent)',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 16, right: 20,
                    fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 800,
                    color: 'var(--accent-cyan)',
                    opacity: hoveredNode === i ? 0.4 : 0.15,
                    lineHeight: 1, transition: 'opacity 0.3s ease',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: hoveredNode === i
                      ? 'color-mix(in srgb, var(--accent-cyan) 20%, transparent)'
                      : 'color-mix(in srgb, var(--accent-cyan) 10%, transparent)',
                    border: '1px solid var(--border-accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-cyan)',
                    transition: 'background 0.3s ease',
                  }}>
                    <node.Icon size={20} />
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                      {node.step}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                      {node.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {node.desc}
                    </div>
                  </div>
                </div>

                {i < pipelineNodes.length - 1 && (
                  <div className="flex justify-center items-center py-4 lg:py-0 lg:px-3 text-[var(--accent-cyan)] opacity-60">
                    <svg width="32" height="16" viewBox="0 0 32 16" fill="none" className="rotate-90 lg:rotate-0">
                      <line x1="0" y1="8" x2="23" y2="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                      <polygon points="23,4 32,8 23,12" fill="currentColor" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 06 — TECH STACK
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section" id="stack">
        <div className="section-container">
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
            05 // Stack
          </div>
          <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 40 }}>
            Built With
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {techStack.map(item => (
              <div className="tech-card" key={item.name}>
                <div className="tech-card__name">{item.name}</div>
                <div className="tech-card__role">{item.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CHAPTER 07 — NAVIGATION
      ═══════════════════════════════════════════════ */}
      <section className="chapter-section">
        <div className="section-container">
          <nav className="project-nav">
            <Link to="/projects" className="project-nav__link" id="nav-back">
              <ArrowLeft size={16} /> Back to Projects
            </Link>
            <a
              href="https://github.com/harrsh-here/aiml-crash-harrsh/tree/main/linear_regression"
              target="_blank"
              rel="noopener noreferrer"
              className="project-nav__link"
              id="nav-source-ca"
            >
              <ExternalLink size={16} /> Jupyter Notebook <ExternalLink size={12} />
            </a>
            <Link to="/projects/movie-recommender" className="project-nav__link" id="nav-next-ca">
              Next Project <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
}
