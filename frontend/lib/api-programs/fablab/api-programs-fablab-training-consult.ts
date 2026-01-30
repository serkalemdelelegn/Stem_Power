import { backendApi } from "../../backend-api";
import {
  Building2,
  GraduationCap,
  Globe,
  Award,
  Users,
  Lightbulb,
  TrendingUp,
  Wrench,
  BookOpen,
  Target,
  School,
  Factory,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ===== Backend Interfaces =====

interface BackendHero {
  id: string;
  badge: string;
  title: string;
  description: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendStat {
  id: string;
  title: string;
  value: string;
  icon: string | null;
  trainingConsultancyId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendTrainingProgram {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  features: string[] | string | null;
  outcomes: string[] | string | null;
  trainingConsultancyId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendPartner {
  id: string;
  name: string;
  logo: string | null;
  trainingConsultancyId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendPartnersSection {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendSuccessMetric {
  id: string;
  metric: string;
  label: string;
  icon: string;
  trainingConsultancyId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendConsultancyService {
  id: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[] | string | null;
  trainingConsultancyId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendPartnershipType {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  benefits: string[] | string | null;
  trainingConsultancyId?: number;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface HeroContent {
  badge: string;
  title: string;
  description: string;
  image: string;
}

export interface ImpactStat {
  number: string;
  label: string;
  icon: LucideIcon;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image?: string;
  features: string[];
  outcomes: string[];
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface PartnersSection {
  title: string;
  description: string;
}

export interface SuccessMetric {
  metric: string;
  label: string;
  icon: LucideIcon;
}

export interface ConsultancyService {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  deliverables: string[];
}

export interface PartnershipType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  benefits: string[];
}

// ===== Icon Mapping =====

const iconNameToComponent: Record<string, LucideIcon> = {
  users: Users,
  building: Building2,
  building2: Building2,
  graduationcap: GraduationCap,
  cap: GraduationCap,
  globe: Globe,
  award: Award,
  lightbulb: Lightbulb,
  trendingup: TrendingUp,
  wrench: Wrench,
  bookopen: BookOpen,
  target: Target,
  school: School,
  factory: Factory,
  sparkles: Sparkles,
};

// ===== Helper Functions =====

/**
 * Safely parse JSON array field from backend
 * Handles: arrays, JSON strings, null, undefined
 */
function parseJsonArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// ===== Transform Functions =====

const emptyHero: HeroContent = {
  badge: "",
  title: "",
  description: "",
  image: "",
};

function transformHero(backendHero: BackendHero): HeroContent {
  return {
    badge: backendHero.badge || "",
    title: backendHero.title || "",
    description: backendHero.description || "",
    image: backendHero.image || "",
  };
}

function transformStat(backendStat: BackendStat): ImpactStat {
  // Map title/value to number/label
  // Map icon string to LucideIcon component
  const iconName = backendStat.icon?.toLowerCase().replace(/\s+/g, "") || "";
  const iconComponent = iconNameToComponent[iconName] || Award;

  return {
    number: backendStat.value,
    label: backendStat.title,
    icon: iconComponent,
  };
}

function transformTrainingProgram(
  backendProgram: BackendTrainingProgram
): TrainingProgram {
  // Map icon string to LucideIcon component
  const iconName =
    backendProgram.icon?.toLowerCase().replace(/\s+/g, "") || "graduationcap";
  const iconComponent = iconNameToComponent[iconName] || GraduationCap;

  // Parse features and outcomes - handle JSON string, array, or null
  const features = parseJsonArray(backendProgram.features);
  const outcomes = parseJsonArray(backendProgram.outcomes);

  return {
    id: backendProgram.id,
    title: backendProgram.title,
    description: backendProgram.description,
    icon: iconComponent,
    image: backendProgram.image || undefined,
    features,
    outcomes,
  };
}

function transformPartner(backendPartner: BackendPartner): Partner {
  return {
    id: backendPartner.id,
    name: backendPartner.name,
    logo: backendPartner.logo || "/placeholder.svg",
  };
}

const emptyPartnersSection: PartnersSection = {
  title: "",
  description: "",
};

function transformPartnersSection(
  backendSection: BackendPartnersSection
): PartnersSection {
  return {
    title: backendSection.title || "",
    description: backendSection.description || "",
  };
}

function transformSuccessMetric(
  backendMetric: BackendSuccessMetric
): SuccessMetric {
  const iconName =
    backendMetric.icon?.toLowerCase().replace(/\s+/g, "") || "trendingup";
  const iconComponent = iconNameToComponent[iconName] || TrendingUp;

  return {
    metric: backendMetric.metric,
    label: backendMetric.label,
    icon: iconComponent,
  };
}

function transformConsultancyService(
  backendService: BackendConsultancyService
): ConsultancyService {
  const iconName =
    backendService.icon?.toLowerCase().replace(/\s+/g, "") || "bookopen";
  const iconComponent = iconNameToComponent[iconName] || BookOpen;

  // Parse deliverables - handle JSON string, array, or null
  const deliverables = parseJsonArray(backendService.deliverables);

  return {
    id: backendService.id,
    title: backendService.title,
    description: backendService.description,
    icon: iconComponent,
    deliverables,
  };
}

function transformPartnershipType(
  backendType: BackendPartnershipType
): PartnershipType {
  const iconName =
    backendType.icon?.toLowerCase().replace(/\s+/g, "") || "school";
  const iconComponent = iconNameToComponent[iconName] || School;

  // Parse benefits - handle JSON string, array, or null
  const benefits = parseJsonArray(backendType.benefits);

  return {
    id: backendType.id,
    title: backendType.title,
    description: backendType.description,
    icon: iconComponent,
    image: backendType.image || "/placeholder.svg",
    benefits,
  };
}

// ===== Fetch Functions =====

/**
 * Fetch hero content from backend
 */
export async function fetchHero(): Promise<HeroContent> {
  try {
    const response = await backendApi.get("/api/training-consultancy/hero");
    const backendHeroes: BackendHero[] = Array.isArray(response)
      ? response
      : [];

    if (backendHeroes.length === 0) {
      return emptyHero;
    }

    return transformHero(backendHeroes[0]);
  } catch (error) {
    console.error("Error fetching hero:", error);
    return emptyHero;
  }
}

/**
 * Fetch impact stats from backend
 */
export async function fetchStats(): Promise<ImpactStat[]> {
  try {
    const response = await backendApi.get("/api/training-consultancy/stats");
    const backendStats: BackendStat[] = Array.isArray(response) ? response : [];

    if (backendStats.length === 0) {
      return [];
    }

    return backendStats.map(transformStat);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return [];
  }
}

/**
 * Fetch training programs (offerings) from backend
 */
export async function fetchTrainingPrograms(): Promise<TrainingProgram[]> {
  try {
    const response = await backendApi.get("/api/training-consultancy/programs");
    const backendPrograms: BackendTrainingProgram[] = Array.isArray(response)
      ? response
      : [];

    if (backendPrograms.length === 0) {
      return [];
    }

    return backendPrograms.map(transformTrainingProgram);
  } catch (error) {
    console.error("Error fetching training programs:", error);
    return [];
  }
}

/**
 * Fetch partners from backend
 */
export async function fetchPartners(): Promise<Partner[]> {
  try {
    const response = await backendApi.get("/api/training-consultancy/partners");
    const backendPartners: BackendPartner[] = Array.isArray(response)
      ? response
      : [];

    if (backendPartners.length === 0) {
      return [];
    }

    return backendPartners.map(transformPartner);
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
}

/**
 * Fetch partners section from backend
 */
export async function fetchPartnersSection(): Promise<PartnersSection> {
  try {
    const response = await backendApi.get(
      "/api/training-consultancy/partners-section"
    );
    const backendSections: BackendPartnersSection[] = Array.isArray(response)
      ? response
      : [];

    if (backendSections.length === 0) {
      return emptyPartnersSection;
    }

    return transformPartnersSection(backendSections[0]);
  } catch (error) {
    console.error("Error fetching partners section:", error);
    return emptyPartnersSection;
  }
}

/**
 * Fetch success metrics from backend
 */
export async function fetchSuccessMetrics(): Promise<SuccessMetric[]> {
  try {
    const response = await backendApi.get(
      "/api/training-consultancy/success-metrics"
    );
    const backendMetrics: BackendSuccessMetric[] = Array.isArray(response)
      ? response
      : [];

    if (backendMetrics.length === 0) {
      return [];
    }

    return backendMetrics.map(transformSuccessMetric);
  } catch (error) {
    console.error("Error fetching success metrics:", error);
    return [];
  }
}

/**
 * Fetch consultancy services from backend
 */
export async function fetchConsultancyServices(): Promise<
  ConsultancyService[]
> {
  try {
    const response = await backendApi.get(
      "/api/training-consultancy/consultancy-services"
    );
    const backendServices: BackendConsultancyService[] = Array.isArray(response)
      ? response
      : [];

    if (backendServices.length === 0) {
      return [];
    }

    return backendServices.map(transformConsultancyService);
  } catch (error) {
    console.error("Error fetching consultancy services:", error);
    return [];
  }
}

/**
 * Fetch partnership types from backend
 */
export async function fetchPartnershipTypes(): Promise<PartnershipType[]> {
  try {
    const response = await backendApi.get(
      "/api/training-consultancy/partnership-types"
    );
    const backendTypes: BackendPartnershipType[] = Array.isArray(response)
      ? response
      : [];

    if (backendTypes.length === 0) {
      return [];
    }

    return backendTypes.map(transformPartnershipType);
  } catch (error) {
    console.error("Error fetching partnership types:", error);
    return [];
  }
}

// ===== CRUD Functions for Admin =====

/**
 * Create a stat
 */
export async function createStat(statData: {
  title: string;
  value: string;
  icon: string | null;
}): Promise<BackendStat> {
  const response = await backendApi.post("/api/training-consultancy/stats", {
    title: statData.title,
    value: statData.value,
    icon: statData.icon || null,
  });
  return response;
}

/**
 * Update a stat
 */
export async function updateStat(
  id: string,
  statData: Partial<{
    title: string;
    value: string;
    icon: string | null;
  }>
): Promise<BackendStat> {
  const updateData: any = {};
  if (statData.title !== undefined) updateData.title = statData.title;
  if (statData.value !== undefined) updateData.value = statData.value;
  if (statData.icon !== undefined) updateData.icon = statData.icon || null;

  const response = await backendApi.put(
    `/api/training-consultancy/stats/${id}`,
    updateData
  );
  return response;
}

/**
 * Delete a stat
 */
export async function deleteStat(id: string): Promise<void> {
  await backendApi.delete(`/api/training-consultancy/stats/${id}`);
}

/**
 * Create a training program (offering)
 */
export async function createTrainingProgram(programData: {
  title: string;
  description: string;
  icon: string;
  image?: string | File | null;
  features: string[];
  outcomes: string[];
}): Promise<BackendTrainingProgram> {
  // If image is a File, upload using FormData
  if (programData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", programData.image);
    formData.append("title", programData.title);
    formData.append("description", programData.description);
    formData.append("icon", programData.icon);
    formData.append("features", JSON.stringify(programData.features));
    formData.append("outcomes", JSON.stringify(programData.outcomes));

    const response = await backendApi.postFormData(
      "/api/training-consultancy/programs",
      formData
    );
    return response;
  }

  // Otherwise, send as JSON
  const response = await backendApi.post("/api/training-consultancy/programs", {
    title: programData.title,
    description: programData.description,
    icon: programData.icon,
    image: programData.image || null,
    features: programData.features,
    outcomes: programData.outcomes,
  });
  return response;
}

/**
 * Update a training program (offering)
 */
export async function updateTrainingProgram(
  id: string,
  programData: Partial<{
    title: string;
    description: string;
    icon: string;
    image?: string | File | null;
    features: string[];
    outcomes: string[];
  }>
): Promise<BackendTrainingProgram> {
  // If image is a File, upload using FormData
  if (programData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", programData.image);
    if (programData.title) formData.append("title", programData.title);
    if (programData.description)
      formData.append("description", programData.description);
    if (programData.icon) formData.append("icon", programData.icon);
    if (programData.features !== undefined) {
      formData.append("features", JSON.stringify(programData.features));
    }
    if (programData.outcomes !== undefined) {
      formData.append("outcomes", JSON.stringify(programData.outcomes));
    }

    const response = await backendApi.putFormData(
      `/api/training-consultancy/programs/${id}`,
      formData
    );
    return response;
  }

  // Otherwise, send as JSON
  const updateData: any = {};
  if (programData.title !== undefined) updateData.title = programData.title;
  if (programData.description !== undefined)
    updateData.description = programData.description;
  if (programData.icon !== undefined) updateData.icon = programData.icon;
  if (programData.image !== undefined)
    updateData.image = programData.image || null;
  if (programData.features !== undefined)
    updateData.features = programData.features;
  if (programData.outcomes !== undefined)
    updateData.outcomes = programData.outcomes;

  const response = await backendApi.put(
    `/api/training-consultancy/programs/${id}`,
    updateData
  );
  return response;
}

/**
 * Delete a training program (offering)
 */
export async function deleteTrainingProgram(id: string): Promise<void> {
  await backendApi.delete(`/api/training-consultancy/programs/${id}`);
}

/**
 * Create a partner
 */
export async function createPartner(partnerData: {
  name: string;
  logo?: string | File | null;
}): Promise<BackendPartner> {
  // If logo is a File, upload using FormData
  if (partnerData.logo instanceof File) {
    const formData = new FormData();
    formData.append("file", partnerData.logo);
    formData.append("name", partnerData.name);

    const response = await backendApi.postFormData(
      "/api/training-consultancy/partners",
      formData
    );
    return response;
  }

  // Otherwise, send as JSON
  const response = await backendApi.post("/api/training-consultancy/partners", {
    name: partnerData.name,
    logo: partnerData.logo || null,
  });
  return response;
}

/**
 * Update a partner
 */
export async function updatePartner(
  id: string,
  partnerData: Partial<{
    name: string;
    logo?: string | File | null;
  }>
): Promise<BackendPartner> {
  // If logo is a File, upload using FormData
  if (partnerData.logo instanceof File) {
    const formData = new FormData();
    formData.append("file", partnerData.logo);
    if (partnerData.name) formData.append("name", partnerData.name);

    const response = await backendApi.putFormData(
      `/api/training-consultancy/partners/${id}`,
      formData
    );
    return response;
  }

  // Otherwise, send as JSON
  const updateData: any = {};
  if (partnerData.name !== undefined) updateData.name = partnerData.name;
  if (partnerData.logo !== undefined)
    updateData.logo = partnerData.logo || null;

  const response = await backendApi.put(
    `/api/training-consultancy/partners/${id}`,
    updateData
  );
  return response;
}

/**
 * Delete a partner
 */
export async function deletePartner(id: string): Promise<void> {
  await backendApi.delete(`/api/training-consultancy/partners/${id}`);
}
