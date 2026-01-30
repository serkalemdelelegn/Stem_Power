import { backendApi } from "./backend-api";

// ===== Backend Interfaces =====

interface BackendSocialMediaPost {
  id: string;
  title: string;
  content: string;
  image: string | null;
  source: "social";
  platform: "Facebook" | "LinkedIn" | "Twitter" | "Instagram" | null;
  link: string | null;
  shares: number;
  likeCount: number;
  commentCount: number;
  date: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BackendSocialMediaHero {
  id: string;
  badge: string;
  title: string;
  description: string | null;
  stat1Value: string | null;
  stat1Label: string | null;
  stat2Value: string | null;
  stat2Label: string | null;
  stat3Value: string | null;
  stat3Label: string | null;
  createdAt: string;
  updatedAt: string;
}

// ===== Frontend Interfaces =====

export interface SocialMediaPost {
  id: string;
  platform: string;
  content: string;
  date: string;
  link: string;
  image?: string;
  likes?: number;
  comments?: number;
  shares?: number;
}

export interface SocialMediaHero {
  badge: string;
  title: string;
  description: string;
  statistics: {
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
  };
}

// ===== Fallback Data =====

const fallbackHero: SocialMediaHero = {
  badge: "Social Media Updates",
  title: "Follow Our Journey on Social Media",
  description:
    "Stay connected with our daily updates, inspiring stories, and behind-the-scenes moments from the STEMpower Ethiopia community across all social platforms.",
  statistics: {
    stat1Value: "25K+",
    stat1Label: "Total Followers",
    stat2Value: "150K+",
    stat2Label: "Monthly Reach",
    stat3Value: "8.5%",
    stat3Label: "Engagement Rate",
  },
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

// ===== Transform Functions =====

function transformSocialMediaPost(
  backendPost: BackendSocialMediaPost
): SocialMediaPost {
  const date = formatDate(backendPost.date || backendPost.createdAt);
  const platform = backendPost.platform || "Unknown";

  return {
    id: String(backendPost.id),
    platform,
    content: backendPost.content || backendPost.title || "",
    date,
    link: backendPost.link || "",
    image: backendPost.image || undefined,
    likes: backendPost.likeCount || 0,
    comments: backendPost.commentCount || 0,
    shares: backendPost.shares || 0,
  };
}

function transformSocialMediaHero(
  backendHero: BackendSocialMediaHero
): SocialMediaHero {
  return {
    badge: backendHero.badge || fallbackHero.badge,
    title: backendHero.title || fallbackHero.title,
    description: backendHero.description || fallbackHero.description,
    statistics: {
      stat1Value: backendHero.stat1Value || fallbackHero.statistics.stat1Value,
      stat1Label: backendHero.stat1Label || fallbackHero.statistics.stat1Label,
      stat2Value: backendHero.stat2Value || fallbackHero.statistics.stat2Value,
      stat2Label: backendHero.stat2Label || fallbackHero.statistics.stat2Label,
      stat3Value: backendHero.stat3Value || fallbackHero.statistics.stat3Value,
      stat3Label: backendHero.stat3Label || fallbackHero.statistics.stat3Label,
    },
  };
}

// ===== Fetch Functions =====

/**
 * Fetch all social media posts from backend, with fallback to empty array
 */
export async function fetchSocialMediaPosts(): Promise<SocialMediaPost[]> {
  try {
    const response = await backendApi.get("/api/news/social-media");
    const backendPosts: BackendSocialMediaPost[] = Array.isArray(response)
      ? response
      : [];

    if (backendPosts.length === 0) {
      return [];
    }

    return backendPosts.map(transformSocialMediaPost);
  } catch (error) {
    console.error("Error fetching social media posts:", error);
    return [];
  }
}

/**
 * Fetch social media hero from backend, with fallback to static data
 */
export async function fetchSocialMediaHero(): Promise<SocialMediaHero> {
  try {
    const response = await backendApi.get("/api/news/social-media/hero");
    const backendHeroes: BackendSocialMediaHero[] = Array.isArray(response)
      ? response
      : [];

    if (backendHeroes.length === 0) {
      return fallbackHero;
    }

    // Get the most recent hero (first in DESC order)
    return transformSocialMediaHero(backendHeroes[0]);
  } catch (error) {
    console.error("Error fetching social media hero:", error);
    return fallbackHero;
  }
}
