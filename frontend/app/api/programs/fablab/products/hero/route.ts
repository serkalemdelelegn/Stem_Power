import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/fablab-products/hero", req);
    const heroes = Array.isArray(response) ? response : [];
    // Return the most recent hero (first in DESC order)
    const hero = heroes.length > 0 ? heroes[0] : null;
    return Response.json(hero);
  } catch (error: any) {
    console.error("[Products Hero] GET error:", error);
    return Response.json(null, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const incoming = await request.json();
    // Transform frontend format to backend format
    const backendData = {
      badge: incoming.badge || "",
      title: incoming.title || "",
      subtitle: incoming.description || incoming.subtitle || "",
      image: incoming.image || null,
    };
    const response = await backendApiServer.post(
      "/api/fablab-products/hero",
      backendData,
      request
    );
    // Transform backend response to frontend format
    const transformedHero = {
      id: String(response.id),
      badge: response.badge || "",
      title: response.title || "",
      description: response.subtitle || response.description || "",
      image: response.image || "",
    };
    return Response.json(transformedHero, { status: 201 });
  } catch (error: any) {
    console.error("[Products Hero] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create hero" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const incoming = await request.json();
    if (!incoming.id) {
      return Response.json(
        { error: "Hero ID is required for update" },
        { status: 400 }
      );
    }
    // Transform frontend format to backend format
    const backendData: any = {};
    if (incoming.badge !== undefined) backendData.badge = incoming.badge;
    if (incoming.title !== undefined) backendData.title = incoming.title;
    if (incoming.description !== undefined)
      backendData.subtitle = incoming.description;
    if (incoming.image !== undefined) backendData.image = incoming.image;

    const response = await backendApiServer.put(
      `/api/fablab-products/hero/${incoming.id}`,
      backendData,
      request
    );
    // Transform backend response to frontend format
    const transformedHero = {
      id: String(response.id),
      badge: response.badge || "",
      title: response.title || "",
      description: response.subtitle || response.description || "",
      image: response.image || "",
    };
    return Response.json(transformedHero);
  } catch (error: any) {
    console.error("[Products Hero] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update hero" },
      { status: 400 }
    );
  }
}
