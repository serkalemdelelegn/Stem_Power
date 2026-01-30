import { getStore, generateId } from "@/lib/data-store-v2"

interface HeroSaveData {
  section: "maker-space" | "training-consultancy" | "services" | "products"
  badge: string
  title: string
  description: string
}

export async function POST(req: Request) {
  try {
    const data: HeroSaveData = await req.json()
    const store = getStore()

    if (!store.programs.fablab.heroSections) {
      store.programs.fablab.heroSections = {}
    }

    const sectionKey = data.section.replace("-", "")
    store.programs.fablab.heroSections[sectionKey] = {
      id: generateId(),
      ...data,
      savedAt: new Date().toISOString(),
    }

    console.log("[v0] Saved hero section:", sectionKey, store.programs.fablab.heroSections[sectionKey])

    return Response.json({
      success: true,
      data: store.programs.fablab.heroSections[sectionKey],
    })
  } catch (error) {
    console.error("[v0] Error saving hero:", error)
    return Response.json({ error: "Failed to save hero section" }, { status: 400 })
  }
}

export async function GET() {
  const store = getStore()
  return Response.json(store.programs.fablab.heroSections || {})
}
