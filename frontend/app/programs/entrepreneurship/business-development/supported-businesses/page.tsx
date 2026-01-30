"use client";
import { useState, useMemo, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Users,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Phone,
  Mail,
  Briefcase,
  Tag,
  Search,
  Filter,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchSuccessStories,
  type SuccessStory,
} from "@/lib/api-programs/entrepreneurship/api-programs-entrepreneurship-business-dev";
import { useApp } from "@/lib/app-context";

// Data will be fetched from API
const sectorColors: Record<string, string> = {
  Manufacturing: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "Engineering/Agriculture":
    "bg-green-500/10 text-green-700 border-green-500/20",
  "Technology/Agriculture": "bg-teal-500/10 text-teal-700 border-teal-500/20",
  "Engineering/Service":
    "bg-purple-500/10 text-purple-700 border-purple-500/20",
  "Agriculture/Food":
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  "Engineering/Manufacturing":
    "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
  Food: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "Health/Social Enterprise": "bg-red-500/10 text-red-700 border-red-500/20",
  "Technology/Service": "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
  Engineering: "bg-slate-500/10 text-slate-700 border-slate-500/20",
  "Service/Food": "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Service: "bg-violet-500/10 text-violet-700 border-violet-500/20",
  "Manufacturing/Product": "bg-sky-500/10 text-sky-700 border-sky-500/20",
  "Manufacturing/Food": "bg-lime-500/10 text-lime-700 border-lime-500/20",
  "Technology/Education":
    "bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/20",
  "Health/Service": "bg-rose-500/10 text-rose-700 border-rose-500/20",
  "Service/Tourism": "bg-pink-500/10 text-pink-700 border-pink-500/20",
  "Food/Agriculture": "bg-green-500/10 text-green-700 border-green-500/20",
  "Manufacturing/product": "bg-blue-500/10 text-blue-700 border-blue-500/20",
  "Engineering/Product":
    "bg-indigo-500/10 text-indigo-700 border-indigo-500/20",
};

export default function SupportedBusinessesPage() {
  // Impact stats - will be calculated from backend data
  const [impactStats, setImpactStats] = useState<
    Array<{ number: string; label: string; icon: any }>
  >([]);
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [supportedBusinesses, setSupportedBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(8);
  const [donorSearch, setDonorSearch] = useState("");
  const [selectedDonor, setSelectedDonor] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    statistics?: Array<{ number: string; label: string; icon: any }>;
    businessSectors?: Record<string, string>; // Map of original sector to translated
    businessStatuses?: Record<string, string>; // Map of original status to translated
    // Static UI text translations
    backToBDS?: string;
    successStories?: string;
    businessesWeveSupported?: string;
    heroDescription?: string;
    ourPortfolio?: string;
    transformingIdeasIntoImpact?: string;
    sectionDescription?: string;
    filterSuccessStories?: string;
    filterByDonor?: string;
    filterBySector?: string;
    filterByYear?: string;
    searchDonors?: string;
    allDonors?: string;
    allSectors?: string;
    allYears?: string;
    activeFilters?: string;
    clearAll?: string;
    showingXOfY?: string;
    of?: string;
    businesses?: string;
    loadingBusinesses?: string;
    noBusinessesFound?: string;
    loadMoreSuccessStories?: string;
  }>({});

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        const stories = await fetchSuccessStories();
        if (stories && stories.length > 0) {
          // Map to component format
          const mappedBusinesses = stories.map((story) => ({
            name: story.name,
            owner: story.owner,
            phone: story.phone,
            email: story.email,
            sector: story.sector,
            status: story.status,
            donor: story.donor,
            fundingDate: story.fundingDate,
            id: story.id,
            categoryColor: story.categoryColor,
          }));
          setSupportedBusinesses(mappedBusinesses);

          // Calculate stats from actual data
          const totalBusinesses = mappedBusinesses.length;
          const licensedCount = mappedBusinesses.filter(
            (b) => b.status?.toLowerCase() === "licensed"
          ).length;
          const licensedRate =
            totalBusinesses > 0
              ? `${Math.round((licensedCount / totalBusinesses) * 100)}%`
              : "0%";
          const uniqueSectors = new Set(
            mappedBusinesses.map((b) => b.sector).filter(Boolean)
          ).size;
          const uniqueOwners = new Set(
            mappedBusinesses.map((b) => b.owner).filter(Boolean)
          ).size;

          setImpactStats([
            {
              number: String(totalBusinesses),
              label: "Total Businesses",
              icon: Building2,
            },
            {
              number: licensedRate,
              label: "Licensed Rate",
              icon: CheckCircle,
            },
            {
              number: `${uniqueSectors}+`,
              label: "Active Sectors",
              icon: Briefcase,
            },
            {
              number: `${uniqueOwners}+`,
              label: "Entrepreneurs",
              icon: Users,
            },
          ]);
        } else {
          setSupportedBusinesses([]);
          setImpactStats([]);
        }
      } catch (error) {
        console.error("Failed to fetch businesses:", error);
        setSupportedBusinesses([]);
        setImpactStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
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

      setTranslating(true);
      try {
        const translations: any = {};

        // Translate statistics labels (keep numbers unchanged)
        // impactStats is always available (defined in component)
        if (impactStats && impactStats.length > 0) {
          translations.statistics = await Promise.all(
            impactStats.map(async (stat) => ({
              ...stat,
              label: await translateText(stat.label || "", targetLang),
              // number stays the same
            }))
          );
        }

        // Translate unique sectors and statuses from businesses
        // Only translate if businesses are loaded (not still loading)
        if (supportedBusinesses && supportedBusinesses.length > 0) {
          const uniqueSectorsSet = new Set(
            supportedBusinesses.map((b) => b.sector).filter(Boolean)
          );
          const uniqueStatusesSet = new Set(
            supportedBusinesses.map((b) => b.status).filter(Boolean)
          );

          const sectorTranslations: Record<string, string> = {};
          for (const sector of uniqueSectorsSet) {
            if (sector) {
              sectorTranslations[sector] = await translateText(
                sector,
                targetLang
              );
            }
          }
          translations.businessSectors = sectorTranslations;

          const statusTranslations: Record<string, string> = {};
          for (const status of uniqueStatusesSet) {
            if (status) {
              statusTranslations[status] = await translateText(
                status,
                targetLang
              );
            }
          }
          translations.businessStatuses = statusTranslations;
        }

        // Translate static UI text
        translations.backToBDS = await translateText("Back to BDS", targetLang);
        translations.successStories = await translateText(
          "Success Stories",
          targetLang
        );
        translations.businessesWeveSupported = await translateText(
          "Businesses We've Supported",
          targetLang
        );
        translations.heroDescription = await translateText(
          "Meet the innovative entrepreneurs and ventures that have grown through our Business Development Services program. These success stories demonstrate the transformative power of strategic support and mentorship.",
          targetLang
        );
        translations.ourPortfolio = await translateText(
          "Our Portfolio",
          targetLang
        );
        translations.transformingIdeasIntoImpact = await translateText(
          "Transforming Ideas into Impact",
          targetLang
        );
        translations.sectionDescription = await translateText(
          "From manufacturing to technology innovation, our supported businesses are driving positive change across Ethiopia",
          targetLang
        );
        translations.filterSuccessStories = await translateText(
          "Filter Success Stories",
          targetLang
        );
        translations.filterByDonor = await translateText(
          "Filter by Donor",
          targetLang
        );
        translations.filterBySector = await translateText(
          "Filter by Sector",
          targetLang
        );
        translations.filterByYear = await translateText(
          "Filter by Year",
          targetLang
        );
        translations.searchDonors = await translateText(
          "Search donors...",
          targetLang
        );
        translations.allDonors = await translateText("All Donors", targetLang);
        translations.allSectors = await translateText(
          "All Sectors",
          targetLang
        );
        translations.allYears = await translateText("All Years", targetLang);
        translations.activeFilters = await translateText(
          "Active filters:",
          targetLang
        );
        translations.clearAll = await translateText("Clear all", targetLang);
        translations.showingXOfY = await translateText("Showing", targetLang);
        translations.of = await translateText("of", targetLang);
        translations.businesses = await translateText("businesses", targetLang);
        translations.loadingBusinesses = await translateText(
          "Loading businesses...",
          targetLang
        );
        translations.noBusinessesFound = await translateText(
          "No businesses found. Please add some success stories from the admin panel.",
          targetLang
        );
        translations.loadMoreSuccessStories = await translateText(
          "Load More Success Stories",
          targetLang
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error(
          "[SupportedBusinesses] Error translating content:",
          error
        );
      } finally {
        setTranslating(false);
      }
    };

    // Always translate - static text can be translated immediately,
    // dynamic content (sectors/statuses) will be translated when businesses load
    translateDynamicContent(selectedLanguage);
  }, [selectedLanguage, supportedBusinesses, isLoading]);

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

  // Get translated sector or status
  const getTranslatedSector = (sector: string): string => {
    if (
      selectedLanguage === "en" ||
      !translatedContent.businessSectors ||
      !translatedContent.businessSectors[sector]
    ) {
      return sector;
    }
    return translatedContent.businessSectors[sector] || sector;
  };

  const getTranslatedStatus = (status: string): string => {
    if (
      selectedLanguage === "en" ||
      !translatedContent.businessStatuses ||
      !translatedContent.businessStatuses[status]
    ) {
      return status;
    }
    return translatedContent.businessStatuses[status] || status;
  };

  // Use translated content
  const displayStats =
    selectedLanguage !== "en" &&
    translatedContent.statistics &&
    translatedContent.statistics.length > 0
      ? translatedContent.statistics
      : impactStats;

  const uniqueDonors = useMemo(() => {
    const donors = Array.from(
      new Set(supportedBusinesses.map((b) => b.donor).filter(Boolean))
    );
    return donors.sort();
  }, [supportedBusinesses]);

  const uniqueSectors = useMemo(() => {
    const sectors = Array.from(
      new Set(supportedBusinesses.map((b) => b.sector))
    );
    return sectors.sort();
  }, [supportedBusinesses]);

  const uniqueYears = useMemo(() => {
    const years = Array.from(
      new Set(
        supportedBusinesses
          .map((b) =>
            b.fundingDate ? new Date(b.fundingDate).getFullYear() : null
          )
          .filter((y) => y !== null)
      )
    );
    return years.sort((a, b) => (b || 0) - (a || 0));
  }, [supportedBusinesses]);

  const filteredBusinesses = useMemo(() => {
    return supportedBusinesses.filter((business) => {
      const matchesDonor =
        selectedDonor === "all" ||
        business.donor === selectedDonor ||
        !business.donor;
      const matchesSector =
        selectedSector === "all" || business.sector === selectedSector;
      const matchesYear =
        selectedYear === "all" ||
        !business.fundingDate ||
        new Date(business.fundingDate).getFullYear().toString() ===
          selectedYear;
      const matchesSearch =
        donorSearch === "" ||
        (business.donor &&
          business.donor.toLowerCase().includes(donorSearch.toLowerCase()));

      return matchesDonor && matchesSector && matchesYear && matchesSearch;
    });
  }, [
    selectedDonor,
    selectedSector,
    selectedYear,
    donorSearch,
    supportedBusinesses,
  ]);

  const displayedBusinesses = filteredBusinesses.slice(0, displayCount);
  const hasMoreBusinesses = displayCount < filteredBusinesses.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 8);
  };

  const handleFilterChange = () => {
    setDisplayCount(8);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
          <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-18">
            <div className="max-w-4xl mx-auto text-center">
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/programs/entrepreneurship/business-development">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {getTranslatedText("backToBDS", "Back to BDS")}
                </Link>
              </Button>
              <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5 mr-2" />
                {getTranslatedText("successStories", "Success Stories")}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance leading-tight">
                {getTranslatedText(
                  "businessesWeveSupported",
                  "Businesses We've Supported"
                )}
              </h1>
              <p className="text-base md:text-lg text-emerald-50 mb-6 text-pretty leading-relaxed">
                {getTranslatedText(
                  "heroDescription",
                  "Meet the innovative entrepreneurs and ventures that have grown through our Business Development Services program. These success stories demonstrate the transformative power of strategic support and mentorship."
                )}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent" />
        </section>

        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
          {displayStats.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
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
            <div className="text-center py-8 text-muted-foreground">
              <p className="italic">
                Statistics will appear when businesses are added.
              </p>
            </div>
          )}
        </div>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <div className="flex justify-center">
              <Badge
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md "
              >
                <Building2 className="w-4 h-4" />
                {getTranslatedText("ourPortfolio", "Our Portfolio")}
              </Badge>
            </div>
            <br />
            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text mb-4 text-balance">
              {getTranslatedText(
                "transformingIdeasIntoImpact",
                "Transforming Ideas into Impact"
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              {getTranslatedText(
                "sectionDescription",
                "From manufacturing to technology innovation, our supported businesses are driving positive change across Ethiopia"
              )}
            </p>
          </div>

          <Card className="mb-8 border-2 border-[#367375]/20">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gradient-to-br from-[#367375] to-[#24C3BC]" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {getTranslatedText(
                    "filterSuccessStories",
                    "Filter Success Stories"
                  )}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Donor Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gradient-to-br from-[#367375] to-[#24C3BC]" />
                    {getTranslatedText("filterByDonor", "Filter by Donor")}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={getTranslatedText(
                        "searchDonors",
                        "Search donors..."
                      )}
                      value={donorSearch}
                      onChange={(e) => {
                        setDonorSearch(e.target.value);
                        handleFilterChange();
                      }}
                      className="pl-9"
                    />
                  </div>
                  <Select
                    value={selectedDonor}
                    onValueChange={(value) => {
                      setSelectedDonor(value);
                      handleFilterChange();
                    }}
                  >
                    <SelectTrigger className="w-full" />
                    <SelectContent>
                      <SelectItem
                        value="all"
                        className="radix-state-highlighted:bg-linear-to-br radix-state-highlighted:from-[#367375]/30 radix-state-highlighted:to-[#24C3BC]/30 radix-state-highlighted:text-white
                         radix-state-on:bg-linear-to-br radix-state-on:from-[#367375]/30 radix-state-on:to-[#24C3BC]/30 radix-state-on:text-white"
                      >
                        {getTranslatedText("allDonors", "All Donors")}
                      </SelectItem>
                      {uniqueDonors
                        .filter((donor) =>
                          donor
                            .toLowerCase()
                            .includes(donorSearch.toLowerCase())
                        )
                        .map((donor) => (
                          <SelectItem
                            key={donor}
                            value={donor}
                            className="radix-state-highlighted:bg-linear-to-br radix-state-highlighted:from-[#367375]/30 radix-state-highlighted:to-[#24C3BC]/30 radix-state-highlighted:text-white
                             radix-state-on:bg-linear-to-br radix-state-on:from-[#367375]/30 radix-state-on:to-[#24C3BC]/30 radix-state-on:text-white"
                          >
                            {donor}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sector Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gradient-to-br from-[#367375] to-[#24C3BC]" />
                    {getTranslatedText("filterBySector", "Filter by Sector")}
                  </label>
                  <Select
                    value={selectedSector}
                    onValueChange={(value) => {
                      setSelectedSector(value);
                      handleFilterChange();
                    }}
                  >
                    <SelectTrigger className="w-full" />
                    <SelectContent>
                      <SelectItem
                        value="all"
                        className="radix-state-highlighted:bg-linear-to-br radix-state-highlighted:from-[#367375]/30 radix-state-highlighted:to-[#24C3BC]/30 radix-state-highlighted:text-white
                         radix-state-on:bg-linear-to-br radix-state-on:from-[#367375]/30 radix-state-on:to-[#24C3BC]/30 radix-state-on:text-white"
                      >
                        {getTranslatedText("allSectors", "All Sectors")}
                      </SelectItem>
                      {uniqueSectors.map((sector) => (
                        <SelectItem
                          key={sector}
                          value={sector}
                          className="radix-state-highlighted:bg-linear-to-br radix-state-highlighted:from-[#367375]/30 radix-state-highlighted:to-[#24C3BC]/30 radix-state-highlighted:text-white
                           radix-state-on:bg-linear-to-br radix-state-on:from-[#367375]/30 radix-state-on:to-[#24C3BC]/30 radix-state-on:text-white"
                        >
                          {getTranslatedSector(sector)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gradient-to-br from-[#367375] to-[#24C3BC]" />
                    {getTranslatedText("filterByYear", "Filter by Year")}
                  </label>
                  <Select
                    value={selectedYear}
                    onValueChange={(value) => {
                      setSelectedYear(value);
                      handleFilterChange();
                    }}
                  >
                    <SelectTrigger className="w-full" />
                    <SelectContent>
                      <SelectItem
                        value="all"
                        className="radix-state-highlighted:bg-linear-to-br radix-state-highlighted:from-[#367375]/30 radix-state-highlighted:to-[#24C3BC]/30 radix-state-highlighted:text-white
                         radix-state-on:bg-linear-to-br radix-state-on:from-[#367375]/30 radix-state-on:to-[#24C3BC]/30 radix-state-on:text-white"
                      >
                        {getTranslatedText("allYears", "All Years")}
                      </SelectItem>
                      {uniqueYears.map((year) => (
                        <SelectItem
                          key={year}
                          value={year.toString()}
                          className="radix-state-highlighted:bg-linear-to-br radix-state-highlighted:from-[#367375]/30 radix-state-highlighted:to-[#24C3BC]/30 radix-state-highlighted:text-white
                           radix-state-on:bg-linear-to-br radix-state-on:from-[#367375]/30 radix-state-on:to-[#24C3BC]/30 radix-state-on:text-white"
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedDonor !== "all" ||
                selectedSector !== "all" ||
                selectedYear !== "all") && (
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground">
                    {getTranslatedText("activeFilters", "Active filters:")}
                  </span>
                  {selectedDonor !== "all" && (
                    <Badge className="bg-linear-to-br text-gradient-to-br from-[#367375] to-[#24C3BC] border border-[#367375]/20">
                      {getTranslatedText(
                        "filterByDonor",
                        "Filter by Donor"
                      ).replace("Filter by ", "")}
                      : {selectedDonor}
                    </Badge>
                  )}
                  {selectedSector !== "all" && (
                    <Badge className="bg-linear-to-br to-[#24C3BC]/10 text-gradient-to-br from-[#367375] border border-[#24C3BC]/20">
                      {getTranslatedText(
                        "filterBySector",
                        "Filter by Sector"
                      ).replace("Filter by ", "")}
                      : {getTranslatedSector(selectedSector)}
                    </Badge>
                  )}
                  {selectedYear !== "all" && (
                    <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
                      {getTranslatedText(
                        "filterByYear",
                        "Filter by Year"
                      ).replace("Filter by ", "")}
                      : {selectedYear}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDonor("all");
                      setSelectedSector("all");
                      setSelectedYear("all");
                      setDonorSearch("");
                      handleFilterChange();
                    }}
                    className="h-6 text-xs text-gradient-to-br from-[#367375] to-[#24C3BC] hover:bg-linear-to-br hover:from-[#367375]/10 hover:to-[#24C3BC]/10"
                  >
                    {getTranslatedText("clearAll", "Clear all")}
                  </Button>
                </div>
              )}

              <p className="text-sm text-muted-foreground mt-4">
                {getTranslatedText("showingXOfY", "Showing")}{" "}
                {filteredBusinesses.length} {getTranslatedText("of", "of")}{" "}
                {supportedBusinesses.length}{" "}
                {getTranslatedText("businesses", "businesses")}
              </p>
            </CardContent>
          </Card>

          {/* Business Cards */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {getTranslatedText(
                  "loadingBusinesses",
                  "Loading businesses..."
                )}
              </p>
            </div>
          ) : displayedBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {getTranslatedText(
                  "noBusinessesFound",
                  "No businesses found. Please add some success stories from the admin panel."
                )}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {displayedBusinesses.map((business, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-[#367375]/20 overflow-hidden"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="w-7 h-7 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <Building2 className="h-3.5 w-3.5 text-white" />
                      </div>
                      <Badge className="bg-linear-to-br from-[#367375]/10 to-[#24C3BC]/10 text-[#367375] border border-[#24C3BC]/20 text-[9px] px-1.5 py-0">
                        {getTranslatedStatus(business.status)}
                      </Badge>
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 mb-1.5 line-clamp-2 leading-tight min-h-8">
                      {business.name}
                    </h3>

                    {/* Sector */}
                    <Badge className="bg-[#367375]/10 text-[#367375] border border-[#367375]/20 mb-1 text-[9px] font-medium px-1.5 py-0">
                      <Tag className="h-2 w-2 mr-0.5" />
                      {getTranslatedSector(business.sector)}
                    </Badge>

                    {/* Donor */}
                    <Badge className="bg-[#24C3BC]/10 text-[#24C3BC] border border-[#24C3BC]/20 mb-1.5 text-[9px] font-medium px-1.5 py-0">
                      <DollarSign className="h-2 w-2 mr-0.5" />
                      {business.donor}
                    </Badge>

                    <div className="space-y-1 mb-1.5 pt-1.5 border-t border-gray-100">
                      <div className="flex items-start gap-1">
                        <Users className="h-2.5 w-2.5 text-[#367375] shrink-0 mt-0.5" />
                        <p className="text-[9px] text-muted-foreground line-clamp-2 leading-snug">
                          {business.owner}
                        </p>
                      </div>

                      {business.phone && (
                        <div className="flex items-start gap-1">
                          <Phone className="h-2.5 w-2.5 text-[#24C3BC] shrink-0 mt-0.5" />
                          <a
                            href={`tel:${business.phone}`}
                            className="text-[9px] text-muted-foreground hover:text-[#24C3BC] transition-colors line-clamp-1"
                          >
                            {business.phone}
                          </a>
                        </div>
                      )}

                      {business.email && (
                        <div className="flex items-start gap-1">
                          <Mail className="h-2.5 w-2.5 text-[#367375] shrink-0 mt-0.5" />
                          <a
                            href={`mailto:${business.email}`}
                            className="text-[9px] text-muted-foreground hover:text-[#367375] transition-colors line-clamp-1 break-all"
                          >
                            {business.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {hasMoreBusinesses && (
            <div className="mt-12 text-center">
              <Button
                size="lg"
                variant="outline"
                className="min-w-60 shadow-md border border-[#24C3BC]/40 text-[#367375] hover:bg-linear-to-br hover:from-[#367375] hover:to-[#24C3BC] hover:text-white transition-all"
                onClick={handleLoadMore}
              >
                {getTranslatedText(
                  "loadMoreSuccessStories",
                  "Load More Success Stories"
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                {getTranslatedText("showingXOfY", "Showing")}{" "}
                {displayedBusinesses.length} {getTranslatedText("of", "of")}{" "}
                {filteredBusinesses.length}{" "}
                {getTranslatedText("businesses", "businesses")}
              </p>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
