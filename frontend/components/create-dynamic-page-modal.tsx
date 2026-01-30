"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface DynamicPageData {
  id?: string
  title: string
  description: string
  images: Array<{ id: string; url: string; caption: string }>
  sections: Array<{
    id: string
    type: "text" | "list" | "gallery"
    title: string
    content?: string
    items?: string[]
  }>
}

interface CreateDynamicPageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: DynamicPageData) => Promise<void>
  subsection: string
}

export function CreateDynamicPageModal({ open, onOpenChange, onSave, subsection }: CreateDynamicPageModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState<DynamicPageData>({
    title: "",
    description: "",
    images: [],
    sections: [],
  })

  const [newListItem, setNewListItem] = useState("")
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({
          ...formData,
          images: [
            ...formData.images,
            {
              id: Date.now().toString(),
              url: reader.result as string,
              caption: "",
            },
          ],
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (id: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter((img) => img.id !== id),
    })
  }

  const handleUpdateImageCaption = (id: string, caption: string) => {
    setFormData({
      ...formData,
      images: formData.images.map((img) => (img.id === id ? { ...img, caption } : img)),
    })
  }

  const handleAddSection = (type: "text" | "list" | "gallery") => {
    const newSection = {
      id: Date.now().toString(),
      type,
      title: "",
      content: type === "text" ? "" : undefined,
      items: type === "list" ? [] : undefined,
    }
    setFormData({
      ...formData,
      sections: [...formData.sections, newSection],
    })
    setEditingSectionId(newSection.id)
  }

  const handleRemoveSection = (id: string) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((s) => s.id !== id),
    })
  }

  const handleUpdateSection = (id: string, updates: any) => {
    setFormData({
      ...formData,
      sections: formData.sections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })
  }

  const handleAddListItem = (sectionId: string) => {
    if (!newListItem.trim()) return
    handleUpdateSection(sectionId, {
      items: [...(formData.sections.find((s) => s.id === sectionId)?.items || []), newListItem],
    })
    setNewListItem("")
  }

  const handleRemoveListItem = (sectionId: string, index: number) => {
    const section = formData.sections.find((s) => s.id === sectionId)
    if (section?.items) {
      handleUpdateSection(sectionId, {
        items: section.items.filter((_, i) => i !== index),
      })
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in title and description")
      return
    }

    setIsSaving(true)
    try {
      await onSave(formData)
      setFormData({
        title: "",
        description: "",
        images: [],
        sections: [],
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error saving page:", error)
      alert("Failed to save page")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Dynamic Page - {subsection}</DialogTitle>
          <DialogDescription>Add title, description, images, and content sections</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Title & Description */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Page Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Advanced 3D Printing Techniques"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter description (supports multiple lines)"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>Images</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("image-input")?.click()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
              <input id="image-input" type="file" accept="image/*" onChange={handleAddImage} className="hidden" />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {formData.images.map((image) => (
                <Card key={image.id}>
                  <CardContent className="p-3 space-y-2">
                    <div className="h-32 bg-muted rounded overflow-hidden">
                      <img src={image.url || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <Input
                      placeholder="Image caption"
                      value={image.caption}
                      onChange={(e) => handleUpdateImageCaption(image.id, e.target.value)}
                      className="text-xs"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveImage(image.id)}
                      className="w-full text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-2" />
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>Content Sections</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleAddSection("text")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Text
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleAddSection("list")}>
                  <Plus className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {formData.sections.map((section) => (
                <Card key={section.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Input
                          placeholder="Section title"
                          value={section.title}
                          onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                          className="font-semibold"
                        />
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveSection(section.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    {section.type === "text" && (
                      <Textarea
                        placeholder="Enter text content (supports multiple lines)"
                        rows={3}
                        value={section.content || ""}
                        onChange={(e) => handleUpdateSection(section.id, { content: e.target.value })}
                      />
                    )}

                    {section.type === "list" && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add list item"
                            value={newListItem}
                            onChange={(e) => setNewListItem(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleAddListItem(section.id)
                              }
                            }}
                          />
                          <Button type="button" size="sm" onClick={() => handleAddListItem(section.id)}>
                            Add
                          </Button>
                        </div>

                        <div className="space-y-1">
                          {section.items?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                              <span>• {item}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveListItem(section.id, index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-[#00BFA6] hover:bg-[#00A693]">
              {isSaving ? "Saving..." : "Create Page"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
