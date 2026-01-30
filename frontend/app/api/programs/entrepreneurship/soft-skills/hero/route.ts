import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/soft-skills-training/hero",
      req
    );
    const heroes = Array.isArray(response) ? response : [];
    return Response.json(heroes.length > 0 ? heroes[0] : null);
  } catch (error: any) {
    console.error("Error fetching soft-skills hero:", error);
    return Response.json(null, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/soft-skills-training/hero",
      data,
      req
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating soft-skills hero:", error);
    return Response.json(
      { error: error.message || "Failed to save hero section" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    // First get the hero to get its ID
    const getResponse = await backendApiServer.get(
      "/api/soft-skills-training/hero",
      req
    );
    const heroes = Array.isArray(getResponse) ? getResponse : [];
    if (heroes.length === 0) {
      return Response.json(
        { error: "Hero section not found" },
        { status: 404 }
      );
    }
    const heroId = heroes[0].id;
    const response = await backendApiServer.put(
      `/api/soft-skills-training/hero/${heroId}`,
      data,
      req
    );
    return Response.json(response);
  } catch (error: any) {
    console.error("Error updating soft-skills hero:", error);
    return Response.json(
      { error: error.message || "Failed to update hero section" },
      { status: 400 }
    );
  }
}
