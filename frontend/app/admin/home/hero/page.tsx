"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  ImageIcon,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { backendApi } from "@/lib/backend-api";

interface HeroSlide {
  id: string;
  image: string;
  imageFile?: File | null;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  ctaSecondary: string;
  stat1Label: string;
  stat1Value: string;
  stat2Label: string;
  stat2Value: string;
  stat3Label: string;
  stat3Value: string;
}

type BackendHero = {
  id?: string;
  _id?: string;
  title?: string;
  subtitle?: string;
  image_url?: string;
  image?: string;
  media_url?: string;
  description?: string;
  cta?: string;
  ctaSecondary?: string;
  stat1Label?: string;
  stat1Value?: string;
  stat2Label?: string;
  stat2Value?: string;
  stat3Label?: string;
  stat3Value?: string;
  isActive?: boolean;
};

export default function HeroSectionPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load slides from API on mount
  useEffect(() => {
    const normalizeHero = (
      hero: BackendHero,
      index: number,
      fallback?: HeroSlide
    ): HeroSlide => {
      return {
        id:
          hero.id?.toString() ||
          hero._id?.toString() ||
          fallback?.id ||
          `slide-${Date.now()}-${index}`,
        image:
          hero.image_url ||
          hero.image ||
          hero.media_url ||
          fallback?.image ||
          "",
        title: hero.title || fallback?.title || "",
        subtitle: hero.subtitle || fallback?.subtitle || "",
        description: hero.description || fallback?.description || "",
        cta: hero.cta || fallback?.cta || "",
        ctaSecondary: hero.ctaSecondary || fallback?.ctaSecondary || "",
        stat1Label: hero.stat1Label || fallback?.stat1Label || "",
        stat1Value: hero.stat1Value || fallback?.stat1Value || "",
        stat2Label: hero.stat2Label || fallback?.stat2Label || "",
        stat2Value: hero.stat2Value || fallback?.stat2Value || "",
        stat3Label: hero.stat3Label || fallback?.stat3Label || "",
        stat3Value: hero.stat3Value || fallback?.stat3Value || "",
      };
    };

    const loadSlides = async () => {
      try {
        const response = await backendApi.get("/api/heroes");
        const rawHeroes: BackendHero[] = Array.isArray(response)
          ? response
          : response?.data || [];
        const slidesArray = rawHeroes.map((hero, index) =>
          normalizeHero(hero, index)
        );
        setSlides(slidesArray);
      } catch (error) {
        console.error("Failed to load hero slides:", error);
        setSlides([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadSlides();
  }, []);

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now().toString(),
      image: "",
      imageFile: null,
      title: "",
      subtitle: "",
      description: "",
      cta: "",
      ctaSecondary: "",
      stat1Label: "",
      stat1Value: "",
      stat2Label: "",
      stat2Value: "",
      stat3Label: "",
      stat3Value: "",
    };
    setEditingSlide(newSlide);
    setIsDialogOpen(true);
  };

  const editSlide = (slide: HeroSlide) => {
    setEditingSlide({ ...slide });
    setIsDialogOpen(true);
  };

  const saveSlide = async () => {
    if (!editingSlide) return;
    setIsSaving(true);
    try {
      const isNew = !slides.find((s) => s.id === editingSlide.id);

      const normalizeHero = (
        hero: BackendHero,
        fallback?: HeroSlide
      ): HeroSlide => {
        return {
          id:
            hero.id?.toString() ||
            hero._id?.toString() ||
            fallback?.id ||
            Date.now().toString(),
          image:
            hero.image_url ||
            hero.image ||
            hero.media_url ||
            fallback?.image ||
            "",
          title: hero.title || fallback?.title || "",
          subtitle: hero.subtitle || fallback?.subtitle || "",
          description: hero.description || fallback?.description || "",
          cta: hero.cta || fallback?.cta || "",
          ctaSecondary: hero.ctaSecondary || fallback?.ctaSecondary || "",
          stat1Label: hero.stat1Label || fallback?.stat1Label || "",
          stat1Value: hero.stat1Value || fallback?.stat1Value || "",
          stat2Label: hero.stat2Label || fallback?.stat2Label || "",
          stat2Value: hero.stat2Value || fallback?.stat2Value || "",
          stat3Label: hero.stat3Label || fallback?.stat3Label || "",
          stat3Value: hero.stat3Value || fallback?.stat3Value || "",
        };
      };

      const formData = new FormData();
      formData.append("title", editingSlide.title);
      formData.append("subtitle", editingSlide.subtitle);
      formData.append("description", editingSlide.description);
      formData.append("cta", editingSlide.cta);
      formData.append("ctaSecondary", editingSlide.ctaSecondary);
      formData.append("stat1Label", editingSlide.stat1Label);
      formData.append("stat1Value", editingSlide.stat1Value);
      formData.append("stat2Label", editingSlide.stat2Label);
      formData.append("stat2Value", editingSlide.stat2Value);
      formData.append("stat3Label", editingSlide.stat3Label);
      formData.append("stat3Value", editingSlide.stat3Value);
      formData.append("isActive", "true");
      if (editingSlide.imageFile) {
        formData.append("file", editingSlide.imageFile);
      }

      if (isNew && !editingSlide.imageFile) {
        alert("Please upload an image for the new slide.");
        setIsSaving(false);
        return;
      }

      const heroResponse = isNew
        ? await backendApi.postFormData("/api/heroes", formData)
        : await backendApi.putFormData(
            `/api/heroes/${editingSlide.id}`,
            formData
          );

      const normalized = normalizeHero(heroResponse, editingSlide);
      setSlides(
        isNew
          ? [...slides, normalized]
          : slides.map((s) => (s.id === editingSlide.id ? normalized : s))
      );
      setIsDialogOpen(false);
      setEditingSlide(null);
    } catch (error) {
      console.error("Failed to save slide:", error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Failed to save slide. Please try again.";
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSlide = async (id: string) => {
    if (!confirm("Are you sure you want to delete this slide?")) return;
    try {
      await backendApi.delete(`/api/heroes/${id}`);
      setSlides(slides.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete slide:", error);
      alert("Failed to delete slide");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingSlide) {
      const previewUrl = URL.createObjectURL(file);
      setEditingSlide({
        ...editingSlide,
        image: previewUrl,
        imageFile: file,
      });
    }
  };

  return (
    <div>
      <AdminHeader
        title="Hero Section"
        description="Manage homepage hero carousel slides"
      />
      <div className="p-6 max-w-6xl">
        <Link href="/admin/home">
          <Button variant="outline" size="sm" className="mb-6 bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Create and manage hero carousel slides with images, titles, and CTAs
          </p>
          <Button
            onClick={addSlide}
            className="bg-[#00BFA6] hover:bg-[#00A693]"
            disabled={isLoading}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Slide
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-6">
            {slides.map((slide, index) => (
              <Card key={slide.id || `slide-${index}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Slide {index + 1}</CardTitle>
                      <CardDescription>
                        {slide.title || "Untitled Slide"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editSlide(slide)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSlide(slide.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      {slide.image ? (
                        <img
                          src={slide.image || "/placeholder.svg"}
                          alt={slide.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Subtitle</p>
                        <p className="text-sm text-muted-foreground">
                          {slide.subtitle || "No subtitle"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Description</p>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {slide.description || "No description"}
                        </p>
                      </div>
                      <div className="flex gap-4 pt-2">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Primary CTA
                          </p>
                          <p className="text-sm font-medium">
                            {slide.cta || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Secondary CTA
                          </p>
                          <p className="text-sm font-medium">
                            {slide.ctaSecondary || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSlide?.title || "New Slide"}</DialogTitle>
              <DialogDescription>
                Configure hero slide content and appearance
              </DialogDescription>
            </DialogHeader>
            {editingSlide && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Hero Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {editingSlide.image && (
                    <img
                      src={editingSlide.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Main Title</Label>
                    <Input
                      id="title"
                      value={editingSlide.title}
                      onChange={(e) =>
                        setEditingSlide({
                          ...editingSlide,
                          title: e.target.value,
                        })
                      }
                      placeholder="Inside Every Child is a Scientist"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle/Badge Text</Label>
                    <Input
                      id="subtitle"
                      value={editingSlide.subtitle}
                      onChange={(e) =>
                        setEditingSlide({
                          ...editingSlide,
                          subtitle: e.target.value,
                        })
                      }
                      placeholder="Nurture that Scientist..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={editingSlide.description}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter slide description..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta">Primary CTA Text</Label>
                    <Input
                      id="cta"
                      value={editingSlide.cta}
                      onChange={(e) =>
                        setEditingSlide({
                          ...editingSlide,
                          cta: e.target.value,
                        })
                      }
                      placeholder="Explore Our Programs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaSecondary">Secondary CTA Text</Label>
                    <Input
                      id="ctaSecondary"
                      value={editingSlide.ctaSecondary}
                      onChange={(e) =>
                        setEditingSlide({
                          ...editingSlide,
                          ctaSecondary: e.target.value,
                        })
                      }
                      placeholder="Watch Our Story"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-base mb-3 block">
                    Statistics (3 stats displayed)
                  </Label>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stat1Value">Stat 1 Value</Label>
                      <Input
                        id="stat1Value"
                        value={editingSlide.stat1Value}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            stat1Value: e.target.value,
                          })
                        }
                        placeholder="61+"
                      />
                      <Label htmlFor="stat1Label">Stat 1 Label</Label>
                      <Input
                        id="stat1Label"
                        value={editingSlide.stat1Label}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            stat1Label: e.target.value,
                          })
                        }
                        placeholder="centers"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stat2Value">Stat 2 Value</Label>
                      <Input
                        id="stat2Value"
                        value={editingSlide.stat2Value}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            stat2Value: e.target.value,
                          })
                        }
                        placeholder="100K+"
                      />
                      <Label htmlFor="stat2Label">Stat 2 Label</Label>
                      <Input
                        id="stat2Label"
                        value={editingSlide.stat2Label}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            stat2Label: e.target.value,
                          })
                        }
                        placeholder="students"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stat3Value">Stat 3 Value</Label>
                      <Input
                        id="stat3Value"
                        value={editingSlide.stat3Value}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            stat3Value: e.target.value,
                          })
                        }
                        placeholder="11+"
                      />
                      <Label htmlFor="stat3Label">Stat 3 Label</Label>
                      <Input
                        id="stat3Label"
                        value={editingSlide.stat3Label}
                        onChange={(e) =>
                          setEditingSlide({
                            ...editingSlide,
                            stat3Label: e.target.value,
                          })
                        }
                        placeholder="regions"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveSlide}
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                    disabled={isSaving}
                  >
                    {isSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    Save Slide
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
