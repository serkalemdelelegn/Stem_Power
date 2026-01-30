"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  MapPin,
  Users,
  Calendar,
  Award,
  Building2,
  Sparkles,
  GraduationCap,
  Mail,
  Phone,
  User,
  DollarSign,
  Beaker,
  Search,
  ArrowUp,
  ArrowDown,
  Globe,
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import {
  fetchCenters,
  fetchHero,
  fetchStats,
  fetchLaboratoryPrograms,
  type StemCenter,
  type HeroContent,
  type ImpactStat,
  type LaboratoryProgram,
} from "@/lib/api-programs/stem-operations/api-programs-stem-operations-stem-centers";
import { useApp } from "@/lib/app-context";

export default function STEMCentersPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(6);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // default to newest first
  const [allCenters, setAllCenters] = useState<StemCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroContent, setHeroContent] = useState<HeroContent>({
    badge: "",
    title: "",
    description: "",
  });
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([]);
  const [laboratoryPrograms, setLaboratoryPrograms] = useState<
    LaboratoryProgram[]
  >([]);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ number: string; label: string; icon: any }>;
    laboratoryPrograms?: Array<{
      id: string;
      name: string;
      code: string;
      icon: string;
    }>;
  }>({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        // Fetch all data using API functions
        const [centers, hero, stats, labs] = await Promise.all([
          fetchCenters(),
          fetchHero(),
          fetchStats(),
          fetchLaboratoryPrograms(),
        ]);

        setAllCenters(Array.isArray(centers) ? centers : []);
        setHeroContent(hero || { badge: "", title: "", description: "" });

        // Map icon strings to icon components
        const iconMap: Record<string, any> = {
          Building2,
          MapPin,
          GraduationCap,
          Calendar,
        };
        setImpactStats(
          Array.isArray(stats)
            ? stats.map((stat) => {
                const iconKey =
                  typeof stat.icon === "string" ? stat.icon : undefined;
                const IconComponent = iconKey ? iconMap[iconKey] : null;
                return {
                  ...stat,
                  icon: IconComponent,
                };
              })
            : []
        );

        setLaboratoryPrograms(Array.isArray(labs) ? labs : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        // Fallback data is already handled in API functions
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
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

      if (isLoading || !allCenters.length) return;

      setTranslating(true);
      try {
        const translations: any = {};

        // Translate hero section
        if (heroContent.badge)
          translations.heroBadge = await translateText(
            heroContent.badge,
            targetLang
          );
        if (heroContent.title)
          translations.heroTitle = await translateText(
            heroContent.title,
            targetLang
          );
        if (heroContent.description)
          translations.heroDescription = await translateText(
            heroContent.description,
            targetLang
          );

        // Calculate dynamic stats first (with actual numbers)
        const currentRegionalStats = allCenters.reduce((acc, center) => {
          acc[center.region] = (acc[center.region] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const currentDynamicStats = impactStats.map((stat) => {
          if (stat.label === "STEM Centers") {
            return { ...stat, number: allCenters.length.toString() };
          }
          if (stat.label === "Regions") {
            return {
              ...stat,
              number: Object.keys(currentRegionalStats).length.toString(),
            };
          }
          return stat;
        });

        // Translate statistics labels (keep calculated numbers unchanged)
        if (currentDynamicStats && currentDynamicStats.length > 0) {
          translations.statistics = await Promise.all(
            currentDynamicStats.map(async (stat) => ({
              ...stat,
              label: await translateText(stat.label || "", targetLang),
              // number stays the same (already calculated)
            }))
          );
        }

        // Translate laboratory program names (keep codes unchanged)
        if (laboratoryPrograms && laboratoryPrograms.length > 0) {
          translations.laboratoryPrograms = await Promise.all(
            laboratoryPrograms.map(async (program) => ({
              ...program,
              name: await translateText(program.name || "", targetLang),
              // code stays the same (identifier)
            }))
          );
        }

        // Translate static UI text
        translations.featuredCenters = await translateText(
          "Featured centers",
          targetLang
        );
        translations.firstCenter = await translateText(
          "First Center - 2010",
          targetLang
        );
        translations.mostComprehensive = await translateText(
          "Most Comprehensive",
          targetLang
        );
        translations.established = await translateText(
          "Established",
          targetLang
        );
        translations.availableLaboratories = await translateText(
          "Available Laboratories",
          targetLang
        );
        translations.fundedBy = await translateText("Funded by", targetLang);
        translations.visitSite = await translateText("Visit Site", targetLang);
        translations.searchResults = await translateText(
          "Search Results",
          targetLang
        );
        translations.allStemCenters = await translateText(
          "All STEM Centers",
          targetLang
        );
        translations.showing = await translateText("Showing", targetLang);
        translations.of = await translateText("of", targetLang);
        translations.center = await translateText("center", targetLang);
        translations.centers = await translateText("centers", targetLang);
        translations.newestFirst = await translateText(
          "Newest First",
          targetLang
        );
        translations.oldestFirst = await translateText(
          "Oldest First",
          targetLang
        );
        translations.noCentersFound = await translateText(
          "No centers found",
          targetLang
        );
        translations.tryAdjustingSearch = await translateText(
          "Try adjusting your search terms",
          targetLang
        );
        translations.found = await translateText("Found", targetLang);
        translations.matching = await translateText("matching", targetLang);
        translations.loadMoreCenters = await translateText(
          "Load More Centers",
          targetLang
        );
        translations.remaining = await translateText("remaining", targetLang);
        translations.est = await translateText("Est.", targetLang);
        translations.laboratories = await translateText(
          "Laboratories",
          targetLang
        );
        translations.specializedLaboratoryPrograms = await translateText(
          "Specialized Laboratory Programs",
          targetLang
        );
        translations.laboratoryProgramsDescription = await translateText(
          "From virtual computing and electronics to 3D printing and specialized programs in basic sciences, chemical engineering, and biomechanics.",
          targetLang
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    if (!isLoading && allCenters.length > 0) {
      translateDynamicContent(selectedLanguage);
    }
  }, [
    selectedLanguage,
    heroContent,
    impactStats,
    laboratoryPrograms,
    isLoading,
    allCenters,
  ]);

  // Get translated or original content for hero section
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

  // Use translated content for hero section
  const displayHeroBadge = getTranslated("heroBadge", heroContent.badge || "");
  const displayHeroTitle = getTranslated("heroTitle", heroContent.title || "");
  const displayHeroDescription = getTranslated(
    "heroDescription",
    heroContent.description || ""
  );

  // Use centers from API (which includes fallback if backend fails)
  const centersToUse = allCenters;

  const labTypes: Record<string, string> = {
    COMP: "Computing",
    ELEX: "Electronics",
    "3DP": "3D Printing",
    MECX: "Mechanics",
    OPTX: "Optics",
    CHMX: "Chemistry",
    SOLP: "Solar Power",
    BIO: "Biology",
    AERO: "Aerospace",
    HISC: "Hi-Science",
    CHEM: "Chemistry",
    PHY: "Physics",
  };

  const regionalStats = centersToUse.reduce((acc, center) => {
    acc[center.region] = (acc[center.region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredCenters = useMemo(() => {
    let centers = centersToUse;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      centers = centers.filter((center) => {
        return (
          center.host.toLowerCase().includes(query) ||
          center.city.toLowerCase().includes(query) ||
          center.region.toLowerCase().includes(query) ||
          center.contact.toLowerCase().includes(query) ||
          center.labs.some((lab) => lab.toLowerCase().includes(query)) ||
          center.labs.some((lab) =>
            labTypes[lab]?.toLowerCase().includes(query)
          )
        );
      });
    }

    // Apply sorting
    centers = [...centers].sort((a, b) => {
      const yearA = Number.parseInt(a.yearEstablished);
      const yearB = Number.parseInt(b.yearEstablished);
      return sortOrder === "asc" ? yearA - yearB : yearB - yearA;
    });

    return centers;
  }, [searchQuery, centersToUse, sortOrder]);

  const featuredCenters = filteredCenters.filter((center) => center.featured);

  const displayedCenters = filteredCenters.slice(0, displayCount);
  const hasMoreCenters = displayCount < filteredCenters.length;

  const loadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setDisplayCount(6); // Reset display count when sorting changes
  };

  // Update stats dynamically based on centers data
  const dynamicStats = useMemo(() => {
    return impactStats.map((stat) => {
      if (stat.label === "STEM Centers") {
        return { ...stat, number: centersToUse.length.toString() };
      }
      if (stat.label === "Regions") {
        return {
          ...stat,
          number: Object.keys(regionalStats).length.toString(),
        };
      }
      return stat;
    });
  }, [impactStats, centersToUse.length, regionalStats]);

  // Use translated content for statistics
  const displayStats =
    translatedContent.statistics && selectedLanguage !== "en"
      ? translatedContent.statistics
      : dynamicStats;

  // Use translated content for laboratory programs
  const displayLaboratoryPrograms =
    translatedContent.laboratoryPrograms && selectedLanguage !== "en"
      ? translatedContent.laboratoryPrograms
      : laboratoryPrograms;

  // Helper function to get translated static text
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
  const gradientTextClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";
  const gradientButtonClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all";

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="bg-linear-to-br from-teal-50 via-white to-cyan-50">
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-lg text-gray-600">Loading STEM centers...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && allCenters.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="bg-linear-to-br from-teal-50 via-white to-cyan-50">
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  console.log(featuredCenters);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-linear-to-br from-teal-50 via-white to-cyan-50">
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
            <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] bg-cover bg-center opacity-20" />
            <div className="container relative mx-auto px-4 py-20 md:py-10">
              <div className="max-w-4xl mx-auto text-center">
                {displayHeroBadge ? (
                  <div className="flex justify-center">
                    <Badge className="mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-lg border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                      <Sparkles className="h-3 w-3 mr-1.5" />
                      {displayHeroBadge}
                    </Badge>
                  </div>
                ) : null}

                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  {displayHeroTitle || "No hero content available yet."}
                </h1>

                {displayHeroDescription ? (
                  <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                    {displayHeroDescription}
                  </p>
                ) : (
                  <p className="text-sm text-cyan-100/80">
                    Hero content has not been added yet.
                  </p>
                )}
              </div>
            </div>{" "}
            <br />
            <br />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
          </section>

          {/* Stats Cards */}
          <section className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {displayStats.length === 0 ? (
                <p className="text-sm text-center text-gray-700 col-span-2 md:col-span-4">
                  No statistics available yet.
                </p>
              ) : (
                displayStats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card
                      key={index}
                      className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/10 bg-white/10 backdrop-blur-md rounded-xl scale-95 hover:scale-100"
                    >
                      <CardContent className="pt-4 pb-3 px-2">
                        <div className="w-10 h-10 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center mx-auto mb-2 shadow-md shadow-[#24C3BC]/30">
                          {IconComponent ? (
                            <IconComponent className="h-4 w-4 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                          ) : null}
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
                })
              )}
            </div>
          </section>

          <br />
          <br />
          <br />

          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by center name, city, region, contact, or laboratory type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-base border-2 border-[#4db8b8]/30 focus:border-[#4db8b8] rounded-xl shadow-sm"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-3 text-center">
                {getTranslatedText("found", "Found")} {filteredCenters.length}{" "}
                {filteredCenters.length !== 1
                  ? getTranslatedText("centers", "centers")
                  : getTranslatedText("center", "center")}{" "}
                {getTranslatedText("matching", "matching")} "{searchQuery}"
              </p>
            )}
          </div>

          {/* Featured Centers */}
          {featuredCenters.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-center">
                <Badge
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md "
                >
                  <MapPin className="w-4 h-4" />
                  {getTranslatedText("featuredCenters", "Featured centers")}
                </Badge>
              </div>
              <br />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {featuredCenters.map((center, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-2xl transition-all border-2 border-[#367375]/30 hover:border-[#24C3BC] overflow-hidden"
                  >
                    <div className="relative h-64 w-full overflow-hidden bg-linear-to-br from-[#4db8b8]/10 to-teal-50">
                      <Image
                        src={center.imageQuery || ""}
                        alt={`${center.host} - Students in STEM laboratory`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-lg">
                          {index === 0
                            ? getTranslatedText(
                                "firstCenter",
                                "First Center - 2010"
                              )
                            : getTranslatedText(
                                "mostComprehensive",
                                "Most Comprehensive"
                              )}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-3 text-[#1a5f5f]">
                            {center.host}
                          </CardTitle>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-700">
                              <MapPin className="h-4 w-4 shrink-0 text-[#4db8b8]" />
                              <span>
                                {center.city}, {center.region}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <Calendar className="h-4 w-4 shrink-0 text-[#4db8b8]" />
                              <span>
                                {getTranslatedText(
                                  "established",
                                  "Established"
                                )}{" "}
                                {center.yearEstablished}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                              <User className="h-4 w-4 shrink-0 text-[#4db8b8]" />
                              <span>{center.contact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-[#1a5f5f] mb-2 flex items-center gap-2">
                            <Beaker className="h-4 w-4" />
                            {getTranslatedText(
                              "availableLaboratories",
                              "Available Laboratories"
                            )}{" "}
                            ({center.labs.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {center.labs.map((lab, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs bg-[#4db8b8]/10 text-[#1a5f5f]"
                              >
                                {lab}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="pt-4 border-t space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="h-4 w-4 shrink-0 text-[#4db8b8]" />
                            <a
                              href={`tel:${center.phone}`}
                              className="hover:text-[#1a5f5f] font-medium"
                            >
                              {center.phone}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="h-4 w-4 shrink-0 text-[#4db8b8]" />
                            <a
                              href={`mailto:${center.email}`}
                              className="hover:text-[#1a5f5f] break-all"
                            >
                              {center.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <DollarSign className="h-4 w-4 shrink-0 text-[#4db8b8]" />
                            <span>
                              {getTranslatedText("fundedBy", "Funded by")}{" "}
                              {center.funder}
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-700">
                            <Globe className="h-4 w-4 shrink-0 text-[#4db8b8]" />
                            <a
                              href={center.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#1a5f5f] break-all leading-tight"
                            >
                              {getTranslatedText("visitSite", "Visit Site")}
                            </a>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Centers Grid */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto">
              <div>
                <h2
                  className={`text-4xl md:text-4xl mb-6 ${gradientTextClass} text-balance`}
                >
                  {searchQuery
                    ? getTranslatedText("searchResults", "Search Results")
                    : getTranslatedText("allStemCenters", "All STEM Centers")}
                </h2>
                <p className="text-gray-700">
                  {getTranslatedText("showing", "Showing")}{" "}
                  {displayedCenters.length} {getTranslatedText("of", "of")}{" "}
                  {filteredCenters.length}{" "}
                  {filteredCenters.length !== 1
                    ? getTranslatedText("centers", "centers")
                    : getTranslatedText("center", "center")}
                </p>
              </div>

              <Button
                onClick={toggleSortOrder}
                variant="outline"
                className="flex items-center gap-2 border-2 border-[#367375]/30 hover:border-[#24C3BC] text-white bg-linear-to-br from-[#367375] to-[#24C3BC]"
              >
                {sortOrder === "desc" ? (
                  <>
                    <ArrowDown className="h-4 w-4" />
                    {getTranslatedText("newestFirst", "Newest First")}
                  </>
                ) : (
                  <>
                    <ArrowUp className="h-4 w-4" />
                    {getTranslatedText("oldestFirst", "Oldest First")}
                  </>
                )}
              </Button>
            </div>

            {filteredCenters.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {getTranslatedText("noCentersFound", "No centers found")}
                </h3>
                <p className="text-gray-600">
                  {getTranslatedText(
                    "tryAdjustingSearch",
                    "Try adjusting your search terms"
                  )}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {displayedCenters.map((center, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-xl transition-all border-2 border-gray-200 hover:border-[#4db8b8] group overflow-hidden"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-gray-100 to-teal-50">
                        <Image
                          src={center.imageQuery || ""}
                          alt={`${center.host} laboratory`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-white/90 backdrop-blur-sm text-[#1a5f5f]"
                          >
                            {center.cluster}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-lg leading-tight group-hover:text-[#1a5f5f] transition-colors">
                            {center.host}
                          </CardTitle>
                        </div>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#4db8b8]" />
                            <span className="text-xs">
                              {center.city}, {center.region}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-700">
                            <Calendar className="h-3.5 w-3.5 shrink-0 text-[#4db8b8]" />
                            <span className="text-xs">
                              {getTranslatedText("est", "Est.")}{" "}
                              {center.yearEstablished}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-[#1a5f5f] mb-2 flex items-center gap-1.5">
                            <Beaker className="h-3.5 w-3.5" />
                            {getTranslatedText(
                              "laboratories",
                              "Laboratories"
                            )}{" "}
                            ({center.labs.length})
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {center.labs.map((lab, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs px-2 py-0.5 bg-[#4db8b8]/10 text-[#1a5f5f]"
                              >
                                {lab}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t space-y-2">
                          <div className="flex items-start gap-2 text-xs text-gray-700">
                            <User className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#4db8b8]" />
                            <span className="leading-tight">
                              {center.contact}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-[#4db8b8]" />
                            <a
                              href={`tel:${center.phone}`}
                              className="hover:text-[#1a5f5f] font-medium"
                            >
                              {center.phone}
                            </a>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-700">
                            <Mail className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#4db8b8]" />
                            <a
                              href={`mailto:${center.email}`}
                              className="hover:text-[#1a5f5f] break-all leading-tight"
                            >
                              {center.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <DollarSign className="h-3.5 w-3.5 shrink-0 text-[#4db8b8]" />
                            <Badge
                              variant="outline"
                              className="text-xs border-[#4db8b8]/30 text-[#1a5f5f]"
                            >
                              {center.funder}
                            </Badge>
                          </div>
                          <div className="flex items-start gap-2 text-xs text-gray-700">
                            <Globe className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[#4db8b8]" />
                            <a
                              href={center.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#1a5f5f] break-all leading-tight"
                            >
                              Visit Site
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {hasMoreCenters && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={loadMore}
                      size="lg"
                      className="bg-linear-to-br from-[#367375] to-[#24C3BC] hover:opacity-90 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg"
                    >
                      {getTranslatedText(
                        "loadMoreCenters",
                        "Load More Centers"
                      )}
                      <span className="ml-2 text-sm opacity-90">
                        ({filteredCenters.length - displayCount}{" "}
                        {getTranslatedText("remaining", "remaining")})
                      </span>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* What Makes Centers Special */}
          {/* <div className="bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-3xl p-12 mb-16 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">What Makes Our STEM Centers Special</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Hands-On Innovation</h3>
                <p className="text-white/90 leading-relaxed">
                  Fully equipped labs with modern technologies where students explore engineering and science through
                  practical, guided experiences with expert mentors.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Anchors</h3>
                <p className="text-white/90 leading-relaxed">
                  More than classrooms—our centers host local gatherings, science fairs, and regional competitions,
                  creating spaces where knowledge is shared and communities unite.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">University Partnerships</h3>
                <p className="text-white/90 leading-relaxed">
                  Located on or near university campuses, ensuring academic oversight, fostering collaboration, and
                  building long-term sustainability.
                </p>
              </div>
            </div>
          </div> */}

          {/* Laboratory Types */}
          <div className="mb-16 pl-10 pr-10">
            <h2
              className={`text-4xl md:text-4xl mb-6 text-center ${gradientTextClass} text-balance`}
            >
              {getTranslatedText(
                "specializedLaboratoryPrograms",
                "Specialized Laboratory Programs"
              )}
            </h2>
            <p className="text-center text-gray-700 mb-10 max-w-2xl mx-auto">
              {getTranslatedText(
                "laboratoryProgramsDescription",
                "From virtual computing and electronics to 3D printing and specialized programs in basic sciences, chemical engineering, and biomechanics."
              )}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {displayLaboratoryPrograms.length > 0 ? (
                displayLaboratoryPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white border-2 border-[#367375]/30 rounded-xl p-4 text-center hover:border-[#24C3BC] hover:shadow-lg transition-all"
                  >
                    <div className="text-2xl mb-2">{program.icon || ""}</div>
                    <div className="font-semibold text-sm text-[#1a5f5f]">
                      {program.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {program.code}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-700 col-span-6">
                  No laboratory programs available yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
