"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Save, X } from "lucide-react";

interface HeroData {
  badge: string;
  title: string;
  description: string;
}

interface EditableHeroSectionProps {
  data: HeroData;
  onSave: (data: HeroData) => void;
}

export function EditableHeroSection({
  data,
  onSave,
}: EditableHeroSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(data);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(data);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-[#24C3BC]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Edit Hero Section</span>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="badge">Badge Text</Label>
            <Input
              id="badge"
              value={formData.badge}
              onChange={(e) =>
                setFormData({ ...formData, badge: e.target.value })
              }
              placeholder="e.g., Product Management"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Products"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter section description"
              rows={3}
              onKeyDown={(e) => {
                // Allow Enter key to create new lines in textarea
                if (e.key === "Enter") {
                  e.stopPropagation();
                }
              }}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#00BFA6] hover:bg-[#00A693]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-linear-to-r from-[#367375] to-[#24C3BC] text-white px-6 py-8 rounded-lg relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 text-white hover:bg-white/20"
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>

      <div className="max-w-6xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge className="bg-white/20 text-white border-white/30 mb-3">
              {formData.badge}
            </Badge>
            <h1 className="text-4xl font-bold mb-2">{formData.title}</h1>
            <p className="text-white/90">{formData.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
