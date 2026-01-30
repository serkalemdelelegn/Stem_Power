"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { fetchHero, type HeroSlide } from "@/lib/api-content";
import { useApp } from "@/lib/app-context";

export function HeroSection() {
  const { selectedLanguage } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
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

  useEffect(() => {
    const loadHero = async () => {
      try {
        const backendSlides = await fetchHero();
        if (backendSlides && backendSlides.length > 0) {
          setSlides(backendSlides);
        } else {
          setSlides([]);
        }
      } catch (error) {
        console.error("Failed to load hero:", error);
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHero();
  }, []);

  // Translation effect
  useEffect(() => {
    if (selectedLanguage === "en" || slides.length === 0) {
      setTranslatedContent({});
      return;
    }

    const translateContent = async () => {
      setTranslating(true);
      const translations: Record<string, string> = {};

      try {
        // Translate slide content
        for (let i = 0; i < slides.length; i++) {
          const slide = slides[i];
          if (slide.title) {
            translations[`slide_${i}_title`] = await translateText(
              slide.title,
              selectedLanguage
            );
          }
          if (slide.subtitle) {
            translations[`slide_${i}_subtitle`] = await translateText(
              slide.subtitle,
              selectedLanguage
            );
          }
          if (slide.description) {
            translations[`slide_${i}_description`] = await translateText(
              slide.description,
              selectedLanguage
            );
          }
        }

        // Translate stat labels
        const statKeys = new Set<string>();
        slides.forEach((slide) => {
          if (slide.stats) {
            Object.keys(slide.stats).forEach((key) => statKeys.add(key));
          }
        });

        for (const key of statKeys) {
          translations[`stat_${key}`] = await translateText(
            key,
            selectedLanguage
          );
        }

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating hero content:", error);
      } finally {
        setTranslating(false);
      }
    };

    translateContent();
  }, [selectedLanguage, slides]);

  const getTranslatedText = (key: string, fallback: string): string => {
    if (selectedLanguage === "en") return fallback;
    return translatedContent[key] || fallback;
  };

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % slides.length),
      7000
    );
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () =>
    setCurrentSlide((prev) =>
      slides.length > 0 ? (prev + 1) % slides.length : 0
    );
  const prevSlide = () =>
    setCurrentSlide((prev) =>
      slides.length > 0 ? (prev - 1 + slides.length) % slides.length : 0
    );

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-[65vh] lg:min-h-[480px] overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC]">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
      <div className="absolute top-12 left-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-12 right-6 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl" />

      {/* Main Content */}
      <div className="container mx-auto px-4 max-w-6xl relative z-10 py-8 flex flex-col lg:flex-row items-center gap-8">
        {/* Text Section */}
        <div className="flex-1 text-white space-y-5 lg:space-y-6">
          {/* Subtitle Badge */}
          {isLoading ? (
            <p className="text-white/80">Loading hero content...</p>
          ) : !slide ? (
            <p className="text-white/80">No hero content available.</p>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 border-white/30 backdrop-blur-sm text-sm lg:text-base font-semibold shadow-sm">
                <Sparkles className="h-3 w-3 lg:h-4" />
                {getTranslatedText(
                  `slide_${currentSlide}_subtitle`,
                  slide.subtitle
                )}
              </div>

              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold leading-snug">
                {getTranslatedText(`slide_${currentSlide}_title`, slide.title)}
              </h1>

              <p className="text-base lg:text-lg xl:text-xl text-white/90 leading-relaxed">
                {getTranslatedText(
                  `slide_${currentSlide}_description`,
                  slide.description || ""
                )}
              </p>

              {slide.stats && (
                <div className="flex flex-wrap gap-6 lg:gap-8 pt-2">
                  {Object.entries(slide.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-xl lg:text-3xl font-bold">
                        {value}
                      </div>
                      <div className="text-sm lg:text-base text-white/80 capitalize font-medium">
                        {getTranslatedText(`stat_${key}`, key)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Image Section */}
        <div className="flex-1 relative w-full aspect-video sm:aspect-4/3 lg:h-[420px] min-h-[250px] flex items-center justify-center">
          {isLoading && <div className="text-white/80">Loading image...</div>}
          {!isLoading && slides.length === 0 && (
            <div className="text-white/80">No hero images available.</div>
          )}
          {slides.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-1000 ${
                i === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
            >
              <div className="h-full w-full rounded-2xl overflow-hidden shadow-xl border border-white/20">
                <img
                  src={s.image || "/placeholder.svg"}
                  alt={s.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 0 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur border shadow-md hover:shadow-lg transition-all hover:scale-110 z-20"
            onClick={prevSlide}
            aria-label="Previous hero slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur border shadow-md hover:shadow-lg transition-all hover:scale-110 z-20"
            onClick={nextSlide}
            aria-label="Next hero slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "bg-white shadow-md scale-125"
                  : "bg-white/50 hover:bg-white/70 hover:scale-110"
              }`}
            />
          ))}
        </div>
      )}

      {/* Bottom Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
