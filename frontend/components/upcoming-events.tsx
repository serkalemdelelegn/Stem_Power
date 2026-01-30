"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchEvents, type Event } from "@/lib/api-content";
import { useApp } from "@/lib/app-context";

const categoryColors = {
  Competition: "bg-red-100 text-red-800 border-red-200",
  Workshop: "bg-blue-100 text-blue-800 border-blue-200",
  Summit: "bg-purple-100 text-purple-800 border-purple-200",
  Bootcamp: "bg-green-100 text-green-800 border-green-200",
  Training: "bg-orange-100 text-orange-800 border-orange-200",
  Showcase: "bg-pink-100 text-pink-800 border-pink-200",
};

export function UpcomingEvents() {
  const { selectedLanguage } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
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
        translations.upcomingEvents = await translateText(
          "Upcoming Events",
          selectedLanguage
        );
        translations.joinSTEMCommunity = await translateText(
          "Join Our STEM Community",
          selectedLanguage
        );
        translations.eventsDescription = await translateText(
          "Participate in competitions, workshops, and networking events designed to advance STEM education and innovation across Ethiopia.",
          selectedLanguage
        );
        translations.featuredEvents = await translateText(
          "Featured Events",
          selectedLanguage
        );
        translations.allUpcomingEvents = await translateText(
          "All Upcoming Events",
          selectedLanguage
        );
        translations.noUpcomingEvents = await translateText(
          "No upcoming events yet",
          selectedLanguage
        );
        translations.checkBackSoon = await translateText(
          "Check back soon as new events are published.",
          selectedLanguage
        );
        translations.registerNow = await translateText(
          "Register Now",
          selectedLanguage
        );
        translations.learnMore = await translateText(
          "Learn More",
          selectedLanguage
        );
        translations.featured = await translateText(
          "Featured",
          selectedLanguage
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating events content:", error);
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
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        console.log("Events data:", data);
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to load events:", error);
      }
    };

    loadEvents();
  }, []);

  const upcomingEvents = events.filter((event) => event.status === "upcoming");
  const featuredEvents = upcomingEvents.filter((event) => event.featured);
  const regularEvents = upcomingEvents.filter((event) => !event.featured);

  return (
    <section className="py-24 bg-linear-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Calendar className="h-4 w-4" />
            Upcoming Events
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Join Our STEM Community
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Participate in competitions, workshops, and networking events
            designed to advance STEM education and innovation across Ethiopia.
          </p>
        </div>

        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Star className="h-6 w-6 text-primary" />
              {getTranslatedText("featuredEvents", "Featured Events")}
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 border-primary/20 bg-linear-to-br from-card to-card/50"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <Badge className="absolute top-4 left-4 bg-primary text-white">
                      Featured
                    </Badge>
                    <Badge
                      className={`absolute top-4 right-4 ${
                        categoryColors[
                          event.category as keyof typeof categoryColors
                        ]
                      }`}
                    >
                      {event.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-4">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{event.participants}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2d5f62] hover:to-[#1fa89f] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      asChild
                    >
                      <Link
                        href="https://forms.gle/your-google-form-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getTranslatedText("registerNow", "Register Now")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Events */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-8">All Upcoming Events</h3>
          {regularEvents.length === 0 && featuredEvents.length === 0 ? (
            <Card className="border-dashed bg-muted/20">
              <CardContent className="py-12 text-center space-y-2">
                <p className="text-lg font-semibold">No upcoming events yet</p>
                <p className="text-muted-foreground">
                  Check back soon as new events are published.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularEvents.map((event) => (
                <Card
                  key={event.id}
                  className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/80 backdrop-blur"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <Badge
                      className={`absolute top-3 right-3 ${
                        categoryColors[
                          event.category as keyof typeof categoryColors
                        ]
                      }`}
                    >
                      {event.category}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2d5f62] hover:to-[#1fa89f] text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        size="sm"
                        asChild
                      >
                        <Link
                          href="https://forms.gle/your-google-form-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {getTranslatedText("registerNow", "Register Now")}
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent transition-colors duration-300 hover:bg-clip-text hover:text-transparent hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC]"
                        asChild
                      >
                        <Link href="/latest/events">
                          {getTranslatedText("learnMore", "Learn More")}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
