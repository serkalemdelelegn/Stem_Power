"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageSquare,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle,
  Brain,
  Heart,
  Handshake,
  Calendar,
  Mail,
  FileText,
  Building2,
  Tag,
  DollarSign,
  Phone,
  Rocket,
  Clock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  fetchHero,
  fetchStatistics,
  fetchPrograms,
  fetchApplicationPrograms,
  type HeroData,
  type ImpactStat,
  type Program,
  type ApplicationProgram,
} from "@/lib/api-programs/entrepreneurship/api-programs-entrepreneurship-soft-skills";
import { fetchSuccessStories } from "@/lib/api-programs/entrepreneurship/api-programs-entrepreneurship-business-dev";
import { useApp } from "@/lib/app-context";

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

const iconMap: Record<string, any> = {
  rocket: Rocket,
  trending: TrendingUp,
  users: Users,
  dollar: DollarSign,
  messageSquare: MessageSquare,
  handshake: Handshake,
};

const programIconMap: Record<string, any> = {
  messageSquare: MessageSquare,
  users2: Users,
  lightbulb: Lightbulb,
  target: Target,
  heart: Heart,
};

const getIconColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    teal: "bg-[#00BFA6]",
    cyan: "bg-cyan-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };
  return colorMap[color] || colorMap.teal;
};

export default function SoftSkillsPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [heroContent, setHeroContent] = useState({
    title: "",
    description: "",
  });
  const [impactStats, setImpactStats] = useState<
    Array<{ number: string; label: string; icon: any }>
  >([]);
  const [programs, setPrograms] = useState<any[]>([]);
  const [featuredSuccessStories, setFeaturedSuccessStories] = useState<any[]>(
    []
  );

  const [applicationPrograms, setApplicationPrograms] = useState<
    ApplicationProgram[]
  >([]);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ number: string; label: string; icon: any }>;
    programs?: Array<{
      title?: string;
      description?: string;
      duration?: string;
      level?: string;
      skills?: string[];
      topics?: string[];
    }>;
    applicationPrograms?: Array<{
      title?: string;
      description?: string;
      status?: string;
    }>;
    successStories?: Array<{
      category?: string;
      licenseStatus?: string;
    }>;
    // Static UI text translations
    entrepreneurshipIncubation?: string;
    aboutOurSoftSkillsProgram?: string;
    unlockingPotentialBeyondTheClassroom?: string;
    aboutDescription?: string;
    whySoftSkillsMatter?: string;
    whySoftSkillsDescription?: string;
    buildConfidence?: string;
    developLeadership?: string;
    masterTeamwork?: string;
    enhanceEmotionalIntelligence?: string;
    communicationMastery?: string;
    communicationDescription?: string;
    teamworkCollaboration?: string;
    teamworkDescription?: string;
    leadershipInfluence?: string;
    leadershipDescription?: string;
    personalExcellence?: string;
    personalExcellenceDescription?: string;
    more?: string;
    applyToOurPrograms?: string;
    freeApplicationPrograms?: string;
    applicationProgramsDescription?: string;
    free?: string;
    starts?: string;
    applyNow?: string;
    noApplicationProgramsAvailable?: string;
    fromLearnerToDigitalInnovator?: string;
    realSuccessStories?: string;
    successStoriesDescription?: string;
    viewAllSuccessStories?: string;
    // Fallback stats
    studentsTrained?: string;
    confidenceIncrease?: string;
    workshopsDelivered?: string;
    partnerOrganizations?: string;
  }>({});

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [hero, stats, programs, appPrograms, stories] = await Promise.all(
          [
            fetchHero(),
            fetchStatistics(),
            fetchPrograms(),
            fetchApplicationPrograms(),
            fetchSuccessStories(),
          ]
        );

        if (isMounted) {
          if (hero) {
            setHeroContent(hero);
          }

          if (stats && stats.length > 0) {
            // Map icon strings to icon components
            const mappedStats = stats.map((stat: ImpactStat) => {
              const iconKey = stat.icon?.toLowerCase() || "users";
              const IconComponent = iconMap[iconKey] || Users;
              return {
                number: stat.number,
                label: stat.label,
                icon: IconComponent,
              };
            });
            setImpactStats(mappedStats);
          }

          if (programs && programs.length > 0) {
            setPrograms(programs);
          }

          if (appPrograms && appPrograms.length > 0) {
            setApplicationPrograms(appPrograms);
          }

          if (stories && stories.length > 0) {
            // Map success stories to the format expected by the component
            const mappedStories = stories.slice(0, 8).map((story: any) => ({
              id: story.id,
              name: story.name,
              contactPerson: story.owner,
              phone: story.phone,
              email: story.email,
              category: story.sector,
              licenseStatus: story.status,
            }));
            setFeaturedSuccessStories(mappedStories);
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

      setTranslating(true);
      try {
        const translations: any = {};

        // Translate hero section
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
        if (impactStats && impactStats.length > 0) {
          translations.statistics = await Promise.all(
            impactStats.map(async (stat) => ({
              ...stat,
              label: await translateText(stat.label || "", targetLang),
              // number stays the same
            }))
          );
        }

        // Translate programs
        if (programs && programs.length > 0) {
          translations.programs = await Promise.all(
            programs.map(async (program) => ({
              title: program.title
                ? await translateText(program.title, targetLang)
                : program.title,
              description: program.description
                ? await translateText(program.description, targetLang)
                : program.description,
              duration: program.duration
                ? await translateText(program.duration, targetLang)
                : program.duration,
              level: program.level
                ? await translateText(program.level, targetLang)
                : program.level,
              skills: program.skills
                ? await Promise.all(
                    (program.skills || []).map((skill: string) =>
                      translateText(skill, targetLang)
                    )
                  )
                : program.skills,
              topics: program.topics
                ? await Promise.all(
                    (program.topics || []).map((topic: string) =>
                      translateText(topic, targetLang)
                    )
                  )
                : program.topics,
            }))
          );
        }

        // Translate application programs
        if (applicationPrograms && applicationPrograms.length > 0) {
          translations.applicationPrograms = await Promise.all(
            applicationPrograms.map(async (program) => ({
              title: program.title
                ? await translateText(program.title, targetLang)
                : program.title,
              description: program.description
                ? await translateText(program.description, targetLang)
                : program.description,
              status: program.status
                ? await translateText(program.status, targetLang)
                : program.status,
            }))
          );
        }

        // Translate success stories (category and licenseStatus)
        if (featuredSuccessStories && featuredSuccessStories.length > 0) {
          // Collect unique categories and statuses
          const uniqueCategories = Array.from(
            new Set(
              featuredSuccessStories
                .map((story) => story.category)
                .filter(Boolean)
            )
          );
          const uniqueStatuses = Array.from(
            new Set(
              featuredSuccessStories
                .map((story) => story.licenseStatus)
                .filter(Boolean)
            )
          );

          const translatedCategories: Record<string, string> = {};
          const translatedStatuses: Record<string, string> = {};

          for (const category of uniqueCategories) {
            if (category) {
              translatedCategories[category] = await translateText(
                category,
                targetLang
              );
            }
          }

          for (const status of uniqueStatuses) {
            if (status) {
              translatedStatuses[status] = await translateText(
                status,
                targetLang
              );
            }
          }

          translations.successStories = featuredSuccessStories.map((story) => ({
            category: story.category
              ? translatedCategories[story.category] || story.category
              : story.category,
            licenseStatus: story.licenseStatus
              ? translatedStatuses[story.licenseStatus] || story.licenseStatus
              : story.licenseStatus,
          }));
        }

        // Translate static UI text
        translations.entrepreneurshipIncubation = await translateText(
          "Entrepreneurship & Incubation",
          targetLang
        );
        translations.aboutOurSoftSkillsProgram = await translateText(
          "About Our Soft Skills Program",
          targetLang
        );
        translations.unlockingPotentialBeyondTheClassroom = await translateText(
          "Unlocking Potential Beyond the Classroom",
          targetLang
        );
        translations.aboutDescription = await translateText(
          "At STEMpower, we believe success isn't just about technical know-how—it's also about communication, teamwork, leadership, and problem-solving. Our soft skills programs equip students and young innovators with the interpersonal and professional abilities they need to thrive in any environment.",
          targetLang
        );
        translations.whySoftSkillsMatter = await translateText(
          "Why Soft Skills Matter",
          targetLang
        );
        translations.whySoftSkillsDescription = await translateText(
          "Through interactive workshops, mentorship, and real-world scenarios, participants gain the confidence to lead projects, navigate challenges, and turn their ideas into meaningful impact.",
          targetLang
        );
        translations.buildConfidence = await translateText(
          "Build confidence in communication and presentation",
          targetLang
        );
        translations.developLeadership = await translateText(
          "Develop leadership and decision-making abilities",
          targetLang
        );
        translations.masterTeamwork = await translateText(
          "Master teamwork and conflict resolution",
          targetLang
        );
        translations.enhanceEmotionalIntelligence = await translateText(
          "Enhance emotional intelligence and adaptability",
          targetLang
        );
        translations.communicationMastery = await translateText(
          "Communication Mastery",
          targetLang
        );
        translations.communicationDescription = await translateText(
          "Master public speaking, written communication, and active listening skills.",
          targetLang
        );
        translations.teamworkCollaboration = await translateText(
          "Teamwork & Collaboration",
          targetLang
        );
        translations.teamworkDescription = await translateText(
          "Excel in team environments with conflict resolution and cross-cultural skills.",
          targetLang
        );
        translations.leadershipInfluence = await translateText(
          "Leadership & Influence",
          targetLang
        );
        translations.leadershipDescription = await translateText(
          "Build leadership capabilities, decision-making, and strategic thinking skills.",
          targetLang
        );
        translations.personalExcellence = await translateText(
          "Personal Excellence",
          targetLang
        );
        translations.personalExcellenceDescription = await translateText(
          "Develop emotional intelligence, time management, and adaptability.",
          targetLang
        );
        translations.more = await translateText("more", targetLang);
        translations.applyToOurPrograms = await translateText(
          "Apply to Our Programs",
          targetLang
        );
        translations.freeApplicationPrograms = await translateText(
          "Free Application Programs",
          targetLang
        );
        translations.applicationProgramsDescription = await translateText(
          "All our soft skills programs are completely free. Apply now to join our next cohort and unlock your full potential.",
          targetLang
        );
        translations.free = await translateText("FREE", targetLang);
        translations.starts = await translateText("Starts:", targetLang);
        translations.applyNow = await translateText("Apply Now", targetLang);
        translations.noApplicationProgramsAvailable = await translateText(
          "No application programs available at the moment. Please check back later.",
          targetLang
        );
        translations.fromLearnerToDigitalInnovator = await translateText(
          "From Learner to Digital Innovator",
          targetLang
        );
        translations.realSuccessStories = await translateText(
          "Real Success Stories from Our Community",
          targetLang
        );
        translations.successStoriesDescription = await translateText(
          "Meet the innovative entrepreneurs who have grown through our digital skills program and are now transforming industries and improving lives across Ethiopia.",
          targetLang
        );
        translations.viewAllSuccessStories = await translateText(
          "View All Success Stories",
          targetLang
        );
        // Fallback stats
        translations.studentsTrained = await translateText(
          "Students Trained",
          targetLang
        );
        translations.confidenceIncrease = await translateText(
          "Confidence Increase",
          targetLang
        );
        translations.workshopsDelivered = await translateText(
          "Workshops Delivered",
          targetLang
        );
        translations.partnerOrganizations = await translateText(
          "Partner Organizations",
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
  }, [
    selectedLanguage,
    heroContent,
    impactStats,
    programs,
    applicationPrograms,
    featuredSuccessStories,
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
  const displayHeroTitle = getTranslated("heroTitle", heroContent?.title || "");
  const displayHeroDescription = getTranslated(
    "heroDescription",
    heroContent?.description || ""
  );
  const displayStats =
    translatedContent.statistics && selectedLanguage !== "en"
      ? translatedContent.statistics
      : impactStats;
  const displayPrograms =
    translatedContent.programs && selectedLanguage !== "en"
      ? programs.map((program, index) => ({
          ...program,
          title: translatedContent.programs![index]?.title || program.title,
          description:
            translatedContent.programs![index]?.description ||
            program.description,
          duration:
            translatedContent.programs![index]?.duration || program.duration,
          level: translatedContent.programs![index]?.level || program.level,
          skills: translatedContent.programs![index]?.skills || program.skills,
          topics: translatedContent.programs![index]?.topics || program.topics,
        }))
      : programs;
  const displayApplicationPrograms =
    translatedContent.applicationPrograms && selectedLanguage !== "en"
      ? applicationPrograms.map((program, index) => ({
          ...program,
          title:
            translatedContent.applicationPrograms![index]?.title ||
            program.title,
          description:
            translatedContent.applicationPrograms![index]?.description ||
            program.description,
          status:
            translatedContent.applicationPrograms![index]?.status ||
            program.status,
        }))
      : applicationPrograms;
  const displaySuccessStories =
    translatedContent.successStories && selectedLanguage !== "en"
      ? featuredSuccessStories.map((story, index) => ({
          ...story,
          category:
            translatedContent.successStories![index]?.category ||
            story.category,
          licenseStatus:
            translatedContent.successStories![index]?.licenseStatus ||
            story.licenseStatus,
        }))
      : featuredSuccessStories;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white py-10">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
          <div className="relative max-w-6xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center">
                <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                  <Sparkles className="h-3 w-3 mr-1.5" />
                  {getTranslatedText(
                    "entrepreneurshipIncubation",
                    "Entrepreneurship & Incubation"
                  )}
                </Badge>
              </div>
              {displayHeroTitle ? (
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  {displayHeroTitle}
                </h1>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-cyan-100/80">
                    Hero content will be displayed here once it is added.
                  </p>
                </div>
              )}
              {displayHeroDescription && (
                <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                  {displayHeroDescription}
                </p>
              )}
            </div>
          </div>
          <br />
          <br />
          <br />
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
            <Card className="text-center border border-white/10 bg-white/10 backdrop-blur-md rounded-xl">
              <CardContent className="pt-8 pb-8 px-4">
                <p className="text-muted-foreground">
                  Impact statistics will be displayed here once they are added.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Badge
                className="mb-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold
                 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white
                 rounded-full shadow-md"
              >
                <Brain className="h-3 w-3" />
                {getTranslatedText(
                  "aboutOurSoftSkillsProgram",
                  "About Our Soft Skills Program"
                )}
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
              {getTranslatedText(
                "unlockingPotentialBeyondTheClassroom",
                "Unlocking Potential Beyond the Classroom"
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              {getTranslatedText(
                "aboutDescription",
                "At STEMpower, we believe success isn't just about technical know-how—it's also about communication, teamwork, leadership, and problem-solving. Our soft skills programs equip students and young innovators with the interpersonal and professional abilities they need to thrive in any environment."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/ethiopian-students-soft-skills-workshop-teamwork.jpg"
                alt="Students in soft skills workshop"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {getTranslatedText(
                  "whySoftSkillsMatter",
                  "Why Soft Skills Matter"
                )}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {getTranslatedText(
                  "whySoftSkillsDescription",
                  "Through interactive workshops, mentorship, and real-world scenarios, participants gain the confidence to lead projects, navigate challenges, and turn their ideas into meaningful impact."
                )}
              </p>
              <ul className="space-y-3">
                {[
                  getTranslatedText(
                    "buildConfidence",
                    "Build confidence in communication and presentation"
                  ),
                  getTranslatedText(
                    "developLeadership",
                    "Develop leadership and decision-making abilities"
                  ),
                  getTranslatedText(
                    "masterTeamwork",
                    "Master teamwork and conflict resolution"
                  ),
                  getTranslatedText(
                    "enhanceEmotionalIntelligence",
                    "Enhance emotional intelligence and adaptability"
                  ),
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#367375] shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Soft Skills Programs */}
          {displayPrograms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {displayPrograms.map((program) => {
                const ProgramIcon =
                  programIconMap[program.icon as keyof typeof programIconMap] ||
                  MessageSquare;
                return (
                  <Card
                    key={program.id}
                    className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2"
                  >
                    <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-[#367375] to-[#24C3BC]" />
                    <CardContent className="pt-8 pb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`w-14 h-14 ${getIconColorClass(
                            program.iconColor || "teal"
                          )} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}
                        >
                          <ProgramIcon className="h-7 w-7 text-white" />
                        </div>
                        {program.projectCount && (
                          <Badge className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {program.projectCount}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {program.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        {program.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{program.duration}</span>
                          </div>
                        )}
                        {program.level && (
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{program.level}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {program.description}
                      </p>
                      {(program.skills || program.topics) &&
                        (program.skills || program.topics).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {(program.skills || program.topics)
                              .slice(0, 3)
                              .map((skill: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {(program.skills || program.topics).length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{(program.skills || program.topics).length - 3}{" "}
                                {getTranslatedText("more", "more")}
                              </Badge>
                            )}
                          </div>
                        )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="mb-12 border-2">
              <CardContent className="pt-12 pb-12 px-6 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">
                  Soft skills programs will be displayed here once they are
                  added.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        <section
          id="application-programs"
          className="bg-linear-to-br from-slate-50 to-emerald-50/50 py-16"
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <Badge
                  className="mb-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold
                   bg-linear-to-br from-[#367375] to-[#24C3BC] text-white
                   rounded-full shadow-md"
                >
                  <Calendar className="h-3 w-3" />
                  {getTranslatedText(
                    "applyToOurPrograms",
                    "Apply to Our Programs"
                  )}
                </Badge>
              </div>
              <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
                {getTranslatedText(
                  "freeApplicationPrograms",
                  "Free Application Programs"
                )}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
                {getTranslatedText(
                  "applicationProgramsDescription",
                  "All our soft skills programs are completely free. Apply now to join our next cohort and unlock your full potential."
                )}
              </p>
            </div>

            {displayApplicationPrograms.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {displayApplicationPrograms.map(
                  (program: ApplicationProgram, index: number) => (
                    console.log(program.googleFormUrl, "line 925"),
                    (
                      <Card
                        key={index}
                        className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2"
                      >
                        {program.image ? (
                          <div className="relative h-48">
                            <Image
                              src={program.image}
                              alt={program.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-linear-to-br from-[#367375] to-[#24C3BC] text-white border-[#367375]">
                                {program.status}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="relative h-48 bg-linear-to-br from-[#367375] to-[#24C3BC] flex items-center justify-center">
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-white text-[#367375] border-white">
                                {program.status}
                              </Badge>
                            </div>
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle className="text-xl text-balance">
                            {program.title}
                          </CardTitle>
                          <CardDescription>
                            <div className="flex items-center gap-4 text-sm mt-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4 text-[#367375]" />
                                <span>{program.duration}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className="border-[#367375] text-[#367375] bg-[#367375]/10"
                              >
                                {getTranslatedText("free", "FREE")}
                              </Badge>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-muted-foreground leading-relaxed text-sm">
                            {program.description}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4 text-[#367375]" />
                              <span>
                                {getTranslatedText("starts", "Starts:")}{" "}
                                {program.startDate}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4 text-[#367375]" />
                              <span className="text-xs">{program.email}</span>
                            </div>
                          </div>
                          {program.googleFormUrl ? (
                            <Button
                              className="w-full bg-linear-to-r from-[#367375] to-[#24C3BC] text-white"
                              asChild
                            >
                              <a
                                href={
                                  program.googleFormUrl.startsWith("http://") ||
                                  program.googleFormUrl.startsWith("https://")
                                    ? program.googleFormUrl
                                    : `https://${program.googleFormUrl}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                {getTranslatedText("applyNow", "Apply Now")}
                              </a>
                            </Button>
                          ) : (
                            <Button
                              className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                              disabled
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              {getTranslatedText("applyNow", "Apply Now")}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    )
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {getTranslatedText(
                    "noApplicationProgramsAvailable",
                    "No application programs available at the moment. Please check back later."
                  )}
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Badge
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold
                   bg-linear-to-br from-[#367375] to-[#24C3BC] text-white
                   rounded-full shadow-md"
              >
                <Award className="w-4 h-4" />
                {getTranslatedText(
                  "fromLearnerToDigitalInnovator",
                  "From Learner to Digital Innovator"
                )}
              </Badge>
            </div>
            <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
              {getTranslatedText(
                "realSuccessStories",
                "Real Success Stories from Our Community"
              )}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty">
              {getTranslatedText(
                "successStoriesDescription",
                "Meet the innovative entrepreneurs who have grown through our digital skills program and are now transforming industries and improving lives across Ethiopia."
              )}
            </p>
          </div>

          {/* Featured Businesses */}
          {displaySuccessStories.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8">
              {displaySuccessStories.map((business) => (
                <Card
                  key={business.id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border overflow-hidden"
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="w-7 h-7 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <Building2 className="h-3.5 w-3.5 text-white" />
                      </div>
                      {business.licenseStatus && (
                        <Badge className="bg-linear-to-br from-[#367375] to-[#24C3BC] text-white text-[9px] px-1.5 py-0">
                          {business.licenseStatus}
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xs font-bold text-gray-900 mb-1.5 line-clamp-2 leading-tight min-h-[2rem]">
                      {business.name}
                    </h3>

                    {business.category && (
                      <Badge
                        className={`${
                          sectorColors[business.category] ||
                          "bg-gray-100 text-gray-700"
                        } mb-1 text-[9px] font-medium px-1.5 py-0`}
                      >
                        <Tag className="h-2 w-2 mr-0.5" />
                        {business.category}
                      </Badge>
                    )}

                    <div className="space-y-1 mb-1.5 pt-1.5 border-t">
                      {business.contactPerson && (
                        <div className="flex items-start gap-1">
                          <Users className="h-2.5 w-2.5 text-[#367375] shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[9px] text-muted-foreground line-clamp-2 leading-snug">
                              {business.contactPerson}
                            </p>
                          </div>
                        </div>
                      )}

                      {business.phone && (
                        <div className="flex items-start gap-1">
                          <Phone className="h-2.5 w-2.5 text-[#367375] shrink-0 mt-0.5" />
                          <a
                            href={`tel:${business.phone}`}
                            className="text-[9px] text-muted-foreground hover:text-[#367375] transition-colors line-clamp-1"
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
          ) : (
            <Card className="mb-8 border-2">
              <CardContent className="pt-12 pb-12 px-6 text-center">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg">
                  Success stories will be displayed here once they are added.
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
