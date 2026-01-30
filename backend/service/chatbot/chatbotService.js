const OpenAI = require('openai');
const { getKnowledgeBase, formatKnowledgeBase } = require('./knowledgeBaseService');

let openAiClient = null;

/**
 * Removes markdown formatting from text for plain text display
 */
function removeMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
    .replace(/\*(.*?)\*/g, '$1') // Remove italic *text*
    .replace(/#{1,6}\s*(.*?)$/gm, '$1') // Remove headers # ## ###
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links [text](url) -> text
    .trim();
}

/**
 * Checks if text contains placeholder/test data
 */
function isPlaceholderText(text) {
  if (!text || typeof text !== 'string') return true;
  const normalized = text.toLowerCase().trim();
  
  // Check for common placeholder patterns
  const placeholderPatterns = [
    'lorem ipsum',
    'sdfghjk',
    'asdfghjk',
    'wertyhj',
    'qwerty',
    'test',
    'placeholder',
    'sample text',
    'dummy',
    /^[a-z]{5,10}$/i, // Random strings like "sdfghjk"
  ];
  
  return placeholderPatterns.some(pattern => {
    if (pattern instanceof RegExp) {
      return pattern.test(normalized) && normalized.length < 15;
    }
    return normalized.includes(pattern);
  });
}

/**
 * Filters out placeholder data from object
 */
function filterPlaceholderData(data) {
  if (!data) return null;
  
  const filtered = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;
    
    if (typeof value === 'string') {
      if (!isPlaceholderText(value) && value.trim().length > 0) {
        filtered[key] = value;
      }
    } else if (Array.isArray(value)) {
      const filteredArray = value.filter(item => {
        if (typeof item === 'string') {
          return !isPlaceholderText(item) && item.trim().length > 0;
        }
        if (typeof item === 'object') {
          const filteredItem = filterPlaceholderData(item);
          return filteredItem && Object.keys(filteredItem).length > 0;
        }
        return true;
      });
      if (filteredArray.length > 0) {
        filtered[key] = filteredArray;
      }
    } else if (typeof value === 'object') {
      const filteredObj = filterPlaceholderData(value);
      if (filteredObj && Object.keys(filteredObj).length > 0) {
        filtered[key] = filteredObj;
      }
    } else {
      filtered[key] = value;
    }
  }
  
  return Object.keys(filtered).length > 0 ? filtered : null;
}

if (process.env.OPENAI_API_KEY) {
  openAiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const STEM_KB = [
  {
    keywords: ['stem center', 'stem centres', 'stem program'],
    answer:
      'Our STEM Centers provide hands-on science, technology, engineering, and mathematics learning. They include science fairs, robotics workshops, and mentorship. Let me know which activity you are curious about.',
  },
  {
    keywords: ['science fair', 'fair project'],
    answer:
      'The Science Fairs help learners showcase experiments, prototypes, and innovative ideas. Registration usually opens twice a year and we provide mentorship throughout the process.',
  },
  {
    keywords: ['university outreach', 'campus', 'college'],
    answer:
      'The University Outreach program partners with higher institutions to offer bootcamps, hackathons, and research support for students stepping into STEM careers.',
  },
  {
    keywords: ['entrepreneurship', 'incubation', 'startup'],
    answer:
      'Our Entrepreneurship & Incubation hub supports founders with business development services, mentorship, and access to funding partners.',
  },
  {
    keywords: ['fablab', 'fabrication', 'makerspace'],
    answer:
      'FabLab services include rapid prototyping, 3D printing, and product development support. We also train educators on how to integrate maker activities into their curriculum.',
  },
];

async function buildSystemPrompt() {
  const organizationName = process.env.CHATBOT_ORGANIZATION_NAME || 'STEM Power';
  
  // Fetch and format knowledge base
  let knowledgeContent = '';
  try {
    const knowledgeBase = await getKnowledgeBase();
    knowledgeContent = formatKnowledgeBase(knowledgeBase);
  } catch (error) {
    console.warn('Failed to load knowledge base for chatbot:', error.message);
    // Continue without knowledge base if fetch fails
  }

  return `You are the virtual assistant for ${organizationName} (STEMpower Ethiopia). Your primary role is to provide accurate, helpful information about STEMpower Ethiopia's programs, services, and activities.

CRITICAL INSTRUCTIONS:
1. ALWAYS use the information provided below to answer questions. This is your primary source of truth.
2. When users ask about "what STEMpower does", "basic works", "programs", or similar general questions, provide a comprehensive overview using the information below.
3. DO NOT ask for clarification unless absolutely necessary. Instead, provide the most relevant information you have.
4. Be direct and informative - users want answers, not questions.

KNOWLEDGE BASE:
${knowledgeContent || 'No specific information available. Use general knowledge about STEM education organizations in Ethiopia.'}

RESPONSE GUIDELINES:
- Provide direct, informative answers based on the knowledge base above
- If asked "what does STEMpower do" or "basic works", explain the organization's mission, programs, and services
- Be concise but comprehensive - aim for 2-4 sentences for general questions
- Only ask follow-up questions if the user's question is genuinely unclear or ambiguous
- Always be friendly, professional, and helpful
- If information is not in the knowledge base, provide a helpful general answer and suggest contacting the organization for specific details`;
}

function formatContext(context = []) {
  return context
    .filter((message) => Boolean(message?.content))
    .map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: String(message.content),
    }));
}

/**
 * Provides answer for student-specific questions
 */
function getStudentAnswer(knowledgeBase) {
  let answer = 'As a student, you can benefit from STEMpower in several ways:\n\n';
  
  if (knowledgeBase && knowledgeBase.staticInfo) {
    const info = knowledgeBase.staticInfo;
    
    answer += 'STEM CENTERS:\n';
    answer += `• Access to ${info.impacts.stemCenters.totalCenters} hands-on STEM Centers across Sub-Saharan Africa\n`;
    answer += `• Participate in science fairs (${info.impacts.stemCenters.studentsInScienceFairs} students have participated)\n`;
    answer += '• Robotics workshops and hands-on learning\n';
    answer += '• Mentorship programs\n';
    answer += '• University outreach programs\n\n';
    
    answer += 'FABLAB:\n';
    answer += '• Use 3D printing and rapid prototyping facilities\n';
    answer += '• Develop innovative science kits and projects\n';
    answer += '• Access maker spaces for hands-on innovation\n\n';
    
    answer += 'ENTREPRENEURSHIP & DIGITAL SKILLS:\n';
    answer += '• Entrepreneurship training programs\n';
    answer += '• Digital skills training\n';
    answer += '• Business development support\n';
    answer += '• Startup incubation opportunities\n\n';
    
    answer += 'STEM-TV:\n';
    answer += '• Access educational content and resources\n';
    answer += '• Learn from online educational materials\n\n';
    
    answer += `To get started, visit ${info.website} or contact your nearest STEMpower office for more information about programs in your area.`;
  } else {
    answer += 'STEM CENTERS:\n';
    answer += '• Access to hands-on STEM learning centers\n';
    answer += '• Participate in science fairs and competitions\n';
    answer += '• Robotics workshops and mentorship\n';
    answer += '• University outreach programs\n\n';
    
    answer += 'FABLAB:\n';
    answer += '• Use 3D printing and prototyping facilities\n';
    answer += '• Develop innovative projects\n';
    answer += '• Access maker spaces\n\n';
    
    answer += 'ENTREPRENEURSHIP:\n';
    answer += '• Entrepreneurship training\n';
    answer += '• Digital skills programs\n';
    answer += '• Business development support\n\n';
    
    answer += 'Contact your nearest STEMpower office or visit https://www.stempower.org/ to learn more about available programs in your area.';
  }
  
  return removeMarkdown(answer);
}

async function findFallbackAnswer(message) {
  const normalized = message.toLowerCase();
  console.log('Using intelligent fallback for message:', message);

  // Try to get knowledge base for fallback
  let knowledgeBase = null;
  try {
    knowledgeBase = await getKnowledgeBase();
    console.log('Knowledge base loaded successfully');
    
    // Filter out placeholder data
    if (knowledgeBase.about) {
      knowledgeBase.about = filterPlaceholderData(knowledgeBase.about);
    }
    if (knowledgeBase.programs) {
      if (knowledgeBase.programs.stemCenters) {
        knowledgeBase.programs.stemCenters = knowledgeBase.programs.stemCenters
          .map(p => filterPlaceholderData(p))
          .filter(p => p !== null);
      }
      if (knowledgeBase.programs.fablab) {
        knowledgeBase.programs.fablab = knowledgeBase.programs.fablab
          .map(p => filterPlaceholderData(p))
          .filter(p => p !== null);
      }
      if (knowledgeBase.programs.entrepreneurship) {
        knowledgeBase.programs.entrepreneurship = knowledgeBase.programs.entrepreneurship
          .map(p => filterPlaceholderData(p))
          .filter(p => p !== null);
      }
    }
    
    if (knowledgeBase.about) {
      console.log('About section found in knowledge base');
    }
    if (knowledgeBase.programs) {
      console.log('Programs found in knowledge base');
    }
  } catch (error) {
    console.warn('Failed to load knowledge base for fallback:', error.message);
    console.error('Knowledge base error:', error);
  }
  
  // Handle student-specific questions
  if (normalized.includes('student') || normalized.includes('what can i get') || normalized.includes('as a student') || normalized.includes('for students')) {
    return getStudentAnswer(knowledgeBase);
  }

  // If user asks about basic works, what STEMpower does, etc.
  if ((normalized.includes('basic') && (normalized.includes('work') || normalized.includes('stempower') || normalized.includes('stem'))) ||
      (normalized.includes('what') && (normalized.includes('do') || normalized.includes('work') || normalized.includes('stempower') || normalized.includes('stem'))) ||
      normalized.includes('tell me about') || normalized.includes('about stempower') || normalized.includes('about stem power')) {
    
    let answer = '';
    
    // Use static website information first (most reliable)
    if (knowledgeBase && knowledgeBase.staticInfo) {
      const info = knowledgeBase.staticInfo;
      answer = `STEMpower - ${info.mission}\n\n`;
      answer += `STEMpower operates ${info.impacts.stemCenters.totalCenters} hands-on STEM Centers across Sub-Saharan Africa, impacting over ${info.impacts.stemCenters.studentsImpacted} students.\n\n`;
      
      answer += 'What We Do:\n\n';
      answer += `• STEM Centers: ${info.programs.stemCenters.description}\n`;
      answer += `• FabLab: ${info.programs.fablab.description}\n`;
      answer += `• Entrepreneurship & Digital Skills: ${info.programs.entrepreneurship.description}\n`;
      answer += `• STEM-TV: ${info.programs.stemTv.description}\n\n`;
      
      answer += 'Our Impact:\n';
      answer += `• ${info.impacts.stemCenters.totalCenters} STEM Centers opened\n`;
      answer += `• ${info.impacts.stemCenters.studentsImpacted} students impacted\n`;
      answer += `• ${info.impacts.stemCenters.studentsInScienceFairs} students participated in science fairs\n`;
      answer += `• ${info.impacts.stemCenters.scienceFairsOrganized} local & national science fairs organized\n`;
      answer += `• ${info.impacts.fablab.totalFabLabs} FabLabs supporting ${info.impacts.fablab.innovatorsImpacted} innovators\n`;
      answer += `• ${info.impacts.entrepreneurship.entrepreneurshipGraduates} entrepreneurship graduates\n`;
      answer += `• ${info.impacts.entrepreneurship.startupsCreated} start-ups created\n`;
      answer += `• ${info.impacts.entrepreneurship.digitalSkillsGraduates} digital skills graduates\n\n`;
      
      answer += `Learn more at: ${info.website}\n\n`;
    } else if (knowledgeBase && knowledgeBase.about) {
      // Fallback to database information (filtered)
      const about = knowledgeBase.about;
      answer = 'STEMpower is an organization dedicated to promoting STEM (Science, Technology, Engineering, and Mathematics) education.\n\n';
      
      if (about.title && !isPlaceholderText(about.title)) {
        answer += `${about.title}\n\n`;
      }
      
      if (about.description && !isPlaceholderText(about.description)) {
        answer += `${about.description}\n\n`;
      }
      
      if (about.mission && !isPlaceholderText(about.mission)) {
        answer += `Our Mission: ${about.mission}\n\n`;
      }
      
      if (about.vision && !isPlaceholderText(about.vision)) {
        answer += `Our Vision: ${about.vision}\n\n`;
      }
      
      if (about.values && Array.isArray(about.values) && about.values.length > 0) {
        const validValues = about.values
          .map(v => {
            const val = typeof v === 'object' ? v.title || v : v;
            return typeof val === 'string' && !isPlaceholderText(val) ? val : null;
          })
          .filter(v => v !== null);
        if (validValues.length > 0) {
          answer += `Our Values: ${validValues.join(', ')}\n\n`;
        }
      }
    } else {
      // Ultimate fallback
      answer = 'STEMpower is an organization dedicated to promoting STEM (Science, Technology, Engineering, and Mathematics) education across Sub-Saharan Africa.\n\n';
      answer += 'Our Mission: Inside Every Child is a Scientist. Nurture that Scientist, you will change the world.\n\n';
      answer += 'We operate 157+ STEM Centers, FabLabs, and Entrepreneurship programs. Learn more at https://www.stempower.org/\n\n';
    }
    
    // Add contact info if available
    if (knowledgeBase && knowledgeBase.staticInfo && knowledgeBase.staticInfo.contact) {
      const contact = knowledgeBase.staticInfo.contact;
      answer += 'Contact Us:\n';
      if (contact.usa) {
        answer += `USA Office:\n`;
        answer += `${contact.usa.address}\n`;
        answer += `Email: ${contact.usa.email}\n`;
        answer += `Phone: ${contact.usa.phone}\n\n`;
      }
      if (contact.ethiopia) {
        answer += `Ethiopia Office:\n`;
        answer += `${contact.ethiopia.address}\n`;
        answer += `Phone: ${contact.ethiopia.phone}\n\n`;
      }
      if (contact.southSudan) {
        answer += `South Sudan Office:\n`;
        answer += `Phone: ${contact.southSudan.phone}\n\n`;
      }
      if (contact.rwanda) {
        answer += `Rwanda Office:\n`;
        answer += `Phone: ${contact.rwanda.phone}\n\n`;
      }
    } else if (knowledgeBase && knowledgeBase.contact) {
      // Fallback to database contact (filtered)
      const contact = knowledgeBase.contact;
      answer += 'Contact Us:\n';
      if (contact.email && !isPlaceholderText(contact.email)) answer += `Email: ${contact.email}\n`;
      if (contact.phone && !isPlaceholderText(contact.phone)) answer += `Phone: ${contact.phone}\n`;
      if (contact.address && !isPlaceholderText(contact.address)) answer += `Address: ${contact.address}\n`;
      answer += '\n';
    }
    
    answer += 'Would you like to know more about any specific program or service?';
    return removeMarkdown(answer);
  }

  // Check for program-specific questions using knowledge base
  // Use static website information first, then database
  if (knowledgeBase && knowledgeBase.staticInfo) {
    const info = knowledgeBase.staticInfo;
    
    // STEM Centers questions
    if (normalized.includes('stem center') || normalized.includes('science fair') || normalized.includes('university outreach') || normalized.includes('robotics')) {
      let answer = `STEM Centers\n\n`;
      answer += `${info.programs.stemCenters.description}\n\n`;
      answer += `Features: ${info.programs.stemCenters.features.join(', ')}\n\n`;
      answer += `Impact:\n`;
      answer += `• ${info.impacts.stemCenters.totalCenters} STEM Centers across Sub-Saharan Africa\n`;
      answer += `• ${info.impacts.stemCenters.studentsImpacted} students impacted\n`;
      answer += `• ${info.impacts.stemCenters.studentsInScienceFairs} students participated in science fairs\n`;
      answer += `• ${info.impacts.stemCenters.scienceFairsOrganized} science fairs organized\n\n`;
      
      // Add database programs if available (filtered)
      if (knowledgeBase.programs && knowledgeBase.programs.stemCenters && knowledgeBase.programs.stemCenters.length > 0) {
        answer += 'Specific Programs:\n';
        knowledgeBase.programs.stemCenters.slice(0, 3).forEach((program) => {
          const title = program.title && !isPlaceholderText(program.title) ? program.title : 'Program';
          const desc = program.description && !isPlaceholderText(program.description) ? program.description : '';
          if (title !== 'Program' || desc) {
            answer += `• ${title}${desc ? ': ' + desc : ''}\n`;
          }
        });
        answer += '\n';
      }
      
      answer += 'Would you like more details about any specific program?';
      return removeMarkdown(answer);
    }
    
    // FabLab questions
    if (normalized.includes('fablab') || normalized.includes('fab lab') || normalized.includes('maker space') || normalized.includes('3d printing') || normalized.includes('prototyping')) {
      let answer = `FabLab\n\n`;
      answer += `${info.programs.fablab.description}\n\n`;
      answer += `Features: ${info.programs.fablab.features.join(', ')}\n\n`;
      answer += `Impact:\n`;
      answer += `• ${info.impacts.fablab.totalFabLabs} FabLabs\n`;
      answer += `• ${info.impacts.fablab.innovatorsImpacted} innovators impacted\n`;
      answer += `• ${info.impacts.fablab.prototypedScienceKits} prototyped science kits\n`;
      answer += `• ${info.impacts.fablab.massProducedScienceKits} mass-produced science kits\n\n`;
      
      // Add database services if available (filtered)
      if (knowledgeBase.programs && knowledgeBase.programs.fablab && knowledgeBase.programs.fablab.length > 0) {
        answer += 'Specific Services:\n';
        knowledgeBase.programs.fablab.slice(0, 3).forEach((program) => {
          const title = program.title && !isPlaceholderText(program.title) ? program.title : 'Service';
          const desc = program.description && !isPlaceholderText(program.description) ? program.description : '';
          if (title !== 'Service' || desc) {
            answer += `• ${title}${desc ? ': ' + desc : ''}\n`;
          }
        });
        answer += '\n';
      }
      
      answer += 'Would you like more details about any specific service?';
      return removeMarkdown(answer);
    }
    
    // Entrepreneurship questions
    if (normalized.includes('entrepreneurship') || normalized.includes('incubation') || normalized.includes('startup') || normalized.includes('business development') || normalized.includes('digital skills')) {
      let answer = `Entrepreneurship & Digital Skills\n\n`;
      answer += `${info.programs.entrepreneurship.description}\n\n`;
      answer += `Features: ${info.programs.entrepreneurship.features.join(', ')}\n\n`;
      answer += `Impact:\n`;
      answer += `• ${info.impacts.entrepreneurship.entrepreneurshipGraduates} entrepreneurship graduates\n`;
      answer += `• ${info.impacts.entrepreneurship.startupsCreated} start-ups created\n`;
      answer += `• ${info.impacts.entrepreneurship.digitalSkillsGraduates} digital skills graduates\n`;
      answer += `• ${info.impacts.entrepreneurship.techSMEsCreated} tech SMEs created\n\n`;
      
      // Add database programs if available (filtered)
      if (knowledgeBase.programs && knowledgeBase.programs.entrepreneurship && knowledgeBase.programs.entrepreneurship.length > 0) {
        answer += 'Specific Programs:\n';
        knowledgeBase.programs.entrepreneurship.slice(0, 3).forEach((program) => {
          const title = program.title && !isPlaceholderText(program.title) ? program.title : 'Program';
          const desc = program.description && !isPlaceholderText(program.description) ? program.description : '';
          if (title !== 'Program' || desc) {
            answer += `• ${title}${desc ? ': ' + desc : ''}\n`;
          }
        });
        answer += '\n';
      }
      
      answer += 'Would you like more details about any specific program?';
      return removeMarkdown(answer);
    }
    
    // STEM-TV questions
    if (normalized.includes('stem tv') || normalized.includes('stem-tv') || normalized.includes('stemtv')) {
      let answer = `STEM-TV\n\n`;
      answer += `${info.programs.stemTv.description}\n\n`;
      answer += 'STEM-TV provides educational content and resources for students and educators.\n\n';
      answer += `Learn more at ${info.website}`;
      return removeMarkdown(answer);
    }
    
    // Events questions
    if (normalized.includes('event') || normalized.includes('upcoming') || normalized.includes('schedule')) {
      if (knowledgeBase.events && knowledgeBase.events.length > 0) {
        let answer = 'Upcoming Events:\n\n';
        knowledgeBase.events.slice(0, 5).forEach((event) => {
          const title = event.title && !isPlaceholderText(event.title) ? event.title : 'Event';
          const desc = event.description && !isPlaceholderText(event.description) ? event.description : '';
          answer += `• ${title}${desc ? ': ' + desc : ''}\n`;
          if (event.start_date) {
            const date = new Date(event.start_date);
            answer += `  Date: ${date.toLocaleDateString()}\n`;
          }
          answer += '\n';
        });
        return removeMarkdown(answer);
      }
    }
    
    // Impact/Statistics questions
    if (normalized.includes('impact') || normalized.includes('statistic') || normalized.includes('number') || normalized.includes('how many') || normalized.includes('students')) {
      let answer = 'STEMpower Impact Statistics\n\n';
      
      answer += 'STEM Centers:\n';
      answer += `• ${info.impacts.stemCenters.totalCenters} STEM Centers across Sub-Saharan Africa\n`;
      answer += `• ${info.impacts.stemCenters.studentsImpacted} students impacted\n`;
      answer += `• ${info.impacts.stemCenters.studentsInScienceFairs} students participated in science fairs\n`;
      answer += `• ${info.impacts.stemCenters.scienceFairsOrganized} local & national science fairs organized\n\n`;
      
      answer += 'FabLab:\n';
      answer += `• ${info.impacts.fablab.totalFabLabs} FabLabs\n`;
      answer += `• ${info.impacts.fablab.innovatorsImpacted} innovators impacted\n`;
      answer += `• ${info.impacts.fablab.prototypedScienceKits} prototyped science kits\n`;
      answer += `• ${info.impacts.fablab.massProducedScienceKits} mass-produced science kits\n\n`;
      
      answer += 'Entrepreneurship & Digital Skills:\n';
      answer += `• ${info.impacts.entrepreneurship.entrepreneurshipGraduates} entrepreneurship graduates\n`;
      answer += `• ${info.impacts.entrepreneurship.startupsCreated} start-ups created\n`;
      answer += `• ${info.impacts.entrepreneurship.digitalSkillsGraduates} digital skills graduates\n`;
      answer += `• ${info.impacts.entrepreneurship.techSMEsCreated} tech SMEs created\n\n`;
      
      answer += `Learn more at ${info.website}`;
      return removeMarkdown(answer);
    }
  } else if (knowledgeBase && knowledgeBase.programs) {
    // Fallback to database programs
    // STEM Centers questions
    if (normalized.includes('stem center') || normalized.includes('science fair') || normalized.includes('university outreach') || normalized.includes('robotics')) {
      if (knowledgeBase.programs.stemCenters && knowledgeBase.programs.stemCenters.length > 0) {
        let answer = 'STEM Centers Programs:\n\n';
        knowledgeBase.programs.stemCenters.slice(0, 5).forEach((program) => {
          const title = program.title && !isPlaceholderText(program.title) ? program.title : 'Program';
          const desc = program.description && !isPlaceholderText(program.description) ? program.description : 'STEM education program';
          answer += `• ${title}: ${desc}\n`;
        });
        answer += '\nWould you like more details about any specific program?';
        return removeMarkdown(answer);
      }
    }
    
    // FabLab questions
    if (normalized.includes('fablab') || normalized.includes('fab lab') || normalized.includes('maker space') || normalized.includes('3d printing') || normalized.includes('prototyping')) {
      if (knowledgeBase.programs.fablab && knowledgeBase.programs.fablab.length > 0) {
        let answer = 'FabLab & Maker Space Services:\n\n';
        knowledgeBase.programs.fablab.slice(0, 5).forEach((program) => {
          const title = program.title && !isPlaceholderText(program.title) ? program.title : 'Service';
          const desc = program.description && !isPlaceholderText(program.description) ? program.description : 'Fabrication and prototyping service';
          answer += `• ${title}: ${desc}\n`;
        });
        answer += '\nWould you like more details about any specific service?';
        return removeMarkdown(answer);
      }
    }
    
    // Entrepreneurship questions
    if (normalized.includes('entrepreneurship') || normalized.includes('incubation') || normalized.includes('startup') || normalized.includes('business development')) {
      if (knowledgeBase.programs.entrepreneurship && knowledgeBase.programs.entrepreneurship.length > 0) {
        let answer = 'Entrepreneurship & Incubation Programs:\n\n';
        knowledgeBase.programs.entrepreneurship.slice(0, 3).forEach((program) => {
          const title = program.title && !isPlaceholderText(program.title) ? program.title : 'Program';
          const desc = program.description && !isPlaceholderText(program.description) ? program.description : 'Business development program';
          answer += `• ${title}: ${desc}\n`;
        });
        answer += '\nWould you like more details about any specific program?';
        return removeMarkdown(answer);
      }
    }
  }

  // Check static knowledge base
  const knowledgeHit = STEM_KB.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  if (knowledgeHit) {
    // Enhance with knowledge base if available
    if (knowledgeBase && knowledgeBase.programs) {
      return `${knowledgeHit.answer}\n\nFor more specific information, please visit our website or contact us directly.`;
    }
    return knowledgeHit.answer;
  }

  if (normalized.includes('hello') || normalized.includes('hi')) {
    return 'Hello! I am the STEM Power assistant. How can I support your learning journey today?';
  }

  if (normalized.includes('thanks') || normalized.includes('thank you')) {
    return 'Happy to help! If you need anything else about our programs, just let me know.';
  }

  if (normalized.includes('contact')) {
    if (knowledgeBase && knowledgeBase.staticInfo && knowledgeBase.staticInfo.contact) {
      const contact = knowledgeBase.staticInfo.contact;
      let contactInfo = 'Contact Information:\n\n';
      if (contact.usa) {
        contactInfo += `USA Office:\n${contact.usa.address}\nEmail: ${contact.usa.email}\nPhone: ${contact.usa.phone}\n\n`;
      }
      if (contact.ethiopia) {
        contactInfo += `Ethiopia Office:\n${contact.ethiopia.address}\nPhone: ${contact.ethiopia.phone}\n\n`;
      }
      if (contact.southSudan) {
        contactInfo += `South Sudan Office:\nPhone: ${contact.southSudan.phone}\n\n`;
      }
      if (contact.rwanda) {
        contactInfo += `Rwanda Office:\nPhone: ${contact.rwanda.phone}\n\n`;
      }
      return removeMarkdown(contactInfo);
    }
    if (knowledgeBase && knowledgeBase.contact) {
      const contact = knowledgeBase.contact;
      let contactInfo = '';
      if (contact.email && !isPlaceholderText(contact.email)) {
        contactInfo = `Email: ${contact.email}`;
      }
      if (contact.phone && !isPlaceholderText(contact.phone)) {
        if (contactInfo) contactInfo += '\n';
        contactInfo += `Phone: ${contact.phone}`;
      }
      if (contact.address && !isPlaceholderText(contact.address)) {
        if (contactInfo) contactInfo += '\n';
        contactInfo += `Address: ${contact.address}`;
      }
      return removeMarkdown(contactInfo || 'You can reach our support team via email or call the main office during business hours.');
    }
    return 'You can reach our support team via email or call the main office during business hours.';
  }

  // More informative default response using knowledge base
  if (knowledgeBase && knowledgeBase.staticInfo) {
    const info = knowledgeBase.staticInfo;
    let answer = 'I can help you learn about STEMpower Ethiopia. ';
    answer += `${info.mission}\n\n`;
    answer += 'We offer programs in:\n';
    answer += '• STEM Centers (science fairs, robotics, university outreach)\n';
    answer += '• FabLab & Maker Space (3D printing, prototyping)\n';
    answer += '• Entrepreneurship & Incubation (business development, startup support)\n';
    answer += '• STEM-TV (educational content)\n\n';
    answer += 'You can ask me about:\n';
    answer += '• What STEMpower does\n';
    answer += '• Our programs and services\n';
    answer += '• Upcoming events\n';
    answer += '• Contact information\n';
    answer += '• What students can get from STEMpower\n\n';
    answer += 'What would you like to know?';
    return removeMarkdown(answer);
  }
  
  // Fallback if no knowledge base
  return `STEMpower Ethiopia offers various programs including STEM Centers (science fairs, robotics workshops, university outreach), FabLab services (3D printing, prototyping, maker spaces), and Entrepreneurship programs (business development, incubation). 

You can ask me about:
• What STEMpower does or basic works
• Our programs (STEM Centers, FabLab, Entrepreneurship)
• Upcoming events
• Contact information
• What students can get from STEMpower

What specific area would you like to learn more about?`;
}

async function getChatbotReply({ message, context = [], language = "en" }) {
  if (!message || !message.trim()) {
    throw new Error('A message is required to generate a chatbot response.');
  }

  const trimmedMessage = message.trim();

  // Check if OpenAI is configured
  if (!openAiClient) {
    console.warn('OpenAI client not initialized. Check OPENAI_API_KEY in environment variables.');
    console.log('Using intelligent fallback with knowledge base...');
  }

  if (openAiClient) {
    try {
      console.log('Using OpenAI to generate response...');
      const systemPrompt = await buildSystemPrompt();
      console.log('System prompt length:', systemPrompt.length, 'characters');
      
      const response = await openAiClient.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...formatContext(context),
          { role: 'user', content: trimmedMessage },
        ],
        temperature: 0.7,
        max_tokens: Number(process.env.OPENAI_MAX_OUTPUT_TOKENS || 800),
      });

      const generated = response?.choices?.[0]?.message?.content?.trim();
      if (generated) {
        console.log('OpenAI response generated successfully');
        // Remove markdown formatting for plain text display
        return removeMarkdown(generated);
      } else {
        console.warn('OpenAI returned empty response, falling back to intelligent answer');
      }
    } catch (error) {
      console.error('Chatbot OpenAI request failed:', error.message || error);
      console.error('Error details:', error);
      console.log('Falling back to intelligent answer system...');
    }
  }

  // Use intelligent fallback with knowledge base
  return await findFallbackAnswer(trimmedMessage);
}

module.exports = {
  getChatbotReply,
};

