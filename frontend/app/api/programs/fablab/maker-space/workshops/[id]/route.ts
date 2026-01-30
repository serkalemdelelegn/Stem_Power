import { getStore } from "@/lib/data-store-v2"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await request.json()
    const store = getStore()
    const index = store.programs.fablab.makerSpaceWorkshops.findIndex((w) => w.id === params.id)
    if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })
    store.programs.fablab.makerSpaceWorkshops[index] = {
      ...store.programs.fablab.makerSpaceWorkshops[index],
      ...payload,
    }
    return Response.json(store.programs.fablab.makerSpaceWorkshops[index])
  } catch {
    return Response.json({ error: "Failed to update workshop" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const store = getStore()
  const index = store.programs.fablab.makerSpaceWorkshops.findIndex((w) => w.id === params.id)
  if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })
  store.programs.fablab.makerSpaceWorkshops.splice(index, 1)
  return Response.json({ success: true })
}


