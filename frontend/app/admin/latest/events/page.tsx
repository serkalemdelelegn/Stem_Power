"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
  Users,
  Clock,
  X,
  CheckCircle2,
  Upload,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/lib/api-types";

interface HeroBanner {
  badge: string;
  title: string;
  description: string;
  image: string | File | null;
  imagePreview?: string;
  statistics: {
    id: string;
    icon: string;
    value: string;
    label: string;
  }[];
}

type EventFormState = {
  badge: string;
  title: string;
  description: string;
  fullDescription: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  category: string;
  participants: string;
  registrationLink: string;
  registrationDeadline: string;
  highlights: string[];
  image: string | File | null;
  imagePreview?: string;
  status: "upcoming" | "past";
  featured: boolean;
};

export default function EventsPage() {
  const defaultHero: HeroBanner = {
    badge: "STEMpower Events",
    title: "Join Our STEM Community Events",
    description:
      "Participate in workshops, competitions, and networking opportunities that advance STEM education across Ethiopia.",
    image: "/students-with-science-fair-awards.jpg",
    statistics: [
      { id: "1", icon: "calendar", value: "50+", label: "Annual Events" },
      { id: "2", icon: "users", value: "10,000+", label: "Total Participants" },
      { id: "3", icon: "trophy", value: "25+", label: "Competitions Hosted" },
    ],
  };

  const { toast } = useToast();
  const [heroBanner, setHeroBanner] = useState<HeroBanner>(defaultHero);

  const [events, setEvents] = useState<Event[]>([]);

  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState("hero");
  const [eventFilter, setEventFilter] = useState<"upcoming" | "past">(
    "upcoming"
  );
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [savingEvent, setSavingEvent] = useState(false);

  const [heroFormData, setHeroFormData] = useState(defaultHero);
  const [savingHero, setSavingHero] = useState(false);

  const createEmptyEventForm = (
    initialStatus: "upcoming" | "past"
  ): EventFormState => ({
    badge: "",
    title: "",
    description: "",
    fullDescription: "",
    date: "",
    endDate: "",
    time: "",
    location: "",
    category: "",
    participants: "",
    registrationLink: "",
    registrationDeadline: "",
    highlights: [""],
    image: null,
    imagePreview: undefined,
    status: initialStatus,
    featured: false,
  });

  const [eventFormData, setEventFormData] = useState<EventFormState>(
    createEmptyEventForm("upcoming")
  );

  useEffect(() => {
    fetchEvents();
    fetchHeroBanner();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await fetch("/api/latest/events", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      // Handle both array and data wrapper
      const eventsArray = Array.isArray(data) ? data : data?.data || [];
      setEvents(eventsArray);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Unable to load events",
        description: "Please refresh the page or try again later.",
        variant: "destructive",
      });
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchHeroBanner = async () => {
    try {
      const response = await fetch("/api/latest/events/hero", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Failed to fetch hero banner");
      const data = await response.json();
      if (data) {
        setHeroBanner(data);
        setHeroFormData(data);
      } else {
        setHeroBanner(defaultHero);
        setHeroFormData(defaultHero);
      }
    } catch (error) {
      console.error("Error fetching hero banner:", error);
      setHeroBanner(defaultHero);
      setHeroFormData(defaultHero);
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setHeroFormData({
        ...heroFormData,
        image: file,
        imagePreview: previewUrl,
      });
    }
    if (e.target.value) {
      e.target.value = "";
    }
  };

  const clearHeroImage = () => {
    if (heroFormData.imagePreview) {
      URL.revokeObjectURL(heroFormData.imagePreview);
    }
    setHeroFormData({ ...heroFormData, image: "", imagePreview: undefined });
  };

  const handleEventImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEventFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: previewUrl,
      }));
    }
    if (e.target.value) {
      e.target.value = "";
    }
  };

  const clearEventImage = () => {
    if (eventFormData.imagePreview) {
      URL.revokeObjectURL(eventFormData.imagePreview);
    }
    setEventFormData({
      ...eventFormData,
      image: null,
      imagePreview: undefined,
    });
  };

  const handleSaveHero = async () => {
    try {
      setSavingHero(true);

      const isFile = heroFormData.image instanceof File;

      let response: Response;
      if (isFile) {
        const formData = new FormData();
        formData.append("file", heroFormData.image as File);
        formData.append("badge", heroFormData.badge || "");
        formData.append("title", heroFormData.title || "");
        formData.append("description", heroFormData.description || "");

        // flatten statistics into stat1/2/3
        const stats = heroFormData.statistics || [];
        formData.append("stat1Icon", stats[0]?.icon || "calendar");
        formData.append("stat1Value", stats[0]?.value || "50+");
        formData.append("stat1Label", stats[0]?.label || "Annual Events");
        formData.append("stat2Icon", stats[1]?.icon || "users");
        formData.append("stat2Value", stats[1]?.value || "10,000+");
        formData.append("stat2Label", stats[1]?.label || "Participants");
        formData.append("stat3Icon", stats[2]?.icon || "star");
        formData.append("stat3Value", stats[2]?.value || "25+");
        formData.append("stat3Label", stats[2]?.label || "Competitions Hosted");

        response = await fetch("/api/latest/events/hero", {
          method: "PUT",
          body: formData,
        });
      } else {
        const heroPayload = {
          ...heroFormData,
          image: heroFormData.image || "",
        };

        response = await fetch("/api/latest/events/hero", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(heroPayload),
        });
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to update" }));
        throw new Error(
          errorData.error || errorData.message || "Failed to update hero banner"
        );
      }

      const saved = await response.json();

      if (heroFormData.imagePreview) {
        URL.revokeObjectURL(heroFormData.imagePreview);
      }

      setHeroBanner(saved);
      setHeroFormData(saved);
      toast({
        title: "Hero updated",
        description: "The events hero section has been updated successfully.",
      });
      setIsHeroDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving hero banner:", error);
      toast({
        title: "Unable to update hero",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSavingHero(false);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventFormData({
      badge: event.badge || "",
      title: event.title,
      description: event.description,
      fullDescription: event.fullDescription || "",
      date: event.date,
      endDate: event.endDate ?? "",
      time: event.time,
      location: event.location,
      category: event.category || (event.badge ?? "Event"),
      participants: event.participants || "",
      registrationLink: event.registrationLink || "",
      registrationDeadline: event.registrationDeadline || "",
      highlights:
        event.highlights && event.highlights.length > 0
          ? event.highlights
          : [""],
      image: event.image || null,
      imagePreview: undefined,
      status: event.status,
      featured: Boolean(event.featured),
    });
    setIsEventDialogOpen(true);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const response = await fetch(`/api/latest/events/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete event");
      }
      toast({
        title: "Event removed",
        description: "The event has been deleted successfully.",
      });
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Unable to delete event",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleSaveEvent = async () => {
    if (!eventFormData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title before saving the event.",
        variant: "destructive",
      });
      return;
    }

    if (!eventFormData.date) {
      toast({
        title: "Date required",
        description: "Please select a start date for the event.",
        variant: "destructive",
      });
      return;
    }

    const payload: Partial<Event> & {
      title: string;
      date: string;
      time: string;
      location: string;
      category: string;
      status: "upcoming" | "past";
    } = {
      badge: eventFormData.badge || eventFormData.category,
      category: eventFormData.category || eventFormData.badge || "Event",
      title: eventFormData.title,
      description:
        eventFormData.description || eventFormData.fullDescription || "",
      fullDescription:
        eventFormData.fullDescription || eventFormData.description,
      date: eventFormData.date,
      endDate: eventFormData.endDate || undefined,
      time: eventFormData.time,
      location: eventFormData.location,
      participants: eventFormData.participants || "",
      registrationLink: eventFormData.registrationLink || undefined,
      registrationDeadline: eventFormData.registrationDeadline || undefined,
      highlights: eventFormData.highlights
        .map((highlight) => highlight.trim())
        .filter(Boolean),
      image:
        eventFormData.image instanceof File
          ? undefined
          : eventFormData.image || undefined,
      status: eventFormData.status,
      featured: eventFormData.featured,
    };

    try {
      setSavingEvent(true);
      let response: Response;

      // Check if image is a File object - use FormData
      if (eventFormData.image instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", eventFormData.image);
        Object.keys(payload).forEach((key) => {
          const value = (payload as Record<string, any>)[key];
          if (value !== null && value !== undefined) {
            if (Array.isArray(value)) {
              formDataToSend.append(key, JSON.stringify(value));
            } else if (typeof value === "boolean") {
              formDataToSend.append(key, value ? "true" : "false");
            } else {
              formDataToSend.append(
                key,
                typeof value === "string" ? value : JSON.stringify(value)
              );
            }
          }
        });

        const url = editingEvent
          ? `/api/latest/events/${editingEvent.id}`
          : "/api/latest/events";
        const method = editingEvent ? "PUT" : "POST";

        response = await fetch(url, {
          method,
          body: formDataToSend,
        });
      } else {
        // Use JSON for string URLs or null
        const url = editingEvent
          ? `/api/latest/events/${editingEvent.id}`
          : "/api/latest/events";
        const method = editingEvent ? "PUT" : "POST";

        response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to save" }));
        throw new Error(
          errorData.error || errorData.message || "Failed to save event"
        );
      }

      const saved = await response.json();

      // Clean up preview URL
      if (eventFormData.imagePreview) {
        URL.revokeObjectURL(eventFormData.imagePreview);
      }

      toast({
        title: editingEvent ? "Event updated" : "Event created",
        description: editingEvent
          ? "The event has been updated successfully."
          : "A new event has been added.",
      });

      setIsEventDialogOpen(false);
      setEditingEvent(null);
      setEventFormData(createEmptyEventForm(eventFilter));
      fetchEvents();
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast({
        title: editingEvent
          ? "Unable to update event"
          : "Unable to create event",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSavingEvent(false);
    }
  };

  const addHighlight = () => {
    setEventFormData({
      ...eventFormData,
      highlights: [...eventFormData.highlights, ""],
    });
  };

  const updateHighlight = (index: number, value: string) => {
    const newHighlights = [...eventFormData.highlights];
    newHighlights[index] = value;
    setEventFormData({ ...eventFormData, highlights: newHighlights });
  };

  const removeHighlight = (index: number) => {
    setEventFormData({
      ...eventFormData,
      highlights: eventFormData.highlights.filter((_, i) => i !== index),
    });
  };

  const addStatistic = () => {
    setHeroFormData({
      ...heroFormData,
      statistics: [
        ...heroFormData.statistics,
        { id: Date.now().toString(), icon: "star", value: "", label: "" },
      ],
    });
  };

  const updateStatistic = (
    id: string,
    field: "icon" | "value" | "label",
    value: string
  ) => {
    setHeroFormData({
      ...heroFormData,
      statistics: heroFormData.statistics.map((stat) =>
        stat.id === id ? { ...stat, [field]: value } : stat
      ),
    });
  };

  const removeStatistic = (id: string) => {
    setHeroFormData({
      ...heroFormData,
      statistics: heroFormData.statistics.filter((stat) => stat.id !== id),
    });
  };

  const filteredEvents = events.filter((event) => event.status === eventFilter);
  const featuredEvents = filteredEvents.filter((event) => event.featured);
  const regularEvents = filteredEvents.filter((event) => !event.featured);

  return (
    <div>
      <AdminHeader
        title="Events"
        description="Manage events, workshops, and competitions"
      />
      <div className="p-6 max-w-7xl">
        <BackButton />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="hero">Hero Banner</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Hero Banner Tab */}
          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Hero Banner</CardTitle>
                    <CardDescription>
                      Manage the events page hero section
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isHeroDialogOpen}
                    onOpenChange={setIsHeroDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setHeroFormData(heroBanner)}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Hero
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Hero Banner</DialogTitle>
                        <DialogDescription>
                          Update the hero section content and statistics
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="hero-image">Hero Image</Label>
                          <Input
                            id="hero-image"
                            type="file"
                            accept="image/*"
                            onChange={handleHeroImageUpload}
                          />
                          {(heroFormData.image ||
                            heroFormData.imagePreview) && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-dashed border-muted relative">
                              <img
                                src={
                                  heroFormData.imagePreview ||
                                  (typeof heroFormData.image === "string"
                                    ? heroFormData.image
                                    : "/placeholder.svg")
                                }
                                alt="Hero preview"
                                className="w-full h-48 object-cover"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  clearHeroImage();
                                }}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="hero-badge">Badge Text</Label>
                          <Input
                            id="hero-badge"
                            value={heroFormData.badge}
                            onChange={(e) =>
                              setHeroFormData({
                                ...heroFormData,
                                badge: e.target.value,
                              })
                            }
                            placeholder="STEMpower Events"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hero-title">Title</Label>
                          <Input
                            id="hero-title"
                            value={heroFormData.title}
                            onChange={(e) =>
                              setHeroFormData({
                                ...heroFormData,
                                title: e.target.value,
                              })
                            }
                            placeholder="Join Our STEM Community Events"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hero-description">Description</Label>
                          <Textarea
                            id="hero-description"
                            rows={3}
                            value={heroFormData.description}
                            onChange={(e) =>
                              setHeroFormData({
                                ...heroFormData,
                                description: e.target.value,
                              })
                            }
                            placeholder="Participate in workshops, competitions..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.stopPropagation();
                            }}
                          />
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Statistics</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={addStatistic}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Statistic
                            </Button>
                          </div>
                          {heroFormData.statistics.map((stat, index) => (
                            <Card key={stat.id} className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex-1 space-y-3">
                                  <div className="grid grid-cols-3 gap-3">
                                    <div className="space-y-2">
                                      <Label>Icon</Label>
                                      <select
                                        value={stat.icon}
                                        onChange={(e) =>
                                          updateStatistic(
                                            stat.id,
                                            "icon",
                                            e.target.value
                                          )
                                        }
                                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                                      >
                                        <option value="calendar">
                                          Calendar
                                        </option>
                                        <option value="users">Users</option>
                                        <option value="trophy">Trophy</option>
                                        <option value="star">Star</option>
                                        <option value="target">Target</option>
                                      </select>
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Value</Label>
                                      <Input
                                        value={stat.value}
                                        onChange={(e) =>
                                          updateStatistic(
                                            stat.id,
                                            "value",
                                            e.target.value
                                          )
                                        }
                                        placeholder="50+"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Label</Label>
                                      <Input
                                        value={stat.label}
                                        onChange={(e) =>
                                          updateStatistic(
                                            stat.id,
                                            "label",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Annual Events"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeStatistic(stat.id)}
                                  className="mt-6"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsHeroDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveHero}
                            className="bg-[#00BFA6] hover:bg-[#00A693]"
                            disabled={savingHero}
                          >
                            {savingHero ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-linear-to-br from-[#00BFA6] to-[#00897B] p-8 text-white">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                    <div className="flex-1">
                      <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
                        {heroBanner.badge}
                      </div>
                      <h2 className="text-3xl font-bold mb-3">
                        {heroBanner.title}
                      </h2>
                      <p className="text-white/90 mb-6 max-w-3xl">
                        {heroBanner.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {heroBanner.statistics.map((stat) => (
                          <div
                            key={stat.id}
                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                          >
                            <div className="text-3xl font-bold mb-1">
                              {stat.value}
                            </div>
                            <div className="text-sm text-white/80">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {(heroBanner.image || heroBanner.imagePreview) && (
                      <div className="flex-1">
                        <div className="overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur">
                          <img
                            src={
                              heroBanner.imagePreview ||
                              (typeof heroBanner.image === "string"
                                ? heroBanner.image
                                : "/placeholder.svg")
                            }
                            alt="Events hero"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                  <Button
                    variant={eventFilter === "upcoming" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setEventFilter("upcoming")}
                    className={
                      eventFilter === "upcoming"
                        ? "bg-[#00BFA6] hover:bg-[#00A693]"
                        : ""
                    }
                  >
                    Upcoming Events
                  </Button>
                  <Button
                    variant={eventFilter === "past" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setEventFilter("past")}
                    className={
                      eventFilter === "past"
                        ? "bg-[#00BFA6] hover:bg-[#00A693]"
                        : ""
                    }
                  >
                    Past Events
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {loadingEvents
                    ? "Refreshing events..."
                    : `${filteredEvents.length} events`}
                </p>
              </div>

              <Dialog
                open={isEventDialogOpen}
                onOpenChange={setIsEventDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                    onClick={() => {
                      setEditingEvent(null);
                      // Clean up any preview URL
                      if (eventFormData.imagePreview) {
                        URL.revokeObjectURL(eventFormData.imagePreview);
                      }
                      setEventFormData(createEmptyEventForm(eventFilter));
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingEvent ? "Edit Event" : "Add New Event"}
                    </DialogTitle>
                    <DialogDescription>
                      Manage event details and information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 max-h-[90vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="badge">Badge</Label>
                        <Input
                          id="badge"
                          value={eventFormData.badge}
                          onChange={(e) =>
                            setEventFormData({
                              ...eventFormData,
                              badge: e.target.value,
                            })
                          }
                          placeholder="Competition, Workshop, Training..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Event Status</Label>
                        <select
                          id="status"
                          value={eventFormData.status}
                          onChange={(e) =>
                            setEventFormData({
                              ...eventFormData,
                              status: e.target.value as "upcoming" | "past",
                            })
                          }
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="past">Past</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={eventFormData.title}
                        onChange={(e) =>
                          setEventFormData({
                            ...eventFormData,
                            title: e.target.value,
                          })
                        }
                        placeholder="National Science Fair 2025"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={eventFormData.description}
                        onChange={(e) =>
                          setEventFormData({
                            ...eventFormData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Detailed event description..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event-image-upload">Event Image</Label>
                      <div className="space-y-2">
                        <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm">Upload Image</span>
                          </div>
                          <input
                            id="event-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleEventImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                      {(eventFormData.image || eventFormData.imagePreview) && (
                        <div className="mt-3 rounded-lg overflow-hidden border relative">
                          <img
                            src={
                              eventFormData.imagePreview ||
                              (typeof eventFormData.image === "string"
                                ? eventFormData.image
                                : "/placeholder.svg")
                            }
                            alt="Event preview"
                            className="w-full h-48 object-cover"
                          />
                          <div className="flex justify-end p-2 bg-muted/50 border-t">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={clearEventImage}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Remove Image
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Start Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={eventFormData.date}
                          onChange={(e) =>
                            setEventFormData({
                              ...eventFormData,
                              date: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date (Optional)</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={eventFormData.endDate}
                          onChange={(e) =>
                            setEventFormData({
                              ...eventFormData,
                              endDate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        value={eventFormData.time}
                        onChange={(e) =>
                          setEventFormData({
                            ...eventFormData,
                            time: e.target.value,
                          })
                        }
                        placeholder="9:00 AM - 6:00 PM"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={eventFormData.location}
                          onChange={(e) =>
                            setEventFormData({
                              ...eventFormData,
                              location: e.target.value,
                            })
                          }
                          placeholder="Addis Ababa Science Museum"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="participants">Participants</Label>
                        <Input
                          id="participants"
                          value={eventFormData.participants}
                          onChange={(e) =>
                            setEventFormData({
                              ...eventFormData,
                              participants: e.target.value,
                            })
                          }
                          placeholder="500+ Expected"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registrationLink">
                        Registration Link (Google Form)
                      </Label>
                      <Input
                        id="registrationLink"
                        type="url"
                        value={eventFormData.registrationLink}
                        onChange={(e) =>
                          setEventFormData({
                            ...eventFormData,
                            registrationLink: e.target.value,
                          })
                        }
                        placeholder="https://forms.google.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registrationDeadline">
                        Registration Deadline
                      </Label>
                      <Input
                        id="registrationDeadline"
                        type="date"
                        value={eventFormData.registrationDeadline}
                        onChange={(e) =>
                          setEventFormData({
                            ...eventFormData,
                            registrationDeadline: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Event Highlights</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addHighlight}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Highlight
                        </Button>
                      </div>
                      {eventFormData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={highlight}
                            onChange={(e) =>
                              updateHighlight(index, e.target.value)
                            }
                            placeholder="Project presentations and judging"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeHighlight(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={eventFormData.featured}
                        onChange={(e) =>
                          setEventFormData({
                            ...eventFormData,
                            featured: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="featured" className="cursor-pointer">
                        Mark as Featured Event
                      </Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEventDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveEvent}
                        className="bg-[#00BFA6] hover:bg-[#00A693]"
                        disabled={savingEvent}
                      >
                        {savingEvent
                          ? "Saving..."
                          : editingEvent
                          ? "Update"
                          : "Add"}{" "}
                        Event
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Featured Events */}
            {featuredEvents.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[#00BFA6]" />
                  Featured Events
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {featuredEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      {event.image && (
                        <div className="relative h-48">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-[#00BFA6] text-white text-xs font-medium rounded-full">
                              {event.badge}
                            </span>
                          </div>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">
                              {event.title}
                            </CardTitle>
                            <CardDescription className="text-sm line-clamp-2">
                              {event.description}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-[#00BFA6]" />
                            <span>
                              {new Date(event.date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                              {event.endDate &&
                                ` - ${new Date(
                                  event.endDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4 text-[#00BFA6]" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 text-[#00BFA6]" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4 text-[#00BFA6]" />
                            <span>{event.participants}</span>
                          </div>
                        </div>
                        {event.highlights && event.highlights.length > 0 && (
                          <div className="pt-2">
                            <p className="text-sm font-medium mb-2">
                              Event Highlights:
                            </p>
                            <ul className="space-y-1">
                              {event.highlights
                                .slice(0, 3)
                                .map((highlight, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-muted-foreground flex items-start gap-2"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-[#00BFA6] mt-0.5 shrink-0" />
                                    <span>{highlight}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                        {event.registrationDeadline && (
                          <div className="pt-2 text-sm">
                            <span className="text-muted-foreground">
                              Registration Deadline:{" "}
                            </span>
                            <span className="font-medium">
                              {new Date(
                                event.registrationDeadline
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Events */}
            {regularEvents.length > 0 && (
              <div className="space-y-4">
                {featuredEvents.length > 0 && (
                  <h3 className="text-lg font-semibold">All Events</h3>
                )}
                <div className="grid gap-4 md:grid-cols-3">
                  {regularEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden">
                      {event.image && (
                        <div className="relative h-40">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-[#00BFA6] text-white text-xs font-medium rounded-full">
                              {event.badge}
                            </span>
                          </div>
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base line-clamp-2">
                            {event.title}
                          </CardTitle>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditEvent(event)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription className="text-xs line-clamp-2">
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-3 w-3 text-[#00BFA6]" />
                          <span>
                            {new Date(event.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-3 w-3 text-[#00BFA6]" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-3 w-3 text-[#00BFA6]" />
                          <span>{event.participants}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filteredEvents.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No {eventFilter} events yet
                  </p>
                  <Button
                    className="mt-4 bg-[#00BFA6] hover:bg-[#00A693]"
                    onClick={() => setIsEventDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
