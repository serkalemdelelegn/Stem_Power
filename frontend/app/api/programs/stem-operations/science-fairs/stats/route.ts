import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/science-fairs/stats",
      req
    );
    // Backend returns array directly
    return Response.json(Array.isArray(response) ? response : []);
  } catch (error: any) {
    console.error("[Science Fairs Stats] GET error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch stats" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/science-fairs/stats",
      data,
      req
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("[Science Fairs Stats] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create stat" },
      { status: 400 }
    );
  }
}
