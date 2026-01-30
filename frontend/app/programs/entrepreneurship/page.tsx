import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Code, Rocket, Users } from "lucide-react";
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
      `${BACKEND_URL}/api/pages?status=published&program=entrepreneurship`,
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
    console.error("Failed to load Entrepreneurship pages", err);
    return [];
  }
}

const entrepreneurshipPrograms = [
  {
    title: "Business Development",
    description:
      "Practical support, expert guidance, and strategic tools to help startups, entrepreneurs, and organizations thrive. From market research and business planning to mentorship and financial modeling.",
    icon: Briefcase,
    stats: { services: "Comprehensive", support: "Expert", impact: "Scalable" },
    features: [
      "Market research and analysis",
      "Business planning support",
      "Mentorship programs",
      "Financial modeling guidance",
    ],
    image: "https://res.cloudinary.com/domm1m4dm/image/upload/v1766432266/Gemini_Generated_Image_eamss7eamss7eams_gskfbo.png",
    detailedDescription:
      "We empower innovators to turn ideas into scalable, sustainable ventures. By combining hands-on support with actionable insights, our services help clients navigate challenges, seize opportunities, and achieve lasting impact in their communities and beyond.",
  },
  {
    title: "Incubation",
    description:
      "Comprehensive programs providing startups and innovators with guidance, resources, and mentorship to turn bold ideas into successful, sustainable ventures with access to funding, networks, and collaborative workspaces.",
    icon: Rocket,
    stats: { stage: "Early", resources: "Full", success: "Proven" },
    features: [
      "Business planning assistance",
      "Prototyping support",
      "Access to funding opportunities",
      "Professional networks",
    ],
    image: "https://res.cloudinary.com/domm1m4dm/image/upload/v1766432375/Gemini_Generated_Image_5v9z1h5v9z1h5v9z_hsbvwk.png",
    detailedDescription:
      "From business planning and prototyping to access to funding, networks, and collaborative workspaces, we create an environment where creativity and entrepreneurship thrive. By supporting founders every step of the way, our incubation programs help transform vision into reality, accelerate growth, and make a lasting impact.",
  },
  {
    title: "Digital Skills",
    description:
      "Year-long digital skills training program partnered with IBM SkillsBuild. Equipping students, young professionals, and communities with practical expertise in coding, data analysis, robotics, and digital design.",
    icon: Code,
    stats: { duration: "1 Year", partner: "IBM", focus: "Practical" },
    features: [
      "IBM SkillsBuild partnership",
      "Coding and programming",
      "Data analysis training",
      "Robotics education",
    ],
    image: "https://res.cloudinary.com/domm1m4dm/image/upload/v1766432441/Gemini_Generated_Image_5wujyt5wujyt5wuj_iceksa.png",
    detailedDescription:
      "Through hands-on learning, mentorship, and real-world projects, participants gain the confidence and capability to solve problems, create solutions, and thrive in a technology-driven future. By building digital literacy and technical know-how, we empower the next generation to turn ideas into impact.",
  },
  {
    title: "Soft Skills",
    description:
      "Interactive workshops building communication, teamwork, leadership, and problem-solving abilities. Equipping students and young innovators with interpersonal skills to collaborate effectively and thrive in any environment.",
    icon: Users,
    stats: {
      approach: "Interactive",
      skills: "Essential",
      outcome: "Excellence",
    },
    features: [
      "Communication skills development",
      "Teamwork and collaboration",
      "Leadership training",
      "Problem-solving techniques",
    ],
    image: "https://res.cloudinary.com/domm1m4dm/image/upload/v1766432506/Gemini_Generated_Image_7da76w7da76w7da7_l9bba8.png",
    detailedDescription:
      "Through interactive workshops, mentorship, and real-world scenarios, participants gain the confidence to lead projects, navigate challenges, and turn their ideas into meaningful impact. Strong soft skills empower the next generation to not just succeed—but to excel.",
  },
];

export default async function EntrepreneurshipPage() {
  const dynamicPages = await fetchProgramPages();
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] bg-cover bg-center opacity-20" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <Badge className="mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white shadow-lg border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                  <Rocket className="h-3 w-3 mr-1.5" />
                  Entrepreneurship & Incubation Division
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  Entrepreneurship & Incubation
                </h1>
                <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                  Empowering young entrepreneurs with business development
                  services, incubation programs, year-long digital skills
                  training through IBM SkillsBuild partnership, and essential
                  soft skills development for complete entrepreneurial success.
                </p>
              </div>
              <div className="relative">
                <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <Image
                    src="https://res.cloudinary.com/domm1m4dm/image/upload/v1766432140/incubation_lqxhwx.png"
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

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                Our Programs
              </Badge>
              <h2 className="text-4xl font-bold mb-4 bg-linear-to-r from-[#367375] to-[#24C3BC] bg-clip-text text-transparent">
                Comprehensive Entrepreneurship Support
              </h2>
              <p className="text-lg text-muted-foreground">
                From ideation to market success, we provide end-to-end support
                for aspiring entrepreneurs
              </p>
            </div>

            {/* Program Cards */}
            <div className="max-w-6xl mx-auto space-y-12">
              {entrepreneurshipPrograms.map((program, index) => (
                <div
                  key={index}
                  className={`relative grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 group ${
                    index % 2 === 1 ? "md:grid-flow-dense" : ""
                  }`}
                >
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-linear-to-r from-[#367375]/0 to-[#24C3BC]/0 group-hover:from-[#367375]/10 group-hover:to-[#24C3BC]/10 transition-all duration-500 pointer-events-none" />

                  {/* Image Section */}
                  <div
                    className={`relative h-[320px] ${
                      index % 2 === 1 ? "md:col-start-2" : ""
                    }`}
                  >
                    <img
                      src={program.image || "/placeholder.svg"}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />

                    {/* Stats Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                      {Object.entries(program.stats).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-white/95 backdrop-blur-sm rounded-lg p-2 text-center"
                        >
                          <div className="text-lg font-bold text-[#24C3BC]">
                            {value}
                          </div>
                          <div className="text-xs text-gray-600 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div
                    className={`p-8 space-y-4 relative z-10 ${
                      index % 2 === 1 ? "md:col-start-1" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-linear-to-r from-[#367375]/10 to-[#24C3BC]/10 text-[#24C3BC]">
                        <program.icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Program
                      </Badge>
                    </div>

                    <h3 className="text-2xl font-bold text-balance">
                      {program.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {program.detailedDescription}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {program.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#24C3BC] mt-1.5 shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Button */}
                    <Button
                      className="mt-4 bg-linear-to-r from-[#367375] to-[#24C3BC] hover:opacity-90 text-white"
                      asChild
                    >
                      <Link
                        href={`/programs/entrepreneurship/${program.title
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "")}`}
                      >
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}

              {dynamicPages.length > 0 && (
                <div className="mt-16 space-y-6">
                  <div className="text-center space-y-3">
                    <Badge variant="secondary" className="text-xs">
                      Dynamic Pages
                    </Badge>
                    <h3 className="text-2xl font-bold">More to Explore</h3>
                    <p className="text-sm text-muted-foreground">
                      Published pages created for Entrepreneurship & Incubation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {dynamicPages.map((page) => (
                      <div
                        key={page.id}
                        className="bg-white border rounded-xl overflow-hidden shadow-sm"
                      >
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
                              href={`/programs/entrepreneurship/${page.slug}`}
                            >
                              View Page
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
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
