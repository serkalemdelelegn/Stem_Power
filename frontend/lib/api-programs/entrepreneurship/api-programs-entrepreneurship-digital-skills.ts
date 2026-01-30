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

interface BackendTraining {
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
  digitalSkillTrainingId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendProgram {
  id: string;
  program_title: string;
  about: "open" | "closed";
  status: "free" | "paid";
  image: string | null;
  duration: string | null;
  start_date: string | null;
  description: string | null;
  email: string;
  google_form_link: string | null;
  digitalSkillTrainingId?: string | null;
  createdAt: string;
  updatedAt: string;
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
    title: backendHero.title || "Digital Skills Training",
    description:
      backendHero.description ||
      "Master in-demand digital skills through our transformative partnership with IBM SkillsBuild. Gain hands-on experience in coding, data analysis, robotics, and digital design — empowering you to innovate, solve real-world challenges, and shape the future of technology with confidence",
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
    icon: "code", // Default, should be added to backend
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
    image:
      backendProgram.image ||
      "/ethiopian-students-learning-coding-in-computer-lab.jpg", // Default image
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
    const response = await backendApi.get("/api/digital-skill-training/hero");
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
      "/api/digital-skill-training/stats"
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
      "/api/digital-skill-training/programs"
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
      "/api/digital-skill-training/programs"
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
  email?: string;
  startDate?: string | null;
  image?: string | File | null;
  googleFormLink?: string | null;
  status?: string;
  imagePreview?: string; // For displaying preview of File objects
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
    "/api/digital-skill-training/hero",
    heroData
  );
  return response.data;
}

export async function updateHero(
  id: string,
  heroData: Partial<AdminHero>
): Promise<BackendHero> {
  const response = await backendApi.put(
    `/api/digital-skill-training/hero/${id}`,
    heroData
  );
  return response.data;
}

// Helper to get hero ID for updates
export async function getHeroId(): Promise<string | null> {
  try {
    const response = await backendApi.get("/api/digital-skill-training/hero");
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
    "/api/digital-skill-training/stats",
    statData
  );
  return response;
}

export async function updateStatistic(
  id: string,
  statData: Partial<{ title: string; value: string; icon?: string | null }>
): Promise<BackendStat> {
  const response = await backendApi.put(
    `/api/digital-skill-training/stats/${id}`,
    statData
  );
  return response;
}

export async function deleteStatistic(id: string): Promise<void> {
  await backendApi.delete(`/api/digital-skill-training/stats/${id}`);
}

// Programs CRUD
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
      "/api/digital-skill-training/programs",
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
    "/api/digital-skill-training/programs",
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
      `/api/digital-skill-training/programs/${id}`,
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
    `/api/digital-skill-training/programs/${id}`,
    jsonData
  );
  return response;
}

export async function deleteProgram(id: string): Promise<void> {
  await backendApi.delete(`/api/digital-skill-training/programs/${id}`);
}

// Fetch programs for admin (with all fields)
export async function fetchAdminPrograms(): Promise<AdminProgram[]> {
  try {
    const backendPrograms: BackendProgram[] = await backendApi.get(
      "/api/digital-skill-training/programs"
    );
    if (!Array.isArray(backendPrograms)) {
      return [];
    }
    return backendPrograms.map((program: BackendProgram) => ({
      id: program.id,
      title: program.program_title || "",
      icon: "code", // Default, not in backend
      iconColor: "teal", // Default, not in backend
      projectCount: "", // Default, not in backend
      duration: program.duration || "",
      level: program.about === "closed" ? "Closed" : "Open",
      description: program.description || "",
      skills: [], // Default, not in backend
      email: program.email || "info@stempower.org",
      startDate: program.start_date
        ? (() => {
            const date = new Date(program.start_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          })()
        : null,
      image: program.image || null,
      googleFormLink: program.google_form_link || null,
      status: program.status || "free",
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
      "/api/digital-skill-training/stats"
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
