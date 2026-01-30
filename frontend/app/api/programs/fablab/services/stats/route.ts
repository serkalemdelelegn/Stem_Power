import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/fablab-services/stats",
      req
    );
    const stats = Array.isArray(response) ? response : [];
    return Response.json(stats);
  } catch (error: any) {
    console.error("[Services Stats] GET error:", error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const incoming = await request.json();
    // Transform frontend format (title, number) to backend format (title, value)
    const backendData = {
      title: incoming.title || "",
      value: incoming.number || incoming.value || "",
      icon: incoming.icon || null,
    };
    const response = await backendApiServer.post(
      "/api/programs/fablab/services/stats",
      backendData,
      request
    );
    // Transform backend response to frontend format
    const transformedStat = {
      id: String(response.id),
      title: response.title || "",
      number: response.value || "",
    };
    return Response.json(transformedStat, { status: 201 });
  } catch (error: any) {
    console.error("[Services Stats] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create stat" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const incoming = await request.json();
    if (!Array.isArray(incoming)) {
      return Response.json(
        { error: "Expected an array of stats" },
        { status: 400 }
      );
    }

    // Get existing stats from backend to identify which ones to delete
    const existingStats = await backendApiServer.get(
      "/api/programs/fablab/services/stats",
      request
    );
    const existingStatsArray = Array.isArray(existingStats)
      ? existingStats
      : [];
    const incomingIds = incoming
      .map((s: any) => s.id)
      .filter((id: any) => id && !String(id).startsWith("temp-"));

    // Delete stats that are not in the incoming array
    const statsToDelete = existingStatsArray.filter(
      (existing: any) => !incomingIds.includes(String(existing.id))
    );

    // Delete removed stats
    await Promise.all(
      statsToDelete.map((stat: any) =>
        backendApiServer
          .delete(`/api/programs/fablab/services/stats/${stat.id}`, request)
          .catch((err) => {
            console.error(`Failed to delete stat ${stat.id}:`, err);
          })
      )
    );

    // Update or create stats individually
    const results = await Promise.all(
      incoming.map(async (stat: any) => {
        // Transform frontend format (title, number) to backend format (title, value)
        const backendData = {
          title: stat.title || "",
          value: stat.number || stat.value || "",
          icon: stat.icon || null,
        };

        // Check if this is a new stat (temp ID or no ID) or existing stat
        if (
          stat.id &&
          !String(stat.id).startsWith("temp-") &&
          !String(stat.id).match(/^\d{13}$/)
        ) {
          // Update existing stat (has a real backend ID)
          try {
            const response = await backendApiServer.put(
              `/api/programs/fablab/services/stats/${stat.id}`,
              backendData,
              request
            );
            return {
              id: String(response.id),
              title: response.title || "",
              number: response.value || "",
            };
          } catch (error) {
            // If update fails (stat doesn't exist), create new one
            const response = await backendApiServer.post(
              "/api/programs/fablab/services/stats",
              backendData,
              request
            );
            return {
              id: String(response.id),
              title: response.title || "",
              number: response.value || "",
            };
          }
        } else {
          // Create new stat (temp ID, numeric ID from Date.now(), or no ID)
          const response = await backendApiServer.post(
            "/api/programs/fablab/services/stats",
            backendData,
            request
          );
          return {
            id: String(response.id),
            title: response.title || "",
            number: response.value || "",
          };
        }
      })
    );

    return Response.json(results);
  } catch (error: any) {
    console.error("[Services Stats] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update stats" },
      { status: 400 }
    );
  }
}
