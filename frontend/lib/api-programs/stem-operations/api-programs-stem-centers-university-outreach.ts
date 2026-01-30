import { backendApi } from "../../backend-api";
import {
  Building2,
  Users,
  TrendingUp,
  CheckCircle2,
  GraduationCap,
  Target,
  Lightbulb,
} from "lucide-react";

// ===== Backend Interfaces =====

interface BackendImpactStat {
  id: string;
  number: string;
  label: string;
  icon?: string | null;
  university_outreach_id?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendProgramBenefit {
  id: string;
  title: string;
  description: string;
  icon?: string | null;
  order?: number | null;
  university_outreach_id?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendTimeline {
  id: string;
  phase: string;
  title: string;
  description: string;
  year: string;
  order?: number | null;
  university_outreach_id?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendUniversity {
  id: string;
  name?: string | null;
  title?: string | null; // For backward compatibility
  location?: string | null;
  established?: number | null;
  studentsServed?: string | null;
  programStartYear?: number | null;
  description?: string | null;
  university_details?: string | null; // For backward compatibility
  facilities?: string[] | null;
  key_facilities?: string | null; // For backward compatibility
  achievements?: string[] | null;
  notable_achievements?: string | null; // For backward compatibility
  image?: string | null;
  university_image?: string | null; // For backward compatibility
  website?: string | null;
  university_outreach_id?: number;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface ImpactStat {
  number: string;
  label: string;
  icon: any | null; // Icon component type (optional)
}

export interface ProgramBenefit {
  title: string;
  description: string;
  icon: any | null; // Icon component type (optional)
}

export interface Timeline {
  phase: string;
  title: string;
  description: string;
  year: string;
}

export interface University {
  name: string;
  location: string;
  established: number;
  studentsServed: string;
  programStartYear: number;
  description: string;
  facilities: string[];
  achievements: string[];
  image: string;
  website: string;
}

// ===== Fallback Data =====

// No fallback stats; rely on backend only

// No fallback program benefits; rely on backend only

// No fallback timeline; rely on backend only

// No fallback universities; rely on backend only

// ===== Transform Functions =====

function transformImpactStat(backendStat: BackendImpactStat): ImpactStat {
  const iconMap: Record<string, any> = {
    Building2,
    Users,
    TrendingUp,
    CheckCircle2,
    GraduationCap,
    Target,
    Lightbulb,
  };

  return {
    number: backendStat.number,
    label: backendStat.label,
    icon: backendStat.icon ? iconMap[backendStat.icon] || null : null,
  };
}

function transformProgramBenefit(
  backendBenefit: BackendProgramBenefit
): ProgramBenefit {
  const iconMap: Record<string, any> = {
    Building2,
    Users,
    TrendingUp,
    CheckCircle2,
    GraduationCap,
    Target,
    Lightbulb,
  };

  return {
    title: backendBenefit.title,
    description: backendBenefit.description,
    icon: backendBenefit.icon ? iconMap[backendBenefit.icon] || null : null,
  };
}

function transformTimeline(backendTimeline: BackendTimeline): Timeline {
  return {
    phase: backendTimeline.phase,
    title: backendTimeline.title,
    description: backendTimeline.description,
    year: backendTimeline.year,
  };
}

function transformUniversity(
  backendUniversity: BackendUniversity
): University | null {
  try {
    // Handle backward compatibility with old field names
    const name = backendUniversity.name || backendUniversity.title || "";
    const description =
      backendUniversity.description ||
      backendUniversity.university_details ||
      "";
    const image =
      backendUniversity.image || backendUniversity.university_image || "";

    // Parse facilities and achievements
    let facilities: string[] = [];
    if (backendUniversity.facilities) {
      facilities = Array.isArray(backendUniversity.facilities)
        ? backendUniversity.facilities
        : JSON.parse(backendUniversity.facilities);
    } else if (backendUniversity.key_facilities) {
      try {
        facilities = JSON.parse(backendUniversity.key_facilities);
      } catch {
        facilities = backendUniversity.key_facilities
          .split(",")
          .map((f) => f.trim());
      }
    }

    let achievements: string[] = [];
    if (backendUniversity.achievements) {
      achievements = Array.isArray(backendUniversity.achievements)
        ? backendUniversity.achievements
        : JSON.parse(backendUniversity.achievements);
    } else if (backendUniversity.notable_achievements) {
      try {
        achievements = JSON.parse(backendUniversity.notable_achievements);
      } catch {
        achievements = backendUniversity.notable_achievements
          .split(",")
          .map((a) => a.trim());
      }
    }

    return {
      name,
      location: backendUniversity.location || "",
      established: backendUniversity.established || 0,
      studentsServed: backendUniversity.studentsServed || "0",
      programStartYear: backendUniversity.programStartYear || 0,
      description,
      facilities,
      achievements,
      image,
      website: backendUniversity.website || "",
    };
  } catch (error) {
    console.error("Error transforming university:", error);
    return null;
  }
}

// ===== Fetch Functions =====

/**
 * Fetch impact stats from backend, with fallback to static data
 */
export async function fetchImpactStats(): Promise<ImpactStat[]> {
  try {
    const response = await backendApi.get(
      "/api/university-outreach/impact-stats"
    );
    const backendStats: BackendImpactStat[] = Array.isArray(response)
      ? response
      : [];

    return backendStats.map(transformImpactStat);
  } catch (error) {
    console.error("Error fetching impact stats:", error);
    return [];
  }
}

/**
 * Fetch program benefits from backend, with fallback to static data
 */
export async function fetchProgramBenefits(): Promise<ProgramBenefit[]> {
  try {
    const response = await backendApi.get(
      "/api/university-outreach/program-benefits"
    );
    const backendBenefits: BackendProgramBenefit[] = Array.isArray(response)
      ? response
      : [];

    return backendBenefits.map(transformProgramBenefit);
  } catch (error) {
    console.error("Error fetching program benefits:", error);
    return [];
  }
}

/**
 * Fetch timeline from backend, with fallback to static data
 */
export async function fetchTimeline(): Promise<Timeline[]> {
  try {
    const response = await backendApi.get("/api/university-outreach/timelines");
    const backendTimelines: BackendTimeline[] = Array.isArray(response)
      ? response
      : [];

    return backendTimelines.map(transformTimeline);
  } catch (error) {
    console.error("Error fetching timeline:", error);
    return [];
  }
}

/**
 * Fetch universities from backend, with fallback to static data
 */
export async function fetchUniversities(): Promise<University[]> {
  try {
    const response = await backendApi.get(
      "/api/university-outreach/universities"
    );
    const backendUniversities: BackendUniversity[] = Array.isArray(response)
      ? response
      : [];

    const transformedUniversities = backendUniversities
      .map(transformUniversity)
      .filter((university): university is University => university !== null);
    return transformedUniversities;
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}

// ===== Hero Fetch =====

export interface OutreachHero {
  id?: string;
  badge: string;
  title: string;
  description: string;
  hero_image?: string | null;
}

// No fallback hero; return empty content when backend has none

export async function fetchOutreachHero(): Promise<OutreachHero> {
  try {
    const response = await backendApi.get("/api/university-outreach");
    const arr = Array.isArray(response) ? response : [];
    if (!arr.length)
      return { badge: "", title: "", description: "", hero_image: null };
    const first = arr[0];
    return {
      id: String(first.id || ""),
      badge: first.badge || "",
      title: first.title || "",
      description: first.subtitle || first.description || "",
      hero_image: first.hero_image || null,
    };
  } catch (e) {
    return { badge: "", title: "", description: "", hero_image: null };
  }
}
