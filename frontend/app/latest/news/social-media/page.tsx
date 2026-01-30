"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Search,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  AlertTriangle,
} from "lucide-react";
import type { SocialMediaHero, SocialMediaPost } from "@/lib/api-types";
import {
  fetchSocialMediaPosts,
  fetchSocialMediaHero,
} from "@/lib/api-news-social-media";
import { useApp } from "@/lib/app-context";

// Platform icons as SVG components
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// No fallback posts or hero defaults; rely on backend data only.

const ensureExternalUrl = (url?: string | null) => {
  const value = (url || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `https://${value}`;
};

const INITIAL_DISPLAY_COUNT = 6;

export default function SocialMediaPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [heroContent, setHeroContent] = useState<SocialMediaHero>({
    badge: "",
    title: "",
    description: "",
    statistics: {
      stat1Value: "",
      stat1Label: "",
      stat2Value: "",
      stat2Label: "",
      stat3Value: "",
      stat3Label: "",
    },
  });
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const postsRef = useRef<HTMLElement>(null);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ label: string }>;
    translatedPosts?: Array<{
      content?: string;
    }>;
    // Static UI text translations
    searchPosts?: string;
    all?: string;
    recentPosts?: string;
    platformPosts?: string;
    stayUpdated?: string;
    post?: string;
    posts?: string;
    showingSamplePosts?: string;
    loadingSocialPosts?: string;
    viewOriginalPost?: string;
    linkComingSoon?: string;
    loadMorePosts?: string;
    loadLess?: string;
    noPostsFound?: string;
    tryAdjustingSearch?: string;
    clearFilters?: string;
    dateTBA?: string;
  }>({});

  useEffect(() => {
    let ignore = false;

    const loadHero = async () => {
      try {
        const data = await fetchSocialMediaHero();
        if (!ignore) {
          setHeroContent(
            data || {
              badge: "",
              title: "",
              description: "",
              statistics: {
                stat1Value: "",
                stat1Label: "",
                stat2Value: "",
                stat2Label: "",
                stat3Value: "",
                stat3Label: "",
              },
            }
          );
        }
      } catch (error) {
        console.error("Failed to load social media hero", error);
        if (!ignore) {
          setHeroContent({
            badge: "",
            title: "",
            description: "",
            statistics: {
              stat1Value: "",
              stat1Label: "",
              stat2Value: "",
              stat2Label: "",
              stat3Value: "",
              stat3Label: "",
            },
          });
        }
      }
    };

    const loadPosts = async () => {
      try {
        setLoadingPosts(true);
        const data = await fetchSocialMediaPosts();
        if (!ignore) {
          const normalized = (Array.isArray(data) ? data : []).map((item) => ({
            ...item,
            likes: typeof item.likes === "number" ? item.likes : 0,
            comments: typeof item.comments === "number" ? item.comments : 0,
            shares: typeof item.shares === "number" ? item.shares : 0,
          }));
          setPosts(normalized);
        }
      } catch (error) {
        console.error("Failed to load social posts", error);
        if (!ignore) {
          setPosts([]);
        }
      } finally {
        if (!ignore) {
          setLoadingPosts(false);
        }
      }
    };

    loadHero();
    loadPosts();

    return () => {
      ignore = true;
    };
  }, []);

  const formatMetric = (value?: number) =>
    typeof value === "number" && value >= 0 ? value.toLocaleString() : "0";

  // Helper function to get translated text (defined before use)
  const getTranslatedText = (key: string, fallback: string): string => {
    if (
      selectedLanguage === "en" ||
      !translatedContent[key as keyof typeof translatedContent]
    ) {
      return fallback;
    }
    return (
      (translatedContent[key as keyof typeof translatedContent] as string) ||
      fallback
    );
  };

  const formatDateDisplay = (value?: string) => {
    if (!value) {
      return getTranslatedText("dateTBA", "Date TBA");
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime())
      ? value
      : parsed.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  };

  const platforms = [
    {
      name: "All",
      displayName: getTranslatedText("all", "All"),
      icon: null,
      color: "",
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      color: "bg-clip-text bg-linear-to-br from-[#367375] to-[#24C3BC]",
    },
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      color: "bg-clip-text bg-linear-to-br from-[#367375] to-[#24C3BC]",
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
      color: "bg-clip-text bg-linear-to-br from-[#367375] to-[#24C3BC]",
    },
    {
      name: "Instagram",
      icon: InstagramIcon,
      color: "bg-clip-text bg-linear-to-br from-[#367375] to-[#24C3BC]",
    },
  ];

  const stats = [
    {
      icon: Users,
      label: heroContent.statistics.stat1Label,
      value: heroContent.statistics.stat1Value,
    },
    {
      icon: Eye,
      label: heroContent.statistics.stat2Label,
      value: heroContent.statistics.stat2Value,
    },
    {
      icon: TrendingUp,
      label: heroContent.statistics.stat3Label,
      value: heroContent.statistics.stat3Value,
    },
  ];

  // Translate all dynamic content
  useEffect(() => {
    // Translation function
    const translateText = async (
      text: string,
      targetLang: "en" | "am"
    ): Promise<string> => {
      if (!text || targetLang === "en") return text;

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLanguage: targetLang }),
        });

        if (!response.ok) {
          console.error("Translation failed:", await response.text());
          return text;
        }

        const data = await response.json();
        return data.translatedText || text;
      } catch (error) {
        console.error("Translation error:", error);
        return text;
      }
    };

    const translateDynamicContent = async (targetLang: "en" | "am") => {
      if (targetLang === "en") {
        setTranslatedContent({});
        return;
      }

      if (loadingPosts) return;

      setTranslating(true);
      try {
        const translations: any = {};

        // Translate hero section
        if (heroContent?.badge)
          translations.heroBadge = await translateText(
            heroContent.badge,
            targetLang
          );
        if (heroContent?.title)
          translations.heroTitle = await translateText(
            heroContent.title,
            targetLang
          );
        if (heroContent?.description)
          translations.heroDescription = await translateText(
            heroContent.description,
            targetLang
          );

        // Translate statistics labels (keep values unchanged)
        const statLabels = [
          heroContent.statistics.stat1Label || "",
          heroContent.statistics.stat2Label || "",
          heroContent.statistics.stat3Label || "",
        ];

        translations.statistics = await Promise.all(
          statLabels.map(async (label) => ({
            label: await translateText(label || "", targetLang),
          }))
        );

        // Translate post content
        if (posts && posts.length > 0) {
          translations.translatedPosts = await Promise.all(
            posts.map(async (post) => ({
              content: post.content
                ? await translateText(post.content, targetLang)
                : post.content,
            }))
          );
        }

        // Translate static UI text
        translations.searchPosts = await translateText(
          "Search posts by content or platform...",
          targetLang
        );
        translations.all = await translateText("All", targetLang);
        translations.recentPosts = await translateText(
          "Recent Posts",
          targetLang
        );
        translations.platformPosts = await translateText("Posts", targetLang);
        translations.stayUpdated = await translateText(
          "Stay updated with our latest social media activity",
          targetLang
        );
        translations.post = await translateText("post", targetLang);
        translations.posts = await translateText("posts", targetLang);
        translations.showingSamplePosts = await translateText(
          "Showing sample posts while we connect to the live feed.",
          targetLang
        );
        translations.loadingSocialPosts = await translateText(
          "Loading social posts...",
          targetLang
        );
        translations.viewOriginalPost = await translateText(
          "View Original Post",
          targetLang
        );
        translations.linkComingSoon = await translateText(
          "Link coming soon",
          targetLang
        );
        translations.loadMorePosts = await translateText(
          "Load More Posts",
          targetLang
        );
        translations.loadLess = await translateText("Load Less", targetLang);
        translations.noPostsFound = await translateText(
          "No posts found",
          targetLang
        );
        translations.tryAdjustingSearch = await translateText(
          "Try adjusting your search or filter to find what you're looking for.",
          targetLang
        );
        translations.clearFilters = await translateText(
          "Clear Filters",
          targetLang
        );
        translations.dateTBA = await translateText("Date TBA", targetLang);

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    if (!loadingPosts) {
      translateDynamicContent(selectedLanguage);
    }
  }, [selectedLanguage, heroContent, posts, loadingPosts]);

  // Get translated or original content
  const getTranslated = (key: string, original: string): string => {
    if (
      selectedLanguage === "en" ||
      !translatedContent[key as keyof typeof translatedContent]
    ) {
      return original;
    }
    return (
      (translatedContent[key as keyof typeof translatedContent] as string) ||
      original
    );
  };

  // Use translated content
  const displayHeroBadge = heroContent?.badge
    ? getTranslated("heroBadge", heroContent.badge)
    : "Not added yet";
  const displayHeroTitle = heroContent?.title
    ? getTranslated("heroTitle", heroContent.title)
    : "Not added yet";
  const displayHeroDescription = heroContent?.description
    ? getTranslated("heroDescription", heroContent.description)
    : "Not added yet";
  const displayStatsBase =
    translatedContent.statistics && selectedLanguage !== "en"
      ? [
          {
            icon: Users,
            label: translatedContent.statistics[0]?.label || stats[0].label,
            value: stats[0].value,
          },
          {
            icon: Eye,
            label: translatedContent.statistics[1]?.label || stats[1].label,
            value: stats[1].value,
          },
          {
            icon: TrendingUp,
            label: translatedContent.statistics[2]?.label || stats[2].label,
            value: stats[2].value,
          },
        ]
      : stats;
  const displayStats = displayStatsBase.map((stat) => ({
    ...stat,
    label: stat.label || "Not added yet",
    value: stat.value || "Not added yet",
  }));
  const displayPosts =
    translatedContent.translatedPosts && selectedLanguage !== "en"
      ? posts.map((post, index) => ({
          ...post,
          content:
            translatedContent.translatedPosts![index]?.content || post.content,
        }))
      : posts;

  const filteredPosts = displayPosts.filter((post) => {
    const matchesPlatform =
      selectedPlatform === "All" || post.platform === selectedPlatform;
    const matchesSearch =
      searchQuery === "" ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const displayedPosts = filteredPosts.slice(0, displayCount);
  const hasMorePosts = displayCount < filteredPosts.length;

  const getPlatformIcon = (platformName: string) => {
    const platform = platforms.find((p) => p.name === platformName);
    return platform?.icon;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
        <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                <Sparkles className="h-3 w-3 mr-1.5" />
                {displayHeroBadge}
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              {displayHeroTitle}
            </h1>
            <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
              {displayHeroDescription}
            </p>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {displayStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/10 bg-white/10 backdrop-blur-md rounded-xl scale-95 hover:scale-100"
              >
                <CardContent className="pt-4 pb-4 px-2">
                  <div className="w-10 h-10 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center mx-auto mb-2 shadow-md shadow-[#24C3BC]/30">
                    <IconComponent className="h-4 w-4 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                  </div>
                  <div className="text-2xl font-bold text-[#367375] mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-700 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={getTranslatedText(
                "searchPosts",
                "Search posts by content or platform..."
              )}
              className="pl-12 h-14 text-base shadow-md border-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            const isSelected = platform.name === selectedPlatform;

            return (
              <Button
                key={platform.name}
                variant={isSelected ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedPlatform(platform.name)}
                className={`
            ${
              isSelected
                ? "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-md hover:brightness-110"
                : "border-[#367375] text-[#367375] hover:bg-linear-to-br hover:from-[#367375] hover:to-[#24C3BC] hover:text-white transition-all duration-300"
            } 
          `}
              >
                {IconComponent && (
                  <span className={isSelected ? "text-white" : platform.color}>
                    <IconComponent />
                  </span>
                )}
                <span className="ml-2">
                  {platform.name === "All"
                    ? platform.displayName || platform.name
                    : platform.name}
                </span>
              </Button>
            );
          })}
        </div>
      </section>

      {displayedPosts.length > 0 && (
        <section
          ref={postsRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {selectedPlatform === "All"
                  ? getTranslatedText("recentPosts", "Recent Posts")
                  : `${selectedPlatform} ${getTranslatedText(
                      "platformPosts",
                      "Posts"
                    )}`}
              </h2>
              <p className="text-muted-foreground">
                {getTranslatedText(
                  "stayUpdated",
                  "Stay updated with our latest social media activity"
                )}
              </p>
            </div>
            <Badge
              variant="outline"
              className="text-base px-4 py-2 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-md"
            >
              {filteredPosts.length}{" "}
              {filteredPosts.length !== 1
                ? getTranslatedText("posts", "posts")
                : getTranslatedText("post", "post")}
            </Badge>
          </div>

          {loadingPosts && filteredPosts.length === 0 && (
            <Card className="mb-8">
              <CardContent className="py-12 text-center text-muted-foreground flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                {getTranslatedText(
                  "loadingSocialPosts",
                  "Loading social posts..."
                )}
              </CardContent>
            </Card>
          )}

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPosts.map((post) => {
              const PlatformIcon = getPlatformIcon(post.platform);
              const externalLink = ensureExternalUrl(post.link);
              return (
                <Card
                  key={post.id}
                  className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-card flex flex-col"
                >
                  {/* Platform Badge */}
                  <div className="p-4 pb-0">
                    <Badge className="border-0 shadow-md px-3 py-1 text-sm bg-white flex items-center gap-2">
                      {PlatformIcon && (
                        <span className="w-5 h-5 text-[#367375]">
                          <PlatformIcon />
                        </span>
                      )}
                      <span className="bg-clip-text text-transparent bg-linear-to-br from-[#367375] to-[#24C3BC]">
                        {post.platform}
                      </span>
                    </Badge>
                  </div>

                  {/* Post Image */}
                  {post.image ? (
                    <div className="relative h-48 overflow-hidden mx-4 mt-4 rounded-lg">
                      <img
                        src={post.image}
                        alt={`${post.platform} post`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  ) : (
                    <div className="relative h-48 overflow-hidden mx-4 mt-4 rounded-lg flex items-center justify-center bg-muted/30 text-muted-foreground">
                      Not added yet
                    </div>
                  )}

                  {/* Post Content */}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <p className="text-sm text-foreground mb-4 leading-relaxed line-clamp-4 flex-1">
                      {post.content}
                    </p>

                    <p className="text-xs text-muted-foreground mb-4">
                      {formatDateDisplay(post.date)}
                    </p>

                    {/* Engagement Metrics */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4" />
                        <span>{formatMetric(post.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" />
                        <span>{formatMetric(post.comments)}</span>
                      </div>
                      {post.shares && post.shares > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Share2 className="w-4 h-4" />
                          <span>{formatMetric(post.shares)}</span>
                        </div>
                      )}
                    </div>

                    {/* View Original Button - gradient background */}
                    {externalLink ? (
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-md hover:opacity-90 transition-all duration-300"
                      >
                        <a
                          href={externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {getTranslatedText(
                            "viewOriginalPost",
                            "View Original Post"
                          )}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        disabled
                      >
                        {getTranslatedText(
                          "linkComingSoon",
                          "Link coming soon"
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load More / Load Less Buttons */}
          <div className="mt-16 text-center flex justify-center gap-4">
            {displayCount < filteredPosts.length && (
              <Button
                size="lg"
                className="min-w-60 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-md hover:opacity-90 transition-all duration-300"
                onClick={() =>
                  setDisplayCount((prev) => prev + INITIAL_DISPLAY_COUNT)
                }
              >
                {getTranslatedText("loadMorePosts", "Load More Posts")}
              </Button>
            )}

            {displayCount > INITIAL_DISPLAY_COUNT &&
              displayCount >= filteredPosts.length && (
                <Button
                  size="lg"
                  className="min-w-60 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-md hover:opacity-90 transition-all duration-300"
                  onClick={() => setDisplayCount(INITIAL_DISPLAY_COUNT)}
                >
                  {getTranslatedText("loadLess", "Load Less")}
                </Button>
              )}
          </div>
        </section>
      )}

      {/* No Results Message */}
      {filteredPosts.length === 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <Card className="p-16 text-center border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                {getTranslatedText("noPostsFound", "No posts found")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {getTranslatedText(
                  "tryAdjustingSearch",
                  "Try adjusting your search or filter to find what you're looking for."
                )}
              </p>
              <Button
                onClick={() => {
                  setSelectedPlatform("All");
                  setSearchQuery("");
                }}
                className="bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-md transition-all duration-300 hover:brightness-110"
              >
                {getTranslatedText("clearFilters", "Clear Filters")}
              </Button>
            </div>
          </Card>
        </section>
      )}

      <Footer />
    </div>
  );
}
