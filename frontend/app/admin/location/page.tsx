"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/ui/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2, Save, MapPin, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface STEMCenter {
  id: string;
  name: string;
  host: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  mapLink?: string;
}

export default function LocationManagementPage() {
  const { toast } = useToast();
  const [centers, setCenters] = useState<STEMCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCenter, setEditingCenter] = useState<STEMCenter | null>(null);
  const [isAddingCenter, setIsAddingCenter] = useState(false);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/location");
      if (response.ok) {
        const data = await response.json();
        setCenters(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "Error",
          description: errorData.error || "Failed to load centers",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
      toast({
        title: "Error",
        description: "Failed to load centers. Please check the console.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCenter = async (center: STEMCenter) => {
    try {
      if (editingCenter && editingCenter.id) {
        // Update existing center
        const response = await fetch(`/api/location/${center.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(center),
        });

        if (response.ok) {
          toast({
            title: "Center Updated",
            description: "STEM center information has been updated.",
          });
          await fetchCenters();
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to update center");
        }
      } else {
        // Create new center
        const response = await fetch("/api/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(center),
        });

        if (response.ok) {
          toast({
            title: "Center Added",
            description: "New STEM center has been added.",
          });
          await fetchCenters();
        } else {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to add center");
        }
      }
      setEditingCenter(null);
      setIsAddingCenter(false);
    } catch (error) {
      console.error("Error saving center:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save center",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCenter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this STEM center?")) return;

    try {
      const response = await fetch(`/api/location/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Center Deleted",
          description: "STEM center has been removed.",
        });
        await fetchCenters();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete center");
      }
    } catch (error) {
      console.error("Error deleting center:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete center",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <AdminHeader
          title="STEM Center Locations"
          description="Manage all STEM center branches and their information"
        />
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFA6] mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading centers...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader
        title="STEM Center Locations"
        description="Manage all STEM center branches and their information"
      />
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>STEM Centers</CardTitle>
                <CardDescription>
                  View and manage all STEM center branches
                </CardDescription>
              </div>
              <Button
                onClick={() => setIsAddingCenter(true)}
                className="bg-[#00BFA6] hover:bg-[#00A693]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Center
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {centers.map((center) => (
                <div
                  key={center.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-sm line-clamp-2">
                        {center.name}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        <span className="font-medium">HOST:</span> {center.host}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">CITY:</span> {center.city}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">COUNTRY:</span>{" "}
                        {center.country}
                      </p>
                      <p className="text-xs text-gray-600">
                        <span className="font-medium">COORDINATES:</span>{" "}
                        {center.latitude?.toFixed(4)},{" "}
                        {center.longitude?.toFixed(4)}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => setEditingCenter(center)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDeleteCenter(center.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                    {center.mapLink && (
                      <a
                        href={center.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-xs text-[#00BFA6] hover:text-[#00A693] font-medium"
                      >
                        <MapPin className="h-3 w-3" />
                        View on Map
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Center Dialog */}
        <Dialog
          open={isAddingCenter || editingCenter !== null}
          onOpenChange={() => {
            setIsAddingCenter(false);
            setEditingCenter(null);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCenter ? "Edit STEM Center" : "Add STEM Center"}
              </DialogTitle>
              <DialogDescription>
                Manage STEM center information and location
              </DialogDescription>
            </DialogHeader>
            <STEMCenterForm
              center={
                editingCenter || {
                  id: "",
                  name: "",
                  host: "",
                  city: "",
                  country: "",
                  latitude: 0,
                  longitude: 0,
                  mapLink: "",
                }
              }
              onSave={handleSaveCenter}
              onCancel={() => {
                setIsAddingCenter(false);
                setEditingCenter(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Helper function to extract coordinates from Google Maps links
function extractCoordinatesFromMapLink(mapLink: string): {
  latitude: number | null;
  longitude: number | null;
} {
  if (!mapLink || !mapLink.trim()) {
    return { latitude: null, longitude: null };
  }

  try {
    // Handle different Google Maps URL formats
    let url: URL;
    try {
      url = new URL(mapLink);
    } catch {
      // If it's not a valid URL, try to extract coordinates from the string directly
      // Pattern: @lat,lng or /@lat,lng
      const coordMatch = mapLink.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { latitude: lat, longitude: lng };
        }
      }
      return { latitude: null, longitude: null };
    }

    // Format 1: https://maps.google.com/maps?q=lat,lng
    const q = url.searchParams.get("q");
    if (q) {
      const coords = q.split(",");
      if (coords.length === 2) {
        const lat = parseFloat(coords[0].trim());
        const lng = parseFloat(coords[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
          return { latitude: lat, longitude: lng };
        }
      }
    }

    // Format 2: https://www.google.com/maps/@lat,lng,zoom
    const pathMatch = url.pathname.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (pathMatch) {
      const lat = parseFloat(pathMatch[1]);
      const lng = parseFloat(pathMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { latitude: lat, longitude: lng };
      }
    }

    // Format 3: https://maps.app.goo.gl/... (short URL - can't extract directly)
    // Format 4: Try to find coordinates anywhere in the URL string
    const fullUrl = mapLink;
    const anyCoordMatch = fullUrl.match(/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (anyCoordMatch) {
      const lat = parseFloat(anyCoordMatch[1]);
      const lng = parseFloat(anyCoordMatch[2]);
      // Validate that these look like coordinates (not just any two numbers)
      if (
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      ) {
        return { latitude: lat, longitude: lng };
      }
    }
  } catch (error) {
    console.error("Error extracting coordinates:", error);
  }

  return { latitude: null, longitude: null };
}

function STEMCenterForm({
  center,
  onSave,
  onCancel,
}: {
  center: STEMCenter;
  onSave: (center: STEMCenter) => void;
  onCancel: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(center);

  const handleExtractCoordinates = () => {
    if (!formData.mapLink || !formData.mapLink.trim()) {
      toast({
        title: "No map link",
        description: "Please enter a Google Maps link first",
        variant: "destructive",
      });
      return;
    }

    const coords = extractCoordinatesFromMapLink(formData.mapLink);
    if (coords.latitude !== null && coords.longitude !== null) {
      setFormData({
        ...formData,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      toast({
        title: "Coordinates extracted",
        description: `Latitude: ${coords.latitude.toFixed(
          6
        )}, Longitude: ${coords.longitude.toFixed(6)}`,
      });
    } else {
      toast({
        title: "Could not extract coordinates",
        description:
          "The map link format is not supported. Please enter coordinates manually.",
        variant: "destructive",
      });
    }
  };

  // Auto-extract coordinates when map link changes (if coordinates are 0,0 or empty)
  useEffect(() => {
    if (
      formData.mapLink &&
      formData.mapLink.trim() &&
      (formData.latitude === 0 || formData.longitude === 0)
    ) {
      const coords = extractCoordinatesFromMapLink(formData.mapLink);
      if (coords.latitude !== null && coords.longitude !== null) {
        setFormData((prev) => ({
          ...prev,
          latitude: coords.latitude!,
          longitude: coords.longitude!,
        }));
      }
    }
  }, [formData.mapLink]);

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {/* Center Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Center Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Université d'Abomey-Calavi STEM Center"
        />
      </div>

      {/* Host */}
      <div className="space-y-2">
        <Label htmlFor="host">Host Institution</Label>
        <Input
          id="host"
          value={formData.host}
          onChange={(e) => setFormData({ ...formData, host: e.target.value })}
          placeholder="e.g., Université d'Abomey-Calavi"
        />
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          placeholder="e.g., Dangbo"
        />
      </div>

      {/* Country */}
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={formData.country}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
          placeholder="e.g., Benin"
        />
      </div>

      {/* Latitude */}
      <div className="space-y-2">
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          id="latitude"
          type="number"
          step="any"
          value={formData.latitude}
          onChange={(e) =>
            setFormData({
              ...formData,
              latitude: parseFloat(e.target.value) || 0,
            })
          }
          placeholder="e.g., 9.032"
          required
        />
      </div>

      {/* Longitude */}
      <div className="space-y-2">
        <Label htmlFor="longitude">Longitude</Label>
        <Input
          id="longitude"
          type="number"
          step="any"
          value={formData.longitude}
          onChange={(e) =>
            setFormData({
              ...formData,
              longitude: parseFloat(e.target.value) || 0,
            })
          }
          placeholder="e.g., 38.7469"
          required
        />
      </div>

      {/* Map Link */}
      <div className="space-y-2">
        <Label htmlFor="mapLink" className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Google Maps Link (Optional)
        </Label>
        <div className="flex gap-2">
          <Input
            id="mapLink"
            value={formData.mapLink || ""}
            onChange={(e) =>
              setFormData({ ...formData, mapLink: e.target.value })
            }
            placeholder="https://maps.google.com/maps?q=..."
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleExtractCoordinates}
            className="whitespace-nowrap"
            title="Extract coordinates from map link"
          >
            <Download className="h-4 w-4 mr-1" />
            Extract
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Paste a Google Maps link and click "Extract" to automatically fill
          coordinates, or enter them manually
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onSave(formData)}
          className="bg-[#00BFA6] hover:bg-[#00A693]"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Center
        </Button>
      </DialogFooter>
    </div>
  );
}
