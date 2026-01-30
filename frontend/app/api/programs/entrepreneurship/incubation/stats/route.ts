import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/incubation-program/stats",
      req
    );
    const stats = Array.isArray(response) ? response : [];
    return Response.json(stats);
  } catch (error: any) {
    console.error("Error fetching incubation stats:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/incubation-program/stats",
      data,
      req
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("Error creating incubation stat:", error);
    return Response.json(
      { error: error.message || "Failed to create stat" },
      { status: 400 }
    );
  }
}
