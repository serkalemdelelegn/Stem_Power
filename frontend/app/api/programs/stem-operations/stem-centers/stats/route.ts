import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/stem-centers/center-stats",
      req
    );
    const stats = Array.isArray(response) ? response : [];
    // Transform backend format to frontend format
    const transformedStats = stats.map((stat: any) => ({
      id: String(stat.id || ""),
      number: stat.value || "",
      label: stat.title || "",
      icon: stat.icon || "Building2",
    }));
    return Response.json(transformedStats);
  } catch (error: any) {
    console.error("[STEM Centers Stats] GET error:", error);
    return Response.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const backendData = {
      title: data.label || "",
      value: data.number || "",
    };
    const response = await backendApiServer.post(
      "/api/stem-centers/center-stats",
      backendData,
      req
    );
    // Transform backend response to frontend format
    const transformedStat = {
      id: String(response.id),
      number: response.value || "",
      label: response.title || "",
      icon: response.icon || "Building2",
    };
    return Response.json(transformedStat, { status: 201 });
  } catch (error: any) {
    console.error("[STEM Centers Stats] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create stat" },
      { status: 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const incoming = await req.json();
    if (!Array.isArray(incoming)) {
      return Response.json(
        { error: "Expected an array of stats" },
        { status: 400 }
      );
    }

    // Get existing stats from backend to identify which ones to delete
    const existingStats = await backendApiServer.get(
      "/api/stem-centers/center-stats",
      req
    );
    const existingStatsArray = Array.isArray(existingStats)
      ? existingStats
      : [];
    const incomingIds = incoming
      .map((s: any) => s.id)
      .filter(
        (id: any) =>
          id && !String(id).startsWith("temp-") && !String(id).match(/^\d{13}$/)
      );

    // Delete stats that are not in the incoming array
    const statsToDelete = existingStatsArray.filter(
      (existing: any) => !incomingIds.includes(String(existing.id))
    );

    // Delete removed stats
    await Promise.all(
      statsToDelete.map((stat: any) =>
        backendApiServer
          .delete(`/api/stem-centers/center-stats/${stat.id}`, req)
          .catch((err) => {
            console.error(`Failed to delete stat ${stat.id}:`, err);
          })
      )
    );

    // Update or create stats individually
    const results = await Promise.all(
      incoming.map(async (stat: any) => {
        const backendData = {
          title: stat.label || "",
          value: stat.number || "",
        };

        // Check if this is a new stat (temp ID, 13-digit numeric ID from Date.now(), or no ID)
        const isNewStat =
          !stat.id ||
          String(stat.id).startsWith("temp-") ||
          String(stat.id).match(/^\d{13}$/);

        if (!isNewStat) {
          // Update existing stat
          try {
            const response = await backendApiServer.put(
              `/api/stem-centers/center-stats/${stat.id}`,
              backendData,
              req
            );
            return {
              id: String(response.id),
              number: response.value || "",
              label: response.title || "",
              icon: response.icon || "Building2",
            };
          } catch (error) {
            // If update fails, try to create
            const response = await backendApiServer.post(
              "/api/stem-centers/center-stats",
              backendData,
              req
            );
            return {
              id: String(response.id),
              number: response.value || "",
              label: response.title || "",
              icon: response.icon || "Building2",
            };
          }
        } else {
          // Create new stat
          const response = await backendApiServer.post(
            "/api/stem-centers/center-stats",
            backendData,
            req
          );
          return {
            id: String(response.id),
            number: response.value || "",
            label: response.title || "",
            icon: response.icon || "Building2",
          };
        }
      })
    );

    return Response.json(results);
  } catch (error: any) {
    console.error("[STEM Centers Stats] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update stats" },
      { status: 400 }
    );
  }
}
