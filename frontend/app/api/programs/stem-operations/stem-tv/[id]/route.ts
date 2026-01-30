import { getStore } from "@/lib/data-store-v2"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const store = getStore()
    const index = store.programs.stemOperations.stemTv.findIndex((item) => item.id === params.id)
    if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })

    store.programs.stemOperations.stemTv[index] = { ...store.programs.stemOperations.stemTv[index], ...data }
    return Response.json(store.programs.stemOperations.stemTv[index])
  } catch (error) {
    return Response.json({ error: "Failed to update" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const store = getStore()
  const index = store.programs.stemOperations.stemTv.findIndex((item) => item.id === params.id)
  if (index === -1) return Response.json({ error: "Not found" }, { status: 404 })

  store.programs.stemOperations.stemTv.splice(index, 1)
  return Response.json({ success: true })
}
