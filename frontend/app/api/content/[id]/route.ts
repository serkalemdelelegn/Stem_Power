import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { section } = body

    if (!section) {
      return NextResponse.json({ error: "Section is required" }, { status: 400 })
    }

    // In production, update in database
    const updatedItem = {
      ...body,
      id: params.id,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(updatedItem, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    return NextResponse.json({ success: true, id: params.id }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
  }
}
