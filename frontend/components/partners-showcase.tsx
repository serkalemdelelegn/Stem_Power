"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPartners, type Partner } from "@/lib/api-content";
import { useApp } from "@/lib/app-context";

export function PartnersShowcase() {
  const { selectedLanguage } = useApp();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<
    Record<string, string>
  >({});
  const itemsPerView = 6;

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
        translations.ourPartners = await translateText(
          "Our Partners",
          selectedLanguage
        );
        translations.partnersDescription = await translateText(
          "We collaborate with leading organizations, institutions, and companies to bring world-class STEM education to Ethiopian students across the nation.",
          selectedLanguage
        );
        translations.loadingPartners = await translateText(
          "Loading partners...",
          selectedLanguage
        );
        translations.noPartnersAvailable = await translateText(
          "No partners available.",
          selectedLanguage
        );
        translations.interestedInPartnering = await translateText(
          "Interested in partnering with STEMpower Ethiopia?",
          selectedLanguage
        );
        translations.becomeAPartner = await translateText(
          "Become a Partner",
          selectedLanguage
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating partners content:", error);
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

  // Fetch partners from API
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await fetchPartners();
        setPartners(data);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPartners();
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying || partners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) => (prev + 1) % Math.ceil(partners.length / itemsPerView)
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, partners.length, itemsPerView]);

  const nextSlide = () => {
    if (partners.length === 0) return;
    setCurrentIndex(
      (prev) => (prev + 1) % Math.ceil(partners.length / itemsPerView)
    );
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (partners.length === 0) return;
    setCurrentIndex(
      (prev) =>
        (prev - 1 + Math.ceil(partners.length / itemsPerView)) %
        Math.ceil(partners.length / itemsPerView)
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-1 bg-linear-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-center text-balance text-[#367375]">
            {getTranslatedText("ourPartners", "Our Partners")}
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {getTranslatedText(
              "partnersDescription",
              "We collaborate with leading organizations, institutions, and companies to bring world-class STEM education to Ethiopian students across the nation."
            )}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {getTranslatedText("loadingPartners", "Loading partners...")}
            </p>
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {getTranslatedText(
                "noPartnersAvailable",
                "No partners available."
              )}
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Array.from({
                  length: Math.ceil(partners.length / itemsPerView),
                }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 px-4">
                      {partners
                        .slice(
                          slideIndex * itemsPerView,
                          (slideIndex + 1) * itemsPerView
                        )
                        .map((partner) => (
                          <a
                            key={partner.id}
                            href={partner.website || "#"}
                            target={partner.website ? "_blank" : "_self"}
                            rel={
                              partner.website
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="group transition-all duration-300 hover:scale-105"
                            onMouseEnter={() => setIsAutoPlaying(false)}
                            onMouseLeave={() => setIsAutoPlaying(true)}
                          >
                            <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30 h-28 flex items-center justify-center">
                              <img
                                src={partner.logo || "/placeholder.svg"}
                                alt={partner.name}
                                className="w-full h-full object-contain transition-all duration-300"
                                title={partner.name}
                              />
                            </div>
                          </a>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-background/95 backdrop-blur-sm shadow-lg hover:bg-background z-10"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-background/95 backdrop-blur-sm shadow-lg hover:bg-background z-10"
              onClick={nextSlide}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({
                length: Math.ceil(partners.length / itemsPerView),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            {getTranslatedText(
              "interestedInPartnering",
              "Interested in partnering with STEMpower Ethiopia?"
            )}
          </p>
          <Button
            size="lg"
            asChild
            className="shadow-lg hover:shadow-xl transition-all  bg-linear-to-br from-[#367375] to-[#24C3BC] text-white"
          >
            <a href="/contact">
              {getTranslatedText("becomeAPartner", "Become a Partner")}
            </a>
          </Button>{" "}
          <br /> <br />
          <br />
        </div>
      </div>
    </section>
  );
}
