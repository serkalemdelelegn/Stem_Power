"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  Building2,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Wrench,
  School,
  Factory,
  Globe,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  fetchHero,
  fetchStats,
  fetchTrainingPrograms,
  fetchPartners,
  fetchPartnersSection,
  fetchSuccessMetrics,
  fetchConsultancyServices,
  fetchPartnershipTypes,
  type HeroContent,
  type ImpactStat,
  type TrainingProgram,
  type Partner,
  type PartnersSection,
  type SuccessMetric,
  type ConsultancyService,
  type PartnershipType,
} from "@/lib/api-programs/fablab/api-programs-fablab-training-consult";
import { useApp } from "@/lib/app-context";

const iconMap = {
  users: Users,
  building: Building2,
  building2: Building2,
  graduationcap: GraduationCap,
  cap: GraduationCap,
  globe: Globe,
  award: Award,
  lightbulb: Lightbulb,
  trendingup: TrendingUp,
  wrench: Wrench,
  bookopen: BookOpen,
  target: Target,
} as Record<string, typeof Users>;

export default function TrainingConsultancyPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const gradientTextClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";
  const gradientButtonClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all";
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [offerings, setOfferings] = useState<TrainingProgram[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnersSection, setPartnersSection] =
    useState<PartnersSection | null>(null);
  const [successMetrics, setSuccessMetrics] = useState<SuccessMetric[]>([]);
  const [consultancyServices, setConsultancyServices] = useState<
    ConsultancyService[]
  >([]);
  const [partnershipTypes, setPartnershipTypes] = useState<PartnershipType[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ number: string; label: string; icon: any }>;
    successMetrics?: Array<{ metric: string; label: string; icon: any }>;
    trainingPrograms?: Array<{
      title: string;
      description: string;
      features: string[];
      outcomes: string[];
    }>;
    consultancyServices?: Array<{
      title: string;
      description: string;
      deliverables: string[];
    }>;
    partnersSection?: {
      title: string;
      description: string;
    };
    partners?: Array<{ name: string }>;
    partnershipTypes?: Array<{
      title: string;
      description: string;
      benefits: string[];
    }>;
    // Static UI text translations
    ourApproach?: string;
    sustainableImpact?: string;
    withAProvenTrackRecord?: string;
    trainingProgramsLabel?: string;
    professionalDevelopment?: string;
    comprehensiveTrainingPrograms?: string;
    programFeatures?: string;
    expectedOutcomes?: string;
    consultancyServicesLabel?: string;
    strategicSTEMEducation?: string;
    expertGuidance?: string;
    keyDeliverables?: string;
    trustedByPartners?: string;
    weCollaborateWith?: string;
    partnerLogosWillAppear?: string;
    partnershipOpportunities?: string;
    collaborateForGreaterImpact?: string;
    weWorkWithDiversePartners?: string;
    partnershipBenefits?: string;
    startPartnership?: string;
    logoComingSoon?: string;
  }>({});

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel using the API helper functions
        const [
          heroData,
          statsData,
          programsData,
          partnersData,
          partnersSectionData,
          successMetricsData,
          consultancyServicesData,
          partnershipTypesData,
        ] = await Promise.all([
          fetchHero(),
          fetchStats(),
          fetchTrainingPrograms(),
          fetchPartners(),
          fetchPartnersSection(),
          fetchSuccessMetrics(),
          fetchConsultancyServices(),
          fetchPartnershipTypes(),
        ]);

        if (isMounted) {
          setHeroContent(heroData);
          setStats(statsData);
          setOfferings(programsData);
          setPartners(partnersData);
          setPartnersSection(partnersSectionData);
          setSuccessMetrics(successMetricsData);
          setConsultancyServices(consultancyServicesData);
          setPartnershipTypes(partnershipTypesData);
        }
      } catch (err) {
        console.error(
          "[TrainingConsultancyPage] Unexpected error during data load",
          err
        );
        if (isMounted) {
          setError(
            "Unable to load the latest training & consultancy content. Showing curated highlights instead."
          );
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
            }))
          );
        }

        // Translate success metrics labels (keep metric values unchanged)
        if (successMetrics && successMetrics.length > 0) {
          translations.successMetrics = await Promise.all(
            successMetrics.map(async (metric) => ({
              ...metric,
              label: await translateText(metric.label || "", targetLang),
              // metric value stays the same
            }))
          );
        }

        // Translate training programs
        if (offerings && offerings.length > 0) {
          translations.trainingPrograms = await Promise.all(
            offerings.map(async (program) => ({
              title: await translateText(program.title || "", targetLang),
              description: await translateText(
                program.description || "",
                targetLang
              ),
              features: await Promise.all(
                (program.features || []).map((feature) =>
                  translateText(feature, targetLang)
                )
              ),
              outcomes: await Promise.all(
                (program.outcomes || []).map((outcome) =>
                  translateText(outcome, targetLang)
                )
              ),
            }))
          );
        }

        // Translate consultancy services
        if (consultancyServices && consultancyServices.length > 0) {
          translations.consultancyServices = await Promise.all(
            consultancyServices.map(async (service) => ({
              title: await translateText(service.title || "", targetLang),
              description: await translateText(
                service.description || "",
                targetLang
              ),
              deliverables: await Promise.all(
                (service.deliverables || []).map((deliverable) =>
                  translateText(deliverable, targetLang)
                )
              ),
            }))
          );
        }

        // Translate partners section
        if (
          partnersSection &&
          (partnersSection.title || partnersSection.description)
        ) {
          translations.partnersSection = {
            title: partnersSection.title
              ? await translateText(partnersSection.title, targetLang)
              : undefined,
            description: partnersSection.description
              ? await translateText(partnersSection.description, targetLang)
              : undefined,
          };
        }

        // Translate partners (name only, logo stays unchanged)
        if (partners && partners.length > 0) {
          translations.partners = await Promise.all(
            partners.map(async (partner) => ({
              name: await translateText(partner.name || "", targetLang),
            }))
          );
        }

        // Translate partnership types
        if (partnershipTypes && partnershipTypes.length > 0) {
          translations.partnershipTypes = await Promise.all(
            partnershipTypes.map(async (partnership) => ({
              title: await translateText(partnership.title || "", targetLang),
              description: await translateText(
                partnership.description || "",
                targetLang
              ),
              benefits: await Promise.all(
                (partnership.benefits || []).map((benefit) =>
                  translateText(benefit, targetLang)
                )
              ),
            }))
          );
        }

        // Translate static UI text
        translations.ourApproach = await translateText(
          "Our Approach",
          targetLang
        );
        translations.sustainableImpact = await translateText(
          "Sustainable Impact Through Capacity Building",
          targetLang
        );
        translations.withAProvenTrackRecord = await translateText(
          "With a proven track record across the nation, our approach ensures sustainable impact, combining hands-on learning with strategic consultancy to create pathways for youth employment, innovation, and community development. By investing in STEM education today, institutions and donors help shape a skilled, future-ready generation.",
          targetLang
        );
        translations.trainingProgramsLabel = await translateText(
          "Training Programs",
          targetLang
        );
        translations.professionalDevelopment = await translateText(
          "Professional Development & Workshops",
          targetLang
        );
        translations.comprehensiveTrainingPrograms = await translateText(
          "Comprehensive training programs designed to build technical skills, pedagogical expertise, and innovation capacity.",
          targetLang
        );
        translations.programFeatures = await translateText(
          "Program Features:",
          targetLang
        );
        translations.expectedOutcomes = await translateText(
          "Expected Outcomes:",
          targetLang
        );
        translations.consultancyServicesLabel = await translateText(
          "Consultancy Services",
          targetLang
        );
        translations.strategicSTEMEducation = await translateText(
          "Strategic STEM Education Solutions",
          targetLang
        );
        translations.expertGuidance = await translateText(
          "Expert guidance and hands-on support for institutions looking to establish or enhance their STEM education infrastructure.",
          targetLang
        );
        translations.keyDeliverables = await translateText(
          "Key Deliverables:",
          targetLang
        );
        translations.trustedByPartners = await translateText(
          "Trusted by Partners",
          targetLang
        );
        translations.weCollaborateWith = await translateText(
          "We collaborate with education leaders and development partners nationwide.",
          targetLang
        );
        translations.partnerLogosWillAppear = await translateText(
          "Partner logos will appear here as soon as they are published.",
          targetLang
        );
        translations.partnershipOpportunities = await translateText(
          "Partnership Opportunities",
          targetLang
        );
        translations.collaborateForGreaterImpact = await translateText(
          "Collaborate for Greater Impact",
          targetLang
        );
        translations.weWorkWithDiversePartners = await translateText(
          "We work with diverse partners to create sustainable STEM education ecosystems across Ethiopia.",
          targetLang
        );
        translations.partnershipBenefits = await translateText(
          "Partnership Benefits",
          targetLang
        );
        translations.startPartnership = await translateText(
          "Start Partnership",
          targetLang
        );
        translations.logoComingSoon = await translateText(
          "Logo coming soon",
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
  }, [
    selectedLanguage,
    heroContent,
    stats,
    successMetrics,
    offerings,
    consultancyServices,
    partnersSection,
    partners,
    partnershipTypes,
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
      : stats || [];
  const displaySuccessMetrics =
    translatedContent.successMetrics && selectedLanguage !== "en"
      ? translatedContent.successMetrics
      : successMetrics || [];
  const displayTrainingPrograms =
    translatedContent.trainingPrograms && selectedLanguage !== "en"
      ? (offerings || []).map((program, index) => ({
          ...program,
          title: translatedContent.trainingPrograms![index].title,
          description: translatedContent.trainingPrograms![index].description,
          features: translatedContent.trainingPrograms![index].features,
          outcomes: translatedContent.trainingPrograms![index].outcomes,
        }))
      : offerings || [];
  const displayConsultancyServices =
    translatedContent.consultancyServices && selectedLanguage !== "en"
      ? consultancyServices.map((service, index) => ({
          ...service,
          title: translatedContent.consultancyServices![index].title,
          description:
            translatedContent.consultancyServices![index].description,
          deliverables:
            translatedContent.consultancyServices![index].deliverables,
        }))
      : consultancyServices || [];
  const displayPartnersSection =
    translatedContent.partnersSection && selectedLanguage !== "en"
      ? {
          ...partnersSection,
          title: translatedContent.partnersSection.title,
          description: translatedContent.partnersSection.description,
        }
      : partnersSection;
  const displayPartners =
    translatedContent.partners && selectedLanguage !== "en"
      ? (partners || []).map((partner, index) => ({
          ...partner,
          name: translatedContent.partners![index].name,
        }))
      : partners || [];
  const displayPartnershipTypes =
    translatedContent.partnershipTypes && selectedLanguage !== "en"
      ? (partnershipTypes || []).map((partnership, index) => ({
          ...partnership,
          title: translatedContent.partnershipTypes![index].title,
          description: translatedContent.partnershipTypes![index].description,
          benefits: translatedContent.partnershipTypes![index].benefits,
        }))
      : partnershipTypes || [];

  const statsToDisplay = displayStats;
  const trainingProgramsToDisplay = displayTrainingPrograms;
  const partnersToDisplay = displayPartners;
  const hasPartnerContent = Boolean(
    (displayPartnersSection?.title && displayPartnersSection.title.trim()) ||
      (displayPartnersSection?.description &&
        displayPartnersSection.description.trim()) ||
      partnersToDisplay.length > 0
  );
  const hasHeroContent = Boolean(
    (heroContent?.badge && heroContent.badge.trim()) ||
      (heroContent?.title && heroContent.title.trim()) ||
      (heroContent?.description && heroContent.description.trim())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
          <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-10">
            <div className="max-w-4xl mx-auto text-center">
              {hasHeroContent ? (
                <>
                  {displayHeroBadge && (
                    <div className="flex justify-center">
                      <Badge
                        className={`mb-6 text-white border-white/30 ${gradientButtonClass} text-sm font-medium px-3 py-1.5 rounded-full flex items-center`}
                      >
                        <Sparkles className="h-3 w-3 mr-1.5" />
                        {displayHeroBadge}
                      </Badge>
                    </div>
                  )}
                  {displayHeroTitle && (
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                      {displayHeroTitle}
                    </h1>
                  )}
                  {displayHeroDescription && (
                    <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                      {displayHeroDescription}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-lg text-emerald-50 text-center">
                  Content not added yet.
                </p>
              )}
              {error && (
                <p className="mt-4 text-sm text-emerald-100/80">{error}</p>
              )}
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent" />
        </section>

        {/* Impact Stats */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
          {statsToDisplay.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {statsToDisplay.map((stat, index) => {
                const IconComponent = stat.icon as any;
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/10 bg-white/10 backdrop-blur-md rounded-xl scale-95 hover:scale-100"
                  >
                    <CardContent className="pt-4 pb-4 px-2">
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
              })}
            </div>
          ) : (
            <Card className="border border-white/30 bg-white/20 backdrop-blur-md text-center">
              <CardContent className="py-6 text-[#367375]">
                Impact statistics not added yet.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Mission Statement */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <Badge
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md "
              >
                <Target className="w-4 h-4" />
                {getTranslatedText("ourApproach", "Our Approach")}
              </Badge>
            </div>
            <br />
            <h2
              className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
            >
              {getTranslatedText(
                "sustainableImpact",
                "Sustainable Impact Through Capacity Building"
              )}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              {getTranslatedText(
                "withAProvenTrackRecord",
                "With a proven track record across the nation, our approach ensures sustainable impact, combining hands-on learning with strategic consultancy to create pathways for youth employment, innovation, and community development. By investing in STEM education today, institutions and donors help shape a skilled, future-ready generation."
              )}
            </p>
          </div>

          {/* Success Metrics */}
          {displaySuccessMetrics.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {displaySuccessMetrics.map((item, index) => {
                const IconComponent = item.icon as any;
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2"
                  >
                    <CardContent className="pt-6 pb-6">
                      {IconComponent ? (
                        <IconComponent className="h-8 w-8 text-[#367375] mx-auto mb-3" />
                      ) : null}
                      <div className="text-3xl font-bold text-[#367375] mb-1">
                        {item.metric}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">
                        {item.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="max-w-3xl mx-auto text-center">
              <CardContent className="py-6 text-muted-foreground">
                Success metrics will appear once added.
              </CardContent>
            </Card>
          )}
        </section>

        {/* Training Programs */}
        <section
          id="services"
          className="bg-linear-to-br from-slate-50 to-emerald-50/50 py-20"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="flex justify-center">
                <Badge
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md "
                >
                  <GraduationCap className="w-4 h-4" />
                  {getTranslatedText(
                    "trainingProgramsLabel",
                    "Training Programs"
                  )}
                </Badge>
              </div>
              <br />
              <h2
                className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
              >
                {getTranslatedText(
                  "professionalDevelopment",
                  "Professional Development & Workshops"
                )}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                {getTranslatedText(
                  "comprehensiveTrainingPrograms",
                  "Comprehensive training programs designed to build technical skills, pedagogical expertise, and innovation capacity."
                )}
              </p>
            </div>

            {trainingProgramsToDisplay.length > 0 ? (
              <div className="grid lg:grid-cols-3 gap-8">
                {trainingProgramsToDisplay.map((program, index) => {
                  const IconComponent = program.icon as any;
                  return (
                    <Card
                      key={program.id || index}
                      className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 flex flex-col"
                    >
                      <CardHeader>
                        <div className="w-14 h-14 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center mb-4">
                          {IconComponent ? (
                            <IconComponent className="h-7 w-7 text-white" />
                          ) : null}
                        </div>
                        <CardTitle className="text-2xl text-balance">
                          {program.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {program.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-6">
                        <div>
                          <h4 className="font-semibold text-sm text-[#367375] mb-3">
                            {getTranslatedText(
                              "programFeatures",
                              "Program Features:"
                            )}
                          </h4>
                          <div className="space-y-2">
                            {(program.features || []).map(
                              (feature, featureIndex) => (
                                <div
                                  key={featureIndex}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <CheckCircle className="h-4 w-4 text-[#367375] shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-[#367375] mb-3">
                            {getTranslatedText(
                              "expectedOutcomes",
                              "Expected Outcomes:"
                            )}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {(program.outcomes || []).map(
                              (outcome, outcomeIndex) => (
                                <Badge
                                  key={outcomeIndex}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {outcome}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="text-center">
                <CardContent className="py-8 text-muted-foreground">
                  Training programs will appear once added.
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Consultancy Services */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <Badge
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md "
              >
                <Lightbulb className="w-4 h-4" />
                {getTranslatedText(
                  "consultancyServicesLabel",
                  "Consultancy Services"
                )}
              </Badge>
            </div>
            <br />
            <h2
              className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
            >
              {getTranslatedText(
                "strategicSTEMEducation",
                "Strategic STEM Education Solutions"
              )}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              {getTranslatedText(
                "expertGuidance",
                "Expert guidance and hands-on support for institutions looking to establish or enhance their STEM education infrastructure."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {displayConsultancyServices.length > 0 ? (
              displayConsultancyServices.map((service, index) => {
                const IconComponent = service.icon as any;
                return (
                  <Card
                    key={index}
                    className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 overflow-hidden"
                  >
                    <div className="bg-linear-to-br from-[#367375]/10 to-[#24C3BC]/10 p-6 border-b">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center shrink-0">
                          {IconComponent ? (
                            <IconComponent className="h-6 w-6 text-white" />
                          ) : null}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {service.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-sm text-[#367375] mb-3">
                        {getTranslatedText(
                          "keyDeliverables",
                          "Key Deliverables:"
                        )}
                      </h4>
                      <div className="space-y-2">
                        {(service.deliverables || []).map(
                          (deliverable, deliverableIndex) => (
                            <div
                              key={deliverableIndex}
                              className="flex items-start gap-2 text-sm"
                            >
                              <CheckCircle className="h-4 w-4 text-[#367375] shrink-0 mt-0.5" />
                              <span>{deliverable}</span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="md:col-span-2 text-center">
                <CardContent className="py-8 text-muted-foreground">
                  Consultancy services will appear once added.
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <Badge className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white rounded-full shadow-md ">
                <Users className="w-4 h-4" />
                {getTranslatedText("trustedByPartners", "Trusted by Partners")}
              </Badge>
            </div>
            <br />
            {hasPartnerContent ? (
              <>
                {displayPartnersSection?.title && (
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {displayPartnersSection.title}
                  </h3>
                )}
                {displayPartnersSection?.description && (
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                    {displayPartnersSection.description}
                  </p>
                )}
              </>
            ) : (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                Partners content not added yet.
              </p>
            )}
          </div>
          {partnersToDisplay.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {partnersToDisplay.map((partner) => {
                const partnerName = partner.name?.trim();
                return (
                  <Card
                    key={partner.id}
                    className="border-2 hover:-translate-y-1 hover:shadow-xl transition-all"
                  >
                    <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
                      <div className="h-20 flex items-center justify-center">
                        {partner.logo ? (
                          <img
                            src={partner.logo}
                            alt={partnerName || "Name not provided"}
                            className="max-h-16 max-w-full object-contain"
                          />
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            {getTranslatedText(
                              "logoComingSoon",
                              "Logo coming soon"
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-center text-gray-700">
                        {partnerName || "Name not provided"}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center">
              <CardContent className="py-6 text-muted-foreground">
                Partner content will appear once added.
              </CardContent>
            </Card>
          )}
        </section>

        {/* Partnership Opportunities */}
        <section className="bg-linear-to-br from-slate-50 to-emerald-50/50 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="flex justify-center">
                <Badge
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md "
                >
                  <Users className="w-4 h-4" />
                  {getTranslatedText(
                    "partnershipOpportunities",
                    "Partnership Opportunities"
                  )}
                </Badge>
              </div>
              <br />
              <h2
                className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
              >
                {getTranslatedText(
                  "collaborateForGreaterImpact",
                  "Collaborate for Greater Impact"
                )}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                {getTranslatedText(
                  "weWorkWithDiversePartners",
                  "We work with diverse partners to create sustainable STEM education ecosystems across Ethiopia."
                )}
              </p>
            </div>

            {displayPartnershipTypes.length > 0 ? (
              <div className="space-y-8">
                {displayPartnershipTypes.map((partnership, index) => {
                  const IconComponent = partnership.icon as any;
                  return (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2"
                    >
                      <div
                        className={`grid lg:grid-cols-5 gap-0 ${
                          index % 2 === 1 ? "lg:grid-flow-col-dense" : ""
                        }`}
                      >
                        {/* Image Section */}
                        <div
                          className={`relative h-64 lg:h-auto lg:col-span-2 ${
                            index % 2 === 1 ? "lg:order-2" : ""
                          }`}
                        >
                          <Image
                            src={partnership.image || "/placeholder.svg"}
                            alt={partnership.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-2 text-white">
                              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                {IconComponent ? (
                                  <IconComponent className="h-5 w-5" />
                                ) : null}
                              </div>
                              <h3 className="text-2xl font-bold">
                                {partnership.title}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 lg:p-8 space-y-4 lg:col-span-3">
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {partnership.description}
                          </p>

                          <div>
                            <h4 className="font-semibold text-base mb-3 flex items-center gap-2 text-[#367375]">
                              <Award className="h-4 w-4" />
                              {getTranslatedText(
                                "partnershipBenefits",
                                "Partnership Benefits"
                              )}
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {(partnership.benefits || []).map(
                                (benefit, benefitIndex) => (
                                  <div
                                    key={benefitIndex}
                                    className="flex items-start gap-2"
                                  >
                                    <CheckCircle className="h-4 w-4 text-[#367375] shrink-0 mt-0.5" />
                                    <span className="text-sm">{benefit}</span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          <Button
                            className={`${gradientButtonClass} mt-4 hover:scale-105 transition-all`}
                            asChild
                          >
                            <Link href="/contact">
                              {getTranslatedText(
                                "startPartnership",
                                "Start Partnership"
                              )}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="text-center">
                <CardContent className="py-8 text-muted-foreground">
                  Partnership opportunities will appear once added.
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
