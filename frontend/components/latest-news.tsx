"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchAnnouncements, type AnnouncementItem } from "@/lib/api-content";
import { useApp } from "@/lib/app-context";

const gradientTextClass =
  "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";
const gradientButtonClass =
  "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all";

export function LatestNews() {
  const { selectedLanguage } = useApp();
  const [news, setNews] = useState<AnnouncementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        translations.latestNews = await translateText(
          "Latest News",
          selectedLanguage
        );
        translations.stayUpdated = await translateText(
          "Stay updated with our latest achievements and upcoming initiatives.",
          selectedLanguage
        );
        translations.viewAllNews = await translateText(
          "View All News",
          selectedLanguage
        );
        translations.readMore = await translateText(
          "Read More",
          selectedLanguage
        );
        translations.loadingAnnouncements = await translateText(
          "Loading announcements...",
          selectedLanguage
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating latest news content:", error);
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

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchAnnouncements();
        if (Array.isArray(data) && data.length > 0) {
          setNews(data.slice(0, 3));
        } else {
          setNews([]);
        }
      } catch (error) {
        console.error("Failed to load announcements:", error);
        setNews([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();
  }, []);

  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2
              className={`text-4xl md:text-4xl mb-6 ${gradientTextClass} text-balance`}
            >
              Latest News
            </h2>
            <p className="text-lg text-muted-foreground">
              Stay updated with our latest achievements and upcoming
              initiatives.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="hidden sm:flex bg-transparent bg-linear-to-br from-[#2b5d5f] to-[#1fa39e] text-white 
                       hover:from-[#234e50] hover:to-[#188c87] transition-all duration-300 hover:scale-105"
          >
            <Link href="/latest/news/newsletter" className="flex items-center">
              View All News
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 flex items-center justify-center py-16">
              <p className="text-muted-foreground">
                {getTranslatedText(
                  "loadingAnnouncements",
                  "Loading announcements..."
                )}
              </p>
            </div>
          ) : news.length === 0 ? (
            <div className="col-span-2 flex items-center justify-center py-16">
              <p className="text-muted-foreground">
                No announcements available.
              </p>
            </div>
          ) : (
            news.map((item, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 ">
                    <Badge className="bg-primary bg-linear-to-br from-[#2b5d5f] to-[#1fa39e] text-white">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {item.date}
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                    <Link href={item.href} className="text-balance">
                      {item.title}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 text-pretty">
                    {item.excerpt}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="p-0 h-auto"
                  >
                    <Link href={item.href} className="group/link">
                      Read More
                      <ExternalLink className="ml-2 h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/latest/news/newsletter">
              {getTranslatedText("viewAllNews", "View All News")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
