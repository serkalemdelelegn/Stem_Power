"use client";

import {
  Edit,
  ExternalLink,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  Plus,
  Share2,
  Trash2,
  TrendingUp,
  Users
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
import type { SocialMediaHero, SocialMediaPost } from "@/lib/api-types";
import { normalizeUrl } from "@/lib/utils";

const SOCIAL_PLATFORMS = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "Twitter",
  "TikTok",
] as const;
type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

type SocialFormState = {
  platform: SocialPlatform;
  content: string;
  date: string;
  link: string;
  likes: number;
  comments: number;
  shares: number;
  image: string | File | null;
  imagePreview?: string;
};

type EditableSocialPost = SocialMediaPost & { platform: string };

const DEFAULT_HERO: SocialMediaHero = {
  badge: "Social Media Updates",
  title: "Follow Our Journey on Social Media",
  description:
    "Stay connected with our daily updates, inspiring stories, and behind-the-scenes moments from the STEMpower Ethiopia community across all social platforms.",
  statistics: {
    stat1Value: "25K+",
    stat1Label: "Total Followers",
    stat2Value: "150K+",
    stat2Label: "Monthly Reach",
    stat3Value: "8.5%",
    stat3Label: "Engagement Rate",
  },
};

const createEmptyForm = (): SocialFormState => ({
  platform: "Instagram",
  content: "",
  date: new Date().toISOString().split("T")[0],
  link: "",
  likes: 0,
  comments: 0,
  shares: 0,
  image: "",
});

const mergeHeroData = (hero?: SocialMediaHero | null): SocialMediaHero => ({
  ...DEFAULT_HERO,
  ...(hero || {}),
  statistics: {
    ...DEFAULT_HERO.statistics,
    ...(hero?.statistics || {}),
  },
});

const normalizePlatform = (value: string): SocialPlatform =>
  SOCIAL_PLATFORMS.includes(value as SocialPlatform)
    ? (value as SocialPlatform)
    : "Instagram";

const formatDateLabel = (value?: string) => {
  if (!value) return "Date TBA";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
};

const getPlatformColor = (platform: string) => {
  const colors: Record<string, string> = {
    Instagram: "bg-linear-to-r from-purple-500 to-pink-500",
    Facebook: "bg-blue-600",
    LinkedIn: "bg-blue-700",
    Twitter: "bg-sky-500",
    TikTok: "bg-black",
  };
  return colors[platform] || "bg-gray-600";
};

export default function SocialMediaPage() {
  const { toast } = useToast();
  const [heroBanner, setHeroBanner] = useState<SocialMediaHero>(DEFAULT_HERO);
  const [heroDraft, setHeroDraft] = useState<SocialMediaHero>(DEFAULT_HERO);
  const [posts, setPosts] = useState<EditableSocialPost[]>([]);
  const [isHeroDialogOpen, setIsHeroDialogOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<EditableSocialPost | null>(
    null
  );
  const [formData, setFormData] = useState<SocialFormState>(createEmptyForm());
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postSaving, setPostSaving] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);

  const fetchHero = useCallback(async () => {
    try {
      const response = await fetch("/api/latest/social-media/hero", {
        cache: "no-store",
      });
      if (!response.ok) {
        setHeroBanner(DEFAULT_HERO);
        return;
      }
      const data = await response.json();
      setHeroBanner(mergeHeroData(data));
    } catch (error) {
      console.error("Failed to load social hero", error);
      setHeroBanner(DEFAULT_HERO);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoadingPosts(true);
      const response = await fetch("/api/latest/social-media", {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Failed to load posts");
      }
      const data: SocialMediaPost[] | { data: SocialMediaPost[] } =
        await response.json();
      // Handle both array and data wrapper
      const postsArray = Array.isArray(data) ? data : (data as any)?.data || [];
      const normalized = postsArray.map(
        (item: { platform: any; likes: any; comments: any; shares: any }) => ({
          ...item,
          platform: normalizePlatform(item.platform || "Instagram"),
          likes: typeof item.likes === "number" ? item.likes : 0,
          comments: typeof item.comments === "number" ? item.comments : 0,
          shares: typeof item.shares === "number" ? item.shares : 0,
        })
      );
      setPosts(normalized);
    } catch (error) {
      console.error("Failed to load social posts", error);
      toast({
        title: "Unable to load social posts",
        description: "Please refresh the page or try again later.",
        variant: "destructive",
      });
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHero();
    fetchPosts();
  }, [fetchHero, fetchPosts]);

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

  const handleEdit = (post: EditableSocialPost) => {
    setEditingPost(post);
    setFormData({
      platform: normalizePlatform(post.platform || "Instagram"),
      content: post.content,
      date: post.date
        ? new Date(post.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      link: post.link || "",
      likes: typeof post.likes === "number" ? post.likes : 0,
      comments: typeof post.comments === "number" ? post.comments : 0,
      shares: typeof post.shares === "number" ? post.shares : 0,
      image: post.image || null,
      imagePreview: undefined,
    });
    setIsPostDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`/api/latest/social-media/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete");
      }
      toast({
        title: "Post removed",
        description: "The social media post has been deleted.",
      });
      fetchPosts();
    } catch (error) {
      console.error("Failed to delete social post", error);
      toast({
        title: "Error",
        description: "Unable to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSavePost = async () => {
    if (!formData.content.trim()) {
      toast({
        title: "Content required",
        description: "Please provide post content before saving.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      platform: formData.platform,
      content: formData.content,
      date: formData.date,
      link: normalizeUrl(formData.link) || null,
      likes: formData.likes,
      comments: formData.comments,
      shares: formData.shares,
      image: formData.image instanceof File ? null : formData.image || null,
    };

    try {
      setPostSaving(true);
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

        const url = editingPost
          ? `/api/latest/social-media/${editingPost.id}`
          : "/api/latest/social-media";
        const method = editingPost ? "PUT" : "POST";

        response = await fetch(url, {
          method,
          body: formDataToSend,
        });
      } else {
        // Use JSON for string URLs or null
        const url = editingPost
          ? `/api/latest/social-media/${editingPost.id}`
          : "/api/latest/social-media";
        const method = editingPost ? "PUT" : "POST";

        response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Failed to save" }));
        throw new Error(
          errorData.error || errorData.message || "Failed to save post"
        );
      }

      const saved = await response.json();

      // Clean up preview URL
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }

      toast({
        title: editingPost ? "Post updated" : "Post created",
        description: editingPost
          ? "The social media post was updated."
          : "A new social media post was added.",
      });
      setIsPostDialogOpen(false);
      setEditingPost(null);
      setFormData(createEmptyForm());
      fetchPosts();
    } catch (error: any) {
      console.error("Failed to save social post", error);
      toast({
        title: "Error",
        description:
          error.message ||
          (editingPost
            ? "Unable to update the post."
            : "Unable to create the post."),
        variant: "destructive",
      });
    } finally {
      setPostSaving(false);
    }
  };

  const handleSaveHero = async () => {
    try {
      setHeroSaving(true);
      const response = await fetch("/api/latest/social-media/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroDraft),
      });
      if (!response.ok) {
        throw new Error("Failed to save hero");
      }
      const data = await response.json();
      setHeroBanner(mergeHeroData(data));
      toast({
        title: "Hero updated",
        description: "Social media hero section saved successfully.",
      });
      setIsHeroDialogOpen(false);
    } catch (error) {
      console.error("Failed to save hero", error);
      toast({
        title: "Error",
        description: "Unable to save the hero section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setHeroSaving(false);
    }
  };

  return (
    <div>
      <AdminHeader
        title="Social Media Posts"
        description="Manage social media content and hero banner"
      />
      <div className="p-6 max-w-7xl">
        <BackButton />

        <div className="flex justify-end mb-6 gap-3">
          <Button
            variant="outline"
            onClick={fetchPosts}
            disabled={loadingPosts}
          >
            {loadingPosts ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing...
              </span>
            ) : (
              "Refresh Posts"
            )}
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="hero">Hero Banner</TabsTrigger>
            <TabsTrigger value="posts">Social Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Hero Banner Section</CardTitle>
                    <CardDescription>
                      Customize the hero banner for the social media page
                    </CardDescription>
                  </div>
                  <Dialog
                    open={isHeroDialogOpen}
                    onOpenChange={(open) => {
                      setIsHeroDialogOpen(open);
                      if (open) {
                        setHeroDraft(heroBanner);
                      }
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Hero
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Hero Banner</DialogTitle>
                        <DialogDescription>
                          Update the hero section content
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4 max-h-[90vh] overflow-y-auto">
                        <div className="space-y-2">
                          <Label htmlFor="hero-badge">Badge Text</Label>
                          <Input
                            id="hero-badge"
                            value={heroDraft.badge}
                            onChange={(e) =>
                              setHeroDraft({
                                ...heroDraft,
                                badge: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hero-title">Title</Label>
                          <Input
                            id="hero-title"
                            value={heroDraft.title}
                            onChange={(e) =>
                              setHeroDraft({
                                ...heroDraft,
                                title: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="hero-description">Description</Label>
                          <Textarea
                            id="hero-description"
                            rows={3}
                            value={heroDraft.description}
                            onChange={(e) =>
                              setHeroDraft({
                                ...heroDraft,
                                description: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.stopPropagation();
                            }}
                          />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Statistic 1 Value</Label>
                            <Input
                              value={heroDraft.statistics.stat1Value}
                              onChange={(e) =>
                                setHeroDraft({
                                  ...heroDraft,
                                  statistics: {
                                    ...heroDraft.statistics,
                                    stat1Value: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Statistic 1 Label</Label>
                            <Input
                              value={heroDraft.statistics.stat1Label}
                              onChange={(e) =>
                                setHeroDraft({
                                  ...heroDraft,
                                  statistics: {
                                    ...heroDraft.statistics,
                                    stat1Label: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Statistic 2 Value</Label>
                            <Input
                              value={heroDraft.statistics.stat2Value}
                              onChange={(e) =>
                                setHeroDraft({
                                  ...heroDraft,
                                  statistics: {
                                    ...heroDraft.statistics,
                                    stat2Value: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Statistic 2 Label</Label>
                            <Input
                              value={heroDraft.statistics.stat2Label}
                              onChange={(e) =>
                                setHeroDraft({
                                  ...heroDraft,
                                  statistics: {
                                    ...heroDraft.statistics,
                                    stat2Label: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Statistic 3 Value</Label>
                            <Input
                              value={heroDraft.statistics.stat3Value}
                              onChange={(e) =>
                                setHeroDraft({
                                  ...heroDraft,
                                  statistics: {
                                    ...heroDraft.statistics,
                                    stat3Value: e.target.value,
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Statistic 3 Label</Label>
                            <Input
                              value={heroDraft.statistics.stat3Label}
                              onChange={(e) =>
                                setHeroDraft({
                                  ...heroDraft,
                                  statistics: {
                                    ...heroDraft.statistics,
                                    stat3Label: e.target.value,
                                  },
                                })
                              }
                            />
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
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-linear-to-br from-teal-500 to-teal-600 p-8 text-white">
                  <div className="mb-4">
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                      {heroBanner.badge}
                    </span>
                  </div>
                  <h2 className="mb-4 text-4xl font-bold">
                    {heroBanner.title}
                  </h2>
                  <p className="mb-8 text-lg text-white/90">
                    {heroBanner.description}
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <Users className="mb-2 h-6 w-6" />
                      <div className="text-3xl font-bold">
                        {heroBanner.statistics.stat1Value}
                      </div>
                      <div className="text-sm text-white/80">
                        {heroBanner.statistics.stat1Label}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <Eye className="mb-2 h-6 w-6" />
                      <div className="text-3xl font-bold">
                        {heroBanner.statistics.stat2Value}
                      </div>
                      <div className="text-sm text-white/80">
                        {heroBanner.statistics.stat2Label}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      <TrendingUp className="mb-2 h-6 w-6" />
                      <div className="text-3xl font-bold">
                        {heroBanner.statistics.stat3Value}
                      </div>
                      <div className="text-sm text-white/80">
                        {heroBanner.statistics.stat3Label}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">
                  All Social Media Posts
                </h2>
                <p className="text-sm text-muted-foreground">
                  {loadingPosts
                    ? "Loading..."
                    : `${posts.length} post${
                        posts.length === 1 ? "" : "s"
                      } across all platforms`}
                </p>
              </div>
              <Dialog
                open={isPostDialogOpen}
                onOpenChange={(open) => {
                  setIsPostDialogOpen(open);
                  if (!open) {
                    setEditingPost(null);
                    setFormData(createEmptyForm());
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                    onClick={() => {
                      setEditingPost(null);
                      setFormData(createEmptyForm());
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPost ? "Edit Social Media Post" : "Add New Post"}
                    </DialogTitle>
                    <DialogDescription>
                      Share updates across social media platforms
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <select
                        id="platform"
                        value={formData.platform}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            platform: e.target.value as SocialPlatform,
                          })
                        }
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image-upload">Post Image</Label>
                      <div className="flex flex-col gap-3">
                        <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span className="text-sm">Upload Image</span>
                          </div>
                          <input
                            id="image-upload"
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
                      <Label htmlFor="content">Post Content</Label>
                      <Textarea
                        id="content"
                        rows={4}
                        placeholder="Write your post content..."
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Post Date</Label>
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
                      <Label htmlFor="link">Link to Original Post</Label>
                      <Input
                        id="link"
                        placeholder="https://instagram.com/p/..."
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="likes">Likes</Label>
                        <Input
                          id="likes"
                          type="number"
                          value={formData.likes}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              likes: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="comments">Comments</Label>
                        <Input
                          id="comments"
                          type="number"
                          value={formData.comments}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              comments: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="shares">Shares</Label>
                        <Input
                          id="shares"
                          type="number"
                          value={formData.shares}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              shares: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsPostDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSavePost}
                        className="bg-[#00BFA6] hover:bg-[#00A693]"
                        disabled={postSaving}
                      >
                        {postSaving ? (
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                          </span>
                        ) : editingPost ? (
                          "Update Post"
                        ) : (
                          "Create Post"
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {loadingPosts ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading social posts...
                  </CardContent>
                </Card>
              ) : posts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No posts found. Add one to get started.
                  </CardContent>
                </Card>
              ) : (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                        <div className="flex gap-4 flex-1">
                          {post.image && (
                            <img
                              src={post.image || "/placeholder.svg"}
                              alt="Post"
                              className="h-24 w-24 rounded object-cover shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`text-xs px-3 py-1 rounded-full text-white ${getPlatformColor(
                                  post.platform
                                )}`}
                              >
                                {post.platform}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatDateLabel(post.date)}
                              </span>
                            </div>
                            <p className="text-sm mb-3">{post.content}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
                              <span className="inline-flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                {post.likes?.toLocaleString() || "0"}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                {post.comments?.toLocaleString() || "0"}
                              </span>
                              {post.shares ? (
                                <span className="inline-flex items-center gap-1">
                                  <Share2 className="h-3 w-3" />
                                  {post.shares?.toLocaleString() || "0"}
                                </span>
                              ) : null}
                            </div>
                            {post.link ? (
                              <a
                                href={normalizeUrl(post.link) || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#00BFA6] hover:underline inline-flex items-center gap-1"
                              >
                                View Original Post{" "}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                No link provided
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
