"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Save, X, Plus, Trash2 } from "lucide-react"

interface Statistic {
  id: string
  number: string
  title: string
}

interface EditableStatisticsSectionProps {
  statistics: Statistic[]
  onSave: (statistics: Statistic[]) => void
}

export function EditableStatisticsSection({ statistics, onSave }: EditableStatisticsSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(statistics)

  const handleSave = () => {
    onSave(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData(statistics)
    setIsEditing(false)
  }

  const addStatistic = () => {
    setFormData([...formData, { id: Date.now().toString(), number: "", title: "" }])
  }

  const removeStatistic = (id: string) => {
    setFormData(formData.filter((stat) => stat.id !== id))
  }

  const updateStatistic = (id: string, field: "number" | "title", value: string) => {
    setFormData(formData.map((stat) => (stat.id === id ? { ...stat, [field]: value } : stat)))
  }

  if (isEditing) {
    return (
      <Card className="border-2 border-[#24C3BC]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Edit Statistics</span>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {formData.map((stat) => (
              <div key={stat.id} className="flex gap-3 items-end p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`number-${stat.id}`} className="text-xs">
                    Number
                  </Label>
                  <Input
                    id={`number-${stat.id}`}
                    value={stat.number}
                    onChange={(e) => updateStatistic(stat.id, "number", e.target.value)}
                    placeholder="e.g., 12"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`title-${stat.id}`} className="text-xs">
                    Title
                  </Label>
                  <Input
                    id={`title-${stat.id}`}
                    value={stat.title}
                    onChange={(e) => updateStatistic(stat.id, "title", e.target.value)}
                    placeholder="e.g., Total Products"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeStatistic(stat.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button onClick={addStatistic} variant="outline" className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Add Statistic
          </Button>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#00BFA6] hover:bg-[#00A693]">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Statistics</span>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statistics.map((stat) => (
            <div key={stat.id} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-[#24C3BC]/20">
              <div className="text-3xl font-bold text-[#367375] mb-1">{stat.number}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
