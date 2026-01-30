import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get("/api/footer/sections", req);
    if (response.success && response.data) {
      return Response.json(response.data);
    }
    return Response.json([]);
  } catch (error: any) {
    console.error("[Footer Sections] GET error:", error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/footer/sections",
      data,
      req
    );
    if (response.success && response.data) {
      return Response.json(response.data, { status: 201 });
    }
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("[Footer Sections] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create footer section" },
      { status: 400 }
    );
  }
}
