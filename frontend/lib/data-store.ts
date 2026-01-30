// In-memory data store for admin content
// In production, this would be replaced with a database

export interface HeroSection {
  id: string
  title: string
  description: string
  badge?: string
}

export interface StatCard {
  id: string
  icon: string
  value: string
  label: string
}

export interface SuccessStory {
  id: string
  businessName: string
  licenseStatus: string
  category: string
  contactPerson: string
  phone: string
  email?: string
}

export interface EquipmentCard {
  id: string
  name: string
  image: string
  description: string
  specs: Array<{ label: string; value: string }>
  capabilities: string[]
  applications: string[]
}

export interface IncubationPhase {
  id: string
  title: string
  badge: string
  duration: string
  description: string
  icon: string
}

export interface ProgramCard {
  id: string
  title: string
  icon: string
  projectCount: number
  duration: string
  level: string
  description: string
  skills: string[]
}

export interface Product {
  id: string
  name: string
  category: string
  subcategory?: string
  price: string
  availability: string
  image: string
  description: string
  overview: string
  features: string[]
  included: string[]
  applications: string[]
}

// Data stores
const dataStore: Record<string, any> = {
  // STEM Operations
  "stem-centers": { hero: null, stats: [], content: [] },
  "science-fairs": { hero: null, stats: [], content: [] },
  "university-outreach": { hero: null, stats: [], content: [] },
  "stem-tv": { hero: null, stats: [], content: [] },

  // FabLab
  "maker-space": { hero: null, stats: [], content: [] },
  "training-consultancy": { hero: null, stats: [], content: [] },
  "science-kits": { hero: null, stats: [], content: [] },
  machineries: { hero: null, stats: [], equipment: [] },
  products: { products: [] },

  // Entrepreneurship
  "business-development": { hero: null, stats: [], successStories: [] },
  incubation: { hero: null, stats: [], phases: [] },
  "digital-skills": { hero: null, stats: [], programs: [] },
  "soft-skills": { hero: null, stats: [], programs: [] },
}

export function getData(page: string) {
  return dataStore[page] || null
}

export function setData(page: string, data: any) {
  dataStore[page] = { ...dataStore[page], ...data }
  return dataStore[page]
}

export function updateItem(page: string, section: string, id: string, data: any) {
  const pageData = dataStore[page]
  if (!pageData || !pageData[section]) return null

  const index = pageData[section].findIndex((item: any) => item.id === id)
  if (index === -1) return null

  pageData[section][index] = { ...pageData[section][index], ...data }
  return pageData[section][index]
}

export function deleteItem(page: string, section: string, id: string) {
  const pageData = dataStore[page]
  if (!pageData || !pageData[section]) return false

  pageData[section] = pageData[section].filter((item: any) => item.id !== id)
  return true
}

export function addItem(page: string, section: string, data: any) {
  const pageData = dataStore[page]
  if (!pageData) return null

  if (!pageData[section]) {
    pageData[section] = []
  }

  const newItem = { id: Date.now().toString(), ...data }
  pageData[section].push(newItem)
  return newItem
}
