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

interface BackendStat {
  id: string;
  title: string;
  value: string;
  icon?: string | null;
  softSkillTrainingId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendProgram {
  id: string;
  program_title: string;
  about: "open" | "closed";
  status: "free" | "paid";
  duration: string | null;
  start_date: string | null;
  description: string | null;
  email: string;
  google_form_link: string | null;
  softSkillTrainingId?: string | null;
  createdAt: string;
  updatedAt: string;
  image: string | null;
}

// ===== Frontend Interfaces =====

export interface HeroData {
  title: string;
  description: string;
}

export interface ImpactStat {
  number: string;
  label: string;
  icon: string; // Icon name/key for mapping
}

export interface Program {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  level: string | null;
  icon: string;
  iconColor: string;
  skills: string[];
  topics?: string[];
  projectCount?: number;
}

export interface ApplicationProgram {
  title: string;
  duration: string;
  description: string;
  startDate: string;
  email: string;
  image: string;
  status: string;
  googleFormUrl: string;
}

// ===== Transform Functions =====

function transformHero(backendHero: BackendHero): HeroData {
  return {
    title: backendHero.title || "",
    description: backendHero.description || "",
  };
}

function transformStat(backendStat: BackendStat): ImpactStat {
  return {
    number: backendStat.value,
    label: backendStat.title,
    icon: backendStat.icon?.toLowerCase() || "users", // Return lowercase icon name/key
  };
}

function transformProgram(backendProgram: BackendProgram): Program {
  // Map program fields to frontend format
  // Note: Backend doesn't have icon, iconColor, skills, projectCount
  // These will need to be added to backend or use defaults
  return {
    id: backendProgram.id,
    title: backendProgram.program_title,
    description: backendProgram.description,
    duration: backendProgram.duration || null,
    level: backendProgram.about === "open" ? "Open" : "Closed",
    icon: "messageSquare", // Default, should be added to backend
    iconColor: "teal", // Default, should be added to backend
    skills: [], // Default, should be added to backend
    projectCount: undefined,
  };
}

function transformApplicationProgram(
  backendProgram: BackendProgram
): ApplicationProgram {
  // Format start_date to readable format
  const startDate = backendProgram.start_date
    ? new Date(backendProgram.start_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "TBA";

  return {
    title: backendProgram.program_title,
    duration: backendProgram.duration || "TBA",
    description: backendProgram.description || "",
    startDate: startDate,
    email: backendProgram.email,
    image: backendProgram.image || "",
    status:
      backendProgram.about === "open"
        ? "Applications Open"
        : "Applications Closed",
    googleFormUrl: backendProgram.google_form_link || "",
  };
}

// ===== Fetch Functions =====

/**
 * Fetch hero data from dedicated hero endpoint
 */
export async function fetchHero(): Promise<HeroData | null> {
  try {
    const response = await backendApi.get("/api/soft-skills-training/hero");
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
      "/api/soft-skills-training/stats"
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

export async function fetchPrograms(): Promise<Program[]> {
  try {
    const backendPrograms: BackendProgram[] = await backendApi.get(
      "/api/soft-skills-training/programs"
    );
    // Backend returns array directly
    if (!Array.isArray(backendPrograms) || backendPrograms.length === 0) {
      return [];
    }
    return backendPrograms.map(transformProgram);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}

export async function fetchApplicationPrograms(): Promise<
  ApplicationProgram[]
> {
  try {
    const backendPrograms: BackendProgram[] = await backendApi.get(
      "/api/soft-skills-training/programs"
    );
    // Backend returns array directly
    if (!Array.isArray(backendPrograms) || backendPrograms.length === 0) {
      return [];
    }
    // Filter for open programs and transform
    return backendPrograms
      .filter((program) => program.about === "open")
      .map(transformApplicationProgram);
  } catch (error) {
    console.error("Error fetching application programs:", error);
    return [];
  }
}

// ===== Admin CRUD Functions =====

// Admin interfaces for full program data
export interface AdminProgram {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  projectCount: string;
  duration: string;
  level: string;
  description: string;
  skills: string[];
  topics?: string[];
  image?: string | File | null;
  imagePreview?: string; // For displaying preview of File objects
  startDate?: string;
  googleFormLink?: string;
}

export interface AdminStat {
  id: string;
  icon: string;
  value: string;
  label: string;
}

export interface AdminHero {
  title: string;
  description: string;
}

// Hero CRUD
export async function createHero(heroData: AdminHero): Promise<BackendHero> {
  const response = await backendApi.post(
    "/api/soft-skills-training/hero",
    heroData
  );
  return response.data;
}

export async function updateHero(
  id: string,
  heroData: Partial<AdminHero>
): Promise<BackendHero> {
  const response = await backendApi.put(
    `/api/soft-skills-training/hero/${id}`,
    heroData
  );
  return response.data;
}

// Helper to get hero ID for updates
export async function getHeroId(): Promise<string | null> {
  try {
    const response = await backendApi.get("/api/soft-skills-training/hero");
    const heroes: BackendHero[] = response.data || [];
    return heroes.length > 0 ? heroes[0].id : null;
  } catch (error) {
    console.error("Error getting hero ID:", error);
    return null;
  }
}

// Statistics CRUD
export async function createStatistic(statData: {
  title: string;
  value: string;
  icon?: string | null;
}): Promise<BackendStat> {
  const response = await backendApi.post(
    "/api/soft-skills-training/stats",
    statData
  );
  return response;
}

export async function updateStatistic(
  id: string,
  statData: Partial<{ title: string; value: string; icon?: string | null }>
): Promise<BackendStat> {
  const response = await backendApi.put(
    `/api/soft-skills-training/stats/${id}`,
    statData
  );
  return response;
}

export async function deleteStatistic(id: string): Promise<void> {
  await backendApi.delete(`/api/soft-skills-training/stats/${id}`);
}

// Programs CRUD
// Note: Backend doesn't support topics/skills, icon, iconColor, projectCount
// These are frontend-only fields that will be preserved in the admin interface
export async function createProgram(programData: {
  program_title: string;
  email: string;
  about: "open" | "closed";
  status: "free" | "paid";
  duration?: string | null;
  description?: string | null;
  image?: string | File | null;
  start_date?: string | null;
  google_form_link?: string | null;
}): Promise<BackendProgram> {
  // If image is a File, upload using FormData
  if (programData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", programData.image);
    formData.append("program_title", programData.program_title);
    formData.append("email", programData.email);
    formData.append("about", programData.about);
    formData.append("status", programData.status);
    if (programData.duration) formData.append("duration", programData.duration);
    if (programData.description)
      formData.append("description", programData.description);
    if (programData.start_date)
      formData.append("start_date", programData.start_date);
    if (programData.google_form_link)
      formData.append("google_form_link", programData.google_form_link);
    const response = await backendApi.postFormData(
      "/api/soft-skills-training/programs",
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {
    program_title: programData.program_title,
    email: programData.email,
    about: programData.about,
    status: programData.status,
    duration: programData.duration || null,
    description: programData.description || null,
    start_date: programData.start_date || null,
    google_form_link: programData.google_form_link || null,
  };
  if (programData.image !== undefined) {
    jsonData.image = programData.image;
  }
  const response = await backendApi.post(
    "/api/soft-skills-training/programs",
    jsonData
  );
  return response;
}

export async function updateProgram(
  id: string,
  programData: Partial<{
    program_title?: string;
    email?: string;
    about?: "open" | "closed";
    status?: "free" | "paid";
    duration?: string | null;
    description?: string | null;
    image?: string | File | null;
    start_date?: string | null;
    google_form_link?: string | null;
  }>
): Promise<BackendProgram> {
  // If image is a File, upload using FormData
  if (programData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", programData.image);
    if (programData.program_title)
      formData.append("program_title", programData.program_title);
    if (programData.email) formData.append("email", programData.email);
    if (programData.about) formData.append("about", programData.about);
    if (programData.status) formData.append("status", programData.status);
    if (programData.duration !== undefined)
      formData.append("duration", programData.duration || "");
    if (programData.description !== undefined)
      formData.append("description", programData.description || "");
    if (programData.start_date !== undefined)
      formData.append("start_date", programData.start_date || "");
    if (programData.google_form_link !== undefined)
      formData.append("google_form_link", programData.google_form_link || "");
    const response = await backendApi.putFormData(
      `/api/soft-skills-training/programs/${id}`,
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {};
  if (programData.program_title !== undefined)
    jsonData.program_title = programData.program_title;
  if (programData.email !== undefined) jsonData.email = programData.email;
  if (programData.about !== undefined) jsonData.about = programData.about;
  if (programData.status !== undefined) jsonData.status = programData.status;
  if (programData.duration !== undefined)
    jsonData.duration = programData.duration || null;
  if (programData.description !== undefined)
    jsonData.description = programData.description || null;
  if (programData.start_date !== undefined)
    jsonData.start_date = programData.start_date || null;
  if (programData.google_form_link !== undefined)
    jsonData.google_form_link = programData.google_form_link || null;
  if (programData.image !== undefined) jsonData.image = programData.image;

  const response = await backendApi.put(
    `/api/soft-skills-training/programs/${id}`,
    jsonData
  );
  return response;
}

export async function deleteProgram(id: string): Promise<void> {
  await backendApi.delete(`/api/soft-skills-training/programs/${id}`);
}

// Fetch programs for admin (with all fields)
export async function fetchAdminPrograms(): Promise<AdminProgram[]> {
  try {
    const backendPrograms: BackendProgram[] = await backendApi.get(
      "/api/soft-skills-training/programs"
    );
    if (!Array.isArray(backendPrograms)) {
      return [];
    }
    return backendPrograms.map((program: BackendProgram) => ({
      id: program.id,
      title: program.program_title || "",
      icon: "messageSquare", // Default, not in backend
      iconColor: "teal", // Default, not in backend
      projectCount: "", // Default, not in backend
      duration: program.duration || "",
      level: program.about === "closed" ? "Closed" : "Open",
      description: program.description || "",
      skills: [], // Default, not in backend
      topics: [], // Default, not in backend
      image: program.image || null,
      startDate: program.start_date
        ? (() => {
            try {
              const date = new Date(program.start_date);
              return isNaN(date.getTime())
                ? ""
                : date.toISOString().split("T")[0];
            } catch {
              return "";
            }
          })()
        : "",
      googleFormLink: program.google_form_link || "",
    }));
  } catch (error) {
    console.error("Error fetching admin programs:", error);
    return [];
  }
}

// Fetch statistics for admin
export async function fetchAdminStatistics(): Promise<AdminStat[]> {
  try {
    const backendStats: BackendStat[] = await backendApi.get(
      "/api/soft-skills-training/stats"
    );
    if (!Array.isArray(backendStats)) {
      return [];
    }
    return backendStats.map((stat: BackendStat) => ({
      id: stat.id,
      icon: stat.icon || "rocket",
      value: stat.value,
      label: stat.title,
    }));
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    return [];
  }
}
