import { backendApi } from "./backend-api";

// ===== Backend Interfaces =====

interface BackendAnnouncement {
  id: string;
  title: string;
  content: string;
  media_url: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  priority: "low" | "medium" | "high";
  category: string | null;
  type: "update" | "opportunity" | "event" | null;
  location: string | null;
  excerpt: string | null;
  deadline: string | null;
  link: string | null;
  googleFormUrl: string | null;
  eventId: number | null;
  featured: boolean;
  date?: string;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendAnnouncementsHero {
  id: string;
  badge: string;
  title: string;
  description: string | null;
  activeAnnouncements: string | null;
  openOpportunities: string | null;
  upcomingEvents: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface Announcement {
  id: string;
  title: string;
  category: string;
  type: "update" | "opportunity" | "event";
  date: string;
  endDate?: string;
  location: string;
  priority?: "high" | "medium" | "low";
  excerpt: string;
  content: string;
  image: string;
  deadline?: string;
  link?: string;
  googleFormUrl?: string;
  eventId?: string;
  featured?: boolean;
}

export interface AnnouncementsHero {
  badge: string;
  title: string;
  description: string;
  statistics: {
    activeAnnouncements: string;
    openOpportunities: string;
    upcomingEvents: string;
  };
}

// ===== Fallback Data =====

const fallbackHero: AnnouncementsHero = {
  badge: "Stay Informed",
  title: "Announcements & Opportunities",
  description:
    "Stay up to date with official updates, exciting opportunities, and upcoming events from STEMpower Ethiopia. Be the first to know about new programs, job openings, and partnership announcements.",
  statistics: {
    activeAnnouncements: "25+",
    openOpportunities: "10+",
    upcomingEvents: "5+",
  },
};

// ===== Helper Functions =====

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
function formatDateToISO(date: string | Date | null): string {
  if (!date) {
    return new Date().toISOString().split("T")[0];
  }
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toISOString().split("T")[0];
}

/**
 * Format date to display string
 */
function formatDateDisplay(date: string | Date | null): string {
  if (!date) {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ===== Transform Functions =====

function transformAnnouncement(
  backendAnnouncement: BackendAnnouncement
): Announcement {
  const date =
    backendAnnouncement.date || formatDateToISO(backendAnnouncement.start_date);
  const type = backendAnnouncement.type || "update";
  const category =
    backendAnnouncement.category ||
    type.charAt(0).toUpperCase() + type.slice(1);
  const location = backendAnnouncement.location || "Online";
  const excerpt =
    backendAnnouncement.excerpt ||
    backendAnnouncement.content?.substring(0, 200) + "..." ||
    "";

  return {
    id: String(backendAnnouncement.id),
    title: backendAnnouncement.title,
    category,
    type,
    date,
    endDate: backendAnnouncement.end_date
      ? formatDateToISO(backendAnnouncement.end_date)
      : undefined,
    location,
    priority: backendAnnouncement.priority || undefined,
    excerpt,
    content: backendAnnouncement.content,
    image:
      backendAnnouncement.image ||
      backendAnnouncement.media_url ||
      "/placeholder.svg",
    deadline: backendAnnouncement.deadline
      ? formatDateToISO(backendAnnouncement.deadline)
      : undefined,
    link: backendAnnouncement.link || undefined,
    googleFormUrl: backendAnnouncement.googleFormUrl || undefined,
    eventId: backendAnnouncement.eventId
      ? String(backendAnnouncement.eventId)
      : undefined,
    featured: backendAnnouncement.featured || false,
  };
}

function transformHero(
  backendHero: BackendAnnouncementsHero
): AnnouncementsHero {
  return {
    badge: backendHero.badge || fallbackHero.badge,
    title: backendHero.title || fallbackHero.title,
    description: backendHero.description || fallbackHero.description,
    statistics: {
      activeAnnouncements:
        backendHero.activeAnnouncements ||
        fallbackHero.statistics.activeAnnouncements,
      openOpportunities:
        backendHero.openOpportunities ||
        fallbackHero.statistics.openOpportunities,
      upcomingEvents:
        backendHero.upcomingEvents || fallbackHero.statistics.upcomingEvents,
    },
  };
}

// ===== Fetch Functions =====

/**
 * Fetch all active announcements from backend, with fallback to empty array
 */
export async function fetchAnnouncements(): Promise<Announcement[]> {
  try {
    const response = await backendApi.get("/api/announcements");
    const backendAnnouncements: BackendAnnouncement[] = Array.isArray(response)
      ? response
      : [];

    if (backendAnnouncements.length === 0) {
      return [];
    }

    return backendAnnouncements.map(transformAnnouncement);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

/**
 * Fetch announcements hero from backend, with fallback to static data
 */
export async function fetchAnnouncementsHero(): Promise<AnnouncementsHero> {
  try {
    const response = await backendApi.get("/api/announcements/hero");
    const backendHeroes: BackendAnnouncementsHero[] = Array.isArray(response)
      ? response
      : [];

    if (backendHeroes.length === 0) {
      return fallbackHero;
    }

    // Get the most recent hero (first in DESC order)
    return transformHero(backendHeroes[0]);
  } catch (error) {
    console.error("Error fetching announcements hero:", error);
    return fallbackHero;
  }
}
