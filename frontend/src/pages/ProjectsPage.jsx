import MatrixText from '../components/MatrixText'
import { useState, useEffect } from 'react'
import { projects } from '../data/projects'
import ProjectCard from '../components/ProjectCard'

const allTags = ['All', 'AI/ML', 'Web', 'Python', 'In Progress']

export default function ProjectsPage() {
  const [activeTag, setActiveTag] = useState('All')
  const [visible, setVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => setVisible(true), 100)
  }, [])

  const handleTagChange = (tag) => {
    if (tag === activeTag) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveTag(tag)
      setIsTransitioning(false)
    }, 400)
  }

  const filteredProjects =
    activeTag === 'All'
      ? projects
      : projects.filter((p) => p.tags.some((t) => t === activeTag) || p.status === activeTag)

  return (
    <div style={{ paddingTop: '121px', borderTop: 'none' }}>
      <div className="section-container" style={{ paddingBottom: '100px' }}>
        <div style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 500ms ease, transform 500ms ease',
        }}>
          <p className="section-label">projects/</p>
          <h1 className="section-title" style={{ marginBottom: '16px' }}><MatrixText text="Projects" /></h1>
          <p className="text-base"
            style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', marginBottom: '39px' }}>
            Things I've shipped, learned from, and broken a few times.
          </p>
        </div>

        {/* Centered Filter bar */}
        <div className="flex justify-center mb-10 w-full overflow-x-auto no-scrollbar">
          <div className="rounded-xl p-3 md:p-5"
            style={{
              display: 'inline-flex',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '3px solid rgba(255,255,255,0.05)',
              padding: '11px 80px', /* Adjust this to make the bar wider or narrower! */
              marginBottom: '47px',
              opacity: visible ? 1 : 0,
              transition: 'opacity 500ms ease 200ms',
            }}>
            <div className="flex flex-nowrap md:flex-wrap justify-center gap-3 md:gap-8 min-w-max">
              {allTags.map((tag) => (
                <button key={tag} onClick={() => handleTagChange(tag)}
                  className="rounded-3xl text-sm font-medium transition-all duration-200"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    padding: '12px 25px',
                    backgroundColor: activeTag === tag ? 'var(--accent-cyan)' : 'transparent',
                    color: activeTag === tag ? '#0a0a0a' : 'var(--text-secondary)',
                    border: `1px solid ${activeTag === tag ? 'var(--accent-cyan)' : 'transparent'}`,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (activeTag !== tag) {
                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTag !== tag) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }
                  }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          opacity: isTransitioning ? 0 : (visible ? 1 : 0),
          transform: isTransitioning ? 'translateY(20px)' : (visible ? 'translateY(0)' : 'translateY(20px)'),
          transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} style={{ display: 'flex', flexDirection: 'column', padding: '5px', marginBottom: '10px' }}>
                <ProjectCard project={project} featured={project.featured} style={{ minHeight: '340px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
