import { backendApi } from "./backend-api";

// ===== Backend Interfaces =====

interface BackendEvent {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  location: string | null;
  is_virtual: boolean;
  event_url: string | null;
  image_url: string | null;
  image?: string | null; // Mapped from image_url in controller
  is_active: boolean;
  category: string | null;
  badge: string | null;
  status: "upcoming" | "past" | null;
  featured: boolean;
  time: string | null;
  participants: string | null;
  registrationLink: string | null;
  registrationDeadline: string | null;
  fullDescription: string | null;
  highlights: string | string[] | null;
  date?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendEventsHero {
  id: string;
  badge: string;
  title: string;
  description: string | null;
  image: string | null;
  stat1Icon: string | null;
  stat1Value: string | null;
  stat1Label: string | null;
  stat2Icon: string | null;
  stat2Value: string | null;
  stat2Label: string | null;
  stat3Icon: string | null;
  stat3Value: string | null;
  stat3Label: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface Event {
  id: string;
  title: string;
  badge?: string;
  description: string;
  fullDescription?: string;
  image?: string;
  gallery?: string[];
  date: string;
  endDate?: string;
  time: string;
  location: string;
  category: string;
  participants?: string;
  status: "upcoming" | "past";
  featured?: boolean;
  registrationLink?: string;
  registrationDeadline?: string;
  highlights?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EventsHeroStat {
  id: string;
  icon: string;
  value: string;
  label: string;
}

export interface EventsHero {
  badge: string;
  title: string;
  description: string;
  image?: string;
  statistics: EventsHeroStat[];
}

// ===== Fallback Data =====

const fallbackHero: EventsHero = {
  badge: "STEMpower Ethiopia Events",
  title: "Join Our STEM Community Events",
  description:
    "Discover workshops, competitions, and networking opportunities designed to advance STEM education and innovation across Ethiopia.",
  image: "/students-with-science-fair-awards.jpg",
  statistics: [
    { id: "stat-1", icon: "calendar", value: "50+", label: "Annual Events" },
    { id: "stat-2", icon: "users", value: "10,000+", label: "Participants" },
    { id: "stat-3", icon: "star", value: "25+", label: "Competitions Hosted" },
  ],
};

// ===== Helper Functions =====

/**
 * Format date to string
 */
function formatDate(date: string | Date | null): string {
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

/**
 * Format time from date or use provided time string
 */
function formatTime(
  startDate: string | null,
  timeString: string | null
): string {
  if (timeString) {
    return timeString;
  }
  if (startDate) {
    const date = new Date(startDate);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return "TBA";
}

/**
 * Determine event status based on end date
 */
function determineStatus(
  endDate: string | null,
  providedStatus: string | null
): "upcoming" | "past" {
  if (providedStatus === "upcoming" || providedStatus === "past") {
    return providedStatus;
  }
  if (endDate) {
    const end = new Date(endDate);
    const now = new Date();
    return end < now ? "past" : "upcoming";
  }
  return "upcoming";
}

// ===== Transform Functions =====

function transformEvent(backendEvent: BackendEvent): Event {
  const date = backendEvent.date || formatDate(backendEvent.start_date);
  const endDate =
    backendEvent.endDate ||
    (backendEvent.end_date ? formatDate(backendEvent.end_date) : undefined);
  const time = formatTime(backendEvent.start_date, backendEvent.time);
  const status = determineStatus(backendEvent.end_date, backendEvent.status);

  // Parse highlights
  let highlights: string[] = [];
  if (backendEvent.highlights) {
    if (Array.isArray(backendEvent.highlights)) {
      highlights = backendEvent.highlights;
    } else if (typeof backendEvent.highlights === "string") {
      try {
        highlights = JSON.parse(backendEvent.highlights);
      } catch (e) {
        highlights = [];
      }
    }
  }

  return {
    id: String(backendEvent.id),
    title: backendEvent.title,
    badge: backendEvent.badge || undefined,
    description: backendEvent.description || "",
    fullDescription: backendEvent.fullDescription || undefined,
    image: backendEvent.image || backendEvent.image_url || undefined,
    date,
    endDate,
    time,
    location: backendEvent.location || "TBA",
    category: backendEvent.category || "Event",
    participants: backendEvent.participants || undefined,
    status,
    featured: backendEvent.featured || false,
    registrationLink:
      backendEvent.registrationLink || backendEvent.event_url || undefined,
    registrationDeadline: backendEvent.registrationDeadline || undefined,
    highlights: highlights.length > 0 ? highlights : undefined,
    createdAt: backendEvent.createdAt,
    updatedAt: backendEvent.updatedAt,
  };
}

function transformHero(backendHero: BackendEventsHero): EventsHero {
  const statistics: EventsHeroStat[] = [];

  if (backendHero.stat1Value && backendHero.stat1Label) {
    statistics.push({
      id: "stat-1",
      icon: backendHero.stat1Icon || "calendar",
      value: backendHero.stat1Value,
      label: backendHero.stat1Label,
    });
  }

  if (backendHero.stat2Value && backendHero.stat2Label) {
    statistics.push({
      id: "stat-2",
      icon: backendHero.stat2Icon || "users",
      value: backendHero.stat2Value,
      label: backendHero.stat2Label,
    });
  }

  if (backendHero.stat3Value && backendHero.stat3Label) {
    statistics.push({
      id: "stat-3",
      icon: backendHero.stat3Icon || "star",
      value: backendHero.stat3Value,
      label: backendHero.stat3Label,
    });
  }

  return {
    badge: backendHero.badge || fallbackHero.badge,
    title: backendHero.title || fallbackHero.title,
    description: backendHero.description || fallbackHero.description,
    image: backendHero.image || undefined,
    statistics: statistics.length > 0 ? statistics : fallbackHero.statistics,
  };
}

// ===== Fetch Functions =====

/**
 * Fetch all events from backend, with fallback to empty array
 */
export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await backendApi.get("/api/events");
    const backendEvents: BackendEvent[] = Array.isArray(response)
      ? response
      : [];

    if (backendEvents.length === 0) {
      return [];
    }

    return backendEvents.map(transformEvent);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

/**
 * Fetch events hero from backend, with fallback to static data
 */
export async function fetchEventsHero(): Promise<EventsHero> {
  try {
    const response = await backendApi.get("/api/events/hero");
    const backendHeroes: BackendEventsHero[] = Array.isArray(response)
      ? response
      : [];

    if (backendHeroes.length === 0) {
      return fallbackHero;
    }

    // Get the most recent hero (first in DESC order)
    return transformHero(backendHeroes[0]);
  } catch (error) {
    console.error("Error fetching events hero:", error);
    return fallbackHero;
  }
}
