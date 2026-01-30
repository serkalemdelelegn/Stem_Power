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
  Calendar,
  Users,
  Megaphone,
  ArrowRight,
  ExternalLink,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BACKEND_URL } from "@/lib/backend-url";

type DynamicPage = {
  id: string;
  title: string;
  slug: string;
  program?: string;
  description?: string;
  heroImage?: string;
};

async function fetchLatestDynamicPages(): Promise<DynamicPage[]> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/pages?status=published&program=${encodeURIComponent("latest")}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((p) => p?.slug && p?.title && p?.status === "published")
      .map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        program: p.program,
        description: p.description,
        heroImage: p.heroImage,
      }));
  } catch (err) {
    console.error("Failed to load latest dynamic pages", err);
    return [];
  }
}

export default async function LatestPage() {
  const dynamicPages = await fetchLatestDynamicPages();
  const newsItems = [
    {
      title: "20 New African STEM Centers in Half-Year",
      category: "Expansion",
      date: "2024-12-15",
      excerpt:
        "STEMpower continues rapid expansion across Sub-Saharan Africa with 20 new STEM Centers established in the past six months.",
      type: "news",
    },
    {
      title: "Ethiopian National Science Fair 2024 Results",
      category: "Competition",
      date: "2024-11-20",
      excerpt:
        "Outstanding innovations showcased at the 9th National Science and Engineering Fair held at AASTU.",
      type: "news",
    },
    {
      title: "UNESCO Conference Participation",
      category: "Partnership",
      date: "2024-11-10",
      excerpt:
        "STEMpower participated in UNESCO's 'Transforming STEM in Africa' conference at AU Headquarters.",
      type: "news",
    },
  ];

  const events = [
    {
      title: "10th National Science and Engineering Fair",
      date: "2025-03-15",
      location: "Addis Ababa Science & Technology University",
      description:
        "Annual showcase of student innovations and STEM projects from across Ethiopia.",
      status: "upcoming",
    },
    {
      title: "FabLab Innovation Workshop",
      date: "2025-02-20",
      location: "STEMpower FabLab, Addis Ababa",
      description:
        "Hands-on workshop for students and entrepreneurs on product development and manufacturing.",
      status: "upcoming",
    },
    {
      title: "STEM Teacher Training Program",
      date: "2025-02-01",
      location: "Multiple STEM Centers",
      description:
        "Professional development program for STEM educators across Ethiopia.",
      status: "upcoming",
    },
  ];

  const announcements = [
    {
      title: "New Partnership with Ethiopian Ministry of Education",
      date: "2024-12-20",
      content:
        "STEMpower announces expanded collaboration to establish 25 additional STEM Centers in 2025.",
      priority: "high",
    },
    {
      title: "STEM-TV Schedule Update",
      date: "2024-12-10",
      content:
        "New broadcasting time: Saturdays 10:40-11:00 AM on Walta Satellite TV.",
      priority: "medium",
    },
    {
      title: "FabLab Equipment Upgrade",
      date: "2024-12-05",
      content:
        "Latest 3D printing and CNC machinery installed at Addis Ababa FabLab facility.",
      priority: "low",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-balance">
            Latest Updates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
            Stay informed about STEMpower Ethiopia's latest news, upcoming
            events, and important announcements.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <Link href="/latest/news">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Megaphone className="h-4 w-4" />
              News
            </Button>
          </Link>
          <Link href="/latest/events">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Calendar className="h-4 w-4" />
              Events
            </Button>
          </Link>
          <Link href="/latest/announcements">
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Users className="h-4 w-4" />
              Announcements
            </Button>
          </Link>
        </div>

        {/* News Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
            <Link href="/latest/news">
              <Button variant="ghost" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{item.category}</Badge>
                    <span className="text-sm text-gray-500">{item.date}</span>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <Button size="sm" variant="outline">
                    Read More <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Upcoming Events
            </h2>
            <Link href="/latest/events">
              <Button variant="ghost" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {event.title}
                  </CardTitle>
                  <CardDescription>
                    <div className="space-y-1">
                      <div>
                        <strong>Date:</strong> {event.date}
                      </div>
                      <div>
                        <strong>Location:</strong> {event.location}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <Badge className="bg-green-100 text-green-800">
                    {event.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Announcements Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Recent Announcements
            </h2>
            <Link href="/latest/announcements">
              <Button variant="ghost" className="flex items-center gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {announcements.map((announcement, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {announcement.title}
                        </h3>
                        <Badge
                          variant={
                            announcement.priority === "high"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            announcement.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : ""
                          }
                        >
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{announcement.content}</p>
                    </div>
                    <span className="text-sm text-gray-500 ml-4">
                      {announcement.date}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Dynamic Pages Section */}
        {dynamicPages.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Pages
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dynamicPages.map((page) => (
                <Card key={page.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <Badge variant="secondary">Dynamic Page</Badge>
                    </div>
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {page.heroImage && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={page.heroImage}
                          alt={page.title}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {page.description || "Explore this dynamic page."}
                    </p>
                    <Link href={`/latest/${page.slug}`}>
                      <Button className="w-full" variant="outline">
                        Read More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-linear-to-r from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive the latest news, event
            updates, and announcements directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
