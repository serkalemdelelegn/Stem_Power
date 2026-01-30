import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    const data = await req.json();
    const response = await backendApiServer.put(
      `/api/staff-hero/${id}`,
      data,
      req
    );
    return Response.json(response);
  } catch (error: any) {
    console.error("[Staff Hero] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update staff hero" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;

    await backendApiServer.delete(`/api/staff-hero/${id}`, req);
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Staff Hero] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete staff hero" },
      { status: 400 }
    );
  }
}
