"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
  Upload,
  Users,
  Target,
  Trophy,
} from "lucide-react";

interface WinnerProject {
  id: string;
  placement: string;
  placementBadge: string;
  projectTitle: string;
  studentName: string;
  university: string;
  description: string;
  image: string | File | null;
  imagePreview?: string;
}

interface JourneyStage {
  id: string;
  icon: string;
  badge: string;
  title: string;
  number: string;
  description: string;
}

interface Statistic {
  id: string;
  icon: string;
  number: string;
  label: string;
}

export default function ScienceFairsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isWinnerDialogOpen, setIsWinnerDialogOpen] = useState(false);
  const [editingWinner, setEditingWinner] = useState<WinnerProject | null>(
    null
  );
  const [isJourneyDialogOpen, setIsJourneyDialogOpen] = useState(false);
  const [editingJourneyStage, setEditingJourneyStage] =
    useState<JourneyStage | null>(null);
  const [isStatisticDialogOpen, setIsStatisticDialogOpen] = useState(false);
  const [editingStatistic, setEditingStatistic] = useState<Statistic | null>(
    null
  );

  // Hero Banner Section - Added badge field
  const [heroBanner, setHeroBanner] = useState({
    badge: "Empowering Africa's Next Generation Since 2010",
    title: "Celebrating Excellence",
    subtitle:
      "Meet the brilliant minds whose innovations are making a real difference in communities across Ethiopia.",
  });

  // Statistics Section
  const [statistics, setStatistics] = useState<Statistic[]>([]);

  // National Recognition Journey
  const [journeyStages, setJourneyStages] = useState<JourneyStage[]>([]);

  // Winner Projects
  const [winnerProjects, setWinnerProjects] = useState<WinnerProject[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hero
        const heroResponse = await fetch(
          "/api/programs/stem-operations/science-fairs/hero"
        );
        if (heroResponse.ok) {
          const heroData = await heroResponse.json();
          if (heroData) {
            setHeroBanner({
              badge: heroData.badge || "",
              title: heroData.title || "",
              subtitle: heroData.subtitle || "",
            });
          }
        }

        // Fetch stats
        const statsResponse = await fetch(
          "/api/programs/stem-operations/science-fairs/stats"
        );
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (Array.isArray(statsData)) {
            setStatistics(statsData);
          }
        }

        // Fetch journey stages
        const journeyResponse = await fetch(
          "/api/programs/stem-operations/science-fairs/journey-stages"
        );
        if (journeyResponse.ok) {
          const journeyData = await journeyResponse.json();
          if (Array.isArray(journeyData)) {
            setJourneyStages(journeyData);
          }
        }

        // Fetch winners
        const winnersResponse = await fetch(
          "/api/programs/stem-operations/science-fairs/winners"
        );
        if (winnersResponse.ok) {
          const winnersData = await winnersResponse.json();
          if (Array.isArray(winnersData)) {
            setWinnerProjects(winnersData);
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
      const response = await fetch(
        "/api/programs/stem-operations/science-fairs/hero",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(heroBanner),
        }
      );
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to save" }));
        throw new Error(
          errorData.error || errorData.message || "Failed to save"
        );
      }
      alert("Science Fairs page updated successfully!");
    } catch (error: any) {
      console.error("Failed to save:", error);
      alert(error.message || "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const addWinnerProject = () => {
    const newProject: WinnerProject = {
      id: Date.now().toString(),
      placement: "",
      placementBadge: "",
      projectTitle: "",
      studentName: "",
      university: "",
      description: "",
      image: "",
    };
    setEditingWinner(newProject);
    setIsWinnerDialogOpen(true);
  };

  const editWinnerProject = (project: WinnerProject) => {
    // Clean up any existing preview URL
    if (editingWinner?.imagePreview && editingWinner.image instanceof File) {
      URL.revokeObjectURL(editingWinner.imagePreview);
    }
    setEditingWinner({
      ...project,
      imagePreview:
        typeof project.image === "string" ? project.image : undefined,
    });
    setIsWinnerDialogOpen(true);
  };

  const saveWinnerProject = async () => {
    if (!editingWinner) return;

    try {
      const existing = winnerProjects.find((p) => p.id === editingWinner.id);
      const isUpdate = !!existing;
      const url = isUpdate
        ? `/api/programs/stem-operations/science-fairs/winners/${editingWinner.id}`
        : "/api/programs/stem-operations/science-fairs/winners";

      let response: Response;

      // Check if image is a File object - use FormData
      if (editingWinner.image instanceof File) {
        const formData = new FormData();
        formData.append("file", editingWinner.image);
        formData.append("placement", editingWinner.placement);
        formData.append("placementBadge", editingWinner.placementBadge);
        formData.append("projectTitle", editingWinner.projectTitle);
        formData.append("studentName", editingWinner.studentName);
        formData.append("university", editingWinner.university);
        formData.append("description", editingWinner.description);

        response = await fetch(url, {
          method: isUpdate ? "PUT" : "POST",
          body: formData,
        });
      } else {
        // Use JSON for string URLs or null
        response = await fetch(url, {
          method: isUpdate ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editingWinner,
            image: editingWinner.image || null,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to save" }));
        throw new Error(
          errorData.error ||
            errorData.message ||
            "Failed to save winner project"
        );
      }

      const savedItem = await response.json();

      // Clean up preview URL
      if (editingWinner.imagePreview) {
        URL.revokeObjectURL(editingWinner.imagePreview);
      }

      if (isUpdate) {
        setWinnerProjects(
          winnerProjects.map((p) => (p.id === editingWinner.id ? savedItem : p))
        );
      } else {
        setWinnerProjects([...winnerProjects, savedItem]);
      }

      setIsWinnerDialogOpen(false);
      setEditingWinner(null);
    } catch (error: any) {
      console.error("Failed to save winner project:", error);
      alert(
        error.message || "Failed to save winner project. Please try again."
      );
    }
  };

  const deleteWinnerProject = async (id: string) => {
    if (confirm("Are you sure you want to delete this winner project?")) {
      try {
        const response = await fetch(
          `/api/programs/stem-operations/science-fairs/winners/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to delete" }));
          throw new Error(
            errorData.error ||
              errorData.message ||
              "Failed to delete winner project"
          );
        }
        setWinnerProjects(winnerProjects.filter((p) => p.id !== id));
      } catch (error: any) {
        console.error("Failed to delete winner project:", error);
        alert(
          error.message || "Failed to delete winner project. Please try again."
        );
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingWinner) {
      // Clean up previous preview URL if it exists
      if (editingWinner.imagePreview) {
        URL.revokeObjectURL(editingWinner.imagePreview);
      }
      // Create preview URL and store File object
      const previewUrl = URL.createObjectURL(file);
      setEditingWinner({
        ...editingWinner,
        image: file,
        imagePreview: previewUrl,
      });
    }
  };

  const addStatistic = () => {
    const newStat: Statistic = {
      id: Date.now().toString(),
      icon: "users",
      number: "",
      label: "",
    };
    setEditingStatistic(newStat);
    setIsStatisticDialogOpen(true);
  };

  const editStatistic = (stat: Statistic) => {
    setEditingStatistic({ ...stat });
    setIsStatisticDialogOpen(true);
  };

  const saveStatistic = async () => {
    if (!editingStatistic) return;

    try {
      // Check if this is an existing statistic by checking if ID exists and is a valid database ID (not a temp timestamp)
      const existing = editingStatistic.id && 
        !editingStatistic.id.startsWith("temp-") &&
        !/^\d{13,}$/.test(editingStatistic.id) && // Not a timestamp (13+ digits)
        statistics.find((s) => s.id === editingStatistic.id);
      
      const isUpdate = !!existing;
      const url = isUpdate
        ? `/api/programs/stem-operations/science-fairs/stats/${editingStatistic.id}`
        : "/api/programs/stem-operations/science-fairs/stats";

      // For new records, don't send the id field - let the database auto-generate it
      const payload = isUpdate 
        ? editingStatistic 
        : {
            icon: editingStatistic.icon,
            number: editingStatistic.number,
            label: editingStatistic.label,
          };

      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to save" }));
        throw new Error(
          errorData.error || errorData.message || "Failed to save statistic"
        );
      }

      const savedItem = await response.json();

      if (isUpdate) {
        setStatistics(
          statistics.map((s) => (s.id === editingStatistic.id ? savedItem : s))
        );
      } else {
        setStatistics([...statistics, savedItem]);
      }

      setIsStatisticDialogOpen(false);
      setEditingStatistic(null);
    } catch (error: any) {
      console.error("Failed to save statistic:", error);
      alert(error.message || "Failed to save statistic. Please try again.");
    }
  };

  const deleteStatistic = async (id: string) => {
    if (confirm("Are you sure you want to delete this statistic?")) {
      try {
        const response = await fetch(
          `/api/programs/stem-operations/science-fairs/stats/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to delete" }));
          throw new Error(
            errorData.error || errorData.message || "Failed to delete statistic"
          );
        }
        setStatistics(statistics.filter((s) => s.id !== id));
      } catch (error: any) {
        console.error("Failed to delete statistic:", error);
        alert(error.message || "Failed to delete statistic. Please try again.");
      }
    }
  };

  const updateJourneyStage = async (
    id: string,
    field: keyof JourneyStage,
    value: string
  ) => {
    const updatedStage = journeyStages.find((j) => j.id === id);
    if (updatedStage) {
      const updated = { ...updatedStage, [field]: value };
      try {
        const response = await fetch(
          `/api/programs/stem-operations/science-fairs/journey-stages/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          }
        );
        if (response.ok) {
          setJourneyStages(
            journeyStages.map((j) => (j.id === id ? updated : j))
          );
        }
      } catch (error) {
        console.error("Failed to update journey stage:", error);
      }
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "users":
        return <Users className="h-6 w-6" />;
      case "target":
        return <Target className="h-6 w-6" />;
      case "trophy":
        return <Trophy className="h-6 w-6" />;
      default:
        return <Users className="h-6 w-6" />;
    }
  };

  const addJourneyStage = () => {
    const newStage: JourneyStage = {
      id: Date.now().toString(),
      icon: "users",
      badge: "",
      title: "",
      number: "",
      description: "",
    };
    setEditingJourneyStage(newStage);
    setIsJourneyDialogOpen(true);
  };

  const editJourneyStage = (stage: JourneyStage) => {
    setEditingJourneyStage({ ...stage });
    setIsJourneyDialogOpen(true);
  };

  const saveJourneyStage = async () => {
    if (!editingJourneyStage) return;

    try {
      // Check if this is an existing stage by checking if ID exists and is a valid database ID (not a temp timestamp)
      const existing = editingJourneyStage.id && 
        !editingJourneyStage.id.startsWith("temp-") &&
        !/^\d{13,}$/.test(editingJourneyStage.id) && // Not a timestamp (13+ digits)
        journeyStages.find((s) => s.id === editingJourneyStage.id);
      
      const isUpdate = !!existing;
      const url = isUpdate
        ? `/api/programs/stem-operations/science-fairs/journey-stages/${editingJourneyStage.id}`
        : "/api/programs/stem-operations/science-fairs/journey-stages";

      // For new records, don't send the id field - let the database auto-generate it
      const payload = isUpdate 
        ? editingJourneyStage 
        : {
            icon: editingJourneyStage.icon,
            badge: editingJourneyStage.badge,
            title: editingJourneyStage.title,
            number: editingJourneyStage.number,
            description: editingJourneyStage.description,
            order: editingJourneyStage.order || 0,
          };

      const response = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to save" }));
        throw new Error(
          errorData.error || errorData.message || "Failed to save journey stage"
        );
      }

      const savedItem = await response.json();

      if (isUpdate) {
        setJourneyStages(
          journeyStages.map((s) =>
            s.id === editingJourneyStage.id ? savedItem : s
          )
        );
      } else {
        setJourneyStages([...journeyStages, savedItem]);
      }

      setIsJourneyDialogOpen(false);
      setEditingJourneyStage(null);
    } catch (error: any) {
      console.error("Failed to save journey stage:", error);
      alert(error.message || "Failed to save journey stage. Please try again.");
    }
  };

  const deleteJourneyStage = async (id: string) => {
    if (confirm("Are you sure you want to delete this recognition stage?")) {
      try {
        const response = await fetch(
          `/api/programs/stem-operations/science-fairs/journey-stages/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Failed to delete" }));
          throw new Error(
            errorData.error ||
              errorData.message ||
              "Failed to delete journey stage"
          );
        }
        setJourneyStages(journeyStages.filter((s) => s.id !== id));
      } catch (error: any) {
        console.error("Failed to delete journey stage:", error);
        alert(
          error.message || "Failed to delete journey stage. Please try again."
        );
      }
    }
  };

  return (
    <div>
      <AdminHeader
        title="Science Fairs"
        description="Manage science fairs content and winner showcases"
      />
      <div className="p-6 max-w-7xl">
        <div className="space-y-6">
          {/* Hero Banner Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Banner</CardTitle>
              <CardDescription>
                Main banner content for the Science Fairs page
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
                  placeholder="e.g., Empowering Africa's Next Generation Since 2010"
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
                  placeholder="e.g., Celebrating Excellence"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSubtitle">Description</Label>
                <Textarea
                  id="heroSubtitle"
                  rows={2}
                  value={heroBanner.subtitle}
                  onChange={(e) =>
                    setHeroBanner({ ...heroBanner, subtitle: e.target.value })
                  }
                  placeholder="Describe the purpose and impact..."
                />
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
                    Key metrics about the Science Fairs program
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
                  <Card key={stat.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-[#00BFA6]">
                          {getIconComponent(stat.icon)}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editStatistic(stat)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteStatistic(stat.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-2xl font-bold text-[#00BFA6]">
                            {stat.number || "0"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {stat.label || "No label"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {statistics.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No statistics added yet. Click "Add Statistic" to get
                    started.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* National Recognition Journey - Made dynamic with add/edit/delete */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Journey to National Recognition</CardTitle>
                  <CardDescription>
                    Stages from community to national level
                  </CardDescription>
                </div>
                <Button
                  onClick={addJourneyStage}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Recognition Stage
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journeyStages.map((stage, index) => (
                  <Card key={stage.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Stage {index + 1}</Badge>
                            <Badge className="bg-[#00BFA6] text-white">
                              {stage.badge}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg">
                            {stage.title}
                          </h3>
                          <p className="text-[#00BFA6] font-semibold">
                            {stage.number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {stage.description}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editJourneyStage(stage)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteJourneyStage(stage.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Winner Projects Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Celebrating Excellence - Winner Projects
                  </CardTitle>
                  <CardDescription>
                    Showcase winning projects from the national competition
                  </CardDescription>
                </div>
                <Button
                  onClick={addWinnerProject}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Winner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {winnerProjects.map((project) => {
                  // Validate image URL - only show if it's a valid URL
                  const imageSrc = typeof project.image === "string"
                    ? project.image
                    : project.imagePreview || null;
                  
                  const isValidImageUrl = imageSrc &&
                    imageSrc.trim() !== "" &&
                    imageSrc.length > 3 &&
                    !imageSrc.match(/^[a-z]+$/i) && // Not just letters like "nnnnnn"
                    (imageSrc.startsWith("http://") ||
                      imageSrc.startsWith("https://") ||
                      imageSrc.startsWith("data:") ||
                      imageSrc.startsWith("/"));
                  
                  return (
                    <Card key={project.id} className="overflow-hidden">
                      {isValidImageUrl && (
                        <div className="h-48 overflow-hidden bg-muted">
                          <img
                            src={imageSrc}
                            alt={project.projectTitle}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Hide image on error
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                      )}
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-balance">
                            {project.projectTitle || "Untitled Project"}
                          </h3>
                        <Badge className="bg-[#00BFA6] text-white shrink-0">
                          {project.placementBadge}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">{project.studentName}</p>
                        <p className="text-muted-foreground text-xs">
                          {project.university}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => editWinnerProject(project)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteWinnerProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
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

      {/* Winner Project Dialog */}
      <Dialog
        open={isWinnerDialogOpen}
        onOpenChange={(open) => {
          if (
            !open &&
            editingWinner?.imagePreview &&
            editingWinner.image instanceof File
          ) {
            URL.revokeObjectURL(editingWinner.imagePreview);
          }
          setIsWinnerDialogOpen(open);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingWinner?.projectTitle || "New Winner Project"}
            </DialogTitle>
            <DialogDescription>
              Add or edit a winning project showcase
            </DialogDescription>
          </DialogHeader>

          {editingWinner && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="placement">Placement</Label>
                  <Input
                    id="placement"
                    placeholder="e.g., 1st, 2nd, 3rd"
                    value={editingWinner.placement}
                    onChange={(e) =>
                      setEditingWinner({
                        ...editingWinner,
                        placement: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placementBadge">Placement Badge</Label>
                  <Input
                    id="placementBadge"
                    placeholder="e.g., 1st Place National 2024"
                    value={editingWinner.placementBadge}
                    onChange={(e) =>
                      setEditingWinner({
                        ...editingWinner,
                        placementBadge: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  id="projectTitle"
                  placeholder="e.g., Solar-Powered Water Purification"
                  value={editingWinner.projectTitle}
                  onChange={(e) =>
                    setEditingWinner({
                      ...editingWinner,
                      projectTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    placeholder="e.g., Meron Tadesse"
                    value={editingWinner.studentName}
                    onChange={(e) =>
                      setEditingWinner({
                        ...editingWinner,
                        studentName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="university">University/Center</Label>
                  <Input
                    id="university"
                    placeholder="e.g., Hawassa University STEM Center"
                    value={editingWinner.university}
                    onChange={(e) =>
                      setEditingWinner({
                        ...editingWinner,
                        university: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Describe the project and its impact..."
                  value={editingWinner.description}
                  onChange={(e) =>
                    setEditingWinner({
                      ...editingWinner,
                      description: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.stopPropagation();
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectImage">Project Image</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Input
                      id="projectImage"
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
                        document.getElementById("projectImage")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  {(editingWinner.image || editingWinner.imagePreview) && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                      <img
                        src={
                          editingWinner.imagePreview ||
                          (typeof editingWinner.image === "string"
                            ? editingWinner.image
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
                  onClick={() => setIsWinnerDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveWinnerProject}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Project
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Journey Stage Dialog */}
      <Dialog open={isJourneyDialogOpen} onOpenChange={setIsJourneyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingJourneyStage?.title || "New Recognition Stage"}
            </DialogTitle>
            <DialogDescription>
              Add or edit a recognition stage in the journey
            </DialogDescription>
          </DialogHeader>

          {editingJourneyStage && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stageBadge">Badge Text</Label>
                  <Input
                    id="stageBadge"
                    placeholder="e.g., Starting Point"
                    value={editingJourneyStage.badge}
                    onChange={(e) =>
                      setEditingJourneyStage({
                        ...editingJourneyStage,
                        badge: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stageTitle">Title</Label>
                  <Input
                    id="stageTitle"
                    placeholder="e.g., Community Level"
                    value={editingJourneyStage.title}
                    onChange={(e) =>
                      setEditingJourneyStage({
                        ...editingJourneyStage,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stageNumber">Number/Metric</Label>
                <Input
                  id="stageNumber"
                  placeholder="e.g., 1,000+ students"
                  value={editingJourneyStage.number}
                  onChange={(e) =>
                    setEditingJourneyStage({
                      ...editingJourneyStage,
                      number: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stageDescription">Description</Label>
                <Textarea
                  id="stageDescription"
                  rows={3}
                  placeholder="Describe this stage..."
                  value={editingJourneyStage.description}
                  onChange={(e) =>
                    setEditingJourneyStage({
                      ...editingJourneyStage,
                      description: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.stopPropagation();
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsJourneyDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveJourneyStage}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Stage
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Statistic Dialog */}
      <Dialog
        open={isStatisticDialogOpen}
        onOpenChange={setIsStatisticDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStatistic?.label || "New Statistic"}
            </DialogTitle>
            <DialogDescription>
              Add or edit a statistic for the Science Fairs program
            </DialogDescription>
          </DialogHeader>

          {editingStatistic && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="statIcon">Icon</Label>
                <Select
                  value={editingStatistic.icon}
                  onValueChange={(value) =>
                    setEditingStatistic({ ...editingStatistic, icon: value })
                  }
                >
                  <SelectTrigger id="statIcon" className="w-full">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Users
                      </div>
                    </SelectItem>
                    <SelectItem value="target">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Target
                      </div>
                    </SelectItem>
                    <SelectItem value="trophy">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Trophy
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="statNumber">Number/Value</Label>
                <Input
                  id="statNumber"
                  placeholder="e.g., 1,000+ or 50"
                  value={editingStatistic.number}
                  onChange={(e) =>
                    setEditingStatistic({
                      ...editingStatistic,
                      number: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statLabel">Label</Label>
                <Input
                  id="statLabel"
                  placeholder="e.g., Students Annually"
                  value={editingStatistic.label}
                  onChange={(e) =>
                    setEditingStatistic({
                      ...editingStatistic,
                      label: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsStatisticDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveStatistic}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Statistic
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
