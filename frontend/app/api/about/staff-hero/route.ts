import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/staff-hero", req);
    // Backend returns array, get the first one or return null
    if (Array.isArray(response) && response.length > 0) {
      return Response.json(response[0]);
    }
    return Response.json(null);
  } catch (error: any) {
    console.error("[Staff Hero] GET error:", error);
    return Response.json(null, { status: 200 }); // Return null instead of error for graceful handling
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post("/api/staff-hero", data, req);
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("[Staff Hero] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create staff hero" },
      { status: 400 }
    );
  }
}
