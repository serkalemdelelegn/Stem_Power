import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/digital-skill-training/stats",
      req
    );
    // Backend returns array directly (not wrapped in { success, data })
    const stats = response || [];
    // Transform backend format to admin page format
    // Backend uses 'title' and 'value', admin uses 'label' and 'value'
    const transformedStats = stats.map((stat: any) => ({
      id: stat.id,
      icon: stat.icon || "rocket",
      value: stat.value || "",
      label: stat.title || "", // Backend uses 'title', admin uses 'label'
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
      "/api/digital-skill-training/stats",
      backendData,
      req
    );
    // Backend returns the stat directly
    const stat = response;
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
