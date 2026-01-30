import { type NextRequest, NextResponse } from "next/server"

// Store reference (shared with parent route)
const galleryStore: any[] = []

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // In production, fetch from database
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/gallery`)
    const items = await response.json()
    const item = items.find((i: any) => i.id === params.id)

    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }
    return NextResponse.json(item, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery item" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    // In production, update in database
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/gallery`)
    const items = await response.json()

    const index = items.findIndex((i: any) => i.id === params.id)
    if (index === -1) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }

    const updatedItem = {
      ...items[index],
      ...body,
      id: params.id,
    }

    return NextResponse.json(updatedItem, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // In production, delete from database
    return NextResponse.json({ success: true, id: params.id }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}
