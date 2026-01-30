import { getStore } from "@/lib/data-store-v2"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const slide = await req.json()
    const store = getStore()

    if (!store.home.hero || !store.home.hero.slides) {
      return Response.json({ error: "Hero not found" }, { status: 404 })
    }

    const index = store.home.hero.slides.findIndex((s: any) => s.id === params.id)
    if (index === -1) {
      return Response.json({ error: "Slide not found" }, { status: 404 })
    }

    store.home.hero.slides[index] = { ...store.home.hero.slides[index], ...slide }
    return Response.json(store.home.hero.slides[index])
  } catch (error) {
    console.error("[v0] Hero update error:", error)
    return Response.json({ error: "Failed to update slide" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const store = getStore()

    if (!store.home.hero || !store.home.hero.slides) {
      return Response.json({ error: "Hero not found" }, { status: 404 })
    }

    store.home.hero.slides = store.home.hero.slides.filter((s: any) => s.id !== params.id)

    return Response.json({ success: true })
  } catch (error) {
    console.error("[v0] Hero delete error:", error)
    return Response.json({ error: "Failed to delete slide" }, { status: 400 })
  }
}
