import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { EnhancedImpactDashboard } from "@/components/enhanced-impact-dashboard"
import { ProgramsShowcase } from "@/components/programs-showcase"
import { LatestNews } from "@/components/latest-news"
import { PartnersShowcase } from "@/components/partners-showcase"
import { StudentGallery } from "@/components/student-gallery"
import { UpcomingEvents } from "@/components/upcoming-events"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <EnhancedImpactDashboard />
        <ProgramsShowcase />
        <StudentGallery />
        <LatestNews />
        <UpcomingEvents />
        <PartnersShowcase />
      </main>
      <Footer />
    </div>
  )
}
