import { getStore } from "@/lib/data-store-v2"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const store = getStore()
    const index = store.home.impact.findIndex((item) => item.id === params.id)
    if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })

    store.home.impact[index] = { ...store.home.impact[index], ...data }
    return Response.json(store.home.impact[index])
  } catch (error) {
    return Response.json({ error: "Failed to update" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const store = getStore()
  const index = store.home.impact.findIndex((item) => item.id === params.id)
  if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })

  store.home.impact.splice(index, 1)
  return Response.json({ success: true })
}
