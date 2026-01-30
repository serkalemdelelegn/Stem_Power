"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Users,
  CheckCircle2,
  MessageSquare,
  Info,
  Shield,
  FileText,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";
import Image from "next/image";

interface ContactInfo {
  address?: string;
  addressDetails?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  officeHours?: string;
  mapLink?: string;
  image?: string;
}

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
}

export default function ContactPage() {
  const { selectedLanguage } = useApp();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});
  const [isLoadingContact, setIsLoadingContact] = useState(true);
  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>(
    []
  );
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    fetchContactInfo();
    fetchSocialMediaLinks();
  }, []);

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
    if (selectedLanguage === "en" || isLoadingContact) {
      setTranslatedContent({});
      return;
    }

    const translateContent = async () => {
      setTranslating(true);
      const translations: Record<string, string> = {};

      try {
        // Hero section
        translations.getInTouch = await translateText(
          "Get in Touch",
          selectedLanguage
        );
        translations.letsTransform = await translateText(
          "Let's Transform STEM Education Together",
          selectedLanguage
        );
        translations.heroDescription = await translateText(
          "Whether you're interested in partnerships, volunteering, or learning more about our programs, we're here to help. Reach out and join us in empowering Ethiopia's future innovators.",
          selectedLanguage
        );
        translations.callUs = await translateText("Call Us", selectedLanguage);
        translations.emailUs = await translateText(
          "Email Us",
          selectedLanguage
        );

        // Map section
        translations.findUsOnMap = await translateText(
          "Find Us on the Map",
          selectedLanguage
        );
        translations.mapDescription = await translateText(
          "Visit our STEMpower Head Quarter in Addis Ababa. Click the map to get directions.",
          selectedLanguage
        );
        translations.openInGoogleMaps = await translateText(
          "Open in Google Maps",
          selectedLanguage
        );

        // Contact Information section
        translations.contactInformation = await translateText(
          "Contact Information",
          selectedLanguage
        );
        translations.contactInfoDescription = await translateText(
          "Multiple ways to reach us. Choose what works best for you.",
          selectedLanguage
        );
        translations.visitOurOffice = await translateText(
          "Visit Our Office",
          selectedLanguage
        );
        translations.addressNotSet = await translateText(
          "Address not set",
          selectedLanguage
        );
        translations.getDirections = await translateText(
          "Get Directions",
          selectedLanguage
        );
        translations.callNow = await translateText(
          "Call Now",
          selectedLanguage
        );
        translations.sendEmail = await translateText(
          "Send Email",
          selectedLanguage
        );
        translations.emailNotSet = await translateText(
          "Email not set",
          selectedLanguage
        );

        // Contact Form section
        translations.sendUsMessage = await translateText(
          "Send us a Message",
          selectedLanguage
        );
        translations.formDescription = await translateText(
          "Fill out the form below and we'll get back to you within 24 hours.",
          selectedLanguage
        );
        translations.messageSentSuccessfully = await translateText(
          "Message Sent Successfully!",
          selectedLanguage
        );
        translations.thankYouMessage = await translateText(
          "Thank you for contacting us. We'll respond within 24 hours.",
          selectedLanguage
        );
        translations.firstName = await translateText(
          "First Name",
          selectedLanguage
        );
        translations.lastName = await translateText(
          "Last Name",
          selectedLanguage
        );
        translations.email = await translateText("Email", selectedLanguage);
        translations.phoneNumber = await translateText(
          "Phone Number",
          selectedLanguage
        );
        translations.organization = await translateText(
          "Organization (Optional)",
          selectedLanguage
        );
        translations.subject = await translateText("Subject", selectedLanguage);
        translations.message = await translateText("Message", selectedLanguage);
        translations.selectSubject = await translateText(
          "Select a subject...",
          selectedLanguage
        );
        translations.studentsInquiry = await translateText(
          "Students Inquiry",
          selectedLanguage
        );
        translations.partnershipProposal = await translateText(
          "Partnership Proposal",
          selectedLanguage
        );
        translations.trainingRequest = await translateText(
          "Training Request",
          selectedLanguage
        );
        translations.stemClubSupport = await translateText(
          "STEM Club Support",
          selectedLanguage
        );
        translations.eventCollaboration = await translateText(
          "Event Collaboration",
          selectedLanguage
        );
        translations.other = await translateText("Other", selectedLanguage);
        translations.pleaseSpecify = await translateText(
          "Please specify",
          selectedLanguage
        );
        translations.messagePlaceholder = await translateText(
          "Tell us more about your inquiry, partnership ideas, or how you'd like to get involved...",
          selectedLanguage
        );
        translations.messageSent = await translateText(
          "Message Sent",
          selectedLanguage
        );
        translations.sending = await translateText(
          "Sending...",
          selectedLanguage
        );
        translations.sendMessage = await translateText(
          "Send Message",
          selectedLanguage
        );
        translations.responseTimeNote = await translateText(
          "We typically respond within 24 hours during business days",
          selectedLanguage
        );
        translations.fillRequiredFields = await translateText(
          "Please fill in all required fields.",
          selectedLanguage
        );
        translations.failedToSubmit = await translateText(
          "Failed to submit form. Please try again.",
          selectedLanguage
        );

        // Sidebar
        translations.officeHours = await translateText(
          "Office Hours",
          selectedLanguage
        );
        translations.observeHolidays = await translateText(
          "Note: We observe Ethiopian public holidays",
          selectedLanguage
        );
        translations.importantInformation = await translateText(
          "Important Information",
          selectedLanguage
        );
        translations.privacySecurity = await translateText(
          "Privacy & Security",
          selectedLanguage
        );
        translations.privacyDescription = await translateText(
          "Your information is secure and will only be used to respond to your inquiry.",
          selectedLanguage
        );
        translations.responseTime = await translateText(
          "Response Time",
          selectedLanguage
        );
        translations.responseTimeDescription = await translateText(
          "We typically respond within 24 hours during business days.",
          selectedLanguage
        );
        translations.languageSupport = await translateText(
          "Language Support",
          selectedLanguage
        );
        translations.languageSupportDescription = await translateText(
          "We provide support in English and Amharic for your convenience.",
          selectedLanguage
        );
        translations.connectWithUs = await translateText(
          "Connect With Us",
          selectedLanguage
        );
        translations.socialMediaDescription = await translateText(
          "Follow us on social media for daily updates, success stories, and opportunities.",
          selectedLanguage
        );
        translations.noSocialLinks = await translateText(
          "No social media links available",
          selectedLanguage
        );

        // Placeholders
        translations.firstNamePlaceholder = await translateText(
          "Abebe",
          selectedLanguage
        );
        translations.lastNamePlaceholder = await translateText(
          "Ayalew",
          selectedLanguage
        );
        translations.emailPlaceholder = await translateText(
          "abebe.ayalew@example.com",
          selectedLanguage
        );
        translations.phonePlaceholder = await translateText(
          "+251 91 234 5678",
          selectedLanguage
        );
        translations.organizationPlaceholder = await translateText(
          "Your school, company, or organization",
          selectedLanguage
        );
        translations.otherSubjectPlaceholder = await translateText(
          "Please describe your subject...",
          selectedLanguage
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    translateContent();
  }, [selectedLanguage, isLoadingContact]);

  const getTranslatedText = (key: string, fallback: string): string => {
    if (selectedLanguage === "en") return fallback;
    return translatedContent[key] || fallback;
  };

  const fetchContactInfo = async () => {
    try {
      setIsLoadingContact(true);
      const response = await fetch("/api/contact");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched contact info for frontend:", data);
        setContactInfo(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch contact info:", errorData);
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setIsLoadingContact(false);
    }
  };

  const fetchSocialMediaLinks = async () => {
    try {
      const response = await fetch("/api/contact/social-links");
      if (response.ok) {
        const data = await response.json();
        setSocialMediaLinks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching social media links:", error);
    }
  };

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      case "twitter":
      case "x":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "threads":
        return (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.186 3.998c-.43.002-1.066.014-1.82.096-1.953.213-3.273.904-4.432 2.063C4.775 7.316 4.084 8.636 3.87 10.59c-.082.754-.094 1.39-.092 1.82v.18c-.002.43.01 1.066.092 1.82.214 1.953.905 3.273 2.064 4.432 1.159 1.159 2.479 1.85 4.432 2.063.754.082 1.39.094 1.82.092h.18c.43.002 1.066-.01 1.82-.092 1.953-.213 3.273-.904 4.432-2.063 1.159-1.159 1.85-2.479 2.063-4.432.082-.754.094-1.39.092-1.82v-.18c.002-.43-.01-1.066-.092-1.82-.213-1.953-.904-3.273-2.063-4.432-1.159-1.159-2.479-1.85-4.432-2.063-.754-.082-1.39-.094-1.82-.096h-.18z" />
          </svg>
        );
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const formatSocialUrl = (url: string): string => {
    if (!url) return "#";
    // If URL doesn't start with http:// or https://, add https://
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };

  const getMapEmbedUrl = (mapLink: string | undefined): string => {
    if (!mapLink) return "";
    
    // If it's already an embed URL, return as is
    if (mapLink.includes("/embed") || mapLink.includes("embed")) {
      return mapLink;
    }
    
    // If it's a regular Google Maps URL, try to convert to embed format
    if (mapLink.includes("google.com/maps")) {
      try {
        const url = new URL(mapLink);
        
        // Try to extract coordinates from URL path (e.g., /@lat,lng,zoom)
        const pathMatch = mapLink.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)(?:,(\d+[zm]))?/);
        if (pathMatch) {
          const lat = pathMatch[1];
          const lng = pathMatch[2];
          const zoom = pathMatch[3] || "15z";
          return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM${zoom.replace('z', '')}!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;
        }
        
        // Try to extract place ID
        const placeId = url.searchParams.get("place_id");
        if (placeId) {
          return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${placeId}!2s!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus`;
        }
        
        // Try to extract the 'q' parameter (location query)
        const q = url.searchParams.get("q");
        if (q) {
          // For query-based URLs, use the standard embed format (no API key required)
          return `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
        }
        
        // If we can't parse it, try to use the URL as-is (might work for some formats)
        return mapLink;
      } catch (error) {
        console.error("Error parsing map URL:", error);
        // Return the original URL - it might still work
        return mapLink;
      }
    }
    
    // If it's not a Google Maps URL, return empty
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const firstName = (formData.get("firstName") as string)?.trim() || "";
    const lastName = (formData.get("lastName") as string)?.trim() || "";
    const email = (formData.get("email") as string)?.trim() || "";
    const phone = (formData.get("phone") as string)?.trim() || "";
    const organization = (formData.get("organization") as string)?.trim() || "";
    const subjectValue =
      selectedSubject || (formData.get("subject") as string) || "";
    const subject =
      subjectValue === "Other"
        ? (formData.get("otherSubject") as string)?.trim() || ""
        : subjectValue;
    const message = (formData.get("message") as string)?.trim() || "";

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      alert(
        getTranslatedText(
          "fillRequiredFields",
          "Please fill in all required fields."
        )
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          organization: organization || undefined,
          subject,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit form");
      }

      setFormSubmitted(true);
      form.reset();
      setSelectedSubject("");

      // Reset after 5 seconds
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : getTranslatedText(
              "failedToSubmit",
              "Failed to submit form. Please try again."
            );
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

          <div className="relative max-w-6xl mx-auto px-4 py-18 md:py-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-base font-medium mb-6">
                  <MessageSquare className="h-5 w-5" />
                  Get in Touch
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  Let's Transform STEM Education Together
                </h1>
                <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                  Whether you're interested in partnerships, volunteering, or
                  learning more about our programs, we're here to help. Reach
                  out and join us in empowering Ethiopia's future innovators.
                </p>
              </div>
              <div className="order-1 lg:order-2 flex justify-center relative">
                <div className="relative w-full sm:w-[90%] md:w-[95%] lg:w-[100%] aspect-[5/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                  {contactInfo.image ? (
                    <Image
                      src={contactInfo.image}
                      alt="STEMpower Ethiopia team and students"
                      fill
                      className="object-cover object-center"
                    />
                  ) : (
                    <Image
                      src="/ethiopian-students-working-with-science-equipment-.jpg"
                      alt="STEMpower Ethiopia team and students"
                      fill
                      className="object-cover object-center"
                    />
                  )}
                </div>

                {/* Call Us Card */}
                {contactInfo.phone && (
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 sm:p-4 border border-emerald-100">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {getTranslatedText("callUs", "Call Us")}
                        </div>
                        <div className="font-semibold text-sm sm:text-base text-black">
                          {contactInfo.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Us Card */}
                {contactInfo.email && (
                  <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-3 sm:p-4 border border-teal-100">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Email Us
                        </div>
                        <div className="font-semibold text-xs sm:text-sm text-black">
                          {contactInfo.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent" />
        </section>

        {/* Interactive Map Section */}
        <section className="py-16 bg-linear-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
                  {getTranslatedText("findUsOnMap", "Find Us on the Map")}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {getTranslatedText(
                    "mapDescription",
                    "Visit our STEMpower Head Quarter in Addis Ababa. Click the map to get directions."
                  )}
                </p>
              </div>

              {contactInfo.mapLink ? (
                <>
                  <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#367375]/20 h-[500px] md:h-[600px]">
                    {getMapEmbedUrl(contactInfo.mapLink) ? (
                      <iframe
                        src={getMapEmbedUrl(contactInfo.mapLink)}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="text-center p-8">
                          <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600 mb-2">Unable to load map</p>
                          <p className="text-sm text-gray-500">
                            Please check the map link format in the admin dashboard
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 text-center">
                    <Button
                      size="lg"
                      className="bg-linear-to-br from-[#367375] to-[#24C3BC] text-white font-semibold shadow-md hover:opacity-90 transition-all"
                      asChild
                    >
                      <a
                        href={
                          contactInfo.mapLink.includes("/embed")
                            ? contactInfo.mapLink.replace("/embed", "")
                            : contactInfo.mapLink
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="h-5 w-5 mr-2" />
                        {getTranslatedText("openInGoogleMaps", "Open in Google Maps")}
                      </a>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-[#367375]/20 h-[500px] md:h-[600px] bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2 text-lg font-semibold">
                      Map Not Available
                    </p>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                      The map link has not been configured yet. Please add a Google Maps link in the admin dashboard to display the location.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section
          id="contact-info"
          className="py-16 bg-linear-to-b from-white to-slate-50"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
                  {getTranslatedText(
                    "contactInformation",
                    "Contact Information"
                  )}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {getTranslatedText(
                    "contactInfoDescription",
                    "Multiple ways to reach us. Choose what works best for you."
                  )}
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Visit Our Office Card */}
                <Card className="text-center hover:shadow-xl transition-all hover:scale-105 border-2 border-[#367375]/30">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="bg-linear-to-br from-[#367375] to-[#24C3BC] bg-clip-text text-transparent text-xl font-semibold">
                      Visit Our Office
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {contactInfo.address || "Address not set"}
                      {contactInfo.addressDetails && (
                        <>
                          <br />
                          {contactInfo.addressDetails}
                        </>
                      )}
                    </p>
                    {contactInfo.mapLink && (
                      <Button
                        className="mt-4 w-full bg-linear-to-br from-[#367375] to-[#24C3BC] text-white font-semibold shadow-md hover:opacity-90 transition-all"
                        asChild
                      >
                        <a
                          href={
                            contactInfo.mapLink.includes("embed")
                              ? contactInfo.mapLink.replace("/embed", "")
                              : contactInfo.mapLink
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          {getTranslatedText("getDirections", "Get Directions")}
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Call Us Card */}
                <Card className="text-center hover:shadow-xl transition-all hover:scale-105 border-2 border-[#367375]/30">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="bg-linear-to-br from-[#367375] to-[#24C3BC] bg-clip-text text-transparent text-xl font-semibold">
                      Call Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {contactInfo.phone && (
                        <>
                          <a
                            href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                            className="hover:text-[#24C3BC] transition-colors"
                          >
                            {contactInfo.phone}
                          </a>
                          {contactInfo.mobile && <br />}
                        </>
                      )}
                      {contactInfo.mobile && (
                        <a
                          href={`tel:${contactInfo.mobile.replace(/\s/g, "")}`}
                          className="hover:text-[#24C3BC] transition-colors"
                        >
                          {contactInfo.mobile}
                        </a>
                      )}
                      {contactInfo.officeHours && (
                        <>
                          <br />
                          {contactInfo.officeHours}
                        </>
                      )}
                    </p>
                    {contactInfo.phone && (
                      <Button
                        className="mt-4 w-full bg-linear-to-br from-[#367375] to-[#24C3BC] text-white font-semibold shadow-md hover:opacity-90 transition-all"
                        asChild
                      >
                        <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {getTranslatedText("callNow", "Call Now")}
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Email Us Card */}
                <Card className="text-center hover:shadow-xl transition-all hover:scale-105 border-2 border-[#367375]/30">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="bg-linear-to-br from-[#367375] to-[#24C3BC] bg-clip-text text-transparent text-xl font-semibold">
                      Email Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {contactInfo.email ? (
                        <a
                          href={`mailto:${contactInfo.email}`}
                          className="hover:text-[#24C3BC] transition-colors"
                        >
                          {contactInfo.email}
                        </a>
                      ) : (
                        "Email not set"
                      )}
                    </p>
                    {contactInfo.email && (
                      <Button
                        className="mt-4 w-full bg-linear-to-br from-[#367375] to-[#24C3BC] text-white font-semibold shadow-md hover:opacity-90 transition-all"
                        asChild
                      >
                        <a href={`mailto:${contactInfo.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          {getTranslatedText("sendEmail", "Send Email")}
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section
          id="contact-form"
          className="py-16 bg-linear-to-b from-slate-50 to-[#F8FAFA]"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <Card className="border-2 border-[#367375]/30 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-3xl mb-2 bg-linear-to-br from-[#367375] to-[#24C3BC] bg-clip-text text-transparent">
                        Send us a Message
                      </CardTitle>
                      <CardDescription className="text-base text-muted-foreground">
                        Fill out the form below and we'll get back to you within
                        24 hours.
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      {formSubmitted && (
                        <div className="mb-6 p-4 bg-linear-to-br from-[#367375]/10 to-[#24C3BC]/10 border-2 border-[#367375]/30 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                          <CheckCircle2 className="w-6 h-6 text-[#24C3BC] shrink-0" />
                          <div>
                            <p className="font-semibold text-[#367375] text-lg">
                              {getTranslatedText(
                                "messageSentSuccessfully",
                                "Message Sent Successfully!"
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getTranslatedText(
                                "thankYouMessage",
                                "Thank you for contacting us. We'll respond within 24 hours."
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="firstName"
                              className="text-base font-medium"
                            >
                              First Name{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="firstName"
                              name="firstName"
                              placeholder="Abebe"
                              className="h-12 text-base border-2 border-[#367375]/30 focus:border-[#24C3BC] focus:ring-[#24C3BC]"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="lastName"
                              className="text-base font-medium"
                            >
                              {getTranslatedText("lastName", "Last Name")}{" "}
                              <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id="lastName"
                              name="lastName"
                              placeholder={getTranslatedText(
                                "lastNamePlaceholder",
                                "Ayalew"
                              )}
                              className="h-12 text-base border-2 border-[#367375]/30 focus:border-[#24C3BC] focus:ring-[#24C3BC]"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-base font-medium"
                          >
                            Email <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="abebe.ayalew@example.com"
                            className="h-12 text-base border-2 border-[#367375]/30 focus:border-[#24C3BC] focus:ring-[#24C3BC]"
                            required
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-base font-medium"
                          >
                            {getTranslatedText("phoneNumber", "Phone Number")}
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder={getTranslatedText(
                              "phonePlaceholder",
                              "+251 91 234 5678"
                            )}
                            className="h-12 text-base border-2 border-[#367375]/30 focus:border-[#24C3BC] focus:ring-[#24C3BC]"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="organization"
                            className="text-base font-medium"
                          >
                            Organization (Optional)
                          </Label>
                          <Input
                            id="organization"
                            name="organization"
                            placeholder="Your school, company, or organization"
                            className="h-12 text-base border-2 border-[#367375]/30 focus:border-[#24C3BC] focus:ring-[#24C3BC]"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="subject"
                            className="text-base font-medium"
                          >
                            {getTranslatedText("subject", "Subject")}{" "}
                            <span className="text-destructive">*</span>
                          </Label>

                          <select
                            id="subject"
                            name="subject"
                            required
                            disabled={isSubmitting}
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="h-12 text-base border-2 border-[#367375]/30 focus:border-[#24C3BC] focus:ring-[#24C3BC] rounded-md w-full px-3 outline-none transition-all"
                          >
                            <option value="">
                              {getTranslatedText(
                                "selectSubject",
                                "Select a subject..."
                              )}
                            </option>
                            <option value="Students Inquiry">
                              {getTranslatedText(
                                "studentsInquiry",
                                "Students Inquiry"
                              )}
                            </option>
                            <option value="Partnership Proposal">
                              {getTranslatedText(
                                "partnershipProposal",
                                "Partnership Proposal"
                              )}
                            </option>
                            <option value="Training Request">
                              {getTranslatedText(
                                "trainingRequest",
                                "Training Request"
                              )}
                            </option>
                            <option value="STEM Club Support">
                              {getTranslatedText(
                                "stemClubSupport",
                                "STEM Club Support"
                              )}
                            </option>
                            <option value="Event Collaboration">
                              {getTranslatedText(
                                "eventCollaboration",
                                "Event Collaboration"
                              )}
                            </option>
                            <option value="Other">
                              {getTranslatedText("other", "Other")}
                            </option>
                          </select>

                          {selectedSubject === "Other" && (
                            <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1">
                              <Label
                                htmlFor="otherSubject"
                                className="text-base font-medium"
                              >
                                {getTranslatedText(
                                  "pleaseSpecify",
                                  "Please specify"
                                )}
                              </Label>
                              <Input
                                id="otherSubject"
                                name="otherSubject"
                                type="text"
                                placeholder={getTranslatedText(
                                  "otherSubjectPlaceholder",
                                  "Please describe your subject..."
                                )}
                                className="h-12 text-base border-2 border-[#367375]/30 focus:border-[#24C3BC] focus:ring-[#24C3BC]"
                                required
                                disabled={isSubmitting}
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="message"
                            className="text-base font-medium"
                          >
                            {getTranslatedText("message", "Message")}{" "}
                            <span className="text-destructive">*</span>
                          </Label>
                          <Textarea
                            id="message"
                            name="message"
                            placeholder={getTranslatedText(
                              "messagePlaceholder",
                              "Tell us more about your inquiry, partnership ideas, or how you'd like to get involved..."
                            )}
                            className="min-h-[150px] text-base border-2 border-[#367375]/30 focus:border-[#24C3BC] focus:ring-[#24C3BC]"
                            required
                            disabled={isSubmitting}
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isSubmitting || formSubmitted}
                          className="w-full h-14 text-lg font-semibold bg-linear-to-r from-[#367375] to-[#24C3BC] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          {formSubmitted ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 mr-2" />
                              Message Sent
                            </>
                          ) : isSubmitting ? (
                            <>
                              <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                          {getTranslatedText(
                            "responseTimeNote",
                            "We typically respond within 24 hours during business days"
                          )}
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Office Hours */}
                  {contactInfo.officeHours && (
                    <Card className="border-2 border-[#367375]/20 hover:shadow-lg transition-all">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2 bg-linear-to-br from-[#367375] to-[#24C3BC] bg-clip-text text-transparent">
                          <Clock className="h-5 w-5 text-[#24C3BC]" />
                          {getTranslatedText("officeHours", "Office Hours")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="py-2">
                          <p className="text-sm text-muted-foreground">
                            {contactInfo.officeHours}
                          </p>
                        </div>
                        <div className="pt-3 mt-3 border-t border-[#367375]/10">
                          <p className="text-xs text-muted-foreground">
                            <strong>Note:</strong> We observe Ethiopian public
                            holidays
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Important Information */}
                  <Card className="border-2 border-[#367375]/20 hover:shadow-lg transition-all bg-linear-to-br from-[#367375]/5 to-[#24C3BC]/10">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2 bg-linear-to-br from-[#367375] to-[#24C3BC] bg-clip-text text-transparent">
                        <Info className="h-5 w-5 text-[#24C3BC]" />
                        {getTranslatedText(
                          "importantInformation",
                          "Important Information"
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#367375]/10">
                        <Shield className="h-5 w-5 text-[#24C3BC] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">
                            {getTranslatedText(
                              "privacySecurity",
                              "Privacy & Security"
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {getTranslatedText(
                              "privacyDescription",
                              "Your information is secure and will only be used to respond to your inquiry."
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#367375]/10">
                        <FileText className="h-5 w-5 text-[#24C3BC] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">
                            Response Time
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            We typically respond within 24 hours during business
                            days.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#367375]/10">
                        <MessageSquare className="h-5 w-5 text-[#24C3BC] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">
                            {getTranslatedText(
                              "languageSupport",
                              "Language Support"
                            )}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {getTranslatedText(
                              "languageSupportDescription",
                              "We provide support in English and Amharic for your convenience."
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Connect With Us */}
                  <Card className="border-2 border-[#367375]/20 hover:shadow-lg transition-all">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2 bg-linear-to-br from-[#367375] to-[#24C3BC] bg-clip-text text-transparent">
                        <Users className="h-5 w-5 text-[#24C3BC]" />
                        Connect With Us
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Follow us on social media for daily updates, success
                        stories, and opportunities.
                      </p>
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        {socialMediaLinks.length > 0 ? (
                          socialMediaLinks.map((link) => (
                            <Button
                              key={link.id}
                              size="icon"
                              className="h-12 w-12 rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all shadow-md"
                              asChild
                            >
                              <a
                                href={formatSocialUrl(link.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={link.platform}
                              >
                                {getSocialIcon(link.platform)}
                              </a>
                            </Button>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {getTranslatedText(
                              "noSocialLinks",
                              "No social media links available"
                            )}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
