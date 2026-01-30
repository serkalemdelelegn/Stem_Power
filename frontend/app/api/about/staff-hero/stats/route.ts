import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    // Get staff_hero_id from query params if provided
    const { searchParams } = new URL(req.url);
    const staffHeroId = searchParams.get("staff_hero_id");

    let endpoint = "/api/staff-hero/stats";
    if (staffHeroId) {
      endpoint += `?staff_hero_id=${staffHeroId}`;
    }

    const response = await backendApiServer.get(endpoint, req);
    // Backend returns array directly
    return Response.json(Array.isArray(response) ? response : []);
  } catch (error: any) {
    console.error("[Staff Hero Stats] GET error:", error);
    return Response.json([], { status: 200 }); // Return empty array for graceful handling
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/staff-hero/stats",
      data,
      req
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("[Staff Hero Stats] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create stat" },
      { status: 400 }
    );
  }
}
