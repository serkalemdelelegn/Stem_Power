import { getStore } from "@/lib/data-store-v2"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const data = await req.json()
    const store = getStore()
    // Handle both Next.js 14 and 15 (params might be a Promise in Next.js 15)
    const resolvedParams = params instanceof Promise ? await params : params
    const index = store.about.stemCenters.findIndex((item) => item.id === resolvedParams.id)
    if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })

    store.about.stemCenters[index] = { ...store.about.stemCenters[index], ...data, id: resolvedParams.id }
    return Response.json(store.about.stemCenters[index])
  } catch (error) {
    console.error("Error updating stem center:", error)
    return Response.json({ error: "Failed to update" }, { status: 400 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const store = getStore()
    // Handle both Next.js 14 and 15 (params might be a Promise in Next.js 15)
    const resolvedParams = params instanceof Promise ? await params : params
    const index = store.about.stemCenters.findIndex((item) => item.id === resolvedParams.id)
    if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })

    store.about.stemCenters.splice(index, 1)
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting stem center:", error)
    return Response.json({ error: "Failed to delete" }, { status: 400 })
  }
}
