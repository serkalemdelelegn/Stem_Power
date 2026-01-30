import { backendApi } from "./backend-api";

export function sanitizeMetricKey(label?: string): string {
  if (!label) return "";
  return label
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

// Backend Gallery Item structure
interface BackendGalleryItem {
  category: string;
  location: string;
  participants: number;
  id: string;
  title: string | null;
  caption: string | null;
  media_url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Frontend Gallery Item structure
export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  location: string;
  participants: number;
  createdAt: string;
}

interface ContentItem {
  id: string;
  section: string;
  type: string;
  title: string;
  description: string;
  image?: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Transform backend gallery item to frontend format
function transformGalleryItem(backendItem: BackendGalleryItem): GalleryItem {
  return {
    id: backendItem.id.toString(),
    image: backendItem.media_url || "",
    title: backendItem.title || "Untitled",
    description: backendItem.caption || "",
    category: backendItem.category || "Untitled", // Default category since backend doesn't have this
    location: backendItem.location || "STEM Center", // Default location since backend doesn't have this
    participants: backendItem.participants || 0, // Default participants since backend doesn't have this
    createdAt: backendItem.createdAt,
  };
}

// Gallery API calls
export async function fetchGalleryItems(): Promise<GalleryItem[]> {
  try {
    const backendItems: BackendGalleryItem[] = await backendApi.get(
      "/api/gallery"
    );
    // Filter out inactive items and transform to frontend format
    return backendItems
      .filter((item) => item.isActive !== false)
      .map(transformGalleryItem);
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return [];
  }
}

export async function fetchGalleryItem(
  id: string
): Promise<GalleryItem | null> {
  try {
    const backendItem: BackendGalleryItem = await backendApi.get(
      `/api/gallery/${id}`
    );
    if (!backendItem || backendItem.isActive === false) {
      return null;
    }
    return transformGalleryItem(backendItem);
  } catch (error) {
    console.error("Error fetching gallery item:", error);
    return null;
  }
}

export async function createGalleryItem(
  item: Omit<GalleryItem, "id" | "createdAt">
): Promise<GalleryItem | null> {
  try {
    return await backendApi.post("/api/gallery", item);
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return null;
  }
}

export async function updateGalleryItem(
  id: string,
  item: Partial<GalleryItem>
): Promise<GalleryItem | null> {
  try {
    return await backendApi.put(`/api/gallery/${id}`, item);
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return null;
  }
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  try {
    await backendApi.delete(`/api/gallery/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return false;
  }
}

// Generic content API calls
export async function fetchContent(
  section?: string
): Promise<ContentItem[] | Record<string, ContentItem[]>> {
  try {
    const url = section ? `/api/content?section=${section}` : "/api/content";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch content");
    return response.json();
  } catch (error) {
    console.error("Error fetching content:", error);
    return section ? [] : {};
  }
}

export async function createContent(
  data: Omit<ContentItem, "id" | "createdAt" | "updatedAt">
): Promise<ContentItem | null> {
  try {
    const response = await fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create content");
    return response.json();
  } catch (error) {
    console.error("Error creating content:", error);
    return null;
  }
}

export async function updateContent(
  id: string,
  data: Partial<ContentItem>
): Promise<ContentItem | null> {
  try {
    const response = await fetch(`/api/content/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update content");
    return response.json();
  } catch (error) {
    console.error("Error updating content:", error);
    return null;
  }
}

export async function deleteContent(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/content/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Failed to delete content");
    return true;
  } catch (error) {
    console.error("Error deleting content:", error);
    return false;
  }
}

// Backend Hero structure
interface BackendHero {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image_url: string;
  cta?: string;
  ctaSecondary?: string;
  stat1Label?: string;
  stat1Value?: string;
  stat2Label?: string;
  stat2Value?: string;
  stat3Label?: string;
  stat3Value?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Frontend Hero Slide structure
export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  description?: string;
  stats?: Record<string, string>;
}

// Transform backend hero to frontend format
function transformHero(backendHero: BackendHero): HeroSlide {
  const stats: Record<string, string> = {};
  if (backendHero.stat1Label && backendHero.stat1Value) {
    stats[backendHero.stat1Label] = backendHero.stat1Value;
  }
  if (backendHero.stat2Label && backendHero.stat2Value) {
    stats[backendHero.stat2Label] = backendHero.stat2Value;
  }
  if (backendHero.stat3Label && backendHero.stat3Value) {
    stats[backendHero.stat3Label] = backendHero.stat3Value;
  }

  return {
    image: backendHero.image_url || "/placeholder.svg",
    title: backendHero.title,
    subtitle: backendHero.subtitle,
    description: backendHero.description,
    stats: Object.keys(stats).length ? stats : undefined,
  };
}

// Home API calls
export async function fetchHero(): Promise<HeroSlide[] | null> {
  try {
    const backendHeros: BackendHero[] = await backendApi.get("/api/heroes");
    // Backend returns array directly
    if (!Array.isArray(backendHeros) || backendHeros.length === 0) {
      return null;
    }
    // Filter out inactive heroes and transform to frontend format
    const activeHeros = backendHeros
      .filter((hero) => hero.isActive !== false)
      .map(transformHero);

    return activeHeros.length > 0 ? activeHeros : null;
  } catch (error) {
    console.error("Error fetching hero:", error);
    return null;
  }
}

// Backend Impact structure
interface BackendImpact {
  id: string;
  program_participation: number;
  stem_centers: number;
  events_held: number;
  metadata?: ImpactMetadata;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Frontend Impact Stat structure (simplified - component will handle icons)
export interface ImpactStatData {
  program_participation: number;
  stem_centers: number;
  events_held: number;
  stats?: ImpactMetadataStat[];
  additionalMetrics?: ImpactAdditionalMetric[];
  metadata?: ImpactMetadata;
}

export interface ImpactMetadataStat {
  metricKey?: string;
  title?: string;
  description?: string;
  icon?: string;
  progress?: number;
  trend?: string;
  location?: string;
  value?: number;
  displayValue?: string;
  is_extra?: boolean;
  sort_order?: number;
}

export interface ImpactAdditionalMetric {
  id?: string;
  value: string;
  label: string;
}

export interface ImpactMetadata {
  section?: {
    badge?: string;
    title?: string;
    description?: string;
  };
  stats?: ImpactMetadataStat[];
  additionalMetrics?: ImpactAdditionalMetric[];
}

export async function fetchImpactStats(): Promise<ImpactStatData | null> {
  try {
    const response = await backendApi.get("/api/impact");

    // Normalize different possible response shapes
    const impacts: BackendImpact[] = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : response?.impact
      ? [response.impact]
      : response
      ? [response]
      : [];

    if (!Array.isArray(impacts) || impacts.length === 0) {
      return null;
    }

    // Get the first active impact entry, or use the first one
    const activeImpact =
      impacts.find((impact) => impact.is_active) || impacts[0];

    if (!activeImpact) {
      return null;
    }

    const stats: ImpactMetadataStat[] = Array.isArray(activeImpact.stats)
      ? activeImpact.stats.map((stat: any, idx: number) => ({
          metricKey: stat.metric_key || stat.metricKey || `metric_${idx + 1}`,
          title: stat.title,
          description: stat.description,
          icon: stat.icon,
          progress: stat.progress,
          trend: stat.trend,
          location: stat.location,
          value: stat.value,
          displayValue: stat.display_value || stat.displayValue,
          is_extra: Boolean(stat.is_extra),
          sort_order: stat.sort_order ?? idx,
        }))
      : Array.isArray(activeImpact.metadata?.stats)
      ? activeImpact.metadata.stats
      : [];

    const extraFromStats = stats
      .filter((stat) => stat.is_extra)
      .map((stat) => ({
        id: `${stat.metricKey || "extra"}-extra`,
        value: stat.displayValue || stat.value?.toString() || "",
        label: stat.title || stat.metricKey || "",
      }));

    const additionalMetrics: ImpactAdditionalMetric[] = Array.isArray(
      activeImpact.metadata?.additionalMetrics
    )
      ? activeImpact.metadata.additionalMetrics
      : extraFromStats;

    const primaryStats = stats.filter((stat) => !stat.is_extra);

    const payload: ImpactStatData = {
      program_participation: Number(activeImpact.program_participation) || 0,
      stem_centers: Number(activeImpact.stem_centers) || 0,
      events_held: Number(activeImpact.events_held) || 0,
      stats: primaryStats,
      additionalMetrics,
      metadata: {
        stats: primaryStats,
        additionalMetrics,
      },
    };

    return payload;
  } catch (error) {
    console.error("Error fetching impact stats:", error);
    return null;
  }
}

// Backend Partner structure
interface BackendPartner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Frontend Partner structure
export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
}

// Transform backend partner to frontend format
function transformPartner(backendPartner: BackendPartner): Partner {
  return {
    id: backendPartner.id.toString(),
    name: backendPartner.name,
    logo: backendPartner.logo_url,
    website: backendPartner.website_url || undefined,
    description: undefined, // Not in backend
  };
}

export async function fetchPartners(): Promise<Partner[]> {
  try {
    const backendPartners: BackendPartner[] = await backendApi.get(
      "/api/partners"
    );
    // Filter out inactive partners and transform to frontend format
    return backendPartners
      .filter((partner) => partner.is_active !== false)
      .map(transformPartner);
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
}

// Backend Announcement structure
interface BackendAnnouncement {
  id: string;
  title: string;
  content: string;
  media_url: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

// Frontend Announcement Item structure
export interface AnnouncementItem {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  href: string;
}

// Transform backend announcement to frontend format
function transformAnnouncement(
  backendItem: BackendAnnouncement
): AnnouncementItem {
  // Format date from ISO string to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Create excerpt from content (first 150 characters)
  const excerpt =
    backendItem.content.length > 150
      ? backendItem.content.substring(0, 150) + "..."
      : backendItem.content;

  // Create href from title (slugified)
  const slug = backendItem.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return {
    title: backendItem.title,
    excerpt: excerpt,
    date: formatDate(backendItem.start_date),
    category: "Announcements", // Default category
    image: backendItem.media_url || "/placeholder.svg",
    href: `/latest/news/announcements/${slug}`,
  };
}

// Backend Event structure
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
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Frontend Event structure (matching api-types.ts)
export interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  endDate?: string;
  time: string;
  location: string;
  category: string;
  status: "upcoming" | "past";
  featured?: boolean;
  participants?: string;
  registrationLink?: string;
}

// Transform backend event to frontend format
function transformEvent(backendEvent: BackendEvent): Event {
  const startDate = new Date(backendEvent.start_date);
  const endDate = new Date(backendEvent.end_date);
  const now = new Date();

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Determine status - event is upcoming if end_date hasn't passed yet
  const status: "upcoming" | "past" = endDate >= now ? "upcoming" : "past";

  return {
    id: backendEvent.id.toString(),
    title: backendEvent.title,
    description: backendEvent.description || "",
    image: backendEvent.image_url || undefined,
    date: formatDate(startDate),
    endDate: formatDate(endDate),
    time: formatTime(startDate),
    location:
      backendEvent.location || backendEvent.is_virtual
        ? "Virtual Event"
        : "TBA",
    category: "Workshop", // Default category since backend doesn't have this
    status: status,
    featured: false, // Default to false since backend doesn't have this
    participants: undefined, // Not in backend
    registrationLink: backendEvent.event_url || undefined,
  };
}

// Latest API calls
export async function fetchEvents(): Promise<Event[]> {
  try {
    const response = await backendApi.get("/api/events");

    // Support both array responses and { data: [...] }
    const rawEvents: any[] = Array.isArray(response)
      ? response
      : Array.isArray(response?.data)
      ? response.data
      : [];

    return rawEvents
      .filter((event) => event && event.is_active !== false)
      .map((event, idx) => {
        // If backend already shaped the object with status/date/image, keep it; otherwise transform.
        const hasFrontendShape =
          event.status &&
          (event.date || event.start_date) &&
          event.id !== undefined;
        if (hasFrontendShape) {
          return {
            ...event,
            id: event.id?.toString?.() ?? `${idx}`,
            category: event.category || event.badge || "Workshop",
            image: event.image || event.image_url || undefined,
            registrationLink: event.registrationLink || event.event_url,
            participants: event.participants,
          } as Event;
        }
        return transformEvent(event as BackendEvent);
      });
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function fetchAnnouncements(): Promise<AnnouncementItem[]> {
  try {
    const token = process.env.NEXT_PUBLIC_API_TOKEN;
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await backendApi.get("/api/announcements/all", {
      headers,
    });
    // Backend returns { message: "...", data: [...] }
    const backendItems: BackendAnnouncement[] = response.data || [];
    // Transform to frontend format
    return backendItems.map(transformAnnouncement);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

// About API calls
export async function fetchStemCenters() {
  try {
    const response = await fetch("/api/about/stem-centers");
    if (!response.ok) throw new Error("Failed to fetch stem centers");
    return response.json();
  } catch (error) {
    console.error("Error fetching stem centers:", error);
    return [];
  }
}

export async function fetchMembers() {
  try {
    const response = await fetch("/api/about/members");
    if (!response.ok) throw new Error("Failed to fetch members");
    return response.json();
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}
