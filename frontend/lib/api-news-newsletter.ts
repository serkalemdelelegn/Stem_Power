import { backendApi } from "./backend-api";

// ===== Backend Interfaces =====

interface BackendNews {
  id: string;
  title: string;
  content: string;
  image: string | null;
  source: "newsletter" | "press" | "social";
  views: number;
  commentCount: number;
  likeCount: number;
  slug: string | null;
  excerpt: string | null;
  category: string | null;
  date: string | null;
  readTime: string | null;
  pdfUrl: string | null;
  featured: boolean;
  author: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendNewsletterHero {
  id: string;
  badge: string;
  title: string;
  description: string | null;
  subscribers: string | null;
  newsletters: string | null;
  monthlyReaders: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface Newsletter {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  readTime?: string;
  pdfUrl?: string;
  featured?: boolean;
  badge?: string;
  author?: string;
  topic?: string;
  source?: string;
  content?: string;
  publication?: string;
  publicationType?: string;
  quote?: string;
}

export interface NewsletterHero {
  badge: string;
  title: string;
  description: string;
  statistics: {
    subscribers: string;
    newsletters: string;
    monthlyReaders: string;
  };
}

// ===== Fallback Data =====

const fallbackHero: NewsletterHero = {
  badge: "STEMpower Newsletters",
  title: "Stay Connected",
  description:
    "Explore our latest stories, achievements, and updates from the STEMpower Ethiopia community. Get insights into how we're transforming STEM education across the nation through innovation, collaboration, and dedication.",
  statistics: {
    subscribers: "5,000+",
    newsletters: "48+",
    monthlyReaders: "12,000+",
  },
};

// ===== Helper Functions =====

/**
 * Generate slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
 * Estimate read time from content
 */
function estimateReadTime(content: string | null): string {
  if (!content) return "5 min read";
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// ===== Transform Functions =====

function transformNewsletter(backendNews: BackendNews): Newsletter {
  const slug = backendNews.slug || generateSlug(backendNews.title);
  const excerpt =
    backendNews.excerpt || backendNews.content.substring(0, 200) + "...";
  const date = formatDate(backendNews.date || backendNews.createdAt);
  const category = backendNews.category || "General";
  const readTime =
    backendNews.readTime || estimateReadTime(backendNews.content);

  return {
    id: backendNews.id,
    slug,
    title: backendNews.title,
    excerpt,
    date,
    category,
    image: backendNews.image || "/placeholder.svg",
    readTime,
    pdfUrl: backendNews.pdfUrl || undefined,
    featured: backendNews.featured || false,
    author: backendNews.author || undefined,
    source: backendNews.source,
    content: backendNews.content,
  };
}

function transformHero(backendHero: BackendNewsletterHero): NewsletterHero {
  return {
    badge: backendHero.badge || fallbackHero.badge,
    title: backendHero.title || fallbackHero.title,
    description: backendHero.description || fallbackHero.description,
    statistics: {
      subscribers:
        backendHero.subscribers || fallbackHero.statistics.subscribers,
      newsletters:
        backendHero.newsletters || fallbackHero.statistics.newsletters,
      monthlyReaders:
        backendHero.monthlyReaders || fallbackHero.statistics.monthlyReaders,
    },
  };
}

// ===== Fetch Functions =====

/**
 * Fetch all newsletters from backend, with fallback to empty array
 */
export async function fetchNewsletters(): Promise<Newsletter[]> {
  try {
    const response = await backendApi.get("/api/news/newsletter");
    const backendNews: BackendNews[] = Array.isArray(response) ? response : [];

    if (backendNews.length === 0) {
      return [];
    }

    return backendNews.map(transformNewsletter);
  } catch (error) {
    console.error("Error fetching newsletters:", error);
    return [];
  }
}

/**
 * Fetch newsletter hero from backend, with fallback to static data
 */
export async function fetchNewsletterHero(): Promise<NewsletterHero> {
  try {
    const response = await backendApi.get("/api/news/newsletter/hero");
    const backendHeroes: BackendNewsletterHero[] = Array.isArray(response)
      ? response
      : [];

    if (backendHeroes.length === 0) {
      return fallbackHero;
    }

    // Get the most recent hero (first in DESC order)
    return transformHero(backendHeroes[0]);
  } catch (error) {
    console.error("Error fetching newsletter hero:", error);
    return fallbackHero;
  }
}

/**
 * Fetch newsletter by slug from backend
 */
export async function fetchNewsletterBySlug(
  slug: string
): Promise<Newsletter | null> {
  try {
    const response = await backendApi.get(`/api/news/newsletter/slug/${slug}`);
    const backendNews: BackendNews = response;

    if (!backendNews) {
      return null;
    }

    return transformNewsletter(backendNews);
  } catch (error) {
    console.error("Error fetching newsletter by slug:", error);
    return null;
  }
}
