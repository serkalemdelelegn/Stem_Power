import { NextRequest } from "next/server";
import { backendApiServer } from "@/lib/backend-api-server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Await params if it's a Promise (Next.js 15+)
    const resolvedParams = params instanceof Promise ? await params : params;
    const id = resolvedParams.id;
    const response = await backendApiServer.get(
      `/api/footer/sections/${id}`,
      req
    );
    if (response.success && response.data) {
      return Response.json(response.data);
    }
    return Response.json(null);
  } catch (error: any) {
    console.error("[Footer Section] GET error:", error);
    return Response.json(null, { status: 404 });
  }
}

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
      `/api/footer/sections/${id}`,
      data,
      req
    );
    if (response.success && response.data) {
      return Response.json(response.data);
    }
    return Response.json(response);
  } catch (error: any) {
    console.error("[Footer Section] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update footer section" },
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
    const response = await backendApiServer.delete(
      `/api/footer/sections/${id}`,
      req
    );
    return Response.json(response);
  } catch (error: any) {
    console.error("[Footer Section] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete footer section" },
      { status: 400 }
    );
  }
}
