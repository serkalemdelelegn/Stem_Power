"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import {
  fetchImpactStats,
  fetchProgramBenefits,
  fetchTimeline,
  fetchOutreachHero,
  type ImpactStat,
  type ProgramBenefit,
  type Timeline,
  type OutreachHero,
} from "@/lib/api-programs/stem-operations/api-programs-stem-centers-university-outreach";
import { useApp } from "@/lib/app-context";

export default function UniversityOutreachPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [hero, setHero] = useState<OutreachHero | null>(null);
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([]);
  const [programBenefits, setProgramBenefits] = useState<ProgramBenefit[]>([]);
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ number: string; label: string; icon: any }>;
    timeline?: Array<{
      phase: string;
      title: string;
      description: string;
      year: string;
    }>;
    programBenefits?: Array<{
      title: string;
      description: string;
      icon: any;
    }>;
    // Static UI text translations
    viewParticipatingUniversities?: string;
    theResultsSpoke?: string;
    fromPilotProgram?: string;
    minimalCost?: string;
    minimalCostDesc?: string;
    maximumImpact?: string;
    maximumImpactDesc?: string;
    sustainableGrowth?: string;
    sustainableGrowthDesc?: string;
    journeyToNationwideImpact?: string;
    howADemonstration?: string;
    howItWorks?: string;
    transformingUniversityCampuses?: string;
  }>({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [heroData, stats, benefits, timelineData] = await Promise.all([
          fetchOutreachHero(),
          fetchImpactStats(),
          fetchProgramBenefits(),
          fetchTimeline(),
        ]);
        setHero(heroData);
        setImpactStats(stats);
        setProgramBenefits(benefits);
        setTimeline(timelineData);
      } catch (error) {
        console.error("Error fetching data:", error);
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

      if (isLoading) return;

      setTranslating(true);
      try {
        const translations: any = {};

        // Translate hero section
        if (hero?.badge)
          translations.heroBadge = await translateText(hero.badge, targetLang);
        if (hero?.title)
          translations.heroTitle = await translateText(hero.title, targetLang);
        if (hero?.description)
          translations.heroDescription = await translateText(
            hero.description,
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

        // Translate timeline
        if (timeline && timeline.length > 0) {
          translations.timeline = await Promise.all(
            timeline.map(async (item) => ({
              ...item,
              phase: await translateText(item.phase || "", targetLang),
              title: await translateText(item.title || "", targetLang),
              description: await translateText(
                item.description || "",
                targetLang
              ),
              // year stays the same
            }))
          );
        }

        // Translate program benefits
        if (programBenefits && programBenefits.length > 0) {
          translations.programBenefits = await Promise.all(
            programBenefits.map(async (benefit) => ({
              ...benefit,
              title: await translateText(benefit.title || "", targetLang),
              description: await translateText(
                benefit.description || "",
                targetLang
              ),
              // icon stays the same
            }))
          );
        }

        // Translate static UI text
        translations.viewParticipatingUniversities = await translateText(
          "View Participating Universities",
          targetLang
        );
        translations.theResultsSpoke = await translateText(
          "The Results Spoke for Themselves",
          targetLang
        );
        translations.fromPilotProgram = await translateText(
          "From pilot program to nationwide government initiative in just two years",
          targetLang
        );
        translations.minimalCost = await translateText(
          "Minimal Cost",
          targetLang
        );
        translations.minimalCostDesc = await translateText(
          "By utilizing existing university infrastructure during summer break, the program requires minimal additional investment while delivering maximum educational impact.",
          targetLang
        );
        translations.maximumImpact = await translateText(
          "Maximum Impact",
          targetLang
        );
        translations.maximumImpactDesc = await translateText(
          "Within just two years, the Ethiopian Ministry of Education recognized the program's effectiveness and adopted it nationwide across all 40+ public universities.",
          targetLang
        );
        translations.sustainableGrowth = await translateText(
          "Sustainable Growth",
          targetLang
        );
        translations.sustainableGrowthDesc = await translateText(
          "Today, the initiative runs as a government-backed program, ensuring long-term sustainability and continued impact for thousands of students every summer.",
          targetLang
        );
        translations.journeyToNationwideImpact = await translateText(
          "Journey to Nationwide Impact",
          targetLang
        );
        translations.howADemonstration = await translateText(
          "How a demonstration became a government-adopted program",
          targetLang
        );
        translations.howItWorks = await translateText(
          "How It Works",
          targetLang
        );
        translations.transformingUniversityCampuses = await translateText(
          "Transforming university campuses into vibrant summer STEM centers",
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
    hero,
    impactStats,
    timeline,
    programBenefits,
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
  const displayHeroBadge = hero?.badge
    ? getTranslated("heroBadge", hero.badge)
    : "";
  const displayHeroTitle = hero?.title
    ? getTranslated("heroTitle", hero.title)
    : "";
  const displayHeroDescription = hero?.description
    ? getTranslated("heroDescription", hero.description)
    : "";
  const displayStats =
    translatedContent.statistics && selectedLanguage !== "en"
      ? translatedContent.statistics
      : impactStats;
  const displayTimeline =
    translatedContent.timeline && selectedLanguage !== "en"
      ? translatedContent.timeline
      : timeline;
  const displayProgramBenefits =
    translatedContent.programBenefits && selectedLanguage !== "en"
      ? translatedContent.programBenefits
      : programBenefits;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
        <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] bg-cover bg-center opacity-20" />
        <div className="container relative mx-auto px-4 py-20 md:py-10">
          <div className="max-w-4xl mx-auto text-center">
            {displayHeroBadge ? (
              <div className="flex justify-center">
                <Badge
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
                           border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
                           text-white rounded-full shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  {displayHeroBadge}
                </Badge>
              </div>
            ) : null}
            {displayHeroTitle ? (
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                {displayHeroTitle}
              </h1>
            ) : (
              <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-balance">
                No hero content available yet.
              </h1>
            )}
            {displayHeroDescription ? (
              <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                {displayHeroDescription}
              </p>
            ) : null}
          </div>
          <br />
          <div className="flex justify-center">
            <Button
              size="lg"
              asChild
              className="bg-linear-to-br from-[#367375] to-[#24C3BC] text-white font-semibold hover:opacity-90 px-8 py-3 transition-all"
            >
              <Link href="/programs/stem-operations/university-outreach/universities">
                {getTranslatedText(
                  "viewParticipatingUniversities",
                  "View Participating Universities"
                )}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
      </section>

      {/* Impact Stats */}
      <section className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
        {!isLoading && displayStats.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-6">
            No statistics available yet.
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {!isLoading &&
            displayStats.map((stat, index) => {
              const IconComponent = stat.icon as any;
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
            })}
        </div>
      </section>

      {/* Success Story */}
      <section className="py-16 ">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-br from-[#367375] to-[#24C3BC]">
                {getTranslatedText(
                  "theResultsSpoke",
                  "The Results Spoke for Themselves"
                )}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {getTranslatedText(
                  "fromPilotProgram",
                  "From pilot program to nationwide government initiative in just two years"
                )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/young-ethiopian-entrepreneurs-in-fablab-maker-spac.jpg"
                  alt="Students in university STEM program"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#367375]">
                  <h3 className="font-bold text-xl mb-2 text-[#367375]">
                    {getTranslatedText("minimalCost", "Minimal Cost")}
                  </h3>
                  <p className="text-muted-foreground">
                    {getTranslatedText(
                      "minimalCostDesc",
                      "By utilizing existing university infrastructure during summer break, the program requires minimal additional investment while delivering maximum educational impact."
                    )}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#24C3BC]">
                  <h3 className="font-bold text-xl mb-2 text-[#24C3BC]">
                    {getTranslatedText("maximumImpact", "Maximum Impact")}
                  </h3>
                  <p className="text-muted-foreground">
                    {getTranslatedText(
                      "maximumImpactDesc",
                      "Within just two years, the Ethiopian Ministry of Education recognized the program's effectiveness and adopted it nationwide across all 40+ public universities."
                    )}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-[#367375]">
                  <h3 className="font-bold text-xl mb-2 text-[#367375]">
                    {getTranslatedText(
                      "sustainableGrowth",
                      "Sustainable Growth"
                    )}
                  </h3>
                  <p className="text-muted-foreground">
                    {getTranslatedText(
                      "sustainableGrowthDesc",
                      "Today, the initiative runs as a government-backed program, ensuring long-term sustainability and continued impact for thousands of students every summer."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-br from-[#367375] to-[#24C3BC]">
                {getTranslatedText(
                  "journeyToNationwideImpact",
                  "Journey to Nationwide Impact"
                )}
              </h2>
              <p className="text-lg text-muted-foreground">
                {getTranslatedText(
                  "howADemonstration",
                  "How a demonstration became a government-adopted program"
                )}
              </p>
            </div>

            {!isLoading && displayTimeline.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-6">
                No timeline items available yet.
              </div>
            )}
            <div className="grid md:grid-cols-4 gap-6">
              {displayTimeline.map((item, index) => (
                <div key={index} className="relative">
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="pt-6">
                      <div className="text-sm font-bold text-[#367375] mb-2">
                        {item.year}
                      </div>
                      <Badge className="mb-3 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white border-0">
                        {item.phase}
                      </Badge>
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                  {index < displayTimeline.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 h-6 w-6 text-[#24C3BC] z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-br from-[#367375] to-[#24C3BC]">
                {getTranslatedText("howItWorks", "How It Works")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {getTranslatedText(
                  "transformingUniversityCampuses",
                  "Transforming university campuses into vibrant summer STEM centers"
                )}
              </p>
            </div>

            {!isLoading && displayProgramBenefits.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-6">
                No program benefits available yet.
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-8">
              {!isLoading &&
                displayProgramBenefits.map((benefit, index) => {
                  const IconComponent = benefit.icon as any;
                  return (
                    <Card
                      key={index}
                      className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                    >
                      <div className="h-2 bg-linear-to-br from-[#367375] to-[#24C3BC]" />
                      <CardContent className="pt-8 pb-6">
                        <div className="w-16 h-16 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          {IconComponent ? (
                            <IconComponent className="h-8 w-8 text-white" />
                          ) : null}
                        </div>
                        <h3 className="text-xl font-bold mb-3">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {benefit.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
