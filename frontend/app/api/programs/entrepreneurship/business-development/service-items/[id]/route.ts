import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const response = await backendApiServer.put(
      `/api/business-development/service-items/${id}`,
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
      return Response.json(normalizedItem);
    }

    return Response.json(response);
  } catch (error: any) {
    console.error("[Service Items] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update service item" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await backendApiServer.delete(
      `/api/business-development/service-items/${id}`,
      req
    );
    return Response.json(response);
  } catch (error: any) {
    console.error("[Service Items] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete service item" },
      { status: 400 }
    );
  }
}
