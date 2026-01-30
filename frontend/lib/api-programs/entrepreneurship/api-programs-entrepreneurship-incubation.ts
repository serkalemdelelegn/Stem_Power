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
  incubationProgramId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendCourse {
  id: string;
  program_title: string;
  about: "open" | "closed";
  status: "free" | "paid";
  duration: string | null;
  start_date: string | null;
  description: string | null;
  email: string;
  google_form_link: string | null;
  incubationProgramId?: string | null;
  createdAt: string;
  updatedAt: string;
  image?: string | null;
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
  image?: string | null;
  incubationProgramId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendSuccessStory {
  id: string;
  business_name: string;
  license_status: string | null;
  category: string;
  category_color: string | null;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  icon: string | null;
  incubationProgramId?: string | null;
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

export interface IncubationPhase {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  icon: string;
  iconColor: string;
  order?: number;
  badge?: string;
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

export interface SuccessStory {
  id: string;
  name: string;
  licenseStatus: string;
  category: string;
  contactPerson: string;
  phone: string | null;
  email: string | null;
}

// ===== Transform Functions =====

function transformHero(backendHero: BackendHero): HeroData {
  return {
    title: backendHero.title || "Incubation Program",
    description:
      backendHero.description ||
      "Transform your innovative ideas into successful, sustainable ventures with comprehensive support, mentorship, and resources.",
  };
}

function transformStat(backendStat: BackendStat): ImpactStat {
  return {
    number: backendStat.value,
    label: backendStat.title,
    icon: backendStat.icon?.toLowerCase() || "rocket", // Return lowercase icon name/key
  };
}

function transformCourse(backendCourse: BackendCourse): IncubationPhase {
  // Map course fields to phase format
  // Note: Backend doesn't have icon, iconColor, order, badge
  // These will need to be added to backend or use defaults
  return {
    id: backendCourse.id,
    title: backendCourse.program_title,
    description: backendCourse.description,
    duration: backendCourse.duration || null,
    icon: "fileText", // Default, should be added to backend
    iconColor: "teal", // Default, should be added to backend
    order: 0, // Default, should be added to backend
    badge: undefined,
  };
}

function transformProgram(backendProgram: BackendProgram): ApplicationProgram {
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
    image: backendProgram.image || "", // Default image
    status:
      backendProgram.about === "open"
        ? "Applications Open"
        : "Applications Closed",
    googleFormUrl: backendProgram.google_form_link || "",
  };
}

function transformSuccessStory(
  backendStory: BackendSuccessStory
): SuccessStory {
  return {
    id: backendStory.id,
    name: backendStory.business_name,
    licenseStatus: backendStory.license_status || "Active",
    category: backendStory.category,
    contactPerson: backendStory.contact_person || "",
    phone: backendStory.phone,
    email: backendStory.email,
  };
}

// ===== Fetch Functions =====

/**
 * Fetch hero data from dedicated hero endpoint
 */
export async function fetchHero(): Promise<HeroData | null> {
  try {
    const response = await backendApi.get("/api/incubation-program/hero");
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
      "/api/incubation-program/stats"
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

export async function fetchIncubationPhases(): Promise<IncubationPhase[]> {
  try {
    const backendCourses: BackendCourse[] = await backendApi.get(
      "/api/incubation-program/courses"
    );
    // Backend returns array directly
    if (!Array.isArray(backendCourses) || backendCourses.length === 0) {
      return [];
    }
    return backendCourses.map(transformCourse);
  } catch (error) {
    console.error("Error fetching incubation phases:", error);
    return [];
  }
}

export async function fetchApplicationPrograms(): Promise<
  ApplicationProgram[]
> {
  try {
    const backendCourses: BackendCourse[] = await backendApi.get(
      "/api/incubation-program/courses"
    );
    // Backend returns array directly
    if (!Array.isArray(backendCourses) || backendCourses.length === 0) {
      return [];
    }
    // Filter for open courses and transform
    // Transform courses to application programs (courses have same structure as programs)
    return backendCourses
      .filter((course) => course.about === "open")
      .map((course) => {
        // Format start_date to readable format
        const startDate = course.start_date
          ? new Date(course.start_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "TBA";

        return {
          title: course.program_title,
          duration: course.duration || "TBA",
          description: course.description || "",
          startDate: startDate,
          email: course.email,
          image: course.image || "", // Default image (courses don't have image field)
          status:
            course.about === "open"
              ? "Applications Open"
              : "Applications Closed",
          googleFormUrl: course.google_form_link || "",
        };
      });
  } catch (error) {
    console.error("Error fetching application programs:", error);
    return [];
  }
}

export async function fetchSuccessStories(): Promise<SuccessStory[]> {
  try {
    const backendStories: BackendSuccessStory[] = await backendApi.get(
      "/api/incubation-program/success-stories"
    );
    // Backend returns array directly
    if (!Array.isArray(backendStories) || backendStories.length === 0) {
      return [];
    }
    return backendStories.map(transformSuccessStory);
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return [];
  }
}

// ===== Admin CRUD Functions =====

// Admin interfaces
export interface AdminHero {
  title: string;
  description: string;
}

export interface AdminStat {
  id: string;
  icon: string;
  value: string;
  label: string;
}

export interface AdminPhase {
  id: string;
  title: string;
  duration: string;
  badge: string;
  description: string;
  icon: string;
  iconColor: string;
  email?: string;
  startDate?: string | null;
  image?: string | File | null;
  googleFormLink?: string | null;
  imagePreview?: string; // For displaying preview of File objects
}

export interface AdminSuccessStory {
  id: string;
  businessName: string;
  licenseStatus: string;
  category: string;
  categoryColor: string;
  contactPerson: string;
  phone: string;
  email: string;
}

// Hero CRUD
export async function createHero(heroData: AdminHero): Promise<BackendHero> {
  const response = await backendApi.post(
    "/api/incubation-program/hero",
    heroData
  );
  return response.data;
}

export async function updateHero(
  id: string,
  heroData: Partial<AdminHero>
): Promise<BackendHero> {
  const response = await backendApi.put(
    `/api/incubation-program/hero/${id}`,
    heroData
  );
  return response.data;
}

// Helper to get hero ID for updates
export async function getHeroId(): Promise<string | null> {
  try {
    const response = await backendApi.get("/api/incubation-program/hero");
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
    "/api/incubation-program/stats",
    statData
  );
  return response;
}

export async function updateStatistic(
  id: string,
  statData: Partial<{ title: string; value: string; icon?: string | null }>
): Promise<BackendStat> {
  const response = await backendApi.put(
    `/api/incubation-program/stats/${id}`,
    statData
  );
  return response;
}

export async function deleteStatistic(id: string): Promise<void> {
  await backendApi.delete(`/api/incubation-program/stats/${id}`);
}

// Phases CRUD (backend uses "courses")
// Note: Backend doesn't support icon, iconColor, badge - these are frontend-only
export async function createPhase(phaseData: {
  program_title: string;
  duration?: string | null;
  description?: string | null;
  email: string;
  about: "open" | "closed";
  status: "free" | "paid";
  start_date?: string | null;
  google_form_link?: string | null;
  image?: string | File | null;
}): Promise<BackendCourse> {
  // If image is a File, upload using FormData
  if (phaseData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", phaseData.image);
    formData.append("program_title", phaseData.program_title);
    formData.append("email", phaseData.email);
    formData.append("about", phaseData.about);
    formData.append("status", phaseData.status);
    if (phaseData.duration) formData.append("duration", phaseData.duration);
    if (phaseData.description)
      formData.append("description", phaseData.description);
    if (phaseData.start_date)
      formData.append("start_date", phaseData.start_date);
    if (phaseData.google_form_link)
      formData.append("google_form_link", phaseData.google_form_link);
    const response = await backendApi.postFormData(
      "/api/incubation-program/courses",
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {
    program_title: phaseData.program_title,
    email: phaseData.email,
    about: phaseData.about,
    status: phaseData.status,
    duration: phaseData.duration || null,
    description: phaseData.description || null,
    start_date: phaseData.start_date || null,
    google_form_link: phaseData.google_form_link || null,
  };
  if (phaseData.image !== undefined) {
    jsonData.image = phaseData.image;
  }
  const response = await backendApi.post(
    "/api/incubation-program/courses",
    jsonData
  );
  return response;
}

export async function updatePhase(
  id: string,
  phaseData: Partial<{
    program_title?: string;
    duration?: string | null;
    description?: string | null;
    email?: string;
    about?: "open" | "closed";
    status?: "free" | "paid";
    start_date?: string | null;
    google_form_link?: string | null;
    image?: string | File | null;
  }>
): Promise<BackendCourse> {
  // If image is a File, upload using FormData
  if (phaseData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", phaseData.image);
    if (phaseData.program_title)
      formData.append("program_title", phaseData.program_title);
    if (phaseData.email) formData.append("email", phaseData.email);
    if (phaseData.about) formData.append("about", phaseData.about);
    if (phaseData.status) formData.append("status", phaseData.status);
    if (phaseData.duration !== undefined)
      formData.append("duration", phaseData.duration || "");
    if (phaseData.description !== undefined)
      formData.append("description", phaseData.description || "");
    if (phaseData.start_date !== undefined)
      formData.append("start_date", phaseData.start_date || "");
    if (phaseData.google_form_link !== undefined)
      formData.append("google_form_link", phaseData.google_form_link || "");
    const response = await backendApi.putFormData(
      `/api/incubation-program/courses/${id}`,
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {};
  if (phaseData.program_title !== undefined)
    jsonData.program_title = phaseData.program_title;
  if (phaseData.email !== undefined) jsonData.email = phaseData.email;
  if (phaseData.about !== undefined) jsonData.about = phaseData.about;
  if (phaseData.status !== undefined) jsonData.status = phaseData.status;
  if (phaseData.duration !== undefined)
    jsonData.duration = phaseData.duration || null;
  if (phaseData.description !== undefined)
    jsonData.description = phaseData.description || null;
  if (phaseData.start_date !== undefined)
    jsonData.start_date = phaseData.start_date || null;
  if (phaseData.google_form_link !== undefined)
    jsonData.google_form_link = phaseData.google_form_link || null;
  if (phaseData.image !== undefined) jsonData.image = phaseData.image;

  const response = await backendApi.put(
    `/api/incubation-program/courses/${id}`,
    jsonData
  );
  return response;
}

export async function deletePhase(id: string): Promise<void> {
  await backendApi.delete(`/api/incubation-program/courses/${id}`);
}

// Success Stories CRUD
export async function createSuccessStory(storyData: {
  business_name: string;
  license_status?: string | null;
  category: string;
  category_color?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  email?: string | null;
}): Promise<BackendSuccessStory> {
  const response = await backendApi.post(
    "/api/incubation-program/success-stories",
    storyData
  );
  return response;
}

export async function updateSuccessStory(
  id: string,
  storyData: Partial<{
    business_name: string;
    license_status?: string | null;
    category?: string;
    category_color?: string | null;
    contact_person?: string | null;
    phone?: string | null;
    email?: string | null;
  }>
): Promise<BackendSuccessStory> {
  const response = await backendApi.put(
    `/api/incubation-program/success-stories/${id}`,
    storyData
  );
  return response;
}

export async function deleteSuccessStory(id: string): Promise<void> {
  await backendApi.delete(`/api/incubation-program/success-stories/${id}`);
}

// Fetch phases for admin (with all fields)
export async function fetchAdminPhases(): Promise<AdminPhase[]> {
  try {
    const backendCourses: BackendCourse[] = await backendApi.get(
      "/api/incubation-program/courses"
    );
    if (!Array.isArray(backendCourses)) {
      return [];
    }
    return backendCourses.map((course: BackendCourse) => ({
      id: course.id,
      title: course.program_title || "",
      duration: course.duration || "",
      badge: "", // Not in backend
      description: course.description || "",
      icon: "fileText", // Default, not in backend
      iconColor: "teal", // Default, not in backend
      email: course.email || "info@stempower.org",
      startDate: course.start_date
        ? (() => {
            const date = new Date(course.start_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          })()
        : null,
      image: course.image || null,
      googleFormLink: course.google_form_link || null,
    }));
  } catch (error) {
    console.error("Error fetching admin phases:", error);
    return [];
  }
}

// Fetch statistics for admin
export async function fetchAdminStatistics(): Promise<AdminStat[]> {
  try {
    const backendStats: BackendStat[] = await backendApi.get(
      "/api/incubation-program/stats"
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

// Fetch success stories for admin
export async function fetchAdminSuccessStories(): Promise<AdminSuccessStory[]> {
  try {
    const backendStories: BackendSuccessStory[] = await backendApi.get(
      "/api/incubation-program/success-stories"
    );
    if (!Array.isArray(backendStories)) {
      return [];
    }
    return backendStories.map((story: BackendSuccessStory) => ({
      id: story.id,
      businessName: story.business_name,
      licenseStatus: story.license_status || "Licensed",
      category: story.category,
      categoryColor: story.category_color || "blue",
      contactPerson: story.contact_person || "",
      phone: story.phone || "",
      email: story.email || "",
    }));
  } catch (error) {
    console.error("Error fetching admin success stories:", error);
    return [];
  }
}
