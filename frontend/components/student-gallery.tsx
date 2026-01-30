"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, Award } from "lucide-react";
import { fetchGalleryItems, type GalleryItem } from "@/lib/api-content";
import { useApp } from "@/lib/app-context";

export function StudentGallery() {
  const { selectedLanguage } = useApp();
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
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
        translations.studentShowcase = await translateText(
          "Student Showcase",
          selectedLanguage
        );
        translations.ourStudentsInAction = await translateText(
          "Our Students in Action",
          selectedLanguage
        );
        translations.galleryDescription = await translateText(
          "Witness the incredible work being done by Ethiopian students across our STEM centers, from cutting-edge research to innovative entrepreneurship projects.",
          selectedLanguage
        );
        translations.all = await translateText("All", selectedLanguage);
        translations.participants = await translateText(
          "participants",
          selectedLanguage
        );
        translations.activeProject = await translateText(
          "Active Project",
          selectedLanguage
        );
        translations.loadingGalleryItems = await translateText(
          "Loading gallery items...",
          selectedLanguage
        );
        translations.noGalleryItems = await translateText(
          "No gallery items available yet",
          selectedLanguage
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating gallery content:", error);
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
    const loadGallery = async () => {
      try {
        const items = await fetchGalleryItems();
        setGalleryItems(items);
      } catch (error) {
        console.error("Failed to load gallery items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGallery();
  }, []);

  const allCategoryText = getTranslatedText("all", "All");
  const categories = [
    "All", // Keep "All" as the key for filtering
    ...new Set(galleryItems.map((item) => item.category)),
  ];

  const filteredItems =
    selectedCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(filteredItems.length / 3));
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) =>
        (prev - 1 + Math.ceil(filteredItems.length / 3)) %
        Math.ceil(filteredItems.length / 3)
    );
  };

  const visibleItems = filteredItems.slice(
    currentIndex * 3,
    (currentIndex + 1) * 3
  );
  const gradientTextClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";
  const gradientButtonClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all";

  return (
    <section className="py-10 bg-linear-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-white text-sm font-medium mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC]">
            <Users className="h-4 w-4" />
            {getTranslatedText("studentShowcase", "Student Showcase")}
          </div>
          <h2
            className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
          >
            {getTranslatedText("ourStudentsInAction", "Our Students in Action")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            {getTranslatedText(
              "galleryDescription",
              "Witness the incredible work being done by Ethiopian students across our STEM centers, from cutting-edge research to innovative entrepreneurship projects."
            )}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentIndex(0);
              }}
              className={`rounded-full transition-all hover:scale-105 
                ${
                  selectedCategory === category
                    ? "bg-linear-to-br from-[#2b5d5f] to-[#1fa39e] text-white border-none hover:from-[#214b4c] hover:to-[#188982]"
                    : "border border-primary/20 text-primary bg-transparent hover:bg-linear-to-br hover:from-[#367375] hover:to-[#24C3BC] hover:text-white"
                }`}
            >
              {category === "All" ? allCategoryText : category}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="relative">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">
                {getTranslatedText(
                  "loadingGalleryItems",
                  "Loading gallery items..."
                )}
              </p>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">
                {getTranslatedText(
                  "noGalleryItems",
                  "No gallery items available yet"
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {visibleItems.map((item) => (
                  <Card
                    key={item.id}
                    className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-card/50 backdrop-blur"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-primary/90 text-white bg-linear-to-br from-[#367375] to-[#24C3BC]">
                        {item.category}
                      </Badge>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4" />
                          {item.participants} participants
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="font-medium">{item.location}</span>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>
                            {getTranslatedText(
                              "activeProject",
                              "Active Project"
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Navigation */}
              {Math.ceil(filteredItems.length / 3) > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevSlide}
                    className="rounded-full hover:scale-110 transition-all bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex gap-2">
                    {Array.from({
                      length: Math.ceil(filteredItems.length / 3),
                    }).map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? "bg-primary w-8"
                            : "bg-muted-foreground/30"
                        }`}
                        onClick={() => setCurrentIndex(index)}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextSlide}
                    className="rounded-full hover:scale-110 transition-all bg-transparent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
