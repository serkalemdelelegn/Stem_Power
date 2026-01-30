"use client";

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
  MessageSquare,
  Users2,
  Lightbulb,
  Clock,
  Target,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import {
  fetchHero,
  fetchAdminStatistics,
  fetchAdminPrograms,
  createHero,
  updateHero,
  getHeroId,
  createStatistic,
  updateStatistic,
  deleteStatistic,
  createProgram as createProgramAPI,
  updateProgram as updateProgramAPI,
  deleteProgram as deleteProgramAPI,
  type AdminHero,
  type AdminStat,
  type AdminProgram,
} from "@/lib/api-programs/entrepreneurship/api-programs-entrepreneurship-soft-skills";

interface HeroSection {
  title: string;
  description: string;
}

interface StatCard {
  id: string;
  icon: string;
  value: string;
  label: string;
}

interface SkillProgram {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  projectCount: string;
  duration: string;
  level: string;
  description: string;
  skills: string[];
  image?: string | File | null;
  imagePreview?: string; // For displaying preview of File objects
  startDate?: string;
  googleFormLink?: string;
}

const iconMap = {
  rocket: Rocket,
  trending: TrendingUp,
  users: Users,
  dollar: DollarSign,
};

const programIconMap = {
  messageSquare: MessageSquare,
  users2: Users2,
  lightbulb: Lightbulb,
};

export default function SoftSkillsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isAddStatOpen, setIsAddStatOpen] = useState(false);
  const [isAddProgramOpen, setIsAddProgramOpen] = useState(false);
  const [isEditProgramOpen, setIsEditProgramOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<SkillProgram | null>(
    null
  );

  const [heroSection, setHeroSection] = useState<HeroSection>({
    title: "Soft Skills Development",
    description:
      "Essential soft skills training to enhance communication, leadership, teamwork, and professional effectiveness in the workplace.",
  });

  const [stats, setStats] = useState<StatCard[]>([]);
  const [programs, setPrograms] = useState<SkillProgram[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hero
        const heroData = await fetchHero();
        if (heroData) {
          setHeroSection({
            title: heroData.title || "",
            description: heroData.description || "",
          });
        }

        // Fetch stats
        const statsData = await fetchAdminStatistics();
        setStats(statsData);

        // Fetch programs
        const programsData = await fetchAdminPrograms();
        // Transform AdminProgram to SkillProgram format
        setPrograms(
          programsData.map((p: AdminProgram) => ({
            id: p.id,
            title: p.title,
            icon: p.icon,
            iconColor: p.iconColor,
            projectCount: p.projectCount,
            duration: p.duration,
            level: p.level,
            description: p.description,
            skills: p.skills,
            image: typeof p.image === "string" ? p.image : null, // Only keep string URLs, not File objects
            startDate: p.startDate || "",
            googleFormLink: p.googleFormLink || "",
          }))
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const [newStat, setNewStat] = useState<Omit<StatCard, "id">>({
    icon: "rocket",
    value: "",
    label: "",
  });

  const [newProgram, setNewProgram] = useState<
    Omit<SkillProgram, "id"> & { imagePreview?: string }
  >({
    title: "",
    icon: "messageSquare",
    iconColor: "teal",
    projectCount: "",
    duration: "",
    level: "",
    description: "",
    skills: [],
    image: null,
    imagePreview: undefined,
    startDate: "",
    googleFormLink: "",
  });

  const [skillInput, setSkillInput] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Try to get existing hero ID to update, otherwise create new
      const heroId = await getHeroId();
      if (heroId) {
        await updateHero(heroId, heroSection);
      } else {
        await createHero(heroSection);
      }
      alert("Soft Skills page updated successfully!");
    } catch (error: any) {
      console.error("Failed to save:", error);
      alert(error.message || "Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const addStat = async () => {
    if (newStat.value && newStat.label) {
      try {
        const backendStat = await createStatistic({
          title: newStat.label,
          value: newStat.value,
          icon: newStat.icon || null,
        });
        const newItem: AdminStat = {
          id: backendStat.id,
          icon: backendStat.icon || "rocket",
          value: backendStat.value,
          label: backendStat.title,
        };
        setStats([...stats, newItem]);
        setNewStat({ icon: "rocket", value: "", label: "" });
        setIsAddStatOpen(false);
      } catch (error: any) {
        console.error("Failed to add stat:", error);
        alert(error.message || "Failed to add stat. Please try again.");
      }
    }
  };

  const deleteStat = async (id: string) => {
    try {
      await deleteStatistic(id);
      setStats(stats.filter((s) => s.id !== id));
    } catch (error: any) {
      console.error("Failed to delete stat:", error);
      alert(error.message || "Failed to delete stat. Please try again.");
    }
  };

  const addProgram = async () => {
    if (newProgram.title && newProgram.description) {
      try {
        // Transform admin format to backend format
        // Note: Backend doesn't support topics/skills, icon, iconColor, projectCount
        // These are frontend-only fields that will be preserved
        const backendData = {
          program_title: newProgram.title.trim(),
          email: "info@stempower.org", // Required field, use default
          about: (newProgram.level === "Closed" ? "closed" : "open") as
            | "open"
            | "closed",
          status: "free" as "free" | "paid", // Default to free
          duration: (newProgram.duration && newProgram.duration.trim()) || null,
          description:
            (newProgram.description && newProgram.description.trim()) || null,
          image: newProgram.image || null, // Can be File or string
          start_date:
            newProgram.startDate && newProgram.startDate.trim()
              ? new Date(newProgram.startDate + "T00:00:00").toISOString()
              : null,
          google_form_link:
            (newProgram.googleFormLink && newProgram.googleFormLink.trim()) ||
            null,
        };

        const backendProgram = await createProgramAPI(backendData);

        // Transform back to SkillProgram format, preserving frontend-only fields
        const newItem: SkillProgram = {
          id: backendProgram.id,
          title: backendProgram.program_title || newProgram.title,
          icon: newProgram.icon || "messageSquare",
          iconColor: newProgram.iconColor || "teal",
          projectCount: newProgram.projectCount || "",
          duration: backendProgram.duration || "",
          level: backendProgram.about === "closed" ? "Closed" : "Open",
          description: backendProgram.description || "",
          skills: newProgram.skills || [],
          image: backendProgram.image || null,
        };

        setPrograms([...programs, newItem]);
        // Clean up preview URL if it exists
        if (newProgram.imagePreview) {
          URL.revokeObjectURL(newProgram.imagePreview);
        }
        setNewProgram({
          title: "",
          icon: "messageSquare",
          iconColor: "teal",
          projectCount: "",
          duration: "",
          level: "",
          description: "",
          skills: [],
          image: null,
          imagePreview: undefined,
          startDate: "",
          googleFormLink: "",
        });
        setIsAddProgramOpen(false);
      } catch (error: any) {
        console.error("Failed to add program:", error);
        alert(error.message || "Failed to add program. Please try again.");
      }
    }
  };

  const updateProgram = async () => {
    if (editingProgram) {
      try {
        // Transform admin format to backend format
        const backendData: any = {};
        if (editingProgram.title !== undefined)
          backendData.program_title = editingProgram.title.trim();
        if (editingProgram.level !== undefined)
          backendData.about =
            editingProgram.level === "Closed" ? "closed" : "open";
        if (editingProgram.duration !== undefined)
          backendData.duration =
            (editingProgram.duration && editingProgram.duration.trim()) || null;
        if (editingProgram.description !== undefined)
          backendData.description =
            (editingProgram.description && editingProgram.description.trim()) ||
            null;
        if (editingProgram.image !== undefined)
          backendData.image = editingProgram.image || null; // Can be File or string
        if (editingProgram.startDate !== undefined)
          backendData.start_date =
            editingProgram.startDate && editingProgram.startDate.trim()
              ? new Date(editingProgram.startDate + "T00:00:00").toISOString()
              : null;
        if (editingProgram.googleFormLink !== undefined)
          backendData.google_form_link =
            (editingProgram.googleFormLink &&
              editingProgram.googleFormLink.trim()) ||
            null;

        const backendProgram = await updateProgramAPI(
          editingProgram.id,
          backendData
        );

        // Transform back to SkillProgram format, preserving frontend-only fields
        const updated: SkillProgram = {
          id: backendProgram.id,
          title: backendProgram.program_title || editingProgram.title,
          icon: editingProgram.icon || "messageSquare",
          iconColor: editingProgram.iconColor || "teal",
          projectCount: editingProgram.projectCount || "",
          duration: backendProgram.duration || "",
          level: backendProgram.about === "closed" ? "Closed" : "Open",
          description: backendProgram.description || "",
          skills: editingProgram.skills || [],
          image: backendProgram.image || null,
          startDate: editingProgram.startDate || "",
          googleFormLink: editingProgram.googleFormLink || "",
        };

        setPrograms(
          programs.map((p) => (p.id === editingProgram.id ? updated : p))
        );
        // Clean up preview URL if it exists
        if (editingProgram.imagePreview) {
          URL.revokeObjectURL(editingProgram.imagePreview);
        }
        setEditingProgram(null);
        setIsEditProgramOpen(false);
      } catch (error: any) {
        console.error("Failed to update program:", error);
        alert(error.message || "Failed to update program. Please try again.");
      }
    }
  };

  const deleteProgram = async (id: string) => {
    try {
      await deleteProgramAPI(id);
      setPrograms(programs.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error("Failed to delete program:", error);
      alert(error.message || "Failed to delete program. Please try again.");
    }
  };

  const addSkillToNew = () => {
    if (skillInput.trim()) {
      setNewProgram({
        ...newProgram,
        skills: [...newProgram.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkillFromNew = (index: number) => {
    setNewProgram({
      ...newProgram,
      skills: newProgram.skills.filter((_, i) => i !== index),
    });
  };

  const addSkillToEditing = () => {
    if (skillInput.trim() && editingProgram) {
      setEditingProgram({
        ...editingProgram,
        skills: [...editingProgram.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const removeSkillFromEditing = (index: number) => {
    if (editingProgram) {
      setEditingProgram({
        ...editingProgram,
        skills: editingProgram.skills.filter((_, i) => i !== index),
      });
    }
  };

  const getIconColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      teal: "bg-[#00BFA6]",
      cyan: "bg-cyan-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
    };
    return colorMap[color] || colorMap.teal;
  };

  return (
    <div>
      <AdminHeader
        title="Soft Skills Development"
        description="Manage soft skills programs, statistics, and training offerings"
      />
      <div className="p-6 max-w-7xl">
        <div className="space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Main banner title and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

          {/* Soft Skills Programs Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Soft Skills Programs</CardTitle>
                  <CardDescription>
                    Manage your soft skills training programs
                  </CardDescription>
                </div>
                <Dialog
                  open={isAddProgramOpen}
                  onOpenChange={setIsAddProgramOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Program
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add Soft Skills Program</DialogTitle>
                      <DialogDescription>
                        Create a new training program
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                      <div className="space-y-2">
                        <Label>Program Title</Label>
                        <Input
                          placeholder="e.g., Communication & Presentation"
                          value={newProgram.title}
                          onChange={(e) =>
                            setNewProgram({
                              ...newProgram,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={newProgram.icon}
                            onValueChange={(value) =>
                              setNewProgram({ ...newProgram, icon: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="messageSquare">
                                Message Square
                              </SelectItem>
                              <SelectItem value="users2">Users</SelectItem>
                              <SelectItem value="lightbulb">
                                Lightbulb
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Icon Color</Label>
                          <Select
                            value={newProgram.iconColor}
                            onValueChange={(value) =>
                              setNewProgram({ ...newProgram, iconColor: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="teal">Teal</SelectItem>
                              <SelectItem value="cyan">Cyan</SelectItem>
                              <SelectItem value="blue">Blue</SelectItem>
                              <SelectItem value="purple">Purple</SelectItem>
                              <SelectItem value="orange">Orange</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Workshop Count</Label>
                          <Input
                            placeholder="e.g., 6 Workshops"
                            value={newProgram.projectCount}
                            onChange={(e) =>
                              setNewProgram({
                                ...newProgram,
                                projectCount: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            placeholder="e.g., 10 weeks"
                            value={newProgram.duration}
                            onChange={(e) =>
                              setNewProgram({
                                ...newProgram,
                                duration: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Level</Label>
                          <Input
                            placeholder="e.g., All Levels"
                            value={newProgram.level}
                            onChange={(e) =>
                              setNewProgram({
                                ...newProgram,
                                level: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={3}
                          placeholder="Describe the program..."
                          value={newProgram.description}
                          onChange={(e) =>
                            setNewProgram({
                              ...newProgram,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image-url">
                          <ImageIcon className="inline h-4 w-4 mr-2" />
                          Image
                        </Label>
                        <div className="space-y-3">
                          <Input
                            id="image-url"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Clean up old preview URL if it exists
                                if (newProgram.imagePreview) {
                                  URL.revokeObjectURL(newProgram.imagePreview);
                                }
                                // Store the File object and create a preview URL for display
                                const previewUrl = URL.createObjectURL(file);
                                setNewProgram({
                                  ...newProgram,
                                  image: file, // Store File object instead of URL
                                  imagePreview: previewUrl, // For preview display
                                });
                              }
                            }}
                          />
                          {(newProgram.image || newProgram.imagePreview) && (
                            <div className="h-48 rounded-lg overflow-hidden border">
                              <img
                                src={
                                  newProgram.imagePreview ||
                                  (typeof newProgram.image === "string"
                                    ? newProgram.image
                                    : "/placeholder.svg")
                                }
                                alt="Program preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={newProgram.startDate}
                            onChange={(e) =>
                              setNewProgram({
                                ...newProgram,
                                startDate: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Google Form Link</Label>
                          <Input
                            type="url"
                            placeholder="https://forms.google.com/..."
                            value={newProgram.googleFormLink}
                            onChange={(e) =>
                              setNewProgram({
                                ...newProgram,
                                googleFormLink: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Skills/Topics</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a skill or topic"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addSkillToNew())
                            }
                          />
                          <Button
                            type="button"
                            onClick={addSkillToNew}
                            variant="outline"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {newProgram.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="gap-1"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkillFromNew(index)}
                                className="ml-1 hover:text-destructive"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={addProgram}
                        className="w-full bg-[#00BFA6] hover:bg-[#00A693]"
                      >
                        Add Program
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program) => {
                  const ProgramIcon =
                    programIconMap[program.icon as keyof typeof programIconMap];
                  return (
                    <Card key={program.id} className="relative group">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-14 h-14 rounded-xl ${getIconColorClass(
                              program.iconColor
                            )} flex items-center justify-center shrink-0`}
                          >
                            <ProgramIcon className="h-7 w-7 text-white" />
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                            {program.projectCount}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-3">
                          {program.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{program.level}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {program.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {program.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full group/btn bg-transparent"
                        >
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Dialog
                            open={isEditProgramOpen}
                            onOpenChange={setIsEditProgramOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingProgram(program);
                                  setIsEditProgramOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Program</DialogTitle>
                              </DialogHeader>
                              {editingProgram && (
                                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                                  <div className="space-y-2">
                                    <Label>Program Title</Label>
                                    <Input
                                      value={editingProgram.title}
                                      onChange={(e) =>
                                        setEditingProgram({
                                          ...editingProgram,
                                          title: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Icon</Label>
                                      <Select
                                        value={editingProgram.icon}
                                        onValueChange={(value) =>
                                          setEditingProgram({
                                            ...editingProgram,
                                            icon: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="messageSquare">
                                            Message Square
                                          </SelectItem>
                                          <SelectItem value="users2">
                                            Users
                                          </SelectItem>
                                          <SelectItem value="lightbulb">
                                            Lightbulb
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Icon Color</Label>
                                      <Select
                                        value={editingProgram.iconColor}
                                        onValueChange={(value) =>
                                          setEditingProgram({
                                            ...editingProgram,
                                            iconColor: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="teal">
                                            Teal
                                          </SelectItem>
                                          <SelectItem value="cyan">
                                            Cyan
                                          </SelectItem>
                                          <SelectItem value="blue">
                                            Blue
                                          </SelectItem>
                                          <SelectItem value="purple">
                                            Purple
                                          </SelectItem>
                                          <SelectItem value="orange">
                                            Orange
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <Label>Workshop Count</Label>
                                      <Input
                                        value={editingProgram.projectCount}
                                        onChange={(e) =>
                                          setEditingProgram({
                                            ...editingProgram,
                                            projectCount: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Duration</Label>
                                      <Input
                                        value={editingProgram.duration}
                                        onChange={(e) =>
                                          setEditingProgram({
                                            ...editingProgram,
                                            duration: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Level</Label>
                                      <Input
                                        value={editingProgram.level}
                                        onChange={(e) =>
                                          setEditingProgram({
                                            ...editingProgram,
                                            level: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      rows={3}
                                      value={editingProgram.description}
                                      onChange={(e) =>
                                        setEditingProgram({
                                          ...editingProgram,
                                          description: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-image-url">
                                      <ImageIcon className="inline h-4 w-4 mr-2" />
                                      Image
                                    </Label>
                                    <div className="space-y-3">
                                      <Input
                                        id="edit-image-url"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file && editingProgram) {
                                            // Clean up old preview URL if it exists
                                            if (editingProgram.imagePreview) {
                                              URL.revokeObjectURL(
                                                editingProgram.imagePreview
                                              );
                                            }
                                            // Store the File object and create a preview URL for display
                                            const previewUrl =
                                              URL.createObjectURL(file);
                                            setEditingProgram({
                                              ...editingProgram,
                                              image: file, // Store File object instead of URL
                                              imagePreview: previewUrl, // For preview display
                                            });
                                          }
                                        }}
                                      />
                                      {(editingProgram.image ||
                                        editingProgram.imagePreview) && (
                                        <div className="h-48 rounded-lg overflow-hidden border">
                                          <img
                                            src={
                                              editingProgram.imagePreview ||
                                              (typeof editingProgram.image ===
                                              "string"
                                                ? editingProgram.image
                                                : "/placeholder.svg")
                                            }
                                            alt="Program preview"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Skills/Topics</Label>
                                    <div className="flex gap-2">
                                      <Input
                                        placeholder="Add a skill or topic"
                                        value={skillInput}
                                        onChange={(e) =>
                                          setSkillInput(e.target.value)
                                        }
                                        onKeyPress={(e) =>
                                          e.key === "Enter" &&
                                          (e.preventDefault(),
                                          addSkillToEditing())
                                        }
                                      />
                                      <Button
                                        type="button"
                                        onClick={addSkillToEditing}
                                        variant="outline"
                                      >
                                        Add
                                      </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {editingProgram.skills.map(
                                        (skill, index) => (
                                          <Badge
                                            key={index}
                                            variant="secondary"
                                            className="gap-1"
                                          >
                                            {skill}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                removeSkillFromEditing(index)
                                              }
                                              className="ml-1 hover:text-destructive"
                                            >
                                              ×
                                            </button>
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    onClick={updateProgram}
                                    className="w-full bg-[#00BFA6] hover:bg-[#00A693]"
                                  >
                                    Update Program
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteProgram(program.id)}
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
