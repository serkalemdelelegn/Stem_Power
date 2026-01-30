"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Download,
  ArrowLeft,
  Share2,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Newsletter as NewsletterType } from "@/lib/api-types";
import { useParams } from "next/navigation";
import { fetchNewsletterBySlug } from "@/lib/api-news-newsletter";
import { useApp } from "@/lib/app-context";

// Remove slug normalization and any fabricated fields.

export default function NewsletterDetailPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const params = useParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [newsletter, setNewsletter] = useState<NewsletterType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    newsletterTitle?: string;
    newsletterExcerpt?: string;
    newsletterCategory?: string;
    newsletterContent?: string;
    // Static UI text translations
    loadingNewsletter?: string;
    newsletterNotFound?: string;
    couldNotLoad?: string;
    newsletterDoesNotExist?: string;
    backToNewsletters?: string;
    downloadPDF?: string;
    share?: string;
    shareNewsletter?: string;
    shareOnTwitter?: string;
    shareOnFacebook?: string;
    shareOnLinkedIn?: string;
    shareOnWhatsApp?: string;
    copyLinkToClipboard?: string;
    successfulCopy?: string;
  }>({});

  useEffect(() => {
    let ignore = false;
    const fetchNewsletter = async () => {
      try {
        setIsLoading(true);
        setLoadError(false);
        if (!slug) {
          setLoadError(true);
          setIsLoading(false);
          return;
        }
        const data = await fetchNewsletterBySlug(slug);
        if (!ignore) {
          if (data) {
            setNewsletter(data);
          } else {
            setLoadError(true);
            setNewsletter(null);
          }
        }
      } catch (error) {
        console.error("Failed to load newsletter", error);
        setLoadError(true);
        setNewsletter(null);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchNewsletter();
    return () => {
      ignore = true;
    };
  }, [slug]);

  // Translate all dynamic content
  useEffect(() => {
    // Translation function
    const translateText = async (
      text: string,
      targetLang: "en" | "am"
    ): Promise<string> => {
      if (!text || targetLang === "en") return text;

      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLanguage: targetLang }),
        });

        if (!response.ok) {
          console.error("Translation failed:", await response.text());
          return text;
        }

        const data = await response.json();
        return data.translatedText || text;
      } catch (error) {
        console.error("Translation error:", error);
        return text;
      }
    };

    const translateDynamicContent = async (targetLang: "en" | "am") => {
      if (targetLang === "en") {
        setTranslatedContent({});
        return;
      }

      if (isLoading || !newsletter) return;

      setTranslating(true);
      try {
        const translations: any = {};

        // Translate newsletter content
        if (newsletter?.title)
          translations.newsletterTitle = await translateText(
            newsletter.title,
            targetLang
          );
        if (newsletter?.excerpt)
          translations.newsletterExcerpt = await translateText(
            newsletter.excerpt,
            targetLang
          );
        if (newsletter?.category)
          translations.newsletterCategory = await translateText(
            newsletter.category,
            targetLang
          );
        if (newsletter?.content)
          translations.newsletterContent = await translateText(
            newsletter.content,
            targetLang
          );

        // Translate static UI text
        translations.loadingNewsletter = await translateText(
          "Loading newsletter...",
          targetLang
        );
        translations.newsletterNotFound = await translateText(
          "Newsletter Not Found",
          targetLang
        );
        translations.couldNotLoad = await translateText(
          "We couldn't load this newsletter. Please try again later.",
          targetLang
        );
        translations.newsletterDoesNotExist = await translateText(
          "The newsletter you are looking for doesn't exist.",
          targetLang
        );
        translations.backToNewsletters = await translateText(
          "Back to Newsletters",
          targetLang
        );
        translations.downloadPDF = await translateText(
          "Download PDF",
          targetLang
        );
        translations.share = await translateText("Share", targetLang);
        translations.shareNewsletter = await translateText(
          "Share Newsletter",
          targetLang
        );
        translations.shareOnTwitter = await translateText(
          "Share on Twitter",
          targetLang
        );
        translations.shareOnFacebook = await translateText(
          "Share on Facebook",
          targetLang
        );
        translations.shareOnLinkedIn = await translateText(
          "Share on LinkedIn",
          targetLang
        );
        translations.shareOnWhatsApp = await translateText(
          "Share on WhatsApp",
          targetLang
        );
        translations.copyLinkToClipboard = await translateText(
          "Copy Link to Clipboard",
          targetLang
        );
        translations.successfulCopy = await translateText(
          "✓ Successful copy",
          targetLang
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    if (!isLoading && newsletter) {
      translateDynamicContent(selectedLanguage);
    }
  }, [selectedLanguage, newsletter, isLoading]);

  // Helper function to get translated text
  const getTranslatedText = (key: string, fallback: string): string => {
    if (
      selectedLanguage === "en" ||
      !translatedContent[key as keyof typeof translatedContent]
    ) {
      return fallback;
    }
    return (
      (translatedContent[key as keyof typeof translatedContent] as string) ||
      fallback
    );
  };

  // Get translated or original content
  const getTranslated = (key: string, original: string): string => {
    if (
      selectedLanguage === "en" ||
      !translatedContent[key as keyof typeof translatedContent]
    ) {
      return original;
    }
    return (
      (translatedContent[key as keyof typeof translatedContent] as string) ||
      original
    );
  };

  // Use translated content
  const displayNewsletterTitle = newsletter
    ? getTranslated("newsletterTitle", newsletter.title || "")
    : "";
  const displayNewsletterExcerpt = newsletter
    ? getTranslated("newsletterExcerpt", newsletter.excerpt || "")
    : "";
  const displayNewsletterCategory = newsletter
    ? getTranslated("newsletterCategory", newsletter.category || "")
    : "";
  const displayNewsletterContent = newsletter
    ? getTranslated("newsletterContent", newsletter.content || "")
    : "";

  const images = newsletter?.image ? [newsletter.image] : [];

  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoRotating, newsletter?.image]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsAutoRotating(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoRotating(false);
  };

  const handleDownload = async () => {
    if (!newsletter) return;
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(54, 115, 117);
      doc.text(newsletter.title || "", 20, 20, { maxWidth: 170 });

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Date: ${newsletter.date || ""}`, 20, 40);
      doc.text(`Author: ${newsletter.author || ""}`, 20, 48);
      doc.text(`Category: ${newsletter.category || ""}`, 20, 56);

      doc.setDrawColor(36, 195, 188);
      doc.line(20, 62, 190, 62);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const excerptLines = doc.splitTextToSize(newsletter.excerpt || "", 170);
      doc.text(excerptLines, 20, 70);

      const plainContent = (newsletter.content || "")
        .replace(/<[^>]*>/g, "")
        .trim();
      const contentLines = doc.splitTextToSize(plainContent, 170);
      let yPosition = 70 + excerptLines.length * 7 + 10;

      contentLines.forEach((line: string) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 7;
      });

      if (!newsletter.slug) {
        return; // No filename available from backend; do not fabricate
      }
      doc.save(`${newsletter.slug}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      const element = document.createElement("a");
      const sanitizedContent = (newsletter.content || "").replace(
        /<[^>]*>/g,
        ""
      );
      const file = new Blob(
        [
          `${newsletter.title}\n\n${
            newsletter.excerpt || ""
          }\n\n${sanitizedContent}`,
        ],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = `${newsletter.slug}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleShare = async () => {
    if (!newsletter) return;
    setShowShareModal(true);
  };

  const shareToSocial = (platform: string) => {
    if (!newsletter) return;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `${newsletter.title} - ${newsletter.excerpt}`;

    const urls: { [key: string]: string } = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        shareText + " " + shareUrl
      )}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
    }
  };

  const copyToClipboard = async () => {
    if (!newsletter) return;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `${newsletter.title}\n${newsletter.excerpt}\n${shareUrl}`;

    try {
      await navigator.clipboard.writeText(shareText);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!newsletter && isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        <Header />
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {getTranslatedText("loadingNewsletter", "Loading newsletter...")}
        </div>
        <Footer />
      </div>
    );
  }

  if (!newsletter && !isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-semibold">
                {getTranslatedText(
                  "newsletterNotFound",
                  "Newsletter Not Found"
                )}
              </h2>
              <p className="text-muted-foreground">
                {loadError
                  ? getTranslatedText(
                      "couldNotLoad",
                      "We couldn't load this newsletter. Please try again later."
                    )
                  : getTranslatedText(
                      "newsletterDoesNotExist",
                      "The newsletter you are looking for doesn't exist."
                    )}
              </p>
              <Button asChild className="bg-[#367375] hover:bg-[#285657]">
                <Link href="/latest/news/newsletter">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {getTranslatedText(
                    "backToNewsletters",
                    "Back to Newsletters"
                  )}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!newsletter) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
        <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-13">
          <Button
            asChild
            variant="ghost"
            className="mb-6 text-white hover:bg-white/20 -ml-4"
          >
            <Link href="/latest/news/newsletter">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {getTranslatedText("backToNewsletters", "Back to Newsletters")}
            </Link>
          </Button>

          <Badge className="mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30">
            {displayNewsletterCategory || "Not added yet"}
          </Badge>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            {displayNewsletterTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{newsletter.date || "Not added yet"}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{newsletter.author || "Not added yet"}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              className="bg-white text-[#367375] hover:bg-white/90"
            >
              <Download className="w-4 h-4 mr-2" />
              {getTranslatedText("downloadPDF", "Download PDF")}
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/20 bg-transparent"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {getTranslatedText("share", "Share")}
            </Button>
          </div>
        </div>
        <br />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent" />
      </section>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-[#367375]">
                  Share Newsletter
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => shareToSocial("twitter")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  <Twitter className="w-5 h-5" />
                  Share on Twitter
                </button>
                <button
                  onClick={() => shareToSocial("facebook")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  <Facebook className="w-5 h-5" />
                  Share on Facebook
                </button>
                <button
                  onClick={() => shareToSocial("linkedin")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  <Linkedin className="w-5 h-5" />
                  Share on LinkedIn
                </button>
                <button
                  onClick={() => shareToSocial("whatsapp")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  <Mail className="w-5 h-5" />
                  Share on WhatsApp
                </button>
              </div>

              <button
                onClick={copyToClipboard}
                className={`w-full p-3 rounded-lg border-2 transition-all duration-300 font-semibold relative overflow-hidden ${
                  isCopied
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-[#24C3BC] text-[#367375] hover:bg-[#24C3BC]/10"
                }`}
              >
                <div className="flex flex-col items-center justify-center min-h-6">
                  <span
                    className={`transition-all duration-300 ${
                      isCopied ? "opacity-0 -translate-y-2" : "opacity-100"
                    }`}
                  >
                    Copy Link to Clipboard
                  </span>
                  <span
                    className={`absolute transition-all duration-300 ${
                      isCopied
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    }`}
                  >
                    ✓ Successful copy
                  </span>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="relative group">
          <div className="relative h-72 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
            {images.length > 0 ? (
              <img
                src={images[currentImageIndex]}
                alt={`${newsletter.title || ""} - Image ${
                  currentImageIndex + 1
                }`}
                className="w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/20 text-muted-foreground">
                Not added yet
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg z-20"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setIsAutoRotating(false);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentImageIndex
                        ? "bg-white w-8 h-2"
                        : "bg-white/50 w-2 h-2 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="border-0 shadow-xl overflow-hidden bg-white">
          <CardContent className="p-8 lg:p-16">
            <div
              className="prose prose-xl max-w-none
              prose-headings:font-bold prose-headings:text-[#367375]
              prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-8 prose-h2:border-b-4 prose-h2:border-[#24C3BC] prose-h2:pb-4 prose-h2:leading-tight
              prose-h3:text-2xl prose-h3:text-[#24C3BC] prose-h3:mt-10 prose-h3:mb-6 prose-h3:font-semibold
              prose-p:text-gray-800 prose-p:leading-9 prose-p:mb-8 prose-p:text-lg prose-p:tracking-normal
              prose-strong:text-[#367375] prose-strong:font-bold
              prose-em:text-[#24C3BC] prose-em:italic
              prose-ul:my-10 prose-ul:space-y-4 prose-ul:pl-8
              prose-li:text-gray-800 prose-li:leading-8 prose-li:text-lg prose-li:mb-3
              prose-li:marker:text-[#24C3BC] prose-li:marker:font-bold
              prose-a:text-[#24C3BC] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-4 prose-blockquote:border-[#24C3BC] prose-blockquote:bg-linear-to-br prose-blockquote:from-[#367375]/5 prose-blockquote:to-[#24C3BC]/5 prose-blockquote:pl-8 prose-blockquote:py-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:my-10 prose-blockquote:rounded-r-lg
              prose-code:bg-gray-100 prose-code:text-[#367375] prose-code:px-3 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-lg prose-pre:overflow-x-auto
            "
            >
              {displayNewsletterContent ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: displayNewsletterContent,
                  }}
                />
              ) : (
                <p className="text-muted-foreground">
                  Content has not been added yet.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Newsletter Subscription CTA */}

      <Footer />
    </div>
  );
}
