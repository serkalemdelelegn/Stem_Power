import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

function transformBackendHeroToFrontend(item: any) {
  if (!item || typeof item !== "object") return null;
  return {
    id: String(item.id || ""),
    badge: item.badge || "",
    title: item.title || "",
    description: item.subtitle || item.description || "",
    hero_image: item.hero_image || null,
  };
}

function transformFrontendHeroToBackend(data: any) {
  return {
    badge: data.badge || "",
    title: data.title || "",
    subtitle: data.description || data.subtitle || "",
    hero_image: data.hero_image || null,
  };
}

export async function GET(req: NextRequest) {
  try {
    const list = await backendApiServer.get("/api/university-outreach", req);
    const arr = Array.isArray(list) ? list : [];
    const first = arr[0] || null;
    const hero = transformBackendHeroToFrontend(first);
    return Response.json(hero);
  } catch (error: any) {
    return Response.json(null, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const backend = transformFrontendHeroToBackend(data);
    const created = await backendApiServer.post(
      "/api/university-outreach",
      backend,
      req
    );
    const hero = transformBackendHeroToFrontend(created);
    return Response.json(hero, { status: 201 });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to create hero" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const id = data?.id;
    if (!id) {
      return Response.json({ error: "Missing hero id" }, { status: 400 });
    }
    const backend = transformFrontendHeroToBackend(data);
    const updated = await backendApiServer.put(
      `/api/university-outreach/${id}`,
      backend,
      req
    );
    const hero = transformBackendHeroToFrontend(updated);
    return Response.json(hero);
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to update hero" },
      { status: 400 }
    );
  }
}
