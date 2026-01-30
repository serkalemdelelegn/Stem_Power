"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/ui/admin-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Plus, Trash2, Video } from "lucide-react"

interface VideoContent {
  id: string
  title: string
  description: string
  duration: string
  category: string
  url: string
}

export default function StemTvPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "STEM TV",
    subtitle: "Educational video content",
    description: "High-quality educational videos for distance learning and STEM education.",
  })

  const [videos, setVideos] = useState<VideoContent[]>([
    {
      id: "1",
      title: "Introduction to Physics",
      description: "Basic physics concepts",
      duration: "15:30",
      category: "Physics",
      url: "https://youtube.com/...",
    },
  ])

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("STEM TV updated successfully!")
  }

  const addVideo = () => {
    setVideos([
      ...videos,
      { id: Date.now().toString(), title: "", description: "", duration: "", category: "", url: "" },
    ])
  }

  const updateVideo = (id: string, field: keyof VideoContent, value: string) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
  }

  const deleteVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id))
  }

  return (
    <div>
      <AdminHeader title="STEM TV" description="Manage educational video content" />
      <div className="p-6 max-w-4xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Information</CardTitle>
              <CardDescription>Main information about STEM TV</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Video Content</CardTitle>
                  <CardDescription>Manage educational videos</CardDescription>
                </div>
                <Button onClick={addVideo} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Video
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-[#00BFA6]" />
                        <Input
                          placeholder="Video title"
                          value={video.title}
                          onChange={(e) => updateVideo(video.id, "title", e.target.value)}
                        />
                      </div>
                      <div className="grid gap-3 md:grid-cols-3">
                        <Input
                          placeholder="Category"
                          value={video.category}
                          onChange={(e) => updateVideo(video.id, "category", e.target.value)}
                        />
                        <Input
                          placeholder="Duration (mm:ss)"
                          value={video.duration}
                          onChange={(e) => updateVideo(video.id, "duration", e.target.value)}
                        />
                        <Input
                          placeholder="Video URL"
                          value={video.url}
                          onChange={(e) => updateVideo(video.id, "url", e.target.value)}
                        />
                      </div>
                      <Textarea
                        placeholder="Description"
                        rows={2}
                        value={video.description}
                        onChange={(e) => updateVideo(video.id, "description", e.target.value)}
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteVideo(video.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-[#00BFA6] hover:bg-[#00A693]">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
