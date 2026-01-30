import { getStore, generateId } from "@/lib/data-store-v2"

export async function GET() {
  const store = getStore()
  return Response.json(store.programs.fablab.makerSpaceGallery)
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const store = getStore()
    const newItem = { ...payload, id: generateId() }
    store.programs.fablab.makerSpaceGallery.push(newItem)
    return Response.json(newItem, { status: 201 })
  } catch {
    return Response.json({ error: "Failed to create gallery image" }, { status: 400 })
  }
}


