import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import SkillsSection from '../components/SkillsSection'
import ExperienceTimeline from '../components/ExperienceTimeline'
import EducationTimeline from '../components/EducationTimeline'
import AchievementsSection from '../components/AchievementsSection'
import FeaturedProjects from '../components/FeaturedProjects'
import ContactStrip from '../components/ContactStrip'
import SectionDivider from '../components/SectionDivider'
import SectionNavigator from '../components/SectionNavigator'

export default function HomePage() {
  return (
    <>
      <SectionNavigator />
      <HeroSection />
      <SectionDivider variant="cyan" />
      <AboutSection />
      <SectionDivider variant="default" />
      <SkillsSection />
      <SectionDivider variant="violet" />
      <ExperienceTimeline />
      <SectionDivider variant="default" />
      <EducationTimeline />
      <SectionDivider variant="mixed" />
      <AchievementsSection />
      <SectionDivider variant="cyan" />
      <FeaturedProjects />
      <ContactStrip />
    </>
  )
}
