import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const incoming = await request.json();
    const backendData = {
      title: incoming.title || "",
      description: incoming.description || "",
      icon: incoming.icon || "shield",
    };
    const response = await backendApiServer.put(
      `/api/fablab-services/benefits/${resolvedParams.id}`,
      backendData,
      request
    );
    return Response.json(response);
  } catch (error: any) {
    console.error("[Services Benefits] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update benefit" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    await backendApiServer.delete(
      `/api/fablab-services/benefits/${resolvedParams.id}`,
      request
    );
    return Response.json({ message: "Benefit deleted successfully" });
  } catch (error: any) {
    console.error("[Services Benefits] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete benefit" },
      { status: 400 }
    );
  }
}
