"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowRight,
  Star,
  Filter,
  Search,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Event, EventsHero } from "@/lib/api-types";
import { fetchEvents, fetchEventsHero } from "@/lib/api-events";
import { useApp } from "@/lib/app-context";

const categoryColors = {
  Competition:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
  Workshop:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
  Summit:
    "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
  Bootcamp:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
  Training:
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800",
  Showcase:
    "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800",
};

const DEFAULT_CATEGORY_STYLES =
  "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/30 dark:text-slate-200 dark:border-slate-700";
const DEFAULT_REGISTRATION_LINK = "https://forms.gle/your-google-form-link";

const ensureExternalUrl = (url?: string | null) => {
  const value = (url || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;
  return `https://${value}`;
};

const getEventCategory = (event: Event) =>
  event.category || event.badge || "Event";

const getCategoryStyles = (category: string) =>
  categoryColors[category as keyof typeof categoryColors] ??
  DEFAULT_CATEGORY_STYLES;

const getRegistrationLink = (event: Event) =>
  ensureExternalUrl(event.registrationLink || DEFAULT_REGISTRATION_LINK);

const DEFAULT_EVENTS_HERO: EventsHero = {
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

export default function EventsPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [heroContent, setHeroContent] =
    useState<EventsHero>(DEFAULT_EVENTS_HERO);
  const [isLoadingHero, setIsLoadingHero] = useState(true);
  const [heroError, setHeroError] = useState<string | null>(null);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ label: string }>;
    translatedEvents?: Array<{
      title?: string;
      description?: string;
      category?: string;
      fullDescription?: string;
      highlights?: string[];
    }>;
    translatedCategories?: Record<string, string>;
    // Static UI text translations
    browseUpcomingEvents?: string;
    viewPastEvents?: string;
    stayInspired?: string;
    latestHighlights?: string;
    searchEvents?: string;
    filterBy?: string;
    all?: string;
    upcomingEvents?: string;
    pastEvents?: string;
    featuredEvents?: string;
    featured?: string;
    date?: string;
    time?: string;
    location?: string;
    participants?: string;
    registrationDeadline?: string;
    registerNow?: string;
    learnMore?: string;
    allUpcomingEvents?: string;
    loadingEvents?: string;
    fetchingLatestOpportunities?: string;
    noEventsFound?: string;
    tryAdjustingSearch?: string;
    explorePreviousEvents?: string;
    seeTheImpact?: string;
    loadingPastEvents?: string;
    hangTight?: string;
    noPastEventsFound?: string;
    completed?: string;
    viewHighlights?: string;
    neverMissAnEvent?: string;
    subscribeNewsletter?: string;
    firstToKnow?: string;
    subscribedSuccessfully?: string;
    enterYourEmail?: string;
    subscribe?: string;
    joinSubscribers?: string;
    eventHighlights?: string;
    registerForThisEvent?: string;
    couldNotLoadEvents?: string;
    unableToLoadHero?: string;
  }>({});

  useEffect(() => {
    let ignore = false;

    const loadEvents = async () => {
      try {
        setIsLoadingEvents(true);
        setLoadError(null);
        const data = await fetchEvents();
        if (!ignore) {
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        if (!ignore) {
          setLoadError(
            "We couldn't load the latest events. Please try again later."
          );
          setEvents([]);
        }
      } finally {
        if (!ignore) {
          setIsLoadingEvents(false);
        }
      }
    };

    const loadHero = async () => {
      try {
        setIsLoadingHero(true);
        setHeroError(null);
        const data = await fetchEventsHero();
        if (!ignore) {
          setHeroContent({
            ...DEFAULT_EVENTS_HERO,
            ...data,
            statistics:
              Array.isArray(data.statistics) && data.statistics.length > 0
                ? data.statistics
                : DEFAULT_EVENTS_HERO.statistics,
          });
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
        if (!ignore) {
          setHeroContent(DEFAULT_EVENTS_HERO);
          setHeroError(
            "Unable to load the latest hero content. Showing the default hero instead."
          );
        }
      } finally {
        if (!ignore) {
          setIsLoadingHero(false);
        }
      }
    };

    loadEvents();
    loadHero();

    return () => {
      ignore = true;
    };
  }, []);

  const categories = useMemo(() => {
    if (events.length === 0) {
      return ["all"];
    }
    const uniqueCategories = new Set(
      events.map((event) => getEventCategory(event))
    );
    return ["all", ...Array.from(uniqueCategories)];
  }, [events]);

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

      if (isLoadingEvents || isLoadingHero) return;

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
        if (heroContent?.statistics) {
          translations.statistics = await Promise.all(
            heroContent.statistics.map(async (stat) => ({
              label: await translateText(stat.label || "", targetLang),
            }))
          );
        }

        // Translate events (title, description, category, fullDescription, highlights)
        if (events && events.length > 0) {
          // Collect unique categories first
          const uniqueCategories = Array.from(
            new Set(events.map((e) => getEventCategory(e)).filter(Boolean))
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

          // Translate event titles, descriptions, categories, fullDescriptions, and highlights
          translations.translatedEvents = await Promise.all(
            events.map(async (event) => ({
              title: event.title
                ? await translateText(event.title, targetLang)
                : event.title,
              description: event.description
                ? await translateText(event.description, targetLang)
                : event.description,
              category: event.category
                ? translatedCategories[event.category] || event.category
                : event.category,
              fullDescription: event.fullDescription
                ? await translateText(event.fullDescription, targetLang)
                : event.fullDescription,
              highlights: event.highlights
                ? await Promise.all(
                    event.highlights.map((h) => translateText(h, targetLang))
                  )
                : event.highlights,
            }))
          );
        }

        // Translate static UI text
        translations.browseUpcomingEvents = await translateText(
          "Browse Upcoming Events",
          targetLang
        );
        translations.viewPastEvents = await translateText(
          "View Past Events",
          targetLang
        );
        translations.stayInspired = await translateText(
          "Stay Inspired",
          targetLang
        );
        translations.latestHighlights = await translateText(
          "Latest highlights from our community",
          targetLang
        );
        translations.searchEvents = await translateText(
          "Search events...",
          targetLang
        );
        translations.filterBy = await translateText("Filter by:", targetLang);
        translations.all = await translateText("All", targetLang);
        translations.upcomingEvents = await translateText(
          "Upcoming Events",
          targetLang
        );
        translations.pastEvents = await translateText(
          "Past Events",
          targetLang
        );
        translations.featuredEvents = await translateText(
          "Featured Events",
          targetLang
        );
        translations.featured = await translateText("Featured", targetLang);
        translations.date = await translateText("Date", targetLang);
        translations.time = await translateText("Time", targetLang);
        translations.location = await translateText("Location", targetLang);
        translations.participants = await translateText(
          "Participants",
          targetLang
        );
        translations.registrationDeadline = await translateText(
          "Registration Deadline:",
          targetLang
        );
        translations.registerNow = await translateText(
          "Register Now",
          targetLang
        );
        translations.learnMore = await translateText("Learn More", targetLang);
        translations.allUpcomingEvents = await translateText(
          "All Upcoming Events",
          targetLang
        );
        translations.loadingEvents = await translateText(
          "Loading events",
          targetLang
        );
        translations.fetchingLatestOpportunities = await translateText(
          "Fetching the latest opportunities for you...",
          targetLang
        );
        translations.noEventsFound = await translateText(
          "No events found",
          targetLang
        );
        translations.tryAdjustingSearch = await translateText(
          "Try adjusting your search or filter criteria",
          targetLang
        );
        translations.explorePreviousEvents = await translateText(
          "Explore our previous events and see the impact we've made in the STEM community.",
          targetLang
        );
        translations.seeTheImpact = await translateText(
          "see the impact we've made in the STEM community.",
          targetLang
        );
        translations.loadingPastEvents = await translateText(
          "Loading past events",
          targetLang
        );
        translations.hangTight = await translateText(
          "Hang tight while we gather the highlights.",
          targetLang
        );
        translations.noPastEventsFound = await translateText(
          "No past events found",
          targetLang
        );
        translations.completed = await translateText("Completed", targetLang);
        translations.viewHighlights = await translateText(
          "View Highlights",
          targetLang
        );
        translations.neverMissAnEvent = await translateText(
          "Never Miss an Event",
          targetLang
        );
        translations.subscribeNewsletter = await translateText(
          "Subscribe to our newsletter and be the first to know about upcoming workshops, competitions, and networking opportunities in Ethiopia's STEM community.",
          targetLang
        );
        translations.firstToKnow = await translateText(
          "be the first to know about upcoming workshops, competitions, and networking opportunities in Ethiopia's STEM community.",
          targetLang
        );
        translations.subscribedSuccessfully = await translateText(
          "Subscribed successfully!",
          targetLang
        );
        translations.enterYourEmail = await translateText(
          "Enter your email",
          targetLang
        );
        translations.subscribe = await translateText("Subscribe", targetLang);
        translations.joinSubscribers = await translateText(
          "Join 5,000+ students and educators already subscribed",
          targetLang
        );
        translations.eventHighlights = await translateText(
          "Event Highlights",
          targetLang
        );
        translations.registerForThisEvent = await translateText(
          "Register for This Event",
          targetLang
        );
        translations.couldNotLoadEvents = await translateText(
          "We couldn't load the latest events. Please try again later.",
          targetLang
        );
        translations.unableToLoadHero = await translateText(
          "Unable to load the latest hero content. Showing the default hero instead.",
          targetLang
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    if (!isLoadingEvents && !isLoadingHero) {
      translateDynamicContent(selectedLanguage);
    }
  }, [
    selectedLanguage,
    heroContent,
    events,
    isLoadingEvents,
    isLoadingHero,
    categories,
  ]);

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
  const displayHeroBadge = getTranslated(
    "heroBadge",
    heroContent?.badge || "STEMpower Ethiopia Events"
  );
  const displayHeroTitle = getTranslated(
    "heroTitle",
    heroContent?.title || "Join Our STEM Community Events"
  );
  const displayHeroDescription = getTranslated(
    "heroDescription",
    heroContent?.description ||
      "Discover workshops, competitions, and networking opportunities designed to advance STEM education and innovation across Ethiopia."
  );
  const displayStatsFromHero =
    translatedContent.statistics && selectedLanguage !== "en"
      ? heroContent.statistics?.map((stat, index) => ({
          ...stat,
          label: translatedContent.statistics![index]?.label || stat.label,
        })) || []
      : heroContent.statistics || [];
  const displayEvents =
    translatedContent.translatedEvents && selectedLanguage !== "en"
      ? events.map((event, index) => ({
          ...event,
          title:
            translatedContent.translatedEvents![index]?.title || event.title,
          description:
            translatedContent.translatedEvents![index]?.description ||
            event.description,
          category:
            translatedContent.translatedEvents![index]?.category ||
            event.category,
          fullDescription:
            translatedContent.translatedEvents![index]?.fullDescription ||
            event.fullDescription,
          highlights:
            translatedContent.translatedEvents![index]?.highlights ||
            event.highlights,
        }))
      : events;
  const displayCategories =
    translatedContent.translatedCategories && selectedLanguage !== "en"
      ? categories.map((cat) => ({
          original: cat,
          translated:
            cat === "all"
              ? getTranslatedText("all", "All")
              : translatedContent.translatedCategories![cat] || cat,
        }))
      : categories.map((cat) => ({
          original: cat,
          translated: cat === "all" ? getTranslatedText("all", "All") : cat,
        }));

  const heroStatsFromData = [
    {
      id: "stat-upcoming",
      label: getTranslatedText("upcomingEvents", "Upcoming Events"),
      value: String(
        events.filter((event) => event.status === "upcoming").length
      ),
    },
    {
      id: "stat-past",
      label: getTranslatedText("pastEvents", "Past Events"),
      value: String(events.filter((event) => event.status === "past").length),
    },
    {
      id: "stat-featured",
      label: getTranslatedText("featuredEvents", "Featured Events"),
      value: String(
        events.filter((event) => event.status === "upcoming" && event.featured)
          .length
      ),
    },
  ];

  const heroStats =
    events.length > 0 ? heroStatsFromData : displayStatsFromHero;

  const filteredEvents = displayEvents.filter((event) => {
    const categoryLabel = getEventCategory(event);
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || categoryLabel === selectedCategory;
    const matchesTab = event.status === activeTab;
    return matchesSearch && matchesCategory && matchesTab;
  });

  const upcomingEvents = filteredEvents.filter(
    (event) => event.status === "upcoming"
  );
  const featuredEvents = upcomingEvents.filter((event) => event.featured);

  // Get translated event for modal
  const displaySelectedEvent = selectedEvent
    ? displayEvents.find((e) => e.id === selectedEvent.id) || selectedEvent
    : null;
  const showLoadingState = isLoadingEvents && events.length === 0;

  const scrollToUpcomingEvents = () => {
    setActiveTab("upcoming");
    const element = document.getElementById("events-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToPastEvents = () => {
    setActiveTab("past");
    const element = document.getElementById("events-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubscribe = () => {
    if (email && email.includes("@")) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  const handleLearnMore = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden  bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
        <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/10" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="text-white text-center lg:text-left space-y-6">
              <div className="flex justify-center lg:justify-start">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                  <Sparkles className="h-3 w-3 mr-1.5" />
                  {displayHeroBadge}
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-balance leading-tight">
                {displayHeroTitle}
              </h1>
              <p className="text-xl text-emerald-50 text-pretty leading-relaxed max-w-3xl mx-auto lg:mx-0">
                {displayHeroDescription}
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.id}
                    className="rounded-lg bg-white/10 backdrop-blur border border-white/10 px-4 py-3 text-left"
                  >
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-white/80">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={scrollToUpcomingEvents}
                  className="text-lg px-8 py-6 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  {getTranslatedText(
                    "browseUpcomingEvents",
                    "Browse Upcoming Events"
                  )}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={scrollToPastEvents}
                  className="text-lg px-8 py-6 hover:scale-105 transition-all bg-background/80 backdrop-blur border-2"
                >
                  {getTranslatedText("viewPastEvents", "View Past Events")}
                </Button>
              </div>
            </div>
            {heroContent.image && (
              <div className="relative">
                <div
                  className={`overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-white/10 backdrop-blur ${
                    isLoadingHero ? "animate-pulse" : ""
                  }`}
                >
                  <img
                    src={heroContent.image}
                    alt={heroContent.title}
                    className="w-full h-[420px] object-cover object-center"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 text-white shadow-lg">
                  <p className="text-lg font-semibold">
                    {getTranslatedText("stayInspired", "Stay Inspired")}
                  </p>
                  <p className="text-sm text-white/80">
                    {getTranslatedText(
                      "latestHighlights",
                      "Latest highlights from our community"
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent" />
      </section>

      {heroError && (
        <div className="container max-w-5xl mx-auto px-4 mt-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 dark:border-yellow-900/30 dark:bg-yellow-950/30 dark:text-yellow-200">
            {selectedLanguage === "en"
              ? heroError
              : getTranslatedText("unableToLoadHero", heroError)}
          </div>
        </div>
      )}

      <section className="py-8 bg-muted/30 border-b backdrop-blur-lg">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={getTranslatedText(
                  "searchEvents",
                  "Search events..."
                )}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {getTranslatedText("filterBy", "Filter by:")}
              </span>
              {displayCategories.map((cat) => (
                <Button
                  key={cat.original}
                  variant={
                    selectedCategory === cat.original ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(cat.original)}
                  className={
                    selectedCategory === cat.original
                      ? "bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2d5f62] hover:to-[#1fa89f] text-white shadow-md hover:scale-105 transition-all"
                      : "hover:border-[#367375] hover:text-[#367375] hover:bg-linear-to-r hover:from-[#367375]/10 hover:to-[#24C3BC]/10 hover:scale-105 transition-all"
                  }
                >
                  {cat.translated.charAt(0).toUpperCase() +
                    cat.translated.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {loadError && (
        <div className="container max-w-6xl mx-auto px-4 mt-4">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-900 dark:border-yellow-900/30 dark:bg-yellow-950/30 dark:text-yellow-200">
            {selectedLanguage === "en"
              ? loadError
              : getTranslatedText("couldNotLoadEvents", loadError)}
          </div>
        </div>
      )}

      <section id="events-section" className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="upcoming" className="text-base">
                {getTranslatedText("upcomingEvents", "Upcoming Events")}
              </TabsTrigger>
              <TabsTrigger value="past" className="text-base">
                {getTranslatedText("pastEvents", "Past Events")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-16">
              {featuredEvents.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <Star className="h-6 w-6 text-primary" />
                    <h2 className="text-3xl font-bold">
                      {getTranslatedText("featuredEvents", "Featured Events")}
                    </h2>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {featuredEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 border-primary/20 bg-linear-to-br from-card to-card/50"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                          <Badge className="absolute top-4 left-4 bg-primary text-white shadow-lg">
                            {getTranslatedText("featured", "Featured")}
                          </Badge>
                          <Badge
                            className={`absolute top-4 right-4 shadow-lg ${getCategoryStyles(
                              getEventCategory(event)
                            )}`}
                          >
                            {event.category}
                          </Badge>
                        </div>
                        <CardHeader className="pb-4">
                          <h3 className="text-2xl font-bold group-hover:text-primary transition-colors mb-3">
                            {event.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {event.description}
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                              <Calendar className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {getTranslatedText("date", "Date")}
                                </p>
                                <p className="font-medium text-sm">
                                  {event.date}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Clock className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {getTranslatedText("time", "Time")}
                                </p>
                                <p className="font-medium text-sm">
                                  {event.time}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {getTranslatedText("location", "Location")}
                                </p>
                                <p className="font-medium text-sm">
                                  {event.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  {getTranslatedText(
                                    "participants",
                                    "Participants"
                                  )}
                                </p>
                                <p className="font-medium text-sm">
                                  {event.participants}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground mb-4">
                              {getTranslatedText(
                                "registrationDeadline",
                                "Registration Deadline:"
                              )}{" "}
                              <span className="font-medium text-foreground">
                                {event.registrationDeadline}
                              </span>
                            </p>
                            <Button
                              asChild
                              className="w-full bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2d5f62] hover:to-[#1fa89f] text-white shadow-lg hover:shadow-xl transition-all"
                            >
                              <Link
                                href={getRegistrationLink(event)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {getTranslatedText(
                                  "registerNow",
                                  "Register Now"
                                )}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-3xl font-bold mb-8">
                  {getTranslatedText(
                    "allUpcomingEvents",
                    "All Upcoming Events"
                  )}
                </h2>
                {showLoadingState ? (
                  <Card className="p-12 text-center">
                    <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-semibold mb-2">
                      {getTranslatedText("loadingEvents", "Loading events")}
                    </h3>
                    <p className="text-muted-foreground">
                      {getTranslatedText(
                        "fetchingLatestOpportunities",
                        "Fetching the latest opportunities for you..."
                      )}
                    </p>
                  </Card>
                ) : upcomingEvents.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {getTranslatedText("noEventsFound", "No events found")}
                    </h3>
                    <p className="text-muted-foreground">
                      {getTranslatedText(
                        "tryAdjustingSearch",
                        "Try adjusting your search or filter criteria"
                      )}
                    </p>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur overflow-hidden"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <Badge
                            className={`absolute top-3 right-3 shadow-lg ${getCategoryStyles(
                              getEventCategory(event)
                            )}`}
                          >
                            {event.category}
                          </Badge>
                        </div>
                        <CardContent className="p-5 space-y-4">
                          <h4 className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">
                            {event.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="line-clamp-1">
                                {event.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-4 w-4 text-primary" />
                              <span>{event.participants}</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <Button
                              asChild
                              className="w-full bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2d5f62] hover:to-[#1fa89f] text-white shadow-lg hover:shadow-xl transition-all"
                            >
                              <Link
                                href={getRegistrationLink(event)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {getTranslatedText(
                                  "registerNow",
                                  "Register Now"
                                )}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              onClick={() => handleLearnMore(event)}
                              variant="ghost"
                              size="sm"
                              className="w-full bg-transparent hover:bg-transparent"
                            >
                              <span className="transition-colors duration-300 hover:bg-clip-text hover:text-transparent hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC]">
                                {getTranslatedText("learnMore", "Learn More")}
                              </span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  {getTranslatedText("pastEvents", "Past Events")}
                </h2>
                <p className="text-muted-foreground mb-8">
                  {getTranslatedText(
                    "explorePreviousEvents",
                    "Explore our previous events and see the impact we've made in the STEM community."
                  )}
                </p>
                {showLoadingState ? (
                  <Card className="p-12 text-center">
                    <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-semibold mb-2">
                      {getTranslatedText(
                        "loadingPastEvents",
                        "Loading past events"
                      )}
                    </h3>
                    <p className="text-muted-foreground">
                      {getTranslatedText(
                        "hangTight",
                        "Hang tight while we gather the highlights."
                      )}
                    </p>
                  </Card>
                ) : filteredEvents.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {getTranslatedText(
                        "noPastEventsFound",
                        "No past events found"
                      )}
                    </h3>
                    <p className="text-muted-foreground">
                      {getTranslatedText(
                        "tryAdjustingSearch",
                        "Try adjusting your search or filter criteria"
                      )}
                    </p>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/60 backdrop-blur overflow-hidden"
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110 grayscale-30"
                          />
                          <Badge
                            className={`absolute top-3 right-3 ${getCategoryStyles(
                              getEventCategory(event)
                            )}`}
                          >
                            {event.category}
                          </Badge>
                          <Badge className="absolute top-3 left-3 bg-muted text-muted-foreground">
                            {getTranslatedText("completed", "Completed")}
                          </Badge>
                        </div>
                        <CardContent className="p-5 space-y-4">
                          <h4 className="font-bold text-lg group-hover:text-primary transition-colors leading-tight">
                            {event.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4 text-primary" />
                              <span className="line-clamp-1">
                                {event.location}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-4 w-4 text-primary" />
                              <span>{event.participants}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleLearnMore(event)}
                            variant="outline"
                            size="sm"
                            className="w-full hover:scale-105 transition-all bg-transparent"
                          >
                            {getTranslatedText(
                              "viewHighlights",
                              "View Highlights"
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-linear-to-br from-primary/5 via-background to-accent/5">
        <div className="container max-w-6xl mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-linear-to-r from-primary/10 to-accent/10 border-primary/20 overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4">
                {getTranslatedText("neverMissAnEvent", "Never Miss an Event")}
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {getTranslatedText(
                  "subscribeNewsletter",
                  "Subscribe to our newsletter and be the first to know about upcoming workshops, competitions, and networking opportunities in Ethiopia's STEM community."
                )}
              </p>
              {isSubscribed ? (
                <div className="flex items-center justify-center gap-2 text-primary text-lg font-medium">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>
                    {getTranslatedText(
                      "subscribedSuccessfully",
                      "Subscribed successfully!"
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder={getTranslatedText(
                      "enterYourEmail",
                      "Enter your email"
                    )}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSubscribe}
                    size="lg"
                    className="bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2d5f62] hover:to-[#1fa89f] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    {getTranslatedText("subscribe", "Subscribe")}
                  </Button>
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                {getTranslatedText(
                  "joinSubscribers",
                  "Join 5,000+ students and educators already subscribed"
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {displaySelectedEvent && (
            <>
              <DialogHeader>
                <div className="relative w-full h-48 -mt-6 -mx-6 mb-4 overflow-hidden">
                  <img
                    src={displaySelectedEvent.image || "/placeholder.svg"}
                    alt={displaySelectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                  <Badge
                    className={`absolute top-4 right-4 ${getCategoryStyles(
                      getEventCategory(displaySelectedEvent)
                    )}`}
                  >
                    {displaySelectedEvent.category}
                  </Badge>
                </div>
                <DialogTitle className="text-3xl">
                  {displaySelectedEvent.title}
                </DialogTitle>
                <DialogDescription className="text-base leading-relaxed pt-2">
                  {displaySelectedEvent.fullDescription}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {getTranslatedText("date", "Date")}
                      </p>
                      <p className="font-medium">{displaySelectedEvent.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {getTranslatedText("time", "Time")}
                      </p>
                      <p className="font-medium">{displaySelectedEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {getTranslatedText("location", "Location")}
                      </p>
                      <p className="font-medium">
                        {displaySelectedEvent.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {getTranslatedText("participants", "Participants")}
                      </p>
                      <p className="font-medium">
                        {displaySelectedEvent.participants}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">
                    {getTranslatedText("eventHighlights", "Event Highlights")}
                  </h4>
                  <ul className="space-y-2">
                    {displaySelectedEvent.highlights?.map(
                      (highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-muted-foreground">
                            {highlight}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {displaySelectedEvent.status === "upcoming" && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      {getTranslatedText(
                        "registrationDeadline",
                        "Registration Deadline:"
                      )}{" "}
                      <span className="font-medium text-foreground">
                        {displaySelectedEvent.registrationDeadline}
                      </span>
                    </p>
                    <Button
                      asChild
                      className="w-full bg-linear-to-r from-[#367375] to-[#24C3BC]"
                      size="lg"
                    >
                      <Link
                        href={getRegistrationLink(displaySelectedEvent)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getTranslatedText(
                          "registerForThisEvent",
                          "Register for This Event"
                        )}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
