"use client";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  GraduationCap,
  Award,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  fetchUniversities,
  fetchImpactStats,
  type University,
  type ImpactStat,
} from "@/lib/api-programs/stem-operations/api-programs-stem-centers-university-outreach";
import { useApp } from "@/lib/app-context";

export default function ParticipatingUniversitiesPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [universities, setUniversities] = useState<University[]>([]);
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    statistics?: Array<{ number: string; label: string; icon: any }>;
    universities?: Array<{
      description: string;
      facilities: string[];
      achievements: string[];
    }>;
    // Static UI text translations
    universitiesNationwide?: string;
    participatingUniversities?: string;
    meetTheUniversities?: string;
    theseInstitutionsOpen?: string;
    featuredPartnerUniversities?: string;
    exploreTheUniversities?: string;
    students?: string;
    program?: string;
    facilities?: string;
    keyFacilities?: string;
    notableAchievements?: string;
    andMoreUniversities?: string;
    andMoreUniversitiesDesc?: string;
    est?: string;
    since?: string;
  }>({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [universitiesData, stats] = await Promise.all([
          fetchUniversities(),
          fetchImpactStats(),
        ]);
        setUniversities(universitiesData);
        setImpactStats(stats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // No fallback content; rely on backend only

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

        // Translate universities (name and location are proper nouns, don't translate)
        if (universities && universities.length > 0) {
          translations.universities = await Promise.all(
            universities.map(async (university) => ({
              description: await translateText(
                university.description || "",
                targetLang
              ),
              facilities: await Promise.all(
                (university.facilities || []).map((facility) =>
                  translateText(facility, targetLang)
                )
              ),
              achievements: await Promise.all(
                (university.achievements || []).map((achievement) =>
                  translateText(achievement, targetLang)
                )
              ),
            }))
          );
        }

        // Translate static UI text
        translations.universitiesNationwide = await translateText(
          "40+ Universities Nationwide",
          targetLang
        );
        translations.participatingUniversities = await translateText(
          "Participating Universities",
          targetLang
        );
        translations.meetTheUniversities = await translateText(
          "Meet the universities transforming summer break into opportunity",
          targetLang
        );
        translations.theseInstitutionsOpen = await translateText(
          "These institutions open their doors, labs, and hearts every summer to provide exceptional STEM learning experiences for thousands of talented Ethiopian youth.",
          targetLang
        );
        translations.featuredPartnerUniversities = await translateText(
          "Featured Partner Universities",
          targetLang
        );
        translations.exploreTheUniversities = await translateText(
          "Explore the universities leading the way in summer STEM education across Ethiopia",
          targetLang
        );
        translations.students = await translateText("Students", targetLang);
        translations.program = await translateText("Program", targetLang);
        translations.facilities = await translateText("Facilities", targetLang);
        translations.keyFacilities = await translateText(
          "Key Facilities",
          targetLang
        );
        translations.notableAchievements = await translateText(
          "Notable Achievements",
          targetLang
        );
        translations.andMoreUniversities = await translateText(
          "And 34+ More Universities",
          targetLang
        );
        translations.andMoreUniversitiesDesc = await translateText(
          "The University STEM Outreach program operates across all public universities in Ethiopia, reaching every region and providing opportunities to thousands of students nationwide. The universities featured above represent the diversity and excellence of our partner institutions.",
          targetLang
        );
        translations.est = await translateText("Est.", targetLang);
        translations.since = await translateText("Since", targetLang);

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
  }, [selectedLanguage, impactStats, universities, isLoading]);

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

  const universitiesToUse = universities;
  const statsToUse = impactStats;

  // Use translated content
  const displayStats =
    translatedContent.statistics && selectedLanguage !== "en"
      ? translatedContent.statistics
      : statsToUse;

  // Get translated university data (preserving name and location as proper nouns)
  const displayUniversities = universitiesToUse.map((university, index) => {
    if (
      selectedLanguage === "en" ||
      !translatedContent.universities ||
      !translatedContent.universities[index]
    ) {
      return university;
    }
    const translated = translatedContent.universities[index];
    return {
      ...university, // Keep name, location, established, studentsServed, programStartYear, image, website
      description: translated.description,
      facilities: translated.facilities,
      achievements: translated.achievements,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-teal-700 via-teal-600 to-cyan-500 text-white">
        <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] bg-cover bg-center opacity-20" />

        <div className="container relative mx-auto px-4 py-24 md:py-15">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Building2 className="h-3 w-3 mr-1" />
              {getTranslatedText(
                "universitiesNationwide",
                "40+ Universities Nationwide"
              )}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              {getTranslatedText(
                "participatingUniversities",
                "Participating Universities"
              )}
            </h1>
            <p className="text-xl md:text-2xl text-cyan-50 mb-4 text-pretty leading-relaxed">
              {getTranslatedText(
                "meetTheUniversities",
                "Meet the universities transforming summer break into opportunity"
              )}
            </p>
            <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
              {getTranslatedText(
                "theseInstitutionsOpen",
                "These institutions open their doors, labs, and hearts every summer to provide exceptional STEM learning experiences for thousands of talented Ethiopian youth."
              )}
            </p>
            <br />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
      </section>

      {/* Impact Stats */}
      <section className="max-w-6xl mx-auto px-2 -mt-12 relative z-10">
        {!isLoading && displayStats.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-6">
            No statistics available yet.
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {!isLoading &&
            displayStats.map((stat, index) => {
              const IconComponent = stat.icon as any;
              return (
                <Card
                  key={index}
                  className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2"
                >
                  <CardContent className="pt-6 pb-3">
                    <div className="w-12 h-12 bg-linear-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      {IconComponent ? (
                        <IconComponent className="h-6 w-6 text-white" />
                      ) : null}
                    </div>
                    <div className="text-4xl font-bold text-emerald-600 mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </section>

      {/* Universities List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {getTranslatedText(
                  "featuredPartnerUniversities",
                  "Featured Partner Universities"
                )}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {getTranslatedText(
                  "exploreTheUniversities",
                  "Explore the universities leading the way in summer STEM education across Ethiopia"
                )}
              </p>
            </div>

            {!isLoading && displayUniversities.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-6">
                No universities available yet.
              </div>
            )}
            <div className="space-y-8">
              {!isLoading &&
                displayUniversities.map((university, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="grid md:grid-cols-5 gap-6">
                      {/* University Image */}
                      {university.image ? (
                        <div className="md:col-span-2 relative h-64 md:h-auto">
                          <Image
                            src={university.image}
                            alt={university.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 text-teal-700 border-0 font-semibold">
                              {getTranslatedText("est", "Est.")}{" "}
                              {university.established}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="md:col-span-2 p-6 flex items-center justify-center bg-muted/30">
                          <span className="text-xs text-muted-foreground">
                            No image available
                          </span>
                        </div>
                      )}

                      {/* University Details */}
                      <div className="md:col-span-3 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">
                              {university.name}
                            </h3>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                {university.location}
                              </span>
                            </div>
                          </div>
                          {university.website && (
                            <Link
                              href={university.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-teal-600 hover:text-teal-700"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </Link>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {university.description}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-teal-600" />
                            <div>
                              <div className="text-sm font-semibold">
                                {university.studentsServed}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {getTranslatedText("students", "Students")}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-cyan-600" />
                            <div>
                              <div className="text-sm font-semibold">
                                {getTranslatedText("since", "Since")}{" "}
                                {university.programStartYear}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {getTranslatedText("program", "Program")}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-teal-600" />
                            <div>
                              <div className="text-sm font-semibold">
                                {university.facilities.length}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {getTranslatedText("facilities", "Facilities")}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Facilities */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold mb-2 flex items-center">
                            <Building2 className="h-4 w-4 mr-1 text-teal-600" />
                            {getTranslatedText(
                              "keyFacilities",
                              "Key Facilities"
                            )}
                          </h4>
                          {university.facilities &&
                          university.facilities.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {university.facilities.map((facility, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {facility}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              No facilities listed.
                            </div>
                          )}
                        </div>

                        {/* Achievements */}
                        <div>
                          <h4 className="text-sm font-semibold mb-2 flex items-center">
                            <Award className="h-4 w-4 mr-1 text-cyan-600" />
                            {getTranslatedText(
                              "notableAchievements",
                              "Notable Achievements"
                            )}
                          </h4>
                          {university.achievements &&
                          university.achievements.length > 0 ? (
                            <ul className="space-y-1">
                              {university.achievements.map(
                                (achievement, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-muted-foreground flex items-start"
                                  >
                                    <span className="text-teal-600 mr-2">
                                      •
                                    </span>
                                    {achievement}
                                  </li>
                                )
                              )}
                            </ul>
                          ) : (
                            <div className="text-xs text-muted-foreground">
                              No achievements listed.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>

            {/* Additional Universities Note */}
            {displayUniversities.length > 0 && (
              <Card className="mt-12 bg-linear-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
                <CardContent className="p-8 text-center">
                  <Building2 className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    {getTranslatedText(
                      "andMoreUniversities",
                      "And 34+ More Universities"
                    )}
                  </h3>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {getTranslatedText(
                      "andMoreUniversitiesDesc",
                      "The University STEM Outreach program operates across all public universities in Ethiopia, reaching every region and providing opportunities to thousands of students nationwide. The universities featured above represent the diversity and excellence of our partner institutions."
                    )}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
