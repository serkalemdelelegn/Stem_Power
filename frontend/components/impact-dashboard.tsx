"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  GraduationCap,
  Building,
  Award,
  Lightbulb,
  Globe,
  Badge,
  MapPin,
} from "lucide-react";

interface ImpactStat {
  id: string;
  icon: string;
  title: string;
  value: number;
  displayValue: string;
  description: string;
  progress: number;
  trend: string;
  location: string;
}

const iconMap: Record<string, typeof Building> = {
  Building,
  Users,
  GraduationCap,
  Award,
  Lightbulb,
  Globe,
};

const colors = [
  "text-chart-1",
  "text-chart-2",
  "text-chart-3",
  "text-chart-4",
  "text-chart-5",
  "text-chart-1",
];

export function ImpactDashboard() {
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactStats = async () => {
      try {
        const response = await fetch("/api/home/impact");
        if (response.ok) {
          const data = await response.json();
          setImpactStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch impact stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImpactStats();
  }, []);
  return (
    <section className="py-15 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <Badge
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
        border-primary/20 bg-linear-to-br from-[#367375] to-[#24C3BC] 
        text-white rounded-full shadow-md"
            >
              <MapPin className="w-4 h-4" />
              Our impact across Ethiopi
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Transforming lives through STEM education and empowering the next
            generation of Ethiopian innovators and leaders.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Loading impact statistics...
            </p>
          </div>
        ) : impactStats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No impact statistics available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactStats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon] || Building;
              const color = colors[index % colors.length];
              return (
                <Card
                  key={stat.id}
                  className="relative overflow-hidden group hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg bg-primary/10 ${color}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="text-right">
                        <CardTitle className="text-2xl lg:text-3xl font-bold">
                          {stat.displayValue}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{stat.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{stat.progress}%</span>
                      </div>
                      <Progress value={stat.progress} className="h-2" />
                    </div>
                  </CardContent>
                  <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Data updated as of December 2024 • Growing every day through
            community partnerships
          </p>
        </div>
      </div>
    </section>
  );
}
