import MatrixText from './MatrixText'
import { useState, useEffect, useRef } from 'react'

const skillGroups = [
  { name: 'Languages', skills: ['Python', 'Java', 'C', 'SQL'] },
  { name: 'Data & ML', skills: ['Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib', 'EDA', 'Logistic Regression'] },
  { name: 'Web & Backend', skills: ['Flask', 'HTML/CSS', 'REST APIs', 'Gunicorn'] },
  { name: 'Tools & Platforms', skills: ['Google Cloud', 'Salesforce', 'Git', 'Render', 'VS Code'] },
  { name: 'Creative', skills: ['Premiere Pro', 'After Effects', 'Visual Design', 'AI Prompting'] },
]

export default function SkillsSection() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          sectionRef.current.classList.add('revealed')
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" ref={sectionRef} className="section-reveal">
      <div className="section-container">
        <div style={{ marginBottom: '28px' }}>
          <p className="section-label">skills.json</p>
          <h2 className="section-title"><MatrixText text="Skills" /></h2>
        </div>

        {/* Aurora background wrapper */}
        <div className="skills-aurora-bg">
          <div className="flex flex-col" style={{ gap: '36px' }}>
            {skillGroups.map((group, gi) => (
              <div key={group.name}>
                <h3 className="text-sm font-semibold"
                  style={{
                    marginBottom: '8px', /* Adjust this value to increase/decrease the gap! */
                    fontFamily: 'var(--font-sans)', color: 'var(--accent-cyan)',
                    textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '12px',
                  }}>
                  {group.name}
                </h3>
                <div className="flex flex-wrap" style={{ gap: '10px' }}>
                  {group.skills.map((skill, si) => (
                    <span key={skill}
                      className="skill-pill"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                        transition: `opacity 500ms ease ${gi * 80 + si * 50}ms, transform 500ms ease ${gi * 80 + si * 50}ms, border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease`,
                      }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
