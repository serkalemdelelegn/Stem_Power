import { getStore } from "@/lib/data-store-v2"

export async function GET() {
  const store = getStore()
  return Response.json(store.programs.fablab.trainingConsultancy.partnersSection)
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const store = getStore()
    store.programs.fablab.trainingConsultancy.partnersSection = {
      ...store.programs.fablab.trainingConsultancy.partnersSection,
      ...payload,
    }
    return Response.json(store.programs.fablab.trainingConsultancy.partnersSection)
  } catch {
    return Response.json({ error: "Failed to update partners section" }, { status: 400 })
  }
}

