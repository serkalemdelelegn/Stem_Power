"use client";

import type React from "react";
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, Save, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageImage {
  id: string;
  url: string;
  caption: string;
  alt: string;
}

interface ListItem {
  id: string;
  text: string;
}

interface PageSection {
  id: string;
  type: "text" | "list" | "gallery" | "stats";
  title: string;
  content: string;
  items?: ListItem[];
  images?: PageImage[];
}

interface DynamicPageData {
  title: string;
  description: string;
  badge: string;
  sections: PageSection[];
}

interface DynamicPageBuilderProps {
  title: string;
  description: string;
  backLink: string;
  initialData?: DynamicPageData;
  onSave: (data: DynamicPageData) => void;
}

export function DynamicPageBuilder({
  title,
  description,
  backLink,
  initialData,
  onSave,
}: DynamicPageBuilderProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<DynamicPageData>(
    initialData || {
      title: "",
      description: "",
      badge: "",
      sections: [],
    }
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<PageSection | null>(
    null
  );
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<PageImage | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave(data);
    setIsSaving(false);
    alert("Page updated successfully!");
  };

  const addSection = () => {
    const newSection: PageSection = {
      id: Date.now().toString(),
      type: "text",
      title: "",
      content: "",
      items: [],
      images: [],
    };
    setEditingSection(newSection);
    setIsDialogOpen(true);
  };

  const editSection = (section: PageSection) => {
    setEditingSection({ ...section });
    setIsDialogOpen(true);
  };

  const saveSection = () => {
    if (!editingSection) return;

    const existing = data.sections.find((s) => s.id === editingSection.id);
    if (existing) {
      setData({
        ...data,
        sections: data.sections.map((s) =>
          s.id === editingSection.id ? editingSection : s
        ),
      });
    } else {
      setData({
        ...data,
        sections: [...data.sections, editingSection],
      });
    }

    setIsDialogOpen(false);
    setEditingSection(null);
  };

  const deleteSection = (id: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setData({
        ...data,
        sections: data.sections.filter((s) => s.id !== id),
      });
    }
  };

  const addImage = () => {
    const newImage: PageImage = {
      id: Date.now().toString(),
      url: "",
      caption: "",
      alt: "",
    };
    setEditingImage(newImage);
    setIsImageDialogOpen(true);
  };

  const saveImage = () => {
    if (!editingImage || !editingSection) return;

    const images = editingSection.images || [];
    const existing = images.find((i) => i.id === editingImage.id);

    if (existing) {
      setEditingSection({
        ...editingSection,
        images: images.map((i) =>
          i.id === editingImage.id ? editingImage : i
        ),
      });
    } else {
      setEditingSection({
        ...editingSection,
        images: [...images, editingImage],
      });
    }

    setIsImageDialogOpen(false);
    setEditingImage(null);
  };

  const deleteImage = (id: string) => {
    if (!editingSection) return;
    setEditingSection({
      ...editingSection,
      images: (editingSection.images || []).filter((i) => i.id !== id),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingImage({ ...editingImage, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const addListItem = () => {
    if (!editingSection) return;
    const newItem: ListItem = { id: Date.now().toString(), text: "" };
    setEditingSection({
      ...editingSection,
      items: [...(editingSection.items || []), newItem],
    });
  };

  const updateListItem = (id: string, text: string) => {
    if (!editingSection) return;
    setEditingSection({
      ...editingSection,
      items: (editingSection.items || []).map((item) =>
        item.id === id ? { ...item, text } : item
      ),
    });
  };

  const deleteListItem = (id: string) => {
    if (!editingSection) return;
    setEditingSection({
      ...editingSection,
      items: (editingSection.items || []).filter((item) => item.id !== id),
    });
  };

  return (
    <div>
      <div className="flex items-center gap-2 px-6 pt-6">
        <Link
          href={backLink}
          className="flex items-center gap-2 text-[#367375] hover:text-[#24C3BC] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </div>

      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold text-[#0D5C63]">{title}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <div className="p-6 max-w-6xl">
        <div className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Page Header</CardTitle>
              <CardDescription>
                Main title and description for this page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge Text</Label>
                <Input
                  id="badge"
                  value={data.badge}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  placeholder="e.g., Program Name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pageTitle">Page Title</Label>
                <Input
                  id="pageTitle"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Main title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pageDescription">Page Description</Label>
                <Textarea
                  id="pageDescription"
                  rows={3}
                  value={data.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                  placeholder="Detailed description (supports multiple lines)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sections Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Page Sections</CardTitle>
                  <CardDescription>
                    {data.sections.length} sections
                  </CardDescription>
                </div>
                <Button
                  onClick={addSection}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.sections.map((section, index) => (
                  <Card key={section.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{section.type}</Badge>
                          <h3 className="font-semibold">
                            {section.title || "Untitled Section"}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {section.content}
                        </p>
                        {section.items && section.items.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {section.items.length} items
                          </p>
                        )}
                        {section.images && section.images.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {section.images.length} images
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editSection(section)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSection(section.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
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

      {/* Section Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSection?.title || "New Section"}</DialogTitle>
            <DialogDescription>
              Edit section content and layout
            </DialogDescription>
          </DialogHeader>

          {editingSection && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sectionType">Section Type</Label>
                <select
                  id="sectionType"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingSection.type}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      type: e.target.value as PageSection["type"],
                    })
                  }
                >
                  <option value="text">Text Content</option>
                  <option value="list">List Items</option>
                  <option value="gallery">Image Gallery</option>
                  <option value="stats">Statistics</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sectionTitle">Section Title</Label>
                <Input
                  id="sectionTitle"
                  placeholder="e.g., Key Features"
                  value={editingSection.title}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sectionContent">Content</Label>
                <Textarea
                  id="sectionContent"
                  rows={4}
                  placeholder="Enter content (supports multiple lines)"
                  value={editingSection.content}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      content: e.target.value,
                    })
                  }
                />
              </div>

              {/* List Items Section */}
              {editingSection.type === "list" && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label>List Items</Label>
                    <Button
                      size="sm"
                      onClick={addListItem}
                      className="bg-[#00BFA6] hover:bg-[#00A693]"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(editingSection.items || []).map((item) => (
                      <div key={item.id} className="flex gap-2">
                        <Input
                          value={item.text}
                          onChange={(e) =>
                            updateListItem(item.id, e.target.value)
                          }
                          placeholder="List item text"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteListItem(item.id)}
                          className="shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Section */}
              {editingSection.type === "gallery" && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label>Images</Label>
                    <Button
                      size="sm"
                      onClick={addImage}
                      className="bg-[#00BFA6] hover:bg-[#00A693]"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Image
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    {(editingSection.images || []).map((image) => (
                      <Card key={image.id} className="p-3">
                        <div className="flex gap-3">
                          {image.url && (
                            <div className="h-20 w-20 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={image.url || "/placeholder.svg"}
                                alt={image.alt}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 space-y-2">
                            <Input
                              value={image.caption}
                              onChange={(e) =>
                                setEditingImage({
                                  ...image,
                                  caption: e.target.value,
                                })
                              }
                              placeholder="Image caption"
                              size={1}
                            />
                            <Input
                              value={image.alt}
                              onChange={(e) =>
                                setEditingImage({
                                  ...image,
                                  alt: e.target.value,
                                })
                              }
                              placeholder="Alt text"
                              size={1}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteImage(image.id)}
                            className="shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveSection}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Section
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Upload Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
            <DialogDescription>
              Upload and configure image details
            </DialogDescription>
          </DialogHeader>

          {editingImage && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="imageFile">Image File</Label>
                <Input
                  id="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              {editingImage.url && (
                <div className="h-40 rounded-lg overflow-hidden border">
                  <img
                    src={editingImage.url || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="imageCaption">Caption</Label>
                <Input
                  id="imageCaption"
                  value={editingImage.caption}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      caption: e.target.value,
                    })
                  }
                  placeholder="Image caption"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageAlt">Alt Text</Label>
                <Input
                  id="imageAlt"
                  value={editingImage.alt}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, alt: e.target.value })
                  }
                  placeholder="Descriptive alt text"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsImageDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveImage}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Save Image
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
