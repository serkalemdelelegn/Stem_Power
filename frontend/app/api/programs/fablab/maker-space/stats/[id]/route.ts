import { getStore } from "@/lib/data-store-v2"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await request.json()
    const store = getStore()
    const index = store.programs.fablab.makerSpaceStats.findIndex((s) => s.id === params.id)
    if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })
    store.programs.fablab.makerSpaceStats[index] = { ...store.programs.fablab.makerSpaceStats[index], ...payload }
    return Response.json(store.programs.fablab.makerSpaceStats[index])
  } catch {
    return Response.json({ error: "Failed to update stat" }, { status: 400 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const store = getStore()
  const index = store.programs.fablab.makerSpaceStats.findIndex((s) => s.id === params.id)
  if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })
  store.programs.fablab.makerSpaceStats.splice(index, 1)
  return Response.json({ success: true })
}


