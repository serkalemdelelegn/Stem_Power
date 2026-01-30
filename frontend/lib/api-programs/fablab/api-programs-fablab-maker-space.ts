import { backendApi } from "../../backend-api";
import {
  Printer,
  Users,
  Lightbulb,
  Award,
  Cpu,
  Palette,
  UsersRound,
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

interface BackendMakerSpace {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  hero_image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendStat {
  id: string;
  title: string;
  value: string;
  makerSpaceId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendGallery {
  id: string;
  image_url: string;
  caption: string | null;
  makerSpaceId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendWorkshop {
  id: string;
  date: string;
  title: string;
  level: string;
  duration: string | null;
  location: string | null;
  description: string | null;
  registration_link: string | null;
  workshop_image: string | null;
  makerSpaceId?: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  category: string | null;
  makerSpaceId?: number;
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

export interface GalleryItem {
  id: string;
  image: string;
  caption?: string;
}

export interface Workshop {
  registrationLink: string;
  id: string;
  date: string;
  title: string;
  level: string;
  duration: string;
  location: string;
  image: string;
  description: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  category?: string;
}

// ===== Icon Mapping =====

const iconNameToComponent: Record<string, LucideIcon> = {
  users: Users,
  lightbulb: Lightbulb,
  award: Award,
  printer: Printer,
  cpu: Cpu,
  palette: Palette,
  "users-round": UsersRound,
  sparkles: Sparkles,
};

// ===== Transform Functions =====

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
  // Try to match icon from title or use default
  const titleLower = backendStat.title.toLowerCase();
  let icon: LucideIcon = Award;

  if (titleLower.includes("printer") || titleLower.includes("3d")) {
    icon = Printer;
  } else if (titleLower.includes("student") || titleLower.includes("user")) {
    icon = Users;
  } else if (titleLower.includes("project") || titleLower.includes("light")) {
    icon = Lightbulb;
  } else if (titleLower.includes("mentor") || titleLower.includes("award")) {
    icon = Award;
  }

  return {
    number: backendStat.value,
    label: backendStat.title,
    icon,
  };
}

function transformGallery(backendGallery: BackendGallery): GalleryItem {
  return {
    id: backendGallery.id,
    image: backendGallery.image_url,
    caption: backendGallery.caption || undefined,
  };
}

function transformWorkshop(backendWorkshop: BackendWorkshop): Workshop {
  // Format date from ISO string to readable format
  let formattedDate = backendWorkshop.date;
  try {
    const date = new Date(backendWorkshop.date);
    if (!isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  } catch {
    // Keep original if parsing fails
  }

  return {
    id: backendWorkshop.id,
    date: formattedDate,
    title: backendWorkshop.title,
    level: backendWorkshop.level || "",
    duration: backendWorkshop.duration || "",
    location: backendWorkshop.location || "",
    image: backendWorkshop.workshop_image || "",
    description: backendWorkshop.description || "",
    registrationLink: backendWorkshop.registration_link || "",
  };
}

function transformFeature(backendFeature: BackendFeature): Feature {
  // Map icon string to LucideIcon component
  const iconName = backendFeature.icon?.toLowerCase() || "sparkles";
  const iconComponent = iconNameToComponent[iconName] || Sparkles;

  return {
    title: backendFeature.title,
    description: backendFeature.description,
    icon: iconComponent,
    image: backendFeature.image,
    category: backendFeature.category || undefined,
  };
}

// ===== Fetch Functions =====

/**
 * Fetch hero content from backend
 */
export async function fetchHero(): Promise<HeroContent | null> {
  try {
    const response = await backendApi.get("/api/maker-space/hero");
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
    const response = await backendApi.get("/api/maker-space/stats");
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
 * Fetch gallery items from backend
 */
export async function fetchGallery(): Promise<GalleryItem[]> {
  try {
    const response = await backendApi.get("/api/maker-space/gallery");
    const backendGallery: BackendGallery[] = Array.isArray(response)
      ? response
      : [];

    if (backendGallery.length === 0) {
      return [];
    }

    return backendGallery.map(transformGallery);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }
}

/**
 * Fetch workshops from backend
 */
export async function fetchWorkshops(): Promise<Workshop[]> {
  try {
    const response = await backendApi.get("/api/maker-space/workshops");
    const backendWorkshops: BackendWorkshop[] = Array.isArray(response)
      ? response
      : [];

    if (backendWorkshops.length === 0) {
      return [];
    }

    return backendWorkshops.map(transformWorkshop);
  } catch (error) {
    console.error("Error fetching workshops:", error);
    return [];
  }
}

/**
 * Fetch maker space features from backend
 */
export async function fetchMakerSpaceItems(): Promise<Feature[]> {
  try {
    const response = await backendApi.get("/api/maker-space/features");
    const backendFeatures: BackendFeature[] = Array.isArray(response)
      ? response
      : [];

    if (backendFeatures.length === 0) {
      return [];
    }

    return backendFeatures.map(transformFeature);
  } catch (error) {
    console.error("Error fetching maker space features:", error);
    return [];
  }
}

// ===== Admin CRUD Functions =====

// Admin interfaces
export interface AdminHero {
  badge: string;
  title: string;
  description: string;
  image: string;
}

export interface AdminStat {
  id: string;
  icon: string;
  number: string;
  label: string;
}

export interface AdminGalleryImage {
  id: string;
  image: string;
  caption?: string;
}

export interface AdminWorkshop {
  id: string;
  date: string;
  title: string;
  level: string;
  duration: string;
  location: string;
  description: string;
  image: string;
  registrationLink: string;
}

export interface AdminFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
}

// Hero CRUD
export async function createHero(heroData: {
  badge: string;
  title: string;
  description: string;
  image?: string | File | null;
}): Promise<BackendHero> {
  // If image is a File, upload using FormData
  if (heroData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", heroData.image);
    formData.append("badge", heroData.badge);
    formData.append("title", heroData.title);
    formData.append("description", heroData.description);
    const response = await backendApi.postFormData(
      "/api/maker-space/hero",
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {
    badge: heroData.badge,
    title: heroData.title,
    description: heroData.description,
  };
  if (heroData.image !== undefined) {
    jsonData.image = heroData.image;
  }
  const response = await backendApi.post("/api/maker-space/hero", jsonData);
  return response;
}

export async function updateHero(
  id: string,
  heroData: Partial<{
    badge?: string;
    title?: string;
    description?: string;
    image?: string | File | null;
  }>
): Promise<BackendHero> {
  // If image is a File, upload using FormData
  if (heroData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", heroData.image);
    if (heroData.badge) formData.append("badge", heroData.badge);
    if (heroData.title) formData.append("title", heroData.title);
    if (heroData.description)
      formData.append("description", heroData.description);
    const response = await backendApi.putFormData(
      `/api/maker-space/hero/${id}`,
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {};
  if (heroData.badge !== undefined) jsonData.badge = heroData.badge;
  if (heroData.title !== undefined) jsonData.title = heroData.title;
  if (heroData.description !== undefined)
    jsonData.description = heroData.description;
  if (heroData.image !== undefined) jsonData.image = heroData.image;

  const response = await backendApi.put(
    `/api/maker-space/hero/${id}`,
    jsonData
  );
  return response;
}

// Helper to get hero ID for updates
export async function getHeroId(): Promise<string | null> {
  try {
    const heroes: BackendHero[] = await backendApi.get("/api/maker-space/hero");
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
}): Promise<BackendStat> {
  const response = await backendApi.post("/api/maker-space/stats", statData);
  return response;
}

export async function updateStatistic(
  id: string,
  statData: Partial<{ title: string; value: string }>
): Promise<BackendStat> {
  const response = await backendApi.put(
    `/api/maker-space/stats/${id}`,
    statData
  );
  return response;
}

export async function deleteStatistic(id: string): Promise<void> {
  await backendApi.delete(`/api/maker-space/stats/${id}`);
}

// Gallery CRUD
export async function createGalleryImage(galleryData: {
  image_url?: string | File | null;
  caption?: string | null;
}): Promise<BackendGallery> {
  // If image_url is a File, upload using FormData
  if (galleryData.image_url instanceof File) {
    const formData = new FormData();
    formData.append("file", galleryData.image_url);
    if (galleryData.caption) {
      formData.append("caption", galleryData.caption);
    }
    const response = await backendApi.postFormData(
      "/api/maker-space/gallery",
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {
    caption: galleryData.caption || null,
  };
  if (galleryData.image_url !== undefined) {
    jsonData.image_url = galleryData.image_url;
  }
  const response = await backendApi.post("/api/maker-space/gallery", jsonData);
  return response;
}

export async function updateGalleryImage(
  id: string,
  galleryData: Partial<{
    image_url?: string | File | null;
    caption?: string | null;
  }>
): Promise<BackendGallery> {
  // If image_url is a File, upload using FormData
  if (galleryData.image_url instanceof File) {
    const formData = new FormData();
    formData.append("file", galleryData.image_url);
    if (galleryData.caption !== undefined) {
      formData.append("caption", galleryData.caption || "");
    }
    const response = await backendApi.putFormData(
      `/api/maker-space/gallery/${id}`,
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {};
  if (galleryData.caption !== undefined)
    jsonData.caption = galleryData.caption || null;
  if (galleryData.image_url !== undefined)
    jsonData.image_url = galleryData.image_url;

  const response = await backendApi.put(
    `/api/maker-space/gallery/${id}`,
    jsonData
  );
  return response;
}

export async function deleteGalleryImage(id: string): Promise<void> {
  await backendApi.delete(`/api/maker-space/gallery/${id}`);
}

// Workshops CRUD
export async function createWorkshop(workshopData: {
  date: string; // ISO date string or formatted date
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  duration?: string | null;
  location?: string | null;
  description?: string | null;
  registration_link?: string | null;
  workshop_image?: string | File | null;
}): Promise<BackendWorkshop> {
  // Convert date string to ISO if needed
  // Try to parse the date - it might be in "Oct 12, 2025" format or ISO format
  let dateISO: string;
  try {
    const parsedDate = new Date(workshopData.date);
    if (!isNaN(parsedDate.getTime())) {
      dateISO = parsedDate.toISOString();
    } else {
      // If parsing fails, use current date
      dateISO = new Date().toISOString();
    }
  } catch {
    dateISO = new Date().toISOString();
  }

  // If workshop_image is a File, upload using FormData
  if (workshopData.workshop_image instanceof File) {
    const formData = new FormData();
    formData.append("file", workshopData.workshop_image);
    formData.append("date", dateISO);
    formData.append("title", workshopData.title);
    formData.append("level", workshopData.level);
    if (workshopData.duration)
      formData.append("duration", workshopData.duration);
    if (workshopData.location)
      formData.append("location", workshopData.location);
    if (workshopData.description)
      formData.append("description", workshopData.description);
    if (workshopData.registration_link)
      formData.append("registration_link", workshopData.registration_link);
    const response = await backendApi.postFormData(
      "/api/maker-space/workshops",
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const backendData: any = {
    date: dateISO,
    title: workshopData.title,
    level: workshopData.level,
    duration: workshopData.duration || null,
    location: workshopData.location || null,
    description: workshopData.description || null,
    registration_link: workshopData.registration_link || null,
  };
  if (workshopData.workshop_image !== undefined) {
    backendData.workshop_image = workshopData.workshop_image;
  }
  const response = await backendApi.post(
    "/api/maker-space/workshops",
    backendData
  );
  return response;
}

export async function updateWorkshop(
  id: string,
  workshopData: Partial<{
    date?: string;
    title?: string;
    level?: "beginner" | "intermediate" | "advanced";
    duration?: string | null;
    location?: string | null;
    description?: string | null;
    registration_link?: string | null;
    workshop_image?: string | File | null;
  }>
): Promise<BackendWorkshop> {
  // If workshop_image is a File, upload using FormData
  if (workshopData.workshop_image instanceof File) {
    const formData = new FormData();
    formData.append("file", workshopData.workshop_image);
    if (workshopData.date) {
      try {
        const parsedDate = new Date(workshopData.date);
        if (!isNaN(parsedDate.getTime())) {
          formData.append("date", parsedDate.toISOString());
        } else {
          formData.append("date", workshopData.date);
        }
      } catch {
        formData.append("date", workshopData.date);
      }
    }
    if (workshopData.title) formData.append("title", workshopData.title);
    if (workshopData.level) formData.append("level", workshopData.level);
    if (workshopData.duration !== undefined)
      formData.append("duration", workshopData.duration || "");
    if (workshopData.location !== undefined)
      formData.append("location", workshopData.location || "");
    if (workshopData.description !== undefined)
      formData.append("description", workshopData.description || "");
    if (workshopData.registration_link !== undefined)
      formData.append(
        "registration_link",
        workshopData.registration_link || ""
      );
    const response = await backendApi.putFormData(
      `/api/maker-space/workshops/${id}`,
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const backendData: any = {};
  if (workshopData.date) {
    try {
      const parsedDate = new Date(workshopData.date);
      if (!isNaN(parsedDate.getTime())) {
        backendData.date = parsedDate.toISOString();
      } else {
        backendData.date = workshopData.date;
      }
    } catch {
      backendData.date = workshopData.date;
    }
  }
  if (workshopData.title !== undefined) backendData.title = workshopData.title;
  if (workshopData.level !== undefined) backendData.level = workshopData.level;
  if (workshopData.duration !== undefined)
    backendData.duration = workshopData.duration || null;
  if (workshopData.location !== undefined)
    backendData.location = workshopData.location || null;
  if (workshopData.description !== undefined)
    backendData.description = workshopData.description || null;
  if (workshopData.registration_link !== undefined)
    backendData.registration_link = workshopData.registration_link || null;
  if (workshopData.workshop_image !== undefined)
    backendData.workshop_image = workshopData.workshop_image;

  const response = await backendApi.put(
    `/api/maker-space/workshops/${id}`,
    backendData
  );
  return response;
}

export async function deleteWorkshop(id: string): Promise<void> {
  await backendApi.delete(`/api/maker-space/workshops/${id}`);
}

// Features CRUD (Maker Space Items/Highlights)
export async function createFeature(featureData: {
  title: string;
  description: string;
  icon: string;
  image?: string | File | null;
  category?: string | null;
}): Promise<BackendFeature> {
  // If image is a File, upload using FormData
  if (featureData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", featureData.image);
    formData.append("title", featureData.title);
    formData.append("description", featureData.description);
    formData.append("icon", featureData.icon);
    if (featureData.category) {
      formData.append("category", featureData.category);
    }
    const response = await backendApi.postFormData(
      "/api/maker-space/features",
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {
    title: featureData.title,
    description: featureData.description,
    icon: featureData.icon,
    category: featureData.category || null,
  };
  if (featureData.image !== undefined) {
    jsonData.image = featureData.image;
  }
  const response = await backendApi.post("/api/maker-space/features", jsonData);
  return response;
}

export async function updateFeature(
  id: string,
  featureData: Partial<{
    title?: string;
    description?: string;
    icon?: string;
    image?: string | File | null;
    category?: string | null;
  }>
): Promise<BackendFeature> {
  // If image is a File, upload using FormData
  if (featureData.image instanceof File) {
    const formData = new FormData();
    formData.append("file", featureData.image);
    if (featureData.title) formData.append("title", featureData.title);
    if (featureData.description)
      formData.append("description", featureData.description);
    if (featureData.icon) formData.append("icon", featureData.icon);
    if (featureData.category !== undefined) {
      formData.append("category", featureData.category || "");
    }
    const response = await backendApi.putFormData(
      `/api/maker-space/features/${id}`,
      formData
    );
    return response;
  }

  // Otherwise, send as JSON (for URL strings or null)
  const jsonData: any = {};
  if (featureData.title !== undefined) jsonData.title = featureData.title;
  if (featureData.description !== undefined)
    jsonData.description = featureData.description;
  if (featureData.icon !== undefined) jsonData.icon = featureData.icon;
  if (featureData.category !== undefined)
    jsonData.category = featureData.category || null;
  if (featureData.image !== undefined) jsonData.image = featureData.image;

  const response = await backendApi.put(
    `/api/maker-space/features/${id}`,
    jsonData
  );
  return response;
}

export async function deleteFeature(id: string): Promise<void> {
  await backendApi.delete(`/api/maker-space/features/${id}`);
}

// Fetch functions for admin (with all fields)
export async function fetchAdminHero(): Promise<AdminHero | null> {
  try {
    const heroes: BackendHero[] = await backendApi.get("/api/maker-space/hero");
    if (!Array.isArray(heroes) || heroes.length === 0) {
      return null;
    }
    const hero = heroes[0];
    return {
      badge: hero.badge || "",
      title: hero.title || "",
      description: hero.description || "",
      image: hero.image || "",
    };
  } catch (error) {
    console.error("Error fetching admin hero:", error);
    return null;
  }
}

export async function fetchAdminStatistics(): Promise<AdminStat[]> {
  try {
    const backendStats: BackendStat[] = await backendApi.get(
      "/api/maker-space/stats"
    );
    if (!Array.isArray(backendStats)) {
      return [];
    }
    return backendStats.map((stat: BackendStat) => {
      // Map icon based on title (similar to transformStat logic)
      const titleLower = stat.title.toLowerCase();
      let icon = "users";
      if (titleLower.includes("printer") || titleLower.includes("3d")) {
        icon = "printer";
      } else if (
        titleLower.includes("student") ||
        titleLower.includes("user")
      ) {
        icon = "users";
      } else if (
        titleLower.includes("project") ||
        titleLower.includes("light")
      ) {
        icon = "lightbulb";
      } else if (
        titleLower.includes("mentor") ||
        titleLower.includes("award")
      ) {
        icon = "award";
      }
      return {
        id: stat.id,
        icon,
        number: stat.value,
        label: stat.title,
      };
    });
  } catch (error) {
    console.error("Error fetching admin statistics:", error);
    return [];
  }
}

export async function fetchAdminGallery(): Promise<AdminGalleryImage[]> {
  try {
    const backendGallery: BackendGallery[] = await backendApi.get(
      "/api/maker-space/gallery"
    );
    if (!Array.isArray(backendGallery)) {
      return [];
    }
    return backendGallery.map((gallery: BackendGallery) => ({
      id: gallery.id,
      image: gallery.image_url,
      caption: gallery.caption || undefined,
    }));
  } catch (error) {
    console.error("Error fetching admin gallery:", error);
    return [];
  }
}

export async function fetchAdminWorkshops(): Promise<AdminWorkshop[]> {
  try {
    const backendWorkshops: BackendWorkshop[] = await backendApi.get(
      "/api/maker-space/workshops"
    );
    if (!Array.isArray(backendWorkshops)) {
      return [];
    }
    return backendWorkshops.map((workshop: BackendWorkshop) => {
      // Format date from ISO to readable format
      let formattedDate = workshop.date;
      try {
        const date = new Date(workshop.date);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
        }
      } catch {
        // Keep original if parsing fails
      }
      return {
        id: workshop.id,
        date: formattedDate,
        title: workshop.title,
        level: workshop.level || "beginner",
        duration: workshop.duration || "",
        location: workshop.location || "",
        description: workshop.description || "",
        image: workshop.workshop_image || "",
        registrationLink: workshop.registration_link || "",
      };
    });
  } catch (error) {
    console.error("Error fetching admin workshops:", error);
    return [];
  }
}

export async function fetchAdminFeatures(): Promise<AdminFeature[]> {
  try {
    const backendFeatures: BackendFeature[] = await backendApi.get(
      "/api/maker-space/features"
    );
    if (!Array.isArray(backendFeatures)) {
      return [];
    }
    return backendFeatures.map((feature: BackendFeature) => ({
      id: feature.id,
      name: feature.title,
      description: feature.description,
      category: feature.category || "",
      image: feature.image,
    }));
  } catch (error) {
    console.error("Error fetching admin features:", error);
    return [];
  }
}
