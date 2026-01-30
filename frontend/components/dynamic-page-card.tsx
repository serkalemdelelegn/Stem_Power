"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { DynamicPageData } from "./create-dynamic-page-modal"

interface DynamicPageCardProps {
  page: DynamicPageData & { id: string }
  onEdit: (page: DynamicPageData & { id: string }) => void
  onDelete: (id: string) => void
  subsection: string
}

export function DynamicPageCard({ page, onEdit, onDelete, subsection }: DynamicPageCardProps) {
  const firstImage = page.images?.[0]

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {firstImage && (
        <div className="h-40 bg-muted overflow-hidden">
          <img src={firstImage.url || "/placeholder.svg"} alt={page.title} className="w-full h-full object-cover" />
        </div>
      )}

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-lg">{page.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-xs">{page.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between space-y-3">
        <div className="text-xs text-muted-foreground">
          <p>
            <span className="font-medium">{page.images?.length || 0}</span> images
          </p>
          <p>
            <span className="font-medium">{page.sections?.length || 0}</span> sections
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => onEdit(page)}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm("Are you sure you want to delete this page?")) {
                onDelete(page.id)
              }
            }}
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
