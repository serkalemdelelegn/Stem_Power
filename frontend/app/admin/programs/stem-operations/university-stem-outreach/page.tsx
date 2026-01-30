"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/ui/admin-header";
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
import { Save, Building2, Users, TrendingUp, CheckCircle2 } from "lucide-react";

interface Statistic {
  id: string;
  icon: string;
  number: string;
  label: string;
}

export default function UniversitySTEMOutreachPage() {
  const [isSaving, setIsSaving] = useState(false);

  // Hero Banner Section
  const [heroBanner, setHeroBanner] = useState({
    title: "University STEM Outreach",
    subtitle:
      "Partnering with Ethiopia's leading universities to expand STEM education and innovation across the nation.",
  });

  // Statistics Section
  const [statistics, setStatistics] = useState<Statistic[]>([
    { id: "1", icon: "building", number: "40+", label: "Public Universities" },
    { id: "2", icon: "users", number: "10,000+", label: "Students Annually" },
    { id: "3", icon: "trending", number: "2 Years", label: "To Full Adoption" },
    { id: "4", icon: "check", number: "100%", label: "Government Backed" },
  ]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert("University STEM Outreach page updated successfully!");
  };

  const updateStatistic = (
    id: string,
    field: keyof Statistic,
    value: string
  ) => {
    setStatistics(
      statistics.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "building":
        return <Building2 className="h-8 w-8 text-[#00BFA6]" />;
      case "users":
        return <Users className="h-8 w-8 text-[#00BFA6]" />;
      case "trending":
        return <TrendingUp className="h-8 w-8 text-[#00BFA6]" />;
      case "check":
        return <CheckCircle2 className="h-8 w-8 text-[#00BFA6]" />;
      default:
        return <Building2 className="h-8 w-8 text-[#00BFA6]" />;
    }
  };

  return (
    <div>
      <AdminHeader
        title="University STEM Outreach"
        description="Manage university STEM outreach program content and statistics"
      />
      <div className="p-6 max-w-7xl">
        <div className="space-y-6">
          {/* Hero Banner Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Banner</CardTitle>
              <CardDescription>
                Main banner content for the University STEM Outreach page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Title</Label>
                <Input
                  id="heroTitle"
                  value={heroBanner.title}
                  onChange={(e) =>
                    setHeroBanner({ ...heroBanner, title: e.target.value })
                  }
                  placeholder="e.g., University STEM Outreach"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Subtitle</Label>
                <Textarea
                  id="heroSubtitle"
                  rows={2}
                  value={heroBanner.subtitle}
                  onChange={(e) =>
                    setHeroBanner({ ...heroBanner, subtitle: e.target.value })
                  }
                  placeholder="Describe the program and its impact..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Statistics Section */}
          <Card>
            <CardHeader>
              <CardTitle>Program Statistics</CardTitle>
              <CardDescription>
                Key metrics about the University STEM Outreach program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statistics.map((stat) => (
                  <Card key={stat.id} className="overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-center">
                        {getIconComponent(stat.icon)}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Number
                        </Label>
                        <Input
                          value={stat.number}
                          onChange={(e) =>
                            updateStatistic(stat.id, "number", e.target.value)
                          }
                          placeholder="e.g., 40+"
                          className="text-center text-2xl font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Label
                        </Label>
                        <Input
                          value={stat.label}
                          onChange={(e) =>
                            updateStatistic(stat.id, "label", e.target.value)
                          }
                          placeholder="e.g., Public Universities"
                          className="text-center"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                How the page will appear to visitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Hero Banner Preview */}
              <div className="bg-linear-to-br from-[#00BFA6] to-[#00897B] rounded-lg p-12 text-center text-white mb-6">
                <h1 className="text-4xl font-bold mb-4">{heroBanner.title}</h1>
                <p className="text-lg text-white/90 max-w-3xl mx-auto">
                  {heroBanner.subtitle}
                </p>
              </div>

              {/* Statistics Preview */}
              <div className="bg-linear-to-br from-[#00BFA6]/10 to-[#00897B]/10 rounded-lg p-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {statistics.map((stat) => (
                    <div
                      key={stat.id}
                      className="bg-white rounded-lg p-6 text-center shadow-sm"
                    >
                      <div className="flex justify-center mb-4">
                        {getIconComponent(stat.icon)}
                      </div>
                      <div className="text-3xl font-bold text-[#00BFA6] mb-2">
                        {stat.number}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
