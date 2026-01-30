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
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Trash2,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  Circle,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ContactSubmission } from "@/lib/contact-submissions-store";

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

interface SocialMediaLink {
  id: string;
  platform: string;
  url: string;
}

export default function ContactPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    address: "",
    addressDetails: "",
    phone: "",
    mobile: "",
    email: "",
    website: "",
    officeHours: "",
    mapLink: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>(
    []
  );

  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchContactInfo = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/contact");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched contact info:", data);
        setFormData({
          address: data.address || "",
          addressDetails: data.addressDetails || "",
          phone: data.phone || "",
          mobile: data.mobile || "",
          email: data.email || "",
          website: data.website || "",
          officeHours: data.officeHours || "",
          mapLink: data.mapLink || "",
          image: data.image || "",
        });
        // Set image preview if image exists
        if (data.image) {
          setImagePreview(data.image);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Failed to fetch contact info:", errorData);
      }

      // Fetch social media links
      const socialLinksResponse = await fetch("/api/contact/social-links");
      if (socialLinksResponse.ok) {
        const socialLinksData = await socialLinksResponse.json();
        setSocialMediaLinks(socialLinksData || []);
      } else {
        console.error("Failed to fetch social media links");
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Log the data being sent for debugging
      console.log("Saving contact info:", formData);

      // Save contact information (with image if uploaded)
      let response;
      if (imageFile) {
        // Use FormData when image file is present
        const formDataToSend = new FormData();
        formDataToSend.append("address", formData.address);
        formDataToSend.append("addressDetails", formData.addressDetails);
        formDataToSend.append("phone", formData.phone);
        formDataToSend.append("mobile", formData.mobile);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("website", formData.website);
        formDataToSend.append("officeHours", formData.officeHours);
        formDataToSend.append("mapLink", formData.mapLink);
        formDataToSend.append("image", imageFile);
        
        response = await fetch("/api/contact", {
          method: "PUT",
          body: formDataToSend,
        });
      } else {
        // Use JSON when no image file
        const contactDataToSave = {
          ...formData,
          image: formData.image || null,
        };
        response = await fetch("/api/contact", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactDataToSave),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(
          errorData.error || "Failed to update contact information"
        );
      }

      const savedData = await response.json();
      console.log("Successfully saved:", savedData);

      // Save social media links
      // Get existing links from backend
      const existingLinksResponse = await fetch("/api/contact/social-links");
      const existingLinks = existingLinksResponse.ok
        ? await existingLinksResponse.json()
        : [];
      const existingLinksArray = Array.isArray(existingLinks)
        ? existingLinks
        : [];

      // Identify links to delete (existing but not in current list)
      const currentIds = socialMediaLinks
        .map((link) => link.id)
        .filter(
          (id) => id && !id.startsWith("temp-") && !String(id).match(/^\d{13}$/)
        );
      const linksToDelete = existingLinksArray.filter(
        (link: SocialMediaLink) => !currentIds.includes(link.id)
      );

      // Delete removed links
      await Promise.all(
        linksToDelete.map((link: SocialMediaLink) =>
          fetch(`/api/contact/social-links/${link.id}`, {
            method: "DELETE",
          }).catch((err) => {
            console.error(`Failed to delete link ${link.id}:`, err);
          })
        )
      );

      // Update or create links
      await Promise.all(
        socialMediaLinks.map(async (link) => {
          // Skip incomplete links
          if (!link.platform || !link.url) return;

          // Normalize URL - ensure it starts with http:// or https://
          let normalizedUrl = link.url.trim();
          if (!normalizedUrl) return; // Skip empty URLs
          
          // Validate URL format
          try {
            // If URL doesn't start with http:// or https://, add https://
            if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
              normalizedUrl = `https://${normalizedUrl}`;
            }
            
            // Basic URL validation - check if it's a valid URL format
            new URL(normalizedUrl);
          } catch (urlError) {
            console.error(`Invalid URL format for link ${link.id}:`, normalizedUrl);
            throw new Error(`Invalid URL format: ${link.url}. Please enter a valid URL.`);
          }

          // Get icon based on platform
          const platformIcons: Record<string, string> = {
            facebook: "f",
            twitter: "𝕏",
            linkedin: "in",
            instagram: "📷",
            youtube: "▶",
            tiktok: "♪",
            whatsapp: "💬",
            telegram: "✈",
            github: "⚙",
            pinterest: "P",
          };
          const icon = platformIcons[link.platform] || link.platform;

          const isNewLink =
            !link.id ||
            link.id.startsWith("temp-") ||
            String(link.id).match(/^\d{13}$/);

          try {
            if (isNewLink) {
              // Create new link
              const createResponse = await fetch("/api/contact/social-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  platform: link.platform,
                  url: normalizedUrl,
                  icon: icon,
                }),
              });
              if (!createResponse.ok) {
                const error = await createResponse
                  .json()
                  .catch(() => ({ error: "Failed to create link" }));
                throw new Error(error.error || "Failed to create social link");
              }
            } else {
              // Update existing link
              const updateResponse = await fetch(
                `/api/contact/social-links/${link.id}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    platform: link.platform,
                    url: normalizedUrl,
                    icon: icon,
                  }),
                }
              );
              if (!updateResponse.ok) {
                const error = await updateResponse
                  .json()
                  .catch(() => ({ error: "Failed to update link" }));
                throw new Error(error.error || "Failed to update social link");
              }
            }
          } catch (error) {
            console.error(`Error saving social link ${link.id}:`, error);
            throw error;
          }
        })
      );

      // Clear image file after successful save
      if (imageFile) {
        setImageFile(null);
        // Revoke preview URL
        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview);
        }
      }
      
      // Refresh data to show updated values
      await fetchContactInfo();
      
      // Show success message with details
      const savedMapLink = formData.mapLink ? "Map link saved: " + formData.mapLink.substring(0, 50) + "..." : "No map link provided";
      alert(`Contact information and social media links updated successfully!\n\n${savedMapLink}`);
      
      // Scroll to top to show the success
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error saving contact info:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update contact information";
      alert(`Error: ${errorMessage}\n\nPlease check the browser console for more details.`);
    } finally {
      setIsSaving(false);
    }
  };

  const addSocialMediaLink = () => {
    const newId = `temp-${Date.now()}`;
    setSocialMediaLinks([
      ...socialMediaLinks,
      { id: newId, platform: "", url: "" },
    ]);
  };

  const removeSocialMediaLink = (id: string) => {
    setSocialMediaLinks(socialMediaLinks.filter((link) => link.id !== id));
  };

  const updateSocialMediaLink = (
    id: string,
    field: "platform" | "url",
    value: string
  ) => {
    setSocialMediaLinks(
      socialMediaLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const getPlatformName = (platformId: string) => {
    return (
      SOCIAL_MEDIA_PLATFORMS.find((p) => p.id === platformId)?.name ||
      platformId
    );
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setIsLoadingSubmissions(true);
      const response = await fetch("/api/contact/submissions");
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Error fetching submissions:",
          response.status,
          errorData
        );
        alert(
          `Failed to load submissions: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      alert(
        "Failed to load submissions. Please check the console for details."
      );
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  const handleMarkAsRead = async (id: string, read: boolean) => {
    try {
      const response = await fetch("/api/contact/submissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read }),
      });
      if (response.ok) {
        await fetchSubmissions();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error updating submission:", response.status, errorData);
        alert(
          `Failed to update submission: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error updating submission:", error);
      alert(
        "Failed to update submission. Please check the console for details."
      );
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const response = await fetch(`/api/contact/submissions?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchSubmissions();
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error deleting submission:", response.status, errorData);
        alert(
          `Failed to delete submission: ${errorData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      alert(
        "Failed to delete submission. Please check the console for details."
      );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert(
        `Image file is too large. Please upload an image smaller than 10MB. Current size: ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB`
      );
      e.target.value = ""; // Clear the input
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      e.target.value = ""; // Clear the input
      return;
    }

    // Store the File object
    setImageFile(file);

    // Create a preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
    // Revoke the preview URL to free memory
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const unreadCount = submissions.filter((s) => !s.read).length;

  return (
    <div>
      <AdminHeader
        title="Contact Information"
        description="Manage contact details and office information"
      />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Office Information</CardTitle>
              <CardDescription>
                Primary contact details and location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="addressDetails">Address Details</Label>
                <Textarea
                  id="addressDetails"
                  rows={2}
                  value={formData.addressDetails}
                  onChange={(e) =>
                    setFormData({ ...formData, addressDetails: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Office Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="officeHours">Office Hours</Label>
                <Input
                  id="officeHours"
                  value={formData.officeHours}
                  onChange={(e) =>
                    setFormData({ ...formData, officeHours: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Social media profiles and links
                </CardDescription>
              </div>
              <Button
                onClick={addSocialMediaLink}
                size="sm"
                className="bg-[#00BFA6] hover:bg-[#00A693]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {socialMediaLinks.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No social media links added yet.
                </p>
              ) : (
                socialMediaLinks.map((link) => (
                  <div key={link.id} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Platform</Label>
                      <Select
                        value={link.platform}
                        onValueChange={(value) =>
                          updateSocialMediaLink(link.id, "platform", value)
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
                    <div className="flex-[2] space-y-2">
                      <Label className="text-xs">URL</Label>
                      <Input
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) =>
                          updateSocialMediaLink(link.id, "url", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSocialMediaLink(link.id)}
                      className="h-10 w-10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Page Image</CardTitle>
              <CardDescription>
                Upload an image to display on the contact page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactImage">Image</Label>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Upload Image</span>
                    </div>
                    <input
                      id="contactImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {(imagePreview || formData.image) && (
                    <div className="relative w-full rounded-lg overflow-hidden border">
                      <img
                        src={imagePreview || formData.image}
                        alt="Contact page preview"
                        className="w-full h-auto max-h-64 object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Upload an image to display on the contact page (max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Map Integration</CardTitle>
              <CardDescription>
                Google Maps link for location display
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mapLink">Map Link</Label>
                <Input
                  id="mapLink"
                  placeholder="https://maps.google.com/maps?q=..."
                  value={formData.mapLink}
                  onChange={(e) =>
                    setFormData({ ...formData, mapLink: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  Paste the Google Maps link here (e.g.,
                  https://maps.google.com/maps?q=Addis+Ababa)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#00BFA6] hover:bg-[#00A693] min-w-[150px]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form Submissions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Form Submissions
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  View and manage contact form submissions from the website
                </CardDescription>
              </div>
              <Button
                onClick={fetchSubmissions}
                variant="outline"
                size="sm"
                disabled={isLoadingSubmissions}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isLoadingSubmissions ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingSubmissions ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading submissions...
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No submissions yet
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Submissions List */}
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {submissions.map((submission) => (
                        <div
                          key={submission.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedSubmission?.id === submission.id
                              ? "border-[#00BFA6] bg-[#00BFA6]/5"
                              : submission.read
                              ? "border-gray-200 bg-gray-50"
                              : "border-blue-200 bg-blue-50"
                          }`}
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                {submission.read ? (
                                  <Circle className="h-4 w-4 text-gray-400 shrink-0" />
                                ) : (
                                  <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                                )}
                                <span className="font-semibold text-sm truncate">
                                  {submission.firstName} {submission.lastName}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {submission.email}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {submission.subject}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDate(submission.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Submission Details */}
                    <div className="lg:sticky lg:top-4">
                      {selectedSubmission ? (
                        <Card className="border-2">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">
                                  {selectedSubmission.firstName}{" "}
                                  {selectedSubmission.lastName}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                  {selectedSubmission.email}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleMarkAsRead(
                                      selectedSubmission.id,
                                      !selectedSubmission.read
                                    )
                                  }
                                >
                                  {selectedSubmission.read ? (
                                    <>
                                      <Circle className="h-4 w-4 mr-1" />
                                      Mark Unread
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
                                      Mark Read
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteSubmission(
                                      selectedSubmission.id
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Subject
                              </Label>
                              <p className="font-medium">
                                {selectedSubmission.subject}
                              </p>
                            </div>
                            {selectedSubmission.phone && (
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Phone
                                </Label>
                                <p>{selectedSubmission.phone}</p>
                              </div>
                            )}
                            {selectedSubmission.organization && (
                              <div>
                                <Label className="text-xs text-muted-foreground">
                                  Organization
                                </Label>
                                <p>{selectedSubmission.organization}</p>
                              </div>
                            )}
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Message
                              </Label>
                              <p className="text-sm whitespace-pre-wrap mt-1">
                                {selectedSubmission.message}
                              </p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Submitted
                              </Label>
                              <p className="text-sm">
                                {formatDate(selectedSubmission.createdAt)}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="border-2 border-dashed">
                          <CardContent className="flex items-center justify-center h-full min-h-[300px]">
                            <p className="text-muted-foreground text-center">
                              Select a submission to view details
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
