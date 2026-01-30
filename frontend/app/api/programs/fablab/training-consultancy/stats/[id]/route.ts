import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    const payload = await request.json();
    // Transform frontend format (icon, value, label) to backend format (icon, value, title)
    const backendData: any = {};
    if (payload.icon !== undefined) backendData.icon = payload.icon || null;
    if (payload.value !== undefined) backendData.value = payload.value;
    if (payload.label !== undefined || payload.title !== undefined)
      backendData.title = payload.label || payload.title || "";

    const response = await backendApiServer.put(
      `/api/training-consultancy/stats/${id}`,
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
    return Response.json(transformedStat);
  } catch (error: any) {
    console.error("[Training Consultancy Stats] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update stat" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    await backendApiServer.delete(
      `/api/training-consultancy/stats/${id}`,
      request
    );
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Training Consultancy Stats] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete stat" },
      { status: 400 }
    );
  }
}
