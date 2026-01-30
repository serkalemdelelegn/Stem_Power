import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend hero to frontend format
function transformBackendHeroToFrontend(backendHero: any) {
  if (!backendHero || typeof backendHero !== "object") {
    return {
      badge: "Empowering Africa's Next Generation Since 2010",
      title: "61 STEM Centers Across Ethiopia",
      description:
        "Specialized learning hubs where education meets innovation.",
    };
  }

  return {
    badge: "Empowering Africa's Next Generation Since 2010", // Backend doesn't have badge, use default
    title: backendHero.title || "61 STEM Centers Across Ethiopia",
    description:
      backendHero.subtitle ||
      backendHero.description ||
      "Specialized learning hubs where education meets innovation.",
  };
}

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/stem-centers/hero", req);
    const backendHeroes = Array.isArray(response) ? response : [];

    if (backendHeroes.length === 0) {
      return Response.json(transformBackendHeroToFrontend(null));
    }

    // Get the most recent hero (first in DESC order)
    const transformed = transformBackendHeroToFrontend(backendHeroes[0]);
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[STEM Centers Hero] GET error:", error);
    return Response.json(transformBackendHeroToFrontend(null), { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Transform frontend format (badge, title, description) to backend format (title, subtitle)
    const backendData = {
      title: data.title || "",
      subtitle: data.description || null,
      hero_image: null, // Can be added later if needed
    };
    const response = await backendApiServer.post(
      "/api/stem-centers/hero",
      backendData,
      req
    );
    const transformed = transformBackendHeroToFrontend(response);
    return Response.json(transformed, { status: 201 });
  } catch (error: any) {
    console.error("[STEM Centers Hero] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to save hero section" },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    // Get existing heroes to find the one to update
    const existingHeroes = await backendApiServer.get(
      "/api/stem-centers/hero",
      req
    );
    const heroesArray = Array.isArray(existingHeroes) ? existingHeroes : [];

    if (heroesArray.length === 0) {
      // No existing hero, create new one
      const backendData = {
        title: data.title || "",
        subtitle: data.description || null,
        hero_image: null,
      };
      const response = await backendApiServer.post(
        "/api/stem-centers/hero",
        backendData,
        req
      );
      const transformed = transformBackendHeroToFrontend(response);
      return Response.json(transformed);
    }

    // Update the most recent hero
    const heroToUpdate = heroesArray[0];
    const backendData: any = {};
    if (data.title !== undefined) backendData.title = data.title;
    if (data.description !== undefined)
      backendData.subtitle = data.description || null;

    const response = await backendApiServer.put(
      `/api/stem-centers/hero/${heroToUpdate.id}`,
      backendData,
      req
    );
    const transformed = transformBackendHeroToFrontend(response);
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[STEM Centers Hero] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update hero section" },
      { status: 400 }
    );
  }
}
