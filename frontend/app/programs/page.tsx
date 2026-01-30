import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BACKEND_URL } from "@/lib/backend-url";

type DynamicPage = {
  id: string;
  title: string;
  slug: string;
  program?: string;
  description?: string;
};

const programLinks = [
  {
    title: "STEM Centers",
    description: "Hands-on learning, labs, and mentorship across Ethiopia.",
    href: "/programs/stem-operations",
  },
  {
    title: "FabLab & Maker Spaces",
    description: "Prototyping, fabrication, and maker education hubs.",
    href: "/programs/fablab",
  },
  {
    title: "Entrepreneurship",
    description: "Incubation, venture readiness, and business development.",
    href: "/programs/entrepreneurship",
  },
];

async function fetchDynamicPages(): Promise<DynamicPage[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/pages?status=published`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((p) => {
        // Exclude pages with program="latest" (case-insensitive)
        const program = p?.program?.toLowerCase();
        return p?.slug && p?.title && program !== "latest";
      })
      .map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        program: p.program,
        description: p.description,
      }));
  } catch (err) {
    console.error("Failed to load dynamic pages", err);
    return [];
  }
}

export default async function ProgramsPage() {
  const dynamicPages = await fetchDynamicPages();
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" /> Programs
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Explore Our Programs
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Choose a program area to dive into detailed pages, curriculum, and
            application info.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programLinks.map((program) => (
            <Card
              key={program.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-xl">{program.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {program.description}
                </p>
                <Link href={program.href}>
                  <Button className="w-full flex items-center justify-center gap-2">
                    Go to {program.title} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}

          {dynamicPages.map((page) => (
            <Card
              key={page.id}
              className="hover:shadow-lg transition-shadow border-dashed"
            >
              <CardHeader>
                <CardTitle className="text-xl">{page.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {page.description || "Explore this dynamic program page."}
                </p>
                <Link
                  href={
                    page.program
                      ? `/programs/${page.program}/${page.slug}`
                      : `/programs/${page.slug}`
                  }
                >
                  <Button
                    className="w-full flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    View {page.title} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        {dynamicPages.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            No dynamic program pages published yet.
          </p>
        )}
      </div>
      <Footer />
    </div>
  );
}
