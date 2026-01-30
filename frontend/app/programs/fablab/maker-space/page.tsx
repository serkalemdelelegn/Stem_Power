"use client";

import Image from "next/image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Calendar,
  Award,
  Clock,
  MapPin,
  Lightbulb,
} from "lucide-react";

// Import types and fetch functions from the API file
import {
  fetchHero,
  fetchStats,
  fetchGallery,
  fetchWorkshops,
  fetchMakerSpaceItems,
  type HeroContent,
  type ImpactStat,
  type GalleryItem,
  type Workshop,
  type Feature,
} from "@/lib/api-programs/fablab/api-programs-fablab-maker-space"; // Assuming api.ts is located in lib/api.ts
import { useApp } from "@/lib/app-context";

// ReadMoreText Component
function ReadMoreText({ 
  text, 
  maxLines = 2,
  readMoreText = "Read More",
  readLessText = "Read Less"
}: { 
  text: string; 
  maxLines?: number;
  readMoreText?: string;
  readLessText?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current && !isExpanded) {
        // When line-clamp is applied, if scrollHeight > clientHeight, text is truncated
        const scrollHeight = textRef.current.scrollHeight;
        const clientHeight = textRef.current.clientHeight;
        // Add small tolerance for rounding
        setNeedsTruncation(scrollHeight > clientHeight + 1);
      }
    };

    // Check after render and on window resize
    checkTruncation();
    const timeoutId = setTimeout(checkTruncation, 100);
    window.addEventListener("resize", checkTruncation);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkTruncation);
    };
  }, [text, maxLines, isExpanded]);

  if (!text) return null;

  return (
    <div>
      <p
        ref={textRef}
        className="text-sm text-muted-foreground leading-relaxed"
        style={{
          display: isExpanded ? "block" : "-webkit-box",
          WebkitLineClamp: isExpanded ? "none" : maxLines,
          WebkitBoxOrient: "vertical",
          overflow: isExpanded ? "visible" : "hidden",
        }}
      >
        {text}
      </p>
      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-[#367375] hover:text-[#24C3BC] font-medium mt-1 transition-colors"
        >
          {isExpanded ? readLessText : readMoreText}
        </button>
      )}
    </div>
  );
}

export default function MakerSpacePage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [showAllGallery, setShowAllGallery] = useState(false);

  // State initialization with API types
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ number: string; label: string; icon: any }>;
    features?: Array<{
      title: string;
      description: string;
      category?: string;
    }>;
    gallery?: Array<{ caption?: string }>;
    workshops?: Array<{
      title: string;
      description: string;
      level: string;
      location: string;
    }>;
    // Static UI text translations
    whereMakingMeetsMeaning?: string;
    ourMakerSpaceIsOpen?: string;
    withMentorsAndPeerSupport?: string;
    whatYoullExplore?: string;
    diveIntoHandsOnProjects?: string;
    loadingHighlights?: string;
    insideTheMakerSpace?: string;
    momentsOfCuriosity?: string;
    showLess?: string;
    loadMore?: string;
    upcomingWorkshops?: string;
    handsOnSessions?: string;
    level?: string;
    registerNow?: string;
    readMore?: string;
    readLess?: string;
  }>({});

  // Combined fetch effect
  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel using the API helper functions
        // The API functions handle errors internally and return fallbacks
        const [heroData, statsData, galleryData, workshopsData, featuresData] =
          await Promise.all([
            fetchHero(),
            fetchStats(),
            fetchGallery(),
            fetchWorkshops(),
            fetchMakerSpaceItems(),
          ]);

        if (isMounted) {
          setHeroContent(heroData);
          setStats(statsData);
          setGallery(galleryData);
          setWorkshops(workshopsData);
          setFeatures(featuresData);
        }
      } catch (err) {
        console.error(
          "[MakerSpacePage] Unexpected error during data load",
          err
        );
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

        // Translate statistics labels (keep numbers unchanged)
        if (stats && stats.length > 0) {
          translations.statistics = await Promise.all(
            stats.map(async (stat) => ({
              ...stat,
              label: await translateText(stat.label || "", targetLang),
              // number stays the same
            }))
          );
        }

        // Translate features
        if (features && features.length > 0) {
          translations.features = await Promise.all(
            features.map(async (feature) => ({
              title: await translateText(feature.title || "", targetLang),
              description: await translateText(
                feature.description || "",
                targetLang
              ),
              category: feature.category
                ? await translateText(feature.category, targetLang)
                : undefined,
            }))
          );
        }

        // Translate gallery captions
        if (gallery && gallery.length > 0) {
          translations.gallery = await Promise.all(
            gallery.map(async (item) => ({
              caption: item.caption
                ? await translateText(item.caption, targetLang)
                : undefined,
            }))
          );
        }

        // Translate workshops (date and duration stay unchanged)
        if (workshops && workshops.length > 0) {
          translations.workshops = await Promise.all(
            workshops.map(async (workshop) => ({
              title: await translateText(workshop.title || "", targetLang),
              description: await translateText(
                workshop.description || "",
                targetLang
              ),
              level: await translateText(workshop.level || "", targetLang),
              location: await translateText(
                workshop.location || "",
                targetLang
              ),
              // date and duration stay the same
            }))
          );
        }

        // Translate static UI text
        translations.whereMakingMeetsMeaning = await translateText(
          "Where Making Meets Meaning",
          targetLang
        );
        translations.ourMakerSpaceIsOpen = await translateText(
          "Our Maker Space is open to every curious mind ready to tinker and explore. From 3D printing and electronics to robotics, design, and DIY projects, students collaborate, test ideas, and learn by doing.",
          targetLang
        );
        translations.withMentorsAndPeerSupport = await translateText(
          "With mentors and peer support, failure becomes a step toward discovery, building confidence to innovate and solve real-world problems for their communities.",
          targetLang
        );
        translations.whatYoullExplore = await translateText(
          "What You'll Explore",
          targetLang
        );
        translations.diveIntoHandsOnProjects = await translateText(
          "Dive into hands-on projects across multiple disciplines and technologies",
          targetLang
        );
        translations.loadingHighlights = await translateText(
          "Loading highlights...",
          targetLang
        );
        translations.insideTheMakerSpace = await translateText(
          "Inside the Maker Space",
          targetLang
        );
        translations.momentsOfCuriosity = await translateText(
          "Moments of curiosity, collaboration, and creation",
          targetLang
        );
        translations.showLess = await translateText("Show Less", targetLang);
        translations.loadMore = await translateText("Load More", targetLang);
        translations.upcomingWorkshops = await translateText(
          "Upcoming Workshops",
          targetLang
        );
        translations.handsOnSessions = await translateText(
          "Hands-on sessions to build skills and confidence",
          targetLang
        );
        translations.level = await translateText("Level:", targetLang);
        translations.registerNow = await translateText(
          "Register Now",
          targetLang
        );
        translations.readMore = await translateText("Read More", targetLang);
        translations.readLess = await translateText("Read Less", targetLang);

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
  }, [
    selectedLanguage,
    heroContent,
    stats,
    features,
    gallery,
    workshops,
    isLoading,
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
  const displayHeroBadge = getTranslated("heroBadge", heroContent?.badge || "");
  const displayHeroTitle = getTranslated("heroTitle", heroContent?.title || "");
  const displayHeroDescription = getTranslated(
    "heroDescription",
    heroContent?.description || ""
  );
  const displayStats =
    translatedContent.statistics && selectedLanguage !== "en"
      ? translatedContent.statistics
      : stats;
  const displayFeatures =
    translatedContent.features && selectedLanguage !== "en"
      ? features.map((feature, index) => ({
          ...feature,
          title: translatedContent.features![index].title,
          description: translatedContent.features![index].description,
          category: translatedContent.features![index].category,
        }))
      : features;
  const displayGallery =
    translatedContent.gallery && selectedLanguage !== "en"
      ? gallery.map((item, index) => ({
          ...item,
          caption: translatedContent.gallery![index].caption,
        }))
      : gallery;
  const displayWorkshops =
    translatedContent.workshops && selectedLanguage !== "en"
      ? workshops.map((workshop, index) => ({
          ...workshop,
          title: translatedContent.workshops![index].title,
          description: translatedContent.workshops![index].description,
          level: translatedContent.workshops![index].level,
          location: translatedContent.workshops![index].location,
        }))
      : workshops;

  // Derived state for gallery display
  const displayedGallery = showAllGallery
    ? displayGallery
    : displayGallery.slice(0, 8);

  const gradientTextClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                {displayHeroBadge && (
                  <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center w-fit">
                    <Sparkles className="h-3 w-3 mr-1.5" />
                    {displayHeroBadge}
                  </Badge>
                )}

                {displayHeroTitle ? (
                  <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold leading-snug">
                    {displayHeroTitle}
                  </h1>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-xl text-emerald-50/80">
                      Hero content will be displayed here once it is added.
                    </p>
                  </div>
                )}
                {displayHeroDescription && (
                  <p className="text-xl text-emerald-50 mb-8 text-pretty leading-relaxed">
                    {displayHeroDescription}
                  </p>
                )}
              </div>

              {heroContent?.image && (
                <div className="relative">
                  <div className="relative h-[300px] md:h-[350px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                    <Image
                      src={heroContent.image}
                      alt="Students using 3D printer in FabLab"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
        </section>

        {/* Stats Bar */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
          {displayStats.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {displayStats.map((stat, index) => {
                // The API now returns the actual component in stat.icon
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
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center border border-white/10 bg-white/10 backdrop-blur-md rounded-xl">
              <CardContent className="pt-8 pb-8 px-4">
                <p className="text-muted-foreground">
                  Impact statistics will be displayed here once they are added.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Introduction */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2
                  className={`${gradientTextClass} text-4xl md:text-5xl mb-6`}
                >
                  {getTranslatedText(
                    "whereMakingMeetsMeaning",
                    "Where Making Meets Meaning"
                  )}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {getTranslatedText(
                    "ourMakerSpaceIsOpen",
                    "Our Maker Space is open to every curious mind ready to tinker and explore. From 3D printing and electronics to robotics, design, and DIY projects, students collaborate, test ideas, and learn by doing."
                  )}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {getTranslatedText(
                    "withMentorsAndPeerSupport",
                    "With mentors and peer support, failure becomes a step toward discovery, building confidence to innovate and solve real-world problems for their communities."
                  )}
                </p>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl border-2 border-primary/10">
                <Image
                  src="/making meets.png"
                  alt="Young entrepreneurs in FabLab maker space"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-linear-to-b from-slate-50 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className={`${gradientTextClass} text-4xl mb-4`}>
                {getTranslatedText("whatYoullExplore", "What You'll Explore")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {getTranslatedText(
                  "diveIntoHandsOnProjects",
                  "Dive into hands-on projects across multiple disciplines and technologies"
                )}
              </p>
              {isLoading && (
                <p className="text-sm text-muted-foreground mt-2">
                  {getTranslatedText(
                    "loadingHighlights",
                    "Loading highlights..."
                  )}
                </p>
              )}
            </div>
            {displayFeatures.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card
                      key={index}
                      className="group overflow-hidden border-2 hover:border-[#367375]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                    >
                      {feature.image && (
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={feature.image}
                            alt={feature.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <div className="w-12 h-12 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center shadow-lg">
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                      {!feature.image && (
                        <div className="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-lg">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="text-lg font-bold mb-2 text-[#367375]">
                          {feature.title}
                        </h3>
                        <ReadMoreText 
                          text={feature.description}
                          maxLines={2}
                          readMoreText={getTranslatedText("readMore", "Read More")}
                          readLessText={getTranslatedText("readLess", "Read Less")}
                        />
                        {feature.category && (
                          <p className="mt-3 text-xs font-medium uppercase tracking-wide text-[#367375]/70">
                            {feature.category}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-2">
                <CardContent className="pt-12 pb-12 px-6 text-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">
                    Maker space features will be displayed here once they are
                    added.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Gallery */}
        <section
          id="gallery"
          className="py-20 bg-linear-to-b from-slate-50 to-white"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className={`${gradientTextClass} text-4xl mb-4`}>
                {getTranslatedText(
                  "insideTheMakerSpace",
                  "Inside the Maker Space"
                )}
              </h2>
              <p className="text-lg text-muted-foreground">
                {getTranslatedText(
                  "momentsOfCuriosity",
                  "Moments of curiosity, collaboration, and creation"
                )}
              </p>
            </div>
            {displayGallery.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {displayedGallery.map((g) => (
                    <div
                      key={g.id}
                      className="group relative aspect-square overflow-hidden rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-[#367375]/50"
                    >
                      {g.image && (
                        <Image
                          src={g.image}
                          alt={g.caption || "Maker space activity"}
                          fill
                          className="object-cover"
                        />
                      )}
                      {!g.image && (
                        <div className="w-full h-full bg-linear-to-br from-[#367375] to-[#24C3BC] flex items-center justify-center">
                          <Award className="h-8 w-8 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      {g.caption && (
                        <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {g.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {displayGallery.length > 8 && (
                  <div className="text-center mt-6">
                    <Button
                      className="bg-linear-to-br from-[#367375] to-[#24C3BC] text-white px-6 py-3 font-semibold hover:opacity-90 transition"
                      onClick={() => setShowAllGallery(!showAllGallery)}
                    >
                      {showAllGallery
                        ? getTranslatedText("showLess", "Show Less")
                        : getTranslatedText("loadMore", "Load More")}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="border-2">
                <CardContent className="pt-12 pb-12 px-6 text-center">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">
                    Gallery images will be displayed here once they are added.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Workshops */}
        <section id="workshops" className="py-10 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2
                className={`text-4xl md:text-4xl mb-6 ${gradientTextClass} text-balance`}
              >
                {getTranslatedText("upcomingWorkshops", "Upcoming Workshops")}
              </h2>
              <p className="text-lg text-muted-foreground">
                {getTranslatedText(
                  "handsOnSessions",
                  "Hands-on sessions to build skills and confidence"
                )}
              </p>
            </div>
            {displayWorkshops.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {displayWorkshops.map((workshop, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden border-2 hover:border-[#367375]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
                  >
                    {workshop.image ? (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={workshop.image}
                          alt={workshop.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        {workshop.date && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-lg">
                              <Calendar className="w-3 h-3 mr-1" />
                              {workshop.date}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative aspect-[16/10] overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] flex items-center justify-center">
                        {workshop.date && (
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white text-[#367375] shadow-lg">
                              <Calendar className="w-3 h-3 mr-1" />
                              {workshop.date}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-[#367375]">
                        {workshop.title}
                      </h3>
                      <div className="space-y-2 mb-4">
                        {workshop.level && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Award className="w-4 h-4" />
                            <span>
                              {getTranslatedText("level", "Level:")}{" "}
                              {workshop.level}
                            </span>
                          </div>
                        )}
                        {workshop.duration && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{workshop.duration}</span>
                          </div>
                        )}
                        {workshop.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{workshop.location}</span>
                          </div>
                        )}
                      </div>
                      {workshop.description && (
                        <div className="mb-4">
                          <ReadMoreText 
                            text={workshop.description}
                            maxLines={2}
                            readMoreText={getTranslatedText("readMore", "Read More")}
                            readLessText={getTranslatedText("readLess", "Read Less")}
                          />
                        </div>
                      )}
                      {workshop.registrationLink ? (
                        <Button className="w-full bg-linear-to-br from-[#367375] to-[#24C3BC] text-white px-6 py-3 font-semibold hover:opacity-90 transition">
                          <a
                            href={
                              workshop.registrationLink.startsWith("http://") ||
                              workshop.registrationLink.startsWith("https://")
                                ? workshop.registrationLink
                                : `https://${workshop.registrationLink}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full flex items-center justify-center"
                          >
                            {getTranslatedText("registerNow", "Register Now")}
                          </a>
                        </Button>
                      ) : (
                        <Button
                          className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                          disabled
                        >
                          {getTranslatedText("registerNow", "Register Now")}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-2">
                <CardContent className="pt-12 pb-12 px-6 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">
                    Upcoming workshops will be displayed here once they are
                    added.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
