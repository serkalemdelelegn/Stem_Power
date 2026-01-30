import { getStore } from "@/lib/data-store-v2"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const store = getStore()
    const index = store.home.gallery.findIndex((item) => item.id === params.id)
    if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })

    store.home.gallery[index] = { ...store.home.gallery[index], ...data }
    return Response.json(store.home.gallery[index])
  } catch (error) {
    return Response.json({ error: "Failed to update" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const store = getStore()
  const index = store.home.gallery.findIndex((item) => item.id === params.id)
  if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })

  store.home.gallery.splice(index, 1)
  return Response.json({ success: true })
}
