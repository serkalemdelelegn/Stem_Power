import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/science-fairs/hero", req);
    // Backend returns { success: true, data: [...] }, get the first item or return null
    if (
      response.success &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      return Response.json(response.data[0]);
    }
    return Response.json(null);
  } catch (error: any) {
    console.error("[Science Fairs Hero] GET error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch hero" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/science-fairs/hero",
      data,
      req
    );
    // Backend returns { success: true, data: {...} }
    return Response.json(response.data || response, { status: 201 });
  } catch (error: any) {
    console.error("[Science Fairs Hero] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to save hero section" },
      { status: 400 }
    );
  }
}
