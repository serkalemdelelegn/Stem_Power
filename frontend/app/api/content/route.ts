import { type NextRequest, NextResponse } from "next/server"

interface ContentItem {
  id: string
  section: string
  type: string
  title: string
  description: string
  image?: string
  data: Record<string, any>
  createdAt: string
  updatedAt: string
}

// In-memory storage for all content types
const contentStore: Record<string, ContentItem[]> = {
  gallery: [],
  hero: [],
  events: [],
  announcements: [],
  programs: [],
}

export async function GET(request: NextRequest) {
  try {
    const section = request.nextUrl.searchParams.get("section")

    if (section) {
      const items = contentStore[section] || []
      return NextResponse.json(items, { status: 200 })
    }

    return NextResponse.json(contentStore, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, type, title, description, image, data } = body

    if (!section || !type) {
      return NextResponse.json({ error: "Section and type are required" }, { status: 400 })
    }

    const newItem: ContentItem = {
      id: Date.now().toString(),
      section,
      type,
      title,
      description,
      image,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    if (!contentStore[section]) {
      contentStore[section] = []
    }

    contentStore[section].push(newItem)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 })
  }
}
