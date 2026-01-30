import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend hero to frontend format without fallbacks
function transformBackendHeroToFrontend(backendHero: any) {
  if (!backendHero || typeof backendHero !== "object") {
    return null;
  }

  // Handle array response (get first one)
  const hero = Array.isArray(backendHero) ? backendHero[0] : backendHero;

  return {
    badge: hero.badge ?? "",
    title: hero.title ?? "",
    description: hero.description ?? "",
    statistics: {
      subscribers: hero.subscribers ?? "",
      newsletters: hero.newsletters ?? "",
      monthlyReaders: hero.monthlyReaders ?? "",
    },
  };
}

// Helper function to transform frontend hero to backend format without fallbacks
function transformFrontendHeroToBackend(frontendHero: any) {
  return {
    badge: frontendHero.badge ?? "",
    title: frontendHero.title ?? "",
    description: frontendHero.description ?? "",
    subscribers: frontendHero.statistics?.subscribers ?? "",
    newsletters: frontendHero.statistics?.newsletters ?? "",
    monthlyReaders: frontendHero.statistics?.monthlyReaders ?? "",
  };
}

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/news/newsletter/hero",
      req
    );
    const heroes = Array.isArray(response) ? response : [];
    const hero = heroes.length > 0 ? heroes[0] : null;

    if (!hero) {
      // Return empty hero object (no mock defaults)
      return Response.json({
        badge: "",
        title: "",
        description: "",
        statistics: {
          subscribers: "",
          newsletters: "",
          monthlyReaders: "",
        },
      });
    }

    const transformed = transformBackendHeroToFrontend(hero);
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Newsletter Hero] GET error:", error);
    // Return empty hero on error (no mock defaults)
    return Response.json(
      {
        badge: "",
        title: "",
        description: "",
        statistics: {
          subscribers: "",
          newsletters: "",
          monthlyReaders: "",
        },
      },
      { status: 200 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const backendData = transformFrontendHeroToBackend(data);

    // Check if hero exists
    const existingResponse = await backendApiServer.get(
      "/api/news/newsletter/hero",
      req
    );
    const existingHeroes = Array.isArray(existingResponse)
      ? existingResponse
      : [];
    const existingHero = existingHeroes.length > 0 ? existingHeroes[0] : null;

    let response;
    if (existingHero && existingHero.id) {
      // Update existing hero
      response = await backendApiServer.put(
        `/api/news/newsletter/hero/${existingHero.id}`,
        backendData,
        req
      );
    } else {
      // Create new hero
      response = await backendApiServer.post(
        "/api/news/newsletter/hero",
        backendData,
        req
      );
    }

    const transformed = transformBackendHeroToFrontend(response);
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Newsletter Hero] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update hero banner" },
      { status: 400 }
    );
  }
}
