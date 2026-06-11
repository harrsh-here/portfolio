import MatrixText from './MatrixText'
import { Link } from 'react-router-dom'
import { useRef, useEffect } from 'react'

const tagStyle = {
  padding: '6px 12px',
  backgroundColor: 'var(--accent-glow)',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-accent)',
  fontFamily: 'var(--font-sans)',
  fontSize: '12px',
  borderRadius: '6px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
}

const cardStyle = {
  borderLeft: '4px solid var(--accent-cyan)',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  height: '100%',
}

const cardHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '12px',
  marginBottom: '12px',
}

const tagsWrapStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  flex: 1,
  maxHeight: '32px',
  overflow: 'hidden',
}

const badgeStyle = {
  fontSize: '11px',
  padding: '4px 12px',
  borderRadius: '999px',
  fontWeight: 600,
  backgroundColor: 'var(--accent-glow)',
  color: 'var(--accent-cyan)',
  fontFamily: 'var(--font-sans)',
  whiteSpace: 'nowrap',
  flexShrink: 0,
}

const titleStyle = {
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-primary)',
  fontSize: '20px',
  fontWeight: 700,
  marginBottom: '16px',
}

const descStyle = {
  fontFamily: 'var(--font-sans)',
  color: 'var(--text-secondary)',
  lineHeight: 1.7,
  fontSize: '14px',
  marginBottom: '24px',
  flex: 1,
}


const ghLinkStyle = {
  color: 'var(--text-secondary)',
  fontFamily: 'var(--font-sans)',
  fontSize: '14px',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
}

const actionsRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  marginTop: 'auto',
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '48px',
  alignItems: 'stretch',
}

export default function FeaturedProjects() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add('revealed')
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="featured-projects"
      ref={sectionRef}
      className="section-reveal"
    >
      <div className="section-container">

        <div>
          <p className="section-label">projects/</p>
          <h2 className="section-title" style={{ marginBottom: '16px' }}>
            <MatrixText text="Featured Work" />
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '16px' }}>
            A few things I've built.
          </p>
        </div>

        <div style={gridStyle}>

          <div className="card-accent" style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={tagsWrapStyle}>
                <span style={tagStyle}>Python</span>
                <span style={tagStyle}>Flask</span>
                <span style={tagStyle}>scikit-learn</span>
                <span style={tagStyle}>Logistic Regression</span>
              </div>
              <span style={badgeStyle}>FEATURED</span>
            </div>

            <h3 style={titleStyle}>Student Placement Predictor</h3>

            <p style={descStyle}>
              My first end-to-end ML project. Predicts placement likelihood from CGPA and IQ
              using Logistic Regression with a StandardScaler pipeline.
            </p>

            <div style={actionsRowStyle}>
              <div className="glow-border">
                <Link
                  to="/projects/student-placement-predictor"
                  className="glow-inner"
                  style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
                >
                  View Project &rarr;
                </Link>
              </div>
              <a
                href="https://github.com/harrsh-here/placement-predictor"
                target="_blank"
                rel="noopener noreferrer"
                style={ghLinkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-cyan)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                GitHub &#8599;
              </a>
            </div>
          </div>

          <div className="card-accent" style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div style={tagsWrapStyle}>
                <span style={tagStyle}>Python</span>
                <span style={tagStyle}>FastAPI</span>
                <span style={tagStyle}>scikit-learn</span>
                <span style={tagStyle}>KNN</span>
              </div>
              <span style={badgeStyle}>NEW</span>
            </div>

            <h3 style={titleStyle}>Movie Recommender System</h3>

            <p style={descStyle}>
              An intelligent recommendation engine using hybrid similarity metrics to suggest
              movies based on genre and popularity.
            </p>

            <div style={actionsRowStyle}>
              <div className="glow-border">
                <Link
                  to="/projects/movie-recommender"
                  className="glow-inner"
                  style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-sans)', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}
                >
                  View Project &rarr;
                </Link>
              </div>
              <a
                href="https://github.com/harrsh-here/-movie-recommender"
                target="_blank"
                rel="noopener noreferrer"
                style={ghLinkStyle}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-cyan)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                GitHub &#8599;
              </a>
            </div>
          </div>

        </div>

        <div style={{ marginTop: '30px', padding: '4px' }}>
          <div className="glow-border">
            <Link to="/projects" className="glow-inner"
              style={{
                color: 'var(--bg-primary)',
                background: 'var(--accent-cyan)',
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid transparent',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-card)';
                e.currentTarget.style.color = 'var(--accent-cyan)';
                e.currentTarget.style.border = '1px solid var(--border)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent-cyan)';
                e.currentTarget.style.color = 'var(--bg-primary)';
                e.currentTarget.style.border = '1px solid transparent';
              }}
            >
              See all projects &rarr;
            </Link>
          </div>
        </div>

      </div >
    </section >
  )
}