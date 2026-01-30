"use client";

import { useState, useEffect, use } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface ContentSection {
  id: string;
  type: "text" | "image" | "cards" | "stats";
  title?: string;
  content?: string;
  imageUrl?: string;
  items?: Array<{ title: string; description: string; icon?: string }>;
}

interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  ctaText: string;
  ctaLink: string;
  sections: ContentSection[];
  status: "draft" | "published";
  createdAt: string;
}

export default function DynamicPageRoute() {
  const params = useParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [page, setPage] = useState<DynamicPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Page not found");
      setLoading(false);
      return;
    }

    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/pages?slug=${encodeURIComponent(slug)}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setError("Page not found");
          } else {
            throw new Error("Failed to load page");
          }
          setLoading(false);
          return;
        }

        const pageData = await response.json();
        if (!pageData || pageData.status !== "published") {
          setError("Page not found or not published");
          setLoading(false);
          return;
        }

        setPage(pageData);
        setError(null);
      } catch (e) {
        console.error("Error loading page:", e);
        setError("Unable to load page. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
          <p className="text-muted-foreground">Loading page...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !page) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
              <p className="text-muted-foreground mb-4">
                {error || "The page you're looking for doesn't exist."}
              </p>
              <Button asChild>
                <Link href="/">Go Home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          {page.heroImage && (
            <Image
              src={page.heroImage}
              alt={page.heroTitle}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-linear-to-r from-[#367375]/90 to-[#24C3BC]/90" />
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            {page.heroSubtitle && (
              <p className="text-lg md:text-xl mb-2 opacity-90">
                {page.heroSubtitle}
              </p>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {page.heroTitle || page.title}
            </h1>
            {page.heroDescription && (
              <p className="text-lg md:text-xl max-w-2xl mx-auto mb-6 opacity-90">
                {page.heroDescription}
              </p>
            )}
            {page.ctaText && page.ctaLink && page.ctaLink !== "#" && (
              <Button
                size="lg"
                className="bg-white text-[#367375] hover:bg-gray-100"
                asChild
              >
                <Link href={page.ctaLink}>{page.ctaText}</Link>
              </Button>
            )}
          </div>
        </section>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12 space-y-12">
          {page.sections.map((section) => (
            <div key={section.id} className="max-w-4xl mx-auto">
              {section.type === "text" && (
                <div className="prose prose-lg max-w-none">
                  {section.title && (
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                  )}
                  {section.content && (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  )}
                </div>
              )}

              {section.type === "image" && (
                <div className="space-y-4">
                  {section.imageUrl && (
                    <div className="relative w-full h-96 rounded-lg overflow-hidden">
                      <Image
                        src={section.imageUrl}
                        alt={section.title || "Page image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  {section.title && (
                    <p className="text-center text-sm text-gray-600 italic">
                      {section.title}
                    </p>
                  )}
                </div>
              )}

              {section.type === "cards" && section.items && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-6">
                        {item.icon && (
                          <div className="text-4xl mb-4">{item.icon}</div>
                        )}
                        <h3 className="text-xl font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {section.type === "stats" && section.items && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {section.items.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="text-4xl font-bold text-[#367375] mb-2">
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
