import { backendApi } from "../../backend-api";

// ===== Backend Interfaces =====

interface BackendHero {
  id: string;
  badge: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendStatistic {
  id: string;
  title: string;
  value: string;
  icon?: string | null;
  businessDevServiceId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendPartner {
  id: string;
  name: string;
  logo: string | null;
  contribution_description: string;
  focus_area: string;
  partnership_duration: string | null;
  people_impacted: string | null;
  businessDevServiceId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendSuccessStory {
  id: string;
  business_name: string;
  license_status: string;
  category: string;
  category_color: string | null;
  contact_person: string;
  phone: string;
  email: string;
  icon: string | null;
  businessDevServiceId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface HeroData {
  badge: string;
  title: string;
  description: string;
}

export interface ImpactStat {
  number: string;
  label: string;
  icon: string; // Icon name/key for mapping
}

export interface Partner {
  name: string;
  logo: string;
  contribution: string;
  focus: string;
  since: string;
  peopleImpacted: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  owner: string;
  phone: string;
  email: string;
  sector: string;
  status: string;
  donor: string;
  fundingDate: string;
  categoryColor: string | null;
}

// ===== Transform Functions =====

function transformHero(backendHero: BackendHero): HeroData {
  return {
    badge: backendHero.badge || "Entrepreneurship & Incubation",
    title: backendHero.title || "Business Development Services",
    description: backendHero.description || "Fueling Growth and Innovation",
  };
}

function transformStatistic(backendStat: BackendStatistic): ImpactStat {
  return {
    number: backendStat.value,
    label: backendStat.title,
    icon: backendStat.icon?.toLowerCase() || "building", // Return lowercase icon name/key
  };
}

function transformPartner(backendPartner: BackendPartner): Partner {
  return {
    name: backendPartner.name,
    logo: backendPartner.logo || "/placeholder.svg",
    contribution: backendPartner.contribution_description,
    focus: backendPartner.focus_area,
    since: backendPartner.partnership_duration || "",
    peopleImpacted: backendPartner.people_impacted || "",
  };
}

function transformSuccessStory(
  backendStory: BackendSuccessStory
): SuccessStory {
  return {
    id: backendStory.id,
    name: backendStory.business_name,
    owner: backendStory.contact_person,
    phone: backendStory.phone,
    email: backendStory.email,
    sector: backendStory.category,
    status: backendStory.license_status,
    donor: "", // Not in backend model
    fundingDate: "", // Not in backend model
    categoryColor: backendStory.category_color,
  };
}

// ===== Fetch Functions =====

export async function fetchHero(): Promise<HeroData | null> {
  try {
    const response = await backendApi.get("/api/business-development/hero");
    // Backend returns { success: true, data: [...] }
    const backendHeroes: BackendHero[] = response.data || [];
    if (backendHeroes.length === 0) {
      return null;
    }
    // Get the most recent hero (first in DESC order)
    return transformHero(backendHeroes[0]);
  } catch (error) {
    console.error("Error fetching hero:", error);
    return null;
  }
}

export async function fetchStatistics(): Promise<ImpactStat[]> {
  try {
    const response = await backendApi.get(
      "/api/business-development/statistics"
    );
    // Backend returns { success: true, data: [...] }
    const backendStats: BackendStatistic[] = response.data || [];
    if (backendStats.length === 0) {
      return [];
    }
    // Transform statistics
    return backendStats.map(transformStatistic);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return [];
  }
}

export async function fetchPartners(): Promise<Partner[]> {
  try {
    const response = await backendApi.get("/api/business-development/partners");
    // Backend returns { success: true, data: [...] }
    const backendPartners: BackendPartner[] = response.data || [];
    if (backendPartners.length === 0) {
      return [];
    }
    return backendPartners.map(transformPartner);
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
}

export async function fetchSuccessStories(): Promise<SuccessStory[]> {
  try {
    const response = await backendApi.get(
      "/api/business-development/success-stories"
    );
    // Backend returns { success: true, data: [...] }
    const backendStories: BackendSuccessStory[] = response.data || [];
    if (backendStories.length === 0) {
      return [];
    }
    return backendStories.map(transformSuccessStory);
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return [];
  }
}

// ===== Service Items =====

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  capabilities: string[];
  order?: number;
}

interface BackendServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  capabilities: string[] | null;
  order: number | null;
  createdAt: string;
  updatedAt: string;
}

function transformServiceItem(backendItem: BackendServiceItem): ServiceItem {
  // Normalize capabilities - handle JSON strings from backend
  let capabilities: string[] = [];
  if (Array.isArray(backendItem.capabilities)) {
    capabilities = backendItem.capabilities.map(String);
  } else if (typeof backendItem.capabilities === "string") {
    try {
      const parsed = JSON.parse(backendItem.capabilities);
      capabilities = Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      capabilities = backendItem.capabilities
        .split("\n")
        .filter((line: string) => line.trim());
    }
  }

  return {
    id: backendItem.id,
    name: backendItem.name,
    description: backendItem.description,
    icon: backendItem.icon || "target",
    capabilities,
    order: backendItem.order || 0,
  };
}

export async function fetchServiceItems(): Promise<ServiceItem[]> {
  try {
    const response = await backendApi.get(
      "/api/business-development/service-items"
    );
    // Backend returns { success: true, data: [...] }
    const backendItems: BackendServiceItem[] = response.data || [];
    if (backendItems.length === 0) {
      return [];
    }
    return backendItems.map(transformServiceItem);
  } catch (error) {
    console.error("Error fetching service items:", error);
    return [];
  }
}
