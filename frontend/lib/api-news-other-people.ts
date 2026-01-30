import { backendApi } from "./backend-api";

// ===== Backend Interfaces =====

interface BackendPressArticle {
  id: string;
  title: string;
  content: string;
  image: string | null;
  source: string | null;
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
  publication: string | null;
  publicationType: string | null;
  quote: string | null;
  topic: string | null;
  link: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface PressArticle {
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
  source?: string;
  content?: string;
  publication?: string;
  publicationType?: string;
  quote?: string;
  topic?: string;
  link?: string;
}

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
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(dateObj.getTime())) return "";
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
  if (!content) return "";
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// ===== Transform Functions =====

function transformPressArticle(
  backendArticle: BackendPressArticle
): PressArticle {
  const slug = backendArticle.slug || String(backendArticle.id);
  const excerpt =
    backendArticle.excerpt ||
    (backendArticle.content
      ? `${backendArticle.content.substring(0, 200)}...`
      : "");
  const rawDate = backendArticle.date || backendArticle.createdAt;
  const date = rawDate ? formatDate(rawDate) : "";
  const category = backendArticle.category || "";
  const readTime =
    backendArticle.readTime ||
    estimateReadTime(backendArticle.content) ||
    undefined;

  return {
    id: String(backendArticle.id),
    slug,
    title: backendArticle.title,
    excerpt,
    date,
    category,
    image: backendArticle.image || "",
    readTime,
    pdfUrl: backendArticle.pdfUrl || undefined,
    featured: backendArticle.featured ?? false,
    author: backendArticle.author || undefined,
    source: backendArticle.source || undefined,
    content: backendArticle.content,
    publication: backendArticle.publication || undefined,
    publicationType: backendArticle.publicationType || undefined,
    quote: backendArticle.quote || undefined,
    topic: backendArticle.topic || undefined,
    link: backendArticle.link || undefined,
  };
}

// ===== Fetch Functions =====

/**
 * Fetch all press articles from backend, with fallback to empty array
 */
export async function fetchPressArticles(): Promise<PressArticle[]> {
  try {
    const response = await backendApi.get("/api/news/press");
    const backendArticles: BackendPressArticle[] = Array.isArray(response)
      ? response
      : [];

    if (backendArticles.length === 0) {
      return [];
    }

    return backendArticles.map(transformPressArticle);
  } catch (error) {
    console.error("Error fetching press articles:", error);
    return [];
  }
}
