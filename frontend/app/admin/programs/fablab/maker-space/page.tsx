"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/ui/admin-header";
import { Badge } from "@/components/ui/badge";
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
  Save,
  Plus,
  Trash2,
  Edit,
  Calendar,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import type { MakerSpaceItem } from "@/lib/api-types";
import {
  fetchAdminHero,
  fetchAdminStatistics,
  fetchAdminGallery,
  fetchAdminWorkshops,
  fetchAdminFeatures,
  createHero,
  updateHero,
  getHeroId,
  createStatistic as createStatisticAPI,
  updateStatistic as updateStatisticAPI,
  deleteStatistic as deleteStatisticAPI,
  createGalleryImage as createGalleryImageAPI,
  updateGalleryImage as updateGalleryImageAPI,
  deleteGalleryImage as deleteGalleryImageAPI,
  createWorkshop as createWorkshopAPI,
  updateWorkshop as updateWorkshopAPI,
  deleteWorkshop as deleteWorkshopAPI,
  createFeature as createFeatureAPI,
  updateFeature as updateFeatureAPI,
  deleteFeature as deleteFeatureAPI,
  type AdminHero,
  type AdminStat,
  type AdminGalleryImage,
  type AdminWorkshop,
  type AdminFeature,
} from "@/lib/api-programs/fablab/api-programs-fablab-maker-space";

interface Statistic {
  id: string;
  icon: string;
  number: string;
  label: string;
}

interface GalleryImage {
  id: string;
  image: string | File | null;
  caption?: string;
  imagePreview?: string; // For displaying preview of File objects
}

interface Workshop {
  id: string;
  date: string;
  title: string;
  level: string;
  duration: string;
  location: string;
  description: string;
  image: string | File | null;
  registrationLink: string;
  imagePreview?: string; // For displaying preview of File objects
}

type MakerSpaceFormState = {
  id?: string;
  name: string;
  description: string;
  category: string;
  image: string | File | null;
  imagePreview?: string; // For displaying preview of File objects
};

export default function MakerSpacePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isStatDialogOpen, setIsStatDialogOpen] = useState(false);
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [isWorkshopDialogOpen, setIsWorkshopDialogOpen] = useState(false);
  const [isSavingGallery, setIsSavingGallery] = useState(false);
  const [isSavingWorkshop, setIsSavingWorkshop] = useState(false);
  const [editingStat, setEditingStat] = useState<Statistic | null>(null);
  const [editingGalleryImage, setEditingGalleryImage] =
    useState<GalleryImage | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [makerSpaceItems, setMakerSpaceItems] = useState<MakerSpaceItem[]>([]);
  const [isMakerSpaceDialogOpen, setIsMakerSpaceDialogOpen] = useState(false);
  const [editingMakerSpaceItem, setEditingMakerSpaceItem] =
    useState<MakerSpaceFormState | null>(null);
  const [isLoadingMakerSpaceItems, setIsLoadingMakerSpaceItems] =
    useState(true);
  const [isSavingMakerSpaceItem, setIsSavingMakerSpaceItem] = useState(false);
  const [makerSpaceItemsError, setMakerSpaceItemsError] = useState<
    string | null
  >(null);

  // Hero Banner Section
  const [heroBanner, setHeroBanner] = useState<{
    badge: string;
    title: string;
    subtitle: string;
    image: string | File | null;
    imagePreview?: string;
  }>({
    badge: "FabLab Program",
    title: "Maker Space: Dream. Build. Discover.",
    subtitle:
      "A place where creativity comes alive. Explore ideas, experiment with new tools, and bring bold dreams to life—together.",
    image: null,
    imagePreview: undefined,
  });

  // Statistics Section
  const [statistics, setStatistics] = useState<Statistic[]>([]);

  // Inside the Maker Space Gallery
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  // Workshops Section
  const [workshopsSection, setWorkshopsSection] = useState({
    ctaButton: "Request Full Schedule",
  });

  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchMakerSpaceItems = async () => {
      try {
        setIsLoadingMakerSpaceItems(true);
        const [featuresData, heroData, statsData, galleryData, workshopsData] =
          await Promise.all([
            fetchAdminFeatures(),
            fetchAdminHero(),
            fetchAdminStatistics(),
            fetchAdminGallery(),
            fetchAdminWorkshops(),
          ]);

        if (isMounted) {
          // Transform features to MakerSpaceItem format
          setMakerSpaceItems(
            featuresData.map((feature) => ({
              id: feature.id,
              name: feature.name,
              description: feature.description,
              category: feature.category,
              image: feature.image,
            }))
          );
          setMakerSpaceItemsError(null);
        }

        if (isMounted && heroData) {
          setHeroBanner({
            badge: heroData.badge || "",
            title: heroData.title || "",
            subtitle: heroData.description || "",
            image: heroData.image || "",
          });
        }

        if (isMounted) {
          setStatistics(statsData);
        }

        if (isMounted) {
          setGalleryImages(galleryData);
        }

        if (isMounted) {
          setWorkshops(workshopsData);
        }
      } catch (error) {
        console.error(
          "[Admin MakerSpace] Failed to load maker space items",
          error
        );
        if (isMounted) {
          setMakerSpaceItemsError(
            "Unable to load maker space highlights from the API."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingMakerSpaceItems(false);
        }
      }
    };

    fetchMakerSpaceItems();

    return () => {
      isMounted = false;
    };
  }, []);

  const makerSpaceCount = useMemo(
    () => makerSpaceItems.length,
    [makerSpaceItems]
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Try to get existing hero ID to update, otherwise create new
      const heroId = await getHeroId();
      const heroData = {
        badge: heroBanner.badge,
        title: heroBanner.title,
        description: heroBanner.subtitle,
        image: heroBanner.image, // Can be File or string
      };
      if (heroId) {
        await updateHero(heroId, heroData);
      } else {
        await createHero(heroData);
      }
      alert("Maker Space page updated successfully!");
    } catch (error: any) {
      console.error("[v0] Error saving:", error);
      alert(error.message || "Error saving page. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Statistics handlers
  const addStatistic = () => {
    const newStat: Statistic = {
      id: Date.now().toString(),
      icon: "users",
      number: "",
      label: "",
    };
    setEditingStat(newStat);
    setIsStatDialogOpen(true);
  };

  const editStatistic = (stat: Statistic) => {
    setEditingStat({ ...stat });
    setIsStatDialogOpen(true);
  };

  const saveStatistic = async () => {
    if (!editingStat) return;
    try {
      const existing = statistics.find((s) => s.id === editingStat.id);
      if (existing) {
        // Transform admin format to backend format
        const backendStat = await updateStatisticAPI(editingStat.id, {
          title: editingStat.label,
          value: editingStat.number,
        });
        // Transform back to admin format
        const updated: AdminStat = {
          id: backendStat.id,
          icon: editingStat.icon, // Preserve icon (not in backend)
          number: backendStat.value,
          label: backendStat.title,
        };
        setStatistics(
          statistics.map((s) => (s.id === updated.id ? updated : s))
        );
      } else {
        // Transform admin format to backend format
        const backendStat = await createStatisticAPI({
          title: editingStat.label,
          value: editingStat.number,
        });
        // Transform back to admin format
        const created: AdminStat = {
          id: backendStat.id,
          icon: editingStat.icon, // Preserve icon (not in backend)
          number: backendStat.value,
          label: backendStat.title,
        };
        setStatistics([...statistics, created]);
      }
    } catch (error: any) {
      console.error("Failed to save statistic:", error);
      alert(error.message || "Failed to save statistic. Please try again.");
    } finally {
      setIsStatDialogOpen(false);
      setEditingStat(null);
    }
  };

  const deleteStatistic = async (id: string) => {
    if (!confirm("Are you sure you want to delete this statistic?")) return;
    try {
      await deleteStatisticAPI(id);
      setStatistics(statistics.filter((s) => s.id !== id));
    } catch (error: any) {
      console.error("Failed to delete statistic:", error);
      alert(error.message || "Failed to delete statistic. Please try again.");
    }
  };

  // Gallery handlers
  const addGalleryImage = () => {
    const newImage: GalleryImage = {
      id: Date.now().toString(),
      image: null,
      caption: "",
      imagePreview: undefined,
    };
    setEditingGalleryImage(newImage);
    setIsGalleryDialogOpen(true);
  };

  const editGalleryImage = (image: GalleryImage) => {
    setEditingGalleryImage({
      ...image,
      image: image.image, // This will be a string URL for existing items
      imagePreview: undefined, // No preview needed for existing URLs
    });
    setIsGalleryDialogOpen(true);
  };

  const saveGalleryImage = async () => {
    if (!editingGalleryImage || isSavingGallery) return;
    setIsSavingGallery(true);
    try {
      const existing = galleryImages.find(
        (i) => i.id === editingGalleryImage.id
      );
      if (existing) {
        // Transform admin format to backend format
        // image can be File or string
        const backendGallery = await updateGalleryImageAPI(
          editingGalleryImage.id,
          {
            image_url: editingGalleryImage.image, // Can be File or string
            caption: editingGalleryImage.caption || null,
          }
        );
        // Transform back to admin format
        const updated: AdminGalleryImage = {
          id: backendGallery.id,
          image: backendGallery.image_url,
          caption: backendGallery.caption || undefined,
        };
        setGalleryImages(
          galleryImages.map((i) => (i.id === updated.id ? updated : i))
        );
      } else {
        // Transform admin format to backend format
        const backendGallery = await createGalleryImageAPI({
          image_url: editingGalleryImage.image, // Can be File or string
          caption: editingGalleryImage.caption || null,
        });
        // Transform back to admin format
        const created: AdminGalleryImage = {
          id: backendGallery.id,
          image: backendGallery.image_url,
          caption: backendGallery.caption || undefined,
        };
        setGalleryImages([...galleryImages, created]);
      }
    } catch (error: any) {
      console.error("Failed to save gallery image:", error);
      alert(error.message || "Failed to save gallery image. Please try again.");
    } finally {
      // Clean up preview URL if it exists
      if (editingGalleryImage?.imagePreview) {
        URL.revokeObjectURL(editingGalleryImage.imagePreview);
      }
      setIsSavingGallery(false);
      setIsGalleryDialogOpen(false);
      setEditingGalleryImage(null);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteGalleryImageAPI(id);
      setGalleryImages(galleryImages.filter((i) => i.id !== id));
    } catch (error: any) {
      console.error("Failed to delete gallery image:", error);
      alert(
        error.message || "Failed to delete gallery image. Please try again."
      );
    }
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB to prevent payload too large errors)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert(
        `Image file is too large. Please upload an image smaller than 10MB. Current size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      e.target.value = ""; // Clear the input
      return;
    }

    if (editingGalleryImage) {
      // Clean up old preview URL if it exists
      if (editingGalleryImage.imagePreview) {
        URL.revokeObjectURL(editingGalleryImage.imagePreview);
      }
      // Keep the File object and create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setEditingGalleryImage({
        ...editingGalleryImage,
        image: file, // Keep as File object, not base64
        imagePreview: previewUrl,
      });
    }
  };

  // Workshop handlers
  const addWorkshop = () => {
    const newWorkshop: Workshop = {
      id: Date.now().toString(),
      date: "",
      title: "",
      level: "",
      duration: "",
      location: "",
      description: "",
      image: null,
      registrationLink: "",
      imagePreview: undefined,
    };
    setEditingWorkshop(newWorkshop);
    setIsWorkshopDialogOpen(true);
  };

  const editWorkshop = (workshop: Workshop) => {
    const editingWorkshop: Workshop = {
      ...workshop,
      image: workshop.image, // This will be a string URL for existing items
      imagePreview: undefined, // No preview needed for existing URLs
    };
    setEditingWorkshop(editingWorkshop);
    setIsWorkshopDialogOpen(true);
  };

  const saveWorkshop = async () => {
    if (!editingWorkshop || isSavingWorkshop) return;
    setIsSavingWorkshop(true);
    try {
      const existing = workshops.find((w) => w.id === editingWorkshop.id);
      // Transform admin format to backend format
      const levelMap: Record<string, "beginner" | "intermediate" | "advanced"> =
        {
          Beginner: "beginner",
          Intermediate: "intermediate",
          Advanced: "advanced",
          beginner: "beginner",
          intermediate: "intermediate",
          advanced: "advanced",
        };
      const backendLevel = levelMap[editingWorkshop.level] || "beginner";

      if (existing) {
        const backendWorkshop = await updateWorkshopAPI(editingWorkshop.id, {
          date: editingWorkshop.date,
          title: editingWorkshop.title,
          level: backendLevel,
          duration: editingWorkshop.duration || null,
          location: editingWorkshop.location || null,
          description: editingWorkshop.description || null,
          registration_link: editingWorkshop.registrationLink || null,
          workshop_image: editingWorkshop.image || null, // Can be File or string
        });
        // Transform back to admin format
        const updated: AdminWorkshop = {
          id: backendWorkshop.id,
          date: editingWorkshop.date, // Keep original format
          title: backendWorkshop.title,
          level: backendWorkshop.level,
          duration: backendWorkshop.duration || "",
          location: backendWorkshop.location || "",
          description: backendWorkshop.description || "",
          image: backendWorkshop.workshop_image || "",
          registrationLink: backendWorkshop.registration_link || "",
        };
        setWorkshops(workshops.map((w) => (w.id === updated.id ? updated : w)));
      } else {
        const backendWorkshop = await createWorkshopAPI({
          date: editingWorkshop.date,
          title: editingWorkshop.title,
          level: backendLevel,
          duration: editingWorkshop.duration || null,
          location: editingWorkshop.location || null,
          description: editingWorkshop.description || null,
          registration_link: editingWorkshop.registrationLink || null,
          workshop_image: editingWorkshop.image || null, // Can be File or string
        });
        // Transform back to admin format
        const created: AdminWorkshop = {
          id: backendWorkshop.id,
          date: editingWorkshop.date, // Keep original format
          title: backendWorkshop.title,
          level: backendWorkshop.level,
          duration: backendWorkshop.duration || "",
          location: backendWorkshop.location || "",
          description: backendWorkshop.description || "",
          image: backendWorkshop.workshop_image || "",
          registrationLink: backendWorkshop.registration_link || "",
        };
        setWorkshops([...workshops, created]);
      }
    } catch (error: any) {
      console.error("Failed to save workshop:", error);
      alert(error.message || "Failed to save workshop. Please try again.");
    } finally {
      // Clean up preview URL if it exists
      if (editingWorkshop?.imagePreview) {
        URL.revokeObjectURL(editingWorkshop.imagePreview);
      }
      setIsSavingWorkshop(false);
      setIsWorkshopDialogOpen(false);
      setEditingWorkshop(null);
    }
  };

  const deleteWorkshop = async (id: string) => {
    if (!confirm("Are you sure you want to delete this workshop?")) return;
    try {
      await deleteWorkshopAPI(id);
      setWorkshops(workshops.filter((w) => w.id !== id));
    } catch (error: any) {
      console.error("Failed to delete workshop:", error);
      alert(error.message || "Failed to delete workshop. Please try again.");
    }
  };

  const handleWorkshopImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB to prevent payload too large errors)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert(
        `Image file is too large. Please upload an image smaller than 10MB. Current size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      e.target.value = ""; // Clear the input
      return;
    }

    if (editingWorkshop) {
      // Clean up old preview URL if it exists
      if (editingWorkshop.imagePreview) {
        URL.revokeObjectURL(editingWorkshop.imagePreview);
      }

      // Store the File object and create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setEditingWorkshop({
        ...editingWorkshop,
        image: file, // Store File object instead of base64
        imagePreview: previewUrl, // For preview display
      });
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB to prevent payload too large errors)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert(
        `Image file is too large. Please upload an image smaller than 10MB. Current size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      e.target.value = ""; // Clear the input
      return;
    }

    // Clean up old preview URL if it exists
    if (heroBanner.imagePreview) {
      URL.revokeObjectURL(heroBanner.imagePreview);
    }

    // Store the File object and create a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setHeroBanner({
      ...heroBanner,
      image: file, // Store File object instead of base64
      imagePreview: previewUrl, // For preview display
    });
  };

  const openNewMakerSpaceDialog = () => {
    setEditingMakerSpaceItem({
      name: "",
      description: "",
      category: "",
      image: null,
      imagePreview: undefined,
    });
    setIsMakerSpaceDialogOpen(true);
  };

  const openEditMakerSpaceDialog = (item: MakerSpaceItem) => {
    setEditingMakerSpaceItem({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category,
      image: item.image, // This will be a string URL for existing items
      imagePreview: undefined, // No preview needed for existing URLs
    });
    setIsMakerSpaceDialogOpen(true);
  };

  const handleMakerSpaceImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !editingMakerSpaceItem) return;

    // Validate file size (max 10MB to prevent payload too large errors)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert(
        `Image file is too large. Please upload an image smaller than 10MB. Current size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      e.target.value = ""; // Clear the input
      return;
    }

    // Clean up old preview URL if it exists
    if (editingMakerSpaceItem.imagePreview) {
      URL.revokeObjectURL(editingMakerSpaceItem.imagePreview);
    }

    // Store the File object and create a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setEditingMakerSpaceItem((prev) =>
      prev
        ? {
            ...prev,
            image: file, // Store File object instead of base64
            imagePreview: previewUrl, // For preview display
          }
        : prev
    );
  };

  const saveMakerSpaceItem = async () => {
    if (!editingMakerSpaceItem) return;
    if (
      !editingMakerSpaceItem.name.trim() ||
      !editingMakerSpaceItem.description.trim()
    ) {
      alert(
        "Please provide at least a name and description for the maker space highlight."
      );
      return;
    }

    try {
      setIsSavingMakerSpaceItem(true);
      // Transform admin format to backend format
      // Features use: title, description, icon, image, category
      // Admin uses: name, description, image, category
      // image can be a File (for upload) or string (existing URL)
      const backendData = {
        title: editingMakerSpaceItem.name.trim(),
        description: editingMakerSpaceItem.description.trim(),
        image: editingMakerSpaceItem.image || null, // Can be File or string
        category: editingMakerSpaceItem.category || null,
        icon: "sparkles", // Default icon, not in admin form
      };

      if (editingMakerSpaceItem.id) {
        const backendFeature = await updateFeatureAPI(
          editingMakerSpaceItem.id,
          backendData
        );
        // Transform back to admin format
        const updatedItem: MakerSpaceItem = {
          id: backendFeature.id,
          name: backendFeature.title,
          description: backendFeature.description,
          image: backendFeature.image,
          category: backendFeature.category || "",
        };
        setMakerSpaceItems((items) =>
          items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
        );
      } else {
        const backendFeature = await createFeatureAPI(backendData);
        // Transform back to admin format
        const createdItem: MakerSpaceItem = {
          id: backendFeature.id,
          name: backendFeature.title,
          description: backendFeature.description,
          image: backendFeature.image,
          category: backendFeature.category || "",
        };
        setMakerSpaceItems((items) => [...items, createdItem]);
      }

      // Clean up preview URL if it exists
      if (editingMakerSpaceItem?.imagePreview) {
        URL.revokeObjectURL(editingMakerSpaceItem.imagePreview);
      }
      setIsMakerSpaceDialogOpen(false);
      setEditingMakerSpaceItem(null);
      setMakerSpaceItemsError(null);
    } catch (error: any) {
      console.error("[Admin MakerSpace] Failed to save item", error);
      alert(
        error.message || "We couldn't save this highlight. Please try again."
      );
    } finally {
      setIsSavingMakerSpaceItem(false);
    }
  };

  const deleteMakerSpaceItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this highlight?")) return;

    try {
      await deleteFeatureAPI(id);
      setMakerSpaceItems((items) => items.filter((item) => item.id !== id));
    } catch (error: any) {
      console.error("[Admin MakerSpace] Failed to delete item", error);
      alert(
        error.message || "We couldn't delete this highlight. Please try again."
      );
    }
  };

  const closeMakerSpaceDialog = () => {
    // Clean up preview URL if it exists
    if (editingMakerSpaceItem?.imagePreview) {
      URL.revokeObjectURL(editingMakerSpaceItem.imagePreview);
    }
    setIsMakerSpaceDialogOpen(false);
    setEditingMakerSpaceItem(null);
  };

  const closeGalleryDialog = () => {
    if (isSavingGallery) return; // Prevent closing while saving
    // Clean up preview URL if it exists
    if (editingGalleryImage?.imagePreview) {
      URL.revokeObjectURL(editingGalleryImage.imagePreview);
    }
    setIsGalleryDialogOpen(false);
    setEditingGalleryImage(null);
  };

  const closeWorkshopDialog = () => {
    if (isSavingWorkshop) return; // Prevent closing while saving
    // Clean up preview URL if it exists
    if (editingWorkshop?.imagePreview) {
      URL.revokeObjectURL(editingWorkshop.imagePreview);
    }
    setIsWorkshopDialogOpen(false);
    setEditingWorkshop(null);
  };

  return (
    <div>
      <div className="flex items-center gap-2 px-6 pt-6">
        <Link
          href="/admin/programs/fablab"
          className="flex items-center gap-2 text-[#367375] hover:text-[#24C3BC] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to FabLab</span>
        </Link>
      </div>
      <AdminHeader
        title="Maker Space"
        description="Manage maker space content, mentors, and workshops"
      />
      <div className="p-6 max-w-7xl">
        <div className="space-y-6">
          {/* Hero Banner Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Banner</CardTitle>
              <CardDescription>
                Main banner content for the Maker Space page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroBadge">Badge Text</Label>
                <Input
                  id="heroBadge"
                  value={heroBanner.badge}
                  onChange={(e) =>
                    setHeroBanner({ ...heroBanner, badge: e.target.value })
                  }
                  placeholder="e.g., FabLab Program"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Title</Label>
                <Input
                  id="heroTitle"
                  value={heroBanner.title}
                  onChange={(e) =>
                    setHeroBanner({ ...heroBanner, title: e.target.value })
                  }
                  placeholder="e.g., Maker Space: Dream. Build. Discover."
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
                  placeholder="Describe the maker space..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroImage">Hero Image</Label>
                <div className="space-y-3">
                  <Input
                    id="heroImage"
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                  />
                  {(heroBanner.image || heroBanner.imagePreview) && (
                    <div className="h-48 rounded-lg overflow-hidden border">
                      <img
                        src={
                          heroBanner.imagePreview ||
                          (typeof heroBanner.image === "string"
                            ? heroBanner.image
                            : "/placeholder.svg")
                        }
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>
                    Key metrics about the Maker Space
                  </CardDescription>
                </div>
                <Button
                  onClick={addStatistic}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Statistic
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statistics.map((stat) => (
                  <Card key={stat.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-[#00BFA6]">
                          {stat.number}
                        </p>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editStatistic(stat)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteStatistic(stat.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inside the Maker Space Gallery */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Inside the Maker Space</CardTitle>
                  <CardDescription>
                    Photo gallery showcasing the maker space environment
                  </CardDescription>
                </div>
                <Button
                  onClick={addGalleryImage}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {galleryImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="h-48 bg-muted">
                      {image.image && (
                        <img
                          src={image.image || "/placeholder.svg"}
                          alt={image.caption || "Gallery"}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-3 space-y-2">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {image.caption}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => editGalleryImage(image)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteGalleryImage(image.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Workshops Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Upcoming Workshops</CardTitle>
                  <CardDescription>Manage workshop details</CardDescription>
                </div>
                <Button
                  onClick={addWorkshop}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Workshop
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
                {workshops.map((workshop) => (
                  <Card
                    key={workshop.id}
                    className="overflow-hidden flex flex-col"
                  >
                    <div className="h-40 bg-muted">
                      {workshop.image && (
                        <img
                          src={workshop.image || "/placeholder.svg"}
                          alt={workshop.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                      <div>
                        <h3 className="font-semibold text-balance text-lg">
                          {workshop.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {workshop.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{workshop.date}</span>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>
                          <span className="font-medium">Level:</span>{" "}
                          {workshop.level}
                        </p>
                        <p>
                          <span className="font-medium">Duration:</span>{" "}
                          {workshop.duration}
                        </p>
                        <p>
                          <span className="font-medium">Location:</span>{" "}
                          {workshop.location}
                        </p>
                      </div>

                      <div className="flex gap-2 pt-2 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => editWorkshop(workshop)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteWorkshop(workshop.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Maker Space Highlights (API Driven) */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Maker Space Highlights ({makerSpaceCount})
                  </CardTitle>
                  <CardDescription>
                    Manage the highlights that appear publicly on the Maker
                    Space page
                  </CardDescription>
                </div>
                <Button
                  onClick={openNewMakerSpaceDialog}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Highlight
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {makerSpaceItemsError && (
                <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800">
                  <AlertTriangle className="h-4 w-4 mt-1 shrink-0" />
                  <p className="text-sm">
                    {makerSpaceItemsError} You can still add new highlights
                    manually; we'll sync them as soon as the connection is
                    restored.
                  </p>
                </div>
              )}

              {isLoadingMakerSpaceItems && (
                <p className="text-sm text-muted-foreground">
                  Loading maker space highlights…
                </p>
              )}

              {!isLoadingMakerSpaceItems &&
                !makerSpaceItems.length &&
                !makerSpaceItemsError && (
                  <p className="text-sm text-muted-foreground">
                    No highlights yet. Click &ldquo;Add Highlight&rdquo; to
                    create your first entry.
                  </p>
                )}

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {makerSpaceItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    {item.image && (
                      <div className="h-40 bg-muted">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-balance">
                          {item.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="uppercase text-xs tracking-wide"
                        >
                          {item.category || "General"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {item.description}
                      </p>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => openEditMakerSpaceDialog(item)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMakerSpaceItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
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

      {/* Statistic Dialog */}
      <Dialog open={isStatDialogOpen} onOpenChange={setIsStatDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Statistic</DialogTitle>
            <DialogDescription>
              Update the statistic information
            </DialogDescription>
          </DialogHeader>
          {editingStat && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="statNumber">Number</Label>
                <Input
                  id="statNumber"
                  placeholder="e.g., 12+"
                  value={editingStat.number}
                  onChange={(e) =>
                    setEditingStat({ ...editingStat, number: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statLabel">Label</Label>
                <Input
                  id="statLabel"
                  placeholder="e.g., 3D Printers"
                  value={editingStat.label}
                  onChange={(e) =>
                    setEditingStat({ ...editingStat, label: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsStatDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveStatistic}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Gallery Image Dialog */}
      <Dialog 
        open={isGalleryDialogOpen} 
        onOpenChange={(open) => {
          if (!open && !isSavingGallery) {
            closeGalleryDialog();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gallery Image</DialogTitle>
            <DialogDescription>Add or edit a gallery image</DialogDescription>
          </DialogHeader>
          {editingGalleryImage && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="galleryImage">Image</Label>
                <div className="space-y-3">
                  <Input
                    id="galleryImage"
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryImageUpload}
                  />
                  {(editingGalleryImage.image ||
                    editingGalleryImage.imagePreview) && (
                    <div className="h-48 rounded-lg overflow-hidden border">
                      <img
                        src={
                          editingGalleryImage.imagePreview ||
                          (typeof editingGalleryImage.image === "string"
                            ? editingGalleryImage.image
                            : "/placeholder.svg")
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="galleryCaption">Caption (Optional)</Label>
                <Input
                  id="galleryCaption"
                  placeholder="e.g., Students collaborating on projects"
                  value={editingGalleryImage.caption}
                  onChange={(e) =>
                    setEditingGalleryImage({
                      ...editingGalleryImage,
                      caption: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={closeGalleryDialog}
                  disabled={isSavingGallery}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveGalleryImage}
                  disabled={isSavingGallery}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  {isSavingGallery ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Workshop Dialog */}
      <Dialog
        open={isWorkshopDialogOpen}
        onOpenChange={(open) => {
          if (!open && !isSavingWorkshop) {
            closeWorkshopDialog();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWorkshop?.title || "New Workshop"}
            </DialogTitle>
            <DialogDescription>Add or edit workshop details</DialogDescription>
          </DialogHeader>
          {editingWorkshop && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="workshopDate">Date</Label>
                  <Input
                    id="workshopDate"
                    placeholder="e.g., Oct 12, 2025"
                    value={editingWorkshop.date}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workshopLevel">Level</Label>
                  <Input
                    id="workshopLevel"
                    placeholder="e.g., Beginner"
                    value={editingWorkshop.level}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        level: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workshopTitle">Title</Label>
                <Input
                  id="workshopTitle"
                  placeholder="e.g., Intro to 3D Printing"
                  value={editingWorkshop.title}
                  onChange={(e) =>
                    setEditingWorkshop({
                      ...editingWorkshop,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="workshopDuration">Duration</Label>
                  <Input
                    id="workshopDuration"
                    placeholder="e.g., 2 hours"
                    value={editingWorkshop.duration}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        duration: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workshopLocation">Location</Label>
                  <Input
                    id="workshopLocation"
                    placeholder="e.g., FabLab, Addis Ababa"
                    value={editingWorkshop.location}
                    onChange={(e) =>
                      setEditingWorkshop({
                        ...editingWorkshop,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="workshopDescription">Description</Label>
                <Textarea
                  id="workshopDescription"
                  rows={3}
                  placeholder="Describe the workshop..."
                  value={editingWorkshop.description}
                  onChange={(e) =>
                    setEditingWorkshop({
                      ...editingWorkshop,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workshopRegistration">
                  Registration Google Form Link
                </Label>
                <Input
                  id="workshopRegistration"
                  type="url"
                  placeholder="e.g., https://forms.gle/..."
                  value={editingWorkshop.registrationLink}
                  onChange={(e) =>
                    setEditingWorkshop({
                      ...editingWorkshop,
                      registrationLink: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workshopImage">Image</Label>
                <div className="space-y-3">
                  <Input
                    id="workshopImage"
                    type="file"
                    accept="image/*"
                    onChange={handleWorkshopImageUpload}
                  />
                  {(editingWorkshop.image || editingWorkshop.imagePreview) && (
                    <div className="h-48 rounded-lg overflow-hidden border">
                      <img
                        src={
                          editingWorkshop.imagePreview ||
                          (typeof editingWorkshop.image === "string"
                            ? editingWorkshop.image
                            : "/placeholder.svg")
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={closeWorkshopDialog}
                  disabled={isSavingWorkshop}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveWorkshop}
                  disabled={isSavingWorkshop}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  {isSavingWorkshop ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Maker Space Highlight Dialog */}
      <Dialog
        open={isMakerSpaceDialogOpen}
        onOpenChange={setIsMakerSpaceDialogOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMakerSpaceItem?.id ? "Edit Highlight" : "New Highlight"}
            </DialogTitle>
            <DialogDescription>
              These highlights power the public maker space page. Add engaging
              visuals and descriptions to inspire visitors.
            </DialogDescription>
          </DialogHeader>
          {editingMakerSpaceItem && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="highlightName">Title</Label>
                <Input
                  id="highlightName"
                  placeholder="e.g., 3D Printing & Digital Fabrication"
                  value={editingMakerSpaceItem.name}
                  onChange={(e) =>
                    setEditingMakerSpaceItem({
                      ...editingMakerSpaceItem,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highlightCategory">Category (optional)</Label>
                <Input
                  id="highlightCategory"
                  placeholder="e.g., 3D Printing, Robotics, Design"
                  value={editingMakerSpaceItem.category}
                  onChange={(e) =>
                    setEditingMakerSpaceItem({
                      ...editingMakerSpaceItem,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highlightDescription">Description</Label>
                <Textarea
                  id="highlightDescription"
                  rows={3}
                  placeholder="Describe what learners will explore…"
                  value={editingMakerSpaceItem.description}
                  onChange={(e) =>
                    setEditingMakerSpaceItem({
                      ...editingMakerSpaceItem,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highlightImage">Image</Label>
                <div className="space-y-3">
                  <Input
                    id="highlightImage"
                    type="file"
                    accept="image/*"
                    onChange={handleMakerSpaceImageUpload}
                  />
                  {(editingMakerSpaceItem.image ||
                    editingMakerSpaceItem.imagePreview) && (
                    <div className="h-48 overflow-hidden rounded-lg border">
                      <img
                        src={
                          editingMakerSpaceItem.imagePreview ||
                          (typeof editingMakerSpaceItem.image === "string"
                            ? editingMakerSpaceItem.image
                            : "/placeholder.svg")
                        }
                        alt="Highlight preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={closeMakerSpaceDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={saveMakerSpaceItem}
                  disabled={isSavingMakerSpaceItem}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  {isSavingMakerSpaceItem ? "Saving…" : "Save Highlight"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
