"use client"

import { useState, forwardRef, useImperativeHandle } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface LaboratoryProgram {
  id: string
  name: string
  code: string
  icon: string
}

const defaultPrograms: LaboratoryProgram[] = [
  { id: "1", name: "Computing", code: "COMP", icon: "🔬" },
  { id: "2", name: "Electronics", code: "ELEX", icon: "🔬" },
  { id: "3", name: "3D Printing", code: "3DP", icon: "🔬" },
  { id: "4", name: "Mechanics", code: "MECX", icon: "🔬" },
  { id: "5", name: "Optics", code: "OPTX", icon: "🔬" },
  { id: "6", name: "Chemistry", code: "CHMX", icon: "🔬" },
  { id: "7", name: "Solar Power", code: "SOLP", icon: "🔬" },
  { id: "8", name: "Biology", code: "BIO", icon: "🔬" },
  { id: "9", name: "Aerospace", code: "AERO", icon: "🔬" },
  { id: "10", name: "Hi-Science", code: "HISC", icon: "🔬" },
  { id: "11", name: "Chemistry", code: "CHEM", icon: "🔬" },
  { id: "12", name: "Physics", code: "PHY", icon: "🔬" },
]

interface LaboratoryProgramsSectionProps {
  showAddButton?: boolean
}

export const LaboratoryProgramsSection = forwardRef<{ openAddDialog: () => void }, LaboratoryProgramsSectionProps>(
  ({ showAddButton = true }, ref) => {
    const [programs, setPrograms] = useState<LaboratoryProgram[]>(defaultPrograms)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingProgram, setEditingProgram] = useState<LaboratoryProgram | null>(null)

    const addProgram = () => {
      const newProgram: LaboratoryProgram = {
        id: Date.now().toString(),
        name: "",
        code: "",
        icon: "🔬",
      }
      setEditingProgram(newProgram)
      setIsDialogOpen(true)
    }

    const editProgram = (program: LaboratoryProgram) => {
      setEditingProgram({ ...program })
      setIsDialogOpen(true)
    }

    const saveProgram = () => {
      if (!editingProgram) return

      const existing = programs.find((p) => p.id === editingProgram.id)
      if (existing) {
        setPrograms(programs.map((p) => (p.id === editingProgram.id ? editingProgram : p)))
      } else {
        setPrograms([...programs, editingProgram])
      }

      setIsDialogOpen(false)
      setEditingProgram(null)
    }

    const deleteProgram = (id: string) => {
      if (confirm("Are you sure you want to delete this laboratory program?")) {
        setPrograms(programs.filter((p) => p.id !== id))
      }
    }

    useImperativeHandle(ref, () => ({
      openAddDialog: addProgram,
    }))

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
          {programs.map((program) => (
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
          <DialogContent>
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
