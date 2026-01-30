import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

// Helper function to transform backend hero to frontend format
function transformBackendHeroToFrontend(backendHero: any) {
  if (!backendHero || typeof backendHero !== "object") {
    return null;
  }

  // Handle array response (get first one)
  const hero = Array.isArray(backendHero) ? backendHero[0] : backendHero;

  // Transform statistics from stat1Icon/stat1Value/stat1Label format to array
  const statistics = [];
  if (hero.stat1Icon && hero.stat1Value && hero.stat1Label) {
    statistics.push({
      id: "stat-1",
      icon: hero.stat1Icon,
      value: hero.stat1Value,
      label: hero.stat1Label,
    });
  }
  if (hero.stat2Icon && hero.stat2Value && hero.stat2Label) {
    statistics.push({
      id: "stat-2",
      icon: hero.stat2Icon,
      value: hero.stat2Value,
      label: hero.stat2Label,
    });
  }
  if (hero.stat3Icon && hero.stat3Value && hero.stat3Label) {
    statistics.push({
      id: "stat-3",
      icon: hero.stat3Icon,
      value: hero.stat3Value,
      label: hero.stat3Label,
    });
  }

  return {
    badge: hero.badge || "STEMpower Ethiopia Events",
    title: hero.title || "Join Our STEM Community Events",
    description:
      hero.description ||
      "Discover workshops, competitions, and networking opportunities designed to advance STEM education and innovation across Ethiopia.",
    image: hero.image || "",
    statistics:
      statistics.length > 0
        ? statistics
        : [
            {
              id: "stat-1",
              icon: "calendar",
              value: "50+",
              label: "Annual Events",
            },
            {
              id: "stat-2",
              icon: "users",
              value: "10,000+",
              label: "Participants",
            },
            {
              id: "stat-3",
              icon: "star",
              value: "25+",
              label: "Competitions Hosted",
            },
          ],
  };
}

// Helper function to transform frontend hero to backend format
function transformFrontendHeroToBackend(frontendHero: any) {
  const stats = frontendHero.statistics || [];

  return {
    badge: frontendHero.badge || "STEMpower Ethiopia Events",
    title: frontendHero.title || "Join Our STEM Community Events",
    description: frontendHero.description || "",
    image: frontendHero.image || null,
    stat1Icon: stats[0]?.icon || "calendar",
    stat1Value: stats[0]?.value || "50+",
    stat1Label: stats[0]?.label || "Annual Events",
    stat2Icon: stats[1]?.icon || "users",
    stat2Value: stats[1]?.value || "10,000+",
    stat2Label: stats[1]?.label || "Participants",
    stat3Icon: stats[2]?.icon || "star",
    stat3Value: stats[2]?.value || "25+",
    stat3Label: stats[2]?.label || "Competitions Hosted",
  };
}

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/events/hero", req);
    const heroes = Array.isArray(response) ? response : [];
    const hero = heroes.length > 0 ? heroes[0] : null;

    if (!hero) {
      // Return default hero if none exists
      return Response.json({
        badge: "STEMpower Ethiopia Events",
        title: "Join Our STEM Community Events",
        description:
          "Discover workshops, competitions, and networking opportunities designed to advance STEM education and innovation across Ethiopia.",
        image: "",
        statistics: [
          {
            id: "stat-1",
            icon: "calendar",
            value: "50+",
            label: "Annual Events",
          },
          {
            id: "stat-2",
            icon: "users",
            value: "10,000+",
            label: "Participants",
          },
          {
            id: "stat-3",
            icon: "star",
            value: "25+",
            label: "Competitions Hosted",
          },
        ],
      });
    }

    const transformed = transformBackendHeroToFrontend(hero);
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Events Hero] GET error:", error);
    // Return default on error
    return Response.json({
      badge: "STEMpower Ethiopia Events",
      title: "Join Our STEM Community Events",
      description:
        "Discover workshops, competitions, and networking opportunities designed to advance STEM education and innovation across Ethiopia.",
      image: "",
      statistics: [
        {
          id: "stat-1",
          icon: "calendar",
          value: "50+",
          label: "Annual Events",
        },
        {
          id: "stat-2",
          icon: "users",
          value: "10,000+",
          label: "Participants",
        },
        {
          id: "stat-3",
          icon: "star",
          value: "25+",
          label: "Competitions Hosted",
        },
      ],
    });
  }
}

export async function PUT(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // If multipart, forward as FormData (supports image upload)
    if (contentType.includes("multipart/form-data")) {
      const incoming = await req.formData();
      const formData = new FormData();
      for (const [key, value] of incoming.entries()) {
        // value can be string or File
        formData.append(key, value as any);
      }

      // Check if hero exists
      const existingResponse = await backendApiServer.get(
        "/api/events/hero",
        req
      );
      const existingHeroes = Array.isArray(existingResponse)
        ? existingResponse
        : [];
      const existingHero = existingHeroes.length > 0 ? existingHeroes[0] : null;

      let response;
      if (existingHero && existingHero.id) {
        response = await backendApiServer.putFormData(
          `/api/events/hero/${existingHero.id}`,
          formData,
          req
        );
      } else {
        response = await backendApiServer.postFormData(
          "/api/events/hero",
          formData,
          req
        );
      }

      const transformed = transformBackendHeroToFrontend(response);
      return Response.json(transformed);
    }

    // Otherwise treat as JSON and transform
    const data = await req.json();
    const backendData = transformFrontendHeroToBackend(data);

    const existingResponse = await backendApiServer.get(
      "/api/events/hero",
      req
    );
    const existingHeroes = Array.isArray(existingResponse)
      ? existingResponse
      : [];
    const existingHero = existingHeroes.length > 0 ? existingHeroes[0] : null;

    let response;
    if (existingHero && existingHero.id) {
      response = await backendApiServer.put(
        `/api/events/hero/${existingHero.id}`,
        backendData,
        req
      );
    } else {
      response = await backendApiServer.post(
        "/api/events/hero",
        backendData,
        req
      );
    }

    const transformed = transformBackendHeroToFrontend(response);
    return Response.json(transformed);
  } catch (error: any) {
    console.error("[Events Hero] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update hero banner" },
      { status: 400 }
    );
  }
}
