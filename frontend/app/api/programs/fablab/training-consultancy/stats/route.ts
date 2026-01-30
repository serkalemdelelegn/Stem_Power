import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/training-consultancy/stats",
      req
    );
    const stats = Array.isArray(response) ? response : [];
    // Transform backend format to frontend format
    const transformedStats = stats.map((stat: any) => ({
      id: String(stat.id || ""),
      icon: stat.icon || "users",
      value: stat.value || "",
      label: stat.title || "",
    }));
    return Response.json(transformedStats);
  } catch (error: any) {
    console.error("[Training Consultancy Stats] GET error:", error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    // Transform frontend format (icon, value, label) to backend format (icon, value, title)
    const backendData = {
      icon: payload.icon || null,
      value: payload.value || "",
      title: payload.label || payload.title || "",
    };
    const response = await backendApiServer.post(
      "/api/training-consultancy/stats",
      backendData,
      request
    );
    // Transform backend response to frontend format
    const transformedStat = {
      id: String(response.id),
      icon: response.icon || "users",
      value: response.value || "",
      label: response.title || "",
    };
    return Response.json(transformedStat, { status: 201 });
  } catch (error: any) {
    console.error("[Training Consultancy Stats] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create stat" },
      { status: 400 }
    );
  }
}
