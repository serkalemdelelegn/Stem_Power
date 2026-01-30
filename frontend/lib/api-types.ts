// Comprehensive types for all content sections

// About Section
export interface StemCenter {
  id: string
  name: string
  location: string
  description: string
  image: string
  contactEmail?: string
  contactPhone?: string
}

// STEM Operations - STEM Centers
export interface StemOperationsCenter {
  id: string
  host: string
  city: string
  region: string
  country: string
  cluster: string
  contact: string
  phone: string
  email: string
  website: string
  labs: string[]
  funder: string
  yearEstablished: string
  featured?: boolean
  imageQuery?: string
  featuredBadge?: string
}

export interface STEMPowerMember {
  id: string
  name: string
  title: string
  bio: string
  image: string
  email?: string
}

// Home Section
export interface HeroSection {
  id: string
  title: string
  description: string
  image: string
  badge?: string
  ctaText?: string
  ctaLink?: string
}

export interface GalleryItem {
  id: string
  title: string
  image: string
  description: string
  category: string
  date?: string
}

export interface ImpactStat {
  id: string
  value: string
  label: string
  icon: string
}

export interface Partner {
  id: string
  name: string
  logo: string
  website?: string
  description?: string
}

// Contact & Footer
export interface ContactInfo {
  id: string
  email: string
  phone: string
  mobile?: string
  address: string
  addressDetails?: string
  website?: string
  officeHours?: string
  mapLink?: string
  mapLocation?: string
}

export interface FooterLink {
  id: string
  label: string
  url: string
  category: string
}

export interface HeaderLink {
  id: string
  label: string
  url: string
  order: number
  children?: HeaderLink[]
}

// Latest Section
export interface AnnouncementsHero {
  badge: string
  title: string
  description: string
  statistics: {
    activeAnnouncements: string
    openOpportunities: string
    upcomingEvents: string
  }
}

export interface Announcement {
  id: string
  title: string
  category: string
  type: "update" | "opportunity" | "event"
  date: string
  location: string
  priority?: "high" | "medium" | "low"
  excerpt: string
  content: string
  image: string
  deadline?: string
  link?: string
  googleFormUrl?: string
  eventId?: string
  featured?: boolean
}

export interface EventsHeroStat {
  id: string
  icon: string
  value: string
  label: string
}

export interface EventsHero {
  badge: string
  title: string
  description: string
  image?: string
  statistics: EventsHeroStat[]
}

export type EventStatus = "upcoming" | "past"

export interface Event {
  id: string
  title: string
  badge?: string
  description: string
  fullDescription?: string
  image?: string
  gallery?: string[]
  date: string
  endDate?: string
  time: string
  location: string
  category: string
  participants?: string
  status: EventStatus
  featured?: boolean
  registrationLink?: string
  registrationDeadline?: string
  highlights?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Newsletter {
  id: string
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
  readTime?: string
  pdfUrl?: string
  featured?: boolean
  badge?: string
  author?: string
  topic?: string
  source?: string
  content?: string
  publication?: string
  publicationType?: string
  quote?: string
}

export interface NewsletterHero {
  badge: string
  title: string
  description: string
  statistics: {
    subscribers: string
    newsletters: string
    monthlyReaders: string
  }
}

export interface SocialMediaPost {
  id: string
  platform: string
  content: string
  date: string
  link: string
  image?: string
  likes?: number
  comments?: number
  shares?: number
}

export interface SocialMediaHero {
  badge: string
  title: string
  description: string
  statistics: {
    stat1Value: string
    stat1Label: string
    stat2Value: string
    stat2Label: string
    stat3Value: string
    stat3Label: string
  }
}

// Location
export interface Location {
  id: string
  name: string
  host: string
  city: string
  country: string
  latitude: number
  longitude: number
  mapLink?: string
}

// Pages
export interface Page {
  id: string
  slug: string
  title: string
  content: string
  image?: string
  publishedAt: string
}

// Programs
export interface BusinessDevelopment {
  id: string
  name: string
  licenseStatus: string
  category: string
  categoryColor?: string
  description: string
  contactPerson: string
  phone: string
  email?: string
  image?: string
}

export interface BusinessDevelopmentHero {
  id: string
  badge: string
  title: string
  description: string
  image?: string
}

export interface BusinessDevelopmentStat {
  id: string
  icon: string
  value: string
  label: string
}

export interface BusinessDevelopmentPartner {
  id: string
  image: string
  title: string
  contribution: string
  contributionDescription: string
  focusArea: string
  partnerSince: string
  peopleImpacted: string
}

export interface IncubationHero {
  id: string
  title: string
  description: string
}

export interface IncubationStat {
  id: string
  icon: string
  value: string
  label: string
}

export interface IncubationPhase {
  id: string
  title: string
  duration: string
  badge: string
  description: string
  icon: string
  iconColor: string
  order: number
}

export interface IncubationSuccessStory {
  id: string
  name: string
  licenseStatus: string
  category: string
  categoryColor: string
  contactPerson: string
  phone: string
  email?: string
  image?: string
}

export interface DigitalSkillsHero {
  id: string
  title: string
  description: string
}

export interface DigitalSkillsStat {
  id: string
  icon: string
  value: string
  label: string
}

export interface DigitalSkillsProgram {
  id: string
  title: string
  description: string
  duration: string
  level: string
  skills: string[]
  image?: string
  icon?: string
  iconColor?: string
  projectCount?: string
}

export interface SoftSkillsHero {
  id: string
  title: string
  description: string
}

export interface SoftSkillsStat {
  id: string
  icon: string
  value: string
  label: string
}

export interface SoftSkillsProgram {
  id: string
  title: string
  description: string
  duration: string
  level: string
  topics: string[]
  skills?: string[]
  image?: string
  icon?: string
  iconColor?: string
  projectCount?: string
}

// FabLab
export interface MakerSpaceItem {
  id: string
  name: string
  description: string
  image: string
  category: string
}

export interface Equipment {
  id: string
  name: string
  image: string
  description: string
  specs: Array<{ label: string; value: string }>
  capabilities: string[]
  applications: string[]
}

export interface FabLabProduct {
  id: string
  name: string
  category: string
  subcategory?: string
  price: string
  image: string
  description: string
  overview?: string
  features?: string[]
  keyFeatures?: string[]
  whatsIncluded?: string[]
  applications?: string[]
  availability: string
  slug?: string
}

export interface FabLabService {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export interface FabLabServiceStat {
  id: string
  number: string
  title: string
}

export interface FabLabMachinery {
  id: string
  title: string
  description: string
  keyFeatures: string[]
  commonApplications: string[]
  precision: string
  power: string
  area: string
  image: string
}
export interface TrainingConsultancyStat {
  id: string
  icon: string
  value: string
  label: string
}

export interface TrainingConsultancyOffering {
  id: string
  title: string
  description: string
  image?: string
  features: string[]
  outcomes: string[]
}

export interface TrainingConsultancyPartner {
  id: string
  name: string
  logo: string
}

export interface TrainingConsultancyPartnersSection {
  title: string
  description: string
}

export interface FabLabHero {
  section: string
  badge: string
  title: string
  description: string
  image?: string
  updatedAt?: string
}

// FabLab Maker Space sections
export interface MakerSpaceStat {
  id: string
  icon: string
  number: string
  label: string
}

export interface MakerSpaceGalleryImage {
  id: string
  image: string
  caption?: string
}

export interface MakerSpaceWorkshop {
  id: string
  date: string
  title: string
  level: string
  duration: string
  location: string
  description: string
  image: string
  registrationLink: string
}

// STEM Operations
export interface ScienceFair {
  id: string
  title: string
  date: string
  location: string
  description: string
  image: string
  participantCount?: number
}

export interface ScienceFairHero {
  id: string
  badge: string
  title: string
  subtitle: string
}

export interface ScienceFairStat {
  id: string
  icon: string
  number: string
  label: string
}

export interface ScienceFairJourneyStage {
  id: string
  icon: string
  badge: string
  title: string
  number: string
  description: string
}

export interface ScienceFairWinnerProject {
  id: string
  placement: string
  placementBadge: string
  projectTitle: string
  studentName: string
  university: string
  description: string
  image: string
}

export interface WhoWeAre {
  badge: string
  title: string
  description: string
  image: string
}

export interface StemCenterData {
  id?: string
  badge: string
  title: string
  description: string
  image: string
  statistic: string
  mission: string
  vision: string
  values: Array<{ id: string; title: string; description: string }>
  testimonials: Array<{ id: string; name: string; role: string; message: string; image: string }>
  whoWeAre: WhoWeAre
}

export interface UniversityOutreach {
  id: string
  universityName: string
  programName: string
  description: string
  image: string
  contactEmail?: string
  startDate?: string
}

export interface STEMTv {
  id: string
  title: string
  videoUrl: string
  description: string
  thumbnail: string
  date: string
}
