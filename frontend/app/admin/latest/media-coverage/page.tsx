"use client";

import type React from "react";

import { AdminHeader } from "@/components/ui/admin-header";
import { BackButton } from "@/components/ui/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { PressArticle } from "@/lib/api-news-other-people";
import { isExternalUrl, normalizeUrl } from "@/lib/utils";
import {
  Building2,
  Calendar,
  Download,
  Edit,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const slugify = (value: string) =>
  value
    ?.toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "";

const getArticleSlug = (article: PressArticle) =>
  article.slug && article.slug.trim()
    ? article.slug
    : slugify(article.title || article.id || "article");

interface ArticleFormData {
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
  link: string;
}

const createEmptyForm = (): ArticleFormData => ({
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
  link: "",
});

const articleToFormData = (article: PressArticle): ArticleFormData => ({
  badge: article.badge || "",
  title: article.title || "",
  date: article.date
    ? article.date.split("T")[0]
    : new Date().toISOString().split("T")[0],
  category: article.category || "",
  author: article.author || "",
  excerpt: article.excerpt || "",
  content: article.content || "",
  readTime: article.readTime || "",
  image: article.image || null,
  pdfUrl: article.pdfUrl || "",
  featured: Boolean(article.featured),
  publication: article.publication || "",
  publicationType: article.publicationType || "",
  quote: article.quote || "",
  topic: article.topic || "",
  link: article.link || article.source || "",
});

export default function MediaCoveragePage() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<PressArticle | null>(
    null
  );
  const [formData, setFormData] = useState<ArticleFormData>(createEmptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const renderArticleList = () => {
    if (loading) {
      return (
        <Card>
          <CardContent className="py-12 flex items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading articles...
          </CardContent>
        </Card>
      );
    }

    if (articles.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No articles found. Create one to get started.
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-6">
        {articles.map((article) => (
          <Card
            key={article.id}
            className={article.featured ? "border-[#00BFA6]" : ""}
          >
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-64 h-48 rounded-lg overflow-hidden bg-muted shrink-0">
                  {article.image ? (
                    <>
                      <img
                        src={article.image || "/placeholder.svg"}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      {article.featured && (
                        <div className="absolute top-3 left-3 bg-[#00BFA6] text-white px-3 py-1 rounded-full text-xs font-medium">
                          ⭐ Featured
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 bg-[#00BFA6]/10 text-[#00BFA6] px-3 py-1 rounded-full text-xs font-medium mb-2">
                        {article.badge || article.category || "Press Article"}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {article.title}
                      </h3>
                      {(article.publication || article.publicationType) && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">
                            {article.publication || "Publication"}
                          </span>
                          {article.publicationType
                            ? ` • ${article.publicationType}`
                            : ""}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.date
                            ? new Date(article.date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "No date"}
                        </span>
                        {article.readTime ? (
                          <>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </>
                        ) : null}
                        {article.category ? (
                          <>
                            <span>•</span>
                            <span>{article.category}</span>
                          </>
                        ) : null}
                        {article.author ? (
                          <>
                            <span>•</span>
                            <span>{article.author}</span>
                          </>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      {article.quote && (
                        <blockquote className="text-sm italic text-[#00A693] border-l-2 border-[#00BFA6] pl-3 mb-4">
                          "{article.quote}"
                        </blockquote>
                      )}
                      <div className="flex flex-wrap items-center gap-3">
                        <Button
                          asChild
                          size="sm"
                          className="bg-[#00BFA6] hover:bg-[#00A693]"
                        >
                          {article.link && isExternalUrl(article.link) ? (
                            <a
                              href={normalizeUrl(article.link) || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View on Site
                            </a>
                          ) : article.source &&
                            isExternalUrl(article.source) ? (
                            <a
                              href={normalizeUrl(article.source) || "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View on Site
                            </a>
                          ) : (
                            <Link
                              href={
                                article.link ||
                                article.source ||
                                `/latest/news/newsletter/${getArticleSlug(
                                  article
                                )}`
                              }
                              target="_blank"
                            >
                              View on Site
                            </Link>
                          )}
                        </Button>
                        {article.pdfUrl ? (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={normalizeUrl(article.pdfUrl) || "#"}
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
                        onClick={() => handleEdit(article)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(article.id)}
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
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/latest/media-coverage");
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();
      // Handle both array and data wrapper
      const articlesArray = Array.isArray(data) ? data : data?.data || [];
      setArticles(articlesArray);
    } catch (error) {
      console.error("Failed to load articles", error);
      toast({
        title: "Error",
        description: "Unable to load articles. Please try again.",
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

  const handleEdit = (article: PressArticle) => {
    setEditingArticle(article);
    const formDataFromArticle = articleToFormData(article);
    setFormData({
      ...formDataFromArticle,
      imagePreview: undefined, // Clear preview when editing
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) {
      return;
    }
    try {
      const response = await fetch(`/api/latest/media-coverage/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete article");
      }
      toast({
        title: "Article removed",
        description: "The article entry has been deleted.",
      });
      fetchArticles();
    } catch (error) {
      console.error("Failed to delete article", error);
      toast({
        title: "Error",
        description: "Unable to delete article. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for the article.",
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
      pdfUrl: normalizeUrl(formData.pdfUrl) || null,
      featured: formData.featured,
      publication: formData.publication,
      publicationType: formData.publicationType,
      quote: formData.quote,
      topic: formData.topic,
      link: normalizeUrl(formData.link) || formData.link || "",
      source: "press",
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

        const url = editingArticle
          ? `/api/latest/media-coverage/${editingArticle.id}`
          : "/api/latest/media-coverage";
        const method = editingArticle ? "PUT" : "POST";

        response = await fetch(url, {
          method,
          body: formDataToSend,
        });
      } else {
        // Use JSON for string URLs or null
        const url = editingArticle
          ? `/api/latest/media-coverage/${editingArticle.id}`
          : "/api/latest/media-coverage";
        const method = editingArticle ? "PUT" : "POST";

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
          errorData.error || errorData.message || "Failed to save article"
        );
      }

      const saved = await response.json();

      // Clean up preview URL
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }

      toast({
        title: "Success",
        description: editingArticle ? "Article updated." : "Article created.",
      });

      setIsDialogOpen(false);
      setEditingArticle(null);
      setFormData(createEmptyForm());
      fetchArticles();
    } catch (error: any) {
      console.error("Failed to save article", error);
      toast({
        title: "Error",
        description:
          error.message ||
          (editingArticle
            ? "Unable to update article."
            : "Unable to create article."),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Media Coverage Management"
        description="Manage press articles and media coverage"
      />
      <div className="p-6 max-w-7xl">
        <BackButton />

        <Tabs defaultValue="articles" className="mt-6">
          <TabsList className="grid w-full max-w-md grid-cols-1">
            <TabsTrigger value="articles">Press Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">All Press Articles</h2>
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? "Loading..."
                    : `${articles.length} total article${
                        articles.length === 1 ? "" : "s"
                      }`}
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                    onClick={() => {
                      setEditingArticle(null);
                      // Clean up any preview URL
                      if (formData.imagePreview) {
                        URL.revokeObjectURL(formData.imagePreview);
                      }
                      setFormData(createEmptyForm());
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingArticle ? "Edit Article" : "Add New Article"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingArticle
                        ? "Update the article details"
                        : "Create a new press article"}
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
                          placeholder="Featured, Latest, etc."
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
                        placeholder="STEMpower Ethiopia Featured in National News"
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
                          placeholder="News, Feature, Interview, etc."
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
                          placeholder="Journalist Name"
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
                          placeholder="Education, Innovation, STEM Centers..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="link">Article URL</Label>
                        <Input
                          id="link"
                          value={formData.link}
                          onChange={(e) =>
                            setFormData({ ...formData, link: e.target.value })
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
                        placeholder='"This initiative is transforming STEM education..."'
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.stopPropagation();
                        }}
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
                        placeholder="Full article body. You can paste HTML here."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.stopPropagation();
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">Article Image</Label>
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
                              src={
                                formData.imagePreview ||
                                (typeof formData.image === "string"
                                  ? formData.image
                                  : "/placeholder.svg")
                              }
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
                        placeholder="https://example.com/article.pdf"
                        value={formData.pdfUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, pdfUrl: e.target.value })
                        }
                      />
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
                        ) : editingArticle ? (
                          "Update Article"
                        ) : (
                          "Create Article"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {renderArticleList()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
