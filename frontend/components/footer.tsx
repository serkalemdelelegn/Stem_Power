"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/lib/app-context";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface FooterLink {
  id: string;
  label: string;
  url: string;
}

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

interface FooterData {
  logo: string;
  description: string;
  socialLinks: SocialLink[];
  sections: FooterSection[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  copyrightText: string;
}

const SOCIAL_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

export function Footer() {
  const { selectedLanguage } = useApp();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
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
      if (!footerData) return;

      setTranslating(true);
      const translations: Record<string, string> = {};

      try {
        translations.stayConnected = await translateText(
          "Stay Connected",
          selectedLanguage
        );
        translations.subscribeToNewsletter = await translateText(
          "Subscribe to our newsletter",
          selectedLanguage
        );
        translations.enterYourEmail = await translateText(
          "Enter your email",
          selectedLanguage
        );
        translations.subscribe = await translateText(
          "Subscribe",
          selectedLanguage
        );
        translations.loadingFooter = await translateText(
          "Loading footer...",
          selectedLanguage
        );
        translations.successfullySubscribed = await translateText(
          "Successfully subscribed!",
          selectedLanguage
        );
        translations.thankYouSubscribing = await translateText(
          "Thank you for subscribing to our newsletter. You'll receive updates about our programs and impact.",
          selectedLanguage
        );
        translations.developedBy = await translateText(
          "Developed by",
          selectedLanguage
        );

        // Translate footer data
        if (footerData.description) {
          translations.footerDescription = await translateText(
            footerData.description,
            selectedLanguage
          );
        }
        if (footerData.copyrightText) {
          translations.copyrightText = await translateText(
            footerData.copyrightText,
            selectedLanguage
          );
        }
        // Translate section titles and link labels
        for (let i = 0; i < footerData.sections.length; i++) {
          const section = footerData.sections[i];
          translations[`section_${i}_title`] = await translateText(
            section.title,
            selectedLanguage
          );
          section.links.forEach(async (link, j) => {
            translations[`section_${i}_link_${j}_label`] = await translateText(
              link.label,
              selectedLanguage
            );
          });
        }

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating footer content:", error);
      } finally {
        setTranslating(false);
      }
    };

    translateContent();
  }, [selectedLanguage, footerData]);

  const getTranslatedText = (key: string, fallback: string): string => {
    if (selectedLanguage === "en") return fallback;
    return translatedContent[key] || fallback;
  };

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch("/api/footer");
        if (response.ok) {
          const data = await response.json();
          setFooterData(data);
        } else {
          // Use default data if fetch fails
          setFooterData({
            logo: "/STEMpower_s_logo.png",
            description:
              "Empowering Ethiopian youth through science, technology, engineering, and mathematics education.",
            socialLinks: [],
            sections: [],
            contactEmail: "info@stempowerethiopia.org",
            contactPhone: "+251 91 123 4567",
            contactAddress: "Addis Ababa, Ethiopia",
            copyrightText:
              "STEMpower Ethiopia. All rights reserved. | Empowering the next generation through STEM education.",
          });
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
        // Use default data on error
        setFooterData({
          logo: "/STEMpower_s_logo.png",
          description:
            "Empowering Ethiopian youth through science, technology, engineering, and mathematics education.",
          socialLinks: [],
          sections: [],
          contactEmail: "info@stempowerethiopia.org",
          contactPhone: "+251 91 123 4567",
          contactAddress: "Addis Ababa, Ethiopia",
          copyrightText:
            "STEMpower Ethiopia. All rights reserved. | Empowering the next generation through STEM education.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: getTranslatedText(
        "successfullySubscribed",
        "Successfully subscribed!"
      ),
      description: getTranslatedText(
        "thankYouSubscribing",
        "Thank you for subscribing to our newsletter. You'll receive updates about our programs and impact."
      ),
    });

    setEmail("");
    setIsSubmitting(false);
  };

  if (isLoading || !footerData) {
    return (
      <footer className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC]">
        <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
          <div className="text-center text-white">
            {getTranslatedText("loadingFooter", "Loading footer...")}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC]">
      <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-10 bg-cover bg-center" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={footerData.logo || "/STEMpower_s_logo.png"}
                alt="STEMpower Ethiopia Logo"
                width={150}
                height={50}
                className="h-10 w-auto bg-white/90 rounded px-2 py-1"
              />
            </Link>
            <p className="text-sm text-white/90 leading-relaxed">
              {getTranslatedText("footerDescription", footerData.description)}
            </p>
            <div className="flex space-x-2">
              {footerData.socialLinks.map((social) => {
                const IconComponent =
                  SOCIAL_ICONS[social.platform.toLowerCase()];
                if (!IconComponent) return null;
                return (
                  <Button
                    key={social.id}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    asChild
                  >
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconComponent className="h-4 w-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Sections */}
          {footerData.sections.map((section, sectionIndex) => (
            <div key={section.id} className="space-y-4">
              <h3 className="font-semibold text-white text-lg">
                {getTranslatedText(
                  `section_${sectionIndex}_title`,
                  section.title
                )}
              </h3>
              <nav className="flex flex-col space-y-2">
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={link.id}
                    href={link.url}
                    className="text-sm text-white/80 hover:text-white transition-colors"
                  >
                    {getTranslatedText(
                      `section_${sectionIndex}_link_${linkIndex}_label`,
                      link.label
                    )}
                  </Link>
                ))}
              </nav>
            </div>
          ))}

          {/* Contact & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-lg">
              {getTranslatedText("stayConnected", "Stay Connected")}
            </h3>
            <div className="space-y-3">
              {footerData.contactAddress && (
                <div className="flex items-start space-x-2 text-sm text-white/90">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      footerData.contactAddress
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {footerData.contactAddress}
                  </a>
                </div>
              )}
              {footerData.contactEmail && (
                <div className="flex items-center space-x-2 text-sm text-white/90">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a
                    href={`mailto:${footerData.contactEmail}`}
                    className="hover:text-white transition-colors"
                  >
                    {footerData.contactEmail}
                  </a>
                </div>
              )}
              {footerData.contactPhone && (
                <div className="flex items-center space-x-2 text-sm text-white/90">
                  <Phone className="h-4 w-4 shrink-0" />
                  <a
                    href={`tel:${footerData.contactPhone.replace(/\s/g, "")}`}
                    className="hover:text-white transition-colors"
                  >
                    {footerData.contactPhone}
                  </a>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">
                {getTranslatedText(
                  "subscribeToNewsletter",
                  "Subscribe to our newsletter"
                )}
              </p>
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <Input
                  placeholder={getTranslatedText(
                    "enterYourEmail",
                    "Enter your email"
                  )}
                  className="h-9 text-sm bg-white/90 border-white/20 placeholder:text-gray-500"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <Button
                  size="sm"
                  className="h-9 bg-white text-[#367375] hover:bg-white/90 font-semibold"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "..."
                    : getTranslatedText("subscribe", "Subscribe")}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm text-white/90">
            © {new Date().getFullYear()}{" "}
            {getTranslatedText(
              "copyrightText",
              footerData.copyrightText ||
                "STEMpower Ethiopia. All rights reserved."
            )}
          </p>
          <div className="mt-2 flex items-center justify-center text-xs text-white/80">
            {getTranslatedText("developedBy", "Developed by")}{" "}
            <Link
              href="https://cassiopeiatech.org/"
              className="ml-1 font-semibold text-white hover:underline"
            >
              Cassiopeia Tech
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
