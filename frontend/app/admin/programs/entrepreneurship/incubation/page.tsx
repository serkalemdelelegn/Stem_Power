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
  FileText,
  BookOpen,
  Zap,
  Image as ImageIcon,
  Link as LinkIcon,
  Calendar,
} from "lucide-react";
import {
  fetchHero,
  fetchAdminStatistics,
  fetchAdminPhases,
  fetchAdminSuccessStories,
  createHero,
  updateHero,
  getHeroId,
  createStatistic,
  updateStatistic,
  deleteStatistic,
  createPhase as createPhaseAPI,
  updatePhase as updatePhaseAPI,
  deletePhase as deletePhaseAPI,
  createSuccessStory as createSuccessStoryAPI,
  updateSuccessStory as updateSuccessStoryAPI,
  deleteSuccessStory as deleteSuccessStoryAPI,
  type AdminHero,
  type AdminStat,
  type AdminPhase,
  type AdminSuccessStory,
} from "@/lib/api-programs/entrepreneurship/api-programs-entrepreneurship-incubation";

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

interface IncubationPhase {
  id: string;
  title: string;
  duration: string;
  badge: string;
  description: string;
  icon: string;
  iconColor: string;
  email?: string;
  startDate?: string | null;
  image?: string | File | null;
  googleFormLink?: string | null;
  imagePreview?: string; // For displaying preview of File objects
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

const iconMap = {
  rocket: Rocket,
  trending: TrendingUp,
  users: Users,
  dollar: DollarSign,
};

const phaseIconMap = {
  fileText: FileText,
  book: BookOpen,
  zap: Zap,
  rocket: Rocket,
};

export default function IncubationPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isAddStatOpen, setIsAddStatOpen] = useState(false);
  const [isAddStoryOpen, setIsAddStoryOpen] = useState(false);
  const [isAddPhaseOpen, setIsAddPhaseOpen] = useState(false);
  const [isEditStoryOpen, setIsEditStoryOpen] = useState(false);
  const [isEditPhaseOpen, setIsEditPhaseOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [editingPhase, setEditingPhase] = useState<IncubationPhase | null>(
    null
  );

  const [heroSection, setHeroSection] = useState<HeroSection>({
    title: "Incubation Program",
    description:
      "Nurturing early-stage startups with workspace, resources, mentorship, and strategic support to accelerate growth and market readiness.",
  });

  const [stats, setStats] = useState<StatCard[]>([]);
  const [incubationPhases, setIncubationPhases] = useState<IncubationPhase[]>(
    []
  );
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);

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

        // Fetch phases
        const phasesData = await fetchAdminPhases();
        setIncubationPhases(phasesData);

        // Fetch success stories
        const storiesData = await fetchAdminSuccessStories();
        setSuccessStories(storiesData);
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

  const [newStory, setNewStory] = useState<Omit<SuccessStory, "id">>({
    businessName: "",
    licenseStatus: "Licensed",
    category: "",
    categoryColor: "blue",
    contactPerson: "",
    phone: "",
    email: "",
  });

  const [newPhase, setNewPhase] = useState<
    Omit<IncubationPhase, "id"> & { imagePreview?: string }
  >({
    title: "",
    duration: "",
    badge: "",
    description: "",
    icon: "fileText",
    iconColor: "teal",
    email: "info@stempower.org",
    startDate: "",
    image: "",
    googleFormLink: "",
  });

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
      alert("Incubation page updated successfully!");
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

  const addSuccessStory = async () => {
    if (newStory.businessName && newStory.category && newStory.contactPerson) {
      try {
        // Transform admin format to backend format
        const backendData = {
          business_name: newStory.businessName.trim(),
          license_status: newStory.licenseStatus || null,
          category: newStory.category.trim(),
          category_color: newStory.categoryColor || null,
          contact_person: newStory.contactPerson.trim() || null,
          phone: newStory.phone.trim() || null,
          email: (newStory.email && newStory.email.trim()) || null,
        };

        const backendStory = await createSuccessStoryAPI(backendData);

        // Transform back to admin format
        const newItem: AdminSuccessStory = {
          id: backendStory.id,
          businessName: backendStory.business_name,
          licenseStatus: backendStory.license_status || "Licensed",
          category: backendStory.category,
          categoryColor: backendStory.category_color || "blue",
          contactPerson: backendStory.contact_person || "",
          phone: backendStory.phone || "",
          email: backendStory.email || "",
        };

        setSuccessStories([...successStories, newItem]);
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
        alert(
          error.message || "Failed to add success story. Please try again."
        );
      }
    }
  };

  const updateSuccessStory = async () => {
    if (editingStory) {
      try {
        // Transform admin format to backend format
        const backendData: any = {};
        if (editingStory.businessName !== undefined)
          backendData.business_name = editingStory.businessName.trim();
        if (editingStory.licenseStatus !== undefined)
          backendData.license_status = editingStory.licenseStatus || null;
        if (editingStory.category !== undefined)
          backendData.category = editingStory.category.trim();
        if (editingStory.categoryColor !== undefined)
          backendData.category_color = editingStory.categoryColor || null;
        if (editingStory.contactPerson !== undefined)
          backendData.contact_person =
            editingStory.contactPerson.trim() || null;
        if (editingStory.phone !== undefined)
          backendData.phone = editingStory.phone.trim() || null;
        if (editingStory.email !== undefined)
          backendData.email =
            (editingStory.email && editingStory.email.trim()) || null;

        const backendStory = await updateSuccessStoryAPI(
          editingStory.id,
          backendData
        );

        // Transform back to admin format
        const updated: AdminSuccessStory = {
          id: backendStory.id,
          businessName: backendStory.business_name,
          licenseStatus: backendStory.license_status || "Licensed",
          category: backendStory.category,
          categoryColor: backendStory.category_color || "blue",
          contactPerson: backendStory.contact_person || "",
          phone: backendStory.phone || "",
          email: backendStory.email || "",
        };

        setSuccessStories(
          successStories.map((s) => (s.id === editingStory.id ? updated : s))
        );
        setEditingStory(null);
        setIsEditStoryOpen(false);
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
      await deleteSuccessStoryAPI(id);
      setSuccessStories(successStories.filter((s) => s.id !== id));
    } catch (error: any) {
      console.error("Failed to delete success story:", error);
      alert(
        error.message || "Failed to delete success story. Please try again."
      );
    }
  };

  const addPhase = async () => {
    if (newPhase.title && newPhase.duration && newPhase.description) {
      try {
        // Transform admin format to backend format
        // Note: Backend doesn't support icon, iconColor, badge - these are frontend-only
        const backendData = {
          program_title: newPhase.title.trim(),
          email: "info@stempower.org", // Required field
          about: "open" as "open" | "closed",
          status: "free" as "free" | "paid",
          duration: (newPhase.duration && newPhase.duration.trim()) || null,
          description:
            (newPhase.description && newPhase.description.trim()) || null,
          start_date:
            newPhase.startDate && newPhase.startDate.trim()
              ? new Date(newPhase.startDate + "T00:00:00").toISOString()
              : null,
          google_form_link:
            newPhase.googleFormLink && newPhase.googleFormLink.trim()
              ? (() => {
                  const trimmed = newPhase.googleFormLink.trim();
                  // If it doesn't start with http:// or https://, add https://
                  if (
                    !trimmed.startsWith("http://") &&
                    !trimmed.startsWith("https://")
                  ) {
                    return `https://${trimmed}`;
                  }
                  return trimmed;
                })()
              : null,
          image: newPhase.image || null, // Can be File or string
        };

        const backendCourse = await createPhaseAPI(backendData);

        // Transform back to IncubationPhase format, preserving frontend-only fields
        const newItem: IncubationPhase = {
          id: backendCourse.id,
          title: backendCourse.program_title || newPhase.title,
          duration: backendCourse.duration || "",
          badge: newPhase.badge || "",
          description: backendCourse.description || "",
          icon: newPhase.icon || "fileText",
          iconColor: newPhase.iconColor || "teal",
          email: backendCourse.email || newPhase.email || "info@stempower.org",
          startDate: backendCourse.start_date
            ? (() => {
                const date = new Date(backendCourse.start_date);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
              })()
            : newPhase.startDate || null,
          image: backendCourse.image || null,
          googleFormLink:
            backendCourse.google_form_link || newPhase.googleFormLink || null,
        };

        setIncubationPhases([...incubationPhases, newItem]);
        setNewPhase({
          title: "",
          duration: "",
          badge: "",
          description: "",
          icon: "fileText",
          iconColor: "teal",
          email: "info@stempower.org",
          startDate: "",
          image: null,
          imagePreview: undefined,
          googleFormLink: "",
        });
        setIsAddPhaseOpen(false);
      } catch (error: any) {
        console.error("Failed to add phase:", error);
        alert(error.message || "Failed to add phase. Please try again.");
      }
    }
  };

  const updatePhase = async () => {
    if (editingPhase) {
      try {
        // Transform admin format to backend format
        const backendData: any = {};
        if (editingPhase.title !== undefined)
          backendData.program_title = editingPhase.title.trim();
        if (editingPhase.duration !== undefined)
          backendData.duration =
            (editingPhase.duration && editingPhase.duration.trim()) || null;
        if (editingPhase.description !== undefined)
          backendData.description =
            (editingPhase.description && editingPhase.description.trim()) ||
            null;
        if (editingPhase.email !== undefined)
          backendData.email =
            (editingPhase.email && editingPhase.email.trim()) ||
            "info@stempower.org";
        if (editingPhase.startDate !== undefined) {
          backendData.start_date =
            editingPhase.startDate && editingPhase.startDate.trim()
              ? new Date(editingPhase.startDate + "T00:00:00").toISOString()
              : null;
        }
        if (editingPhase.image !== undefined)
          backendData.image = editingPhase.image || null; // Can be File or string
        if (editingPhase.googleFormLink !== undefined) {
          backendData.google_form_link =
            editingPhase.googleFormLink && editingPhase.googleFormLink.trim()
              ? (() => {
                  const trimmed = editingPhase.googleFormLink.trim();
                  // If it doesn't start with http:// or https://, add https://
                  if (
                    !trimmed.startsWith("http://") &&
                    !trimmed.startsWith("https://")
                  ) {
                    return `https://${trimmed}`;
                  }
                  return trimmed;
                })()
              : null;
        }

        const backendCourse = await updatePhaseAPI(
          editingPhase.id,
          backendData
        );

        // Transform back to admin format, preserving frontend-only fields
        const updated: AdminPhase = {
          id: backendCourse.id,
          title: backendCourse.program_title || editingPhase.title,
          duration: backendCourse.duration || "",
          badge: editingPhase.badge || "",
          description: backendCourse.description || "",
          icon: editingPhase.icon || "fileText",
          iconColor: editingPhase.iconColor || "teal",
          email:
            backendCourse.email || editingPhase.email || "info@stempower.org",
          startDate: backendCourse.start_date
            ? (() => {
                const date = new Date(backendCourse.start_date);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const day = String(date.getDate()).padStart(2, "0");
                return `${year}-${month}-${day}`;
              })()
            : editingPhase.startDate || null,
          image: backendCourse.image || editingPhase.image || null,
          googleFormLink:
            backendCourse.google_form_link ||
            editingPhase.googleFormLink ||
            null,
        };

        setIncubationPhases(
          incubationPhases.map((p) => (p.id === editingPhase.id ? updated : p))
        );
        // Clean up preview URL if it exists
        if (editingPhase.imagePreview) {
          URL.revokeObjectURL(editingPhase.imagePreview);
        }
        setEditingPhase(null);
        setIsEditPhaseOpen(false);
      } catch (error: any) {
        console.error("Failed to update phase:", error);
        alert(error.message || "Failed to update phase. Please try again.");
      }
    }
  };

  const deletePhase = async (id: string) => {
    try {
      await deletePhaseAPI(id);
      setIncubationPhases(incubationPhases.filter((p) => p.id !== id));
    } catch (error: any) {
      console.error("Failed to delete phase:", error);
      alert(error.message || "Failed to delete phase. Please try again.");
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
        title="Incubation Program"
        description="Manage incubation content, statistics, and success stories"
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Incubation Program Phases</CardTitle>
                  <CardDescription>
                    Manage the stages of your incubation program
                  </CardDescription>
                </div>
                <Dialog open={isAddPhaseOpen} onOpenChange={setIsAddPhaseOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Phase
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Add Program Phase</DialogTitle>
                      <DialogDescription>
                        Add a new phase to your incubation program
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 overflow-y-auto flex-1">
                      <div className="space-y-2">
                        <Label>Phase Title</Label>
                        <Input
                          placeholder="e.g., Application & Selection"
                          value={newPhase.title}
                          onChange={(e) =>
                            setNewPhase({ ...newPhase, title: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input
                            placeholder="e.g., 2-4 weeks"
                            value={newPhase.duration}
                            onChange={(e) =>
                              setNewPhase({
                                ...newPhase,
                                duration: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Badge Text</Label>
                          <Input
                            placeholder="e.g., Getting Started"
                            value={newPhase.badge}
                            onChange={(e) =>
                              setNewPhase({
                                ...newPhase,
                                badge: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Icon</Label>
                          <Select
                            value={newPhase.icon}
                            onValueChange={(value) =>
                              setNewPhase({ ...newPhase, icon: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="fileText">Document</SelectItem>
                              <SelectItem value="book">Book</SelectItem>
                              <SelectItem value="zap">Lightning</SelectItem>
                              <SelectItem value="rocket">Rocket</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Icon Color</Label>
                          <Select
                            value={newPhase.iconColor}
                            onValueChange={(value) =>
                              setNewPhase({ ...newPhase, iconColor: value })
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
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={4}
                          placeholder="Describe this phase of the program..."
                          value={newPhase.description}
                          onChange={(e) =>
                            setNewPhase({
                              ...newPhase,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phase-email">
                          <Mail className="inline h-4 w-4 mr-2" />
                          Contact Email
                        </Label>
                        <Input
                          id="phase-email"
                          type="email"
                          placeholder="info@stempower.org"
                          value={newPhase.email || ""}
                          onChange={(e) =>
                            setNewPhase({
                              ...newPhase,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phase-start-date">
                          <Calendar className="inline h-4 w-4 mr-2" />
                          Start Date
                        </Label>
                        <Input
                          id="phase-start-date"
                          type="date"
                          value={newPhase.startDate || ""}
                          onChange={(e) =>
                            setNewPhase({
                              ...newPhase,
                              startDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phase-image">
                          <ImageIcon className="inline h-4 w-4 mr-2" />
                          Image
                        </Label>
                        <div className="space-y-3">
                          <Input
                            id="phase-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Clean up old preview URL if it exists
                                if (newPhase.imagePreview) {
                                  URL.revokeObjectURL(newPhase.imagePreview);
                                }
                                // Store the File object and create a preview URL for display
                                const previewUrl = URL.createObjectURL(file);
                                setNewPhase({
                                  ...newPhase,
                                  image: file, // Store File object instead of URL
                                  imagePreview: previewUrl, // For preview display
                                });
                              }
                            }}
                          />
                          {(newPhase.image || newPhase.imagePreview) && (
                            <div className="h-48 rounded-lg overflow-hidden border">
                              <img
                                src={
                                  newPhase.imagePreview ||
                                  (typeof newPhase.image === "string"
                                    ? newPhase.image
                                    : "/placeholder.svg")
                                }
                                alt="Phase preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phase-google-form">
                          <LinkIcon className="inline h-4 w-4 mr-2" />
                          Google Form Link
                        </Label>
                        <Input
                          id="phase-google-form"
                          placeholder="https://forms.google.com/..."
                          value={newPhase.googleFormLink || ""}
                          onChange={(e) =>
                            setNewPhase({
                              ...newPhase,
                              googleFormLink: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        onClick={addPhase}
                        className="w-full bg-[#00BFA6] hover:bg-[#00A693]"
                      >
                        Add Phase
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incubationPhases.map((phase) => {
                  const PhaseIcon =
                    phaseIconMap[phase.icon as keyof typeof phaseIconMap];
                  return (
                    <Card key={phase.id} className="relative group">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl ${getIconColorClass(
                              phase.iconColor
                            )} flex items-center justify-center shrink-0`}
                          >
                            <PhaseIcon className="h-6 w-6 text-white" />
                          </div>
                          {phase.badge && (
                            <span className="text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-700">
                              {phase.badge}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-lg mb-1">
                          {phase.title}
                        </h3>
                        <p className="text-sm text-[#00BFA6] font-medium mb-3">
                          Duration: {phase.duration}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {phase.description}
                        </p>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Dialog
                            open={isEditPhaseOpen}
                            onOpenChange={setIsEditPhaseOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingPhase({
                                    ...phase,
                                    image: phase.image, // This will be a string URL for existing items
                                    imagePreview: undefined, // No preview needed for existing URLs
                                  });
                                  setIsEditPhaseOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                              <DialogHeader>
                                <DialogTitle>Edit Program Phase</DialogTitle>
                              </DialogHeader>
                              {editingPhase && (
                                <div className="space-y-4 py-4 overflow-y-auto flex-1">
                                  <div className="space-y-2">
                                    <Label>Phase Title</Label>
                                    <Input
                                      value={editingPhase.title}
                                      onChange={(e) =>
                                        setEditingPhase({
                                          ...editingPhase,
                                          title: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Duration</Label>
                                      <Input
                                        value={editingPhase.duration}
                                        onChange={(e) =>
                                          setEditingPhase({
                                            ...editingPhase,
                                            duration: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Badge Text</Label>
                                      <Input
                                        value={editingPhase.badge}
                                        onChange={(e) =>
                                          setEditingPhase({
                                            ...editingPhase,
                                            badge: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Icon</Label>
                                      <Select
                                        value={editingPhase.icon}
                                        onValueChange={(value) =>
                                          setEditingPhase({
                                            ...editingPhase,
                                            icon: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="fileText">
                                            Document
                                          </SelectItem>
                                          <SelectItem value="book">
                                            Book
                                          </SelectItem>
                                          <SelectItem value="zap">
                                            Lightning
                                          </SelectItem>
                                          <SelectItem value="rocket">
                                            Rocket
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Icon Color</Label>
                                      <Select
                                        value={editingPhase.iconColor}
                                        onValueChange={(value) =>
                                          setEditingPhase({
                                            ...editingPhase,
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
                                  <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                      rows={4}
                                      value={editingPhase.description}
                                      onChange={(e) =>
                                        setEditingPhase({
                                          ...editingPhase,
                                          description: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-phase-email">
                                      <Mail className="inline h-4 w-4 mr-2" />
                                      Contact Email
                                    </Label>
                                    <Input
                                      id="edit-phase-email"
                                      type="email"
                                      placeholder="info@stempower.org"
                                      value={editingPhase.email || ""}
                                      onChange={(e) =>
                                        setEditingPhase({
                                          ...editingPhase,
                                          email: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-phase-start-date">
                                      <Calendar className="inline h-4 w-4 mr-2" />
                                      Start Date
                                    </Label>
                                    <Input
                                      id="edit-phase-start-date"
                                      type="date"
                                      value={editingPhase.startDate || ""}
                                      onChange={(e) =>
                                        setEditingPhase({
                                          ...editingPhase,
                                          startDate: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-phase-image">
                                      <ImageIcon className="inline h-4 w-4 mr-2" />
                                      Image
                                    </Label>
                                    <div className="space-y-3">
                                      <Input
                                        id="edit-phase-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file && editingPhase) {
                                            // Clean up old preview URL if it exists
                                            if (editingPhase.imagePreview) {
                                              URL.revokeObjectURL(
                                                editingPhase.imagePreview
                                              );
                                            }
                                            // Store the File object and create a preview URL for display
                                            const previewUrl =
                                              URL.createObjectURL(file);
                                            setEditingPhase({
                                              ...editingPhase,
                                              image: file, // Store File object instead of URL
                                              imagePreview: previewUrl, // For preview display
                                            });
                                          }
                                        }}
                                      />
                                      {(editingPhase.image ||
                                        editingPhase.imagePreview) && (
                                        <div className="h-48 rounded-lg overflow-hidden border">
                                          <img
                                            src={
                                              editingPhase.imagePreview ||
                                              (typeof editingPhase.image ===
                                              "string"
                                                ? editingPhase.image
                                                : "/placeholder.svg")
                                            }
                                            alt="Phase preview"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-phase-google-form">
                                      <LinkIcon className="inline h-4 w-4 mr-2" />
                                      Google Form Link
                                    </Label>
                                    <Input
                                      id="edit-phase-google-form"
                                      placeholder="https://forms.google.com/..."
                                      value={editingPhase.googleFormLink || ""}
                                      onChange={(e) =>
                                        setEditingPhase({
                                          ...editingPhase,
                                          googleFormLink: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <Button
                                    onClick={updatePhase}
                                    className="w-full bg-[#00BFA6] hover:bg-[#00A693]"
                                  >
                                    Update Phase
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deletePhase(phase.id)}
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

          {/* Success Stories Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Success Stories</CardTitle>
                  <CardDescription>
                    Showcase businesses incubated through your program
                  </CardDescription>
                </div>
                <Dialog open={isAddStoryOpen} onOpenChange={setIsAddStoryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Success Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Add Success Story</DialogTitle>
                      <DialogDescription>
                        Add a new business success story
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 overflow-y-auto flex-1">
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
                          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
                            <DialogHeader>
                              <DialogTitle>Edit Success Story</DialogTitle>
                            </DialogHeader>
                            {editingStory && (
                              <div className="space-y-4 py-4 overflow-y-auto flex-1">
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
                                  onClick={updateSuccessStory}
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
