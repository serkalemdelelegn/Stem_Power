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

    // Check if this is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const response = await backendApiServer.putFormData(
        `/api/members/${id}`,
        formData as any,
        req
      );
      return Response.json(response);
    }

    // Otherwise, handle as JSON
    const data = await req.json();
    const response = await backendApiServer.put(
      `/api/members/${id}`,
      data,
      req
    );
    return Response.json(response);
  } catch (error: any) {
    console.error("[Members] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update member" },
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

    await backendApiServer.delete(`/api/members/${id}`, req);
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Members] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete member" },
      { status: 400 }
    );
  }
}
