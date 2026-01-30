"use client";

import { useState, useEffect } from "react";
import { backendApi } from "@/lib/backend-api";
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
import { Save, Plus, Trash2, Upload, X } from "lucide-react";

interface University {
  id: string;
  name: string;
  location: string;
  description: string;
  students: string;
  programs: string;
  facilities: string;
  keyFacilities: string[];
  notableAchievements: string[];
  image: string | File | null;
  imagePreview?: string;
  establishmentYear: string;
}

interface HeroStats {
  id?: string;
  label: string;
  value: string;
  icon: string;
}

interface ProgramBenefitItem {
  id?: string;
  title: string;
  description: string;
  icon: string;
  order?: number;
}

interface TimelineItem {
  id?: string;
  phase: string;
  title: string;
  description: string;
  year: string;
  order?: number;
}

export default function UniversityOutreachPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [heroId, setHeroId] = useState<string | null>(null);
  const [heroData, setHeroData] = useState({
    badge: "University Partnerships",
    title: "University STEM Outreach",
    description:
      "Collaborative programs with universities to advance STEM education and research across Africa.",
  });

  const [stats, setStats] = useState<HeroStats[]>([
    { label: "Public Universities", value: "40+", icon: "Building2" },
    { label: "Students Annually", value: "10,000+", icon: "Users" },
    { label: "To Full Adoption", value: "2 Years", icon: "TrendingUp" },
    { label: "Government Backed", value: "100%", icon: "CheckCircle2" },
  ]);

  const ICON_OPTIONS = [
    { value: "Building2", label: "Building" },
    { value: "Users", label: "Users" },
    { value: "TrendingUp", label: "Trending Up" },
    { value: "CheckCircle2", label: "Check Circle" },
    { value: "GraduationCap", label: "Graduation Cap" },
    { value: "Target", label: "Target" },
    { value: "Lightbulb", label: "Lightbulb" },
  ];

  const [universities, setUniversities] = useState<University[]>([]);
  const [benefits, setBenefits] = useState<ProgramBenefitItem[]>([]);
  const [timelines, setTimelines] = useState<TimelineItem[]>([]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Load hero (array; use first)
      try {
        const heroArray = await backendApi.get("/api/university-outreach");
        const first =
          Array.isArray(heroArray) && heroArray.length ? heroArray[0] : null;
        if (first?.id) setHeroId(String(first.id));
        setHeroData({
          badge: first?.badge || heroData.badge,
          title: first?.title || heroData.title,
          description:
            first?.subtitle || first?.description || heroData.description,
        });
      } catch (e) {
        console.error("Failed to fetch hero:", e);
      }

      // Load universities
      try {
        const universitiesData = await backendApi.get(
          "/api/university-outreach/universities"
        );
        if (Array.isArray(universitiesData)) {
          setUniversities(
            universitiesData.map((u: any) => ({
              id: String(u.id || ""),
              name: u.name || u.title || "",
              location: u.location || "",
              description: u.description || u.university_details || "",
              students: u.studentsServed || "",
              programs: u.programStartYear ? `Since ${u.programStartYear}` : "",
              facilities: u.facilities ? String(u.facilities.length) : "",
              keyFacilities: Array.isArray(u.facilities)
                ? u.facilities
                : u.key_facilities
                ? (() => {
                    try {
                      return JSON.parse(u.key_facilities);
                    } catch {
                      return (u.key_facilities || "")
                        .split(",")
                        .map((f: string) => f.trim())
                        .filter(Boolean);
                    }
                  })()
                : [],
              notableAchievements: Array.isArray(u.achievements)
                ? u.achievements
                : u.notable_achievements
                ? (() => {
                    try {
                      return JSON.parse(u.notable_achievements);
                    } catch {
                      return (u.notable_achievements || "")
                        .split(",")
                        .map((a: string) => a.trim())
                        .filter(Boolean);
                    }
                  })()
                : [],
              image: u.image || u.university_image || null,
              establishmentYear: u.established ? `Est. ${u.established}` : "",
            }))
          );
        }
      } catch (e) {
        console.error("Failed to fetch universities:", e);
      }
      // Fetch stats with IDs via dedicated endpoint (backendApi)
      try {
        const statsData = await backendApi.get(
          "/api/university-outreach/impact-stats"
        );
        if (Array.isArray(statsData)) {
          setStats(
            statsData.map((s: any) => ({
              id: s.id,
              label: s.label || "",
              value: s.number || s.value || "",
              icon: s.icon || "Building2",
            }))
          );
        }
      } catch (e) {
        console.error("Failed to fetch impact stats:", e);
      }

      // Fetch program benefits (backendApi)
      try {
        const benefitsData = await backendApi.get(
          "/api/university-outreach/program-benefits"
        );
        if (Array.isArray(benefitsData)) {
          setBenefits(
            benefitsData.map((b: any) => ({
              id: b.id,
              title: b.title || "",
              description: b.description || "",
              icon: b.icon || "Building2",
              order: typeof b.order === "number" ? b.order : 0,
            }))
          );
        }
      } catch (e) {
        console.error("Failed to fetch program benefits:", e);
      }

      // Fetch timelines (backendApi)
      try {
        const timelinesData = await backendApi.get(
          "/api/university-outreach/timelines"
        );
        if (Array.isArray(timelinesData)) {
          setTimelines(
            timelinesData.map((t: any) => ({
              id: t.id,
              phase: t.phase || "",
              title: t.title || "",
              description: t.description || "",
              year: t.year || "",
              order: typeof t.order === "number" ? t.order : 0,
            }))
          );
        }
      } catch (e) {
        console.error("Failed to fetch timelines:", e);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (id: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setUniversities(
      universities.map((u) =>
        u.id === id
          ? {
              ...u,
              image: file,
              imagePreview: previewUrl,
            }
          : u
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1) Save hero first to ensure we have an outreach id
      let currentHeroId = heroId;
      try {
        const heroPayload = {
          id: currentHeroId || undefined,
          badge: heroData.badge,
          title: heroData.title,
          // Persist as subtitle to match backend model; keep description for compatibility
          subtitle: heroData.description,
          description: heroData.description,
        };
        const savedHero = currentHeroId
          ? await backendApi.put(
              `/api/university-outreach/${currentHeroId}`,
              heroPayload
            )
          : await backendApi.post("/api/university-outreach", heroPayload);
        if (savedHero?.id) {
          currentHeroId = String(savedHero.id);
          setHeroId(currentHeroId);
        }
      } catch (e: any) {
        throw new Error(e.message || "Failed to save hero section");
      }

      // 2) Upsert impact stats
      if (currentHeroId) {
        // First, get all existing stats to find ones to delete
        const existingStats: HeroStats[] = await backendApi.get(
          "/api/university-outreach/impact-stats"
        );
        const currentStatIds = stats
          .map((s) => s.id)
          .filter((id): id is string => !!id);
        const statsToDelete = existingStats.filter(
          (s) => s.id && !currentStatIds.includes(s.id)
        );

        // Delete removed stats
        for (const statToDelete of statsToDelete) {
          if (statToDelete.id) {
            await backendApi.delete(
              `/api/university-outreach/impact-stats/${statToDelete.id}`
            );
          }
        }

        // Create or update stats
        const updatedStats = [...stats];
        for (let index = 0; index < stats.length; index++) {
          const stat = stats[index];
          // Skip empty stats
          if (!stat.label && !stat.value) continue;

          const payload = {
            label: stat.label,
            number: stat.value,
            icon: stat.icon || "Building2",
            university_outreach_id: currentHeroId,
          } as any;
          if (stat.id) {
            const updated = await backendApi.put(
              `/api/university-outreach/impact-stats/${stat.id}`,
              payload
            );
            // Update local state with returned ID if it was missing
            if (updated.id) {
              updatedStats[index] = {
                ...updatedStats[index],
                id: String(updated.id),
              };
            }
          } else {
            const created = await backendApi.post(
              "/api/university-outreach/impact-stats",
              payload
            );
            // Update local state with new ID
            if (created.id) {
              updatedStats[index] = {
                ...updatedStats[index],
                id: String(created.id),
              };
            }
          }
        }
        setStats(updatedStats);
      }

      // 3) Upsert program benefits (and delete removed ones)
      if (currentHeroId) {
        // Fetch existing to determine deletions
        const existingBenefits: ProgramBenefitItem[] = await backendApi.get(
          "/api/university-outreach/program-benefits"
        );
        const currentBenefitIds = benefits
          .map((b) => b.id)
          .filter((id): id is string => !!id);
        const benefitsToDelete = existingBenefits.filter(
          (b) => b.id && !currentBenefitIds.includes(String(b.id))
        );

        // Delete removed benefits
        for (const benefitToDelete of benefitsToDelete) {
          if (benefitToDelete.id) {
            await backendApi.delete(
              `/api/university-outreach/program-benefits/${benefitToDelete.id}`
            );
          }
        }

        // Create or update current benefits
        const updatedBenefits = [...benefits];
        for (let index = 0; index < benefits.length; index++) {
          const b = benefits[index];
          if (!b.title && !b.description) continue;
          const payload = {
            title: b.title,
            description: b.description,
            icon: b.icon,
            order: b.order ?? 0,
            university_outreach_id: currentHeroId,
          };
          if (b.id) {
            try {
              const updated = await backendApi.put(
                `/api/university-outreach/program-benefits/${b.id}`,
                payload
              );
              if (updated?.id) {
                updatedBenefits[index] = {
                  ...updatedBenefits[index],
                  id: String(updated.id),
                };
              }
            } catch (err) {
              const created = await backendApi.post(
                "/api/university-outreach/program-benefits",
                payload
              );
              if (created?.id) {
                updatedBenefits[index] = {
                  ...updatedBenefits[index],
                  id: String(created.id),
                };
              }
            }
          } else {
            const created = await backendApi.post(
              "/api/university-outreach/program-benefits",
              payload
            );
            if (created?.id) {
              updatedBenefits[index] = {
                ...updatedBenefits[index],
                id: String(created.id),
              };
            }
          }
        }
        setBenefits(updatedBenefits);
      }

      // 4) Upsert timelines (and delete removed ones)
      if (currentHeroId) {
        // Fetch existing to determine deletions
        const existingTimeline: TimelineItem[] = await backendApi.get(
          "/api/university-outreach/timelines"
        );
        const currentTimelineIds = timelines
          .map((t) => t.id)
          .filter((id): id is string => !!id);
        const timelineToDelete = existingTimeline.filter(
          (t) => t.id && !currentTimelineIds.includes(String(t.id))
        );

        // Delete removed items
        for (const tDel of timelineToDelete) {
          if (tDel.id) {
            await backendApi.delete(
              `/api/university-outreach/timelines/${tDel.id}`
            );
          }
        }

        // Create or update current timeline items
        const updatedTimeline = [...timelines];
        for (let index = 0; index < timelines.length; index++) {
          const t = timelines[index];
          if (!t.title && !t.description) continue;
          const payload = {
            phase: t.phase,
            title: t.title,
            description: t.description,
            year: t.year,
            order: t.order ?? 0,
            university_outreach_id: currentHeroId,
          };
          if (t.id) {
            try {
              const updated = await backendApi.put(
                `/api/university-outreach/timelines/${t.id}`,
                payload
              );
              if (updated?.id) {
                updatedTimeline[index] = {
                  ...updatedTimeline[index],
                  id: String(updated.id),
                };
              }
            } catch (err) {
              const created = await backendApi.post(
                "/api/university-outreach/timelines",
                payload
              );
              if (created?.id) {
                updatedTimeline[index] = {
                  ...updatedTimeline[index],
                  id: String(created.id),
                };
              }
            }
          } else {
            const created = await backendApi.post(
              "/api/university-outreach/timelines",
              payload
            );
            if (created?.id) {
              updatedTimeline[index] = {
                ...updatedTimeline[index],
                id: String(created.id),
              };
            }
          }
        }
        setTimelines(updatedTimeline);
      }

      // 5) Save each university
      for (const university of universities) {
        const isNew = !university.id || university.id.startsWith("temp-");

        // Prepare data
        const universityData: any = {
          name: university.name,
          location: university.location,
          description: university.description,
          studentsServed: university.students,
          programStartYear: university.programs
            ? parseInt(university.programs.replace("Since ", ""))
            : null,
          facilities: JSON.stringify(university.keyFacilities),
          achievements: JSON.stringify(university.notableAchievements),
          established: university.establishmentYear
            ? parseInt(university.establishmentYear.replace("Est. ", ""))
            : null,
        };

        // Handle image upload
        if (university.image instanceof File) {
          const formData = new FormData();
          formData.append("file", university.image);
          Object.keys(universityData).forEach((key) => {
            formData.append(
              key,
              typeof universityData[key] === "string"
                ? universityData[key]
                : JSON.stringify(universityData[key])
            );
          });

          const saved = isNew
            ? await backendApi.postFormData(
                "/api/university-outreach/universities",
                formData
              )
            : await backendApi.putFormData(
                `/api/university-outreach/universities/${university.id}`,
                formData
              );

          // Clean up preview URL
          if (university.imagePreview) {
            URL.revokeObjectURL(university.imagePreview);
          }

          // Update local state with saved data
          if (isNew) {
            setUniversities(
              universities.map((u) =>
                u.id === university.id
                  ? {
                      ...u,
                      id: String(saved.id),
                      image: saved.image || null,
                      imagePreview: undefined,
                    }
                  : u
              )
            );
          } else {
            setUniversities(
              universities.map((u) =>
                u.id === university.id
                  ? {
                      ...u,
                      image: saved.image || null,
                      imagePreview: undefined,
                    }
                  : u
              )
            );
          }
        } else {
          // No file upload, use JSON
          universityData.image = university.image || null;

          const saved = isNew
            ? await backendApi.post(
                "/api/university-outreach/universities",
                universityData
              )
            : await backendApi.put(
                `/api/university-outreach/universities/${university.id}`,
                universityData
              );
          if (isNew) {
            setUniversities(
              universities.map((u) =>
                u.id === university.id ? { ...u, id: String(saved.id) } : u
              )
            );
          }
        }
      }

      // Clean up any object URLs used for previews
      universities.forEach((u) => {
        if (u.imagePreview) {
          URL.revokeObjectURL(u.imagePreview);
        }
      });

      alert("University Outreach updated successfully!");
    } catch (error: any) {
      console.error("Error saving:", error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addUniversity = () => {
    setUniversities([
      ...universities,
      {
        id: `temp-${Date.now()}`,
        name: "",
        location: "",
        description: "",
        students: "",
        programs: "",
        facilities: "",
        keyFacilities: [],
        notableAchievements: [],
        image: null,
        establishmentYear: "",
      },
    ]);
  };

  const updateUniversity = (
    id: string,
    field: keyof University,
    value: string | string[] | File | null
  ) => {
    setUniversities(
      universities.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const deleteUniversity = async (id: string) => {
    // Don't delete if it's a temp ID (not saved yet)
    if (id.startsWith("temp-")) {
      setUniversities(universities.filter((u) => u.id !== id));
      return;
    }

    try {
      await backendApi.delete(`/api/university-outreach/universities/${id}`);
      setUniversities(universities.filter((u) => u.id !== id));
    } catch (error: any) {
      console.error("Error deleting:", error);
      alert(`Failed to delete: ${error.message}`);
    }
  };

  const clearImage = (id: string) => {
    const university = universities.find((u) => u.id === id);
    if (university?.imagePreview) {
      URL.revokeObjectURL(university.imagePreview);
    }
    updateUniversity(id, "image", null);
    setUniversities(
      universities.map((u) =>
        u.id === id ? { ...u, imagePreview: undefined } : u
      )
    );
  };

  const addKeyFacility = (id: string) => {
    setUniversities(
      universities.map((u) =>
        u.id === id ? { ...u, keyFacilities: [...u.keyFacilities, ""] } : u
      )
    );
  };

  const updateKeyFacility = (id: string, index: number, value: string) => {
    setUniversities(
      universities.map((u) =>
        u.id === id
          ? {
              ...u,
              keyFacilities: u.keyFacilities.map((f, i) =>
                i === index ? value : f
              ),
            }
          : u
      )
    );
  };

  const removeKeyFacility = (id: string, index: number) => {
    setUniversities(
      universities.map((u) =>
        u.id === id
          ? {
              ...u,
              keyFacilities: u.keyFacilities.filter((_, i) => i !== index),
            }
          : u
      )
    );
  };

  const addAchievement = (id: string) => {
    setUniversities(
      universities.map((u) =>
        u.id === id
          ? { ...u, notableAchievements: [...u.notableAchievements, ""] }
          : u
      )
    );
  };

  const updateAchievement = (id: string, index: number, value: string) => {
    setUniversities(
      universities.map((u) =>
        u.id === id
          ? {
              ...u,
              notableAchievements: u.notableAchievements.map((a, i) =>
                i === index ? value : a
              ),
            }
          : u
      )
    );
  };

  const removeAchievement = (id: string, index: number) => {
    setUniversities(
      universities.map((u) =>
        u.id === id
          ? {
              ...u,
              notableAchievements: u.notableAchievements.filter(
                (_, i) => i !== index
              ),
            }
          : u
      )
    );
  };

  // Program Benefits UI helpers
  const addBenefit = () => {
    setBenefits([
      ...benefits,
      { title: "", description: "", icon: "Building2", order: 0 },
    ]);
  };

  const updateBenefit = (
    index: number,
    field: keyof ProgramBenefitItem,
    value: string | number
  ) => {
    const next = [...benefits];
    (next[index] as any)[field] = value;
    setBenefits(next);
  };

  const deleteBenefitLocal = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  // Timeline UI helpers
  const addTimelineItem = () => {
    setTimelines([
      ...timelines,
      { phase: "", title: "", description: "", year: "", order: 0 },
    ]);
  };

  const updateTimelineItem = (
    index: number,
    field: keyof TimelineItem,
    value: string | number
  ) => {
    const next = [...timelines];
    (next[index] as any)[field] = value;
    setTimelines(next);
  };

  const deleteTimelineLocal = (index: number) => {
    setTimelines(timelines.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div>
        <AdminHeader
          title="University STEM Outreach"
          description="Manage university partnerships and programs"
        />
        <div className="p-6 max-w-6xl">
          <div className="text-center py-8">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="University STEM Outreach"
        description="Manage university partnerships and programs"
      />
      <div className="p-6 max-w-6xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Configure the hero section with badge, title, and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge Text</Label>
                <Input
                  id="badge"
                  value={heroData.badge}
                  onChange={(e) =>
                    setHeroData({ ...heroData, badge: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={heroData.title}
                  onChange={(e) =>
                    setHeroData({ ...heroData, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={heroData.description}
                  onChange={(e) =>
                    setHeroData({ ...heroData, description: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.stopPropagation();
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Program Benefits */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Program Benefits</CardTitle>
                  <CardDescription>
                    Configure the journey benefits and icons
                  </CardDescription>
                </div>
                <Button onClick={addBenefit} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Benefit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.id || index}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-medium text-sm">
                      Benefit #{index + 1}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteBenefitLocal(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="e.g., Minimal Cost"
                        value={benefit.title}
                        onChange={(e) =>
                          updateBenefit(index, "title", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={benefit.icon}
                        onChange={(e) =>
                          updateBenefit(index, "icon", e.target.value)
                        }
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      placeholder="Describe the benefit"
                      value={benefit.description}
                      onChange={(e) =>
                        updateBenefit(index, "description", e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.stopPropagation();
                      }}
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Order</Label>
                      <Input
                        type="number"
                        min={0}
                        value={benefit.order ?? 0}
                        onChange={(e) =>
                          updateBenefit(
                            index,
                            "order",
                            parseInt(e.target.value || "0")
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              {benefits.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No program benefits added yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Journey Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Journey Timeline</CardTitle>
                  <CardDescription>
                    Define timeline phases and milestones
                  </CardDescription>
                </div>
                <Button onClick={addTimelineItem} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Timeline Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {timelines.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-medium text-sm">Item #{index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTimelineLocal(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-4">
                    <Input
                      placeholder="Phase (e.g., Pilot)"
                      value={item.phase}
                      onChange={(e) =>
                        updateTimelineItem(index, "phase", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Title"
                      value={item.title}
                      onChange={(e) =>
                        updateTimelineItem(index, "title", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Year (e.g., 2023)"
                      value={item.year}
                      onChange={(e) =>
                        updateTimelineItem(index, "year", e.target.value)
                      }
                    />
                    <Input
                      type="number"
                      min={0}
                      placeholder="Order"
                      value={item.order ?? 0}
                      onChange={(e) =>
                        updateTimelineItem(
                          index,
                          "order",
                          parseInt(e.target.value || "0")
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      rows={3}
                      placeholder="Details of the milestone"
                      value={item.description}
                      onChange={(e) =>
                        updateTimelineItem(index, "description", e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.stopPropagation();
                      }}
                    />
                  </div>
                </div>
              ))}
              {timelines.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No timeline items added yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>
                    Configure hero section statistics
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    setStats([
                      ...stats,
                      { label: "", value: "", icon: "Building2" },
                    ]);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stat
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.id || index}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-medium text-sm">Stat {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newStats = stats.filter((_, i) => i !== index);
                        setStats(newStats);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-3">
                    <Input
                      placeholder="Label (e.g., Public Universities)"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[index].label = e.target.value;
                        setStats(newStats);
                      }}
                    />
                    <Input
                      placeholder="Value (e.g., 40+)"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...stats];
                        newStats[index].value = e.target.value;
                        setStats(newStats);
                      }}
                    />
                    <div>
                      <Label className="sr-only">Icon</Label>
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={stat.icon}
                        onChange={(e) => {
                          const newStats = [...stats];
                          newStats[index].icon = e.target.value;
                          setStats(newStats);
                        }}
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {stats.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No statistics added yet. Click "Add Stat" to get started.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Universities</CardTitle>
                  <CardDescription>
                    Manage university partnerships with detailed information
                  </CardDescription>
                </div>
                <Button onClick={addUniversity} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add University
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {universities.map((university) => (
                <div
                  key={university.id}
                  className="p-4 border rounded-lg space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-lg">
                      {university.name || "New University"}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteUniversity(university.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  {/* Basic Information */}
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>University Name</Label>
                      <Input
                        placeholder="e.g., Addis Ababa University"
                        value={university.name}
                        onChange={(e) =>
                          updateUniversity(
                            university.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        placeholder="e.g., Addis Ababa"
                        value={university.location}
                        onChange={(e) =>
                          updateUniversity(
                            university.id,
                            "location",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Detailed description of the university and its STEM program"
                      rows={3}
                      value={university.description}
                      onChange={(e) =>
                        updateUniversity(
                          university.id,
                          "description",
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.stopPropagation();
                      }}
                    />
                  </div>

                  {/* Statistics */}
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Students</Label>
                      <Input
                        placeholder="e.g., 1,200+"
                        value={university.students}
                        onChange={(e) =>
                          updateUniversity(
                            university.id,
                            "students",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Programs</Label>
                      <Input
                        placeholder="e.g., Since 2022"
                        value={university.programs}
                        onChange={(e) =>
                          updateUniversity(
                            university.id,
                            "programs",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Facilities</Label>
                      <Input
                        placeholder="e.g., 4"
                        value={university.facilities}
                        onChange={(e) =>
                          updateUniversity(
                            university.id,
                            "facilities",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>University Image</Label>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm">Upload Image</span>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(university.id, file);
                              }
                            }}
                          />
                        </label>
                        {(university.image || university.imagePreview) && (
                          <div className="relative w-full h-40 rounded-lg overflow-hidden border">
                            <img
                              src={
                                university.imagePreview ||
                                (typeof university.image === "string"
                                  ? university.image
                                  : "/placeholder.svg")
                              }
                              alt={university.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => clearImage(university.id)}
                              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Establishment Year</Label>
                      <Input
                        placeholder="e.g., Est. 1950"
                        value={university.establishmentYear}
                        onChange={(e) =>
                          updateUniversity(
                            university.id,
                            "establishmentYear",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Key Facilities */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Key Facilities
                      </Label>
                      <Button
                        onClick={() => addKeyFacility(university.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Facility
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {university.keyFacilities.map((facility, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="e.g., Advanced Physics Labs"
                            value={facility}
                            onChange={(e) =>
                              updateKeyFacility(
                                university.id,
                                index,
                                e.target.value
                              )
                            }
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              removeKeyFacility(university.id, index)
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notable Achievements */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Notable Achievements
                      </Label>
                      <Button
                        onClick={() => addAchievement(university.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Achievement
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {university.notableAchievements.map(
                        (achievement, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="e.g., First university to pilot the program"
                              value={achievement}
                              onChange={(e) =>
                                updateAchievement(
                                  university.id,
                                  index,
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeAchievement(university.id, index)
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
