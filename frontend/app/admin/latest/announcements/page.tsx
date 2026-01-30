"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/ui/admin-header";
import { BackButton } from "@/components/ui/back-button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Upload,
  Bell,
  Briefcase,
  CalendarDays,
  Users,
  TrendingUp,
  Loader2,
  Clock,
  X,
} from "lucide-react";
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
import type { Announcement } from "@/lib/api-types";
import { useToast } from "@/hooks/use-toast";
import { normalizeUrl } from "@/lib/utils";

interface HeroBanner {
  badge: string;
  title: string;
  description: string;
  statistics: {
    activeAnnouncements: string;
    openOpportunities: string;
    upcomingEvents: string;
  };
}

export default function AnnouncementsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroBanner, setHeroBanner] = useState<HeroBanner>({
    badge: "Stay Informed",
    title: "Announcements & Opportunities",
    description:
      "Stay up to date with official updates, exciting opportunities, and upcoming events from STEMpower Ethiopia. Be the first to know about new programs, job openings, and partnership announcements.",
    statistics: {
      activeAnnouncements: "8+",
      openOpportunities: "5+",
      upcomingEvents: "3+",
    },
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] =
    useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    type: "update" as "update" | "opportunity" | "event",
    title: "",
    category: "",
    excerpt: "",
    content: "",
    date: new Date().toISOString().split("T")[0],
    location: "",
    priority: "" as "high" | "medium" | "low" | "",
    image: null as string | File | null,
    imagePreview: undefined as string | undefined,
    deadline: "",
    link: "",
    googleFormUrl: "",
    eventId: "",
  });

  const [heroForm, setHeroForm] = useState(heroBanner);

  const [filterType, setFilterType] = useState<
    "all" | "update" | "opportunity" | "event"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    fetchAnnouncements();
    fetchHeroBanner();
  }, []);

  const fetchHeroBanner = async () => {
    try {
      const response = await fetch("/api/latest/announcements/hero");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setHeroBanner(data);
          setHeroForm(data);
        }
      }
    } catch (error) {
      console.error("Error fetching hero banner:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/latest/announcements");
      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }
      const data = await response.json();
      // Handle both array and data wrapper
      const announcementsArray = Array.isArray(data) ? data : data?.data || [];
      setAnnouncements(announcementsArray);

      // Update hero statistics based on actual data
      const currentDate = new Date();
      const currentAnnouncements = announcementsArray.filter(
        (a: Announcement) => {
          const announcementDate = new Date(a.date);
          return (
            announcementDate >= currentDate ||
            !a.deadline ||
            new Date(a.deadline) >= currentDate
          );
        }
      );
      setHeroBanner({
        ...heroBanner,
        statistics: {
          activeAnnouncements: `${currentAnnouncements.length}+`,
          openOpportunities: `${
            currentAnnouncements.filter(
              (a: Announcement) => a.type === "opportunity"
            ).length
          }+`,
          upcomingEvents: `${
            currentAnnouncements.filter((a: Announcement) => a.type === "event")
              .length
          }+`,
        },
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load announcements",
        variant: "destructive",
      });
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      type: announcement.type,
      title: announcement.title,
      category: announcement.category || "",
      excerpt: announcement.excerpt || "",
      content: announcement.content || "",
      date: announcement.date,
      location: announcement.location,
      priority: announcement.priority || "",
      image: announcement.image || null,
      imagePreview: undefined,
      deadline: announcement.deadline || "",
      link: announcement.link || "",
      googleFormUrl: announcement.googleFormUrl || "",
      eventId: announcement.eventId || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      const response = await fetch(`/api/latest/announcements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete announcement");
      }

      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });

      fetchAnnouncements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      });
      console.error("Error deleting announcement:", error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const announcementData = {
        type: formData.type,
        title: formData.title,
        category:
          formData.category ||
          (formData.type === "update"
            ? "Official Update"
            : formData.type === "opportunity"
            ? "Opportunity"
            : "Event"),
        excerpt:
          formData.excerpt ||
          (formData.content ? formData.content.substring(0, 200) : ""),
        content: formData.content || formData.excerpt || "",
        date: formData.date,
        location: formData.location,
        priority:
          (formData.priority as "high" | "medium" | "low" | undefined) ||
          undefined,
        image: formData.image instanceof File ? null : formData.image || null,
        deadline: formData.deadline || undefined,
        link: normalizeUrl(formData.link) || undefined,
        googleFormUrl: normalizeUrl(formData.googleFormUrl) || undefined,
        eventId: formData.eventId || undefined,
      };

      let response: Response;

      // Check if image is a File object - use FormData
      if (formData.image instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", formData.image);
        Object.keys(announcementData).forEach((key) => {
          const value = (announcementData as Record<string, any>)[key];
          if (value !== null && value !== undefined) {
            formDataToSend.append(
              key,
              typeof value === "string" ? value : JSON.stringify(value)
            );
          }
        });

        const url = editingAnnouncement
          ? `/api/latest/announcements/${editingAnnouncement.id}`
          : "/api/latest/announcements";
        const method = editingAnnouncement ? "PUT" : "POST";

        response = await fetch(url, {
          method,
          body: formDataToSend,
        });
      } else {
        // Use JSON for string URLs or null
        const url = editingAnnouncement
          ? `/api/latest/announcements/${editingAnnouncement.id}`
          : "/api/latest/announcements";
        const method = editingAnnouncement ? "PUT" : "POST";

        response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(announcementData),
        });
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to save" }));
        throw new Error(
          errorData.error || errorData.message || "Failed to save announcement"
        );
      }

      const saved = await response.json();

      // Clean up preview URL
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }

      toast({
        title: "Success",
        description: editingAnnouncement
          ? "Announcement updated successfully"
          : "Announcement created successfully",
      });

      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      setFormData({
        type: "update",
        title: "",
        category: "",
        excerpt: "",
        content: "",
        date: new Date().toISOString().split("T")[0],
        location: "",
        priority: "",
        image: null,
        imagePreview: undefined,
        deadline: "",
        link: "",
        googleFormUrl: "",
        eventId: "",
      });

      fetchAnnouncements();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          (editingAnnouncement
            ? "Failed to update announcement"
            : "Failed to create announcement"),
        variant: "destructive",
      });
      console.error("Error saving announcement:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: file, imagePreview: previewUrl });
    }
  };

  const clearImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData({ ...formData, image: null, imagePreview: undefined });
  };

  const handleSaveHero = async () => {
    try {
      const response = await fetch("/api/latest/announcements/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(heroForm),
      });

      if (!response.ok) {
        throw new Error("Failed to update hero banner");
      }

      setHeroBanner(heroForm);
      toast({
        title: "Success",
        description: "Hero banner updated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hero banner",
        variant: "destructive",
      });
      console.error("Error saving hero banner:", error);
    }
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesType =
      filterType === "all" || announcement.type === filterType;
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !dateFilter || announcement.date === dateFilter;
    return matchesType && matchesSearch && matchesDate;
  });

  return (
    <div>
      <AdminHeader
        title="Announcements"
        description="Manage announcements, updates, and opportunities"
      />
      <div className="p-6 max-w-7xl">
        <BackButton />

        <Tabs defaultValue="hero" className="mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="hero">Hero Banner</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Banner Settings</CardTitle>
                <CardDescription>
                  Customize the announcements page hero section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hero-badge">Badge Text</Label>
                  <Input
                    id="hero-badge"
                    value={heroForm.badge}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, badge: e.target.value })
                    }
                    placeholder="Stay Informed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-title">Title</Label>
                  <Input
                    id="hero-title"
                    value={heroForm.title}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, title: e.target.value })
                    }
                    placeholder="Announcements & Opportunities"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-description">Description</Label>
                  <Textarea
                    id="hero-description"
                    rows={4}
                    value={heroForm.description}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, description: e.target.value })
                    }
                    placeholder="Stay up to date with official updates..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.stopPropagation();
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Statistics Cards</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="stat-announcements">
                        Active Announcements
                      </Label>
                      <Input
                        id="stat-announcements"
                        value={heroForm.statistics?.activeAnnouncements}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            statistics: {
                              ...heroForm.statistics,
                              activeAnnouncements: e.target.value,
                            },
                          })
                        }
                        placeholder="8+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stat-opportunities">
                        Open Opportunities
                      </Label>
                      <Input
                        id="stat-opportunities"
                        value={heroForm.statistics?.openOpportunities}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            statistics: {
                              ...heroForm.statistics,
                              openOpportunities: e.target.value,
                            },
                          })
                        }
                        placeholder="5+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stat-events">Upcoming Events</Label>
                      <Input
                        id="stat-events"
                        value={heroForm.statistics?.upcomingEvents}
                        onChange={(e) =>
                          setHeroForm({
                            ...heroForm,
                            statistics: {
                              ...heroForm.statistics,
                              upcomingEvents: e.target.value,
                            },
                          })
                        }
                        placeholder="3+"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleSaveHero}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  Save Hero Banner
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-linear-to-br from-[#00BFA6] to-[#00897B] rounded-lg p-8 text-white">
                  <div className="flex justify-center mb-6">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-sm">
                      <Bell className="h-4 w-4" />
                      {heroForm.badge}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-center mb-4">
                    {heroForm.title}
                  </h1>
                  <p className="text-center text-lg mb-8 max-w-3xl mx-auto opacity-90">
                    {heroForm.description}
                  </p>
                  <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                      <Users className="h-8 w-8 mx-auto mb-3" />
                      <div className="text-3xl font-bold mb-1">
                        {heroForm.statistics?.activeAnnouncements}
                      </div>
                      <div className="text-sm opacity-90">
                        Active Announcements
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                      <Briefcase className="h-8 w-8 mx-auto mb-3" />
                      <div className="text-3xl font-bold mb-1">
                        {heroForm.statistics?.openOpportunities}
                      </div>
                      <div className="text-sm opacity-90">
                        Open Opportunities
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-3" />
                      <div className="text-3xl font-bold mb-1">
                        {heroForm.statistics?.upcomingEvents}
                      </div>
                      <div className="text-sm opacity-90">Upcoming Events</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search announcements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="md:w-48"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant={filterType === "all" ? "default" : "outline"}
                    onClick={() => setFilterType("all")}
                    size="sm"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterType === "update" ? "default" : "outline"}
                    onClick={() => setFilterType("update")}
                    size="sm"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Updates
                  </Button>
                  <Button
                    variant={
                      filterType === "opportunity" ? "default" : "outline"
                    }
                    onClick={() => setFilterType("opportunity")}
                    size="sm"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Opportunities
                  </Button>
                  <Button
                    variant={filterType === "event" ? "default" : "outline"}
                    onClick={() => setFilterType("event")}
                    size="sm"
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Events
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Current Announcements</h2>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAnnouncements.length} active announcements
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                    onClick={() => {
                      setEditingAnnouncement(null);
                      setFormData({
                        type: "update",
                        title: "",
                        category: "",
                        excerpt: "",
                        content: "",
                        date: new Date().toISOString().split("T")[0],
                        location: "",
                        priority: "",
                        image: null,
                        imagePreview: undefined,
                        deadline: "",
                        link: "",
                        googleFormUrl: "",
                        eventId: "",
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingAnnouncement
                        ? "Edit Announcement"
                        : "Add New Announcement"}
                    </DialogTitle>
                    <DialogDescription>
                      Share official updates, opportunities, or events
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(
                          value: "update" | "opportunity" | "event"
                        ) => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="update">
                            Official Update
                          </SelectItem>
                          <SelectItem value="opportunity">
                            Opportunity
                          </SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.type === "event" && (
                      <div className="space-y-2">
                        <Label htmlFor="eventId">
                          Link to Event (Optional)
                        </Label>
                        <Input
                          id="eventId"
                          value={formData.eventId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              eventId: e.target.value,
                            })
                          }
                          placeholder="Enter event ID to fetch details"
                        />
                        <p className="text-xs text-muted-foreground">
                          Leave blank to create a standalone announcement, or
                          enter an event ID to link to an existing event
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="New STEM Center Opening in Bahir Dar"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        placeholder="Official Update, Opportunity, Event, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">
                        Excerpt (Short Description)
                      </Label>
                      <Textarea
                        id="excerpt"
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        placeholder="Brief summary that appears in the announcement card..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.stopPropagation();
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Full Content</Label>
                      <Textarea
                        id="content"
                        rows={6}
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="Full announcement content that appears when users click 'Read More'..."
                        required
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.stopPropagation();
                        }}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              location: e.target.value,
                            })
                          }
                          placeholder="Bahir Dar, Ethiopia"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority (Optional)</Label>
                      <Select
                        value={formData.priority || undefined}
                        onValueChange={(value: "high" | "medium" | "low") =>
                          setFormData({ ...formData, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.priority && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() =>
                            setFormData({ ...formData, priority: "" })
                          }
                        >
                          Clear priority
                        </Button>
                      )}
                    </div>

                    {formData.type === "opportunity" && (
                      <div className="space-y-2">
                        <Label htmlFor="deadline">Application Deadline</Label>
                        <Input
                          id="deadline"
                          type="date"
                          value={formData.deadline}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              deadline: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="link">Link (Optional)</Label>
                      <Input
                        id="link"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                        placeholder="/programs/stem-operations/stem-centers"
                      />
                    </div>

                    {formData.type === "opportunity" && (
                      <div className="space-y-2">
                        <Label htmlFor="googleFormUrl">
                          Google Form URL (Optional)
                        </Label>
                        <Input
                          id="googleFormUrl"
                          value={formData.googleFormUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              googleFormUrl: e.target.value,
                            })
                          }
                          placeholder="https://forms.gle/..."
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="image">Image</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[#00BFA6] transition-colors cursor-pointer">
                        <input
                          type="file"
                          id="image"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <label htmlFor="image" className="cursor-pointer">
                          {formData.image || formData.imagePreview ? (
                            <div className="space-y-2">
                              <div className="relative">
                                <img
                                  src={
                                    formData.imagePreview ||
                                    (typeof formData.image === "string"
                                      ? formData.image
                                      : "/placeholder.svg")
                                  }
                                  alt="Preview"
                                  className="max-h-48 mx-auto rounded"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    clearImage();
                                  }}
                                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Click to change image
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload image
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-[#00BFA6] hover:bg-[#00A693]"
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            {editingAnnouncement ? "Update" : "Add"}{" "}
                            Announcement
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#00BFA6]" />
                <span className="ml-3 text-muted-foreground">
                  Loading announcements...
                </span>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredAnnouncements.length === 0 ? (
                  <Card className="p-12 text-center">
                    <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No announcements found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery || dateFilter || filterType !== "all"
                        ? "Try adjusting your filters"
                        : "Get started by creating your first announcement"}
                    </p>
                  </Card>
                ) : (
                  filteredAnnouncements.map((announcement) => (
                    <Card key={announcement.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {announcement.image && (
                          <div className="md:w-64 h-48 md:h-auto relative">
                            <img
                              src={announcement.image || "/placeholder.svg"}
                              alt={announcement.title}
                              className="w-full h-full object-cover"
                            />
                            {announcement.priority && (
                              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                                {announcement.priority === "high"
                                  ? "Priority"
                                  : announcement.priority}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="flex-1">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                      announcement.type === "update"
                                        ? "bg-blue-100 text-blue-700"
                                        : announcement.type === "opportunity"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-purple-100 text-purple-700"
                                    }`}
                                  >
                                    {announcement.type === "update" && (
                                      <Bell className="h-3 w-3" />
                                    )}
                                    {announcement.type === "opportunity" && (
                                      <Briefcase className="h-3 w-3" />
                                    )}
                                    {announcement.type === "event" && (
                                      <CalendarDays className="h-3 w-3" />
                                    )}
                                    {announcement.category ||
                                      (announcement.type === "update"
                                        ? "Official Update"
                                        : announcement.type === "opportunity"
                                        ? "Opportunity"
                                        : "Event")}
                                  </span>
                                </div>
                                <CardTitle className="text-xl mb-2">
                                  {announcement.title}
                                </CardTitle>
                                <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(
                                      announcement.date
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {announcement.location}
                                  </span>
                                  {announcement.deadline && (
                                    <span className="flex items-center gap-1 text-amber-600">
                                      <Clock className="h-3 w-3" />
                                      Deadline:{" "}
                                      {new Date(
                                        announcement.deadline
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  )}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(announcement)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(announcement.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              {announcement.excerpt || announcement.content}
                            </p>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
