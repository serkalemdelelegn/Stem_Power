"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Search,
  ExternalLink,
  Calendar,
  Sparkles,
  TrendingUp,
  Globe,
  Award,
  Building2,
  User,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import type { PressArticle } from "@/lib/api-news-other-people";
import { fetchPressArticles } from "@/lib/api-news-other-people";
import { useApp } from "@/lib/app-context";

export default function OthersTalkingAboutSTEMpowerPage() {
  // Use global language state from header
  const { selectedLanguage } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(9);
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const articlesRef = useRef<HTMLElement | null>(null);

  // Translation state
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<{
    statistics?: Array<{ label: string }>;
    translatedArticles?: Array<{
      title?: string;
      excerpt?: string;
      content?: string;
      quote?: string;
      category?: string;
      publication?: string;
      publicationType?: string;
    }>;
    translatedCategories?: Record<string, string>;
    // Static UI text translations
    mediaCoverage?: string;
    othersTalkingAbout?: string;
    stempower?: string;
    discoverHowLeading?: string;
    latestCoverage?: string;
    transformingEthiopia?: string;
    searchByPublication?: string;
    all?: string;
    mediaFeatures?: string;
    featuredStories?: string;
    categoriesCovered?: string;
    publications?: string;
    unableToLoadCoverage?: string;
    loadingMediaCoverage?: string;
    featuredCoverage?: string;
    highlightedMediaFeature?: string;
    featured?: string;
    readFullArticle?: string;
    allMediaCoverage?: string;
    categoryCoverage?: string;
    whatEthiopianMedia?: string;
    article?: string;
    articles?: string;
    loadMoreArticles?: string;
    noArticlesFound?: string;
    tryAdjustingSearch?: string;
    clearFilters?: string;
    coverageComingSoon?: string;
    publicationUnavailable?: string;
    titleUnavailable?: string;
    downloadPdf?: string;
  }>({});

  useEffect(() => {
    let ignore = false;

    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPressArticles();
        if (!ignore) {
          setArticles(data || []);
          setError(null);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to load media coverage", err);
          setError(
            "Unable to load the latest media coverage. Please try again shortly."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchArticles();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setDisplayCount(9);
  }, [selectedCategory, searchQuery]);

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

      if (loading) return;

      setTranslating(true);
      try {
        const translations: any = {};

        // Translate statistics labels (keep values unchanged)
        translations.statistics = await Promise.all(
          [
            { label: "Media Features" },
            { label: "Featured Stories" },
            { label: "Categories Covered" },
            { label: "Publications" },
          ].map(async (stat) => ({
            label: await translateText(stat.label || "", targetLang),
          }))
        );

        // Translate articles (title, excerpt, content, quote, category, publication, publicationType)
        if (articles && articles.length > 0) {
          // Collect unique categories first
          const uniqueCategories = Array.from(
            new Set(
              articles
                .map((a) => a.category?.trim())
                .filter((c): c is string => Boolean(c && c.length > 0))
            )
          );

          const translatedCategories: Record<string, string> = {};
          for (const category of uniqueCategories) {
            if (category) {
              translatedCategories[category] = await translateText(
                category,
                targetLang
              );
            }
          }
          translations.translatedCategories = translatedCategories;

          // Translate article titles, excerpts, content, quotes, categories, publications, and publicationTypes
          translations.translatedArticles = await Promise.all(
            articles.map(async (article) => ({
              title: article.title
                ? await translateText(article.title, targetLang)
                : article.title,
              excerpt: article.excerpt
                ? await translateText(article.excerpt, targetLang)
                : article.excerpt,
              content: article.content
                ? await translateText(article.content, targetLang)
                : article.content,
              quote: article.quote
                ? await translateText(article.quote, targetLang)
                : article.quote,
              category: article.category
                ? translatedCategories[article.category.trim()] ||
                  article.category
                : article.category,
              publication: article.publication
                ? await translateText(article.publication, targetLang)
                : article.publication,
              publicationType: article.publicationType
                ? await translateText(article.publicationType, targetLang)
                : article.publicationType,
            }))
          );
        }

        // Translate static UI text
        translations.mediaCoverage = await translateText(
          "Media Coverage",
          targetLang
        );
        translations.othersTalkingAbout = await translateText(
          "Others Talking About",
          targetLang
        );
        translations.stempower = await translateText("STEMpower", targetLang);
        translations.discoverHowLeading = await translateText(
          "Discover how leading Ethiopian media outlets, journalists, and thought leaders are covering our mission to transform STEM education nationwide.",
          targetLang
        );
        translations.latestCoverage = await translateText(
          "Latest Coverage",
          targetLang
        );
        translations.transformingEthiopia = await translateText(
          "Transforming Ethiopia's Future Through STEM Education",
          targetLang
        );
        translations.searchByPublication = await translateText(
          "Search by publication, author, title, or keyword...",
          targetLang
        );
        translations.all = await translateText("All", targetLang);
        translations.mediaFeatures = await translateText(
          "Media Features",
          targetLang
        );
        translations.featuredStories = await translateText(
          "Featured Stories",
          targetLang
        );
        translations.categoriesCovered = await translateText(
          "Categories Covered",
          targetLang
        );
        translations.publications = await translateText(
          "Publications",
          targetLang
        );
        translations.unableToLoadCoverage = await translateText(
          "Unable to load the latest media coverage. Please try again shortly.",
          targetLang
        );
        translations.loadingMediaCoverage = await translateText(
          "Loading media coverage...",
          targetLang
        );
        translations.featuredCoverage = await translateText(
          "Featured Coverage",
          targetLang
        );
        translations.highlightedMediaFeature = await translateText(
          "Highlighted media feature about our impact",
          targetLang
        );
        translations.featured = await translateText("⭐ Featured", targetLang);
        translations.readFullArticle = await translateText(
          "Read Full Article",
          targetLang
        );
        translations.allMediaCoverage = await translateText(
          "All Media Coverage",
          targetLang
        );
        translations.categoryCoverage = await translateText(
          "Coverage",
          targetLang
        );
        translations.whatEthiopianMedia = await translateText(
          "What Ethiopian media is saying about our work",
          targetLang
        );
        translations.article = await translateText("article", targetLang);
        translations.articles = await translateText("articles", targetLang);
        translations.loadMoreArticles = await translateText(
          "Load More Articles",
          targetLang
        );
        translations.noArticlesFound = await translateText(
          "No articles found",
          targetLang
        );
        translations.tryAdjustingSearch = await translateText(
          "Try adjusting your search or filter to find what you're looking for.",
          targetLang
        );
        translations.clearFilters = await translateText(
          "Clear Filters",
          targetLang
        );
        translations.coverageComingSoon = await translateText(
          "Media coverage will appear here once available.",
          targetLang
        );
        translations.publicationUnavailable = await translateText(
          "Publication unavailable",
          targetLang
        );
        translations.titleUnavailable = await translateText(
          "Title unavailable",
          targetLang
        );
        translations.downloadPdf = await translateText(
          "Download PDF",
          targetLang
        );

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating content:", error);
      } finally {
        setTranslating(false);
      }
    };

    if (!loading) {
      translateDynamicContent(selectedLanguage);
    }
  }, [selectedLanguage, articles, loading]);

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

  const articleCategories = useMemo(() => {
    const unique = new Set(
      articles
        .map((article) => article.category?.trim())
        .filter((category): category is string =>
          Boolean(category && category.length > 0)
        )
    );
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [articles]);

  const categories =
    articleCategories.length > 0 ? ["All", ...articleCategories] : ["All"];

  const totalArticles = articles.length;
  const featuredCount = articles.filter((article) => article.featured).length;
  const publicationsCount = articles.reduce((acc, article) => {
    if (article.publication?.trim()) {
      acc.add(article.publication.trim());
    }
    return acc;
  }, new Set<string>()).size;
  const stats = [
    {
      icon: Globe,
      label: "Media Features",
      value: totalArticles ? `${totalArticles}` : "0",
    },
    {
      icon: TrendingUp,
      label: "Featured Stories",
      value: featuredCount ? `${featuredCount}` : "0",
    },
    {
      icon: Award,
      label: "Categories Covered",
      value: articleCategories.length ? `${articleCategories.length}` : "0",
    },
    {
      icon: Building2,
      label: "Publications",
      value: publicationsCount ? `${publicationsCount}` : "0",
    },
  ];

  // Use translated content
  const displayStats =
    translatedContent.statistics && selectedLanguage !== "en"
      ? stats.map((stat, index) => ({
          ...stat,
          label: translatedContent.statistics![index]?.label || stat.label,
        }))
      : stats;
  const displayArticles =
    translatedContent.translatedArticles && selectedLanguage !== "en"
      ? articles.map((article, index) => ({
          ...article,
          title:
            translatedContent.translatedArticles![index]?.title ||
            article.title,
          excerpt:
            translatedContent.translatedArticles![index]?.excerpt ||
            article.excerpt,
          content:
            translatedContent.translatedArticles![index]?.content ||
            article.content,
          quote:
            translatedContent.translatedArticles![index]?.quote ||
            article.quote,
          category:
            translatedContent.translatedArticles![index]?.category ||
            article.category,
          publication:
            translatedContent.translatedArticles![index]?.publication ||
            article.publication,
          publicationType:
            translatedContent.translatedArticles![index]?.publicationType ||
            article.publicationType,
        }))
      : articles;
  const displayCategories =
    translatedContent.translatedCategories && selectedLanguage !== "en"
      ? categories.map((cat) => ({
          original: cat,
          translated:
            cat === "All"
              ? getTranslatedText("all", "All")
              : translatedContent.translatedCategories![cat] || cat,
        }))
      : categories.map((cat) => ({
          original: cat,
          translated: cat === "All" ? getTranslatedText("all", "All") : cat,
        }));

  const normalizeCategory = (article: PressArticle) =>
    article.category?.trim() || "";
  const getPublicationName = (article: PressArticle) =>
    article.publication?.trim() || "";
  const getPublicationType = (article: PressArticle) =>
    article.publicationType?.trim() || "";
  const getQuote = (article: PressArticle) =>
    article.quote?.trim() ||
    article.excerpt?.trim() ||
    article.content?.trim() ||
    "";
  const getArticleImage = (article: PressArticle) =>
    article.image?.trim() || "";
  const formatArticleDate = (date?: string) => {
    if (!date) return "";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const isExternalLink = (link: string) => /^https?:\/\//i.test(link);
  const getArticleLink = (article: PressArticle) => {
    if (article.link?.trim()) {
      return article.link.trim();
    }
    if (article.source?.trim() && isExternalLink(article.source.trim())) {
      return article.source.trim();
    }
    if (article.pdfUrl?.trim()) {
      return article.pdfUrl.trim();
    }
    return "";
  };
  const getLinkProps = (article: PressArticle) => {
    const href = getArticleLink(article);
    if (!href) return null;
    const external = isExternalLink(href);
    return external
      ? { href, target: "_blank", rel: "noopener noreferrer" as const }
      : { href };
  };
  const getMetaItems = (article: PressArticle) => {
    const meta: Array<{ icon: typeof User; label: string }> = [];
    const author = article.author?.trim();
    if (author) {
      meta.push({ icon: User, label: author });
    }
    const dateLabel = formatArticleDate(article.date);
    if (dateLabel) {
      meta.push({ icon: Calendar, label: dateLabel });
    }
    return meta;
  };

  // Get the latest article (first one from displayArticles, sorted by date descending from API)
  const latestArticle = displayArticles.length > 0 ? displayArticles[0] : null;

  const searchLower = searchQuery.trim().toLowerCase();
  const filteredArticles = displayArticles.filter((article) => {
    const matchesCategory =
      selectedCategory === "All" ||
      normalizeCategory(article) === selectedCategory;
    const matchesSearch =
      searchLower.length === 0 ||
      [
        article.title,
        article.publication,
        article.excerpt,
        article.author,
        article.quote,
        article.topic,
      ]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(searchLower));

    return matchesCategory && matchesSearch;
  });

  const featuredArticle =
    filteredArticles.find((article) => article.featured) ?? filteredArticles[0];
  const regularArticles = featuredArticle
    ? filteredArticles.filter((article) => article.id !== featuredArticle.id)
    : filteredArticles;

  const displayedArticles = regularArticles.slice(0, displayCount);
  const hasMoreArticles = displayCount < regularArticles.length;

  const articleCountLabel =
    filteredArticles.length === 1
      ? getTranslatedText("article", "article")
      : getTranslatedText("articles", "articles");

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 9);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30">
      <Header />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#367375] to-[#24C3BC] text-white">
        <div className="absolute inset-0 bg-[url('/abstract-science-pattern.png')] opacity-20 bg-cover bg-center" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Content */}
            <div className="order-2 lg:order-1">
              <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                <Sparkles className="h-3 w-3 mr-1.5" />
                {getTranslatedText("mediaCoverage", "Media Coverage")}
              </Badge>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                {getTranslatedText(
                  "othersTalkingAbout",
                  "Others Talking About"
                )}{" "}
                <span className="text-white drop-shadow-lg">
                  {getTranslatedText("stempower", "STEMpower")}
                </span>
              </h1>

              <p className="text-lg text-cyan-100 max-w-3xl mx-auto text-pretty">
                {getTranslatedText(
                  "discoverHowLeading",
                  "Discover how leading Ethiopian media outlets, journalists, and thought leaders are covering our mission to transform STEM education nationwide."
                )}
              </p>
              <br />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-white/20">
                {displayStats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-emerald-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative w-full sm:w-[90%] md:w-[95%] lg:w-full aspect-5/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
                {latestArticle && getArticleImage(latestArticle) ? (
                  <Image
                    src={getArticleImage(latestArticle)}
                    alt={latestArticle.title || "Latest media coverage"}
                    fill
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[#367375]/40 to-[#24C3BC]/40 text-center px-6">
                    <div className="space-y-3 text-white/80">
                      <Globe className="w-10 h-10 mx-auto" />
                      <p className="text-sm md:text-base">
                        {getTranslatedText(
                          "coverageComingSoon",
                          "Media coverage will appear here once available."
                        )}
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm mb-3">
                    {getTranslatedText("latestCoverage", "Latest Coverage")}
                  </Badge>
                  <h3 className="text-xl font-bold text-balance line-clamp-2">
                    {latestArticle && latestArticle.title
                      ? latestArticle.title
                      : getTranslatedText(
                          "coverageComingSoon",
                          "Media coverage will appear here once available."
                        )}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-background to-transparent" />
      </section>
      <br />

      {/* Search and Filter Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={getTranslatedText(
                "searchByPublication",
                "Search by publication, author, title, or keyword..."
              )}
              className="pl-12 h-14 text-base shadow-md border-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {displayCategories.map((cat) => (
            <Button
              key={cat.original}
              variant={
                cat.original === selectedCategory ? "default" : "outline"
              }
              className={
                cat.original === selectedCategory
                  ? "bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#24C3BC] hover:to-[#367375] text-white shadow-md transition-all duration-300"
                  : "hover:border-[#367375] hover:text-transparent hover:bg-linear-to-r hover:from-[#367375] hover:to-[#24C3BC] hover:bg-clip-text border-2 transition-all duration-300"
              }
              size="lg"
              onClick={() => setSelectedCategory(cat.original)}
            >
              {cat.translated}
            </Button>
          ))}
        </div>
        {error && (
          <Card className="mt-10 border-destructive/20 bg-destructive/5">
            <CardContent className="py-6 text-center text-destructive">
              {selectedLanguage === "en"
                ? error
                : getTranslatedText("unableToLoadCoverage", error)}
            </CardContent>
          </Card>
        )}
      </section>

      {loading && articles.length === 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <Card className="border-dashed">
            <CardContent className="py-10 flex items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              {getTranslatedText(
                "loadingMediaCoverage",
                "Loading media coverage..."
              )}
            </CardContent>
          </Card>
        </section>
      )}

      {/* Featured Article */}
      {featuredArticle && (
        <section
          ref={articlesRef}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-linear-to-r from-[#367375] to-[#24C3BC] bg-clip-text text-transparent mb-2">
              {getTranslatedText("featuredCoverage", "Featured Coverage")}
            </h2>
            <p className="bg-linear-to-r from-[#367375] to-[#24C3BC] bg-clip-text text-transparent font-medium">
              {getTranslatedText(
                "highlightedMediaFeature",
                "Highlighted media feature about our impact"
              )}
            </p>
          </div>

          <Card className="overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 group bg-linear-to-br from-card to-muted/20">
            <div className="grid lg:grid-cols-5 gap-0">
              <div className="relative lg:col-span-2 h-80 lg:h-auto overflow-hidden bg-linear-to-br from-[#367375]/10 to-[#24C3BC]/10">
                {featuredArticle.image ? (
                  <Image
                    src={getArticleImage(featuredArticle)}
                    alt={featuredArticle.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Building2 className="w-20 h-20 text-[#367375]/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-[#367375]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-6 left-6 bg-[#367375] text-white border-0 text-sm px-4 py-1.5 shadow-lg">
                  {getTranslatedText("featured", "⭐ Featured")}
                </Badge>
              </div>

              <CardContent className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                {normalizeCategory(featuredArticle) && (
                  <Badge
                    variant="outline"
                    className="w-fit mb-4 border-[#367375] text-[#367375] px-3 py-1"
                  >
                    {normalizeCategory(featuredArticle)}
                  </Badge>
                )}

                <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-balance bg-linear-to-r from-[#367375] to-[#24C3BC] bg-clip-text text-transparent transition-colors leading-tight">
                  {featuredArticle.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  {getMetaItems(featuredArticle).map((item, index) => (
                    <Fragment key={`${item.label}-${index}`}>
                      {index > 0 && <span>•</span>}
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </Fragment>
                  ))}
                </div>

                {getQuote(featuredArticle) && (
                  <div className="bg-[#367375]/5 border-l-4 border-[#367375] p-4 mb-6 rounded-r">
                    <p className="text-[#367375] italic leading-relaxed">
                      "{getQuote(featuredArticle)}"
                    </p>
                  </div>
                )}

                <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                  {featuredArticle.excerpt ||
                    featuredArticle.content ||
                    getQuote(featuredArticle)}
                </p>

                <div className="flex flex-wrap gap-3">
                  {(() => {
                    const linkProps = getLinkProps(featuredArticle);
                    return (
                      <Button
                        asChild={Boolean(linkProps)}
                        size="lg"
                        className="bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#24C3BC] hover:to-[#367375] shadow-md transition-all duration-300"
                        disabled={!linkProps}
                      >
                        {linkProps ? (
                          <a {...linkProps}>
                            {getTranslatedText(
                              "readFullArticle",
                              "Read Full Article"
                            )}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        ) : (
                          <span>
                            {getTranslatedText(
                              "readFullArticle",
                              "Read Full Article"
                            )}
                          </span>
                        )}
                      </Button>
                    );
                  })()}
                  {featuredArticle.pdfUrl?.trim() && (
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-[#24C3BC] text-[#24C3BC] hover:bg-[#24C3BC]/10"
                    >
                      <a
                        href={featuredArticle.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {getTranslatedText("downloadPdf", "Download PDF")}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        </section>
      )}

      {/* Articles Grid */}
      {regularArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-linear-to-r from-[#367375] to-[#24C3BC] bg-clip-text text-transparent mb-2">
                {selectedCategory === "All"
                  ? getTranslatedText("allMediaCoverage", "All Media Coverage")
                  : `${selectedCategory} ${getTranslatedText(
                      "categoryCoverage",
                      "Coverage"
                    )}`}
              </h2>
              <p className="bg-linear-to-r from-[#367375] to-[#24C3BC] bg-clip-text text-transparent font-medium">
                {getTranslatedText(
                  "whatEthiopianMedia",
                  "What Ethiopian media is saying about our work"
                )}
              </p>
            </div>
            <Badge variant="outline" className="text-base px-4 py-2">
              {filteredArticles.length} {articleCountLabel}
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group bg-card flex flex-col hover:border-[#24C3BC]/30"
              >
                <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-[#367375]/10 to-[#24C3BC]/10">
                  {article.image ? (
                    <Image
                      src={getArticleImage(article)}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-[#367375]/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-[#367375]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Publication Header */}
                <div className="relative bg-linear-to-br from-[#367375]/5 to-[#24C3BC]/5 p-6 border-b">
                  <div className="flex items-start justify-between mb-3">
                    <Building2 className="w-10 h-10 text-[#367375]" />
                    {normalizeCategory(article) && (
                      <Badge className="bg-[#367375] text-white text-xs">
                        {normalizeCategory(article)}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-lg bg-linear-to-r from-[#367375] to-[#24C3BC] bg-clip-text text-transparent mb-1">
                    {getPublicationName(article) ||
                      getTranslatedText(
                        "publicationUnavailable",
                        "Publication unavailable"
                      )}
                  </h4>
                  {getPublicationType(article) && (
                    <p className="text-sm bg-linear-to-r from-[#2a9b96] to-[#24C3BC] bg-clip-text text-transparent font-medium">
                      {getPublicationType(article)}
                    </p>
                  )}
                </div>

                <CardContent className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-balance bg-linear-to-r from-[#367375] to-[#24C3BC] bg-clip-text text-transparent transition-colors line-clamp-2 leading-snug group-hover:opacity-80">
                    {article.title ||
                      getTranslatedText(
                        "titleUnavailable",
                        "Title unavailable"
                      )}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4 pb-4 border-b">
                    {getMetaItems(article).map((item, index) => (
                      <Fragment key={`${item.label}-${index}`}>
                        {index > 0 && <span>•</span>}
                        <div className="flex items-center gap-1.5">
                          <item.icon className="w-3.5 h-3.5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>

                  {/* Quote */}
                  {getQuote(article) && (
                    <div className="bg-[#367375]/5 border-l-4 border-[#367375] p-3 mb-4 rounded-r group-hover:bg-[#24C3BC]/10 group-hover:border-[#24C3BC] transition-all duration-300">
                      <p className="text-sm text-[#367375] italic line-clamp-2 group-hover:text-[#24C3BC]">{`"${getQuote(
                        article
                      )}"`}</p>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-1">
                    {article.excerpt || article.content || getQuote(article)}
                  </p>

                  <Button
                    asChild={Boolean(getLinkProps(article))}
                    size="sm"
                    className="w-full bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#24C3BC] hover:to-[#367375] shadow-sm transition-all duration-300"
                    disabled={!getLinkProps(article)}
                  >
                    {getLinkProps(article) ? (
                      <a {...getLinkProps(article)}>
                        {getTranslatedText(
                          "readFullArticle",
                          "Read Full Article"
                        )}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    ) : (
                      <span>
                        {getTranslatedText(
                          "readFullArticle",
                          "Read Full Article"
                        )}
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {hasMoreArticles && (
            <div className="mt-16 text-center">
              <Button
                size="lg"
                className="min-w-60 shadow-md bg-linear-to-r from-[#367375] to-[#24C3BC] text-white hover:from-[#24C3BC] hover:to-[#367375] transition-all duration-300 font-semibold"
                onClick={handleLoadMore}
              >
                {getTranslatedText("loadMoreArticles", "Load More Articles")}
              </Button>
            </div>
          )}
        </section>
      )}

      {/* No Results Message */}
      {filteredArticles.length === 0 && !loading && (
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <Card className="p-16 text-center border-dashed">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3 bg-linear-to-r from-[#367375] to-[#24C3BC] bg-clip-text text-transparent">
                {getTranslatedText("noArticlesFound", "No articles found")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {getTranslatedText(
                  "tryAdjustingSearch",
                  "Try adjusting your search or filter to find what you're looking for."
                )}
              </p>
              <Button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="bg-linear-to-r from-[#367375] to-[#24C3BC] hover:from-[#24C3BC] hover:to-[#367375] text-white transition-all duration-300"
              >
                {getTranslatedText("clearFilters", "Clear Filters")}
              </Button>
            </div>
          </Card>
        </section>
      )}

      <Footer />
    </div>
  );
}
