"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Microscope,
  Cpu,
  Briefcase,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useApp } from "@/lib/app-context";

const programs = [
  {
    icon: Microscope,
    title: "STEM Operations",
    description:
      "Comprehensive STEM education through 61+ centers nationwide, science fairs, university outreach programs, and STEM-TV broadcasting reaching millions of students across Ethiopia with hands-on learning experiences.",
    features: [
      "61 STEM Centers",
      "155+ Science Fairs",
      "University Outreach",
      "STEM-TV Broadcasting",
    ],
    image: "/ethiopian-students-in-science-laboratory-conductin.jpg",
    href: "/programs/stem-operations",
    subPrograms: [
      {
        name: "STEM Centers",
        description:
          "Specialized learning hubs where education meets innovation. 61 centers nationwide provide hands-on engineering and science experiences in fully equipped labs, hosting community gatherings, science fairs, and regional competitions.",
      },
      {
        name: "Science Fairs",
        description:
          "Locally run fairs for grades 7-12 focusing on real-world solutions. Students work with mentors to address pressing challenges in water, energy, and community technologies, with 7,000+ participants annually.",
      },
      {
        name: "University STEM Outreach",
        description:
          "Government-backed program running across 40+ public universities. Transforms campuses into pop-up STEM Centers during summer, engaging 10,000+ students with hands-on learning and mentorship.",
      },
      {
        name: "STEM-TV",
        description:
          "Biweekly Amharic program reaching 5 million viewers every Saturday evening. Makes STEM accessible to students without internet through satellite broadcasting, with English-captioned episodes on YouTube.",
      },
    ],
  },
  {
    icon: Cpu,
    title: "FabLab & Innovation",
    description:
      "State-of-the-art innovation hubs with maker spaces, professional training programs, educational science kits, and advanced machinery including 3D printers, laser cutters, and CNC machines for hands-on prototyping and creation.",
    features: [
      "25+ Maker Spaces",
      "Training & Consultancy",
      "Science Kits Production",
      "Advanced Machinery",
    ],
    image: "/ethiopian-students-using-3d-printers-and-technolog.jpg",
    href: "/programs/fablab",
    subPrograms: [
      {
        name: "Maker Space",
        description:
          "Hands-on labs where creativity comes alive. Students explore 3D printing, electronics, robotics, and design with mentor guidance, gaining confidence to innovate and solve real-world problems.",
      },
      {
        name: "STEM Training & Consultancy",
        description:
          "Evidence-driven solutions partnering with schools, universities, and governments. Customized programs from teacher training to curriculum development and fully equipped STEM facility establishment.",
      },
      {
        name: "Educational Science Kits",
        description:
          "Carefully designed kits based on national curricula that turn abstract concepts into fun, practical experiments. Easy to use, affordable, and adaptable for all ages.",
      },
      {
        name: "FabLab Machinery",
        description:
          "State-of-the-art equipment including 3D printers, laser cutters, CNC routing machines, soldering stations, and electronics workbenches for precision prototyping and product development.",
      },
    ],
  },
  {
    icon: Briefcase,
    title: "Entrepreneurship & Incubation",
    description:
      "Empowering young entrepreneurs with comprehensive business development services, startup incubation programs, digital skills training through IBM SkillsBuild partnership, and essential soft skills development for success.",
    features: [
      "Business Development",
      "Startup Incubation",
      "Digital Skills (IBM)",
      "Soft Skills Training",
    ],
    image: "/young-ethiopian-entrepreneurs-presenting-business-.jpg",
    href: "/programs/entrepreneurship",
    subPrograms: [
      {
        name: "Business Development Services",
        description:
          "Practical support from market research and business planning to mentorship and financial modeling. Empowering innovators to turn ideas into scalable, sustainable ventures.",
      },
      {
        name: "Incubation",
        description:
          "Comprehensive support with guidance, resources, and mentorship. From business planning and prototyping to funding access, networks, and collaborative workspaces for startup success.",
      },
      {
        name: "Digital Skills",
        description:
          "Year-long program partnered with IBM SkillsBuild. Training in coding, data analysis, robotics, and digital design through hands-on learning, mentorship, and real-world projects.",
      },
      {
        name: "Soft Skills",
        description:
          "Interactive workshops building communication, teamwork, leadership, and problem-solving abilities. Equipping students with interpersonal skills to collaborate effectively and thrive.",
      },
    ],
  },
];
const gradientTextClass =
  "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";
const gradientButtonClass =
  "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all";

export function ProgramsShowcase() {
  const { selectedLanguage } = useApp();
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
        translations.ourPrograms = await translateText(
          "Our Programs",
          selectedLanguage
        );
        translations.comprehensiveSTEM = await translateText(
          "Comprehensive STEM Education Ecosystem",
          selectedLanguage
        );
        translations.programsDescription = await translateText(
          "From hands-on learning centers to cutting-edge innovation labs and entrepreneurship training, our integrated programs provide Ethiopian youth with the skills, knowledge, and opportunities to thrive in the 21st century.",
          selectedLanguage
        );
        translations.exploreProgram = await translateText(
          "Explore Program",
          selectedLanguage
        );

        // Translate program titles, descriptions, and features
        for (let i = 0; i < programs.length; i++) {
          const program = programs[i];
          translations[`program_${i}_title`] = await translateText(
            program.title,
            selectedLanguage
          );
          translations[`program_${i}_description`] = await translateText(
            program.description,
            selectedLanguage
          );
          program.features.forEach(async (feature, j) => {
            translations[`program_${i}_feature_${j}`] = await translateText(
              feature,
              selectedLanguage
            );
          });
        }

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating programs content:", error);
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

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-primary/20 
        bg-linear-to-br from-[#367375] to-[#24C3BC] text-white rounded-full shadow-md"
            >
              <GraduationCap className="w-4 h-4" />
              {getTranslatedText("ourPrograms", "Our Programs")}
            </Badge>
          </div>
          <br />
          <h2
            className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
          >
            {getTranslatedText(
              "comprehensiveSTEM",
              "Comprehensive STEM Education Ecosystem"
            )}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {getTranslatedText(
              "programsDescription",
              "From hands-on learning centers to cutting-edge innovation labs and entrepreneurship training, our integrated programs provide Ethiopian youth with the skills, knowledge, and opportunities to thrive in the 21st century."
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <Card
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105"
            >
              <div className="relative">
                <img
                  src={program.image || "/placeholder.svg"}
                  alt={program.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <div className="p-3 rounded-xl bg-linear-to-br from-[#367375] to-[#24C3BC] text-white backdrop-blur shadow-lg">
                    <program.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-2xl mb-3">
                  {getTranslatedText(`program_${index}_title`, program.title)}
                </CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {getTranslatedText(
                    `program_${index}_description`,
                    program.description
                  )}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {program.features.map((feature, featureIndex) => (
                    <Badge
                      key={featureIndex}
                      variant="secondary"
                      className="text-xs"
                    >
                      {getTranslatedText(
                        `program_${index}_feature_${featureIndex}`,
                        feature
                      )}
                    </Badge>
                  ))}
                </div>

                <Button
                  asChild
                  className="w-full group/btn bg-linear-to-br from-[#367375] to-[#24C3BC]"
                >
                  <Link href={program.href}>
                    {getTranslatedText("exploreProgram", "Explore Program")}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <div className="text-center mt-16">
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 hover:scale-105 transition-all bg-transparent"
            asChild
          >
            <Link href="/programs">
              View All Programs & Details
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div> */}
      </div>
    </section>
  );
}
