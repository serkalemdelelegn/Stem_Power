"use client";
import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Target,
  BookOpen,
  LineChart,
  Handshake,
  ArrowRight,
  Sparkles,
  Briefcase,
  CheckCircle,
  Lightbulb,
  Building2,
  Phone,
  Mail,
  BarChart3,
  Rocket,
  Award,
  Heart,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  fetchHero,
  fetchStatistics,
  fetchPartners,
  fetchServiceItems,
  type HeroData,
  type ImpactStat,
  type Partner,
  type ServiceItem,
} from "@/lib/api-programs/entrepreneurship/api-programs-entrepreneurship-business-dev";
import { useApp } from "@/lib/app-context";

// Services will be fetched from backend if available
const services: any[] = [];

const iconMap: Record<string, any> = {
  rocket: Rocket,
  trending: TrendingUp,
  users: Users,
  dollar: DollarSign,
  building: Building2,
  linechart: LineChart,
  target: Target,
  "book-open": BookOpen,
  "line-chart": LineChart,
  "trending-up": TrendingUp,
  handshake: Handshake,
};

export default function BusinessDevelopmentPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [currentDonorIndex, setCurrentDonorIndex] = useState(0);
  const [hoveredDonor, setHoveredDonor] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ number: string; label: string; icon: any }>;
    partners?: Array<{
      contribution?: string;
      focus?: string;
    }>;
    services?: Array<{
      name: string;
      description: string;
      capabilities: string[];
    }>;
    // Static UI text translations
    exploreServices?: string;
    viewSuccessStories?: string;
    aboutOurBDS?: string;
    empoweringEntrepreneursToThrive?: string;
    sectionDescription?: string;
    strategicPlanningAnalysis?: string;
    strategicPlanningDescription?: string;
    expertMentorshipGuidance?: string;
    expertMentorshipDescription?: string;
    ourComprehensiveApproach?: string;
    comprehensiveApproachDescription?: string;
    practicalHandsOnSupport?: string;
    accessToExpertAdvisors?: string;
    strategicToolsFrameworks?: string;
    networkConnections?: string;
    ongoingSupport?: string;
    ourSupporters?: string;
    fundingPartnersDonors?: string;
    supportersDescription?: string;
    noFundingPartnersAvailable?: string;
    contribution?: string;
    focusArea?: string;
    partnerSince?: string;
    peopleImpacted?: string;
    interestedInSupporting?: string;
    joinAsSupporter?: string;
    ourServices?: string;
    comprehensiveBusinessSupport?: string;
    servicesDescription?: string;
  }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hero, stats, partners, fetchedServices] = await Promise.all([
          fetchHero(),
          fetchStatistics(),
          fetchPartners(),
          fetchServiceItems(),
        ]);

        if (hero) {
          setHeroData(hero);
        } else {
          setHeroData(null);
        }

        if (stats && stats.length > 0) {
          // Map icon strings to icon components
          const mappedStats = stats.map((stat) => {
            const iconKey = stat.icon?.toLowerCase() || "building";
            const IconComponent = iconMap[iconKey] || Building2;
            return {
              number: stat.number,
              label: stat.label,
              icon: IconComponent,
            };
          });
          setImpactStats(mappedStats);
        } else {
          setImpactStats([]);
        }

        if (partners && partners.length > 0) {
          setDonors(partners);
        }

        if (fetchedServices && fetchedServices.length > 0) {
          // Map icon strings to icon components and normalize capabilities
          const mappedServices = fetchedServices.map((item: ServiceItem) => {
            const iconKey = item.icon?.toLowerCase() || "target";
            const IconComponent = iconMap[iconKey] || Target;

            // Normalize capabilities - ensure it's always an array of strings
            // Handle case where backend returns capabilities as JSON string instead of array
            let normalizedCapabilities: string[] = [];
            const capabilitiesValue: any = item.capabilities;

            if (Array.isArray(capabilitiesValue)) {
              normalizedCapabilities = capabilitiesValue
                .flatMap((cap: any) => {
                  if (typeof cap === "string" && cap.trim().startsWith("[")) {
                    try {
                      const parsed = JSON.parse(cap);
                      if (Array.isArray(parsed)) {
                        return parsed.map(String);
                      }
                      return [String(cap)];
                    } catch {
                      return [String(cap)];
                    }
                  }
                  return [String(cap)];
                })
                .filter((cap: string) => cap.trim());
            } else if (typeof capabilitiesValue === "string") {
              try {
                const parsed = JSON.parse(capabilitiesValue as string);
                if (Array.isArray(parsed)) {
                  normalizedCapabilities = parsed
                    .map(String)
                    .filter((cap: string) => cap.trim());
                } else {
                  normalizedCapabilities = (capabilitiesValue as string)
                    .split("\n")
                    .filter((line: string) => line.trim());
                }
              } catch {
                normalizedCapabilities = (capabilitiesValue as string)
                  .split("\n")
                  .filter((line: string) => line.trim());
              }
            }

            return {
              ...item,
              icon: IconComponent,
              capabilities: normalizedCapabilities,
            };
          });
          setServices(mappedServices);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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
        if (heroData?.badge)
          translations.heroBadge = await translateText(
            heroData.badge,
            targetLang
          );
        if (heroData?.title)
          translations.heroTitle = await translateText(
            heroData.title,
            targetLang
          );
        if (heroData?.description)
          translations.heroDescription = await translateText(
            heroData.description,
            targetLang
          );

        // Translate statistics labels (keep numbers unchanged)
        if (impactStats && impactStats.length > 0) {
          translations.statistics = await Promise.all(
            impactStats.map(async (stat) => ({
              ...stat,
              label: await translateText(stat.label || "", targetLang),
              // number stays the same
            }))
          );
        }

        // Translate partners (contribution and focus, not names)
        if (donors && donors.length > 0) {
          translations.partners = await Promise.all(
            donors.map(async (donor) => ({
              contribution: donor.contribution
                ? await translateText(donor.contribution, targetLang)
                : donor.contribution,
              focus: donor.focus
                ? await translateText(donor.focus, targetLang)
                : donor.focus,
              // name stays the same (proper noun)
            }))
          );
        }

        // Translate services
        if (services && services.length > 0) {
          translations.services = await Promise.all(
            services.map(async (service: any) => {
              // Ensure capabilities is an array before translating
              let capabilitiesArray: string[] = [];
              if (Array.isArray(service.capabilities)) {
                capabilitiesArray = service.capabilities;
              } else if (typeof service.capabilities === "string") {
                try {
                  const parsed = JSON.parse(service.capabilities);
                  capabilitiesArray = Array.isArray(parsed) ? parsed : [];
                } catch {
                  capabilitiesArray = service.capabilities
                    .split("\n")
                    .filter((line: string) => line.trim());
                }
              }

              return {
                name: await translateText(service.name || "", targetLang),
                description: await translateText(
                  service.description || "",
                  targetLang
                ),
                capabilities: await Promise.all(
                  capabilitiesArray.map((capability: string) =>
                    translateText(capability, targetLang)
                  )
                ),
              };
            })
          );
        }

        // Translate static UI text
        translations.exploreServices = await translateText(
          "Explore Services",
          targetLang
        );
        translations.viewSuccessStories = await translateText(
          "View Success Stories",
          targetLang
        );
        translations.aboutOurBDS = await translateText(
          "About Our BDS",
          targetLang
        );
        translations.empoweringEntrepreneursToThrive = await translateText(
          "Empowering Entrepreneurs to Thrive",
          targetLang
        );
        translations.sectionDescription = await translateText(
          "Our Business Development Services provide practical support, expert guidance, and strategic tools to help startups, entrepreneurs, and organizations thrive. From market research and business planning to mentorship, financial modeling, and growth strategies, we empower innovators to turn ideas into scalable, sustainable ventures.",
          targetLang
        );
        translations.strategicPlanningAnalysis = await translateText(
          "Strategic Planning & Analysis",
          targetLang
        );
        translations.strategicPlanningDescription = await translateText(
          "We help entrepreneurs develop comprehensive business strategies backed by thorough market research and competitive analysis. Our experts work closely with you to identify opportunities, assess risks, and create actionable roadmaps for sustainable growth.",
          targetLang
        );
        translations.expertMentorshipGuidance = await translateText(
          "Expert Mentorship & Guidance",
          targetLang
        );
        translations.expertMentorshipDescription = await translateText(
          "Access one-on-one mentorship from experienced entrepreneurs and industry leaders who understand the challenges of building a business. Our mentors provide personalized guidance, share valuable insights, and help you navigate critical business decisions with confidence.",
          targetLang
        );
        translations.ourComprehensiveApproach = await translateText(
          "Our Comprehensive Approach",
          targetLang
        );
        translations.comprehensiveApproachDescription = await translateText(
          "By combining hands-on support with actionable insights, our services help clients navigate challenges, seize opportunities, and achieve lasting impact in their communities and beyond. We transform entrepreneurial ideas into scalable, sustainable ventures that drive economic growth and create meaningful employment opportunities across Ethiopia.",
          targetLang
        );
        translations.practicalHandsOnSupport = await translateText(
          "Practical, hands-on business support tailored to your needs",
          targetLang
        );
        translations.accessToExpertAdvisors = await translateText(
          "Access to expert advisors and successful entrepreneurs",
          targetLang
        );
        translations.strategicToolsFrameworks = await translateText(
          "Strategic tools and frameworks for sustainable growth",
          targetLang
        );
        translations.networkConnections = await translateText(
          "Network connections with investors and partners",
          targetLang
        );
        translations.ongoingSupport = await translateText(
          "Ongoing support throughout your entrepreneurial journey",
          targetLang
        );
        translations.ourSupporters = await translateText(
          "Our Supporters",
          targetLang
        );
        translations.fundingPartnersDonors = await translateText(
          "Funding Partners & Donors",
          targetLang
        );
        translations.supportersDescription = await translateText(
          "Our work is made possible through the generous support of international organizations committed to advancing STEM education and entrepreneurship in Ethiopia.",
          targetLang
        );
        translations.noFundingPartnersAvailable = await translateText(
          "No funding partners available",
          targetLang
        );
        translations.contribution = await translateText(
          "Contribution:",
          targetLang
        );
        translations.focusArea = await translateText("Focus Area:", targetLang);
        translations.partnerSince = await translateText(
          "Partner Since:",
          targetLang
        );
        translations.peopleImpacted = await translateText(
          "People Impacted:",
          targetLang
        );
        translations.interestedInSupporting = await translateText(
          "Interested in supporting our mission?",
          targetLang
        );
        translations.joinAsSupporter = await translateText(
          "Join as a Supporter",
          targetLang
        );
        translations.ourServices = await translateText(
          "Our Services",
          targetLang
        );
        translations.comprehensiveBusinessSupport = await translateText(
          "Comprehensive Business Support",
          targetLang
        );
        translations.servicesDescription = await translateText(
          "End-to-end services designed to accelerate your entrepreneurial journey",
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
  }, [selectedLanguage, heroData, impactStats, donors, isLoading]);

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
  const displayHeroBadge = heroData
    ? getTranslated("heroBadge", heroData.badge)
    : "";
  const displayHeroTitle = heroData
    ? getTranslated("heroTitle", heroData.title)
    : "";
  const displayHeroDescription = heroData
    ? getTranslated("heroDescription", heroData.description)
    : "";
  const displayStats =
    translatedContent.statistics && selectedLanguage !== "en"
      ? translatedContent.statistics
      : impactStats;
  const displayDonors =
    translatedContent.partners && selectedLanguage !== "en"
      ? donors.map((donor, index) => ({
          ...donor,
          contribution:
            translatedContent.partners![index]?.contribution ||
            donor.contribution,
          focus: translatedContent.partners![index]?.focus || donor.focus,
        }))
      : donors;
  const displayServices =
    translatedContent.services && selectedLanguage !== "en"
      ? services.map((service, index) => ({
          ...service,
          name: translatedContent.services![index].name,
          description: translatedContent.services![index].description,
          capabilities: Array.isArray(
            translatedContent.services![index].capabilities
          )
            ? translatedContent.services![index].capabilities
            : service.capabilities,
        }))
      : services;

  useEffect(() => {
    if (isPaused || displayDonors.length === 0) return;

    const interval = setInterval(() => {
      setCurrentDonorIndex((prev) => (prev + 1) % displayDonors.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused, displayDonors.length]);

  const getVisibleDonors = () => {
    if (displayDonors.length === 0) return [];
    const visible = [];
    const maxVisible = Math.min(5, displayDonors.length);
    for (let i = 0; i < maxVisible; i++) {
      visible.push(
        displayDonors[(currentDonorIndex + i) % displayDonors.length]
      );
    }
    return visible;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
          <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-12">
            <div className="max-w-4xl mx-auto text-center">
              {displayHeroBadge && (
                <div className="flex justify-center">
                  <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                    <Sparkles className="h-3 w-3 mr-1.5" />
                    {displayHeroBadge}
                  </Badge>
                </div>
              )}
              {displayHeroTitle ? (
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  {displayHeroTitle}
                </h1>
              ) : (
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance italic opacity-75">
                  Title has not been added yet.
                </h1>
              )}
              {displayHeroDescription ? (
                <p className="text-lg md:text-xl text-emerald-50 mb-6 text-pretty leading-relaxed max-w-3xl mx-auto">
                  {displayHeroDescription}
                </p>
              ) : (
                <p className="text-lg md:text-xl text-emerald-50 mb-6 text-pretty leading-relaxed max-w-3xl mx-auto italic opacity-75">
                  Description has not been added yet.
                </p>
              )}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 px-6"
                  asChild
                >
                  <Link href="#services">
                    <Briefcase className="mr-2 h-4 w-4" />
                    {getTranslatedText("exploreServices", "Explore Services")}
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-6 bg-transparent"
                  asChild
                >
                  <Link href="/programs/entrepreneurship/business-development/supported-businesses">
                    {getTranslatedText(
                      "viewSuccessStories",
                      "View Success Stories"
                    )}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <br /> <br />
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
              <p className="italic">Statistics have not been added yet.</p>
            </div>
          )}
        </div>

        <section className="max-w-6xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Badge
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold
                   bg-linear-to-br from-[#367375] to-[#24C3BC] text-white
                   rounded-full shadow-md"
              >
                <Lightbulb className="w-4 h-4" />
                {getTranslatedText("aboutOurBDS", "About Our BDS")}
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
              {getTranslatedText(
                "empoweringEntrepreneursToThrive",
                "Empowering Entrepreneurs to Thrive"
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
              {getTranslatedText(
                "sectionDescription",
                "Our Business Development Services provide practical support, expert guidance, and strategic tools to help startups, entrepreneurs, and organizations thrive. From market research and business planning to mentorship, financial modeling, and growth strategies, we empower innovators to turn ideas into scalable, sustainable ventures."
              )}
            </p>
          </div>

          {/* BDS Services Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="overflow-hidden border-2">
              <div className="relative h-64">
                <Image
                  src="/business-professionals-analyzing-market-data-on-sc.jpg"
                  alt="Business professionals analyzing market data"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center shrink-0">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {getTranslatedText(
                      "strategicPlanningAnalysis",
                      "Strategic Planning & Analysis"
                    )}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {getTranslatedText(
                    "strategicPlanningDescription",
                    "We help entrepreneurs develop comprehensive business strategies backed by thorough market research and competitive analysis. Our experts work closely with you to identify opportunities, assess risks, and create actionable roadmaps for sustainable growth."
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-2">
              <div className="relative h-64">
                <Image
                  src="/business-mentor-advising-young-entrepreneur-in-mod.jpg"
                  alt="Business mentor advising entrepreneur"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {getTranslatedText(
                      "expertMentorshipGuidance",
                      "Expert Mentorship & Guidance"
                    )}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {getTranslatedText(
                    "expertMentorshipDescription",
                    "Access one-on-one mentorship from experienced entrepreneurs and industry leaders who understand the challenges of building a business. Our mentors provide personalized guidance, share valuable insights, and help you navigate critical business decisions with confidence."
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Comprehensive Approach */}
          <Card className="border-2 bg-linear-to-br from-[#367375]/10 to-[#24C3BC]/10">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center">
                      <Rocket className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {getTranslatedText(
                        "ourComprehensiveApproach",
                        "Our Comprehensive Approach"
                      )}
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {getTranslatedText(
                      "comprehensiveApproachDescription",
                      "By combining hands-on support with actionable insights, our services help clients navigate challenges, seize opportunities, and achieve lasting impact in their communities and beyond. We transform entrepreneurial ideas into scalable, sustainable ventures that drive economic growth and create meaningful employment opportunities across Ethiopia."
                    )}
                  </p>
                  <div className="space-y-3">
                    {[
                      getTranslatedText(
                        "practicalHandsOnSupport",
                        "Practical, hands-on business support tailored to your needs"
                      ),
                      getTranslatedText(
                        "accessToExpertAdvisors",
                        "Access to expert advisors and successful entrepreneurs"
                      ),
                      getTranslatedText(
                        "strategicToolsFrameworks",
                        "Strategic tools and frameworks for sustainable growth"
                      ),
                      getTranslatedText(
                        "networkConnections",
                        "Network connections with investors and partners"
                      ),
                      getTranslatedText(
                        "ongoingSupport",
                        "Ongoing support throughout your entrepreneurial journey"
                      ),
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-[#367375] shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <Image
                    src="/entrepreneurs-working-on-business-strategy-documen.jpg"
                    alt="Entrepreneurs working on business strategy"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="bg-linear-to-br from-[#367375]/5 to-[#24C3BC]/5 py-16">
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <Badge
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold
                     bg-linear-to-br from-[#367375] to-[#24C3BC] text-white
                     rounded-full shadow-md"
                >
                  <Heart className="w-4 h-4" />
                  {getTranslatedText("ourSupporters", "Our Supporters")}
                </Badge>
              </div>
              <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
                {getTranslatedText(
                  "fundingPartnersDonors",
                  "Funding Partners & Donors"
                )}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
                {getTranslatedText(
                  "supportersDescription",
                  "Our work is made possible through the generous support of international organizations committed to advancing STEM education and entrepreneurship in Ethiopia."
                )}
              </p>
            </div>

            {/* Donors Carousel */}
            <div className="relative overflow-hidden py-8">
              {displayDonors.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  {getTranslatedText(
                    "noFundingPartnersAvailable",
                    "No funding partners available"
                  )}
                </p>
              ) : (
                <div className="flex gap-4 justify-center items-center transition-all duration-700 ease-in-out">
                  {getVisibleDonors().map((donor, index) => (
                    <div
                      key={`${donor.name}-${index}`}
                      className="shrink-0 w-44"
                      onMouseEnter={() => {
                        setHoveredDonor(index);
                        setIsPaused(true);
                      }}
                      onMouseLeave={() => {
                        setHoveredDonor(null);
                        setIsPaused(false);
                      }}
                    >
                      <Card
                        className={`group relative overflow-visible border-2 transition-all duration-500 ${
                          hoveredDonor === index
                            ? "shadow-2xl scale-105 z-50"
                            : "hover:shadow-lg h-44"
                        }`}
                      >
                        <CardContent
                          className={`p-0 ${
                            hoveredDonor === index ? "h-auto" : "h-44"
                          }`}
                        >
                          <div
                            className={`${
                              hoveredDonor === index ? "hidden" : "flex"
                            } items-center justify-center bg-white p-6 h-full`}
                          >
                            <div className="w-full h-full flex items-center justify-center">
                              <img
                                src={donor.logo || "/placeholder.svg"}
                                alt={donor.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          </div>

                          {hoveredDonor === index && (
                            <div className="bg-linear-to-br from-[#367375] to-[#24C3BC] p-4 min-h-[240px] rounded-lg text-white">
                              <h3 className="text-base font-bold mb-3 text-center leading-tight">
                                {donor.name}
                              </h3>

                              <div className="space-y-2">
                                <div>
                                  <p className="font-bold text-xs mb-0.5">
                                    {getTranslatedText(
                                      "contribution",
                                      "Contribution:"
                                    )}
                                  </p>
                                  <p className="text-xs leading-snug">
                                    {donor.contribution}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-bold text-xs mb-0.5">
                                    {getTranslatedText(
                                      "focusArea",
                                      "Focus Area:"
                                    )}
                                  </p>
                                  <p className="text-xs leading-snug">
                                    {donor.focus}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                  <div>
                                    <p className="font-bold text-xs mb-0.5">
                                      {getTranslatedText(
                                        "partnerSince",
                                        "Partner Since:"
                                      )}
                                    </p>
                                    <p className="text-sm font-bold">
                                      {donor.since}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs mb-0.5">
                                      {getTranslatedText(
                                        "peopleImpacted",
                                        "People Impacted:"
                                      )}
                                    </p>
                                    <p className="text-xs font-bold leading-tight">
                                      {donor.peopleImpacted}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}

              {/* Carousel Pagination */}
              {displayDonors.length > 0 && (
                <div className="flex justify-center gap-2 mt-6">
                  {displayDonors.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentDonorIndex(index);
                        setIsPaused(false);
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentDonorIndex
                          ? "bg-[#367375] w-8"
                          : "bg-[#367375]/30 hover:bg-[#24C3BC]/40 w-2"
                      }`}
                      aria-label={`Go to donor ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">
                {getTranslatedText(
                  "interestedInSupporting",
                  "Interested in supporting our mission?"
                )}
              </p>
              <Button
                className="bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:from-[#24C3BC] hover:to-[#367375] shadow-lg px-6 py-3 rounded-full transition-all duration-300"
                asChild
              >
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2"
                >
                  <Heart className="h-5 w-5" />
                  {getTranslatedText("joinAsSupporter", "Join as a Supporter")}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="bg-linear-to-br from-slate-50 to-emerald-50/50 py-16"
        >
          <div className="max-w-6xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center">
                <Badge
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
          border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
          text-white rounded-full shadow-md"
                >
                  <Briefcase className="w-4 h-4" />
                  {getTranslatedText("ourServices", "Our Services")}
                </Badge>
              </div>
              <br />
              <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
                {getTranslatedText(
                  "comprehensiveBusinessSupport",
                  "Comprehensive Business Support"
                )}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                {getTranslatedText(
                  "servicesDescription",
                  "End-to-end services designed to accelerate your entrepreneurial journey"
                )}
              </p>
            </div>

            {/* Service Cards */}
            {displayServices.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayServices.map((service: any, index: number) => {
                  const IconComponent = service.icon;
                  // Ensure capabilities is an array for rendering
                  const serviceCapabilities = Array.isArray(
                    service.capabilities
                  )
                    ? service.capabilities
                    : typeof service.capabilities === "string"
                    ? (() => {
                        try {
                          const parsed = JSON.parse(service.capabilities);
                          return Array.isArray(parsed) ? parsed : [];
                        } catch {
                          return service.capabilities
                            .split("\n")
                            .filter((line: string) => line.trim());
                        }
                      })()
                    : [];
                  return (
                    <Card
                      key={index}
                      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2"
                    >
                      <CardContent className="p-6">
                        <div className="w-14 h-14 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <IconComponent className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {service.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="space-y-2">
                          {serviceCapabilities.length > 0 ? (
                            serviceCapabilities.map(
                              (capability: string, capIndex: number) => (
                                <div
                                  key={capIndex}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="h-3.5 w-3.5 text-[#367375] shrink-0 mt-0.5" />
                                  <span className="text-xs text-muted-foreground">
                                    {capability}
                                  </span>
                                </div>
                              )
                            )
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              No capabilities listed.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="italic">Services have not been added yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
