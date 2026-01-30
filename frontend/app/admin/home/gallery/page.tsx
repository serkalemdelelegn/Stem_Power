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
import { Plus, Edit, Trash2, Save, ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { backendApi } from "@/lib/backend-api";
import { fetchGalleryItems } from "@/lib/api-content";
import { useToast } from "@/hooks/use-toast";

interface GalleryItem {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  location: string;
  participants: number;
  createdAt?: string;
}

const categories = [
  "Robotics",
  "Entrepreneurship",
  "Research",
  "Technology",
  "Engineering",
  "FabLab",
];

const transformBackendGalleryItem = (backendItem: any): GalleryItem => {
  return {
    id:
      backendItem.id?.toString() ||
      backendItem._id?.toString() ||
      Date.now().toString(),
    image:
      backendItem.media_url ||
      backendItem.image_url ||
      backendItem.image ||
      backendItem.url ||
      "",
    title: backendItem.title || backendItem.name || "Untitled",
    description: backendItem.caption || backendItem.description || "",
    category: backendItem.category || "General",
    location: backendItem.location || "STEM Center",
    participants: Number(backendItem.participants) || 0,
    createdAt: backendItem.createdAt || new Date().toISOString(),
  };
};

export default function StudentGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadGalleryItems();
  }, []);

  const loadGalleryItems = async () => {
    setIsLoading(true);
    try {
      const items = await fetchGalleryItems();
      setGalleryItems(items);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load gallery items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      image: "",
      title: "",
      description: "",
      category: "Robotics",
      location: "",
      participants: 0,
    };
    setEditingItem(newItem);
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const editItem = (item: GalleryItem) => {
    setEditingItem({ ...item });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const saveItem = async () => {
    if (!editingItem || !editingItem.title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile && !editingItem.image) {
      toast({
        title: "Error",
        description: "Please upload an image",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", editingItem.title);
      formData.append("caption", editingItem.description);
      formData.append("category", editingItem.category);
      formData.append("location", editingItem.location);
      formData.append("participants", `${editingItem.participants}`);
      formData.append("isActive", "true");

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const existing = galleryItems.find((i) => i.id === editingItem.id);

      if (existing) {
        const updated = await backendApi.putFormData(
          `/api/gallery/${editingItem.id}`,
          formData
        );
        if (updated) {
          const normalized = transformBackendGalleryItem(updated);
          setGalleryItems(
            galleryItems.map((i) => (i.id === editingItem.id ? normalized : i))
          );
          toast({ title: "Success", description: "Gallery item updated" });
        }
      } else {
        const created = await backendApi.postFormData("/api/gallery", formData);
        if (created) {
          const normalized = transformBackendGalleryItem(created);
          setGalleryItems([...galleryItems, normalized]);
          toast({ title: "Success", description: "Gallery item created" });
        }
      }
      setIsDialogOpen(false);
      setSelectedFile(null);
      setEditingItem(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save gallery item",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    if (confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await backendApi.delete(`/api/gallery/${id}`);
        setGalleryItems(galleryItems.filter((i) => i.id !== id));
        toast({ title: "Success", description: "Gallery item deleted" });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete gallery item",
          variant: "destructive",
        });
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setEditingItem({ ...editingItem, image: previewUrl });
    }
  };

  if (isLoading) {
    return (
      <div>
        <AdminHeader
          title="Student Gallery"
          description="Manage student project showcase gallery"
        />
        <div className="p-6 flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading gallery items...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="Student Gallery"
        description="Manage student project showcase gallery"
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
            Showcase student projects and activities across STEM centers
          </p>
          <Button onClick={addItem} className="bg-[#00BFA6] hover:bg-[#00A693]">
            <Plus className="mr-2 h-4 w-4" />
            Add Gallery Item
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48">
                {item.image ? (
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <Badge className="absolute top-3 left-3 bg-[#00BFA6]">
                  {item.category}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {item.title || "Untitled"}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editItem(item)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{item.location}</span>
                  <span>{item.participants} participants</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem?.title || "New Gallery Item"}
              </DialogTitle>
              <DialogDescription>
                Configure student project showcase item
              </DialogDescription>
            </DialogHeader>
            {editingItem && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Project Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {editingItem.image && (
                    <img
                      src={editingItem.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    value={editingItem.title}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    placeholder="Robotics Innovation Lab"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    placeholder="Students at Addis Ababa STEM Center..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={editingItem.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value,
                        })
                      }
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editingItem.location}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          location: e.target.value,
                        })
                      }
                      placeholder="Addis Ababa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="participants">Participants</Label>
                    <Input
                      id="participants"
                      type="number"
                      value={editingItem.participants}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          participants: Number.parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="24"
                    />
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
                    onClick={saveItem}
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Item
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
