"use client";

import type React from "react";
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit, CheckCircle2 } from "lucide-react";

interface Machinery {
  id: string;
  title: string;
  description: string;
  keyFeatures: string[];
  commonApplications: string[];
  precision: string;
  power: string;
  area: string;
  image: string | File | null;
  imagePreview?: string; // For displaying preview of File objects
}

interface EditableMachinerySectionProps {
  machineries: Machinery[];
  onSave: (machineries: Machinery[]) => void;
}

export function EditableMachinerySection({
  machineries,
  onSave,
}: EditableMachinerySectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMachinery, setEditingMachinery] = useState<Machinery | null>(
    null
  );
  // Local state for comma-separated applications input to allow typing commas
  const [applicationsInput, setApplicationsInput] = useState<string>("");

  const addMachinery = () => {
    const newMachinery: Machinery = {
      id: Date.now().toString(),
      title: "",
      description: "",
      keyFeatures: [],
      commonApplications: [],
      precision: "",
      power: "",
      area: "",
      image: "",
    };
    setEditingMachinery(newMachinery);
    setApplicationsInput("");
    setIsDialogOpen(true);
  };

  const editMachinery = (machinery: Machinery) => {
    const machineryData = {
      ...machinery,
      keyFeatures: Array.isArray(machinery.keyFeatures)
        ? machinery.keyFeatures
        : [],
      commonApplications: Array.isArray(machinery.commonApplications)
        ? machinery.commonApplications
        : [],
    };
    setEditingMachinery(machineryData);
    // Initialize applications input string from array (comma-separated)
    setApplicationsInput(machineryData.commonApplications.join(", "));
    setIsDialogOpen(true);
  };

  const saveMachinery = () => {
    if (!editingMachinery) return;

    // 1. Filter out empty strings from keyFeatures here (moved from onChange)
    // 2. Convert applications input string to array
    const updatedMachinery = {
      ...editingMachinery,
      keyFeatures: editingMachinery.keyFeatures
        .map((f) => f.trim())
        .filter((f) => f !== ""),
      commonApplications: applicationsInput
        .split(",")
        .map((app) => app.trim())
        .filter(Boolean),
    };

    const existing = machineries.find((m) => m.id === updatedMachinery.id);
    if (existing) {
      onSave(
        machineries.map((m) =>
          m.id === updatedMachinery.id ? updatedMachinery : m
        )
      );
    } else {
      onSave([...machineries, updatedMachinery]);
    }
    // Clean up preview URL if it exists
    if (updatedMachinery.imagePreview) {
      URL.revokeObjectURL(updatedMachinery.imagePreview);
    }
    setIsDialogOpen(false);
    setEditingMachinery(null);
    setApplicationsInput("");
  };

  const deleteMachinery = (id: string) => {
    if (confirm("Are you sure you want to delete this machinery?")) {
      onSave(machineries.filter((m) => m.id !== id));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingMachinery) {
      // Clean up old preview URL if it exists
      if (editingMachinery.imagePreview) {
        URL.revokeObjectURL(editingMachinery.imagePreview);
      }
      // Store the File object and create a preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setEditingMachinery({
        ...editingMachinery,
        image: file, // Store File object instead of base64
        imagePreview: previewUrl, // For preview display
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>State of Machineries</CardTitle>
              <CardDescription>
                Manage available machinery and equipment
              </CardDescription>
            </div>
            <Button
              onClick={addMachinery}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Machinery
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {machineries.map((machinery) => (
              <Card
                key={machinery.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-muted overflow-hidden">
                  {machinery.image ? (
                    <img
                      src={
                        typeof machinery.image === "string"
                          ? machinery.image
                          : machinery.imagePreview || "/placeholder.svg"
                      }
                      alt={machinery.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-[#367375]">
                      {machinery.title}
                    </h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editMachinery(machinery)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMachinery(machinery.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {machinery.description}
                  </p>

                  {/* Specifications */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {machinery.precision && (
                      <Badge
                        variant="outline"
                        className="border-[#24C3BC] text-[#24C3BC]"
                      >
                        {machinery.precision}
                      </Badge>
                    )}
                    {machinery.power && (
                      <Badge
                        variant="outline"
                        className="border-[#24C3BC] text-[#24C3BC]"
                      >
                        {machinery.power}
                      </Badge>
                    )}
                    {machinery.area && (
                      <Badge
                        variant="outline"
                        className="border-[#24C3BC] text-[#24C3BC]"
                      >
                        {machinery.area}
                      </Badge>
                    )}
                  </div>

                  {/* Key Features */}
                  {machinery.keyFeatures &&
                    Array.isArray(machinery.keyFeatures) &&
                    machinery.keyFeatures.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-[#00BFA6]" />
                          Key Capabilities
                        </h4>
                        <ul className="space-y-1">
                          {machinery.keyFeatures
                            .slice(0, 3)
                            .map((feature, idx) => (
                              <li
                                key={idx}
                                className="text-xs flex items-start gap-2"
                              >
                                <CheckCircle2 className="h-3 w-3 text-[#00BFA6] mt-0.5 shrink-0" />
                                <span className="line-clamp-1">{feature}</span>
                              </li>
                            ))}
                          {machinery.keyFeatures.length > 3 && (
                            <li className="text-xs text-muted-foreground pl-5">
                              + {machinery.keyFeatures.length - 3} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Machinery Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMachinery?.title || "New Machinery"}
            </DialogTitle>
            <DialogDescription>
              Add or edit machinery information
            </DialogDescription>
          </DialogHeader>
          {editingMachinery && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="machineryTitle">Machinery Title</Label>
                <Input
                  id="machineryTitle"
                  placeholder="e.g., 3D Printers"
                  value={editingMachinery.title}
                  onChange={(e) =>
                    setEditingMachinery({
                      ...editingMachinery,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="machineryDescription">Description</Label>
                <Textarea
                  id="machineryDescription"
                  rows={3}
                  placeholder="Detailed description of the machinery..."
                  value={editingMachinery.description}
                  onChange={(e) =>
                    setEditingMachinery({
                      ...editingMachinery,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="precision">Precision</Label>
                  <Input
                    id="precision"
                    placeholder="e.g., ±0.1mm"
                    value={editingMachinery.precision}
                    onChange={(e) =>
                      setEditingMachinery({
                        ...editingMachinery,
                        precision: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="power">Power</Label>
                  <Input
                    id="power"
                    placeholder="e.g., 500W"
                    value={editingMachinery.power}
                    onChange={(e) =>
                      setEditingMachinery({
                        ...editingMachinery,
                        power: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area</Label>
                  <Input
                    id="area"
                    placeholder="e.g., 2m x 3m"
                    value={editingMachinery.area}
                    onChange={(e) =>
                      setEditingMachinery({
                        ...editingMachinery,
                        area: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyFeatures">Key Features (one per line)</Label>
                <Textarea
                  id="keyFeatures"
                  rows={4}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  value={(editingMachinery.keyFeatures || []).join("\n")}
                  onChange={(e) =>
                    setEditingMachinery({
                      ...editingMachinery,
                      // FIXED: Removed .filter(Boolean) to allow typing newlines
                      keyFeatures: e.target.value.split("\n"),
                    })
                  }
                  // We still stop propagation to prevent closing dialogs on Enter,
                  // but we let the default textarea behavior happen
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.stopPropagation();
                    }
                  }}
                />
                <p className="text-[0.8rem] text-muted-foreground">
                  Press Enter to add a new line. Empty lines will be removed on
                  save.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applications">
                  Common Applications (comma-separated)
                </Label>
                <Input
                  id="applications"
                  type="text"
                  placeholder="Application 1, Application 2, Application 3"
                  value={applicationsInput}
                  onChange={(e) => setApplicationsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="machineryImage">Machinery Image</Label>
                <div className="space-y-3">
                  <Input
                    id="machineryImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {(editingMachinery.image ||
                    editingMachinery.imagePreview) && (
                    <div className="h-48 rounded-lg overflow-hidden border">
                      <img
                        src={
                          editingMachinery.imagePreview ||
                          (typeof editingMachinery.image === "string"
                            ? editingMachinery.image
                            : "/placeholder.svg")
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveMachinery}
                  className="bg-[#00BFA6] hover:bg-[#00A693]"
                >
                  Save Machinery
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
