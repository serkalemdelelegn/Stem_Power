"use client";

import { useEffect, useState } from "react";
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
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { backendApi } from "@/lib/backend-api";
import {
  DynamicPage,
  PageEditorForm,
} from "@/components/admin/dynamic-page-form";
import { Eye, Layout, Pencil, Trash2 } from "lucide-react";

export default function DynamicPagesPage() {
  const { toast } = useToast();
  const [pages, setPages] = useState<DynamicPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const data = await backendApi.get("/api/pages");
      const pagesWithIds = (data || []).map((page: any) => ({
        ...page,
        id: page.id || `temp-${Date.now()}-${Math.random()}`,
      }));
      setPages(pagesWithIds);
    } catch (error) {
      console.error("Error fetching pages:", error);
      toast({
        title: "Error",
        description: "Failed to load dynamic pages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePage = async (page: DynamicPage) => {
    try {
      setSaving(true);
      const payload = {
        ...page,
        createdAt: page.createdAt || new Date().toISOString(),
      };

      const savedPage =
        editingPage && editingPage.id
          ? await backendApi.put(`/api/pages/${editingPage.id}`, payload)
          : await backendApi.post("/api/pages", payload);

      if (!editingPage && page.status === "published") {
        try {
          await backendApi.post("/api/header", {
            label: page.title,
            url: `/${page.slug}`,
            order: 999,
          });
        } catch (err) {
          console.error("Failed to add page to header:", err);
        }
      }

      toast({
        title: editingPage ? "Page Updated" : "Page Created",
        description: editingPage
          ? "Dynamic page has been updated successfully."
          : "New dynamic page has been created and added to navigation.",
      });

      setEditingPage(null);
      setIsAddingPage(false);
      fetchPages();
      return savedPage;
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save page",
        variant: "destructive",
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this page? This will also remove it from navigation."
      )
    )
      return;

    try {
      await backendApi.delete(`/api/pages/${id}`);

      const page = pages.find((p) => p.id === id);
      if (page) {
        try {
          const headerItems = await backendApi.get("/api/header");
          const headerItem = headerItems.find(
            (item: any) => item.url === `/${page.slug}`
          );
          if (headerItem) {
            await backendApi.delete(`/api/header/${headerItem.id}`);
          }
        } catch (err) {
          console.error("Failed to remove from header:", err);
        }
      }

      toast({
        title: "Page Deleted",
        description: "Dynamic page has been removed.",
      });
      fetchPages();
    } catch (error) {
      console.error("Error deleting page:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete page",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: string) => {
    const page = pages.find((p) => p.id === id);
    if (!page) {
      toast({
        title: "Error",
        description: "Page not found",
        variant: "destructive",
      });
      return;
    }

    const newStatus = page.status === "published" ? "draft" : "published";

    try {
      const url = `/api/pages/${encodeURIComponent(id)}`;
      await backendApi.put(url, { ...page, status: newStatus });

      if (newStatus === "published") {
        try {
          await backendApi.post("/api/header", {
            label: page.title,
            url: `/${page.slug}`,
            order: 999,
          });
        } catch (err) {
          console.error("Failed to add to header:", err);
        }
      } else {
        try {
          const headerItems = await backendApi.get("/api/header");
          const headerItem = headerItems.find(
            (item: any) => item.url === `/${page.slug}`
          );
          if (headerItem) {
            await backendApi.delete(`/api/header/${headerItem.id}`);
          }
        } catch (err) {
          console.error("Failed to remove from header:", err);
        }
      }

      toast({
        title: "Status Updated",
        description: "Page status has been changed.",
      });
      fetchPages();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update page status",
        variant: "destructive",
      });
    }
  };

  const emptyPage: DynamicPage = {
    id: "",
    title: "",
    slug: "",
    description: "",
    heroImage: "",
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
    ctaText: "Learn More",
    ctaLink: "#",
    sections: [],
    status: "draft",
    createdAt: "",
    program: null,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Pages</h1>
          <p className="text-gray-600 mt-2">
            Create and manage custom pages with full layouts
          </p>
        </div>
        <Button onClick={() => setIsAddingPage(true)}>Create New Page</Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Loading pages...</p>
          </CardContent>
        </Card>
      ) : pages.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Layout className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Dynamic Pages Yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first dynamic page to get started
            </p>
            <Button onClick={() => setIsAddingPage(true)}>Create Page</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Badge variant="outline">{page.status}</Badge>
                    <CardTitle className="text-xl">{page.title}</CardTitle>
                    <CardDescription className="text-xs">
                      /{page.slug}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEditingPage(page)}
                      aria-label="Edit page"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleToggleStatus(page.id)}
                      aria-label="Toggle publish"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeletePage(page.id)}
                      aria-label="Delete page"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {page.description || "No description"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Slug: {page.slug}</Badge>
                  <Badge variant="secondary">
                    Sections: {page.sections?.length || 0}
                  </Badge>
                  {page.program && (
                    <Badge variant="secondary">Program: {page.program}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={isAddingPage || editingPage !== null}
        onOpenChange={() => {
          setIsAddingPage(false);
          setEditingPage(null);
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPage ? "Edit Page" : "Create Page"}
            </DialogTitle>
            <DialogDescription>
              Configure page settings, hero section, and content sections
            </DialogDescription>
          </DialogHeader>
          <PageEditorForm
            page={editingPage || emptyPage}
            onSave={handleSavePage}
            onCancel={() => {
              setIsAddingPage(false);
              setEditingPage(null);
            }}
            saving={saving}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
