import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/fablab-products/stats",
      req
    );
    const stats = Array.isArray(response) ? response : [];
    return Response.json(stats);
  } catch (error: any) {
    console.error("[Products Stats] GET error:", error);
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
    };
    const response = await backendApiServer.post(
      "/api/fablab-products/stats",
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
    console.error("[Products Stats] POST error:", error);
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

    // Update or create stats individually
    const results = await Promise.all(
      incoming.map(async (stat: any) => {
        // Transform frontend format (title, number) to backend format (title, value)
        const backendData = {
          title: stat.title || "",
          value: stat.number || stat.value || "",
        };

        if (stat.id && !stat.id.startsWith("temp-")) {
          // Update existing stat
          try {
            const response = await backendApiServer.put(
              `/api/fablab-products/stats/${stat.id}`,
              backendData,
              request
            );
            return {
              id: String(response.id),
              title: response.title || "",
              number: response.value || "",
            };
          } catch (error) {
            // If update fails, try to create new one
            const response = await backendApiServer.post(
              "/api/fablab-products/stats",
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
          // Create new stat
          const response = await backendApiServer.post(
            "/api/fablab-products/stats",
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
    console.error("[Products Stats] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update stats" },
      { status: 400 }
    );
  }
}
