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
    badge: hero.badge || "Social Media Updates",
    title: hero.title || "Follow Our Journey on Social Media",
    description:
      hero.description ||
      "Stay connected with our daily updates, inspiring stories, and behind-the-scenes moments from the STEMpower Ethiopia community across all social platforms.",
    statistics: {
      stat1Value: hero.stat1Value || "25K+",
      stat1Label: hero.stat1Label || "Total Followers",
      stat2Value: hero.stat2Value || "150K+",
      stat2Label: hero.stat2Label || "Monthly Reach",
      stat3Value: hero.stat3Value || "8.5%",
      stat3Label: hero.stat3Label || "Engagement Rate",
    },
  };
}

// Helper function to transform frontend hero to backend format
function transformFrontendHeroToBackend(frontendHero: any) {
  return {
    badge: frontendHero.badge || "Social Media Updates",
    title: frontendHero.title || "Follow Our Journey on Social Media",
    description: frontendHero.description || "",
    stat1Value: frontendHero.statistics?.stat1Value || "25K+",
    stat1Label: frontendHero.statistics?.stat1Label || "Total Followers",
    stat2Value: frontendHero.statistics?.stat2Value || "150K+",
    stat2Label: frontendHero.statistics?.stat2Label || "Monthly Reach",
    stat3Value: frontendHero.statistics?.stat3Value || "8.5%",
    stat3Label: frontendHero.statistics?.stat3Label || "Engagement Rate",
  };
}

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/news/social-media/hero",
      req
    );
    const heroes = Array.isArray(response) ? response : [];
    const hero = heroes.length > 0 ? heroes[0] : null;

    if (!hero) {
      // Return default hero if none exists
      return Response.json({
        badge: "Social Media Updates",
        title: "Follow Our Journey on Social Media",
        description:
          "Stay connected with our daily updates, inspiring stories, and behind-the-scenes moments from the STEMpower Ethiopia community across all social platforms.",
        statistics: {
          stat1Value: "25K+",
          stat1Label: "Total Followers",
          stat2Value: "150K+",
          stat2Label: "Monthly Reach",
          stat3Value: "8.5%",
          stat3Label: "Engagement Rate",
        },
      });
    }

    const transformed = transformBackendHeroToFrontend(hero);
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Social Media Hero] GET error:", error);
    // Return default on error
    return Response.json({
      badge: "Social Media Updates",
      title: "Follow Our Journey on Social Media",
      description:
        "Stay connected with our daily updates, inspiring stories, and behind-the-scenes moments from the STEMpower Ethiopia community across all social platforms.",
      statistics: {
        stat1Value: "25K+",
        stat1Label: "Total Followers",
        stat2Value: "150K+",
        stat2Label: "Monthly Reach",
        stat3Value: "8.5%",
        stat3Label: "Engagement Rate",
      },
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const backendData = transformFrontendHeroToBackend(data);

    // Check if hero exists
    const existingResponse = await backendApiServer.get(
      "/api/news/social-media/hero",
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
        `/api/news/social-media/hero/${existingHero.id}`,
        backendData,
        req
      );
    } else {
      // Create new hero
      response = await backendApiServer.post(
        "/api/latest/news/social-media/hero",
        backendData,
        req
      );
    }

    const transformed = transformBackendHeroToFrontend(response);
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Social Media Hero] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update hero banner" },
      { status: 400 }
    );
  }
}
