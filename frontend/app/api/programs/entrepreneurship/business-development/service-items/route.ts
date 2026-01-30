import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(req: NextRequest) {
  try {
    const response = await backendApiServer.get(
      "/api/business-development/service-items",
      req
    );
    // Backend returns { success: true, data: [...] }
    const serviceItems = Array.isArray(response.data) ? response.data : [];

    // Normalize capabilities to ensure they're always arrays of strings
    const normalizedItems = serviceItems.map((item: any) => {
      let capabilities: string[] = [];

      if (Array.isArray(item.capabilities)) {
        // Flatten any nested JSON strings
        capabilities = item.capabilities
          .flatMap((cap: any) => {
            if (typeof cap === "string" && cap.trim().startsWith("[")) {
              try {
                const parsed = JSON.parse(cap);
                if (Array.isArray(parsed)) {
                  return parsed.flatMap((p: any) => {
                    if (typeof p === "string" && p.trim().startsWith("[")) {
                      try {
                        const nested = JSON.parse(p);
                        return Array.isArray(nested)
                          ? nested.map(String)
                          : [String(p)];
                      } catch {
                        return [String(p)];
                      }
                    }
                    return [String(p)];
                  });
                }
                return [String(cap)];
              } catch {
                return [String(cap)];
              }
            }
            return [String(cap)];
          })
          .filter((cap: string) => cap.trim());
      } else if (typeof item.capabilities === "string") {
        try {
          const parsed = JSON.parse(item.capabilities);
          if (Array.isArray(parsed)) {
            capabilities = parsed
              .flatMap((p: any) => {
                if (typeof p === "string" && p.trim().startsWith("[")) {
                  try {
                    const nested = JSON.parse(p);
                    return Array.isArray(nested)
                      ? nested.map(String)
                      : [String(p)];
                  } catch {
                    return [String(p)];
                  }
                }
                return [String(p)];
              })
              .filter((cap: string) => cap.trim());
          } else {
            capabilities = item.capabilities
              .split("\n")
              .filter((line: string) => line.trim());
          }
        } catch {
          capabilities = item.capabilities
            .split("\n")
            .filter((line: string) => line.trim());
        }
      }

      return {
        ...item,
        capabilities,
      };
    });

    return Response.json(normalizedItems);
  } catch (error: any) {
    console.error("[Service Items] GET error:", error);
    return Response.json(
      { error: error.message || "Failed to fetch service items" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const response = await backendApiServer.post(
      "/api/business-development/service-items",
      data,
      req
    );

    // Normalize the response the same way we normalize on GET
    const item = response.data || response;
    if (item && item.capabilities) {
      let capabilities: string[] = [];
      if (Array.isArray(item.capabilities)) {
        capabilities = item.capabilities
          .flatMap((cap: any) => {
            if (typeof cap === "string" && cap.trim().startsWith("[")) {
              try {
                const parsed = JSON.parse(cap);
                if (Array.isArray(parsed)) {
                  return parsed.flatMap((p: any) => {
                    if (typeof p === "string" && p.trim().startsWith("[")) {
                      try {
                        const nested = JSON.parse(p);
                        return Array.isArray(nested)
                          ? nested.map(String)
                          : [String(p)];
                      } catch {
                        return [String(p)];
                      }
                    }
                    return [String(p)];
                  });
                }
                return [String(cap)];
              } catch {
                return [String(cap)];
              }
            }
            return [String(cap)];
          })
          .filter((cap: string) => cap.trim());
      }

      const normalizedItem = {
        ...item,
        capabilities,
      };
      return Response.json(normalizedItem, { status: 201 });
    }

    return Response.json(response, { status: 201 });
  } catch (error: any) {
    console.error("[Service Items] POST error:", error);
    return Response.json(
      { error: error.message || "Failed to create service item" },
      { status: 400 }
    );
  }
}
