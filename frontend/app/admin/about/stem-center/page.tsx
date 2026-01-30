"use client";

import type React from "react";
import { AdminHeader } from "@/components/ui/admin-header";
import { BackButton } from "@/components/ui/back-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Target,
  MessageSquare,
  Plus,
  Trash2,
  Upload,
  Save,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface Value {
  id: string;
  title: string;
  description: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  message: string;
  image: string | File | null;
  imagePreview?: string;
}

export default function StemCenterPage() {
  // Hero Section State
  const [heroData, setHeroData] = useState<{
    badge: string;
    title: string;
    description: string;
    image: string | File | null;
    imagePreview?: string;
    statistic: string;
  }>({
    badge: "",
    title: "",
    description: "",
    image: null,
    statistic: "",
  });

  const [whoWeAre, setWhoWeAre] = useState<{
    badge: string;
    title: string;
    description: string;
    image: string | File | null;
    imagePreview?: string;
  }>({
    badge: "",
    title: "",
    description: "",
    image: null,
  });

  // Mission & Vision State
  const [missionVision, setMissionVision] = useState<{
    mission: string;
    vision: string;
    values: Value[];
  }>({
    mission: "",
    vision: "",
    values: [],
  });

  // Testimonials State
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const heroImageRef = useRef<HTMLInputElement>(null);
  const whoWeAreImageRef = useRef<HTMLInputElement>(null);
  const testimonialImageRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load stem center data
        const stemCenterResponse = await fetch("/api/about/stem-centers");
        const stemCenterData = await stemCenterResponse.json();
        console.log("[v0] Loaded stem centers:", stemCenterData);

        if (stemCenterData.length > 0) {
          const firstItem = stemCenterData[0];
          setHeroData({
            badge: firstItem.badge || "",
            title: firstItem.title || "",
            description: firstItem.description || "",
            image: firstItem.image || null,
            statistic: firstItem.statistic || "",
          });
          setWhoWeAre({
            badge: firstItem.whoWeAre?.badge || "",
            title: firstItem.whoWeAre?.title || "",
            description: firstItem.whoWeAre?.description || "",
            image: firstItem.whoWeAre?.image || null,
          });
          setMissionVision({
            mission: firstItem.mission || "",
            vision: firstItem.vision || "",
            values: Array.isArray(firstItem.values) ? firstItem.values : [],
          });
        }

        // Load testimonials separately
        const testimonialsResponse = await fetch("/api/about/testimonials");
        const testimonialsData = await testimonialsResponse.json();
        console.log("[v0] Loaded testimonials:", testimonialsData);

        setTestimonials(
          Array.isArray(testimonialsData)
            ? testimonialsData.map((t: any) => ({
                id: t.id?.toString() || crypto.randomUUID(),
                name: t.name || "",
                role: t.role || "",
                message: t.message || "",
                image: t.image || null,
              }))
            : []
        );
      } catch (err) {
        console.error("[v0] Error loading data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addValue = () => {
    setMissionVision({
      ...missionVision,
      values: [
        ...missionVision.values,
        { id: crypto.randomUUID(), title: "", description: "" },
      ],
    });
  };

  const removeValue = (id: string) => {
    setMissionVision({
      ...missionVision,
      values: missionVision.values.filter((v) => v.id !== id),
    });
  };

  const addTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        id: crypto.randomUUID(),
        name: "",
        role: "",
        message: "",
        image: null,
      },
    ]);
  };

  const removeTestimonial = async (id: string) => {
    // Check if this is an existing testimonial (has numeric ID from backend)
    const testimonial = testimonials.find((t) => t.id === id);
    if (testimonial && !isNaN(Number(id))) {
      try {
        const response = await fetch(`/api/about/testimonials/${id}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          throw new Error("Failed to delete testimonial");
        }
      } catch (err) {
        console.error("Error deleting testimonial:", err);
        alert("Failed to delete testimonial. Please try again.");
        return;
      }
    }
    setTestimonials(testimonials.filter((t) => t.id !== id));
  };

  const saveTestimonials = async () => {
    try {
      // Only save NEW testimonials (ones with UUID or no ID)
      // Don't update existing testimonials unless explicitly needed
      for (const testimonial of testimonials) {
        // Skip empty testimonials (new ones that haven't been filled out)
        if (!testimonial.name && !testimonial.role && !testimonial.message) {
          continue;
        }

        // Check if testimonial ID is a UUID (new) or numeric (existing)
        // UUIDs contain hyphens, numeric IDs don't
        const testimonialIdStr = String(testimonial.id || "");
        const isNewTestimonial =
          !testimonial.id ||
          testimonialIdStr.includes("-") ||
          isNaN(Number(testimonialIdStr));

        // Only process NEW testimonials - skip existing ones
        if (!isNewTestimonial) {
          console.log(
            `Skipping existing testimonial: ${testimonial.name} (ID: ${testimonial.id})`
          );
          continue;
        }

        const formData = new FormData();
        formData.append("name", testimonial.name);
        formData.append("role", testimonial.role);
        formData.append("message", testimonial.message);

        if (testimonial.image instanceof File) {
          formData.append("file", testimonial.image);
        } else if (testimonial.image) {
          formData.append("image", testimonial.image);
        }

        // Create new testimonial (has UUID or no ID)
        const response = await fetch("/api/about/testimonials", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            `Failed to create testimonial: ${testimonial.name}. ${
              errorData.error || ""
            }`
          );
        }
        const created = await response.json();
        // Update local state with new ID and image URL
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === testimonial.id
              ? {
                  ...t,
                  id: created.id.toString(),
                  image: created.image || null,
                  imagePreview: undefined,
                }
              : t
          )
        );
      }
    } catch (err: any) {
      console.error("Error saving testimonials:", err);
      throw new Error(err.message || "Failed to save testimonials");
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous preview URL if it exists
      if (heroData.imagePreview && heroData.image instanceof File) {
        URL.revokeObjectURL(heroData.imagePreview);
      }
      // Create preview URL and store File object
      const previewUrl = URL.createObjectURL(file);
      setHeroData({ ...heroData, image: file, imagePreview: previewUrl });
    }
  };

  const handleWhoWeAreImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous preview URL if it exists
      if (whoWeAre.imagePreview && whoWeAre.image instanceof File) {
        URL.revokeObjectURL(whoWeAre.imagePreview);
      }
      // Create preview URL and store File object
      const previewUrl = URL.createObjectURL(file);
      setWhoWeAre({ ...whoWeAre, image: file, imagePreview: previewUrl });
    }
  };

  const handleTestimonialImageUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous preview URL if it exists
      const existingTestimonial = testimonials.find((t) => t.id === id);
      if (
        existingTestimonial?.imagePreview &&
        existingTestimonial.image instanceof File
      ) {
        URL.revokeObjectURL(existingTestimonial.imagePreview);
      }
      // Create preview URL and store File object
      const previewUrl = URL.createObjectURL(file);
      const newTestimonials = testimonials.map((t) =>
        t.id === id ? { ...t, image: file, imagePreview: previewUrl } : t
      );
      setTestimonials(newTestimonials);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (heroData.imagePreview && heroData.image instanceof File) {
        URL.revokeObjectURL(heroData.imagePreview);
      }
      if (whoWeAre.imagePreview && whoWeAre.image instanceof File) {
        URL.revokeObjectURL(whoWeAre.imagePreview);
      }
      testimonials.forEach((t) => {
        if (t.imagePreview && t.image instanceof File) {
          URL.revokeObjectURL(t.imagePreview);
        }
      });
    };
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");

      // Check if we have file uploads
      const hasFileUploads =
        heroData.image instanceof File ||
        whoWeAre.image instanceof File ||
        testimonials.some((t) => t.image instanceof File);

      if (hasFileUploads) {
        // Use FormData for file uploads
        const formData = new FormData();

        // Append hero data
        formData.append("badge", heroData.badge);
        formData.append("title", heroData.title);
        formData.append("description", heroData.description);
        formData.append("statistic", heroData.statistic);
        if (heroData.image instanceof File) {
          formData.append("heroImage", heroData.image);
        } else if (heroData.image) {
          formData.append("image", heroData.image);
        }

        // Append whoWeAre data
        formData.append("whoWeAreBadge", whoWeAre.badge);
        formData.append("whoWeAreTitle", whoWeAre.title);
        formData.append("whoWeAreDescription", whoWeAre.description);
        if (whoWeAre.image instanceof File) {
          formData.append("whoWeAreImage", whoWeAre.image);
        } else if (whoWeAre.image) {
          formData.append("whoWeAreImageUrl", whoWeAre.image);
        }

        // Append mission & vision
        formData.append("mission", missionVision.mission);
        formData.append("vision", missionVision.vision);
        formData.append("values", JSON.stringify(missionVision.values));

        // Save stem center data (without testimonials)
        const response = await fetch("/api/about/stem-centers", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to save");
        }

        const saved = await response.json();

        // Update local state with saved data
        if (saved.image) {
          setHeroData((prev) => ({
            ...prev,
            image: saved.image,
            imagePreview: undefined,
          }));
        }
        if (saved.whoWeAre?.image) {
          setWhoWeAre((prev) => ({
            ...prev,
            image: saved.whoWeAre.image,
            imagePreview: undefined,
          }));
        }

        // Save testimonials separately
        await saveTestimonials();

        // Clean up preview URLs
        if (heroData.imagePreview) URL.revokeObjectURL(heroData.imagePreview);
        if (whoWeAre.imagePreview) URL.revokeObjectURL(whoWeAre.imagePreview);
        testimonials.forEach((t) => {
          if (t.imagePreview) URL.revokeObjectURL(t.imagePreview);
        });

        alert("STEM Center content saved successfully!");
      } else {
        // Use JSON for non-file updates
        const payload = {
          badge: heroData.badge,
          title: heroData.title,
          description: heroData.description,
          image: heroData.image || null,
          statistic: heroData.statistic,
          mission: missionVision.mission,
          vision: missionVision.vision,
          values: missionVision.values,
          whoWeAre: {
            badge: whoWeAre.badge,
            title: whoWeAre.title,
            description: whoWeAre.description,
            image: whoWeAre.image || null,
          },
        };

        const response = await fetch("/api/about/stem-centers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to save");
        }

        // Save testimonials separately
        await saveTestimonials();

        alert("STEM Center content saved successfully!");
      }
    } catch (err: any) {
      console.error("[v0] Error saving data:", err);
      setError(err.message || "Failed to save data");
      alert(err.message || "Error saving data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && heroData.badge === "")
    return <div className="p-6">Loading...</div>;

  return (
    <div>
      <AdminHeader
        title="About STEM Center Management"
        description="Manage hero section, vision, mission, values, and testimonials"
      />

      <div className="p-6 max-w-7xl">
        <BackButton />

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end mb-6">
          <Button
            onClick={handleSave}
            size="lg"
            className="bg-[#00BFA6] hover:bg-[#00A693]"
            disabled={loading}
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="hero" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="who-we-are" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Who We Are
            </TabsTrigger>
            <TabsTrigger value="mission" className="gap-2">
              <Target className="h-4 w-4" />
              Mission & Vision
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Testimonials
            </TabsTrigger>
          </TabsList>

          {/* Hero Section Tab */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#00BFA6]" />
                  Hero Section
                </CardTitle>
                <CardDescription>
                  Manage the main hero banner for the About STEM Center page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="hero-badge">Badge Text</Label>
                      <Input
                        id="hero-badge"
                        value={heroData.badge}
                        onChange={(e) =>
                          setHeroData({ ...heroData, badge: e.target.value })
                        }
                        placeholder="Who We Are"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hero-title">Main Title</Label>
                      <Input
                        id="hero-title"
                        value={heroData.title}
                        onChange={(e) =>
                          setHeroData({ ...heroData, title: e.target.value })
                        }
                        placeholder="Inside Every Child is a Scientist"
                      />
                    </div>

                    <div>
                      <Label htmlFor="hero-description">Description</Label>
                      <Textarea
                        id="hero-description"
                        value={heroData.description}
                        onChange={(e) =>
                          setHeroData({
                            ...heroData,
                            description: e.target.value,
                          })
                        }
                        rows={4}
                        placeholder="Describe your STEM center..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="hero-stat">Statistical Value</Label>
                      <Input
                        id="hero-stat"
                        value={heroData.statistic}
                        onChange={(e) =>
                          setHeroData({
                            ...heroData,
                            statistic: e.target.value,
                          })
                        }
                        placeholder="5+ Years of Impact"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Hero Image</Label>
                      <input
                        ref={heroImageRef}
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => heroImageRef.current?.click()}
                        className="mt-2 border-2 border-dashed rounded-lg p-4 text-center hover:border-[#00BFA6] transition-colors cursor-pointer"
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                      {(heroData.image || heroData.imagePreview) && (
                        <div className="mt-4 relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={
                              heroData.imagePreview ||
                              (heroData.image as string) ||
                              "/placeholder.svg"
                            }
                            alt="Hero"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="who-we-are" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#00BFA6]" />
                  Who We Are Section
                </CardTitle>
                <CardDescription>
                  Manage the "Who We Are" section with badge, title,
                  description, and image
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="who-we-are-badge">Badge Text</Label>
                      <Input
                        id="who-we-are-badge"
                        value={whoWeAre.badge}
                        onChange={(e) =>
                          setWhoWeAre({ ...whoWeAre, badge: e.target.value })
                        }
                        placeholder="Our Story"
                      />
                    </div>

                    <div>
                      <Label htmlFor="who-we-are-title">Title</Label>
                      <Input
                        id="who-we-are-title"
                        value={whoWeAre.title}
                        onChange={(e) =>
                          setWhoWeAre({ ...whoWeAre, title: e.target.value })
                        }
                        placeholder="Who We Are"
                      />
                    </div>

                    <div>
                      <Label htmlFor="who-we-are-description">
                        Description
                      </Label>
                      <Textarea
                        id="who-we-are-description"
                        value={whoWeAre.description}
                        onChange={(e) =>
                          setWhoWeAre({
                            ...whoWeAre,
                            description: e.target.value,
                          })
                        }
                        rows={6}
                        placeholder="STEMpower is a nonprofit that established a Sub-Saharan African family of 61 hands-on STEM Centers..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.stopPropagation();
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Section Image</Label>
                      <input
                        ref={whoWeAreImageRef}
                        type="file"
                        accept="image/*"
                        onChange={handleWhoWeAreImageUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => whoWeAreImageRef.current?.click()}
                        className="mt-2 border-2 border-dashed rounded-lg p-4 text-center hover:border-[#00BFA6] transition-colors cursor-pointer"
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                      {(whoWeAre.image || whoWeAre.imagePreview) && (
                        <div className="mt-4 relative h-48 rounded-lg overflow-hidden">
                          <Image
                            src={
                              whoWeAre.imagePreview ||
                              (whoWeAre.image as string) ||
                              "/placeholder.svg"
                            }
                            alt="Who We Are"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mission & Vision Tab */}
          <TabsContent value="mission" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#00BFA6]" />
                  Mission, Vision & Core Values
                </CardTitle>
                <CardDescription>
                  Define your organization's purpose and guiding principles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    value={missionVision.mission}
                    onChange={(e) =>
                      setMissionVision({
                        ...missionVision,
                        mission: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Our mission is to..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.stopPropagation();
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="vision">Vision Statement</Label>
                  <Textarea
                    id="vision"
                    value={missionVision.vision}
                    onChange={(e) =>
                      setMissionVision({
                        ...missionVision,
                        vision: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="We envision a future where..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.stopPropagation();
                    }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Core Values</Label>
                    <Button onClick={addValue} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Value
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {missionVision.values.map((value) => (
                      <Card key={value.id}>
                        <CardContent className="pt-6">
                          <div className="flex gap-4">
                            <div className="flex-1 space-y-4">
                              <Input
                                value={value.title}
                                onChange={(e) => {
                                  const newValues = missionVision.values.map(
                                    (v) =>
                                      v.id === value.id
                                        ? { ...v, title: e.target.value }
                                        : v
                                  );
                                  setMissionVision({
                                    ...missionVision,
                                    values: newValues,
                                  });
                                }}
                                placeholder="Value title (e.g., Excellence)"
                              />
                              <Textarea
                                value={value.description}
                                onChange={(e) => {
                                  const newValues = missionVision.values.map(
                                    (v) =>
                                      v.id === value.id
                                        ? { ...v, description: e.target.value }
                                        : v
                                  );
                                  setMissionVision({
                                    ...missionVision,
                                    values: newValues,
                                  });
                                }}
                                rows={2}
                                placeholder="Value description"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") e.stopPropagation();
                                }}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeValue(value.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-[#00BFA6]" />
                      Testimonials
                    </CardTitle>
                    <CardDescription>
                      Add and manage testimonials from students, teachers, and
                      partners
                    </CardDescription>
                  </div>
                  <Button onClick={addTestimonial} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Testimonial
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="shrink-0">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 relative">
                            <Image
                              src={
                                testimonial.imagePreview ||
                                (testimonial.image instanceof File
                                  ? ""
                                  : (testimonial.image as string)) ||
                                "/placeholder.svg"
                              }
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <input
                            ref={(el) => {
                              testimonialImageRefs.current[testimonial.id] = el;
                            }}
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleTestimonialImageUpload(testimonial.id, e)
                            }
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-20 mt-2 bg-transparent text-xs"
                            onClick={() =>
                              testimonialImageRefs.current[
                                testimonial.id
                              ]?.click()
                            }
                          >
                            <Upload className="h-3 w-3 mr-1" />
                            Upload
                          </Button>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label>Name</Label>
                              <Input
                                value={testimonial.name}
                                onChange={(e) => {
                                  const newTestimonials = testimonials.map(
                                    (t) =>
                                      t.id === testimonial.id
                                        ? { ...t, name: e.target.value }
                                        : t
                                  );
                                  setTestimonials(newTestimonials);
                                }}
                                placeholder="Full name"
                              />
                            </div>
                            <div>
                              <Label>Role/Title</Label>
                              <Input
                                value={testimonial.role}
                                onChange={(e) => {
                                  const newTestimonials = testimonials.map(
                                    (t) =>
                                      t.id === testimonial.id
                                        ? { ...t, role: e.target.value }
                                        : t
                                  );
                                  setTestimonials(newTestimonials);
                                }}
                                placeholder="Student, Teacher, etc."
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Testimonial Message</Label>
                            <Textarea
                              value={testimonial.message}
                              onChange={(e) => {
                                const newTestimonials = testimonials.map((t) =>
                                  t.id === testimonial.id
                                    ? { ...t, message: e.target.value }
                                    : t
                                );
                                setTestimonials(newTestimonials);
                              }}
                              rows={3}
                              placeholder="What do they say about STEMpower?"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") e.stopPropagation();
                              }}
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTestimonial(testimonial.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
