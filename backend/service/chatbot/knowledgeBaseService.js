// Direct database access - more efficient than HTTP calls
const AboutStemCenter = require('../../models/about/aboutStemCenterModel');
const Event = require('../../models/latest/eventsModel');
const Announcement = require('../../models/latest/AnnouncementModel');
const News = require('../../models/latest/newsModel');
const ContactOffice = require('../../models/contact_us/contactOfficeModel');
const StemCenter = require('../../models/programs/StemCenter/stem-centers/StemCenter');
const ScienceFair = require('../../models/programs/StemCenter/science-fairs/scienceFair');
const UniversityOutreach = require('../../models/programs/StemCenter/university-outreach/universityOutreach');
const FabLabService = require('../../models/programs/FabLab/fablabServices/FabLabService');
const MakerSpace = require('../../models/programs/FabLab/makerSpace/MakerSpace');
const IncubationProgram = require('../../models/programs/Entrepreneurship & Incubation/incubationProgram/IncubationProgram');
const BusinessDevelopment = require('../../models/programs/Entrepreneurship & Incubation/BusinessDevelopment/BusinessDevelopmentService');

/**
 * Gets static information from STEMpower.org website
 * This serves as a reliable fallback and primary source of information
 */
function getWebsiteStaticInfo() {
  return {
    mission: "Inside Every Child is a Scientist. Nurture that Scientist, you will change the world.",
    tagline: "Inside Every Child is a Scientist. Nurture that Scientist, you will change the world.",
    impacts: {
      stemCenters: {
        totalCenters: 157,
        studentsImpacted: "1,000,000+",
        studentsInScienceFairs: "17,000+",
        scienceFairsOrganized: 155,
        description: "157 STEMpower hands-on STEM Centers across Sub-Saharan Africa"
      },
      fablab: {
        totalFabLabs: 2,
        innovatorsImpacted: "100+",
        prototypedScienceKits: "50+",
        massProducedScienceKits: "500+"
      },
      entrepreneurship: {
        entrepreneurshipGraduates: 3600,
        startupsCreated: 59,
        digitalSkillsGraduates: 3160,
        techSMEsCreated: 10
      }
    },
    contact: {
      usa: {
        office: "STEMpower USA Office",
        address: "3 Bessom St #318, Marblehead, MA 01945, USA",
        email: "info@stempower.org",
        phone: "(+1) 978-210-1055"
      },
      ethiopia: {
        office: "STEMpower Ethiopia Office",
        address: "Bole Sub City, Wereda 05 H.No. 363, In front of Bole Sub City 1st Instance Court, P.o.Box: 3/1250, Addis Ababa, Ethiopia",
        phone: "(+251) 11 639-3062"
      },
      southSudan: {
        office: "STEMpower South Sudan Office",
        phone: "(+211) 912-234-252"
      },
      rwanda: {
        office: "STEMpower Rwanda Office",
        phone: "(+250) 783-127-600"
      }
    },
    programs: {
      stemCenters: {
        description: "STEM Centers provide hands-on science, technology, engineering, and mathematics learning across Sub-Saharan Africa. They include science fairs, robotics workshops, and mentorship programs.",
        features: ["Science Fairs", "Robotics Programs", "Hands-on Learning", "Mentorship"]
      },
      fablab: {
        description: "FabLabs provide rapid prototyping, 3D printing, and product development support. They help innovators create science kits and educational tools.",
        features: ["Rapid Prototyping", "3D Printing", "Science Kit Production", "Innovation Support"]
      },
      entrepreneurship: {
        description: "Entrepreneurship & Digital Skills programs support founders with business development services, mentorship, and access to funding partners.",
        features: ["Business Development", "Digital Skills Training", "Startup Incubation", "Mentorship"]
      },
      stemTv: {
        description: "STEM-TV provides educational content and resources for students and educators."
      }
    },
    website: "https://www.stempower.org/"
  };
}

/**
 * Fetches and aggregates all STEMpower website content for chatbot knowledge base
 */
async function fetchWebsiteContent() {
  const knowledgeBase = {
    about: null,
    programs: {
      stemCenters: [],
      fablab: [],
      entrepreneurship: [],
    },
    events: [],
    announcements: [],
    news: [],
    contact: null,
    // Add static website information
    staticInfo: getWebsiteStaticInfo(),
  };

  try {
    // Fetch About STEM Centers
    try {
      const aboutData = await AboutStemCenter.findOne({
        where: { is_active: true },
        order: [['updatedAt', 'DESC']],
      });
      if (aboutData) {
        knowledgeBase.about = aboutData.toJSON();
      }
    } catch (error) {
      console.warn('Failed to fetch about data:', error.message);
    }

    // Fetch STEM Centers programs
    try {
      const stemCenters = await StemCenter.findAll({
        limit: 5,
        order: [['updatedAt', 'DESC']],
      });
      knowledgeBase.programs.stemCenters = stemCenters.map(sc => sc.toJSON());
    } catch (error) {
      console.warn('Failed to fetch STEM centers:', error.message);
    }

    // Fetch Science Fairs
    try {
      const scienceFairs = await ScienceFair.findAll({
        limit: 5,
        order: [['updatedAt', 'DESC']],
      });
      knowledgeBase.programs.stemCenters.push(...scienceFairs.map(sf => ({
        title: sf.title || 'Science Fair',
        description: sf.description || '',
        type: 'Science Fair',
      })));
    } catch (error) {
      console.warn('Failed to fetch science fairs:', error.message);
    }

    // Fetch University Outreach
    try {
      const outreach = await UniversityOutreach.findAll({
        limit: 5,
        order: [['updatedAt', 'DESC']],
      });
      knowledgeBase.programs.stemCenters.push(...outreach.map(ou => ({
        title: ou.title || 'University Outreach',
        description: ou.description || '',
        type: 'University Outreach',
      })));
    } catch (error) {
      console.warn('Failed to fetch university outreach:', error.message);
    }

    // Fetch FabLab Services
    try {
      const fablabServices = await FabLabService.findAll({
        limit: 5,
        order: [['updatedAt', 'DESC']],
      });
      knowledgeBase.programs.fablab = fablabServices.map(fs => fs.toJSON());
    } catch (error) {
      console.warn('Failed to fetch FabLab services:', error.message);
    }

    // Fetch Maker Space
    try {
      const makerSpaces = await MakerSpace.findAll({
        limit: 5,
        order: [['updatedAt', 'DESC']],
      });
      knowledgeBase.programs.fablab.push(...makerSpaces.map(ms => ({
        title: ms.title || 'Maker Space',
        description: ms.description || '',
        type: 'Maker Space',
      })));
    } catch (error) {
      console.warn('Failed to fetch maker space:', error.message);
    }

    // Fetch Entrepreneurship Programs
    try {
      const incubationPrograms = await IncubationProgram.findAll({
        limit: 5,
        order: [['updatedAt', 'DESC']],
      });
      knowledgeBase.programs.entrepreneurship = incubationPrograms.map(ip => ({
        title: ip.title || 'Incubation Program',
        description: ip.description || '',
        type: 'Incubation',
      }));
    } catch (error) {
      console.warn('Failed to fetch incubation program:', error.message);
    }

    // Fetch Business Development
    try {
      const businessDev = await BusinessDevelopment.findAll({
        limit: 5,
        order: [['updatedAt', 'DESC']],
      });
      knowledgeBase.programs.entrepreneurship.push(...businessDev.map(bd => ({
        title: bd.title || 'Business Development',
        description: bd.description || '',
        type: 'Business Development',
      })));
    } catch (error) {
      console.warn('Failed to fetch business development:', error.message);
    }

    // Fetch Events
    try {
      const events = await Event.findAll({
        where: { is_active: true },
        limit: 10,
        order: [['start_date', 'DESC']],
      });
      knowledgeBase.events = events.map(e => e.toJSON());
    } catch (error) {
      console.warn('Failed to fetch events:', error.message);
    }

    // Fetch Announcements
    try {
      const announcements = await Announcement.findAll({
        where: { is_active: true },
        limit: 10,
        order: [['start_date', 'DESC']],
      });
      knowledgeBase.announcements = announcements.map(a => a.toJSON());
    } catch (error) {
      console.warn('Failed to fetch announcements:', error.message);
    }

    // Fetch News
    try {
      const news = await News.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
      });
      knowledgeBase.news = news.map(n => n.toJSON());
    } catch (error) {
      console.warn('Failed to fetch news:', error.message);
    }

    // Fetch Contact Information
    try {
      const contact = await ContactOffice.findOne({
        order: [['updatedAt', 'DESC']],
      });
      if (contact) {
        knowledgeBase.contact = contact.toJSON();
      }
    } catch (error) {
      console.warn('Failed to fetch contact info:', error.message);
    }

  } catch (error) {
    console.error('Error building knowledge base:', error.message);
  }

  return knowledgeBase;
}

/**
 * Formats knowledge base into a readable string for the chatbot
 */
function formatKnowledgeBase(knowledgeBase) {
  let content = '';

  // Add static website information first (most reliable)
  if (knowledgeBase.staticInfo) {
    const info = knowledgeBase.staticInfo;
    content += '\n## About STEMpower\n';
    content += `Mission: ${info.mission}\n`;
    content += `Tagline: ${info.tagline}\n`;
    content += `Website: ${info.website}\n\n`;
    
    // Add Impact Statistics
    content += '## Impact Statistics\n';
    if (info.impacts.stemCenters) {
      const sc = info.impacts.stemCenters;
      content += `STEM Centers: ${sc.totalCenters} centers across Sub-Saharan Africa\n`;
      content += `Students Impacted: ${sc.studentsImpacted}\n`;
      content += `Students in Science Fairs: ${sc.studentsInScienceFairs}\n`;
      content += `Science Fairs Organized: ${sc.scienceFairsOrganized}\n\n`;
    }
    if (info.impacts.fablab) {
      const fl = info.impacts.fablab;
      content += `FabLabs: ${fl.totalFabLabs} labs\n`;
      content += `Innovators Impacted: ${fl.innovatorsImpacted}\n`;
      content += `Prototyped Science Kits: ${fl.prototypedScienceKits}\n`;
      content += `Mass-produced Science Kits: ${fl.massProducedScienceKits}\n\n`;
    }
    if (info.impacts.entrepreneurship) {
      const ent = info.impacts.entrepreneurship;
      content += `Entrepreneurship Graduates: ${ent.entrepreneurshipGraduates}\n`;
      content += `Start-ups Created: ${ent.startupsCreated}\n`;
      content += `Digital Skills Graduates: ${ent.digitalSkillsGraduates}\n`;
      content += `Tech SMEs Created: ${ent.techSMEsCreated}\n\n`;
    }
    
    // Add Programs Information
    content += '## Programs\n';
    if (info.programs.stemCenters) {
      content += `STEM Centers: ${info.programs.stemCenters.description}\n`;
      content += `Features: ${info.programs.stemCenters.features.join(', ')}\n\n`;
    }
    if (info.programs.fablab) {
      content += `FabLab: ${info.programs.fablab.description}\n`;
      content += `Features: ${info.programs.fablab.features.join(', ')}\n\n`;
    }
    if (info.programs.entrepreneurship) {
      content += `Entrepreneurship & Digital Skills: ${info.programs.entrepreneurship.description}\n`;
      content += `Features: ${info.programs.entrepreneurship.features.join(', ')}\n\n`;
    }
    if (info.programs.stemTv) {
      content += `STEM-TV: ${info.programs.stemTv.description}\n\n`;
    }
    
    // Add Contact Information
    content += '## Contact Information\n';
    if (info.contact.usa) {
      content += `USA Office: ${info.contact.usa.address}\n`;
      content += `Email: ${info.contact.usa.email}\n`;
      content += `Phone: ${info.contact.usa.phone}\n\n`;
    }
    if (info.contact.ethiopia) {
      content += `Ethiopia Office: ${info.contact.ethiopia.address}\n`;
      content += `Phone: ${info.contact.ethiopia.phone}\n\n`;
    }
    if (info.contact.southSudan) {
      content += `South Sudan Office: Phone: ${info.contact.southSudan.phone}\n\n`;
    }
    if (info.contact.rwanda) {
      content += `Rwanda Office: Phone: ${info.contact.rwanda.phone}\n\n`;
    }
  }

  // About Section from Database (if available, supplements static info)
  if (knowledgeBase.about) {
    content += '\n## Additional Information from Database\n';
    if (knowledgeBase.about.title) {
      content += `Title: ${knowledgeBase.about.title}\n`;
    }
    if (knowledgeBase.about.description) {
      content += `Description: ${knowledgeBase.about.description}\n`;
    }
    if (knowledgeBase.about.mission && !knowledgeBase.staticInfo) {
      content += `Mission: ${knowledgeBase.about.mission}\n`;
    }
    if (knowledgeBase.about.vision) {
      content += `Vision: ${knowledgeBase.about.vision}\n`;
    }
    if (knowledgeBase.about.values && Array.isArray(knowledgeBase.about.values)) {
      content += `Values: ${knowledgeBase.about.values.map(v => v.title || v).join(', ')}\n`;
    }
    if (knowledgeBase.about.whoWeAre) {
      content += `Who We Are: ${knowledgeBase.about.whoWeAre.title || ''} - ${knowledgeBase.about.whoWeAre.description || ''}\n`;
    }
  }

  // STEM Centers Programs
  if (knowledgeBase.programs.stemCenters && knowledgeBase.programs.stemCenters.length > 0) {
    content += '\n## STEM Centers Programs\n';
    knowledgeBase.programs.stemCenters.forEach((program, index) => {
      content += `${index + 1}. ${program.title || 'Program'}: ${program.description || ''}\n`;
      if (program.features && Array.isArray(program.features)) {
        content += `   Features: ${program.features.join(', ')}\n`;
      }
    });
  }

  // FabLab Programs
  if (knowledgeBase.programs.fablab && knowledgeBase.programs.fablab.length > 0) {
    content += '\n## FabLab & Maker Space Programs\n';
    knowledgeBase.programs.fablab.forEach((program, index) => {
      content += `${index + 1}. ${program.title || 'Program'}: ${program.description || ''}\n`;
      if (program.services && Array.isArray(program.services)) {
        content += `   Services: ${program.services.join(', ')}\n`;
      }
    });
  }

  // Entrepreneurship Programs
  if (knowledgeBase.programs.entrepreneurship && knowledgeBase.programs.entrepreneurship.length > 0) {
    content += '\n## Entrepreneurship Programs\n';
    knowledgeBase.programs.entrepreneurship.forEach((program, index) => {
      content += `${index + 1}. ${program.title || 'Program'}: ${program.description || ''}\n`;
    });
  }

  // Recent Events
  if (knowledgeBase.events && knowledgeBase.events.length > 0) {
    content += '\n## Upcoming Events\n';
    knowledgeBase.events.slice(0, 5).forEach((event, index) => {
      content += `${index + 1}. ${event.title || 'Event'}: ${event.description || ''}\n`;
      if (event.date) {
        content += `   Date: ${event.date}\n`;
      }
    });
  }

  // Recent Announcements
  if (knowledgeBase.announcements && knowledgeBase.announcements.length > 0) {
    content += '\n## Recent Announcements\n';
    knowledgeBase.announcements.slice(0, 5).forEach((announcement, index) => {
      content += `${index + 1}. ${announcement.title || 'Announcement'}: ${announcement.description || ''}\n`;
    });
  }

  // Contact Information
  if (knowledgeBase.contact) {
    content += '\n## Contact Information\n';
    if (knowledgeBase.contact.address) {
      content += `Address: ${knowledgeBase.contact.address}\n`;
    }
    if (knowledgeBase.contact.email) {
      content += `Email: ${knowledgeBase.contact.email}\n`;
    }
    if (knowledgeBase.contact.phone) {
      content += `Phone: ${knowledgeBase.contact.phone}\n`;
    }
  }

  return content;
}

/**
 * Gets cached or fresh knowledge base
 * In production, you might want to cache this and refresh periodically
 */
let cachedKnowledgeBase = null;
let lastFetchTime = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

async function getKnowledgeBase(forceRefresh = false) {
  const now = Date.now();
  
  if (!forceRefresh && cachedKnowledgeBase && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedKnowledgeBase;
  }

  const knowledgeBase = await fetchWebsiteContent();
  cachedKnowledgeBase = knowledgeBase;
  lastFetchTime = now;
  
  return knowledgeBase;
}

module.exports = {
  fetchWebsiteContent,
  formatKnowledgeBase,
  getKnowledgeBase,
};

