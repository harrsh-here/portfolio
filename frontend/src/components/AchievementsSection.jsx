import MatrixText from './MatrixText'
import { useRef, useEffect } from 'react'

const achievements = [
  { num: '01', title: 'D3CODE Hackathon', desc: 'Top 10 out of 30,000 teams — competitive coding at national scale.', tag: 'Competitive' },
  { num: '02', title: 'Python Gold — HackerRank', desc: '5-star Gold badge with 435+ points on the HackerRank platform.', tag: 'Python' },
  { num: '03', title: 'SQL Silver — HackerRank', desc: '3-star Silver badge with 305+ points in SQL problem solving.', tag: 'SQL' },
  { num: '04', title: 'Java Bronze — HackerRank', desc: 'Bronze level achievement with 50+ points in Java challenges.', tag: 'Java' },
  { num: '05', title: 'Google Cloud Skill Badge', desc: 'Compute foundations badge issued by Google — October 2025.', tag: 'Cloud' },
  { num: '06', title: 'NPTEL — DBMS (Elite)', desc: 'Elite grade in 8-week DBMS course from IIT Kharagpur via NPTEL.', tag: 'Databases' },
  { num: '07', title: 'Google Student Ambassador', desc: 'Completed the Google Student Ambassador program — February 2026.', tag: 'Leadership' },
  { num: '08', title: 'NPTEL — Joy of Computing using Python', desc: 'Elite Certification from IIT Madras with an overall score of 93%.', tag: 'Python' },
  { num: '09', title: 'NPTEL — Problem Solving in C', desc: 'Completed the Problem Solving Through Programming in C course from IIT Kharagpur.', tag: 'C' },
]

export default function AchievementsSection() {
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
    <section id="achievements" ref={sectionRef} className="section-reveal">
      <div className="section-container">
        <div>
          <p className="section-label">achievements.sh</p>
          <h2 className="section-title"><MatrixText text="Achievements" /></h2>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {achievements.map((a) => (
            <div key={a.title} className="card-accent">
              {/* Numbered badge instead of emoji */}
              <div className="flex items-center gap-3 mb-4">
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '28px',
                  fontWeight: 800,
                  color: 'var(--accent-cyan)',
                  opacity: 0.3,
                  lineHeight: 1,
                }}>
                  {a.num}
                </span>
              </div>

              <h3 className="text-base font-semibold mb-3"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {a.title}
              </h3>

              <p className="text-sm"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {a.desc}
              </p>

              {/* Tag at bottom — below everything */}
              <span className="inline-block font-medium self-start"
                style={{
                  marginTop: '24px', /* Adjust this to push the label further below the text! */
                  padding: '6px 11px', /* Adjust this for height and width! */
                  borderRadius: '60px', /* Adjust this for corner rounding! */
                  fontSize: '12px',
                  backgroundColor: 'color-mix(in srgb, var(--accent-cyan) 8%, transparent)',
                  border: '1.5px solid color-mix(in srgb, var(--accent-cyan) 20%, transparent)', /* Adjust this for border width! */
                  color: 'var(--accent-cyan)',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '0.02em',
                }}>
                {a.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
