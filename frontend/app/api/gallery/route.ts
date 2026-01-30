import { NextRequest, NextResponse } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Transform backend gallery data to frontend format
function transformGalleryItem(item: any) {
  return {
    id: item.id?.toString() || item.id,
    image: item.media_url || "",
    title: item.title || "",
    description: item.caption || "",
    category: item.category || "General",
    location: item.location || "",
    participants: item.participants || 0,
    createdAt: item.createdAt || new Date().toISOString(),
  };
}

export async function GET(req: NextRequest) {
  try {
    const items = await backendApiServer.get("/api/home/gallery", req);

    // Filter only active items and transform data
    const activeItems = Array.isArray(items)
      ? items
          .filter((item: any) => item.isActive !== false)
          .map(transformGalleryItem)
      : [];

    return NextResponse.json(activeItems, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery from backend:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendData = {
      title: body.title || null,
      caption: body.description || null,
      isActive: true,
    };

    // Note: Image upload would need to be handled separately with FormData
    const newItem = await backendApiServer.post(
      "/api/home/gallery",
      backendData,
      req
    );
    return NextResponse.json(transformGalleryItem(newItem), { status: 201 });
  } catch (error) {
    console.error("Error creating gallery item:", error);
    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}
