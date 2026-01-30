"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Save,
  Plus,
  Trash2,
  Edit,
  Rocket,
  TrendingUp,
  Users,
  DollarSign,
  Building2,
  Phone,
  Mail,
  User,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface HeroSection {
  badge: string;
  title: string;
  description: string;
  image: string | File | null;
  imagePreview?: string; // For displaying preview of File objects
}

interface StatCard {
  id: string;
  icon: string;
  value: string;
  label: string;
}

interface FundingPartner {
  id: string;
  image: string;
  title: string;
  contribution: string;
  contributionDescription: string;
  focusArea: string;
  partnerSince: string;
  peopleImpacted: string;
}

interface SuccessStory {
  id: string;
  businessName: string;
  licenseStatus: string;
  category: string;
  categoryColor: string;
  contactPerson: string;
  phone: string;
  email: string;
}

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  capabilities: string[];
  order?: number;
}

const iconMap = {
  rocket: Rocket,
  trending: TrendingUp,
  users: Users,
  dollar: DollarSign,
};

export default function BusinessDevelopmentPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isAddStatOpen, setIsAddStatOpen] = useState(false);
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [isEditStoryOpen, setIsEditStoryOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null
  );

  const [heroSection, setHeroSection] = useState<HeroSection>({
    badge: "Business Development",
    title: "Business Development Services",
    description:
      "Comprehensive support for entrepreneurs to transform ideas into thriving businesses through mentorship, training, and strategic guidance.",
    image: null,
    imagePreview: undefined,
  });

  const [stats, setStats] = useState<StatCard[]>([
    { id: "1", icon: "rocket", value: "50+", label: "Startups Incubated" },
    { id: "2", icon: "trending", value: "85%", label: "Success Rate" },
    { id: "3", icon: "users", value: "200+", label: "Jobs Created" },
    { id: "4", icon: "dollar", value: "15M+", label: "Birr in Funding" },
  ]);

  const [fundingPartners, setFundingPartners] = useState<FundingPartner[]>([
    {
      id: "1",
      image: "",
      title: "World Bank",
      contribution: "$2.5M",
      contributionDescription: "Infrastructure and program development funding",
      focusArea: "Education infrastructure & Capacity Building",
      partnerSince: "2018",
      peopleImpacted: "5,000+ students and educators",
    },
  ]);

  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([]);

  const [newStat, setNewStat] = useState<Omit<StatCard, "id">>({
    icon: "rocket",
    value: "",
    label: "",
  });

  const [newPartner, setNewPartner] = useState<{
    image: string | File | null;
    title: string;
    contribution: string;
    contributionDescription: string;
    focusArea: string;
    partnerSince: string;
    peopleImpacted: string;
    imagePreview?: string;
  }>({
    image: null,
    title: "",
    contribution: "",
    contributionDescription: "",
    focusArea: "",
    partnerSince: "",
    peopleImpacted: "",
    imagePreview: undefined,
  });

  const [newStory, setNewStory] = useState<Omit<SuccessStory, "id">>({
    businessName: "",
    licenseStatus: "Licensed",
    category: "",
    categoryColor: "blue",
    contactPerson: "",
    phone: "",
    email: "",
  });

  const [newService, setNewService] = useState<Omit<ServiceItem, "id">>({
    name: "",
    description: "",
    icon: "target",
    capabilities: [],
    order: 0,
  });

  // Ref to track which service items are currently being updated to prevent duplicate API calls
  const isUpdatingRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          heroResponse,
          statsResponse,
          partnersResponse,
          storiesResponse,
          servicesResponse,
        ] = await Promise.all([
          fetch("/api/programs/entrepreneurship/business-development/hero"),
          fetch("/api/programs/entrepreneurship/business-development/stats"),
          fetch("/api/programs/entrepreneurship/business-development/partners"),
          fetch("/api/programs/entrepreneurship/business-development"),
          fetch(
            "/api/programs/entrepreneurship/business-development/service-items"
          ),
        ]);

        if (heroResponse.ok) {
          const heroData = await heroResponse.json();
          if (heroData) {
            setHeroSection({
              badge: heroData.badge || "",
              title: heroData.title || "",
              description: heroData.description || "",
              image: heroData.image || null,
              imagePreview: undefined,
            });
          }
        }

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (Array.isArray(statsData)) {
            setStats(statsData);
          }
        }

        if (partnersResponse.ok) {
          const partnersData = await partnersResponse.json();
          if (Array.isArray(partnersData)) {
            setFundingPartners(partnersData);
          }
        }

        if (storiesResponse.ok) {
          const storiesData = await storiesResponse.json();
          if (Array.isArray(storiesData)) {
            // Map API response to SuccessStory format
            const mappedStories = storiesData.map((story: any) => ({
              id: story.id,
              businessName: story.name || story.businessName, // Handle both formats
              licenseStatus: story.licenseStatus || story.license_status,
              category: story.category || "",
              categoryColor:
                story.categoryColor || story.category_color || "blue",
              contactPerson: story.contactPerson || story.contact_person || "",
              phone: story.phone || "",
              email: story.email || "",
            }));
            setSuccessStories(mappedStories);
          }
        }

        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          if (Array.isArray(servicesData)) {
            // Ensure capabilities is always an array of strings
            const normalizedServices = servicesData.map((service: any) => {
              let capabilities: string[] = [];

              if (Array.isArray(service.capabilities)) {
                // Already an array - flatten and ensure all elements are plain strings
                capabilities = service.capabilities
                  .flatMap((cap: any) => {
                    // If cap is a string that looks like JSON, try to parse it recursively
                    if (typeof cap === "string" && cap.trim().startsWith("[")) {
                      try {
                        const parsed = JSON.parse(cap);
                        if (Array.isArray(parsed)) {
                          // Recursively flatten nested arrays
                          return parsed.flatMap((p: any) =>
                            typeof p === "string" ? p : String(p)
                          );
                        }
                        return String(cap);
                      } catch {
                        // Not valid JSON, return as is
                        return String(cap);
                      }
                    }
                    return String(cap);
                  })
                  .filter((cap: string) => cap.trim());
              } else if (typeof service.capabilities === "string") {
                // It's a string - try to parse as JSON first
                try {
                  const parsed = JSON.parse(service.capabilities);
                  if (Array.isArray(parsed)) {
                    // Recursively flatten nested arrays
                    capabilities = parsed
                      .flatMap((cap: any) => {
                        if (
                          typeof cap === "string" &&
                          cap.trim().startsWith("[")
                        ) {
                          try {
                            const nested = JSON.parse(cap);
                            return Array.isArray(nested)
                              ? nested.map(String)
                              : [String(cap)];
                          } catch {
                            return [String(cap)];
                          }
                        }
                        return [String(cap)];
                      })
                      .filter((cap: string) => cap.trim());
                  } else {
                    // If it's a single string, split by newlines
                    capabilities = service.capabilities
                      .split("\n")
                      .filter((line: string) => line.trim());
                  }
                } catch {
                  // Not valid JSON, treat as plain string and split by newlines
                  capabilities = service.capabilities
                    .split("\n")
                    .filter((line: string) => line.trim());
                }
              } else if (service.capabilities) {
                // Other type, convert to string array
                capabilities = [String(service.capabilities)];
              }

              return {
                ...service,
                capabilities,
              };
            });
            setServiceItems(normalizedServices);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save hero section - handle File upload
      if (heroSection.image instanceof File) {
        const formData = new FormData();
        formData.append("file", heroSection.image);
        formData.append("badge", heroSection.badge);
        formData.append("title", heroSection.title);
        formData.append("description", heroSection.description);
        await fetch(
          "/api/programs/entrepreneurship/business-development/hero",
          {
            method: "POST",
            body: formData,
          }
        );
      } else {
        await fetch(
          "/api/programs/entrepreneurship/business-development/hero",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              badge: heroSection.badge,
              title: heroSection.title,
              description: heroSection.description,
              image: heroSection.image || null,
            }),
          }
        );
      }

      alert("Business Development Services page updated successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePartnerImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    isNew = true
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up old preview URL if it exists
      if (isNew && newPartner.imagePreview) {
        URL.revokeObjectURL(newPartner.imagePreview);
      }

      // Store the File object and create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      if (isNew) {
        setNewPartner({
          ...newPartner,
          image: file, // Store File object instead of base64
          imagePreview: previewUrl, // For preview display
        });
      }
      // Reset input to allow selecting the same file again
      e.target.value = "";
    }
  };

  const addStat = async () => {
    if (newStat.value && newStat.label) {
      try {
        const response = await fetch(
          "/api/programs/entrepreneurship/business-development/stats",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newStat),
          }
        );
        if (response.ok) {
          const newItem = await response.json();
          setStats([...stats, newItem]);
          setNewStat({ icon: "rocket", value: "", label: "" });
          setIsAddStatOpen(false);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add statistic");
        }
      } catch (error: any) {
        console.error("Failed to add stat:", error);
        alert(error.message || "Failed to add statistic. Please try again.");
      }
    }
  };

  const deleteStat = async (id: string) => {
    try {
      const response = await fetch(
        `/api/programs/entrepreneurship/business-development/stats/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setStats(stats.filter((s) => s.id !== id));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete statistic");
      }
    } catch (error: any) {
      console.error("Failed to delete stat:", error);
      alert(error.message || "Failed to delete statistic. Please try again.");
    }
  };

  const addFundingPartner = async () => {
    if (newPartner.title && newPartner.contribution) {
      try {
        let response;
        // Handle File upload
        if (
          newPartner.image &&
          typeof newPartner.image !== "string" &&
          newPartner.image instanceof File
        ) {
          const formData = new FormData();
          formData.append("file", newPartner.image);
          formData.append("name", newPartner.title);
          // Combine contribution amount and description
          const contributionText = newPartner.contributionDescription
            ? `${newPartner.contribution} - ${newPartner.contributionDescription}`
            : newPartner.contribution;
          formData.append("contribution_description", contributionText);
          formData.append("focus_area", newPartner.focusArea);
          formData.append("partnership_duration", newPartner.partnerSince);
          formData.append("people_impacted", newPartner.peopleImpacted);

          response = await fetch(
            "/api/programs/entrepreneurship/business-development/partners",
            {
              method: "POST",
              body: formData,
            }
          );
        } else {
          response = await fetch(
            "/api/programs/entrepreneurship/business-development/partners",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: newPartner.title,
                logo: newPartner.image || null,
                contribution_description: newPartner.contributionDescription
                  ? `${newPartner.contribution} - ${newPartner.contributionDescription}`
                  : newPartner.contribution,
                focus_area: newPartner.focusArea,
                partnership_duration: newPartner.partnerSince,
                people_impacted: newPartner.peopleImpacted,
              }),
            }
          );
        }

        if (response.ok) {
          const newItem = await response.json();
          setFundingPartners([...fundingPartners, newItem]);
          // Clean up preview URL
          if (newPartner.imagePreview) {
            URL.revokeObjectURL(newPartner.imagePreview);
          }
          setNewPartner({
            image: null,
            title: "",
            contribution: "",
            contributionDescription: "",
            focusArea: "",
            partnerSince: "",
            peopleImpacted: "",
            imagePreview: undefined,
          });
          setIsAddPartnerOpen(false);
        } else {
          let errorMessage = "Failed to add funding partner";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (jsonError) {
            // If response is not JSON, try to get text
            try {
              const errorText = await response.text();
              errorMessage = errorText || errorMessage;
            } catch {
              errorMessage = response.statusText || errorMessage;
            }
          }
          throw new Error(errorMessage);
        }
      } catch (error: any) {
        console.error("Failed to add partner:", error);
        alert(
          error.message || "Failed to add funding partner. Please try again."
        );
      }
    }
  };

  const deleteFundingPartner = async (id: string) => {
    try {
      const response = await fetch(
        `/api/programs/entrepreneurship/business-development/partners/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setFundingPartners(fundingPartners.filter((p) => p.id !== id));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete funding partner");
      }
    } catch (error: any) {
      console.error("Failed to delete partner:", error);
      alert(
        error.message || "Failed to delete funding partner. Please try again."
      );
    }
  };

  const addSuccessStory = async () => {
    // Validate all required fields
    if (!newStory.businessName || !newStory.businessName.trim()) {
      alert("Business name is required");
      return;
    }
    if (!newStory.licenseStatus || !newStory.licenseStatus.trim()) {
      alert("License status is required");
      return;
    }
    if (!newStory.category || !newStory.category.trim()) {
      alert("Category is required");
      return;
    }
    if (!newStory.contactPerson || !newStory.contactPerson.trim()) {
      alert("Contact person is required");
      return;
    }
    if (!newStory.phone || !newStory.phone.trim()) {
      alert("Phone is required");
      return;
    }
    if (!newStory.email || !newStory.email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      const storyData = {
        name: newStory.businessName.trim(),
        licenseStatus: newStory.licenseStatus.trim(),
        category: newStory.category.trim(),
        categoryColor: newStory.categoryColor,
        description: "",
        contactPerson: newStory.contactPerson.trim(),
        phone: newStory.phone.trim(),
        email: newStory.email.trim(),
      };
      const response = await fetch(
        "/api/programs/entrepreneurship/business-development",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(storyData),
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || errorData.message || `Failed to create success story: ${response.status}`);
      }
      
      const newItem = await response.json();
      setSuccessStories([
        ...successStories,
        {
          ...newStory,
          id: newItem.id,
        },
      ]);
      setNewStory({
        businessName: "",
        licenseStatus: "Licensed",
        category: "",
        categoryColor: "blue",
        contactPerson: "",
        phone: "",
        email: "",
      });
      setIsAddStoryOpen(false);
    } catch (error: any) {
      console.error("Failed to add success story:", error);
      alert(error.message || "Failed to add success story. Please try again.");
    }
  };

  const updateSuccessStory = async () => {
    if (editingStory) {
      try {
        const storyData = {
          name: editingStory.businessName,
          licenseStatus: editingStory.licenseStatus,
          category: editingStory.category,
          categoryColor: editingStory.categoryColor,
          contactPerson: editingStory.contactPerson,
          phone: editingStory.phone,
          email: editingStory.email || "",
        };
        const response = await fetch(
          `/api/programs/entrepreneurship/business-development/${editingStory.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(storyData),
          }
        );
        if (response.ok) {
          const updated = await response.json();
          setSuccessStories(
            successStories.map((s) =>
              s.id === editingStory.id
                ? {
                    id: updated.id,
                    businessName: updated.name || editingStory.businessName,
                    licenseStatus:
                      updated.licenseStatus || editingStory.licenseStatus,
                    category: updated.category || editingStory.category,
                    categoryColor:
                      updated.categoryColor || editingStory.categoryColor,
                    contactPerson:
                      updated.contactPerson || editingStory.contactPerson,
                    phone: updated.phone || editingStory.phone,
                    email: updated.email || editingStory.email || "",
                  }
                : s
            )
          );
          setEditingStory(null);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update");
        }
      } catch (error: any) {
        console.error("Failed to update success story:", error);
        alert(
          error.message || "Failed to update success story. Please try again."
        );
      }
    }
  };

  const deleteSuccessStory = async (id: string) => {
    try {
      const response = await fetch(
        `/api/programs/entrepreneurship/business-development/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setSuccessStories(successStories.filter((s) => s.id !== id));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete success story");
      }
    } catch (error: any) {
      console.error("Failed to delete success story:", error);
      alert(
        error.message || "Failed to delete success story. Please try again."
      );
    }
  };

  // ===== Service Items CRUD =====
  const addServiceItem = async () => {
    try {
      const response = await fetch(
        "/api/programs/entrepreneurship/business-development/service-items",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newService),
        }
      );
      if (response.ok) {
        const serviceItem = await response.json();
        setServiceItems([...serviceItems, serviceItem]);
        setNewService({
          name: "",
          description: "",
          icon: "target",
          capabilities: [],
          order: 0,
        });
        setIsAddServiceOpen(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create service item");
      }
    } catch (error: any) {
      console.error("Failed to create service item:", error);
      alert(
        error.message || "Failed to create service item. Please try again."
      );
    }
  };

  const updateServiceItem = async (service: ServiceItem) => {
    // Prevent duplicate updates
    if (isUpdatingRef.current[service.id]) {
      return;
    }

    isUpdatingRef.current[service.id] = true;

    try {
      // Ensure capabilities is a clean array of plain strings (not nested, not JSON strings)
      let cleanCapabilities: string[] = [];

      if (Array.isArray(service.capabilities)) {
        cleanCapabilities = service.capabilities
          .flatMap((cap: any) => {
            // If cap is a string that looks like JSON, try to parse it recursively
            if (typeof cap === "string" && cap.trim().startsWith("[")) {
              try {
                const parsed = JSON.parse(cap);
                if (Array.isArray(parsed)) {
                  // Recursively flatten nested arrays
                  return parsed.flatMap((p: any) =>
                    typeof p === "string" ? p : String(p)
                  );
                }
                return [String(cap)];
              } catch {
                // Not valid JSON, return as is
                return [String(cap)];
              }
            }
            return [String(cap)];
          })
          .filter((cap: string) => cap.trim());
      }

      const serviceToSave = {
        ...service,
        capabilities: cleanCapabilities,
      };

      const response = await fetch(
        `/api/programs/entrepreneurship/business-development/service-items/${service.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(serviceToSave),
        }
      );
      if (response.ok) {
        const updated = await response.json();
        // Normalize the response the same way we normalize on load
        let normalizedCapabilities: string[] = [];
        if (Array.isArray(updated.capabilities)) {
          normalizedCapabilities = updated.capabilities
            .flatMap((cap: any) => {
              if (typeof cap === "string" && cap.trim().startsWith("[")) {
                try {
                  const parsed = JSON.parse(cap);
                  return Array.isArray(parsed)
                    ? parsed.map(String)
                    : [String(cap)];
                } catch {
                  return [String(cap)];
                }
              }
              return [String(cap)];
            })
            .filter((cap: string) => cap.trim());
        }
        const normalizedUpdated = {
          ...updated,
          capabilities: normalizedCapabilities,
        };
        setServiceItems(
          serviceItems.map((s) => (s.id === service.id ? normalizedUpdated : s))
        );
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update service item");
      }
    } catch (error: any) {
      console.error("Failed to update service item:", error);
      alert(
        error.message || "Failed to update service item. Please try again."
      );
    } finally {
      // Clear the flag after a short delay to allow for legitimate updates
      setTimeout(() => {
        isUpdatingRef.current[service.id] = false;
      }, 1000);
    }
  };

  const deleteServiceItem = async (id: string) => {
    try {
      const response = await fetch(
        `/api/programs/entrepreneurship/business-development/service-items/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setServiceItems(serviceItems.filter((s) => s.id !== id));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete service item");
      }
    } catch (error: any) {
      console.error("Failed to delete service item:", error);
      alert(
        error.message || "Failed to delete service item. Please try again."
      );
    }
  };

  const getCategoryColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      teal: "bg-teal-100 text-teal-700",
      purple: "bg-purple-100 text-purple-700",
      orange: "bg-orange-100 text-orange-700",
      red: "bg-red-100 text-red-700",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div>
      <div className="flex items-center gap-2 px-6 pt-6">
        <Link
          href="/admin/programs/entrepreneurship"
          className="flex items-center gap-2 text-[#367375] hover:text-[#24C3BC] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to Entrepreneurship</span>
        </Link>
      </div>
      <AdminHeader
        title="Business Development Services"
        description="Manage BDS content, statistics, funding partners, and success stories"
      />
      <div className="p-6 max-w-7xl">
        <div className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Main banner with badge, title, description, and image
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-badge">Badge Text</Label>
                <Input
                  id="hero-badge"
                  value={heroSection.badge}
                  onChange={(e) =>
                    setHeroSection({ ...heroSection, badge: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={heroSection.title}
                  onChange={(e) =>
                    setHeroSection({ ...heroSection, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  rows={3}
                  value={heroSection.description}
                  onChange={(e) =>
                    setHeroSection({
                      ...heroSection,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Statistics Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Statistical Information</CardTitle>
                  <CardDescription>
                    Key metrics and achievements
                  </CardDescription>
                </div>
                <Dialog open={isAddStatOpen} onOpenChange={setIsAddStatOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Stat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Statistical Card</DialogTitle>
                      <DialogDescription>
                        Add a new statistic to showcase your impact
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                          value={newStat.icon}
                          onValueChange={(value) =>
                            setNewStat({ ...newStat, icon: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rocket">Rocket</SelectItem>
                            <SelectItem value="trending">
                              Trending Up
                            </SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="dollar">Dollar Sign</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          placeholder="e.g., 50+, 85%, 200+"
                          value={newStat.value}
                          onChange={(e) =>
                            setNewStat({ ...newStat, value: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          placeholder="e.g., Startups Incubated"
                          value={newStat.label}
                          onChange={(e) =>
                            setNewStat({ ...newStat, label: e.target.value })
                          }
                        />
                      </div>
                      <Button
                        onClick={addStat}
                        className="w-full bg-[#00BFA6] hover:bg-[#00A693]"
                      >
                        Add Statistic
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                  const IconComponent =
                    iconMap[stat.icon as keyof typeof iconMap];
                  return (
                    <Card key={stat.id} className="relative group">
                      <CardContent className="pt-6 text-center">
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#00BFA6] flex items-center justify-center">
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-[#00BFA6] mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deleteStat(stat.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Funding Partners & Donors Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Funding Partners & Donors</CardTitle>
                  <CardDescription>
                    Manage funding partners and their contributions
                  </CardDescription>
                </div>
                <Dialog
                  open={isAddPartnerOpen}
                  onOpenChange={setIsAddPartnerOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Partner
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Funding Partner</DialogTitle>
                      <DialogDescription>
                        Add a new funding partner or donor
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2">
                        <Label>Partner Logo/Image</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePartnerImageUpload(e, true)}
                            className="hidden"
                            id="partner-image-input"
                          />
                          <label
                            htmlFor="partner-image-input"
                            className="cursor-pointer block"
                          >
                            {newPartner.image || newPartner.imagePreview ? (
                              <div className="space-y-2">
                                <img
                                  src={
                                    newPartner.imagePreview ||
                                    (typeof newPartner.image === "string"
                                      ? newPartner.image
                                      : "/placeholder.svg")
                                  }
                                  alt="Partner preview"
                                  className="w-full h-32 object-contain rounded"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    document
                                      .getElementById("partner-image-input")
                                      ?.click();
                                  }}
                                >
                                  Change Image
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                  Click to upload partner logo
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    document
                                      .getElementById("partner-image-input")
                                      ?.click();
                                  }}
                                >
                                  Select Image
                                </Button>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Partner Name</Label>
                        <Input
                          placeholder="e.g., World Bank"
                          value={newPartner.title}
                          onChange={(e) =>
                            setNewPartner({
                              ...newPartner,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contribution Amount</Label>
                        <Input
                          placeholder="e.g., $2.5M"
                          value={newPartner.contribution}
                          onChange={(e) =>
                            setNewPartner({
                              ...newPartner,
                              contribution: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contribution Description</Label>
                        <Textarea
                          placeholder="e.g., Infrastructure and program development funding"
                          rows={2}
                          value={newPartner.contributionDescription}
                          onChange={(e) =>
                            setNewPartner({
                              ...newPartner,
                              contributionDescription: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Focus Area</Label>
                        <Textarea
                          placeholder="e.g., Education infrastructure & Capacity Building"
                          rows={2}
                          value={newPartner.focusArea}
                          onChange={(e) =>
                            setNewPartner({
                              ...newPartner,
                              focusArea: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Partner Since (Year)</Label>
                          <Input
                            placeholder="e.g., 2018"
                            value={newPartner.partnerSince}
                            onChange={(e) =>
                              setNewPartner({
                                ...newPartner,
                                partnerSince: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>People Impacted</Label>
                          <Input
                            placeholder="e.g., 5,000+ students"
                            value={newPartner.peopleImpacted}
                            onChange={(e) =>
                              setNewPartner({
                                ...newPartner,
                                peopleImpacted: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <Button
                        onClick={addFundingPartner}
                        className="w-full bg-[#00BFA6] hover:bg-[#00A693]"
                      >
                        Add Funding Partner
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fundingPartners.map((partner) => (
                  <Card
                    key={partner.id}
                    className="relative group overflow-hidden"
                  >
                    {partner.image && (
                      <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
                        <img
                          src={partner.image || "/placeholder.svg"}
                          alt={partner.title}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                    )}
                    <CardContent
                      className={`${partner.image ? "pt-4" : "pt-6"}`}
                    >
                      <h3 className="font-semibold text-lg mb-2">
                        {partner.title}
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="font-medium text-[#00BFA6]">
                            {partner.contribution}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {partner.contributionDescription}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Focus Area</p>
                          <p className="text-muted-foreground text-xs">
                            {partner.focusArea}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Partner Since
                            </p>
                            <p className="font-semibold">
                              {partner.partnerSince}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              People Impacted
                            </p>
                            <p className="font-semibold text-xs">
                              {partner.peopleImpacted}
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteFundingPartner(partner.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Success Stories Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Success Stories</CardTitle>
                  <CardDescription>
                    Showcase businesses supported through your program
                  </CardDescription>
                </div>
                <Dialog open={isAddStoryOpen} onOpenChange={setIsAddStoryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Success Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Success Story</DialogTitle>
                      <DialogDescription>
                        Add a new business success story
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2">
                        <Label>Business Name</Label>
                        <Input
                          placeholder="Enter business name"
                          value={newStory.businessName}
                          onChange={(e) =>
                            setNewStory({
                              ...newStory,
                              businessName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>License Status</Label>
                        <Select
                          value={newStory.licenseStatus}
                          onValueChange={(value) =>
                            setNewStory({ ...newStory, licenseStatus: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Licensed">Licensed</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input
                            placeholder="e.g., Manufacturing"
                            value={newStory.category}
                            onChange={(e) =>
                              setNewStory({
                                ...newStory,
                                category: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category Color</Label>
                          <Select
                            value={newStory.categoryColor}
                            onValueChange={(value) =>
                              setNewStory({ ...newStory, categoryColor: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="green">Green</SelectItem>
                              <SelectItem value="teal">Teal</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                              <SelectItem value="red">Red</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Person</Label>
                        <Input
                          placeholder="Enter contact person name"
                          value={newStory.contactPerson}
                          onChange={(e) =>
                            setNewStory({
                              ...newStory,
                              contactPerson: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input
                          placeholder="+251 XX XXX XXXX"
                          value={newStory.phone}
                          onChange={(e) =>
                            setNewStory({ ...newStory, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email (Optional)</Label>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          value={newStory.email}
                          onChange={(e) =>
                            setNewStory({ ...newStory, email: e.target.value })
                          }
                        />
                      </div>
                      <Button
                        onClick={addSuccessStory}
                        className="w-full bg-[#00BFA6] hover:bg-[#00A693]"
                      >
                        Add Success Story
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {successStories.map((story) => (
                  <Card key={story.id} className="relative group">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-full bg-[#00BFA6] flex items-center justify-center shrink-0">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-700">
                          {story.licenseStatus}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm mb-3 line-clamp-2">
                        {story.businessName}
                      </h3>
                      <div className="mb-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getCategoryColorClass(
                            story.categoryColor
                          )}`}
                        >
                          {story.category}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 shrink-0" />
                          <span className="truncate">
                            {story.contactPerson}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 shrink-0" />
                          <span className="truncate">{story.phone}</span>
                        </div>
                        {story.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="truncate">{story.email}</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <Dialog
                          open={isEditStoryOpen}
                          onOpenChange={setIsEditStoryOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingStory(story);
                                setIsEditStoryOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Success Story</DialogTitle>
                            </DialogHeader>
                            {editingStory && (
                              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-2">
                                  <Label>Business Name</Label>
                                  <Input
                                    value={editingStory.businessName}
                                    onChange={(e) =>
                                      setEditingStory({
                                        ...editingStory,
                                        businessName: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>License Status</Label>
                                  <Select
                                    value={editingStory.licenseStatus}
                                    onValueChange={(value) =>
                                      setEditingStory({
                                        ...editingStory,
                                        licenseStatus: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Licensed">
                                        Licensed
                                      </SelectItem>
                                      <SelectItem value="Pending">
                                        Pending
                                      </SelectItem>
                                      <SelectItem value="In Progress">
                                        In Progress
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Input
                                      value={editingStory.category}
                                      onChange={(e) =>
                                        setEditingStory({
                                          ...editingStory,
                                          category: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Category Color</Label>
                                    <Select
                                      value={editingStory.categoryColor}
                                      onValueChange={(value) =>
                                        setEditingStory({
                                          ...editingStory,
                                          categoryColor: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="blue">
                                          Blue
                                        </SelectItem>
                                        <SelectItem value="green">
                                          Green
                                        </SelectItem>
                                        <SelectItem value="teal">
                                          Teal
                                        </SelectItem>
                                        <SelectItem value="purple">
                                          Purple
                                        </SelectItem>
                                        <SelectItem value="orange">
                                          Orange
                                        </SelectItem>
                                        <SelectItem value="red">Red</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label>Contact Person</Label>
                                  <Input
                                    value={editingStory.contactPerson}
                                    onChange={(e) =>
                                      setEditingStory({
                                        ...editingStory,
                                        contactPerson: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Phone Number</Label>
                                  <Input
                                    value={editingStory.phone}
                                    onChange={(e) =>
                                      setEditingStory({
                                        ...editingStory,
                                        phone: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Email (Optional)</Label>
                                  <Input
                                    type="email"
                                    value={editingStory.email}
                                    onChange={(e) =>
                                      setEditingStory({
                                        ...editingStory,
                                        email: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <Button
                                  onClick={async () => {
                                    await updateSuccessStory();
                                    setIsEditStoryOpen(false);
                                  }}
                                  className="w-full bg-[#00BFA6] hover:bg-[#00A693]"
                                >
                                  Update Success Story
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSuccessStory(story.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>
                    Manage the services offered through Business Development
                    Services
                  </CardDescription>
                </div>
                <Dialog
                  open={isAddServiceOpen}
                  onOpenChange={setIsAddServiceOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Service</DialogTitle>
                      <DialogDescription>
                        Add a new service to the Business Development Services
                        program
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2">
                        <Label>Service Name</Label>
                        <Input
                          placeholder="e.g., Market Research & Analysis"
                          value={newService.name}
                          onChange={(e) =>
                            setNewService({
                              ...newService,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          placeholder="Describe the service..."
                          rows={3}
                          value={newService.description}
                          onChange={(e) =>
                            setNewService({
                              ...newService,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                          value={newService.icon}
                          onValueChange={(value) =>
                            setNewService({ ...newService, icon: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="target">Target</SelectItem>
                            <SelectItem value="book-open">Book Open</SelectItem>
                            <SelectItem value="users">Users</SelectItem>
                            <SelectItem value="line-chart">
                              Line Chart
                            </SelectItem>
                            <SelectItem value="trending-up">
                              Trending Up
                            </SelectItem>
                            <SelectItem value="handshake">Handshake</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Capabilities (one per line)</Label>
                        <Textarea
                          placeholder="Market trend analysis&#10;Customer assessment&#10;Competitive mapping"
                          rows={4}
                          value={
                            Array.isArray(newService.capabilities)
                              ? newService.capabilities.join("\n")
                              : ""
                          }
                          onChange={(e) =>
                            setNewService({
                              ...newService,
                              capabilities: e.target.value.split("\n"),
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.stopPropagation();
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Order (for display)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={newService.order}
                          onChange={(e) =>
                            setNewService({
                              ...newService,
                              order: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <Button onClick={addServiceItem} className="w-full">
                        Add Service
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {serviceItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>
                    No services added yet. Click "Add Service" to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceItems.map((service) => (
                    <Card key={service.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <Label>Service Name</Label>
                                <Input
                                  value={service.name}
                                  onChange={(e) => {
                                    setServiceItems(
                                      serviceItems.map((s) =>
                                        s.id === service.id
                                          ? { ...s, name: e.target.value }
                                          : s
                                      )
                                    );
                                  }}
                                  onBlur={(e) => {
                                    // Only update if the value actually changed
                                    const currentValue = e.target.value;
                                    if (currentValue !== service.name) {
                                      const updatedService = serviceItems.find(
                                        (s) => s.id === service.id
                                      );
                                      if (updatedService) {
                                        updateServiceItem(updatedService);
                                      }
                                    }
                                  }}
                                />
                              </div>
                              <div>
                                <Label>Icon</Label>
                                <Select
                                  value={service.icon}
                                  onValueChange={(value) => {
                                    // Only update if icon actually changed
                                    if (value !== service.icon) {
                                      setServiceItems(
                                        serviceItems.map((s) =>
                                          s.id === service.id
                                            ? { ...s, icon: value }
                                            : s
                                        )
                                      );
                                      const updatedService = {
                                        ...service,
                                        icon: value,
                                      };
                                      updateServiceItem(updatedService);
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="target">
                                      Target
                                    </SelectItem>
                                    <SelectItem value="book-open">
                                      Book Open
                                    </SelectItem>
                                    <SelectItem value="users">Users</SelectItem>
                                    <SelectItem value="line-chart">
                                      Line Chart
                                    </SelectItem>
                                    <SelectItem value="trending-up">
                                      Trending Up
                                    </SelectItem>
                                    <SelectItem value="handshake">
                                      Handshake
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                rows={2}
                                value={service.description}
                                onChange={(e) => {
                                  setServiceItems(
                                    serviceItems.map((s) =>
                                      s.id === service.id
                                        ? { ...s, description: e.target.value }
                                        : s
                                    )
                                  );
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.stopPropagation();
                                  }
                                }}
                                onBlur={(e) => {
                                  // Only update if the value actually changed
                                  const currentValue = e.target.value;
                                  if (currentValue !== service.description) {
                                    const updatedService = serviceItems.find(
                                      (s) => s.id === service.id
                                    );
                                    if (updatedService) {
                                      updateServiceItem(updatedService);
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <Label>Capabilities (one per line)</Label>
                              <Textarea
                                rows={3}
                                value={(() => {
                                  // Get capabilities as a clean array of strings
                                  if (!Array.isArray(service.capabilities)) {
                                    return "";
                                  }

                                  // Flatten any nested JSON strings
                                  const cleanCapabilities = service.capabilities
                                    .flatMap((cap: any) => {
                                      if (
                                        typeof cap === "string" &&
                                        cap.trim().startsWith("[")
                                      ) {
                                        try {
                                          const parsed = JSON.parse(cap);
                                          if (Array.isArray(parsed)) {
                                            return parsed.map(String);
                                          }
                                          return [String(cap)];
                                        } catch {
                                          return [String(cap)];
                                        }
                                      }
                                      return [String(cap)];
                                    })
                                    .filter((cap: string) => cap.trim());

                                  return cleanCapabilities.join("\n");
                                })()}
                                onChange={(e) => {
                                  setServiceItems(
                                    serviceItems.map((s) =>
                                      s.id === service.id
                                        ? {
                                            ...s,
                                            capabilities:
                                              e.target.value.split("\n"),
                                          }
                                        : s
                                    )
                                  );
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.stopPropagation();
                                  }
                                }}
                                onBlur={(e) => {
                                  // Only update if the value actually changed
                                  const currentValue = e.target.value;

                                  // Get current capabilities as a clean array of strings
                                  let currentCapabilitiesArray: string[] = [];
                                  if (Array.isArray(service.capabilities)) {
                                    currentCapabilitiesArray =
                                      service.capabilities
                                        .flatMap((cap: any) => {
                                          if (
                                            typeof cap === "string" &&
                                            cap.trim().startsWith("[")
                                          ) {
                                            try {
                                              const parsed = JSON.parse(cap);
                                              return Array.isArray(parsed)
                                                ? parsed.map(String)
                                                : [String(cap)];
                                            } catch {
                                              return [String(cap)];
                                            }
                                          }
                                          return [String(cap)];
                                        })
                                        .filter((cap: string) => cap.trim());
                                  }

                                  const currentCapabilitiesString =
                                    currentCapabilitiesArray.join("\n");
                                  const newCapabilitiesArray = currentValue
                                    .split("\n")
                                    .filter((line: string) => line.trim());
                                  const newCapabilitiesString =
                                    newCapabilitiesArray.join("\n");

                                  // Only save if the value is actually different
                                  if (
                                    newCapabilitiesString !==
                                    currentCapabilitiesString
                                  ) {
                                    const updatedService = serviceItems.find(
                                      (s) => s.id === service.id
                                    );
                                    if (updatedService) {
                                      const filteredService = {
                                        ...updatedService,
                                        capabilities: newCapabilitiesArray,
                                      };
                                      updateServiceItem(filteredService);
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteServiceItem(service.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
