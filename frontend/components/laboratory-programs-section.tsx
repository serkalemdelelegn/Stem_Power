"use client"

import { useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface LaboratoryProgram {
  id: string
  name: string
  code: string
  icon: string
  stemCenters?: string[]
}

interface StemCenter {
  id: string
  name: string
}

const defaultPrograms: LaboratoryProgram[] = [
  { id: "1", name: "Computing", code: "COMP", icon: "🔬", stemCenters: [] },
  { id: "2", name: "Electronics", code: "ELEX", icon: "🔬", stemCenters: [] },
  { id: "3", name: "3D Printing", code: "3DP", icon: "🔬", stemCenters: [] },
  { id: "4", name: "Mechanics", code: "MECX", icon: "🔬", stemCenters: [] },
  { id: "5", name: "Optics", code: "OPTX", icon: "🔬", stemCenters: [] },
  { id: "6", name: "Chemistry", code: "CHMX", icon: "🔬", stemCenters: [] },
  { id: "7", name: "Solar Power", code: "SOLP", icon: "🔬", stemCenters: [] },
  { id: "8", name: "Biology", code: "BIO", icon: "🔬", stemCenters: [] },
  { id: "9", name: "Aerospace", code: "AERO", icon: "🔬", stemCenters: [] },
  { id: "10", name: "Hi-Science", code: "HISC", icon: "🔬", stemCenters: [] },
  { id: "11", name: "Chemistry", code: "CHEM", icon: "🔬", stemCenters: [] },
  { id: "12", name: "Physics", code: "PHY", icon: "🔬", stemCenters: [] },
]

interface LaboratoryProgramsSectionProps {
  showAddButton?: boolean
  stemCenters?: StemCenter[]
}

export const LaboratoryProgramsSection = forwardRef<{ openAddDialog: () => void }, LaboratoryProgramsSectionProps>(
  ({ showAddButton = true, stemCenters = [] }, ref) => {
    const [programs, setPrograms] = useState<LaboratoryProgram[]>(defaultPrograms)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProgram, setEditingProgram] = useState<LaboratoryProgram | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch programs from API on component mount
    useEffect(() => {
      const fetchPrograms = async () => {
        try {
          setIsLoading(true)
          const response = await fetch("/api/programs/stem-operations/stem-centers/laboratory-programs")
          if (response.ok) {
            const data = await response.json()
            if (Array.isArray(data) && data.length > 0) {
              setPrograms(data)
            }
          }
        } catch (error) {
          console.error("Error fetching laboratory programs:", error)
        } finally {
          setIsLoading(false)
        }
      }

      fetchPrograms()
    }, [])

    const addProgram = () => {
      const newProgram: LaboratoryProgram = {
        id: Date.now().toString(),
        name: "",
        code: "",
        icon: "🔬",
        stemCenters: [],
      }
      setEditingProgram(newProgram)
      setIsDialogOpen(true)
    }

    const editProgram = (program: LaboratoryProgram) => {
      setEditingProgram({ ...program })
      setIsDialogOpen(true)
    }

    const saveProgram = async () => {
      if (!editingProgram) return

      try {
        const hasValidId = editingProgram.id && editingProgram.id.trim() !== "" && editingProgram.id !== "undefined"
        const existing = hasValidId ? programs.find((p) => p.id === editingProgram.id) : null
        const isNewProgram = !hasValidId || !existing

        const url = isNewProgram
          ? "/api/programs/stem-operations/stem-centers/laboratory-programs"
          : `/api/programs/stem-operations/stem-centers/laboratory-programs/${editingProgram.id}`
        const method = isNewProgram ? "POST" : "PUT"

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProgram),
        })

        if (!response.ok) {
          throw new Error("Failed to save laboratory program")
        }

        const savedProgram = await response.json()

        // Refresh programs from API
        const refreshResponse = await fetch("/api/programs/stem-operations/stem-centers/laboratory-programs")
        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json()
          if (Array.isArray(refreshedData) && refreshedData.length > 0) {
            setPrograms(refreshedData)
          }
        }

        setIsDialogOpen(false)
        setEditingProgram(null)
        alert("Laboratory program saved successfully!")
      } catch (error) {
        console.error("Error saving laboratory program:", error)
        alert("Failed to save laboratory program. Please try again.")
      }
    }

    const deleteProgram = async (id: string) => {
      if (!confirm("Are you sure you want to delete this laboratory program?")) {
        return
      }

      try {
        // Ensure ID is properly encoded
        const encodedId = encodeURIComponent(id)
        const response = await fetch(
          `/api/programs/stem-operations/stem-centers/laboratory-programs/${encodedId}`,
          {
            method: "DELETE",
          },
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || "Failed to delete laboratory program")
        }

        // Refresh programs from API
        const refreshResponse = await fetch("/api/programs/stem-operations/stem-centers/laboratory-programs")
        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json()
          if (Array.isArray(refreshedData)) {
            setPrograms(refreshedData.length > 0 ? refreshedData : defaultPrograms)
          }
        }

        alert("Laboratory program deleted successfully!")
      } catch (error) {
        console.error("Error deleting laboratory program:", error)
        alert("Failed to delete laboratory program. Please try again.")
      }
    }

    const toggleStemCenter = (centerId: string) => {
      if (!editingProgram) return

      if (editingProgram.stemCenters?.includes(centerId)) {
        setEditingProgram({
          ...editingProgram,
          stemCenters: editingProgram.stemCenters.filter((id) => id !== centerId),
        })
      } else {
        setEditingProgram({
          ...editingProgram,
          stemCenters: [...(editingProgram.stemCenters || []), centerId],
        })
      }
    }

    useImperativeHandle(ref, () => ({
      openAddDialog: addProgram,
    }))

    if (isLoading) {
      return (
        <div className="space-y-6">
          <p className="text-center text-gray-600">Loading laboratory programs...</p>
        </div>
      )
    }

    const programsToDisplay = programs.length > 0 ? programs : defaultPrograms

    return (
      <div className="space-y-6">
        <div className={showAddButton ? "flex justify-between items-center" : ""}>
          <div>
            <h2 className="text-2xl font-bold text-[#0D5C63]">Specialized Laboratory Programs</h2>
            <p className="text-muted-foreground mt-1">
              From virtual computing and electronics to 3D printing and specialized programs in basic sciences, chemical
              engineering, and biomechanics.
            </p>
          </div>
          {showAddButton && (
            <Button onClick={addProgram} className="bg-[#00BFA6] hover:bg-[#00A693]">
              <Plus className="mr-2 h-4 w-4" />
              Add New Laboratory Program
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {programsToDisplay.map((program) => (
            <Card
              key={program.id}
              className="group relative overflow-hidden hover:shadow-lg transition-all border-2 hover:border-[#00BFA6]"
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-[#7B92B2]/10 flex items-center justify-center">
                    <span className="text-2xl">{program.icon}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-[#0D5C63]">{program.name || "Unnamed"}</h3>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {program.code || "N/A"}
                  </Badge>
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => editProgram(program)}
                    className="bg-white hover:bg-gray-100"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => deleteProgram(program.id)}
                    className="bg-white hover:bg-gray-100"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProgram?.name || "New Laboratory Program"}</DialogTitle>
              <DialogDescription>Add or edit a laboratory program</DialogDescription>
            </DialogHeader>

            {editingProgram && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="programName">Program Name *</Label>
                  <Input
                    id="programName"
                    placeholder="e.g., Computing"
                    value={editingProgram.name}
                    onChange={(e) => setEditingProgram({ ...editingProgram, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="programCode">Program Code *</Label>
                  <Input
                    id="programCode"
                    placeholder="e.g., COMP"
                    value={editingProgram.code}
                    onChange={(e) => setEditingProgram({ ...editingProgram, code: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="programIcon">Icon (Emoji)</Label>
                  <Input
                    id="programIcon"
                    placeholder="e.g., 🔬"
                    value={editingProgram.icon}
                    onChange={(e) => setEditingProgram({ ...editingProgram, icon: e.target.value })}
                  />
                </div>

                {stemCenters.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <Label>Available STEM Centers ({editingProgram.stemCenters?.length || 0} selected)</Label>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                      {stemCenters.map((center) => (
                        <div key={center.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`center-${center.id}`}
                            checked={editingProgram.stemCenters?.includes(center.id) || false}
                            onCheckedChange={() => toggleStemCenter(center.id)}
                          />
                          <label
                            htmlFor={`center-${center.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {center.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveProgram} className="bg-[#00BFA6] hover:bg-[#00A693]">
                    <Save className="mr-2 h-4 w-4" />
                    Save Program
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    )
  },
)

LaboratoryProgramsSection.displayName = "LaboratoryProgramsSection"
