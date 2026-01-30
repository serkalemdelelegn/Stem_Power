"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Plus, Edit, Trash2, GripVertical, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminHeader } from "@/components/ui/admin-header";
import type { HeaderLink } from "@/lib/api-types";
import { backendApi } from "@/lib/backend-api";

export default function HeaderManagementPage() {
  const { toast } = useToast();
  const [navItems, setNavItems] = useState<HeaderLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeaderLink | null>(null);
  const [formData, setFormData] = useState({ label: "", url: "", order: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    try {
      setLoading(true);
      const data = await backendApi.get("/api/header");
      setNavItems(data);
    } catch (error) {
      console.error("Error fetching nav items:", error);
      toast({
        title: "Error",
        description: "Failed to load navigation items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ label: "", url: "", order: navItems.length });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: HeaderLink) => {
    setEditingItem(item);
    setFormData({ label: item.label, url: item.url, order: item.order });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this navigation item?"))
      return;

    try {
      await backendApi.delete(`/api/header/${id}`);

      toast({
        title: "Success",
        description: "Navigation item deleted successfully",
      });
      fetchNavItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to delete navigation item",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!formData.label.trim() || !formData.url.trim()) {
      toast({
        title: "Validation Error",
        description: "Label and URL are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        label: formData.label,
        url: formData.url,
        order: formData.order,
      };

      editingItem
        ? await backendApi.put(`/api/header/${editingItem.id}`, payload)
        : await backendApi.post("/api/header", payload);

      toast({
        title: "Success",
        description: editingItem
          ? "Navigation item updated"
          : "Navigation item created",
      });

      setIsDialogOpen(false);
      setEditingItem(null);
      fetchNavItems();
    } catch (error) {
      console.error("Error saving item:", error);
      toast({
        title: "Error",
        description: "Failed to save navigation item",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReorder = async (id: string, newOrder: number) => {
    const item = navItems.find((i) => i.id === id);
    if (!item) return;

    try {
      await backendApi.put(`/api/header/${id}`, { ...item, order: newOrder });
      fetchNavItems();
    } catch (error) {
      console.error("Error reordering item:", error);
      toast({
        title: "Error",
        description: "Failed to reorder navigation item",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <AdminHeader
        title="Header Navigation"
        description="Manage the main site navigation menu"
      />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Navigation Items
            </h2>
            <p className="text-gray-600 mt-1">
              Add, edit, or remove navigation links from the header
            </p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Navigation Item
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">
                Loading navigation items...
              </p>
            </CardContent>
          </Card>
        ) : navItems.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-gray-500">
                No navigation items yet. Click "Add Navigation Item" to get
                started.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Current Navigation Structure</CardTitle>
              <CardDescription>
                These items appear in the main site header. Drag to reorder or
                click edit to modify.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {navItems
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">
                                {item.label}
                              </h3>
                              <Badge variant="secondary">
                                Order: {item.order}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.url}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </a>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      {item.children && item.children.length > 0 && (
                        <div className="ml-8 mt-3 space-y-2 border-l-2 border-gray-200 pl-4">
                          {item.children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between py-2"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {child.label}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  Order: {child.order}
                                </Badge>
                              </div>
                              <span className="text-xs text-gray-500">
                                {child.url}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">
              About Header Navigation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <p className="mb-3">
              The header navigation controls the main menu visible on all pages
              of the website. You can add, edit, or remove navigation items
              here.
            </p>
            <p className="mb-3">Features:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Add new navigation links to the header</li>
              <li>Edit existing navigation items</li>
              <li>Reorder items by updating their order number</li>
              <li>Delete items you no longer need</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Navigation Item" : "Add Navigation Item"}
            </DialogTitle>
            <DialogDescription>
              Configure the navigation link that will appear in the header
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="e.g., Home, About Us"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="e.g., /, /about, /contact"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Display order (lower numbers appear first)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : editingItem ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
