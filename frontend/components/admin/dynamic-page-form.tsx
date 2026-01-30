"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, Trash2, Upload, X } from "lucide-react";

export interface ContentSection {
  id: string;
  type: "text" | "image" | "cards" | "stats";
  title?: string;
  content?: string;
  imageUrl?: string;
  items?: Array<{ title: string; description: string; icon?: string }>;
}

export interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  ctaText: string;
  ctaLink: string;
  sections: ContentSection[];
  status: "draft" | "published";
  createdAt: string;
  program?: string | null;
}

interface PageEditorFormProps {
  page: DynamicPage;
  onSave: (page: DynamicPage) => void;
  onCancel: () => void;
  saving?: boolean;
  programLabel?: string;
}

const normalizeSections = (sections: any): ContentSection[] => {
  if (Array.isArray(sections)) return sections;
  if (typeof sections === "string") {
    try {
      const parsed = JSON.parse(sections);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Failed to parse sections", err);
      return [];
    }
  }
  return [];
};

export function PageEditorForm({
  page,
  onSave,
  onCancel,
  saving = false,
  programLabel,
}: PageEditorFormProps) {
  const [formData, setFormData] = useState<DynamicPage>({
    ...page,
    sections: normalizeSections(page.sections),
  });
  const [heroImagePreview, setHeroImagePreview] = useState<string | undefined>();
  const [sectionImagePreviews, setSectionImagePreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      ...page,
      sections: normalizeSections(page.sections),
    });
  }, [page]);

  const addSection = (type: ContentSection["type"]) => {
    const currentSections = formData.sections || [];
    const newSection: ContentSection = {
      id: Date.now().toString(),
      type,
      title: "",
      content: "",
      items:
        type === "cards" || type === "stats"
          ? [{ title: "", description: "" }]
          : undefined,
    };
    setFormData({ ...formData, sections: [...currentSections, newSection] });
  };

  const updateSection = (id: string, updates: Partial<ContentSection>) => {
    setFormData({
      ...formData,
      sections: formData.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    });
  };

  const removeSection = (id: string) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((s) => s.id !== id),
    });
  };

  const updateSectionItems = (
    id: string,
    updater: (
      items: NonNullable<ContentSection["items"]>
    ) => NonNullable<ContentSection["items"]>
  ) => {
    setFormData({
      ...formData,
      sections: formData.sections.map((s) => {
        if (s.id !== id) return s;
        const items = s.items || [];
        return { ...s, items: updater(items) };
      }),
    });
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setHeroImagePreview(previewUrl);
      setFormData({ ...formData, heroImage: previewUrl });
    }
    if (e.target.value) {
      e.target.value = "";
    }
  };

  const clearHeroImage = () => {
    if (heroImagePreview) {
      URL.revokeObjectURL(heroImagePreview);
    }
    setHeroImagePreview(undefined);
    setFormData({ ...formData, heroImage: "" });
  };

  const handleSectionImageUpload = (sectionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setSectionImagePreviews(prev => ({ ...prev, [sectionId]: previewUrl }));
      updateSection(sectionId, { imageUrl: previewUrl });
    }
    if (e.target.value) {
      e.target.value = "";
    }
  };

  const clearSectionImage = (sectionId: string) => {
    if (sectionImagePreviews[sectionId]) {
      URL.revokeObjectURL(sectionImagePreviews[sectionId]);
    }
    setSectionImagePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[sectionId];
      return newPreviews;
    });
    updateSection(sectionId, { imageUrl: "" });
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Basic Information</h3>
          {(formData.program || programLabel) && (
            <Badge variant="outline" className="uppercase tracking-wide">
              Program: {programLabel || formData.program}
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Research & Innovation"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => {
                // Normalize slug: remove slashes, spaces, and convert to lowercase
                let value = e.target.value
                  .replace(/^\/+|\/+$/g, "") // Remove leading/trailing slashes
                  .replace(/\//g, "-") // Replace any slashes with hyphens
                  .replace(/\s+/g, "-") // Replace spaces with hyphens
                  .toLowerCase();
                // Remove "programs/" prefix if user accidentally includes it
                if (value.startsWith("programs/") || value.startsWith("programs-")) {
                  value = value.replace(/^programs[\/-]/, "");
                }
                setFormData({ ...formData, slug: value });
              }}
              placeholder="research-innovation"
            />
            <p className="text-xs text-muted-foreground">
              Only use lowercase letters, numbers, and hyphens. The full URL will be: /programs/{programLabel?.toLowerCase() || program}/{formData.slug || "your-slug"}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Meta Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={2}
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="space-y-4 border-t pt-4">
        <h3 className="font-semibold text-lg">Hero Section</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroImage">Hero Image</Label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload Image</span>
                </div>
                <input
                  id="heroImage"
                  type="file"
                  accept="image/*"
                  onChange={handleHeroImageUpload}
                  className="hidden"
                />
              </label>
              {(formData.heroImage || heroImagePreview) && (
                <div className="relative w-full rounded-lg overflow-hidden border">
                  <img
                    src={heroImagePreview || formData.heroImage || "/placeholder.svg"}
                    alt="Hero preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="flex justify-end p-2 bg-muted/50 border-t">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearHeroImage}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={formData.heroTitle}
                onChange={(e) =>
                  setFormData({ ...formData, heroTitle: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={formData.heroSubtitle}
                onChange={(e) =>
                  setFormData({ ...formData, heroSubtitle: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroDescription">Hero Description</Label>
            <Textarea
              id="heroDescription"
              value={formData.heroDescription}
              onChange={(e) =>
                setFormData({ ...formData, heroDescription: e.target.value })
              }
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">CTA Button Text</Label>
              <Input
                id="ctaText"
                value={formData.ctaText}
                onChange={(e) =>
                  setFormData({ ...formData, ctaText: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctaLink">CTA Button Link</Label>
              <Input
                id="ctaLink"
                value={formData.ctaLink}
                onChange={(e) =>
                  setFormData({ ...formData, ctaLink: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Content Sections</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSection("text")}
            >
              <Plus className="h-3 w-3 mr-1" />
              Text
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSection("image")}
            >
              <Plus className="h-3 w-3 mr-1" />
              Image
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSection("cards")}
            >
              <Plus className="h-3 w-3 mr-1" />
              Cards
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSection("stats")}
            >
              <Plus className="h-3 w-3 mr-1" />
              Stats
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {formData.sections.map((section) => (
            <div key={section.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge>{section.type}</Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(section.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              {section.type === "text" && (
                <div className="space-y-2">
                  <Input
                    placeholder="Section Title"
                    value={section.title || ""}
                    onChange={(e) =>
                      updateSection(section.id, { title: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Content"
                    value={section.content || ""}
                    onChange={(e) =>
                      updateSection(section.id, { content: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              )}
              {section.type === "image" && (
                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span className="text-sm">Upload Image</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSectionImageUpload(section.id, e)}
                        className="hidden"
                      />
                    </label>
                    {(section.imageUrl || sectionImagePreviews[section.id]) && (
                      <div className="relative w-full rounded-lg overflow-hidden border">
                        <img
                          src={sectionImagePreviews[section.id] || section.imageUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <div className="flex justify-end p-2 bg-muted/50 border-t">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => clearSectionImage(section.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Input
                    placeholder="Image Caption (optional)"
                    value={section.title || ""}
                    onChange={(e) =>
                      updateSection(section.id, { title: e.target.value })
                    }
                  />
                </div>
              )}
              {(section.type === "cards" || section.type === "stats") && (
                <div className="space-y-3">
                  <Input
                    placeholder="Section Title"
                    value={section.title || ""}
                    onChange={(e) =>
                      updateSection(section.id, { title: e.target.value })
                    }
                  />
                  <Textarea
                    placeholder="Optional section description"
                    value={section.content || ""}
                    onChange={(e) =>
                      updateSection(section.id, { content: e.target.value })
                    }
                    rows={2}
                  />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Items ({section.items?.length || 0})
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateSectionItems(section.id, (items) => [
                            ...items,
                            { title: "", description: "" },
                          ])
                        }
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add item
                      </Button>
                    </div>

                    {(section.items || []).map((item, idx) => (
                      <div
                        key={`${section.id}-item-${idx}`}
                        className="rounded-md border border-gray-200 p-3 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-gray-500">
                            Item {idx + 1}
                          </span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              updateSectionItems(section.id, (items) =>
                                items.filter((_, i) => i !== idx)
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Item title"
                          value={item.title || ""}
                          onChange={(e) =>
                            updateSectionItems(section.id, (items) =>
                              items.map((it, i) =>
                                i === idx
                                  ? { ...it, title: e.target.value }
                                  : it
                              )
                            )
                          }
                        />
                        <Textarea
                          placeholder="Item description"
                          value={item.description || ""}
                          onChange={(e) =>
                            updateSectionItems(section.id, (items) =>
                              items.map((it, i) =>
                                i === idx
                                  ? { ...it, description: e.target.value }
                                  : it
                              )
                            )
                          }
                          rows={2}
                        />
                        <Input
                          placeholder="Item icon (optional)"
                          value={item.icon || ""}
                          onChange={(e) =>
                            updateSectionItems(section.id, (items) =>
                              items.map((it, i) =>
                                i === idx ? { ...it, icon: e.target.value } : it
                              )
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Page"}
        </Button>
      </DialogFooter>
    </div>
  );
}
