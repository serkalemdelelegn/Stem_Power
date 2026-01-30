import { getStore, generateId } from "@/lib/data-store-v2"

export async function GET() {
  const store = getStore()
  return Response.json(store.programs.stemOperations.stemCentersLaboratoryPrograms || [])
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const store = getStore()
    if (!store.programs.stemOperations.stemCentersLaboratoryPrograms) {
      store.programs.stemOperations.stemCentersLaboratoryPrograms = []
    }
    const newItem = { id: generateId(), ...data }
    store.programs.stemOperations.stemCentersLaboratoryPrograms.push(newItem)
    return Response.json(newItem, { status: 201 })
  } catch (error) {
    return Response.json({ error: "Failed to create laboratory program" }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json()
    const store = getStore()
    if (!Array.isArray(data)) {
      return Response.json({ error: "Expected array of laboratory programs" }, { status: 400 })
    }
    // Replace all programs
    if (!store.programs.stemOperations.stemCentersLaboratoryPrograms) {
      store.programs.stemOperations.stemCentersLaboratoryPrograms = []
    }
    store.programs.stemOperations.stemCentersLaboratoryPrograms = data.map((program) => ({
      id: program.id || generateId(),
      ...program,
    }))
    return Response.json(store.programs.stemOperations.stemCentersLaboratoryPrograms)
  } catch (error) {
    return Response.json({ error: "Failed to update laboratory programs" }, { status: 400 })
  }
}

