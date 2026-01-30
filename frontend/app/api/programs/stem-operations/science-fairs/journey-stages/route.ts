import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/science-fairs/journey-stages",
      req
    );
    // Backend returns array directly
    return Response.json(Array.isArray(response) ? response : []);
  } catch (error: any) {
    console.error("[Science Fairs Journey Stages] GET error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch journey stages" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/science-fairs/journey-stages",
      data,
      req
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("[Science Fairs Journey Stages] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create journey stage" },
      { status: 400 }
    );
  }
}
