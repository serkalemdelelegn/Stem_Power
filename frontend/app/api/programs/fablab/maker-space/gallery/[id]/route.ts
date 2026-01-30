import { getStore } from "@/lib/data-store-v2"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await request.json()
    const store = getStore()
    const index = store.programs.fablab.makerSpaceGallery.findIndex((i) => i.id === params.id)
    if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })
    store.programs.fablab.makerSpaceGallery[index] = {
      ...store.programs.fablab.makerSpaceGallery[index],
      ...payload,
    }
    return Response.json(store.programs.fablab.makerSpaceGallery[index])
  } catch {
    return Response.json({ error: "Failed to update gallery image" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const store = getStore()
  const index = store.programs.fablab.makerSpaceGallery.findIndex((i) => i.id === params.id)
  if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })
  store.programs.fablab.makerSpaceGallery.splice(index, 1)
  return Response.json({ success: true })
}


