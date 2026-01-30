"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { TestimonySection } from "@/components/testimony-section";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/lib/app-context";
import {
  Briefcase,
  ClipboardList,
  Eye,
  Heart,
  Lightbulb,
  Rocket,
  Settings,
  Sparkles,
  Target
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";

const aboutStaticText = {
  en: {
    loading: "Loading...",
    loadingMap: "Loading map...",
    heroTitleFallback: "Title has not been added yet.",
    heroDescriptionFallback: "Description has not been added yet.",
    heroImageFallback: "Hero image has not been added yet.",
    heroStatisticLabel: "STEM Centers",
    heroAlt: "Ethiopian students engaged in hands-on STEM learning",
    whoWeAreAlt: "Who We Are",
    whoWeAreTitleFallback: "Section title has not been added yet.",
    whoWeAreDescriptionFallback:
      "Content for this section has not been added yet.",
    whoWeAreImageFallback: "Image for this section has not been added yet.",
    foundationBadge: "Our Foundation",
    foundationHeading: "Our Vision, Mission & Core Values",
    foundationDescription:
      "The guiding principles that drive our commitment to transforming STEM education in Ethiopia",
    visionHeading: "Vision",
    visionFallback: "Vision content has not been added yet.",
    missionHeading: "Mission",
    missionFallback: "Mission content has not been added yet.",
    valuesHeading: "Core Values",
    valuesFallback: "Core values have not been added yet.",
    ecosystemBadge: "STEMpower Ecosystem",
    ecosystemHeading: "Empowering Through Five Steps",
    ecosystemDescription:
      "A structured journey from education to innovation, entrepreneurship, and impact.",
  },
  am: {
    loading: "በመጫን ላይ...",
    loadingMap: "ካርታን በመጫን ላይ...",
    heroTitleFallback: "አርእስት እስካሁን አልተጨመረም።",
    heroDescriptionFallback: "መግለጫ እስካሁን አልተጨመረም።",
    heroImageFallback: "የላይኛው ምስል እስካሁን አልተጨመረም።",
    heroStatisticLabel: "የስቴም ማእከላት",
    heroAlt: "በተግባራዊ የስቴም ትምህርት የተቀላቀሉ የኢትዮጵያ ተማሪዎች",
    whoWeAreAlt: "ማን ነን",
    whoWeAreTitleFallback: "የክፍሉ አርእስት እስካሁን አልተጨመረም።",
    whoWeAreDescriptionFallback: "የዚህ ክፍል ይዘት እስካሁን አልተጨመረም።",
    whoWeAreImageFallback: "ለዚህ ክፍል ምስል እስካሁን አልተጨመረም።",
    foundationBadge: "መሠረታችን",
    foundationHeading: "የእኛ ራዕይ፣ ተልዕኮ እና ዋና እሴቶች",
    foundationDescription: "በኢትዮጵያ የስቴም ትምህርትን ለመቀየር የምንገዛበት መሪ መርሆ።",
    visionHeading: "ራዕይ",
    visionFallback: "የራዕይ ይዘት እስካሁን አልተጨመረም።",
    missionHeading: "ተልዕኮ",
    missionFallback: "የተልዕኮ ይዘት እስካሁን አልተጨመረም።",
    valuesHeading: "ዋና እሴቶች",
    valuesFallback: "ዋና እሴቶች እስካሁን አልተጨመሩም።",
    ecosystemBadge: "የስቴምፓወር ኢኮሲስተም",
    ecosystemHeading: "በአምስት ደረጃዎች ማበረታቻ",
    ecosystemDescription: "ከትምህርት እስከ ፈጠራ፣ ዘመናዊ ኢንቨስትመንት እና ተፅዕኖ ያደራጀ ጉዞ።",
  },
};

const aboutEcosystemSteps = {
  education: {
    title: {
      en: "STEM Education",
      am: "የስቴም ትምህርት",
    },
    items: [
      { en: "STEM Center establishment", am: "የስቴም ማእከል መቋቋም" },
      { en: "STEM Lab Setup", am: "የስቴም ላብ ማዘጋጀት" },
      { en: "Mobile STEM Lab", am: "እንቅስቃሴ ያለው የስቴም ላብ" },
      {
        en: "National Science & Engineering Fairs",
        am: "ብሔራዊ የሳይንስ እና የኢንጂነሪንግ ትርዒቶች",
      },
      {
        en: "STEM Educator capacity building",
        am: "የስቴም አስተማሪዎች አቅም መጠን ማጠናከር",
      },
      { en: "Science Shared Campus", am: "የሳይንስ የተጋራ ካምፓስ" },
      { en: "University STEM outreach", am: "ዩኒቨርሲቲ የስቴም ውጭ ተግባር" },
      { en: "Girls in STEM", am: "በስቴም ውስጥ ሴቶች" },
      { en: "Inclusive STEM education", am: "አካባቢያዊ የሆነ የስቴም ትምህርት" },
      { en: "STEM TV", am: "የስቴም ቲቪ" },
    ],
  },
  innovation: {
    title: {
      en: "Innovation",
      am: "ፈጠራ",
    },
    items: [
      { en: "Technical Skill training", am: "ቴክኒክ ችሎታ ስልጠና" },
      { en: "Idea Generation Advice", am: "የሀሳብ ፈጠራ ምክር" },
      {
        en: "Concept & Design Development",
        am: "ግንዛቤ እና ዲዛይን ልማት",
      },
      {
        en: "Prototyping & Market Testing",
        am: "ፕሮቶታይፕ እና የገበያ ሙከራ",
      },
      { en: "Workspace & Resources", am: "የስራ ቦታ እና ሀብቶች" },
      { en: "IP registration support", am: "የኢፒ ምዝገባ ድጋፍ" },
    ],
  },
  incubation: {
    title: {
      en: "Incubation & Acceleration",
      am: "ኢንኩቤሽን እና ኤክሰለሬሽን",
    },
    items: [
      { en: "Idea Refinement support", am: "የሀሳብ ማሻሻያ ድጋፍ" },
      { en: "Mentorship and coaching", am: "መምሪያ እና አሰልጣኝነት" },
      { en: "MVP development", am: "የMVP ልማት" },
      { en: "FabLab resources", am: "የፋብላብ ሀብቶች" },
      { en: "Networking opportunities", am: "የኔትዎርክ እድሎች" },
    ],
  },
  bds: {
    title: {
      en: "BDS Support",
      am: "የBDS ድጋፍ",
    },
    items: [
      { en: "Entrepreneurship Training", am: "የድርጅት መጀመሪያ ስልጠና" },
      { en: "21st-Century Skills Training", am: "የ21ኛው ክፍለ ዘመን ችሎታዎች ስልጠና" },
      { en: "Financial Literacy", am: "የፋይናንስ ንባብ ችሎታ" },
      { en: "Business Mentorship", am: "የንግድ መምሪያ" },
      { en: "Market Access", am: "የገበያ መድረሻ" },
      { en: "Access to Finance", am: "ወደ ፋይናንስ መዳረሻ" },
      { en: "Regulatory Support", am: "የህጋዊ ደጋፊነት" },
      { en: "Monitoring & Evaluation", am: "ክትትል እና ግምገማ" },
    ],
  },
  jobs: {
    title: {
      en: "Job & Wealth Creation",
      am: "ሥራ እና ባለጠግነት ፍጠራ",
    },
    items: [
      { en: "Finance for Expansion", am: "ለስፋት ፋይናንስ" },
      { en: "Market Expansion", am: "የገበያ ስፋት" },
      { en: "Job Creation", am: "የሥራ ፍጠር" },
      { en: "Value Chain Integration", am: "የዋጋ ሰንሰለት ማዋሃድ" },
      { en: "Sustainability & Impact", am: "ጽኑ ልማት እና ተፅዕኖ" },
      { en: "Wealth Creation", am: "የባለጠግነት ፍጠር" },
      { en: "Scaling via Partnerships", am: "በአጋርነት ስፋት ማሳደግ" },
    ],
  },
};

type AboutLanguage = keyof typeof aboutStaticText;
type AboutStaticKey = keyof typeof aboutStaticText.en;

const getAboutStatic = (lang: AboutLanguage, key: AboutStaticKey) =>
  aboutStaticText[lang]?.[key] ?? aboutStaticText.en[key];

const MapFallback = () => {
  // Use state with default "en" to match server render and prevent hydration mismatch
  const [lang, setLang] = useState<AboutLanguage>("en");
  const { selectedLanguage } = useApp();

  // Update language after mount to avoid hydration mismatch
  useEffect(() => {
    setLang(selectedLanguage === "am" ? "am" : "en");
  }, [selectedLanguage]);

  const message = getAboutStatic(lang, "loadingMap");

  return (
    <section className="py-16 md:py-24 bg-linear-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="w-full h-96 md:h-[600px] bg-slate-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#367375] mx-auto"></div>
                <p className="mt-4 text-muted-foreground">{message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Dynamically import the map component with SSR disabled since Leaflet requires window
const EthiopiaStemMap = dynamic(
  () =>
    import("@/components/ethiopia-stem-map").then((mod) => ({
      default: mod.EthiopiaStemMap,
    })),
  {
    ssr: false,
    loading: () => <MapFallback />,
  }
);

export default function MissionVisionValuesPage() {
  const gradientTextClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";
  const gradientButtonClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all";

  // Use global language state from header
  const { selectedLanguage } = useApp();
  const lang: AboutLanguage = selectedLanguage === "am" ? "am" : "en";
  const translateStatic = (key: AboutStaticKey) => getAboutStatic(lang, key);

  const getStepItems = (key: keyof typeof aboutEcosystemSteps) =>
    aboutEcosystemSteps[key].items.map(
      (item) => item[lang as AboutLanguage] ?? item.en
    );

  const ecosystemSteps = [
    {
      title:
        aboutEcosystemSteps.education.title[lang] ??
        aboutEcosystemSteps.education.title.en,
      icon: <ClipboardList className="w-10 h-10 text-white" />,
      items: getStepItems("education"),
    },
    {
      title:
        aboutEcosystemSteps.innovation.title[lang] ??
        aboutEcosystemSteps.innovation.title.en,
      icon: <Lightbulb className="w-10 h-10 text-white" />,
      items: getStepItems("innovation"),
    },
    {
      title:
        aboutEcosystemSteps.incubation.title[lang] ??
        aboutEcosystemSteps.incubation.title.en,
      icon: <Rocket className="w-10 h-10 text-white" />,
      items: getStepItems("incubation"),
    },
    {
      title:
        aboutEcosystemSteps.bds.title[lang] ?? aboutEcosystemSteps.bds.title.en,
      icon: <Settings className="w-10 h-10 text-white" />,
      items: getStepItems("bds"),
    },
    {
      title:
        aboutEcosystemSteps.jobs.title[lang] ??
        aboutEcosystemSteps.jobs.title.en,
      icon: <Briefcase className="w-10 h-10 text-white" />,
      items: getStepItems("jobs"),
    },
  ];

  const [stemCenterData, setStemCenterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [testimonials, setTestimonials] = useState<any[]>([]);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    whoWeAreBadge?: string;
    whoWeAreTitle?: string;
    whoWeAreDescription?: string;
    mission?: string;
    vision?: string;
    values?: Array<{ title: string; description: string }>;
    testimonials?: Array<{ name: string; role: string; message: string }>;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stem center data (matches admin save endpoint)
        const stemCenterResponse = await fetch("/api/about/stem-centers");
        if (stemCenterResponse.ok) {
          const data = await stemCenterResponse.json();
          if (data && data.length > 0) {
            setStemCenterData(data[0]); // Get first (active) record
            console.log(data[0], "line 100");
          }
        } else {
          console.error(
            "Failed to fetch stem center data:",
            stemCenterResponse.status
          );
        }

        // Fetch testimonials separately
        const testimonialsResponse = await fetch("/api/about/testimonials");
        if (testimonialsResponse.ok) {
          const testimonialsData = await testimonialsResponse.json();
          setTestimonials(
            Array.isArray(testimonialsData) ? testimonialsData : []
          );
        } else {
          console.error(
            "Failed to fetch testimonials:",
            testimonialsResponse.status
          );
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        // Keep loading false even on error to show fallback content
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Use API data only - no fallbacks
  const heroBadge = stemCenterData?.badge;
  const heroTitle = stemCenterData?.title;
  const heroDescription = stemCenterData?.description;
  const heroImage = stemCenterData?.image;
  const heroStatistic = stemCenterData?.statistic;
  const mission = stemCenterData?.mission;
  const vision = stemCenterData?.vision;
  // Values from API only
  const values = Array.isArray(stemCenterData?.values)
    ? stemCenterData.values
    : [];

  // Who We Are section data from API
  const whoWeAreBadge = stemCenterData?.whoWeAre?.badge;
  const whoWeAreTitle = stemCenterData?.whoWeAre?.title;
  const whoWeAreDescription = stemCenterData?.whoWeAre?.description;
  const whoWeAreImage = stemCenterData?.whoWeAre?.image;

  console.log(stemCenterData);

  // Testimonials are fetched separately and stored in state (see useEffect above)

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

      if (!stemCenterData || loading) return;

      setTranslating(true);
      try {
        const translations: any = {};

        // Get original values from API only
        const originalHeroBadge = stemCenterData?.badge;
        const originalHeroTitle = stemCenterData?.title;
        const originalHeroDescription = stemCenterData?.description;
        const originalWhoWeAreBadge = stemCenterData?.whoWeAre?.badge;
        const originalWhoWeAreTitle = stemCenterData?.whoWeAre?.title;
        const originalWhoWeAreDescription =
          stemCenterData?.whoWeAre?.description;
        const originalMission = stemCenterData?.mission;
        const originalVision = stemCenterData?.vision;
        const originalValues = Array.isArray(stemCenterData?.values)
          ? stemCenterData.values
          : [];

        // Translate hero section
        if (originalHeroBadge)
          translations.heroBadge = await translateText(
            originalHeroBadge,
            targetLang
          );
        if (originalHeroTitle)
          translations.heroTitle = await translateText(
            originalHeroTitle,
            targetLang
          );
        if (originalHeroDescription)
          translations.heroDescription = await translateText(
            originalHeroDescription,
            targetLang
          );

        // Translate Who We Are section
        if (originalWhoWeAreBadge)
          translations.whoWeAreBadge = await translateText(
            originalWhoWeAreBadge,
            targetLang
          );
        if (originalWhoWeAreTitle)
          translations.whoWeAreTitle = await translateText(
            originalWhoWeAreTitle,
            targetLang
          );
        if (originalWhoWeAreDescription)
          translations.whoWeAreDescription = await translateText(
            originalWhoWeAreDescription,
            targetLang
          );

        // Translate mission and vision
        if (originalMission)
          translations.mission = await translateText(
            originalMission,
            targetLang
          );
        if (originalVision)
          translations.vision = await translateText(originalVision, targetLang);

        // Translate values
        if (originalValues && originalValues.length > 0) {
          translations.values = await Promise.all(
            originalValues.map(async (value: any) => ({
              title: await translateText(value.title || "", targetLang),
              description: await translateText(
                value.description || "",
                targetLang
              ),
            }))
          );
        }

        // Translate testimonials
        if (testimonials && testimonials.length > 0) {
          translations.testimonials = await Promise.all(
            testimonials.map(async (testimonial: any) => ({
              ...testimonial,
              name: await translateText(testimonial.name || "", targetLang),
              role: await translateText(testimonial.role || "", targetLang),
              message: await translateText(
                testimonial.message || "",
                targetLang
              ),
            }))
          );
        }

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    if (stemCenterData && !loading) {
      translateDynamicContent(selectedLanguage);
    }
  }, [selectedLanguage, stemCenterData, loading, testimonials]);

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
  const displayHeroBadge = getTranslated("heroBadge", heroBadge);
  const displayHeroTitle = getTranslated("heroTitle", heroTitle);
  const displayHeroDescription = getTranslated(
    "heroDescription",
    heroDescription
  );
  const displayWhoWeAreBadge = getTranslated("whoWeAreBadge", whoWeAreBadge);
  const displayWhoWeAreTitle = getTranslated("whoWeAreTitle", whoWeAreTitle);
  const displayWhoWeAreDescription = getTranslated(
    "whoWeAreDescription",
    whoWeAreDescription
  );
  const displayMission = getTranslated("mission", mission);
  const displayVision = getTranslated("vision", vision);
  const displayValues =
    translatedContent.values && selectedLanguage !== "en"
      ? translatedContent.values
      : values;
  const displayTestimonials =
    translatedContent.testimonials && selectedLanguage !== "en"
      ? translatedContent.testimonials
      : testimonials;

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#367375] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
              {translateStatic("loading")}
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] via-teal-600 z-10">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 py-15 md:py-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                {displayHeroBadge && (
                  <div className="inline-flex items-center gap-2 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-base font-medium mb-6">
                    <Sparkles className="h-5 w-5" />
                    {displayHeroBadge}
                  </div>
                )}
                {displayHeroTitle ? (
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight">
                    {displayHeroTitle}
                  </h1>
                ) : (
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance leading-tight italic opacity-75">
                    {translateStatic("heroTitleFallback")}
                  </h1>
                )}
                {displayHeroDescription ? (
                  <p className="text-xl text-emerald-50 mb-8 text-pretty leading-relaxed">
                    {displayHeroDescription}
                  </p>
                ) : (
                  <p className="text-xl text-emerald-50 mb-8 text-pretty leading-relaxed italic opacity-75">
                    {translateStatic("heroDescriptionFallback")}
                  </p>
                )}
              </div>
              <div className="order-1 lg:order-2 flex justify-center relative">
                {heroImage ? (
                  <>
                    <div className="relative w-full sm:w-[90%] md:w-[95%] lg:w-full aspect-5/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                      <Image
                        src={heroImage}
                        alt={translateStatic("heroAlt")}
                        fill
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Floating STEM Center Card */}
                    {heroStatistic && (
                      <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 sm:p-4 border border-emerald-100">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {translateStatic("heroStatisticLabel")}
                            </div>
                            <div className="font-bold text-xl sm:text-2xl text-emerald-600">
                              {heroStatistic}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative w-full sm:w-[90%] md:w-[95%] lg:w-full aspect-5/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white/10 flex items-center justify-center">
                    <p className="text-white italic opacity-75">
                      {translateStatic("heroImageFallback")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />
          <br />
          <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-white to-transparent pointer-events-none" />
        </section>
        <section className="relative py-16 md:py-24 bg-white z-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                {displayWhoWeAreBadge && (
                  <div
                    className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-linear-to-br from-[#367375] to-[#24C3BC]"
                  >
                    <Sparkles className="h-4 w-4 " />
                    {displayWhoWeAreBadge}
                  </div>
                )}
                {displayWhoWeAreTitle ? (
                  <h2
                    className={`text-4xl md:text-4xl mb-6 ${gradientTextClass} text-balance`}
                  >
                    {displayWhoWeAreTitle}
                  </h2>
                ) : (
                  <h2
                    className={`text-4xl md:text-4xl mb-6 ${gradientTextClass} text-balance italic opacity-75`}
                  >
                    {translateStatic("whoWeAreTitleFallback")}
                  </h2>
                )}
                <div className="w-24 h-1.5 mx-auto rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] text-white" />
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  {displayWhoWeAreDescription ? (
                    <div className="text-lg leading-relaxed text-foreground whitespace-pre-line">
                      {displayWhoWeAreDescription}
                    </div>
                  ) : (
                    <div className="text-lg leading-relaxed text-muted-foreground italic">
                      {translateStatic("whoWeAreDescriptionFallback")}
                    </div>
                  )}
                </div>

                <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  {whoWeAreImage ? (
                    <Image
                      src={whoWeAreImage}
                      alt={whoWeAreTitle || translateStatic("whoWeAreAlt")}
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <p className="text-muted-foreground italic">
                        {translateStatic("whoWeAreImageFallback")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section
          id="mission-section"
          className="py-16 md:py-24 bg-linear-to-b from-white to-slate-50"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-linear-to-br from-[#367375] to-[#24C3BC]">
                  <Sparkles className="h-4 w-4" />
                  {translateStatic("foundationBadge")}
                </div>
                <h2
                  className={`text-4xl md:text-4xl mb-6 ${gradientTextClass} text-balance`}
                >
                  {translateStatic("foundationHeading")}
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                  {translateStatic("foundationDescription")}
                </p>
                <div className="w-24 h-1.5 mx-auto rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] mt-6" />
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {/* Vision */}
                <Card className="group border-2 border-teal-100 hover:border-teal-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-linear-to-br from-white via-teal-50/30 to-white overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-br from-teal-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-8 relative">
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-[#367375] to-[#24C3BC] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Eye className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
                      {translateStatic("visionHeading")}
                    </h3>
                    {displayVision ? (
                      <p className="text-muted-foreground leading-relaxed text-center">
                        {displayVision}
                      </p>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed text-center italic">
                        {translateStatic("visionFallback")}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Mission */}
                <Card className="group border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-linear-to-br from-white via-emerald-50/30 to-white overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-br from-emerald-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-8 relative">
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
                        <Target className="w-12 h-12 text-white " />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
                      {translateStatic("missionHeading")}
                    </h3>
                    {displayMission ? (
                      <p className="text-muted-foreground leading-relaxed text-center">
                        {displayMission}
                      </p>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed text-center italic">
                        {translateStatic("missionFallback")}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Values */}
                <Card className="group border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-linear-to-br from-white via-cyan-50/30 to-white overflow-hidden relative">
                  <div className="absolute inset-0 bg-linear-to-br from-cyan-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="p-8 relative">
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-[#367375] to-[#24C3BC] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Heart className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-6 text-center text-foreground">
                      {translateStatic("valuesHeading")}
                    </h3>
                    {displayValues.length > 0 ? (
                      <ul className="space-y-3 text-muted-foreground">
                        {displayValues.map((value: any, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-emerald-600 mr-3 text-2xl font-bold leading-none">
                              •
                            </span>
                            <span className="leading-relaxed pt-0.5">
                              {value.description} {value.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed text-center italic">
                        {translateStatic("valuesFallback")}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        {/* STEMpower Ecosystem */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="h-4 w-4" />
                {translateStatic("ecosystemBadge")}
              </div>
              <h2
                className={`text-4xl md:text-4xl mb-6 ${gradientTextClass} text-balance`}
              >
                {translateStatic("ecosystemHeading")}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {translateStatic("ecosystemDescription")}
              </p>
              <div className="w-24 h-1.5 mx-auto rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] mt-6" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-2 md:px-4">
              {ecosystemSteps.map((step, index) => (
                <div
                  key={index}
                  className="group relative bg-linear-to-br from-[#367375] to-[#24C3BC] text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex justify-center mb-4">{step.icon}</div>
                  <h3 className="text-lg font-bold text-center">
                    {step.title}
                  </h3>

                  {/* Popup */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 w-72 bg-white text-foreground text-sm rounded-xl shadow-xl p-4">
                      <h4 className="text-base font-semibold mb-2 text-center text-[#367375]">
                        {step.title}
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-left text-muted-foreground">
                        {step.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <EthiopiaStemMap />
        <TestimonySection testimonials={displayTestimonials} />
      </div>

      <Footer />
    </>
  );
}
