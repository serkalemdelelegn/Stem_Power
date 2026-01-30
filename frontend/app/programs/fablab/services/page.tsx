"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Cpu,
  Printer,
  Zap,
  Wrench,
  CircuitBoard,
  Shield,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle,
  Users,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Factory,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  fetchHero,
  fetchStats,
  fetchMachineries,
  fetchBenefits,
  type HeroContent,
  type ImpactStat,
  type Machinery,
  type Benefit,
} from "@/lib/api-programs/fablab/api-programs-fablab-services";
import { useApp } from "@/lib/app-context";

// Static data removed - now fetched from backend via API

export default function MachineriesPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [machines, setMachines] = useState<Machinery[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ number: string; label: string; icon: any }>;
    machineries?: Array<{
      name: string;
      description: string;
      capabilities: string[];
      applications: string[];
    }>;
    benefits?: Array<{
      title: string;
      description: string;
    }>;
    // Static UI text translations
    ourMission?: string;
    transformingIdeasIntoReality?: string;
    theseMachinesEnable?: string;
    ourEquipment?: string;
    stateOfTheArtMachinery?: string;
    professionalGradeEquipment?: string;
    keyCapabilities?: string;
    commonApplications?: string;
    whyChooseUs?: string;
    completeInnovationEcosystem?: string;
    moreThanJustEquipment?: string;
  }>({});

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      setIsLoading(true);
      try {
        // Fetch all data in parallel using the API helper functions
        // The API functions handle errors internally and return fallbacks
        const [heroData, statsData, machineriesData, benefitsData] =
          await Promise.all([
            fetchHero(),
            fetchStats(),
            fetchMachineries(),
            fetchBenefits(),
          ]);

        if (isMounted) {
          setHero(heroData);
          setStats(statsData);
          setMachines(machineriesData);
          setBenefits(benefitsData);
          setError(null);
        }
      } catch (err) {
        console.error(
          "[MachineriesPage] Unexpected error during data load",
          err
        );
        if (isMounted) {
          setError(null);
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
        // Ensure stats are loaded before translating
        // NOTE: The data structure has number and label swapped - number contains label text, label contains numeric value
        if (stats && stats.length > 0) {
          translations.statistics = await Promise.all(
            stats.map(async (stat) => {
              // The number field actually contains the label text that needs translation
              // The label field contains the numeric value
              if (!stat.number) return stat;
              const translatedLabel = await translateText(
                stat.number,
                targetLang
              );
              return {
                ...stat,
                number: translatedLabel, // Translate the number field (which contains the label text)
                // label stays the same (contains the numeric value)
                // icon stays the same
              };
            })
          );
        }

        // Translate machineries
        if (machines && machines.length > 0) {
          translations.machineries = await Promise.all(
            machines.map(async (machine) => ({
              name: await translateText(machine.name || "", targetLang),
              description: await translateText(
                machine.description || "",
                targetLang
              ),
              capabilities: await Promise.all(
                (machine.capabilities || []).map((capability) =>
                  translateText(capability, targetLang)
                )
              ),
              applications: await Promise.all(
                (machine.applications || []).map((app) =>
                  translateText(app, targetLang)
                )
              ),
              // specs stay the same (technical terms)
            }))
          );
        }

        // Translate benefits
        if (benefits && benefits.length > 0) {
          translations.benefits = await Promise.all(
            benefits.map(async (benefit) => ({
              title: await translateText(benefit.title || "", targetLang),
              description: await translateText(
                benefit.description || "",
                targetLang
              ),
            }))
          );
        }

        // Translate static UI text
        translations.ourMission = await translateText(
          "Our Mission",
          targetLang
        );
        translations.transformingIdeasIntoReality = await translateText(
          "Transforming Ideas into Reality",
          targetLang
        );
        translations.theseMachinesEnable = await translateText(
          "These machines enable students, researchers, and entrepreneurs to design, fabricate, and test complex projects across engineering, robotics, and electronics. With expert guidance and safety protocols in place, our FabLab machinery transforms ideas into tangible solutions while fostering technical skills, innovation, and problem-solving capacity.",
          targetLang
        );
        translations.ourEquipment = await translateText(
          "Our Equipment",
          targetLang
        );
        translations.stateOfTheArtMachinery = await translateText(
          "State-of-the-Art Machinery",
          targetLang
        );
        translations.professionalGradeEquipment = await translateText(
          "Professional-grade equipment for precision fabrication, prototyping, and innovation",
          targetLang
        );
        translations.keyCapabilities = await translateText(
          "Key Capabilities",
          targetLang
        );
        translations.commonApplications = await translateText(
          "Common Applications",
          targetLang
        );
        translations.whyChooseUs = await translateText(
          "Why Choose Us",
          targetLang
        );
        translations.completeInnovationEcosystem = await translateText(
          "Complete Innovation Ecosystem",
          targetLang
        );
        translations.moreThanJustEquipment = await translateText(
          "More than just equipment—we provide comprehensive support for your innovation journey",
          targetLang
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    // Only translate when data is loaded and stats are available
    if (!isLoading && stats && stats.length > 0) {
      translateDynamicContent(selectedLanguage);
    }
  }, [selectedLanguage, hero, stats, machines, benefits, isLoading]);

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
  const displayHeroBadge = getTranslated("heroBadge", hero?.badge || "");
  const displayHeroTitle = getTranslated("heroTitle", hero?.title || "");
  const displayHeroDescription = getTranslated(
    "heroDescription",
    hero?.description || ""
  );
  // Use translated stats when available and language is not English
  const displayStats = (() => {
    if (
      selectedLanguage !== "en" &&
      translatedContent.statistics &&
      translatedContent.statistics.length > 0
    ) {
      return translatedContent.statistics;
    }
    return stats;
  })();
  const displayMachineries =
    translatedContent.machineries && selectedLanguage !== "en"
      ? machines.map((machine, index) => ({
          ...machine,
          name: translatedContent.machineries![index].name,
          description: translatedContent.machineries![index].description,
          capabilities: translatedContent.machineries![index].capabilities,
          applications: translatedContent.machineries![index].applications,
        }))
      : machines;
  const displayBenefits =
    translatedContent.benefits && selectedLanguage !== "en"
      ? benefits.map((benefit, index) => ({
          ...benefit,
          title: translatedContent.benefits![index].title,
          description: translatedContent.benefits![index].description,
        }))
      : benefits;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
          <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-12">
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
                <>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                    {displayHeroTitle}
                  </h1>
                  {displayHeroDescription && (
                    <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                      {displayHeroDescription}
                    </p>
                  )}
                </>
              ) : (
                <div className="py-8">
                  <p className="text-lg text-cyan-100/80">
                    Hero content will be displayed here once it is added.
                  </p>
                </div>
              )}
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent" />
        </section>

        <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
          {displayStats.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {displayStats.map((stat: ImpactStat, index: number) => {
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

        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <Badge
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md "
              >
                <Lightbulb className="w-4 h-4" />
                {getTranslatedText("ourMission", "Our Mission")}
              </Badge>
            </div>
            <br />
            <h2
              className={`text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold`}
            >
              {getTranslatedText(
                "transformingIdeasIntoReality",
                "Transforming Ideas into Reality"
              )}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              {getTranslatedText(
                "theseMachinesEnable",
                "These machines enable students, researchers, and entrepreneurs to design, fabricate, and test complex projects across engineering, robotics, and electronics. With expert guidance and safety protocols in place, our FabLab machinery transforms ideas into tangible solutions while fostering technical skills, innovation, and problem-solving capacity."
              )}
            </p>
          </div>
        </section>

        <section
          id="machinery"
          className="bg-linear-to-br from-[#367375]/10 to-[#24C3BC]/10 py-10"
        >
          <div className="max-w-6xl mx-auto px-2">
            <div className="text-center mb-16">
              <div className="flex justify-center">
                <Badge
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
          border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
          text-white rounded-full shadow-md"
                >
                  <Factory className="w-4 h-4" />
                  {getTranslatedText("ourEquipment", "Our Equipment")}
                </Badge>
              </div>
              <br />
              <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
                {getTranslatedText(
                  "stateOfTheArtMachinery",
                  "State-of-the-Art Machinery"
                )}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                {getTranslatedText(
                  "professionalGradeEquipment",
                  "Professional-grade equipment for precision fabrication, prototyping, and innovation"
                )}
              </p>
            </div>

            {displayMachineries.length > 0 ? (
              <div className="space-y-6">
                {displayMachineries.map((machine, index) => {
                  const IconComponent = machine.icon;
                  return (
                    <Card
                      key={machine.id || index}
                      className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2"
                    >
                      <div className="grid lg:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div
                          className={`relative h-72 md:h-80 lg:h-96 ${
                            index % 2 === 1 ? "lg:order-2" : ""
                          }`}
                        >
                          {machine.image ? (
                            <>
                              <Image
                                src={machine.image}
                                alt={machine.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center gap-3 text-white">
                                  <div className="w-12 h-12 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center">
                                    <IconComponent className="h-6 w-6 text-white" />
                                  </div>
                                  <h3 className="text-xl md:text-2xl font-bold">
                                    {machine.name}
                                  </h3>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-full h-full bg-linear-to-br from-[#367375] to-[#24C3BC] flex items-center justify-center">
                                <IconComponent className="h-16 w-16 text-white opacity-50" />
                              </div>
                              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                              <div className="absolute bottom-6 left-6 right-6">
                                <div className="flex items-center gap-3 text-white">
                                  <div className="w-12 h-12 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center">
                                    <IconComponent className="h-6 w-6 text-white" />
                                  </div>
                                  <h3 className="text-xl md:text-2xl font-bold">
                                    {machine.name}
                                  </h3>
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Content Section */}
                        <div className="p-4 lg:p-6 space-y-2 h-72 md:h-80 lg:h-96">
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {machine.description}
                          </p>

                          {/* Specifications */}
                          {Object.keys(machine.specs).length > 0 && (
                            <div className="grid grid-cols-3 gap-1.5">
                              {Object.entries(machine.specs).map(
                                ([key, value]) => (
                                  <div
                                    key={key}
                                    className="text-center p-1.5 rounded-lg bg-linear-to-br from-[#367375]/10 to-[#24C3BC]/10 border border-[#367375]/20"
                                  >
                                    <div className="text-xs font-bold text-[#367375]">
                                      {value}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground capitalize mt-1">
                                      {key}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {/* Capabilities */}
                          {(machine.capabilities || []).length > 0 && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-[#367375]">
                                <CheckCircle className="h-4 w-4" />
                                {getTranslatedText(
                                  "keyCapabilities",
                                  "Key Capabilities"
                                )}
                              </h4>
                              <div className="grid gap-1.5">
                                {machine.capabilities.map(
                                  (capability, capIndex) => (
                                    <div
                                      key={capIndex}
                                      className="flex items-start gap-2 text-xs"
                                    >
                                      <CheckCircle className="h-3.5 w-3.5 text-[#367375] shrink-0 mt-0.5" />
                                      <span>{capability}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          {/* Applications */}
                          {(machine.applications || []).length > 0 && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2 text-[#367375]">
                                {getTranslatedText(
                                  "commonApplications",
                                  "Common Applications"
                                )}
                              </h4>
                              <div className="flex flex-wrap gap-1.5">
                                {machine.applications.map((app, appIndex) => (
                                  <Badge
                                    key={appIndex}
                                    variant="secondary"
                                    className="px-2.5 py-0.5 text-xs bg-linear-to-br from-[#367375]/10 to-[#24C3BC]/10 border border-[#367375]/20 text-[#367375]"
                                  >
                                    {app}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="text-center border-2">
                <CardContent className="pt-12 pb-12 px-4">
                  <Factory className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground text-lg">
                    Machinery and equipment will be displayed here once they are
                    added.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="flex justify-center">
              <Badge
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md"
              >
                <Shield className="w-4 h-4" />
                {getTranslatedText("whyChooseUs", "Why Choose Us")}
              </Badge>
            </div>
            <br />
            <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
              {getTranslatedText(
                "completeInnovationEcosystem",
                "Complete Innovation Ecosystem"
              )}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              {getTranslatedText(
                "moreThanJustEquipment",
                "More than just equipment—we provide comprehensive support for your innovation journey"
              )}
            </p>
          </div>

          {displayBenefits.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayBenefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-[#367375]/30"
                  >
                    <CardContent className="pt-8 pb-6">
                      <div className="w-16 h-16 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-[#367375]">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center border-2">
              <CardContent className="pt-12 pb-12 px-4">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">
                  Benefits will be displayed here once they are added.
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}
