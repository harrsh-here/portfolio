import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink } from 'lucide-react'

export default function ProjectCard({ project, featured = false, style = {} }) {
  const statusColor =
    project.status === 'Live' ? '#28c840' :
    project.status === 'In Progress' ? '#fbbf24' : '#febc2e'

  const badgeColors = {
    'FEATURED':  { bg: 'var(--accent-glow)',            color: 'var(--accent-cyan)',  border: 'var(--border-accent)' },
    'FIRST ML':  { bg: 'rgba(251,191,36,0.08)',          color: '#fbbf24',             border: 'rgba(251,191,36,0.3)' },
    'FIRST BI':  { bg: 'rgba(167,139,250,0.08)',         color: '#a78bfa',             border: 'rgba(167,139,250,0.3)' },
    'STEALTH':   { bg: 'rgba(167,139,250,0.10)',         color: '#c4b5fd',             border: 'rgba(167,139,250,0.35)' },
  }
  const badge = project.badge || 'FEATURED'
  const badgeStyle = badgeColors[badge] || badgeColors['FEATURED']

  return (
    <div className="relative h-full w-full card-accent"
      style={{ ...style }}>
      {featured && (
        <span className="absolute top-5 right-5 text-xs rounded-full font-medium"
          style={{
            backgroundColor: badgeStyle.bg,
            color: badgeStyle.color,
            fontFamily: 'var(--font-mono)',
            fontSize: 10, letterSpacing: '0.08em',
            padding: '5px 14px',
            border: `1px solid ${badgeStyle.border}`,
          }}>
          {badge}
        </span>
      )}

      {/* Tags — single row, brighter */}
      <div className="flex flex-wrap mb-5" style={{ gap: '8px' }}>
        {project.tags.map((t) => (
          <span key={t} className="text-xs rounded-md font-medium"
            style={{
              padding: '5px 12px',
              backgroundColor: 'var(--accent-glow)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-accent)',
              fontFamily: 'var(--font-sans)',
            }}>
            {t}
          </span>
        ))}
      </div>

      <h3 className={`font-bold ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '20px', marginBottom: '29px' }}>
        {project.title}
      </h3>

      <p className={`leading-relaxed ${featured ? 'text-base' : 'text-sm line-clamp-3'}`}
        style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
        {project.description}
      </p>

      {/* Bottom Group */}
      <div style={{ marginTop: 'auto' }}>
        {/* Status */}
        <div className="flex items-center gap-2" style={{ marginBottom: '13px' }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
          <span className="text-xs font-medium" style={{ color: statusColor, fontFamily: 'var(--font-sans)' }}>
            {project.status} {project.status === 'Live' && '✓'}
          </span>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          {project.link && (
            <div className="glow-border">
              <Link to={project.link}
                className="glow-inner flex items-center gap-1.5 text-sm font-medium"
                style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-sans)' }}>
                View <ArrowRight size={14} />
              </Link>
            </div>
          )}
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm transition-colors duration-200"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-cyan)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}>
              GitHub <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
