import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend hero to frontend format
function transformBackendHeroToFrontend(backendHero: any) {
  if (!backendHero || typeof backendHero !== "object") {
    return null;
  }

  // Handle array response (get first one)
  const hero = Array.isArray(backendHero) ? backendHero[0] : backendHero;

  return {
    badge: hero.badge || "Stay Informed",
    title: hero.title || "Announcements & Opportunities",
    description:
      hero.description ||
      "Stay up to date with official updates, exciting opportunities, and upcoming events from STEMpower Ethiopia. Be the first to know about new programs, job openings, and partnership announcements.",
    statistics: {
      activeAnnouncements: hero.activeAnnouncements || "8+",
      openOpportunities: hero.openOpportunities || "5+",
      upcomingEvents: hero.upcomingEvents || "3+",
    },
  };
}

// Helper function to transform frontend hero to backend format
function transformFrontendHeroToBackend(frontendHero: any) {
  return {
    badge: frontendHero.badge || "Stay Informed",
    title: frontendHero.title || "Announcements & Opportunities",
    description: frontendHero.description || "",
    activeAnnouncements: frontendHero.statistics?.activeAnnouncements || "8+",
    openOpportunities: frontendHero.statistics?.openOpportunities || "5+",
    upcomingEvents: frontendHero.statistics?.upcomingEvents || "3+",
  };
}

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/announcements/hero", req);
    const heroes = Array.isArray(response) ? response : [];
    const hero = heroes.length > 0 ? heroes[0] : null;

    const transformed = transformBackendHeroToFrontend(hero);
    return Response.json(transformed ?? {});
  } catch (error: any) {
    console.error("[Announcements Hero] GET error:", error);
    return Response.json({}, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const backendData = transformFrontendHeroToBackend(data);

    // Check if hero exists
    const existingResponse = await backendApiServer.get(
      "/api/announcements/hero",
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
        `/api/announcements/hero/${existingHero.id}`,
        backendData,
        req
      );
    } else {
      // Create new hero
      response = await backendApiServer.post(
        "/api/announcements/hero",
        backendData,
        req
      );
    }

    const transformed = transformBackendHeroToFrontend(response);
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Announcements Hero] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update hero banner" },
      { status: 400 }
    );
  }
}
