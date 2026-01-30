import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/business-development/statistics",
      req
    );
    // Backend returns { success: true, data: [...] }
    const stats = response.data || [];
    // Transform backend format to admin page format
    const transformedStats = stats.map((stat: any) => ({
      id: stat.id,
      icon: stat.icon || "rocket",
      value: stat.value,
      label: stat.title, // Backend uses 'title', admin uses 'label'
    }));
    return Response.json(transformedStats);
  } catch (error: any) {
    console.error("Error fetching statistics:", error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Transform admin format to backend format
    const backendData = {
      title: data.label, // Admin uses 'label', backend uses 'title'
      value: data.value,
      icon: data.icon || null,
    };
    const response = await backendApiServer.post(
      "/api/business-development/statistics",
      backendData,
      req
    );
    // Backend returns { success: true, data: stat }
    const stat = response.data;
    // Transform back to admin format
    return Response.json(
      {
        id: stat.id,
        icon: stat.icon || "rocket",
        value: stat.value,
        label: stat.title,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating statistic:", error);
    return Response.json(
      { error: error.message || "Failed to create stat" },
      { status: 400 }
    );
  }
}
