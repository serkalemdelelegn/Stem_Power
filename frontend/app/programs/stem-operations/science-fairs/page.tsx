"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchHero,
  fetchJourneyStages,
  fetchStatistics,
  fetchWinners,
  type ImpactStat,
  type JourneyStage,
} from "@/lib/api-programs/stem-operations/api-programs-stem-operations-science-fairs";
import { useApp } from "@/lib/app-context";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {
  Award,
  Building2,
  Calendar,
  Lightbulb,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const iconMap: Record<string, any> = {
  users: Users,
  building: Building2,
  lightbulb: Lightbulb,
  calendar: Calendar,
  target: Target,
  trophy: Trophy,
  mapPin: MapPin,
  award: Award,
};

export default function ScienceFairsPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [
    Autoplay({ delay: 4000 }),
  ]);

  const [heroContent, setHeroContent] = useState({
    badge: "",
    title: "",
    subtitle: "",
  });
  const [impactStats, setImpactStats] = useState<
    Array<{ number: string; label: string; icon: any }>
  >([]);
  const [fairJourney, setFairJourney] = useState<
    Array<{
      level: string;
      stage: string;
      participants: string;
      description: string;
      icon: any;
    }>
  >([]);
  const [successStories, setSuccessStories] = useState<
    Array<{
      title: string;
      student: string;
      school: string;
      description: string;
      award: string;
      image: string;
    }>
  >([]);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroSubtitle?: string;
    statistics?: Array<{ number: string; label: string; icon: any }>;
    journeyStages?: Array<{
      level: string;
      stage: string;
      participants: string;
      description: string;
      icon: any;
    }>;
    successStories?: Array<{
      title: string;
      student: string;
      school: string;
      description: string;
      award: string;
      image: string;
    }>;
    // Static UI text translations
    theEthiopianApproach?: string;
    solutionsDrivenInnovation?: string;
    whatSetsApart?: string;
    realWorldProblemSolving?: string;
    realWorldProblemSolvingDesc?: string;
    dedicatedMentorship?: string;
    dedicatedMentorshipDesc?: string;
    communityImpactFocus?: string;
    communityImpactFocusDesc?: string;
    growingEcosystem?: string;
    growingEcosystemDesc?: string;
    competitionStructure?: string;
    yourJourneyToNationalRecognition?: string;
    fromLocalCommunities?: string;
    innovationAreas?: string;
    addressingRealChallenges?: string;
    ourStudentsTackle?: string;
    waterInnovation?: string;
    waterInnovationDesc?: string;
    energySolutions?: string;
    energySolutionsDesc?: string;
    agriculturalTech?: string;
    agriculturalTechDesc?: string;
    communityHealth?: string;
    communityHealthDesc?: string;
    nationalChampions?: string;
    celebratingExcellence?: string;
    meetTheBrilliantMinds?: string;
  }>({});

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [hero, stats, journeyStages, winners] = await Promise.all([
          fetchHero(),
          fetchStatistics(),
          fetchJourneyStages(),
          fetchWinners(),
        ]);

        if (isMounted) {
          if (hero) {
            setHeroContent(hero);
          }

          if (stats && stats.length > 0) {
            const mappedStats = stats.map((stat: ImpactStat) => {
              const iconKey = stat.icon?.toLowerCase();
              const IconComponent = iconKey ? iconMap[iconKey] : null;
              return {
                number: stat.number,
                label: stat.label,
                icon: IconComponent,
              };
            });
            setImpactStats(mappedStats);
          }

          if (journeyStages && journeyStages.length > 0) {
            const mappedJourney = journeyStages.map((stage: JourneyStage) => {
              const iconKey = stage.icon?.toLowerCase();
              const IconComponent = iconKey ? iconMap[iconKey] : null;
              return {
                level: stage.level,
                stage: stage.stage,
                participants: stage.participants,
                description: stage.description,
                icon: IconComponent,
              };
            });
            setFairJourney(mappedJourney);
          }

          if (winners && winners.length > 0) {
            setSuccessStories(winners);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    loadData();
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

      // Allow translation even if using defaults (they will be translated too)

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
        if (heroContent.subtitle)
          translations.heroSubtitle = await translateText(
            heroContent.subtitle,
            targetLang
          );

        // Translate statistics labels (keep numbers unchanged)
        const statsToTranslate = impactStats;
        if (statsToTranslate && statsToTranslate.length > 0) {
          translations.statistics = await Promise.all(
            statsToTranslate.map(async (stat) => ({
              ...stat,
              label: await translateText(stat.label || "", targetLang),
            }))
          );
        }

        // Translate journey stages
        const journeyToTranslate = fairJourney;
        if (journeyToTranslate && journeyToTranslate.length > 0) {
          translations.journeyStages = await Promise.all(
            journeyToTranslate.map(async (stage) => ({
              ...stage,
              level: await translateText(stage.level || "", targetLang),
              stage: await translateText(stage.stage || "", targetLang),
              participants: await translateText(
                stage.participants || "",
                targetLang
              ),
              description: await translateText(
                stage.description || "",
                targetLang
              ),
            }))
          );
        }

        // Translate success stories (title, description, award - NOT student name or school)
        if (successStories && successStories.length > 0) {
          translations.successStories = await Promise.all(
            successStories.map(async (story) => ({
              ...story,
              title: await translateText(story.title || "", targetLang),
              description: await translateText(
                story.description || "",
                targetLang
              ),
              award: await translateText(story.award || "", targetLang),
              // student and school names stay the same (proper nouns)
            }))
          );
        }

        // Translate static UI text
        translations.theEthiopianApproach = await translateText(
          "The Ethiopian Approach",
          targetLang
        );
        translations.solutionsDrivenInnovation = await translateText(
          "Solutions-Driven Innovation",
          targetLang
        );
        translations.whatSetsApart = await translateText(
          "What sets the Ethiopian Science Fair apart is its practical, solutions-driven approach. While traditional fairs often follow a hypothesis–experiment–conclusion model, our students focus on real-world challenges.",
          targetLang
        );
        translations.realWorldProblemSolving = await translateText(
          "Real-World Problem Solving",
          targetLang
        );
        translations.realWorldProblemSolvingDesc = await translateText(
          "Students identify pressing challenges in their communities and develop practical, implementable solutions.",
          targetLang
        );
        translations.dedicatedMentorship = await translateText(
          "Dedicated Mentorship",
          targetLang
        );
        translations.dedicatedMentorshipDesc = await translateText(
          "Every student works closely with experienced mentors available through STEM Centers to refine their projects.",
          targetLang
        );
        translations.communityImpactFocus = await translateText(
          "Community Impact Focus",
          targetLang
        );
        translations.communityImpactFocusDesc = await translateText(
          "Projects address water, energy, agriculture, and health challenges facing Ethiopia and Sub-Saharan Africa.",
          targetLang
        );
        translations.growingEcosystem = await translateText(
          "Growing Ecosystem",
          targetLang
        );
        translations.growingEcosystemDesc = await translateText(
          "More public and private schools join annually, creating a thriving network of innovation and collaboration.",
          targetLang
        );
        translations.competitionStructure = await translateText(
          "Competition Structure",
          targetLang
        );
        translations.yourJourneyToNationalRecognition = await translateText(
          "Your Journey to National Recognition",
          targetLang
        );
        translations.fromLocalCommunities = await translateText(
          "From local communities to the national stage, every student has a pathway to showcase their innovation and make a lasting impact.",
          targetLang
        );
        translations.innovationAreas = await translateText(
          "Innovation Areas",
          targetLang
        );
        translations.addressingRealChallenges = await translateText(
          "Addressing Real Challenges",
          targetLang
        );
        translations.ourStudentsTackle = await translateText(
          "Our students tackle the most pressing issues facing their communities and nation.",
          targetLang
        );
        translations.waterInnovation = await translateText(
          "Water Innovation",
          targetLang
        );
        translations.waterInnovationDesc = await translateText(
          "Developing sustainable solutions for clean water access in rural communities",
          targetLang
        );
        translations.energySolutions = await translateText(
          "Energy Solutions",
          targetLang
        );
        translations.energySolutionsDesc = await translateText(
          "Creating renewable energy systems to power homes and schools",
          targetLang
        );
        translations.agriculturalTech = await translateText(
          "Agricultural Tech",
          targetLang
        );
        translations.agriculturalTechDesc = await translateText(
          "Smart farming technologies to improve crop yields and sustainability",
          targetLang
        );
        translations.communityHealth = await translateText(
          "Community Health",
          targetLang
        );
        translations.communityHealthDesc = await translateText(
          "Medical innovations addressing healthcare challenges in underserved areas",
          targetLang
        );
        translations.nationalChampions = await translateText(
          "2024 National Champions",
          targetLang
        );
        translations.celebratingExcellence = await translateText(
          "Celebrating Excellence",
          targetLang
        );
        translations.meetTheBrilliantMinds = await translateText(
          "Meet the brilliant minds whose innovations are making a real difference in communities across Ethiopia.",
          targetLang
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    translateDynamicContent(selectedLanguage);
  }, [selectedLanguage, heroContent, impactStats, fairJourney, successStories]);

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
  const displayHeroBadge = getTranslated("heroBadge", heroContent.badge || "");
  const displayHeroTitle = getTranslated("heroTitle", heroContent.title || "");
  const displayHeroSubtitle = getTranslated(
    "heroSubtitle",
    heroContent.subtitle || ""
  );
  const displayStats =
    translatedContent.statistics && selectedLanguage !== "en"
      ? translatedContent.statistics
      : impactStats;
  const displayJourney =
    translatedContent.journeyStages && selectedLanguage !== "en"
      ? translatedContent.journeyStages
      : fairJourney;
  const displaySuccessStories =
    translatedContent.successStories && selectedLanguage !== "en"
      ? translatedContent.successStories
      : successStories;

  const focusAreas = [
    {
      title: getTranslatedText("waterInnovation", "Water Innovation"),
      description: getTranslatedText(
        "waterInnovationDesc",
        "Developing sustainable solutions for clean water access in rural communities"
      ),
      icon: "💧",
    },
    {
      title: getTranslatedText("energySolutions", "Energy Solutions"),
      description: getTranslatedText(
        "energySolutionsDesc",
        "Creating renewable energy systems to power homes and schools"
      ),
      icon: "⚡",
    },
    {
      title: getTranslatedText("agriculturalTech", "Agricultural Tech"),
      description: getTranslatedText(
        "agriculturalTechDesc",
        "Smart farming technologies to improve crop yields and sustainability"
      ),
      icon: "🌱",
    },
    {
      title: getTranslatedText("communityHealth", "Community Health"),
      description: getTranslatedText(
        "communityHealthDesc",
        "Medical innovations addressing healthcare challenges in underserved areas"
      ),
      icon: "🏥",
    },
  ];

  const gradientTextClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";
  const gradientButtonClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] bg-cover bg-center opacity-20" />
          <div className="container relative mx-auto px-4 py-24 md:py-15">
            <div className="max-w-4xl mx-auto text-center">
              {displayHeroBadge && (
                <div className="flex justify-center mb-6">
                  <Badge className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white rounded-full shadow-md">
                    <Sparkles className="h-4 w-4" />
                    {displayHeroBadge}
                  </Badge>
                </div>
              )}

              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {displayHeroTitle || "No hero content available yet."}
              </h1>

              {displayHeroSubtitle ? (
                <p className="text-lg max-w-3xl mx-auto">
                  {displayHeroSubtitle}
                </p>
              ) : null}
            </div>
          </div>
          <br />
          <br />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
        </section>

        {/* Impact Stats */}
        <section className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {displayStats.length === 0 ? (
              <p className="text-sm text-center text-[#384254] col-span-2 md:col-span-4">
                No impact statistics available yet.
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
                      <div className="text-sm text-[#384254] font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <Badge
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md"
              >
                <Zap className="h-4 w-4" />
                {getTranslatedText(
                  "theEthiopianApproach",
                  "The Ethiopian Approach"
                )}
              </Badge>
            </div>
            <br />
            <h2
              className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
            >
              {getTranslatedText(
                "solutionsDrivenInnovation",
                "Solutions-Driven Innovation"
              )}
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              {getTranslatedText(
                "whatSetsApart",
                "What sets the Ethiopian Science Fair apart is its practical, solutions-driven approach. While traditional fairs often follow a hypothesis–experiment–conclusion model, our students focus on real-world challenges."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/ethiopian-students-working-with-science-equipment-.jpg"
                alt="Students working on science projects"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              {[
                {
                  icon: Lightbulb,
                  title: getTranslatedText(
                    "realWorldProblemSolving",
                    "Real-World Problem Solving"
                  ),
                  description: getTranslatedText(
                    "realWorldProblemSolvingDesc",
                    "Students identify pressing challenges in their communities and develop practical, implementable solutions."
                  ),
                },
                {
                  icon: Users,
                  title: getTranslatedText(
                    "dedicatedMentorship",
                    "Dedicated Mentorship"
                  ),
                  description: getTranslatedText(
                    "dedicatedMentorshipDesc",
                    "Every student works closely with experienced mentors available through STEM Centers to refine their projects."
                  ),
                },
                {
                  icon: Target,
                  title: getTranslatedText(
                    "communityImpactFocus",
                    "Community Impact Focus"
                  ),
                  description: getTranslatedText(
                    "communityImpactFocusDesc",
                    "Projects address water, energy, agriculture, and health challenges facing Ethiopia and Sub-Saharan Africa."
                  ),
                },
                {
                  icon: TrendingUp,
                  title: getTranslatedText(
                    "growingEcosystem",
                    "Growing Ecosystem"
                  ),
                  description: getTranslatedText(
                    "growingEcosystemDesc",
                    "More public and private schools join annually, creating a thriving network of innovation and collaboration."
                  ),
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey to Excellence */}
        <section className="bg-linear-to-br from-slate-50 to-emerald-50/50 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="flex justify-center">
                <Badge className="flex items-center gap-2 px-6 py-3 text-base font-semibold bg-linear-to-br from-[#367375] to-[#24C3BC] text-white rounded-full shadow-md">
                  <Trophy className="h-5 w-5" />
                  {getTranslatedText(
                    "competitionStructure",
                    "Competition Structure"
                  )}
                </Badge>
              </div>
              <br />
              <h2
                className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
              >
                {getTranslatedText(
                  "yourJourneyToNationalRecognition",
                  "Your Journey to National Recognition"
                )}
              </h2>
              <p className="text-xl max-w-3xl mx-auto">
                {getTranslatedText(
                  "fromLocalCommunities",
                  "From local communities to the national stage, every student has a pathway to showcase their innovation and make a lasting impact."
                )}
              </p>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-6">
                {displayJourney.length === 0 ? (
                  <p className="text-sm text-center text-[#384254] w-full py-4">
                    No journey stages available yet.
                  </p>
                ) : (
                  displayJourney.map((stage, index) => {
                    const IconComponent = stage.icon;
                    return (
                      <div
                        className="flex-[0_0_80%] md:flex-[0_0_33%] lg:flex-[0_0_30%]"
                        key={index}
                      >
                        <Card className="relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2">
                          <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-[#367375] to-[#24C3BC]" />
                          <CardHeader className="text-center pb-4">
                            <div className="w-20 h-20 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                              {IconComponent ? (
                                <IconComponent className="h-10 w-10 text-white" />
                              ) : null}
                            </div>
                            <Badge className="mb-2 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white border-white/20 mx-auto px-4 py-2 text-sm font-semibold">
                              {stage.stage}
                            </Badge>
                            <CardTitle className="text-2xl">
                              {stage.level}
                            </CardTitle>
                            <CardDescription className="text-base font-semibold text-[#367375]">
                              {stage.participants}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-center leading-relaxed">
                              {stage.description}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Focus Areas */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <Badge
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md"
              >
                <Target className="h-4 w-4" />
                {getTranslatedText("innovationAreas", "Innovation Areas")}
              </Badge>
            </div>
            <br />
            <h2
              className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
            >
              {getTranslatedText(
                "addressingRealChallenges",
                "Addressing Real Challenges"
              )}
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              {getTranslatedText(
                "ourStudentsTackle",
                "Our students tackle the most pressing issues facing their communities and nation."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {focusAreas.map((area, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2"
              >
                <CardContent className="pt-8 pb-6">
                  <div className="text-5xl mb-4">{area.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{area.title}</h3>
                  <p className="text-sm leading-relaxed">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Success Stories */}
        {/* Success Stories */}
        <section className="bg-white py-15">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex justify-center">
                <Badge
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md"
                >
                  <Award className="h-4 w-4" />
                  {getTranslatedText(
                    "nationalChampions",
                    "2024 National Champions"
                  )}
                </Badge>
              </div>
              <br />
              <h2
                className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
              >
                {getTranslatedText(
                  "celebratingExcellence",
                  "Celebrating Excellence"
                )}
              </h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-700">
                {getTranslatedText(
                  "meetTheBrilliantMinds",
                  "Meet the brilliant minds whose innovations are making a real difference in communities across Ethiopia."
                )}
              </p>
            </div>
            {displaySuccessStories.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {displaySuccessStories.map((story, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2"
                  >
                    <div className="relative h-48">
                      {story.image ? (
                        <Image
                          src={story.image}
                          alt={story.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500 text-sm">
                          No image provided
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-linear-to-br from-[#367375] to-[#24C3BC] text-white rounded-full shadow-md">
                          <Trophy className="h-4 w-4" />
                          {story.award}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900">
                        {story.title}
                      </CardTitle>
                      <CardDescription>
                        <div className="font-semibold text-gray-800 text-base">
                          {story.student}
                        </div>
                        <div className="text-sm mt-1 text-gray-600">
                          {story.school}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed text-gray-700">
                        {story.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-gray-700">
                No success stories added yet.
              </p>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
