import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  Building,
  CheckCircle2,
  MapPin,
  Target,
  Trophy,
  Tv,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BACKEND_URL } from "@/lib/backend-url";

type DynamicPage = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  heroImage?: string;
};

async function fetchProgramPages(): Promise<DynamicPage[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/pages?status=published&program=stem-operations`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data)
      ? data
          .filter((p) => p?.slug && p?.title)
          .map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            description: p.description,
            heroImage: p.heroImage,
          }))
      : [];
  } catch (err) {
    console.error("Failed to load STEM Operations pages", err);
    return [];
  }
}

const stemOperationsPrograms = [
  {
    title: "STEM Centers",
    description:
      "Specialized learning hubs where education meets innovation. These centers provide students with hands-on engineering and science experiences in fully equipped labs, serving as community anchors for science fairs and regional competitions.",
    icon: Building,
    stats: { centers: "61", students: "50K+", since: "2009" },
    features: [
      "Virtual computing, electronics, and 3D printing labs",
      "Basic sciences (Biology, Chemistry, Physics)",
      "Chemical engineering and biomechanics programs",
      "Community gatherings and science fairs",
      "University-community partnerships",
      "Eco-friendly facilities with auditoriums",
    ],
    image: "https://res.cloudinary.com/domm1m4dm/image/upload/v1766431099/stem-centers_vhvzts.png",
    detailedDescription:
      "Our journey began in 2009, with the very first STEM Center established in the Foka area of Bishoftu's industrial city. From that modest start, we have grown into a nation-wide movement: today, there are 61 STEM Centers operating across the country. Most Centers are located on or near university campuses, ensuring strong university–community partnerships.",
  },
  {
    title: "Science Fairs",
    description:
      "Locally run Science and Engineering Fairs sparking creativity and innovation among students. Open to grades 7–12, these events focus on real-world solutions from water and energy innovations to community-based technologies.",
    icon: Trophy,
    stats: {
      participants: "1,000+",
      grades: "7-12",
      approach: "Solutions-driven",
    },
    features: [
      "Community to National level competitions",
      "Real-world challenge focus",
      "Dedicated mentor support through STEM Centers",
      "Water and energy innovation projects",
      "Community-based technology solutions",
      "Practical, solutions-driven approach",
    ],
    image: "https://res.cloudinary.com/domm1m4dm/image/upload/v1766431364/science-fairs_ub2tep.png",
    detailedDescription:
      "What sets the Ethiopian Science Fair apart is its practical, solutions-driven approach. While traditional fairs often follow a hypothesis–experiment–conclusion model, our students focus on real-world challenges. At the grass-roots level, every student works closely with a dedicated mentor, available through the STEM Centers.",
  },
  {
    title: "University Outreach",
    description:
      "Transforming summer break into opportunity by converting university assets into vibrant summer programs. This government-backed initiative runs across all 40+ public universities in Ethiopia.",
    icon: Users,
    stats: { universities: "40+", students: "10,000+", status: "Gov-backed" },
    features: [
      "Pop-up STEM Centers during summer",
      "Professor and college student mentors",
      "Utilizes dormitories and cafeterias",
      "Ministry of Education adopted program",
      "Minimal cost, maximum impact model",
      "Hands-on learning and mentorship",
    ],
    image: "https://res.cloudinary.com/domm1m4dm/image/upload/v1766431497/uv-outreach_wvrrsp.png",
    detailedDescription:
      "The results spoke for themselves. With minimal cost and maximum impact, the program proved so effective that within just two years, the Ethiopian Ministry of Education fully adopted it. Today, the initiative runs across all 40+ public universities in Ethiopia as a government-backed program.",
  },
  {
    title: "STEM-TV",
    description:
      "Biweekly program designed for students without internet access but with satellite dish access. Produced locally in Amharic, reaching an estimated 5 million viewers every Saturday evening during prime dinnertime.",
    icon: Tv,
    stats: { viewers: "25k", schedule: "Biweekly", partner: "Walta" },
    features: [
      "Satellite broadcasting via Walta",
      "Produced locally in Amharic",
      "Student-age actors for relatability",
      "Saturday evening prime time slot",
      "English captions on YouTube",
      "Accessible to rural communities",
    ],
    image: "https://res.cloudinary.com/domm1m4dm/image/upload/v1766431688/stem-tv_fctjss.png",
    detailedDescription:
      "Thanks to our partnership with Walta Satellite Broadcasting, STEM-TV reaches an estimated 5 million viewers every Saturday evening during prime dinnertime. To ensure accessibility worldwide, each episode is later uploaded online with English captions.",
  },
];

export default async function STEMOperationsPage() {
  const dynamicPages = await fetchProgramPages();
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] bg-cover bg-center opacity-20" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <Badge className="mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-lg border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                  <Target className="h-3 w-3 mr-1.5" />
                  STEM Operations Division
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  Transforming STEM Education Across Ethiopia
                </h1>
                <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                  Comprehensive STEM education through 61 centers nationwide,
                  science fairs engaging 1,000+ students, university outreach
                  programs reaching 10,000+ students, and national TV
                  programming inspiring 5 million viewers.
                </p>
              </div>
              <div className="relative">
                <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <Image
                    src="https://res.cloudinary.com/domm1m4dm/image/upload/v1766431900/stem-operations_tcabpy.png"
                    alt="STEM Operations in Ethiopia"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <br />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
        </section>

        {/* Programs Grid */}
        <section className="py-20 bg-linear-to-b from-[#EAF9F9] to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="flex justify-center">
                  <Badge
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
            bg-linear-to-br from-[#367375] to-[#24C3BC]
            text-white rounded-full shadow-md"
                  >
                    <MapPin className="w-4 h-4 text-white" />
                    Our Programs
                  </Badge>
                </div>
                <br />
                <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
                  STEM Operations Programs
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Four comprehensive programs working together to transform STEM
                  education across Ethiopia
                </p>
              </div>

              <div className="space-y-8">
                {stemOperationsPrograms.map((program, index) => (
                  <Card
                    key={index}
                    className="relative overflow-hidden border-2 border-transparent rounded-xl 
            transition-all duration-300 group 
            before:absolute before:inset-0 before:rounded-xl before:bg-linear-to-r 
            before:from-[#367375] before:to-[#24C3BC] before:opacity-0 
            before:transition-opacity before:duration-300 before:-z-10 
            hover:before:opacity-100 hover:border-transparent hover:shadow-2xl"
                  >
                    <div
                      className={`grid md:grid-cols-2 gap-6 ${
                        index % 2 === 1 ? "md:grid-flow-dense" : ""
                      }`}
                    >
                      {/* Image Section */}
                      <div
                        className={`relative h-[280px] ${
                          index % 2 === 1 ? "md:col-start-2" : ""
                        }`}
                      >
                        <Image
                          src={program.image || "/placeholder.svg"}
                          alt={program.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                        <div className="absolute top-4 left-4">
                          <div className="p-3 rounded-xl bg-white/95 backdrop-blur-sm shadow-lg">
                            <program.icon className="h-6 w-6 text-[#24C3BC]" />
                          </div>
                        </div>

                        {/* Stats Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                          {Object.entries(program.stats).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex-1 text-center p-2 rounded-lg bg-white/95 backdrop-blur-sm border border-white/50"
                            >
                              <div className="text-lg font-bold bg-linear-to-r from-[#367375] to-[#24C3BC] text-transparent bg-clip-text">
                                {value}
                              </div>
                              <div className="text-[10px] text-muted-foreground capitalize font-medium">
                                {key}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Content Section */}
                      <div
                        className={`p-6 flex flex-col ${
                          index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-2xl font-bold">
                            {program.title}
                          </h3>
                          <Badge className="bg-linear-to-r from-[#367375]/10 to-[#24C3BC]/10 text-[#367375] hover:from-[#367375]/20 hover:to-[#24C3BC]/20 text-xs">
                            Core
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {program.description}
                        </p>

                        {/* Key Features */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#24C3BC]" />
                            Key Features
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {program.features
                              .slice(0, 4)
                              .map((feature, featureIndex) => (
                                <div
                                  key={featureIndex}
                                  className="flex items-start gap-2 text-xs p-2 rounded-md bg-slate-50 border border-[#367375]/10"
                                >
                                  <div className="w-1 h-1 rounded-full bg-linear-to-r from-[#367375] to-[#24C3BC] mt-1.5 shrink-0" />
                                  <span className="text-muted-foreground leading-tight">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Button
                          className="w-full mt-auto h-10 text-sm font-semibold text-white 
                  bg-linear-to-r from-[#367375] to-[#24C3BC]
                  hover:from-[#24C3BC] hover:to-[#367375]
                  transition-all duration-300 group/btn"
                          asChild
                        >
                          <Link
                            href={`/programs/stem-operations/${program.title
                              .toLowerCase()
                              .replace(/\s+/g, "-")
                              .replace(/[^a-z0-9-]/g, "")}`}
                          >
                            Learn More
                            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {dynamicPages.length > 0 && (
                <div className="mt-16 space-y-6">
                  <div className="text-center space-y-3">
                    <Badge variant="secondary" className="text-xs">
                      Dynamic Pages
                    </Badge>
                    <h3 className="text-2xl font-bold">More to Explore</h3>
                    <p className="text-sm text-muted-foreground">
                      Content curated for STEM Operations, published by the
                      team.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dynamicPages.map((page) => (
                      <Card key={page.id} className="overflow-hidden border">
                        <div className="relative h-44 bg-slate-100">
                          {page.heroImage ? (
                            <Image
                              src={page.heroImage}
                              alt={page.title}
                              fill
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="p-5 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h4 className="text-lg font-semibold">
                                {page.title}
                              </h4>
                              {page.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {page.description}
                                </p>
                              )}
                            </div>
                            <Badge variant="outline">Published</Badge>
                          </div>
                          <Button asChild variant="outline" className="w-full">
                            <Link
                              href={`/programs/stem-operations/${page.slug}`}
                            >
                              View Page
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
