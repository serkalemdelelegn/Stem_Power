"use client";

import type React from "react";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  fetchNewsletters,
  fetchNewsletterHero,
  type Newsletter as NewsletterType,
  type NewsletterHero,
} from "@/lib/api-news-newsletter";
import {
  Calendar,
  Search,
  Download,
  ArrowRight,
  Mail,
  TrendingUp,
  Users,
  BookOpen,
  Sparkles,
  CheckCircle,
  PartyPopper,
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";

// Remove all static/default hero content and slug normalization.

export default function NewsletterPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [newsletterData, setNewsletterData] = useState<NewsletterType[]>([]);
  const [heroBanner, setHeroBanner] = useState<NewsletterHero | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [displayCount, setDisplayCount] = useState(6);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const subscriptionRef = useRef<HTMLElement>(null);
  const newslettersRef = useRef<HTMLElement>(null);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ label: string }>;
    translatedNewsletters?: Array<{
      title?: string;
      excerpt?: string;
      category?: string;
    }>;
    translatedCategories?: Record<string, string>;
    // Static UI text translations
    searchPlaceholder?: string;
    all?: string;
    featuredNewsletter?: string;
    ourMostRecentStory?: string;
    featured?: string;
    readFullNewsletter?: string;
    downloadPDF?: string;
    recentNewsletters?: string;
    categoryNewsletters?: string;
    catchUpOnUpdates?: string;
    newsletter?: string;
    newsletters?: string;
    readMore?: string;
    loadMore?: string;
    loadLess?: string;
    noNewslettersFound?: string;
    tryAdjustingSearch?: string;
    clearFilters?: string;
    joinNewsletterCommunity?: string;
    newsletterDescription?: string;
    monthlyDigest?: string;
    exclusiveStories?: string;
    earlyAccess?: string;
    behindTheScenes?: string;
    joinSubscribers?: string;
    whoStayInformed?: string;
    freeNewsletter?: string;
    subscribeToday?: string;
    enterYourEmail?: string;
    emailAddress?: string;
    subscribeToNewsletter?: string;
    privacyText?: string;
    issuesPublished?: string;
    monthlyReaders?: string;
    welcomeAboard?: string;
    thankYouForSubscribing?: string;
    subscriptionConfirmed?: string;
    checkYourInbox?: string;
    subscribeAnotherEmail?: string;
  }>({});

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel using the API helper functions
        const [newslettersData, heroData] = await Promise.all([
          fetchNewsletters(),
          fetchNewsletterHero(),
        ]);

        if (!isMounted) return;
        setNewsletterData(newslettersData);
        setHeroBanner(heroData || null);
      } catch (error) {
        console.error("Failed to load newsletters", error);
        if (isMounted) {
          setNewsletterData([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const unique = new Set<string>(["All"]);
    newsletterData.forEach((newsletter) => {
      if (newsletter.category) {
        unique.add(newsletter.category);
      }
    });
    return Array.from(unique);
  }, [newsletterData]);

  const stats = [
    {
      icon: Users,
      label: "Subscribers",
      value: heroBanner?.statistics?.subscribers,
    },
    {
      icon: BookOpen,
      label: "Newsletters",
      value: heroBanner?.statistics?.newsletters,
    },
    {
      icon: TrendingUp,
      label: "Monthly Readers",
      value: heroBanner?.statistics?.monthlyReaders,
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

      if (isLoading) return;

      setTranslating(true);
      try {
        const translations: any = {};

        // Translate hero section
        if (heroBanner?.badge)
          translations.heroBadge = await translateText(
            heroBanner.badge,
            targetLang
          );
        if (heroBanner?.title)
          translations.heroTitle = await translateText(
            heroBanner.title,
            targetLang
          );
        if (heroBanner?.description)
          translations.heroDescription = await translateText(
            heroBanner.description,
            targetLang
          );

        // Translate statistics labels (keep values unchanged)
        const statLabels = ["Subscribers", "Newsletters", "Monthly Readers"];
        translations.statistics = await Promise.all(
          statLabels.map(async (label) => ({
            label: await translateText(label, targetLang),
          }))
        );

        // Translate newsletters (title, excerpt, category)
        if (newsletterData && newsletterData.length > 0) {
          // Collect unique categories first
          const uniqueCategories = Array.from(
            new Set(newsletterData.map((n) => n.category).filter(Boolean))
          );

          const translatedCategories: Record<string, string> = {};
          for (const category of uniqueCategories) {
            if (category) {
              translatedCategories[category] = await translateText(
                category,
                targetLang
              );
            }
          }
          translations.translatedCategories = translatedCategories;

          // Translate newsletter titles, excerpts, and categories
          translations.translatedNewsletters = await Promise.all(
            newsletterData.map(async (newsletter) => ({
              title: newsletter.title
                ? await translateText(newsletter.title, targetLang)
                : newsletter.title,
              excerpt: newsletter.excerpt
                ? await translateText(newsletter.excerpt, targetLang)
                : newsletter.excerpt,
              category: newsletter.category
                ? translatedCategories[newsletter.category] ||
                  newsletter.category
                : newsletter.category,
            }))
          );
        }

        // Translate static UI text
        translations.searchPlaceholder = await translateText(
          "Search newsletters by title, topic, or keyword...",
          targetLang
        );
        translations.all = await translateText("All", targetLang);
        translations.featuredNewsletter = await translateText(
          "Featured Newsletter",
          targetLang
        );
        translations.ourMostRecentStory = await translateText(
          "Our most recent and impactful story",
          targetLang
        );
        translations.featured = await translateText("⭐ Featured", targetLang);
        translations.readFullNewsletter = await translateText(
          "Read Full Newsletter",
          targetLang
        );
        translations.downloadPDF = await translateText(
          "Download PDF",
          targetLang
        );
        translations.recentNewsletters = await translateText(
          "Recent Newsletters",
          targetLang
        );
        translations.categoryNewsletters = await translateText(
          "Newsletters",
          targetLang
        );
        translations.catchUpOnUpdates = await translateText(
          "Catch up on our latest updates and stories",
          targetLang
        );
        translations.newsletter = await translateText("newsletter", targetLang);
        translations.newsletters = await translateText(
          "newsletters",
          targetLang
        );
        translations.readMore = await translateText("Read More", targetLang);
        translations.loadMore = await translateText("Load More", targetLang);
        translations.loadLess = await translateText("Load Less", targetLang);
        translations.noNewslettersFound = await translateText(
          "No newsletters found",
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
        translations.joinNewsletterCommunity = await translateText(
          "Join Our Newsletter Community",
          targetLang
        );
        translations.newsletterDescription = await translateText(
          "Get exclusive insights, inspiring stories, and the latest updates from STEMpower Ethiopia delivered directly to your inbox.",
          targetLang
        );
        translations.monthlyDigest = await translateText(
          "Monthly digest of our programs and impact",
          targetLang
        );
        translations.exclusiveStories = await translateText(
          "Exclusive stories from students and teachers",
          targetLang
        );
        translations.earlyAccess = await translateText(
          "Early access to events and opportunities",
          targetLang
        );
        translations.behindTheScenes = await translateText(
          "Behind-the-scenes updates and announcements",
          targetLang
        );
        translations.joinSubscribers = await translateText("Join", targetLang);
        translations.whoStayInformed = await translateText(
          "subscribers who stay informed about our mission to transform STEM education in Ethiopia.",
          targetLang
        );
        translations.freeNewsletter = await translateText(
          "Free Newsletter",
          targetLang
        );
        translations.subscribeToday = await translateText(
          "Subscribe Today",
          targetLang
        );
        translations.enterYourEmail = await translateText(
          "Enter your email below and never miss an update from our community.",
          targetLang
        );
        translations.emailAddress = await translateText(
          "Email Address",
          targetLang
        );
        translations.subscribeToNewsletter = await translateText(
          "Subscribe to Newsletter",
          targetLang
        );
        translations.privacyText = await translateText(
          "By subscribing, you agree to receive our monthly newsletter. You can unsubscribe at any time. We respect your privacy and will never share your information.",
          targetLang
        );
        translations.issuesPublished = await translateText(
          "Issues Published",
          targetLang
        );
        translations.monthlyReaders = await translateText(
          "Monthly Readers",
          targetLang
        );
        translations.welcomeAboard = await translateText(
          "Welcome Aboard!",
          targetLang
        );
        translations.thankYouForSubscribing = await translateText(
          "Thank you for subscribing to our newsletter. You'll receive our next edition soon!",
          targetLang
        );
        translations.subscriptionConfirmed = await translateText(
          "Subscription Confirmed",
          targetLang
        );
        translations.checkYourInbox = await translateText(
          "Check your inbox for a welcome email with exclusive content and resources.",
          targetLang
        );
        translations.subscribeAnotherEmail = await translateText(
          "Subscribe Another Email",
          targetLang
        );

        // Empty-state indicator copy
        translations.notAddedYet = await translateText(
          "Not added yet",
          targetLang
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    if (!isLoading) {
      translateDynamicContent(selectedLanguage);
    }
  }, [selectedLanguage, heroBanner, newsletterData, isLoading]);

  // Helper function to get translated text
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
  const displayHeroBadge = heroBanner?.badge
    ? getTranslated("heroBadge", heroBanner.badge)
    : getTranslatedText("notAddedYet", "Not added yet");
  const displayHeroTitle = heroBanner?.title
    ? getTranslated("heroTitle", heroBanner.title)
    : getTranslatedText("notAddedYet", "Not added yet");
  const displayHeroDescription = heroBanner?.description
    ? getTranslated("heroDescription", heroBanner.description)
    : getTranslatedText("notAddedYet", "Not added yet");
  const displayStatsBase =
    translatedContent.statistics && selectedLanguage !== "en"
      ? stats.map((stat, index) => ({
          ...stat,
          label: translatedContent.statistics![index]?.label || stat.label,
        }))
      : stats;
  const displayStats = displayStatsBase.map((stat) => ({
    ...stat,
    value: stat.value ?? getTranslatedText("notAddedYet", "Not added yet"),
  }));
  const displayNewsletters =
    translatedContent.translatedNewsletters && selectedLanguage !== "en"
      ? newsletterData.map((newsletter, index) => ({
          ...newsletter,
          title:
            translatedContent.translatedNewsletters![index]?.title ||
            newsletter.title,
          excerpt:
            translatedContent.translatedNewsletters![index]?.excerpt ||
            newsletter.excerpt,
          category:
            translatedContent.translatedNewsletters![index]?.category ||
            newsletter.category,
        }))
      : newsletterData;
  const displayCategories =
    translatedContent.translatedCategories && selectedLanguage !== "en"
      ? categories.map((cat) => ({
          original: cat,
          translated:
            cat === "All"
              ? getTranslatedText("all", "All")
              : translatedContent.translatedCategories![cat] || cat,
        }))
      : categories.map((cat) => ({
          original: cat,
          translated: cat === "All" ? getTranslatedText("all", "All") : cat,
        }));

  const filteredNewsletters = displayNewsletters.filter((newsletter) => {
    const matchesCategory =
      selectedCategory === "All" || newsletter.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      (newsletter.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (newsletter.excerpt || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNewsletter =
    filteredNewsletters.find((n) => n.featured) ??
    (filteredNewsletters.length > 0 ? filteredNewsletters[0] : null);
  const regularNewsletters = featuredNewsletter
    ? filteredNewsletters.filter((n) => n.id !== featuredNewsletter.id)
    : filteredNewsletters;

  const displayedNewsletters = regularNewsletters.slice(0, displayCount);
  const hasMoreNewsletters = displayCount < regularNewsletters.length;

  const scrollToSubscription = () => {
    subscriptionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const scrollToNewsletters = () => {
    newslettersRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscriptionSuccess(true);
      setEmail("");
      setTimeout(() => {
        setSubscriptionSuccess(false);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
        <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-10">
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
            {/* <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-8"
                onClick={scrollToSubscription}
              >
                <Mail className="mr-2 h-5 w-5" />
                Subscribe Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 bg-transparent"
                onClick={scrollToNewsletters}
              >
                View All Newsletters
              </Button>
            </div> */}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent" />
        <br />
        <br />
        <br />
        <br />
      </section>

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

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={getTranslatedText(
                "searchPlaceholder",
                "Search newsletters by title, topic, or keyword..."
              )}
              className="pl-12 h-14 text-base shadow-md border-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {displayCategories.map((cat) => (
            <Button
              key={cat.original}
              variant={
                cat.original === selectedCategory ? "default" : "outline"
              }
              className={
                cat.original === selectedCategory
                  ? "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-md hover:from-[#367375] hover:to-[#24C3BC] transition-all"
                  : "hover:bg-linear-to-br hover:from-[#367375] hover:to-[#24C3BC] hover:text-white transition-all"
              }
              size="lg"
              onClick={() => setSelectedCategory(cat.original)}
            >
              {cat.translated}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Newsletter */}
      {featuredNewsletter && (
        <section
          ref={newslettersRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        >
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {getTranslatedText("featuredNewsletter", "Featured Newsletter")}
            </h2>
            <p className="text-muted-foreground">
              {getTranslatedText(
                "ourMostRecentStory",
                "Our most recent and impactful story"
              )}
            </p>
          </div>

          {/* Card */}
          <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group bg-card">
            <div className="grid lg:grid-cols-5 gap-0">
              {/* Image */}
              <div className="relative lg:col-span-2 h-80 lg:h-auto overflow-hidden">
                {featuredNewsletter.image ? (
                  <img
                    src={featuredNewsletter.image}
                    alt={featuredNewsletter.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground">
                    {getTranslatedText("notAddedYet", "Not added yet")}
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <Badge className="absolute top-6 left-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white border-0 text-sm px-4 py-1.5 shadow-lg">
                  {getTranslatedText("featured", "⭐ Featured")}
                </Badge>
              </div>

              {/* Content */}
              <CardContent className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                {/* Category Badge */}
                <Badge
                  variant="outline"
                  className="w-fit mb-4 border-[#367375] text-[#367375] px-3 py-1 transition-colors duration-300 group-hover:border-[#24C3BC] group-hover:text-[#24C3BC]"
                >
                  {featuredNewsletter.category ||
                    getTranslatedText("notAddedYet", "Not added yet")}
                </Badge>

                {/* Title with gradient on hover */}
                <h3
                  className="
              text-3xl lg:text-4xl font-bold mb-4 transition-all duration-300
              text-foreground
              group-hover:text-transparent group-hover:bg-clip-text
              group-hover:bg-linear-to-r group-hover:from-[#367375] group-hover:to-[#24C3BC]
            "
                >
                  {featuredNewsletter.title}
                </h3>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredNewsletter.date}</span>
                  </div>
                  <span>•</span>
                  <span>{featuredNewsletter.readTime}</span>
                </div>

                {/* Excerpt */}
                <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                  {featuredNewsletter.excerpt}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-3">
                  {/* Read Full Newsletter */}
                  <Button
                    asChild
                    size="lg"
                    className="bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-md transition-all duration-300 hover:brightness-110"
                  >
                    <Link
                      href={`/latest/news/newsletter/${featuredNewsletter.slug}`}
                    >
                      {getTranslatedText(
                        "readFullNewsletter",
                        "Read Full Newsletter"
                      )}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>

                  {/* Download PDF */}
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="shadow-md border-[#367375] text-[#367375] hover:bg-linear-to-br hover:from-[#367375] hover:to-[#24C3BC] hover:text-white transition-all duration-300"
                  >
                    <a href={featuredNewsletter.pdfUrl} download>
                      <Download className="w-4 h-4 mr-2" />
                      {getTranslatedText("downloadPDF", "Download PDF")}
                    </a>
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </section>
      )}

      {/* Newsletter Grid */}
      {regularNewsletters.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Header */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {selectedCategory === "All"
                  ? getTranslatedText("recentNewsletters", "Recent Newsletters")
                  : `${selectedCategory} ${getTranslatedText(
                      "categoryNewsletters",
                      "Newsletters"
                    )}`}
              </h2>
              <p className="text-muted-foreground">
                {getTranslatedText(
                  "catchUpOnUpdates",
                  "Catch up on our latest updates and stories"
                )}
              </p>
            </div>

            <Badge
              variant="outline"
              className="text-base px-4 py-2 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-md"
            >
              {regularNewsletters.length}{" "}
              {regularNewsletters.length !== 1
                ? getTranslatedText("newsletters", "newsletters")
                : getTranslatedText("newsletter", "newsletter")}
            </Badge>
          </div>

          {/* Newsletter Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedNewsletters.map((newsletter) => (
              <Card
                key={newsletter.id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-card"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {newsletter.image ? (
                    <img
                      src={newsletter.image}
                      alt={newsletter.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground">
                      {getTranslatedText("notAddedYet", "Not added yet")}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                  <Badge className="absolute top-4 left-4 text-xs border-0 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-md">
                    {newsletter.category}
                  </Badge>
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  <h3
                    className="
    text-xl font-bold mb-3 line-clamp-2 leading-snug
    text-foreground
    transition-all duration-300
    group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-[#367375] group-hover:to-[#24C3BC]
  "
                  >
                    {newsletter.title}
                  </h3>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{newsletter.date}</span>
                    </div>
                    <span>•</span>
                    <span>{newsletter.readTime}</span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                    {newsletter.excerpt}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Read More */}
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-sm transition-all duration-300 hover:brightness-110"
                    >
                      <Link href={`/latest/news/newsletter/${newsletter.slug}`}>
                        {getTranslatedText("readMore", "Read More")}
                        <ArrowRight className="ml-1 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>

                    {/* Download */}
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="shadow-sm bg-transparent transition-all duration-300 hover:bg-linear-to-br hover:from-[#367375] hover:to-[#24C3BC] hover:text-white"
                    >
                      <a href={newsletter.pdfUrl} download>
                        <Download className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More / Load Less */}
          <div className="mt-16 text-center flex justify-center gap-4">
            {hasMoreNewsletters && (
              <Button
                variant="outline"
                size="lg"
                className="min-w-60 shadow-md bg-linear-to-br from-[#367375] to-[#24C3BC] text-white transition-all duration-300 hover:brightness-110"
                onClick={handleLoadMore}
              >
                {getTranslatedText("loadMore", "Load More")}
              </Button>
            )}

            {displayCount > 6 && (
              <Button
                variant="outline"
                size="lg"
                className="min-w-60 shadow-md bg-linear-to-br from-[#367375] to-[#24C3BC] text-white transition-all duration-300 hover:brightness-110"
                onClick={() => setDisplayCount(6)}
              >
                {getTranslatedText("loadLess", "Load Less")}
              </Button>
            )}
          </div>
        </section>
      )}

      {/* No Results Message */}
      {filteredNewsletters.length === 0 && !isLoading && (
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <Card className="p-16 text-center border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">
                {getTranslatedText(
                  "noNewslettersFound",
                  "No newsletters found"
                )}
              </h3>
              <p className="text-muted-foreground mb-6">
                {getTranslatedText(
                  "tryAdjustingSearch",
                  "Try adjusting your search or filter to find what you're looking for."
                )}
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {getTranslatedText("clearFilters", "Clear Filters")}
              </Button>
            </div>
          </Card>
        </section>
      )}

      <section ref={subscriptionRef} className="max-w-6xl mx-auto px-4 pb-24">
        <Card className="overflow-hidden border-2 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left side - Image and benefits */}
            <div className="relative bg-linear-to-br from-[#367375] to-[#24C3BC] p-12 text-white">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
                  {getTranslatedText(
                    "joinNewsletterCommunity",
                    "Join Our Newsletter Community"
                  )}
                </h2>
                <p className="text-emerald-50 mb-8 text-lg leading-relaxed">
                  {getTranslatedText(
                    "newsletterDescription",
                    "Get exclusive insights, inspiring stories, and the latest updates from STEMpower Ethiopia delivered directly to your inbox."
                  )}
                </p>

                <div className="space-y-4">
                  {[
                    getTranslatedText(
                      "monthlyDigest",
                      "Monthly digest of our programs and impact"
                    ),
                    getTranslatedText(
                      "exclusiveStories",
                      "Exclusive stories from students and teachers"
                    ),
                    getTranslatedText(
                      "earlyAccess",
                      "Early access to events and opportunities"
                    ),
                    getTranslatedText(
                      "behindTheScenes",
                      "Behind-the-scenes updates and announcements"
                    ),
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5 backdrop-blur-sm">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-emerald-50">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-sm text-emerald-100">
                    {getTranslatedText("joinSubscribers", "Join")}{" "}
                    <span className="font-bold text-white">
                      5,000+ subscribers
                    </span>{" "}
                    {getTranslatedText(
                      "whoStayInformed",
                      "who stay informed about our mission to transform STEM education in Ethiopia."
                    )}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            </div>

            {/* Right side - Subscription form */}
            <div className="p-12 bg-white flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                {subscriptionSuccess ? (
                  <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                      <PartyPopper className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      {getTranslatedText("welcomeAboard", "Welcome Aboard!")}
                    </h3>
                    <p className="text-lg text-muted-foreground mb-6">
                      {getTranslatedText(
                        "thankYouForSubscribing",
                        "Thank you for subscribing to our newsletter. You'll receive our next edition soon!"
                      )}
                    </p>
                    <div className="bg-linear-to-br from-[#367375]/10 to-[#24C3BC]/10 border-2 border-[#367375] rounded-lg p-6">
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="h-5 w-5 text-[#367375] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-[#367375] mb-1">
                            {getTranslatedText(
                              "subscriptionConfirmed",
                              "Subscription Confirmed"
                            )}
                          </p>
                          <p className="text-sm text-[#24C3BC]">
                            {getTranslatedText(
                              "checkYourInbox",
                              "Check your inbox for a welcome email with exclusive content and resources."
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => setSubscriptionSuccess(false)}
                      variant="outline"
                      className="mt-6 border-2 border-[#367375] text-[#367375] hover:bg-linear-to-br hover:from-[#367375] hover:to-[#24C3BC] hover:text-white"
                    >
                      {getTranslatedText(
                        "subscribeAnotherEmail",
                        "Subscribe Another Email"
                      )}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Badge className="mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white border-0">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {getTranslatedText("freeNewsletter", "Free Newsletter")}
                    </Badge>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {getTranslatedText("subscribeToday", "Subscribe Today")}
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      {getTranslatedText(
                        "enterYourEmail",
                        "Enter your email below and never miss an update from our community."
                      )}
                    </p>

                    <form onSubmit={handleSubscribe} className="space-y-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          {getTranslatedText("emailAddress", "Email Address")}
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="h-12 text-base border-2 border-[#367375]"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-linear-to-br from-[#367375] to-[#24C3BC] hover:from-[#24C3BC] hover:to-[#367375] text-white h-12 text-base font-semibold shadow-md"
                      >
                        {getTranslatedText(
                          "subscribeToNewsletter",
                          "Subscribe to Newsletter"
                        )}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </form>

                    <p className="text-xs text-muted-foreground mt-6 text-center">
                      {getTranslatedText(
                        "privacyText",
                        "By subscribing, you agree to receive our monthly newsletter. You can unsubscribe at any time. We respect your privacy and will never share your information."
                      )}
                    </p>

                    <div className="mt-8 pt-8 border-t">
                      <div className="flex items-center justify-center gap-8 text-center">
                        <div>
                          <div className="text-2xl font-bold text-[#367375]">
                            48+
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getTranslatedText(
                              "issuesPublished",
                              "Issues Published"
                            )}
                          </div>
                        </div>
                        <div className="w-px h-12 bg-border" />
                        <div>
                          <div className="text-2xl font-bold text-[#367375]">
                            12K+
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getTranslatedText(
                              "monthlyReaders",
                              "Monthly Readers"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </section>

      <Footer />
    </div>
  );
}
