"use client";

import type React from "react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchAnnouncements,
  fetchAnnouncementsHero,
  type Announcement,
} from "@/lib/api-latests-annoucements";
import type { AnnouncementsHero } from "@/lib/api-types";
import { useApp } from "@/lib/app-context";
import {
  ArrowRight,
  Bell,
  Briefcase,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Megaphone,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
const ensureExternalUrl = (url?: string | null) => {
  const value = (url || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `https://${value}`;
};

export default function AnnouncementsPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [heroBanner, setHeroBanner] = useState<AnnouncementsHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [email, setEmail] = useState("");

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ label: string }>;
    translatedAnnouncements?: Array<{
      title?: string;
      excerpt?: string;
      content?: string;
      category?: string;
      type?: string;
    }>;
    translatedTypes?: Record<string, string>;
    // Static UI text translations
    stayInformed?: string;
    announcementsOpportunities?: string;
    stayUpToDate?: string;
    activeAnnouncements?: string;
    openOpportunities?: string;
    upcomingEvents?: string;
    searchAnnouncements?: string;
    filterByDate?: string;
    allAnnouncements?: string;
    updates?: string;
    opportunities?: string;
    events?: string;
    loadingAnnouncements?: string;
    errorLoadingAnnouncements?: string;
    retry?: string;
    currentAnnouncements?: string;
    showing?: string;
    active?: string;
    announcement?: string;
    announcements?: string;
    noCurrentAnnouncements?: string;
    tryAdjustingSearch?: string;
    clearFilters?: string;
    priority?: string;
    deadline?: string;
    readMore?: string;
    applyNow?: string;
    pastAnnouncements?: string;
    browseThroughArchive?: string;
    previous?: string;
    archived?: string;
    noPastAnnouncements?: string;
    tryAdjustingFilter?: string;
    neverMissUpdate?: string;
    subscribeNewsletter?: string;
    getLatestAnnouncements?: string;
    weeklyDigest?: string;
    priorityAccess?: string;
    exclusiveInvitations?: string;
    successfullySubscribed?: string;
    thankYouSubscribing?: string;
    receiveLatestUpdates?: string;
    yourEmailAddress?: string;
    subscribeToUpdates?: string;
    respectPrivacy?: string;
    applicationDeadline?: string;
    noHeroContent?: string;
    noStatsAvailable?: string;
    noImageAvailable?: string;
    mediumPriority?: string;
    lowPriority?: string;
  }>({});

  useEffect(() => {
    let ignore = false;

    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchAnnouncements();
        if (!ignore) {
          setAnnouncements(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "An error occurred");
          console.error("Error fetching announcements:", err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    const loadHeroBanner = async () => {
      try {
        const data = await fetchAnnouncementsHero();
        if (!ignore) {
          setHeroBanner(data);
        }
      } catch (error) {
        console.error("Error fetching hero banner:", error);
      }
    };

    loadAnnouncements();
    loadHeroBanner();

    return () => {
      ignore = true;
    };
  }, []);

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

      if (loading) return;

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
        if (heroBanner?.statistics) {
          translations.statistics = await Promise.all(
            [
              { label: "Active Announcements" },
              { label: "Open Opportunities" },
              { label: "Upcoming Events" },
            ].map(async (stat) => ({
              label: await translateText(stat.label || "", targetLang),
            }))
          );
        }

        // Translate announcements (title, excerpt, content, category, type)
        if (announcements && announcements.length > 0) {
          // Collect unique types first
          const uniqueTypes = Array.from(
            new Set(announcements.map((a) => a.type).filter(Boolean))
          );

          const translatedTypes: Record<string, string> = {};
          for (const type of uniqueTypes) {
            if (type) {
              translatedTypes[type] = await translateText(type, targetLang);
            }
          }
          translations.translatedTypes = translatedTypes;

          // Translate announcement titles, excerpts, content, categories, and types
          translations.translatedAnnouncements = await Promise.all(
            announcements.map(async (announcement) => ({
              title: announcement.title
                ? await translateText(announcement.title, targetLang)
                : announcement.title,
              excerpt: announcement.excerpt
                ? await translateText(announcement.excerpt, targetLang)
                : announcement.excerpt,
              content: announcement.content
                ? await translateText(announcement.content, targetLang)
                : announcement.content,
              category: announcement.category
                ? await translateText(announcement.category, targetLang)
                : announcement.category,
              type: announcement.type
                ? translatedTypes[announcement.type] || announcement.type
                : announcement.type,
            }))
          );
        }

        // Translate static UI text
        translations.stayInformed = await translateText(
          "Stay Informed",
          targetLang
        );
        translations.announcementsOpportunities = await translateText(
          "Announcements & Opportunities",
          targetLang
        );
        translations.stayUpToDate = await translateText(
          "Stay up to date with official updates, exciting opportunities, and upcoming events from STEMpower Ethiopia. Be the first to know about new programs, job openings, and partnership announcements.",
          targetLang
        );
        translations.activeAnnouncements = await translateText(
          "Active Announcements",
          targetLang
        );
        translations.openOpportunities = await translateText(
          "Open Opportunities",
          targetLang
        );
        translations.upcomingEvents = await translateText(
          "Upcoming Events",
          targetLang
        );
        translations.searchAnnouncements = await translateText(
          "Search announcements by title or keyword...",
          targetLang
        );
        translations.filterByDate = await translateText(
          "Filter by date",
          targetLang
        );
        translations.allAnnouncements = await translateText(
          "All Announcements",
          targetLang
        );
        translations.updates = await translateText("Updates", targetLang);
        translations.opportunities = await translateText(
          "Opportunities",
          targetLang
        );
        translations.events = await translateText("Events", targetLang);
        translations.loadingAnnouncements = await translateText(
          "Loading announcements...",
          targetLang
        );
        translations.errorLoadingAnnouncements = await translateText(
          "Error loading announcements",
          targetLang
        );
        translations.retry = await translateText("Retry", targetLang);
        translations.currentAnnouncements = await translateText(
          "Current Announcements",
          targetLang
        );
        translations.showing = await translateText("Showing", targetLang);
        translations.active = await translateText("active", targetLang);
        translations.announcement = await translateText(
          "announcement",
          targetLang
        );
        translations.announcements = await translateText(
          "announcements",
          targetLang
        );
        translations.noCurrentAnnouncements = await translateText(
          "No current announcements found",
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
        translations.priority = await translateText("Priority", targetLang);
        translations.deadline = await translateText("Deadline:", targetLang);
        translations.readMore = await translateText("Read More", targetLang);
        translations.applyNow = await translateText("Apply Now", targetLang);
        translations.pastAnnouncements = await translateText(
          "Past Announcements",
          targetLang
        );
        translations.browseThroughArchive = await translateText(
          "Browse through our archive of",
          targetLang
        );
        translations.previous = await translateText("previous", targetLang);
        translations.archived = await translateText("Archived", targetLang);
        translations.noPastAnnouncements = await translateText(
          "No past announcements found",
          targetLang
        );
        translations.tryAdjustingFilter = await translateText(
          "Try adjusting your search or filter to find archived announcements.",
          targetLang
        );
        translations.neverMissUpdate = await translateText(
          "Never Miss an Update",
          targetLang
        );
        translations.subscribeNewsletter = await translateText(
          "Subscribe to our newsletter and get the latest announcements, opportunities, and event updates delivered directly to your inbox.",
          targetLang
        );
        translations.getLatestAnnouncements = await translateText(
          "get the latest announcements, opportunities, and event updates delivered directly to your inbox.",
          targetLang
        );
        translations.weeklyDigest = await translateText(
          "Weekly digest of new announcements",
          targetLang
        );
        translations.priorityAccess = await translateText(
          "Priority access to opportunities",
          targetLang
        );
        translations.exclusiveInvitations = await translateText(
          "Exclusive event invitations",
          targetLang
        );
        translations.successfullySubscribed = await translateText(
          "Successfully Subscribed!",
          targetLang
        );
        translations.thankYouSubscribing = await translateText(
          "Thank you for subscribing. You'll receive our latest updates in your inbox.",
          targetLang
        );
        translations.receiveLatestUpdates = await translateText(
          "You'll receive our latest updates in your inbox.",
          targetLang
        );
        translations.yourEmailAddress = await translateText(
          "Your email address",
          targetLang
        );
        translations.subscribeToUpdates = await translateText(
          "Subscribe to Updates",
          targetLang
        );
        translations.respectPrivacy = await translateText(
          "We respect your privacy. Unsubscribe at any time.",
          targetLang
        );
        translations.applicationDeadline = await translateText(
          "Application Deadline:",
          targetLang
        );
        translations.noHeroContent = await translateText(
          "No announcements hero content available yet.",
          targetLang
        );
        translations.noStatsAvailable = await translateText(
          "No statistics available yet.",
          targetLang
        );
        translations.noImageAvailable = await translateText(
          "No image available",
          targetLang
        );
        translations.mediumPriority = await translateText("Medium", targetLang);
        translations.lowPriority = await translateText("Low", targetLang);

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    if (!loading) {
      translateDynamicContent(selectedLanguage);
    }
  }, [selectedLanguage, heroBanner, announcements, loading]);

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
    : "";
  const displayHeroTitle = heroBanner?.title
    ? getTranslated("heroTitle", heroBanner.title)
    : "";
  const displayHeroDescription = heroBanner?.description
    ? getTranslated("heroDescription", heroBanner.description)
    : "";
  const displayStats =
    translatedContent.statistics && selectedLanguage !== "en"
      ? [
          {
            label:
              translatedContent.statistics[0]?.label || "Active Announcements",
          },
          {
            label:
              translatedContent.statistics[1]?.label || "Open Opportunities",
          },
          {
            label: translatedContent.statistics[2]?.label || "Upcoming Events",
          },
        ]
      : [
          { label: "Active Announcements" },
          { label: "Open Opportunities" },
          { label: "Upcoming Events" },
        ];
  const displayAnnouncements =
    translatedContent.translatedAnnouncements && selectedLanguage !== "en"
      ? announcements.map((announcement, index) => ({
          ...announcement,
          title:
            translatedContent.translatedAnnouncements![index]?.title ||
            announcement.title,
          excerpt:
            translatedContent.translatedAnnouncements![index]?.excerpt ||
            announcement.excerpt,
          content:
            translatedContent.translatedAnnouncements![index]?.content ||
            announcement.content,
          category:
            translatedContent.translatedAnnouncements![index]?.category ||
            announcement.category,
          // Keep original type for type safety, but we'll translate it for display
        }))
      : announcements;

  // Helper to get translated type for display
  const getTranslatedType = (type: string): string => {
    if (selectedLanguage === "en") return type;
    const translatedType = translatedContent.translatedTypes?.[type];
    return translatedType || type;
  };

  // Get translated announcement for modal
  const displaySelectedAnnouncement = selectedAnnouncement
    ? displayAnnouncements.find((a) => a.id === selectedAnnouncement.id) ||
      selectedAnnouncement
    : null;

  // Separate current (including future), and past announcements based on start_date, end_date, and deadline
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

  const currentAnnouncements = displayAnnouncements.filter((announcement) => {
    const startDate = new Date(announcement.date);
    startDate.setHours(0, 0, 0, 0);

    // Include future announcements (not started yet) in current
    if (startDate > currentDate) {
      return true; // Future announcements are shown as "upcoming"
    }

    // Check if announcement has an end_date and if it hasn't passed
    if (announcement.endDate) {
      const endDate = new Date(announcement.endDate);
      endDate.setHours(0, 0, 0, 0);
      if (endDate < currentDate) {
        return false; // End date has passed
      }
    }

    // Check if announcement has a deadline and if it hasn't passed
    if (announcement.deadline) {
      const deadline = new Date(announcement.deadline);
      deadline.setHours(0, 0, 0, 0);
      if (deadline < currentDate) {
        return false; // Deadline has passed
      }
    }

    // If start_date has passed and (no end_date/deadline or they haven't passed), it's current
    return true;
  });

  const pastAnnouncements = displayAnnouncements.filter((announcement) => {
    const startDate = new Date(announcement.date);
    startDate.setHours(0, 0, 0, 0);

    // Future announcements are not past
    if (startDate > currentDate) {
      return false;
    }

    // Check if end_date has passed
    if (announcement.endDate) {
      const endDate = new Date(announcement.endDate);
      endDate.setHours(0, 0, 0, 0);
      if (endDate < currentDate) {
        return true; // End date has passed
      }
    }

    // Check if deadline has passed (and no end_date or end_date hasn't passed)
    if (announcement.deadline) {
      const deadline = new Date(announcement.deadline);
      deadline.setHours(0, 0, 0, 0);
      if (deadline < currentDate) {
        // Only mark as past if there's no end_date or end_date has also passed
        if (!announcement.endDate) {
          return true;
        }
        const endDate = new Date(announcement.endDate);
        endDate.setHours(0, 0, 0, 0);
        return endDate < currentDate;
      }
    }

    return false; // No end_date or deadline, or both are in the future
  });

  const filteredAnnouncements = currentAnnouncements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || announcement.type === selectedCategory;
    const matchesDate = !selectedDate || announcement.date === selectedDate;
    return matchesSearch && matchesCategory && matchesDate;
  });

  const filteredPastAnnouncements = pastAnnouncements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || announcement.type === selectedCategory;
    const matchesDate = !selectedDate || announcement.date === selectedDate;
    return matchesSearch && matchesCategory && matchesDate;
  });

  const heroStats = {
    activeAnnouncements: currentAnnouncements.length,
    openOpportunities: currentAnnouncements.filter(
      (a) => a.type === "opportunity"
    ).length,
    upcomingEvents: currentAnnouncements.filter((a) => a.type === "event")
      .length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case "update":
        return <Bell className="w-4 h-4" />;
      case "opportunity":
        return <Briefcase className="w-4 h-4" />;
      case "event":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Megaphone className="w-4 h-4" />;
    }
  };

  const getPriorityLabel = (priority?: string) => {
    const value = (priority || "").toLowerCase();
    if (value === "high") {
      return getTranslatedText("priority", "Priority");
    }
    if (value === "low") {
      return getTranslatedText("lowPriority", "Low");
    }
    return getTranslatedText("mediumPriority", "Medium");
  };

  const handleReadMore = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscriptionSuccess(true);
      setEmail("");
      setTimeout(() => setSubscriptionSuccess(false), 5000);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] via-[#2a9b96] to-[#24C3BC]">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-10 bg-cover bg-center" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/10" />

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
            <div className="text-center text-white">
              {displayHeroBadge ? (
                <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm text-base px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {displayHeroBadge}
                </Badge>
              ) : null}
              {displayHeroTitle ? (
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">
                  {displayHeroTitle}
                </h1>
              ) : (
                <h1 className="text-3xl md:text-4xl font-semibold mb-4 text-balance leading-tight">
                  {getTranslatedText(
                    "noHeroContent",
                    "No announcements hero content available yet."
                  )}
                </h1>
              )}
              {displayHeroDescription ? (
                <p className="text-xl text-white/90 mb-8 text-pretty leading-relaxed max-w-3xl mx-auto">
                  {displayHeroDescription}
                </p>
              ) : null}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
                {heroStats.activeAnnouncements > 0 ||
                heroStats.openOpportunities > 0 ||
                heroStats.upcomingEvents > 0 ? (
                  <>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="text-3xl font-bold mb-1">
                        {heroStats.activeAnnouncements}
                      </div>
                      <div className="text-sm text-white/90">
                        {displayStats[0]?.label || "Active Announcements"}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="text-3xl font-bold mb-1">
                        {heroStats.openOpportunities}
                      </div>
                      <div className="text-sm text-white/90">
                        {displayStats[1]?.label || "Open Opportunities"}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="text-3xl font-bold mb-1">
                        {heroStats.upcomingEvents}
                      </div>
                      <div className="text-sm text-white/90">
                        {displayStats[2]?.label || "Upcoming Events"}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-3 text-center text-sm text-white/80 py-4">
                    {getTranslatedText(
                      "noStatsAvailable",
                      "No statistics available yet."
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-linear-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Card className="mb-8 border-2 shadow-xl bg-linear-to-br from-white to-slate-50/50">
                <CardContent className="p-8">
                  <div className="flex flex-col gap-6">
                    {/* Search and Date Filter Row */}
                    <div className="grid md:grid-cols-[1fr_auto] gap-4">
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-[#367375] transition-colors" />
                        <Input
                          placeholder={getTranslatedText(
                            "searchAnnouncements",
                            "Search announcements by title or keyword..."
                          )}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-12 h-14 text-base border-2 focus:border-[#367375] shadow-sm"
                        />
                      </div>
                      <div className="relative group w-full md:w-72">
                        <CalendarDays className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none group-focus-within:text-[#367375] transition-colors" />
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="pl-12 pr-10 h-14 text-base border-2 focus:border-[#367375] shadow-sm"
                          placeholder={getTranslatedText(
                            "filterByDate",
                            "Filter by date"
                          )}
                        />
                        {selectedDate && (
                          <button
                            onClick={() => setSelectedDate("")}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Clear date filter"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="border-t pt-6">
                      <Tabs
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-4 h-14 w-full bg-slate-100">
                          <TabsTrigger
                            value="all"
                            className="text-base font-medium data-[state=active]:bg-white"
                          >
                            {getTranslatedText(
                              "allAnnouncements",
                              "All Announcements"
                            )}
                          </TabsTrigger>
                          <TabsTrigger
                            value="update"
                            className="text-base font-medium data-[state=active]:bg-white"
                          >
                            <Bell className="w-4 h-4 mr-2" />
                            {getTranslatedText("updates", "Updates")}
                          </TabsTrigger>
                          <TabsTrigger
                            value="opportunity"
                            className="text-base font-medium data-[state=active]:bg-white"
                          >
                            <Briefcase className="w-4 h-4 mr-2" />
                            {getTranslatedText(
                              "opportunities",
                              "Opportunities"
                            )}
                          </TabsTrigger>
                          <TabsTrigger
                            value="event"
                            className="text-base font-medium data-[state=active]:bg-white"
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            {getTranslatedText("events", "Events")}
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-[#367375]" />
                  <span className="ml-3 text-muted-foreground">
                    {getTranslatedText(
                      "loadingAnnouncements",
                      "Loading announcements..."
                    )}
                  </span>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <Card className="p-12 text-center border-2 border-dashed">
                  <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {getTranslatedText(
                      "errorLoadingAnnouncements",
                      "Error loading announcements"
                    )}
                  </h3>
                  <p className="text-muted-foreground mb-6">{error}</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setError(null);
                      window.location.reload();
                    }}
                  >
                    {getTranslatedText("retry", "Retry")}
                  </Button>
                </Card>
              )}

              {/* Current Announcements Section */}
              {!loading && !error && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        {getTranslatedText(
                          "currentAnnouncements",
                          "Current Announcements"
                        )}
                      </h2>
                      <p className="text-muted-foreground">
                        {getTranslatedText("showing", "Showing")}{" "}
                        <span className="font-semibold text-foreground">
                          {filteredAnnouncements.length}
                        </span>{" "}
                        {getTranslatedText("active", "active")}{" "}
                        {filteredAnnouncements.length === 1
                          ? getTranslatedText("announcement", "announcement")
                          : getTranslatedText("announcements", "announcements")}
                      </p>
                    </div>
                  </div>

                  {filteredAnnouncements.length === 0 ? (
                    <Card className="p-12 text-center border-2 border-dashed">
                      <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">
                        {getTranslatedText(
                          "noCurrentAnnouncements",
                          "No current announcements found"
                        )}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {getTranslatedText(
                          "tryAdjustingSearch",
                          "Try adjusting your search or filter to find what you're looking for."
                        )}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setSelectedDate("");
                        }}
                      >
                        {getTranslatedText("clearFilters", "Clear Filters")}
                      </Button>
                    </Card>
                  ) : (
                    <div className="grid gap-6">
                      {filteredAnnouncements.map((announcement) => (
                        <Card
                          key={announcement.id}
                          className="overflow-hidden border-2 hover:border-[#367375]/50 hover:shadow-xl transition-all group"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Image */}
                            <div className="relative w-full md:w-72 h-48 overflow-hidden bg-muted shrink-0">
                              {announcement.image ? (
                                <img
                                  src={announcement.image}
                                  alt={announcement.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted">
                                  {getTranslatedText(
                                    "noImageAvailable",
                                    "No image available"
                                  )}
                                </div>
                              )}
                              <Badge
                                className={`absolute top-3 left-3 ${getPriorityColor(
                                  announcement.priority || "medium"
                                )} border font-semibold text-xs`}
                              >
                                {getPriorityLabel(announcement.priority)}
                              </Badge>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-5">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge
                                  variant="secondary"
                                  className="flex items-center gap-1 text-xs"
                                >
                                  {getCategoryIcon(announcement.type)}
                                  {announcement.category}
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(
                                    announcement.date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {announcement.location}
                                </div>
                              </div>

                              <h3 className="text-xl font-bold mb-2 text-balance group-hover:text-[#367375] transition-colors line-clamp-2">
                                {announcement.title}
                              </h3>

                              <p className="text-sm text-muted-foreground mb-3 text-pretty leading-relaxed line-clamp-2">
                                {announcement.excerpt}
                              </p>

                              {announcement.deadline && (
                                <div className="flex items-center gap-2 mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span className="text-xs font-medium text-amber-900">
                                    {getTranslatedText("deadline", "Deadline:")}{" "}
                                    {new Date(
                                      announcement.deadline
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleReadMore(announcement)}
                                  className="bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2a9b96] hover:to-[#1fa89f]"
                                >
                                  {getTranslatedText("readMore", "Read More")}
                                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                </Button>
                                {announcement.type === "opportunity" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-gradient-white hover:bg-linear-to-r from-[#367375] to-[#24C3BC]"
                                    onClick={() => {
                                      const externalUrl = ensureExternalUrl(
                                        announcement.googleFormUrl
                                      );
                                      if (externalUrl) {
                                        window.open(
                                          externalUrl,
                                          "_blank",
                                          "noopener,noreferrer"
                                        );
                                      }
                                    }}
                                  >
                                    {getTranslatedText("applyNow", "Apply Now")}
                                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {!loading && !error && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        {getTranslatedText(
                          "pastAnnouncements",
                          "Past Announcements"
                        )}
                      </h2>
                      <p className="text-muted-foreground">
                        {getTranslatedText(
                          "browseThroughArchive",
                          "Browse through our archive of"
                        )}{" "}
                        <span className="font-semibold text-foreground">
                          {filteredPastAnnouncements.length}
                        </span>{" "}
                        {getTranslatedText("previous", "previous")}{" "}
                        {filteredPastAnnouncements.length === 1
                          ? getTranslatedText("announcement", "announcement")
                          : getTranslatedText("announcements", "announcements")}
                      </p>
                    </div>
                  </div>

                  <div className="bg-linear-to-br from-[#367375]/5 via-[#2a9b96]/5 to-[#24C3BC]/5 rounded-lg p-6 border-2 border-[#367375]/20">
                    <div className="grid gap-6">
                      {filteredPastAnnouncements.map((announcement) => (
                        <Card
                          key={announcement.id}
                          className="overflow-hidden border-2 hover:border-[#367375]/50 hover:shadow-xl transition-all group opacity-90"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Image */}
                            <div className="relative w-full md:w-72 h-48 overflow-hidden bg-muted shrink-0">
                              {announcement.image ? (
                                <img
                                  src={announcement.image}
                                  alt={announcement.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 grayscale-30"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted">
                                  {getTranslatedText(
                                    "noImageAvailable",
                                    "No image available"
                                  )}
                                </div>
                              )}
                              <Badge className="absolute top-3 left-3 bg-slate-100 text-slate-700 border-slate-300 font-semibold text-xs">
                                {getTranslatedText("archived", "Archived")}
                              </Badge>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-5">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge
                                  variant="secondary"
                                  className="flex items-center gap-1 text-xs"
                                >
                                  {getCategoryIcon(announcement.type)}
                                  {announcement.category}
                                </Badge>
                                <div className="flex items-center text-xs text-muted-foreground gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(
                                    announcement.date
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {announcement.location}
                                </div>
                              </div>

                              <h3 className="text-xl font-bold mb-2 text-balance group-hover:text-[#367375] transition-colors line-clamp-2">
                                {announcement.title}
                              </h3>

                              <p className="text-sm text-muted-foreground mb-3 text-pretty leading-relaxed line-clamp-2">
                                {announcement.excerpt}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReadMore(announcement)}
                                  className="bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2a9b96] hover:to-[#1fa89f] text-white"
                                >
                                  {getTranslatedText("readMore", "Read More")}
                                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                </Button>
                                {announcement.type === "opportunity" && (
                                  <Button
                                    size="sm"
                                    className="bg-linear-to-r from-[#367375] hover:from-[#367375] to-[#24C3BC]"
                                    onClick={() => {
                                      const externalUrl = ensureExternalUrl(
                                        announcement.googleFormUrl
                                      );
                                      if (externalUrl) {
                                        window.open(
                                          externalUrl,
                                          "_blank",
                                          "noopener,noreferrer"
                                        );
                                      }
                                    }}
                                  >
                                    {getTranslatedText("applyNow", "Apply Now")}
                                    <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* No Past Results */}
                    {filteredPastAnnouncements.length === 0 && (
                      <Card className="p-12 text-center border-2 border-dashed">
                        <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          {getTranslatedText(
                            "noPastAnnouncements",
                            "No past announcements found"
                          )}
                        </h3>
                        <p className="text-muted-foreground">
                          {getTranslatedText(
                            "tryAdjustingFilter",
                            "Try adjusting your search or filter to find archived announcements."
                          )}
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              )}

              {!loading && !error && (
                <Card className="mt-12 bg-linear-to-br from-[#367375]/5 to-[#24C3BC]/5 border-2 border-[#367375]/20">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#367375]/10 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-[#367375]" />
                          </div>
                          <h3 className="text-2xl font-bold">
                            {getTranslatedText(
                              "neverMissUpdate",
                              "Never Miss an Update"
                            )}
                          </h3>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {getTranslatedText(
                            "subscribeNewsletter",
                            "Subscribe to our newsletter and get the latest announcements, opportunities, and event updates delivered directly to your inbox."
                          )}
                        </p>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-[#367375] shrink-0 mt-0.5" />
                          <span>
                            {getTranslatedText(
                              "weeklyDigest",
                              "Weekly digest of new announcements"
                            )}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
                          <CheckCircle2 className="w-4 h-4 text-[#367375] shrink-0 mt-0.5" />
                          <span>
                            {getTranslatedText(
                              "priorityAccess",
                              "Priority access to opportunities"
                            )}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2">
                          <CheckCircle2 className="w-4 h-4 text-[#367375] shrink-0 mt-0.5" />
                          <span>
                            {getTranslatedText(
                              "exclusiveInvitations",
                              "Exclusive event invitations"
                            )}
                          </span>
                        </div>
                      </div>
                      <div>
                        {subscriptionSuccess ? (
                          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center">
                            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
                            <h4 className="text-lg font-bold text-green-900 mb-2">
                              {getTranslatedText(
                                "successfullySubscribed",
                                "Successfully Subscribed!"
                              )}
                            </h4>
                            <p className="text-sm text-green-700">
                              {getTranslatedText(
                                "thankYouSubscribing",
                                "Thank you for subscribing. You'll receive our latest updates in your inbox."
                              )}
                            </p>
                          </div>
                        ) : (
                          <form
                            onSubmit={handleSubscribe}
                            className="space-y-4"
                          >
                            <Input
                              placeholder={getTranslatedText(
                                "yourEmailAddress",
                                "Your email address"
                              )}
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="h-12 text-base border-2"
                            />
                            <Button
                              type="submit"
                              className="w-full h-12 text-base bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2a9b96] hover:to-[#1fa89f]"
                            >
                              {getTranslatedText(
                                "subscribeToUpdates",
                                "Subscribe to Updates"
                              )}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                              {getTranslatedText(
                                "respectPrivacy",
                                "We respect your privacy. Unsubscribe at any time."
                              )}
                            </p>
                          </form>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {displaySelectedAnnouncement && (
            <>
              <DialogHeader>
                <div className="relative w-full h-64 -mx-6 -mt-6 mb-4 overflow-hidden">
                  {displaySelectedAnnouncement.image ? (
                    <img
                      src={displaySelectedAnnouncement.image}
                      alt={displaySelectedAnnouncement.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted">
                      {getTranslatedText(
                        "noImageAvailable",
                        "No image available"
                      )}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <Badge
                    className={`absolute top-4 left-4 ${getPriorityColor(
                      displaySelectedAnnouncement.priority || "medium"
                    )} border font-semibold`}
                  >
                    {getPriorityLabel(displaySelectedAnnouncement.priority)}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {getCategoryIcon(displaySelectedAnnouncement.type)}
                    {displaySelectedAnnouncement.category}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(
                      displaySelectedAnnouncement.date
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <MapPin className="w-4 h-4" />
                    {displaySelectedAnnouncement.location}
                  </div>
                </div>
                <DialogTitle className="text-2xl font-bold text-balance leading-tight">
                  {displaySelectedAnnouncement.title}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-base text-foreground leading-relaxed space-y-4">
                {displaySelectedAnnouncement.deadline && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="text-sm font-medium text-amber-900">
                      {getTranslatedText(
                        "applicationDeadline",
                        "Application Deadline:"
                      )}{" "}
                      {new Date(
                        displaySelectedAnnouncement.deadline
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <p className="text-pretty">
                  {displaySelectedAnnouncement.content}
                </p>
                {displaySelectedAnnouncement.type === "opportunity" && (
                  <div className="pt-4">
                    <Button
                      className="w-full bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2a9b96] hover:to-[#1fa89f]"
                      onClick={() => {
                        const externalUrl = ensureExternalUrl(
                          displaySelectedAnnouncement.googleFormUrl
                        );
                        if (externalUrl) {
                          window.open(
                            externalUrl,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }
                      }}
                    >
                      {getTranslatedText("applyNow", "Apply Now")}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
