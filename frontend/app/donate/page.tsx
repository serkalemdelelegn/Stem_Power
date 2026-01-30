"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  CheckCircle2,
  Users,
  Lightbulb,
  GraduationCap,
  Loader2,
  Building2,
  Award,
  TrendingUp,
  Globe,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

export default function DonatePage() {
  const { selectedLanguage } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("custom");
  const [customAmount, setCustomAmount] = useState("");
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
        // Hero section
        translations.supportSTEMEducation = await translateText(
          "Support STEM Education",
          selectedLanguage
        );
        translations.empowerEthiopia = await translateText(
          "Empower Ethiopia's Future Innovators",
          selectedLanguage
        );
        translations.heroDescription = await translateText(
          "Your donation helps establish hands-on STEM Centers across Ethiopia, empowering the next generation of scientists, engineers, and entrepreneurs to transform their communities.",
          selectedLanguage
        );
        translations.stemCenters = await translateText(
          "STEM Centers",
          selectedLanguage
        );
        translations.studentsReached = await translateText(
          "Students Reached",
          selectedLanguage
        );

        // Impact stats section
        translations.ourImpactInNumbers = await translateText(
          "Our Impact in Numbers",
          selectedLanguage
        );
        translations.impactDescription = await translateText(
          "See how your donations are transforming STEM education across Ethiopia",
          selectedLanguage
        );
        translations.teachersTrained = await translateText(
          "Teachers Trained",
          selectedLanguage
        );
        translations.totalWorldwide = await translateText(
          "Total Worldwide",
          selectedLanguage
        );

        // Donation form
        translations.makeYourDonation = await translateText(
          "Make Your Donation",
          selectedLanguage
        );
        translations.choosePaymentMethod = await translateText(
          "Choose your preferred payment method and amount",
          selectedLanguage
        );
        translations.paymentSuccessful = await translateText(
          "Payment Successful!",
          selectedLanguage
        );
        translations.thankYouDonation = await translateText(
          "Thank you for your generous donation to STEMpower Ethiopia.",
          selectedLanguage
        );
        translations.telebirr = await translateText(
          "Telebirr",
          selectedLanguage
        );
        translations.cbeBirr = await translateText(
          "CBE Birr",
          selectedLanguage
        );
        translations.selectDonationAmount = await translateText(
          "Select Donation Amount (ETB)",
          selectedLanguage
        );
        translations.custom = await translateText("Custom", selectedLanguage);
        translations.amount = await translateText("Amount", selectedLanguage);
        translations.enterCustomAmount = await translateText(
          "Enter custom amount in ETB",
          selectedLanguage
        );
        translations.telebirrPhoneNumber = await translateText(
          "Telebirr Phone Number",
          selectedLanguage
        );
        translations.enterTelebirrPhone = await translateText(
          "Enter your 10-digit Telebirr phone number",
          selectedLanguage
        );
        translations.cbeAccountNumber = await translateText(
          "CBE Birr Account Number",
          selectedLanguage
        );
        translations.enterCbeAccount = await translateText(
          "Enter your CBE Birr account",
          selectedLanguage
        );
        translations.enterCbeAccountNumber = await translateText(
          "Enter your CBE Birr mobile banking account number",
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
        translations.emailAddress = await translateText(
          "Email Address",
          selectedLanguage
        );
        translations.messageOptional = await translateText(
          "Message (Optional)",
          selectedLanguage
        );
        translations.shareWhySupporting = await translateText(
          "Share why you're supporting STEMpower Ethiopia...",
          selectedLanguage
        );
        translations.successful = await translateText(
          "Successful",
          selectedLanguage
        );
        translations.processingPayment = await translateText(
          "Processing Payment...",
          selectedLanguage
        );
        translations.completeDonationTelebirr = await translateText(
          "Complete Donation with Telebirr",
          selectedLanguage
        );
        translations.completeDonationCbe = await translateText(
          "Complete Donation with CBE Birr",
          selectedLanguage
        );
        translations.securePayment = await translateText(
          "Secure and encrypted payment processing",
          selectedLanguage
        );
        translations.paymentFailed = await translateText(
          "Payment failed: ",
          selectedLanguage
        );
        translations.paymentError = await translateText(
          "Payment error. Please try again.",
          selectedLanguage
        );

        // Sidebar - Your Impact
        translations.yourImpact = await translateText(
          "Your Impact",
          selectedLanguage
        );
        translations.efficientModel = await translateText(
          "Efficient Model",
          selectedLanguage
        );
        translations.efficientModelDescription = await translateText(
          "We leverage existing public assets to minimize costs and maximize impact",
          selectedLanguage
        );
        translations.localExpertise = await translateText(
          "Local Expertise",
          selectedLanguage
        );
        translations.localExpertiseDescription = await translateText(
          "We employ local experts ensuring sustainable and culturally relevant projects",
          selectedLanguage
        );
        translations.lastingInfrastructure = await translateText(
          "Lasting Infrastructure",
          selectedLanguage
        );
        translations.lastingInfrastructureDescription = await translateText(
          "Your donation creates permanent STEM education facilities that serve communities for years",
          selectedLanguage
        );
        translations.provenTrackRecord = await translateText(
          "Proven Track Record",
          selectedLanguage
        );
        translations.provenTrackRecordDescription = await translateText(
          "148 centers established across sub-Saharan Africa with measurable outcomes",
          selectedLanguage
        );

        // Sidebar - Transparency
        translations.transparencyAccountability = await translateText(
          "Transparency & Accountability",
          selectedLanguage
        );
        translations.transparencyDescription = await translateText(
          "STEMpower is committed to transparency in all our operations. Every donation is tracked and reported.",
          selectedLanguage
        );
        translations.financialReports = await translateText(
          "Financial Reports",
          selectedLanguage
        );
        translations.financialReportsDescription = await translateText(
          "Annual reports available on request",
          selectedLanguage
        );
        translations.taxDeductible = await translateText(
          "Tax Deductible",
          selectedLanguage
        );
        translations.taxDeductibleDescription = await translateText(
          "501(c)(3) nonprofit organization",
          selectedLanguage
        );
        translations.globalReach = await translateText(
          "Global Reach",
          selectedLanguage
        );
        translations.globalReachDescription = await translateText(
          "Operating in 8 African countries",
          selectedLanguage
        );

        // Sidebar - Where Your Money Goes
        translations.whereYourMoneyGoes = await translateText(
          "Where Your Money Goes",
          selectedLanguage
        );
        translations.moneyGoesDescription = await translateText(
          "Every birr you donate directly supports STEM education infrastructure and programs in Ethiopia.",
          selectedLanguage
        );
        translations.programServices = await translateText(
          "70% Program Services",
          selectedLanguage
        );
        translations.programServicesDescription = await translateText(
          "Direct STEM center operations and equipment",
          selectedLanguage
        );
        translations.teacherTraining = await translateText(
          "20% Teacher Training",
          selectedLanguage
        );
        translations.teacherTrainingDescription = await translateText(
          "Professional development and curriculum",
          selectedLanguage
        );
        translations.administration = await translateText(
          "10% Administration",
          selectedLanguage
        );
        translations.administrationDescription = await translateText(
          "Operations and fundraising costs",
          selectedLanguage
        );
        translations.taxReceiptNote = await translateText(
          "You will receive a tax receipt and impact report via email after your donation",
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

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
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

  const handleTelebirrPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const amount = selectedAmount === "custom" ? customAmount : selectedAmount;
    const phoneNumber = formData.get("telebirrPhone");

    try {
      const response = await fetch("/api/payments/telebirr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          phoneNumber,
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentSuccess(true);
        setTimeout(() => setPaymentSuccess(false), 5000);
      } else {
        alert(
          getTranslatedText("paymentFailed", "Payment failed: ") + data.message
        );
      }
    } catch (error) {
      alert(
        getTranslatedText("paymentError", "Payment error. Please try again.")
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCBEBirrPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const amount = selectedAmount === "custom" ? customAmount : selectedAmount;
    const accountNumber = formData.get("cbeAccount");

    try {
      const response = await fetch("/api/payments/cbe-birr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          accountNumber,
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentSuccess(true);
        setTimeout(() => setPaymentSuccess(false), 5000);
      } else {
        alert(
          getTranslatedText("paymentFailed", "Payment failed: ") + data.message
        );
      }
    } catch (error) {
      alert(
        getTranslatedText("paymentError", "Payment error. Please try again.")
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC]">
          <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />
          <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                  <Sparkles className="h-3 w-3 mr-1.5" />
                  {getTranslatedText(
                    "supportSTEMEducation",
                    "Support STEM Education"
                  )}
                </Badge>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  {getTranslatedText(
                    "empowerEthiopia",
                    "Empower Ethiopia's Future Innovators"
                  )}
                </h1>
                <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                  {getTranslatedText(
                    "heroDescription",
                    "Your donation helps establish hands-on STEM Centers across Ethiopia, empowering the next generation of scientists, engineers, and entrepreneurs to transform their communities."
                  )}
                </p>
                {/* <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 text-lg px-8">
                    <Heart className="mr-2 h-5 w-5" />
                    Donate Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 text-lg px-8 bg-transparent"
                  >
                    Learn Our Impact
                  </Button>
                </div> */}
              </div>
              <div className="order-1 lg:order-2 flex justify-center relative">
                <div className="relative w-full sm:w-[90%] md:w-[95%] lg:w-[100%] aspect-[5/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                  <Image
                    src="/ethiopian-students-working-with-science-equipment-.jpg"
                    alt="Ethiopian students working with science equipment"
                    fill
                    className="object-cover object-center"
                  />
                </div>

                {/* Floating stat cards */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-3 sm:p-4 border border-emerald-100">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-0.5">
                    61
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                    STEM Centers
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-3 sm:p-4 border border-teal-100">
                  <div className="text-2xl sm:text-3xl font-bold text-teal-600 mb-0.5">
                    50K+
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                    Students Reached
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-slate-50 to-transparent" />
        </section>

        {/* Impact Stats */}
        <section className="py-16 bg-linear-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
                  {getTranslatedText(
                    "ourImpactInNumbers",
                    "Our Impact in Numbers"
                  )}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  {getTranslatedText(
                    "impactDescription",
                    "See how your donations are transforming STEM education across Ethiopia"
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center border-2 hover:shadow-lg hover:scale-105 transition-all border-[#367375]/40 hover:border-[#24C3BC]/60">
                  <CardContent className="pt-6 pb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] mb-3 shadow-md">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-br from-[#367375] to-[#24C3BC] mb-1">
                      61
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {getTranslatedText("stemCenters", "STEM Centers")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-2 hover:shadow-lg hover:scale-105 transition-all border-[#367375]/40 hover:border-[#24C3BC]/60">
                  <CardContent className="pt-6 pb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] mb-3 shadow-md">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-br from-[#367375] to-[#24C3BC] mb-1">
                      50K+
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {getTranslatedText("studentsReached", "Students Reached")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-2 hover:shadow-lg hover:scale-105 transition-all border-[#367375]/40 hover:border-[#24C3BC]/60">
                  <CardContent className="pt-6 pb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] mb-3 shadow-md">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-br from-[#367375] to-[#24C3BC] mb-1">
                      1K+
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {getTranslatedText("teachersTrained", "Teachers Trained")}
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center border-2 hover:shadow-lg hover:scale-105 transition-all border-[#367375]/40 hover:border-[#24C3BC]/60">
                  <CardContent className="pt-6 pb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-[#367375] to-[#24C3BC] mb-3 shadow-md">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-br from-[#367375] to-[#24C3BC] mb-1">
                      148+
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {getTranslatedText("totalWorldwide", "Total Worldwide")}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Donation Form */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="border-2 border-primary/20 shadow-xl">
                    <CardHeader className="space-y-4">
                      <div>
                        <CardTitle className="text-3xl md:text-3xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold">
                          Make Your Donation
                        </CardTitle>
                        <CardDescription className="text-base">
                          Choose your preferred payment method and amount
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {paymentSuccess && (
                        <div className="mb-6 p-4 bg-primary/10 border-2 border-primary/30 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                          <CheckCircle2 className="w-6 h-6 text-[#367375] shrink-0" />
                          <div>
                            <p className="font-semibold text-[#367375] text-lg">
                              {getTranslatedText(
                                "paymentSuccessful",
                                "Payment Successful!"
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getTranslatedText(
                                "thankYouDonation",
                                "Thank you for your generous donation to STEMpower Ethiopia."
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      <Tabs defaultValue="telebirr" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                          <TabsTrigger
                            value="telebirr"
                            className="text-base font-semibold"
                          >
                            Telebirr
                          </TabsTrigger>
                          <TabsTrigger
                            value="cbe"
                            className="text-base font-semibold"
                          >
                            CBE Birr
                          </TabsTrigger>
                        </TabsList>

                        {/* Telebirr Payment */}
                        <TabsContent value="telebirr">
                          <form
                            onSubmit={handleTelebirrPayment}
                            className="space-y-6"
                          >
                            <div className="space-y-6">
                              <div>
                                <Label
                                  htmlFor="amount-telebirr"
                                  className="text-base font-semibold mb-4 block"
                                >
                                  {getTranslatedText(
                                    "selectDonationAmount",
                                    "Select Donation Amount (ETB)"
                                  )}
                                </Label>
                                <RadioGroup
                                  value={selectedAmount}
                                  onValueChange={setSelectedAmount}
                                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                                >
                                  {["500", "1000", "2500"].map((amt) => (
                                    <div key={amt}>
                                      <RadioGroupItem
                                        value={amt}
                                        id={amt}
                                        className="peer sr-only"
                                      />
                                      <Label
                                        htmlFor={amt}
                                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white peer-data-[state=checked]:border-[#367375] peer-data-[state=checked]:bg-[#367375]/10 peer-data-[state=checked]:text-[#367375] peer-data-[state=checked]:shadow-lg cursor-pointer transition-all"
                                      >
                                        <span className="text-xl font-bold">
                                          {amt === "1000" ? "1,000" : amt}
                                        </span>
                                        <span className="text-xs text-muted-foreground mt-1">
                                          ETB
                                        </span>
                                      </Label>
                                    </div>
                                  ))}
                                  <div>
                                    <RadioGroupItem
                                      value="custom"
                                      id="custom-telebirr"
                                      className="peer sr-only"
                                    />
                                    <Label
                                      htmlFor="custom-telebirr"
                                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white peer-data-[state=checked]:border-[#367375] peer-data-[state=checked]:bg-[#367375]/10 peer-data-[state=checked]:text-[#367375] peer-data-[state=checked]:shadow-lg cursor-pointer transition-all"
                                    >
                                      <span className="text-xl font-bold">
                                        Custom
                                      </span>
                                      <span className="text-xs text-muted-foreground mt-1">
                                        Amount
                                      </span>
                                    </Label>
                                  </div>
                                </RadioGroup>
                                {selectedAmount === "custom" && (
                                  <Input
                                    id="amount-telebirr"
                                    type="number"
                                    placeholder={getTranslatedText(
                                      "enterCustomAmount",
                                      "Enter custom amount in ETB"
                                    )}
                                    className="text-lg h-14 border-2 mt-3"
                                    min="1"
                                    value={customAmount}
                                    onChange={(e) =>
                                      setCustomAmount(e.target.value)
                                    }
                                    required
                                  />
                                )}
                              </div>

                              <div>
                                <Label
                                  htmlFor="telebirrPhone"
                                  className="text-base font-medium"
                                >
                                  {getTranslatedText(
                                    "telebirrPhoneNumber",
                                    "Telebirr Phone Number"
                                  )}
                                </Label>
                                <Input
                                  id="telebirrPhone"
                                  name="telebirrPhone"
                                  type="tel"
                                  placeholder="09XXXXXXXX"
                                  pattern="[0-9]{10}"
                                  className="h-12 text-base border-2"
                                  required
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                  {getTranslatedText(
                                    "enterTelebirrPhone",
                                    "Enter your 10-digit Telebirr phone number"
                                  )}
                                </p>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <Label
                                    htmlFor="firstName-telebirr"
                                    className="text-base font-medium"
                                  >
                                    {getTranslatedText(
                                      "firstName",
                                      "First Name"
                                    )}
                                  </Label>
                                  <Input
                                    id="firstName-telebirr"
                                    name="firstName"
                                    placeholder={getTranslatedText(
                                      "firstNamePlaceholder",
                                      "Abebe"
                                    )}
                                    className="h-12 text-base border-2"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor="lastName-telebirr"
                                    className="text-base font-medium"
                                  >
                                    {getTranslatedText("lastName", "Last Name")}
                                  </Label>
                                  <Input
                                    id="lastName-telebirr"
                                    name="lastName"
                                    placeholder={getTranslatedText(
                                      "lastNamePlaceholder",
                                      "Ayalew"
                                    )}
                                    className="h-12 text-base border-2"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <Label
                                  htmlFor="email-telebirr"
                                  className="text-base font-medium"
                                >
                                  {getTranslatedText(
                                    "emailAddress",
                                    "Email Address"
                                  )}
                                </Label>
                                <Input
                                  id="email-telebirr"
                                  name="email"
                                  type="email"
                                  placeholder={getTranslatedText(
                                    "emailPlaceholder",
                                    "abebe.ayalew@example.com"
                                  )}
                                  className="h-12 text-base border-2"
                                  required
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor="message-telebirr"
                                  className="text-base font-medium"
                                >
                                  {getTranslatedText(
                                    "messageOptional",
                                    "Message (Optional)"
                                  )}
                                </Label>
                                <Textarea
                                  id="message-telebirr"
                                  name="message"
                                  placeholder={getTranslatedText(
                                    "shareWhySupporting",
                                    "Share why you're supporting STEMpower Ethiopia..."
                                  )}
                                  rows={4}
                                  className="text-base border-2"
                                />
                              </div>
                            </div>

                            <Button
                              type="submit"
                              disabled={isProcessing || paymentSuccess}
                              className="w-full h-14 text-lg font-semibold bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#367375]/90 hover:to-[#24C3BC]/90 shadow-lg hover:shadow-xl transition-all"
                            >
                              {paymentSuccess ? (
                                <>
                                  <CheckCircle2 className="w-5 h-5 mr-2" />
                                  {getTranslatedText(
                                    "successful",
                                    "Successful"
                                  )}
                                </>
                              ) : isProcessing ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  {getTranslatedText(
                                    "processingPayment",
                                    "Processing Payment..."
                                  )}
                                </>
                              ) : (
                                <>
                                  <Heart
                                    className="w-5 h-5 mr-2"
                                    fill="currentColor"
                                  />
                                  {getTranslatedText(
                                    "completeDonationTelebirr",
                                    "Complete Donation with Telebirr"
                                  )}
                                </>
                              )}
                            </Button>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center pt-2">
                              <CheckCircle2 className="w-4 h-4 text-[#367375]" />
                              <span>
                                Secure and encrypted payment processing
                              </span>
                            </div>
                          </form>
                        </TabsContent>

                        {/* CBE Birr Payment */}
                        <TabsContent value="cbe">
                          <form
                            onSubmit={handleCBEBirrPayment}
                            className="space-y-6"
                          >
                            <div className="space-y-6">
                              <div>
                                <Label
                                  htmlFor="amount-cbe"
                                  className="text-base font-semibold mb-4 block"
                                >
                                  {getTranslatedText(
                                    "selectDonationAmount",
                                    "Select Donation Amount (ETB)"
                                  )}
                                </Label>
                                <RadioGroup
                                  value={selectedAmount}
                                  onValueChange={setSelectedAmount}
                                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                                >
                                  {["500", "1000", "2500"].map((amt) => (
                                    <div key={amt}>
                                      <RadioGroupItem
                                        value={amt}
                                        id={`${amt}-cbe`}
                                        className="peer sr-only"
                                      />
                                      <Label
                                        htmlFor={`${amt}-cbe`}
                                        className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white peer-data-[state=checked]:border-[#367375] peer-data-[state=checked]:bg-[#367375]/10 peer-data-[state=checked]:text-[#367375] peer-data-[state=checked]:shadow-lg cursor-pointer transition-all"
                                      >
                                        <span className="text-xl font-bold">
                                          {amt === "1000" ? "1,000" : amt}
                                        </span>
                                        <span className="text-xs text-muted-foreground mt-1">
                                          ETB
                                        </span>
                                      </Label>
                                    </div>
                                  ))}
                                  <div>
                                    <RadioGroupItem
                                      value="custom"
                                      id="custom-cbe"
                                      className="peer sr-only"
                                    />
                                    <Label
                                      htmlFor="custom-cbe"
                                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-background p-4 hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:text-white peer-data-[state=checked]:border-[#367375] peer-data-[state=checked]:bg-[#367375]/10 peer-data-[state=checked]:text-[#367375] peer-data-[state=checked]:shadow-lg cursor-pointer transition-all"
                                    >
                                      <span className="text-xl font-bold">
                                        {getTranslatedText("custom", "Custom")}
                                      </span>
                                      <span className="text-xs text-muted-foreground mt-1">
                                        {getTranslatedText("amount", "Amount")}
                                      </span>
                                    </Label>
                                  </div>
                                </RadioGroup>
                                {selectedAmount === "custom" && (
                                  <Input
                                    id="amount-cbe"
                                    type="number"
                                    placeholder={getTranslatedText(
                                      "enterCustomAmount",
                                      "Enter custom amount in ETB"
                                    )}
                                    className="text-lg h-14 border-2 mt-3"
                                    min="1"
                                    value={customAmount}
                                    onChange={(e) =>
                                      setCustomAmount(e.target.value)
                                    }
                                    required
                                  />
                                )}
                              </div>

                              <div>
                                <Label
                                  htmlFor="cbeAccount"
                                  className="text-base font-medium"
                                >
                                  CBE Birr Account Number
                                </Label>
                                <Input
                                  id="cbeAccount"
                                  name="cbeAccount"
                                  type="text"
                                  placeholder="Enter your CBE Birr account"
                                  className="h-12 text-base border-2"
                                  required
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                  Enter your CBE Birr mobile banking account
                                  number
                                </p>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <Label
                                    htmlFor="firstName-cbe"
                                    className="text-base font-medium"
                                  >
                                    {getTranslatedText(
                                      "firstName",
                                      "First Name"
                                    )}
                                  </Label>
                                  <Input
                                    id="firstName-cbe"
                                    name="firstName"
                                    placeholder={getTranslatedText(
                                      "firstNamePlaceholder",
                                      "Abebe"
                                    )}
                                    className="h-12 text-base border-2"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor="lastName-cbe"
                                    className="text-base font-medium"
                                  >
                                    {getTranslatedText("lastName", "Last Name")}
                                  </Label>
                                  <Input
                                    id="lastName-cbe"
                                    name="lastName"
                                    placeholder={getTranslatedText(
                                      "lastNamePlaceholder",
                                      "Ayalew"
                                    )}
                                    className="h-12 text-base border-2"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <Label
                                  htmlFor="email-cbe"
                                  className="text-base font-medium"
                                >
                                  {getTranslatedText(
                                    "emailAddress",
                                    "Email Address"
                                  )}
                                </Label>
                                <Input
                                  id="email-cbe"
                                  name="email"
                                  type="email"
                                  placeholder={getTranslatedText(
                                    "emailPlaceholder",
                                    "abebe.ayalew@example.com"
                                  )}
                                  className="h-12 text-base border-2"
                                  required
                                />
                              </div>

                              <div>
                                <Label
                                  htmlFor="message-cbe"
                                  className="text-base font-medium"
                                >
                                  {getTranslatedText(
                                    "messageOptional",
                                    "Message (Optional)"
                                  )}
                                </Label>
                                <Textarea
                                  id="message-cbe"
                                  name="message"
                                  placeholder={getTranslatedText(
                                    "shareWhySupporting",
                                    "Share why you're supporting STEMpower Ethiopia..."
                                  )}
                                  rows={4}
                                  className="text-base border-2"
                                />
                              </div>
                            </div>

                            <Button
                              type="submit"
                              disabled={isProcessing || paymentSuccess}
                              className="w-full h-14 text-lg font-semibold bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#367375]/90 hover:to-[#24C3BC]/90 shadow-lg hover:shadow-xl transition-all"
                            >
                              {paymentSuccess ? (
                                <>
                                  <CheckCircle2 className="w-5 h-5 mr-2" />
                                  Successful
                                </>
                              ) : isProcessing ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Processing Payment...
                                </>
                              ) : (
                                <>
                                  <Heart
                                    className="w-5 h-5 mr-2"
                                    fill="currentColor"
                                  />
                                  Complete Donation with CBE Birr
                                </>
                              )}
                            </Button>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center pt-2">
                              <CheckCircle2 className="w-4 h-4 text-[#367375]" />
                              <span>
                                Secure and encrypted payment processing
                              </span>
                            </div>
                          </form>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Lightbulb className="w-6 h-6 text-primary" />
                        {getTranslatedText("yourImpact", "Your Impact")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold mb-1">
                              {getTranslatedText(
                                "efficientModel",
                                "Efficient Model"
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getTranslatedText(
                                "efficientModelDescription",
                                "We leverage existing public assets to minimize costs and maximize impact"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold mb-1">
                              {getTranslatedText(
                                "localExpertise",
                                "Local Expertise"
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getTranslatedText(
                                "localExpertiseDescription",
                                "We employ local experts ensuring sustainable and culturally relevant projects"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold mb-1">
                              {getTranslatedText(
                                "lastingInfrastructure",
                                "Lasting Infrastructure"
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getTranslatedText(
                                "lastingInfrastructureDescription",
                                "Your donation creates permanent STEM education facilities that serve communities for years"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold mb-1">
                              {getTranslatedText(
                                "provenTrackRecord",
                                "Proven Track Record"
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getTranslatedText(
                                "provenTrackRecordDescription",
                                "148 centers established across sub-Saharan Africa with measurable outcomes"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Award className="w-6 h-6 text-primary" />
                        Transparency & Accountability
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        STEMpower is committed to transparency in all our
                        operations. Every donation is tracked and reported.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm">
                              {getTranslatedText(
                                "financialReports",
                                "Financial Reports"
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTranslatedText(
                                "financialReportsDescription",
                                "Annual reports available on request"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm">
                              {getTranslatedText(
                                "taxDeductible",
                                "Tax Deductible"
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTranslatedText(
                                "taxDeductibleDescription",
                                "501(c)(3) nonprofit organization"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm">
                              {getTranslatedText("globalReach", "Global Reach")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTranslatedText(
                                "globalReachDescription",
                                "Operating in 8 African countries"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 bg-linear-to-br from-muted/50 to-background">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Heart className="w-6 h-6 text-primary" />
                        {getTranslatedText(
                          "whereYourMoneyGoes",
                          "Where Your Money Goes"
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {getTranslatedText(
                          "moneyGoesDescription",
                          "Every birr you donate directly supports STEM education infrastructure and programs in Ethiopia."
                        )}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <p className="font-semibold text-sm">
                              {getTranslatedText(
                                "programServices",
                                "70% Program Services"
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTranslatedText(
                                "programServicesDescription",
                                "Direct STEM center operations and equipment"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <p className="font-semibold text-sm">
                              {getTranslatedText(
                                "teacherTraining",
                                "20% Teacher Training"
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTranslatedText(
                                "teacherTrainingDescription",
                                "Professional development and curriculum"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <p className="font-semibold text-sm">
                              {getTranslatedText(
                                "administration",
                                "10% Administration"
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getTranslatedText(
                                "administrationDescription",
                                "Operations and fundraising costs"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          {getTranslatedText(
                            "taxReceiptNote",
                            "You will receive a tax receipt and impact report via email after your donation"
                          )}
                        </p>
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
