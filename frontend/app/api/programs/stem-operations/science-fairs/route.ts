import { getStore, generateId } from "@/lib/data-store-v2"

export async function GET() {
  const store = getStore()
  return Response.json(store.programs.stemOperations.scienceFairs)
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const store = getStore()
    const newItem = { id: generateId(), ...data }
    store.programs.stemOperations.scienceFairs.push(newItem)
    return Response.json(newItem, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Failed to create item" }, { status: 400 })
  }
}
