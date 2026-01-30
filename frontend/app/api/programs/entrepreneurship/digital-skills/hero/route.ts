import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/digital-skill-training/hero",
      req
    );
    // Backend returns { success: true, data: [...] }
    const heroes = response.data || [];
    // Return the most recent hero (first in DESC order) or null
    return Response.json(heroes.length > 0 ? heroes[0] : null);
  } catch (error: any) {
    console.error("Error fetching hero:", error);
    return Response.json(null, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/digital-skill-training/hero",
      data,
      req
    );
    // Backend returns { success: true, data: hero }
    return Response.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("Error creating hero:", error);
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
      "/api/digital-skill-training/hero",
      req
    );
    const heroes = getResponse.data || [];
    if (heroes.length === 0) {
      return Response.json(
        { error: "Hero section not found" },
        { status: 404 }
      );
    }
    const heroId = heroes[0].id;
    const response = await backendApiServer.put(
      `/api/digital-skill-training/hero/${heroId}`,
      data,
      req
    );
    // Backend returns { success: true, data: hero }
    return Response.json(response.data);
  } catch (error: any) {
    console.error("Error updating hero:", error);
    return Response.json(
      { error: error.message || "Failed to update hero section" },
      { status: 400 }
    );
  }
}
