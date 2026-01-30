// In-memory data store for all content sections
// In production, this would be replaced with a database

import type * as Types from "./api-types"

interface DataStore {
  about: {
    stemCenter: any | null
    members: any[]
  }
  contact: Types.ContactInfo
  footer: Types.FooterLink[]
  header: Types.HeaderLink[]
  home: {
    hero: Types.HeroSection | null
    gallery: Types.GalleryItem[]
    impact: Types.ImpactStat[]
    partners: Types.Partner[]
  }
  latest: {
    announcements: Types.Announcement[]
    announcementsHero: Types.AnnouncementsHero | null
    events: Types.Event[]
    eventsHero: Types.EventsHero | null
    newsletter: Types.Newsletter[]
    newsletterHero: Types.NewsletterHero | null
    socialMedia: Types.SocialMediaPost[]
    socialMediaHero: Types.SocialMediaHero | null
  }
  location: Types.Location[]
  pages: Types.Page[]
  programs: {
    entrepreneurship: {
      businessDevelopment: Types.BusinessDevelopment[]
      businessDevelopmentHero: Types.BusinessDevelopmentHero | null
      businessDevelopmentStats: Types.BusinessDevelopmentStat[]
      businessDevelopmentPartners: Types.BusinessDevelopmentPartner[]
      incubation: Types.IncubationPhase[]
      incubationHero: Types.IncubationHero | null
      incubationStats: Types.IncubationStat[]
      incubationSuccessStories: Types.IncubationSuccessStory[]
      digitalSkills: Types.DigitalSkillsProgram[]
      digitalSkillsHero: Types.DigitalSkillsHero | null
      digitalSkillsStats: Types.DigitalSkillsStat[]
      softSkills: Types.SoftSkillsProgram[]
      softSkillsHero: Types.SoftSkillsHero | null
      softSkillsStats: Types.SoftSkillsStat[]
    }
    fablab: {
      makerSpace: Types.MakerSpaceItem[]
      makerSpaceStats: Types.MakerSpaceStat[]
      makerSpaceGallery: Types.MakerSpaceGalleryImage[]
      makerSpaceWorkshops: Types.MakerSpaceWorkshop[]
      products: Types.FabLabProduct[]
      productsStats: Types.FabLabServiceStat[]
      services: Types.FabLabService[]
      servicesStats: Types.FabLabServiceStat[]
      servicesMachineries: Types.FabLabMachinery[]
      trainingConsultancy: {
        stats: Types.TrainingConsultancyStat[]
        offerings: Types.TrainingConsultancyOffering[]
        partners: Types.TrainingConsultancyPartner[]
        partnersSection: Types.TrainingConsultancyPartnersSection
      }
      hero: Record<string, Types.FabLabHero>
    }
    stemOperations: {
      scienceFairs: Types.ScienceFair[]
      scienceFairHero: Types.ScienceFairHero | null
      scienceFairStats: Types.ScienceFairStat[]
      scienceFairJourneyStages: Types.ScienceFairJourneyStage[]
      scienceFairWinners: Types.ScienceFairWinnerProject[]
      stemCenters: Types.StemOperationsCenter[]
      stemCentersHero: any | null
      stemCentersStats: any[]
      stemCentersLaboratoryPrograms: any[]
      universityOutreach: Types.UniversityOutreach[]
      stemTv: Types.STEMTv[]
    }
  }
}

const store: DataStore = {
  about: {
    stemCenter: null,
    members: [],
  },
  contact: { 
    id: "1", 
    email: "", 
    phone: "", 
    mobile: "",
    address: "", 
    addressDetails: "",
    website: "",
    officeHours: "",
    mapLink: "",
  },
  footer: [],
  header: [],
  home: { hero: null, gallery: [], impact: [], partners: [] },
  latest: {
    announcements: [],
    announcementsHero: null,
    events: [],
    eventsHero: null,
    newsletter: [],
    newsletterHero: null,
    socialMedia: [],
    socialMediaHero: null,
  },
  location: [],
  pages: [],
  programs: {
    entrepreneurship: {
      businessDevelopment: [],
      businessDevelopmentHero: null,
      businessDevelopmentStats: [],
      businessDevelopmentPartners: [],
      incubation: [],
      incubationHero: null,
      incubationStats: [],
      incubationSuccessStories: [],
      digitalSkills: [],
      digitalSkillsHero: null,
      digitalSkillsStats: [],
      softSkills: [],
      softSkillsHero: null,
      softSkillsStats: [],
    },
    fablab: {
      makerSpace: [],
      makerSpaceStats: [],
      makerSpaceGallery: [],
      makerSpaceWorkshops: [],
      products: [],
      productsStats: [],
      services: [],
      servicesStats: [],
      servicesMachineries: [],
      trainingConsultancy: {
        stats: [],
        offerings: [],
        partners: [],
        partnersSection: { title: "", description: "" },
      },
      hero: {},
    },
    stemOperations: {
      scienceFairs: [],
      scienceFairHero: null,
      scienceFairStats: [],
      scienceFairJourneyStages: [],
      scienceFairWinners: [],
      stemCenters: [],
      stemCentersHero: null,
      stemCentersStats: [],
      stemCentersLaboratoryPrograms: [],
      universityOutreach: [],
      stemTv: [],
    },
  },
}

export function getStore() {
  return store
}

export function generateId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}
