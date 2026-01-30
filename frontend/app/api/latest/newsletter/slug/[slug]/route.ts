import { listNewsletters, saveNewsletters, slugifyNewsletter } from "@/lib/newsletter-store"

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const items = await listNewsletters()
  const slug = params.slug
  const item = items.find((entry) => {
    if (entry.slug === slug) return true
    if (entry.title && slugifyNewsletter(entry.title) === slug) return true
    if (entry.id === slug) return true
    return false
  })

  if (!item) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  if (!item.slug || item.slug.trim() === "") {
    item.slug = slugifyNewsletter(item.title || item.id || "newsletter")
    await saveNewsletters(items)
  }

  return Response.json(item)
}
