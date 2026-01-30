import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/fablab-services/benefits",
      req
    );
    const benefits = Array.isArray(response) ? response : [];
    return Response.json(benefits);
  } catch (error: any) {
    console.error("[Services Benefits] GET error:", error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const incoming = await request.json();
    const backendData = {
      title: incoming.title || "",
      description: incoming.description || "",
      icon: incoming.icon || "shield",
    };
    const response = await backendApiServer.post(
      "/api/fablab-services/benefits",
      backendData,
      request
    );
    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("[Services Benefits] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create benefit" },
      { status: 400 }
    );
  }
}
