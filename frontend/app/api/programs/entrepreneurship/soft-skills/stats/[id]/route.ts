import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const data = await req.json();
    const response = await backendApiServer.put(
      `/api/soft-skills-training/stats/${resolvedParams.id}`,
      data,
      req
    );
    return Response.json(response);
  } catch (error: any) {
    console.error("Error updating soft-skills stat:", error);
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
    const resolvedParams = params instanceof Promise ? await params : params;
    await backendApiServer.delete(
      `/api/soft-skills-training/stats/${resolvedParams.id}`,
      req
    );
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting soft-skills stat:", error);
    return Response.json(
      { error: error.message || "Not found" },
      { status: 404 }
    );
  }
}
