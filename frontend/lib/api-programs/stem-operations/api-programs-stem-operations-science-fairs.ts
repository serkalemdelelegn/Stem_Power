import { backendApi } from "../../backend-api";

// ===== Backend Interfaces =====

interface BackendHero {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendStat {
  id: string;
  number: string;
  label: string;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendJourneyStage {
  id: string;
  title: string;
  badge: string;
  number: string;
  description: string;
  icon?: string | null;
  order?: number | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendWinner {
  id: string;
  projectTitle: string;
  studentName: string;
  university: string;
  description: string | null;
  placementBadge: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface HeroData {
  badge: string;
  title: string;
  subtitle: string;
}

export interface ImpactStat {
  number: string;
  label: string;
  icon: string; // Icon name/key for mapping
}

export interface JourneyStage {
  level: string;
  stage: string;
  participants: string;
  description: string;
  icon: string;
}

export interface SuccessStory {
  title: string;
  student: string;
  school: string;
  description: string;
  award: string;
  image: string;
}

// ===== Transform Functions =====

function transformHero(backendHero: BackendHero): HeroData {
  return {
    badge: backendHero.badge || "STEM Operations",
    title: backendHero.title || "Innovation Meets Opportunity",
    subtitle:
      backendHero.subtitle ||
      "Across Ethiopia, locally run Science and Engineering Fairs are sparking creativity and innovation among students. From grassroots communities to the national stage, young minds are designing solutions that shape the future.",
  };
}

function transformStat(backendStat: BackendStat): ImpactStat {
  return {
    number: backendStat.number,
    label: backendStat.label,
    icon: backendStat.icon?.toLowerCase() || "users", // Return lowercase icon name/key
  };
}

function transformJourneyStage(
  backendStage: BackendJourneyStage
): JourneyStage {
  return {
    level: backendStage.title,
    stage: backendStage.badge,
    participants: backendStage.number,
    description: backendStage.description,
    icon: backendStage.icon?.toLowerCase() || "users",
  };
}

function transformWinner(backendWinner: BackendWinner): SuccessStory {
  return {
    title: backendWinner.projectTitle,
    student: backendWinner.studentName,
    school: backendWinner.university,
    description: backendWinner.description || "",
    award: backendWinner.placementBadge,
    image: backendWinner.image || "/placeholder.svg",
  };
}

// ===== Fetch Functions =====

/**
 * Fetch hero data from dedicated hero endpoint
 */
export async function fetchHero(): Promise<HeroData | null> {
  try {
    const response = await backendApi.get("/api/science-fairs/hero");
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
    const backendStats: BackendStat[] = await backendApi.get(
      "/api/science-fairs/stats"
    );
    // Backend returns array directly
    if (!Array.isArray(backendStats) || backendStats.length === 0) {
      return [];
    }
    return backendStats.map(transformStat);
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return [];
  }
}

export async function fetchJourneyStages(): Promise<JourneyStage[]> {
  try {
    const backendStages: BackendJourneyStage[] = await backendApi.get(
      "/api/science-fairs/journey-stages"
    );
    // Backend returns array directly
    if (!Array.isArray(backendStages) || backendStages.length === 0) {
      return [];
    }
    return backendStages.map(transformJourneyStage);
  } catch (error) {
    console.error("Error fetching journey stages:", error);
    return [];
  }
}

export async function fetchWinners(): Promise<SuccessStory[]> {
  try {
    const backendWinners: BackendWinner[] = await backendApi.get(
      "/api/science-fairs/winners"
    );
    // Backend returns array directly
    if (!Array.isArray(backendWinners) || backendWinners.length === 0) {
      return [];
    }
    return backendWinners.map(transformWinner);
  } catch (error) {
    console.error("Error fetching winners:", error);
    return [];
  }
}
