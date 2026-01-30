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

    // Check if this is multipart/form-data (file upload)
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const response = await backendApiServer.putFormData(
        `/api/training-consultancy/partners/${id}`,
        formData as any,
        request
      );
      // Transform backend response to frontend format
      const transformedPartner = {
        id: String(response.id),
        name: response.name || "",
        logo: response.logo || "",
      };
      return Response.json(transformedPartner);
    }

    // Otherwise, handle as JSON
    const payload = await request.json();
    const backendData: any = {};
    if (payload.name !== undefined) backendData.name = payload.name;
    if (payload.logo !== undefined) backendData.logo = payload.logo || null;

    const response = await backendApiServer.put(
      `/api/training-consultancy/partners/${id}`,
      backendData,
      request
    );
    // Transform backend response to frontend format
    const transformedPartner = {
      id: String(response.id),
      name: response.name || "",
      logo: response.logo || "",
    };
    return Response.json(transformedPartner);
  } catch (error: any) {
    console.error("[Training Consultancy Partners] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update partner" },
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
      `/api/training-consultancy/partners/${id}`,
      request
    );
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Training Consultancy Partners] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete partner" },
      { status: 400 }
    );
  }
}
