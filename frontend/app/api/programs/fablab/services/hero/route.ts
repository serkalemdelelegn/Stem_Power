import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/fablab-services/hero", req);
    const heroes = Array.isArray(response) ? response : [];
    // Return the most recent hero (first in DESC order)
    const hero = heroes.length > 0 ? heroes[0] : null;
    return Response.json(hero);
  } catch (error: any) {
    console.error("[Services Hero] GET error:", error);
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
      description: incoming.description || incoming.subtitle || "",
      subtitle: incoming.description || incoming.subtitle || "",
    };
    const response = await backendApiServer.post(
      "/api/fablab-services/hero",
      backendData,
      request
    );
    // Transform backend response to frontend format
    const transformedHero = {
      id: String(response.id),
      badge: response.badge || "",
      title: response.title || "",
      description: response.description || response.subtitle || "",
    };
    return Response.json(transformedHero, { status: 201 });
  } catch (error: any) {
    console.error("[Services Hero] POST error:", error);
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
    if (incoming.description !== undefined) {
      backendData.description = incoming.description;
      backendData.subtitle = incoming.description;
    }

    const response = await backendApiServer.put(
      `/api/fablab-services/hero/${incoming.id}`,
      backendData,
      request
    );
    // Transform backend response to frontend format
    const transformedHero = {
      id: String(response.id),
      badge: response.badge || "",
      title: response.title || "",
      description: response.description || response.subtitle || "",
    };
    return Response.json(transformedHero);
  } catch (error: any) {
    console.error("[Services Hero] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update hero" },
      { status: 400 }
    );
  }
}
