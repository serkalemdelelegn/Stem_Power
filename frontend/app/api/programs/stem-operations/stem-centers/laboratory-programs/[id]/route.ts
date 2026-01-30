import { getStore } from "@/lib/data-store-v2"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await req.json()
    const store = getStore()

    const programs =
      store.programs.stemOperations.stemCentersLaboratoryPrograms

    if (!programs) {
      return Response.json({ error: "Not found" }, { status: 404 })
    }

    const index = programs.findIndex((item) => item.id === id)
    if (index === -1) {
      return Response.json({ error: "Not found" }, { status: 404 })
    }

    programs[index] = {
      ...programs[index],
      ...data,
    }

    return Response.json(programs[index])
  } catch {
    return Response.json({ error: "Failed to update" }, { status: 400 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const store = getStore()

    const programs =
      store.programs.stemOperations.stemCentersLaboratoryPrograms

    if (!programs) {
      return Response.json(
        { error: "Laboratory programs not found" },
        { status: 404 }
      )
    }

    const decodedId = decodeURIComponent(id)
    const index = programs.findIndex(
      (item) => item.id === decodedId || item.id === id
    )

    if (index === -1) {
      return Response.json(
        { error: `Laboratory program with ID "${id}" not found` },
        { status: 404 }
      )
    }

    programs.splice(index, 1)
    return Response.json({
      success: true,
      message: "Laboratory program deleted successfully",
    })
  } catch {
    return Response.json(
      { error: "Failed to delete laboratory program" },
      { status: 400 }
    )
  }
}
