"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BackButton } from "@/components/ui/back-button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  Upload,
  FileText,
  Download,
  Users,
  BookOpen,
  TrendingUp,
  Loader2,
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
import { useToast } from "@/hooks/use-toast";
import type {
  Newsletter as NewsletterType,
  NewsletterHero,
} from "@/lib/api-types";

type Newsletter = NewsletterType;

// Remove slug fabrication; rely solely on backend-provided slug.

interface NewsletterFormData {
  badge: string;
  title: string;
  date: string;
  category: string;
  author: string;
  excerpt: string;
  content: string;
  readTime: string;
  image: string | File | null;
  imagePreview?: string;
  pdfUrl: string;
  featured: boolean;
  publication: string;
  publicationType: string;
  quote: string;
  topic: string;
  source: string;
}

// Remove static/default hero content.

const createEmptyForm = (): NewsletterFormData => ({
  badge: "",
  title: "",
  date: new Date().toISOString().split("T")[0],
  category: "",
  author: "",
  excerpt: "",
  content: "",
  readTime: "",
  image: null,
  imagePreview: undefined,
  pdfUrl: "",
  featured: false,
  publication: "",
  publicationType: "",
  quote: "",
  topic: "",
  source: "",
});

const newsletterToFormData = (newsletter: Newsletter): NewsletterFormData => ({
  badge: newsletter.badge || "",
  title: newsletter.title || "",
  date: newsletter.date
    ? newsletter.date.split("T")[0]
    : new Date().toISOString().split("T")[0],
  category: newsletter.category || "",
  author: newsletter.author || "",
  excerpt: newsletter.excerpt || "",
  content: newsletter.content || "",
  readTime: newsletter.readTime || "",
  image: newsletter.image || "",
  pdfUrl: newsletter.pdfUrl || "",
  featured: Boolean(newsletter.featured),
  publication: newsletter.publication || "",
  publicationType: newsletter.publicationType || "",
  quote: newsletter.quote || "",
  topic: newsletter.topic || "",
  source: newsletter.source || "",
});

export default function NewsletterPage() {
  const { toast } = useToast();
  const [heroBanner, setHeroBanner] = useState<NewsletterHero | null>(null);
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
  const [heroFormData, setHeroFormData] = useState<NewsletterHero>({
    badge: "",
    title: "",
    description: "",
    statistics: {
      subscribers: "",
      newsletters: "",
      monthlyReaders: "",
    },
  });

  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(
    null
  );
  const [formData, setFormData] = useState<NewsletterFormData>(
    createEmptyForm()
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);

  const renderNewsletterList = () => {
    if (loading) {
      return (
        <Card>
          <CardContent className="py-12 flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading newsletters...
          </CardContent>
        </Card>
      );
    }

    if (!Array.isArray(newsletters) || newsletters.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No newsletters found. Create one to get started.
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-6">
        {newsletters.map((newsletter) => (
          <Card
            key={newsletter.id}
            className={newsletter.featured ? "border-[#00BFA6]" : ""}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-64 h-48 rounded-lg overflow-hidden bg-muted shrink-0">
                  {newsletter.image ? (
                    <>
                      <img
                        src={newsletter.image}
                        alt={newsletter.title || ""}
                        className="w-full h-full object-cover"
                      />
                      {newsletter.featured && (
                        <div className="absolute top-3 left-3 bg-[#00BFA6] text-white px-3 py-1 rounded-full text-xs font-medium">
                          ⭐ Featured
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 bg-[#00BFA6]/10 text-[#00BFA6] px-3 py-1 rounded-full text-xs font-medium mb-2">
                        {newsletter.badge || "Not added yet"}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {newsletter.title}
                      </h3>
                      {(newsletter.publication ||
                        newsletter.publicationType) && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">
                            {newsletter.publication || "Not added yet"}
                          </span>
                          {newsletter.publicationType
                            ? ` • ${newsletter.publicationType}`
                            : ""}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {newsletter.date
                            ? new Date(newsletter.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Not added yet"}
                        </span>
                        {newsletter.readTime ? (
                          <>
                            <span>•</span>
                            <span>{newsletter.readTime}</span>
                          </>
                        ) : null}
                        {newsletter.category ? (
                          <>
                            <span>•</span>
                            <span>{newsletter.category}</span>
                          </>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {newsletter.excerpt}
                      </p>
                      {newsletter.quote && (
                        <blockquote className="text-sm italic text-[#00A693] border-l-2 border-[#00BFA6] pl-3 mb-4">
                          “{newsletter.quote}”
                        </blockquote>
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                        {newsletter.slug ? (
                          <Button
                            asChild
                            size="sm"
                            className="bg-[#00BFA6] hover:bg-[#00A693]"
                          >
                            <Link
                              href={`/latest/news/newsletter/${newsletter.slug}`}
                              target="_blank"
                            >
                              View on Site
                            </Link>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Not added yet
                          </Button>
                        )}
                        {newsletter.pdfUrl ? (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={newsletter.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Download className="mr-2 h-3 w-3" />
                              Download PDF
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(newsletter)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(newsletter.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchHeroBanner();
    fetchNewsletters();
  }, []);

  const fetchHeroBanner = async () => {
    try {
      const response = await fetch("/api/latest/newsletter/hero");
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setHeroBanner(data);
          setHeroFormData(data);
        } else {
          setHeroBanner(null);
        }
      }
    } catch (error) {
      console.error("Failed to load hero banner", error);
    }
  };

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/latest/newsletter");
      if (!response.ok) {
        throw new Error("Failed to fetch newsletters");
      }
      const data = await response.json();
      // Handle array or common wrappers without fabricating content
      const newslettersArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.newsletters)
        ? data.newsletters
        : [];
      setNewsletters(newslettersArray);
    } catch (error) {
      console.error("Failed to load newsletters", error);
      toast({
        title: "Error",
        description: "Unable to load newsletters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: previewUrl,
      }));
    }
    if (e.target.value) {
      e.target.value = "";
    }
  };

  const clearImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData({ ...formData, image: null, imagePreview: undefined });
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For PDF, we'll store the file and upload it separately or use URL
      // For now, keep the existing behavior but note that PDF upload might need special handling
      // You can upload PDF to Cloudinary or another service and get the URL
      // For now, we'll just show a message that PDF upload needs to be handled
      toast({
        title: "PDF Upload",
        description:
          "Please provide a PDF URL. Direct file upload for PDFs will be implemented separately.",
      });
    }
    if (e.target.value) {
      e.target.value = "";
    }
  };

  const handleEdit = (newsletter: Newsletter) => {
    setEditingNewsletter(newsletter);
    const formDataFromNewsletter = newsletterToFormData(newsletter);
    setFormData({
      ...formDataFromNewsletter,
      imagePreview: undefined, // Clear preview when editing
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this newsletter?")) {
      return;
    }
    try {
      const response = await fetch(`/api/latest/newsletter/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete newsletter");
      }
      toast({
        title: "Newsletter removed",
        description: "The newsletter entry has been deleted.",
      });
      fetchNewsletters();
    } catch (error) {
      console.error("Failed to delete newsletter", error);
      toast({
        title: "Error",
        description: "Unable to delete newsletter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for the newsletter.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      badge: formData.badge,
      title: formData.title,
      date: formData.date,
      category: formData.category || "General",
      author: formData.author,
      excerpt: formData.excerpt,
      content: formData.content,
      readTime: formData.readTime,
      image: formData.image instanceof File ? null : formData.image || null,
      pdfUrl: formData.pdfUrl,
      featured: formData.featured,
      publication: formData.publication,
      publicationType: formData.publicationType,
      quote: formData.quote,
      topic: formData.topic,
      source: formData.source || "newsletter",
    };

    try {
      setSaving(true);
      let response: Response;

      // Check if image is a File object - use FormData
      if (formData.image instanceof File) {
        const formDataToSend = new FormData();
        formDataToSend.append("file", formData.image);
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

        const url = editingNewsletter
          ? `/api/latest/newsletter/${editingNewsletter.id}`
          : "/api/latest/newsletter";
        const method = editingNewsletter ? "PUT" : "POST";

        response = await fetch(url, {
          method,
          body: formDataToSend,
        });
      } else {
        // Use JSON for string URLs or null
        const url = editingNewsletter
          ? `/api/latest/newsletter/${editingNewsletter.id}`
          : "/api/latest/newsletter";
        const method = editingNewsletter ? "PUT" : "POST";

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
          errorData.error || errorData.message || "Failed to save newsletter"
        );
      }

      const saved = await response.json();

      // Clean up preview URL
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }

      toast({
        title: "Success",
        description: editingNewsletter
          ? "Newsletter updated."
          : "Newsletter created.",
      });

      setIsDialogOpen(false);
      setEditingNewsletter(null);
      setFormData(createEmptyForm());
      fetchNewsletters();
    } catch (error: any) {
      console.error("Failed to save newsletter", error);
      toast({
        title: "Error",
        description:
          error.message ||
          (editingNewsletter
            ? "Unable to update newsletter."
            : "Unable to create newsletter."),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHero = async () => {
    try {
      setHeroSaving(true);
      const response = await fetch("/api/latest/newsletter/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(heroFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to save hero banner");
      }

      setHeroBanner(heroFormData);
      toast({
        title: "Hero updated",
        description: "Newsletter hero banner saved successfully.",
      });
      setIsHeroDialogOpen(false);
    } catch (error) {
      console.error("Failed to save hero", error);
      toast({
        title: "Error",
        description: "Unable to save hero banner.",
        variant: "destructive",
      });
    } finally {
      setHeroSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Newsletter Management"
        description="Manage newsletter hero banner and content"
      />
      <div className="p-6 max-w-7xl">
        <BackButton />

        <Tabs defaultValue="hero" className="mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="hero">Hero Banner</TabsTrigger>
            <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Hero Banner</CardTitle>
                    <CardDescription>
                      Manage the newsletter page hero section
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isHeroDialogOpen}
                    onOpenChange={setIsHeroDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setHeroFormData(
                            heroBanner ?? {
                              badge: "",
                              title: "",
                              description: "",
                              statistics: {
                                subscribers: "",
                                newsletters: "",
                                monthlyReaders: "",
                              },
                            }
                          )
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Hero
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Hero Banner</DialogTitle>
                        <DialogDescription>
                          Update the newsletter page hero section
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
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
                            placeholder="STEMpower Newsletters"
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
                            placeholder="Stay Connected"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hero-description">Description</Label>
                          <Textarea
                            id="hero-description"
                            rows={4}
                            value={heroFormData.description}
                            onChange={(e) =>
                              setHeroFormData({
                                ...heroFormData,
                                description: e.target.value,
                              })
                            }
                            placeholder="Explore our latest stories..."
                          />
                        </div>
                        <div className="space-y-4">
                          <Label>Statistics</Label>
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                              <Label htmlFor="stat-subscribers">
                                Subscribers
                              </Label>
                              <Input
                                id="stat-subscribers"
                                value={heroFormData.statistics.subscribers}
                                onChange={(e) =>
                                  setHeroFormData({
                                    ...heroFormData,
                                    statistics: {
                                      ...heroFormData.statistics,
                                      subscribers: e.target.value,
                                    },
                                  })
                                }
                                placeholder="5,000+"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="stat-newsletters">
                                Newsletters
                              </Label>
                              <Input
                                id="stat-newsletters"
                                value={heroFormData.statistics.newsletters}
                                onChange={(e) =>
                                  setHeroFormData({
                                    ...heroFormData,
                                    statistics: {
                                      ...heroFormData.statistics,
                                      newsletters: e.target.value,
                                    },
                                  })
                                }
                                placeholder="48+"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="stat-readers">
                                Monthly Readers
                              </Label>
                              <Input
                                id="stat-readers"
                                value={heroFormData.statistics.monthlyReaders}
                                onChange={(e) =>
                                  setHeroFormData({
                                    ...heroFormData,
                                    statistics: {
                                      ...heroFormData.statistics,
                                      monthlyReaders: e.target.value,
                                    },
                                  })
                                }
                                placeholder="12,000+"
                              />
                            </div>
                          </div>
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
                            disabled={heroSaving}
                          >
                            {heroSaving ? (
                              <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Saving...
                              </span>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview */}
                <div className="bg-linear-to-br from-[#00BFA6] to-[#00A693] rounded-lg p-8 text-white">
                  <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                      <BookOpen className="h-4 w-4" />
                      {heroBanner?.badge || "Not added yet"}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold">
                      {heroBanner?.title || "Not added yet"}
                    </h1>
                    <p className="text-lg text-white/90 max-w-3xl mx-auto">
                      {heroBanner?.description || "Not added yet"}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <Users className="h-8 w-8 mx-auto mb-3" />
                        <div className="text-3xl font-bold">
                          {heroBanner?.statistics?.subscribers ||
                            "Not added yet"}
                        </div>
                        <div className="text-sm text-white/80 mt-1">
                          Subscribers
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <BookOpen className="h-8 w-8 mx-auto mb-3" />
                        <div className="text-3xl font-bold">
                          {heroBanner?.statistics?.newsletters ||
                            "Not added yet"}
                        </div>
                        <div className="text-sm text-white/80 mt-1">
                          Newsletters
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                        <TrendingUp className="h-8 w-8 mx-auto mb-3" />
                        <div className="text-3xl font-bold">
                          {heroBanner?.statistics?.monthlyReaders ||
                            "Not added yet"}
                        </div>
                        <div className="text-sm text-white/80 mt-1">
                          Monthly Readers
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletters" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">All Newsletters</h2>
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "Loading..."
                    : `${newsletters.length} total newsletter${
                        newsletters.length === 1 ? "" : "s"
                      }`}
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                    onClick={() => {
                      setEditingNewsletter(null);
                      // Clean up any preview URL
                      if (formData.imagePreview) {
                        URL.revokeObjectURL(formData.imagePreview);
                      }
                      setFormData(createEmptyForm());
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Newsletter
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingNewsletter
                        ? "Edit Newsletter"
                        : "Add New Newsletter"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingNewsletter
                        ? "Update the newsletter details"
                        : "Create a new newsletter"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 max-h-[90vh] overflow-y-auto">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="badge">Badge</Label>
                        <Input
                          id="badge"
                          value={formData.badge}
                          onChange={(e) =>
                            setFormData({ ...formData, badge: e.target.value })
                          }
                          placeholder="Monthly Digest, Featured, etc."
                        />
                      </div>
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="STEMpower Ethiopia Monthly Digest - March 2024"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                          placeholder="Community Updates, Events, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                          id="author"
                          value={formData.author}
                          onChange={(e) =>
                            setFormData({ ...formData, author: e.target.value })
                          }
                          placeholder="STEMpower Communications Team"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="publication">Publication</Label>
                        <Input
                          id="publication"
                          value={formData.publication}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              publication: e.target.value,
                            })
                          }
                          placeholder="The Ethiopian Herald"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="publication-type">
                          Publication Type
                        </Label>
                        <Input
                          id="publication-type"
                          value={formData.publicationType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              publicationType: e.target.value,
                            })
                          }
                          placeholder="National News, Magazine, etc."
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input
                          id="topic"
                          value={formData.topic}
                          onChange={(e) =>
                            setFormData({ ...formData, topic: e.target.value })
                          }
                          placeholder="Innovation, Education, STEM Centers..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="source">Source URL</Label>
                        <Input
                          id="source"
                          value={formData.source}
                          onChange={(e) =>
                            setFormData({ ...formData, source: e.target.value })
                          }
                          placeholder="https://publication.com/article"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="read-time">Read Time</Label>
                      <Input
                        id="read-time"
                        value={formData.readTime}
                        onChange={(e) =>
                          setFormData({ ...formData, readTime: e.target.value })
                        }
                        placeholder="8 min read"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quote">Key Quote</Label>
                      <Textarea
                        id="quote"
                        rows={3}
                        value={formData.quote}
                        onChange={(e) =>
                          setFormData({ ...formData, quote: e.target.value })
                        }
                        placeholder="“This initiative is transforming STEM education...”"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">
                        Short Description / Excerpt
                      </Label>
                      <Textarea
                        id="excerpt"
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        placeholder="Brief summary shown on the listing page..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.stopPropagation();
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">
                        Full Content (HTML allowed)
                      </Label>
                      <Textarea
                        id="content"
                        rows={6}
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        placeholder="Full newsletter body. You can paste HTML here."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.stopPropagation();
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Hero Image</Label>
                      <div className="flex flex-col gap-3">
                        <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm">Upload Image</span>
                          </div>
                          <input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        {(formData.image || formData.imagePreview) && (
                          <div className="relative w-full rounded-lg overflow-hidden border">
                            <img
                              src={formData.imagePreview || (typeof formData.image === "string" ? formData.image : "/placeholder.svg")}
                              alt="Preview"
                              className="w-full h-48 object-cover"
                            />
                            <div className="flex justify-end p-2 bg-muted/50 border-t">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearImage}
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
                      <Label htmlFor="pdf">PDF Download URL</Label>
                      <Input
                        id="pdf-url"
                        placeholder="https://example.com/newsletter.pdf"
                        value={formData.pdfUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, pdfUrl: e.target.value })
                        }
                      />
                      <div className="flex items-center gap-4">
                        <Input
                          id="pdf"
                          type="file"
                          accept=".pdf"
                          onChange={handlePdfUpload}
                          className="flex-1"
                        />
                        {formData.pdfUrl && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            File attached
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featured: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="featured" className="cursor-pointer">
                        Mark as Featured
                      </Label>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        className="bg-[#00BFA6] hover:bg-[#00A693]"
                        disabled={saving}
                      >
                        {saving ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </span>
                        ) : editingNewsletter ? (
                          "Update Newsletter"
                        ) : (
                          "Create Newsletter"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {renderNewsletterList()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
