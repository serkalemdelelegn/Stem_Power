import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Next.js 14 and 15 (params might be a Promise in Next.js 15)
    const resolvedParams = params instanceof Promise ? await params : params;
    const data = await req.json();
    // Transform admin format to backend format
    const backendData: any = {};
    if (data.label !== undefined) backendData.title = data.label;
    if (data.value !== undefined) backendData.value = data.value;
    if (data.icon !== undefined) backendData.icon = data.icon;

    const response = await backendApiServer.put(
      `/api/business-development/statistics/${resolvedParams.id}`,
      backendData,
      req
    );
    // Backend returns { success: true, data: stat }
    const stat = response.data;
    // Transform back to admin format
    return Response.json({
      id: stat.id,
      icon: stat.icon || "rocket",
      value: stat.value,
      label: stat.title,
    });
  } catch (error: any) {
    console.error("Error updating statistic:", error);
    return Response.json(
      { error: error.message || "Failed to update" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Next.js 14 and 15 (params might be a Promise in Next.js 15)
    const resolvedParams = params instanceof Promise ? await params : params;
    console.log("Deleting statistic with ID:", resolvedParams.id);
    await backendApiServer.delete(
      `/api/business-development/statistics/${resolvedParams.id}`,
      req
    );
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting statistic:", error);
    return Response.json(
      { error: error.message || "Not found" },
      { status: 404 }
    );
  }
}
