"use client";

import Image from "next/image";
import { Users, Quote } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useApp } from "@/lib/app-context";

const testimonyStatic = {
  en: {
    badge: "Testimonials",
    heading: "What Our Partners Say",
    subtitle:
      "Voices from educators and leaders who’ve seen the transformative power of STEMpower across Ethiopia.",
  },
  am: {
    badge: "ምስክሮች",
    heading: "የአጋሮቻችን ድምጽ",
    subtitle: "በኢትዮጵያ ውስጥ የስቴምፓወር ተፅዕኖን የተመለከቱ አስተማሪዎችና መሪዎች ድምጽ።",
  },
};

type TestimonyLang = keyof typeof testimonyStatic;
type TestimonyKey = keyof typeof testimonyStatic.en;

interface Testimonial {
  id?: string;
  name: string;
  role: string;
  message?: string;
  quote?: string;
  image: string;
}

interface TestimonySectionProps {
  testimonials?: Testimonial[];
}

export function TestimonySection({
  testimonials: propTestimonials,
}: TestimonySectionProps) {
  const { selectedLanguage } = useApp();
  const lang: TestimonyLang = selectedLanguage === "am" ? "am" : "en";
  const t = (key: TestimonyKey) =>
    testimonyStatic[lang]?.[key] ?? testimonyStatic.en[key];

  // Default testimonials if none provided
  const defaultTestimonials: Testimonial[] = [
    {
      name: "Mekdes Alemu",
      role: "STEM Coordinator, Bahir Dar",
      image: "/client-1.jpg",
      quote:
        "STEMpower has transformed how our students engage with science — they now explore, innovate, and think like true scientists.",
    },
    {
      name: "Dr. Samuel Tadesse",
      role: "University Dean, Addis Ababa",
      image: "/client-2.jpg",
      quote:
        "Their hands-on approach inspires creativity and confidence. Our students are now more curious and eager to experiment with technology.",
    },
    {
      name: "Selamawit Bekele",
      role: "Teacher, Hawassa",
      image: "/client-3.jpg",
      quote:
        "STEMpower has given our learners a platform to innovate. The progress we've seen in just a year is remarkable.",
    },
    {
      name: "Abel Kassa",
      role: "NGO Representative, Mekelle",
      image: "/client-4.jpg",
      quote:
        "Working with STEMpower is inspiring. Their vision of empowering youth through innovation aligns perfectly with our mission.",
    },
    {
      name: "Lidya Girma",
      role: "Education Program Officer",
      image: "/client-5.jpg",
      quote:
        "The impact of STEMpower on young minds is transformative — they nurture curiosity, creativity, and confidence in every learner.",
    },
  ];

  // Use API testimonials if provided, otherwise use defaults
  const testimonials =
    propTestimonials && propTestimonials.length > 0
      ? propTestimonials.map((t) => ({
          ...t,
          quote: t.message || t.quote || "",
          image: t.image || "/placeholder.svg",
        }))
      : defaultTestimonials;
  const gradientTextClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";
  const gradientButtonClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all";
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 opacity-[0.06] bg-linear-to-br from-[#367375] via-[#24C3BC] to-[#24C3BC]" />

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-5 bg-linear-to-r from-[#367375] to-[#24C3BC] text-white shadow-md">
            <Users className="h-4 w-4" />
            {t("badge")}
          </div>
          <h2
            className={`text-4xl md:text-4xl mb-6 ${gradientTextClass} text-balance`}
          >
            {t("heading")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
          className="relative max-w-6xl mx-auto"
        >
          <CarouselContent className="overflow-visible">
            {testimonials.map((item, index) => (
              <CarouselItem
                key={item.id || index}
                className="basis-full sm:basis-1/2 lg:basis-1/3 px-4 flex flex-col"
              >
                <Card className="bg-white border border-gray-100 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between h-full p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Profile */}
                    <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-offset-2 ring-[#24C3BC]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Quote Icon */}
                    <Quote className="w-6 h-6 text-[#24C3BC] opacity-70" />
                    {/* Quote Text */}
                    <p className="text-gray-700 italic text-sm leading-relaxed">
                      "{item.quote || item.message || ""}"
                    </p>
                  </div>
                  {/* Name & Role */}
                  <div className="text-center mt-4">
                    <h4 className="font-semibold text-lg text-gray-900">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-500">{item.role}</p>
                  </div>
                </Card>
                <br />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Carousel Arrows */}
          <CarouselPrevious className="bg-linear-to-r from-[#367375] to-[#24C3BC] text-white border-none hover:opacity-90 transition shadow-md" />
          <CarouselNext className="bg-linear-to-r from-[#367375] to-[#24C3BC] text-white border-none hover:opacity-90 transition shadow-md" />
        </Carousel>
      </div>
    </section>
  );
}
