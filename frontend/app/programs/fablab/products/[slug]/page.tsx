"use client";

import { useState, useEffect, use } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  CheckCircle,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
  Sparkles,
  Info,
  Zap,
  Beaker,
  Factory,
  Cog,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  fetchProductBySlug,
  type Product,
} from "@/lib/api-programs/fablab/api-programs-fablab-products";
import { fetchContactInfo } from "@/lib/api-contact";
import { useApp } from "@/lib/app-context";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }> | { slug: string };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  // Unwrap params Promise if needed
  const resolvedParams = use(
    params instanceof Promise ? params : Promise.resolve(params)
  );
  const slug = resolvedParams.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<{
    phone: string;
    email: string;
    address: string;
  }>({
    phone: "",
    email: "",
    address: "",
  });

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    product?: {
      name: string;
      description: string;
      category: string;
      overview?: string;
      features: string[];
      whatsIncluded?: string[];
      applications?: string[];
      status: string;
    };
    // Static UI text translations
    loadingProductDetails?: string;
    productNotFound?: string;
    theProductYoureLookingFor?: string;
    backToProducts?: string;
    category?: string;
    readyToOrder?: string;
    contactUsForPricing?: string;
    callOrWhatsApp?: string;
    emailUs?: string;
    visitOurOffice?: string;
    inStock?: string;
    outOfStock?: string;
    comingSoon?: string;
    productOverview?: string;
    keyFeatures?: string;
    whatsIncluded?: string;
    applicationsUses?: string;
  }>({});

  useEffect(() => {
    let isMounted = true;
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        const [productData, contact] = await Promise.all([
          fetchProductBySlug(slug),
          fetchContactInfo(),
        ]);

        if (!isMounted) return;

        if (!productData) {
          setError("Product not found");
          setProduct(null);
        } else {
          setProduct(productData);
          setError(null);
        }

        if (contact) {
          setContactInfo({
            phone: contact.phone || "",
            email: contact.email || "",
            address: contact.address || contact.addressDetails || "",
          });
        }
      } catch (e) {
        console.error("[Product Detail] load error", e);
        if (isMounted) {
          setError("Unable to load product details. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
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

      if (isLoading || !product) return;

      setTranslating(true);
      try {
        const translations: any = {};

        // Translate product content
        translations.product = {
          name: await translateText(product.name || "", targetLang),
          description: await translateText(
            product.description || "",
            targetLang
          ),
          category: await translateText(product.category || "", targetLang),
          overview: product.overview
            ? await translateText(product.overview, targetLang)
            : undefined,
          features: await Promise.all(
            (product.features || []).map((feature) =>
              translateText(feature, targetLang)
            )
          ),
          whatsIncluded: product.whatsIncluded
            ? await Promise.all(
                product.whatsIncluded.map((item) =>
                  translateText(item, targetLang)
                )
              )
            : undefined,
          applications: product.applications
            ? await Promise.all(
                product.applications.map((app) =>
                  translateText(app, targetLang)
                )
              )
            : undefined,
          status: product.status
            ? await translateText(product.status, targetLang)
            : "in stock",
        };

        // Translate static UI text
        translations.loadingProductDetails = await translateText(
          "Loading product details...",
          targetLang
        );
        translations.productNotFound = await translateText(
          "Product Not Found",
          targetLang
        );
        translations.theProductYoureLookingFor = await translateText(
          "The product you're looking for doesn't exist.",
          targetLang
        );
        translations.backToProducts = await translateText(
          "Back to Products",
          targetLang
        );
        translations.category = await translateText("Category", targetLang);
        translations.readyToOrder = await translateText(
          "Ready to Order?",
          targetLang
        );
        translations.contactUsForPricing = await translateText(
          "Contact us for pricing and availability",
          targetLang
        );
        translations.callOrWhatsApp = await translateText(
          "Call or WhatsApp",
          targetLang
        );
        translations.emailUs = await translateText("Email Us", targetLang);
        translations.visitOurOffice = await translateText(
          "Visit Our Office",
          targetLang
        );
        translations.inStock = await translateText("In Stock", targetLang);
        translations.outOfStock = await translateText(
          "Out of Stock",
          targetLang
        );
        translations.comingSoon = await translateText(
          "Coming Soon",
          targetLang
        );
        translations.productOverview = await translateText(
          "Product Overview",
          targetLang
        );
        translations.keyFeatures = await translateText(
          "Key Features",
          targetLang
        );
        translations.whatsIncluded = await translateText(
          "What's Included",
          targetLang
        );
        translations.applicationsUses = await translateText(
          "Applications & Uses",
          targetLang
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    if (!isLoading && product) {
      translateDynamicContent(selectedLanguage);
    }
  }, [selectedLanguage, product, isLoading]);

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

  // Get translated product
  const displayProduct = product
    ? translatedContent.product && selectedLanguage !== "en"
      ? {
          ...product,
          name: translatedContent.product.name,
          description: translatedContent.product.description,
          category: translatedContent.product.category,
          overview: translatedContent.product.overview,
          features: translatedContent.product.features,
          whatsIncluded: translatedContent.product.whatsIncluded,
          applications: translatedContent.product.applications,
          status: translatedContent.product.status,
        }
      : product
    : null;

  // Get status text
  const getStatusText = (status: string): string => {
    if (status === "in stock") {
      return getTranslatedText("inStock", "In Stock");
    } else if (status === "out of stock") {
      return getTranslatedText("outOfStock", "Out of Stock");
    } else {
      return getTranslatedText("comingSoon", "Coming Soon");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
          <p className="text-muted-foreground">
            {getTranslatedText(
              "loadingProductDetails",
              "Loading product details..."
            )}
          </p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {getTranslatedText("productNotFound", "Product Not Found")}
              </h1>
              <p className="text-muted-foreground mb-6">
                {error ||
                  getTranslatedText(
                    "theProductYoureLookingFor",
                    "The product you're looking for doesn't exist."
                  )}
              </p>
              <Button
                asChild
                className="bg-linear-to-r from-[#367375] to-[#24C3BC] text-white"
              >
                <Link href="/programs/fablab/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {getTranslatedText("backToProducts", "Back to Products")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!displayProduct) return null;

  // Determine icon based on category
  const getIcon = () => {
    if (displayProduct.category === "Science Kits") {
      return Beaker;
    } else if (displayProduct.category === "Manufacturing Solution") {
      return Factory;
    }
    return Package;
  };

  const IconComponent = getIcon();
  const features = displayProduct.features || [];
  const contents = displayProduct.whatsIncluded || [];
  const applications = displayProduct.applications || [];
  const overview = displayProduct.overview || displayProduct.description;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-start">
          <Button
            size="sm"
            className="flex items-center gap-2 bg-linear-to-r from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all"
            asChild
          >
            <Link
              href="/programs/fablab/products"
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4" />
              {getTranslatedText("backToProducts", "Back to Products")}
            </Link>
          </Button>
        </div>

        {/* Product Detail Section */}
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Image and Contact */}
            <div className="space-y-6">
              {/* Product Image */}
              <Card className="border shadow-lg overflow-hidden">
                {product.image ? (
                  <div className="relative h-80 md:h-96">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative h-80 md:h-96 bg-linear-to-br from-[#367375] to-[#24C3BC] flex items-center justify-center">
                    <Package className="h-24 w-24 text-white opacity-50" />
                  </div>
                )}
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="text-xs border-[#00BFA6] text-[#00BFA6]"
                    >
                      {product.category}
                    </Badge>
                    <Badge
                      variant={
                        product.status === "in stock" ? "default" : "secondary"
                      }
                      className="text-xs bg-[#00BFA6]"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {product.status === "in stock"
                        ? "In Stock"
                        : product.status === "out of stock"
                        ? "Out of Stock"
                        : "Coming Soon"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="font-semibold text-sm">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="border shadow-lg bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {getTranslatedText("readyToOrder", "Ready to Order?")}
                      </h3>
                      <p className="text-sm text-white/90">
                        {getTranslatedText(
                          "contactUsForPricing",
                          "Contact us for pricing and availability"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {contactInfo.phone && (
                      <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <Phone className="h-5 w-5 shrink-0" />
                        <div>
                          <p className="text-xs text-white/90">
                            {getTranslatedText(
                              "callOrWhatsApp",
                              "Call or WhatsApp"
                            )}
                          </p>
                          <a
                            href={`tel:${contactInfo.phone}`}
                            className="font-semibold hover:underline"
                          >
                            {contactInfo.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    {contactInfo.email && (
                      <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <Mail className="h-5 w-5 shrink-0" />
                        <div>
                          <p className="text-xs text-white/90">
                            {getTranslatedText("emailUs", "Email Us")}
                          </p>
                          <a
                            href={`mailto:${contactInfo.email}`}
                            className="font-semibold hover:underline break-all"
                          >
                            {contactInfo.email}
                          </a>
                        </div>
                      </div>
                    )}
                    {contactInfo.address && (
                      <div className="flex items-center gap-3 bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                        <MapPin className="h-5 w-5 shrink-0" />
                        <div>
                          <p className="text-xs text-white/90">
                            {getTranslatedText(
                              "visitOurOffice",
                              "Visit Our Office"
                            )}
                          </p>
                          <p className="font-semibold">{contactInfo.address}</p>
                        </div>
                      </div>
                    )}
                    {!contactInfo.phone &&
                      !contactInfo.email &&
                      !contactInfo.address && (
                        <p className="text-sm text-white/80 text-center py-4">
                          Contact information will be displayed here once it is
                          added.
                        </p>
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Header */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                  {displayProduct.name}
                </h1>
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="text-4xl font-bold text-[#367375]">
                    {displayProduct.price}
                  </span>
                  <Badge variant="secondary" className="text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    {getStatusText(displayProduct.status)}
                  </Badge>
                </div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {displayProduct.description}
                </p>
              </div>

              {/* Full Description */}
              {overview && (
                <Card className="border shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center">
                        <Info className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-lg">
                        {getTranslatedText(
                          "productOverview",
                          "Product Overview"
                        )}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {overview}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Key Features */}
              {features.length > 0 && (
                <Card className="border shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-lg">
                        {getTranslatedText("keyFeatures", "Key Features")}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-[#367375] shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* What's Included */}
              {contents.length > 0 && (
                <Card className="border shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-lg">What's Included</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {contents.map((item: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-[#367375] rounded-full shrink-0 mt-2" />
                          <span className="text-sm leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Applications */}
              {applications.length > 0 && (
                <Card className="border shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-white" />
                      </div>
                      <CardTitle className="text-lg">
                        {getTranslatedText(
                          "applicationsUses",
                          "Applications & Uses"
                        )}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {applications.map((app, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm py-1 px-3"
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
