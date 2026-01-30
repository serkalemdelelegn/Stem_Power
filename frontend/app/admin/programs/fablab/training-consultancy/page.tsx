"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
  Save,
  Plus,
  Trash2,
  Edit,
  Users,
  MapPin,
  Lightbulb,
  Search,
  ArrowLeft,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { backendApi } from "@/lib/backend-api";

interface Stat {
  id: string;
  icon: string;
  value: string;
  label: string;
}

interface Offering {
  id: string;
  title: string;
  description: string;
  image: string | File | null;
  features: string[];
  outcomes: string[];
}

type OfferingFormState = Offering & {
  featuresText: string;
  outcomesText: string;
  imagePreview?: string;
};

interface Partner {
  id: string;
  name: string;
  logo: string | File | null;
  logoPreview?: string;
}

interface ConsultancyServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  deliverables: string[];
}

type ConsultancyServiceFormState = ConsultancyServiceItem & {
  deliverablesText: string;
};

interface PartnershipTypeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  image: string | File | null;
  benefits: string[];
}

type PartnershipTypeFormState = PartnershipTypeItem & {
  benefitsText: string;
  imagePreview?: string;
};

interface SuccessMetricItem {
  id: string;
  metric: string;
  label: string;
  icon: string;
}

export default function TrainingConsultancyPage() {
  const [isSaving, setIsSaving] = useState(false);

  const [isStatDialogOpen, setIsStatDialogOpen] = useState(false);
  const [isOfferingDialogOpen, setIsOfferingDialogOpen] = useState(false);
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [editingOffering, setEditingOffering] =
    useState<OfferingFormState | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  // Hero Banner Data
  const [heroData, setHeroData] = useState({
    badge: "",
    title: "",
    description: "",
  });

  // Statistics Data
  const [stats, setStats] = useState<Stat[]>([]);

  // What We Offer Data
  const [offerings, setOfferings] = useState<Offering[]>([]);

  // Trusted Partners Data
  const [partnersSection, setPartnersSection] = useState({
    title: "",
    description: "",
  });

  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [heroId, setHeroId] = useState<string | null>(null);

  // Consultancy Services & Partnership Types
  const [services, setServices] = useState<ConsultancyServiceItem[]>([]);
  const [partnershipTypes, setPartnershipTypes] = useState<
    PartnershipTypeItem[]
  >([]);

  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isPartnershipDialogOpen, setIsPartnershipDialogOpen] = useState(false);
  const [isSuccessMetricDialogOpen, setIsSuccessMetricDialogOpen] = useState(false);
  const [editingService, setEditingService] =
    useState<ConsultancyServiceFormState | null>(null);
  const [editingPartnership, setEditingPartnership] =
    useState<PartnershipTypeFormState | null>(null);
  const [successMetrics, setSuccessMetrics] = useState<SuccessMetricItem[]>([]);
  const [editingSuccessMetric, setEditingSuccessMetric] = useState<SuccessMetricItem | null>(null);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      const [
        heroArray,
        statsData,
        offeringsData,
        partnersData,
        partnersSectionData,
        servicesData,
        partnershipTypesData,
        successMetricsData,
      ] = await Promise.all([
        backendApi.get("/api/training-consultancy/hero"),
        backendApi.get("/api/training-consultancy/stats"),
        backendApi.get("/api/training-consultancy/programs"),
        backendApi.get("/api/training-consultancy/partners"),
        backendApi.get("/api/training-consultancy/partners-section"),
        backendApi.get("/api/training-consultancy/consultancy-services"),
        backendApi.get("/api/training-consultancy/partnership-types"),
        backendApi.get("/api/training-consultancy/success-metrics"),
      ]);

      const latestHero =
        Array.isArray(heroArray) && heroArray.length ? heroArray[0] : null;

      setHeroData({
        badge: latestHero?.badge ?? "",
        title: latestHero?.title ?? "",
        description: latestHero?.description ?? "",
      });
      setHeroId(latestHero?.id ?? null);

      // Transform backend stats (title) to frontend format (label)
      const transformedStats = Array.isArray(statsData)
        ? statsData.map((stat: any) => ({
            id: String(stat.id),
            icon: stat.icon || "users",
            value: stat.value || "",
            label: stat.title || "",
          }))
        : [];
      setStats(transformedStats);
      setOfferings(Array.isArray(offeringsData) ? offeringsData : []);
      setPartners(Array.isArray(partnersData) ? partnersData : []);
      setPartnersSection({
        title: partnersSectionData?.title ?? "",
        description: partnersSectionData?.description ?? "",
      });
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setPartnershipTypes(
        Array.isArray(partnershipTypesData) ? partnershipTypesData : []
      );
      setSuccessMetrics(Array.isArray(successMetricsData) ? successMetricsData.map((m: any) => ({
        id: String(m.id),
        metric: m.metric || "",
        label: m.label || "",
        icon: m.icon || "trendingup",
      })) : []);
      setLoadError(null);
    } catch (error) {
      console.error("[Admin TrainingConsultancy] Failed to load data", error);
      setLoadError(
        "Unable to load the latest content. Showing defaults where available."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const heroPayload = {
        badge: heroData.badge,
        title: heroData.title,
        description: heroData.description,
      };

      const savedHero = heroId
        ? await backendApi.put(
            `/api/training-consultancy/hero/${heroId}`,
            heroPayload
          )
        : await backendApi.post("/api/training-consultancy/hero", heroPayload);

      setHeroId(savedHero?.id ?? heroId);

      await backendApi.post(
        "/api/training-consultancy/partners-section",
        partnersSection
      );

      alert("Training & Consultancy page updated successfully!");
    } catch (error) {
      console.error("[v0] Error saving:", error);
      alert("Error saving page. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Consultancy Services CRUD
  const addService = () => {
    const newService: ConsultancyServiceFormState = {
      id: "",
      title: "",
      description: "",
      icon: "bookopen",
      deliverables: [],
      deliverablesText: "",
    };
    setEditingService(newService);
    setIsServiceDialogOpen(true);
  };

  const editService = (service: ConsultancyServiceItem) => {
    setEditingService({
      ...service,
      deliverablesText: (service.deliverables || []).join("\n"),
    });
    setIsServiceDialogOpen(true);
  };

  const saveService = async () => {
    if (!editingService) return;
    const deliverables = parseListInput(editingService.deliverablesText);
    const payload = {
      title: editingService.title,
      description: editingService.description,
      icon: editingService.icon,
      deliverables,
    };
    try {
      const exists =
        editingService.id && services.find((s) => s.id === editingService.id);
      if (exists) {
        const updated = await backendApi.put(
          `/api/training-consultancy/consultancy-services/${editingService.id}`,
          payload
        );
        setServices(services.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await backendApi.post(
          `/api/training-consultancy/consultancy-services`,
          payload
        );
        setServices([...services, created]);
      }
      setIsServiceDialogOpen(false);
      setEditingService(null);
    } catch (error: any) {
      console.error("[Training Consultancy] Error saving service:", error);
      alert(error.message || "Error saving service. Please try again.");
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this consultancy service?")) return;
    try {
      await backendApi.delete(
        `/api/training-consultancy/consultancy-services/${id}`
      );
      setServices(services.filter((s) => s.id !== id));
    } catch (error: any) {
      console.error("[Training Consultancy] Error deleting service:", error);
      alert(error.message || "Error deleting service. Please try again.");
    }
  };

  // Partnership Types CRUD
  const addPartnershipType = () => {
    const newType: PartnershipTypeFormState = {
      id: "",
      title: "",
      description: "",
      icon: "school",
      image: "",
      benefits: [],
      benefitsText: "",
    };
    setEditingPartnership(newType);
    setIsPartnershipDialogOpen(true);
  };

  const editPartnershipType = (item: PartnershipTypeItem) => {
    setEditingPartnership({
      ...item,
      benefitsText: (item.benefits || []).join("\n"),
    });
    setIsPartnershipDialogOpen(true);
  };

  const savePartnershipType = async () => {
    if (!editingPartnership) return;
    
    // Validate required fields
    if (!editingPartnership.title || editingPartnership.title.trim() === "") {
      alert("Title is required");
      return;
    }
    if (!editingPartnership.description || editingPartnership.description.trim() === "") {
      alert("Description is required");
      return;
    }
    
    const benefits = parseListInput(editingPartnership.benefitsText);
    const isFile = editingPartnership.image instanceof File;
    
    try {
      const exists =
        editingPartnership.id &&
        partnershipTypes.find((p) => p.id === editingPartnership.id);
      
      if (isFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("file", editingPartnership.image as File);
        formData.append("title", editingPartnership.title.trim());
        formData.append("description", editingPartnership.description.trim());
        formData.append("icon", editingPartnership.icon || "school");
        formData.append("benefits", JSON.stringify(benefits));
        
        if (exists) {
          const updated = await backendApi.putFormData(
            `/api/training-consultancy/partnership-types/${editingPartnership.id}`,
            formData
          );
          setPartnershipTypes(
            partnershipTypes.map((p) => (p.id === updated.id ? updated : p))
          );
        } else {
          const created = await backendApi.postFormData(
            `/api/training-consultancy/partnership-types`,
            formData
          );
          setPartnershipTypes([...partnershipTypes, created]);
        }
      } else {
        // Use JSON for URL or null
        const payload = {
          title: editingPartnership.title.trim(),
          description: editingPartnership.description.trim(),
          icon: editingPartnership.icon || "school",
          image: editingPartnership.image || null,
          benefits,
        };
        
        if (exists) {
          const updated = await backendApi.put(
            `/api/training-consultancy/partnership-types/${editingPartnership.id}`,
            payload
          );
          setPartnershipTypes(
            partnershipTypes.map((p) => (p.id === updated.id ? updated : p))
          );
        } else {
          const created = await backendApi.post(
            `/api/training-consultancy/partnership-types`,
            payload
          );
          setPartnershipTypes([...partnershipTypes, created]);
        }
      }
      
      // Clean up preview URL if it exists
      if (editingPartnership.imagePreview) {
        URL.revokeObjectURL(editingPartnership.imagePreview);
      }
      
      setIsPartnershipDialogOpen(false);
      setEditingPartnership(null);
    } catch (error: any) {
      console.error(
        "[Training Consultancy] Error saving partnership type:",
        error
      );
      alert(
        error.message || "Error saving partnership type. Please try again."
      );
    }
  };

  const deletePartnershipType = async (id: string) => {
    if (!confirm("Delete this partnership type?")) return;
    try {
      await backendApi.delete(
        `/api/training-consultancy/partnership-types/${id}`
      );
      setPartnershipTypes(partnershipTypes.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error(
        "[Training Consultancy] Error deleting partnership type:",
        error
      );
      alert(
        error.message || "Error deleting partnership type. Please try again."
      );
    }
  };

  const addSuccessMetric = () => {
    const newMetric: SuccessMetricItem = { id: "", metric: "", label: "", icon: "trendingup" };
    setEditingSuccessMetric(newMetric);
    setIsSuccessMetricDialogOpen(true);
  };

  const editSuccessMetric = (metric: SuccessMetricItem) => {
    setEditingSuccessMetric({ ...metric });
    setIsSuccessMetricDialogOpen(true);
  };

  const saveSuccessMetric = async () => {
    if (!editingSuccessMetric) return;

    // Validate required fields
    if (!editingSuccessMetric.metric || editingSuccessMetric.metric.trim() === "") {
      alert("Metric value is required");
      return;
    }
    if (!editingSuccessMetric.label || editingSuccessMetric.label.trim() === "") {
      alert("Label is required");
      return;
    }

    try {
      const backendData = {
        metric: editingSuccessMetric.metric.trim(),
        label: editingSuccessMetric.label.trim(),
        icon: editingSuccessMetric.icon || "trendingup",
      };

      const existing =
        editingSuccessMetric.id &&
        editingSuccessMetric.id !== "" &&
        successMetrics.find((m) => m.id === editingSuccessMetric.id);
      
      if (existing) {
        // Update existing metric
        const updated = await backendApi.put(
          `/api/training-consultancy/success-metrics/${editingSuccessMetric.id}`,
          backendData
        );
        setSuccessMetrics(
          successMetrics.map((m) =>
            m.id === String(updated.id)
              ? {
                  id: String(updated.id),
                  metric: updated.metric || "",
                  label: updated.label || "",
                  icon: updated.icon || "trendingup",
                }
              : m
          )
        );
        setIsSuccessMetricDialogOpen(false);
        setEditingSuccessMetric(null);
      } else {
        // Create new metric
        const created = await backendApi.post(
          `/api/training-consultancy/success-metrics`,
          backendData
        );
        setSuccessMetrics([
          ...successMetrics,
          {
            id: String(created.id),
            metric: created.metric || "",
            label: created.label || "",
            icon: created.icon || "trendingup",
          },
        ]);
        setIsSuccessMetricDialogOpen(false);
        setEditingSuccessMetric(null);
      }
    } catch (error: any) {
      console.error("[Training Consultancy] Error saving success metric:", error);
      alert(error.message || "Error saving success metric. Please try again.");
    }
  };

  const deleteSuccessMetric = async (id: string) => {
    if (!confirm("Delete this success metric?")) return;
    try {
      await backendApi.delete(`/api/training-consultancy/success-metrics/${id}`);
      setSuccessMetrics(successMetrics.filter((m) => m.id !== id));
    } catch (error: any) {
      console.error("[Training Consultancy] Error deleting success metric:", error);
      alert(error.message || "Error deleting success metric. Please try again.");
    }
  };

  const addStat = () => {
    const newStat: Stat = { id: "", icon: "users", value: "", label: "" };
    setEditingStat(newStat);
    setIsStatDialogOpen(true);
  };

  const editStat = (stat: Stat) => {
    setEditingStat({ ...stat });
    setIsStatDialogOpen(true);
  };

  const saveStat = async () => {
    if (!editingStat) return;

    // Validate required fields
    if (!editingStat.value || editingStat.value.trim() === "") {
      alert("Value is required");
      return;
    }
    if (!editingStat.label || editingStat.label.trim() === "") {
      alert("Label is required");
      return;
    }

    try {
      // Transform frontend format (label) to backend format (title)
      const backendData = {
        title: editingStat.label.trim(),
        value: editingStat.value.trim(),
        icon: editingStat.icon || null,
      };

      // Check if this is an existing stat (has a valid ID that exists in stats)
      const existing =
        editingStat.id &&
        editingStat.id !== "" &&
        stats.find((s) => s.id === editingStat.id);
      if (existing) {
        // Update existing stat
        try {
          const updated = await backendApi.put(
            `/api/training-consultancy/stats/${editingStat.id}`,
            backendData
          );
          // Transform backend response (title) to frontend format (label)
          const transformed = {
            id: String(updated.id),
            icon: updated.icon || "users",
            value: updated.value || "",
            label: updated.title || "",
          };
          setStats(stats.map((s) => (s.id === transformed.id ? transformed : s)));
          setIsStatDialogOpen(false);
          setEditingStat(null);
        } catch (err: any) {
          alert(err.message || "Failed to update stat. Please try again.");
        }
      } else {
        // Create new stat
        try {
          const created = await backendApi.post(
            `/api/training-consultancy/stats`,
            backendData
          );
          // Transform backend response (title) to frontend format (label)
          const transformed = {
            id: String(created.id),
            icon: created.icon || "users",
            value: created.value || "",
            label: created.title || "",
          };
          setStats([...stats, transformed]);
          setIsStatDialogOpen(false);
          setEditingStat(null);
        } catch (err: any) {
          alert(err.message || "Failed to create stat. Please try again.");
        }
      }
    } catch (error: any) {
      console.error("[Training Consultancy] Error saving stat:", error);
      alert(error.message || "Error saving stat. Please try again.");
    }
  };

  const deleteStat = async (id: string) => {
    if (!confirm("Are you sure you want to delete this statistic?")) return;
    try {
      await backendApi.delete(`/api/training-consultancy/stats/${id}`);
      setStats(stats.filter((s) => s.id !== id));
    } catch (error: any) {
      console.error("[Training Consultancy] Error deleting stat:", error);
      alert(error.message || "Error deleting stat. Please try again.");
    }
  };

  const parseListInput = (value: string) =>
    value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);

  const addOffering = () => {
    const newOffering: OfferingFormState = {
      id: "",
      title: "",
      description: "",
      image: "",
      features: [],
      outcomes: [],
      featuresText: "",
      outcomesText: "",
    };
    setEditingOffering(newOffering);
    setIsOfferingDialogOpen(true);
  };

  const editOffering = (offering: Offering) => {
    setEditingOffering({
      ...offering,
      featuresText: (offering.features || []).join("\n"),
      outcomesText: (offering.outcomes || []).join("\n"),
    });
    setIsOfferingDialogOpen(true);
  };

  const saveOffering = async () => {
    if (!editingOffering) return;

    const features = parseListInput(editingOffering.featuresText);
    const outcomes = parseListInput(editingOffering.outcomesText);

    try {
      // Check if this is an existing offering (has a valid ID that exists in offerings)
      const existing =
        editingOffering.id &&
        editingOffering.id !== "" &&
        offerings.find((o) => o.id === editingOffering.id);

      // Check if image is a File object
      const image = editingOffering.image;
      // More robust check: ensure it's not null, not empty string, not a string type, and is actually a File instance
      const isFileImage =
        image != null &&
        image !== "" &&
        typeof image !== "string" &&
        image instanceof File;

      if (existing) {
        // Update existing offering
        if (isFileImage) {
          // Use FormData for file upload
          const formData = new FormData();
          formData.append("file", image as File);
          formData.append("title", editingOffering.title);
          formData.append("description", editingOffering.description);
          formData.append("icon", "graduationcap"); // Default icon
          formData.append("features", JSON.stringify(features));
          formData.append("outcomes", JSON.stringify(outcomes));

          try {
            const updated = await backendApi.putFormData(
              `/api/training-consultancy/programs/${editingOffering.id}`,
              formData
            );
            setOfferings(
              offerings.map((o) => (o.id === updated.id ? updated : o))
            );
            // Clean up preview URL
            if (editingOffering.imagePreview) {
              URL.revokeObjectURL(editingOffering.imagePreview);
            }
            setIsOfferingDialogOpen(false);
            setEditingOffering(null);
          } catch (err: any) {
            alert(
              err.message || "Failed to update offering. Please try again."
            );
          }
        } else {
          // Use JSON for URL string or null
          const payload = {
            id: editingOffering.id,
            title: editingOffering.title,
            description: editingOffering.description,
            image: editingOffering.image || null,
            features,
            outcomes,
          };
          try {
            const updated = await backendApi.put(
              `/api/training-consultancy/programs/${editingOffering.id}`,
              payload
            );
            setOfferings(
              offerings.map((o) => (o.id === updated.id ? updated : o))
            );
            // Clean up preview URL
            if (editingOffering.imagePreview) {
              URL.revokeObjectURL(editingOffering.imagePreview);
            }
            setIsOfferingDialogOpen(false);
            setEditingOffering(null);
          } catch (err: any) {
            alert(
              err.message || "Failed to update offering. Please try again."
            );
          }
        }
      } else {
        // Create new offering
        if (isFileImage) {
          // Use FormData for file upload
          const formData = new FormData();
          formData.append("file", image as File);
          formData.append("title", editingOffering.title);
          formData.append("description", editingOffering.description);
          formData.append("icon", "graduationcap"); // Default icon
          formData.append("features", JSON.stringify(features));
          formData.append("outcomes", JSON.stringify(outcomes));

          try {
            const created = await backendApi.postFormData(
              `/api/training-consultancy/programs`,
              formData
            );
            setOfferings([...offerings, created]);
            // Clean up preview URL
            if (editingOffering.imagePreview) {
              URL.revokeObjectURL(editingOffering.imagePreview);
            }
            setIsOfferingDialogOpen(false);
            setEditingOffering(null);
          } catch (err: any) {
            alert(
              err.message || "Failed to create offering. Please try again."
            );
          }
        } else {
          // Use JSON for URL string or null
          const payload = {
            title: editingOffering.title,
            description: editingOffering.description,
            image: editingOffering.image || null,
            features,
            outcomes,
          };
          try {
            const created = await backendApi.post(
              `/api/training-consultancy/programs`,
              payload
            );
            setOfferings([...offerings, created]);
            // Clean up preview URL
            if (editingOffering.imagePreview) {
              URL.revokeObjectURL(editingOffering.imagePreview);
            }
            setIsOfferingDialogOpen(false);
            setEditingOffering(null);
          } catch (err: any) {
            alert(
              err.message || "Failed to create offering. Please try again."
            );
          }
        }
      }
    } catch (error: any) {
      console.error("[Training Consultancy] Error saving offering:", error);
      alert(error.message || "Error saving offering. Please try again.");
    }
  };

  const handleOfferingImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && editingOffering) {
      // Clean up old preview URL if it exists
      if (editingOffering.imagePreview) {
        URL.revokeObjectURL(editingOffering.imagePreview);
      }
      // Store the File object and create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setEditingOffering({
        ...editingOffering,
        image: file, // Store File object instead of base64
        imagePreview: previewUrl, // For preview display
      });
    }
  };

  const deleteOffering = async (id: string) => {
    if (!confirm("Are you sure you want to delete this offering?")) return;
    try {
      await backendApi.delete(`/api/training-consultancy/programs/${id}`);
      setOfferings(offerings.filter((o) => o.id !== id));
    } catch (error: any) {
      console.error("[Training Consultancy] Error deleting offering:", error);
      alert(error.message || "Error deleting offering. Please try again.");
    }
  };

  const handlePartnershipImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file && editingPartnership) {
      // Clean up old preview URL if it exists
      if (editingPartnership.imagePreview) {
        URL.revokeObjectURL(editingPartnership.imagePreview);
      }
      // Store the File object and create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setEditingPartnership({
        ...editingPartnership,
        image: file,
        imagePreview: previewUrl,
      });
    }
    if (e.target.value) {
      e.target.value = "";
    }
  };

  const clearPartnershipImage = () => {
    if (editingPartnership?.imagePreview) {
      URL.revokeObjectURL(editingPartnership.imagePreview);
    }
    if (editingPartnership) {
      setEditingPartnership({
        ...editingPartnership,
        image: null,
        imagePreview: undefined,
      });
    }
  };

  const addPartner = () => {
    const newPartner: Partner = { id: "", name: "", logo: "" };
    setEditingPartner(newPartner);
    setIsPartnerDialogOpen(true);
  };

  const editPartner = (partner: Partner) => {
    setEditingPartner({ ...partner });
    setIsPartnerDialogOpen(true);
  };

  const savePartner = async () => {
    if (!editingPartner) return;
    try {
      // Check if this is an existing partner (has a valid ID that exists in partners)
      const existing =
        editingPartner.id &&
        editingPartner.id !== "" &&
        partners.find((p) => p.id === editingPartner.id);

      // Check if logo is a File object
      const isFileLogo = editingPartner.logo instanceof File;

      if (existing) {
        // Update existing partner
        if (isFileLogo) {
          // Use FormData for file upload
          const formData = new FormData();
          formData.append("file", editingPartner.logo as File);
          formData.append("name", editingPartner.name);

          try {
            const updated = await backendApi.putFormData(
              `/api/training-consultancy/partners/${editingPartner.id}`,
              formData
            );
            setPartners(
              partners.map((p) => (p.id === updated.id ? updated : p))
            );
            // Clean up preview URL
            if (editingPartner.logoPreview) {
              URL.revokeObjectURL(editingPartner.logoPreview);
            }
            setIsPartnerDialogOpen(false);
            setEditingPartner(null);
          } catch (err: any) {
            alert(err.message || "Failed to update partner. Please try again.");
          }
        } else {
          // Use JSON for URL string or null
          const payload = {
            name: editingPartner.name,
            logo: editingPartner.logo || null,
          };
          try {
            const updated = await backendApi.put(
              `/api/training-consultancy/partners/${editingPartner.id}`,
              payload
            );
            setPartners(
              partners.map((p) => (p.id === updated.id ? updated : p))
            );
            // Clean up preview URL
            if (editingPartner.logoPreview) {
              URL.revokeObjectURL(editingPartner.logoPreview);
            }
            setIsPartnerDialogOpen(false);
            setEditingPartner(null);
          } catch (err: any) {
            alert(err.message || "Failed to update partner. Please try again.");
          }
        }
      } else {
        // Create new partner
        if (isFileLogo) {
          // Use FormData for file upload
          const formData = new FormData();
          formData.append("file", editingPartner.logo as File);
          formData.append("name", editingPartner.name);

          try {
            const created = await backendApi.postFormData(
              `/api/training-consultancy/partners`,
              formData
            );
            setPartners([...partners, created]);
            // Clean up preview URL
            if (editingPartner.logoPreview) {
              URL.revokeObjectURL(editingPartner.logoPreview);
            }
            setIsPartnerDialogOpen(false);
            setEditingPartner(null);
          } catch (err: any) {
            alert(err.message || "Failed to create partner. Please try again.");
          }
        } else {
          // Use JSON for URL string or null
          const payload = {
            name: editingPartner.name,
            logo: editingPartner.logo || null,
          };
          try {
            const created = await backendApi.post(
              `/api/training-consultancy/partners`,
              payload
            );
            setPartners([...partners, created]);
            // Clean up preview URL
            if (editingPartner.logoPreview) {
              URL.revokeObjectURL(editingPartner.logoPreview);
            }
            setIsPartnerDialogOpen(false);
            setEditingPartner(null);
          } catch (err: any) {
            alert(err.message || "Failed to create partner. Please try again.");
          }
        }
      }
    } catch (error: any) {
      console.error("[Training Consultancy] Error saving partner:", error);
      alert(error.message || "Error saving partner. Please try again.");
    }
  };

  const handlePartnerLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingPartner) {
      // Clean up old preview URL if it exists
      if (editingPartner.logoPreview) {
        URL.revokeObjectURL(editingPartner.logoPreview);
      }
      // Store the File object and create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setEditingPartner({
        ...editingPartner,
        logo: file, // Store File object instead of base64
        logoPreview: previewUrl, // For preview display
      });
    }
  };

  const deletePartner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    try {
      await backendApi.delete(`/api/training-consultancy/partners/${id}`);
      setPartners(partners.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error("[Training Consultancy] Error deleting partner:", error);
      alert(error.message || "Error deleting partner. Please try again.");
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "users":
        return <Users className="h-6 w-6" />;
      case "map-pin":
        return <MapPin className="h-6 w-6" />;
      case "lightbulb":
        return <Lightbulb className="h-6 w-6" />;
      case "search":
        return <Search className="h-6 w-6" />;
      default:
        return null;
    }
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
        title="Training & Consultancy"
        description="Manage the Training & Consultancy page content"
      />
      <div className="p-6 max-w-6xl">
        {isLoading && (
          <p className="text-sm text-muted-foreground mb-4">
            Loading training & consultancy content…
          </p>
        )}
        {!isLoading && loadError && (
          <p className="text-sm text-amber-600 mb-4">{loadError}</p>
        )}
        <div className="space-y-6">
          {/* Hero Banner Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Banner</CardTitle>
              <CardDescription>
                Main banner with title and description
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
                  placeholder="FabLab Program"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={heroData.title}
                  onChange={(e) =>
                    setHeroData({ ...heroData, title: e.target.value })
                  }
                  placeholder="STEM Training & Consultancy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  rows={3}
                  value={heroData.description}
                  onChange={(e) =>
                    setHeroData({ ...heroData, description: e.target.value })
                  }
                  placeholder="Evidence-driven programs..."
                />
                {!isLoading &&
                  heroData.badge.trim() === "" &&
                  heroData.title.trim() === "" &&
                  heroData.description.trim() === "" && (
                    <p className="text-sm text-muted-foreground">
                      No hero content added yet.
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Consultancy Services Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Consultancy Services</CardTitle>
                  <CardDescription>
                    Expert services and key deliverables
                  </CardDescription>
                </div>
                <Button
                  onClick={addService}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {services.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground">
                  No consultancy services added yet.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {services.map((service) => (
                    <Card key={service.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{service.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                              {service.description}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editService(service)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteService(service.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(service.deliverables || []).length} deliverables
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Partnership Types Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Partnership Opportunities</CardTitle>
                  <CardDescription>
                    Manage partnership types and benefits
                  </CardDescription>
                </div>
                <Button
                  onClick={addPartnershipType}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Partnership Type
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {partnershipTypes.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground">
                  No partnership types added yet.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {partnershipTypes.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                              {item.description}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editPartnershipType(item)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deletePartnershipType(item.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(item.benefits || []).length} benefits
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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
                <Button
                  onClick={addStat}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Stat
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {stats.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground">
                  No statistics added yet.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {stats.map((stat) => (
                    <Card key={stat.id}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-12 w-12 rounded-full bg-[#00BFA6] flex items-center justify-center text-white">
                            {getIconComponent(stat.icon)}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editStat(stat)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteStat(stat.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-[#00BFA6]">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Success Metrics Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Success Metrics</CardTitle>
                  <CardDescription>
                    Key success indicators and achievements
                  </CardDescription>
                </div>
                <Button
                  onClick={addSuccessMetric}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Success Metric
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {successMetrics.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground">
                  No success metrics added yet.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {successMetrics.map((metric) => (
                    <Card key={metric.id}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="h-12 w-12 rounded-full bg-[#00BFA6] flex items-center justify-center text-white">
                            {getIconComponent(metric.icon)}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => editSuccessMetric(metric)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSuccessMetric(metric.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-[#00BFA6]">
                          {metric.metric}
                        </div>
                        <div className="text-sm text-gray-600">
                          {metric.label}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* What We Offer Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>What We Offer</CardTitle>
                  <CardDescription>
                    Services and programs offered
                  </CardDescription>
                </div>
                <Button
                  onClick={addOffering}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Offering
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {offerings.length === 0 && !isLoading ? (
                <p className="text-sm text-muted-foreground">
                  No offerings added yet.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {offerings.map((offering) => (
                    <Card key={offering.id} className="overflow-hidden">
                      {(typeof offering.image === "string" ||
                        (offering as any).imagePreview) && (
                        <div className="h-48 bg-muted">
                          <img
                            src={
                              (offering as any).imagePreview ||
                              (typeof offering.image === "string"
                                ? offering.image
                                : "")
                            }
                            alt={offering.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-balance">
                            {offering.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                            {offering.description}
                          </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => editOffering(offering)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteOffering(offering.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trusted Partners Section */}
          <Card>
            <CardHeader>
              <CardTitle>Trusted by Partners</CardTitle>
              <CardDescription>Partner logos and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partners-title">Section Title</Label>
                  <Input
                    id="partners-title"
                    value={partnersSection.title}
                    onChange={(e) =>
                      setPartnersSection({
                        ...partnersSection,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partners-description">
                    Section Description
                  </Label>
                  <Textarea
                    id="partners-description"
                    rows={2}
                    value={partnersSection.description}
                    onChange={(e) =>
                      setPartnersSection({
                        ...partnersSection,
                        description: e.target.value,
                      })
                    }
                  />
                  {!isLoading &&
                    partnersSection.title.trim() === "" &&
                    partnersSection.description.trim() === "" && (
                      <p className="text-sm text-muted-foreground">
                        No partner section content added yet.
                      </p>
                    )}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <Label>Partner Logos</Label>
                  <Button
                    onClick={addPartner}
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Partner
                  </Button>
                </div>
                {partners.length === 0 && !isLoading ? (
                  <p className="text-sm text-muted-foreground">
                    No partners added yet.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {partners.map((partner) => (
                      <Card key={partner.id}>
                        <CardContent className="p-4 space-y-3">
                          <div className="h-24 bg-white border rounded-lg flex items-center justify-center">
                            {typeof partner.logo === "string" ||
                            (partner as any).logoPreview ? (
                              <img
                                src={
                                  (partner as any).logoPreview ||
                                  (typeof partner.logo === "string"
                                    ? partner.logo
                                    : "")
                                }
                                alt={partner.name}
                                className="max-h-20 max-w-full object-contain"
                              />
                            ) : (
                              <div className="text-xs text-gray-400">
                                No logo
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-medium text-center">
                            {partner.name || "Unnamed Partner"}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => editPartner(partner)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deletePartner(partner.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
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
                <Label>Icon</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingStat.icon}
                  onChange={(e) =>
                    setEditingStat({ ...editingStat, icon: e.target.value })
                  }
                >
                  <option value="users">Users</option>
                  <option value="map-pin">Map Pin</option>
                  <option value="lightbulb">Lightbulb</option>
                  <option value="search">Search</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statValue">Value</Label>
                <Input
                  id="statValue"
                  placeholder="e.g., 5000+"
                  value={editingStat.value}
                  onChange={(e) =>
                    setEditingStat({ ...editingStat, value: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statLabel">Label</Label>
                <Input
                  id="statLabel"
                  placeholder="e.g., Teachers trained"
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
                  onClick={saveStat}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Consultancy Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService?.title || "New Service"}</DialogTitle>
            <DialogDescription>Define consultancy service</DialogDescription>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serviceTitle">Title</Label>
                <Input
                  id="serviceTitle"
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceDescription">Description</Label>
                <Textarea
                  id="serviceDescription"
                  rows={3}
                  value={editingService.description}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingService.icon}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      icon: e.target.value,
                    })
                  }
                >
                  <option value="bookopen">Book Open</option>
                  <option value="wrench">Wrench</option>
                  <option value="factory">Factory</option>
                  <option value="target">Target</option>
                  <option value="lightbulb">Lightbulb</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceDeliverables">
                  Deliverables (one per line)
                </Label>
                <Textarea
                  id="serviceDeliverables"
                  rows={4}
                  value={editingService.deliverablesText}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      deliverablesText: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.stopPropagation();
                  }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsServiceDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveService}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Partnership Type Dialog */}
      <Dialog
        open={isPartnershipDialogOpen}
        onOpenChange={setIsPartnershipDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPartnership?.title || "New Partnership Type"}
            </DialogTitle>
            <DialogDescription>
              Define partnership type and benefits
            </DialogDescription>
          </DialogHeader>
          {editingPartnership && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ptTitle">Title</Label>
                <Input
                  id="ptTitle"
                  value={editingPartnership.title}
                  onChange={(e) =>
                    setEditingPartnership({
                      ...editingPartnership,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ptDescription">Description</Label>
                <Textarea
                  id="ptDescription"
                  rows={3}
                  value={editingPartnership.description}
                  onChange={(e) =>
                    setEditingPartnership({
                      ...editingPartnership,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingPartnership.icon}
                  onChange={(e) =>
                    setEditingPartnership({
                      ...editingPartnership,
                      icon: e.target.value,
                    })
                  }
                >
                  <option value="school">School</option>
                  <option value="building2">Building</option>
                  <option value="factory">Factory</option>
                  <option value="award">Award</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ptImage">Image</Label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Upload Image</span>
                    </div>
                    <input
                      id="ptImage"
                      type="file"
                      accept="image/*"
                      onChange={handlePartnershipImageUpload}
                      className="hidden"
                    />
                  </label>
                  {(editingPartnership.image || editingPartnership.imagePreview) && (
                    <div className="relative w-full rounded-lg overflow-hidden border">
                      <img
                        src={editingPartnership.imagePreview || (typeof editingPartnership.image === "string" ? editingPartnership.image : "/placeholder.svg")}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <div className="flex justify-end p-2 bg-muted/50 border-t">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearPartnershipImage}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ptBenefits">Benefits (one per line)</Label>
                <Textarea
                  id="ptBenefits"
                  rows={4}
                  value={editingPartnership.benefitsText}
                  onChange={(e) =>
                    setEditingPartnership({
                      ...editingPartnership,
                      benefitsText: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.stopPropagation();
                  }}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsPartnershipDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={savePartnershipType}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Metric Dialog */}
      <Dialog
        open={isSuccessMetricDialogOpen}
        onOpenChange={setIsSuccessMetricDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSuccessMetric?.label || "New Success Metric"}
            </DialogTitle>
            <DialogDescription>
              Add or edit success metric
            </DialogDescription>
          </DialogHeader>
          {editingSuccessMetric && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="smMetric">Metric Value</Label>
                <Input
                  id="smMetric"
                  placeholder="e.g., 95%, 80%, 50+"
                  value={editingSuccessMetric.metric}
                  onChange={(e) =>
                    setEditingSuccessMetric({
                      ...editingSuccessMetric,
                      metric: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smLabel">Label</Label>
                <Input
                  id="smLabel"
                  placeholder="e.g., Teacher Confidence Increase"
                  value={editingSuccessMetric.label}
                  onChange={(e) =>
                    setEditingSuccessMetric({
                      ...editingSuccessMetric,
                      label: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Icon</Label>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editingSuccessMetric.icon}
                  onChange={(e) =>
                    setEditingSuccessMetric({
                      ...editingSuccessMetric,
                      icon: e.target.value,
                    })
                  }
                >
                  <option value="trendingup">Trending Up</option>
                  <option value="lightbulb">Lightbulb</option>
                  <option value="award">Award</option>
                  <option value="target">Target</option>
                  <option value="users">Users</option>
                  <option value="graduationcap">Graduation Cap</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsSuccessMetricDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveSuccessMetric}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isOfferingDialogOpen}
        onOpenChange={setIsOfferingDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOffering?.title || "New Offering"}
            </DialogTitle>
            <DialogDescription>Add or edit service offering</DialogDescription>
          </DialogHeader>
          {editingOffering && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="offeringTitle">Title</Label>
                <Input
                  id="offeringTitle"
                  placeholder="e.g., Teacher Training"
                  value={editingOffering.title}
                  onChange={(e) =>
                    setEditingOffering({
                      ...editingOffering,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offeringDescription">Description</Label>
                <Textarea
                  id="offeringDescription"
                  rows={3}
                  placeholder="Describe the offering..."
                  value={editingOffering.description}
                  onChange={(e) =>
                    setEditingOffering({
                      ...editingOffering,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offeringFeatures">
                  Key Features (one per line)
                </Label>
                <Textarea
                  id="offeringFeatures"
                  rows={4}
                  placeholder="Hands-on pedagogy&#10;Curriculum integration&#10;Assessment tools"
                  value={editingOffering.featuresText}
                  onChange={(e) =>
                    setEditingOffering({
                      ...editingOffering,
                      featuresText: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    // Stop Enter key from bubbling up to Dialog (which might close it)
                    if (e.key === "Enter") {
                      e.stopPropagation();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offeringOutcomes">
                  Expected Outcomes (one per line)
                </Label>
                <Textarea
                  id="offeringOutcomes"
                  rows={4}
                  placeholder="Confident instruction&#10;Student-centered learning&#10;Practical skill development"
                  value={editingOffering.outcomesText}
                  onChange={(e) =>
                    setEditingOffering({
                      ...editingOffering,
                      outcomesText: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    // Stop Enter key from bubbling up to Dialog (which might close it)
                    if (e.key === "Enter") {
                      e.stopPropagation();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offeringImage">Image</Label>
                <div className="space-y-3">
                  <Input
                    id="offeringImage"
                    type="file"
                    accept="image/*"
                    onChange={handleOfferingImageUpload}
                  />
                  {(editingOffering.image || editingOffering.imagePreview) && (
                    <div className="h-48 rounded-lg overflow-hidden border">
                      <img
                        src={
                          editingOffering.imagePreview ||
                          (typeof editingOffering.image === "string"
                            ? editingOffering.image
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
                  onClick={() => setIsOfferingDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveOffering}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isPartnerDialogOpen} onOpenChange={setIsPartnerDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPartner?.name || "New Partner"}</DialogTitle>
            <DialogDescription>
              Add or edit partner information
            </DialogDescription>
          </DialogHeader>
          {editingPartner && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="partnerName">Partner Name</Label>
                <Input
                  id="partnerName"
                  placeholder="e.g., Addis Ababa University"
                  value={editingPartner.name}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="partnerLogo">Logo</Label>
                <div className="space-y-3">
                  <Input
                    id="partnerLogo"
                    type="file"
                    accept="image/*"
                    onChange={handlePartnerLogoUpload}
                  />
                  {editingPartner.logo && (
                    <div className="p-4 bg-white border rounded-lg flex items-center justify-center h-32">
                      <img
                        src={editingPartner.logo || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-24 max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsPartnerDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={savePartner}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
