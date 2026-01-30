import { backendApi } from "../../backend-api";
import {
  Factory,
  Lightbulb,
  Users,
  Shield,
  Printer,
  Zap,
  Cpu,
  CircuitBoard,
  Wrench,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ===== Backend Interfaces =====

interface BackendHero {
  id: string;
  badge: string;
  title: string;
  description: string | null;
  subtitle: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendStat {
  id: string;
  title: string;
  value: string;
  icon: string | null;
  heroId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendService {
  id: string;
  title: string;
  description: string;
  image: string | null;
  icon: string | null;
  capabilities: string[] | string | null;
  applications: string[] | string | null;
  specs: Record<string, string> | string | null;
  heroId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
  heroId?: number;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface HeroContent {
  badge: string;
  title: string;
  description: string;
}

export interface ImpactStat {
  number: string;
  label: string;
  icon: LucideIcon;
}

export interface Machinery {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  image: string;
  capabilities: string[];
  applications: string[];
  specs: Record<string, string>;
}

export interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

// ===== Icon Mapping =====

const iconNameToComponent: Record<string, LucideIcon> = {
  factory: Factory,
  lightbulb: Lightbulb,
  users: Users,
  shield: Shield,
  printer: Printer,
  zap: Zap,
  cpu: Cpu,
  circuitboard: CircuitBoard,
  wrench: Wrench,
  graduationcap: GraduationCap,
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

/**
 * Safely parse JSON object field from backend
 * Handles: objects, JSON strings, null, undefined
 */
function parseJsonObject(value: any): Record<string, string> {
  if (!value) return {};
  if (typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

// ===== Transform Functions =====

function transformHero(backendHero: BackendHero): HeroContent {
  return {
    badge: backendHero.badge || "",
    title: backendHero.title || "",
    description: backendHero.description || backendHero.subtitle || "",
  };
}

function transformStat(backendStat: BackendStat): ImpactStat {
  const iconName = backendStat.icon?.toLowerCase().replace(/\s+/g, "") || "";
  const iconComponent = iconNameToComponent[iconName] || Factory;

  return {
    number: backendStat.value,
    label: backendStat.title,
    icon: iconComponent,
  };
}

function transformMachinery(backendService: BackendService): Machinery {
  const iconName =
    backendService.icon?.toLowerCase().replace(/\s+/g, "") || "factory";
  const iconComponent = iconNameToComponent[iconName] || Factory;

  const capabilities = parseJsonArray(backendService.capabilities);
  const applications = parseJsonArray(backendService.applications);
  const specs = parseJsonObject(backendService.specs);

  return {
    id: backendService.id,
    name: backendService.title,
    icon: iconComponent,
    description: backendService.description,
    image: backendService.image || "",
    capabilities,
    applications,
    specs,
  };
}

function transformBenefit(backendBenefit: BackendBenefit): Benefit {
  const iconName =
    backendBenefit.icon?.toLowerCase().replace(/\s+/g, "") || "users";
  const iconComponent = iconNameToComponent[iconName] || Users;

  return {
    icon: iconComponent,
    title: backendBenefit.title,
    description: backendBenefit.description,
  };
}

// ===== Fetch Functions =====

/**
 * Fetch hero content from backend
 */
export async function fetchHero(): Promise<HeroContent | null> {
  try {
    const response = await backendApi.get("/api/fablab-services/hero");
    const backendHeroes: BackendHero[] = Array.isArray(response)
      ? response
      : [];

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

/**
 * Fetch impact stats from backend
 */
export async function fetchStats(): Promise<ImpactStat[]> {
  try {
    const response = await backendApi.get("/api/fablab-services/stats");
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
 * Fetch machineries (services) from backend
 */
export async function fetchMachineries(): Promise<Machinery[]> {
  try {
    const response = await backendApi.get("/api/fablab-services/machineries");
    const backendServices: BackendService[] = Array.isArray(response)
      ? response
      : [];

    if (backendServices.length === 0) {
      return [];
    }

    return backendServices.map(transformMachinery);
  } catch (error) {
    console.error("Error fetching machineries:", error);
    return [];
  }
}

/**
 * Fetch benefits from backend
 */
export async function fetchBenefits(): Promise<Benefit[]> {
  try {
    const response = await backendApi.get("/api/fablab-services/benefits");
    const backendBenefits: BackendBenefit[] = Array.isArray(response)
      ? response
      : [];

    if (backendBenefits.length === 0) {
      return [];
    }

    return backendBenefits.map(transformBenefit);
  } catch (error) {
    console.error("Error fetching benefits:", error);
    return [];
  }
}

// ===== Admin CRUD Functions =====

/**
 * Create a stat
 */
export async function createStat(statData: {
  title: string;
  value: string;
  icon?: string | null;
}): Promise<BackendStat> {
  const response = await backendApi.post("/api/fablab-services/stats", {
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
    title?: string;
    value?: string;
    icon?: string | null;
  }>
): Promise<BackendStat> {
  const response = await backendApi.put(
    `/api/fablab-services/stats/${id}`,
    statData
  );
  return response;
}

/**
 * Delete a stat
 */
export async function deleteStat(id: string): Promise<void> {
  await backendApi.delete(`/api/fablab-services/stats/${id}`);
}

/**
 * Create a machinery/service
 */
export async function createMachinery(machineryData: {
  title: string;
  description: string;
  icon?: string | null;
  capabilities: string[];
  applications: string[];
  specs: Record<string, string>;
  image?: string | File | null;
}): Promise<BackendService> {
  // Transform frontend format to backend format
  const backendData: any = {
    title: machineryData.title,
    description: machineryData.description,
    icon: machineryData.icon || null,
    capabilities: machineryData.capabilities,
    applications: machineryData.applications,
    specs: machineryData.specs,
  };

  // If image is a File, upload using FormData
  if (machineryData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", machineryData.image);
    formData.append("title", backendData.title);
    formData.append("description", backendData.description);
    if (backendData.icon) formData.append("icon", backendData.icon);
    formData.append("capabilities", JSON.stringify(backendData.capabilities));
    formData.append("applications", JSON.stringify(backendData.applications));
    formData.append("specs", JSON.stringify(backendData.specs));

    const response = await backendApi.postFormData(
      "/api/fablab-services/services",
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {
    ...backendData,
  };
  if (machineryData.image !== undefined) {
    jsonData.image = machineryData.image;
  }

  const response = await backendApi.post(
    "/api/fablab-services/services",
    jsonData
  );
  return response;
}

/**
 * Update a machinery/service
 */
export async function updateMachinery(
  id: string,
  machineryData: Partial<{
    title?: string;
    description?: string;
    icon?: string | null;
    capabilities?: string[];
    applications?: string[];
    specs?: Record<string, string>;
    image?: string | File | null;
  }>
): Promise<BackendService> {
  // Transform frontend format to backend format
  const backendData: any = {};

  if (machineryData.title !== undefined)
    backendData.title = machineryData.title;
  if (machineryData.description !== undefined)
    backendData.description = machineryData.description;
  if (machineryData.icon !== undefined)
    backendData.icon = machineryData.icon || null;
  if (machineryData.capabilities !== undefined)
    backendData.capabilities = machineryData.capabilities;
  if (machineryData.applications !== undefined)
    backendData.applications = machineryData.applications;
  if (machineryData.specs !== undefined)
    backendData.specs = machineryData.specs;

  // If image is a File, upload using FormData
  if (machineryData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", machineryData.image);
    if (backendData.title) formData.append("title", backendData.title);
    if (backendData.description)
      formData.append("description", backendData.description);
    if (backendData.icon !== undefined)
      formData.append("icon", backendData.icon || "");
    if (backendData.capabilities !== undefined) {
      formData.append("capabilities", JSON.stringify(backendData.capabilities));
    }
    if (backendData.applications !== undefined) {
      formData.append("applications", JSON.stringify(backendData.applications));
    }
    if (backendData.specs !== undefined) {
      formData.append("specs", JSON.stringify(backendData.specs));
    }

    const response = await backendApi.putFormData(
      `/api/fablab-services/services/${id}`,
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {};
  if (backendData.title) jsonData.title = backendData.title;
  if (backendData.description !== undefined)
    jsonData.description = backendData.description;
  if (backendData.icon !== undefined) jsonData.icon = backendData.icon;
  if (backendData.capabilities !== undefined)
    jsonData.capabilities = backendData.capabilities;
  if (backendData.applications !== undefined)
    jsonData.applications = backendData.applications;
  if (backendData.specs !== undefined) jsonData.specs = backendData.specs;
  if (machineryData.image !== undefined) jsonData.image = machineryData.image;

  const response = await backendApi.put(
    `/api/fablab-services/services/${id}`,
    jsonData
  );
  return response;
}

/**
 * Delete a machinery/service
 */
export async function deleteMachinery(id: string): Promise<void> {
  await backendApi.delete(`/api/fablab-services/services/${id}`);
}
