"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ChevronDown,
  Languages,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useApp } from "@/lib/app-context";
import type { HeaderLink } from "@/lib/api-types";

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileItems, setOpenMobileItems] = useState<Set<string>>(
    new Set()
  );
  const {
    selectedLanguage,
    setSelectedLanguage,
    isSpeaking,
    handleVoiceReader,
  } = useApp();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isMobileLanguageDropdownOpen, setIsMobileLanguageDropdownOpen] =
    useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLanguageDropdownRef = useRef<HTMLDivElement>(null);
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<
    Record<string, string>
  >({});

  // Translation helper function
  const translateText = async (
    text: string,
    targetLang: string
  ): Promise<string> => {
    if (!text || targetLang === "en") return text;
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, targetLanguage: targetLang }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.translatedText || text;
      }
    } catch (error) {
      console.error("Translation error:", error);
    }
    return text;
  };

  // Translation effect
  useEffect(() => {
    if (selectedLanguage === "en") {
      setTranslatedContent({});
      return;
    }

    const translateContent = async () => {
      setTranslating(true);
      const translations: Record<string, string> = {};

      try {
        // Main navigation
        translations.home = await translateText("Home", selectedLanguage);
        translations.aboutUs = await translateText(
          "About Us",
          selectedLanguage
        );
        translations.programs = await translateText(
          "Programs",
          selectedLanguage
        );
        translations.latest = await translateText("Latest", selectedLanguage);
        translations.contactUs = await translateText(
          "Contact Us",
          selectedLanguage
        );
        translations.donate = await translateText("Donate", selectedLanguage);

        // About Us submenu
        translations.aboutSTEMPower = await translateText(
          "About STEMPower",
          selectedLanguage
        );
        translations.stempowerMembers = await translateText(
          "STEMPower Members",
          selectedLanguage
        );
        translations.missionVisionValues = await translateText(
          "Mission, Vision, and Core Values",
          selectedLanguage
        );
        translations.meetTheTeam = await translateText(
          "Meet the dedicated team behind STEMpower Ethiopia",
          selectedLanguage
        );

        // Programs submenu
        translations.stemOperations = await translateText(
          "STEM Operations",
          selectedLanguage
        );
        translations.stemCenters = await translateText(
          "STEM Centers",
          selectedLanguage
        );
        translations.stemCentersDesc = await translateText(
          "61 centers across Ethiopia",
          selectedLanguage
        );
        translations.scienceFairs = await translateText(
          "Science Fairs",
          selectedLanguage
        );
        translations.scienceFairsDesc = await translateText(
          "National competitions & exhibitions",
          selectedLanguage
        );
        translations.universitySTEMOutreach = await translateText(
          "University STEM Outreach",
          selectedLanguage
        );
        translations.universityOutreachDesc = await translateText(
          "Higher education partnerships",
          selectedLanguage
        );
        translations.stemTV = await translateText("STEM TV", selectedLanguage);
        translations.stemTVDesc = await translateText(
          "Educational video content",
          selectedLanguage
        );
        translations.fabLab = await translateText("FabLab", selectedLanguage);
        translations.makerSpace = await translateText(
          "Maker Space",
          selectedLanguage
        );
        translations.makerSpaceDesc = await translateText(
          "Creative fabrication labs",
          selectedLanguage
        );
        translations.trainingConsultancy = await translateText(
          "Training & Consultancy",
          selectedLanguage
        );
        translations.trainingConsultancyDesc = await translateText(
          "Professional development services",
          selectedLanguage
        );
        translations.fablabProducts = await translateText(
          "Fablab Products",
          selectedLanguage
        );
        translations.fablabProductsDesc = await translateText(
          "Products and kits",
          selectedLanguage
        );
        translations.fablabServices = await translateText(
          "Fablab services",
          selectedLanguage
        );
        translations.fablabServicesDesc = await translateText(
          "Advanced fabrication equipment",
          selectedLanguage
        );
        translations.entrepreneurshipIncubation = await translateText(
          "Entrepreneurship & Incubation",
          selectedLanguage
        );
        translations.businessDevelopment = await translateText(
          "Business Development Services (BDS)",
          selectedLanguage
        );
        translations.businessDevelopmentDesc = await translateText(
          "Startup support & mentorship",
          selectedLanguage
        );
        translations.incubation = await translateText(
          "Incubation",
          selectedLanguage
        );
        translations.incubationDesc = await translateText(
          "Early-stage business incubation",
          selectedLanguage
        );
        translations.digitalSkills = await translateText(
          "Digital Skills",
          selectedLanguage
        );
        translations.digitalSkillsDesc = await translateText(
          "Technology & digital literacy",
          selectedLanguage
        );
        translations.softSkills = await translateText(
          "Soft Skills",
          selectedLanguage
        );
        translations.softSkillsDesc = await translateText(
          "Leadership & communication training",
          selectedLanguage
        );

        // Latest submenu
        translations.news = await translateText("News", selectedLanguage);
        translations.newsletter = await translateText(
          "Newsletter",
          selectedLanguage
        );
        translations.newsletterDesc = await translateText(
          "Monthly updates & insights",
          selectedLanguage
        );
        translations.socialMediaPosts = await translateText(
          "Social Media Posts",
          selectedLanguage
        );
        translations.socialMediaPostsDesc = await translateText(
          "Latest social updates",
          selectedLanguage
        );
        translations.othersTalkingAbout = await translateText(
          "Others talking about STEMpower Ethiopia",
          selectedLanguage
        );
        translations.othersTalkingAboutDesc = await translateText(
          "Media coverage & mentions",
          selectedLanguage
        );
        translations.events = await translateText("Events", selectedLanguage);
        translations.eventsDesc = await translateText(
          "Calendar & highlights of upcoming events",
          selectedLanguage
        );
        translations.announcements = await translateText(
          "Announcements",
          selectedLanguage
        );
        translations.announcementsDesc = await translateText(
          "Official updates & opportunities",
          selectedLanguage
        );

        // Mobile menu
        translations.universityOutreach = await translateText(
          "University Outreach",
          selectedLanguage
        );
        translations.businessDevelopmentShort = await translateText(
          "Business Development",
          selectedLanguage
        );

        // Voice reader
        translations.switchLanguage = await translateText(
          "Switch Language",
          selectedLanguage
        );
        translations.stopReading = await translateText(
          "Stop Reading",
          selectedLanguage
        );
        translations.readPage = await translateText(
          "Read Page",
          selectedLanguage
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating header content:", error);
      } finally {
        setTranslating(false);
      }
    };

    translateContent();
  }, [selectedLanguage]);

  const getTranslatedText = (key: string, fallback: string): string => {
    if (selectedLanguage === "en") return fallback;
    return translatedContent[key] || fallback;
  };

  const toggleMobileItem = (id: string) => {
    setOpenMobileItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Permanent navigation structure - these cannot be removed
  const permanentNavItems: Array<{
    id: string;
    label: string;
    url: string;
    order: number;
    children?: Array<{ id: string; label: string; url: string; order: number }>;
  }> = [
    {
      id: "home",
      label: "Home",
      url: "/",
      order: 1,
    },
    {
      id: "about",
      label: "About Us",
      url: "/about",
      order: 2,
      children: [
        {
          id: "about-stempower",
          label: "About STEMPower",
          url: "/about/about-STEMPower",
          order: 1,
        },
        {
          id: "about-members",
          label: "STEMPower Members",
          url: "/about/members",
          order: 2,
        },
      ],
    },
    {
      id: "programs",
      label: "Programs",
      url: "/programs",
      order: 3,
      children: [
        // STEM Operations
        {
          id: "stem-centers",
          label: "STEM Centers",
          url: "/programs/stem-operations/stem-centers",
          order: 1,
        },
        {
          id: "science-fairs",
          label: "Science Fairs",
          url: "/programs/stem-operations/science-fairs",
          order: 2,
        },
        {
          id: "university-outreach",
          label: "University STEM Outreach",
          url: "/programs/stem-operations/university-outreach",
          order: 3,
        },
        {
          id: "stem-tv",
          label: "STEM TV",
          url: "/programs/stem-operations/stem-tv",
          order: 4,
        },
        // FabLab
        {
          id: "maker-space",
          label: "Maker Space",
          url: "/programs/fablab/maker-space",
          order: 5,
        },
        {
          id: "training-consultancy",
          label: "Training & Consultancy",
          url: "/programs/fablab/training-consultancy",
          order: 6,
        },
        {
          id: "fablab-products",
          label: "Fablab Products",
          url: "/programs/fablab/products",
          order: 7,
        },
        {
          id: "fablab-services",
          label: "Fablab services",
          url: "/programs/fablab/services",
          order: 8,
        },
        // Entrepreneurship
        {
          id: "business-development",
          label: "Business Development Services (BDS)",
          url: "/programs/entrepreneurship/business-development",
          order: 9,
        },
        {
          id: "incubation",
          label: "Incubation",
          url: "/programs/entrepreneurship/incubation",
          order: 10,
        },
        {
          id: "digital-skills",
          label: "Digital Skills",
          url: "/programs/entrepreneurship/digital-skills",
          order: 11,
        },
        {
          id: "soft-skills",
          label: "Soft Skills",
          url: "/programs/entrepreneurship/soft-skills",
          order: 12,
        },
      ],
    },
    {
      id: "latest",
      label: "Latest",
      url: "/latest",
      order: 4,
      children: [
        {
          id: "newsletter",
          label: "Newsletter",
          url: "/latest/news/newsletter",
          order: 1,
        },
        {
          id: "social-media",
          label: "Social Media Posts",
          url: "/latest/news/social-media",
          order: 2,
        },
        {
          id: "others-talking",
          label: "Others talking about STEMpower Ethiopia",
          url: "/latest/news/others-talking-about-stempower",
          order: 3,
        },
        { id: "events", label: "Events", url: "/latest/events", order: 4 },
        {
          id: "announcements",
          label: "Announcements",
          url: "/latest/announcements",
          order: 5,
        },
      ],
    },
    {
      id: "contact",
      label: "Contact Us",
      url: "/contact",
      order: 5,
    },
  ];

  // Permanent URLs that should not be replaced
  const permanentUrls = new Set([
    "/",
    "/about",
    "/programs",
    "/latest",
    "/contact",
    "/about/about-STEMPower",
    "/about/members",
    "/programs/stem-operations/stem-centers",
    "/programs/stem-operations/science-fairs",
    "/programs/stem-operations/university-outreach",
    "/programs/stem-operations/stem-tv",
    "/programs/fablab/maker-space",
    "/programs/fablab/training-consultancy",
    "/programs/fablab/products",
    "/programs/fablab/services",
    "/programs/entrepreneurship/business-development",
    "/programs/entrepreneurship/incubation",
    "/programs/entrepreneurship/digital-skills",
    "/programs/entrepreneurship/soft-skills",
    "/latest/news/newsletter",
    "/latest/news/social-media",
    "/latest/news/others-talking-about-stempower",
    "/latest/events",
    "/latest/announcements",
  ]);

  const isAllowedApiUrl = (url: string | undefined) =>
    typeof url === "string" && permanentUrls.has(url);

  const [mergedNavItems, setMergedNavItems] = useState(permanentNavItems);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const response = await fetch("/api/header");
        if (response.ok) {
          const apiItemsRaw: HeaderLink[] = await response.json();
          const apiItems = apiItemsRaw.filter((item) =>
            isAllowedApiUrl(item?.url)
          );

          // Merge API items with permanent items
          const merged = permanentNavItems.map((permanentItem) => {
            // If this is a parent item, merge children from API
            if (permanentItem.children) {
              const permanentChildUrls = new Set(
                permanentItem.children.map((c) => c.url)
              );

              // Find API items that are children of this permanent item
              // (URL starts with parent URL + "/" or matches parent pattern)
              const apiChildren = apiItems
                .filter((apiItem) => {
                  // Check if API item URL is a child of this permanent item
                  if (permanentItem.url === "/") {
                    // For root, only add if it's not a permanent URL and not already a child
                    return (
                      !permanentUrls.has(apiItem.url) &&
                      !permanentChildUrls.has(apiItem.url)
                    );
                  }
                  // For other parents, check if URL starts with parent URL
                  return (
                    apiItem.url.startsWith(permanentItem.url + "/") &&
                    !permanentChildUrls.has(apiItem.url)
                  );
                })
                .map((apiItem) => ({
                  id: apiItem.id,
                  label: apiItem.label,
                  url: apiItem.url,
                  order: apiItem.order || 999, // Default to end if no order
                }));

              return {
                ...permanentItem,
                children: [...permanentItem.children, ...apiChildren].sort(
                  (a, b) => a.order - b.order
                ),
              };
            }

            return permanentItem;
          });

          // Add new top-level API items that don't match any permanent item
          const permanentTopLevelUrls = new Set(
            permanentNavItems.map((item) => item.url)
          );
          const shouldSkipDynamicProgram = (item: any) =>
            typeof item?.url === "string" && item.url.startsWith("/programs/");
          const shouldSkipDynamicLatest = (item: any) =>
            typeof item?.url === "string" && item.url.startsWith("/latest/") && 
            item.url !== "/latest" && item.url !== "/latest/news" && 
            item.url !== "/latest/events" && item.url !== "/latest/announcements";
          const newTopLevelItems = apiItems
            .filter((apiItem) => {
              if (shouldSkipDynamicProgram(apiItem)) return false;
              if (shouldSkipDynamicLatest(apiItem)) return false;
              // Only add if it's not a permanent URL and not a child of any permanent item
              return (
                !permanentTopLevelUrls.has(apiItem.url) &&
                !permanentUrls.has(apiItem.url) &&
                !permanentNavItems.some(
                  (perm) =>
                    perm.url !== "/" && apiItem.url.startsWith(perm.url + "/")
                )
              );
            })
            .map((apiItem) => ({
              id: apiItem.id,
              label: apiItem.label,
              url: apiItem.url,
              order: apiItem.order || 999,
              children: Array.isArray(apiItem.children)
                ? apiItem.children
                    .filter(
                      (child) =>
                        !shouldSkipDynamicProgram(child) &&
                        !shouldSkipDynamicLatest(child) &&
                        isAllowedApiUrl(child?.url)
                    )
                    .map((child) => ({
                      id: child.id,
                      label: child.label,
                      url: child.url,
                      order: child.order || 999,
                    }))
                : [],
            }));

          // Combine and sort by order
          const finalItems = [...merged, ...newTopLevelItems].sort(
            (a, b) => a.order - b.order
          );
          setMergedNavItems(finalItems);
        }
      } catch (error) {
        console.error("Failed to fetch navigation items:", error);
        // Fallback to permanent items only
        setMergedNavItems(permanentNavItems);
      }
    };
    fetchNavItems();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
      if (
        mobileLanguageDropdownRef.current &&
        !mobileLanguageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMobileLanguageDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang: "en" | "am") => {
    setSelectedLanguage(lang);
    setIsLanguageDropdownOpen(false);
    setIsMobileLanguageDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all border-b border-border bg-white/60 backdrop-blur-lg supports-backdrop-filter:bg-white/50">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 pl-10">
            <Image
              src="/stempower_logo.png"
              alt="STEMpower Ethiopia Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-4">
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="space-x-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:scale-105 hover:text-white text-foreground"
                    >
                      {getTranslatedText("home", "Home")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-10 px-4 rounded-lg hover:scale-105 transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white data-[state=open]:bg-linear-to-r data-[state=open]:from-[#367375] data-[state=open]:to-[#24C3BC] data-[state=open]:text-white text-foreground bg-transparent">
                    {getTranslatedText("aboutUs", "About Us")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px]">
                      <Link
                        href="/about/about-STEMPower"
                        className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105 border border-border"
                      >
                        <div className="text-base font-semibold text-primary border-b border-primary/20 pb-1">
                          {getTranslatedText(
                            "aboutSTEMPower",
                            "About STEMPower"
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug opacity-80">
                          {getTranslatedText(
                            "missionVisionValues",
                            "Mission, Vision, and Core Values"
                          )}
                        </p>
                      </Link>
                      <Link
                        href="/about/members"
                        className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105 border border-border"
                      >
                        <div className="text-base font-semibold text-primary border-b border-primary/20 pb-1">
                          {getTranslatedText(
                            "stempowerMembers",
                            "STEMPower Members"
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug opacity-80">
                          {getTranslatedText(
                            "meetTheTeam",
                            "Meet the dedicated team behind STEMpower Ethiopia"
                          )}
                        </p>
                      </Link>
                      {/* Add API children for About Us */}
                      {mergedNavItems
                        .find((item) => item.id === "about")
                        ?.children?.filter(
                          (child) => !permanentUrls.has(child.url)
                        )
                        .map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105 border border-border"
                          >
                            <div className="text-base font-semibold text-primary border-b border-primary/20 pb-1">
                              {child.label}
                            </div>
                          </Link>
                        ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="h-10 px-4 rounded-lg hover:scale-105 transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white data-[state=open]:bg-linear-to-r data-[state=open]:from-[#367375] data-[state=open]:to-[#24C3BC] data-[state=open]:text-white text-foreground bg-transparent"
                    onClick={() => router.push("/programs")}
                  >
                    {getTranslatedText("programs", "Programs")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-4 p-6 md:w-[600px] lg:w-[650px] lg:grid-cols-3">
                      {/* STEM Operations */}
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold text-primary border-b border-primary/20 pb-1">
                          {getTranslatedText(
                            "stemOperations",
                            "STEM Operations"
                          )}
                        </h3>
                        <div className="space-y-1">
                          <Link
                            href="/programs/stem-operations/stem-centers"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText("stemCenters", "STEM Centers")}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "stemCentersDesc",
                                "61 centers across Ethiopia"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/programs/stem-operations/science-fairs"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText(
                                "scienceFairs",
                                "Science Fairs"
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "scienceFairsDesc",
                                "National competitions & exhibitions"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/programs/stem-operations/university-outreach"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText(
                                "universitySTEMOutreach",
                                "University STEM Outreach"
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "universityOutreachDesc",
                                "Higher education partnerships"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/programs/stem-operations/stem-tv"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText("stemTV", "STEM TV")}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "stemTVDesc",
                                "Educational video content"
                              )}
                            </p>
                          </Link>
                        </div>
                      </div>

                      {/* FabLab */}
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold text-primary border-b border-primary/20 pb-1">
                          {getTranslatedText("fabLab", "FabLab")}
                        </h3>
                        <div className="space-y-1">
                          <Link
                            href="/programs/fablab/maker-space"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText("makerSpace", "Maker Space")}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "makerSpaceDesc",
                                "Creative fabrication labs"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/programs/fablab/training-consultancy"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText(
                                "trainingConsultancy",
                                "Training & Consultancy"
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "trainingConsultancyDesc",
                                "Professional development services"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/programs/fablab/products"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText(
                                "fablabProducts",
                                "Fablab Products"
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "fablabProductsDesc",
                                "Products and kits"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/programs/fablab/services"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText(
                                "fablabServices",
                                "Fablab services"
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "fablabServicesDesc",
                                "Advanced fabrication equipment"
                              )}
                            </p>
                          </Link>
                        </div>
                      </div>

                      {/* Entrepreneurship & Incubation */}
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold text-primary border-b border-primary/20 pb-1">
                          {getTranslatedText(
                            "entrepreneurshipIncubation",
                            "Entrepreneurship & Incubation"
                          )}
                        </h3>
                        <div className="space-y-1">
                          <Link
                            href="/programs/entrepreneurship/business-development"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText(
                                "businessDevelopment",
                                "Business Development Services (BDS)"
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "businessDevelopmentDesc",
                                "Startup support & mentorship"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/programs/entrepreneurship/incubation"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText("incubation", "Incubation")}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "incubationDesc",
                                "Early-stage business incubation"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/programs/entrepreneurship/digital-skills"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText(
                                "digitalSkills",
                                "Digital Skills"
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "digitalSkillsDesc",
                                "Technology & digital literacy"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/programs/entrepreneurship/soft-skills"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText("softSkills", "Soft Skills")}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "softSkillsDesc",
                                "Leadership & communication training"
                              )}
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* Add API children for Programs */}
                    {mergedNavItems
                      .find((item) => item.id === "programs")
                      ?.children?.filter(
                        (child) => !permanentUrls.has(child.url)
                      )
                      .map((child) => (
                        <div key={child.id} className="p-2">
                          <Link
                            href={child.url}
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {child.label}
                            </div>
                          </Link>
                        </div>
                      ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="h-10 px-4 rounded-lg hover:scale-105 transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white data-[state=open]:bg-linear-to-r data-[state=open]:from-[#367375] data-[state=open]:to-[#24C3BC] data-[state=open]:text-white text-foreground bg-transparent"
                    onClick={() => router.push("/latest")}
                  >
                    {getTranslatedText("latest", "Latest")}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px] lg:w-[450px] lg:grid-cols-2">
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold text-primary border-b border-primary/20 pb-1">
                          {getTranslatedText("news", "News")}
                        </h3>
                        <div className="space-y-1">
                          <Link
                            href="/latest/news/newsletter"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText("newsletter", "Newsletter")}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "newsletterDesc",
                                "Monthly updates & insights"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/latest/news/social-media"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText(
                                "socialMediaPosts",
                                "Social Media Posts"
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "socialMediaPostsDesc",
                                "Latest social updates"
                              )}
                            </p>
                          </Link>
                          <Link
                            href="/latest/news/others-talking-about-stempower"
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105 border border-border"
                          >
                            <div className="text-sm font-medium leading-none">
                              {getTranslatedText(
                                "othersTalkingAbout",
                                "Others talking about STEMpower Ethiopia"
                              )}
                            </div>
                            <p className="line-clamp-2 text-xs leading-snug opacity-80">
                              {getTranslatedText(
                                "othersTalkingAboutDesc",
                                "Media coverage & mentions"
                              )}
                            </p>
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Link
                          href="/latest/events"
                          className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105 border border-border"
                        >
                          <div className="text-base font-semibold text-primary border-b border-primary/20 pb-1">
                            {getTranslatedText("events", "Events")}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug opacity-80">
                            {getTranslatedText(
                              "eventsDesc",
                              "Calendar & highlights of upcoming events"
                            )}
                          </p>
                        </Link>
                        <Link
                          href="/latest/announcements"
                          className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105 border border-border"
                        >
                          <div className="text-base font-semibold text-primary border-b border-primary/20 pb-1">
                            {getTranslatedText(
                              "announcements",
                              "Announcements"
                            )}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug opacity-80">
                            {getTranslatedText(
                              "announcementsDesc",
                              "Official updates & opportunities"
                            )}
                          </p>
                        </Link>
                      </div>
                      {/* Add API children for Latest */}
                      {mergedNavItems
                        .find((item) => item.id === "latest")
                        ?.children?.filter(
                          (child) => !permanentUrls.has(child.url)
                        )
                        .map((child) => (
                          <Link
                            key={child.id}
                            href={child.url}
                            className="block select-none space-y-1 rounded-lg p-2 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105"
                          >
                            <div className="text-sm font-medium leading-none">
                              {child.label}
                            </div>
                          </Link>
                        ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/contact"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:scale-105 hover:text-white text-foreground"
                    >
                      {getTranslatedText("contactUs", "Contact Us")}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Add new top-level API items */}
                {mergedNavItems
                  .filter(
                    (item) =>
                      ![
                        "home",
                        "about",
                        "programs",
                        "latest",
                        "contact",
                      ].includes(item.id)
                  )
                  .map((item) => (
                    <NavigationMenuItem key={item.id}>
                      {item.children && item.children.length > 0 ? (
                        <>
                          <NavigationMenuTrigger className="h-10 px-4 rounded-lg hover:scale-105 transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white data-[state=open]:bg-linear-to-r data-[state=open]:from-[#367375] data-[state=open]:to-[#24C3BC] data-[state=open]:text-white text-foreground bg-transparent">
                            {item.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="grid gap-3 p-6 md:w-[400px]">
                              {item.children.map((child) => (
                                <Link
                                  key={child.id}
                                  href={child.url}
                                  className="block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:text-white hover:scale-105 border border-border"
                                >
                                  <div className="text-base font-semibold text-primary border-b border-primary/20 pb-1">
                                    {child.label}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.url}
                            className="group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] focus:bg-linear-to-r focus:from-[#367375] focus:to-[#24C3BC] focus:outline-none disabled:pointer-events-none disabled:opacity-50 hover:scale-105 hover:text-white text-foreground"
                          >
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
              </NavigationMenuList>
            </NavigationMenu>

            <Button
              className="hidden lg:flex bg-linear-to-r from-[#367375] to-[#24C3BC] text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 border-0"
              asChild
            >
              <Link href="/donate">Donate</Link>
            </Button>

            <div className="hidden lg:flex flex-col gap-1">
              <div className="relative" ref={languageDropdownRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg hover:scale-110 transition-all group bg-transparent border-0 shadow-none"
                  onClick={() => {
                    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                    console.log(
                      "[v0] Language dropdown toggled:",
                      !isLanguageDropdownOpen
                    );
                  }}
                >
                  <Languages className="h-4 w-4 text-foreground group-hover:bg-linear-to-r group-hover:from-[#367375] group-hover:to-[#24C3BC] group-hover:bg-clip-text group-hover:text-transparent transition-all" />
                  <span className="sr-only">
                    {getTranslatedText("switchLanguage", "Switch Language")}
                  </span>
                </Button>

                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-32 bg-white border-2 border-gray-300 rounded-lg shadow-2xl z-9999 p-2">
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full flex items-center gap-2 cursor-pointer transition-all duration-300 rounded-md p-3 ${
                        selectedLanguage === "en"
                          ? "bg-linear-to-r from-[#367375] to-[#24C3BC] text-white shadow-lg scale-105"
                          : "hover:scale-105 hover:shadow-md hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-base">🇺🇸</span>
                      <span
                        className={`text-sm font-medium ${
                          selectedLanguage === "en"
                            ? "text-white"
                            : "text-foreground"
                        }`}
                      >
                        EN
                      </span>
                    </button>
                    <button
                      onClick={() => handleLanguageChange("am")}
                      className={`w-full flex items-center gap-2 cursor-pointer transition-all duration-300 rounded-md p-3 mt-1 ${
                        selectedLanguage === "am"
                          ? "bg-linear-to-r from-[#367375] to-[#24C3BC] text-white shadow-lg scale-105"
                          : "hover:scale-105 hover:shadow-md hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-base">🇪🇹</span>
                      <span
                        className={`text-sm font-medium ${
                          selectedLanguage === "am"
                            ? "text-white"
                            : "text-foreground"
                        }`}
                      >
                        AM
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceReader}
                className={`h-8 w-8 rounded-lg transition-all hover:scale-110 group bg-transparent border-0 shadow-none ${
                  isSpeaking ? "bg-linear-to-r from-[#367375] to-[#24C3BC]" : ""
                }`}
              >
                {isSpeaking ? (
                  <VolumeX className="h-4 w-4 text-white" />
                ) : (
                  <Volume2 className="h-4 w-4 text-foreground group-hover:bg-linear-to-r group-hover:from-[#367375] group-hover:to-[#24C3BC] group-hover:bg-clip-text group-hover:text-transparent transition-all" />
                )}
                <span className="sr-only">
                  {isSpeaking
                    ? getTranslatedText("stopReading", "Stop Reading")
                    : getTranslatedText("readPage", "Read Page")}
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden border-t py-6 bg-white/95 backdrop-blur-md max-h-[calc(100vh-5rem)] overflow-y-auto">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                className="px-4 py-3 text-sm font-medium text-foreground hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white rounded-lg transition-colors"
              >
                {getTranslatedText("home", "Home")}
              </Link>

              <div>
                <button
                  onClick={() => toggleMobileItem("about")}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white rounded-lg transition-colors"
                >
                  {getTranslatedText("aboutUs", "About Us")}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openMobileItems.has("about") ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileItems.has("about") && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-border pl-4">
                    <Link
                      href="/about/about-STEMPower"
                      className="block px-4 py-2 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                    >
                      {getTranslatedText("aboutSTEMPower", "About STEMPower")}
                    </Link>
                    <Link
                      href="/about/members"
                      className="block px-4 py-2 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                    >
                      {getTranslatedText(
                        "stempowerMembers",
                        "STEMPower Members"
                      )}
                    </Link>
                    {mergedNavItems
                      .find((item) => item.id === "about")
                      ?.children?.filter(
                        (child) => !permanentUrls.has(child.url)
                      )
                      .map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          className="block px-4 py-2 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                        >
                          {child.label}
                        </Link>
                      ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleMobileItem("programs")}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white rounded-lg transition-colors"
                >
                  {getTranslatedText("programs", "Programs")}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openMobileItems.has("programs") ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileItems.has("programs") && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-border pl-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                        {getTranslatedText("stemOperations", "STEM Operations")}
                      </p>
                      <Link
                        href="/programs/stem-operations/stem-centers"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("stemCenters", "STEM Centers")}
                      </Link>
                      <Link
                        href="/programs/stem-operations/science-fairs"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("scienceFairs", "Science Fairs")}
                      </Link>
                      <Link
                        href="/programs/stem-operations/university-outreach"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText(
                          "universityOutreach",
                          "University Outreach"
                        )}
                      </Link>
                      <Link
                        href="/programs/stem-operations/stem-tv"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("stemTV", "STEM TV")}
                      </Link>
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                        {getTranslatedText("fabLab", "FabLab")}
                      </p>
                      <Link
                        href="/programs/fablab/maker-space"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("makerSpace", "Maker Space")}
                      </Link>
                      <Link
                        href="/programs/fablab/training-consultancy"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText(
                          "trainingConsultancy",
                          "Training & Consultancy"
                        )}
                      </Link>
                      <Link
                        href="/programs/fablab/products"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("fablabProducts", "Fablab Products")}
                      </Link>
                      <Link
                        href="/programs/fablab/services"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("fablabServices", "Fablab services")}
                      </Link>
                    </div>
                    <div className="space-y-1 pt-2">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                        {getTranslatedText(
                          "entrepreneurshipIncubation",
                          "Entrepreneurship & Incubation"
                        )}
                      </p>
                      <Link
                        href="/programs/entrepreneurship/business-development"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText(
                          "businessDevelopmentShort",
                          "Business Development"
                        )}
                      </Link>
                      <Link
                        href="/programs/entrepreneurship/incubation"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("incubation", "Incubation")}
                      </Link>
                      <Link
                        href="/programs/entrepreneurship/digital-skills"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("digitalSkills", "Digital Skills")}
                      </Link>
                      <Link
                        href="/programs/entrepreneurship/soft-skills"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("softSkills", "Soft Skills")}
                      </Link>
                    </div>
                    {mergedNavItems
                      .find((item) => item.id === "programs")
                      ?.children?.filter(
                        (child) => !permanentUrls.has(child.url)
                      )
                      .map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                        >
                          {child.label}
                        </Link>
                      ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleMobileItem("latest")}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white rounded-lg transition-colors"
                >
                  {getTranslatedText("latest", "Latest")}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      openMobileItems.has("latest") ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openMobileItems.has("latest") && (
                  <div className="ml-4 mt-2 space-y-2 border-l-2 border-border pl-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
                        {getTranslatedText("news", "News")}
                      </p>
                      <Link
                        href="/latest/news/newsletter"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("newsletter", "Newsletter")}
                      </Link>
                      <Link
                        href="/latest/news/social-media"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText(
                          "socialMediaPosts",
                          "Social Media Posts"
                        )}
                      </Link>
                      <Link
                        href="/latest/news/others-talking-about-stempower"
                        className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText(
                          "othersTalkingAbout",
                          "Others talking about STEMpower Ethiopia"
                        )}
                      </Link>
                    </div>
                    <div className="space-y-1 pt-2">
                      <Link
                        href="/latest/events"
                        className="block px-2 py-1 text-sm font-medium text-foreground hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("events", "Events")}
                      </Link>
                    </div>
                    <div className="space-y-1 pt-2">
                      <Link
                        href="/latest/announcements"
                        className="block px-2 py-1 text-sm font-medium text-foreground hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                      >
                        {getTranslatedText("announcements", "Announcements")}
                      </Link>
                    </div>
                    {mergedNavItems
                      .find((item) => item.id === "latest")
                      ?.children?.filter(
                        (child) => !permanentUrls.has(child.url)
                      )
                      .map((child) => (
                        <Link
                          key={child.id}
                          href={child.url}
                          className="block px-2 py-1 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                        >
                          {child.label}
                        </Link>
                      ))}
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className="px-4 py-3 text-sm font-medium text-foreground hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white rounded-lg transition-colors"
              >
                {getTranslatedText("contactUs", "Contact Us")}
              </Link>

              {/* Add new top-level API items */}
              {mergedNavItems
                .filter(
                  (item) =>
                    ![
                      "home",
                      "about",
                      "programs",
                      "latest",
                      "contact",
                    ].includes(item.id)
                )
                .map((item) => {
                  const isOpen = openMobileItems.has(item.id);
                  return (
                    <div key={item.id}>
                      {item.children && item.children.length > 0 ? (
                        <>
                          <button
                            onClick={() => toggleMobileItem(item.id)}
                            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white rounded-lg transition-colors"
                          >
                            {item.label}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="ml-4 mt-2 space-y-2 border-l-2 border-border pl-4">
                              {item.children.map((child) => (
                                <Link
                                  key={child.id}
                                  href={child.url}
                                  className="block px-4 py-2 text-sm text-foreground/80 hover:text-white hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] rounded-lg"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <Link
                          href={item.url}
                          className="px-4 py-3 text-sm font-medium text-foreground hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white rounded-lg transition-colors"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              <div className="px-4 pt-4">
                <Button
                  className="w-full bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#367375]/90 hover:to-[#24C3BC]/90 text-white font-semibold"
                  asChild
                >
                  <Link href="/donate">
                    {getTranslatedText("donate", "Donate")}
                  </Link>
                </Button>
              </div>

              <div className="px-4 pt-2">
                <div className="relative" ref={mobileLanguageDropdownRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-full h-12 flex items-center justify-center rounded-lg transition-all hover:scale-105 bg-transparent border border-border group"
                    onClick={() => {
                      setIsMobileLanguageDropdownOpen(
                        !isMobileLanguageDropdownOpen
                      );
                      console.log(
                        "[v0] Mobile language dropdown toggled:",
                        !isMobileLanguageDropdownOpen
                      );
                    }}
                  >
                    <Languages className="h-6 w-6 text-foreground group-hover:bg-linear-to-r group-hover:from-[#367375] group-hover:to-[#24C3BC] group-hover:bg-clip-text group-hover:text-transparent transition-all" />
                    <span className="sr-only">
                      {getTranslatedText("switchLanguage", "Switch Language")}
                    </span>
                  </Button>

                  {isMobileLanguageDropdownOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-32 bg-white border-2 border-gray-300 rounded-lg shadow-2xl z-9999 p-2">
                      <button
                        onClick={() => handleLanguageChange("en")}
                        className={`w-full flex items-center gap-2 cursor-pointer transition-all duration-300 rounded-md p-3 ${
                          selectedLanguage === "en"
                            ? "bg-linear-to-r from-[#367375] to-[#24C3BC] text-white shadow-lg scale-105"
                            : "hover:scale-105 hover:shadow-md hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-base">🇺🇸</span>
                        <span
                          className={`text-sm font-medium ${
                            selectedLanguage === "en"
                              ? "text-white"
                              : "text-foreground"
                          }`}
                        >
                          EN
                        </span>
                      </button>
                      <button
                        onClick={() => handleLanguageChange("am")}
                        className={`w-full flex items-center gap-2 cursor-pointer transition-all duration-300 rounded-md p-3 mt-1 ${
                          selectedLanguage === "am"
                            ? "bg-linear-to-r from-[#367375] to-[#24C3BC] text-white shadow-lg scale-105"
                            : "hover:scale-105 hover:shadow-md hover:bg-gray-100"
                        }`}
                      >
                        <span className="text-base">🇪🇹</span>
                        <span
                          className={`text-sm font-medium ${
                            selectedLanguage === "am"
                              ? "text-white"
                              : "text-foreground"
                          }`}
                        >
                          AM
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-4 pt-2">
                <Button
                  variant="ghost"
                  onClick={handleVoiceReader}
                  className={`w-full h-12 flex items-center justify-center gap-2 rounded-lg transition-all hover:scale-105 border border-border group ${
                    isSpeaking
                      ? "bg-linear-to-r from-[#367375] to-[#24C3BC] text-white"
                      : "bg-transparent"
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-6 w-6 text-white" />
                      <span className="text-sm font-medium text-white">
                        {getTranslatedText("stopReading", "Stop Reading")}
                      </span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-6 w-6 text-foreground group-hover:bg-linear-to-r group-hover:from-[#367375] group-hover:to-[#24C3BC] group-hover:bg-clip-text group-hover:text-transparent transition-all" />
                      <span className="text-sm font-medium text-foreground group-hover:bg-linear-to-r group-hover:from-[#367375] group-hover:to-[#24C3BC] group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        {getTranslatedText("readPage", "Read Page")}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
