"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2, Save, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SOCIAL_MEDIA_PLATFORMS = [
  { id: "facebook", name: "Facebook", icon: "f" },
  { id: "twitter", name: "Twitter / X", icon: "𝕏" },
  { id: "linkedin", name: "LinkedIn", icon: "in" },
  { id: "instagram", name: "Instagram", icon: "📷" },
  { id: "youtube", name: "YouTube", icon: "▶" },
  { id: "tiktok", name: "TikTok", icon: "♪" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬" },
  { id: "telegram", name: "Telegram", icon: "✈" },
  { id: "github", name: "GitHub", icon: "⚙" },
  { id: "pinterest", name: "Pinterest", icon: "P" },
];

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface FooterLink {
  id: string;
  label: string;
  url: string;
}

interface FooterSection {
  id: string;
  title: string;
  links: FooterLink[];
}

interface FooterData {
  logo: string;
  description: string;
  socialLinks: SocialLink[];
  sections: FooterSection[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  copyrightText: string;
}

export default function FooterManagementPage() {
  const { toast } = useToast();
  const [footerData, setFooterData] = useState<FooterData>({
    logo: "/STEMpower_s_logo.png",
    description:
      "Empowering Ethiopian youth through science, technology, engineering, and mathematics education.",
    socialLinks: [],
    sections: [],
    contactEmail: "info@stempowerethiopia.org",
    contactPhone: "+251 91 123 4567",
    contactAddress: "Addis Ababa, Ethiopia",
    copyrightText:
      "STEMpower Ethiopia. All rights reserved. | Empowering the next generation through STEM education.",
  });

  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [editingSection, setEditingSection] = useState<FooterSection | null>(
    null
  );
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingBasic, setIsSavingBasic] = useState(false);
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [isSavingSection, setIsSavingSection] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Fetch footer data on mount
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/footer");
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setFooterData({
              logo: data.logo || "/STEMpower_s_logo.png",
              description: data.description || "",
              socialLinks: data.socialLinks || [],
              sections: data.sections || [],
              contactEmail: data.contactEmail || "",
              contactPhone: data.contactPhone || "",
              contactAddress: data.contactAddress || "",
              copyrightText: data.copyrightText || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch footer data:", error);
        toast({
          title: "Error",
          description: "Failed to load footer data. Using defaults.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, [toast]);

  const handleSaveBasicInfo = async () => {
    try {
      setIsSavingBasic(true);

      const formData = new FormData();

      // Add logo file if a new one was selected
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // Add other fields
      formData.append("description", footerData.description);
      formData.append("copyrightText", footerData.copyrightText);
      formData.append("contactEmail", footerData.contactEmail);
      formData.append("contactPhone", footerData.contactPhone);
      formData.append("contactAddress", footerData.contactAddress);

      // If no new logo file but logo exists (URL), include it
      if (
        !logoFile &&
        footerData.logo &&
        !footerData.logo.startsWith("data:")
      ) {
        formData.append("logo", footerData.logo);
      }

      const response = await fetch("/api/footer", {
        method: "PUT",
        body: formData, // FormData will set Content-Type automatically
      });

      if (response.ok) {
        const result = await response.json();
        // Update logo if a new one was uploaded
        if (result.data && result.data.logo) {
          setFooterData({ ...footerData, logo: result.data.logo });
          setLogoFile(null); // Clear the file after successful upload
        }
        toast({
          title: "Footer Updated",
          description: "Basic footer information has been saved successfully.",
        });
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to save" }));
        throw new Error(errorData.message || "Failed to save");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save footer information.",
        variant: "destructive",
      });
    } finally {
      setIsSavingBasic(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file for upload
      setLogoFile(file);

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFooterData({ ...footerData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);

      toast({
        title: "Logo Selected",
        description: "Click 'Save Basic Info' to upload the logo.",
      });
    }
  };

  const handleSaveSocial = async (social: SocialLink) => {
    try {
      setIsSavingSocial(true);

      if (editingSocial && editingSocial.id) {
        // Update existing
        const response = await fetch(
          `/api/footer/social-links/${editingSocial.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              platform: social.platform,
              url: social.url,
            }),
          }
        );

        if (response.ok) {
          const updated = await response.json();
          setFooterData({
            ...footerData,
            socialLinks: footerData.socialLinks.map((s) =>
              s.id === editingSocial.id
                ? { ...social, id: updated.id || editingSocial.id }
                : s
            ),
          });
          toast({
            title: "Social Link Updated",
            description: "Social media link has been updated.",
          });
          setEditingSocial(null);
          setIsAddingSocial(false);
        } else {
          throw new Error("Failed to update");
        }
      } else {
        // Create new
        const response = await fetch("/api/footer/social-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform: social.platform,
            url: social.url,
          }),
        });

        if (response.ok) {
          const created = await response.json();
          setFooterData({
            ...footerData,
            socialLinks: [
              ...footerData.socialLinks,
              { ...social, id: created.id || Date.now().toString() },
            ],
          });
          toast({
            title: "Social Link Created",
            description: "Social media link has been added.",
          });
          setEditingSocial(null);
          setIsAddingSocial(false);
        } else {
          throw new Error("Failed to create");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save social link.",
        variant: "destructive",
      });
    } finally {
      setIsSavingSocial(false);
    }
  };

  const handleDeleteSocial = async (id: string) => {
    try {
      const response = await fetch(`/api/footer/social-links/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFooterData({
          ...footerData,
          socialLinks: footerData.socialLinks.filter((s) => s.id !== id),
        });
        toast({
          title: "Social Link Deleted",
          description: "Social media link has been removed.",
        });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete social link.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSection = async (section: FooterSection) => {
    try {
      setIsSavingSection(true);

      if (editingSection && editingSection.id) {
        // Update existing
        const response = await fetch(
          `/api/footer/sections/${editingSection.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: section.title,
              links: section.links,
            }),
          }
        );

        if (response.ok) {
          const updated = await response.json();
          setFooterData({
            ...footerData,
            sections: footerData.sections.map((s) =>
              s.id === editingSection.id
                ? { ...section, id: updated.id || editingSection.id }
                : s
            ),
          });
          toast({
            title: "Footer Section Updated",
            description: "Footer section has been updated.",
          });
          setEditingSection(null);
          setIsAddingSection(false);
        } else {
          throw new Error("Failed to update");
        }
      } else {
        // Create new
        const response = await fetch("/api/footer/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: section.title,
            links: section.links,
          }),
        });

        if (response.ok) {
          const created = await response.json();
          setFooterData({
            ...footerData,
            sections: [
              ...footerData.sections,
              { ...section, id: created.id || Date.now().toString() },
            ],
          });
          toast({
            title: "Footer Section Created",
            description: "Footer section has been added.",
          });
          setEditingSection(null);
          setIsAddingSection(false);
        } else {
          throw new Error("Failed to create");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save footer section.",
        variant: "destructive",
      });
    } finally {
      setIsSavingSection(false);
    }
  };

  const handleDeleteSection = (id: string) => {
    setFooterData({
      ...footerData,
      sections: footerData.sections.filter((s) => s.id !== id),
    });
    toast({
      title: "Section Deleted",
      description: "Footer section has been removed.",
    });
  };

  const getPlatformName = (platformId: string) => {
    return (
      SOCIAL_MEDIA_PLATFORMS.find((p) => p.id === platformId)?.name ||
      platformId
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading footer data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Footer Management</h1>
        <p className="text-gray-600 mt-2">
          Manage footer content, social links, and navigation sections
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Update footer branding and description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo Upload</Label>
            <div className="flex items-center gap-4">
              {footerData.logo && (
                <div className="h-16 w-16 rounded border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={footerData.logo || "/placeholder.svg"}
                    alt="Logo preview"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00BFA6] transition-colors">
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="text-sm">Click to upload logo</span>
                  </div>
                  <input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={footerData.description}
              onChange={(e) =>
                setFooterData({ ...footerData, description: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Text</Label>
            <Input
              id="copyright"
              value={footerData.copyrightText}
              onChange={(e) =>
                setFooterData({ ...footerData, copyrightText: e.target.value })
              }
            />
          </div>
          <Button onClick={handleSaveBasicInfo} disabled={isSavingBasic}>
            <Save className="h-4 w-4 mr-2" />
            {isSavingBasic ? "Saving..." : "Save Basic Info"}
          </Button>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Update contact details displayed in footer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={footerData.contactEmail}
                onChange={(e) =>
                  setFooterData({ ...footerData, contactEmail: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={footerData.contactPhone}
                onChange={(e) =>
                  setFooterData({ ...footerData, contactPhone: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={footerData.contactAddress}
                onChange={(e) =>
                  setFooterData({
                    ...footerData,
                    contactAddress: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <Button onClick={handleSaveBasicInfo} disabled={isSavingBasic}>
            <Save className="h-4 w-4 mr-2" />
            {isSavingBasic ? "Saving..." : "Save Contact Info"}
          </Button>
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Manage social media profiles</CardDescription>
            </div>
            <Button
              onClick={() => setIsAddingSocial(true)}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Social Link
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {footerData.socialLinks.map((social) => (
              <div
                key={social.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#00BFA6] flex items-center justify-center text-white text-xs font-semibold">
                    {SOCIAL_MEDIA_PLATFORMS.find(
                      (p) => p.id === social.platform
                    )?.icon || social.platform[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {getPlatformName(social.platform)}
                    </p>
                    <p className="text-sm text-gray-600">{social.url}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSocial(social)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSocial(social.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Sections */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Footer Sections</CardTitle>
              <CardDescription>
                Manage footer navigation sections
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddingSection(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {footerData.sections.map((section) => (
              <div key={section.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection(section)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  {section.links.map((link) => (
                    <div key={link.id} className="text-sm text-gray-600">
                      {link.label} → {link.url}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Link Dialog */}
      <Dialog
        open={isAddingSocial || editingSocial !== null}
        onOpenChange={() => {
          setIsAddingSocial(false);
          setEditingSocial(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSocial ? "Edit Social Link" : "Add Social Link"}
            </DialogTitle>
            <DialogDescription>
              Configure social media profile link
            </DialogDescription>
          </DialogHeader>
          <SocialLinkForm
            social={editingSocial || { id: "", platform: "", url: "" }}
            onSave={handleSaveSocial}
            onCancel={() => {
              setIsAddingSocial(false);
              setEditingSocial(null);
            }}
            isLoading={isSavingSocial}
          />
        </DialogContent>
      </Dialog>

      {/* Section Dialog */}
      <Dialog
        open={isAddingSection || editingSection !== null}
        onOpenChange={() => {
          setIsAddingSection(false);
          setEditingSection(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? "Edit Footer Section" : "Add Footer Section"}
            </DialogTitle>
            <DialogDescription>
              Configure footer navigation section
            </DialogDescription>
          </DialogHeader>
          <FooterSectionForm
            section={editingSection || { id: "", title: "", links: [] }}
            onSave={handleSaveSection}
            onCancel={() => {
              setIsAddingSection(false);
              setEditingSection(null);
            }}
            isLoading={isSavingSection}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SocialLinkForm({
  social,
  onSave,
  onCancel,
  isLoading = false,
}: {
  social: SocialLink;
  onSave: (social: SocialLink) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState(social);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="platform">Platform</Label>
        <Select
          value={formData.platform}
          onValueChange={(value) =>
            setFormData({ ...formData, platform: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
              <SelectItem key={platform.id} value={platform.id}>
                {platform.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://facebook.com/stempowerethiopia"
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </div>
  );
}

function FooterSectionForm({
  section,
  onSave,
  onCancel,
  isLoading = false,
}: {
  section: FooterSection;
  onSave: (section: FooterSection) => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  const [formData, setFormData] = useState(section);

  const addLink = () => {
    setFormData({
      ...formData,
      links: [
        ...formData.links,
        { id: Date.now().toString(), label: "", url: "" },
      ],
    });
  };

  const updateLink = (id: string, field: "label" | "url", value: string) => {
    setFormData({
      ...formData,
      links: formData.links.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    });
  };

  const removeLink = (id: string) => {
    setFormData({
      ...formData,
      links: formData.links.filter((link) => link.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Section Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Quick Links"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Links</Label>
          <Button type="button" variant="outline" size="sm" onClick={addLink}>
            <Plus className="h-4 w-4 mr-2" />
            Add Link
          </Button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {formData.links.map((link) => (
            <div key={link.id} className="flex gap-2">
              <Input
                placeholder="Label"
                value={link.label}
                onChange={(e) => updateLink(link.id, "label", e.target.value)}
              />
              <Input
                placeholder="URL"
                value={link.url}
                onChange={(e) => updateLink(link.id, "url", e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLink(link.id)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Section"}
        </Button>
      </DialogFooter>
    </div>
  );
}
