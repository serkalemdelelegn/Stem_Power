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
        `/api/training-consultancy/programs/${id}`,
        formData as any,
        req
      );
      // Transform backend response to frontend format
      const transformedProgram = {
        id: String(response.id),
        title: response.title || "",
        description: response.description || "",
        image: response.image || "",
        features: Array.isArray(response.features)
          ? response.features
          : typeof response.features === "string"
          ? JSON.parse(response.features)
          : [],
        outcomes: Array.isArray(response.outcomes)
          ? response.outcomes
          : typeof response.outcomes === "string"
          ? JSON.parse(response.outcomes)
          : [],
      };
      return Response.json(transformedProgram);
    }

    // Otherwise, handle as JSON
    const data = await req.json();
    const backendData: any = {};
    if (data.title !== undefined) backendData.title = data.title;
    if (data.description !== undefined)
      backendData.description = data.description;
    if (data.icon !== undefined) backendData.icon = data.icon;
    if (data.image !== undefined) backendData.image = data.image || null;
    if (data.features !== undefined)
      backendData.features = Array.isArray(data.features) ? data.features : [];
    if (data.outcomes !== undefined)
      backendData.outcomes = Array.isArray(data.outcomes) ? data.outcomes : [];

    const response = await backendApiServer.put(
      `/api/training-consultancy/programs/${id}`,
      backendData,
      req
    );
    // Transform backend response to frontend format
    const transformedProgram = {
      id: String(response.id),
      title: response.title || "",
      description: response.description || "",
      image: response.image || "",
      features: Array.isArray(response.features)
        ? response.features
        : typeof response.features === "string"
        ? JSON.parse(response.features)
        : [],
      outcomes: Array.isArray(response.outcomes)
        ? response.outcomes
        : typeof response.outcomes === "string"
        ? JSON.parse(response.outcomes)
        : [],
    };
    return Response.json(transformedProgram);
  } catch (error: any) {
    console.error("[Training Consultancy Programs] PUT error:", error);
    return Response.json(
      { error: error.message || "Failed to update offering" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await backendApiServer.delete(
      `/api/training-consultancy/programs/${params.id}`,
      req
    );
    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Training Consultancy Programs] DELETE error:", error);
    return Response.json(
      { error: error.message || "Failed to delete offering" },
      { status: 400 }
    );
  }
}
