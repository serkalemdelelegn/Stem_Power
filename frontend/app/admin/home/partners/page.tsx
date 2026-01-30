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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Save, ImageIcon } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { backendApi } from "@/lib/backend-api";
import { fetchPartners } from "@/lib/api-content";

interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  description?: string;
}

const normalizePartner = (partner: any): Partner => ({
  id:
    partner.id?.toString() || partner._id?.toString() || Date.now().toString(),
  name: partner.name || "",
  logo: partner.logo_url || partner.logo || "",
  website: partner.website_url || partner.website || undefined,
  description: partner.description || undefined,
});

export default function PartnersShowcasePage() {
  const [sectionData, setSectionData] = useState({
    title: "Our Trusted Partners",
    description:
      "We collaborate with leading organizations, educational institutions, and development partners to expand STEM education across Ethiopia.",
  });

  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch partners from API
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await fetchPartners();
        setPartners(data);
      } catch (error) {
        console.error("Failed to fetch partners:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPartners();
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  const addPartner = () => {
    const newPartner: Partner = {
      id: Date.now().toString(),
      name: "",
      logo: "",
      website: "",
      description: "",
    };
    setEditingPartner(newPartner);
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const editPartner = (partner: Partner) => {
    setEditingPartner({ ...partner });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const savePartner = async () => {
    if (!editingPartner) return;
    try {
      if (!selectedFile && !editingPartner.logo) {
        alert("Logo is required");
        return;
      }

      const formData = new FormData();
      formData.append("name", editingPartner.name);
      formData.append("website_url", editingPartner.website || "");
      formData.append("description", editingPartner.description || "");
      formData.append("is_active", "true");
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const existing = partners.find((p) => p.id === editingPartner.id);
      if (existing) {
        const updated = await backendApi.putFormData(
          `/api/partners/${editingPartner.id}`,
          formData
        );
        const normalized = normalizePartner(updated?.partner || updated);
        setPartners(
          partners.map((p) => (p.id === editingPartner.id ? normalized : p))
        );
      } else {
        const created = await backendApi.postFormData(
          "/api/partners",
          formData
        );
        const normalized = normalizePartner(created);
        setPartners([...partners, normalized]);
      }
      setIsDialogOpen(false);
      setSelectedFile(null);
      setEditingPartner(null);
    } catch (error) {
      console.error("Failed to save partner:", error);
      alert("Failed to save partner. Please try again.");
    }
  };

  const deletePartner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    try {
      await backendApi.delete(`/api/partners/${id}`);
      setPartners(partners.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete partner:", error);
      alert("Failed to delete partner. Please try again.");
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingPartner) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setEditingPartner({ ...editingPartner, logo: previewUrl });
    }
  };

  return (
    <div>
      <AdminHeader
        title="Partners Showcase"
        description="Manage partner organizations and logos"
      />
      <div className="p-6 max-w-6xl space-y-6">
        <Link href="/admin/home">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {/* Section Header */}

        {/* Partners Grid */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Partner Organizations</CardTitle>
                <CardDescription>
                  Manage partner logos and information
                </CardDescription>
              </div>
              <Button
                onClick={addPartner}
                className="bg-[#00BFA6] hover:bg-[#00A693]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Partner
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading partners...</div>
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {partners.map((partner) => (
                  <Card key={partner.id}>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                        {partner.logo ? (
                          <img
                            src={partner.logo || "/placeholder.svg"}
                            alt={partner.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-center mb-3 line-clamp-2">
                        {partner.name || "Unnamed Partner"}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => editPartner(partner)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => deletePartner(partner.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPartner?.name || "New Partner"}</DialogTitle>
              <DialogDescription>
                Configure partner organization details
              </DialogDescription>
            </DialogHeader>
            {editingPartner && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Partner Logo</Label>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                  {editingPartner.logo && (
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center p-4">
                      <img
                        src={editingPartner.logo || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input
                    id="name"
                    value={editingPartner.name}
                    onChange={(e) =>
                      setEditingPartner({
                        ...editingPartner,
                        name: e.target.value,
                      })
                    }
                    placeholder="Partner Organization Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={editingPartner.website}
                    onChange={(e) =>
                      setEditingPartner({
                        ...editingPartner,
                        website: e.target.value,
                      })
                    }
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={editingPartner.description}
                    onChange={(e) =>
                      setEditingPartner({
                        ...editingPartner,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of the partnership..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={savePartner}
                    className="bg-[#00BFA6] hover:bg-[#00A693]"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Partner
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
