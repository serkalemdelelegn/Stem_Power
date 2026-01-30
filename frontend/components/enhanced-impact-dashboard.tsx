"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  Building,
  Award,
  Lightbulb,
  Globe,
  TrendingUp,
  MapPin,
} from "lucide-react";
import {
  fetchImpactStats,
  type ImpactMetadataStat,
  type ImpactAdditionalMetric,
} from "@/lib/api-content";
import { useApp } from "@/lib/app-context";

type ImpactMetricKey = "stem_centers" | "program_participation" | "events_held";

type ImpactStat = {
  key: ImpactMetricKey;
  title: string;
  icon: any;
  description: string;
  progress: number;
  trend: string;
  location: string;
  value: number;
  displayValue: string;
};

type AdditionalMetric = ImpactAdditionalMetric;

const metricTemplates: Array<Omit<ImpactStat, "value" | "displayValue">> = [
  {
    key: "stem_centers",
    title: "STEM Centers",
    icon: Building,
    description: "Active hands-on STEM learning centers across Ethiopia",
    progress: 75,
    trend: "",
    location: "Nationwide Coverage",
  },
  {
    key: "program_participation",
    title: "Students Impacted",
    icon: Users,
    description: "Young minds empowered through our comprehensive programs",
    progress: 88,
    trend: "",
    location: "All Regions",
  },
  {
    key: "events_held",
    title: "Science Fairs Organized",
    icon: Award,
    description: "Local and national science fairs celebrating excellence",
    progress: 78,
    trend: "",
    location: "Multi-Regional",
  },
];

const formatDisplay = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M+`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K+`;
  return `${value}+`;
};

export function EnhancedImpactDashboard() {
  const { selectedLanguage } = useApp();
  const [animatedValues, setAnimatedValues] = useState<number[]>([]);
  const [stats, setStats] = useState<ImpactStat[]>([]);
  const [additionalMetrics, setAdditionalMetrics] = useState<
    AdditionalMetric[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<
    Record<string, string>
  >({});

  const mergeStat = (
    template: ImpactStat,
    value: number,
    meta?: ImpactMetadataStat
  ): ImpactStat => {
    const displayValue = meta?.displayValue || formatDisplay(value);
    const iconFromMeta =
      meta?.icon &&
      metricTemplates.find((t) => t.icon.name === meta.icon)?.icon;

    return {
      ...template,
      value,
      displayValue,
      title: meta?.title || template.title,
      description: meta?.description || template.description,
      progress:
        meta?.progress !== undefined
          ? Number(meta.progress)
          : template.progress,
      trend: meta?.trend || template.trend,
      location: meta?.location || template.location,
      icon: iconFromMeta || template.icon,
    };
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const backendData = await fetchImpactStats();
        if (backendData) {
          const rawStats =
            backendData.stats || backendData.metadata?.stats || [];
          const primaryStats = rawStats.filter((stat) => !stat.is_extra);

          const builtStats: ImpactStat[] =
            primaryStats.length > 0
              ? primaryStats.map((meta) => {
                  const key =
                    (meta.metricKey as ImpactMetricKey) || "stem_centers";
                  const template =
                    metricTemplates.find((t) => t.key === key) ||
                    metricTemplates[0];
                  const valueFromMeta = meta.value ?? backendData[key] ?? 0;
                  return mergeStat(
                    template as ImpactStat,
                    Number(valueFromMeta) || 0,
                    meta
                  );
                })
              : (metricTemplates
                  .map((template) => {
                    const value = backendData[template.key];
                    if (value === undefined || value === null) return null;
                    return mergeStat(
                      template as ImpactStat,
                      Number(value) || 0
                    );
                  })
                  .filter(Boolean) as ImpactStat[]);

          const extras =
            backendData.additionalMetrics ||
            backendData.metadata?.additionalMetrics ||
            [];

          setStats(builtStats);
          setAnimatedValues(builtStats.map(() => 0));
          setAdditionalMetrics(extras);
        } else {
          setStats([]);
          setAnimatedValues([]);
          setAdditionalMetrics([]);
        }
      } catch (error) {
        console.error("Failed to load impact stats:", error);
        setStats([]);
        setAnimatedValues([]);
        setAdditionalMetrics([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  // Translation effect
  useEffect(() => {
    if (selectedLanguage === "en" || stats.length === 0) {
      setTranslatedContent({});
      return;
    }

    const translateContent = async () => {
      setTranslating(true);
      const translations: Record<string, string> = {};

      try {
        // Translate header
        translations.ourImpactAcrossEthiopia = await translateText(
          "Our impact across Ethiopia",
          selectedLanguage
        );
        translations.impactDescription = await translateText(
          "From bustling cities to remote villages, STEMpower Ethiopia is creating opportunities for young minds to explore, innovate, and lead. Our comprehensive programs reach every corner of the nation, building a brighter future through science and technology.",
          selectedLanguage
        );
        translations.progress = await translateText(
          "Progress",
          selectedLanguage
        );

        // Translate each stat
        for (let i = 0; i < stats.length; i++) {
          const stat = stats[i];
          translations[`stat_${i}_title`] = await translateText(
            stat.title,
            selectedLanguage
          );
          translations[`stat_${i}_description`] = await translateText(
            stat.description,
            selectedLanguage
          );
          translations[`stat_${i}_location`] = await translateText(
            stat.location,
            selectedLanguage
          );
          // Translate trend (e.g., "+8 this year" -> translate "this year" part)
          const trendMatch = stat.trend.match(/^([+\-]?\d+[KMB]?)\s*(.*)$/);
          if (trendMatch) {
            const numberPart = trendMatch[1];
            const textPart = trendMatch[2] || "";
            if (textPart) {
              const translatedTextPart = await translateText(
                textPart,
                selectedLanguage
              );
              translations[
                `stat_${i}_trend`
              ] = `${numberPart} ${translatedTextPart}`;
            } else {
              translations[`stat_${i}_trend`] = stat.trend;
            }
          } else {
            translations[`stat_${i}_trend`] = await translateText(
              stat.trend,
              selectedLanguage
            );
          }
        }

        setTranslatedContent(translations);
      } catch (error) {
        console.error("Error translating impact dashboard content:", error);
      } finally {
        setTranslating(false);
      }
    };

    translateContent();
  }, [selectedLanguage, stats]);

  const getTranslatedText = (key: string, fallback: string): string => {
    if (selectedLanguage === "en") return fallback;
    return translatedContent[key] || fallback;
  };

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      return setTimeout(() => {
        const duration = 2000;
        const steps = 60;
        const increment =
          (stat.value || Number.parseInt(stat.displayValue)) / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= (stat.value || Number.parseInt(stat.displayValue))) {
            current = stat.value || Number.parseInt(stat.displayValue);
            clearInterval(timer);
          }
          setAnimatedValues((prev) => {
            const newValues = [...prev];
            newValues[index] = Math.floor(current);
            return newValues;
          });
        }, duration / steps);
      }, index * 200);
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [stats]);

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

  return (
    <section className="py-24 bg-linear-to-br from-muted/30 via-background to-muted/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(0,188,162,0.08),rgba(255,255,255,0))]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-10">
          <div className="flex justify-center">
            <Badge
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
              border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
              text-white rounded-full shadow-md"
            >
              <MapPin className="w-4 h-4" />
              {getTranslatedText(
                "ourImpactAcrossEthiopia",
                "Our impact across Ethiopia"
              )}
            </Badge>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mt-4 mb-3 text-foreground">
            {getTranslatedText(
              "ourImpactAcrossEthiopia",
              "Our impact across Ethiopia"
            )}
          </h2>
          <p className="max-w-3xl mx-auto text-muted-foreground">
            {getTranslatedText(
              "impactDescription",
              "From bustling cities to remote villages, STEMpower Ethiopia is creating opportunities for young minds to explore, innovate, and lead. Our comprehensive programs reach every corner of the nation, building a brighter future through science and technology."
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">
            Loading impact metrics...
          </div>
        ) : stats.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            Impact data is not available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {stats.map((stat, index) => (
              <Card
                key={`${stat.key}-${index}`}
                className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-background/80 backdrop-blur"
              >
                <div className="absolute inset-0 bg-linear-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-linear-to-br from-[#367375] to-[#24C3BC] text-white group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-7 w-7" />
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {getTranslatedText(
                        `stat_${index}_trend`,
                        stat.trend || ""
                      ) || "No trend"}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl lg:text-4xl font-bold mb-2">
                    {index < animatedValues.length
                      ? animatedValues[index] >= 1000
                        ? `${Math.floor(animatedValues[index] / 1000)}${
                            animatedValues[index] >= 1000000 ? "M" : "K"
                          }+`
                        : `${animatedValues[index]}+`
                      : stat.displayValue}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {getTranslatedText(`stat_${index}_title`, stat.title)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {getTranslatedText(
                        `stat_${index}_description`,
                        stat.description
                      )}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">
                        {getTranslatedText("progress", "Progress")}
                      </span>
                      <span className="font-bold">{stat.progress}%</span>
                    </div>
                    <Progress value={stat.progress} className="h-2" />
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground pt-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {getTranslatedText(`stat_${index}_location`, stat.location)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {additionalMetrics.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {additionalMetrics.map((metric, idx) => (
              <Card
                key={metric.id || idx}
                className="border border-primary/10 bg-background/70"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      {metric.label}
                    </span>
                    <span className="text-xl font-semibold text-foreground">
                      {metric.value}
                    </span>
                  </div>
                  <Badge variant="outline">Extra</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
