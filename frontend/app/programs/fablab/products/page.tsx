"use client";

import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Beaker,
  ShoppingCart,
  Sparkles,
  Factory,
  CheckCircle,
  ArrowRight,
  Zap,
  Cog,
  TrendingUp,
  DollarSign,
  Phone,
  Mail,
  Printer,
  Users,
  Lightbulb,
  Award,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  fetchHero,
  fetchProducts,
  type HeroContent,
  type ImpactStat,
  type Product,
} from "@/lib/api-programs/fablab/api-programs-fablab-products";
import { useApp } from "@/lib/app-context";

interface ProductDisplay {
  name: string;
  slug: string;
  price: string;
  category: string;
  description: string;
  features: string[];
  applications?: string[];
  image: string;
}

export default function ProductsPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [showAllEdu, setShowAllEdu] = useState(false);
  const [showAllFab, setShowAllFab] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const [hero, setHero] = useState<HeroContent | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const [educationalProducts, setEducationalProducts] = useState<
    ProductDisplay[]
  >([]);
  const [fablabProducts, setFablabProducts] = useState<ProductDisplay[]>([]);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    heroBadge?: string;
    heroTitle?: string;
    heroDescription?: string;
    statistics?: Array<{ number: string; label: string; icon: any }>;
    products?: Array<{
      name: string;
      description: string;
      category: string;
      features: string[];
      applications?: string[];
    }>;
    // Static UI text translations
    loadingProducts?: string;
    educationalProducts?: string;
    scienceKitsForEverySubject?: string;
    handsOnLearningTools?: string;
    noEducationalProductsAvailable?: string;
    inStock?: string;
    keyFeatures?: string;
    viewDetails?: string;
    showLess?: string;
    loadMore?: string;
    fablabProducts?: string;
    agriculturalManufacturingSolutions?: string;
    locallyDesigned?: string;
    noFablabProductsAvailable?: string;
    applications?: string;
    whyChooseUs?: string;
    qualityAffordabilityLocalSupport?: string;
    empoweringSchools?: string;
    curriculumAligned?: string;
    allEducationalProducts?: string;
    affordablePricing?: string;
    competitivePrices?: string;
    localSupport?: string;
    designedAndFabricated?: string;
  }>({});

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      setIsLoading(true);
      try {
        // Fetch hero and products data
        const [heroData, productsData] = await Promise.all([
          fetchHero(),
          fetchProducts(),
        ]);

        if (!isMounted) return;

        setHero(heroData);
        setAllProducts(productsData);

        // Split products into educational and fablab based on category
        if (productsData.length > 0) {
          const eduProducts: ProductDisplay[] = [];
          const fabProducts: ProductDisplay[] = [];
          productsData.forEach((product) => {
            const productDisplay: ProductDisplay = {
              name: product.name,
              slug: product.slug,
              price: product.price,
              category: product.category,
              description: product.description,
              features: product.features || [],
              applications: product.applications,
              image: product.image,
            };

            if (product.category === "Science Kits") {
              eduProducts.push(productDisplay);
            } else if (product.category === "Manufacturing Solution") {
              fabProducts.push(productDisplay);
            } else {
              // Default to educational if category doesn't match
              eduProducts.push(productDisplay);
            }
          });

          setEducationalProducts(eduProducts);
          setFablabProducts(fabProducts);
        } else {
          setEducationalProducts([]);
          setFablabProducts([]);
        }

        setError(null);
      } catch (err) {
        console.error("[ProductsPage] Unexpected error during data load", err);
        if (isMounted) {
          setError(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadContent();
    return () => {
      isMounted = false;
    };
  }, []);

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

      if (isLoading) return;

      setTranslating(true);
      try {
        const translations: any = {};

        // Translate hero section
        if (hero?.badge)
          translations.heroBadge = await translateText(hero.badge, targetLang);
        if (hero?.title)
          translations.heroTitle = await translateText(hero.title, targetLang);
        if (hero?.description)
          translations.heroDescription = await translateText(
            hero.description,
            targetLang
          );

        // Translate statistics labels (keep numbers unchanged)
        // Calculate stats from products for translation
        const statsToTranslate = (() => {
          const totalProducts = allProducts.length;
          const educationalCount = educationalProducts.length;
          const manufacturingCount = fablabProducts.length;
          const inStockCount = allProducts.filter(
            (p) => p.status === "in stock"
          ).length;

          return [
            {
              number: totalProducts.toString(),
              label: "Total Products",
            },
            {
              number: educationalCount.toString(),
              label: "Science Kits",
            },
            {
              number: manufacturingCount.toString(),
              label: "Manufacturing Solutions",
            },
            {
              number: inStockCount.toString(),
              label: "In Stock",
            },
          ];
        })();

        if (statsToTranslate && statsToTranslate.length > 0) {
          translations.statistics = await Promise.all(
            statsToTranslate.map(async (stat, index) => {
              const translatedLabel = await translateText(
                stat.label || "",
                targetLang
              );
              // Map original labels to icons (before translation)
              let icon = Package;
              if (stat.label === "Total Products") icon = Package;
              else if (stat.label === "Science Kits") icon = Beaker;
              else if (stat.label === "Manufacturing Solutions") icon = Factory;
              else if (stat.label === "In Stock") icon = CheckCircle;

              return {
                number: stat.number,
                label: translatedLabel,
                icon: icon,
              };
            })
          );
        }

        // Translate all products (both educational and fablab)
        const allProductsForTranslation = [
          ...educationalProducts,
          ...fablabProducts,
        ];
        if (allProductsForTranslation && allProductsForTranslation.length > 0) {
          translations.products = await Promise.all(
            allProductsForTranslation.map(async (product) => ({
              name: await translateText(product.name || "", targetLang),
              description: await translateText(
                product.description || "",
                targetLang
              ),
              category: await translateText(product.category || "", targetLang),
              features: await Promise.all(
                (product.features || []).map((feature) =>
                  translateText(feature, targetLang)
                )
              ),
              applications: product.applications
                ? await Promise.all(
                    product.applications.map((app) =>
                      translateText(app, targetLang)
                    )
                  )
                : undefined,
            }))
          );
        }

        // Translate static UI text
        translations.loadingProducts = await translateText(
          "Loading products...",
          targetLang
        );
        translations.educationalProducts = await translateText(
          "Educational Products",
          targetLang
        );
        translations.scienceKitsForEverySubject = await translateText(
          "Science Kits for Every Subject",
          targetLang
        );
        translations.handsOnLearningTools = await translateText(
          "Hands-on learning tools designed to make science engaging, interactive, and accessible. Each kit includes all materials and instructions needed to perform curriculum-aligned experiments.",
          targetLang
        );
        translations.noEducationalProductsAvailable = await translateText(
          "No educational products available at the moment.",
          targetLang
        );
        translations.inStock = await translateText("In Stock", targetLang);
        translations.keyFeatures = await translateText(
          "Key Features:",
          targetLang
        );
        translations.viewDetails = await translateText(
          "View Details",
          targetLang
        );
        translations.showLess = await translateText("Show Less", targetLang);
        translations.loadMore = await translateText("Load More", targetLang);
        translations.fablabProducts = await translateText(
          "FabLab Products",
          targetLang
        );
        translations.agriculturalManufacturingSolutions = await translateText(
          "Agricultural & Manufacturing Solutions",
          targetLang
        );
        translations.locallyDesigned = await translateText(
          "Locally designed and fabricated equipment to support Ethiopian farmers, entrepreneurs, and institutions. Built for durability, efficiency, and local conditions.",
          targetLang
        );
        translations.noFablabProductsAvailable = await translateText(
          "No FabLab products available at the moment.",
          targetLang
        );
        translations.applications = await translateText(
          "Applications:",
          targetLang
        );
        translations.whyChooseUs = await translateText(
          "Why Choose Us",
          targetLang
        );
        translations.qualityAffordabilityLocalSupport = await translateText(
          "Quality, Affordability, Local Support",
          targetLang
        );
        translations.empoweringSchools = await translateText(
          "Empowering schools, students, and innovators through reliable educational kits and locally fabricated technology solutions.",
          targetLang
        );
        translations.curriculumAligned = await translateText(
          "Curriculum Aligned",
          targetLang
        );
        translations.allEducationalProducts = await translateText(
          "All educational products are designed to align with Ethiopia's national curriculum, ensuring relevance and educational value.",
          targetLang
        );
        translations.affordablePricing = await translateText(
          "Affordable Pricing",
          targetLang
        );
        translations.competitivePrices = await translateText(
          "Competitive prices designed to make quality education and equipment accessible to schools, farms, and institutions across Ethiopia.",
          targetLang
        );
        translations.localSupport = await translateText(
          "Local Support",
          targetLang
        );
        translations.designedAndFabricated = await translateText(
          "Designed and fabricated locally with ongoing support, training, and maintenance services available throughout Ethiopia.",
          targetLang
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    if (!isLoading) {
      translateDynamicContent(selectedLanguage);
    }
  }, [
    selectedLanguage,
    hero,
    allProducts,
    educationalProducts,
    fablabProducts,
    isLoading,
  ]);

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
  const displayHeroBadge = getTranslated("heroBadge", hero?.badge || "");
  const displayHeroTitle = getTranslated("heroTitle", hero?.title || "");
  const displayHeroDescription = getTranslated(
    "heroDescription",
    hero?.description || ""
  );
  // Calculate stats from products
  const calculatedStats: ImpactStat[] = (() => {
    const totalProducts = allProducts.length;
    const educationalCount = educationalProducts.length;
    const manufacturingCount = fablabProducts.length;
    const inStockCount = allProducts.filter(
      (p) => p.status === "in stock"
    ).length;

    return [
      {
        number: totalProducts.toString(),
        label: "Total Products",
        icon: Package,
      },
      {
        number: educationalCount.toString(),
        label: "Science Kits",
        icon: Beaker,
      },
      {
        number: manufacturingCount.toString(),
        label: "Manufacturing Solutions",
        icon: Factory,
      },
      {
        number: inStockCount.toString(),
        label: "In Stock",
        icon: CheckCircle,
      },
    ];
  })();

  const displayStats =
    translatedContent.statistics && selectedLanguage !== "en"
      ? translatedContent.statistics
      : calculatedStats;

  // Get translated products
  const getTranslatedProduct = (
    product: ProductDisplay,
    index: number
  ): ProductDisplay => {
    if (
      selectedLanguage === "en" ||
      !translatedContent.products ||
      !translatedContent.products[index]
    ) {
      return product;
    }
    const translated = translatedContent.products[index];
    return {
      ...product,
      name: translated.name,
      description: translated.description,
      category: translated.category,
      features: translated.features,
      applications: translated.applications,
    };
  };

  const displayedEdu = showAllEdu
    ? educationalProducts
    : educationalProducts.slice(0, 6);
  const displayedFab = showAllFab ? fablabProducts : fablabProducts.slice(0, 6);

  // Calculate indices for translated products
  const eduStartIndex = 0;
  const fabStartIndex = educationalProducts.length;
  const gradientTextClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold";
  const gradientButtonClass =
    "bg-linear-to-br from-[#367375] to-[#24C3BC] text-white hover:opacity-90 transition-all";

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
          <p className="text-muted-foreground">
            {getTranslatedText("loadingProducts", "Loading products...")}
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-15">
            <div className="max-w-4xl mx-auto text-center">
              {displayHeroBadge && (
                <div className="flex justify-center">
                  <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                    <ShoppingCart className="h-3 w-3 mr-1.5" />
                    {displayHeroBadge}
                  </Badge>
                </div>
              )}
              {displayHeroTitle ? (
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                  {displayHeroTitle}
                </h1>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg text-cyan-100/80">
                    Hero content will be displayed here once it is added.
                  </p>
                </div>
              )}
              {displayHeroDescription && (
                <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                  {displayHeroDescription}
                </p>
              )}
            </div>
          </div>
          <br />
          <br />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-slate-50 to-transparent" />
        </section>

        {/* Categories Overview */}
        <section className="max-w-6xl mx-auto px-4 -mt-26 relative z-20">
          {displayStats.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {displayStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card
                    key={index}
                    className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/10 bg-white/10 backdrop-blur-md rounded-xl scale-95 hover:scale-100"
                  >
                    <CardContent className="pt-4 pb-4 px-2">
                      <div className="w-10 h-10 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center mx-auto mb-2 shadow-md shadow-[#24C3BC]/30">
                        <IconComponent className="h-4 w-4 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" />
                      </div>
                      <div className="text-2xl font-bold text-[#367375] mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center border border-white/10 bg-white/10 backdrop-blur-md rounded-xl">
              <CardContent className="pt-8 pb-8 px-4">
                <p className="text-muted-foreground">
                  Impact statistics will be displayed here once they are added.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Educational Products Section */}
        <section
          id="educational"
          className="max-w-6xl mx-auto px-4 py-16 scroll-mt-20"
        >
          <div className="text-center mb-12">
            <div className="flex justify-center">
              <Badge className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] text-white rounded-full shadow-md">
                <Package className="w-4 h-4" />
                {getTranslatedText(
                  "educationalProducts",
                  "Educational Products"
                )}
              </Badge>
            </div>
            <br />
            <h2
              className={`text-4xl md:text-5xl mb-6 ${gradientTextClass} text-balance`}
            >
              {getTranslatedText(
                "scienceKitsForEverySubject",
                "Science Kits for Every Subject"
              )}
            </h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto text-pretty">
              {getTranslatedText(
                "handsOnLearningTools",
                "Hands-on learning tools designed to make science engaging, interactive, and accessible. Each kit includes all materials and instructions needed to perform curriculum-aligned experiments."
              )}
            </p>
          </div>

          {educationalProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {getTranslatedText(
                  "noEducationalProductsAvailable",
                  "No educational products available at the moment."
                )}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedEdu.map((product, index) => {
                const translatedProduct = getTranslatedProduct(
                  product,
                  eduStartIndex + index
                );
                return (
                  <Card
                    key={index}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border flex flex-col group"
                  >
                    <Link
                      href={`/programs/fablab/products/${translatedProduct.slug}`}
                      className="flex flex-col flex-grow"
                    >
                      <div className="relative h-40">
                        {translatedProduct.image ? (
                          <>
                            <Image
                              src={translatedProduct.image}
                              alt={translatedProduct.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                            <Badge className="absolute top-3 right-3 bg-white/90 text-[#367375] border-[#24C3BC]/30 text-xs">
                              {translatedProduct.category}
                            </Badge>
                          </>
                        ) : (
                          <>
                            <div className="w-full h-full bg-linear-to-br from-[#367375] to-[#24C3BC] flex items-center justify-center">
                              <Package className="h-12 w-12 text-white opacity-50" />
                            </div>
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                            <Badge className="absolute top-3 right-3 bg-white/90 text-[#367375] border-[#24C3BC]/30 text-xs">
                              {translatedProduct.category}
                            </Badge>
                          </>
                        )}
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg text-balance leading-snug group-hover:text-[#24C3BC] transition-colors">
                          {translatedProduct.name}
                        </CardTitle>
                        <div className="space-y-1">
                          <CardDescription 
                            className={`text-xs ${expandedDescriptions.has(`edu-${index}`) ? '' : 'line-clamp-2'}`}
                          >
                            {translatedProduct.description}
                          </CardDescription>
                          {translatedProduct.description && translatedProduct.description.length > 100 && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const key = `edu-${index}`;
                                setExpandedDescriptions(prev => {
                                  const newSet = new Set(prev);
                                  if (newSet.has(key)) {
                                    newSet.delete(key);
                                  } else {
                                    newSet.add(key);
                                  }
                                  return newSet;
                                });
                              }}
                              className="text-xs text-[#24C3BC] hover:text-[#367375] font-medium"
                            >
                              {expandedDescriptions.has(`edu-${index}`) ? 'Read Less' : 'Read More'}
                            </button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-grow pb-3">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold bg-linear-to-r from-[#367375] to-[#24C3BC] bg-clip-text text-transparent">
                              {translatedProduct.price}
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-xs bg-linear-to-r from-[#367375] to-[#24C3BC] text-white border-0"
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              {getTranslatedText("inStock", "In Stock")}
                            </Badge>
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-xs font-semibold text-muted-foreground">
                              {getTranslatedText(
                                "keyFeatures",
                                "Key Features:"
                              )}
                            </p>
                            {translatedProduct.features
                              .slice(0, 3)
                              .map((feature, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-start gap-1.5 text-xs"
                                >
                                  <CheckCircle className="h-3.5 w-3.5 text-[#24C3BC] shrink-0 mt-0.5" />
                                  <span className="leading-tight">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </CardContent>
                      <div className="p-4 pt-0">
                        <Button
                          className="w-full bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#2c5e60] hover:to-[#1ca7a1] text-white font-medium transition-all duration-300"
                          size="sm"
                        >
                          <ArrowRight className="mr-2 h-3.5 w-3.5" />{" "}
                          {getTranslatedText("viewDetails", "View Details")}
                        </Button>
                      </div>
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}

          {educationalProducts.length > 6 && (
            <div className="flex justify-center mt-10">
              <Button
                onClick={() => setShowAllEdu(!showAllEdu)}
                className="px-6 py-3 font-semibold bg-linear-to-r from-[#367375] to-[#24C3BC] text-white rounded-full shadow-md hover:opacity-90 transition-all"
              >
                {showAllEdu
                  ? getTranslatedText("showLess", "Show Less")
                  : getTranslatedText("loadMore", "Load More")}
              </Button>
            </div>
          )}
        </section>

        <section
          id="fablab"
          className="bg-linear-to-br from-slate-50 to-[#24C3BC]/10 py-16 scroll-mt-20"
        >
          <div className="max-w-6xl mx-auto px-4">
            {/* ✅ Section Header */}
            <div className="text-center mb-12">
              <div className="flex justify-center">
                <Badge
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
          border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
          text-white rounded-full shadow-md"
                >
                  <Package className="w-4 h-4" />
                  {getTranslatedText("fablabProducts", "FabLab Products")}
                </Badge>
              </div>
              <br />
              <h2
                className={`text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold`}
              >
                {getTranslatedText(
                  "agriculturalManufacturingSolutions",
                  "Agricultural & Manufacturing Solutions"
                )}
              </h2>
              <p className="text-base text-gray-600 max-w-3xl mx-auto text-pretty">
                {getTranslatedText(
                  "locallyDesigned",
                  "Locally designed and fabricated equipment to support Ethiopian farmers, entrepreneurs, and institutions. Built for durability, efficiency, and local conditions."
                )}
              </p>
            </div>

            {/* ✅ Product Cards */}
            {fablabProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {getTranslatedText(
                    "noFablabProductsAvailable",
                    "No FabLab products available at the moment."
                  )}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedFab.map((product, index) => {
                  const translatedProduct = getTranslatedProduct(
                    product,
                    fabStartIndex + index
                  );
                  return (
                    <Card
                      key={index}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#367375]/20 flex flex-col group"
                    >
                      <Link
                        href={`/programs/fablab/products/${translatedProduct.slug}`}
                        className="flex flex-col flex-grow"
                      >
                        {/* Product Image */}
                        <div className="relative h-44">
                          {translatedProduct.image ? (
                            <>
                              <Image
                                src={translatedProduct.image}
                                alt={translatedProduct.name}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                              <Badge className="absolute top-3 right-3 bg-white/90 text-[#367375] border-[#367375]/20 text-xs">
                                {translatedProduct.category}
                              </Badge>
                              <div className="absolute bottom-3 left-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                                  <Factory className="h-5 w-5 text-[#24C3BC]" />
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-full h-full bg-linear-to-br from-[#367375] to-[#24C3BC] flex items-center justify-center">
                                <Factory className="h-16 w-16 text-white opacity-50" />
                              </div>
                              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                              <Badge className="absolute top-3 right-3 bg-white/90 text-[#367375] border-[#367375]/20 text-xs">
                                {translatedProduct.category}
                              </Badge>
                              <div className="absolute bottom-3 left-3">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                                  <Factory className="h-5 w-5 text-[#24C3BC]" />
                                </div>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Product Info */}
                        <CardHeader className="pb-3">
                          <CardTitle className="text-xl text-balance leading-snug group-hover:text-[#24C3BC] transition-colors">
                            {translatedProduct.name}
                          </CardTitle>
                          <div className="text-2xl font-bold text-[#367375] mb-2">
                            {translatedProduct.price}
                          </div>
                          <div className="space-y-1">
                            <CardDescription 
                              className={`text-xs ${expandedDescriptions.has(`fab-${index}`) ? '' : 'line-clamp-2'}`}
                            >
                              {translatedProduct.description}
                            </CardDescription>
                            {translatedProduct.description && translatedProduct.description.length > 100 && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const key = `fab-${index}`;
                                  setExpandedDescriptions(prev => {
                                    const newSet = new Set(prev);
                                    if (newSet.has(key)) {
                                      newSet.delete(key);
                                    } else {
                                      newSet.add(key);
                                    }
                                    return newSet;
                                  });
                                }}
                                className="text-xs text-[#24C3BC] hover:text-[#367375] font-medium"
                              >
                                {expandedDescriptions.has(`fab-${index}`) ? 'Read Less' : 'Read More'}
                              </button>
                            )}
                          </div>
                        </CardHeader>

                        {/* Features & Applications */}
                        <CardContent className="flex-grow pb-3">
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold text-[#367375] mb-1.5 flex items-center gap-1.5">
                                <Cog className="h-3.5 w-3.5" />
                                {getTranslatedText(
                                  "keyFeatures",
                                  "Key Features:"
                                )}
                              </p>
                              <div className="space-y-1">
                                {translatedProduct.features
                                  .slice(0, 4)
                                  .map((feature, featureIndex) => (
                                    <div
                                      key={featureIndex}
                                      className="flex items-start gap-1.5 text-xs"
                                    >
                                      <CheckCircle className="h-3.5 w-3.5 text-[#24C3BC] shrink-0 mt-0.5" />
                                      <span className="leading-tight">
                                        {feature}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-[#367375] mb-1.5 flex items-center gap-1.5">
                                <TrendingUp className="h-3.5 w-3.5" />
                                {getTranslatedText(
                                  "applications",
                                  "Applications:"
                                )}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {(translatedProduct.applications || []).map(
                                  (app, appIndex) => (
                                    <Badge
                                      key={appIndex}
                                      variant="secondary"
                                      className="text-xs py-0 border border-[#367375]/20 bg-[#24C3BC]/10 text-[#367375]"
                                    >
                                      {app}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>

                        {/* View Details Button */}
                        <div className="p-4 pt-0">
                          <Button
                            className="w-full bg-linear-to-br from-[#367375] to-[#24C3BC] text-white 
                hover:opacity-90 transition-all"
                            size="sm"
                          >
                            <ArrowRight className="mr-2 h-3.5 w-3.5" />
                            {getTranslatedText("viewDetails", "View Details")}
                          </Button>
                        </div>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            )}

            {fablabProducts.length > 6 && (
              <div className="flex justify-center mt-10">
                <Button
                  onClick={() => setShowAllFab(!showAllFab)}
                  className="px-6 py-3 font-semibold bg-linear-to-r from-[#367375] to-[#24C3BC] text-white rounded-full shadow-md hover:opacity-90 transition-all"
                >
                  {showAllFab
                    ? getTranslatedText("showLess", "Show Less")
                    : getTranslatedText("loadMore", "Load More")}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Why Choose Our Products */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          {/* ✅ Section Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center">
              <Badge
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                {getTranslatedText("whyChooseUs", "Why Choose Us")}
              </Badge>
            </div>
            <br />
            <h2
              className={`text-4xl md:text-5xl mb-6 bg-linear-to-br from-[#367375] to-[#24C3BC] text-transparent bg-clip-text font-bold`}
            >
              {getTranslatedText(
                "qualityAffordabilityLocalSupport",
                "Quality, Affordability, Local Support"
              )}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              {getTranslatedText(
                "empoweringSchools",
                "Empowering schools, students, and innovators through reliable educational kits and locally fabricated technology solutions."
              )}
            </p>
          </div>

          {/* ✅ Three Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* 1️⃣ Curriculum Aligned */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#367375]/20">
              <CardContent className="pt-6 pb-5">
                <div className="w-14 h-14 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#367375]">
                  Curriculum Aligned
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  All educational products are designed to align with Ethiopia's
                  national curriculum, ensuring relevance and educational value.
                </p>
              </CardContent>
            </Card>

            {/* 2️⃣ Affordable Pricing */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#367375]/20">
              <CardContent className="pt-6 pb-5">
                <div className="w-14 h-14 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#367375]">
                  {getTranslatedText("affordablePricing", "Affordable Pricing")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {getTranslatedText(
                    "competitivePrices",
                    "Competitive prices designed to make quality education and equipment accessible to schools, farms, and institutions across Ethiopia."
                  )}
                </p>
              </CardContent>
            </Card>

            {/* 3️⃣ Local Support */}
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[#367375]/20">
              <CardContent className="pt-6 pb-5">
                <div className="w-14 h-14 bg-linear-to-br from-[#367375] to-[#24C3BC] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Cog className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#367375]">
                  {getTranslatedText("localSupport", "Local Support")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {getTranslatedText(
                    "designedAndFabricated",
                    "Designed and fabricated locally with ongoing support, training, and maintenance services available throughout Ethiopia."
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
