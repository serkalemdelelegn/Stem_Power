"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
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
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  DollarSign,
  Edit,
  Upload,
  Filter,
} from "lucide-react";
import { LaboratoryProgramsSection } from "@/components/laboratory-programs-section";
import type { StemOperationsCenter } from "@/lib/api-types";

interface Center extends StemOperationsCenter {
  // Additional fields for admin UI
  name?: string; // Alias for host
  director?: string; // Alias for contact
  establishedYear?: string; // Alias for yearEstablished
  laboratories?: string[]; // Alias for labs
  fundedBy?: string; // Alias for funder
  image?: string | File | null; // For image upload
  imagePreview?: string; // For displaying preview of File objects
}

const availableLabs = [
  "COMP",
  "ELEX",
  "MECX",
  "OPTX",
  "3DP",
  "CHMX",
  "SOLP",
  "AERO",
  "HISC",
];

export default function StemCentersPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<Center | null>(null);
  const [editingType, setEditingType] = useState<"featured" | "all">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [allCentersData, setAllCentersData] = useState<StemOperationsCenter[]>(
    []
  );

  // Fetch all data from API on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);

        // Fetch centers
        const centersResponse = await fetch(
          "/api/programs/stem-operations/stem-centers"
        );
        if (centersResponse.ok) {
          const centersData = await centersResponse.json();
          setAllCentersData(centersData || []);
        }

        // Fetch hero
        const heroResponse = await fetch(
          "/api/programs/stem-operations/stem-centers/hero"
        );
        if (heroResponse.ok) {
          const heroData = await heroResponse.json();
          if (heroData) {
            setHero({
              badge:
                heroData.badge ||
                "Empowering Africa's Next Generation Since 2010",
              title: heroData.title || "61 STEM Centers Across Ethiopia",
              description:
                heroData.description ||
                "Specialized learning hubs where education meets innovation. From our first center in Bishoftu's Foka area in 2009, we've grown into a nation-wide movement driving peace, development, and opportunity through science and technology.",
            });
          }
        }

        // Fetch stats
        const statsResponse = await fetch(
          "/api/programs/stem-operations/stem-centers/stats"
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (Array.isArray(statsData) && statsData.length > 0) {
            // Convert stats array to object format
            const statsObj: Record<string, string> = {};
            statsData.forEach((stat: any) => {
              if (stat.label === "STEM Centers")
                statsObj.totalCenters = stat.number;
              if (stat.label === "Regions") statsObj.regions = stat.number;
              if (stat.label === "Students Served")
                statsObj.studentsServed = stat.number;
              if (stat.label === "Years of impact")
                statsObj.yearsOfImpact = stat.number;
            });
            if (Object.keys(statsObj).length > 0) {
              setStatistics({
                totalCenters: statsObj.totalCenters || "58",
                regions: statsObj.regions || "11",
                studentsServed: statsObj.studentsServed || "50k+",
                yearsOfImpact: statsObj.yearsOfImpact || "15+",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const [hero, setHero] = useState({
    badge: "Empowering Africa's Next Generation Since 2010",
    title: "61 STEM Centers Across Ethiopia",
    description:
      "Specialized learning hubs where education meets innovation. From our first center in Bishoftu's Foka area in 2009, we've grown into a nation-wide movement driving peace, development, and opportunity through science and technology.",
  });

  const [statistics, setStatistics] = useState({
    totalCenters: "58",
    regions: "11",
    studentsServed: "50k+",
    yearsOfImpact: "15+",
  });

  // Separate featured and all centers from API data
  const featuredCenters = allCentersData
    .filter((c) => c.featured)
    .map(convertToCenter);
  const allCenters = allCentersData.map(convertToCenter);

  // Helper function to convert API data to Center format for UI
  function convertToCenter(apiCenter: StemOperationsCenter): Center {
    return {
      ...apiCenter,
      name: apiCenter.host,
      director: apiCenter.contact,
      establishedYear: apiCenter.yearEstablished,
      laboratories: apiCenter.labs,
      fundedBy: apiCenter.funder,
      image: apiCenter.imageQuery || "",
    };
  }

  // Helper function to convert Center format back to API format
  function convertToApiFormat(center: Center): StemOperationsCenter {
    return {
      id: center.id,
      host: center.name || center.host,
      city: center.city,
      region: center.region,
      country: center.country || "Ethiopia",
      cluster: center.cluster,
      contact: center.director || center.contact,
      phone: center.phone || "",
      email: center.email || "",
      website: center.website || "",
      labs: center.laboratories || center.labs || [],
      funder: center.fundedBy || center.funder || "",
      yearEstablished: center.establishedYear || center.yearEstablished || "",
      featured: editingType === "featured" ? true : center.featured,
      imageQuery:
        center.imageQuery ||
        (typeof center.image === "string" ? center.image : "") ||
        "",
      featuredBadge: center.featuredBadge,
    };
  }

  const [featuredFilter, setFeaturedFilter] = useState({
    region: "all",
    laboratory: "all",
  });
  const [allCentersFilter, setAllCentersFilter] = useState({
    region: "all",
    laboratory: "all",
  });
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save hero
      const heroResponse = await fetch(
        "/api/programs/stem-operations/stem-centers/hero",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(hero),
        }
      );

      if (!heroResponse.ok) {
        throw new Error("Failed to save hero");
      }

      // Save stats
      const statsArray = [
        {
          id: "1",
          number: statistics.totalCenters,
          label: "STEM Centers",
          icon: "Building2",
        },
        {
          id: "2",
          number: statistics.regions,
          label: "Regions",
          icon: "MapPin",
        },
        {
          id: "3",
          number: statistics.studentsServed,
          label: "Students Served",
          icon: "GraduationCap",
        },
        {
          id: "4",
          number: statistics.yearsOfImpact,
          label: "Years of impact",
          icon: "Calendar",
        },
      ];

      const statsResponse = await fetch(
        "/api/programs/stem-operations/stem-centers/stats",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(statsArray),
        }
      );

      if (!statsResponse.ok) {
        throw new Error("Failed to save stats");
      }

      setIsSaving(false);
      alert("All changes saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      setIsSaving(false);
      alert("Failed to save changes. Please try again.");
    }
  };

  const addFeaturedCenter = () => {
    const newCenter: Center = {
      id: "",
      host: "",
      name: "",
      city: "",
      region: "",
      country: "Ethiopia",
      cluster: "",
      contact: "",
      director: "",
      phone: "",
      email: "",
      website: "",
      labs: [],
      laboratories: [],
      funder: "",
      fundedBy: "",
      yearEstablished: "",
      establishedYear: "",
      featured: true,
      image: "",
      imageQuery: "",
      featuredBadge: "",
    };
    setEditingCenter(newCenter);
    setEditingType("featured");
    setIsDialogOpen(true);
  };

  const addAllCenter = () => {
    const newCenter: Center = {
      id: "",
      host: "",
      name: "",
      city: "",
      region: "",
      country: "Ethiopia",
      cluster: "",
      contact: "",
      director: "",
      phone: "",
      email: "",
      website: "",
      labs: [],
      laboratories: [],
      funder: "",
      fundedBy: "",
      yearEstablished: "",
      establishedYear: "",
      featured: false,
      image: "",
      imageQuery: "",
    };
    setEditingCenter(newCenter);
    setEditingType("all");
    setIsDialogOpen(true);
  };

  const editCenter = (center: Center, type: "featured" | "all") => {
    setEditingCenter({ ...center });
    setEditingType(type);
    setIsDialogOpen(true);
  };

  const saveCenter = async () => {
    if (!editingCenter) return;

    try {
      // Check if this is an existing center (has a valid ID that exists in the data)
      const hasValidId =
        editingCenter.id &&
        editingCenter.id.trim() !== "" &&
        editingCenter.id !== "undefined";

      console.log(
        "hasValidId:",
        hasValidId,
        "editingCenter.id:",
        editingCenter.id
      );

      // Check if image is a File object
      const image = editingCenter.image;
      const isFileImage =
        image != null &&
        !(typeof image === "string") &&
        (image as any) instanceof File;

      const isNewCenter = !hasValidId;
      const url = isNewCenter
        ? "/api/programs/stem-operations/stem-centers"
        : `/api/programs/stem-operations/stem-centers/${editingCenter.id}`;
      const method = isNewCenter ? "POST" : "PUT";

      if (isFileImage && image && typeof image !== "string") {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append("file", image as File);
        formData.append("name", editingCenter.name || editingCenter.host || "");
        formData.append(
          "location",
          `${editingCenter.city || ""}, ${editingCenter.region || ""}`
        );
        if (editingCenter.establishedYear || editingCenter.yearEstablished) {
          const year =
            editingCenter.establishedYear ||
            editingCenter.yearEstablished ||
            "";
          const establishedDate = year ? new Date(`${year}-01-01`) : new Date();
          formData.append("established_date", establishedDate.toISOString());
        }
        formData.append(
          "director_name",
          editingCenter.director || editingCenter.contact || ""
        );
        formData.append(
          "funded_by",
          editingCenter.fundedBy || editingCenter.funder || ""
        );
        formData.append("website", editingCenter.website || "");
        formData.append("phone", editingCenter.phone || "");
        formData.append("is_featured", String(editingCenter.featured || false));
        if (editingCenter.laboratories || editingCenter.labs) {
          const labs = editingCenter.laboratories || editingCenter.labs || [];
          formData.append("labs", JSON.stringify(labs));
        }

        const response = await fetch(url, {
          method,
          body: formData, // Don't set Content-Type header, browser will set it with boundary
        });

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: "Failed to save center" }));
          throw new Error(error.error || "Failed to save center");
        }

        const savedCenter = await response.json();

        // Refresh the data from API
        const refreshResponse = await fetch(
          "/api/programs/stem-operations/stem-centers"
        );
        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json();
          setAllCentersData(refreshedData || []);
        }

        // Clean up preview URL
        if (editingCenter.imagePreview) {
          URL.revokeObjectURL(editingCenter.imagePreview);
        }
        setIsDialogOpen(false);
        setEditingCenter(null);
        alert("Center saved successfully!");
      } else {
        // Use JSON for URL string or null
        const apiData = convertToApiFormat(editingCenter);
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(apiData),
        });

        if (!response.ok) {
          const error = await response
            .json()
            .catch(() => ({ error: "Failed to save center" }));
          throw new Error(error.error || "Failed to save center");
        }

        const savedCenter = await response.json();

        // Refresh the data from API
        const refreshResponse = await fetch(
          "/api/programs/stem-operations/stem-centers"
        );
        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json();
          setAllCentersData(refreshedData || []);
        }

        // Clean up preview URL
        if (editingCenter.imagePreview) {
          URL.revokeObjectURL(editingCenter.imagePreview);
        }
        setIsDialogOpen(false);
        setEditingCenter(null);
        alert("Center saved successfully!");
      }
    } catch (error: any) {
      console.error("Error saving center:", error);
      alert(error.message || "Failed to save center. Please try again.");
    }
  };

  const deleteCenter = async (id: string, type: "featured" | "all") => {
    if (!confirm("Are you sure you want to delete this center?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/programs/stem-operations/stem-centers/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete center");
      }

      // Refresh the data from API
      const refreshResponse = await fetch(
        "/api/programs/stem-operations/stem-centers"
      );
      if (refreshResponse.ok) {
        const refreshedData = await refreshResponse.json();
        setAllCentersData(refreshedData || []);
      }

      alert("Center deleted successfully!");
    } catch (error) {
      console.error("Error deleting center:", error);
      alert("Failed to delete center. Please try again.");
    }
  };

  const toggleLaboratory = (labCode: string) => {
    if (!editingCenter) return;

    const currentLabs = editingCenter.laboratories || editingCenter.labs || [];
    if (currentLabs.includes(labCode)) {
      setEditingCenter({
        ...editingCenter,
        laboratories: currentLabs.filter((l) => l !== labCode),
        labs: currentLabs.filter((l) => l !== labCode),
      });
    } else {
      setEditingCenter({
        ...editingCenter,
        laboratories: [...currentLabs, labCode],
        labs: [...currentLabs, labCode],
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingCenter) {
      // Clean up old preview URL if it exists
      if (editingCenter.imagePreview) {
        URL.revokeObjectURL(editingCenter.imagePreview);
      }
      // Store the File object and create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setEditingCenter({
        ...editingCenter,
        image: file, // Store File object instead of base64
        imagePreview: previewUrl, // For preview display
      });
    }
  };

  const filterCenters = (
    centers: Center[],
    filter: { region: string; laboratory: string }
  ) => {
    return centers.filter((center) => {
      const regionMatch =
        filter.region === "all" || center.region === filter.region;
      const labs = center.laboratories || center.labs || [];
      const labMatch =
        filter.laboratory === "all" || labs.includes(filter.laboratory);
      return regionMatch && labMatch;
    });
  };

  const getUniqueRegions = (centers: Center[]) => {
    return Array.from(new Set(centers.map((c) => c.region))).sort();
  };

  const CenterCard = ({
    center,
    type,
  }: {
    center: Center;
    type: "featured" | "all";
  }) => {
    const displayName = center.name || center.host || "Unnamed Center";
    const displayCity = center.city || "";
    const displayRegion = center.region || "";
    const displayYear = center.establishedYear || center.yearEstablished || "";
    const displayDirector = center.director || center.contact || "";
    const displayLabs = center.laboratories || center.labs || [];
    const displayImage =
      (typeof center.image === "string" ? center.image : "") ||
      center.imageQuery ||
      "";

    // Validate image URL - only show if it's a valid URL or data URL
    // Also check that it's not a malformed string like "nnnnnn"
    const isValidImageUrl =
      displayImage &&
      displayImage.trim() !== "" &&
      displayImage.length > 3 &&
      !displayImage.match(/^[a-z]+$/i) && // Not just letters like "nnnnnn"
      (displayImage.startsWith("http://") ||
        displayImage.startsWith("https://") ||
        displayImage.startsWith("data:") ||
        displayImage.startsWith("/"));

    return (
      <Card className="overflow-hidden">
        {isValidImageUrl && (
          <div className="h-48 overflow-hidden bg-muted">
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide image on error
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg text-balance">
                {displayName}
              </h3>
              {center.featuredBadge && (
                <Badge className="bg-[#00BFA6] text-white shrink-0 ml-2">
                  {center.featuredBadge}
                </Badge>
              )}
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>
                  {displayCity}, {displayRegion}
                </span>
              </div>
              {displayYear && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>Established {displayYear}</span>
                </div>
              )}
              {displayDirector && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 shrink-0" />
                  <span>{displayDirector}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              Available Laboratories ({displayLabs.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {displayLabs.map((lab) => (
                <Badge key={lab} variant="secondary" className="text-xs">
                  {lab}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground pt-2 border-t">
            {center.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{center.phone}</span>
              </div>
            )}
            {center.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{center.email}</span>
              </div>
            )}
            {center.website && (
              <div className="flex items-center gap-2">
                <a
                  href={center.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00BFA6] hover:underline flex items-center gap-2"
                >
                  <span>🔗</span>
                  <span>Visit Website</span>
                </a>
              </div>
            )}
            {(center.fundedBy || center.funder) && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 shrink-0" />
                <span>Funded by {center.fundedBy || center.funder}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-transparent"
              onClick={() => editCenter(center, type)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteCenter(center.id, type)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const FilterSection = ({
    filter,
    setFilter,
    centers,
  }: {
    filter: { region: string; laboratory: string };
    setFilter: (filter: { region: string; laboratory: string }) => void;
    centers: Center[];
  }) => (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      <Select
        value={filter.region}
        onValueChange={(value) => setFilter({ ...filter, region: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Regions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          {getUniqueRegions(centers).map((region) => (
            <SelectItem key={region} value={region}>
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={filter.laboratory}
        onValueChange={(value) => setFilter({ ...filter, laboratory: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Laboratories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Laboratories</SelectItem>
          {availableLabs.map((lab) => (
            <SelectItem key={lab} value={lab}>
              {lab}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(filter.region !== "all" || filter.laboratory !== "all") && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFilter({ region: "all", laboratory: "all" })}
          className="text-xs"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );

  const labProgramsRef = useRef<{ openAddDialog: () => void }>(null);

  if (isLoading) {
    return (
      <div>
        <AdminHeader
          title="STEM Centers"
          description="Manage STEM centers across Ethiopia"
        />
        <div className="p-6 max-w-7xl">
          <p className="text-center text-gray-600">Loading STEM centers...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="STEM Centers"
        description="Manage STEM centers across Ethiopia"
      />
      <div className="p-6 max-w-7xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Main hero banner for the STEM centers page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="heroBadge">Badge Text</Label>
                <Input
                  id="heroBadge"
                  placeholder="e.g., Empowering Africa's Next Generation Since 2010"
                  value={hero.badge}
                  onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Title</Label>
                <Input
                  id="heroTitle"
                  placeholder="e.g., 61 STEM Centers Across Ethiopia"
                  value={hero.title}
                  onChange={(e) => setHero({ ...hero, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroDescription">Description</Label>
                <Textarea
                  id="heroDescription"
                  rows={4}
                  placeholder="Enter the hero section description"
                  value={hero.description}
                  onChange={(e) =>
                    setHero({ ...hero, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistical Overview</CardTitle>
              <CardDescription>
                Key metrics about STEM Centers network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="totalCenters">Total STEM Centers</Label>
                  <Input
                    id="totalCenters"
                    value={statistics.totalCenters}
                    onChange={(e) =>
                      setStatistics({
                        ...statistics,
                        totalCenters: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regions">Regions</Label>
                  <Input
                    id="regions"
                    value={statistics.regions}
                    onChange={(e) =>
                      setStatistics({ ...statistics, regions: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentsServed">Students Served</Label>
                  <Input
                    id="studentsServed"
                    value={statistics.studentsServed}
                    onChange={(e) =>
                      setStatistics({
                        ...statistics,
                        studentsServed: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfImpact">Years of Impact</Label>
                  <Input
                    id="yearsOfImpact"
                    value={statistics.yearsOfImpact}
                    onChange={(e) =>
                      setStatistics({
                        ...statistics,
                        yearsOfImpact: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={addFeaturedCenter}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Featured Center
            </Button>
            <Button
              onClick={addAllCenter}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Center
            </Button>
            <Button
              onClick={() => labProgramsRef.current?.openAddDialog()}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Laboratory Program
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Featured Centers</CardTitle>
              <CardDescription>
                Highlight special centers with custom badges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FilterSection
                filter={featuredFilter}
                setFilter={setFeaturedFilter}
                centers={featuredCenters}
              />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filterCenters(featuredCenters, featuredFilter).map(
                  (center) => (
                    <CenterCard
                      key={center.id}
                      center={center}
                      type="featured"
                    />
                  )
                )}
              </div>
              {filterCenters(featuredCenters, featuredFilter).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No featured centers match the selected filters.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All STEM Centers</CardTitle>
              <CardDescription>
                Complete list of STEM centers across Ethiopia
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FilterSection
                filter={allCentersFilter}
                setFilter={setAllCentersFilter}
                centers={allCenters}
              />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filterCenters(allCenters, allCentersFilter).map((center) => (
                  <CenterCard key={center.id} center={center} type="all" />
                ))}
              </div>
              {filterCenters(allCenters, allCentersFilter).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No centers match the selected filters.
                </p>
              )}
            </CardContent>
          </Card>

          <div className="mt-8">
            <LaboratoryProgramsSection
              ref={labProgramsRef}
              showAddButton={true}
              stemCenters={allCenters.map((c) => ({
                id: c.id,
                name: c.name || c.host || "Unnamed Center",
              }))}
            />
          </div>

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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCenter?.name ||
                (editingType === "featured"
                  ? "New Featured Center"
                  : "New Center")}
            </DialogTitle>
            <DialogDescription>
              {editingType === "featured"
                ? "Add a featured center with a custom badge"
                : "Add a new STEM center to the network"}
            </DialogDescription>
          </DialogHeader>

          {editingCenter && (
            <div className="space-y-6 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="centerName">Center Name (Host) *</Label>
                  <Input
                    id="centerName"
                    placeholder="e.g., Foka STEM Training Center"
                    value={editingCenter.name || editingCenter.host || ""}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        name: e.target.value,
                        host: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year *</Label>
                  <Input
                    id="establishedYear"
                    placeholder="e.g., 2010"
                    value={
                      editingCenter.establishedYear ||
                      editingCenter.yearEstablished ||
                      ""
                    }
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        establishedYear: e.target.value,
                        yearEstablished: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="e.g., Bishoftu"
                    value={editingCenter.city}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        city: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Input
                    id="region"
                    placeholder="e.g., Oromia"
                    value={editingCenter.region}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        region: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cluster">Cluster *</Label>
                  <Input
                    id="cluster"
                    placeholder="e.g., ET-C"
                    value={editingCenter.cluster || ""}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        cluster: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    placeholder="e.g., Ethiopia"
                    value={editingCenter.country || "Ethiopia"}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        country: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="director">Contact/Director Name *</Label>
                <Input
                  id="director"
                  placeholder="e.g., Mr. Eyob Ayechew"
                  value={editingCenter.director || editingCenter.contact || ""}
                  onChange={(e) =>
                    setEditingCenter({
                      ...editingCenter,
                      director: e.target.value,
                      contact: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="e.g., +251912066189"
                    value={editingCenter.phone || ""}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g., director@stempower.org"
                    value={editingCenter.email || ""}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="e.g., https://www.stempower.org"
                  value={editingCenter.website || ""}
                  onChange={(e) =>
                    setEditingCenter({
                      ...editingCenter,
                      website: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-3">
                <Label>
                  Available Laboratories (
                  {
                    (editingCenter.laboratories || editingCenter.labs || [])
                      .length
                  }{" "}
                  selected)
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {availableLabs.map((lab) => {
                    const currentLabs =
                      editingCenter.laboratories || editingCenter.labs || [];
                    return (
                      <div key={lab} className="flex items-center space-x-2">
                        <Checkbox
                          id={`lab-${lab}`}
                          checked={currentLabs.includes(lab)}
                          onCheckedChange={() => toggleLaboratory(lab)}
                        />
                        <label
                          htmlFor={`lab-${lab}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {lab}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fundedBy">Funded By</Label>
                  <Input
                    id="fundedBy"
                    placeholder="e.g., GFCT"
                    value={editingCenter.fundedBy || editingCenter.funder || ""}
                    onChange={(e) =>
                      setEditingCenter({
                        ...editingCenter,
                        fundedBy: e.target.value,
                        funder: e.target.value,
                      })
                    }
                  />
                </div>
                {editingType === "featured" && (
                  <div className="space-y-2">
                    <Label htmlFor="featuredBadge">Featured Badge Text</Label>
                    <Input
                      id="featuredBadge"
                      placeholder="e.g., First Center - 2010"
                      value={editingCenter.featuredBadge || ""}
                      onChange={(e) =>
                        setEditingCenter({
                          ...editingCenter,
                          featuredBadge: e.target.value,
                        })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageQuery">
                  Image Query (for dynamic image generation)
                </Label>
                <Input
                  id="imageQuery"
                  placeholder="e.g., Ethiopian students working with electronics in STEM lab"
                  value={
                    editingCenter.imageQuery ||
                    (typeof editingCenter.image === "string"
                      ? editingCenter.image
                      : "") ||
                    ""
                  }
                  onChange={(e) =>
                    setEditingCenter({
                      ...editingCenter,
                      imageQuery: e.target.value,
                      image:
                        typeof editingCenter.image === "string"
                          ? e.target.value
                          : editingCenter.image,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  This text will be used to generate an appropriate image for
                  the center
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUpload">
                  Center Image (Alternative: Upload Image)
                </Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document.getElementById("imageUpload")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  {(editingCenter.image ||
                    editingCenter.imagePreview ||
                    imagePreview) && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img
                        src={
                          editingCenter.imagePreview ||
                          imagePreview ||
                          (typeof editingCenter.image === "string"
                            ? editingCenter.image
                            : "/placeholder.svg")
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide image on error
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveCenter}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Center
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
